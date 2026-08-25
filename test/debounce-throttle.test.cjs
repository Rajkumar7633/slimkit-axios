const test = require('node:test');
const assert = require('assert');
const axios = require('../src/index.cjs');

test('DebounceManager - basic debouncing', async () => {
  const debounceManager = new axios.DebounceManager({
    enabled: true,
    delay: 50,
    trailing: true,
    leading: false
  });
  
  let executionCount = 0;
  const fn = async () => {
    executionCount++;
    return { count: executionCount };
  };
  
  // Execute multiple times rapidly
  const promise1 = debounceManager.execute('test', fn);
  const promise2 = debounceManager.execute('test', fn);
  const promise3 = debounceManager.execute('test', fn);
  
  const result1 = await promise1;
  const result2 = await promise2;
  const result3 = await promise3;
  
  // Should execute only once due to debouncing
  assert.equal(executionCount, 1);
  assert.equal(result1.count, 1);
  assert.equal(result2.count, 1);
  assert.equal(result3.count, 1);
  
  debounceManager.clear();
});

test('DebounceManager - leading edge execution', async () => {
  const debounceManager = new axios.DebounceManager({
    enabled: true,
    delay: 50,
    trailing: false,
    leading: true
  });
  
  let executionCount = 0;
  const fn = async () => {
    executionCount++;
    return { count: executionCount };
  };
  
  const result1 = await debounceManager.execute('test', fn);
  assert.equal(executionCount, 1);
  assert.equal(result1.count, 1);
  
  debounceManager.clear();
});

test('DebounceManager - different keys', async () => {
  const debounceManager = new axios.DebounceManager({
    enabled: true,
    delay: 50,
    trailing: true,
    leading: false
  });
  
  let executionCount = 0;
  const fn = async () => {
    executionCount++;
    return { count: executionCount };
  };
  
  // Execute with different keys
  const promise1 = debounceManager.execute('key1', fn);
  const promise2 = debounceManager.execute('key2', fn);
  
  await Promise.all([promise1, promise2]);
  
  // Should execute twice due to different keys
  assert.equal(executionCount, 2);
  
  debounceManager.clear();
});

test('DebounceManager - disabled state', async () => {
  const debounceManager = new axios.DebounceManager({
    enabled: false
  });
  
  let executionCount = 0;
  const fn = async () => {
    executionCount++;
    return { count: executionCount };
  };
  
  // Execute multiple times
  await debounceManager.execute('test', fn);
  await debounceManager.execute('test', fn);
  await debounceManager.execute('test', fn);
  
  // Should execute all times when disabled
  assert.equal(executionCount, 3);
});

test('ThrottleManager - basic throttling', async () => {
  const throttleManager = new axios.ThrottleManager({
    enabled: true,
    delay: 50,
    leading: true,
    trailing: false
  });
  
  let executionCount = 0;
  const fn = async () => {
    executionCount++;
    return { count: executionCount };
  };
  
  // Execute multiple times rapidly
  const result1 = await throttleManager.execute('test', fn);
  assert.equal(executionCount, 1);
  assert.equal(result1.count, 1);
  
  const result2 = await throttleManager.execute('test', fn);
  const result3 = await throttleManager.execute('test', fn);
  
  // Should not execute again yet
  assert.equal(executionCount, 1);
  
  throttleManager.clear();
});

test('ThrottleManager - different keys', async () => {
  const throttleManager = new axios.ThrottleManager({
    enabled: true,
    delay: 50,
    leading: true,
    trailing: false
  });
  
  let executionCount = 0;
  const fn = async () => {
    executionCount++;
    return { count: executionCount };
  };
  
  // Execute with different keys
  const result1 = await throttleManager.execute('key1', fn);
  const result2 = await throttleManager.execute('key2', fn);
  
  await Promise.all([result1, result2]);
  
  // Should execute twice due to different keys
  assert.equal(executionCount, 2);
  
  throttleManager.clear();
});

test('ThrottleManager - disabled state', async () => {
  const throttleManager = new axios.ThrottleManager({
    enabled: false
  });
  
  let executionCount = 0;
  const fn = async () => {
    executionCount++;
    return { count: executionCount };
  };
  
  // Execute multiple times
  await throttleManager.execute('test', fn);
  await throttleManager.execute('test', fn);
  await throttleManager.execute('test', fn);
  
  // Should execute all times when disabled
  assert.equal(executionCount, 3);
});

test('Axios - debounce integration', async () => {
  let requestCount = 0;
  const mockAdapter = async (config) => {
    requestCount++;
    return {
      data: { result: 'success', count: requestCount },
      status: 200,
      statusText: 'OK',
      headers: new axios.AxiosHeaders(),
      config
    };
  };
  
  const api = axios.create({
    adapter: mockAdapter,
    debounce: {
      enabled: true,
      delay: 50,
      trailing: true,
      leading: false
    }
  });
  
  // Make multiple rapid requests
  const promise1 = api.get('/test');
  const promise2 = api.get('/test');
  const promise3 = api.get('/test');
  
  const result1 = await promise1;
  const result2 = await promise2;
  const result3 = await promise3;
  
  // Should execute only once due to debouncing
  assert.equal(requestCount, 1);
  assert.equal(result1.data.count, 1);
  assert.equal(result2.data.count, 1);
  assert.equal(result3.data.count, 1);
});

test('Axios - throttle integration', async () => {
  let requestCount = 0;
  const mockAdapter = async (config) => {
    requestCount++;
    return {
      data: { result: 'success', count: requestCount },
      status: 200,
      statusText: 'OK',
      headers: new axios.AxiosHeaders(),
      config
    };
  };
  
  const api = axios.create({
    adapter: mockAdapter,
    throttle: {
      enabled: true,
      delay: 50,
      leading: true,
      trailing: false
    }
  });
  
  // Make first request
  const result1 = await api.get('/test');
  assert.equal(requestCount, 1);
  assert.equal(result1.data.count, 1);
  
  // Make rapid requests (should be throttled)
  const promise2 = api.get('/test');
  const promise3 = api.get('/test');
  
  const result2 = await promise2;
  const result3 = await promise3;
  
  // Should not execute additional requests yet
  assert.equal(requestCount, 1);
});

test('Axios - debounce management methods', async () => {
  const mockAdapter = async (config) => {
    return {
      data: { result: 'success' },
      status: 200,
      statusText: 'OK',
      headers: new axios.AxiosHeaders(),
      config
    };
  };
  
  const api = axios.create({
    adapter: mockAdapter,
    debounce: {
      enabled: true,
      delay: 200,
      trailing: true,
      leading: false
    }
  });
  
  // Get debounce manager
  const debounceManager = api.getDebounceManager();
  assert.equal(debounceManager.getPendingCount(), 0);
  
  // Start debouncing
  api.get('/test');
  assert.equal(debounceManager.getPendingCount(), 1);
  
  // Clear pending
  debounceManager.clear();
  assert.equal(debounceManager.getPendingCount(), 0);
  
  // Update configuration
  api.setDebounceConfig({
    delay: 1000,
    maxWait: 2000
  });
  
  const newConfig = api.getDebounceConfig();
  assert.equal(newConfig.delay, 1000);
  assert.equal(newConfig.maxWait, 2000);
});

test('Axios - throttle management methods', async () => {
  const mockAdapter = async (config) => {
    return {
      data: { result: 'success' },
      status: 200,
      statusText: 'OK',
      headers: new axios.AxiosHeaders(),
      config
    };
  };
  
  const api = axios.create({
    adapter: mockAdapter,
    throttle: {
      enabled: true,
      delay: 50,
      leading: true,
      trailing: false
    }
  });
  
  // Get throttle manager
  const throttleManager = api.getThrottleManager();
  assert.equal(throttleManager.getPendingCount(), 0);
  
  // Make request
  await api.get('/test');
  
  // Make another request (should be throttled)
  api.get('/test');
  assert.equal(throttleManager.getPendingCount(), 1);
  
  // Clear pending
  throttleManager.clear();
  assert.equal(throttleManager.getPendingCount(), 0);
  
  // Update configuration
  api.setThrottleConfig({
    delay: 200,
    leading: false
  });
  
  const newConfig = api.getThrottleConfig();
  assert.equal(newConfig.delay, 200);
  assert.equal(newConfig.leading, false);
});