import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Firm = {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  region: string | null;
  firm_type: string;
  membership_tier: string | null;
  size_estimate: string | null;
  service_mix: string | null;
  website: string | null;
  linkedin_url: string | null;
  summary: string | null;
  standing_score: number;
  last_scanned_at: string | null;
  created_at: string;
  latitude?: number;
  longitude?: number;
};

export type Signal = {
  id: string;
  firm_id: string;
  source: string;
  source_url: string | null;
  raw_text: string | null;
  classification: 'positive' | 'neutral' | 'important' | 'critical';
  value_pillar: 'talent' | 'service_evolution' | 'technology' | 'other';
  source_type: string | null;
  ai_reasoning: string | null;
  suggested_action: string | null;
  detected_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  duplicate_confidence: number | null;
  duplicate_status: 'new' | 'possibly_related' | 'likely_duplicate' | null;
};