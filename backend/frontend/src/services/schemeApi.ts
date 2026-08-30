/**
 * Scheme API Service
 * Fetches real government scheme and subsidy information from backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Scheme {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  state: string;
  description: string;
  benefit: string;
  subsidy: string | null;
  eligibility: string[];
  documents: string[];
  applicationProcess: string[];
  deadline: string | null;
  officialUrl: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  applicationUrl?: string;
  statusCheckUrl?: string | null;
}

export interface SchemeResponse {
  success: boolean;
  count?: number;
  schemes?: Scheme[];
  scheme?: Scheme;
  category?: string;
}

class SchemeApiService {
  /**
   * Get all schemes or filter by category/query
   */
  async getSchemes(category?: string, query?: string): Promise<Scheme[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (query) params.append('query', query);
      
      const url = `${API_BASE_URL}/api/v1/schemes${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch schemes');
      }
      
      const data: SchemeResponse = await response.json();
      return data.schemes || [];
    } catch (error) {
      console.error('Error fetching schemes:', error);
      return [];
    }
  }

  /**
   * Get a specific scheme by ID
   */
  async getSchemeById(schemeId: string): Promise<Scheme | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/schemes/${schemeId}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch scheme details');
      }
      
      const data: SchemeResponse = await response.json();
      return data.scheme || null;
    } catch (error) {
      console.error('Error fetching scheme details:', error);
      return null;
    }
  }

  /**
   * Get schemes by specific category
   */
  async getSchemesByCategory(category: string): Promise<Scheme[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/schemes/category/${category}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch schemes by category');
      }
      
      const data: SchemeResponse = await response.json();
      return data.schemes || [];
    } catch (error) {
      console.error('Error fetching schemes by category:', error);
      return [];
    }
  }

  /**
   * Search schemes by query string
   */
  async searchSchemes(query: string): Promise<Scheme[]> {
    return this.getSchemes(undefined, query);
  }
}

export const schemeApi = new SchemeApiService();
