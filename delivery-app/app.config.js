const IS_DRIVER = process.env.APP_VARIANT === 'driver';

const CUSTOMER_PROJECT_ID = '1f926f44-064c-4b7a-b9f7-6666ab727879';
const DRIVER_PROJECT_ID = "0d208f21-e4f6-41ba-aa85-ea3ec2dddf2b";

const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

// icon folder: assets/customer or assets/partner
const ICON_DIR = IS_DRIVER ? './assets/partner' : './assets/customer';

export default {
  expo: {
    name: IS_DRIVER ? 'Delivery Partner' : 'Delivery App',
    slug: IS_DRIVER ? 'delivery-partner' : 'delivery-app',
    version: '1.0.0',
    owner: 'yogamurugan',
    icon: `${ICON_DIR}/icon.png`,
    extra: {
      appMode: IS_DRIVER ? 'driver' : 'customer',
      eas: {
        ...(IS_DRIVER
          ? DRIVER_PROJECT_ID ? { projectId: DRIVER_PROJECT_ID } : {}
          : { projectId: CUSTOMER_PROJECT_ID }),
      },
    },
    android: {
      package: IS_DRIVER
        ? 'com.subasri0102.deliverypartner'
        : 'com.subasri0102.deliveryapp',
      adaptiveIcon: {
        foregroundImage: `${ICON_DIR}/icon.png`,
        backgroundColor: IS_DRIVER ? '#FFFFFF' : '#2D2A8C',
      },
      googleServicesFile: IS_DRIVER
        ? './google-services.driver.json'
        : './google-services.customer.json',
      permissions: IS_DRIVER
        ? ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'ACCESS_BACKGROUND_LOCATION']
        : [],
      config: { googleMaps: { apiKey: MAPS_KEY } },
    },
    ios: {
      icon: `${ICON_DIR}/icon.png`,
      bundleIdentifier: IS_DRIVER
        ? 'com.subasri0102.deliverypartner'
        : 'com.subasri0102.deliveryapp',
      config: { googleMapsApiKey: MAPS_KEY },
    },
    plugins: [
      ['expo-notifications', {
        icon: './assets/images/notification-icon.png',
        color: '#6C5CE7',
        defaultChannel: 'orders',
      }],
    ],
  },
};