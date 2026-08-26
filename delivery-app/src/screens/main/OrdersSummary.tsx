
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

  // ✅ State for delivery fee calculation
  const [deliveryFeeData, setDeliveryFeeData] = useState<any>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState<boolean>(false);

  // ✅ Get store ID
  const getStoreId = (): number | null => {
    if (selectedBusiness?.id) {
      return Number(selectedBusiness.id);
    }
    if (cartItems.length > 0 && cartItems[0]?.restaurantId) {
      return Number(cartItems[0].restaurantId);
    }
    return null;
  };

  // ✅ Calculate delivery fee from API when component mounts or cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      calculateDeliveryFeeFromAPI();
    } else {
      setDeliveryFeeData(null);
    }
  }, [cartItems]);

  // ✅ Function to calculate delivery fee from API
  const calculateDeliveryFeeFromAPI = async () => {
    const businessId = getStoreId();
    if (!businessId) {
      console.warn('No business ID found for delivery fee calculation');
      return;
    }

    setIsCalculatingFee(true);
    
    try {
      // Use default customer location (Delhi)
      const customerLat = 28.6139;
      const customerLng = 77.2090;
      
      const response = await axios.post(`${API_URL}/delivery-fees/calculate`, {
        business_id: businessId,
        customer_latitude: customerLat,
        customer_longitude: customerLng,
      });

      console.log('✅ Delivery fee calculated in OrdersSummary:', response.data);
      
      setDeliveryFeeData({
        delivery_fee: response.data.delivery_fee || 30,
        distance_km: response.data.distance_km || 0,
        free_delivery_radius: response.data.free_delivery_radius || 5,
        chargeable_distance_km: response.data.chargeable_distance_km || 0,
        is_free_delivery: response.data.is_free_delivery || false,
      });
      
    } catch (error) {
      console.error('❌ Failed to calculate delivery fee in OrdersSummary:', error);
    } finally {
      setIsCalculatingFee(false);
    }
  };

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
  
  // ✅ Calculate GST breakdown from cart items
  const getGSTBreakdown = () => {
    if (!cartItems || cartItems.length === 0) return null;
    
    const gstRates = new Map();
    cartItems.forEach((item: any) => {
      const rate = item.gst_rate || 0;
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      const gstAmount = itemTotal * (rate / 100);
      gstRates.set(rate, (gstRates.get(rate) || 0) + gstAmount);
    });
    
    return Array.from(gstRates.entries()).map(([rate, amount]) => ({
      rate,
      amount: Math.round(amount)
    }));
  };

  // ✅ Calculate total GST
  const calculateTotalGST = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    let totalGST = 0;
    cartItems.forEach((item: any) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      const gstRate = item.gst_rate || 0;
      totalGST += itemTotal * (gstRate / 100);
    });
    return Math.round(totalGST);
  };

  const gstBreakdown = getGSTBreakdown();
  const totalGST = calculateTotalGST();

  // ✅ Calculate cart total with delivery fee
  const getCartTotal = () => {
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      return sum + ((item.price || 0) * (item.quantity || 1));
    }, 0);
    const deliveryFee = deliveryFeeData?.delivery_fee ?? 30;
    const total = subtotal + deliveryFee + totalGST;
    return { subtotal, deliveryFee, tax: totalGST, total };
  };

  const { subtotal, deliveryFee, tax, total } = getCartTotal();

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

        {/* ✅ Cart Summary with Delivery Fee and GST Breakdown */}
        {itemsInCart > 0 && (
          <View style={styles.cartSummaryContainer}>
            <View style={styles.cartSummaryHeader}>
              <Icon name="cart" size={20} color="#fc8019" />
              <Text style={styles.cartSummaryTitle}>Current Cart Summary</Text>
            </View>

            <View style={styles.cartSummaryRow}>
              <Text style={styles.cartSummaryLabel}>Subtotal</Text>
              <Text style={styles.cartSummaryValue}>₹{subtotal}</Text>
            </View>

            {/* ✅ GST Breakdown by rate */}
            {gstBreakdown && gstBreakdown.length > 0 ? (
              gstBreakdown.map((gst, index) => (
                <View key={index} style={styles.cartSummaryRow}>
                  <Text style={styles.cartSummaryLabel}>GST {gst.rate}%</Text>
                  <Text style={styles.cartSummaryValue}>₹{gst.amount}</Text>
                </View>
              ))
            ) : (
              <View style={styles.cartSummaryRow}>
                <Text style={styles.cartSummaryLabel}>Tax (GST 18%)</Text>
                <Text style={styles.cartSummaryValue}>₹{tax}</Text>
              </View>
            )}

            <View style={styles.cartSummaryRow}>
              <Text style={styles.cartSummaryLabel}>Delivery Fee</Text>
              <View style={styles.cartSummaryValueContainer}>
                {isCalculatingFee ? (
                  <ActivityIndicator size="small" color="#fc8019" />
                ) : (
                  <Text style={styles.cartSummaryValue}>₹{deliveryFee}</Text>
                )}
              </View>
            </View>

            {/* ✅ Distance breakdown if available */}
            {deliveryFeeData && !isCalculatingFee && (
              <View style={styles.distanceBreakdown}>
                <Text style={styles.distanceText}>
                  📍 Distance: {deliveryFeeData.distance_km?.toFixed(1) || 'N/A'} KM
                </Text>
                {deliveryFeeData.is_free_delivery ? (
                  <Text style={styles.freeDeliveryText}>
                    ✅ Free delivery within {deliveryFeeData.free_delivery_radius || 5} KM
                  </Text>
                ) : (
                  <Text style={styles.chargeableText}>
                    Charged for {deliveryFeeData.chargeable_distance_km || 0} KM beyond {deliveryFeeData.free_delivery_radius || 5} KM
                  </Text>
                )}
                <Text style={styles.perKmText}>
                  Rate: ₹{deliveryFeeData.per_km_charge || 2}/KM after free radius
                </Text>
              </View>
            )}

            <View style={[styles.cartSummaryRow, styles.cartTotalRow]}>
              <Text style={styles.cartTotalLabel}>Cart Total</Text>
              <Text style={styles.cartTotalValue}>₹{total}</Text>
            </View>
          </View>
        )}

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

  // ✅ Cart Summary Styles
  cartSummaryContainer: {
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
    borderLeftWidth: 4,
    borderLeftColor: '#fc8019',
  },
  cartSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  cartSummaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#282c3f',
    marginLeft: 10,
  },
  cartSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  cartSummaryLabel: {
    fontSize: 13,
    color: '#7e808c',
  },
  cartSummaryValue: {
    fontSize: 14,
    color: '#282c3f',
    fontWeight: '500',
  },
  cartSummaryValueContainer: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  cartTotalRow: {
    borderTopWidth: 2,
    borderTopColor: '#fc8019',
    paddingTop: 8,
    marginTop: 4,
    borderBottomWidth: 0,
  },
  cartTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#282c3f',
  },
  cartTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fc8019',
  },

  // ✅ Distance breakdown styles
  distanceBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  distanceText: {
    fontSize: 13,
    color: '#282c3f',
    fontWeight: '500',
  },
  freeDeliveryText: {
    fontSize: 13,
    color: '#28a745',
    fontWeight: '500',
    marginTop: 4,
  },
  chargeableText: {
    fontSize: 13,
    color: '#fc8019',
    fontWeight: '500',
    marginTop: 4,
  },
  perKmText: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 4,
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