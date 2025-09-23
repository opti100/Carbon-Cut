import { ActivityData, CountryData } from "@/types/types";

export const CHANNELS: Record<string, Array<[string, string]>> = {
  "Ad Production": [
    ["Travel (km)", "travel_km"], 
    ["Electricity (kWh)", "electricity_kWh"], 
    ["Materials (kg)", "materials_kg"], 
    ["Cloud storage (GB/month)", "cloud_storage_gb_months"]
  ],
  "Digital / Programmatic Media": [
    ["Impressions", "adtech_impression"], 
    ["Data transfer (GB)", "network_GB"]
  ],
  "Search & Social Ads": [
    ["Ad deliveries/impressions", "social_impression"], 
    ["Data transfer (GB)", "data_transfer_gb"]
  ],
  "Owned Social Posts": [
    ["Posts", "social_post"], 
    ["Views", "social_views"], 
    ["View time (hours)", "view_time_hours"], 
    ["Device power (Watts)", "device_watts"]
  ],
  "Email Marketing": [
    ["Emails sent", "email_send"], 
    ["Data transfer (GB)", "email_data_gb"], 
    ["Email opens", "email_opens"], 
    ["Reading time (hours)", "reading_time_hours"]
  ],
  "Website / Landing Pages": [
    ["Site visits", "web_visit"], 
    ["Data per visit (bytes)", "data_per_visit_bytes"], 
    ["Hosting (kWh)", "hosting_kWh"]
  ],
  "Print": [
    ["Paper (kg)", "paper_kg"], 
    ["Printing energy (kWh)", "printing_kwh"], 
    ["Distribution (ton-km)", "distribution_ton_km"]
  ],
  "Out-of-Home (Static)": [
    ["Materials/waste (kg)", "ooh_materials_kg"], 
    ["Installation travel (km)", "install_travel_km"]
  ],
  "DOOH (Digital billboards)": [
    ["Screen power (kWh)", "dooh_screen_kwh"], 
    ["Runtime (hours)", "dooh_runtime_hours"], 
    ["Data transfer (GB)", "dooh_data_gb"]
  ],
  "Events/Experiential": [
    ["Venue energy (kWh)", "venue_energy_kwh"], 
    ["Booth materials (kg)", "booth_materials_kg"], 
    ["Attendee travel (passenger-km)", "attendee_travel_km"], 
    ["Freight (ton-km)", "freight_ton_km"], 
    ["Catering (meals)", "catering_meals"]
  ],
  "Influencer Marketing": [
    ["Editing/compute (kWh)", "editing_kwh"], 
    ["Travel (km)", "influencer_travel_km"], 
    ["Content delivery (GB)", "content_delivery_gb"]
  ],
  "PR & Press": [
    ["Printed press (kg)", "printed_press_kg"], 
    ["Parcel shipping (ton-km)", "parcel_shipping_ton_km"], 
    ["Travel (km)", "pr_travel_km"]
  ],
  "Giveaways/Merchandise": [
    ["Materials (kg)", "merch_materials_kg"], 
    ["Distribution (ton-km)", "merch_distribution_ton_km"], 
    ["Packaging (kg)", "packaging_kg"]
  ],
  "Martech & Cloud": [
    ["Cloud compute (kWh)", "cloud_compute_kwh"], 
    ["SaaS hosting (kWh)", "saas_hosting_kwh"]
  ],
  "Television Advertising": [
    ["Studio runtime (hours)", "tv_studio_hours"], 
    ["Studio power (kWh)", "tv_studio_kwh"], 
    ["Content distribution (GB)", "tv_content_gb"]
  ],
  "Radio Advertising": [
    ["Broadcast time (hours)", "radio_broadcast_hours"], 
    ["Station power (kWh)", "radio_station_kwh"], 
    ["Streaming data (GB)", "radio_streaming_gb"]
  ],
  "Cinema Advertising": [
    ["Projector power (kWh)", "cinema_projector_kwh"], 
    ["Film stock (kg)", "film_stock_kg"], 
    ["Distribution (GB)", "cinema_distribution_gb"]
  ],
  "Direct Mail": [
    ["Paper (kg)", "direct_mail_paper_kg"], 
    ["Printing energy (kWh)", "direct_mail_printing_kwh"], 
    ["Mail delivery (ton-km)", "mail_delivery_ton_km"]
  ],
  "Sponsorships": [
    ["Event allocation (%)", "sponsorship_allocation_percent"], 
    ["Event energy (kWh)", "sponsorship_event_kwh"], 
    ["Attendee travel (passenger-km)", "sponsorship_attendee_travel_km"], 
    ["Freight (ton-km)", "sponsorship_freight_ton_km"], 
    ["Catering (meals)", "sponsorship_catering_meals"]
  ],
  "Point-of-Sale Materials": [
    ["Materials (kg)", "pos_materials_kg"], 
    ["Manufacturing energy (kWh)", "pos_manufacturing_kwh"], 
    ["Distribution (ton-km)", "pos_distribution_ton_km"]
  ],
  "Outdoor Guerrilla Marketing": [
    ["Materials (kg)", "guerrilla_materials_kg"], 
    ["Installation power (kWh)", "guerrilla_power_kwh"], 
    ["Team travel (km)", "guerrilla_travel_km"]
  ],
  "Call Centers/Telemarketing": [
    ["Agent time (hours)", "agent_time_hours"], 
    ["Device power (Watts)", "agent_device_watts"], 
    ["Server power (kWh)", "call_center_server_kwh"]
  ],
  "Live Streams/Webinars": [
    ["Stream time (hours)", "stream_time_hours"], 
    ["Participants", "stream_participants"], 
    ["Device power (Watts)", "stream_device_watts"], 
    ["Data transfer (GB)", "stream_data_gb"]
  ]
};

export const DEFAULT_SCOPE: Record<string, number> = {
  "Ad Production": 3,
  "Digital / Programmatic Media": 3,
  "Search & Social Ads": 3,
  "Owned Social Posts": 3,
  "Email Marketing": 3,
  "Website / Landing Pages": 3,
  "Print": 3,
  "Out-of-Home (Static)": 3,
  "DOOH (Digital billboards)": 3,
  "Events/Experiential": 3,
  "Influencer Marketing": 3,
  "PR & Press": 3,
  "Giveaways/Merchandise": 3,
  "Martech & Cloud": 3,
  "Television Advertising": 3,
  "Radio Advertising": 3,
  "Cinema Advertising": 3,
  "Direct Mail": 3,
  "Sponsorships": 3,
  "Point-of-Sale Materials": 3,
  "Outdoor Guerrilla Marketing": 3,
  "Call Centers/Telemarketing": 3,
  "Live Streams/Webinars": 3
};

export const FALLBACK_CALCULATION = {
  getBasicEmission: (activity: ActivityData): number => {
    const qty = activity.qty;
    
    // Travel-related units
    if (activity.unit.includes('km') || activity.unit.includes('travel')) {
      return qty * 0.15;
    } 
    // Energy-related units
    else if (activity.unit.includes('kWh') || activity.unit.includes('kwh') || activity.unit.includes('energy')) {
      return qty * 0.4;
    } 
    // Digital advertising
    else if (activity.unit === 'adtech_impression' || activity.unit === 'social_impression') {
      return qty * 0.00001;
    } 
    // Email
    else if (activity.unit === 'email_send' || activity.unit.includes('email')) {
      return qty * 0.004;
    } 
    // Paper/print
    else if (activity.unit.includes('paper') || activity.unit === 'paper_kg') {
      return qty * 1.3;
    }
    // Materials
    else if (activity.unit.includes('materials') || activity.unit.includes('kg')) {
      return qty * 0.5;
    }
    // Data transfer
    else if (activity.unit.includes('gb') || activity.unit.includes('GB') || activity.unit.includes('data')) {
      return qty * 0.006;
    }
    // Time-based units (hours)
    else if (activity.unit.includes('hours') || activity.unit.includes('time')) {
      return qty * 0.1;
    }
    // Power units (Watts)
    else if (activity.unit.includes('watts') || activity.unit.includes('Watts')) {
      return qty * 0.0005;
    }
    // Views/posts/interactions
    else if (activity.unit.includes('views') || activity.unit.includes('post') || activity.unit.includes('opens')) {
      return qty * 0.0001;
    }
    // Default fallback
    else {
      return qty * 0.001;
    }
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