/**
 * KrishiMitra Frontend Types
 * Aligned with backend API
 */

// Assistant/Chat Types
export interface FarmerContext {
  budget?: number;
  land?: number;
  experience?: string;
  water_availability?: string;
  [key: string]: any;
}

export interface AssistantRequest {
  message: string;
  language?: 'auto' | 'english' | 'hindi' | 'marathi';
  farmer_context?: FarmerContext;
  session_id?: string;
}

export interface AssistantResponse {
  intent: string;
  response: string;
  response_type: string;
  detected_language: string;
  information_completeness: number;
  missing_information?: string[];
  requires_further_input: boolean;
  suggested_next_action?: string;
  metadata?: Record<string, any>;
}

// Advisory Types
export interface AdvisoryOption {
  id: string;
  name: string;
  description: string;
  land_requirement: {
    min: number;
    max: number;
    unit: string;
  };
  budget_requirement: {
    min: number;
    max: number;
    currency: string;
  };
  water_requirement: string;
  experience_level: string;
  time_commitment: string;
  risk_level: string;
  expected_income?: {
    min: number;
    max: number;
    currency: string;
    timeframe: string;
  };
  suitable_conditions: string[];
  unsuitable_conditions: string[];
  training_modules?: string[];
  related_schemes?: string[];
  market_opportunities?: string[];
}

export interface AdvisoryRecommendation {
  option_id: string;
  option_name: string;
  score: number;
  reasoning: string;
  constraints_matched: string[];
  missing_information?: string[];
}

export interface AdvisoryResponse {
  recommendations: AdvisoryRecommendation[];
  total_options_evaluated: number;
  information_completeness: number;
}

// Scheme Types
export interface Scheme {
  id: string;
  name: string;
  description: string;
  ministry: string;
  eligibility: {
    farmer_type?: string[];
    land_size?: string;
    income_limit?: string;
    states?: string[];
    conditions?: string[];
  };
  benefits: {
    subsidy_amount?: string;
    loan_amount?: string;
    grant_amount?: string;
    other_benefits?: string[];
  };
  application_process: {
    how_to_apply: string;
    required_documents: string[];
    application_portal?: string;
  };
  important_dates?: {
    start_date?: string;
    end_date?: string;
    selection_date?: string;
  };
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface SchemeSearchResult {
  schemes: Scheme[];
  total_count: number;
  search_query?: string;
  filters_applied?: Record<string, any>;
}

// Market Types
export interface MarketPrice {
  commodity: string;
  market: string;
  state: string;
  district?: string;
  price_per_unit: number;
  unit: string;
  date: string;
  min_price?: number;
  max_price?: number;
  modal_price?: number;
  source: 'LIVE' | 'CACHED' | 'DEMO';
  timestamp?: string;
}

export interface MarketSearchResult {
  prices: MarketPrice[];
  total_count: number;
  source_status: {
    primary_source: 'LIVE' | 'CACHED';
    fallback_active: boolean;
  };
  search_query?: string;
}

// Training Types
export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  provider?: string;
  language?: string[];
  topics: string[];
  resource_link?: string;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: string;
  metadata?: Record<string, any>;
}

// Error Types
export interface APIError {
  error: string;
  error_code?: string;
  details?: Record<string, any>;
  status_code?: number;
}
