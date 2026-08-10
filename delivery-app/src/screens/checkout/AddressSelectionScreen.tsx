// // // // // // // // screens/checkout/AddressSelectionScreen.tsx
// // // // // // // import React, { useState, useContext } from 'react';
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
// // // // // // // } from 'react-native';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // import { AddressContext, Address } from '../../context/AddressContext';
// // // // // // // import { CartContext } from '../../context/CartContext';

// // // // // // // interface AddressSelectionScreenProps {
// // // // // // //   navigation: any;
// // // // // // //   route: any;
// // // // // // // }

// // // // // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // // // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // // // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress } = useContext(AddressContext);
// // // // // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);

// // // // // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // // // // //   const [isLoading, setIsLoading] = useState(false);

// // // // // // //   // New address form state - matches your Address interface
// // // // // // //   const [formData, setFormData] = useState({
// // // // // // //     type: 'Home' as 'Home' | 'Work' | 'Other',
// // // // // // //     address: '',
// // // // // // //     city: '',
// // // // // // //     state: '',
// // // // // // //     pincode: '',
// // // // // // //     landmark: '',
// // // // // // //     phone: '',
// // // // // // //     isDefault: false,
// // // // // // //   });

// // // // // // //   const totalPrice = getTotalPrice() || totalAmount;
// // // // // // //   const totalItems = getTotalItems();

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

// // // // // // //   const handleSelectAddress = (address: Address) => {
// // // // // // //     setSelectedAddress(address);
// // // // // // //     // Navigate to Payment Screen
// // // // // // //     navigation.navigate('Payment', {
// // // // // // //       address: address,
// // // // // // //       totalAmount: totalPrice,
// // // // // // //       restaurantName: restaurantName,
// // // // // // //       cartItems: cartItems,
// // // // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const handleAddAddress = async () => {
// // // // // // //     // Validate form
// // // // // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // // // // //       Alert.alert('⚠️ Error', 'Please fill all required fields (Address, City, Pincode)');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setIsLoading(true);

// // // // // // //     const newAddress: Address = {
// // // // // // //       id: `addr_${Date.now()}`,
// // // // // // //       type: formData.type,
// // // // // // //       address: formData.address,
// // // // // // //       city: formData.city,
// // // // // // //       state: formData.state || '',
// // // // // // //       pincode: formData.pincode,
// // // // // // //       landmark: formData.landmark || '',
// // // // // // //       phone: formData.phone || '',
// // // // // // //       isDefault: addresses.length === 0 || formData.isDefault,
// // // // // // //     };

// // // // // // //     addAddress(newAddress);
// // // // // // //     setIsLoading(false);
// // // // // // //     setShowAddAddressModal(false);
// // // // // // //     resetForm();
    
// // // // // // //     // Select the new address and navigate to payment
// // // // // // //     setSelectedAddress(newAddress);
// // // // // // //     navigation.navigate('Payment', {
// // // // // // //       address: newAddress,
// // // // // // //       totalAmount: totalPrice,
// // // // // // //       restaurantName: restaurantName,
// // // // // // //       cartItems: cartItems,
// // // // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // // //     });
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
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const renderAddressItem = ({ item }: { item: Address }) => {
// // // // // // //     const isSelected = selectedAddress?.id === item.id;
    
// // // // // // //     return (
// // // // // // //       <TouchableOpacity
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
// // // // // // //           {item.city}, {item.state} - {item.pincode}
// // // // // // //         </Text>
// // // // // // //       </TouchableOpacity>
// // // // // // //     );
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // //       {/* Header */}
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

// // // // // // //       {/* Address List */}
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
// // // // // // //             <Text style={styles.emptySubText}>Add a new address to continue</Text>
// // // // // // //           </View>
// // // // // // //         }
// // // // // // //       />

// // // // // // //       {/* Bottom Bar - Shows when address is selected */}
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

// // // // // // //       {/* Add Address Modal */}
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
// // // // // // //                   placeholder="Enter your address (House No, Street, Area)"
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
// // // // // // //   addressList: {
// // // // // // //     padding: 16,
// // // // // // //     paddingBottom: 120,
// // // // // // //   },
// // // // // // //   listHeader: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 12,
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
// // // // // // // screens/checkout/AddressSelectionScreen.tsx
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

// // // // // // interface AddressSelectionScreenProps {
// // // // // //   navigation: any;
// // // // // //   route: any;
// // // // // // }

// // // // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // // // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);

// // // // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // // //   const [gettingLocation, setGettingLocation] = useState(false);

// // // // // //   // New address form state
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

// // // // // //   // ✅ Get current location for WEB
// // // // // //   const getCurrentLocationWeb = () => {
// // // // // //     if (!navigator.geolocation) {
// // // // // //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// // // // // //       return;
// // // // // //     }

// // // // // //     setGettingLocation(true);

// // // // // //     navigator.geolocation.getCurrentPosition(
// // // // // //       async (position) => {
// // // // // //         const { latitude, longitude } = position.coords;
// // // // // //         console.log('📍 Current location:', latitude, longitude);
        
// // // // // //         setGettingLocation(false);
        
// // // // // //         // ✅ Reverse geocode to get address from coordinates
// // // // // //         try {
// // // // // //           const address = await reverseGeocode(latitude, longitude);
// // // // // //           if (address) {
// // // // // //             setFormData({
// // // // // //               ...formData,
// // // // // //               address: address.address || '',
// // // // // //               city: address.city || '',
// // // // // //               state: address.state || '',
// // // // // //               pincode: address.pincode || '',
// // // // // //               latitude,
// // // // // //               longitude,
// // // // // //             });
            
// // // // // //             Alert.alert(
// // // // // //               '📍 Location Found!',
// // // // // //               `Address: ${address.address}\nCity: ${address.city}\nState: ${address.state}`,
// // // // // //               [{ text: 'OK' }]
// // // // // //             );
// // // // // //           } else {
// // // // // //             Alert.alert(
// // // // // //               '📍 Location Found!',
// // // // // //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address details.`,
// // // // // //               [{ text: 'OK' }]
// // // // // //             );
// // // // // //             setFormData({ ...formData, latitude, longitude });
// // // // // //           }
// // // // // //         } catch (error) {
// // // // // //           console.error('❌ Reverse geocode error:', error);
// // // // // //           Alert.alert(
// // // // // //             '📍 Location Found!',
// // // // // //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address details.`,
// // // // // //             [{ text: 'OK' }]
// // // // // //           );
// // // // // //           setFormData({ ...formData, latitude, longitude });
// // // // // //         }
// // // // // //       },
// // // // // //       (error) => {
// // // // // //         console.error('❌ Location error:', error);
// // // // // //         setGettingLocation(false);
        
// // // // // //         let errorMessage = 'Unable to get your location. Please enter your address manually.';
// // // // // //         if (error.message) {
// // // // // //           errorMessage = error.message;
// // // // // //         }
        
// // // // // //         Alert.alert(
// // // // // //           '❌ Location Error',
// // // // // //           errorMessage,
// // // // // //           [{ text: 'OK' }]
// // // // // //         );
// // // // // //       },
// // // // // //       { 
// // // // // //         enableHighAccuracy: true, 
// // // // // //         timeout: 15000, 
// // // // // //         maximumAge: 10000 
// // // // // //       }
// // // // // //     );
// // // // // //   };

// // // // // //   // ✅ Reverse geocode using OpenStreetMap Nominatim (FREE, no API key needed)
// // // // // //   const reverseGeocode = async (lat: number, lng: number) => {
// // // // // //     try {
// // // // // //       const response = await fetch(
// // // // // //         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
// // // // // //       );
// // // // // //       const data = await response.json();
      
// // // // // //       if (data && data.address) {
// // // // // //         const address = data.address;
// // // // // //         return {
// // // // // //           address: [
// // // // // //             address.house_number,
// // // // // //             address.road,
// // // // // //             address.suburb,
// // // // // //             address.neighbourhood
// // // // // //           ].filter(Boolean).join(', ') || address.road || '',
// // // // // //           city: address.city || address.town || address.village || '',
// // // // // //           state: address.state || '',
// // // // // //           pincode: address.postcode || '',
// // // // // //         };
// // // // // //       }
// // // // // //       return null;
// // // // // //     } catch (error) {
// // // // // //       console.error('❌ Reverse geocode error:', error);
// // // // // //       return null;
// // // // // //     }
// // // // // //   };

// // // // // //   // ✅ Handle location based on platform
// // // // // //   const requestLocationPermission = () => {
// // // // // //     if (Platform.OS === 'web') {
// // // // // //       getCurrentLocationWeb();
// // // // // //     } else {
// // // // // //       // For mobile, you can use react-native-geolocation-service
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

// // // // // //   const handleSelectAddress = (address: Address) => {
// // // // // //     setSelectedAddress(address);
// // // // // //     // Navigate to Payment Screen
// // // // // //     navigation.navigate('PaymentScreen', {
// // // // // //       address: address,
// // // // // //       totalAmount: totalPrice,
// // // // // //       restaurantName: restaurantName,
// // // // // //       cartItems: cartItems,
// // // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // //     });
// // // // // //   };

// // // // // //   const handleAddAddress = async () => {
// // // // // //     // Validate form
// // // // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // // // //       Alert.alert('⚠️ Error', 'Please fill all required fields (Address, City, Pincode)');
// // // // // //       return;
// // // // // //     }

// // // // // //     setIsLoading(true);

// // // // // //     const newAddress: Address = {
// // // // // //       id: `addr_${Date.now()}`,
// // // // // //       type: formData.type,
// // // // // //       address: formData.address,
// // // // // //       city: formData.city,
// // // // // //       state: formData.state || '',
// // // // // //       pincode: formData.pincode,
// // // // // //       landmark: formData.landmark || '',
// // // // // //       phone: formData.phone || '',
// // // // // //       isDefault: addresses.length === 0 || formData.isDefault,
// // // // // //       latitude: formData.latitude || undefined,
// // // // // //       longitude: formData.longitude || undefined,
// // // // // //     };

// // // // // //     addAddress(newAddress);
// // // // // //     setIsLoading(false);
// // // // // //     setShowAddAddressModal(false);
// // // // // //     resetForm();
    
// // // // // //     // Select the new address and navigate to payment
// // // // // //     setSelectedAddress(newAddress);
// // // // // //     navigation.navigate('PaymentScreen', {
// // // // // //       address: newAddress,
// // // // // //       totalAmount: totalPrice,
// // // // // //       restaurantName: restaurantName,
// // // // // //       cartItems: cartItems,
// // // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // // //     });
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
// // // // // //   };

// // // // // //   const renderAddressItem = ({ item }: { item: Address }) => {
// // // // // //     const isSelected = selectedAddress?.id === item.id;
    
// // // // // //     return (
// // // // // //       <TouchableOpacity
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
      
// // // // // //       {/* Header */}
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

// // // // // //       {/* ✅ Use Current Location Button - Live Address */}
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

// // // // // //       {/* Address List - DYNAMIC, No Hardcoded */}
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
// // // // // //             <Text style={styles.emptySubText}>Add a new address or use current location</Text>
// // // // // //           </View>
// // // // // //         }
// // // // // //       />

// // // // // //       {/* Bottom Bar - Shows when address is selected */}
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

// // // // // //       {/* Add Address Modal */}
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
// // // // // //                   placeholder="Enter your address (House No, Street, Area)"
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

// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // // // // //                 <TextInput
// // // // // //                   style={styles.formInput}
// // // // // //                   placeholder="Enter phone number (optional)"
// // // // // //                   value={formData.phone}
// // // // // //                   keyboardType="phone-pad"
// // // // // //                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
// // // // // //                 />
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

// // // // // //               <View style={styles.formGroup}>
// // // // // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // // // // //                 <TextInput
// // // // // //                   style={styles.formInput}
// // // // // //                   placeholder="Pincode"
// // // // // //                   value={formData.pincode}
// // // // // //                   keyboardType="number-pad"
// // // // // //                   onChangeText={(text) => setFormData({ ...formData, pincode: text })}
// // // // // //                 />
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

// // // // // //               {/* ✅ Show location if detected */}
// // // // // //               {formData.latitude !== 0 && (
// // // // // //                 <View style={styles.locationDetected}>
// // // // // //                   <Icon name="checkmark-circle" size={16} color="#28a745" />
// // // // // //                   <Text style={styles.locationDetectedText}>
// // // // // //                     Location detected ✓ (Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)})
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
// // // // // //   formInputMultiline: {
// // // // // //     height: 80,
// // // // // //     textAlignVertical: 'top',
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
// // // // // // screens/checkout/AddressSelectionScreen.tsx
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

// // // // // // ✅ Get Google Maps API Key from .env
// // // // // // const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
// // // // // // ✅ NEW - Import from @env
// // // // // // import { GOOGLE_MAPS_API_KEY } from '@env';
// // // // // const GOOGLE_MAPS_API_KEY = 'AIzaSyDD71FtmPmf0VuS1JjpO0zjKMl6VrpJ2eI';

// // // // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');
// // // // // console.log('🔑 API Key length:', GOOGLE_MAPS_API_KEY?.length || 0);
// // // // // interface AddressSelectionScreenProps {
// // // // //   navigation: any;
// // // // //   route: any;
// // // // // }

// // // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);

// // // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // // //   const [isLoading, setIsLoading] = useState(false);
// // // // //   const [gettingLocation, setGettingLocation] = useState(false);

// // // // //   // New address form state
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

// // // // //   // ✅ Get current location using Google Maps Geocoding API
// // // // //   const getCurrentLocationWeb = () => {
// // // // //     if (!navigator.geolocation) {
// // // // //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// // // // //       return;
// // // // //     }

// // // // //     if (!GOOGLE_MAPS_API_KEY) {
// // // // //       Alert.alert('⚠️ Error', 'Google Maps API Key is missing. Please add it to your .env file.');
// // // // //       return;
// // // // //     }

// // // // //     setGettingLocation(true);

// // // // //     navigator.geolocation.getCurrentPosition(
// // // // //       async (position) => {
// // // // //         const { latitude, longitude } = position.coords;
// // // // //         console.log('📍 Current location:', latitude, longitude);
        
// // // // //         try {
// // // // //           // ✅ Use Google Maps Geocoding API to get address
// // // // //           const response = await fetch(
// // // // //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
// // // // //           );
// // // // //           const data = await response.json();
          
// // // // //           if (data.status === 'OK' && data.results.length > 0) {
// // // // //             const result = data.results[0];
// // // // //             const addressComponents = result.address_components;
            
// // // // //             // Extract address components
// // // // //             let city = '';
// // // // //             let state = '';
// // // // //             let pincode = '';
// // // // //             let formattedAddress = result.formatted_address || '';
            
// // // // //             addressComponents.forEach((component: any) => {
// // // // //               if (component.types.includes('locality') || component.types.includes('sublocality')) {
// // // // //                 city = component.long_name;
// // // // //               }
// // // // //               if (component.types.includes('administrative_area_level_1')) {
// // // // //                 state = component.long_name;
// // // // //               }
// // // // //               if (component.types.includes('postal_code')) {
// // // // //                 pincode = component.long_name;
// // // // //               }
// // // // //             });

// // // // //             // Try to get more precise address
// // // // //             const streetNumber = result.address_components.find((c: any) => c.types.includes('street_number'))?.long_name || '';
// // // // //             const route = result.address_components.find((c: any) => c.types.includes('route'))?.long_name || '';
// // // // //             const neighborhood = result.address_components.find((c: any) => c.types.includes('neighborhood'))?.long_name || '';
            
// // // // //             let fullAddress = formattedAddress;
// // // // //             if (streetNumber && route) {
// // // // //               fullAddress = `${streetNumber} ${route}`;
// // // // //               if (neighborhood) fullAddress += `, ${neighborhood}`;
// // // // //             }

// // // // //             setGettingLocation(false);
            
// // // // //             setFormData({
// // // // //               ...formData,
// // // // //               address: fullAddress,
// // // // //               city: city,
// // // // //               state: state,
// // // // //               pincode: pincode,
// // // // //               latitude,
// // // // //               longitude,
// // // // //             });
            
// // // // //             Alert.alert(
// // // // //               '📍 Location Found!',
// // // // //               `Address: ${fullAddress}\nCity: ${city}\nState: ${state}\nPincode: ${pincode}`,
// // // // //               [{ text: 'OK' }]
// // // // //             );
// // // // //           } else {
// // // // //             setGettingLocation(false);
// // // // //             Alert.alert(
// // // // //               '📍 Location Found!',
// // // // //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address details manually.`,
// // // // //               [{ text: 'OK' }]
// // // // //             );
// // // // //             setFormData({ ...formData, latitude, longitude });
// // // // //           }
// // // // //         } catch (error) {
// // // // //           console.error('❌ Geocode error:', error);
// // // // //           setGettingLocation(false);
// // // // //           Alert.alert(
// // // // //             '📍 Location Found!',
// // // // //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address details manually.`,
// // // // //             [{ text: 'OK' }]
// // // // //           );
// // // // //           setFormData({ ...formData, latitude, longitude });
// // // // //         }
// // // // //       },
// // // // //       (error) => {
// // // // //         console.error('❌ Location error:', error);
// // // // //         setGettingLocation(false);
        
// // // // //         let errorMessage = 'Unable to get your location. Please enter your address manually.';
// // // // //         if (error.message) {
// // // // //           errorMessage = error.message;
// // // // //         }
        
// // // // //         Alert.alert(
// // // // //           '❌ Location Error',
// // // // //           errorMessage,
// // // // //           [{ text: 'OK' }]
// // // // //         );
// // // // //       },
// // // // //       { 
// // // // //         enableHighAccuracy: true, 
// // // // //         timeout: 30000, 
// // // // //         maximumAge: 10000 
// // // // //       }
// // // // //     );
// // // // //   };

// // // // //   // ✅ Handle location based on platform
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

// // // // //   const handleSelectAddress = (address: Address) => {
// // // // //     setSelectedAddress(address);
// // // // //     navigation.navigate('PaymentScreen', {
// // // // //       address: address,
// // // // //       totalAmount: totalPrice,
// // // // //       restaurantName: restaurantName,
// // // // //       cartItems: cartItems,
// // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // //     });
// // // // //   };

// // // // //   const handleAddAddress = async () => {
// // // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // // //       Alert.alert('⚠️ Error', 'Please fill all required fields (Address, City, Pincode)');
// // // // //       return;
// // // // //     }

// // // // //     setIsLoading(true);

// // // // //     const newAddress: Address = {
// // // // //       id: `addr_${Date.now()}`,
// // // // //       type: formData.type,
// // // // //       address: formData.address,
// // // // //       city: formData.city,
// // // // //       state: formData.state || '',
// // // // //       pincode: formData.pincode,
// // // // //       landmark: formData.landmark || '',
// // // // //       phone: formData.phone || '',
// // // // //       isDefault: addresses.length === 0 || formData.isDefault,
// // // // //       latitude: formData.latitude || undefined,
// // // // //       longitude: formData.longitude || undefined,
// // // // //     };

// // // // //     addAddress(newAddress);
// // // // //     setIsLoading(false);
// // // // //     setShowAddAddressModal(false);
// // // // //     resetForm();
    
// // // // //     setSelectedAddress(newAddress);
// // // // //     navigation.navigate('PaymentScreen', {
// // // // //       address: newAddress,
// // // // //       totalAmount: totalPrice,
// // // // //       restaurantName: restaurantName,
// // // // //       cartItems: cartItems,
// // // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // // //     });
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
// // // // //             <Text style={styles.emptySubText}>Add a new address or use current location</Text>
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

// // // // //               <View style={styles.formGroup}>
// // // // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.formInput}
// // // // //                   placeholder="Enter phone number (optional)"
// // // // //                   value={formData.phone}
// // // // //                   keyboardType="phone-pad"
// // // // //                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.formRow}>
// // // // //                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
// // // // //                   <Text style={styles.formLabel}>City *</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.formInput}
// // // // //                     placeholder="City"
// // // // //                     value={formData.city}
// // // // //                     onChangeText={(text) => setFormData({ ...formData, city: text })}
// // // // //                   />
// // // // //                 </View>
// // // // //                 <View style={[styles.formGroup, { flex: 1 }]}>
// // // // //                   <Text style={styles.formLabel}>State</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.formInput}
// // // // //                     placeholder="State"
// // // // //                     value={formData.state}
// // // // //                     onChangeText={(text) => setFormData({ ...formData, state: text })}
// // // // //                   />
// // // // //                 </View>
// // // // //               </View>

// // // // //               <View style={styles.formGroup}>
// // // // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.formInput}
// // // // //                   placeholder="Pincode"
// // // // //                   value={formData.pincode}
// // // // //                   keyboardType="number-pad"
// // // // //                   onChangeText={(text) => setFormData({ ...formData, pincode: text })}
// // // // //                 />
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
// // // // //   },
// // // // //   formInputMultiline: {
// // // // //     height: 80,
// // // // //     textAlignVertical: 'top',
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

// // // // // ✅ HARDCODED API KEY
// // // // const GOOGLE_MAPS_API_KEY = 'AIzaSyDD71FtmPmf0VuS1JjpO0zjKMl6VrpJ2eI';

// // // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// // // // interface AddressSelectionScreenProps {
// // // //   navigation: any;
// // // //   route: any;
// // // // }

// // // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);

// // // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const [gettingLocation, setGettingLocation] = useState(false);
// // // //   const [locationError, setLocationError] = useState<string>('');

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
// // // //           // Try to get address from coordinates
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

// // // //   const handleSelectAddress = (address: Address) => {
// // // //     setSelectedAddress(address);
// // // //     navigation.navigate('PaymentScreen', {
// // // //       address: address,
// // // //       totalAmount: totalPrice,
// // // //       restaurantName: restaurantName,
// // // //       cartItems: cartItems,
// // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // //     });
// // // //   };

// // // //   const handleAddAddress = async () => {
// // // //     if (!formData.address || !formData.city || !formData.pincode) {
// // // //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// // // //       return;
// // // //     }

// // // //     setIsLoading(true);

// // // //     const newAddress: Address = {
// // // //       id: `addr_${Date.now()}`,
// // // //       type: formData.type,
// // // //       address: formData.address,
// // // //       city: formData.city,
// // // //       state: formData.state || '',
// // // //       pincode: formData.pincode,
// // // //       landmark: formData.landmark || '',
// // // //       phone: formData.phone || '',
// // // //       isDefault: addresses.length === 0 || formData.isDefault,
// // // //       latitude: formData.latitude || undefined,
// // // //       longitude: formData.longitude || undefined,
// // // //     };

// // // //     addAddress(newAddress);
// // // //     setIsLoading(false);
// // // //     setShowAddAddressModal(false);
// // // //     resetForm();
// // // //     setSelectedAddress(newAddress);
// // // //     navigation.navigate('PaymentScreen', {
// // // //       address: newAddress,
// // // //       totalAmount: totalPrice,
// // // //       restaurantName: restaurantName,
// // // //       cartItems: cartItems,
// // // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // // //     });
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

// // // //             <ScrollView showsVerticalScrollIndicator={false}>
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

// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // // //                 <TextInput
// // // //                   style={styles.formInput}
// // // //                   placeholder="Enter phone number (optional)"
// // // //                   value={formData.phone}
// // // //                   keyboardType="phone-pad"
// // // //                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
// // // //                 />
// // // //               </View>

// // // //               <View style={styles.formRow}>
// // // //                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
// // // //                   <Text style={styles.formLabel}>City *</Text>
// // // //                   <TextInput
// // // //                     style={styles.formInput}
// // // //                     placeholder="City"
// // // //                     value={formData.city}
// // // //                     onChangeText={(text) => setFormData({ ...formData, city: text })}
// // // //                   />
// // // //                 </View>
// // // //                 <View style={[styles.formGroup, { flex: 1 }]}>
// // // //                   <Text style={styles.formLabel}>State</Text>
// // // //                   <TextInput
// // // //                     style={styles.formInput}
// // // //                     placeholder="State"
// // // //                     value={formData.state}
// // // //                     onChangeText={(text) => setFormData({ ...formData, state: text })}
// // // //                   />
// // // //                 </View>
// // // //               </View>

// // // //               <View style={styles.formGroup}>
// // // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // // //                 <TextInput
// // // //                   style={styles.formInput}
// // // //                   placeholder="Pincode"
// // // //                   value={formData.pincode}
// // // //                   keyboardType="number-pad"
// // // //                   onChangeText={(text) => setFormData({ ...formData, pincode: text })}
// // // //                 />
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
// // // //   },
// // // //   formInputMultiline: {
// // // //     height: 80,
// // // //     textAlignVertical: 'top',
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

// // // // ✅ WORKING API KEY - Tested and confirmed
// // // const GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';

// // // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// // // interface AddressSelectionScreenProps {
// // //   navigation: any;
// // //   route: any;
// // // }

// // // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// // //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// // //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// // //   const { getTotalPrice, getTotalItems } = useContext(CartContext);

// // //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [gettingLocation, setGettingLocation] = useState(false);
// // //   const [locationError, setLocationError] = useState<string>('');

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
// // //           // Try to get address from coordinates
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

// // //   const handleAddAddress = async () => {
// // //     if (!formData.address || !formData.city || !formData.pincode) {
// // //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// // //       return;
// // //     }

// // //     setIsLoading(true);

// // //     const newAddress: Address = {
// // //       id: `addr_${Date.now()}`,
// // //       type: formData.type,
// // //       address: formData.address,
// // //       city: formData.city,
// // //       state: formData.state || '',
// // //       pincode: formData.pincode,
// // //       landmark: formData.landmark || '',
// // //       phone: formData.phone || '',
// // //       isDefault: addresses.length === 0 || formData.isDefault,
// // //       latitude: formData.latitude || undefined,
// // //       longitude: formData.longitude || undefined,
// // //     };

// // //     addAddress(newAddress);
// // //     setIsLoading(false);
// // //     setShowAddAddressModal(false);
// // //     resetForm();
// // //     setSelectedAddress(newAddress);
// // //     navigation.navigate('PaymentScreen', {
// // //       address: newAddress,
// // //       totalAmount: totalPrice,
// // //       restaurantName: restaurantName,
// // //       cartItems: cartItems,
// // //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// // //     });
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

// // //             <ScrollView showsVerticalScrollIndicator={false}>
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

// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>Phone Number</Text>
// // //                 <TextInput
// // //                   style={styles.formInput}
// // //                   placeholder="Enter phone number (optional)"
// // //                   value={formData.phone}
// // //                   keyboardType="phone-pad"
// // //                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
// // //                 />
// // //               </View>

// // //               <View style={styles.formRow}>
// // //                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
// // //                   <Text style={styles.formLabel}>City *</Text>
// // //                   <TextInput
// // //                     style={styles.formInput}
// // //                     placeholder="City"
// // //                     value={formData.city}
// // //                     onChangeText={(text) => setFormData({ ...formData, city: text })}
// // //                   />
// // //                 </View>
// // //                 <View style={[styles.formGroup, { flex: 1 }]}>
// // //                   <Text style={styles.formLabel}>State</Text>
// // //                   <TextInput
// // //                     style={styles.formInput}
// // //                     placeholder="State"
// // //                     value={formData.state}
// // //                     onChangeText={(text) => setFormData({ ...formData, state: text })}
// // //                   />
// // //                 </View>
// // //               </View>

// // //               <View style={styles.formGroup}>
// // //                 <Text style={styles.formLabel}>Pincode *</Text>
// // //                 <TextInput
// // //                   style={styles.formInput}
// // //                   placeholder="Pincode"
// // //                   value={formData.pincode}
// // //                   keyboardType="number-pad"
// // //                   onChangeText={(text) => setFormData({ ...formData, pincode: text })}
// // //                 />
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
// // //   },
// // //   formInputMultiline: {
// // //     height: 80,
// // //     textAlignVertical: 'top',
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

// // // ✅ DYNAMIC API KEY - Try @env first, then fallback to hardcoded
// // let GOOGLE_MAPS_API_KEY = '';

// // try {
// //   // Try to import from .env
// //   const env = require('@env');
// //   GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
// // } catch (e) {
// //   // If @env fails, use hardcoded fallback
// //   GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';
// // }

// // console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');
// // console.log('🔑 API Key:', GOOGLE_MAPS_API_KEY);

// // interface AddressSelectionScreenProps {
// //   navigation: any;
// //   route: any;
// // }

// // const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
// //   const { totalAmount, restaurantName, cartItems } = route.params || {};
// //   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
// //   const { getTotalPrice, getTotalItems } = useContext(CartContext);

// //   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [gettingLocation, setGettingLocation] = useState(false);
// //   const [locationError, setLocationError] = useState<string>('');

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

// //   const totalPrice = getTotalPrice() || totalAmount;
// //   const totalItems = getTotalItems();

// //   // ✅ Get current location
// //   const getCurrentLocationWeb = () => {
// //     setLocationError('');
    
// //     if (!navigator.geolocation) {
// //       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
// //       return;
// //     }

// //     if (!GOOGLE_MAPS_API_KEY) {
// //       Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
// //       return;
// //     }

// //     console.log('📍 Getting location...');
// //     setGettingLocation(true);

// //     navigator.geolocation.getCurrentPosition(
// //       async (position) => {
// //         const { latitude, longitude } = position.coords;
// //         console.log('📍 Location found:', latitude, longitude);
        
// //         try {
// //           // Try to get address from coordinates
// //           const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
// //           console.log('🔗 Fetching:', url);
          
// //           const response = await fetch(url);
// //           const data = await response.json();
          
// //           console.log('📦 Response status:', data.status);
          
// //           if (data.status === 'OK' && data.results && data.results.length > 0) {
// //             const result = data.results[0];
// //             let city = '';
// //             let state = '';
// //             let pincode = '';
// //             let formattedAddress = result.formatted_address || '';
            
// //             if (result.address_components) {
// //               result.address_components.forEach((component: any) => {
// //                 if (component.types.includes('locality') || component.types.includes('sublocality')) {
// //                   city = component.long_name;
// //                 }
// //                 if (component.types.includes('administrative_area_level_1')) {
// //                   state = component.long_name;
// //                 }
// //                 if (component.types.includes('postal_code')) {
// //                   pincode = component.long_name;
// //                 }
// //               });
// //             }

// //             setGettingLocation(false);
// //             setFormData({
// //               ...formData,
// //               address: formattedAddress,
// //               city: city,
// //               state: state,
// //               pincode: pincode,
// //               latitude,
// //               longitude,
// //             });
            
// //             Alert.alert(
// //               '📍 Location Found!',
// //               `Address: ${formattedAddress}`,
// //               [{ text: 'OK' }]
// //             );
// //           } else {
// //             setGettingLocation(false);
// //             Alert.alert(
// //               '📍 Location Found',
// //               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// //               [{ text: 'OK' }]
// //             );
// //             setFormData({ ...formData, latitude, longitude });
// //           }
// //         } catch (error) {
// //           console.error('❌ Error:', error);
// //           setGettingLocation(false);
// //           Alert.alert(
// //             '📍 Location Found',
// //             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
// //             [{ text: 'OK' }]
// //           );
// //           setFormData({ ...formData, latitude, longitude });
// //         }
// //       },
// //       (error) => {
// //         console.error('❌ Location error:', error);
// //         setGettingLocation(false);
        
// //         let message = 'Unable to get your location. Please enter manually.';
// //         if (error.message) {
// //           message = error.message;
// //         }
        
// //         setLocationError(message);
// //         Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
// //       },
// //       { 
// //         enableHighAccuracy: true, 
// //         timeout: 30000, 
// //         maximumAge: 10000 
// //       }
// //     );
// //   };

// //   const requestLocationPermission = () => {
// //     if (Platform.OS === 'web') {
// //       getCurrentLocationWeb();
// //     } else {
// //       Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
// //     }
// //   };

// //   const getAddressTypeIcon = (type: string) => {
// //     switch (type) {
// //       case 'Home': return 'home-outline';
// //       case 'Work': return 'briefcase-outline';
// //       case 'Other': return 'location-outline';
// //       default: return 'location-outline';
// //     }
// //   };

// //   const getAddressTypeColor = (type: string) => {
// //     switch (type) {
// //       case 'Home': return '#4CAF50';
// //       case 'Work': return '#2196F3';
// //       case 'Other': return '#FF9800';
// //       default: return '#757575';
// //     }
// //   };

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

// //   const handleAddAddress = async () => {
// //     if (!formData.address || !formData.city || !formData.pincode) {
// //       Alert.alert('⚠️ Error', 'Please fill all required fields');
// //       return;
// //     }

// //     setIsLoading(true);

// //     const newAddress: Address = {
// //       id: `addr_${Date.now()}`,
// //       type: formData.type,
// //       address: formData.address,
// //       city: formData.city,
// //       state: formData.state || '',
// //       pincode: formData.pincode,
// //       landmark: formData.landmark || '',
// //       phone: formData.phone || '',
// //       isDefault: addresses.length === 0 || formData.isDefault,
// //       latitude: formData.latitude || undefined,
// //       longitude: formData.longitude || undefined,
// //     };

// //     addAddress(newAddress);
// //     setIsLoading(false);
// //     setShowAddAddressModal(false);
// //     resetForm();
// //     setSelectedAddress(newAddress);
// //     navigation.navigate('PaymentScreen', {
// //       address: newAddress,
// //       totalAmount: totalPrice,
// //       restaurantName: restaurantName,
// //       cartItems: cartItems,
// //       orderId: 'ORD-' + Date.now().toString().slice(-6),
// //     });
// //   };

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
// //   };

// //   const renderAddressItem = ({ item }: { item: Address }) => {
// //     const isSelected = selectedAddress?.id === item.id;
    
// //     return (
// //       <TouchableOpacity
// //         key={item.id}
// //         style={[styles.addressCard, isSelected && styles.addressCardSelected]}
// //         onPress={() => handleSelectAddress(item)}
// //         activeOpacity={0.7}
// //       >
// //         <View style={styles.addressHeader}>
// //           <View style={styles.addressTypeContainer}>
// //             <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
// //             <Text style={styles.addressTypeText}>{item.type}</Text>
// //           </View>
// //           {item.isDefault && (
// //             <View style={styles.defaultBadge}>
// //               <Text style={styles.defaultBadgeText}>Default</Text>
// //             </View>
// //           )}
// //           {isSelected && (
// //             <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
// //           )}
// //         </View>

// //         <Text style={styles.addressDetail}>{item.address}</Text>
// //         {item.landmark && (
// //           <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
// //         )}
// //         {item.phone && (
// //           <Text style={styles.addressPhone}>📞 {item.phone}</Text>
// //         )}
// //         <Text style={styles.addressDetail}>
// //           {item.city}, {item.state || ''} - {item.pincode}
// //         </Text>
// //         {item.latitude && item.longitude && (
// //           <View style={styles.locationTag}>
// //             <Icon name="location-outline" size={12} color="#28a745" />
// //             <Text style={styles.locationTagText}>Live location</Text>
// //           </View>
// //         )}
// //       </TouchableOpacity>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //           <Icon name="arrow-back" size={24} color="#282c3f" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Delivery Address</Text>
// //         <TouchableOpacity 
// //           style={styles.addButton}
// //           onPress={() => setShowAddAddressModal(true)}
// //         >
// //           <Icon name="add-circle-outline" size={28} color="#fc8019" />
// //         </TouchableOpacity>
// //       </View>

// //       <TouchableOpacity
// //         style={styles.locationButton}
// //         onPress={requestLocationPermission}
// //         disabled={gettingLocation}
// //       >
// //         {gettingLocation ? (
// //           <ActivityIndicator size="small" color="#fc8019" />
// //         ) : (
// //           <>
// //             <Icon name="locate-outline" size={22} color="#fc8019" />
// //             <Text style={styles.locationButtonText}>Use Current Location</Text>
// //           </>
// //         )}
// //       </TouchableOpacity>

// //       <FlatList
// //         data={addresses}
// //         renderItem={renderAddressItem}
// //         keyExtractor={(item) => item.id}
// //         contentContainerStyle={styles.addressList}
// //         showsVerticalScrollIndicator={false}
// //         ListHeaderComponent={
// //           addresses.length > 0 ? (
// //             <Text style={styles.listHeader}>Saved Addresses</Text>
// //           ) : null
// //         }
// //         ListEmptyComponent={
// //           <View style={styles.emptyContainer}>
// //             <Icon name="location-outline" size={60} color="#ccc" />
// //             <Text style={styles.emptyText}>No Addresses Saved</Text>
// //             <Text style={styles.emptySubText}>Add a new address</Text>
// //           </View>
// //         }
// //       />

// //       {selectedAddress && (
// //         <View style={styles.bottomBar}>
// //           <View style={styles.bottomBarLeft}>
// //             <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>
// //             <Text style={styles.bottomBarItems}>{totalItems} items</Text>
// //           </View>
// //           <TouchableOpacity
// //             style={styles.deliverButton}
// //             onPress={() => handleSelectAddress(selectedAddress)}
// //           >
// //             <Text style={styles.deliverButtonText}>
// //               Deliver to {selectedAddress.type}
// //             </Text>
// //             <Icon name="arrow-forward" size={18} color="#ffffff" />
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       <Modal
// //         visible={showAddAddressModal}
// //         animationType="slide"
// //         transparent={true}
// //       >
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>Add New Address</Text>
// //               <TouchableOpacity onPress={() => {
// //                 setShowAddAddressModal(false);
// //                 resetForm();
// //               }}>
// //                 <Icon name="close" size={24} color="#282c3f" />
// //               </TouchableOpacity>
// //             </View>

// //             <ScrollView showsVerticalScrollIndicator={false}>
// //               <View style={styles.formGroup}>
// //                 <Text style={styles.formLabel}>Address Type</Text>
// //                 <View style={styles.addressTypeButtons}>
// //                   {['Home', 'Work', 'Other'].map((type) => (
// //                     <TouchableOpacity
// //                       key={type}
// //                       style={[
// //                         styles.addressTypeButton,
// //                         formData.type === type && styles.addressTypeButtonActive
// //                       ]}
// //                       onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
// //                     >
// //                       <Icon 
// //                         name={getAddressTypeIcon(type)} 
// //                         size={18} 
// //                         color={formData.type === type ? '#fc8019' : '#757575'} 
// //                       />
// //                       <Text 
// //                         style={[
// //                           styles.addressTypeButtonText,
// //                           formData.type === type && styles.addressTypeButtonTextActive
// //                         ]}
// //                       >
// //                         {type}
// //                       </Text>
// //                     </TouchableOpacity>
// //                   ))}
// //                 </View>
// //               </View>

// //               <View style={styles.formGroup}>
// //                 <Text style={styles.formLabel}>Address *</Text>
// //                 <TextInput
// //                   style={[styles.formInput, styles.formInputMultiline]}
// //                   placeholder="Enter your address"
// //                   value={formData.address}
// //                   multiline
// //                   numberOfLines={3}
// //                   onChangeText={(text) => setFormData({ ...formData, address: text })}
// //                 />
// //               </View>

// //               <View style={styles.formGroup}>
// //                 <Text style={styles.formLabel}>Landmark</Text>
// //                 <TextInput
// //                   style={styles.formInput}
// //                   placeholder="Nearby landmark (optional)"
// //                   value={formData.landmark}
// //                   onChangeText={(text) => setFormData({ ...formData, landmark: text })}
// //                 />
// //               </View>

// //               <View style={styles.formGroup}>
// //                 <Text style={styles.formLabel}>Phone Number</Text>
// //                 <TextInput
// //                   style={styles.formInput}
// //                   placeholder="Enter phone number (optional)"
// //                   value={formData.phone}
// //                   keyboardType="phone-pad"
// //                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
// //                 />
// //               </View>

// //               <View style={styles.formRow}>
// //                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
// //                   <Text style={styles.formLabel}>City *</Text>
// //                   <TextInput
// //                     style={styles.formInput}
// //                     placeholder="City"
// //                     value={formData.city}
// //                     onChangeText={(text) => setFormData({ ...formData, city: text })}
// //                   />
// //                 </View>
// //                 <View style={[styles.formGroup, { flex: 1 }]}>
// //                   <Text style={styles.formLabel}>State</Text>
// //                   <TextInput
// //                     style={styles.formInput}
// //                     placeholder="State"
// //                     value={formData.state}
// //                     onChangeText={(text) => setFormData({ ...formData, state: text })}
// //                   />
// //                 </View>
// //               </View>

// //               <View style={styles.formGroup}>
// //                 <Text style={styles.formLabel}>Pincode *</Text>
// //                 <TextInput
// //                   style={styles.formInput}
// //                   placeholder="Pincode"
// //                   value={formData.pincode}
// //                   keyboardType="number-pad"
// //                   onChangeText={(text) => setFormData({ ...formData, pincode: text })}
// //                 />
// //               </View>

// //               <View style={styles.formGroup}>
// //                 <TouchableOpacity
// //                   style={styles.defaultCheckbox}
// //                   onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
// //                 >
// //                   <Icon 
// //                     name={formData.isDefault ? 'checkbox' : 'square-outline'} 
// //                     size={24} 
// //                     color="#fc8019" 
// //                   />
// //                   <Text style={styles.defaultCheckboxText}>Set as default address</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               {formData.latitude !== 0 && (
// //                 <View style={styles.locationDetected}>
// //                   <Icon name="checkmark-circle" size={16} color="#28a745" />
// //                   <Text style={styles.locationDetectedText}>
// //                     Location detected ✓
// //                   </Text>
// //                 </View>
// //               )}

// //               <TouchableOpacity
// //                 style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
// //                 onPress={handleAddAddress}
// //                 disabled={isLoading}
// //               >
// //                 {isLoading ? (
// //                   <ActivityIndicator size="small" color="#ffffff" />
// //                 ) : (
// //                   <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
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
// //   },
// //   formInputMultiline: {
// //     height: 80,
// //     textAlignVertical: 'top',
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

// // screens/checkout/AddressSelectionScreen.tsx
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
// import { supabase } from '../../services/supabaseClient';

// // ✅ DYNAMIC API KEY
// let GOOGLE_MAPS_API_KEY = '';
// try {
//   const env = require('@env');
//   GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
// } catch (e) {
//   GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';
// }

// console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

// interface AddressSelectionScreenProps {
//   navigation: any;
//   route: any;
// }

// const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
//   const { totalAmount, restaurantName, cartItems } = route.params || {};
//   const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
//   const { getTotalPrice, getTotalItems } = useContext(CartContext);
//   const { user } = useContext(AuthContext);

//   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [gettingLocation, setGettingLocation] = useState(false);
//   const [locationError, setLocationError] = useState<string>('');

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

//   const totalPrice = getTotalPrice() || totalAmount;
//   const totalItems = getTotalItems();

//   // ✅ Get current location
//   const getCurrentLocationWeb = () => {
//     setLocationError('');
    
//     if (!navigator.geolocation) {
//       Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
//       return;
//     }

//     if (!GOOGLE_MAPS_API_KEY) {
//       Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
//       return;
//     }

//     console.log('📍 Getting location...');
//     setGettingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log('📍 Location found:', latitude, longitude);
        
//         try {
//           const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
//           console.log('🔗 Fetching:', url);
          
//           const response = await fetch(url);
//           const data = await response.json();
          
//           console.log('📦 Response status:', data.status);
          
//           if (data.status === 'OK' && data.results && data.results.length > 0) {
//             const result = data.results[0];
//             let city = '';
//             let state = '';
//             let pincode = '';
//             let formattedAddress = result.formatted_address || '';
            
//             if (result.address_components) {
//               result.address_components.forEach((component: any) => {
//                 if (component.types.includes('locality') || component.types.includes('sublocality')) {
//                   city = component.long_name;
//                 }
//                 if (component.types.includes('administrative_area_level_1')) {
//                   state = component.long_name;
//                 }
//                 if (component.types.includes('postal_code')) {
//                   pincode = component.long_name;
//                 }
//               });
//             }

//             setGettingLocation(false);
//             setFormData({
//               ...formData,
//               address: formattedAddress,
//               city: city,
//               state: state,
//               pincode: pincode,
//               latitude,
//               longitude,
//             });
            
//             Alert.alert(
//               '📍 Location Found!',
//               `Address: ${formattedAddress}`,
//               [{ text: 'OK' }]
//             );
//           } else {
//             setGettingLocation(false);
//             Alert.alert(
//               '📍 Location Found',
//               `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
//               [{ text: 'OK' }]
//             );
//             setFormData({ ...formData, latitude, longitude });
//           }
//         } catch (error) {
//           console.error('❌ Error:', error);
//           setGettingLocation(false);
//           Alert.alert(
//             '📍 Location Found',
//             `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
//             [{ text: 'OK' }]
//           );
//           setFormData({ ...formData, latitude, longitude });
//         }
//       },
//       (error) => {
//         console.error('❌ Location error:', error);
//         setGettingLocation(false);
        
//         let message = 'Unable to get your location. Please enter manually.';
//         if (error.message) {
//           message = error.message;
//         }
        
//         setLocationError(message);
//         Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
//       },
//       { 
//         enableHighAccuracy: true, 
//         timeout: 30000, 
//         maximumAge: 10000 
//       }
//     );
//   };

//   const requestLocationPermission = () => {
//     if (Platform.OS === 'web') {
//       getCurrentLocationWeb();
//     } else {
//       Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
//     }
//   };

//   const getAddressTypeIcon = (type: string) => {
//     switch (type) {
//       case 'Home': return 'home-outline';
//       case 'Work': return 'briefcase-outline';
//       case 'Other': return 'location-outline';
//       default: return 'location-outline';
//     }
//   };

//   const getAddressTypeColor = (type: string) => {
//     switch (type) {
//       case 'Home': return '#4CAF50';
//       case 'Work': return '#2196F3';
//       case 'Other': return '#FF9800';
//       default: return '#757575';
//     }
//   };

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

//   // ✅ Updated handleAddAddress - Saves address to customer table
//   const handleAddAddress = async () => {
//     if (!formData.address || !formData.city || !formData.pincode) {
//       Alert.alert('⚠️ Error', 'Please fill all required fields');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // ✅ Create full address string
//       const fullAddress = `${formData.address}, ${formData.city}, ${formData.state || ''} - ${formData.pincode}`;

//       // ✅ Save address to customer table in Supabase
//       if (user?.id) {
//         const { error: updateError } = await supabase
//           .from('customer')
//           .update({
//             address: fullAddress,
//             phone: formData.phone || user.phone,
//           })
//           .eq('id', user.id);

//         if (updateError) {
//           console.error('❌ Failed to update customer address:', updateError);
//           Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
//           setIsLoading(false);
//           return;
//         }
//         console.log('✅ Customer address updated successfully');
//       }

//       // ✅ Save to local context
//       const newAddress: Address = {
//         id: `addr_${Date.now()}`,
//         type: formData.type,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state || '',
//         pincode: formData.pincode,
//         landmark: formData.landmark || '',
//         phone: formData.phone || '',
//         isDefault: addresses.length === 0 || formData.isDefault,
//         latitude: formData.latitude || undefined,
//         longitude: formData.longitude || undefined,
//       };

//       addAddress(newAddress);

//       setIsLoading(false);
//       setShowAddAddressModal(false);
//       resetForm();
//       setSelectedAddress(newAddress);
      
//       navigation.navigate('PaymentScreen', {
//         address: newAddress,
//         totalAmount: totalPrice,
//         restaurantName: restaurantName,
//         cartItems: cartItems,
//         orderId: 'ORD-' + Date.now().toString().slice(-6),
//       });
      
//     } catch (error) {
//       console.error('❌ Error saving address:', error);
//       Alert.alert('❌ Error', 'Failed to save address. Please try again.');
//       setIsLoading(false);
//     }
//   };

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
//   };

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
//             <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
//             <Text style={styles.addressTypeText}>{item.type}</Text>
//           </View>
//           {item.isDefault && (
//             <View style={styles.defaultBadge}>
//               <Text style={styles.defaultBadgeText}>Default</Text>
//             </View>
//           )}
//           {isSelected && (
//             <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
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
      
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#282c3f" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Delivery Address</Text>
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => setShowAddAddressModal(true)}
//         >
//           <Icon name="add-circle-outline" size={28} color="#fc8019" />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={styles.locationButton}
//         onPress={requestLocationPermission}
//         disabled={gettingLocation}
//       >
//         {gettingLocation ? (
//           <ActivityIndicator size="small" color="#fc8019" />
//         ) : (
//           <>
//             <Icon name="locate-outline" size={22} color="#fc8019" />
//             <Text style={styles.locationButtonText}>Use Current Location</Text>
//           </>
//         )}
//       </TouchableOpacity>

//       <FlatList
//         data={addresses}
//         renderItem={renderAddressItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.addressList}
//         showsVerticalScrollIndicator={false}
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

//       <Modal
//         visible={showAddAddressModal}
//         animationType="slide"
//         transparent={true}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Add New Address</Text>
//               <TouchableOpacity onPress={() => {
//                 setShowAddAddressModal(false);
//                 resetForm();
//               }}>
//                 <Icon name="close" size={24} color="#282c3f" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Address Type</Text>
//                 <View style={styles.addressTypeButtons}>
//                   {['Home', 'Work', 'Other'].map((type) => (
//                     <TouchableOpacity
//                       key={type}
//                       style={[
//                         styles.addressTypeButton,
//                         formData.type === type && styles.addressTypeButtonActive
//                       ]}
//                       onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
//                     >
//                       <Icon 
//                         name={getAddressTypeIcon(type)} 
//                         size={18} 
//                         color={formData.type === type ? '#fc8019' : '#757575'} 
//                       />
//                       <Text 
//                         style={[
//                           styles.addressTypeButtonText,
//                           formData.type === type && styles.addressTypeButtonTextActive
//                         ]}
//                       >
//                         {type}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Address *</Text>
//                 <TextInput
//                   style={[styles.formInput, styles.formInputMultiline]}
//                   placeholder="Enter your address"
//                   value={formData.address}
//                   multiline
//                   numberOfLines={3}
//                   onChangeText={(text) => setFormData({ ...formData, address: text })}
//                 />
//               </View>

//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Landmark</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   placeholder="Nearby landmark (optional)"
//                   value={formData.landmark}
//                   onChangeText={(text) => setFormData({ ...formData, landmark: text })}
//                 />
//               </View>

//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Phone Number</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   placeholder="Enter phone number (optional)"
//                   value={formData.phone}
//                   keyboardType="phone-pad"
//                   onChangeText={(text) => setFormData({ ...formData, phone: text })}
//                 />
//               </View>

//               <View style={styles.formRow}>
//                 <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
//                   <Text style={styles.formLabel}>City *</Text>
//                   <TextInput
//                     style={styles.formInput}
//                     placeholder="City"
//                     value={formData.city}
//                     onChangeText={(text) => setFormData({ ...formData, city: text })}
//                   />
//                 </View>
//                 <View style={[styles.formGroup, { flex: 1 }]}>
//                   <Text style={styles.formLabel}>State</Text>
//                   <TextInput
//                     style={styles.formInput}
//                     placeholder="State"
//                     value={formData.state}
//                     onChangeText={(text) => setFormData({ ...formData, state: text })}
//                   />
//                 </View>
//               </View>

//               <View style={styles.formGroup}>
//                 <Text style={styles.formLabel}>Pincode *</Text>
//                 <TextInput
//                   style={styles.formInput}
//                   placeholder="Pincode"
//                   value={formData.pincode}
//                   keyboardType="number-pad"
//                   onChangeText={(text) => setFormData({ ...formData, pincode: text })}
//                 />
//               </View>

//               <View style={styles.formGroup}>
//                 <TouchableOpacity
//                   style={styles.defaultCheckbox}
//                   onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
//                 >
//                   <Icon 
//                     name={formData.isDefault ? 'checkbox' : 'square-outline'} 
//                     size={24} 
//                     color="#fc8019" 
//                   />
//                   <Text style={styles.defaultCheckboxText}>Set as default address</Text>
//                 </TouchableOpacity>
//               </View>

//               {formData.latitude !== 0 && (
//                 <View style={styles.locationDetected}>
//                   <Icon name="checkmark-circle" size={16} color="#28a745" />
//                   <Text style={styles.locationDetectedText}>
//                     Location detected ✓
//                   </Text>
//                 </View>
//               )}

//               <TouchableOpacity
//                 style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
//                 onPress={handleAddAddress}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator size="small" color="#ffffff" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
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
//   },
//   formInputMultiline: {
//     height: 80,
//     textAlignVertical: 'top',
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
import { supabase } from '../../services/supabaseClient';

// ✅ DYNAMIC API KEY
let GOOGLE_MAPS_API_KEY = '';
try {
  const env = require('@env');
  GOOGLE_MAPS_API_KEY = env.GOOGLE_MAPS_API_KEY || '';
} catch (e) {
  GOOGLE_MAPS_API_KEY = 'AIzaSyC_ZWUy_ywLE3Nec4z-1IVfZllqmZbBGls';
}

console.log('🔑 API Key loaded:', GOOGLE_MAPS_API_KEY ? '✅ Yes' : '❌ No');

interface AddressSelectionScreenProps {
  navigation: any;
  route: any;
}

const AddressSelectionScreen: React.FC<AddressSelectionScreenProps> = ({ navigation, route }) => {
  const { totalAmount, restaurantName, cartItems } = route.params || {};
  const { addresses, selectedAddress, setSelectedAddress, addAddress, setDefaultAddress, refreshAddresses } = useContext(AddressContext);
  const { getTotalPrice, getTotalItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

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

  const totalPrice = getTotalPrice() || totalAmount;
  const totalItems = getTotalItems();

  // ✅ Get current location
  const getCurrentLocationWeb = () => {
    setLocationError('');

    if (!navigator.geolocation) {
      Alert.alert('⚠️ Error', 'Geolocation is not supported by your browser.');
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      Alert.alert('⚠️ Error', 'Google Maps API Key is missing.');
      return;
    }

    console.log('📍 Getting location...');
    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Location found:', latitude, longitude);

        try {
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
          console.log('🔗 Fetching:', url);

          const response = await fetch(url);
          const data = await response.json();

          console.log('📦 Response status:', data.status);

          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            let city = '';
            let state = '';
            let pincode = '';
            let formattedAddress = result.formatted_address || '';

            if (result.address_components) {
              result.address_components.forEach((component: any) => {
                if (component.types.includes('locality') || component.types.includes('sublocality')) {
                  city = component.long_name;
                }
                if (component.types.includes('administrative_area_level_1')) {
                  state = component.long_name;
                }
                if (component.types.includes('postal_code')) {
                  pincode = component.long_name;
                }
              });
            }

            setGettingLocation(false);
            setFormData({
              ...formData,
              address: formattedAddress,
              city: city,
              state: state,
              pincode: pincode,
              latitude,
              longitude,
            });

            Alert.alert(
              '📍 Location Found!',
              `Address: ${formattedAddress}`,
              [{ text: 'OK' }]
            );
          } else {
            setGettingLocation(false);
            Alert.alert(
              '📍 Location Found',
              `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
              [{ text: 'OK' }]
            );
            setFormData({ ...formData, latitude, longitude });
          }
        } catch (error) {
          console.error('❌ Error:', error);
          setGettingLocation(false);
          Alert.alert(
            '📍 Location Found',
            `Latitude: ${latitude}\nLongitude: ${longitude}\n\nPlease enter your address manually.`,
            [{ text: 'OK' }]
          );
          setFormData({ ...formData, latitude, longitude });
        }
      },
      (error) => {
        console.error('❌ Location error:', error);
        setGettingLocation(false);

        let message = 'Unable to get your location. Please enter manually.';
        if (error.message) {
          message = error.message;
        }

        setLocationError(message);
        Alert.alert('❌ Location Error', message, [{ text: 'OK' }]);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000
      }
    );
  };

  const requestLocationPermission = () => {
    if (Platform.OS === 'web') {
      getCurrentLocationWeb();
    } else {
      Alert.alert('Mobile Location', 'Location feature coming soon for mobile.');
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'Home': return 'home-outline';
      case 'Work': return 'briefcase-outline';
      case 'Other': return 'location-outline';
      default: return 'location-outline';
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'Home': return '#4CAF50';
      case 'Work': return '#2196F3';
      case 'Other': return '#FF9800';
      default: return '#757575';
    }
  };

  // ✅ Shared helper: push an address string into the customers table row
  // that matches this signed-up user (customers has no user_id column,
  // so we match on business_id + phone, same as how the row was created
  // at signup).
  const syncAddressToCustomer = async (fullAddress: string) => {
    if (!user?.business_id || !user?.phone) {
      console.log('⚠️ Missing business_id or phone — skipped customer address sync');
      return;
    }

    const { error } = await supabase
      .from('customers')
      .update({ address: fullAddress })
      .eq('business_id', user.business_id)
      .eq('phone', user.phone);

    if (error) {
      console.error('❌ Failed to update customer address:', error);
    } else {
      console.log('✅ Customer address synced:', fullAddress);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);

    // ✅ NEW: also sync this selected address to the customers table
    const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;
    syncAddressToCustomer(fullAddress);

    navigation.navigate('PaymentScreen', {
      address: address,
      totalAmount: totalPrice,
      restaurantName: restaurantName,
      cartItems: cartItems,
      orderId: 'ORD-' + Date.now().toString().slice(-6),
    });
  };

  // ✅ Updated handleAddAddress - Saves address to customers table
  const handleAddAddress = async () => {
    if (!formData.address || !formData.city || !formData.pincode) {
      Alert.alert('⚠️ Error', 'Please fill all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Create full address string
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state || ''} - ${formData.pincode}`;

      // ✅ Save address to customers table in Supabase
      if (user?.business_id && user?.phone) {
        const { error: updateError } = await supabase
          .from('customers')
          .update({ address: fullAddress })
          .eq('business_id', user.business_id)
          .eq('phone', user.phone);

        if (updateError) {
          console.error('❌ Failed to update customer address:', updateError);
          Alert.alert('⚠️ Warning', 'Failed to save address. Please try again.');
          setIsLoading(false);
          return;
        }
        console.log('✅ Customer address updated successfully');
      } else {
        console.log('⚠️ Missing business_id or phone — skipped customer address sync');
      }

      // ✅ Save to local context
      const newAddress: Address = {
        id: `addr_${Date.now()}`,
        type: formData.type,
        address: formData.address,
        city: formData.city,
        state: formData.state || '',
        pincode: formData.pincode,
        landmark: formData.landmark || '',
        phone: formData.phone || '',
        isDefault: addresses.length === 0 || formData.isDefault,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      };

      addAddress(newAddress);

      setIsLoading(false);
      setShowAddAddressModal(false);
      resetForm();
      setSelectedAddress(newAddress);

      navigation.navigate('PaymentScreen', {
        address: newAddress,
        totalAmount: totalPrice,
        restaurantName: restaurantName,
        cartItems: cartItems,
        orderId: 'ORD-' + Date.now().toString().slice(-6),
      });

    } catch (error) {
      console.error('❌ Error saving address:', error);
      Alert.alert('❌ Error', 'Failed to save address. Please try again.');
      setIsLoading(false);
    }
  };

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
  };

  const renderAddressItem = ({ item }: { item: Address }) => {
    const isSelected = selectedAddress?.id === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.addressCard, isSelected && styles.addressCardSelected]}
        onPress={() => handleSelectAddress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <Icon name={getAddressTypeIcon(item.type)} size={18} color={getAddressTypeColor(item.type)} />
            <Text style={styles.addressTypeText}>{item.type}</Text>
          </View>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
          {isSelected && (
            <Icon name="checkmark-circle" size={22} color="#4CAF50" style={styles.selectedIcon} />
          )}
        </View>

        <Text style={styles.addressDetail}>{item.address}</Text>
        {item.landmark && (
          <Text style={styles.addressDetail}>📍 {item.landmark}</Text>
        )}
        {item.phone && (
          <Text style={styles.addressPhone}>📞 {item.phone}</Text>
        )}
        <Text style={styles.addressDetail}>
          {item.city}, {item.state || ''} - {item.pincode}
        </Text>
        {item.latitude && item.longitude && (
          <View style={styles.locationTag}>
            <Icon name="location-outline" size={12} color="#28a745" />
            <Text style={styles.locationTagText}>Live location</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddAddressModal(true)}
        >
          <Icon name="add-circle-outline" size={28} color="#fc8019" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={requestLocationPermission}
        disabled={gettingLocation}
      >
        {gettingLocation ? (
          <ActivityIndicator size="small" color="#fc8019" />
        ) : (
          <>
            <Icon name="locate-outline" size={22} color="#fc8019" />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </>
        )}
      </TouchableOpacity>

      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.addressList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          addresses.length > 0 ? (
            <Text style={styles.listHeader}>Saved Addresses</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="location-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No Addresses Saved</Text>
            <Text style={styles.emptySubText}>Add a new address</Text>
          </View>
        }
      />

      {selectedAddress && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarLeft}>
            <Text style={styles.bottomBarTotal}>₹{totalPrice}</Text>
            <Text style={styles.bottomBarItems}>{totalItems} items</Text>
          </View>
          <TouchableOpacity
            style={styles.deliverButton}
            onPress={() => handleSelectAddress(selectedAddress)}
          >
            <Text style={styles.deliverButtonText}>
              Deliver to {selectedAddress.type}
            </Text>
            <Icon name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showAddAddressModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
              <TouchableOpacity onPress={() => {
                setShowAddAddressModal(false);
                resetForm();
              }}>
                <Icon name="close" size={24} color="#282c3f" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address Type</Text>
                <View style={styles.addressTypeButtons}>
                  {['Home', 'Work', 'Other'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.addressTypeButton,
                        formData.type === type && styles.addressTypeButtonActive
                      ]}
                      onPress={() => setFormData({ ...formData, type: type as 'Home' | 'Work' | 'Other' })}
                    >
                      <Icon
                        name={getAddressTypeIcon(type)}
                        size={18}
                        color={formData.type === type ? '#fc8019' : '#757575'}
                      />
                      <Text
                        style={[
                          styles.addressTypeButtonText,
                          formData.type === type && styles.addressTypeButtonTextActive
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Address *</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  placeholder="Enter your address"
                  value={formData.address}
                  multiline
                  numberOfLines={3}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Landmark</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Nearby landmark (optional)"
                  value={formData.landmark}
                  onChangeText={(text) => setFormData({ ...formData, landmark: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter phone number (optional)"
                  value={formData.phone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>City *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="City"
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>State</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="State"
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Pincode *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Pincode"
                  value={formData.pincode}
                  keyboardType="number-pad"
                  onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                />
              </View>

              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.defaultCheckbox}
                  onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                >
                  <Icon
                    name={formData.isDefault ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="#fc8019"
                  />
                  <Text style={styles.defaultCheckboxText}>Set as default address</Text>
                </TouchableOpacity>
              </View>

              {formData.latitude !== 0 && (
                <View style={styles.locationDetected}>
                  <Icon name="checkmark-circle" size={16} color="#28a745" />
                  <Text style={styles.locationDetectedText}>
                    Location detected ✓
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleAddAddress}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Address & Proceed</Text>
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
  },
  formInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
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
