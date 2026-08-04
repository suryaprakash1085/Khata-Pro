// // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // import {
// // // // // // // // // //   View,
// // // // // // // // // //   Text,
// // // // // // // // // //   TextInput,
// // // // // // // // // //   FlatList,
// // // // // // // // // //   TouchableOpacity,
// // // // // // // // // //   StyleSheet,
// // // // // // // // // //   Image,
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // import { colors } from '../../constants/colors';
// // // // // // // // // // import { restaurants, categories } from '../../constants/dummyData';
// // // // // // // // // // import { Restaurant, Category } from '../../types';

// // // // // // // // // // export default function SearchScreen({ navigation }: any) {
// // // // // // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // // // // // //   const [searchResults, setSearchResults] = useState<Restaurant[]>([]);

// // // // // // // // // //   const handleSearch = (text: string): void => {
// // // // // // // // // //     setSearchText(text);
// // // // // // // // // //     if (text.trim()) {
// // // // // // // // // //       const results = restaurants.filter(
// // // // // // // // // //         (item: Restaurant) =>
// // // // // // // // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // // // // // // // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // // // // // // // // //       );
// // // // // // // // // //       setSearchResults(results);
// // // // // // // // // //     } else {
// // // // // // // // // //       setSearchResults([]);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const renderCategory = ({ item }: { item: Category }) => (
// // // // // // // // // //     <TouchableOpacity style={styles.categoryChip}>
// // // // // // // // // //       <Text style={styles.categoryChipText}>{item.icon} {item.name}</Text>
// // // // // // // // // //     </TouchableOpacity>
// // // // // // // // // //   );

// // // // // // // // // //   const renderResult = ({ item }: { item: Restaurant }) => (
// // // // // // // // // //     <TouchableOpacity
// // // // // // // // // //       style={styles.resultItem}
// // // // // // // // // //       onPress={() => navigation.navigate('RestaurantDetail', { restaurant: item })}
// // // // // // // // // //     >
// // // // // // // // // //       <Image source={{ uri: item.image }} style={styles.resultImage} />
// // // // // // // // // //       <View style={styles.resultInfo}>
// // // // // // // // // //         <Text style={styles.resultName}>{item.name}</Text>
// // // // // // // // // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // // // // // // // // //         <View style={styles.resultMeta}>
// // // // // // // // // //           <Text style={styles.resultRating}>⭐ {item.rating}</Text>
// // // // // // // // // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // // // // // // // // //         </View>
// // // // // // // // // //       </View>
// // // // // // // // // //     </TouchableOpacity>
// // // // // // // // // //   );

// // // // // // // // // //   return (
// // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // //       {/* Search Header */}
// // // // // // // // // //       <View style={styles.header}>
// // // // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // // // // //           <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // //         <View style={styles.searchContainer}>
// // // // // // // // // //           <Icon name="search" size={20} color={colors.gray} style={styles.searchIcon} />
// // // // // // // // // //           <TextInput
// // // // // // // // // //             style={styles.searchInput}
// // // // // // // // // //             placeholder="Search for restaurant, item or more"
// // // // // // // // // //             value={searchText}
// // // // // // // // // //             onChangeText={handleSearch}
// // // // // // // // // //             autoFocus
// // // // // // // // // //           />
// // // // // // // // // //           {searchText.length > 0 && (
// // // // // // // // // //             <TouchableOpacity onPress={() => handleSearch('')}>
// // // // // // // // // //               <Icon name="close-circle" size={20} color={colors.gray} />
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //           )}
// // // // // // // // // //         </View>
// // // // // // // // // //       </View>

// // // // // // // // // //       {searchText.length === 0 ? (
// // // // // // // // // //         <>
// // // // // // // // // //           {/* Popular Categories */}
// // // // // // // // // //           <View style={styles.categoriesSection}>
// // // // // // // // // //             <Text style={styles.sectionTitle}>Popular Categories</Text>
// // // // // // // // // //             <FlatList
// // // // // // // // // //               data={categories.slice(0, 8)}
// // // // // // // // // //               renderItem={renderCategory}
// // // // // // // // // //               keyExtractor={(item) => item.id}
// // // // // // // // // //               horizontal
// // // // // // // // // //               showsHorizontalScrollIndicator={false}
// // // // // // // // // //               contentContainerStyle={styles.categoriesList}
// // // // // // // // // //             />
// // // // // // // // // //           </View>

// // // // // // // // // //           {/* Recent Searches */}
// // // // // // // // // //           <View style={styles.recentSection}>
// // // // // // // // // //             <Text style={styles.sectionTitle}>Recent Searches</Text>
// // // // // // // // // //             <View style={styles.recentItem}>
// // // // // // // // // //               <Icon name="time-outline" size={20} color={colors.gray} />
// // // // // // // // // //               <Text style={styles.recentText}>Pizza Hut</Text>
// // // // // // // // // //             </View>
// // // // // // // // // //             <View style={styles.recentItem}>
// // // // // // // // // //               <Icon name="time-outline" size={20} color={colors.gray} />
// // // // // // // // // //               <Text style={styles.recentText}>Biryani</Text>
// // // // // // // // // //             </View>
// // // // // // // // // //           </View>
// // // // // // // // // //         </>
// // // // // // // // // //       ) : (
// // // // // // // // // //         <FlatList
// // // // // // // // // //           data={searchResults}
// // // // // // // // // //           renderItem={renderResult}
// // // // // // // // // //           keyExtractor={(item) => item.id}
// // // // // // // // // //           contentContainerStyle={styles.resultsList}
// // // // // // // // // //           ListEmptyComponent={
// // // // // // // // // //             <View style={styles.emptyContainer}>
// // // // // // // // // //               <Icon name="search-outline" size={60} color={colors.gray} />
// // // // // // // // // //               <Text style={styles.emptyText}>No results found</Text>
// // // // // // // // // //               <Text style={styles.emptySubText}>Try searching for something else</Text>
// // // // // // // // // //             </View>
// // // // // // // // // //           }
// // // // // // // // // //         />
// // // // // // // // // //       )}
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //   },
// // // // // // // // // //   header: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     padding: 16,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // //   },
// // // // // // // // // //   backButton: {
// // // // // // // // // //     marginRight: 12,
// // // // // // // // // //   },
// // // // // // // // // //   searchContainer: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // // //     height: 44,
// // // // // // // // // //   },
// // // // // // // // // //   searchIcon: {
// // // // // // // // // //     marginRight: 8,
// // // // // // // // // //   },
// // // // // // // // // //   searchInput: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   categoriesSection: {
// // // // // // // // // //     padding: 16,
// // // // // // // // // //   },
// // // // // // // // // //   sectionTitle: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //     marginBottom: 12,
// // // // // // // // // //   },
// // // // // // // // // //   categoriesList: {
// // // // // // // // // //     paddingVertical: 4,
// // // // // // // // // //   },
// // // // // // // // // //   categoryChip: {
// // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // //     paddingVertical: 8,
// // // // // // // // // //     borderRadius: 20,
// // // // // // // // // //     marginRight: 10,
// // // // // // // // // //   },
// // // // // // // // // //   categoryChipText: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   recentSection: {
// // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // //   },
// // // // // // // // // //   recentItem: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // //   },
// // // // // // // // // //   recentText: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //     marginLeft: 12,
// // // // // // // // // //   },
// // // // // // // // // //   resultsList: {
// // // // // // // // // //     padding: 16,
// // // // // // // // // //   },
// // // // // // // // // //   resultItem: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // //     padding: 8,
// // // // // // // // // //   },
// // // // // // // // // //   resultImage: {
// // // // // // // // // //     width: 80,
// // // // // // // // // //     height: 80,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //   },
// // // // // // // // // //   resultInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     marginLeft: 12,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   resultName: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   resultCuisine: {
// // // // // // // // // //     fontSize: 13,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 2,
// // // // // // // // // //   },
// // // // // // // // // //   resultMeta: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginTop: 4,
// // // // // // // // // //   },
// // // // // // // // // //   resultRating: {
// // // // // // // // // //     fontSize: 12,
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   resultTime: {
// // // // // // // // // //     fontSize: 12,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginLeft: 4,
// // // // // // // // // //   },
// // // // // // // // // //   emptyContainer: {
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     paddingVertical: 60,
// // // // // // // // // //   },
// // // // // // // // // //   emptyText: {
// // // // // // // // // //     fontSize: 18,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //     marginTop: 16,
// // // // // // // // // //   },
// // // // // // // // // //   emptySubText: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.gray,
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //   },
// // // // // // // // // // });
// // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   TextInput,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   FlatList,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   SafeAreaView,
// // // // // // // // //   StatusBar,
// // // // // // // // //   Image,
// // // // // // // // //   Alert,
// // // // // // // // // } from 'react-native';
// // // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // // // Dummy data for restaurants (same as HomeScreen)
// // // // // // // // // const ALL_RESTAURANTS = [
// // // // // // // // //   {
// // // // // // // // //     id: 1,
// // // // // // // // //     name: 'Pizza Hut',
// // // // // // // // //     rating: 4.0,
// // // // // // // // //     deliveryTime: '30-35 mins',
// // // // // // // // //     cuisine: 'Pizzas',
// // // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: 2,
// // // // // // // // //     name: 'Chinese Wok',
// // // // // // // // //     rating: 4.1,
// // // // // // // // //     deliveryTime: '25-30 mins',
// // // // // // // // //     cuisine: 'Chinese, Asian',
// // // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: 3,
// // // // // // // // //     name: 'UBQ by Barbeque Nation',
// // // // // // // // //     rating: 3.9,
// // // // // // // // //     deliveryTime: '30-35 mins',
// // // // // // // // //     cuisine: 'Barbeque, Biryani',
// // // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: 4,
// // // // // // // // //     name: 'Barbeque Nation',
// // // // // // // // //     rating: 3.9,
// // // // // // // // //     deliveryTime: '35-40 mins',
// // // // // // // // //     cuisine: 'Barbeque, Biryani, Kebabs',
// // // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // // //   },
// // // // // // // // //   {
// // // // // // // // //     id: 5,
// // // // // // // // //     name: 'McDonalds',
// // // // // // // // //     rating: 4.2,
// // // // // // // // //     deliveryTime: '20-25 mins',
// // // // // // // // //     cuisine: 'Burgers, Fast Food',
// // // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // // //   },
// // // // // // // // // ];

// // // // // // // // // const POPULAR_CATEGORIES = [
// // // // // // // // //   { id: 1, name: 'Pizza', icon: '🍕' },
// // // // // // // // //   { id: 2, name: 'Biryani', icon: '🍚' },
// // // // // // // // //   { id: 3, name: 'Burger', icon: '🍔' },
// // // // // // // // //   { id: 4, name: 'Dosa', icon: '🥞' },
// // // // // // // // //   { id: 5, name: 'North Indian', icon: '🍛' },
// // // // // // // // //   { id: 6, name: 'Chinese', icon: '🥢' },
// // // // // // // // // ];

// // // // // // // // // interface SearchScreenProps {
// // // // // // // // //   navigation: any;
// // // // // // // // // }

// // // // // // // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// // // // // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // // // // //   const [searchResults, setSearchResults] = useState<any[]>([]);
// // // // // // // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // // // // // // //   const [isSearching, setIsSearching] = useState<boolean>(false);

// // // // // // // // //   // Load recent searches on mount
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     loadRecentSearches();
// // // // // // // // //   }, []);

// // // // // // // // //   // Load recent searches from AsyncStorage
// // // // // // // // //   const loadRecentSearches = async () => {
// // // // // // // // //     try {
// // // // // // // // //       const saved = await AsyncStorage.getItem('recentSearches');
// // // // // // // // //       if (saved) {
// // // // // // // // //         setRecentSearches(JSON.parse(saved));
// // // // // // // // //       }
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Failed to load recent searches:', error);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Save recent searches to AsyncStorage
// // // // // // // // //   const saveRecentSearches = async (searches: string[]) => {
// // // // // // // // //     try {
// // // // // // // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Failed to save recent searches:', error);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Handle search
// // // // // // // // //   const handleSearch = (text: string) => {
// // // // // // // // //     setSearchText(text);
// // // // // // // // //     setIsSearching(text.length > 0);

// // // // // // // // //     if (text.trim()) {
// // // // // // // // //       const results = ALL_RESTAURANTS.filter(
// // // // // // // // //         (item) =>
// // // // // // // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // // // // // // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // // // // // // // //       );
// // // // // // // // //       setSearchResults(results);
// // // // // // // // //     } else {
// // // // // // // // //       setSearchResults([]);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Save search to recent
// // // // // // // // //   const saveSearch = (term: string) => {
// // // // // // // // //     if (!term.trim()) return;
    
// // // // // // // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // // // // // // //     if (updatedSearches.length > 10) {
// // // // // // // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // // // // // // //     }
// // // // // // // // //     setRecentSearches(updatedSearches);
// // // // // // // // //     saveRecentSearches(updatedSearches);
// // // // // // // // //   };

// // // // // // // // //   // Handle search submit
// // // // // // // // //   const handleSearchSubmit = () => {
// // // // // // // // //     if (searchText.trim()) {
// // // // // // // // //       saveSearch(searchText.trim());
// // // // // // // // //       setIsSearching(true);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Clear search
// // // // // // // // //   const clearSearch = () => {
// // // // // // // // //     setSearchText('');
// // // // // // // // //     setSearchResults([]);
// // // // // // // // //     setIsSearching(false);
// // // // // // // // //   };

// // // // // // // // //   // Clear a single recent search
// // // // // // // // //   const clearRecentSearch = async (term: string) => {
// // // // // // // // //     const updated = recentSearches.filter(s => s !== term);
// // // // // // // // //     setRecentSearches(updated);
// // // // // // // // //     await saveRecentSearches(updated);
// // // // // // // // //   };

// // // // // // // // //   // Clear all recent searches
// // // // // // // // //   const clearAllRecentSearches = async () => {
// // // // // // // // //     Alert.alert(
// // // // // // // // //       'Clear Recent Searches',
// // // // // // // // //       'Are you sure you want to clear all recent searches?',
// // // // // // // // //       [
// // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // //         {
// // // // // // // // //           text: 'Clear All',
// // // // // // // // //           style: 'destructive',
// // // // // // // // //           onPress: async () => {
// // // // // // // // //             setRecentSearches([]);
// // // // // // // // //             await saveRecentSearches([]);
// // // // // // // // //           },
// // // // // // // // //         },
// // // // // // // // //       ]
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   // Handle category click
// // // // // // // // //   const handleCategoryClick = (category: string) => {
// // // // // // // // //     setSearchText(category);
// // // // // // // // //     saveSearch(category);
// // // // // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // // // // //       (item) =>
// // // // // // // // //         item.cuisine.toLowerCase().includes(category.toLowerCase()) ||
// // // // // // // // //         item.name.toLowerCase().includes(category.toLowerCase())
// // // // // // // // //     );
// // // // // // // // //     setSearchResults(results);
// // // // // // // // //     setIsSearching(true);
// // // // // // // // //   };

// // // // // // // // //   // Handle recent search click
// // // // // // // // //   const handleRecentSearchClick = (term: string) => {
// // // // // // // // //     setSearchText(term);
// // // // // // // // //     saveSearch(term);
// // // // // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // // // // //       (item) =>
// // // // // // // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // // // // // // //         item.cuisine.toLowerCase().includes(term.toLowerCase())
// // // // // // // // //     );
// // // // // // // // //     setSearchResults(results);
// // // // // // // // //     setIsSearching(true);
// // // // // // // // //   };

// // // // // // // // //   // Render search result item
// // // // // // // // //   const renderSearchResult = ({ item }: { item: any }) => (
// // // // // // // // //     <TouchableOpacity
// // // // // // // // //       style={styles.resultItem}
// // // // // // // // //       onPress={() => {
// // // // // // // // //         saveSearch(item.name);
// // // // // // // // //         navigation.navigate('RestaurantDetail', { restaurant: item });
// // // // // // // // //       }}
// // // // // // // // //     >
// // // // // // // // //       <Image source={{ uri: item.image }} style={styles.resultImage} />
// // // // // // // // //       <View style={styles.resultInfo}>
// // // // // // // // //         <Text style={styles.resultName}>{item.name}</Text>
// // // // // // // // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // // // // // // // //         <View style={styles.resultMeta}>
// // // // // // // // //           <View style={styles.ratingBadge}>
// // // // // // // // //             <Icon name="star" size={12} color="#ffc107" />
// // // // // // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // // // // // // // //         </View>
// // // // // // // // //       </View>
// // // // // // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // //   );

// // // // // // // // //   // Render recent search item
// // // // // // // // //   const renderRecentSearch = ({ item }: { item: string }) => (
// // // // // // // // //     <TouchableOpacity
// // // // // // // // //       style={styles.recentItem}
// // // // // // // // //       onPress={() => handleRecentSearchClick(item)}
// // // // // // // // //     >
// // // // // // // // //       <View style={styles.recentItemLeft}>
// // // // // // // // //         <Icon name="time-outline" size={20} color="#7e808c" />
// // // // // // // // //         <Text style={styles.recentItemText}>{item}</Text>
// // // // // // // // //       </View>
// // // // // // // // //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// // // // // // // // //         <Icon name="close-circle" size={20} color="#ccc" />
// // // // // // // // //       </TouchableOpacity>
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // //   );

// // // // // // // // //   // Render popular category
// // // // // // // // //   const renderCategory = ({ item }: { item: any }) => (
// // // // // // // // //     <TouchableOpacity
// // // // // // // // //       style={styles.categoryChip}
// // // // // // // // //       onPress={() => handleCategoryClick(item.name)}
// // // // // // // // //     >
// // // // // // // // //       <Text style={styles.categoryChipText}>{item.icon} {item.name}</Text>
// // // // // // // // //     </TouchableOpacity>
// // // // // // // // //   );

// // // // // // // // //   return (
// // // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // // // // // //       {/* Header with Back Button and Search */}
// // // // // // // // //       <View style={styles.header}>
// // // // // // // // //         <TouchableOpacity 
// // // // // // // // //           onPress={() => navigation.goBack()} 
// // // // // // // // //           style={styles.backButton}
// // // // // // // // //         >
// // // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // // //         </TouchableOpacity>
// // // // // // // // //         <View style={styles.searchContainer}>
// // // // // // // // //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// // // // // // // // //           <TextInput
// // // // // // // // //             style={styles.searchInput}
// // // // // // // // //             placeholder="Search for restaurant, item or more"
// // // // // // // // //             value={searchText}
// // // // // // // // //             onChangeText={handleSearch}
// // // // // // // // //             onSubmitEditing={handleSearchSubmit}
// // // // // // // // //             autoFocus
// // // // // // // // //             returnKeyType="search"
// // // // // // // // //           />
// // // // // // // // //           {searchText.length > 0 && (
// // // // // // // // //             <TouchableOpacity onPress={clearSearch}>
// // // // // // // // //               <Icon name="close-circle" size={20} color="#7e808c" />
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           )}
// // // // // // // // //         </View>
// // // // // // // // //       </View>

// // // // // // // // //       {/* Content */}
// // // // // // // // //       {isSearching ? (
// // // // // // // // //         // Search Results
// // // // // // // // //         <FlatList
// // // // // // // // //           data={searchResults}
// // // // // // // // //           renderItem={renderSearchResult}
// // // // // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // // // // //           contentContainerStyle={styles.resultsList}
// // // // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // // // //           ListEmptyComponent={
// // // // // // // // //             <View style={styles.emptyContainer}>
// // // // // // // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // // // // // // //               <Text style={styles.emptyText}>No results found</Text>
// // // // // // // // //               <Text style={styles.emptySubText}>
// // // // // // // // //                 Try searching for something else
// // // // // // // // //               </Text>
// // // // // // // // //               {searchText.length > 0 && (
// // // // // // // // //                 <Text style={styles.emptySearchText}>
// // // // // // // // //                   "{searchText}"
// // // // // // // // //                 </Text>
// // // // // // // // //               )}
// // // // // // // // //             </View>
// // // // // // // // //           }
// // // // // // // // //           ListHeaderComponent={
// // // // // // // // //             searchResults.length > 0 ? (
// // // // // // // // //               <Text style={styles.resultsCount}>
// // // // // // // // //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// // // // // // // // //               </Text>
// // // // // // // // //             ) : null
// // // // // // // // //           }
// // // // // // // // //         />
// // // // // // // // //       ) : (
// // // // // // // // //         // Default View
// // // // // // // // //         <FlatList
// // // // // // // // //           data={[]}
// // // // // // // // //           renderItem={() => null}
// // // // // // // // //           ListHeaderComponent={
// // // // // // // // //             <View style={styles.content}>
// // // // // // // // //               {/* Popular Categories */}
// // // // // // // // //               <View style={styles.section}>
// // // // // // // // //                 <Text style={styles.sectionTitle}>Popular Categories</Text>
// // // // // // // // //                 <FlatList
// // // // // // // // //                   data={POPULAR_CATEGORIES}
// // // // // // // // //                   renderItem={renderCategory}
// // // // // // // // //                   keyExtractor={(item) => item.id.toString()}
// // // // // // // // //                   horizontal
// // // // // // // // //                   showsHorizontalScrollIndicator={false}
// // // // // // // // //                   contentContainerStyle={styles.categoriesList}
// // // // // // // // //                 />
// // // // // // // // //               </View>

// // // // // // // // //               {/* Recent Searches */}
// // // // // // // // //               {recentSearches.length > 0 && (
// // // // // // // // //                 <View style={styles.section}>
// // // // // // // // //                   <View style={styles.sectionHeader}>
// // // // // // // // //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// // // // // // // // //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// // // // // // // // //                       <Text style={styles.clearAllText}>Clear All</Text>
// // // // // // // // //                     </TouchableOpacity>
// // // // // // // // //                   </View>
// // // // // // // // //                   <FlatList
// // // // // // // // //                     data={recentSearches}
// // // // // // // // //                     renderItem={renderRecentSearch}
// // // // // // // // //                     keyExtractor={(item, index) => index.toString()}
// // // // // // // // //                     showsVerticalScrollIndicator={false}
// // // // // // // // //                   />
// // // // // // // // //                 </View>
// // // // // // // // //               )}

// // // // // // // // //               {/* Popular Restaurants */}
// // // // // // // // //               <View style={styles.section}>
// // // // // // // // //                 <Text style={styles.sectionTitle}>Popular Restaurants</Text>
// // // // // // // // //                 {ALL_RESTAURANTS.slice(0, 5).map((item) => (
// // // // // // // // //                   <TouchableOpacity
// // // // // // // // //                     key={item.id}
// // // // // // // // //                     style={styles.popularItem}
// // // // // // // // //                     onPress={() => {
// // // // // // // // //                       saveSearch(item.name);
// // // // // // // // //                       navigation.navigate('RestaurantDetail', { restaurant: item });
// // // // // // // // //                     }}
// // // // // // // // //                   >
// // // // // // // // //                     <View style={styles.popularItemLeft}>
// // // // // // // // //                       <Image 
// // // // // // // // //                         source={{ uri: item.image }} 
// // // // // // // // //                         style={styles.popularItemImage} 
// // // // // // // // //                       />
// // // // // // // // //                       <View style={styles.popularItemInfo}>
// // // // // // // // //                         <Text style={styles.popularItemName}>{item.name}</Text>
// // // // // // // // //                         <Text style={styles.popularItemCuisine}>{item.cuisine}</Text>
// // // // // // // // //                       </View>
// // // // // // // // //                     </View>
// // // // // // // // //                     <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // // // // //                   </TouchableOpacity>
// // // // // // // // //                 ))}
// // // // // // // // //               </View>
// // // // // // // // //             </View>
// // // // // // // // //           }
// // // // // // // // //         />
// // // // // // // // //       )}
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
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   backButton: {
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },
// // // // // // // // //   searchContainer: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // //     height: 44,
// // // // // // // // //   },
// // // // // // // // //   searchIcon: {
// // // // // // // // //     marginRight: 8,
// // // // // // // // //   },
// // // // // // // // //   searchInput: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     padding: 0,
// // // // // // // // //   },
// // // // // // // // //   content: {
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingBottom: 80,
// // // // // // // // //   },
// // // // // // // // //   section: {
// // // // // // // // //     marginTop: 20,
// // // // // // // // //   },
// // // // // // // // //   sectionTitle: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   sectionHeader: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   clearAllText: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: '#fc8019',
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //   },
// // // // // // // // //   categoriesList: {
// // // // // // // // //     paddingVertical: 4,
// // // // // // // // //   },
// // // // // // // // //   categoryChip: {
// // // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingVertical: 10,
// // // // // // // // //     borderRadius: 20,
// // // // // // // // //     marginRight: 10,
// // // // // // // // //   },
// // // // // // // // //   categoryChipText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   recentItem: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 14,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   recentItemLeft: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   recentItemText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },
// // // // // // // // //   resultsList: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     paddingBottom: 80,
// // // // // // // // //   },
// // // // // // // // //   resultsCount: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   resultItem: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //     padding: 12,
// // // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   resultImage: {
// // // // // // // // //     width: 60,
// // // // // // // // //     height: 60,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   resultInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },
// // // // // // // // //   resultName: {
// // // // // // // // //     fontSize: 15,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   resultCuisine: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   resultMeta: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   ratingBadge: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // // //     paddingHorizontal: 6,
// // // // // // // // //     paddingVertical: 2,
// // // // // // // // //     borderRadius: 4,
// // // // // // // // //   },
// // // // // // // // //   ratingText: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     marginLeft: 2,
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   resultTime: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginLeft: 8,
// // // // // // // // //   },
// // // // // // // // //   popularItem: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // // //   },
// // // // // // // // //   popularItemLeft: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   popularItemImage: {
// // // // // // // // //     width: 50,
// // // // // // // // //     height: 50,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },
// // // // // // // // //   popularItemInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //   },
// // // // // // // // //   popularItemName: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //   },
// // // // // // // // //   popularItemCuisine: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   emptyContainer: {
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     paddingVertical: 60,
// // // // // // // // //   },
// // // // // // // // //   emptyText: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: '#282c3f',
// // // // // // // // //     marginTop: 16,
// // // // // // // // //   },
// // // // // // // // //   emptySubText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: '#7e808c',
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   emptySearchText: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     color: '#fc8019',
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // // });

// // // // // // // // // export default SearchScreen;
// // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   TextInput,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   FlatList,
// // // // // // // //   StyleSheet,
// // // // // // // //   SafeAreaView,
// // // // // // // //   StatusBar,
// // // // // // // //   Image,
// // // // // // // //   Alert,
// // // // // // // // } from 'react-native';
// // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // // // Dummy data for restaurants (same as HomeScreen)
// // // // // // // // const ALL_RESTAURANTS = [
// // // // // // // //   {
// // // // // // // //     id: 1,
// // // // // // // //     name: 'Pizza Hut',
// // // // // // // //     rating: 4.0,
// // // // // // // //     deliveryTime: '30-35 mins',
// // // // // // // //     cuisine: 'Pizzas',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: 2,
// // // // // // // //     name: 'Chinese Wok',
// // // // // // // //     rating: 4.1,
// // // // // // // //     deliveryTime: '25-30 mins',
// // // // // // // //     cuisine: 'Chinese, Asian',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: 3,
// // // // // // // //     name: 'UBQ by Barbeque Nation',
// // // // // // // //     rating: 3.9,
// // // // // // // //     deliveryTime: '30-35 mins',
// // // // // // // //     cuisine: 'Barbeque, Biryani',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: 4,
// // // // // // // //     name: 'Barbeque Nation',
// // // // // // // //     rating: 3.9,
// // // // // // // //     deliveryTime: '35-40 mins',
// // // // // // // //     cuisine: 'Barbeque, Biryani, Kebabs',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: 5,
// // // // // // // //     name: 'McDonalds',
// // // // // // // //     rating: 4.2,
// // // // // // // //     deliveryTime: '20-25 mins',
// // // // // // // //     cuisine: 'Burgers, Fast Food',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: 6,
// // // // // // // //     name: 'Burger King',
// // // // // // // //     rating: 4.3,
// // // // // // // //     deliveryTime: '25-30 mins',
// // // // // // // //     cuisine: 'Burgers',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: 7,
// // // // // // // //     name: 'KFC',
// // // // // // // //     rating: 4.1,
// // // // // // // //     deliveryTime: '25-30 mins',
// // // // // // // //     cuisine: 'Fried Chicken',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     id: 8,
// // // // // // // //     name: 'Domino\'s Pizza',
// // // // // // // //     rating: 4.4,
// // // // // // // //     deliveryTime: '30-35 mins',
// // // // // // // //     cuisine: 'Pizzas',
// // // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // // //   },
// // // // // // // // ];

// // // // // // // // const POPULAR_CATEGORIES = [
// // // // // // // //   { id: 1, name: 'Pizza', icon: '🍕' },
// // // // // // // //   { id: 2, name: 'Biryani', icon: '🍚' },
// // // // // // // //   { id: 3, name: 'Burger', icon: '🍔' },
// // // // // // // //   { id: 4, name: 'Dosa', icon: '🥞' },
// // // // // // // //   { id: 5, name: 'North Indian', icon: '🍛' },
// // // // // // // //   { id: 6, name: 'Chinese', icon: '🥢' },
// // // // // // // // ];

// // // // // // // // interface SearchScreenProps {
// // // // // // // //   navigation: any;
// // // // // // // // }

// // // // // // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// // // // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // // // //   const [searchResults, setSearchResults] = useState<any[]>([]);
// // // // // // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // // // // // //   const [isSearching, setIsSearching] = useState<boolean>(false);

// // // // // // // //   // Load recent searches on mount
// // // // // // // //   useEffect(() => {
// // // // // // // //     loadRecentSearches();
// // // // // // // //   }, []);

// // // // // // // //   // Load recent searches from AsyncStorage
// // // // // // // //   const loadRecentSearches = async () => {
// // // // // // // //     try {
// // // // // // // //       const saved = await AsyncStorage.getItem('recentSearches');
// // // // // // // //       if (saved) {
// // // // // // // //         setRecentSearches(JSON.parse(saved));
// // // // // // // //       }
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Failed to load recent searches:', error);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Save recent searches to AsyncStorage
// // // // // // // //   const saveRecentSearches = async (searches: string[]) => {
// // // // // // // //     try {
// // // // // // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('Failed to save recent searches:', error);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Handle search
// // // // // // // //   const handleSearch = (text: string) => {
// // // // // // // //     setSearchText(text);
// // // // // // // //     setIsSearching(text.length > 0);

// // // // // // // //     if (text.trim()) {
// // // // // // // //       const results = ALL_RESTAURANTS.filter(
// // // // // // // //         (item) =>
// // // // // // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // // // // // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // // // // // // //       );
// // // // // // // //       setSearchResults(results);
// // // // // // // //     } else {
// // // // // // // //       setSearchResults([]);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Save search to recent
// // // // // // // //   const saveSearch = (term: string) => {
// // // // // // // //     if (!term.trim()) return;
    
// // // // // // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // // // // // //     if (updatedSearches.length > 10) {
// // // // // // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // // // // // //     }
// // // // // // // //     setRecentSearches(updatedSearches);
// // // // // // // //     saveRecentSearches(updatedSearches);
// // // // // // // //   };

// // // // // // // //   // Handle search submit
// // // // // // // //   const handleSearchSubmit = () => {
// // // // // // // //     if (searchText.trim()) {
// // // // // // // //       saveSearch(searchText.trim());
// // // // // // // //       setIsSearching(true);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Clear search
// // // // // // // //   const clearSearch = () => {
// // // // // // // //     setSearchText('');
// // // // // // // //     setSearchResults([]);
// // // // // // // //     setIsSearching(false);
// // // // // // // //   };

// // // // // // // //   // Clear a single recent search
// // // // // // // //   const clearRecentSearch = async (term: string) => {
// // // // // // // //     const updated = recentSearches.filter(s => s !== term);
// // // // // // // //     setRecentSearches(updated);
// // // // // // // //     await saveRecentSearches(updated);
// // // // // // // //   };

// // // // // // // //   // Clear all recent searches
// // // // // // // //   const clearAllRecentSearches = async () => {
// // // // // // // //     Alert.alert(
// // // // // // // //       'Clear Recent Searches',
// // // // // // // //       'Are you sure you want to clear all recent searches?',
// // // // // // // //       [
// // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // //         {
// // // // // // // //           text: 'Clear All',
// // // // // // // //           style: 'destructive',
// // // // // // // //           onPress: async () => {
// // // // // // // //             setRecentSearches([]);
// // // // // // // //             await saveRecentSearches([]);
// // // // // // // //           },
// // // // // // // //         },
// // // // // // // //       ]
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   // Handle category click
// // // // // // // //   const handleCategoryClick = (category: string) => {
// // // // // // // //     setSearchText(category);
// // // // // // // //     saveSearch(category);
// // // // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // // // //       (item) =>
// // // // // // // //         item.cuisine.toLowerCase().includes(category.toLowerCase()) ||
// // // // // // // //         item.name.toLowerCase().includes(category.toLowerCase())
// // // // // // // //     );
// // // // // // // //     setSearchResults(results);
// // // // // // // //     setIsSearching(true);
// // // // // // // //   };

// // // // // // // //   // Handle recent search click
// // // // // // // //   const handleRecentSearchClick = (term: string) => {
// // // // // // // //     setSearchText(term);
// // // // // // // //     saveSearch(term);
// // // // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // // // //       (item) =>
// // // // // // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // // // // // //         item.cuisine.toLowerCase().includes(term.toLowerCase())
// // // // // // // //     );
// // // // // // // //     setSearchResults(results);
// // // // // // // //     setIsSearching(true);
// // // // // // // //   };

// // // // // // // //   // Navigate to Restaurant Detail
// // // // // // // //   const navigateToRestaurant = (restaurant: any) => {
// // // // // // // //     saveSearch(restaurant.name);
// // // // // // // //     navigation.navigate('RestaurantDetail', { restaurant });
// // // // // // // //   };

// // // // // // // //   // Render search result item
// // // // // // // //   const renderSearchResult = ({ item }: { item: any }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       style={styles.resultItem}
// // // // // // // //       onPress={() => navigateToRestaurant(item)}
// // // // // // // //     >
// // // // // // // //       <Image source={{ uri: item.image }} style={styles.resultImage} />
// // // // // // // //       <View style={styles.resultInfo}>
// // // // // // // //         <Text style={styles.resultName}>{item.name}</Text>
// // // // // // // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // // // // // // //         <View style={styles.resultMeta}>
// // // // // // // //           <View style={styles.ratingBadge}>
// // // // // // // //             <Icon name="star" size={12} color="#ffc107" />
// // // // // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // // // //           </View>
// // // // // // // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // // // // // // //           {item.offer && (
// // // // // // // //             <View style={styles.offerBadge}>
// // // // // // // //               <Text style={styles.offerText}>{item.offer}</Text>
// // // // // // // //             </View>
// // // // // // // //           )}
// // // // // // // //         </View>
// // // // // // // //       </View>
// // // // // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   // Render recent search item
// // // // // // // //   const renderRecentSearch = ({ item }: { item: string }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       style={styles.recentItem}
// // // // // // // //       onPress={() => handleRecentSearchClick(item)}
// // // // // // // //     >
// // // // // // // //       <View style={styles.recentItemLeft}>
// // // // // // // //         <Icon name="time-outline" size={20} color="#7e808c" />
// // // // // // // //         <Text style={styles.recentItemText}>{item}</Text>
// // // // // // // //       </View>
// // // // // // // //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// // // // // // // //         <Icon name="close-circle" size={20} color="#ccc" />
// // // // // // // //       </TouchableOpacity>
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   // Render popular category
// // // // // // // //   const renderCategory = ({ item }: { item: any }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       style={styles.categoryChip}
// // // // // // // //       onPress={() => handleCategoryClick(item.name)}
// // // // // // // //     >
// // // // // // // //       <Text style={styles.categoryChipText}>{item.icon} {item.name}</Text>
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   // Render popular restaurant item
// // // // // // // //   const renderPopularRestaurant = ({ item }: { item: any }) => (
// // // // // // // //     <TouchableOpacity
// // // // // // // //       style={styles.popularItem}
// // // // // // // //       onPress={() => navigateToRestaurant(item)}
// // // // // // // //     >
// // // // // // // //       <View style={styles.popularItemLeft}>
// // // // // // // //         <Image 
// // // // // // // //           source={{ uri: item.image }} 
// // // // // // // //           style={styles.popularItemImage} 
// // // // // // // //         />
// // // // // // // //         <View style={styles.popularItemInfo}>
// // // // // // // //           <Text style={styles.popularItemName}>{item.name}</Text>
// // // // // // // //           <Text style={styles.popularItemCuisine}>{item.cuisine}</Text>
// // // // // // // //           <View style={styles.popularItemMeta}>
// // // // // // // //             <View style={styles.ratingBadge}>
// // // // // // // //               <Icon name="star" size={12} color="#ffc107" />
// // // // // // // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // // // //             </View>
// // // // // // // //             <Text style={styles.popularItemTime}>• {item.deliveryTime}</Text>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       </View>
// // // // // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // // // //     </TouchableOpacity>
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // // // // //       {/* Header with Back Button and Search */}
// // // // // // // //       <View style={styles.header}>
// // // // // // // //         <TouchableOpacity 
// // // // // // // //           onPress={() => navigation.goBack()} 
// // // // // // // //           style={styles.backButton}
// // // // // // // //         >
// // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //         <View style={styles.searchContainer}>
// // // // // // // //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// // // // // // // //           <TextInput
// // // // // // // //             style={styles.searchInput}
// // // // // // // //             placeholder="Search for restaurant, item or more"
// // // // // // // //             value={searchText}
// // // // // // // //             onChangeText={handleSearch}
// // // // // // // //             onSubmitEditing={handleSearchSubmit}
// // // // // // // //             autoFocus
// // // // // // // //             returnKeyType="search"
// // // // // // // //           />
// // // // // // // //           {searchText.length > 0 && (
// // // // // // // //             <TouchableOpacity onPress={clearSearch}>
// // // // // // // //               <Icon name="close-circle" size={20} color="#7e808c" />
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           )}
// // // // // // // //         </View>
// // // // // // // //       </View>

// // // // // // // //       {/* Content */}
// // // // // // // //       {isSearching ? (
// // // // // // // //         // Search Results
// // // // // // // //         <FlatList
// // // // // // // //           data={searchResults}
// // // // // // // //           renderItem={renderSearchResult}
// // // // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // // // //           contentContainerStyle={styles.resultsList}
// // // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // // //           ListEmptyComponent={
// // // // // // // //             <View style={styles.emptyContainer}>
// // // // // // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // // // // // //               <Text style={styles.emptyText}>No results found</Text>
// // // // // // // //               <Text style={styles.emptySubText}>
// // // // // // // //                 Try searching for something else
// // // // // // // //               </Text>
// // // // // // // //               {searchText.length > 0 && (
// // // // // // // //                 <Text style={styles.emptySearchText}>
// // // // // // // //                   "{searchText}"
// // // // // // // //                 </Text>
// // // // // // // //               )}
// // // // // // // //             </View>
// // // // // // // //           }
// // // // // // // //           ListHeaderComponent={
// // // // // // // //             searchResults.length > 0 ? (
// // // // // // // //               <Text style={styles.resultsCount}>
// // // // // // // //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// // // // // // // //               </Text>
// // // // // // // //             ) : null
// // // // // // // //           }
// // // // // // // //         />
// // // // // // // //       ) : (
// // // // // // // //         // Default View with Popular Restaurants
// // // // // // // //         <FlatList
// // // // // // // //           data={ALL_RESTAURANTS}
// // // // // // // //           renderItem={renderPopularRestaurant}
// // // // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // // // //           contentContainerStyle={styles.content}
// // // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // // //           ListHeaderComponent={
// // // // // // // //             <View>
// // // // // // // //               {/* Popular Categories */}
// // // // // // // //               <View style={styles.section}>
// // // // // // // //                 <Text style={styles.sectionTitle}>Popular Categories</Text>
// // // // // // // //                 <FlatList
// // // // // // // //                   data={POPULAR_CATEGORIES}
// // // // // // // //                   renderItem={renderCategory}
// // // // // // // //                   keyExtractor={(item) => item.id.toString()}
// // // // // // // //                   horizontal
// // // // // // // //                   showsHorizontalScrollIndicator={false}
// // // // // // // //                   contentContainerStyle={styles.categoriesList}
// // // // // // // //                 />
// // // // // // // //               </View>

// // // // // // // //               {/* Recent Searches */}
// // // // // // // //               {recentSearches.length > 0 && (
// // // // // // // //                 <View style={styles.section}>
// // // // // // // //                   <View style={styles.sectionHeader}>
// // // // // // // //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// // // // // // // //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// // // // // // // //                       <Text style={styles.clearAllText}>Clear All</Text>
// // // // // // // //                     </TouchableOpacity>
// // // // // // // //                   </View>
// // // // // // // //                   <FlatList
// // // // // // // //                     data={recentSearches}
// // // // // // // //                     renderItem={renderRecentSearch}
// // // // // // // //                     keyExtractor={(item, index) => index.toString()}
// // // // // // // //                     showsVerticalScrollIndicator={false}
// // // // // // // //                   />
// // // // // // // //                 </View>
// // // // // // // //               )}

// // // // // // // //               {/* Popular Restaurants Section */}
// // // // // // // //               <View style={styles.section}>
// // // // // // // //                 <Text style={styles.sectionTitle}>Popular Restaurants</Text>
// // // // // // // //               </View>
// // // // // // // //             </View>
// // // // // // // //           }
// // // // // // // //           ListFooterComponent={
// // // // // // // //             <View style={styles.footer}>
// // // // // // // //               <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // // // // // // //               <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
// // // // // // // //             </View>
// // // // // // // //           }
// // // // // // // //         />
// // // // // // // //       )}
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
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   backButton: {
// // // // // // // //     marginRight: 12,
// // // // // // // //   },
// // // // // // // //   searchContainer: {
// // // // // // // //     flex: 1,
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     paddingHorizontal: 12,
// // // // // // // //     height: 44,
// // // // // // // //   },
// // // // // // // //   searchIcon: {
// // // // // // // //     marginRight: 8,
// // // // // // // //   },
// // // // // // // //   searchInput: {
// // // // // // // //     flex: 1,
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#282c3f',
// // // // // // // //     padding: 0,
// // // // // // // //   },
// // // // // // // //   content: {
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingBottom: 20,
// // // // // // // //   },
// // // // // // // //   section: {
// // // // // // // //     marginTop: 20,
// // // // // // // //   },
// // // // // // // //   sectionTitle: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   sectionHeader: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   clearAllText: {
// // // // // // // //     fontSize: 13,
// // // // // // // //     color: '#fc8019',
// // // // // // // //     fontWeight: '500',
// // // // // // // //   },
// // // // // // // //   categoriesList: {
// // // // // // // //     paddingVertical: 4,
// // // // // // // //   },
// // // // // // // //   categoryChip: {
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 10,
// // // // // // // //     borderRadius: 20,
// // // // // // // //     marginRight: 10,
// // // // // // // //   },
// // // // // // // //   categoryChipText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   recentItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 14,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   recentItemLeft: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   recentItemText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginLeft: 12,
// // // // // // // //   },
// // // // // // // //   resultsList: {
// // // // // // // //     padding: 16,
// // // // // // // //     paddingBottom: 20,
// // // // // // // //   },
// // // // // // // //   resultsCount: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   resultItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 16,
// // // // // // // //     padding: 12,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   resultImage: {
// // // // // // // //     width: 60,
// // // // // // // //     height: 60,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   resultInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //     marginLeft: 12,
// // // // // // // //   },
// // // // // // // //   resultName: {
// // // // // // // //     fontSize: 15,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   resultCuisine: {
// // // // // // // //     fontSize: 13,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   resultMeta: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginTop: 4,
// // // // // // // //     flexWrap: 'wrap',
// // // // // // // //   },
// // // // // // // //   ratingBadge: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //     paddingHorizontal: 6,
// // // // // // // //     paddingVertical: 2,
// // // // // // // //     borderRadius: 4,
// // // // // // // //   },
// // // // // // // //   ratingText: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     marginLeft: 2,
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   resultTime: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },
// // // // // // // //   offerBadge: {
// // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // //     paddingHorizontal: 6,
// // // // // // // //     paddingVertical: 2,
// // // // // // // //     borderRadius: 4,
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },
// // // // // // // //   offerText: {
// // // // // // // //     fontSize: 9,
// // // // // // // //     color: '#ffffff',
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   popularItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   popularItemLeft: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   popularItemImage: {
// // // // // // // //     width: 50,
// // // // // // // //     height: 50,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //     marginRight: 12,
// // // // // // // //   },
// // // // // // // //   popularItemInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   popularItemName: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   popularItemCuisine: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   popularItemMeta: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   popularItemTime: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },
// // // // // // // //   emptyContainer: {
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     paddingVertical: 60,
// // // // // // // //   },
// // // // // // // //   emptyText: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginTop: 16,
// // // // // // // //   },
// // // // // // // //   emptySubText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   emptySearchText: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     color: '#fc8019',
// // // // // // // //     fontWeight: '500',
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   footer: {
// // // // // // // //     paddingVertical: 30,
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   footerText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#93959f',
// // // // // // // //   },
// // // // // // // //   footerSub: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#c0c0c0',
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // // export default SearchScreen;
// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   TextInput,
// // // // // // //   TouchableOpacity,
// // // // // // //   FlatList,
// // // // // // //   StyleSheet,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // //   Image,
// // // // // // //   Alert,
// // // // // // //   ScrollView,
// // // // // // // } from 'react-native';
// // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // // Dummy data for restaurants
// // // // // // // const ALL_RESTAURANTS = [
// // // // // // //   {
// // // // // // //     id: 1,
// // // // // // //     name: 'Pizza Hut',
// // // // // // //     rating: 4.0,
// // // // // // //     deliveryTime: '30-35 mins',
// // // // // // //     cuisine: 'Pizzas',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 2,
// // // // // // //     name: 'Chinese Wok',
// // // // // // //     rating: 4.1,
// // // // // // //     deliveryTime: '25-30 mins',
// // // // // // //     cuisine: 'Chinese, Asian',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: true,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 3,
// // // // // // //     name: 'UBQ by Barbeque Nation',
// // // // // // //     rating: 3.9,
// // // // // // //     deliveryTime: '30-35 mins',
// // // // // // //     cuisine: 'Barbeque, Biryani',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 4,
// // // // // // //     name: 'Barbeque Nation',
// // // // // // //     rating: 3.9,
// // // // // // //     deliveryTime: '35-40 mins',
// // // // // // //     cuisine: 'Barbeque, Biryani, Kebabs',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 5,
// // // // // // //     name: 'McDonalds',
// // // // // // //     rating: 4.2,
// // // // // // //     deliveryTime: '20-25 mins',
// // // // // // //     cuisine: 'Burgers, Fast Food',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 6,
// // // // // // //     name: 'Burger King',
// // // // // // //     rating: 4.3,
// // // // // // //     deliveryTime: '25-30 mins',
// // // // // // //     cuisine: 'Burgers',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 7,
// // // // // // //     name: 'KFC',
// // // // // // //     rating: 4.1,
// // // // // // //     deliveryTime: '25-30 mins',
// // // // // // //     cuisine: 'Fried Chicken',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: false,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 8,
// // // // // // //     name: 'Domino\'s Pizza',
// // // // // // //     rating: 4.4,
// // // // // // //     deliveryTime: '30-35 mins',
// // // // // // //     cuisine: 'Pizzas',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: true,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 9,
// // // // // // //     name: 'Taco Bell',
// // // // // // //     rating: 4.1,
// // // // // // //     deliveryTime: '20-25 mins',
// // // // // // //     cuisine: 'Mexican',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: true,
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 10,
// // // // // // //     name: 'Subway',
// // // // // // //     rating: 4.0,
// // // // // // //     deliveryTime: '15-20 mins',
// // // // // // //     cuisine: 'Sandwiches, Healthy Food',
// // // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // // //     image: 'https://via.placeholder.com/150',
// // // // // // //     isVeg: true,
// // // // // // //   },
// // // // // // // ];

// // // // // // // const POPULAR_CATEGORIES = [
// // // // // // //   { id: 1, name: 'Pizza', icon: '🍕' },
// // // // // // //   { id: 2, name: 'Biryani', icon: '🍚' },
// // // // // // //   { id: 3, name: 'Burger', icon: '🍔' },
// // // // // // //   { id: 4, name: 'Dosa', icon: '🥞' },
// // // // // // //   { id: 5, name: 'North Indian', icon: '🍛' },
// // // // // // //   { id: 6, name: 'Chinese', icon: '🥢' },
// // // // // // //   { id: 7, name: 'South Indian', icon: '🍛' },
// // // // // // //   { id: 8, name: 'Cakes', icon: '🎂' },
// // // // // // // ];

// // // // // // // interface SearchScreenProps {
// // // // // // //   navigation: any;
// // // // // // // }

// // // // // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// // // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // // //   const [searchResults, setSearchResults] = useState<any[]>([]);
// // // // // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // // // // //   const [isSearching, setIsSearching] = useState<boolean>(false);
// // // // // // //   const [showRecentSearches, setShowRecentSearches] = useState<boolean>(true);

// // // // // // //   // Load recent searches on mount
// // // // // // //   useEffect(() => {
// // // // // // //     loadRecentSearches();
// // // // // // //   }, []);

// // // // // // //   // Load recent searches from AsyncStorage
// // // // // // //   const loadRecentSearches = async () => {
// // // // // // //     try {
// // // // // // //       const saved = await AsyncStorage.getItem('recentSearches');
// // // // // // //       if (saved) {
// // // // // // //         setRecentSearches(JSON.parse(saved));
// // // // // // //       }
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Failed to load recent searches:', error);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Save recent searches to AsyncStorage
// // // // // // //   const saveRecentSearches = async (searches: string[]) => {
// // // // // // //     try {
// // // // // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // // // // //     } catch (error) {
// // // // // // //       console.error('Failed to save recent searches:', error);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Handle search
// // // // // // //   const handleSearch = (text: string) => {
// // // // // // //     setSearchText(text);
// // // // // // //     setIsSearching(text.length > 0);

// // // // // // //     if (text.trim()) {
// // // // // // //       const results = ALL_RESTAURANTS.filter(
// // // // // // //         (item) =>
// // // // // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // // // // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // // // // // //       );
// // // // // // //       setSearchResults(results);
// // // // // // //       setShowRecentSearches(false);
// // // // // // //     } else {
// // // // // // //       setSearchResults([]);
// // // // // // //       setShowRecentSearches(true);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Save search to recent
// // // // // // //   const saveSearch = (term: string) => {
// // // // // // //     if (!term.trim()) return;
    
// // // // // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // // // // //     if (updatedSearches.length > 10) {
// // // // // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // // // // //     }
// // // // // // //     setRecentSearches(updatedSearches);
// // // // // // //     saveRecentSearches(updatedSearches);
// // // // // // //   };

// // // // // // //   // Handle search submit
// // // // // // //   const handleSearchSubmit = () => {
// // // // // // //     if (searchText.trim()) {
// // // // // // //       saveSearch(searchText.trim());
// // // // // // //       setIsSearching(true);
// // // // // // //       setShowRecentSearches(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Clear search
// // // // // // //   const clearSearch = () => {
// // // // // // //     setSearchText('');
// // // // // // //     setSearchResults([]);
// // // // // // //     setIsSearching(false);
// // // // // // //     setShowRecentSearches(true);
// // // // // // //   };

// // // // // // //   // Clear a single recent search
// // // // // // //   const clearRecentSearch = async (term: string) => {
// // // // // // //     const updated = recentSearches.filter(s => s !== term);
// // // // // // //     setRecentSearches(updated);
// // // // // // //     await saveRecentSearches(updated);
// // // // // // //   };

// // // // // // //   // Clear all recent searches
// // // // // // //   const clearAllRecentSearches = async () => {
// // // // // // //     Alert.alert(
// // // // // // //       'Clear Recent Searches',
// // // // // // //       'Are you sure you want to clear all recent searches?',
// // // // // // //       [
// // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // //         {
// // // // // // //           text: 'Clear All',
// // // // // // //           style: 'destructive',
// // // // // // //           onPress: async () => {
// // // // // // //             setRecentSearches([]);
// // // // // // //             await saveRecentSearches([]);
// // // // // // //           },
// // // // // // //         },
// // // // // // //       ]
// // // // // // //     );
// // // // // // //   };

// // // // // // //   // Handle category click
// // // // // // //   const handleCategoryClick = (category: string) => {
// // // // // // //     setSearchText(category);
// // // // // // //     saveSearch(category);
// // // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // // //       (item) =>
// // // // // // //         item.cuisine.toLowerCase().includes(category.toLowerCase()) ||
// // // // // // //         item.name.toLowerCase().includes(category.toLowerCase())
// // // // // // //     );
// // // // // // //     setSearchResults(results);
// // // // // // //     setIsSearching(true);
// // // // // // //     setShowRecentSearches(false);
// // // // // // //   };

// // // // // // //   // Handle recent search click
// // // // // // //   const handleRecentSearchClick = (term: string) => {
// // // // // // //     setSearchText(term);
// // // // // // //     saveSearch(term);
// // // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // // //       (item) =>
// // // // // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // // // // //         item.cuisine.toLowerCase().includes(term.toLowerCase())
// // // // // // //     );
// // // // // // //     setSearchResults(results);
// // // // // // //     setIsSearching(true);
// // // // // // //     setShowRecentSearches(false);
// // // // // // //   };

// // // // // // //   // Navigate to Restaurant Detail
// // // // // // //   const navigateToRestaurant = (restaurant: any) => {
// // // // // // //     saveSearch(restaurant.name);
// // // // // // //     navigation.navigate('RestaurantDetail', { restaurant });
// // // // // // //   };

// // // // // // //   // Render search result item (Swiggy style)
// // // // // // //   const renderSearchResult = ({ item }: { item: any }) => (
// // // // // // //     <TouchableOpacity
// // // // // // //       style={styles.resultItem}
// // // // // // //       onPress={() => navigateToRestaurant(item)}
// // // // // // //     >
// // // // // // //       <View style={styles.resultImageContainer}>
// // // // // // //         <Image source={{ uri: item.image }} style={styles.resultImage} />
// // // // // // //         {item.isVeg && (
// // // // // // //           <View style={styles.vegBadge}>
// // // // // // //             <Text style={styles.vegBadgeText}>🟢</Text>
// // // // // // //           </View>
// // // // // // //         )}
// // // // // // //       </View>
// // // // // // //       <View style={styles.resultInfo}>
// // // // // // //         <Text style={styles.resultName}>{item.name}</Text>
// // // // // // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // // // // // //         <View style={styles.resultMeta}>
// // // // // // //           <View style={styles.ratingBadge}>
// // // // // // //             <Icon name="star" size={12} color="#ffc107" />
// // // // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // // //           </View>
// // // // // // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // // // // // //           {item.offer && (
// // // // // // //             <View style={styles.offerBadge}>
// // // // // // //               <Text style={styles.offerText}>{item.offer}</Text>
// // // // // // //             </View>
// // // // // // //           )}
// // // // // // //         </View>
// // // // // // //       </View>
// // // // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // // //     </TouchableOpacity>
// // // // // // //   );

// // // // // // //   // Render recent search item
// // // // // // //   const renderRecentSearch = ({ item }: { item: string }) => (
// // // // // // //     <TouchableOpacity
// // // // // // //       style={styles.recentItem}
// // // // // // //       onPress={() => handleRecentSearchClick(item)}
// // // // // // //     >
// // // // // // //       <View style={styles.recentItemLeft}>
// // // // // // //         <Icon name="time-outline" size={20} color="#7e808c" />
// // // // // // //         <Text style={styles.recentItemText}>{item}</Text>
// // // // // // //       </View>
// // // // // // //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// // // // // // //         <Icon name="close-circle" size={20} color="#ccc" />
// // // // // // //       </TouchableOpacity>
// // // // // // //     </TouchableOpacity>
// // // // // // //   );

// // // // // // //   // Render popular category
// // // // // // //   const renderCategory = ({ item }: { item: any }) => (
// // // // // // //     <TouchableOpacity
// // // // // // //       style={styles.categoryChip}
// // // // // // //       onPress={() => handleCategoryClick(item.name)}
// // // // // // //     >
// // // // // // //       <Text style={styles.categoryEmoji}>{item.icon}</Text>
// // // // // // //       <Text style={styles.categoryChipText}>{item.name}</Text>
// // // // // // //     </TouchableOpacity>
// // // // // // //   );

// // // // // // //   // Render popular restaurant item
// // // // // // //   const renderPopularRestaurant = ({ item }: { item: any }) => (
// // // // // // //     <TouchableOpacity
// // // // // // //       style={styles.popularItem}
// // // // // // //       onPress={() => navigateToRestaurant(item)}
// // // // // // //     >
// // // // // // //       <View style={styles.popularItemLeft}>
// // // // // // //         <Image 
// // // // // // //           source={{ uri: item.image }} 
// // // // // // //           style={styles.popularItemImage} 
// // // // // // //         />
// // // // // // //         <View style={styles.popularItemInfo}>
// // // // // // //           <Text style={styles.popularItemName}>{item.name}</Text>
// // // // // // //           <Text style={styles.popularItemCuisine}>{item.cuisine}</Text>
// // // // // // //           <View style={styles.popularItemMeta}>
// // // // // // //             <View style={styles.ratingBadge}>
// // // // // // //               <Icon name="star" size={12} color="#ffc107" />
// // // // // // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // // //             </View>
// // // // // // //             <Text style={styles.popularItemTime}>• {item.deliveryTime}</Text>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </View>
// // // // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // // //     </TouchableOpacity>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // // // //       {/* Header with Back Button and Search */}
// // // // // // //       <View style={styles.header}>
// // // // // // //         <TouchableOpacity 
// // // // // // //           onPress={() => navigation.goBack()} 
// // // // // // //           style={styles.backButton}
// // // // // // //         >
// // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // //         </TouchableOpacity>
// // // // // // //         <View style={styles.searchContainer}>
// // // // // // //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// // // // // // //           <TextInput
// // // // // // //             style={styles.searchInput}
// // // // // // //             placeholder="Search for restaurant, item or more"
// // // // // // //             value={searchText}
// // // // // // //             onChangeText={handleSearch}
// // // // // // //             onSubmitEditing={handleSearchSubmit}
// // // // // // //             autoFocus
// // // // // // //             returnKeyType="search"
// // // // // // //           />
// // // // // // //           {searchText.length > 0 && (
// // // // // // //             <TouchableOpacity onPress={clearSearch}>
// // // // // // //               <Icon name="close-circle" size={20} color="#7e808c" />
// // // // // // //             </TouchableOpacity>
// // // // // // //           )}
// // // // // // //         </View>
// // // // // // //       </View>

// // // // // // //       {/* Content */}
// // // // // // //       {isSearching ? (
// // // // // // //         // Search Results
// // // // // // //         <FlatList
// // // // // // //           data={searchResults}
// // // // // // //           renderItem={renderSearchResult}
// // // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // // //           contentContainerStyle={styles.resultsList}
// // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // //           ListEmptyComponent={
// // // // // // //             <View style={styles.emptyContainer}>
// // // // // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // // // // //               <Text style={styles.emptyText}>No results found</Text>
// // // // // // //               <Text style={styles.emptySubText}>
// // // // // // //                 Try searching for something else
// // // // // // //               </Text>
// // // // // // //               {searchText.length > 0 && (
// // // // // // //                 <Text style={styles.emptySearchText}>
// // // // // // //                   "{searchText}"
// // // // // // //                 </Text>
// // // // // // //               )}
// // // // // // //             </View>
// // // // // // //           }
// // // // // // //           ListHeaderComponent={
// // // // // // //             searchResults.length > 0 ? (
// // // // // // //               <Text style={styles.resultsCount}>
// // // // // // //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// // // // // // //               </Text>
// // // // // // //             ) : null
// // // // // // //           }
// // // // // // //         />
// // // // // // //       ) : (
// // // // // // //         // Default View with Popular Categories and Restaurants
// // // // // // //         <FlatList
// // // // // // //           data={ALL_RESTAURANTS}
// // // // // // //           renderItem={renderPopularRestaurant}
// // // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // // //           contentContainerStyle={styles.content}
// // // // // // //           showsVerticalScrollIndicator={false}
// // // // // // //           ListHeaderComponent={
// // // // // // //             <View>
// // // // // // //               {/* Popular Categories */}
// // // // // // //               <View style={styles.section}>
// // // // // // //                 <Text style={styles.sectionTitle}>Popular Categories</Text>
// // // // // // //                 <FlatList
// // // // // // //                   data={POPULAR_CATEGORIES}
// // // // // // //                   renderItem={renderCategory}
// // // // // // //                   keyExtractor={(item) => item.id.toString()}
// // // // // // //                   horizontal
// // // // // // //                   showsHorizontalScrollIndicator={false}
// // // // // // //                   contentContainerStyle={styles.categoriesList}
// // // // // // //                 />
// // // // // // //               </View>

// // // // // // //               {/* Recent Searches */}
// // // // // // //               {recentSearches.length > 0 && showRecentSearches && (
// // // // // // //                 <View style={styles.section}>
// // // // // // //                   <View style={styles.sectionHeader}>
// // // // // // //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// // // // // // //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// // // // // // //                       <Text style={styles.clearAllText}>Clear All</Text>
// // // // // // //                     </TouchableOpacity>
// // // // // // //                   </View>
// // // // // // //                   <FlatList
// // // // // // //                     data={recentSearches}
// // // // // // //                     renderItem={renderRecentSearch}
// // // // // // //                     keyExtractor={(item, index) => index.toString()}
// // // // // // //                     showsVerticalScrollIndicator={false}
// // // // // // //                   />
// // // // // // //                 </View>
// // // // // // //               )}

// // // // // // //               {/* Popular Restaurants Section */}
// // // // // // //               <View style={styles.section}>
// // // // // // //                 <Text style={styles.sectionTitle}>Popular Restaurants</Text>
// // // // // // //               </View>
// // // // // // //             </View>
// // // // // // //           }
// // // // // // //           ListFooterComponent={
// // // // // // //             <View style={styles.footer}>
// // // // // // //               <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // // // // // //               <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
// // // // // // //             </View>
// // // // // // //           }
// // // // // // //         />
// // // // // // //       )}
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
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   backButton: {
// // // // // // //     marginRight: 12,
// // // // // // //   },
// // // // // // //   searchContainer: {
// // // // // // //     flex: 1,
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //     borderRadius: 12,
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     height: 44,
// // // // // // //   },
// // // // // // //   searchIcon: {
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   searchInput: {
// // // // // // //     flex: 1,
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //     padding: 0,
// // // // // // //   },
// // // // // // //   content: {
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingBottom: 20,
// // // // // // //   },
// // // // // // //   section: {
// // // // // // //     marginTop: 20,
// // // // // // //   },
// // // // // // //   sectionTitle: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   sectionHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   clearAllText: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: '#fc8019',
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   categoriesList: {
// // // // // // //     paddingVertical: 4,
// // // // // // //   },
// // // // // // //   categoryChip: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 10,
// // // // // // //     borderRadius: 20,
// // // // // // //     marginRight: 10,
// // // // // // //   },
// // // // // // //   categoryEmoji: {
// // // // // // //     fontSize: 16,
// // // // // // //     marginRight: 4,
// // // // // // //   },
// // // // // // //   categoryChipText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   recentItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 14,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   recentItemLeft: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   recentItemText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //     marginLeft: 12,
// // // // // // //   },
// // // // // // //   resultsList: {
// // // // // // //     padding: 16,
// // // // // // //     paddingBottom: 20,
// // // // // // //   },
// // // // // // //   resultsCount: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   resultItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 16,
// // // // // // //     padding: 12,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderRadius: 12,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   resultImageContainer: {
// // // // // // //     position: 'relative',
// // // // // // //   },
// // // // // // //   resultImage: {
// // // // // // //     width: 60,
// // // // // // //     height: 60,
// // // // // // //     borderRadius: 8,
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   vegBadge: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 2,
// // // // // // //     right: 2,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderRadius: 10,
// // // // // // //     padding: 2,
// // // // // // //   },
// // // // // // //   vegBadgeText: {
// // // // // // //     fontSize: 10,
// // // // // // //   },
// // // // // // //   resultInfo: {
// // // // // // //     flex: 1,
// // // // // // //     marginLeft: 12,
// // // // // // //   },
// // // // // // //   resultName: {
// // // // // // //     fontSize: 15,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   resultCuisine: {
// // // // // // //     fontSize: 13,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   resultMeta: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 4,
// // // // // // //     flexWrap: 'wrap',
// // // // // // //   },
// // // // // // //   ratingBadge: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //     paddingHorizontal: 6,
// // // // // // //     paddingVertical: 2,
// // // // // // //     borderRadius: 4,
// // // // // // //   },
// // // // // // //   ratingText: {
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: '500',
// // // // // // //     marginLeft: 2,
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   resultTime: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   offerBadge: {
// // // // // // //     backgroundColor: '#fc8019',
// // // // // // //     paddingHorizontal: 6,
// // // // // // //     paddingVertical: 2,
// // // // // // //     borderRadius: 4,
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   offerText: {
// // // // // // //     fontSize: 9,
// // // // // // //     color: '#ffffff',
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   popularItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   popularItemLeft: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   popularItemImage: {
// // // // // // //     width: 50,
// // // // // // //     height: 50,
// // // // // // //     borderRadius: 8,
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //     marginRight: 12,
// // // // // // //   },
// // // // // // //   popularItemInfo: {
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   popularItemName: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   popularItemCuisine: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   popularItemMeta: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   popularItemTime: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   emptyContainer: {
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'center',
// // // // // // //     paddingVertical: 60,
// // // // // // //   },
// // // // // // //   emptyText: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginTop: 16,
// // // // // // //   },
// // // // // // //   emptySubText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   emptySearchText: {
// // // // // // //     fontSize: 16,
// // // // // // //     color: '#fc8019',
// // // // // // //     fontWeight: '500',
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   footer: {
// // // // // // //     paddingVertical: 30,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   footerText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#93959f',
// // // // // // //   },
// // // // // // //   footerSub: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#c0c0c0',
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // // });

// // // // // // // export default SearchScreen;
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   TextInput,
// // // // // //   TouchableOpacity,
// // // // // //   FlatList,
// // // // // //   StyleSheet,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // //   Image,
// // // // // //   Alert,
// // // // // // } from 'react-native';
// // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // // Dummy data for restaurants
// // // // // // const ALL_RESTAURANTS = [
// // // // // //   {
// // // // // //     id: 1,
// // // // // //     name: 'Pizza Hut',
// // // // // //     rating: 4.0,
// // // // // //     deliveryTime: '30-35 mins',
// // // // // //     cuisine: 'Pizzas',
// // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // //     image: 'https://via.placeholder.com/150',
// // // // // //     isVeg: false,
// // // // // //   },
// // // // // //   {
// // // // // //     id: 2,
// // // // // //     name: 'Chinese Wok',
// // // // // //     rating: 4.1,
// // // // // //     deliveryTime: '25-30 mins',
// // // // // //     cuisine: 'Chinese, Asian',
// // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // //     image: 'https://via.placeholder.com/150',
// // // // // //     isVeg: true,
// // // // // //   },
// // // // // //   {
// // // // // //     id: 3,
// // // // // //     name: 'UBQ by Barbeque Nation',
// // // // // //     rating: 3.9,
// // // // // //     deliveryTime: '30-35 mins',
// // // // // //     cuisine: 'Barbeque, Biryani',
// // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // //     image: 'https://via.placeholder.com/150',
// // // // // //     isVeg: false,
// // // // // //   },
// // // // // //   {
// // // // // //     id: 4,
// // // // // //     name: 'Barbeque Nation',
// // // // // //     rating: 3.9,
// // // // // //     deliveryTime: '35-40 mins',
// // // // // //     cuisine: 'Barbeque, Biryani, Kebabs',
// // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // //     image: 'https://via.placeholder.com/150',
// // // // // //     isVeg: false,
// // // // // //   },
// // // // // //   {
// // // // // //     id: 5,
// // // // // //     name: 'McDonalds',
// // // // // //     rating: 4.2,
// // // // // //     deliveryTime: '20-25 mins',
// // // // // //     cuisine: 'Burgers, Fast Food',
// // // // // //     offer: '50% OFF UPTO ₹100',
// // // // // //     image: 'https://via.placeholder.com/150',
// // // // // //     isVeg: false,
// // // // // //   },
// // // // // // ];

// // // // // // const POPULAR_CATEGORIES = [
// // // // // //   { id: 1, name: 'Pizza', icon: '🍕' },
// // // // // //   { id: 2, name: 'Biryani', icon: '🍚' },
// // // // // //   { id: 3, name: 'Burger', icon: '🍔' },
// // // // // //   { id: 4, name: 'Dosa', icon: '🥞' },
// // // // // //   { id: 5, name: 'North Indian', icon: '🍛' },
// // // // // //   { id: 6, name: 'Chinese', icon: '🥢' },
// // // // // // ];

// // // // // // interface SearchScreenProps {
// // // // // //   navigation: any;
// // // // // // }

// // // // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// // // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // // //   const [searchResults, setSearchResults] = useState<any[]>([]);
// // // // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // // // //   const [isSearching, setIsSearching] = useState<boolean>(false);

// // // // // //   // Load recent searches on mount
// // // // // //   useEffect(() => {
// // // // // //     loadRecentSearches();
// // // // // //   }, []);

// // // // // //   // Load recent searches from AsyncStorage
// // // // // //   const loadRecentSearches = async () => {
// // // // // //     try {
// // // // // //       const saved = await AsyncStorage.getItem('recentSearches');
// // // // // //       if (saved) {
// // // // // //         setRecentSearches(JSON.parse(saved));
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error('Failed to load recent searches:', error);
// // // // // //     }
// // // // // //   };

// // // // // //   // Save recent searches to AsyncStorage
// // // // // //   const saveRecentSearches = async (searches: string[]) => {
// // // // // //     try {
// // // // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // // // //     } catch (error) {
// // // // // //       console.error('Failed to save recent searches:', error);
// // // // // //     }
// // // // // //   };

// // // // // //   // Handle search
// // // // // //   const handleSearch = (text: string) => {
// // // // // //     setSearchText(text);
// // // // // //     setIsSearching(text.length > 0);

// // // // // //     if (text.trim()) {
// // // // // //       const results = ALL_RESTAURANTS.filter(
// // // // // //         (item) =>
// // // // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // // // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // // // // //       );
// // // // // //       setSearchResults(results);
// // // // // //     } else {
// // // // // //       setSearchResults([]);
// // // // // //     }
// // // // // //   };

// // // // // //   // Save search to recent (only for actual searches, not category clicks)
// // // // // //   const saveSearch = (term: string) => {
// // // // // //     if (!term.trim()) return;
    
// // // // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // // // //     if (updatedSearches.length > 10) {
// // // // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // // // //     }
// // // // // //     setRecentSearches(updatedSearches);
// // // // // //     saveRecentSearches(updatedSearches);
// // // // // //   };

// // // // // //   // Handle search submit
// // // // // //   const handleSearchSubmit = () => {
// // // // // //     if (searchText.trim()) {
// // // // // //       saveSearch(searchText.trim());
// // // // // //       setIsSearching(true);
// // // // // //     }
// // // // // //   };

// // // // // //   // Clear search
// // // // // //   const clearSearch = () => {
// // // // // //     setSearchText('');
// // // // // //     setSearchResults([]);
// // // // // //     setIsSearching(false);
// // // // // //   };

// // // // // //   // Clear a single recent search
// // // // // //   const clearRecentSearch = async (term: string) => {
// // // // // //     const updated = recentSearches.filter(s => s !== term);
// // // // // //     setRecentSearches(updated);
// // // // // //     await saveRecentSearches(updated);
// // // // // //   };

// // // // // //   // Clear all recent searches
// // // // // //   const clearAllRecentSearches = async () => {
// // // // // //     Alert.alert(
// // // // // //       'Clear Recent Searches',
// // // // // //       'Are you sure you want to clear all recent searches?',
// // // // // //       [
// // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // //         {
// // // // // //           text: 'Clear All',
// // // // // //           style: 'destructive',
// // // // // //           onPress: async () => {
// // // // // //             setRecentSearches([]);
// // // // // //             await saveRecentSearches([]);
// // // // // //           },
// // // // // //         },
// // // // // //       ]
// // // // // //     );
// // // // // //   };

// // // // // //   // Handle category click - navigates directly to search results without saving
// // // // // //   const handleCategoryClick = (category: string) => {
// // // // // //     setSearchText(category);
// // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // //       (item) =>
// // // // // //         item.cuisine.toLowerCase().includes(category.toLowerCase()) ||
// // // // // //         item.name.toLowerCase().includes(category.toLowerCase())
// // // // // //     );
// // // // // //     setSearchResults(results);
// // // // // //     setIsSearching(true);
// // // // // //   };

// // // // // //   // Handle recent search click
// // // // // //   const handleRecentSearchClick = (term: string) => {
// // // // // //     setSearchText(term);
// // // // // //     const results = ALL_RESTAURANTS.filter(
// // // // // //       (item) =>
// // // // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // // // //         item.cuisine.toLowerCase().includes(term.toLowerCase())
// // // // // //     );
// // // // // //     setSearchResults(results);
// // // // // //     setIsSearching(true);
// // // // // //   };

// // // // // //   // Navigate to Restaurant Detail (Direct navigation, no search save)
// // // // // //   const navigateToRestaurant = (restaurant: any) => {
// // // // // //     navigation.navigate('RestaurantDetail', { restaurant });
// // // // // //   };

// // // // // //   // Render search result item
// // // // // //   const renderSearchResult = ({ item }: { item: any }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={styles.resultItem}
// // // // // //       onPress={() => navigateToRestaurant(item)}
// // // // // //     >
// // // // // //       <View style={styles.resultImageContainer}>
// // // // // //         <Image source={{ uri: item.image }} style={styles.resultImage} />
// // // // // //         {item.isVeg && (
// // // // // //           <View style={styles.vegBadge}>
// // // // // //             <Text style={styles.vegBadgeText}>🟢</Text>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       </View>
// // // // // //       <View style={styles.resultInfo}>
// // // // // //         <Text style={styles.resultName}>{item.name}</Text>
// // // // // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // // // // //         <View style={styles.resultMeta}>
// // // // // //           <View style={styles.ratingBadge}>
// // // // // //             <Icon name="star" size={12} color="#ffc107" />
// // // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // //           </View>
// // // // // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // // // // //           {item.offer && (
// // // // // //             <View style={styles.offerBadge}>
// // // // // //               <Text style={styles.offerText}>{item.offer}</Text>
// // // // // //             </View>
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </View>
// // // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   // Render recent search item
// // // // // //   const renderRecentSearch = ({ item }: { item: string }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={styles.recentItem}
// // // // // //       onPress={() => handleRecentSearchClick(item)}
// // // // // //     >
// // // // // //       <View style={styles.recentItemLeft}>
// // // // // //         <Icon name="time-outline" size={20} color="#7e808c" />
// // // // // //         <Text style={styles.recentItemText}>{item}</Text>
// // // // // //       </View>
// // // // // //       <TouchableOpacity onPress={() => clearRecentSearch(item)}>
// // // // // //         <Icon name="close-circle" size={20} color="#ccc" />
// // // // // //       </TouchableOpacity>
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   // Render popular category
// // // // // //   const renderCategory = ({ item }: { item: any }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={styles.categoryChip}
// // // // // //       onPress={() => handleCategoryClick(item.name)}
// // // // // //     >
// // // // // //       <Text style={styles.categoryEmoji}>{item.icon}</Text>
// // // // // //       <Text style={styles.categoryChipText}>{item.name}</Text>
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   // Render popular restaurant item - DIRECT NAVIGATION
// // // // // //   const renderPopularRestaurant = ({ item }: { item: any }) => (
// // // // // //     <TouchableOpacity
// // // // // //       style={styles.popularItem}
// // // // // //       onPress={() => navigateToRestaurant(item)}
// // // // // //     >
// // // // // //       <View style={styles.popularItemLeft}>
// // // // // //         <Image 
// // // // // //           source={{ uri: item.image }} 
// // // // // //           style={styles.popularItemImage} 
// // // // // //         />
// // // // // //         <View style={styles.popularItemInfo}>
// // // // // //           <Text style={styles.popularItemName}>{item.name}</Text>
// // // // // //           <Text style={styles.popularItemCuisine}>{item.cuisine}</Text>
// // // // // //           <View style={styles.popularItemMeta}>
// // // // // //             <View style={styles.ratingBadge}>
// // // // // //               <Icon name="star" size={12} color="#ffc107" />
// // // // // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // // // // //             </View>
// // // // // //             <Text style={styles.popularItemTime}>• {item.deliveryTime}</Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </View>
// // // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // // //     </TouchableOpacity>
// // // // // //   );

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // // //       {/* Header with Back Button and Search */}
// // // // // //       <View style={styles.header}>
// // // // // //         <TouchableOpacity 
// // // // // //           onPress={() => navigation.goBack()} 
// // // // // //           style={styles.backButton}
// // // // // //         >
// // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // //         </TouchableOpacity>
// // // // // //         <View style={styles.searchContainer}>
// // // // // //           <Icon name="search" size={20} color="#7e808c" style={styles.searchIcon} />
// // // // // //           <TextInput
// // // // // //             style={styles.searchInput}
// // // // // //             placeholder="Search for restaurant, item or more"
// // // // // //             value={searchText}
// // // // // //             onChangeText={handleSearch}
// // // // // //             onSubmitEditing={handleSearchSubmit}
// // // // // //             autoFocus
// // // // // //             returnKeyType="search"
// // // // // //           />
// // // // // //           {searchText.length > 0 && (
// // // // // //             <TouchableOpacity onPress={clearSearch}>
// // // // // //               <Icon name="close-circle" size={20} color="#7e808c" />
// // // // // //             </TouchableOpacity>
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </View>

// // // // // //       {/* Content */}
// // // // // //       {isSearching ? (
// // // // // //         // Search Results
// // // // // //         <FlatList
// // // // // //           data={searchResults}
// // // // // //           renderItem={renderSearchResult}
// // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // //           contentContainerStyle={styles.resultsList}
// // // // // //           showsVerticalScrollIndicator={false}
// // // // // //           ListEmptyComponent={
// // // // // //             <View style={styles.emptyContainer}>
// // // // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // // // //               <Text style={styles.emptyText}>No results found</Text>
// // // // // //               <Text style={styles.emptySubText}>
// // // // // //                 Try searching for something else
// // // // // //               </Text>
// // // // // //               {searchText.length > 0 && (
// // // // // //                 <Text style={styles.emptySearchText}>
// // // // // //                   "{searchText}"
// // // // // //                 </Text>
// // // // // //               )}
// // // // // //             </View>
// // // // // //           }
// // // // // //           ListHeaderComponent={
// // // // // //             searchResults.length > 0 ? (
// // // // // //               <Text style={styles.resultsCount}>
// // // // // //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// // // // // //               </Text>
// // // // // //             ) : null
// // // // // //           }
// // // // // //         />
// // // // // //       ) : (
// // // // // //         // Default View with Popular Categories and Restaurants
// // // // // //         <FlatList
// // // // // //           data={ALL_RESTAURANTS}
// // // // // //           renderItem={renderPopularRestaurant}
// // // // // //           keyExtractor={(item) => item.id.toString()}
// // // // // //           contentContainerStyle={styles.content}
// // // // // //           showsVerticalScrollIndicator={false}
// // // // // //           ListHeaderComponent={
// // // // // //             <View>
// // // // // //               {/* Popular Categories */}
// // // // // //               <View style={styles.section}>
// // // // // //                 <Text style={styles.sectionTitle}>Popular Categories</Text>
// // // // // //                 <FlatList
// // // // // //                   data={POPULAR_CATEGORIES}
// // // // // //                   renderItem={renderCategory}
// // // // // //                   keyExtractor={(item) => item.id.toString()}
// // // // // //                   horizontal
// // // // // //                   showsHorizontalScrollIndicator={false}
// // // // // //                   contentContainerStyle={styles.categoriesList}
// // // // // //                 />
// // // // // //               </View>

// // // // // //               {/* Recent Searches */}
// // // // // //               {recentSearches.length > 0 && (
// // // // // //                 <View style={styles.section}>
// // // // // //                   <View style={styles.sectionHeader}>
// // // // // //                     <Text style={styles.sectionTitle}>Recent Searches</Text>
// // // // // //                     <TouchableOpacity onPress={clearAllRecentSearches}>
// // // // // //                       <Text style={styles.clearAllText}>Clear All</Text>
// // // // // //                     </TouchableOpacity>
// // // // // //                   </View>
// // // // // //                   <FlatList
// // // // // //                     data={recentSearches}
// // // // // //                     renderItem={renderRecentSearch}
// // // // // //                     keyExtractor={(item, index) => index.toString()}
// // // // // //                     showsVerticalScrollIndicator={false}
// // // // // //                   />
// // // // // //                 </View>
// // // // // //               )}

// // // // // //               {/* Popular Restaurants Section */}
// // // // // //               <View style={styles.section}>
// // // // // //                 <Text style={styles.sectionTitle}>Popular Restaurants</Text>
// // // // // //               </View>
// // // // // //             </View>
// // // // // //           }
// // // // // //           ListFooterComponent={
// // // // // //             <View style={styles.footer}>
// // // // // //               <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // // // // //               <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
// // // // // //             </View>
// // // // // //           }
// // // // // //         />
// // // // // //       )}
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
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   backButton: {
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   searchContainer: {
// // // // // //     flex: 1,
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //     borderRadius: 12,
// // // // // //     paddingHorizontal: 12,
// // // // // //     height: 44,
// // // // // //   },
// // // // // //   searchIcon: {
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   searchInput: {
// // // // // //     flex: 1,
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //     padding: 0,
// // // // // //   },
// // // // // //   content: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingBottom: 20,
// // // // // //   },
// // // // // //   section: {
// // // // // //     marginTop: 20,
// // // // // //   },
// // // // // //   sectionTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   sectionHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   clearAllText: {
// // // // // //     fontSize: 13,
// // // // // //     color: '#fc8019',
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   categoriesList: {
// // // // // //     paddingVertical: 4,
// // // // // //   },
// // // // // //   categoryChip: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 10,
// // // // // //     borderRadius: 20,
// // // // // //     marginRight: 10,
// // // // // //   },
// // // // // //   categoryEmoji: {
// // // // // //     fontSize: 16,
// // // // // //     marginRight: 4,
// // // // // //   },
// // // // // //   categoryChipText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   recentItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 14,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   recentItemLeft: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   recentItemText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   resultsList: {
// // // // // //     padding: 16,
// // // // // //     paddingBottom: 20,
// // // // // //   },
// // // // // //   resultsCount: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   resultItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 16,
// // // // // //     padding: 12,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 12,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#f0f0f5',
// // // // // //   },
// // // // // //   resultImageContainer: {
// // // // // //     position: 'relative',
// // // // // //   },
// // // // // //   resultImage: {
// // // // // //     width: 60,
// // // // // //     height: 60,
// // // // // //     borderRadius: 8,
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //   },
// // // // // //   vegBadge: {
// // // // // //     position: 'absolute',
// // // // // //     top: 2,
// // // // // //     right: 2,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 10,
// // // // // //     padding: 2,
// // // // // //   },
// // // // // //   vegBadgeText: {
// // // // // //     fontSize: 10,
// // // // // //   },
// // // // // //   resultInfo: {
// // // // // //     flex: 1,
// // // // // //     marginLeft: 12,
// // // // // //   },
// // // // // //   resultName: {
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   resultCuisine: {
// // // // // //     fontSize: 13,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   resultMeta: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 4,
// // // // // //     flexWrap: 'wrap',
// // // // // //   },
// // // // // //   ratingBadge: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //     paddingHorizontal: 6,
// // // // // //     paddingVertical: 2,
// // // // // //     borderRadius: 4,
// // // // // //   },
// // // // // //   ratingText: {
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '500',
// // // // // //     marginLeft: 2,
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   resultTime: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   offerBadge: {
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     paddingHorizontal: 6,
// // // // // //     paddingVertical: 2,
// // // // // //     borderRadius: 4,
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   offerText: {
// // // // // //     fontSize: 9,
// // // // // //     color: '#ffffff',
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   popularItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   popularItemLeft: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   popularItemImage: {
// // // // // //     width: 50,
// // // // // //     height: 50,
// // // // // //     borderRadius: 8,
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   popularItemInfo: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   popularItemName: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   popularItemCuisine: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   popularItemMeta: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   popularItemTime: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   emptyContainer: {
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     paddingVertical: 60,
// // // // // //   },
// // // // // //   emptyText: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   emptySubText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   emptySearchText: {
// // // // // //     fontSize: 16,
// // // // // //     color: '#fc8019',
// // // // // //     fontWeight: '500',
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   footer: {
// // // // // //     paddingVertical: 30,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   footerText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#93959f',
// // // // // //   },
// // // // // //   footerSub: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#c0c0c0',
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // // });

// // // // // // export default SearchScreen;
// // // // // import React, { useState, useEffect } from 'react';
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
// // // // // } from 'react-native';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // // Dummy data for restaurants
// // // // // const ALL_RESTAURANTS = [
// // // // //   {
// // // // //     id: 1,
// // // // //     name: 'Pizza Hut',
// // // // //     rating: 4.0,
// // // // //     deliveryTime: '30-35 mins',
// // // // //     cuisine: 'Pizzas',
// // // // //     offer: '50% OFF UPTO ₹100',
// // // // //     image: 'https://via.placeholder.com/150',
// // // // //     isVeg: false,
// // // // //   },
// // // // //   {
// // // // //     id: 2,
// // // // //     name: 'Chinese Wok',
// // // // //     rating: 4.1,
// // // // //     deliveryTime: '25-30 mins',
// // // // //     cuisine: 'Chinese, Asian',
// // // // //     offer: '50% OFF UPTO ₹100',
// // // // //     image: 'https://via.placeholder.com/150',
// // // // //     isVeg: true,
// // // // //   },
// // // // //   {
// // // // //     id: 3,
// // // // //     name: 'UBQ by Barbeque Nation',
// // // // //     rating: 3.9,
// // // // //     deliveryTime: '30-35 mins',
// // // // //     cuisine: 'Barbeque, Biryani',
// // // // //     offer: '50% OFF UPTO ₹100',
// // // // //     image: 'https://via.placeholder.com/150',
// // // // //     isVeg: false,
// // // // //   },
// // // // //   {
// // // // //     id: 4,
// // // // //     name: 'Barbeque Nation',
// // // // //     rating: 3.9,
// // // // //     deliveryTime: '35-40 mins',
// // // // //     cuisine: 'Barbeque, Biryani, Kebabs',
// // // // //     offer: '50% OFF UPTO ₹100',
// // // // //     image: 'https://via.placeholder.com/150',
// // // // //     isVeg: false,
// // // // //   },
// // // // //   {
// // // // //     id: 5,
// // // // //     name: 'McDonalds',
// // // // //     rating: 4.2,
// // // // //     deliveryTime: '20-25 mins',
// // // // //     cuisine: 'Burgers, Fast Food',
// // // // //     offer: '50% OFF UPTO ₹100',
// // // // //     image: 'https://via.placeholder.com/150',
// // // // //     isVeg: false,
// // // // //   },
// // // // // ];

// // // // // const POPULAR_CATEGORIES = [
// // // // //   { id: 1, name: 'Pizza', icon: '🍕' },
// // // // //   { id: 2, name: 'Biryani', icon: '🍚' },
// // // // //   { id: 3, name: 'Burger', icon: '🍔' },
// // // // //   { id: 4, name: 'Dosa', icon: '🥞' },
// // // // //   { id: 5, name: 'North Indian', icon: '🍛' },
// // // // //   { id: 6, name: 'Chinese', icon: '🥢' },
// // // // // ];

// // // // // interface SearchScreenProps {
// // // // //   navigation: any;
// // // // // }

// // // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// // // // //   const [searchText, setSearchText] = useState<string>('');
// // // // //   const [searchResults, setSearchResults] = useState<any[]>([]);
// // // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // // //   const [isSearching, setIsSearching] = useState<boolean>(false);

// // // // //   // Load recent searches on mount
// // // // //   useEffect(() => {
// // // // //     loadRecentSearches();
// // // // //   }, []);

// // // // //   // Load recent searches from AsyncStorage
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

// // // // //   // Save recent searches to AsyncStorage
// // // // //   const saveRecentSearches = async (searches: string[]) => {
// // // // //     try {
// // // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // // //     } catch (error) {
// // // // //       console.error('Failed to save recent searches:', error);
// // // // //     }
// // // // //   };

// // // // //   // Handle search
// // // // //   const handleSearch = (text: string) => {
// // // // //     setSearchText(text);
// // // // //     setIsSearching(text.length > 0);

// // // // //     if (text.trim()) {
// // // // //       const results = ALL_RESTAURANTS.filter(
// // // // //         (item) =>
// // // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // // // //       );
// // // // //       setSearchResults(results);
// // // // //     } else {
// // // // //       setSearchResults([]);
// // // // //     }
// // // // //   };

// // // // //   // Save search to recent (only for actual searches, not category clicks)
// // // // //   const saveSearch = (term: string) => {
// // // // //     if (!term.trim()) return;
    
// // // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // // //     if (updatedSearches.length > 10) {
// // // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // // //     }
// // // // //     setRecentSearches(updatedSearches);
// // // // //     saveRecentSearches(updatedSearches);
// // // // //   };

// // // // //   // Handle search submit
// // // // //   const handleSearchSubmit = () => {
// // // // //     if (searchText.trim()) {
// // // // //       saveSearch(searchText.trim());
// // // // //       setIsSearching(true);
// // // // //     }
// // // // //   };

// // // // //   // Clear search
// // // // //   const clearSearch = () => {
// // // // //     setSearchText('');
// // // // //     setSearchResults([]);
// // // // //     setIsSearching(false);
// // // // //   };

// // // // //   // Clear a single recent search
// // // // //   const clearRecentSearch = async (term: string) => {
// // // // //     const updated = recentSearches.filter(s => s !== term);
// // // // //     setRecentSearches(updated);
// // // // //     await saveRecentSearches(updated);
// // // // //   };

// // // // //   // Clear all recent searches
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

// // // // //   // Handle category click - navigates directly to search results without saving
// // // // //   const handleCategoryClick = (category: string) => {
// // // // //     setSearchText(category);
// // // // //     const results = ALL_RESTAURANTS.filter(
// // // // //       (item) =>
// // // // //         item.cuisine.toLowerCase().includes(category.toLowerCase()) ||
// // // // //         item.name.toLowerCase().includes(category.toLowerCase())
// // // // //     );
// // // // //     setSearchResults(results);
// // // // //     setIsSearching(true);
// // // // //   };

// // // // //   // Handle recent search click
// // // // //   const handleRecentSearchClick = (term: string) => {
// // // // //     setSearchText(term);
// // // // //     const results = ALL_RESTAURANTS.filter(
// // // // //       (item) =>
// // // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // // //         item.cuisine.toLowerCase().includes(term.toLowerCase())
// // // // //     );
// // // // //     setSearchResults(results);
// // // // //     setIsSearching(true);
// // // // //   };

// // // // //   // Navigate to Restaurant Detail - MAKES THE CARD CLICKABLE
// // // // //   const navigateToRestaurant = (restaurant: any) => {
// // // // //     navigation.navigate('RestaurantDetail', { restaurant });
// // // // //   };

// // // // //   // Render search result item
// // // // //   const renderSearchResult = ({ item }: { item: any }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.resultItem}
// // // // //       onPress={() => navigateToRestaurant(item)}
// // // // //     >
// // // // //       <View style={styles.resultImageContainer}>
// // // // //         <Image source={{ uri: item.image }} style={styles.resultImage} />
// // // // //         {item.isVeg && (
// // // // //           <View style={styles.vegBadge}>
// // // // //             <Text style={styles.vegBadgeText}>🟢</Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </View>
// // // // //       <View style={styles.resultInfo}>
// // // // //         <Text style={styles.resultName}>{item.name}</Text>
// // // // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // // // //         <View style={styles.resultMeta}>
// // // // //           <View style={styles.ratingBadge}>
// // // // //             <Icon name="star" size={12} color="#ffc107" />
// // // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // // //           </View>
// // // // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // // // //           {item.offer && (
// // // // //             <View style={styles.offerBadge}>
// // // // //               <Text style={styles.offerText}>{item.offer}</Text>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>
// // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   // Render recent search item
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

// // // // //   // Render popular category
// // // // //   const renderCategory = ({ item }: { item: any }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.categoryChip}
// // // // //       onPress={() => handleCategoryClick(item.name)}
// // // // //     >
// // // // //       <Text style={styles.categoryEmoji}>{item.icon}</Text>
// // // // //       <Text style={styles.categoryChipText}>{item.name}</Text>
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   // Render popular restaurant item - CLICKABLE CARD
// // // // //   const renderPopularRestaurant = ({ item }: { item: any }) => (
// // // // //     <TouchableOpacity
// // // // //       style={styles.popularItem}
// // // // //       onPress={() => navigateToRestaurant(item)}
// // // // //       activeOpacity={0.7}
// // // // //     >
// // // // //       <View style={styles.popularItemLeft}>
// // // // //         <Image 
// // // // //           source={{ uri: item.image }} 
// // // // //           style={styles.popularItemImage} 
// // // // //         />
// // // // //         <View style={styles.popularItemInfo}>
// // // // //           <Text style={styles.popularItemName}>{item.name}</Text>
// // // // //           <Text style={styles.popularItemCuisine}>{item.cuisine}</Text>
// // // // //           <View style={styles.popularItemMeta}>
// // // // //             <View style={styles.ratingBadge}>
// // // // //               <Icon name="star" size={12} color="#ffc107" />
// // // // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // // // //             </View>
// // // // //             <Text style={styles.popularItemTime}>• {item.deliveryTime}</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       </View>
// // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // // //       {/* Header with Back Button and Search */}
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
// // // // //             placeholder="Search for restaurant, item or more"
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

// // // // //       {/* Content */}
// // // // //       {isSearching ? (
// // // // //         // Search Results
// // // // //         <FlatList
// // // // //           data={searchResults}
// // // // //           renderItem={renderSearchResult}
// // // // //           keyExtractor={(item) => item.id.toString()}
// // // // //           contentContainerStyle={styles.resultsList}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //           ListEmptyComponent={
// // // // //             <View style={styles.emptyContainer}>
// // // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // // //               <Text style={styles.emptyText}>No results found</Text>
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
// // // // //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// // // // //               </Text>
// // // // //             ) : null
// // // // //           }
// // // // //         />
// // // // //       ) : (
// // // // //         // Default View with Popular Categories and Restaurants
// // // // //         <FlatList
// // // // //           data={ALL_RESTAURANTS}
// // // // //           renderItem={renderPopularRestaurant}
// // // // //           keyExtractor={(item) => item.id.toString()}
// // // // //           contentContainerStyle={styles.content}
// // // // //           showsVerticalScrollIndicator={false}
// // // // //           ListHeaderComponent={
// // // // //             <View>
// // // // //               {/* Popular Categories */}
// // // // //               <View style={styles.section}>
// // // // //                 <Text style={styles.sectionTitle}>Popular Categories</Text>
// // // // //                 <FlatList
// // // // //                   data={POPULAR_CATEGORIES}
// // // // //                   renderItem={renderCategory}
// // // // //                   keyExtractor={(item) => item.id.toString()}
// // // // //                   horizontal
// // // // //                   showsHorizontalScrollIndicator={false}
// // // // //                   contentContainerStyle={styles.categoriesList}
// // // // //                 />
// // // // //               </View>

// // // // //               {/* Recent Searches */}
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

// // // // //               {/* Popular Restaurants Section */}
// // // // //               <View style={styles.section}>
// // // // //                 <Text style={styles.sectionTitle}>Popular Restaurants</Text>
// // // // //               </View>
// // // // //             </View>
// // // // //           }
// // // // //           ListFooterComponent={
// // // // //             <View style={styles.footer}>
// // // // //               <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // // // //               <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
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
// // // // //   vegBadge: {
// // // // //     position: 'absolute',
// // // // //     top: 2,
// // // // //     right: 2,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 10,
// // // // //     padding: 2,
// // // // //   },
// // // // //   vegBadgeText: {
// // // // //     fontSize: 10,
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
// // // // //   resultCuisine: {
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
// // // // //   ratingBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     paddingHorizontal: 6,
// // // // //     paddingVertical: 2,
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   ratingText: {
// // // // //     fontSize: 12,
// // // // //     fontWeight: '500',
// // // // //     marginLeft: 2,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   resultTime: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   offerBadge: {
// // // // //     backgroundColor: '#fc8019',
// // // // //     paddingHorizontal: 6,
// // // // //     paddingVertical: 2,
// // // // //     borderRadius: 4,
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   offerText: {
// // // // //     fontSize: 9,
// // // // //     color: '#ffffff',
// // // // //     fontWeight: '600',
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
// // // // //   popularItemCuisine: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   popularItemMeta: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   popularItemTime: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
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
// // // // import React, { useState, useEffect } from 'react';
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
// // // // } from 'react-native';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // // Dummy data for restaurants
// // // // const ALL_RESTAURANTS = [
// // // //   {
// // // //     id: 1,
// // // //     name: 'Pizza Hut',
// // // //     rating: 4.0,
// // // //     deliveryTime: '30-35 mins',
// // // //     cuisine: 'Pizzas',
// // // //     offer: '50% OFF UPTO ₹100',
// // // //     image: 'https://via.placeholder.com/150',
// // // //     isVeg: false,
// // // //   },
// // // //   {
// // // //     id: 2,
// // // //     name: 'Chinese Wok',
// // // //     rating: 4.1,
// // // //     deliveryTime: '25-30 mins',
// // // //     cuisine: 'Chinese, Asian',
// // // //     offer: '50% OFF UPTO ₹100',
// // // //     image: 'https://via.placeholder.com/150',
// // // //     isVeg: true,
// // // //   },
// // // //   {
// // // //     id: 3,
// // // //     name: 'UBQ by Barbeque Nation',
// // // //     rating: 3.9,
// // // //     deliveryTime: '30-35 mins',
// // // //     cuisine: 'Barbeque, Biryani',
// // // //     offer: '50% OFF UPTO ₹100',
// // // //     image: 'https://via.placeholder.com/150',
// // // //     isVeg: false,
// // // //   },
// // // //   {
// // // //     id: 4,
// // // //     name: 'Barbeque Nation',
// // // //     rating: 3.9,
// // // //     deliveryTime: '35-40 mins',
// // // //     cuisine: 'Barbeque, Biryani, Kebabs',
// // // //     offer: '50% OFF UPTO ₹100',
// // // //     image: 'https://via.placeholder.com/150',
// // // //     isVeg: false,
// // // //   },
// // // //   {
// // // //     id: 5,
// // // //     name: 'McDonalds',
// // // //     rating: 4.2,
// // // //     deliveryTime: '20-25 mins',
// // // //     cuisine: 'Burgers, Fast Food',
// // // //     offer: '50% OFF UPTO ₹100',
// // // //     image: 'https://via.placeholder.com/150',
// // // //     isVeg: false,
// // // //   },
// // // // ];

// // // // const POPULAR_CATEGORIES = [
// // // //   { id: 1, name: 'Pizza', icon: '🍕' },
// // // //   { id: 2, name: 'Biryani', icon: '🍚' },
// // // //   { id: 3, name: 'Burger', icon: '🍔' },
// // // //   { id: 4, name: 'Dosa', icon: '🥞' },
// // // //   { id: 5, name: 'North Indian', icon: '🍛' },
// // // //   { id: 6, name: 'Chinese', icon: '🥢' },
// // // // ];

// // // // interface SearchScreenProps {
// // // //   navigation: any;
// // // // }

// // // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// // // //   const [searchText, setSearchText] = useState<string>('');
// // // //   const [searchResults, setSearchResults] = useState<any[]>([]);
// // // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // // //   const [isSearching, setIsSearching] = useState<boolean>(false);

// // // //   // Load recent searches on mount
// // // //   useEffect(() => {
// // // //     loadRecentSearches();
// // // //   }, []);

// // // //   // Load recent searches from AsyncStorage
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

// // // //   // Save recent searches to AsyncStorage
// // // //   const saveRecentSearches = async (searches: string[]) => {
// // // //     try {
// // // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // // //     } catch (error) {
// // // //       console.error('Failed to save recent searches:', error);
// // // //     }
// // // //   };

// // // //   // Handle search
// // // //   const handleSearch = (text: string) => {
// // // //     setSearchText(text);
// // // //     setIsSearching(text.length > 0);

// // // //     if (text.trim()) {
// // // //       const results = ALL_RESTAURANTS.filter(
// // // //         (item) =>
// // // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // // //       );
// // // //       setSearchResults(results);
// // // //     } else {
// // // //       setSearchResults([]);
// // // //     }
// // // //   };

// // // //   // Save search to recent
// // // //   const saveSearch = (term: string) => {
// // // //     if (!term.trim()) return;
    
// // // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // // //     if (updatedSearches.length > 10) {
// // // //       updatedSearches = updatedSearches.slice(0, 10);
// // // //     }
// // // //     setRecentSearches(updatedSearches);
// // // //     saveRecentSearches(updatedSearches);
// // // //   };

// // // //   // Handle search submit
// // // //   const handleSearchSubmit = () => {
// // // //     if (searchText.trim()) {
// // // //       saveSearch(searchText.trim());
// // // //       setIsSearching(true);
// // // //     }
// // // //   };

// // // //   // Clear search
// // // //   const clearSearch = () => {
// // // //     setSearchText('');
// // // //     setSearchResults([]);
// // // //     setIsSearching(false);
// // // //   };

// // // //   // Clear a single recent search
// // // //   const clearRecentSearch = async (term: string) => {
// // // //     const updated = recentSearches.filter(s => s !== term);
// // // //     setRecentSearches(updated);
// // // //     await saveRecentSearches(updated);
// // // //   };

// // // //   // Clear all recent searches
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

// // // //   // Handle category click
// // // //   const handleCategoryClick = (category: string) => {
// // // //     setSearchText(category);
// // // //     const results = ALL_RESTAURANTS.filter(
// // // //       (item) =>
// // // //         item.cuisine.toLowerCase().includes(category.toLowerCase()) ||
// // // //         item.name.toLowerCase().includes(category.toLowerCase())
// // // //     );
// // // //     setSearchResults(results);
// // // //     setIsSearching(true);
// // // //   };

// // // //   // Handle recent search click
// // // //   const handleRecentSearchClick = (term: string) => {
// // // //     setSearchText(term);
// // // //     const results = ALL_RESTAURANTS.filter(
// // // //       (item) =>
// // // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // // //         item.cuisine.toLowerCase().includes(term.toLowerCase())
// // // //     );
// // // //     setSearchResults(results);
// // // //     setIsSearching(true);
// // // //   };

// // // //   // Navigate to Restaurant Detail - FIXED
// // // //   const navigateToRestaurant = (restaurant: any) => {
// // // //     // This navigates to RestaurantDetail in the parent stack navigator
// // // //     // navigation.navigate('RestaurantDetail', { restaurant });
// // // //       navigation.getParent()?.navigate('RestaurantDetail', { restaurant });

// // // //   };

// // // //   // Render search result item
// // // //   const renderSearchResult = ({ item }: { item: any }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.resultItem}
// // // //       onPress={() => navigateToRestaurant(item)}
// // // //     >
// // // //       <View style={styles.resultImageContainer}>
// // // //         <Image source={{ uri: item.image }} style={styles.resultImage} />
// // // //         {item.isVeg && (
// // // //           <View style={styles.vegBadge}>
// // // //             <Text style={styles.vegBadgeText}>🟢</Text>
// // // //           </View>
// // // //         )}
// // // //       </View>
// // // //       <View style={styles.resultInfo}>
// // // //         <Text style={styles.resultName}>{item.name}</Text>
// // // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // // //         <View style={styles.resultMeta}>
// // // //           <View style={styles.ratingBadge}>
// // // //             <Icon name="star" size={12} color="#ffc107" />
// // // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // // //           </View>
// // // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // // //           {item.offer && (
// // // //             <View style={styles.offerBadge}>
// // // //               <Text style={styles.offerText}>{item.offer}</Text>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // //     </TouchableOpacity>
// // // //   );

// // // //   // Render recent search item
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

// // // //   // Render popular category
// // // //   const renderCategory = ({ item }: { item: any }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.categoryChip}
// // // //       onPress={() => handleCategoryClick(item.name)}
// // // //     >
// // // //       <Text style={styles.categoryEmoji}>{item.icon}</Text>
// // // //       <Text style={styles.categoryChipText}>{item.name}</Text>
// // // //     </TouchableOpacity>
// // // //   );

// // // //   // Render popular restaurant item
// // // //   const renderPopularRestaurant = ({ item }: { item: any }) => (
// // // //     <TouchableOpacity
// // // //       style={styles.popularItem}
// // // //       onPress={() => navigateToRestaurant(item)}
// // // //     >
// // // //       <View style={styles.popularItemLeft}>
// // // //         <Image 
// // // //           source={{ uri: item.image }} 
// // // //           style={styles.popularItemImage} 
// // // //         />
// // // //         <View style={styles.popularItemInfo}>
// // // //           <Text style={styles.popularItemName}>{item.name}</Text>
// // // //           <Text style={styles.popularItemCuisine}>{item.cuisine}</Text>
// // // //           <View style={styles.popularItemMeta}>
// // // //             <View style={styles.ratingBadge}>
// // // //               <Icon name="star" size={12} color="#ffc107" />
// // // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // // //             </View>
// // // //             <Text style={styles.popularItemTime}>• {item.deliveryTime}</Text>
// // // //           </View>
// // // //         </View>
// // // //       </View>
// // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // //     </TouchableOpacity>
// // // //   );

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // //       {/* Header with Back Button and Search */}
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
// // // //             placeholder="Search for restaurant, item or more"
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

// // // //       {/* Content */}
// // // //       {isSearching ? (
// // // //         // Search Results
// // // //         <FlatList
// // // //           data={searchResults}
// // // //           renderItem={renderSearchResult}
// // // //           keyExtractor={(item) => item.id.toString()}
// // // //           contentContainerStyle={styles.resultsList}
// // // //           showsVerticalScrollIndicator={false}
// // // //           ListEmptyComponent={
// // // //             <View style={styles.emptyContainer}>
// // // //               <Icon name="search-outline" size={60} color="#ccc" />
// // // //               <Text style={styles.emptyText}>No results found</Text>
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
// // // //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// // // //               </Text>
// // // //             ) : null
// // // //           }
// // // //         />
// // // //       ) : (
// // // //         // Default View with Popular Categories and Restaurants
// // // //         <FlatList
// // // //           data={ALL_RESTAURANTS}
// // // //           renderItem={renderPopularRestaurant}
// // // //           keyExtractor={(item) => item.id.toString()}
// // // //           contentContainerStyle={styles.content}
// // // //           showsVerticalScrollIndicator={false}
// // // //           ListHeaderComponent={
// // // //             <View>
// // // //               {/* Popular Categories */}
// // // //               <View style={styles.section}>
// // // //                 <Text style={styles.sectionTitle}>Popular Categories</Text>
// // // //                 <FlatList
// // // //                   data={POPULAR_CATEGORIES}
// // // //                   renderItem={renderCategory}
// // // //                   keyExtractor={(item) => item.id.toString()}
// // // //                   horizontal
// // // //                   showsHorizontalScrollIndicator={false}
// // // //                   contentContainerStyle={styles.categoriesList}
// // // //                 />
// // // //               </View>

// // // //               {/* Recent Searches */}
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

// // // //               {/* Popular Restaurants Section */}
// // // //               <View style={styles.section}>
// // // //                 <Text style={styles.sectionTitle}>Popular Restaurants</Text>
// // // //               </View>
// // // //             </View>
// // // //           }
// // // //           ListFooterComponent={
// // // //             <View style={styles.footer}>
// // // //               <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // // //               <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
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
// // // //   categoriesList: {
// // // //     paddingVertical: 4,
// // // //   },
// // // //   categoryChip: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#f0f0f5',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 20,
// // // //     marginRight: 10,
// // // //   },
// // // //   categoryEmoji: {
// // // //     fontSize: 16,
// // // //     marginRight: 4,
// // // //   },
// // // //   categoryChipText: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
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
// // // //   vegBadge: {
// // // //     position: 'absolute',
// // // //     top: 2,
// // // //     right: 2,
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 10,
// // // //     padding: 2,
// // // //   },
// // // //   vegBadgeText: {
// // // //     fontSize: 10,
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
// // // //   resultCuisine: {
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
// // // //   ratingBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#f0f0f5',
// // // //     paddingHorizontal: 6,
// // // //     paddingVertical: 2,
// // // //     borderRadius: 4,
// // // //   },
// // // //   ratingText: {
// // // //     fontSize: 12,
// // // //     fontWeight: '500',
// // // //     marginLeft: 2,
// // // //     color: '#282c3f',
// // // //   },
// // // //   resultTime: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginLeft: 8,
// // // //   },
// // // //   offerBadge: {
// // // //     backgroundColor: '#fc8019',
// // // //     paddingHorizontal: 6,
// // // //     paddingVertical: 2,
// // // //     borderRadius: 4,
// // // //     marginLeft: 8,
// // // //   },
// // // //   offerText: {
// // // //     fontSize: 9,
// // // //     color: '#ffffff',
// // // //     fontWeight: '600',
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
// // // //   popularItemCuisine: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   popularItemMeta: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 4,
// // // //   },
// // // //   popularItemTime: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
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
// // // import React, { useState, useEffect } from 'react';
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
// // // } from 'react-native';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import Icon from 'react-native-vector-icons/Ionicons';

// // // // Dummy data for restaurants
// // // const ALL_RESTAURANTS = [
// // //   {
// // //     id: 1,
// // //     name: 'Pizza Hut',
// // //     rating: 4.0,
// // //     deliveryTime: '30-35 mins',
// // //     cuisine: 'Pizzas',
// // //     offer: '50% OFF UPTO ₹100',
// // //     image: 'https://via.placeholder.com/150',
// // //     isVeg: false,
// // //   },
// // //   {
// // //     id: 2,
// // //     name: 'Chinese Wok',
// // //     rating: 4.1,
// // //     deliveryTime: '25-30 mins',
// // //     cuisine: 'Chinese, Asian',
// // //     offer: '50% OFF UPTO ₹100',
// // //     image: 'https://via.placeholder.com/150',
// // //     isVeg: true,
// // //   },
// // //   {
// // //     id: 3,
// // //     name: 'UBQ by Barbeque Nation',
// // //     rating: 3.9,
// // //     deliveryTime: '30-35 mins',
// // //     cuisine: 'Barbeque, Biryani',
// // //     offer: '50% OFF UPTO ₹100',
// // //     image: 'https://via.placeholder.com/150',
// // //     isVeg: false,
// // //   },
// // //   {
// // //     id: 4,
// // //     name: 'Barbeque Nation',
// // //     rating: 3.9,
// // //     deliveryTime: '35-40 mins',
// // //     cuisine: 'Barbeque, Biryani, Kebabs',
// // //     offer: '50% OFF UPTO ₹100',
// // //     image: 'https://via.placeholder.com/150',
// // //     isVeg: false,
// // //   },
// // //   {
// // //     id: 5,
// // //     name: 'McDonalds',
// // //     rating: 4.2,
// // //     deliveryTime: '20-25 mins',
// // //     cuisine: 'Burgers, Fast Food',
// // //     offer: '50% OFF UPTO ₹100',
// // //     image: 'https://via.placeholder.com/150',
// // //     isVeg: false,
// // //   },
// // // ];

// // // const POPULAR_CATEGORIES = [
// // //   { id: 1, name: 'Pizza', icon: '🍕' },
// // //   { id: 2, name: 'Biryani', icon: '🍚' },
// // //   { id: 3, name: 'Burger', icon: '🍔' },
// // //   { id: 4, name: 'Dosa', icon: '🥞' },
// // //   { id: 5, name: 'North Indian', icon: '🍛' },
// // //   { id: 6, name: 'Chinese', icon: '🥢' },
// // // ];

// // // interface SearchScreenProps {
// // //   navigation: any;
// // // }

// // // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// // //   const [searchText, setSearchText] = useState<string>('');
// // //   const [searchResults, setSearchResults] = useState<any[]>([]);
// // //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// // //   const [isSearching, setIsSearching] = useState<boolean>(false);

// // //   // Load recent searches on mount
// // //   useEffect(() => {
// // //     loadRecentSearches();
// // //   }, []);

// // //   // Load recent searches from AsyncStorage
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

// // //   // Save recent searches to AsyncStorage
// // //   const saveRecentSearches = async (searches: string[]) => {
// // //     try {
// // //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// // //     } catch (error) {
// // //       console.error('Failed to save recent searches:', error);
// // //     }
// // //   };

// // //   // Handle search
// // //   const handleSearch = (text: string) => {
// // //     setSearchText(text);
// // //     setIsSearching(text.length > 0);

// // //     if (text.trim()) {
// // //       const results = ALL_RESTAURANTS.filter(
// // //         (item) =>
// // //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// // //           item.cuisine.toLowerCase().includes(text.toLowerCase())
// // //       );
// // //       setSearchResults(results);
// // //     } else {
// // //       setSearchResults([]);
// // //     }
// // //   };

// // //   // Save search to recent
// // //   const saveSearch = (term: string) => {
// // //     if (!term.trim()) return;
    
// // //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// // //     if (updatedSearches.length > 10) {
// // //       updatedSearches = updatedSearches.slice(0, 10);
// // //     }
// // //     setRecentSearches(updatedSearches);
// // //     saveRecentSearches(updatedSearches);
// // //   };

// // //   // Handle search submit
// // //   const handleSearchSubmit = () => {
// // //     if (searchText.trim()) {
// // //       saveSearch(searchText.trim());
// // //       setIsSearching(true);
// // //     }
// // //   };

// // //   // Clear search
// // //   const clearSearch = () => {
// // //     setSearchText('');
// // //     setSearchResults([]);
// // //     setIsSearching(false);
// // //   };

// // //   // Clear a single recent search
// // //   const clearRecentSearch = async (term: string) => {
// // //     const updated = recentSearches.filter(s => s !== term);
// // //     setRecentSearches(updated);
// // //     await saveRecentSearches(updated);
// // //   };

// // //   // Clear all recent searches
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

// // //   // Handle category click
// // //   const handleCategoryClick = (category: string) => {
// // //     setSearchText(category);
// // //     const results = ALL_RESTAURANTS.filter(
// // //       (item) =>
// // //         item.cuisine.toLowerCase().includes(category.toLowerCase()) ||
// // //         item.name.toLowerCase().includes(category.toLowerCase())
// // //     );
// // //     setSearchResults(results);
// // //     setIsSearching(true);
// // //   };

// // //   // Handle recent search click
// // //   const handleRecentSearchClick = (term: string) => {
// // //     setSearchText(term);
// // //     const results = ALL_RESTAURANTS.filter(
// // //       (item) =>
// // //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// // //         item.cuisine.toLowerCase().includes(term.toLowerCase())
// // //     );
// // //     setSearchResults(results);
// // //     setIsSearching(true);
// // //   };

// // //   // ⭐ FIXED: Navigate to Restaurant Detail using getParent()
// // //   const navigateToRestaurant = (restaurant: any) => {
// // //     // Get the parent navigator (AppNavigator) and navigate from there
// // //     navigation.getParent()?.navigate('RestaurantDetail', { restaurant });
// // //   };

// // //   // Render search result item
// // //   const renderSearchResult = ({ item }: { item: any }) => (
// // //     <TouchableOpacity
// // //       style={styles.resultItem}
// // //       onPress={() => navigateToRestaurant(item)}
// // //     >
// // //       <View style={styles.resultImageContainer}>
// // //         <Image source={{ uri: item.image }} style={styles.resultImage} />
// // //         {item.isVeg && (
// // //           <View style={styles.vegBadge}>
// // //             <Text style={styles.vegBadgeText}>🟢</Text>
// // //           </View>
// // //         )}
// // //       </View>
// // //       <View style={styles.resultInfo}>
// // //         <Text style={styles.resultName}>{item.name}</Text>
// // //         <Text style={styles.resultCuisine}>{item.cuisine}</Text>
// // //         <View style={styles.resultMeta}>
// // //           <View style={styles.ratingBadge}>
// // //             <Icon name="star" size={12} color="#ffc107" />
// // //             <Text style={styles.ratingText}>{item.rating}</Text>
// // //           </View>
// // //           <Text style={styles.resultTime}>• {item.deliveryTime}</Text>
// // //           {item.offer && (
// // //             <View style={styles.offerBadge}>
// // //               <Text style={styles.offerText}>{item.offer}</Text>
// // //             </View>
// // //           )}
// // //         </View>
// // //       </View>
// // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // //     </TouchableOpacity>
// // //   );

// // //   // Render recent search item
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

// // //   // Render popular category
// // //   const renderCategory = ({ item }: { item: any }) => (
// // //     <TouchableOpacity
// // //       style={styles.categoryChip}
// // //       onPress={() => handleCategoryClick(item.name)}
// // //     >
// // //       <Text style={styles.categoryEmoji}>{item.icon}</Text>
// // //       <Text style={styles.categoryChipText}>{item.name}</Text>
// // //     </TouchableOpacity>
// // //   );

// // //   // Render popular restaurant item
// // //   const renderPopularRestaurant = ({ item }: { item: any }) => (
// // //     <TouchableOpacity
// // //       style={styles.popularItem}
// // //       onPress={() => navigateToRestaurant(item)}
// // //     >
// // //       <View style={styles.popularItemLeft}>
// // //         <Image 
// // //           source={{ uri: item.image }} 
// // //           style={styles.popularItemImage} 
// // //         />
// // //         <View style={styles.popularItemInfo}>
// // //           <Text style={styles.popularItemName}>{item.name}</Text>
// // //           <Text style={styles.popularItemCuisine}>{item.cuisine}</Text>
// // //           <View style={styles.popularItemMeta}>
// // //             <View style={styles.ratingBadge}>
// // //               <Icon name="star" size={12} color="#ffc107" />
// // //               <Text style={styles.ratingText}>{item.rating}</Text>
// // //             </View>
// // //             <Text style={styles.popularItemTime}>• {item.deliveryTime}</Text>
// // //           </View>
// // //         </View>
// // //       </View>
// // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // //     </TouchableOpacity>
// // //   );

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // //       {/* Header with Back Button and Search */}
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
// // //             placeholder="Search for restaurant, item or more"
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

// // //       {/* Content */}
// // //       {isSearching ? (
// // //         // Search Results
// // //         <FlatList
// // //           data={searchResults}
// // //           renderItem={renderSearchResult}
// // //           keyExtractor={(item) => item.id.toString()}
// // //           contentContainerStyle={styles.resultsList}
// // //           showsVerticalScrollIndicator={false}
// // //           ListEmptyComponent={
// // //             <View style={styles.emptyContainer}>
// // //               <Icon name="search-outline" size={60} color="#ccc" />
// // //               <Text style={styles.emptyText}>No results found</Text>
// // //               <Text style={styles.emptySubText}>
// // //                 Try searching for something else
// // //               </Text>
// // //               {searchText.length > 0 && (
// // //                 <Text style={styles.emptySearchText}>
// // //                   "{searchText}"
// // //                 </Text>
// // //               )}
// // //             </View>
// // //           }
// // //           ListHeaderComponent={
// // //             searchResults.length > 0 ? (
// // //               <Text style={styles.resultsCount}>
// // //                 {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
// // //               </Text>
// // //             ) : null
// // //           }
// // //         />
// // //       ) : (
// // //         // Default View with Popular Categories and Restaurants
// // //         <FlatList
// // //           data={ALL_RESTAURANTS}
// // //           renderItem={renderPopularRestaurant}
// // //           keyExtractor={(item) => item.id.toString()}
// // //           contentContainerStyle={styles.content}
// // //           showsVerticalScrollIndicator={false}
// // //           ListHeaderComponent={
// // //             <View>
// // //               {/* Popular Categories */}
// // //               <View style={styles.section}>
// // //                 <Text style={styles.sectionTitle}>Popular Categories</Text>
// // //                 <FlatList
// // //                   data={POPULAR_CATEGORIES}
// // //                   renderItem={renderCategory}
// // //                   keyExtractor={(item) => item.id.toString()}
// // //                   horizontal
// // //                   showsHorizontalScrollIndicator={false}
// // //                   contentContainerStyle={styles.categoriesList}
// // //                 />
// // //               </View>

// // //               {/* Recent Searches */}
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

// // //               {/* Popular Restaurants Section */}
// // //               <View style={styles.section}>
// // //                 <Text style={styles.sectionTitle}>Popular Restaurants</Text>
// // //               </View>
// // //             </View>
// // //           }
// // //           ListFooterComponent={
// // //             <View style={styles.footer}>
// // //               <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // //               <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
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
// // //   categoriesList: {
// // //     paddingVertical: 4,
// // //   },
// // //   categoryChip: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#f0f0f5',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     borderRadius: 20,
// // //     marginRight: 10,
// // //   },
// // //   categoryEmoji: {
// // //     fontSize: 16,
// // //     marginRight: 4,
// // //   },
// // //   categoryChipText: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
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
// // //   vegBadge: {
// // //     position: 'absolute',
// // //     top: 2,
// // //     right: 2,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 10,
// // //     padding: 2,
// // //   },
// // //   vegBadgeText: {
// // //     fontSize: 10,
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
// // //   resultCuisine: {
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
// // //   ratingBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#f0f0f5',
// // //     paddingHorizontal: 6,
// // //     paddingVertical: 2,
// // //     borderRadius: 4,
// // //   },
// // //   ratingText: {
// // //     fontSize: 12,
// // //     fontWeight: '500',
// // //     marginLeft: 2,
// // //     color: '#282c3f',
// // //   },
// // //   resultTime: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginLeft: 8,
// // //   },
// // //   offerBadge: {
// // //     backgroundColor: '#fc8019',
// // //     paddingHorizontal: 6,
// // //     paddingVertical: 2,
// // //     borderRadius: 4,
// // //     marginLeft: 8,
// // //   },
// // //   offerText: {
// // //     fontSize: 9,
// // //     color: '#ffffff',
// // //     fontWeight: '600',
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
// // //   popularItemCuisine: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   popularItemMeta: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginTop: 4,
// // //   },
// // //   popularItemTime: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
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
// // // });

// // // export default SearchScreen;
// // import React, { useState, useEffect } from 'react';
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
// // } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Icon from 'react-native-vector-icons/Ionicons';

// // // Import your API service or product data
// // // Assuming you have a products API or using the same data as HomeScreen
// // interface Product {
// //   id: string;
// //   name: string;
// //   category: string;
// //   price: number;
// //   stock: number;
// //   description?: string;
// //   image?: string;
// //   barcode?: string;
// //   sku?: string;
// //   brand?: string;
// //   vendor?: string;
// //   gst?: number;
// //   unit?: string;
// // }

// // // Popular categories based on your product categories
// // const POPULAR_CATEGORIES = [
// //   { id: 1, name: 'Groceries', icon: '🛒' },
// //   { id: 2, name: 'Electronics', icon: '💻' },
// //   { id: 3, name: 'Clothing', icon: '👕' },
// //   { id: 4, name: 'Books', icon: '📚' },
// //   { id: 5, name: 'Home & Living', icon: '🏠' },
// //   { id: 6, name: 'Beauty', icon: '💄' },
// // ];

// // interface SearchScreenProps {
// //   navigation: any;
// // }

// // // Sample product data - replace with your actual API call
// // // This should match the data you display on HomeScreen
// // const getProducts = (): Product[] => {
// //   // This would be your API call or data from your database
// //   // For now, using sample data that matches your HomeScreen
// //   return [
// //     {
// //       id: '1',
// //       name: 'Rice Bag 25kg',
// //       category: 'Groceries',
// //       price: 1050,
// //       stock: 20,
// //       description: 'Premium quality rice, 25kg bag',
// //       image: 'https://via.placeholder.com/150',
// //       unit: 'pcs',
// //     },
// //     {
// //       id: '2',
// //       name: 'Wheat Flour 10kg',
// //       category: 'Groceries',
// //       price: 420,
// //       stock: 15,
// //       description: 'Premium wheat flour, 10kg pack',
// //       image: 'https://via.placeholder.com/150',
// //       unit: 'pcs',
// //     },
// //     {
// //       id: '3',
// //       name: 'Laptop',
// //       category: 'Electronics',
// //       price: 25000,
// //       stock: 1,
// //       description: 'High performance laptop with 16GB RAM',
// //       image: 'https://via.placeholder.com/150',
// //       brand: 'Dell',
// //       unit: 'pcs',
// //     },
// //     {
// //       id: '4',
// //       name: 'AC',
// //       category: 'Electronics',
// //       price: 45000,
// //       stock: 2,
// //       description: '1.5 Ton Split AC with inverter technology',
// //       image: 'https://via.placeholder.com/150',
// //       brand: 'Voltas',
// //       unit: 'pcs',
// //     },
// //     {
// //       id: '5',
// //       name: 'Smartphone',
// //       category: 'Electronics',
// //       price: 15000,
// //       stock: 5,
// //       description: '6.5 inch display with 128GB storage',
// //       image: 'https://via.placeholder.com/150',
// //       brand: 'Samsung',
// //       unit: 'pcs',
// //     },
// //     {
// //       id: '6',
// //       name: 'Olive Oil 1L',
// //       category: 'Groceries',
// //       price: 850,
// //       stock: 10,
// //       description: 'Extra virgin olive oil, 1 liter',
// //       image: 'https://via.placeholder.com/150',
// //       unit: 'pcs',
// //     },
// //   ];
// // };

// // const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
// //   const [searchText, setSearchText] = useState<string>('');
// //   const [searchResults, setSearchResults] = useState<Product[]>([]);
// //   const [recentSearches, setRecentSearches] = useState<string[]>([]);
// //   const [isSearching, setIsSearching] = useState<boolean>(false);
// //   const [allProducts, setAllProducts] = useState<Product[]>([]);

// //   // Load products on mount
// //   useEffect(() => {
// //     loadProducts();
// //     loadRecentSearches();
// //   }, []);

// //   // Load products from your data source
// //   const loadProducts = () => {
// //     // Replace this with your actual API call
// //     // Example: fetchProductsFromAPI().then(data => setAllProducts(data))
// //     const products = getProducts();
// //     setAllProducts(products);
// //   };

// //   // Load recent searches from AsyncStorage
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

// //   // Save recent searches to AsyncStorage
// //   const saveRecentSearches = async (searches: string[]) => {
// //     try {
// //       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
// //     } catch (error) {
// //       console.error('Failed to save recent searches:', error);
// //     }
// //   };

// //   // Handle search
// //   const handleSearch = (text: string) => {
// //     setSearchText(text);
// //     setIsSearching(text.length > 0);

// //     if (text.trim()) {
// //       const results = allProducts.filter(
// //         (item) =>
// //           item.name.toLowerCase().includes(text.toLowerCase()) ||
// //           item.category.toLowerCase().includes(text.toLowerCase()) ||
// //           (item.brand && item.brand.toLowerCase().includes(text.toLowerCase()))
// //       );
// //       setSearchResults(results);
// //     } else {
// //       setSearchResults([]);
// //     }
// //   };

// //   // Save search to recent
// //   const saveSearch = (term: string) => {
// //     if (!term.trim()) return;
    
// //     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
// //     if (updatedSearches.length > 10) {
// //       updatedSearches = updatedSearches.slice(0, 10);
// //     }
// //     setRecentSearches(updatedSearches);
// //     saveRecentSearches(updatedSearches);
// //   };

// //   // Handle search submit
// //   const handleSearchSubmit = () => {
// //     if (searchText.trim()) {
// //       saveSearch(searchText.trim());
// //       setIsSearching(true);
// //     }
// //   };

// //   // Clear search
// //   const clearSearch = () => {
// //     setSearchText('');
// //     setSearchResults([]);
// //     setIsSearching(false);
// //   };

// //   // Clear a single recent search
// //   const clearRecentSearch = async (term: string) => {
// //     const updated = recentSearches.filter(s => s !== term);
// //     setRecentSearches(updated);
// //     await saveRecentSearches(updated);
// //   };

// //   // Clear all recent searches
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

// //   // Handle category click - filter products by category
// //   const handleCategoryClick = (category: string) => {
// //     setSearchText(category);
// //     saveSearch(category);
// //     const results = allProducts.filter(
// //       (item) =>
// //         item.category.toLowerCase().includes(category.toLowerCase())
// //     );
// //     setSearchResults(results);
// //     setIsSearching(true);
// //   };

// //   // Handle recent search click
// //   const handleRecentSearchClick = (term: string) => {
// //     setSearchText(term);
// //     saveSearch(term);
// //     const results = allProducts.filter(
// //       (item) =>
// //         item.name.toLowerCase().includes(term.toLowerCase()) ||
// //         item.category.toLowerCase().includes(term.toLowerCase()) ||
// //         (item.brand && item.brand.toLowerCase().includes(term.toLowerCase()))
// //     );
// //     setSearchResults(results);
// //     setIsSearching(true);
// //   };

// //   // Navigate to Product Detail (using RestaurantDetail screen as product detail)
// //   const navigateToProduct = (product: Product) => {
// //     // Save the search term
// //     saveSearch(product.name);
    
// //     // Navigate to RestaurantDetail with product data
// //     // The RestaurantDetail screen will treat this as a product detail
// //     navigation.getParent()?.navigate('RestaurantDetail', { 
// //       restaurant: {
// //         id: product.id,
// //         name: product.name,
// //         rating: 4.5, // Default rating for products
// //         deliveryTime: 'In Stock',
// //         cuisine: product.category,
// //         image: product.image || 'https://via.placeholder.com/150',
// //         costForTwo: `₹${product.price}`,
// //         address: product.description || 'Available in stock',
// //         isVeg: true,
// //         offer: `Stock: ${product.stock} units`,
// //         // Additional product details
// //         productData: {
// //           price: product.price,
// //           stock: product.stock,
// //           category: product.category,
// //           description: product.description,
// //           brand: product.brand,
// //           vendor: product.vendor,
// //           gst: product.gst,
// //           unit: product.unit,
// //           barcode: product.barcode,
// //           sku: product.sku,
// //         }
// //       }
// //     });
// //   };

// //   // Render search result item - Product Card
// //   const renderSearchResult = ({ item }: { item: Product }) => (
// //     <TouchableOpacity
// //       style={styles.resultItem}
// //       onPress={() => navigateToProduct(item)}
// //       activeOpacity={0.7}
// //     >
// //       <View style={styles.resultImageContainer}>
// //         <Image 
// //           source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
// //           style={styles.resultImage} 
// //         />
// //         <View style={styles.stockBadge}>
// //           <Text style={styles.stockBadgeText}>{item.stock} left</Text>
// //         </View>
// //       </View>
// //       <View style={styles.resultInfo}>
// //         <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
// //         <Text style={styles.resultCategory}>{item.category}</Text>
// //         <View style={styles.resultMeta}>
// //           <Text style={styles.resultPrice}>₹{item.price}</Text>
// //           {item.brand && (
// //             <Text style={styles.resultBrand}>• {item.brand}</Text>
// //           )}
// //         </View>
// //       </View>
// //       <Icon name="chevron-forward" size={20} color="#ccc" />
// //     </TouchableOpacity>
// //   );

// //   // Render recent search item
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

// //   // Render popular category
// //   const renderCategory = ({ item }: { item: any }) => (
// //     <TouchableOpacity
// //       style={styles.categoryChip}
// //       onPress={() => handleCategoryClick(item.name)}
// //     >
// //       <Text style={styles.categoryEmoji}>{item.icon}</Text>
// //       <Text style={styles.categoryChipText}>{item.name}</Text>
// //     </TouchableOpacity>
// //   );

// //   // Render popular product item (for default view)
// //   const renderPopularProduct = ({ item }: { item: Product }) => (
// //     <TouchableOpacity
// //       style={styles.popularItem}
// //       onPress={() => navigateToProduct(item)}
// //       activeOpacity={0.7}
// //     >
// //       <View style={styles.popularItemLeft}>
// //         <Image 
// //           source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
// //           style={styles.popularItemImage} 
// //         />
// //         <View style={styles.popularItemInfo}>
// //           <Text style={styles.popularItemName} numberOfLines={1}>{item.name}</Text>
// //           <Text style={styles.popularItemCategory}>{item.category}</Text>
// //           <View style={styles.popularItemMeta}>
// //             <Text style={styles.popularItemPrice}>₹{item.price}</Text>
// //             <Text style={styles.popularItemStock}>• Stock: {item.stock}</Text>
// //           </View>
// //         </View>
// //       </View>
// //       <Icon name="chevron-forward" size={20} color="#ccc" />
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// //       {/* Header with Back Button and Search */}
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

// //       {/* Content */}
// //       {isSearching ? (
// //         // Search Results - Products
// //         <FlatList
// //           data={searchResults}
// //           renderItem={renderSearchResult}
// //           keyExtractor={(item) => item.id}
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
// //                 {searchResults.length} product{searchResults.length > 1 ? 's' : ''} found
// //               </Text>
// //             ) : null
// //           }
// //         />
// //       ) : (
// //         // Default View with Categories and Products
// //         <FlatList
// //           data={allProducts}
// //           renderItem={renderPopularProduct}
// //           keyExtractor={(item) => item.id}
// //           contentContainerStyle={styles.content}
// //           showsVerticalScrollIndicator={false}
// //           ListHeaderComponent={
// //             <View>
// //               {/* Popular Categories */}
// //               <View style={styles.section}>
// //                 <Text style={styles.sectionTitle}>Shop by Category</Text>
// //                 <FlatList
// //                   data={POPULAR_CATEGORIES}
// //                   renderItem={renderCategory}
// //                   keyExtractor={(item) => item.id.toString()}
// //                   horizontal
// //                   showsHorizontalScrollIndicator={false}
// //                   contentContainerStyle={styles.categoriesList}
// //                 />
// //               </View>

// //               {/* Recent Searches */}
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

// //               {/* All Products Section */}
// //               <View style={styles.section}>
// //                 <Text style={styles.sectionTitle}>All Products</Text>
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
// //   categoriesList: {
// //     paddingVertical: 4,
// //   },
// //   categoryChip: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f0f5',
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     borderRadius: 20,
// //     marginRight: 10,
// //   },
// //   categoryEmoji: {
// //     fontSize: 16,
// //     marginRight: 4,
// //   },
// //   categoryChipText: {
// //     fontSize: 14,
// //     color: '#282c3f',
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
// //     padding: 16,
// //     paddingBottom: 20,
// //   },
// //   resultsCount: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginBottom: 12,
// //   },
// //   resultItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //     padding: 12,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#f0f0f5',
// //   },
// //   resultImageContainer: {
// //     position: 'relative',
// //   },
// //   resultImage: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 8,
// //     backgroundColor: '#f0f0f5',
// //   },
// //   stockBadge: {
// //     position: 'absolute',
// //     bottom: 2,
// //     right: 2,
// //     backgroundColor: '#fc8019',
// //     paddingHorizontal: 4,
// //     paddingVertical: 1,
// //     borderRadius: 4,
// //   },
// //   stockBadgeText: {
// //     fontSize: 8,
// //     color: '#ffffff',
// //     fontWeight: '600',
// //   },
// //   resultInfo: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   resultName: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   resultCategory: {
// //     fontSize: 13,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   resultMeta: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 4,
// //     flexWrap: 'wrap',
// //   },
// //   resultPrice: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   resultBrand: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginLeft: 4,
// //   },
// //   popularItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   popularItemLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
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
// //     color: '#7e808c',
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
// import React, { useState, useEffect } from 'react';
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

// // Popular categories based on your product categories - dynamically generated from products
// const POPULAR_CATEGORIES = [
//   { id: 1, name: 'Groceries', icon: '🛒' },
//   { id: 2, name: 'Electronics', icon: '💻' },
//   { id: 3, name: 'Clothing', icon: '👕' },
//   { id: 4, name: 'Books', icon: '📚' },
//   { id: 5, name: 'Home & Living', icon: '🏠' },
//   { id: 6, name: 'Beauty', icon: '💄' },
// ];

// interface SearchScreenProps {
//   navigation: any;
// }

// const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
//   const [searchText, setSearchText] = useState<string>('');
//   const [searchResults, setSearchResults] = useState<Product[]>([]);
//   const [recentSearches, setRecentSearches] = useState<string[]>([]);
//   const [isSearching, setIsSearching] = useState<boolean>(false);
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Load products on mount
//   useEffect(() => {
//     loadProducts();
//     loadRecentSearches();
//   }, []);

//   // ⭐ FIXED: Load products from API (same as HomeScreen)
//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Use the same API endpoint as HomeScreen
//       const response = await axios.get(`${API_URL}/public/products`);
      
//       // The response might be an array directly or nested in data
//       const products = Array.isArray(response.data) ? response.data : response.data.data || [];
      
//       setAllProducts(products);
//     } catch (err) {
//       console.error('Failed to load products:', err);
//       setError('Failed to load products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load recent searches from AsyncStorage
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

//   // Save recent searches to AsyncStorage
//   const saveRecentSearches = async (searches: string[]) => {
//     try {
//       await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
//     } catch (error) {
//       console.error('Failed to save recent searches:', error);
//     }
//   };

//   // Handle search
//   const handleSearch = (text: string) => {
//     setSearchText(text);
//     setIsSearching(text.length > 0);

//     if (text.trim()) {
//       const results = allProducts.filter(
//         (item) =>
//           item.name.toLowerCase().includes(text.toLowerCase()) ||
//           item.category.toLowerCase().includes(text.toLowerCase()) ||
//           (item.brand && item.brand.toLowerCase().includes(text.toLowerCase()))
//       );
//       setSearchResults(results);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   // Save search to recent
//   const saveSearch = (term: string) => {
//     if (!term.trim()) return;
    
//     let updatedSearches = [term, ...recentSearches.filter(s => s !== term)];
//     if (updatedSearches.length > 10) {
//       updatedSearches = updatedSearches.slice(0, 10);
//     }
//     setRecentSearches(updatedSearches);
//     saveRecentSearches(updatedSearches);
//   };

//   // Handle search submit
//   const handleSearchSubmit = () => {
//     if (searchText.trim()) {
//       saveSearch(searchText.trim());
//       setIsSearching(true);
//     }
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchText('');
//     setSearchResults([]);
//     setIsSearching(false);
//   };

//   // Clear a single recent search
//   const clearRecentSearch = async (term: string) => {
//     const updated = recentSearches.filter(s => s !== term);
//     setRecentSearches(updated);
//     await saveRecentSearches(updated);
//   };

//   // Clear all recent searches
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

//   // Handle category click - filter products by category
//   const handleCategoryClick = (category: string) => {
//     setSearchText(category);
//     saveSearch(category);
//     const results = allProducts.filter(
//       (item) =>
//         item.category.toLowerCase().includes(category.toLowerCase())
//     );
//     setSearchResults(results);
//     setIsSearching(true);
//   };

//   // Handle recent search click
//   const handleRecentSearchClick = (term: string) => {
//     setSearchText(term);
//     saveSearch(term);
//     const results = allProducts.filter(
//       (item) =>
//         item.name.toLowerCase().includes(term.toLowerCase()) ||
//         item.category.toLowerCase().includes(term.toLowerCase()) ||
//         (item.brand && item.brand.toLowerCase().includes(term.toLowerCase()))
//     );
//     setSearchResults(results);
//     setIsSearching(true);
//   };

//   // Navigate to Product Detail (using RestaurantDetail screen as product detail)
//   const navigateToProduct = (product: Product) => {
//     // Save the search term
//     saveSearch(product.name);
    
//     // Navigate to RestaurantDetail with product data
//     navigation.getParent()?.navigate('RestaurantDetail', { 
//       restaurant: {
//         id: product.id,
//         name: product.name,
//         rating: 4.5,
//         deliveryTime: 'In Stock',
//         cuisine: product.category,
//         image: product.image || 'https://via.placeholder.com/150',
//         costForTwo: `₹${product.selling_price}`,
//         address: product.description || 'Available in stock',
//         isVeg: true,
//         offer: `Stock: ${product.stock_qty} units`,
//         productData: {
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
//         }
//       }
//     });
//   };

//   // Render search result item - Product Card
//   const renderSearchResult = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.resultItem}
//       onPress={() => navigateToProduct(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.resultImageContainer}>
//         <Image 
//           source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
//           style={styles.resultImage} 
//         />
//         <View style={[styles.stockBadge, { backgroundColor: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
//           <Text style={styles.stockBadgeText}>{item.stock_qty} left</Text>
//         </View>
//       </View>
//       <View style={styles.resultInfo}>
//         <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
//         <Text style={styles.resultCategory}>{item.category}</Text>
//         <View style={styles.resultMeta}>
//           <Text style={styles.resultPrice}>₹{item.selling_price}</Text>
//           {item.brand && (
//             <Text style={styles.resultBrand}>• {item.brand}</Text>
//           )}
//         </View>
//       </View>
//       <Icon name="chevron-forward" size={20} color="#ccc" />
//     </TouchableOpacity>
//   );

//   // Render recent search item
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

//   // Render popular category
//   const renderCategory = ({ item }: { item: any }) => (
//     <TouchableOpacity
//       style={styles.categoryChip}
//       onPress={() => handleCategoryClick(item.name)}
//     >
//       <Text style={styles.categoryEmoji}>{item.icon}</Text>
//       <Text style={styles.categoryChipText}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   // Render popular product item (for default view)
//   const renderPopularProduct = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.popularItem}
//       onPress={() => navigateToProduct(item)}
//       activeOpacity={0.7}
//     >
//       <View style={styles.popularItemLeft}>
//         <Image 
//           source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
//           style={styles.popularItemImage} 
//         />
//         <View style={styles.popularItemInfo}>
//           <Text style={styles.popularItemName} numberOfLines={1}>{item.name}</Text>
//           <Text style={styles.popularItemCategory}>{item.category}</Text>
//           <View style={styles.popularItemMeta}>
//             <Text style={styles.popularItemPrice}>₹{item.selling_price}</Text>
//             <Text style={[styles.popularItemStock, { color: item.stock_qty > 5 ? '#28a745' : '#dc3545' }]}>
//               • Stock: {item.stock_qty}
//             </Text>
//           </View>
//         </View>
//       </View>
//       <Icon name="chevron-forward" size={20} color="#ccc" />
//     </TouchableOpacity>
//   );

//   // Show loading state
//   if (loading) {
//     return (
//       <SafeAreaView style={[styles.container, styles.centerContent]}>
//         <ActivityIndicator size="large" color="#fc8019" />
//         <Text style={styles.loadingText}>Loading products...</Text>
//       </SafeAreaView>
//     );
//   }

//   // Show error state
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

//       {/* Header with Back Button and Search */}
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

//       {/* Content */}
//       {isSearching ? (
//         // Search Results - Products
//         <FlatList
//           data={searchResults}
//           renderItem={renderSearchResult}
//           keyExtractor={(item) => item.id}
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
//                 {searchResults.length} product{searchResults.length > 1 ? 's' : ''} found
//               </Text>
//             ) : null
//           }
//         />
//       ) : (
//         // Default View with Categories and Products
//         <FlatList
//           data={allProducts}
//           renderItem={renderPopularProduct}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.content}
//           showsVerticalScrollIndicator={false}
//           ListHeaderComponent={
//             <View>
//               {/* Popular Categories */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Shop by Category</Text>
//                 <FlatList
//                   data={POPULAR_CATEGORIES}
//                   renderItem={renderCategory}
//                   keyExtractor={(item) => item.id.toString()}
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.categoriesList}
//                 />
//               </View>

//               {/* Recent Searches */}
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

//               {/* All Products Section */}
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
//   categoriesList: {
//     paddingVertical: 4,
//   },
//   categoryChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f5',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   categoryEmoji: {
//     fontSize: 16,
//     marginRight: 4,
//   },
//   categoryChipText: {
//     fontSize: 14,
//     color: '#282c3f',
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
//     padding: 16,
//     paddingBottom: 20,
//   },
//   resultsCount: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginBottom: 12,
//   },
//   resultItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     padding: 12,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f5',
//   },
//   resultImageContainer: {
//     position: 'relative',
//   },
//   resultImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f5',
//   },
//   stockBadge: {
//     position: 'absolute',
//     bottom: 2,
//     right: 2,
//     paddingHorizontal: 4,
//     paddingVertical: 1,
//     borderRadius: 4,
//   },
//   stockBadgeText: {
//     fontSize: 8,
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   resultInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   resultName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   resultCategory: {
//     fontSize: 13,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   resultMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//     flexWrap: 'wrap',
//   },
//   resultPrice: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   resultBrand: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginLeft: 4,
//   },
//   popularItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   popularItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
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
import React, { useState, useEffect } from 'react';
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
}

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
    loadRecentSearches();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/public/products`);
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