// // // // // // // // // import React, { useState, useContext } from 'react';
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   ScrollView,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   Image,
// // // // // // // // //   FlatList,
// // // // // // // // //   Alert,
// // // // // // // // // } from 'react-native';
// // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // import { colors } from '../../constants/colors';
// // // // // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // // // // import { menuItems } from '../../constants/dummyData';
// // // // // // // // // import { Restaurant, MenuItem } from '../../types';

// // // // // // // // // export default function RestaurantDetailScreen({ route, navigation }: any) {
// // // // // // // // //   const { restaurant } = route.params || {};
// // // // // // // // //   const { addToCart } = useContext(CartContext);
// // // // // // // // //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// // // // // // // // //   const categories: string[] = ['Recommended', 'Swiggy Special', 'Quick Bites', 'Soups', 'Starters', 'Main Course'];

// // // // // // // // //   const restaurantData: Restaurant = restaurant || {
// // // // // // // // //     id: '1',
// // // // // // // // //     name: 'Gourmand\'s Delight',
// // // // // // // // //     rating: 4.2,
// // // // // // // // //     deliveryTime: '27 mins',
// // // // // // // // //     cuisine: 'North Indian, Chinese',
// // // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // // //     costForTwo: '₹700 for two',
// // // // // // // // //     address: 'Sector 1, HSR Layout',
// // // // // // // // //     isVeg: false,
// // // // // // // // //   };

// // // // // // // // //   const menu: MenuItem[] = menuItems || [
// // // // // // // // //     {
// // // // // // // // //       id: '1',
// // // // // // // // //       name: 'Green Peas Masala',
// // // // // // // // //       price: 135,
// // // // // // // // //       rating: 4.0,
// // // // // // // // //       reviews: 100,
// // // // // // // // //       isBestSeller: false,
// // // // // // // // //       description: 'Green peas in rich gravy',
// // // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // // //       isVeg: true,
// // // // // // // // //       category: 'Main Course',
// // // // // // // // //     },
// // // // // // // // //     {
// // // // // // // // //       id: '2',
// // // // // // // // //       name: 'Paneer Butter Masala',
// // // // // // // // //       price: 166,
// // // // // // // // //       rating: 4.5,
// // // // // // // // //       reviews: 200,
// // // // // // // // //       isBestSeller: true,
// // // // // // // // //       description: 'Creamy paneer in rich tomato gravy',
// // // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // // //       isVeg: true,
// // // // // // // // //       category: 'Main Course',
// // // // // // // // //     },
// // // // // // // // //   ];

// // // // // // // // //   const handleAddToCart = (item: MenuItem): void => {
// // // // // // // // //     const cartItem = {
// // // // // // // // //       id: item.id,
// // // // // // // // //       name: item.name,
// // // // // // // // //       price: item.price,
// // // // // // // // //       quantity: 1,
// // // // // // // // //       image: item.image,
// // // // // // // // //       restaurantId: restaurantData.id,
// // // // // // // // //       restaurantName: restaurantData.name,
// // // // // // // // //     };
// // // // // // // // //     addToCart(cartItem, restaurantData);
// // // // // // // // //     Alert.alert('Added to Cart', `${item.name} added to your cart`);
// // // // // // // // //   };

// // // // // // // // //   const renderMenuItem = ({ item }: { item: MenuItem }) => (
// // // // // // // // //     <View style={styles.menuItem}>
// // // // // // // // //       <View style={styles.menuItemContent}>
// // // // // // // // //         <View style={styles.menuItemInfo}>
// // // // // // // // //           <Text style={styles.menuItemName}>{item.name}</Text>
// // // // // // // // //           <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// // // // // // // // //           <View style={styles.menuItemRating}>
// // // // // // // // //             <Icon name="star" size={14} color="#ffc107" />
// // // // // // // // //             <Text style={styles.ratingText}>{item.rating || 4.0}</Text>
// // // // // // // // //             {item.isBestSeller && (
// // // // // // // // //               <View style={styles.bestsellerBadge}>
// // // // // // // // //                 <Text style={styles.bestsellerText}>BESTSELLER</Text>
// // // // // // // // //               </View>
// // // // // // // // //             )}
// // // // // // // // //           </View>
// // // // // // // // //           {item.description && (
// // // // // // // // //             <Text style={styles.menuItemDescription} numberOfLines={2}>
// // // // // // // // //               {item.description}
// // // // // // // // //             </Text>
// // // // // // // // //           )}
// // // // // // // // //         </View>
// // // // // // // // //         <TouchableOpacity
// // // // // // // // //           style={styles.addButton}
// // // // // // // // //           onPress={() => handleAddToCart(item)}
// // // // // // // // //         >
// // // // // // // // //           <Text style={styles.addButtonText}>ADD</Text>
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //       </View>
// // // // // // // // //       <View style={styles.divider} />
// // // // // // // // //     </View>
// // // // // // // // //   );

// // // // // // // // //   const renderCategory = ({ item }: { item: string }) => (
// // // // // // // // //     <TouchableOpacity
// // // // // // // // //       style={[styles.categoryTab, selectedCategory === item && styles.activeCategoryTab]}
// // // // // // // // //       onPress={() => setSelectedCategory(item)}
// // // // // // // // //     >
// // // // // // // // //       <Text style={[styles.categoryTabText, selectedCategory === item && styles.activeCategoryTabText]}>
// // // // // // // // //         {item}
// // // // // // // // //       </Text>
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // //   );

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // //         {/* Header Image */}
// // // // // // // // //         <View style={styles.imageContainer}>
// // // // // // // // //           <Image
// // // // // // // // //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// // // // // // // // //             style={styles.restaurantImage}
// // // // // // // // //           />
// // // // // // // // //           <TouchableOpacity
// // // // // // // // //             style={styles.backButton}
// // // // // // // // //             onPress={() => navigation.goBack()}
// // // // // // // // //           >
// // // // // // // // //             <Icon name="arrow-back" size={24} color={colors.white} />
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //           <TouchableOpacity style={styles.favoriteButton}>
// // // // // // // // //             <Icon name="heart-outline" size={24} color={colors.white} />
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Restaurant Info */}
// // // // // // // // //         <View style={styles.infoContainer}>
// // // // // // // // //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
// // // // // // // // //           <View style={styles.ratingContainer}>
// // // // // // // // //             <View style={styles.ratingBadge}>
// // // // // // // // //               <Icon name="star" size={14} color={colors.white} />
// // // // // // // // //               <Text style={styles.ratingText}>{restaurantData.rating || 4.2}</Text>
// // // // // // // // //             </View>
// // // // // // // // //             <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// // // // // // // // //             <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Category Tabs */}
// // // // // // // // //         <View style={styles.categoriesContainer}>
// // // // // // // // //           <FlatList
// // // // // // // // //             data={categories}
// // // // // // // // //             renderItem={renderCategory}
// // // // // // // // //             keyExtractor={(item) => item}
// // // // // // // // //             horizontal
// // // // // // // // //             showsHorizontalScrollIndicator={false}
// // // // // // // // //             contentContainerStyle={styles.categoriesList}
// // // // // // // // //           />
// // // // // // // // //         </View>

// // // // // // // // //         {/* Menu Items */}
// // // // // // // // //         <View style={styles.menuContainer}>
// // // // // // // // //           <Text style={styles.menuTitle}>{selectedCategory}</Text>
// // // // // // // // //           <FlatList
// // // // // // // // //             data={menu}
// // // // // // // // //             renderItem={renderMenuItem}
// // // // // // // // //             keyExtractor={(item) => item.id}
// // // // // // // // //             scrollEnabled={false}
// // // // // // // // //           />
// // // // // // // // //         </View>
// // // // // // // // //       </ScrollView>
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //   },
// // // // // // // // //   imageContainer: {
// // // // // // // // //     position: 'relative',
// // // // // // // // //     height: 220,
// // // // // // // // //   },
// // // // // // // // //   restaurantImage: {
// // // // // // // // //     width: '100%',
// // // // // // // // //     height: '100%',
// // // // // // // // //   },
// // // // // // // // //   backButton: {
// // // // // // // // //     position: 'absolute',
// // // // // // // // //     top: 40,
// // // // // // // // //     left: 16,
// // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // //     borderRadius: 20,
// // // // // // // // //     padding: 8,
// // // // // // // // //   },
// // // // // // // // //   favoriteButton: {
// // // // // // // // //     position: 'absolute',
// // // // // // // // //     top: 40,
// // // // // // // // //     right: 16,
// // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // //     borderRadius: 20,
// // // // // // // // //     padding: 8,
// // // // // // // // //   },
// // // // // // // // //   infoContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //   },
// // // // // // // // //   restaurantName: {
// // // // // // // // //     fontSize: 22,
// // // // // // // // //     fontWeight: '700',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   ratingContainer: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   ratingBadge: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     backgroundColor: colors.success,
// // // // // // // // //     paddingHorizontal: 8,
// // // // // // // // //     paddingVertical: 2,
// // // // // // // // //     borderRadius: 4,
// // // // // // // // //   },
// // // // // // // // //   ratingText: {
// // // // // // // // //     color: colors.white,
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     marginLeft: 4,
// // // // // // // // //   },
// // // // // // // // //   deliveryTime: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },
// // // // // // // // //   costForTwo: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },
// // // // // // // // //   cuisine: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 6,
// // // // // // // // //   },
// // // // // // // // //   categoriesContainer: {
// // // // // // // // //     borderTopWidth: 1,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderColor: colors.border,
// // // // // // // // //     paddingVertical: 8,
// // // // // // // // //   },
// // // // // // // // //   categoriesList: {
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //   },
// // // // // // // // //   categoryTab: {
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingVertical: 8,
// // // // // // // // //     marginRight: 8,
// // // // // // // // //     borderRadius: 20,
// // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // //   },
// // // // // // // // //   activeCategoryTab: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //   },
// // // // // // // // //   categoryTabText: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   activeCategoryTabText: {
// // // // // // // // //     color: colors.white,
// // // // // // // // //   },
// // // // // // // // //   menuContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     paddingBottom: 80,
// // // // // // // // //   },
// // // // // // // // //   menuTitle: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   menuItem: {
// // // // // // // // //     marginBottom: 4,
// // // // // // // // //   },
// // // // // // // // //   menuItemContent: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //   },
// // // // // // // // //   menuItemInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },
// // // // // // // // //   menuItemName: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   menuItemPrice: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.text,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   menuItemRating: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   bestsellerBadge: {
// // // // // // // // //     backgroundColor: '#fff8e1',
// // // // // // // // //     paddingHorizontal: 8,
// // // // // // // // //     paddingVertical: 2,
// // // // // // // // //     borderRadius: 4,
// // // // // // // // //     marginLeft: 8,
// // // // // // // // //   },
// // // // // // // // //   bestsellerText: {
// // // // // // // // //     fontSize: 10,
// // // // // // // // //     color: '#ff6f00',
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   menuItemDescription: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   addButton: {
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: colors.primary,
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingVertical: 6,
// // // // // // // // //     borderRadius: 6,
// // // // // // // // //   },
// // // // // // // // //   addButtonText: {
// // // // // // // // //     color: colors.primary,
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   divider: {
// // // // // // // // //     height: 1,
// // // // // // // // //     backgroundColor: colors.border,
// // // // // // // // //   },
// // // // // // // // // });
// // // // // // // // import React, { useState, useContext } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   ScrollView,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   StyleSheet,
// // // // // // // //   Image,
// // // // // // // //   FlatList,
// // // // // // // //   Alert,
// // // // // // // //   SafeAreaView,
// // // // // // // //   StatusBar,
// // // // // // // // } from 'react-native';
// // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // import { colors } from '../../constants/colors';
// // // // // // // // import { CartContext } from '../../context/CartContext';

// // // // // // // // // Menu items data organized by category
// // // // // // // // const MENU_DATA = {
// // // // // // // //   'Recommended': [
// // // // // // // //     {
// // // // // // // //       id: 1,
// // // // // // // //       name: 'Korean BBQ Chicken Burger',
// // // // // // // //       price: 330,
// // // // // // // //       rating: 4.5,
// // // // // // // //       reviews: 5000,
// // // // // // // //       description: 'Fried chicken, Asian coleslaw with sweet-spicy Korean BBQ glaze',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Burgers',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 2,
// // // // // // // //       name: 'Paneer Butter Masala',
// // // // // // // //       price: 185,
// // // // // // // //       rating: 4.2,
// // // // // // // //       reviews: 1000,
// // // // // // // //       description: 'Creamy paneer in rich tomato gravy',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Main Course',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 3,
// // // // // // // //       name: 'Margherita Pizza',
// // // // // // // //       price: 369,
// // // // // // // //       rating: 4.3,
// // // // // // // //       reviews: 2500,
// // // // // // // //       description: 'Classic cheese pizza with tomato sauce',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Pizzas',
// // // // // // // //     },
// // // // // // // //   ],
// // // // // // // //   'Swiggy Special': [
// // // // // // // //     {
// // // // // // // //       id: 4,
// // // // // // // //       name: 'Special Biryani Combo',
// // // // // // // //       price: 499,
// // // // // // // //       rating: 4.8,
// // // // // // // //       reviews: 3000,
// // // // // // // //       description: 'Hyderabadi biryani with raita and salan',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Biryani',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 5,
// // // // // // // //       name: 'Butter Chicken Feast',
// // // // // // // //       price: 599,
// // // // // // // //       rating: 4.7,
// // // // // // // //       reviews: 2000,
// // // // // // // //       description: 'Creamy butter chicken with naan and rice',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Main Course',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 6,
// // // // // // // //       name: 'Veg Thali Special',
// // // // // // // //       price: 349,
// // // // // // // //       rating: 4.6,
// // // // // // // //       reviews: 1500,
// // // // // // // //       description: 'Complete veg thali with dal, sabzi, roti, rice and dessert',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Thali',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 7,
// // // // // // // //       name: 'Chicken Lollipop',
// // // // // // // //       price: 299,
// // // // // // // //       rating: 4.5,
// // // // // // // //       reviews: 1800,
// // // // // // // //       description: 'Crispy fried chicken lollipop with schezwan sauce',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Starters',
// // // // // // // //     },
// // // // // // // //   ],
// // // // // // // //   'Quick Bites': [
// // // // // // // //     {
// // // // // // // //       id: 8,
// // // // // // // //       name: 'Veg Burger',
// // // // // // // //       price: 149,
// // // // // // // //       rating: 4.0,
// // // // // // // //       reviews: 800,
// // // // // // // //       description: 'Grilled veg patty with lettuce and mayo',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Burgers',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 9,
// // // // // // // //       name: 'Chicken Wrap',
// // // // // // // //       price: 199,
// // // // // // // //       rating: 4.1,
// // // // // // // //       reviews: 900,
// // // // // // // //       description: 'Grilled chicken wrap with veggies and sauce',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Wraps',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 10,
// // // // // // // //       name: 'French Fries',
// // // // // // // //       price: 99,
// // // // // // // //       rating: 4.2,
// // // // // // // //       reviews: 1200,
// // // // // // // //       description: 'Crispy golden fries with ketchup',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Snacks',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 11,
// // // // // // // //       name: 'Paneer Tikka',
// // // // // // // //       price: 249,
// // // // // // // //       rating: 4.3,
// // // // // // // //       reviews: 700,
// // // // // // // //       description: 'Grilled paneer with bell peppers and onions',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Starters',
// // // // // // // //     },
// // // // // // // //   ],
// // // // // // // //   'Soups': [
// // // // // // // //     {
// // // // // // // //       id: 12,
// // // // // // // //       name: 'Tomato Soup',
// // // // // // // //       price: 129,
// // // // // // // //       rating: 4.0,
// // // // // // // //       reviews: 500,
// // // // // // // //       description: 'Creamy tomato soup with croutons',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Soups',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 13,
// // // // // // // //       name: 'Chicken Noodle Soup',
// // // // // // // //       price: 179,
// // // // // // // //       rating: 4.2,
// // // // // // // //       reviews: 600,
// // // // // // // //       description: 'Clear chicken soup with noodles and vegetables',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Soups',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 14,
// // // // // // // //       name: 'Sweet Corn Soup',
// // // // // // // //       price: 149,
// // // // // // // //       rating: 4.1,
// // // // // // // //       reviews: 450,
// // // // // // // //       description: 'Creamy sweet corn soup with vegetables',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Soups',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 15,
// // // // // // // //       name: 'Hot & Sour Soup',
// // // // // // // //       price: 169,
// // // // // // // //       rating: 4.3,
// // // // // // // //       reviews: 550,
// // // // // // // //       description: 'Spicy and sour soup with vegetables',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Soups',
// // // // // // // //     },
// // // // // // // //   ],
// // // // // // // //   'Starters': [
// // // // // // // //     {
// // // // // // // //       id: 16,
// // // // // // // //       name: 'Chicken 65',
// // // // // // // //       price: 299,
// // // // // // // //       rating: 4.4,
// // // // // // // //       reviews: 800,
// // // // // // // //       description: 'Spicy fried chicken with curry leaves',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Starters',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 17,
// // // // // // // //       name: 'Paneer Tikka',
// // // // // // // //       price: 249,
// // // // // // // //       rating: 4.3,
// // // // // // // //       reviews: 700,
// // // // // // // //       description: 'Grilled paneer with bell peppers',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Starters',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 18,
// // // // // // // //       name: 'Gobi Manchurian',
// // // // // // // //       price: 219,
// // // // // // // //       rating: 4.2,
// // // // // // // //       reviews: 600,
// // // // // // // //       description: 'Crispy cauliflower in manchurian sauce',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Starters',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 19,
// // // // // // // //       name: 'Spring Rolls',
// // // // // // // //       price: 189,
// // // // // // // //       rating: 4.0,
// // // // // // // //       reviews: 500,
// // // // // // // //       description: 'Crispy vegetable spring rolls with sweet chilli sauce',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Starters',
// // // // // // // //     },
// // // // // // // //   ],
// // // // // // // //   'Main Course': [
// // // // // // // //     {
// // // // // // // //       id: 20,
// // // // // // // //       name: 'Butter Chicken',
// // // // // // // //       price: 399,
// // // // // // // //       rating: 4.6,
// // // // // // // //       reviews: 1200,
// // // // // // // //       description: 'Tender chicken in creamy tomato gravy',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Main Course',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 21,
// // // // // // // //       name: 'Dal Makhani',
// // // // // // // //       price: 299,
// // // // // // // //       rating: 4.4,
// // // // // // // //       reviews: 900,
// // // // // // // //       description: 'Slow cooked black dal with butter and cream',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Main Course',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 22,
// // // // // // // //       name: 'Paneer Butter Masala',
// // // // // // // //       price: 329,
// // // // // // // //       rating: 4.5,
// // // // // // // //       reviews: 1000,
// // // // // // // //       description: 'Creamy paneer in rich tomato gravy',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Main Course',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 23,
// // // // // // // //       name: 'Chicken Biryani',
// // // // // // // //       price: 449,
// // // // // // // //       rating: 4.7,
// // // // // // // //       reviews: 1500,
// // // // // // // //       description: 'Fragrant basmati rice with spicy chicken',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: true,
// // // // // // // //       isVeg: false,
// // // // // // // //       category: 'Main Course',
// // // // // // // //     },
// // // // // // // //     {
// // // // // // // //       id: 24,
// // // // // // // //       name: 'Veg Biryani',
// // // // // // // //       price: 369,
// // // // // // // //       rating: 4.3,
// // // // // // // //       reviews: 800,
// // // // // // // //       description: 'Fragrant basmati rice with mixed vegetables',
// // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // //       isBestSeller: false,
// // // // // // // //       isVeg: true,
// // // // // // // //       category: 'Main Course',
// // // // // // // //     },
// // // // // // // //   ],
// // // // // // // // };

// // // // // // // // interface RestaurantDetailScreenProps {
// // // // // // // //   route: any;
// // // // // // // //   navigation: any;
// // // // // // // // }

// // // // // // // // const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
// // // // // // // //   const { restaurant } = route.params || {};
// // // // // // // //   const { addToCart } = useContext(CartContext);
// // // // // // // //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// // // // // // // //   const categories = ['Recommended', 'Swiggy Special', 'Quick Bites', 'Soups', 'Starters', 'Main Course'];

// // // // // // // //   const restaurantData = restaurant || {
// // // // // // // //     id: 1,
// // // // // // // //     name: 'Gourmand\'s Delight',
// // // // // // // //     rating: 4.2,
// // // // // // // //     deliveryTime: '27 mins',
// // // // // // // //     cuisine: 'North Indian, Chinese',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //     costForTwo: '₹700 for two',
// // // // // // // //     address: 'Sector 1, HSR Layout',
// // // // // // // //     isVeg: false,
// // // // // // // //   };

// // // // // // // //   // Get menu items for selected category
// // // // // // // //   const getMenuItems = () => {
// // // // // // // //     return MENU_DATA[selectedCategory as keyof typeof MENU_DATA] || [];
// // // // // // // //   };

// // // // // // // //   const handleAddToCart = (item: any) => {
// // // // // // // //     const cartItem = {
// // // // // // // //       id: item.id,
// // // // // // // //       name: item.name,
// // // // // // // //       price: item.price,
// // // // // // // //       quantity: 1,
// // // // // // // //       image: item.image,
// // // // // // // //       restaurantId: restaurantData.id,
// // // // // // // //       restaurantName: restaurantData.name,
// // // // // // // //     };
// // // // // // // //     addToCart(cartItem, restaurantData);
// // // // // // // //     Alert.alert('Added to Cart', `${item.name} added to your cart`);
// // // // // // // //   };

// // // // // // // //   const renderCategoryTab = ({ item }: { item: string }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       style={[
// // // // // // // //         styles.categoryTab,
// // // // // // // //         selectedCategory === item && styles.activeCategoryTab,
// // // // // // // //       ]}
// // // // // // // //       onPress={() => setSelectedCategory(item)}
// // // // // // // //     >
// // // // // // // //       <Text
// // // // // // // //         style={[
// // // // // // // //           styles.categoryTabText,
// // // // // // // //           selectedCategory === item && styles.activeCategoryTabText,
// // // // // // // //         ]}
// // // // // // // //       >
// // // // // // // //         {item}
// // // // // // // //       </Text>
// // // // // // // //       {selectedCategory === item && <View style={styles.activeIndicator} />}
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   const renderMenuItem = ({ item }: { item: any }) => (
// // // // // // // //     <View style={styles.menuItem}>
// // // // // // // //       <View style={styles.menuItemContent}>
// // // // // // // //         <View style={styles.menuItemInfo}>
// // // // // // // //           <View style={styles.menuItemHeader}>
// // // // // // // //             <Text style={styles.menuItemName}>{item.name}</Text>
// // // // // // // //             {item.isBestSeller && (
// // // // // // // //               <View style={styles.bestsellerBadge}>
// // // // // // // //                 <Icon name="star" size={12} color="#ff6f00" />
// // // // // // // //                 <Text style={styles.bestsellerText}>BESTSELLER</Text>
// // // // // // // //               </View>
// // // // // // // //             )}
// // // // // // // //           </View>
// // // // // // // //           <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// // // // // // // //           <View style={styles.menuItemRating}>
// // // // // // // //             <Icon name="star" size={14} color="#ffc107" />
// // // // // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // // // //             <Text style={styles.reviewsText}>({item.reviews}+ reviews)</Text>
// // // // // // // //           </View>
// // // // // // // //           {item.description && (
// // // // // // // //             <Text style={styles.menuItemDescription} numberOfLines={2}>
// // // // // // // //               {item.description}
// // // // // // // //             </Text>
// // // // // // // //           )}
// // // // // // // //         </View>
// // // // // // // //         <TouchableOpacity
// // // // // // // //           style={styles.addButton}
// // // // // // // //           onPress={() => handleAddToCart(item)}
// // // // // // // //         >
// // // // // // // //           <Text style={styles.addButtonText}>ADD</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //       <View style={styles.divider} />
// // // // // // // //     </View>
// // // // // // // //   );

// // // // // // // //   const menuItems = getMenuItems();

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // //         {/* Header Image */}
// // // // // // // //         <View style={styles.imageContainer}>
// // // // // // // //           <Image
// // // // // // // //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// // // // // // // //             style={styles.restaurantImage}
// // // // // // // //           />
// // // // // // // //           <TouchableOpacity
// // // // // // // //             style={styles.backButton}
// // // // // // // //             onPress={() => navigation.goBack()}
// // // // // // // //           >
// // // // // // // //             <Icon name="arrow-back" size={24} color="#ffffff" />
// // // // // // // //           </TouchableOpacity>
// // // // // // // //           <TouchableOpacity style={styles.favoriteButton}>
// // // // // // // //             <Icon name="heart-outline" size={24} color="#ffffff" />
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </View>

// // // // // // // //         {/* Restaurant Info */}
// // // // // // // //         <View style={styles.infoContainer}>
// // // // // // // //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
// // // // // // // //           <View style={styles.ratingContainer}>
// // // // // // // //             <View style={styles.ratingBadge}>
// // // // // // // //               <Icon name="star" size={14} color="#ffffff" />
// // // // // // // //               <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
// // // // // // // //             </View>
// // // // // // // //             <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// // // // // // // //             <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// // // // // // // //           </View>
// // // // // // // //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
// // // // // // // //         </View>

// // // // // // // //         {/* Category Tabs */}
// // // // // // // //         <View style={styles.categoriesContainer}>
// // // // // // // //           <FlatList
// // // // // // // //             data={categories}
// // // // // // // //             renderItem={renderCategoryTab}
// // // // // // // //             keyExtractor={(item) => item}
// // // // // // // //             horizontal
// // // // // // // //             showsHorizontalScrollIndicator={false}
// // // // // // // //             contentContainerStyle={styles.categoriesList}
// // // // // // // //           />
// // // // // // // //         </View>

// // // // // // // //         {/* Menu Items */}
// // // // // // // //         <View style={styles.menuContainer}>
// // // // // // // //           <View style={styles.menuHeader}>
// // // // // // // //             <Text style={styles.menuTitle}>{selectedCategory}</Text>
// // // // // // // //             <Text style={styles.menuCount}>{menuItems.length} items</Text>
// // // // // // // //           </View>
          
// // // // // // // //           {menuItems.length > 0 ? (
// // // // // // // //             <FlatList
// // // // // // // //               data={menuItems}
// // // // // // // //               renderItem={renderMenuItem}
// // // // // // // //               keyExtractor={(item) => item.id.toString()}
// // // // // // // //               scrollEnabled={false}
// // // // // // // //             />
// // // // // // // //           ) : (
// // // // // // // //             <View style={styles.emptyContainer}>
// // // // // // // //               <Icon name="restaurant-outline" size={60} color="#ccc" />
// // // // // // // //               <Text style={styles.emptyText}>No items in this category</Text>
// // // // // // // //             </View>
// // // // // // // //           )}
// // // // // // // //         </View>

// // // // // // // //         {/* Footer Spacing */}
// // // // // // // //         <View style={styles.footerSpacing} />
// // // // // // // //       </ScrollView>
// // // // // // // //     </SafeAreaView>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //   },
// // // // // // // //   imageContainer: {
// // // // // // // //     position: 'relative',
// // // // // // // //     height: 220,
// // // // // // // //   },
// // // // // // // //   restaurantImage: {
// // // // // // // //     width: '100%',
// // // // // // // //     height: '100%',
// // // // // // // //   },
// // // // // // // //   backButton: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     top: 12,
// // // // // // // //     left: 16,
// // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // //     borderRadius: 20,
// // // // // // // //     padding: 8,
// // // // // // // //   },
// // // // // // // //   favoriteButton: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     top: 12,
// // // // // // // //     right: 16,
// // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // //     borderRadius: 20,
// // // // // // // //     padding: 8,
// // // // // // // //   },
// // // // // // // //   infoContainer: {
// // // // // // // //     padding: 16,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   restaurantName: {
// // // // // // // //     fontSize: 22,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   ratingContainer: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   ratingBadge: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#28a745',
// // // // // // // //     paddingHorizontal: 8,
// // // // // // // //     paddingVertical: 2,
// // // // // // // //     borderRadius: 4,
// // // // // // // //   },
// // // // // // // //   ratingBadgeText: {
// // // // // // // //     color: '#ffffff',
// // // // // // // //     fontSize: 12,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     marginLeft: 4,
// // // // // // // //   },
// // // // // // // //   deliveryTime: {
// // // // // // // //     fontSize: 13,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginLeft: 12,
// // // // // // // //   },
// // // // // // // //   costForTwo: {
// // // // // // // //     fontSize: 13,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginLeft: 12,
// // // // // // // //   },
// // // // // // // //   cuisine: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 6,
// // // // // // // //   },
// // // // // // // //   categoriesContainer: {
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //   },
// // // // // // // //   categoriesList: {
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 8,
// // // // // // // //   },
// // // // // // // //   categoryTab: {
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     marginRight: 4,
// // // // // // // //     position: 'relative',
// // // // // // // //   },
// // // // // // // //   activeCategoryTab: {
// // // // // // // //     // Active styles handled by indicator
// // // // // // // //   },
// // // // // // // //   categoryTabText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     fontWeight: '500',
// // // // // // // //   },
// // // // // // // //   activeCategoryTabText: {
// // // // // // // //     color: '#fc8019',
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   activeIndicator: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     bottom: 0,
// // // // // // // //     left: 16,
// // // // // // // //     right: 16,
// // // // // // // //     height: 3,
// // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // //     borderRadius: 2,
// // // // // // // //   },
// // // // // // // //   menuContainer: {
// // // // // // // //     padding: 16,
// // // // // // // //   },
// // // // // // // //   menuHeader: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 16,
// // // // // // // //   },
// // // // // // // //   menuTitle: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   menuCount: {
// // // // // // // //     fontSize: 13,
// // // // // // // //     color: '#7e808c',
// // // // // // // //   },
// // // // // // // //   menuItem: {
// // // // // // // //     marginBottom: 4,
// // // // // // // //   },
// // // // // // // //   menuItemContent: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 12,
// // // // // // // //   },
// // // // // // // //   menuItemInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //     marginRight: 12,
// // // // // // // //   },
// // // // // // // //   menuItemHeader: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     flexWrap: 'wrap',
// // // // // // // //   },
// // // // // // // //   menuItemName: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   bestsellerBadge: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#fff8e1',
// // // // // // // //     paddingHorizontal: 8,
// // // // // // // //     paddingVertical: 2,
// // // // // // // //     borderRadius: 4,
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },
// // // // // // // //   bestsellerText: {
// // // // // // // //     fontSize: 10,
// // // // // // // //     color: '#ff6f00',
// // // // // // // //     fontWeight: '600',
// // // // // // // //     marginLeft: 4,
// // // // // // // //   },
// // // // // // // //   menuItemPrice: {
// // // // // // // //     fontSize: 15,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   menuItemRating: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   ratingText: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginLeft: 4,
// // // // // // // //   },
// // // // // // // //   reviewsText: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginLeft: 4,
// // // // // // // //   },
// // // // // // // //   menuItemDescription: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 4,
// // // // // // // //     lineHeight: 16,
// // // // // // // //   },
// // // // // // // //   addButton: {
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#fc8019',
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 6,
// // // // // // // //     borderRadius: 6,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //   },
// // // // // // // //   addButtonText: {
// // // // // // // //     color: '#fc8019',
// // // // // // // //     fontSize: 12,
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   divider: {
// // // // // // // //     height: 1,
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   emptyContainer: {
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     paddingVertical: 40,
// // // // // // // //   },
// // // // // // // //   emptyText: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 12,
// // // // // // // //   },
// // // // // // // //   footerSpacing: {
// // // // // // // //     height: 80,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // // export default RestaurantDetailScreen;
// // // // // // // import React, { useState, useContext } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   ScrollView,
// // // // // // //   TouchableOpacity,
// // // // // // //   StyleSheet,
// // // // // // //   Image,
// // // // // // //   FlatList,
// // // // // // //   Alert,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // // } from 'react-native';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // // Menu items data organized by restaurant
// // // // // // // const RESTAURANT_MENUS: Record<string, any[]> = {
// // // // // // //   'Pizza Hut': [
// // // // // // //     { id: 1, name: 'Margherita Pizza', price: 369, rating: 4.3, description: 'Classic cheese pizza with tomato sauce', isBestSeller: true, isVeg: true },
// // // // // // //     { id: 2, name: 'Pepperoni Pizza', price: 399, rating: 4.5, description: 'Pepperoni with mozzarella cheese', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 3, name: 'Veggie Supreme', price: 429, rating: 4.2, description: 'Bell peppers, onions, mushrooms, olives', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 4, name: 'Chicken BBQ Pizza', price: 459, rating: 4.4, description: 'Grilled chicken with BBQ sauce', isBestSeller: false, isVeg: false },
// // // // // // //     { id: 5, name: 'Garlic Bread', price: 149, rating: 4.1, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 6, name: 'Pasta Alfredo', price: 299, rating: 4.0, description: 'Creamy pasta with vegetables', isBestSeller: false, isVeg: true },
// // // // // // //   ],
// // // // // // //   'Chinese Wok': [
// // // // // // //     { id: 7, name: 'Chicken Noodles', price: 299, rating: 4.2, description: 'Stir-fried noodles with chicken', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 8, name: 'Veg Fried Rice', price: 249, rating: 4.1, description: 'Fried rice with mixed vegetables', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 9, name: 'Manchurian', price: 279, rating: 4.3, description: 'Crispy balls in manchurian sauce', isBestSeller: true, isVeg: true },
// // // // // // //     { id: 10, name: 'Chilli Chicken', price: 329, rating: 4.4, description: 'Spicy chicken with bell peppers', isBestSeller: false, isVeg: false },
// // // // // // //     { id: 11, name: 'Spring Rolls', price: 199, rating: 4.0, description: 'Crispy vegetable spring rolls', isBestSeller: false, isVeg: true },
// // // // // // //   ],
// // // // // // //   'UBQ by Barbeque Nation': [
// // // // // // //     { id: 12, name: 'Chicken Biryani', price: 449, rating: 4.7, description: 'Fragrant basmati rice with spicy chicken', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 13, name: 'Veg Biryani', price: 369, rating: 4.4, description: 'Fragrant basmati rice with vegetables', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 14, name: 'Tandoori Chicken', price: 399, rating: 4.6, description: 'Grilled chicken in tandoori spices', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 15, name: 'Paneer Tikka', price: 349, rating: 4.3, description: 'Grilled paneer with bell peppers', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 16, name: 'Mutton Biryani', price: 549, rating: 4.8, description: 'Fragrant basmati rice with tender mutton', isBestSeller: true, isVeg: false },
// // // // // // //   ],
// // // // // // //   'Barbeque Nation': [
// // // // // // //     { id: 17, name: 'Chicken Tikka', price: 399, rating: 4.5, description: 'Grilled chicken tikka', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 18, name: 'Veg Platter', price: 349, rating: 4.2, description: 'Assorted grilled vegetables', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 19, name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false },
// // // // // // //     { id: 20, name: 'Dal Makhani', price: 299, rating: 4.1, description: 'Slow cooked black dal', isBestSeller: false, isVeg: true },
// // // // // // //   ],
// // // // // // //   'McDonalds': [
// // // // // // //     { id: 21, name: 'Big Mac', price: 299, rating: 4.5, description: 'Classic double cheeseburger', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 22, name: 'McChicken', price: 249, rating: 4.3, description: 'Crispy chicken burger', isBestSeller: false, isVeg: false },
// // // // // // //     { id: 23, name: 'Veg Burger', price: 199, rating: 4.1, description: 'Grilled veg patty with lettuce', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 24, name: 'French Fries', price: 99, rating: 4.2, description: 'Crispy golden fries', isBestSeller: true, isVeg: true },
// // // // // // //     { id: 25, name: 'McFlurry', price: 149, rating: 4.0, description: 'Ice cream with toppings', isBestSeller: false, isVeg: true },
// // // // // // //   ],
// // // // // // //   'Burger King': [
// // // // // // //     { id: 26, name: 'Whopper', price: 349, rating: 4.6, description: 'Flame-grilled beef burger', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 27, name: 'Chicken Whopper', price: 329, rating: 4.4, description: 'Flame-grilled chicken burger', isBestSeller: false, isVeg: false },
// // // // // // //     { id: 28, name: 'Veg Whopper', price: 279, rating: 4.2, description: 'Flame-grilled veg burger', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 29, name: 'Onion Rings', price: 129, rating: 4.1, description: 'Crispy onion rings', isBestSeller: false, isVeg: true },
// // // // // // //   ],
// // // // // // //   'KFC': [
// // // // // // //     { id: 30, name: 'Chicken Bucket', price: 599, rating: 4.5, description: '12 pieces of crispy chicken', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 31, name: 'Zinger Burger', price: 299, rating: 4.4, description: 'Crispy chicken burger', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 32, name: 'Popcorn Chicken', price: 249, rating: 4.3, description: 'Bite-sized crispy chicken', isBestSeller: false, isVeg: false },
// // // // // // //     { id: 33, name: 'Veg Burger', price: 199, rating: 4.0, description: 'Veg patty with lettuce', isBestSeller: false, isVeg: true },
// // // // // // //   ],
// // // // // // //   'Domino\'s Pizza': [
// // // // // // //     { id: 34, name: 'Margherita', price: 349, rating: 4.2, description: 'Classic cheese pizza', isBestSeller: true, isVeg: true },
// // // // // // //     { id: 35, name: 'Pepperoni', price: 399, rating: 4.4, description: 'Pepperoni with cheese', isBestSeller: true, isVeg: false },
// // // // // // //     { id: 36, name: 'Farmhouse', price: 429, rating: 4.3, description: 'Fresh vegetables with cheese', isBestSeller: false, isVeg: true },
// // // // // // //     { id: 37, name: 'Chicken Dominator', price: 499, rating: 4.6, description: 'Chicken with cheese', isBestSeller: false, isVeg: false },
// // // // // // //     { id: 38, name: 'Garlic Bread', price: 129, rating: 4.0, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true },
// // // // // // //   ],
// // // // // // // };

// // // // // // // interface RestaurantDetailScreenProps {
// // // // // // //   route: any;
// // // // // // //   navigation: any;
// // // // // // // }

// // // // // // // const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
// // // // // // //   const { restaurant } = route.params || {};
// // // // // // //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// // // // // // //   const restaurantData = restaurant || {
// // // // // // //     id: 1,
// // // // // // //     name: 'Pizza Hut',
// // // // // // //     rating: 4.0,
// // // // // // //     deliveryTime: '30-35 mins',
// // // // // // //     cuisine: 'Pizzas',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     costForTwo: '₹800 for two',
// // // // // // //     address: 'Sector 1, HSR Layout',
// // // // // // //     isVeg: false,
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //   };

// // // // // // //   // Get menu items for this restaurant
// // // // // // //   const getMenuItems = () => {
// // // // // // //     return RESTAURANT_MENUS[restaurantData.name] || RESTAURANT_MENUS['Pizza Hut'] || [];
// // // // // // //   };

// // // // // // //   const menuItems = getMenuItems();

// // // // // // //   const handleAddToCart = (item: any) => {
// // // // // // //     Alert.alert('Added to Cart', `${item.name} added to your cart`);
// // // // // // //   };

// // // // // // //   const renderMenuItem = ({ item }: { item: any }) => (
// // // // // // //     <View style={styles.menuItem}>
// // // // // // //       <View style={styles.menuItemContent}>
// // // // // // //         <View style={styles.menuItemInfo}>
// // // // // // //           <View style={styles.menuItemHeader}>
// // // // // // //             <Text style={styles.menuItemName}>{item.name}</Text>
// // // // // // //             {item.isBestSeller && (
// // // // // // //               <View style={styles.bestsellerBadge}>
// // // // // // //                 <Icon name="star" size={12} color="#ff6f00" />
// // // // // // //                 <Text style={styles.bestsellerText}>BESTSELLER</Text>
// // // // // // //               </View>
// // // // // // //             )}
// // // // // // //           </View>
// // // // // // //           <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// // // // // // //           <View style={styles.menuItemRating}>
// // // // // // //             <Icon name="star" size={14} color="#ffc107" />
// // // // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // // //           </View>
// // // // // // //           {item.description && (
// // // // // // //             <Text style={styles.menuItemDescription} numberOfLines={2}>
// // // // // // //               {item.description}
// // // // // // //             </Text>
// // // // // // //           )}
// // // // // // //         </View>
// // // // // // //         <TouchableOpacity
// // // // // // //           style={styles.addButton}
// // // // // // //           onPress={() => handleAddToCart(item)}
// // // // // // //         >
// // // // // // //           <Text style={styles.addButtonText}>ADD</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //       <View style={styles.divider} />
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // //         {/* Header Image */}
// // // // // // //         <View style={styles.imageContainer}>
// // // // // // //           <Image
// // // // // // //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// // // // // // //             style={styles.restaurantImage}
// // // // // // //           />
// // // // // // //           <TouchableOpacity
// // // // // // //             style={styles.backButton}
// // // // // // //             onPress={() => navigation.goBack()}
// // // // // // //           >
// // // // // // //             <Icon name="arrow-back" size={24} color="#ffffff" />
// // // // // // //           </TouchableOpacity>
// // // // // // //           <TouchableOpacity style={styles.favoriteButton}>
// // // // // // //             <Icon name="heart-outline" size={24} color="#ffffff" />
// // // // // // //           </TouchableOpacity>
// // // // // // //         </View>

// // // // // // //         {/* Restaurant Info */}
// // // // // // //         <View style={styles.infoContainer}>
// // // // // // //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
// // // // // // //           <View style={styles.ratingContainer}>
// // // // // // //             <View style={styles.ratingBadge}>
// // // // // // //               <Icon name="star" size={14} color="#ffffff" />
// // // // // // //               <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
// // // // // // //             </View>
// // // // // // //             <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// // // // // // //             <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// // // // // // //           </View>
// // // // // // //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
// // // // // // //           {restaurantData.offer && (
// // // // // // //             <View style={styles.offerContainer}>
// // // // // // //               <Text style={styles.offerText}>🎯 {restaurantData.offer}</Text>
// // // // // // //             </View>
// // // // // // //           )}
// // // // // // //         </View>

// // // // // // //         {/* Menu Items */}
// // // // // // //         <View style={styles.menuContainer}>
// // // // // // //           <View style={styles.menuHeader}>
// // // // // // //             <Text style={styles.menuTitle}>Menu</Text>
// // // // // // //             <Text style={styles.menuCount}>{menuItems.length} items</Text>
// // // // // // //           </View>
          
// // // // // // //           {menuItems.length > 0 ? (
// // // // // // //             <FlatList
// // // // // // //               data={menuItems}
// // // // // // //               renderItem={renderMenuItem}
// // // // // // //               keyExtractor={(item) => item.id.toString()}
// // // // // // //               scrollEnabled={false}
// // // // // // //             />
// // // // // // //           ) : (
// // // // // // //             <View style={styles.emptyContainer}>
// // // // // // //               <Icon name="restaurant-outline" size={60} color="#ccc" />
// // // // // // //               <Text style={styles.emptyText}>No menu items available</Text>
// // // // // // //             </View>
// // // // // // //           )}
// // // // // // //         </View>

// // // // // // //         {/* Footer Spacing */}
// // // // // // //         <View style={styles.footerSpacing} />
// // // // // // //       </ScrollView>
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //   },
// // // // // // //   imageContainer: {
// // // // // // //     position: 'relative',
// // // // // // //     height: 220,
// // // // // // //   },
// // // // // // //   restaurantImage: {
// // // // // // //     width: '100%',
// // // // // // //     height: '100%',
// // // // // // //   },
// // // // // // //   backButton: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 12,
// // // // // // //     left: 16,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // //     borderRadius: 20,
// // // // // // //     padding: 8,
// // // // // // //   },
// // // // // // //   favoriteButton: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 12,
// // // // // // //     right: 16,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // //     borderRadius: 20,
// // // // // // //     padding: 8,
// // // // // // //   },
// // // // // // //   infoContainer: {
// // // // // // //     padding: 16,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   restaurantName: {
// // // // // // //     fontSize: 22,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   ratingContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   ratingBadge: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#28a745',
// // // // // // //     paddingHorizontal: 8,
// // // // // // //     paddingVertical: 2,
// // // // // // //     borderRadius: 4,
// // // // // // //   },
// // // // // // //   ratingBadgeText: {
// // // // // // //     color: '#ffffff',
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: '600',
// // // // // // //     marginLeft: 4,
// // // // // // //   },
// // // // // // //   deliveryTime: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginLeft: 12,
// // // // // // //   },
// // // // // // //   costForTwo: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginLeft: 12,
// // // // // // //   },
// // // // // // //   cuisine: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 6,
// // // // // // //   },
// // // // // // //   offerContainer: {
// // // // // // //     marginTop: 8,
// // // // // // //     backgroundColor: '#fff8e1',
// // // // // // //     padding: 8,
// // // // // // //     borderRadius: 6,
// // // // // // //   },
// // // // // // //   offerText: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: '#ff6f00',
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   menuContainer: {
// // // // // // //     padding: 16,
// // // // // // //   },
// // // // // // //   menuHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   menuTitle: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   menuCount: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: '#7e808c',
// // // // // // //   },
// // // // // // //   menuItem: {
// // // // // // //     marginBottom: 4,
// // // // // // //   },
// // // // // // //   menuItemContent: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 12,
// // // // // // //   },
// // // // // // //   menuItemInfo: {
// // // // // // //     flex: 1,
// // // // // // //     marginRight: 12,
// // // // // // //   },
// // // // // // //   menuItemHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     flexWrap: 'wrap',
// // // // // // //   },
// // // // // // //   menuItemName: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   bestsellerBadge: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#fff8e1',
// // // // // // //     paddingHorizontal: 8,
// // // // // // //     paddingVertical: 2,
// // // // // // //     borderRadius: 4,
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   bestsellerText: {
// // // // // // //     fontSize: 10,
// // // // // // //     color: '#ff6f00',
// // // // // // //     fontWeight: '600',
// // // // // // //     marginLeft: 4,
// // // // // // //   },
// // // // // // //   menuItemPrice: {
// // // // // // //     fontSize: 15,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   menuItemRating: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   ratingText: {
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginLeft: 4,
// // // // // // //   },
// // // // // // //   menuItemDescription: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 4,
// // // // // // //     lineHeight: 16,
// // // // // // //   },
// // // // // // //   addButton: {
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#fc8019',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 6,
// // // // // // //     borderRadius: 6,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //   },
// // // // // // //   addButtonText: {
// // // // // // //     color: '#fc8019',
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   divider: {
// // // // // // //     height: 1,
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   emptyContainer: {
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     paddingVertical: 40,
// // // // // // //   },
// // // // // // //   emptyText: {
// // // // // // //     fontSize: 16,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 12,
// // // // // // //   },
// // // // // // //   footerSpacing: {
// // // // // // //     height: 80,
// // // // // // //   },
// // // // // // // });

// // // // // // // export default RestaurantDetailScreen;
// // // // // // import React, { useState, useContext } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   StyleSheet,
// // // // // //   Image,
// // // // // //   FlatList,
// // // // // //   Alert,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // interface RestaurantDetailScreenProps {
// // // // // //   route: any;
// // // // // //   navigation: any;
// // // // // // }

// // // // // // // Menu items organized by restaurant with categories
// // // // // // const RESTAURANT_MENUS: Record<string, any> = {
// // // // // //   'Pizza Hut': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Pizzas', 'Sides', 'Beverages'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 1, name: 'Margherita Pizza', price: 369, rating: 4.3, description: 'Classic cheese pizza with tomato sauce', isBestSeller: true, isVeg: true },
// // // // // //         { id: 2, name: 'Pepperoni Pizza', price: 399, rating: 4.5, description: 'Pepperoni with mozzarella cheese', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 101, name: 'QuickBite Special Pizza', price: 499, rating: 4.8, description: 'Loaded with extra cheese and toppings', isBestSeller: true, isVeg: true },
// // // // // //         { id: 102, name: 'QuickBite Combo Meal', price: 599, rating: 4.7, description: 'Pizza, garlic bread and drink', isBestSeller: true, isVeg: false },
// // // // // //         { id: 103, name: 'QuickBite Burger', price: 349, rating: 4.6, description: 'Special burger with secret sauce', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 201, name: 'Today\'s Special Pizza', price: 429, rating: 4.4, description: 'Chef\'s special pizza of the day', isBestSeller: false, isVeg: true },
// // // // // //         { id: 202, name: 'Daily Combo Offer', price: 449, rating: 4.3, description: 'Pizza + Drink + Dessert', isBestSeller: false, isVeg: false },
// // // // // //         { id: 203, name: 'Weekend Special', price: 529, rating: 4.5, description: 'Large pizza with extra toppings', isBestSeller: true, isVeg: true },
// // // // // //       ],
// // // // // //       'Pizzas': [
// // // // // //         { id: 3, name: 'Veggie Supreme', price: 429, rating: 4.2, description: 'Bell peppers, onions, mushrooms, olives', isBestSeller: false, isVeg: true },
// // // // // //         { id: 4, name: 'Chicken BBQ Pizza', price: 459, rating: 4.4, description: 'Grilled chicken with BBQ sauce', isBestSeller: false, isVeg: false },
// // // // // //         { id: 5, name: 'Paneer Pizza', price: 439, rating: 4.3, description: 'Paneer with vegetables', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Sides': [
// // // // // //         { id: 6, name: 'Garlic Bread', price: 149, rating: 4.1, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true },
// // // // // //         { id: 7, name: 'Cheese Sticks', price: 179, rating: 4.2, description: 'Crispy cheese sticks', isBestSeller: false, isVeg: true },
// // // // // //         { id: 8, name: 'Chicken Wings', price: 249, rating: 4.3, description: 'Spicy chicken wings', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Beverages': [
// // // // // //         { id: 9, name: 'Soft Drink', price: 99, rating: 4.0, description: 'Coca-Cola, Pepsi, Sprite', isBestSeller: false, isVeg: true },
// // // // // //         { id: 10, name: 'Fresh Juice', price: 149, rating: 4.1, description: 'Fresh orange, apple, mango juice', isBestSeller: false, isVeg: true },
// // // // // //         { id: 11, name: 'Milkshake', price: 199, rating: 4.2, description: 'Chocolate, strawberry, vanilla', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // //   'Chinese Wok': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Noodles', 'Rice', 'Starters', 'Soups'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 12, name: 'Chicken Noodles', price: 299, rating: 4.2, description: 'Stir-fried noodles with chicken', isBestSeller: true, isVeg: false },
// // // // // //         { id: 13, name: 'Veg Fried Rice', price: 249, rating: 4.1, description: 'Fried rice with mixed vegetables', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 104, name: 'QuickBite Special Noodles', price: 399, rating: 4.7, description: 'Loaded with exotic vegetables and sauce', isBestSeller: true, isVeg: true },
// // // // // //         { id: 105, name: 'QuickBite Combo', price: 499, rating: 4.6, description: 'Noodles + Manchurian + Drink', isBestSeller: true, isVeg: false },
// // // // // //         { id: 106, name: 'QuickBite Fried Rice', price: 369, rating: 4.5, description: 'Special fried rice with prawns', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 204, name: 'Today\'s Noodles', price: 329, rating: 4.3, description: 'Chef\'s special noodle dish', isBestSeller: false, isVeg: true },
// // // // // //         { id: 205, name: 'Daily Rice Bowl', price: 349, rating: 4.4, description: 'Rice bowl with daily special', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Noodles': [
// // // // // //         { id: 14, name: 'Chilli Garlic Noodles', price: 329, rating: 4.3, description: 'Spicy noodles with garlic', isBestSeller: false, isVeg: true },
// // // // // //         { id: 15, name: 'Singapore Noodles', price: 349, rating: 4.2, description: 'Curry flavored noodles', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Rice': [
// // // // // //         { id: 16, name: 'Chicken Fried Rice', price: 329, rating: 4.4, description: 'Fried rice with chicken', isBestSeller: true, isVeg: false },
// // // // // //         { id: 17, name: 'Veg Schezwan Rice', price: 279, rating: 4.1, description: 'Spicy schezwan rice with vegetables', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Starters': [
// // // // // //         { id: 18, name: 'Manchurian', price: 279, rating: 4.3, description: 'Crispy balls in manchurian sauce', isBestSeller: true, isVeg: true },
// // // // // //         { id: 19, name: 'Chilli Chicken', price: 329, rating: 4.4, description: 'Spicy chicken with bell peppers', isBestSeller: false, isVeg: false },
// // // // // //         { id: 20, name: 'Spring Rolls', price: 199, rating: 4.0, description: 'Crispy vegetable spring rolls', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Soups': [
// // // // // //         { id: 21, name: 'Hot & Sour Soup', price: 199, rating: 4.1, description: 'Spicy and sour soup', isBestSeller: false, isVeg: true },
// // // // // //         { id: 22, name: 'Chicken Soup', price: 229, rating: 4.2, description: 'Clear chicken soup', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // //   'UBQ by Barbeque Nation': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Biryani', 'Barbeque', 'Main Course'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 23, name: 'Chicken Biryani', price: 449, rating: 4.7, description: 'Fragrant basmati rice with spicy chicken', isBestSeller: true, isVeg: false },
// // // // // //         { id: 24, name: 'Veg Biryani', price: 369, rating: 4.4, description: 'Fragrant basmati rice with vegetables', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 107, name: 'QuickBite Special Biryani', price: 599, rating: 4.9, description: 'Special biryani with extra meat', isBestSeller: true, isVeg: false },
// // // // // //         { id: 108, name: 'QuickBite Barbeque Platter', price: 699, rating: 4.8, description: 'Assorted barbeque items', isBestSeller: true, isVeg: false },
// // // // // //         { id: 109, name: 'QuickBite Special Combo', price: 799, rating: 4.7, description: 'Biryani + Barbeque + Drink', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 206, name: 'Today\'s Biryani', price: 479, rating: 4.5, description: 'Chef\'s special biryani of the day', isBestSeller: false, isVeg: false },
// // // // // //         { id: 207, name: 'Daily Barbeque Special', price: 549, rating: 4.6, description: 'Special barbeque dish', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Biryani': [
// // // // // //         { id: 25, name: 'Mutton Biryani', price: 549, rating: 4.8, description: 'Fragrant basmati rice with tender mutton', isBestSeller: true, isVeg: false },
// // // // // //         { id: 26, name: 'Egg Biryani', price: 399, rating: 4.3, description: 'Biryani with boiled eggs', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Barbeque': [
// // // // // //         { id: 27, name: 'Tandoori Chicken', price: 399, rating: 4.6, description: 'Grilled chicken in tandoori spices', isBestSeller: true, isVeg: false },
// // // // // //         { id: 28, name: 'Paneer Tikka', price: 349, rating: 4.3, description: 'Grilled paneer with bell peppers', isBestSeller: false, isVeg: true },
// // // // // //         { id: 29, name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Main Course': [
// // // // // //         { id: 30, name: 'Dal Makhani', price: 299, rating: 4.1, description: 'Slow cooked black dal', isBestSeller: false, isVeg: true },
// // // // // //         { id: 31, name: 'Butter Chicken', price: 399, rating: 4.5, description: 'Creamy butter chicken', isBestSeller: true, isVeg: false },
// // // // // //         { id: 32, name: 'Paneer Butter Masala', price: 349, rating: 4.4, description: 'Creamy paneer in tomato gravy', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // //   'Barbeque Nation': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Starters', 'Main Course'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 33, name: 'Chicken Tikka', price: 399, rating: 4.5, description: 'Grilled chicken tikka', isBestSeller: true, isVeg: false },
// // // // // //         { id: 34, name: 'Veg Platter', price: 349, rating: 4.2, description: 'Assorted grilled vegetables', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 110, name: 'QuickBite Special Platter', price: 599, rating: 4.8, description: 'Special assorted starters', isBestSeller: true, isVeg: false },
// // // // // //         { id: 111, name: 'QuickBite Grill Special', price: 649, rating: 4.7, description: 'Special grilled items', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 208, name: 'Today\'s Special Starter', price: 449, rating: 4.4, description: 'Chef\'s special starter', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Starters': [
// // // // // //         { id: 35, name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false },
// // // // // //         { id: 36, name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Main Course': [
// // // // // //         { id: 37, name: 'Dal Makhani', price: 299, rating: 4.1, description: 'Slow cooked black dal', isBestSeller: false, isVeg: true },
// // // // // //         { id: 38, name: 'Chicken Curry', price: 379, rating: 4.3, description: 'Spicy chicken curry', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // //   'McDonalds': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Burgers', 'Sides', 'Desserts'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 39, name: 'Big Mac', price: 299, rating: 4.5, description: 'Classic double cheeseburger', isBestSeller: true, isVeg: false },
// // // // // //         { id: 40, name: 'French Fries', price: 99, rating: 4.2, description: 'Crispy golden fries', isBestSeller: true, isVeg: true },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 112, name: 'QuickBite Mega Burger', price: 499, rating: 4.7, description: 'Huge burger with extra patty', isBestSeller: true, isVeg: false },
// // // // // //         { id: 113, name: 'QuickBite Combo', price: 549, rating: 4.6, description: 'Burger + Fries + Drink', isBestSeller: true, isVeg: false },
// // // // // //         { id: 114, name: 'QuickBite Veg Special', price: 399, rating: 4.5, description: 'Special veg burger with extra cheese', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 209, name: 'Today\'s Burger', price: 349, rating: 4.3, description: 'Chef\'s special burger of the day', isBestSeller: false, isVeg: false },
// // // // // //         { id: 210, name: 'Daily Value Meal', price: 429, rating: 4.4, description: 'Burger + Fries + Drink', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Burgers': [
// // // // // //         { id: 41, name: 'McChicken', price: 249, rating: 4.3, description: 'Crispy chicken burger', isBestSeller: false, isVeg: false },
// // // // // //         { id: 42, name: 'Veg Burger', price: 199, rating: 4.1, description: 'Grilled veg patty with lettuce', isBestSeller: false, isVeg: true },
// // // // // //         { id: 43, name: 'Double Cheeseburger', price: 329, rating: 4.4, description: 'Two patties with cheese', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Sides': [
// // // // // //         { id: 44, name: 'Onion Rings', price: 129, rating: 4.0, description: 'Crispy onion rings', isBestSeller: false, isVeg: true },
// // // // // //         { id: 45, name: 'Chicken Nuggets', price: 179, rating: 4.1, description: 'Crispy chicken nuggets', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Desserts': [
// // // // // //         { id: 46, name: 'McFlurry', price: 149, rating: 4.0, description: 'Ice cream with toppings', isBestSeller: false, isVeg: true },
// // // // // //         { id: 47, name: 'Apple Pie', price: 99, rating: 4.1, description: 'Warm apple pie', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // //   'Burger King': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Burgers', 'Sides'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 48, name: 'Whopper', price: 349, rating: 4.6, description: 'Flame-grilled beef burger', isBestSeller: true, isVeg: false },
// // // // // //         { id: 49, name: 'Onion Rings', price: 129, rating: 4.1, description: 'Crispy onion rings', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 115, name: 'QuickBite Whopper', price: 499, rating: 4.8, description: 'Double whopper with extra cheese', isBestSeller: true, isVeg: false },
// // // // // //         { id: 116, name: 'QuickBite Special Combo', price: 599, rating: 4.7, description: 'Whopper + Fries + Drink', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 211, name: 'Today\'s Special Whopper', price: 399, rating: 4.5, description: 'Whopper with special sauce', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Burgers': [
// // // // // //         { id: 50, name: 'Chicken Whopper', price: 329, rating: 4.4, description: 'Flame-grilled chicken burger', isBestSeller: false, isVeg: false },
// // // // // //         { id: 51, name: 'Veg Whopper', price: 279, rating: 4.2, description: 'Flame-grilled veg burger', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Sides': [
// // // // // //         { id: 52, name: 'French Fries', price: 99, rating: 4.0, description: 'Crispy golden fries', isBestSeller: false, isVeg: true },
// // // // // //         { id: 53, name: 'Chicken Fries', price: 149, rating: 4.2, description: 'Crispy chicken fries', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // //   'KFC': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Chicken', 'Burgers', 'Sides'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 54, name: 'Chicken Bucket', price: 599, rating: 4.5, description: '12 pieces of crispy chicken', isBestSeller: true, isVeg: false },
// // // // // //         { id: 55, name: 'Zinger Burger', price: 299, rating: 4.4, description: 'Crispy chicken burger', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 117, name: 'QuickBite Family Bucket', price: 899, rating: 4.8, description: 'Large family bucket with extra pieces', isBestSeller: true, isVeg: false },
// // // // // //         { id: 118, name: 'QuickBite Zinger Combo', price: 499, rating: 4.7, description: 'Zinger + Fries + Drink', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 212, name: 'Today\'s Special Chicken', price: 449, rating: 4.5, description: 'Special chicken recipe of the day', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Chicken': [
// // // // // //         { id: 56, name: 'Popcorn Chicken', price: 249, rating: 4.3, description: 'Bite-sized crispy chicken', isBestSeller: false, isVeg: false },
// // // // // //         { id: 57, name: 'Chicken Strips', price: 279, rating: 4.2, description: 'Crispy chicken strips', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Burgers': [
// // // // // //         { id: 58, name: 'Veg Burger', price: 199, rating: 4.0, description: 'Veg patty with lettuce', isBestSeller: false, isVeg: true },
// // // // // //         { id: 59, name: 'Double Zinger', price: 399, rating: 4.5, description: 'Double chicken patty burger', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Sides': [
// // // // // //         { id: 60, name: 'Mashed Potatoes', price: 99, rating: 4.0, description: 'Creamy mashed potatoes', isBestSeller: false, isVeg: true },
// // // // // //         { id: 61, name: 'Coleslaw', price: 79, rating: 3.9, description: 'Fresh coleslaw', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // //   'Domino\'s Pizza': {
// // // // // //     categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Pizzas', 'Sides'],
// // // // // //     items: {
// // // // // //       'Recommended': [
// // // // // //         { id: 62, name: 'Margherita', price: 349, rating: 4.2, description: 'Classic cheese pizza', isBestSeller: true, isVeg: true },
// // // // // //         { id: 63, name: 'Pepperoni', price: 399, rating: 4.4, description: 'Pepperoni with cheese', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'QuickBite Special': [
// // // // // //         { id: 119, name: 'QuickBite Special Pizza', price: 549, rating: 4.8, description: 'Loaded with extra cheese and premium toppings', isBestSeller: true, isVeg: true },
// // // // // //         { id: 120, name: 'QuickBite Combo', price: 649, rating: 4.7, description: 'Pizza + Garlic Bread + Drink', isBestSeller: true, isVeg: false },
// // // // // //       ],
// // // // // //       'Daily Special': [
// // // // // //         { id: 213, name: 'Today\'s Special Pizza', price: 449, rating: 4.5, description: 'Chef\'s special pizza', isBestSeller: false, isVeg: true },
// // // // // //         { id: 214, name: 'Daily Value Deal', price: 499, rating: 4.4, description: 'Pizza + Side + Drink', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //       'Pizzas': [
// // // // // //         { id: 64, name: 'Farmhouse', price: 429, rating: 4.3, description: 'Fresh vegetables with cheese', isBestSeller: false, isVeg: true },
// // // // // //         { id: 65, name: 'Chicken Dominator', price: 499, rating: 4.6, description: 'Chicken with cheese', isBestSeller: false, isVeg: false },
// // // // // //         { id: 66, name: 'Paneer Pizza', price: 459, rating: 4.4, description: 'Paneer with vegetables', isBestSeller: false, isVeg: true },
// // // // // //       ],
// // // // // //       'Sides': [
// // // // // //         { id: 67, name: 'Garlic Bread', price: 129, rating: 4.0, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true },
// // // // // //         { id: 68, name: 'Cheese Dip', price: 79, rating: 3.9, description: 'Cheese dip for pizza', isBestSeller: false, isVeg: true },
// // // // // //         { id: 69, name: 'Chicken Wings', price: 249, rating: 4.2, description: 'Spicy chicken wings', isBestSeller: false, isVeg: false },
// // // // // //       ],
// // // // // //     }
// // // // // //   },
// // // // // // };

// // // // // // // Default menu for any restaurant not listed
// // // // // // const DEFAULT_MENU = {
// // // // // //   categories: ['Recommended', 'QuickBite Special', 'Daily Special', 'Main Course', 'Sides'],
// // // // // //   items: {
// // // // // //     'Recommended': [
// // // // // //       { id: 999, name: 'Popular Dish', price: 299, rating: 4.0, description: 'Most ordered dish', isBestSeller: true, isVeg: true },
// // // // // //       { id: 998, name: 'Chef Special', price: 349, rating: 4.2, description: 'Chef\'s special creation', isBestSeller: true, isVeg: false },
// // // // // //     ],
// // // // // //     'QuickBite Special': [
// // // // // //       { id: 997, name: 'QuickBite Special', price: 499, rating: 4.8, description: 'Exclusive QuickBite dish', isBestSeller: true, isVeg: true },
// // // // // //       { id: 996, name: 'QuickBite Combo', price: 599, rating: 4.7, description: 'Complete meal combo', isBestSeller: true, isVeg: false },
// // // // // //     ],
// // // // // //     'Daily Special': [
// // // // // //       { id: 995, name: 'Today\'s Special', price: 399, rating: 4.5, description: 'Chef\'s daily special', isBestSeller: false, isVeg: true },
// // // // // //     ],
// // // // // //     'Main Course': [
// // // // // //       { id: 994, name: 'Main Dish 1', price: 299, rating: 4.1, description: 'Popular main course', isBestSeller: false, isVeg: true },
// // // // // //       { id: 993, name: 'Main Dish 2', price: 349, rating: 4.2, description: 'Another main course option', isBestSeller: false, isVeg: false },
// // // // // //     ],
// // // // // //     'Sides': [
// // // // // //       { id: 992, name: 'Side Dish 1', price: 149, rating: 4.0, description: 'Perfect side dish', isBestSeller: false, isVeg: true },
// // // // // //       { id: 991, name: 'Side Dish 2', price: 179, rating: 4.1, description: 'Another side option', isBestSeller: false, isVeg: true },
// // // // // //     ],
// // // // // //   }
// // // // // // };

// // // // // // const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
// // // // // //   const { restaurant } = route.params || {};
// // // // // //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// // // // // //   const restaurantData = restaurant || {
// // // // // //     id: 1,
// // // // // //     name: 'Pizza Hut',
// // // // // //     rating: 4.0,
// // // // // //     deliveryTime: '30-35 mins',
// // // // // //     cuisine: 'Pizzas',
// // // // // //     image: 'https://via.placeholder.com/150',
// // // // // //     costForTwo: '₹800 for two',
// // // // // //     address: 'Sector 1, HSR Layout',
// // // // // //     isVeg: false,
// // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // //   };

// // // // // //   // Get restaurant menu data
// // // // // //   const restaurantMenu = RESTAURANT_MENUS[restaurantData.name] || DEFAULT_MENU;
// // // // // //   const categories = restaurantMenu.categories || DEFAULT_MENU.categories;
// // // // // //   const menuItems = restaurantMenu.items || DEFAULT_MENU.items;

// // // // // //   const currentItems = menuItems[selectedCategory] || [];

// // // // // //   const handleAddToCart = (item: any) => {
// // // // // //     Alert.alert('Added to Cart', `${item.name} added to your cart`);
// // // // // //   };

// // // // // //   const renderCategoryTab = ({ item }: { item: string }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={[
// // // // // //         styles.categoryTab,
// // // // // //         selectedCategory === item && styles.activeCategoryTab,
// // // // // //       ]}
// // // // // //       onPress={() => setSelectedCategory(item)}
// // // // // //     >
// // // // // //       <Text
// // // // // //         style={[
// // // // // //           styles.categoryTabText,
// // // // // //           selectedCategory === item && styles.activeCategoryTabText,
// // // // // //         ]}
// // // // // //       >
// // // // // //         {item}
// // // // // //       </Text>
// // // // // //       {selectedCategory === item && <View style={styles.activeIndicator} />}
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   const renderMenuItem = ({ item }: { item: any }) => (
// // // // // //     <View style={styles.menuItem}>
// // // // // //       <View style={styles.menuItemContent}>
// // // // // //         <View style={styles.menuItemInfo}>
// // // // // //           <View style={styles.menuItemHeader}>
// // // // // //             <Text style={styles.menuItemName}>{item.name}</Text>
// // // // // //             {item.isBestSeller && (
// // // // // //               <View style={styles.bestsellerBadge}>
// // // // // //                 <Icon name="star" size={12} color="#ff6f00" />
// // // // // //                 <Text style={styles.bestsellerText}>BESTSELLER</Text>
// // // // // //               </View>
// // // // // //             )}
// // // // // //           </View>
// // // // // //           <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// // // // // //           <View style={styles.menuItemRating}>
// // // // // //             <Icon name="star" size={14} color="#ffc107" />
// // // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // //           </View>
// // // // // //           {item.description && (
// // // // // //             <Text style={styles.menuItemDescription} numberOfLines={2}>
// // // // // //               {item.description}
// // // // // //             </Text>
// // // // // //           )}
// // // // // //         </View>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.addButton}
// // // // // //           onPress={() => handleAddToCart(item)}
// // // // // //         >
// // // // // //           <Text style={styles.addButtonText}>ADD</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //       <View style={styles.divider} />
// // // // // //     </View>
// // // // // //   );

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // //         {/* Header Image */}
// // // // // //         <View style={styles.imageContainer}>
// // // // // //           <Image
// // // // // //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// // // // // //             style={styles.restaurantImage}
// // // // // //           />
// // // // // //           <TouchableOpacity
// // // // // //             style={styles.backButton}
// // // // // //             onPress={() => navigation.goBack()}
// // // // // //           >
// // // // // //             <Icon name="arrow-back" size={24} color="#ffffff" />
// // // // // //           </TouchableOpacity>
// // // // // //           <TouchableOpacity style={styles.favoriteButton}>
// // // // // //             <Icon name="heart-outline" size={24} color="#ffffff" />
// // // // // //           </TouchableOpacity>
// // // // // //         </View>

// // // // // //         {/* Restaurant Info */}
// // // // // //         <View style={styles.infoContainer}>
// // // // // //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
// // // // // //           <View style={styles.ratingContainer}>
// // // // // //             <View style={styles.ratingBadge}>
// // // // // //               <Icon name="star" size={14} color="#ffffff" />
// // // // // //               <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
// // // // // //             </View>
// // // // // //             <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// // // // // //             <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// // // // // //           </View>
// // // // // //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
// // // // // //           {restaurantData.offer && (
// // // // // //             <View style={styles.offerContainer}>
// // // // // //               <Text style={styles.offerText}>🎯 {restaurantData.offer}</Text>
// // // // // //             </View>
// // // // // //           )}
// // // // // //         </View>

// // // // // //         {/* Category Tabs */}
// // // // // //         <View style={styles.categoriesContainer}>
// // // // // //           <FlatList
// // // // // //             data={categories}
// // // // // //             renderItem={renderCategoryTab}
// // // // // //             keyExtractor={(item) => item}
// // // // // //             horizontal
// // // // // //             showsHorizontalScrollIndicator={false}
// // // // // //             contentContainerStyle={styles.categoriesList}
// // // // // //           />
// // // // // //         </View>

// // // // // //         {/* Menu Items */}
// // // // // //         <View style={styles.menuContainer}>
// // // // // //           <View style={styles.menuHeader}>
// // // // // //             <Text style={styles.menuTitle}>{selectedCategory}</Text>
// // // // // //             <Text style={styles.menuCount}>{currentItems.length} items</Text>
// // // // // //           </View>
          
// // // // // //           {currentItems.length > 0 ? (
// // // // // //             <FlatList
// // // // // //               data={currentItems}
// // // // // //               renderItem={renderMenuItem}
// // // // // //               keyExtractor={(item) => item.id.toString()}
// // // // // //               scrollEnabled={false}
// // // // // //             />
// // // // // //           ) : (
// // // // // //             <View style={styles.emptyContainer}>
// // // // // //               <Icon name="restaurant-outline" size={60} color="#ccc" />
// // // // // //               <Text style={styles.emptyText}>No items in this category</Text>
// // // // // //             </View>
// // // // // //           )}
// // // // // //         </View>

// // // // // //         <View style={styles.footerSpacing} />
// // // // // //       </ScrollView>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   imageContainer: {
// // // // // //     position: 'relative',
// // // // // //     height: 220,
// // // // // //   },
// // // // // //   restaurantImage: {
// // // // // //     width: '100%',
// // // // // //     height: '100%',
// // // // // //   },
// // // // // //   backButton: {
// // // // // //     position: 'absolute',
// // // // // //     top: 12,
// // // // // //     left: 16,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     borderRadius: 20,
// // // // // //     padding: 8,
// // // // // //   },
// // // // // //   favoriteButton: {
// // // // // //     position: 'absolute',
// // // // // //     top: 12,
// // // // // //     right: 16,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     borderRadius: 20,
// // // // // //     padding: 8,
// // // // // //   },
// // // // // //   infoContainer: {
// // // // // //     padding: 16,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   restaurantName: {
// // // // // //     fontSize: 22,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   ratingContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   ratingBadge: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#28a745',
// // // // // //     paddingHorizontal: 8,
// // // // // //     paddingVertical: 2,
// // // // // //     borderRadius: 4,
// // // // // //   },
// // // // // //   ratingBadgeText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '600',
// // // // // //     marginLeft: 4,
// // // // // //   },
// // // // // //   deliveryTime: {
// // // // // //     fontSize: 13,
// // // // // //     color: '#7e808c',
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   costForTwo: {
// // // // // //     fontSize: 13,
// // // // // //     color: '#7e808c',
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   cuisine: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 6,
// // // // // //   },
// // // // // //   offerContainer: {
// // // // // //     marginTop: 8,
// // // // // //     backgroundColor: '#fff8e1',
// // // // // //     padding: 8,
// // // // // //     borderRadius: 6,
// // // // // //   },
// // // // // //   offerText: {
// // // // // //     fontSize: 13,
// // // // // //     color: '#ff6f00',
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   categoriesContainer: {
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   categoriesList: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //   },
// // // // // //   categoryTab: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     marginRight: 4,
// // // // // //     position: 'relative',
// // // // // //   },
// // // // // //   activeCategoryTab: {},
// // // // // //   categoryTabText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   activeCategoryTabText: {
// // // // // //     color: '#fc8019',
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   activeIndicator: {
// // // // // //     position: 'absolute',
// // // // // //     bottom: 0,
// // // // // //     left: 16,
// // // // // //     right: 16,
// // // // // //     height: 3,
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     borderRadius: 2,
// // // // // //   },
// // // // // //   menuContainer: {
// // // // // //     padding: 16,
// // // // // //   },
// // // // // //   menuHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   menuTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   menuCount: {
// // // // // //     fontSize: 13,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   menuItem: {
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   menuItemContent: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 12,
// // // // // //   },
// // // // // //   menuItemInfo: {
// // // // // //     flex: 1,
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   menuItemHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     flexWrap: 'wrap',
// // // // // //   },
// // // // // //   menuItemName: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   bestsellerBadge: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#fff8e1',
// // // // // //     paddingHorizontal: 8,
// // // // // //     paddingVertical: 2,
// // // // // //     borderRadius: 4,
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   bestsellerText: {
// // // // // //     fontSize: 10,
// // // // // //     color: '#ff6f00',
// // // // // //     fontWeight: '600',
// // // // // //     marginLeft: 4,
// // // // // //   },
// // // // // //   menuItemPrice: {
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   menuItemRating: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   ratingText: {
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //     marginLeft: 4,
// // // // // //   },
// // // // // //   menuItemDescription: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 4,
// // // // // //     lineHeight: 16,
// // // // // //   },
// // // // // //   addButton: {
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#fc8019',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 6,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   addButtonText: {
// // // // // //     color: '#fc8019',
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   divider: {
// // // // // //     height: 1,
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //   },
// // // // // //   emptyContainer: {
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     paddingVertical: 40,
// // // // // //   },
// // // // // //   emptyText: {
// // // // // //     fontSize: 16,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 12,
// // // // // //   },
// // // // // //   footerSpacing: {
// // // // // //     height: 80,
// // // // // //   },
// // // // // // });

// // // // // // export default RestaurantDetailScreen;
// // // // // import React, { useState } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   Image,
// // // // //   FlatList,
// // // // //   Alert,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // // } from 'react-native';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // interface RestaurantDetailScreenProps {
// // // // //   route: any;
// // // // //   navigation: any;
// // // // // }

// // // // // // Menu items organized by restaurant with categories
// // // // // const RESTAURANT_MENUS: Record<string, any> = {
// // // // //   'Pizza Hut': {
// // // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Pizzas', 'Sides'],
// // // // //     items: {
// // // // //       'Recommended': [
// // // // //         { id: 1, name: 'Margherita Pizza', price: 369, rating: 4.3, description: 'Classic cheese pizza with tomato sauce', isBestSeller: true, isVeg: true },
// // // // //         { id: 2, name: 'Pepperoni Pizza', price: 399, rating: 4.5, description: 'Pepperoni with mozzarella cheese', isBestSeller: true, isVeg: false },
// // // // //         { id: 3, name: 'Garlic Bread', price: 149, rating: 4.1, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'QuickBite Special': [
// // // // //         { id: 101, name: 'QuickBite Special Pizza', price: 499, rating: 4.8, description: 'Loaded with extra cheese and premium toppings', isBestSeller: true, isVeg: true },
// // // // //         { id: 102, name: 'QuickBite Combo Meal', price: 599, rating: 4.7, description: 'Pizza + Garlic Bread + Drink', isBestSeller: true, isVeg: false },
// // // // //         { id: 103, name: 'QuickBite Burger', price: 349, rating: 4.6, description: 'Special burger with secret sauce', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'Offers': [
// // // // //         { id: 201, name: 'Buy 1 Get 1 Pizza', price: 399, rating: 4.4, description: 'Buy one pizza get one free', isBestSeller: false, isVeg: true },
// // // // //         { id: 202, name: 'Family Combo Deal', price: 799, rating: 4.5, description: '2 Large Pizzas + Garlic Bread + Drink', isBestSeller: true, isVeg: false },
// // // // //         { id: 203, name: 'Student Special', price: 299, rating: 4.3, description: 'Small Pizza + Drink', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'Pizzas': [
// // // // //         { id: 4, name: 'Veggie Supreme', price: 429, rating: 4.2, description: 'Bell peppers, onions, mushrooms, olives', isBestSeller: false, isVeg: true },
// // // // //         { id: 5, name: 'Chicken BBQ Pizza', price: 459, rating: 4.4, description: 'Grilled chicken with BBQ sauce', isBestSeller: false, isVeg: false },
// // // // //         { id: 6, name: 'Paneer Pizza', price: 439, rating: 4.3, description: 'Paneer with vegetables', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'Sides': [
// // // // //         { id: 7, name: 'Cheese Sticks', price: 179, rating: 4.2, description: 'Crispy cheese sticks', isBestSeller: false, isVeg: true },
// // // // //         { id: 8, name: 'Chicken Wings', price: 249, rating: 4.3, description: 'Spicy chicken wings', isBestSeller: false, isVeg: false },
// // // // //       ],
// // // // //     }
// // // // //   },
// // // // //   'Chinese Wok': {
// // // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Noodles', 'Rice'],
// // // // //     items: {
// // // // //       'Recommended': [
// // // // //         { id: 9, name: 'Chicken Noodles', price: 299, rating: 4.2, description: 'Stir-fried noodles with chicken', isBestSeller: true, isVeg: false },
// // // // //         { id: 10, name: 'Veg Fried Rice', price: 249, rating: 4.1, description: 'Fried rice with mixed vegetables', isBestSeller: false, isVeg: true },
// // // // //         { id: 11, name: 'Spring Rolls', price: 199, rating: 4.0, description: 'Crispy vegetable spring rolls', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'QuickBite Special': [
// // // // //         { id: 104, name: 'QuickBite Special Noodles', price: 399, rating: 4.7, description: 'Loaded with exotic vegetables and sauce', isBestSeller: true, isVeg: true },
// // // // //         { id: 105, name: 'QuickBite Combo', price: 499, rating: 4.6, description: 'Noodles + Manchurian + Drink', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Offers': [
// // // // //         { id: 204, name: 'Weekend Combo', price: 449, rating: 4.4, description: 'Noodles + Fried Rice + Manchurian', isBestSeller: false, isVeg: true },
// // // // //         { id: 205, name: 'Family Pack', price: 699, rating: 4.5, description: '4 Items + 4 Drinks', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Noodles': [
// // // // //         { id: 12, name: 'Chilli Garlic Noodles', price: 329, rating: 4.3, description: 'Spicy noodles with garlic', isBestSeller: false, isVeg: true },
// // // // //         { id: 13, name: 'Singapore Noodles', price: 349, rating: 4.2, description: 'Curry flavored noodles', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'Rice': [
// // // // //         { id: 14, name: 'Chicken Fried Rice', price: 329, rating: 4.4, description: 'Fried rice with chicken', isBestSeller: true, isVeg: false },
// // // // //         { id: 15, name: 'Veg Schezwan Rice', price: 279, rating: 4.1, description: 'Spicy schezwan rice with vegetables', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //     }
// // // // //   },
// // // // //   'UBQ by Barbeque Nation': {
// // // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Biryani', 'Barbeque'],
// // // // //     items: {
// // // // //       'Recommended': [
// // // // //         { id: 16, name: 'Chicken Biryani', price: 449, rating: 4.7, description: 'Fragrant basmati rice with spicy chicken', isBestSeller: true, isVeg: false },
// // // // //         { id: 17, name: 'Tandoori Chicken', price: 399, rating: 4.6, description: 'Grilled chicken in tandoori spices', isBestSeller: true, isVeg: false },
// // // // //         { id: 18, name: 'Paneer Tikka', price: 349, rating: 4.3, description: 'Grilled paneer with bell peppers', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'QuickBite Special': [
// // // // //         { id: 106, name: 'QuickBite Special Biryani', price: 599, rating: 4.9, description: 'Special biryani with extra meat', isBestSeller: true, isVeg: false },
// // // // //         { id: 107, name: 'QuickBite Barbeque Platter', price: 699, rating: 4.8, description: 'Assorted barbeque items', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Offers': [
// // // // //         { id: 206, name: 'Biryani Combo', price: 549, rating: 4.5, description: 'Biryani + Raita + Gulab Jamun', isBestSeller: false, isVeg: false },
// // // // //         { id: 207, name: 'Family Feast', price: 899, rating: 4.6, description: 'Biryani + Barbeque + Dessert', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Biryani': [
// // // // //         { id: 19, name: 'Veg Biryani', price: 369, rating: 4.4, description: 'Fragrant basmati rice with vegetables', isBestSeller: false, isVeg: true },
// // // // //         { id: 20, name: 'Mutton Biryani', price: 549, rating: 4.8, description: 'Fragrant basmati rice with tender mutton', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Barbeque': [
// // // // //         { id: 21, name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false },
// // // // //         { id: 22, name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //     }
// // // // //   },
// // // // //   'Barbeque Nation': {
// // // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Starters', 'Main Course'],
// // // // //     items: {
// // // // //       'Recommended': [
// // // // //         { id: 23, name: 'Chicken Tikka', price: 399, rating: 4.5, description: 'Grilled chicken tikka', isBestSeller: true, isVeg: false },
// // // // //         { id: 24, name: 'Veg Platter', price: 349, rating: 4.2, description: 'Assorted grilled vegetables', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'QuickBite Special': [
// // // // //         { id: 108, name: 'QuickBite Special Platter', price: 599, rating: 4.8, description: 'Special assorted starters', isBestSeller: true, isVeg: false },
// // // // //         { id: 109, name: 'QuickBite Grill Special', price: 649, rating: 4.7, description: 'Special grilled items', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Offers': [
// // // // //         { id: 208, name: 'Starters Combo', price: 449, rating: 4.4, description: '3 Starters + Drink', isBestSeller: false, isVeg: true },
// // // // //         { id: 209, name: 'Family Platter', price: 799, rating: 4.6, description: '5 Starters + Main Course', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Starters': [
// // // // //         { id: 25, name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false },
// // // // //         { id: 26, name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true },
// // // // //       ],
// // // // //       'Main Course': [
// // // // //         { id: 27, name: 'Dal Makhani', price: 299, rating: 4.1, description: 'Slow cooked black dal', isBestSeller: false, isVeg: true },
// // // // //         { id: 28, name: 'Chicken Curry', price: 379, rating: 4.3, description: 'Spicy chicken curry', isBestSeller: false, isVeg: false },
// // // // //       ],
// // // // //     }
// // // // //   },
// // // // //   'McDonalds': {
// // // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Burgers', 'Sides'],
// // // // //     items: {
// // // // //       'Recommended': [
// // // // //         { id: 29, name: 'Big Mac', price: 299, rating: 4.5, description: 'Classic double cheeseburger', isBestSeller: true, isVeg: false },
// // // // //         { id: 30, name: 'French Fries', price: 99, rating: 4.2, description: 'Crispy golden fries', isBestSeller: true, isVeg: true },
// // // // //         { id: 31, name: 'McChicken', price: 249, rating: 4.3, description: 'Crispy chicken burger', isBestSeller: false, isVeg: false },
// // // // //       ],
// // // // //       'QuickBite Special': [
// // // // //         { id: 110, name: 'QuickBite Mega Burger', price: 499, rating: 4.7, description: 'Huge burger with extra patty', isBestSeller: true, isVeg: false },
// // // // //         { id: 111, name: 'QuickBite Combo', price: 549, rating: 4.6, description: 'Burger + Fries + Drink', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Offers': [
// // // // //         { id: 210, name: 'Meal Deal', price: 349, rating: 4.3, description: 'Burger + Fries + Small Drink', isBestSeller: false, isVeg: true },
// // // // //         { id: 211, name: 'Family Box', price: 799, rating: 4.5, description: '4 Burgers + 4 Fries + 4 Drinks', isBestSeller: true, isVeg: false },
// // // // //       ],
// // // // //       'Burgers': [
// // // // //         { id: 32, name: 'Veg Burger', price: 199, rating: 4.1, description: 'Grilled veg patty with lettuce', isBestSeller: false, isVeg: true },
// // // // //         { id: 33, name: 'Double Cheeseburger', price: 329, rating: 4.4, description: 'Two patties with cheese', isBestSeller: false, isVeg: false },
// // // // //       ],
// // // // //       'Sides': [
// // // // //         { id: 34, name: 'Onion Rings', price: 129, rating: 4.0, description: 'Crispy onion rings', isBestSeller: false, isVeg: true },
// // // // //         { id: 35, name: 'Chicken Nuggets', price: 179, rating: 4.1, description: 'Crispy chicken nuggets', isBestSeller: false, isVeg: false },
// // // // //       ],
// // // // //     }
// // // // //   },
// // // // // };

// // // // // const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
// // // // //   const { restaurant } = route.params || {};
// // // // //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// // // // //   const restaurantData = restaurant || {
// // // // //     id: 1,
// // // // //     name: 'Pizza Hut',
// // // // //     rating: 4.0,
// // // // //     deliveryTime: '30-35 mins',
// // // // //     cuisine: 'Pizzas',
// // // // //     image: 'https://via.placeholder.com/150',
// // // // //     costForTwo: '₹800 for two',
// // // // //     address: 'Sector 1, HSR Layout',
// // // // //     isVeg: false,
// // // // //     offer: '50% OFF UPTO ₹100',
// // // // //   };

// // // // //   // Get restaurant menu data
// // // // //   const restaurantMenu = RESTAURANT_MENUS[restaurantData.name] || RESTAURANT_MENUS['Pizza Hut'];
// // // // //   const categories = restaurantMenu.categories || ['Recommended', 'QuickBite Special', 'Offers'];
// // // // //   const menuItems = restaurantMenu.items || {};

// // // // //   const currentItems = menuItems[selectedCategory] || [];

// // // // //   const handleAddToCart = (item: any) => {
// // // // //     Alert.alert(
// // // // //       'Added to Cart!',
// // // // //       `${item.name} added to your cart`,
// // // // //       [
// // // // //         { text: 'Continue Shopping', style: 'cancel' },
// // // // //         { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
// // // // //       ]
// // // // //     );
// // // // //   };

// // // // //   const renderCategoryTab = ({ item }: { item: string }) => (
// // // // //     <TouchableOpacity
// // // // //       style={[
// // // // //         styles.categoryTab,
// // // // //         selectedCategory === item && styles.activeCategoryTab,
// // // // //       ]}
// // // // //       onPress={() => setSelectedCategory(item)}
// // // // //     >
// // // // //       <Text
// // // // //         style={[
// // // // //           styles.categoryTabText,
// // // // //           selectedCategory === item && styles.activeCategoryTabText,
// // // // //         ]}
// // // // //       >
// // // // //         {item}
// // // // //       </Text>
// // // // //       {selectedCategory === item && <View style={styles.activeIndicator} />}
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   const renderMenuItem = ({ item }: { item: any }) => (
// // // // //     <View style={styles.menuItem}>
// // // // //       <View style={styles.menuItemContent}>
// // // // //         <View style={styles.menuItemInfo}>
// // // // //           <View style={styles.menuItemHeader}>
// // // // //             <Text style={styles.menuItemName}>{item.name}</Text>
// // // // //             {item.isBestSeller && (
// // // // //               <View style={styles.bestsellerBadge}>
// // // // //                 <Icon name="star" size={12} color="#ff6f00" />
// // // // //                 <Text style={styles.bestsellerText}>BESTSELLER</Text>
// // // // //               </View>
// // // // //             )}
// // // // //           </View>
// // // // //           <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// // // // //           <View style={styles.menuItemRating}>
// // // // //             <Icon name="star" size={14} color="#ffc107" />
// // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // //           </View>
// // // // //           {item.description && (
// // // // //             <Text style={styles.menuItemDescription} numberOfLines={2}>
// // // // //               {item.description}
// // // // //             </Text>
// // // // //           )}
// // // // //         </View>
// // // // //         <TouchableOpacity
// // // // //           style={styles.addButton}
// // // // //           onPress={() => handleAddToCart(item)}
// // // // //         >
// // // // //           <Text style={styles.addButtonText}>ADD</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //       <View style={styles.divider} />
// // // // //     </View>
// // // // //   );

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         {/* Header Image */}
// // // // //         <View style={styles.imageContainer}>
// // // // //           <Image
// // // // //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// // // // //             style={styles.restaurantImage}
// // // // //           />
// // // // //           <TouchableOpacity
// // // // //             style={styles.backButton}
// // // // //             onPress={() => navigation.goBack()}
// // // // //           >
// // // // //             <Icon name="arrow-back" size={24} color="#ffffff" />
// // // // //           </TouchableOpacity>
// // // // //           <TouchableOpacity style={styles.favoriteButton}>
// // // // //             <Icon name="heart-outline" size={24} color="#ffffff" />
// // // // //           </TouchableOpacity>
// // // // //         </View>

// // // // //         {/* Restaurant Info */}
// // // // //         <View style={styles.infoContainer}>
// // // // //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
// // // // //           <View style={styles.ratingContainer}>
// // // // //             <View style={styles.ratingBadge}>
// // // // //               <Icon name="star" size={14} color="#ffffff" />
// // // // //               <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
// // // // //             </View>
// // // // //             <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// // // // //             <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// // // // //           </View>
// // // // //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
// // // // //           {restaurantData.offer && (
// // // // //             <View style={styles.offerContainer}>
// // // // //               <Text style={styles.offerText}>🎯 {restaurantData.offer}</Text>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>

// // // // //         {/* Category Tabs */}
// // // // //         <View style={styles.categoriesContainer}>
// // // // //           <FlatList
// // // // //             data={categories}
// // // // //             renderItem={renderCategoryTab}
// // // // //             keyExtractor={(item) => item}
// // // // //             horizontal
// // // // //             showsHorizontalScrollIndicator={false}
// // // // //             contentContainerStyle={styles.categoriesList}
// // // // //           />
// // // // //         </View>

// // // // //         {/* Menu Items */}
// // // // //         <View style={styles.menuContainer}>
// // // // //           <View style={styles.menuHeader}>
// // // // //             <Text style={styles.menuTitle}>{selectedCategory}</Text>
// // // // //             <Text style={styles.menuCount}>{currentItems.length} items</Text>
// // // // //           </View>
          
// // // // //           {currentItems.length > 0 ? (
// // // // //             <FlatList
// // // // //               data={currentItems}
// // // // //               renderItem={renderMenuItem}
// // // // //               keyExtractor={(item) => item.id.toString()}
// // // // //               scrollEnabled={false}
// // // // //             />
// // // // //           ) : (
// // // // //             <View style={styles.emptyContainer}>
// // // // //               <Icon name="restaurant-outline" size={60} color="#ccc" />
// // // // //               <Text style={styles.emptyText}>No items in this category</Text>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>

// // // // //         <View style={styles.footerSpacing} />
// // // // //       </ScrollView>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   imageContainer: {
// // // // //     position: 'relative',
// // // // //     height: 220,
// // // // //   },
// // // // //   restaurantImage: {
// // // // //     width: '100%',
// // // // //     height: '100%',
// // // // //   },
// // // // //   backButton: {
// // // // //     position: 'absolute',
// // // // //     top: 12,
// // // // //     left: 16,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     borderRadius: 20,
// // // // //     padding: 8,
// // // // //   },
// // // // //   favoriteButton: {
// // // // //     position: 'absolute',
// // // // //     top: 12,
// // // // //     right: 16,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     borderRadius: 20,
// // // // //     padding: 8,
// // // // //   },
// // // // //   infoContainer: {
// // // // //     padding: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   restaurantName: {
// // // // //     fontSize: 22,
// // // // //     fontWeight: '700',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   ratingContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   ratingBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#28a745',
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 2,
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   ratingBadgeText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   deliveryTime: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   costForTwo: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   cuisine: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 6,
// // // // //   },
// // // // //   offerContainer: {
// // // // //     marginTop: 8,
// // // // //     backgroundColor: '#fff8e1',
// // // // //     padding: 8,
// // // // //     borderRadius: 6,
// // // // //   },
// // // // //   offerText: {
// // // // //     fontSize: 13,
// // // // //     color: '#ff6f00',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   categoriesContainer: {
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   categoriesList: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //   },
// // // // //   categoryTab: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     marginRight: 4,
// // // // //     position: 'relative',
// // // // //   },
// // // // //   activeCategoryTab: {},
// // // // //   categoryTabText: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   activeCategoryTabText: {
// // // // //     color: '#fc8019',
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   activeIndicator: {
// // // // //     position: 'absolute',
// // // // //     bottom: 0,
// // // // //     left: 16,
// // // // //     right: 16,
// // // // //     height: 3,
// // // // //     backgroundColor: '#fc8019',
// // // // //     borderRadius: 2,
// // // // //   },
// // // // //   menuContainer: {
// // // // //     padding: 16,
// // // // //   },
// // // // //   menuHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   menuTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   menuCount: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //   },
// // // // //   menuItem: {
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   menuItemContent: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 12,
// // // // //   },
// // // // //   menuItemInfo: {
// // // // //     flex: 1,
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   menuItemHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flexWrap: 'wrap',
// // // // //   },
// // // // //   menuItemName: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   bestsellerBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fff8e1',
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 2,
// // // // //     borderRadius: 4,
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   bestsellerText: {
// // // // //     fontSize: 10,
// // // // //     color: '#ff6f00',
// // // // //     fontWeight: '600',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   menuItemPrice: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   menuItemRating: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   ratingText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   menuItemDescription: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 4,
// // // // //     lineHeight: 16,
// // // // //   },
// // // // //   addButton: {
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#fc8019',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 6,
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   addButtonText: {
// // // // //     color: '#fc8019',
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   divider: {
// // // // //     height: 1,
// // // // //     backgroundColor: '#f0f0f5',
// // // // //   },
// // // // //   emptyContainer: {
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     paddingVertical: 40,
// // // // //   },
// // // // //   emptyText: {
// // // // //     fontSize: 16,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   footerSpacing: {
// // // // //     height: 80,
// // // // //   },
// // // // // });

// // // // // export default RestaurantDetailScreen;
// // // // import React, { useState, useContext } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   Image,
// // // //   FlatList,
// // // //   Alert,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { CartContext } from '../../context/CartContext';

// // // // interface RestaurantDetailScreenProps {
// // // //   route: any;
// // // //   navigation: any;
// // // // }

// // // // // Menu items organized by restaurant with categories
// // // // const RESTAURANT_MENUS: Record<string, any> = {
// // // //   'Pizza Hut': {
// // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Pizzas', 'Sides'],
// // // //     items: {
// // // //       'Recommended': [
// // // //         { id: 1, name: 'Margherita Pizza', price: 369, rating: 4.3, description: 'Classic cheese pizza with tomato sauce', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 2, name: 'Pepperoni Pizza', price: 399, rating: 4.5, description: 'Pepperoni with mozzarella cheese', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 3, name: 'Garlic Bread', price: 149, rating: 4.1, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'QuickBite Special': [
// // // //         { id: 101, name: 'QuickBite Special Pizza', price: 499, rating: 4.8, description: 'Loaded with extra cheese and premium toppings', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 102, name: 'QuickBite Combo Meal', price: 599, rating: 4.7, description: 'Pizza + Garlic Bread + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 103, name: 'QuickBite Burger', price: 349, rating: 4.6, description: 'Special burger with secret sauce', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Offers': [
// // // //         { id: 201, name: 'Buy 1 Get 1 Pizza', price: 399, rating: 4.4, description: 'Buy one pizza get one free', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 202, name: 'Family Combo Deal', price: 799, rating: 4.5, description: '2 Large Pizzas + Garlic Bread + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 203, name: 'Student Special', price: 299, rating: 4.3, description: 'Small Pizza + Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Pizzas': [
// // // //         { id: 4, name: 'Veggie Supreme', price: 429, rating: 4.2, description: 'Bell peppers, onions, mushrooms, olives', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 5, name: 'Chicken BBQ Pizza', price: 459, rating: 4.4, description: 'Grilled chicken with BBQ sauce', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 6, name: 'Paneer Pizza', price: 439, rating: 4.3, description: 'Paneer with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Sides': [
// // // //         { id: 7, name: 'Cheese Sticks', price: 179, rating: 4.2, description: 'Crispy cheese sticks', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 8, name: 'Chicken Wings', price: 249, rating: 4.3, description: 'Spicy chicken wings', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //     }
// // // //   },
// // // //   'Chinese Wok': {
// // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Noodles', 'Rice'],
// // // //     items: {
// // // //       'Recommended': [
// // // //         { id: 9, name: 'Chicken Noodles', price: 299, rating: 4.2, description: 'Stir-fried noodles with chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 10, name: 'Veg Fried Rice', price: 249, rating: 4.1, description: 'Fried rice with mixed vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 11, name: 'Spring Rolls', price: 199, rating: 4.0, description: 'Crispy vegetable spring rolls', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'QuickBite Special': [
// // // //         { id: 104, name: 'QuickBite Special Noodles', price: 399, rating: 4.7, description: 'Loaded with exotic vegetables and sauce', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 105, name: 'QuickBite Combo', price: 499, rating: 4.6, description: 'Noodles + Manchurian + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Offers': [
// // // //         { id: 204, name: 'Weekend Combo', price: 449, rating: 4.4, description: 'Noodles + Fried Rice + Manchurian', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 205, name: 'Family Pack', price: 699, rating: 4.5, description: '4 Items + 4 Drinks', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Noodles': [
// // // //         { id: 12, name: 'Chilli Garlic Noodles', price: 329, rating: 4.3, description: 'Spicy noodles with garlic', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 13, name: 'Singapore Noodles', price: 349, rating: 4.2, description: 'Curry flavored noodles', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Rice': [
// // // //         { id: 14, name: 'Chicken Fried Rice', price: 329, rating: 4.4, description: 'Fried rice with chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 15, name: 'Veg Schezwan Rice', price: 279, rating: 4.1, description: 'Spicy schezwan rice with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //     }
// // // //   },
// // // //   'UBQ by Barbeque Nation': {
// // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Biryani', 'Barbeque'],
// // // //     items: {
// // // //       'Recommended': [
// // // //         { id: 16, name: 'Chicken Biryani', price: 449, rating: 4.7, description: 'Fragrant basmati rice with spicy chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 17, name: 'Tandoori Chicken', price: 399, rating: 4.6, description: 'Grilled chicken in tandoori spices', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 18, name: 'Paneer Tikka', price: 349, rating: 4.3, description: 'Grilled paneer with bell peppers', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'QuickBite Special': [
// // // //         { id: 106, name: 'QuickBite Special Biryani', price: 599, rating: 4.9, description: 'Special biryani with extra meat', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 107, name: 'QuickBite Barbeque Platter', price: 699, rating: 4.8, description: 'Assorted barbeque items', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Offers': [
// // // //         { id: 206, name: 'Biryani Combo', price: 549, rating: 4.5, description: 'Biryani + Raita + Gulab Jamun', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 207, name: 'Family Feast', price: 899, rating: 4.6, description: 'Biryani + Barbeque + Dessert', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Biryani': [
// // // //         { id: 19, name: 'Veg Biryani', price: 369, rating: 4.4, description: 'Fragrant basmati rice with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 20, name: 'Mutton Biryani', price: 549, rating: 4.8, description: 'Fragrant basmati rice with tender mutton', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Barbeque': [
// // // //         { id: 21, name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 22, name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //     }
// // // //   },
// // // //   'Barbeque Nation': {
// // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Starters', 'Main Course'],
// // // //     items: {
// // // //       'Recommended': [
// // // //         { id: 23, name: 'Chicken Tikka', price: 399, rating: 4.5, description: 'Grilled chicken tikka', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 24, name: 'Veg Platter', price: 349, rating: 4.2, description: 'Assorted grilled vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'QuickBite Special': [
// // // //         { id: 108, name: 'QuickBite Special Platter', price: 599, rating: 4.8, description: 'Special assorted starters', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 109, name: 'QuickBite Grill Special', price: 649, rating: 4.7, description: 'Special grilled items', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Offers': [
// // // //         { id: 208, name: 'Starters Combo', price: 449, rating: 4.4, description: '3 Starters + Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 209, name: 'Family Platter', price: 799, rating: 4.6, description: '5 Starters + Main Course', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Starters': [
// // // //         { id: 25, name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 26, name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Main Course': [
// // // //         { id: 27, name: 'Dal Makhani', price: 299, rating: 4.1, description: 'Slow cooked black dal', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 28, name: 'Chicken Curry', price: 379, rating: 4.3, description: 'Spicy chicken curry', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //     }
// // // //   },
// // // //   'McDonalds': {
// // // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Burgers', 'Sides'],
// // // //     items: {
// // // //       'Recommended': [
// // // //         { id: 29, name: 'Big Mac', price: 299, rating: 4.5, description: 'Classic double cheeseburger', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 30, name: 'French Fries', price: 99, rating: 4.2, description: 'Crispy golden fries', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 31, name: 'McChicken', price: 249, rating: 4.3, description: 'Crispy chicken burger', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'QuickBite Special': [
// // // //         { id: 110, name: 'QuickBite Mega Burger', price: 499, rating: 4.7, description: 'Huge burger with extra patty', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //         { id: 111, name: 'QuickBite Combo', price: 549, rating: 4.6, description: 'Burger + Fries + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Offers': [
// // // //         { id: 210, name: 'Meal Deal', price: 349, rating: 4.3, description: 'Burger + Fries + Small Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 211, name: 'Family Box', price: 799, rating: 4.5, description: '4 Burgers + 4 Fries + 4 Drinks', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Burgers': [
// // // //         { id: 32, name: 'Veg Burger', price: 199, rating: 4.1, description: 'Grilled veg patty with lettuce', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 33, name: 'Double Cheeseburger', price: 329, rating: 4.4, description: 'Two patties with cheese', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //       'Sides': [
// // // //         { id: 34, name: 'Onion Rings', price: 129, rating: 4.0, description: 'Crispy onion rings', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // // //         { id: 35, name: 'Chicken Nuggets', price: 179, rating: 4.1, description: 'Crispy chicken nuggets', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // // //       ],
// // // //     }
// // // //   },
// // // // };

// // // // const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
// // // //   const { restaurant } = route.params || {};
// // // //   const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useContext(CartContext);
// // // //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// // // //   const restaurantData = restaurant || {
// // // //     id: 1,
// // // //     name: 'Pizza Hut',
// // // //     rating: 4.0,
// // // //     deliveryTime: '30-35 mins',
// // // //     cuisine: 'Pizzas',
// // // //     image: 'https://via.placeholder.com/150',
// // // //     costForTwo: '₹800 for two',
// // // //     address: 'Sector 1, HSR Layout',
// // // //     isVeg: false,
// // // //     offer: '50% OFF UPTO ₹100',
// // // //   };

// // // //   // Get restaurant menu data
// // // //   const restaurantMenu = RESTAURANT_MENUS[restaurantData.name] || RESTAURANT_MENUS['Pizza Hut'];
// // // //   const categories = restaurantMenu.categories || ['Recommended', 'QuickBite Special', 'Offers'];
// // // //   const menuItems = restaurantMenu.items || {};

// // // //   const currentItems = menuItems[selectedCategory] || [];

// // // //   // Check if item is in cart
// // // //   const isItemInCart = (itemId: number) => {
// // // //     return cartItems.some(item => item.id === itemId && item.restaurantId === restaurantData.id);
// // // //   };

// // // //   // Get item quantity in cart
// // // //   const getItemQuantity = (itemId: number) => {
// // // //     const item = cartItems.find(i => i.id === itemId && i.restaurantId === restaurantData.id);
// // // //     return item ? item.quantity : 0;
// // // //   };

// // // //   const handleAddToCart = (item: any) => {
// // // //     const cartItem = {
// // // //       id: item.id,
// // // //       name: item.name,
// // // //       price: item.price,
// // // //       quantity: 1,
// // // //       image: item.image || 'https://via.placeholder.com/60',
// // // //       restaurantId: restaurantData.id,
// // // //       restaurantName: restaurantData.name,
// // // //     };
// // // //     addToCart(cartItem, restaurantData);
// // // //   };

// // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // //     if (newQuantity === 0) {
// // // //       removeFromCart(item.id, restaurantData.id);
// // // //     } else {
// // // //       updateQuantity(item.id, restaurantData.id, newQuantity);
// // // //     }
// // // //   };

// // // //   const renderCategoryTab = ({ item }: { item: string }) => (
// // // //     <TouchableOpacity
// // // //       style={[
// // // //         styles.categoryTab,
// // // //         selectedCategory === item && styles.activeCategoryTab,
// // // //       ]}
// // // //       onPress={() => setSelectedCategory(item)}
// // // //     >
// // // //       <Text
// // // //         style={[
// // // //           styles.categoryTabText,
// // // //           selectedCategory === item && styles.activeCategoryTabText,
// // // //         ]}
// // // //       >
// // // //         {item}
// // // //       </Text>
// // // //       {selectedCategory === item && <View style={styles.activeIndicator} />}
// // // //     </TouchableOpacity>
// // // //   );

// // // //   const renderMenuItem = ({ item }: { item: any }) => {
// // // //     const inCart = isItemInCart(item.id);
// // // //     const quantity = getItemQuantity(item.id);

// // // //     return (
// // // //       <View style={styles.menuItem}>
// // // //         <View style={styles.menuItemContent}>
// // // //           <View style={styles.menuItemInfo}>
// // // //             <View style={styles.menuItemHeader}>
// // // //               <Text style={styles.menuItemName}>{item.name}</Text>
// // // //               {item.isBestSeller && (
// // // //                 <View style={styles.bestsellerBadge}>
// // // //                   <Icon name="star" size={12} color="#ff6f00" />
// // // //                   <Text style={styles.bestsellerText}>BESTSELLER</Text>
// // // //                 </View>
// // // //               )}
// // // //             </View>
// // // //             <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// // // //             <View style={styles.menuItemRating}>
// // // //               <Icon name="star" size={14} color="#ffc107" />
// // // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // // //               <Text style={styles.vegNonVeg}>
// // // //                 {item.isVeg ? ' 🟢 Veg' : ' 🔴 Non-Veg'}
// // // //               </Text>
// // // //             </View>
// // // //             {item.description && (
// // // //               <Text style={styles.menuItemDescription} numberOfLines={2}>
// // // //                 {item.description}
// // // //               </Text>
// // // //             )}
// // // //           </View>
          
// // // //           {/* Quantity Controls or Add Button */}
// // // //           {inCart ? (
// // // //             <View style={styles.quantityContainer}>
// // // //               <TouchableOpacity
// // // //                 style={styles.quantityButton}
// // // //                 onPress={() => handleUpdateQuantity(item, quantity - 1)}
// // // //               >
// // // //                 <Icon name="remove" size={16} color="#fc8019" />
// // // //               </TouchableOpacity>
// // // //               <Text style={styles.quantityText}>{quantity}</Text>
// // // //               <TouchableOpacity
// // // //                 style={styles.quantityButton}
// // // //                 onPress={() => handleUpdateQuantity(item, quantity + 1)}
// // // //               >
// // // //                 <Icon name="add" size={16} color="#fc8019" />
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           ) : (
// // // //             <TouchableOpacity
// // // //               style={styles.addButton}
// // // //               onPress={() => handleAddToCart(item)}
// // // //             >
// // // //               <Text style={styles.addButtonText}>ADD</Text>
// // // //             </TouchableOpacity>
// // // //           )}
// // // //         </View>
// // // //         <View style={styles.divider} />
// // // //       </View>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // //         {/* Header Image */}
// // // //         <View style={styles.imageContainer}>
// // // //           <Image
// // // //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// // // //             style={styles.restaurantImage}
// // // //           />
// // // //           <TouchableOpacity
// // // //             style={styles.backButton}
// // // //             onPress={() => navigation.goBack()}
// // // //           >
// // // //             <Icon name="arrow-back" size={24} color="#ffffff" />
// // // //           </TouchableOpacity>
// // // //           <TouchableOpacity style={styles.favoriteButton}>
// // // //             <Icon name="heart-outline" size={24} color="#ffffff" />
// // // //           </TouchableOpacity>
// // // //         </View>

// // // //         {/* Restaurant Info */}
// // // //         <View style={styles.infoContainer}>
// // // //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
// // // //           <View style={styles.ratingContainer}>
// // // //             <View style={styles.ratingBadge}>
// // // //               <Icon name="star" size={14} color="#ffffff" />
// // // //               <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
// // // //             </View>
// // // //             <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// // // //             <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// // // //           </View>
// // // //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
// // // //           {restaurantData.offer && (
// // // //             <View style={styles.offerContainer}>
// // // //               <Text style={styles.offerText}>🎯 {restaurantData.offer}</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>

// // // //         {/* Category Tabs */}
// // // //         <View style={styles.categoriesContainer}>
// // // //           <FlatList
// // // //             data={categories}
// // // //             renderItem={renderCategoryTab}
// // // //             keyExtractor={(item) => item}
// // // //             horizontal
// // // //             showsHorizontalScrollIndicator={false}
// // // //             contentContainerStyle={styles.categoriesList}
// // // //           />
// // // //         </View>

// // // //         {/* Menu Items */}
// // // //         <View style={styles.menuContainer}>
// // // //           <View style={styles.menuHeader}>
// // // //             <Text style={styles.menuTitle}>{selectedCategory}</Text>
// // // //             <Text style={styles.menuCount}>{currentItems.length} items</Text>
// // // //           </View>
          
// // // //           {currentItems.length > 0 ? (
// // // //             <FlatList
// // // //               data={currentItems}
// // // //               renderItem={renderMenuItem}
// // // //               keyExtractor={(item) => item.id.toString()}
// // // //               scrollEnabled={false}
// // // //             />
// // // //           ) : (
// // // //             <View style={styles.emptyContainer}>
// // // //               <Icon name="restaurant-outline" size={60} color="#ccc" />
// // // //               <Text style={styles.emptyText}>No items in this category</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>

// // // //         <View style={styles.footerSpacing} />
// // // //       </ScrollView>

// // // //       {/* Floating Cart Button */}
// // // //       {cartItems.length > 0 && cartItems.some(item => item.restaurantId === restaurantData.id) && (
// // // //         <TouchableOpacity
// // // //           style={styles.cartButton}
// // // //           onPress={() => navigation.navigate('Cart')}
// // // //         >
// // // //           <View style={styles.cartButtonContent}>
// // // //             <Icon name="cart" size={24} color="#ffffff" />
// // // //             <Text style={styles.cartButtonText}>
// // // //               View Cart • {getTotalItems()} items • ₹{getTotalPrice()}
// // // //             </Text>
// // // //           </View>
// // // //         </TouchableOpacity>
// // // //       )}
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   imageContainer: {
// // // //     position: 'relative',
// // // //     height: 220,
// // // //   },
// // // //   restaurantImage: {
// // // //     width: '100%',
// // // //     height: '100%',
// // // //   },
// // // //   backButton: {
// // // //     position: 'absolute',
// // // //     top: 12,
// // // //     left: 16,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     borderRadius: 20,
// // // //     padding: 8,
// // // //   },
// // // //   favoriteButton: {
// // // //     position: 'absolute',
// // // //     top: 12,
// // // //     right: 16,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     borderRadius: 20,
// // // //     padding: 8,
// // // //   },
// // // //   infoContainer: {
// // // //     padding: 16,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   restaurantName: {
// // // //     fontSize: 22,
// // // //     fontWeight: '700',
// // // //     color: '#282c3f',
// // // //   },
// // // //   ratingContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 8,
// // // //   },
// // // //   ratingBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#28a745',
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 2,
// // // //     borderRadius: 4,
// // // //   },
// // // //   ratingBadgeText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //     marginLeft: 4,
// // // //   },
// // // //   deliveryTime: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //     marginLeft: 12,
// // // //   },
// // // //   costForTwo: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //     marginLeft: 12,
// // // //   },
// // // //   cuisine: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginTop: 6,
// // // //   },
// // // //   offerContainer: {
// // // //     marginTop: 8,
// // // //     backgroundColor: '#fff8e1',
// // // //     padding: 8,
// // // //     borderRadius: 6,
// // // //   },
// // // //   offerText: {
// // // //     fontSize: 13,
// // // //     color: '#ff6f00',
// // // //     fontWeight: '500',
// // // //   },
// // // //   categoriesContainer: {
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   categoriesList: {
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //   },
// // // //   categoryTab: {
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     marginRight: 4,
// // // //     position: 'relative',
// // // //   },
// // // //   activeCategoryTab: {
// // // //     // Active state styles (empty or with background if needed)
// // // //   },
// // // //   categoryTabText: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     fontWeight: '500',
// // // //   },
// // // //   activeCategoryTabText: {
// // // //     color: '#fc8019',
// // // //     fontWeight: '600',
// // // //   },
// // // //   activeIndicator: {
// // // //     position: 'absolute',
// // // //     bottom: 0,
// // // //     left: 16,
// // // //     right: 16,
// // // //     height: 3,
// // // //     backgroundColor: '#fc8019',
// // // //     borderRadius: 2,
// // // //   },
// // // //   menuContainer: {
// // // //     padding: 16,
// // // //     paddingBottom: 100,
// // // //   },
// // // //   menuHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //   },
// // // //   menuTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   menuCount: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //   },
// // // //   menuItem: {
// // // //     marginBottom: 4,
// // // //   },
// // // //   menuItemContent: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 12,
// // // //   },
// // // //   menuItemInfo: {
// // // //     flex: 1,
// // // //     marginRight: 12,
// // // //   },
// // // //   menuItemHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flexWrap: 'wrap',
// // // //   },
// // // //   menuItemName: {
// // // //     fontSize: 16,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //   },
// // // //   bestsellerBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fff8e1',
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 2,
// // // //     borderRadius: 4,
// // // //     marginLeft: 8,
// // // //   },
// // // //   bestsellerText: {
// // // //     fontSize: 10,
// // // //     color: '#ff6f00',
// // // //     fontWeight: '600',
// // // //     marginLeft: 4,
// // // //   },
// // // //   menuItemPrice: {
// // // //     fontSize: 15,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginTop: 4,
// // // //   },
// // // //   menuItemRating: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 4,
// // // //   },
// // // //   ratingText: {
// // // //     fontSize: 12,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //     marginLeft: 4,
// // // //   },
// // // //   vegNonVeg: {
// // // //     fontSize: 11,
// // // //     color: '#7e808c',
// // // //     marginLeft: 8,
// // // //   },
// // // //   menuItemDescription: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 4,
// // // //     lineHeight: 16,
// // // //   },
// // // //   addButton: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#fc8019',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 6,
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   addButtonText: {
// // // //     color: '#fc8019',
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //   },
// // // //   quantityContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: '#fc8019',
// // // //     borderRadius: 6,
// // // //     backgroundColor: '#ffffff',
// // // //     paddingHorizontal: 4,
// // // //   },
// // // //   quantityButton: {
// // // //     width: 28,
// // // //     height: 28,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   quantityText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     minWidth: 20,
// // // //     textAlign: 'center',
// // // //   },
// // // //   divider: {
// // // //     height: 1,
// // // //     backgroundColor: '#f0f0f5',
// // // //   },
// // // //   emptyContainer: {
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingVertical: 40,
// // // //   },
// // // //   emptyText: {
// // // //     fontSize: 16,
// // // //     color: '#7e808c',
// // // //     marginTop: 12,
// // // //   },
// // // //   footerSpacing: {
// // // //     height: 20,
// // // //   },
// // // //   cartButton: {
// // // //     position: 'absolute',
// // // //     bottom: 20,
// // // //     left: 16,
// // // //     right: 16,
// // // //     backgroundColor: '#fc8019',
// // // //     borderRadius: 12,
// // // //     padding: 14,
// // // //     elevation: 5,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.3,
// // // //     shadowRadius: 4,
// // // //   },
// // // //   cartButtonContent: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   cartButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     marginLeft: 12,
// // // //   },
// // // // });

// // // // export default RestaurantDetailScreen;
// // // import React, { useState, useContext } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   Image,
// // //   FlatList,
// // //   Alert,
// // //   SafeAreaView,
// // //   StatusBar,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { colors } from '../../constants/colors';
// // // import { CartContext } from '../../context/CartContext';

// // // interface RestaurantDetailScreenProps {
// // //   route: any;
// // //   navigation: any;
// // // }

// // // // Menu items organized by restaurant with categories - All IDs as strings
// // // const RESTAURANT_MENUS: Record<string, any> = {
// // //   'Pizza Hut': {
// // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Pizzas', 'Sides'],
// // //     items: {
// // //       'Recommended': [
// // //         { id: '1', name: 'Margherita Pizza', price: 369, rating: 4.3, description: 'Classic cheese pizza with tomato sauce', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '2', name: 'Pepperoni Pizza', price: 399, rating: 4.5, description: 'Pepperoni with mozzarella cheese', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '3', name: 'Garlic Bread', price: 149, rating: 4.1, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'QuickBite Special': [
// // //         { id: '101', name: 'QuickBite Special Pizza', price: 499, rating: 4.8, description: 'Loaded with extra cheese and premium toppings', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '102', name: 'QuickBite Combo Meal', price: 599, rating: 4.7, description: 'Pizza + Garlic Bread + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '103', name: 'QuickBite Burger', price: 349, rating: 4.6, description: 'Special burger with secret sauce', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Offers': [
// // //         { id: '201', name: 'Buy 1 Get 1 Pizza', price: 399, rating: 4.4, description: 'Buy one pizza get one free', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '202', name: 'Family Combo Deal', price: 799, rating: 4.5, description: '2 Large Pizzas + Garlic Bread + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '203', name: 'Student Special', price: 299, rating: 4.3, description: 'Small Pizza + Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Pizzas': [
// // //         { id: '4', name: 'Veggie Supreme', price: 429, rating: 4.2, description: 'Bell peppers, onions, mushrooms, olives', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '5', name: 'Chicken BBQ Pizza', price: 459, rating: 4.4, description: 'Grilled chicken with BBQ sauce', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '6', name: 'Paneer Pizza', price: 439, rating: 4.3, description: 'Paneer with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Sides': [
// // //         { id: '7', name: 'Cheese Sticks', price: 179, rating: 4.2, description: 'Crispy cheese sticks', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '8', name: 'Chicken Wings', price: 249, rating: 4.3, description: 'Spicy chicken wings', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //     }
// // //   },
// // //   'Chinese Wok': {
// // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Noodles', 'Rice'],
// // //     items: {
// // //       'Recommended': [
// // //         { id: '9', name: 'Chicken Noodles', price: 299, rating: 4.2, description: 'Stir-fried noodles with chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '10', name: 'Veg Fried Rice', price: 249, rating: 4.1, description: 'Fried rice with mixed vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '11', name: 'Spring Rolls', price: 199, rating: 4.0, description: 'Crispy vegetable spring rolls', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'QuickBite Special': [
// // //         { id: '104', name: 'QuickBite Special Noodles', price: 399, rating: 4.7, description: 'Loaded with exotic vegetables and sauce', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '105', name: 'QuickBite Combo', price: 499, rating: 4.6, description: 'Noodles + Manchurian + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Offers': [
// // //         { id: '204', name: 'Weekend Combo', price: 449, rating: 4.4, description: 'Noodles + Fried Rice + Manchurian', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '205', name: 'Family Pack', price: 699, rating: 4.5, description: '4 Items + 4 Drinks', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Noodles': [
// // //         { id: '12', name: 'Chilli Garlic Noodles', price: 329, rating: 4.3, description: 'Spicy noodles with garlic', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '13', name: 'Singapore Noodles', price: 349, rating: 4.2, description: 'Curry flavored noodles', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Rice': [
// // //         { id: '14', name: 'Chicken Fried Rice', price: 329, rating: 4.4, description: 'Fried rice with chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '15', name: 'Veg Schezwan Rice', price: 279, rating: 4.1, description: 'Spicy schezwan rice with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //     }
// // //   },
// // //   'UBQ by Barbeque Nation': {
// // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Biryani', 'Barbeque'],
// // //     items: {
// // //       'Recommended': [
// // //         { id: '16', name: 'Chicken Biryani', price: 449, rating: 4.7, description: 'Fragrant basmati rice with spicy chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '17', name: 'Tandoori Chicken', price: 399, rating: 4.6, description: 'Grilled chicken in tandoori spices', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '18', name: 'Paneer Tikka', price: 349, rating: 4.3, description: 'Grilled paneer with bell peppers', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'QuickBite Special': [
// // //         { id: '106', name: 'QuickBite Special Biryani', price: 599, rating: 4.9, description: 'Special biryani with extra meat', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '107', name: 'QuickBite Barbeque Platter', price: 699, rating: 4.8, description: 'Assorted barbeque items', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Offers': [
// // //         { id: '206', name: 'Biryani Combo', price: 549, rating: 4.5, description: 'Biryani + Raita + Gulab Jamun', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '207', name: 'Family Feast', price: 899, rating: 4.6, description: 'Biryani + Barbeque + Dessert', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Biryani': [
// // //         { id: '19', name: 'Veg Biryani', price: 369, rating: 4.4, description: 'Fragrant basmati rice with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '20', name: 'Mutton Biryani', price: 549, rating: 4.8, description: 'Fragrant basmati rice with tender mutton', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Barbeque': [
// // //         { id: '21', name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '22', name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //     }
// // //   },
// // //   'Barbeque Nation': {
// // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Starters', 'Main Course'],
// // //     items: {
// // //       'Recommended': [
// // //         { id: '23', name: 'Chicken Tikka', price: 399, rating: 4.5, description: 'Grilled chicken tikka', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '24', name: 'Veg Platter', price: 349, rating: 4.2, description: 'Assorted grilled vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'QuickBite Special': [
// // //         { id: '108', name: 'QuickBite Special Platter', price: 599, rating: 4.8, description: 'Special assorted starters', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '109', name: 'QuickBite Grill Special', price: 649, rating: 4.7, description: 'Special grilled items', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Offers': [
// // //         { id: '208', name: 'Starters Combo', price: 449, rating: 4.4, description: '3 Starters + Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '209', name: 'Family Platter', price: 799, rating: 4.6, description: '5 Starters + Main Course', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Starters': [
// // //         { id: '25', name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '26', name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Main Course': [
// // //         { id: '27', name: 'Dal Makhani', price: 299, rating: 4.1, description: 'Slow cooked black dal', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '28', name: 'Chicken Curry', price: 379, rating: 4.3, description: 'Spicy chicken curry', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //     }
// // //   },
// // //   'McDonalds': {
// // //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Burgers', 'Sides'],
// // //     items: {
// // //       'Recommended': [
// // //         { id: '29', name: 'Big Mac', price: 299, rating: 4.5, description: 'Classic double cheeseburger', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '30', name: 'French Fries', price: 99, rating: 4.2, description: 'Crispy golden fries', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '31', name: 'McChicken', price: 249, rating: 4.3, description: 'Crispy chicken burger', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'QuickBite Special': [
// // //         { id: '110', name: 'QuickBite Mega Burger', price: 499, rating: 4.7, description: 'Huge burger with extra patty', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //         { id: '111', name: 'QuickBite Combo', price: 549, rating: 4.6, description: 'Burger + Fries + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Offers': [
// // //         { id: '210', name: 'Meal Deal', price: 349, rating: 4.3, description: 'Burger + Fries + Small Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '211', name: 'Family Box', price: 799, rating: 4.5, description: '4 Burgers + 4 Fries + 4 Drinks', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Burgers': [
// // //         { id: '32', name: 'Veg Burger', price: 199, rating: 4.1, description: 'Grilled veg patty with lettuce', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '33', name: 'Double Cheeseburger', price: 329, rating: 4.4, description: 'Two patties with cheese', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //       'Sides': [
// // //         { id: '34', name: 'Onion Rings', price: 129, rating: 4.0, description: 'Crispy onion rings', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// // //         { id: '35', name: 'Chicken Nuggets', price: 179, rating: 4.1, description: 'Crispy chicken nuggets', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// // //       ],
// // //     }
// // //   },
// // // };

// // // const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
// // //   const { restaurant } = route.params || {};
// // //   const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useContext(CartContext);
// // //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// // //   const restaurantData = restaurant || {
// // //     id: '1',  // Changed to string
// // //     name: 'Pizza Hut',
// // //     rating: 4.0,
// // //     deliveryTime: '30-35 mins',
// // //     cuisine: 'Pizzas',
// // //     image: 'https://via.placeholder.com/150',
// // //     costForTwo: '₹800 for two',
// // //     address: 'Sector 1, HSR Layout',
// // //     isVeg: false,
// // //     offer: '50% OFF UPTO ₹100',
// // //   };

// // //   // Get restaurant menu data
// // //   const restaurantMenu = RESTAURANT_MENUS[restaurantData.name] || RESTAURANT_MENUS['Pizza Hut'];
// // //   const categories = restaurantMenu.categories || ['Recommended', 'QuickBite Special', 'Offers'];
// // //   const menuItems = restaurantMenu.items || {};

// // //   const currentItems = menuItems[selectedCategory] || [];

// // //   // Check if item is in cart - using string comparison
// // //   const isItemInCart = (itemId: string) => {
// // //     return cartItems.some(item => item.id === itemId && item.restaurantId === restaurantData.id);
// // //   };

// // //   // Get item quantity in cart
// // //   const getItemQuantity = (itemId: string) => {
// // //     const item = cartItems.find(i => i.id === itemId && i.restaurantId === restaurantData.id);
// // //     return item ? item.quantity : 0;
// // //   };

// // //   const handleAddToCart = (item: any) => {
// // //     const cartItem = {
// // //       id: item.id,
// // //       name: item.name,
// // //       price: item.price,
// // //       quantity: 1,
// // //       image: item.image || 'https://via.placeholder.com/60',
// // //       restaurantId: restaurantData.id,
// // //       restaurantName: restaurantData.name,
// // //     };
// // //     addToCart(cartItem, restaurantData);
// // //   };

// // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // //     if (newQuantity === 0) {
// // //       removeFromCart(item.id, restaurantData.id);
// // //     } else {
// // //       updateQuantity(item.id, restaurantData.id, newQuantity);
// // //     }
// // //   };

// // //   const renderCategoryTab = ({ item }: { item: string }) => (
// // //     <TouchableOpacity
// // //       style={[
// // //         styles.categoryTab,
// // //         selectedCategory === item && styles.activeCategoryTab,
// // //       ]}
// // //       onPress={() => setSelectedCategory(item)}
// // //     >
// // //       <Text
// // //         style={[
// // //           styles.categoryTabText,
// // //           selectedCategory === item && styles.activeCategoryTabText,
// // //         ]}
// // //       >
// // //         {item}
// // //       </Text>
// // //       {selectedCategory === item && <View style={styles.activeIndicator} />}
// // //     </TouchableOpacity>
// // //   );

// // //   const renderMenuItem = ({ item }: { item: any }) => {
// // //     const inCart = isItemInCart(item.id);
// // //     const quantity = getItemQuantity(item.id);

// // //     return (
// // //       <View style={styles.menuItem}>
// // //         <View style={styles.menuItemContent}>
// // //           <View style={styles.menuItemInfo}>
// // //             <View style={styles.menuItemHeader}>
// // //               <Text style={styles.menuItemName}>{item.name}</Text>
// // //               {item.isBestSeller && (
// // //                 <View style={styles.bestsellerBadge}>
// // //                   <Icon name="star" size={12} color="#ff6f00" />
// // //                   <Text style={styles.bestsellerText}>BESTSELLER</Text>
// // //                 </View>
// // //               )}
// // //             </View>
// // //             <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// // //             <View style={styles.menuItemRating}>
// // //               <Icon name="star" size={14} color="#ffc107" />
// // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // //               <Text style={styles.vegNonVeg}>
// // //                 {item.isVeg ? ' 🟢 Veg' : ' 🔴 Non-Veg'}
// // //               </Text>
// // //             </View>
// // //             {item.description && (
// // //               <Text style={styles.menuItemDescription} numberOfLines={2}>
// // //                 {item.description}
// // //               </Text>
// // //             )}
// // //           </View>
          
// // //           {/* Quantity Controls or Add Button */}
// // //           {inCart ? (
// // //             <View style={styles.quantityContainer}>
// // //               <TouchableOpacity
// // //                 style={styles.quantityButton}
// // //                 onPress={() => handleUpdateQuantity(item, quantity - 1)}
// // //               >
// // //                 <Icon name="remove" size={16} color="#fc8019" />
// // //               </TouchableOpacity>
// // //               <Text style={styles.quantityText}>{quantity}</Text>
// // //               <TouchableOpacity
// // //                 style={styles.quantityButton}
// // //                 onPress={() => handleUpdateQuantity(item, quantity + 1)}
// // //               >
// // //                 <Icon name="add" size={16} color="#fc8019" />
// // //               </TouchableOpacity>
// // //             </View>
// // //           ) : (
// // //             <TouchableOpacity
// // //               style={styles.addButton}
// // //               onPress={() => handleAddToCart(item)}
// // //             >
// // //               <Text style={styles.addButtonText}>ADD</Text>
// // //             </TouchableOpacity>
// // //           )}
// // //         </View>
// // //         <View style={styles.divider} />
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // //       <ScrollView showsVerticalScrollIndicator={false}>
// // //         {/* Header Image */}
// // //         <View style={styles.imageContainer}>
// // //           <Image
// // //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// // //             style={styles.restaurantImage}
// // //           />
// // //           <TouchableOpacity
// // //             style={styles.backButton}
// // //             onPress={() => navigation.goBack()}
// // //           >
// // //             <Icon name="arrow-back" size={24} color="#ffffff" />
// // //           </TouchableOpacity>
// // //           <TouchableOpacity style={styles.favoriteButton}>
// // //             <Icon name="heart-outline" size={24} color="#ffffff" />
// // //           </TouchableOpacity>
// // //         </View>

// // //         {/* Restaurant Info */}
// // //         <View style={styles.infoContainer}>
// // //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
// // //           <View style={styles.ratingContainer}>
// // //             <View style={styles.ratingBadge}>
// // //               <Icon name="star" size={14} color="#ffffff" />
// // //               <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
// // //             </View>
// // //             <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// // //             <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// // //           </View>
// // //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
// // //           {restaurantData.offer && (
// // //             <View style={styles.offerContainer}>
// // //               <Text style={styles.offerText}>🎯 {restaurantData.offer}</Text>
// // //             </View>
// // //           )}
// // //         </View>

// // //         {/* Category Tabs */}
// // //         <View style={styles.categoriesContainer}>
// // //           <FlatList
// // //             data={categories}
// // //             renderItem={renderCategoryTab}
// // //             keyExtractor={(item) => item}
// // //             horizontal
// // //             showsHorizontalScrollIndicator={false}
// // //             contentContainerStyle={styles.categoriesList}
// // //           />
// // //         </View>

// // //         {/* Menu Items */}
// // //         <View style={styles.menuContainer}>
// // //           <View style={styles.menuHeader}>
// // //             <Text style={styles.menuTitle}>{selectedCategory}</Text>
// // //             <Text style={styles.menuCount}>{currentItems.length} items</Text>
// // //           </View>
          
// // //           {currentItems.length > 0 ? (
// // //             <FlatList
// // //               data={currentItems}
// // //               renderItem={renderMenuItem}
// // //               keyExtractor={(item) => item.id}
// // //               scrollEnabled={false}
// // //             />
// // //           ) : (
// // //             <View style={styles.emptyContainer}>
// // //               <Icon name="restaurant-outline" size={60} color="#ccc" />
// // //               <Text style={styles.emptyText}>No items in this category</Text>
// // //             </View>
// // //           )}
// // //         </View>

// // //         <View style={styles.footerSpacing} />
// // //       </ScrollView>

// // //       {/* Floating Cart Button */}
// // //       {cartItems.length > 0 && cartItems.some(item => item.restaurantId === restaurantData.id) && (
// // //         <TouchableOpacity
// // //           style={styles.cartButton}
// // //           onPress={() => navigation.navigate('Cart')}
// // //         >
// // //           <View style={styles.cartButtonContent}>
// // //             <Icon name="cart" size={24} color="#ffffff" />
// // //             <Text style={styles.cartButtonText}>
// // //               View Cart • {getTotalItems()} items • ₹{getTotalPrice()}
// // //             </Text>
// // //           </View>
// // //         </TouchableOpacity>
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   imageContainer: {
// // //     position: 'relative',
// // //     height: 220,
// // //   },
// // //   restaurantImage: {
// // //     width: '100%',
// // //     height: '100%',
// // //   },
// // //   backButton: {
// // //     position: 'absolute',
// // //     top: 12,
// // //     left: 16,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     borderRadius: 20,
// // //     padding: 8,
// // //   },
// // //   favoriteButton: {
// // //     position: 'absolute',
// // //     top: 12,
// // //     right: 16,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     borderRadius: 20,
// // //     padding: 8,
// // //   },
// // //   infoContainer: {
// // //     padding: 16,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   restaurantName: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: '#282c3f',
// // //   },
// // //   ratingContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 8,
// // //   },
// // //   ratingBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#28a745',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 2,
// // //     borderRadius: 4,
// // //   },
// // //   ratingBadgeText: {
// // //     color: '#ffffff',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     marginLeft: 4,
// // //   },
// // //   deliveryTime: {
// // //     fontSize: 13,
// // //     color: '#7e808c',
// // //     marginLeft: 12,
// // //   },
// // //   costForTwo: {
// // //     fontSize: 13,
// // //     color: '#7e808c',
// // //     marginLeft: 12,
// // //   },
// // //   cuisine: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginTop: 6,
// // //   },
// // //   offerContainer: {
// // //     marginTop: 8,
// // //     backgroundColor: '#fff8e1',
// // //     padding: 8,
// // //     borderRadius: 6,
// // //   },
// // //   offerText: {
// // //     fontSize: 13,
// // //     color: '#ff6f00',
// // //     fontWeight: '500',
// // //   },
// // //   categoriesContainer: {
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   categoriesList: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //   },
// // //   categoryTab: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     marginRight: 4,
// // //     position: 'relative',
// // //   },
// // //   activeCategoryTab: {},
// // //   categoryTabText: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     fontWeight: '500',
// // //   },
// // //   activeCategoryTabText: {
// // //     color: '#fc8019',
// // //     fontWeight: '600',
// // //   },
// // //   activeIndicator: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 16,
// // //     right: 16,
// // //     height: 3,
// // //     backgroundColor: '#fc8019',
// // //     borderRadius: 2,
// // //   },
// // //   menuContainer: {
// // //     padding: 16,
// // //     paddingBottom: 100,
// // //   },
// // //   menuHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   menuTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   menuCount: {
// // //     fontSize: 13,
// // //     color: '#7e808c',
// // //   },
// // //   menuItem: {
// // //     marginBottom: 4,
// // //   },
// // //   menuItemContent: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 12,
// // //   },
// // //   menuItemInfo: {
// // //     flex: 1,
// // //     marginRight: 12,
// // //   },
// // //   menuItemHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flexWrap: 'wrap',
// // //   },
// // //   menuItemName: {
// // //     fontSize: 16,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //   },
// // //   bestsellerBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff8e1',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 2,
// // //     borderRadius: 4,
// // //     marginLeft: 8,
// // //   },
// // //   bestsellerText: {
// // //     fontSize: 10,
// // //     color: '#ff6f00',
// // //     fontWeight: '600',
// // //     marginLeft: 4,
// // //   },
// // //   menuItemPrice: {
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginTop: 4,
// // //   },
// // //   menuItemRating: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 4,
// // //   },
// // //   ratingText: {
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //     marginLeft: 4,
// // //   },
// // //   vegNonVeg: {
// // //     fontSize: 11,
// // //     color: '#7e808c',
// // //     marginLeft: 8,
// // //   },
// // //   menuItemDescription: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 4,
// // //     lineHeight: 16,
// // //   },
// // //   addButton: {
// // //     borderWidth: 1,
// // //     borderColor: '#fc8019',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 6,
// // //     borderRadius: 6,
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   addButtonText: {
// // //     color: '#fc8019',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   quantityContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#fc8019',
// // //     borderRadius: 6,
// // //     backgroundColor: '#ffffff',
// // //     paddingHorizontal: 4,
// // //   },
// // //   quantityButton: {
// // //     width: 28,
// // //     height: 28,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   quantityText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     minWidth: 20,
// // //     textAlign: 'center',
// // //   },
// // //   divider: {
// // //     height: 1,
// // //     backgroundColor: '#f0f0f5',
// // //   },
// // //   emptyContainer: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 40,
// // //   },
// // //   emptyText: {
// // //     fontSize: 16,
// // //     color: '#7e808c',
// // //     marginTop: 12,
// // //   },
// // //   footerSpacing: {
// // //     height: 20,
// // //   },
// // //   cartButton: {
// // //     position: 'absolute',
// // //     bottom: 20,
// // //     left: 16,
// // //     right: 16,
// // //     backgroundColor: '#fc8019',
// // //     borderRadius: 12,
// // //     padding: 14,
// // //     elevation: 5,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 4,
// // //   },
// // //   cartButtonContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   cartButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     marginLeft: 12,
// // //   },
// // // });

// // // export default RestaurantDetailScreen;
// // import React, { useState, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Image,
// //   FlatList,
// //   Alert,
// //   SafeAreaView,
// //   StatusBar,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { colors } from '../../constants/colors';
// // import { CartContext } from '../../context/CartContext';

// // interface RestaurantDetailScreenProps {
// //   route: any;
// //   navigation: any;
// // }

// // interface ProductData {
// //   price: number;
// //   stock: number;
// //   category: string;
// //   description?: string;
// //   brand?: string;
// //   vendor?: string;
// //   gst?: number;
// //   unit?: string;
// //   barcode?: string;
// //   sku?: string;
// // }

// // interface RestaurantData {
// //   id: string;
// //   name: string;
// //   rating: number;
// //   deliveryTime: string;
// //   cuisine: string;
// //   image: string;
// //   costForTwo: string;
// //   address: string;
// //   isVeg: boolean;
// //   offer?: string;
// //   productData?: ProductData;
// // }

// // // Menu items organized by restaurant with categories - All IDs as strings
// // const RESTAURANT_MENUS: Record<string, any> = {
// //   'Pizza Hut': {
// //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Pizzas', 'Sides'],
// //     items: {
// //       'Recommended': [
// //         { id: '1', name: 'Margherita Pizza', price: 369, rating: 4.3, description: 'Classic cheese pizza with tomato sauce', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '2', name: 'Pepperoni Pizza', price: 399, rating: 4.5, description: 'Pepperoni with mozzarella cheese', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '3', name: 'Garlic Bread', price: 149, rating: 4.1, description: 'Garlic bread with cheese', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'QuickBite Special': [
// //         { id: '101', name: 'QuickBite Special Pizza', price: 499, rating: 4.8, description: 'Loaded with extra cheese and premium toppings', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '102', name: 'QuickBite Combo Meal', price: 599, rating: 4.7, description: 'Pizza + Garlic Bread + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '103', name: 'QuickBite Burger', price: 349, rating: 4.6, description: 'Special burger with secret sauce', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Offers': [
// //         { id: '201', name: 'Buy 1 Get 1 Pizza', price: 399, rating: 4.4, description: 'Buy one pizza get one free', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '202', name: 'Family Combo Deal', price: 799, rating: 4.5, description: '2 Large Pizzas + Garlic Bread + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '203', name: 'Student Special', price: 299, rating: 4.3, description: 'Small Pizza + Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Pizzas': [
// //         { id: '4', name: 'Veggie Supreme', price: 429, rating: 4.2, description: 'Bell peppers, onions, mushrooms, olives', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '5', name: 'Chicken BBQ Pizza', price: 459, rating: 4.4, description: 'Grilled chicken with BBQ sauce', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '6', name: 'Paneer Pizza', price: 439, rating: 4.3, description: 'Paneer with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Sides': [
// //         { id: '7', name: 'Cheese Sticks', price: 179, rating: 4.2, description: 'Crispy cheese sticks', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '8', name: 'Chicken Wings', price: 249, rating: 4.3, description: 'Spicy chicken wings', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //     }
// //   },
// //   'Chinese Wok': {
// //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Noodles', 'Rice'],
// //     items: {
// //       'Recommended': [
// //         { id: '9', name: 'Chicken Noodles', price: 299, rating: 4.2, description: 'Stir-fried noodles with chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '10', name: 'Veg Fried Rice', price: 249, rating: 4.1, description: 'Fried rice with mixed vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '11', name: 'Spring Rolls', price: 199, rating: 4.0, description: 'Crispy vegetable spring rolls', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'QuickBite Special': [
// //         { id: '104', name: 'QuickBite Special Noodles', price: 399, rating: 4.7, description: 'Loaded with exotic vegetables and sauce', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '105', name: 'QuickBite Combo', price: 499, rating: 4.6, description: 'Noodles + Manchurian + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Offers': [
// //         { id: '204', name: 'Weekend Combo', price: 449, rating: 4.4, description: 'Noodles + Fried Rice + Manchurian', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '205', name: 'Family Pack', price: 699, rating: 4.5, description: '4 Items + 4 Drinks', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Noodles': [
// //         { id: '12', name: 'Chilli Garlic Noodles', price: 329, rating: 4.3, description: 'Spicy noodles with garlic', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '13', name: 'Singapore Noodles', price: 349, rating: 4.2, description: 'Curry flavored noodles', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Rice': [
// //         { id: '14', name: 'Chicken Fried Rice', price: 329, rating: 4.4, description: 'Fried rice with chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '15', name: 'Veg Schezwan Rice', price: 279, rating: 4.1, description: 'Spicy schezwan rice with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //     }
// //   },
// //   'UBQ by Barbeque Nation': {
// //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Biryani', 'Barbeque'],
// //     items: {
// //       'Recommended': [
// //         { id: '16', name: 'Chicken Biryani', price: 449, rating: 4.7, description: 'Fragrant basmati rice with spicy chicken', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '17', name: 'Tandoori Chicken', price: 399, rating: 4.6, description: 'Grilled chicken in tandoori spices', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '18', name: 'Paneer Tikka', price: 349, rating: 4.3, description: 'Grilled paneer with bell peppers', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'QuickBite Special': [
// //         { id: '106', name: 'QuickBite Special Biryani', price: 599, rating: 4.9, description: 'Special biryani with extra meat', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '107', name: 'QuickBite Barbeque Platter', price: 699, rating: 4.8, description: 'Assorted barbeque items', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Offers': [
// //         { id: '206', name: 'Biryani Combo', price: 549, rating: 4.5, description: 'Biryani + Raita + Gulab Jamun', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '207', name: 'Family Feast', price: 899, rating: 4.6, description: 'Biryani + Barbeque + Dessert', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Biryani': [
// //         { id: '19', name: 'Veg Biryani', price: 369, rating: 4.4, description: 'Fragrant basmati rice with vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '20', name: 'Mutton Biryani', price: 549, rating: 4.8, description: 'Fragrant basmati rice with tender mutton', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Barbeque': [
// //         { id: '21', name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '22', name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //     }
// //   },
// //   'Barbeque Nation': {
// //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Starters', 'Main Course'],
// //     items: {
// //       'Recommended': [
// //         { id: '23', name: 'Chicken Tikka', price: 399, rating: 4.5, description: 'Grilled chicken tikka', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '24', name: 'Veg Platter', price: 349, rating: 4.2, description: 'Assorted grilled vegetables', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'QuickBite Special': [
// //         { id: '108', name: 'QuickBite Special Platter', price: 599, rating: 4.8, description: 'Special assorted starters', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '109', name: 'QuickBite Grill Special', price: 649, rating: 4.7, description: 'Special grilled items', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Offers': [
// //         { id: '208', name: 'Starters Combo', price: 449, rating: 4.4, description: '3 Starters + Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '209', name: 'Family Platter', price: 799, rating: 4.6, description: '5 Starters + Main Course', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Starters': [
// //         { id: '25', name: 'Fish Tikka', price: 429, rating: 4.4, description: 'Grilled fish with spices', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '26', name: 'Mushroom Tikka', price: 319, rating: 4.1, description: 'Grilled mushrooms with spices', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Main Course': [
// //         { id: '27', name: 'Dal Makhani', price: 299, rating: 4.1, description: 'Slow cooked black dal', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '28', name: 'Chicken Curry', price: 379, rating: 4.3, description: 'Spicy chicken curry', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //     }
// //   },
// //   'McDonalds': {
// //     categories: ['Recommended', 'QuickBite Special', 'Offers', 'Burgers', 'Sides'],
// //     items: {
// //       'Recommended': [
// //         { id: '29', name: 'Big Mac', price: 299, rating: 4.5, description: 'Classic double cheeseburger', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '30', name: 'French Fries', price: 99, rating: 4.2, description: 'Crispy golden fries', isBestSeller: true, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '31', name: 'McChicken', price: 249, rating: 4.3, description: 'Crispy chicken burger', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'QuickBite Special': [
// //         { id: '110', name: 'QuickBite Mega Burger', price: 499, rating: 4.7, description: 'Huge burger with extra patty', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //         { id: '111', name: 'QuickBite Combo', price: 549, rating: 4.6, description: 'Burger + Fries + Drink', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Offers': [
// //         { id: '210', name: 'Meal Deal', price: 349, rating: 4.3, description: 'Burger + Fries + Small Drink', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '211', name: 'Family Box', price: 799, rating: 4.5, description: '4 Burgers + 4 Fries + 4 Drinks', isBestSeller: true, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Burgers': [
// //         { id: '32', name: 'Veg Burger', price: 199, rating: 4.1, description: 'Grilled veg patty with lettuce', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '33', name: 'Double Cheeseburger', price: 329, rating: 4.4, description: 'Two patties with cheese', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //       'Sides': [
// //         { id: '34', name: 'Onion Rings', price: 129, rating: 4.0, description: 'Crispy onion rings', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //         { id: '35', name: 'Chicken Nuggets', price: 179, rating: 4.1, description: 'Crispy chicken nuggets', isBestSeller: false, isVeg: false, image: 'https://via.placeholder.com/60' },
// //       ],
// //     }
// //   },
// // };

// // // Default product menu for any product
// // const DEFAULT_PRODUCT_MENU = {
// //   categories: ['Product Details', 'Specifications', 'Reviews'],
// //   items: {
// //     'Product Details': [
// //       { id: 'p1', name: 'Product Information', price: 0, rating: 0, description: 'Product details', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //     ],
// //     'Specifications': [
// //       { id: 'p2', name: 'Technical Specs', price: 0, rating: 0, description: 'Product specifications', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //     ],
// //     'Reviews': [
// //       { id: 'p3', name: 'Customer Reviews', price: 0, rating: 0, description: 'Reviews and ratings', isBestSeller: false, isVeg: true, image: 'https://via.placeholder.com/60' },
// //     ],
// //   }
// // };

// // const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
// //   const { restaurant } = route.params || {};
// //   const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useContext(CartContext);
// //   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');

// //   // Check if this is a product (has productData) or restaurant
// //   const isProduct = restaurant?.productData !== undefined;
// //   const productData = restaurant?.productData as ProductData | undefined;

// //   // Restaurant data with fallback
// //   const restaurantData: RestaurantData = restaurant || {
// //     id: '1',
// //     name: 'Pizza Hut',
// //     rating: 4.0,
// //     deliveryTime: '30-35 mins',
// //     cuisine: 'Pizzas',
// //     image: 'https://via.placeholder.com/150',
// //     costForTwo: '₹800 for two',
// //     address: 'Sector 1, HSR Layout',
// //     isVeg: false,
// //     offer: '50% OFF UPTO ₹100',
// //   };

// //   // Get restaurant menu data
// //   const restaurantMenu = RESTAURANT_MENUS[restaurantData.name] || 
// //     (isProduct ? DEFAULT_PRODUCT_MENU : RESTAURANT_MENUS['Pizza Hut']);
  
// //   const categories = restaurantMenu.categories || ['Recommended', 'QuickBite Special', 'Offers'];
// //   const menuItems = restaurantMenu.items || {};

// //   const currentItems = menuItems[selectedCategory] || [];

// //   // Check if item is in cart - using string comparison
// //   const isItemInCart = (itemId: string) => {
// //     return cartItems.some(item => item.id === itemId && item.restaurantId === restaurantData.id);
// //   };

// //   // Get item quantity in cart
// //   const getItemQuantity = (itemId: string) => {
// //     const item = cartItems.find(i => i.id === itemId && i.restaurantId === restaurantData.id);
// //     return item ? item.quantity : 0;
// //   };

// //   const handleAddToCart = (item: any) => {
// //     const cartItem = {
// //       id: item.id,
// //       name: item.name,
// //       price: item.price,
// //       quantity: 1,
// //       image: item.image || 'https://via.placeholder.com/60',
// //       restaurantId: restaurantData.id,
// //       restaurantName: restaurantData.name,
// //     };
// //     addToCart(cartItem, restaurantData);
// //   };

// //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// //     if (newQuantity === 0) {
// //       removeFromCart(item.id, restaurantData.id);
// //     } else {
// //       updateQuantity(item.id, restaurantData.id, newQuantity);
// //     }
// //   };

// //   const renderCategoryTab = ({ item }: { item: string }) => (
// //     <TouchableOpacity
// //       style={[
// //         styles.categoryTab,
// //         selectedCategory === item && styles.activeCategoryTab,
// //       ]}
// //       onPress={() => setSelectedCategory(item)}
// //     >
// //       <Text
// //         style={[
// //           styles.categoryTabText,
// //           selectedCategory === item && styles.activeCategoryTabText,
// //         ]}
// //       >
// //         {item}
// //       </Text>
// //       {selectedCategory === item && <View style={styles.activeIndicator} />}
// //     </TouchableOpacity>
// //   );

// //   const renderMenuItem = ({ item }: { item: any }) => {
// //     const inCart = isItemInCart(item.id);
// //     const quantity = getItemQuantity(item.id);

// //     return (
// //       <View style={styles.menuItem}>
// //         <View style={styles.menuItemContent}>
// //           <View style={styles.menuItemInfo}>
// //             <View style={styles.menuItemHeader}>
// //               <Text style={styles.menuItemName}>{item.name}</Text>
// //               {item.isBestSeller && (
// //                 <View style={styles.bestsellerBadge}>
// //                   <Icon name="star" size={12} color="#ff6f00" />
// //                   <Text style={styles.bestsellerText}>BESTSELLER</Text>
// //                 </View>
// //               )}
// //             </View>
// //             {item.price > 0 && (
// //               <Text style={styles.menuItemPrice}>₹{item.price}</Text>
// //             )}
// //             {item.rating > 0 && (
// //               <View style={styles.menuItemRating}>
// //                 <Icon name="star" size={14} color="#ffc107" />
// //                 <Text style={styles.ratingText}>{item.rating}</Text>
// //                 <Text style={styles.vegNonVeg}>
// //                   {item.isVeg ? ' 🟢 Veg' : ' 🔴 Non-Veg'}
// //                 </Text>
// //               </View>
// //             )}
// //             {item.description && (
// //               <Text style={styles.menuItemDescription} numberOfLines={2}>
// //                 {item.description}
// //               </Text>
// //             )}
// //           </View>
          
// //           {/* Only show add button if it's a real product with price */}
// //           {item.price > 0 && (
// //             inCart ? (
// //               <View style={styles.quantityContainer}>
// //                 <TouchableOpacity
// //                   style={styles.quantityButton}
// //                   onPress={() => handleUpdateQuantity(item, quantity - 1)}
// //                 >
// //                   <Icon name="remove" size={16} color="#fc8019" />
// //                 </TouchableOpacity>
// //                 <Text style={styles.quantityText}>{quantity}</Text>
// //                 <TouchableOpacity
// //                   style={styles.quantityButton}
// //                   onPress={() => handleUpdateQuantity(item, quantity + 1)}
// //                 >
// //                   <Icon name="add" size={16} color="#fc8019" />
// //                 </TouchableOpacity>
// //               </View>
// //             ) : (
// //               <TouchableOpacity
// //                 style={styles.addButton}
// //                 onPress={() => handleAddToCart(item)}
// //               >
// //                 <Text style={styles.addButtonText}>ADD</Text>
// //               </TouchableOpacity>
// //             )
// //           )}
// //         </View>
// //         <View style={styles.divider} />
// //       </View>
// //     );
// //   };

// //   // Render product details section (for product view)
// //   const renderProductDetails = () => {
// //     if (!isProduct || !productData) return null;

// //     return (
// //       <View style={styles.productDetailsContainer}>
// //         <View style={styles.productInfoRow}>
// //           <Text style={styles.productLabel}>Price:</Text>
// //           <Text style={styles.productValue}>₹{productData.price}</Text>
// //         </View>
// //         <View style={styles.productInfoRow}>
// //           <Text style={styles.productLabel}>Category:</Text>
// //           <Text style={styles.productValue}>{productData.category}</Text>
// //         </View>
// //         <View style={styles.productInfoRow}>
// //           <Text style={styles.productLabel}>Stock:</Text>
// //           <Text style={[styles.productValue, { color: productData.stock > 10 ? '#28a745' : '#dc3545' }]}>
// //             {productData.stock} units {productData.stock <= 5 && '🔴 Low Stock'}
// //           </Text>
// //         </View>
// //         {productData.brand && (
// //           <View style={styles.productInfoRow}>
// //             <Text style={styles.productLabel}>Brand:</Text>
// //             <Text style={styles.productValue}>{productData.brand}</Text>
// //           </View>
// //         )}
// //         {productData.vendor && (
// //           <View style={styles.productInfoRow}>
// //             <Text style={styles.productLabel}>Vendor:</Text>
// //             <Text style={styles.productValue}>{productData.vendor}</Text>
// //           </View>
// //         )}
// //         {productData.unit && (
// //           <View style={styles.productInfoRow}>
// //             <Text style={styles.productLabel}>Unit:</Text>
// //             <Text style={styles.productValue}>{productData.unit}</Text>
// //           </View>
// //         )}
// //         {productData.gst && (
// //           <View style={styles.productInfoRow}>
// //             <Text style={styles.productLabel}>GST:</Text>
// //             <Text style={styles.productValue}>{productData.gst}%</Text>
// //           </View>
// //         )}
// //         {productData.barcode && (
// //           <View style={styles.productInfoRow}>
// //             <Text style={styles.productLabel}>Barcode:</Text>
// //             <Text style={styles.productValue}>{productData.barcode}</Text>
// //           </View>
// //         )}
// //         {productData.sku && (
// //           <View style={styles.productInfoRow}>
// //             <Text style={styles.productLabel}>SKU:</Text>
// //             <Text style={styles.productValue}>{productData.sku}</Text>
// //           </View>
// //         )}
// //         {productData.description && (
// //           <View style={styles.productDescriptionContainer}>
// //             <Text style={styles.productLabel}>Description:</Text>
// //             <Text style={styles.productDescription}>{productData.description}</Text>
// //           </View>
// //         )}
// //       </View>
// //     );
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         {/* Header Image */}
// //         <View style={styles.imageContainer}>
// //           <Image
// //             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
// //             style={styles.restaurantImage}
// //           />
// //           <TouchableOpacity
// //             style={styles.backButton}
// //             onPress={() => navigation.goBack()}
// //           >
// //             <Icon name="arrow-back" size={24} color="#ffffff" />
// //           </TouchableOpacity>
// //           <TouchableOpacity style={styles.favoriteButton}>
// //             <Icon name="heart-outline" size={24} color="#ffffff" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Restaurant/Product Info */}
// //         <View style={styles.infoContainer}>
// //           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          
// //           {isProduct ? (
// //             // Product specific info
// //             <View style={styles.ratingContainer}>
// //               <View style={styles.ratingBadge}>
// //                 <Icon name="star" size={14} color="#ffffff" />
// //                 <Text style={styles.ratingBadgeText}>4.5</Text>
// //               </View>
// //               <Text style={styles.deliveryTime}>In Stock</Text>
// //               <Text style={styles.costForTwo}>₹{productData?.price || 0}</Text>
// //             </View>
// //           ) : (
// //             // Restaurant specific info
// //             <View style={styles.ratingContainer}>
// //               <View style={styles.ratingBadge}>
// //                 <Icon name="star" size={14} color="#ffffff" />
// //                 <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
// //               </View>
// //               <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
// //               <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
// //             </View>
// //           )}
          
// //           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
          
// //           {restaurantData.offer && (
// //             <View style={styles.offerContainer}>
// //               <Text style={styles.offerText}>🎯 {restaurantData.offer}</Text>
// //             </View>
// //           )}

// //           {/* Show product details if it's a product */}
// //           {isProduct && renderProductDetails()}
// //         </View>

// //         {/* Category Tabs - Only show if there are categories */}
// //         {categories.length > 0 && (
// //           <View style={styles.categoriesContainer}>
// //             <FlatList
// //               data={categories}
// //               renderItem={renderCategoryTab}
// //               keyExtractor={(item) => item}
// //               horizontal
// //               showsHorizontalScrollIndicator={false}
// //               contentContainerStyle={styles.categoriesList}
// //             />
// //           </View>
// //         )}

// //         {/* Menu Items */}
// //         <View style={styles.menuContainer}>
// //           <View style={styles.menuHeader}>
// //             <Text style={styles.menuTitle}>
// //               {isProduct ? 'Product Information' : selectedCategory}
// //             </Text>
// //             {!isProduct && (
// //               <Text style={styles.menuCount}>{currentItems.length} items</Text>
// //             )}
// //           </View>
          
// //           {currentItems.length > 0 ? (
// //             <FlatList
// //               data={currentItems}
// //               renderItem={renderMenuItem}
// //               keyExtractor={(item) => item.id}
// //               scrollEnabled={false}
// //             />
// //           ) : (
// //             <View style={styles.emptyContainer}>
// //               <Icon name="restaurant-outline" size={60} color="#ccc" />
// //               <Text style={styles.emptyText}>
// //                 {isProduct ? 'Product details loaded' : 'No items in this category'}
// //               </Text>
// //             </View>
// //           )}
// //         </View>

// //         <View style={styles.footerSpacing} />
// //       </ScrollView>

// //       {/* Floating Cart Button - Only show for restaurants with cart items */}
// //       {!isProduct && cartItems.length > 0 && cartItems.some(item => item.restaurantId === restaurantData.id) && (
// //         <TouchableOpacity
// //           style={styles.cartButton}
// //           onPress={() => navigation.navigate('Cart')}
// //         >
// //           <View style={styles.cartButtonContent}>
// //             <Icon name="cart" size={24} color="#ffffff" />
// //             <Text style={styles.cartButtonText}>
// //               View Cart • {getTotalItems()} items • ₹{getTotalPrice()}
// //             </Text>
// //           </View>
// //         </TouchableOpacity>
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   imageContainer: {
// //     position: 'relative',
// //     height: 220,
// //   },
// //   restaurantImage: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   backButton: {
// //     position: 'absolute',
// //     top: 12,
// //     left: 16,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     borderRadius: 20,
// //     padding: 8,
// //   },
// //   favoriteButton: {
// //     position: 'absolute',
// //     top: 12,
// //     right: 16,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     borderRadius: 20,
// //     padding: 8,
// //   },
// //   infoContainer: {
// //     padding: 16,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   restaurantName: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: '#282c3f',
// //   },
// //   ratingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },
// //   ratingBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#28a745',
// //     paddingHorizontal: 8,
// //     paddingVertical: 2,
// //     borderRadius: 4,
// //   },
// //   ratingBadgeText: {
// //     color: '#ffffff',
// //     fontSize: 12,
// //     fontWeight: '600',
// //     marginLeft: 4,
// //   },
// //   deliveryTime: {
// //     fontSize: 13,
// //     color: '#7e808c',
// //     marginLeft: 12,
// //   },
// //   costForTwo: {
// //     fontSize: 13,
// //     color: '#7e808c',
// //     marginLeft: 12,
// //   },
// //   cuisine: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginTop: 6,
// //   },
// //   offerContainer: {
// //     marginTop: 8,
// //     backgroundColor: '#fff8e1',
// //     padding: 8,
// //     borderRadius: 6,
// //   },
// //   offerText: {
// //     fontSize: 13,
// //     color: '#ff6f00',
// //     fontWeight: '500',
// //   },
// //   categoriesContainer: {
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //     backgroundColor: '#ffffff',
// //   },
// //   categoriesList: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //   },
// //   categoryTab: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     marginRight: 4,
// //     position: 'relative',
// //   },
// //   activeCategoryTab: {},
// //   categoryTabText: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     fontWeight: '500',
// //   },
// //   activeCategoryTabText: {
// //     color: '#fc8019',
// //     fontWeight: '600',
// //   },
// //   activeIndicator: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 16,
// //     right: 16,
// //     height: 3,
// //     backgroundColor: '#fc8019',
// //     borderRadius: 2,
// //   },
// //   menuContainer: {
// //     padding: 16,
// //     paddingBottom: 100,
// //   },
// //   menuHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   menuTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   menuCount: {
// //     fontSize: 13,
// //     color: '#7e808c',
// //   },
// //   menuItem: {
// //     marginBottom: 4,
// //   },
// //   menuItemContent: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //   },
// //   menuItemInfo: {
// //     flex: 1,
// //     marginRight: 12,
// //   },
// //   menuItemHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flexWrap: 'wrap',
// //   },
// //   menuItemName: {
// //     fontSize: 16,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //   },
// //   bestsellerBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff8e1',
// //     paddingHorizontal: 8,
// //     paddingVertical: 2,
// //     borderRadius: 4,
// //     marginLeft: 8,
// //   },
// //   bestsellerText: {
// //     fontSize: 10,
// //     color: '#ff6f00',
// //     fontWeight: '600',
// //     marginLeft: 4,
// //   },
// //   menuItemPrice: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginTop: 4,
// //   },
// //   menuItemRating: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 4,
// //   },
// //   ratingText: {
// //     fontSize: 12,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //     marginLeft: 4,
// //   },
// //   vegNonVeg: {
// //     fontSize: 11,
// //     color: '#7e808c',
// //     marginLeft: 8,
// //   },
// //   menuItemDescription: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 4,
// //     lineHeight: 16,
// //   },
// //   addButton: {
// //     borderWidth: 1,
// //     borderColor: '#fc8019',
// //     paddingHorizontal: 16,
// //     paddingVertical: 6,
// //     borderRadius: 6,
// //     backgroundColor: '#ffffff',
// //   },
// //   addButtonText: {
// //     color: '#fc8019',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   quantityContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#fc8019',
// //     borderRadius: 6,
// //     backgroundColor: '#ffffff',
// //     paddingHorizontal: 4,
// //   },
// //   quantityButton: {
// //     width: 28,
// //     height: 28,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   quantityText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     minWidth: 20,
// //     textAlign: 'center',
// //   },
// //   divider: {
// //     height: 1,
// //     backgroundColor: '#f0f0f5',
// //   },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 40,
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: '#7e808c',
// //     marginTop: 12,
// //   },
// //   footerSpacing: {
// //     height: 20,
// //   },
// //   cartButton: {
// //     position: 'absolute',
// //     bottom: 20,
// //     left: 16,
// //     right: 16,
// //     backgroundColor: '#fc8019',
// //     borderRadius: 12,
// //     padding: 14,
// //     elevation: 5,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 4,
// //   },
// //   cartButtonContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   cartButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginLeft: 12,
// //   },
// //   // Product details styles
// //   productDetailsContainer: {
// //     marginTop: 12,
// //     backgroundColor: '#f8f9fa',
// //     borderRadius: 8,
// //     padding: 12,
// //   },
// //   productInfoRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 6,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e9ecef',
// //   },
// //   productLabel: {
// //     fontSize: 14,
// //     color: '#6c757d',
// //     fontWeight: '500',
// //   },
// //   productValue: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     fontWeight: '600',
// //   },
// //   productDescriptionContainer: {
// //     marginTop: 8,
// //     paddingVertical: 6,
// //   },
// //   productDescription: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     marginTop: 4,
// //     lineHeight: 20,
// //   },
// // });

// // export default RestaurantDetailScreen;
// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   FlatList,
//   Alert,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { CartContext } from '../../context/CartContext';

// interface RestaurantDetailScreenProps {
//   route: any;
//   navigation: any;
// }

// interface ProductData {
//   id: string;
//   price: number;
//   stock: number;
//   category: string;
//   description?: string;
//   brand?: string;
//   vendor?: string;
//   gst?: number;
//   unit?: string;
//   barcode?: string;
//   sku?: string;
//   image?: string;
//   name?: string;
// }

// interface RestaurantData {
//   id: string;
//   name: string;
//   rating: number;
//   deliveryTime: string;
//   cuisine: string;
//   image: string;
//   costForTwo: string;
//   address: string;
//   isVeg: boolean;
//   offer?: string;
//   productData?: ProductData;
// }

// // Product detail categories
// const PRODUCT_CATEGORIES = ['Product Details', 'Specifications', 'Reviews'];

// const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
//   const { restaurant } = route.params || {};
//   const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useContext(CartContext);
//   const [selectedCategory, setSelectedCategory] = useState<string>('Product Details');

//   // Check if this is a product (has productData) or restaurant
//   const isProduct = restaurant?.productData !== undefined;
//   const productData = restaurant?.productData as ProductData | undefined;

//   const restaurantData: RestaurantData = restaurant || {
//     id: '1',
//     name: 'Pizza Hut',
//     rating: 4.0,
//     deliveryTime: '30-35 mins',
//     cuisine: 'Pizzas',
//     image: 'https://via.placeholder.com/150',
//     costForTwo: '₹800 for two',
//     address: 'Sector 1, HSR Layout',
//     isVeg: false,
//     offer: '50% OFF UPTO ₹100',
//   };

//   // Get menu data based on product or restaurant
//   const getCategories = () => {
//     if (isProduct) {
//       return PRODUCT_CATEGORIES;
//     }
//     return ['Recommended', 'QuickBite Special', 'Offers', 'Pizzas', 'Sides'];
//   };

//   const getMenuItems = () => {
//     if (isProduct && productData) {
//       // Create dynamic menu items based on product data
//       return {
//         'Product Details': [
//           { 
//             id: productData.id || 'p1', 
//             name: productData.name || 'Product', 
//             price: productData.price || 0, 
//             rating: 4.5, 
//             description: productData.description || 'Product description', 
//             isBestSeller: true, 
//             isVeg: true, 
//             image: productData.image || 'https://via.placeholder.com/60' 
//           },
//         ],
//         'Specifications': [
//           { 
//             id: 'spec1', 
//             name: 'Technical Specifications', 
//             price: 0, 
//             rating: 0, 
//             description: `Brand: ${productData.brand || 'N/A'}\nUnit: ${productData.unit || 'pcs'}\nCategory: ${productData.category || 'N/A'}\nSKU: ${productData.sku || 'N/A'}\nBarcode: ${productData.barcode || 'N/A'}`, 
//             isBestSeller: false, 
//             isVeg: true, 
//             image: 'https://via.placeholder.com/60' 
//           },
//         ],
//         'Reviews': [
//           { 
//             id: 'rev1', 
//             name: 'Customer Reviews', 
//             price: 0, 
//             rating: 0, 
//             description: '★★★★★ 5.0 - Excellent product!\n★★★★☆ 4.0 - Good quality\n★★★★★ 5.0 - Highly recommended', 
//             isBestSeller: false, 
//             isVeg: true, 
//             image: 'https://via.placeholder.com/60' 
//           },
//         ],
//       };
//     }
//     return {};
//   };

//   const categories = getCategories();
//   const menuItems = getMenuItems();
//   const currentItems = menuItems[selectedCategory] || [];

//   // Check if item is in cart
//   const isItemInCart = (itemId: string) => {
//     return cartItems.some(item => item.id === itemId && item.restaurantId === restaurantData.id);
//   };

//   const getItemQuantity = (itemId: string) => {
//     const item = cartItems.find(i => i.id === itemId && i.restaurantId === restaurantData.id);
//     return item ? item.quantity : 0;
//   };

//   const handleAddToCart = (item: any) => {
//     if (isProduct && productData) {
//       // For products, use product data
//       const cartItem = {
//         id: productData.id,
//         name: productData.name || item.name,
//         price: productData.price || item.price,
//         quantity: 1,
//         image: productData.image || item.image || 'https://via.placeholder.com/60',
//         restaurantId: restaurantData.id,
//         restaurantName: restaurantData.name,
//         isProduct: true,
//       };
//       addToCart(cartItem, restaurantData);
//     } else {
//       const cartItem = {
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         quantity: 1,
//         image: item.image || 'https://via.placeholder.com/60',
//         restaurantId: restaurantData.id,
//         restaurantName: restaurantData.name,
//       };
//       addToCart(cartItem, restaurantData);
//     }
//   };

//   const handleUpdateQuantity = (item: any, newQuantity: number) => {
//     if (newQuantity === 0) {
//       removeFromCart(item.id, restaurantData.id);
//     } else {
//       updateQuantity(item.id, restaurantData.id, newQuantity);
//     }
//   };

//   const renderCategoryTab = ({ item }: { item: string }) => (
//     <TouchableOpacity
//       style={[
//         styles.categoryTab,
//         selectedCategory === item && styles.activeCategoryTab,
//       ]}
//       onPress={() => setSelectedCategory(item)}
//     >
//       <Text
//         style={[
//           styles.categoryTabText,
//           selectedCategory === item && styles.activeCategoryTabText,
//         ]}
//       >
//         {item}
//       </Text>
//       {selectedCategory === item && <View style={styles.activeIndicator} />}
//     </TouchableOpacity>
//   );

//   const renderMenuItem = ({ item }: { item: any }) => {
//     const inCart = isItemInCart(item.id);
//     const quantity = getItemQuantity(item.id);

//     // Check if item is in stock
//     const isInStock = isProduct ? (productData?.stock || 0) > 0 : true;

//     return (
//       <View style={styles.menuItem}>
//         <View style={styles.menuItemContent}>
//           <View style={styles.menuItemInfo}>
//             <View style={styles.menuItemHeader}>
//               <Text style={styles.menuItemName}>{item.name}</Text>
//               {item.isBestSeller && (
//                 <View style={styles.bestsellerBadge}>
//                   <Icon name="star" size={12} color="#ff6f00" />
//                   <Text style={styles.bestsellerText}>BESTSELLER</Text>
//                 </View>
//               )}
//             </View>
//             {item.price > 0 && (
//               <Text style={styles.menuItemPrice}>₹{item.price}</Text>
//             )}
//             {item.rating > 0 && (
//               <View style={styles.menuItemRating}>
//                 <Icon name="star" size={14} color="#ffc107" />
//                 <Text style={styles.ratingText}>{item.rating}</Text>
//                 <Text style={styles.vegNonVeg}>
//                   {item.isVeg ? ' 🟢 Veg' : ' 🔴 Non-Veg'}
//                 </Text>
//               </View>
//             )}
//             {item.description && (
//               <Text style={styles.menuItemDescription} numberOfLines={3}>
//                 {item.description}
//               </Text>
//             )}
//             {isProduct && productData && selectedCategory === 'Product Details' && (
//               <View style={styles.productStockInfo}>
//                 <Text style={[styles.stockText, { color: productData.stock > 5 ? '#28a745' : '#dc3545' }]}>
//                   {productData.stock > 5 ? '✅ In Stock' : '⚠️ Low Stock'}
//                 </Text>
//                 <Text style={styles.stockCount}>Stock: {productData.stock} units</Text>
//               </View>
//             )}
//           </View>
          
//           {item.price > 0 && isInStock && (
//             inCart ? (
//               <View style={styles.quantityContainer}>
//                 <TouchableOpacity
//                   style={styles.quantityButton}
//                   onPress={() => handleUpdateQuantity(item, quantity - 1)}
//                 >
//                   <Icon name="remove" size={16} color="#fc8019" />
//                 </TouchableOpacity>
//                 <Text style={styles.quantityText}>{quantity}</Text>
//                 <TouchableOpacity
//                   style={styles.quantityButton}
//                   onPress={() => handleUpdateQuantity(item, quantity + 1)}
//                 >
//                   <Icon name="add" size={16} color="#fc8019" />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity
//                 style={styles.addButton}
//                 onPress={() => handleAddToCart(item)}
//               >
//                 <Text style={styles.addButtonText}>ADD</Text>
//               </TouchableOpacity>
//             )
//           )}
//           {item.price > 0 && !isInStock && (
//             <View style={styles.outOfStockContainer}>
//               <Text style={styles.outOfStockText}>Out of Stock</Text>
//             </View>
//           )}
//         </View>
//         <View style={styles.divider} />
//       </View>
//     );
//   };

//   // Render product details section
//   const renderProductDetails = () => {
//     if (!isProduct || !productData) return null;

//     return (
//       <View style={styles.productDetailsContainer}>
//         <View style={styles.productInfoRow}>
//           <Text style={styles.productLabel}>Price:</Text>
//           <Text style={styles.productValue}>₹{productData.price}</Text>
//         </View>
//         <View style={styles.productInfoRow}>
//           <Text style={styles.productLabel}>Category:</Text>
//           <Text style={styles.productValue}>{productData.category}</Text>
//         </View>
//         <View style={styles.productInfoRow}>
//           <Text style={styles.productLabel}>Stock:</Text>
//           <Text style={[styles.productValue, { color: productData.stock > 5 ? '#28a745' : '#dc3545' }]}>
//             {productData.stock} units {productData.stock <= 5 && '🔴 Low Stock'}
//           </Text>
//         </View>
//         {productData.brand && (
//           <View style={styles.productInfoRow}>
//             <Text style={styles.productLabel}>Brand:</Text>
//             <Text style={styles.productValue}>{productData.brand}</Text>
//           </View>
//         )}
//         {productData.vendor && (
//           <View style={styles.productInfoRow}>
//             <Text style={styles.productLabel}>Vendor:</Text>
//             <Text style={styles.productValue}>{productData.vendor}</Text>
//           </View>
//         )}
//         {productData.unit && (
//           <View style={styles.productInfoRow}>
//             <Text style={styles.productLabel}>Unit:</Text>
//             <Text style={styles.productValue}>{productData.unit}</Text>
//           </View>
//         )}
//         {productData.gst && (
//           <View style={styles.productInfoRow}>
//             <Text style={styles.productLabel}>GST:</Text>
//             <Text style={styles.productValue}>{productData.gst}%</Text>
//           </View>
//         )}
//         {productData.barcode && (
//           <View style={styles.productInfoRow}>
//             <Text style={styles.productLabel}>Barcode:</Text>
//             <Text style={styles.productValue}>{productData.barcode}</Text>
//           </View>
//         )}
//         {productData.sku && (
//           <View style={styles.productInfoRow}>
//             <Text style={styles.productLabel}>SKU:</Text>
//             <Text style={styles.productValue}>{productData.sku}</Text>
//           </View>
//         )}
//         {productData.description && (
//           <View style={styles.productDescriptionContainer}>
//             <Text style={styles.productLabel}>Description:</Text>
//             <Text style={styles.productDescription}>{productData.description}</Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const handleProceedToCheckout = () => {
//     navigation.navigate('Cart');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header Image */}
//         <View style={styles.imageContainer}>
//           <Image
//             source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
//             style={styles.restaurantImage}
//           />
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={24} color="#ffffff" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.favoriteButton}>
//             <Icon name="heart-outline" size={24} color="#ffffff" />
//           </TouchableOpacity>
//         </View>

//         {/* Restaurant/Product Info */}
//         <View style={styles.infoContainer}>
//           <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          
//           {isProduct ? (
//             <View style={styles.ratingContainer}>
//               <View style={styles.ratingBadge}>
//                 <Icon name="star" size={14} color="#ffffff" />
//                 <Text style={styles.ratingBadgeText}>4.5</Text>
//               </View>
//               <Text style={styles.deliveryTime}>In Stock</Text>
//               <Text style={styles.costForTwo}>₹{productData?.price || 0}</Text>
//             </View>
//           ) : (
//             <View style={styles.ratingContainer}>
//               <View style={styles.ratingBadge}>
//                 <Icon name="star" size={14} color="#ffffff" />
//                 <Text style={styles.ratingBadgeText}>{restaurantData.rating || 4.2}</Text>
//               </View>
//               <Text style={styles.deliveryTime}>{restaurantData.deliveryTime || '27 mins'}</Text>
//               <Text style={styles.costForTwo}>{restaurantData.costForTwo || '₹700 for two'}</Text>
//             </View>
//           )}
          
//           <Text style={styles.cuisine}>{restaurantData.cuisine || 'North Indian, Chinese'}</Text>
          
//           {restaurantData.offer && (
//             <View style={styles.offerContainer}>
//               <Text style={styles.offerText}>🎯 {restaurantData.offer}</Text>
//             </View>
//           )}

//           {isProduct && renderProductDetails()}
//         </View>

//         {/* Category Tabs */}
//         {categories.length > 0 && (
//           <View style={styles.categoriesContainer}>
//             <FlatList
//               data={categories}
//               renderItem={renderCategoryTab}
//               keyExtractor={(item) => item}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.categoriesList}
//             />
//           </View>
//         )}

//         {/* Menu Items */}
//         <View style={styles.menuContainer}>
//           <View style={styles.menuHeader}>
//             <Text style={styles.menuTitle}>
//               {isProduct ? selectedCategory : selectedCategory}
//             </Text>
//           </View>
          
//           {currentItems.length > 0 ? (
//             <FlatList
//               data={currentItems}
//               renderItem={renderMenuItem}
//               keyExtractor={(item) => item.id}
//               scrollEnabled={false}
//             />
//           ) : (
//             <View style={styles.emptyContainer}>
//               <Icon name="restaurant-outline" size={60} color="#ccc" />
//               <Text style={styles.emptyText}>
//                 {isProduct ? 'Product details loaded' : 'No items in this category'}
//               </Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.footerSpacing} />
//       </ScrollView>

//       {/* Floating Cart Button */}
//       {cartItems.length > 0 && cartItems.some(item => item.restaurantId === restaurantData.id) && (
//         <TouchableOpacity
//           style={styles.cartButton}
//           onPress={handleProceedToCheckout}
//         >
//           <View style={styles.cartButtonContent}>
//             <Icon name="cart" size={24} color="#ffffff" />
//             <Text style={styles.cartButtonText}>
//               View Cart • {getTotalItems()} items • ₹{getTotalPrice()}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   imageContainer: {
//     position: 'relative',
//     height: 220,
//   },
//   restaurantImage: {
//     width: '100%',
//     height: '100%',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 12,
//     left: 16,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: 12,
//     right: 16,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   infoContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   restaurantName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#282c3f',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   ratingBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#28a745',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   ratingBadgeText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   deliveryTime: {
//     fontSize: 13,
//     color: '#7e808c',
//     marginLeft: 12,
//   },
//   costForTwo: {
//     fontSize: 13,
//     color: '#7e808c',
//     marginLeft: 12,
//   },
//   cuisine: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginTop: 6,
//   },
//   offerContainer: {
//     marginTop: 8,
//     backgroundColor: '#fff8e1',
//     padding: 8,
//     borderRadius: 6,
//   },
//   offerText: {
//     fontSize: 13,
//     color: '#ff6f00',
//     fontWeight: '500',
//   },
//   categoriesContainer: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//     backgroundColor: '#ffffff',
//   },
//   categoriesList: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   categoryTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginRight: 4,
//     position: 'relative',
//   },
//   activeCategoryTab: {},
//   categoryTabText: {
//     fontSize: 14,
//     color: '#7e808c',
//     fontWeight: '500',
//   },
//   activeCategoryTabText: {
//     color: '#fc8019',
//     fontWeight: '600',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     bottom: 0,
//     left: 16,
//     right: 16,
//     height: 3,
//     backgroundColor: '#fc8019',
//     borderRadius: 2,
//   },
//   menuContainer: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   menuHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   menuTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   menuItem: {
//     marginBottom: 4,
//   },
//   menuItemContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   menuItemInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   menuItemHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   menuItemName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#282c3f',
//   },
//   bestsellerBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff8e1',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginLeft: 8,
//   },
//   bestsellerText: {
//     fontSize: 10,
//     color: '#ff6f00',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   menuItemPrice: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginTop: 4,
//   },
//   menuItemRating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   ratingText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#282c3f',
//     marginLeft: 4,
//   },
//   vegNonVeg: {
//     fontSize: 11,
//     color: '#7e808c',
//     marginLeft: 8,
//   },
//   menuItemDescription: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 4,
//     lineHeight: 16,
//   },
//   addButton: {
//     borderWidth: 1,
//     borderColor: '#fc8019',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 6,
//     backgroundColor: '#ffffff',
//   },
//   addButtonText: {
//     color: '#fc8019',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#fc8019',
//     borderRadius: 6,
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 4,
//   },
//   quantityButton: {
//     width: 28,
//     height: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#282c3f',
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   outOfStockContainer: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: '#f8d7da',
//     borderRadius: 6,
//   },
//   outOfStockText: {
//     fontSize: 12,
//     color: '#dc3545',
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#f0f0f5',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#7e808c',
//     marginTop: 12,
//   },
//   footerSpacing: {
//     height: 20,
//   },
//   cartButton: {
//     position: 'absolute',
//     bottom: 20,
//     left: 16,
//     right: 16,
//     backgroundColor: '#fc8019',
//     borderRadius: 12,
//     padding: 14,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   cartButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cartButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 12,
//   },
//   // Product details styles
//   productDetailsContainer: {
//     marginTop: 12,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 12,
//   },
//   productInfoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   productLabel: {
//     fontSize: 14,
//     color: '#6c757d',
//     fontWeight: '500',
//   },
//   productValue: {
//     fontSize: 14,
//     color: '#282c3f',
//     fontWeight: '600',
//   },
//   productDescriptionContainer: {
//     marginTop: 8,
//     paddingVertical: 6,
//   },
//   productDescription: {
//     fontSize: 14,
//     color: '#282c3f',
//     marginTop: 4,
//     lineHeight: 20,
//   },
//   productStockInfo: {
//     marginTop: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   stockText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   stockCount: {
//     fontSize: 13,
//     color: '#7e808c',
//     marginLeft: 12,
//   },
// });

// export default RestaurantDetailScreen;
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../../context/CartContext';

interface RestaurantDetailScreenProps {
  route: any;
  navigation: any;
}

interface ProductData {
  id: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  brand?: string;
  vendor?: string;
  gst?: number;
  unit?: string;
  barcode?: string;
  sku?: string;
  image?: string;
  name?: string;
}

interface RestaurantData {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  image: string;
  costForTwo: string;
  address: string;
  isVeg: boolean;
  offer?: string;
  productData?: ProductData;
}

// Menu items types
interface MenuItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  isBestSeller: boolean;
  isVeg: boolean;
  image: string;
}

interface MenuData {
  [key: string]: MenuItem[];
}

const PRODUCT_CATEGORIES = ['Product Details', 'Specifications', 'Reviews'];

const RestaurantDetailScreen: React.FC<RestaurantDetailScreenProps> = ({ route, navigation }) => {
  const { restaurant } = route.params || {};
  const { cartItems, addToCart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState<string>('Product Details');

  const isProduct = restaurant?.productData !== undefined;
  const productData = restaurant?.productData as ProductData | undefined;

  const restaurantData: RestaurantData = restaurant || {
    id: '1',
    name: 'Pizza Hut',
    rating: 4.0,
    deliveryTime: '30-35 mins',
    cuisine: 'Pizzas',
    image: 'https://via.placeholder.com/150',
    costForTwo: '₹800 for two',
    address: 'Sector 1, HSR Layout',
    isVeg: false,
    offer: '50% OFF UPTO ₹100',
  };

  // Get categories
  const getCategories = (): string[] => {
    if (isProduct) {
      return PRODUCT_CATEGORIES;
    }
    return ['Recommended', 'QuickBite Special', 'Offers', 'Pizzas', 'Sides'];
  };

  // Get menu items with proper typing
  const getMenuItems = (): MenuData => {
    if (isProduct && productData) {
      return {
        'Product Details': [
          { 
            id: productData.id || 'p1', 
            name: productData.name || 'Product', 
            price: productData.price || 0, 
            rating: 4.5, 
            description: productData.description || 'Product description', 
            isBestSeller: true, 
            isVeg: true, 
            image: productData.image || 'https://via.placeholder.com/60' 
          },
        ],
        'Specifications': [
          { 
            id: 'spec1', 
            name: 'Technical Specifications', 
            price: 0, 
            rating: 0, 
            description: `Brand: ${productData.brand || 'N/A'}\nUnit: ${productData.unit || 'pcs'}\nCategory: ${productData.category || 'N/A'}\nSKU: ${productData.sku || 'N/A'}\nBarcode: ${productData.barcode || 'N/A'}`, 
            isBestSeller: false, 
            isVeg: true, 
            image: 'https://via.placeholder.com/60' 
          },
        ],
        'Reviews': [
          { 
            id: 'rev1', 
            name: 'Customer Reviews', 
            price: 0, 
            rating: 0, 
            description: '★★★★★ 5.0 - Excellent product!\n★★★★☆ 4.0 - Good quality\n★★★★★ 5.0 - Highly recommended', 
            isBestSeller: false, 
            isVeg: true, 
            image: 'https://via.placeholder.com/60' 
          },
        ],
      };
    }
    return {};
  };

  const categories = getCategories();
  const menuItems = getMenuItems();
  const currentItems: MenuItem[] = menuItems[selectedCategory] || [];

  const isItemInCart = (itemId: string) => {
    return cartItems.some(item => item.id === itemId && item.restaurantId === restaurantData.id);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find(i => i.id === itemId && i.restaurantId === restaurantData.id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image || 'https://via.placeholder.com/60',
      restaurantId: restaurantData.id,
      restaurantName: restaurantData.name,
    };
    addToCart(cartItem, restaurantData);
  };

  const handleUpdateQuantity = (item: MenuItem, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.id, restaurantData.id);
    } else {
      updateQuantity(item.id, restaurantData.id, newQuantity);
    }
  };

  const renderCategoryTab = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        selectedCategory === item && styles.activeCategoryTab,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryTabText,
          selectedCategory === item && styles.activeCategoryTabText,
        ]}
      >
        {item}
      </Text>
      {selectedCategory === item && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const inCart = isItemInCart(item.id);
    const quantity = getItemQuantity(item.id);

    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <View style={styles.menuItemHeader}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              {item.isBestSeller && (
                <View style={styles.bestsellerBadge}>
                  <Icon name="star" size={12} color="#ff6f00" />
                  <Text style={styles.bestsellerText}>BESTSELLER</Text>
                </View>
              )}
            </View>
            {item.price > 0 && (
              <Text style={styles.menuItemPrice}>₹{item.price}</Text>
            )}
            {item.rating > 0 && (
              <View style={styles.menuItemRating}>
                <Icon name="star" size={14} color="#ffc107" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            )}
            {item.description && (
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            )}
          </View>
          {item.price > 0 && (
            inCart ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item, quantity - 1)}
                >
                  <Icon name="remove" size={16} color="#fc8019" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleUpdateQuantity(item, quantity + 1)}
                >
                  <Icon name="add" size={16} color="#fc8019" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            )
          )}
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: restaurantData.image || 'https://via.placeholder.com/400x200' }}
            style={styles.restaurantImage}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          <Text style={styles.cuisine}>{restaurantData.cuisine}</Text>
          <Text style={styles.costForTwo}>{restaurantData.costForTwo}</Text>
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryTab}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.menuContainer}>
          <FlatList
            data={currentItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {cartItems.length > 0 && cartItems.some(item => item.restaurantId === restaurantData.id) && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.cartButtonContent}>
            <Icon name="cart" size={24} color="#ffffff" />
            <Text style={styles.cartButtonText}>
              View Cart • {getTotalItems()} items • ₹{getTotalPrice()}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    position: 'relative',
    height: 220,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#282c3f',
  },
  cuisine: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 6,
  },
  costForTwo: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 4,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
    backgroundColor: '#ffffff',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 4,
    position: 'relative',
  },
  activeCategoryTab: {},
  categoryTabText: {
    fontSize: 14,
    color: '#7e808c',
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: '#fc8019',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#fc8019',
    borderRadius: 2,
  },
  menuContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  menuItem: {
    marginBottom: 4,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#282c3f',
  },
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  bestsellerText: {
    fontSize: 10,
    color: '#ff6f00',
    fontWeight: '600',
    marginLeft: 4,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 4,
  },
  menuItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#282c3f',
    marginLeft: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 4,
    lineHeight: 16,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#fc8019',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  addButtonText: {
    color: '#fc8019',
    fontSize: 12,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fc8019',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
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
  divider: {
    height: 1,
    backgroundColor: '#f0f0f5',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fc8019',
    borderRadius: 12,
    padding: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default RestaurantDetailScreen;