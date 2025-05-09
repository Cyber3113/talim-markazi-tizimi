
/**
 * API Configuration
 * 
 * This file sets up the API connection configuration.
 * Update the API_BASE_URL to match your deployment environment.
 */

export const API_CONFIG = {
  // Default to local FastAPI development server
  API_BASE_URL: "http://192.168.1.4:8000/api",
  
  // For production
  // API_BASE_URL: "https://your-fastapi-server.com/api",
};

/**
 * Configure the API base URL.
 * Call this function early in your application startup.
 */
export const configureApi = (baseUrl?: string) => {
  if (baseUrl) {
    API_CONFIG.API_BASE_URL = baseUrl;
  }
  
  // Auto-detect environment
  if (import.meta.env.PROD) {
    // When in production, could switch to production URL if not specified
    // API_CONFIG.API_BASE_URL = "https://your-fastapi-server.com/api";
  }
  
  console.log(`API configured with base URL: ${API_CONFIG.API_BASE_URL}`);
};

/**
 * Set up the API on application mount
 */
export const initializeApi = () => {
  // Get API URL from environment or use default
  const apiUrl = import.meta.env.VITE_API_BASE_URL || API_CONFIG.API_BASE_URL;
  configureApi(apiUrl);
  console.log("API initialization complete. Base URL:", apiUrl);
  
  // Expose API_BASE_URL to the api.ts file
  return API_CONFIG.API_BASE_URL;
};

/**
 * Get the configured API base URL
 */
export const getApiBaseUrl = () => {
  return API_CONFIG.API_BASE_URL;
};
