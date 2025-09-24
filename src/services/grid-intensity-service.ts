interface IEAGridData {
  ISO3: string;
  Date: string;
  DayType: string;
  Value: number;
}

interface GridIntensityResult {
  country: string;
  iso3: string;
  averageIntensity: number;
  currentHourIntensity: number;
  dataSource: 'IEA_API' | 'FALLBACK';
  lastUpdated: string;
}

export class GridIntensityService {
  private static readonly IEA_API_BASE = 'https://api.iea.org/rte/co2/hourly';
  private static readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache
  private static cache = new Map<string, { data: GridIntensityResult; timestamp: number }>();
  
  // Country to ISO3 mapping
  private static readonly COUNTRY_ISO_MAP: { [key: string]: string } = {
    'India': 'IND',
    'United States': 'USA',
    'United Kingdom': 'GBR',
    'Germany': 'DEU',
    'France': 'FRA',
    'Italy': 'ITA',
    'Spain': 'ESP',
    'Netherlands': 'NLD',
    'Poland': 'POL',
    'Sweden': 'SWE',
    'Norway': 'NOR',
    'Denmark': 'DNK',
    'Finland': 'FIN',
    'Belgium': 'BEL',
    'Austria': 'AUT',
    'Switzerland': 'CHE',
    'Czech Republic': 'CZE',
    'Greece': 'GRC',
    'Portugal': 'PRT',
    'Ireland': 'IRL',
    'Hungary': 'HUN',
    'Slovakia': 'SVK',
    'Slovenia': 'SVN',
    'Estonia': 'EST',
    'Latvia': 'LVA',
    'Lithuania': 'LTU',
    'Luxembourg': 'LUX',
    'Malta': 'MLT',
    'Cyprus': 'CYP',
    'Bulgaria': 'BGR',
    'Romania': 'ROU',
    'Croatia': 'HRV',
    'Canada': 'CAN',
    'Mexico': 'MEX',
    'Brazil': 'BRA',
    'Argentina': 'ARG',
    'Chile': 'CHL',
    'Uruguay': 'URY',
    'Costa Rica': 'CRI',
    'Japan': 'JPN',
    'South Korea': 'KOR',
    'China': 'CHN',
    'Australia': 'AUS',
    'New Zealand': 'NZL',
    'Singapore': 'SGP',
    'Thailand': 'THA',
    'Malaysia': 'MYS',
    'Indonesia': 'IDN',
    'Vietnam': 'VNM',
    'Taiwan': 'TWN',
    'South Africa': 'ZAF',
    'Egypt': 'EGY',
    'Morocco': 'MAR',
    'Nigeria': 'NGA',
    'Saudi Arabia': 'SAU',
    'UAE': 'ARE'
  };

  // Fallback values (same as current hardcoded values)
  private static readonly FALLBACK_INTENSITIES: { [key: string]: number } = {
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
  };

  static async getGridIntensity(country: string): Promise<GridIntensityResult> {
    try {
      const cacheKey = country.toLowerCase();
      const cached = this.cache.get(cacheKey);
      
      // Check cache first
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log(`Using cached grid intensity for ${country}: ${cached.data.averageIntensity} gCO2/kWh`);
        return cached.data;
      }

      // Get ISO3 code
      const iso3 = this.COUNTRY_ISO_MAP[country];
      if (!iso3) {
        console.log(`No ISO3 mapping found for ${country}, using fallback`);
        return this.getFallbackIntensity(country);
      }

      // Fetch from IEA API
      const result = await this.fetchFromIEA(country, iso3);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;

    } catch (error) {
      console.error(`Error fetching grid intensity for ${country}:`, error);
      return this.getFallbackIntensity(country);
    }
  }

  private static async fetchFromIEA(country: string, iso3: string): Promise<GridIntensityResult> {
    // Calculate date range (last 7 days for better average)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const fromDate = startDate.toISOString().split('T')[0];
    const toDate = endDate.toISOString().split('T')[0];
    
    const url = `${this.IEA_API_BASE}/${iso3}/timeseries?from=${fromDate}&to=${toDate}&co2Metric=average`;
    
    console.log(`Fetching grid intensity from IEA API: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CarbonCut-Calculator/1.0'
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`IEA API error: ${response.status} ${response.statusText}`);
    }

    const data: IEAGridData[] = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('No data received from IEA API');
    }

    // Calculate average intensity
    const totalIntensity = data.reduce((sum, item) => sum + item.Value, 0);
    const averageIntensity = Math.round(totalIntensity / data.length);

    // Get current hour intensity (approximate)
    const currentHour = new Date().getHours();
    const currentHourData = data.find(item => {
      const hour = parseInt(item.Date.replace('h', ''));
      return hour === currentHour;
    });
    
    const currentHourIntensity = currentHourData ? Math.round(currentHourData.Value) : averageIntensity;

    console.log(`✅ IEA API data for ${country} (${iso3}): Average ${averageIntensity} gCO2/kWh, Current hour ${currentHourIntensity} gCO2/kWh`);

    return {
      country,
      iso3,
      averageIntensity,
      currentHourIntensity,
      dataSource: 'IEA_API',
      lastUpdated: new Date().toISOString()
    };
  }

  private static getFallbackIntensity(country: string): GridIntensityResult {
    const intensity = this.FALLBACK_INTENSITIES[country] || this.FALLBACK_INTENSITIES['default'];
    
    console.log(`Using fallback grid intensity for ${country}: ${intensity} gCO2/kWh`);
    
    return {
      country,
      iso3: this.COUNTRY_ISO_MAP[country] || 'UNK',
      averageIntensity: intensity,
      currentHourIntensity: intensity,
      dataSource: 'FALLBACK',
      lastUpdated: new Date().toISOString()
    };
  }

  // Clear cache method for testing/admin purposes
  static clearCache(): void {
    this.cache.clear();
    console.log('Grid intensity cache cleared');
  }

  // Get cache status for debugging
  static getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}