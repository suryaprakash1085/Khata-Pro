import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { OrderContext } from '../../context/OrderContext';
import { CartContext } from '../../context/CartContext';

  const OrdersSummary = ({ navigation }: { navigation: any }) => {
  const { orders } = useContext(OrderContext);
  const { cartItems } = useContext(CartContext);

  // Calculate order statistics
  const totalOrders = orders?.length || 0;
  const deliveredOrders = orders?.filter((o) => o.status === 'Delivered').length || 0;
  const cancelledOrders = orders?.filter((o) => o.status === 'Cancelled').length || 0;
  const totalSpent = orders?.reduce((sum, number, order: any) => {
    if (order.status !== 'Cancelled') {
      return sum + (order.total || 0);
    }
    return sum;
  }, 0) || 0;
  const itemsInCart = cartItems?.length || 0;

  // Get only the latest placed order (payment completed)
  const getLatestPlacedOrder = () => {
    if (!orders || orders.length === 0) return null;
    
    // Filter orders that are placed (not pending, not cancelled)
    const placedOrders = orders.filter((order: any) =>
      order.status === 'Placed' || 
      order.status === 'Confirmed' || 
      order.status === 'Processing' ||
      order.status === 'Delivered'
    );
    
    if (placedOrders.length === 0) return null;
    
    // Return the most recent placed order
    return placedOrders[placedOrders.length - 1];
  };

  const latestOrder = getLatestPlacedOrder();
  const orderItems = latestOrder?.items || [];

 const renderOrderItem = (item: any, index: number) => {
    return (
      <View key={index} style={styles.orderItemCard}>
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
    );
  };

  // Calculate total of the latest order
 const totalOrderAmount = orderItems.reduce((sum: number, item: any) => 
  sum + ((item.price || 0) * (item.quantity || 1)), 0
);

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

        {/* Latest Placed Order Items Section */}
        {latestOrder && orderItems.length > 0 ? (
          <View style={styles.orderItemsContainer}>
            <View style={styles.orderItemsHeader}>
              <Text style={styles.orderItemsTitle}>Placed Order</Text>
              <Text style={styles.orderItemsCount}>{orderItems.length} items</Text>
            </View>
            
            {orderItems.map((item, index) => renderOrderItem(item, index))}
            
            {/* Order Total */}
            <View style={styles.orderTotalContainer}>
              <Text style={styles.orderTotalLabel}>Order Total</Text>
              <Text style={styles.orderTotalAmount}>
                ₹{totalOrderAmount}
              </Text>
            </View>
          </View>
        ) : (
          // No Placed Orders Message
          <View style={styles.emptyContainer}>
            <Icon name="cart-outline" size={60} color="#e0e0e0" />
            <Text style={styles.emptyTitle}>No Placed Orders</Text>
            <Text style={styles.emptySubtitle}>
              You haven't placed any orders yet. Complete payment to see your orders here!
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
  // Order Items Styles
  orderItemsContainer: {
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
  orderTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#f0f0f5',
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
  },
  orderTotalAmount: {
    fontSize: 18,
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