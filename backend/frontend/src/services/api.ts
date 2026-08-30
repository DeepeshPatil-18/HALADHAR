/**
 * KrishiMitra API Service Layer
 * Connects frontend to backend APIs
 */

import axios, { type AxiosInstance, AxiosError } from 'axios';
import type {
  AssistantRequest,
  AssistantResponse,
  SchemeSearchResult,
  MarketSearchResult,
  AdvisoryOption,
} from '../types';

class KrishiMitraAPI {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL?: string) {
    // Use environment variable or default to localhost
    this.baseURL = baseURL || import.meta.env.VITE_FASTAPI_BASE_URL || 'http://localhost:8000';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Health Check
   */
  async healthCheck(): Promise<any> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Main Assistant Chat Endpoint
   * Orchestrates: language detection, intent classification, entity extraction
   * Routes to appropriate capability (advisory, schemes, market, etc.)
   */
  async chat(request: AssistantRequest): Promise<AssistantResponse> {
    try {
      console.log('Calling API with request:', { message: request.message, language: request.language });
      const response = await this.client.post<AssistantResponse>(
        '/api/v1/assistant/chat',
        {
          message: request.message,
          language: request.language || 'auto',
          farmer_context: request.farmer_context || {},
          session_id: request.session_id,
        }
      );
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get All Advisory Options (Livelihood Options)
   */
  async getAdvisoryOptions(): Promise<AdvisoryOption[]> {
    try {
      const response = await this.client.get<AdvisoryOption[]>(
        '/api/v1/advisory/options'
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Advisory Recommendations
   */
  async getAdvisoryRecommendations(
    budget?: number,
    land?: number,
    experience?: string,
    water?: string
  ): Promise<AssistantResponse> {
    // Use chat endpoint with advisory context
    return this.chat({
      message: `I have ${budget ? budget + ' rupees' : 'limited budget'} and ${
        land ? land + ' acres' : 'limited land'
      }${experience ? '. Experience: ' + experience : ''}${
        water ? '. Water: ' + water : ''
      }. What can I do?`,
      farmer_context: {
        budget,
        land,
        experience,
        water_availability: water,
      },
    });
  }

  /**
   * Search Schemes
   */
  async searchSchemes(
    query: string,
    filters?: Record<string, any>
  ): Promise<SchemeSearchResult> {
    try {
      const response = await this.client.post<SchemeSearchResult>(
        '/api/v1/schemes/search',
        {
          query,
          filters: filters || {},
        }
      );
      return response.data;
    } catch (error) {
      // Fallback: use chat to search schemes if direct endpoint not available
      console.warn('Schemes endpoint not available, using fallback');
      return {
        schemes: [],
        total_count: 0,
        search_query: query,
      };
    }
  }

  /**
   * Get Market Prices
   */
  async getMarketPrices(
    commodity: string,
    state?: string,
    district?: string
  ): Promise<MarketSearchResult> {
    try {
      const response = await this.client.get<MarketSearchResult>(
        '/api/v1/market/prices',
        {
          params: {
            commodity,
            state,
            district,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Detect Intent from Query
   */
  async detectIntent(message: string): Promise<{ intent: string }> {
    try {
      const response = await this.client.post<{ intent: string }>(
        '/api/v1/intent/detect',
        { message }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error Handler
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Try to get error from response body
      if (axiosError.response?.data) {
        const responseData = axiosError.response.data as any;
        if (responseData.detail && typeof responseData.detail === 'string') {
          // FastAPI validation error
          return new Error(responseData.detail);
        }
        if (responseData.error) {
          // Custom API error format
          return new Error(responseData.error);
        }
      }
      
      // Fallback to status text or generic message
      return new Error(
        axiosError.response?.statusText || 
        axiosError.message || 
        'Failed to connect to backend'
      );
    }
    
    // Non-axios error
    return new Error(error?.message || 'An unknown error occurred');
  }

  /**
   * Set Backend URL (for testing or alternative environments)
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.client.defaults.baseURL = url;
  }

  /**
   * Get Current Backend URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Export singleton instance
export const api = new KrishiMitraAPI();
export default api;
