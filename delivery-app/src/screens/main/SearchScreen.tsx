<<<<<<< HEAD
// // // // // import React, { useState, useEffect, useContext } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TextInput,
// // // // //   TouchableOpacity,
// // // // //   FlatList,
// // // // //   StyleSheet,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   Image,
// // // // //   Alert,
// // // // //   ActivityIndicator,
// // // // // } from 'react-native';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import axios from 'axios';
// // // // // import { API_URL } from '@env';
// // // // // import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';


// // // // // interface Product {
// // // // //   id: string;
// // // // //   name: string;
// // // // //   category: string;
// // // // //   selling_price: number;
// // // // //   stock_qty: number;
// // // // //   description?: string;
// // // // //   image?: string;
// // // // //   barcode?: string;
// // // // //   sku?: string;
// // // // //   brand?: string;
// // // // //   vendor?: string;
// // // // //   gst_percent?: number;
// // // // //   unit?: string;
// // // // //   business_id?: string;
// // // // // }

// // // // // const POPULAR_CATEGORIES = [
// // // // //   { id: 1, name: 'Groceries', icon: '🛒' },
// // // // //   { id: 2, name: 'Electronics', icon: '💻' },
// // // // //   { id: 3, name: 'Clothing', icon: '👕' },
// // // // //   { id: 4, name: 'Books', icon: '📚' },
// // // // //   { id: 5, name: 'Home & Living', icon: '🏠' },
// // // // //   { id: 6, name: 'Beauty', icon: '💄' },
// // // // // ];

// // // // // interface SearchScreenProps {
// // // // //   navigation: any;
// // // // //   route: any; 
// // // // // }

// // // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  
// // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // //   const [searchResults, setSearchResults] = useState<Product[]>([]);
// // // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // // //   const [isSearching, setIsSearching] = useState<boolean>(false);
// // // // //   const [allProducts, setAllProducts] = useState<Product[]>([]);
// // // // //   const [loading, setLoading] = useState<boolean>(true);
// // // // //   const [error, setError] = useState<string | null>(null);
// // // // //   const { selectedBusiness } = useContext(SelectedBusinessContext);
// // // // //   const businessId = route?.params?.businessId ?? selectedBusiness?.id;
  

// // // // //   useEffect(() => {
// // // // //     loadProducts();
// // // // //     loadRecentSearches();
// // // // //   }, [businessId]);

// // // // //   // const loadProducts = async () => {
// // // // //   //   try {
// // // // //   //     setLoading(true);
// // // // //   //     setError(null);
// // // // //   //     const response = await axios.get(`${API_URL}/public/products`);
// // // // //   //     const products = Array.isArray(response.data) ? response.data : response.data.data || [];
// // // // //   //     setAllProducts(products);
// // // // //   //   } catch (err) {
// // // // //   //     console.error('Failed to load products:', err);
// // // // //   //     setError('Failed to load products. Please try again.');
// // // // //   //   } finally {
// // // // //   //     setLoading(false);
// // // // //   //   }
// // // // //   // };

// // // // //   const loadProducts = async () => {
// // // // //   try {
// // // // //     setLoading(true);
// // // // //     setError(null);
// // // // //     const response = await axios.get(`${API_URL}/public/products`, {
// // // // //       params: businessId ? { business_id: businessId } : {},
// // // // //     });
// // // // //     const products = Array.isArray(response.data) ? response.data : response.data.data || [];
// // // // //     setAllProducts(products);
// // // // //   } catch (err) {
// // // // //     console.error('Failed to load products:', err);
// // // // //     setError('Failed to load products. Please try again.');
// // // // //   } finally {
// // // // //     setLoading(false);
// // // // //   }
// // // // // };
// // // // //   const loadRecentSearches = async () => {
// // // // //     try {
// // // // //       const saved = await AsyncStorage.getItem('recentSearches');
// // // // //       if (saved) {
// // // // //         setRecentSearches(JSON.parse(saved));
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Failed to load recent searches:', error);
// // // // //     }
// // // // //   };

// // // // //   const saveRecentSearches = async (searches: string[]) => {
// // // // //     try {
// // // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // // //     } catch (error) {
// // // // //       console.error('Failed to save recent searches:', error);
// // // // //     }
// // // // //   };

// // // // //   const handleSearch = (text: string) => {
// // // // //     setSearchText(text);
// // // // //     setIsSearching(text.length > 0);

// // // // //     if (text.trim()) {
// // // // //       const results = allProducts.filter(
// // // // //         (item) =>
// // // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // // //           item.category.toLowerCase().includes(text.toLowerCase()) ||
// // // // //           (item.brand && item.brand.toLowerCase().includes(text.toLowerCase()))
// // // // //       );
// // // // //       setSearchResults(results);
// // // // //     } else {
// // // // //       setSearchResults([]);
// // // // //     }
// // // // //   };

// // // // //   const saveSearch = (term: string) => {
// // // // //     if (!term.trim()) return;
// // // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // // //     if (updatedSearches.length > 10) {
// // // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // // //     }
// // // // //     setRecentSearches(updatedSearches);
// // // // //     saveRecentSearches(updatedSearches);
// // // // //   };

// // // // //   const handleSearchSubmit = () => {
// // // // //     if (searchText.trim()) {
// // // // //       saveSearch(searchText.trim());
// // // // //       setIsSearching(true);
// // // // //     }
// // // // //   };

// // // // //   const clearSearch = () => {
// // // // //     setSearchText('');
// // // // //     setSearchResults([]);
// // // // //     setIsSearching(false);
// // // // //   };

// // // // //   const clearRecentSearch = async (term: string) => {
// // // // //     const updated = recentSearches.filter(s => s !== term);
// // // // //     setRecentSearches(updated);
// // // // //     await saveRecentSearches(updated);
// // // // //   };

// // // // //   const clearAllRecentSearches = async () => {
// // // // //     Alert.alert(
// // // // //       'Clear Recent Searches',
// // // // //       'Are you sure you want to clear all recent searches?',
// // // // //       [
// // // // //         { text: 'Cancel', style: 'cancel' },
// // // // //         {
// // // // //           text: 'Clear All',
// // // // //           style: 'destructive',
// // // // //           onPress: async () => {
// // // // //             setRecentSearches([]);
// // // // //             await saveRecentSearches([]);
// // // // //           },
// // // // //         },
// // // // //       ]
// // // // //     );
// // // // //   };

// // // // //   const handleCategoryClick = (category: string) => {
// // // // //     setSearchText(category);
// // // // //     saveSearch(category);
// // // // //     const results = allProducts.filter(
// // // // //       (item) => item.category.toLowerCase().includes(category.toLowerCase())
// // // // //     );
// // // // //     setSearchResults(results);
// // // // //     setIsSearching(true);
// // // // //   };

// // // // //   const handleRecentSearchClick = (term: string) => {
// // // // //     setSearchText(term);
// // // // //     saveSearch(term);
// // // // //     const results = allProducts.filter(
// // // // //       (item) =>
// // // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // // //         item.category.toLowerCase().includes(term.toLowerCase()) ||
// // // // //         (item.brand && item.brand.toLowerCase().includes(term.toLowerCase()))
// // // // //     );
// // // // //     setSearchResults(results);
// // // // //     setIsSearching(true);
// // // // //   };

// // // // //   const navigateToProduct = (product: Product) => {
// // // // //     saveSearch(product.name);
    
// // // // //     navigation.getParent()?.navigate('RestaurantDetail', { 
// // // // //       restaurant: {
// // // // //         id: product.id,
// // // // //         name: product.name,
// // // // //         rating: 4.5,
// // // // //         deliveryTime: 'In Stock',
// // // // //         cuisine: product.category,
// // // // //         // image: product.image || 'https://via.placeholder.com/150',
// // // // //         image: product.image || 'https://placehold.co/150x150',
// // // // //         costForTwo: `₹${product.selling_price}`,
// // // // //         address: product.description || 'Available in stock',
// // // // //         isVeg: true,
// // // // //         offer: `Stock: ${product.stock_qty} units`,
// // // // //         productData: {
// // // // //           id: product.id,
// // // // //           price: product.selling_price,
// // // // //           stock: product.stock_qty,
// // // // //           category: product.category,
// // // // //           description: product.description,
// // // // //           brand: product.brand,
// // // // //           vendor: product.vendor,
// // // // //           gst: product.gst_percent,
// // // // //           unit: product.unit,
// // // // //           barcode: product.barcode,
// // // // //           sku: product.sku,
// // // // //           image: product.image,
// // // // //           name: product.name,
// // // // //         }
// // // // //       }
// // // // //     });
// // // // //   };

// // // // //   const renderSearchResult = ({ item }: { item: Product }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.resultItem}
// // // // //       onPress={() => navigateToProduct(item)}
// // // // //       activeOpacity={0.7}
// // // // //     >
// // // // //       <View style={styles.resultImageContainer}>
// // // // //         <Image 
// // // // //           // source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
// // // // //           source={{ uri: item.image || 'https://placehold.co/150x150' }}
// // // // //           style={styles.resultImage} 
// // // // //         />
// // // // //         <View style={[styles.stockBadge, { backgroundColor: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
// // // // //           <Text style={styles.stockBadgeText}>{item.stock_qty} left</Text>
// // // // //         </View>
// // // // //       </View>
// // // // //       <View style={styles.resultInfo}>
// // // // //         <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
// // // // //         <Text style={styles.resultCategory}>{item.category}</Text>
// // // // //         <View style={styles.resultMeta}>
// // // // //           <Text style={styles.resultPrice}>₹{item.selling_price}</Text>
// // // // //           {item.brand && (
// // // // //             <Text style={styles.resultBrand}>• {item.brand}</Text>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>
// // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   const renderRecentSearch = ({ item }: { item: string }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.recentItem}
// // // // //       onPress={() => handleRecentSearchClick(item)}
// // // // //     >
// // // // //       <View style={styles.recentItemLeft}>
// // // // //         <Icon name="time-outline" size={20} color="#7e808c" />
// // // // //         <Text style={styles.recentItemText}>{item}</Text>
// // // // //       </View>
// // // // //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// // // // //         <Icon name="close-circle" size={20} color="#ccc" />
// // // // //       </TouchableOpacity>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   const renderCategory = ({ item }: { item: any }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.categoryChip}
// // // // //       onPress={() => handleCategoryClick(item.name)}
// // // // //     >
// // // // //       <Text style={styles.categoryEmoji}>{item.icon}</Text>
// // // // //       <Text style={styles.categoryChipText}>{item.name}</Text>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   const renderPopularProduct = ({ item }: { item: Product }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.popularItem}
// // // // //       onPress={() => navigateToProduct(item)}
// // // // //       activeOpacity={0.7}
// // // // //     >
// // // // //       <View style={styles.popularItemLeft}>
// // // // //         <Image 
// // // // //           // source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
// // // // //           source={{ uri: item.image || 'https://placehold.co/150x150' }}
// // // // //           style={styles.popularItemImage} 
// // // // //         />
// // // // //         <View style={styles.popularItemInfo}>
// // // // //           <Text style={styles.popularItemName} numberOfLines={1}>{item.name}</Text>
// // // // //           <Text style={styles.popularItemCategory}>{item.category}</Text>
// // // // //           <View style={styles.popularItemMeta}>
// // // // //             <Text style={styles.popularItemPrice}>₹{item.selling_price}</Text>
// // // // //             <Text style={[styles.popularItemStock, { color: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
// // // // //               • Stock: {item.stock_qty}
// // // // //             </Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>
// // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // // // //         <ActivityIndicator size="large" color="#fc8019" />
// // // // //         <Text style={styles.loadingText}>Loading products...</Text>
// // // // //       </SafeAreaView>
// // // // //     );
// // // // //   }

// // // // //   if (error) {
// // // // //     return (
// // // // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // // // //         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
// // // // //         <Text style={styles.errorText}>{error}</Text>
// // // // //         <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
// // // // //           <Text style={styles.retryButtonText}>Retry</Text>
// // // // //         </TouchableOpacity>
// // // // //       </SafeAreaView>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // //       <View style={styles.header}>
// // // // //         <TouchableOpacity 
// // // // //           onPress={() => navigation.goBack()} 
// // // // //           style={styles.backButton}
// // // // //         >
// // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // //         </TouchableOpacity>
// // // // //         <View style={styles.searchContainer}>
// // // // //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// // // // //           <TextInput
// // // // //             style={styles.searchInput}
// // // // //             placeholder="Search for products..."
// // // // //             value={searchText}
// // // // //             onChangeText={handleSearch}
// // // // //             onSubmitEditing={handleSearchSubmit}
// // // // //             autoFocus
// // // // //             returnKeyType="search"
// // // // //           />
// // // // //           {searchText.length > 0 && (
// // // // //             <TouchableOpacity onPress={clearSearch}>
// // // // //               <Icon name="close-circle" size={20} color="#7e808c" />
// // // // //             </TouchableOpacity>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>

// // // // //       {isSearching ? (
// // // // //         <FlatList
// // // // //           data={searchResults}
// // // // //           renderItem={renderSearchResult}
// // // // //           keyExtractor={(item) => item.id}
// // // // //           contentContainerStyle={styles.resultsList}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //           ListEmptyComponent={
// // // // //             <View style={styles.emptyContainer}>
// // // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // // //               <Text style={styles.emptyText}>No products found</Text>
// // // // //               <Text style={styles.emptySubText}>
// // // // //                 Try searching for something else
// // // // //               </Text>
// // // // //               {searchText.length > 0 && (
// // // // //                 <Text style={styles.emptySearchText}>
// // // // //                   "{searchText}"
// // // // //                 </Text>
// // // // //               )}
// // // // //             </View>
// // // // //           }
// // // // //           ListHeaderComponent={
// // // // //             searchResults.length > 0 ? (
// // // // //               <Text style={styles.resultsCount}>
// // // // //                 {searchResults.length} product{searchResults.length > 1 ? 's' : ''} found
// // // // //               </Text>
// // // // //             ) : null
// // // // //           }
// // // // //         />
// // // // //       ) : (
// // // // //         <FlatList
// // // // //           data={allProducts}
// // // // //           renderItem={renderPopularProduct}
// // // // //           keyExtractor={(item) => item.id}
// // // // //           contentContainerStyle={styles.content}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //           ListHeaderComponent={
// // // // //             <View>
// // // // //               <View style={styles.section}>
// // // // //                 <Text style={styles.sectionTitle}>Shop by Category</Text>
// // // // //                 <FlatList
// // // // //                   data={POPULAR_CATEGORIES}
// // // // //                   renderItem={renderCategory}
// // // // //                   keyExtractor={(item) => item.id.toString()}
// // // // //                   horizontal
// // // // //                   showsHorizontalScrollIndicator={false}
// // // // //                   contentContainerStyle={styles.categoriesList}
// // // // //                 />
// // // // //               </View>

// // // // //               {recentSearches.length > 0 && (
// // // // //                 <View style={styles.section}>
// // // // //                   <View style={styles.sectionHeader}>
// // // // //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// // // // //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// // // // //                       <Text style={styles.clearAllText}>Clear All</Text>
// // // // //                     </TouchableOpacity>
// // // // //                   </View>
// // // // //                   <FlatList
// // // // //                     data={recentSearches}
// // // // //                     renderItem={renderRecentSearch}
// // // // //                     keyExtractor={(item, index) => index.toString()}
// // // // //                     showsVerticalScrollIndicator={false}
// // // // //                   />
// // // // //                 </View>
// // // // //               )}

// // // // //               <View style={styles.section}>
// // // // //                 <Text style={styles.sectionTitle}>All Products ({allProducts.length})</Text>
// // // // //               </View>
// // // // //             </View>
// // // // //           }
// // // // //           ListFooterComponent={
// // // // //             <View style={styles.footer}>
// // // // //               <Text style={styles.footerText}>Available Products</Text>
// // // // //               <Text style={styles.footerSub}>{allProducts.length} products available</Text>
// // // // //             </View>
// // // // //           }
// // // // //         />
// // // // //       )}
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   centerContent: {
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     padding: 20,
// // // // //   },
// // // // //   loadingText: {
// // // // //     marginTop: 12,
// // // // //     fontSize: 16,
// // // // //     color: '#7e808c',
// // // // //   },
// // // // //   errorText: {
// // // // //     marginTop: 12,
// // // // //     fontSize: 16,
// // // // //     color: '#dc3545',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   retryButton: {
// // // // //     marginTop: 16,
// // // // //     backgroundColor: '#fc8019',
// // // // //     paddingHorizontal: 24,
// // // // //     paddingVertical: 10,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   retryButtonText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   backButton: {
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   searchContainer: {
// // // // //     flex: 1,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     borderRadius: 12,
// // // // //     paddingHorizontal: 12,
// // // // //     height: 44,
// // // // //   },
// // // // //   searchIcon: {
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   searchInput: {
// // // // //     flex: 1,
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //     padding: 0,
// // // // //   },
// // // // //   content: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingBottom: 20,
// // // // //   },
// // // // //   section: {
// // // // //     marginTop: 20,
// // // // //   },
// // // // //   sectionTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   sectionHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   clearAllText: {
// // // // //     fontSize: 13,
// // // // //     color: '#fc8019',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   categoriesList: {
// // // // //     paddingVertical: 4,
// // // // //   },
// // // // //   categoryChip: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 10,
// // // // //     borderRadius: 20,
// // // // //     marginRight: 10,
// // // // //   },
// // // // //   categoryEmoji: {
// // // // //     fontSize: 16,
// // // // //     marginRight: 4,
// // // // //   },
// // // // //   categoryChipText: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   recentItem: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   recentItemLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   recentItemText: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   resultsList: {
// // // // //     padding: 16,
// // // // //     paddingBottom: 20,
// // // // //   },
// // // // //   resultsCount: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   resultItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 16,
// // // // //     padding: 12,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#f0f0f5',
// // // // //   },
// // // // //   resultImageContainer: {
// // // // //     position: 'relative',
// // // // //   },
// // // // //   resultImage: {
// // // // //     width: 60,
// // // // //     height: 60,
// // // // //     borderRadius: 8,
// // // // //     backgroundColor: '#f0f0f5',
// // // // //   },
// // // // //   stockBadge: {
// // // // //     position: 'absolute',
// // // // //     bottom: 2,
// // // // //     right: 2,
// // // // //     paddingHorizontal: 4,
// // // // //     paddingVertical: 1,
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   stockBadgeText: {
// // // // //     fontSize: 8,
// // // // //     color: '#ffffff',
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   resultInfo: {
// // // // //     flex: 1,
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   resultName: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   resultCategory: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   resultMeta: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 4,
// // // // //     flexWrap: 'wrap',
// // // // //   },
// // // // //   resultPrice: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   resultBrand: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   popularItem: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   popularItemLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   popularItemImage: {
// // // // //     width: 50,
// // // // //     height: 50,
// // // // //     borderRadius: 8,
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   popularItemInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   popularItemName: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   popularItemCategory: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   popularItemMeta: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   popularItemPrice: {
// // // // //     fontSize: 13,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   popularItemStock: {
// // // // //     fontSize: 12,
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   emptyContainer: {
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingVertical: 60,
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
// // // // //   },
// // // // //   emptySearchText: {
// // // // //     fontSize: 16,
// // // // //     color: '#fc8019',
// // // // //     fontWeight: '500',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   footer: {
// // // // //     paddingVertical: 30,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   footerText: {
// // // // //     fontSize: 14,
// // // // //     color: '#93959f',
// // // // //   },
// // // // //   footerSub: {
// // // // //     fontSize: 12,
// // // // //     color: '#c0c0c0',
// // // // //     marginTop: 4,
// // // // //   },
// // // // // });

// // // // // export default SearchScreen;
// // // // import React, { useState, useEffect, useContext } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   FlatList,
// // // //   StyleSheet,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Image,
// // // //   Alert,
// // // //   ActivityIndicator,
// // // // } from 'react-native';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import axios from 'axios';
// // // // import { API_URL } from '@env';
// // // // import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';


// // // // interface Product {
// // // //   id: string;
// // // //   name: string;
// // // //   category: string;
// // // //   selling_price: number;
// // // //   stock_qty: number;
// // // //   description?: string;
// // // //   image?: string;
// // // //   barcode?: string;
// // // //   sku?: string;
// // // //   brand?: string;
// // // //   vendor?: string;
// // // //   gst_percent?: number;
// // // //   unit?: string;
// // // //   business_id?: string;
// // // // }

// // // // interface SearchScreenProps {
// // // //   navigation: any;
// // // //   route: any; 
// // // // }

// // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  
// // // //   const [searchText, setSearchText] = useState<string>('');
// // // //   const [searchResults, setSearchResults] = useState<Product[]>([]);
// // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // //   const [isSearching, setIsSearching] = useState<boolean>(false);
// // // //   const [allProducts, setAllProducts] = useState<Product[]>([]);
// // // //   const [loading, setLoading] = useState<boolean>(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const { selectedBusiness } = useContext(SelectedBusinessContext);
// // // //   const businessId = route?.params?.businessId ?? selectedBusiness?.id;
  

// // // //   useEffect(() => {
// // // //     loadProducts();
// // // //     loadRecentSearches();
// // // //   }, [businessId]);

// // // //   const loadProducts = async () => {
// // // //   try {
// // // //     setLoading(true);
// // // //     setError(null);
// // // //     const response = await axios.get(`${API_URL}/public/products`, {
// // // //       params: businessId ? { business_id: businessId } : {},
// // // //     });
// // // //     const products = Array.isArray(response.data) ? response.data : response.data.data || [];
// // // //     setAllProducts(products);
// // // //   } catch (err) {
// // // //     console.error('Failed to load products:', err);
// // // //     setError('Failed to load products. Please try again.');
// // // //   } finally {
// // // //     setLoading(false);
// // // //   }
// // // // };
// // // //   const loadRecentSearches = async () => {
// // // //     try {
// // // //       const saved = await AsyncStorage.getItem('recentSearches');
// // // //       if (saved) {
// // // //         setRecentSearches(JSON.parse(saved));
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Failed to load recent searches:', error);
// // // //     }
// // // //   };

// // // //   const saveRecentSearches = async (searches: string[]) => {
// // // //     try {
// // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // //     } catch (error) {
// // // //       console.error('Failed to save recent searches:', error);
// // // //     }
// // // //   };

// // // //   const handleSearch = (text: string) => {
// // // //     setSearchText(text);
// // // //     setIsSearching(text.length > 0);

// // // //     if (text.trim()) {
// // // //       const results = allProducts.filter(
// // // //         (item) =>
// // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // //           item.category.toLowerCase().includes(text.toLowerCase()) ||
// // // //           (item.brand && item.brand.toLowerCase().includes(text.toLowerCase()))
// // // //       );
// // // //       setSearchResults(results);
// // // //     } else {
// // // //       setSearchResults([]);
// // // //     }
// // // //   };

// // // //   const saveSearch = (term: string) => {
// // // //     if (!term.trim()) return;
// // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // //     if (updatedSearches.length > 10) {
// // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // //     }
// // // //     setRecentSearches(updatedSearches);
// // // //     saveRecentSearches(updatedSearches);
// // // //   };

// // // //   const handleSearchSubmit = () => {
// // // //     if (searchText.trim()) {
// // // //       saveSearch(searchText.trim());
// // // //       setIsSearching(true);
// // // //     }
// // // //   };

// // // //   const clearSearch = () => {
// // // //     setSearchText('');
// // // //     setSearchResults([]);
// // // //     setIsSearching(false);
// // // //   };

// // // //   const clearRecentSearch = async (term: string) => {
// // // //     const updated = recentSearches.filter(s => s !== term);
// // // //     setRecentSearches(updated);
// // // //     await saveRecentSearches(updated);
// // // //   };

// // // //   const clearAllRecentSearches = async () => {
// // // //     Alert.alert(
// // // //       'Clear Recent Searches',
// // // //       'Are you sure you want to clear all recent searches?',
// // // //       [
// // // //         { text: 'Cancel', style: 'cancel' },
// // // //         {
// // // //           text: 'Clear All',
// // // //           style: 'destructive',
// // // //           onPress: async () => {
// // // //             setRecentSearches([]);
// // // //             await saveRecentSearches([]);
// // // //           },
// // // //         },
// // // //       ]
// // // //     );
// // // //   };

// // // //   const handleRecentSearchClick = (term: string) => {
// // // //     setSearchText(term);
// // // //     saveSearch(term);
// // // //     const results = allProducts.filter(
// // // //       (item) =>
// // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // //         item.category.toLowerCase().includes(term.toLowerCase()) ||
// // // //         (item.brand && item.brand.toLowerCase().includes(term.toLowerCase()))
// // // //     );
// // // //     setSearchResults(results);
// // // //     setIsSearching(true);
// // // //   };

// // // //   const navigateToProduct = (product: Product) => {
// // // //     saveSearch(product.name);
    
// // // //     navigation.getParent()?.navigate('RestaurantDetail', { 
// // // //       restaurant: {
// // // //         id: product.id,
// // // //         name: product.name,
// // // //         rating: 4.5,
// // // //         deliveryTime: 'In Stock',
// // // //         cuisine: product.category,
// // // //         image: product.image || 'https://placehold.co/150x150',
// // // //         costForTwo: `₹${product.selling_price}`,
// // // //         address: product.description || 'Available in stock',
// // // //         isVeg: true,
// // // //         offer: `Stock: ${product.stock_qty} units`,
// // // //         productData: {
// // // //           id: product.id,
// // // //           price: product.selling_price,
// // // //           stock: product.stock_qty,
// // // //           category: product.category,
// // // //           description: product.description,
// // // //           brand: product.brand,
// // // //           vendor: product.vendor,
// // // //           gst: product.gst_percent,
// // // //           unit: product.unit,
// // // //           barcode: product.barcode,
// // // //           sku: product.sku,
// // // //           image: product.image,
// // // //           name: product.name,
// // // //         }
// // // //       }
// // // //     });
// // // //   };

// // // //   const renderSearchResult = ({ item }: { item: Product }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.resultItem}
// // // //       onPress={() => navigateToProduct(item)}
// // // //       activeOpacity={0.7}
// // // //     >
// // // //       <View style={styles.resultImageContainer}>
// // // //         <Image 
// // // //           source={{ uri: item.image || 'https://placehold.co/150x150' }}
// // // //           style={styles.resultImage} 
// // // //         />
// // // //         <View style={[styles.stockBadge, { backgroundColor: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
// // // //           <Text style={styles.stockBadgeText}>{item.stock_qty} left</Text>
// // // //         </View>
// // // //       </View>
// // // //       <View style={styles.resultInfo}>
// // // //         <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
// // // //         <Text style={styles.resultCategory}>{item.category}</Text>
// // // //         <View style={styles.resultMeta}>
// // // //           <Text style={styles.resultPrice}>₹{item.selling_price}</Text>
// // // //           {item.brand && (
// // // //             <Text style={styles.resultBrand}>• {item.brand}</Text>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // //     </TouchableOpacity>
// // // //   );

// // // //   const renderRecentSearch = ({ item }: { item: string }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.recentItem}
// // // //       onPress={() => handleRecentSearchClick(item)}
// // // //     >
// // // //       <View style={styles.recentItemLeft}>
// // // //         <Icon name="time-outline" size={20} color="#7e808c" />
// // // //         <Text style={styles.recentItemText}>{item}</Text>
// // // //       </View>
// // // //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// // // //         <Icon name="close-circle" size={20} color="#ccc" />
// // // //       </TouchableOpacity>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   const renderPopularProduct = ({ item }: { item: Product }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.popularItem}
// // // //       onPress={() => navigateToProduct(item)}
// // // //       activeOpacity={0.7}
// // // //     >
// // // //       <View style={styles.popularItemLeft}>
// // // //         <Image 
// // // //           source={{ uri: item.image || 'https://placehold.co/150x150' }}
// // // //           style={styles.popularItemImage} 
// // // //         />
// // // //         <View style={styles.popularItemInfo}>
// // // //           <Text style={styles.popularItemName} numberOfLines={1}>{item.name}</Text>
// // // //           <Text style={styles.popularItemCategory}>{item.category}</Text>
// // // //           <View style={styles.popularItemMeta}>
// // // //             <Text style={styles.popularItemPrice}>₹{item.selling_price}</Text>
// // // //             <Text style={[styles.popularItemStock, { color: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
// // // //               • Stock: {item.stock_qty}
// // // //             </Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // //     </TouchableOpacity>
// // // //   );

// // // //   if (loading) {
// // // //     return (
// // // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // // //         <ActivityIndicator size="large" color="#fc8019" />
// // // //         <Text style={styles.loadingText}>Loading products...</Text>
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // // //         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
// // // //         <Text style={styles.errorText}>{error}</Text>
// // // //         <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
// // // //           <Text style={styles.retryButtonText}>Retry</Text>
// // // //         </TouchableOpacity>
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // //       <View style={styles.header}>
// // // //         <TouchableOpacity 
// // // //           onPress={() => navigation.goBack()} 
// // // //           style={styles.backButton}
// // // //         >
// // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // //         </TouchableOpacity>
// // // //         <View style={styles.searchContainer}>
// // // //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// // // //           <TextInput
// // // //             style={styles.searchInput}
// // // //             placeholder="Search for products..."
// // // //             value={searchText}
// // // //             onChangeText={handleSearch}
// // // //             onSubmitEditing={handleSearchSubmit}
// // // //             autoFocus
// // // //             returnKeyType="search"
// // // //           />
// // // //           {searchText.length > 0 && (
// // // //             <TouchableOpacity onPress={clearSearch}>
// // // //               <Icon name="close-circle" size={20} color="#7e808c" />
// // // //             </TouchableOpacity>
// // // //           )}
// // // //         </View>
// // // //       </View>

// // // //       {isSearching ? (
// // // //         <FlatList
// // // //           data={searchResults}
// // // //           renderItem={renderSearchResult}
// // // //           keyExtractor={(item) => item.id}
// // // //           contentContainerStyle={styles.resultsList}
// // // //           showsVerticalScrollIndicator={false}
// // // //           ListEmptyComponent={
// // // //             <View style={styles.emptyContainer}>
// // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // //               <Text style={styles.emptyText}>No products found</Text>
// // // //               <Text style={styles.emptySubText}>
// // // //                 Try searching for something else
// // // //               </Text>
// // // //               {searchText.length > 0 && (
// // // //                 <Text style={styles.emptySearchText}>
// // // //                   "{searchText}"
// // // //                 </Text>
// // // //               )}
// // // //             </View>
// // // //           }
// // // //           ListHeaderComponent={
// // // //             searchResults.length > 0 ? (
// // // //               <Text style={styles.resultsCount}>
// // // //                 {searchResults.length} product{searchResults.length > 1 ? 's' : ''} found
// // // //               </Text>
// // // //             ) : null
// // // //           }
// // // //         />
// // // //       ) : (
// // // //         <FlatList
// // // //           data={allProducts}
// // // //           renderItem={renderPopularProduct}
// // // //           keyExtractor={(item) => item.id}
// // // //           contentContainerStyle={styles.content}
// // // //           showsVerticalScrollIndicator={false}
// // // //           ListHeaderComponent={
// // // //             <View>
// // // //               {recentSearches.length > 0 && (
// // // //                 <View style={styles.section}>
// // // //                   <View style={styles.sectionHeader}>
// // // //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// // // //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// // // //                       <Text style={styles.clearAllText}>Clear All</Text>
// // // //                     </TouchableOpacity>
// // // //                   </View>
// // // //                   <FlatList
// // // //                     data={recentSearches}
// // // //                     renderItem={renderRecentSearch}
// // // //                     keyExtractor={(item, index) => index.toString()}
// // // //                     showsVerticalScrollIndicator={false}
// // // //                   />
// // // //                 </View>
// // // //               )}

// // // //               <View style={styles.section}>
// // // //                 <Text style={styles.sectionTitle}>All Products ({allProducts.length})</Text>
// // // //               </View>
// // // //             </View>
// // // //           }
// // // //           ListFooterComponent={
// // // //             <View style={styles.footer}>
// // // //               <Text style={styles.footerText}>Available Products</Text>
// // // //               <Text style={styles.footerSub}>{allProducts.length} products available</Text>
// // // //             </View>
// // // //           }
// // // //         />
// // // //       )}
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   centerContent: {
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     padding: 20,
// // // //   },
// // // //   loadingText: {
// // // //     marginTop: 12,
// // // //     fontSize: 16,
// // // //     color: '#7e808c',
// // // //   },
// // // //   errorText: {
// // // //     marginTop: 12,
// // // //     fontSize: 16,
// // // //     color: '#dc3545',
// // // //     textAlign: 'center',
// // // //   },
// // // //   retryButton: {
// // // //     marginTop: 16,
// // // //     backgroundColor: '#fc8019',
// // // //     paddingHorizontal: 24,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 8,
// // // //   },
// // // //   retryButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   backButton: {
// // // //     marginRight: 12,
// // // //   },
// // // //   searchContainer: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#f0f0f5',
// // // //     borderRadius: 12,
// // // //     paddingHorizontal: 12,
// // // //     height: 44,
// // // //   },
// // // //   searchIcon: {
// // // //     marginRight: 8,
// // // //   },
// // // //   searchInput: {
// // // //     flex: 1,
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     padding: 0,
// // // //   },
// // // //   content: {
// // // //     paddingHorizontal: 16,
// // // //     paddingBottom: 20,
// // // //   },
// // // //   section: {
// // // //     marginTop: 20,
// // // //   },
// // // //   sectionTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //   },
// // // //   sectionHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 12,
// // // //   },
// // // //   clearAllText: {
// // // //     fontSize: 13,
// // // //     color: '#fc8019',
// // // //     fontWeight: '500',
// // // //   },
// // // //   recentItem: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 14,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   recentItemLeft: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   recentItemText: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     marginLeft: 12,
// // // //   },
// // // //   resultsList: {
// // // //     padding: 16,
// // // //     paddingBottom: 20,
// // // //   },
// // // //   resultsCount: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginBottom: 12,
// // // //   },
// // // //   resultItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //     padding: 12,
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#f0f0f5',
// // // //   },
// // // //   resultImageContainer: {
// // // //     position: 'relative',
// // // //   },
// // // //   resultImage: {
// // // //     width: 60,
// // // //     height: 60,
// // // //     borderRadius: 8,
// // // //     backgroundColor: '#f0f0f5',
// // // //   },
// // // //   stockBadge: {
// // // //     position: 'absolute',
// // // //     bottom: 2,
// // // //     right: 2,
// // // //     paddingHorizontal: 4,
// // // //     paddingVertical: 1,
// // // //     borderRadius: 4,
// // // //   },
// // // //   stockBadgeText: {
// // // //     fontSize: 8,
// // // //     color: '#ffffff',
// // // //     fontWeight: '600',
// // // //   },
// // // //   resultInfo: {
// // // //     flex: 1,
// // // //     marginLeft: 12,
// // // //   },
// // // //   resultName: {
// // // //     fontSize: 15,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   resultCategory: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   resultMeta: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 4,
// // // //     flexWrap: 'wrap',
// // // //   },
// // // //   resultPrice: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   resultBrand: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginLeft: 4,
// // // //   },
// // // //   popularItem: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   popularItemLeft: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },
// // // //   popularItemImage: {
// // // //     width: 50,
// // // //     height: 50,
// // // //     borderRadius: 8,
// // // //     backgroundColor: '#f0f0f5',
// // // //     marginRight: 12,
// // // //   },
// // // //   popularItemInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   popularItemName: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //   },
// // // //   popularItemCategory: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   popularItemMeta: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 4,
// // // //   },
// // // //   popularItemPrice: {
// // // //     fontSize: 13,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   popularItemStock: {
// // // //     fontSize: 12,
// // // //     marginLeft: 8,
// // // //   },
// // // //   emptyContainer: {
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingVertical: 60,
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
// // // //   },
// // // //   emptySearchText: {
// // // //     fontSize: 16,
// // // //     color: '#fc8019',
// // // //     fontWeight: '500',
// // // //     marginTop: 8,
// // // //   },
// // // //   footer: {
// // // //     paddingVertical: 30,
// // // //     alignItems: 'center',
// // // //   },
// // // //   footerText: {
// // // //     fontSize: 14,
// // // //     color: '#93959f',
// // // //   },
// // // //   footerSub: {
// // // //     fontSize: 12,
// // // //     color: '#c0c0c0',
// // // //     marginTop: 4,
// // // //   },
// // // // });

// // // // export default SearchScreen;
// // // import React, { useState, useEffect, useContext } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Image,
// // //   Alert,
// // //   ActivityIndicator,
// // // } from 'react-native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import axios from 'axios';
// // // import { API_URL } from '@env';
// // // import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';

// // // interface Product {
// // //   id: string;
// // //   name: string;
// // //   category: string;
// // //   selling_price: number;
// // //   stock_qty: number;
// // //   description?: string;
// // //   image?: string;
// // //   barcode?: string;
// // //   sku?: string;
// // //   brand?: string;
// // //   vendor?: string;
// // //   gst_percent?: number;
// // //   unit?: string;
// // //   business_id?: string;
// // // }

// // // interface SearchScreenProps {
// // //   navigation: any;
// // //   route: any;
// // // }

// // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
// // //   const [searchText, setSearchText] = useState<string>('');
// // //   const [searchResults, setSearchResults] = useState<Product[]>([]);
// // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // //   const [isSearching, setIsSearching] = useState<boolean>(false);
// // //   const [allProducts, setAllProducts] = useState<Product[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const { selectedBusiness } = useContext(SelectedBusinessContext);
// // //   const businessId = route?.params?.businessId ?? selectedBusiness?.id;

// // //   useEffect(() => {
// // //     loadProducts();
// // //     loadRecentSearches();
// // //   }, [businessId]);

// // //   const loadProducts = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);
      
// // //       console.log('Loading products for business:', businessId);
      
// // //       const response = await axios.get(`${API_URL}/public/products`, {
// // //         params: businessId ? { business_id: businessId } : {},
// // //       });
      
// // //       console.log('API Response status:', response.status);
// // //       console.log('API Response data type:', typeof response.data);
      
// // //       // Handle different response structures
// // //       let products: Product[] = [];
      
// // //       if (Array.isArray(response.data)) {
// // //         products = response.data;
// // //       } else if (response.data && typeof response.data === 'object') {
// // //         // Check for common response structures
// // //         if (response.data.data && Array.isArray(response.data.data)) {
// // //           products = response.data.data;
// // //         } else if (response.data.products && Array.isArray(response.data.products)) {
// // //           products = response.data.products;
// // //         } else if (response.data.items && Array.isArray(response.data.items)) {
// // //           products = response.data.items;
// // //         } else if (response.data.results && Array.isArray(response.data.results)) {
// // //           products = response.data.results;
// // //         } else {
// // //           // Try to extract any array from the response
// // //           const values = Object.values(response.data);
// // //           const arrayValue = values.find(val => Array.isArray(val));
// // //           if (arrayValue) {
// // //             products = arrayValue as Product[];
// // //           }
// // //         }
// // //       }
      
// // //       console.log('Products loaded:', products.length);
// // //       if (products.length > 0) {
// // //         console.log('Sample product:', products[0]);
// // //       }
      
// // //       setAllProducts(products);
// // //     } catch (err) {
// // //       console.error('Failed to load products:', err);
// // //       setError('Failed to load products. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const loadRecentSearches = async () => {
// // //     try {
// // //       const saved = await AsyncStorage.getItem('recentSearches');
// // //       if (saved) {
// // //         setRecentSearches(JSON.parse(saved));
// // //       }
// // //     } catch (error) {
// // //       console.error('Failed to load recent searches:', error);
// // //     }
// // //   };

// // //   const saveRecentSearches = async (searches: string[]) => {
// // //     try {
// // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // //     } catch (error) {
// // //       console.error('Failed to save recent searches:', error);
// // //     }
// // //   };

// // //   const handleSearch = (text: string) => {
// // //     setSearchText(text);
    
// // //     if (text.trim()) {
// // //       const searchLower = text.toLowerCase().trim();
      
// // //       // Debug logging
// // //       console.log(`🔍 Searching for: "${searchLower}" among ${allProducts.length} products`);
      
// // //       const results = allProducts.filter((item) => {
// // //         if (!item) return false;
        
// // //         // Create an array of all searchable fields
// // //         const searchableFields = [
// // //           item.name,
// // //           item.category,
// // //           item.brand,
// // //           item.description,
// // //           item.sku,
// // //           item.barcode,
// // //           item.vendor,
// // //           item.unit
// // //         ].filter(field => field && typeof field === 'string');
        
// // //         // Check if any field contains the search term
// // //         const isMatch = searchableFields.some(field => 
// // //           field.toLowerCase().includes(searchLower)
// // //         );
        
// // //         if (isMatch) {
// // //           console.log(`✅ Match found: ${item.name} (${item.category})`);
// // //         }
        
// // //         return isMatch;
// // //       });
      
// // //       console.log(`📊 Found ${results.length} results for "${searchText}"`);
      
// // //       setSearchResults(results);
// // //       setIsSearching(results.length > 0 || text.length > 0);
// // //     } else {
// // //       setSearchResults([]);
// // //       setIsSearching(false);
// // //     }
// // //   };

// // //   const saveSearch = (term: string) => {
// // //     if (!term.trim()) return;
// // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // //     if (updatedSearches.length > 10) {
// // //       updatedSearches = updatedSearches.slice(0, 10);
// // //     }
// // //     setRecentSearches(updatedSearches);
// // //     saveRecentSearches(updatedSearches);
// // //   };

// // //   const handleSearchSubmit = () => {
// // //     if (searchText.trim()) {
// // //       saveSearch(searchText.trim());
// // //       // Trigger search with current text
// // //       handleSearch(searchText);
// // //     }
// // //   };

// // //   const clearSearch = () => {
// // //     setSearchText('');
// // //     setSearchResults([]);
// // //     setIsSearching(false);
// // //   };

// // //   const clearRecentSearch = async (term: string) => {
// // //     const updated = recentSearches.filter(s => s !== term);
// // //     setRecentSearches(updated);
// // //     await saveRecentSearches(updated);
// // //   };

// // //   const clearAllRecentSearches = async () => {
// // //     Alert.alert(
// // //       'Clear Recent Searches',
// // //       'Are you sure you want to clear all recent searches?',
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         {
// // //           text: 'Clear All',
// // //           style: 'destructive',
// // //           onPress: async () => {
// // //             setRecentSearches([]);
// // //             await saveRecentSearches([]);
// // //           },
// // //         },
// // //       ]
// // //     );
// // //   };

// // //   const handleRecentSearchClick = (term: string) => {
// // //     setSearchText(term);
// // //     saveSearch(term);
// // //     // Trigger search with the term
// // //     handleSearch(term);
// // //   };

// // //   const navigateToProduct = (product: Product) => {
// // //     saveSearch(product.name);
    
// // //     navigation.getParent()?.navigate('RestaurantDetail', {
// // //       restaurant: {
// // //         id: product.id,
// // //         name: product.name,
// // //         rating: 4.5,
// // //         deliveryTime: 'In Stock',
// // //         cuisine: product.category,
// // //         image: product.image || 'https://placehold.co/150x150',
// // //         costForTwo: `₹${product.selling_price}`,
// // //         address: product.description || 'Available in stock',
// // //         isVeg: true,
// // //         offer: `Stock: ${product.stock_qty} units`,
// // //         productData: {
// // //           id: product.id,
// // //           price: product.selling_price,
// // //           stock: product.stock_qty,
// // //           category: product.category,
// // //           description: product.description,
// // //           brand: product.brand,
// // //           vendor: product.vendor,
// // //           gst: product.gst_percent,
// // //           unit: product.unit,
// // //           barcode: product.barcode,
// // //           sku: product.sku,
// // //           image: product.image,
// // //           name: product.name,
// // //         }
// // //       }
// // //     });
// // //   };

// // //   const renderSearchResult = ({ item }: { item: Product }) => (
// // //     <TouchableOpacity
// // //       style={styles.resultItem}
// // //       onPress={() => navigateToProduct(item)}
// // //       activeOpacity={0.7}
// // //     >
// // //       <View style={styles.resultImageContainer}>
// // //         <Image 
// // //           source={{ uri: item.image || 'https://placehold.co/150x150' }}
// // //           style={styles.resultImage}
// // //           onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
// // //         />
// // //         <View style={[styles.stockBadge, { backgroundColor: (item.stock_qty || 0) > 5 ? '#28a745' : '#dc3545' }]}>
// // //           <Text style={styles.stockBadgeText}>{item.stock_qty || 0} left</Text>
// // //         </View>
// // //       </View>
// // //       <View style={styles.resultInfo}>
// // //         <Text style={styles.resultName} numberOfLines={1}>{item.name || 'Unnamed Product'}</Text>
// // //         <Text style={styles.resultCategory}>{item.category || 'Uncategorized'}</Text>
// // //         <View style={styles.resultMeta}>
// // //           <Text style={styles.resultPrice}>₹{item.selling_price || 0}</Text>
// // //           {item.brand && (
// // //             <Text style={styles.resultBrand}>• {item.brand}</Text>
// // //           )}
// // //         </View>
// // //       </View>
// // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // //     </TouchableOpacity>
// // //   );

// // //   const renderRecentSearch = ({ item }: { item: string }) => (
// // //     <TouchableOpacity
// // //       style={styles.recentItem}
// // //       onPress={() => handleRecentSearchClick(item)}
// // //     >
// // //       <View style={styles.recentItemLeft}>
// // //         <Icon name="time-outline" size={20} color="#7e808c" />
// // //         <Text style={styles.recentItemText}>{item}</Text>
// // //       </View>
// // //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// // //         <Icon name="close-circle" size={20} color="#ccc" />
// // //       </TouchableOpacity>
// // //     </TouchableOpacity>
// // //   );

// // //   const renderPopularProduct = ({ item }: { item: Product }) => (
// // //     <TouchableOpacity
// // //       style={styles.popularItem}
// // //       onPress={() => navigateToProduct(item)}
// // //       activeOpacity={0.7}
// // //     >
// // //       <View style={styles.popularItemLeft}>
// // //         <Image 
// // //           source={{ uri: item.image || 'https://placehold.co/150x150' }}
// // //           style={styles.popularItemImage}
// // //           onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
// // //         />
// // //         <View style={styles.popularItemInfo}>
// // //           <Text style={styles.popularItemName} numberOfLines={1}>{item.name || 'Unnamed Product'}</Text>
// // //           <Text style={styles.popularItemCategory}>{item.category || 'Uncategorized'}</Text>
// // //           <View style={styles.popularItemMeta}>
// // //             <Text style={styles.popularItemPrice}>₹{item.selling_price || 0}</Text>
// // //             <Text style={[styles.popularItemStock, { color: (item.stock_qty || 0) > 5 ? '#28a745' : '#dc3545' }]}>
// // //               • Stock: {item.stock_qty || 0}
// // //             </Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // //     </TouchableOpacity>
// // //   );

// // //   // Debug component (visible only in development)
// // //   const DebugInfo = () => {
// // //     if (!__DEV__) return null;
// // //     return (
// // //       <View style={styles.debugContainer}>
// // //         <Text style={styles.debugText}>📦 Products: {allProducts.length}</Text>
// // //         <Text style={styles.debugText}>🔍 Results: {searchResults.length}</Text>
// // //         <Text style={styles.debugText}>📝 Search: "{searchText}"</Text>
// // //         <Text style={styles.debugText}>🏪 Business: {businessId || 'None'}</Text>
// // //         {allProducts.length > 0 && (
// // //           <Text style={styles.debugText}>📋 First: {allProducts[0]?.name}</Text>
// // //         )}
// // //       </View>
// // //     );
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // //         <ActivityIndicator size="large" color="#fc8019" />
// // //         <Text style={styles.loadingText}>Loading products...</Text>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // //         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
// // //         <Text style={styles.errorText}>{error}</Text>
// // //         <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
// // //           <Text style={styles.retryButtonText}>Retry</Text>
// // //         </TouchableOpacity>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // //       <View style={styles.header}>
// // //         <TouchableOpacity 
// // //           onPress={() => navigation.goBack()} 
// // //           style={styles.backButton}
// // //         >
// // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // //         </TouchableOpacity>
// // //         <View style={styles.searchContainer}>
// // //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// // //           <TextInput
// // //             style={styles.searchInput}
// // //             placeholder="Search for products..."
// // //             placeholderTextColor="#7e808c"
// // //             value={searchText}
// // //             onChangeText={handleSearch}
// // //             onSubmitEditing={handleSearchSubmit}
// // //             autoFocus
// // //             returnKeyType="search"
// // //           />
// // //           {searchText.length > 0 && (
// // //             <TouchableOpacity onPress={clearSearch}>
// // //               <Icon name="close-circle" size={20} color="#7e808c" />
// // //             </TouchableOpacity>
// // //           )}
// // //         </View>
// // //       </View>

// // //       {/* Debug Info - Remove in production */}
// // //       <DebugInfo />

// // //       {isSearching ? (
// // //         <FlatList
// // //           data={searchResults}
// // //           renderItem={renderSearchResult}
// // //           keyExtractor={(item) => item.id || Math.random().toString()}
// // //           contentContainerStyle={styles.resultsList}
// // //           showsVerticalScrollIndicator={false}
// // //           ListEmptyComponent={
// // //             <View style={styles.emptyContainer}>
// // //               <Icon name="search-outline" size={60} color="#ccc" />
// // //               <Text style={styles.emptyText}>No products found</Text>
// // //               <Text style={styles.emptySubText}>
// // //                 Try searching for something else
// // //               </Text>
// // //               {searchText.length > 0 && (
// // //                 <Text style={styles.emptySearchText}>
// // //                   "{searchText}"
// // //                 </Text>
// // //               )}
// // //               <TouchableOpacity 
// // //                 style={styles.viewAllButton}
// // //                 onPress={() => {
// // //                   setSearchText('');
// // //                   setSearchResults([]);
// // //                   setIsSearching(false);
// // //                 }}
// // //               >
// // //                 <Text style={styles.viewAllButtonText}>View All Products</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           }
// // //           ListHeaderComponent={
// // //             searchResults.length > 0 ? (
// // //               <Text style={styles.resultsCount}>
// // //                 {searchResults.length} product{searchResults.length > 1 ? 's' : ''} found
// // //               </Text>
// // //             ) : null
// // //           }
// // //         />
// // //       ) : (
// // //         <FlatList
// // //           data={allProducts}
// // //           renderItem={renderPopularProduct}
// // //           keyExtractor={(item) => item.id || Math.random().toString()}
// // //           contentContainerStyle={styles.content}
// // //           showsVerticalScrollIndicator={false}
// // //           ListHeaderComponent={
// // //             <View>
// // //               {recentSearches.length > 0 && (
// // //                 <View style={styles.section}>
// // //                   <View style={styles.sectionHeader}>
// // //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// // //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// // //                       <Text style={styles.clearAllText}>Clear All</Text>
// // //                     </TouchableOpacity>
// // //                   </View>
// // //                   <FlatList
// // //                     data={recentSearches}
// // //                     renderItem={renderRecentSearch}
// // //                     keyExtractor={(item, index) => index.toString()}
// // //                     showsVerticalScrollIndicator={false}
// // //                   />
// // //                 </View>
// // //               )}

// // //               <View style={styles.section}>
// // //                 <Text style={styles.sectionTitle}>All Products ({allProducts.length})</Text>
// // //               </View>
// // //             </View>
// // //           }
// // //           ListFooterComponent={
// // //             <View style={styles.footer}>
// // //               <Text style={styles.footerText}>Available Products</Text>
// // //               <Text style={styles.footerSub}>{allProducts.length} products available</Text>
// // //             </View>
// // //           }
// // //         />
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   centerContent: {
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 20,
// // //   },
// // //   loadingText: {
// // //     marginTop: 12,
// // //     fontSize: 16,
// // //     color: '#7e808c',
// // //   },
// // //   errorText: {
// // //     marginTop: 12,
// // //     fontSize: 16,
// // //     color: '#dc3545',
// // //     textAlign: 'center',
// // //   },
// // //   retryButton: {
// // //     marginTop: 16,
// // //     backgroundColor: '#fc8019',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //   },
// // //   retryButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   backButton: {
// // //     marginRight: 12,
// // //   },
// // //   searchContainer: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#f0f0f5',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 12,
// // //     height: 44,
// // //   },
// // //   searchIcon: {
// // //     marginRight: 8,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     padding: 0,
// // //   },
// // //   content: {
// // //     paddingHorizontal: 16,
// // //     paddingBottom: 20,
// // //   },
// // //   section: {
// // //     marginTop: 20,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   clearAllText: {
// // //     fontSize: 13,
// // //     color: '#fc8019',
// // //     fontWeight: '500',
// // //   },
// // //   recentItem: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 14,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   recentItemLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   recentItemText: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     marginLeft: 12,
// // //   },
// // //   resultsList: {
// // //     padding: 16,
// // //     paddingBottom: 20,
// // //   },
// // //   resultsCount: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginBottom: 12,
// // //   },
// // //   resultItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     padding: 12,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#f0f0f5',
// // //   },
// // //   resultImageContainer: {
// // //     position: 'relative',
// // //   },
// // //   resultImage: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 8,
// // //     backgroundColor: '#f0f0f5',
// // //   },
// // //   stockBadge: {
// // //     position: 'absolute',
// // //     bottom: 2,
// // //     right: 2,
// // //     paddingHorizontal: 4,
// // //     paddingVertical: 1,
// // //     borderRadius: 4,
// // //   },
// // //   stockBadgeText: {
// // //     fontSize: 8,
// // //     color: '#ffffff',
// // //     fontWeight: '600',
// // //   },
// // //   resultInfo: {
// // //     flex: 1,
// // //     marginLeft: 12,
// // //   },
// // //   resultName: {
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   resultCategory: {
// // //     fontSize: 13,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   resultMeta: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 4,
// // //     flexWrap: 'wrap',
// // //   },
// // //   resultPrice: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   resultBrand: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginLeft: 4,
// // //   },
// // //   popularItem: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   popularItemLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   popularItemImage: {
// // //     width: 50,
// // //     height: 50,
// // //     borderRadius: 8,
// // //     backgroundColor: '#f0f0f5',
// // //     marginRight: 12,
// // //   },
// // //   popularItemInfo: {
// // //     flex: 1,
// // //   },
// // //   popularItemName: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //   },
// // //   popularItemCategory: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   popularItemMeta: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 4,
// // //   },
// // //   popularItemPrice: {
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   popularItemStock: {
// // //     fontSize: 12,
// // //     marginLeft: 8,
// // //   },
// // //   emptyContainer: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 60,
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
// // //   },
// // //   emptySearchText: {
// // //     fontSize: 16,
// // //     color: '#fc8019',
// // //     fontWeight: '500',
// // //     marginTop: 8,
// // //   },
// // //   viewAllButton: {
// // //     marginTop: 20,
// // //     backgroundColor: '#fc8019',
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //   },
// // //   viewAllButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   footer: {
// // //     paddingVertical: 30,
// // //     alignItems: 'center',
// // //   },
// // //   footerText: {
// // //     fontSize: 14,
// // //     color: '#93959f',
// // //   },
// // //   footerSub: {
// // //     fontSize: 12,
// // //     color: '#c0c0c0',
// // //     marginTop: 4,
// // //   },
// // //   debugContainer: {
// // //     backgroundColor: '#f8f9fa',
// // //     padding: 8,
// // //     marginHorizontal: 16,
// // //     marginTop: 8,
// // //     borderRadius: 8,
// // //     borderWidth: 1,
// // //     borderColor: '#dee2e6',
// // //   },
// // //   debugText: {
// // //     fontSize: 12,
// // //     color: '#495057',
// // //     fontFamily: 'monospace',
// // //   },
// // // });

// // // export default SearchScreen;
// // import React, { useState, useEffect, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   SafeAreaView,
// //   StatusBar,
// //   Image,
// //   Alert,
// //   ActivityIndicator,
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import axios from 'axios';
// // import { API_URL } from '@env';
// // import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';

// // interface Product {
// //   id: string;
// //   name: string;
// //   category: string;
// //   selling_price: number;
// //   stock_qty: number;
// //   description?: string;
// //   image?: string;
// //   barcode?: string;
// //   sku?: string;
// //   brand?: string;
// //   vendor?: string;
// //   gst_percent?: number;
// //   unit?: string;
// //   business_id?: string;
// // }

// // interface SearchScreenProps {
// //   navigation: any;
// //   route: any;
// // }

// // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
// //   const [searchText, setSearchText] = useState<string>('');
// //   const [searchResults, setSearchResults] = useState<Product[]>([]);
// //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// //   const [isSearching, setIsSearching] = useState<boolean>(false);
// //   const [allProducts, setAllProducts] = useState<Product[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const { selectedBusiness } = useContext(SelectedBusinessContext);
// //   const businessId = route?.params?.businessId ?? selectedBusiness?.id;

// //   useEffect(() => {
// //     loadProducts();
// //     loadRecentSearches();
// //   }, [businessId]);

// //   const loadProducts = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
      
// //       const response = await axios.get(`${API_URL}/public/products`, {
// //         params: businessId ? { business_id: businessId } : {},
// //       });
      
// //       // Handle different response structures
// //       let products: Product[] = [];
      
// //       if (Array.isArray(response.data)) {
// //         products = response.data;
// //       } else if (response.data && typeof response.data === 'object') {
// //         if (response.data.data && Array.isArray(response.data.data)) {
// //           products = response.data.data;
// //         } else if (response.data.products && Array.isArray(response.data.products)) {
// //           products = response.data.products;
// //         } else if (response.data.items && Array.isArray(response.data.items)) {
// //           products = response.data.items;
// //         } else if (response.data.results && Array.isArray(response.data.results)) {
// //           products = response.data.results;
// //         } else {
// //           const values = Object.values(response.data);
// //           const arrayValue = values.find(val => Array.isArray(val));
// //           if (arrayValue) {
// //             products = arrayValue as Product[];
// //           }
// //         }
// //       }
      
// //       setAllProducts(products);
// //     } catch (err) {
// //       console.error('Failed to load products:', err);
// //       setError('Failed to load products. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadRecentSearches = async () => {
// //     try {
// //       const saved = await AsyncStorage.getItem('recentSearches');
// //       if (saved) {
// //         setRecentSearches(JSON.parse(saved));
// //       }
// //     } catch (error) {
// //       console.error('Failed to load recent searches:', error);
// //     }
// //   };

// //   const saveRecentSearches = async (searches: string[]) => {
// //     try {
// //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// //     } catch (error) {
// //       console.error('Failed to save recent searches:', error);
// //     }
// //   };

// //   const handleSearch = (text: string) => {
// //     setSearchText(text);
    
// //     // Show search results even for single character
// //     if (text.trim()) {
// //       const searchLower = text.toLowerCase().trim();
      
// //       const results = allProducts.filter((item) => {
// //         if (!item) return false;
        
// //         // Search in all relevant fields
// //         const searchableFields = [
// //           item.name,
// //           item.category,
// //           item.brand,
// //           item.description,
// //           item.sku,
// //           item.barcode,
// //           item.vendor,
// //           item.unit
// //         ].filter(field => field && typeof field === 'string');
        
// //         // Check if any field contains the search term (including single character)
// //         return searchableFields.some(field => 
// //           field.toLowerCase().includes(searchLower)
// //         );
// //       });
      
// //       setSearchResults(results);
// //       setIsSearching(true);
// //     } else {
// //       setSearchResults([]);
// //       setIsSearching(false);
// //     }
// //   };

// //   const saveSearch = (term: string) => {
// //     if (!term.trim()) return;
// //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// //     if (updatedSearches.length > 10) {
// //       updatedSearches = updatedSearches.slice(0, 10);
// //     }
// //     setRecentSearches(updatedSearches);
// //     saveRecentSearches(updatedSearches);
// //   };

// //   const handleSearchSubmit = () => {
// //     if (searchText.trim()) {
// //       saveSearch(searchText.trim());
// //     }
// //   };

// //   const clearSearch = () => {
// //     setSearchText('');
// //     setSearchResults([]);
// //     setIsSearching(false);
// //   };

// //   const clearRecentSearch = async (term: string) => {
// //     const updated = recentSearches.filter(s => s !== term);
// //     setRecentSearches(updated);
// //     await saveRecentSearches(updated);
// //   };

// //   const clearAllRecentSearches = async () => {
// //     Alert.alert(
// //       'Clear Recent Searches',
// //       'Are you sure you want to clear all recent searches?',
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Clear All',
// //           style: 'destructive',
// //           onPress: async () => {
// //             setRecentSearches([]);
// //             await saveRecentSearches([]);
// //           },
// //         },
// //       ]
// //     );
// //   };

// //   const handleRecentSearchClick = (term: string) => {
// //     setSearchText(term);
// //     saveSearch(term);
// //     handleSearch(term);
// //   };

// //   const navigateToProduct = (product: Product) => {
// //     saveSearch(product.name);
    
// //     navigation.getParent()?.navigate('RestaurantDetail', {
// //       restaurant: {
// //         id: product.id,
// //         name: product.name,
// //         rating: 4.5,
// //         deliveryTime: 'In Stock',
// //         cuisine: product.category,
// //         image: product.image || 'https://placehold.co/150x150',
// //         costForTwo: `₹${product.selling_price}`,
// //         address: product.description || 'Available in stock',
// //         isVeg: true,
// //         offer: `Stock: ${product.stock_qty} units`,
// //         productData: {
// //           id: product.id,
// //           price: product.selling_price,
// //           stock: product.stock_qty,
// //           category: product.category,
// //           description: product.description,
// //           brand: product.brand,
// //           vendor: product.vendor,
// //           gst: product.gst_percent,
// //           unit: product.unit,
// //           barcode: product.barcode,
// //           sku: product.sku,
// //           image: product.image,
// //           name: product.name,
// //         }
// //       }
// //     });
// //   };

// //   // Simplified search result item without card styling
// //   const renderSearchResult = ({ item }: { item: Product }) => (
// //     <TouchableOpacity
// //       style={styles.searchResultItem}
// //       onPress={() => navigateToProduct(item)}
// //       activeOpacity={0.7}
// //     >
// //       <Image 
// //         source={{ uri: item.image || 'https://placehold.co/150x150' }}
// //         style={styles.searchResultImage}
// //       />
// //       <View style={styles.searchResultInfo}>
// //         <Text style={styles.searchResultName} numberOfLines={1}>
// //           {item.name || 'Unnamed Product'}
// //         </Text>
// //         <Text style={styles.searchResultCategory}>
// //           {item.category || 'Uncategorized'}
// //         </Text>
// //         <View style={styles.searchResultMeta}>
// //           <Text style={styles.searchResultPrice}>₹{item.selling_price || 0}</Text>
// //           <Text style={[styles.searchResultStock, { 
// //             color: (item.stock_qty || 0) > 5 ? '#28a745' : '#dc3545' 
// //           }]}>
// //             • {item.stock_qty || 0} in stock
// //           </Text>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   const renderRecentSearch = ({ item }: { item: string }) => (
// //     <TouchableOpacity
// //       style={styles.recentItem}
// //       onPress={() => handleRecentSearchClick(item)}
// //     >
// //       <View style={styles.recentItemLeft}>
// //         <Icon name="time-outline" size={20} color="#7e808c" />
// //         <Text style={styles.recentItemText}>{item}</Text>
// //       </View>
// //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// //         <Icon name="close-circle" size={20} color="#ccc" />
// //       </TouchableOpacity>
// //     </TouchableOpacity>
// //   );

// //   const renderPopularProduct = ({ item }: { item: Product }) => (
// //     <TouchableOpacity
// //       style={styles.popularItem}
// //       onPress={() => navigateToProduct(item)}
// //       activeOpacity={0.7}
// //     >
// //       <Image 
// //         source={{ uri: item.image || 'https://placehold.co/150x150' }}
// //         style={styles.popularItemImage}
// //       />
// //       <View style={styles.popularItemInfo}>
// //         <Text style={styles.popularItemName} numberOfLines={1}>
// //           {item.name || 'Unnamed Product'}
// //         </Text>
// //         <Text style={styles.popularItemCategory}>
// //           {item.category || 'Uncategorized'}
// //         </Text>
// //         <View style={styles.popularItemMeta}>
// //           <Text style={styles.popularItemPrice}>₹{item.selling_price || 0}</Text>
// //           <Text style={[styles.popularItemStock, { 
// //             color: (item.stock_qty || 0) > 5 ? '#28a745' : '#dc3545' 
// //           }]}>
// //             • Stock: {item.stock_qty || 0}
// //           </Text>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// //         <ActivityIndicator size="large" color="#fc8019" />
// //         <Text style={styles.loadingText}>Loading products...</Text>
// //       </SafeAreaView>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// //         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
// //         <Text style={styles.errorText}>{error}</Text>
// //         <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
// //           <Text style={styles.retryButtonText}>Retry</Text>
// //         </TouchableOpacity>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// //       <View style={styles.header}>
// //         <TouchableOpacity 
// //           onPress={() => navigation.goBack()} 
// //           style={styles.backButton}
// //         >
// //           <Icon name="arrow-back" size={24} color="#282c3f" />
// //         </TouchableOpacity>
// //         <View style={styles.searchContainer}>
// //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// //           <TextInput
// //             style={styles.searchInput}
// //             placeholder="Search for products..."
// //             placeholderTextColor="#7e808c"
// //             value={searchText}
// //             onChangeText={handleSearch}
// //             onSubmitEditing={handleSearchSubmit}
// //             autoFocus
// //             returnKeyType="search"
// //           />
// //           {searchText.length > 0 && (
// //             <TouchableOpacity onPress={clearSearch}>
// //               <Icon name="close-circle" size={20} color="#7e808c" />
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       </View>

// //       {isSearching ? (
// //         <FlatList
// //           data={searchResults}
// //           renderItem={renderSearchResult}
// //           keyExtractor={(item) => item.id || Math.random().toString()}
// //           contentContainerStyle={styles.resultsList}
// //           showsVerticalScrollIndicator={false}
// //           ListEmptyComponent={
// //             <View style={styles.emptyContainer}>
// //               <Icon name="search-outline" size={60} color="#ccc" />
// //               <Text style={styles.emptyText}>No products found</Text>
// //               <Text style={styles.emptySubText}>
// //                 Try searching for something else
// //               </Text>
// //               {searchText.length > 0 && (
// //                 <Text style={styles.emptySearchText}>
// //                   "{searchText}"
// //                 </Text>
// //               )}
// //             </View>
// //           }
// //           ListHeaderComponent={
// //             searchResults.length > 0 ? (
// //               <Text style={styles.resultsCount}>
// //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// //               </Text>
// //             ) : null
// //           }
// //         />
// //       ) : (
// //         <FlatList
// //           data={allProducts}
// //           renderItem={renderPopularProduct}
// //           keyExtractor={(item) => item.id || Math.random().toString()}
// //           contentContainerStyle={styles.content}
// //           showsVerticalScrollIndicator={false}
// //           ListHeaderComponent={
// //             <View>
// //               {recentSearches.length > 0 && (
// //                 <View style={styles.section}>
// //                   <View style={styles.sectionHeader}>
// //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// //                       <Text style={styles.clearAllText}>Clear All</Text>
// //                     </TouchableOpacity>
// //                   </View>
// //                   <FlatList
// //                     data={recentSearches}
// //                     renderItem={renderRecentSearch}
// //                     keyExtractor={(item, index) => index.toString()}
// //                     showsVerticalScrollIndicator={false}
// //                   />
// //                 </View>
// //               )}

// //               <View style={styles.section}>
// //                 <Text style={styles.sectionTitle}>All Products ({allProducts.length})</Text>
// //               </View>
// //             </View>
// //           }
// //           ListFooterComponent={
// //             <View style={styles.footer}>
// //               <Text style={styles.footerText}>Available Products</Text>
// //               <Text style={styles.footerSub}>{allProducts.length} products available</Text>
// //             </View>
// //           }
// //         />
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   centerContent: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   loadingText: {
// //     marginTop: 12,
// //     fontSize: 16,
// //     color: '#7e808c',
// //   },
// //   errorText: {
// //     marginTop: 12,
// //     fontSize: 16,
// //     color: '#dc3545',
// //     textAlign: 'center',
// //   },
// //   retryButton: {
// //     marginTop: 16,
// //     backgroundColor: '#fc8019',
// //     paddingHorizontal: 24,
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //   },
// //   retryButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   backButton: {
// //     marginRight: 12,
// //   },
// //   searchContainer: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f0f5',
// //     borderRadius: 12,
// //     paddingHorizontal: 12,
// //     height: 44,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: '#282c3f',
// //     padding: 0,
// //   },
// //   content: {
// //     paddingHorizontal: 16,
// //     paddingBottom: 20,
// //   },
// //   section: {
// //     marginTop: 20,
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   clearAllText: {
// //     fontSize: 13,
// //     color: '#fc8019',
// //     fontWeight: '500',
// //   },
// //   recentItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 14,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   recentItemLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   recentItemText: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     marginLeft: 12,
// //   },
// //   resultsList: {
// //     paddingHorizontal: 16,
// //     paddingBottom: 20,
// //   },
// //   resultsCount: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginBottom: 12,
// //     marginTop: 8,
// //   },
// //   // Simplified search result styles - no card
// //   searchResultItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   searchResultImage: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 8,
// //     backgroundColor: '#f0f0f5',
// //     marginRight: 12,
// //   },
// //   searchResultInfo: {
// //     flex: 1,
// //   },
// //   searchResultName: {
// //     fontSize: 15,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //   },
// //   searchResultCategory: {
// //     fontSize: 13,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   searchResultMeta: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 4,
// //   },
// //   searchResultPrice: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   searchResultStock: {
// //     fontSize: 12,
// //     marginLeft: 8,
// //   },
// //   popularItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   popularItemImage: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 8,
// //     backgroundColor: '#f0f0f5',
// //     marginRight: 12,
// //   },
// //   popularItemInfo: {
// //     flex: 1,
// //   },
// //   popularItemName: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //   },
// //   popularItemCategory: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   popularItemMeta: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 4,
// //   },
// //   popularItemPrice: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   popularItemStock: {
// //     fontSize: 12,
// //     marginLeft: 8,
// //   },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 60,
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
// //   },
// //   emptySearchText: {
// //     fontSize: 16,
// //     color: '#fc8019',
// //     fontWeight: '500',
// //     marginTop: 8,
// //   },
// //   footer: {
// //     paddingVertical: 30,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     fontSize: 14,
// //     color: '#93959f',
// //   },
// //   footerSub: {
// //     fontSize: 12,
// //     color: '#c0c0c0',
// //     marginTop: 4,
// //   },
// // });

// // export default SearchScreen;
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import { API_URL } from '@env';
// import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';

// interface Product {
//   id: string;
//   name: string;
//   category: string;
//   selling_price: number;
//   stock_qty: number;
//   description?: string;
//   image?: string;
//   barcode?: string;
//   sku?: string;
//   brand?: string;
//   vendor?: string;
//   gst_percent?: number;
//   unit?: string;
//   business_id?: string;
// }

// interface SearchScreenProps {
//   navigation: any;
//   route: any;
// }

// const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
//   const [searchText, setSearchText] = useState<string>('');
//   const [searchResults, setSearchResults] = useState<Product[]>([]);
//   const [recentSearches, setRecentSearches] = useState<string[]>([]);
//   const [isSearching, setIsSearching] = useState<boolean>(false);
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const { selectedBusiness } = useContext(SelectedBusinessContext);
//   const businessId = route?.params?.businessId ?? selectedBusiness?.id;

//   useEffect(() => {
//     loadProducts();
//     loadRecentSearches();
//   }, [businessId]);

//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.get(`${API_URL}/public/products`, {
//         params: businessId ? { business_id: businessId } : {},
//       });
      
//       // Handle different response structures
//       let products: Product[] = [];
      
//       if (Array.isArray(response.data)) {
//         products = response.data;
//       } else if (response.data && typeof response.data === 'object') {
//         if (response.data.data && Array.isArray(response.data.data)) {
//           products = response.data.data;
//         } else if (response.data.products && Array.isArray(response.data.products)) {
//           products = response.data.products;
//         } else if (response.data.items && Array.isArray(response.data.items)) {
//           products = response.data.items;
//         } else if (response.data.results && Array.isArray(response.data.results)) {
//           products = response.data.results;
//         } else {
//           const values = Object.values(response.data);
//           const arrayValue = values.find(val => Array.isArray(val));
//           if (arrayValue) {
//             products = arrayValue as Product[];
//           }
//         }
//       }
      
//       setAllProducts(products);
//     } catch (err) {
//       console.error('Failed to load products:', err);
//       setError('Failed to load products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadRecentSearches = async () => {
//     try {
//       const saved = await AsyncStorage.getItem('recentSearches');
//       if (saved) {
//         setRecentSearches(JSON.parse(saved));
//       }
//     } catch (error) {
//       console.error('Failed to load recent searches:', error);
//     }
//   };

//   const saveRecentSearches = async (searches: string[]) => {
//     try {
//       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
//     } catch (error) {
//       console.error('Failed to save recent searches:', error);
//     }
//   };

//   const handleSearch = (text: string) => {
//     setSearchText(text);
    
//     if (text.trim()) {
//       const searchLower = text.toLowerCase().trim();
      
//       const results = allProducts.filter((item) => {
//         if (!item) return false;
        
//         // Get the first letter of the product name
//         const productFirstLetter = item.name?.charAt(0).toLowerCase() || '';
//         const searchFirstLetter = searchLower.charAt(0);
        
//         // For single character search, match first letter
//         if (searchLower.length === 1) {
//           return productFirstLetter === searchFirstLetter;
//         }
        
//         // For multiple characters, match starting with the search term
//         const searchableFields = [
//           item.name,
//           item.category,
//           item.brand,
//           item.description,
//           item.sku,
//           item.barcode,
//           item.vendor,
//           item.unit
//         ].filter(field => field && typeof field === 'string');
        
//         // Check if any field starts with the search term
//         return searchableFields.some(field => 
//           field.toLowerCase().startsWith(searchLower)
//         );
//       });
      
//       setSearchResults(results);
//       setIsSearching(true);
//     } else {
//       setSearchResults([]);
//       setIsSearching(false);
//     }
//   };

//   const saveSearch = (term: string) => {
//     if (!term.trim()) return;
//     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
//     if (updatedSearches.length > 10) {
//       updatedSearches = updatedSearches.slice(0, 10);
//     }
//     setRecentSearches(updatedSearches);
//     saveRecentSearches(updatedSearches);
//   };

//   const handleSearchSubmit = () => {
//     if (searchText.trim()) {
//       saveSearch(searchText.trim());
//     }
//   };

//   const clearSearch = () => {
//     setSearchText('');
//     setSearchResults([]);
//     setIsSearching(false);
//   };

//   const clearRecentSearch = async (term: string) => {
//     const updated = recentSearches.filter(s => s !== term);
//     setRecentSearches(updated);
//     await saveRecentSearches(updated);
//   };

//   const clearAllRecentSearches = async () => {
//     Alert.alert(
//       'Clear Recent Searches',
//       'Are you sure you want to clear all recent searches?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear All',
//           style: 'destructive',
//           onPress: async () => {
//             setRecentSearches([]);
//             await saveRecentSearches([]);
//           },
//         },
//       ]
//     );
//   };

//   const handleRecentSearchClick = (term: string) => {
//     setSearchText(term);
//     saveSearch(term);
//     handleSearch(term);
//   };

//   const navigateToProduct = (product: Product) => {
//     saveSearch(product.name);
    
//     navigation.getParent()?.navigate('RestaurantDetail', {
//       restaurant: {
//         id: product.id,
//         name: product.name,
//         rating: 4.5,
//         deliveryTime: 'In Stock',
//         cuisine: product.category,
//         image: product.image || 'https://placehold.co/150x150',
//         costForTwo: `₹${product.selling_price}`,
//         address: product.description || 'Available in stock',
//         isVeg: true,
//         offer: `Stock: ${product.stock_qty} units`,
//         productData: {
//           id: product.id,
//           price: product.selling_price,
//           stock: product.stock_qty,
//           category: product.category,
//           description: product.description,
//           brand: product.brand,
//           vendor: product.vendor,
//           gst: product.gst_percent,
//           unit: product.unit,
//           barcode: product.barcode,
//           sku: product.sku,
//           image: product.image,
//           name: product.name,
//         }
//       }
//     });
//   };

//   const renderSearchResult = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.searchResultItem}
//       onPress={() => navigateToProduct(item)}
//       activeOpacity={0.7}
//     >
//       <Image 
//         source={{ uri: item.image || 'https://placehold.co/150x150' }}
//         style={styles.searchResultImage}
//       />
//       <View style={styles.searchResultInfo}>
//         <Text style={styles.searchResultName} numberOfLines={1}>
//           {item.name || 'Unnamed Product'}
//         </Text>
//         <Text style={styles.searchResultCategory}>
//           {item.category || 'Uncategorized'}
//         </Text>
//         <View style={styles.searchResultMeta}>
//           <Text style={styles.searchResultPrice}>₹{item.selling_price || 0}</Text>
//           <Text style={[styles.searchResultStock, { 
//             color: (item.stock_qty || 0) > 5 ? '#28a745' : '#dc3545' 
//           }]}>
//             • {item.stock_qty || 0} in stock
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderRecentSearch = ({ item }: { item: string }) => (
//     <TouchableOpacity
//       style={styles.recentItem}
//       onPress={() => handleRecentSearchClick(item)}
//     >
//       <View style={styles.recentItemLeft}>
//         <Icon name="time-outline" size={20} color="#7e808c" />
//         <Text style={styles.recentItemText}>{item}</Text>
//       </View>
//       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
//         <Icon name="close-circle" size={20} color="#ccc" />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   const renderPopularProduct = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.popularItem}
//       onPress={() => navigateToProduct(item)}
//       activeOpacity={0.7}
//     >
//       <Image 
//         source={{ uri: item.image || 'https://placehold.co/150x150' }}
//         style={styles.popularItemImage}
//       />
//       <View style={styles.popularItemInfo}>
//         <Text style={styles.popularItemName} numberOfLines={1}>
//           {item.name || 'Unnamed Product'}
//         </Text>
//         <Text style={styles.popularItemCategory}>
//           {item.category || 'Uncategorized'}
//         </Text>
//         <View style={styles.popularItemMeta}>
//           <Text style={styles.popularItemPrice}>₹{item.selling_price || 0}</Text>
//           <Text style={[styles.popularItemStock, { 
//             color: (item.stock_qty || 0) > 5 ? '#28a745' : '#dc3545' 
//           }]}>
//             • Stock: {item.stock_qty || 0}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <SafeAreaView style={[styles.container, styles.centerContent]}>
//         <ActivityIndicator size="large" color="#fc8019" />
//         <Text style={styles.loadingText}>Loading products...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={[styles.container, styles.centerContent]}>
//         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       <View style={styles.header}>
//         <TouchableOpacity 
//           onPress={() => navigation.goBack()} 
//           style={styles.backButton}
//         >
//           <Icon name="arrow-back" size={24} color="#282c3f" />
//         </TouchableOpacity>
//         <View style={styles.searchContainer}>
//           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search for products..."
//             placeholderTextColor="#7e808c"
//             value={searchText}
//             onChangeText={handleSearch}
//             onSubmitEditing={handleSearchSubmit}
//             autoFocus
//             returnKeyType="search"
//           />
//           {searchText.length > 0 && (
//             <TouchableOpacity onPress={clearSearch}>
//               <Icon name="close-circle" size={20} color="#7e808c" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {isSearching ? (
//         <FlatList
//           data={searchResults}
//           renderItem={renderSearchResult}
//           keyExtractor={(item) => item.id || Math.random().toString()}
//           contentContainerStyle={styles.resultsList}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Icon name="search-outline" size={60} color="#ccc" />
//               <Text style={styles.emptyText}>No products found</Text>
//               <Text style={styles.emptySubText}>
//                 Try searching for something else
//               </Text>
//               {searchText.length > 0 && (
//                 <Text style={styles.emptySearchText}>
//                   "{searchText}"
//                 </Text>
//               )}
//             </View>
//           }
//           ListHeaderComponent={
//             searchResults.length > 0 ? (
//               <Text style={styles.resultsCount}>
//                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
//               </Text>
//             ) : null
//           }
//         />
//       ) : (
//         <FlatList
//           data={allProducts}
//           renderItem={renderPopularProduct}
//           keyExtractor={(item) => item.id || Math.random().toString()}
//           contentContainerStyle={styles.content}
//           showsVerticalScrollIndicator={false}
//           ListHeaderComponent={
//             <View>
//               {recentSearches.length > 0 && (
//                 <View style={styles.section}>
//                   <View style={styles.sectionHeader}>
//                     <Text style={styles.sectionTitle}>Recent Searches</Text>
//                     <TouchableOpacity onPress={clearAllRecentSearches}>
//                       <Text style={styles.clearAllText}>Clear All</Text>
//                     </TouchableOpacity>
//                   </View>
//                   <FlatList
//                     data={recentSearches}
//                     renderItem={renderRecentSearch}
//                     keyExtractor={(item, index) => index.toString()}
//                     showsVerticalScrollIndicator={false}
//                   />
//                 </View>
//               )}

//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>All Products ({allProducts.length})</Text>
//               </View>
//             </View>
//           }
//           ListFooterComponent={
//             <View style={styles.footer}>
//               <Text style={styles.footerText}>Available Products</Text>
//               <Text style={styles.footerSub}>{allProducts.length} products available</Text>
//             </View>
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#7e808c',
//   },
//   errorText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#dc3545',
//     textAlign: 'center',
//   },
//   retryButton: {
//     marginTop: 16,
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   backButton: {
//     marginRight: 12,
//   },
//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f5',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 44,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#282c3f',
//     padding: 0,
//   },
//   content: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   section: {
//     marginTop: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   clearAllText: {
//     fontSize: 13,
//     color: '#fc8019',
//     fontWeight: '500',
//   },
//   recentItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   recentItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   recentItemText: {
//     fontSize: 14,
//     color: '#282c3f',
//     marginLeft: 12,
//   },
//   resultsList: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   resultsCount: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginBottom: 12,
//     marginTop: 8,
//   },
//   searchResultItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   searchResultImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f5',
//     marginRight: 12,
//   },
//   searchResultInfo: {
//     flex: 1,
//   },
//   searchResultName: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#282c3f',
//   },
//   searchResultCategory: {
//     fontSize: 13,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   searchResultMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   searchResultPrice: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   searchResultStock: {
//     fontSize: 12,
//     marginLeft: 8,
//   },
//   popularItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   popularItemImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f5',
//     marginRight: 12,
//   },
//   popularItemInfo: {
//     flex: 1,
//   },
//   popularItemName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#282c3f',
//   },
//   popularItemCategory: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   popularItemMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   popularItemPrice: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   popularItemStock: {
//     fontSize: 12,
//     marginLeft: 8,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
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
//   },
//   emptySearchText: {
//     fontSize: 16,
//     color: '#fc8019',
//     fontWeight: '500',
//     marginTop: 8,
//   },
//   footer: {
//     paddingVertical: 30,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#93959f',
//   },
//   footerSub: {
//     fontSize: 12,
//     color: '#c0c0c0',
//     marginTop: 4,
//   },
// });

// export default SearchScreen;
=======
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
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
<<<<<<< HEAD
import { CartContext } from '../../context/CartContext';
=======

>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4

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

interface SearchScreenProps {
  navigation: any;
<<<<<<< HEAD
  route: any;
}

const SearchScreen: React.FC<SearchScreenProps> = ({
  navigation,
  route,
}) => {
=======
  route: any; 
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedBusiness } = useContext(SelectedBusinessContext);
  const businessId = route?.params?.businessId ?? selectedBusiness?.id;
  

  const { selectedBusiness } = useContext(SelectedBusinessContext);

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useContext(CartContext);

  const businessId =
    route?.params?.businessId ?? selectedBusiness?.id;

  useEffect(() => {
    loadProducts();
    loadRecentSearches();
  }, [businessId]);

<<<<<<< HEAD
  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_URL}/public/products`,
        {
          params: businessId
            ? { business_id: businessId }
            : {},
        }
      );

      let products: Product[] = [];

      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (
        response.data &&
        typeof response.data === 'object'
      ) {
        if (
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          products = response.data.data;
        } else if (
          response.data.products &&
          Array.isArray(response.data.products)
        ) {
          products = response.data.products;
        } else if (
          response.data.items &&
          Array.isArray(response.data.items)
        ) {
          products = response.data.items;
        } else if (
          response.data.results &&
          Array.isArray(response.data.results)
        ) {
          products = response.data.results;
        } else {
          const values = Object.values(response.data);

          const arrayValue = values.find(
            value => Array.isArray(value)
          );

          if (arrayValue) {
            products = arrayValue as Product[];
          }
        }
      }

      setAllProducts(products);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(
        'Failed to load products. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RECENT SEARCHES
  // =========================================================

=======
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
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        'recentSearches'
      );

      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error(
        'Failed to load recent searches:',
        error
      );
    }
  };

  const saveRecentSearches = async (
    searches: string[]
  ) => {
    try {
      await AsyncStorage.setItem(
        'recentSearches',
        JSON.stringify(searches)
      );
    } catch (error) {
      console.error(
        'Failed to save recent searches:',
        error
      );
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (text.trim()) {
      const searchLower = text
        .toLowerCase()
        .trim();

      const results = allProducts.filter(item => {
        if (!item) return false;

        const productFirstLetter =
          item.name?.charAt(0).toLowerCase() || '';

        const searchFirstLetter =
          searchLower.charAt(0);

        // Single character search
        if (searchLower.length === 1) {
          return (
            productFirstLetter === searchFirstLetter
          );
        }

        const searchableFields = [
          item.name,
          item.category,
          item.brand,
          item.description,
          item.sku,
          item.barcode,
          item.vendor,
          item.unit,
        ].filter(
          field =>
            field &&
            typeof field === 'string'
        );

        return searchableFields.some(field =>
          field!
            .toLowerCase()
            .startsWith(searchLower)
        );
      });

      setSearchResults(results);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const saveSearch = (term: string) => {
    if (!term.trim()) return;

    let updatedSearches = [
      term,
      ...recentSearches.filter(
        search => search !== term
      ),
    ];

    if (updatedSearches.length > 10) {
      updatedSearches =
        updatedSearches.slice(0, 10);
    }

    setRecentSearches(updatedSearches);
    saveRecentSearches(updatedSearches);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      saveSearch(searchText.trim());
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // =========================================================
  // RECENT SEARCH ACTIONS
  // =========================================================

  const clearRecentSearch = async (
    term: string
  ) => {
    const updated = recentSearches.filter(
      search => search !== term
    );

    setRecentSearches(updated);

    await saveRecentSearches(updated);
  };

  const clearAllRecentSearches = async () => {
    Alert.alert(
      'Clear Recent Searches',
      'Are you sure you want to clear all recent searches?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

  const handleRecentSearchClick = (
    term: string
  ) => {
    setSearchText(term);
    saveSearch(term);
    handleSearch(term);
  };

  // =========================================================
  // CART FUNCTIONS
  // =========================================================

  const isItemInCart = (
    productId: string
  ) => {
    return cartItems.some(
      item => item.id === productId
    );
  };

  const getItemQuantity = (
    productId: string
  ) => {
    const item = cartItems.find(
      cartItem => cartItem.id === productId
    );

    return item ? item.quantity : 0;
  };

  // =========================================================
  // ADD PRODUCT TO CART
  // =========================================================

  const handleAddToCart = (
    product: Product
  ) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.selling_price,
      quantity: 1,
      image:
        product.image ||
        'https://placehold.co/150x150',
      restaurantId: product.id,
      restaurantName: product.name,
    };

    const restaurantData = {
      id: product.id,
      name: product.name,
      rating: 4.5,
      deliveryTime: 'In Stock',
      cuisine: product.category,
      image:
        product.image ||
        'https://placehold.co/150x150',
      costForTwo: `₹${product.selling_price}`,
      address:
        product.description ||
        'Available in stock',
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
      },
    };

    addToCart(
      cartItem,
      restaurantData
    );
  };

  // =========================================================
  // UPDATE PRODUCT QUANTITY
  // =========================================================

  const handleUpdateQuantity = (
    product: Product,
    newQuantity: number
  ) => {
    if (newQuantity === 0) {
      removeFromCart(
        product.id,
        product.id
      );
    } else {
      updateQuantity(
        product.id,
        product.id,
        newQuantity
      );
    }
  };

  // =========================================================
  // PRODUCT DETAILS NAVIGATION
  // =========================================================

  const navigateToProduct = (
    product: Product
  ) => {
    saveSearch(product.name);

    navigation.getParent()?.navigate(
      'RestaurantDetail',
      {
        restaurant: {
          id: product.id,
          name: product.name,
          rating: 4.5,
          deliveryTime: 'In Stock',
          cuisine: product.category,
          image:
            product.image ||
            'https://placehold.co/150x150',
          costForTwo: `₹${product.selling_price}`,
          address:
            product.description ||
            'Available in stock',
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
          },
        },
      }
    );
  };

  // =========================================================
  // SEARCH RESULT ITEM
  // =========================================================

  const renderSearchResult = ({
    item,
  }: {
    item: Product;
  }) => {
    const inCart = isItemInCart(item.id);
    const quantity = getItemQuantity(
      item.id
    );

    return (
      <View style={styles.searchResultItem}>

        {/* PRODUCT INFORMATION */}
        <TouchableOpacity
          style={styles.searchProductClickable}
          onPress={() =>
            navigateToProduct(item)
          }
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri:
                item.image ||
                'https://placehold.co/150x150',
            }}
            style={styles.searchResultImage}
          />

          <View
            style={styles.searchResultInfo}
          >
            <Text
              style={styles.searchResultName}
              numberOfLines={1}
            >
              {item.name ||
                'Unnamed Product'}
            </Text>

            <Text
              style={
                styles.searchResultCategory
              }
            >
              {item.category ||
                'Uncategorized'}
            </Text>

            <View
              style={
                styles.searchResultMeta
              }
            >
              <Text
                style={
                  styles.searchResultPrice
                }
              >
                ₹{item.selling_price || 0}
              </Text>

              <Text
                style={[
                  styles.searchResultStock,
                  {
                    color:
                      (item.stock_qty || 0) >
                      5
                        ? '#28a745'
                        : '#dc3545',
                  },
                ]}
              >
                • {item.stock_qty || 0}{' '}
                in stock
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ADD / QUANTITY */}
        {item.selling_price > 0 &&
          (inCart ? (
            <View
              style={
                styles.quantityContainer
              }
            >
              <TouchableOpacity
                style={
                  styles.quantityButton
                }
                onPress={() =>
                  handleUpdateQuantity(
                    item,
                    quantity - 1
                  )
                }
              >
                <Icon
                  name="remove"
                  size={16}
                  color="#fc8019"
                />
              </TouchableOpacity>

              <Text
                style={styles.quantityText}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                style={
                  styles.quantityButton
                }
                onPress={() =>
                  handleUpdateQuantity(
                    item,
                    quantity + 1
                  )
                }
              >
                <Icon
                  name="add"
                  size={16}
                  color="#fc8019"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                handleAddToCart(item)
              }
            >
              <Text
                style={styles.addButtonText}
              >
                ADD
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  // =========================================================
  // RECENT SEARCH ITEM
  // =========================================================

  const renderRecentSearch = ({
    item,
  }: {
    item: string;
  }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() =>
        handleRecentSearchClick(item)
      }
    >
      <View
        style={styles.recentItemLeft}
      >
        <Icon
          name="time-outline"
          size={20}
          color="#7e808c"
        />

        <Text
          style={styles.recentItemText}
        >
          {item}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() =>
          clearRecentSearch(item)
        }
      >
        <Icon
          name="close-circle"
          size={20}
          color="#ccc"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // =========================================================
  // ALL PRODUCTS ITEM
  // =========================================================

  const renderPopularProduct = ({
    item,
  }: {
    item: Product;
  }) => {
    const inCart = isItemInCart(item.id);
    const quantity = getItemQuantity(
      item.id
    );

    return (
      <View style={styles.popularItem}>

        {/* PRODUCT INFORMATION */}
        <TouchableOpacity
          style={styles.popularProductClickable}
          onPress={() =>
            navigateToProduct(item)
          }
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri:
                item.image ||
                'https://placehold.co/150x150',
            }}
            style={styles.popularItemImage}
          />

          <View
            style={styles.popularItemInfo}
          >
            <Text
              style={styles.popularItemName}
              numberOfLines={1}
            >
              {item.name ||
                'Unnamed Product'}
            </Text>

            <Text
              style={
                styles.popularItemCategory
              }
            >
              {item.category ||
                'Uncategorized'}
            </Text>

            <View
              style={styles.popularItemMeta}
            >
              <Text
                style={
                  styles.popularItemPrice
                }
              >
                ₹{item.selling_price || 0}
              </Text>

              <Text
                style={[
                  styles.popularItemStock,
                  {
                    color:
                      (item.stock_qty || 0) >
                      5
                        ? '#28a745'
                        : '#dc3545',
                  },
                ]}
              >
                • Stock:{' '}
                {item.stock_qty || 0}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ADD / QUANTITY BUTTON */}
        {item.selling_price > 0 &&
          (inCart ? (
            <View
              style={
                styles.quantityContainer
              }
            >
              <TouchableOpacity
                style={
                  styles.quantityButton
                }
                onPress={() =>
                  handleUpdateQuantity(
                    item,
                    quantity - 1
                  )
                }
              >
                <Icon
                  name="remove"
                  size={16}
                  color="#fc8019"
                />
              </TouchableOpacity>

              <Text
                style={styles.quantityText}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                style={
                  styles.quantityButton
                }
                onPress={() =>
                  handleUpdateQuantity(
                    item,
                    quantity + 1
                  )
                }
              >
                <Icon
                  name="add"
                  size={16}
                  color="#fc8019"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                handleAddToCart(item)
              }
            >
              <Text
                style={styles.addButtonText}
              >
                ADD
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centerContent,
        ]}
      >
        <ActivityIndicator
          size="large"
          color="#fc8019"
        />

        <Text style={styles.loadingText}>
          Loading products...
        </Text>
      </SafeAreaView>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          styles.centerContent,
        ]}
      >
        <Icon
          name="alert-circle-outline"
          size={60}
          color="#dc3545"
        />

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadProducts}
        >
          <Text
            style={styles.retryButtonText}
          >
            Retry
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

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

        <View
          style={styles.searchContainer}
        >
          <Icon
            name="search"
            size={20}
            color="#7e808c"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search for products..."
            placeholderTextColor="#7e808c"
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={
              handleSearchSubmit
            }
            autoFocus
            returnKeyType="search"
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
            >
              <Icon
                name="close-circle"
                size={20}
                color="#7e808c"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SEARCH RESULTS */}
      {isSearching ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item =>
            item.id
          }
          contentContainerStyle={
            styles.resultsList
          }
          showsVerticalScrollIndicator={
            false
          }
          ListEmptyComponent={
            <View
              style={styles.emptyContainer}
            >
              <Icon
                name="search-outline"
                size={60}
                color="#ccc"
              />

              <Text
                style={styles.emptyText}
              >
                No products found
              </Text>

              <Text
                style={
                  styles.emptySubText
                }
              >
                Try searching for something
                else
              </Text>

              {searchText.length > 0 && (
                <Text
                  style={
                    styles.emptySearchText
                  }
                >
                  "{searchText}"
                </Text>
              )}
            </View>
          }
          ListHeaderComponent={
            searchResults.length > 0 ? (
              <Text
                style={styles.resultsCount}
              >
                {searchResults.length}{' '}
                result
                {searchResults.length >
                1
                  ? 's'
                  : ''}{' '}
                found
              </Text>
            ) : null
          }
        />
      ) : (
        /* ALL PRODUCTS */
        <FlatList
          data={allProducts}
          renderItem={
            renderPopularProduct
          }
          keyExtractor={item =>
            item.id
          }
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
          ListHeaderComponent={
            <View>
              {/* RECENT SEARCHES */}
              {recentSearches.length >
                0 && (
                <View
                  style={styles.section}
                >
                  <View
                    style={
                      styles.sectionHeader
                    }
                  >
                    <Text
                      style={
                        styles.sectionTitle
                      }
                    >
                      Recent Searches
                    </Text>

                    <TouchableOpacity
                      onPress={
                        clearAllRecentSearches
                      }
                    >
                      <Text
                        style={
                          styles.clearAllText
                        }
                      >
                        Clear All
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={
                      recentSearches
                    }
                    renderItem={
                      renderRecentSearch
                    }
                    keyExtractor={(
                      item,
                      index
                    ) =>
                      `${item}-${index}`
                    }
                    showsVerticalScrollIndicator={
                      false
                    }
                  />
                </View>
              )}

              {/* ALL PRODUCTS TITLE */}
              <View
                style={styles.section}
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  All Products (
                  {allProducts.length})
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              <Text
                style={styles.footerText}
              >
                Available Products
              </Text>

              <Text
                style={styles.footerSub}
              >
                {allProducts.length}{' '}
                products available
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

// =========================================================
// STYLES
// =========================================================

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

  // =====================================================
  // HEADER
  // =====================================================

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

  // =====================================================
  // ALL PRODUCTS
  // =====================================================

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

  // =====================================================
  // RECENT SEARCH
  // =====================================================

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

  // =====================================================
  // SEARCH RESULTS
  // =====================================================

  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  resultsCount: {
    fontSize: 14,
    color: '#7e808c',
    marginBottom: 12,
    marginTop: 8,
  },

  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },

  searchProductClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
    marginRight: 12,
  },

  searchResultInfo: {
    flex: 1,
    marginRight: 8,
  },

  searchResultName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#282c3f',
  },

  searchResultCategory: {
    fontSize: 13,
    color: '#7e808c',
    marginTop: 2,
  },

  searchResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  searchResultPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282c3f',
  },

  searchResultStock: {
    fontSize: 12,
    marginLeft: 8,
  },

  // =====================================================
  // ALL PRODUCT CARD
  // =====================================================

  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },

  popularProductClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  popularItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
    marginRight: 12,
  },

  popularItemInfo: {
    flex: 1,
    marginRight: 8,
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

  // =====================================================
  // ADD BUTTON
  // =====================================================

  addButton: {
    borderWidth: 1,
    borderColor: '#fc8019',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    marginLeft: 8,
  },

  addButtonText: {
    color: '#fc8019',
    fontSize: 12,
    fontWeight: '600',
  },

  // =====================================================
  // QUANTITY
  // =====================================================

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fc8019',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    marginLeft: 8,
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
    color: '#282c3f',
    minWidth: 20,
    textAlign: 'center',
  },

  // =====================================================
  // EMPTY
  // =====================================================

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

  // =====================================================
  // FOOTER
  // =====================================================

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