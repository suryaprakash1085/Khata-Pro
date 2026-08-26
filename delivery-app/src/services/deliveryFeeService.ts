

import apiClient from '../api/client';

export interface DeliveryFeeCalculation {
  distance_km: number;
  free_delivery_radius: number;
  per_km_charge: number;
  chargeable_distance_km: number;
  delivery_fee: number;
  is_free_delivery: boolean;
}

export interface CalculateDeliveryFeeParams {
  businessId: number;
  customerLatitude: number;
  customerLongitude: number;
}

export interface DeliveryCalculationResult {
  distance_km: number;
  free_delivery_radius: number;
  per_km_charge: number;
  chargeable_distance_km: number;
  delivery_fee: number;
  is_free_delivery: boolean;
  // Additional fields that might come from server
  business_id?: number;
  delivery_radius?: number;
  base_delivery_fee?: number;
  total_charge?: number;
}

export class CustomerLocationMissingError extends Error {
  constructor() {
    super('Customer location is invalid or missing');
    this.name = 'CustomerLocationMissingError';
  }
}

export class BusinessLocationMissingError extends Error {
  constructor() {
    super('Business location is invalid or missing');
    this.name = 'BusinessLocationMissingError';
  }
}


export const deliveryFeeService = {

  calculate: async ({
    businessId,
    customerLatitude,
    customerLongitude,
  }: CalculateDeliveryFeeParams): Promise<DeliveryFeeCalculation> => {
    return apiClient.post('/delivery-fees/calculate', {
      business_id: businessId,
      customer_latitude: customerLatitude,
      customer_longitude: customerLongitude,
    });
  },

  
  calculateWithValidation: async ({
    businessId,
    customerLatitude,
    customerLongitude,
  }: CalculateDeliveryFeeParams): Promise<DeliveryFeeCalculation> => {
    // Validate coordinates before calling API
    const custLat = typeof customerLatitude === "number" ? customerLatitude : NaN;
    const custLng = typeof customerLongitude === "number" ? customerLongitude : NaN;

    if (
      Number.isNaN(custLat) ||
      Number.isNaN(custLng) ||
      custLat < -90 ||
      custLat > 90 ||
      custLng < -180 ||
      custLng > 180 ||
      // ✅ NEW: (0,0) = "Null Island" = GPS never captured, reject it
      (custLat === 0 && custLng === 0)
    ) {
      throw new CustomerLocationMissingError();
    }

    // If validation passes, call the API
    return deliveryFeeService.calculate({
      businessId,
      customerLatitude: custLat,
      customerLongitude: custLng,
    });
  },
};

// ============================================================
// STANDALONE FUNCTION
// ============================================================
/**
 * Calculate delivery fee for a business (standalone function)
 * Used in older code or when a simpler function signature is needed
 */
export async function calculateDeliveryFeeForBusiness(
  businessId: number,
  customerLatitude: unknown,
  customerLongitude: unknown
): Promise<DeliveryCalculationResult> {
  // Validate customer coordinates
  const custLat = typeof customerLatitude === "number" ? customerLatitude : NaN;
  const custLng = typeof customerLongitude === "number" ? customerLongitude : NaN;

  if (
    Number.isNaN(custLat) ||
    Number.isNaN(custLng) ||
    custLat < -90 ||
    custLat > 90 ||
    custLng < -180 ||
    custLng > 180 ||
    // ✅ NEW: (0,0) = "Null Island" = GPS never captured, reject it
    (custLat === 0 && custLng === 0)
  ) {
    throw new CustomerLocationMissingError();
  }

  // Call the API
  try {
    const result = await deliveryFeeService.calculate({
      businessId,
      customerLatitude: custLat,
      customerLongitude: custLng,
    });

    return result as DeliveryCalculationResult;
  } catch (error) {
    // Re-throw with more context if needed
    if (error instanceof CustomerLocationMissingError) {
      throw error;
    }
    throw new Error(`Failed to calculate delivery fee: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
/**
 * Utility function to validate coordinates
 * (0,0) is considered invalid as it represents "Null Island" (GPS not captured)
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    !Number.isNaN(lat) &&
    !Number.isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    // ✅ NEW: Reject (0,0) - Null Island
    !(lat === 0 && lng === 0)
  );
}

/**
 * Utility function to format coordinates for API calls
 */
export function formatCoordinates(
  lat: unknown,
  lng: unknown
): { latitude: number; longitude: number } | null {
  const latitude = typeof lat === "number" ? lat : NaN;
  const longitude = typeof lng === "number" ? lng : NaN;

  if (isValidCoordinates(latitude, longitude)) {
    return {
      latitude,
      longitude,
    };
  }

  return null;
}

// ============================================================
// DEFAULT EXPORT
// ============================================================
export default deliveryFeeService;