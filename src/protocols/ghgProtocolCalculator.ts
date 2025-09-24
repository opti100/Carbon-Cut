// 🌍 GHG Protocol Carbon Calculator - Optiminastic | CarbonCut Official Framework
// ============================================================================
// Implements the complete Optiminastic | CarbonCut methodology with all 15 channel formulas
// Uses latest 2025 emission factors and GHG Protocol formulas

import { GridIntensityService } from "@/services/grid-intensity-service";

// --- Type Definitions ---

interface GridIntensityFactors {
  [country: string]: number;
}

interface EmissionFactors {
  // Digital/Network factors
  network_data_transfer: number;
  ad_tech_energy: number;
  data_center_processing: number;
  device_energy_mobile: number;
  device_energy_desktop: number;
  
  // Email
  email_send_energy: number;
  email_storage: number;
  esp_energy_per_send: number;
  
  // Social & Search
  social_post_organic: number;
  social_post_creation: number;
  social_post_upload: number;
  search_query: number;
  platform_energy_per_user: number;
  video_streaming_sd: number;
  video_streaming_hd: number;
  
  // Website & Hosting
  website_page_view: number;
  cdn_delivery: number;
  hosting_shared: number;
  hosting_dedicated: number;
  bytes_per_visit_default: number;
  
  // Print & Materials
  paper_recycled: number;
  paper_virgin: number;
  printing_offset: number;
  printing_digital: number;
  printing_energy_per_page: number;
  
  // Transport & Logistics
  freight_truck_local: number;
  freight_truck_longhaul: number;
  air_freight: number;
  ocean_freight: number;
  vehicle_diesel: number;
  vehicle_petrol: number;
  
  // Events & Physical
  event_venue_energy: number;
  booth_materials_standard: number;
  booth_materials_premium: number;
  catering_meat: number;
  catering_vegetarian: number;
  catering_vegan: number;
  attendee_travel_local: number;
  attendee_travel_domestic: number;
  attendee_travel_international: number;
  
  // OOH & DOOH
  ooh_materials_per_m2: number;
  ooh_installation_vehicle: number;
  ooh_disposal_waste: number;
  dooh_screen_power_per_hour: number;
  
  // Production & Cloud
  cloud_storage_per_gb_month: number;
  video_production_energy: number;
  photo_production_energy: number;
  audio_production_energy: number;
  
  // Materials & Merchandise
  material_cotton: number;
  material_polyester: number;
  material_plastic: number;
  material_metal: number;
  material_electronics: number;
  packaging_cardboard: number;
  packaging_plastic: number;
  
  // Travel modes
  travel_car_petrol: number;
  travel_car_diesel: number;
  travel_train_electric: number;
  travel_train_diesel: number;
  travel_bus: number;
  travel_flight_domestic: number;
  travel_flight_shorthaul: number;
  travel_flight_longhaul: number;
  
  // Grid Intensity
  grid_intensity: GridIntensityFactors;
}

interface GHGUserInput {
  market?: string;
  country?: string;
  quantity?: number;
  activityType?: string;
  unit?: string;
  includeDeviceEnergy?: boolean;
  channel?: string;
  // Additional parameters for specific calculations
  dataGB?: number;
  viewTimeMinutes?: number;
  materialType?: string;
  travelMode?: string;
  distance?: number;
  powerKWh?: number;
  materials?: { type: string; kg: number }[];
}

interface CalculationBreakdown {
  [key: string]: number;
}

interface CalculationResult {
  total: number;
  breakdown: CalculationBreakdown;
  methodology: string;
}

interface GHGResultData {
  totalEmissions: number;
  breakdown: {
    digital_processing: number;
    energy_consumption: number;
    device_energy: number;
    supply_chain: number;
    materials: number;
    transport: number;
    waste: number;
  };
  methodology: string;
  country: string;
  gridIntensity: number;
  recommendations: string[];
  sustainabilityRating: string;
}

interface GHGProtocolResult {
  success: boolean;
  data: GHGResultData;
}

export default class GHGProtocolCarbonCalculator {
  private emissionFactors: EmissionFactors;

  constructor() {
    // console.log('GHG Protocol Calculator initialized - Optiminastic | CarbonCut Official Framework');
    
    this.emissionFactors = {
      // Digital/Network factors (IEA 2025, Nature Climate Change latest studies)
      network_data_transfer: 0.000006, // kg CO2e per MB (2025 efficiency improvements)
      ad_tech_energy: 0.0000038, // kg CO2e per impression (2025 Google/Meta optimization)
      data_center_processing: 0.000009, // kg CO2e per GB processed (2025 AWS/Azure efficiency)
      device_energy_mobile: 0.0000012, // kg CO2e per minute mobile viewing (2025 chip efficiency)
      device_energy_desktop: 0.0000028, // kg CO2e per minute desktop viewing (2025 hardware)
      
      // Email Marketing (Carbon Trust 2025 studies)
      email_send_energy: 0.0000032, // kg CO2e per email sent (2025 server efficiency)
      email_storage: 0.000000105, // kg CO2e per email stored per year (2025 storage tech)
      esp_energy_per_send: 0.0000028, // kg CO2e per email via ESP
      
      // Social Media & Search (MIT/Cambridge 2025 studies)
      social_post_organic: 0.000028, // kg CO2e per organic post (2025 platform efficiency)
      social_post_creation: 0.000045, // kg CO2e per post creation
      social_post_upload: 0.000012, // kg CO2e per post upload
      search_query: 0.00016, // kg CO2e per search query (2025 AI optimization)
      platform_energy_per_user: 0.000032, // kg CO2e per user engagement
      video_streaming_sd: 0.0029, // kg CO2e per hour SD video (2025 codec efficiency)
      video_streaming_hd: 0.0064, // kg CO2e per hour HD video (2025 streaming optimization)
      
      // Website & Hosting (Green Web Foundation 2025 data)
      website_page_view: 0.000004, // kg CO2e per page view (2025 green hosting growth)
      cdn_delivery: 0.0000024, // kg CO2e per MB CDN (2025 edge computing efficiency)
      hosting_shared: 0.0000008, // kg CO2e per MB hosted (shared, 2025 renewable energy)
      hosting_dedicated: 0.000004, // kg CO2e per MB hosted (dedicated, 2025 efficiency)
      bytes_per_visit_default: 2000000, // 2MB default per visit
      
      // Print & Materials (DEFRA 2025 factors)
      paper_recycled: 0.89, // kg CO2e per kg recycled paper (2025 process improvements)
      paper_virgin: 1.28, // kg CO2e per kg virgin paper (2025 forestry practices)
      printing_offset: 0.021, // kg CO2e per A4 page offset printing (2025 ink efficiency)
      printing_digital: 0.016, // kg CO2e per A4 page digital printing (2025 tech advances)
      printing_energy_per_page: 0.00034, // kWh per page printed
      
      // Transport & Logistics (IPCC AR6 2025 updated factors)
      freight_truck_local: 0.076, // kg CO2e per ton-km local delivery (2025 EV adoption)
      freight_truck_longhaul: 0.054, // kg CO2e per ton-km long haul (2025 efficiency)
      air_freight: 0.587, // kg CO2e per ton-km air freight (2025 SAF adoption)
      ocean_freight: 0.009, // kg CO2e per ton-km ocean freight (2025 green shipping)
      vehicle_diesel: 0.163, // kg CO2e per km diesel vehicle
      vehicle_petrol: 0.171, // kg CO2e per km petrol vehicle
      
      // Events & Physical (Event Industry Council 2025 data)
      event_venue_energy: 0.095, // kg CO2e per attendee-hour (2025 LED/renewable venues)
      booth_materials_standard: 12.8, // kg CO2e per m² booth space (2025 sustainable materials)
      booth_materials_premium: 18.5, // kg CO2e per m² premium booth materials
      catering_meat: 2.89, // kg CO2e per meal with meat (2025 sustainable agriculture)
      catering_vegetarian: 0.76, // kg CO2e per vegetarian meal (2025 local sourcing)
      catering_vegan: 0.42, // kg CO2e per vegan meal
      attendee_travel_local: 0.089, // kg CO2e per km local travel
      attendee_travel_domestic: 0.134, // kg CO2e per km domestic travel
      attendee_travel_international: 0.267, // kg CO2e per km international travel
      
      // OOH & DOOH (Outdoor Advertising Council 2025)
      ooh_materials_per_m2: 15.6, // kg CO2e per m² OOH materials
      ooh_installation_vehicle: 0.163, // kg CO2e per km installation vehicle
      ooh_disposal_waste: 0.045, // kg CO2e per kg waste disposal
      dooh_screen_power_per_hour: 0.125, // kWh per hour per m² DOOH screen
      
      // Production & Cloud (AWS/Google Cloud 2025)
      cloud_storage_per_gb_month: 0.000012, // kg CO2e per GB stored per month
      video_production_energy: 2.34, // kg CO2e per hour video production
      photo_production_energy: 0.67, // kg CO2e per hour photo production
      audio_production_energy: 0.23, // kg CO2e per hour audio production
      
      // Materials & Merchandise (Ellen MacArthur Foundation 2025)
      material_cotton: 5.89, // kg CO2e per kg cotton
      material_polyester: 9.52, // kg CO2e per kg polyester
      material_plastic: 1.83, // kg CO2e per kg plastic
      material_metal: 2.74, // kg CO2e per kg metal
      material_electronics: 156.7, // kg CO2e per kg electronics
      packaging_cardboard: 0.92, // kg CO2e per kg cardboard packaging
      packaging_plastic: 1.83, // kg CO2e per kg plastic packaging
      
      // Travel modes (IPCC 2025)
      travel_car_petrol: 0.171, // kg CO2e per km
      travel_car_diesel: 0.163, // kg CO2e per km
      travel_train_electric: 0.041, // kg CO2e per km
      travel_train_diesel: 0.089, // kg CO2e per km
      travel_bus: 0.067, // kg CO2e per km
      travel_flight_domestic: 0.245, // kg CO2e per km
      travel_flight_shorthaul: 0.198, // kg CO2e per km
      travel_flight_longhaul: 0.147, // kg CO2e per km
      
      // Regional grid intensity factors (gCO2/kWh) - IEA 2025 latest data
      grid_intensity: {
        'Norway': 14, 'Iceland': 21, 'France': 52, 'Switzerland': 61, 'Sweden': 68,
        'Austria': 76, 'Denmark': 89, 'Finland': 103, 'Belgium': 118, 'United Kingdom': 162,
        'Spain': 178, 'Italy': 208, 'Netherlands': 234, 'Germany': 298, 'Czech Republic': 367,
        'Greece': 398, 'Poland': 432,
        
        'Costa Rica': 18, 'Uruguay': 38, 'Brazil': 76, 'Canada': 98, 'Chile': 267,
        'Argentina': 289, 'United States': 342, 'Mexico': 378,
        
        'New Zealand': 74, 'Japan': 287, 'Thailand': 345, 'Singapore': 356, 'Malaysia': 441,
        'South Korea': 389, 'China': 498, 'Vietnam': 523, 'Indonesia': 567, 'Taiwan': 456,
        'India': 589, 'Australia': 398,

        'Morocco': 534, 'Egypt': 398, 'UAE': 376, 'Saudi Arabia': 342, 'South Africa': 634,
        'Nigeria': 567,
      
        'default': 387 
      }
    };
  }

  // Get electricity carbon intensity using hardcoded, precise scientific data
  async getGridIntensity(country: string): Promise<{ intensity: number; source: 'IEA_API' | 'FALLBACK'; updated: string }> {
    try {
      console.log(`Fetching dynamic grid intensity for ${country}...`);
      
      const result = await GridIntensityService.getGridIntensity(country);
      
      console.log(`✅ Grid intensity for ${country}: ${result.averageIntensity} gCO2/kWh (${result.dataSource}, updated: ${result.lastUpdated})`);
      
      return {
        intensity: result.averageIntensity,
        source: result.dataSource,
        updated: result.lastUpdated
      };
      
    } catch (error) {
      console.error(`Error fetching dynamic grid intensity for ${country}:`, error);
      
      // Fallback to hardcoded values
      const fallbackIntensity = this.emissionFactors.grid_intensity[country] || this.emissionFactors.grid_intensity['default'];
      console.log(`Using fallback grid intensity for ${country}: ${fallbackIntensity} gCO2/kWh`);
      
      return {
        intensity: fallbackIntensity,
        source: 'FALLBACK',
        updated: new Date().toISOString()
      };
    }
  }

  // 1) Ad Production (film/photo/audio shoots)
  // CO₂e_prod = (Travel_km × EF_mode) + (Power_kWh × EF_grid) + Σ(Materials_kg × EF_mat) + (Cloud_GB-months × EF_cloud)
  calculateAdProduction(travelKm: number, travelMode: string, powerKWh: number, materials: { type: string; kg: number }[], cloudGBMonths: number, gridIntensity: number): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    
    // Travel emissions
    const travelEF = this.getTravelEmissionFactor(travelMode);
    const travelEmissions = travelKm * travelEF;
    
    // Power emissions
    const powerEmissions = powerKWh * gridFactor;
    
    // Materials emissions
    let materialsEmissions = 0;
    materials.forEach(material => {
      const materialEF = this.getMaterialEmissionFactor(material.type);
      materialsEmissions += material.kg * materialEF;
    });
    
    // Cloud storage emissions
    const cloudEmissions = cloudGBMonths * this.emissionFactors.cloud_storage_per_gb_month;
    
    return {
      total: travelEmissions + powerEmissions + materialsEmissions + cloudEmissions,
      breakdown: {
        travel: travelEmissions,
        power: powerEmissions,
        materials: materialsEmissions,
        cloud: cloudEmissions
      },
      methodology: "Ad Production: Travel + Power + Materials + Cloud Storage"
    };
  }

  // 2) Digital / Programmatic Media
  // CO₂e_digital = I × ( (E_ad-tech + E_ad-server + E_CDN) / I + (Data_GB / I × EI_network) ) × EF_grid + (I × t_view × P_device × EF_grid)_optional
  calculateDigitalMedia(impressions: number, dataGB: number, viewTimeMinutes: number, gridIntensity: number, includeDeviceEnergy = false): CalculationResult {
    const I = impressions;
    const gridFactor = gridIntensity / 1000;
    
    // Ad-tech energy per impression
    const adTechEnergy = I * this.emissionFactors.ad_tech_energy;
    
    // Data transfer energy
    const dataTransferEnergy = (dataGB * 1000) * this.emissionFactors.network_data_transfer; // Convert GB to MB
    
    // Grid-adjusted emissions for core infrastructure
    const coreEmissions = (adTechEnergy + dataTransferEnergy) * gridFactor;
    
    // Optional device energy
    let deviceEmissions = 0;
    if (includeDeviceEnergy && viewTimeMinutes > 0) {
      deviceEmissions = I * viewTimeMinutes * this.emissionFactors.device_energy_mobile * gridFactor;
    }
    
    return {
      total: coreEmissions + deviceEmissions,
      breakdown: {
        ad_tech: adTechEnergy * gridFactor,
        data_transfer: dataTransferEnergy * gridFactor,
        device_energy: deviceEmissions
      },
      methodology: "Digital Media: Ad-tech energy + Data transfer + Optional device energy"
    };
  }

  // 3) Search & Social Ads (paid)
  // CO₂e_paid = U × ( (E_platform + E_ad-delivery) / U + (Data_GB / U × EI_network) ) × EF_grid
  calculatePaidSocialAds(users: number, dataGB: number, gridIntensity: number): CalculationResult {
    const U = users;
    const gridFactor = gridIntensity / 1000;
    
    // Platform energy per user
    const platformEnergy = U * this.emissionFactors.platform_energy_per_user;
    
    // Data transfer energy
    const dataTransferEnergy = (dataGB * 1000) * this.emissionFactors.network_data_transfer;
    
    const totalEmissions = (platformEnergy + dataTransferEnergy) * gridFactor;
    
    return {
      total: totalEmissions,
      breakdown: {
        platform_energy: platformEnergy * gridFactor,
        data_transfer: dataTransferEnergy * gridFactor
      },
      methodology: "Paid Social Ads: Platform energy + Ad delivery + Data transfer"
    };
  }

  // 4) Owned Social Posts (organic)
  // CO₂e_owned = N_posts × (E_creation + E_upload) × EF_grid + (Views × t_view × P_device × EF_grid)_optional
  calculateOwnedSocialPosts(posts: number, views: number, viewTimeMinutes: number, gridIntensity: number, includeDeviceEnergy = false): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    
    // Post creation and upload energy
    const creationEnergy = posts * this.emissionFactors.social_post_creation;
    const uploadEnergy = posts * this.emissionFactors.social_post_upload;
    const coreEmissions = (creationEnergy + uploadEnergy) * gridFactor;
    
    // Optional device energy for viewing
    let deviceEmissions = 0;
    if (includeDeviceEnergy && views > 0 && viewTimeMinutes > 0) {
      deviceEmissions = views * viewTimeMinutes * this.emissionFactors.device_energy_mobile * gridFactor;
    }
    
    return {
      total: coreEmissions + deviceEmissions,
      breakdown: {
        creation: creationEnergy * gridFactor,
        upload: uploadEnergy * gridFactor,
        device_energy: deviceEmissions
      },
      methodology: "Owned Social Posts: Creation + Upload + Optional viewing energy"
    };
  }

  // 5) Email Marketing
  // CO₂e_email = S × ( (Data_GB / S × EI_network) + (E_ESP / S) ) × EF_grid + (Opens × t_read × P_device × EF_grid)_optional
  calculateEmailMarketing(sends: number, dataGB: number, opens: number, readTimeMinutes: number, gridIntensity: number, includeDeviceEnergy = false): CalculationResult {
    const S = sends;
    const gridFactor = gridIntensity / 1000;
    
    // ESP energy per send
    const espEnergy = S * this.emissionFactors.esp_energy_per_send;
    
    // Data transfer energy
    const dataTransferEnergy = (dataGB * 1000) * this.emissionFactors.network_data_transfer;
    
    // Core emissions
    const coreEmissions = (espEnergy + dataTransferEnergy) * gridFactor;
    
    // Optional device energy for reading
    let deviceEmissions = 0;
    if (includeDeviceEnergy && opens > 0 && readTimeMinutes > 0) {
      deviceEmissions = opens * readTimeMinutes * this.emissionFactors.device_energy_mobile * gridFactor;
    }
    
    return {
      total: coreEmissions + deviceEmissions,
      breakdown: {
        esp_energy: espEnergy * gridFactor,
        data_transfer: dataTransferEnergy * gridFactor,
        device_energy: deviceEmissions
      },
      methodology: "Email Marketing: ESP energy + Data transfer + Optional reading energy"
    };
  }

  // 6) Website / Landing Pages
  // CO₂e_web = Visits × ( (Bytes/Visit × EI_network) + (E_origin/CDN / Visit) ) × EF_grid + Hosting_kWh × EF_grid
  calculateWebsite(visits: number, bytesPerVisit: number, hostingKWh: number, gridIntensity: number): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    
    // Data transfer per visit
    const dataMB = (bytesPerVisit / 1024 / 1024); // Convert bytes to MB
    const dataTransferEmissions = visits * dataMB * this.emissionFactors.network_data_transfer * gridFactor;
    
    // CDN/origin server energy (estimated per visit)
    const cdnEnergy = visits * this.emissionFactors.website_page_view;
    const cdnEmissions = cdnEnergy * gridFactor;
    
    // Hosting emissions
    const hostingEmissions = hostingKWh * gridFactor;
    
    return {
      total: dataTransferEmissions + cdnEmissions + hostingEmissions,
      breakdown: {
        data_transfer: dataTransferEmissions,
        cdn_origin: cdnEmissions,
        hosting: hostingEmissions
      },
      methodology: "Website: Data transfer + CDN/Origin energy + Hosting"
    };
  }

  // 7) Print (flyers, magazines, inserts)
  // CO₂e_print = Σ(Paper_mass_kg × EF_paper) + (E_printing_kWh × EF_grid) + (Freight_ton-km × EF_mode)
  calculatePrint(paperKg: number, paperType: string, printingKWh: number, freightTonKm: number, freightMode: string, gridIntensity: number): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    
    // Paper emissions based on type
    const paperEF = paperType === 'recycled' ? this.emissionFactors.paper_recycled : this.emissionFactors.paper_virgin;
    const paperEmissions = paperKg * paperEF;
    
    // Printing energy emissions
    const printingEmissions = printingKWh * gridFactor;
    
    // Freight emissions
    const freightEF = this.getFreightEmissionFactor(freightMode);
    const freightEmissions = freightTonKm * freightEF;
    
    return {
      total: paperEmissions + printingEmissions + freightEmissions,
      breakdown: {
        paper: paperEmissions,
        printing_energy: printingEmissions,
        freight: freightEmissions
      },
      methodology: "Print: Paper materials + Printing energy + Freight transport"
    };
  }

  // 8) Out-of-Home (OOH)
  // Static OOH: CO₂e_static = (Materials_kg × EF) + (Install_trips_km × EF_vehicle) + (Disposal_kg × EF_waste)
  // Digital OOH: CO₂e_DOOH = (P_screen × hours) × EF_grid + (Data_GB × EI_network × EF_grid)
  calculateOOH(type: 'static' | 'digital', materialsKg: number, installTripsKm: number, disposalKg: number, screenPowerKW: number, hours: number, dataGB: number, gridIntensity: number): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    
    if (type === 'static') {
      // Static OOH calculation
      const materialsEmissions = materialsKg * this.emissionFactors.ooh_materials_per_m2;
      const installEmissions = installTripsKm * this.emissionFactors.ooh_installation_vehicle;
      const disposalEmissions = disposalKg * this.emissionFactors.ooh_disposal_waste;
      
      return {
        total: materialsEmissions + installEmissions + disposalEmissions,
        breakdown: {
          materials: materialsEmissions,
          installation: installEmissions,
          disposal: disposalEmissions
        },
        methodology: "Static OOH: Materials + Installation transport + Disposal"
      };
    } else {
      // Digital OOH calculation
      const screenEmissions = (screenPowerKW * hours) * gridFactor;
      const dataEmissions = (dataGB * 1000) * this.emissionFactors.network_data_transfer * gridFactor;
      
      return {
        total: screenEmissions + dataEmissions,
        breakdown: {
          screen_power: screenEmissions,
          data_transfer: dataEmissions
        },
        methodology: "Digital OOH: Screen power + Data transfer"
      };
    }
  }

  // 9) Events / Experiential
  // CO₂e_events = (Venue_kWh × EF_grid) + (Booth_materials_kg × EF_mat) + (Attendee_travel_pkm × EF_mode) + (Freight_ton-km × EF_mode) + (Catering_portions × EF_menu)
  calculateEvents(venueKWh: number, boothMaterialsKg: number, attendeeTravelKm: number, travelMode: string, freightTonKm: number, freightMode: string, cateringPortions: number, menuType: string, gridIntensity: number): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    
    // Venue energy
    const venueEmissions = venueKWh * gridFactor;
    
    // Booth materials
    const boothEmissions = boothMaterialsKg * this.emissionFactors.booth_materials_standard;
    
    // Attendee travel
    const travelEF = this.getTravelEmissionFactor(travelMode);
    const attendeeTravelEmissions = attendeeTravelKm * travelEF;
    
    // Freight
    const freightEF = this.getFreightEmissionFactor(freightMode);
    const freightEmissions = freightTonKm * freightEF;
    
    // Catering
    const cateringEF = this.getCateringEmissionFactor(menuType);
    const cateringEmissions = cateringPortions * cateringEF;
    
    return {
      total: venueEmissions + boothEmissions + attendeeTravelEmissions + freightEmissions + cateringEmissions,
      breakdown: {
        venue_energy: venueEmissions,
        booth_materials: boothEmissions,
        attendee_travel: attendeeTravelEmissions,
        freight: freightEmissions,
        catering: cateringEmissions
      },
      methodology: "Events: Venue energy + Booth materials + Attendee travel + Freight + Catering"
    };
  }

  // 10) Influencer & Creator Marketing
  // CO₂e_creator = Production_footprint + Travel + Cloud/Editing + Content_delivery (use §2–5 formulas)
  calculateInfluencerMarketing(productionHours: number, productionType: string, travelKm: number, travelMode: string, cloudGBMonths: number, contentDeliveryData: { impressions: number; dataGB: number }, gridIntensity: number): CalculationResult {
    // Production footprint
    const productionEF = this.getProductionEmissionFactor(productionType);
    const productionEmissions = productionHours * productionEF;
    
    // Travel
    const travelEF = this.getTravelEmissionFactor(travelMode);
    const travelEmissions = travelKm * travelEF;
    
    // Cloud/Editing
    const cloudEmissions = cloudGBMonths * this.emissionFactors.cloud_storage_per_gb_month;
    
    // Content delivery (using digital media formula)
    const deliveryResult = this.calculateDigitalMedia(contentDeliveryData.impressions, contentDeliveryData.dataGB, 0, gridIntensity);
    
    return {
      total: productionEmissions + travelEmissions + cloudEmissions + deliveryResult.total,
      breakdown: {
        production: productionEmissions,
        travel: travelEmissions,
        cloud_editing: cloudEmissions,
        content_delivery: deliveryResult.total
      },
      methodology: "Influencer Marketing: Production + Travel + Cloud/Editing + Content delivery"
    };
  }

  // 11) PR & Press
  // CO₂e_PR = Print + Parcel_freight + Events + Travel contributions
  calculatePRPress(printContribution: number, parcelFreightTonKm: number, eventsContribution: number, travelContribution: number): CalculationResult {
    // This aggregates contributions from other formulas
    const freightEmissions = parcelFreightTonKm * this.emissionFactors.freight_truck_local;
    
    return {
      total: printContribution + freightEmissions + eventsContribution + travelContribution,
      breakdown: {
        print: printContribution,
        parcel_freight: freightEmissions,
        events: eventsContribution,
        travel: travelContribution
      },
      methodology: "PR & Press: Print materials + Parcel freight + Events + Travel"
    };
  }

  // 12) Giveaways / Merchandise
  // CO₂e_swag = Σ(Item_mass_kg × EF_material) + (Freight_ton-km × EF_mode) + (Packaging_kg × EF)
  calculateMerchandise(items: { material: string; kg: number }[], freightTonKm: number, freightMode: string, packagingKg: number, packagingType: string): CalculationResult {
    // Items emissions
    let itemsEmissions = 0;
    items.forEach(item => {
      const materialEF = this.getMaterialEmissionFactor(item.material);
      itemsEmissions += item.kg * materialEF;
    });
    
    // Freight emissions
    const freightEF = this.getFreightEmissionFactor(freightMode);
    const freightEmissions = freightTonKm * freightEF;
    
    // Packaging emissions
    const packagingEF = this.getPackagingEmissionFactor(packagingType);
    const packagingEmissions = packagingKg * packagingEF;
    
    return {
      total: itemsEmissions + freightEmissions + packagingEmissions,
      breakdown: {
        items: itemsEmissions,
        freight: freightEmissions,
        packaging: packagingEmissions
      },
      methodology: "Merchandise: Item materials + Freight transport + Packaging"
    };
  }

  // 13) Martech & Cloud Services
  // CO₂e_martech = (Cloud_kWh × EF_grid(region))
  calculateMartech(cloudKWh: number, gridIntensity: number): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    const cloudEmissions = cloudKWh * gridFactor;
    
    return {
      total: cloudEmissions,
      breakdown: {
        cloud_services: cloudEmissions
      },
      methodology: "Martech: Cloud energy consumption"
    };
  }

  // 14) Team Travel
  // CO₂e_travel = Σ(Distance_km × EF_mode/class)
  calculateTeamTravel(trips: { distance: number; mode: string }[]): CalculationResult {
    let totalEmissions = 0;
    const breakdown: CalculationBreakdown = {};
    
    trips.forEach((trip, index) => {
      const travelEF = this.getTravelEmissionFactor(trip.mode);
      const tripEmissions = trip.distance * travelEF;
      totalEmissions += tripEmissions;
      breakdown[`trip_${index + 1}_${trip.mode}`] = tripEmissions;
    });
    
    return {
      total: totalEmissions,
      breakdown,
      methodology: "Team Travel: Sum of all trips by mode and distance"
    };
  }

  // 15) Office Energy Allocation
  // CO₂e_office→mktg = (Office_kWh × EF_grid) × Allocation_share
  calculateOfficeEnergyAllocation(officeKWh: number, allocationShare: number, gridIntensity: number): CalculationResult {
    const gridFactor = gridIntensity / 1000;
    const allocatedEmissions = officeKWh * gridFactor * allocationShare;
    
    return {
      total: allocatedEmissions,
      breakdown: {
        allocated_office_energy: allocatedEmissions
      },
      methodology: "Office Energy Allocation: Office energy × Grid factor × Allocation share"
    };
  }

  // Helper methods for emission factors
  private getTravelEmissionFactor(mode: string): number {
    const modeMap: { [key: string]: number } = {
      'car_petrol': this.emissionFactors.travel_car_petrol,
      'car_diesel': this.emissionFactors.travel_car_diesel,
      'train_electric': this.emissionFactors.travel_train_electric,
      'train_diesel': this.emissionFactors.travel_train_diesel,
      'bus': this.emissionFactors.travel_bus,
      'flight_domestic': this.emissionFactors.travel_flight_domestic,
      'flight_shorthaul': this.emissionFactors.travel_flight_shorthaul,
      'flight_longhaul': this.emissionFactors.travel_flight_longhaul,
      'road_km': this.emissionFactors.travel_car_petrol, // Default
      'rail_km': this.emissionFactors.travel_train_electric, // Default
      'shorthaul_air_km': this.emissionFactors.travel_flight_shorthaul,
      'longhaul_air_km': this.emissionFactors.travel_flight_longhaul
    };
    return modeMap[mode.toLowerCase()] || this.emissionFactors.travel_car_petrol;
  }

  private getFreightEmissionFactor(mode: string): number {
    const modeMap: { [key: string]: number } = {
      'truck_local': this.emissionFactors.freight_truck_local,
      'truck_longhaul': this.emissionFactors.freight_truck_longhaul,
      'air': this.emissionFactors.air_freight,
      'ocean': this.emissionFactors.ocean_freight
    };
    return modeMap[mode.toLowerCase()] || this.emissionFactors.freight_truck_local;
  }

  private getMaterialEmissionFactor(material: string): number {
    const materialMap: { [key: string]: number } = {
      'cotton': this.emissionFactors.material_cotton,
      'polyester': this.emissionFactors.material_polyester,
      'plastic': this.emissionFactors.material_plastic,
      'metal': this.emissionFactors.material_metal,
      'electronics': this.emissionFactors.material_electronics,
      'material_kg': this.emissionFactors.material_plastic, // Default
      'material_merch_kg': this.emissionFactors.material_cotton // Default for merch
    };
    return materialMap[material.toLowerCase()] || this.emissionFactors.material_plastic;
  }

  private getPackagingEmissionFactor(type: string): number {
    const packagingMap: { [key: string]: number } = {
      'cardboard': this.emissionFactors.packaging_cardboard,
      'plastic': this.emissionFactors.packaging_plastic
    };
    return packagingMap[type.toLowerCase()] || this.emissionFactors.packaging_cardboard;
  }

  private getCateringEmissionFactor(menuType: string): number {
    const menuMap: { [key: string]: number } = {
      'meat': this.emissionFactors.catering_meat,
      'vegetarian': this.emissionFactors.catering_vegetarian,
      'vegan': this.emissionFactors.catering_vegan
    };
    return menuMap[menuType.toLowerCase()] || this.emissionFactors.catering_meat;
  }

  private getProductionEmissionFactor(type: string): number {
    const productionMap: { [key: string]: number } = {
      'video': this.emissionFactors.video_production_energy,
      'photo': this.emissionFactors.photo_production_energy,
      'audio': this.emissionFactors.audio_production_energy,
      'production_hour': this.emissionFactors.video_production_energy // Default
    };
    return productionMap[type.toLowerCase()] || this.emissionFactors.video_production_energy;
  }

  // Main calculation method following GHG Protocol framework
  async calculateWithGHGProtocol(userInput: GHGUserInput): Promise<GHGProtocolResult> {
    try {
      console.log('GHG Protocol calculation starting for:', userInput);
      
      const country = userInput.market || userInput.country || 'United States';
      const quantity = userInput.quantity || 1;
      const activityType = userInput.activityType || userInput.unit || '';
      const channel = userInput.channel || '';
      const includeDeviceEnergy = userInput.includeDeviceEnergy || false;
      
      // Get hardcoded electricity carbon intensity (scientific data)
      const { intensity: gridIntensity } = await this.getGridIntensity(country);
      console.log(`Grid intensity for ${country}: ${gridIntensity} gCO2/kWh`);
      
      let calculation: CalculationResult;
      
      // Route to appropriate GHG Protocol calculation based on activity type and channel
      switch(activityType.toLowerCase()) {
        case 'adtech_impression':
        case 'impressions':
          // Digital/Programmatic Media
          const dataGB = userInput.dataGB || quantity * 0.000001;
          calculation = this.calculateDigitalMedia(quantity, dataGB, userInput.viewTimeMinutes || 0.5, gridIntensity, includeDeviceEnergy);
          break;
          
        case 'email_send':
        case 'email':
          // Email Marketing
          const emailDataGB = userInput.dataGB || quantity * 0.00001;
          const opens = quantity * 0.25; // 25% open rate estimate
          calculation = this.calculateEmailMarketing(quantity, emailDataGB, opens, 1, gridIntensity, includeDeviceEnergy);
          break;
          
        case 'social_impression':
        case 'click_through':
          // Paid Social/Search Ads
          const clickDataGB = userInput.dataGB || quantity * 0.00005;
          calculation = this.calculatePaidSocialAds(quantity, clickDataGB, gridIntensity);
          break;
          
        case 'social_post':
        case 'social_engagement':
          // Owned Social Posts
          const views = quantity * 10; // Estimate 10 views per post
          calculation = this.calculateOwnedSocialPosts(quantity, views, 0.5, gridIntensity, includeDeviceEnergy);
          break;
          
        case 'web_visit':
          // Website/Landing Pages
          const bytesPerVisit = userInput.dataGB ? userInput.dataGB * 1024 * 1024 * 1024 : this.emissionFactors.bytes_per_visit_default;
          const hostingKWh = userInput.powerKWh || quantity * 0.000001;
          calculation = this.calculateWebsite(quantity, bytesPerVisit, hostingKWh, gridIntensity);
          break;
          
        case 'hosting_kwh':
          // Martech & Cloud Services
          calculation = this.calculateMartech(quantity, gridIntensity);
          break;
          
        case 'paper_kg':
          // Print Materials
          const printingKWh = quantity * this.emissionFactors.printing_energy_per_page * 500; // Estimate pages per kg
          const freightTonKm = quantity * 0.001; // Estimate freight
          calculation = this.calculatePrint(quantity, 'virgin', printingKWh, freightTonKm, 'truck_local', gridIntensity);
          break;
          
        case 'dooh_screen_hour':
          // Digital OOH
          const screenArea = 1; // 1 m² default
          const screenPower = this.emissionFactors.dooh_screen_power_per_hour * screenArea;
          const doohDataGB = quantity * 0.001; // Estimate data per screen hour
          calculation = this.calculateOOH('digital', 0, 0, 0, screenPower, quantity, doohDataGB, gridIntensity);
          break;
          
        case 'ooh_board_week':
        case 'ooh_installation':
          // Static OOH
          const materialsKg = quantity * 5; // Estimate materials per board/installation
          const installKm = quantity * 10; // Estimate installation travel
          const disposalKg = materialsKg * 0.1; // Estimate disposal
          calculation = this.calculateOOH('static', materialsKg, installKm, disposalKg, 0, 0, 0, gridIntensity);
          break;
          
        case 'production_hour':
          // Ad Production
          const prodTravelKm = quantity * 5; // Estimate travel per hour
          const prodPowerKWh = quantity * 2; // Estimate power per hour
          const prodMaterials = [{ type: 'electronics', kg: quantity * 0.1 }];
          const prodCloudGB = quantity * 1; // Estimate cloud storage
          calculation = this.calculateAdProduction(prodTravelKm, 'car_petrol', prodPowerKWh, prodMaterials, prodCloudGB, gridIntensity);
          break;
          
        case 'material_kg':
        case 'material_merch_kg':
          // Merchandise
          const items = [{ material: 'cotton', kg: quantity }];
          const merchFreightTonKm = quantity * 0.001;
          const merchPackagingKg = quantity * 0.1;
          calculation = this.calculateMerchandise(items, merchFreightTonKm, 'truck_local', merchPackagingKg, 'cardboard');
          break;
          
        case 'influencer_collab':
        case 'content_piece':
          // Influencer Marketing
          const infProdHours = quantity * 2; // Estimate production hours
          const infTravelKm = quantity * 20; // Estimate travel
          const infCloudGB = quantity * 0.5; // Estimate cloud usage
          const infDeliveryData = { impressions: quantity * 1000, dataGB: quantity * 0.01 };
          calculation = this.calculateInfluencerMarketing(infProdHours, 'video', infTravelKm, 'car_petrol', infCloudGB, infDeliveryData, gridIntensity);
          break;
          
        case 'press_release':
        case 'media_event':
          // PR & Press
          const prPrint = quantity * 0.5; // Estimate print contribution
          const prFreight = quantity * 0.01; // Estimate parcel freight
          const prEvents = quantity * 2; // Estimate events contribution
          const prTravel = quantity * 1; // Estimate travel contribution
          calculation = this.calculatePRPress(prPrint, prFreight, prEvents, prTravel);
          break;
          
        case 'road_km':
        case 'rail_km':
        case 'shorthaul_air_km':
        case 'longhaul_air_km':
          // Team Travel
          const travelMode = activityType.replace('_km', '').replace('shorthaul_air', 'flight_shorthaul').replace('longhaul_air', 'flight_longhaul');
          const trips = [{ distance: quantity, mode: travelMode }];
          calculation = this.calculateTeamTravel(trips);
          break;
          
        case 'office_energy_kwh':
          // Office Energy Allocation
          const allocationShare = 0.1; // 10% default allocation to marketing
          calculation = this.calculateOfficeEnergyAllocation(quantity, allocationShare, gridIntensity);
          break;
          
        default:
          // Default digital calculation for unknown types
          const defaultDataGB = userInput.dataGB || quantity * 0.000001;
          calculation = this.calculateDigitalMedia(quantity, defaultDataGB, 0, gridIntensity, includeDeviceEnergy);
      }
      
      const result: GHGProtocolResult = {
        success: true,
        data: {
          totalEmissions: Math.round(calculation.total * 100000) / 100000, // 5 decimal precision
          breakdown: {
            digital_processing: calculation.breakdown.ad_tech || calculation.breakdown.platform_energy || calculation.breakdown.creation || 0,
            energy_consumption: calculation.breakdown.data_transfer || calculation.breakdown.power || calculation.breakdown.screen_power || 0,
            device_energy: calculation.breakdown.device_energy || 0,
            supply_chain: calculation.breakdown.freight || 0,
            materials: calculation.breakdown.paper || calculation.breakdown.materials || calculation.breakdown.items || 0,
            transport: calculation.breakdown.travel || calculation.breakdown.installation || 0,
            waste: calculation.breakdown.disposal || 0
          },
          methodology: calculation.methodology,
          country: country,
          gridIntensity: gridIntensity,
          recommendations: this.generateGHGRecommendations(calculation.total, activityType, channel),
          sustainabilityRating: this.getGHGSustainabilityRating(calculation.total)
        }
      };

      console.log('Final GHG Protocol result:', result);
      return result;

    } catch (error: any) {
      console.error('GHG Protocol calculation error:', error);
      throw new Error('GHG Protocol calculation failed: ' + error.message);
    }
  }

  // Generate GHG Protocol-based recommendations
  generateGHGRecommendations(totalEmissions: number, activityType: string, channel: string): string[] {
    const recommendations: string[] = [];
    
    if (totalEmissions > 0.01) recommendations.push("Consider renewable energy sources to reduce grid intensity impact.");
    
    if (activityType.match(/impression|digital/i) || channel.match(/Digital Ads|Search & Social Ads/i)) {
      recommendations.push("Optimize ad targeting to reduce unnecessary impressions.");
      recommendations.push("Use efficient ad formats to minimize data transfer.");
    }
    
    if (activityType.match(/email/i) || channel.match(/Email/i)) {
      recommendations.push("Optimize email list to reduce sending to inactive recipients.");
      recommendations.push("Use efficient email design to minimize size.");
    }
    
    if (activityType.match(/print|paper/i) || channel.match(/Print/i)) {
      recommendations.push("Consider recycled paper materials.");
      recommendations.push("Optimize local printing to reduce freight emissions.");
    }
    
    if (activityType.match(/travel|km/i) || channel.match(/Travel/i)) {
      recommendations.push("Consider virtual alternatives to reduce travel emissions.");
      recommendations.push("Use public transport or electric vehicles where possible.");
    }
    
    if (channel.match(/Events/i)) {
      recommendations.push("Choose venues with renewable energy sources.");
      recommendations.push("Optimize catering with local and sustainable options.");
    }
    
    recommendations.push("Offset remaining emissions through verified carbon credits.");
    
    return recommendations;
  }

  // GHG Protocol sustainability rating
  getGHGSustainabilityRating(totalEmissions: number): string {
    if (totalEmissions < 0.001) return 'Excellent - Very Low Carbon Impact';
    if (totalEmissions < 0.01) return 'Good - Low Carbon Impact';
    if (totalEmissions < 0.1) return 'Fair - Moderate Carbon Impact';
    return 'Poor - High Carbon Impact - Consider Optimization';
  }

  async calculateWithAI(userInput: GHGUserInput): Promise<GHGProtocolResult> {
    return await this.calculateWithGHGProtocol(userInput);
  }
  
}