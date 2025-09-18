import { ActivityData, CountryData } from "@/types/types";

export const CHANNELS: Record<string, Array<[string, string]>> = {
  "Digital Ads": [["Impressions", "adtech_impression"], ["Data transferred (GB)", "network_GB"]],
  "Email": [["Email sends", "email_send"]],
  "Website": [["Site visits", "web_visit"], ["Hosting (kWh)", "hosting_kWh"]],
  "DOOH (Digital billboards)": [["Screen hours", "dooh_screen_hour"]],
  "Print": [["Paper mass (kg)", "paper_kg"]],
  "Events/Experiential": [["Venue energy (kWh)", "hosting_kWh"]],
  "Travel": [["Road km", "road_km"], ["Rail km", "rail_km"], ["Short‑haul air km", "shorthaul_air_km"], ["Long‑haul air km", "longhaul_air_km"]],
  "Cloud/Martech": [["Cloud/hosting (kWh)", "hosting_kWh"]],
  "Merch/Swag": [["Materials (kg)", "material_merch_kg"]],
  "Ad Production": [["Production hours", "production_hour"], ["Materials (kg)", "material_kg"]],
  "Search & Social Ads": [["Impressions", "social_impression"], ["Click-throughs", "click_through"]],
  "Owned Social Posts": [["Posts", "social_post"], ["Engagement", "social_engagement"]],
  "Out-of-Home (OOH)": [["Board weeks", "ooh_board_week"], ["Installations", "ooh_installation"]],
  "Influencer Marketing": [["Collaborations", "influencer_collab"], ["Content pieces", "content_piece"]],
  "PR & Press": [["Press releases", "press_release"], ["Media events", "media_event"]],
  "Office Energy Allocation": [["Energy (kWh)", "office_energy_kWh"]]
};

export const DEFAULT_SCOPE: Record<string, number> = {
  "Ad Production": 3,                   
  "Digital Ads": 3,                     
  "Search & Social Ads": 3,              
  "Owned Social Posts": 3,               
  "Email": 3,                            
  "Website": 3,                          
  "Print": 3,                            
  "Out-of-Home (OOH)": 3,               
  "DOOH (Digital billboards)": 3,      
  "Events/Experiential": 3,            
  "Influencer Marketing": 3,           
  "PR & Press": 3,                      
  "Merch/Swag": 3,                      
  "Cloud/Martech": 3,                   
  "Travel": 3,                          
  // "Office Energy Allocation": 2         
};

export const FALLBACK_CALCULATION = {
  getBasicEmission: (activity: ActivityData): number => {
    const qty = activity.qty;
    
    if (activity.unit.includes('km')) {
      return qty * 0.15;
    } else if (activity.unit.includes('kWh')) {
      return qty * 0.4;
    } else if (activity.unit === 'adtech_impression') {
      return qty * 0.00001;
    } else if (activity.unit === 'email_send') {
      return qty * 0.004;
    } else if (activity.unit === 'paper_kg') {
      return qty * 1.3;
    }
    
    return qty * 0.001;
  }
};

export const loadCountriesFromScientificData = async (): Promise<CountryData[]> => {
  try {
    const scientificCountriesList = [
      // Europe (Low Carbon)
      'Norway', 'Iceland', 'France', 'Switzerland', 'Sweden', 'Austria', 'Denmark', 
      'Finland', 'Belgium', 'United Kingdom', 'Spain', 'Italy', 'Netherlands', 
      'Germany', 'Czech Republic', 'Greece', 'Poland',
      
      // Americas  
      'Costa Rica', 'Uruguay', 'Brazil', 'Canada', 'Chile', 'Argentina', 
      'United States', 'Mexico',
      
      // Asia Pacific
      'New Zealand', 'Japan', 'Thailand', 'Singapore', 'Malaysia', 'South Korea', 
      'China', 'Vietnam', 'Indonesia', 'Taiwan', 'India', 'Australia',
      
      // Middle East & Africa
      'Morocco', 'Egypt', 'UAE', 'Saudi Arabia', 'South Africa', 'Nigeria'
    ].sort();
    
    return scientificCountriesList.map(country => ({
      code: country.substring(0, 3).toUpperCase(),
      name: country
    }));
  } catch (error) {
    console.error('Error loading countries:', error);
    // Fallback to minimal list
    return [
      'United States', 'United Kingdom', 'Germany', 'France', 'Canada', 
      'Australia', 'Japan', 'India', 'China', 'Brazil', 'Thailand'
    ].map(country => ({
      code: country.substring(0, 3).toUpperCase(),
      name: country
    }));
  }
};
