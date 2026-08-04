import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { Address } from '../../types';

interface AddressSelectorProps {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddAddress: () => void;
}

export default function AddressSelector({
  selectedAddress,
  onSelectAddress,
  onAddAddress,
}: AddressSelectorProps) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const addresses: Address[] = [
    {
      id: '1',
      type: 'Home',
      address: 'A-7, Sushil Apartment, Ramdas Colony',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422005',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      address: 'Flat No. 5, Dharam Residency, Boargad',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422004',
      isDefault: false,
    },
  ];

  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={[
        styles.addressItem,
        selectedAddress?.id === item.id && styles.selectedAddress,
      ]}
      onPress={() => {
        onSelectAddress(item);
        setModalVisible(false);
      }}
    >
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
        {selectedAddress?.id === item.id && (
          <Icon name="checkmark-circle" size={20} color={colors.success} />
        )}
      </View>
      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.addressCity}>{item.city}, {item.state} - {item.pincode}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.selectorContainer}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <Icon name="location-outline" size={24} color={colors.primary} />
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>
              {selectedAddress?.type || 'Select Address'}
            </Text>
            <Text style={styles.addressPreview} numberOfLines={1}>
              {selectedAddress?.address || 'Choose delivery address'}
            </Text>
          </View>
          <Icon name="chevron-down" size={20} color={colors.gray} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={addresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.addressesList}
            />
            <TouchableOpacity style={styles.addAddressButton} onPress={onAddAddress}>
              <Icon name="add-circle-outline" size={24} color={colors.primary} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  addressPreview: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addressesList: {
    paddingVertical: 8,
  },
  addressItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedAddress: {
    borderColor: colors.primary,
    backgroundColor: '#fff5ec',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 14,
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
  addressText: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 6,
  },
  addressCity: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    marginTop: 8,
  },
  addAddressText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
});