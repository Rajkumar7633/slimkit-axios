# @slimkit/axios

A zero-dependency Axios-compatible HTTP client built on the standard `fetch` API. It runs in modern browsers and Node.js 18+, supports CommonJS and ES modules, and includes TypeScript declarations.

```bash
npm install @slimkit/axios
```

```ts
import axios from '@slimkit/axios';

const api = axios.create({ baseURL: 'https://api.example.com' });
api.interceptors.request.use(config => {
  config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

const { data } = await api.get<User[]>('/users', { params: { active: true } });
```

## Important examples

### Basic requests

```js
import axios from '@slimkit/axios';

const users = await axios.get('https://api.example.com/users', {
  params: { active: true, roles: ['admin', 'editor'] }
});

const created = await axios.post('https://api.example.com/users', {
  name: 'Ada Lovelace',
  email: 'ada@example.com'
});

console.log(users.data, created.status);
```

CommonJS uses the same API:

```js
const axios = require('@slimkit/axios');
```

### Instances and interceptors

```js
const api = axios.create({
  baseURL: 'https://api.example.com/v1',
  timeout: 10_000,
  headers: { common: { Accept: 'application/json' } }
});

api.interceptors.request.use(config => {
  config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) logout();
    return Promise.reject(error);
  }
);
```

### Cancellation and timeout

```js
const controller = new AbortController();

const request = axios.get('/reports', {
  signal: controller.signal,
  timeout: 5000
});

controller.abort();

try {
  await request;
} catch (error) {
  if (axios.isCancel(error)) console.log('Request canceled');
}
```

### Forms and files

```js
await axios.postForm('/documents', {
  title: 'Report',
  tags: ['finance', 'monthly'],
  attachment: file
});

await axios.post('/settings', { theme: 'dark' }, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
```

### Progress

```js
await axios.post('/upload', payload, {
  onUploadProgress: ({ progress, rate }) => {
    console.log('upload', progress, rate);
  },
  onDownloadProgress: ({ progress, estimated }) => {
    console.log('download', progress, estimated);
  }
});
```

### Error handling

```js
try {
  await axios.get('/users/missing');
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error(error.code, error.status, error.response?.data);
  }
}
```

### Request caching

```js
// Basic caching with TTL
await axios.get('/users', {
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    cacheByDefault: true
  }
});

// Instance-level caching configuration
const api = axios.create({
  baseURL: 'https://api.example.com',
  cache: {
    enabled: true,
    ttl: 10 * 60 * 1000, // 10 minutes
    cachePredicate: (config) => config.method === 'get',
    onCacheHit: (config, cachedResponse) => {
      console.log('Cache hit for:', config.url);
    }
  }
});

// Cache management
api.clearCache(); // Clear all cache
api.cleanupCache(); // Remove expired entries
const cacheManager = api.getCache();
console.log('Cache size:', cacheManager.size());
```

### Circuit breaker pattern

```js
// Basic circuit breaker configuration
const api = axios.create({
  baseURL: 'https://api.example.com',
  circuitBreaker: {
    enabled: true,
    failureThreshold: 5,      // Open after 5 failures
    recoveryTimeout: 60000,   // Try recovery after 1 minute
    timeout: 30000,           // Individual request timeout
    successThreshold: 2,      // Successes required to close circuit
    onStateChange: (state, context) => {
      console.log(`Circuit breaker state: ${state}`);
    }
  }
});

// Circuit breaker with fallback
const resilientApi = axios.create({
  baseURL: 'https://api.example.com',
  circuitBreaker: {
    enabled: true,
    failureThreshold: 3,
    recoveryTimeout: 30000,
    onFallback: (error, context) => {
      console.log('Using fallback for:', context.url);
      return { data: { fallback: true }, status: 200 };
    }
  }
});

// Circuit breaker management
const stats = api.getCircuitBreaker().getStats();
console.log('Circuit breaker state:', stats.state);
api.resetCircuitBreaker(); // Manually reset circuit
```

### Request debouncing and throttling

```js
// Debouncing for search inputs
const searchApi = axios.create({
  baseURL: 'https://api.example.com',
  debounce: {
    enabled: true,
    delay: 300, // Wait 300ms after last keystroke
    trailing: true, // Execute after delay
    leading: false, // Don't execute immediately
    keyGenerator: (config) => `${config.method}:${config.url}`
  }
});

// Throttling for rate-limited APIs
const statusApi = axios.create({
  baseURL: 'https://api.example.com',
  throttle: {
    enabled: true,
    delay: 1000, // At most 1 request per second
    leading: true, // Execute immediately on first call
    trailing: false, // Don't execute on trailing edge
    keyGenerator: (config) => config.url
  }
});

// Combined debouncing and throttling
const api = axios.create({
  baseURL: 'https://api.example.com',
  debounce: {
    enabled: true,
    delay: 300,
    trailing: true
  },
  throttle: {
    enabled: true,
    delay: 1000,
    leading: true
  }
});

// Management methods
const debounceManager = api.getDebounceManager();
console.log('Pending debounces:', debounceManager.getPendingCount());
debounceManager.clear(); // Clear all pending debounces

const throttleManager = api.getThrottleManager();
console.log('Pending throttles:', throttleManager.getPendingCount());
throttleManager.clear(); // Clear all pending throttles
```

## Production features

SlimKit Axios includes several production-ready features that go beyond standard Axios:

- **Request caching**: LRU eviction with TTL support for performance optimization
- **Automatic retry**: Exponential backoff for transient failures
- **Circuit breaker**: Service resilience with automatic recovery
- **Request debouncing**: Prevent excessive API calls for user inputs
- **Request throttling**: Rate limiting for API protection

Each feature can be configured independently and combined as needed for your use case.

## Drop-in compatibility

The following APIs and behaviors are implemented as Axios-compatible replacements.

| Status | Functionality |
| --- | --- |
| ✅ | `axios(config)` and `axios(url, config)` |
| ✅ | `get`, `delete`, `head`, `options`, `post`, `put`, `patch`, and `query` |
| ✅ | `postForm`, `putForm`, and `patchForm` |
| ✅ | `axios.create()`, global defaults, instance defaults, and isolated instances |
| ✅ | Request and response interceptors |
| ✅ | Interceptor `use`, `eject`, `clear`, `synchronous`, and `runWhen` |
| ✅ | `baseURL`, URL joining, query parameters, and custom parameter serializers |
| ✅ | Common, method-specific, instance, and request header merging |
| ✅ | Case-insensitive headers and duplicate-header normalization |
| ✅ | `AxiosHeaders` methods, including `getSetCookie()` |
| ✅ | Automatic JSON serialization and parsing |
| ✅ | URL-encoded, nested-object, array, and multipart serialization, with `maxDepth` nesting-depth protection |
| ✅ | `FormData`, `URLSearchParams`, `Blob`, ArrayBuffer, typed-array, and stream bodies |
| ✅ | JSON, text, Blob, ArrayBuffer, FormData, and stream responses |
| ✅ | Request and response transforms |
| ✅ | Basic authentication and bearer-token headers |
| ✅ | `withCredentials`, fetch `credentials`, and browser XSRF protection |
| ✅ | `AbortController`, `CancelToken`, request cancellation, and timeouts |
| ✅ | HTTP status rejection and custom `validateStatus` |
| ✅ | Request and response size limits |
| ✅ | Upload body-consumption and download progress for supported fetch body types |
| ✅ | Progress totals, rates, and estimated completion time |
| ✅ | Normal fetch redirects and `maxRedirects: 0` manual redirect handling |
| ✅ | `AxiosError`, `CanceledError`, `Cancel`, `isAxiosError`, and `isCancel` |
| ✅ | `all`, `spread`, `toFormData`, `formToJSON`, `getUri`, and `mergeConfig` |
| ✅ | `Axios`, `AxiosHeaders`, `HttpStatusCode`, `VERSION`, and custom adapters |
| ✅ | Custom fetch implementation through `env.fetch` or `fetch` |
| ✅ | Promise and async/await APIs |
| ✅ | CommonJS, ES modules, and TypeScript generic request/response types |
| ✅ | Modern browser support using the browser's native fetch implementation |
| ✅ | Node.js 18+ support using the built-in fetch implementation |
| ✅ | Request caching with LRU eviction and TTL support |

## Not drop-in compatible

These Axios features depend on XMLHttpRequest or Node's low-level `http` and `https` modules. Native fetch does not expose the required controls, so they are not implemented.

| Status | Functionality |
| --- | --- |
| ❌ | Axios XMLHttpRequest adapter |
| ❌ | Axios Node `http` adapter |
| ❌ | Selecting `adapter: 'xhr'` or `adapter: 'http'` |
| ❌ | Unix domain sockets and `socketPath` |
| ❌ | Custom `httpAgent` or `httpsAgent` instances |
| ❌ | Keep-alive agent configuration |
| ❌ | Direct HTTP/1.1 or HTTP/2 protocol selection |
| ❌ | Axios `proxy` configuration |
| ❌ | `HTTP_PROXY`, `HTTPS_PROXY`, and `NO_PROXY` processing |
| ❌ | Proxy authorization management |
| ❌ | Low-level TLS, client certificates, and certificate validation options |
| ❌ | `insecureHTTPParser` |
| ❌ | Custom Node `transport` implementations |
| ❌ | `beforeRedirect` hooks |
| ❌ | Enforcing redirect counts greater than zero with `maxRedirects` |
| ❌ | Manual gzip, deflate, or Brotli decompression controls |
| ❌ | Axios `decompress` behavior and raw compressed response bodies |
| ❌ | Upload and download bandwidth throttling |
| ❌ | Socket-level or server-acknowledged upload progress like XMLHttpRequest can expose |
| ❌ | Browser `Document` responses when `DOMParser` is unavailable |

Options associated with unsupported transports may exist in the TypeScript request configuration for source compatibility, but they do not change native fetch behavior. Use a custom adapter when an application requires low-level networking controls.

`onUploadProgress` is driven by incremental consumption of the request body by fetch. It does not prove that the remote server has received or processed those bytes. Known in-memory bodies are split into 64 KiB chunks; platform-generated bodies such as `FormData` follow the chunking exposed by the fetch implementation.

Streaming request bodies require engine support for `ReadableStream` fetch bodies (the `duplex: 'half'` option). Firefox does not implement this: the library detects that at request time and transparently falls back to sending the full body without incremental progress, so `onUploadProgress` will not fire there even though the request itself completes normally. Chromium and WebKit both support streaming upload bodies and report incremental progress.

See [`task.md`](./task.md) for the itemized implementation and verification checklist.

## Compatibility tests

Axios is installed as a development-only dependency and used as the behavioral reference. It is not included as a runtime dependency or in the published package.

```bash
# Run every runtime test
npm test

# Run focused implementation tests
npm run test:unit

# Run differential and fetch-adapter tests against Axios
npm run test:compat

# Compile the TypeScript consumer fixture
npm run typecheck

# Install and smoke-test the actual npm-packed artifact (CJS require, ESM import, and a real request)
npm run test:pack

# Run the compatibility suite against real Chromium, Firefox, and WebKit via Playwright
npm run test:browser

# Regenerate src/index.mjs from src/index.cjs (or --check to verify it's already in sync)
npm run build:esm
npm run verify:esm
```

The compatibility suite runs matching cases through Axios and `@slimkit/axios` for callable requests, aliases, URL construction, serializers, defaults, header precedence, interceptors, transforms, cancellation, errors, helpers, forms, and instance isolation. Network-level parity tests cover request construction, authentication, response fields, HTTP errors, status validation, binary and streaming responses, download progress, timeouts, and aborts.
