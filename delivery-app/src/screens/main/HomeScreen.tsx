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
// import { businessAPI } from '../../api/endpoints';
// import { Picker } from '@react-native-picker/picker'

// const { width } = Dimensions.get('window');

// export default function HomeScreen({ navigation }: any) {
//   const [searchText, setSearchText] = useState<string>('');
//   const [products, setProducts] = useState<any[]>([]);
//   const { user } = useContext(AuthContext);
//   const [businesses, setBusinesses] = useState<any[]>([]);
//   const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

//   useEffect(() => {
//     businessAPI.getBusinesses({})
//       .then((res: any) => setBusinesses(res.data))
//       .catch((err: any) => console.error('Failed to load businesses:', err));
//   }, []);

//   useEffect(() => {
//     if (!selectedBusinessId) {
//       setProducts([]);
//       return;
//     }
//     axios.get(`${API_URL}/public/products`, { params: { business_id: selectedBusinessId } })
//       .then((res) => setProducts(res.data))
//       .catch((err) => console.error('Failed to load products:', err));
//   }, [selectedBusinessId]);

//   useEffect(() => {
//     console.log('========================================');
//     console.log('🏪 USER OBJECT:', user);
//     console.log('🏪 BUSINESS NAME:', user?.business_name);
//     console.log('========================================');
//   }, [user]);

//   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

//   const renderOffer = ({ item }: { item: Offer }) => (
//     <View style={styles.offerCard}>
//       <Text style={styles.offerTitle}>{item.title}</Text>
//       <Text style={styles.offerDescription}>{item.description}</Text>
//     </View>
//   );

   
//   useEffect(() => {
//   businessAPI.getBusinesses({})
//     .then((res: any) => setBusinesses(res.data))
//     .catch((err: any) => console.error('Failed to load businesses:', err));
// }, []);
// useEffect(() => {
//   if (!selectedBusinessId) {
//     setProducts([]);
//     return;
//   }
//   axios.get(`${API_URL}/public/products`, { params: { business_id: selectedBusinessId } })
//     .then((res) => setProducts(res.data))
//     .catch((err) => console.error('Failed to load products:', err));
// }, [selectedBusinessId]);

//   // ✅ Get business name from user
//   const businessName = user?.business_name || 'No Business Found';
//   const plan = user?.business_plan || 'FREE';
//   const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.locationLabel}>📍 Home</Text>
//           <Text style={styles.location}>Sector 1, HSR Layout</Text>
          
//           {/* ✅ Business Card - Shows the latest business from database */}
//           <View style={styles.businessCard}>
//             <View style={styles.businessCardContent}>
//               <Icon name="business-outline" size={16} color={colors.primary} />
//               <Text style={styles.businessName}>{displayName}</Text>
//               {user?.business_name && user.business_name !== 'No Business Found' && (
//                 <View style={styles.businessBadge}>
//                   <Text style={styles.businessBadgeText}>{plan}</Text>
//                 </View>
//               )}
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
//       {/* Offers Section */}
//       {/* @ts-ignore */}
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
//          <Text style={styles.sectionTitle}>What's on your mind?</Text>
//         {/* @ts-ignore */}
//         <FlatList
//           data={categories}
//           renderItem={renderCategory}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.categoriesList}
//         />
//       </View>
     
//      <View style={styles.restaurantsSection}>
//   <Text style={styles.sectionTitle}>Select a shop</Text>
//   <View style={{ backgroundColor: colors.lightGray, borderRadius: 12 }}>
//     <Picker
//       selectedValue={selectedBusinessId}
//       onValueChange={(value) => setSelectedBusinessId(value)}
//     >
//       <Picker.Item label="-- Choose a shop --" value={null} />
//       {businesses.map((biz: any) => (
//         <Picker.Item key={biz.id} label={biz.business_name} value={biz.id} />
//       ))}
//     </Picker>
//   </View>
// </View>
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

//       <View style={styles.restaurantsSection}>
//   <Text style={styles.sectionTitle}>Stores near you</Text>
//   {businesses.map((biz: any) => (
//     <TouchableOpacity
//       key={biz.id}
//       style={styles.offerCard2}
//       onPress={() => navigation.navigate('Search', { businessId: biz.id, businessName: biz.business_name })}
//     >
//       <Text style={styles.productName}>{biz.business_name}</Text>
//       <Text style={styles.productCategory}>{biz.business_type}</Text>
//     </TouchableOpacity>
//   ))}
// </View>
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
import { businessAPI } from '../../api/endpoints';
import { Picker } from '@react-native-picker/picker';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';


const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const { user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const { setSelectedBusiness } = useContext(SelectedBusinessContext);


  // Load all businesses once, on mount
  useEffect(() => {
    businessAPI.getBusinesses({})
      .then((res: any) => setBusinesses(res.data))
      .catch((err: any) => console.error('Failed to load businesses:', err));
  }, []);

  // Load products ONLY for the selected shop (single source of truth — no duplicate effect)
  useEffect(() => {
    if (!selectedBusinessId) {
      setProducts([]);
      return;
    }
    axios.get(`${API_URL}/public/products`, { params: { business_id: selectedBusinessId } })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products:', err));
  }, [selectedBusinessId]);

  useEffect(() => {
    console.log('🏪 USER OBJECT:', user);
  }, [user]);

  const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

  const renderOffer = ({ item }: { item: Offer }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>{item.description}</Text>
    </View>
  );

  // Get business name from logged-in user (for the header card)
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

      {/* Search Bar — general, cross-store search (bottom tab does the same) */}
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
      {/* @ts-ignore */}
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
        {/* @ts-ignore */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Shop selector */}
      <View style={styles.restaurantsSection}>
        <Text style={styles.sectionTitle}>Select a shop</Text>
        <View style={{ backgroundColor: colors.lightGray, borderRadius: 12 }}>
          <Picker
            selectedValue={selectedBusinessId}
            onValueChange={(value) => setSelectedBusinessId(value)}
          >
            <Picker.Item label="-- Choose a shop --" value={null} />
            {businesses.map((biz: any) => (
              <Picker.Item key={biz.id} label={biz.business_name} value={biz.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Products — filtered to selectedBusinessId only */}
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

      {/* Stores near you — tapping navigates to Search pre-filtered to that shop */}
      <View style={styles.restaurantsSection}>
        <Text style={styles.sectionTitle}>Stores near you</Text>
        {businesses.map((biz: any) => (
         <TouchableOpacity
  key={biz.id}
  style={styles.offerCard2}
  onPress={() => {
    setSelectedBusiness({ id: biz.id, name: biz.business_name });
    navigation.navigate('Search', { businessId: biz.id, businessName: biz.business_name });
  }}
>
            <Text style={styles.productName}>{biz.business_name}</Text>
            <Text style={styles.productCategory}>{biz.business_type}</Text>
          </TouchableOpacity>
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