import axios from 'axios';

// Use relative URL in production (Docker), absolute URL in development
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:8000' : '';

// Cache for API responses (1 hour TTL)
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const responseCache = new Map();

/**
 * Simple hash function for cache keys
 */
function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Check if cached response is still valid
 */
function getFromCache(text) {
  const key = hashText(text);
  const cached = responseCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('📦 Cache hit for text');
    return cached.data;
  }

  // Clean up expired entry
  if (cached) {
    responseCache.delete(key);
  }

  return null;
}

/**
 * Save response to cache
 */
function saveToCache(text, data) {
  const key = hashText(text);
  responseCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export const verifyText = async (text, apiKey) => {
  // Check cache first
  const cached = getFromCache(text);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/verify`, {
      text: text,
      api_key: apiKey
    });

    // Save to cache
    saveToCache(text, response.data);

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return null;
  }
};

/**
 * Check if user is online
 */
export const isOnline = () => navigator.onLine;

/**
 * Clear the response cache
 */
export const clearCache = () => {
  responseCache.clear();
  console.log('🗑️ Cache cleared');
};
