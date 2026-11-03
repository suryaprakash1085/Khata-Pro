// Single source of truth for delivery-fee calculation. Routes call into
// this — the formula must never be duplicated in a controller/component
// (spec section 7).

import { db, businessesTable, deliveryFeeSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface DeliveryFeeSettingsDTO {
  free_delivery_radius: number;
  per_km_charge: number;
  /** Max distance the shop delivers to. null = no limit. */
  max_delivery_radius: number | null;
  is_active: boolean;
}

export interface DeliveryCalculationResult {
  distance_km: number;
  free_delivery_radius: number;
  per_km_charge: number;
  chargeable_distance_km: number;
  delivery_fee: number;
  is_free_delivery: boolean;
  deliverable: boolean;
  max_delivery_radius: number | null;
  message: string | null;
}

export class DeliveryFeeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeliveryFeeValidationError";
  }
}

export class ShopLocationMissingError extends Error {
  constructor() {
    super(
      "Shop location is not configured. Please update your business location before enabling distance-based delivery fees."
    );
    this.name = "ShopLocationMissingError";
  }
}

export class CustomerLocationMissingError extends Error {
  constructor() {
    super("Please select a delivery address with a valid location.");
    this.name = "CustomerLocationMissingError";
  }
}

/** Thrown at order-creation time when the customer is beyond the shop's max delivery radius. */
export class OutOfDeliveryRangeError extends Error {
  distanceKm: number;
  maxRadiusKm: number;
  constructor(message: string, distanceKm: number, maxRadiusKm: number) {
    super(message);
    this.name = "OutOfDeliveryRangeError";
    this.distanceKm = distanceKm;
    this.maxRadiusKm = maxRadiusKm;
  }
}

const DEFAULT_FREE_RADIUS = 5;
const DEFAULT_PER_KM_CHARGE = 2;
const MAX_REASONABLE_RADIUS_KM = 200; // sanity ceiling for validation

function toNumber(value: string | number): number {
  return typeof value === "number" ? value : parseFloat(value);
}

function formatSettings(row: typeof deliveryFeeSettingsTable.$inferSelect): DeliveryFeeSettingsDTO {
  return {
    free_delivery_radius: toNumber(row.freeDeliveryRadius),
    per_km_charge: toNumber(row.perKmCharge),
    max_delivery_radius:
      row.maxDeliveryRadius === null || row.maxDeliveryRadius === undefined
        ? null
        : toNumber(row.maxDeliveryRadius),
    is_active: row.isActive,
  };
}

/**
 * Returns the business's delivery-fee settings, creating the row with
 * defaults (5 km free, ₹2/km, active, NO max limit) if none exists yet.
 */
export async function getOrCreateSettings(businessId: number): Promise<DeliveryFeeSettingsDTO> {
  const [existing] = await db
    .select()
    .from(deliveryFeeSettingsTable)
    .where(eq(deliveryFeeSettingsTable.businessId, businessId));

  if (existing) return formatSettings(existing);

  const [created] = await db
    .insert(deliveryFeeSettingsTable)
    .values({
      businessId,
      freeDeliveryRadius: String(DEFAULT_FREE_RADIUS),
      perKmCharge: String(DEFAULT_PER_KM_CHARGE),
      isActive: true,
    })
    .returning();

  return formatSettings(created);
}

/**
 * Validates and persists updated settings for a business.
 * max_delivery_radius: number = set limit, null = remove limit,
 * undefined (omitted) = leave unchanged.
 */
export async function updateSettings(
  businessId: number,
  input: {
    free_delivery_radius: unknown;
    per_km_charge: unknown;
    max_delivery_radius?: unknown;
    is_active: unknown;
  }
): Promise<DeliveryFeeSettingsDTO> {
  const radius = validateRadius(input.free_delivery_radius);
  const perKm = validatePerKmCharge(input.per_km_charge);

  let maxRadius: number | null | undefined = undefined;
  if (input.max_delivery_radius !== undefined) {
    maxRadius = validateMaxRadius(input.max_delivery_radius, radius);
  }

  if (typeof input.is_active !== "boolean") {
    throw new DeliveryFeeValidationError("is_active must be a boolean");
  }

  await getOrCreateSettings(businessId);

  const [updated] = await db
    .update(deliveryFeeSettingsTable)
    .set({
      freeDeliveryRadius: String(radius),
      perKmCharge: String(perKm),
      isActive: input.is_active,
      ...(maxRadius !== undefined && {
        maxDeliveryRadius: maxRadius === null ? null : String(maxRadius),
      }),
    })
    .where(eq(deliveryFeeSettingsTable.businessId, businessId))
    .returning();

  return formatSettings(updated);
}

function validateRadius(value: unknown): number {
  const num = typeof value === "number" ? value : NaN;
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    throw new DeliveryFeeValidationError("free_delivery_radius must be a valid number");
  }
  if (num <= 0) {
    throw new DeliveryFeeValidationError("free_delivery_radius must be greater than 0");
  }
  if (num > MAX_REASONABLE_RADIUS_KM) {
    throw new DeliveryFeeValidationError(`free_delivery_radius must be ${MAX_REASONABLE_RADIUS_KM} km or less`);
  }
  return num;
}

function validateMaxRadius(value: unknown, freeRadius: number): number | null {
  if (value === null) return null; // admin cleared the limit
  const num = typeof value === "number" ? value : NaN;
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    throw new DeliveryFeeValidationError("max_delivery_radius must be a valid number or empty");
  }
  if (num <= 0) {
    throw new DeliveryFeeValidationError("max_delivery_radius must be greater than 0");
  }
  if (num > MAX_REASONABLE_RADIUS_KM) {
    throw new DeliveryFeeValidationError(`max_delivery_radius must be ${MAX_REASONABLE_RADIUS_KM} km or less`);
  }
  if (num < freeRadius) {
    throw new DeliveryFeeValidationError("max_delivery_radius cannot be less than free_delivery_radius");
  }
  return num;
}

function validatePerKmCharge(value: unknown): number {
  const num = typeof value === "number" ? value : NaN;
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    throw new DeliveryFeeValidationError("per_km_charge must be a valid number");
  }
  if (num < 0) {
    throw new DeliveryFeeValidationError("per_km_charge cannot be negative");
  }
  return num;
}

/**
 * Haversine great-circle distance in km between two lat/lng points.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * THE delivery-fee formula. Called by both the calculate-preview endpoint
 * and order creation — never re-implement this elsewhere.
 *
 * 1. If the admin set a max_delivery_radius and distance exceeds it => not deliverable.
 * 2. distance <= free_delivery_radius => free.
 * 3. Otherwise chargeable = ceil(distance - free_delivery_radius) km × per_km_charge.
 */
export function computeFee(
  distanceKm: number,
  settings: DeliveryFeeSettingsDTO
): DeliveryCalculationResult {
  const { free_delivery_radius, per_km_charge, max_delivery_radius } = settings;

  if (max_delivery_radius !== null && distanceKm > max_delivery_radius) {
    return {
      distance_km: round2(distanceKm),
      free_delivery_radius,
      per_km_charge,
      chargeable_distance_km: 0,
      delivery_fee: 0,
      is_free_delivery: false,
      deliverable: false,
      max_delivery_radius,
      message: `Sorry, this shop delivers only within ${max_delivery_radius} KM. Your location is ${round2(distanceKm)} KM away.`,
    };
  }

  if (!settings.is_active) {
    return {
      distance_km: round2(distanceKm),
      free_delivery_radius,
      per_km_charge,
      chargeable_distance_km: 0,
      delivery_fee: 0,
      is_free_delivery: true,
      deliverable: true,
      max_delivery_radius,
      message: null,
    };
  }


  if (distanceKm <= free_delivery_radius) {
    return {
      distance_km: round2(distanceKm),
      free_delivery_radius,
      per_km_charge,
      chargeable_distance_km: 0,
      delivery_fee: 0,
      is_free_delivery: true,
      deliverable: true,
      max_delivery_radius,
      message: null,
    };
  }

  const rawChargeable = distanceKm - free_delivery_radius;
  const chargeableDistanceKm = Math.ceil(rawChargeable); // round UP to next whole km
  const fee = chargeableDistanceKm * per_km_charge;

  return {
    distance_km: round2(distanceKm),
    free_delivery_radius,
    per_km_charge,
    chargeable_distance_km: chargeableDistanceKm,
    delivery_fee: round2(fee),
    is_free_delivery: false,
    deliverable: true,
    max_delivery_radius,
    message: null,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * End-to-end: resolve shop location + settings for a business, validate
 * customer coordinates, compute distance, compute fee. Does NOT throw for
 * out-of-range; it returns deliverable:false. Order creation decides to reject.
 */
export async function calculateDeliveryFeeForBusiness(
  businessId: number,
  customerLatitude: unknown,
  customerLongitude: unknown
): Promise<DeliveryCalculationResult> {
  const custLat = typeof customerLatitude === "number" ? customerLatitude : NaN;
  const custLng = typeof customerLongitude === "number" ? customerLongitude : NaN;

  if (
    Number.isNaN(custLat) ||
    Number.isNaN(custLng) ||
    custLat < -90 ||
    custLat > 90 ||
    custLng < -180 ||
    custLng > 180
  ) {
    throw new CustomerLocationMissingError();
  }

  const [business] = await db
    .select({ latitude: businessesTable.latitude, longitude: businessesTable.longitude })
    .from(businessesTable)
    .where(eq(businessesTable.id, businessId));

  if (!business || business.latitude === null || business.longitude === null) {
    throw new ShopLocationMissingError();
  }

  const settings = await getOrCreateSettings(businessId);

  const distanceKm = calculateDistanceKm(
    toNumber(business.latitude),
    toNumber(business.longitude),
    custLat,
    custLng
  );

  return computeFee(distanceKm, settings);
}