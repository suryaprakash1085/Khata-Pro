const IS_DRIVER = process.env.APP_VARIANT === 'driver';

const CUSTOMER_PROJECT_ID = '1f926f44-064c-4b7a-b9f7-6666ab727879';
const DRIVER_PROJECT_ID = 'PASTE_AFTER_EAS_INIT';

const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

export default {
  expo: {
    name: IS_DRIVER ? 'Delivery Partner' : 'Delivery App',
    slug: IS_DRIVER ? 'delivery-partner' : 'delivery-app',
    version: '1.0.0',
    owner: 'yogamurugan',
    extra: {
      appMode: IS_DRIVER ? 'driver' : 'customer',
      eas: {
        projectId: IS_DRIVER ? DRIVER_PROJECT_ID : CUSTOMER_PROJECT_ID,
      },
    },
    android: {
      package: IS_DRIVER
        ? 'com.subasri0102.deliverypartner'
        : 'com.subasri0102.deliveryapp',
      permissions: IS_DRIVER
        ? ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'ACCESS_BACKGROUND_LOCATION']
        : [],
      config: { googleMaps: { apiKey: MAPS_KEY } },
    },
    ios: {
      bundleIdentifier: IS_DRIVER
        ? 'com.subasri0102.deliverypartner'
        : 'com.subasri0102.deliveryapp',
      config: { googleMapsApiKey: "AIzaSyD3u4E5kVRbD6UR_VXUfjMWVPRtYxKkgT4" },
    },
    plugins: [
      'expo-notifications',
      ...(IS_DRIVER ? ['expo-location'] : []),
    ],
  },
};