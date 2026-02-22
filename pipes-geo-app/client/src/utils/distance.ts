import { LatLng } from "../types";

/**
 * Calculate the distance between two geographic points using the Haversine formula
 * 
 * The Haversine formula determines the great-circle distance between two points
 * on a sphere given their longitudes and latitudes.
 * 
 * @param point1 - First point {lat, lng}
 * @param point2 - Second point {lat, lng}
 * @returns Distance in meters
 * 
 * Reference: https://en.wikipedia.org/wiki/Haversine_formula
 */
export function calculateDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371000; // Earth's radius in meters
  
  // Convert degrees to radians
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);
  
  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Format distance for display
 * @param meters - Distance in meters
 * @returns Formatted string (e.g., "1.23 km" or "345 m")
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}
