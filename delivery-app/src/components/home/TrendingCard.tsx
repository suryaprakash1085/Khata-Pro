import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { Restaurant } from '../../types';

interface TrendingCardProps {
  item: Restaurant;
  onPress?: () => void;
}

export default function TrendingCard({ item, onPress }: TrendingCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/120' }} 
        style={styles.image} 
      />
      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{item.cuisine}</Text>
        <View style={styles.metaContainer}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={12} color="#ffc107" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
        </View>
        {item.offers && item.offers.length > 0 && (
          <View style={styles.offerContainer}>
            <Text style={styles.offerText}>{item.offers[0].title}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  subtitle: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 11,
    color: colors.white,
    marginLeft: 2,
  },
  deliveryTime: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.8,
    marginLeft: 8,
  },
  offerContainer: {
    marginTop: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  offerText: {
    fontSize: 9,
    color: colors.white,
    fontWeight: '600',
  },
});