package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"sync/atomic"
	"time"
)

const csp = "default-src 'self'; script-src 'self' cdn.jsdelivr.net unpkg.com 'unsafe-inline'; style-src 'self' cdn.jsdelivr.net; connect-src 'self' https://fra.cloud.appwrite.io; img-src 'self' data:; font-src 'self' cdn.jsdelivr.net; frame-ancestors 'none';"

var requestSeq uint64

func main() {
	level, levelOK := parseLogLevel(os.Getenv("LOG_LEVEL"))
	format, formatOK := parseLogFormat(os.Getenv("LOG_FORMAT"))
	logger := newLogger(os.Stdout, level, format)

	if !levelOK {
		logger.Warn("invalid LOG_LEVEL, using info", "value", os.Getenv("LOG_LEVEL"))
	}
	if !formatOK {
		logger.Warn("invalid LOG_FORMAT, using text", "value", os.Getenv("LOG_FORMAT"))
	}

	addr := ":8080"
	if port := os.Getenv("PORT"); port != "" {
		addr = ":" + port
	}

	root := os.Getenv("STATIC_DIR")
	if root == "" {
		root = "/app"
	}

	logger.Info("starting server", "addr", addr, "static_root", root, "log_level", level.String(), "log_format", format)
	logConfigSummary(logger)
	logger.Info("server listening", "addr", addr)

	if err := http.ListenAndServe(addr, requestLogger(logger, headers(app(root, logger)))); err != nil {
		logger.Error("server stopped", "error", err)
		os.Exit(1)
	}
}

func parseLogLevel(value string) (slog.Level, bool) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", "info":
		return slog.LevelInfo, true
	case "debug":
		return slog.LevelDebug, true
	case "warn":
		return slog.LevelWarn, true
	case "error":
		return slog.LevelError, true
	default:
		return slog.LevelInfo, false
	}
}

func parseLogFormat(value string) (string, bool) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", "text":
		return "text", true
	case "json":
		return "json", true
	default:
		return "text", false
	}
}

func newLogger(out io.Writer, level slog.Level, format string) *slog.Logger {
	opts := &slog.HandlerOptions{Level: level}
	if format == "json" {
		return slog.New(slog.NewJSONHandler(out, opts))
	}
	return slog.New(slog.NewTextHandler(out, opts))
}

func logConfigSummary(logger *slog.Logger) {
	attrs := []any{}
	for _, name := range configNames {
		attrs = append(attrs, strings.ToLower(name)+"_set", env(name) != "")
	}
	logger.Info("loaded config", attrs...)

	for _, name := range configNames {
		if env(name) == "" {
			logger.Warn("missing Appwrite config", "name", name)
		}
	}
}

func headers(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		next.ServeHTTP(w, r)
	})
}

func app(root string, logger *slog.Logger) http.Handler {
	files := http.FileServer(http.Dir(root))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/js/config.js" {
			logger.Debug("serving dynamic config")
			config(w)
			return
		}

		if r.URL.Path == "/" {
			http.ServeFile(w, r, filepath.Join(root, "index.html"))
			return
		}

		rel := path.Clean("/" + r.URL.Path)[1:]
		info, err := os.Stat(filepath.Join(root, rel))
		if err == nil && !info.IsDir() {
			files.ServeHTTP(w, r)
			return
		}

		if path.Ext(r.URL.Path) == "" {
			logger.Debug("serving SPA fallback", "path", r.URL.Path)
			http.ServeFile(w, r, filepath.Join(root, "index.html"))
			return
		}

		logger.Warn("static asset not found", "path", r.URL.Path)
		http.NotFound(w, r)
	})
}

var configNames = []string{
	"APPWRITE_ENDPOINT",
	"APPWRITE_PROJECT_ID",
	"APPWRITE_DATABASE_ID",
	"APPWRITE_TABLE_ID",
}

func config(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
	for _, name := range configNames {
		value, _ := json.Marshal(env(name))
		fmt.Fprintf(w, "export const PUBLIC_%s = %s;\n", name, value)
	}
}

func env(name string) string {
	if value := os.Getenv(name); value != "" {
		return value
	}
	return os.Getenv("PUBLIC_" + name)
}

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (w *statusWriter) WriteHeader(status int) {
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}

func requestLogger(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			requestID = strconv.FormatUint(atomic.AddUint64(&requestSeq, 1), 10)
		}
		w.Header().Set("X-Request-ID", requestID)

		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(sw, r.WithContext(context.WithValue(r.Context(), requestIDKey{}, requestID)))

		logger.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"status", sw.status,
			"duration_ms", time.Since(start).Milliseconds(),
			"remote_addr", r.RemoteAddr,
			"user_agent", r.UserAgent(),
			"request_id", requestID,
		)
	})
}

type requestIDKey struct{}
