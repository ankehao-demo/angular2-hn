// Polyfill globals needed by MSW v2 in jsdom environment.
// Must be set in proper order: text codecs first, then undici (which depends on them).
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream, TransformStream, WritableStream } = require('stream/web');
const { MessageChannel, MessagePort } = require('worker_threads');

// Set text codecs first — undici and its deps require these at import time
Object.assign(global, { TextEncoder, TextDecoder, ReadableStream, TransformStream, WritableStream, MessageChannel, MessagePort });

// Now it's safe to require undici
const undici = require('undici');

Object.assign(global, {
  fetch: undici.fetch,
  Request: undici.Request,
  Response: undici.Response,
  Headers: undici.Headers,
  FormData: undici.FormData,
  BroadcastChannel: globalThis.BroadcastChannel ?? class BroadcastChannel {
    name: string;
    constructor(name: string) { this.name = name; }
    postMessage() { /* noop */ }
    close() { /* noop */ }
    addEventListener() { /* noop */ }
    removeEventListener() { /* noop */ }
  },
  structuredClone: globalThis.structuredClone ?? ((val: unknown) => JSON.parse(JSON.stringify(val))),
});

// Mock window.matchMedia for jsdom (not implemented)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { /* noop */ },
    removeListener: () => { /* noop */ },
    addEventListener: () => { /* noop */ },
    removeEventListener: () => { /* noop */ },
    dispatchEvent: () => false,
  }),
});

// Mock window.scrollTo for jsdom
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => { /* noop */ },
});
