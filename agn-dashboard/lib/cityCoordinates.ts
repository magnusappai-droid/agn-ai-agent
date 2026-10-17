// Coordinate lookup for firm map pins.
//
// Format is ALWAYS [longitude, latitude]. Longitude first. This is the
// opposite of how we say it out loud, and it is the single easiest thing
// to get wrong here.
//
// Lookup runs in four tiers, most precise first. See getFirmCoordinates
// at the bottom.
//   1. cityCountryCoordinates  'Sheffield|United Kingdom'  <- preferred
//   2. cityCoordinates         'Sheffield'                 <- legacy
//   3. countryCoordinates      'United Kingdom'
//   4. [0, 20]                 the Atlantic. Means something is missing.

// ---------------------------------------------------------------------
// TIER 1: city plus country.
//
// Keyed on both because city names are not unique. The member list has
// Birmingham, UK; the prospect list has Birmingham, Alabama. Keyed on
// city alone, one of them lands in the wrong country permanently. Same
// hazard for Athens, Dover, Santiago, Springfield and Perth.
//
// The country half must match the `country` value in Supabase exactly,
// so 'USA' not 'United States', because that is what the firms table uses.
// ---------------------------------------------------------------------

export const cityCountryCoordinates: Record<string, [number, number]> = {
  // --- AGN members -------------------------------------------------
  'Atlanta|USA': [-84.3880, 33.7490],
  'Beijing|China': [116.4074, 39.9042],
  'Birmingham|United Kingdom': [-1.8904, 52.4862],
  'Cleveland|USA': [-81.6944, 41.4993],
  'Coventry|United Kingdom': [-1.5197, 52.4068],
  'Dover|USA': [-75.5244, 39.1582],
  'Gainesville|USA': [-82.3248, 29.6516],
  'Houston|USA': [-95.3698, 29.7604],
  'Lahore|Pakistan': [74.3587, 31.5204],
  'London|United Kingdom': [-0.1276, 51.5072],
  'Mumbai|India': [72.8777, 19.0760],
  'Omaha|USA': [-95.9345, 41.2565],
  'St. Louis|USA': [-90.1994, 38.6270],

  // --- Prospects, hot and warm (35 firms) --------------------------
  'Abilene|USA': [-99.7331, 32.4487],
  'Athens|Greece': [23.7275, 37.9838],
  'Bereldange|Luxembourg': [6.1200, 49.6500],
  'Bogota|Colombia': [-74.0721, 4.7110],
  'Campinas|Brazil': [-47.0608, -22.9099],
  'Dar Es Salaam|Tanzania': [39.2083, -6.7924],
  'Dornbirn|Austria': [9.7437, 47.4125],
  'Dublin|Ireland': [-6.2603, 53.3498],
  'Eindhoven|Netherlands': [5.4697, 51.4416],
  'Gibraltar|Gibraltar': [-5.3536, 36.1408],
  'Hong Kong|Hong Kong': [114.1694, 22.3193],
  'Jeddah|Saudi Arabia': [39.1925, 21.4858],
  'Lima|Peru': [-77.0428, -12.0464],
  'Luxembourg|Luxembourg': [6.1296, 49.6116],
  'Milan|Italy': [9.1900, 45.4642],
  'Monterrey|Mexico': [-100.3161, 25.6866],
  'Nuremberg|Germany': [11.0767, 49.4521],
  'Puebla|Mexico': [-98.2063, 19.0414],
  'Quito|Ecuador': [-78.4678, -0.1807],
  'Regensburg|Germany': [12.1016, 49.0134],
  'Rio de Janeiro|Brazil': [-43.1729, -22.9068],
  'Santiago|Chile': [-70.6483, -33.4489],
  'Sao Paulo|Brazil': [-46.6333, -23.5505],
  'Seoul|South Korea': [126.9780, 37.5665],
  'Sheffield|United Kingdom': [-1.4701, 53.3811],
  'The Hague|Netherlands': [4.3007, 52.0705],
  'Tokyo|Japan': [139.6917, 35.6895],
  'Urk|Netherlands': [5.6014, 52.6628],
};

// ---------------------------------------------------------------------
// TIER 2: city only. Legacy, kept so nothing that already imports this
// breaks. Prefer adding to cityCountryCoordinates above for anything new.
// ---------------------------------------------------------------------

export const cityCoordinates: Record<string, [number, number]> = {
  'Houston': [-95.3698, 29.7604],
  'Cleveland': [-81.6944, 41.4993],
  'Mumbai': [72.8777, 19.0760],
};

// ---------------------------------------------------------------------
// TIER 3: country centroid fallback. Covers every country a firm might
// be in, so no firm silently disappears into the ocean. Aliases are
// deliberate: the pipeline spreadsheet and the member data spell some
// countries differently.
// ---------------------------------------------------------------------

export const countryCoordinates: Record<string, [number, number]> = {
  'United States': [-98.5795, 39.8283],
  'USA': [-98.5795, 39.8283],
  'Canada': [-106.3468, 56.1304],
  'Mexico': [-102.5528, 23.6345],
  'Costa Rica': [-83.7534, 9.7489],
  'Panama': [-80.7821, 8.5380],
  'El Salvador': [-88.8965, 13.7942],
  'Colombia': [-74.2973, 4.5709],
  'Venezuela': [-66.5897, 6.4238],
  'Argentina': [-63.6167, -38.4161],
  'Brazil': [-51.9253, -14.2350],
  'Chile': [-71.5430, -35.6751],
  'Peru': [-75.0152, -9.1900],
  'Ecuador': [-78.1834, -1.8312],

  'United Kingdom': [-3.4360, 55.3781],
  'Ireland': [-8.2439, 53.4129],
  'France': [2.2137, 46.2276],
  'Germany': [10.4515, 51.1657],
  'Netherlands': [5.2913, 52.1326],
  'Switzerland': [8.2275, 46.8182],
  'Austria': [14.5501, 47.5162],
  'Italy': [12.5674, 41.8719],
  'Spain': [-3.7492, 40.4637],
  'Portugal': [-8.2245, 39.3999],
  'Sweden': [18.6435, 60.1282],
  'Norway': [8.4689, 60.4720],
  'Denmark': [9.5018, 56.2639],
  'Finland': [25.7482, 61.9241],
  'Poland': [19.1451, 51.9194],
  'Hungary': [19.5033, 47.1625],
  'Greece': [21.8243, 39.0742],
  'Cyprus': [33.4299, 35.1264],
  'Turkey': [35.2433, 38.9637],
  'Ukraine': [31.1656, 48.3794],
  'Belgium': [4.4699, 50.5039],
  'Luxembourg': [6.1296, 49.8153],
  'Gibraltar': [-5.3536, 36.1408],

  'UAE': [53.8478, 23.4241],
  'United Arab Emirates': [53.8478, 23.4241],
  'Saudi Arabia': [45.0792, 23.8859],
  'Kuwait': [47.4818, 29.3117],
  'Jordan': [36.2384, 30.5852],
  'Israel': [34.8516, 31.0461],
  'Iran': [53.6880, 32.4279],
  'Egypt': [30.8025, 26.8206],
  'Morocco': [-7.0926, 31.7917],
  'Kenya': [37.9062, -0.0236],
  'Tanzania': [34.8888, -6.3690],
  'South Africa': [22.9375, -30.5595],

  'India': [78.9629, 20.5937],
  'China': [104.1954, 35.8617],
  'Hong Kong': [114.1694, 22.3193],
  'Taiwan': [120.9605, 23.6978],
  'Japan': [138.2529, 36.2048],
  'South Korea': [127.7669, 35.9078],
  'Korea': [127.7669, 35.9078],
  'Singapore': [103.8198, 1.3521],
  'Malaysia': [101.9758, 4.2105],
  'Indonesia': [113.9213, -0.7893],
  'Vietnam': [108.2772, 14.0583],
  'Philippines': [121.7740, 12.8797],
  'Bangladesh': [90.3563, 23.6850],
  'Thailand': [100.9925, 15.8700],
  'Australia': [133.7751, -25.2744],
  'New Zealand': [174.8860, -40.9006],
  'Pakistan': [69.3451, 30.3753],
  'Romania': [24.9668, 45.9432],
  'Czechia': [15.4730, 49.8175],
  'Czech Republic': [15.4730, 49.8175],
  'Lebanon': [35.8623, 33.8547],
  'Nigeria': [8.6753, 9.0820],
  'Liechtenstein': [9.5215, 47.1660],
};

// ---------------------------------------------------------------------
// Resolve a firm to map coordinates.
//
// Falls through the tiers in order of precision. A pin appearing at
// [0, 20] in the Atlantic off West Africa is not a data error in the
// firm record, it means its city and country are both missing from the
// maps above.
// ---------------------------------------------------------------------

export function getFirmCoordinates(city: string | null, country: string | null): [number, number] {
  if (city && country) {
    const exact = cityCountryCoordinates[`${city}|${country}`];
    if (exact) return exact;
  }
  if (city && cityCoordinates[city]) return cityCoordinates[city];
  if (country && countryCoordinates[country]) return countryCoordinates[country];
  return [0, 20];
}