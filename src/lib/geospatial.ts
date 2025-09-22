// Utility functions for geospatial operations and location handling

export type Coordinates = {
  latitude: number
  longitude: number
}

export type GeoJSONPoint = {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
}

export type GeoJSONPolygon = {
  type: 'Polygon'
  coordinates: [number, number][][]
}

/**
 * Convert latitude/longitude to GeoJSON Point format
 */
export function coordinatesToGeoJSON(lat: number, lng: number): GeoJSONPoint {
  return {
    type: 'Point',
    coordinates: [lng, lat] // Note: GeoJSON uses [longitude, latitude]
  }
}

/**
 * Convert GeoJSON Point to coordinates object
 */
export function geoJSONToCoordinates(point: GeoJSONPoint): Coordinates {
  return {
    latitude: point.coordinates[1],
    longitude: point.coordinates[0]
  }
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Format distance for display
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`
  } else {
    return `${(distanceInMeters / 1000).toFixed(1)}km`
  }
}

/**
 * Get user's current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}

/**
 * Watch user's location for real-time updates
 */
export function watchLocation(
  onLocationUpdate: (coordinates: Coordinates) => void,
  onError: (error: GeolocationPositionError) => void
): number {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser')
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onLocationUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    },
    onError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    }
  )
}

/**
 * Stop watching location
 */
export function stopWatchingLocation(watchId: number): void {
  navigator.geolocation.clearWatch(watchId)
}

/**
 * Reverse geocoding - get address from coordinates
 * This is a basic implementation that would need an actual geocoding service
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  try {
    // This is a placeholder - in production, you'd use a service like:
    // Google Maps Geocoding API, Mapbox Geocoding API, or OpenStreetMap Nominatim
    
    // For now, return a formatted coordinate string
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  } catch (error) {
    console.error('Reverse geocoding failed:', error)
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }
}

/**
 * Forward geocoding - get coordinates from address
 * This is a basic implementation that would need an actual geocoding service
 */
export async function forwardGeocode(address: string): Promise<Coordinates | null> {
  try {
    // This is a placeholder - in production, you'd use a geocoding service
    // For now, return null to indicate the service is not implemented
    console.log('Forward geocoding not implemented for address:', address)
    return null
  } catch (error) {
    console.error('Forward geocoding failed:', error)
    return null
  }
}

/**
 * Check if a point is within a polygon (basic point-in-polygon test)
 */
export function pointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }

  return inside
}

/**
 * Find the center point of a polygon
 */
export function getPolygonCenter(polygon: [number, number][]): [number, number] {
  let totalX = 0
  let totalY = 0
  const length = polygon.length

  for (const [x, y] of polygon) {
    totalX += x
    totalY += y
  }

  return [totalX / length, totalY / length]
}

/**
 * Create a bounding box around a point with a given radius
 */
export function createBoundingBox(
  lat: number,
  lng: number,
  radiusInMeters: number
): {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
} {
  // Approximate conversion (not exact due to Earth's curvature)
  const latOffset = radiusInMeters / 111000 // 1 degree lat ≈ 111km
  const lngOffset = radiusInMeters / (111000 * Math.cos((lat * Math.PI) / 180))

  return {
    minLat: lat - latOffset,
    maxLat: lat + latOffset,
    minLng: lng - lngOffset,
    maxLng: lng + lngOffset
  }
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !isNaN(lat) &&
    !isNaN(lng)
  )
}

/**
 * Mumbai specific ward boundaries (simplified)
 * In production, this would come from a proper GIS dataset
 */
export const MUMBAI_WARDS = {
  'Ward 12': {
    center: [72.8777, 19.0760] as [number, number],
    bounds: [
      [72.870, 19.070] as [number, number],
      [72.885, 19.070] as [number, number],
      [72.885, 19.082] as [number, number],
      [72.870, 19.082] as [number, number]
    ]
  },
  'Ward 15': {
    center: [72.8820, 19.0822] as [number, number],
    bounds: [
      [72.875, 19.075] as [number, number],
      [72.890, 19.075] as [number, number],
      [72.890, 19.090] as [number, number],
      [72.875, 19.090] as [number, number]
    ]
  }
  // Add more wards as needed
}

/**
 * Get ward from coordinates (Mumbai specific)
 */
export function getWardFromCoordinates(lat: number, lng: number): string | null {
  for (const [wardName, wardData] of Object.entries(MUMBAI_WARDS)) {
    if (pointInPolygon([lng, lat], wardData.bounds)) {
      return wardName
    }
  }
  return null
}

/**
 * Common Mumbai locations for quick access
 */
export const MUMBAI_LANDMARKS = {
  'Gateway of India': { lat: 18.9220, lng: 72.8347 },
  'Marine Drive': { lat: 18.9439, lng: 72.8234 },
  'Bandra-Worli Sea Link': { lat: 19.0367, lng: 72.8147 },
  'Juhu Beach': { lat: 19.0968, lng: 72.8263 },
  'Chhatrapati Shivaji Terminus': { lat: 18.9401, lng: 72.8351 },
  'Mumbai Central': { lat: 18.9698, lng: 72.8205 }
}