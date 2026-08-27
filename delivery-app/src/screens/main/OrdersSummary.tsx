


import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_URL } from '@env';
import { OrderContext } from '../../context/OrderContext';
import { CartContext } from '../../context/CartContext';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';

const OrdersSummary = ({ navigation }: { navigation: any }) => {
  const { orders } = useContext(OrderContext);
  const { cartItems } = useContext(CartContext);
  const { selectedBusiness } = useContext(SelectedBusinessContext);

  // Calculate order statistics
  const totalOrders = orders?.length || 0;
  const deliveredOrders = orders?.filter((o: any) => o.status === 'Delivered').length || 0;
  const cancelledOrders = orders?.filter((o: any) => o.status === 'Cancelled').length || 0;
  const totalSpent = orders?.reduce((sum: number, order: any) => {
    if (order.status !== 'Cancelled') {
      return sum + (order.total || 0);
    }
    return sum;
  }, 0) || 0;

  const itemsInCart = cartItems?.length || 0;

  // ✅ Get all delivered orders (past orders)
  const getDeliveredOrders = () => {
    if (!orders || orders.length === 0) return [];
    const delivered = orders.filter((order: any) => 
      order.status === 'Delivered'
    );
    return delivered.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const deliveredOrdersList = getDeliveredOrders();

  // ✅ Render order items for delivered orders
  const renderDeliveredOrder = (order: any, index: number) => {
    const items = order.items || [];
    const totalAmount = items.reduce((sum: number, item: any) => 
      sum + ((item.price || 0) * (item.quantity || 1)), 0
    );

    return (
      <View key={index} style={styles.deliveredOrderCard}>
        <View style={styles.deliveredOrderHeader}>
          <Text style={styles.deliveredOrderRestaurant}>{order.restaurantName || 'Restaurant'}</Text>
          <View style={styles.deliveredStatusBadge}>
            <Icon name="checkmark-circle" size={14} color="#28a745" />
            <Text style={styles.deliveredStatusText}>Delivered</Text>
          </View>
        </View>

        {items.slice(0, 3).map((item: any, idx: number) => (
          <View key={idx} style={styles.orderItemCard}>
            <View style={styles.orderItemImageContainer}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.orderItemImage} />
              ) : (
                <View style={styles.orderItemImagePlaceholder}>
                  <Icon name="fast-food-outline" size={30} color="#fc8019" />
                </View>
              )}
            </View>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName}>{item.name || 'Food Item'}</Text>
              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemQuantity}>Qty: {item.quantity || 1}</Text>
                <Text style={styles.orderItemPrice}>₹{item.price || 0}</Text>
              </View>
            </View>
            <View style={styles.orderItemTotal}>
              <Text style={styles.orderItemTotalPrice}>
                ₹{(item.price || 0) * (item.quantity || 1)}
              </Text>
            </View>
          </View>
        ))}

        {items.length > 3 && (
          <Text style={styles.moreItemsText}>+{items.length - 3} more items</Text>
        )}

        <View style={styles.deliveredOrderFooter}>
          <Text style={styles.deliveredOrderDate}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </Text>
          <Text style={styles.deliveredOrderTotal}>₹{totalAmount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.orderSummaryContainer}>
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>

          {/* Total Orders */}
          <View style={styles.orderSummaryRow}>
            <View style={styles.rowLeft}>
              <Icon name="receipt-outline" size={20} color="#fc8019" />
              <Text style={styles.orderSummaryLabel}>Total Orders</Text>
            </View>
            <Text style={styles.orderSummaryValue}>{totalOrders}</Text>
          </View>

          {/* Delivered */}
          <View style={styles.orderSummaryRow}>
            <View style={styles.rowLeft}>
              <Icon name="checkmark-circle-outline" size={20} color="#28a745" />
              <Text style={styles.orderSummaryLabel}>Delivered</Text>
            </View>
            <Text style={[styles.orderSummaryValue, { color: '#28a745' }]}>
              {deliveredOrders}
            </Text>
          </View>

          {/* Cancelled */}
          <View style={styles.orderSummaryRow}>
            <View style={styles.rowLeft}>
              <Icon name="close-circle-outline" size={20} color="#dc3545" />
              <Text style={styles.orderSummaryLabel}>Cancelled</Text>
            </View>
            <Text style={[styles.orderSummaryValue, { color: '#dc3545' }]}>
              {cancelledOrders}
            </Text>
          </View>

          {/* Total Spent */}
          <View style={styles.orderSummaryRow}>
            <View style={styles.rowLeft}>
              <Icon name="cash-outline" size={20} color="#fc8019" />
              <Text style={styles.orderSummaryLabel}>Total Spent</Text>
            </View>
            <Text style={[styles.orderSummaryValue, { color: '#fc8019', fontWeight: '700' }]}>
              ₹{totalSpent}
            </Text>
          </View>

          {/* Items in Cart */}
          <View style={[styles.orderSummaryRow, styles.lastRow]}>
            <View style={styles.rowLeft}>
              <Icon name="cart-outline" size={20} color="#17a2b8" />
              <Text style={styles.orderSummaryLabel}>Items in Cart</Text>
            </View>
            <Text style={styles.orderSummaryValue}>{itemsInCart}</Text>
          </View>
        </View>

        {/* ✅ Delivered Orders Section */}
        {deliveredOrdersList.length > 0 ? (
          <View style={styles.deliveredOrdersContainer}>
            <View style={styles.orderItemsHeader}>
              <Text style={styles.orderItemsTitle}>Delivered Orders</Text>
              <Text style={styles.orderItemsCount}>{deliveredOrdersList.length} orders</Text>
            </View>

            {deliveredOrdersList.map((order, index) => renderDeliveredOrder(order, index))}
          </View>
        ) : (
          // No Delivered Orders Message
          <View style={styles.emptyContainer}>
            <Icon name="checkmark-circle-outline" size={60} color="#e0e0e0" />
            <Text style={styles.emptyTitle}>No Delivered Orders</Text>
            <Text style={styles.emptySubtitle}>
              You haven't received any orders yet. Your delivered orders will appear here!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  headerPlaceholder: {
    width: 40,
  },
  orderSummaryContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 8,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  orderSummaryLabel: {
    fontSize: 14,
    color: '#282c3f',
    marginLeft: 12,
  },
  orderSummaryValue: {
    fontSize: 15,
    color: '#282c3f',
    fontWeight: '600',
  },

  // Delivered Orders Styles
  deliveredOrdersContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  deliveredOrderCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  deliveredOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveredOrderRestaurant: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282c3f',
  },
  deliveredStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  deliveredStatusText: {
    fontSize: 11,
    color: '#28a745',
    fontWeight: '500',
    marginLeft: 4,
  },
  deliveredOrderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  deliveredOrderDate: {
    fontSize: 11,
    color: '#7e808c',
  },
  deliveredOrderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fc8019',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#fc8019',
    marginTop: 4,
    fontWeight: '500',
  },

  // Order Items Styles
  orderItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  orderItemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
  },
  orderItemsCount: {
    fontSize: 13,
    color: '#7e808c',
  },
  orderItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderItemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  orderItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  orderItemImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5ed',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282c3f',
  },
  orderItemDetails: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#7e808c',
  },
  orderItemPrice: {
    fontSize: 12,
    color: '#7e808c',
    marginLeft: 10,
  },
  orderItemTotal: {
    alignItems: 'flex-end',
  },
  orderItemTotalPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fc8019',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7e808c',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
});

export default OrdersSummary;
