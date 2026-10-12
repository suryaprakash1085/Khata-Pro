import Constants from 'expo-constants';

export const APP_MODE = (Constants.expoConfig?.extra?.appMode ?? 'customer') as
  | 'customer'
  | 'driver';