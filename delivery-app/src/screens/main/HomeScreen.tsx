
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import axios from 'axios';
import { API_URL } from '@env';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { businessAPI } from '../../api/endpoints';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';
import { AddressContext } from '../../context/AddressContext';

const { width } = Dimensions.get('window');

// ✅ Same constants as AppNavigator's WebTopNavBar — kept in sync so this
// screen always clears the fixed top navbar on desktop web, no matter
// what padding the navigator itself does or doesn't apply.
const WEB_NAV_HEIGHT = 64;
const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen({ navigation }: any) {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const { user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const { selectedBusiness, setSelectedBusiness } = useContext(SelectedBusinessContext);

  const { cartItems, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

  // ✅ Pulls whichever address the user last selected/detected on the
  // Delivery Address screen (including "Use Current Location"), so the
  // header always reflects the real delivery location instead of a
  // hardcoded placeholder.
  const { selectedAddress } = useContext(AddressContext);

  // =====================================================
  // LOAD BUSINESSES
  // =====================================================
  useEffect(() => {
    businessAPI
      // ✅ limit raised from the backend's default (20) to 500 so every
      // active store on the platform shows here, not just the latest 20.
      .getBusinesses({ limit: 500 })
      .then((res: any) => {
        let businessesData = [];

        if (Array.isArray(res)) {
          businessesData = res;
        } else if (res?.data && Array.isArray(res.data)) {
          businessesData = res.data;
        } else if (res?.data?.data && Array.isArray(res.data.data)) {
          businessesData = res.data.data;
        } else if (res?.businesses && Array.isArray(res.businesses)) {
          businessesData = res.businesses;
        }

        setBusinesses(businessesData);
        setFilteredBusinesses(businessesData);
      })
      .catch((err: any) => {
        console.error('❌ Failed to load businesses:', err);
        setBusinesses([]);
        setFilteredBusinesses([]);
      });
  }, []);

  // Load products ONLY for the selected shop (used by the picker/horizontal flow)
  useEffect(() => {
    if (!selectedBusinessId) {
      setProducts([]);
      return;
    }
    axios
      .get(`${API_URL}/public/products`, { params: { business_id: selectedBusinessId } })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products:', err));
  }, [selectedBusinessId]);

  // =====================================================
  // SEARCH
  // =====================================================
  const handleSearch = (text: string) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter((business) => {
        const businessName = business.business_name || business.businessName || '';
        return businessName.toLowerCase().startsWith(text.toLowerCase());
      });
      setFilteredBusinesses(filtered);
    }
  };

  // =====================================================
  // HEADER — shows the currently selected store (from context, not login)
  // =====================================================
  const businessName = selectedBusiness?.name || 'Select a Store';
  const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

  // =====================================================
  // HEADER — delivery location label & line
  // Comes from AddressContext.selectedAddress (set either by picking a
  // saved address, or by "Use Current Location" on AddressSelectionScreen).
  // Falls back to a friendly placeholder when nothing is set yet.
  // =====================================================
  const locationLabel = selectedAddress?.type || 'Home';

  const locationLine = selectedAddress
    ? [selectedAddress.city, selectedAddress.state]
        .filter(Boolean)
        .join(', ') || selectedAddress.address
    : 'Set your delivery location';

  // =====================================================
  // STORE CARD — Amazon-style grid product card.
  // Same data/behaviour as before (tap syncs context + navigates to
  // ProductList) — only the card's visual structure changed.
  // =====================================================
  const renderStoreCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => {
        console.log('🛒 Clicked store:', item.business_name, 'ID:', item.id);

        // ✅ Sync context so downstream screens (ProductList/Cart/Checkout) use the right store
        setSelectedBusiness({
          id: item.id,
          name: item.business_name,
        });

        navigation.navigate('ProductList', {
          storeId: item.id,
          storeName: item.business_name || 'Store',
        });
      }}
      activeOpacity={0.75}
    >
      <View style={styles.storeCardContent}>
        <View style={styles.storeIconContainer}>
          <Icon name="storefront" size={28} color={colors.primary} />
        </View>

        <View style={styles.storeInfo}>
          <Text style={styles.storeName} numberOfLines={1}>
            {item.business_name || 'Unnamed Store'}
          </Text>

          <Text style={styles.storeType} numberOfLines={1}>
            {item.business_type || 'General Store'}
          </Text>

          {item.address && (
            <View style={styles.storeAddressRow}>
              <Icon name="location-outline" size={12} color={colors.textLight} />
              <Text style={styles.storeAddress} numberOfLines={1}>
                {' '}{item.address}
              </Text>
            </View>
          )}

          <View style={styles.storeMeta}>
            <Icon name="cube-outline" size={12} color={colors.primary} />
            <Text style={styles.storeProducts}>{' '}View Products</Text>
          </View>
        </View>

        <View style={styles.storeChevronWrap}>
          <Icon name="chevron-forward" size={20} color={colors.textLight} />
        </View>
      </View>
    </TouchableOpacity>
  );

  // =====================================================
  // UI
  // =====================================================
  return (
    <ScrollView
      style={[styles.container, isDesktopWeb && { paddingTop: WEB_NAV_HEIGHT }]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddressSelection')}
            activeOpacity={0.7}
          >
            <Text style={styles.locationLabel}>📍 {locationLabel}</Text>
            <Text style={styles.location} numberOfLines={1}>
              {locationLine}
            </Text>
          </TouchableOpacity>

          <View style={styles.businessCard}>
            <View style={styles.businessCardContent}>
              <Icon name="storefront-outline" size={16} color={colors.primary} />
              <Text style={styles.businessName}>{displayName}</Text>
              {selectedBusiness?.id && (
                <View style={styles.businessBadge}>
                  <Text style={styles.businessBadgeText}>ACTIVE</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-circle-outline" size={40} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurant, item or more"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* AVAILABLE STORES */}
      <View style={styles.restaurantsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Stores</Text>
          <Text style={styles.storeCount}>{filteredBusinesses.length} stores</Text>
        </View>

        {filteredBusinesses.length === 0 ? (
          <View style={styles.emptyProducts}>
            <Icon name="storefront-outline" size={45} color="#b5b5b5" />
            <Text style={styles.emptyProductsText}>
              {searchText.trim() !== ''
                ? `No stores found matching "${searchText}"`
                : 'No stores available'}
            </Text>
          </View>
        ) : (
          filteredBusinesses.map((store: any) => (
            <View key={store.id}>{renderStoreCard({ item: store })}</View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// =========================================================
// STYLES
// =========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  businessCard: {
    marginTop: 6,
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#d4e4ff',
    alignSelf: 'flex-start',
  },
  businessCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  businessBadge: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  businessBadgeText: {
    fontSize: 8,
    color: colors.white,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  restaurantsSection: {
    marginVertical: 8,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  storeCard: {
    backgroundColor: '#f4f2fc',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  storeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  storeType: {
    fontSize: 12.5,
    color: colors.textLight,
    marginBottom: 4,
  },
  storeAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 11.5,
    color: colors.textLight,
    flexShrink: 1,
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeProducts: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.primary,
  },
  storeChevronWrap: {
    marginLeft: 8,
  },
  emptyProducts: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyProductsText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 10,
    textAlign: 'center',
  },
});
