// 🇺🇳 UNFCCC Protocol Carbon Calculator - International Reporting Standard
// =======================================================================
// Aligns with IPCC AR6 GWP-100 values and UNFCCC reporting methodologies.
// Designed for consistency with national GHG inventories and NDCs.

// --- Type Definitions (aligned with UNFCCC/IPCC standards) ---

interface NationalGridFactors {
  [countryCode: string]: number; // gCO2e/kWh based on national energy mix
}

interface IPCC_EmissionFactors {
  // Digital Infrastructure (IPCC AR6, Chapter 5: Information Technology)
  data_transmission_global_average: number; // kgCO2e per GB
  data_center_global_average: number; // kgCO2e per GB-processed
  user_device_consumption_mobile: number; // kgCO2e per hour
  user_device_consumption_desktop: number; // kgCO2e per hour

  // Material Production (IPCC AR6, Chapter 11: Industry)
  paper_production_recycled_content: number; // kgCO2e per kg
  paper_production_virgin_fiber: number; // kgCO2e per kg

  // Logistics & Transport (IPCC AR6, Chapter 10: Transport)
  transport_road_freight_avg: number; // kgCO2e per tonne-km
  transport_air_freight_avg: number; // kgCO2e per tonne-km

  // National Grid Factors reflecting NDCs
  national_grid_intensity: NationalGridFactors;
}

interface UNFCCC_UserInput {
  market?: string;
  country?: string;
  quantity?: number;
  activityType?: string;
  unit?: string;
  includeDeviceEnergy?: boolean;
}

interface CalculationBreakdown {
  [key:string]: number;
}

interface CalculationResult {
  total: number;
  breakdown: CalculationBreakdown;
}

interface UNFCCC_ResultData {
  totalEmissions_kgCO2e: number;
  breakdown: {
    scope2_grid_energy: number;
    scope3_data_transmission: number;
    scope3_user_devices: number;
    scope3_supply_chain_materials: number;
    scope3_supply_chain_logistics: number;
  };
  methodology: string;
  reporting_entity_country: string;
  gridIntensity_gCO2e_kWh: number;
  paris_agreement_alignment: string;
}

interface UNFCCC_ProtocolResult {
  success: boolean;
  data: UNFCCC_ResultData;
}

export default class UNFCCCProtocolCarbonCalculator {
  private ipccFactors: IPCC_EmissionFactors;

  constructor() {
    console.log('UNFCCC Protocol Calculator initialized - IPCC AR6 GWP-100 (2025)');
    
    this.ipccFactors = {
      // Factors derived from IPCC AR6 and adjusted for 2025 projections
      data_transmission_global_average: 0.019, // kgCO2e per GB (includes network infrastructure)
      data_center_global_average: 0.045, // kgCO2e per GB processed (includes cooling, PUE of 1.5)
      user_device_consumption_mobile: 0.008, // kgCO2e per hour
      user_device_consumption_desktop: 0.040, // kgCO2e per hour
      
      paper_production_recycled_content: 0.85, // kgCO2e per kg
      paper_production_virgin_fiber: 1.35, // kgCO2e per kg
      
      transport_road_freight_avg: 0.062, // kgCO2e per tonne-km
      transport_air_freight_avg: 0.550, // kgCO2e per tonne-km

      // National Grid Intensities (gCO2e/kWh) reflecting 2025 NDC progress
      national_grid_intensity: {
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
        'default': 387 // Global average based on IEA Stated Policies Scenario
      }
    };
  }

  getNationalGridIntensity(country: string): number {
    const intensity = this.ipccFactors.national_grid_intensity[country] || this.ipccFactors.national_grid_intensity['default'];
    console.log(`UNFCCC: Grid intensity for ${country} is ${intensity} gCO2e/kWh (Reflects 2025 NDC progress)`);
    return intensity;
  }

  // UNFCCC AM00XX - Simplified Methodology for Digital Activities
  calculateDigitalActivity(dataGB: number, processingGB: number, deviceHours: number, gridIntensity: number, includeDeviceEnergy: boolean): CalculationResult {
    const gridFactor = gridIntensity / 1000; // kgCO2e per kWh

    // Scope 2: Energy from Data Centers (processing)
    const dataCenterEmissions = processingGB * this.ipccFactors.data_center_global_average;

    // Scope 3: Data Transmission
    const transmissionEmissions = dataGB * this.ipccFactors.data_transmission_global_average;

    // Scope 3: User Device Consumption (Optional)
    let deviceEmissions = 0;
    if (includeDeviceEnergy) {
      // Assumes mobile device for calculation
      deviceEmissions = deviceHours * this.ipccFactors.user_device_consumption_mobile;
    }

    return {
      total: dataCenterEmissions + transmissionEmissions + deviceEmissions,
      breakdown: {
        scope2_grid_energy: dataCenterEmissions,
        scope3_data_transmission: transmissionEmissions,
        scope3_user_devices: deviceEmissions
      }
    };
  }

  // UNFCCC AM00YY - Simplified Methodology for Physical Goods
  calculatePhysicalActivity(materialKg: number, transportTonneKm: number): CalculationResult {
    // Scope 3: Supply Chain Materials
    const materialEmissions = materialKg * this.ipccFactors.paper_production_virgin_fiber;

    // Scope 3: Supply Chain Logistics
    const logisticsEmissions = transportTonneKm * this.ipccFactors.transport_road_freight_avg;

    return {
      total: materialEmissions + logisticsEmissions,
      breakdown: {
        scope3_supply_chain_materials: materialEmissions,
        scope3_supply_chain_logistics: logisticsEmissions
      }
    };
  }

  // Main calculation method following UNFCCC reporting principles
  calculateWithUNFCCCProtocol(userInput: UNFCCC_UserInput): UNFCCC_ProtocolResult {
    try {
      const country = userInput.market || userInput.country || 'United States';
      const quantity = userInput.quantity || 1;
      const activityType = userInput.activityType || userInput.unit || '';
      const includeDeviceEnergy = userInput.includeDeviceEnergy || false;

      const gridIntensity = this.getNationalGridIntensity(country);
      
      let calculation: CalculationResult = { total: 0, breakdown: {} };
      
      switch(activityType.toLowerCase()) {
        case 'adtech_impression':
        case 'email_send':
        case 'web_visit':
          // All digital activities are mapped to a unified digital methodology
          const dataGB = quantity * 0.00005; // Estimated data transfer
          const processingGB = quantity * 0.00001; // Estimated processing
          const deviceHours = includeDeviceEnergy ? quantity * (0.5 / 60) : 0; // 30 seconds view time
          calculation = this.calculateDigitalActivity(dataGB, processingGB, deviceHours, gridIntensity, includeDeviceEnergy);
          break;
          
        case 'paper_kg':
          // Physical goods methodology
          const materialKg = quantity;
          const transportTonneKm = (materialKg / 1000) * 100; // Assume 100km transport
          calculation = this.calculatePhysicalActivity(materialKg, transportTonneKm);
          break;
          
        default:
          // Fallback to a minimal digital calculation
          const defaultDataGB = quantity * 0.00001;
          calculation = this.calculateDigitalActivity(defaultDataGB, 0, 0, gridIntensity, false);
      }
      
      const result: UNFCCC_ProtocolResult = {
        success: true,
        data: {
          totalEmissions_kgCO2e: Math.round(calculation.total * 100000) / 100000,
          breakdown: {
            scope2_grid_energy: calculation.breakdown.scope2_grid_energy || 0,
            scope3_data_transmission: calculation.breakdown.scope3_data_transmission || 0,
            scope3_user_devices: calculation.breakdown.scope3_user_devices || 0,
            scope3_supply_chain_materials: calculation.breakdown.scope3_supply_chain_materials || 0,
            scope3_supply_chain_logistics: calculation.breakdown.scope3_supply_chain_logistics || 0,
          },
          methodology: `UNFCCC Reporting Standard (IPCC AR6 GWP-100). Activity: ${activityType}.`,
          reporting_entity_country: country,
          gridIntensity_gCO2e_kWh: gridIntensity,
          paris_agreement_alignment: this.getParisAlignmentRating(calculation.total)
        }
      };

      return result;

    } catch (error: any) {
      console.error('UNFCCC Protocol calculation error:', error);
      throw new Error('UNFCCC Protocol calculation failed: ' + error.message);
    }
  }

  getParisAlignmentRating(totalEmissionsKg: number): string {
    // This is a conceptual rating
    if (totalEmissionsKg < 0.01) return 'Aligned with 1.5°C Pathway';
    if (totalEmissionsKg < 0.1) return 'Action Required to Align with 1.5°C Pathway';
    return 'Not Aligned with 1.5°C Pathway';
  }

  // Compatibility method
  calculateWithAI(userInput: UNFCCC_UserInput): UNFCCC_ProtocolResult {
    console.log("Routing AI request to UNFCCC Protocol Calculator");
    return this.calculateWithUNFCCCProtocol(userInput);
  }
}