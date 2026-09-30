// import React, { useState, useContext, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AddressContext, Address } from '../../context/AddressContext';
// import { CartContext } from '../../context/CartContext';
// import { AuthContext } from '../../context/AuthContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location';

// const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000') + '/api';

// let authToken: string | null = null;

// // ✅ Theme color — matched to Cart screen's purple/indigo (#6C5CE7)
// const THEME_COLOR = '#6C5CE7';
// const THEME_COLOR_LIGHT = '#F1EFFE'; // light tint for selected/active backgrounds

// // ✅ Indian States & Union Territories
// const INDIAN_STATES = [
//   'Andhra Pradesh',
//   'Arunachal Pradesh',
//   'Assam',
//   'Bihar',
//   'Chhattisgarh',
//   'Goa',
//   'Gujarat',
//   'Haryana',
//   'Himachal Pradesh',
//   'Jharkhand',
//   'Karnataka',
//   'Kerala',
//   'Madhya Pradesh',
//   'Maharashtra',
//   'Manipur',
//   'Meghalaya',
//   'Mizoram',
//   'Nagaland',
//   'Odisha',
//   'Punjab',
//   'Rajasthan',
//   'Sikkim',
//   'Tamil Nadu',
//   'Telangana',
//   'Tripura',
//   'Uttar Pradesh',
//   'Uttarakhand',
//   'West Bengal',
//   'Andaman and Nicobar Islands',
//   'Chandigarh',
//   'Dadra and Nagar Haveli and Daman and Diu',
//   'Delhi',
//   'Jammu and Kashmir',
//   'Ladakh',
//   'Lakshadweep',
//   'Puducherry',
// ];

// // ✅ Major Indian Cities
// const CITIES_BY_STATE: { [key: string]: string[] } = {
//   'Andhra Pradesh': [
//     'Visakhapatnam',
//     'Vijayawada',
//     'Guntur',
//     'Nellore',
//     'Kurnool',
//     'Tirupati',
//   ],
//   'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
//   Assam: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
//   Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
//   Chhattisgarh: ['Raipur', 'Bhilai', 'Bilaspur', 'Durg'],
//   Goa: ['Panaji', 'Margao', 'Vasco da Gama'],
//   Gujarat: [
//     'Ahmedabad',
//     'Surat',
//     'Vadodara',
//     'Rajkot',
//     'Bhavnagar',
//     'Gandhinagar',
//   ],
//   Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
//   'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
//   Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
//   Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
//   Kerala: [
//     'Thiruvananthapuram',
//     'Kochi',
//     'Kozhikode',
//     'Thrissur',
//     'Kollam',
//   ],
//   'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
//   Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
//   Manipur: ['Imphal'],
//   Meghalaya: ['Shillong'],
//   Mizoram: ['Aizawl'],
//   Nagaland: ['Kohima', 'Dimapur'],
//   Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela'],
//   Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
//   Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
//   Sikkim: ['Gangtok'],
//   'Tamil Nadu': [
//     'Chennai',
//     'Coimbatore',
//     'Madurai',
//     'Tiruchirappalli',
//     'Salem',
//     'Tirunelveli',
//     'Tiruppur',
//     'Erode',
//     'Vellore',
//     'Thoothukudi',
//     'Dindigul',
//     'Thanjavur',
//     'Ranipet',
//     'Sivakasi',
//     'Karur',
//     'Udhagamandalam',
//     'Hosur',
//     'Nagercoil',
//     'Kanchipuram',
//     'Kumbakonam',
//     'Karaikudi',
//     'Neyveli',
//     'Cuddalore',
//     'Kumarapalayam',
//     'Rajapalayam',
//     'Pudukkottai',
//     'Vaniyambadi',
//     'Ambur',
//     'Nagapattinam',
//     'Pollachi',
//     'Krishnagiri',
//     'Namakkal',
//     'Perambalur',
//     'Sankarankoil',
//     'Theni',
//     'Tenkasi',
//     'Tiruvannamalai',
//     'Virudhunagar',
//     'Ariyalur',
//   ],
//   Telangana: ['Hyderabad', 'Warangal', 'Nizamabad'],
//   Tripura: ['Agartala'],
//   'Uttar Pradesh': [
//     'Lucknow',
//     'Kanpur',
//     'Ghaziabad',
//     'Agra',
//     'Noida',
//     'Varanasi',
//   ],
//   Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital'],
//   'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
//   'Andaman and Nicobar Islands': ['Port Blair'],
//   Chandigarh: ['Chandigarh'],
//   'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Silvassa'],
//   Delhi: ['New Delhi', 'Delhi'],
//   'Jammu and Kashmir': ['Srinagar', 'Jammu'],
//   Ladakh: ['Leh', 'Kargil'],
//   Lakshadweep: ['Kavaratti'],
//   Puducherry: ['Puducherry'],
// };

// // Flat list of every city
// const ALL_CITIES = Array.from(
//   new Set(Object.values(CITIES_BY_STATE).flat())
// ).sort();

// interface AddressSelectionScreenProps {
//   navigation: any;
//   route: any;
// }

// // ============================================================
// // ⏱️ Generic fetch wrapper with a hard timeout, so a slow/unresponsive
// // server can never leave the UI stuck on an infinite spinner. If the
// // server doesn't reply within `timeoutMs`, the request is aborted and
// // the caller's existing catch/fallback logic takes over.
// // ============================================================
// const fetchWithTimeout = async (
//   url: string,
//   options: RequestInit = {},
//   timeoutMs: number = 10000
// ): Promise<Response> => {
//   const controller = new AbortController();
//   const timer = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const response = await fetch(url, { ...options, signal: controller.signal });
//     return response;
//   } finally {
//     clearTimeout(timer);
//   }
// };

// // ============================================================
// // 🗺️ Load Google Maps JS API script once (web only)
// // ============================================================
// let googleMapsLoadPromise: Promise<void> | null = null;

// const loadGoogleMapsScript = (): Promise<void> => {
//   if ((window as any).google?.maps) return Promise.resolve();
//   if (googleMapsLoadPromise) return googleMapsLoadPromise;

//   googleMapsLoadPromise = new Promise((resolve, reject) => {
//     const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
//     if (!apiKey) {
//       reject(new Error('Google Maps API key is missing. Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to .env'));
//       return;
//     }

//     const existingScript = document.getElementById('google-maps-script');
//     if (existingScript) {
//       existingScript.addEventListener('load', () => resolve());
//       return;
//     }

//     // ⏱️ If the script hasn't loaded within 10s (blocked network, slow CDN,
//     // firewall etc.), bail out instead of hanging forever.
//     const timer = setTimeout(() => {
//       googleMapsLoadPromise = null; // allow a retry on next attempt
//       reject(new Error('Google Maps script load timed out. Please check your internet connection.'));
//     }, 10000);

//     const script = document.createElement('script');
//     script.id = 'google-maps-script';
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.onload = () => {
//       clearTimeout(timer);
//       resolve();
//     };
//     script.onerror = () => {
//       clearTimeout(timer);
//       googleMapsLoadPromise = null;
//       reject(new Error('Failed to load Google Maps script'));
//     };
//     document.body.appendChild(script);
//   });

//   return googleMapsLoadPromise;
// };

// const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({
//   navigation,
//   route,
// }) => {
//   const { totalAmount, restaurantName, cartItems, discount = 0, promoCode = null, promoId = null } = route.params || {};
//   const {
//     addresses,
//     selectedAddress,
//     setSelectedAddress,
//     addAddress,
//     setDefaultAddress,
//     refreshAddresses,
//   } = useContext(AddressContext);

//   const { getTotalPrice, getTotalItems } = useContext(CartContext);

//   const { user, updateUser } = useContext(AuthContext);

//   useEffect(() => {
//     const loadToken = async () => {
//       const token = await AsyncStorage.getItem('authToken');

//       if (token) {
//         authToken = token;
//       }
//     };

//     loadToken();
//   }, []);

//   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [gettingLocation, setGettingLocation] = useState(false);
//   const [locationError, setLocationError] = useState<string>('');

//   // 👇 Google Map picker modal state (web only)
//   const [showMapPicker, setShowMapPicker] = useState(false);
//   const [mapMarkerPos, setMapMarkerPos] = useState<{ lat: number; lng: number } | null>(null);
//   const [confirmingMapLocation, setConfirmingMapLocation] = useState(false);
//   const mapContainerRef = React.useRef<any>(null);
//   const googleMapRef = React.useRef<any>(null);
//   const googleMarkerRef = React.useRef<any>(null);

//   // ✅ Validation error states
//   const [phoneError, setPhoneError] = useState<string>('');
//   const [pincodeError, setPincodeError] = useState<string>('');
//   const [addressError, setAddressError] = useState<string>('');
//   const [cityError, setCityError] = useState<string>('');

//   // ✅ City / State dropdowns
//   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
//   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
//   const [citySearch, setCitySearch] = useState('');
//   const [stateSearch, setStateSearch] = useState('');

//   const [formData, setFormData] = useState({
//     type: 'Home' as 'Home' | 'Work' | 'Other',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     landmark: '',
//     phone: '',
//     isDefault: false,
//     latitude: 0,
//     longitude: 0,
//   });

//   const totalPrice = totalAmount || getTotalPrice(); // ✅ Use totalAmount first

//   const totalItems = getTotalItems();

//   // ✅ City list depends on selected state
//   const cityOptions =
//     formData.state && CITIES_BY_STATE[formData.state]
//       ? CITIES_BY_STATE[formData.state]
//       : ALL_CITIES;

//   const filteredStates = INDIAN_STATES.filter((s) =>
//     s.toLowerCase().includes(stateSearch.toLowerCase())
//   );

//   const filteredCities = cityOptions.filter((c) =>
//     c.toLowerCase().includes(citySearch.toLowerCase())
//   );

//   const handleSelectState = (state: string) => {
//     const stillValid = CITIES_BY_STATE[state]?.includes(formData.city);

//     setFormData({
//       ...formData,
//       state,
//       city: stillValid ? formData.city : '',
//     });

//     setStateSearch('');
//     setStateDropdownOpen(false);
//   };

//   const handleSelectCity = (city: string) => {
//     setFormData({
//       ...formData,
//       city,
//     });

//     setCitySearch('');
//     setCityDropdownOpen(false);
//     setCityError('');
//   };

//   // ✅ Phone number validation
//   const validatePhoneNumber = (text: string) => {
//     const cleaned = text.replace(/[^0-9]/g, '');
//     const limited = cleaned.slice(0, 10);

//     setFormData({
//       ...formData,
//       phone: limited,
//     });

//     if (limited.length > 0 && limited.length !== 10) {
//       setPhoneError('Phone number must be exactly 10 digits');
//     } else {
//       setPhoneError('');
//     }
//   };

//   // ✅ Pincode validation
//   const validatePincode = (text: string) => {
//     const cleaned = text.replace(/[^0-9]/g, '');
//     const limited = cleaned.slice(0, 6);

//     setFormData({
//       ...formData,
//       pincode: limited,
//     });

//     if (limited.length > 0 && limited.length !== 6) {
//       setPincodeError('Pincode must be exactly 6 digits');
//     } else {
//       setPincodeError('');
//     }
//   };

//   // ============================================================
//   // ✅ Build a temporary "current location" Address object and push
//   // it straight into AddressContext.selectedAddress, so HomeScreen's
//   // header (and anywhere else reading selectedAddress) updates the
//   // instant GPS is detected — user doesn't have to save/select it
//   // separately from the "Saved Addresses" list first.
//   // ============================================================
//   const applyLiveLocationAsSelected = (params: {
//     formattedAddress: string;
//     city: string;
//     state: string;
//     pincode: string;
//     latitude: number;
//     longitude: number;
//   }) => {
//     const liveAddress: Address = {
//       id: 'current_location',
//       type: 'Other',
//       address: params.formattedAddress,
//       city: params.city,
//       state: params.state,
//       pincode: params.pincode,
//       landmark: '',
//       phone: '',
//       isDefault: false,
//       latitude: params.latitude,
//       longitude: params.longitude,
//     };

//     setSelectedAddress(liveAddress);
//   };

//   // ============================================================
//   // 🗺️ Initialize the interactive map with a draggable marker
//   // ============================================================
//   const initMapPicker = async (lat: number, lng: number) => {
//     try {
//       await loadGoogleMapsScript();
//     } catch (err: any) {
//       console.error('❌ Google Maps script load error:', err);
//       Alert.alert('❌ Map Error', err?.message || 'Failed to load Google Maps.');
//       // Script failed/timed out — go back to the form instead of leaving
//       // the user stuck on a blank map screen.
//       setShowMapPicker(false);
//       setShowAddAddressModal(true);
//       return;
//     }

//     const google = (window as any).google;
//     if (!google?.maps || !mapContainerRef.current) return;

//     const map = new google.maps.Map(mapContainerRef.current, {
//       center: { lat, lng },
//       zoom: 16,
//       disableDefaultUI: false,
//       zoomControl: true,
//       streetViewControl: false,
//       mapTypeControl: false,
//     });

//     const marker = new google.maps.Marker({
//       position: { lat, lng },
//       map,
//       draggable: true,
//     });

//     marker.addListener('dragend', () => {
//       const pos = marker.getPosition();
//       if (pos) {
//         setMapMarkerPos({ lat: pos.lat(), lng: pos.lng() });
//       }
//     });

//     // Also allow tapping anywhere on the map to move the pin
//     map.addListener('click', (e: any) => {
//       const lat2 = e.latLng.lat();
//       const lng2 = e.latLng.lng();
//       marker.setPosition({ lat: lat2, lng: lng2 });
//       setMapMarkerPos({ lat: lat2, lng: lng2 });
//     });

//     googleMapRef.current = map;
//     googleMarkerRef.current = marker;
//     setMapMarkerPos({ lat, lng });
//   };

//   // ============================================================
//   // 🗺️ Reverse geocode the final pin position using OpenStreetMap
//   // Nominatim (free, no API key / no billing needed). Google Maps
//   // JS API is used only for the visual map + draggable pin above —
//   // the actual address lookup goes through Nominatim so we don't
//   // need Google Cloud billing enabled at all.
//   // ============================================================
//   const reverseGeocodeNominatim = async (lat: number, lng: number): Promise<any> => {
//     const response = await fetchWithTimeout(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
//       {
//         headers: {
//           Accept: 'application/json',
//           // ⚠️ Nominatim's usage policy requires a real User-Agent — without
//           // one, requests can be silently throttled/dropped under load.
//           'User-Agent': 'DeliveryApp/1.0 (contact@example.com)',
//         },
//       },
//       8000 // 8s timeout — falls back to raw coordinates if it doesn't respond
//     );

//     if (!response.ok) {
//       throw new Error(`Reverse geocode failed: ${response.status}`);
//     }

//     return response.json();
//   };

//   // ============================================================
//   // 🗺️ User confirms the pin position on the map
//   // ============================================================
//   const handleConfirmMapLocation = async () => {
//     if (!mapMarkerPos) return;

//     setConfirmingMapLocation(true);

//     try {
//       const data = await reverseGeocodeNominatim(mapMarkerPos.lat, mapMarkerPos.lng);

//       const addr = data?.address || {};

//       const city =
//         addr.city ||
//         addr.town ||
//         addr.village ||
//         addr.suburb ||
//         addr.county ||
//         '';

//       const state = addr.state || '';
//       const pincode = addr.postcode || '';

//       let formattedAddress =
//         data?.display_name ||
//         [addr.road, addr.suburb, addr.city].filter(Boolean).join(', ');

//       if (!formattedAddress) {
//         formattedAddress = `${mapMarkerPos.lat}, ${mapMarkerPos.lng}`;
//       }

//       setFormData((prev) => ({
//         ...prev,
//         address: formattedAddress,
//         city,
//         state,
//         pincode,
//         latitude: mapMarkerPos.lat,
//         longitude: mapMarkerPos.lng,
//       }));

//       setAddressError('');
//       setCityError('');
//       setPincodeError('');

//       applyLiveLocationAsSelected({
//         formattedAddress,
//         city,
//         state,
//         pincode,
//         latitude: mapMarkerPos.lat,
//         longitude: mapMarkerPos.lng,
//       });

//       setShowMapPicker(false);
//       // ✅ Automatically bring the Add Address form back up, now pre-filled
//       // with the confirmed live location.
//       setShowAddAddressModal(true);
//       Alert.alert('📍 Location Confirmed!', formattedAddress);
//     } catch (err: any) {
//       console.error('❌ Reverse geocode error:', err);

//       // Even if address lookup fails, keep the pin's coordinates so
//       // checkout / delivery-fee calculation still works.
//       setFormData((prev) => ({
//         ...prev,
//         address: `${mapMarkerPos.lat}, ${mapMarkerPos.lng}`,
//         latitude: mapMarkerPos.lat,
//         longitude: mapMarkerPos.lng,
//       }));

//       applyLiveLocationAsSelected({
//         formattedAddress: `${mapMarkerPos.lat}, ${mapMarkerPos.lng}`,
//         city: '',
//         state: '',
//         pincode: '',
//         latitude: mapMarkerPos.lat,
//         longitude: mapMarkerPos.lng,
//       });

//       setShowMapPicker(false);
//       // ✅ Still bring the form back up so the user can edit the address
//       // manually instead of being left on a closed screen.
//       setShowAddAddressModal(true);
//       Alert.alert('⚠️ Address lookup failed', 'Location saved using coordinates. Please edit the address manually if needed.');
//     } finally {
//       setConfirmingMapLocation(false);
//     }
//   };

//   // ============================================================
//   // 🗺️ User cancels/closes the map picker without confirming —
//   // bring the Add Address form back so they aren't left with nothing.
//   // ============================================================
//   const closeMapPickerAndReturnToForm = () => {
//     setShowMapPicker(false);
//     setShowAddAddressModal(true);
//   };

//   // ============================================================
//   // ✅ GET CURRENT GPS LOCATION
//   // Works on Android/iOS (expo-location) AND Web (browser Geolocation API
//   // + Google Maps picker modal)
//   // ============================================================
//   const getCurrentLocation = async () => {
//     setLocationError('');
//     setGettingLocation(true);

//     // ============================================================
//     // 🌐 WEB — expo-location's GPS is NOT supported on web, so we use
//     // the browser's native Geolocation API to get a lat/lng fix, then
//     // open an interactive Google Map modal so the user can drag/tap
//     // to confirm the exact pin before we reverse-geocode it.
//     // Android/iOS flow below is completely untouched.
//     // ============================================================
//     if (Platform.OS === 'web') {
//       if (
//         typeof navigator === 'undefined' ||
//         !navigator.geolocation
//       ) {
//         const message = 'Geolocation is not supported by this browser.';

//         setLocationError(message);
//         Alert.alert('❌ Location Error', message);
//         setGettingLocation(false);
//         // No map to show — bring the form back.
//         setShowAddAddressModal(true);
//         return;
//       }

//       const handleWebPositionSuccess = async (position: any) => {
//         const { latitude, longitude } = position.coords;

//         console.log('📍 GPS LOCATION FOUND (WEB)');
//         console.log('Latitude:', latitude);
//         console.log('Longitude:', longitude);

//         setGettingLocation(false);

//         // 👇 Instead of auto-filling via Nominatim, open the interactive
//         // Google Map picker so the user can confirm/adjust the exact pin.
//         // (Add Address modal is already hidden — it's brought back once
//         // the user confirms the pin or cancels.)
//         setShowMapPicker(true);

//         // Wait for the modal to render (and mapContainerRef to attach)
//         // before initializing the map.
//         setTimeout(() => {
//           initMapPicker(latitude, longitude);
//         }, 300);
//       };

//       // ✅ Retry once (with an even longer timeout) before giving up —
//       // some browsers/networks need a "warm up" attempt to acquire a fix.
//       const requestWebPosition = (isRetry: boolean) => {
//         navigator.geolocation.getCurrentPosition(
//           handleWebPositionSuccess,
//           (error) => {
//             console.error('❌ GPS location error (WEB):', error);

//             // Timed out on the first try — automatically retry once
//             if (error?.code === 3 && !isRetry) {
//               console.log('⏳ Retrying web location request...');
//               requestWebPosition(true);
//               return;
//             }

//             let message =
//               error?.message || 'Unable to get your current location.';

//             // Standard browser Geolocation error codes
//             if (error?.code === 1) {
//               message =
//                 'Location permission was denied. Please allow location permission from your browser settings.';
//             } else if (error?.code === 2) {
//               message = 'Location is currently unavailable.';
//             } else if (error?.code === 3) {
//               message =
//                 'Location request timed out. Please check that location services are turned on for your browser/device and try again.';
//             }

//             setLocationError(message);
//             Alert.alert('❌ Location Error', message);
//             setGettingLocation(false);
//             // Attempt failed and there's no map to show — bring the form back.
//             setShowAddAddressModal(true);
//           },
//           {
//             // ⚠️ Desktop/laptop browsers have no GPS chip — high accuracy
//             // mode forces them to wait for a GPS fix that never comes and
//             // times out. Low accuracy uses WiFi/IP positioning instead,
//             // which is much faster and reliable on web.
//             enableHighAccuracy: false,
//             timeout: isRetry ? 30000 : 20000,
//             maximumAge: 60000,
//           }
//         );
//       };

//       requestWebPosition(false);

//       return;
//     }

//     // ============================================================
//     // 📱 ANDROID / iOS — unchanged, uses expo-location
//     // ============================================================
//     try {
//       console.log('📍 Requesting location permission...');

//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status !== 'granted') {
//         const message =
//           'Location permission was denied. Please allow location permission from your browser/device settings.';

//         setLocationError(message);
//         Alert.alert('Location Permission', message);
//         setGettingLocation(false);
//         setShowAddAddressModal(true);
//         return;
//       }

//       console.log('📍 Getting current GPS location...');

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//       });

//       const { latitude, longitude } = location.coords;

//       console.log('📍 GPS LOCATION FOUND');
//       console.log('Latitude:', latitude);
//       console.log('Longitude:', longitude);

//       try {
//         const results = await Location.reverseGeocodeAsync({
//           latitude,
//           longitude,
//         });

//         console.log('📦 Reverse geocode result:', results);

//         if (results.length > 0) {
//           const result = results[0];

//           const city =
//             result.city ||
//             result.district ||
//             result.subregion ||
//             '';

//           const state = result.region || '';
//           const pincode = result.postalCode || '';

//           let formattedAddress = [
//             result.name,
//             result.street,
//             result.district,
//             result.city,
//           ]
//             .filter(Boolean)
//             .join(', ');

//           if (!formattedAddress) {
//             formattedAddress = `${latitude}, ${longitude}`;
//           }

//           setFormData(prev => ({
//             ...prev,
//             address: formattedAddress,
//             city,
//             state,
//             pincode,
//             latitude,
//             longitude,
//           }));

//           setAddressError('');
//           setCityError('');
//           setPincodeError('');

//           // ✅ Reflect immediately on HomeScreen and anywhere else that
//           // reads selectedAddress — no extra save/select step needed.
//           applyLiveLocationAsSelected({
//             formattedAddress,
//             city,
//             state,
//             pincode,
//             latitude,
//             longitude,
//           });

//           Alert.alert(
//             '📍 Location Found!',
//             `Address: ${formattedAddress}\n\nLatitude: ${latitude}\nLongitude: ${longitude}`
//           );

//           // ✅ Bring the Add Address form back up, now pre-filled.
//           setShowAddAddressModal(true);
//         } else {
//           setFormData(prev => ({
//             ...prev,
//             latitude,
//             longitude,
//           }));

//           // ✅ Still reflect on HomeScreen using coordinates as the label
//           applyLiveLocationAsSelected({
//             formattedAddress: `${latitude}, ${longitude}`,
//             city: '',
//             state: '',
//             pincode: '',
//             latitude,
//             longitude,
//           });

//           Alert.alert(
//             '📍 GPS Location Found',
//             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`
//           );

//           setShowAddAddressModal(true);
//         }
//       } catch (geocodeError) {
//         console.error('❌ Reverse geocoding error:', geocodeError);

//         // GPS worked even if address lookup failed
//         setFormData(prev => ({
//           ...prev,
//           latitude,
//           longitude,
//         }));

//         // ✅ Still reflect on HomeScreen using coordinates as the label
//         applyLiveLocationAsSelected({
//           formattedAddress: `${latitude}, ${longitude}`,
//           city: '',
//           state: '',
//           pincode: '',
//           latitude,
//           longitude,
//         });

//         Alert.alert(
//           '📍 GPS Location Found',
//           `Latitude: ${latitude}\nLongitude: ${longitude}\n\nAddress lookup failed. Please enter your address manually.`
//         );

//         setShowAddAddressModal(true);
//       }
//     } catch (error: any) {
//       console.error('❌ GPS location error:', error);

//       setLocationError(
//         error?.message || 'Unable to get your current location.'
//       );

//       Alert.alert(
//         '❌ Location Error',
//         error?.message || 'Unable to get your current location.'
//       );

//       setShowAddAddressModal(true);
//     } finally {
//       // VERY IMPORTANT
//       setGettingLocation(false);
//     }
//   };
//   // ✅ Mobile + Web
//   const requestLocationPermission = () => {
//     getCurrentLocation();
//   };

//   // ============================================================
//   // ✅ Called from the "Use Live Location" button INSIDE the Add
//   // Address modal. Hides the form so the map picker (web) or the
//   // permission/GPS flow (mobile) can run — the form is reopened
//   // automatically once a location is confirmed, fails, or is cancelled.
//   // ============================================================
//   const handleLiveLocationButtonPress = () => {
//     setShowAddAddressModal(false);
//     requestLocationPermission();
//   };

//   const getAddressTypeIcon = (type: string) => {
//     switch (type) {
//       case 'Home':
//         return 'home-outline';
//       case 'Work':
//         return 'briefcase-outline';
//       case 'Other':
//         return 'location-outline';
//       default:
//         return 'location-outline';
//     }
//   };

//   const getAddressTypeColor = (type: string) => {
//     switch (type) {
//       case 'Home':
//         return '#4CAF50';
//       case 'Work':
//         return '#2196F3';
//       case 'Other':
//         return '#FF9800';
//       default:
//         return '#757575';
//     }
//   };


//   const [calculatingFeeForId, setCalculatingFeeForId] = useState<string | null>(null);

//   // ✅ Real delivery fee — calculated from the ACTUAL selected address's
//   // lat/lng against the store's delivery-fee settings, not a hardcoded
//   // Delhi fallback.
//   const calculateRealDeliveryFee = async (address: Address): Promise<{
//     fee: number;
//     breakdown: any;
//   }> => {
//     const businessId = cartItems?.[0]?.restaurantId ? Number(cartItems[0].restaurantId) : undefined;
//     if (!businessId || !address.latitude || !address.longitude) {
//       console.warn('⚠️ Missing businessId or address coordinates — using fallback fee ₹30', {
//         businessId,
//         lat: address.latitude,
//         lng: address.longitude,
//       });
//       return { fee: 30, breakdown: null };
//     }

//     try {
//       const response = await fetchWithTimeout(`${API_BASE_URL}/api/delivery-fees/calculate`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           business_id: businessId,
//           customer_latitude: address.latitude,
//           customer_longitude: address.longitude,
//         }),
//       }, 8000);
//       const data = await response.json();
//       if (!response.ok) {
//         console.error('❌ Delivery fee calculate error:', response.status, data);
//         return { fee: 30, breakdown: null };
//       }
//       console.log('✅ Real delivery fee for this address:', data);
//       return { fee: data.delivery_fee, breakdown: data };
//     } catch (err) {
//       console.error('❌ Network error calculating delivery fee:', err);
//       return { fee: 30, breakdown: null };
//     }
//   };

//   const handleSelectAddress = async (address: Address) => {
//     setSelectedAddress(address);
//     setCalculatingFeeForId(address.id);

//     const { fee, breakdown } = await calculateRealDeliveryFee(address);

//     setCalculatingFeeForId(null);

//     // ✅ GST — same weighted-per-item calculation CartScreen already does,
//     // kept consistent here since totalAmount arriving from Cart may not
//     // include a fresh GST breakdown.
//     const gstTotal = (cartItems || []).reduce((sum: number, item: any) => {
//       const itemTotal = (item.price || 0) * (item.quantity || 1);
//       const gstRate = item.gst_rate || 0;
//       return sum + itemTotal * (gstRate / 100);
//     }, 0);
//     const roundedGst = Math.round(gstTotal);

//     const subtotal = (cartItems || []).reduce(
//       (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
//       0,
//     );

//     navigation.navigate('PaymentScreen', {
//       address: address,
//       totalAmount: subtotal + fee + roundedGst, // ✅ recalculated with real fee
//       subtotal,
//       deliveryFee: fee,               // ✅ REAL fee, no more hardcoded 40
//       deliveryFeeBreakdown: breakdown, // optional: show "Free within 5km" etc on PaymentScreen
//       tax: roundedGst,
//        discount: discount,        // 👈 NEW — forward pannunga
//     promoCode: promoCode,      // 👈 NEW
//     promoId: promoId,
//       restaurantName: restaurantName,
//       cartItems: cartItems,
//       orderId: 'ORD-' + Date.now().toString().slice(-6),
//     });
//   };

// const handleAddAddress = async () => {
//   console.log('🔵 handleAddAddress CALLED');

//   // Reset previous inline errors
//   setAddressError('');
//   setCityError('');
//   setPincodeError('');
//   setPhoneError('');

//   const missingFields: string[] = [];

//   if (!formData.address || !formData.address.trim()) {
//     setAddressError('Address is required');
//     missingFields.push('Address');
//   }

//   if (!formData.city || !formData.city.trim()) {
//     setCityError('City is required');
//     missingFields.push('City');
//   }

//   if (!formData.pincode || !formData.pincode.trim()) {
//     setPincodeError('Pincode is required');
//     missingFields.push('Pincode');
//   }

//   console.log('🟡 Validation check, missingFields:', missingFields);

//   // ✅ If any mandatory field is missing, show popup and stop here
//   if (missingFields.length > 0) {
//     Alert.alert(
//       '⚠️ Required Fields Missing',
//       `Please fill the following mandatory field(s):\n\n• ${missingFields.join(
//         '\n• '
//       )}`
//     );
//     return;
//   }

//   // ✅ Validate pincode format (only reached if pincode is non-empty)
//   if (formData.pincode.length !== 6) {
//     setPincodeError('Pincode must be exactly 6 digits');
//     Alert.alert('⚠️ Invalid Pincode', 'Pincode must be exactly 6 digits');
//     return;
//   }

//   // ✅ Validate phone format (phone itself is optional, but if entered it must be valid)
//   if (formData.phone && formData.phone.length !== 10) {
//     setPhoneError('Phone number must be exactly 10 digits');
//     Alert.alert(
//       '⚠️ Invalid Phone Number',
//       'Phone number must be exactly 10 digits'
//     );
//     return;
//   }

//   if (!user?.id) {
//     console.log('🔴 STUCK: user?.id missing! user =', user);
//     Alert.alert('⚠️ Error', 'User not found. Please login again.');
//     return;
//   }

//   console.log('🟢 All validation passed, calling setIsLoading(true)');
//   setIsLoading(true);

//   try {
//     const fullAddress = `${formData.address}, ${formData.city}, ${
//       formData.state || ''
//     } - ${formData.pincode}`;

//     console.log('🟢 Before updateUser call, fullAddress:', fullAddress);

//     // Single API call
//     const ok = await updateUser({
//       address: fullAddress,
//     });

//     console.log('🟢 After updateUser call, result:', ok);

//     if (!ok) {
//       Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
//       setIsLoading(false);
//       return;
//     }

//     console.log('✅ Address updated successfully');

//     // Save to local address context
//     const newAddress: Address = {
//       id: `addr_${Date.now()}`,
//       type: formData.type,
//       address: formData.address,
//       city: formData.city,
//       state: formData.state || '',
//       pincode: formData.pincode,
//       landmark: formData.landmark || '',
//       phone: formData.phone || '',
//       isDefault: addresses.length === 0 || formData.isDefault,
//       latitude: formData.latitude,
//       longitude: formData.longitude,
//     };

//     addAddress(newAddress);

//     setIsLoading(false);
//     setShowAddAddressModal(false);
//     resetForm();

//     // ✅ Select the newly added address
//     setSelectedAddress(newAddress);

//     // ✅ Refresh the address list to show the new address
//     await refreshAddresses();

//     // ✅ Stay on this screen - NO NAVIGATION to PaymentScreen
//     // The user will manually click "Deliver to Home" button to proceed
//     Alert.alert(
//       '✅ Address Saved',
//       `Your ${newAddress.type} address has been added successfully.`,
//       [{ text: 'OK' }]
//     );
//   } catch (error: any) {
//     console.error('❌ Error saving address:', error);
//     Alert.alert(
//       '❌ Error',
//       error.message || 'Failed to save address. Please try again.'
//     );
//     setIsLoading(false);
//   }
// };
//   // ✅ Reset form
//   const resetForm = () => {
//     setFormData({
//       type: 'Home',
//       address: '',
//       city: '',
//       state: '',
//       pincode: '',
//       landmark: '',
//       phone: '',
//       isDefault: false,
//       latitude: 0,
//       longitude: 0,
//     });

//     setPhoneError('');
//     setPincodeError('');
//     setAddressError('');
//     setCityError('');
//     setCitySearch('');
//     setStateSearch('');
//     setCityDropdownOpen(false);
//     setStateDropdownOpen(false);
//   };

//   // ============================================================
//   // SAVED ADDRESS ITEM
//   // ============================================================
//   const renderAddressItem = ({ item }: { item: Address }) => {
//     const isSelected = selectedAddress?.id === item.id;

//     return (
//       <TouchableOpacity
//         key={item.id}
//         style={[styles.addressCard, isSelected && styles.addressCardSelected]}
//         onPress={() => handleSelectAddress(item)}
//         activeOpacity={0.7}
//       >
//         <View style={styles.addressHeader}>
//           <View style={styles.addressTypeContainer}>
//             <Icon
//               name={getAddressTypeIcon(item.type)}
//               size={18}
//               color={getAddressTypeColor(item.type)}
//             />

//             <Text style={styles.addressTypeText}>{item.type}</Text>
//           </View>

//           {item.isDefault && (
//             <View style={styles.defaultBadge}>
//               <Text style={styles.defaultBadgeText}>Default</Text>
//             </View>
//           )}

//           {isSelected && (
//             <Icon
//               name="checkmark-circle"
//               size={22}
//               color="#4CAF50"
//               style={styles.selectedIcon}
//             />
//           )}
//         </View>

//         <Text style={styles.addressDetail}>{item.address}</Text>

//         {item.landmark && (
//           <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
//         )}

//         {item.phone && (
//           <Text style={styles.addressPhone}>📞 {item.phone}</Text>
//         )}

//         <Text style={styles.addressDetail}>
//           {item.city}, {item.state || ''} - {item.pincode}
//         </Text>

//         {item.latitude && item.longitude && (
//           <View style={styles.locationTag}>
//             <Icon name="location-outline" size={12} color="#28a745" />

//             <Text style={styles.locationTagText}>Live location</Text>
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Icon name="arrow-back" size={24} color="#282c3f" />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Delivery Address</Text>

//         {/* Spacer so the title stays centered now that the + icon is gone */}
//         <View style={styles.headerSpacer} />
//       </View>

//       {/* ADD NEW ADDRESS — replaces the old + icon; opens the Add Address modal */}
//       <TouchableOpacity
//         style={styles.locationButton}
//         onPress={() => setShowAddAddressModal(true)}
//       >
//         <Icon name="add-circle-outline" size={22} color={THEME_COLOR} />

//         <Text style={styles.locationButtonText}>
//           Add New Address
//         </Text>
//       </TouchableOpacity>

//       {/* SAVED ADDRESSES */}
// 		<FlatList
//   data={addresses as Address[]}
//   renderItem={renderAddressItem}
//   keyExtractor={(item: Address) => item.id}
//   showsVerticalScrollIndicator={false}
//         ListHeaderComponent={
//           addresses.length > 0 ? (
//             <Text style={styles.listHeader}>Saved Addresses</Text>
//           ) : null
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="location-outline" size={60} color="#ccc" />

//             <Text style={styles.emptyText}>No Addresses Saved</Text>

//             <Text style={styles.emptySubText}>Add a new address</Text>
//           </View>
//         }
//       />

//       {/* BOTTOM BAR */}
//       {selectedAddress && (
//         <View style={styles.bottomBar}>
//           <View style={styles.bottomBarLeft}>
//             <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>

//             <Text style={styles.bottomBarItems}>{totalItems} items</Text>
//           </View>

//           <TouchableOpacity
//             style={styles.deliverButton}
//             onPress={() => handleSelectAddress(selectedAddress)}
//           >
//             <Text style={styles.deliverButtonText}>
//               Deliver to {selectedAddress.type}
//             </Text>

//             <Icon name="arrow-forward" size={18} color="#ffffff" />
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* 🗺️ GOOGLE MAP PICKER MODAL (WEB ONLY) */}
//       {Platform.OS === 'web' && (
//         <Modal
//           visible={showMapPicker}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={closeMapPickerAndReturnToForm}
//         >
//           <View style={styles.modalContainer}>
//             <View style={[styles.modalContent, { height: '85%', padding: 0 }]}>
//               <View style={[styles.modalHeader, { padding: 16 }]}>
//                 <Text style={styles.modalTitle}>Confirm Your Location</Text>
//                 <TouchableOpacity onPress={closeMapPickerAndReturnToForm}>
//                   <Icon name="close" size={24} color="#282c3f" />
//                 </TouchableOpacity>
//               </View>

//               <Text style={{ paddingHorizontal: 16, paddingBottom: 8, color: '#7e808c', fontSize: 13 }}>
//                 Drag the pin or tap the map to set your exact delivery location
//               </Text>

//               {/* Map container — plain View renders as a <div> on web,
//                   Google Maps JS attaches directly to this DOM node */}
//               <View
//                 ref={mapContainerRef}
//                 // @ts-ignore — web-only DOM styling
//                 style={{ flex: 1, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' }}
//               />

//               <View style={{ padding: 16 }}>
//                 <TouchableOpacity
//                   style={[styles.submitButton, confirmingMapLocation && styles.submitButtonDisabled]}
//                   onPress={handleConfirmMapLocation}
//                   disabled={confirmingMapLocation || !mapMarkerPos}
//                 >
//                   {confirmingMapLocation ? (
//                     <ActivityIndicator size="small" color="#ffffff" />
//                   ) : (
//                     <Text style={styles.submitButtonText}>Confirm This Location</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       )}

//       {/* ADD ADDRESS MODAL */}
//       <Modal
//         visible={showAddAddressModal}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             {/* MODAL HEADER */}
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add New Address</Text>

//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAddAddressModal(false);
//                   resetForm();
//                 }}
//               >
//                 <Icon name="close" size={24} color="#282c3f" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               nestedScrollEnabled={true}
//             >
//               {/* USE LIVE LOCATION — opens the map picker (web) / GPS flow
//                   (mobile) and auto-fills address/city/state/pincode below */}
//               <TouchableOpacity
//                 style={[styles.locationButton, { margin: 0, marginBottom: 16 }]}
//                 onPress={handleLiveLocationButtonPress}
//                 disabled={gettingLocation}
//               >
//                 {gettingLocation ? (
//                   <ActivityIndicator size="small" color={THEME_COLOR} />
//                 ) : (
//                   <>
//                     <Icon name="locate-outline" size={20} color={THEME_COLOR} />

//                     <Text style={styles.locationButtonText}>
//                       Use Live Location
//                     </Text>
//                   </>
//                 )}
//               </TouchableOpacity>

//               {/* ADDRESS TYPE */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Address Type</Text>

//                 <View style={styles.addressTypeButtons}>
//                   {['Home', 'Work', 'Other'].map((type) => (
//                     <TouchableOpacity
//                       key={type}
//                       style={[
//                         styles.addressTypeButton,
//                         formData.type === type &&
//                           styles.addressTypeButtonActive,
//                       ]}
//                       onPress={() =>
//                         setFormData({
//                           ...formData,
//                           type: type as 'Home' | 'Work' | 'Other',
//                         })
//                       }
//                     >
//                       <Icon
//                         name={getAddressTypeIcon(type)}
//                         size={18}
//                         color={
//                           formData.type === type ? THEME_COLOR : '#757575'
//                         }
//                       />

//                       <Text
//                         style={[
//                           styles.addressTypeButtonText,
//                           formData.type === type &&
//                             styles.addressTypeButtonTextActive,
//                         ]}
//                       >
//                         {type}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* ADDRESS */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Address *</Text>

//                 <TextInput
//                   style={[
//                     styles.formInput,
//                     styles.formInputMultiline,
//                     addressError ? styles.formInputError : null,
//                   ]}
//                   placeholder="Enter your address"
//                   value={formData.address}
//                   multiline
//                   numberOfLines={3}
//                   onChangeText={(text) => {
//                     setFormData({
//                       ...formData,
//                       address: text,
//                     });

//                     if (text.trim()) {
//                       setAddressError('');
//                     }
//                   }}
//                 />

//                 {addressError ? (
//                   <Text style={styles.errorText}>{addressError}</Text>
//                 ) : null}
//               </View>

//               {/* LANDMARK */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Landmark</Text>

//                 <TextInput
//                   style={styles.formInput}
//                   placeholder="Nearby landmark (optional)"
//                   value={formData.landmark}
//                   onChangeText={(text) =>
//                     setFormData({
//                       ...formData,
//                       landmark: text,
//                     })
//                   }
//                 />
//               </View>

//               {/* PHONE */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Phone Number</Text>

//                 <TextInput
//                   style={[
//                     styles.formInput,
//                     phoneError ? styles.formInputError : null,
//                   ]}
//                   placeholder="Enter 10-digit phone number"
//                   value={formData.phone}
//                   keyboardType="number-pad"
//                   maxLength={10}
//                   onChangeText={validatePhoneNumber}
//                 />

//                 {phoneError ? (
//                   <Text style={styles.errorText}>{phoneError}</Text>
//                 ) : null}

//                 <Text style={styles.hintText}>
//                   Enter exactly 10 digits (numbers only)
//                 </Text>
//               </View>

//               {/* CITY */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>City *</Text>

//                 <TouchableOpacity
//                   style={[
//                     styles.formInput,
//                     cityError ? styles.formInputError : null,
//                   ]}
//                   onPress={() => {
//                     setCityDropdownOpen(!cityDropdownOpen);
//                     setStateDropdownOpen(false);
//                   }}
//                 >
//                   <View style={styles.dropdownTriggerRow}>
//                     <Text
//                       style={
//                         formData.city
//                           ? styles.dropdownValueText
//                           : styles.dropdownPlaceholderText
//                       }
//                     >
//                       {formData.city || 'Select City'}
//                     </Text>

//                     <Icon
//                       name={cityDropdownOpen ? 'chevron-up' : 'chevron-down'}
//                       size={16}
//                       color="#757575"
//                     />
//                   </View>
//                 </TouchableOpacity>

//                 {cityError ? (
//                   <Text style={styles.errorText}>{cityError}</Text>
//                 ) : null}

//                 {cityDropdownOpen && (
//                   <View style={styles.dropdownPanel}>
//                     <View style={styles.searchBox}>
//                       <Icon name="search-outline" size={18} color="#7e808c" />

//                       <TextInput
//                         style={styles.searchInput}
//                         placeholder="Search city"
//                         value={citySearch}
//                         onChangeText={setCitySearch}
//                         autoFocus
//                       />
//                     </View>

//                     <ScrollView
//                       style={styles.dropdownList}
//                       nestedScrollEnabled={true}
//                       keyboardShouldPersistTaps="handled"
//                     >
//                       {filteredCities.length === 0 ? (
//                         <Text style={styles.pickerEmptyText}>
//                           No cities found
//                         </Text>
//                       ) : (
//                         filteredCities.map((item) => (
//                           <TouchableOpacity
//                             key={item}
//                             style={[
//                               styles.pickerRow,
//                               formData.city === item &&
//                                 styles.pickerRowActive,
//                             ]}
//                             onPress={() => handleSelectCity(item)}
//                           >
//                             <Text
//                               style={[
//                                 styles.pickerRowText,
//                                 formData.city === item &&
//                                   styles.pickerRowTextActive,
//                               ]}
//                             >
//                               {item}
//                             </Text>

//                             {formData.city === item && (
//                               <Icon
//                                 name="checkmark"
//                                 size={18}
//                                 color={THEME_COLOR}
//                               />
//                             )}
//                           </TouchableOpacity>
//                         ))
//                       )}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>

//               {/* STATE */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>State</Text>

//                 <TouchableOpacity
//                   style={styles.formInput}
//                   onPress={() => {
//                     setStateDropdownOpen(!stateDropdownOpen);
//                     setCityDropdownOpen(false);
//                   }}
//                 >
//                   <View style={styles.dropdownTriggerRow}>
//                     <Text
//                       style={
//                         formData.state
//                           ? styles.dropdownValueText
//                           : styles.dropdownPlaceholderText
//                       }
//                     >
//                       {formData.state || 'Select State'}
//                     </Text>

//                     <Icon
//                       name={stateDropdownOpen ? 'chevron-up' : 'chevron-down'}
//                       size={16}
//                       color="#757575"
//                     />
//                   </View>
//                 </TouchableOpacity>

//                 {stateDropdownOpen && (
//                   <View style={styles.dropdownPanel}>
//                     <View style={styles.searchBox}>
//                       <Icon name="search-outline" size={18} color="#7e808c" />

//                       <TextInput
//                         style={styles.searchInput}
//                         placeholder="Search state"
//                         value={stateSearch}
//                         onChangeText={setStateSearch}
//                         autoFocus
//                       />
//                     </View>

//                     <ScrollView
//                       style={styles.dropdownList}
//                       nestedScrollEnabled={true}
//                       keyboardShouldPersistTaps="handled"
//                     >
//                       {filteredStates.length === 0 ? (
//                         <Text style={styles.pickerEmptyText}>
//                           No states found
//                         </Text>
//                       ) : (
//                         filteredStates.map((item) => (
//                           <TouchableOpacity
//                             key={item}
//                             style={[
//                               styles.pickerRow,
//                               formData.state === item &&
//                                 styles.pickerRowActive,
//                             ]}
//                             onPress={() => handleSelectState(item)}
//                           >
//                             <Text
//                               style={[
//                                 styles.pickerRowText,
//                                 formData.state === item &&
//                                   styles.pickerRowTextActive,
//                               ]}
//                             >
//                               {item}
//                             </Text>

//                             {formData.state === item && (
//                               <Icon
//                                 name="checkmark"
//                                 size={18}
//                                 color={THEME_COLOR}
//                               />
//                             )}
//                           </TouchableOpacity>
//                         ))
//                       )}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>

//               {/* PINCODE */}
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Pincode *</Text>

//                 <TextInput
//                   style={[
//                     styles.formInput,
//                     pincodeError ? styles.formInputError : null,
//                   ]}
//                   placeholder="Enter 6-digit pincode"
//                   value={formData.pincode}
//                   keyboardType="number-pad"
//                   maxLength={6}
//                   onChangeText={validatePincode}
//                 />

//                 {pincodeError ? (
//                   <Text style={styles.errorText}>{pincodeError}</Text>
//                 ) : null}

//                 <Text style={styles.hintText}>
//                   Enter exactly 6 digits (numbers only)
//                 </Text>
//               </View>

//               {/* DEFAULT ADDRESS */}
//               <View style={styles.formGroup}>
//                 <TouchableOpacity
//                   style={styles.defaultCheckbox}
//                   onPress={() =>
//                     setFormData({
//                       ...formData,
//                       isDefault: !formData.isDefault,
//                     })
//                   }
//                 >
//                   <Icon
//                     name={
//                       formData.isDefault ? 'checkbox' : 'square-outline'
//                     }
//                     size={24}
//                     color={THEME_COLOR}
//                   />

//                   <Text style={styles.defaultCheckboxText}>
//                     Set as default address
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* LOCATION DETECTED */}
//               {formData.latitude !== 0 && (
//                 <View style={styles.locationDetected}>
//                   <Icon name="checkmark-circle" size={16} color="#28a745" />

//                   <Text style={styles.locationDetectedText}>
//                     Location detected ✓
//                   </Text>
//                 </View>
//               )}

//               {/* SAVE */}
//               <TouchableOpacity
//                 style={[
//                   styles.submitButton,
//                   isLoading && styles.submitButtonDisabled,
//                 ]}
//                 onPress={handleAddAddress}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator size="small" color="#ffffff" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>
//                     Save Address & Proceed
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     elevation: 2,
//   },

//   backButton: {
//     padding: 4,
//   },

//   headerTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//     textAlign: 'center',
//   },

//   headerSpacer: {
//     width: 32,
//   },

//   addButton: {
//     padding: 4,
//   },

//   locationButton: {
//     backgroundColor: '#ffffff',
//     margin: 16,
//     padding: 14,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: THEME_COLOR,
//     borderStyle: 'dashed',
//   },

//   locationButtonText: {
//     color: THEME_COLOR,
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 8,
//   },

//   listHeader: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },

//   addressList: {
//     padding: 16,
//     paddingBottom: 120,
//   },

//   addressCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#e8e8e8',
//   },

//   addressCardSelected: {
//     borderColor: THEME_COLOR,
//     borderWidth: 2,
//     backgroundColor: THEME_COLOR_LIGHT,
//   },

//   addressHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//     flexWrap: 'wrap',
//   },

//   addressTypeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 8,
//   },

//   addressTypeText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#757575',
//     marginLeft: 4,
//   },

//   defaultBadge: {
//     backgroundColor: '#4CAF50',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginRight: 8,
//   },

//   defaultBadgeText: {
//     fontSize: 10,
//     color: '#ffffff',
//     fontWeight: '600',
//   },

//   selectedIcon: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//   },

//   addressDetail: {
//     fontSize: 14,
//     color: '#282c3f',
//     marginBottom: 2,
//   },

//   addressPhone: {
//     fontSize: 14,
//     color: '#757575',
//     marginBottom: 2,
//   },

//   locationTag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },

//   locationTagText: {
//     fontSize: 11,
//     color: '#28a745',
//     marginLeft: 4,
//   },

//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 80,
//   },

//   emptyText: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#282c3f',
//     marginTop: 16,
//   },

//   emptySubText: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginTop: 8,
//     marginBottom: 24,
//   },

//   bottomBar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     elevation: 4,
//   },

//   bottomBarLeft: {
//     flexDirection: 'column',
//   },

//   bottomBarTotal: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#282c3f',
//   },

//   bottomBarItems: {
//     fontSize: 12,
//     color: '#7e808c',
//   },

//   deliverButton: {
//     backgroundColor: THEME_COLOR,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },

//   deliverButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginRight: 8,
//   },

//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },

//   modalContent: {
//     backgroundColor: '#ffffff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '90%',
//   },

//   pickerModalContent: {
//     backgroundColor: '#ffffff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '80%',
//   },

//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     paddingBottom: 12,
//   },

//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#282c3f',
//   },

//   dropdownTriggerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   dropdownPanel: {
//     marginTop: 6,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     backgroundColor: '#ffffff',
//     padding: 8,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },

//   dropdownList: {
//     maxHeight: 220,
//   },

//   pickerRowActive: {
//     backgroundColor: THEME_COLOR_LIGHT,
//   },

//   pickerRowTextActive: {
//     color: THEME_COLOR,
//     fontWeight: '600',
//   },

//   searchBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fafafa',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginBottom: 12,
//   },

//   searchInput: {
//     flex: 1,
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     fontSize: 14,
//   },

//   pickerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },

//   pickerRowText: {
//     fontSize: 15,
//     color: '#282c3f',
//   },

//   pickerEmptyText: {
//     textAlign: 'center',
//     color: '#7e808c',
//     paddingVertical: 24,
//     fontSize: 14,
//   },

//   dropdownValueText: {
//     fontSize: 14,
//     color: '#282c3f',
//   },

//   dropdownPlaceholderText: {
//     fontSize: 14,
//     color: '#9e9e9e',
//   },

//   formGroup: {
//     marginBottom: 16,
//   },

//   formRow: {
//     flexDirection: 'row',
//   },

//   formLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#282c3f',
//     marginBottom: 6,
//   },

//   formInput: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     backgroundColor: '#fafafa',
//     justifyContent: 'center',
//   },

//   formInputError: {
//     borderColor: '#dc3545',
//     borderWidth: 2,
//   },

//   formInputMultiline: {
//     height: 80,
//     textAlignVertical: 'top',
//   },

//   errorText: {
//     color: '#dc3545',
//     fontSize: 12,
//     marginTop: 4,
//   },

//   hintText: {
//     color: '#7e808c',
//     fontSize: 11,
//     marginTop: 2,
//   },

//   addressTypeButtons: {
//     flexDirection: 'row',
//     gap: 8,
//   },

//   addressTypeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//     paddingVertical: 10,
//     gap: 6,
//   },

//   addressTypeButtonActive: {
//     borderColor: THEME_COLOR,
//     backgroundColor: THEME_COLOR_LIGHT,
//   },

//   addressTypeButtonText: {
//     fontSize: 14,
//     color: '#757575',
//   },

//   addressTypeButtonTextActive: {
//     color: THEME_COLOR,
//     fontWeight: '600',
//   },

//   defaultCheckbox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//   },

//   defaultCheckboxText: {
//     fontSize: 14,
//     color: '#282c3f',
//     marginLeft: 8,
//   },

//   locationDetected: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#e8f5e9',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 16,
//   },

//   locationDetectedText: {
//     fontSize: 13,
//     color: '#28a745',
//     marginLeft: 8,
//     flex: 1,
//   },

//   submitButton: {
//     backgroundColor: THEME_COLOR,
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },

//   submitButtonDisabled: {
//     backgroundColor: '#ccc',
//   },

//   submitButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default AddressSelectionScreen;
// AddressSelectionScreen.tsx  (src/screens/checkout/)
// - Addresses come from the API-backed AddressContext (per-customer, backend-enforced)
// - Purple / Times New Roman theme
// - Same checkout redirect as the original screen: "Deliver to <type>" -> PaymentScreen,
//   with the real delivery fee calculated from the selected address's lat/lng
// - Add / edit / delete / set-default, plus "Use live location" (fills address + lat/lng)

import React, { useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { AddressContext, Address } from '../../context/AddressContext';
import { CartContext } from '../../context/CartContext';

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000') + '/api';

const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#5541D7',
  primaryLight: '#F1EEFF',
  primarySoft: '#EDE9FE',
  accent: '#8B7CF6',
  danger: '#EF4444',
  text: '#1E1B2E',
  textMuted: '#8A85A0',
  border: '#EFEDF7',
  bg: '#FAFAFD',
  white: '#FFFFFF',
};

const FONT = Platform.select({ ios: 'Times New Roman', android: 'serif', default: 'Times New Roman' });

type AddressType = Address['type'];
const TYPES: { key: AddressType; icon: string }[] = [
  { key: 'Home', icon: 'home-outline' },
  { key: 'Work', icon: 'briefcase-outline' },
  { key: 'Other', icon: 'location-outline' },
];

interface FormState {
  type: AddressType;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  phone: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

const EMPTY_FORM: FormState = {
  type: 'Home',
  address: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  phone: '',
  isDefault: false,
};

// Hard timeout so a slow server can never leave the UI hanging on a spinner.
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

function formatLine(a: Address): string {
  return [a.address, a.city, a.state, a.pincode].filter(Boolean).join(', ');
}

interface Props {
  navigation: any;
  route: any;
}

const AddressSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    totalAmount,
    restaurantName,
    cartItems,
    discount = 0,
    promoCode = null,
    promoId = null,
  } = route?.params || {};

  const {
    addresses,
    selectedAddress,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setSelectedAddress,
    refreshAddresses,
  } = useContext(AddressContext);
  const { getTotalPrice, getTotalItems } = useContext(CartContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [proceeding, setProceeding] = useState(false);

  const isFirstAddress = addresses.length === 0;
  const editing = editingId !== null;
  const totalPrice = totalAmount || getTotalPrice();
  const totalItems = getTotalItems();

  // ------------------------------------------------------------------
  // Redirect to PaymentScreen (same behaviour + params as the original)
  // ------------------------------------------------------------------
  const calculateDeliveryFee = async (address: Address): Promise<{ fee: number; breakdown: any }> => {
    const businessId = cartItems?.[0]?.restaurantId ? Number(cartItems[0].restaurantId) : undefined;
    if (!businessId || !address.latitude || !address.longitude) {
      console.warn('Missing businessId or address coordinates - using fallback fee 30', {
        businessId,
        lat: address.latitude,
        lng: address.longitude,
      });
      return { fee: 30, breakdown: null };
    }

    try {
      // API_BASE_URL already ends with /api - do NOT add another /api here
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/delivery-fees/calculate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId,
            customer_latitude: address.latitude,
            customer_longitude: address.longitude,
          }),
        },
        8000
      );
      const data = await response.json();
      if (!response.ok) {
        console.error('Delivery fee calculate error:', response.status, data);
        return { fee: 30, breakdown: null };
      }
      return { fee: data.delivery_fee, breakdown: data };
    } catch (err) {
      console.error('Network error calculating delivery fee:', err);
      return { fee: 30, breakdown: null };
    }
  };

  const handleProceed = async () => {
    if (!selectedAddress || proceeding) return;
    setProceeding(true);
    try {
      const { fee, breakdown } = await calculateDeliveryFee(selectedAddress);

      const items = cartItems || [];
      const gstTotal = items.reduce((sum: number, item: any) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        return sum + itemTotal * ((item.gst_rate || 0) / 100);
      }, 0);
      const roundedGst = Math.round(gstTotal);
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      navigation.navigate('PaymentScreen', {
        address: selectedAddress,
        totalAmount: subtotal + fee + roundedGst,
        subtotal,
        deliveryFee: fee,
        deliveryFeeBreakdown: breakdown,
        tax: roundedGst,
        discount,
        promoCode,
        promoId,
        restaurantName,
        cartItems,
        orderId: 'ORD-' + Date.now().toString().slice(-6),
      });
    } finally {
      setProceeding(false);
    }
  };

  // ------------------------------------------------------------------
  // Form helpers
  // ------------------------------------------------------------------
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, isDefault: isFirstAddress });
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (a: Address) => {
    setEditingId(a.id);
    setForm({
      type: a.type,
      address: a.address,
      city: a.city || '',
      state: a.state || '',
      pincode: a.pincode || '',
      landmark: a.landmark || '',
      phone: a.phone || '',
      isDefault: a.isDefault,
      latitude: a.latitude,
      longitude: a.longitude,
    });
    setErrors({});
    setModalVisible(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalVisible(false);
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.address.trim()) next.address = 'Enter the house, street and area';
    if (!form.city.trim()) next.city = 'Enter the city';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a 6-digit pincode';
    if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim())) {
      next.phone = 'Phone number must be exactly 10 digits';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ------------------------------------------------------------------
  // Live location: fills address/city/state/pincode and lat/lng
  // ------------------------------------------------------------------
  const detectLocation = async () => {
    if (locating) return;
    setLocating(true);
    try {
      let latitude: number;
      let longitude: number;

      if (Platform.OS === 'web') {
        const pos: any = await new Promise((resolve, reject) => {
          if (typeof navigator === 'undefined' || !navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
          }
          // Desktop browsers have no GPS chip - low accuracy uses WiFi/IP and is much faster
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 60000,
          });
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Location permission was denied. Allow it in your device settings.');
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      }

      let address = '';
      let city = '';
      let state = '';
      let pincode = '';

      try {
        if (Platform.OS === 'web') {
          const res = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { Accept: 'application/json' } },
            8000
          );
          if (res.ok) {
            const data = await res.json();
            const a = data?.address || {};
            city = a.city || a.town || a.village || a.suburb || a.county || '';
            state = a.state || '';
            pincode = a.postcode || '';
            address = data?.display_name || [a.road, a.suburb, a.city].filter(Boolean).join(', ');
          }
        } else {
          const results = await Location.reverseGeocodeAsync({ latitude, longitude });
          const r = results[0];
          if (r) {
            city = r.city || r.district || r.subregion || '';
            state = r.region || '';
            pincode = r.postalCode || '';
            address = [r.name, r.street, r.district, r.city].filter(Boolean).join(', ');
          }
        }
      } catch (geoErr) {
        console.error('Reverse geocode failed:', geoErr);
      }

      setForm((f) => ({
        ...f,
        address: address || f.address || `${latitude}, ${longitude}`,
        city: city || f.city,
        state: state || f.state,
        pincode: (pincode || f.pincode).replace(/\D/g, '').slice(0, 6),
        latitude,
        longitude,
      }));
      setErrors({});
      if (!address) {
        Alert.alert('Location found', 'We could not look up the street address. Please type it in.');
      }
    } catch (e: any) {
      const code = e?.code;
      let message = e?.message || 'Unable to get your current location.';
      if (code === 1) message = 'Location permission was denied. Allow it in your browser settings.';
      else if (code === 2) message = 'Location is currently unavailable.';
      else if (code === 3) message = 'Location request timed out. Check that location services are on and try again.';
      Alert.alert('Location error', message);
    } finally {
      setLocating(false);
    }
  };

  // ------------------------------------------------------------------
  // Save / delete / select
  // ------------------------------------------------------------------
  const handleSave = async () => {
    if (!validate() || saving) return;
    setSaving(true);
    try {
      if (editing && editingId) {
        await updateAddress(editingId, {
          type: form.type,
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          landmark: form.landmark.trim(),
          phone: form.phone.trim(),
          isDefault: form.isDefault,
          ...(form.latitude !== undefined && form.longitude !== undefined
            ? { latitude: form.latitude, longitude: form.longitude }
            : {}),
        });
        setModalVisible(false);
      } else {
        const created = await addAddress({
          type: form.type,
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          ...(form.landmark.trim() ? { landmark: form.landmark.trim() } : {}),
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
          ...(form.latitude !== undefined && form.longitude !== undefined
            ? { latitude: form.latitude, longitude: form.longitude }
            : {}),
          isDefault: form.isDefault || isFirstAddress,
        });
        if (created) {
          setModalVisible(false);
          setSelectedAddress(created); // select what was just added
        } else {
          Alert.alert('Could not save address', 'Check your connection and try again.');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (a: Address) => {
    const doDelete = () => deleteAddress(a.id);
    if (Platform.OS === 'web') {
      // Alert.alert with multiple buttons is unreliable on react-native-web
      if (typeof window !== 'undefined' && window.confirm(`Delete your ${a.type} address?`)) doDelete();
      return;
    }
    Alert.alert('Delete address', `Remove your ${a.type} address? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: doDelete },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAddresses();
    setRefreshing(false);
  };

  const sorted = useMemo(
    () => [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses]
  );

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={8} accessibilityLabel="Go back">
          <Icon name="arrow-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery addresses</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.mutedText}>Loading your addresses…</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          <View style={styles.column}>
            <Pressable
              onPress={openAdd}
              style={({ pressed }) => [styles.addCard, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
            >
              <View style={styles.addIcon}>
                <Icon name="add" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.addText}>Add a new address</Text>
            </Pressable>

            {sorted.length === 0 ? (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Icon name="location-outline" size={30} color={COLORS.primary} />
                </View>
                <Text style={styles.emptyTitle}>No saved addresses</Text>
                <Text style={styles.emptyBody}>Add a delivery address to continue with your order.</Text>
              </View>
            ) : (
              sorted.map((a) => {
                const isSelected = selectedAddress?.id === a.id;
                const icon = TYPES.find((t) => t.key === a.type)?.icon ?? 'location-outline';
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => setSelectedAddress(a)}
                    style={[styles.card, isSelected && styles.cardSelected]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${a.type} address`}
                  >
                    <View style={styles.cardTop}>
                      <View style={styles.typeIcon}>
                        <Icon name={icon} size={20} color={COLORS.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.titleRow}>
                          <Text style={styles.cardTitle}>{a.type}</Text>
                          {a.isDefault && (
                            <View style={styles.defaultBadge}>
                              <Text style={styles.defaultBadgeText}>Default</Text>
                            </View>
                          )}
                          {!!a.latitude && !!a.longitude && (
                            <View style={styles.pinTag}>
                              <Icon name="locate-outline" size={12} color={COLORS.primaryDark} />
                              <Text style={styles.pinTagText}>Live location</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.cardAddress}>{formatLine(a)}</Text>
                        {!!a.landmark && <Text style={styles.cardMeta}>Landmark: {a.landmark}</Text>}
                        {!!a.phone && <Text style={styles.cardMeta}>Phone: {a.phone}</Text>}
                      </View>
                      <View style={[styles.radio, isSelected && styles.radioOn]}>
                        {isSelected && <Icon name="checkmark" size={14} color={COLORS.white} />}
                      </View>
                    </View>

                    <View style={styles.actions}>
                      {!a.isDefault && (
                        <Pressable onPress={() => setDefaultAddress(a.id)} style={styles.actionBtn} hitSlop={6}>
                          <Icon name="star-outline" size={15} color={COLORS.primary} />
                          <Text style={styles.actionText}>Set as default</Text>
                        </Pressable>
                      )}
                      <Pressable onPress={() => openEdit(a)} style={styles.actionBtn} hitSlop={6}>
                        <Icon name="create-outline" size={15} color={COLORS.primary} />
                        <Text style={styles.actionText}>Edit</Text>
                      </Pressable>
                      <Pressable onPress={() => handleDelete(a)} style={styles.actionBtn} hitSlop={6}>
                        <Icon name="trash-outline" size={15} color={COLORS.danger} />
                        <Text style={[styles.actionText, { color: COLORS.danger }]}>Delete</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* Bottom bar - same as the original: total, item count, and the button that goes to PaymentScreen */}
      {!!selectedAddress && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomTotal}>₹{totalPrice}</Text>
            <Text style={styles.bottomItems}>{totalItems} items</Text>
          </View>
          <Pressable
            onPress={handleProceed}
            disabled={proceeding}
            style={({ pressed }) => [styles.deliverBtn, (pressed || proceeding) && { opacity: 0.85 }]}
            accessibilityRole="button"
          >
            {proceeding ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.deliverText}>Deliver to {selectedAddress.type}</Text>
                <Icon name="arrow-forward" size={18} color={COLORS.white} />
              </>
            )}
          </Pressable>
        </View>
      )}

      {/* Add / edit sheet */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView style={styles.modalWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.backdrop} onPress={closeModal} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{editing ? 'Edit address' : 'New address'}</Text>
              <Pressable onPress={closeModal} hitSlop={8} accessibilityLabel="Close">
                <Icon name="close" size={24} color={COLORS.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Pressable
                onPress={detectLocation}
                disabled={locating}
                style={({ pressed }) => [styles.locBtn, (pressed || locating) && { opacity: 0.85 }]}
                accessibilityRole="button"
              >
                {locating ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <>
                    <Icon name="locate-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.locBtnText}>Use live location</Text>
                  </>
                )}
              </Pressable>
              {form.latitude !== undefined && form.longitude !== undefined && (
                <Text style={styles.locOk}>Location saved with this address, so your delivery fee uses the real distance.</Text>
              )}

              <Text style={styles.label}>Address type</Text>
              <View style={styles.chips}>
                {TYPES.map((t) => {
                  const on = form.type === t.key;
                  return (
                    <Pressable
                      key={t.key}
                      onPress={() => set('type', t.key)}
                      style={[styles.chip, on && styles.chipOn]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                    >
                      <Icon name={t.icon} size={16} color={on ? COLORS.white : COLORS.primary} />
                      <Text style={[styles.chipText, on && { color: COLORS.white }]}>{t.key}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Field
                label="House, street and area"
                value={form.address}
                onChangeText={(v) => set('address', v)}
                error={errors.address}
                multiline
                maxLength={500}
              />
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="City" value={form.city} onChangeText={(v) => set('city', v)} error={errors.city} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="State" value={form.state} onChangeText={(v) => set('state', v)} />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Pincode"
                    value={form.pincode}
                    onChangeText={(v) => set('pincode', v.replace(/\D/g, '').slice(0, 6))}
                    error={errors.pincode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Phone (optional)"
                    value={form.phone}
                    onChangeText={(v) => set('phone', v.replace(/\D/g, '').slice(0, 10))}
                    error={errors.phone}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>
              <Field
                label="Landmark (optional)"
                value={form.landmark}
                onChangeText={(v) => set('landmark', v)}
                maxLength={255}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Make this my default address</Text>
                <Switch
                  value={form.isDefault}
                  onValueChange={(v) => set('isDefault', v)}
                  disabled={editing && form.isDefault}
                  trackColor={{ false: COLORS.border, true: COLORS.accent }}
                  thumbColor={COLORS.white}
                />
              </View>
            </ScrollView>

            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [styles.saveBtn, (pressed || saving) && { opacity: 0.85 }]}
              accessibilityRole="button"
            >
              {saving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveText}>{editing ? 'Save changes' : 'Save address'}</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

interface FieldProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  error?: string;
}

function Field({ label, error, style, ...rest }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        placeholderTextColor={COLORS.textMuted}
        style={[
          styles.input,
          rest.multiline && { minHeight: 72, textAlignVertical: 'top' },
          !!error && { borderColor: COLORS.danger },
          style,
        ]}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: COLORS.text },

  content: { padding: 16, paddingBottom: 32, alignItems: 'center' },
  column: { width: '100%', maxWidth: 640 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  mutedText: { fontFamily: FONT, fontSize: 15, color: COLORS.textMuted },

  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 16,
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: COLORS.primaryDark },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
  },
  cardSelected: { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: '#FDFCFF' },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  typeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 3 },
  cardTitle: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.text },
  defaultBadge: { backgroundColor: COLORS.primarySoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  defaultBadgeText: { fontFamily: FONT, fontSize: 12, fontWeight: '700', color: COLORS.primaryDark },
  pinTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  pinTagText: { fontFamily: FONT, fontSize: 12, color: COLORS.primaryDark },
  cardAddress: { fontFamily: FONT, fontSize: 15, lineHeight: 21, color: COLORS.text },
  cardMeta: { fontFamily: FONT, fontSize: 14, color: COLORS.textMuted, marginTop: 3 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: COLORS.primary },

  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontFamily: FONT, fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  emptyBody: { fontFamily: FONT, fontSize: 15, lineHeight: 22, color: COLORS.textMuted, textAlign: 'center' },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomTotal: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: COLORS.text },
  bottomItems: { fontFamily: FONT, fontSize: 13, color: COLORS.textMuted },
  deliverBtn: {
    minWidth: 190,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
  },
  deliverText: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: COLORS.white },

  modalWrap: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30,27,46,0.45)' },
  sheet: {
    width: '100%',
    maxWidth: 640,
    maxHeight: '92%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 18,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sheetTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: COLORS.text },

  locBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 8,
  },
  locBtnText: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: COLORS.primaryDark },
  locOk: { fontFamily: FONT, fontSize: 13, color: COLORS.primaryDark, marginBottom: 12 },

  label: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6, marginTop: 4 },
  chips: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  chipOn: { backgroundColor: COLORS.primary },
  chipText: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: COLORS.primary },

  row: { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 12 },
  input: {
    fontFamily: FONT,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
  },
  error: { fontFamily: FONT, fontSize: 13, color: COLORS.danger, marginTop: 4 },

  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, marginBottom: 8 },
  switchLabel: { fontFamily: FONT, fontSize: 15, color: COLORS.text, flex: 1, paddingRight: 12 },

  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveText: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.white },
});

export default AddressSelectionScreen;