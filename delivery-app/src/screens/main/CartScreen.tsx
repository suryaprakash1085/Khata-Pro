import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { API_URL } from '@env';

// ✅ Import Razorpay with proper error handling
let RazorpayCheckout: any = null;
if (Platform.OS !== 'web') {
  RazorpayCheckout = require('react-native-razorpay').default;
}

import { CartContext } from '../../context/CartContext';
import { OrderContext } from '../../context/OrderContext';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';
import paymentService from '../../services/paymentService';

interface CartScreenProps {
  navigation: any;
}

// ✅ Payment Success Modal for Cash on Delivery ONLY
const PaymentSuccessModal = ({ visible, onClose, orderDetails, onViewOrders, onContinueShopping }: any) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.successOverlay}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Icon name="checkmark-circle" size={80} color="#28a745" />
          </View>
          <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
          <Text style={styles.successSubtitle}>Your order has been placed successfully</Text>
          
          <View style={styles.successDetails}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Order ID</Text>
              <Text style={styles.successValue}>{orderDetails?.orderId || 'ORD-123456'}</Text>
            </View>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Payment Method</Text>
              <Text style={styles.successValue}>{orderDetails?.paymentMethod || 'Cash on Delivery'}</Text>
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

          <TouchableOpacity
            style={styles.successButton}
            onPress={onViewOrders}
          >
            <Text style={styles.successButtonText}>View My Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.successButtonSecondary}
            onPress={onContinueShopping}
          >
            <Text style={styles.successButtonSecondaryText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ✅ Order Summary Modal Component
const OrderSummaryModal = ({ visible, onClose, subtotal, deliveryFee, tax, total }: any) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Summary</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Icon name="close" size={24} color="#282c3f" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalSummaryContainer}>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Subtotal</Text>
              <Text style={styles.modalSummaryValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Delivery Fee</Text>
              <Text style={styles.modalSummaryValue}>₹{deliveryFee}</Text>
            </View>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Tax (GST 18%)</Text>
              <Text style={styles.modalSummaryValue}>₹{tax}</Text>
            </View>
            <View style={[styles.modalSummaryRow, styles.modalTotalRow]}>
              <Text style={styles.modalTotalLabel}>Total</Text>
              <Text style={styles.modalTotalValue}>₹{total}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.modalCloseButtonFull} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getTotalItems, 
    clearCart,
    addToCart
  } = useContext(CartContext);
  
  const { addOrder } = useContext(OrderContext);
  const { selectedBusiness } = useContext(SelectedBusinessContext);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);
  
  // ✅ State for COD Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // ✅ State for Order Summary Modal
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  // ✅ State for delivery fee calculation
  const [deliveryDistance, setDeliveryDistance] = useState<number>(0);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

  // ✅ State for Recommended Products
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(true);

  // ✅ Fetch recommendations when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchRecommendations();
    } else {
      setRecommendedProducts([]);
    }
  }, [cartItems]);

  // ✅ Fetch recommended products based on cart items
  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      
      const productIds = cartItems.map(item => parseInt(item.id, 10)).filter(id => !isNaN(id));
      
      if (productIds.length === 0) {
        setRecommendedProducts([]);
        setLoadingRecommendations(false);
        return;
      }

      const response = await axios.get(`${API_URL}/public/products/suggestions`, {
        params: {
          product_ids: productIds.join(',')
        }
      });

      let recommendations: any[] = [];
      if (Array.isArray(response.data)) {
        recommendations = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        recommendations = response.data.data;
      }

      const cartIds = new Set(cartItems.map(item => String(item.id)));
      const filtered = recommendations.filter(p => !cartIds.has(String(p.id)));
      
      setRecommendedProducts(filtered);
      
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    console.log('🔍 Platform:', Platform.OS);

    if (Platform.OS === 'web') {
      const existingScript = document.getElementById('razorpay-checkout-script');
      if (existingScript) {
        setIsRazorpayReady(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'razorpay-checkout-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Razorpay web script loaded');
        setIsRazorpayReady(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay web script');
        setIsRazorpayReady(false);
      };
      document.body.appendChild(script);
      return;
    }

    if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
      console.warn('⚠️ RazorpayCheckout is not available');
      setIsRazorpayReady(false);
    } else {
      console.log('✅ RazorpayCheckout is ready');
      setIsRazorpayReady(true);
    }
  }, []);

  // ✅ Calculate delivery fee - ORIGINAL WORKING LOGIC
  const calculateDeliveryFee = (distance: number = 0, isPremium: boolean = false) => {
    let fee = 0;
    const BASE_FEE = 30;
    
    // Simple flat fee - no distance calculation
    fee = BASE_FEE;
    
    // Peak hour surcharge
    const currentHour = new Date().getHours();
    if ((currentHour >= 12 && currentHour <= 14) || (currentHour >= 19 && currentHour <= 22)) {
      fee += 15;
    }
    
    // Weekend surcharge
    const currentDay = new Date().getDay();
    if (currentDay === 0 || currentDay === 6) {
      fee += 10;
    }
    
    // Premium user discount
    if (isPremium) {
      fee = Math.round(fee * 0.5);
    }
    
    // Minimum fee
    fee = Math.max(fee, 25);
    return Math.round(fee);
  };

  // ✅ Calculate total
  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const deliveryFee = calculateDeliveryFee(deliveryDistance, isPremiumUser);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + deliveryFee + tax;
    return { subtotal, tax, deliveryFee, total };
  };

  const handleUpdateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.id, item.restaurantId);
    } else {
      updateQuantity(item.id, item.restaurantId, newQuantity);
    }
  };

  const handleRemoveItem = (item: any) => {
    removeFromCart(item.id, item.restaurantId);
    console.log('🗑️ Item removed from cart:', item.name);
  };

  // ✅ Add product to cart from recommended products
  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.selling_price || product.price || 0,
      quantity: 1,
      image: product.image || 'https://placehold.co/150x150',
      restaurantId: product.id,
      restaurantName: product.name,
    };

    const restaurantData = {
      id: product.id,
      name: product.name,
      rating: 4.5,
      deliveryTime: 'In Stock',
      cuisine: product.category || 'General',
      image: product.image || 'https://placehold.co/150x150',
      costForTwo: `₹${product.selling_price || product.price || 0}`,
      address: product.description || 'Available in stock',
      isVeg: true,
      offer: `Stock: ${product.stock_qty || 0} units`,
      productData: {
        id: product.id,
        price: product.selling_price || product.price || 0,
        stock: product.stock_qty || 0,
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
      },
    };

    addToCart(cartItem, restaurantData);
    console.log('✅ Added to cart:', product.name);
  };

  // ✅ Check if item is in cart
  const isItemInCart = (productId: string) => {
    return cartItems.some(item => item.id === String(productId));
  };

  // ✅ Get item quantity in cart
  const getItemQuantity = (productId: string) => {
    const item = cartItems.find(cartItem => cartItem.id === String(productId));
    return item ? item.quantity : 0;
  };

  // ✅ Handle Cash on Delivery
  const handleCashOnDelivery = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    const { total } = calculateTotal();
    const orderId = 'ORD-' + Date.now().toString().slice(-6);

    const newOrder = {
      id: orderId,
      restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total,
      status: 'Placed' as const,
      createdAt: new Date().toISOString(),
    };
    
    addOrder(newOrder);
    console.log('✅ Order added (COD):', newOrder);

    setOrderDetails({
      orderId: orderId,
      total: total,
      items: cartItems,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Confirmed',
    });
    setShowSuccessModal(true);
    clearCart();
  };

  const handleViewOrders = () => {
    setShowSuccessModal(false);
    setOrderDetails(null);
    navigation.navigate('Orders');
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    setOrderDetails(null);
    navigation.navigate('Home');
  };

  // ✅ Handle Razorpay Payment
  const handleRazorpayPayment = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    if (!isRazorpayReady) {
      Alert.alert(
        'Payment Error',
        'Razorpay is not ready yet. Please wait a moment and try again, or use Cash on Delivery.',
        [
          { text: 'OK' },
          { text: 'Use Cash on Delivery', onPress: handleCashOnDelivery },
        ]
      );
      return;
    }

    setIsProcessing(true);
    const { total } = calculateTotal();

    try {
      const orderResponse = await paymentService.createOrder(total, 'INR');
      console.log('📦 Order response:', orderResponse);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const { order, key } = orderResponse;
      const amount = typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount;

      const options: any = {
        description: 'QuickBite Order Payment',
        image: 'https://your-logo-url.com/logo.png',
        currency: order.currency || 'INR',
        key: key,
        amount: amount,
        name: 'QuickBite',
        order_id: order.id,
        prefill: {
          email: 'customer@example.com',
          contact: '9876543210',
          name: 'Customer Name',
        },
        theme: { color: '#fc8019' },
      };

      console.log('💳 Opening Razorpay with options:', options);

      const handlePaymentSuccess = async (response: any) => {
        try {
          const verifyResponse = await paymentService.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            'ORD-' + Date.now().toString().slice(-6)
          );

          setIsProcessing(false);

          if (verifyResponse.success) {
            const newOrder = {
              id: response.razorpay_order_id || 'ORD-' + Date.now().toString().slice(-6),
              restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
              items: cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              total: total,
              status: 'Placed' as const,
              createdAt: new Date().toISOString(),
            };
            
            addOrder(newOrder);
            console.log('✅ Order added (Razorpay):', newOrder);

            Alert.alert(
              'Payment Successful! 🎉',
              `Payment ID: ${response.razorpay_payment_id}`,
              [
                {
                  text: 'View Order',
                  onPress: () => {
                    navigation.navigate('OrderTracking', {
                      orderId: response.razorpay_order_id,
                      total: total,
                      items: cartItems,
                      paymentMethod: 'Razorpay',
                      paymentId: response.razorpay_payment_id,
                      paymentStatus: 'Paid',
                    });
                    clearCart();
                  },
                },
              ]
            );
          } else {
            Alert.alert('Payment Verification Failed', verifyResponse.message || 'Please contact support.');
          }
        } catch (verifyError: any) {
          setIsProcessing(false);
          console.error('❌ Verification error:', verifyError);
          Alert.alert('Verification Failed', 'Please contact support.');
        }
      };

      if (Platform.OS === 'web') {
        const win = window as any;

        if (!win.Razorpay) {
          setIsProcessing(false);
          Alert.alert('Payment Error', 'Razorpay checkout script did not load. Please refresh and try again.');
          return;
        }

        const rzp = new win.Razorpay({
          ...options,
          handler: handlePaymentSuccess,
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              Alert.alert('Payment Cancelled', 'You cancelled the payment');
            },
          },
        });

        rzp.on('payment.failed', function (response: any) {
          setIsProcessing(false);
          console.error('❌ Razorpay payment failed:', response.error);
          Alert.alert('Payment Failed', response.error.description || 'Something went wrong. Please try again.');
        });

        rzp.open();
        return;
      }

      RazorpayCheckout.open(options)
        .then(handlePaymentSuccess)
        .catch((error: any) => {
          setIsProcessing(false);
          console.error('❌ Razorpay error:', error);

          let errorMessage = 'Something went wrong. Please try again.';
          let errorTitle = 'Payment Failed';

          if (error.code === 'PAYMENT_FAILED') {
            errorMessage = 'Payment failed. Please try again with a different payment method.';
          } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your internet connection.';
          } else if (error.code === 'CANCELLED') {
            errorTitle = 'Payment Cancelled';
            errorMessage = 'You cancelled the payment process.';
          } else if (error.description) {
            errorMessage = error.description;
          } else if (error.message) {
            errorMessage = error.message;
          }

          Alert.alert(errorTitle, errorMessage);
        });

    } catch (error: any) {
      setIsProcessing(false);
      console.error('❌ Payment error:', error);
      Alert.alert('Error', error.message || 'Failed to initialize payment.');
    }
  };

  // ✅ Handle Proceed to Checkout
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    const { subtotal, tax, deliveryFee, total } = calculateTotal();
    
    console.log('🛒 Proceeding to checkout with:');
    console.log('  Subtotal:', subtotal);
    console.log('  Delivery Fee:', deliveryFee);
    console.log('  Tax:', tax);
    console.log('  Total:', total);
    
    navigation.navigate('AddressSelection', {
      totalAmount: total,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      restaurantName: cartItems[0]?.restaurantName || 'QuickBite',
      cartItems: cartItems,
    });
  };

  // ✅ Navigate to ProductListScreen
  const navigateToProductList = () => {
    if (selectedBusiness?.id) {
      navigation.navigate('ProductList', {
        storeId: selectedBusiness.id,
        storeName: selectedBusiness.name,
      });
    } else {
      navigation.navigate('Home');
    }
  };

  // ✅ Render cart item
  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.image || 'https://placehold.co/60x60' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.itemRestaurant}>{item.restaurantName}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
        >
          <Icon name="remove" size={16} color="#fc8019" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
        >
          <Icon name="add" size={16} color="#fc8019" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        onPress={() => handleRemoveItem(item)} 
        style={styles.removeButton}
      >
        <Icon name="close-circle" size={24} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );

  // ✅ Render recommended product item
  const renderRecommendedItem = ({ item }: { item: any }) => {
    const inCart = isItemInCart(item.id);
    const quantity = getItemQuantity(item.id);
    const imageUrl = item.image 
      ? (item.image.startsWith('http') ? item.image : `https://placehold.co/100x100`)
      : 'https://placehold.co/100x100';

    return (
      <View style={styles.recommendedItem}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.recommendedImage} 
          resizeMode="cover"
        />
        <View style={styles.recommendedInfo}>
          <Text style={styles.recommendedName} numberOfLines={1}>
            {item.name || 'Unnamed Product'}
          </Text>
          <Text style={styles.recommendedCategory} numberOfLines={1}>
            {item.category || 'Vegetables'}
          </Text>
          <Text style={styles.recommendedPrice}>
            ₹{item.selling_price || item.price || 0}
          </Text>
        </View>
        {inCart ? (
          <View style={styles.quantityContainerSmall}>
            <TouchableOpacity
              style={styles.quantityButtonSmall}
              onPress={() => handleUpdateQuantity(
                { id: item.id, restaurantId: item.id }, 
                quantity - 1
              )}
            >
              <Icon name="remove" size={12} color="#fc8019" />
            </TouchableOpacity>
            <Text style={styles.quantityTextSmall}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButtonSmall}
              onPress={() => handleUpdateQuantity(
                { id: item.id, restaurantId: item.id }, 
                quantity + 1
              )}
            >
              <Icon name="add" size={12} color="#fc8019" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => {
              console.log('🛒 Adding recommended product:', item.name);
              handleAddToCart(item);
            }}
          >
            <Text style={styles.addButtonTextSmall}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const { subtotal, tax, deliveryFee, total } = calculateTotal();

  // Empty cart view
  if (cartItems.length === 0 && !showSuccessModal) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#282c3f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear your cart?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearCart },
            ]
          );
        }}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item, index) => (
            <View key={`${item.id}-${item.restaurantId}-${index}`}>
              {renderCartItem({ item })}
            </View>
          ))}
        </View>

        {/* ADD MORE BUTTON */}
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={navigateToProductList}
          activeOpacity={0.8}
        >
          <Icon name="add-circle-outline" size={20} color="#fc8019" />
          <Text style={styles.viewMoreText}>Add More Products</Text>
          <Icon name="arrow-forward" size={16} color="#fc8019" />
        </TouchableOpacity>

        {/* RECOMMENDED PRODUCTS SECTION */}
        {recommendedProducts.length > 0 && (
          <View style={styles.recommendedContainer}>
            <View style={styles.recommendedHeader}>
              <View style={styles.recommendedHeaderLeft}>
                <Text style={styles.recommendedTitle}>★ Recommended for You</Text>
              </View>
            </View>

            {loadingRecommendations ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fc8019" />
                <Text style={styles.loadingText}>Finding recommendations...</Text>
              </View>
            ) : showRecommendations && (
              <FlatList
                data={recommendedProducts.slice(0, 10)}
                renderItem={renderRecommendedItem}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedList}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              />
            )}
          </View>
        )}

        <View style={styles.footerSpacing} />
      </ScrollView>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.overlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#fc8019" />
            <Text style={styles.processingText}>Processing Payment...</Text>
            <Text style={styles.processingSubText}>Please don't close the app</Text>
          </View>
        </View>
      )}

      {/* COD Success Modal */}
      <PaymentSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderDetails={orderDetails}
        onViewOrders={handleViewOrders}
        onContinueShopping={handleContinueShopping}
      />

      {/* Order Summary Modal */}
      <OrderSummaryModal
        visible={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        tax={tax}
        total={total}
      />

      {/* Checkout Container */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity 
          style={styles.checkoutLeft}
          onPress={() => setShowSummaryModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.checkoutTotal}>₹{total}</Text>
          <Text style={styles.checkoutItems}>{getTotalItems()} items</Text>
        </TouchableOpacity>
        
        <View style={styles.checkoutRight}>
          <TouchableOpacity
            style={styles.billDetailsButton}
            onPress={() => setShowSummaryModal(true)}
          >
            <Icon name="receipt-outline" size={18} color="#fc8019" />
            <Text style={styles.billDetailsText}>Bill Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleProceedToCheckout}
            disabled={isProcessing}
          >
            <Text style={styles.checkoutButtonText}>
              {isProcessing ? 'Processing...' : 'Proceed →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  headerRight: {
    width: 40,
  },
  clearText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
  },
  cartItemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f5',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282c3f',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fc8019',
    marginTop: 2,
  },
  itemRestaurant: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fc8019',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
    marginRight: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282c3f',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fc8019',
    borderRadius: 12,
    backgroundColor: '#fff5f0',
    borderStyle: 'dashed',
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fc8019',
    marginHorizontal: 8,
  },
  recommendedContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#f0f0f5',
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  recommendedHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginLeft: 4,
  },
  recommendedList: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  recommendedItem: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f5',
    padding: 8,
    alignItems: 'center',
  },
  recommendedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  recommendedInfo: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  recommendedName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#282c3f',
    textAlign: 'center',
  },
  recommendedCategory: {
    fontSize: 11,
    color: '#7e808c',
    textAlign: 'center',
    marginTop: 2,
  },
  recommendedPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fc8019',
    marginTop: 4,
  },
  quantityContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fc8019',
    borderRadius: 6,
    paddingHorizontal: 4,
    backgroundColor: '#ffffff',
  },
  quantityButtonSmall: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityTextSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#282c3f',
    minWidth: 16,
    textAlign: 'center',
  },
  addButtonSmall: {
    borderWidth: 1,
    borderColor: '#fc8019',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  addButtonTextSmall: {
    color: '#fc8019',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#7e808c',
  },
  footerSpacing: {
    height: 80,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  processingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 16,
  },
  processingSubText: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 8,
  },
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
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f5',
    backgroundColor: '#ffffff',
  },
  checkoutLeft: {
    flexDirection: 'column',
    paddingVertical: 4,
    paddingRight: 8,
  },
  checkoutTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fc8019',
  },
  checkoutItems: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 1,
  },
  checkoutRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  billDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#fc8019',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  billDetailsText: {
    color: '#fc8019',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fc8019',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#fc8019',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 8,
    textAlign: 'center',
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: '#fc8019',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#282c3f',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSummaryContainer: {
    marginBottom: 16,
  },
  modalSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  modalSummaryLabel: {
    fontSize: 14,
    color: '#7e808c',
  },
  modalSummaryValue: {
    fontSize: 14,
    color: '#282c3f',
  },
  modalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 8,
    marginTop: 4,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
  },
  modalTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fc8019',
  },
  modalCloseButtonFull: {
    backgroundColor: '#fc8019',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;