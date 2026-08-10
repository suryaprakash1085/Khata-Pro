// // // // // // // // import React, { useState } from 'react';
// // // // // // // import { useEffect, useState } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   ScrollView,
// // // // // // //   TextInput,
// // // // // // //   TouchableOpacity,
// // // // // // //   FlatList,
// // // // // // //   StyleSheet,
// // // // // // //   Dimensions,
// // // // // // // } from 'react-native';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // import { colors } from '../../constants/colors';
// // // // // // // import { categories, restaurants, offers } from '../../constants/dummyData';
// // // // // // // // import { useEffect, useState } from 'react';

// // // // // // // import axios from 'axios';
// // // // // // // import { API_URL } from '@env';
// // // // // // // import RestaurantCard from '../../components/home/RestaurantCard';
// // // // // // // import CategoryItem from '../../components/home/CategoryItem';
// // // // // // // import { Category, Restaurant, Offer } from '../../types';

// // // // // // // const { width } = Dimensions.get('window');

// // // // // // // export default function HomeScreen({ navigation }: any) {
// // // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // // //   const [products, setProducts] = useState<any[]>([]);

// // // // // // //   useEffect(() => {
// // // // // // //     // axios.get(`${API_URL}/public/products?business_id=1`)
// // // // // // //     axios.get(`${API_URL}/public/products`)
// // // // // // //       .then((res) => setProducts(res.data))
  
// // // // // // //       .catch((err) => console.error('Failed to load products:', err));
// // // // // // //   }, []);

// // // // // // //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// // // // // // //   const renderOffer = ({ item }: { item: Offer }) => (
// // // // // // //     <View style={styles.offerCard}>
// // // // // // //       <Text style={styles.offerTitle}>{item.title}</Text>
// // // // // // //       <Text style={styles.offerDescription}>{item.description}</Text>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// // // // // // //       {/* Header */}
// // // // // // //       <View style={styles.header}>
// // // // // // //         <View>
// // // // // // //           <Text style={styles.locationLabel}>📍 Home</Text>
// // // // // // //           <Text style={styles.location}>Sector 1, HSR Layout</Text>
// // // // // // //         </View>
// // // // // // //         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// // // // // // //           <Icon name="person-circle-outline" size={40} color={colors.primary} />
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>

// // // // // // //       {/* Search Bar */}
// // // // // // //       <View style={styles.searchContainer}>
// // // // // // //         <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// // // // // // //         <TextInput
// // // // // // //           style={styles.searchInput}
// // // // // // //           placeholder="Search for restaurant, item or more"
// // // // // // //           value={searchText}
// // // // // // //           onChangeText={setSearchText}
// // // // // // //           onFocus={() => navigation.navigate('Search')}
// // // // // // //         />
// // // // // // //       </View>

// // // // // // //       {/* Offers Section */}
// // // // // // //       <FlatList
// // // // // // //         data={offers}
// // // // // // //         renderItem={renderOffer}
// // // // // // //         keyExtractor={(item) => item.id}
// // // // // // //         horizontal
// // // // // // //         showsHorizontalScrollIndicator={false}
// // // // // // //         contentContainerStyle={styles.offersList}
// // // // // // //         style={styles.offersSection}
// // // // // // //       />

// // // // // // //       {/* Quick Categories */}
// // // // // // //       <View style={styles.categoriesSection}>
// // // // // // //         <Text style={styles.sectionTitle}>What's on your mind?</Text>
// // // // // // //         <FlatList
// // // // // // //           data={categories}
// // // // // // //           renderItem={renderCategory}
// // // // // // //           keyExtractor={(item) => item.id}
// // // // // // //           horizontal
// // // // // // //           showsHorizontalScrollIndicator={false}
// // // // // // //           contentContainerStyle={styles.categoriesList}
// // // // // // //         />
// // // // // // //       </View>

// // // // // // //       {/* Top Restaurants */}
// // // // // // //       {/* <View style={styles.restaurantsSection}>
// // // // // // //         <View style={styles.sectionHeader}>
// // // // // // //           <Text style={styles.sectionTitle}>Top restaurant chains</Text>
// // // // // // //           <TouchableOpacity>
// // // // // // //             <Text style={styles.seeAll}>See All</Text>
// // // // // // //           </TouchableOpacity>
// // // // // // //         </View>
// // // // // // //         {restaurants.map((restaurant: Restaurant) => (
// // // // // // //           <RestaurantCard
// // // // // // //             key={restaurant.id}
// // // // // // //             restaurant={restaurant}
// // // // // // //             onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
// // // // // // //           />
// // // // // // //         ))}
// // // // // // //       </View> */}
// // // // // // //       {/* Products */}
// // // // // // //       <View style={styles.restaurantsSection}>
// // // // // // //         <View style={styles.sectionHeader}>
// // // // // // //           <Text style={styles.sectionTitle}>Available Products</Text>
// // // // // // //         </View>
// // // // // // //         {products.map((product: any) => (
// // // // // // //           <View key={product.id} style={styles.offerCard2}>
// // // // // // //             <Text style={styles.productName}>{product.name}</Text>
// // // // // // //             <Text style={styles.productCategory}>{product.category}</Text>
// // // // // // //             <Text style={styles.productPrice}>₹{product.selling_price}</Text>
// // // // // // //             <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
// // // // // // //           </View>
// // // // // // //         ))}
// // // // // // //       </View>
// // // // // // //     </ScrollView>
// // // // // // //   );
// // // // // // // }

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: colors.white,
// // // // // // //     paddingHorizontal: 16,
// // // // // // //   },
// // // // // // //   header: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingTop: 16,
// // // // // // //     paddingBottom: 8,
// // // // // // //   },
// // // // // // //   locationLabel: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: colors.textLight,
// // // // // // //   },
// // // // // // //   location: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   searchContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: colors.lightGray,
// // // // // // //     borderRadius: 12,
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     marginVertical: 12,
// // // // // // //     height: 48,
// // // // // // //   },
// // // // // // //   searchIcon: {
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   searchInput: {
// // // // // // //     flex: 1,
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   offersSection: {
// // // // // // //     marginVertical: 8,
// // // // // // //   },
// // // // // // //   offersList: {
// // // // // // //     paddingVertical: 4,
// // // // // // //   },
// // // // // // //   offerCard: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //     borderRadius: 12,
// // // // // // //     padding: 16,
// // // // // // //     marginRight: 12,
// // // // // // //     width: width * 0.6,
// // // // // // //     height: 80,
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   offerTitle: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: colors.white,
// // // // // // //   },
// // // // // // //   offerDescription: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: colors.white,
// // // // // // //     opacity: 0.9,
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   categoriesSection: {
// // // // // // //     marginVertical: 8,
// // // // // // //   },
// // // // // // //   sectionTitle: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.text,
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   categoriesList: {
// // // // // // //     paddingVertical: 4,
// // // // // // //   },
// // // // // // //   restaurantsSection: {
// // // // // // //     marginVertical: 8,
// // // // // // //     paddingBottom: 80,
// // // // // // //   },
// // // // // // //   sectionHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   seeAll: {
// // // // // // //     color: colors.primary,
// // // // // // //     fontWeight: '500',
// // // // // // //     fontSize: 14,
// // // // // // //   },
// // // // // // //   offerCard2: {
// // // // // // //     backgroundColor: colors.lightGray,
// // // // // // //     borderRadius: 12,
// // // // // // //     padding: 16,
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   productName: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   productCategory: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   productPrice: {
// // // // // // //     fontSize: 15,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.primary,
// // // // // // //     marginTop: 6,
// // // // // // //   },
// // // // // // //   productStock: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // // });
// // // // // // import React, { useState, useEffect, useContext } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   FlatList,
// // // // // //   StyleSheet,
// // // // // //   Dimensions,
// // // // // //   SafeAreaView,
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { colors } from '../../constants/colors';
// // // // // // import { categories, offers } from '../../constants/dummyData';
// // // // // // import axios from 'axios';
// // // // // // import { API_URL } from '@env';
// // // // // // import CategoryItem from '../../components/home/CategoryItem';
// // // // // // import { Category, Offer } from '../../types';
// // // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // // import { CartContext } from '../../context/CartContext';

// // // // // // const { width } = Dimensions.get('window');

// // // // // // export default function HomeScreen({ navigation }: any) {
// // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // //   const [products, setProducts] = useState<any[]>([]);
// // // // // //   const { user } = useContext(AuthContext);
  
// // // // // //   // ✅ FIXED: Use correct property name 'totalItems' (not 'totallets')
// // // // // //   const { cartItems, totalItems } = useContext(CartContext);

// // // // // //   useEffect(() => {
// // // // // //     axios.get(`${API_URL}/public/products`)
// // // // // //       .then((res) => setProducts(res.data))
// // // // // //       .catch((err) => console.error('Failed to load products:', err));
// // // // // //   }, []);

// // // // // //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// // // // // //   const renderOffer = ({ item }: { item: Offer }) => (
// // // // // //     <View style={styles.offerCard}>
// // // // // //       <Text style={styles.offerTitle}>{item.title}</Text>
// // // // // //       <Text style={styles.offerDescription}>{item.description}</Text>
// // // // // //     </View>
// // // // // //   );

// // // // // //   // Navigation handlers
// // // // // //   const handleProfilePress = () => {
// // // // // //     navigation.navigate('Profile');
// // // // // //   };

// // // // // //   const handleSearchPress = () => {
// // // // // //     navigation.navigate('Search');
// // // // // //   };

// // // // // //   const handleCartPress = () => {
// // // // // //     navigation.navigate('Cart');
// // // // // //   };

// // // // // //   const handleProductPress = (product: any) => {
// // // // // //     navigation.navigate('RestaurantDetail', { 
// // // // // //       restaurant: { 
// // // // // //         productData: product,
// // // // // //         name: product.name,
// // // // // //         image: product.image || 'https://via.placeholder.com/400x200',
// // // // // //         cuisine: product.category || 'General',
// // // // // //         costForTwo: `₹${product.selling_price} for one`,
// // // // // //       } 
// // // // // //     });
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.safeArea}>
// // // // // //       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// // // // // //         {/* Header */}
// // // // // //         <View style={styles.header}>
// // // // // //           <View>
// // // // // //             <Text style={styles.locationLabel}>📍 Home</Text>
// // // // // //             <Text style={styles.location}>Sector 1, HSR Layout</Text>
// // // // // //           </View>
// // // // // //           <View style={styles.headerRight}>
// // // // // //             {/* Cart Icon */}
// // // // // //             <TouchableOpacity onPress={handleCartPress} style={styles.cartIcon}>
// // // // // //               <Icon name="cart-outline" size={28} color={colors.primary} />
// // // // // //               {totalItems > 0 && (
// // // // // //                 <View style={styles.cartBadge}>
// // // // // //                   <Text style={styles.cartBadgeText}>{totalItems}</Text>
// // // // // //                 </View>
// // // // // //               )}
// // // // // //             </TouchableOpacity>
// // // // // //             {/* Profile Icon */}
// // // // // //             <TouchableOpacity onPress={handleProfilePress}>
// // // // // //               <Icon name="person-circle-outline" size={40} color={colors.primary} />
// // // // // //             </TouchableOpacity>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* Search Bar */}
// // // // // //         <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
// // // // // //           <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// // // // // //           <Text style={styles.searchPlaceholder}>Search for products...</Text>
// // // // // //         </TouchableOpacity>

// // // // // //         {/* Offers Section */}
// // // // // //         <FlatList
// // // // // //           data={offers}
// // // // // //           renderItem={renderOffer}
// // // // // //           keyExtractor={(item) => item.id}
// // // // // //           horizontal
// // // // // //           showsHorizontalScrollIndicator={false}
// // // // // //           contentContainerStyle={styles.offersList}
// // // // // //           style={styles.offersSection}
// // // // // //         />

// // // // // //         {/* Quick Categories */}
// // // // // //         <View style={styles.categoriesSection}>
// // // // // //           <Text style={styles.sectionTitle}>What's on your mind?</Text>
// // // // // //           <FlatList
// // // // // //             data={categories}
// // // // // //             renderItem={renderCategory}
// // // // // //             keyExtractor={(item) => item.id}
// // // // // //             horizontal
// // // // // //             showsHorizontalScrollIndicator={false}
// // // // // //             contentContainerStyle={styles.categoriesList}
// // // // // //           />
// // // // // //         </View>

// // // // // //         {/* Products Section */}
// // // // // //         <View style={styles.productsSection}>
// // // // // //           <View style={styles.sectionHeader}>
// // // // // //             <Text style={styles.sectionTitle}>Available Products</Text>
// // // // // //             <Text style={styles.productCount}>{products.length} products</Text>
// // // // // //           </View>
// // // // // //           {products.map((product: any) => (
// // // // // //             <TouchableOpacity 
// // // // // //               key={product.id} 
// // // // // //               style={styles.productCard}
// // // // // //               onPress={() => handleProductPress(product)}
// // // // // //             >
// // // // // //               <View style={styles.productInfo}>
// // // // // //                 <Text style={styles.productName}>{product.name}</Text>
// // // // // //                 <Text style={styles.productCategory}>{product.category || 'General'}</Text>
// // // // // //                 <Text style={styles.productPrice}>₹{product.selling_price}</Text>
// // // // // //                 <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
// // // // // //               </View>
// // // // // //               <TouchableOpacity 
// // // // // //                 style={styles.addButton}
// // // // // //                 onPress={handleCartPress}
// // // // // //               >
// // // // // //                 <Icon name="add-circle-outline" size={28} color={colors.primary} />
// // // // // //               </TouchableOpacity>
// // // // // //             </TouchableOpacity>
// // // // // //           ))}
// // // // // //         </View>

// // // // // //         <View style={styles.bottomPadding} />
// // // // // //       </ScrollView>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   safeArea: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: colors.white,
// // // // // //   },
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: colors.white,
// // // // // //     paddingHorizontal: 16,
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     paddingTop: 8,
// // // // // //     paddingBottom: 8,
// // // // // //   },
// // // // // //   headerRight: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   cartIcon: {
// // // // // //     marginRight: 12,
// // // // // //     position: 'relative',
// // // // // //   },
// // // // // //   cartBadge: {
// // // // // //     position: 'absolute',
// // // // // //     top: -4,
// // // // // //     right: -6,
// // // // // //     backgroundColor: colors.primary,
// // // // // //     borderRadius: 10,
// // // // // //     minWidth: 18,
// // // // // //     height: 18,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     paddingHorizontal: 4,
// // // // // //   },
// // // // // //   cartBadgeText: {
// // // // // //     color: colors.white,
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: '700',
// // // // // //   },
// // // // // //   locationLabel: {
// // // // // //     fontSize: 12,
// // // // // //     color: colors.textLight,
// // // // // //   },
// // // // // //   location: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   searchContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: colors.lightGray,
// // // // // //     borderRadius: 12,
// // // // // //     paddingHorizontal: 12,
// // // // // //     marginVertical: 12,
// // // // // //     height: 48,
// // // // // //   },
// // // // // //   searchIcon: {
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   searchPlaceholder: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.textLight,
// // // // // //   },
// // // // // //   offersSection: {
// // // // // //     marginVertical: 8,
// // // // // //   },
// // // // // //   offersList: {
// // // // // //     paddingVertical: 4,
// // // // // //   },
// // // // // //   offerCard: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     marginRight: 12,
// // // // // //     width: width * 0.6,
// // // // // //     height: 80,
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   offerTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: colors.white,
// // // // // //   },
// // // // // //   offerDescription: {
// // // // // //     fontSize: 12,
// // // // // //     color: colors.white,
// // // // // //     opacity: 0.9,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   categoriesSection: {
// // // // // //     marginVertical: 8,
// // // // // //   },
// // // // // //   sectionTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.text,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   categoriesList: {
// // // // // //     paddingVertical: 4,
// // // // // //   },
// // // // // //   productsSection: {
// // // // // //     marginVertical: 8,
// // // // // //   },
// // // // // //   sectionHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   productCount: {
// // // // // //     fontSize: 12,
// // // // // //     color: colors.textLight,
// // // // // //   },
// // // // // //   productCard: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: colors.lightGray,
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   productInfo: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   productName: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   productCategory: {
// // // // // //     fontSize: 13,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   productPrice: {
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.primary,
// // // // // //     marginTop: 6,
// // // // // //   },
// // // // // //   productStock: {
// // // // // //     fontSize: 12,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   addButton: {
// // // // // //     padding: 8,
// // // // // //   },
// // // // // //   bottomPadding: {
// // // // // //     height: 80,
// // // // // //   },
// // // // // // });
// // // // // // delivery-app/src/screens/main/HomeScreen.tsx
// // // // // import React, { useState, useEffect, useContext } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   FlatList,
// // // // //   StyleSheet,
// // // // //   Dimensions,
// // // // //   SafeAreaView,
// // // // // } from 'react-native';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { colors } from '../../constants/colors';
// // // // // import { categories, offers } from '../../constants/dummyData';
// // // // // import axios from 'axios';
// // // // // import { API_URL } from '@env';
// // // // // import CategoryItem from '../../components/home/CategoryItem';
// // // // // import { Category, Offer } from '../../types';
// // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // import { CartContext } from '../../context/CartContext';

// // // // // const { width } = Dimensions.get('window');

// // // // // export default function HomeScreen({ navigation }: any) {
// // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // //   const [products, setProducts] = useState<any[]>([]);
// // // // //   const { user } = useContext(AuthContext);
// // // // //   const { cartItems, totalItems, totalPrice } = useContext(CartContext);

// // // // //   useEffect(() => {
// // // // //     fetchProducts();
// // // // //   }, []);

// // // // //   const fetchProducts = async () => {
// // // // //     try {
// // // // //       const response = await axios.get(`${API_URL}/public/products`);
// // // // //       setProducts(response.data);
// // // // //     } catch (err) {
// // // // //       console.error('Failed to load products:', err);
// // // // //     }
// // // // //   };

// // // // //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// // // // //   const renderOffer = ({ item }: { item: Offer }) => (
// // // // //     <View style={styles.offerCard}>
// // // // //       <Text style={styles.offerTitle}>{item.title}</Text>
// // // // //       <Text style={styles.offerDescription}>{item.description}</Text>
// // // // //     </View>
// // // // //   );

// // // // //   // Navigation handlers
// // // // //   const handleProfilePress = () => {
// // // // //     navigation.navigate('Profile');
// // // // //   };

// // // // //   const handleSearchPress = () => {
// // // // //     navigation.navigate('Search');
// // // // //   };

// // // // //   const handleCartPress = () => {
// // // // //     navigation.navigate('Cart');
// // // // //   };

// // // // //   const handleProductPress = (product: any) => {
// // // // //     navigation.navigate('RestaurantDetail', { 
// // // // //       restaurant: { 
// // // // //         productData: product,
// // // // //         name: product.name,
// // // // //         image: product.image || 'https://via.placeholder.com/400x200',
// // // // //         cuisine: product.category || 'General',
// // // // //         costForTwo: `₹${product.selling_price} for one`,
// // // // //       } 
// // // // //     });
// // // // //   };

// // // // //   return (
// // // // //     <SafeAreaView style={styles.safeArea}>
// // // // //       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// // // // //         {/* Header */}
// // // // //         <View style={styles.header}>
// // // // //           <View>
// // // // //             <Text style={styles.locationLabel}>📍 Home</Text>
// // // // //             <Text style={styles.location}>Sector 1, HSR Layout</Text>
// // // // //           </View>
// // // // //           <View style={styles.headerRight}>
// // // // //             <TouchableOpacity onPress={handleCartPress} style={styles.cartIcon}>
// // // // //               <Icon name="cart-outline" size={28} color={colors.primary} />
// // // // //               {totalItems > 0 && (
// // // // //                 <View style={styles.cartBadge}>
// // // // //                   <Text style={styles.cartBadgeText}>{totalItems}</Text>
// // // // //                 </View>
// // // // //               )}
// // // // //             </TouchableOpacity>
// // // // //             <TouchableOpacity onPress={handleProfilePress}>
// // // // //               <Icon name="person-circle-outline" size={40} color={colors.primary} />
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Search Bar */}
// // // // //         <TouchableOpacity style={styles.searchContainer} onPress={handleSearchPress}>
// // // // //           <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// // // // //           <Text style={styles.searchPlaceholder}>Search for products...</Text>
// // // // //         </TouchableOpacity>

// // // // //         {/* Offers Section */}
// // // // //         <FlatList
// // // // //           data={offers}
// // // // //           renderItem={renderOffer}
// // // // //           keyExtractor={(item) => item.id}
// // // // //           horizontal
// // // // //           showsHorizontalScrollIndicator={false}
// // // // //           contentContainerStyle={styles.offersList}
// // // // //           style={styles.offersSection}
// // // // //         />

// // // // //         {/* Categories Section */}
// // // // //         <View style={styles.categoriesSection}>
// // // // //           <Text style={styles.sectionTitle}>What's on your mind?</Text>
// // // // //           <FlatList
// // // // //             data={categories}
// // // // //             renderItem={renderCategory}
// // // // //             keyExtractor={(item) => item.id}
// // // // //             horizontal
// // // // //             showsHorizontalScrollIndicator={false}
// // // // //             contentContainerStyle={styles.categoriesList}
// // // // //           />
// // // // //         </View>

// // // // //         {/* Products Section */}
// // // // //         <View style={styles.productsSection}>
// // // // //           <View style={styles.sectionHeader}>
// // // // //             <Text style={styles.sectionTitle}>Available Products</Text>
// // // // //             <Text style={styles.productCount}>{products.length} products</Text>
// // // // //           </View>
// // // // //           {products.map((product: any) => (
// // // // //             <TouchableOpacity 
// // // // //               key={product.id} 
// // // // //               style={styles.productCard}
// // // // //               onPress={() => handleProductPress(product)}
// // // // //             >
// // // // //               <View style={styles.productInfo}>
// // // // //                 <Text style={styles.productName}>{product.name}</Text>
// // // // //                 <Text style={styles.productCategory}>{product.category || 'General'}</Text>
// // // // //                 <Text style={styles.productPrice}>₹{product.selling_price}</Text>
// // // // //                 <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
// // // // //               </View>
// // // // //               <TouchableOpacity 
// // // // //                 style={styles.addButton}
// // // // //                 onPress={handleCartPress}
// // // // //               >
// // // // //                 <Icon name="add-circle-outline" size={28} color={colors.primary} />
// // // // //               </TouchableOpacity>
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </View>

// // // // //         <View style={styles.bottomPadding} />
// // // // //       </ScrollView>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   safeArea: {
// // // // //     flex: 1,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: colors.white,
// // // // //     paddingHorizontal: 16,
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingTop: 8,
// // // // //     paddingBottom: 8,
// // // // //   },
// // // // //   headerRight: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   cartIcon: {
// // // // //     marginRight: 12,
// // // // //     position: 'relative',
// // // // //   },
// // // // //   cartBadge: {
// // // // //     position: 'absolute',
// // // // //     top: -4,
// // // // //     right: -6,
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 10,
// // // // //     minWidth: 18,
// // // // //     height: 18,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 4,
// // // // //   },
// // // // //   cartBadgeText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 10,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   locationLabel: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //   },
// // // // //   location: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   searchContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: colors.lightGray,
// // // // //     borderRadius: 12,
// // // // //     paddingHorizontal: 12,
// // // // //     marginVertical: 12,
// // // // //     height: 48,
// // // // //   },
// // // // //   searchIcon: {
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   searchPlaceholder: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //   },
// // // // //   offersSection: {
// // // // //     marginVertical: 8,
// // // // //   },
// // // // //   offersList: {
// // // // //     paddingVertical: 4,
// // // // //   },
// // // // //   offerCard: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginRight: 12,
// // // // //     width: width * 0.6,
// // // // //     height: 80,
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   offerTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '700',
// // // // //     color: colors.white,
// // // // //   },
// // // // //   offerDescription: {
// // // // //     fontSize: 12,
// // // // //     color: colors.white,
// // // // //     opacity: 0.9,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   categoriesSection: {
// // // // //     marginVertical: 8,
// // // // //   },
// // // // //   sectionTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   categoriesList: {
// // // // //     paddingVertical: 4,
// // // // //   },
// // // // //   productsSection: {
// // // // //     marginVertical: 8,
// // // // //   },
// // // // //   sectionHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   productCount: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //   },
// // // // //   productCard: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: colors.lightGray,
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   productInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   productName: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   productCategory: {
// // // // //     fontSize: 13,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   productPrice: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '600',
// // // // //     color: colors.primary,
// // // // //     marginTop: 6,
// // // // //   },
// // // // //   productStock: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   addButton: {
// // // // //     padding: 8,
// // // // //   },
// // // // //   bottomPadding: {
// // // // //     height: 80,
// // // // //   },
// // // // // });
// // // // import { useEffect, useState } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   ScrollView,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   FlatList,
// // // //   StyleSheet,
// // // //   Dimensions,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { colors } from '../../constants/colors';
// // // // import { categories, restaurants, offers } from '../../constants/dummyData';
// // // // // import { useEffect, useState } from 'react';

// // // // import axios from 'axios';
// // // // import { API_URL } from '@env';
// // // // import RestaurantCard from '../../components/home/RestaurantCard';
// // // // import CategoryItem from '../../components/home/CategoryItem';
// // // // import { Category, Restaurant, Offer } from '../../types';

// // // // const { width } = Dimensions.get('window');

// // // // export default function HomeScreen({ navigation }: any) {
// // // //   const [searchText, setSearchText] = useState<string>('');
// // // //   const [products, setProducts] = useState<any[]>([]);

// // // //   useEffect(() => {
// // // //     // axios.get(`${API_URL}/public/products?business_id=1`)
// // // //     axios.get(`${API_URL}/public/products`)
// // // //       .then((res) => setProducts(res.data))
  
// // // //       .catch((err) => console.error('Failed to load products:', err));
// // // //   }, []);

// // // //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// // // //   const renderOffer = ({ item }: { item: Offer }) => (
// // // //     <View style={styles.offerCard}>
// // // //       <Text style={styles.offerTitle}>{item.title}</Text>
// // // //       <Text style={styles.offerDescription}>{item.description}</Text>
// // // //     </View>
// // // //   );

// // // //   return (
// // // //     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// // // //       {/* Header */}
// // // //       <View style={styles.header}>
// // // //         <View>
// // // //           <Text style={styles.locationLabel}>📍 Home</Text>
// // // //           <Text style={styles.location}>Sector 1, HSR Layout</Text>
// // // //         </View>
// // // //         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// // // //           <Icon name="person-circle-outline" size={40} color={colors.primary} />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* Search Bar */}
// // // //       <View style={styles.searchContainer}>
// // // //         <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// // // //         <TextInput
// // // //           style={styles.searchInput}
// // // //           placeholder="Search for restaurant, item or more"
// // // //           value={searchText}
// // // //           onChangeText={setSearchText}
// // // //           onFocus={() => navigation.navigate('Search')}
// // // //         />
// // // //       </View>

// // // //       {/* Offers Section */}
// // // //       <FlatList
// // // //         data={offers}
// // // //         renderItem={renderOffer}
// // // //         keyExtractor={(item) => item.id}
// // // //         horizontal
// // // //         showsHorizontalScrollIndicator={false}
// // // //         contentContainerStyle={styles.offersList}
// // // //         style={styles.offersSection}
// // // //       />

// // // //       {/* Quick Categories */}
// // // //       <View style={styles.categoriesSection}>
// // // //         <Text style={styles.sectionTitle}>What's on your mind?</Text>
// // // //         <FlatList
// // // //           data={categories}
// // // //           renderItem={renderCategory}
// // // //           keyExtractor={(item) => item.id}
// // // //           horizontal
// // // //           showsHorizontalScrollIndicator={false}
// // // //           contentContainerStyle={styles.categoriesList}
// // // //         />
// // // //       </View>

// // // //       {/* Top Restaurants */}
// // // //       {/* <View style={styles.restaurantsSection}>
// // // //         <View style={styles.sectionHeader}>
// // // //           <Text style={styles.sectionTitle}>Top restaurant chains</Text>
// // // //           <TouchableOpacity>
// // // //             <Text style={styles.seeAll}>See All</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //         {restaurants.map((restaurant: Restaurant) => (
// // // //           <RestaurantCard
// // // //             key={restaurant.id}
// // // //             restaurant={restaurant}
// // // //             onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
// // // //           />
// // // //         ))}
// // // //       </View> */}
// // // //       {/* Products */}
// // // //       <View style={styles.restaurantsSection}>
// // // //         <View style={styles.sectionHeader}>
// // // //           <Text style={styles.sectionTitle}>Available Products</Text>
// // // //         </View>
// // // //         {products.map((product: any) => (
// // // //           <View key={product.id} style={styles.offerCard2}>
// // // //             <Text style={styles.productName}>{product.name}</Text>
// // // //             <Text style={styles.productCategory}>{product.category}</Text>
// // // //             <Text style={styles.productPrice}>₹{product.selling_price}</Text>
// // // //             <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
// // // //           </View>
// // // //         ))}
// // // //       </View>
// // // //     </ScrollView>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: colors.white,
// // // //     paddingHorizontal: 16,
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingTop: 16,
// // // //     paddingBottom: 8,
// // // //   },
// // // //   locationLabel: {
// // // //     fontSize: 12,
// // // //     color: colors.textLight,
// // // //   },
// // // //   location: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: colors.text,
// // // //   },
// // // //   searchContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: colors.lightGray,
// // // //     borderRadius: 12,
// // // //     paddingHorizontal: 12,
// // // //     marginVertical: 12,
// // // //     height: 48,
// // // //   },
// // // //   searchIcon: {
// // // //     marginRight: 8,
// // // //   },
// // // //   searchInput: {
// // // //     flex: 1,
// // // //     fontSize: 14,
// // // //     color: colors.text,
// // // //   },
// // // //   offersSection: {
// // // //     marginVertical: 8,
// // // //   },
// // // //   offersList: {
// // // //     paddingVertical: 4,
// // // //   },
// // // //   offerCard: {
// // // //     backgroundColor: colors.primary,
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginRight: 12,
// // // //     width: width * 0.6,
// // // //     height: 80,
// // // //     justifyContent: 'center',
// // // //   },
// // // //   offerTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '700',
// // // //     color: colors.white,
// // // //   },
// // // //   offerDescription: {
// // // //     fontSize: 12,
// // // //     color: colors.white,
// // // //     opacity: 0.9,
// // // //     marginTop: 4,
// // // //   },
// // // //   categoriesSection: {
// // // //     marginVertical: 8,
// // // //   },
// // // //   sectionTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: colors.text,
// // // //     marginBottom: 12,
// // // //   },
// // // //   categoriesList: {
// // // //     paddingVertical: 4,
// // // //   },
// // // //   restaurantsSection: {
// // // //     marginVertical: 8,
// // // //     paddingBottom: 80,
// // // //   },
// // // //   sectionHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 12,
// // // //   },
// // // //   seeAll: {
// // // //     color: colors.primary,
// // // //     fontWeight: '500',
// // // //     fontSize: 14,
// // // //   },
// // // //   offerCard2: {
// // // //     backgroundColor: colors.lightGray,
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 12,
// // // //   },
// // // //   productName: {
// // // //     fontSize: 16,
// // // //     fontWeight: '700',
// // // //     color: colors.text,
// // // //   },
// // // //   productCategory: {
// // // //     fontSize: 13,
// // // //     color: colors.textLight,
// // // //     marginTop: 2,
// // // //   },
// // // //   productPrice: {
// // // //     fontSize: 15,
// // // //     fontWeight: '600',
// // // //     color: colors.primary,
// // // //     marginTop: 6,
// // // //   },
// // // //   productStock: {
// // // //     fontSize: 12,
// // // //     color: colors.textLight,
// // // //     marginTop: 2,
// // // //   },
// // // // });
// // // // delivery-app/src/screens/main/HomeScreen.tsx
// // // import React, { useState, useEffect, useContext } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   StyleSheet,
// // //   Dimensions,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { colors } from '../../constants/colors';
// // // import { categories, offers } from '../../constants/dummyData';
// // // import axios from 'axios';
// // // import { API_URL } from '@env';
// // // import CategoryItem from '../../components/home/CategoryItem';
// // // import { Category, Offer } from '../../types';
// // // import { AuthContext } from '../../context/AuthContext';

// // // const { width } = Dimensions.get('window');

// // // export default function HomeScreen({ navigation }: any) {
// // //   const [searchText, setSearchText] = useState<string>('');
// // //   const [products, setProducts] = useState<any[]>([]);
// // //   const { user } = useContext(AuthContext);

// // //   useEffect(() => {
// // //     axios.get(`${API_URL}/public/products`)
// // //       .then((res) => setProducts(res.data))
// // //       .catch((err) => console.error('Failed to load products:', err));
// // //   }, []);

// // //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// // //   const renderOffer = ({ item }: { item: Offer }) => (
// // //     <View style={styles.offerCard}>
// // //       <Text style={styles.offerTitle}>{item.title}</Text>
// // //       <Text style={styles.offerDescription}>{item.description}</Text>
// // //     </View>
// // //   );

// // //   // ✅ Get business name from user (fetched from Khata-Mobile)
// // //   const businessName = user?.business_name || 'QuickBite';
// // //   const plan = user?.business_plan || 'FREE';
// // //   const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

// // //   return (
// // //     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <View>
// // //           <Text style={styles.locationLabel}>📍 Home</Text>
// // //           <Text style={styles.location}>Sector 1, HSR Layout</Text>
          
// // //           {/* ✅ Business Card - Shows business name from Khata-Mobile */}
// // //           <View style={styles.businessCard}>
// // //             <View style={styles.businessCardContent}>
// // //               <Icon name="storefront-outline" size={16} color={colors.primary} />
// // //               <Text style={styles.businessName}>{displayName}</Text>
// // //               <View style={styles.businessBadge}>
// // //                 <Text style={styles.businessBadgeText}>{plan}</Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </View>
// // //         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// // //           <Icon name="person-circle-outline" size={40} color={colors.primary} />
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Search Bar */}
// // //       <View style={styles.searchContainer}>
// // //         <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// // //         <TextInput
// // //           style={styles.searchInput}
// // //           placeholder="Search for restaurant, item or more"
// // //           value={searchText}
// // //           onChangeText={setSearchText}
// // //           onFocus={() => navigation.navigate('Search')}
// // //         />
// // //       </View>

// // //       {/* Offers Section */}
// // //       <FlatList
// // //         data={offers}
// // //         renderItem={renderOffer}
// // //         keyExtractor={(item) => item.id}
// // //         horizontal
// // //         showsHorizontalScrollIndicator={false}
// // //         contentContainerStyle={styles.offersList}
// // //         style={styles.offersSection}
// // //       />

// // //       {/* Quick Categories */}
// // //       <View style={styles.categoriesSection}>
// // //         <Text style={styles.sectionTitle}>What's on your mind?</Text>
// // //         <FlatList
// // //           data={categories}
// // //           renderItem={renderCategory}
// // //           keyExtractor={(item) => item.id}
// // //           horizontal
// // //           showsHorizontalScrollIndicator={false}
// // //           contentContainerStyle={styles.categoriesList}
// // //         />
// // //       </View>

// // //       {/* Products */}
// // //       <View style={styles.restaurantsSection}>
// // //         <View style={styles.sectionHeader}>
// // //           <Text style={styles.sectionTitle}>Available Products</Text>
// // //         </View>
// // //         {products.map((product: any) => (
// // //           <View key={product.id} style={styles.offerCard2}>
// // //             <Text style={styles.productName}>{product.name}</Text>
// // //             <Text style={styles.productCategory}>{product.category}</Text>
// // //             <Text style={styles.productPrice}>₹{product.selling_price}</Text>
// // //             <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
// // //           </View>
// // //         ))}
// // //       </View>
// // //     </ScrollView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: colors.white,
// // //     paddingHorizontal: 16,
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'flex-start',
// // //     paddingTop: 16,
// // //     paddingBottom: 8,
// // //   },
// // //   locationLabel: {
// // //     fontSize: 12,
// // //     color: colors.textLight,
// // //   },
// // //   location: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: colors.text,
// // //   },
// // //   // ✅ Business Card - Shows the business name from Khata-Mobile
// // //   businessCard: {
// // //     marginTop: 6,
// // //     backgroundColor: '#f0f7ff',
// // //     borderRadius: 8,
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 5,
// // //     borderWidth: 1,
// // //     borderColor: '#d4e4ff',
// // //     alignSelf: 'flex-start',
// // //   },
// // //   businessCardContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   businessName: {
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //     color: colors.primary,
// // //     marginLeft: 6,
// // //   },
// // //   businessBadge: {
// // //     backgroundColor: colors.primary,
// // //     borderRadius: 4,
// // //     paddingHorizontal: 6,
// // //     paddingVertical: 1,
// // //     marginLeft: 8,
// // //   },
// // //   businessBadgeText: {
// // //     fontSize: 8,
// // //     color: colors.white,
// // //     fontWeight: '700',
// // //   },
// // //   searchContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: colors.lightGray,
// // //     borderRadius: 12,
// // //     paddingHorizontal: 12,
// // //     marginVertical: 12,
// // //     height: 48,
// // //   },
// // //   searchIcon: {
// // //     marginRight: 8,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     fontSize: 14,
// // //     color: colors.text,
// // //   },
// // //   offersSection: {
// // //     marginVertical: 8,
// // //   },
// // //   offersList: {
// // //     paddingVertical: 4,
// // //   },
// // //   offerCard: {
// // //     backgroundColor: colors.primary,
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginRight: 12,
// // //     width: width * 0.6,
// // //     height: 80,
// // //     justifyContent: 'center',
// // //   },
// // //   offerTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: colors.white,
// // //   },
// // //   offerDescription: {
// // //     fontSize: 12,
// // //     color: colors.white,
// // //     opacity: 0.9,
// // //     marginTop: 4,
// // //   },
// // //   categoriesSection: {
// // //     marginVertical: 8,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: colors.text,
// // //     marginBottom: 12,
// // //   },
// // //   categoriesList: {
// // //     paddingVertical: 4,
// // //   },
// // //   restaurantsSection: {
// // //     marginVertical: 8,
// // //     paddingBottom: 80,
// // //   },
// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   seeAll: {
// // //     color: colors.primary,
// // //     fontWeight: '500',
// // //     fontSize: 14,
// // //   },
// // //   offerCard2: {
// // //     backgroundColor: colors.lightGray,
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 12,
// // //   },
// // //   productName: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: colors.text,
// // //   },
// // //   productCategory: {
// // //     fontSize: 13,
// // //     color: colors.textLight,
// // //     marginTop: 2,
// // //   },
// // //   productPrice: {
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //     color: colors.primary,
// // //     marginTop: 6,
// // //   },
// // //   productStock: {
// // //     fontSize: 12,
// // //     color: colors.textLight,
// // //     marginTop: 2,
// // //   },
// // // });
// // // delivery-app/src/screens/main/HomeScreen.tsx
// // import React, { useState, useEffect, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TextInput,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   Dimensions,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { colors } from '../../constants/colors';
// // import { categories, offers } from '../../constants/dummyData';
// // import axios from 'axios';
// // import { API_URL } from '@env';
// // import CategoryItem from '../../components/home/CategoryItem';
// // import { Category, Offer } from '../../types';
// // import { AuthContext } from '../../context/AuthContext';

// // const { width } = Dimensions.get('window');

// // export default function HomeScreen({ navigation }: any) {
// //   const [searchText, setSearchText] = useState<string>('');
// //   const [products, setProducts] = useState<any[]>([]);
// //   const { user } = useContext(AuthContext);

// //   useEffect(() => {
// //     axios.get(`${API_URL}/public/products`)
// //       .then((res) => setProducts(res.data))
// //       .catch((err) => console.error('Failed to load products:', err));
// //   }, []);

// //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// //   const renderOffer = ({ item }: { item: Offer }) => (
// //     <View style={styles.offerCard}>
// //       <Text style={styles.offerTitle}>{item.title}</Text>
// //       <Text style={styles.offerDescription}>{item.description}</Text>
// //     </View>
// //   );

// //   // ✅ Get business name from user (fetched from businesses table)
// //   const businessName = user?.business_name || 'QuickBite';
// //   const plan = user?.business_plan || 'FREE';
// //   const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

// //   console.log('🏪 Business Name from DB:', businessName);

// //   return (
// //     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View>
// //           <Text style={styles.locationLabel}>📍 Home</Text>
// //           <Text style={styles.location}>Sector 1, HSR Layout</Text>
          
// //           {/* ✅ Business Card - Shows business name from businesses table */}
// //           <View style={styles.businessCard}>
// //             <View style={styles.businessCardContent}>
// //               <Icon name="storefront-outline" size={16} color={colors.primary} />
// //               <Text style={styles.businessName}>{displayName}</Text>
// //               <View style={styles.businessBadge}>
// //                 <Text style={styles.businessBadgeText}>{plan}</Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>
// //         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// //           <Icon name="person-circle-outline" size={40} color={colors.primary} />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search for restaurant, item or more"
// //           value={searchText}
// //           onChangeText={setSearchText}
// //           onFocus={() => navigation.navigate('Search')}
// //         />
// //       </View>

// //       {/* Offers Section */}
// //       <FlatList
// //         data={offers}
// //         renderItem={renderOffer}
// //         keyExtractor={(item) => item.id}
// //         horizontal
// //         showsHorizontalScrollIndicator={false}
// //         contentContainerStyle={styles.offersList}
// //         style={styles.offersSection}
// //       />

// //       {/* Quick Categories */}
// //       <View style={styles.categoriesSection}>
// //         <Text style={styles.sectionTitle}>What's on your mind?</Text>
// //         <FlatList
// //           data={categories}
// //           renderItem={renderCategory}
// //           keyExtractor={(item) => item.id}
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={styles.categoriesList}
// //         />
// //       </View>

// //       {/* Products */}
// //       <View style={styles.restaurantsSection}>
// //         <View style={styles.sectionHeader}>
// //           <Text style={styles.sectionTitle}>Available Products</Text>
// //         </View>
// //         {products.map((product: any) => (
// //           <View key={product.id} style={styles.offerCard2}>
// //             <Text style={styles.productName}>{product.name}</Text>
// //             <Text style={styles.productCategory}>{product.category}</Text>
// //             <Text style={styles.productPrice}>₹{product.selling_price}</Text>
// //             <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
// //           </View>
// //         ))}
// //       </View>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: colors.white,
// //     paddingHorizontal: 16,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //     paddingTop: 16,
// //     paddingBottom: 8,
// //   },
// //   locationLabel: {
// //     fontSize: 12,
// //     color: colors.textLight,
// //   },
// //   location: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: colors.text,
// //   },
// //   // ✅ Business Card - Shows business from businesses table
// //   businessCard: {
// //     marginTop: 6,
// //     backgroundColor: '#f0f7ff',
// //     borderRadius: 8,
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderWidth: 1,
// //     borderColor: '#d4e4ff',
// //     alignSelf: 'flex-start',
// //   },
// //   businessCardContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   businessName: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //     color: colors.primary,
// //     marginLeft: 6,
// //   },
// //   businessBadge: {
// //     backgroundColor: colors.primary,
// //     borderRadius: 4,
// //     paddingHorizontal: 6,
// //     paddingVertical: 1,
// //     marginLeft: 8,
// //   },
// //   businessBadgeText: {
// //     fontSize: 8,
// //     color: colors.white,
// //     fontWeight: '700',
// //   },
// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: colors.lightGray,
// //     borderRadius: 12,
// //     paddingHorizontal: 12,
// //     marginVertical: 12,
// //     height: 48,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: colors.text,
// //   },
// //   offersSection: {
// //     marginVertical: 8,
// //   },
// //   offersList: {
// //     paddingVertical: 4,
// //   },
// //   offerCard: {
// //     backgroundColor: colors.primary,
// //     borderRadius: 12,
// //     padding: 16,
// //     marginRight: 12,
// //     width: width * 0.6,
// //     height: 80,
// //     justifyContent: 'center',
// //   },
// //   offerTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: colors.white,
// //   },
// //   offerDescription: {
// //     fontSize: 12,
// //     color: colors.white,
// //     opacity: 0.9,
// //     marginTop: 4,
// //   },
// //   categoriesSection: {
// //     marginVertical: 8,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: colors.text,
// //     marginBottom: 12,
// //   },
// //   categoriesList: {
// //     paddingVertical: 4,
// //   },
// //   restaurantsSection: {
// //     marginVertical: 8,
// //     paddingBottom: 80,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },
// //   seeAll: {
// //     color: colors.primary,
// //     fontWeight: '500',
// //     fontSize: 14,
// //   },
// //   offerCard2: {
// //     backgroundColor: colors.lightGray,
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //   },
// //   productName: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: colors.text,
// //   },
// //   productCategory: {
// //     fontSize: 13,
// //     color: colors.textLight,
// //     marginTop: 2,
// //   },
// //   productPrice: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: colors.primary,
// //     marginTop: 6,
// //   },
// //   productStock: {
// //     fontSize: 12,
// //     color: colors.textLight,
// //     marginTop: 2,
// //   },
// // });
// // delivery-app/src/screens/main/HomeScreen.tsx
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { categories, offers } from '../../constants/dummyData';
// import axios from 'axios';
// import { API_URL } from '@env';
// import CategoryItem from '../../components/home/CategoryItem';
// import { Category, Offer } from '../../types';
// import { AuthContext } from '../../context/AuthContext';

// const { width } = Dimensions.get('window');

// export default function HomeScreen({ navigation }: any) {
//   const [searchText, setSearchText] = useState<string>('');
//   const [products, setProducts] = useState<any[]>([]);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     axios.get(`${API_URL}/public/products`)
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error('Failed to load products:', err));
//   }, []);

//   // ✅ Debug: Log user data
//   useEffect(() => {
//     console.log('🏪 HomeScreen - User:', user);
//     console.log('🏪 HomeScreen - Business Name:', user?.business_name);
//   }, [user]);

//   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

//   const renderOffer = ({ item }: { item: Offer }) => (
//     <View style={styles.offerCard}>
//       <Text style={styles.offerTitle}>{item.title}</Text>
//       <Text style={styles.offerDescription}>{item.description}</Text>
//     </View>
//   );

//   // ✅ Get business name from user
//   const businessName = user?.business_name || 'QuickBite';
//   const plan = user?.business_plan || 'FREE';
//   const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.locationLabel}>📍 Home</Text>
//           <Text style={styles.location}>Sector 1, HSR Layout</Text>
          
//           {/* ✅ Business Card */}
//           <View style={styles.businessCard}>
//             <View style={styles.businessCardContent}>
//               <Icon name="storefront-outline" size={16} color={colors.primary} />
//               <Text style={styles.businessName}>{displayName}</Text>
//               <View style={styles.businessBadge}>
//                 <Text style={styles.businessBadgeText}>{plan}</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//           <Icon name="person-circle-outline" size={40} color={colors.primary} />
//         </TouchableOpacity>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for restaurant, item or more"
//           value={searchText}
//           onChangeText={setSearchText}
//           onFocus={() => navigation.navigate('Search')}
//         />
//       </View>

//       {/* Offers Section */}
//       <FlatList
//         data={offers}
//         renderItem={renderOffer}
//         keyExtractor={(item) => item.id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.offersList}
//         style={styles.offersSection}
//       />

//       {/* Quick Categories */}
//       <View style={styles.categoriesSection}>
//         <Text style={styles.sectionTitle}>What's on your mind?</Text>
//         <FlatList
//           data={categories}
//           renderItem={renderCategory}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoriesList}
//         />
//       </View>

//       {/* Products */}
//       <View style={styles.restaurantsSection}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Available Products</Text>
//         </View>
//         {products.map((product: any) => (
//           <View key={product.id} style={styles.offerCard2}>
//             <Text style={styles.productName}>{product.name}</Text>
//             <Text style={styles.productCategory}>{product.category}</Text>
//             <Text style={styles.productPrice}>₹{product.selling_price}</Text>
//             <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//     paddingHorizontal: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     paddingTop: 16,
//     paddingBottom: 8,
//   },
//   locationLabel: {
//     fontSize: 12,
//     color: colors.textLight,
//   },
//   location: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//   },
//   businessCard: {
//     marginTop: 6,
//     backgroundColor: '#f0f7ff',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderWidth: 1,
//     borderColor: '#d4e4ff',
//     alignSelf: 'flex-start',
//   },
//   businessCardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   businessName: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: colors.primary,
//     marginLeft: 6,
//   },
//   businessBadge: {
//     backgroundColor: colors.primary,
//     borderRadius: 4,
//     paddingHorizontal: 6,
//     paddingVertical: 1,
//     marginLeft: 8,
//   },
//   businessBadgeText: {
//     fontSize: 8,
//     color: colors.white,
//     fontWeight: '700',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.lightGray,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     marginVertical: 12,
//     height: 48,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: colors.text,
//   },
//   offersSection: {
//     marginVertical: 8,
//   },
//   offersList: {
//     paddingVertical: 4,
//   },
//   offerCard: {
//     backgroundColor: colors.primary,
//     borderRadius: 12,
//     padding: 16,
//     marginRight: 12,
//     width: width * 0.6,
//     height: 80,
//     justifyContent: 'center',
//   },
//   offerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: colors.white,
//   },
//   offerDescription: {
//     fontSize: 12,
//     color: colors.white,
//     opacity: 0.9,
//     marginTop: 4,
//   },
//   categoriesSection: {
//     marginVertical: 8,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//     marginBottom: 12,
//   },
//   categoriesList: {
//     paddingVertical: 4,
//   },
//   restaurantsSection: {
//     marginVertical: 8,
//     paddingBottom: 80,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   seeAll: {
//     color: colors.primary,
//     fontWeight: '500',
//     fontSize: 14,
//   },
//   offerCard2: {
//     backgroundColor: colors.lightGray,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: colors.text,
//   },
//   productCategory: {
//     fontSize: 13,
//     color: colors.textLight,
//     marginTop: 2,
//   },
//   productPrice: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: colors.primary,
//     marginTop: 6,
//   },
//   productStock: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginTop: 2,
//   },
// });
// delivery-app/src/screens/main/HomeScreen.tsx
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { categories, offers } from '../../constants/dummyData';
import axios from 'axios';
import { API_URL } from '@env';
import CategoryItem from '../../components/home/CategoryItem';
import { Category, Offer } from '../../types';
import { AuthContext } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`${API_URL}/public/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products:', err));
  }, []);

  useEffect(() => {
    console.log('========================================');
    console.log('🏪 USER OBJECT:', user);
    console.log('🏪 BUSINESS NAME:', user?.business_name);
    console.log('========================================');
  }, [user]);

  const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

  const renderOffer = ({ item }: { item: Offer }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>{item.description}</Text>
    </View>
  );

  // ✅ Get business name from user
  const businessName = user?.business_name || 'No Business Found';
  const plan = user?.business_plan || 'FREE';
  const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>📍 Home</Text>
          <Text style={styles.location}>Sector 1, HSR Layout</Text>
          
          {/* ✅ Business Card - Shows the latest business from database */}
          <View style={styles.businessCard}>
            <View style={styles.businessCardContent}>
              <Icon name="business-outline" size={16} color={colors.primary} />
              <Text style={styles.businessName}>{displayName}</Text>
              {user?.business_name && user.business_name !== 'No Business Found' && (
                <View style={styles.businessBadge}>
                  <Text style={styles.businessBadgeText}>{plan}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-circle-outline" size={40} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurant, item or more"
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => navigation.navigate('Search')}
        />
      </View>

      {/* Offers Section */}
      <FlatList
        data={offers}
        renderItem={renderOffer}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.offersList}
        style={styles.offersSection}
      />

      {/* Quick Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>What's on your mind?</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Products */}
      <View style={styles.restaurantsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Products</Text>
        </View>
        {products.map((product: any) => (
          <View key={product.id} style={styles.offerCard2}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            <Text style={styles.productPrice}>₹{product.selling_price}</Text>
            <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

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
  offersSection: {
    marginVertical: 8,
  },
  offersList: {
    paddingVertical: 4,
  },
  offerCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: width * 0.6,
    height: 80,
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  offerDescription: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  categoriesSection: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoriesList: {
    paddingVertical: 4,
  },
  restaurantsSection: {
    marginVertical: 8,
    paddingBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  offerCard2: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  productCategory: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 6,
  },
  productStock: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
});