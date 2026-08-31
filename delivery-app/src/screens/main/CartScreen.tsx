import React, { useContext, useState, useEffect } from 'react';
import promotionService, { Promotion } from '../../services/promotionService';
import PromotionCard from '../../components/PromotionCard';
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
  TextInput,
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

// 🎨 New color palette — purple / indigo
const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#5541D7',
  primaryLight: '#F1EEFF',
  primarySoft: '#EDE9FE',
  accent: '#8B7CF6',
  success: '#22C55E',
  successBg: '#ECFDF3',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  text: '#1E1B2E',
  subtext: '#8A85A0',
  border: '#EFEDF7',
  bg: '#FFFFFF',
  bgSoft: '#FAFAFD',
};

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
            <Icon name="checkmark-circle" size={76} color={COLORS.success} />
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
            <View style={[styles.successRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.successLabel}>Payment Status</Text>
              <Text style={[styles.successValue, styles.successStatus]}>
                {orderDetails?.paymentStatus || 'Confirmed'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.successButton} onPress={onViewOrders} activeOpacity={0.85}>
            <Text style={styles.successButtonText}>View My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.successButtonSecondary} onPress={onContinueShopping} activeOpacity={0.7}>
            <Text style={styles.successButtonSecondaryText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ✅ Order Summary Modal Component
const OrderSummaryModal = ({ visible, onClose, subtotal, deliveryFee, tax, total, distanceInfo, isCalculating, cartItems, discount }: any) => {
  if (!visible) return null;

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
      amount: Math.round(amount as number),
    }));
  };

  const gstBreakdown = getGSTBreakdown();

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Summary</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Icon name="close" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalSummaryContainer}>
            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Subtotal</Text>
              <Text style={styles.modalSummaryValue}>₹{subtotal}</Text>
            </View>

            {gstBreakdown && gstBreakdown.length > 0 && (
              <>
                {gstBreakdown.map((gst: any, index: number) => (
                  <View key={index} style={styles.modalSummaryRow}>
                    <Text style={styles.modalSummaryLabel}>GST {gst.rate}%</Text>
                    <Text style={styles.modalSummaryValue}>₹{gst.amount}</Text>
                  </View>
                ))}
              </>
            )}

            {(!gstBreakdown || gstBreakdown.length === 0) && (
              <View style={styles.modalSummaryRow}>
                <Text style={styles.modalSummaryLabel}>Tax (GST 18%)</Text>
                <Text style={styles.modalSummaryValue}>₹{tax}</Text>
              </View>
            )}

            <View style={styles.modalSummaryRow}>
              <Text style={styles.modalSummaryLabel}>Delivery Fee</Text>
              <Text style={styles.modalSummaryValue}>₹{deliveryFee}</Text>
            </View>

            {discount > 0 && (
              <View style={[styles.modalSummaryRow, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, marginTop: 4 }]}>
                <Text style={[styles.modalSummaryLabel, { color: COLORS.success, fontWeight: '600' }]}>Discount</Text>
                <Text style={[styles.modalSummaryValue, { color: COLORS.success, fontWeight: '700' }]}>-₹{discount}</Text>
              </View>
            )}
          </View>

          {distanceInfo && !isCalculating && (
            <View style={styles.distanceBreakdown}>
              <Text style={styles.distanceText}>
                📍 Distance: {distanceInfo.distance_km?.toFixed(1) || 'N/A'} KM
              </Text>
              {distanceInfo.is_free_delivery ? (
                <Text style={styles.freeDeliveryText}>
                  ✅ Free delivery within {distanceInfo.free_delivery_radius || 5} KM
                </Text>
              ) : (
                <Text style={styles.chargeableText}>
                  Charged for {distanceInfo.chargeable_distance_km || 0} KM beyond {distanceInfo.free_delivery_radius || 5} KM
                </Text>
              )}
            </View>
          )}

          <View style={[styles.modalSummaryRow, styles.modalTotalRow]}>
            <Text style={styles.modalTotalLabel}>Total</Text>
            <Text style={styles.modalTotalValue}>₹{total}</Text>
          </View>

          <TouchableOpacity style={styles.modalCloseButtonFull} onPress={onClose} activeOpacity={0.85}>
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
    addToCart,
  } = useContext(CartContext);

  const { addOrder } = useContext(OrderContext);
  const { selectedBusiness } = useContext(SelectedBusinessContext);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState<boolean>(false);

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  const [deliveryFeeData, setDeliveryFeeData] = useState<any>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState<boolean>(false);

  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState<boolean>(false);
  const [promotionsError, setPromotionsError] = useState<string | null>(null);

  // 👇 promo code state
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  // 👇 NEW — which promotion card is currently selected (radio), before "Apply" is pressed
  const [selectedPromoCard, setSelectedPromoCard] = useState<Promotion | null>(null);

  const getStoreId = (): number | null => {
    if (selectedBusiness?.id) {
      return Number(selectedBusiness.id);
    }
    if (cartItems.length > 0 && cartItems[0]?.restaurantId) {
      return Number(cartItems[0].restaurantId);
    }
    return null;
  };

  const storeId = getStoreId();
  const storeCartItems = cartItems.filter(
    (item) => String(item.restaurantId) === String(storeId)
  );

  const clearStoreCart = () => {
    storeCartItems.forEach((item) => removeFromCart(item.id, item.restaurantId));
  };

  useEffect(() => {
    if (storeCartItems.length > 0) {
      fetchRecommendations();
      fetchPromotions();
    } else {
      setRecommendedProducts([]);
      setPromotions([]);
    }
  }, [cartItems, storeId]);

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);

      const currentStoreId = getStoreId();
      const currentStoreItems = cartItems.filter(
        (item) => String(item.restaurantId) === String(currentStoreId)
      );

      const productIds = currentStoreItems.map(item => parseInt(item.id, 10)).filter(id => !isNaN(id));

      if (productIds.length === 0) {
        setRecommendedProducts([]);
        setLoadingRecommendations(false);
        return;
      }

      const response = await axios.get(`${API_URL}/public/products/suggestions`, {
        params: {
          product_ids: productIds.join(','),
        },
      });

      let recommendations: any[] = [];
      if (Array.isArray(response.data)) {
        recommendations = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        recommendations = response.data.data;
      }

      const cartIds = new Set(currentStoreItems.map(item => String(item.id)));
      const filtered = recommendations.filter(p => !cartIds.has(String(p.id)));

      setRecommendedProducts(filtered);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchPromotions = async () => {
    const businessId = getStoreId();
    if (!businessId) {
      setPromotions([]);
      return;
    }

    try {
      setLoadingPromotions(true);
      setPromotionsError(null);
      const data = await promotionService.getActivePromotions(businessId);
      setPromotions(data);
    } catch (err) {
      console.error('Failed to fetch promotions:', err);
      setPromotionsError('Could not load promotions');
      setPromotions([]);
    } finally {
      setLoadingPromotions(false);
    }
  };

  const calculateDeliveryFeeFromAPI = async () => {
    const businessId = getStoreId();
    if (!businessId) {
      console.warn('No business ID found for delivery fee calculation');
      return;
    }

    setIsCalculatingFee(true);

    try {
      const customerLat = 28.6139;
      const customerLng = 77.2090;

      const fee = await calculateDeliveryFee(customerLat, customerLng);
      console.log('✅ Delivery fee from API:', fee);
    } catch (error) {
      console.error('❌ Failed to calculate delivery fee:', error);
    } finally {
      setIsCalculatingFee(false);
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

  const calculateDeliveryFee = async (customerLat: number, customerLng: number) => {
    const businessId = getStoreId();
    if (!businessId) {
      console.warn('No business ID found for delivery fee calculation');
      return 30;
    }

    try {
      const response = await axios.post(`${API_URL}/delivery-fees/calculate`, {
        business_id: businessId,
        customer_latitude: customerLat,
        customer_longitude: customerLng,
      });

      console.log('✅ Delivery fee calculated:', response.data);

      setDeliveryFeeData({
        delivery_fee: response.data.delivery_fee || 30,
        distance_km: response.data.distance_km || 0,
        free_delivery_radius: response.data.free_delivery_radius || 5,
        chargeable_distance_km: response.data.chargeable_distance_km || 0,
        is_free_delivery: response.data.is_free_delivery || false,
      });

      return response.data.delivery_fee || 30;
    } catch (error) {
      console.error('❌ Failed to calculate delivery fee:', error);
      return 30;
    }
  };

  const calculateDiscount = (subtotalAmount: number): { discount: number; eligibleAmount: number } => {
    if (!appliedPromo) return { discount: 0, eligibleAmount: 0 };

    const eligibleItems =
      !appliedPromo.apply_to ||
      appliedPromo.apply_to === 'all' ||
      !appliedPromo.product_ids ||
      appliedPromo.product_ids.length === 0
        ? storeCartItems
        : storeCartItems.filter((i) => appliedPromo.product_ids?.includes(Number(i.id)));

    if (eligibleItems.length === 0) return { discount: 0, eligibleAmount: 0 };

    const eligibleAmount = eligibleItems.reduce(
      (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
      0
    );

    // ── PERCENTAGE ──
    if (appliedPromo.promotion_type === 'percentage') {
      const discount = Math.round(eligibleAmount * ((appliedPromo.discount_percentage || 0) / 100));
      return { discount, eligibleAmount };
    }

    // ── BOGO ──
    if (appliedPromo.promotion_type === 'bogo') {
      const unitPrices: number[] = [];
      eligibleItems.forEach((item) => {
        for (let i = 0; i < (item.quantity || 0); i++) {
          unitPrices.push(item.price);
        }
      });

      unitPrices.sort((a, b) => a - b); // cheapest units first

      const totalUnits = unitPrices.length;
      const freePairs = Math.floor(totalUnits / 2);

      // Every full pair → cheapest unit of that pair is free
      let discount = unitPrices.slice(0, freePairs).reduce((sum, p) => sum + p, 0);

      // 👇 Odd one out (or a single-item cart) gets 50% off instead of ₹0,
      //    so BOGO shows a visible discount even with only 1 qty in cart
      if (totalUnits % 2 !== 0) {
        const remaining = unitPrices[freePairs];
        if (remaining) discount += remaining * 0.5;
      }

      return { discount: Math.round(discount), eligibleAmount };
    }

    return { discount: 0, eligibleAmount };
  };

  const calculateTotal = () => {
    const subtotal = storeCartItems.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    const { discount } = calculateDiscount(subtotal);

    // 👇 GST calculate pannுறதுக்கு munnadி, item level la discount proportionally apply pannுறோம்
    const discountRatio = subtotal > 0 ? discount / subtotal : 0;

    const totalGST = storeCartItems.reduce((sum: number, item: any) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      const discountedItemTotal = itemTotal - itemTotal * discountRatio;
      const gstRate = item.gst_rate || 0;
      const gstAmount = discountedItemTotal * (gstRate / 100);
      return sum + gstAmount;
    }, 0);

    const roundedGST = Math.round(totalGST);
    const deliveryFee = 30;
    const total = subtotal - discount + roundedGST + deliveryFee;

    return { subtotal, tax: roundedGST, deliveryFee, discount, total };
  };

  // 👇 Shared validator — used by BOTH manual input apply AND card apply button
  const validateAndApplyPromo = (promo: Promotion): boolean => {
    setPromoError(null);
    setPromoSuccess(null);

    const now = new Date();
    if (new Date(promo.start_date) > now || new Date(promo.end_date) < now) {
      setPromoError('This promo code has expired');
      return false;
    }

    const { subtotal } = calculateTotal();
    if (promo.min_order_amount && subtotal < promo.min_order_amount) {
      setPromoError(`Minimum order ₹${promo.min_order_amount} required for this code`);
      return false;
    }

    setAppliedPromo(promo); // 👈 replaces whatever was applied before
    setPromoInput(promo.promo_code || '');
    setPromoSuccess(`"${promo.promo_code}" applied successfully!`);
    return true;
  };

  // Manual "Enter promo code" box
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    setPromoError(null);
    setPromoSuccess(null);

    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    const match = promotions.find(
      (p) => p.promo_code?.toUpperCase() === code && p.status === 'active'
    );

    if (!match) {
      setPromoError('Invalid or inactive promo code');
      setAppliedPromo(null);
      return;
    }

    validateAndApplyPromo(match);
  };

  // 👇 NEW — tapping a card just selects it (radio-style), does NOT apply yet
  const handleSelectPromotionCard = (promo: Promotion) => {
    setPromoError(null);
    setPromoSuccess(null);
    // tapping the already-selected card again deselects it
    setSelectedPromoCard((prev) => (prev?.id === promo.id ? null : promo));
  };

  // 👇 NEW — the single shared "Apply" button uses whichever card is selected
  const handleApplySelectedCard = () => {
    if (!selectedPromoCard) {
      setPromoError('Please select an offer first');
      return;
    }
    const applied = validateAndApplyPromo(selectedPromoCard);
    if (applied) {
      setSelectedPromoCard(null); // clear the radio selection once applied
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setSelectedPromoCard(null);
    setPromoInput('');
    setPromoError(null);
    setPromoSuccess(null);
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

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.selling_price || product.price || 0,
      quantity: 1,
      image: product.image || 'https://placehold.co/150x150',
      restaurantId: product.id,
      restaurantName: product.name,
      gst_rate: product.gst_rate || 0,
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
        gst: product.gst_rate || 0,
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

  const isItemInCart = (productId: string) => {
    return cartItems.some(item => item.id === String(productId));
  };

  const getItemQuantity = (productId: string) => {
    const item = cartItems.find(cartItem => cartItem.id === String(productId));
    return item ? item.quantity : 0;
  };

  const handleCashOnDelivery = async () => {
    if (storeCartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    const businessId = getStoreId();

    if (!businessId) {
      Alert.alert('Error', 'No store selected. Please go back and select a store.');
      return;
    }

    console.log('🔍 [CartScreen] Placing COD order with business_id:', businessId);

    const { total, tax } = calculateTotal();
    const orderId = 'ORD-' + Date.now().toString().slice(-6);

    try {
      setIsProcessing(true);

      const orderData = {
        business_id: businessId,
        customer_id: 1,
        items: storeCartItems.map(item => ({
          product_id: parseInt(item.id, 10),
          qty: item.quantity,
          unit_price: item.price,
        })),
        description: `Order from ${selectedBusiness?.name || storeCartItems[0]?.restaurantName || 'Store'}`,
        shipping_address: 'Customer Address',
        tax: tax,
        channel: 'online',
      };

      console.log('🔍 [CartScreen] COD Order payload:', orderData);

      const response = await axios.post(`${API_URL}/public/sales-orders`, orderData);
      console.log('✅ [CartScreen] COD Order created:', response.data);

      const newOrder = {
        id: response.data.id || orderId,
        restaurantName: selectedBusiness?.name || storeCartItems[0]?.restaurantName || 'QuickBite',
        items: storeCartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        status: 'Placed' as const,
        createdAt: new Date().toISOString(),
      };

      addOrder(newOrder);

      setOrderDetails({
        orderId: response.data.id || orderId,
        total: total,
        items: storeCartItems,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Confirmed',
        business_id: businessId,
      });
      setShowSuccessModal(true);
      clearStoreCart();
    } catch (error: any) {
      console.error('❌ [CartScreen] COD Order failed:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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

  const handleRazorpayPayment = async () => {
    if (storeCartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    const businessId = getStoreId();

    if (!businessId) {
      Alert.alert('Error', 'No store selected. Please go back and select a store.');
      return;
    }

    console.log('🔍 [CartScreen] Placing Razorpay order with business_id:', businessId);

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
    const { total, tax } = calculateTotal();

    try {
      const orderData = {
        business_id: businessId,
        customer_id: 1,
        items: storeCartItems.map(item => ({
          product_id: parseInt(item.id, 10),
          qty: item.quantity,
          unit_price: item.price,
        })),
        description: `Order from ${selectedBusiness?.name || storeCartItems[0]?.restaurantName || 'Store'}`,
        shipping_address: 'Customer Address',
        tax: tax,
        channel: 'online',
      };

      console.log('🔍 [CartScreen] Razorpay Order payload:', orderData);

      const orderResponse = await axios.post(`${API_URL}/public/sales-orders`, orderData);
      console.log('✅ [CartScreen] Order created for Razorpay:', orderResponse.data);

      const orderId = orderResponse.data.id;

      const razorpayResponse = await paymentService.createOrder(total, 'INR');
      console.log('📦 Razorpay order response:', razorpayResponse);

      if (!razorpayResponse.success) {
        throw new Error(razorpayResponse.message || 'Failed to create payment order');
      }

      const { order, key } = razorpayResponse;
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
        theme: { color: COLORS.primary },
      };

      const handlePaymentSuccess = async (response: any) => {
        try {
          const verifyResponse = await paymentService.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            orderId
          );

          setIsProcessing(false);

          if (verifyResponse.success) {
            const newOrder = {
              id: orderId,
              restaurantName: selectedBusiness?.name || storeCartItems[0]?.restaurantName || 'QuickBite',
              items: storeCartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              total: total,
              status: 'Placed' as const,
              createdAt: new Date().toISOString(),
            };

            addOrder(newOrder);

            Alert.alert(
              'Payment Successful! 🎉',
              `Payment ID: ${response.razorpay_payment_id}`,
              [
                {
                  text: 'View Order',
                  onPress: () => {
                    navigation.navigate('OrderTracking', {
                      orderId: orderId,
                      total: total,
                      items: storeCartItems,
                      paymentMethod: 'Razorpay',
                      paymentId: response.razorpay_payment_id,
                      paymentStatus: 'Paid',
                      business_id: businessId,
                    });
                    clearStoreCart();
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

  // 👇 Pass discount and promo info to AddressSelection
  const handleProceedToCheckout = () => {
    if (storeCartItems.length === 0) {
      Alert.alert('Cart is Empty', 'Please add items to your cart first.');
      return;
    }

    const businessId = getStoreId();

    if (!businessId) {
      Alert.alert('Error', 'No store selected. Please go back and select a store.');
      return;
    }

    const { subtotal, tax, deliveryFee, discount, total } = calculateTotal();

    navigation.navigate('AddressSelection', {
      totalAmount: total,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      discount: discount,
      promoCode: appliedPromo?.promo_code || null,
      promoId: appliedPromo?.id || null,
      restaurantName: selectedBusiness?.name || storeCartItems[0]?.restaurantName || 'QuickBite',
      cartItems: storeCartItems,
      business_id: businessId,
    });
  };

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

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.image || 'https://placehold.co/60x60' }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemRestaurant} numberOfLines={1}>{item.restaurantName}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={() => handleRemoveItem(item)}
          style={styles.removeButton}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon name="close" size={16} color={COLORS.subtext} />
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
          >
            <Icon name="remove" size={16} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
          >
            <Icon name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderRecommendedItem = ({ item }: { item: any }) => {
    const inCart = isItemInCart(item.id);
    const quantity = getItemQuantity(item.id);
    const imageUrl = item.image
      ? (item.image.startsWith('http') ? item.image : `https://placehold.co/100x100`)
      : 'https://placehold.co/100x100';

    return (
      <View style={styles.recommendedItem}>
        <View style={styles.recommendedImageWrap}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.recommendedImage}
            resizeMode="cover"
          />
        </View>
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
              <Icon name="remove" size={12} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.quantityTextSmall}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButtonSmall}
              onPress={() => handleUpdateQuantity(
                { id: item.id, restaurantId: item.id },
                quantity + 1
              )}
            >
              <Icon name="add" size={12} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButtonSmall}
            onPress={() => {
              console.log('🛒 Adding recommended product:', item.name);
              handleAddToCart(item);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonTextSmall}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const { subtotal, tax, deliveryFee, discount, total } = calculateTotal();
  const storeItemsCount = storeCartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  if (storeCartItems.length === 0 && !showSuccessModal) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Icon name="arrow-back" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Icon name="cart-outline" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubText}>Start shopping to add items to your cart</Text>
          <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')} activeOpacity={0.85}>
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
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Clear Cart',
            'Are you sure you want to clear your cart?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: clearStoreCart },
            ]
          );
        }}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cartItemsContainer}>
          {storeCartItems.map((item, index) => (
            <View key={`${item.id}-${item.restaurantId}-${index}`}>
              {renderCartItem({ item })}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={navigateToProductList}
          activeOpacity={0.8}
        >
          <Icon name="add-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.viewMoreText}>Add More Products</Text>
          <Icon name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        {/* ── 1️⃣ RECOMMENDED FOR YOU ──────────────────────────────────────── */}
        {recommendedProducts.length > 0 && (
          <View style={styles.recommendedContainer}>
            <View style={styles.recommendedHeader}>
              <Text style={styles.recommendedTitle}>★ Recommended for You</Text>
            </View>

            {loadingRecommendations ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
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

        {/* ── 2️⃣ APPLY PROMO CODE ──────────────────────────────────────────── */}
        <View style={styles.recommendedContainer}>
          <View style={styles.recommendedHeader}>
            <Text style={styles.recommendedTitle}>🎟️ Apply Promo Code</Text>
          </View>

          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            {appliedPromo ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: COLORS.successBg,
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={{ marginLeft: 8, color: COLORS.text, fontWeight: '600' }}>
                    {appliedPromo.promo_code} applied
                  </Text>
                </View>
                <TouchableOpacity onPress={handleRemovePromo}>
                  <Text style={{ color: COLORS.danger, fontWeight: '600', fontSize: 13 }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      fontSize: 14,
                      marginRight: 8,
                      textTransform: 'characters',
                    }}
                    placeholder="Enter promo code"
                    value={promoInput}
                    onChangeText={setPromoInput}
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.primary,
                      paddingHorizontal: 18,
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}
                    onPress={handleApplyPromo}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Apply</Text>
                  </TouchableOpacity>
                </View>
                {promoError && (
                  <Text style={{ color: COLORS.danger, fontSize: 12, marginTop: 6 }}>{promoError}</Text>
                )}
                {promoSuccess && (
                  <Text style={{ color: COLORS.success, fontSize: 12, marginTop: 6 }}>{promoSuccess}</Text>
                )}
              </>
            )}
          </View>
        </View>

        {/* ── 3️⃣ PROMOTIONS FOR YOU ────────────────────────────────────────── */}
        {(loadingPromotions || promotionsError || promotions.length > 0) && (
          <View style={styles.recommendedContainer}>
            <View style={styles.recommendedHeader}>
              <Text style={styles.recommendedTitle}>🏷️ Promotions for You</Text>
            </View>

            {loadingPromotions ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading promotions...</Text>
              </View>
            ) : promotionsError ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>{promotionsError}</Text>
              </View>
            ) : promotions.length === 0 ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>No active promotions right now</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={promotions}
                  renderItem={({ item }) => (
                    <PromotionCard
                      promotion={item}
                      isSelected={
                        appliedPromo?.id === item.id || selectedPromoCard?.id === item.id
                      }
                      onSelect={() => handleSelectPromotionCard(item)}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recommendedList}
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                />

                {/* 👇 single shared Apply button for whichever card is selected */}
                {!appliedPromo && (
                  <View style={{ paddingHorizontal: 14, marginTop: 4 }}>
                    <TouchableOpacity
                      style={styles.sharedPromoApplyBtn}
                      onPress={handleApplySelectedCard}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.sharedPromoApplyBtnText}>Apply</Text>
                    </TouchableOpacity>
                    {promoError && (
                      <Text style={{ color: COLORS.danger, fontSize: 12, marginTop: 6 }}>
                        {promoError}
                      </Text>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        <View style={styles.footerSpacing} />
      </ScrollView>

      {isProcessing && (
        <View style={styles.overlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Processing Payment...</Text>
            <Text style={styles.processingSubText}>Please don't close the app</Text>
          </View>
        </View>
      )}

      <PaymentSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderDetails={orderDetails}
        onViewOrders={handleViewOrders}
        onContinueShopping={handleContinueShopping}
      />

      <OrderSummaryModal
        visible={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        tax={tax}
        total={total}
        discount={discount}
        distanceInfo={deliveryFeeData}
        isCalculating={isCalculatingFee}
        cartItems={storeCartItems}
      />

      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutLeft}
          onPress={() => setShowSummaryModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.checkoutTotal}>₹{total}</Text>
          <Text style={styles.checkoutItems}>{storeItemsCount} items</Text>
        </TouchableOpacity>

        <View style={styles.checkoutRight}>
          <TouchableOpacity
            style={styles.billDetailsButton}
            onPress={() => setShowSummaryModal(true)}
            activeOpacity={0.8}
          >
            <Icon name="receipt-outline" size={17} color={COLORS.primary} />
            <Text style={styles.billDetailsText}>Bill Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleProceedToCheckout}
            disabled={isProcessing}
            activeOpacity={0.85}
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
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    width: 22,
  },
  clearText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  cartItemsContainer: {
    padding: 16,
    gap: 12,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  itemRestaurant: {
    fontSize: 11.5,
    color: COLORS.subtext,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: 2,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  quantityButton: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 18,
    textAlign: 'center',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    borderStyle: 'dashed',
  },
  viewMoreText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.primary,
    marginHorizontal: 8,
  },
  recommendedContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  recommendedHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: COLORS.text,
  },
  recommendedList: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  recommendedItem: {
    width: 142,
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    alignItems: 'center',
  },
  recommendedImageWrap: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    marginBottom: 8,
    overflow: 'hidden',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedInfo: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  recommendedName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  recommendedCategory: {
    fontSize: 11,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 2,
  },
  recommendedPrice: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  quantityContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  quantityButtonSmall: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityTextSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 16,
    textAlign: 'center',
  },
  addButtonSmall: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.bg,
  },
  addButtonTextSmall: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  // 👇 shared Apply button for the promotions carousel (matches manual Apply button style)
  sharedPromoApplyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  sharedPromoApplyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13.5,
    color: COLORS.subtext,
  },
  footerSpacing: {
    height: 90,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,27,46,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  processingContainer: {
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '80%',
  },
  processingText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
  },
  processingSubText: {
    fontSize: 13.5,
    color: COLORS.subtext,
    marginTop: 8,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,27,46,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: COLORS.bg,
    borderRadius: 24,
    padding: 28,
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
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.successBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 13.5,
    color: COLORS.subtext,
    marginBottom: 20,
    textAlign: 'center',
  },
  successDetails: {
    width: '100%',
    backgroundColor: COLORS.bgSoft,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  successLabel: {
    fontSize: 13.5,
    color: COLORS.subtext,
  },
  successValue: {
    fontSize: 13.5,
    color: COLORS.text,
    fontWeight: '600',
  },
  successTotal: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  successStatus: {
    color: COLORS.success,
    fontWeight: '700',
  },
  successButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  successButtonText: {
    color: '#ffffff',
    fontSize: 15.5,
    fontWeight: '700',
  },
  successButtonSecondary: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  successButtonSecondaryText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  checkoutLeft: {
    flexDirection: 'column',
    paddingVertical: 4,
    paddingRight: 8,
  },
  checkoutTotal: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primary,
  },
  checkoutItems: {
    fontSize: 11.5,
    color: COLORS.subtext,
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
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    marginRight: 10,
  },
  billDetailsText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '700',
    marginLeft: 6,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 13.5,
    color: COLORS.subtext,
    marginTop: 8,
    textAlign: 'center',
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 15.5,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,27,46,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalCloseButton: {
    padding: 4,
    backgroundColor: COLORS.bgSoft,
    borderRadius: 20,
  },
  modalSummaryContainer: {
    marginBottom: 16,
  },
  modalSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  modalSummaryLabel: {
    fontSize: 14,
    color: COLORS.subtext,
  },
  modalSummaryValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  modalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    marginTop: 4,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalTotalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primary,
  },
  modalCloseButtonFull: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseButtonText: {
    color: '#ffffff',
    fontSize: 15.5,
    fontWeight: '700',
  },
  distanceBreakdown: {
    backgroundColor: COLORS.bgSoft,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  distanceText: {
    fontSize: 13,
    color: COLORS.text,
  },
  freeDeliveryText: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 4,
  },
  chargeableText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default CartScreen;
