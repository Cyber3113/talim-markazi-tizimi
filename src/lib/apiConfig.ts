
/**
 * API Configuration
 * 
 * This file sets up the API connection configuration.
 * Update the API_BASE_URL to match your deployment environment.
 */

export const API_CONFIG = {
  // Default to local development
  API_BASE_URL: "http://localhost:8000/api",
  
  // For production
  // API_BASE_URL: "https://api.itbrain-training.example.com/api",
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
    // API_CONFIG.API_BASE_URL = "https://api.itbrain-training.example.com/api";
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
};
