export type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'query' | 'QUERY';
export type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | 'formdata';
export type AxiosHeaderValue = AxiosHeaders | string | string[] | number | boolean | null;
export type AxiosHeaderParameters = Record<string, string>;
export interface RawAxiosHeaders { [key: string]: AxiosHeaderValue; }
export type RawAxiosRequestHeaders = Record<string, unknown>;
export type RawAxiosResponseHeaders = Record<string, string | string[]>;
export type AxiosRequestHeaders = RawAxiosRequestHeaders & AxiosHeaders;
export type AxiosResponseHeaders = RawAxiosResponseHeaders & AxiosHeaders;
export interface GenericAbortSignal { readonly aborted: boolean; onabort?: ((...args: any[]) => any) | null; addEventListener?: (...args: any[]) => any; removeEventListener?: (...args: any[]) => any; }
export interface AxiosBasicCredentials { username: string; password: string; }
export interface AxiosProxyConfig { host: string; port: number; auth?: { username: string; password: string }; protocol?: string; }
export interface GenericFormData { append(name: string, value: any, options?: any): any; }
export interface GenericHTMLFormElement { name: string; method: string; submit(): void; }
export interface FormDataVisitorHelpers {
  defaultVisitor(value: any, key: string, path?: string[]): boolean;
  convertValue(value: any): any;
  isVisitable(value: any): boolean;
}
export type SerializerVisitor = (this: GenericFormData, value: any, key: string, path: string[] | undefined, helpers: FormDataVisitorHelpers) => boolean | void;
export interface SerializerOptions { visitor?: SerializerVisitor; dots?: boolean; metaTokens?: boolean; indexes?: boolean | null; maxDepth?: number; Blob?: new (...args: any[]) => any; }
export interface FormSerializerOptions extends SerializerOptions { }
export type AddressFamily = 4 | 6 | undefined;
export interface LookupAddressEntry { address: string; family?: AddressFamily; }
export type LookupAddress = string | LookupAddressEntry;

export class AxiosHeaders {
  constructor(headers?: RawAxiosRequestHeaders | AxiosHeaders | Headers | string);
  set(name: string | object, value?: unknown, rewrite?: boolean | ((value: string, name: string, headers: AxiosHeaders) => boolean)): this;
  get(name: string, parser?: boolean | RegExp | ((value: string, name: string) => unknown)): any;
  has(name: string, matcher?: string | RegExp | ((value: string, name: string, headers: AxiosHeaders) => boolean)): boolean;
  delete(name: string | string[], matcher?: string | RegExp | ((value: string, name: string, headers: AxiosHeaders) => boolean)): boolean;
  clear(matcher?: string | RegExp | ((value: string, name: string, headers: AxiosHeaders) => boolean)): boolean;
  normalize(format?: boolean): this;
  concat(...targets: Array<RawAxiosRequestHeaders | AxiosHeaders>): AxiosHeaders;
  toJSON(asStrings?: boolean): Record<string, string | string[]>;
  toString(): string;
  getSetCookie(): string[];
  static from(value?: RawAxiosRequestHeaders | AxiosHeaders | Headers | string): AxiosHeaders;
  static concat(...targets: Array<RawAxiosRequestHeaders | AxiosHeaders>): AxiosHeaders;
}
export interface AxiosProgressEvent { loaded: number; total?: number; progress?: number; bytes: number; rate?: number; estimated?: number; upload?: boolean; download?: boolean; lengthComputable: boolean; event?: any; }
export interface TransitionalOptions { silentJSONParsing?: boolean; forcedJSONParsing?: boolean; clarifyTimeoutError?: boolean; legacyInterceptorReqResOrdering?: boolean; advertiseZstdAcceptEncoding?: boolean; validateStatusUndefinedResolves?: boolean; }
export interface DebounceConfig {
  enabled?: boolean;
  delay?: number; // Delay in milliseconds
  leading?: boolean; // Execute on leading edge
  trailing?: boolean; // Execute on trailing edge
  maxWait?: number; // Maximum wait time before execution
  keyGenerator?: (config: any) => string; // Custom key generator for grouping requests
}
export interface ThrottleConfig {
  enabled?: boolean;
  delay?: number; // Delay in milliseconds between executions
  leading?: boolean; // Execute on leading edge
  trailing?: boolean; // Execute on trailing edge
  keyGenerator?: (config: any) => string; // Custom key generator for grouping requests
}
export interface CircuitBreakerConfig {
  enabled?: boolean;
  failureThreshold?: number; // Number of failures before opening circuit
  recoveryTimeout?: number; // Time in milliseconds before attempting recovery
  timeout?: number; // Individual request timeout in milliseconds
  resetTimeout?: number; // Time in half-open state before closing circuit
  successThreshold?: number; // Number of successes required to close circuit
  onStateChange?: (state: 'closed' | 'open' | 'half-open', context: any) => void; // Callback when state changes
  onFallback?: (error: any, context: any) => any; // Fallback response when circuit is open
  rollingCountTimeout?: number; // Time window for counting failures
  rollingCountBuckets?: number; // Number of time buckets for rolling count
}
export interface CacheConfig {
  enabled?: boolean;
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of cached entries
  cacheByDefault?: boolean; // Cache all GET requests by default
  cachePredicate?: (config: any) => boolean; // Custom function to determine if request should be cached
  keyGenerator?: (config: any) => string; // Custom cache key generator
  onCacheHit?: (config: any, cachedResponse: any) => void; // Callback when cache is hit
  onCacheMiss?: (config: any) => void; // Callback when cache is missed
  onCacheWrite?: (config: any, response: any) => void; // Callback when response is cached
  onCacheEvict?: (key: string, value: any) => void; // Callback when entry is evicted
}
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  headers: any;
  status: number;
  statusText: string;
}
export interface ParamsSerializerOptions extends SerializerOptions { encode?: (param: string) => string; serialize?: (params: Record<string, unknown>, options?: ParamsSerializerOptions) => string; }
export interface AxiosRequestConfig<D = any> {
  url?: string; method?: Method | string; baseURL?: string; allowAbsoluteUrls?: boolean; headers?: (RawAxiosRequestHeaders & Partial<HeadersDefaults>) | AxiosHeaders;
  params?: any; paramsSerializer?: ParamsSerializerOptions | ((params: any) => string); data?: D; timeout?: number; timeoutErrorMessage?: string; withCredentials?: boolean; credentials?: RequestCredentials;
  auth?: AxiosBasicCredentials; responseType?: ResponseType; responseEncoding?: string; signal?: GenericAbortSignal; cancelToken?: CancelToken;
  transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[]; transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
  adapter?: AxiosAdapter | AxiosAdapter[] | 'fetch' | Array<'fetch' | AxiosAdapter>; validateStatus?: ((status: number) => boolean) | null;
  onUploadProgress?: (event: AxiosProgressEvent) => void; onDownloadProgress?: (event: AxiosProgressEvent) => void;
  maxContentLength?: number; maxBodyLength?: number; maxRedirects?: number; maxRate?: number | [number, number]; transitional?: TransitionalOptions; fetchOptions?: RequestInit;
  xsrfCookieName?: string; xsrfHeaderName?: string; withXSRFToken?: boolean | ((config: InternalAxiosRequestConfig) => boolean | undefined);
  formSerializer?: FormSerializerOptions; env?: { FormData?: new (...args: any[]) => object; Blob?: new (...args: any[]) => object; fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> };
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>; parseReviver?: (this: any, key: string, value: any, context?: { source?: string }) => any;
  proxy?: AxiosProxyConfig | false; httpAgent?: any; httpsAgent?: any; socketPath?: string | null; allowedSocketPaths?: string | string[] | null; decompress?: boolean;
  insecureHTTPParser?: boolean; beforeRedirect?: Function; transport?: any; family?: AddressFamily; lookup?: Function;
  httpVersion?: 1 | 2; http2Options?: Record<string, any>; formDataHeaderPolicy?: 'legacy' | 'content-only'; redact?: string[]; sensitiveHeaders?: string[];
  retry?: RetryConfig;
  cache?: CacheConfig;
  circuitBreaker?: CircuitBreakerConfig;
  debounce?: DebounceConfig;
  throttle?: ThrottleConfig;
}
export type RawAxiosRequestConfig<D = any> = AxiosRequestConfig<D>;
export interface HeadersDefaults {
  common: RawAxiosRequestHeaders; delete: RawAxiosRequestHeaders; get: RawAxiosRequestHeaders; head: RawAxiosRequestHeaders;
  post: RawAxiosRequestHeaders; put: RawAxiosRequestHeaders; patch: RawAxiosRequestHeaders; query?: RawAxiosRequestHeaders; options?: RawAxiosRequestHeaders;
}
export interface CreateAxiosDefaults<D = any> extends Omit<AxiosRequestConfig<D>, 'headers'> { headers?: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults>; }
export interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> { headers: AxiosHeaders; method: string; }
export interface AxiosResponse<T = any, D = any> { data: T; status: number; statusText: string; headers: AxiosHeaders; config: InternalAxiosRequestConfig<D>; request?: Request; }
export type AxiosPromise<T = any> = Promise<AxiosResponse<T>>;
export type AxiosRequestTransformer = (this: AxiosRequestConfig, data: any, headers: AxiosHeaders) => any;
export type AxiosResponseTransformer = (this: AxiosRequestConfig, data: any, headers: AxiosHeaders, status?: number) => any;
export type AxiosAdapter = (config: InternalAxiosRequestConfig) => AxiosPromise;
export class AxiosError<T = unknown, D = any> extends Error {
  constructor(message?: string, code?: string, config?: AxiosRequestConfig<D>, request?: Request, response?: AxiosResponse<T, D>);
  code?: string; config?: AxiosRequestConfig<D>; request?: Request; response?: AxiosResponse<T, D>; status?: number; cause?: Error;
  toJSON(): object;
  static from<T = unknown, D = any>(error: Error, code?: string, config?: AxiosRequestConfig<D>, request?: Request, response?: AxiosResponse<T, D>, customProps?: object): AxiosError<T, D>;
  static readonly ERR_BAD_OPTION_VALUE: string; static readonly ERR_BAD_OPTION: string; static readonly ECONNABORTED: string; static readonly ECONNREFUSED: string; static readonly ETIMEDOUT: string;
  static readonly ERR_NETWORK: string; static readonly ERR_BAD_RESPONSE: string; static readonly ERR_BAD_REQUEST: string; static readonly ERR_CANCELED: string; static readonly ERR_NOT_SUPPORT: string;
  static readonly ERR_INVALID_URL: string; static readonly ERR_FORM_DATA_DEPTH_EXCEEDED: string;
}
export class CanceledError<T = unknown> extends AxiosError<T> { readonly __CANCEL__: boolean; }
export { CanceledError as Cancel };
export class CancelToken {
  constructor(executor: (cancel: Canceler) => void); promise: Promise<CanceledError>; reason?: CanceledError;
  throwIfRequested(): void; subscribe(listener: (cancel: CanceledError) => void): void; unsubscribe(listener: (cancel: CanceledError) => void): void; toAbortSignal(): AbortSignal;
  static source(): CancelTokenSource;
}
export interface Canceler { (message?: string): void; }
export interface CancelTokenSource { token: CancelToken; cancel: Canceler; }
export interface AxiosInterceptorOptions { synchronous?: boolean; runWhen?: (config: InternalAxiosRequestConfig) => boolean; }
export class InterceptorManager<V> { use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: any) => any, options?: AxiosInterceptorOptions): number; eject(id: number): void; clear(): void; }
export type AxiosInterceptorManager<V> = InterceptorManager<V>;
export class Axios {
  constructor(config?: AxiosRequestConfig); defaults: AxiosDefaults; interceptors: { request: InterceptorManager<InternalAxiosRequestConfig>; response: InterceptorManager<AxiosResponse> };
  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  request<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  _request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  _request<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  getUri(config?: AxiosRequestConfig): string;
  clearCache(): void;
  getCache(): CacheManager;
  setCacheConfig(config: CacheConfig): void;
  getCacheConfig(): CacheConfig;
  cleanupCache(): void;
  getCircuitBreaker(): CircuitBreaker;
  setCircuitBreakerConfig(config: CircuitBreakerConfig): void;
  getCircuitBreakerConfig(): CircuitBreakerConfig;
  resetCircuitBreaker(): void;
  getDebounceManager(): DebounceManager;
  setDebounceConfig(config: DebounceConfig): void;
  getDebounceConfig(): DebounceConfig;
  getThrottleManager(): ThrottleManager;
  setThrottleConfig(config: ThrottleConfig): void;
  getThrottleConfig(): ThrottleConfig;
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  query<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
}
export interface AxiosDefaults<D = any> extends Omit<AxiosRequestConfig<D>, 'headers'> { headers: HeadersDefaults; }
export interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  create(config?: CreateAxiosDefaults): AxiosInstance;
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  query<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  postForm<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  putForm<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
  patchForm<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
}
export class AxiosURLSearchParams { constructor(params?: object, options?: ParamsSerializerOptions); append(name: string, value: any): void; toString(encoder?: (value: string) => string): string; }
export class CacheManager<T = any> {
  constructor(config?: CacheConfig);
  get(key: string): CacheEntry<T> | null;
  set(key: string, value: CacheEntry<T>): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  size(): number;
  keys(): string[];
  values(): CacheEntry<T>[];
  entries(): Array<[string, CacheEntry<T>]>;
  cleanup(): void; // Remove expired entries
  setConfig(config: CacheConfig): void;
  getConfig(): CacheConfig;
}
export class CircuitBreaker {
  constructor(config?: CircuitBreakerConfig);
  execute<T>(fn: () => Promise<T>, context?: any): Promise<T>;
  getState(): 'closed' | 'open' | 'half-open';
  reset(): void;
  getStats(): { state: string; failureCount: number; successCount: number; lastFailureTime: number };
  setConfig(config: CircuitBreakerConfig): void;
  getConfig(): CircuitBreakerConfig;
}
export class DebounceManager {
  constructor(config?: DebounceConfig);
  execute<T>(key: string, fn: () => Promise<T>): Promise<T>;
  clear(key?: string): void;
  flush(key?: string): Promise<void>;
  getPendingCount(): number;
  setConfig(config: DebounceConfig): void;
  getConfig(): DebounceConfig;
}
export class ThrottleManager {
  constructor(config?: ThrottleConfig);
  execute<T>(key: string, fn: () => Promise<T>): Promise<T>;
  clear(key?: string): void;
  flush(key?: string): Promise<void>;
  getPendingCount(): number;
  setConfig(config: ThrottleConfig): void;
  getConfig(): ThrottleConfig;
}
export const VERSION: string;
export const HttpStatusCode: Readonly<Record<string, number>>;
export function isCancel(value: any): value is CanceledError;
export function isAxiosError<T = any, D = any>(payload: any): payload is AxiosError<T, D>;
export function all<T>(values: Array<T | Promise<T>>): Promise<T[]>;
export function spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
export function toFormData(source: object, target?: GenericFormData, options?: FormSerializerOptions): GenericFormData;
export function formToJSON(form: GenericFormData | GenericHTMLFormElement): object;
export function getAdapter(adapters?: AxiosRequestConfig['adapter']): AxiosAdapter;
export function mergeConfig(config1?: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig;
export function create(config?: CreateAxiosDefaults): AxiosInstance;
export interface AxiosStatic extends AxiosInstance {
  Axios: typeof Axios; AxiosError: typeof AxiosError; CanceledError: typeof CanceledError; Cancel: typeof CanceledError; CancelToken: typeof CancelToken;
  AxiosHeaders: typeof AxiosHeaders; AxiosURLSearchParams: typeof AxiosURLSearchParams; HttpStatusCode: typeof HttpStatusCode; readonly VERSION: string;
  isCancel: typeof isCancel; isAxiosError: typeof isAxiosError; all: typeof all; spread: typeof spread; toFormData: typeof toFormData;
  formToJSON: typeof formToJSON; getAdapter: typeof getAdapter; mergeConfig: typeof mergeConfig; CacheConfig: CacheConfig; CacheManager: typeof CacheManager; CacheEntry: typeof CacheEntry;
  CircuitBreakerConfig: CircuitBreakerConfig; CircuitBreaker: typeof CircuitBreaker;
  DebounceConfig: DebounceConfig; DebounceManager: typeof DebounceManager;
  ThrottleConfig: ThrottleConfig; ThrottleManager: typeof ThrottleManager;
}
declare const axios: AxiosStatic;
export default axios;
