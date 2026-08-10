// // // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // // import {
// // // // // // // // // // // // //   View,
// // // // // // // // // // // // //   Text,
// // // // // // // // // // // // //   ScrollView,
// // // // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // // // //   StyleSheet,
// // // // // // // // // // // // //   Image,
// // // // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // // // // import { colors } from '../../constants/colors';
// // // // // // // // // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // // // // // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // // // // // // // // // import { CartItem as CartItemType } from '../../types';

// // // // // // // // // // // // // export default function CartScreen({ navigation }: any){
// // // // // // // // // // // // //   const { cartItems, getTotalPrice, getTotalItems, updateQuantity, removeFromCart } = useContext(CartContext);
// // // // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // // // //   const deliveryFee: number = 28;
// // // // // // // // // // // // //   const platformFee: number = 7;
// // // // // // // // // // // // //   const total: number = getTotalPrice() + deliveryFee + platformFee;

// // // // // // // // // // // // //   if (cartItems.length === 0) {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <View style={styles.emptyContainer}>
// // // // // // // // // // // // //         <Icon name="cart-outline" size={80} color={colors.gray} />
// // // // // // // // // // // // //         <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // // // // // // // // //         <Text style={styles.emptySubText}>Add items to get started</Text>
// // // // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // // // //           style={styles.browseButton}
// // // // // // // // // // // // //           onPress={() => navigation.navigate('Home')}
// // // // // // // // // // // // //         >
// // // // // // // // // // // // //           <Text style={styles.browseButtonText}>Browse Restaurants</Text>
// // // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // // //       </View>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // // // //       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
// // // // // // // // // // // // //         {/* Header */}
// // // // // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // // // // //           <Text style={styles.headerTitle}>Your Cart</Text>
// // // // // // // // // // // // //           <Text style={styles.headerSubtitle}>{getTotalItems()} items</Text>
// // // // // // // // // // // // //         </View>

// // // // // // // // // // // // //         {/* Cart Items */}
// // // // // // // // // // // // //         <View style={styles.cartItemsContainer}>
// // // // // // // // // // // // //           {cartItems.map((item: CartItemType) => (
// // // // // // // // // // // // //             <View key={`${item.id}-${item.restaurantId}`} style={styles.cartItem}>
// // // // // // // // // // // // //               <Image 
// // // // // // // // // // // // //                 source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // // // // // // // // //                 style={styles.itemImage} 
// // // // // // // // // // // // //               />
// // // // // // // // // // // // //               <View style={styles.itemDetails}>
// // // // // // // // // // // // //                 <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
// // // // // // // // // // // // //                 <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // // // // // // // // // //                 <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // // // // // // // // // //                 <View style={styles.quantityContainer}>
// // // // // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // // // // //                     onPress={() => updateQuantity(item.id, item.restaurantId, item.quantity - 1)}
// // // // // // // // // // // // //                     style={styles.quantityButton}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     <Icon name="remove" size={16} color={colors.primary} />
// // // // // // // // // // // // //                   </TouchableOpacity>
// // // // // // // // // // // // //                   <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // // // // // // // // //                   <TouchableOpacity
// // // // // // // // // // // // //                     onPress={() => updateQuantity(item.id, item.restaurantId, item.quantity + 1)}
// // // // // // // // // // // // //                     style={styles.quantityButton}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     <Icon name="add" size={16} color={colors.primary} />
// // // // // // // // // // // // //                   </TouchableOpacity>
// // // // // // // // // // // // //                 </View>
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //               <TouchableOpacity onPress={() => removeFromCart(item.id, item.restaurantId)}>
// // // // // // // // // // // // //                 <Icon name="close-circle" size={24} color={colors.danger} />
// // // // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //           ))}
// // // // // // // // // // // // //         </View>

// // // // // // // // // // // // //         {/* Bill Details */}
// // // // // // // // // // // // //         <View style={styles.billContainer}>
// // // // // // // // // // // // //           <Text style={styles.billTitle}>Bill Details</Text>
// // // // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // // // //             <Text style={styles.billLabel}>Item Total</Text>
// // // // // // // // // // // // //             <Text style={styles.billValue}>₹{getTotalPrice()}</Text>
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // // // //             <Text style={styles.billLabel}>Delivery Fee</Text>
// // // // // // // // // // // // //             <Text style={styles.billValue}>₹{deliveryFee}</Text>
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // // // //             <Text style={styles.billLabel}>Platform Fee</Text>
// // // // // // // // // // // // //             <Text style={styles.billValue}>₹{platformFee}</Text>
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //           <View style={[styles.billRow, styles.totalRow]}>
// // // // // // // // // // // // //             <Text style={styles.totalLabel}>To Pay</Text>
// // // // // // // // // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //         </View>
// // // // // // // // // // // // //       </ScrollView>

// // // // // // // // // // // // //       {/* Checkout Button */}
// // // // // // // // // // // // //       <View style={styles.footer}>
// // // // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // // // //           style={styles.checkoutButton}
// // // // // // // // // // // // //           onPress={() => {
// // // // // // // // // // // // //             if (isAuthenticated) {
// // // // // // // // // // // // //               navigation.navigate('Checkout');
// // // // // // // // // // // // //             } else {
// // // // // // // // // // // // //               navigation.navigate('Login');
// // // // // // // // // // // // //             }
// // // // // // // // // // // // //           }}
// // // // // // // // // // // // //         >
// // // // // // // // // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // // // // // // // // //             Proceed to Checkout • ₹{total}
// // // // // // // // // // // // //           </Text>
// // // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // // //       </View>
// // // // // // // // // // // // //     </View>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // //   container: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   emptyContainer: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     paddingHorizontal: 32,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   emptyText: {
// // // // // // // // // // // // //     fontSize: 20,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //     marginTop: 16,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   emptySubText: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.gray,
// // // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // // //     marginBottom: 24,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   browseButton: {
// // // // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // // // //     paddingHorizontal: 24,
// // // // // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   browseButtonText: {
// // // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   scrollView: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   header: {
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   headerTitle: {
// // // // // // // // // // // // //     fontSize: 24,
// // // // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   headerSubtitle: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.gray,
// // // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   cartItemsContainer: {
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   cartItem: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // // // //     padding: 12,
// // // // // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   itemImage: {
// // // // // // // // // // // // //     width: 60,
// // // // // // // // // // // // //     height: 60,
// // // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   itemDetails: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   itemName: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   itemRestaurant: {
// // // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // // //     color: colors.gray,
// // // // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   itemPrice: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.primary,
// // // // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   quantityContainer: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   quantityButton: {
// // // // // // // // // // // // //     width: 28,
// // // // // // // // // // // // //     height: 28,
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // // // // //     borderRadius: 14,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   quantityText: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // // //     marginHorizontal: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   billContainer: {
// // // // // // // // // // // // //     margin: 16,
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   billTitle: {
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   billRow: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // // //     paddingVertical: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   billLabel: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   billValue: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   totalRow: {
// // // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // // //     borderTopColor: colors.border,
// // // // // // // // // // // // //     paddingTop: 12,
// // // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   totalLabel: {
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   totalValue: {
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // // // //     color: colors.primary,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   footer: {
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // // //     borderTopColor: colors.border,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   checkoutButton: {
// // // // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // // //     height: 50,
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   checkoutButtonText: {
// // // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // // });
// // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // import {
// // // // // // // // // // // //   View,
// // // // // // // // // // // //   Text,
// // // // // // // // // // // //   StyleSheet,
// // // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // // //   SafeAreaView,
// // // // // // // // // // // //   StatusBar,
// // // // // // // // // // // //   FlatList,
// // // // // // // // // // // //   Image,
// // // // // // // // // // // //   Alert,
// // // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // // // import { CartContext } from '../../context/CartContext';

// // // // // // // // // // // // const CartScreen: React.FC = ({ navigation }: any) => {
// // // // // // // // // // // //   const { cartItems, getTotalPrice, getTotalItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

// // // // // // // // // // // //   const deliveryFee = 28;
// // // // // // // // // // // //   const platformFee = 7;
// // // // // // // // // // // //   const tax = Math.round(getTotalPrice() * 0.05);
// // // // // // // // // // // //   const total = getTotalPrice() + deliveryFee + platformFee + tax;

// // // // // // // // // // // //   const handleCheckout = () => {
// // // // // // // // // // // //     if (cartItems.length === 0) {
// // // // // // // // // // // //       Alert.alert('Cart Empty', 'Add items to your cart first');
// // // // // // // // // // // //       return;
// // // // // // // // // // // //     }
// // // // // // // // // // // //     Alert.alert(
// // // // // // // // // // // //       'Place Order',
// // // // // // // // // // // //       `Total Amount: ₹${total}\n\nDo you want to place this order?`,
// // // // // // // // // // // //       [
// // // // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // // //         {
// // // // // // // // // // // //           text: 'Place Order',
// // // // // // // // // // // //           onPress: () => {
// // // // // // // // // // // //             Alert.alert('Order Placed!', 'Your order has been placed successfully');
// // // // // // // // // // // //             clearCart();
// // // // // // // // // // // //             navigation.navigate('Orders');
// // // // // // // // // // // //           }
// // // // // // // // // // // //         },
// // // // // // // // // // // //       ]
// // // // // // // // // // // //     );
// // // // // // // // // // // //   };

// // // // // // // // // // // //   if (cartItems.length === 0) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <SafeAreaView style={styles.container}>
// // // // // // // // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // // // // //         </View>
// // // // // // // // // // // //         <View style={styles.emptyContainer}>
// // // // // // // // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // // // // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // // // // // // // //           <Text style={styles.emptySubText}>Add items from restaurants</Text>
// // // // // // // // // // // //           <TouchableOpacity 
// // // // // // // // // // // //             style={styles.browseButton}
// // // // // // // // // // // //             onPress={() => navigation.navigate('Home')}
// // // // // // // // // // // //           >
// // // // // // // // // // // //             <Text style={styles.browseButtonText}>Browse Restaurants</Text>
// // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // //         </View>
// // // // // // // // // // // //       </SafeAreaView>
// // // // // // // // // // // //     );
// // // // // // // // // // // //   }

// // // // // // // // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // // // // // // // //     <View style={styles.cartItem}>
// // // // // // // // // // // //       <Image source={{ uri: item.image || 'https://via.placeholder.com/60' }} style={styles.cartItemImage} />
// // // // // // // // // // // //       <View style={styles.cartItemInfo}>
// // // // // // // // // // // //         <Text style={styles.cartItemName}>{item.name}</Text>
// // // // // // // // // // // //         <Text style={styles.cartItemRestaurant}>{item.restaurantName}</Text>
// // // // // // // // // // // //         <Text style={styles.cartItemPrice}>₹{item.price}</Text>
// // // // // // // // // // // //       </View>
// // // // // // // // // // // //       <View style={styles.cartItemActions}>
// // // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // // //           style={styles.quantityButton}
// // // // // // // // // // // //           onPress={() => updateQuantity(item.id, item.restaurantId, item.quantity - 1)}
// // // // // // // // // // // //         >
// // // // // // // // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // // //           style={styles.quantityButton}
// // // // // // // // // // // //           onPress={() => updateQuantity(item.id, item.restaurantId, item.quantity + 1)}
// // // // // // // // // // // //         >
// // // // // // // // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //         <TouchableOpacity 
// // // // // // // // // // // //           style={styles.removeButton}
// // // // // // // // // // // //           onPress={() => removeFromCart(item.id, item.restaurantId)}
// // // // // // // // // // // //         >
// // // // // // // // // // // //           <Icon name="trash-outline" size={20} color="#dc3545" />
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //       </View>
// // // // // // // // // // // //     </View>
// // // // // // // // // // // //   );

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // // // // //         <TouchableOpacity onPress={clearCart}>
// // // // // // // // // // // //           <Text style={styles.clearText}>Clear All</Text>
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //       </View>

// // // // // // // // // // // //       <FlatList
// // // // // // // // // // // //         data={cartItems}
// // // // // // // // // // // //         renderItem={renderCartItem}
// // // // // // // // // // // //         keyExtractor={(item) => `${item.id}-${item.restaurantId}`}
// // // // // // // // // // // //         contentContainerStyle={styles.cartList}
// // // // // // // // // // // //       />

// // // // // // // // // // // //       <View style={styles.footer}>
// // // // // // // // // // // //         <View style={styles.billContainer}>
// // // // // // // // // // // //           <Text style={styles.billTitle}>Bill Details</Text>
// // // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // // //             <Text style={styles.billLabel}>Item Total</Text>
// // // // // // // // // // // //             <Text style={styles.billValue}>₹{getTotalPrice()}</Text>
// // // // // // // // // // // //           </View>
// // // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // // //             <Text style={styles.billLabel}>Delivery Fee</Text>
// // // // // // // // // // // //             <Text style={styles.billValue}>₹{deliveryFee}</Text>
// // // // // // // // // // // //           </View>
// // // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // // //             <Text style={styles.billLabel}>Platform Fee</Text>
// // // // // // // // // // // //             <Text style={styles.billValue}>₹{platformFee}</Text>
// // // // // // // // // // // //           </View>
// // // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // // //             <Text style={styles.billLabel}>Tax (5%)</Text>
// // // // // // // // // // // //             <Text style={styles.billValue}>₹{tax}</Text>
// // // // // // // // // // // //           </View>
// // // // // // // // // // // //           <View style={[styles.billRow, styles.totalRow]}>
// // // // // // // // // // // //             <Text style={styles.totalLabel}>TO PAY</Text>
// // // // // // // // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // // // // // // // //           </View>
// // // // // // // // // // // //         </View>

// // // // // // // // // // // //         <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
// // // // // // // // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // // // // // // // //             Place Order • ₹{total}
// // // // // // // // // // // //           </Text>
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //       </View>
// // // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // //   container: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   header: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   headerTitle: {
// // // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   clearText: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: '#dc3545',
// // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   emptyContainer: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //     paddingHorizontal: 32,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   emptyText: {
// // // // // // // // // // // //     fontSize: 20,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // // //     marginTop: 16,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   emptySubText: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: '#7e808c',
// // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   browseButton: {
// // // // // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // // // // //     paddingHorizontal: 24,
// // // // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // //     marginTop: 20,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   browseButtonText: {
// // // // // // // // // // // //     color: '#ffffff',
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartList: {
// // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartItem: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //     padding: 12,
// // // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartItemImage: {
// // // // // // // // // // // //     width: 60,
// // // // // // // // // // // //     height: 60,
// // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartItemInfo: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartItemName: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartItemRestaurant: {
// // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // //     color: '#7e808c',
// // // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartItemPrice: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: '#fc8019',
// // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cartItemActions: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   quantityButton: {
// // // // // // // // // // // //     width: 32,
// // // // // // // // // // // //     height: 32,
// // // // // // // // // // // //     borderRadius: 16,
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: '#fc8019',
// // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   quantityText: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //     marginHorizontal: 8,
// // // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   removeButton: {
// // // // // // // // // // // //     marginLeft: 8,
// // // // // // // // // // // //     padding: 4,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   footer: {
// // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // //     borderTopColor: '#f0f0f5',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   billContainer: {
// // // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   billTitle: {
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   billRow: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // //     paddingVertical: 4,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   billLabel: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: '#7e808c',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   billValue: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   totalRow: {
// // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // //     borderTopColor: '#e0e0e0',
// // // // // // // // // // // //     paddingTop: 12,
// // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   totalLabel: {
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   totalValue: {
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // // //     color: '#fc8019',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   checkoutButton: {
// // // // // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   checkoutButtonText: {
// // // // // // // // // // // //     color: '#ffffff',
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //   },
// // // // // // // // // // // // });

// // // // // // // // // // // // export default CartScreen;
// // // // // // // // // // // import React, { useContext, useState } from 'react';
// // // // // // // // // // // import {
// // // // // // // // // // //   View,
// // // // // // // // // // //   Text,
// // // // // // // // // // //   StyleSheet,
// // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // //   SafeAreaView,
// // // // // // // // // // //   StatusBar,
// // // // // // // // // // //   FlatList,
// // // // // // // // // // //   Image,
// // // // // // // // // // //   Alert,
// // // // // // // // // // //   Modal,
// // // // // // // // // // //   ActivityIndicator,
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // // // // // // import { OrderContext } from '../../context/OrderContext';

// // // // // // // // // // // // Define OrderStatus type
// // // // // // // // // // // type OrderStatus = 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';

// // // // // // // // // // // const CartScreen: React.FC = ({ navigation }: any) => {
// // // // // // // // // // //   const { cartItems, getTotalPrice, getTotalItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
// // // // // // // // // // //   const { addOrder } = useContext(OrderContext);
  
// // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // //   const [showOrderModal, setShowOrderModal] = useState(false);
// // // // // // // // // // //   const [orderSuccess, setOrderSuccess] = useState(false);

// // // // // // // // // // //   const deliveryFee = 28;
// // // // // // // // // // //   const platformFee = 7;
// // // // // // // // // // //   const tax = Math.round(getTotalPrice() * 0.05);
// // // // // // // // // // //   const total = getTotalPrice() + deliveryFee + platformFee + tax;

// // // // // // // // // // //   const handleCheckout = () => {
// // // // // // // // // // //     if (cartItems.length === 0) {
// // // // // // // // // // //       Alert.alert('Cart Empty', 'Add items to your cart first');
// // // // // // // // // // //       return;
// // // // // // // // // // //     }
// // // // // // // // // // //     navigation.navigate('Checkout');
// // // // // // // // // // //     setShowOrderModal(true);
// // // // // // // // // // //   };

// // // // // // // // // // //   const handlePlaceOrder = () => {
// // // // // // // // // // //     setLoading(true);
    
// // // // // // // // // // //     setTimeout(() => {
// // // // // // // // // // //       // Create order with correct status type
// // // // // // // // // // //       const order: {
// // // // // // // // // // //         id: string;
// // // // // // // // // // //         restaurantName: string;
// // // // // // // // // // //         items: any[];
// // // // // // // // // // //         total: number;
// // // // // // // // // // //         status: OrderStatus;
// // // // // // // // // // //         createdAt: string;
// // // // // // // // // // //       } = {
// // // // // // // // // // //         id: 'ORD' + Date.now().toString(36).toUpperCase(),
// // // // // // // // // // //         restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
// // // // // // // // // // //         items: cartItems,
// // // // // // // // // // //         total: total,
// // // // // // // // // // //         status: 'Placed', // This now matches the type
// // // // // // // // // // //         createdAt: new Date().toISOString(),
// // // // // // // // // // //       };
      
// // // // // // // // // // //       addOrder(order);
// // // // // // // // // // //       clearCart();
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //       setShowOrderModal(false);
// // // // // // // // // // //       setOrderSuccess(true);
      
// // // // // // // // // // //       Alert.alert(
// // // // // // // // // // //         '🎉 Order Placed!',
// // // // // // // // // // //         `Your order has been placed successfully!\n\nOrder ID: ${order.id}\nTotal: ₹${total}`,
// // // // // // // // // // //         [
// // // // // // // // // // //           {
// // // // // // // // // // //             text: 'View Orders',
// // // // // // // // // // //             onPress: () => {
// // // // // // // // // // //               setOrderSuccess(false);
// // // // // // // // // // //               navigation.navigate('Orders');
// // // // // // // // // // //             }
// // // // // // // // // // //           },
// // // // // // // // // // //           {
// // // // // // // // // // //             text: 'OK',
// // // // // // // // // // //             style: 'cancel',
// // // // // // // // // // //             onPress: () => {
// // // // // // // // // // //               setOrderSuccess(false);
// // // // // // // // // // //             }
// // // // // // // // // // //           }
// // // // // // // // // // //         ]
// // // // // // // // // // //       );
// // // // // // // // // // //     }, 2000);
// // // // // // // // // // //   };

// // // // // // // // // // //   if (cartItems.length === 0) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <SafeAreaView style={styles.container}>
// // // // // // // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // // // //         </View>
// // // // // // // // // // //         <View style={styles.emptyContainer}>
// // // // // // // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // // // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // // // // // // //           <Text style={styles.emptySubText}>Add items from restaurants</Text>
// // // // // // // // // // //           <TouchableOpacity 
// // // // // // // // // // //             style={styles.browseButton}
// // // // // // // // // // //             onPress={() => navigation.navigate('Home')}
// // // // // // // // // // //           >
// // // // // // // // // // //             <Text style={styles.browseButtonText}>Browse Restaurants</Text>
// // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </SafeAreaView>
// // // // // // // // // // //     );
// // // // // // // // // // //   }

// // // // // // // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // // // // // // //     <View style={styles.cartItem}>
// // // // // // // // // // //       <Image 
// // // // // // // // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // // // // // // //         style={styles.cartItemImage} 
// // // // // // // // // // //       />
// // // // // // // // // // //       <View style={styles.cartItemInfo}>
// // // // // // // // // // //         <Text style={styles.cartItemName}>{item.name}</Text>
// // // // // // // // // // //         <Text style={styles.cartItemRestaurant}>{item.restaurantName}</Text>
// // // // // // // // // // //         <Text style={styles.cartItemPrice}>₹{item.price}</Text>
// // // // // // // // // // //       </View>
// // // // // // // // // // //       <View style={styles.cartItemActions}>
// // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // //           style={styles.quantityButton}
// // // // // // // // // // //           onPress={() => updateQuantity(item.id, item.restaurantId, item.quantity - 1)}
// // // // // // // // // // //         >
// // // // // // // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // // // // // // //         <TouchableOpacity
// // // // // // // // // // //           style={styles.quantityButton}
// // // // // // // // // // //           onPress={() => updateQuantity(item.id, item.restaurantId, item.quantity + 1)}
// // // // // // // // // // //         >
// // // // // // // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //         <TouchableOpacity 
// // // // // // // // // // //           style={styles.removeButton}
// // // // // // // // // // //           onPress={() => removeFromCart(item.id, item.restaurantId)}
// // // // // // // // // // //         >
// // // // // // // // // // //           <Icon name="trash-outline" size={20} color="#dc3545" />
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //       </View>
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );

// // // // // // // // // // //   return (
// // // // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // // // //         <TouchableOpacity onPress={() => {
// // // // // // // // // // //           Alert.alert(
// // // // // // // // // // //             'Clear Cart',
// // // // // // // // // // //             'Are you sure you want to clear all items?',
// // // // // // // // // // //             [
// // // // // // // // // // //               { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // //               { text: 'Clear All', style: 'destructive', onPress: clearCart }
// // // // // // // // // // //             ]
// // // // // // // // // // //           );
// // // // // // // // // // //         }}>
// // // // // // // // // // //           <Text style={styles.clearText}>Clear All</Text>
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //       </View>

// // // // // // // // // // //       <FlatList
// // // // // // // // // // //         data={cartItems}
// // // // // // // // // // //         renderItem={renderCartItem}
// // // // // // // // // // //         keyExtractor={(item) => `${item.id}-${item.restaurantId}`}
// // // // // // // // // // //         contentContainerStyle={styles.cartList}
// // // // // // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // // // // // //       />

// // // // // // // // // // //       <View style={styles.footer}>
// // // // // // // // // // //         <View style={styles.billContainer}>
// // // // // // // // // // //           <Text style={styles.billTitle}>Bill Details</Text>
// // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // //             <Text style={styles.billLabel}>Item Total</Text>
// // // // // // // // // // //             <Text style={styles.billValue}>₹{getTotalPrice()}</Text>
// // // // // // // // // // //           </View>
// // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // //             <Text style={styles.billLabel}>Delivery Fee</Text>
// // // // // // // // // // //             <Text style={styles.billValue}>₹{deliveryFee}</Text>
// // // // // // // // // // //           </View>
// // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // //             <Text style={styles.billLabel}>Platform Fee</Text>
// // // // // // // // // // //             <Text style={styles.billValue}>₹{platformFee}</Text>
// // // // // // // // // // //           </View>
// // // // // // // // // // //           <View style={styles.billRow}>
// // // // // // // // // // //             <Text style={styles.billLabel}>Tax (5%)</Text>
// // // // // // // // // // //             <Text style={styles.billValue}>₹{tax}</Text>
// // // // // // // // // // //           </View>
// // // // // // // // // // //           <View style={[styles.billRow, styles.totalRow]}>
// // // // // // // // // // //             <Text style={styles.totalLabel}>TO PAY</Text>
// // // // // // // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         </View>

// // // // // // // // // // //         <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
// // // // // // // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // // // // // // //             Place Order • ₹{total}
// // // // // // // // // // //           </Text>
// // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // //       </View>

// // // // // // // // // // //       {/* Order Confirmation Modal */}
// // // // // // // // // // //       <Modal
// // // // // // // // // // //         visible={showOrderModal}
// // // // // // // // // // //         transparent={true}
// // // // // // // // // // //         animationType="slide"
// // // // // // // // // // //         onRequestClose={() => setShowOrderModal(false)}
// // // // // // // // // // //       >
// // // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // // //               <Text style={styles.modalTitle}>Confirm Order</Text>
// // // // // // // // // // //               <TouchableOpacity onPress={() => setShowOrderModal(false)}>
// // // // // // // // // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View style={styles.modalBody}>
// // // // // // // // // // //               <View style={styles.orderSummary}>
// // // // // // // // // // //                 <Text style={styles.orderSummaryTitle}>Order Summary</Text>
// // // // // // // // // // //                 {cartItems.map((item, index) => (
// // // // // // // // // // //                   <View key={index} style={styles.orderSummaryItem}>
// // // // // // // // // // //                     <Text style={styles.orderSummaryName}>
// // // // // // // // // // //                       {item.name} × {item.quantity}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                     <Text style={styles.orderSummaryPrice}>
// // // // // // // // // // //                       ₹{item.price * item.quantity}
// // // // // // // // // // //                     </Text>
// // // // // // // // // // //                   </View>
// // // // // // // // // // //                 ))}
// // // // // // // // // // //                 <View style={styles.orderSummaryDivider} />
// // // // // // // // // // //                 <View style={styles.orderSummaryTotal}>
// // // // // // // // // // //                   <Text style={styles.orderSummaryTotalLabel}>Total</Text>
// // // // // // // // // // //                   <Text style={styles.orderSummaryTotalValue}>₹{total}</Text>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <TouchableOpacity 
// // // // // // // // // // //                 style={styles.placeOrderButton} 
// // // // // // // // // // //                 onPress={handlePlaceOrder}
// // // // // // // // // // //                 disabled={loading}
// // // // // // // // // // //               >
// // // // // // // // // // //                 {loading ? (
// // // // // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   <Text style={styles.placeOrderButtonText}>Confirm & Place Order</Text>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </Modal>
// // // // // // // // // // //     </SafeAreaView>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // // //   },
// // // // // // // // // // //   header: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // // // //   },
// // // // // // // // // // //   headerTitle: {
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   clearText: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: '#dc3545',
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //   },
// // // // // // // // // // //   emptyContainer: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingHorizontal: 32,
// // // // // // // // // // //   },
// // // // // // // // // // //   emptyText: {
// // // // // // // // // // //     fontSize: 20,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //     marginTop: 16,
// // // // // // // // // // //   },
// // // // // // // // // // //   emptySubText: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: '#7e808c',
// // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   browseButton: {
// // // // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // // // //     paddingHorizontal: 24,
// // // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // //     marginTop: 20,
// // // // // // // // // // //   },
// // // // // // // // // // //   browseButtonText: {
// // // // // // // // // // //     color: '#ffffff',
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //   },
// // // // // // // // // // //   cartList: {
// // // // // // // // // // //     padding: 16,
// // // // // // // // // // //     paddingBottom: 20,
// // // // // // // // // // //   },
// // // // // // // // // // //   cartItem: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     padding: 12,
// // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   cartItemImage: {
// // // // // // // // // // //     width: 60,
// // // // // // // // // // //     height: 60,
// // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   cartItemInfo: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   cartItemName: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   cartItemRestaurant: {
// // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // //     color: '#7e808c',
// // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // //   },
// // // // // // // // // // //   cartItemPrice: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: '#fc8019',
// // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   cartItemActions: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   quantityButton: {
// // // // // // // // // // //     width: 32,
// // // // // // // // // // //     height: 32,
// // // // // // // // // // //     borderRadius: 16,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: '#fc8019',
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   quantityText: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     marginHorizontal: 8,
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   removeButton: {
// // // // // // // // // // //     marginLeft: 8,
// // // // // // // // // // //     padding: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   footer: {
// // // // // // // // // // //     padding: 16,
// // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // //     borderTopColor: '#f0f0f5',
// // // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // // //   },
// // // // // // // // // // //   billContainer: {
// // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     padding: 16,
// // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   billTitle: {
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   billRow: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     paddingVertical: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   billLabel: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: '#7e808c',
// // // // // // // // // // //   },
// // // // // // // // // // //   billValue: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   totalRow: {
// // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // //     borderTopColor: '#e0e0e0',
// // // // // // // // // // //     paddingTop: 12,
// // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   totalLabel: {
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   totalValue: {
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // //     color: '#fc8019',
// // // // // // // // // // //   },
// // // // // // // // // // //   checkoutButton: {
// // // // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   checkoutButtonText: {
// // // // // // // // // // //     color: '#ffffff',
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //   },
// // // // // // // // // // //   modalOverlay: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // // // //     justifyContent: 'flex-end',
// // // // // // // // // // //   },
// // // // // // // // // // //   modalContainer: {
// // // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // // //     borderTopLeftRadius: 24,
// // // // // // // // // // //     borderTopRightRadius: 24,
// // // // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // // // //     paddingBottom: 30,
// // // // // // // // // // //     maxHeight: '80%',
// // // // // // // // // // //   },
// // // // // // // // // // //   modalHeader: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingVertical: 16,
// // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // // // //   },
// // // // // // // // // // //   modalTitle: {
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   modalBody: {
// // // // // // // // // // //     paddingTop: 16,
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummary: {
// // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     padding: 16,
// // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryTitle: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryItem: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     paddingVertical: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryName: {
// // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryPrice: {
// // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryDivider: {
// // // // // // // // // // //     height: 1,
// // // // // // // // // // //     backgroundColor: '#e0e0e0',
// // // // // // // // // // //     marginVertical: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryTotal: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     paddingTop: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryTotalLabel: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: '#282c3f',
// // // // // // // // // // //   },
// // // // // // // // // // //   orderSummaryTotalValue: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // //     color: '#fc8019',
// // // // // // // // // // //   },
// // // // // // // // // // //   placeOrderButton: {
// // // // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   placeOrderButtonText: {
// // // // // // // // // // //     color: '#ffffff',
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //   },
// // // // // // // // // // // });

// // // // // // // // // // // export default CartScreen;
// // // // // // // // // // import React, { useContext, useState } from 'react';
// // // // // // // // // // import {
// // // // // // // // // //   View,
// // // // // // // // // //   Text,
// // // // // // // // // //   ScrollView,
// // // // // // // // // //   TouchableOpacity,
// // // // // // // // // //   StyleSheet,
// // // // // // // // // //   SafeAreaView,
// // // // // // // // // //   StatusBar,
// // // // // // // // // //   Image,
// // // // // // // // // //   Alert,
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // import { CartContext } from '../../context/CartContext';

// // // // // // // // // // interface CartScreenProps {
// // // // // // // // // //   navigation: any;
// // // // // // // // // // }

// // // // // // // // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // // // // // // // //   const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useContext(CartContext);
// // // // // // // // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

// // // // // // // // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // // // // // // // //     if (newQuantity === 0) {
// // // // // // // // // //       removeFromCart(item.id, item.restaurantId);
// // // // // // // // // //     } else {
// // // // // // // // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleRemoveItem = (item: any) => {
// // // // // // // // // //     Alert.alert(
// // // // // // // // // //       'Remove Item',
// // // // // // // // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // // // // // // // //       [
// // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // //         {
// // // // // // // // // //           text: 'Remove',
// // // // // // // // // //           style: 'destructive',
// // // // // // // // // //           onPress: () => removeFromCart(item.id, item.restaurantId),
// // // // // // // // // //         },
// // // // // // // // // //       ]
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   const handlePlaceOrder = () => {
// // // // // // // // // //     if (cartItems.length === 0) {
// // // // // // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     Alert.alert(
// // // // // // // // // //       'Confirm Order',
// // // // // // // // // //       `Total Amount: ₹${getTotalPrice()}\nItems: ${getTotalItems()}`,
// // // // // // // // // //       [
// // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // //         {
// // // // // // // // // //           text: 'Place Order',
// // // // // // // // // //           style: 'default',
// // // // // // // // // //           onPress: () => {
// // // // // // // // // //             // Navigate to order tracking
// // // // // // // // // //             const orderId = 'ORD-' + Date.now().toString().slice(-6);
// // // // // // // // // //             navigation.navigate('OrderTracking', { 
// // // // // // // // // //               orderId,
// // // // // // // // // //               total: getTotalPrice(),
// // // // // // // // // //               items: cartItems,
// // // // // // // // // //             });
// // // // // // // // // //             clearCart();
// // // // // // // // // //           },
// // // // // // // // // //         },
// // // // // // // // // //       ]
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // // // // // //     <View style={styles.cartItem}>
// // // // // // // // // //       <Image 
// // // // // // // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // // // // // //         style={styles.itemImage} 
// // // // // // // // // //       />
// // // // // // // // // //       <View style={styles.itemInfo}>
// // // // // // // // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // // // // // // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // // // // // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // // // // // // //       </View>
// // // // // // // // // //       <View style={styles.quantityContainer}>
// // // // // // // // // //         <TouchableOpacity
// // // // // // // // // //           style={styles.quantityButton}
// // // // // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // // // // // // // //         >
// // // // // // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // // // // // //         <TouchableOpacity
// // // // // // // // // //           style={styles.quantityButton}
// // // // // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // // // // // // // //         >
// // // // // // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // //       </View>
// // // // // // // // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // // // // // // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // // // // // // // //       </TouchableOpacity>
// // // // // // // // // //     </View>
// // // // // // // // // //   );

// // // // // // // // // //   const PaymentMethod = ({ method, icon }: { method: string; icon: string }) => (
// // // // // // // // // //     <TouchableOpacity
// // // // // // // // // //       style={[
// // // // // // // // // //         styles.paymentMethod,
// // // // // // // // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // // // // // // // //       ]}
// // // // // // // // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // // // // // // // //     >
// // // // // // // // // //       <Icon name={icon} size={24} color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} />
// // // // // // // // // //       <Text style={[styles.paymentMethodText, selectedPaymentMethod === method && styles.selectedPaymentMethodText]}>
// // // // // // // // // //         {method}
// // // // // // // // // //       </Text>
// // // // // // // // // //       {selectedPaymentMethod === method && (
// // // // // // // // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // // // // // // // //       )}
// // // // // // // // // //     </TouchableOpacity>
// // // // // // // // // //   );

// // // // // // // // // //   if (cartItems.length === 0) {
// // // // // // // // // //     return (
// // // // // // // // // //       <SafeAreaView style={styles.container}>
// // // // // // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // // //           <View style={styles.headerRight} />
// // // // // // // // // //         </View>
// // // // // // // // // //         <View style={styles.emptyContainer}>
// // // // // // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // // // // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // // // // // // // //           <TouchableOpacity
// // // // // // // // // //             style={styles.shopButton}
// // // // // // // // // //             onPress={() => navigation.navigate('Home')}
// // // // // // // // // //           >
// // // // // // // // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // //         </View>
// // // // // // // // // //       </SafeAreaView>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // // // // //       {/* Header */}
// // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // // //         <TouchableOpacity onPress={() => clearCart()}>
// // // // // // // // // //           <Text style={styles.clearText}>Clear</Text>
// // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // //       </View>

// // // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // // //         {/* Cart Items */}
// // // // // // // // // //         <View style={styles.cartItemsContainer}>
// // // // // // // // // //           {cartItems.map((item, index) => (
// // // // // // // // // //             <View key={index}>
// // // // // // // // // //               {renderCartItem({ item })}
// // // // // // // // // //             </View>
// // // // // // // // // //           ))}
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Order Summary */}
// // // // // // // // // //         <View style={styles.summaryContainer}>
// // // // // // // // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // // // // // // // //             <Text style={styles.summaryValue}>₹{getTotalPrice()}</Text>
// // // // // // // // // //           </View>
// // // // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // // // // // // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // // // // // // // //           </View>
// // // // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // // // //             <Text style={styles.summaryLabel}>Tax (GST)</Text>
// // // // // // // // // //             <Text style={styles.summaryValue}>₹{Math.round(getTotalPrice() * 0.18)}</Text>
// // // // // // // // // //           </View>
// // // // // // // // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // // // // // // // //             <Text style={styles.totalLabel}>Total</Text>
// // // // // // // // // //             <Text style={styles.totalValue}>₹{Math.round(getTotalPrice() * 1.18)}</Text>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Payment Methods */}
// // // // // // // // // //         <View style={styles.paymentContainer}>
// // // // // // // // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // // // // // // // //           <PaymentMethod method="Cash on Delivery" icon="cash-outline" />
// // // // // // // // // //           <PaymentMethod method="Card Payment" icon="card-outline" />
// // // // // // // // // //           <PaymentMethod method="UPI" icon="phone-portrait-outline" />
// // // // // // // // // //           <PaymentMethod method="Net Banking" icon="business-outline" />
// // // // // // // // // //         </View>

// // // // // // // // // //         <View style={styles.footerSpacing} />
// // // // // // // // // //       </ScrollView>

// // // // // // // // // //       {/* Checkout Button */}
// // // // // // // // // //       <View style={styles.checkoutContainer}>
// // // // // // // // // //         <View style={styles.checkoutLeft}>
// // // // // // // // // //           <Text style={styles.checkoutTotal}>₹{Math.round(getTotalPrice() * 1.18)}</Text>
// // // // // // // // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // // // // // // // //         </View>
// // // // // // // // // //         <TouchableOpacity
// // // // // // // // // //           style={styles.checkoutButton}
// // // // // // // // // //           onPress={handlePlaceOrder}
// // // // // // // // // //         >
// // // // // // // // // //           <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
// // // // // // // // // //           <Icon name="arrow-forward" size={20} color="#ffffff" />
// // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // //       </View>
// // // // // // // // // //     </SafeAreaView>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // //   },
// // // // // // // // // //   header: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // // //   },
// // // // // // // // // //   headerTitle: {
// // // // // // // // // //     fontSize: 18,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //   },
// // // // // // // // // //   headerRight: {
// // // // // // // // // //     width: 40,
// // // // // // // // // //   },
// // // // // // // // // //   clearText: {
// // // // // // // // // //     color: '#dc3545',
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //   },
// // // // // // // // // //   cartItemsContainer: {
// // // // // // // // // //     padding: 16,
// // // // // // // // // //   },
// // // // // // // // // //   cartItem: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //     padding: 12,
// // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: '#f0f0f5',
// // // // // // // // // //   },
// // // // // // // // // //   itemImage: {
// // // // // // // // // //     width: 60,
// // // // // // // // // //     height: 60,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // // // //   },
// // // // // // // // // //   itemInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     marginLeft: 12,
// // // // // // // // // //   },
// // // // // // // // // //   itemName: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //   },
// // // // // // // // // //   itemPrice: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: '#fc8019',
// // // // // // // // // //     marginTop: 2,
// // // // // // // // // //   },
// // // // // // // // // //   itemRestaurant: {
// // // // // // // // // //     fontSize: 12,
// // // // // // // // // //     color: '#7e808c',
// // // // // // // // // //     marginTop: 2,
// // // // // // // // // //   },
// // // // // // // // // //   quantityContainer: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: '#fc8019',
// // // // // // // // // //     borderRadius: 6,
// // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // //     paddingHorizontal: 4,
// // // // // // // // // //     marginRight: 8,
// // // // // // // // // //   },
// // // // // // // // // //   quantityButton: {
// // // // // // // // // //     width: 28,
// // // // // // // // // //     height: 28,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   quantityText: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //     minWidth: 20,
// // // // // // // // // //     textAlign: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   removeButton: {
// // // // // // // // // //     padding: 4,
// // // // // // // // // //   },
// // // // // // // // // //   summaryContainer: {
// // // // // // // // // //     padding: 16,
// // // // // // // // // //     marginHorizontal: 16,
// // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //   },
// // // // // // // // // //   summaryTitle: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //     marginBottom: 12,
// // // // // // // // // //   },
// // // // // // // // // //   summaryRow: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //     paddingVertical: 6,
// // // // // // // // // //   },
// // // // // // // // // //   summaryLabel: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: '#7e808c',
// // // // // // // // // //   },
// // // // // // // // // //   summaryValue: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //   },
// // // // // // // // // //   totalRow: {
// // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // //     borderTopColor: '#e9ecef',
// // // // // // // // // //     paddingTop: 8,
// // // // // // // // // //     marginTop: 4,
// // // // // // // // // //   },
// // // // // // // // // //   totalLabel: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //   },
// // // // // // // // // //   totalValue: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '700',
// // // // // // // // // //     color: '#fc8019',
// // // // // // // // // //   },
// // // // // // // // // //   paymentContainer: {
// // // // // // // // // //     padding: 16,
// // // // // // // // // //     marginHorizontal: 16,
// // // // // // // // // //     marginTop: 16,
// // // // // // // // // //   },
// // // // // // // // // //   paymentTitle: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //     marginBottom: 12,
// // // // // // // // // //   },
// // // // // // // // // //   paymentMethod: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     padding: 12,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: '#e9ecef',
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //     marginBottom: 8,
// // // // // // // // // //   },
// // // // // // // // // //   selectedPaymentMethod: {
// // // // // // // // // //     borderColor: '#fc8019',
// // // // // // // // // //     backgroundColor: '#fff8f0',
// // // // // // // // // //   },
// // // // // // // // // //   paymentMethodText: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //     marginLeft: 12,
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },
// // // // // // // // // //   selectedPaymentMethodText: {
// // // // // // // // // //     color: '#fc8019',
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //   },
// // // // // // // // // //   checkmark: {
// // // // // // // // // //     marginLeft: 'auto',
// // // // // // // // // //   },
// // // // // // // // // //   checkoutContainer: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // //     borderTopColor: '#f0f0f5',
// // // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // // //   },
// // // // // // // // // //   checkoutLeft: {
// // // // // // // // // //     flexDirection: 'column',
// // // // // // // // // //   },
// // // // // // // // // //   checkoutTotal: {
// // // // // // // // // //     fontSize: 18,
// // // // // // // // // //     fontWeight: '700',
// // // // // // // // // //     color: '#fc8019',
// // // // // // // // // //   },
// // // // // // // // // //   checkoutItems: {
// // // // // // // // // //     fontSize: 12,
// // // // // // // // // //     color: '#7e808c',
// // // // // // // // // //   },
// // // // // // // // // //   checkoutButton: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //   },
// // // // // // // // // //   checkoutButtonText: {
// // // // // // // // // //     color: '#ffffff',
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     marginRight: 8,
// // // // // // // // // //   },
// // // // // // // // // //   emptyContainer: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     padding: 40,
// // // // // // // // // //   },
// // // // // // // // // //   emptyText: {
// // // // // // // // // //     fontSize: 20,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: '#282c3f',
// // // // // // // // // //     marginTop: 16,
// // // // // // // // // //   },
// // // // // // // // // //   emptySubText: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: '#7e808c',
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //     textAlign: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   shopButton: {
// // // // // // // // // //     marginTop: 24,
// // // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // // //     paddingHorizontal: 32,
// // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //   },
// // // // // // // // // //   shopButtonText: {
// // // // // // // // // //     color: '#ffffff',
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //   },
// // // // // // // // // //   footerSpacing: {
// // // // // // // // // //     height: 80,
// // // // // // // // // //   },
// // // // // // // // // // });

// // // // // // // // // // export default CartScreen;
// // // // // // // // // // src/screens/main/CartScreen.tsx
// // // // // // // // // import React, { useContext, useState } from 'react';
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   ScrollView,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   SafeAreaView,
// // // // // // // // //   StatusBar,
// // // // // // // // //   Image,
// // // // // // // // //   Alert,
// // // // // // // // //   ActivityIndicator,
// // // // // // // // // } from 'react-native';
// // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // // // // ✅ FIXED: Use require to avoid TypeScript error
// // // // // // // // // const RazorpayCheckout = require('react-native-razorpay');

// // // // // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // // // // import { paymentService } from '../../services/paymentService';

// // // // // // // // // interface CartScreenProps {
// // // // // // // // //   navigation: any;
// // // // // // // // // }

// // // // // // // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // // // // // // //   const { 
// // // // // // // // //     cartItems, 
// // // // // // // // //     updateQuantity, 
// // // // // // // // //     removeFromCart, 
// // // // // // // // //     getTotalPrice, 
// // // // // // // // //     getTotalItems, 
// // // // // // // // //     clearCart 
// // // // // // // // //   } = useContext(CartContext);
  
// // // // // // // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // // // // // // // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);

// // // // // // // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // // // // // // //     if (newQuantity === 0) {
// // // // // // // // //       removeFromCart(item.id, item.restaurantId);
// // // // // // // // //     } else {
// // // // // // // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleRemoveItem = (item: any) => {
// // // // // // // // //     Alert.alert(
// // // // // // // // //       'Remove Item',
// // // // // // // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // // // // // // //       [
// // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // // // // // // // //       ]
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   const calculateTotal = () => {
// // // // // // // // //     const subtotal = getTotalPrice();
// // // // // // // // //     const tax = Math.round(subtotal * 0.18);
// // // // // // // // //     const total = subtotal + tax;
// // // // // // // // //     return { subtotal, tax, total };
// // // // // // // // //   };

// // // // // // // // //   // Handle Razorpay Payment
// // // // // // // // //   // const handleRazorpayPayment = async () => {
// // // // // // // // //   //   if (cartItems.length === 0) {
// // // // // // // // //   //     Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // // // //   //     return;
// // // // // // // // //   //   }

// // // // // // // // //   //   setIsProcessing(true);
// // // // // // // // //   //   const { total } = calculateTotal();

// // // // // // // // //   //   try {
// // // // // // // // //   //     // 1. Create Razorpay order
// // // // // // // // //   //     const orderResponse = await paymentService.createOrder(total, 'INR');
      
// // // // // // // // //   //     if (!orderResponse.success) {
// // // // // // // // //   //       throw new Error(orderResponse.message || 'Failed to create order');
// // // // // // // // //   //     }

// // // // // // // // //   //     const { order, key } = orderResponse;
// // // // // // // // //   //     console.log('✅ Order created:', order);

// // // // // // // // //   //     // 2. Open Razorpay Checkout
// // // // // // // // //   //     const options = {
// // // // // // // // //   //       description: 'QuickBite Order Payment',
// // // // // // // // //   //       image: 'https://via.placeholder.com/150',
// // // // // // // // //   //       currency: order.currency || 'INR',
// // // // // // // // //   //       key: key,
// // // // // // // // //   //       amount: order.amount,
// // // // // // // // //   //       name: 'QuickBite',
// // // // // // // // //   //       order_id: order.id,
// // // // // // // // //   //       prefill: {
// // // // // // // // //   //         email: 'john@example.com',
// // // // // // // // //   //         contact: '9876543210',
// // // // // // // // //   //         name: 'John Doe',
// // // // // // // // //   //       },
// // // // // // // // //   //       theme: {
// // // // // // // // //   //         color: '#fc8019',
// // // // // // // // //   //       },
// // // // // // // // //   //       modal: {
// // // // // // // // //   //         ondismiss: function() {
// // // // // // // // //   //           setIsProcessing(false);
// // // // // // // // //   //           Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // // // // // //   //         },
// // // // // // // // //   //       },
// // // // // // // // //   //     };

// // // // // // // // //   //     console.log('💳 Opening Razorpay...');

// // // // // // // // //   //     RazorpayCheckout.open(options)
// // // // // // // // //   //       .then(async (data: any) => {
// // // // // // // // //   //         console.log('✅ Payment success:', data);

// // // // // // // // //   //         // 3. Verify payment
// // // // // // // // //   //         try {
// // // // // // // // //   //           const verifyResponse = await paymentService.verifyPayment(
// // // // // // // // //   //             data.razorpay_order_id,
// // // // // // // // //   //             data.razorpay_payment_id,
// // // // // // // // //   //             data.razorpay_signature,
// // // // // // // // //   //             'ORD-' + Date.now().toString().slice(-6)
// // // // // // // // //   //           );

// // // // // // // // //   //           setIsProcessing(false);

// // // // // // // // //   //           if (verifyResponse.success) {
// // // // // // // // //   //             Alert.alert(
// // // // // // // // //   //               'Payment Successful! 🎉',
// // // // // // // // //   //               `Payment ID: ${data.razorpay_payment_id}\nOrder ID: ${data.razorpay_order_id}`,
// // // // // // // // //   //               [
// // // // // // // // //   //                 {
// // // // // // // // //   //                   text: 'View Order',
// // // // // // // // //   //                   onPress: () => {
// // // // // // // // //   //                     navigation.navigate('OrderTracking', {
// // // // // // // // //   //                       orderId: data.razorpay_order_id,
// // // // // // // // //   //                       total: total,
// // // // // // // // //   //                       items: cartItems,
// // // // // // // // //   //                       paymentMethod: 'Razorpay',
// // // // // // // // //   //                       paymentId: data.razorpay_payment_id,
// // // // // // // // //   //                       paymentStatus: 'Paid',
// // // // // // // // //   //                     });
// // // // // // // // //   //                     clearCart();
// // // // // // // // //   //                   },
// // // // // // // // //   //                 },
// // // // // // // // //   //               ]
// // // // // // // // //   //             );
// // // // // // // // //   //           } else {
// // // // // // // // //   //             Alert.alert(
// // // // // // // // //   //               'Payment Verification Failed',
// // // // // // // // //   //               verifyResponse.message || 'Please contact support.'
// // // // // // // // //   //             );
// // // // // // // // //   //           }
// // // // // // // // //   //         } catch (verifyError: any) {
// // // // // // // // //   //           setIsProcessing(false);
// // // // // // // // //   //           Alert.alert('Verification Failed', 'Please contact support.');
// // // // // // // // //   //         }
// // // // // // // // //   //       })
// // // // // // // // //   //       .catch((error: any) => {
// // // // // // // // //   //         setIsProcessing(false);
// // // // // // // // //   //         Alert.alert(
// // // // // // // // //   //           'Payment Failed',
// // // // // // // // //   //           error?.description || 'Something went wrong. Please try again.'
// // // // // // // // //   //         );
// // // // // // // // //   //       });

// // // // // // // // //   //   } catch (error: any) {
// // // // // // // // //   //     setIsProcessing(false);
// // // // // // // // //   //     Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // // // // // //   //   }
// // // // // // // // //   // };
// // // // // // // // // // src/screens/main/CartScreen.tsx

// // // // // // // // // const handleRazorpayPayment = async () => {
// // // // // // // // //   if (cartItems.length === 0) {
// // // // // // // // //     Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // // // //     return;
// // // // // // // // //   }

// // // // // // // // //   setIsProcessing(true);
// // // // // // // // //   const { total } = calculateTotal();

// // // // // // // // //   try {
// // // // // // // // //     // ✅ Send the amount in rupees (not multiplied by 100)
// // // // // // // // //     // The backend will multiply by 100 to convert to paise
// // // // // // // // //     const orderResponse = await paymentService.createOrder(total, 'INR');
    
// // // // // // // // //     if (!orderResponse.success) {
// // // // // // // // //       throw new Error(orderResponse.message || 'Failed to create order');
// // // // // // // // //     }

// // // // // // // // //     const { order, key } = orderResponse;
// // // // // // // // //     console.log('✅ Order created:', order);

// // // // // // // // //     // ✅ Use the amount from the order response (which is in paise)
// // // // // // // // //     const options = {
// // // // // // // // //       description: 'QuickBite Order Payment',
// // // // // // // // //       image: 'https://via.placeholder.com/150',
// // // // // // // // //       currency: order.currency || 'INR',
// // // // // // // // //       key: key,
// // // // // // // // //       amount: order.amount, // ✅ This is already in paise
// // // // // // // // //       name: 'QuickBite',
// // // // // // // // //       order_id: order.id,
// // // // // // // // //       prefill: {
// // // // // // // // //         email: 'john@example.com',
// // // // // // // // //         contact: '9876543210',
// // // // // // // // //         name: 'John Doe',
// // // // // // // // //       },
// // // // // // // // //       theme: {
// // // // // // // // //         color: '#fc8019',
// // // // // // // // //       },
// // // // // // // // //       modal: {
// // // // // // // // //         ondismiss: function() {
// // // // // // // // //           setIsProcessing(false);
// // // // // // // // //           Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // // // // // //         },
// // // // // // // // //       },
// // // // // // // // //     };

// // // // // // // // //     console.log('💳 Opening Razorpay with options:', options);

// // // // // // // // //     RazorpayCheckout.open(options)
// // // // // // // // //       .then(async (data: any) => {
// // // // // // // // //         // ... rest of your code
// // // // // // // // //       })
// // // // // // // // //       .catch((error: any) => {
// // // // // // // // //         console.error('❌ Razorpay error:', error);
// // // // // // // // //         setIsProcessing(false);
// // // // // // // // //         Alert.alert(
// // // // // // // // //           'Payment Failed',
// // // // // // // // //           error?.description || error?.message || 'Something went wrong. Please try again.'
// // // // // // // // //         );
// // // // // // // // //       });

// // // // // // // // //   } catch (error: any) {
// // // // // // // // //     setIsProcessing(false);
// // // // // // // // //     console.error('❌ Payment error:', error);
// // // // // // // // //     Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // // // // // //   }
// // // // // // // // // };
// // // // // // // // //   // Handle Cash on Delivery
// // // // // // // // //   const handleCashOnDelivery = () => {
// // // // // // // // //     if (cartItems.length === 0) {
// // // // // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     const { total } = calculateTotal();

// // // // // // // // //     Alert.alert(
// // // // // // // // //       'Confirm Order',
// // // // // // // // //       `Total Amount: ₹${total}\nItems: ${getTotalItems()}\nPayment: Cash on Delivery`,
// // // // // // // // //       [
// // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // //         {
// // // // // // // // //           text: 'Place Order',
// // // // // // // // //           style: 'default',
// // // // // // // // //           onPress: () => {
// // // // // // // // //             const orderId = 'ORD-' + Date.now().toString().slice(-6);
// // // // // // // // //             navigation.navigate('OrderTracking', {
// // // // // // // // //               orderId: orderId,
// // // // // // // // //               total: total,
// // // // // // // // //               items: cartItems,
// // // // // // // // //               paymentMethod: 'Cash on Delivery',
// // // // // // // // //               paymentStatus: 'Pending',
// // // // // // // // //             });
// // // // // // // // //             clearCart();
// // // // // // // // //           },
// // // // // // // // //         },
// // // // // // // // //       ]
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   const handlePlaceOrder = () => {
// // // // // // // // //     if (selectedPaymentMethod === 'Razorpay') {
// // // // // // // // //       handleRazorpayPayment();
// // // // // // // // //     } else {
// // // // // // // // //       handleCashOnDelivery();
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Render cart item
// // // // // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // // // // //     <View style={styles.cartItem}>
// // // // // // // // //       <Image 
// // // // // // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // // // // //         style={styles.itemImage} 
// // // // // // // // //       />
// // // // // // // // //       <View style={styles.itemInfo}>
// // // // // // // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // // // // // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // // // // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // // // // // //       </View>
// // // // // // // // //       <View style={styles.quantityContainer}>
// // // // // // // // //         <TouchableOpacity
// // // // // // // // //           style={styles.quantityButton}
// // // // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // // // // // // //         >
// // // // // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // // // // //         <TouchableOpacity
// // // // // // // // //           style={styles.quantityButton}
// // // // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // // // // // // //         >
// // // // // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //       </View>
// // // // // // // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // // // // // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // // // // // // //       </TouchableOpacity>
// // // // // // // // //     </View>
// // // // // // // // //   );

// // // // // // // // //   // Render payment method
// // // // // // // // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // // // // // // // //     <TouchableOpacity
// // // // // // // // //       style={[
// // // // // // // // //         styles.paymentMethod,
// // // // // // // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // // // // // // //       ]}
// // // // // // // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // // // // // // //     >
// // // // // // // // //       <Icon 
// // // // // // // // //         name={icon} 
// // // // // // // // //         size={24} 
// // // // // // // // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // // // // // // // //       />
// // // // // // // // //       <View style={styles.paymentMethodInfo}>
// // // // // // // // //         <Text style={[
// // // // // // // // //           styles.paymentMethodText, 
// // // // // // // // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // // // // // // // //         ]}>
// // // // // // // // //           {method}
// // // // // // // // //         </Text>
// // // // // // // // //         {description && (
// // // // // // // // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // // // // // // // //         )}
// // // // // // // // //       </View>
// // // // // // // // //       {selectedPaymentMethod === method && (
// // // // // // // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // // // // // // //       )}
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // //   );

// // // // // // // // //   const { subtotal, tax, total } = calculateTotal();

// // // // // // // // //   // Empty cart view
// // // // // // // // //   if (cartItems.length === 0) {
// // // // // // // // //     return (
// // // // // // // // //       <SafeAreaView style={styles.container}>
// // // // // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // // // // //         <View style={styles.header}>
// // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // //           <View style={styles.headerRight} />
// // // // // // // // //         </View>
// // // // // // // // //         <View style={styles.emptyContainer}>
// // // // // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // // // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // // // // // // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// // // // // // // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //         </View>
// // // // // // // // //       </SafeAreaView>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // // // //       <View style={styles.header}>
// // // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // // //         <TouchableOpacity onPress={() => {
// // // // // // // // //           Alert.alert(
// // // // // // // // //             'Clear Cart',
// // // // // // // // //             'Are you sure you want to clear your cart?',
// // // // // // // // //             [
// // // // // // // // //               { text: 'Cancel', style: 'cancel' },
// // // // // // // // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // // // // // // // //             ]
// // // // // // // // //           );
// // // // // // // // //         }}>
// // // // // // // // //           <Text style={styles.clearText}>Clear</Text>
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //       </View>

// // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // //         {/* Cart Items */}
// // // // // // // // //         <View style={styles.cartItemsContainer}>
// // // // // // // // //           {cartItems.map((item, index) => (
// // // // // // // // //             <View key={index}>
// // // // // // // // //               {renderCartItem({ item })}
// // // // // // // // //             </View>
// // // // // // // // //           ))}
// // // // // // // // //         </View>

// // // // // // // // //         {/* Order Summary */}
// // // // // // // // //         <View style={styles.summaryContainer}>
// // // // // // // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // // // // // // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // // // // // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // // // // // // // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // // // // // // //             <Text style={styles.totalLabel}>Total</Text>
// // // // // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // // // // //           </View>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Payment Methods */}
// // // // // // // // //         <View style={styles.paymentContainer}>
// // // // // // // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // // // // // // //           <PaymentMethod 
// // // // // // // // //             method="Razorpay" 
// // // // // // // // //             icon="card-outline" 
// // // // // // // // //             description="Credit/Debit Card, UPI, Net Banking" 
// // // // // // // // //           />
// // // // // // // // //           <PaymentMethod 
// // // // // // // // //             method="Cash on Delivery" 
// // // // // // // // //             icon="cash-outline" 
// // // // // // // // //             description="Pay when you receive" 
// // // // // // // // //           />
// // // // // // // // //         </View>

// // // // // // // // //         <View style={styles.footerSpacing} />
// // // // // // // // //       </ScrollView>

// // // // // // // // //       {/* Processing Overlay */}
// // // // // // // // //       {isProcessing && (
// // // // // // // // //         <View style={styles.overlay}>
// // // // // // // // //           <View style={styles.processingContainer}>
// // // // // // // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // // // // // // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // // // // // // // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       )}

// // // // // // // // //       {/* Checkout Button */}
// // // // // // // // //       <View style={styles.checkoutContainer}>
// // // // // // // // //         <View style={styles.checkoutLeft}>
// // // // // // // // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // // // // // // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // // // // // // //         </View>
// // // // // // // // //         <TouchableOpacity
// // // // // // // // //           style={styles.checkoutButton}
// // // // // // // // //           onPress={handlePlaceOrder}
// // // // // // // // //           disabled={isProcessing}
// // // // // // // // //         >
// // // // // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // // // // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
// // // // // // // // //           </Text>
// // // // // // // // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //       </View>
// // // // // // // // //     </SafeAreaView>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // //   },
// // // // // // // // //   header: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   headerTitle: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   headerRight: {
// // // // // // // // //     width: 40,
// // // // // // // // //   },
// // // // // // // // //   clearText: {
// // // // // // // // //     color: '#dc3545',
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //   },
// // // // // // // // //   cartItemsContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //   },
// // // // // // // // //   cartItem: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //     padding: 12,
// // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   itemImage: {
// // // // // // // // //     width: 60,
// // // // // // // // //     height: 60,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   itemInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },
// // // // // // // // //   itemName: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   itemPrice: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#fc8019',
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   itemRestaurant: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   quantityContainer: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: '#fc8019',
// // // // // // // // //     borderRadius: 6,
// // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // //     paddingHorizontal: 4,
// // // // // // // // //     marginRight: 8,
// // // // // // // // //   },
// // // // // // // // //   quantityButton: {
// // // // // // // // //     width: 28,
// // // // // // // // //     height: 28,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   quantityText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     minWidth: 20,
// // // // // // // // //     textAlign: 'center',
// // // // // // // // //   },
// // // // // // // // //   removeButton: {
// // // // // // // // //     padding: 4,
// // // // // // // // //   },
// // // // // // // // //   summaryContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     marginHorizontal: 16,
// // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   summaryTitle: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   summaryRow: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     paddingVertical: 6,
// // // // // // // // //   },
// // // // // // // // //   summaryLabel: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //   },
// // // // // // // // //   summaryValue: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   totalRow: {
// // // // // // // // //     borderTopWidth: 1,
// // // // // // // // //     borderTopColor: '#e9ecef',
// // // // // // // // //     paddingTop: 8,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   totalLabel: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   totalValue: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '700',
// // // // // // // // //     color: '#fc8019',
// // // // // // // // //   },
// // // // // // // // //   paymentContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     marginHorizontal: 16,
// // // // // // // // //     marginTop: 16,
// // // // // // // // //   },
// // // // // // // // //   paymentTitle: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   paymentMethod: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     padding: 12,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: '#e9ecef',
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     marginBottom: 8,
// // // // // // // // //   },
// // // // // // // // //   selectedPaymentMethod: {
// // // // // // // // //     borderColor: '#fc8019',
// // // // // // // // //     backgroundColor: '#fff8f0',
// // // // // // // // //   },
// // // // // // // // //   paymentMethodInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },
// // // // // // // // //   paymentMethodText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   selectedPaymentMethodText: {
// // // // // // // // //     color: '#fc8019',
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   paymentMethodDescription: {
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   checkmark: {
// // // // // // // // //     marginLeft: 'auto',
// // // // // // // // //   },
// // // // // // // // //   checkoutContainer: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderTopWidth: 1,
// // // // // // // // //     borderTopColor: '#f0f0f5',
// // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // //   },
// // // // // // // // //   checkoutLeft: {
// // // // // // // // //     flexDirection: 'column',
// // // // // // // // //   },
// // // // // // // // //   checkoutTotal: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '700',
// // // // // // // // //     color: '#fc8019',
// // // // // // // // //   },
// // // // // // // // //   checkoutItems: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //   },
// // // // // // // // //   checkoutButton: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //   },
// // // // // // // // //   checkoutButtonText: {
// // // // // // // // //     color: '#ffffff',
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     marginRight: 8,
// // // // // // // // //   },
// // // // // // // // //   emptyContainer: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     padding: 40,
// // // // // // // // //   },
// // // // // // // // //   emptyText: {
// // // // // // // // //     fontSize: 20,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     marginTop: 16,
// // // // // // // // //   },
// // // // // // // // //   emptySubText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginTop: 8,
// // // // // // // // //     textAlign: 'center',
// // // // // // // // //   },
// // // // // // // // //   shopButton: {
// // // // // // // // //     marginTop: 24,
// // // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // // //     paddingHorizontal: 32,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //   },
// // // // // // // // //   shopButtonText: {
// // // // // // // // //     color: '#ffffff',
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   footerSpacing: {
// // // // // // // // //     height: 80,
// // // // // // // // //   },
// // // // // // // // //   overlay: {
// // // // // // // // //     position: 'absolute',
// // // // // // // // //     top: 0,
// // // // // // // // //     left: 0,
// // // // // // // // //     right: 0,
// // // // // // // // //     bottom: 0,
// // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     zIndex: 999,
// // // // // // // // //   },
// // // // // // // // //   processingContainer: {
// // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     padding: 30,
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     width: '80%',
// // // // // // // // //   },
// // // // // // // // //   processingText: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     marginTop: 16,
// // // // // // // // //   },
// // // // // // // // //   processingSubText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // // });

// // // // // // // // // export default CartScreen;
// // // // // // // // // src/screens/main/CartScreen.tsx
// // // // // // // // import React, { useContext, useState } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   ScrollView,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   StyleSheet,
// // // // // // // //   SafeAreaView,
// // // // // // // //   StatusBar,
// // // // // // // //   Image,
// // // // // // // //   Alert,
// // // // // // // //   ActivityIndicator,
// // // // // // // // } from 'react-native';
// // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // // // ✅ FIXED: Use require to avoid TypeScript error
// // // // // // // // const RazorpayCheckout = require('react-native-razorpay');

// // // // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // // // import { paymentService } from '../../services/paymentService';

// // // // // // // // interface CartScreenProps {
// // // // // // // //   navigation: any;
// // // // // // // // }

// // // // // // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // // // // // //   const { 
// // // // // // // //     cartItems, 
// // // // // // // //     updateQuantity, 
// // // // // // // //     removeFromCart, 
// // // // // // // //     getTotalPrice, 
// // // // // // // //     getTotalItems, 
// // // // // // // //     clearCart 
// // // // // // // //   } = useContext(CartContext);
  
// // // // // // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // // // // // // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);

// // // // // // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // // // // // //     if (newQuantity === 0) {
// // // // // // // //       removeFromCart(item.id, item.restaurantId);
// // // // // // // //     } else {
// // // // // // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleRemoveItem = (item: any) => {
// // // // // // // //     Alert.alert(
// // // // // // // //       'Remove Item',
// // // // // // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // // // // // //       [
// // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // // // // // // //       ]
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   const calculateTotal = () => {
// // // // // // // //     const subtotal = getTotalPrice();
// // // // // // // //     const tax = Math.round(subtotal * 0.18);
// // // // // // // //     const total = subtotal + tax;
// // // // // // // //     return { subtotal, tax, total };
// // // // // // // //   };

// // // // // // // //   // ✅ FIXED: Handle Razorpay Payment
// // // // // // // //   const handleRazorpayPayment = async () => {
// // // // // // // //     if (cartItems.length === 0) {
// // // // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     setIsProcessing(true);
// // // // // // // //     const { total } = calculateTotal();

// // // // // // // //     try {
// // // // // // // //       // ✅ Send amount in rupees (backend will convert to paise)
// // // // // // // //       const orderResponse = await paymentService.createOrder(total, 'INR');
      
// // // // // // // //       console.log('📦 Order response:', orderResponse);

// // // // // // // //       if (!orderResponse.success) {
// // // // // // // //         throw new Error(orderResponse.message || 'Failed to create order');
// // // // // // // //       }

// // // // // // // //       const { order, key } = orderResponse;
// // // // // // // //       console.log('✅ Order created:', order);

// // // // // // // //       // ✅ Use the order amount (already in paise from backend)
// // // // // // // //       const options = {
// // // // // // // //         description: 'QuickBite Order Payment',
// // // // // // // //         image: 'https://via.placeholder.com/150',
// // // // // // // //         currency: order.currency || 'INR',
// // // // // // // //         key: key,
// // // // // // // //         amount: order.amount, // ✅ Already in paise
// // // // // // // //         name: 'QuickBite',
// // // // // // // //         order_id: order.id,
// // // // // // // //         prefill: {
// // // // // // // //           email: 'john@example.com',
// // // // // // // //           contact: '9876543210',
// // // // // // // //           name: 'John Doe',
// // // // // // // //         },
// // // // // // // //         theme: {
// // // // // // // //           color: '#fc8019',
// // // // // // // //         },
// // // // // // // //         modal: {
// // // // // // // //           ondismiss: function() {
// // // // // // // //             setIsProcessing(false);
// // // // // // // //             Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // // // // //           },
// // // // // // // //         },
// // // // // // // //       };

// // // // // // // //       console.log('💳 Opening Razorpay with options:', options);

// // // // // // // //       RazorpayCheckout.open(options)
// // // // // // // //         .then(async (data: any) => {
// // // // // // // //           console.log('✅ Payment success:', data);

// // // // // // // //           // Verify payment
// // // // // // // //           try {
// // // // // // // //             const verifyResponse = await paymentService.verifyPayment(
// // // // // // // //               data.razorpay_order_id,
// // // // // // // //               data.razorpay_payment_id,
// // // // // // // //               data.razorpay_signature,
// // // // // // // //               'ORD-' + Date.now().toString().slice(-6)
// // // // // // // //             );

// // // // // // // //             setIsProcessing(false);

// // // // // // // //             if (verifyResponse.success) {
// // // // // // // //               Alert.alert(
// // // // // // // //                 'Payment Successful! 🎉',
// // // // // // // //                 `Payment ID: ${data.razorpay_payment_id}\nOrder ID: ${data.razorpay_order_id}`,
// // // // // // // //                 [
// // // // // // // //                   {
// // // // // // // //                     text: 'View Order',
// // // // // // // //                     onPress: () => {
// // // // // // // //                       navigation.navigate('OrderTracking', {
// // // // // // // //                         orderId: data.razorpay_order_id,
// // // // // // // //                         total: total,
// // // // // // // //                         items: cartItems,
// // // // // // // //                         paymentMethod: 'Razorpay',
// // // // // // // //                         paymentId: data.razorpay_payment_id,
// // // // // // // //                         paymentStatus: 'Paid',
// // // // // // // //                       });
// // // // // // // //                       clearCart();
// // // // // // // //                     },
// // // // // // // //                   },
// // // // // // // //                 ]
// // // // // // // //               );
// // // // // // // //             } else {
// // // // // // // //               Alert.alert(
// // // // // // // //                 'Payment Verification Failed',
// // // // // // // //                 verifyResponse.message || 'Please contact support.'
// // // // // // // //               );
// // // // // // // //             }
// // // // // // // //           } catch (verifyError: any) {
// // // // // // // //             setIsProcessing(false);
// // // // // // // //             console.error('❌ Verification error:', verifyError);
// // // // // // // //             Alert.alert('Verification Failed', 'Please contact support.');
// // // // // // // //           }
// // // // // // // //         })
// // // // // // // //         .catch((error: any) => {
// // // // // // // //           setIsProcessing(false);
// // // // // // // //           console.error('❌ Razorpay error:', error);
// // // // // // // //           Alert.alert(
// // // // // // // //             'Payment Failed',
// // // // // // // //             error?.description || error?.message || 'Something went wrong. Please try again.'
// // // // // // // //           );
// // // // // // // //         });

// // // // // // // //     } catch (error: any) {
// // // // // // // //       setIsProcessing(false);
// // // // // // // //       console.error('❌ Payment error:', error);
// // // // // // // //       Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Handle Cash on Delivery
// // // // // // // //   const handleCashOnDelivery = () => {
// // // // // // // //     if (cartItems.length === 0) {
// // // // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     const { total } = calculateTotal();

// // // // // // // //     Alert.alert(
// // // // // // // //       'Confirm Order',
// // // // // // // //       `Total Amount: ₹${total}\nItems: ${getTotalItems()}\nPayment: Cash on Delivery`,
// // // // // // // //       [
// // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // //         {
// // // // // // // //           text: 'Place Order',
// // // // // // // //           style: 'default',
// // // // // // // //           onPress: () => {
// // // // // // // //             const orderId = 'ORD-' + Date.now().toString().slice(-6);
// // // // // // // //             navigation.navigate('OrderTracking', {
// // // // // // // //               orderId: orderId,
// // // // // // // //               total: total,
// // // // // // // //               items: cartItems,
// // // // // // // //               paymentMethod: 'Cash on Delivery',
// // // // // // // //               paymentStatus: 'Pending',
// // // // // // // //             });
// // // // // // // //             clearCart();
// // // // // // // //           },
// // // // // // // //         },
// // // // // // // //       ]
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   const handlePlaceOrder = () => {
// // // // // // // //     if (selectedPaymentMethod === 'Razorpay') {
// // // // // // // //       handleRazorpayPayment();
// // // // // // // //     } else {
// // // // // // // //       handleCashOnDelivery();
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Render cart item
// // // // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // // // //     <View style={styles.cartItem}>
// // // // // // // //       <Image 
// // // // // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // // // //         style={styles.itemImage} 
// // // // // // // //       />
// // // // // // // //       <View style={styles.itemInfo}>
// // // // // // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // // // // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // // // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // // // // //       </View>
// // // // // // // //       <View style={styles.quantityContainer}>
// // // // // // // //         <TouchableOpacity
// // // // // // // //           style={styles.quantityButton}
// // // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // // // // // //         >
// // // // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // // // //         <TouchableOpacity
// // // // // // // //           style={styles.quantityButton}
// // // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // // // // // //         >
// // // // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // // // // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // // // // // //       </TouchableOpacity>
// // // // // // // //     </View>
// // // // // // // //   );

// // // // // // // //   // Render payment method
// // // // // // // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       style={[
// // // // // // // //         styles.paymentMethod,
// // // // // // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // // // // // //       ]}
// // // // // // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // // // // // //     >
// // // // // // // //       <Icon 
// // // // // // // //         name={icon} 
// // // // // // // //         size={24} 
// // // // // // // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // // // // // // //       />
// // // // // // // //       <View style={styles.paymentMethodInfo}>
// // // // // // // //         <Text style={[
// // // // // // // //           styles.paymentMethodText, 
// // // // // // // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // // // // // // //         ]}>
// // // // // // // //           {method}
// // // // // // // //         </Text>
// // // // // // // //         {description && (
// // // // // // // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // // // // // // //         )}
// // // // // // // //       </View>
// // // // // // // //       {selectedPaymentMethod === method && (
// // // // // // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // // // // // //       )}
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   const { subtotal, tax, total } = calculateTotal();

// // // // // // // //   // Empty cart view
// // // // // // // //   if (cartItems.length === 0) {
// // // // // // // //     return (
// // // // // // // //       <SafeAreaView style={styles.container}>
// // // // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // // // //         <View style={styles.header}>
// // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // //           </TouchableOpacity>
// // // // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // //           <View style={styles.headerRight} />
// // // // // // // //         </View>
// // // // // // // //         <View style={styles.emptyContainer}>
// // // // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // // // // // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// // // // // // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </View>
// // // // // // // //       </SafeAreaView>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // // //       <View style={styles.header}>
// // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // // //         <TouchableOpacity onPress={() => {
// // // // // // // //           Alert.alert(
// // // // // // // //             'Clear Cart',
// // // // // // // //             'Are you sure you want to clear your cart?',
// // // // // // // //             [
// // // // // // // //               { text: 'Cancel', style: 'cancel' },
// // // // // // // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // // // // // // //             ]
// // // // // // // //           );
// // // // // // // //         }}>
// // // // // // // //           <Text style={styles.clearText}>Clear</Text>
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>

// // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // //         {/* Cart Items */}
// // // // // // // //         <View style={styles.cartItemsContainer}>
// // // // // // // //           {cartItems.map((item, index) => (
// // // // // // // //             <View key={index}>
// // // // // // // //               {renderCartItem({ item })}
// // // // // // // //             </View>
// // // // // // // //           ))}
// // // // // // // //         </View>

// // // // // // // //         {/* Order Summary */}
// // // // // // // //         <View style={styles.summaryContainer}>
// // // // // // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // // // // // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // // // // // // //           </View>
// // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // // // // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // // // // // //           </View>
// // // // // // // //           <View style={styles.summaryRow}>
// // // // // // // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // // // // // // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // // // // // // //           </View>
// // // // // // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // // // // // //             <Text style={styles.totalLabel}>Total</Text>
// // // // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // // // //           </View>
// // // // // // // //         </View>

// // // // // // // //         {/* Payment Methods */}
// // // // // // // //         <View style={styles.paymentContainer}>
// // // // // // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // // // // // //           <PaymentMethod 
// // // // // // // //             method="Razorpay" 
// // // // // // // //             icon="card-outline" 
// // // // // // // //             description="Credit/Debit Card, UPI, Net Banking" 
// // // // // // // //           />
// // // // // // // //           <PaymentMethod 
// // // // // // // //             method="Cash on Delivery" 
// // // // // // // //             icon="cash-outline" 
// // // // // // // //             description="Pay when you receive" 
// // // // // // // //           />
// // // // // // // //         </View>

// // // // // // // //         <View style={styles.footerSpacing} />
// // // // // // // //       </ScrollView>

// // // // // // // //       {/* Processing Overlay */}
// // // // // // // //       {isProcessing && (
// // // // // // // //         <View style={styles.overlay}>
// // // // // // // //           <View style={styles.processingContainer}>
// // // // // // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // // // // // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // // // // // // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       )}

// // // // // // // //       {/* Checkout Button */}
// // // // // // // //       <View style={styles.checkoutContainer}>
// // // // // // // //         <View style={styles.checkoutLeft}>
// // // // // // // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // // // // // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // // // // // //         </View>
// // // // // // // //         <TouchableOpacity
// // // // // // // //           style={styles.checkoutButton}
// // // // // // // //           onPress={handlePlaceOrder}
// // // // // // // //           disabled={isProcessing}
// // // // // // // //         >
// // // // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // // // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
// // // // // // // //           </Text>
// // // // // // // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //     </SafeAreaView>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //   },
// // // // // // // //   header: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   headerTitle: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   headerRight: {
// // // // // // // //     width: 40,
// // // // // // // //   },
// // // // // // // //   clearText: {
// // // // // // // //     color: '#dc3545',
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //   },
// // // // // // // //   cartItemsContainer: {
// // // // // // // //     padding: 16,
// // // // // // // //   },
// // // // // // // //   cartItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 16,
// // // // // // // //     padding: 12,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   itemImage: {
// // // // // // // //     width: 60,
// // // // // // // //     height: 60,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   itemInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //     marginLeft: 12,
// // // // // // // //   },
// // // // // // // //   itemName: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   itemPrice: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#fc8019',
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   itemRestaurant: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   quantityContainer: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#fc8019',
// // // // // // // //     borderRadius: 6,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     paddingHorizontal: 4,
// // // // // // // //     marginRight: 8,
// // // // // // // //   },
// // // // // // // //   quantityButton: {
// // // // // // // //     width: 28,
// // // // // // // //     height: 28,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   quantityText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     minWidth: 20,
// // // // // // // //     textAlign: 'center',
// // // // // // // //   },
// // // // // // // //   removeButton: {
// // // // // // // //     padding: 4,
// // // // // // // //   },
// // // // // // // //   summaryContainer: {
// // // // // // // //     padding: 16,
// // // // // // // //     marginHorizontal: 16,
// // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   summaryTitle: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   summaryRow: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     paddingVertical: 6,
// // // // // // // //   },
// // // // // // // //   summaryLabel: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //   },
// // // // // // // //   summaryValue: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   totalRow: {
// // // // // // // //     borderTopWidth: 1,
// // // // // // // //     borderTopColor: '#e9ecef',
// // // // // // // //     paddingTop: 8,
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   totalLabel: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   totalValue: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: '#fc8019',
// // // // // // // //   },
// // // // // // // //   paymentContainer: {
// // // // // // // //     padding: 16,
// // // // // // // //     marginHorizontal: 16,
// // // // // // // //     marginTop: 16,
// // // // // // // //   },
// // // // // // // //   paymentTitle: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   paymentMethod: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     padding: 12,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#e9ecef',
// // // // // // // //     borderRadius: 8,
// // // // // // // //     marginBottom: 8,
// // // // // // // //   },
// // // // // // // //   selectedPaymentMethod: {
// // // // // // // //     borderColor: '#fc8019',
// // // // // // // //     backgroundColor: '#fff8f0',
// // // // // // // //   },
// // // // // // // //   paymentMethodInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //     marginLeft: 12,
// // // // // // // //   },
// // // // // // // //   paymentMethodText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   selectedPaymentMethodText: {
// // // // // // // //     color: '#fc8019',
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   paymentMethodDescription: {
// // // // // // // //     fontSize: 11,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   checkmark: {
// // // // // // // //     marginLeft: 'auto',
// // // // // // // //   },
// // // // // // // //   checkoutContainer: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     borderTopWidth: 1,
// // // // // // // //     borderTopColor: '#f0f0f5',
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //   },
// // // // // // // //   checkoutLeft: {
// // // // // // // //     flexDirection: 'column',
// // // // // // // //   },
// // // // // // // //   checkoutTotal: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: '#fc8019',
// // // // // // // //   },
// // // // // // // //   checkoutItems: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //   },
// // // // // // // //   checkoutButton: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // //     paddingHorizontal: 20,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     borderRadius: 8,
// // // // // // // //   },
// // // // // // // //   checkoutButtonText: {
// // // // // // // //     color: '#ffffff',
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     marginRight: 8,
// // // // // // // //   },
// // // // // // // //   emptyContainer: {
// // // // // // // //     flex: 1,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     padding: 40,
// // // // // // // //   },
// // // // // // // //   emptyText: {
// // // // // // // //     fontSize: 20,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginTop: 16,
// // // // // // // //   },
// // // // // // // //   emptySubText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 8,
// // // // // // // //     textAlign: 'center',
// // // // // // // //   },
// // // // // // // //   shopButton: {
// // // // // // // //     marginTop: 24,
// // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // //     paddingHorizontal: 32,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     borderRadius: 8,
// // // // // // // //   },
// // // // // // // //   shopButtonText: {
// // // // // // // //     color: '#ffffff',
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   footerSpacing: {
// // // // // // // //     height: 80,
// // // // // // // //   },
// // // // // // // //   overlay: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     top: 0,
// // // // // // // //     left: 0,
// // // // // // // //     right: 0,
// // // // // // // //     bottom: 0,
// // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     zIndex: 999,
// // // // // // // //   },
// // // // // // // //   processingContainer: {
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     padding: 30,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     width: '80%',
// // // // // // // //   },
// // // // // // // //   processingText: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginTop: 16,
// // // // // // // //   },
// // // // // // // //   processingSubText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // // export default CartScreen;


// // // // // // // // src/screens/main/CartScreen.tsx
// // // // // // // import React, { useContext, useState } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   ScrollView,
// // // // // // //   TouchableOpacity,
// // // // // // //   StyleSheet,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // //   Image,
// // // // // // //   Alert,
// // // // // // //   ActivityIndicator,
// // // // // // // } from 'react-native';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // // ✅ FIXED: Correct import for Razorpay
// // // // // // // import RazorpayCheckout from 'react-native-razorpay';

// // // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // // import { paymentService } from '../../services/paymentService';

// // // // // // // interface CartScreenProps {
// // // // // // //   navigation: any;
// // // // // // // }

// // // // // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // // // // //   const { 
// // // // // // //     cartItems, 
// // // // // // //     updateQuantity, 
// // // // // // //     removeFromCart, 
// // // // // // //     getTotalPrice, 
// // // // // // //     getTotalItems, 
// // // // // // //     clearCart 
// // // // // // //   } = useContext(CartContext);
  
// // // // // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // // // // // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);

// // // // // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // // // // //     if (newQuantity === 0) {
// // // // // // //       removeFromCart(item.id, item.restaurantId);
// // // // // // //     } else {
// // // // // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleRemoveItem = (item: any) => {
// // // // // // //     Alert.alert(
// // // // // // //       'Remove Item',
// // // // // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // // // // //       [
// // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // // // // // //       ]
// // // // // // //     );
// // // // // // //   };

// // // // // // //   const calculateTotal = () => {
// // // // // // //     const subtotal = getTotalPrice();
// // // // // // //     const tax = Math.round(subtotal * 0.18);
// // // // // // //     const total = subtotal + tax;
// // // // // // //     return { subtotal, tax, total };
// // // // // // //   };

// // // // // // //   // ✅ FIXED: Handle Razorpay Payment
// // // // // // //   const handleRazorpayPayment = async () => {
// // // // // // //     if (cartItems.length === 0) {
// // // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setIsProcessing(true);
// // // // // // //     const { total } = calculateTotal();

// // // // // // //     try {
// // // // // // //       // Send amount in rupees (backend will convert to paise)
// // // // // // //       const orderResponse = await paymentService.createOrder(total, 'INR');
      
// // // // // // //       console.log('📦 Order response:', orderResponse);

// // // // // // //       if (!orderResponse.success) {
// // // // // // //         throw new Error(orderResponse.message || 'Failed to create order');
// // // // // // //       }

// // // // // // //       const { order, key } = orderResponse;
// // // // // // //       console.log('✅ Order created:', order);

// // // // // // //       // ✅ Razorpay options
// // // // // // //       const options = {
// // // // // // //         description: 'QuickBite Order Payment',
// // // // // // //         image: 'https://via.placeholder.com/150',
// // // // // // //         currency: order.currency || 'INR',
// // // // // // //         key: key,
// // // // // // //         amount: order.amount, // Already in paise
// // // // // // //         name: 'QuickBite',
// // // // // // //         order_id: order.id,
// // // // // // //         prefill: {
// // // // // // //           email: 'john@example.com',
// // // // // // //           contact: '9876543210',
// // // // // // //           name: 'John Doe',
// // // // // // //         },
// // // // // // //         theme: {
// // // // // // //           color: '#fc8019',
// // // // // // //         },
// // // // // // //         modal: {
// // // // // // //           ondismiss: function() {
// // // // // // //             setIsProcessing(false);
// // // // // // //             Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // // // //           },
// // // // // // //         },
// // // // // // //       };

// // // // // // //       console.log('💳 Opening Razorpay with options:', options);

// // // // // // //       // ✅ Open Razorpay Checkout
// // // // // // //       RazorpayCheckout.open(options)
// // // // // // //         .then(async (data: any) => {
// // // // // // //           console.log('✅ Payment success:', data);

// // // // // // //           // Verify payment
// // // // // // //           try {
// // // // // // //             const verifyResponse = await paymentService.verifyPayment(
// // // // // // //               data.razorpay_order_id,
// // // // // // //               data.razorpay_payment_id,
// // // // // // //               data.razorpay_signature,
// // // // // // //               'ORD-' + Date.now().toString().slice(-6)
// // // // // // //             );

// // // // // // //             setIsProcessing(false);

// // // // // // //             if (verifyResponse.success) {
// // // // // // //               Alert.alert(
// // // // // // //                 'Payment Successful! 🎉',
// // // // // // //                 `Payment ID: ${data.razorpay_payment_id}\nOrder ID: ${data.razorpay_order_id}`,
// // // // // // //                 [
// // // // // // //                   {
// // // // // // //                     text: 'View Order',
// // // // // // //                     onPress: () => {
// // // // // // //                       navigation.navigate('OrderTracking', {
// // // // // // //                         orderId: data.razorpay_order_id,
// // // // // // //                         total: total,
// // // // // // //                         items: cartItems,
// // // // // // //                         paymentMethod: 'Razorpay',
// // // // // // //                         paymentId: data.razorpay_payment_id,
// // // // // // //                         paymentStatus: 'Paid',
// // // // // // //                       });
// // // // // // //                       clearCart();
// // // // // // //                     },
// // // // // // //                   },
// // // // // // //                 ]
// // // // // // //               );
// // // // // // //             } else {
// // // // // // //               Alert.alert(
// // // // // // //                 'Payment Verification Failed',
// // // // // // //                 verifyResponse.message || 'Please contact support.'
// // // // // // //               );
// // // // // // //             }
// // // // // // //           } catch (verifyError: any) {
// // // // // // //             setIsProcessing(false);
// // // // // // //             console.error('❌ Verification error:', verifyError);
// // // // // // //             Alert.alert('Verification Failed', 'Please contact support.');
// // // // // // //           }
// // // // // // //         })
// // // // // // //         .catch((error: any) => {
// // // // // // //           setIsProcessing(false);
// // // // // // //           console.error('❌ Razorpay error:', error);
// // // // // // //           Alert.alert(
// // // // // // //             'Payment Failed',
// // // // // // //             error?.description || error?.message || 'Something went wrong. Please try again.'
// // // // // // //           );
// // // // // // //         });

// // // // // // //     } catch (error: any) {
// // // // // // //       setIsProcessing(false);
// // // // // // //       console.error('❌ Payment error:', error);
// // // // // // //       Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Handle Cash on Delivery
// // // // // // //   const handleCashOnDelivery = () => {
// // // // // // //     if (cartItems.length === 0) {
// // // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const { total } = calculateTotal();

// // // // // // //     Alert.alert(
// // // // // // //       'Confirm Order',
// // // // // // //       `Total Amount: ₹${total}\nItems: ${getTotalItems()}\nPayment: Cash on Delivery`,
// // // // // // //       [
// // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // //         {
// // // // // // //           text: 'Place Order',
// // // // // // //           style: 'default',
// // // // // // //           onPress: () => {
// // // // // // //             const orderId = 'ORD-' + Date.now().toString().slice(-6);
// // // // // // //             navigation.navigate('OrderTracking', {
// // // // // // //               orderId: orderId,
// // // // // // //               total: total,
// // // // // // //               items: cartItems,
// // // // // // //               paymentMethod: 'Cash on Delivery',
// // // // // // //               paymentStatus: 'Pending',
// // // // // // //             });
// // // // // // //             clearCart();
// // // // // // //           },
// // // // // // //         },
// // // // // // //       ]
// // // // // // //     );
// // // // // // //   };

// // // // // // //   const handlePlaceOrder = () => {
// // // // // // //     if (selectedPaymentMethod === 'Razorpay') {
// // // // // // //       handleRazorpayPayment();
// // // // // // //     } else {
// // // // // // //       handleCashOnDelivery();
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Render cart item
// // // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // // //     <View style={styles.cartItem}>
// // // // // // //       <Image 
// // // // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // // //         style={styles.itemImage} 
// // // // // // //       />
// // // // // // //       <View style={styles.itemInfo}>
// // // // // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // // // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // // // //       </View>
// // // // // // //       <View style={styles.quantityContainer}>
// // // // // // //         <TouchableOpacity
// // // // // // //           style={styles.quantityButton}
// // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // // // // //         >
// // // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // // //         </TouchableOpacity>
// // // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // // //         <TouchableOpacity
// // // // // // //           style={styles.quantityButton}
// // // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // // // // //         >
// // // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // // // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // // // // //       </TouchableOpacity>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   // Render payment method
// // // // // // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // // // // // //     <TouchableOpacity
// // // // // // //       style={[
// // // // // // //         styles.paymentMethod,
// // // // // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // // // // //       ]}
// // // // // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // // // // //     >
// // // // // // //       <Icon 
// // // // // // //         name={icon} 
// // // // // // //         size={24} 
// // // // // // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // // // // // //       />
// // // // // // //       <View style={styles.paymentMethodInfo}>
// // // // // // //         <Text style={[
// // // // // // //           styles.paymentMethodText, 
// // // // // // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // // // // // //         ]}>
// // // // // // //           {method}
// // // // // // //         </Text>
// // // // // // //         {description && (
// // // // // // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // // // // // //         )}
// // // // // // //       </View>
// // // // // // //       {selectedPaymentMethod === method && (
// // // // // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // // // // //       )}
// // // // // // //     </TouchableOpacity>
// // // // // // //   );

// // // // // // //   const { subtotal, tax, total } = calculateTotal();

// // // // // // //   // Empty cart view
// // // // // // //   if (cartItems.length === 0) {
// // // // // // //     return (
// // // // // // //       <SafeAreaView style={styles.container}>
// // // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // // //         <View style={styles.header}>
// // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // //           </TouchableOpacity>
// // // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // //           <View style={styles.headerRight} />
// // // // // // //         </View>
// // // // // // //         <View style={styles.emptyContainer}>
// // // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // // // // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// // // // // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // // // // //           </TouchableOpacity>
// // // // // // //         </View>
// // // // // // //       </SafeAreaView>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // //       <View style={styles.header}>
// // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // //         </TouchableOpacity>
// // // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // // //         <TouchableOpacity onPress={() => {
// // // // // // //           Alert.alert(
// // // // // // //             'Clear Cart',
// // // // // // //             'Are you sure you want to clear your cart?',
// // // // // // //             [
// // // // // // //               { text: 'Cancel', style: 'cancel' },
// // // // // // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // // // // // //             ]
// // // // // // //           );
// // // // // // //         }}>
// // // // // // //           <Text style={styles.clearText}>Clear</Text>
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>

// // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // //         {/* Cart Items */}
// // // // // // //         <View style={styles.cartItemsContainer}>
// // // // // // //           {cartItems.map((item, index) => (
// // // // // // //             <View key={index}>
// // // // // // //               {renderCartItem({ item })}
// // // // // // //             </View>
// // // // // // //           ))}
// // // // // // //         </View>

// // // // // // //         {/* Order Summary */}
// // // // // // //         <View style={styles.summaryContainer}>
// // // // // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // // // // //           <View style={styles.summaryRow}>
// // // // // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // // // // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // // // // // //           </View>
// // // // // // //           <View style={styles.summaryRow}>
// // // // // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // // // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // // // // //           </View>
// // // // // // //           <View style={styles.summaryRow}>
// // // // // // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // // // // // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // // // // // //           </View>
// // // // // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // // // // //             <Text style={styles.totalLabel}>Total</Text>
// // // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // // //           </View>
// // // // // // //         </View>

// // // // // // //         {/* Payment Methods */}
// // // // // // //         <View style={styles.paymentContainer}>
// // // // // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // // // // //           <PaymentMethod 
// // // // // // //             method="Razorpay" 
// // // // // // //             icon="card-outline" 
// // // // // // //             description="Credit/Debit Card, UPI, Net Banking" 
// // // // // // //           />
// // // // // // //           <PaymentMethod 
// // // // // // //             method="Cash on Delivery" 
// // // // // // //             icon="cash-outline" 
// // // // // // //             description="Pay when you receive" 
// // // // // // //           />
// // // // // // //         </View>

// // // // // // //         <View style={styles.footerSpacing} />
// // // // // // //       </ScrollView>

// // // // // // //       {/* Processing Overlay */}
// // // // // // //       {isProcessing && (
// // // // // // //         <View style={styles.overlay}>
// // // // // // //           <View style={styles.processingContainer}>
// // // // // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // // // // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // // // // // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       )}

// // // // // // //       {/* Checkout Button */}
// // // // // // //       <View style={styles.checkoutContainer}>
// // // // // // //         <View style={styles.checkoutLeft}>
// // // // // // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // // // // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // // // // //         </View>
// // // // // // //         <TouchableOpacity
// // // // // // //           style={styles.checkoutButton}
// // // // // // //           onPress={handlePlaceOrder}
// // // // // // //           disabled={isProcessing}
// // // // // // //         >
// // // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
// // // // // // //           </Text>
// // // // // // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //   },
// // // // // // //   header: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   headerTitle: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   headerRight: {
// // // // // // //     width: 40,
// // // // // // //   },
// // // // // // //   clearText: {
// // // // // // //     color: '#dc3545',
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   cartItemsContainer: {
// // // // // // //     padding: 16,
// // // // // // //   },
// // // // // // //   cartItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 16,
// // // // // // //     padding: 12,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderRadius: 12,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   itemImage: {
// // // // // // //     width: 60,
// // // // // // //     height: 60,
// // // // // // //     borderRadius: 8,
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   itemInfo: {
// // // // // // //     flex: 1,
// // // // // // //     marginLeft: 12,
// // // // // // //   },
// // // // // // //   itemName: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   itemPrice: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#fc8019',
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   itemRestaurant: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   quantityContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#fc8019',
// // // // // // //     borderRadius: 6,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     paddingHorizontal: 4,
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   quantityButton: {
// // // // // // //     width: 28,
// // // // // // //     height: 28,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   quantityText: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     minWidth: 20,
// // // // // // //     textAlign: 'center',
// // // // // // //   },
// // // // // // //   removeButton: {
// // // // // // //     padding: 4,
// // // // // // //   },
// // // // // // //   summaryContainer: {
// // // // // // //     padding: 16,
// // // // // // //     marginHorizontal: 16,
// // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // //     borderRadius: 12,
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   summaryTitle: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   summaryRow: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingVertical: 6,
// // // // // // //   },
// // // // // // //   summaryLabel: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //   },
// // // // // // //   summaryValue: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   totalRow: {
// // // // // // //     borderTopWidth: 1,
// // // // // // //     borderTopColor: '#e9ecef',
// // // // // // //     paddingTop: 8,
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   totalLabel: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   totalValue: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#fc8019',
// // // // // // //   },
// // // // // // //   paymentContainer: {
// // // // // // //     padding: 16,
// // // // // // //     marginHorizontal: 16,
// // // // // // //     marginTop: 16,
// // // // // // //   },
// // // // // // //   paymentTitle: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   paymentMethod: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     padding: 12,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#e9ecef',
// // // // // // //     borderRadius: 8,
// // // // // // //     marginBottom: 8,
// // // // // // //   },
// // // // // // //   selectedPaymentMethod: {
// // // // // // //     borderColor: '#fc8019',
// // // // // // //     backgroundColor: '#fff8f0',
// // // // // // //   },
// // // // // // //   paymentMethodInfo: {
// // // // // // //     flex: 1,
// // // // // // //     marginLeft: 12,
// // // // // // //   },
// // // // // // //   paymentMethodText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   selectedPaymentMethodText: {
// // // // // // //     color: '#fc8019',
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   paymentMethodDescription: {
// // // // // // //     fontSize: 11,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   checkmark: {
// // // // // // //     marginLeft: 'auto',
// // // // // // //   },
// // // // // // //   checkoutContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderTopWidth: 1,
// // // // // // //     borderTopColor: '#f0f0f5',
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //   },
// // // // // // //   checkoutLeft: {
// // // // // // //     flexDirection: 'column',
// // // // // // //   },
// // // // // // //   checkoutTotal: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#fc8019',
// // // // // // //   },
// // // // // // //   checkoutItems: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //   },
// // // // // // //   checkoutButton: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#fc8019',
// // // // // // //     paddingHorizontal: 20,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderRadius: 8,
// // // // // // //   },
// // // // // // //   checkoutButtonText: {
// // // // // // //     color: '#ffffff',
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   emptyContainer: {
// // // // // // //     flex: 1,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     padding: 40,
// // // // // // //   },
// // // // // // //   emptyText: {
// // // // // // //     fontSize: 20,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginTop: 16,
// // // // // // //   },
// // // // // // //   emptySubText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 8,
// // // // // // //     textAlign: 'center',
// // // // // // //   },
// // // // // // //   shopButton: {
// // // // // // //     marginTop: 24,
// // // // // // //     backgroundColor: '#fc8019',
// // // // // // //     paddingHorizontal: 32,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderRadius: 8,
// // // // // // //   },
// // // // // // //   shopButtonText: {
// // // // // // //     color: '#ffffff',
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   footerSpacing: {
// // // // // // //     height: 80,
// // // // // // //   },
// // // // // // //   overlay: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 0,
// // // // // // //     left: 0,
// // // // // // //     right: 0,
// // // // // // //     bottom: 0,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     zIndex: 999,
// // // // // // //   },
// // // // // // //   processingContainer: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderRadius: 12,
// // // // // // //     padding: 30,
// // // // // // //     alignItems: 'center',
// // // // // // //     width: '80%',
// // // // // // //   },
// // // // // // //   processingText: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginTop: 16,
// // // // // // //   },
// // // // // // //   processingSubText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // // });

// // // // // // // export default CartScreen;

// // // // // // import React, { useContext, useState } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   StyleSheet,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   Image,
// // // // // //   Alert,
// // // // // //   ActivityIndicator,
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // ✅ FIXED: Using require to avoid declaration file error
// // // // // // import RazorpayCheckout from 'react-native-razorpay';

// // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // import { paymentService } from '../../services/paymentService';

// // // // // // interface CartScreenProps {
// // // // // //   navigation: any;
// // // // // // }

// // // // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // // // //   const { 
// // // // // //     cartItems, 
// // // // // //     updateQuantity, 
// // // // // //     removeFromCart, 
// // // // // //     getTotalPrice, 
// // // // // //     getTotalItems, 
// // // // // //     clearCart 
// // // // // //   } = useContext(CartContext);
  
// // // // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // // // // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);

// // // // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // // // //     if (newQuantity === 0) {
// // // // // //       removeFromCart(item.id, item.restaurantId);
// // // // // //     } else {
// // // // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleRemoveItem = (item: any) => {
// // // // // //     Alert.alert(
// // // // // //       'Remove Item',
// // // // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // // // //       [
// // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // // // // //       ]
// // // // // //     );
// // // // // //   };

// // // // // //   const calculateTotal = () => {
// // // // // //     const subtotal = getTotalPrice();
// // // // // //     const tax = Math.round(subtotal * 0.18);
// // // // // //     const total = subtotal + tax;
// // // // // //     return { subtotal, tax, total };
// // // // // //   };

// // // // // //   // Handle Razorpay Payment
// // // // // //   // const handleRazorpayPayment = async () => {
// // // // // //   //   if (cartItems.length === 0) {
// // // // // //   //     Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // //   //     return;
// // // // // //   //   }

// // // // // //   //   setIsProcessing(true);
// // // // // //   //   const { total } = calculateTotal();

// // // // // //   //   try {
// // // // // //   //     // Send amount in rupees (backend will convert to paise)
// // // // // //   //     const orderResponse = await paymentService.createOrder(total, 'INR');
      
// // // // // //   //     console.log('📦 Order response:', orderResponse);

// // // // // //   //     if (!orderResponse.success) {
// // // // // //   //       throw new Error(orderResponse.message || 'Failed to create order');
// // // // // //   //     }

// // // // // //   //     const { order, key } = orderResponse;
// // // // // //   //     console.log('✅ Order created:', order);

// // // // // //   //     // Razorpay options
// // // // // //   //     const options = {
// // // // // //   //       description: 'QuickBite Order Payment',
// // // // // //   //       image: 'https://via.placeholder.com/150',
// // // // // //   //       currency: order.currency || 'INR',
// // // // // //   //       key: key,
// // // // // //   //       amount: order.amount, // Already in paise
// // // // // //   //       name: 'QuickBite',
// // // // // //   //       order_id: order.id,
// // // // // //   //       prefill: {
// // // // // //   //         email: 'john@example.com',
// // // // // //   //         contact: '9876543210',
// // // // // //   //         name: 'John Doe',
// // // // // //   //       },
// // // // // //   //       theme: {
// // // // // //   //         color: '#fc8019',
// // // // // //   //       },
// // // // // //   //       modal: {
// // // // // //   //         ondismiss: function() {
// // // // // //   //           setIsProcessing(false);
// // // // // //   //           Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // // //   //         },
// // // // // //   //       },
// // // // // //   //     };

// // // // // //   //     console.log('💳 Opening Razorpay with options:', options);

// // // // // //   //     // Open Razorpay Checkout
// // // // // //   //     RazorpayCheckout.open(options)
// // // // // //   //       .then(async (data: any) => {
// // // // // //   //         console.log('✅ Payment success:', data);

// // // // // //   //         // Verify payment
// // // // // //   //         try {
// // // // // //   //           const verifyResponse = await paymentService.verifyPayment(
// // // // // //   //             data.razorpay_order_id,
// // // // // //   //             data.razorpay_payment_id,
// // // // // //   //             data.razorpay_signature,
// // // // // //   //             'ORD-' + Date.now().toString().slice(-6)
// // // // // //   //           );

// // // // // //   //           setIsProcessing(false);

// // // // // //   //           if (verifyResponse.success) {
// // // // // //   //             Alert.alert(
// // // // // //   //               'Payment Successful! 🎉',
// // // // // //   //               `Payment ID: ${data.razorpay_payment_id}\nOrder ID: ${data.razorpay_order_id}`,
// // // // // //   //               [
// // // // // //   //                 {
// // // // // //   //                   text: 'View Order',
// // // // // //   //                   onPress: () => {
// // // // // //   //                     navigation.navigate('OrderTracking', {
// // // // // //   //                       orderId: data.razorpay_order_id,
// // // // // //   //                       total: total,
// // // // // //   //                       items: cartItems,
// // // // // //   //                       paymentMethod: 'Razorpay',
// // // // // //   //                       paymentId: data.razorpay_payment_id,
// // // // // //   //                       paymentStatus: 'Paid',
// // // // // //   //                     });
// // // // // //   //                     clearCart();
// // // // // //   //                   },
// // // // // //   //                 },
// // // // // //   //               ]
// // // // // //   //             );
// // // // // //   //           } else {
// // // // // //   //             Alert.alert(
// // // // // //   //               'Payment Verification Failed',
// // // // // //   //               verifyResponse.message || 'Please contact support.'
// // // // // //   //             );
// // // // // //   //           }
// // // // // //   //         } catch (verifyError: any) {
// // // // // //   //           setIsProcessing(false);
// // // // // //   //           console.error('❌ Verification error:', verifyError);
// // // // // //   //           Alert.alert('Verification Failed', 'Please contact support.');
// // // // // //   //         }
// // // // // //   //       })
// // // // // //   //       .catch((error: any) => {
// // // // // //   //         setIsProcessing(false);
// // // // // //   //         console.error('❌ Razorpay error:', error);
// // // // // //   //         Alert.alert(
// // // // // //   //           'Payment Failed',
// // // // // //   //           error?.description || error?.message || 'Something went wrong. Please try again.'
// // // // // //   //         );
// // // // // //   //       });

// // // // // //   //   } catch (error: any) {
// // // // // //   //     setIsProcessing(false);
// // // // // //   //     console.error('❌ Payment error:', error);
// // // // // //   //     Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // // //   //   }
// // // // // //   // };
// // // // // // const handleRazorpayPayment = async () => {
// // // // // //   if (cartItems.length === 0) {
// // // // // //     Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // //     return;
// // // // // //   }

// // // // // //   setIsProcessing(true);
// // // // // //   const { total } = calculateTotal();

// // // // // //   try {
// // // // // //     // Send amount in rupees (backend will convert to paise)
// // // // // //     const orderResponse = await paymentService.createOrder(total, 'INR');
    
// // // // // //     console.log('📦 Order response:', orderResponse);

// // // // // //     if (!orderResponse.success) {
// // // // // //       throw new Error(orderResponse.message || 'Failed to create order');
// // // // // //     }

// // // // // //     const { order, key } = orderResponse;
// // // // // //     console.log('✅ Order created:', order);

// // // // // //     // Razorpay options - Updated format
// // // // // //     const options = {
// // // // // //       description: 'QuickBite Order Payment',
// // // // // //       image: 'https://your-logo-url.com/logo.png', // Use your actual logo
// // // // // //       currency: order.currency || 'INR',
// // // // // //       key: key,
// // // // // //       amount: order.amount.toString(), // Convert to string
// // // // // //       name: 'QuickBite',
// // // // // //       order_id: order.id,
// // // // // //       prefill: {
// // // // // //         email: 'john@example.com',
// // // // // //         contact: '9876543210',
// // // // // //         name: 'John Doe',
// // // // // //       },
// // // // // //       theme: {
// // // // // //         color: '#fc8019',
// // // // // //       },
// // // // // //       modal: {
// // // // // //         ondismiss: function() {
// // // // // //           setIsProcessing(false);
// // // // // //           Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // // //         },
// // // // // //       },
// // // // // //       // Add these for better UX
// // // // // //       timeout: 300, // 5 minutes timeout
// // // // // //       retry: {
// // // // // //         enabled: true,
// // // // // //         max_count: 3,
// // // // // //       },
// // // // // //     };

// // // // // //     console.log('💳 Opening Razorpay with options:', options);

// // // // // //     // Open Razorpay Checkout
// // // // // //     RazorpayCheckout.open(options)
// // // // // //       .then(async (data: any) => {
// // // // // //         console.log('✅ Payment success:', data);

// // // // // //         // Verify payment
// // // // // //         try {
// // // // // //           const verifyResponse = await paymentService.verifyPayment(
// // // // // //             data.razorpay_order_id,
// // // // // //             data.razorpay_payment_id,
// // // // // //             data.razorpay_signature,
// // // // // //             'ORD-' + Date.now().toString().slice(-6)
// // // // // //           );

// // // // // //           setIsProcessing(false);

// // // // // //           if (verifyResponse.success) {
// // // // // //             Alert.alert(
// // // // // //               'Payment Successful! 🎉',
// // // // // //               `Payment ID: ${data.razorpay_payment_id}\nOrder ID: ${data.razorpay_order_id}`,
// // // // // //               [
// // // // // //                 {
// // // // // //                   text: 'View Order',
// // // // // //                   onPress: () => {
// // // // // //                     navigation.navigate('OrderTracking', {
// // // // // //                       orderId: data.razorpay_order_id,
// // // // // //                       total: total,
// // // // // //                       items: cartItems,
// // // // // //                       paymentMethod: 'Razorpay',
// // // // // //                       paymentId: data.razorpay_payment_id,
// // // // // //                       paymentStatus: 'Paid',
// // // // // //                     });
// // // // // //                     clearCart();
// // // // // //                   },
// // // // // //                 },
// // // // // //               ]
// // // // // //             );
// // // // // //           } else {
// // // // // //             Alert.alert(
// // // // // //               'Payment Verification Failed',
// // // // // //               verifyResponse.message || 'Please contact support.'
// // // // // //             );
// // // // // //           }
// // // // // //         } catch (verifyError: any) {
// // // // // //           setIsProcessing(false);
// // // // // //           console.error('❌ Verification error:', verifyError);
// // // // // //           Alert.alert('Verification Failed', 'Please contact support.');
// // // // // //         }
// // // // // //       })
// // // // // //       .catch((error: any) => {
// // // // // //         setIsProcessing(false);
// // // // // //         console.error('❌ Razorpay error:', error);
        
// // // // // //         // Handle specific error types
// // // // // //         let errorMessage = 'Something went wrong. Please try again.';
// // // // // //         if (error.code === 'PAYMENT_FAILED') {
// // // // // //           errorMessage = 'Payment failed. Please try again with a different payment method.';
// // // // // //         } else if (error.code === 'NETWORK_ERROR') {
// // // // // //           errorMessage = 'Network error. Please check your internet connection.';
// // // // // //         } else if (error.description) {
// // // // // //           errorMessage = error.description;
// // // // // //         } else if (error.message) {
// // // // // //           errorMessage = error.message;
// // // // // //         }
        
// // // // // //         Alert.alert('Payment Failed', errorMessage);
// // // // // //       });

// // // // // //   } catch (error: any) {
// // // // // //     setIsProcessing(false);
// // // // // //     console.error('❌ Payment error:', error);
// // // // // //     Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // // //   }
// // // // // // };
// // // // // //   // Handle Cash on Delivery
// // // // // //   const handleCashOnDelivery = () => {
// // // // // //     if (cartItems.length === 0) {
// // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // //       return;
// // // // // //     }

// // // // // //     const { total } = calculateTotal();

// // // // // //     Alert.alert(
// // // // // //       'Confirm Order',
// // // // // //       `Total Amount: ₹${total}\nItems: ${getTotalItems()}\nPayment: Cash on Delivery`,
// // // // // //       [
// // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // //         {
// // // // // //           text: 'Place Order',
// // // // // //           style: 'default',
// // // // // //           onPress: () => {
// // // // // //             const orderId = 'ORD-' + Date.now().toString().slice(-6);
// // // // // //             navigation.navigate('OrderTracking', {
// // // // // //               orderId: orderId,
// // // // // //               total: total,
// // // // // //               items: cartItems,
// // // // // //               paymentMethod: 'Cash on Delivery',
// // // // // //               paymentStatus: 'Pending',
// // // // // //             });
// // // // // //             clearCart();
// // // // // //           },
// // // // // //         },
// // // // // //       ]
// // // // // //     );
// // // // // //   };

// // // // // //   const handlePlaceOrder = () => {
// // // // // //     if (selectedPaymentMethod === 'Razorpay') {
// // // // // //       handleRazorpayPayment();
// // // // // //     } else {
// // // // // //       handleCashOnDelivery();
// // // // // //     }
// // // // // //   };

// // // // // //   // Render cart item
// // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // //     <View style={styles.cartItem}>
// // // // // //       <Image 
// // // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // //         style={styles.itemImage} 
// // // // // //       />
// // // // // //       <View style={styles.itemInfo}>
// // // // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // // //       </View>
// // // // // //       <View style={styles.quantityContainer}>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.quantityButton}
// // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // // // //         >
// // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.quantityButton}
// // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // // // //         >
// // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // // // //       </TouchableOpacity>
// // // // // //     </View>
// // // // // //   );

// // // // // //   // Render payment method
// // // // // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={[
// // // // // //         styles.paymentMethod,
// // // // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // // // //       ]}
// // // // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // // // //     >
// // // // // //       <Icon 
// // // // // //         name={icon} 
// // // // // //         size={24} 
// // // // // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // // // // //       />
// // // // // //       <View style={styles.paymentMethodInfo}>
// // // // // //         <Text style={[
// // // // // //           styles.paymentMethodText, 
// // // // // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // // // // //         ]}>
// // // // // //           {method}
// // // // // //         </Text>
// // // // // //         {description && (
// // // // // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // // // // //         )}
// // // // // //       </View>
// // // // // //       {selectedPaymentMethod === method && (
// // // // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // // // //       )}
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   const { subtotal, tax, total } = calculateTotal();

// // // // // //   // Empty cart view
// // // // // //   if (cartItems.length === 0) {
// // // // // //     return (
// // // // // //       <SafeAreaView style={styles.container}>
// // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // //         <View style={styles.header}>
// // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // //           </TouchableOpacity>
// // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // //           <View style={styles.headerRight} />
// // // // // //         </View>
// // // // // //         <View style={styles.emptyContainer}>
// // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // // // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// // // // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       </SafeAreaView>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // //       <View style={styles.header}>
// // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // //         <TouchableOpacity onPress={() => {
// // // // // //           Alert.alert(
// // // // // //             'Clear Cart',
// // // // // //             'Are you sure you want to clear your cart?',
// // // // // //             [
// // // // // //               { text: 'Cancel', style: 'cancel' },
// // // // // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // // // // //             ]
// // // // // //           );
// // // // // //         }}>
// // // // // //           <Text style={styles.clearText}>Clear</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // //         {/* Cart Items */}
// // // // // //         <View style={styles.cartItemsContainer}>
// // // // // //           {cartItems.map((item, index) => (
// // // // // //             <View key={index}>
// // // // // //               {renderCartItem({ item })}
// // // // // //             </View>
// // // // // //           ))}
// // // // // //         </View>

// // // // // //         {/* Order Summary */}
// // // // // //         <View style={styles.summaryContainer}>
// // // // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // // // //           <View style={styles.summaryRow}>
// // // // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // // // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // // // // //           </View>
// // // // // //           <View style={styles.summaryRow}>
// // // // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // // // //           </View>
// // // // // //           <View style={styles.summaryRow}>
// // // // // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // // // // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // // // // //           </View>
// // // // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // // // //             <Text style={styles.totalLabel}>Total</Text>
// // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* Payment Methods */}
// // // // // //         <View style={styles.paymentContainer}>
// // // // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // // // //           <PaymentMethod 
// // // // // //             method="Razorpay" 
// // // // // //             icon="card-outline" 
// // // // // //             description="Credit/Debit Card, UPI, Net Banking" 
// // // // // //           />
// // // // // //           <PaymentMethod 
// // // // // //             method="Cash on Delivery" 
// // // // // //             icon="cash-outline" 
// // // // // //             description="Pay when you receive" 
// // // // // //           />
// // // // // //         </View>

// // // // // //         <View style={styles.footerSpacing} />
// // // // // //       </ScrollView>

// // // // // //       {/* Processing Overlay */}
// // // // // //       {isProcessing && (
// // // // // //         <View style={styles.overlay}>
// // // // // //           <View style={styles.processingContainer}>
// // // // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // // // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // // // // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {/* Checkout Button */}
// // // // // //       <View style={styles.checkoutContainer}>
// // // // // //         <View style={styles.checkoutLeft}>
// // // // // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // // // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // // // //         </View>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.checkoutButton}
// // // // // //           onPress={handlePlaceOrder}
// // // // // //           disabled={isProcessing}
// // // // // //         >
// // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
// // // // // //           </Text>
// // // // // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   headerTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   headerRight: {
// // // // // //     width: 40,
// // // // // //   },
// // // // // //   clearText: {
// // // // // //     color: '#dc3545',
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   cartItemsContainer: {
// // // // // //     padding: 16,
// // // // // //   },
// // // // // //   cartItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     padding: 12,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 12,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#f0f0f5',
// // // // // //   },
// // // // // //   itemImage: {
// // // // // //     width: 60,
// // // // // //     height: 60,
// // // // // //     borderRadius: 8,
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //   },
// // // // // //   itemInfo: {
// // // // // //     flex: 1,
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   itemName: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   itemPrice: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#fc8019',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   itemRestaurant: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   quantityContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#fc8019',
// // // // // //     borderRadius: 6,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     paddingHorizontal: 4,
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   quantityButton: {
// // // // // //     width: 28,
// // // // // //     height: 28,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   quantityText: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     minWidth: 20,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   removeButton: {
// // // // // //     padding: 4,
// // // // // //   },
// // // // // //   summaryContainer: {
// // // // // //     padding: 16,
// // // // // //     marginHorizontal: 16,
// // // // // //     backgroundColor: '#f8f9fa',
// // // // // //     borderRadius: 12,
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   summaryTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   summaryRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingVertical: 6,
// // // // // //   },
// // // // // //   summaryLabel: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   summaryValue: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   totalRow: {
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: '#e9ecef',
// // // // // //     paddingTop: 8,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   totalLabel: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   totalValue: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#fc8019',
// // // // // //   },
// // // // // //   paymentContainer: {
// // // // // //     padding: 16,
// // // // // //     marginHorizontal: 16,
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   paymentTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   paymentMethod: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     padding: 12,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#e9ecef',
// // // // // //     borderRadius: 8,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   selectedPaymentMethod: {
// // // // // //     borderColor: '#fc8019',
// // // // // //     backgroundColor: '#fff8f0',
// // // // // //   },
// // // // // //   paymentMethodInfo: {
// // // // // //     flex: 1,
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   paymentMethodText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   selectedPaymentMethodText: {
// // // // // //     color: '#fc8019',
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   paymentMethodDescription: {
// // // // // //     fontSize: 11,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   checkmark: {
// // // // // //     marginLeft: 'auto',
// // // // // //   },
// // // // // //   checkoutContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: '#f0f0f5',
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   checkoutLeft: {
// // // // // //     flexDirection: 'column',
// // // // // //   },
// // // // // //   checkoutTotal: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#fc8019',
// // // // // //   },
// // // // // //   checkoutItems: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   checkoutButton: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 8,
// // // // // //   },
// // // // // //   checkoutButtonText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   emptyContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     padding: 40,
// // // // // //   },
// // // // // //   emptyText: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   emptySubText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 8,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   shopButton: {
// // // // // //     marginTop: 24,
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     paddingHorizontal: 32,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 8,
// // // // // //   },
// // // // // //   shopButtonText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   footerSpacing: {
// // // // // //     height: 80,
// // // // // //   },
// // // // // //   overlay: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     bottom: 0,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     zIndex: 999,
// // // // // //   },
// // // // // //   processingContainer: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 12,
// // // // // //     padding: 30,
// // // // // //     alignItems: 'center',
// // // // // //     width: '80%',
// // // // // //   },
// // // // // //   processingText: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   processingSubText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // // });

// // // // // // export default CartScreen;


// // // // // // import React, { useContext, useState } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   StyleSheet,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   Image,
// // // // // //   Alert,
// // // // // //   ActivityIndicator,
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // ✅ Fixed import for react-native-razorpay
// // // // // // import RazorpayCheckout from 'react-native-razorpay';

// // // // // // import { CartContext } from '../../context/CartContext';
// // // // // // import { paymentService } from '../../services/paymentService';

// // // // // // interface CartScreenProps {
// // // // // //   navigation: any;
// // // // // // }

// // // // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // // // //   const { 
// // // // // //     cartItems, 
// // // // // //     updateQuantity, 
// // // // // //     removeFromCart, 
// // // // // //     getTotalPrice, 
// // // // // //     getTotalItems, 
// // // // // //     clearCart 
// // // // // //   } = useContext(CartContext);
  
// // // // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // // // // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);

// // // // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // // // //     if (newQuantity === 0) {
// // // // // //       removeFromCart(item.id, item.restaurantId);
// // // // // //     } else {
// // // // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleRemoveItem = (item: any) => {
// // // // // //     Alert.alert(
// // // // // //       'Remove Item',
// // // // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // // // //       [
// // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // // // // //       ]
// // // // // //     );
// // // // // //   };

// // // // // //   const calculateTotal = () => {
// // // // // //     const subtotal = getTotalPrice();
// // // // // //     const tax = Math.round(subtotal * 0.18);
// // // // // //     const total = subtotal + tax;
// // // // // //     return { subtotal, tax, total };
// // // // // //   };

// // // // // //   // ✅ FIXED: Handle Razorpay Payment with proper types
// // // // // //   const handleRazorpayPayment = async () => {
// // // // // //     if (cartItems.length === 0) {
// // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // //       return;
// // // // // //     }

// // // // // //     setIsProcessing(true);
// // // // // //     const { total } = calculateTotal();

// // // // // //     try {
// // // // // //       // Send amount in rupees (backend will convert to paise)
// // // // // //       const orderResponse = await paymentService.createOrder(total, 'INR');
      
// // // // // //       console.log('📦 Order response:', orderResponse);

// // // // // //       if (!orderResponse.success) {
// // // // // //         throw new Error(orderResponse.message || 'Failed to create order');
// // // // // //       }

// // // // // //       const { order, key } = orderResponse;
// // // // // //       console.log('✅ Order created:', order);

// // // // // //       // ✅ FIXED: Ensure amount is a number, not string
// // // // // //       const amount = typeof order.amount === 'string' 
// // // // // //         ? parseInt(order.amount, 10) 
// // // // // //         : order.amount;

// // // // // //       // ✅ FIXED: Razorpay options with correct types
// // // // // //       const options = {
// // // // // //         description: 'QuickBite Order Payment',
// // // // // //         image: 'https://your-logo-url.com/logo.png',
// // // // // //         currency: order.currency || 'INR',
// // // // // //         key: key,
// // // // // //         amount: amount, // ✅ Now it's definitely a number
// // // // // //         name: 'QuickBite',
// // // // // //         order_id: order.id,
// // // // // //         prefill: {
// // // // // //           email: 'john@example.com',
// // // // // //           contact: '9876543210',
// // // // // //           name: 'John Doe',
// // // // // //         },
// // // // // //         theme: {
// // // // // //           color: '#fc8019',
// // // // // //         },
// // // // // //         modal: {
// // // // // //           ondismiss: function() {
// // // // // //             setIsProcessing(false);
// // // // // //             Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // // //           },
// // // // // //         },
// // // // // //       };

// // // // // //       console.log('💳 Opening Razorpay with options:', options);

// // // // // //       // ✅ Check if RazorpayCheckout is properly initialized
// // // // // //       if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
// // // // // //         console.error('❌ RazorpayCheckout is not properly initialized:', RazorpayCheckout);
// // // // // //         throw new Error('Razorpay SDK not initialized properly');
// // // // // //       }

// // // // // //       // Open Razorpay Checkout
// // // // // //       RazorpayCheckout.open(options)
// // // // // //         .then(async (data: any) => {
// // // // // //           console.log('✅ Payment success:', data);

// // // // // //           // Verify payment
// // // // // //           try {
// // // // // //             const verifyResponse = await paymentService.verifyPayment(
// // // // // //               data.razorpay_order_id,
// // // // // //               data.razorpay_payment_id,
// // // // // //               data.razorpay_signature,
// // // // // //               'ORD-' + Date.now().toString().slice(-6)
// // // // // //             );

// // // // // //             setIsProcessing(false);

// // // // // //             if (verifyResponse.success) {
// // // // // //               Alert.alert(
// // // // // //                 'Payment Successful! 🎉',
// // // // // //                 `Payment ID: ${data.razorpay_payment_id}\nOrder ID: ${data.razorpay_order_id}`,
// // // // // //                 [
// // // // // //                   {
// // // // // //                     text: 'View Order',
// // // // // //                     onPress: () => {
// // // // // //                       navigation.navigate('OrderTracking', {
// // // // // //                         orderId: data.razorpay_order_id,
// // // // // //                         total: total,
// // // // // //                         items: cartItems,
// // // // // //                         paymentMethod: 'Razorpay',
// // // // // //                         paymentId: data.razorpay_payment_id,
// // // // // //                         paymentStatus: 'Paid',
// // // // // //                       });
// // // // // //                       clearCart();
// // // // // //                     },
// // // // // //                   },
// // // // // //                 ]
// // // // // //               );
// // // // // //             } else {
// // // // // //               Alert.alert(
// // // // // //                 'Payment Verification Failed',
// // // // // //                 verifyResponse.message || 'Please contact support.'
// // // // // //               );
// // // // // //             }
// // // // // //           } catch (verifyError: any) {
// // // // // //             setIsProcessing(false);
// // // // // //             console.error('❌ Verification error:', verifyError);
// // // // // //             Alert.alert('Verification Failed', 'Please contact support.');
// // // // // //           }
// // // // // //         })
// // // // // //         .catch((error: any) => {
// // // // // //           setIsProcessing(false);
// // // // // //           console.error('❌ Razorpay error:', error);
          
// // // // // //           // Handle specific error types
// // // // // //           let errorMessage = 'Something went wrong. Please try again.';
// // // // // //           if (error.code === 'PAYMENT_FAILED') {
// // // // // //             errorMessage = 'Payment failed. Please try again with a different payment method.';
// // // // // //           } else if (error.code === 'NETWORK_ERROR') {
// // // // // //             errorMessage = 'Network error. Please check your internet connection.';
// // // // // //           } else if (error.description) {
// // // // // //             errorMessage = error.description;
// // // // // //           } else if (error.message) {
// // // // // //             errorMessage = error.message;
// // // // // //           }
          
// // // // // //           Alert.alert('Payment Failed', errorMessage);
// // // // // //         });

// // // // // //     } catch (error: any) {
// // // // // //       setIsProcessing(false);
// // // // // //       console.error('❌ Payment error:', error);
// // // // // //       Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // // //     }
// // // // // //   };

// // // // // //   // Handle Cash on Delivery
// // // // // //   const handleCashOnDelivery = () => {
// // // // // //     if (cartItems.length === 0) {
// // // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // // //       return;
// // // // // //     }

// // // // // //     const { total } = calculateTotal();

// // // // // //     Alert.alert(
// // // // // //       'Confirm Order',
// // // // // //       `Total Amount: ₹${total}\nItems: ${getTotalItems()}\nPayment: Cash on Delivery`,
// // // // // //       [
// // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // //         {
// // // // // //           text: 'Place Order',
// // // // // //           style: 'default',
// // // // // //           onPress: () => {
// // // // // //             const orderId = 'ORD-' + Date.now().toString().slice(-6);
// // // // // //             navigation.navigate('OrderTracking', {
// // // // // //               orderId: orderId,
// // // // // //               total: total,
// // // // // //               items: cartItems,
// // // // // //               paymentMethod: 'Cash on Delivery',
// // // // // //               paymentStatus: 'Pending',
// // // // // //             });
// // // // // //             clearCart();
// // // // // //           },
// // // // // //         },
// // // // // //       ]
// // // // // //     );
// // // // // //   };

// // // // // //   const handlePlaceOrder = () => {
// // // // // //     if (selectedPaymentMethod === 'Razorpay') {
// // // // // //       handleRazorpayPayment();
// // // // // //     } else {
// // // // // //       handleCashOnDelivery();
// // // // // //     }
// // // // // //   };

// // // // // //   // Render cart item
// // // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // // //     <View style={styles.cartItem}>
// // // // // //       <Image 
// // // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // // //         style={styles.itemImage} 
// // // // // //       />
// // // // // //       <View style={styles.itemInfo}>
// // // // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // // //       </View>
// // // // // //       <View style={styles.quantityContainer}>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.quantityButton}
// // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // // // //         >
// // // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.quantityButton}
// // // // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // // // //         >
// // // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // // // //       </TouchableOpacity>
// // // // // //     </View>
// // // // // //   );

// // // // // //   // Render payment method
// // // // // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={[
// // // // // //         styles.paymentMethod,
// // // // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // // // //       ]}
// // // // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // // // //     >
// // // // // //       <Icon 
// // // // // //         name={icon} 
// // // // // //         size={24} 
// // // // // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // // // // //       />
// // // // // //       <View style={styles.paymentMethodInfo}>
// // // // // //         <Text style={[
// // // // // //           styles.paymentMethodText, 
// // // // // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // // // // //         ]}>
// // // // // //           {method}
// // // // // //         </Text>
// // // // // //         {description && (
// // // // // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // // // // //         )}
// // // // // //       </View>
// // // // // //       {selectedPaymentMethod === method && (
// // // // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // // // //       )}
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   const { subtotal, tax, total } = calculateTotal();

// // // // // //   // Empty cart view
// // // // // //   if (cartItems.length === 0) {
// // // // // //     return (
// // // // // //       <SafeAreaView style={styles.container}>
// // // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // //         <View style={styles.header}>
// // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // //           </TouchableOpacity>
// // // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // // //           <View style={styles.headerRight} />
// // // // // //         </View>
// // // // // //         <View style={styles.emptyContainer}>
// // // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // // // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// // // // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       </SafeAreaView>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // //       <View style={styles.header}>
// // // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // // //         <TouchableOpacity onPress={() => {
// // // // // //           Alert.alert(
// // // // // //             'Clear Cart',
// // // // // //             'Are you sure you want to clear your cart?',
// // // // // //             [
// // // // // //               { text: 'Cancel', style: 'cancel' },
// // // // // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // // // // //             ]
// // // // // //           );
// // // // // //         }}>
// // // // // //           <Text style={styles.clearText}>Clear</Text>
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // //         {/* Cart Items */}
// // // // // //         <View style={styles.cartItemsContainer}>
// // // // // //           {cartItems.map((item, index) => (
// // // // // //             <View key={index}>
// // // // // //               {renderCartItem({ item })}
// // // // // //             </View>
// // // // // //           ))}
// // // // // //         </View>

// // // // // //         {/* Order Summary */}
// // // // // //         <View style={styles.summaryContainer}>
// // // // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // // // //           <View style={styles.summaryRow}>
// // // // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // // // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // // // // //           </View>
// // // // // //           <View style={styles.summaryRow}>
// // // // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // // // //           </View>
// // // // // //           <View style={styles.summaryRow}>
// // // // // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // // // // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // // // // //           </View>
// // // // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // // // //             <Text style={styles.totalLabel}>Total</Text>
// // // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {/* Payment Methods */}
// // // // // //         <View style={styles.paymentContainer}>
// // // // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // // // //           <PaymentMethod 
// // // // // //             method="Razorpay" 
// // // // // //             icon="card-outline" 
// // // // // //             description="Credit/Debit Card, UPI, Net Banking" 
// // // // // //           />
// // // // // //           <PaymentMethod 
// // // // // //             method="Cash on Delivery" 
// // // // // //             icon="cash-outline" 
// // // // // //             description="Pay when you receive" 
// // // // // //           />
// // // // // //         </View>

// // // // // //         <View style={styles.footerSpacing} />
// // // // // //       </ScrollView>

// // // // // //       {/* Processing Overlay */}
// // // // // //       {isProcessing && (
// // // // // //         <View style={styles.overlay}>
// // // // // //           <View style={styles.processingContainer}>
// // // // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // // // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // // // // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {/* Checkout Button */}
// // // // // //       <View style={styles.checkoutContainer}>
// // // // // //         <View style={styles.checkoutLeft}>
// // // // // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // // // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // // // //         </View>
// // // // // //         <TouchableOpacity
// // // // // //           style={styles.checkoutButton}
// // // // // //           onPress={handlePlaceOrder}
// // // // // //           disabled={isProcessing}
// // // // // //         >
// // // // // //           <Text style={styles.checkoutButtonText}>
// // // // // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
// // // // // //           </Text>
// // // // // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   headerTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   headerRight: {
// // // // // //     width: 40,
// // // // // //   },
// // // // // //   clearText: {
// // // // // //     color: '#dc3545',
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   cartItemsContainer: {
// // // // // //     padding: 16,
// // // // // //   },
// // // // // //   cartItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     padding: 12,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 12,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#f0f0f5',
// // // // // //   },
// // // // // //   itemImage: {
// // // // // //     width: 60,
// // // // // //     height: 60,
// // // // // //     borderRadius: 8,
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //   },
// // // // // //   itemInfo: {
// // // // // //     flex: 1,
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   itemName: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   itemPrice: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#fc8019',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   itemRestaurant: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   quantityContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#fc8019',
// // // // // //     borderRadius: 6,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     paddingHorizontal: 4,
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   quantityButton: {
// // // // // //     width: 28,
// // // // // //     height: 28,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   quantityText: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     minWidth: 20,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   removeButton: {
// // // // // //     padding: 4,
// // // // // //   },
// // // // // //   summaryContainer: {
// // // // // //     padding: 16,
// // // // // //     marginHorizontal: 16,
// // // // // //     backgroundColor: '#f8f9fa',
// // // // // //     borderRadius: 12,
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   summaryTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   summaryRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingVertical: 6,
// // // // // //   },
// // // // // //   summaryLabel: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   summaryValue: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   totalRow: {
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: '#e9ecef',
// // // // // //     paddingTop: 8,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   totalLabel: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   totalValue: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#fc8019',
// // // // // //   },
// // // // // //   paymentContainer: {
// // // // // //     padding: 16,
// // // // // //     marginHorizontal: 16,
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   paymentTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   paymentMethod: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     padding: 12,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#e9ecef',
// // // // // //     borderRadius: 8,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   selectedPaymentMethod: {
// // // // // //     borderColor: '#fc8019',
// // // // // //     backgroundColor: '#fff8f0',
// // // // // //   },
// // // // // //   paymentMethodInfo: {
// // // // // //     flex: 1,
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   paymentMethodText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   selectedPaymentMethodText: {
// // // // // //     color: '#fc8019',
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   paymentMethodDescription: {
// // // // // //     fontSize: 11,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   checkmark: {
// // // // // //     marginLeft: 'auto',
// // // // // //   },
// // // // // //   checkoutContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: '#f0f0f5',
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   checkoutLeft: {
// // // // // //     flexDirection: 'column',
// // // // // //   },
// // // // // //   checkoutTotal: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#fc8019',
// // // // // //   },
// // // // // //   checkoutItems: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   checkoutButton: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 8,
// // // // // //   },
// // // // // //   checkoutButtonText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   emptyContainer: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     padding: 40,
// // // // // //   },
// // // // // //   emptyText: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   emptySubText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 8,
// // // // // //     textAlign: 'center',
// // // // // //   },
// // // // // //   shopButton: {
// // // // // //     marginTop: 24,
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     paddingHorizontal: 32,
// // // // // //     paddingVertical: 12,
// // // // // //     borderRadius: 8,
// // // // // //   },
// // // // // //   shopButtonText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   footerSpacing: {
// // // // // //     height: 80,
// // // // // //   },
// // // // // //   overlay: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     bottom: 0,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     zIndex: 999,
// // // // // //   },
// // // // // //   processingContainer: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 12,
// // // // // //     padding: 30,
// // // // // //     alignItems: 'center',
// // // // // //     width: '80%',
// // // // // //   },
// // // // // //   processingText: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   processingSubText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // // });

// // // // // // export default CartScreen;


// // // // // import React, { useContext, useState, useEffect } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   Image,
// // // // //   Alert,
// // // // //   ActivityIndicator,
// // // // //   Platform,
// // // // // } from 'react-native';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // ✅ Import Razorpay with proper error handling
// // // // // // import RazorpayCheckout from 'react-native-razorpay';
// // // // // let RazorpayCheckout: any = null;
// // // // // if (Platform.OS !== 'web') {
// // // // //   RazorpayCheckout = require('react-native-razorpay').default;
// // // // // }

// // // // // import { CartContext } from '../../context/CartContext';
// // // // // import paymentService from '../../services/paymentService';

// // // // // interface CartScreenProps {
// // // // //   navigation: any;
// // // // // }

// // // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // // //   const { 
// // // // //     cartItems, 
// // // // //     updateQuantity, 
// // // // //     removeFromCart, 
// // // // //     getTotalPrice, 
// // // // //     getTotalItems, 
// // // // //     clearCart 
// // // // //   } = useContext(CartContext);
  
// // // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // // // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);
// // // // //   const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);

// // // // //   // ✅ Check if Razorpay is available
// // // // //   // useEffect(() => {
// // // // //   //   console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
// // // // //   //   console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);
    
// // // // //   //   if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
// // // // //   //     console.warn('⚠️ RazorpayCheckout is not available');
// // // // //   //     setIsRazorpayReady(false);
// // // // //   //   } else {
// // // // //   //     console.log('✅ RazorpayCheckout is ready');
// // // // //   //     setIsRazorpayReady(true);
// // // // //   //   }
// // // // //   // }, []);
// // // // //   // useEffect(() => {
// // // // //   //   console.log('🔍 Platform:', Platform.OS);
// // // // //   //   console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
// // // // //   //   console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);

// // // // //   //   if (Platform.OS === 'web') {
// // // // //   //     console.warn('⚠️ Razorpay native SDK is not supported on web');
// // // // //   //     setIsRazorpayReady(false);
// // // // //   //     return;
// // // // //   //   }

// // // // //   //   if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
// // // // //   //     console.warn('⚠️ RazorpayCheckout is not available');
// // // // //   //     setIsRazorpayReady(false);
// // // // //   //   } else {
// // // // //   //     console.log('✅ RazorpayCheckout is ready');
// // // // //   //     setIsRazorpayReady(true);
// // // // //   //   }
// // // // //   // }, []);

// // // // //   useEffect(() => {
// // // // //     console.log('🔍 Platform:', Platform.OS);

// // // // //     if (Platform.OS === 'web') {
// // // // //       // ✅ Load Razorpay checkout.js script for web
// // // // //       const existingScript = document.getElementById('razorpay-checkout-script');
// // // // //       if (existingScript) {
// // // // //         setIsRazorpayReady(true);
// // // // //         return;
// // // // //       }

// // // // //       const script = document.createElement('script');
// // // // //       script.id = 'razorpay-checkout-script';
// // // // //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// // // // //       script.async = true;
// // // // //       script.onload = () => {
// // // // //         console.log('✅ Razorpay web script loaded');
// // // // //         setIsRazorpayReady(true);
// // // // //       };
// // // // //       script.onerror = () => {
// // // // //         console.error('❌ Failed to load Razorpay web script');
// // // // //         setIsRazorpayReady(false);
// // // // //       };
// // // // //       document.body.appendChild(script);
// // // // //       return;
// // // // //     }

// // // // //     console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
// // // // //     console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);

// // // // //     if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
// // // // //       console.warn('⚠️ RazorpayCheckout is not available');
// // // // //       setIsRazorpayReady(false);
// // // // //     } else {
// // // // //       console.log('✅ RazorpayCheckout is ready');
// // // // //       setIsRazorpayReady(true);
// // // // //     }
// // // // //   }, []);
// // // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // // //     if (newQuantity === 0) {
// // // // //       removeFromCart(item.id, item.restaurantId);
// // // // //     } else {
// // // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // // //     }
// // // // //   };

// // // // //   const handleRemoveItem = (item: any) => {
// // // // //     Alert.alert(
// // // // //       'Remove Item',
// // // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // // //       [
// // // // //         { text: 'Cancel', style: 'cancel' },
// // // // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // // // //       ]
// // // // //     );
// // // // //   };

// // // // //   const calculateTotal = () => {
// // // // //     const subtotal = getTotalPrice();
// // // // //     const tax = Math.round(subtotal * 0.18);
// // // // //     const total = subtotal + tax;
// // // // //     return { subtotal, tax, total };
// // // // //   };

// // // // //   // ✅ Fixed payment handler with better error handling
// // // // //   // const handleRazorpayPayment = async () => {
// // // // //   //   if (cartItems.length === 0) {
// // // // //   //     Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // //   //     return;
// // // // //   //   }

// // // // //   //   // Check if Razorpay is available
// // // // //   //   if (!isRazorpayReady) {
// // // // //   // const handleRazorpayPayment = async () => {
// // // // //   //   if (cartItems.length === 0) {
// // // // //   //     Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // //   //     return;
// // // // //   //   }

// // // // //   //   // Razorpay native SDK does not work on web
// // // // //   //   if (Platform.OS === 'web') {
// // // // //   //     Alert.alert(
// // // // //   //       'Not Supported on Web',
// // // // //   //       'Online payment is only available in the mobile app. Please use Cash on Delivery here, or open this app on your phone/emulator to test Razorpay.',
// // // // //   //       [
// // // // //   //         { text: 'OK' },
// // // // //   //         { text: 'Use Cash on Delivery', onPress: () => setSelectedPaymentMethod('Cash on Delivery') },
// // // // //   //       ]
// // // // //   //     );
// // // // //   //     return;
// // // // //   //   }

// // // // //   //   // Check if Razorpay is available
// // // // //   //   if (!isRazorpayReady) {
// // // // //   //     Alert.alert(
// // // // //   //       'Payment Error',
// // // // //   //       'Razorpay is not available. Please use Cash on Delivery or check your installation.',
// // // // //   //       [
// // // // //   //         { text: 'OK' },
// // // // //   //         { 
// // // // //   //           text: 'Use Cash on Delivery', 
// // // // //   //           onPress: () => setSelectedPaymentMethod('Cash on Delivery') 
// // // // //   //         }
// // // // //   //       ]
// // // // //   //     );
// // // // //   //     return;
// // // // //   //   }

// // // // //   //   setIsProcessing(true);
// // // // //   //   const { total } = calculateTotal();

// // // // //   //   try {
// // // // //   //     // Create order
// // // // //   //     const orderResponse = await paymentService.createOrder(total, 'INR');
      
// // // // //   //     console.log('📦 Order response:', orderResponse);

// // // // //   //     if (!orderResponse.success) {
// // // // //   //       throw new Error(orderResponse.message || 'Failed to create order');
// // // // //   //     }

// // // // //   //     const { order, key } = orderResponse;
      
// // // // //   //     // Ensure amount is a number
// // // // //   //     const amount = typeof order.amount === 'string' 
// // // // //   //       ? parseInt(order.amount, 10) 
// // // // //   //       : order.amount;

// // // // //   //     // ✅ Razorpay options
// // // // //   //     const options = {
// // // // //   //       description: 'QuickBite Order Payment',
// // // // //   //       image: 'https://your-logo-url.com/logo.png',
// // // // //   //       currency: order.currency || 'INR',
// // // // //   //       key: key,
// // // // //   //       amount: amount,
// // // // //   //       name: 'QuickBite',
// // // // //   //       order_id: order.id,
// // // // //   //       prefill: {
// // // // //   //         email: 'customer@example.com',
// // // // //   //         contact: '9876543210',
// // // // //   //         name: 'Customer Name',
// // // // //   //       },
// // // // //   //       theme: {
// // // // //   //         color: '#fc8019',
// // // // //   //       },
// // // // //   //       modal: {
// // // // //   //         ondismiss: function() {
// // // // //   //           setIsProcessing(false);
// // // // //   //           Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // //   //         },
// // // // //   //       },
// // // // //   //     };

// // // // //   //     console.log('💳 Opening Razorpay with options:', options);

// // // // //   //     // ✅ Open Razorpay Checkout
// // // // //   //     RazorpayCheckout.open(options)
// // // // //   //       .then(async (data: any) => {
// // // // //   //         console.log('✅ Payment success:', data);
          
// // // // //   //         // Verify payment
// // // // //   //         try {
// // // // //   //           const verifyResponse = await paymentService.verifyPayment(
// // // // //   //             data.razorpay_order_id,
// // // // //   //             data.razorpay_payment_id,
// // // // //   //             data.razorpay_signature,
// // // // //   //             'ORD-' + Date.now().toString().slice(-6)
// // // // //   //           );

// // // // //   //           setIsProcessing(false);

// // // // //   //           if (verifyResponse.success) {
// // // // //   //             Alert.alert(
// // // // //   //               'Payment Successful! 🎉',
// // // // //   //               `Payment ID: ${data.razorpay_payment_id}`,
// // // // //   //               [
// // // // //   //                 {
// // // // //   //                   text: 'View Order',
// // // // //   //                   onPress: () => {
// // // // //   //                     navigation.navigate('OrderTracking', {
// // // // //   //                       orderId: data.razorpay_order_id,
// // // // //   //                       total: total,
// // // // //   //                       items: cartItems,
// // // // //   //                       paymentMethod: 'Razorpay',
// // // // //   //                       paymentId: data.razorpay_payment_id,
// // // // //   //                       paymentStatus: 'Paid',
// // // // //   //                     });
// // // // //   //                     clearCart();
// // // // //   //                   },
// // // // //   //                 },
// // // // //   //               ]
// // // // //   //             );
// // // // //   //           } else {
// // // // //   //             Alert.alert(
// // // // //   //               'Payment Verification Failed',
// // // // //   //               verifyResponse.message || 'Please contact support.'
// // // // //   //             );
// // // // //   //           }
// // // // //   //         } catch (verifyError: any) {
// // // // //   //           setIsProcessing(false);
// // // // //   //           console.error('❌ Verification error:', verifyError);
// // // // //   //           Alert.alert('Verification Failed', 'Please contact support.');
// // // // //   //         }
// // // // //   //       })
// // // // //   //       .catch((error: any) => {
// // // // //   //         setIsProcessing(false);
// // // // //   //         console.error('❌ Razorpay error:', error);
          
// // // // //   //         let errorMessage = 'Something went wrong. Please try again.';
// // // // //   //         let errorTitle = 'Payment Failed';
          
// // // // //   //         if (error.code === 'PAYMENT_FAILED') {
// // // // //   //           errorMessage = 'Payment failed. Please try again with a different payment method.';
// // // // //   //         } else if (error.code === 'NETWORK_ERROR') {
// // // // //   //           errorMessage = 'Network error. Please check your internet connection.';
// // // // //   //         } else if (error.code === 'CANCELLED') {
// // // // //   //           errorTitle = 'Payment Cancelled';
// // // // //   //           errorMessage = 'You cancelled the payment process.';
// // // // //   //         } else if (error.description) {
// // // // //   //           errorMessage = error.description;
// // // // //   //         } else if (error.message) {
// // // // //   //           errorMessage = error.message;
// // // // //   //         }
          
// // // // //   //         Alert.alert(errorTitle, errorMessage);
// // // // //   //       });

// // // // //   //   } catch (error: any) {
// // // // //   //     setIsProcessing(false);
// // // // //   //     console.error('❌ Payment error:', error);
// // // // //   //     Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // //   //   }
// // // // //   // };


// // // // //   const handleRazorpayPayment = async () => {
// // // // //     if (cartItems.length === 0) {
// // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // //       return;
// // // // //     }

// // // // //     if (!isRazorpayReady) {
// // // // //       Alert.alert(
// // // // //         'Payment Error',
// // // // //         'Razorpay is not ready yet. Please wait a moment and try again, or use Cash on Delivery.',
// // // // //         [
// // // // //           { text: 'OK' },
// // // // //           { text: 'Use Cash on Delivery', onPress: () => setSelectedPaymentMethod('Cash on Delivery') },
// // // // //         ]
// // // // //       );
// // // // //       return;
// // // // //     }

// // // // //     setIsProcessing(true);
// // // // //     const { total } = calculateTotal();

// // // // //     try {
// // // // //       const orderResponse = await paymentService.createOrder(total, 'INR');
// // // // //       console.log('📦 Order response:', orderResponse);

// // // // //       if (!orderResponse.success) {
// // // // //         throw new Error(orderResponse.message || 'Failed to create order');
// // // // //       }

// // // // //       const { order, key } = orderResponse;
// // // // //       const amount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount;

// // // // //       const options: any = {
// // // // //         description: 'QuickBite Order Payment',
// // // // //         image: 'https://your-logo-url.com/logo.png',
// // // // //         currency: order.currency || 'INR',
// // // // //         key: key,
// // // // //         amount: amount,
// // // // //         name: 'QuickBite',
// // // // //         order_id: order.id,
// // // // //         prefill: {
// // // // //           email: 'customer@example.com',
// // // // //           contact: '9876543210',
// // // // //           name: 'Customer Name',
// // // // //         },
// // // // //         theme: { color: '#fc8019' },
// // // // //       };

// // // // //       console.log('💳 Opening Razorpay with options:', options);

// // // // //       const handlePaymentSuccess = async (response: any) => {
// // // // //         try {
// // // // //           const verifyResponse = await paymentService.verifyPayment(
// // // // //             response.razorpay_order_id,
// // // // //             response.razorpay_payment_id,
// // // // //             response.razorpay_signature,
// // // // //             'ORD-' + Date.now().toString().slice(-6)
// // // // //           );

// // // // //           setIsProcessing(false);

// // // // //           if (verifyResponse.success) {
// // // // //             Alert.alert(
// // // // //               'Payment Successful! 🎉',
// // // // //               `Payment ID: ${response.razorpay_payment_id}`,
// // // // //               [
// // // // //                 {
// // // // //                   text: 'View Order',
// // // // //                   onPress: () => {
// // // // //                     navigation.navigate('OrderTracking', {
// // // // //                       orderId: response.razorpay_order_id,
// // // // //                       total: total,
// // // // //                       items: cartItems,
// // // // //                       paymentMethod: 'Razorpay',
// // // // //                       paymentId: response.razorpay_payment_id,
// // // // //                       paymentStatus: 'Paid',
// // // // //                     });
// // // // //                     clearCart();
// // // // //                   },
// // // // //                 },
// // // // //               ]
// // // // //             );
// // // // //           } else {
// // // // //             Alert.alert('Payment Verification Failed', verifyResponse.message || 'Please contact support.');
// // // // //           }
// // // // //         } catch (verifyError: any) {
// // // // //           setIsProcessing(false);
// // // // //           console.error('❌ Verification error:', verifyError);
// // // // //           Alert.alert('Verification Failed', 'Please contact support.');
// // // // //         }
// // // // //       };

// // // // //       if (Platform.OS === 'web') {
// // // // //         const win = window as any;

// // // // //         if (!win.Razorpay) {
// // // // //           setIsProcessing(false);
// // // // //           Alert.alert('Payment Error', 'Razorpay checkout script did not load. Please refresh and try again.');
// // // // //           return;
// // // // //         }

// // // // //         const rzp = new win.Razorpay({
// // // // //           ...options,
// // // // //           handler: handlePaymentSuccess,
// // // // //           modal: {
// // // // //             ondismiss: function () {
// // // // //               setIsProcessing(false);
// // // // //               Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // // //             },
// // // // //           },
// // // // //         });

// // // // //         rzp.on('payment.failed', function (response: any) {
// // // // //           setIsProcessing(false);
// // // // //           console.error('❌ Razorpay payment failed:', response.error);
// // // // //           Alert.alert('Payment Failed', response.error.description || 'Something went wrong. Please try again.');
// // // // //         });

// // // // //         rzp.open();
// // // // //         return;
// // // // //       }

// // // // //       RazorpayCheckout.open(options)
// // // // //         .then(handlePaymentSuccess)
// // // // //         .catch((error: any) => {
// // // // //           setIsProcessing(false);
// // // // //           console.error('❌ Razorpay error:', error);

// // // // //           let errorMessage = 'Something went wrong. Please try again.';
// // // // //           let errorTitle = 'Payment Failed';

// // // // //           if (error.code === 'PAYMENT_FAILED') {
// // // // //             errorMessage = 'Payment failed. Please try again with a different payment method.';
// // // // //           } else if (error.code === 'NETWORK_ERROR') {
// // // // //             errorMessage = 'Network error. Please check your internet connection.';
// // // // //           } else if (error.code === 'CANCELLED') {
// // // // //             errorTitle = 'Payment Cancelled';
// // // // //             errorMessage = 'You cancelled the payment process.';
// // // // //           } else if (error.description) {
// // // // //             errorMessage = error.description;
// // // // //           } else if (error.message) {
// // // // //             errorMessage = error.message;
// // // // //           }

// // // // //           Alert.alert(errorTitle, errorMessage);
// // // // //         });

// // // // //     } catch (error: any) {
// // // // //       setIsProcessing(false);
// // // // //       console.error('❌ Payment error:', error);
// // // // //       Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // // //     }
// // // // //   };
// // // // //   // Handle Cash on Delivery
// // // // //   const handleCashOnDelivery = () => {
// // // // //     if (cartItems.length === 0) {
// // // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // // //       return;
// // // // //     }

// // // // //     const { total } = calculateTotal();

// // // // //     Alert.alert(
// // // // //       'Confirm Order',
// // // // //       `Total Amount: ₹${total}\nItems: ${getTotalItems()}\nPayment: Cash on Delivery`,
// // // // //       [
// // // // //         { text: 'Cancel', style: 'cancel' },
// // // // //         {
// // // // //           text: 'Place Order',
// // // // //           style: 'default',
// // // // //           onPress: () => {
// // // // //             const orderId = 'ORD-' + Date.now().toString().slice(-6);
// // // // //             navigation.navigate('OrderTracking', {
// // // // //               orderId: orderId,
// // // // //               total: total,
// // // // //               items: cartItems,
// // // // //               paymentMethod: 'Cash on Delivery',
// // // // //               paymentStatus: 'Pending',
// // // // //             });
// // // // //             clearCart();
// // // // //           },
// // // // //         },
// // // // //       ]
// // // // //     );
// // // // //   };

// // // // //   const handlePlaceOrder = () => {
// // // // //     if (selectedPaymentMethod === 'Razorpay') {
// // // // //       handleRazorpayPayment();
// // // // //     } else {
// // // // //       handleCashOnDelivery();
// // // // //     }
// // // // //   };

// // // // //   // Render cart item
// // // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // // //     <View style={styles.cartItem}>
// // // // //       {/* <Image 
// // // // //         source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
// // // // //         style={styles.itemImage} 
// // // // //       /> */}
// // // // //       <Image 
// // // // //         source={{ uri: item.image || 'https://placehold.co/60x60' }} 
// // // // //         style={styles.itemImage} 
// // // // //       />
// // // // //       <View style={styles.itemInfo}>
// // // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // // //       </View>
// // // // //       <View style={styles.quantityContainer}>
// // // // //         <TouchableOpacity
// // // // //           style={styles.quantityButton}
// // // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // // //         >
// // // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // // //         <TouchableOpacity
// // // // //           style={styles.quantityButton}
// // // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // // //         >
// // // // //           <Icon name="add" size={16} color="#fc8019" />
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // // //       </TouchableOpacity>
// // // // //     </View>
// // // // //   );

// // // // //   // Render payment method
// // // // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // // // //     <TouchableOpacity
// // // // //       style={[
// // // // //         styles.paymentMethod,
// // // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // // //       ]}
// // // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // // //     >
// // // // //       <Icon 
// // // // //         name={icon} 
// // // // //         size={24} 
// // // // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // // // //       />
// // // // //       <View style={styles.paymentMethodInfo}>
// // // // //         <Text style={[
// // // // //           styles.paymentMethodText, 
// // // // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // // // //         ]}>
// // // // //           {method}
// // // // //         </Text>
// // // // //         {description && (
// // // // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // // // //         )}
// // // // //       </View>
// // // // //       {selectedPaymentMethod === method && (
// // // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // // //       )}
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   const { subtotal, tax, total } = calculateTotal();

// // // // //   // Empty cart view
// // // // //   if (cartItems.length === 0) {
// // // // //     return (
// // // // //       <SafeAreaView style={styles.container}>
// // // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // //         <View style={styles.header}>
// // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // //           </TouchableOpacity>
// // // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // // //           <View style={styles.headerRight} />
// // // // //         </View>
// // // // //         <View style={styles.emptyContainer}>
// // // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// // // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       </SafeAreaView>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // //       <View style={styles.header}>
// // // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // // //         <TouchableOpacity onPress={() => {
// // // // //           Alert.alert(
// // // // //             'Clear Cart',
// // // // //             'Are you sure you want to clear your cart?',
// // // // //             [
// // // // //               { text: 'Cancel', style: 'cancel' },
// // // // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // // // //             ]
// // // // //           );
// // // // //         }}>
// // // // //           <Text style={styles.clearText}>Clear</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         {/* Cart Items */}
// // // // //         <View style={styles.cartItemsContainer}>
// // // // //           {cartItems.map((item, index) => (
// // // // //             <View key={index}>
// // // // //               {renderCartItem({ item })}
// // // // //             </View>
// // // // //           ))}
// // // // //         </View>

// // // // //         {/* Order Summary */}
// // // // //         <View style={styles.summaryContainer}>
// // // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // // //           <View style={styles.summaryRow}>
// // // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // // // //           </View>
// // // // //           <View style={styles.summaryRow}>
// // // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // // //           </View>
// // // // //           <View style={styles.summaryRow}>
// // // // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // // // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // // // //           </View>
// // // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // // //             <Text style={styles.totalLabel}>Total</Text>
// // // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Payment Methods */}
// // // // //         <View style={styles.paymentContainer}>
// // // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // // //           <PaymentMethod 
// // // // //             method="Razorpay" 
// // // // //             icon="card-outline" 
// // // // //             description="Credit/Debit Card, UPI, Net Banking" 
// // // // //           />
// // // // //           <PaymentMethod 
// // // // //             method="Cash on Delivery" 
// // // // //             icon="cash-outline" 
// // // // //             description="Pay when you receive" 
// // // // //           />
// // // // //         </View>

// // // // //         <View style={styles.footerSpacing} />
// // // // //       </ScrollView>

// // // // //       {/* Processing Overlay */}
// // // // //       {isProcessing && (
// // // // //         <View style={styles.overlay}>
// // // // //           <View style={styles.processingContainer}>
// // // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // // // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* Checkout Button */}
// // // // //       <View style={styles.checkoutContainer}>
// // // // //         <View style={styles.checkoutLeft}>
// // // // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // // //         </View>
// // // // //         <TouchableOpacity
// // // // //           style={styles.checkoutButton}
// // // // //           onPress={handlePlaceOrder}
// // // // //           disabled={isProcessing}
// // // // //         >
// // // // //           <Text style={styles.checkoutButtonText}>
// // // // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
// // // // //           </Text>
// // // // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   headerTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   headerRight: {
// // // // //     width: 40,
// // // // //   },
// // // // //   clearText: {
// // // // //     color: '#dc3545',
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   cartItemsContainer: {
// // // // //     padding: 16,
// // // // //   },
// // // // //   cartItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 16,
// // // // //     padding: 12,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#f0f0f5',
// // // // //   },
// // // // //   itemImage: {
// // // // //     width: 60,
// // // // //     height: 60,
// // // // //     borderRadius: 8,
// // // // //     backgroundColor: '#f0f0f5',
// // // // //   },
// // // // //   itemInfo: {
// // // // //     flex: 1,
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   itemName: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   itemPrice: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#fc8019',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   itemRestaurant: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   quantityContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#fc8019',
// // // // //     borderRadius: 6,
// // // // //     backgroundColor: '#ffffff',
// // // // //     paddingHorizontal: 4,
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   quantityButton: {
// // // // //     width: 28,
// // // // //     height: 28,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   quantityText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     minWidth: 20,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   removeButton: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   summaryContainer: {
// // // // //     padding: 16,
// // // // //     marginHorizontal: 16,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   summaryTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   summaryRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingVertical: 6,
// // // // //   },
// // // // //   summaryLabel: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //   },
// // // // //   summaryValue: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   totalRow: {
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#e9ecef',
// // // // //     paddingTop: 8,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   totalLabel: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   totalValue: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: '#fc8019',
// // // // //   },
// // // // //   paymentContainer: {
// // // // //     padding: 16,
// // // // //     marginHorizontal: 16,
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   paymentTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   paymentMethod: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     padding: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e9ecef',
// // // // //     borderRadius: 8,
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   selectedPaymentMethod: {
// // // // //     borderColor: '#fc8019',
// // // // //     backgroundColor: '#fff8f0',
// // // // //   },
// // // // //   paymentMethodInfo: {
// // // // //     flex: 1,
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   paymentMethodText: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   selectedPaymentMethodText: {
// // // // //     color: '#fc8019',
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   paymentMethodDescription: {
// // // // //     fontSize: 11,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   checkmark: {
// // // // //     marginLeft: 'auto',
// // // // //   },
// // // // //   checkoutContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#f0f0f5',
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   checkoutLeft: {
// // // // //     flexDirection: 'column',
// // // // //   },
// // // // //   checkoutTotal: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '700',
// // // // //     color: '#fc8019',
// // // // //   },
// // // // //   checkoutItems: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //   },
// // // // //   checkoutButton: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fc8019',
// // // // //     paddingHorizontal: 20,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   checkoutButtonText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   emptyContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     padding: 40,
// // // // //   },
// // // // //   emptyText: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   emptySubText: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 8,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   shopButton: {
// // // // //     marginTop: 24,
// // // // //     backgroundColor: '#fc8019',
// // // // //     paddingHorizontal: 32,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   shopButtonText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   footerSpacing: {
// // // // //     height: 80,
// // // // //   },
// // // // //   overlay: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     zIndex: 999,
// // // // //   },
// // // // //   processingContainer: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     padding: 30,
// // // // //     alignItems: 'center',
// // // // //     width: '80%',
// // // // //   },
// // // // //   processingText: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   processingSubText: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 8,
// // // // //   },
// // // // // });

// // // // // export default CartScreen;


// // // // import React, { useContext, useState, useEffect } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Image,
// // // //   Alert,
// // // //   ActivityIndicator,
// // // //   Platform,
// // // //   Modal,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // ✅ Import Razorpay with proper error handling
// // // // let RazorpayCheckout: any = null;
// // // // if (Platform.OS !== 'web') {
// // // //   RazorpayCheckout = require('react-native-razorpay').default;
// // // // }

// // // // import { CartContext } from '../../context/CartContext';
// // // // import paymentService from '../../services/paymentService';

// // // // interface CartScreenProps {
// // // //   navigation: any;
// // // // }

// // // // // ✅ Payment Success Modal for Cash on Delivery ONLY
// // // // const PaymentSuccessModal = ({ visible, onClose, orderDetails, onViewOrders, onContinueShopping }: any) => {
// // // //   if (!visible) return null;

// // // //   return (
// // // //     <Modal
// // // //       visible={visible}
// // // //       transparent={true}
// // // //       animationType="fade"
// // // //       onRequestClose={onClose}
// // // //     >
// // // //       <View style={styles.successOverlay}>
// // // //         <View style={styles.successContainer}>
// // // //           <View style={styles.successIconContainer}>
// // // //             <Icon name="checkmark-circle" size={80} color="#28a745" />
// // // //           </View>
// // // //           <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
// // // //           <Text style={styles.successSubtitle}>Your order has been placed successfully</Text>
          
// // // //           <View style={styles.successDetails}>
// // // //             <View style={styles.successRow}>
// // // //               <Text style={styles.successLabel}>Order ID</Text>
// // // //               <Text style={styles.successValue}>{orderDetails?.orderId || 'ORD-123456'}</Text>
// // // //             </View>
// // // //             <View style={styles.successRow}>
// // // //               <Text style={styles.successLabel}>Payment Method</Text>
// // // //               <Text style={styles.successValue}>{orderDetails?.paymentMethod || 'Cash on Delivery'}</Text>
// // // //             </View>
// // // //             <View style={styles.successRow}>
// // // //               <Text style={styles.successLabel}>Total Amount</Text>
// // // //               <Text style={[styles.successValue, styles.successTotal]}>
// // // //                 ₹{orderDetails?.total || 0}
// // // //               </Text>
// // // //             </View>
// // // //             <View style={styles.successRow}>
// // // //               <Text style={styles.successLabel}>Payment Status</Text>
// // // //               <Text style={[styles.successValue, styles.successStatus]}>
// // // //                 {orderDetails?.paymentStatus || 'Confirmed'}
// // // //               </Text>
// // // //             </View>
// // // //           </View>

// // // //           <TouchableOpacity
// // // //             style={styles.successButton}
// // // //             onPress={onViewOrders}
// // // //           >
// // // //             <Text style={styles.successButtonText}>View My Orders</Text>
// // // //           </TouchableOpacity>
          
// // // //           <TouchableOpacity
// // // //             style={styles.successButtonSecondary}
// // // //             onPress={onContinueShopping}
// // // //           >
// // // //             <Text style={styles.successButtonSecondaryText}>Continue Shopping</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       </View>
// // // //     </Modal>
// // // //   );
// // // // };

// // // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // // //   const { 
// // // //     cartItems, 
// // // //     updateQuantity, 
// // // //     removeFromCart, 
// // // //     getTotalPrice, 
// // // //     getTotalItems, 
// // // //     clearCart 
// // // //   } = useContext(CartContext);
  
// // // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);
// // // //   const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);
  
// // // //   // ✅ State for COD Success Modal
// // // //   const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
// // // //   const [orderDetails, setOrderDetails] = useState<any>(null);

// // // //   useEffect(() => {
// // // //     console.log('🔍 Platform:', Platform.OS);

// // // //     if (Platform.OS === 'web') {
// // // //       const existingScript = document.getElementById('razorpay-checkout-script');
// // // //       if (existingScript) {
// // // //         setIsRazorpayReady(true);
// // // //         return;
// // // //       }

// // // //       const script = document.createElement('script');
// // // //       script.id = 'razorpay-checkout-script';
// // // //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// // // //       script.async = true;
// // // //       script.onload = () => {
// // // //         console.log('✅ Razorpay web script loaded');
// // // //         setIsRazorpayReady(true);
// // // //       };
// // // //       script.onerror = () => {
// // // //         console.error('❌ Failed to load Razorpay web script');
// // // //         setIsRazorpayReady(false);
// // // //       };
// // // //       document.body.appendChild(script);
// // // //       return;
// // // //     }

// // // //     console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
// // // //     console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);

// // // //     if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
// // // //       console.warn('⚠️ RazorpayCheckout is not available');
// // // //       setIsRazorpayReady(false);
// // // //     } else {
// // // //       console.log('✅ RazorpayCheckout is ready');
// // // //       setIsRazorpayReady(true);
// // // //     }
// // // //   }, []);

// // // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // // //     if (newQuantity === 0) {
// // // //       removeFromCart(item.id, item.restaurantId);
// // // //     } else {
// // // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // // //     }
// // // //   };

// // // //   const handleRemoveItem = (item: any) => {
// // // //     Alert.alert(
// // // //       'Remove Item',
// // // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // // //       [
// // // //         { text: 'Cancel', style: 'cancel' },
// // // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // // //       ]
// // // //     );
// // // //   };

// // // //   const calculateTotal = () => {
// // // //     const subtotal = getTotalPrice();
// // // //     const tax = Math.round(subtotal * 0.18);
// // // //     const total = subtotal + tax;
// // // //     return { subtotal, tax, total };
// // // //   };

// // // //   // ✅ Handle Cash on Delivery - Shows Green Success Page
// // // //   const handleCashOnDelivery = () => {
// // // //     if (cartItems.length === 0) {
// // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // //       return;
// // // //     }

// // // //     const { total } = calculateTotal();
// // // //     const orderId = 'ORD-' + Date.now().toString().slice(-6);

// // // //     // ✅ Show success modal for COD
// // // //     setOrderDetails({
// // // //       orderId: orderId,
// // // //       total: total,
// // // //       items: cartItems,
// // // //       paymentMethod: 'Cash on Delivery',
// // // //       paymentStatus: 'Confirmed',
// // // //     });
// // // //     setShowSuccessModal(true);
// // // //     clearCart();
// // // //   };

// // // //   // ✅ Handle Success Modal - View Orders
// // // //   const handleViewOrders = () => {
// // // //     setShowSuccessModal(false);
// // // //     setOrderDetails(null);
// // // //     navigation.navigate('Orders');
// // // //   };

// // // //   // ✅ Handle Success Modal - Continue Shopping
// // // //   const handleContinueShopping = () => {
// // // //     setShowSuccessModal(false);
// // // //     setOrderDetails(null);
// // // //     navigation.navigate('Home');
// // // //   };

// // // //   // ✅ YOUR EXACT RAZORPAY FUNCTIONALITY - UNCHANGED
// // // //   const handleRazorpayPayment = async () => {
// // // //     if (cartItems.length === 0) {
// // // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // // //       return;
// // // //     }

// // // //     if (!isRazorpayReady) {
// // // //       Alert.alert(
// // // //         'Payment Error',
// // // //         'Razorpay is not ready yet. Please wait a moment and try again, or use Cash on Delivery.',
// // // //         [
// // // //           { text: 'OK' },
// // // //           { text: 'Use Cash on Delivery', onPress: () => setSelectedPaymentMethod('Cash on Delivery') },
// // // //         ]
// // // //       );
// // // //       return;
// // // //     }

// // // //     setIsProcessing(true);
// // // //     const { total } = calculateTotal();

// // // //     try {
// // // //       const orderResponse = await paymentService.createOrder(total, 'INR');
// // // //       console.log('📦 Order response:', orderResponse);

// // // //       if (!orderResponse.success) {
// // // //         throw new Error(orderResponse.message || 'Failed to create order');
// // // //       }

// // // //       const { order, key } = orderResponse;
// // // //       const amount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount;

// // // //       // ✅ Your original Razorpay options - UNCHANGED
// // // //       const options: any = {
// // // //         description: 'QuickBite Order Payment',
// // // //         image: 'https://your-logo-url.com/logo.png',
// // // //         currency: order.currency || 'INR',
// // // //         key: key,
// // // //         amount: amount,
// // // //         name: 'QuickBite',
// // // //         order_id: order.id,
// // // //         prefill: {
// // // //           email: 'customer@example.com',
// // // //           contact: '9876543210',
// // // //           name: 'Customer Name',
// // // //         },
// // // //         theme: { color: '#fc8019' },
// // // //       };

// // // //       console.log('💳 Opening Razorpay with options:', options);

// // // //       const handlePaymentSuccess = async (response: any) => {
// // // //         try {
// // // //           const verifyResponse = await paymentService.verifyPayment(
// // // //             response.razorpay_order_id,
// // // //             response.razorpay_payment_id,
// // // //             response.razorpay_signature,
// // // //             'ORD-' + Date.now().toString().slice(-6)
// // // //           );

// // // //           setIsProcessing(false);

// // // //           if (verifyResponse.success) {
// // // //             Alert.alert(
// // // //               'Payment Successful! 🎉',
// // // //               `Payment ID: ${response.razorpay_payment_id}`,
// // // //               [
// // // //                 {
// // // //                   text: 'View Order',
// // // //                   onPress: () => {
// // // //                     navigation.navigate('OrderTracking', {
// // // //                       orderId: response.razorpay_order_id,
// // // //                       total: total,
// // // //                       items: cartItems,
// // // //                       paymentMethod: 'Razorpay',
// // // //                       paymentId: response.razorpay_payment_id,
// // // //                       paymentStatus: 'Paid',
// // // //                     });
// // // //                     clearCart();
// // // //                   },
// // // //                 },
// // // //               ]
// // // //             );
// // // //           } else {
// // // //             Alert.alert('Payment Verification Failed', verifyResponse.message || 'Please contact support.');
// // // //           }
// // // //         } catch (verifyError: any) {
// // // //           setIsProcessing(false);
// // // //           console.error('❌ Verification error:', verifyError);
// // // //           Alert.alert('Verification Failed', 'Please contact support.');
// // // //         }
// // // //       };

// // // //       if (Platform.OS === 'web') {
// // // //         const win = window as any;

// // // //         if (!win.Razorpay) {
// // // //           setIsProcessing(false);
// // // //           Alert.alert('Payment Error', 'Razorpay checkout script did not load. Please refresh and try again.');
// // // //           return;
// // // //         }

// // // //         const rzp = new win.Razorpay({
// // // //           ...options,
// // // //           handler: handlePaymentSuccess,
// // // //           modal: {
// // // //             ondismiss: function () {
// // // //               setIsProcessing(false);
// // // //               Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // // //             },
// // // //           },
// // // //         });

// // // //         rzp.on('payment.failed', function (response: any) {
// // // //           setIsProcessing(false);
// // // //           console.error('❌ Razorpay payment failed:', response.error);
// // // //           Alert.alert('Payment Failed', response.error.description || 'Something went wrong. Please try again.');
// // // //         });

// // // //         rzp.open();
// // // //         return;
// // // //       }

// // // //       RazorpayCheckout.open(options)
// // // //         .then(handlePaymentSuccess)
// // // //         .catch((error: any) => {
// // // //           setIsProcessing(false);
// // // //           console.error('❌ Razorpay error:', error);

// // // //           let errorMessage = 'Something went wrong. Please try again.';
// // // //           let errorTitle = 'Payment Failed';

// // // //           if (error.code === 'PAYMENT_FAILED') {
// // // //             errorMessage = 'Payment failed. Please try again with a different payment method.';
// // // //           } else if (error.code === 'NETWORK_ERROR') {
// // // //             errorMessage = 'Network error. Please check your internet connection.';
// // // //           } else if (error.code === 'CANCELLED') {
// // // //             errorTitle = 'Payment Cancelled';
// // // //             errorMessage = 'You cancelled the payment process.';
// // // //           } else if (error.description) {
// // // //             errorMessage = error.description;
// // // //           } else if (error.message) {
// // // //             errorMessage = error.message;
// // // //           }

// // // //           Alert.alert(errorTitle, errorMessage);
// // // //         });

// // // //     } catch (error: any) {
// // // //       setIsProcessing(false);
// // // //       console.error('❌ Payment error:', error);
// // // //       Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // // //     }
// // // //   };

// // // //   const handlePlaceOrder = () => {
// // // //     if (selectedPaymentMethod === 'Razorpay') {
// // // //       handleRazorpayPayment();
// // // //     } else {
// // // //       handleCashOnDelivery();
// // // //     }
// // // //   };

// // // //   // Render cart item
// // // //   const renderCartItem = ({ item }: { item: any }) => (
// // // //     <View style={styles.cartItem}>
// // // //       <Image 
// // // //         source={{ uri: item.image || 'https://placehold.co/60x60' }} 
// // // //         style={styles.itemImage} 
// // // //       />
// // // //       <View style={styles.itemInfo}>
// // // //         <Text style={styles.itemName}>{item.name}</Text>
// // // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // // //       </View>
// // // //       <View style={styles.quantityContainer}>
// // // //         <TouchableOpacity
// // // //           style={styles.quantityButton}
// // // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // // //         >
// // // //           <Icon name="remove" size={16} color="#fc8019" />
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // // //         <TouchableOpacity
// // // //           style={styles.quantityButton}
// // // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // // //         >
// // // //           <Icon name="add" size={16} color="#fc8019" />
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );

// // // //   // Render payment method
// // // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // // //     <TouchableOpacity
// // // //       style={[
// // // //         styles.paymentMethod,
// // // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // // //       ]}
// // // //       onPress={() => setSelectedPaymentMethod(method)}
// // // //     >
// // // //       <Icon 
// // // //         name={icon} 
// // // //         size={24} 
// // // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // // //       />
// // // //       <View style={styles.paymentMethodInfo}>
// // // //         <Text style={[
// // // //           styles.paymentMethodText, 
// // // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // // //         ]}>
// // // //           {method}
// // // //         </Text>
// // // //         {description && (
// // // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // // //         )}
// // // //       </View>
// // // //       {selectedPaymentMethod === method && (
// // // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // // //       )}
// // // //     </TouchableOpacity>
// // // //   );

// // // //   const { subtotal, tax, total } = calculateTotal();

// // // //   // Empty cart view
// // // //   if (cartItems.length === 0 && !showSuccessModal) {
// // // //     return (
// // // //       <SafeAreaView style={styles.container}>
// // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // //         <View style={styles.header}>
// // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // //           </TouchableOpacity>
// // // //           <Text style={styles.headerTitle}>My Cart</Text>
// // // //           <View style={styles.headerRight} />
// // // //         </View>
// // // //         <View style={styles.emptyContainer}>
// // // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// // // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // //       <View style={styles.header}>
// // // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.headerTitle}>My Cart</Text>
// // // //         <TouchableOpacity onPress={() => {
// // // //           Alert.alert(
// // // //             'Clear Cart',
// // // //             'Are you sure you want to clear your cart?',
// // // //             [
// // // //               { text: 'Cancel', style: 'cancel' },
// // // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // // //             ]
// // // //           );
// // // //         }}>
// // // //           <Text style={styles.clearText}>Clear</Text>
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // //         {/* Cart Items */}
// // // //         <View style={styles.cartItemsContainer}>
// // // //           {cartItems.map((item, index) => (
// // // //             <View key={index}>
// // // //               {renderCartItem({ item })}
// // // //             </View>
// // // //           ))}
// // // //         </View>

// // // //         {/* Order Summary */}
// // // //         <View style={styles.summaryContainer}>
// // // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // // //           <View style={styles.summaryRow}>
// // // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // // //           </View>
// // // //           <View style={styles.summaryRow}>
// // // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // // //             <Text style={styles.summaryValue}>₹0</Text>
// // // //           </View>
// // // //           <View style={styles.summaryRow}>
// // // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // // //           </View>
// // // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // // //             <Text style={styles.totalLabel}>Total</Text>
// // // //             <Text style={styles.totalValue}>₹{total}</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Payment Methods */}
// // // //         <View style={styles.paymentContainer}>
// // // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // // //           <PaymentMethod 
// // // //             method="Razorpay" 
// // // //             icon="card-outline" 
// // // //             description="Credit/Debit Card, UPI, Net Banking" 
// // // //           />
// // // //           <PaymentMethod 
// // // //             method="Cash on Delivery" 
// // // //             icon="cash-outline" 
// // // //             description="Pay when you receive" 
// // // //           />
// // // //         </View>

// // // //         <View style={styles.footerSpacing} />
// // // //       </ScrollView>

// // // //       {/* Processing Overlay */}
// // // //       {isProcessing && (
// // // //         <View style={styles.overlay}>
// // // //           <View style={styles.processingContainer}>
// // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // // //           </View>
// // // //         </View>
// // // //       )}

// // // //       {/* ✅ COD Success Modal */}
// // // //       <PaymentSuccessModal
// // // //         visible={showSuccessModal}
// // // //         onClose={() => setShowSuccessModal(false)}
// // // //         orderDetails={orderDetails}
// // // //         onViewOrders={handleViewOrders}
// // // //         onContinueShopping={handleContinueShopping}
// // // //       />

// // // //       {/* Checkout Button */}
// // // //       <View style={styles.checkoutContainer}>
// // // //         <View style={styles.checkoutLeft}>
// // // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // // //         </View>
// // // //         <TouchableOpacity
// // // //           style={styles.checkoutButton}
// // // //           onPress={handlePlaceOrder}
// // // //           disabled={isProcessing}
// // // //         >
// // // //           <Text style={styles.checkoutButtonText}>
// // // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout →'}
// // // //           </Text>
// // // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   headerTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   headerRight: {
// // // //     width: 40,
// // // //   },
// // // //   clearText: {
// // // //     color: '#dc3545',
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //   },
// // // //   cartItemsContainer: {
// // // //     padding: 16,
// // // //   },
// // // //   cartItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //     padding: 12,
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#f0f0f5',
// // // //   },
// // // //   itemImage: {
// // // //     width: 60,
// // // //     height: 60,
// // // //     borderRadius: 8,
// // // //     backgroundColor: '#f0f0f5',
// // // //   },
// // // //   itemInfo: {
// // // //     flex: 1,
// // // //     marginLeft: 12,
// // // //   },
// // // //   itemName: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //   },
// // // //   itemPrice: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#fc8019',
// // // //     marginTop: 2,
// // // //   },
// // // //   itemRestaurant: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   quantityContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: '#fc8019',
// // // //     borderRadius: 6,
// // // //     backgroundColor: '#ffffff',
// // // //     paddingHorizontal: 4,
// // // //     marginRight: 8,
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
// // // //   removeButton: {
// // // //     padding: 4,
// // // //   },
// // // //   summaryContainer: {
// // // //     padding: 16,
// // // //     marginHorizontal: 16,
// // // //     backgroundColor: '#f8f9fa',
// // // //     borderRadius: 12,
// // // //     marginTop: 8,
// // // //   },
// // // //   summaryTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //   },
// // // //   summaryRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     paddingVertical: 6,
// // // //   },
// // // //   summaryLabel: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //   },
// // // //   summaryValue: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //   },
// // // //   totalRow: {
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#e9ecef',
// // // //     paddingTop: 8,
// // // //     marginTop: 4,
// // // //   },
// // // //   totalLabel: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   totalValue: {
// // // //     fontSize: 16,
// // // //     fontWeight: '700',
// // // //     color: '#fc8019',
// // // //   },
// // // //   paymentContainer: {
// // // //     padding: 16,
// // // //     marginHorizontal: 16,
// // // //     marginTop: 16,
// // // //   },
// // // //   paymentTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //   },
// // // //   paymentMethod: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     padding: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#e9ecef',
// // // //     borderRadius: 8,
// // // //     marginBottom: 8,
// // // //   },
// // // //   selectedPaymentMethod: {
// // // //     borderColor: '#fc8019',
// // // //     backgroundColor: '#fff8f0',
// // // //   },
// // // //   paymentMethodInfo: {
// // // //     flex: 1,
// // // //     marginLeft: 12,
// // // //   },
// // // //   paymentMethodText: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //   },
// // // //   selectedPaymentMethodText: {
// // // //     color: '#fc8019',
// // // //     fontWeight: '600',
// // // //   },
// // // //   paymentMethodDescription: {
// // // //     fontSize: 11,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   checkmark: {
// // // //     marginLeft: 'auto',
// // // //   },
// // // //   checkoutContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#f0f0f5',
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   checkoutLeft: {
// // // //     flexDirection: 'column',
// // // //   },
// // // //   checkoutTotal: {
// // // //     fontSize: 18,
// // // //     fontWeight: '700',
// // // //     color: '#fc8019',
// // // //   },
// // // //   checkoutItems: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //   },
// // // //   checkoutButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fc8019',
// // // //     paddingHorizontal: 20,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 8,
// // // //   },
// // // //   checkoutButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     marginRight: 8,
// // // //   },
// // // //   emptyContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     padding: 40,
// // // //   },
// // // //   emptyText: {
// // // //     fontSize: 20,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginTop: 16,
// // // //   },
// // // //   emptySubText: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginTop: 8,
// // // //     textAlign: 'center',
// // // //   },
// // // //   shopButton: {
// // // //     marginTop: 24,
// // // //     backgroundColor: '#fc8019',
// // // //     paddingHorizontal: 32,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 8,
// // // //   },
// // // //   shopButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // //   footerSpacing: {
// // // //     height: 80,
// // // //   },
// // // //   overlay: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     zIndex: 999,
// // // //   },
// // // //   processingContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 12,
// // // //     padding: 30,
// // // //     alignItems: 'center',
// // // //     width: '80%',
// // // //   },
// // // //   processingText: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginTop: 16,
// // // //   },
// // // //   processingSubText: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginTop: 8,
// // // //   },
// // // //   // ✅ Success Modal Styles
// // // //   successOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(0,0,0,0.6)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   successContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 24,
// // // //     padding: 30,
// // // //     width: '90%',
// // // //     maxWidth: 400,
// // // //     alignItems: 'center',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 8,
// // // //     elevation: 5,
// // // //   },
// // // //   successIconContainer: {
// // // //     width: 100,
// // // //     height: 100,
// // // //     borderRadius: 50,
// // // //     backgroundColor: '#e8f5e9',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //   },
// // // //   successTitle: {
// // // //     fontSize: 24,
// // // //     fontWeight: 'bold',
// // // //     color: '#282c3f',
// // // //     marginBottom: 8,
// // // //   },
// // // //   successSubtitle: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginBottom: 20,
// // // //     textAlign: 'center',
// // // //   },
// // // //   successDetails: {
// // // //     width: '100%',
// // // //     backgroundColor: '#f8f9fa',
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 20,
// // // //   },
// // // //   successRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     paddingVertical: 6,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#e9ecef',
// // // //   },
// // // //   successLabel: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //   },
// // // //   successValue: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     fontWeight: '500',
// // // //   },
// // // //   successTotal: {
// // // //     color: '#fc8019',
// // // //     fontWeight: '700',
// // // //     fontSize: 16,
// // // //   },
// // // //   successStatus: {
// // // //     color: '#28a745',
// // // //     fontWeight: '600',
// // // //   },
// // // //   successButton: {
// // // //     backgroundColor: '#fc8019',
// // // //     borderRadius: 12,
// // // //     paddingVertical: 14,
// // // //     paddingHorizontal: 40,
// // // //     width: '100%',
// // // //     alignItems: 'center',
// // // //     marginBottom: 10,
// // // //   },
// // // //   successButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // //   successButtonSecondary: {
// // // //     borderRadius: 12,
// // // //     paddingVertical: 12,
// // // //     paddingHorizontal: 40,
// // // //     width: '100%',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor: '#fc8019',
// // // //   },
// // // //   successButtonSecondaryText: {
// // // //     color: '#fc8019',
// // // //     fontSize: 16,
// // // //     fontWeight: '500',
// // // //   },
// // // // });

// // // // export default CartScreen;
// // // import React, { useContext, useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Image,
// // //   Alert,
// // //   ActivityIndicator,
// // //   Platform,
// // //   Modal,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // ✅ Import Razorpay with proper error handling
// // // let RazorpayCheckout: any = null;
// // // if (Platform.OS !== 'web') {
// // //   RazorpayCheckout = require('react-native-razorpay').default;
// // // }

// // // import { CartContext } from '../../context/CartContext';
// // // import paymentService from '../../services/paymentService';

// // // interface CartScreenProps {
// // //   navigation: any;
// // // }

// // // // ✅ Payment Success Modal for Cash on Delivery ONLY
// // // const PaymentSuccessModal = ({ visible, onClose, orderDetails, onViewOrders, onContinueShopping }: any) => {
// // //   if (!visible) return null;

// // //   return (
// // //     <Modal
// // //       visible={visible}
// // //       transparent={true}
// // //       animationType="fade"
// // //       onRequestClose={onClose}
// // //     >
// // //       <View style={styles.successOverlay}>
// // //         <View style={styles.successContainer}>
// // //           <View style={styles.successIconContainer}>
// // //             <Icon name="checkmark-circle" size={80} color="#28a745" />
// // //           </View>
// // //           <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
// // //           <Text style={styles.successSubtitle}>Your order has been placed successfully</Text>
          
// // //           <View style={styles.successDetails}>
// // //             <View style={styles.successRow}>
// // //               <Text style={styles.successLabel}>Order ID</Text>
// // //               <Text style={styles.successValue}>{orderDetails?.orderId || 'ORD-123456'}</Text>
// // //             </View>
// // //             <View style={styles.successRow}>
// // //               <Text style={styles.successLabel}>Payment Method</Text>
// // //               <Text style={styles.successValue}>{orderDetails?.paymentMethod || 'Cash on Delivery'}</Text>
// // //             </View>
// // //             <View style={styles.successRow}>
// // //               <Text style={styles.successLabel}>Total Amount</Text>
// // //               <Text style={[styles.successValue, styles.successTotal]}>
// // //                 ₹{orderDetails?.total || 0}
// // //               </Text>
// // //             </View>
// // //             <View style={styles.successRow}>
// // //               <Text style={styles.successLabel}>Payment Status</Text>
// // //               <Text style={[styles.successValue, styles.successStatus]}>
// // //                 {orderDetails?.paymentStatus || 'Confirmed'}
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           <TouchableOpacity
// // //             style={styles.successButton}
// // //             onPress={onViewOrders}
// // //           >
// // //             <Text style={styles.successButtonText}>View My Orders</Text>
// // //           </TouchableOpacity>
          
// // //           <TouchableOpacity
// // //             style={styles.successButtonSecondary}
// // //             onPress={onContinueShopping}
// // //           >
// // //             <Text style={styles.successButtonSecondaryText}>Continue Shopping</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>
// // //     </Modal>
// // //   );
// // // };

// // // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// // //   const { 
// // //     cartItems, 
// // //     updateQuantity, 
// // //     removeFromCart, 
// // //     getTotalPrice, 
// // //     getTotalItems, 
// // //     clearCart 
// // //   } = useContext(CartContext);
  
// // //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// // //   const [isProcessing, setIsProcessing] = useState<boolean>(false);
// // //   const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);
  
// // //   // ✅ State for COD Success Modal
// // //   const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
// // //   const [orderDetails, setOrderDetails] = useState<any>(null);

// // //   useEffect(() => {
// // //     console.log('🔍 Platform:', Platform.OS);

// // //     if (Platform.OS === 'web') {
// // //       const existingScript = document.getElementById('razorpay-checkout-script');
// // //       if (existingScript) {
// // //         setIsRazorpayReady(true);
// // //         return;
// // //       }

// // //       const script = document.createElement('script');
// // //       script.id = 'razorpay-checkout-script';
// // //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// // //       script.async = true;
// // //       script.onload = () => {
// // //         console.log('✅ Razorpay web script loaded');
// // //         setIsRazorpayReady(true);
// // //       };
// // //       script.onerror = () => {
// // //         console.error('❌ Failed to load Razorpay web script');
// // //         setIsRazorpayReady(false);
// // //       };
// // //       document.body.appendChild(script);
// // //       return;
// // //     }

// // //     console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
// // //     console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);

// // //     if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
// // //       console.warn('⚠️ RazorpayCheckout is not available');
// // //       setIsRazorpayReady(false);
// // //     } else {
// // //       console.log('✅ RazorpayCheckout is ready');
// // //       setIsRazorpayReady(true);
// // //     }
// // //   }, []);

// // //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// // //     if (newQuantity === 0) {
// // //       removeFromCart(item.id, item.restaurantId);
// // //     } else {
// // //       updateQuantity(item.id, item.restaurantId, newQuantity);
// // //     }
// // //   };

// // //   const handleRemoveItem = (item: any) => {
// // //     Alert.alert(
// // //       'Remove Item',
// // //       `Are you sure you want to remove ${item.name} from your cart?`,
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// // //       ]
// // //     );
// // //   };

// // //   const calculateTotal = () => {
// // //     const subtotal = getTotalPrice();
// // //     const tax = Math.round(subtotal * 0.18);
// // //     const total = subtotal + tax;
// // //     return { subtotal, tax, total };
// // //   };

// // //   // ✅ Handle Cash on Delivery - Shows Green Success Page
// // //   const handleCashOnDelivery = () => {
// // //     if (cartItems.length === 0) {
// // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // //       return;
// // //     }

// // //     const { total } = calculateTotal();
// // //     const orderId = 'ORD-' + Date.now().toString().slice(-6);

// // //     // ✅ Show success modal for COD
// // //     setOrderDetails({
// // //       orderId: orderId,
// // //       total: total,
// // //       items: cartItems,
// // //       paymentMethod: 'Cash on Delivery',
// // //       paymentStatus: 'Confirmed',
// // //     });
// // //     setShowSuccessModal(true);
// // //     clearCart();
// // //   };

// // //   // ✅ Handle Success Modal - View Orders
// // //   const handleViewOrders = () => {
// // //     setShowSuccessModal(false);
// // //     setOrderDetails(null);
// // //     navigation.navigate('Orders');
// // //   };

// // //   // ✅ Handle Success Modal - Continue Shopping
// // //   const handleContinueShopping = () => {
// // //     setShowSuccessModal(false);
// // //     setOrderDetails(null);
// // //     navigation.navigate('HomeTab');
// // //   };

// // //   // ✅ YOUR EXACT RAZORPAY FUNCTIONALITY - UNCHANGED
// // //   const handleRazorpayPayment = async () => {
// // //     if (cartItems.length === 0) {
// // //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// // //       return;
// // //     }

// // //     if (!isRazorpayReady) {
// // //       Alert.alert(
// // //         'Payment Error',
// // //         'Razorpay is not ready yet. Please wait a moment and try again, or use Cash on Delivery.',
// // //         [
// // //           { text: 'OK' },
// // //           { text: 'Use Cash on Delivery', onPress: () => setSelectedPaymentMethod('Cash on Delivery') },
// // //         ]
// // //       );
// // //       return;
// // //     }

// // //     setIsProcessing(true);
// // //     const { total } = calculateTotal();

// // //     try {
// // //       const orderResponse = await paymentService.createOrder(total, 'INR');
// // //       console.log('📦 Order response:', orderResponse);

// // //       if (!orderResponse.success) {
// // //         throw new Error(orderResponse.message || 'Failed to create order');
// // //       }

// // //       const { order, key } = orderResponse;
// // //       const amount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount;

// // //       // ✅ Your original Razorpay options - UNCHANGED
// // //       const options: any = {
// // //         description: 'QuickBite Order Payment',
// // //         image: 'https://your-logo-url.com/logo.png',
// // //         currency: order.currency || 'INR',
// // //         key: key,
// // //         amount: amount,
// // //         name: 'QuickBite',
// // //         order_id: order.id,
// // //         prefill: {
// // //           email: 'customer@example.com',
// // //           contact: '9876543210',
// // //           name: 'Customer Name',
// // //         },
// // //         theme: { color: '#fc8019' },
// // //       };

// // //       console.log('💳 Opening Razorpay with options:', options);

// // //       const handlePaymentSuccess = async (response: any) => {
// // //         try {
// // //           const verifyResponse = await paymentService.verifyPayment(
// // //             response.razorpay_order_id,
// // //             response.razorpay_payment_id,
// // //             response.razorpay_signature,
// // //             'ORD-' + Date.now().toString().slice(-6)
// // //           );

// // //           setIsProcessing(false);

// // //           if (verifyResponse.success) {
// // //             Alert.alert(
// // //               'Payment Successful! 🎉',
// // //               `Payment ID: ${response.razorpay_payment_id}`,
// // //               [
// // //                 {
// // //                   text: 'View Order',
// // //                   onPress: () => {
// // //                     navigation.navigate('OrderTracking', {
// // //                       orderId: response.razorpay_order_id,
// // //                       total: total,
// // //                       items: cartItems,
// // //                       paymentMethod: 'Razorpay',
// // //                       paymentId: response.razorpay_payment_id,
// // //                       paymentStatus: 'Paid',
// // //                     });
// // //                     clearCart();
// // //                   },
// // //                 },
// // //               ]
// // //             );
// // //           } else {
// // //             Alert.alert('Payment Verification Failed', verifyResponse.message || 'Please contact support.');
// // //           }
// // //         } catch (verifyError: any) {
// // //           setIsProcessing(false);
// // //           console.error('❌ Verification error:', verifyError);
// // //           Alert.alert('Verification Failed', 'Please contact support.');
// // //         }
// // //       };

// // //       if (Platform.OS === 'web') {
// // //         const win = window as any;

// // //         if (!win.Razorpay) {
// // //           setIsProcessing(false);
// // //           Alert.alert('Payment Error', 'Razorpay checkout script did not load. Please refresh and try again.');
// // //           return;
// // //         }

// // //         const rzp = new win.Razorpay({
// // //           ...options,
// // //           handler: handlePaymentSuccess,
// // //           modal: {
// // //             ondismiss: function () {
// // //               setIsProcessing(false);
// // //               Alert.alert('Payment Cancelled', 'You cancelled the payment');
// // //             },
// // //           },
// // //         });

// // //         rzp.on('payment.failed', function (response: any) {
// // //           setIsProcessing(false);
// // //           console.error('❌ Razorpay payment failed:', response.error);
// // //           Alert.alert('Payment Failed', response.error.description || 'Something went wrong. Please try again.');
// // //         });

// // //         rzp.open();
// // //         return;
// // //       }

// // //       RazorpayCheckout.open(options)
// // //         .then(handlePaymentSuccess)
// // //         .catch((error: any) => {
// // //           setIsProcessing(false);
// // //           console.error('❌ Razorpay error:', error);

// // //           let errorMessage = 'Something went wrong. Please try again.';
// // //           let errorTitle = 'Payment Failed';

// // //           if (error.code === 'PAYMENT_FAILED') {
// // //             errorMessage = 'Payment failed. Please try again with a different payment method.';
// // //           } else if (error.code === 'NETWORK_ERROR') {
// // //             errorMessage = 'Network error. Please check your internet connection.';
// // //           } else if (error.code === 'CANCELLED') {
// // //             errorTitle = 'Payment Cancelled';
// // //             errorMessage = 'You cancelled the payment process.';
// // //           } else if (error.description) {
// // //             errorMessage = error.description;
// // //           } else if (error.message) {
// // //             errorMessage = error.message;
// // //           }

// // //           Alert.alert(errorTitle, errorMessage);
// // //         });

// // //     } catch (error: any) {
// // //       setIsProcessing(false);
// // //       console.error('❌ Payment error:', error);
// // //       Alert.alert('Error', error.message || 'Failed to initialize payment.');
// // //     }
// // //   };

// // //   const handlePlaceOrder = () => {
// // //     if (selectedPaymentMethod === 'Razorpay') {
// // //       handleRazorpayPayment();
// // //     } else {
// // //       handleCashOnDelivery();
// // //     }
// // //   };

// // //   // Render cart item
// // //   const renderCartItem = ({ item }: { item: any }) => (
// // //     <View style={styles.cartItem}>
// // //       <Image 
// // //         source={{ uri: item.image || 'https://placehold.co/60x60' }} 
// // //         style={styles.itemImage} 
// // //       />
// // //       <View style={styles.itemInfo}>
// // //         <Text style={styles.itemName}>{item.name}</Text>
// // //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// // //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// // //       </View>
// // //       <View style={styles.quantityContainer}>
// // //         <TouchableOpacity
// // //           style={styles.quantityButton}
// // //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// // //         >
// // //           <Icon name="remove" size={16} color="#fc8019" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.quantityText}>{item.quantity}</Text>
// // //         <TouchableOpacity
// // //           style={styles.quantityButton}
// // //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// // //         >
// // //           <Icon name="add" size={16} color="#fc8019" />
// // //         </TouchableOpacity>
// // //       </View>
// // //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// // //         <Icon name="close-circle" size={20} color="#dc3545" />
// // //       </TouchableOpacity>
// // //     </View>
// // //   );

// // //   // Render payment method
// // //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// // //     <TouchableOpacity
// // //       style={[
// // //         styles.paymentMethod,
// // //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// // //       ]}
// // //       onPress={() => setSelectedPaymentMethod(method)}
// // //     >
// // //       <Icon 
// // //         name={icon} 
// // //         size={24} 
// // //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// // //       />
// // //       <View style={styles.paymentMethodInfo}>
// // //         <Text style={[
// // //           styles.paymentMethodText, 
// // //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// // //         ]}>
// // //           {method}
// // //         </Text>
// // //         {description && (
// // //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// // //         )}
// // //       </View>
// // //       {selectedPaymentMethod === method && (
// // //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// // //       )}
// // //     </TouchableOpacity>
// // //   );

// // //   const { subtotal, tax, total } = calculateTotal();

// // //   // Empty cart view
// // //   if (cartItems.length === 0 && !showSuccessModal) {
// // //     return (
// // //       <SafeAreaView style={styles.container}>
// // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // //         <View style={styles.header}>
// // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // //           </TouchableOpacity>
// // //           <Text style={styles.headerTitle}>My Cart</Text>
// // //           <View style={styles.headerRight} />
// // //         </View>
// // //         <View style={styles.emptyContainer}>
// // //           <Icon name="cart-outline" size={80} color="#ccc" />
// // //           <Text style={styles.emptyText}>Your cart is empty</Text>
// // //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// // //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('HomeTab')}>
// // //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()}>
// // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>My Cart</Text>
// // //         <TouchableOpacity onPress={() => {
// // //           Alert.alert(
// // //             'Clear Cart',
// // //             'Are you sure you want to clear your cart?',
// // //             [
// // //               { text: 'Cancel', style: 'cancel' },
// // //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// // //             ]
// // //           );
// // //         }}>
// // //           <Text style={styles.clearText}>Clear</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       <ScrollView showsVerticalScrollIndicator={false}>
// // //         {/* Cart Items */}
// // //         <View style={styles.cartItemsContainer}>
// // //           {cartItems.map((item, index) => (
// // //             <View key={index}>
// // //               {renderCartItem({ item })}
// // //             </View>
// // //           ))}
// // //         </View>

// // //         {/* Order Summary */}
// // //         <View style={styles.summaryContainer}>
// // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // //           <View style={styles.summaryRow}>
// // //             <Text style={styles.summaryLabel}>Subtotal</Text>
// // //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// // //           </View>
// // //           <View style={styles.summaryRow}>
// // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // //             <Text style={styles.summaryValue}>₹0</Text>
// // //           </View>
// // //           <View style={styles.summaryRow}>
// // //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// // //             <Text style={styles.summaryValue}>₹{tax}</Text>
// // //           </View>
// // //           <View style={[styles.summaryRow, styles.totalRow]}>
// // //             <Text style={styles.totalLabel}>Total</Text>
// // //             <Text style={styles.totalValue}>₹{total}</Text>
// // //           </View>
// // //         </View>

// // //         {/* Payment Methods */}
// // //         <View style={styles.paymentContainer}>
// // //           <Text style={styles.paymentTitle}>Payment Method</Text>
// // //           <PaymentMethod 
// // //             method="Razorpay" 
// // //             icon="card-outline" 
// // //             description="Credit/Debit Card, UPI, Net Banking" 
// // //           />
// // //           <PaymentMethod 
// // //             method="Cash on Delivery" 
// // //             icon="cash-outline" 
// // //             description="Pay when you receive" 
// // //           />
// // //         </View>

// // //         <View style={styles.footerSpacing} />
// // //       </ScrollView>

// // //       {/* Processing Overlay */}
// // //       {isProcessing && (
// // //         <View style={styles.overlay}>
// // //           <View style={styles.processingContainer}>
// // //             <ActivityIndicator size="large" color="#fc8019" />
// // //             <Text style={styles.processingText}>Processing Payment...</Text>
// // //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// // //           </View>
// // //         </View>
// // //       )}

// // //       {/* ✅ COD Success Modal */}
// // //       <PaymentSuccessModal
// // //         visible={showSuccessModal}
// // //         onClose={() => setShowSuccessModal(false)}
// // //         orderDetails={orderDetails}
// // //         onViewOrders={handleViewOrders}
// // //         onContinueShopping={handleContinueShopping}
// // //       />

// // //       {/* Checkout Button */}
// // //       <View style={styles.checkoutContainer}>
// // //         <View style={styles.checkoutLeft}>
// // //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// // //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// // //         </View>
// // //         <TouchableOpacity
// // //           style={styles.checkoutButton}
// // //           onPress={handlePlaceOrder}
// // //           disabled={isProcessing}
// // //         >
// // //           <Text style={styles.checkoutButtonText}>
// // //             {isProcessing ? 'Processing...' : 'Proceed to Checkout →'}
// // //           </Text>
// // //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// // //         </TouchableOpacity>
// // //       </View>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   headerTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   headerRight: {
// // //     width: 40,
// // //   },
// // //   clearText: {
// // //     color: '#dc3545',
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //   },
// // //   cartItemsContainer: {
// // //     padding: 16,
// // //   },
// // //   cartItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //     padding: 12,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#f0f0f5',
// // //   },
// // //   itemImage: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 8,
// // //     backgroundColor: '#f0f0f5',
// // //   },
// // //   itemInfo: {
// // //     flex: 1,
// // //     marginLeft: 12,
// // //   },
// // //   itemName: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //   },
// // //   itemPrice: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#fc8019',
// // //     marginTop: 2,
// // //   },
// // //   itemRestaurant: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   quantityContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#fc8019',
// // //     borderRadius: 6,
// // //     backgroundColor: '#ffffff',
// // //     paddingHorizontal: 4,
// // //     marginRight: 8,
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
// // //   removeButton: {
// // //     padding: 4,
// // //   },
// // //   summaryContainer: {
// // //     padding: 16,
// // //     marginHorizontal: 16,
// // //     backgroundColor: '#f8f9fa',
// // //     borderRadius: 12,
// // //     marginTop: 8,
// // //   },
// // //   summaryTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   summaryRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingVertical: 6,
// // //   },
// // //   summaryLabel: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //   },
// // //   summaryValue: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //   },
// // //   totalRow: {
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#e9ecef',
// // //     paddingTop: 8,
// // //     marginTop: 4,
// // //   },
// // //   totalLabel: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   totalValue: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: '#fc8019',
// // //   },
// // //   paymentContainer: {
// // //     padding: 16,
// // //     marginHorizontal: 16,
// // //     marginTop: 16,
// // //   },
// // //   paymentTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   paymentMethod: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#e9ecef',
// // //     borderRadius: 8,
// // //     marginBottom: 8,
// // //   },
// // //   selectedPaymentMethod: {
// // //     borderColor: '#fc8019',
// // //     backgroundColor: '#fff8f0',
// // //   },
// // //   paymentMethodInfo: {
// // //     flex: 1,
// // //     marginLeft: 12,
// // //   },
// // //   paymentMethodText: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //   },
// // //   selectedPaymentMethodText: {
// // //     color: '#fc8019',
// // //     fontWeight: '600',
// // //   },
// // //   paymentMethodDescription: {
// // //     fontSize: 11,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   checkmark: {
// // //     marginLeft: 'auto',
// // //   },
// // //   checkoutContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#f0f0f5',
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   checkoutLeft: {
// // //     flexDirection: 'column',
// // //   },
// // //   checkoutTotal: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#fc8019',
// // //   },
// // //   checkoutItems: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //   },
// // //   checkoutButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fc8019',
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //   },
// // //   checkoutButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     marginRight: 8,
// // //   },
// // //   emptyContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 40,
// // //   },
// // //   emptyText: {
// // //     fontSize: 20,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginTop: 16,
// // //   },
// // //   emptySubText: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginTop: 8,
// // //     textAlign: 'center',
// // //   },
// // //   shopButton: {
// // //     marginTop: 24,
// // //     backgroundColor: '#fc8019',
// // //     paddingHorizontal: 32,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //   },
// // //   shopButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   footerSpacing: {
// // //     height: 80,
// // //   },
// // //   overlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     zIndex: 999,
// // //   },
// // //   processingContainer: {
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 12,
// // //     padding: 30,
// // //     alignItems: 'center',
// // //     width: '80%',
// // //   },
// // //   processingText: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginTop: 16,
// // //   },
// // //   processingSubText: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginTop: 8,
// // //   },
// // //   // ✅ Success Modal Styles
// // //   successOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.6)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   successContainer: {
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 24,
// // //     padding: 30,
// // //     width: '90%',
// // //     maxWidth: 400,
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 8,
// // //     elevation: 5,
// // //   },
// // //   successIconContainer: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: '#e8f5e9',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   successTitle: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     color: '#282c3f',
// // //     marginBottom: 8,
// // //   },
// // //   successSubtitle: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginBottom: 20,
// // //     textAlign: 'center',
// // //   },
// // //   successDetails: {
// // //     width: '100%',
// // //     backgroundColor: '#f8f9fa',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 20,
// // //   },
// // //   successRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingVertical: 6,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#e9ecef',
// // //   },
// // //   successLabel: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //   },
// // //   successValue: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     fontWeight: '500',
// // //   },
// // //   successTotal: {
// // //     color: '#fc8019',
// // //     fontWeight: '700',
// // //     fontSize: 16,
// // //   },
// // //   successStatus: {
// // //     color: '#28a745',
// // //     fontWeight: '600',
// // //   },
// // //   successButton: {
// // //     backgroundColor: '#fc8019',
// // //     borderRadius: 12,
// // //     paddingVertical: 14,
// // //     paddingHorizontal: 40,
// // //     width: '100%',
// // //     alignItems: 'center',
// // //     marginBottom: 10,
// // //   },
// // //   successButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   successButtonSecondary: {
// // //     borderRadius: 12,
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 40,
// // //     width: '100%',
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#fc8019',
// // //   },
// // //   successButtonSecondaryText: {
// // //     color: '#fc8019',
// // //     fontSize: 16,
// // //     fontWeight: '500',
// // //   },
// // // });

// // // export default CartScreen;

// // // delivery-app/src/screens/main/CartScreen.tsx
// // import React, { useContext, useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// //   StatusBar,
// //   Image,
// //   Alert,
// //   ActivityIndicator,
// //   Platform,
// //   Modal,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';

// // // ✅ Import Razorpay with proper error handling
// // let RazorpayCheckout: any = null;
// // if (Platform.OS !== 'web') {
// //   RazorpayCheckout = require('react-native-razorpay').default;
// // }

// // import { CartContext } from '../../context/CartContext';
// // import { OrderContext } from '../../context/OrderContext'; // ✅ ADD THIS
// // import paymentService from '../../services/paymentService';

// // interface CartScreenProps {
// //   navigation: any;
// // }

// // // ✅ Payment Success Modal for Cash on Delivery ONLY
// // const PaymentSuccessModal = ({ visible, onClose, orderDetails, onViewOrders, onContinueShopping }: any) => {
// //   if (!visible) return null;

// //   return (
// //     <Modal
// //       visible={visible}
// //       transparent={true}
// //       animationType="fade"
// //       onRequestClose={onClose}
// //     >
// //       <View style={styles.successOverlay}>
// //         <View style={styles.successContainer}>
// //           <View style={styles.successIconContainer}>
// //             <Icon name="checkmark-circle" size={80} color="#28a745" />
// //           </View>
// //           <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
// //           <Text style={styles.successSubtitle}>Your order has been placed successfully</Text>
          
// //           <View style={styles.successDetails}>
// //             <View style={styles.successRow}>
// //               <Text style={styles.successLabel}>Order ID</Text>
// //               <Text style={styles.successValue}>{orderDetails?.orderId || 'ORD-123456'}</Text>
// //             </View>
// //             <View style={styles.successRow}>
// //               <Text style={styles.successLabel}>Payment Method</Text>
// //               <Text style={styles.successValue}>{orderDetails?.paymentMethod || 'Cash on Delivery'}</Text>
// //             </View>
// //             <View style={styles.successRow}>
// //               <Text style={styles.successLabel}>Total Amount</Text>
// //               <Text style={[styles.successValue, styles.successTotal]}>
// //                 ₹{orderDetails?.total || 0}
// //               </Text>
// //             </View>
// //             <View style={styles.successRow}>
// //               <Text style={styles.successLabel}>Payment Status</Text>
// //               <Text style={[styles.successValue, styles.successStatus]}>
// //                 {orderDetails?.paymentStatus || 'Confirmed'}
// //               </Text>
// //             </View>
// //           </View>

// //           <TouchableOpacity
// //             style={styles.successButton}
// //             onPress={onViewOrders}
// //           >
// //             <Text style={styles.successButtonText}>View My Orders</Text>
// //           </TouchableOpacity>
          
// //           <TouchableOpacity
// //             style={styles.successButtonSecondary}
// //             onPress={onContinueShopping}
// //           >
// //             <Text style={styles.successButtonSecondaryText}>Continue Shopping</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </View>
// //     </Modal>
// //   );
// // };

// // const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
// //   const { 
// //     cartItems, 
// //     updateQuantity, 
// //     removeFromCart, 
// //     getTotalPrice, 
// //     getTotalItems, 
// //     clearCart 
// //   } = useContext(CartContext);
  
// //   const { addOrder } = useContext(OrderContext); // ✅ ADD THIS
  
// //   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
// //   const [isProcessing, setIsProcessing] = useState<boolean>(false);
// //   const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);
  
// //   // ✅ State for COD Success Modal
// //   const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
// //   const [orderDetails, setOrderDetails] = useState<any>(null);

// //   useEffect(() => {
// //     console.log('🔍 Platform:', Platform.OS);

// //     if (Platform.OS === 'web') {
// //       const existingScript = document.getElementById('razorpay-checkout-script');
// //       if (existingScript) {
// //         setIsRazorpayReady(true);
// //         return;
// //       }

// //       const script = document.createElement('script');
// //       script.id = 'razorpay-checkout-script';
// //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// //       script.async = true;
// //       script.onload = () => {
// //         console.log('✅ Razorpay web script loaded');
// //         setIsRazorpayReady(true);
// //       };
// //       script.onerror = () => {
// //         console.error('❌ Failed to load Razorpay web script');
// //         setIsRazorpayReady(false);
// //       };
// //       document.body.appendChild(script);
// //       return;
// //     }

// //     console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
// //     console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);

// //     if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
// //       console.warn('⚠️ RazorpayCheckout is not available');
// //       setIsRazorpayReady(false);
// //     } else {
// //       console.log('✅ RazorpayCheckout is ready');
// //       setIsRazorpayReady(true);
// //     }
// //   }, []);

// //   const handleUpdateQuantity = (item: any, newQuantity: number) => {
// //     if (newQuantity === 0) {
// //       removeFromCart(item.id, item.restaurantId);
// //     } else {
// //       updateQuantity(item.id, item.restaurantId, newQuantity);
// //     }
// //   };

// //   const handleRemoveItem = (item: any) => {
// //     Alert.alert(
// //       'Remove Item',
// //       `Are you sure you want to remove ${item.name} from your cart?`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
// //       ]
// //     );
// //   };

// //   const calculateTotal = () => {
// //     const subtotal = getTotalPrice();
// //     const tax = Math.round(subtotal * 0.18);
// //     const total = subtotal + tax;
// //     return { subtotal, tax, total };
// //   };

// //   // ✅ Handle Cash on Delivery - Adds order to OrderContext
// //   const handleCashOnDelivery = () => {
// //     if (cartItems.length === 0) {
// //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// //       return;
// //     }

// //     const { total } = calculateTotal();
// //     const orderId = 'ORD-' + Date.now().toString().slice(-6);

// //     // ✅ Add order to OrderContext
// //     const newOrder = {
// //       id: orderId,
// //       restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
// //       items: cartItems.map(item => ({
// //         name: item.name,
// //         quantity: item.quantity,
// //         price: item.price,
// //       })),
// //       total: total,
// //       status: 'Placed' as const,
// //       createdAt: new Date().toISOString(),
// //     };
    
// //     addOrder(newOrder);
// //     console.log('✅ Order added (COD):', newOrder);

// //     // Show success modal
// //     setOrderDetails({
// //       orderId: orderId,
// //       total: total,
// //       items: cartItems,
// //       paymentMethod: 'Cash on Delivery',
// //       paymentStatus: 'Confirmed',
// //     });
// //     setShowSuccessModal(true);
// //     clearCart();
// //   };

// //   // ✅ Handle Success Modal - View Orders
// //   const handleViewOrders = () => {
// //     setShowSuccessModal(false);
// //     setOrderDetails(null);
// //     navigation.navigate('Orders');
// //   };

// //   // ✅ Handle Success Modal - Continue Shopping
// //   const handleContinueShopping = () => {
// //     setShowSuccessModal(false);
// //     setOrderDetails(null);
// //     navigation.navigate('Home');
// //   };

// //   // ✅ Handle Razorpay Payment
// //   const handleRazorpayPayment = async () => {
// //     if (cartItems.length === 0) {
// //       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
// //       return;
// //     }

// //     if (!isRazorpayReady) {
// //       Alert.alert(
// //         'Payment Error',
// //         'Razorpay is not ready yet. Please wait a moment and try again, or use Cash on Delivery.',
// //         [
// //           { text: 'OK' },
// //           { text: 'Use Cash on Delivery', onPress: () => setSelectedPaymentMethod('Cash on Delivery') },
// //         ]
// //       );
// //       return;
// //     }

// //     setIsProcessing(true);
// //     const { total } = calculateTotal();

// //     try {
// //       const orderResponse = await paymentService.createOrder(total, 'INR');
// //       console.log('📦 Order response:', orderResponse);

// //       if (!orderResponse.success) {
// //         throw new Error(orderResponse.message || 'Failed to create order');
// //       }

// //       const { order, key } = orderResponse;
// //       const amount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount;

// //       const options: any = {
// //         description: 'QuickBite Order Payment',
// //         image: 'https://your-logo-url.com/logo.png',
// //         currency: order.currency || 'INR',
// //         key: key,
// //         amount: amount,
// //         name: 'QuickBite',
// //         order_id: order.id,
// //         prefill: {
// //           email: 'customer@example.com',
// //           contact: '9876543210',
// //           name: 'Customer Name',
// //         },
// //         theme: { color: '#fc8019' },
// //       };

// //       console.log('💳 Opening Razorpay with options:', options);

// //       const handlePaymentSuccess = async (response: any) => {
// //         try {
// //           const verifyResponse = await paymentService.verifyPayment(
// //             response.razorpay_order_id,
// //             response.razorpay_payment_id,
// //             response.razorpay_signature,
// //             'ORD-' + Date.now().toString().slice(-6)
// //           );

// //           setIsProcessing(false);

// //           if (verifyResponse.success) {
// //             // ✅ Add order to OrderContext
// //             const newOrder = {
// //               id: response.razorpay_order_id || 'ORD-' + Date.now().toString().slice(-6),
// //               restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
// //               items: cartItems.map(item => ({
// //                 name: item.name,
// //                 quantity: item.quantity,
// //                 price: item.price,
// //               })),
// //               total: total,
// //               status: 'Placed' as const,
// //               createdAt: new Date().toISOString(),
// //             };
            
// //             addOrder(newOrder);
// //             console.log('✅ Order added (Razorpay):', newOrder);

// //             Alert.alert(
// //               'Payment Successful! 🎉',
// //               `Payment ID: ${response.razorpay_payment_id}`,
// //               [
// //                 {
// //                   text: 'View Order',
// //                   onPress: () => {
// //                     navigation.navigate('OrderTracking', {
// //                       orderId: response.razorpay_order_id,
// //                       total: total,
// //                       items: cartItems,
// //                       paymentMethod: 'Razorpay',
// //                       paymentId: response.razorpay_payment_id,
// //                       paymentStatus: 'Paid',
// //                     });
// //                     clearCart();
// //                   },
// //                 },
// //               ]
// //             );
// //           } else {
// //             Alert.alert('Payment Verification Failed', verifyResponse.message || 'Please contact support.');
// //           }
// //         } catch (verifyError: any) {
// //           setIsProcessing(false);
// //           console.error('❌ Verification error:', verifyError);
// //           Alert.alert('Verification Failed', 'Please contact support.');
// //         }
// //       };

// //       if (Platform.OS === 'web') {
// //         const win = window as any;

// //         if (!win.Razorpay) {
// //           setIsProcessing(false);
// //           Alert.alert('Payment Error', 'Razorpay checkout script did not load. Please refresh and try again.');
// //           return;
// //         }

// //         const rzp = new win.Razorpay({
// //           ...options,
// //           handler: handlePaymentSuccess,
// //           modal: {
// //             ondismiss: function () {
// //               setIsProcessing(false);
// //               Alert.alert('Payment Cancelled', 'You cancelled the payment');
// //             },
// //           },
// //         });

// //         rzp.on('payment.failed', function (response: any) {
// //           setIsProcessing(false);
// //           console.error('❌ Razorpay payment failed:', response.error);
// //           Alert.alert('Payment Failed', response.error.description || 'Something went wrong. Please try again.');
// //         });

// //         rzp.open();
// //         return;
// //       }

// //       RazorpayCheckout.open(options)
// //         .then(handlePaymentSuccess)
// //         .catch((error: any) => {
// //           setIsProcessing(false);
// //           console.error('❌ Razorpay error:', error);

// //           let errorMessage = 'Something went wrong. Please try again.';
// //           let errorTitle = 'Payment Failed';

// //           if (error.code === 'PAYMENT_FAILED') {
// //             errorMessage = 'Payment failed. Please try again with a different payment method.';
// //           } else if (error.code === 'NETWORK_ERROR') {
// //             errorMessage = 'Network error. Please check your internet connection.';
// //           } else if (error.code === 'CANCELLED') {
// //             errorTitle = 'Payment Cancelled';
// //             errorMessage = 'You cancelled the payment process.';
// //           } else if (error.description) {
// //             errorMessage = error.description;
// //           } else if (error.message) {
// //             errorMessage = error.message;
// //           }

// //           Alert.alert(errorTitle, errorMessage);
// //         });

// //     } catch (error: any) {
// //       setIsProcessing(false);
// //       console.error('❌ Payment error:', error);
// //       Alert.alert('Error', error.message || 'Failed to initialize payment.');
// //     }
// //   };

// //   const handlePlaceOrder = () => {
// //     if (selectedPaymentMethod === 'Razorpay') {
// //       handleRazorpayPayment();
// //     } else {
// //       handleCashOnDelivery();
// //     }
// //   };

// //   // Render cart item
// //   const renderCartItem = ({ item }: { item: any }) => (
// //     <View style={styles.cartItem}>
// //       <Image 
// //         source={{ uri: item.image || 'https://placehold.co/60x60' }} 
// //         style={styles.itemImage} 
// //       />
// //       <View style={styles.itemInfo}>
// //         <Text style={styles.itemName}>{item.name}</Text>
// //         <Text style={styles.itemPrice}>₹{item.price}</Text>
// //         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
// //       </View>
// //       <View style={styles.quantityContainer}>
// //         <TouchableOpacity
// //           style={styles.quantityButton}
// //           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
// //         >
// //           <Icon name="remove" size={16} color="#fc8019" />
// //         </TouchableOpacity>
// //         <Text style={styles.quantityText}>{item.quantity}</Text>
// //         <TouchableOpacity
// //           style={styles.quantityButton}
// //           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
// //         >
// //           <Icon name="add" size={16} color="#fc8019" />
// //         </TouchableOpacity>
// //       </View>
// //       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
// //         <Icon name="close-circle" size={20} color="#dc3545" />
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // Render payment method
// //   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
// //     <TouchableOpacity
// //       style={[
// //         styles.paymentMethod,
// //         selectedPaymentMethod === method && styles.selectedPaymentMethod,
// //       ]}
// //       onPress={() => setSelectedPaymentMethod(method)}
// //     >
// //       <Icon 
// //         name={icon} 
// //         size={24} 
// //         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
// //       />
// //       <View style={styles.paymentMethodInfo}>
// //         <Text style={[
// //           styles.paymentMethodText, 
// //           selectedPaymentMethod === method && styles.selectedPaymentMethodText
// //         ]}>
// //           {method}
// //         </Text>
// //         {description && (
// //           <Text style={styles.paymentMethodDescription}>{description}</Text>
// //         )}
// //       </View>
// //       {selectedPaymentMethod === method && (
// //         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
// //       )}
// //     </TouchableOpacity>
// //   );

// //   const { subtotal, tax, total } = calculateTotal();

// //   // Empty cart view
// //   if (cartItems.length === 0 && !showSuccessModal) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={() => navigation.goBack()}>
// //             <Icon name="arrow-back" size={24} color="#282c3f" />
// //           </TouchableOpacity>
// //           <Text style={styles.headerTitle}>My Cart</Text>
// //           <View style={styles.headerRight} />
// //         </View>
// //         <View style={styles.emptyContainer}>
// //           <Icon name="cart-outline" size={80} color="#ccc" />
// //           <Text style={styles.emptyText}>Your cart is empty</Text>
// //           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
// //           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
// //             <Text style={styles.shopButtonText}>Start Shopping</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Icon name="arrow-back" size={24} color="#282c3f" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>My Cart</Text>
// //         <TouchableOpacity onPress={() => {
// //           Alert.alert(
// //             'Clear Cart',
// //             'Are you sure you want to clear your cart?',
// //             [
// //               { text: 'Cancel', style: 'cancel' },
// //               { text: 'Clear', style: 'destructive', onPress: clearCart },
// //             ]
// //           );
// //         }}>
// //           <Text style={styles.clearText}>Clear</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         {/* Cart Items */}
// //         <View style={styles.cartItemsContainer}>
// //           {cartItems.map((item, index) => (
// //             <View key={index}>
// //               {renderCartItem({ item })}
// //             </View>
// //           ))}
// //         </View>

// //         {/* Order Summary */}
// //         <View style={styles.summaryContainer}>
// //           <Text style={styles.summaryTitle}>Order Summary</Text>
// //           <View style={styles.summaryRow}>
// //             <Text style={styles.summaryLabel}>Subtotal</Text>
// //             <Text style={styles.summaryValue}>₹{subtotal}</Text>
// //           </View>
// //           <View style={styles.summaryRow}>
// //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// //             <Text style={styles.summaryValue}>₹0</Text>
// //           </View>
// //           <View style={styles.summaryRow}>
// //             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
// //             <Text style={styles.summaryValue}>₹{tax}</Text>
// //           </View>
// //           <View style={[styles.summaryRow, styles.totalRow]}>
// //             <Text style={styles.totalLabel}>Total</Text>
// //             <Text style={styles.totalValue}>₹{total}</Text>
// //           </View>
// //         </View>

// //         {/* Payment Methods */}
// //         <View style={styles.paymentContainer}>
// //           <Text style={styles.paymentTitle}>Payment Method</Text>
// //           <PaymentMethod 
// //             method="Razorpay" 
// //             icon="card-outline" 
// //             description="Credit/Debit Card, UPI, Net Banking" 
// //           />
// //           <PaymentMethod 
// //             method="Cash on Delivery" 
// //             icon="cash-outline" 
// //             description="Pay when you receive" 
// //           />
// //         </View>

// //         <View style={styles.footerSpacing} />
// //       </ScrollView>

// //       {/* Processing Overlay */}
// //       {isProcessing && (
// //         <View style={styles.overlay}>
// //           <View style={styles.processingContainer}>
// //             <ActivityIndicator size="large" color="#fc8019" />
// //             <Text style={styles.processingText}>Processing Payment...</Text>
// //             <Text style={styles.processingSubText}>Please don't close the app</Text>
// //           </View>
// //         </View>
// //       )}

// //       {/* ✅ COD Success Modal */}
// //       <PaymentSuccessModal
// //         visible={showSuccessModal}
// //         onClose={() => setShowSuccessModal(false)}
// //         orderDetails={orderDetails}
// //         onViewOrders={handleViewOrders}
// //         onContinueShopping={handleContinueShopping}
// //       />

// //       {/* Checkout Button */}
// //       <View style={styles.checkoutContainer}>
// //         <View style={styles.checkoutLeft}>
// //           <Text style={styles.checkoutTotal}>₹{total}</Text>
// //           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
// //         </View>
// //         <TouchableOpacity
// //           style={styles.checkoutButton}
// //           onPress={handlePlaceOrder}
// //           disabled={isProcessing}
// //         >
// //           <Text style={styles.checkoutButtonText}>
// //             {isProcessing ? 'Processing...' : 'Proceed to Checkout →'}
// //           </Text>
// //           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   headerRight: {
// //     width: 40,
// //   },
// //   clearText: {
// //     color: '#dc3545',
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   cartItemsContainer: {
// //     padding: 16,
// //   },
// //   cartItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     padding: 12,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#f0f0f5',
// //   },
// //   itemImage: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 8,
// //     backgroundColor: '#f0f0f5',
// //   },
// //   itemInfo: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   itemName: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //   },
// //   itemPrice: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#fc8019',
// //     marginTop: 2,
// //   },
// //   itemRestaurant: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   quantityContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#fc8019',
// //     borderRadius: 6,
// //     backgroundColor: '#ffffff',
// //     paddingHorizontal: 4,
// //     marginRight: 8,
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
// //   removeButton: {
// //     padding: 4,
// //   },
// //   summaryContainer: {
// //     padding: 16,
// //     marginHorizontal: 16,
// //     backgroundColor: '#f8f9fa',
// //     borderRadius: 12,
// //     marginTop: 8,
// //   },
// //   summaryTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },
// //   summaryRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 6,
// //   },
// //   summaryLabel: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //   },
// //   summaryValue: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //   },
// //   totalRow: {
// //     borderTopWidth: 1,
// //     borderTopColor: '#e9ecef',
// //     paddingTop: 8,
// //     marginTop: 4,
// //   },
// //   totalLabel: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   totalValue: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: '#fc8019',
// //   },
// //   paymentContainer: {
// //     padding: 16,
// //     marginHorizontal: 16,
// //     marginTop: 16,
// //   },
// //   paymentTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },
// //   paymentMethod: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //     borderWidth: 1,
// //     borderColor: '#e9ecef',
// //     borderRadius: 8,
// //     marginBottom: 8,
// //   },
// //   selectedPaymentMethod: {
// //     borderColor: '#fc8019',
// //     backgroundColor: '#fff8f0',
// //   },
// //   paymentMethodInfo: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   paymentMethodText: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //   },
// //   selectedPaymentMethodText: {
// //     color: '#fc8019',
// //     fontWeight: '600',
// //   },
// //   paymentMethodDescription: {
// //     fontSize: 11,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   checkmark: {
// //     marginLeft: 'auto',
// //   },
// //   checkoutContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f0f0f5',
// //     backgroundColor: '#ffffff',
// //   },
// //   checkoutLeft: {
// //     flexDirection: 'column',
// //   },
// //   checkoutTotal: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#fc8019',
// //   },
// //   checkoutItems: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //   },
// //   checkoutButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fc8019',
// //     paddingHorizontal: 20,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //   },
// //   checkoutButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginRight: 8,
// //   },
// //   emptyContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 40,
// //   },
// //   emptyText: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginTop: 16,
// //   },
// //   emptySubText: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginTop: 8,
// //     textAlign: 'center',
// //   },
// //   shopButton: {
// //     marginTop: 24,
// //     backgroundColor: '#fc8019',
// //     paddingHorizontal: 32,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //   },
// //   shopButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   footerSpacing: {
// //     height: 80,
// //   },
// //   overlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 999,
// //   },
// //   processingContainer: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     padding: 30,
// //     alignItems: 'center',
// //     width: '80%',
// //   },
// //   processingText: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginTop: 16,
// //   },
// //   processingSubText: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginTop: 8,
// //   },
// //   successOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.6)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   successContainer: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 24,
// //     padding: 30,
// //     width: '90%',
// //     maxWidth: 400,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 8,
// //     elevation: 5,
// //   },
// //   successIconContainer: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: '#e8f5e9',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   successTitle: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#282c3f',
// //     marginBottom: 8,
// //   },
// //   successSubtitle: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   successDetails: {
// //     width: '100%',
// //     backgroundColor: '#f8f9fa',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 20,
// //   },
// //   successRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 6,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e9ecef',
// //   },
// //   successLabel: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //   },
// //   successValue: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     fontWeight: '500',
// //   },
// //   successTotal: {
// //     color: '#fc8019',
// //     fontWeight: '700',
// //     fontSize: 16,
// //   },
// //   successStatus: {
// //     color: '#28a745',
// //     fontWeight: '600',
// //   },
// //   successButton: {
// //     backgroundColor: '#fc8019',
// //     borderRadius: 12,
// //     paddingVertical: 14,
// //     paddingHorizontal: 40,
// //     width: '100%',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   successButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// //   successButtonSecondary: {
// //     borderRadius: 12,
// //     paddingVertical: 12,
// //     paddingHorizontal: 40,
// //     width: '100%',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#fc8019',
// //   },
// //   successButtonSecondaryText: {
// //     color: '#fc8019',
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// // });

// // export default CartScreen;
// // delivery-app/src/screens/main/CartScreen.tsx
// import React, { useContext, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Image,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   Modal,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// // ✅ Import Razorpay with proper error handling
// let RazorpayCheckout: any = null;
// if (Platform.OS !== 'web') {
//   RazorpayCheckout = require('react-native-razorpay').default;
// }

// import { CartContext } from '../../context/CartContext';
// import { OrderContext } from '../../context/OrderContext';
// import paymentService from '../../services/paymentService';

// interface CartScreenProps {
//   navigation: any;
// }

// // ✅ Payment Success Modal for Cash on Delivery ONLY
// const PaymentSuccessModal = ({ visible, onClose, orderDetails, onViewOrders, onContinueShopping }: any) => {
//   if (!visible) return null;

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.successOverlay}>
//         <View style={styles.successContainer}>
//           <View style={styles.successIconContainer}>
//             <Icon name="checkmark-circle" size={80} color="#28a745" />
//           </View>
//           <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
//           <Text style={styles.successSubtitle}>Your order has been placed successfully</Text>
          
//           <View style={styles.successDetails}>
//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Order ID</Text>
//               <Text style={styles.successValue}>{orderDetails?.orderId || 'ORD-123456'}</Text>
//             </View>
//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Payment Method</Text>
//               <Text style={styles.successValue}>{orderDetails?.paymentMethod || 'Cash on Delivery'}</Text>
//             </View>
//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Total Amount</Text>
//               <Text style={[styles.successValue, styles.successTotal]}>
//                 ₹{orderDetails?.total || 0}
//               </Text>
//             </View>
//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Payment Status</Text>
//               <Text style={[styles.successValue, styles.successStatus]}>
//                 {orderDetails?.paymentStatus || 'Confirmed'}
//               </Text>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.successButton}
//             onPress={onViewOrders}
//           >
//             <Text style={styles.successButtonText}>View My Orders</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.successButtonSecondary}
//             onPress={onContinueShopping}
//           >
//             <Text style={styles.successButtonSecondaryText}>Continue Shopping</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
//   const { 
//     cartItems, 
//     updateQuantity, 
//     removeFromCart, 
//     getTotalPrice, 
//     getTotalItems, 
//     clearCart 
//   } = useContext(CartContext);
  
//   const { addOrder } = useContext(OrderContext);
  
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Razorpay');
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);
  
//   // ✅ State for COD Success Modal
//   const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
//   const [orderDetails, setOrderDetails] = useState<any>(null);

//   useEffect(() => {
//     console.log('🔍 Platform:', Platform.OS);

//     if (Platform.OS === 'web') {
//       const existingScript = document.getElementById('razorpay-checkout-script');
//       if (existingScript) {
//         setIsRazorpayReady(true);
//         return;
//       }

//       const script = document.createElement('script');
//       script.id = 'razorpay-checkout-script';
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.async = true;
//       script.onload = () => {
//         console.log('✅ Razorpay web script loaded');
//         setIsRazorpayReady(true);
//       };
//       script.onerror = () => {
//         console.error('❌ Failed to load Razorpay web script');
//         setIsRazorpayReady(false);
//       };
//       document.body.appendChild(script);
//       return;
//     }

//     console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
//     console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);

//     if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
//       console.warn('⚠️ RazorpayCheckout is not available');
//       setIsRazorpayReady(false);
//     } else {
//       console.log('✅ RazorpayCheckout is ready');
//       setIsRazorpayReady(true);
//     }
//   }, []);

//   const handleUpdateQuantity = (item: any, newQuantity: number) => {
//     if (newQuantity === 0) {
//       removeFromCart(item.id, item.restaurantId);
//     } else {
//       updateQuantity(item.id, item.restaurantId, newQuantity);
//     }
//   };

//   const handleRemoveItem = (item: any) => {
//     Alert.alert(
//       'Remove Item',
//       `Are you sure you want to remove ${item.name} from your cart?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
//       ]
//     );
//   };

//   const calculateTotal = () => {
//     const subtotal = getTotalPrice();
//     const tax = Math.round(subtotal * 0.18);
//     const total = subtotal + tax;
//     return { subtotal, tax, total };
//   };

//   // ✅ Handle Cash on Delivery - Adds order to OrderContext
//   const handleCashOnDelivery = () => {
//     if (cartItems.length === 0) {
//       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
//       return;
//     }

//     const { total } = calculateTotal();
//     const orderId = 'ORD-' + Date.now().toString().slice(-6);

//     // ✅ Add order to OrderContext
//     const newOrder = {
//       id: orderId,
//       restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
//       items: cartItems.map(item => ({
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price,
//       })),
//       total: total,
//       status: 'Placed' as const,
//       createdAt: new Date().toISOString(),
//     };
    
//     addOrder(newOrder);
//     console.log('✅ Order added (COD):', newOrder);

//     // Show success modal
//     setOrderDetails({
//       orderId: orderId,
//       total: total,
//       items: cartItems,
//       paymentMethod: 'Cash on Delivery',
//       paymentStatus: 'Confirmed',
//     });
//     setShowSuccessModal(true);
//     clearCart();
//   };

//   // ✅ Handle Success Modal - View Orders
//   const handleViewOrders = () => {
//     setShowSuccessModal(false);
//     setOrderDetails(null);
//     navigation.navigate('Orders');
//   };

//   // ✅ Handle Success Modal - Continue Shopping
//   const handleContinueShopping = () => {
//     setShowSuccessModal(false);
//     setOrderDetails(null);
//     navigation.navigate('Home');
//   };

//   // ✅ Handle Razorpay Payment - Adds order to OrderContext
//   const handleRazorpayPayment = async () => {
//     if (cartItems.length === 0) {
//       Alert.alert('Cart is Empty', 'Please add items to your cart first.');
//       return;
//     }

//     if (!isRazorpayReady) {
//       Alert.alert(
//         'Payment Error',
//         'Razorpay is not ready yet. Please wait a moment and try again, or use Cash on Delivery.',
//         [
//           { text: 'OK' },
//           { text: 'Use Cash on Delivery', onPress: () => setSelectedPaymentMethod('Cash on Delivery') },
//         ]
//       );
//       return;
//     }

//     setIsProcessing(true);
//     const { total } = calculateTotal();

//     try {
//       const orderResponse = await paymentService.createOrder(total, 'INR');
//       console.log('📦 Order response:', orderResponse);

//       if (!orderResponse.success) {
//         throw new Error(orderResponse.message || 'Failed to create order');
//       }

//       const { order, key } = orderResponse;
//       const amount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount;

//       const options: any = {
//         description: 'QuickBite Order Payment',
//         image: 'https://your-logo-url.com/logo.png',
//         currency: order.currency || 'INR',
//         key: key,
//         amount: amount,
//         name: 'QuickBite',
//         order_id: order.id,
//         prefill: {
//           email: 'customer@example.com',
//           contact: '9876543210',
//           name: 'Customer Name',
//         },
//         theme: { color: '#fc8019' },
//       };

//       console.log('💳 Opening Razorpay with options:', options);

//       const handlePaymentSuccess = async (response: any) => {
//         try {
//           const verifyResponse = await paymentService.verifyPayment(
//             response.razorpay_order_id,
//             response.razorpay_payment_id,
//             response.razorpay_signature,
//             'ORD-' + Date.now().toString().slice(-6)
//           );

//           setIsProcessing(false);

//           if (verifyResponse.success) {
//             // ✅ Add order to OrderContext
//             const newOrder = {
//               id: response.razorpay_order_id || 'ORD-' + Date.now().toString().slice(-6),
//               restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
//               items: cartItems.map(item => ({
//                 name: item.name,
//                 quantity: item.quantity,
//                 price: item.price,
//               })),
//               total: total,
//               status: 'Placed' as const,
//               createdAt: new Date().toISOString(),
//             };
            
//             addOrder(newOrder);
//             console.log('✅ Order added (Razorpay):', newOrder);

//             Alert.alert(
//               'Payment Successful! 🎉',
//               `Payment ID: ${response.razorpay_payment_id}`,
//               [
//                 {
//                   text: 'View Order',
//                   onPress: () => {
//                     navigation.navigate('OrderTracking', {
//                       orderId: response.razorpay_order_id,
//                       total: total,
//                       items: cartItems,
//                       paymentMethod: 'Razorpay',
//                       paymentId: response.razorpay_payment_id,
//                       paymentStatus: 'Paid',
//                     });
//                     clearCart();
//                   },
//                 },
//               ]
//             );
//           } else {
//             Alert.alert('Payment Verification Failed', verifyResponse.message || 'Please contact support.');
//           }
//         } catch (verifyError: any) {
//           setIsProcessing(false);
//           console.error('❌ Verification error:', verifyError);
//           Alert.alert('Verification Failed', 'Please contact support.');
//         }
//       };

//       if (Platform.OS === 'web') {
//         const win = window as any;

//         if (!win.Razorpay) {
//           setIsProcessing(false);
//           Alert.alert('Payment Error', 'Razorpay checkout script did not load. Please refresh and try again.');
//           return;
//         }

//         const rzp = new win.Razorpay({
//           ...options,
//           handler: handlePaymentSuccess,
//           modal: {
//             ondismiss: function () {
//               setIsProcessing(false);
//               Alert.alert('Payment Cancelled', 'You cancelled the payment');
//             },
//           },
//         });

//         rzp.on('payment.failed', function (response: any) {
//           setIsProcessing(false);
//           console.error('❌ Razorpay payment failed:', response.error);
//           Alert.alert('Payment Failed', response.error.description || 'Something went wrong. Please try again.');
//         });

//         rzp.open();
//         return;
//       }

//       RazorpayCheckout.open(options)
//         .then(handlePaymentSuccess)
//         .catch((error: any) => {
//           setIsProcessing(false);
//           console.error('❌ Razorpay error:', error);

//           let errorMessage = 'Something went wrong. Please try again.';
//           let errorTitle = 'Payment Failed';

//           if (error.code === 'PAYMENT_FAILED') {
//             errorMessage = 'Payment failed. Please try again with a different payment method.';
//           } else if (error.code === 'NETWORK_ERROR') {
//             errorMessage = 'Network error. Please check your internet connection.';
//           } else if (error.code === 'CANCELLED') {
//             errorTitle = 'Payment Cancelled';
//             errorMessage = 'You cancelled the payment process.';
//           } else if (error.description) {
//             errorMessage = error.description;
//           } else if (error.message) {
//             errorMessage = error.message;
//           }

//           Alert.alert(errorTitle, errorMessage);
//         });

//     } catch (error: any) {
//       setIsProcessing(false);
//       console.error('❌ Payment error:', error);
//       Alert.alert('Error', error.message || 'Failed to initialize payment.');
//     }
//   };

//   const handlePlaceOrder = () => {
//     if (selectedPaymentMethod === 'Razorpay') {
//       handleRazorpayPayment();
//     } else {
//       handleCashOnDelivery();
//     }
//   };

//   // Render cart item
//   const renderCartItem = ({ item }: { item: any }) => (
//     <View style={styles.cartItem}>
//       <Image 
//         source={{ uri: item.image || 'https://placehold.co/60x60' }} 
//         style={styles.itemImage} 
//       />
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemPrice}>₹{item.price}</Text>
//         <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
//       </View>
//       <View style={styles.quantityContainer}>
//         <TouchableOpacity
//           style={styles.quantityButton}
//           onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
//         >
//           <Icon name="remove" size={16} color="#fc8019" />
//         </TouchableOpacity>
//         <Text style={styles.quantityText}>{item.quantity}</Text>
//         <TouchableOpacity
//           style={styles.quantityButton}
//           onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
//         >
//           <Icon name="add" size={16} color="#fc8019" />
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
//         <Icon name="close-circle" size={20} color="#dc3545" />
//       </TouchableOpacity>
//     </View>
//   );

//   // Render payment method
//   const PaymentMethod = ({ method, icon, description }: { method: string; icon: string; description?: string }) => (
//     <TouchableOpacity
//       style={[
//         styles.paymentMethod,
//         selectedPaymentMethod === method && styles.selectedPaymentMethod,
//       ]}
//       onPress={() => setSelectedPaymentMethod(method)}
//     >
//       <Icon 
//         name={icon} 
//         size={24} 
//         color={selectedPaymentMethod === method ? '#fc8019' : '#7e808c'} 
//       />
//       <View style={styles.paymentMethodInfo}>
//         <Text style={[
//           styles.paymentMethodText, 
//           selectedPaymentMethod === method && styles.selectedPaymentMethodText
//         ]}>
//           {method}
//         </Text>
//         {description && (
//           <Text style={styles.paymentMethodDescription}>{description}</Text>
//         )}
//       </View>
//       {selectedPaymentMethod === method && (
//         <Icon name="checkmark-circle" size={20} color="#28a745" style={styles.checkmark} />
//       )}
//     </TouchableOpacity>
//   );

//   const { subtotal, tax, total } = calculateTotal();

//   // Empty cart view
//   if (cartItems.length === 0 && !showSuccessModal) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Icon name="arrow-back" size={24} color="#282c3f" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Cart</Text>
//           <View style={styles.headerRight} />
//         </View>
//         <View style={styles.emptyContainer}>
//           <Icon name="cart-outline" size={80} color="#ccc" />
//           <Text style={styles.emptyText}>Your cart is empty</Text>
//           <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
//           <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
//             <Text style={styles.shopButtonText}>Start Shopping</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color="#282c3f" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Cart</Text>
//         <TouchableOpacity onPress={() => {
//           Alert.alert(
//             'Clear Cart',
//             'Are you sure you want to clear your cart?',
//             [
//               { text: 'Cancel', style: 'cancel' },
//               { text: 'Clear', style: 'destructive', onPress: clearCart },
//             ]
//           );
//         }}>
//           <Text style={styles.clearText}>Clear</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Cart Items */}
//         <View style={styles.cartItemsContainer}>
//           {cartItems.map((item, index) => (
//             <View key={index}>
//               {renderCartItem({ item })}
//             </View>
//           ))}
//         </View>

//         {/* Order Summary */}
//         <View style={styles.summaryContainer}>
//           <Text style={styles.summaryTitle}>Order Summary</Text>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Subtotal</Text>
//             <Text style={styles.summaryValue}>₹{subtotal}</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Delivery Fee</Text>
//             <Text style={styles.summaryValue}>₹0</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
//             <Text style={styles.summaryValue}>₹{tax}</Text>
//           </View>
//           <View style={[styles.summaryRow, styles.totalRow]}>
//             <Text style={styles.totalLabel}>Total</Text>
//             <Text style={styles.totalValue}>₹{total}</Text>
//           </View>
//         </View>

//         {/* Payment Methods */}
//         <View style={styles.paymentContainer}>
//           <Text style={styles.paymentTitle}>Payment Method</Text>
//           <PaymentMethod 
//             method="Razorpay" 
//             icon="card-outline" 
//             description="Credit/Debit Card, UPI, Net Banking" 
//           />
//           <PaymentMethod 
//             method="Cash on Delivery" 
//             icon="cash-outline" 
//             description="Pay when you receive" 
//           />
//         </View>

//         <View style={styles.footerSpacing} />
//       </ScrollView>

//       {/* Processing Overlay */}
//       {isProcessing && (
//         <View style={styles.overlay}>
//           <View style={styles.processingContainer}>
//             <ActivityIndicator size="large" color="#fc8019" />
//             <Text style={styles.processingText}>Processing Payment...</Text>
//             <Text style={styles.processingSubText}>Please don't close the app</Text>
//           </View>
//         </View>
//       )}

//       {/* ✅ COD Success Modal */}
//       <PaymentSuccessModal
//         visible={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         orderDetails={orderDetails}
//         onViewOrders={handleViewOrders}
//         onContinueShopping={handleContinueShopping}
//       />

//       {/* Checkout Button */}
//       <View style={styles.checkoutContainer}>
//         <View style={styles.checkoutLeft}>
//           <Text style={styles.checkoutTotal}>₹{total}</Text>
//           <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.checkoutButton}
//           onPress={handlePlaceOrder}
//           disabled={isProcessing}
//         >
//           <Text style={styles.checkoutButtonText}>
//             {isProcessing ? 'Processing...' : 'Proceed to Checkout →'}
//           </Text>
//           {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   headerRight: {
//     width: 40,
//   },
//   clearText: {
//     color: '#dc3545',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   cartItemsContainer: {
//     padding: 16,
//   },
//   cartItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     padding: 12,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f5',
//   },
//   itemImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f5',
//   },
//   itemInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   itemName: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#282c3f',
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fc8019',
//     marginTop: 2,
//   },
//   itemRestaurant: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#fc8019',
//     borderRadius: 6,
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 4,
//     marginRight: 8,
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
//   removeButton: {
//     padding: 4,
//   },
//   summaryContainer: {
//     padding: 16,
//     marginHorizontal: 16,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#7e808c',
//   },
//   summaryValue: {
//     fontSize: 14,
//     color: '#282c3f',
//   },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: '#e9ecef',
//     paddingTop: 8,
//     marginTop: 4,
//   },
//   totalLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   totalValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fc8019',
//   },
//   paymentContainer: {
//     padding: 16,
//     marginHorizontal: 16,
//     marginTop: 16,
//   },
//   paymentTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },
//   paymentMethod: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#e9ecef',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   selectedPaymentMethod: {
//     borderColor: '#fc8019',
//     backgroundColor: '#fff8f0',
//   },
//   paymentMethodInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   paymentMethodText: {
//     fontSize: 14,
//     color: '#282c3f',
//   },
//   selectedPaymentMethodText: {
//     color: '#fc8019',
//     fontWeight: '600',
//   },
//   paymentMethodDescription: {
//     fontSize: 11,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   checkmark: {
//     marginLeft: 'auto',
//   },
//   checkoutContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f5',
//     backgroundColor: '#ffffff',
//   },
//   checkoutLeft: {
//     flexDirection: 'column',
//   },
//   checkoutTotal: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#fc8019',
//   },
//   checkoutItems: {
//     fontSize: 12,
//     color: '#7e808c',
//   },
//   checkoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   checkoutButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginRight: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginTop: 16,
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   shopButton: {
//     marginTop: 24,
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   shopButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   footerSpacing: {
//     height: 80,
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   processingContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 30,
//     alignItems: 'center',
//     width: '80%',
//   },
//   processingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginTop: 16,
//   },
//   processingSubText: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginTop: 8,
//   },
//   successOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   successContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 24,
//     padding: 30,
//     width: '90%',
//     maxWidth: 400,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   successIconContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#e8f5e9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   successTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#282c3f',
//     marginBottom: 8,
//   },
//   successSubtitle: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   successDetails: {
//     width: '100%',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//   },
//   successRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },
//   successLabel: {
//     fontSize: 14,
//     color: '#7e808c',
//   },
//   successValue: {
//     fontSize: 14,
//     color: '#282c3f',
//     fontWeight: '500',
//   },
//   successTotal: {
//     color: '#fc8019',
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   successStatus: {
//     color: '#28a745',
//     fontWeight: '600',
//   },
//   successButton: {
//     backgroundColor: '#fc8019',
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   successButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   successButtonSecondary: {
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     width: '100%',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#fc8019',
//   },
//   successButtonSecondaryText: {
//     color: '#fc8019',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default CartScreen;
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// ✅ Import Razorpay with proper error handling
let RazorpayCheckout: any = null;
if (Platform.OS !== 'web') {
  RazorpayCheckout = require('react-native-razorpay').default;
}

import { CartContext } from '../../context/CartContext';
import { OrderContext } from '../../context/OrderContext';
import paymentService from '../../services/paymentService';

interface CartScreenProps {
  navigation: any;
}

// ✅ Payment Success Modal for Cash on Delivery ONLY
const PaymentSuccessModal = ({ visible, onClose, orderDetails, onViewOrders, onContinueShopping }: any) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.successOverlay}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Icon name="checkmark-circle" size={80} color="#28a745" />
          </View>
          <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
          <Text style={styles.successSubtitle}>Your order has been placed successfully</Text>
          
          <View style={styles.successDetails}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Order ID</Text>
              <Text style={styles.successValue}>{orderDetails?.orderId || 'ORD-123456'}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Payment Method</Text>
              <Text style={styles.successValue}>{orderDetails?.paymentMethod || 'Cash on Delivery'}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Total Amount</Text>
              <Text style={[styles.successValue, styles.successTotal]}>
                ₹{orderDetails?.total || 0}
              </Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Payment Status</Text>
              <Text style={[styles.successValue, styles.successStatus]}>
                {orderDetails?.paymentStatus || 'Confirmed'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.successButton}
            onPress={onViewOrders}
          >
            <Text style={styles.successButtonText}>View My Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.successButtonSecondary}
            onPress={onContinueShopping}
          >
            <Text style={styles.successButtonSecondaryText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getTotalItems, 
    clearCart 
  } = useContext(CartContext);
  
  const { addOrder } = useContext(OrderContext);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);
  
  // ✅ State for COD Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    console.log('🔍 Platform:', Platform.OS);

    if (Platform.OS === 'web') {
      const existingScript = document.getElementById('razorpay-checkout-script');
      if (existingScript) {
        setIsRazorpayReady(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Razorpay web script loaded');
        setIsRazorpayReady(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay web script');
        setIsRazorpayReady(false);
      };
      document.body.appendChild(script);
      return;
    }

    console.log('🔍 RazorpayCheckout:', RazorpayCheckout);
    console.log('🔍 RazorpayCheckout.open:', RazorpayCheckout?.open);

    if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
      console.warn('⚠️ RazorpayCheckout is not available');
      setIsRazorpayReady(false);
    } else {
      console.log('✅ RazorpayCheckout is ready');
      setIsRazorpayReady(true);
    }
  }, []);

  const handleUpdateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.id, item.restaurantId);
    } else {
      updateQuantity(item.id, item.restaurantId, newQuantity);
    }
  };

  const handleRemoveItem = (item: any) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${item.name} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id, item.restaurantId) },
      ]
    );
  };

  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // ✅ Handle Cash on Delivery - Adds order to OrderContext
  const handleCashOnDelivery = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    const { total } = calculateTotal();
    const orderId = 'ORD-' + Date.now().toString().slice(-6);

    // ✅ Add order to OrderContext
    const newOrder = {
      id: orderId,
      restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total,
      status: 'Placed' as const,
      createdAt: new Date().toISOString(),
    };
    
    addOrder(newOrder);
    console.log('✅ Order added (COD):', newOrder);

    // Show success modal
    setOrderDetails({
      orderId: orderId,
      total: total,
      items: cartItems,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Confirmed',
    });
    setShowSuccessModal(true);
    clearCart();
  };

  // ✅ Handle Success Modal - View Orders
  const handleViewOrders = () => {
    setShowSuccessModal(false);
    setOrderDetails(null);
    navigation.navigate('Orders');
  };

  // ✅ Handle Success Modal - Continue Shopping
  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    setOrderDetails(null);
    navigation.navigate('Home');
  };

  // ✅ Handle Razorpay Payment - Adds order to OrderContext
  const handleRazorpayPayment = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    if (!isRazorpayReady) {
      Alert.alert(
        'Payment Error',
        'Razorpay is not ready yet. Please wait a moment and try again, or use Cash on Delivery.',
        [
          { text: 'OK' },
          { text: 'Use Cash on Delivery', onPress: () => {
            // Switch to COD and call handleCashOnDelivery directly
            handleCashOnDelivery();
          }},
        ]
      );
      return;
    }

    setIsProcessing(true);
    const { total } = calculateTotal();

    try {
      const orderResponse = await paymentService.createOrder(total, 'INR');
      console.log('📦 Order response:', orderResponse);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const { order, key } = orderResponse;
      const amount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount;

      const options: any = {
        description: 'QuickBite Order Payment',
        image: 'https://your-logo-url.com/logo.png',
        currency: order.currency || 'INR',
        key: key,
        amount: amount,
        name: 'QuickBite',
        order_id: order.id,
        prefill: {
          email: 'customer@example.com',
          contact: '9876543210',
          name: 'Customer Name',
        },
        theme: { color: '#fc8019' },
      };

      console.log('💳 Opening Razorpay with options:', options);

      const handlePaymentSuccess = async (response: any) => {
        try {
          const verifyResponse = await paymentService.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            'ORD-' + Date.now().toString().slice(-6)
          );

          setIsProcessing(false);

          if (verifyResponse.success) {
            // ✅ Add order to OrderContext
            const newOrder = {
              id: response.razorpay_order_id || 'ORD-' + Date.now().toString().slice(-6),
              restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
              items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              total: total,
              status: 'Placed' as const,
              createdAt: new Date().toISOString(),
            };
            
            addOrder(newOrder);
            console.log('✅ Order added (Razorpay):', newOrder);

            Alert.alert(
              'Payment Successful! 🎉',
              `Payment ID: ${response.razorpay_payment_id}`,
              [
                {
                  text: 'View Order',
                  onPress: () => {
                    navigation.navigate('OrderTracking', {
                      orderId: response.razorpay_order_id,
                      total: total,
                      items: cartItems,
                      paymentMethod: 'Razorpay',
                      paymentId: response.razorpay_payment_id,
                      paymentStatus: 'Paid',
                    });
                    clearCart();
                  },
                },
              ]
            );
          } else {
            Alert.alert('Payment Verification Failed', verifyResponse.message || 'Please contact support.');
          }
        } catch (verifyError: any) {
          setIsProcessing(false);
          console.error('❌ Verification error:', verifyError);
          Alert.alert('Verification Failed', 'Please contact support.');
        }
      };

      if (Platform.OS === 'web') {
        const win = window as any;

        if (!win.Razorpay) {
          setIsProcessing(false);
          Alert.alert('Payment Error', 'Razorpay checkout script did not load. Please refresh and try again.');
          return;
        }

        const rzp = new win.Razorpay({
          ...options,
          handler: handlePaymentSuccess,
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              Alert.alert('Payment Cancelled', 'You cancelled the payment');
            },
          },
        });

        rzp.on('payment.failed', function (response: any) {
          setIsProcessing(false);
          console.error('❌ Razorpay payment failed:', response.error);
          Alert.alert('Payment Failed', response.error.description || 'Something went wrong. Please try again.');
        });

        rzp.open();
        return;
      }

      RazorpayCheckout.open(options)
        .then(handlePaymentSuccess)
        .catch((error: any) => {
          setIsProcessing(false);
          console.error('❌ Razorpay error:', error);

          let errorMessage = 'Something went wrong. Please try again.';
          let errorTitle = 'Payment Failed';

          if (error.code === 'PAYMENT_FAILED') {
            errorMessage = 'Payment failed. Please try again with a different payment method.';
          } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your internet connection.';
          } else if (error.code === 'CANCELLED') {
            errorTitle = 'Payment Cancelled';
            errorMessage = 'You cancelled the payment process.';
          } else if (error.description) {
            errorMessage = error.description;
          } else if (error.message) {
            errorMessage = error.message;
          }

          Alert.alert(errorTitle, errorMessage);
        });

    } catch (error: any) {
      setIsProcessing(false);
      console.error('❌ Payment error:', error);
      Alert.alert('Error', error.message || 'Failed to initialize payment.');
    }
  };

  // ✅ Handle Proceed to Checkout - Navigate to Address Selection
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    const { total } = calculateTotal();
    
    // Navigate to Address Selection Screen (in parent Stack Navigator)
    navigation.navigate('AddressSelection', {
      totalAmount: total,
      restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
      cartItems: cartItems,
    });
  };

  // Render cart item
  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.image || 'https://placehold.co/60x60' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
        >
          <Icon name="remove" size={16} color="#fc8019" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
        >
          <Icon name="add" size={16} color="#fc8019" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
        <Icon name="close-circle" size={20} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  const { subtotal, tax, total } = calculateTotal();

  // Empty cart view
  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#282c3f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear your cart?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ]
          );
        }}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item, index) => (
            <View key={index}>
              {renderCartItem({ item })}
            </View>
          ))}
        </View>

        {/* Order Summary - Only summary, NO PAYMENT METHODS */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹0</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
            <Text style={styles.summaryValue}>₹{tax}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        <View style={styles.footerSpacing} />
      </ScrollView>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.overlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#fc8019" />
            <Text style={styles.processingText}>Processing Payment...</Text>
            <Text style={styles.processingSubText}>Please don't close the app</Text>
          </View>
        </View>
      )}

      {/* ✅ COD Success Modal */}
      <PaymentSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderDetails={orderDetails}
        onViewOrders={handleViewOrders}
        onContinueShopping={handleContinueShopping}
      />

      {/* ✅ Checkout Button - Navigates to Address Selection */}
      <View style={styles.checkoutContainer}>
        <View style={styles.checkoutLeft}>
          <Text style={styles.checkoutTotal}>₹{total}</Text>
          <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleProceedToCheckout}
          disabled={isProcessing}
        >
          <Text style={styles.checkoutButtonText}>
            {isProcessing ? 'Processing...' : 'Proceed to Checkout →'}
          </Text>
          {!isProcessing && <Icon name="arrow-forward" size={20} color="#ffffff" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  headerRight: {
    width: 40,
  },
  clearText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
  },
  cartItemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f5',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282c3f',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fc8019',
    marginTop: 2,
  },
  itemRestaurant: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fc8019',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    marginRight: 8,
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
  removeButton: {
    padding: 4,
  },
  summaryContainer: {
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#7e808c',
  },
  summaryValue: {
    fontSize: 14,
    color: '#282c3f',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fc8019',
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f5',
    backgroundColor: '#ffffff',
  },
  checkoutLeft: {
    flexDirection: 'column',
  },
  checkoutTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fc8019',
  },
  checkoutItems: {
    fontSize: 12,
    color: '#7e808c',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fc8019',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 8,
    textAlign: 'center',
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: '#fc8019',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerSpacing: {
    height: 80,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  processingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 16,
  },
  processingSubText: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 8,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#282c3f',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#7e808c',
    marginBottom: 20,
    textAlign: 'center',
  },
  successDetails: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  successLabel: {
    fontSize: 14,
    color: '#7e808c',
  },
  successValue: {
    fontSize: 14,
    color: '#282c3f',
    fontWeight: '500',
  },
  successTotal: {
    color: '#fc8019',
    fontWeight: '700',
    fontSize: 16,
  },
  successStatus: {
    color: '#28a745',
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#fc8019',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  successButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successButtonSecondary: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fc8019',
  },
  successButtonSecondaryText: {
    color: '#fc8019',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CartScreen;