import axios from '@slimkit/axios';

// Basic debouncing for search requests
const searchApi = axios.create({
  baseURL: 'https://api.example.com',
  debounce: {
    enabled: true,
    delay: 300, // Wait 300ms after last keystroke
    trailing: true, // Execute after delay
    leading: false, // Don't execute immediately
    keyGenerator: (config) => {
      // Group requests by URL + method
      return `${config.method}:${config.url}`;
    }
  }
});

// Usage with search input
async function handleSearch(query) {
  try {
    const response = await searchApi.get('/search', {
      params: { q: query }
    });
    console.log('Search results:', response.data);
  } catch (error) {
    console.error('Search failed:', error);
  }
}

// Multiple rapid calls will be debounced
handleSearch('javascript');
handleSearch('javascript debouncing');
handleSearch('javascript debouncing axios');
// Only the last call will actually execute after 300ms

// Basic throttling for status updates
const statusApi = axios.create({
  baseURL: 'https://api.example.com',
  throttle: {
    enabled: true,
    delay: 1000, // At most 1 request per second
    leading: true, // Execute immediately on first call
    trailing: false, // Don't execute on trailing edge
    keyGenerator: (config) => {
      return `${config.method}:${config.url}`;
    }
  }
});

// Usage with frequent status updates
async function updateStatus(status) {
  try {
    const response = await statusApi.post('/status', { status });
    console.log('Status updated:', response.data);
  } catch (error) {
    console.error('Status update failed:', error);
  }
}

// Rapid status updates will be throttled
updateStatus('typing...');
updateStatus('typing still...');
updateStatus('typing complete');
// Only first call executes immediately, then at most 1 per second

// Advanced debouncing with max wait
const autocompleteApi = axios.create({
  baseURL: 'https://api.example.com',
  debounce: {
    enabled: true,
    delay: 500,
    trailing: true,
    leading: false,
    maxWait: 2000, // Maximum wait of 2 seconds
    keyGenerator: (config) => config.url
  }
});

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

// Request-level debouncing
const response = await axios.get('/endpoint', {
  debounce: {
    enabled: true,
    delay: 500,
    trailing: true
  }
});

// Request-level throttling
const response2 = await axios.post('/endpoint', { data }, {
  throttle: {
    enabled: true,
    delay: 2000,
    leading: true
  }
});

// Debounce management
const debounceManager = api.getDebounceManager();
console.log('Pending debounce requests:', debounceManager.getPendingCount());

// Clear specific debounce
debounceManager.clear('get:/search');

// Clear all debounces
debounceManager.clear();

// Flush pending debounces
await debounceManager.flush('get:/search');

// Throttle management
const throttleManager = api.getThrottleManager();
console.log('Pending throttle requests:', throttleManager.getPendingCount());

// Clear specific throttle
throttleManager.clear('post:/status');

// Clear all throttles
throttleManager.clear();

// Flush pending throttles
await throttleManager.flush('post:/status');

// Real-time search with debouncing
class SearchComponent {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.example.com',
      debounce: {
        enabled: true,
        delay: 300,
        trailing: true,
        leading: false,
        keyGenerator: (config) => `search:${config.params.q}`
      }
    });
  }
  
  async search(query) {
    try {
      const response = await this.api.get('/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      return { results: [] };
    }
  }
  
  clearPendingSearches() {
    const manager = this.api.getDebounceManager();
    // Clear all search-related debounces
    manager.clear();
  }
}

// Usage
const searchComponent = new SearchComponent();
const results = await searchComponent.search('javascript');

// Rate-limited API with throttling
class RateLimitedAPI {
  constructor(baseURL, requestsPerSecond = 10) {
    this.api = axios.create({
      baseURL,
      throttle: {
        enabled: true,
        delay: 1000 / requestsPerSecond,
        leading: true,
        trailing: false,
        keyGenerator: (config) => config.url
      }
    });
  }
  
  async get(endpoint) {
    return await this.api.get(endpoint);
  }
  
  async post(endpoint, data) {
    return await this.api.post(endpoint, data);
  }
  
  getPendingCount() {
    return this.api.getThrottleManager().getPendingCount();
  }
}

// Usage - respects rate limits automatically
const rateLimitedAPI = new RateLimitedAPI('https://api.example.com', 5); // 5 requests per second

for (let i = 0; i < 20; i++) {
  rateLimitedAPI.get(`/data/${i}`).then(response => {
    console.log(`Request ${i} completed:`, response.data);
  });
}

console.log('Pending requests:', rateLimitedAPI.getPendingCount());

// Debouncing with custom key generator
const apiWithCustomDebounce = axios.create({
  baseURL: 'https://api.example.com',
  debounce: {
    enabled: true,
    delay: 500,
    keyGenerator: (config) => {
      // Create unique key based on method, URL, and specific params
      const key = `${config.method}:${config.url}`;
      if (config.params && config.params.userId) {
        return `${key}:user:${config.params.userId}`;
      }
      return key;
    }
  }
});

// Different users won't interfere with each other's debouncing
await apiWithCustomDebounce.get('/user/profile', { params: { userId: 1 } });
await apiWithCustomDebounce.get('/user/profile', { params: { userId: 2 } });
// Both requests will execute independently

// Throttling per user
const apiWithUserThrottle = axios.create({
  baseURL: 'https://api.example.com',
  throttle: {
    enabled: true,
    delay: 1000,
    keyGenerator: (config) => {
      return `user:${config.headers['X-User-ID']}:${config.url}`;
    }
  }
});

// Different users have independent rate limits
await apiWithUserThrottle.get('/notifications', { 
  headers: { 'X-User-ID': 'user1' } 
});
await apiWithUserThrottle.get('/notifications', { 
  headers: { 'X-User-ID': 'user2' } 
});
// Both requests can execute simultaneously