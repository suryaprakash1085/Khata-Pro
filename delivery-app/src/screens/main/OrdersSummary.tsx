
import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ordersApi, CustomerOrder } from '../../api/orders';
import { CartContext } from '../../context/CartContext';

// ✅ Theme color — matched to Address / Payment / Orders / Profile screens' purple/indigo
const THEME_COLOR = '#6C5CE7';

interface OrderSummaryProps {
  navigation: any;
  route?: any;
}

const OrdersSummary = ({ navigation, route }: OrderSummaryProps) => {
  const { cartItems } = useContext(CartContext);

  // ✅ FIX: pull real orders straight from the backend (same source
  // OrdersScreen uses) instead of relying on OrderContext, which was
  // never populated — that's why every stat showed 0 before.
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Get discount and promo code from route params if available
  const discount = route?.params?.discount || 0;
  const promoCode = route?.params?.promoCode || null;

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await ordersApi.getMyOrders();
      setOrders(res.data ?? []);
      setLoadError(null);
    } catch (err: any) {
      if (!silent) setLoadError(err?.message || 'Unable to load your orders.');
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(true);
  };

  // ✅ Calculate order statistics from real tracking_status values
  const totalOrders = orders.length;
  const deliveredOrdersList = orders
    .filter((o) => o.tracking_status === 'DELIVERED')
    .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());
  const deliveredCount = deliveredOrdersList.length;
  const cancelledCount = orders.filter((o) => o.tracking_status === 'CANCELLED').length;
  const totalSpent = orders.reduce((sum, order) => {
    if (order.tracking_status !== 'CANCELLED') {
      return sum + (order.amount || 0);
    }
    return sum;
  }, 0);

  const itemsInCart = cartItems?.length || 0;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  // ✅ Render a delivered order card using real order fields
  const renderDeliveredOrder = (order: CustomerOrder, index: number) => {
    return (
      <View key={order.id ?? index} style={styles.deliveredOrderCard}>
        <View style={styles.deliveredOrderHeader}>
          <Text style={styles.deliveredOrderRestaurant}>Order #{order.id}</Text>
          <View style={styles.deliveredStatusBadge}>
            <Icon name="checkmark-circle" size={14} color="#28a745" />
            <Text style={styles.deliveredStatusText}>Delivered</Text>
          </View>
        </View>

        {order.delivery?.driver_name && (
          <Text style={styles.driverText}>Driver: {order.delivery.driver_name}</Text>
        )}

        <View style={styles.deliveredOrderFooter}>
          <Text style={styles.deliveredOrderDate}>{formatDate(order.entry_date)}</Text>
          <Text style={styles.deliveredOrderTotal}>₹{order.amount}</Text>
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

      {loading ? (
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
        </View>
      ) : loadError ? (
        <View style={styles.centerFill}>
          <Icon name="alert-circle-outline" size={50} color="#dc3545" />
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchOrders(false)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Order Summary Card */}
          <View style={styles.orderSummaryContainer}>
            <Text style={styles.orderSummaryTitle}>Order History</Text>

            {/* Total Orders */}
            <View style={styles.orderSummaryRow}>
              <View style={styles.rowLeft}>
                <Icon name="receipt-outline" size={20} color={THEME_COLOR} />
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
                {deliveredCount}
              </Text>
            </View>

            {/* Cancelled */}
            <View style={styles.orderSummaryRow}>
              <View style={styles.rowLeft}>
                <Icon name="close-circle-outline" size={20} color="#dc3545" />
                <Text style={styles.orderSummaryLabel}>Cancelled</Text>
              </View>
              <Text style={[styles.orderSummaryValue, { color: '#dc3545' }]}>
                {cancelledCount}
              </Text>
            </View>

            {/* Total Spent */}
            <View style={styles.orderSummaryRow}>
              <View style={styles.rowLeft}>
                <Icon name="cash-outline" size={20} color={THEME_COLOR} />
                <Text style={styles.orderSummaryLabel}>Total Spent</Text>
              </View>
              <Text style={[styles.orderSummaryValue, { color: THEME_COLOR, fontWeight: '700' }]}>
                ₹{totalSpent}
              </Text>
            </View>

            {/* ✅ Discount Row — promo apply pannirundha mattum kaamikkum */}
            {discount > 0 && (
              <View style={styles.orderSummaryRow}>
                <View style={styles.rowLeft}>
                  <Icon name="pricetag-outline" size={20} color="#28a745" />
                  <Text style={[styles.orderSummaryLabel, { color: '#28a745' }]}>
                    Discount {promoCode ? `(${promoCode})` : ''}
                  </Text>
                </View>
                <Text style={[styles.orderSummaryValue, { color: '#28a745', fontWeight: '700' }]}>
                  -₹{discount}
                </Text>
              </View>
            )}

            {/* Items in Cart */}
            <View style={[styles.orderSummaryRow, styles.lastRow]}>
              <View style={styles.rowLeft}>
                <Icon name="cart-outline" size={20} color="#17a2b8" />
                <Text style={styles.orderSummaryLabel}>Items in Cart</Text>
              </View>
              <Text style={styles.orderSummaryValue}>{itemsInCart}</Text>
            </View>
          </View>

          {/* ✅ Delivered Orders Section — no more "No Delivered Orders" fallback text;
              cards render directly once real data comes in. Empty state only shows
              a light hint icon so the layout doesn't look broken while truly empty. */}
          <View style={styles.deliveredOrdersContainer}>
            <View style={styles.orderItemsHeader}>
              <Text style={styles.orderItemsTitle}>Delivered Orders</Text>
              <Text style={styles.orderItemsCount}>{deliveredCount} orders</Text>
            </View>

            {deliveredOrdersList.length > 0 ? (
              deliveredOrdersList.map((order, index) => renderDeliveredOrder(order, index))
            ) : (
              <View style={styles.emptyInline}>
                <Icon name="checkmark-circle-outline" size={40} color="#e0e0e0" />
                <Text style={styles.emptyInlineText}>Nothing delivered yet</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#7e808c',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  driverText: {
    fontSize: 12,
    color: '#7e808c',
    marginBottom: 4,
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
    color: THEME_COLOR,
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
  emptyInline: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyInlineText: {
    fontSize: 13,
    color: '#9e9e9e',
    marginTop: 8,
  },
});

export default OrdersSummary;