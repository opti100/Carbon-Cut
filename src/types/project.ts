export interface ProjectDTO {
  external_reference_id: string;
  name: string;
  developer: string;
  description?: string;
  
  issued_credits: number;
  available_credits: number;
  retired_credits: number;
  
  documents: Record<string, string>;
  
  region: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  
  project_type?: string;
  standard?: string;
  project_status: string;
  
  vintage_year: number;
  project_start_date?: string;
  crediting_period_start?: string;
  crediting_period_end?: string;
  registration_date?: string;
  
  project_area_hectares?: number;
  capacity_mw?: number;
  number_of_units?: number;
  annual_emission_reductions?: number;
  total_estimated_reductions?: number;
  
  sdg_contributions: number[];
  co_benefits: string[];
  
  methodology?: string;
  additionality_approach?: string;
  baseline_scenario?: string;
  
  last_verification_date?: string;
  verification_body?: string;
  next_verification_due?: string;
  
  price_per_credit_usd?: number;
  total_project_cost_usd?: number;
  
  communities_impacted?: number;
  jobs_created?: number;
  indigenous_peoples_involved: boolean;
  stakeholder_consultation_completed: boolean;
  
  environmental_impact_assessment_completed: boolean;
  biodiversity_benefits: string[];
  endangered_species_protected: string[];
  
  permanence_risk_rating?: string;
  leakage_mitigation_measures: string[];
  
  monitoring_frequency?: string;
  monitoring_methods: string[];
  
  project_website?: string;
  registry_url?: string;
  tags: string[];
  notes?: string;
}