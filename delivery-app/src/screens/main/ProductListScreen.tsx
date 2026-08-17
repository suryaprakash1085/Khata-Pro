import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  TextInput,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';
import axios from 'axios';
import { API_URL } from '@env';

const { width, height } = Dimensions.get('window');

export default function ProductListScreen({ route, navigation }: any) {
  console.log('🟢 ProductListScreen MOUNTED');
  
  const { storeId, storeName } = route.params || {};
  console.log('📦 Received params:', { storeId, storeName });
  
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(storeId || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  
  // ✅ FILTER STATES
  const [filterSidebarVisible, setFilterSidebarVisible] = useState<boolean>(false);
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string | null>('All');
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({min: '', max: ''});
  const [sortBy, setSortBy] = useState<string>('default');
  const [showInStock, setShowInStock] = useState<boolean>(false);
  
  // ✅ SEARCH STATES
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { user } = useContext(AuthContext);
  const { setSelectedBusiness } = useContext(SelectedBusinessContext);
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useContext(CartContext);

  // Load products for the selected store
  useEffect(() => {
    console.log('🔄 useEffect triggered with storeId:', storeId);
    
    if (!storeId) {
      console.log('❌ No storeId provided');
      setLoading(false);
      setError('No store selected');
      return;
    }

    setSelectedStoreId(storeId);
    
    if (storeName) {
      setSelectedBusiness({
        id: storeId,
        name: storeName,
      });
    }

    loadProducts(storeId);
  }, [storeId]);

  const loadProducts = async (businessId: number) => {
    console.log('🔄 Loading products for store:', businessId);
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_URL}/public/products?business_id=${businessId}`;
      console.log('🔗 API URL:', url);
      
      const response = await axios.get(url);
      console.log('✅ Response received:', response.data);

      let productsData: any[] = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      } else if (response.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else {
        productsData = [];
      }

      console.log('📦 Products count:', productsData.length);
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(productsData.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      if (productsData.length === 0) {
        setError('No products available for this store');
      }
    } catch (err: any) {
      console.error('❌ Error loading products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Search filter - matches products that START with the search term (case-insensitive)
  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];

      // If search has content, apply search filter (matches starting letters)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(product => {
          const name = (product.name || '').toLowerCase();
          const category = (product.category || '').toLowerCase();
          const description = (product.description || '').toLowerCase();
          const brand = (product.brand || '').toLowerCase();
          
          // Check if any field STARTS WITH the search query
          return name.startsWith(query) || 
                 category.startsWith(query) || 
                 description.startsWith(query) ||
                 brand.startsWith(query);
        });
      } else {
        // If search is empty, apply category filter
        if (selectedCategory !== 'All' && selectedCategory) {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }
      }

      // ✅ Apply price range filter
      if (priceRange.min) {
        const minPrice = parseFloat(priceRange.min);
        filtered = filtered.filter(p => (p.selling_price || 0) >= minPrice);
      }
      if (priceRange.max) {
        const maxPrice = parseFloat(priceRange.max);
        filtered = filtered.filter(p => (p.selling_price || 0) <= maxPrice);
      }

      // ✅ Apply stock filter
      if (showInStock) {
        filtered = filtered.filter(p => (p.stock_qty || 0) > 0);
      }

      // ✅ Apply sorting
      if (sortBy === 'price_low') {
        filtered.sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0));
      } else if (sortBy === 'price_high') {
        filtered.sort((a, b) => (b.selling_price || 0) - (a.selling_price || 0));
      } else if (sortBy === 'name_asc') {
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      } else if (sortBy === 'name_desc') {
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [searchQuery, selectedCategory, products, priceRange, showInStock, sortBy]);

  // ✅ Apply filters from sidebar
  const applyFilters = () => {
    setSelectedCategory(tempSelectedCategory);
    setFilterSidebarVisible(false);
  };

  // ✅ Reset all filters
  const resetFilters = () => {
    setTempSelectedCategory('All');
    setPriceRange({min: '', max: ''});
    setSortBy('default');
    setShowInStock(false);
    setSelectedCategory('All');
    setFilterSidebarVisible(false);
  };

  // ✅ Toggle search visibility
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      // Clearing search when closing
      setSearchQuery('');
    }
  };

  // Cart Functions
  const isItemInCart = (productId: string | number) => {
    return cartItems.some(
      item => item.id === String(productId) && item.restaurantId === String(selectedStoreId)
    );
  };

  const getItemQuantity = (productId: string | number) => {
    const item = cartItems.find(
      cartItem => cartItem.id === String(productId) && cartItem.restaurantId === String(selectedStoreId)
    );
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: any) => {
    if (!selectedStoreId) {
      Alert.alert('Error', 'No store selected');
      return;
    }

    const cartItem = {
      id: String(product.id),
      name: product.name,
      price: Number(product.selling_price || 0),
      quantity: 1,
      image: product.image || 'https://placehold.co/150x150',
      restaurantId: String(selectedStoreId),
      restaurantName: storeName || 'Store',
    };

    const restaurantData = {
      id: String(selectedStoreId),
      name: storeName || 'Store',
      rating: 4.5,
      deliveryTime: 'In Stock',
      cuisine: product.category || 'General',
      image: product.image || 'https://placehold.co/150x150',
      costForTwo: `₹${product.selling_price}`,
      address: product.description || 'Available in stock',
      isVeg: true,
      offer: `Stock: ${product.stock_qty || 0} units`,
      productData: {
        id: String(product.id),
        price: Number(product.selling_price || 0),
        stock: Number(product.stock_qty || 0),
        category: product.category,
        description: product.description,
        brand: product.brand,
        vendor: product.vendor,
        gst: product.gst_percent,
        unit: product.unit,
        barcode: product.barcode,
        sku: product.sku,
        image: product.image,
        name: product.name,
      },
    };

    addToCart(cartItem, restaurantData);
    Alert.alert('Added to Cart', `${product.name} added to cart!`);
  };

  const handleUpdateQuantity = (product: any, newQuantity: number) => {
    if (!selectedStoreId) return;

    const productId = String(product.id);
    const shopId = String(selectedStoreId);

    if (newQuantity === 0) {
      removeFromCart(productId, shopId);
    } else {
      updateQuantity(productId, shopId, newQuantity);
    }
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', {
      product: {
        ...product,
        storeId: selectedStoreId,
        storeName: storeName,
      },
    });
  };

  // Get cart total items and price
  const getCartTotal = () => {
    const storeCartItems = cartItems.filter(item => item.restaurantId === String(selectedStoreId));
    const totalItems = storeCartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = storeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  const { totalItems, totalPrice } = getCartTotal();

  // ✅ Navigate to Cart with current store context
  const navigateToCart = () => {
    console.log('🛒 Navigating to Cart with storeId:', selectedStoreId);
    if (selectedStoreId && storeName) {
      setSelectedBusiness({
        id: selectedStoreId,
        name: storeName,
      });
    }
    navigation.navigate('Cart');
  };

  // Render Product Card
  const renderProduct = ({ item }: { item: any }) => {
    const inCart = isItemInCart(item.id);
    const quantity = getItemQuantity(item.id);

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          style={styles.productContent}
          activeOpacity={0.7}
          onPress={() => handleProductPress(item)}
        >
          <Image
            source={{ uri: item.image || 'https://placehold.co/150x150' }}
            style={styles.productImage}
          />
          
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name || 'Unnamed Product'}
            </Text>
            
            <Text style={styles.productCategory} numberOfLines={1}>
              {item.category || 'Uncategorized'}
            </Text>
            
            <Text style={styles.productPrice}>
              ₹{item.selling_price || 0}
            </Text>
            
            <Text style={styles.productStock}>
              Stock: {item.stock_qty || 0} units
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.productAction}>
          {inCart ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item, quantity - 1)}
              >
                <Icon name="remove" size={14} color="#fc8019" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item, quantity + 1)}
              >
                <Icon name="add" size={14} color="#fc8019" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render Category Chip
  const renderCategoryChip = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive,
      ]}
      onPress={() => {
        setSelectedCategory(category);
        // Clear search when selecting category
        if (searchQuery.trim().length > 0) {
          setSearchQuery('');
        }
      }}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === category && styles.categoryChipTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  // ✅ Render Filter Sidebar (slides from right)
  const renderFilterSidebar = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={filterSidebarVisible}
      onRequestClose={() => setFilterSidebarVisible(false)}
    >
      <View style={styles.sidebarOverlay}>
        <TouchableWithoutFeedback onPress={() => setFilterSidebarVisible(false)}>
          <View style={styles.sidebarBackground} />
        </TouchableWithoutFeedback>
        
        <View style={styles.sidebarContent}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Filters</Text>
            <TouchableOpacity 
              onPress={() => setFilterSidebarVisible(false)}
              style={styles.sidebarCloseButton}
            >
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sidebarScrollContent}
          >
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.categoryList}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.sidebarCategoryItem,
                      tempSelectedCategory === category && styles.sidebarCategoryItemActive,
                    ]}
                    onPress={() => setTempSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.sidebarCategoryText,
                        tempSelectedCategory === category && styles.sidebarCategoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                    {tempSelectedCategory === category && (
                      <Icon name="checkmark" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceLabel}>Min (₹)</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={priceRange.min}
                    onChangeText={(text) => setPriceRange({...priceRange, min: text})}
                  />
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceLabel}>Max (₹)</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Any"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={priceRange.max}
                    onChangeText={(text) => setPriceRange({...priceRange, max: text})}
                  />
                </View>
              </View>
            </View>

            {/* Sort By */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { value: 'default', label: 'Default' },
                  { value: 'price_low', label: 'Price: Low to High' },
                  { value: 'price_high', label: 'Price: High to Low' },
                  { value: 'name_asc', label: 'Name: A to Z' },
                  { value: 'name_desc', label: 'Name: Z to A' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortOption,
                      sortBy === option.value && styles.sortOptionActive,
                    ]}
                    onPress={() => setSortBy(option.value)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy === option.value && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {sortBy === option.value && (
                      <Icon name="checkmark" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stock Filter */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.stockFilter}
                onPress={() => setShowInStock(!showInStock)}
              >
                <View style={styles.checkboxContainer}>
                  <View style={[styles.checkbox, showInStock && styles.checkboxChecked]}>
                    {showInStock && <Icon name="checkmark" size={14} color={colors.white} />}
                  </View>
                  <Text style={styles.stockFilterText}>Show only in-stock items</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.sidebarActions}>
              <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{storeName || 'Products'}</Text>
          <Text style={styles.headerSubtitle}>
            {products.length} products available
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* ✅ Search Icon */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={toggleSearch}
          >
            <Icon name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={navigateToCart}
          >
            <Icon name="cart-outline" size={24} color={colors.primary} />
            {cartItems.filter(item => item.restaurantId === String(selectedStoreId)).length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItems.filter(item => item.restaurantId === String(selectedStoreId)).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Search Bar - Shown when search icon is clicked */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#7e808c"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={20} color="#7e808c" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={toggleSearch} style={styles.searchCloseButton}>
              <Text style={styles.searchCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          {/* Search Results Count */}
          {searchQuery.length > 0 && (
            <View style={styles.searchResultHeader}>
              <Text style={styles.searchResultCount}>
                {filteredProducts.length} results found for "{searchQuery}"
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Categories Row - Hide when searching */}
      {!showSearch && (
        <View style={styles.categoriesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => renderCategoryChip(category))}
          </ScrollView>
        </View>
      )}

      {/* Filter Row */}
      {!showSearch && (
        <View style={styles.filterRow}>
          <Text style={styles.filterTitle}>
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </Text>
          <Text style={styles.filterCount}>({filteredProducts.length})</Text>
          <View style={styles.filterSpacer} />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => {
              setTempSelectedCategory(selectedCategory);
              setFilterSidebarVisible(true);
            }}
          >
            <Icon name="options-outline" size={20} color={colors.textLight} />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productListContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="cube-outline" size={60} color="#b5b5b5" />
            <Text style={styles.emptyText}>
              {searchQuery.trim().length > 0 ? 'No products match your search' : 'No products available'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery.trim().length > 0 
                ? `Try searching with different keywords` 
                : 'This store doesn\'t have any products yet'}
            </Text>
            {searchQuery.trim().length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>Clear search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* ✅ Filter Sidebar */}
      {renderFilterSidebar()}

      {/* ✅ Bottom Cart Bar - View Cart Button */}
      {totalItems > 0 && (
        <View style={styles.bottomCartBar}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemsCount}>{totalItems} items</Text>
            <Text style={styles.cartTotalPrice}>₹{totalPrice}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={navigateToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.viewCartText}>View Cart</Text>
            <Icon name="chevron-forward" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textLight,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  backButton: {
    padding: 4,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  headerSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchButton: {
    padding: 4,
    marginRight: 12,
  },

  cartButton: {
    padding: 4,
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    paddingHorizontal: 4,
  },

  // ✅ Search Styles
  searchContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#282c3f',
    paddingVertical: 8,
  },

  searchCloseButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  searchCloseText: {
    color: '#fc8019',
    fontSize: 14,
    fontWeight: '500',
  },

  searchResultHeader: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  searchResultCount: {
    fontSize: 12,
    color: '#7e808c',
  },

  clearSearchText: {
    fontSize: 14,
    color: '#fc8019',
    fontWeight: '600',
    marginTop: 12,
  },

  // Categories Styles
  categoriesWrapper: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },

  categoryChipActive: {
    backgroundColor: colors.primary,
  },

  categoryChipText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },

  categoryChipTextActive: {
    color: colors.white,
  },

  // Filter Row Styles
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  filterCount: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },

  filterSpacer: {
    flex: 1,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },

  filterButtonText: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 4,
  },

  // Product List Styles
  productListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },

  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  productContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },

  productCategory: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },

  productStock: {
    fontSize: 11,
    color: colors.textLight,
  },

  productAction: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },

  addButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    backgroundColor: colors.white,
    paddingHorizontal: 3,
  },

  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    minWidth: 22,
    textAlign: 'center',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },

  // ✅ Sidebar Styles (Filter from right)
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },

  sidebarBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  sidebarContent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.85,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  sidebarCloseButton: {
    padding: 4,
  },

  sidebarScrollContent: {
    paddingBottom: 30,
  },

  filterSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  categoryList: {
    gap: 4,
  },

  sidebarCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  sidebarCategoryItemActive: {
    backgroundColor: '#f0f8ff',
  },

  sidebarCategoryText: {
    fontSize: 15,
    color: colors.text,
  },

  sidebarCategoryTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  priceInputWrapper: {
    flex: 1,
  },

  priceLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },

  priceInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },

  priceSeparator: {
    fontSize: 16,
    color: colors.textLight,
    paddingHorizontal: 4,
  },

  sortOptions: {
    gap: 4,
  },

  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  sortOptionActive: {
    backgroundColor: '#f0f8ff',
  },

  sortOptionText: {
    fontSize: 14,
    color: colors.text,
  },

  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  stockFilter: {
    paddingVertical: 4,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  stockFilterText: {
    fontSize: 14,
    color: colors.text,
  },

  sidebarActions: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },

  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },

  resetButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },

  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },

  applyButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
  },

  // Bottom Cart Bar
  bottomCartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },

  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cartItemsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },

  cartTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },

  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  viewCartText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginRight: 4,
  },
});