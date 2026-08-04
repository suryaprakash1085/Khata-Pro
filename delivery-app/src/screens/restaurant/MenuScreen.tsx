// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { MenuItem } from '../../types';

// interface MenuScreenProps {
//   route: any;
//   navigation: any;
// }

// export default function MenuScreen({ route, navigation }: MenuScreenProps) {
//   const { restaurantId, restaurantName } = route.params || {};
//   const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const categories: string[] = ['Recommended', 'Soups', 'Starters', 'Main Course', 'Breads', 'Rice', 'Desserts'];

//   const mockMenu: MenuItem[] = [
//     { id: '1', name: 'Paneer Butter Masala', price: 185, rating: 4.5, reviews: 100, isBestSeller: true, category: 'Main Course', description: 'Creamy paneer in rich tomato gravy', image: 'https://via.placeholder.com/150', isVeg: true },
//     { id: '2', name: 'Dal Makhani', price: 150, rating: 4.3, reviews: 80, isBestSeller: false, category: 'Main Course', description: 'Slow cooked black lentils', image: 'https://via.placeholder.com/150', isVeg: true },
//     { id: '3', name: 'Garlic Naan', price: 45, rating: 4.2, reviews: 50, isBestSeller: false, category: 'Breads', description: 'Fresh baked naan with garlic', image: 'https://via.placeholder.com/150', isVeg: true },
//     { id: '4', name: 'Butter Chicken', price: 210, rating: 4.6, reviews: 120, isBestSeller: true, category: 'Main Course', description: 'Tender chicken in creamy tomato sauce', image: 'https://via.placeholder.com/150', isVeg: false },
//     { id: '5', name: 'Veg Biryani', price: 160, rating: 4.1, reviews: 60, isBestSeller: false, category: 'Rice', description: 'Fragrant basmati rice with vegetables', image: 'https://via.placeholder.com/150', isVeg: true },
//     { id: '6', name: 'Chicken Biryani', price: 190, rating: 4.4, reviews: 90, isBestSeller: true, category: 'Rice', description: 'Fragrant basmati rice with chicken', image: 'https://via.placeholder.com/150', isVeg: false },
//     { id: '7', name: 'Gulab Jamun', price: 80, rating: 4.0, reviews: 40, isBestSeller: false, category: 'Desserts', description: 'Soft milk dumplings in sugar syrup', image: 'https://via.placeholder.com/150', isVeg: true },
//     { id: '8', name: 'Ras Malai', price: 90, rating: 4.1, reviews: 45, isBestSeller: false, category: 'Desserts', description: 'Cottage cheese dumplings in creamy milk', image: 'https://via.placeholder.com/150', isVeg: true },
//   ];

//   useEffect(() => {
//     setTimeout(() => {
//       setMenuItems(mockMenu);
//       setLoading(false);
//     }, 500);
//   }, []);

//   const filteredItems: MenuItem[] = selectedCategory === 'Recommended' 
//     ? menuItems 
//     : menuItems.filter(item => item.category === selectedCategory);

//   const renderCategory = ({ item }: { item: string }) => (
//     <TouchableOpacity
//       style={[styles.categoryTab, selectedCategory === item && styles.activeCategoryTab]}
//       onPress={() => setSelectedCategory(item)}
//     >
//       <Text style={[styles.categoryTabText, selectedCategory === item && styles.activeCategoryTabText]}>
//         {item}
//       </Text>
//     </TouchableOpacity>
//   );

//   const renderMenuItem = ({ item }: { item: MenuItem }) => (
//     <View style={styles.menuItem}>
//       <View style={styles.menuItemContent}>
//         <View style={styles.menuItemInfo}>
//           <View style={styles.menuItemHeader}>
//             <Text style={styles.menuItemName}>{item.name}</Text>
//             {item.isBestSeller && (
//               <View style={styles.bestsellerBadge}>
//                 <Text style={styles.bestsellerText}>BESTSELLER</Text>
//               </View>
//             )}
//           </View>
//           <Text style={styles.menuItemPrice}>₹{item.price}</Text>
//           <View style={styles.menuItemRating}>
//             <Icon name="star" size={14} color="#ffc107" />
//             <Text style={styles.ratingText}>{item.rating}</Text>
//           </View>
//           {item.description && (
//             <Text style={styles.menuItemDescription} numberOfLines={2}>
//               {item.description}
//             </Text>
//           )}
//         </View>
//         <TouchableOpacity style={styles.addButton}>
//           <Text style={styles.addButtonText}>ADD</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.divider} />
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={styles.loadingText}>Loading menu...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{restaurantName || 'Menu'}</Text>
//         <View style={styles.headerRight} />
//       </View>

//       <View style={styles.categoriesContainer}>
//         <FlatList
//           data={categories}
//           renderItem={renderCategory}
//           keyExtractor={(item) => item}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoriesList}
//         />
//       </View>

//       <FlatList
//         data={filteredItems}
//         renderItem={renderMenuItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.menuList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="restaurant-outline" size={60} color={colors.gray} />
//             <Text style={styles.emptyText}>No items in this category</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     color: colors.textLight,
//     fontSize: 14,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     paddingTop: 40,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//   },
//   headerRight: {
//     width: 32,
//   },
//   categoriesContainer: {
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//     paddingVertical: 8,
//   },
//   categoriesList: {
//     paddingHorizontal: 16,
//   },
//   categoryTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     borderRadius: 20,
//     backgroundColor: colors.lightGray,
//   },
//   activeCategoryTab: {
//     backgroundColor: colors.primary,
//   },
//   categoryTabText: {
//     fontSize: 13,
//     color: colors.text,
//   },
//   activeCategoryTabText: {
//     color: colors.white,
//   },
//   menuList: {
//     padding: 16,
//     paddingBottom: 80,
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
//     color: colors.text,
//   },
//   bestsellerBadge: {
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
//   },
//   menuItemPrice: {
//     fontSize: 14,
//     color: colors.text,
//     marginTop: 4,
//   },
//   menuItemRating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   ratingText: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginLeft: 4,
//   },
//   menuItemDescription: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginTop: 4,
//   },
//   addButton: {
//     borderWidth: 1,
//     borderColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   addButtonText: {
//     color: colors.primary,
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: colors.border,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: colors.textLight,
//     marginTop: 12,
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { MenuItem } from '../../types';

interface MenuScreenProps {
  route: any;
  navigation: any;
}

export default function MenuScreen({ route, navigation }: MenuScreenProps) {
  const { restaurantId, restaurantName } = route.params || {};
  const [selectedCategory, setSelectedCategory] = useState<string>('Recommended');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories: string[] = ['Recommended', 'Soups', 'Starters', 'Main Course', 'Breads', 'Rice', 'Desserts'];

  const mockMenu: MenuItem[] = [
    { id: '1', name: 'Paneer Butter Masala', price: 185, rating: 4.5, reviews: 100, isBestSeller: true, category: 'Main Course', description: 'Creamy paneer in rich tomato gravy', image: 'https://via.placeholder.com/150', isVeg: true },
    { id: '2', name: 'Dal Makhani', price: 150, rating: 4.3, reviews: 80, isBestSeller: false, category: 'Main Course', description: 'Slow cooked black lentils', image: 'https://via.placeholder.com/150', isVeg: true },
    { id: '3', name: 'Garlic Naan', price: 45, rating: 4.2, reviews: 50, isBestSeller: false, category: 'Breads', description: 'Fresh baked naan with garlic', image: 'https://via.placeholder.com/150', isVeg: true },
    { id: '4', name: 'Butter Chicken', price: 210, rating: 4.6, reviews: 120, isBestSeller: true, category: 'Main Course', description: 'Tender chicken in creamy tomato sauce', image: 'https://via.placeholder.com/150', isVeg: false },
    { id: '5', name: 'Veg Biryani', price: 160, rating: 4.1, reviews: 60, isBestSeller: false, category: 'Rice', description: 'Fragrant basmati rice with vegetables', image: 'https://via.placeholder.com/150', isVeg: true },
    { id: '6', name: 'Chicken Biryani', price: 190, rating: 4.4, reviews: 90, isBestSeller: true, category: 'Rice', description: 'Fragrant basmati rice with chicken', image: 'https://via.placeholder.com/150', isVeg: false },
    { id: '7', name: 'Gulab Jamun', price: 80, rating: 4.0, reviews: 40, isBestSeller: false, category: 'Desserts', description: 'Soft milk dumplings in sugar syrup', image: 'https://via.placeholder.com/150', isVeg: true },
    { id: '8', name: 'Ras Malai', price: 90, rating: 4.1, reviews: 45, isBestSeller: false, category: 'Desserts', description: 'Cottage cheese dumplings in creamy milk', image: 'https://via.placeholder.com/150', isVeg: true },
  ];

  useEffect(() => {
    setTimeout(() => {
      setMenuItems(mockMenu);
      setLoading(false);
    }, 500);
  }, []);

  const filteredItems: MenuItem[] = selectedCategory === 'Recommended' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryTab, selectedCategory === item && styles.activeCategoryTab]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryTabText, selectedCategory === item && styles.activeCategoryTabText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemInfo}>
          <View style={styles.menuItemHeader}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            {item.isBestSeller && (
              <View style={styles.bestsellerBadge}>
                <Text style={styles.bestsellerText}>BESTSELLER</Text>
              </View>
            )}
          </View>
          <Text style={styles.menuItemPrice}>₹{item.price}</Text>
          <View style={styles.menuItemRating}>
            <Icon name="star" size={14} color="#ffc107" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          {item.description && (
            <Text style={styles.menuItemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{restaurantName || 'Menu'}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="restaurant-outline" size={60} color={colors.gray} />
            <Text style={styles.emptyText}>No items in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textLight,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 32,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
  },
  activeCategoryTab: {
    backgroundColor: colors.primary,
  },
  categoryTabText: {
    fontSize: 13,
    color: colors.text,
  },
  activeCategoryTabText: {
    color: colors.white,
  },
  menuList: {
    padding: 16,
    paddingBottom: 80,
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
    color: colors.text,
  },
  bestsellerBadge: {
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
  },
  menuItemPrice: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  menuItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 12,
  },
});