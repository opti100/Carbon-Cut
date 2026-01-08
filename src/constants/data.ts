import { ActivityData, CountryData } from '@/types/types'

export const CHANNELS: Record<string, Array<[string, string]>> = {
  'Ad Production': [
    ['Travel (km)', 'travel_km'],
    ['Electricity (kWh)', 'electricity_kWh'],
    ['Materials (kg)', 'materials_kg'],
    ['Cloud storage (GB/month)', 'cloud_storage_gb_months'],
  ],
  'Call Centers/Telemarketing': [
    ['Agent time (hours)', 'agent_time_hours'],
    ['Device power (Watts)', 'agent_device_watts'],
    ['Server power (kWh)', 'call_center_server_kwh'],
  ],
  'Cinema Advertising': [
    ['Projector power (kWh)', 'cinema_projector_kwh'],
    ['Film stock (kg)', 'film_stock_kg'],
    ['Distribution (GB)', 'cinema_distribution_gb'],
  ],
  'Direct Mail': [
    ['Paper (kg)', 'direct_mail_paper_kg'],
    ['Printing energy (kWh)', 'direct_mail_printing_kwh'],
    ['Mail delivery (ton-km)', 'mail_delivery_ton_km'],
  ],
  'Digital / Programmatic Media': [
    ['Impressions', 'adtech_impression'],
    ['Data transfer (GB)', 'network_GB'],
  ],
  'DOOH (Digital billboards)': [
    ['Screen power (kWh)', 'dooh_screen_kwh'],
    ['Runtime (hours)', 'dooh_runtime_hours'],
    ['Data transfer (GB)', 'dooh_data_gb'],
  ],
  'Email Marketing': [
    ['Emails sent', 'email_send'],
    ['Data transfer (GB)', 'email_data_gb'],
    ['Email opens', 'email_opens'],
    ['Reading time (hours)', 'reading_time_hours'],
  ],
  'Events/Experiential': [
    ['Venue energy (kWh)', 'venue_energy_kwh'],
    ['Booth materials (kg)', 'booth_materials_kg'],
    ['Attendee travel (passenger-km)', 'attendee_travel_km'],
    ['Freight (ton-km)', 'freight_ton_km'],
    ['Catering (meals)', 'catering_meals'],
  ],
  'Giveaways/Merchandise': [
    ['Materials (kg)', 'merch_materials_kg'],
    ['Distribution (ton-km)', 'merch_distribution_ton_km'],
    ['Packaging (kg)', 'packaging_kg'],
  ],
  'Influencer Marketing': [
    ['Editing/compute (kWh)', 'editing_kwh'],
    ['Travel (km)', 'influencer_travel_km'],
    ['Content delivery (GB)', 'content_delivery_gb'],
  ],
  'Live Streams/Webinars': [
    ['Stream time (hours)', 'stream_time_hours'],
    ['Participants', 'stream_participants'],
    ['Device power (Watts)', 'stream_device_watts'],
    ['Data transfer (GB)', 'stream_data_gb'],
  ],
  'Martech & Cloud': [
    ['Cloud compute (kWh)', 'cloud_compute_kwh'],
    ['SaaS hosting (kWh)', 'saas_hosting_kwh'],
  ],
  'Out-of-Home (Static)': [
    ['Materials/waste (kg)', 'ooh_materials_kg'],
    ['Installation travel (km)', 'install_travel_km'],
  ],
  'Outdoor Guerrilla Marketing': [
    ['Materials (kg)', 'guerrilla_materials_kg'],
    ['Installation power (kWh)', 'guerrilla_power_kwh'],
    ['Team travel (km)', 'guerrilla_travel_km'],
  ],
  'Owned Social Posts': [
    ['Posts', 'social_post'],
    ['Views', 'social_views'],
    ['View time (hours)', 'view_time_hours'],
    ['Device power (Watts)', 'device_watts'],
  ],
  'Point-of-Sale Materials': [
    ['Materials (kg)', 'pos_materials_kg'],
    ['Manufacturing energy (kWh)', 'pos_manufacturing_kwh'],
    ['Distribution (ton-km)', 'pos_distribution_ton_km'],
  ],
  'PR & Press': [
    ['Printed press (kg)', 'printed_press_kg'],
    ['Parcel shipping (ton-km)', 'parcel_shipping_ton_km'],
    ['Travel (km)', 'pr_travel_km'],
  ],
  Print: [
    ['Paper (kg)', 'paper_kg'],
    ['Printing energy (kWh)', 'printing_kwh'],
    ['Distribution (ton-km)', 'distribution_ton_km'],
  ],
  'Radio Advertising': [
    ['Broadcast time (hours)', 'radio_broadcast_hours'],
    ['Station power (kWh)', 'radio_station_kwh'],
    ['Streaming data (GB)', 'radio_streaming_gb'],
  ],
  'Search & Social Ads': [
    ['Ad deliveries/impressions', 'social_impression'],
    ['Data transfer (GB)', 'data_transfer_gb'],
  ],
  Sponsorships: [
    ['Event allocation (%)', 'sponsorship_allocation_percent'],
    ['Event energy (kWh)', 'sponsorship_event_kwh'],
    ['Attendee travel (passenger-km)', 'sponsorship_attendee_travel_km'],
    ['Freight (ton-km)', 'sponsorship_freight_ton_km'],
    ['Catering (meals)', 'sponsorship_catering_meals'],
  ],
  'Television Advertising': [
    ['Studio runtime (hours)', 'tv_studio_hours'],
    ['Studio power (kWh)', 'tv_studio_kwh'],
    ['Content distribution (GB)', 'tv_content_gb'],
  ],
  'Website / Landing Pages': [
    ['Site visits', 'web_visit'],
    ['Data per visit (bytes)', 'data_per_visit_bytes'],
    ['Hosting (kWh)', 'hosting_kWh'],
  ],
}

// Approximate conversion factors for activity types
// These show equivalent quantities: "1 unit of X ≈ Y units of Z"
export const ACTIVITY_CONVERSIONS: Record<string, Record<string, number>> = {
  // Ad Production conversions
  travel_km: {
    electricity_kWh: 0.5, // 1 km travel ≈ 0.5 kWh electricity
    materials_kg: 0.15, // 1 km travel ≈ 0.15 kg materials
    cloud_storage_gb_months: 3.2, // 1 km travel ≈ 3.2 GB storage
  },
  electricity_kWh: {
    travel_km: 2.0,
    materials_kg: 0.3,
    cloud_storage_gb_months: 6.4,
  },
  materials_kg: {
    travel_km: 6.67,
    electricity_kWh: 3.33,
    cloud_storage_gb_months: 21.3,
  },
  cloud_storage_gb_months: {
    travel_km: 0.31,
    electricity_kWh: 0.16,
    materials_kg: 0.05,
  },

  // Call Centers conversions
  agent_time_hours: {
    agent_device_watts: 65, // 1 hour ≈ 65 Watts
    call_center_server_kwh: 0.25, // 1 hour ≈ 0.25 kWh server
  },
  agent_device_watts: {
    agent_time_hours: 0.015,
    call_center_server_kwh: 0.004,
  },
  call_center_server_kwh: {
    agent_time_hours: 4.0,
    agent_device_watts: 260,
  },

  // Cinema Advertising conversions
  cinema_projector_kwh: {
    film_stock_kg: 0.8,
    cinema_distribution_gb: 15.5,
  },
  film_stock_kg: {
    cinema_projector_kwh: 1.25,
    cinema_distribution_gb: 19.4,
  },
  cinema_distribution_gb: {
    cinema_projector_kwh: 0.065,
    film_stock_kg: 0.052,
  },

  // Direct Mail conversions
  direct_mail_paper_kg: {
    direct_mail_printing_kwh: 2.5,
    mail_delivery_ton_km: 0.15,
  },
  direct_mail_printing_kwh: {
    direct_mail_paper_kg: 0.4,
    mail_delivery_ton_km: 0.06,
  },
  mail_delivery_ton_km: {
    direct_mail_paper_kg: 6.67,
    direct_mail_printing_kwh: 16.67,
  },

  // Digital/Programmatic conversions
  adtech_impression: {
    network_GB: 0.000025, // 1 impression ≈ 0.000025 GB
  },
  network_GB: {
    adtech_impression: 40000, // 1 GB ≈ 40,000 impressions
  },

  // DOOH conversions
  dooh_screen_kwh: {
    dooh_runtime_hours: 1.5,
    dooh_data_gb: 8.3,
  },
  dooh_runtime_hours: {
    dooh_screen_kwh: 0.67,
    dooh_data_gb: 5.5,
  },
  dooh_data_gb: {
    dooh_screen_kwh: 0.12,
    dooh_runtime_hours: 0.18,
  },

  // Email Marketing conversions
  email_send: {
    email_data_gb: 0.000075, // 1 email ≈ 0.000075 GB
    email_opens: 0.3, // 30% open rate
    reading_time_hours: 0.0008, // ~3 seconds per email
  },
  email_data_gb: {
    email_send: 13333,
    email_opens: 4000,
    reading_time_hours: 10.67,
  },
  email_opens: {
    email_send: 3.33,
    email_data_gb: 0.00025,
    reading_time_hours: 0.0027,
  },
  reading_time_hours: {
    email_send: 1250,
    email_data_gb: 0.094,
    email_opens: 370,
  },

  // Events conversions
  venue_energy_kwh: {
    booth_materials_kg: 2.5,
    attendee_travel_km: 35,
    freight_ton_km: 0.15,
    catering_meals: 18,
  },
  booth_materials_kg: {
    venue_energy_kwh: 0.4,
    attendee_travel_km: 14,
    freight_ton_km: 0.06,
    catering_meals: 7.2,
  },
  attendee_travel_km: {
    venue_energy_kwh: 0.029,
    booth_materials_kg: 0.071,
    freight_ton_km: 0.0043,
    catering_meals: 0.51,
  },
  freight_ton_km: {
    venue_energy_kwh: 6.67,
    booth_materials_kg: 16.67,
    attendee_travel_km: 233,
    catering_meals: 120,
  },
  catering_meals: {
    venue_energy_kwh: 0.056,
    booth_materials_kg: 0.139,
    attendee_travel_km: 1.96,
    freight_ton_km: 0.0083,
  },

  // Giveaways conversions
  merch_materials_kg: {
    merch_distribution_ton_km: 0.085,
    packaging_kg: 0.35,
  },
  merch_distribution_ton_km: {
    merch_materials_kg: 11.76,
    packaging_kg: 4.12,
  },
  packaging_kg: {
    merch_materials_kg: 2.86,
    merch_distribution_ton_km: 0.24,
  },

  // Influencer Marketing conversions
  editing_kwh: {
    influencer_travel_km: 25,
    content_delivery_gb: 45,
  },
  influencer_travel_km: {
    editing_kwh: 0.04,
    content_delivery_gb: 1.8,
  },
  content_delivery_gb: {
    editing_kwh: 0.022,
    influencer_travel_km: 0.56,
  },

  // Live Streams conversions
  stream_time_hours: {
    stream_participants: 125,
    stream_device_watts: 85,
    stream_data_gb: 3.5,
  },
  stream_participants: {
    stream_time_hours: 0.008,
    stream_device_watts: 0.68,
    stream_data_gb: 0.028,
  },
  stream_device_watts: {
    stream_time_hours: 0.012,
    stream_participants: 1.47,
    stream_data_gb: 0.041,
  },
  stream_data_gb: {
    stream_time_hours: 0.29,
    stream_participants: 36,
    stream_device_watts: 24.3,
  },

  // Martech conversions
  cloud_compute_kwh: {
    saas_hosting_kwh: 1.15,
  },
  saas_hosting_kwh: {
    cloud_compute_kwh: 0.87,
  },

  // OOH Static conversions
  ooh_materials_kg: {
    install_travel_km: 8.5,
  },
  install_travel_km: {
    ooh_materials_kg: 0.118,
  },

  // Guerrilla Marketing conversions
  guerrilla_materials_kg: {
    guerrilla_power_kwh: 1.8,
    guerrilla_travel_km: 12.5,
  },
  guerrilla_power_kwh: {
    guerrilla_materials_kg: 0.56,
    guerrilla_travel_km: 6.94,
  },
  guerrilla_travel_km: {
    guerrilla_materials_kg: 0.08,
    guerrilla_power_kwh: 0.144,
  },

  // Social Posts conversions
  social_post: {
    social_views: 2500, // Average reach per post
    view_time_hours: 0.83, // Total view time
    device_watts: 35, // Device power during engagement
  },
  social_views: {
    social_post: 0.0004,
    view_time_hours: 0.00033,
    device_watts: 0.014,
  },
  view_time_hours: {
    social_post: 1.2,
    social_views: 3000,
    device_watts: 42,
  },
  device_watts: {
    social_post: 0.029,
    social_views: 71.4,
    view_time_hours: 0.024,
  },

  // POS conversions
  pos_materials_kg: {
    pos_manufacturing_kwh: 3.2,
    pos_distribution_ton_km: 0.18,
  },
  pos_manufacturing_kwh: {
    pos_materials_kg: 0.31,
    pos_distribution_ton_km: 0.056,
  },
  pos_distribution_ton_km: {
    pos_materials_kg: 5.56,
    pos_manufacturing_kwh: 17.86,
  },

  // PR & Press conversions
  printed_press_kg: {
    parcel_shipping_ton_km: 0.095,
    pr_travel_km: 15.5,
  },
  parcel_shipping_ton_km: {
    printed_press_kg: 10.53,
    pr_travel_km: 163,
  },
  pr_travel_km: {
    printed_press_kg: 0.065,
    parcel_shipping_ton_km: 0.0061,
  },

  // Print conversions
  paper_kg: {
    printing_kwh: 2.8,
    distribution_ton_km: 0.12,
  },
  printing_kwh: {
    paper_kg: 0.36,
    distribution_ton_km: 0.043,
  },
  distribution_ton_km: {
    paper_kg: 8.33,
    printing_kwh: 23.26,
  },

  // Radio conversions
  radio_broadcast_hours: {
    radio_station_kwh: 8.5,
    radio_streaming_gb: 125,
  },
  radio_station_kwh: {
    radio_broadcast_hours: 0.118,
    radio_streaming_gb: 14.7,
  },
  radio_streaming_gb: {
    radio_broadcast_hours: 0.008,
    radio_station_kwh: 0.068,
  },

  // Search & Social Ads conversions
  social_impression: {
    data_transfer_gb: 0.000018, // 1 impression ≈ 0.000018 GB
  },
  data_transfer_gb: {
    social_impression: 55555, // 1 GB ≈ 55,555 impressions
  },

  // Sponsorships conversions
  sponsorship_allocation_percent: {
    sponsorship_event_kwh: 125,
    sponsorship_attendee_travel_km: 2850,
    sponsorship_freight_ton_km: 45,
    sponsorship_catering_meals: 380,
  },
  sponsorship_event_kwh: {
    sponsorship_allocation_percent: 0.008,
    sponsorship_attendee_travel_km: 22.8,
    sponsorship_freight_ton_km: 0.36,
    sponsorship_catering_meals: 3.04,
  },
  sponsorship_attendee_travel_km: {
    sponsorship_allocation_percent: 0.00035,
    sponsorship_event_kwh: 0.044,
    sponsorship_freight_ton_km: 0.016,
    sponsorship_catering_meals: 0.133,
  },
  sponsorship_freight_ton_km: {
    sponsorship_allocation_percent: 0.022,
    sponsorship_event_kwh: 2.78,
    sponsorship_attendee_travel_km: 63.3,
    sponsorship_catering_meals: 8.44,
  },
  sponsorship_catering_meals: {
    sponsorship_allocation_percent: 0.0026,
    sponsorship_event_kwh: 0.33,
    sponsorship_attendee_travel_km: 7.5,
    sponsorship_freight_ton_km: 0.118,
  },

  // TV conversions
  tv_studio_hours: {
    tv_studio_kwh: 45,
    tv_content_gb: 850,
  },
  tv_studio_kwh: {
    tv_studio_hours: 0.022,
    tv_content_gb: 18.9,
  },
  tv_content_gb: {
    tv_studio_hours: 0.0012,
    tv_studio_kwh: 0.053,
  },

  // Website conversions
  web_visit: {
    data_per_visit_bytes: 2500000, // 2.5 MB per visit
    hosting_kWh: 0.00015, // 0.00015 kWh per visit
  },
  data_per_visit_bytes: {
    web_visit: 0.0000004,
    hosting_kWh: 0.00000000006,
  },
  hosting_kWh: {
    web_visit: 6667,
    data_per_visit_bytes: 16666666667,
  },
}

export const DEFAULT_SCOPE: Record<string, number> = {
  'Ad Production': 3,
  'Call Centers/Telemarketing': 3,
  'Cinema Advertising': 3,
  'Direct Mail': 3,
  'Digital / Programmatic Media': 3,
  'DOOH (Digital billboards)': 3,
  'Email Marketing': 3,
  'Events/Experiential': 3,
  'Giveaways/Merchandise': 3,
  'Influencer Marketing': 3,
  'Live Streams/Webinars': 3,
  'Martech & Cloud': 3,
  'Out-of-Home (Static)': 3,
  'Outdoor Guerrilla Marketing': 3,
  'Owned Social Posts': 3,
  'Point-of-Sale Materials': 3,
  'PR & Press': 3,
  Print: 3,
  'Radio Advertising': 3,
  'Search & Social Ads': 3,
  Sponsorships: 3,
  'Television Advertising': 3,
  'Website / Landing Pages': 3,
}

export const FALLBACK_CALCULATION = {
  getBasicEmission: (activity: ActivityData): number => {
    const qty = activity.qty

    // Travel-related units
    if (activity.unit.includes('km') || activity.unit.includes('travel')) {
      return qty * 0.15
    }
    // Energy-related units
    else if (
      activity.unit.includes('kWh') ||
      activity.unit.includes('kwh') ||
      activity.unit.includes('energy')
    ) {
      return qty * 0.4
    }
    // Digital advertising
    else if (
      activity.unit === 'adtech_impression' ||
      activity.unit === 'social_impression'
    ) {
      return qty * 0.00001
    }
    // Email
    else if (activity.unit === 'email_send' || activity.unit.includes('email')) {
      return qty * 0.004
    }
    // Paper/print
    else if (activity.unit.includes('paper') || activity.unit === 'paper_kg') {
      return qty * 1.3
    }
    // Materials
    else if (activity.unit.includes('materials') || activity.unit.includes('kg')) {
      return qty * 0.5
    }
    // Data transfer
    else if (
      activity.unit.includes('gb') ||
      activity.unit.includes('GB') ||
      activity.unit.includes('data')
    ) {
      return qty * 0.006
    }
    // Time-based units (hours)
    else if (activity.unit.includes('hours') || activity.unit.includes('time')) {
      return qty * 0.1
    }
    // Power units (Watts)
    else if (activity.unit.includes('watts') || activity.unit.includes('Watts')) {
      return qty * 0.0005
    }
    // Views/posts/interactions
    else if (
      activity.unit.includes('views') ||
      activity.unit.includes('post') ||
      activity.unit.includes('opens')
    ) {
      return qty * 0.0001
    }
    // Default fallback
    else {
      return qty * 0.001
    }
  },
}

export const loadCountriesFromScientificData = async (): Promise<CountryData[]> => {
  try {
    const scientificCountriesList = [
      // Europe (Low Carbon)
      'Norway',
      'Iceland',
      'France',
      'Switzerland',
      'Sweden',
      'Austria',
      'Denmark',
      'Finland',
      'Belgium',
      'United Kingdom',
      'Spain',
      'Italy',
      'Netherlands',
      'Germany',
      'Czech Republic',
      'Greece',
      'Poland',

      // Americas
      'Costa Rica',
      'Uruguay',
      'Brazil',
      'Canada',
      'Chile',
      'Argentina',
      'United States',
      'Mexico',

      // Asia Pacific
      'New Zealand',
      'Japan',
      'Thailand',
      'Singapore',
      'Malaysia',
      'South Korea',
      'China',
      'Vietnam',
      'Indonesia',
      'Taiwan',
      'India',
      'Australia',

      // Middle East & Africa
      'Morocco',
      'Egypt',
      'UAE',
      'Saudi Arabia',
      'South Africa',
      'Nigeria',
    ].sort()

    return scientificCountriesList.map((country) => ({
      code: country.substring(0, 3).toUpperCase(),
      name: country,
    }))
  } catch (error) {
    console.error('Error loading countries:', error)
    // Fallback to minimal list
    return [
      'United States',
      'United Kingdom',
      'Germany',
      'France',
      'Canada',
      'Australia',
      'Japan',
      'India',
      'China',
      'Brazil',
      'Thailand',
    ].map((country) => ({
      code: country.substring(0, 3).toUpperCase(),
      name: country,
    }))
  }
}
