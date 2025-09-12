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
  "Merch/Swag": [["Materials (kg)", "material_merch_kg"]]
};

export const DEFAULT_SCOPE: Record<string, number> = {
  "Digital Ads": 3,
  "Email": 3,
  "Website": 3,
  "DOOH (Digital billboards)": 3,
  "Print": 3,
  "Events/Experiential": 3,
  "Travel": 3,
  "Cloud/Martech": 2,
  "Merch/Swag": 3
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