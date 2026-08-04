// import React, { useState } from 'react';
import { useEffect, useState } from 'react';
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
import { categories, restaurants, offers } from '../../constants/dummyData';
// import { useEffect, useState } from 'react';

import axios from 'axios';
import { API_URL } from '@env';
import RestaurantCard from '../../components/home/RestaurantCard';
import CategoryItem from '../../components/home/CategoryItem';
import { Category, Restaurant, Offer } from '../../types';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // axios.get(`${API_URL}/public/products?business_id=1`)
    axios.get(`${API_URL}/public/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products:', err));
  }, []);

  const renderCategory = ({ item }: { item: Category }) => <CategoryItem category={item} />;

  const renderOffer = ({ item }: { item: Offer }) => (
    <View style={styles.offerCard}>
      <Text style={styles.offerTitle}>{item.title}</Text>
      <Text style={styles.offerDescription}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>📍 Home</Text>
          <Text style={styles.location}>Sector 1, HSR Layout</Text>
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

      {/* Top Restaurants */}
      {/* <View style={styles.restaurantsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top restaurant chains</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {restaurants.map((restaurant: Restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
          />
        ))}
      </View> */}
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
    alignItems: 'center',
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
