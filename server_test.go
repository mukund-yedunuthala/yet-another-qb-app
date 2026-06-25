package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestParseLogLevel(t *testing.T) {
	tests := map[string]struct {
		want slog.Level
		ok   bool
	}{
		"":      {slog.LevelInfo, true},
		"debug": {slog.LevelDebug, true},
		"info":  {slog.LevelInfo, true},
		"warn":  {slog.LevelWarn, true},
		"error": {slog.LevelError, true},
		"NOPE":  {slog.LevelInfo, false},
	}

	for input, tt := range tests {
		got, ok := parseLogLevel(input)
		if got != tt.want || ok != tt.ok {
			t.Fatalf("parseLogLevel(%q) = %v, %v; want %v, %v", input, got, ok, tt.want, tt.ok)
		}
	}
}

func TestParseLogFormat(t *testing.T) {
	tests := map[string]struct {
		want string
		ok   bool
	}{
		"":       {"text", true},
		"text":   {"text", true},
		"json":   {"json", true},
		"nope":   {"text", false},
		" JSON ": {"json", true},
	}

	for input, tt := range tests {
		got, ok := parseLogFormat(input)
		if got != tt.want || ok != tt.ok {
			t.Fatalf("parseLogFormat(%q) = %q, %v; want %q, %v", input, got, ok, tt.want, tt.ok)
		}
	}
}

func TestJSONLoggerAndLevelSuppression(t *testing.T) {
	var out bytes.Buffer
	logger := newLogger(&out, slog.LevelWarn, "json")

	logger.Info("hidden")
	logger.Warn("visible", "key", "value")

	lines := strings.Split(strings.TrimSpace(out.String()), "\n")
	if len(lines) != 1 {
		t.Fatalf("log lines = %d, want 1: %q", len(lines), out.String())
	}

	var record map[string]any
	if err := json.Unmarshal([]byte(lines[0]), &record); err != nil {
		t.Fatal(err)
	}
	if record["msg"] != "visible" || record["level"] != "WARN" || record["key"] != "value" {
		t.Fatalf("unexpected log record: %#v", record)
	}
}

func TestConfigEscapesValuesAndSupportsEnvFallback(t *testing.T) {
	root := t.TempDir()

	t.Setenv("APPWRITE_ENDPOINT", `https://example.com/"quoted"`)
	t.Setenv("PUBLIC_APPWRITE_PROJECT_ID", "public-project")

	res := request(app(root, discardLogger()), "/js/config.js")
	body := read(t, res)
	if !strings.Contains(body, `PUBLIC_APPWRITE_ENDPOINT = "https://example.com/\"quoted\""`) {
		t.Fatalf("config was not safely encoded: %s", body)
	}
	if !strings.Contains(body, `PUBLIC_APPWRITE_PROJECT_ID = "public-project"`) {
		t.Fatalf("PUBLIC_ fallback was not used: %s", body)
	}
	if got := res.Header.Get("Content-Type"); !strings.Contains(got, "application/javascript") {
		t.Fatalf("config content type = %q", got)
	}
}

func TestSecurityHeaders(t *testing.T) {
	res := request(headers(app(staticRoot(t), discardLogger())), "/")
	defer res.Body.Close()

	for name := range map[string]string{
		"Content-Security-Policy": "default-src 'self'",
		"X-Content-Type-Options":  "nosniff",
		"X-Frame-Options":         "DENY",
	} {
		if got := res.Header.Get(name); got == "" {
			t.Fatalf("missing %s header", name)
		}
	}
}

func TestSPAFallbackAndAsset404(t *testing.T) {
	res := request(app(staticRoot(t), discardLogger()), "/questions")
	body := read(t, res)
	if body != "app shell" {
		t.Fatalf("SPA fallback failed: %q", body)
	}

	res = request(app(staticRoot(t), discardLogger()), "/missing.js")
	defer res.Body.Close()
	if res.StatusCode != http.StatusNotFound {
		t.Fatalf("missing asset status = %d, want 404", res.StatusCode)
	}
}

func TestStaticAssetsAndTraversal(t *testing.T) {
	root := staticRoot(t)
	if err := os.WriteFile(filepath.Join(root, "app.js"), []byte("console.log('ok')"), 0o644); err != nil {
		t.Fatal(err)
	}
	outside := filepath.Join(filepath.Dir(root), "secret.txt")
	if err := os.WriteFile(outside, []byte("secret"), 0o644); err != nil {
		t.Fatal(err)
	}

	res := request(app(root, discardLogger()), "/app.js")
	body := read(t, res)
	if body != "console.log('ok')" {
		t.Fatalf("static asset body = %q", body)
	}

	res = request(app(root, discardLogger()), "/../secret.txt")
	defer res.Body.Close()
	if res.StatusCode != http.StatusNotFound {
		t.Fatalf("path traversal status = %d, want 404", res.StatusCode)
	}
}

func TestRequestLogger(t *testing.T) {
	var out bytes.Buffer
	logger := newLogger(&out, slog.LevelInfo, "json")
	handler := requestLogger(logger, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
	}))

	req := httptest.NewRequest(http.MethodPost, "/questions", nil)
	req.RemoteAddr = "192.0.2.1:1234"
	req.Header.Set("User-Agent", "test-agent")
	req.Header.Set("X-Request-ID", "req-1")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	if got := rec.Header().Get("X-Request-ID"); got != "req-1" {
		t.Fatalf("X-Request-ID = %q", got)
	}

	var record map[string]any
	if err := json.Unmarshal(bytes.TrimSpace(out.Bytes()), &record); err != nil {
		t.Fatal(err)
	}
	for _, key := range []string{"method", "path", "status", "duration_ms", "remote_addr", "user_agent", "request_id"} {
		if _, ok := record[key]; !ok {
			t.Fatalf("missing request log key %q in %#v", key, record)
		}
	}
	if record["method"] != "POST" || record["path"] != "/questions" || record["status"] != float64(http.StatusCreated) {
		t.Fatalf("unexpected request log: %#v", record)
	}
}

func request(handler http.Handler, target string) *http.Response {
	req := httptest.NewRequest(http.MethodGet, target, nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	return rec.Result()
}

func discardLogger() *slog.Logger {
	return newLogger(io.Discard, slog.LevelError, "text")
}

func staticRoot(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	if err := os.WriteFile(filepath.Join(root, "index.html"), []byte("app shell"), 0o644); err != nil {
		t.Fatal(err)
	}
	return root
}

func read(t *testing.T, res *http.Response) string {
	t.Helper()
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		t.Fatal(err)
	}
	return string(body)
}
