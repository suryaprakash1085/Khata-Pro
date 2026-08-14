// // // // // // // // import React, { useState, useEffect, useContext } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   ScrollView,
// // // // // // // //   TextInput,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   FlatList,
// // // // // // // //   StyleSheet,
// // // // // // // //   Dimensions,
// // // // // // // // } from 'react-native';
// // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // import { colors } from '../../constants/colors';
// // // // // // // // import { categories, offers } from '../../constants/dummyData';
// // // // // // // // import axios from 'axios';
// // // // // // // // import { API_URL } from '@env';
// // // // // // // // import CategoryItem from '../../components/home/CategoryItem';
// // // // // // // // import { Category, Offer } from '../../types';
// // // // // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // // // // import { businessAPI } from '../../api/endpoints';
// // // // // // // // import { Picker } from '@react-native-picker/picker'

// // // // // // // // const { width } = Dimensions.get('window');

// // // // // // // // export default function HomeScreen({ navigation }: any) {
// // // // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // // // //   const [products, setProducts] = useState<any[]>([]);
// // // // // // // //   const { user } = useContext(AuthContext);
// // // // // // // //   const [businesses, setBusinesses] = useState<any[]>([]);
// // // // // // // //   const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

// // // // // // // //   useEffect(() => {
// // // // // // // //     businessAPI.getBusinesses({})
// // // // // // // //       .then((res: any) => setBusinesses(res.data))
// // // // // // // //       .catch((err: any) => console.error('Failed to load businesses:', err));
// // // // // // // //   }, []);

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (!selectedBusinessId) {
// // // // // // // //       setProducts([]);
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     axios.get(`${API_URL}/public/products`, { params: { business_id: selectedBusinessId } })
// // // // // // // //       .then((res) => setProducts(res.data))
// // // // // // // //       .catch((err) => console.error('Failed to load products:', err));
// // // // // // // //   }, [selectedBusinessId]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     console.log('========================================');
// // // // // // // //     console.log('🏪 USER OBJECT:', user);
// // // // // // // //     console.log('🏪 BUSINESS NAME:', user?.business_name);
// // // // // // // //     console.log('========================================');
// // // // // // // //   }, [user]);

// // // // // // // //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// // // // // // // //   const renderOffer = ({ item }: { item: Offer }) => (
// // // // // // // //     <View style={styles.offerCard}>
// // // // // // // //       <Text style={styles.offerTitle}>{item.title}</Text>
// // // // // // // //       <Text style={styles.offerDescription}>{item.description}</Text>
// // // // // // // //     </View>
// // // // // // // //   );

   
// // // // // // // //   useEffect(() => {
// // // // // // // //   businessAPI.getBusinesses({})
// // // // // // // //     .then((res: any) => setBusinesses(res.data))
// // // // // // // //     .catch((err: any) => console.error('Failed to load businesses:', err));
// // // // // // // // }, []);
// // // // // // // // useEffect(() => {
// // // // // // // //   if (!selectedBusinessId) {
// // // // // // // //     setProducts([]);
// // // // // // // //     return;
// // // // // // // //   }
// // // // // // // //   axios.get(`${API_URL}/public/products`, { params: { business_id: selectedBusinessId } })
// // // // // // // //     .then((res) => setProducts(res.data))
// // // // // // // //     .catch((err) => console.error('Failed to load products:', err));
// // // // // // // // }, [selectedBusinessId]);

// // // // // // // //   // ✅ Get business name from user
// // // // // // // //   const businessName = user?.business_name || 'No Business Found';
// // // // // // // //   const plan = user?.business_plan || 'FREE';
// // // // // // // //   const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

// // // // // // // //   return (
// // // // // // // //     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// // // // // // // //       {/* Header */}
// // // // // // // //       <View style={styles.header}>
// // // // // // // //         <View>
// // // // // // // //           <Text style={styles.locationLabel}>📍 Home</Text>
// // // // // // // //           <Text style={styles.location}>Sector 1, HSR Layout</Text>
          
// // // // // // // //           {/* ✅ Business Card - Shows the latest business from database */}
// // // // // // // //           <View style={styles.businessCard}>
// // // // // // // //             <View style={styles.businessCardContent}>
// // // // // // // //               <Icon name="business-outline" size={16} color={colors.primary} />
// // // // // // // //               <Text style={styles.businessName}>{displayName}</Text>
// // // // // // // //               {user?.business_name && user.business_name !== 'No Business Found' && (
// // // // // // // //                 <View style={styles.businessBadge}>
// // // // // // // //                   <Text style={styles.businessBadgeText}>{plan}</Text>
// // // // // // // //                 </View>
// // // // // // // //               )}
// // // // // // // //             </View>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// // // // // // // //           <Icon name="person-circle-outline" size={40} color={colors.primary} />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>

// // // // // // // //       {/* Search Bar */}
// // // // // // // //       <View style={styles.searchContainer}>
// // // // // // // //         <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// // // // // // // //         <TextInput
// // // // // // // //           style={styles.searchInput}
// // // // // // // //           placeholder="Search for restaurant, item or more"
// // // // // // // //           value={searchText}
// // // // // // // //           onChangeText={setSearchText}
// // // // // // // //           onFocus={() => navigation.navigate('Search')}
// // // // // // // //         />
// // // // // // // //       </View>

// // // // // // // //       {/* Offers Section */}
// // // // // // // //       {/* Offers Section */}
// // // // // // // //       {/* @ts-ignore */}
// // // // // // // //       <FlatList
// // // // // // // //         data={offers}
// // // // // // // //         renderItem={renderOffer}
// // // // // // // //         keyExtractor={(item) => item.id}
// // // // // // // //         horizontal
// // // // // // // //         showsHorizontalScrollIndicator={false}
// // // // // // // //         contentContainerStyle={styles.offersList}
// // // // // // // //         style={styles.offersSection}
// // // // // // // //       />

// // // // // // // //       {/* Quick Categories */}
// // // // // // // //       <View style={styles.categoriesSection}>
// // // // // // // //         <Text style={styles.sectionTitle}>What's on your mind?</Text>
// // // // // // // //          <Text style={styles.sectionTitle}>What's on your mind?</Text>
// // // // // // // //         {/* @ts-ignore */}
// // // // // // // //         <FlatList
// // // // // // // //           data={categories}
// // // // // // // //           renderItem={renderCategory}
// // // // // // // //           keyExtractor={(item) => item.id}
// // // // // // // //           horizontal
// // // // // // // //           showsHorizontalScrollIndicator={false}
// // // // // // // //           contentContainerStyle={styles.categoriesList}
// // // // // // // //         />
// // // // // // // //       </View>
     
// // // // // // // //      <View style={styles.restaurantsSection}>
// // // // // // // //   <Text style={styles.sectionTitle}>Select a shop</Text>
// // // // // // // //   <View style={{ backgroundColor: colors.lightGray, borderRadius: 12 }}>
// // // // // // // //     <Picker
// // // // // // // //       selectedValue={selectedBusinessId}
// // // // // // // //       onValueChange={(value) => setSelectedBusinessId(value)}
// // // // // // // //     >
// // // // // // // //       <Picker.Item label="-- Choose a shop --" value={null} />
// // // // // // // //       {businesses.map((biz: any) => (
// // // // // // // //         <Picker.Item key={biz.id} label={biz.business_name} value={biz.id} />
// // // // // // // //       ))}
// // // // // // // //     </Picker>
// // // // // // // //   </View>
// // // // // // // // </View>
// // // // // // // //       {/* Products */}
// // // // // // // //       <View style={styles.restaurantsSection}>
// // // // // // // //         <View style={styles.sectionHeader}>
// // // // // // // //           <Text style={styles.sectionTitle}>Available Products</Text>
// // // // // // // //         </View>
// // // // // // // //         {products.map((product: any) => (
// // // // // // // //           <View key={product.id} style={styles.offerCard2}>
// // // // // // // //             <Text style={styles.productName}>{product.name}</Text>
// // // // // // // //             <Text style={styles.productCategory}>{product.category}</Text>
// // // // // // // //             <Text style={styles.productPrice}>₹{product.selling_price}</Text>
// // // // // // // //             <Text style={styles.productStock}>Stock: {product.stock_qty}</Text>
// // // // // // // //           </View>
// // // // // // // //         ))}
// // // // // // // //       </View>

// // // // // // // //       <View style={styles.restaurantsSection}>
// // // // // // // //   <Text style={styles.sectionTitle}>Stores near you</Text>
// // // // // // // //   {businesses.map((biz: any) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       key={biz.id}
// // // // // // // //       style={styles.offerCard2}
// // // // // // // //       onPress={() => navigation.navigate('Search', { businessId: biz.id, businessName: biz.business_name })}
// // // // // // // //     >
// // // // // // // //       <Text style={styles.productName}>{biz.business_name}</Text>
// // // // // // // //       <Text style={styles.productCategory}>{biz.business_type}</Text>
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   ))}
// // // // // // // // </View>
// // // // // // // //     </ScrollView>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: colors.white,
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //   },
// // // // // // // //   header: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'flex-start',
// // // // // // // //     paddingTop: 16,
// // // // // // // //     paddingBottom: 8,
// // // // // // // //   },
// // // // // // // //   locationLabel: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: colors.textLight,
// // // // // // // //   },
// // // // // // // //   location: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   businessCard: {
// // // // // // // //     marginTop: 6,
// // // // // // // //     backgroundColor: '#f0f7ff',
// // // // // // // //     borderRadius: 8,
// // // // // // // //     paddingHorizontal: 10,
// // // // // // // //     paddingVertical: 5,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#d4e4ff',
// // // // // // // //     alignSelf: 'flex-start',
// // // // // // // //   },
// // // // // // // //   businessCardContent: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   businessName: {
// // // // // // // //     fontSize: 13,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.primary,
// // // // // // // //     marginLeft: 6,
// // // // // // // //   },
// // // // // // // //   businessBadge: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //     borderRadius: 4,
// // // // // // // //     paddingHorizontal: 6,
// // // // // // // //     paddingVertical: 1,
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },
// // // // // // // //   businessBadgeText: {
// // // // // // // //     fontSize: 8,
// // // // // // // //     color: colors.white,
// // // // // // // //     fontWeight: '700',
// // // // // // // //   },
// // // // // // // //   searchContainer: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     paddingHorizontal: 12,
// // // // // // // //     marginVertical: 12,
// // // // // // // //     height: 48,
// // // // // // // //   },
// // // // // // // //   searchIcon: {
// // // // // // // //     marginRight: 8,
// // // // // // // //   },
// // // // // // // //   searchInput: {
// // // // // // // //     flex: 1,
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   offersSection: {
// // // // // // // //     marginVertical: 8,
// // // // // // // //   },
// // // // // // // //   offersList: {
// // // // // // // //     paddingVertical: 4,
// // // // // // // //   },
// // // // // // // //   offerCard: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     padding: 16,
// // // // // // // //     marginRight: 12,
// // // // // // // //     width: width * 0.6,
// // // // // // // //     height: 80,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //   },
// // // // // // // //   offerTitle: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: colors.white,
// // // // // // // //   },
// // // // // // // //   offerDescription: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: colors.white,
// // // // // // // //     opacity: 0.9,
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   categoriesSection: {
// // // // // // // //     marginVertical: 8,
// // // // // // // //   },
// // // // // // // //   sectionTitle: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.text,
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   categoriesList: {
// // // // // // // //     paddingVertical: 4,
// // // // // // // //   },
// // // // // // // //   restaurantsSection: {
// // // // // // // //     marginVertical: 8,
// // // // // // // //     paddingBottom: 80,
// // // // // // // //   },
// // // // // // // //   sectionHeader: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   seeAll: {
// // // // // // // //     color: colors.primary,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     fontSize: 14,
// // // // // // // //   },
// // // // // // // //   offerCard2: {
// // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     padding: 16,
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   productName: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   productCategory: {
// // // // // // // //     fontSize: 13,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   productPrice: {
// // // // // // // //     fontSize: 15,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.primary,
// // // // // // // //     marginTop: 6,
// // // // // // // //   },
// // // // // // // //   productStock: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // import React, { useState, useEffect, useContext } from 'react';
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
// // // // // // // import { categories, offers } from '../../constants/dummyData';
// // // // // // // import axios from 'axios';
// // // // // // // import { API_URL } from '@env';
// // // // // // // import CategoryItem from '../../components/home/CategoryItem';
// // // // // // // import { Category, Offer } from '../../types';
// // // // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // // // import { businessAPI } from '../../api/endpoints';
// // // // // // // import { Picker } from '@react-native-picker/picker';
// // // // // // // import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';


// // // // // // // const { width } = Dimensions.get('window');

// // // // // // // export default function HomeScreen({ navigation }: any) {
// // // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // // //   const [products, setProducts] = useState<any[]>([]);
// // // // // // //   const { user } = useContext(AuthContext);
// // // // // // //   const [businesses, setBusinesses] = useState<any[]>([]);
// // // // // // //   const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
// // // // // // //   const { setSelectedBusiness } = useContext(SelectedBusinessContext);


// // // // // // //   // Load all businesses once, on mount
// // // // // // //   useEffect(() => {
// // // // // // //     businessAPI.getBusinesses({})
// // // // // // //       .then((res: any) => setBusinesses(res.data))
// // // // // // //       .catch((err: any) => console.error('Failed to load businesses:', err));
// // // // // // //   }, []);

// // // // // // //   // Load products ONLY for the selected shop (single source of truth — no duplicate effect)
// // // // // // //   useEffect(() => {
// // // // // // //     if (!selectedBusinessId) {
// // // // // // //       setProducts([]);
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     axios.get(`${API_URL}/public/products`, { params: { business_id: selectedBusinessId } })
// // // // // // //       .then((res) => setProducts(res.data))
// // // // // // //       .catch((err) => console.error('Failed to load products:', err));
// // // // // // //   }, [selectedBusinessId]);

// // // // // // //   useEffect(() => {
// // // // // // //     console.log('🏪 USER OBJECT:', user);
// // // // // // //   }, [user]);

// // // // // // //   const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

// // // // // // //   const renderOffer = ({ item }: { item: Offer }) => (
// // // // // // //     <View style={styles.offerCard}>
// // // // // // //       <Text style={styles.offerTitle}>{item.title}</Text>
// // // // // // //       <Text style={styles.offerDescription}>{item.description}</Text>
// // // // // // //     </View>
// // // // // // //   );

// // // // // // //   // Get business name from logged-in user (for the header card)
// // // // // // //   const businessName = user?.business_name || 'No Business Found';
// // // // // // //   const plan = user?.business_plan || 'FREE';
// // // // // // //   const displayName = businessName.length > 20 ? businessName.substring(0, 20) + '...' : businessName;

// // // // // // //   return (
// // // // // // //     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// // // // // // //       {/* Header */}
// // // // // // //       <View style={styles.header}>
// // // // // // //         <View>
// // // // // // //           <Text style={styles.locationLabel}>📍 Home</Text>
// // // // // // //           <Text style={styles.location}>Sector 1, HSR Layout</Text>

// // // // // // //           <View style={styles.businessCard}>
// // // // // // //             <View style={styles.businessCardContent}>
// // // // // // //               <Icon name="business-outline" size={16} color={colors.primary} />
// // // // // // //               <Text style={styles.businessName}>{displayName}</Text>
// // // // // // //               {user?.business_name && user.business_name !== 'No Business Found' && (
// // // // // // //                 <View style={styles.businessBadge}>
// // // // // // //                   <Text style={styles.businessBadgeText}>{plan}</Text>
// // // // // // //                 </View>
// // // // // // //               )}
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
// // // // // // //           <Icon name="person-circle-outline" size={40} color={colors.primary} />
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>

// // // // // // //       {/* Search Bar — general, cross-store search (bottom tab does the same) */}
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
// // // // // // //       {/* @ts-ignore */}
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
// // // // // // //         {/* @ts-ignore */}
// // // // // // //         <FlatList
// // // // // // //           data={categories}
// // // // // // //           renderItem={renderCategory}
// // // // // // //           keyExtractor={(item) => item.id}
// // // // // // //           horizontal
// // // // // // //           showsHorizontalScrollIndicator={false}
// // // // // // //           contentContainerStyle={styles.categoriesList}
// // // // // // //         />
// // // // // // //       </View>

// // // // // // //       {/* Shop selector */}
// // // // // // //       <View style={styles.restaurantsSection}>
// // // // // // //         <Text style={styles.sectionTitle}>Select a shop</Text>
// // // // // // //         <View style={{ backgroundColor: colors.lightGray, borderRadius: 12 }}>
// // // // // // //           <Picker
// // // // // // //             selectedValue={selectedBusinessId}
// // // // // // //             onValueChange={(value) => setSelectedBusinessId(value)}
// // // // // // //           >
// // // // // // //             <Picker.Item label="-- Choose a shop --" value={null} />
// // // // // // //             {businesses.map((biz: any) => (
// // // // // // //               <Picker.Item key={biz.id} label={biz.business_name} value={biz.id} />
// // // // // // //             ))}
// // // // // // //           </Picker>
// // // // // // //         </View>
// // // // // // //       </View>

// // // // // // //       {/* Products — filtered to selectedBusinessId only */}
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

// // // // // // //       {/* Stores near you — tapping navigates to Search pre-filtered to that shop */}
// // // // // // //       <View style={styles.restaurantsSection}>
// // // // // // //         <Text style={styles.sectionTitle}>Stores near you</Text>
// // // // // // //         {businesses.map((biz: any) => (
// // // // // // //          <TouchableOpacity
// // // // // // //   key={biz.id}
// // // // // // //   style={styles.offerCard2}
// // // // // // //   onPress={() => {
// // // // // // //     setSelectedBusiness({ id: biz.id, name: biz.business_name });
// // // // // // //     navigation.navigate('Search', { businessId: biz.id, businessName: biz.business_name });
// // // // // // //   }}
// // // // // // // >
// // // // // // //             <Text style={styles.productName}>{biz.business_name}</Text>
// // // // // // //             <Text style={styles.productCategory}>{biz.business_type}</Text>
// // // // // // //           </TouchableOpacity>
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
// // // // // // //     alignItems: 'flex-start',
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
// // // // // // //   businessCard: {
// // // // // // //     marginTop: 6,
// // // // // // //     backgroundColor: '#f0f7ff',
// // // // // // //     borderRadius: 8,
// // // // // // //     paddingHorizontal: 10,
// // // // // // //     paddingVertical: 5,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#d4e4ff',
// // // // // // //     alignSelf: 'flex-start',
// // // // // // //   },
// // // // // // //   businessCardContent: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   businessName: {
// // // // // // //     fontSize: 13,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.primary,
// // // // // // //     marginLeft: 6,
// // // // // // //   },
// // // // // // //   businessBadge: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //     borderRadius: 4,
// // // // // // //     paddingHorizontal: 6,
// // // // // // //     paddingVertical: 1,
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   businessBadgeText: {
// // // // // // //     fontSize: 8,
// // // // // // //     color: colors.white,
// // // // // // //     fontWeight: '700',
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
// // // // // // import React, {
// // // // // //   useState,
// // // // // //   useEffect,
// // // // // //   useContext,
// // // // // // } from 'react';

// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   ScrollView,
// // // // // //   TextInput,
// // // // // //   TouchableOpacity,
// // // // // //   FlatList,
// // // // // //   StyleSheet,
// // // // // //   Dimensions,
// // // // // // } from 'react-native';

// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { colors } from '../../constants/colors';
// // // // // // import {
// // // // // //   categories,
// // // // // //   offers,
// // // // // // } from '../../constants/dummyData';

// // // // // // import axios from 'axios';
// // // // // // import { API_URL } from '@env';

// // // // // // import CategoryItem from '../../components/home/CategoryItem';

// // // // // // import {
// // // // // //   Category,
// // // // // //   Offer,
// // // // // // } from '../../types';

// // // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // // import { CartContext } from '../../context/CartContext';

// // // // // // import { businessAPI } from '../../api/endpoints';

// // // // // // import { Picker } from '@react-native-picker/picker';

// // // // // // import {
// // // // // //   SelectedBusinessContext,
// // // // // // } from '../../context/SelectedBusinessContext';

// // // // // // const { width } = Dimensions.get('window');

// // // // // // export default function HomeScreen({
// // // // // //   navigation,
// // // // // // }: any) {
// // // // // //   const [searchText, setSearchText] =
// // // // // //     useState<string>('');

// // // // // //   const [products, setProducts] =
// // // // // //     useState<any[]>([]);

// // // // // //   const { user } =
// // // // // //     useContext(AuthContext);

// // // // // //   const [businesses, setBusinesses] =
// // // // // //     useState<any[]>([]);

// // // // // //   const [selectedBusinessId, setSelectedBusinessId] =
// // // // // //     useState<number | null>(null);

// // // // // //   const {
// // // // // //     selectedBusiness,
// // // // // //     setSelectedBusiness,
// // // // // //   } = useContext(
// // // // // //     SelectedBusinessContext
// // // // // //   );

// // // // // //   // =====================================================
// // // // // //   // CART CONTEXT
// // // // // //   // =====================================================

// // // // // //   const {
// // // // // //     cartItems,
// // // // // //     addToCart,
// // // // // //     updateQuantity,
// // // // // //     removeFromCart,
// // // // // //   } = useContext(CartContext);

// // // // // //   // =====================================================
// // // // // //   // LOAD BUSINESSES
// // // // // //   // =====================================================

// // // // // //   useEffect(() => {
// // // // // //     businessAPI
// // // // // //       .getBusinesses({})
// // // // // //       .then((res: any) => {
// // // // // //         setBusinesses(res.data);
// // // // // //       })
// // // // // //       .catch((err: any) => {
// // // // // //         console.error(
// // // // // //           'Failed to load businesses:',
// // // // // //           err
// // // // // //         );
// // // // // //       });
// // // // // //   }, []);

// // // // // //   // =====================================================
// // // // // //   // LOAD PRODUCTS FOR SELECTED SHOP
// // // // // //   // =====================================================

// // // // // //   useEffect(() => {
// // // // // //     if (!selectedBusinessId) {
// // // // // //       setProducts([]);
// // // // // //       return;
// // // // // //     }

// // // // // //     axios
// // // // // //       .get(`${API_URL}/public/products`, {
// // // // // //         params: {
// // // // // //           business_id: selectedBusinessId,
// // // // // //         },
// // // // // //       })
// // // // // //       .then((res) => {
// // // // // //         console.log(
// // // // // //           'Products for selected shop:',
// // // // // //           res.data
// // // // // //         );

// // // // // //         if (Array.isArray(res.data)) {
// // // // // //           setProducts(res.data);
// // // // // //         } else if (
// // // // // //           res.data?.data &&
// // // // // //           Array.isArray(res.data.data)
// // // // // //         ) {
// // // // // //           setProducts(res.data.data);
// // // // // //         } else if (
// // // // // //           res.data?.products &&
// // // // // //           Array.isArray(res.data.products)
// // // // // //         ) {
// // // // // //           setProducts(res.data.products);
// // // // // //         } else {
// // // // // //           setProducts([]);
// // // // // //         }
// // // // // //       })
// // // // // //       .catch((err) => {
// // // // // //         console.error(
// // // // // //           'Failed to load products:',
// // // // // //           err
// // // // // //         );

// // // // // //         setProducts([]);
// // // // // //       });
// // // // // //   }, [selectedBusinessId]);

// // // // // //   // =====================================================
// // // // // //   // USER LOG
// // // // // //   // =====================================================

// // // // // //   useEffect(() => {
// // // // // //     console.log(
// // // // // //       '🏪 USER OBJECT:',
// // // // // //       user
// // // // // //     );
// // // // // //   }, [user]);

// // // // // //   // =====================================================
// // // // // //   // CATEGORY
// // // // // //   // =====================================================

// // // // // //   const renderCategory = ({
// // // // // //     item,
// // // // // //   }: {
// // // // // //     item: Category;
// // // // // //   }) => (
// // // // // //     <CategoryItem category={item} />
// // // // // //   );

// // // // // //   // =====================================================
// // // // // //   // OFFER
// // // // // //   // =====================================================

// // // // // //   const renderOffer = ({
// // // // // //     item,
// // // // // //   }: {
// // // // // //     item: Offer;
// // // // // //   }) => (
// // // // // //     <View style={styles.offerCard}>
// // // // // //       <Text style={styles.offerTitle}>
// // // // // //         {item.title}
// // // // // //       </Text>

// // // // // //       <Text
// // // // // //         style={styles.offerDescription}
// // // // // //       >
// // // // // //         {item.description}
// // // // // //       </Text>
// // // // // //     </View>
// // // // // //   );

// // // // // //   // =====================================================
// // // // // //   // BUSINESS NAME
// // // // // //   // =====================================================

// // // // // //   const businessName =
// // // // // //     user?.business_name ||
// // // // // //     'No Business Found';

// // // // // //   const plan =
// // // // // //     user?.business_plan ||
// // // // // //     'FREE';

// // // // // //   const displayName =
// // // // // //     businessName.length > 20
// // // // // //       ? businessName.substring(0, 20) +
// // // // // //         '...'
// // // // // //       : businessName;

// // // // // //   // =====================================================
// // // // // //   // CART FUNCTIONS
// // // // // //   // =====================================================

// // // // // //   const isItemInCart = (
// // // // // //     productId: string | number
// // // // // //   ) => {
// // // // // //     return cartItems.some(
// // // // // //       item =>
// // // // // //         item.id === String(productId) &&
// // // // // //         item.restaurantId ===
// // // // // //           String(selectedBusinessId)
// // // // // //     );
// // // // // //   };

// // // // // //   const getItemQuantity = (
// // // // // //     productId: string | number
// // // // // //   ) => {
// // // // // //     const item = cartItems.find(
// // // // // //       cartItem =>
// // // // // //         cartItem.id === String(productId) &&
// // // // // //         cartItem.restaurantId ===
// // // // // //           String(selectedBusinessId)
// // // // // //     );

// // // // // //     return item
// // // // // //       ? item.quantity
// // // // // //       : 0;
// // // // // //   };

// // // // // //   // =====================================================
// // // // // //   // ADD PRODUCT TO CART
// // // // // //   // =====================================================

// // // // // //   const handleAddToCart = (
// // // // // //     product: any
// // // // // //   ) => {
// // // // // //     if (!selectedBusinessId) {
// // // // // //       return;
// // // // // //     }

// // // // // //     const selectedShop =
// // // // // //       businesses.find(
// // // // // //         biz =>
// // // // // //           String(biz.id) ===
// // // // // //           String(selectedBusinessId)
// // // // // //       );

// // // // // //     const shopName =
// // // // // //       selectedShop?.business_name ||
// // // // // //       selectedBusiness?.name ||
// // // // // //       'Shop';

// // // // // //     // Cart item
// // // // // //     const cartItem = {
// // // // // //       id: String(product.id),
// // // // // //       name: product.name,
// // // // // //       price: Number(
// // // // // //         product.selling_price || 0
// // // // // //       ),
// // // // // //       quantity: 1,

// // // // // //       image:
// // // // // //         product.image ||
// // // // // //         'https://placehold.co/150x150',

// // // // // //       // IMPORTANT:
// // // // // //       // Cart belongs to selected shop,
// // // // // //       // not individual product.
// // // // // //       restaurantId:
// // // // // //         String(selectedBusinessId),

// // // // // //       restaurantName: shopName,
// // // // // //     };

// // // // // //     // Restaurant/shop data
// // // // // //     const restaurantData = {
// // // // // //       id: String(selectedBusinessId),
// // // // // //       name: shopName,

// // // // // //       rating: 4.5,

// // // // // //       deliveryTime:
// // // // // //         'In Stock',

// // // // // //       cuisine:
// // // // // //         product.category ||
// // // // // //         'General',

// // // // // //       image:
// // // // // //         product.image ||
// // // // // //         'https://placehold.co/150x150',

// // // // // //       costForTwo:
// // // // // //         `₹${product.selling_price}`,

// // // // // //       address:
// // // // // //         product.description ||
// // // // // //         'Available in stock',

// // // // // //       isVeg: true,

// // // // // //       offer:
// // // // // //         `Stock: ${product.stock_qty} units`,

// // // // // //       productData: {
// // // // // //         id: String(product.id),

// // // // // //         price: Number(
// // // // // //           product.selling_price || 0
// // // // // //         ),

// // // // // //         stock: Number(
// // // // // //           product.stock_qty || 0
// // // // // //         ),

// // // // // //         category:
// // // // // //           product.category,

// // // // // //         description:
// // // // // //           product.description,

// // // // // //         brand:
// // // // // //           product.brand,

// // // // // //         vendor:
// // // // // //           product.vendor,

// // // // // //         gst:
// // // // // //           product.gst_percent,

// // // // // //         unit:
// // // // // //           product.unit,

// // // // // //         barcode:
// // // // // //           product.barcode,

// // // // // //         sku:
// // // // // //           product.sku,

// // // // // //         image:
// // // // // //           product.image,

// // // // // //         name:
// // // // // //           product.name,
// // // // // //       },
// // // // // //     };

// // // // // //     console.log(
// // // // // //       '🛒 Adding product to cart:',
// // // // // //       cartItem
// // // // // //     );

// // // // // //     addToCart(
// // // // // //       cartItem,
// // // // // //       restaurantData
// // // // // //     );
// // // // // //   };

// // // // // //   // =====================================================
// // // // // //   // UPDATE QUANTITY
// // // // // //   // =====================================================

// // // // // //   const handleUpdateQuantity = (
// // // // // //     product: any,
// // // // // //     newQuantity: number
// // // // // //   ) => {
// // // // // //     if (!selectedBusinessId) {
// // // // // //       return;
// // // // // //     }

// // // // // //     const productId =
// // // // // //       String(product.id);

// // // // // //     const shopId =
// // // // // //       String(selectedBusinessId);

// // // // // //     if (newQuantity === 0) {
// // // // // //       removeFromCart(
// // // // // //         productId,
// // // // // //         shopId
// // // // // //       );
// // // // // //     } else {
// // // // // //       updateQuantity(
// // // // // //         productId,
// // // // // //         shopId,
// // // // // //         newQuantity
// // // // // //       );
// // // // // //     }
// // // // // //   };

// // // // // //   // =====================================================
// // // // // //   // PRODUCT DETAILS
// // // // // //   // =====================================================

// // // // // //   const handleProductPress = (
// // // // // //     product: any
// // // // // //   ) => {
// // // // // //     if (!selectedBusinessId) {
// // // // // //       return;
// // // // // //     }

// // // // // //     const selectedShop =
// // // // // //       businesses.find(
// // // // // //         biz =>
// // // // // //           String(biz.id) ===
// // // // // //           String(selectedBusinessId)
// // // // // //       );

// // // // // //     const shopName =
// // // // // //       selectedShop?.business_name ||
// // // // // //       selectedBusiness?.name ||
// // // // // //       'Shop';

// // // // // //     navigation.navigate(
// // // // // //       'RestaurantDetail',
// // // // // //       {
// // // // // //         restaurant: {
// // // // // //           // IMPORTANT:
// // // // // //           // Use business ID here,
// // // // // //           // because cart belongs to shop.
// // // // // //           id: String(
// // // // // //             selectedBusinessId
// // // // // //           ),

// // // // // //           name: shopName,

// // // // // //           rating: 4.5,

// // // // // //           deliveryTime:
// // // // // //             'In Stock',

// // // // // //           cuisine:
// // // // // //             product.category ||
// // // // // //             'General',

// // // // // //           image:
// // // // // //             product.image ||
// // // // // //             'https://placehold.co/150x150',

// // // // // //           costForTwo:
// // // // // //             `₹${product.selling_price}`,

// // // // // //           address:
// // // // // //             product.description ||
// // // // // //             'Available in stock',

// // // // // //           isVeg: true,

// // // // // //           offer:
// // // // // //             `Stock: ${product.stock_qty} units`,

// // // // // //           productData: {
// // // // // //             id: String(product.id),

// // // // // //             price: Number(
// // // // // //               product.selling_price || 0
// // // // // //             ),

// // // // // //             stock: Number(
// // // // // //               product.stock_qty || 0
// // // // // //             ),

// // // // // //             category:
// // // // // //               product.category,

// // // // // //             description:
// // // // // //               product.description,

// // // // // //             brand:
// // // // // //               product.brand,

// // // // // //             vendor:
// // // // // //               product.vendor,

// // // // // //             gst:
// // // // // //               product.gst_percent,

// // // // // //             unit:
// // // // // //               product.unit,

// // // // // //             barcode:
// // // // // //               product.barcode,

// // // // // //             sku:
// // // // // //               product.sku,

// // // // // //             image:
// // // // // //               product.image,

// // // // // //             name:
// // // // // //               product.name,
// // // // // //           },
// // // // // //         },
// // // // // //       }
// // // // // //     );
// // // // // //   };

// // // // // //   // =====================================================
// // // // // //   // PRODUCT CARD
// // // // // //   // =====================================================

// // // // // //   const renderProduct = ({
// // // // // //     item,
// // // // // //   }: {
// // // // // //     item: any;
// // // // // //   }) => {
// // // // // //     const inCart =
// // // // // //       isItemInCart(item.id);

// // // // // //     const quantity =
// // // // // //       getItemQuantity(item.id);

// // // // // //     return (
// // // // // //       <View
// // // // // //         style={styles.productCard}
// // // // // //       >
// // // // // //         {/* PRODUCT INFORMATION */}
// // // // // //         <TouchableOpacity
// // // // // //           style={
// // // // // //             styles.productClickable
// // // // // //           }
// // // // // //           activeOpacity={0.7}
// // // // // //           onPress={() =>
// // // // // //             handleProductPress(item)
// // // // // //           }
// // // // // //         >
// // // // // //           <View
// // // // // //             style={
// // // // // //               styles.productInfo
// // // // // //             }
// // // // // //           >
// // // // // //             <Text
// // // // // //               style={
// // // // // //                 styles.productName
// // // // // //               }
// // // // // //               numberOfLines={1}
// // // // // //             >
// // // // // //               {item.name ||
// // // // // //                 'Unnamed Product'}
// // // // // //             </Text>

// // // // // //             <Text
// // // // // //               style={
// // // // // //                 styles.productCategory
// // // // // //               }
// // // // // //             >
// // // // // //               {item.category ||
// // // // // //                 'Uncategorized'}
// // // // // //             </Text>

// // // // // //             <Text
// // // // // //               style={
// // // // // //                 styles.productPrice
// // // // // //               }
// // // // // //             >
// // // // // //               ₹
// // // // // //               {item.selling_price ||
// // // // // //                 0}
// // // // // //             </Text>

// // // // // //             <Text
// // // // // //               style={
// // // // // //                 styles.productStock
// // // // // //               }
// // // // // //             >
// // // // // //               Stock:{' '}
// // // // // //               {item.stock_qty ||
// // // // // //                 0}
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </TouchableOpacity>

// // // // // //         {/* ADD / QUANTITY */}
// // // // // //         <View
// // // // // //           style={
// // // // // //             styles.productAction
// // // // // //           }
// // // // // //         >
// // // // // //           {inCart ? (
// // // // // //             <View
// // // // // //               style={
// // // // // //                 styles.quantityContainer
// // // // // //               }
// // // // // //             >
// // // // // //               {/* MINUS */}
// // // // // //               <TouchableOpacity
// // // // // //                 style={
// // // // // //                   styles.quantityButton
// // // // // //                 }
// // // // // //                 onPress={() =>
// // // // // //                   handleUpdateQuantity(
// // // // // //                     item,
// // // // // //                     quantity - 1
// // // // // //                   )
// // // // // //                 }
// // // // // //               >
// // // // // //                 <Icon
// // // // // //                   name="remove"
// // // // // //                   size={16}
// // // // // //                   color="#fc8019"
// // // // // //                 />
// // // // // //               </TouchableOpacity>

// // // // // //               {/* QUANTITY */}
// // // // // //               <Text
// // // // // //                 style={
// // // // // //                   styles.quantityText
// // // // // //                 }
// // // // // //               >
// // // // // //                 {quantity}
// // // // // //               </Text>

// // // // // //               {/* PLUS */}
// // // // // //               <TouchableOpacity
// // // // // //                 style={
// // // // // //                   styles.quantityButton
// // // // // //                 }
// // // // // //                 onPress={() =>
// // // // // //                   handleUpdateQuantity(
// // // // // //                     item,
// // // // // //                     quantity + 1
// // // // // //                   )
// // // // // //                 }
// // // // // //               >
// // // // // //                 <Icon
// // // // // //                   name="add"
// // // // // //                   size={16}
// // // // // //                   color="#fc8019"
// // // // // //                 />
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           ) : (
// // // // // //             <TouchableOpacity
// // // // // //               style={
// // // // // //                 styles.addButton
// // // // // //               }
// // // // // //               onPress={() =>
// // // // // //                 handleAddToCart(item)
// // // // // //               }
// // // // // //             >
// // // // // //               <Text
// // // // // //                 style={
// // // // // //                   styles.addButtonText
// // // // // //                 }
// // // // // //               >
// // // // // //                 ADD
// // // // // //               </Text>
// // // // // //             </TouchableOpacity>
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </View>
// // // // // //     );
// // // // // //   };

// // // // // //   // =====================================================
// // // // // //   // SHOP CHANGE
// // // // // //   // =====================================================

// // // // // //   const handleBusinessChange = (
// // // // // //     value: any
// // // // // //   ) => {
// // // // // //     if (
// // // // // //       value === null ||
// // // // // //       value === undefined ||
// // // // // //       value === ''
// // // // // //     ) {
// // // // // //       setSelectedBusinessId(null);
// // // // // //       setSelectedBusiness(null);
// // // // // //       setProducts([]);
// // // // // //       return;
// // // // // //     }

// // // // // //     const business =
// // // // // //       businesses.find(
// // // // // //         biz =>
// // // // // //           String(biz.id) ===
// // // // // //           String(value)
// // // // // //       );

// // // // // //     setSelectedBusinessId(
// // // // // //       Number(value)
// // // // // //     );

// // // // // //     if (business) {
// // // // // //       setSelectedBusiness({
// // // // // //         id: business.id,
// // // // // //         name: business.business_name,
// // // // // //       });
// // // // // //     }

// // // // // //     console.log(
// // // // // //       '🏪 Selected Shop:',
// // // // // //       business
// // // // // //     );
// // // // // //   };

// // // // // //   // =====================================================
// // // // // //   // UI
// // // // // //   // =====================================================

// // // // // //   return (
// // // // // //     <ScrollView
// // // // // //       style={styles.container}
// // // // // //       showsVerticalScrollIndicator={
// // // // // //         false
// // // // // //       }
// // // // // //     >
// // // // // //       {/* HEADER */}
// // // // // //       <View style={styles.header}>
// // // // // //         <View>
// // // // // //           <Text
// // // // // //             style={
// // // // // //               styles.locationLabel
// // // // // //             }
// // // // // //           >
// // // // // //             📍 Home
// // // // // //           </Text>

// // // // // //           <Text
// // // // // //             style={styles.location}
// // // // // //           >
// // // // // //             Sector 1, HSR Layout
// // // // // //           </Text>

// // // // // //           <View
// // // // // //             style={
// // // // // //               styles.businessCard
// // // // // //             }
// // // // // //           >
// // // // // //             <View
// // // // // //               style={
// // // // // //                 styles.businessCardContent
// // // // // //               }
// // // // // //             >
// // // // // //               <Icon
// // // // // //                 name="business-outline"
// // // // // //                 size={16}
// // // // // //                 color={colors.primary}
// // // // // //               />

// // // // // //               <Text
// // // // // //                 style={
// // // // // //                   styles.businessName
// // // // // //                 }
// // // // // //               >
// // // // // //                 {displayName}
// // // // // //               </Text>

// // // // // //               {user?.business_name &&
// // // // // //                 user.business_name !==
// // // // // //                   'No Business Found' && (
// // // // // //                   <View
// // // // // //                     style={
// // // // // //                       styles.businessBadge
// // // // // //                     }
// // // // // //                   >
// // // // // //                     <Text
// // // // // //                       style={
// // // // // //                         styles.businessBadgeText
// // // // // //                       }
// // // // // //                     >
// // // // // //                       {plan}
// // // // // //                     </Text>
// // // // // //                   </View>
// // // // // //                 )}
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <TouchableOpacity
// // // // // //           onPress={() =>
// // // // // //             navigation.navigate(
// // // // // //               'Profile'
// // // // // //             )
// // // // // //           }
// // // // // //         >
// // // // // //           <Icon
// // // // // //             name="person-circle-outline"
// // // // // //             size={40}
// // // // // //             color={colors.primary}
// // // // // //           />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       {/* SEARCH */}
// // // // // //       <View
// // // // // //         style={
// // // // // //           styles.searchContainer
// // // // // //         }
// // // // // //       >
// // // // // //         <Icon
// // // // // //           name="search"
// // // // // //           size={20}
// // // // // //           color={colors.gray}
// // // // // //           style={styles.searchIcon}
// // // // // //         />

// // // // // //         <TextInput
// // // // // //           style={styles.searchInput}
// // // // // //           placeholder="Search for restaurant, item or more"
// // // // // //           value={searchText}
// // // // // //           onChangeText={
// // // // // //             setSearchText
// // // // // //           }
// // // // // //           onFocus={() =>
// // // // // //             navigation.navigate(
// // // // // //               'Search'
// // // // // //             )
// // // // // //           }
// // // // // //         />
// // // // // //       </View>

// // // // // //       {/* OFFERS */}
// // // // // //       <FlatList
// // // // // //         data={offers}
// // // // // //         renderItem={renderOffer}
// // // // // //         keyExtractor={item =>
// // // // // //           item.id
// // // // // //         }
// // // // // //         horizontal
// // // // // //         showsHorizontalScrollIndicator={
// // // // // //           false
// // // // // //         }
// // // // // //         contentContainerStyle={
// // // // // //           styles.offersList
// // // // // //         }
// // // // // //         style={
// // // // // //           styles.offersSection
// // // // // //         }
// // // // // //       />

// // // // // //       {/* CATEGORIES */}
// // // // // //       <View
// // // // // //         style={
// // // // // //           styles.categoriesSection
// // // // // //         }
// // // // // //       >
// // // // // //         <Text
// // // // // //           style={
// // // // // //             styles.sectionTitle
// // // // // //           }
// // // // // //         >
// // // // // //           What's on your mind?
// // // // // //         </Text>

// // // // // //         <FlatList
// // // // // //           data={categories}
// // // // // //           renderItem={
// // // // // //             renderCategory
// // // // // //           }
// // // // // //           keyExtractor={item =>
// // // // // //             item.id
// // // // // //           }
// // // // // //           horizontal
// // // // // //           showsHorizontalScrollIndicator={
// // // // // //             false
// // // // // //           }
// // // // // //           contentContainerStyle={
// // // // // //             styles.categoriesList
// // // // // //           }
// // // // // //         />
// // // // // //       </View>

// // // // // //       {/* SHOP SELECTOR */}
// // // // // //       <View
// // // // // //         style={
// // // // // //           styles.restaurantsSection
// // // // // //         }
// // // // // //       >
// // // // // //         <Text
// // // // // //           style={
// // // // // //             styles.sectionTitle
// // // // // //           }
// // // // // //         >
// // // // // //           Select a shop
// // // // // //         </Text>

// // // // // //         <View
// // // // // //           style={
// // // // // //             styles.pickerContainer
// // // // // //           }
// // // // // //         >
// // // // // //           <Picker
// // // // // //             selectedValue={
// // // // // //               selectedBusinessId
// // // // // //             }
// // // // // //             onValueChange={
// // // // // //               handleBusinessChange
// // // // // //             }
// // // // // //           >
// // // // // //             <Picker.Item
// // // // // //               label="-- Choose a shop --"
// // // // // //               value={null}
// // // // // //             />

// // // // // //             {businesses.map(
// // // // // //               (biz: any) => (
// // // // // //                 <Picker.Item
// // // // // //                   key={biz.id}
// // // // // //                   label={
// // // // // //                     biz.business_name
// // // // // //                   }
// // // // // //                   value={biz.id}
// // // // // //                 />
// // // // // //               )
// // // // // //             )}
// // // // // //           </Picker>
// // // // // //         </View>
// // // // // //       </View>

// // // // // //       {/* AVAILABLE PRODUCTS */}
// // // // // //       <View
// // // // // //         style={
// // // // // //           styles.restaurantsSection
// // // // // //         }
// // // // // //       >
// // // // // //         <View
// // // // // //           style={
// // // // // //             styles.sectionHeader
// // // // // //           }
// // // // // //         >
// // // // // //           <Text
// // // // // //             style={
// // // // // //               styles.sectionTitle
// // // // // //             }
// // // // // //           >
// // // // // //             Available Products
// // // // // //           </Text>
// // // // // //         </View>

// // // // // //         {!selectedBusinessId ? (
// // // // // //           <View
// // // // // //             style={
// // // // // //               styles.emptyProducts
// // // // // //             }
// // // // // //           >
// // // // // //             <Icon
// // // // // //               name="storefront-outline"
// // // // // //               size={45}
// // // // // //               color="#b5b5b5"
// // // // // //             />

// // // // // //             <Text
// // // // // //               style={
// // // // // //                 styles.emptyProductsText
// // // // // //               }
// // // // // //             >
// // // // // //               Select a shop to view
// // // // // //               products
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         ) : products.length === 0 ? (
// // // // // //           <View
// // // // // //             style={
// // // // // //               styles.emptyProducts
// // // // // //             }
// // // // // //           >
// // // // // //             <Icon
// // // // // //               name="cube-outline"
// // // // // //               size={45}
// // // // // //               color="#b5b5b5"
// // // // // //             />

// // // // // //             <Text
// // // // // //               style={
// // // // // //                 styles.emptyProductsText
// // // // // //               }
// // // // // //             >
// // // // // //               No products available
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         ) : (
// // // // // //           products.map(
// // // // // //             (product: any) =>
// // // // // //               renderProduct({
// // // // // //                 item: product,
// // // // // //               })
// // // // // //           )
// // // // // //         )}
// // // // // //       </View>

// // // // // //       {/* STORES NEAR YOU */}
// // // // // //       <View
// // // // // //         style={
// // // // // //           styles.restaurantsSection
// // // // // //         }
// // // // // //       >
// // // // // //         <Text
// // // // // //           style={
// // // // // //             styles.sectionTitle
// // // // // //           }
// // // // // //         >
// // // // // //           Stores near you
// // // // // //         </Text>

// // // // // //         {businesses.map(
// // // // // //           (biz: any) => (
// // // // // //             <TouchableOpacity
// // // // // //               key={biz.id}
// // // // // //               style={
// // // // // //                 styles.offerCard2
// // // // // //               }
// // // // // //               onPress={() => {
// // // // // //                 setSelectedBusiness(
// // // // // //                   {
// // // // // //                     id: biz.id,
// // // // // //                     name:
// // // // // //                       biz.business_name,
// // // // // //                   }
// // // // // //                 );

// // // // // //                 setSelectedBusinessId(
// // // // // //                   Number(biz.id)
// // // // // //                 );

// // // // // //                 navigation.navigate(
// // // // // //                   'Search',
// // // // // //                   {
// // // // // //                     businessId:
// // // // // //                       biz.id,
// // // // // //                     businessName:
// // // // // //                       biz.business_name,
// // // // // //                   }
// // // // // //                 );
// // // // // //               }}
// // // // // //             >
// // // // // //               <Text
// // // // // //                 style={
// // // // // //                   styles.productName
// // // // // //                 }
// // // // // //               >
// // // // // //                 {biz.business_name}
// // // // // //               </Text>

// // // // // //               <Text
// // // // // //                 style={
// // // // // //                   styles.productCategory
// // // // // //                 }
// // // // // //               >
// // // // // //                 {biz.business_type}
// // // // // //               </Text>
// // // // // //             </TouchableOpacity>
// // // // // //           )
// // // // // //         )}
// // // // // //       </View>
// // // // // //     </ScrollView>
// // // // // //   );
// // // // // // }

// // // // // // // =========================================================
// // // // // // // STYLES
// // // // // // // =========================================================

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: colors.white,
// // // // // //     paddingHorizontal: 16,
// // // // // //   },

// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent:
// // // // // //       'space-between',
// // // // // //     alignItems: 'flex-start',
// // // // // //     paddingTop: 16,
// // // // // //     paddingBottom: 8,
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

// // // // // //   businessCard: {
// // // // // //     marginTop: 6,
// // // // // //     backgroundColor: '#f0f7ff',
// // // // // //     borderRadius: 8,
// // // // // //     paddingHorizontal: 10,
// // // // // //     paddingVertical: 5,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#d4e4ff',
// // // // // //     alignSelf: 'flex-start',
// // // // // //   },

// // // // // //   businessCardContent: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //   },

// // // // // //   businessName: {
// // // // // //     fontSize: 13,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.primary,
// // // // // //     marginLeft: 6,
// // // // // //   },

// // // // // //   businessBadge: {
// // // // // //     backgroundColor:
// // // // // //       colors.primary,
// // // // // //     borderRadius: 4,
// // // // // //     paddingHorizontal: 6,
// // // // // //     paddingVertical: 1,
// // // // // //     marginLeft: 8,
// // // // // //   },

// // // // // //   businessBadgeText: {
// // // // // //     fontSize: 8,
// // // // // //     color: colors.white,
// // // // // //     fontWeight: '700',
// // // // // //   },

// // // // // //   // =====================================================
// // // // // //   // SEARCH
// // // // // //   // =====================================================

// // // // // //   searchContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor:
// // // // // //       colors.lightGray,
// // // // // //     borderRadius: 12,
// // // // // //     paddingHorizontal: 12,
// // // // // //     marginVertical: 12,
// // // // // //     height: 48,
// // // // // //   },

// // // // // //   searchIcon: {
// // // // // //     marginRight: 8,
// // // // // //   },

// // // // // //   searchInput: {
// // // // // //     flex: 1,
// // // // // //     fontSize: 14,
// // // // // //     color: colors.text,
// // // // // //   },

// // // // // //   // =====================================================
// // // // // //   // OFFERS
// // // // // //   // =====================================================

// // // // // //   offersSection: {
// // // // // //     marginVertical: 8,
// // // // // //   },

// // // // // //   offersList: {
// // // // // //     paddingVertical: 4,
// // // // // //   },

// // // // // //   offerCard: {
// // // // // //     backgroundColor:
// // // // // //       colors.primary,
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

// // // // // //   // =====================================================
// // // // // //   // CATEGORIES
// // // // // //   // =====================================================

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

// // // // // //   // =====================================================
// // // // // //   // SHOP
// // // // // //   // =====================================================

// // // // // //   restaurantsSection: {
// // // // // //     marginVertical: 8,
// // // // // //     paddingBottom: 30,
// // // // // //   },

// // // // // //   pickerContainer: {
// // // // // //     backgroundColor:
// // // // // //       colors.lightGray,
// // // // // //     borderRadius: 12,
// // // // // //     overflow: 'hidden',
// // // // // //   },

// // // // // //   sectionHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent:
// // // // // //       'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 12,
// // // // // //   },

// // // // // //   seeAll: {
// // // // // //     color: colors.primary,
// // // // // //     fontWeight: '500',
// // // // // //     fontSize: 14,
// // // // // //   },

// // // // // //   // =====================================================
// // // // // //   // PRODUCT CARD
// // // // // //   // =====================================================

// // // // // //   productCard: {
// // // // // //     backgroundColor:
// // // // // //       colors.lightGray,
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     marginBottom: 12,

// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent:
// // // // // //       'space-between',
// // // // // //   },

// // // // // //   productClickable: {
// // // // // //     flex: 1,
// // // // // //     marginRight: 10,
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

// // // // // //   productAction: {
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },

// // // // // //   // =====================================================
// // // // // //   // ADD BUTTON
// // // // // //   // =====================================================

// // // // // //   addButton: {
// // // // // //     borderWidth: 1,
// // // // // //     borderColor:
// // // // // //       colors.primary,
// // // // // //     backgroundColor:
// // // // // //       colors.white,
// // // // // //     borderRadius: 6,
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 7,
// // // // // //     minWidth: 58,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },

// // // // // //   addButtonText: {
// // // // // //     color: colors.primary,
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '700',
// // // // // //   },

// // // // // //   // =====================================================
// // // // // //   // QUANTITY
// // // // // //   // =====================================================

// // // // // //   quantityContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     borderWidth: 1,
// // // // // //     borderColor:
// // // // // //       colors.primary,
// // // // // //     borderRadius: 6,
// // // // // //     backgroundColor:
// // // // // //       colors.white,
// // // // // //     paddingHorizontal: 3,
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
// // // // // //     color: colors.text,
// // // // // //     minWidth: 22,
// // // // // //     textAlign: 'center',
// // // // // //   },

// // // // // //   // =====================================================
// // // // // //   // EMPTY PRODUCTS
// // // // // //   // =====================================================

// // // // // //   emptyProducts: {
// // // // // //     backgroundColor:
// // // // // //       colors.lightGray,
// // // // // //     borderRadius: 12,
// // // // // //     paddingVertical: 35,
// // // // // //     paddingHorizontal: 20,
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //   },

// // // // // //   emptyProductsText: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 10,
// // // // // //     textAlign: 'center',
// // // // // //   },

// // // // // //   // =====================================================
// // // // // //   // STORE CARDS
// // // // // //   // =====================================================

// // // // // //   offerCard2: {
// // // // // //     backgroundColor:
// // // // // //       colors.lightGray,
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // // });
// // // // // import React, {
// // // // //   useState,
// // // // //   useEffect,
// // // // //   useContext,
// // // // // } from 'react';

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
// // // // import {
// // // //   categories,
// // // //   offers,
// // // // } from '../../constants/dummyData';

// // // // import axios from 'axios';
// // // // import { API_URL } from '@env';

// // // // import CategoryItem from '../../components/home/CategoryItem';

// // // // import {
// // // //   Category,
// // // //   Offer,
// // // // } from '../../types';

// // // // import { AuthContext } from '../../context/AuthContext';
// // // // import { CartContext } from '../../context/CartContext';

// // // // import { businessAPI } from '../../api/endpoints';

// // // // import {
// // // //   SelectedBusinessContext,
// // // // } from '../../context/SelectedBusinessContext';

// // // // const { width } = Dimensions.get('window');

// // // // export default function HomeScreen({
// // // //   navigation,
// // // // }: any) {
// // // //   const [searchText, setSearchText] =
// // // //     useState<string>('');

// // // //   const [products, setProducts] =
// // // //     useState<any[]>([]);

// // // //   const { user } =
// // // //     useContext(AuthContext);

// // // //   const [businesses, setBusinesses] =
// // // //     useState<any[]>([]);

// // // //   const [selectedBusinessId, setSelectedBusinessId] =
// // // //     useState<number | null>(null);

// // // //   const {
// // // //     selectedBusiness,
// // // //     setSelectedBusiness,
// // // //   } = useContext(
// // // //     SelectedBusinessContext
// // // //   );

// // // //   // =====================================================
// // // //   // CART CONTEXT
// // // //   // =====================================================

// // // //   const {
// // // //     cartItems,
// // // //     addToCart,
// // // //     updateQuantity,
// // // //     removeFromCart,
// // // //   } = useContext(CartContext);

// // // //   // =====================================================
// // // //   // LOAD BUSINESSES
// // // //   // =====================================================

// // // //   // useEffect(() => {
// // // //   //   businessAPI
// // // //   //     .getBusinesses({})
// // // //   //     .then((res: any) => {
// // // //   //       setBusinesses(res.data);
// // // //   //     })
// // // //   //     .catch((err: any) => {
// // // //   //       console.error(
// // // //   //         'Failed to load businesses:',
// // // //   //         err
// // // //   //       );
// // // //   //     });
// // // //   // }, []);
// // // // useEffect(() => {
// // // //   businessAPI
// // // //     .getBusinesses({})
// // // //     .then((res: any) => {
// // // //       console.log('📦 Response from API:', res);
      
// // // //       let businessesData = [];
      
// // // //       // Handle different response formats
// // // //       if (Array.isArray(res)) {
// // // //         businessesData = res;
// // // //         console.log('✅ Case 1: Direct array, count:', businessesData.length);
// // // //       } else if (res?.data && Array.isArray(res.data)) {
// // // //         businessesData = res.data;
// // // //         console.log('✅ Case 2: res.data array, count:', businessesData.length);
// // // //       } else if (res?.data?.data && Array.isArray(res.data.data)) {
// // // //         businessesData = res.data.data;
// // // //         console.log('✅ Case 3: res.data.data array, count:', businessesData.length);
// // // //       } else if (res?.businesses && Array.isArray(res.businesses)) {
// // // //         businessesData = res.businesses;
// // // //         console.log('✅ Case 4: res.businesses array, count:', businessesData.length);
// // // //       } else {
// // // //         console.log('❌ No data found in any format');
// // // //       }
      
// // // //       console.log('🏪 Business names:', businessesData.map((b: any) => b.business_name || b.businessName));
// // // //       setBusinesses(businessesData);
// // // //     })
// // // //     .catch((err: any) => {
// // // //       console.error('❌ Failed to load businesses:', err);
// // // //       setBusinesses([]);
// // // //     });
// // // // }, []);
// // // //   // =====================================================
// // // //   // LOAD PRODUCTS FOR SELECTED SHOP
// // // //   // =====================================================

// // // //   useEffect(() => {
// // // //     if (!selectedBusinessId) {
// // // //       setProducts([]);
// // // //       return;
// // // //     }

// // // //     axios
// // // //       .get(`${API_URL}/public/products`, {
// // // //         params: {
// // // //           business_id: selectedBusinessId,
// // // //         },
// // // //       })
// // // //       .then((res) => {
// // // //         console.log(
// // // //           'Products for selected shop:',
// // // //           res.data
// // // //         );

// // // //         if (Array.isArray(res.data)) {
// // // //           setProducts(res.data);
// // // //         } else if (
// // // //           res.data?.data &&
// // // //           Array.isArray(res.data.data)
// // // //         ) {
// // // //           setProducts(res.data.data);
// // // //         } else if (
// // // //           res.data?.products &&
// // // //           Array.isArray(res.data.products)
// // // //         ) {
// // // //           setProducts(res.data.products);
// // // //         } else {
// // // //           setProducts([]);
// // // //         }
// // // //       })
// // // //       .catch((err) => {
// // // //         console.error(
// // // //           'Failed to load products:',
// // // //           err
// // // //         );

// // // //         setProducts([]);
// // // //       });
// // // //   }, [selectedBusinessId]);

// // // //   // =====================================================
// // // //   // USER LOG
// // // //   // =====================================================

// // // //   useEffect(() => {
// // // //     console.log(
// // // //       '🏪 USER OBJECT:',
// // // //       user
// // // //     );
// // // //   }, [user]);

// // // //   // =====================================================
// // // //   // CATEGORY
// // // //   // =====================================================

// // // //   const renderCategory = ({
// // // //     item,
// // // //   }: {
// // // //     item: Category;
// // // //   }) => (
// // // //     <CategoryItem category={item} />
// // // //   );

// // // //   // =====================================================
// // // //   // OFFER
// // // //   // =====================================================

// // // //   const renderOffer = ({
// // // //     item,
// // // //   }: {
// // // //     item: Offer;
// // // //   }) => (
// // // //     <View style={styles.offerCard}>
// // // //       <Text style={styles.offerTitle}>
// // // //         {item.title}
// // // //       </Text>

// // // //       <Text
// // // //         style={styles.offerDescription}
// // // //       >
// // // //         {item.description}
// // // //       </Text>
// // // //     </View>
// // // //   );

// // // //   // =====================================================
// // // //   // BUSINESS NAME
// // // //   // =====================================================

// // // //   const businessName =
// // // //     user?.business_name ||
// // // //     'No Business Found';

// // // //   const plan =
// // // //     user?.business_plan ||
// // // //     'FREE';

// // // //   const displayName =
// // // //     businessName.length > 20
// // // //       ? businessName.substring(0, 20) +
// // // //         '...'
// // // //       : businessName;

// // // //   // =====================================================
// // // //   // CART FUNCTIONS
// // // //   // =====================================================

// // // //   const isItemInCart = (
// // // //     productId: string | number
// // // //   ) => {
// // // //     return cartItems.some(
// // // //       item =>
// // // //         item.id === String(productId) &&
// // // //         item.restaurantId ===
// // // //           String(selectedBusinessId)
// // // //     );
// // // //   };

// // // //   const getItemQuantity = (
// // // //     productId: string | number
// // // //   ) => {
// // // //     const item = cartItems.find(
// // // //       cartItem =>
// // // //         cartItem.id === String(productId) &&
// // // //         cartItem.restaurantId ===
// // // //           String(selectedBusinessId)
// // // //     );

// // // //     return item
// // // //       ? item.quantity
// // // //       : 0;
// // // //   };

// // // //   // =====================================================
// // // //   // ADD PRODUCT TO CART
// // // //   // =====================================================

// // // //   const handleAddToCart = (
// // // //     product: any
// // // //   ) => {
// // // //     if (!selectedBusinessId) {
// // // //       return;
// // // //     }

// // // //     const selectedShop =
// // // //       businesses.find(
// // // //         biz =>
// // // //           String(biz.id) ===
// // // //           String(selectedBusinessId)
// // // //       );

// // // //     const shopName =
// // // //       selectedShop?.business_name ||
// // // //       selectedBusiness?.name ||
// // // //       'Shop';

// // // //     // Cart item
// // // //     const cartItem = {
// // // //       id: String(product.id),
// // // //       name: product.name,
// // // //       price: Number(
// // // //         product.selling_price || 0
// // // //       ),
// // // //       quantity: 1,

// // // //       image:
// // // //         product.image ||
// // // //         'https://placehold.co/150x150',

// // // //       // IMPORTANT:
// // // //       // Cart belongs to selected shop,
// // // //       // not individual product.
// // // //       restaurantId:
// // // //         String(selectedBusinessId),

// // // //       restaurantName: shopName,
// // // //     };

// // // //     // Restaurant/shop data
// // // //     const restaurantData = {
// // // //       id: String(selectedBusinessId),
// // // //       name: shopName,

// // // //       rating: 4.5,

// // // //       deliveryTime:
// // // //         'In Stock',

// // // //       cuisine:
// // // //         product.category ||
// // // //         'General',

// // // //       image:
// // // //         product.image ||
// // // //         'https://placehold.co/150x150',

// // // //       costForTwo:
// // // //         `₹${product.selling_price}`,

// // // //       address:
// // // //         product.description ||
// // // //         'Available in stock',

// // // //       isVeg: true,

// // // //       offer:
// // // //         `Stock: ${product.stock_qty} units`,

// // // //       productData: {
// // // //         id: String(product.id),

// // // //         price: Number(
// // // //           product.selling_price || 0
// // // //         ),

// // // //         stock: Number(
// // // //           product.stock_qty || 0
// // // //         ),

// // // //         category:
// // // //           product.category,

// // // //         description:
// // // //           product.description,

// // // //         brand:
// // // //           product.brand,

// // // //         vendor:
// // // //           product.vendor,

// // // //         gst:
// // // //           product.gst_percent,

// // // //         unit:
// // // //           product.unit,

// // // //         barcode:
// // // //           product.barcode,

// // // //         sku:
// // // //           product.sku,

// // // //         image:
// // // //           product.image,

// // // //         name:
// // // //           product.name,
// // // //       },
// // // //     };

// // // //     console.log(
// // // //       '🛒 Adding product to cart:',
// // // //       cartItem
// // // //     );

// // // //     addToCart(
// // // //       cartItem,
// // // //       restaurantData
// // // //     );
// // // //   };

// // // //   // =====================================================
// // // //   // UPDATE QUANTITY
// // // //   // =====================================================

// // // //   const handleUpdateQuantity = (
// // // //     product: any,
// // // //     newQuantity: number
// // // //   ) => {
// // // //     if (!selectedBusinessId) {
// // // //       return;
// // // //     }

// // // //     const productId =
// // // //       String(product.id);

// // // //     const shopId =
// // // //       String(selectedBusinessId);

// // // //     if (newQuantity === 0) {
// // // //       removeFromCart(
// // // //         productId,
// // // //         shopId
// // // //       );
// // // //     } else {
// // // //       updateQuantity(
// // // //         productId,
// // // //         shopId,
// // // //         newQuantity
// // // //       );
// // // //     }
// // // //   };

// // // //   // =====================================================
// // // //   // PRODUCT DETAILS
// // // //   // =====================================================

// // // //   const handleProductPress = (
// // // //     product: any
// // // //   ) => {
// // // //     if (!selectedBusinessId) {
// // // //       return;
// // // //     }

// // // //     const selectedShop =
// // // //       businesses.find(
// // // //         biz =>
// // // //           String(biz.id) ===
// // // //           String(selectedBusinessId)
// // // //       );

// // // //     const shopName =
// // // //       selectedShop?.business_name ||
// // // //       selectedBusiness?.name ||
// // // //       'Shop';

// // // //     navigation.navigate(
// // // //       'RestaurantDetail',
// // // //       {
// // // //         restaurant: {
// // // //           // IMPORTANT:
// // // //           // Use business ID here,
// // // //           // because cart belongs to shop.
// // // //           id: String(
// // // //             selectedBusinessId
// // // //           ),

// // // //           name: shopName,

// // // //           rating: 4.5,

// // // //           deliveryTime:
// // // //             'In Stock',

// // // //           cuisine:
// // // //             product.category ||
// // // //             'General',

// // // //           image:
// // // //             product.image ||
// // // //             'https://placehold.co/150x150',

// // // //           costForTwo:
// // // //             `₹${product.selling_price}`,

// // // //           address:
// // // //             product.description ||
// // // //             'Available in stock',

// // // //           isVeg: true,

// // // //           offer:
// // // //             `Stock: ${product.stock_qty} units`,

// // // //           productData: {
// // // //             id: String(product.id),

// // // //             price: Number(
// // // //               product.selling_price || 0
// // // //             ),

// // // //             stock: Number(
// // // //               product.stock_qty || 0
// // // //             ),

// // // //             category:
// // // //               product.category,

// // // //             description:
// // // //               product.description,

// // // //             brand:
// // // //               product.brand,

// // // //             vendor:
// // // //               product.vendor,

// // // //             gst:
// // // //               product.gst_percent,

// // // //             unit:
// // // //               product.unit,

// // // //             barcode:
// // // //               product.barcode,

// // // //             sku:
// // // //               product.sku,

// // // //             image:
// // // //               product.image,

// // // //             name:
// // // //               product.name,
// // // //           },
// // // //         },
// // // //       }
// // // //     );
// // // //   };

// // // //   // =====================================================
// // // //   // PRODUCT CARD
// // // //   // =====================================================

// // // //   const renderProduct = ({
// // // //     item,
// // // //   }: {
// // // //     item: any;
// // // //   }) => {
// // // //     const inCart =
// // // //       isItemInCart(item.id);

// // // //     const quantity =
// // // //       getItemQuantity(item.id);

// // // //     return (
// // // //       <View
// // // //         style={styles.productCard}
// // // //       >
// // // //         {/* PRODUCT INFORMATION */}
// // // //         <TouchableOpacity
// // // //           style={
// // // //             styles.productClickable
// // // //           }
// // // //           activeOpacity={0.7}
// // // //           onPress={() =>
// // // //             handleProductPress(item)
// // // //           }
// // // //         >
// // // //           <View
// // // //             style={
// // // //               styles.productInfo
// // // //             }
// // // //           >
// // // //             <Text
// // // //               style={
// // // //                 styles.productName
// // // //               }
// // // //               numberOfLines={1}
// // // //             >
// // // //               {item.name ||
// // // //                 'Unnamed Product'}
// // // //             </Text>

// // // //             <Text
// // // //               style={
// // // //                 styles.productCategory
// // // //               }
// // // //             >
// // // //               {item.category ||
// // // //                 'Uncategorized'}
// // // //             </Text>

// // // //             <Text
// // // //               style={
// // // //                 styles.productPrice
// // // //               }
// // // //             >
// // // //               ₹
// // // //               {item.selling_price ||
// // // //                 0}
// // // //             </Text>

// // // //             <Text
// // // //               style={
// // // //                 styles.productStock
// // // //               }
// // // //             >
// // // //               Stock:{' '}
// // // //               {item.stock_qty ||
// // // //                 0}
// // // //             </Text>
// // // //           </View>
// // // //         </TouchableOpacity>

// // // //         {/* ADD / QUANTITY */}
// // // //         <View
// // // //           style={
// // // //             styles.productAction
// // // //           }
// // // //         >
// // // //           {inCart ? (
// // // //             <View
// // // //               style={
// // // //                 styles.quantityContainer
// // // //               }
// // // //             >
// // // //               {/* MINUS */}
// // // //               <TouchableOpacity
// // // //                 style={
// // // //                   styles.quantityButton
// // // //                 }
// // // //                 onPress={() =>
// // // //                   handleUpdateQuantity(
// // // //                     item,
// // // //                     quantity - 1
// // // //                   )
// // // //                 }
// // // //               >
// // // //                 <Icon
// // // //                   name="remove"
// // // //                   size={16}
// // // //                   color="#fc8019"
// // // //                 />
// // // //               </TouchableOpacity>

// // // //               {/* QUANTITY */}
// // // //               <Text
// // // //                 style={
// // // //                   styles.quantityText
// // // //                 }
// // // //               >
// // // //                 {quantity}
// // // //               </Text>

// // // //               {/* PLUS */}
// // // //               <TouchableOpacity
// // // //                 style={
// // // //                   styles.quantityButton
// // // //                 }
// // // //                 onPress={() =>
// // // //                   handleUpdateQuantity(
// // // //                     item,
// // // //                     quantity + 1
// // // //                   )
// // // //                 }
// // // //               >
// // // //                 <Icon
// // // //                   name="add"
// // // //                   size={16}
// // // //                   color="#fc8019"
// // // //                 />
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           ) : (
// // // //             <TouchableOpacity
// // // //               style={
// // // //                 styles.addButton
// // // //               }
// // // //               onPress={() =>
// // // //                 handleAddToCart(item)
// // // //               }
// // // //             >
// // // //               <Text
// // // //                 style={
// // // //                   styles.addButtonText
// // // //                 }
// // // //               >
// // // //                 ADD
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   // =====================================================
// // // //   // SHOP CHANGE
// // // //   // =====================================================

// // // //   const handleBusinessChange = (businessId: number) => {
// // // //     if (businessId === selectedBusinessId) {
// // // //       // Deselect if clicking the same shop
// // // //       setSelectedBusinessId(null);
// // // //       setSelectedBusiness(null);
// // // //       setProducts([]);
// // // //       return;
// // // //     }

// // // //     const business =
// // // //       businesses.find(
// // // //         biz =>
// // // //           String(biz.id) ===
// // // //           String(businessId)
// // // //       );

// // // //     setSelectedBusinessId(
// // // //       Number(businessId)
// // // //     );

// // // //     if (business) {
// // // //       setSelectedBusiness({
// // // //         id: business.id,
// // // //         name: business.business_name,
// // // //       });
// // // //     }

// // // //     console.log(
// // // //       '🏪 Selected Shop:',
// // // //       business
// // // //     );
// // // //   };

// // // //   // =====================================================
// // // //   // SHOP ICON RENDERER
// // // //   // =====================================================

// // // //   const renderShopIcon = ({ item }: { item: any }) => (
// // // //     <TouchableOpacity
// // // //       style={[
// // // //         styles.shopIconItem,
// // // //         selectedBusinessId === item.id &&
// // // //           styles.shopIconItemSelected,
// // // //       ]}
// // // //       onPress={() =>
// // // //         handleBusinessChange(item.id)
// // // //       }
// // // //     >
// // // //       <View
// // // //         style={[
// // // //           styles.shopIconCircle,
// // // //           selectedBusinessId === item.id &&
// // // //             styles.shopIconCircleSelected,
// // // //         ]}
// // // //       >
// // // //         <Icon
// // // //           name="storefront"
// // // //           size={28}
// // // //           color={
// // // //             selectedBusinessId === item.id
// // // //               ? colors.white
// // // //               : colors.primary
// // // //           }
// // // //         />
// // // //       </View>
// // // //       <Text
// // // //         style={[
// // // //           styles.shopIconName,
// // // //           selectedBusinessId === item.id &&
// // // //             styles.shopIconNameSelected,
// // // //         ]}
// // // //         numberOfLines={1}
// // // //       >
// // // //         {item.business_name}
// // // //       </Text>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   // =====================================================
// // // //   // UI
// // // //   // =====================================================

// // // //   return (
// // // //     <ScrollView
// // // //       style={styles.container}
// // // //       showsVerticalScrollIndicator={
// // // //         false
// // // //       }
// // // //     >
// // // //       {/* HEADER */}
// // // //       <View style={styles.header}>
// // // //         <View>
// // // //           <Text
// // // //             style={
// // // //               styles.locationLabel
// // // //             }
// // // //           >
// // // //             📍 Home
// // // //           </Text>

// // // //           <Text
// // // //             style={styles.location}
// // // //           >
// // // //             Sector 1, HSR Layout
// // // //           </Text>

// // // //           <View
// // // //             style={
// // // //               styles.businessCard
// // // //             }
// // // //           >
// // // //             <View
// // // //               style={
// // // //                 styles.businessCardContent
// // // //               }
// // // //             >
// // // //               <Icon
// // // //                 name="business-outline"
// // // //                 size={16}
// // // //                 color={colors.primary}
// // // //               />

// // // //               <Text
// // // //                 style={
// // // //                   styles.businessName
// // // //                 }
// // // //               >
// // // //                 {displayName}
// // // //               </Text>

// // // //               {user?.business_name &&
// // // //                 user.business_name !==
// // // //                   'No Business Found' && (
// // // //                   <View
// // // //                     style={
// // // //                       styles.businessBadge
// // // //                     }
// // // //                   >
// // // //                     <Text
// // // //                       style={
// // // //                         styles.businessBadgeText
// // // //                       }
// // // //                     >
// // // //                       {plan}
// // // //                     </Text>
// // // //                   </View>
// // // //                 )}
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         <TouchableOpacity
// // // //           onPress={() =>
// // // //             navigation.navigate(
// // // //               'Profile'
// // // //             )
// // // //           }
// // // //         >
// // // //           <Icon
// // // //             name="person-circle-outline"
// // // //             size={40}
// // // //             color={colors.primary}
// // // //           />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* SEARCH */}
// // // //       <View
// // // //         style={
// // // //           styles.searchContainer
// // // //         }
// // // //       >
// // // //         <Icon
// // // //           name="search"
// // // //           size={20}
// // // //           color={colors.gray}
// // // //           style={styles.searchIcon}
// // // //         />

// // // //         <TextInput
// // // //           style={styles.searchInput}
// // // //           placeholder="Search for restaurant, item or more"
// // // //           value={searchText}
// // // //           onChangeText={
// // // //             setSearchText
// // // //           }
// // // //           onFocus={() =>
// // // //             navigation.navigate(
// // // //               'Search'
// // // //             )
// // // //           }
// // // //         />
// // // //       </View>

// // // //       {/* OFFERS - REMOVED AS REQUESTED */}
// // // //       {/* FlatList for offers removed */}

// // // //       {/* CATEGORIES - REMOVED AND REPLACED WITH SHOP ICONS */}
      
// // // //       {/* SHOP SELECTOR - HORIZONTAL SCROLLABLE ICONS */}
// // // //       <View
// // // //         style={
// // // //           styles.shopSelectorSection
// // // //         }
// // // //       >
// // // //         <Text
// // // //           style={
// // // //             styles.sectionTitle
// // // //           }
// // // //         >
// // // //           Select a shop
// // // //         </Text>

// // // //         <FlatList
// // // //           data={businesses}
// // // //           renderItem={renderShopIcon}
// // // //           keyExtractor={(item) => item.id.toString()}
// // // //           horizontal
// // // //           showsHorizontalScrollIndicator={false}
// // // //           contentContainerStyle={
// // // //             styles.shopIconsList
// // // //           }
// // // //         />

// // // //         {/* Selected shop name display */}
// // // //         {selectedBusinessId && (
// // // //           <View style={styles.selectedShopDisplay}>
// // // //             <Icon
// // // //               name="checkmark-circle"
// // // //               size={20}
// // // //               color={colors.primary}
// // // //             />
// // // //             <Text style={styles.selectedShopText}>
// // // //               {businesses.find(
// // // //                 biz =>
// // // //                   String(biz.id) ===
// // // //                   String(selectedBusinessId)
// // // //               )?.business_name || 'Selected Shop'}
// // // //             </Text>
// // // //           </View>
// // // //         )}
// // // //       </View>

// // // //       {/* AVAILABLE PRODUCTS */}
// // // //       <View
// // // //         style={
// // // //           styles.restaurantsSection
// // // //         }
// // // //       >
// // // //         <View
// // // //           style={
// // // //             styles.sectionHeader
// // // //           }
// // // //         >
// // // //           <Text
// // // //             style={
// // // //               styles.sectionTitle
// // // //             }
// // // //           >
// // // //             Available Products
// // // //           </Text>
// // // //         </View>

// // // //         {!selectedBusinessId ? (
// // // //           <View
// // // //             style={
// // // //               styles.emptyProducts
// // // //             }
// // // //           >
// // // //             <Icon
// // // //               name="storefront-outline"
// // // //               size={45}
// // // //               color="#b5b5b5"
// // // //             />

// // // //             <Text
// // // //               style={
// // // //                 styles.emptyProductsText
// // // //               }
// // // //             >
// // // //               Select a shop to view
// // // //               products
// // // //             </Text>
// // // //           </View>
// // // //         ) : products.length === 0 ? (
// // // //           <View
// // // //             style={
// // // //               styles.emptyProducts
// // // //             }
// // // //           >
// // // //             <Icon
// // // //               name="cube-outline"
// // // //               size={45}
// // // //               color="#b5b5b5"
// // // //             />

// // // //             <Text
// // // //               style={
// // // //                 styles.emptyProductsText
// // // //               }
// // // //             >
// // // //               No products available
// // // //             </Text>
// // // //           </View>
// // // //         ) : (
// // // //           products.map(
// // // //             (product: any) =>
// // // //               renderProduct({
// // // //                 item: product,
// // // //               })
// // // //           )
// // // //         )}
// // // //       </View>

// // // //       {/* STORES NEAR YOU */}
// // // //       <View
// // // //         style={
// // // //           styles.restaurantsSection
// // // //         }
// // // //       >
// // // //         <Text
// // // //           style={
// // // //             styles.sectionTitle
// // // //           }
// // // //         >
// // // //           Stores near you
// // // //         </Text>

// // // //         {businesses.map(
// // // //           (biz: any) => (
// // // //             <TouchableOpacity
// // // //               key={biz.id}
// // // //               style={
// // // //                 styles.offerCard2
// // // //               }
// // // //               onPress={() => {
// // // //                 setSelectedBusiness(
// // // //                   {
// // // //                     id: biz.id,
// // // //                     name:
// // // //                       biz.business_name,
// // // //                   }
// // // //                 );

// // // //                 setSelectedBusinessId(
// // // //                   Number(biz.id)
// // // //                 );

// // // //                 navigation.navigate(
// // // //                   'Search',
// // // //                   {
// // // //                     businessId:
// // // //                       biz.id,
// // // //                     businessName:
// // // //                       biz.business_name,
// // // //                   }
// // // //                 );
// // // //               }}
// // // //             >
// // // //               <Text
// // // //                 style={
// // // //                   styles.productName
// // // //                 }
// // // //               >
// // // //                 {biz.business_name}
// // // //               </Text>

// // // //               <Text
// // // //                 style={
// // // //                   styles.productCategory
// // // //                 }
// // // //               >
// // // //                 {biz.business_type}
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //           )
// // // //         )}
// // // //       </View>
// // // //     </ScrollView>
// // // //   );
// // // // }

// // // // // =========================================================
// // // // // STYLES
// // // // // =========================================================

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: colors.white,
// // // //     paddingHorizontal: 16,
// // // //   },

// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     justifyContent:
// // // //       'space-between',
// // // //     alignItems: 'flex-start',
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

// // // //   businessCard: {
// // // //     marginTop: 6,
// // // //     backgroundColor: '#f0f7ff',
// // // //     borderRadius: 8,
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 5,
// // // //     borderWidth: 1,
// // // //     borderColor: '#d4e4ff',
// // // //     alignSelf: 'flex-start',
// // // //   },

// // // //   businessCardContent: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },

// // // //   businessName: {
// // // //     fontSize: 13,
// // // //     fontWeight: '600',
// // // //     color: colors.primary,
// // // //     marginLeft: 6,
// // // //   },

// // // //   businessBadge: {
// // // //     backgroundColor:
// // // //       colors.primary,
// // // //     borderRadius: 4,
// // // //     paddingHorizontal: 6,
// // // //     paddingVertical: 1,
// // // //     marginLeft: 8,
// // // //   },

// // // //   businessBadgeText: {
// // // //     fontSize: 8,
// // // //     color: colors.white,
// // // //     fontWeight: '700',
// // // //   },

// // // //   // =====================================================
// // // //   // SEARCH
// // // //   // =====================================================

// // // //   searchContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor:
// // // //       colors.lightGray,
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

// // // //   // =====================================================
// // // //   // OFFERS - REMOVED
// // // //   // =====================================================

// // // //   // =====================================================
// // // //   // SHOP SELECTOR SECTION
// // // //   // =====================================================

// // // //   shopSelectorSection: {
// // // //     marginVertical: 8,
// // // //   },

// // // //   sectionTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: colors.text,
// // // //     marginBottom: 12,
// // // //   },

// // // //   shopIconsList: {
// // // //     paddingVertical: 4,
// // // //   },

// // // //   shopIconItem: {
// // // //     alignItems: 'center',
// // // //     marginRight: 20,
// // // //     width: 72,
// // // //   },

// // // //   shopIconItemSelected: {
// // // //     // Additional styles for selected state
// // // //   },

// // // //   shopIconCircle: {
// // // //     width: 60,
// // // //     height: 60,
// // // //     borderRadius: 30,
// // // //     backgroundColor: '#f0f7ff',
// // // //     borderWidth: 2,
// // // //     borderColor: '#d4e4ff',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 4,
// // // //   },

// // // //   shopIconCircleSelected: {
// // // //     backgroundColor: colors.primary,
// // // //     borderColor: colors.primary,
// // // //   },

// // // //   shopIconName: {
// // // //     fontSize: 11,
// // // //     color: colors.text,
// // // //     textAlign: 'center',
// // // //   },

// // // //   shopIconNameSelected: {
// // // //     color: colors.primary,
// // // //     fontWeight: '600',
// // // //   },

// // // //   selectedShopDisplay: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#f0f7ff',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 8,
// // // //     marginTop: 4,
// // // //     marginBottom: 8,
// // // //   },

// // // //   selectedShopText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: colors.primary,
// // // //     marginLeft: 8,
// // // //   },

// // // //   // =====================================================
// // // //   // CATEGORIES - REMOVED
// // // //   // =====================================================

// // // //   categoriesSection: {
// // // //     marginVertical: 8,
// // // //   },

// // // //   categoriesList: {
// // // //     paddingVertical: 4,
// // // //   },

// // // //   // =====================================================
// // // //   // PRODUCT CARD
// // // //   // =====================================================

// // // //   productCard: {
// // // //     backgroundColor:
// // // //       colors.lightGray,
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 12,

// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent:
// // // //       'space-between',
// // // //   },

// // // //   productClickable: {
// // // //     flex: 1,
// // // //     marginRight: 10,
// // // //   },

// // // //   productInfo: {
// // // //     flex: 1,
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

// // // //   productAction: {
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },

// // // //   // =====================================================
// // // //   // ADD BUTTON
// // // //   // =====================================================

// // // //   addButton: {
// // // //     borderWidth: 1,
// // // //     borderColor:
// // // //       colors.primary,
// // // //     backgroundColor:
// // // //       colors.white,
// // // //     borderRadius: 6,
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 7,
// // // //     minWidth: 58,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   addButtonText: {
// // // //     color: colors.primary,
// // // //     fontSize: 12,
// // // //     fontWeight: '700',
// // // //   },

// // // //   // =====================================================
// // // //   // QUANTITY
// // // //   // =====================================================

// // // //   quantityContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     borderWidth: 1,
// // // //     borderColor:
// // // //       colors.primary,
// // // //     borderRadius: 6,
// // // //     backgroundColor:
// // // //       colors.white,
// // // //     paddingHorizontal: 3,
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
// // // //     color: colors.text,
// // // //     minWidth: 22,
// // // //     textAlign: 'center',
// // // //   },

// // // //   // =====================================================
// // // //   // EMPTY PRODUCTS
// // // //   // =====================================================

// // // //   emptyProducts: {
// // // //     backgroundColor:
// // // //       colors.lightGray,
// // // //     borderRadius: 12,
// // // //     paddingVertical: 35,
// // // //     paddingHorizontal: 20,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   emptyProductsText: {
// // // //     fontSize: 14,
// // // //     color: colors.textLight,
// // // //     marginTop: 10,
// // // //     textAlign: 'center',
// // // //   },

// // // //   // =====================================================
// // // //   // STORE CARDS
// // // //   // =====================================================

// // // //   offerCard2: {
// // // //     backgroundColor:
// // // //       colors.lightGray,
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 12,
// // // //   },

// // // //   // =====================================================
// // // //   // RESTAURANTS SECTION
// // // //   // =====================================================

// // // //   restaurantsSection: {
// // // //     marginVertical: 8,
// // // //     paddingBottom: 30,
// // // //   },

// // // //   sectionHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent:
// // // //       'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 12,
// // // //   },
// // // // });
// // // // import React, {
// // // //   useState,
// // // //   useEffect,
// // // //   useContext,
// // // // } from 'react';

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
// // // // import {
// // // //   categories,
// // // //   offers,
// // // // } from '../../constants/dummyData';

// // // // import axios from 'axios';
// // // // import { API_URL } from '@env';

// // // // import CategoryItem from '../../components/home/CategoryItem';

// // // // import {
// // // //   Category,
// // // //   Offer,
// // // // } from '../../types';

// // // // import { AuthContext } from '../../context/AuthContext';
// // // // import { CartContext } from '../../context/CartContext';

// // // // import { businessAPI } from '../../api/endpoints';

// // // // import {
// // // //   SelectedBusinessContext,
// // // // } from '../../context/SelectedBusinessContext';

// // // // const { width } = Dimensions.get('window');

// // // // export default function HomeScreen({
// // // //   navigation,
// // // // }: any) {
// // // //   const [searchText, setSearchText] =
// // // //     useState<string>('');

// // // //   const [products, setProducts] =
// // // //     useState<any[]>([]);

// // // //   const { user } =
// // // //     useContext(AuthContext);

// // // //   const [businesses, setBusinesses] =
// // // //     useState<any[]>([]);

// // // //   const [selectedBusinessId, setSelectedBusinessId] =
// // // //     useState<number | null>(null);

// // // //   const {
// // // //     selectedBusiness,
// // // //     setSelectedBusiness,
// // // //   } = useContext(
// // // //     SelectedBusinessContext
// // // //   );

// // // //   // =====================================================
// // // //   // CART CONTEXT
// // // //   // =====================================================

// // // //   const {
// // // //     cartItems,
// // // //     addToCart,
// // // //     updateQuantity,
// // // //     removeFromCart,
// // // //   } = useContext(CartContext);

// // // //   // =====================================================
// // // //   // LOAD BUSINESSES
// // // //   // =====================================================

// // // //   useEffect(() => {
// // // //     businessAPI
// // // //       .getBusinesses({})
// // // //       .then((res: any) => {
// // // //         console.log('📦 Response from API:', res);
        
// // // //         let businessesData = [];
        
// // // //         // Handle different response formats
// // // //         if (Array.isArray(res)) {
// // // //           businessesData = res;
// // // //           console.log('✅ Case 1: Direct array, count:', businessesData.length);
// // // //         } else if (res?.data && Array.isArray(res.data)) {
// // // //           businessesData = res.data;
// // // //           console.log('✅ Case 2: res.data array, count:', businessesData.length);
// // // //         } else if (res?.data?.data && Array.isArray(res.data.data)) {
// // // //           businessesData = res.data.data;
// // // //           console.log('✅ Case 3: res.data.data array, count:', businessesData.length);
// // // //         } else if (res?.businesses && Array.isArray(res.businesses)) {
// // // //           businessesData = res.businesses;
// // // //           console.log('✅ Case 4: res.businesses array, count:', businessesData.length);
// // // //         } else {
// // // //           console.log('❌ No data found in any format');
// // // //         }
        
// // // //         console.log('🏪 Business names:', businessesData.map((b: any) => b.business_name || b.businessName));
// // // //         setBusinesses(businessesData);
// // // //       })
// // // //       .catch((err: any) => {
// // // //         console.error('❌ Failed to load businesses:', err);
// // // //         setBusinesses([]);
// // // //       });
// // // //   }, []);

// // // //   // =====================================================
// // // //   // USER LOG
// // // //   // =====================================================

// // // //   useEffect(() => {
// // // //     console.log(
// // // //       '🏪 USER OBJECT:',
// // // //       user
// // // //     );
// // // //   }, [user]);

// // // //   // =====================================================
// // // //   // CATEGORY
// // // //   // =====================================================

// // // //   const renderCategory = ({
// // // //     item,
// // // //   }: {
// // // //     item: Category;
// // // //   }) => (
// // // //     <CategoryItem category={item} />
// // // //   );

// // // //   // =====================================================
// // // //   // OFFER
// // // //   // =====================================================

// // // //   const renderOffer = ({
// // // //     item,
// // // //   }: {
// // // //     item: Offer;
// // // //   }) => (
// // // //     <View style={styles.offerCard}>
// // // //       <Text style={styles.offerTitle}>
// // // //         {item.title}
// // // //       </Text>

// // // //       <Text
// // // //         style={styles.offerDescription}
// // // //       >
// // // //         {item.description}
// // // //       </Text>
// // // //     </View>
// // // //   );

// // // //   // =====================================================
// // // //   // BUSINESS NAME
// // // //   // =====================================================

// // // //   const businessName =
// // // //     user?.business_name ||
// // // //     'No Business Found';

// // // //   const plan =
// // // //     user?.business_plan ||
// // // //     'FREE';

// // // //   const displayName =
// // // //     businessName.length > 20
// // // //       ? businessName.substring(0, 20) +
// // // //         '...'
// // // //       : businessName;

// // // //   // =====================================================
// // // //   // SHOP CHANGE
// // // //   // =====================================================

// // // //   const handleBusinessChange = (businessId: number) => {
// // // //     if (businessId === selectedBusinessId) {
// // // //       // Deselect if clicking the same shop
// // // //       setSelectedBusinessId(null);
// // // //       setSelectedBusiness(null);
// // // //       setProducts([]);
// // // //       return;
// // // //     }

// // // //     const business =
// // // //       businesses.find(
// // // //         biz =>
// // // //           String(biz.id) ===
// // // //           String(businessId)
// // // //       );

// // // //     setSelectedBusinessId(
// // // //       Number(businessId)
// // // //     );

// // // //     if (business) {
// // // //       setSelectedBusiness({
// // // //         id: business.id,
// // // //         name: business.business_name,
// // // //       });
// // // //     }

// // // //     console.log(
// // // //       '🏪 Selected Shop:',
// // // //       business
// // // //     );
// // // //   };

// // // //   // =====================================================
// // // //   // STORE CARD RENDERER (NEW)
// // // //   // =====================================================

// // // //   const renderStoreCard = ({ item }: { item: any }) => (
// // // //     <TouchableOpacity
// // // //       style={[
// // // //         styles.storeCard,
// // // //         selectedBusinessId === item.id &&
// // // //           styles.storeCardSelected,
// // // //       ]}
// // // //       onPress={() =>
// // // //         handleBusinessChange(item.id)
// // // //       }
// // // //       activeOpacity={0.8}
// // // //     >
// // // //       <View style={styles.storeCardContent}>
// // // //         <View style={styles.storeIconContainer}>
// // // //           <Icon
// // // //             name="storefront"
// // // //             size={32}
// // // //             color={
// // // //               selectedBusinessId === item.id
// // // //                 ? colors.white
// // // //                 : colors.primary
// // // //             }
// // // //           />
// // // //         </View>
        
// // // //         <View style={styles.storeInfo}>
// // // //           <Text
// // // //             style={[
// // // //               styles.storeName,
// // // //               selectedBusinessId === item.id &&
// // // //                 styles.storeNameSelected,
// // // //             ]}
// // // //             numberOfLines={1}
// // // //           >
// // // //             {item.business_name || 'Unnamed Store'}
// // // //           </Text>
          
// // // //           <Text
// // // //             style={styles.storeType}
// // // //             numberOfLines={1}
// // // //           >
// // // //             {item.business_type || 'General Store'}
// // // //           </Text>
          
// // // //           {item.address && (
// // // //             <Text
// // // //               style={styles.storeAddress}
// // // //               numberOfLines={1}
// // // //             >
// // // //               <Icon name="location-outline" size={12} color={colors.textLight} />
// // // //               {' '}{item.address}
// // // //             </Text>
// // // //           )}
          
// // // //           <View style={styles.storeMeta}>
// // // //             {item.rating && (
// // // //               <View style={styles.storeRating}>
// // // //                 <Icon name="star" size={12} color="#FFD700" />
// // // //                 <Text style={styles.storeRatingText}>
// // // //                   {item.rating}
// // // //                 </Text>
// // // //               </View>
// // // //             )}
            
// // // //             {item.delivery_time && (
// // // //               <Text style={styles.storeDelivery}>
// // // //                 <Icon name="time-outline" size={12} color={colors.textLight} />
// // // //                 {' '}{item.delivery_time}
// // // //               </Text>
// // // //             )}
// // // //           </View>
// // // //         </View>
        
// // // //         {selectedBusinessId === item.id && (
// // // //           <View style={styles.selectedBadge}>
// // // //             <Icon
// // // //               name="checkmark-circle"
// // // //               size={24}
// // // //               color={colors.primary}
// // // //             />
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   // =====================================================
// // // //   // SHOP ICON RENDERER (For horizontal scroll)
// // // //   // =====================================================

// // // //   const renderShopIcon = ({ item }: { item: any }) => (
// // // //     <TouchableOpacity
// // // //       style={[
// // // //         styles.shopIconItem,
// // // //         selectedBusinessId === item.id &&
// // // //           styles.shopIconItemSelected,
// // // //       ]}
// // // //       onPress={() =>
// // // //         handleBusinessChange(item.id)
// // // //       }
// // // //     >
// // // //       <View
// // // //         style={[
// // // //           styles.shopIconCircle,
// // // //           selectedBusinessId === item.id &&
// // // //             styles.shopIconCircleSelected,
// // // //         ]}
// // // //       >
// // // //         <Icon
// // // //           name="storefront"
// // // //           size={28}
// // // //           color={
// // // //             selectedBusinessId === item.id
// // // //               ? colors.white
// // // //               : colors.primary
// // // //           }
// // // //         />
// // // //       </View>
// // // //       <Text
// // // //         style={[
// // // //           styles.shopIconName,
// // // //           selectedBusinessId === item.id &&
// // // //             styles.shopIconNameSelected,
// // // //         ]}
// // // //         numberOfLines={1}
// // // //       >
// // // //         {item.business_name}
// // // //       </Text>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   // =====================================================
// // // //   // UI
// // // //   // =====================================================

// // // //   return (
// // // //     <ScrollView
// // // //       style={styles.container}
// // // //       showsVerticalScrollIndicator={
// // // //         false
// // // //       }
// // // //     >
// // // //       {/* HEADER */}
// // // //       <View style={styles.header}>
// // // //         <View>
// // // //           <Text
// // // //             style={
// // // //               styles.locationLabel
// // // //             }
// // // //           >
// // // //             📍 Home
// // // //           </Text>

// // // //           <Text
// // // //             style={styles.location}
// // // //           >
// // // //             Sector 1, HSR Layout
// // // //           </Text>

// // // //           <View
// // // //             style={
// // // //               styles.businessCard
// // // //             }
// // // //           >
// // // //             <View
// // // //               style={
// // // //                 styles.businessCardContent
// // // //               }
// // // //             >
// // // //               <Icon
// // // //                 name="business-outline"
// // // //                 size={16}
// // // //                 color={colors.primary}
// // // //               />

// // // //               <Text
// // // //                 style={
// // // //                   styles.businessName
// // // //                 }
// // // //               >
// // // //                 {displayName}
// // // //               </Text>

// // // //               {user?.business_name &&
// // // //                 user.business_name !==
// // // //                   'No Business Found' && (
// // // //                   <View
// // // //                     style={
// // // //                       styles.businessBadge
// // // //                     }
// // // //                   >
// // // //                     <Text
// // // //                       style={
// // // //                         styles.businessBadgeText
// // // //                       }
// // // //                     >
// // // //                       {plan}
// // // //                     </Text>
// // // //                   </View>
// // // //                 )}
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         <TouchableOpacity
// // // //           onPress={() =>
// // // //             navigation.navigate(
// // // //               'Profile'
// // // //             )
// // // //           }
// // // //         >
// // // //           <Icon
// // // //             name="person-circle-outline"
// // // //             size={40}
// // // //             color={colors.primary}
// // // //           />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* SEARCH */}
// // // //       <View
// // // //         style={
// // // //           styles.searchContainer
// // // //         }
// // // //       >
// // // //         <Icon
// // // //           name="search"
// // // //           size={20}
// // // //           color={colors.gray}
// // // //           style={styles.searchIcon}
// // // //         />

// // // //         <TextInput
// // // //           style={styles.searchInput}
// // // //           placeholder="Search for restaurant, item or more"
// // // //           value={searchText}
// // // //           onChangeText={
// // // //             setSearchText
// // // //           }
// // // //           onFocus={() =>
// // // //             navigation.navigate(
// // // //               'Search'
// // // //             )
// // // //           }
// // // //         />
// // // //       </View>

// // // //       {/* SHOP SELECTOR - HORIZONTAL SCROLLABLE ICONS */}
// // // //       <View
// // // //         style={
// // // //           styles.shopSelectorSection
// // // //         }
// // // //       >
// // // //         <Text
// // // //           style={
// // // //             styles.sectionTitle
// // // //           }
// // // //         >
// // // //           Select a shop
// // // //         </Text>

// // // //         <FlatList
// // // //           data={businesses}
// // // //           renderItem={renderShopIcon}
// // // //           keyExtractor={(item) => item.id.toString()}
// // // //           horizontal
// // // //           showsHorizontalScrollIndicator={false}
// // // //           contentContainerStyle={
// // // //             styles.shopIconsList
// // // //           }
// // // //         />

// // // //         {/* Selected shop name display */}
// // // //         {selectedBusinessId && (
// // // //           <View style={styles.selectedShopDisplay}>
// // // //             <Icon
// // // //               name="checkmark-circle"
// // // //               size={20}
// // // //               color={colors.primary}
// // // //             />
// // // //             <Text style={styles.selectedShopText}>
// // // //               {businesses.find(
// // // //                 biz =>
// // // //                   String(biz.id) ===
// // // //                   String(selectedBusinessId)
// // // //               )?.business_name || 'Selected Shop'}
// // // //             </Text>
// // // //           </View>
// // // //         )}
// // // //       </View>

// // // //       {/* AVAILABLE STORES (Replaces Available Products) */}
// // // //       <View
// // // //         style={
// // // //           styles.restaurantsSection
// // // //         }
// // // //       >
// // // //         <View
// // // //           style={
// // // //             styles.sectionHeader
// // // //           }
// // // //         >
// // // //           <Text
// // // //             style={
// // // //               styles.sectionTitle
// // // //             }
// // // //           >
// // // //             Available Stores
// // // //           </Text>
// // // //           <Text style={styles.storeCount}>
// // // //             {businesses.length} stores
// // // //           </Text>
// // // //         </View>

// // // //         {businesses.length === 0 ? (
// // // //           <View
// // // //             style={
// // // //               styles.emptyProducts
// // // //             }
// // // //           >
// // // //             <Icon
// // // //               name="storefront-outline"
// // // //               size={45}
// // // //               color="#b5b5b5"
// // // //             />

// // // //             <Text
// // // //               style={
// // // //                 styles.emptyProductsText
// // // //               }
// // // //             >
// // // //               No stores available
// // // //             </Text>
// // // //           </View>
// // // //         ) : (
// // // //           businesses.map(
// // // //             (store: any) =>
// // // //               renderStoreCard({
// // // //                 item: store,
// // // //               })
// // // //           )
// // // //         )}
// // // //       </View>

// // // //       {/* STORES NEAR YOU - Duplicate removed to avoid confusion */}
// // // //     </ScrollView>
// // // //   );
// // // // }

// // // // // =========================================================
// // // // // STYLES
// // // // // =========================================================

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: colors.white,
// // // //     paddingHorizontal: 16,
// // // //   },

// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     justifyContent:
// // // //       'space-between',
// // // //     alignItems: 'flex-start',
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

// // // //   businessCard: {
// // // //     marginTop: 6,
// // // //     backgroundColor: '#f0f7ff',
// // // //     borderRadius: 8,
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 5,
// // // //     borderWidth: 1,
// // // //     borderColor: '#d4e4ff',
// // // //     alignSelf: 'flex-start',
// // // //   },

// // // //   businessCardContent: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },

// // // //   businessName: {
// // // //     fontSize: 13,
// // // //     fontWeight: '600',
// // // //     color: colors.primary,
// // // //     marginLeft: 6,
// // // //   },

// // // //   businessBadge: {
// // // //     backgroundColor:
// // // //       colors.primary,
// // // //     borderRadius: 4,
// // // //     paddingHorizontal: 6,
// // // //     paddingVertical: 1,
// // // //     marginLeft: 8,
// // // //   },

// // // //   businessBadgeText: {
// // // //     fontSize: 8,
// // // //     color: colors.white,
// // // //     fontWeight: '700',
// // // //   },

// // // //   // =====================================================
// // // //   // SEARCH
// // // //   // =====================================================

// // // //   searchContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor:
// // // //       colors.lightGray,
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

// // // //   // =====================================================
// // // //   // SHOP SELECTOR SECTION
// // // //   // =====================================================

// // // //   shopSelectorSection: {
// // // //     marginVertical: 8,
// // // //   },

// // // //   sectionTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: colors.text,
// // // //     marginBottom: 12,
// // // //   },

// // // //   shopIconsList: {
// // // //     paddingVertical: 4,
// // // //   },

// // // //   shopIconItem: {
// // // //     alignItems: 'center',
// // // //     marginRight: 20,
// // // //     width: 72,
// // // //   },

// // // //   shopIconItemSelected: {
// // // //     // Additional styles for selected state
// // // //   },

// // // //   shopIconCircle: {
// // // //     width: 60,
// // // //     height: 60,
// // // //     borderRadius: 30,
// // // //     backgroundColor: '#f0f7ff',
// // // //     borderWidth: 2,
// // // //     borderColor: '#d4e4ff',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 4,
// // // //   },

// // // //   shopIconCircleSelected: {
// // // //     backgroundColor: colors.primary,
// // // //     borderColor: colors.primary,
// // // //   },

// // // //   shopIconName: {
// // // //     fontSize: 11,
// // // //     color: colors.text,
// // // //     textAlign: 'center',
// // // //   },

// // // //   shopIconNameSelected: {
// // // //     color: colors.primary,
// // // //     fontWeight: '600',
// // // //   },

// // // //   selectedShopDisplay: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#f0f7ff',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 8,
// // // //     marginTop: 4,
// // // //     marginBottom: 8,
// // // //   },

// // // //   selectedShopText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: colors.primary,
// // // //     marginLeft: 8,
// // // //   },

// // // //   // =====================================================
// // // //   // STORE CARD (NEW)
// // // //   // =====================================================

// // // //   storeCard: {
// // // //     backgroundColor: colors.lightGray,
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 12,
// // // //     borderWidth: 2,
// // // //     borderColor: 'transparent',
// // // //   },

// // // //   storeCardSelected: {
// // // //     borderColor: colors.primary,
// // // //     backgroundColor: '#f0f7ff',
// // // //   },

// // // //   storeCardContent: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },

// // // //   storeIconContainer: {
// // // //     width: 56,
// // // //     height: 56,
// // // //     borderRadius: 28,
// // // //     backgroundColor: colors.white,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 14,
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //   },

// // // //   storeInfo: {
// // // //     flex: 1,
// // // //   },

// // // //   storeName: {
// // // //     fontSize: 16,
// // // //     fontWeight: '700',
// // // //     color: colors.text,
// // // //     marginBottom: 2,
// // // //   },

// // // //   storeNameSelected: {
// // // //     color: colors.primary,
// // // //   },

// // // //   storeType: {
// // // //     fontSize: 13,
// // // //     color: colors.textLight,
// // // //     marginBottom: 2,
// // // //   },

// // // //   storeAddress: {
// // // //     fontSize: 12,
// // // //     color: colors.textLight,
// // // //     marginBottom: 4,
// // // //   },

// // // //   storeMeta: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 2,
// // // //   },

// // // //   storeRating: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //   },

// // // //   storeRatingText: {
// // // //     fontSize: 12,
// // // //     color: colors.text,
// // // //     marginLeft: 2,
// // // //     fontWeight: '600',
// // // //   },

// // // //   storeDelivery: {
// // // //     fontSize: 12,
// // // //     color: colors.textLight,
// // // //   },

// // // //   selectedBadge: {
// // // //     marginLeft: 8,
// // // //   },

// // // //   // =====================================================
// // // //   // EMPTY STORES
// // // //   // =====================================================

// // // //   emptyProducts: {
// // // //     backgroundColor:
// // // //       colors.lightGray,
// // // //     borderRadius: 12,
// // // //     paddingVertical: 35,
// // // //     paddingHorizontal: 20,
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //   },

// // // //   emptyProductsText: {
// // // //     fontSize: 14,
// // // //     color: colors.textLight,
// // // //     marginTop: 10,
// // // //     textAlign: 'center',
// // // //   },

// // // //   // =====================================================
// // // //   // RESTAURANTS SECTION
// // // //   // =====================================================

// // // //   restaurantsSection: {
// // // //     marginVertical: 8,
// // // //     paddingBottom: 30,
// // // //   },

// // // //   sectionHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent:
// // // //       'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 12,
// // // //   },

// // // //   storeCount: {
// // // //     fontSize: 14,
// // // //     color: colors.textLight,
// // // //   },
// // // // });

// // // // // import React, {
// // // // //   useState,
// // // // //   useEffect,
// // // // //   useContext,
// // // // // } from 'react';

// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TextInput,
// // // // //   TouchableOpacity,
// // // // //   FlatList,
// // // // //   StyleSheet,
// // // // //   Dimensions,
// // // // // } from 'react-native';

// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { colors } from '../../constants/colors';
// // // // // import {
// // // // //   categories,
// // // // //   offers,
// // // // // } from '../../constants/dummyData';

// // // // // import axios from 'axios';
// // // // // import { API_URL } from '@env';

// // // // // import CategoryItem from '../../components/home/CategoryItem';

// // // // // import {
// // // // //   Category,
// // // // //   Offer,
// // // // // } from '../../types';

// // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // import { CartContext } from '../../context/CartContext';

// // // // // import { businessAPI } from '../../api/endpoints';

// // // // // import {
// // // // //   SelectedBusinessContext,
// // // // // } from '../../context/SelectedBusinessContext';

// // // // // const { width } = Dimensions.get('window');

// // // // // export default function HomeScreen({
// // // // //   navigation,
// // // // // }: any) {
// // // // //   const [searchText, setSearchText] =
// // // // //     useState<string>('');

// // // // //   const [products, setProducts] =
// // // // //     useState<any[]>([]);

// // // // //   const { user } =
// // // // //     useContext(AuthContext);

// // // // //   const [businesses, setBusinesses] =
// // // // //     useState<any[]>([]);

// // // // //   const [selectedBusinessId, setSelectedBusinessId] =
// // // // //     useState<number | null>(null);

// // // // //   const {
// // // // //     selectedBusiness,
// // // // //     setSelectedBusiness,
// // // // //   } = useContext(
// // // // //     SelectedBusinessContext
// // // // //   );

// // // // //   // =====================================================
// // // // //   // CART CONTEXT
// // // // //   // =====================================================

// // // // //   const {
// // // // //     cartItems,
// // // // //     addToCart,
// // // // //     updateQuantity,
// // // // //     removeFromCart,
// // // // //   } = useContext(CartContext);

// // // // //   // =====================================================
// // // // //   // LOAD BUSINESSES
// // // // //   // =====================================================

// // // // //   useEffect(() => {
// // // // //     businessAPI
// // // // //       .getBusinesses({})
// // // // //       .then((res: any) => {
// // // // //         console.log('📦 Response from API:', res);
        
// // // // //         let businessesData = [];
        
// // // // //         // Handle different response formats
// // // // //         if (Array.isArray(res)) {
// // // // //           businessesData = res;
// // // // //           console.log('✅ Case 1: Direct array, count:', businessesData.length);
// // // // //         } else if (res?.data && Array.isArray(res.data)) {
// // // // //           businessesData = res.data;
// // // // //           console.log('✅ Case 2: res.data array, count:', businessesData.length);
// // // // //         } else if (res?.data?.data && Array.isArray(res.data.data)) {
// // // // //           businessesData = res.data.data;
// // // // //           console.log('✅ Case 3: res.data.data array, count:', businessesData.length);
// // // // //         } else if (res?.businesses && Array.isArray(res.businesses)) {
// // // // //           businessesData = res.businesses;
// // // // //           console.log('✅ Case 4: res.businesses array, count:', businessesData.length);
// // // // //         } else {
// // // // //           console.log('❌ No data found in any format');
// // // // //         }
        
// // // // //         console.log('🏪 Business names:', businessesData.map((b: any) => b.business_name || b.businessName));
// // // // //         setBusinesses(businessesData);
// // // // //       })
// // // // //       .catch((err: any) => {
// // // // //         console.error('❌ Failed to load businesses:', err);
// // // // //         setBusinesses([]);
// // // // //       });
// // // // //   }, []);

// // // // //   // =====================================================
// // // // //   // USER LOG
// // // // //   // =====================================================

// // // // //   useEffect(() => {
// // // // //     console.log(
// // // // //       '🏪 USER OBJECT:',
// // // // //       user
// // // // //     );
// // // // //   }, [user]);

// // // // //   // =====================================================
// // // // //   // CATEGORY
// // // // //   // =====================================================

// // // // //   const renderCategory = ({
// // // // //     item,
// // // // //   }: {
// // // // //     item: Category;
// // // // //   }) => (
// // // // //     <CategoryItem category={item} />
// // // // //   );

// // // // //   // =====================================================
// // // // //   // OFFER
// // // // //   // =====================================================

// // // // //   const renderOffer = ({
// // // // //     item,
// // // // //   }: {
// // // // //     item: Offer;
// // // // //   }) => (
// // // // //     <View style={styles.offerCard}>
// // // // //       <Text style={styles.offerTitle}>
// // // // //         {item.title}
// // // // //       </Text>

// // // // //       <Text
// // // // //         style={styles.offerDescription}
// // // // //       >
// // // // //         {item.description}
// // // // //       </Text>
// // // // //     </View>
// // // // //   );

// // // // //   // =====================================================
// // // // //   // BUSINESS NAME
// // // // //   // =====================================================

// // // // //   const businessName =
// // // // //     user?.business_name ||
// // // // //     'No Business Found';

// // // // //   const plan =
// // // // //     user?.business_plan ||
// // // // //     'FREE';

// // // // //   const displayName =
// // // // //     businessName.length > 20
// // // // //       ? businessName.substring(0, 20) +
// // // // //         '...'
// // // // //       : businessName;

// // // // //   // =====================================================
// // // // //   // SHOP CHANGE
// // // // //   // =====================================================

// // // // //   const handleBusinessChange = (businessId: number) => {
// // // // //     if (businessId === selectedBusinessId) {
// // // // //       // Deselect if clicking the same shop
// // // // //       setSelectedBusinessId(null);
// // // // //       setSelectedBusiness(null);
// // // // //       setProducts([]);
// // // // //       return;
// // // // //     }

// // // // //     const business =
// // // // //       businesses.find(
// // // // //         biz =>
// // // // //           String(biz.id) ===
// // // // //           String(businessId)
// // // // //       );

// // // // //     setSelectedBusinessId(
// // // // //       Number(businessId)
// // // // //     );

// // // // //     if (business) {
// // // // //       setSelectedBusiness({
// // // // //         id: business.id,
// // // // //         name: business.business_name,
// // // // //       });
// // // // //     }

// // // // //     console.log(
// // // // //       '🏪 Selected Shop:',
// // // // //       business
// // // // //     );
// // // // //   };

// // // // //   // =====================================================
// // // // //   // STORE CARD RENDERER (UPDATED - Navigates to ProductList)
// // // // //   // =====================================================

// // // // //   const renderStoreCard = ({ item }: { item: any }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.storeCard}
// // // // //       onPress={() => {
// // // // //         // Navigate to product list screen
// // // // //         navigation.navigate('ProductList', {
// // // // //           storeId: item.id,
// // // // //           storeName: item.business_name || 'Store',
// // // // //         });
// // // // //       }}
// // // // //       activeOpacity={0.8}
// // // // //     >
// // // // //       <View style={styles.storeCardContent}>
// // // // //         <View style={styles.storeIconContainer}>
// // // // //           <Icon
// // // // //             name="storefront"
// // // // //             size={32}
// // // // //             color={colors.primary}
// // // // //           />
// // // // //         </View>
        
// // // // //         <View style={styles.storeInfo}>
// // // // //           <Text
// // // // //             style={styles.storeName}
// // // // //             numberOfLines={1}
// // // // //           >
// // // // //             {item.business_name || 'Unnamed Store'}
// // // // //           </Text>
          
// // // // //           <Text
// // // // //             style={styles.storeType}
// // // // //             numberOfLines={1}
// // // // //           >
// // // // //             {item.business_type || 'General Store'}
// // // // //           </Text>
          
// // // // //           {item.address && (
// // // // //             <Text
// // // // //               style={styles.storeAddress}
// // // // //               numberOfLines={1}
// // // // //             >
// // // // //               <Icon name="location-outline" size={12} color={colors.textLight} />
// // // // //               {' '}{item.address}
// // // // //             </Text>
// // // // //           )}
          
// // // // //           <View style={styles.storeMeta}>
// // // // //             <Text style={styles.storeProducts}>
// // // // //               <Icon name="cube-outline" size={12} color={colors.textLight} />
// // // // //               {' '}View Products
// // // // //             </Text>
// // // // //           </View>
// // // // //         </View>
        
// // // // //         <Icon name="chevron-forward" size={20} color={colors.textLight} />
// // // // //       </View>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   // =====================================================
// // // // //   // SHOP ICON RENDERER (For horizontal scroll)
// // // // //   // =====================================================

// // // // //   const renderShopIcon = ({ item }: { item: any }) => (
// // // // //     <TouchableOpacity
// // // // //       style={[
// // // // //         styles.shopIconItem,
// // // // //         selectedBusinessId === item.id &&
// // // // //           styles.shopIconItemSelected,
// // // // //       ]}
// // // // //       onPress={() =>
// // // // //         handleBusinessChange(item.id)
// // // // //       }
// // // // //     >
// // // // //       <View
// // // // //         style={[
// // // // //           styles.shopIconCircle,
// // // // //           selectedBusinessId === item.id &&
// // // // //             styles.shopIconCircleSelected,
// // // // //         ]}
// // // // //       >
// // // // //         <Icon
// // // // //           name="storefront"
// // // // //           size={28}
// // // // //           color={
// // // // //             selectedBusinessId === item.id
// // // // //               ? colors.white
// // // // //               : colors.primary
// // // // //           }
// // // // //         />
// // // // //       </View>
// // // // //       <Text
// // // // //         style={[
// // // // //           styles.shopIconName,
// // // // //           selectedBusinessId === item.id &&
// // // // //             styles.shopIconNameSelected,
// // // // //         ]}
// // // // //         numberOfLines={1}
// // // // //       >
// // // // //         {item.business_name}
// // // // //       </Text>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   // =====================================================
// // // // //   // UI
// // // // //   // =====================================================

// // // // //   return (
// // // // //     <ScrollView
// // // // //       style={styles.container}
// // // // //       showsVerticalScrollIndicator={
// // // // //         false
// // // // //       }
// // // // //     >
// // // // //       {/* HEADER */}
// // // // //       <View style={styles.header}>
// // // // //         <View>
// // // // //           <Text
// // // // //             style={
// // // // //               styles.locationLabel
// // // // //             }
// // // // //           >
// // // // //             📍 Home
// // // // //           </Text>

// // // // //           <Text
// // // // //             style={styles.location}
// // // // //           >
// // // // //             Sector 1, HSR Layout
// // // // //           </Text>

// // // // //           <View
// // // // //             style={
// // // // //               styles.businessCard
// // // // //             }
// // // // //           >
// // // // //             <View
// // // // //               style={
// // // // //                 styles.businessCardContent
// // // // //               }
// // // // //             >
// // // // //               <Icon
// // // // //                 name="business-outline"
// // // // //                 size={16}
// // // // //                 color={colors.primary}
// // // // //               />

// // // // //               <Text
// // // // //                 style={
// // // // //                   styles.businessName
// // // // //                 }
// // // // //               >
// // // // //                 {displayName}
// // // // //               </Text>

// // // // //               {user?.business_name &&
// // // // //                 user.business_name !==
// // // // //                   'No Business Found' && (
// // // // //                   <View
// // // // //                     style={
// // // // //                       styles.businessBadge
// // // // //                     }
// // // // //                   >
// // // // //                     <Text
// // // // //                       style={
// // // // //                         styles.businessBadgeText
// // // // //                       }
// // // // //                     >
// // // // //                       {plan}
// // // // //                     </Text>
// // // // //                   </View>
// // // // //                 )}
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         <TouchableOpacity
// // // // //           onPress={() =>
// // // // //             navigation.navigate(
// // // // //               'Profile'
// // // // //             )
// // // // //           }
// // // // //         >
// // // // //           <Icon
// // // // //             name="person-circle-outline"
// // // // //             size={40}
// // // // //             color={colors.primary}
// // // // //           />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       {/* SEARCH */}
// // // // //       <View
// // // // //         style={
// // // // //           styles.searchContainer
// // // // //         }
// // // // //       >
// // // // //         <Icon
// // // // //           name="search"
// // // // //           size={20}
// // // // //           color={colors.gray}
// // // // //           style={styles.searchIcon}
// // // // //         />

// // // // //         <TextInput
// // // // //           style={styles.searchInput}
// // // // //           placeholder="Search for restaurant, item or more"
// // // // //           value={searchText}
// // // // //           onChangeText={
// // // // //             setSearchText
// // // // //           }
// // // // //           onFocus={() =>
// // // // //             navigation.navigate(
// // // // //               'Search'
// // // // //             )
// // // // //           }
// // // // //         />
// // // // //       </View>

// // // // //       {/* SHOP SELECTOR - HORIZONTAL SCROLLABLE ICONS */}
// // // // //       <View
// // // // //         style={
// // // // //           styles.shopSelectorSection
// // // // //         }
// // // // //       >
// // // // //         <Text
// // // // //           style={
// // // // //             styles.sectionTitle
// // // // //           }
// // // // //         >
// // // // //           Select a shop
// // // // //         </Text>

// // // // //         <FlatList
// // // // //           data={businesses}
// // // // //           renderItem={renderShopIcon}
// // // // //           keyExtractor={(item) => item.id.toString()}
// // // // //           horizontal
// // // // //           showsHorizontalScrollIndicator={false}
// // // // //           contentContainerStyle={
// // // // //             styles.shopIconsList
// // // // //           }
// // // // //         />

// // // // //         {/* Selected shop name display */}
// // // // //         {selectedBusinessId && (
// // // // //           <View style={styles.selectedShopDisplay}>
// // // // //             <Icon
// // // // //               name="checkmark-circle"
// // // // //               size={20}
// // // // //               color={colors.primary}
// // // // //             />
// // // // //             <Text style={styles.selectedShopText}>
// // // // //               {businesses.find(
// // // // //                 biz =>
// // // // //                   String(biz.id) ===
// // // // //                   String(selectedBusinessId)
// // // // //               )?.business_name || 'Selected Shop'}
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>

// // // // //       {/* AVAILABLE STORES (Replaces Available Products) */}
// // // // //       <View
// // // // //         style={
// // // // //           styles.restaurantsSection
// // // // //         }
// // // // //       >
// // // // //         <View
// // // // //           style={
// // // // //             styles.sectionHeader
// // // // //           }
// // // // //         >
// // // // //           <Text
// // // // //             style={
// // // // //               styles.sectionTitle
// // // // //             }
// // // // //           >
// // // // //             Available Stores
// // // // //           </Text>
// // // // //           <Text style={styles.storeCount}>
// // // // //             {businesses.length} stores
// // // // //           </Text>
// // // // //         </View>

// // // // //         {businesses.length === 0 ? (
// // // // //           <View
// // // // //             style={
// // // // //               styles.emptyProducts
// // // // //             }
// // // // //           >
// // // // //             <Icon
// // // // //               name="storefront-outline"
// // // // //               size={45}
// // // // //               color="#b5b5b5"
// // // // //             />

// // // // //             <Text
// // // // //               style={
// // // // //                 styles.emptyProductsText
// // // // //               }
// // // // //             >
// // // // //               No stores available
// // // // //             </Text>
// // // // //           </View>
// // // // //         ) : (
// // // // //           businesses.map(
// // // // //             (store: any) =>
// // // // //               renderStoreCard({
// // // // //                 item: store,
// // // // //               })
// // // // //           )
// // // // //         )}
// // // // //       </View>
// // // // //     </ScrollView>
// // // // //   );
// // // // // }

// // // // // // =========================================================
// // // // // // STYLES
// // // // // // =========================================================

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: colors.white,
// // // // //     paddingHorizontal: 16,
// // // // //   },

// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent:
// // // // //       'space-between',
// // // // //     alignItems: 'flex-start',
// // // // //     paddingTop: 16,
// // // // //     paddingBottom: 8,
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

// // // // //   businessCard: {
// // // // //     marginTop: 6,
// // // // //     backgroundColor: '#f0f7ff',
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 10,
// // // // //     paddingVertical: 5,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#d4e4ff',
// // // // //     alignSelf: 'flex-start',
// // // // //   },

// // // // //   businessCardContent: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   businessName: {
// // // // //     fontSize: 13,
// // // // //     fontWeight: '600',
// // // // //     color: colors.primary,
// // // // //     marginLeft: 6,
// // // // //   },

// // // // //   businessBadge: {
// // // // //     backgroundColor:
// // // // //       colors.primary,
// // // // //     borderRadius: 4,
// // // // //     paddingHorizontal: 6,
// // // // //     paddingVertical: 1,
// // // // //     marginLeft: 8,
// // // // //   },

// // // // //   businessBadgeText: {
// // // // //     fontSize: 8,
// // // // //     color: colors.white,
// // // // //     fontWeight: '700',
// // // // //   },

// // // // //   // =====================================================
// // // // //   // SEARCH
// // // // //   // =====================================================

// // // // //   searchContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor:
// // // // //       colors.lightGray,
// // // // //     borderRadius: 12,
// // // // //     paddingHorizontal: 12,
// // // // //     marginVertical: 12,
// // // // //     height: 48,
// // // // //   },

// // // // //   searchIcon: {
// // // // //     marginRight: 8,
// // // // //   },

// // // // //   searchInput: {
// // // // //     flex: 1,
// // // // //     fontSize: 14,
// // // // //     color: colors.text,
// // // // //   },

// // // // //   // =====================================================
// // // // //   // SHOP SELECTOR SECTION
// // // // //   // =====================================================

// // // // //   shopSelectorSection: {
// // // // //     marginVertical: 8,
// // // // //   },

// // // // //   sectionTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginBottom: 12,
// // // // //   },

// // // // //   shopIconsList: {
// // // // //     paddingVertical: 4,
// // // // //   },

// // // // //   shopIconItem: {
// // // // //     alignItems: 'center',
// // // // //     marginRight: 20,
// // // // //     width: 72,
// // // // //   },

// // // // //   shopIconItemSelected: {
// // // // //     // Additional styles for selected state
// // // // //   },

// // // // //   shopIconCircle: {
// // // // //     width: 60,
// // // // //     height: 60,
// // // // //     borderRadius: 30,
// // // // //     backgroundColor: '#f0f7ff',
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#d4e4ff',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 4,
// // // // //   },

// // // // //   shopIconCircleSelected: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderColor: colors.primary,
// // // // //   },

// // // // //   shopIconName: {
// // // // //     fontSize: 11,
// // // // //     color: colors.text,
// // // // //     textAlign: 'center',
// // // // //   },

// // // // //   shopIconNameSelected: {
// // // // //     color: colors.primary,
// // // // //     fontWeight: '600',
// // // // //   },

// // // // //   selectedShopDisplay: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f0f7ff',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 8,
// // // // //     marginTop: 4,
// // // // //     marginBottom: 8,
// // // // //   },

// // // // //   selectedShopText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.primary,
// // // // //     marginLeft: 8,
// // // // //   },

// // // // //   // =====================================================
// // // // //   // STORE CARD (NEW)
// // // // //   // =====================================================

// // // // //   storeCard: {
// // // // //     backgroundColor: colors.lightGray,
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 12,
// // // // //     borderWidth: 2,
// // // // //     borderColor: 'transparent',
// // // // //   },

// // // // //   storeCardContent: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },

// // // // //   storeIconContainer: {
// // // // //     width: 56,
// // // // //     height: 56,
// // // // //     borderRadius: 28,
// // // // //     backgroundColor: colors.white,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 14,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e0e0e0',
// // // // //   },

// // // // //   storeInfo: {
// // // // //     flex: 1,
// // // // //   },

// // // // //   storeName: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: colors.text,
// // // // //     marginBottom: 2,
// // // // //   },

// // // // //   storeType: {
// // // // //     fontSize: 13,
// // // // //     color: colors.textLight,
// // // // //     marginBottom: 2,
// // // // //   },

// // // // //   storeAddress: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginBottom: 4,
// // // // //   },

// // // // //   storeMeta: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   storeProducts: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 2,
// // // // //   },

// // // // //   storeRating: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },

// // // // //   storeRatingText: {
// // // // //     fontSize: 12,
// // // // //     color: colors.text,
// // // // //     marginLeft: 2,
// // // // //     fontWeight: '600',
// // // // //   },

// // // // //   storeDelivery: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //   },

// // // // //   selectedBadge: {
// // // // //     marginLeft: 8,
// // // // //   },

// // // // //   // =====================================================
// // // // //   // EMPTY STORES
// // // // //   // =====================================================

// // // // //   emptyProducts: {
// // // // //     backgroundColor:
// // // // //       colors.lightGray,
// // // // //     borderRadius: 12,
// // // // //     paddingVertical: 35,
// // // // //     paddingHorizontal: 20,
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //   },

// // // // //   emptyProductsText: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 10,
// // // // //     textAlign: 'center',
// // // // //   },

// // // // //   // =====================================================
// // // // //   // RESTAURANTS SECTION
// // // // //   // =====================================================

// // // // //   restaurantsSection: {
// // // // //     marginVertical: 8,
// // // // //     paddingBottom: 30,
// // // // //   },

// // // // //   sectionHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent:
// // // // //       'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 12,
// // // // //   },

// // // // //   storeCount: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //   },

// // // // //   // =====================================================
// // // // //   // OFFERS - REMOVED
// // // // //   // =====================================================

// // // // //   offerCard: {
// // // // //     backgroundColor:
// // // // //       colors.lightGray,
// // // // //     borderRadius: 12,
// // // // //     padding: 12,
// // // // //     marginRight: 12,
// // // // //     width: width * 0.65,
// // // // //   },

// // // // //   offerTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: colors.text,
// // // // //   },

// // // // //   offerDescription: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 2,
// // // // //   },
// // // // // });
// // // import React, {
// // //   useState,
// // //   useEffect,
// // //   useContext,
// // // } from 'react';

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
// // // import {
// // //   categories,
// // //   offers,
// // // } from '../../constants/dummyData';

// // // import axios from 'axios';
// // // import { API_URL } from '@env';

// // // import CategoryItem from '../../components/home/CategoryItem';

// // // import {
// // //   Category,
// // //   Offer,
// // // } from '../../types';

// // // import { AuthContext } from '../../context/AuthContext';
// // // import { CartContext } from '../../context/CartContext';

// // // import { businessAPI } from '../../api/endpoints';

// // // import {
// // //   SelectedBusinessContext,
// // // } from '../../context/SelectedBusinessContext';

// // // const { width } = Dimensions.get('window');

// // // export default function HomeScreen({
// // //   navigation,
// // // }: any) {
// // //   const [searchText, setSearchText] =
// // //     useState<string>('');

// // //   const [products, setProducts] =
// // //     useState<any[]>([]);

// // //   const { user } =
// // //     useContext(AuthContext);

// // //   const [businesses, setBusinesses] =
// // //     useState<any[]>([]);

// // //   const [selectedBusinessId, setSelectedBusinessId] =
// // //     useState<number | null>(null);

// // //   const {
// // //     selectedBusiness,
// // //     setSelectedBusiness,
// // //   } = useContext(
// // //     SelectedBusinessContext
// // //   );

// // //   // =====================================================
// // //   // CART CONTEXT
// // //   // =====================================================

// // //   const {
// // //     cartItems,
// // //     addToCart,
// // //     updateQuantity,
// // //     removeFromCart,
// // //   } = useContext(CartContext);

// // //   // =====================================================
// // //   // LOAD BUSINESSES
// // //   // =====================================================

// // //   useEffect(() => {
// // //     businessAPI
// // //       .getBusinesses({})
// // //       .then((res: any) => {
// // //         console.log('📦 Response from API:', res);
        
// // //         let businessesData = [];
        
// // //         // Handle different response formats
// // //         if (Array.isArray(res)) {
// // //           businessesData = res;
// // //           console.log('✅ Case 1: Direct array, count:', businessesData.length);
// // //         } else if (res?.data && Array.isArray(res.data)) {
// // //           businessesData = res.data;
// // //           console.log('✅ Case 2: res.data array, count:', businessesData.length);
// // //         } else if (res?.data?.data && Array.isArray(res.data.data)) {
// // //           businessesData = res.data.data;
// // //           console.log('✅ Case 3: res.data.data array, count:', businessesData.length);
// // //         } else if (res?.businesses && Array.isArray(res.businesses)) {
// // //           businessesData = res.businesses;
// // //           console.log('✅ Case 4: res.businesses array, count:', businessesData.length);
// // //         } else {
// // //           console.log('❌ No data found in any format');
// // //         }
        
// // //         console.log('🏪 Business names:', businessesData.map((b: any) => b.business_name || b.businessName));
// // //         setBusinesses(businessesData);
// // //       })
// // //       .catch((err: any) => {
// // //         console.error('❌ Failed to load businesses:', err);
// // //         setBusinesses([]);
// // //       });
// // //   }, []);

// // //   // =====================================================
// // //   // USER LOG
// // //   // =====================================================

// // //   useEffect(() => {
// // //     console.log(
// // //       '🏪 USER OBJECT:',
// // //       user
// // //     );
// // //   }, [user]);

// // //   // =====================================================
// // //   // CATEGORY
// // //   // =====================================================

// // //   const renderCategory = ({
// // //     item,
// // //   }: {
// // //     item: Category;
// // //   }) => (
// // //     <CategoryItem category={item} />
// // //   );

// // //   // =====================================================
// // //   // OFFER
// // //   // =====================================================

// // //   const renderOffer = ({
// // //     item,
// // //   }: {
// // //     item: Offer;
// // //   }) => (
// // //     <View style={styles.offerCard}>
// // //       <Text style={styles.offerTitle}>
// // //         {item.title}
// // //       </Text>

// // //       <Text
// // //         style={styles.offerDescription}
// // //       >
// // //         {item.description}
// // //       </Text>
// // //     </View>
// // //   );

// // //   // =====================================================
// // //   // BUSINESS NAME
// // //   // =====================================================

// // //   const businessName =
// // //     user?.business_name ||
// // //     'No Business Found';

// // //   const plan =
// // //     user?.business_plan ||
// // //     'FREE';

// // //   const displayName =
// // //     businessName.length > 20
// // //       ? businessName.substring(0, 20) +
// // //         '...'
// // //       : businessName;

// // //   // =====================================================
// // //   // SHOP CHANGE (For horizontal scroll icons)
// // //   // =====================================================

// // //   const handleBusinessChange = (businessId: number) => {
// // //     if (businessId === selectedBusinessId) {
// // //       // Deselect if clicking the same shop
// // //       setSelectedBusinessId(null);
// // //       setSelectedBusiness(null);
// // //       setProducts([]);
// // //       return;
// // //     }

// // //     const business =
// // //       businesses.find(
// // //         biz =>
// // //           String(biz.id) ===
// // //           String(businessId)
// // //       );

// // //     setSelectedBusinessId(
// // //       Number(businessId)
// // //     );

// // //     if (business) {
// // //       setSelectedBusiness({
// // //         id: business.id,
// // //         name: business.business_name,
// // //       });
// // //     }

// // //     console.log(
// // //       '🏪 Selected Shop:',
// // //       business
// // //     );
// // //   };

// // //   // =====================================================
// // //   // STORE CARD RENDERER (UPDATED - Navigates to ProductList)
// // //   // =====================================================

// // //   const renderStoreCard = ({ item }: { item: any }) => (
// // //     <TouchableOpacity
// // //       style={styles.storeCard}
// // //       onPress={() => {
// // //         console.log('🛒 Store clicked:', item.id, item.business_name);
// // //         // Navigate to product list screen
// // //         navigation.navigate('ProductList', {
// // //           storeId: item.id,
// // //           storeName: item.business_name || 'Store',
// // //         });
// // //       }}
// // //       activeOpacity={0.8}
// // //     >
// // //       <View style={styles.storeCardContent}>
// // //         <View style={styles.storeIconContainer}>
// // //           <Icon
// // //             name="storefront"
// // //             size={32}
// // //             color={colors.primary}
// // //           />
// // //         </View>
        
// // //         <View style={styles.storeInfo}>
// // //           <Text
// // //             style={styles.storeName}
// // //             numberOfLines={1}
// // //           >
// // //             {item.business_name || 'Unnamed Store'}
// // //           </Text>
          
// // //           <Text
// // //             style={styles.storeType}
// // //             numberOfLines={1}
// // //           >
// // //             {item.business_type || 'General Store'}
// // //           </Text>
          
// // //           {item.address && (
// // //             <Text
// // //               style={styles.storeAddress}
// // //               numberOfLines={1}
// // //             >
// // //               <Icon name="location-outline" size={12} color={colors.textLight} />
// // //               {' '}{item.address}
// // //             </Text>
// // //           )}
          
// // //           <View style={styles.storeMeta}>
// // //             <Text style={styles.storeProducts}>
// // //               <Icon name="cube-outline" size={12} color={colors.textLight} />
// // //               {' '}View Products
// // //             </Text>
// // //           </View>
// // //         </View>
        
// // //         <Icon name="chevron-forward" size={20} color={colors.textLight} />
// // //       </View>
// // //     </TouchableOpacity>
// // //   );

// // //   // =====================================================
// // //   // SHOP ICON RENDERER (For horizontal scroll)
// // //   // =====================================================

// // //   const renderShopIcon = ({ item }: { item: any }) => (
// // //     <TouchableOpacity
// // //       style={[
// // //         styles.shopIconItem,
// // //         selectedBusinessId === item.id &&
// // //           styles.shopIconItemSelected,
// // //       ]}
// // //       onPress={() =>
// // //         handleBusinessChange(item.id)
// // //       }
// // //     >
// // //       <View
// // //         style={[
// // //           styles.shopIconCircle,
// // //           selectedBusinessId === item.id &&
// // //             styles.shopIconCircleSelected,
// // //         ]}
// // //       >
// // //         <Icon
// // //           name="storefront"
// // //           size={28}
// // //           color={
// // //             selectedBusinessId === item.id
// // //               ? colors.white
// // //               : colors.primary
// // //           }
// // //         />
// // //       </View>
// // //       <Text
// // //         style={[
// // //           styles.shopIconName,
// // //           selectedBusinessId === item.id &&
// // //             styles.shopIconNameSelected,
// // //         ]}
// // //         numberOfLines={1}
// // //       >
// // //         {item.business_name}
// // //       </Text>
// // //     </TouchableOpacity>
// // //   );

// // //   // =====================================================
// // //   // UI
// // //   // =====================================================

// // //   return (
// // //     <ScrollView
// // //       style={styles.container}
// // //       showsVerticalScrollIndicator={
// // //         false
// // //       }
// // //     >
// // //       {/* HEADER */}
// // //       <View style={styles.header}>
// // //         <View>
// // //           <Text
// // //             style={
// // //               styles.locationLabel
// // //             }
// // //           >
// // //             📍 Home
// // //           </Text>

// // //           <Text
// // //             style={styles.location}
// // //           >
// // //             Sector 1, HSR Layout
// // //           </Text>

// // //           <View
// // //             style={
// // //               styles.businessCard
// // //             }
// // //           >
// // //             <View
// // //               style={
// // //                 styles.businessCardContent
// // //               }
// // //             >
// // //               <Icon
// // //                 name="business-outline"
// // //                 size={16}
// // //                 color={colors.primary}
// // //               />

// // //               <Text
// // //                 style={
// // //                   styles.businessName
// // //                 }
// // //               >
// // //                 {displayName}
// // //               </Text>

// // //               {user?.business_name &&
// // //                 user.business_name !==
// // //                   'No Business Found' && (
// // //                   <View
// // //                     style={
// // //                       styles.businessBadge
// // //                     }
// // //                   >
// // //                     <Text
// // //                       style={
// // //                         styles.businessBadgeText
// // //                       }
// // //                     >
// // //                       {plan}
// // //                     </Text>
// // //                   </View>
// // //                 )}
// // //             </View>
// // //           </View>
// // //         </View>

// // //         <TouchableOpacity
// // //           onPress={() =>
// // //             navigation.navigate(
// // //               'Profile'
// // //             )
// // //           }
// // //         >
// // //           <Icon
// // //             name="person-circle-outline"
// // //             size={40}
// // //             color={colors.primary}
// // //           />
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* SEARCH */}
// // //       <View
// // //         style={
// // //           styles.searchContainer
// // //         }
// // //       >
// // //         <Icon
// // //           name="search"
// // //           size={20}
// // //           color={colors.gray}
// // //           style={styles.searchIcon}
// // //         />

// // //         <TextInput
// // //           style={styles.searchInput}
// // //           placeholder="Search for restaurant, item or more"
// // //           value={searchText}
// // //           onChangeText={
// // //             setSearchText
// // //           }
// // //           onFocus={() =>
// // //             navigation.navigate(
// // //               'Search'
// // //             )
// // //           }
// // //         />
// // //       </View>

// // //       {/* SHOP SELECTOR - HORIZONTAL SCROLLABLE ICONS */}
// // //       <View
// // //         style={
// // //           styles.shopSelectorSection
// // //         }
// // //       >
// // //         <Text
// // //           style={
// // //             styles.sectionTitle
// // //           }
// // //         >
// // //           Select a shop
// // //         </Text>

// // //         <FlatList
// // //           data={businesses}
// // //           renderItem={renderShopIcon}
// // //           keyExtractor={(item) => item.id.toString()}
// // //           horizontal
// // //           showsHorizontalScrollIndicator={false}
// // //           contentContainerStyle={
// // //             styles.shopIconsList
// // //           }
// // //         />

// // //         {/* Selected shop name display */}
// // //         {selectedBusinessId && (
// // //           <View style={styles.selectedShopDisplay}>
// // //             <Icon
// // //               name="checkmark-circle"
// // //               size={20}
// // //               color={colors.primary}
// // //             />
// // //             <Text style={styles.selectedShopText}>
// // //               {businesses.find(
// // //                 biz =>
// // //                   String(biz.id) ===
// // //                   String(selectedBusinessId)
// // //               )?.business_name || 'Selected Shop'}
// // //             </Text>
// // //           </View>
// // //         )}
// // //       </View>

// // //       {/* AVAILABLE STORES - Navigates to ProductList on press */}
// // //       <View
// // //         style={
// // //           styles.restaurantsSection
// // //         }
// // //       >
// // //         <View
// // //           style={
// // //             styles.sectionHeader
// // //           }
// // //         >
// // //           <Text
// // //             style={
// // //               styles.sectionTitle
// // //             }
// // //           >
// // //             Available Stores
// // //           </Text>
// // //           <Text style={styles.storeCount}>
// // //             {businesses.length} stores
// // //           </Text>
// // //         </View>

// // //         {businesses.length === 0 ? (
// // //           <View
// // //             style={
// // //               styles.emptyProducts
// // //             }
// // //           >
// // //             <Icon
// // //               name="storefront-outline"
// // //               size={45}
// // //               color="#b5b5b5"
// // //             />

// // //             <Text
// // //               style={
// // //                 styles.emptyProductsText
// // //               }
// // //             >
// // //               No stores available
// // //             </Text>
// // //           </View>
// // //         ) : (
// // //           businesses.map(
// // //             (store: any) =>
// // //               renderStoreCard({
// // //                 item: store,
// // //               })
// // //           )
// // //         )}
// // //       </View>
// // //     </ScrollView>
// // //   );
// // // }

// // // // =========================================================
// // // // STYLES
// // // // =========================================================

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: colors.white,
// // //     paddingHorizontal: 16,
// // //   },

// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent:
// // //       'space-between',
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
// // //     backgroundColor:
// // //       colors.primary,
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

// // //   // =====================================================
// // //   // SEARCH
// // //   // =====================================================

// // //   searchContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor:
// // //       colors.lightGray,
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

// // //   // =====================================================
// // //   // SHOP SELECTOR SECTION
// // //   // =====================================================

// // //   shopSelectorSection: {
// // //     marginVertical: 8,
// // //   },

// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: colors.text,
// // //     marginBottom: 12,
// // //   },

// // //   shopIconsList: {
// // //     paddingVertical: 4,
// // //   },

// // //   shopIconItem: {
// // //     alignItems: 'center',
// // //     marginRight: 20,
// // //     width: 72,
// // //   },

// // //   shopIconItemSelected: {
// // //     // Additional styles for selected state
// // //   },

// // //   shopIconCircle: {
// // //     width: 60,
// // //     height: 60,
// // //     borderRadius: 30,
// // //     backgroundColor: '#f0f7ff',
// // //     borderWidth: 2,
// // //     borderColor: '#d4e4ff',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 4,
// // //   },

// // //   shopIconCircleSelected: {
// // //     backgroundColor: colors.primary,
// // //     borderColor: colors.primary,
// // //   },

// // //   shopIconName: {
// // //     fontSize: 11,
// // //     color: colors.text,
// // //     textAlign: 'center',
// // //   },

// // //   shopIconNameSelected: {
// // //     color: colors.primary,
// // //     fontWeight: '600',
// // //   },

// // //   selectedShopDisplay: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#f0f7ff',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //     marginTop: 4,
// // //     marginBottom: 8,
// // //   },

// // //   selectedShopText: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //     color: colors.primary,
// // //     marginLeft: 8,
// // //   },

// // //   // =====================================================
// // //   // STORE CARD
// // //   // =====================================================

// // //   storeCard: {
// // //     backgroundColor: colors.lightGray,
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 12,
// // //   },

// // //   storeCardContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },

// // //   storeIconContainer: {
// // //     width: 56,
// // //     height: 56,
// // //     borderRadius: 28,
// // //     backgroundColor: colors.white,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 14,
// // //     borderWidth: 1,
// // //     borderColor: '#e0e0e0',
// // //   },

// // //   storeInfo: {
// // //     flex: 1,
// // //   },

// // //   storeName: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: colors.text,
// // //     marginBottom: 2,
// // //   },

// // //   storeType: {
// // //     fontSize: 13,
// // //     color: colors.textLight,
// // //     marginBottom: 2,
// // //   },

// // //   storeAddress: {
// // //     fontSize: 12,
// // //     color: colors.textLight,
// // //     marginBottom: 4,
// // //   },

// // //   storeMeta: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 2,
// // //   },

// // //   storeProducts: {
// // //     fontSize: 12,
// // //     color: colors.textLight,
// // //     marginTop: 2,
// // //   },

// // //   storeRating: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },

// // //   storeRatingText: {
// // //     fontSize: 12,
// // //     color: colors.text,
// // //     marginLeft: 2,
// // //     fontWeight: '600',
// // //   },

// // //   storeDelivery: {
// // //     fontSize: 12,
// // //     color: colors.textLight,
// // //   },

// // //   // =====================================================
// // //   // EMPTY STORES
// // //   // =====================================================

// // //   emptyProducts: {
// // //     backgroundColor:
// // //       colors.lightGray,
// // //     borderRadius: 12,
// // //     paddingVertical: 35,
// // //     paddingHorizontal: 20,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },

// // //   emptyProductsText: {
// // //     fontSize: 14,
// // //     color: colors.textLight,
// // //     marginTop: 10,
// // //     textAlign: 'center',
// // //   },

// // //   // =====================================================
// // //   // RESTAURANTS SECTION
// // //   // =====================================================

// // //   restaurantsSection: {
// // //     marginVertical: 8,
// // //     paddingBottom: 30,
// // //   },

// // //   sectionHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent:
// // //       'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },

// // //   storeCount: {
// // //     fontSize: 14,
// // //     color: colors.textLight,
// // //   },

// // //   // =====================================================
// // //   // OFFERS
// // //   // =====================================================

// // //   offerCard: {
// // //     backgroundColor:
// // //       colors.lightGray,
// // //     borderRadius: 12,
// // //     padding: 12,
// // //     marginRight: 12,
// // //     width: width * 0.65,
// // //   },

// // //   offerTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: colors.text,
// // //   },

// // //   offerDescription: {
// // //     fontSize: 12,
// // //     color: colors.textLight,
// // //     marginTop: 2,
// // //   },
// // // });
// // import React, {
// //   useState,
// //   useEffect,
// //   useContext,
// // } from 'react';

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
// // import {
// //   categories,
// //   offers,
// // } from '../../constants/dummyData';

// // import axios from 'axios';
// // import { API_URL } from '@env';

// // import CategoryItem from '../../components/home/CategoryItem';

// // import {
// //   Category,
// //   Offer,
// // } from '../../types';

// // import { AuthContext } from '../../context/AuthContext';
// // import { CartContext } from '../../context/CartContext';

// // import { businessAPI } from '../../api/endpoints';

// // import {
// //   SelectedBusinessContext,
// // } from '../../context/SelectedBusinessContext';

// // const { width } = Dimensions.get('window');

// // export default function HomeScreen({
// //   navigation,
// // }: any) {
// //   const [searchText, setSearchText] =
// //     useState<string>('');

// //   const [products, setProducts] =
// //     useState<any[]>([]);

// //   const { user } =
// //     useContext(AuthContext);

// //   const [businesses, setBusinesses] =
// //     useState<any[]>([]);

// //   const [selectedBusinessId, setSelectedBusinessId] =
// //     useState<number | null>(null);

// //   const {
// //     selectedBusiness,
// //     setSelectedBusiness,
// //   } = useContext(
// //     SelectedBusinessContext
// //   );

// //   // =====================================================
// //   // CART CONTEXT
// //   // =====================================================

// //   const {
// //     cartItems,
// //     addToCart,
// //     updateQuantity,
// //     removeFromCart,
// //   } = useContext(CartContext);

// //   // =====================================================
// //   // LOAD BUSINESSES
// //   // =====================================================

// //   useEffect(() => {
// //     businessAPI
// //       .getBusinesses({})
// //       .then((res: any) => {
// //         console.log('📦 Response from API:', res);
        
// //         let businessesData = [];
        
// //         // Handle different response formats
// //         if (Array.isArray(res)) {
// //           businessesData = res;
// //           console.log('✅ Case 1: Direct array, count:', businessesData.length);
// //         } else if (res?.data && Array.isArray(res.data)) {
// //           businessesData = res.data;
// //           console.log('✅ Case 2: res.data array, count:', businessesData.length);
// //         } else if (res?.data?.data && Array.isArray(res.data.data)) {
// //           businessesData = res.data.data;
// //           console.log('✅ Case 3: res.data.data array, count:', businessesData.length);
// //         } else if (res?.businesses && Array.isArray(res.businesses)) {
// //           businessesData = res.businesses;
// //           console.log('✅ Case 4: res.businesses array, count:', businessesData.length);
// //         } else {
// //           console.log('❌ No data found in any format');
// //         }
        
// //         console.log('🏪 Business names:', businessesData.map((b: any) => b.business_name || b.businessName));
// //         setBusinesses(businessesData);
// //       })
// //       .catch((err: any) => {
// //         console.error('❌ Failed to load businesses:', err);
// //         setBusinesses([]);
// //       });
// //   }, []);

// //   // =====================================================
// //   // USER LOG
// //   // =====================================================

// //   useEffect(() => {
// //     console.log(
// //       '🏪 USER OBJECT:',
// //       user
// //     );
// //   }, [user]);

// //   // =====================================================
// //   // CATEGORY
// //   // =====================================================

// //   const renderCategory = ({
// //     item,
// //   }: {
// //     item: Category;
// //   }) => (
// //     <CategoryItem category={item} />
// //   );

// //   // =====================================================
// //   // OFFER
// //   // =====================================================

// //   const renderOffer = ({
// //     item,
// //   }: {
// //     item: Offer;
// //   }) => (
// //     <View style={styles.offerCard}>
// //       <Text style={styles.offerTitle}>
// //         {item.title}
// //       </Text>

// //       <Text
// //         style={styles.offerDescription}
// //       >
// //         {item.description}
// //       </Text>
// //     </View>
// //   );

// //   // =====================================================
// //   // BUSINESS NAME
// //   // =====================================================

// //   const businessName =
// //     user?.business_name ||
// //     'No Business Found';

// //   const plan =
// //     user?.business_plan ||
// //     'FREE';

// //   const displayName =
// //     businessName.length > 20
// //       ? businessName.substring(0, 20) +
// //         '...'
// //       : businessName;

// //   // =====================================================
// //   // SHOP CHANGE (For horizontal scroll icons ONLY)
// //   // =====================================================

// //   const handleBusinessChange = (businessId: number) => {
// //     if (businessId === selectedBusinessId) {
// //       // Deselect if clicking the same shop
// //       setSelectedBusinessId(null);
// //       setSelectedBusiness(null);
// //       setProducts([]);
// //       return;
// //     }

// //     const business =
// //       businesses.find(
// //         biz =>
// //           String(biz.id) ===
// //           String(businessId)
// //       );

// //     setSelectedBusinessId(
// //       Number(businessId)
// //     );

// //     if (business) {
// //       setSelectedBusiness({
// //         id: business.id,
// //         name: business.business_name,
// //       });
// //     }

// //     console.log(
// //       '🏪 Selected Shop:',
// //       business
// //     );
// //   };

// //   // =====================================================
// //   // ✅ STORE CARD RENDERER - NAVIGATES TO PRODUCT LIST
// //   // =====================================================

// //   const renderStoreCard = ({ item }: { item: any }) => (
// //     <TouchableOpacity
// //       style={styles.storeCard}
// //       onPress={() => {
// //         console.log('🛒 Clicked store:', item.business_name, 'ID:', item.id);
// //         // Navigate to product list screen
// //         navigation.navigate('ProductList', {
// //           storeId: item.id,
// //           storeName: item.business_name || 'Store',
// //         });
// //       }}
// //       activeOpacity={0.8}
// //     >
// //       <View style={styles.storeCardContent}>
// //         <View style={styles.storeIconContainer}>
// //           <Icon
// //             name="storefront"
// //             size={32}
// //             color={colors.primary}
// //           />
// //         </View>
        
// //         <View style={styles.storeInfo}>
// //           <Text
// //             style={styles.storeName}
// //             numberOfLines={1}
// //           >
// //             {item.business_name || 'Unnamed Store'}
// //           </Text>
          
// //           <Text
// //             style={styles.storeType}
// //             numberOfLines={1}
// //           >
// //             {item.business_type || 'General Store'}
// //           </Text>
          
// //           {item.address && (
// //             <Text
// //               style={styles.storeAddress}
// //               numberOfLines={1}
// //             >
// //               <Icon name="location-outline" size={12} color={colors.textLight} />
// //               {' '}{item.address}
// //             </Text>
// //           )}
          
// //           <View style={styles.storeMeta}>
// //             <Text style={styles.storeProducts}>
// //               <Icon name="cube-outline" size={12} color={colors.textLight} />
// //               {' '}View Products
// //             </Text>
// //           </View>
// //         </View>
        
// //         <Icon name="chevron-forward" size={20} color={colors.textLight} />
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   // =====================================================
// //   // SHOP ICON RENDERER (For horizontal scroll - selects on same page)
// //   // =====================================================

// //   const renderShopIcon = ({ item }: { item: any }) => (
// //     <TouchableOpacity
// //       style={[
// //         styles.shopIconItem,
// //         selectedBusinessId === item.id &&
// //           styles.shopIconItemSelected,
// //       ]}
// //       onPress={() =>
// //         handleBusinessChange(item.id)
// //       }
// //     >
// //       <View
// //         style={[
// //           styles.shopIconCircle,
// //           selectedBusinessId === item.id &&
// //             styles.shopIconCircleSelected,
// //         ]}
// //       >
// //         <Icon
// //           name="storefront"
// //           size={28}
// //           color={
// //             selectedBusinessId === item.id
// //               ? colors.white
// //               : colors.primary
// //           }
// //         />
// //       </View>
// //       <Text
// //         style={[
// //           styles.shopIconName,
// //           selectedBusinessId === item.id &&
// //             styles.shopIconNameSelected,
// //         ]}
// //         numberOfLines={1}
// //       >
// //         {item.business_name}
// //       </Text>
// //     </TouchableOpacity>
// //   );

// //   // =====================================================
// //   // UI
// //   // =====================================================

// //   return (
// //     <ScrollView
// //       style={styles.container}
// //       showsVerticalScrollIndicator={
// //         false
// //       }
// //     >
// //       {/* HEADER */}
// //       <View style={styles.header}>
// //         <View>
// //           <Text
// //             style={
// //               styles.locationLabel
// //             }
// //           >
// //             📍 Home
// //           </Text>

// //           <Text
// //             style={styles.location}
// //           >
// //             Sector 1, HSR Layout
// //           </Text>

// //           <View
// //             style={
// //               styles.businessCard
// //             }
// //           >
// //             <View
// //               style={
// //                 styles.businessCardContent
// //               }
// //             >
// //               <Icon
// //                 name="business-outline"
// //                 size={16}
// //                 color={colors.primary}
// //               />

// //               <Text
// //                 style={
// //                   styles.businessName
// //                 }
// //               >
// //                 {displayName}
// //               </Text>

// //               {user?.business_name &&
// //                 user.business_name !==
// //                   'No Business Found' && (
// //                   <View
// //                     style={
// //                       styles.businessBadge
// //                     }
// //                   >
// //                     <Text
// //                       style={
// //                         styles.businessBadgeText
// //                       }
// //                     >
// //                       {plan}
// //                     </Text>
// //                   </View>
// //                 )}
// //             </View>
// //           </View>
// //         </View>

// //         <TouchableOpacity
// //           onPress={() =>
// //             navigation.navigate(
// //               'Profile'
// //             )
// //           }
// //         >
// //           <Icon
// //             name="person-circle-outline"
// //             size={40}
// //             color={colors.primary}
// //           />
// //         </TouchableOpacity>
// //       </View>

// //       {/* SEARCH */}
// //       <View
// //         style={
// //           styles.searchContainer
// //         }
// //       >
// //         <Icon
// //           name="search"
// //           size={20}
// //           color={colors.gray}
// //           style={styles.searchIcon}
// //         />

// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search for restaurant, item or more"
// //           value={searchText}
// //           onChangeText={
// //             setSearchText
// //           }
// //           onFocus={() =>
// //             navigation.navigate(
// //               'Search'
// //             )
// //           }
// //         />
// //       </View>

// //       {/* SHOP SELECTOR - HORIZONTAL SCROLLABLE ICONS */}
// //       <View
// //         style={
// //           styles.shopSelectorSection
// //         }
// //       >
// //         <Text
// //           style={
// //             styles.sectionTitle
// //           }
// //         >
// //           Select a shop
// //         </Text>

// //         <FlatList
// //           data={businesses}
// //           renderItem={renderShopIcon}
// //           keyExtractor={(item) => item.id.toString()}
// //           horizontal
// //           showsHorizontalScrollIndicator={false}
// //           contentContainerStyle={
// //             styles.shopIconsList
// //           }
// //         />

// //         {/* Selected shop name display */}
// //         {selectedBusinessId && (
// //           <View style={styles.selectedShopDisplay}>
// //             <Icon
// //               name="checkmark-circle"
// //               size={20}
// //               color={colors.primary}
// //             />
// //             <Text style={styles.selectedShopText}>
// //               {businesses.find(
// //                 biz =>
// //                   String(biz.id) ===
// //                   String(selectedBusinessId)
// //               )?.business_name || 'Selected Shop'}
// //             </Text>
// //           </View>
// //         )}
// //       </View>

// //       {/* AVAILABLE STORES - Navigates to ProductList on press */}
// //       <View
// //         style={
// //           styles.restaurantsSection
// //         }
// //       >
// //         <View
// //           style={
// //             styles.sectionHeader
// //           }
// //         >
// //           <Text
// //             style={
// //               styles.sectionTitle
// //             }
// //           >
// //             Available Stores
// //           </Text>
// //           <Text style={styles.storeCount}>
// //             {businesses.length} stores
// //           </Text>
// //         </View>

// //         {businesses.length === 0 ? (
// //           <View
// //             style={
// //               styles.emptyProducts
// //             }
// //           >
// //             <Icon
// //               name="storefront-outline"
// //               size={45}
// //               color="#b5b5b5"
// //             />

// //             <Text
// //               style={
// //                 styles.emptyProductsText
// //               }
// //             >
// //               No stores available
// //             </Text>
// //           </View>
// //         ) : (
// //           businesses.map(
// //             (store: any) =>
// //               renderStoreCard({
// //                 item: store,
// //               })
// //           )
// //         )}
// //       </View>
// //     </ScrollView>
// //   );
// // }

// // // =========================================================
// // // STYLES
// // // =========================================================

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: colors.white,
// //     paddingHorizontal: 16,
// //   },

// //   header: {
// //     flexDirection: 'row',
// //     justifyContent:
// //       'space-between',
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
// //     backgroundColor:
// //       colors.primary,
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

// //   // =====================================================
// //   // SEARCH
// //   // =====================================================

// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor:
// //       colors.lightGray,
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

// //   // =====================================================
// //   // SHOP SELECTOR SECTION
// //   // =====================================================

// //   shopSelectorSection: {
// //     marginVertical: 8,
// //   },

// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: colors.text,
// //     marginBottom: 12,
// //   },

// //   shopIconsList: {
// //     paddingVertical: 4,
// //   },

// //   shopIconItem: {
// //     alignItems: 'center',
// //     marginRight: 20,
// //     width: 72,
// //   },

// //   shopIconItemSelected: {
// //     // Additional styles for selected state
// //   },

// //   shopIconCircle: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: '#f0f7ff',
// //     borderWidth: 2,
// //     borderColor: '#d4e4ff',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 4,
// //   },

// //   shopIconCircleSelected: {
// //     backgroundColor: colors.primary,
// //     borderColor: colors.primary,
// //   },

// //   shopIconName: {
// //     fontSize: 11,
// //     color: colors.text,
// //     textAlign: 'center',
// //   },

// //   shopIconNameSelected: {
// //     color: colors.primary,
// //     fontWeight: '600',
// //   },

// //   selectedShopDisplay: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f7ff',
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //     marginTop: 4,
// //     marginBottom: 8,
// //   },

// //   selectedShopText: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: colors.primary,
// //     marginLeft: 8,
// //   },

// //   // =====================================================
// //   // STORE CARD
// //   // =====================================================

// //   storeCard: {
// //     backgroundColor: colors.lightGray,
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 12,
// //   },

// //   storeCardContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },

// //   storeIconContainer: {
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     backgroundColor: colors.white,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 14,
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //   },

// //   storeInfo: {
// //     flex: 1,
// //   },

// //   storeName: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: colors.text,
// //     marginBottom: 2,
// //   },

// //   storeType: {
// //     fontSize: 13,
// //     color: colors.textLight,
// //     marginBottom: 2,
// //   },

// //   storeAddress: {
// //     fontSize: 12,
// //     color: colors.textLight,
// //     marginBottom: 4,
// //   },

// //   storeMeta: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 2,
// //   },

// //   storeProducts: {
// //     fontSize: 12,
// //     color: colors.textLight,
// //     marginTop: 2,
// //   },

// //   storeRating: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },

// //   storeRatingText: {
// //     fontSize: 12,
// //     color: colors.text,
// //     marginLeft: 2,
// //     fontWeight: '600',
// //   },

// //   storeDelivery: {
// //     fontSize: 12,
// //     color: colors.textLight,
// //   },

// //   // =====================================================
// //   // EMPTY STORES
// //   // =====================================================

// //   emptyProducts: {
// //     backgroundColor:
// //       colors.lightGray,
// //     borderRadius: 12,
// //     paddingVertical: 35,
// //     paddingHorizontal: 20,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },

// //   emptyProductsText: {
// //     fontSize: 14,
// //     color: colors.textLight,
// //     marginTop: 10,
// //     textAlign: 'center',
// //   },

// //   // =====================================================
// //   // RESTAURANTS SECTION
// //   // =====================================================

// //   restaurantsSection: {
// //     marginVertical: 8,
// //     paddingBottom: 30,
// //   },

// //   sectionHeader: {
// //     flexDirection: 'row',
// //     justifyContent:
// //       'space-between',
// //     alignItems: 'center',
// //     marginBottom: 12,
// //   },

// //   storeCount: {
// //     fontSize: 14,
// //     color: colors.textLight,
// //   },

// //   // =====================================================
// //   // OFFERS
// //   // =====================================================

// //   offerCard: {
// //     backgroundColor:
// //       colors.lightGray,
// //     borderRadius: 12,
// //     padding: 12,
// //     marginRight: 12,
// //     width: width * 0.65,
// //   },

// //   offerTitle: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: colors.text,
// //   },

// //   offerDescription: {
// //     fontSize: 12,
// //     color: colors.textLight,
// //     marginTop: 2,
// //   },
// // });
// import React, {
//   useState,
//   useEffect,
//   useContext,
// } from 'react';

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
// import {
//   categories,
//   offers,
// } from '../../constants/dummyData';

// import axios from 'axios';
// import { API_URL } from '@env';

// import CategoryItem from '../../components/home/CategoryItem';

// import {
//   Category,
//   Offer,
// } from '../../types';

// import { AuthContext } from '../../context/AuthContext';
// import { CartContext } from '../../context/CartContext';

// import { businessAPI } from '../../api/endpoints';

// import {
//   SelectedBusinessContext,
// } from '../../context/SelectedBusinessContext';

// const { width } = Dimensions.get('window');

// export default function HomeScreen({
//   navigation,
// }: any) {
//   const [searchText, setSearchText] =
//     useState<string>('');

//   const [products, setProducts] =
//     useState<any[]>([]);

//   const { user } =
//     useContext(AuthContext);

//   const [businesses, setBusinesses] =
//     useState<any[]>([]);

//   const [selectedBusinessId, setSelectedBusinessId] =
//     useState<number | null>(null);

//   const {
//     selectedBusiness,
//     setSelectedBusiness,
//   } = useContext(
//     SelectedBusinessContext
//   );

//   // =====================================================
//   // CART CONTEXT
//   // =====================================================

//   const {
//     cartItems,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//   } = useContext(CartContext);

//   // =====================================================
//   // LOAD BUSINESSES
//   // =====================================================

//   useEffect(() => {
//     businessAPI
//       .getBusinesses({})
//       .then((res: any) => {
//         console.log('📦 Response from API:', res);
        
//         let businessesData = [];
        
//         // Handle different response formats
//         if (Array.isArray(res)) {
//           businessesData = res;
//           console.log('✅ Case 1: Direct array, count:', businessesData.length);
//         } else if (res?.data && Array.isArray(res.data)) {
//           businessesData = res.data;
//           console.log('✅ Case 2: res.data array, count:', businessesData.length);
//         } else if (res?.data?.data && Array.isArray(res.data.data)) {
//           businessesData = res.data.data;
//           console.log('✅ Case 3: res.data.data array, count:', businessesData.length);
//         } else if (res?.businesses && Array.isArray(res.businesses)) {
//           businessesData = res.businesses;
//           console.log('✅ Case 4: res.businesses array, count:', businessesData.length);
//         } else {
//           console.log('❌ No data found in any format');
//         }
        
//         console.log('🏪 Business names:', businessesData.map((b: any) => b.business_name || b.businessName));
//         setBusinesses(businessesData);
//       })
//       .catch((err: any) => {
//         console.error('❌ Failed to load businesses:', err);
//         setBusinesses([]);
//       });
//   }, []);

//   // =====================================================
//   // USER LOG
//   // =====================================================

//   useEffect(() => {
//     console.log(
//       '🏪 USER OBJECT:',
//       user
//     );
//   }, [user]);

//   // =====================================================
//   // CATEGORY
//   // =====================================================

//   const renderCategory = ({
//     item,
//   }: {
//     item: Category;
//   }) => (
//     <CategoryItem category={item} />
//   );

//   // =====================================================
//   // OFFER
//   // =====================================================

//   const renderOffer = ({
//     item,
//   }: {
//     item: Offer;
//   }) => (
//     <View style={styles.offerCard}>
//       <Text style={styles.offerTitle}>
//         {item.title}
//       </Text>

//       <Text
//         style={styles.offerDescription}
//       >
//         {item.description}
//       </Text>
//     </View>
//   );

//   // =====================================================
//   // BUSINESS NAME
//   // =====================================================

//   const businessName =
//     user?.business_name ||
//     'No Business Found';

//   const plan =
//     user?.business_plan ||
//     'FREE';

//   const displayName =
//     businessName.length > 20
//       ? businessName.substring(0, 20) +
//         '...'
//       : businessName;

//   // =====================================================
//   // SHOP CHANGE (For horizontal scroll icons ONLY)
//   // =====================================================

//   const handleBusinessChange = (businessId: number) => {
//     if (businessId === selectedBusinessId) {
//       // Deselect if clicking the same shop
//       setSelectedBusinessId(null);
//       setSelectedBusiness(null);
//       setProducts([]);
//       return;
//     }

//     const business =
//       businesses.find(
//         biz =>
//           String(biz.id) ===
//           String(businessId)
//       );

//     setSelectedBusinessId(
//       Number(businessId)
//     );

//     if (business) {
//       setSelectedBusiness({
//         id: business.id,
//         name: business.business_name,
//       });
//     }

//     console.log(
//       '🏪 Selected Shop:',
//       business
//     );
//   };

//   // =====================================================
//   // ✅ STORE CARD RENDERER - NAVIGATES TO PRODUCT LIST
//   // =====================================================

//   const renderStoreCard = ({ item }: { item: any }) => (
//     <TouchableOpacity
//       style={styles.storeCard}
//       onPress={() => {
//         console.log('🛒 Clicked store:', item.business_name, 'ID:', item.id);
//         // Navigate to product list screen
//         navigation.navigate('ProductList', {
//           storeId: item.id,
//           storeName: item.business_name || 'Store',
//         });
//       }}
//       activeOpacity={0.8}
//     >
//       <View style={styles.storeCardContent}>
//         <View style={styles.storeIconContainer}>
//           <Icon
//             name="storefront"
//             size={32}
//             color={colors.primary}
//           />
//         </View>
        
//         <View style={styles.storeInfo}>
//           <Text
//             style={styles.storeName}
//             numberOfLines={1}
//           >
//             {item.business_name || 'Unnamed Store'}
//           </Text>
          
//           <Text
//             style={styles.storeType}
//             numberOfLines={1}
//           >
//             {item.business_type || 'General Store'}
//           </Text>
          
//           {item.address && (
//             <Text
//               style={styles.storeAddress}
//               numberOfLines={1}
//             >
//               <Icon name="location-outline" size={12} color={colors.textLight} />
//               {' '}{item.address}
//             </Text>
//           )}
          
//           <View style={styles.storeMeta}>
//             <Text style={styles.storeProducts}>
//               <Icon name="cube-outline" size={12} color={colors.textLight} />
//               {' '}View Products
//             </Text>
//           </View>
//         </View>
        
//         <Icon name="chevron-forward" size={20} color={colors.textLight} />
//       </View>
//     </TouchableOpacity>
//   );

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={
//         false
//       }
//     >
//       {/* HEADER */}
//       <View style={styles.header}>
//         <View>
//           <Text
//             style={
//               styles.locationLabel
//             }
//           >
//             📍 Home
//           </Text>

//           <Text
//             style={styles.location}
//           >
//             Sector 1, HSR Layout
//           </Text>

//           <View
//             style={
//               styles.businessCard
//             }
//           >
//             <View
//               style={
//                 styles.businessCardContent
//               }
//             >
//               <Icon
//                 name="business-outline"
//                 size={16}
//                 color={colors.primary}
//               />

//               <Text
//                 style={
//                   styles.businessName
//                 }
//               >
//                 {displayName}
//               </Text>

//               {user?.business_name &&
//                 user.business_name !==
//                   'No Business Found' && (
//                   <View
//                     style={
//                       styles.businessBadge
//                     }
//                   >
//                     <Text
//                       style={
//                         styles.businessBadgeText
//                       }
//                     >
//                       {plan}
//                     </Text>
//                   </View>
//                 )}
//             </View>
//           </View>
//         </View>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate(
//               'Profile'
//             )
//           }
//         >
//           <Icon
//             name="person-circle-outline"
//             size={40}
//             color={colors.primary}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* SEARCH */}
//       <View
//         style={
//           styles.searchContainer
//         }
//       >
//         <Icon
//           name="search"
//           size={20}
//           color={colors.gray}
//           style={styles.searchIcon}
//         />

//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for restaurant, item or more"
//           value={searchText}
//           onChangeText={
//             setSearchText
//           }
//           onFocus={() =>
//             navigation.navigate(
//               'Search'
//             )
//           }
//         />
//       </View>

//       {/* AVAILABLE STORES - Navigates to ProductList on press */}
//       <View
//         style={
//           styles.restaurantsSection
//         }
//       >
//         <View
//           style={
//             styles.sectionHeader
//           }
//         >
//           <Text
//             style={
//               styles.sectionTitle
//             }
//           >
//             Available Stores
//           </Text>
//           <Text style={styles.storeCount}>
//             {businesses.length} stores
//           </Text>
//         </View>

//         {businesses.length === 0 ? (
//           <View
//             style={
//               styles.emptyProducts
//             }
//           >
//             <Icon
//               name="storefront-outline"
//               size={45}
//               color="#b5b5b5"
//             />

//             <Text
//               style={
//                 styles.emptyProductsText
//               }
//             >
//               No stores available
//             </Text>
//           </View>
//         ) : (
//           businesses.map(
//             (store: any) =>
//               renderStoreCard({
//                 item: store,
//               })
//           )
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// // =========================================================
// // STYLES
// // =========================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//     paddingHorizontal: 16,
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
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
//     backgroundColor:
//       colors.primary,
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

//   // =====================================================
//   // SEARCH
//   // =====================================================

//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor:
//       colors.lightGray,
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

//   // =====================================================
//   // STORE CARD
//   // =====================================================

//   storeCard: {
//     backgroundColor: colors.lightGray,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//   },

//   storeCardContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   storeIconContainer: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },

//   storeInfo: {
//     flex: 1,
//   },

//   storeName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: colors.text,
//     marginBottom: 2,
//   },

//   storeType: {
//     fontSize: 13,
//     color: colors.textLight,
//     marginBottom: 2,
//   },

//   storeAddress: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginBottom: 4,
//   },

//   storeMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 2,
//   },

//   storeProducts: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginTop: 2,
//   },

//   storeRating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//   },

//   storeRatingText: {
//     fontSize: 12,
//     color: colors.text,
//     marginLeft: 2,
//     fontWeight: '600',
//   },

//   storeDelivery: {
//     fontSize: 12,
//     color: colors.textLight,
//   },

//   // =====================================================
//   // EMPTY STORES
//   // =====================================================

//   emptyProducts: {
//     backgroundColor:
//       colors.lightGray,
//     borderRadius: 12,
//     paddingVertical: 35,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   emptyProductsText: {
//     fontSize: 14,
//     color: colors.textLight,
//     marginTop: 10,
//     textAlign: 'center',
//   },

//   // =====================================================
//   // RESTAURANTS SECTION
//   // =====================================================

//   restaurantsSection: {
//     marginVertical: 8,
//     paddingBottom: 30,
//   },

//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent:
//       'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//     marginBottom: 12,
//   },

//   storeCount: {
//     fontSize: 14,
//     color: colors.textLight,
//   },

//   // =====================================================
//   // OFFERS
//   // =====================================================

//   offerCard: {
//     backgroundColor:
//       colors.lightGray,
//     borderRadius: 12,
//     padding: 12,
//     marginRight: 12,
//     width: width * 0.65,
//   },

//   offerTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: colors.text,
//   },

//   offerDescription: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginTop: 2,
//   },
// });

import React, {
  useState,
  useEffect,
  useContext,
} from 'react';

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
import {
  categories,
  offers,
} from '../../constants/dummyData';

import axios from 'axios';
import { API_URL } from '@env';

import CategoryItem from '../../components/home/CategoryItem';

import {
  Category,
  Offer,
} from '../../types';

import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';

import { businessAPI } from '../../api/endpoints';

import {
  SelectedBusinessContext,
} from '../../context/SelectedBusinessContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({
  navigation,
}: any) {
  const [searchText, setSearchText] =
    useState<string>('');

  const [products, setProducts] =
    useState<any[]>([]);

  const { user } =
    useContext(AuthContext);

  const [businesses, setBusinesses] =
    useState<any[]>([]);

  const [filteredBusinesses, setFilteredBusinesses] =
    useState<any[]>([]);

  const [selectedBusinessId, setSelectedBusinessId] =
    useState<number | null>(null);

  const {
    selectedBusiness,
    setSelectedBusiness,
  } = useContext(
    SelectedBusinessContext
  );

  // =====================================================
  // CART CONTEXT
  // =====================================================

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useContext(CartContext);

  // =====================================================
  // LOAD BUSINESSES
  // =====================================================

  useEffect(() => {
    businessAPI
      .getBusinesses({})
      .then((res: any) => {
        console.log('📦 Response from API:', res);
        
        let businessesData = [];
        
        // Handle different response formats
        if (Array.isArray(res)) {
          businessesData = res;
          console.log('✅ Case 1: Direct array, count:', businessesData.length);
        } else if (res?.data && Array.isArray(res.data)) {
          businessesData = res.data;
          console.log('✅ Case 2: res.data array, count:', businessesData.length);
        } else if (res?.data?.data && Array.isArray(res.data.data)) {
          businessesData = res.data.data;
          console.log('✅ Case 3: res.data.data array, count:', businessesData.length);
        } else if (res?.businesses && Array.isArray(res.businesses)) {
          businessesData = res.businesses;
          console.log('✅ Case 4: res.businesses array, count:', businessesData.length);
        } else {
          console.log('❌ No data found in any format');
        }
        
        console.log('🏪 Business names:', businessesData.map((b: any) => b.business_name || b.businessName));
        setBusinesses(businessesData);
        setFilteredBusinesses(businessesData);
      })
      .catch((err: any) => {
        console.error('❌ Failed to load businesses:', err);
        setBusinesses([]);
        setFilteredBusinesses([]);
      });
  }, []);

  // =====================================================
  // USER LOG
  // =====================================================

  useEffect(() => {
    console.log(
      '🏪 USER OBJECT:',
      user
    );
  }, [user]);

  // =====================================================
  // SEARCH FUNCTIONALITY
  // =====================================================

  const handleSearch = (text: string) => {
    setSearchText(text);
    
    if (text.trim() === '') {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter((business) => {
        const businessName = business.business_name || business.businessName || '';
        return businessName.toLowerCase().startsWith(text.toLowerCase());
      });
      setFilteredBusinesses(filtered);
    }
  };

  // =====================================================
  // CATEGORY
  // =====================================================

  const renderCategory = ({
    item,
  }: {
    item: Category;
  }) => (
    <CategoryItem category={item} />
  );

  // =====================================================
  // OFFER
  // =====================================================

  const renderOffer = ({
    item,
  }: {
    item: Offer;
  }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle}>
        {item.title}
      </Text>

      <Text
        style={styles.offerDescription}
      >
        {item.description}
      </Text>
    </View>
  );

  // =====================================================
  // BUSINESS NAME
  // =====================================================

  const businessName =
    user?.business_name ||
    'No Business Found';

  const plan =
    user?.business_plan ||
    'FREE';

  const displayName =
    businessName.length > 20
      ? businessName.substring(0, 20) +
        '...'
      : businessName;

  // =====================================================
  // SHOP CHANGE (For horizontal scroll icons ONLY)
  // =====================================================

  const handleBusinessChange = (businessId: number) => {
    if (businessId === selectedBusinessId) {
      // Deselect if clicking the same shop
      setSelectedBusinessId(null);
      setSelectedBusiness(null);
      setProducts([]);
      return;
    }

    const business =
      businesses.find(
        biz =>
          String(biz.id) ===
          String(businessId)
      );

    setSelectedBusinessId(
      Number(businessId)
    );

    if (business) {
      setSelectedBusiness({
        id: business.id,
        name: business.business_name,
      });
    }

    console.log(
      '🏪 Selected Shop:',
      business
    );
  };

  // =====================================================
  // ✅ STORE CARD RENDERER - NAVIGATES TO PRODUCT LIST
  // =====================================================

  const renderStoreCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => {
        console.log('🛒 Clicked store:', item.business_name, 'ID:', item.id);
        // Navigate to product list screen
        navigation.navigate('ProductList', {
          storeId: item.id,
          storeName: item.business_name || 'Store',
        });
      }}
      activeOpacity={0.8}
    >
      <View style={styles.storeCardContent}>
        <View style={styles.storeIconContainer}>
          <Icon
            name="storefront"
            size={32}
            color={colors.primary}
          />
        </View>
        
        <View style={styles.storeInfo}>
          <Text
            style={styles.storeName}
            numberOfLines={1}
          >
            {item.business_name || 'Unnamed Store'}
          </Text>
          
          <Text
            style={styles.storeType}
            numberOfLines={1}
          >
            {item.business_type || 'General Store'}
          </Text>
          
          {item.address && (
            <Text
              style={styles.storeAddress}
              numberOfLines={1}
            >
              <Icon name="location-outline" size={12} color={colors.textLight} />
              {' '}{item.address}
            </Text>
          )}
          
          <View style={styles.storeMeta}>
            <Text style={styles.storeProducts}>
              <Icon name="cube-outline" size={12} color={colors.textLight} />
              {' '}View Products
            </Text>
          </View>
        </View>
        
        <Icon name="chevron-forward" size={20} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text
            style={
              styles.locationLabel
            }
          >
            📍 Home
          </Text>

          <Text
            style={styles.location}
          >
            Sector 1, HSR Layout
          </Text>

          <View
            style={
              styles.businessCard
            }
          >
            <View
              style={
                styles.businessCardContent
              }
            >
              <Icon
                name="business-outline"
                size={16}
                color={colors.primary}
              />

              <Text
                style={
                  styles.businessName
                }
              >
                {displayName}
              </Text>

              {user?.business_name &&
                user.business_name !==
                  'No Business Found' && (
                  <View
                    style={
                      styles.businessBadge
                    }
                  >
                    <Text
                      style={
                        styles.businessBadgeText
                      }
                    >
                      {plan}
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Profile'
            )
          }
        >
          <Icon
            name="person-circle-outline"
            size={40}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View
        style={
          styles.searchContainer
        }
      >
        <Icon
          name="search"
          size={20}
          color={colors.gray}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurant, item or more"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* AVAILABLE STORES - Navigates to ProductList on press */}
      <View
        style={
          styles.restaurantsSection
        }
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
            Available Stores
          </Text>
          <Text style={styles.storeCount}>
            {filteredBusinesses.length} stores
          </Text>
        </View>

        {filteredBusinesses.length === 0 ? (
          <View
            style={
              styles.emptyProducts
            }
          >
            <Icon
              name="storefront-outline"
              size={45}
              color="#b5b5b5"
            />

            <Text
              style={
                styles.emptyProductsText
              }
            >
              {searchText.trim() !== '' 
                ? `No stores found matching "${searchText}"`
                : 'No stores available'}
            </Text>
          </View>
        ) : (
          filteredBusinesses.map(
            (store: any) =>
              renderStoreCard({
                item: store,
              })
          )
        )}
      </View>
    </ScrollView>
  );
}

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
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
    backgroundColor:
      colors.primary,
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

  // =====================================================
  // SEARCH
  // =====================================================

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.lightGray,
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

  // =====================================================
  // STORE CARD
  // =====================================================

  storeCard: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  storeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  storeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  storeInfo: {
    flex: 1,
  },

  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },

  storeType: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 2,
  },

  storeAddress: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 4,
  },

  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  storeProducts: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },

  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  storeRatingText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 2,
    fontWeight: '600',
  },

  storeDelivery: {
    fontSize: 12,
    color: colors.textLight,
  },

  // =====================================================
  // EMPTY STORES
  // =====================================================

  emptyProducts: {
    backgroundColor:
      colors.lightGray,
    borderRadius: 12,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyProductsText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 10,
    textAlign: 'center',
  },

  // =====================================================
  // RESTAURANTS SECTION
  // =====================================================

  restaurantsSection: {
    marginVertical: 8,
    paddingBottom: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  storeCount: {
    fontSize: 14,
    color: colors.textLight,
  },

  // =====================================================
  // OFFERS
  // =====================================================

  offerCard: {
    backgroundColor:
      colors.lightGray,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: width * 0.65,
  },

  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  offerDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
});