import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { CartContext } from '../../context/CartContext';
import { OrderContext } from '../../context/OrderContext';
import { AuthContext } from '../../context/AuthContext';
import { AddressContext } from '../../context/AddressContext';

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutScreen({ navigation, route }: any) {
  // 🔥 CRITICAL: Get ALL cart data including loading state
  const { 
    cartItems, 
    clearCart, 
    isLoading: cartLoading, 
    refreshCart, 
    forceRefresh 
  } = useContext(CartContext);
  
  const { addOrder } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const { getDefaultAddress, addresses } = useContext(AddressContext);
  
  const [noContactDelivery, setNoContactDelivery] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('cash');
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [localCartItems, setLocalCartItems] = useState<any[]>([]);

  // 🔥 FIX: Load cart from AsyncStorage directly
  const loadCartDirectly = useCallback(async () => {
    try {
      console.log('🔄 Loading cart directly from AsyncStorage...');
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const savedCart = await AsyncStorage.getItem('cartItems');
      
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log('✅ Cart loaded from AsyncStorage:', parsed.length, 'items');
        console.log('📦 Cart data:', JSON.stringify(parsed, null, 2));
        setLocalCartItems(parsed);
        return parsed;
      } else {
        console.log('📦 No cart found in AsyncStorage');
        setLocalCartItems([]);
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to load cart:', error);
      setLocalCartItems([]);
      return [];
    }
  }, []);

  // 🔥 CRITICAL: Load cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      
      // First try to get from context
      if (cartItems && cartItems.length > 0) {
        console.log('✅ Cart from context:', cartItems.length, 'items');
        setLocalCartItems(cartItems);
        setIsLoading(false);
        return;
      }
      
      // If context is empty, load from AsyncStorage directly
      const saved = await loadCartDirectly();
      if (saved && saved.length > 0) {
        console.log('✅ Cart loaded from storage:', saved.length, 'items');
        setLocalCartItems(saved);
      } else {
        // Try force refresh
        console.log('🔄 Attempting force refresh...');
        try {
          await forceRefresh();
          // After force refresh, check again
          if (cartItems && cartItems.length > 0) {
            console.log('✅ Cart loaded after force refresh:', cartItems.length, 'items');
            setLocalCartItems(cartItems);
          } else {
            // Final attempt: load from AsyncStorage again
            const finalAttempt = await loadCartDirectly();
            if (finalAttempt && finalAttempt.length > 0) {
              console.log('✅ Cart loaded on final attempt:', finalAttempt.length, 'items');
              setLocalCartItems(finalAttempt);
            }
          }
        } catch (err) {
          console.error('❌ Force refresh failed:', err);
        }
      }
      
      setIsLoading(false);
    };

    initializeCart();
  }, []);

  // 🔥 FIX: Update local cart when context cart changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      console.log('🔄 Context cart updated:', cartItems.length, 'items');
      setLocalCartItems(cartItems);
    }
  }, [cartItems]);

  // Get selected address from route params or load default
  useEffect(() => {
    if (route.params?.selectedAddress) {
      setSelectedAddress(route.params.selectedAddress);
    } else {
      const defaultAddr = getDefaultAddress();
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    }
    if (route.params?.selectedPayment) {
      setSelectedPayment(route.params.selectedPayment);
    }
  }, [route.params?.selectedAddress, route.params?.selectedPayment, addresses]);

  // 🔥 FIX: Use localCartItems instead of cartItems for calculations
  const calculateItemTotal = useMemo(() => {
    console.log('🧮 Recalculating item total...');
    console.log('📦 localCartItems:', localCartItems);
    console.log('📦 localCartItems length:', localCartItems?.length);
    
    let total = 0;
    
    if (!localCartItems || localCartItems.length === 0) {
      console.log('⚠️ No items in localCartItems');
      return 0;
    }
    
    localCartItems.forEach((item: any, index: number) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 0;
      console.log(`📝 Item ${index + 1}: ${item.name}, Price: ${price}, Quantity: ${quantity}`);
      total += price * quantity;
    });
    
    console.log('💰 Item Total:', total);
    return total;
  }, [localCartItems]);

  // 🔥 FIX: Calculate billing data
  const billingData = useMemo(() => {
    const hasItems = localCartItems && localCartItems.length > 0;
    const itemTotal = calculateItemTotal || 0;
    
    console.log('📊 Calculating billing data...');
    console.log('📊 hasItems:', hasItems);
    console.log('📊 itemTotal:', itemTotal);
    console.log('📊 localCartItems length:', localCartItems?.length);
    
    return {
      hasItems,
      itemTotal,
      deliveryFee: hasItems ? 47 : 0,
      platformFee: hasItems ? 7 : 0,
      tax: hasItems ? Math.round(itemTotal * 0.05) : 0,
      total: hasItems ? itemTotal + 47 + 7 + Math.round(itemTotal * 0.05) : 0,
    };
  }, [localCartItems, calculateItemTotal]);

  const { hasItems, itemTotal, deliveryFee, platformFee, tax, total } = billingData;

  // 🔥 FIX: Pull to refresh - reload from storage
  const onRefresh = async () => {
    setRefreshing(true);
    console.log('🔄 Pull to refresh...');
    
    try {
      // Force refresh context
      await forceRefresh();
      
      // Also load directly from storage
      const saved = await loadCartDirectly();
      if (saved && saved.length > 0) {
        setLocalCartItems(saved);
      }
      
      console.log('✅ Refresh completed');
    } catch (err) {
      console.error('❌ Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // 🔥 FIX: Manual refresh
  const handleManualRefresh = async () => {
    console.log('🔄 Manual refresh...');
    setIsLoading(true);
    try {
      await forceRefresh();
      const saved = await loadCartDirectly();
      if (saved && saved.length > 0) {
        setLocalCartItems(saved);
      }
    } catch (err) {
      console.error('❌ Refresh failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please add a delivery address');
      return;
    }

    if (!localCartItems || localCartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add items to your cart first');
      return;
    }

    const order = {
      id: 'ORD' + Date.now().toString(36).toUpperCase(),
      restaurantName: localCartItems[0]?.restaurantName || 'QuickBite',
      items: localCartItems,
      total: total,
      status: 'Placed' as const,
      createdAt: new Date().toISOString(),
      deliveryAddress: selectedAddress,
      paymentMethod: selectedPayment,
    };

    addOrder(order);
    clearCart();
    setLocalCartItems([]);
    setIsOrderPlaced(true);

    Alert.alert(
      '🎉 Order Placed!',
      `Your order has been placed successfully!\n\nOrder ID: ${order.id}\nTotal: ₹${total}\nDelivery to: ${selectedAddress.address}`,
      [
        {
          text: 'Track Order',
          onPress: () => {
            navigation.navigate('OrderTracking', { orderId: order.id });
          }
        },
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Orders');
          }
        }
      ]
    );
  };

  const getAddressDisplay = () => {
    if (!selectedAddress) return 'Select delivery address';
    return `${selectedAddress.address}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;
  };

  const getPaymentDisplay = () => {
    switch (selectedPayment) {
      case 'card': return 'Credit/Debit Card';
      case 'upi': return 'UPI';
      case 'netbanking': return 'Net Banking';
      case 'wallet': return 'Wallet';
      case 'cash': return 'Cash on Delivery';
      default: return 'Select Payment Method';
    }
  };

  // 🔥 FIX: Show loading state
  if (isLoading || cartLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  }

  // Show empty cart message ONLY after order is placed
  if ((!localCartItems || localCartItems.length === 0) && isOrderPlaced) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="checkmark-circle" size={80} color={colors.success} />
          <Text style={styles.emptyTitle}>Order Placed!</Text>
          <Text style={styles.emptySubtitle}>Your order has been placed successfully</Text>
          <TouchableOpacity 
            style={styles.viewOrdersButton}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.viewOrdersText}>View My Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 🔥 FIX: Show empty cart message if cart is empty
  if (!localCartItems || localCartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Checkout</Text>
          <TouchableOpacity onPress={handleManualRefresh}>
            <Icon name="refresh-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color={colors.gray} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>Add items to your cart before checkout</Text>
          <TouchableOpacity 
            style={styles.viewOrdersButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.viewOrdersText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Secure Checkout</Text>
          <TouchableOpacity onPress={handleManualRefresh}>
            <Icon name="refresh-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 🔥 DEBUG: Show cart count */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            🛒 Items in cart: {localCartItems?.length || 0}
          </Text>
          <Text style={styles.debugText}>
            💰 Total: ₹{total}
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {user ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionSubtitle}>
                To place your order now, log in to your existing account or sign up.
              </Text>
              <View style={styles.accountButtons}>
                <TouchableOpacity 
                  style={styles.accountButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.accountButtonText}>LOG IN</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.accountButton, styles.signupButton]}
                  onPress={() => navigation.navigate('Signup')}
                >
                  <Text style={[styles.accountButtonText, styles.signupButtonText]}>
                    SIGN UP
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Address')}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.addressCard}
            onPress={() => navigation.navigate('Address')}
          >
            <Icon name="location-outline" size={20} color={colors.primary} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressType}>
                {selectedAddress?.type || 'Select Address'}
              </Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {getAddressDisplay()}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Payment', { totalAmount: total })}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.paymentCard}
            onPress={() => navigation.navigate('Payment', { totalAmount: total })}
          >
            <Icon name="card-outline" size={20} color={colors.primary} />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentMethod}>{getPaymentDisplay()}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        {/* Order Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.orderSummary}>
            {localCartItems && localCartItems.map((item: any) => {
              const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
              const itemQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 0;
              return (
                <View key={`${item.id}-${item.restaurantId}`} style={styles.orderItem}>
                  <Text style={styles.orderItemName}>
                    {item.name} × {itemQuantity}
                  </Text>
                  <Text style={styles.orderItemPrice}>₹{itemPrice * itemQuantity}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* No Contact Delivery */}
        <View style={styles.section}>
          <View style={styles.noContactContainer}>
            <View>
              <Text style={styles.noContactTitle}>Opt in for No-contact Delivery</Text>
              <Text style={styles.noContactSubtitle}>
                Unwell, or avoiding contact? Please select no-contact delivery.
              </Text>
            </View>
            <Switch
              value={noContactDelivery}
              onValueChange={setNoContactDelivery}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* 🔥 FIXED BILL DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billContainer}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Total</Text>
              <Text style={styles.billValue}>₹{itemTotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>₹{deliveryFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform Fee</Text>
              <Text style={styles.billValue}>₹{platformFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Tax (5%)</Text>
              <Text style={styles.billValue}>₹{tax}</Text>
            </View>
            <View style={[styles.billRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>TO PAY</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      {localCartItems && localCartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderText}>Place Order • ₹{total}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 12,
  },
  debugContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debugText: {
    fontSize: 12,
    color: colors.textLight,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  userInfo: {
    marginTop: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  accountButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  accountButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  accountButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: colors.lightGray,
  },
  signupButtonText: {
    color: colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  addressInfo: {
    flex: 1,
    marginLeft: 12,
  },
  addressType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  addressText: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentMethod: {
    fontSize: 14,
    color: colors.text,
  },
  orderSummary: {
    marginTop: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  orderItemName: {
    fontSize: 14,
    color: colors.text,
  },
  orderItemPrice: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  noContactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noContactTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  noContactSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  billContainer: {
    marginTop: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  billValue: {
    fontSize: 14,
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  placeOrderButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.success,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  viewOrdersButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  viewOrdersText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});