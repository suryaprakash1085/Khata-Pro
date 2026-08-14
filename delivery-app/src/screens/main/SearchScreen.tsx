import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_URL } from '@env';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';


interface Product {
  id: string;
  name: string;
  category: string;
  selling_price: number;
  stock_qty: number;
  description?: string;
  image?: string;
  barcode?: string;
  sku?: string;
  brand?: string;
  vendor?: string;
  gst_percent?: number;
  unit?: string;
  business_id?: string;
}

const POPULAR_CATEGORIES = [
  { id: 1, name: 'Groceries', icon: '🛒' },
  { id: 2, name: 'Electronics', icon: '💻' },
  { id: 3, name: 'Clothing', icon: '👕' },
  { id: 4, name: 'Books', icon: '📚' },
  { id: 5, name: 'Home & Living', icon: '🏠' },
  { id: 6, name: 'Beauty', icon: '💄' },
];

interface SearchScreenProps {
  navigation: any;
  route: any; 
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedBusiness } = useContext(SelectedBusinessContext);
  const businessId = route?.params?.businessId ?? selectedBusiness?.id;
  

  useEffect(() => {
    loadProducts();
    loadRecentSearches();
  }, [businessId]);

  // const loadProducts = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await axios.get(`${API_URL}/public/products`);
  //     const products = Array.isArray(response.data) ? response.data : response.data.data || [];
  //     setAllProducts(products);
  //   } catch (err) {
  //     console.error('Failed to load products:', err);
  //     setError('Failed to load products. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadProducts = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(`${API_URL}/public/products`, {
      params: businessId ? { business_id: businessId } : {},
    });
    const products = Array.isArray(response.data) ? response.data : response.data.data || [];
    setAllProducts(products);
  } catch (err) {
    console.error('Failed to load products:', err);
    setError('Failed to load products. Please try again.');
  } finally {
    setLoading(false);
  }
};
  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    setIsSearching(text.length > 0);

    if (text.trim()) {
      const results = allProducts.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.category.toLowerCase().includes(text.toLowerCase()) ||
          (item.brand && item.brand.toLowerCase().includes(text.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
    if (updatedSearches.length > 10) {
      updatedSearches = updatedSearches.slice(0, 10);
    }
    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      saveSearch(searchText.trim());
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const clearRecentSearch = async (term: string) => {
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    await saveRecentSearches(updated);
  };

  const clearAllRecentSearches = async () => {
    Alert.alert(
      'Clear Recent Searches',
      'Are you sure you want to clear all recent searches?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setRecentSearches([]);
            await saveRecentSearches([]);
          },
        },
      ]
    );
  };

  const handleCategoryClick = (category: string) => {
    setSearchText(category);
    saveSearch(category);
    const results = allProducts.filter(
      (item) => item.category.toLowerCase().includes(category.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchText(term);
    saveSearch(term);
    const results = allProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.category.toLowerCase().includes(term.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(term.toLowerCase()))
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  const navigateToProduct = (product: Product) => {
    saveSearch(product.name);
    
    navigation.getParent()?.navigate('RestaurantDetail', { 
      restaurant: {
        id: product.id,
        name: product.name,
        rating: 4.5,
        deliveryTime: 'In Stock',
        cuisine: product.category,
        // image: product.image || 'https://via.placeholder.com/150',
        image: product.image || 'https://placehold.co/150x150',
        costForTwo: `₹${product.selling_price}`,
        address: product.description || 'Available in stock',
        isVeg: true,
        offer: `Stock: ${product.stock_qty} units`,
        productData: {
          id: product.id,
          price: product.selling_price,
          stock: product.stock_qty,
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
        }
      }
    });
  };

  const renderSearchResult = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigateToProduct(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultImageContainer}>
        <Image 
          // source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
          source={{ uri: item.image || 'https://placehold.co/150x150' }}
          style={styles.resultImage} 
        />
        <View style={[styles.stockBadge, { backgroundColor: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
          <Text style={styles.stockBadgeText}>{item.stock_qty} left</Text>
        </View>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
        <View style={styles.resultMeta}>
          <Text style={styles.resultPrice}>₹{item.selling_price}</Text>
          {item.brand && (
            <Text style={styles.resultBrand}>• {item.brand}</Text>
          )}
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleRecentSearchClick(item)}
    >
      <View style={styles.recentItemLeft}>
        <Icon name="time-outline" size={20} color="#7e808c" />
        <Text style={styles.recentItemText}>{item}</Text>
      </View>
      <TouchableOpacity onPress={() => clearRecentSearch(item)}>
        <Icon name="close-circle" size={20} color="#ccc" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryChip}
      onPress={() => handleCategoryClick(item.name)}
    >
      <Text style={styles.categoryEmoji}>{item.icon}</Text>
      <Text style={styles.categoryChipText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPopularProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.popularItem}
      onPress={() => navigateToProduct(item)}
      activeOpacity={0.7}
    >
      <View style={styles.popularItemLeft}>
        <Image 
          // source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
          source={{ uri: item.image || 'https://placehold.co/150x150' }}
          style={styles.popularItemImage} 
        />
        <View style={styles.popularItemInfo}>
          <Text style={styles.popularItemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.popularItemCategory}>{item.category}</Text>
          <View style={styles.popularItemMeta}>
            <Text style={styles.popularItemPrice}>₹{item.selling_price}</Text>
            <Text style={[styles.popularItemStock, { color: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
              • Stock: {item.stock_qty}
            </Text>
          </View>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#fc8019" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle-outline" size={60} color="#dc3545" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close-circle" size={20} color="#7e808c" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearching ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="search-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubText}>
                Try searching for something else
              </Text>
              {searchText.length > 0 && (
                <Text style={styles.emptySearchText}>
                  "{searchText}"
                </Text>
              )}
            </View>
          }
          ListHeaderComponent={
            searchResults.length > 0 ? (
              <Text style={styles.resultsCount}>
                {searchResults.length} product{searchResults.length > 1 ? 's' : ''} found
              </Text>
            ) : null
          }
        />
      ) : (
        <FlatList
          data={allProducts}
          renderItem={renderPopularProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shop by Category</Text>
                <FlatList
                  data={POPULAR_CATEGORIES}
                  renderItem={renderCategory}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>

              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearAllRecentSearches}>
                      <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={recentSearches}
                    renderItem={renderRecentSearch}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>All Products ({allProducts.length})</Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.footerText}>Available Products</Text>
              <Text style={styles.footerSub}>{allProducts.length} products available</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7e808c',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#fc8019',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#282c3f',
    padding: 0,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearAllText: {
    fontSize: 13,
    color: '#fc8019',
    fontWeight: '500',
  },
  categoriesList: {
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryChipText: {
    fontSize: 14,
    color: '#282c3f',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemText: {
    fontSize: 14,
    color: '#282c3f',
    marginLeft: 12,
  },
  resultsList: {
    padding: 16,
    paddingBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: '#7e808c',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f5',
  },
  resultImageContainer: {
    position: 'relative',
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  stockBadgeText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '600',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#282c3f',
  },
  resultCategory: {
    fontSize: 13,
    color: '#7e808c',
    marginTop: 2,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282c3f',
  },
  resultBrand: {
    fontSize: 12,
    color: '#7e808c',
    marginLeft: 4,
  },
  popularItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  popularItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  popularItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
    marginRight: 12,
  },
  popularItemInfo: {
    flex: 1,
  },
  popularItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282c3f',
  },
  popularItemCategory: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 2,
  },
  popularItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  popularItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#282c3f',
  },
  popularItemStock: {
    fontSize: 12,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  emptySearchText: {
    fontSize: 16,
    color: '#fc8019',
    fontWeight: '500',
    marginTop: 8,
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#93959f',
  },
  footerSub: {
    fontSize: 12,
    color: '#c0c0c0',
    marginTop: 4,
  },
});

export default SearchScreen;