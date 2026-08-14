import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { AddressContext, Address } from '../../context/AddressContext';
import { AuthContext } from '../../context/AuthContext';

interface AddressScreenProps {
  navigation: any;
}

export default function AddressScreen({ navigation }: AddressScreenProps) {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, getDefaultAddress } = useContext(AddressContext);
  const { user } = useContext(AuthContext);
  
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'Home',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    phone: user?.phone || '',
  });

  // Get current location - FIXED: Removed timeout property
  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    setLocationError(null);
    
    try {
      // Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings.',
          [{ text: 'OK' }]
        );
        setLoadingLocation(false);
        return;
      }

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location access is required to get your current address. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {} }
          ]
        );
        setLoadingLocation(false);
        return;
      }

      // Get current position - FIXED: Removed timeout property
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;

      // Reverse geocoding to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const geo = reverseGeocode[0];
        const addressLine = [
          geo.street || geo.name || '',
          geo.district || '',
        ].filter(Boolean).join(', ');
        
        setNewAddress({
          ...newAddress,
          address: addressLine || 'Current Location',
          city: geo.city || geo.district || geo.subregion || geo.region || '',
          state: geo.region || geo.subregion || geo.city || '',
          pincode: geo.postalCode || '',
          latitude,
          longitude,
        });
        Alert.alert('📍 Location Found', 'Your current location has been added successfully!');
        setLocationError(null);
      } else {
        setLocationError('Could not find address for this location');
        Alert.alert('Error', 'Could not find address for this location. Please enter manually.');
      }
    } catch (error: any) {
      console.error('Location error:', error);
      setLocationError(error.message || 'Failed to get location');
      Alert.alert(
        'Location Error',
        'Failed to get location. Please check:\n• GPS is enabled\n• Internet connection\n• Location permissions\n\nYou can enter address manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleAddAddress = (): void => {
    if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      Alert.alert('Error', 'Please fill all required fields (*)');
      return;
    }

    const address: Address = {
      id: editingId || Date.now().toString(),
      type: newAddress.type as 'Home' | 'Work' | 'Other',
      address: newAddress.address,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      isDefault: addresses.length === 0,
      landmark: newAddress.landmark,
      phone: newAddress.phone || user?.phone,
      latitude: newAddress.latitude,
      longitude: newAddress.longitude,
    };

    if (editingId) {
      updateAddress(editingId, address);
      Alert.alert('Success', 'Address updated successfully');
    } else {
      addAddress(address);
      Alert.alert('Success', 'Address added successfully');
    }

    setNewAddress({ 
      type: 'Home', 
      address: '', 
      city: '', 
      state: '', 
      pincode: '', 
      landmark: '', 
      phone: user?.phone || '' 
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const renderAddressItem = (item: Address) => (
    <View key={item.id} style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <Icon name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.addressType}>{item.type}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity onPress={() => {
            setEditingId(item.id);
            setNewAddress({
              type: item.type,
              address: item.address,
              city: item.city,
              state: item.state,
              pincode: item.pincode,
              landmark: item.landmark,
              phone: item.phone,
              latitude: item.latitude,
              longitude: item.longitude,
            });
            setShowAddForm(true);
          }}>
            <Icon name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              'Delete Address',
              'Are you sure you want to delete this address?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteAddress(item.id)
                }
              ]
            );
          }}>
            <Icon name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.addressText}>{item.address}</Text>
      {item.landmark && (
        <Text style={styles.addressLandmark}>📍 {item.landmark}</Text>
      )}
      <Text style={styles.addressCity}>{item.city}, {item.state} - {item.pincode}</Text>
      {item.phone && (
        <Text style={styles.addressPhone}>📞 {item.phone}</Text>
      )}
      <View style={styles.addressButtons}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.defaultButton}
            onPress={() => setDefaultAddress(item.id)}
          >
            <Text style={styles.defaultButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => navigation.navigate('Checkout', { selectedAddress: item })}
        >
          <Text style={styles.selectButtonText}>Deliver Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Addresses</Text>
          <TouchableOpacity 
            onPress={getCurrentLocation} 
            disabled={loadingLocation}
            style={styles.locationIconButton}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Icon name="location" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {addresses.map((item) => renderAddressItem(item))}

        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingId(null);
              setNewAddress({ 
                type: 'Home', 
                address: '', 
                city: '', 
                state: '', 
                pincode: '', 
                landmark: '', 
                phone: user?.phone || '' 
              });
              setShowAddForm(true);
            }}
          >
            <Icon name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        )}

        {showAddForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>{editingId ? 'Edit Address' : 'Add New Address'}</Text>
              <TouchableOpacity onPress={() => {
                setShowAddForm(false);
                setEditingId(null);
                setNewAddress({ 
                  type: 'Home', 
                  address: '', 
                  city: '', 
                  state: '', 
                  pincode: '', 
                  landmark: '', 
                  phone: user?.phone || '' 
                });
              }}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Address Type</Text>
              <View style={styles.typeSelector}>
                {['Home', 'Work', 'Other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      newAddress.type === type && styles.selectedType,
                    ]}
                    onPress={() => setNewAddress({ ...newAddress, type: type as 'Home' | 'Work' | 'Other' })}
                  >
                    <Text style={[
                      styles.typeOptionText,
                      newAddress.type === type && styles.selectedTypeText,
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Address Line *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                value={newAddress.address}
                onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Landmark (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nearby landmark"
                value={newAddress.landmark}
                onChangeText={(text) => setNewAddress({ ...newAddress, landmark: text })}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your city"
                  value={newAddress.city}
                  onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.inputLabel}>State *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your state"
                  value={newAddress.state}
                  onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pincode"
                value={newAddress.pincode}
                onChangeText={(text) => setNewAddress({ ...newAddress, pincode: text })}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={newAddress.phone}
                onChangeText={(text) => setNewAddress({ ...newAddress, phone: text })}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity 
              style={[styles.locationButton, loadingLocation && styles.locationButtonDisabled]} 
              onPress={getCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.locationButtonText}>Getting location...</Text>
                </>
              ) : (
                <>
                  <Icon name="location" size={20} color={colors.primary} />
                  <Text style={styles.locationButtonText}>Use Current Location</Text>
                </>
              )}
            </TouchableOpacity>

            {locationError && (
              <Text style={styles.locationErrorText}>
                ⚠️ {locationError}
              </Text>
            )}

            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setNewAddress({ 
                    type: 'Home', 
                    address: '', 
                    city: '', 
                    state: '', 
                    pincode: '', 
                    landmark: '', 
                    phone: user?.phone || '' 
                  });
                  setLocationError(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleAddAddress}
              >
                <Text style={styles.saveButtonText}>
                  {editingId ? 'Update Address' : 'Save Address'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginLeft: 12,
  },
  locationIconButton: {
    padding: 8,
  },
  addressCard: {
    backgroundColor: colors.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addressText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  addressLandmark: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 4,
  },
  addressCity: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
  addressPhone: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
  addressButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  defaultButton: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  defaultButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  selectButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  selectButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  formContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 44,
  },
  typeSelector: {
    flexDirection: 'row',
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTypeText: {
    color: colors.white,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  locationErrorText: {
    color: colors.danger,
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});