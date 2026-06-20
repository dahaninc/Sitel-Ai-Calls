export interface Client {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  tier: "starter" | "growth" | "scale";
  monthly_fee: number;
  status: "onboarding" | "active" | "paused" | "churned";
  contract_start_date: string;
  twilio_phone_number: string;
}

export interface CallLog {
  id: string;
  client_id: string;
  retell_call_id: string;
  phone_number_from: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  resolved_by_ai: boolean;
  escalated_to_human: boolean;
  abandoned: boolean;
  primary_intent: string;
  sentiment_score: number;
  sentiment_label: "positive" | "neutral" | "negative";
  recording_url?: string;
}

export interface ClientStats {
  client_id: string;
  company_name: string;
  tier: string;
  total_calls_all_time: number;
  calls_this_month: number;
  ai_deflection_rate_pct: number;
  avg_call_duration_seconds: number;
  avg_sentiment: number;
  escalations: number;
  abandoned_calls: number;
  avg_csat: number;
}

export interface DailyVolume {
  client_id: string;
  call_date: string;
  total_calls: number;
  ai_resolved: number;
  escalated: number;
  abandoned: number;
  avg_sentiment: number;
  avg_duration_secs: number;
}

export interface Intent {
  client_id: string;
  primary_intent: string;
  call_count: number;
  pct_of_calls: number;
  avg_sentiment: number;
  ai_resolved: number;
  escalated: number;
}

export interface Alert {
  id: string;
  client_id: string;
  message: string;
  metric_value: number;
  triggered_at: string;
  acknowledged_at?: string;
}
