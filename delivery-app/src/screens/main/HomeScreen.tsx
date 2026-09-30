  import React, { useState, useEffect, useContext } from 'react';
  import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
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
  import { customerNotificationAPI } from '../../api/customerNotifications';  

  const { width } = Dimensions.get('window');

  const WEB_NAV_HEIGHT = 64;
  const DESKTOP_BREAKPOINT = 768;

  // Same asset already used by AppNavigator's sidebar (scooter logo) —
  // reused here for the hero banner illustration so we don't need a new asset.
  const scooterLogo = require('../../../assets/images/scooter-logo.png');

  // ============================================================
  // 🎨 THEME — purple / lavender redesign
  // (Local theme only, so this screen's look doesn't depend on
  // whatever colors.ts happens to define elsewhere — same pattern
  // already used in CartScreen.tsx / OrdersScreen.tsx.)
  // ============================================================
  const THEME = {
    primary: '#6C5CE7',
    primaryDark: '#5541D7',
    primaryLight: '#F1EEFF',
    primarySoft: '#EDE9FE',
    text: '#1E1B2E',
    subtext: '#8A85A0',
    border: '#EFEDF7',
    bg: '#FFFFFF',
    bgSoft: '#FAFAFD',
    success: '#22B07D',
    successLight: '#E4F8EF',
  };

  const FONT_FAMILY = Platform.select({
    web: '"Times New Roman", Times, serif',
    ios: 'Times New Roman',
    android: 'serif',
    default: 'Times New Roman',
  });

  // Web-only: suppress the browser's default focus outline on TouchableOpacity
  // (which renders as a focusable <div> on react-native-web) — same fix
  // already used for the WebSideNav menu items.
  const noWebFocusOutline =
    Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as any) : {};

  // ============================================================
  // 🏷️ DECORATIVE CATEGORY LIST (UI ONLY)
  // No filtering logic exists for categories in the current app,
  // so per the "don't invent backend/business logic" rule, these
  // are display-only chips (matches the mobile app's category row
  // visually). Wire these to real filtering later if/when that
  // logic is added to the backend.
  // ============================================================
  const DISPLAY_CATEGORIES = [
    { key: 'fashion', label: 'Fashion', icon: 'shirt-outline' },
    { key: 'sarees', label: 'Sarees', icon: 'woman-outline' },
    { key: 'kids', label: 'Kids', icon: 'happy-outline' },
    { key: 'supermarket', label: 'Supermarket', icon: 'cart-outline' },
    { key: 'medical', label: 'Medical', icon: 'medkit-outline' },
    { key: 'food', label: 'Food', icon: 'fast-food-outline' },
    { key: 'beauty', label: 'Beauty', icon: 'sparkles-outline' },
    { key: 'home', label: 'Home & Living', icon: 'home-outline' },
    { key: 'electronics', label: 'Electronics', icon: 'phone-portrait-outline' },
  ];
 
  
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

    const { cartItems } = useContext(CartContext);

    const { selectedAddress } = useContext(AddressContext);

   const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  if (!user?.id) return;
  const fetchCount = () =>
    customerNotificationAPI
      .unreadCount()
      .then((response) => setUnreadCount(response.data?.count ?? 0))
      .catch(() => {});
  fetchCount();
  const interval = setInterval(fetchCount, 20000);
  return () => clearInterval(interval);
}, [user?.id]);

    useEffect(() => {
      businessAPI
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

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text.trim() === '') {
      setFilteredBusinesses(businesses);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/public/search`, {
        params: { q: text },
      });
      setFilteredBusinesses(res.data.data || []);
    } catch (err) {
      console.error('Search failed:', err);
      setFilteredBusinesses([]);
    }
  };

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryPress = async (categoryLabel: string) => {
    // Same category thirumba click pannina, filter clear pannunga (toggle)
    if (activeCategory === categoryLabel) {
      setActiveCategory(null);
      setFilteredBusinesses(businesses);
      return;
    }

    setActiveCategory(categoryLabel);
    setSearchText(''); // search box clear pannunga, confusion varaadhu

    try {
      const res = await axios.get(`${API_URL}/public/businesses/by-category`, {
        params: { category: categoryLabel },
      });
      setFilteredBusinesses(res.data.data || []);
    } catch (err) {
      console.error('Category filter failed:', err);
      setFilteredBusinesses([]);
    }
  };
    const businessName = selectedBusiness?.name || 'Select a Store';
    const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

    const locationLine = selectedAddress
      ? [selectedAddress.city, selectedAddress.state]
          .filter(Boolean)
          .join(', ') || selectedAddress.address
      : 'Set your delivery location';

    // Good Morning / Afternoon / Evening greeting — purely a display string,
    // no data/logic change.
    const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good Evening';
    if (hour < 12) timeGreeting = 'Good Morning';
    else if (hour < 17) timeGreeting = 'Good Afternoon';

    // user.name / user.full_name / user.first_name — endha field AuthContext
    // la irukko andha field name check pannunga
    const firstName = user?.name?.split(' ')[0] || user?.name?.split(' ')[0] || '';

    return firstName
      ? `${timeGreeting}, ${firstName}! `
      : `${timeGreeting}! `;
  };

    const safeCartItems: any[] = Array.isArray(cartItems) ? cartItems : [];

    // Simple, single-column store row — one shop below another, no grid/photo
    // card. Only real backend fields are shown (rating/distance/open-status
    // render only when present — nothing here is invented).
    const renderStoreRow = (item: any) => {
      const hasRating = item.rating !== undefined && item.rating !== null;
      const hasDistance = item.distance_km !== undefined && item.distance_km !== null;
      const hasOpenStatus = item.is_open !== undefined && item.is_open !== null;
 
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.storeCard}
          onPress={() => {
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
              <Icon name="storefront" size={26} color={THEME.primary} />
            </View>

            <View style={styles.storeInfo}>
              <View style={styles.storeNameRow}>
                <Text style={styles.storeName} numberOfLines={1}>
                  {item.business_name || 'Unnamed Store'}
                </Text>
                {hasOpenStatus && (
                  <View style={item.is_open ? styles.openBadge : styles.closedBadge}>
                    <Text style={item.is_open ? styles.openBadgeText : styles.closedBadgeText}>
                      {item.is_open ? 'Open' : 'Closed'}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.storeType} numberOfLines={1}>
                {item.business_type || 'General Store'}
              </Text>

              {(hasRating || hasDistance) && (
                <View style={styles.storeMetaRow}>
                  {hasRating && (
                    <View style={styles.storeMetaItem}>
                      <Icon name="star" size={12} color="#F5A623" />
                      <Text style={styles.storeMetaText}>{item.rating}</Text>
                    </View>
                  )}
                  {hasDistance && (
                    <Text style={styles.storeMetaText}>
                      {hasRating ? '  •  ' : ''}{item.distance_km} km
                    </Text>
                  )}
                </View>
              )}

              {item.address && (
                <View style={styles.storeAddressRow}>
                  <Icon name="location-outline" size={12} color={THEME.subtext} />
                  <Text style={styles.storeAddress} numberOfLines={1}>
                    {' '}{item.address}
                  </Text>
                </View>
              )}

              <View style={styles.storeMeta}>
                <Icon name="cube-outline" size={12} color={THEME.primary} />
                <Text style={styles.storeProducts}>{' '}View Products</Text>
              </View>
            </View>

            <View style={styles.storeChevronWrap}>
              <Icon name="chevron-forward" size={20} color={THEME.subtext} />
            </View>
          </View>
        </TouchableOpacity>
      );
    };

  // AFTER — TouchableOpacity + active state highlight
  const renderCategoryChip = (cat: (typeof DISPLAY_CATEGORIES)[number]) => {
    const isActive = activeCategory === cat.label;

    return (
      <TouchableOpacity
        key={cat.key}
        style={styles.categoryChip}
        onPress={() => handleCategoryPress(cat.label)}
        activeOpacity={0.75}
      >
        <View style={[styles.categoryIconWrap, isActive && styles.categoryIconWrapActive]}>
          <Icon name={cat.icon} size={22} color={isActive ? '#fff' : THEME.primary} />
        </View>
        <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]} numberOfLines={1}>
          {cat.label}
        </Text>
      </TouchableOpacity>
    );
  };

    // =====================================================
    // UI
    // =====================================================
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={isDesktopWeb && styles.desktopContentWrap}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('AddressSelection')}
              activeOpacity={0.7}
              style={styles.locationRow}
            >
              <Icon name="location-sharp" size={13} color={THEME.primary} />
              <Text style={styles.location} numberOfLines={1}>
                {' '}Delivering to {locationLine}
              </Text>
            </TouchableOpacity>

            <View style={styles.businessCard}>
              <View style={styles.businessCardContent}>
                <Icon name="storefront-outline" size={16} color={THEME.primary} />
                <Text style={styles.businessName}>{displayName}</Text>
                {selectedBusiness?.id && (
                  <View style={styles.businessBadge}>
                    <Text style={styles.businessBadgeText}>ACTIVE</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* Decorative notification bell — no notifications backend wired yet */}
            <TouchableOpacity
  style={styles.headerIconBtn}
  activeOpacity={0.7}
  onPress={() => navigation.navigate('Notifications')}
>
  <Icon name="notifications-outline" size={22} color={THEME.text} />
  {unreadCount > 0 && (
    <View style={styles.cartBadge}>
      <Text style={styles.cartBadgeText}>{unreadCount}</Text>
    </View>
  )}
</TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Cart')}
            >
              <Icon name="cart-outline" size={22} color={THEME.text} />
              {safeCartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{safeCartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Icon name="person-circle-outline" size={40} color={THEME.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO BANNER */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroTitle}>
              {isDesktopWeb ? 'What would you like\nto shop today?' : 'Get Everything\nDelivered to Your Door'}
            </Text>
            <Text style={styles.heroSubtitle}>Fresh products  •  Best quality  •  Fast delivery</Text>

            <View style={styles.heroSearchContainer}>
              <Icon name="search" size={18} color={THEME.subtext} style={styles.searchIcon} />
              <TextInput
                style={styles.heroSearchInput}
                placeholder="Search for products, stores or categories..."
                placeholderTextColor={THEME.subtext}
                value={searchText}
                onChangeText={handleSearch}
              />
            </View>
          </View>

          <Image source={scooterLogo} style={styles.heroImage} resizeMode="contain" />
        </View>

        {/* CATEGORIES (decorative — see note at top of file) */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <Text style={styles.viewAllLink}>View All →</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {DISPLAY_CATEGORIES.map(renderCategoryChip)}
          </ScrollView>
        </View>

        {/* AVAILABLE STORES — single column, one shop below another */}
        <View style={styles.restaurantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Stores</Text>
            <Text style={styles.storeCount}>{filteredBusinesses.length} stores</Text>
          </View>

          {filteredBusinesses.length === 0 ? (
            <View style={styles.emptyProducts}>
              <Icon name="storefront-outline" size={45} color="#c9c2ea" />
              <Text style={styles.emptyProductsText}>
                {searchText.trim() !== ''
                  ? `No stores found matching "${searchText}"`
                  : 'No stores available'}
              </Text>
            </View>
          ) : (
            filteredBusinesses.map((store: any) => renderStoreRow(store))
          )}
        </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: THEME.bg,
      paddingHorizontal: 16,
    },
    desktopContentWrap: {
      width: '100%',
      maxWidth: 1220,
      alignSelf: 'flex-start',
      paddingTop: 8,
      paddingHorizontal: 8,
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
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIconBtn: {
      marginRight: 14,
      position: 'relative',
      ...noWebFocusOutline,
    },
    cartBadge: {
      position: 'absolute',
      top: -4,
      right: -6,
      backgroundColor: '#E4574C',
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      paddingHorizontal: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cartBadgeText: {
      color: '#fff',
      fontSize: 9,
      fontWeight: '700',
      fontFamily: FONT_FAMILY,
    },
    greeting: {
      fontSize: 20,
      fontWeight: '700',
      color: THEME.text,
      fontFamily: FONT_FAMILY,
      marginBottom: 4,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    location: {
      fontSize: 13.5,
      color: THEME.subtext,
      fontFamily: FONT_FAMILY,
    },
    businessCard: {
      marginTop: 8,
      backgroundColor: THEME.primaryLight,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: '#E3DEFB',
      alignSelf: 'flex-start',
    },
    businessCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    businessName: {
      fontSize: 13,
      fontWeight: '600',
      color: THEME.primary,
      marginLeft: 6,
      fontFamily: FONT_FAMILY,
    },
    businessBadge: {
      backgroundColor: THEME.primary,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 1,
      marginLeft: 8,
    },
    businessBadgeText: {
      fontSize: 8,
      color: '#ffffff',
      fontWeight: '700',
      fontFamily: FONT_FAMILY,
    },
    // HERO BANNER
    heroBanner: {
      flexDirection: 'row',
      backgroundColor: THEME.primaryLight,
      borderRadius: 20,
      padding: 20,
      marginTop: 18,
      marginBottom: 20,
      alignItems: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E3DEFB',
    },
    heroTextCol: {
      flex: 1,
      paddingRight: 12,
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: THEME.text,
      fontFamily: FONT_FAMILY,
      lineHeight: 28,
      marginBottom: 6,
    },
    heroSubtitle: {
      fontSize: 12.5,
      color: THEME.subtext,
      fontFamily: FONT_FAMILY,
      marginBottom: 14,
    },
    heroSearchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 14,
      paddingHorizontal: 14,
      height: 48,
      borderWidth: 1,
      borderColor: '#E3DEFB',
    },
    searchIcon: {
      marginRight: 8,
    },
    heroSearchInput: {
      flex: 1,
      fontSize: 13.5,
      color: THEME.text,
      fontFamily: FONT_FAMILY,
    },
    heroImage: {
      width: 90,
      height: 90,
    },
    categorySection: {
      marginBottom: 8,
    },
    categoryRow: {
      paddingVertical: 4,
      paddingRight: 8,
    },
    categoryChip: {
      alignItems: 'center',
      width: 76,
      marginRight: 14,
    },
    categoryIconWrap: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor: THEME.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
      borderWidth: 1,
      borderColor: '#E3DEFB',
    },
    categoryLabel: {
      fontSize: 11.5,
      color: THEME.text,
      fontWeight: '600',
      textAlign: 'center',
      fontFamily: FONT_FAMILY,
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
      fontSize: 13.5,
      color: THEME.subtext,
      fontFamily: FONT_FAMILY,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: THEME.text,
      fontFamily: FONT_FAMILY,
    },
    viewAllLink: {
      fontSize: 13,
      fontWeight: '600',
      color: THEME.primary,
      fontFamily: FONT_FAMILY,
    },
    // SINGLE-COLUMN STORE ROW
    storeCard: {
      backgroundColor: THEME.bgSoft,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: THEME.border,
      shadowColor: THEME.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 1,
      ...noWebFocusOutline,
    },
    storeCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    storeIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#ffffff',
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
    storeNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryIconWrapActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  categoryLabelActive: {
    color: THEME.primary,
    fontWeight: '700',
  },
    storeName: {
      fontSize: 15.5,
      fontWeight: '700',
      color: THEME.text,
      marginBottom: 2,
      fontFamily: FONT_FAMILY,
      flexShrink: 1,
    },
    openBadge: {
      backgroundColor: THEME.successLight,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
    },
    openBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: THEME.success,
      fontFamily: FONT_FAMILY,
    },
    closedBadge: {
      backgroundColor: '#FBE9E7',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
    },
    closedBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#D9534F',
      fontFamily: FONT_FAMILY,
    },
    storeType: {
      fontSize: 12.5,
      color: THEME.subtext,
      marginBottom: 4,
      fontFamily: FONT_FAMILY,
    },
    storeMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    storeMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    storeMetaText: {
      fontSize: 11.5,
      color: THEME.subtext,
      fontFamily: FONT_FAMILY,
      marginLeft: 3,
    },
    storeAddressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    storeAddress: {
      fontSize: 11.5,
      color: THEME.subtext,
      flexShrink: 1,
      fontFamily: FONT_FAMILY,
    },
    storeMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    storeProducts: {
      fontSize: 12.5,
      fontWeight: '600',
      color: THEME.primary,
      fontFamily: FONT_FAMILY,
    },
    storeChevronWrap: {
      marginLeft: 8,
    },
    emptyProducts: {
      backgroundColor: THEME.primaryLight,
      borderRadius: 14,
      paddingVertical: 35,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyProductsText: {
      fontSize: 14,
      color: THEME.subtext,
      marginTop: 10,
      textAlign: 'center',
      fontFamily: FONT_FAMILY,
    },
  });