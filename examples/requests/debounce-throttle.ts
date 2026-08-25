import axios, { DebounceConfig, ThrottleConfig } from '@slimkit/axios';

// TypeScript example with type-safe debouncing and throttling
const debounceConfig: DebounceConfig = {
  enabled: true,
  delay: 300,
  trailing: true,
  leading: false,
  maxWait: 2000,
  keyGenerator: (config: any) => `${config.method}:${config.url}`
};

const throttleConfig: ThrottleConfig = {
  enabled: true,
  delay: 1000,
  leading: true,
  trailing: false,
  keyGenerator: (config: any) => config.url
};

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

interface StatusUpdate {
  status: string;
  timestamp: number;
}

// Debounced search API
const searchApi = axios.create({
  baseURL: 'https://api.example.com',
  debounce: debounceConfig
});

async function search(query: string): Promise<SearchResult[]> {
  try {
    const response = await searchApi.get<SearchResult[]>('/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

// Throttled status API
const statusApi = axios.create({
  baseURL: 'https://api.example.com',
  throttle: throttleConfig
});

async function updateStatus(status: string): Promise<StatusUpdate> {
  try {
    const response = await statusApi.post<StatusUpdate>('/status', { status });
    return response.data;
  } catch (error) {
    console.error('Status update failed:', error);
    throw error;
  }
}

// Advanced debouncing with TypeScript
class DebouncedSearch {
  private api: ReturnType<typeof axios.create>;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      debounce: {
        enabled: true,
        delay: 300,
        trailing: true,
        leading: false,
        maxWait: 2000,
        keyGenerator: (config: any) => {
          return `search:${config.params?.q || 'default'}`;
        }
      }
    });
  }

  async search(query: string): Promise<SearchResult[]> {
    try {
      const response = await this.api.get<SearchResult[]>('/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  clearPending(): void {
    const manager = this.api.getDebounceManager();
    manager.clear();
  }

  async flushPending(): Promise<void> {
    const manager = this.api.getDebounceManager();
    await manager.flush();
  }

  getPendingCount(): number {
    return this.api.getDebounceManager().getPendingCount();
  }
}

// Usage
const debouncedSearch = new DebouncedSearch('https://api.example.com');
const results = await debouncedSearch.search('typescript');
console.log('Search results:', results);

// Advanced throttling with TypeScript
class RateLimitedClient {
  private api: ReturnType<typeof axios.create>;

  constructor(baseURL: string, requestsPerSecond: number = 10) {
    this.api = axios.create({
      baseURL,
      throttle: {
        enabled: true,
        delay: 1000 / requestsPerSecond,
        leading: true,
        trailing: false,
        keyGenerator: (config: any) => {
          return `${config.method}:${config.url}`;
        }
      }
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.api.get<T>(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    return response.data;
  }

  getPendingCount(): number {
    return this.api.getThrottleManager().getPendingCount();
  }

  clearPending(endpoint?: string): void {
    const manager = this.api.getThrottleManager();
    manager.clear(endpoint);
  }

  async flushPending(endpoint?: string): Promise<void> {
    const manager = this.api.getThrottleManager();
    await manager.flush(endpoint);
  }
}

// Usage
const rateLimitedClient = new RateLimitedClient('https://api.example.com', 5);

interface UserData {
  id: number;
  name: string;
  email: string;
}

const userData = await rateLimitedClient.get<UserData>('/user/1');
console.log('User data:', userData);

// Combined debouncing and throttling
const api = axios.create({
  baseURL: 'https://api.example.com',
  debounce: {
    enabled: true,
    delay: 300,
    trailing: true,
    leading: false
  },
  throttle: {
    enabled: true,
    delay: 1000,
    leading: true,
    trailing: false
  }
});

// Request-level configuration
interface ApiConfig {
  debounce?: DebounceConfig;
  throttle?: ThrottleConfig;
}

async function makeRequest<T>(endpoint: string, config?: ApiConfig): Promise<T> {
  const response = await api.get<T>(endpoint, config);
  return response.data;
}

// Usage with request-level debouncing
const searchResults = await makeRequest<SearchResult[]>('/search', {
  debounce: {
    enabled: true,
    delay: 500,
    trailing: true
  }
});

// Usage with request-level throttling
const statusData = await makeRequest<StatusUpdate>('/status', {
  throttle: {
    enabled: true,
    delay: 2000,
    leading: true
  }
});

// Custom key generator with TypeScript
interface UserContext {
  userId: string;
  sessionId: string;
}

const apiWithContext = axios.create({
  baseURL: 'https://api.example.com',
  debounce: {
    enabled: true,
    delay: 500,
    keyGenerator: (config: any) => {
      const context: UserContext = config.context || {};
      return `${config.method}:${config.url}:user:${context.userId}`;
    }
  },
  throttle: {
    enabled: true,
    delay: 1000,
    keyGenerator: (config: any) => {
      const context: UserContext = config.context || {};
      return `${config.method}:${config.url}:session:${context.sessionId}`;
    }
  }
});

// Usage with context
const userSpecificData = await apiWithContext.get('/notifications', {
  context: { userId: 'user123', sessionId: 'session456' }
});

// Type-safe configuration management
class ConfigurableAPI {
  private api: ReturnType<typeof axios.create>;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      debounce: {
        enabled: true,
        delay: 300,
        trailing: true,
        leading: false
      },
      throttle: {
        enabled: true,
        delay: 1000,
        leading: true,
        trailing: false
      }
    });
  }

  setDebounceConfig(config: Partial<DebounceConfig>): void {
    this.api.setDebounceConfig(config);
  }

  setThrottleConfig(config: Partial<ThrottleConfig>): void {
    this.api.setThrottleConfig(config);
  }

  getDebounceConfig(): DebounceConfig {
    return this.api.getDebounceConfig();
  }

  getThrottleConfig(): ThrottleConfig {
    return this.api.getThrottleConfig();
  }

  async request<T>(endpoint: string): Promise<T> {
    const response = await this.api.get<T>(endpoint);
    return response.data;
  }
}

// Usage
const configurableAPI = new ConfigurableAPI('https://api.example.com');

// Update debounce configuration
configurableAPI.setDebounceConfig({
  delay: 500,
  maxWait: 3000
});

// Update throttle configuration
configurableAPI.setThrottleConfig({
  delay: 2000,
  leading: false
});

const data = await configurableAPI.request<any>('/data');
console.log('Data:', data);