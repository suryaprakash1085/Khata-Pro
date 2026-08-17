import React, { useState, useContext } from 'react';

import {

  View,

  Text,

  ScrollView,

  TouchableOpacity,

  StyleSheet,

  SafeAreaView,

  StatusBar,

  Alert,

  ActivityIndicator,

  Platform,

  Modal,

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { CartContext } from '../../context/CartContext';

import { OrderContext } from '../../context/OrderContext';

import { AuthContext } from '../../context/AuthContext';

import { supabase } from '../../services/supabaseClient';

import { useCreatePublicSalesOrder } from '@workspace/api-client-react';
 
// ============================================================

// RAZORPAY

// ============================================================
 
let RazorpayCheckout: any = null;
 
if (Platform.OS !== 'web') {

  RazorpayCheckout = require('react-native-razorpay').default;

}
 
// ============================================================

// TYPES

// ============================================================
 
interface PaymentScreenProps {

  navigation: any;

  route: any;

}
 
// ============================================================

// GENERATE LOCAL ORDER ID

// ============================================================
 
const generateUniqueOrderId = () => {

  const timestamp = Date.now().toString(36).toUpperCase();

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `ORD-${timestamp}-${random}`;

};
 
// ============================================================

// SUCCESS MODAL

// ============================================================
 
const PaymentSuccessModal = ({

  visible,

  onClose,

  orderDetails,

  onViewOrders,

  onContinueShopping,

}: any) => {

  if (!visible) {

    return null;

  }
 
  return (
<Modal

      visible={visible}

      transparent={true}

      animationType="fade"

      onRequestClose={onClose}
>
<View style={styles.successOverlay}>
<View style={styles.successContainer}>

          {/* SUCCESS ICON */}
<View style={styles.successIconContainer}>
<Icon name="checkmark-circle" size={80} color="#28a745" />
</View>
 
          {/* TITLE */}
<Text style={styles.successTitle}>Order Successful! 🎉</Text>
<Text style={styles.successSubtitle}>

            Your order has been placed successfully
</Text>
 
          {/* DETAILS */}
<View style={styles.successDetails}>
<View style={styles.successRow}>
<Text style={styles.successLabel}>Order ID</Text>
<Text style={styles.successValue}>

                {orderDetails?.orderId || 'ORD-123456'}
</Text>
</View>
 
            <View style={styles.successRow}>
<Text style={styles.successLabel}>Payment Method</Text>
<Text style={styles.successValue}>

                {orderDetails?.paymentMethod || 'Cash on Delivery'}
</Text>
</View>
 
            <View style={styles.successRow}>
<Text style={styles.successLabel}>Total Amount</Text>
<Text style={[styles.successValue, styles.successTotal]}>

                ₹{orderDetails?.total || 0}
</Text>
</View>
 
            <View style={styles.successRow}>
<Text style={styles.successLabel}>Payment Status</Text>
<Text style={[styles.successValue, styles.successStatus]}>

                {orderDetails?.paymentStatus || 'Confirmed'}
</Text>
</View>
</View>
 
          {/* VIEW ORDERS */}
<TouchableOpacity style={styles.successButton} onPress={onViewOrders}>
<Text style={styles.successButtonText}>View My Orders</Text>
</TouchableOpacity>
 
          {/* CONTINUE SHOPPING */}
<TouchableOpacity

            style={styles.successButtonSecondary}

            onPress={onContinueShopping}
>
<Text style={styles.successButtonSecondaryText}>

              Continue Shopping
</Text>
</TouchableOpacity>
</View>
</View>
</Modal>

  );

};
 
// ============================================================

// PAYMENT SCREEN

// ============================================================
 
const PaymentScreen: React.FC<PaymentScreenProps> = ({

  navigation,

  route,

}) => {

  // ==========================================================

  // ROUTE PARAMS

  // ==========================================================
 
  const {

    totalAmount,

    restaurantName,

    cartItems,

    address,

    deliveryFee = 40,

    tax = 0,

    subtotal = 0,

  } = route.params || {};
 
  // ==========================================================

  // CONTEXTS

  // ==========================================================
 
  const { clearCart } = useContext(CartContext);

  const { addOrder } = useContext(OrderContext);

  const { user } = useContext(AuthContext);
 
  // ==========================================================

  // API - SINGLE DECLARATION (FIXED)

  // ==========================================================
 
  const createSalesOrder = useCreatePublicSalesOrder();
 
  // ==========================================================

  // STATE - SINGLE DECLARATION (FIXED)

  // ==========================================================
 
  const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [orderDetails, setOrderDetails] = useState<any>(null);
 
  // ==========================================================

  // CALCULATE TAX IF NOT PROVIDED

  // ==========================================================
 
  const calculateTax = (subtotalAmount: number) => {

    // GST 18%

    return Math.round((subtotalAmount * 18) / 100);

  };
 
  // Use provided values or calculate defaults

  const finalSubtotal = subtotal > 0 ? subtotal : totalAmount - deliveryFee - tax;

  const finalTax = tax > 0 ? tax : calculateTax(finalSubtotal);

  const finalDeliveryFee = deliveryFee > 0 ? deliveryFee : 40;
 
  // Recalculate total to ensure accuracy

  const calculatedTotal = finalSubtotal + finalDeliveryFee + finalTax;

  const displayTotal = totalAmount > 0 ? totalAmount : calculatedTotal;
 
  // ==========================================================

  // PAYMENT METHODS

  // ==========================================================
 
  const paymentMethods = [

    {

      id: 'razorpay',

      icon: 'card-outline',

      name: 'Razorpay',

      description: 'UPI, Cards, Net Banking • Instant',

      color: '#fc8019',

      bg: '#fff5ec',

    },

    {

      id: 'cash',

      icon: 'cash-outline',

      name: 'Cash on Delivery',

      description: 'Pay when you receive • No extra charge',

      color: '#28a745',

      bg: '#d4edda',

    },

  ];
 
  // ==========================================================

  // SELECT PAYMENT METHOD

  // ==========================================================
 
  const handleSelectMethod = (methodId: string) => {

    setSelectedMethod(methodId);

    console.log('✅ Selected payment method:', methodId);

  };
 
  // ==========================================================

  // RECORD TRANSACTION

  // ==========================================================
 
  const recordTransaction = async (

    orderId: string,

    paymentMethod: 'Razorpay' | 'Cash on Delivery'

  ) => {

    if (!user?.business_id || !user?.id) {

      console.log('⚠️ Missing business_id or user id — skipped transaction record');

      return;

    }
 
    const itemDescription =

      cartItems?.map((item: any) => `${item.name} x${item.quantity}`).join(', ') ||

      'Order';
 
    const paymentMode = paymentMethod === 'Razorpay' ? 'online' : 'cash';

    const transactionType = paymentMethod === 'Razorpay' ? 'you_got' : 'you_gave';
 
    const { data, error } = await supabase

      .from('transactions')

      .insert([

        {

          business_id: user.business_id,

          customer_id: user.id,

          type: transactionType,

          amount: displayTotal,

          balance_after: displayTotal,

          description: `${itemDescription} (Order ${orderId})`,

          payment_mode: paymentMode,

          entry_date: new Date().toISOString().split('T')[0],

          created_by: user.id,

          is_deleted: false,

        },

      ])

      .select();
 
    if (error) {

      console.error('❌ Failed to record transaction:', error);

    } else if (!data || data.length === 0) {

      console.warn('⚠️ Transaction insert returned no row');

    } else {

      console.log('✅ Transaction recorded:', data);

    }

  };
 
  // ==========================================================

  // CREATE SALES ORDER - SINGLE DECLARATION (FIXED)

  // ==========================================================
 
  const placeOrderOnBackend = async () => {

    if (!user?.business_id || !user?.id || !address) {

      throw new Error('Missing business, customer, or address details.');

    }

    if (!cartItems || cartItems.length === 0) {

      throw new Error('Cart is empty.');

    }
 
    const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;
 
    // Convert product_id to number

    const formattedItems = cartItems.map((item: any) => ({

      product_id: Number(item.id),

      qty: Number(item.quantity),

      unit_price: Number(item.price),

    }));
 
    console.log('📦 Sales order items:', formattedItems);
 
    const payload = {

      business_id: Number(user.business_id),

      customer_id: Number(user.id),

      channel: 'online',

      shipping_address: fullAddress,

      description:

        cartItems.map((item: any) => `${item.name} x${item.quantity}`).join(', ') ||

        'Order',

      tax: finalTax,

      items: formattedItems,

    };
 
    console.log('🚀 Creating sales order:', JSON.stringify(payload, null, 2));
 
    const salesOrder = await createSalesOrder.mutateAsync({

      data: payload,

    });
 
    console.log('✅ Sales order created:', salesOrder);

    return salesOrder;

  };
 
  // ==========================================================

  // PAY BUTTON

  // ==========================================================
 
  const handlePayNow = () => {

    if (selectedMethod === 'razorpay') {

      handleRazorpayPayment();

    } else if (selectedMethod === 'cash') {

      handleCashOnDelivery();

    }

  };
 
  // ==========================================================

  // RAZORPAY PAYMENT

  // ==========================================================
 
  const handleRazorpayPayment = async () => {

    setIsProcessing(true);
 
    try {

      // WEB

      if (Platform.OS === 'web') {

        const win = window as any;
 
        if (!win.Razorpay) {

          const script = document.createElement('script');

          script.src = 'https://checkout.razorpay.com/v1/checkout.js';

          script.async = true;

          script.onload = () => {

            openRazorpayWeb();

          };

          script.onerror = () => {

            setIsProcessing(false);

            Alert.alert('Payment Error', 'Unable to load Razorpay.');

          };

          document.body.appendChild(script);

        } else {

          openRazorpayWeb();

        }

        return;

      }
 
      // MOBILE

      if (!RazorpayCheckout) {

        throw new Error('Razorpay is not available.');

      }
 
      // FIXED: Use type assertion for mobileNumber

      const userPhone = (user as any)?.mobileNumber || address?.phone || '9876543210';
 
      const options = {

        description: 'Order Payment',

        image: 'https://your-logo-url.com/logo.png',

        currency: 'INR',

        key: 'rzp_test_TLzyiBcmji4cvD',

        amount: Math.round(Number(displayTotal) * 100),

        name: 'QuickBite',

        prefill: {

          email: user?.email || 'customer@example.com',

          contact: userPhone,

          name: user?.name || address?.name || 'Customer',

        },

        theme: {

          color: '#fc8019',

        },

      };
 
      RazorpayCheckout.open(options)

        .then((data: any) => {

          console.log('✅ Payment success:', data);

          handlePaymentSuccess(data);

        })

        .catch((error: any) => {

          console.error('❌ Payment error:', error);

          setIsProcessing(false);

          Alert.alert(

            'Payment Failed',

            error?.description || 'Something went wrong. Please try again.'

          );

        });

    } catch (error: any) {

      console.error('❌ Razorpay initialization error:', error);

      setIsProcessing(false);

      Alert.alert('Error', error?.message || 'Failed to initialize payment.');

    }

  };
 
  // ==========================================================

  // WEB RAZORPAY

  // ==========================================================
 
  const openRazorpayWeb = () => {

    const win = window as any;

    // FIXED: Use type assertion for mobileNumber

    const userPhone = (user as any)?.mobileNumber || address?.phone || '9876543210';
 
    const options = {

      description: 'Order Payment',

      image: 'https://your-logo-url.com/logo.png',

      currency: 'INR',

      key: 'rzp_test_TLzyiBcmji4cvD',

      amount: Math.round(Number(displayTotal) * 100),

      name: 'QuickBite',

      prefill: {

        email: user?.email || 'customer@example.com',

        contact: userPhone,

        name: user?.name || address?.name || 'Customer',

      },

      theme: {

        color: '#fc8019',

      },

      modal: {

        ondismiss: function () {

          setIsProcessing(false);

          Alert.alert('Payment Cancelled', 'You cancelled the payment');

        },

      },

      handler: function (response: any) {

        handlePaymentSuccess(response);

      },

    };
 
    const rzp = new win.Razorpay(options);

    rzp.open();

  };
 
  // ==========================================================

  // RAZORPAY SUCCESS

  // ==========================================================
 
  const handlePaymentSuccess = async (data: any) => {

    const localOrderId = generateUniqueOrderId();
 
    try {

      const salesOrder = await placeOrderOnBackend();
 
      addOrder({

        id: localOrderId,

        restaurantName: restaurantName || 'QuickBite',

        items:

          cartItems?.map((item: any) => ({

            name: item.name,

            quantity: item.quantity,

            price: item.price,

          })) || [],

        total: displayTotal || 0,

        status: 'Placed',

        createdAt: new Date().toISOString(),

      });
 
      clearCart();

      await recordTransaction(localOrderId, 'Razorpay');
 
      setIsProcessing(false);

      setOrderDetails({

        orderId: `ORD-MS${salesOrder.id}`,

        total: displayTotal,

        items: cartItems,

        paymentMethod: 'Razorpay',

        paymentStatus: 'Paid',

      });

      setShowSuccessModal(true);

    } catch (err: any) {

      console.error('❌ Failed to create sales order:', err);

      setIsProcessing(false);

      Alert.alert(

        'Order Failed',

        err?.message || 'Could not place your order. Please try again.'

      );

    }

  };
 
  // ==========================================================

  // CASH ON DELIVERY

  // ==========================================================
 
  const handleCashOnDelivery = async () => {

    setIsProcessing(true);

    const localOrderId = generateUniqueOrderId();
 
    try {

      console.log('💵 Cash on Delivery selected');

      const salesOrder = await placeOrderOnBackend();

      console.log('✅ COD sales order created:', salesOrder);
 
      addOrder({

        id: localOrderId,

        restaurantName: restaurantName || 'QuickBite',

        items:

          cartItems?.map((item: any) => ({

            name: item.name,

            quantity: item.quantity,

            price: item.price,

          })) || [],

        total: displayTotal || 0,

        status: 'Placed',

        createdAt: new Date().toISOString(),

      });
 
      clearCart();

      await recordTransaction(localOrderId, 'Cash on Delivery');
 
      setOrderDetails({

        orderId: `ORD-MS${salesOrder.id}`,

        total: displayTotal,

        items: cartItems,

        paymentMethod: 'Cash on Delivery',

        paymentStatus: 'Confirmed',

      });

      setShowSuccessModal(true);

    } catch (err: any) {

      console.error('❌ Failed to create COD sales order:', err);

      Alert.alert(

        'Order Failed',

        err?.message || 'Could not place your order. Please try again.'

      );

    } finally {

      setIsProcessing(false);

    }

  };
 
  // ==========================================================

  // VIEW ORDERS

  // ==========================================================
 
  const handleViewOrders = () => {

    setShowSuccessModal(false);

    setOrderDetails(null);

    navigation.navigate('Orders');

  };
 
  // ==========================================================

  // CONTINUE SHOPPING

  // ==========================================================
 
  const handleContinueShopping = () => {

    setShowSuccessModal(false);

    setOrderDetails(null);

    navigation.navigate('Home');

  };
 
  // ==========================================================

  // NO AMOUNT

  // ==========================================================
 
  if (!displayTotal || displayTotal === 0) {

    return (
<SafeAreaView style={styles.container}>
<View style={styles.centerContent}>
<Icon name="alert-circle-outline" size={60} color="#dc3545" />
<Text style={styles.errorText}>No amount specified</Text>
<TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
<Text style={styles.goBackButtonText}>Go Back</Text>
</TouchableOpacity>
</View>
</SafeAreaView>

    );

  }
 
  // ==========================================================

  // UI

  // ==========================================================
 
  return (
<SafeAreaView style={styles.container}>
<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
 
      {/* HEADER */}
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
<Icon name="arrow-back" size={24} color="#282c3f" />
</TouchableOpacity>
<Text style={styles.headerTitle}>Payment</Text>
<View style={{ width: 40 }} />
</View>
 
      {/* CONTENT */}
<ScrollView

        showsVerticalScrollIndicator={false}

        contentContainerStyle={styles.scrollContent}
>

        {/* DELIVERY ADDRESS */}

        {address && (
<View style={styles.addressSection}>
<Text style={styles.addressTitle}>Delivery Address</Text>
<View style={styles.addressCard}>
<Text style={styles.addressName}>{address.name || 'Customer'}</Text>
<Text style={styles.addressDetail}>{address.address}</Text>

              {address.landmark && (
<Text style={styles.addressDetail}>📍 {address.landmark}</Text>

              )}
<Text style={styles.addressDetail}>

                {address.city}, {address.state || ''} - {address.pincode}
</Text>
<Text style={styles.addressPhone}>📞 {address.phone || 'Not provided'}</Text>
</View>
</View>

        )}
 
        {/* AMOUNT */}
<View style={styles.amountCard}>
<View style={styles.amountRow}>
<Text style={styles.amountLabel}>Amount to Pay</Text>
<View style={styles.secureBadgeSmall}>
<Icon name="lock-closed" size={12} color="#ffffff" />
<Text style={styles.secureBadgeSmallText}>Secure</Text>
</View>
</View>
<Text style={styles.amountValue}>₹{displayTotal}</Text>
<Text style={styles.amountSubtext}>Including all taxes & fees</Text>
</View>
 
        {/* PAYMENT METHODS */}
<Text style={styles.sectionTitle}>Choose Payment Method</Text>
 
        {paymentMethods.map((method) => (
<TouchableOpacity

            key={method.id}

            style={[

              styles.methodItem,

              selectedMethod === method.id && styles.methodSelected,

            ]}

            onPress={() => handleSelectMethod(method.id)}

            disabled={isProcessing}
>
<View style={styles.methodLeft}>
<View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
<Icon name={method.icon} size={22} color={method.color} />
</View>
<View style={styles.methodInfo}>
<Text style={[styles.methodName, selectedMethod === method.id && styles.methodNameSelected]}>

                  {method.name}
</Text>
<Text style={styles.methodDescription}>{method.description}</Text>
</View>
</View>
 
            {selectedMethod === method.id && (
<View style={styles.checkmark}>
<Icon name="checkmark-circle" size={24} color="#28a745" />
</View>

            )}
</TouchableOpacity>

        ))}
 
        {/* ORDER SUMMARY */}
<View style={styles.summaryCard}>
<Text style={styles.summaryTitle}>Order Summary</Text>
 
          <View style={styles.summaryRow}>
<Text style={styles.summaryLabel}>Item Total</Text>
<Text style={styles.summaryValue}>₹{finalSubtotal}</Text>
</View>
 
          <View style={styles.summaryRow}>
<Text style={styles.summaryLabel}>Delivery Fee</Text>
<Text style={styles.summaryValue}>₹{finalDeliveryFee}</Text>
</View>
 
          <View style={styles.summaryRow}>
<Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
<Text style={styles.summaryValue}>₹{finalTax}</Text>
</View>
 
          <View style={styles.summaryDivider} />
 
          <View style={styles.summaryRow}>
<Text style={styles.summaryTotalLabel}>Total</Text>
<Text style={styles.summaryTotalValue}>₹{displayTotal}</Text>
</View>
</View>
 
        <View style={styles.footerSpacer} />
</ScrollView>
 
      {/* PAY BUTTON */}
<View style={styles.payButtonContainer}>
<TouchableOpacity

          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}

          onPress={handlePayNow}

          disabled={isProcessing}
>

          {isProcessing ? (
<ActivityIndicator size="small" color="#ffffff" />

          ) : (
<Text style={styles.payButtonText}>

              {selectedMethod === 'cash'

                ? `Place Order ₹${displayTotal}`

                : `Pay ₹${displayTotal}`}
</Text>

          )}
</TouchableOpacity>
</View>
 
      {/* LOADING */}

      {isProcessing && (
<View style={styles.loadingOverlay}>
<View style={styles.loadingContainer}>
<ActivityIndicator size="large" color="#fc8019" />
<Text style={styles.loadingText}>Processing Order...</Text>
<Text style={styles.loadingSubtext}>

              Please wait, do not close the app
</Text>
</View>
</View>

      )}
 
      {/* SUCCESS MODAL */}
<PaymentSuccessModal

        visible={showSuccessModal}

        onClose={() => setShowSuccessModal(false)}

        orderDetails={orderDetails}

        onViewOrders={handleViewOrders}

        onContinueShopping={handleContinueShopping}

      />
</SafeAreaView>

  );

};
 
// ============================================================

// STYLES

// ============================================================
 
const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#f5f5f5',

  },
 
  centerContent: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    padding: 20,

  },
 
  errorText: {

    fontSize: 18,

    fontWeight: '600',

    color: '#282c3f',

    marginTop: 16,

  },
 
  goBackButton: {

    backgroundColor: '#fc8019',

    paddingHorizontal: 32,

    paddingVertical: 12,

    borderRadius: 8,

    marginTop: 16,

  },
 
  goBackButtonText: {

    color: '#ffffff',

    fontSize: 16,

    fontWeight: '600',

  },
 
  // HEADER

  header: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 16,

    paddingTop: 12,

    paddingBottom: 16,

    backgroundColor: '#ffffff',

    borderBottomWidth: 1,

    borderBottomColor: '#f0f0f5',

  },
 
  backButton: {

    padding: 4,

  },
 
  headerTitle: {

    fontSize: 18,

    fontWeight: '600',

    color: '#282c3f',

  },
 
  scrollContent: {

    paddingBottom: 100,

  },
 
  // ADDRESS

  addressSection: {

    backgroundColor: '#ffffff',

    marginHorizontal: 16,

    marginTop: 16,

    padding: 16,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: '#e8e8e8',

  },
 
  addressTitle: {

    fontSize: 14,

    fontWeight: '600',

    color: '#282c3f',

    marginBottom: 8,

  },
 
  addressCard: {

    backgroundColor: '#f8f9fa',

    borderRadius: 8,

    padding: 12,

  },
 
  addressName: {

    fontSize: 15,

    fontWeight: '600',

    color: '#282c3f',

  },
 
  addressDetail: {

    fontSize: 14,

    color: '#757575',

    marginTop: 2,

  },
 
  addressPhone: {

    fontSize: 14,

    color: '#757575',

    marginTop: 4,

  },
 
  // AMOUNT

  amountCard: {

    backgroundColor: '#fc8019',

    marginHorizontal: 16,

    marginTop: 16,

    padding: 20,

    borderRadius: 16,

    shadowColor: '#fc8019',

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.3,

    shadowRadius: 8,

    elevation: 6,

  },
 
  amountRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },
 
  amountLabel: {

    fontSize: 14,

    color: '#ffffff',

    opacity: 0.9,

    fontWeight: '500',

  },
 
  amountValue: {

    fontSize: 36,

    fontWeight: '700',

    color: '#ffffff',

    marginTop: 4,

  },
 
  amountSubtext: {

    fontSize: 12,

    color: '#ffffff',

    opacity: 0.7,

    marginTop: 4,

  },
 
  secureBadgeSmall: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.2)',

    paddingHorizontal: 10,

    paddingVertical: 4,

    borderRadius: 12,

  },
 
  secureBadgeSmallText: {

    fontSize: 11,

    color: '#ffffff',

    marginLeft: 4,

    fontWeight: '500',

  },
 
  // SECTION

  sectionTitle: {

    fontSize: 16,

    fontWeight: '600',

    color: '#282c3f',

    marginHorizontal: 16,

    marginTop: 24,

    marginBottom: 12,

  },
 
  // PAYMENT METHODS

  methodItem: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    backgroundColor: '#ffffff',

    marginHorizontal: 16,

    marginBottom: 8,

    padding: 14,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: '#f0f0f5',

  },
 
  methodSelected: {

    borderColor: '#fc8019',

    backgroundColor: '#fff5ec',

  },
 
  methodLeft: {

    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,

  },
 
  methodIcon: {

    width: 44,

    height: 44,

    borderRadius: 22,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 14,

  },
 
  methodInfo: {

    flex: 1,

  },
 
  methodName: {

    fontSize: 15,

    fontWeight: '500',

    color: '#282c3f',

  },
 
  methodNameSelected: {

    color: '#fc8019',

  },
 
  methodDescription: {

    fontSize: 12,

    color: '#7e808c',

    marginTop: 2,

  },
 
  checkmark: {

    marginLeft: 8,

  },
 
  // SUMMARY

  summaryCard: {

    backgroundColor: '#ffffff',

    marginHorizontal: 16,

    marginTop: 16,

    padding: 16,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: '#f0f0f5',

  },
 
  summaryTitle: {

    fontSize: 14,

    fontWeight: '600',

    color: '#282c3f',

    marginBottom: 12,

  },
 
  summaryRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    paddingVertical: 4,

  },
 
  summaryLabel: {

    fontSize: 13,

    color: '#7e808c',

  },
 
  summaryValue: {

    fontSize: 13,

    color: '#282c3f',

  },
 
  summaryDivider: {

    height: 1,

    backgroundColor: '#f0f0f5',

    marginVertical: 8,

  },
 
  summaryTotalLabel: {

    fontSize: 15,

    fontWeight: '600',

    color: '#282c3f',

  },
 
  summaryTotalValue: {

    fontSize: 15,

    fontWeight: '700',

    color: '#fc8019',

  },
 
  footerSpacer: {

    height: 20,

  },
 
  // PAY BUTTON

  payButtonContainer: {

    position: 'absolute',

    bottom: 0,

    left: 0,

    right: 0,

    backgroundColor: '#ffffff',

    paddingHorizontal: 16,

    paddingVertical: 12,

    borderTopWidth: 1,

    borderTopColor: '#f0f0f5',

    elevation: 4,

  },
 
  payButton: {

    backgroundColor: '#fc8019',

    paddingVertical: 14,

    borderRadius: 12,

    alignItems: 'center',

  },
 
  payButtonDisabled: {

    backgroundColor: '#ccc',

  },
 
  payButtonText: {

    color: '#ffffff',

    fontSize: 16,

    fontWeight: '600',

  },
 
  // LOADING

  loadingOverlay: {

    position: 'absolute',

    top: 0,

    left: 0,

    right: 0,

    bottom: 0,

    backgroundColor: 'rgba(0,0,0,0.7)',

    justifyContent: 'center',

    alignItems: 'center',

  },
 
  loadingContainer: {

    backgroundColor: '#ffffff',

    padding: 30,

    borderRadius: 16,

    alignItems: 'center',

    minWidth: 200,

  },
 
  loadingText: {

    fontSize: 16,

    fontWeight: '600',

    color: '#282c3f',

    marginTop: 12,

  },
 
  loadingSubtext: {

    fontSize: 12,

    color: '#7e808c',

    marginTop: 4,

  },
 
  // SUCCESS MODAL

  successOverlay: {

    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.6)',

    justifyContent: 'center',

    alignItems: 'center',

  },
 
  successContainer: {

    backgroundColor: '#ffffff',

    borderRadius: 24,

    padding: 30,

    width: '90%',

    maxWidth: 400,

    alignItems: 'center',

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.2,

    shadowRadius: 8,

    elevation: 5,

  },
 
  successIconContainer: {

    width: 100,

    height: 100,

    borderRadius: 50,

    backgroundColor: '#e8f5e9',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 16,

  },
 
  successTitle: {

    fontSize: 24,

    fontWeight: 'bold',

    color: '#282c3f',

    marginBottom: 8,

    textAlign: 'center',

  },
 
  successSubtitle: {

    fontSize: 14,

    color: '#7e808c',

    marginBottom: 20,

    textAlign: 'center',

  },
 
  successDetails: {

    width: '100%',

    backgroundColor: '#f8f9fa',

    borderRadius: 12,

    padding: 16,

    marginBottom: 20,

  },
 
  successRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    paddingVertical: 6,

    borderBottomWidth: 1,

    borderBottomColor: '#e9ecef',

  },
 
  successLabel: {

    fontSize: 14,

    color: '#7e808c',

  },
 
  successValue: {

    fontSize: 14,

    color: '#282c3f',

    fontWeight: '500',

  },
 
  successTotal: {

    color: '#fc8019',

    fontWeight: '700',

    fontSize: 16,

  },
 
  successStatus: {

    color: '#28a745',

    fontWeight: '600',

  },
 
  successButton: {

    backgroundColor: '#fc8019',

    borderRadius: 12,

    paddingVertical: 14,

    paddingHorizontal: 40,

    width: '100%',

    alignItems: 'center',

    marginBottom: 10,

  },
 
  successButtonText: {

    color: '#ffffff',

    fontSize: 16,

    fontWeight: '600',

  },
 
  successButtonSecondary: {

    borderRadius: 12,

    paddingVertical: 12,

    paddingHorizontal: 40,

    width: '100%',

    alignItems: 'center',

    borderWidth: 1,

    borderColor: '#fc8019',

  },
 
  successButtonSecondaryText: {

    color: '#fc8019',

    fontSize: 16,

    fontWeight: '500',

  },

});
 
export default PaymentScreen;
 