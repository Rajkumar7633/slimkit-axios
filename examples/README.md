# Examples

These examples cover the supported `@slimkit/axios` API in focused, reusable files.

| Example | Purpose | Run |
| --- | --- | --- |
| [`basic/esm.mjs`](./basic/esm.mjs) | ES module requests and aliases | `node examples/basic/esm.mjs` |
| [`basic/commonjs.cjs`](./basic/commonjs.cjs) | CommonJS usage | `node examples/basic/commonjs.cjs` |
| [`basic/typescript.ts`](./basic/typescript.ts) | Typed requests and responses | `npm run typecheck` |
| [`node/server-and-client.mjs`](./node/server-and-client.mjs) | Self-contained Node server/client demo | `node examples/node/server-and-client.mjs` |
| [`browser/index.html`](./browser/index.html) | Browser requests and cancellation | Serve the repository and open the page |
| [`configuration/instances.mjs`](./configuration/instances.mjs) | Instances, defaults, headers, and auth | Import into an application |
| [`configuration/interceptors.mjs`](./configuration/interceptors.mjs) | Request and response interceptors | Import into an application |
| [`requests/forms.mjs`](./requests/forms.mjs) | JSON, URL-encoded, multipart, and file bodies | Import into an application |
| [`requests/cancellation.mjs`](./requests/cancellation.mjs) | AbortController, CancelToken, and timeout | Import into an application |
| [`requests/progress.mjs`](./requests/progress.mjs) | Upload and download progress | Import into an application |
| [`requests/errors.mjs`](./requests/errors.mjs) | Axios errors and status validation | Import into an application |
| [`requests/cache.mjs`](./requests/cache.mjs) | Request caching with LRU eviction | Import into an application |
| [`requests/cache.ts`](./requests/cache.ts) | Typed cache configuration with TypeScript | `npm run typecheck` |
| [`requests/circuit-breaker.mjs`](./requests/circuit-breaker.mjs) | Circuit breaker pattern for resilience | Import into an application |
| [`requests/circuit-breaker.ts`](./requests/circuit-breaker.ts) | Typed circuit breaker with TypeScript | `npm run typecheck` |
| [`requests/debounce-throttle.mjs`](./requests/debounce-throttle.mjs) | Request debouncing and throttling | Import into an application |
| [`requests/debounce-throttle.ts`](./requests/debounce-throttle.ts) | Typed debounce/throttle with TypeScript | `npm run typecheck` |
| [`advanced/custom-fetch.mjs`](./advanced/custom-fetch.mjs) | Custom fetch implementation | Import into an application |
| [`advanced/custom-adapter.mjs`](./advanced/custom-adapter.mjs) | Custom adapter | `node examples/advanced/custom-adapter.mjs` |

Examples that call `https://api.example.com` are templates. Replace that URL with the application's API URL before running them.
