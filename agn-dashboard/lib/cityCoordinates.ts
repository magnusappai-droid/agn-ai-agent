// City-level coordinates for firms where we know the exact city.
// Add more here over time for precision; country fallback covers everything else.

export const cityCoordinates: Record<string, [number, number]> = {
  'Houston': [-95.3698, 29.7604],
  'Cleveland': [-81.6944, 41.4993],
  'Mumbai': [72.8777, 19.0760],
};

// Country-level centroid fallback — covers every country a firm might be in,
// so no firm ever silently disappears into the default ocean fallback.
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
  'South Africa': [22.9375, -30.5595],

  'India': [78.9629, 20.5937],
  'China': [104.1954, 35.8617],
  'Hong Kong': [114.1694, 22.3193],
  'Taiwan': [120.9605, 23.6978],
  'Japan': [138.2529, 36.2048],
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

export function getFirmCoordinates(city: string | null, country: string | null): [number, number] {
  if (city && cityCoordinates[city]) return cityCoordinates[city];
  if (country && countryCoordinates[country]) return countryCoordinates[country];
  return [0, 20];
}