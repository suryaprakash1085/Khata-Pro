<<<<<<< HEAD
// // // // // // // import React, { useState, useContext, useEffect } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   StyleSheet,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // //   FlatList,
// // // // // // //   TouchableOpacity,
// // // // // // //   Alert,
// // // // // // //   Modal,
// // // // // // //   TextInput,
// // // // // // //   ScrollView,
// // // // // // //   ActivityIndicator,
// // // // // // //   Platform,
// // // // // // // } from 'react-native';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // import { AddressContext, Address } from '../../context/AddressContext';
// // // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // // // import { supabase } from '../../services/supabaseClient';

// // // // // // // // ✅ DYNAMIC API KEY
// // // // // // // let GOOGLE_MAPS_API_KEY = '';
// // // // // // // try {
// // // // // // //   const env = require('@env');
// // // // // // //   GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
// // // // // // // } catch (e) {
// // // // // // //   GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';
// // // // // // // }

// // // // // // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// // // // // // // interface AddressSelectionScreenProps {
// // // // // // //   navigation: any;
// // // // // // //   route: any;
// // // // // // // }

// // // // // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // // // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // // // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // // // // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);
// // // // // // //   const { user } = useContext(AuthContext);

// // // // // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // // //   const [gettingLocation, setGettingLocation] = useState(false);
// // // // // // //   const [locationError, setLocationError] = useState<string>('');

// // // // // // //   const [formData, setFormData] = useState({
// // // // // // //     type: 'Home' as 'Home' | 'Work' | 'Other',
// // // // // // //     address: '',
// // // // // // //     city: '',
// // // // // // //     state: '',
// // // // // // //     pincode: '',
// // // // // // //     landmark: '',
// // // // // // //     phone: '',
// // // // // // //     isDefault: false,
// // // // // // //     latitude: 0,
// // // // // // //     longitude: 0,
// // // // // // //   });

// // // // // // //   const totalPrice = getTotalPrice() || totalAmount;
// // // // // // //   const totalItems = getTotalItems();

// // // // // // //   // ✅ Get current location
// // // // // // //   const getCurrentLocationWeb = () => {
// // // // // // //     setLocationError('');

// // // // // // //     if (!navigator.geolocation) {
// // // // // // //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (!GOOGLE_MAPS_API_KEY) {
// // // // // // //       Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     console.log('📍 Getting location...');
// // // // // // //     setGettingLocation(true);

// // // // // // //     navigator.geolocation.getCurrentPosition(
// // // // // // //       async (position) => {
// // // // // // //         const { latitude, longitude } = position.coords;
// // // // // // //         console.log('📍 Location found:', latitude, longitude);

// // // // // // //         try {
// // // // // // //           const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
// // // // // // //           console.log('🔗 Fetching:', url);

// // // // // // //           const response = await fetch(url);
// // // // // // //           const data = await response.json();

// // // // // // //           console.log('📦 Response status:', data.status);

// // // // // // //           if (data.status === 'OK' && data.results && data.results.length > 0) {
// // // // // // //             const result = data.results[0];
// // // // // // //             let city = '';
// // // // // // //             let state = '';
// // // // // // //             let pincode = '';
// // // // // // //             let formattedAddress = result.formatted_address || '';

// // // // // // //             if (result.address_components) {
// // // // // // //               result.address_components.forEach((component: any) => {
// // // // // // //                 if (component.types.includes('locality') || component.types.includes('sublocality')) {
// // // // // // //                   city = component.long_name;
// // // // // // //                 }
// // // // // // //                 if (component.types.includes('administrative_area_level_1')) {
// // // // // // //                   state = component.long_name;
// // // // // // //                 }
// // // // // // //                 if (component.types.includes('postal_code')) {
// // // // // // //                   pincode = component.long_name;
// // // // // // //                 }
// // // // // // //               });
// // // // // // //             }

// // // // // // //             setGettingLocation(false);
// // // // // // //             setFormData({
// // // // // // //               ...formData,
// // // // // // //               address: formattedAddress,
// // // // // // //               city: city,
// // // // // // //               state: state,
// // // // // // //               pincode: pincode,
// // // // // // //               latitude,
// // // // // // //               longitude,
// // // // // // //             });

// // // // // // //             Alert.alert(
// // // // // // //               '📍 Location Found!',
// // // // // // //               `Address: ${formattedAddress}`,
// // // // // // //               [{ text: 'OK' }]
// // // // // // //             );
// // // // // // //           } else {
// // // // // // //             setGettingLocation(false);
// // // // // // //             Alert.alert(
// // // // // // //               '📍 Location Found',
// // // // // // //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // // // // //               [{ text: 'OK' }]
// // // // // // //             );
// // // // // // //             setFormData({ ...formData, latitude, longitude });
// // // // // // //           }
// // // // // // //         } catch (error) {
// // // // // // //           console.error('❌ Error:', error);
// // // // // // //           setGettingLocation(false);
// // // // // // //           Alert.alert(
// // // // // // //             '📍 Location Found',
// // // // // // //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // // // // //             [{ text: 'OK' }]
// // // // // // //           );
// // // // // // //           setFormData({ ...formData, latitude, longitude });
// // // // // // //         }
// // // // // // //       },
// // // // // // //       (error) => {
// // // // // // //         console.error('❌ Location error:', error);
// // // // // // //         setGettingLocation(false);

// // // // // // //         let message = 'Unable to get your location. Please enter manually.';
// // // // // // //         if (error.message) {
// // // // // // //           message = error.message;
// // // // // // //         }

// // // // // // //         setLocationError(message);
// // // // // // //         Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
// // // // // // //       },
// // // // // // //       {
// // // // // // //         enableHighAccuracy: true,
// // // // // // //         timeout: 30000,
// // // // // // //         maximumAge: 10000
// // // // // // //       }
// // // // // // //     );
// // // // // // //   };

// // // // // // //   const requestLocationPermission = () => {
// // // // // // //     if (Platform.OS === 'web') {
// // // // // // //       getCurrentLocationWeb();
// // // // // // //     } else {
// // // // // // //       Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const getAddressTypeIcon = (type: string) => {
// // // // // // //     switch (type) {
// // // // // // //       case 'Home': return 'home-outline';
// // // // // // //       case 'Work': return 'briefcase-outline';
// // // // // // //       case 'Other': return 'location-outline';
// // // // // // //       default: return 'location-outline';
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const getAddressTypeColor = (type: string) => {
// // // // // // //     switch (type) {
// // // // // // //       case 'Home': return '#4CAF50';
// // // // // // //       case 'Work': return '#2196F3';
// // // // // // //       case 'Other': return '#FF9800';
// // // // // // //       default: return '#757575';
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // ✅ Shared helper: push an address string into the customers table row
// // // // // // //   // that matches this signed-up user (customers has no user_id column,
// // // // // // //   // so we match on business_id + phone, same as how the row was created
// // // // // // //   // at signup).
// // // // // // //   const syncAddressToCustomer = async (fullAddress: string) => {
// // // // // // //     if (!user?.business_id || !user?.phone) {
// // // // // // //       console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const { error } = await supabase
// // // // // // //       .from('customers')
// // // // // // //       .update({ address: fullAddress })
// // // // // // //       .eq('business_id', user.business_id)
// // // // // // //       .eq('phone', user.phone);

// // // // // // //     if (error) {
// // // // // // //       console.error('❌ Failed to update customer address:', error);
// // // // // // //     } else {
// // // // // // //       console.log('✅ Customer address synced:', fullAddress);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleSelectAddress = (address: Address) => {
// // // // // // //     setSelectedAddress(address);

// // // // // // //     // ✅ NEW: also sync this selected address to the customers table
// // // // // // //     const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;
// // // // // // //     syncAddressToCustomer(fullAddress);

// // // // // // //     navigation.navigate('PaymentScreen', {
// // // // // // //       address: address,
// // // // // // //       totalAmount: totalPrice,
// // // // // // //       restaurantName: restaurantName,
// // // // // // //       cartItems: cartItems,
// // // // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // // //     });
// // // // // // //   };

// // // // // // //   // ✅ Updated handleAddAddress - Saves address to customers table
// // // // // // //   const handleAddAddress = async () => {
// // // // // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // // // // //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setIsLoading(true);

// // // // // // //     try {
// // // // // // //       // ✅ Create full address string
// // // // // // //       const fullAddress = `${formData.address}, ${formData.city}, ${formData.state || ''} - ${formData.pincode}`;

// // // // // // //       // ✅ Save address to customers table in Supabase
// // // // // // //       if (user?.business_id && user?.phone) {
// // // // // // //         const { error: updateError } = await supabase
// // // // // // //           .from('customers')
// // // // // // //           .update({ address: fullAddress })
// // // // // // //           .eq('business_id', user.business_id)
// // // // // // //           .eq('phone', user.phone);

// // // // // // //         if (updateError) {
// // // // // // //           console.error('❌ Failed to update customer address:', updateError);
// // // // // // //           Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
// // // // // // //           setIsLoading(false);
// // // // // // //           return;
// // // // // // //         }
// // // // // // //         console.log('✅ Customer address updated successfully');
// // // // // // //       } else {
// // // // // // //         console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // // // // //       }

// // // // // // //       // ✅ Save to local context
// // // // // // //       const newAddress: Address = {
// // // // // // //         id: `addr_${Date.now()}`,
// // // // // // //         type: formData.type,
// // // // // // //         address: formData.address,
// // // // // // //         city: formData.city,
// // // // // // //         state: formData.state || '',
// // // // // // //         pincode: formData.pincode,
// // // // // // //         landmark: formData.landmark || '',
// // // // // // //         phone: formData.phone || '',
// // // // // // //         isDefault: addresses.length === 0 || formData.isDefault,
// // // // // // //         latitude: formData.latitude || undefined,
// // // // // // //         longitude: formData.longitude || undefined,
// // // // // // //       };

// // // // // // //       addAddress(newAddress);

// // // // // // //       setIsLoading(false);
// // // // // // //       setShowAddAddressModal(false);
// // // // // // //       resetForm();
// // // // // // //       setSelectedAddress(newAddress);

// // // // // // //       navigation.navigate('PaymentScreen', {
// // // // // // //         address: newAddress,
// // // // // // //         totalAmount: totalPrice,
// // // // // // //         restaurantName: restaurantName,
// // // // // // //         cartItems: cartItems,
// // // // // // //         orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // // //       });

// // // // // // //     } catch (error) {
// // // // // // //       console.error('❌ Error saving address:', error);
// // // // // // //       Alert.alert('❌ Error', 'Failed to save address. Please try again.');
// // // // // // //       setIsLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const resetForm = () => {
// // // // // // //     setFormData({
// // // // // // //       type: 'Home',
// // // // // // //       address: '',
// // // // // // //       city: '',
// // // // // // //       state: '',
// // // // // // //       pincode: '',
// // // // // // //       landmark: '',
// // // // // // //       phone: '',
// // // // // // //       isDefault: false,
// // // // // // //       latitude: 0,
// // // // // // //       longitude: 0,
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const renderAddressItem = ({ item }: { item: Address }) => {
// // // // // // //     const isSelected = selectedAddress?.id === item.id;

// // // // // // //     return (
// // // // // // //       <TouchableOpacity
// // // // // // //         key={item.id}
// // // // // // //         style={[styles.addressCard, isSelected && styles.addressCardSelected]}
// // // // // // //         onPress={() => handleSelectAddress(item)}
// // // // // // //         activeOpacity={0.7}
// // // // // // //       >
// // // // // // //         <View style={styles.addressHeader}>
// // // // // // //           <View style={styles.addressTypeContainer}>
// // // // // // //             <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
// // // // // // //             <Text style={styles.addressTypeText}>{item.type}</Text>
// // // // // // //           </View>
// // // // // // //           {item.isDefault && (
// // // // // // //             <View style={styles.defaultBadge}>
// // // // // // //               <Text style={styles.defaultBadgeText}>Default</Text>
// // // // // // //             </View>
// // // // // // //           )}
// // // // // // //           {isSelected && (
// // // // // // //             <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
// // // // // // //           )}
// // // // // // //         </View>

// // // // // // //         <Text style={styles.addressDetail}>{item.address}</Text>
// // // // // // //         {item.landmark && (
// // // // // // //           <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
// // // // // // //         )}
// // // // // // //         {item.phone && (
// // // // // // //           <Text style={styles.addressPhone}>📞 {item.phone}</Text>
// // // // // // //         )}
// // // // // // //         <Text style={styles.addressDetail}>
// // // // // // //           {item.city}, {item.state || ''} - {item.pincode}
// // // // // // //         </Text>
// // // // // // //         {item.latitude && item.longitude && (
// // // // // // //           <View style={styles.locationTag}>
// // // // // // //             <Icon name="location-outline" size={12} color="#28a745" />
// // // // // // //             <Text style={styles.locationTagText}>Live location</Text>
// // // // // // //           </View>
// // // // // // //         )}
// // // // // // //       </TouchableOpacity>
// // // // // // //     );
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // // // //       <View style={styles.header}>
// // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // //         </TouchableOpacity>
// // // // // // //         <Text style={styles.headerTitle}>Delivery Address</Text>
// // // // // // //         <TouchableOpacity
// // // // // // //           style={styles.addButton}
// // // // // // //           onPress={() => setShowAddAddressModal(true)}
// // // // // // //         >
// // // // // // //           <Icon name="add-circle-outline" size={28} color="#fc8019" />
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>

// // // // // // //       <TouchableOpacity
// // // // // // //         style={styles.locationButton}
// // // // // // //         onPress={requestLocationPermission}
// // // // // // //         disabled={gettingLocation}
// // // // // // //       >
// // // // // // //         {gettingLocation ? (
// // // // // // //           <ActivityIndicator size="small" color="#fc8019" />
// // // // // // //         ) : (
// // // // // // //           <>
// // // // // // //             <Icon name="locate-outline" size={22} color="#fc8019" />
// // // // // // //             <Text style={styles.locationButtonText}>Use Current Location</Text>
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //       </TouchableOpacity>

// // // // // // //       <FlatList
// // // // // // //         data={addresses}
// // // // // // //         renderItem={renderAddressItem}
// // // // // // //         keyExtractor={(item) => item.id}
// // // // // // //         contentContainerStyle={styles.addressList}
// // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // //         ListHeaderComponent={
// // // // // // //           addresses.length > 0 ? (
// // // // // // //             <Text style={styles.listHeader}>Saved Addresses</Text>
// // // // // // //           ) : null
// // // // // // //         }
// // // // // // //         ListEmptyComponent={
// // // // // // //           <View style={styles.emptyContainer}>
// // // // // // //             <Icon name="location-outline" size={60} color="#ccc" />
// // // // // // //             <Text style={styles.emptyText}>No Addresses Saved</Text>
// // // // // // //             <Text style={styles.emptySubText}>Add a new address</Text>
// // // // // // //           </View>
// // // // // // //         }
// // // // // // //       />

// // // // // // //       {selectedAddress && (
// // // // // // //         <View style={styles.bottomBar}>
// // // // // // //           <View style={styles.bottomBarLeft}>
// // // // // // //             <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>
// // // // // // //             <Text style={styles.bottomBarItems}>{totalItems} items</Text>
// // // // // // //           </View>
// // // // // // //           <TouchableOpacity
// // // // // // //             style={styles.deliverButton}
// // // // // // //             onPress={() => handleSelectAddress(selectedAddress)}
// // // // // // //           >
// // // // // // //             <Text style={styles.deliverButtonText}>
// // // // // // //               Deliver to {selectedAddress.type}
// // // // // // //             </Text>
// // // // // // //             <Icon name="arrow-forward" size={18} color="#ffffff" />
// // // // // // //           </TouchableOpacity>
// // // // // // //         </View>
// // // // // // //       )}

// // // // // // //       <Modal
// // // // // // //         visible={showAddAddressModal}
// // // // // // //         animationType="slide"
// // // // // // //         transparent={true}
// // // // // // //       >
// // // // // // //         <View style={styles.modalContainer}>
// // // // // // //           <View style={styles.modalContent}>
// // // // // // //             <View style={styles.modalHeader}>
// // // // // // //               <Text style={styles.modalTitle}>Add New Address</Text>
// // // // // // //               <TouchableOpacity onPress={() => {
// // // // // // //                 setShowAddAddressModal(false);
// // // // // // //                 resetForm();
// // // // // // //               }}>
// // // // // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // //               <View style={styles.formGroup}>
// // // // // // //                 <Text style={styles.formLabel}>Address Type</Text>
// // // // // // //                 <View style={styles.addressTypeButtons}>
// // // // // // //                   {['Home', 'Work', 'Other'].map((type) => (
// // // // // // //                     <TouchableOpacity
// // // // // // //                       key={type}
// // // // // // //                       style={[
// // // // // // //                         styles.addressTypeButton,
// // // // // // //                         formData.type === type && styles.addressTypeButtonActive
// // // // // // //                       ]}
// // // // // // //                       onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
// // // // // // //                     >
// // // // // // //                       <Icon
// // // // // // //                         name={getAddressTypeIcon(type)}
// // // // // // //                         size={18}
// // // // // // //                         color={formData.type === type ? '#fc8019' : '#757575'}
// // // // // // //                       />
// // // // // // //                       <Text
// // // // // // //                         style={[
// // // // // // //                           styles.addressTypeButtonText,
// // // // // // //                           formData.type === type && styles.addressTypeButtonTextActive
// // // // // // //                         ]}
// // // // // // //                       >
// // // // // // //                         {type}
// // // // // // //                       </Text>
// // // // // // //                     </TouchableOpacity>
// // // // // // //                   ))}
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <View style={styles.formGroup}>
// // // // // // //                 <Text style={styles.formLabel}>Address *</Text>
// // // // // // //                 <TextInput
// // // // // // //                   style={[styles.formInput, styles.formInputMultiline]}
// // // // // // //                   placeholder="Enter your address"
// // // // // // //                   value={formData.address}
// // // // // // //                   multiline
// // // // // // //                   numberOfLines={3}
// // // // // // //                   onChangeText={(text) => setFormData({ ...formData, address: text })}
// // // // // // //                 />
// // // // // // //               </View>

// // // // // // //               <View style={styles.formGroup}>
// // // // // // //                 <Text style={styles.formLabel}>Landmark</Text>
// // // // // // //                 <TextInput
// // // // // // //                   style={styles.formInput}
// // // // // // //                   placeholder="Nearby landmark (optional)"
// // // // // // //                   value={formData.landmark}
// // // // // // //                   onChangeText={(text) => setFormData({ ...formData, landmark: text })}
// // // // // // //                 />
// // // // // // //               </View>

// // // // // // //               <View style={styles.formGroup}>
// // // // // // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // // // // // //                 <TextInput
// // // // // // //                   style={styles.formInput}
// // // // // // //                   placeholder="Enter phone number (optional)"
// // // // // // //                   value={formData.phone}
// // // // // // //                   keyboardType="phone-pad"
// // // // // // //                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
// // // // // // //                 />
// // // // // // //               </View>

// // // // // // //               <View style={styles.formRow}>
// // // // // // //                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
// // // // // // //                   <Text style={styles.formLabel}>City *</Text>
// // // // // // //                   <TextInput
// // // // // // //                     style={styles.formInput}
// // // // // // //                     placeholder="City"
// // // // // // //                     value={formData.city}
// // // // // // //                     onChangeText={(text) => setFormData({ ...formData, city: text })}
// // // // // // //                   />
// // // // // // //                 </View>
// // // // // // //                 <View style={[styles.formGroup, { flex: 1 }]}>
// // // // // // //                   <Text style={styles.formLabel}>State</Text>
// // // // // // //                   <TextInput
// // // // // // //                     style={styles.formInput}
// // // // // // //                     placeholder="State"
// // // // // // //                     value={formData.state}
// // // // // // //                     onChangeText={(text) => setFormData({ ...formData, state: text })}
// // // // // // //                   />
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <View style={styles.formGroup}>
// // // // // // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // // // // // //                 <TextInput
// // // // // // //                   style={styles.formInput}
// // // // // // //                   placeholder="Pincode"
// // // // // // //                   value={formData.pincode}
// // // // // // //                   keyboardType="number-pad"
// // // // // // //                   onChangeText={(text) => setFormData({ ...formData, pincode: text })}
// // // // // // //                 />
// // // // // // //               </View>

// // // // // // //               <View style={styles.formGroup}>
// // // // // // //                 <TouchableOpacity
// // // // // // //                   style={styles.defaultCheckbox}
// // // // // // //                   onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
// // // // // // //                 >
// // // // // // //                   <Icon
// // // // // // //                     name={formData.isDefault ? 'checkbox' : 'square-outline'}
// // // // // // //                     size={24}
// // // // // // //                     color="#fc8019"
// // // // // // //                   />
// // // // // // //                   <Text style={styles.defaultCheckboxText}>Set as default address</Text>
// // // // // // //                 </TouchableOpacity>
// // // // // // //               </View>

// // // // // // //               {formData.latitude !== 0 && (
// // // // // // //                 <View style={styles.locationDetected}>
// // // // // // //                   <Icon name="checkmark-circle" size={16} color="#28a745" />
// // // // // // //                   <Text style={styles.locationDetectedText}>
// // // // // // //                     Location detected ✓
// // // // // // //                   </Text>
// // // // // // //                 </View>
// // // // // // //               )}

// // // // // // //               <TouchableOpacity
// // // // // // //                 style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
// // // // // // //                 onPress={handleAddAddress}
// // // // // // //                 disabled={isLoading}
// // // // // // //               >
// // // // // // //                 {isLoading ? (
// // // // // // //                   <ActivityIndicator size="small" color="#ffffff" />
// // // // // // //                 ) : (
// // // // // // //                   <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
// // // // // // //                 )}
// // // // // // //               </TouchableOpacity>
// // // // // // //             </ScrollView>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </Modal>
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: '#f5f5f5',
// // // // // // //   },
// // // // // // //   header: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 14,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f0',
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   backButton: {
// // // // // // //     padding: 4,
// // // // // // //   },
// // // // // // //   headerTitle: {
// // // // // // //     flex: 1,
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     textAlign: 'center',
// // // // // // //   },
// // // // // // //   addButton: {
// // // // // // //     padding: 4,
// // // // // // //   },
// // // // // // //   locationButton: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     margin: 16,
// // // // // // //     padding: 14,
// // // // // // //     borderRadius: 12,
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#fc8019',
// // // // // // //     borderStyle: 'dashed',
// // // // // // //   },
// // // // // // //   locationButtonText: {
// // // // // // //     color: '#fc8019',
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '600',
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   listHeader: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   addressList: {
// // // // // // //     padding: 16,
// // // // // // //     paddingBottom: 120,
// // // // // // //   },
// // // // // // //   addressCard: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderRadius: 12,
// // // // // // //     padding: 16,
// // // // // // //     marginBottom: 12,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#e8e8e8',
// // // // // // //   },
// // // // // // //   addressCardSelected: {
// // // // // // //     borderColor: '#fc8019',
// // // // // // //     borderWidth: 2,
// // // // // // //     backgroundColor: '#fff8f0',
// // // // // // //   },
// // // // // // //   addressHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 8,
// // // // // // //     flexWrap: 'wrap',
// // // // // // //   },
// // // // // // //   addressTypeContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   addressTypeText: {
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#757575',
// // // // // // //     marginLeft: 4,
// // // // // // //   },
// // // // // // //   defaultBadge: {
// // // // // // //     backgroundColor: '#4CAF50',
// // // // // // //     paddingHorizontal: 8,
// // // // // // //     paddingVertical: 2,
// // // // // // //     borderRadius: 4,
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   defaultBadgeText: {
// // // // // // //     fontSize: 10,
// // // // // // //     color: '#ffffff',
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   selectedIcon: {
// // // // // // //     position: 'absolute',
// // // // // // //     right: 0,
// // // // // // //     top: 0,
// // // // // // //   },
// // // // // // //   addressDetail: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 2,
// // // // // // //   },
// // // // // // //   addressPhone: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#757575',
// // // // // // //     marginBottom: 2,
// // // // // // //   },
// // // // // // //   locationTag: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   locationTagText: {
// // // // // // //     fontSize: 11,
// // // // // // //     color: '#28a745',
// // // // // // //     marginLeft: 4,
// // // // // // //   },
// // // // // // //   emptyContainer: {
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     paddingVertical: 80,
// // // // // // //   },
// // // // // // //   emptyText: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginTop: 16,
// // // // // // //   },
// // // // // // //   emptySubText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 8,
// // // // // // //     marginBottom: 24,
// // // // // // //   },
// // // // // // //   bottomBar: {
// // // // // // //     position: 'absolute',
// // // // // // //     bottom: 0,
// // // // // // //     left: 0,
// // // // // // //     right: 0,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderTopWidth: 1,
// // // // // // //     borderTopColor: '#f0f0f0',
// // // // // // //     elevation: 4,
// // // // // // //   },
// // // // // // //   bottomBarLeft: {
// // // // // // //     flexDirection: 'column',
// // // // // // //   },
// // // // // // //   bottomBarTotal: {
// // // // // // //     fontSize: 20,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   bottomBarItems: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //   },
// // // // // // //   deliverButton: {
// // // // // // //     backgroundColor: '#fc8019',
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingHorizontal: 20,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderRadius: 8,
// // // // // // //   },
// // // // // // //   deliverButtonText: {
// // // // // // //     color: '#ffffff',
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '600',
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   modalContainer: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // //     justifyContent: 'flex-end',
// // // // // // //   },
// // // // // // //   modalContent: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderTopLeftRadius: 20,
// // // // // // //     borderTopRightRadius: 20,
// // // // // // //     padding: 20,
// // // // // // //     maxHeight: '90%',
// // // // // // //   },
// // // // // // //   modalHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 20,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f0',
// // // // // // //     paddingBottom: 12,
// // // // // // //   },
// // // // // // //   modalTitle: {
// // // // // // //     fontSize: 20,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   formGroup: {
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   formRow: {
// // // // // // //     flexDirection: 'row',
// // // // // // //   },
// // // // // // //   formLabel: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 6,
// // // // // // //   },
// // // // // // //   formInput: {
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#e0e0e0',
// // // // // // //     borderRadius: 8,
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     paddingVertical: 10,
// // // // // // //     fontSize: 14,
// // // // // // //     backgroundColor: '#fafafa',
// // // // // // //   },
// // // // // // //   formInputMultiline: {
// // // // // // //     height: 80,
// // // // // // //     textAlignVertical: 'top',
// // // // // // //   },
// // // // // // //   addressTypeButtons: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     gap: 8,
// // // // // // //   },
// // // // // // //   addressTypeButton: {
// // // // // // //     flex: 1,
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#e0e0e0',
// // // // // // //     borderRadius: 8,
// // // // // // //     paddingVertical: 10,
// // // // // // //     gap: 6,
// // // // // // //   },
// // // // // // //   addressTypeButtonActive: {
// // // // // // //     borderColor: '#fc8019',
// // // // // // //     backgroundColor: '#fff8f0',
// // // // // // //   },
// // // // // // //   addressTypeButtonText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#757575',
// // // // // // //   },
// // // // // // //   addressTypeButtonTextActive: {
// // // // // // //     color: '#fc8019',
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   defaultCheckbox: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 4,
// // // // // // //   },
// // // // // // //   defaultCheckboxText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   locationDetected: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#e8f5e9',
// // // // // // //     padding: 10,
// // // // // // //     borderRadius: 8,
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   locationDetectedText: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: '#28a745',
// // // // // // //     marginLeft: 8,
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   submitButton: {
// // // // // // //     backgroundColor: '#fc8019',
// // // // // // //     paddingVertical: 14,
// // // // // // //     borderRadius: 8,
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 10,
// // // // // // //     marginBottom: 20,
// // // // // // //   },
// // // // // // //   submitButtonDisabled: {
// // // // // // //     backgroundColor: '#ccc',
// // // // // // //   },
// // // // // // //   submitButtonText: {
// // // // // // //     color: '#ffffff',
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // // });

// // // // // // // export default AddressSelectionScreen;
// // // // // // import React, { useState, useContext, useEffect } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   StyleSheet,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   FlatList,
// // // // // //   TouchableOpacity,
// // // // // //   Alert,
// // // // // //   Modal,
// // // // // //   TextInput,
// // // // // //   ScrollView,
// // // // // //   ActivityIndicator,
// // // // // //   Platform,
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { AddressContext, Address } from '../../context/AddressContext';
// // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // // import { supabase } from '../../services/supabaseClient';

// // // // // // // ✅ DYNAMIC API KEY
// // // // // // let GOOGLE_MAPS_API_KEY = '';
// // // // // // try {
// // // // // //   const env = require('@env');
// // // // // //   GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
// // // // // // } catch (e) {
// // // // // //   GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';
// // // // // // }

// // // // // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// // // // // // interface AddressSelectionScreenProps {
// // // // // //   navigation: any;
// // // // // //   route: any;
// // // // // // }

// // // // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // // // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);
// // // // // //   const { user } = useContext(AuthContext);

// // // // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // //   const [gettingLocation, setGettingLocation] = useState(false);
// // // // // //   const [locationError, setLocationError] = useState<string>('');

// // // // // //   // ✅ Validation error states
// // // // // //   const [phoneError, setPhoneError] = useState<string>('');
// // // // // //   const [pincodeError, setPincodeError] = useState<string>('');

// // // // // //   const [formData, setFormData] = useState({
// // // // // //     type: 'Home' as 'Home' | 'Work' | 'Other',
// // // // // //     address: '',
// // // // // //     city: '',
// // // // // //     state: '',
// // // // // //     pincode: '',
// // // // // //     landmark: '',
// // // // // //     phone: '',
// // // // // //     isDefault: false,
// // // // // //     latitude: 0,
// // // // // //     longitude: 0,
// // // // // //   });

// // // // // //   const totalPrice = getTotalPrice() || totalAmount;
// // // // // //   const totalItems = getTotalItems();

// // // // // //   // ✅ Phone number validation - only numbers and exactly 10 digits
// // // // // //   const validatePhoneNumber = (text: string) => {
// // // // // //     // Remove any non-numeric characters
// // // // // //     const cleaned = text.replace(/[^0-9]/g, '');
    
// // // // // //     // Only allow up to 10 digits
// // // // // //     const limited = cleaned.slice(0, 10);
    
// // // // // //     setFormData({ ...formData, phone: limited });
    
// // // // // //     // Validate
// // // // // //     if (limited.length > 0 && limited.length !== 10) {
// // // // // //       setPhoneError('Phone number must be exactly 10 digits');
// // // // // //     } else if (limited.length === 0) {
// // // // // //       setPhoneError('');
// // // // // //     } else {
// // // // // //       setPhoneError('');
// // // // // //     }
// // // // // //   };

// // // // // //   // ✅ Pincode validation - only numbers and exactly 6 digits
// // // // // //   const validatePincode = (text: string) => {
// // // // // //     // Remove any non-numeric characters
// // // // // //     const cleaned = text.replace(/[^0-9]/g, '');
    
// // // // // //     // Only allow up to 6 digits
// // // // // //     const limited = cleaned.slice(0, 6);
    
// // // // // //     setFormData({ ...formData, pincode: limited });
    
// // // // // //     // Validate
// // // // // //     if (limited.length > 0 && limited.length !== 6) {
// // // // // //       setPincodeError('Pincode must be exactly 6 digits');
// // // // // //     } else if (limited.length === 0) {
// // // // // //       setPincodeError('');
// // // // // //     } else {
// // // // // //       setPincodeError('');
// // // // // //     }
// // // // // //   };

// // // // // //   // ✅ Get current location
// // // // // //   const getCurrentLocationWeb = () => {
// // // // // //     setLocationError('');

// // // // // //     if (!navigator.geolocation) {
// // // // // //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (!GOOGLE_MAPS_API_KEY) {
// // // // // //       Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
// // // // // //       return;
// // // // // //     }

// // // // // //     console.log('📍 Getting location...');
// // // // // //     setGettingLocation(true);

// // // // // //     navigator.geolocation.getCurrentPosition(
// // // // // //       async (position) => {
// // // // // //         const { latitude, longitude } = position.coords;
// // // // // //         console.log('📍 Location found:', latitude, longitude);

// // // // // //         try {
// // // // // //           const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
// // // // // //           console.log('🔗 Fetching:', url);

// // // // // //           const response = await fetch(url);
// // // // // //           const data = await response.json();

// // // // // //           console.log('📦 Response status:', data.status);

// // // // // //           if (data.status === 'OK' && data.results && data.results.length > 0) {
// // // // // //             const result = data.results[0];
// // // // // //             let city = '';
// // // // // //             let state = '';
// // // // // //             let pincode = '';
// // // // // //             let formattedAddress = result.formatted_address || '';

// // // // // //             if (result.address_components) {
// // // // // //               result.address_components.forEach((component: any) => {
// // // // // //                 if (component.types.includes('locality') || component.types.includes('sublocality')) {
// // // // // //                   city = component.long_name;
// // // // // //                 }
// // // // // //                 if (component.types.includes('administrative_area_level_1')) {
// // // // // //                   state = component.long_name;
// // // // // //                 }
// // // // // //                 if (component.types.includes('postal_code')) {
// // // // // //                   pincode = component.long_name;
// // // // // //                 }
// // // // // //               });
// // // // // //             }

// // // // // //             setGettingLocation(false);
// // // // // //             setFormData({
// // // // // //               ...formData,
// // // // // //               address: formattedAddress,
// // // // // //               city: city,
// // // // // //               state: state,
// // // // // //               pincode: pincode,
// // // // // //               latitude,
// // // // // //               longitude,
// // // // // //             });

// // // // // //             Alert.alert(
// // // // // //               '📍 Location Found!',
// // // // // //               `Address: ${formattedAddress}`,
// // // // // //               [{ text: 'OK' }]
// // // // // //             );
// // // // // //           } else {
// // // // // //             setGettingLocation(false);
// // // // // //             Alert.alert(
// // // // // //               '📍 Location Found',
// // // // // //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // // // //               [{ text: 'OK' }]
// // // // // //             );
// // // // // //             setFormData({ ...formData, latitude, longitude });
// // // // // //           }
// // // // // //         } catch (error) {
// // // // // //           console.error('❌ Error:', error);
// // // // // //           setGettingLocation(false);
// // // // // //           Alert.alert(
// // // // // //             '📍 Location Found',
// // // // // //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // // // //             [{ text: 'OK' }]
// // // // // //           );
// // // // // //           setFormData({ ...formData, latitude, longitude });
// // // // // //         }
// // // // // //       },
// // // // // //       (error) => {
// // // // // //         console.error('❌ Location error:', error);
// // // // // //         setGettingLocation(false);

// // // // // //         let message = 'Unable to get your location. Please enter manually.';
// // // // // //         if (error.message) {
// // // // // //           message = error.message;
// // // // // //         }

// // // // // //         setLocationError(message);
// // // // // //         Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
// // // // // //       },
// // // // // //       {
// // // // // //         enableHighAccuracy: true,
// // // // // //         timeout: 30000,
// // // // // //         maximumAge: 10000
// // // // // //       }
// // // // // //     );
// // // // // //   };

// // // // // //   const requestLocationPermission = () => {
// // // // // //     if (Platform.OS === 'web') {
// // // // // //       getCurrentLocationWeb();
// // // // // //     } else {
// // // // // //       Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
// // // // // //     }
// // // // // //   };

// // // // // //   const getAddressTypeIcon = (type: string) => {
// // // // // //     switch (type) {
// // // // // //       case 'Home': return 'home-outline';
// // // // // //       case 'Work': return 'briefcase-outline';
// // // // // //       case 'Other': return 'location-outline';
// // // // // //       default: return 'location-outline';
// // // // // //     }
// // // // // //   };

// // // // // //   const getAddressTypeColor = (type: string) => {
// // // // // //     switch (type) {
// // // // // //       case 'Home': return '#4CAF50';
// // // // // //       case 'Work': return '#2196F3';
// // // // // //       case 'Other': return '#FF9800';
// // // // // //       default: return '#757575';
// // // // // //     }
// // // // // //   };

// // // // // //   // ✅ Shared helper: push an address string into the customers table row
// // // // // //   const syncAddressToCustomer = async (fullAddress: string) => {
// // // // // //     if (!user?.business_id || !user?.phone) {
// // // // // //       console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // // // //       return;
// // // // // //     }

// // // // // //     const { error } = await supabase
// // // // // //       .from('customers')
// // // // // //       .update({ address: fullAddress })
// // // // // //       .eq('business_id', user.business_id)
// // // // // //       .eq('phone', user.phone);

// // // // // //     if (error) {
// // // // // //       console.error('❌ Failed to update customer address:', error);
// // // // // //     } else {
// // // // // //       console.log('✅ Customer address synced:', fullAddress);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleSelectAddress = (address: Address) => {
// // // // // //     setSelectedAddress(address);

// // // // // //     const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;
// // // // // //     syncAddressToCustomer(fullAddress);

// // // // // //     navigation.navigate('PaymentScreen', {
// // // // // //       address: address,
// // // // // //       totalAmount: totalPrice,
// // // // // //       restaurantName: restaurantName,
// // // // // //       cartItems: cartItems,
// // // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // //     });
// // // // // //   };

// // // // // //   // ✅ Updated handleAddAddress with validation
// // // // // //   const handleAddAddress = async () => {
// // // // // //     // Validate required fields
// // // // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // // // //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// // // // // //       return;
// // // // // //     }

// // // // // //     // ✅ Validate pincode
// // // // // //     if (formData.pincode.length !== 6) {
// // // // // //       setPincodeError('Pincode must be exactly 6 digits');
// // // // // //       Alert.alert('⚠️ Error', 'Pincode must be exactly 6 digits');
// // // // // //       return;
// // // // // //     }

// // // // // //     // ✅ Validate phone if provided
// // // // // //     if (formData.phone && formData.phone.length !== 10) {
// // // // // //       setPhoneError('Phone number must be exactly 10 digits');
// // // // // //       Alert.alert('⚠️ Error', 'Phone number must be exactly 10 digits');
// // // // // //       return;
// // // // // //     }

// // // // // //     // Clear any previous errors
// // // // // //     setPhoneError('');
// // // // // //     setPincodeError('');

// // // // // //     setIsLoading(true);

// // // // // //     try {
// // // // // //       const fullAddress = `${formData.address}, ${formData.city}, ${formData.state || ''} - ${formData.pincode}`;

// // // // // //       // Save address to customers table in Supabase
// // // // // //       if (user?.business_id && user?.phone) {
// // // // // //         const { error: updateError } = await supabase
// // // // // //           .from('customers')
// // // // // //           .update({ address: fullAddress })
// // // // // //           .eq('business_id', user.business_id)
// // // // // //           .eq('phone', user.phone);

// // // // // //         if (updateError) {
// // // // // //           console.error('❌ Failed to update customer address:', updateError);
// // // // // //           Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
// // // // // //           setIsLoading(false);
// // // // // //           return;
// // // // // //         }
// // // // // //         console.log('✅ Customer address updated successfully');
// // // // // //       } else {
// // // // // //         console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // // // //       }

// // // // // //       // Save to local context
// // // // // //       const newAddress: Address = {
// // // // // //         id: `addr_${Date.now()}`,
// // // // // //         type: formData.type,
// // // // // //         address: formData.address,
// // // // // //         city: formData.city,
// // // // // //         state: formData.state || '',
// // // // // //         pincode: formData.pincode,
// // // // // //         landmark: formData.landmark || '',
// // // // // //         phone: formData.phone || '',
// // // // // //         isDefault: addresses.length === 0 || formData.isDefault,
// // // // // //         latitude: formData.latitude || undefined,
// // // // // //         longitude: formData.longitude || undefined,
// // // // // //       };

// // // // // //       addAddress(newAddress);

// // // // // //       setIsLoading(false);
// // // // // //       setShowAddAddressModal(false);
// // // // // //       resetForm();
// // // // // //       setSelectedAddress(newAddress);

// // // // // //       navigation.navigate('PaymentScreen', {
// // // // // //         address: newAddress,
// // // // // //         totalAmount: totalPrice,
// // // // // //         restaurantName: restaurantName,
// // // // // //         cartItems: cartItems,
// // // // // //         orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // //       });

// // // // // //     } catch (error) {
// // // // // //       console.error('❌ Error saving address:', error);
// // // // // //       Alert.alert('❌ Error', 'Failed to save address. Please try again.');
// // // // // //       setIsLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const resetForm = () => {
// // // // // //     setFormData({
// // // // // //       type: 'Home',
// // // // // //       address: '',
// // // // // //       city: '',
// // // // // //       state: '',
// // // // // //       pincode: '',
// // // // // //       landmark: '',
// // // // // //       phone: '',
// // // // // //       isDefault: false,
// // // // // //       latitude: 0,
// // // // // //       longitude: 0,
// // // // // //     });
// // // // // //     setPhoneError('');
// // // // // //     setPincodeError('');
// // // // // //   };

// // // // // //   const renderAddressItem = ({ item }: { item: Address }) => {
// // // // // //     const isSelected = selectedAddress?.id === item.id;

// // // // // //     return (
// // // // // //       <TouchableOpacity
// // // // // //         key={item.id}
// // // // // //         style={[styles.addressCard, isSelected && styles.addressCardSelected]}
// // // // // //         onPress={() => handleSelectAddress(item)}
// // // // // //         activeOpacity={0.7}
// // // // // //       >
// // // // // //         <View style={styles.addressHeader}>
// // // // // //           <View style={styles.addressTypeContainer}>
// // // // // //             <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
// // // // // //             <Text style={styles.addressTypeText}>{item.type}</Text>
// // // // // //           </View>
// // // // // //           {item.isDefault && (
// // // // // //             <View style={styles.defaultBadge}>
// // // // // //               <Text style={styles.defaultBadgeText}>Default</Text>
// // // // // //             </View>
// // // // // //           )}
// // // // // //           {isSelected && (
// // // // // //             <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
// // // // // //           )}
// // // // // //         </View>

// // // // // //         <Text style={styles.addressDetail}>{item.address}</Text>
// // // // // //         {item.landmark && (
// // // // // //           <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
// // // // // //         )}
// // // // // //         {item.phone && (
// // // // // //           <Text style={styles.addressPhone}>📞 {item.phone}</Text>
// // // // // //         )}
// // // // // //         <Text style={styles.addressDetail}>
// // // // // //           {item.city}, {item.state || ''} - {item.pincode}
// // // // // //         </Text>
// // // // // //         {item.latitude && item.longitude && (
// // // // // //           <View style={styles.locationTag}>
// // // // // //             <Icon name="location-outline" size={12} color="#28a745" />
// // // // // //             <Text style={styles.locationTagText}>Live location</Text>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       </TouchableOpacity>
// // // // // //     );
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // // //       <View style={styles.header}>
// // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.headerTitle}>Delivery Address</Text>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.addButton}
// // // // // //           onPress={() => setShowAddAddressModal(true)}
// // // // // //         >
// // // // // //           <Icon name="add-circle-outline" size={28} color="#fc8019" />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       <TouchableOpacity
// // // // // //         style={styles.locationButton}
// // // // // //         onPress={requestLocationPermission}
// // // // // //         disabled={gettingLocation}
// // // // // //       >
// // // // // //         {gettingLocation ? (
// // // // // //           <ActivityIndicator size="small" color="#fc8019" />
// // // // // //         ) : (
// // // // // //           <>
// // // // // //             <Icon name="locate-outline" size={22} color="#fc8019" />
// // // // // //             <Text style={styles.locationButtonText}>Use Current Location</Text>
// // // // // //           </>
// // // // // //         )}
// // // // // //       </TouchableOpacity>

// // // // // //       <FlatList
// // // // // //         data={addresses}
// // // // // //         renderItem={renderAddressItem}
// // // // // //         keyExtractor={(item) => item.id}
// // // // // //         contentContainerStyle={styles.addressList}
// // // // // //         showsVerticalScrollIndicator={false}
// // // // // //         ListHeaderComponent={
// // // // // //           addresses.length > 0 ? (
// // // // // //             <Text style={styles.listHeader}>Saved Addresses</Text>
// // // // // //           ) : null
// // // // // //         }
// // // // // //         ListEmptyComponent={
// // // // // //           <View style={styles.emptyContainer}>
// // // // // //             <Icon name="location-outline" size={60} color="#ccc" />
// // // // // //             <Text style={styles.emptyText}>No Addresses Saved</Text>
// // // // // //             <Text style={styles.emptySubText}>Add a new address</Text>
// // // // // //           </View>
// // // // // //         }
// // // // // //       />

// // // // // //       {selectedAddress && (
// // // // // //         <View style={styles.bottomBar}>
// // // // // //           <View style={styles.bottomBarLeft}>
// // // // // //             <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>
// // // // // //             <Text style={styles.bottomBarItems}>{totalItems} items</Text>
// // // // // //           </View>
// // // // // //           <TouchableOpacity
// // // // // //             style={styles.deliverButton}
// // // // // //             onPress={() => handleSelectAddress(selectedAddress)}
// // // // // //           >
// // // // // //             <Text style={styles.deliverButtonText}>
// // // // // //               Deliver to {selectedAddress.type}
// // // // // //             </Text>
// // // // // //             <Icon name="arrow-forward" size={18} color="#ffffff" />
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       <Modal
// // // // // //         visible={showAddAddressModal}
// // // // // //         animationType="slide"
// // // // // //         transparent={true}
// // // // // //       >
// // // // // //         <View style={styles.modalContainer}>
// // // // // //           <View style={styles.modalContent}>
// // // // // //             <View style={styles.modalHeader}>
// // // // // //               <Text style={styles.modalTitle}>Add New Address</Text>
// // // // // //               <TouchableOpacity onPress={() => {
// // // // // //                 setShowAddAddressModal(false);
// // // // // //                 resetForm();
// // // // // //               }}>
// // // // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             <ScrollView showsVerticalScrollIndicator={false}>
// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <Text style={styles.formLabel}>Address Type</Text>
// // // // // //                 <View style={styles.addressTypeButtons}>
// // // // // //                   {['Home', 'Work', 'Other'].map((type) => (
// // // // // //                     <TouchableOpacity
// // // // // //                       key={type}
// // // // // //                       style={[
// // // // // //                         styles.addressTypeButton,
// // // // // //                         formData.type === type && styles.addressTypeButtonActive
// // // // // //                       ]}
// // // // // //                       onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
// // // // // //                     >
// // // // // //                       <Icon
// // // // // //                         name={getAddressTypeIcon(type)}
// // // // // //                         size={18}
// // // // // //                         color={formData.type === type ? '#fc8019' : '#757575'}
// // // // // //                       />
// // // // // //                       <Text
// // // // // //                         style={[
// // // // // //                           styles.addressTypeButtonText,
// // // // // //                           formData.type === type && styles.addressTypeButtonTextActive
// // // // // //                         ]}
// // // // // //                       >
// // // // // //                         {type}
// // // // // //                       </Text>
// // // // // //                     </TouchableOpacity>
// // // // // //                   ))}
// // // // // //                 </View>
// // // // // //               </View>

// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <Text style={styles.formLabel}>Address *</Text>
// // // // // //                 <TextInput
// // // // // //                   style={[styles.formInput, styles.formInputMultiline]}
// // // // // //                   placeholder="Enter your address"
// // // // // //                   value={formData.address}
// // // // // //                   multiline
// // // // // //                   numberOfLines={3}
// // // // // //                   onChangeText={(text) => setFormData({ ...formData, address: text })}
// // // // // //                 />
// // // // // //               </View>

// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <Text style={styles.formLabel}>Landmark</Text>
// // // // // //                 <TextInput
// // // // // //                   style={styles.formInput}
// // // // // //                   placeholder="Nearby landmark (optional)"
// // // // // //                   value={formData.landmark}
// // // // // //                   onChangeText={(text) => setFormData({ ...formData, landmark: text })}
// // // // // //                 />
// // // // // //               </View>

// // // // // //               {/* ✅ Phone Number with Validation */}
// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // // // // //                 <TextInput
// // // // // //                   style={[styles.formInput, phoneError ? styles.formInputError : null]}
// // // // // //                   placeholder="Enter 10-digit phone number"
// // // // // //                   value={formData.phone}
// // // // // //                   keyboardType="number-pad"
// // // // // //                   maxLength={10}
// // // // // //                   onChangeText={validatePhoneNumber}
// // // // // //                 />
// // // // // //                 {phoneError ? (
// // // // // //                   <Text style={styles.errorText}>{phoneError}</Text>
// // // // // //                 ) : null}
// // // // // //                 <Text style={styles.hintText}>Enter exactly 10 digits (numbers only)</Text>
// // // // // //               </View>

// // // // // //               <View style={styles.formRow}>
// // // // // //                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
// // // // // //                   <Text style={styles.formLabel}>City *</Text>
// // // // // //                   <TextInput
// // // // // //                     style={styles.formInput}
// // // // // //                     placeholder="City"
// // // // // //                     value={formData.city}
// // // // // //                     onChangeText={(text) => setFormData({ ...formData, city: text })}
// // // // // //                   />
// // // // // //                 </View>
// // // // // //                 <View style={[styles.formGroup, { flex: 1 }]}>
// // // // // //                   <Text style={styles.formLabel}>State</Text>
// // // // // //                   <TextInput
// // // // // //                     style={styles.formInput}
// // // // // //                     placeholder="State"
// // // // // //                     value={formData.state}
// // // // // //                     onChangeText={(text) => setFormData({ ...formData, state: text })}
// // // // // //                   />
// // // // // //                 </View>
// // // // // //               </View>

// // // // // //               {/* ✅ Pincode with Validation */}
// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // // // // //                 <TextInput
// // // // // //                   style={[styles.formInput, pincodeError ? styles.formInputError : null]}
// // // // // //                   placeholder="Enter 6-digit pincode"
// // // // // //                   value={formData.pincode}
// // // // // //                   keyboardType="number-pad"
// // // // // //                   maxLength={6}
// // // // // //                   onChangeText={validatePincode}
// // // // // //                 />
// // // // // //                 {pincodeError ? (
// // // // // //                   <Text style={styles.errorText}>{pincodeError}</Text>
// // // // // //                 ) : null}
// // // // // //                 <Text style={styles.hintText}>Enter exactly 6 digits (numbers only)</Text>
// // // // // //               </View>

// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <TouchableOpacity
// // // // // //                   style={styles.defaultCheckbox}
// // // // // //                   onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
// // // // // //                 >
// // // // // //                   <Icon
// // // // // //                     name={formData.isDefault ? 'checkbox' : 'square-outline'}
// // // // // //                     size={24}
// // // // // //                     color="#fc8019"
// // // // // //                   />
// // // // // //                   <Text style={styles.defaultCheckboxText}>Set as default address</Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               </View>

// // // // // //               {formData.latitude !== 0 && (
// // // // // //                 <View style={styles.locationDetected}>
// // // // // //                   <Icon name="checkmark-circle" size={16} color="#28a745" />
// // // // // //                   <Text style={styles.locationDetectedText}>
// // // // // //                     Location detected ✓
// // // // // //                   </Text>
// // // // // //                 </View>
// // // // // //               )}

// // // // // //               <TouchableOpacity
// // // // // //                 style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
// // // // // //                 onPress={handleAddAddress}
// // // // // //                 disabled={isLoading}
// // // // // //               >
// // // // // //                 {isLoading ? (
// // // // // //                   <ActivityIndicator size="small" color="#ffffff" />
// // // // // //                 ) : (
// // // // // //                   <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
// // // // // //                 )}
// // // // // //               </TouchableOpacity>
// // // // // //             </ScrollView>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </Modal>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: '#f5f5f5',
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 14,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f0',
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   backButton: {
// // // // // //     padding: 4,
// // // // // //   },
// // // // // //   headerTitle: {
// // // // // //     flex: 1,
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   addButton: {
// // // // // //     padding: 4,
// // // // // //   },
// // // // // //   locationButton: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     margin: 16,
// // // // // //     padding: 14,
// // // // // //     borderRadius: 12,
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#fc8019',
// // // // // //     borderStyle: 'dashed',
// // // // // //   },
// // // // // //   locationButtonText: {
// // // // // //     color: '#fc8019',
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   listHeader: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   addressList: {
// // // // // //     padding: 16,
// // // // // //     paddingBottom: 120,
// // // // // //   },
// // // // // //   addressCard: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     marginBottom: 12,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#e8e8e8',
// // // // // //   },
// // // // // //   addressCardSelected: {
// // // // // //     borderColor: '#fc8019',
// // // // // //     borderWidth: 2,
// // // // // //     backgroundColor: '#fff8f0',
// // // // // //   },
// // // // // //   addressHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 8,
// // // // // //     flexWrap: 'wrap',
// // // // // //   },
// // // // // //   addressTypeContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   addressTypeText: {
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#757575',
// // // // // //     marginLeft: 4,
// // // // // //   },
// // // // // //   defaultBadge: {
// // // // // //     backgroundColor: '#4CAF50',
// // // // // //     paddingHorizontal: 8,
// // // // // //     paddingVertical: 2,
// // // // // //     borderRadius: 4,
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   defaultBadgeText: {
// // // // // //     fontSize: 10,
// // // // // //     color: '#ffffff',
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   selectedIcon: {
// // // // // //     position: 'absolute',
// // // // // //     right: 0,
// // // // // //     top: 0,
// // // // // //   },
// // // // // //   addressDetail: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   addressPhone: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#757575',
// // // // // //     marginBottom: 2,
// // // // // //   },
// // // // // //   locationTag: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   locationTagText: {
// // // // // //     fontSize: 11,
// // // // // //     color: '#28a745',
// // // // // //     marginLeft: 4,
// // // // // //   },
// // // // // //   emptyContainer: {
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     paddingVertical: 80,
// // // // // //   },
// // // // // //   emptyText: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   emptySubText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 8,
// // // // // //     marginBottom: 24,
// // // // // //   },
// // // // // //   bottomBar: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: '#f0f0f0',
// // // // // //     elevation: 4,
// // // // // //   },
// // // // // //   bottomBarLeft: {
// // // // // //     flexDirection: 'column',
// // // // // //   },
// // // // // //   bottomBarTotal: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   bottomBarItems: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   deliverButton: {
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 8,
// // // // // //   },
// // // // // //   deliverButtonText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   modalContainer: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'flex-end',
// // // // // //   },
// // // // // //   modalContent: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderTopLeftRadius: 20,
// // // // // //     borderTopRightRadius: 20,
// // // // // //     padding: 20,
// // // // // //     maxHeight: '90%',
// // // // // //   },
// // // // // //   modalHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 20,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f0',
// // // // // //     paddingBottom: 12,
// // // // // //   },
// // // // // //   modalTitle: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   formGroup: {
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   formRow: {
// // // // // //     flexDirection: 'row',
// // // // // //   },
// // // // // //   formLabel: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 6,
// // // // // //   },
// // // // // //   formInput: {
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#e0e0e0',
// // // // // //     borderRadius: 8,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 10,
// // // // // //     fontSize: 14,
// // // // // //     backgroundColor: '#fafafa',
// // // // // //   },
// // // // // //   formInputError: {
// // // // // //     borderColor: '#dc3545',
// // // // // //     borderWidth: 2,
// // // // // //   },
// // // // // //   formInputMultiline: {
// // // // // //     height: 80,
// // // // // //     textAlignVertical: 'top',
// // // // // //   },
// // // // // //   errorText: {
// // // // // //     color: '#dc3545',
// // // // // //     fontSize: 12,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   hintText: {
// // // // // //     color: '#7e808c',
// // // // // //     fontSize: 11,
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   addressTypeButtons: {
// // // // // //     flexDirection: 'row',
// // // // // //     gap: 8,
// // // // // //   },
// // // // // //   addressTypeButton: {
// // // // // //     flex: 1,
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#e0e0e0',
// // // // // //     borderRadius: 8,
// // // // // //     paddingVertical: 10,
// // // // // //     gap: 6,
// // // // // //   },
// // // // // //   addressTypeButtonActive: {
// // // // // //     borderColor: '#fc8019',
// // // // // //     backgroundColor: '#fff8f0',
// // // // // //   },
// // // // // //   addressTypeButtonText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#757575',
// // // // // //   },
// // // // // //   addressTypeButtonTextActive: {
// // // // // //     color: '#fc8019',
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   defaultCheckbox: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 4,
// // // // // //   },
// // // // // //   defaultCheckboxText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   locationDetected: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#e8f5e9',
// // // // // //     padding: 10,
// // // // // //     borderRadius: 8,
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   locationDetectedText: {
// // // // // //     fontSize: 13,
// // // // // //     color: '#28a745',
// // // // // //     marginLeft: 8,
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   submitButton: {
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     paddingVertical: 14,
// // // // // //     borderRadius: 8,
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 10,
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   submitButtonDisabled: {
// // // // // //     backgroundColor: '#ccc',
// // // // // //   },
// // // // // //   submitButtonText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // // });

// // // // // // export default AddressSelectionScreen;

// // // // // import React, { useState, useContext, useEffect } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   StyleSheet,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   FlatList,
// // // // //   TouchableOpacity,
// // // // //   Alert,
// // // // //   Modal,
// // // // //   TextInput,
// // // // //   ScrollView,
// // // // //   ActivityIndicator,
// // // // //   Platform,
// // // // // } from 'react-native';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { AddressContext, Address } from '../../context/AddressContext';
// // // // // import { CartContext } from '../../context/CartContext';
// // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // import { supabase } from '../../services/supabaseClient';

// // // // // // ✅ DYNAMIC API KEY
// // // // // let GOOGLE_MAPS_API_KEY = '';
// // // // // try {
// // // // //   const env = require('@env');
// // // // //   GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
// // // // // } catch (e) {
// // // // //   GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';
// // // // // }

// // // // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// // // // // // ✅ Indian States & Union Territories
// // // // // const INDIAN_STATES = [
// // // // //   'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
// // // // //   'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
// // // // //   'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
// // // // //   'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
// // // // //   'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
// // // // //   'Andaman and Nicobar Islands', 'Chandigarh',
// // // // //   'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
// // // // //   'Ladakh', 'Lakshadweep', 'Puducherry',
// // // // // ];

// // // // // // ✅ Major Indian Cities (grouped by state so the City dropdown can be
// // // // // // filtered once a State is chosen; falls back to full list if no state set)
// // // // // const CITIES_BY_STATE: { [key: string]: string[] } = {
// // // // //   'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
// // // // //   'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
// // // // //   'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
// // // // //   'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
// // // // //   'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Durg'],
// // // // //   'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
// // // // //   'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
// // // // //   'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
// // // // //   'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
// // // // //   'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
// // // // //   'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
// // // // //   'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
// // // // //   'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
// // // // //   'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
// // // // //   'Manipur': ['Imphal'],
// // // // //   'Meghalaya': ['Shillong'],
// // // // //   'Mizoram': ['Aizawl'],
// // // // //   'Nagaland': ['Kohima', 'Dimapur'],
// // // // //   'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
// // // // //   'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
// // // // //   'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
// // // // //   'Sikkim': ['Gangtok'],
// // // // //   'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
// // // // //   'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
// // // // //   'Tripura': ['Agartala'],
// // // // //   'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Noida', 'Varanasi'],
// // // // //   'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital'],
// // // // //   'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
// // // // //   'Andaman and Nicobar Islands': ['Port Blair'],
// // // // //   'Chandigarh': ['Chandigarh'],
// // // // //   'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Silvassa'],
// // // // //   'Delhi': ['New Delhi', 'Delhi'],
// // // // //   'Jammu and Kashmir': ['Srinagar', 'Jammu'],
// // // // //   'Ladakh': ['Leh', 'Kargil'],
// // // // //   'Lakshadweep': ['Kavaratti'],
// // // // //   'Puducherry': ['Puducherry'],
// // // // // };

// // // // // // Flat list of every city (used when no state has been picked yet)
// // // // // const ALL_CITIES = Array.from(
// // // // //   new Set(Object.values(CITIES_BY_STATE).flat())
// // // // // ).sort();

// // // // // interface AddressSelectionScreenProps {
// // // // //   navigation: any;
// // // // //   route: any;
// // // // // }

// // // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);
// // // // //   const { user } = useContext(AuthContext);

// // // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // //   const [gettingLocation, setGettingLocation] = useState(false);
// // // // //   const [locationError, setLocationError] = useState<string>('');

// // // // //   // ✅ Validation error states
// // // // //   const [phoneError, setPhoneError] = useState<string>('');
// // // // //   const [pincodeError, setPincodeError] = useState<string>('');

// // // // //   // ✅ City / State dropdown states
// // // // //   const [showCityPicker, setShowCityPicker] = useState(false);
// // // // //   const [showStatePicker, setShowStatePicker] = useState(false);
// // // // //   const [citySearch, setCitySearch] = useState('');
// // // // //   const [stateSearch, setStateSearch] = useState('');

// // // // //   const [formData, setFormData] = useState({
// // // // //     type: 'Home' as 'Home' | 'Work' | 'Other',
// // // // //     address: '',
// // // // //     city: '',
// // // // //     state: '',
// // // // //     pincode: '',
// // // // //     landmark: '',
// // // // //     phone: '',
// // // // //     isDefault: false,
// // // // //     latitude: 0,
// // // // //     longitude: 0,
// // // // //   });

// // // // //   const totalPrice = getTotalPrice() || totalAmount;
// // // // //   const totalItems = getTotalItems();

// // // // //   // ✅ City list depends on the selected state (falls back to full list)
// // // // //   const cityOptions = formData.state && CITIES_BY_STATE[formData.state]
// // // // //     ? CITIES_BY_STATE[formData.state]
// // // // //     : ALL_CITIES;

// // // // //   const filteredStates = INDIAN_STATES.filter((s) =>
// // // // //     s.toLowerCase().includes(stateSearch.toLowerCase())
// // // // //   );

// // // // //   const filteredCities = cityOptions.filter((c) =>
// // // // //     c.toLowerCase().includes(citySearch.toLowerCase())
// // // // //   );

// // // // //   const handleSelectState = (state: string) => {
// // // // //     // Reset city if it doesn't belong to the newly picked state
// // // // //     const stillValid = CITIES_BY_STATE[state]?.includes(formData.city);
// // // // //     setFormData({
// // // // //       ...formData,
// // // // //       state,
// // // // //       city: stillValid ? formData.city : '',
// // // // //     });
// // // // //     setStateSearch('');
// // // // //     setShowStatePicker(false);
// // // // //   };

// // // // //   const handleSelectCity = (city: string) => {
// // // // //     setFormData({ ...formData, city });
// // // // //     setCitySearch('');
// // // // //     setShowCityPicker(false);
// // // // //   };

// // // // //   // ✅ Phone number validation - only numbers and exactly 10 digits
// // // // //   const validatePhoneNumber = (text: string) => {
// // // // //     // Remove any non-numeric characters
// // // // //     const cleaned = text.replace(/[^0-9]/g, '');
    
// // // // //     // Only allow up to 10 digits
// // // // //     const limited = cleaned.slice(0, 10);
    
// // // // //     setFormData({ ...formData, phone: limited });
    
// // // // //     // Validate
// // // // //     if (limited.length > 0 && limited.length !== 10) {
// // // // //       setPhoneError('Phone number must be exactly 10 digits');
// // // // //     } else if (limited.length === 0) {
// // // // //       setPhoneError('');
// // // // //     } else {
// // // // //       setPhoneError('');
// // // // //     }
// // // // //   };

// // // // //   // ✅ Pincode validation - only numbers and exactly 6 digits
// // // // //   const validatePincode = (text: string) => {
// // // // //     // Remove any non-numeric characters
// // // // //     const cleaned = text.replace(/[^0-9]/g, '');
    
// // // // //     // Only allow up to 6 digits
// // // // //     const limited = cleaned.slice(0, 6);
    
// // // // //     setFormData({ ...formData, pincode: limited });
    
// // // // //     // Validate
// // // // //     if (limited.length > 0 && limited.length !== 6) {
// // // // //       setPincodeError('Pincode must be exactly 6 digits');
// // // // //     } else if (limited.length === 0) {
// // // // //       setPincodeError('');
// // // // //     } else {
// // // // //       setPincodeError('');
// // // // //     }
// // // // //   };

// // // // //   // ✅ Get current location
// // // // //   const getCurrentLocationWeb = () => {
// // // // //     setLocationError('');

// // // // //     if (!navigator.geolocation) {
// // // // //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// // // // //       return;
// // // // //     }

// // // // //     if (!GOOGLE_MAPS_API_KEY) {
// // // // //       Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
// // // // //       return;
// // // // //     }

// // // // //     console.log('📍 Getting location...');
// // // // //     setGettingLocation(true);

// // // // //     navigator.geolocation.getCurrentPosition(
// // // // //       async (position) => {
// // // // //         const { latitude, longitude } = position.coords;
// // // // //         console.log('📍 Location found:', latitude, longitude);

// // // // //         try {
// // // // //           const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
// // // // //           console.log('🔗 Fetching:', url);

// // // // //           const response = await fetch(url);
// // // // //           const data = await response.json();

// // // // //           console.log('📦 Response status:', data.status);

// // // // //           if (data.status === 'OK' && data.results && data.results.length > 0) {
// // // // //             const result = data.results[0];
// // // // //             let city = '';
// // // // //             let state = '';
// // // // //             let pincode = '';
// // // // //             let formattedAddress = result.formatted_address || '';

// // // // //             if (result.address_components) {
// // // // //               result.address_components.forEach((component: any) => {
// // // // //                 if (component.types.includes('locality') || component.types.includes('sublocality')) {
// // // // //                   city = component.long_name;
// // // // //                 }
// // // // //                 if (component.types.includes('administrative_area_level_1')) {
// // // // //                   state = component.long_name;
// // // // //                 }
// // // // //                 if (component.types.includes('postal_code')) {
// // // // //                   pincode = component.long_name;
// // // // //                 }
// // // // //               });
// // // // //             }

// // // // //             setGettingLocation(false);
// // // // //             setFormData({
// // // // //               ...formData,
// // // // //               address: formattedAddress,
// // // // //               city: city,
// // // // //               state: state,
// // // // //               pincode: pincode,
// // // // //               latitude,
// // // // //               longitude,
// // // // //             });

// // // // //             Alert.alert(
// // // // //               '📍 Location Found!',
// // // // //               `Address: ${formattedAddress}`,
// // // // //               [{ text: 'OK' }]
// // // // //             );
// // // // //           } else {
// // // // //             setGettingLocation(false);
// // // // //             Alert.alert(
// // // // //               '📍 Location Found',
// // // // //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // // //               [{ text: 'OK' }]
// // // // //             );
// // // // //             setFormData({ ...formData, latitude, longitude });
// // // // //           }
// // // // //         } catch (error) {
// // // // //           console.error('❌ Error:', error);
// // // // //           setGettingLocation(false);
// // // // //           Alert.alert(
// // // // //             '📍 Location Found',
// // // // //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // // //             [{ text: 'OK' }]
// // // // //           );
// // // // //           setFormData({ ...formData, latitude, longitude });
// // // // //         }
// // // // //       },
// // // // //       (error) => {
// // // // //         console.error('❌ Location error:', error);
// // // // //         setGettingLocation(false);

// // // // //         let message = 'Unable to get your location. Please enter manually.';
// // // // //         if (error.message) {
// // // // //           message = error.message;
// // // // //         }

// // // // //         setLocationError(message);
// // // // //         Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
// // // // //       },
// // // // //       {
// // // // //         enableHighAccuracy: true,
// // // // //         timeout: 30000,
// // // // //         maximumAge: 10000
// // // // //       }
// // // // //     );
// // // // //   };

// // // // //   const requestLocationPermission = () => {
// // // // //     if (Platform.OS === 'web') {
// // // // //       getCurrentLocationWeb();
// // // // //     } else {
// // // // //       Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
// // // // //     }
// // // // //   };

// // // // //   const getAddressTypeIcon = (type: string) => {
// // // // //     switch (type) {
// // // // //       case 'Home': return 'home-outline';
// // // // //       case 'Work': return 'briefcase-outline';
// // // // //       case 'Other': return 'location-outline';
// // // // //       default: return 'location-outline';
// // // // //     }
// // // // //   };

// // // // //   const getAddressTypeColor = (type: string) => {
// // // // //     switch (type) {
// // // // //       case 'Home': return '#4CAF50';
// // // // //       case 'Work': return '#2196F3';
// // // // //       case 'Other': return '#FF9800';
// // // // //       default: return '#757575';
// // // // //     }
// // // // //   };

// // // // //   // ✅ Shared helper: push an address string into the customers table row
// // // // //   const syncAddressToCustomer = async (fullAddress: string) => {
// // // // //     if (!user?.business_id || !user?.phone) {
// // // // //       console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // // //       return;
// // // // //     }

// // // // //     const { error } = await supabase
// // // // //       .from('customers')
// // // // //       .update({ address: fullAddress })
// // // // //       .eq('business_id', user.business_id)
// // // // //       .eq('phone', user.phone);

// // // // //     if (error) {
// // // // //       console.error('❌ Failed to update customer address:', error);
// // // // //     } else {
// // // // //       console.log('✅ Customer address synced:', fullAddress);
// // // // //     }
// // // // //   };

// // // // //   const handleSelectAddress = (address: Address) => {
// // // // //     setSelectedAddress(address);

// // // // //     const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;
// // // // //     syncAddressToCustomer(fullAddress);

// // // // //     navigation.navigate('PaymentScreen', {
// // // // //       address: address,
// // // // //       totalAmount: totalPrice,
// // // // //       restaurantName: restaurantName,
// // // // //       cartItems: cartItems,
// // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // //     });
// // // // //   };

// // // // //   // ✅ Updated handleAddAddress with validation
// // // // //   const handleAddAddress = async () => {
// // // // //     // Validate required fields
// // // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // // //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// // // // //       return;
// // // // //     }

// // // // //     // ✅ Validate pincode
// // // // //     if (formData.pincode.length !== 6) {
// // // // //       setPincodeError('Pincode must be exactly 6 digits');
// // // // //       Alert.alert('⚠️ Error', 'Pincode must be exactly 6 digits');
// // // // //       return;
// // // // //     }

// // // // //     // ✅ Validate phone if provided
// // // // //     if (formData.phone && formData.phone.length !== 10) {
// // // // //       setPhoneError('Phone number must be exactly 10 digits');
// // // // //       Alert.alert('⚠️ Error', 'Phone number must be exactly 10 digits');
// // // // //       return;
// // // // //     }

// // // // //     // Clear any previous errors
// // // // //     setPhoneError('');
// // // // //     setPincodeError('');

// // // // //     setIsLoading(true);

// // // // //     try {
// // // // //       const fullAddress = `${formData.address}, ${formData.city}, ${formData.state || ''} - ${formData.pincode}`;

// // // // //       // Save address to customers table in Supabase
// // // // //       if (user?.business_id && user?.phone) {
// // // // //         const { error: updateError } = await supabase
// // // // //           .from('customers')
// // // // //           .update({ address: fullAddress })
// // // // //           .eq('business_id', user.business_id)
// // // // //           .eq('phone', user.phone);

// // // // //         if (updateError) {
// // // // //           console.error('❌ Failed to update customer address:', updateError);
// // // // //           Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
// // // // //           setIsLoading(false);
// // // // //           return;
// // // // //         }
// // // // //         console.log('✅ Customer address updated successfully');
// // // // //       } else {
// // // // //         console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // // //       }

// // // // //       // Save to local context
// // // // //       const newAddress: Address = {
// // // // //         id: `addr_${Date.now()}`,
// // // // //         type: formData.type,
// // // // //         address: formData.address,
// // // // //         city: formData.city,
// // // // //         state: formData.state || '',
// // // // //         pincode: formData.pincode,
// // // // //         landmark: formData.landmark || '',
// // // // //         phone: formData.phone || '',
// // // // //         isDefault: addresses.length === 0 || formData.isDefault,
// // // // //         latitude: formData.latitude || undefined,
// // // // //         longitude: formData.longitude || undefined,
// // // // //       };

// // // // //       addAddress(newAddress);

// // // // //       setIsLoading(false);
// // // // //       setShowAddAddressModal(false);
// // // // //       resetForm();
// // // // //       setSelectedAddress(newAddress);

// // // // //       navigation.navigate('PaymentScreen', {
// // // // //         address: newAddress,
// // // // //         totalAmount: totalPrice,
// // // // //         restaurantName: restaurantName,
// // // // //         cartItems: cartItems,
// // // // //         orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // //       });

// // // // //     } catch (error) {
// // // // //       console.error('❌ Error saving address:', error);
// // // // //       Alert.alert('❌ Error', 'Failed to save address. Please try again.');
// // // // //       setIsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const resetForm = () => {
// // // // //     setFormData({
// // // // //       type: 'Home',
// // // // //       address: '',
// // // // //       city: '',
// // // // //       state: '',
// // // // //       pincode: '',
// // // // //       landmark: '',
// // // // //       phone: '',
// // // // //       isDefault: false,
// // // // //       latitude: 0,
// // // // //       longitude: 0,
// // // // //     });
// // // // //     setPhoneError('');
// // // // //     setPincodeError('');
// // // // //     setCitySearch('');
// // // // //     setStateSearch('');
// // // // //   };

// // // // //   const renderAddressItem = ({ item }: { item: Address }) => {
// // // // //     const isSelected = selectedAddress?.id === item.id;

// // // // //     return (
// // // // //       <TouchableOpacity
// // // // //         key={item.id}
// // // // //         style={[styles.addressCard, isSelected && styles.addressCardSelected]}
// // // // //         onPress={() => handleSelectAddress(item)}
// // // // //         activeOpacity={0.7}
// // // // //       >
// // // // //         <View style={styles.addressHeader}>
// // // // //           <View style={styles.addressTypeContainer}>
// // // // //             <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
// // // // //             <Text style={styles.addressTypeText}>{item.type}</Text>
// // // // //           </View>
// // // // //           {item.isDefault && (
// // // // //             <View style={styles.defaultBadge}>
// // // // //               <Text style={styles.defaultBadgeText}>Default</Text>
// // // // //             </View>
// // // // //           )}
// // // // //           {isSelected && (
// // // // //             <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
// // // // //           )}
// // // // //         </View>

// // // // //         <Text style={styles.addressDetail}>{item.address}</Text>
// // // // //         {item.landmark && (
// // // // //           <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
// // // // //         )}
// // // // //         {item.phone && (
// // // // //           <Text style={styles.addressPhone}>📞 {item.phone}</Text>
// // // // //         )}
// // // // //         <Text style={styles.addressDetail}>
// // // // //           {item.city}, {item.state || ''} - {item.pincode}
// // // // //         </Text>
// // // // //         {item.latitude && item.longitude && (
// // // // //           <View style={styles.locationTag}>
// // // // //             <Icon name="location-outline" size={12} color="#28a745" />
// // // // //             <Text style={styles.locationTagText}>Live location</Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </TouchableOpacity>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // //       <View style={styles.header}>
// // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.headerTitle}>Delivery Address</Text>
// // // // //         <TouchableOpacity
// // // // //           style={styles.addButton}
// // // // //           onPress={() => setShowAddAddressModal(true)}
// // // // //         >
// // // // //           <Icon name="add-circle-outline" size={28} color="#fc8019" />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       <TouchableOpacity
// // // // //         style={styles.locationButton}
// // // // //         onPress={requestLocationPermission}
// // // // //         disabled={gettingLocation}
// // // // //       >
// // // // //         {gettingLocation ? (
// // // // //           <ActivityIndicator size="small" color="#fc8019" />
// // // // //         ) : (
// // // // //           <>
// // // // //             <Icon name="locate-outline" size={22} color="#fc8019" />
// // // // //             <Text style={styles.locationButtonText}>Use Current Location</Text>
// // // // //           </>
// // // // //         )}
// // // // //       </TouchableOpacity>

// // // // //       <FlatList
// // // // //         data={addresses}
// // // // //         renderItem={renderAddressItem}
// // // // //         keyExtractor={(item) => item.id}
// // // // //         contentContainerStyle={styles.addressList}
// // // // //         showsVerticalScrollIndicator={false}
// // // // //         ListHeaderComponent={
// // // // //           addresses.length > 0 ? (
// // // // //             <Text style={styles.listHeader}>Saved Addresses</Text>
// // // // //           ) : null
// // // // //         }
// // // // //         ListEmptyComponent={
// // // // //           <View style={styles.emptyContainer}>
// // // // //             <Icon name="location-outline" size={60} color="#ccc" />
// // // // //             <Text style={styles.emptyText}>No Addresses Saved</Text>
// // // // //             <Text style={styles.emptySubText}>Add a new address</Text>
// // // // //           </View>
// // // // //         }
// // // // //       />

// // // // //       {selectedAddress && (
// // // // //         <View style={styles.bottomBar}>
// // // // //           <View style={styles.bottomBarLeft}>
// // // // //             <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>
// // // // //             <Text style={styles.bottomBarItems}>{totalItems} items</Text>
// // // // //           </View>
// // // // //           <TouchableOpacity
// // // // //             style={styles.deliverButton}
// // // // //             onPress={() => handleSelectAddress(selectedAddress)}
// // // // //           >
// // // // //             <Text style={styles.deliverButtonText}>
// // // // //               Deliver to {selectedAddress.type}
// // // // //             </Text>
// // // // //             <Icon name="arrow-forward" size={18} color="#ffffff" />
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       <Modal
// // // // //         visible={showAddAddressModal}
// // // // //         animationType="slide"
// // // // //         transparent={true}
// // // // //       >
// // // // //         <View style={styles.modalContainer}>
// // // // //           <View style={styles.modalContent}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Add New Address</Text>
// // // // //               <TouchableOpacity onPress={() => {
// // // // //                 setShowAddAddressModal(false);
// // // // //                 resetForm();
// // // // //               }}>
// // // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <ScrollView showsVerticalScrollIndicator={false}>
// // // // //               <View style={styles.formGroup}>
// // // // //                 <Text style={styles.formLabel}>Address Type</Text>
// // // // //                 <View style={styles.addressTypeButtons}>
// // // // //                   {['Home', 'Work', 'Other'].map((type) => (
// // // // //                     <TouchableOpacity
// // // // //                       key={type}
// // // // //                       style={[
// // // // //                         styles.addressTypeButton,
// // // // //                         formData.type === type && styles.addressTypeButtonActive
// // // // //                       ]}
// // // // //                       onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
// // // // //                     >
// // // // //                       <Icon
// // // // //                         name={getAddressTypeIcon(type)}
// // // // //                         size={18}
// // // // //                         color={formData.type === type ? '#fc8019' : '#757575'}
// // // // //                       />
// // // // //                       <Text
// // // // //                         style={[
// // // // //                           styles.addressTypeButtonText,
// // // // //                           formData.type === type && styles.addressTypeButtonTextActive
// // // // //                         ]}
// // // // //                       >
// // // // //                         {type}
// // // // //                       </Text>
// // // // //                     </TouchableOpacity>
// // // // //                   ))}
// // // // //                 </View>
// // // // //               </View>

// // // // //               <View style={styles.formGroup}>
// // // // //                 <Text style={styles.formLabel}>Address *</Text>
// // // // //                 <TextInput
// // // // //                   style={[styles.formInput, styles.formInputMultiline]}
// // // // //                   placeholder="Enter your address"
// // // // //                   value={formData.address}
// // // // //                   multiline
// // // // //                   numberOfLines={3}
// // // // //                   onChangeText={(text) => setFormData({ ...formData, address: text })}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.formGroup}>
// // // // //                 <Text style={styles.formLabel}>Landmark</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.formInput}
// // // // //                   placeholder="Nearby landmark (optional)"
// // // // //                   value={formData.landmark}
// // // // //                   onChangeText={(text) => setFormData({ ...formData, landmark: text })}
// // // // //                 />
// // // // //               </View>

// // // // //               {/* ✅ Phone Number with Validation */}
// // // // //               <View style={styles.formGroup}>
// // // // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // // // //                 <TextInput
// // // // //                   style={[styles.formInput, phoneError ? styles.formInputError : null]}
// // // // //                   placeholder="Enter 10-digit phone number"
// // // // //                   value={formData.phone}
// // // // //                   keyboardType="number-pad"
// // // // //                   maxLength={10}
// // // // //                   onChangeText={validatePhoneNumber}
// // // // //                 />
// // // // //                 {phoneError ? (
// // // // //                   <Text style={styles.errorText}>{phoneError}</Text>
// // // // //                 ) : null}
// // // // //                 <Text style={styles.hintText}>Enter exactly 10 digits (numbers only)</Text>
// // // // //               </View>

// // // // //               {/* ✅ City & State Dropdowns */}
// // // // //               <View style={styles.formRow}>
// // // // //                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
// // // // //                   <Text style={styles.formLabel}>City *</Text>
// // // // //                   <TouchableOpacity
// // // // //                     style={styles.formInput}
// // // // //                     onPress={() => setShowCityPicker(true)}
// // // // //                   >
// // // // //                     <Text style={formData.city ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
// // // // //                       {formData.city || 'Select City'}
// // // // //                     </Text>
// // // // //                   </TouchableOpacity>
// // // // //                 </View>
// // // // //                 <View style={[styles.formGroup, { flex: 1 }]}>
// // // // //                   <Text style={styles.formLabel}>State</Text>
// // // // //                   <TouchableOpacity
// // // // //                     style={styles.formInput}
// // // // //                     onPress={() => setShowStatePicker(true)}
// // // // //                   >
// // // // //                     <Text style={formData.state ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
// // // // //                       {formData.state || 'Select State'}
// // // // //                     </Text>
// // // // //                   </TouchableOpacity>
// // // // //                 </View>
// // // // //               </View>

// // // // //               {/* ✅ Pincode with Validation */}
// // // // //               <View style={styles.formGroup}>
// // // // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // // // //                 <TextInput
// // // // //                   style={[styles.formInput, pincodeError ? styles.formInputError : null]}
// // // // //                   placeholder="Enter 6-digit pincode"
// // // // //                   value={formData.pincode}
// // // // //                   keyboardType="number-pad"
// // // // //                   maxLength={6}
// // // // //                   onChangeText={validatePincode}
// // // // //                 />
// // // // //                 {pincodeError ? (
// // // // //                   <Text style={styles.errorText}>{pincodeError}</Text>
// // // // //                 ) : null}
// // // // //                 <Text style={styles.hintText}>Enter exactly 6 digits (numbers only)</Text>
// // // // //               </View>

// // // // //               <View style={styles.formGroup}>
// // // // //                 <TouchableOpacity
// // // // //                   style={styles.defaultCheckbox}
// // // // //                   onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
// // // // //                 >
// // // // //                   <Icon
// // // // //                     name={formData.isDefault ? 'checkbox' : 'square-outline'}
// // // // //                     size={24}
// // // // //                     color="#fc8019"
// // // // //                   />
// // // // //                   <Text style={styles.defaultCheckboxText}>Set as default address</Text>
// // // // //                 </TouchableOpacity>
// // // // //               </View>

// // // // //               {formData.latitude !== 0 && (
// // // // //                 <View style={styles.locationDetected}>
// // // // //                   <Icon name="checkmark-circle" size={16} color="#28a745" />
// // // // //                   <Text style={styles.locationDetectedText}>
// // // // //                     Location detected ✓
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               )}

// // // // //               <TouchableOpacity
// // // // //                 style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
// // // // //                 onPress={handleAddAddress}
// // // // //                 disabled={isLoading}
// // // // //               >
// // // // //                 {isLoading ? (
// // // // //                   <ActivityIndicator size="small" color="#ffffff" />
// // // // //                 ) : (
// // // // //                   <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             </ScrollView>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ✅ State Picker Modal */}
// // // // //       <Modal
// // // // //         visible={showStatePicker}
// // // // //         animationType="slide"
// // // // //         transparent={true}
// // // // //         onRequestClose={() => setShowStatePicker(false)}
// // // // //       >
// // // // //         <View style={styles.modalContainer}>
// // // // //           <View style={styles.pickerModalContent}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select State</Text>
// // // // //               <TouchableOpacity onPress={() => {
// // // // //                 setShowStatePicker(false);
// // // // //                 setStateSearch('');
// // // // //               }}>
// // // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.searchBox}>
// // // // //               <Icon name="search-outline" size={18} color="#7e808c" />
// // // // //               <TextInput
// // // // //                 style={styles.searchInput}
// // // // //                 placeholder="Search state"
// // // // //                 value={stateSearch}
// // // // //                 onChangeText={setStateSearch}
// // // // //                 autoFocus
// // // // //               />
// // // // //             </View>

// // // // //             <FlatList
// // // // //               data={filteredStates}
// // // // //               keyExtractor={(item) => item}
// // // // //               style={{ maxHeight: 400 }}
// // // // //               renderItem={({ item }) => (
// // // // //                 <TouchableOpacity
// // // // //                   style={styles.pickerRow}
// // // // //                   onPress={() => handleSelectState(item)}
// // // // //                 >
// // // // //                   <Text style={styles.pickerRowText}>{item}</Text>
// // // // //                   {formData.state === item && (
// // // // //                     <Icon name="checkmark" size={18} color="#fc8019" />
// // // // //                   )}
// // // // //                 </TouchableOpacity>
// // // // //               )}
// // // // //               ListEmptyComponent={
// // // // //                 <Text style={styles.pickerEmptyText}>No states found</Text>
// // // // //               }
// // // // //             />
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ✅ City Picker Modal */}
// // // // //       <Modal
// // // // //         visible={showCityPicker}
// // // // //         animationType="slide"
// // // // //         transparent={true}
// // // // //         onRequestClose={() => setShowCityPicker(false)}
// // // // //       >
// // // // //         <View style={styles.modalContainer}>
// // // // //           <View style={styles.pickerModalContent}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select City</Text>
// // // // //               <TouchableOpacity onPress={() => {
// // // // //                 setShowCityPicker(false);
// // // // //                 setCitySearch('');
// // // // //               }}>
// // // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.searchBox}>
// // // // //               <Icon name="search-outline" size={18} color="#7e808c" />
// // // // //               <TextInput
// // // // //                 style={styles.searchInput}
// // // // //                 placeholder="Search city"
// // // // //                 value={citySearch}
// // // // //                 onChangeText={setCitySearch}
// // // // //                 autoFocus
// // // // //               />
// // // // //             </View>

// // // // //             <FlatList
// // // // //               data={filteredCities}
// // // // //               keyExtractor={(item) => item}
// // // // //               style={{ maxHeight: 400 }}
// // // // //               renderItem={({ item }) => (
// // // // //                 <TouchableOpacity
// // // // //                   style={styles.pickerRow}
// // // // //                   onPress={() => handleSelectCity(item)}
// // // // //                 >
// // // // //                   <Text style={styles.pickerRowText}>{item}</Text>
// // // // //                   {formData.city === item && (
// // // // //                     <Icon name="checkmark" size={18} color="#fc8019" />
// // // // //                   )}
// // // // //                 </TouchableOpacity>
// // // // //               )}
// // // // //               ListEmptyComponent={
// // // // //                 <Text style={styles.pickerEmptyText}>No cities found</Text>
// // // // //               }
// // // // //             />
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#f5f5f5',
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 14,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f0',
// // // // //     elevation: 2,
// // // // //   },
// // // // //   backButton: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   headerTitle: {
// // // // //     flex: 1,
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   addButton: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   locationButton: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     margin: 16,
// // // // //     padding: 14,
// // // // //     borderRadius: 12,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#fc8019',
// // // // //     borderStyle: 'dashed',
// // // // //   },
// // // // //   locationButtonText: {
// // // // //     color: '#fc8019',
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   listHeader: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   addressList: {
// // // // //     padding: 16,
// // // // //     paddingBottom: 120,
// // // // //   },
// // // // //   addressCard: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e8e8e8',
// // // // //   },
// // // // //   addressCardSelected: {
// // // // //     borderColor: '#fc8019',
// // // // //     borderWidth: 2,
// // // // //     backgroundColor: '#fff8f0',
// // // // //   },
// // // // //   addressHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //     flexWrap: 'wrap',
// // // // //   },
// // // // //   addressTypeContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   addressTypeText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //     color: '#757575',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   defaultBadge: {
// // // // //     backgroundColor: '#4CAF50',
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 2,
// // // // //     borderRadius: 4,
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   defaultBadgeText: {
// // // // //     fontSize: 10,
// // // // //     color: '#ffffff',
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   selectedIcon: {
// // // // //     position: 'absolute',
// // // // //     right: 0,
// // // // //     top: 0,
// // // // //   },
// // // // //   addressDetail: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   addressPhone: {
// // // // //     fontSize: 14,
// // // // //     color: '#757575',
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   locationTag: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   locationTagText: {
// // // // //     fontSize: 11,
// // // // //     color: '#28a745',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   emptyContainer: {
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingVertical: 80,
// // // // //   },
// // // // //   emptyText: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   emptySubText: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 8,
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   bottomBar: {
// // // // //     position: 'absolute',
// // // // //     bottom: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     backgroundColor: '#ffffff',
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#f0f0f0',
// // // // //     elevation: 4,
// // // // //   },
// // // // //   bottomBarLeft: {
// // // // //     flexDirection: 'column',
// // // // //   },
// // // // //   bottomBarTotal: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '700',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   bottomBarItems: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //   },
// // // // //   deliverButton: {
// // // // //     backgroundColor: '#fc8019',
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 20,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   deliverButtonText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   modalContainer: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'flex-end',
// // // // //   },
// // // // //   modalContent: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderTopLeftRadius: 20,
// // // // //     borderTopRightRadius: 20,
// // // // //     padding: 20,
// // // // //     maxHeight: '90%',
// // // // //   },
// // // // //   pickerModalContent: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderTopLeftRadius: 20,
// // // // //     borderTopRightRadius: 20,
// // // // //     padding: 20,
// // // // //     maxHeight: '80%',
// // // // //   },
// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 20,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f0',
// // // // //     paddingBottom: 12,
// // // // //   },
// // // // //   modalTitle: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   searchBox: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fafafa',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e0e0e0',
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 12,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   searchInput: {
// // // // //     flex: 1,
// // // // //     paddingVertical: 10,
// // // // //     paddingHorizontal: 8,
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   pickerRow: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f0',
// // // // //   },
// // // // //   pickerRowText: {
// // // // //     fontSize: 15,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   pickerEmptyText: {
// // // // //     textAlign: 'center',
// // // // //     color: '#7e808c',
// // // // //     paddingVertical: 24,
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   dropdownValueText: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   dropdownPlaceholderText: {
// // // // //     fontSize: 14,
// // // // //     color: '#9e9e9e',
// // // // //   },
// // // // //   formGroup: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   formRow: {
// // // // //     flexDirection: 'row',
// // // // //   },
// // // // //   formLabel: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 6,
// // // // //   },
// // // // //   formInput: {
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e0e0e0',
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 10,
// // // // //     fontSize: 14,
// // // // //     backgroundColor: '#fafafa',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   formInputError: {
// // // // //     borderColor: '#dc3545',
// // // // //     borderWidth: 2,
// // // // //   },
// // // // //   formInputMultiline: {
// // // // //     height: 80,
// // // // //     textAlignVertical: 'top',
// // // // //   },
// // // // //   errorText: {
// // // // //     color: '#dc3545',
// // // // //     fontSize: 12,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   hintText: {
// // // // //     color: '#7e808c',
// // // // //     fontSize: 11,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   addressTypeButtons: {
// // // // //     flexDirection: 'row',
// // // // //     gap: 8,
// // // // //   },
// // // // //   addressTypeButton: {
// // // // //     flex: 1,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e0e0e0',
// // // // //     borderRadius: 8,
// // // // //     paddingVertical: 10,
// // // // //     gap: 6,
// // // // //   },
// // // // //   addressTypeButtonActive: {
// // // // //     borderColor: '#fc8019',
// // // // //     backgroundColor: '#fff8f0',
// // // // //   },
// // // // //   addressTypeButtonText: {
// // // // //     fontSize: 14,
// // // // //     color: '#757575',
// // // // //   },
// // // // //   addressTypeButtonTextActive: {
// // // // //     color: '#fc8019',
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   defaultCheckbox: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 4,
// // // // //   },
// // // // //   defaultCheckboxText: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   locationDetected: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#e8f5e9',
// // // // //     padding: 10,
// // // // //     borderRadius: 8,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   locationDetectedText: {
// // // // //     fontSize: 13,
// // // // //     color: '#28a745',
// // // // //     marginLeft: 8,
// // // // //     flex: 1,
// // // // //   },
// // // // //   submitButton: {
// // // // //     backgroundColor: '#fc8019',
// // // // //     paddingVertical: 14,
// // // // //     borderRadius: 8,
// // // // //     alignItems: 'center',
// // // // //     marginTop: 10,
// // // // //     marginBottom: 20,
// // // // //   },
// // // // //   submitButtonDisabled: {
// // // // //     backgroundColor: '#ccc',
// // // // //   },
// // // // //   submitButtonText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // // });

// // // // // export default AddressSelectionScreen;
// // // // import React, { useState, useContext, useEffect } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   StyleSheet,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   FlatList,
// // // //   TouchableOpacity,
// // // //   Alert,
// // // //   Modal,
// // // //   TextInput,
// // // //   ScrollView,
// // // //   ActivityIndicator,
// // // //   Platform,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { AddressContext, Address } from '../../context/AddressContext';
// // // // import { CartContext } from '../../context/CartContext';
// // // // import { AuthContext } from '../../context/AuthContext';
// // // // import { supabase } from '../../services/supabaseClient';

// // // // // ✅ DYNAMIC API KEY
// // // // let GOOGLE_MAPS_API_KEY = '';
// // // // try {
// // // //   const env = require('@env');
// // // //   GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
// // // // } catch (e) {
// // // //   GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';
// // // // }

// // // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// // // // // ✅ Indian States & Union Territories
// // // // const INDIAN_STATES = [
// // // //   'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
// // // //   'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
// // // //   'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
// // // //   'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
// // // //   'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
// // // //   'Andaman and Nicobar Islands', 'Chandigarh',
// // // //   'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
// // // //   'Ladakh', 'Lakshadweep', 'Puducherry',
// // // // ];

// // // // // ✅ Major Indian Cities (grouped by state so the City dropdown can be
// // // // // filtered once a State is chosen; falls back to full list if no state set)
// // // // const CITIES_BY_STATE: { [key: string]: string[] } = {
// // // //   'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
// // // //   'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
// // // //   'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
// // // //   'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
// // // //   'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Durg'],
// // // //   'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
// // // //   'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
// // // //   'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
// // // //   'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
// // // //   'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
// // // //   'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
// // // //   'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
// // // //   'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
// // // //   'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
// // // //   'Manipur': ['Imphal'],
// // // //   'Meghalaya': ['Shillong'],
// // // //   'Mizoram': ['Aizawl'],
// // // //   'Nagaland': ['Kohima', 'Dimapur'],
// // // //   'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
// // // //   'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
// // // //   'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
// // // //   'Sikkim': ['Gangtok'],
// // // //   'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
// // // //   'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
// // // //   'Tripura': ['Agartala'],
// // // //   'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Noida', 'Varanasi'],
// // // //   'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital'],
// // // //   'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
// // // //   'Andaman and Nicobar Islands': ['Port Blair'],
// // // //   'Chandigarh': ['Chandigarh'],
// // // //   'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Silvassa'],
// // // //   'Delhi': ['New Delhi', 'Delhi'],
// // // //   'Jammu and Kashmir': ['Srinagar', 'Jammu'],
// // // //   'Ladakh': ['Leh', 'Kargil'],
// // // //   'Lakshadweep': ['Kavaratti'],
// // // //   'Puducherry': ['Puducherry'],
// // // // };

// // // // // Flat list of every city (used when no state has been picked yet)
// // // // const ALL_CITIES = Array.from(
// // // //   new Set(Object.values(CITIES_BY_STATE).flat())
// // // // ).sort();

// // // // interface AddressSelectionScreenProps {
// // // //   navigation: any;
// // // //   route: any;
// // // // }

// // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);
// // // //   const { user } = useContext(AuthContext);

// // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const [gettingLocation, setGettingLocation] = useState(false);
// // // //   const [locationError, setLocationError] = useState<string>('');

// // // //   // ✅ Validation error states
// // // //   const [phoneError, setPhoneError] = useState<string>('');
// // // //   const [pincodeError, setPincodeError] = useState<string>('');

// // // //   // ✅ City / State inline dropdowns (expand directly under the field,
// // // //   // in the same page — like a native <select> — no modal/screen swap).
// // // //   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// // // //   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
// // // //   const [citySearch, setCitySearch] = useState('');
// // // //   const [stateSearch, setStateSearch] = useState('');

// // // //   const [formData, setFormData] = useState({
// // // //     type: 'Home' as 'Home' | 'Work' | 'Other',
// // // //     address: '',
// // // //     city: '',
// // // //     state: '',
// // // //     pincode: '',
// // // //     landmark: '',
// // // //     phone: '',
// // // //     isDefault: false,
// // // //     latitude: 0,
// // // //     longitude: 0,
// // // //   });

// // // //   const totalPrice = getTotalPrice() || totalAmount;
// // // //   const totalItems = getTotalItems();

// // // //   // ✅ City list depends on the selected state (falls back to full list)
// // // //   const cityOptions = formData.state && CITIES_BY_STATE[formData.state]
// // // //     ? CITIES_BY_STATE[formData.state]
// // // //     : ALL_CITIES;

// // // //   const filteredStates = INDIAN_STATES.filter((s) =>
// // // //     s.toLowerCase().includes(stateSearch.toLowerCase())
// // // //   );

// // // //   const filteredCities = cityOptions.filter((c) =>
// // // //     c.toLowerCase().includes(citySearch.toLowerCase())
// // // //   );

// // // //   const handleSelectState = (state: string) => {
// // // //     // Reset city if it doesn't belong to the newly picked state
// // // //     const stillValid = CITIES_BY_STATE[state]?.includes(formData.city);
// // // //     setFormData({
// // // //       ...formData,
// // // //       state,
// // // //       city: stillValid ? formData.city : '',
// // // //     });
// // // //     setStateSearch('');
// // // //     setStateDropdownOpen(false);
// // // //   };

// // // //   const handleSelectCity = (city: string) => {
// // // //     setFormData({ ...formData, city });
// // // //     setCitySearch('');
// // // //     setCityDropdownOpen(false);
// // // //   };

// // // //   // ✅ Phone number validation - only numbers and exactly 10 digits
// // // //   const validatePhoneNumber = (text: string) => {
// // // //     // Remove any non-numeric characters
// // // //     const cleaned = text.replace(/[^0-9]/g, '');
    
// // // //     // Only allow up to 10 digits
// // // //     const limited = cleaned.slice(0, 10);
    
// // // //     setFormData({ ...formData, phone: limited });
    
// // // //     // Validate
// // // //     if (limited.length > 0 && limited.length !== 10) {
// // // //       setPhoneError('Phone number must be exactly 10 digits');
// // // //     } else if (limited.length === 0) {
// // // //       setPhoneError('');
// // // //     } else {
// // // //       setPhoneError('');
// // // //     }
// // // //   };

// // // //   // ✅ Pincode validation - only numbers and exactly 6 digits
// // // //   const validatePincode = (text: string) => {
// // // //     // Remove any non-numeric characters
// // // //     const cleaned = text.replace(/[^0-9]/g, '');
    
// // // //     // Only allow up to 6 digits
// // // //     const limited = cleaned.slice(0, 6);
    
// // // //     setFormData({ ...formData, pincode: limited });
    
// // // //     // Validate
// // // //     if (limited.length > 0 && limited.length !== 6) {
// // // //       setPincodeError('Pincode must be exactly 6 digits');
// // // //     } else if (limited.length === 0) {
// // // //       setPincodeError('');
// // // //     } else {
// // // //       setPincodeError('');
// // // //     }
// // // //   };

// // // //   // ✅ Get current location
// // // //   const getCurrentLocationWeb = () => {
// // // //     setLocationError('');

// // // //     if (!navigator.geolocation) {
// // // //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// // // //       return;
// // // //     }

// // // //     if (!GOOGLE_MAPS_API_KEY) {
// // // //       Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
// // // //       return;
// // // //     }

// // // //     console.log('📍 Getting location...');
// // // //     setGettingLocation(true);

// // // //     navigator.geolocation.getCurrentPosition(
// // // //       async (position) => {
// // // //         const { latitude, longitude } = position.coords;
// // // //         console.log('📍 Location found:', latitude, longitude);

// // // //         try {
// // // //           const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
// // // //           console.log('🔗 Fetching:', url);

// // // //           const response = await fetch(url);
// // // //           const data = await response.json();

// // // //           console.log('📦 Response status:', data.status);

// // // //           if (data.status === 'OK' && data.results && data.results.length > 0) {
// // // //             const result = data.results[0];
// // // //             let city = '';
// // // //             let state = '';
// // // //             let pincode = '';
// // // //             let formattedAddress = result.formatted_address || '';

// // // //             if (result.address_components) {
// // // //               result.address_components.forEach((component: any) => {
// // // //                 if (component.types.includes('locality') || component.types.includes('sublocality')) {
// // // //                   city = component.long_name;
// // // //                 }
// // // //                 if (component.types.includes('administrative_area_level_1')) {
// // // //                   state = component.long_name;
// // // //                 }
// // // //                 if (component.types.includes('postal_code')) {
// // // //                   pincode = component.long_name;
// // // //                 }
// // // //               });
// // // //             }

// // // //             setGettingLocation(false);
// // // //             setFormData({
// // // //               ...formData,
// // // //               address: formattedAddress,
// // // //               city: city,
// // // //               state: state,
// // // //               pincode: pincode,
// // // //               latitude,
// // // //               longitude,
// // // //             });

// // // //             Alert.alert(
// // // //               '📍 Location Found!',
// // // //               `Address: ${formattedAddress}`,
// // // //               [{ text: 'OK' }]
// // // //             );
// // // //           } else {
// // // //             setGettingLocation(false);
// // // //             Alert.alert(
// // // //               '📍 Location Found',
// // // //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // //               [{ text: 'OK' }]
// // // //             );
// // // //             setFormData({ ...formData, latitude, longitude });
// // // //           }
// // // //         } catch (error) {
// // // //           console.error('❌ Error:', error);
// // // //           setGettingLocation(false);
// // // //           Alert.alert(
// // // //             '📍 Location Found',
// // // //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // // //             [{ text: 'OK' }]
// // // //           );
// // // //           setFormData({ ...formData, latitude, longitude });
// // // //         }
// // // //       },
// // // //       (error) => {
// // // //         console.error('❌ Location error:', error);
// // // //         setGettingLocation(false);

// // // //         let message = 'Unable to get your location. Please enter manually.';
// // // //         if (error.message) {
// // // //           message = error.message;
// // // //         }

// // // //         setLocationError(message);
// // // //         Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
// // // //       },
// // // //       {
// // // //         enableHighAccuracy: true,
// // // //         timeout: 30000,
// // // //         maximumAge: 10000
// // // //       }
// // // //     );
// // // //   };

// // // //   const requestLocationPermission = () => {
// // // //     if (Platform.OS === 'web') {
// // // //       getCurrentLocationWeb();
// // // //     } else {
// // // //       Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
// // // //     }
// // // //   };

// // // //   const getAddressTypeIcon = (type: string) => {
// // // //     switch (type) {
// // // //       case 'Home': return 'home-outline';
// // // //       case 'Work': return 'briefcase-outline';
// // // //       case 'Other': return 'location-outline';
// // // //       default: return 'location-outline';
// // // //     }
// // // //   };

// // // //   const getAddressTypeColor = (type: string) => {
// // // //     switch (type) {
// // // //       case 'Home': return '#4CAF50';
// // // //       case 'Work': return '#2196F3';
// // // //       case 'Other': return '#FF9800';
// // // //       default: return '#757575';
// // // //     }
// // // //   };

// // // //   // ✅ Shared helper: push an address string into the customers table row
// // // //   const syncAddressToCustomer = async (fullAddress: string) => {
// // // //     if (!user?.business_id || !user?.phone) {
// // // //       console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // //       return;
// // // //     }

// // // //     const { error } = await supabase
// // // //       .from('customers')
// // // //       .update({ address: fullAddress })
// // // //       .eq('business_id', user.business_id)
// // // //       .eq('phone', user.phone);

// // // //     if (error) {
// // // //       console.error('❌ Failed to update customer address:', error);
// // // //     } else {
// // // //       console.log('✅ Customer address synced:', fullAddress);
// // // //     }
// // // //   };

// // // //   const handleSelectAddress = (address: Address) => {
// // // //     setSelectedAddress(address);

// // // //     const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;
// // // //     syncAddressToCustomer(fullAddress);

// // // //     navigation.navigate('PaymentScreen', {
// // // //       address: address,
// // // //       totalAmount: totalPrice,
// // // //       restaurantName: restaurantName,
// // // //       cartItems: cartItems,
// // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // //     });
// // // //   };

// // // //   // ✅ Updated handleAddAddress with validation
// // // //   const handleAddAddress = async () => {
// // // //     // Validate required fields
// // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// // // //       return;
// // // //     }

// // // //     // ✅ Validate pincode
// // // //     if (formData.pincode.length !== 6) {
// // // //       setPincodeError('Pincode must be exactly 6 digits');
// // // //       Alert.alert('⚠️ Error', 'Pincode must be exactly 6 digits');
// // // //       return;
// // // //     }

// // // //     // ✅ Validate phone if provided
// // // //     if (formData.phone && formData.phone.length !== 10) {
// // // //       setPhoneError('Phone number must be exactly 10 digits');
// // // //       Alert.alert('⚠️ Error', 'Phone number must be exactly 10 digits');
// // // //       return;
// // // //     }

// // // //     // Clear any previous errors
// // // //     setPhoneError('');
// // // //     setPincodeError('');

// // // //     setIsLoading(true);

// // // //     try {
// // // //       const fullAddress = `${formData.address}, ${formData.city}, ${formData.state || ''} - ${formData.pincode}`;

// // // //       // Save address to customers table in Supabase
// // // //       if (user?.business_id && user?.phone) {
// // // //         const { error: updateError } = await supabase
// // // //           .from('customers')
// // // //           .update({ address: fullAddress })
// // // //           .eq('business_id', user.business_id)
// // // //           .eq('phone', user.phone);

// // // //         if (updateError) {
// // // //           console.error('❌ Failed to update customer address:', updateError);
// // // //           Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
// // // //           setIsLoading(false);
// // // //           return;
// // // //         }
// // // //         console.log('✅ Customer address updated successfully');
// // // //       } else {
// // // //         console.log('⚠️ Missing business_id or phone — skipped customer address sync');
// // // //       }

// // // //       // Save to local context
// // // //       const newAddress: Address = {
// // // //         id: `addr_${Date.now()}`,
// // // //         type: formData.type,
// // // //         address: formData.address,
// // // //         city: formData.city,
// // // //         state: formData.state || '',
// // // //         pincode: formData.pincode,
// // // //         landmark: formData.landmark || '',
// // // //         phone: formData.phone || '',
// // // //         isDefault: addresses.length === 0 || formData.isDefault,
// // // //         latitude: formData.latitude || undefined,
// // // //         longitude: formData.longitude || undefined,
// // // //       };

// // // //       addAddress(newAddress);

// // // //       setIsLoading(false);
// // // //       setShowAddAddressModal(false);
// // // //       resetForm();
// // // //       setSelectedAddress(newAddress);

// // // //       navigation.navigate('PaymentScreen', {
// // // //         address: newAddress,
// // // //         totalAmount: totalPrice,
// // // //         restaurantName: restaurantName,
// // // //         cartItems: cartItems,
// // // //         orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // //       });

// // // //     } catch (error) {
// // // //       console.error('❌ Error saving address:', error);
// // // //       Alert.alert('❌ Error', 'Failed to save address. Please try again.');
// // // //       setIsLoading(false);
// // // //     }
// // // //   };

// // // //   const resetForm = () => {
// // // //     setFormData({
// // // //       type: 'Home',
// // // //       address: '',
// // // //       city: '',
// // // //       state: '',
// // // //       pincode: '',
// // // //       landmark: '',
// // // //       phone: '',
// // // //       isDefault: false,
// // // //       latitude: 0,
// // // //       longitude: 0,
// // // //     });
// // // //     setPhoneError('');
// // // //     setPincodeError('');
// // // //     setCitySearch('');
// // // //     setStateSearch('');
// // // //     setCityDropdownOpen(false);
// // // //     setStateDropdownOpen(false);
// // // //   };

// // // //   const renderAddressItem = ({ item }: { item: Address }) => {
// // // //     const isSelected = selectedAddress?.id === item.id;

// // // //     return (
// // // //       <TouchableOpacity
// // // //         key={item.id}
// // // //         style={[styles.addressCard, isSelected && styles.addressCardSelected]}
// // // //         onPress={() => handleSelectAddress(item)}
// // // //         activeOpacity={0.7}
// // // //       >
// // // //         <View style={styles.addressHeader}>
// // // //           <View style={styles.addressTypeContainer}>
// // // //             <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
// // // //             <Text style={styles.addressTypeText}>{item.type}</Text>
// // // //           </View>
// // // //           {item.isDefault && (
// // // //             <View style={styles.defaultBadge}>
// // // //               <Text style={styles.defaultBadgeText}>Default</Text>
// // // //             </View>
// // // //           )}
// // // //           {isSelected && (
// // // //             <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
// // // //           )}
// // // //         </View>

// // // //         <Text style={styles.addressDetail}>{item.address}</Text>
// // // //         {item.landmark && (
// // // //           <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
// // // //         )}
// // // //         {item.phone && (
// // // //           <Text style={styles.addressPhone}>📞 {item.phone}</Text>
// // // //         )}
// // // //         <Text style={styles.addressDetail}>
// // // //           {item.city}, {item.state || ''} - {item.pincode}
// // // //         </Text>
// // // //         {item.latitude && item.longitude && (
// // // //           <View style={styles.locationTag}>
// // // //             <Icon name="location-outline" size={12} color="#28a745" />
// // // //             <Text style={styles.locationTagText}>Live location</Text>
// // // //           </View>
// // // //         )}
// // // //       </TouchableOpacity>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // //       <View style={styles.header}>
// // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.headerTitle}>Delivery Address</Text>
// // // //         <TouchableOpacity
// // // //           style={styles.addButton}
// // // //           onPress={() => setShowAddAddressModal(true)}
// // // //         >
// // // //           <Icon name="add-circle-outline" size={28} color="#fc8019" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       <TouchableOpacity
// // // //         style={styles.locationButton}
// // // //         onPress={requestLocationPermission}
// // // //         disabled={gettingLocation}
// // // //       >
// // // //         {gettingLocation ? (
// // // //           <ActivityIndicator size="small" color="#fc8019" />
// // // //         ) : (
// // // //           <>
// // // //             <Icon name="locate-outline" size={22} color="#fc8019" />
// // // //             <Text style={styles.locationButtonText}>Use Current Location</Text>
// // // //           </>
// // // //         )}
// // // //       </TouchableOpacity>

// // // //       <FlatList
// // // //         data={addresses}
// // // //         renderItem={renderAddressItem}
// // // //         keyExtractor={(item) => item.id}
// // // //         contentContainerStyle={styles.addressList}
// // // //         showsVerticalScrollIndicator={false}
// // // //         ListHeaderComponent={
// // // //           addresses.length > 0 ? (
// // // //             <Text style={styles.listHeader}>Saved Addresses</Text>
// // // //           ) : null
// // // //         }
// // // //         ListEmptyComponent={
// // // //           <View style={styles.emptyContainer}>
// // // //             <Icon name="location-outline" size={60} color="#ccc" />
// // // //             <Text style={styles.emptyText}>No Addresses Saved</Text>
// // // //             <Text style={styles.emptySubText}>Add a new address</Text>
// // // //           </View>
// // // //         }
// // // //       />

// // // //       {selectedAddress && (
// // // //         <View style={styles.bottomBar}>
// // // //           <View style={styles.bottomBarLeft}>
// // // //             <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>
// // // //             <Text style={styles.bottomBarItems}>{totalItems} items</Text>
// // // //           </View>
// // // //           <TouchableOpacity
// // // //             style={styles.deliverButton}
// // // //             onPress={() => handleSelectAddress(selectedAddress)}
// // // //           >
// // // //             <Text style={styles.deliverButtonText}>
// // // //               Deliver to {selectedAddress.type}
// // // //             </Text>
// // // //             <Icon name="arrow-forward" size={18} color="#ffffff" />
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       )}

// // // //       <Modal
// // // //         visible={showAddAddressModal}
// // // //         animationType="slide"
// // // //         transparent={true}
// // // //       >
// // // //         <View style={styles.modalContainer}>
// // // //           <View style={styles.modalContent}>
// // // //             <View style={styles.modalHeader}>
// // // //               <Text style={styles.modalTitle}>Add New Address</Text>
// // // //               <TouchableOpacity onPress={() => {
// // // //                 setShowAddAddressModal(false);
// // // //                 resetForm();
// // // //               }}>
// // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>Address Type</Text>
// // // //                 <View style={styles.addressTypeButtons}>
// // // //                   {['Home', 'Work', 'Other'].map((type) => (
// // // //                     <TouchableOpacity
// // // //                       key={type}
// // // //                       style={[
// // // //                         styles.addressTypeButton,
// // // //                         formData.type === type && styles.addressTypeButtonActive
// // // //                       ]}
// // // //                       onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
// // // //                     >
// // // //                       <Icon
// // // //                         name={getAddressTypeIcon(type)}
// // // //                         size={18}
// // // //                         color={formData.type === type ? '#fc8019' : '#757575'}
// // // //                       />
// // // //                       <Text
// // // //                         style={[
// // // //                           styles.addressTypeButtonText,
// // // //                           formData.type === type && styles.addressTypeButtonTextActive
// // // //                         ]}
// // // //                       >
// // // //                         {type}
// // // //                       </Text>
// // // //                     </TouchableOpacity>
// // // //                   ))}
// // // //                 </View>
// // // //               </View>

// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>Address *</Text>
// // // //                 <TextInput
// // // //                   style={[styles.formInput, styles.formInputMultiline]}
// // // //                   placeholder="Enter your address"
// // // //                   value={formData.address}
// // // //                   multiline
// // // //                   numberOfLines={3}
// // // //                   onChangeText={(text) => setFormData({ ...formData, address: text })}
// // // //                 />
// // // //               </View>

// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>Landmark</Text>
// // // //                 <TextInput
// // // //                   style={styles.formInput}
// // // //                   placeholder="Nearby landmark (optional)"
// // // //                   value={formData.landmark}
// // // //                   onChangeText={(text) => setFormData({ ...formData, landmark: text })}
// // // //                 />
// // // //               </View>

// // // //               {/* ✅ Phone Number with Validation */}
// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // // //                 <TextInput
// // // //                   style={[styles.formInput, phoneError ? styles.formInputError : null]}
// // // //                   placeholder="Enter 10-digit phone number"
// // // //                   value={formData.phone}
// // // //                   keyboardType="number-pad"
// // // //                   maxLength={10}
// // // //                   onChangeText={validatePhoneNumber}
// // // //                 />
// // // //                 {phoneError ? (
// // // //                   <Text style={styles.errorText}>{phoneError}</Text>
// // // //                 ) : null}
// // // //                 <Text style={styles.hintText}>Enter exactly 10 digits (numbers only)</Text>
// // // //               </View>

// // // //               {/* ✅ City & State — inline expanding dropdowns (like a native <select>) */}
// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>City *</Text>
// // // //                 <TouchableOpacity
// // // //                   style={styles.formInput}
// // // //                   onPress={() => {
// // // //                     setCityDropdownOpen(!cityDropdownOpen);
// // // //                     setStateDropdownOpen(false);
// // // //                   }}
// // // //                 >
// // // //                   <View style={styles.dropdownTriggerRow}>
// // // //                     <Text style={formData.city ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
// // // //                       {formData.city || 'Select City'}
// // // //                     </Text>
// // // //                     <Icon name={cityDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#757575" />
// // // //                   </View>
// // // //                 </TouchableOpacity>

// // // //                 {cityDropdownOpen && (
// // // //                   <View style={styles.dropdownPanel}>
// // // //                     <View style={styles.searchBox}>
// // // //                       <Icon name="search-outline" size={18} color="#7e808c" />
// // // //                       <TextInput
// // // //                         style={styles.searchInput}
// // // //                         placeholder="Search city"
// // // //                         value={citySearch}
// // // //                         onChangeText={setCitySearch}
// // // //                         autoFocus
// // // //                       />
// // // //                     </View>
// // // //                     <ScrollView style={styles.dropdownList} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
// // // //                       {filteredCities.length === 0 ? (
// // // //                         <Text style={styles.pickerEmptyText}>No cities found</Text>
// // // //                       ) : (
// // // //                         filteredCities.map((item) => (
// // // //                           <TouchableOpacity
// // // //                             key={item}
// // // //                             style={[styles.pickerRow, formData.city === item && styles.pickerRowActive]}
// // // //                             onPress={() => handleSelectCity(item)}
// // // //                           >
// // // //                             <Text style={[styles.pickerRowText, formData.city === item && styles.pickerRowTextActive]}>
// // // //                               {item}
// // // //                             </Text>
// // // //                             {formData.city === item && (
// // // //                               <Icon name="checkmark" size={18} color="#fc8019" />
// // // //                             )}
// // // //                           </TouchableOpacity>
// // // //                         ))
// // // //                       )}
// // // //                     </ScrollView>
// // // //                   </View>
// // // //                 )}
// // // //               </View>

// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>State</Text>
// // // //                 <TouchableOpacity
// // // //                   style={styles.formInput}
// // // //                   onPress={() => {
// // // //                     setStateDropdownOpen(!stateDropdownOpen);
// // // //                     setCityDropdownOpen(false);
// // // //                   }}
// // // //                 >
// // // //                   <View style={styles.dropdownTriggerRow}>
// // // //                     <Text style={formData.state ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
// // // //                       {formData.state || 'Select State'}
// // // //                     </Text>
// // // //                     <Icon name={stateDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#757575" />
// // // //                   </View>
// // // //                 </TouchableOpacity>

// // // //                 {stateDropdownOpen && (
// // // //                   <View style={styles.dropdownPanel}>
// // // //                     <View style={styles.searchBox}>
// // // //                       <Icon name="search-outline" size={18} color="#7e808c" />
// // // //                       <TextInput
// // // //                         style={styles.searchInput}
// // // //                         placeholder="Search state"
// // // //                         value={stateSearch}
// // // //                         onChangeText={setStateSearch}
// // // //                         autoFocus
// // // //                       />
// // // //                     </View>
// // // //                     <ScrollView style={styles.dropdownList} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
// // // //                       {filteredStates.length === 0 ? (
// // // //                         <Text style={styles.pickerEmptyText}>No states found</Text>
// // // //                       ) : (
// // // //                         filteredStates.map((item) => (
// // // //                           <TouchableOpacity
// // // //                             key={item}
// // // //                             style={[styles.pickerRow, formData.state === item && styles.pickerRowActive]}
// // // //                             onPress={() => handleSelectState(item)}
// // // //                           >
// // // //                             <Text style={[styles.pickerRowText, formData.state === item && styles.pickerRowTextActive]}>
// // // //                               {item}
// // // //                             </Text>
// // // //                             {formData.state === item && (
// // // //                               <Icon name="checkmark" size={18} color="#fc8019" />
// // // //                             )}
// // // //                           </TouchableOpacity>
// // // //                         ))
// // // //                       )}
// // // //                     </ScrollView>
// // // //                   </View>
// // // //                 )}
// // // //               </View>

// // // //               {/* ✅ Pincode with Validation */}
// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // // //                 <TextInput
// // // //                   style={[styles.formInput, pincodeError ? styles.formInputError : null]}
// // // //                   placeholder="Enter 6-digit pincode"
// // // //                   value={formData.pincode}
// // // //                   keyboardType="number-pad"
// // // //                   maxLength={6}
// // // //                   onChangeText={validatePincode}
// // // //                 />
// // // //                 {pincodeError ? (
// // // //                   <Text style={styles.errorText}>{pincodeError}</Text>
// // // //                 ) : null}
// // // //                 <Text style={styles.hintText}>Enter exactly 6 digits (numbers only)</Text>
// // // //               </View>

// // // //               <View style={styles.formGroup}>
// // // //                 <TouchableOpacity
// // // //                   style={styles.defaultCheckbox}
// // // //                   onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
// // // //                 >
// // // //                   <Icon
// // // //                     name={formData.isDefault ? 'checkbox' : 'square-outline'}
// // // //                     size={24}
// // // //                     color="#fc8019"
// // // //                   />
// // // //                   <Text style={styles.defaultCheckboxText}>Set as default address</Text>
// // // //                 </TouchableOpacity>
// // // //               </View>

// // // //               {formData.latitude !== 0 && (
// // // //                 <View style={styles.locationDetected}>
// // // //                   <Icon name="checkmark-circle" size={16} color="#28a745" />
// // // //                   <Text style={styles.locationDetectedText}>
// // // //                     Location detected ✓
// // // //                   </Text>
// // // //                 </View>
// // // //               )}

// // // //               <TouchableOpacity
// // // //                 style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
// // // //                 onPress={handleAddAddress}
// // // //                 disabled={isLoading}
// // // //               >
// // // //                 {isLoading ? (
// // // //                   <ActivityIndicator size="small" color="#ffffff" />
// // // //                 ) : (
// // // //                   <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
// // // //                 )}
// // // //               </TouchableOpacity>
// // // //             </ScrollView>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#f5f5f5',
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 14,
// // // //     backgroundColor: '#ffffff',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f0',
// // // //     elevation: 2,
// // // //   },
// // // //   backButton: {
// // // //     padding: 4,
// // // //   },
// // // //   headerTitle: {
// // // //     flex: 1,
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     textAlign: 'center',
// // // //   },
// // // //   addButton: {
// // // //     padding: 4,
// // // //   },
// // // //   locationButton: {
// // // //     backgroundColor: '#ffffff',
// // // //     margin: 16,
// // // //     padding: 14,
// // // //     borderRadius: 12,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: '#fc8019',
// // // //     borderStyle: 'dashed',
// // // //   },
// // // //   locationButtonText: {
// // // //     color: '#fc8019',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     marginLeft: 8,
// // // //   },
// // // //   listHeader: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //   },
// // // //   addressList: {
// // // //     padding: 16,
// // // //     paddingBottom: 120,
// // // //   },
// // // //   addressCard: {
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#e8e8e8',
// // // //   },
// // // //   addressCardSelected: {
// // // //     borderColor: '#fc8019',
// // // //     borderWidth: 2,
// // // //     backgroundColor: '#fff8f0',
// // // //   },
// // // //   addressHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //     flexWrap: 'wrap',
// // // //   },
// // // //   addressTypeContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginRight: 8,
// // // //   },
// // // //   addressTypeText: {
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //     color: '#757575',
// // // //     marginLeft: 4,
// // // //   },
// // // //   defaultBadge: {
// // // //     backgroundColor: '#4CAF50',
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 2,
// // // //     borderRadius: 4,
// // // //     marginRight: 8,
// // // //   },
// // // //   defaultBadgeText: {
// // // //     fontSize: 10,
// // // //     color: '#ffffff',
// // // //     fontWeight: '600',
// // // //   },
// // // //   selectedIcon: {
// // // //     position: 'absolute',
// // // //     right: 0,
// // // //     top: 0,
// // // //   },
// // // //   addressDetail: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     marginBottom: 2,
// // // //   },
// // // //   addressPhone: {
// // // //     fontSize: 14,
// // // //     color: '#757575',
// // // //     marginBottom: 2,
// // // //   },
// // // //   locationTag: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 4,
// // // //   },
// // // //   locationTagText: {
// // // //     fontSize: 11,
// // // //     color: '#28a745',
// // // //     marginLeft: 4,
// // // //   },
// // // //   emptyContainer: {
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingVertical: 80,
// // // //   },
// // // //   emptyText: {
// // // //     fontSize: 18,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //     marginTop: 16,
// // // //   },
// // // //   emptySubText: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginTop: 8,
// // // //     marginBottom: 24,
// // // //   },
// // // //   bottomBar: {
// // // //     position: 'absolute',
// // // //     bottom: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     backgroundColor: '#ffffff',
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#f0f0f0',
// // // //     elevation: 4,
// // // //   },
// // // //   bottomBarLeft: {
// // // //     flexDirection: 'column',
// // // //   },
// // // //   bottomBarTotal: {
// // // //     fontSize: 20,
// // // //     fontWeight: '700',
// // // //     color: '#282c3f',
// // // //   },
// // // //   bottomBarItems: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //   },
// // // //   deliverButton: {
// // // //     backgroundColor: '#fc8019',
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 20,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 8,
// // // //   },
// // // //   deliverButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     marginRight: 8,
// // // //   },
// // // //   modalContainer: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     justifyContent: 'flex-end',
// // // //   },
// // // //   modalContent: {
// // // //     backgroundColor: '#ffffff',
// // // //     borderTopLeftRadius: 20,
// // // //     borderTopRightRadius: 20,
// // // //     padding: 20,
// // // //     maxHeight: '90%',
// // // //   },
// // // //   pickerModalContent: {
// // // //     backgroundColor: '#ffffff',
// // // //     borderTopLeftRadius: 20,
// // // //     borderTopRightRadius: 20,
// // // //     padding: 20,
// // // //     maxHeight: '80%',
// // // //   },
// // // //   modalHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 20,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f0',
// // // //     paddingBottom: 12,
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: 20,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   dropdownTriggerRow: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   dropdownPanel: {
// // // //     marginTop: 6,
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 8,
// // // //     backgroundColor: '#ffffff',
// // // //     padding: 8,
// // // //     elevation: 3,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //   },
// // // //   dropdownList: {
// // // //     maxHeight: 220,
// // // //   },
// // // //   pickerRowActive: {
// // // //     backgroundColor: '#fff8f0',
// // // //   },
// // // //   pickerRowTextActive: {
// // // //     color: '#fc8019',
// // // //     fontWeight: '600',
// // // //   },
// // // //   searchBox: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fafafa',
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 8,
// // // //     paddingHorizontal: 12,
// // // //     marginBottom: 12,
// // // //   },
// // // //   searchInput: {
// // // //     flex: 1,
// // // //     paddingVertical: 10,
// // // //     paddingHorizontal: 8,
// // // //     fontSize: 14,
// // // //   },
// // // //   pickerRow: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingVertical: 14,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f0',
// // // //   },
// // // //   pickerRowText: {
// // // //     fontSize: 15,
// // // //     color: '#282c3f',
// // // //   },
// // // //   pickerEmptyText: {
// // // //     textAlign: 'center',
// // // //     color: '#7e808c',
// // // //     paddingVertical: 24,
// // // //     fontSize: 14,
// // // //   },
// // // //   dropdownValueText: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //   },
// // // //   dropdownPlaceholderText: {
// // // //     fontSize: 14,
// // // //     color: '#9e9e9e',
// // // //   },
// // // //   formGroup: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   formRow: {
// // // //     flexDirection: 'row',
// // // //   },
// // // //   formLabel: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //     marginBottom: 6,
// // // //   },
// // // //   formInput: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 8,
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 10,
// // // //     fontSize: 14,
// // // //     backgroundColor: '#fafafa',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   formInputError: {
// // // //     borderColor: '#dc3545',
// // // //     borderWidth: 2,
// // // //   },
// // // //   formInputMultiline: {
// // // //     height: 80,
// // // //     textAlignVertical: 'top',
// // // //   },
// // // //   errorText: {
// // // //     color: '#dc3545',
// // // //     fontSize: 12,
// // // //     marginTop: 4,
// // // //   },
// // // //   hintText: {
// // // //     color: '#7e808c',
// // // //     fontSize: 11,
// // // //     marginTop: 2,
// // // //   },
// // // //   addressTypeButtons: {
// // // //     flexDirection: 'row',
// // // //     gap: 8,
// // // //   },
// // // //   addressTypeButton: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 8,
// // // //     paddingVertical: 10,
// // // //     gap: 6,
// // // //   },
// // // //   addressTypeButtonActive: {
// // // //     borderColor: '#fc8019',
// // // //     backgroundColor: '#fff8f0',
// // // //   },
// // // //   addressTypeButtonText: {
// // // //     fontSize: 14,
// // // //     color: '#757575',
// // // //   },
// // // //   addressTypeButtonTextActive: {
// // // //     color: '#fc8019',
// // // //     fontWeight: '600',
// // // //   },
// // // //   defaultCheckbox: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 4,
// // // //   },
// // // //   defaultCheckboxText: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     marginLeft: 8,
// // // //   },
// // // //   locationDetected: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#e8f5e9',
// // // //     padding: 10,
// // // //     borderRadius: 8,
// // // //     marginBottom: 16,
// // // //   },
// // // //   locationDetectedText: {
// // // //     fontSize: 13,
// // // //     color: '#28a745',
// // // //     marginLeft: 8,
// // // //     flex: 1,
// // // //   },
// // // //   submitButton: {
// // // //     backgroundColor: '#fc8019',
// // // //     paddingVertical: 14,
// // // //     borderRadius: 8,
// // // //     alignItems: 'center',
// // // //     marginTop: 10,
// // // //     marginBottom: 20,
// // // //   },
// // // //   submitButtonDisabled: {
// // // //     backgroundColor: '#ccc',
// // // //   },
// // // //   submitButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // // });

// // // // export default AddressSelectionScreen;
// // // import React, { useState, useContext, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   FlatList,
// // //   TouchableOpacity,
// // //   Alert,
// // //   Modal,
// // //   TextInput,
// // //   ScrollView,
// // //   ActivityIndicator,
// // //   Platform,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { AddressContext, Address } from '../../context/AddressContext';
// // // import { CartContext } from '../../context/CartContext';
// // // import { AuthContext } from '../../context/AuthContext';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // const API_BASE_URL = 'http://localhost:3000'; // Change to your actual API URL (LAN IP for device testing)
// // // let authToken: string | null = null;

// // // // ✅ DYNAMIC API KEY — no hardcoded fallback, load only from env
// // // let GOOGLE_MAPS_API_KEY = '';
// // // try {
// // //   const env = require('@env');
// // //   GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
// // // } catch (e) {
// // //   GOOGLE_MAPS_API_KEY = '';
// // // }

// // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// // // // ✅ Indian States & Union Territories
// // // const INDIAN_STATES = [
// // //   'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
// // //   'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
// // //   'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
// // //   'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
// // //   'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
// // //   'Andaman and Nicobar Islands', 'Chandigarh',
// // //   'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
// // //   'Ladakh', 'Lakshadweep', 'Puducherry',
// // // ];

// // // // ✅ Major Indian Cities (grouped by state so the City dropdown can be
// // // // filtered once a State is chosen; falls back to full list if no state set)
// // // const CITIES_BY_STATE: { [key: string]: string[] } = {
// // //   'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
// // //   'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
// // //   'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
// // //   'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
// // //   'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Durg'],
// // //   'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
// // //   'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
// // //   'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
// // //   'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
// // //   'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
// // //   'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
// // //   'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
// // //   'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
// // //   'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
// // //   'Manipur': ['Imphal'],
// // //   'Meghalaya': ['Shillong'],
// // //   'Mizoram': ['Aizawl'],
// // //   'Nagaland': ['Kohima', 'Dimapur'],
// // //   'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
// // //   'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
// // //   'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
// // //   'Sikkim': ['Gangtok'],
// // //   'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
// // //   'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
// // //   'Tripura': ['Agartala'],
// // //   'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Noida', 'Varanasi'],
// // //   'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital'],
// // //   'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
// // //   'Andaman and Nicobar Islands': ['Port Blair'],
// // //   'Chandigarh': ['Chandigarh'],
// // //   'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Silvassa'],
// // //   'Delhi': ['New Delhi', 'Delhi'],
// // //   'Jammu and Kashmir': ['Srinagar', 'Jammu'],
// // //   'Ladakh': ['Leh', 'Kargil'],
// // //   'Lakshadweep': ['Kavaratti'],
// // //   'Puducherry': ['Puducherry'],
// // // };

// // // // Flat list of every city (used when no state has been picked yet)
// // // const ALL_CITIES = Array.from(
// // //   new Set(Object.values(CITIES_BY_STATE).flat())
// // // ).sort();

// // // interface AddressSelectionScreenProps {
// // //   navigation: any;
// // //   route: any;
// // // }

// // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);
// // //   const { user, updateUser } = useContext(AuthContext);

// // //   useEffect(() => {
// // //     const loadToken = async () => {
// // //       const token = await AsyncStorage.getItem('authToken');
// // //       if (token) {
// // //         authToken = token;
// // //       }
// // //     };
// // //     loadToken();
// // //   }, []);

// // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [gettingLocation, setGettingLocation] = useState(false);
// // //   const [locationError, setLocationError] = useState<string>('');

// // //   // ✅ Validation error states
// // //   const [phoneError, setPhoneError] = useState<string>('');
// // //   const [pincodeError, setPincodeError] = useState<string>('');

// // //   // ✅ City / State inline dropdowns (expand directly under the field,
// // //   // in the same page — like a native <select> — no modal/screen swap).
// // //   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// // //   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
// // //   const [citySearch, setCitySearch] = useState('');
// // //   const [stateSearch, setStateSearch] = useState('');

// // //   const [formData, setFormData] = useState({
// // //     type: 'Home' as 'Home' | 'Work' | 'Other',
// // //     address: '',
// // //     city: '',
// // //     state: '',
// // //     pincode: '',
// // //     landmark: '',
// // //     phone: '',
// // //     isDefault: false,
// // //     latitude: 0,
// // //     longitude: 0,
// // //   });

// // //   const totalPrice = getTotalPrice() || totalAmount;
// // //   const totalItems = getTotalItems();

// // //   // ✅ City list depends on the selected state (falls back to full list)
// // //   const cityOptions = formData.state && CITIES_BY_STATE[formData.state]
// // //     ? CITIES_BY_STATE[formData.state]
// // //     : ALL_CITIES;

// // //   const filteredStates = INDIAN_STATES.filter((s) =>
// // //     s.toLowerCase().includes(stateSearch.toLowerCase())
// // //   );

// // //   const filteredCities = cityOptions.filter((c) =>
// // //     c.toLowerCase().includes(citySearch.toLowerCase())
// // //   );

// // //   const handleSelectState = (state: string) => {
// // //     // Reset city if it doesn't belong to the newly picked state
// // //     const stillValid = CITIES_BY_STATE[state]?.includes(formData.city);
// // //     setFormData({
// // //       ...formData,
// // //       state,
// // //       city: stillValid ? formData.city : '',
// // //     });
// // //     setStateSearch('');
// // //     setStateDropdownOpen(false);
// // //   };

// // //   const handleSelectCity = (city: string) => {
// // //     setFormData({ ...formData, city });
// // //     setCitySearch('');
// // //     setCityDropdownOpen(false);
// // //   };

// // //   // ✅ Phone number validation - only numbers and exactly 10 digits
// // //   const validatePhoneNumber = (text: string) => {
// // //     const cleaned = text.replace(/[^0-9]/g, '');
// // //     const limited = cleaned.slice(0, 10);
// // //     setFormData({ ...formData, phone: limited });

// // //     if (limited.length > 0 && limited.length !== 10) {
// // //       setPhoneError('Phone number must be exactly 10 digits');
// // //     } else {
// // //       setPhoneError('');
// // //     }
// // //   };

// // //   // ✅ Pincode validation - only numbers and exactly 6 digits
// // //   const validatePincode = (text: string) => {
// // //     const cleaned = text.replace(/[^0-9]/g, '');
// // //     const limited = cleaned.slice(0, 6);
// // //     setFormData({ ...formData, pincode: limited });

// // //     if (limited.length > 0 && limited.length !== 6) {
// // //       setPincodeError('Pincode must be exactly 6 digits');
// // //     } else {
// // //       setPincodeError('');
// // //     }
// // //   };

// // //   // ✅ Get current location
// // //   const getCurrentLocationWeb = () => {
// // //     setLocationError('');

// // //     if (!navigator.geolocation) {
// // //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// // //       return;
// // //     }

// // //     if (!GOOGLE_MAPS_API_KEY) {
// // //       Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
// // //       return;
// // //     }

// // //     console.log('📍 Getting location...');
// // //     setGettingLocation(true);

// // //     navigator.geolocation.getCurrentPosition(
// // //       async (position) => {
// // //         const { latitude, longitude } = position.coords;
// // //         console.log('📍 Location found:', latitude, longitude);

// // //         try {
// // //           const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
// // //           console.log('🔗 Fetching:', url);

// // //           const response = await fetch(url);
// // //           const data = await response.json();

// // //           console.log('📦 Response status:', data.status);

// // //           if (data.status === 'OK' && data.results && data.results.length > 0) {
// // //             const result = data.results[0];
// // //             let city = '';
// // //             let state = '';
// // //             let pincode = '';
// // //             let formattedAddress = result.formatted_address || '';

// // //             if (result.address_components) {
// // //               result.address_components.forEach((component: any) => {
// // //                 if (component.types.includes('locality') || component.types.includes('sublocality')) {
// // //                   city = component.long_name;
// // //                 }
// // //                 if (component.types.includes('administrative_area_level_1')) {
// // //                   state = component.long_name;
// // //                 }
// // //                 if (component.types.includes('postal_code')) {
// // //                   pincode = component.long_name;
// // //                 }
// // //               });
// // //             }

// // //             setGettingLocation(false);
// // //             setFormData({
// // //               ...formData,
// // //               address: formattedAddress,
// // //               city: city,
// // //               state: state,
// // //               pincode: pincode,
// // //               latitude,
// // //               longitude,
// // //             });

// // //             Alert.alert(
// // //               '📍 Location Found!',
// // //               `Address: ${formattedAddress}`,
// // //               [{ text: 'OK' }]
// // //             );
// // //           } else {
// // //             setGettingLocation(false);
// // //             Alert.alert(
// // //               '📍 Location Found',
// // //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // //               [{ text: 'OK' }]
// // //             );
// // //             setFormData({ ...formData, latitude, longitude });
// // //           }
// // //         } catch (error) {
// // //           console.error('❌ Error:', error);
// // //           setGettingLocation(false);
// // //           Alert.alert(
// // //             '📍 Location Found',
// // //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// // //             [{ text: 'OK' }]
// // //           );
// // //           setFormData({ ...formData, latitude, longitude });
// // //         }
// // //       },
// // //       (error) => {
// // //         console.error('❌ Location error:', error);
// // //         setGettingLocation(false);

// // //         let message = 'Unable to get your location. Please enter manually.';
// // //         if (error.message) {
// // //           message = error.message;
// // //         }

// // //         setLocationError(message);
// // //         Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
// // //       },
// // //       {
// // //         enableHighAccuracy: true,
// // //         timeout: 30000,
// // //         maximumAge: 10000
// // //       }
// // //     );
// // //   };

// // //   const requestLocationPermission = () => {
// // //     if (Platform.OS === 'web') {
// // //       getCurrentLocationWeb();
// // //     } else {
// // //       Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
// // //     }
// // //   };

// // //   const getAddressTypeIcon = (type: string) => {
// // //     switch (type) {
// // //       case 'Home': return 'home-outline';
// // //       case 'Work': return 'briefcase-outline';
// // //       case 'Other': return 'location-outline';
// // //       default: return 'location-outline';
// // //     }
// // //   };

// // //   const getAddressTypeColor = (type: string) => {
// // //     switch (type) {
// // //       case 'Home': return '#4CAF50';
// // //       case 'Work': return '#2196F3';
// // //       case 'Other': return '#FF9800';
// // //       default: return '#757575';
// // //     }
// // //   };

// // //   // ✅ FIX #1: restored — this was referenced by the JSX below but was
// // //   // commented out, which caused a "handleSelectAddress is not defined"
// // //   // crash the moment a user tapped a saved address or the deliver button.
// // //   const handleSelectAddress = (address: Address) => {
// // //     setSelectedAddress(address);

// // //     navigation.navigate('PaymentScreen', {
// // //       address: address,
// // //       totalAmount: totalPrice,
// // //       restaurantName: restaurantName,
// // //       cartItems: cartItems,
// // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // //     });
// // //   };

// // //   // ✅ FIX #2: no more duplicate PUT request.
// // //   // Previously this function did a manual fetch() to PUT /customers/:id
// // //   // AND THEN called updateUser(), which internally does its OWN
// // //   // PUT /customers/:id — so every "Save Address" tap fired two identical
// // //   // requests to the backend. Now there is a single source of truth:
// // //   // updateUser() from AuthContext handles the API call, token, and
// // //   // local/AsyncStorage sync in one place.
// // //   const handleAddAddress = async () => {
// // //     // Validate required fields
// // //     if (!formData.address || !formData.city || !formData.pincode) {
// // //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// // //       return;
// // //     }

// // //     // ✅ Validate pincode
// // //     if (formData.pincode.length !== 6) {
// // //       setPincodeError('Pincode must be exactly 6 digits');
// // //       Alert.alert('⚠️ Error', 'Pincode must be exactly 6 digits');
// // //       return;
// // //     }

// // //     // ✅ Validate phone if provided
// // //     if (formData.phone && formData.phone.length !== 10) {
// // //       setPhoneError('Phone number must be exactly 10 digits');
// // //       Alert.alert('⚠️ Error', 'Phone number must be exactly 10 digits');
// // //       return;
// // //     }

// // //     // Clear any previous errors
// // //     setPhoneError('');
// // //     setPincodeError('');

// // //     if (!user?.id) {
// // //       Alert.alert('⚠️ Error', 'User not found. Please login again.');
// // //       return;
// // //     }

// // //     setIsLoading(true);

// // //     try {
// // //       const fullAddress = `${formData.address}, ${formData.city}, ${formData.state || ''} - ${formData.pincode}`;

// // //       // Single API call — updates DB, local user state, and AsyncStorage.
// // //       const ok = await updateUser({ address: fullAddress });

// // //       if (!ok) {
// // //         Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
// // //         setIsLoading(false);
// // //         return;
// // //       }

// // //       console.log('✅ Address updated successfully');

// // //       // Save to local address context (used to show saved-address cards)
// // //       const newAddress: Address = {
// // //         id: `addr_${Date.now()}`,
// // //         type: formData.type,
// // //         address: formData.address,
// // //         city: formData.city,
// // //         state: formData.state || '',
// // //         pincode: formData.pincode,
// // //         landmark: formData.landmark || '',
// // //         phone: formData.phone || '',
// // //         isDefault: addresses.length === 0 || formData.isDefault,
// // //         latitude: formData.latitude || undefined,
// // //         longitude: formData.longitude || undefined,
// // //       };

// // //       addAddress(newAddress);

// // //       setIsLoading(false);
// // //       setShowAddAddressModal(false);
// // //       resetForm();
// // //       setSelectedAddress(newAddress);

// // //       // Navigate to PaymentScreen
// // //       navigation.navigate('PaymentScreen', {
// // //         address: newAddress,
// // //         totalAmount: totalPrice,
// // //         restaurantName: restaurantName,
// // //         cartItems: cartItems,
// // //         orderId: 'ORD-' + Date.now().toString().slice(-6),
// // //       });

// // //     } catch (error: any) {
// // //       console.error('❌ Error saving address:', error);
// // //       Alert.alert('❌ Error', error.message || 'Failed to save address. Please try again.');
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     setFormData({
// // //       type: 'Home',
// // //       address: '',
// // //       city: '',
// // //       state: '',
// // //       pincode: '',
// // //       landmark: '',
// // //       phone: '',
// // //       isDefault: false,
// // //       latitude: 0,
// // //       longitude: 0,
// // //     });
// // //     setPhoneError('');
// // //     setPincodeError('');
// // //     setCitySearch('');
// // //     setStateSearch('');
// // //     setCityDropdownOpen(false);
// // //     setStateDropdownOpen(false);
// // //   };

// // //   const renderAddressItem = ({ item }: { item: Address }) => {
// // //     const isSelected = selectedAddress?.id === item.id;

// // //     return (
// // //       <TouchableOpacity
// // //         key={item.id}
// // //         style={[styles.addressCard, isSelected && styles.addressCardSelected]}
// // //         onPress={() => handleSelectAddress(item)}
// // //         activeOpacity={0.7}
// // //       >
// // //         <View style={styles.addressHeader}>
// // //           <View style={styles.addressTypeContainer}>
// // //             <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
// // //             <Text style={styles.addressTypeText}>{item.type}</Text>
// // //           </View>
// // //           {item.isDefault && (
// // //             <View style={styles.defaultBadge}>
// // //               <Text style={styles.defaultBadgeText}>Default</Text>
// // //             </View>
// // //           )}
// // //           {isSelected && (
// // //             <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
// // //           )}
// // //         </View>

// // //         <Text style={styles.addressDetail}>{item.address}</Text>
// // //         {item.landmark && (
// // //           <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
// // //         )}
// // //         {item.phone && (
// // //           <Text style={styles.addressPhone}>📞 {item.phone}</Text>
// // //         )}
// // //         <Text style={styles.addressDetail}>
// // //           {item.city}, {item.state || ''} - {item.pincode}
// // //         </Text>
// // //         {item.latitude && item.longitude && (
// // //           <View style={styles.locationTag}>
// // //             <Icon name="location-outline" size={12} color="#28a745" />
// // //             <Text style={styles.locationTagText}>Live location</Text>
// // //           </View>
// // //         )}
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>Delivery Address</Text>
// // //         <TouchableOpacity
// // //           style={styles.addButton}
// // //           onPress={() => setShowAddAddressModal(true)}
// // //         >
// // //           <Icon name="add-circle-outline" size={28} color="#fc8019" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       <TouchableOpacity
// // //         style={styles.locationButton}
// // //         onPress={requestLocationPermission}
// // //         disabled={gettingLocation}
// // //       >
// // //         {gettingLocation ? (
// // //           <ActivityIndicator size="small" color="#fc8019" />
// // //         ) : (
// // //           <>
// // //             <Icon name="locate-outline" size={22} color="#fc8019" />
// // //             <Text style={styles.locationButtonText}>Use Current Location</Text>
// // //           </>
// // //         )}
// // //       </TouchableOpacity>

// // //       <FlatList
// // //         data={addresses}
// // //         renderItem={renderAddressItem}
// // //         keyExtractor={(item) => item.id}
// // //         contentContainerStyle={styles.addressList}
// // //         showsVerticalScrollIndicator={false}
// // //         ListHeaderComponent={
// // //           addresses.length > 0 ? (
// // //             <Text style={styles.listHeader}>Saved Addresses</Text>
// // //           ) : null
// // //         }
// // //         ListEmptyComponent={
// // //           <View style={styles.emptyContainer}>
// // //             <Icon name="location-outline" size={60} color="#ccc" />
// // //             <Text style={styles.emptyText}>No Addresses Saved</Text>
// // //             <Text style={styles.emptySubText}>Add a new address</Text>
// // //           </View>
// // //         }
// // //       />

// // //       {selectedAddress && (
// // //         <View style={styles.bottomBar}>
// // //           <View style={styles.bottomBarLeft}>
// // //             <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>
// // //             <Text style={styles.bottomBarItems}>{totalItems} items</Text>
// // //           </View>
// // //           <TouchableOpacity
// // //             style={styles.deliverButton}
// // //             onPress={() => handleSelectAddress(selectedAddress)}
// // //           >
// // //             <Text style={styles.deliverButtonText}>
// // //               Deliver to {selectedAddress.type}
// // //             </Text>
// // //             <Icon name="arrow-forward" size={18} color="#ffffff" />
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //       <Modal
// // //         visible={showAddAddressModal}
// // //         animationType="slide"
// // //         transparent={true}
// // //       >
// // //         <View style={styles.modalContainer}>
// // //           <View style={styles.modalContent}>
// // //             <View style={styles.modalHeader}>
// // //               <Text style={styles.modalTitle}>Add New Address</Text>
// // //               <TouchableOpacity onPress={() => {
// // //                 setShowAddAddressModal(false);
// // //                 resetForm();
// // //               }}>
// // //                 <Icon name="close" size={24} color="#282c3f" />
// // //               </TouchableOpacity>
// // //             </View>

// // //             <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>Address Type</Text>
// // //                 <View style={styles.addressTypeButtons}>
// // //                   {['Home', 'Work', 'Other'].map((type) => (
// // //                     <TouchableOpacity
// // //                       key={type}
// // //                       style={[
// // //                         styles.addressTypeButton,
// // //                         formData.type === type && styles.addressTypeButtonActive
// // //                       ]}
// // //                       onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
// // //                     >
// // //                       <Icon
// // //                         name={getAddressTypeIcon(type)}
// // //                         size={18}
// // //                         color={formData.type === type ? '#fc8019' : '#757575'}
// // //                       />
// // //                       <Text
// // //                         style={[
// // //                           styles.addressTypeButtonText,
// // //                           formData.type === type && styles.addressTypeButtonTextActive
// // //                         ]}
// // //                       >
// // //                         {type}
// // //                       </Text>
// // //                     </TouchableOpacity>
// // //                   ))}
// // //                 </View>
// // //               </View>

// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>Address *</Text>
// // //                 <TextInput
// // //                   style={[styles.formInput, styles.formInputMultiline]}
// // //                   placeholder="Enter your address"
// // //                   value={formData.address}
// // //                   multiline
// // //                   numberOfLines={3}
// // //                   onChangeText={(text) => setFormData({ ...formData, address: text })}
// // //                 />
// // //               </View>

// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>Landmark</Text>
// // //                 <TextInput
// // //                   style={styles.formInput}
// // //                   placeholder="Nearby landmark (optional)"
// // //                   value={formData.landmark}
// // //                   onChangeText={(text) => setFormData({ ...formData, landmark: text })}
// // //                 />
// // //               </View>

// // //               {/* ✅ Phone Number with Validation */}
// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // //                 <TextInput
// // //                   style={[styles.formInput, phoneError ? styles.formInputError : null]}
// // //                   placeholder="Enter 10-digit phone number"
// // //                   value={formData.phone}
// // //                   keyboardType="number-pad"
// // //                   maxLength={10}
// // //                   onChangeText={validatePhoneNumber}
// // //                 />
// // //                 {phoneError ? (
// // //                   <Text style={styles.errorText}>{phoneError}</Text>
// // //                 ) : null}
// // //                 <Text style={styles.hintText}>Enter exactly 10 digits (numbers only)</Text>
// // //               </View>

// // //               {/* ✅ City & State — inline expanding dropdowns (like a native <select>) */}
// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>City *</Text>
// // //                 <TouchableOpacity
// // //                   style={styles.formInput}
// // //                   onPress={() => {
// // //                     setCityDropdownOpen(!cityDropdownOpen);
// // //                     setStateDropdownOpen(false);
// // //                   }}
// // //                 >
// // //                   <View style={styles.dropdownTriggerRow}>
// // //                     <Text style={formData.city ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
// // //                       {formData.city || 'Select City'}
// // //                     </Text>
// // //                     <Icon name={cityDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#757575" />
// // //                   </View>
// // //                 </TouchableOpacity>

// // //                 {cityDropdownOpen && (
// // //                   <View style={styles.dropdownPanel}>
// // //                     <View style={styles.searchBox}>
// // //                       <Icon name="search-outline" size={18} color="#7e808c" />
// // //                       <TextInput
// // //                         style={styles.searchInput}
// // //                         placeholder="Search city"
// // //                         value={citySearch}
// // //                         onChangeText={setCitySearch}
// // //                         autoFocus
// // //                       />
// // //                     </View>
// // //                     <ScrollView style={styles.dropdownList} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
// // //                       {filteredCities.length === 0 ? (
// // //                         <Text style={styles.pickerEmptyText}>No cities found</Text>
// // //                       ) : (
// // //                         filteredCities.map((item) => (
// // //                           <TouchableOpacity
// // //                             key={item}
// // //                             style={[styles.pickerRow, formData.city === item && styles.pickerRowActive]}
// // //                             onPress={() => handleSelectCity(item)}
// // //                           >
// // //                             <Text style={[styles.pickerRowText, formData.city === item && styles.pickerRowTextActive]}>
// // //                               {item}
// // //                             </Text>
// // //                             {formData.city === item && (
// // //                               <Icon name="checkmark" size={18} color="#fc8019" />
// // //                             )}
// // //                           </TouchableOpacity>
// // //                         ))
// // //                       )}
// // //                     </ScrollView>
// // //                   </View>
// // //                 )}
// // //               </View>

// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>State</Text>
// // //                 <TouchableOpacity
// // //                   style={styles.formInput}
// // //                   onPress={() => {
// // //                     setStateDropdownOpen(!stateDropdownOpen);
// // //                     setCityDropdownOpen(false);
// // //                   }}
// // //                 >
// // //                   <View style={styles.dropdownTriggerRow}>
// // //                     <Text style={formData.state ? styles.dropdownValueText : styles.dropdownPlaceholderText}>
// // //                       {formData.state || 'Select State'}
// // //                     </Text>
// // //                     <Icon name={stateDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#757575" />
// // //                   </View>
// // //                 </TouchableOpacity>

// // //                 {stateDropdownOpen && (
// // //                   <View style={styles.dropdownPanel}>
// // //                     <View style={styles.searchBox}>
// // //                       <Icon name="search-outline" size={18} color="#7e808c" />
// // //                       <TextInput
// // //                         style={styles.searchInput}
// // //                         placeholder="Search state"
// // //                         value={stateSearch}
// // //                         onChangeText={setStateSearch}
// // //                         autoFocus
// // //                       />
// // //                     </View>
// // //                     <ScrollView style={styles.dropdownList} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
// // //                       {filteredStates.length === 0 ? (
// // //                         <Text style={styles.pickerEmptyText}>No states found</Text>
// // //                       ) : (
// // //                         filteredStates.map((item) => (
// // //                           <TouchableOpacity
// // //                             key={item}
// // //                             style={[styles.pickerRow, formData.state === item && styles.pickerRowActive]}
// // //                             onPress={() => handleSelectState(item)}
// // //                           >
// // //                             <Text style={[styles.pickerRowText, formData.state === item && styles.pickerRowTextActive]}>
// // //                               {item}
// // //                             </Text>
// // //                             {formData.state === item && (
// // //                               <Icon name="checkmark" size={18} color="#fc8019" />
// // //                             )}
// // //                           </TouchableOpacity>
// // //                         ))
// // //                       )}
// // //                     </ScrollView>
// // //                   </View>
// // //                 )}
// // //               </View>

// // //               {/* ✅ Pincode with Validation */}
// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // //                 <TextInput
// // //                   style={[styles.formInput, pincodeError ? styles.formInputError : null]}
// // //                   placeholder="Enter 6-digit pincode"
// // //                   value={formData.pincode}
// // //                   keyboardType="number-pad"
// // //                   maxLength={6}
// // //                   onChangeText={validatePincode}
// // //                 />
// // //                 {pincodeError ? (
// // //                   <Text style={styles.errorText}>{pincodeError}</Text>
// // //                 ) : null}
// // //                 <Text style={styles.hintText}>Enter exactly 6 digits (numbers only)</Text>
// // //               </View>

// // //               <View style={styles.formGroup}>
// // //                 <TouchableOpacity
// // //                   style={styles.defaultCheckbox}
// // //                   onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
// // //                 >
// // //                   <Icon
// // //                     name={formData.isDefault ? 'checkbox' : 'square-outline'}
// // //                     size={24}
// // //                     color="#fc8019"
// // //                   />
// // //                   <Text style={styles.defaultCheckboxText}>Set as default address</Text>
// // //                 </TouchableOpacity>
// // //               </View>

// // //               {formData.latitude !== 0 && (
// // //                 <View style={styles.locationDetected}>
// // //                   <Icon name="checkmark-circle" size={16} color="#28a745" />
// // //                   <Text style={styles.locationDetectedText}>
// // //                     Location detected ✓
// // //                   </Text>
// // //                 </View>
// // //               )}

// // //               <TouchableOpacity
// // //                 style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
// // //                 onPress={handleAddAddress}
// // //                 disabled={isLoading}
// // //               >
// // //                 {isLoading ? (
// // //                   <ActivityIndicator size="small" color="#ffffff" />
// // //                 ) : (
// // //                   <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
// // //                 )}
// // //               </TouchableOpacity>
// // //             </ScrollView>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f5f5f5',
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 14,
// // //     backgroundColor: '#ffffff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f0',
// // //     elevation: 2,
// // //   },
// // //   backButton: {
// // //     padding: 4,
// // //   },
// // //   headerTitle: {
// // //     flex: 1,
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     textAlign: 'center',
// // //   },
// // //   addButton: {
// // //     padding: 4,
// // //   },
// // //   locationButton: {
// // //     backgroundColor: '#ffffff',
// // //     margin: 16,
// // //     padding: 14,
// // //     borderRadius: 12,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#fc8019',
// // //     borderStyle: 'dashed',
// // //   },
// // //   locationButtonText: {
// // //     color: '#fc8019',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginLeft: 8,
// // //   },
// // //   listHeader: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   addressList: {
// // //     padding: 16,
// // //     paddingBottom: 120,
// // //   },
// // //   addressCard: {
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#e8e8e8',
// // //   },
// // //   addressCardSelected: {
// // //     borderColor: '#fc8019',
// // //     borderWidth: 2,
// // //     backgroundColor: '#fff8f0',
// // //   },
// // //   addressHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //     flexWrap: 'wrap',
// // //   },
// // //   addressTypeContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginRight: 8,
// // //   },
// // //   addressTypeText: {
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     color: '#757575',
// // //     marginLeft: 4,
// // //   },
// // //   defaultBadge: {
// // //     backgroundColor: '#4CAF50',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 2,
// // //     borderRadius: 4,
// // //     marginRight: 8,
// // //   },
// // //   defaultBadgeText: {
// // //     fontSize: 10,
// // //     color: '#ffffff',
// // //     fontWeight: '600',
// // //   },
// // //   selectedIcon: {
// // //     position: 'absolute',
// // //     right: 0,
// // //     top: 0,
// // //   },
// // //   addressDetail: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     marginBottom: 2,
// // //   },
// // //   addressPhone: {
// // //     fontSize: 14,
// // //     color: '#757575',
// // //     marginBottom: 2,
// // //   },
// // //   locationTag: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 4,
// // //   },
// // //   locationTagText: {
// // //     fontSize: 11,
// // //     color: '#28a745',
// // //     marginLeft: 4,
// // //   },
// // //   emptyContainer: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 80,
// // //   },
// // //   emptyText: {
// // //     fontSize: 18,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //     marginTop: 16,
// // //   },
// // //   emptySubText: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginTop: 8,
// // //     marginBottom: 24,
// // //   },
// // //   bottomBar: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     right: 0,
// // //     backgroundColor: '#ffffff',
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#f0f0f0',
// // //     elevation: 4,
// // //   },
// // //   bottomBarLeft: {
// // //     flexDirection: 'column',
// // //   },
// // //   bottomBarTotal: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: '#282c3f',
// // //   },
// // //   bottomBarItems: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //   },
// // //   deliverButton: {
// // //     backgroundColor: '#fc8019',
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //   },
// // //   deliverButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginRight: 8,
// // //   },
// // //   modalContainer: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'flex-end',
// // //   },
// // //   modalContent: {
// // //     backgroundColor: '#ffffff',
// // //     borderTopLeftRadius: 20,
// // //     borderTopRightRadius: 20,
// // //     padding: 20,
// // //     maxHeight: '90%',
// // //   },
// // //   pickerModalContent: {
// // //     backgroundColor: '#ffffff',
// // //     borderTopLeftRadius: 20,
// // //     borderTopRightRadius: 20,
// // //     padding: 20,
// // //     maxHeight: '80%',
// // //   },
// // //   modalHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f0',
// // //     paddingBottom: 12,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   dropdownTriggerRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //   },
// // //   dropdownPanel: {
// // //     marginTop: 6,
// // //     borderWidth: 1,
// // //     borderColor: '#e0e0e0',
// // //     borderRadius: 8,
// // //     backgroundColor: '#ffffff',
// // //     padding: 8,
// // //     elevation: 3,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //   },
// // //   dropdownList: {
// // //     maxHeight: 220,
// // //   },
// // //   pickerRowActive: {
// // //     backgroundColor: '#fff8f0',
// // //   },
// // //   pickerRowTextActive: {
// // //     color: '#fc8019',
// // //     fontWeight: '600',
// // //   },
// // //   searchBox: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fafafa',
// // //     borderWidth: 1,
// // //     borderColor: '#e0e0e0',
// // //     borderRadius: 8,
// // //     paddingHorizontal: 12,
// // //     marginBottom: 12,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     paddingVertical: 10,
// // //     paddingHorizontal: 8,
// // //     fontSize: 14,
// // //   },
// // //   pickerRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingVertical: 14,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f0',
// // //   },
// // //   pickerRowText: {
// // //     fontSize: 15,
// // //     color: '#282c3f',
// // //   },
// // //   pickerEmptyText: {
// // //     textAlign: 'center',
// // //     color: '#7e808c',
// // //     paddingVertical: 24,
// // //     fontSize: 14,
// // //   },
// // //   dropdownValueText: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //   },
// // //   dropdownPlaceholderText: {
// // //     fontSize: 14,
// // //     color: '#9e9e9e',
// // //   },
// // //   formGroup: {
// // //     marginBottom: 16,
// // //   },
// // //   formRow: {
// // //     flexDirection: 'row',
// // //   },
// // //   formLabel: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //     marginBottom: 6,
// // //   },
// // //   formInput: {
// // //     borderWidth: 1,
// // //     borderColor: '#e0e0e0',
// // //     borderRadius: 8,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 10,
// // //     fontSize: 14,
// // //     backgroundColor: '#fafafa',
// // //     justifyContent: 'center',
// // //   },
// // //   formInputError: {
// // //     borderColor: '#dc3545',
// // //     borderWidth: 2,
// // //   },
// // //   formInputMultiline: {
// // //     height: 80,
// // //     textAlignVertical: 'top',
// // //   },
// // //   errorText: {
// // //     color: '#dc3545',
// // //     fontSize: 12,
// // //     marginTop: 4,
// // //   },
// // //   hintText: {
// // //     color: '#7e808c',
// // //     fontSize: 11,
// // //     marginTop: 2,
// // //   },
// // //   addressTypeButtons: {
// // //     flexDirection: 'row',
// // //     gap: 8,
// // //   },
// // //   addressTypeButton: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#e0e0e0',
// // //     borderRadius: 8,
// // //     paddingVertical: 10,
// // //     gap: 6,
// // //   },
// // //   addressTypeButtonActive: {
// // //     borderColor: '#fc8019',
// // //     backgroundColor: '#fff8f0',
// // //   },
// // //   addressTypeButtonText: {
// // //     fontSize: 14,
// // //     color: '#757575',
// // //   },
// // //   addressTypeButtonTextActive: {
// // //     color: '#fc8019',
// // //     fontWeight: '600',
// // //   },
// // //   defaultCheckbox: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 4,
// // //   },
// // //   defaultCheckboxText: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     marginLeft: 8,
// // //   },
// // //   locationDetected: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#e8f5e9',
// // //     padding: 10,
// // //     borderRadius: 8,
// // //     marginBottom: 16,
// // //   },
// // //   locationDetectedText: {
// // //     fontSize: 13,
// // //     color: '#28a745',
// // //     marginLeft: 8,
// // //     flex: 1,
// // //   },
// // //   submitButton: {
// // //     backgroundColor: '#fc8019',
// // //     paddingVertical: 14,
// // //     borderRadius: 8,
// // //     alignItems: 'center',
// // //     marginTop: 10,
// // //     marginBottom: 20,
// // //   },
// // //   submitButtonDisabled: {
// // //     backgroundColor: '#ccc',
// // //   },
// // //   submitButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // // });

// // // export default AddressSelectionScreen;
// // import React, { useState, useContext, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// //   TouchableOpacity,
// //   Alert,
// //   Modal,
// //   TextInput,
// //   ScrollView,
// //   ActivityIndicator,
// //   Platform,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { AddressContext, Address } from '../../context/AddressContext';
// // import { CartContext } from '../../context/CartContext';
// // import { AuthContext } from '../../context/AuthContext';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import * as Location from 'expo-location';

// // const API_BASE_URL = 'http://localhost:3000'; // Change to your actual API URL (LAN IP for device testing)
// // let authToken: string | null = null;

// // // ✅ Indian States & Union Territories
// // const INDIAN_STATES = [
// //   'Andhra Pradesh',
// //   'Arunachal Pradesh',
// //   'Assam',
// //   'Bihar',
// //   'Chhattisgarh',
// //   'Goa',
// //   'Gujarat',
// //   'Haryana',
// //   'Himachal Pradesh',
// //   'Jharkhand',
// //   'Karnataka',
// //   'Kerala',
// //   'Madhya Pradesh',
// //   'Maharashtra',
// //   'Manipur',
// //   'Meghalaya',
// //   'Mizoram',
// //   'Nagaland',
// //   'Odisha',
// //   'Punjab',
// //   'Rajasthan',
// //   'Sikkim',
// //   'Tamil Nadu',
// //   'Telangana',
// //   'Tripura',
// //   'Uttar Pradesh',
// //   'Uttarakhand',
// //   'West Bengal',
// //   'Andaman and Nicobar Islands',
// //   'Chandigarh',
// //   'Dadra and Nagar Haveli and Daman and Diu',
// //   'Delhi',
// //   'Jammu and Kashmir',
// //   'Ladakh',
// //   'Lakshadweep',
// //   'Puducherry',
// // ];

// // // ✅ Major Indian Cities
// // const CITIES_BY_STATE: { [key: string]: string[] } = {
// //   'Andhra Pradesh': [
// //     'Visakhapatnam',
// //     'Vijayawada',
// //     'Guntur',
// //     'Nellore',
// //     'Kurnool',
// //     'Tirupati',
// //   ],
// //   'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
// //   Assam: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
// //   Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
// //   Chhattisgarh: ['Raipur', 'Bhilai', 'Bilaspur', 'Durg'],
// //   Goa: ['Panaji', 'Margao', 'Vasco da Gama'],
// //   Gujarat: [
// //     'Ahmedabad',
// //     'Surat',
// //     'Vadodara',
// //     'Rajkot',
// //     'Bhavnagar',
// //     'Gandhinagar',
// //   ],
// //   Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
// //   'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
// //   Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
// //   Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
// //   Kerala: [
// //     'Thiruvananthapuram',
// //     'Kochi',
// //     'Kozhikode',
// //     'Thrissur',
// //     'Kollam',
// //   ],
// //   'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
// //   Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
// //   Manipur: ['Imphal'],
// //   Meghalaya: ['Shillong'],
// //   Mizoram: ['Aizawl'],
// //   Nagaland: ['Kohima', 'Dimapur'],
// //   Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela'],
// //   Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
// //   Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
// //   Sikkim: ['Gangtok'],
// //   'Tamil Nadu': [
// //     'Chennai',
// //     'Coimbatore',
// //     'Madurai',
// //     'Tiruchirappalli',
// //     'Salem',
// //   ],
// //   Telangana: ['Hyderabad', 'Warangal', 'Nizamabad'],
// //   Tripura: ['Agartala'],
// //   'Uttar Pradesh': [
// //     'Lucknow',
// //     'Kanpur',
// //     'Ghaziabad',
// //     'Agra',
// //     'Noida',
// //     'Varanasi',
// //   ],
// //   Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital'],
// //   'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
// //   'Andaman and Nicobar Islands': ['Port Blair'],
// //   Chandigarh: ['Chandigarh'],
// //   'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Silvassa'],
// //   Delhi: ['New Delhi', 'Delhi'],
// //   'Jammu and Kashmir': ['Srinagar', 'Jammu'],
// //   Ladakh: ['Leh', 'Kargil'],
// //   Lakshadweep: ['Kavaratti'],
// //   Puducherry: ['Puducherry'],
// // };

// // // Flat list of every city
// // const ALL_CITIES = Array.from(
// //   new Set(Object.values(CITIES_BY_STATE).flat())
// // ).sort();

// // interface AddressSelectionScreenProps {
// //   navigation: any;
// //   route: any;
// // }

// // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({
// //   navigation,
// //   route,
// // }) => {
// //   const { totalAmount, restaurantName, cartItems } = route.params || {};

// //   const {
// //     addresses,
// //     selectedAddress,
// //     setSelectedAddress,
// //     addAddress,
// //     setDefaultAddress,
// //     refreshAddresses,
// //   } = useContext(AddressContext);

// //   const { getTotalPrice, getTotalItems } = useContext(CartContext);

// //   const { user, updateUser } = useContext(AuthContext);

// //   useEffect(() => {
// //     const loadToken = async () => {
// //       const token = await AsyncStorage.getItem('authToken');

// //       if (token) {
// //         authToken = token;
// //       }
// //     };

// //     loadToken();
// //   }, []);

// //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [gettingLocation, setGettingLocation] = useState(false);
// //   const [locationError, setLocationError] = useState<string>('');

// //   // ✅ Validation error states
// //   const [phoneError, setPhoneError] = useState<string>('');
// //   const [pincodeError, setPincodeError] = useState<string>('');

// //   // ✅ City / State dropdowns
// //   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
// //   const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
// //   const [citySearch, setCitySearch] = useState('');
// //   const [stateSearch, setStateSearch] = useState('');

// //   const [formData, setFormData] = useState({
// //     type: 'Home' as 'Home' | 'Work' | 'Other',
// //     address: '',
// //     city: '',
// //     state: '',
// //     pincode: '',
// //     landmark: '',
// //     phone: '',
// //     isDefault: false,
// //     latitude: 0,
// //     longitude: 0,
// //   });

// //   // const totalPrice = getTotalPrice() || totalAmount;
// //   const totalPrice = totalAmount || getTotalPrice();  // ✅ Use totalAmount first

// //   const totalItems = getTotalItems();

// //   // ✅ City list depends on selected state
// //   const cityOptions =
// //     formData.state && CITIES_BY_STATE[formData.state]
// //       ? CITIES_BY_STATE[formData.state]
// //       : ALL_CITIES;

// //   const filteredStates = INDIAN_STATES.filter((s) =>
// //     s.toLowerCase().includes(stateSearch.toLowerCase())
// //   );

// //   const filteredCities = cityOptions.filter((c) =>
// //     c.toLowerCase().includes(citySearch.toLowerCase())
// //   );

// //   const handleSelectState = (state: string) => {
// //     const stillValid = CITIES_BY_STATE[state]?.includes(formData.city);

// //     setFormData({
// //       ...formData,
// //       state,
// //       city: stillValid ? formData.city : '',
// //     });

// //     setStateSearch('');
// //     setStateDropdownOpen(false);
// //   };

// //   const handleSelectCity = (city: string) => {
// //     setFormData({
// //       ...formData,
// //       city,
// //     });

// //     setCitySearch('');
// //     setCityDropdownOpen(false);
// //   };

// //   // ✅ Phone number validation
// //   const validatePhoneNumber = (text: string) => {
// //     const cleaned = text.replace(/[^0-9]/g, '');
// //     const limited = cleaned.slice(0, 10);

// //     setFormData({
// //       ...formData,
// //       phone: limited,
// //     });

// //     if (limited.length > 0 && limited.length !== 10) {
// //       setPhoneError('Phone number must be exactly 10 digits');
// //     } else {
// //       setPhoneError('');
// //     }
// //   };

// //   // ✅ Pincode validation
// //   const validatePincode = (text: string) => {
// //     const cleaned = text.replace(/[^0-9]/g, '');
// //     const limited = cleaned.slice(0, 6);

// //     setFormData({
// //       ...formData,
// //       pincode: limited,
// //     });

// //     if (limited.length > 0 && limited.length !== 6) {
// //       setPincodeError('Pincode must be exactly 6 digits');
// //     } else {
// //       setPincodeError('');
// //     }
// //   };

// //   // ============================================================
// //   // ✅ GET CURRENT GPS LOCATION
// //   // Google Maps API is NOT used here
// //   // ============================================================
// //   const getCurrentLocation = async () => {
// //   setLocationError('');
// //   setGettingLocation(true);

// //   try {
// //     console.log('📍 Requesting location permission...');

// //     const { status } = await Location.requestForegroundPermissionsAsync();

// //     if (status !== 'granted') {
// //       const message =
// //         'Location permission was denied. Please allow location permission from your browser/device settings.';

// //       setLocationError(message);
// //       Alert.alert('Location Permission', message);
// //       setGettingLocation(false);
// //       return;
// //     }

// //     console.log('📍 Getting current GPS location...');

// //     const location = await Location.getCurrentPositionAsync({
// //       accuracy: Location.Accuracy.Balanced,
// //     });

// //     const { latitude, longitude } = location.coords;

// //     console.log('📍 GPS LOCATION FOUND');
// //     console.log('Latitude:', latitude);
// //     console.log('Longitude:', longitude);

// //     try {
// //       const results = await Location.reverseGeocodeAsync({
// //         latitude,
// //         longitude,
// //       });

// //       console.log('📦 Reverse geocode result:', results);

// //       if (results.length > 0) {
// //         const result = results[0];

// //         const city =
// //           result.city ||
// //           result.district ||
// //           result.subregion ||
// //           '';

// //         const state = result.region || '';
// //         const pincode = result.postalCode || '';

// //         let formattedAddress = [
// //           result.name,
// //           result.street,
// //           result.subLocality,
// //           result.city,
// //         ]
// //           .filter(Boolean)
// //           .join(', ');

// //         if (!formattedAddress) {
// //           formattedAddress = `${latitude}, ${longitude}`;
// //         }

// //         setFormData(prev => ({
// //           ...prev,
// //           address: formattedAddress,
// //           city,
// //           state,
// //           pincode,
// //           latitude,
// //           longitude,
// //         }));

// //         Alert.alert(
// //           '📍 Location Found!',
// //           `Address: ${formattedAddress}\n\nLatitude: ${latitude}\nLongitude: ${longitude}`
// //         );
// //       } else {
// //         setFormData(prev => ({
// //           ...prev,
// //           latitude,
// //           longitude,
// //         }));

// //         Alert.alert(
// //           '📍 GPS Location Found',
// //           `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`
// //         );
// //       }
// //     } catch (geocodeError) {
// //       console.error('❌ Reverse geocoding error:', geocodeError);

// //       // GPS worked even if address lookup failed
// //       setFormData(prev => ({
// //         ...prev,
// //         latitude,
// //         longitude,
// //       }));

// //       Alert.alert(
// //         '📍 GPS Location Found',
// //         `Latitude: ${latitude}\nLongitude: ${longitude}\n\nAddress lookup failed. Please enter your address manually.`
// //       );
// //     }
// //   } catch (error: any) {
// //     console.error('❌ GPS location error:', error);

// //     setLocationError(
// //       error?.message || 'Unable to get your current location.'
// //     );

// //     Alert.alert(
// //       '❌ Location Error',
// //       error?.message || 'Unable to get your current location.'
// //     );
// //   } finally {
// //     // VERY IMPORTANT
// //     setGettingLocation(false);
// //   }
// // };
// //   // ✅ Mobile + Web
// //   const requestLocationPermission = () => {
// //     getCurrentLocation();
// //   };

// //   const getAddressTypeIcon = (type: string) => {
// //     switch (type) {
// //       case 'Home':
// //         return 'home-outline';
// //       case 'Work':
// //         return 'briefcase-outline';
// //       case 'Other':
// //         return 'location-outline';
// //       default:
// //         return 'location-outline';
// //     }
// //   };

// //   const getAddressTypeColor = (type: string) => {
// //     switch (type) {
// //       case 'Home':
// //         return '#4CAF50';
// //       case 'Work':
// //         return '#2196F3';
// //       case 'Other':
// //         return '#FF9800';
// //       default:
// //         return '#757575';
// //     }
// //   };

// //   // ✅ Select saved address
// //   const handleSelectAddress = (address: Address) => {
// //     setSelectedAddress(address);

// //     navigation.navigate('PaymentScreen', {
// //       address: address,
// //       totalAmount: totalPrice,
// //       restaurantName: restaurantName,
// //       cartItems: cartItems,
// //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// //     });
// //   };

// //   // ✅ Add address
// //   const handleAddAddress = async () => {
// //     // Validate required fields
// //     if (!formData.address || !formData.city || !formData.pincode) {
// //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// //       return;
// //     }

// //     // ✅ Validate pincode
// //     if (formData.pincode.length !== 6) {
// //       setPincodeError('Pincode must be exactly 6 digits');

// //       Alert.alert(
// //         '⚠️ Error',
// //         'Pincode must be exactly 6 digits'
// //       );

// //       return;
// //     }

// //     // ✅ Validate phone
// //     if (
// //       formData.phone &&
// //       formData.phone.length !== 10
// //     ) {
// //       setPhoneError(
// //         'Phone number must be exactly 10 digits'
// //       );

// //       Alert.alert(
// //         '⚠️ Error',
// //         'Phone number must be exactly 10 digits'
// //       );

// //       return;
// //     }

// //     setPhoneError('');
// //     setPincodeError('');

// //     if (!user?.id) {
// //       Alert.alert(
// //         '⚠️ Error',
// //         'User not found. Please login again.'
// //       );

// //       return;
// //     }

// //     setIsLoading(true);

// //     try {
// //       const fullAddress = `${formData.address}, ${formData.city}, ${
// //         formData.state || ''
// //       } - ${formData.pincode}`;

// //       // Single API call
// //       const ok = await updateUser({
// //         address: fullAddress,
// //       });

// //       if (!ok) {
// //         Alert.alert(
// //           '⚠️ Warning',
// //           'Failed to save address. Please try again.'
// //         );

// //         setIsLoading(false);
// //         return;
// //       }

// //       console.log(
// //         '✅ Address updated successfully'
// //       );

// //       // Save to local address context
// //       const newAddress: Address = {
// //         id: `addr_${Date.now()}`,
// //         type: formData.type,
// //         address: formData.address,
// //         city: formData.city,
// //         state: formData.state || '',
// //         pincode: formData.pincode,
// //         landmark: formData.landmark || '',
// //         phone: formData.phone || '',
// //         isDefault:
// //           addresses.length === 0 ||
// //           formData.isDefault,

// //         // ✅ GPS coordinates saved
// //         latitude:
// //           formData.latitude || undefined,

// //         longitude:
// //           formData.longitude || undefined,
// //       };

// //       addAddress(newAddress);

// //       setIsLoading(false);
// //       setShowAddAddressModal(false);

// //       resetForm();

// //       setSelectedAddress(newAddress);

// //       // Navigate to PaymentScreen
// //       navigation.navigate('PaymentScreen', {
// //         address: newAddress,
// //         totalAmount: totalPrice,
// //         restaurantName: restaurantName,
// //         cartItems: cartItems,
// //         orderId:
// //           'ORD-' +
// //           Date.now().toString().slice(-6),
// //       });
// //     } catch (error: any) {
// //       console.error(
// //         '❌ Error saving address:',
// //         error
// //       );

// //       Alert.alert(
// //         '❌ Error',
// //         error.message ||
// //           'Failed to save address. Please try again.'
// //       );

// //       setIsLoading(false);
// //     }
// //   };

// //   // ✅ Reset form
// //   const resetForm = () => {
// //     setFormData({
// //       type: 'Home',
// //       address: '',
// //       city: '',
// //       state: '',
// //       pincode: '',
// //       landmark: '',
// //       phone: '',
// //       isDefault: false,
// //       latitude: 0,
// //       longitude: 0,
// //     });

// //     setPhoneError('');
// //     setPincodeError('');
// //     setCitySearch('');
// //     setStateSearch('');
// //     setCityDropdownOpen(false);
// //     setStateDropdownOpen(false);
// //   };

// //   // ============================================================
// //   // SAVED ADDRESS ITEM
// //   // ============================================================
// //   const renderAddressItem = ({
// //     item,
// //   }: {
// //     item: Address;
// //   }) => {
// //     const isSelected =
// //       selectedAddress?.id === item.id;

// //     return (
// //       <TouchableOpacity
// //         key={item.id}
// //         style={[
// //           styles.addressCard,
// //           isSelected &&
// //             styles.addressCardSelected,
// //         ]}
// //         onPress={() =>
// //           handleSelectAddress(item)
// //         }
// //         activeOpacity={0.7}
// //       >
// //         <View style={styles.addressHeader}>
// //           <View
// //             style={
// //               styles.addressTypeContainer
// //             }
// //           >
// //             <Icon
// //               name={getAddressTypeIcon(
// //                 item.type
// //               )}
// //               size={18}
// //               color={getAddressTypeColor(
// //                 item.type
// //               )}
// //             />

// //             <Text
// //               style={styles.addressTypeText}
// //             >
// //               {item.type}
// //             </Text>
// //           </View>

// //           {item.isDefault && (
// //             <View
// //               style={styles.defaultBadge}
// //             >
// //               <Text
// //                 style={
// //                   styles.defaultBadgeText
// //                 }
// //               >
// //                 Default
// //               </Text>
// //             </View>
// //           )}

// //           {isSelected && (
// //             <Icon
// //               name="checkmark-circle"
// //               size={22}
// //               color="#4CAF50"
// //               style={styles.selectedIcon}
// //             />
// //           )}
// //         </View>

// //         <Text style={styles.addressDetail}>
// //           {item.address}
// //         </Text>

// //         {item.landmark && (
// //           <Text style={styles.addressDetail}>
// //             📍 {item.landmark}
// //           </Text>
// //         )}

// //         {item.phone && (
// //           <Text style={styles.addressPhone}>
// //             📞 {item.phone}
// //           </Text>
// //         )}

// //         <Text style={styles.addressDetail}>
// //           {item.city}, {item.state || ''} -{' '}
// //           {item.pincode}
// //         </Text>

// //         {item.latitude &&
// //           item.longitude && (
// //             <View
// //               style={styles.locationTag}
// //             >
// //               <Icon
// //                 name="location-outline"
// //                 size={12}
// //                 color="#28a745"
// //               />

// //               <Text
// //                 style={
// //                   styles.locationTagText
// //                 }
// //               >
// //                 Live location
// //               </Text>
// //             </View>
// //           )}
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar
// //         barStyle="dark-content"
// //         backgroundColor="#ffffff"
// //       />

// //       {/* HEADER */}
// //       <View style={styles.header}>
// //         <TouchableOpacity
// //           onPress={() =>
// //             navigation.goBack()
// //           }
// //           style={styles.backButton}
// //         >
// //           <Icon
// //             name="arrow-back"
// //             size={24}
// //             color="#282c3f"
// //           />
// //         </TouchableOpacity>

// //         <Text style={styles.headerTitle}>
// //           Delivery Address
// //         </Text>

// //         <TouchableOpacity
// //           style={styles.addButton}
// //           onPress={() =>
// //             setShowAddAddressModal(true)
// //           }
// //         >
// //           <Icon
// //             name="add-circle-outline"
// //             size={28}
// //             color="#fc8019"
// //           />
// //         </TouchableOpacity>
// //       </View>

// //       {/* CURRENT LOCATION */}
// //       <TouchableOpacity
// //         style={styles.locationButton}
// //         onPress={
// //           requestLocationPermission
// //         }
// //         disabled={gettingLocation}
// //       >
// //         {gettingLocation ? (
// //           <ActivityIndicator
// //             size="small"
// //             color="#fc8019"
// //           />
// //         ) : (
// //           <>
// //             <Icon
// //               name="locate-outline"
// //               size={22}
// //               color="#fc8019"
// //             />

// //             <Text
// //               style={
// //                 styles.locationButtonText
// //               }
// //             >
// //               Use Current Location
// //             </Text>
// //           </>
// //         )}
// //       </TouchableOpacity>

// //       {/* SAVED ADDRESSES */}
// //       <FlatList
// //         data={addresses}
// //         renderItem={renderAddressItem}
// //         keyExtractor={(item) => item.id}
// //         contentContainerStyle={
// //           styles.addressList
// //         }
// //         showsVerticalScrollIndicator={false}
// //         ListHeaderComponent={
// //           addresses.length > 0 ? (
// //             <Text
// //               style={styles.listHeader}
// //             >
// //               Saved Addresses
// //             </Text>
// //           ) : null
// //         }
// //         ListEmptyComponent={
// //           <View
// //             style={styles.emptyContainer}
// //           >
// //             <Icon
// //               name="location-outline"
// //               size={60}
// //               color="#ccc"
// //             />

// //             <Text
// //               style={styles.emptyText}
// //             >
// //               No Addresses Saved
// //             </Text>

// //             <Text
// //               style={styles.emptySubText}
// //             >
// //               Add a new address
// //             </Text>
// //           </View>
// //         }
// //       />

// //       {/* BOTTOM BAR */}
// //       {selectedAddress && (
// //         <View style={styles.bottomBar}>
// //           <View
// //             style={styles.bottomBarLeft}
// //           >
// //             <Text
// //               style={styles.bottomBarTotal}
// //             >
// //               ₹{totalPrice}
// //             </Text>

// //             <Text
// //               style={styles.bottomBarItems}
// //             >
// //               {totalItems} items
// //             </Text>
// //           </View>

// //           <TouchableOpacity
// //             style={styles.deliverButton}
// //             onPress={() =>
// //               handleSelectAddress(
// //                 selectedAddress
// //               )
// //             }
// //           >
// //             <Text
// //               style={
// //                 styles.deliverButtonText
// //               }
// //             >
// //               Deliver to{' '}
// //               {selectedAddress.type}
// //             </Text>

// //             <Icon
// //               name="arrow-forward"
// //               size={18}
// //               color="#ffffff"
// //             />
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* ADD ADDRESS MODAL */}
// //       <Modal
// //         visible={showAddAddressModal}
// //         animationType="slide"
// //         transparent={true}
// //       >
// //         <View
// //           style={styles.modalContainer}
// //         >
// //           <View
// //             style={styles.modalContent}
// //           >
// //             {/* MODAL HEADER */}
// //             <View
// //               style={styles.modalHeader}
// //             >
// //               <Text
// //                 style={styles.modalTitle}
// //               >
// //                 Add New Address
// //               </Text>

// //               <TouchableOpacity
// //                 onPress={() => {
// //                   setShowAddAddressModal(
// //                     false
// //                   );
// //                   resetForm();
// //                 }}
// //               >
// //                 <Icon
// //                   name="close"
// //                   size={24}
// //                   color="#282c3f"
// //                 />
// //               </TouchableOpacity>
// //             </View>

// //             <ScrollView
// //               showsVerticalScrollIndicator={
// //                 false
// //               }
// //               nestedScrollEnabled={true}
// //             >
// //               {/* ADDRESS TYPE */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <Text
// //                   style={styles.formLabel}
// //                 >
// //                   Address Type
// //                 </Text>

// //                 <View
// //                   style={
// //                     styles.addressTypeButtons
// //                   }
// //                 >
// //                   {[
// //                     'Home',
// //                     'Work',
// //                     'Other',
// //                   ].map((type) => (
// //                     <TouchableOpacity
// //                       key={type}
// //                       style={[
// //                         styles.addressTypeButton,
// //                         formData.type ===
// //                           type &&
// //                           styles.addressTypeButtonActive,
// //                       ]}
// //                       onPress={() =>
// //                         setFormData({
// //                           ...formData,
// //                           type: type as
// //                             | 'Home'
// //                             | 'Work'
// //                             | 'Other',
// //                         })
// //                       }
// //                     >
// //                       <Icon
// //                         name={getAddressTypeIcon(
// //                           type
// //                         )}
// //                         size={18}
// //                         color={
// //                           formData.type ===
// //                           type
// //                             ? '#fc8019'
// //                             : '#757575'
// //                         }
// //                       />

// //                       <Text
// //                         style={[
// //                           styles.addressTypeButtonText,
// //                           formData.type ===
// //                             type &&
// //                             styles.addressTypeButtonTextActive,
// //                         ]}
// //                       >
// //                         {type}
// //                       </Text>
// //                     </TouchableOpacity>
// //                   ))}
// //                 </View>
// //               </View>

// //               {/* ADDRESS */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <Text
// //                   style={styles.formLabel}
// //                 >
// //                   Address *
// //                 </Text>

// //                 <TextInput
// //                   style={[
// //                     styles.formInput,
// //                     styles.formInputMultiline,
// //                   ]}
// //                   placeholder="Enter your address"
// //                   value={formData.address}
// //                   multiline
// //                   numberOfLines={3}
// //                   onChangeText={(text) =>
// //                     setFormData({
// //                       ...formData,
// //                       address: text,
// //                     })
// //                   }
// //                 />
// //               </View>

// //               {/* LANDMARK */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <Text
// //                   style={styles.formLabel}
// //                 >
// //                   Landmark
// //                 </Text>

// //                 <TextInput
// //                   style={styles.formInput}
// //                   placeholder="Nearby landmark (optional)"
// //                   value={formData.landmark}
// //                   onChangeText={(text) =>
// //                     setFormData({
// //                       ...formData,
// //                       landmark: text,
// //                     })
// //                   }
// //                 />
// //               </View>

// //               {/* PHONE */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <Text
// //                   style={styles.formLabel}
// //                 >
// //                   Phone Number
// //                 </Text>

// //                 <TextInput
// //                   style={[
// //                     styles.formInput,
// //                     phoneError
// //                       ? styles.formInputError
// //                       : null,
// //                   ]}
// //                   placeholder="Enter 10-digit phone number"
// //                   value={formData.phone}
// //                   keyboardType="number-pad"
// //                   maxLength={10}
// //                   onChangeText={
// //                     validatePhoneNumber
// //                   }
// //                 />

// //                 {phoneError ? (
// //                   <Text
// //                     style={styles.errorText}
// //                   >
// //                     {phoneError}
// //                   </Text>
// //                 ) : null}

// //                 <Text
// //                   style={styles.hintText}
// //                 >
// //                   Enter exactly 10 digits
// //                   (numbers only)
// //                 </Text>
// //               </View>

// //               {/* CITY */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <Text
// //                   style={styles.formLabel}
// //                 >
// //                   City *
// //                 </Text>

// //                 <TouchableOpacity
// //                   style={styles.formInput}
// //                   onPress={() => {
// //                     setCityDropdownOpen(
// //                       !cityDropdownOpen
// //                     );
// //                     setStateDropdownOpen(
// //                       false
// //                     );
// //                   }}
// //                 >
// //                   <View
// //                     style={
// //                       styles.dropdownTriggerRow
// //                     }
// //                   >
// //                     <Text
// //                       style={
// //                         formData.city
// //                           ? styles.dropdownValueText
// //                           : styles.dropdownPlaceholderText
// //                       }
// //                     >
// //                       {formData.city ||
// //                         'Select City'}
// //                     </Text>

// //                     <Icon
// //                       name={
// //                         cityDropdownOpen
// //                           ? 'chevron-up'
// //                           : 'chevron-down'
// //                       }
// //                       size={16}
// //                       color="#757575"
// //                     />
// //                   </View>
// //                 </TouchableOpacity>

// //                 {cityDropdownOpen && (
// //                   <View
// //                     style={
// //                       styles.dropdownPanel
// //                     }
// //                   >
// //                     <View
// //                       style={
// //                         styles.searchBox
// //                       }
// //                     >
// //                       <Icon
// //                         name="search-outline"
// //                         size={18}
// //                         color="#7e808c"
// //                       />

// //                       <TextInput
// //                         style={
// //                           styles.searchInput
// //                         }
// //                         placeholder="Search city"
// //                         value={citySearch}
// //                         onChangeText={
// //                           setCitySearch
// //                         }
// //                         autoFocus
// //                       />
// //                     </View>

// //                     <ScrollView
// //                       style={
// //                         styles.dropdownList
// //                       }
// //                       nestedScrollEnabled={
// //                         true
// //                       }
// //                       keyboardShouldPersistTaps="handled"
// //                     >
// //                       {filteredCities.length ===
// //                       0 ? (
// //                         <Text
// //                           style={
// //                             styles.pickerEmptyText
// //                           }
// //                         >
// //                           No cities found
// //                         </Text>
// //                       ) : (
// //                         filteredCities.map(
// //                           (item) => (
// //                             <TouchableOpacity
// //                               key={item}
// //                               style={[
// //                                 styles.pickerRow,
// //                                 formData.city ===
// //                                   item &&
// //                                   styles.pickerRowActive,
// //                               ]}
// //                               onPress={() =>
// //                                 handleSelectCity(
// //                                   item
// //                                 )
// //                               }
// //                             >
// //                               <Text
// //                                 style={[
// //                                   styles.pickerRowText,
// //                                   formData.city ===
// //                                     item &&
// //                                     styles.pickerRowTextActive,
// //                                 ]}
// //                               >
// //                                 {item}
// //                               </Text>

// //                               {formData.city ===
// //                                 item && (
// //                                 <Icon
// //                                   name="checkmark"
// //                                   size={18}
// //                                   color="#fc8019"
// //                                 />
// //                               )}
// //                             </TouchableOpacity>
// //                           )
// //                         )
// //                       )}
// //                     </ScrollView>
// //                   </View>
// //                 )}
// //               </View>

// //               {/* STATE */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <Text
// //                   style={styles.formLabel}
// //                 >
// //                   State
// //                 </Text>

// //                 <TouchableOpacity
// //                   style={styles.formInput}
// //                   onPress={() => {
// //                     setStateDropdownOpen(
// //                       !stateDropdownOpen
// //                     );
// //                     setCityDropdownOpen(
// //                       false
// //                     );
// //                   }}
// //                 >
// //                   <View
// //                     style={
// //                       styles.dropdownTriggerRow
// //                     }
// //                   >
// //                     <Text
// //                       style={
// //                         formData.state
// //                           ? styles.dropdownValueText
// //                           : styles.dropdownPlaceholderText
// //                       }
// //                     >
// //                       {formData.state ||
// //                         'Select State'}
// //                     </Text>

// //                     <Icon
// //                       name={
// //                         stateDropdownOpen
// //                           ? 'chevron-up'
// //                           : 'chevron-down'
// //                       }
// //                       size={16}
// //                       color="#757575"
// //                     />
// //                   </View>
// //                 </TouchableOpacity>

// //                 {stateDropdownOpen && (
// //                   <View
// //                     style={
// //                       styles.dropdownPanel
// //                     }
// //                   >
// //                     <View
// //                       style={
// //                         styles.searchBox
// //                       }
// //                     >
// //                       <Icon
// //                         name="search-outline"
// //                         size={18}
// //                         color="#7e808c"
// //                       />

// //                       <TextInput
// //                         style={
// //                           styles.searchInput
// //                         }
// //                         placeholder="Search state"
// //                         value={stateSearch}
// //                         onChangeText={
// //                           setStateSearch
// //                         }
// //                         autoFocus
// //                       />
// //                     </View>

// //                     <ScrollView
// //                       style={
// //                         styles.dropdownList
// //                       }
// //                       nestedScrollEnabled={
// //                         true
// //                       }
// //                       keyboardShouldPersistTaps="handled"
// //                     >
// //                       {filteredStates.length ===
// //                       0 ? (
// //                         <Text
// //                           style={
// //                             styles.pickerEmptyText
// //                           }
// //                         >
// //                           No states found
// //                         </Text>
// //                       ) : (
// //                         filteredStates.map(
// //                           (item) => (
// //                             <TouchableOpacity
// //                               key={item}
// //                               style={[
// //                                 styles.pickerRow,
// //                                 formData.state ===
// //                                   item &&
// //                                   styles.pickerRowActive,
// //                               ]}
// //                               onPress={() =>
// //                                 handleSelectState(
// //                                   item
// //                                 )
// //                               }
// //                             >
// //                               <Text
// //                                 style={[
// //                                   styles.pickerRowText,
// //                                   formData.state ===
// //                                     item &&
// //                                     styles.pickerRowTextActive,
// //                                 ]}
// //                               >
// //                                 {item}
// //                               </Text>

// //                               {formData.state ===
// //                                 item && (
// //                                 <Icon
// //                                   name="checkmark"
// //                                   size={18}
// //                                   color="#fc8019"
// //                                 />
// //                               )}
// //                             </TouchableOpacity>
// //                           )
// //                         )
// //                       )}
// //                     </ScrollView>
// //                   </View>
// //                 )}
// //               </View>

// //               {/* PINCODE */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <Text
// //                   style={styles.formLabel}
// //                 >
// //                   Pincode *
// //                 </Text>

// //                 <TextInput
// //                   style={[
// //                     styles.formInput,
// //                     pincodeError
// //                       ? styles.formInputError
// //                       : null,
// //                   ]}
// //                   placeholder="Enter 6-digit pincode"
// //                   value={formData.pincode}
// //                   keyboardType="number-pad"
// //                   maxLength={6}
// //                   onChangeText={
// //                     validatePincode
// //                   }
// //                 />

// //                 {pincodeError ? (
// //                   <Text
// //                     style={styles.errorText}
// //                   >
// //                     {pincodeError}
// //                   </Text>
// //                 ) : null}

// //                 <Text
// //                   style={styles.hintText}
// //                 >
// //                   Enter exactly 6 digits
// //                   (numbers only)
// //                 </Text>
// //               </View>

// //               {/* DEFAULT ADDRESS */}
// //               <View
// //                 style={styles.formGroup}
// //               >
// //                 <TouchableOpacity
// //                   style={
// //                     styles.defaultCheckbox
// //                   }
// //                   onPress={() =>
// //                     setFormData({
// //                       ...formData,
// //                       isDefault:
// //                         !formData.isDefault,
// //                     })
// //                   }
// //                 >
// //                   <Icon
// //                     name={
// //                       formData.isDefault
// //                         ? 'checkbox'
// //                         : 'square-outline'
// //                     }
// //                     size={24}
// //                     color="#fc8019"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.defaultCheckboxText
// //                     }
// //                   >
// //                     Set as default address
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               {/* LOCATION DETECTED */}
// //               {formData.latitude !== 0 && (
// //                 <View
// //                   style={
// //                     styles.locationDetected
// //                   }
// //                 >
// //                   <Icon
// //                     name="checkmark-circle"
// //                     size={16}
// //                     color="#28a745"
// //                   />

// //                   <Text
// //                     style={
// //                       styles.locationDetectedText
// //                     }
// //                   >
// //                     Location detected ✓
// //                   </Text>
// //                 </View>
// //               )}

// //               {/* SAVE */}
// //               <TouchableOpacity
// //                 style={[
// //                   styles.submitButton,
// //                   isLoading &&
// //                     styles.submitButtonDisabled,
// //                 ]}
// //                 onPress={
// //                   handleAddAddress
// //                 }
// //                 disabled={isLoading}
// //               >
// //                 {isLoading ? (
// //                   <ActivityIndicator
// //                     size="small"
// //                     color="#ffffff"
// //                   />
// //                 ) : (
// //                   <Text
// //                     style={
// //                       styles.submitButtonText
// //                     }
// //                   >
// //                     Save Address & Proceed
// //                   </Text>
// //                 )}
// //               </TouchableOpacity>
// //             </ScrollView>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //   },

// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 14,
// //     backgroundColor: '#ffffff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f0',
// //     elevation: 2,
// //   },

// //   backButton: {
// //     padding: 4,
// //   },

// //   headerTitle: {
// //     flex: 1,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     textAlign: 'center',
// //   },

// //   addButton: {
// //     padding: 4,
// //   },

// //   locationButton: {
// //     backgroundColor: '#ffffff',
// //     margin: 16,
// //     padding: 14,
// //     borderRadius: 12,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderWidth: 1,
// //     borderColor: '#fc8019',
// //     borderStyle: 'dashed',
// //   },

// //   locationButtonText: {
// //     color: '#fc8019',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 8,
// //   },

// //   listHeader: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },

// //   addressList: {
// //     padding: 16,
// //     paddingBottom: 120,
// //   },

// //   addressCard: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#e8e8e8',
// //   },

// //   addressCardSelected: {
// //     borderColor: '#fc8019',
// //     borderWidth: 2,
// //     backgroundColor: '#fff8f0',
// //   },

// //   addressHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //     flexWrap: 'wrap',
// //   },

// //   addressTypeContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 8,
// //   },

// //   addressTypeText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: '#757575',
// //     marginLeft: 4,
// //   },

// //   defaultBadge: {
// //     backgroundColor: '#4CAF50',
// //     paddingHorizontal: 8,
// //     paddingVertical: 2,
// //     borderRadius: 4,
// //     marginRight: 8,
// //   },

// //   defaultBadgeText: {
// //     fontSize: 10,
// //     color: '#ffffff',
// //     fontWeight: '600',
// //   },

// //   selectedIcon: {
// //     position: 'absolute',
// //     right: 0,
// //     top: 0,
// //   },

// //   addressDetail: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     marginBottom: 2,
// //   },

// //   addressPhone: {
// //     fontSize: 14,
// //     color: '#757575',
// //     marginBottom: 2,
// //   },

// //   locationTag: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 4,
// //   },

// //   locationTagText: {
// //     fontSize: 11,
// //     color: '#28a745',
// //     marginLeft: 4,
// //   },

// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 80,
// //   },

// //   emptyText: {
// //     fontSize: 18,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //     marginTop: 16,
// //   },

// //   emptySubText: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginTop: 8,
// //     marginBottom: 24,
// //   },

// //   bottomBar: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: '#ffffff',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f0f0f0',
// //     elevation: 4,
// //   },

// //   bottomBarLeft: {
// //     flexDirection: 'column',
// //   },

// //   bottomBarTotal: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#282c3f',
// //   },

// //   bottomBarItems: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //   },

// //   deliverButton: {
// //     backgroundColor: '#fc8019',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //   },

// //   deliverButtonText: {
// //     color: '#ffffff',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginRight: 8,
// //   },

// //   modalContainer: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'flex-end',
// //   },

// //   modalContent: {
// //     backgroundColor: '#ffffff',
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     padding: 20,
// //     maxHeight: '90%',
// //   },

// //   pickerModalContent: {
// //     backgroundColor: '#ffffff',
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     padding: 20,
// //     maxHeight: '80%',
// //   },

// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f0',
// //     paddingBottom: 12,
// //   },

// //   modalTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },

// //   dropdownTriggerRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //   },

// //   dropdownPanel: {
// //     marginTop: 6,
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //     borderRadius: 8,
// //     backgroundColor: '#ffffff',
// //     padding: 8,
// //     elevation: 3,
// //     shadowColor: '#000',
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },

// //   dropdownList: {
// //     maxHeight: 220,
// //   },

// //   pickerRowActive: {
// //     backgroundColor: '#fff8f0',
// //   },

// //   pickerRowTextActive: {
// //     color: '#fc8019',
// //     fontWeight: '600',
// //   },

// //   searchBox: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fafafa',
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     marginBottom: 12,
// //   },

// //   searchInput: {
// //     flex: 1,
// //     paddingVertical: 10,
// //     paddingHorizontal: 8,
// //     fontSize: 14,
// //   },

// //   pickerRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingVertical: 14,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f0',
// //   },

// //   pickerRowText: {
// //     fontSize: 15,
// //     color: '#282c3f',
// //   },

// //   pickerEmptyText: {
// //     textAlign: 'center',
// //     color: '#7e808c',
// //     paddingVertical: 24,
// //     fontSize: 14,
// //   },

// //   dropdownValueText: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //   },

// //   dropdownPlaceholderText: {
// //     fontSize: 14,
// //     color: '#9e9e9e',
// //   },

// //   formGroup: {
// //     marginBottom: 16,
// //   },

// //   formRow: {
// //     flexDirection: 'row',
// //   },

// //   formLabel: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //     marginBottom: 6,
// //   },

// //   formInput: {
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     paddingVertical: 10,
// //     fontSize: 14,
// //     backgroundColor: '#fafafa',
// //     justifyContent: 'center',
// //   },

// //   formInputError: {
// //     borderColor: '#dc3545',
// //     borderWidth: 2,
// //   },

// //   formInputMultiline: {
// //     height: 80,
// //     textAlignVertical: 'top',
// //   },

// //   errorText: {
// //     color: '#dc3545',
// //     fontSize: 12,
// //     marginTop: 4,
// //   },

// //   hintText: {
// //     color: '#7e808c',
// //     fontSize: 11,
// //     marginTop: 2,
// //   },

// //   addressTypeButtons: {
// //     flexDirection: 'row',
// //     gap: 8,
// //   },

// //   addressTypeButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //     borderRadius: 8,
// //     paddingVertical: 10,
// //     gap: 6,
// //   },

// //   addressTypeButtonActive: {
// //     borderColor: '#fc8019',
// //     backgroundColor: '#fff8f0',
// //   },

// //   addressTypeButtonText: {
// //     fontSize: 14,
// //     color: '#757575',
// //   },

// //   addressTypeButtonTextActive: {
// //     color: '#fc8019',
// //     fontWeight: '600',
// //   },

// //   defaultCheckbox: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 4,
// //   },

// //   defaultCheckboxText: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     marginLeft: 8,
// //   },

// //   locationDetected: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e8f5e9',
// //     padding: 10,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },

// //   locationDetectedText: {
// //     fontSize: 13,
// //     color: '#28a745',
// //     marginLeft: 8,
// //     flex: 1,
// //   },

// //   submitButton: {
// //     backgroundColor: '#fc8019',
// //     paddingVertical: 14,
// //     borderRadius: 8,
// //     alignItems: 'center',
// //     marginTop: 10,
// //     marginBottom: 20,
// //   },

// //   submitButtonDisabled: {
// //     backgroundColor: '#ccc',
// //   },

// //   submitButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });

// // export default AddressSelectionScreen;
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

// const API_BASE_URL = 'http://localhost:3000'; // Change to your actual API URL (LAN IP for device testing)
// let authToken: string | null = null;

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

// const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({
//   navigation,
//   route,
// }) => {
//   const { totalAmount, restaurantName, cartItems } = route.params || {};

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

//   // ✅ Validation error states
//   const [phoneError, setPhoneError] = useState<string>('');
//   const [pincodeError, setPincodeError] = useState<string>('');

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
//   // ✅ GET CURRENT GPS LOCATION
//   // Google Maps API is NOT used here
//   // ============================================================
//   const getCurrentLocation = async () => {
//     setLocationError('');
//     setGettingLocation(true);

//     try {
//       console.log('📍 Requesting location permission...');

//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status !== 'granted') {
//         const message =
//           'Location permission was denied. Please allow location permission from your browser/device settings.';

//         setLocationError(message);
//         Alert.alert('Location Permission', message);
//         setGettingLocation(false);
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
//             result.subLocality,
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

//           Alert.alert(
//             '📍 Location Found!',
//             `Address: ${formattedAddress}\n\nLatitude: ${latitude}\nLongitude: ${longitude}`
//           );
//         } else {
//           setFormData(prev => ({
//             ...prev,
//             latitude,
//             longitude,
//           }));

//           Alert.alert(
//             '📍 GPS Location Found',
//             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`
//           );
//         }
//       } catch (geocodeError) {
//         console.error('❌ Reverse geocoding error:', geocodeError);

//         // GPS worked even if address lookup failed
//         setFormData(prev => ({
//           ...prev,
//           latitude,
//           longitude,
//         }));

//         Alert.alert(
//           '📍 GPS Location Found',
//           `Latitude: ${latitude}\nLongitude: ${longitude}\n\nAddress lookup failed. Please enter your address manually.`
//         );
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
//     } finally {
//       // VERY IMPORTANT
//       setGettingLocation(false);
//     }
//   };
//   // ✅ Mobile + Web
//   const requestLocationPermission = () => {
//     getCurrentLocation();
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

//   // ✅ Select saved address
//   const handleSelectAddress = (address: Address) => {
//     setSelectedAddress(address);

//     navigation.navigate('PaymentScreen', {
//       address: address,
//       totalAmount: totalPrice,
//       restaurantName: restaurantName,
//       cartItems: cartItems,
//       orderId: 'ORD-' + Date.now().toString().slice(-6),
//     });
//   };

//   // ✅ Add address
//   const handleAddAddress = async () => {
//     // Validate required fields
//     if (!formData.address || !formData.city || !formData.pincode) {
//       Alert.alert('⚠️ Error', 'Please fill all required fields');
//       return;
//     }

//     // ✅ Validate pincode
//     if (formData.pincode.length !== 6) {
//       setPincodeError('Pincode must be exactly 6 digits');

//       Alert.alert(
//         '⚠️ Error',
//         'Pincode must be exactly 6 digits'
//       );

//       return;
//     }

//     // ✅ Validate phone
//     if (
//       formData.phone &&
//       formData.phone.length !== 10
//     ) {
//       setPhoneError(
//         'Phone number must be exactly 10 digits'
//       );

//       Alert.alert(
//         '⚠️ Error',
//         'Phone number must be exactly 10 digits'
//       );

//       return;
//     }

//     setPhoneError('');
//     setPincodeError('');

//     if (!user?.id) {
//       Alert.alert(
//         '⚠️ Error',
//         'User not found. Please login again.'
//       );

//       return;
//     }

//     setIsLoading(true);

//     try {
//       const fullAddress = `${formData.address}, ${formData.city}, ${
//         formData.state || ''
//       } - ${formData.pincode}`;

//       // Single API call
//       const ok = await updateUser({
//         address: fullAddress,
//       });

//       if (!ok) {
//         Alert.alert(
//           '⚠️ Warning',
//           'Failed to save address. Please try again.'
//         );

//         setIsLoading(false);
//         return;
//       }

//       console.log(
//         '✅ Address updated successfully'
//       );

//       // Save to local address context
//       const newAddress: Address = {
//         id: `addr_${Date.now()}`,
//         type: formData.type,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state || '',
//         pincode: formData.pincode,
//         landmark: formData.landmark || '',
//         phone: formData.phone || '',
//         isDefault:
//           addresses.length === 0 ||
//           formData.isDefault,

//         // ✅ GPS coordinates saved
//         latitude:
//           formData.latitude || undefined,

//         longitude:
//           formData.longitude || undefined,
//       };

//       addAddress(newAddress);

//       setIsLoading(false);
//       setShowAddAddressModal(false);

//       resetForm();

//       setSelectedAddress(newAddress);

//       // Navigate to PaymentScreen
//       navigation.navigate('PaymentScreen', {
//         address: newAddress,
//         totalAmount: totalPrice,
//         restaurantName: restaurantName,
//         cartItems: cartItems,
//         orderId:
//           'ORD-' +
//           Date.now().toString().slice(-6),
//       });
//     } catch (error: any) {
//       console.error(
//         '❌ Error saving address:',
//         error
//       );

//       Alert.alert(
//         '❌ Error',
//         error.message ||
//           'Failed to save address. Please try again.'
//       );

//       setIsLoading(false);
//     }
//   };

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
//     setCitySearch('');
//     setStateSearch('');
//     setCityDropdownOpen(false);
//     setStateDropdownOpen(false);
//   };

//   // ============================================================
//   // SAVED ADDRESS ITEM
//   // ============================================================
//   const renderAddressItem = ({
//     item,
//   }: {
//     item: Address;
//   }) => {
//     const isSelected =
//       selectedAddress?.id === item.id;

//     return (
//       <TouchableOpacity
//         key={item.id}
//         style={[
//           styles.addressCard,
//           isSelected &&
//             styles.addressCardSelected,
//         ]}
//         onPress={() =>
//           handleSelectAddress(item)
//         }
//         activeOpacity={0.7}
//       >
//         <View style={styles.addressHeader}>
//           <View
//             style={
//               styles.addressTypeContainer
//             }
//           >
//             <Icon
//               name={getAddressTypeIcon(
//                 item.type
//               )}
//               size={18}
//               color={getAddressTypeColor(
//                 item.type
//               )}
//             />

//             <Text
//               style={styles.addressTypeText}
//             >
//               {item.type}
//             </Text>
//           </View>

//           {item.isDefault && (
//             <View
//               style={styles.defaultBadge}
//             >
//               <Text
//                 style={
//                   styles.defaultBadgeText
//                 }
//               >
//                 Default
//               </Text>
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

//         <Text style={styles.addressDetail}>
//           {item.address}
//         </Text>

//         {item.landmark && (
//           <Text style={styles.addressDetail}>
//             📍 {item.landmark}
//           </Text>
//         )}

//         {item.phone && (
//           <Text style={styles.addressPhone}>
//             📞 {item.phone}
//           </Text>
//         )}

//         <Text style={styles.addressDetail}>
//           {item.city}, {item.state || ''} -{' '}
//           {item.pincode}
//         </Text>

//         {item.latitude &&
//           item.longitude && (
//             <View
//               style={styles.locationTag}
//             >
//               <Icon
//                 name="location-outline"
//                 size={12}
//                 color="#28a745"
//               />

//               <Text
//                 style={
//                   styles.locationTagText
//                 }
//               >
//                 Live location
//               </Text>
//             </View>
//           )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor="#ffffff"
//       />

//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() =>
//             navigation.goBack()
//           }
//           style={styles.backButton}
//         >
//           <Icon
//             name="arrow-back"
//             size={24}
//             color="#282c3f"
//           />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>
//           Delivery Address
//         </Text>

//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() =>
//             setShowAddAddressModal(true)
//           }
//         >
//           <Icon
//             name="add-circle-outline"
//             size={28}
//             color="#fc8019"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* CURRENT LOCATION */}
//       <TouchableOpacity
//         style={styles.locationButton}
//         onPress={
//           requestLocationPermission
//         }
//         disabled={gettingLocation}
//       >
//         {gettingLocation ? (
//           <ActivityIndicator
//             size="small"
//             color="#fc8019"
//           />
//         ) : (
//           <>
//             <Icon
//               name="locate-outline"
//               size={22}
//               color="#fc8019"
//             />

//             <Text
//               style={
//                 styles.locationButtonText
//               }
//             >
//               Use Current Location
//             </Text>
//           </>
//         )}
//       </TouchableOpacity>

//       {/* SAVED ADDRESSES */}
//       <FlatList
//         data={addresses}
//         renderItem={renderAddressItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={
//           styles.addressList
//         }
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={
//           addresses.length > 0 ? (
//             <Text
//               style={styles.listHeader}
//             >
//               Saved Addresses
//             </Text>
//           ) : null
//         }
//         ListEmptyComponent={
//           <View
//             style={styles.emptyContainer}
//           >
//             <Icon
//               name="location-outline"
//               size={60}
//               color="#ccc"
//             />

//             <Text
//               style={styles.emptyText}
//             >
//               No Addresses Saved
//             </Text>

//             <Text
//               style={styles.emptySubText}
//             >
//               Add a new address
//             </Text>
//           </View>
//         }
//       />

//       {/* BOTTOM BAR */}
//       {selectedAddress && (
//         <View style={styles.bottomBar}>
//           <View
//             style={styles.bottomBarLeft}
//           >
//             <Text
//               style={styles.bottomBarTotal}
//             >
//               ₹{totalPrice}
//             </Text>

//             <Text
//               style={styles.bottomBarItems}
//             >
//               {totalItems} items
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={styles.deliverButton}
//             onPress={() =>
//               handleSelectAddress(
//                 selectedAddress
//               )
//             }
//           >
//             <Text
//               style={
//                 styles.deliverButtonText
//               }
//             >
//               Deliver to{' '}
//               {selectedAddress.type}
//             </Text>

//             <Icon
//               name="arrow-forward"
//               size={18}
//               color="#ffffff"
//             />
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* ADD ADDRESS MODAL */}
//       <Modal
//         visible={showAddAddressModal}
//         animationType="slide"
//         transparent={true}
//       >
//         <View
//           style={styles.modalContainer}
//         >
//           <View
//             style={styles.modalContent}
//           >
//             {/* MODAL HEADER */}
//             <View
//               style={styles.modalHeader}
//             >
//               <Text
//                 style={styles.modalTitle}
//               >
//                 Add New Address
//               </Text>

//               <TouchableOpacity
//                 onPress={() => {
//                   setShowAddAddressModal(
//                     false
//                   );
//                   resetForm();
//                 }}
//               >
//                 <Icon
//                   name="close"
//                   size={24}
//                   color="#282c3f"
//                 />
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={
//                 false
//               }
//               nestedScrollEnabled={true}
//             >
//               {/* ADDRESS TYPE */}
//               <View
//                 style={styles.formGroup}
//               >
//                 <Text
//                   style={styles.formLabel}
//                 >
//                   Address Type
//                 </Text>

//                 <View
//                   style={
//                     styles.addressTypeButtons
//                   }
//                 >
//                   {[
//                     'Home',
//                     'Work',
//                     'Other',
//                   ].map((type) => (
//                     <TouchableOpacity
//                       key={type}
//                       style={[
//                         styles.addressTypeButton,
//                         formData.type ===
//                           type &&
//                           styles.addressTypeButtonActive,
//                       ]}
//                       onPress={() =>
//                         setFormData({
//                           ...formData,
//                           type: type as
//                             | 'Home'
//                             | 'Work'
//                             | 'Other',
//                         })
//                       }
//                     >
//                       <Icon
//                         name={getAddressTypeIcon(
//                           type
//                         )}
//                         size={18}
//                         color={
//                           formData.type ===
//                           type
//                             ? '#fc8019'
//                             : '#757575'
//                         }
//                       />

//                       <Text
//                         style={[
//                           styles.addressTypeButtonText,
//                           formData.type ===
//                             type &&
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
//               <View
//                 style={styles.formGroup}
//               >
//                 <Text
//                   style={styles.formLabel}
//                 >
//                   Address *
//                 </Text>

//                 <TextInput
//                   style={[
//                     styles.formInput,
//                     styles.formInputMultiline,
//                   ]}
//                   placeholder="Enter your address"
//                   value={formData.address}
//                   multiline
//                   numberOfLines={3}
//                   onChangeText={(text) =>
//                     setFormData({
//                       ...formData,
//                       address: text,
//                     })
//                   }
//                 />
//               </View>

//               {/* LANDMARK */}
//               <View
//                 style={styles.formGroup}
//               >
//                 <Text
//                   style={styles.formLabel}
//                 >
//                   Landmark
//                 </Text>

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
//               <View
//                 style={styles.formGroup}
//               >
//                 <Text
//                   style={styles.formLabel}
//                 >
//                   Phone Number
//                 </Text>

//                 <TextInput
//                   style={[
//                     styles.formInput,
//                     phoneError
//                       ? styles.formInputError
//                       : null,
//                   ]}
//                   placeholder="Enter 10-digit phone number"
//                   value={formData.phone}
//                   keyboardType="number-pad"
//                   maxLength={10}
//                   onChangeText={
//                     validatePhoneNumber
//                   }
//                 />

//                 {phoneError ? (
//                   <Text
//                     style={styles.errorText}
//                   >
//                     {phoneError}
//                   </Text>
//                 ) : null}

//                 <Text
//                   style={styles.hintText}
//                 >
//                   Enter exactly 10 digits
//                   (numbers only)
//                 </Text>
//               </View>

//               {/* CITY */}
//               <View
//                 style={styles.formGroup}
//               >
//                 <Text
//                   style={styles.formLabel}
//                 >
//                   City *
//                 </Text>

//                 <TouchableOpacity
//                   style={styles.formInput}
//                   onPress={() => {
//                     setCityDropdownOpen(
//                       !cityDropdownOpen
//                     );
//                     setStateDropdownOpen(
//                       false
//                     );
//                   }}
//                 >
//                   <View
//                     style={
//                       styles.dropdownTriggerRow
//                     }
//                   >
//                     <Text
//                       style={
//                         formData.city
//                           ? styles.dropdownValueText
//                           : styles.dropdownPlaceholderText
//                       }
//                     >
//                       {formData.city ||
//                         'Select City'}
//                     </Text>

//                     <Icon
//                       name={
//                         cityDropdownOpen
//                           ? 'chevron-up'
//                           : 'chevron-down'
//                       }
//                       size={16}
//                       color="#757575"
//                     />
//                   </View>
//                 </TouchableOpacity>

//                 {cityDropdownOpen && (
//                   <View
//                     style={
//                       styles.dropdownPanel
//                     }
//                   >
//                     <View
//                       style={
//                         styles.searchBox
//                       }
//                     >
//                       <Icon
//                         name="search-outline"
//                         size={18}
//                         color="#7e808c"
//                       />

//                       <TextInput
//                         style={
//                           styles.searchInput
//                         }
//                         placeholder="Search city"
//                         value={citySearch}
//                         onChangeText={
//                           setCitySearch
//                         }
//                         autoFocus
//                       />
//                     </View>

//                     <ScrollView
//                       style={
//                         styles.dropdownList
//                       }
//                       nestedScrollEnabled={
//                         true
//                       }
//                       keyboardShouldPersistTaps="handled"
//                     >
//                       {filteredCities.length ===
//                       0 ? (
//                         <Text
//                           style={
//                             styles.pickerEmptyText
//                           }
//                         >
//                           No cities found
//                         </Text>
//                       ) : (
//                         filteredCities.map(
//                           (item) => (
//                             <TouchableOpacity
//                               key={item}
//                               style={[
//                                 styles.pickerRow,
//                                 formData.city ===
//                                   item &&
//                                   styles.pickerRowActive,
//                               ]}
//                               onPress={() =>
//                                 handleSelectCity(
//                                   item
//                                 )
//                               }
//                             >
//                               <Text
//                                 style={[
//                                   styles.pickerRowText,
//                                   formData.city ===
//                                     item &&
//                                     styles.pickerRowTextActive,
//                                 ]}
//                               >
//                                 {item}
//                               </Text>

//                               {formData.city ===
//                                 item && (
//                                 <Icon
//                                   name="checkmark"
//                                   size={18}
//                                   color="#fc8019"
//                                 />
//                               )}
//                             </TouchableOpacity>
//                           )
//                         )
//                       )}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>

//               {/* STATE */}
//               <View
//                 style={styles.formGroup}
//               >
//                 <Text
//                   style={styles.formLabel}
//                 >
//                   State
//                 </Text>

//                 <TouchableOpacity
//                   style={styles.formInput}
//                   onPress={() => {
//                     setStateDropdownOpen(
//                       !stateDropdownOpen
//                     );
//                     setCityDropdownOpen(
//                       false
//                     );
//                   }}
//                 >
//                   <View
//                     style={
//                       styles.dropdownTriggerRow
//                     }
//                   >
//                     <Text
//                       style={
//                         formData.state
//                           ? styles.dropdownValueText
//                           : styles.dropdownPlaceholderText
//                       }
//                     >
//                       {formData.state ||
//                         'Select State'}
//                     </Text>

//                     <Icon
//                       name={
//                         stateDropdownOpen
//                           ? 'chevron-up'
//                           : 'chevron-down'
//                       }
//                       size={16}
//                       color="#757575"
//                     />
//                   </View>
//                 </TouchableOpacity>

//                 {stateDropdownOpen && (
//                   <View
//                     style={
//                       styles.dropdownPanel
//                     }
//                   >
//                     <View
//                       style={
//                         styles.searchBox
//                       }
//                     >
//                       <Icon
//                         name="search-outline"
//                         size={18}
//                         color="#7e808c"
//                       />

//                       <TextInput
//                         style={
//                           styles.searchInput
//                         }
//                         placeholder="Search state"
//                         value={stateSearch}
//                         onChangeText={
//                           setStateSearch
//                         }
//                         autoFocus
//                       />
//                     </View>

//                     <ScrollView
//                       style={
//                         styles.dropdownList
//                       }
//                       nestedScrollEnabled={
//                         true
//                       }
//                       keyboardShouldPersistTaps="handled"
//                     >
//                       {filteredStates.length ===
//                       0 ? (
//                         <Text
//                           style={
//                             styles.pickerEmptyText
//                           }
//                         >
//                           No states found
//                         </Text>
//                       ) : (
//                         filteredStates.map(
//                           (item) => (
//                             <TouchableOpacity
//                               key={item}
//                               style={[
//                                 styles.pickerRow,
//                                 formData.state ===
//                                   item &&
//                                   styles.pickerRowActive,
//                               ]}
//                               onPress={() =>
//                                 handleSelectState(
//                                   item
//                                 )
//                               }
//                             >
//                               <Text
//                                 style={[
//                                   styles.pickerRowText,
//                                   formData.state ===
//                                     item &&
//                                     styles.pickerRowTextActive,
//                                 ]}
//                               >
//                                 {item}
//                               </Text>

//                               {formData.state ===
//                                 item && (
//                                 <Icon
//                                   name="checkmark"
//                                   size={18}
//                                   color="#fc8019"
//                                 />
//                               )}
//                             </TouchableOpacity>
//                           )
//                         )
//                       )}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>

//               {/* PINCODE */}
//               <View
//                 style={styles.formGroup}
//               >
//                 <Text
//                   style={styles.formLabel}
//                 >
//                   Pincode *
//                 </Text>

//                 <TextInput
//                   style={[
//                     styles.formInput,
//                     pincodeError
//                       ? styles.formInputError
//                       : null,
//                   ]}
//                   placeholder="Enter 6-digit pincode"
//                   value={formData.pincode}
//                   keyboardType="number-pad"
//                   maxLength={6}
//                   onChangeText={
//                     validatePincode
//                   }
//                 />

//                 {pincodeError ? (
//                   <Text
//                     style={styles.errorText}
//                   >
//                     {pincodeError}
//                   </Text>
//                 ) : null}

//                 <Text
//                   style={styles.hintText}
//                 >
//                   Enter exactly 6 digits
//                   (numbers only)
//                 </Text>
//               </View>

//               {/* DEFAULT ADDRESS */}
//               <View
//                 style={styles.formGroup}
//               >
//                 <TouchableOpacity
//                   style={
//                     styles.defaultCheckbox
//                   }
//                   onPress={() =>
//                     setFormData({
//                       ...formData,
//                       isDefault:
//                         !formData.isDefault,
//                     })
//                   }
//                 >
//                   <Icon
//                     name={
//                       formData.isDefault
//                         ? 'checkbox'
//                         : 'square-outline'
//                     }
//                     size={24}
//                     color="#fc8019"
//                   />

//                   <Text
//                     style={
//                       styles.defaultCheckboxText
//                     }
//                   >
//                     Set as default address
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* LOCATION DETECTED */}
//               {formData.latitude !== 0 && (
//                 <View
//                   style={
//                     styles.locationDetected
//                   }
//                 >
//                   <Icon
//                     name="checkmark-circle"
//                     size={16}
//                     color="#28a745"
//                   />

//                   <Text
//                     style={
//                       styles.locationDetectedText
//                     }
//                   >
//                     Location detected ✓
//                   </Text>
//                 </View>
//               )}

//               {/* SAVE */}
//               <TouchableOpacity
//                 style={[
//                   styles.submitButton,
//                   isLoading &&
//                     styles.submitButtonDisabled,
//                 ]}
//                 onPress={
//                   handleAddAddress
//                 }
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator
//                     size="small"
//                     color="#ffffff"
//                   />
//                 ) : (
//                   <Text
//                     style={
//                       styles.submitButtonText
//                     }
//                   >
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
//     borderColor: '#fc8019',
//     borderStyle: 'dashed',
//   },

//   locationButtonText: {
//     color: '#fc8019',
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
//     borderColor: '#fc8019',
//     borderWidth: 2,
//     backgroundColor: '#fff8f0',
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
//     backgroundColor: '#fc8019',
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
//     backgroundColor: '#fff8f0',
//   },

//   pickerRowTextActive: {
//     color: '#fc8019',
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
//     borderColor: '#fc8019',
//     backgroundColor: '#fff8f0',
//   },

//   addressTypeButtonText: {
//     fontSize: 14,
//     color: '#757575',
//   },

//   addressTypeButtonTextActive: {
//     color: '#fc8019',
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
//     backgroundColor: '#fc8019',
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
=======
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AddressContext, Address } from '../../context/AddressContext';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const API_BASE_URL = 'http://localhost:3000'; // Change to your actual API URL (LAN IP for device testing)
let authToken: string | null = null;

// ✅ Indian States & Union Territories
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

// ✅ Major Indian Cities
const CITIES_BY_STATE: { [key: string]: string[] } = {
  'Andhra Pradesh': [
    'Visakhapatnam',
    'Vijayawada',
    'Guntur',
    'Nellore',
    'Kurnool',
    'Tirupati',
  ],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
  Assam: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  Chhattisgarh: ['Raipur', 'Bhilai', 'Bilaspur', 'Durg'],
  Goa: ['Panaji', 'Margao', 'Vasco da Gama'],
  Gujarat: [
    'Ahmedabad',
    'Surat',
    'Vadodara',
    'Rajkot',
    'Bhavnagar',
    'Gandhinagar',
  ],
  Haryana: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'],
  Kerala: [
    'Thiruvananthapuram',
    'Kochi',
    'Kozhikode',
    'Thrissur',
    'Kollam',
  ],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
  Manipur: ['Imphal'],
  Meghalaya: ['Shillong'],
  Mizoram: ['Aizawl'],
  Nagaland: ['Kohima', 'Dimapur'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  Sikkim: ['Gangtok'],
  'Tamil Nadu': [
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Tiruchirappalli',
    'Salem',
  ],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad'],
  Tripura: ['Agartala'],
  'Uttar Pradesh': [
    'Lucknow',
    'Kanpur',
    'Ghaziabad',
    'Agra',
    'Noida',
    'Varanasi',
  ],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
  'Andaman and Nicobar Islands': ['Port Blair'],
  Chandigarh: ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Silvassa'],
  Delhi: ['New Delhi', 'Delhi'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu'],
  Ladakh: ['Leh', 'Kargil'],
  Lakshadweep: ['Kavaratti'],
  Puducherry: ['Puducherry'],
};

// Flat list of every city
const ALL_CITIES = Array.from(
  new Set(Object.values(CITIES_BY_STATE).flat())
).sort();

interface AddressSelectionScreenProps {
  navigation: any;
  route: any;
}

const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({
  navigation,
  route,
}) => {
  const { totalAmount, restaurantName, cartItems } = route.params || {};

  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    setDefaultAddress,
    refreshAddresses,
  } = useContext(AddressContext);

  const { getTotalPrice, getTotalItems } = useContext(CartContext);

  const { user, updateUser } = useContext(AuthContext);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        authToken = token;
      }
    };

    loadToken();
  }, []);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

  // ✅ Validation error states
  const [phoneError, setPhoneError] = useState<string>('');
  const [pincodeError, setPincodeError] = useState<string>('');

  // ✅ City / State dropdowns
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');

  const [formData, setFormData] = useState({
    type: 'Home' as 'Home' | 'Work' | 'Other',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    phone: '',
    isDefault: false,
    latitude: 0,
    longitude: 0,
  });

  const totalPrice = totalAmount || getTotalPrice(); // ✅ Use totalAmount first

  const totalItems = getTotalItems();

  // ✅ City list depends on selected state
  const cityOptions =
    formData.state && CITIES_BY_STATE[formData.state]
      ? CITIES_BY_STATE[formData.state]
      : ALL_CITIES;

  const filteredStates = INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCities = cityOptions.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSelectState = (state: string) => {
    const stillValid = CITIES_BY_STATE[state]?.includes(formData.city);

    setFormData({
      ...formData,
      state,
      city: stillValid ? formData.city : '',
    });

    setStateSearch('');
    setStateDropdownOpen(false);
  };

  const handleSelectCity = (city: string) => {
    setFormData({
      ...formData,
      city,
    });

    setCitySearch('');
    setCityDropdownOpen(false);
  };

  // ✅ Phone number validation
  const validatePhoneNumber = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const limited = cleaned.slice(0, 10);

    setFormData({
      ...formData,
      phone: limited,
    });

    if (limited.length > 0 && limited.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  // ✅ Pincode validation
  const validatePincode = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const limited = cleaned.slice(0, 6);

    setFormData({
      ...formData,
      pincode: limited,
    });

    if (limited.length > 0 && limited.length !== 6) {
      setPincodeError('Pincode must be exactly 6 digits');
    } else {
      setPincodeError('');
    }
  };

  // ============================================================
  // ✅ GET CURRENT GPS LOCATION
  // Google Maps API is NOT used here
  // ============================================================
  const getCurrentLocation = async () => {
    setLocationError('');
    setGettingLocation(true);

    try {
      console.log('📍 Requesting location permission...');

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const message =
          'Location permission was denied. Please allow location permission from your browser/device settings.';

        setLocationError(message);
        Alert.alert('Location Permission', message);
        setGettingLocation(false);
        return;
      }

      console.log('📍 Getting current GPS location...');

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      console.log('📍 GPS LOCATION FOUND');
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

<<<<<<< HEAD
      try {
        const results = await Location.reverseGeocodeAsync({
=======
        const city =
          result.city ||
          result.district ||
          result.subregion ||
          '';

        const state = result.region || '';
        const pincode = result.postalCode || '';

        let formattedAddress = [
          result.name,
          result.street,
          result.streetNumber,
          result.city,
        ]
          .filter(Boolean)
          .join(', ');

        if (!formattedAddress) {
          formattedAddress = `${latitude}, ${longitude}`;
        }

        setFormData(prev => ({
          ...prev,
          address: formattedAddress,
          city,
          state,
          pincode,
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
          latitude,
          longitude,
        });

        console.log('📦 Reverse geocode result:', results);

        if (results.length > 0) {
          const result = results[0];

          const city =
            result.city ||
            result.district ||
            result.subregion ||
            '';

          const state = result.region || '';
          const pincode = result.postalCode || '';

          // let formattedAddress = [
          //   result.name,
          //   result.street,
          //   result.subLocality,
          //   result.city,
          // ]
          //   .filter(Boolean)
          //   .join(', ');
let formattedAddress = [
  result.name,
  result.street,
  result.district,
  result.city,
]
  .filter(Boolean)
  .join(', ');
          if (!formattedAddress) {
            formattedAddress = `${latitude}, ${longitude}`;
          }

          setFormData(prev => ({
            ...prev,
            address: formattedAddress,
            city,
            state,
            pincode,
            latitude,
            longitude,
          }));

          Alert.alert(
            '📍 Location Found!',
            `Address: ${formattedAddress}\n\nLatitude: ${latitude}\nLongitude: ${longitude}`
          );
        } else {
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
          }));

          Alert.alert(
            '📍 GPS Location Found',
            `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`
          );
        }
      } catch (geocodeError) {
        console.error('❌ Reverse geocoding error:', geocodeError);

        // GPS worked even if address lookup failed
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
        }));

        Alert.alert(
          '📍 GPS Location Found',
          `Latitude: ${latitude}\nLongitude: ${longitude}\n\nAddress lookup failed. Please enter your address manually.`
        );
      }
    } catch (error: any) {
      console.error('❌ GPS location error:', error);

      setLocationError(
        error?.message || 'Unable to get your current location.'
      );

      Alert.alert(
        '❌ Location Error',
        error?.message || 'Unable to get your current location.'
      );
    } finally {
      // VERY IMPORTANT
      setGettingLocation(false);
    }
  };
  // ✅ Mobile + Web
  const requestLocationPermission = () => {
    getCurrentLocation();
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'Home':
        return 'home-outline';
      case 'Work':
        return 'briefcase-outline';
      case 'Other':
        return 'location-outline';
      default:
        return 'location-outline';
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'Home':
        return '#4CAF50';
      case 'Work':
        return '#2196F3';
      case 'Other':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  // ✅ Select saved address
  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);

    navigation.navigate('PaymentScreen', {
      address: address,
      totalAmount: totalPrice,
      restaurantName: restaurantName,
      cartItems: cartItems,
      orderId: 'ORD-' + Date.now().toString().slice(-6),
    });
  };

  // ✅ Add address
  const handleAddAddress = async () => {
    // Validate required fields
    if (!formData.address || !formData.city || !formData.pincode) {
      Alert.alert('⚠️ Error', 'Please fill all required fields');
      return;
    }

    // ✅ Validate pincode
    if (formData.pincode.length !== 6) {
      setPincodeError('Pincode must be exactly 6 digits');

      Alert.alert(
        '⚠️ Error',
        'Pincode must be exactly 6 digits'
      );

      return;
    }

    // ✅ Validate phone
    if (
      formData.phone &&
      formData.phone.length !== 10
    ) {
      setPhoneError(
        'Phone number must be exactly 10 digits'
      );

      Alert.alert(
        '⚠️ Error',
        'Phone number must be exactly 10 digits'
      );

      return;
    }

    setPhoneError('');
    setPincodeError('');

    if (!user?.id) {
      Alert.alert(
        '⚠️ Error',
        'User not found. Please login again.'
      );

      return;
    }

    setIsLoading(true);

    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${
        formData.state || ''
      } - ${formData.pincode}`;

      // Single API call
      const ok = await updateUser({
        address: fullAddress,
      });

      if (!ok) {
        Alert.alert(
          '⚠️ Warning',
          'Failed to save address. Please try again.'
        );

        setIsLoading(false);
        return;
      }

      console.log(
        '✅ Address updated successfully'
      );

      // Save to local address context
      const newAddress: Address = {
        id: `addr_${Date.now()}`,
        type: formData.type,
        address: formData.address,
        city: formData.city,
        state: formData.state || '',
        pincode: formData.pincode,
        landmark: formData.landmark || '',
        phone: formData.phone || '',
        isDefault:
          addresses.length === 0 ||
          formData.isDefault,

        // ✅ GPS coordinates saved
        latitude:
          formData.latitude || undefined,

        longitude:
          formData.longitude || undefined,
      };

      addAddress(newAddress);

      setIsLoading(false);
      setShowAddAddressModal(false);

      resetForm();

      setSelectedAddress(newAddress);

      // Navigate to PaymentScreen
      navigation.navigate('PaymentScreen', {
        address: newAddress,
        totalAmount: totalPrice,
        restaurantName: restaurantName,
        cartItems: cartItems,
        orderId:
          'ORD-' +
          Date.now().toString().slice(-6),
      });
    } catch (error: any) {
      console.error(
        '❌ Error saving address:',
        error
      );

      Alert.alert(
        '❌ Error',
        error.message ||
          'Failed to save address. Please try again.'
      );

      setIsLoading(false);
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setFormData({
      type: 'Home',
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      phone: '',
      isDefault: false,
      latitude: 0,
      longitude: 0,
    });

    setPhoneError('');
    setPincodeError('');
    setCitySearch('');
    setStateSearch('');
    setCityDropdownOpen(false);
    setStateDropdownOpen(false);
  };

  // ============================================================
  // SAVED ADDRESS ITEM
  // ============================================================
  const renderAddressItem = ({
    item,
  }: {
    item: Address;
  }) => {
    const isSelected =
      selectedAddress?.id === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.addressCard,
          isSelected &&
            styles.addressCardSelected,
        ]}
        onPress={() =>
          handleSelectAddress(item)
        }
        activeOpacity={0.7}
      >
        <View style={styles.addressHeader}>
          <View
            style={
              styles.addressTypeContainer
            }
          >
            <Icon
              name={getAddressTypeIcon(
                item.type
              )}
              size={18}
              color={getAddressTypeColor(
                item.type
              )}
            />

            <Text
              style={styles.addressTypeText}
            >
              {item.type}
            </Text>
          </View>

          {item.isDefault && (
            <View
              style={styles.defaultBadge}
            >
              <Text
                style={
                  styles.defaultBadgeText
                }
              >
                Default
              </Text>
            </View>
          )}

          {isSelected && (
            <Icon
              name="checkmark-circle"
              size={22}
              color="#4CAF50"
              style={styles.selectedIcon}
            />
          )}
        </View>

        <Text style={styles.addressDetail}>
          {item.address}
        </Text>

        {item.landmark && (
          <Text style={styles.addressDetail}>
            📍 {item.landmark}
          </Text>
        )}

        {item.phone && (
          <Text style={styles.addressPhone}>
            📞 {item.phone}
          </Text>
        )}

        <Text style={styles.addressDetail}>
          {item.city}, {item.state || ''} -{' '}
          {item.pincode}
        </Text>

        {item.latitude &&
          item.longitude && (
            <View
              style={styles.locationTag}
            >
              <Icon
                name="location-outline"
                size={12}
                color="#28a745"
              />

              <Text
                style={
                  styles.locationTagText
                }
              >
                Live location
              </Text>
            </View>
          )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backButton}
        >
          <Icon
            name="arrow-back"
            size={24}
            color="#282c3f"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Delivery Address
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            setShowAddAddressModal(true)
          }
        >
          <Icon
            name="add-circle-outline"
            size={28}
            color="#fc8019"
          />
        </TouchableOpacity>
      </View>

      {/* CURRENT LOCATION */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={
          requestLocationPermission
        }
        disabled={gettingLocation}
      >
        {gettingLocation ? (
          <ActivityIndicator
            size="small"
            color="#fc8019"
          />
        ) : (
          <>
            <Icon
              name="locate-outline"
              size={22}
              color="#fc8019"
            />

            <Text
              style={
                styles.locationButtonText
              }
            >
              Use Current Location
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* SAVED ADDRESSES */}
      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          styles.addressList
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          addresses.length > 0 ? (
            <Text
              style={styles.listHeader}
            >
              Saved Addresses
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <Icon
              name="location-outline"
              size={60}
              color="#ccc"
            />

            <Text
              style={styles.emptyText}
            >
              No Addresses Saved
            </Text>

            <Text
              style={styles.emptySubText}
            >
              Add a new address
            </Text>
          </View>
        }
      />

      {/* BOTTOM BAR */}
      {selectedAddress && (
        <View style={styles.bottomBar}>
          <View
            style={styles.bottomBarLeft}
          >
            <Text
              style={styles.bottomBarTotal}
            >
              ₹{totalPrice}
            </Text>

            <Text
              style={styles.bottomBarItems}
            >
              {totalItems} items
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deliverButton}
            onPress={() =>
              handleSelectAddress(
                selectedAddress
              )
            }
          >
            <Text
              style={
                styles.deliverButtonText
              }
            >
              Deliver to{' '}
              {selectedAddress.type}
            </Text>

            <Icon
              name="arrow-forward"
              size={18}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      )}

      {/* ADD ADDRESS MODAL */}
      <Modal
        visible={showAddAddressModal}
        animationType="slide"
        transparent={true}
      >
        <View
          style={styles.modalContainer}
        >
          <View
            style={styles.modalContent}
          >
            {/* MODAL HEADER */}
            <View
              style={styles.modalHeader}
            >
              <Text
                style={styles.modalTitle}
              >
                Add New Address
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setShowAddAddressModal(
                    false
                  );
                  resetForm();
                }}
              >
                <Icon
                  name="close"
                  size={24}
                  color="#282c3f"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              nestedScrollEnabled={true}
            >
              {/* ADDRESS TYPE */}
              <View
                style={styles.formGroup}
              >
                <Text
                  style={styles.formLabel}
                >
                  Address Type
                </Text>

                <View
                  style={
                    styles.addressTypeButtons
                  }
                >
                  {[
                    'Home',
                    'Work',
                    'Other',
                  ].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.addressTypeButton,
                        formData.type ===
                          type &&
                          styles.addressTypeButtonActive,
                      ]}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          type: type as
                            | 'Home'
                            | 'Work'
                            | 'Other',
                        })
                      }
                    >
                      <Icon
                        name={getAddressTypeIcon(
                          type
                        )}
                        size={18}
                        color={
                          formData.type ===
                          type
                            ? '#fc8019'
                            : '#757575'
                        }
                      />

                      <Text
                        style={[
                          styles.addressTypeButtonText,
                          formData.type ===
                            type &&
                            styles.addressTypeButtonTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* ADDRESS */}
              <View
                style={styles.formGroup}
              >
                <Text
                  style={styles.formLabel}
                >
                  Address *
                </Text>

                <TextInput
                  style={[
                    styles.formInput,
                    styles.formInputMultiline,
                  ]}
                  placeholder="Enter your address"
                  value={formData.address}
                  multiline
                  numberOfLines={3}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      address: text,
                    })
                  }
                />
              </View>

              {/* LANDMARK */}
              <View
                style={styles.formGroup}
              >
                <Text
                  style={styles.formLabel}
                >
                  Landmark
                </Text>

                <TextInput
                  style={styles.formInput}
                  placeholder="Nearby landmark (optional)"
                  value={formData.landmark}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      landmark: text,
                    })
                  }
                />
              </View>

              {/* PHONE */}
              <View
                style={styles.formGroup}
              >
                <Text
                  style={styles.formLabel}
                >
                  Phone Number
                </Text>

                <TextInput
                  style={[
                    styles.formInput,
                    phoneError
                      ? styles.formInputError
                      : null,
                  ]}
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={
                    validatePhoneNumber
                  }
                />

                {phoneError ? (
                  <Text
                    style={styles.errorText}
                  >
                    {phoneError}
                  </Text>
                ) : null}

                <Text
                  style={styles.hintText}
                >
                  Enter exactly 10 digits
                  (numbers only)
                </Text>
              </View>

              {/* CITY */}
              <View
                style={styles.formGroup}
              >
                <Text
                  style={styles.formLabel}
                >
                  City *
                </Text>

                <TouchableOpacity
                  style={styles.formInput}
                  onPress={() => {
                    setCityDropdownOpen(
                      !cityDropdownOpen
                    );
                    setStateDropdownOpen(
                      false
                    );
                  }}
                >
                  <View
                    style={
                      styles.dropdownTriggerRow
                    }
                  >
                    <Text
                      style={
                        formData.city
                          ? styles.dropdownValueText
                          : styles.dropdownPlaceholderText
                      }
                    >
                      {formData.city ||
                        'Select City'}
                    </Text>

                    <Icon
                      name={
                        cityDropdownOpen
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={16}
                      color="#757575"
                    />
                  </View>
                </TouchableOpacity>

                {cityDropdownOpen && (
                  <View
                    style={
                      styles.dropdownPanel
                    }
                  >
                    <View
                      style={
                        styles.searchBox
                      }
                    >
                      <Icon
                        name="search-outline"
                        size={18}
                        color="#7e808c"
                      />

                      <TextInput
                        style={
                          styles.searchInput
                        }
                        placeholder="Search city"
                        value={citySearch}
                        onChangeText={
                          setCitySearch
                        }
                        autoFocus
                      />
                    </View>

                    <ScrollView
                      style={
                        styles.dropdownList
                      }
                      nestedScrollEnabled={
                        true
                      }
                      keyboardShouldPersistTaps="handled"
                    >
                      {filteredCities.length ===
                      0 ? (
                        <Text
                          style={
                            styles.pickerEmptyText
                          }
                        >
                          No cities found
                        </Text>
                      ) : (
                        filteredCities.map(
                          (item) => (
                            <TouchableOpacity
                              key={item}
                              style={[
                                styles.pickerRow,
                                formData.city ===
                                  item &&
                                  styles.pickerRowActive,
                              ]}
                              onPress={() =>
                                handleSelectCity(
                                  item
                                )
                              }
                            >
                              <Text
                                style={[
                                  styles.pickerRowText,
                                  formData.city ===
                                    item &&
                                    styles.pickerRowTextActive,
                                ]}
                              >
                                {item}
                              </Text>

                              {formData.city ===
                                item && (
                                <Icon
                                  name="checkmark"
                                  size={18}
                                  color="#fc8019"
                                />
                              )}
                            </TouchableOpacity>
                          )
                        )
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* STATE */}
              <View
                style={styles.formGroup}
              >
                <Text
                  style={styles.formLabel}
                >
                  State
                </Text>

                <TouchableOpacity
                  style={styles.formInput}
                  onPress={() => {
                    setStateDropdownOpen(
                      !stateDropdownOpen
                    );
                    setCityDropdownOpen(
                      false
                    );
                  }}
                >
                  <View
                    style={
                      styles.dropdownTriggerRow
                    }
                  >
                    <Text
                      style={
                        formData.state
                          ? styles.dropdownValueText
                          : styles.dropdownPlaceholderText
                      }
                    >
                      {formData.state ||
                        'Select State'}
                    </Text>

                    <Icon
                      name={
                        stateDropdownOpen
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={16}
                      color="#757575"
                    />
                  </View>
                </TouchableOpacity>

                {stateDropdownOpen && (
                  <View
                    style={
                      styles.dropdownPanel
                    }
                  >
                    <View
                      style={
                        styles.searchBox
                      }
                    >
                      <Icon
                        name="search-outline"
                        size={18}
                        color="#7e808c"
                      />

                      <TextInput
                        style={
                          styles.searchInput
                        }
                        placeholder="Search state"
                        value={stateSearch}
                        onChangeText={
                          setStateSearch
                        }
                        autoFocus
                      />
                    </View>

                    <ScrollView
                      style={
                        styles.dropdownList
                      }
                      nestedScrollEnabled={
                        true
                      }
                      keyboardShouldPersistTaps="handled"
                    >
                      {filteredStates.length ===
                      0 ? (
                        <Text
                          style={
                            styles.pickerEmptyText
                          }
                        >
                          No states found
                        </Text>
                      ) : (
                        filteredStates.map(
                          (item) => (
                            <TouchableOpacity
                              key={item}
                              style={[
                                styles.pickerRow,
                                formData.state ===
                                  item &&
                                  styles.pickerRowActive,
                              ]}
                              onPress={() =>
                                handleSelectState(
                                  item
                                )
                              }
                            >
                              <Text
                                style={[
                                  styles.pickerRowText,
                                  formData.state ===
                                    item &&
                                    styles.pickerRowTextActive,
                                ]}
                              >
                                {item}
                              </Text>

                              {formData.state ===
                                item && (
                                <Icon
                                  name="checkmark"
                                  size={18}
                                  color="#fc8019"
                                />
                              )}
                            </TouchableOpacity>
                          )
                        )
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* PINCODE */}
              <View
                style={styles.formGroup}
              >
                <Text
                  style={styles.formLabel}
                >
                  Pincode *
                </Text>

                <TextInput
                  style={[
                    styles.formInput,
                    pincodeError
                      ? styles.formInputError
                      : null,
                  ]}
                  placeholder="Enter 6-digit pincode"
                  value={formData.pincode}
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={
                    validatePincode
                  }
                />

                {pincodeError ? (
                  <Text
                    style={styles.errorText}
                  >
                    {pincodeError}
                  </Text>
                ) : null}

                <Text
                  style={styles.hintText}
                >
                  Enter exactly 6 digits
                  (numbers only)
                </Text>
              </View>

              {/* DEFAULT ADDRESS */}
              <View
                style={styles.formGroup}
              >
                <TouchableOpacity
                  style={
                    styles.defaultCheckbox
                  }
                  onPress={() =>
                    setFormData({
                      ...formData,
                      isDefault:
                        !formData.isDefault,
                    })
                  }
                >
                  <Icon
                    name={
                      formData.isDefault
                        ? 'checkbox'
                        : 'square-outline'
                    }
                    size={24}
                    color="#fc8019"
                  />

                  <Text
                    style={
                      styles.defaultCheckboxText
                    }
                  >
                    Set as default address
                  </Text>
                </TouchableOpacity>
              </View>

              {/* LOCATION DETECTED */}
              {formData.latitude !== 0 && (
                <View
                  style={
                    styles.locationDetected
                  }
                >
                  <Icon
                    name="checkmark-circle"
                    size={16}
                    color="#28a745"
                  />

                  <Text
                    style={
                      styles.locationDetectedText
                    }
                  >
                    Location detected ✓
                  </Text>
                </View>
              )}

              {/* SAVE */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading &&
                    styles.submitButtonDisabled,
                ]}
                onPress={
                  handleAddAddress
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                  />
                ) : (
                  <Text
                    style={
                      styles.submitButtonText
                    }
                  >
                    Save Address & Proceed
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
    textAlign: 'center',
  },

  addButton: {
    padding: 4,
  },

  locationButton: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fc8019',
    borderStyle: 'dashed',
  },

  locationButtonText: {
    color: '#fc8019',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 12,
  },

  addressList: {
    padding: 16,
    paddingBottom: 120,
  },

  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },

  addressCardSelected: {
    borderColor: '#fc8019',
    borderWidth: 2,
    backgroundColor: '#fff8f0',
  },

  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },

  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },

  addressTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginLeft: 4,
  },

  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },

  defaultBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },

  selectedIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },

  addressDetail: {
    fontSize: 14,
    color: '#282c3f',
    marginBottom: 2,
  },

  addressPhone: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },

  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  locationTagText: {
    fontSize: 11,
    color: '#28a745',
    marginLeft: 4,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#282c3f',
    marginTop: 16,
  },

  emptySubText: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 8,
    marginBottom: 24,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 4,
  },

  bottomBarLeft: {
    flexDirection: 'column',
  },

  bottomBarTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#282c3f',
  },

  bottomBarItems: {
    fontSize: 12,
    color: '#7e808c',
  },

  deliverButton: {
    backgroundColor: '#fc8019',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  deliverButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },

  pickerModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282c3f',
  },

  dropdownTriggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownPanel: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  dropdownList: {
    maxHeight: 220,
  },

  pickerRowActive: {
    backgroundColor: '#fff8f0',
  },

  pickerRowTextActive: {
    color: '#fc8019',
    fontWeight: '600',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },

  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  pickerRowText: {
    fontSize: 15,
    color: '#282c3f',
  },

  pickerEmptyText: {
    textAlign: 'center',
    color: '#7e808c',
    paddingVertical: 24,
    fontSize: 14,
  },

  dropdownValueText: {
    fontSize: 14,
    color: '#282c3f',
  },

  dropdownPlaceholderText: {
    fontSize: 14,
    color: '#9e9e9e',
  },

  formGroup: {
    marginBottom: 16,
  },

  formRow: {
    flexDirection: 'row',
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282c3f',
    marginBottom: 6,
  },

  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
  },

  formInputError: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },

  formInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },

  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },

  hintText: {
    color: '#7e808c',
    fontSize: 11,
    marginTop: 2,
  },

  addressTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  addressTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },

  addressTypeButtonActive: {
    borderColor: '#fc8019',
    backgroundColor: '#fff8f0',
  },

  addressTypeButtonText: {
    fontSize: 14,
    color: '#757575',
  },

  addressTypeButtonTextActive: {
    color: '#fc8019',
    fontWeight: '600',
  },

  defaultCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },

  defaultCheckboxText: {
    fontSize: 14,
    color: '#282c3f',
    marginLeft: 8,
  },

  locationDetected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },

  locationDetectedText: {
    fontSize: 13,
    color: '#28a745',
    marginLeft: 8,
    flex: 1,
  },

  submitButton: {
    backgroundColor: '#fc8019',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },

  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressSelectionScreen;
