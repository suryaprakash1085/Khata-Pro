// // import React, { useState, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Image,
// //   Alert,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { colors } from '../../constants/colors';
// // import { CartContext } from '../../context/CartContext';
// // import { MenuItem, Restaurant } from '../../types';

// // export default function FoodDetailScreen({ route, navigation }: any){
// //   const { item, restaurant } = route.params || {};
// //   const { addToCart } = useContext(CartContext);
// //   const [quantity, setQuantity] = useState<number>(1);

// //   const foodItem: MenuItem = item || {
// //     id: '1',
// //     name: 'Korean BBQ Chicken Burger',
// //     price: 330,
// //     rating: 4.5,
// //     reviews: 5000,
// //     description: 'Fried chicken, Asian coleslaw with sweet-spicy Korean BBQ glaze',
// //     image: 'https://via.placeholder.com/150',
// //     isBestSeller: true,
// //     isVeg: false,
// //     category: 'Burgers',
// //   };

// //   const restaurantData: Restaurant = restaurant || {
// //     id: '1',
// //     name: 'Burger Craft',
// //     rating: 4.5,
// //     deliveryTime: '30-35 mins',
// //     cuisine: 'Burgers',
// //     image: 'https://via.placeholder.com/150',
// //     costForTwo: '₹800 for two',
// //     address: 'Sector 1, HSR Layout',
// //     isVeg: false,
// //   };

// //   const handleAddToCart = (): void => {
// //     const cartItem = {
// //       id: foodItem.id,
// //       name: foodItem.name,
// //       price: foodItem.price,
// //       quantity: quantity,
// //       image: foodItem.image,
// //       restaurantId: restaurantData.id,
// //       restaurantName: restaurantData.name,
// //     };
// //     addToCart(cartItem, restaurantData);
// //     Alert.alert('Added to Cart', `${foodItem.name} added to your cart`);
// //     navigation.goBack();
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         {/* Image */}
// //         <View style={styles.imageContainer}>
// //           <Image
// //             source={{ uri: foodItem.image || 'https://via.placeholder.com/400x300' }}
// //             style={styles.foodImage}
// //           />
// //           <TouchableOpacity
// //             style={styles.backButton}
// //             onPress={() => navigation.goBack()}
// //           >
// //             <Icon name="arrow-back" size={24} color={colors.white} />
// //           </TouchableOpacity>
// //         </View>

// //         {/* Details */}
// //         <View style={styles.detailsContainer}>
// //           <View style={styles.header}>
// //             <View style={styles.titleContainer}>
// //               <Text style={styles.foodName}>{foodItem.name}</Text>
// //               {foodItem.isBestSeller && (
// //                 <View style={styles.bestsellerBadge}>
// //                   <Text style={styles.bestsellerText}>BESTSELLER</Text>
// //                 </View>
// //               )}
// //             </View>
// //             <View style={styles.ratingContainer}>
// //               <Icon name="star" size={16} color="#ffc107" />
// //               <Text style={styles.ratingText}>{foodItem.rating || 4.5}</Text>
// //               <Text style={styles.reviewsText}>({foodItem.reviews || 5000}+ ratings)</Text>
// //             </View>
// //           </View>

// //           <Text style={styles.price}>₹{foodItem.price}</Text>
// //           <Text style={styles.description}>{foodItem.description || 'Delicious food item'}</Text>

// //           {/* Quantity */}
// //           <View style={styles.quantitySection}>
// //             <Text style={styles.sectionTitle}>Quantity</Text>
// //             <View style={styles.quantityContainer}>
// //               <TouchableOpacity
// //                 style={styles.quantityButton}
// //                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
// //               >
// //                 <Icon name="remove" size={20} color={colors.primary} />
// //               </TouchableOpacity>
// //               <Text style={styles.quantityText}>{quantity}</Text>
// //               <TouchableOpacity
// //                 style={styles.quantityButton}
// //                 onPress={() => setQuantity(quantity + 1)}
// //               >
// //                 <Icon name="add" size={20} color={colors.primary} />
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </ScrollView>

// //       {/* Add to Cart Button */}
// //       <View style={styles.footer}>
// //         <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
// //           <Text style={styles.addToCartText}>
// //             Add Item • ₹{foodItem.price * quantity}
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: colors.white,
// //   },
// //   imageContainer: {
// //     position: 'relative',
// //     height: 250,
// //   },
// //   foodImage: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   backButton: {
// //     position: 'absolute',
// //     top: 40,
// //     left: 16,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     borderRadius: 20,
// //     padding: 8,
// //   },
// //   detailsContainer: {
// //     padding: 16,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'flex-start',
// //   },
// //   titleContainer: {
// //     flex: 1,
// //   },
// //   foodName: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: colors.text,
// //   },
// //   bestsellerBadge: {
// //     backgroundColor: '#fff8e1',
// //     paddingHorizontal: 10,
// //     paddingVertical: 2,
// //     borderRadius: 4,
// //     marginTop: 4,
// //     alignSelf: 'flex-start',
// //   },
// //   bestsellerText: {
// //     fontSize: 10,
// //     color: '#ff6f00',
// //     fontWeight: '600',
// //   },
// //   ratingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   ratingText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 4,
// //     color: colors.text,
// //   },
// //   reviewsText: {
// //     fontSize: 12,
// //     color: colors.textLight,
// //     marginLeft: 4,
// //   },
// //   price: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: colors.primary,
// //     marginTop: 8,
// //   },
// //   description: {
// //     fontSize: 14,
// //     color: colors.textLight,
// //     marginTop: 12,
// //     lineHeight: 20,
// //   },
// //   quantitySection: {
// //     marginTop: 20,
// //     paddingTop: 16,
// //     borderTopWidth: 1,
// //     borderTopColor: colors.border,
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: colors.text,
// //     marginBottom: 12,
// //   },
// //   quantityContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },
// //   quantityButton: {
// //     width: 40,
// //     height: 40,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: colors.primary,
// //     borderRadius: 20,
// //   },
// //   quantityText: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginHorizontal: 20,
// //     color: colors.text,
// //   },
// //   footer: {
// //     padding: 16,
// //     backgroundColor: colors.white,
// //     borderTopWidth: 1,
// //     borderTopColor: colors.border,
// //   },
// //   addToCartButton: {
// //     backgroundColor: colors.primary,
// //     borderRadius: 12,
// //     height: 50,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   addToCartText: {
// //     color: colors.white,
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });
// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { CartContext } from '../../context/CartContext';
// import { MenuItem, Restaurant } from '../../types';

// export default function FoodDetailScreen({ route, navigation }: any) {
//   const { item, restaurant } = route.params || {};
//   const { addToCart } = useContext(CartContext);
//   const [quantity, setQuantity] = useState<number>(1);

//   const foodItem: MenuItem = item || {
//     id: '1',
//     name: 'Korean BBQ Chicken Burger',
//     price: 330,
//     rating: 4.5,
//     reviews: 5000,
//     description: 'Fried chicken, Asian coleslaw with sweet-spicy Korean BBQ glaze',
//     image: 'https://via.placeholder.com/150',
//     isBestSeller: true,
//     isVeg: false,
//     category: 'Burgers',
//   };

//   const restaurantData: Restaurant = restaurant || {
//     id: '1',
//     name: 'Burger Craft',
//     rating: 4.5,
//     deliveryTime: '30-35 mins',
//     cuisine: 'Burgers',
//     image: 'https://via.placeholder.com/150',
//     costForTwo: '₹800 for two',
//     address: 'Sector 1, HSR Layout',
//     isVeg: false,
//   };

//   const handleAddToCart = (): void => {
//     // Convert string IDs to numbers
//     const cartItem = {
//       id: parseInt(foodItem.id, 10), // Convert to number
//       name: foodItem.name,
//       price: foodItem.price,
//       quantity: quantity,
//       image: foodItem.image,
//       restaurantId: parseInt(restaurantData.id, 10), // Convert to number
//       restaurantName: restaurantData.name,
//     };
//     addToCart(cartItem, restaurantData);
//     Alert.alert('Added to Cart', `${foodItem.name} added to your cart`);
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Image */}
//         <View style={styles.imageContainer}>
//           <Image
//             source={{ uri: foodItem.image || 'https://via.placeholder.com/400x300' }}
//             style={styles.foodImage}
//           />
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Icon name="arrow-back" size={24} color={colors.white} />
//           </TouchableOpacity>
//         </View>

//         {/* Details */}
//         <View style={styles.detailsContainer}>
//           <View style={styles.header}>
//             <View style={styles.titleContainer}>
//               <Text style={styles.foodName}>{foodItem.name}</Text>
//               {foodItem.isBestSeller && (
//                 <View style={styles.bestsellerBadge}>
//                   <Text style={styles.bestsellerText}>BESTSELLER</Text>
//                 </View>
//               )}
//             </View>
//             <View style={styles.ratingContainer}>
//               <Icon name="star" size={16} color="#ffc107" />
//               <Text style={styles.ratingText}>{foodItem.rating || 4.5}</Text>
//               <Text style={styles.reviewsText}>({foodItem.reviews || 5000}+ ratings)</Text>
//             </View>
//           </View>

//           <Text style={styles.price}>₹{foodItem.price}</Text>
//           <Text style={styles.description}>{foodItem.description || 'Delicious food item'}</Text>

//           {/* Quantity */}
//           <View style={styles.quantitySection}>
//             <Text style={styles.sectionTitle}>Quantity</Text>
//             <View style={styles.quantityContainer}>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() => setQuantity(Math.max(1, quantity - 1))}
//               >
//                 <Icon name="remove" size={20} color={colors.primary} />
//               </TouchableOpacity>
//               <Text style={styles.quantityText}>{quantity}</Text>
//               <TouchableOpacity
//                 style={styles.quantityButton}
//                 onPress={() => setQuantity(quantity + 1)}
//               >
//                 <Icon name="add" size={20} color={colors.primary} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Add to Cart Button */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
//           <Text style={styles.addToCartText}>
//             Add Item • ₹{foodItem.price * quantity}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   imageContainer: {
//     position: 'relative',
//     height: 250,
//   },
//   foodImage: {
//     width: '100%',
//     height: '100%',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40,
//     left: 16,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20,
//     padding: 8,
//   },
//   detailsContainer: {
//     padding: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   titleContainer: {
//     flex: 1,
//   },
//   foodName: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: colors.text,
//   },
//   bestsellerBadge: {
//     backgroundColor: '#fff8e1',
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginTop: 4,
//     alignSelf: 'flex-start',
//   },
//   bestsellerText: {
//     fontSize: 10,
//     color: '#ff6f00',
//     fontWeight: '600',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 4,
//     color: colors.text,
//   },
//   reviewsText: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginLeft: 4,
//   },
//   price: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: colors.primary,
//     marginTop: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: colors.textLight,
//     marginTop: 12,
//     lineHeight: 20,
//   },
//   quantitySection: {
//     marginTop: 20,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//     marginBottom: 12,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   quantityButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.primary,
//     borderRadius: 20,
//   },
//   quantityText: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginHorizontal: 20,
//     color: colors.text,
//   },
//   footer: {
//     padding: 16,
//     backgroundColor: colors.white,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   addToCartButton: {
//     backgroundColor: colors.primary,
//     borderRadius: 12,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addToCartText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { CartContext } from '../../context/CartContext';
import { MenuItem, Restaurant } from '../../types';

export default function FoodDetailScreen({ route, navigation }: any) {
  const { item, restaurant } = route.params || {};
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState<number>(1);

  const foodItem: MenuItem = item || {
    id: '1',
    name: 'Korean BBQ Chicken Burger',
    price: 330,
    rating: 4.5,
    reviews: 5000,
    description: 'Fried chicken, Asian coleslaw with sweet-spicy Korean BBQ glaze',
    image: 'https://via.placeholder.com/150',
    isBestSeller: true,
    isVeg: false,
    category: 'Burgers',
  };

  const restaurantData: Restaurant = restaurant || {
    id: '1',
    name: 'Burger Craft',
    rating: 4.5,
    deliveryTime: '30-35 mins',
    cuisine: 'Burgers',
    image: 'https://via.placeholder.com/150',
    costForTwo: '₹800 for two',
    address: 'Sector 1, HSR Layout',
    isVeg: false,
  };

  const handleAddToCart = (): void => {
    // No need to convert - all IDs are strings now
    const cartItem = {
      id: foodItem.id,
      name: foodItem.name,
      price: foodItem.price,
      quantity: quantity,
      image: foodItem.image,
      restaurantId: restaurantData.id,
      restaurantName: restaurantData.name,
    };
    addToCart(cartItem, restaurantData);
    Alert.alert('Added to Cart', `${foodItem.name} added to your cart`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: foodItem.image || 'https://via.placeholder.com/400x300' }}
            style={styles.foodImage}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.foodName}>{foodItem.name}</Text>
              {foodItem.isBestSeller && (
                <View style={styles.bestsellerBadge}>
                  <Text style={styles.bestsellerText}>BESTSELLER</Text>
                </View>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#ffc107" />
              <Text style={styles.ratingText}>{foodItem.rating || 4.5}</Text>
              <Text style={styles.reviewsText}>({foodItem.reviews || 5000}+ ratings)</Text>
            </View>
          </View>

          <Text style={styles.price}>₹{foodItem.price}</Text>
          <Text style={styles.description}>{foodItem.description || 'Delicious food item'}</Text>

          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon name="remove" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Icon name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>
            Add Item • ₹{foodItem.price * quantity}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  detailsContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  bestsellerBadge: {
    backgroundColor: '#fff8e1',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  bestsellerText: {
    fontSize: 10,
    color: '#ff6f00',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    color: colors.text,
  },
  reviewsText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 12,
    lineHeight: 20,
  },
  quantitySection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    color: colors.text,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});