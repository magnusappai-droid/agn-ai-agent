// Simple city-level coordinate lookup.
// Add more cities here as you populate more firms.
// Format: [longitude, latitude] — note the order, it's swapped from the usual lat/long.

export const cityCoordinates: Record<string, [number, number]> = {
  'Houston': [-95.3698, 29.7604],
  'Cleveland': [-81.6944, 41.4993],
  'Mumbai': [72.8777, 19.0760],
  'London': [-0.1276, 51.5072],
  'New York': [-74.0060, 40.7128],
  'Chicago': [-87.6298, 41.8781],
  'Los Angeles': [-118.2437, 34.0522],
  'Toronto': [-79.3832, 43.6532],
  'Sydney': [151.2093, -33.8688],
  'Singapore': [103.8198, 1.3521],
  'Dubai': [55.2708, 25.2048],
  'Frankfurt': [8.6821, 50.1109],
  'Paris': [2.3522, 48.8566],
  'Beijing': [116.4074, 39.9042],
  'Tokyo': [139.6503, 35.6762],
  'Johannesburg': [28.0473, -26.2041],
};

// Fallback: place a firm at its country's rough center if we don't have its city.
export const countryCoordinates: Record<string, [number, number]> = {
  'USA': [-98.5795, 39.8283],
  'India': [78.9629, 20.5937],
  'UK': [-3.4360, 55.3781],
  'Canada': [-106.3468, 56.1304],
  'Australia': [133.7751, -25.2744],
  'China': [104.1954, 35.8617],
  'Germany': [10.4515, 51.1657],
  'France': [2.2137, 46.2276],
  'Japan': [138.2529, 36.2048],
  'UAE': [53.8478, 23.4241],
  'Singapore': [103.8198, 1.3521],
  'South Africa': [22.9375, -30.5595],
};

export function getFirmCoordinates(city: string | null, country: string | null): [number, number] {
  if (city && cityCoordinates[city]) return cityCoordinates[city];
  if (country && countryCoordinates[country]) return countryCoordinates[country];
  return [0, 20]; // default fallback: mid-Atlantic, so it's at least visible
}