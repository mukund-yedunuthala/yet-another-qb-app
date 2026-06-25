import assert from 'node:assert/strict';
import { test } from 'node:test';

import { escHtml, showError, subjectStats } from './utils.js';

test('escHtml escapes html metacharacters and handles nullish values', () => {
  assert.equal(escHtml(null), '');
  assert.equal(escHtml(undefined), '');
  assert.equal(escHtml(`<img alt="x" onerror='bad'>&`), '&lt;img alt=&quot;x&quot; onerror=&#39;bad&#39;&gt;&amp;');
  assert.equal(escHtml(42), '42');
});

test('subjectStats totals and learnt counts per subject', () => {
  assert.deepEqual(subjectStats([
    { subject: 'Math', learnt: true },
    { subject: 'Math', learnt: false },
    { subject: 'Physics', learnt: true },
    { subject: 'Physics' },
  ]), {
    Math: { total: 2, learnt: 1 },
    Physics: { total: 2, learnt: 1 },
  });
});

test('showError replaces the existing alert and schedules removal', () => {
  const originalDocument = globalThis.document;
  const originalSetTimeout = globalThis.setTimeout;
  let removed = 0;
  let prepended;
  let timeoutMs;
  const existing = { remove: () => removed++ };
  const content = {
    querySelector: (selector) => selector === '.error-message' ? existing : null,
    prepend: (el) => { prepended = el; },
  };

  globalThis.document = {
    getElementById: (id) => id === 'app-content' ? content : null,
    createElement: (tag) => ({
      tag,
      attrs: {},
      setAttribute(name, value) {
        this.attrs[name] = value;
      },
      remove() {
        removed++;
      },
    }),
  };
  globalThis.setTimeout = (fn, ms) => {
    timeoutMs = ms;
    fn();
  };

  try {
    showError('Nope');
  } finally {
    globalThis.document = originalDocument;
    globalThis.setTimeout = originalSetTimeout;
  }

  assert.equal(removed, 2);
  assert.equal(timeoutMs, 5000);
  assert.equal(prepended.className, 'error-message');
  assert.equal(prepended.attrs.role, 'alert');
  assert.equal(prepended.textContent, 'Nope');
});
