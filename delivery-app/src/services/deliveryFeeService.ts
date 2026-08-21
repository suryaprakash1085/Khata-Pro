// TARGET PATH: delivery-app/src/services/deliveryFeeService.ts
// NEW FILE

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

// No auth required server-side (customer app may call this before login),
// but apiClient's interceptor will attach a token if one exists — harmless
// either way.
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
};