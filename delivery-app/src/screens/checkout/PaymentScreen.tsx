

// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   Modal,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { CartContext } from '../../context/CartContext';
// import { AuthContext } from '../../context/AuthContext';
// import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';
// import { supabase } from '../../services/supabaseClient';
// import { useCreatePublicSalesOrder } from '@workspace/api-client-react';


// const THEME_COLOR = '#6C5CE7';
// const THEME_COLOR_LIGHT = '#F1EFFE'; 


// let RazorpayCheckout: any = null;

// if (Platform.OS !== 'web') {
//   RazorpayCheckout = require('react-native-razorpay').default;
// }


// interface PaymentScreenProps {
//   navigation: any;
//   route: any;
// }


// const PaymentSuccessModal = ({
//   visible,
//   onClose,
//   orderDetails,
//   onViewOrders,
//   onContinueShopping,
// }: any) => {
//   if (!visible) {
//     return null;
//   }

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.successOverlay}>
//         <View style={styles.successContainer}>
//           {/* SUCCESS ICON */}
//           <View style={styles.successIconContainer}>
//             <Icon name="checkmark-circle" size={80} color="#28a745" />
//           </View>

//           {/* TITLE */}
//           <Text style={styles.successTitle}>Order Successful! 🎉</Text>
//           <Text style={styles.successSubtitle}>
//             Your order has been placed successfully
//           </Text>

//           {/* DETAILS */}
//           <View style={styles.successDetails}>
//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Order ID</Text>
//               <Text style={styles.successValue}>
//                 {orderDetails?.orderId || 'ORD-123456'}
//               </Text>
//             </View>

//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Payment Method</Text>
//               <Text style={styles.successValue}>
//                 {orderDetails?.paymentMethod || 'Cash on Delivery'}
//               </Text>
//             </View>

//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Total Amount</Text>
//               <Text style={[styles.successValue, styles.successTotal]}>
//                 ₹{orderDetails?.total || 0}
//               </Text>
//             </View>

//             <View style={styles.successRow}>
//               <Text style={styles.successLabel}>Payment Status</Text>
//               <Text style={[styles.successValue, styles.successStatus]}>
//                 {orderDetails?.paymentStatus || 'Confirmed'}
//               </Text>
//             </View>
//           </View>

//           {/* VIEW ORDERS */}
//           <TouchableOpacity style={styles.successButton} onPress={onViewOrders}>
//             <Text style={styles.successButtonText}>View My Orders</Text>
//           </TouchableOpacity>

//           {/* CONTINUE SHOPPING */}
//           <TouchableOpacity
//             style={styles.successButtonSecondary}
//             onPress={onContinueShopping}
//           >
//             <Text style={styles.successButtonSecondaryText}>
//               Continue Shopping
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ============================================================
// // PAYMENT SCREEN
// // ============================================================
// const PaymentScreen: React.FC<PaymentScreenProps> = ({
//   navigation,
//   route,
// }) => {
//   // ==========================================================
//   // ROUTE PARAMS
//   // ==========================================================
//   const {
//     totalAmount,
//     restaurantName,
//     cartItems,
//     address,
//     deliveryFee = 40,
//     tax = 0,
//     subtotal = 0,
//     discount = 0,
//     promoCode = null,
//   } = route.params || {};

//   // ==========================================================
//   // CONTEXTS
//   // ==========================================================
//   const { clearCart } = useContext(CartContext);
//   const { user } = useContext(AuthContext);
//   const { selectedBusiness } = useContext(SelectedBusinessContext);

//   // ==========================================================
//   // API - SINGLE DECLARATION
//   // ==========================================================
//   const createSalesOrder = useCreatePublicSalesOrder();

//   // ==========================================================
//   // STATE - SINGLE DECLARATION
//   // ==========================================================
//   const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
//   const [orderDetails, setOrderDetails] = useState<any>(null);

 
//   const calculateTax = (discountAmount: number) => {
//     if (!cartItems || cartItems.length === 0) return 0;

  
//     const rawSubtotal = cartItems.reduce(
//       (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
//       0
//     );
//     const discountRatio = rawSubtotal > 0 ? discountAmount / rawSubtotal : 0;

//     const total = cartItems.reduce((sum: number, item: any) => {
//       const itemTotal = (item.price || 0) * (item.quantity || 1);
//       const discountedItemTotal = itemTotal - itemTotal * discountRatio; // 👈 discount applied per item
//       const gstRate = item.gst_rate || 0;
//       return sum + discountedItemTotal * (gstRate / 100);
//     }, 0);
//     return Math.round(total);
//   };


 
//   const finalSubtotal = subtotal > 0 ? subtotal : totalAmount - deliveryFee - tax;
//   const finalDeliveryFee = deliveryFee > 0 ? deliveryFee : 40;
//   const finalDiscount = discount > 0 ? discount : 0;

 
//   const discountedSubtotal = finalSubtotal - finalDiscount;

//   const finalTax = calculateTax(finalDiscount);

//   const effectiveGstRate =
//     discountedSubtotal > 0 ? Math.round((finalTax / discountedSubtotal) * 100) : 0;

//   const calculatedTotal = finalSubtotal - finalDiscount + finalDeliveryFee + finalTax;


//   const displayTotal = calculatedTotal;

 
//   const paymentMethods = [
//     {
//       id: 'razorpay',
//       icon: 'card-outline',
//       name: 'Razorpay',
//       description: 'UPI, Cards, Net Banking • Instant',
//       color: THEME_COLOR,
//       bg: THEME_COLOR_LIGHT,
//     },
//     {
//       id: 'cash',
//       icon: 'cash-outline',
//       name: 'Cash on Delivery',
//       description: 'Pay when you receive • No extra charge',
//       color: '#28a745',
//       bg: '#d4edda',
//     },
//   ];


//   const handleSelectMethod = (methodId: string) => {
//     setSelectedMethod(methodId);
//     console.log('✅ Selected payment method:', methodId);
//   };


//   const recordTransaction = async (
//     orderId: string,
//     paymentMethod: 'Razorpay' | 'Cash on Delivery'
//   ) => {
//     const businessId =
//       (cartItems?.[0]?.restaurantId ? Number(cartItems[0].restaurantId) : undefined) ||
//       selectedBusiness?.id ||
//       user?.business_id;
//     if (!businessId || !user?.id) {
//       console.log('⚠️ Missing business_id or user id — skipped transaction record');
//       return;
//     }

//     const itemDescription =
//       cartItems?.map((item: any) => `${item.name} x${item.quantity}`).join(', ') ||
//       'Order';

//     const paymentMode = paymentMethod === 'Razorpay' ? 'online' : 'cash';
//     const transactionType = paymentMethod === 'Razorpay' ? 'you_got' : 'you_gave';

//     const { data, error } = await supabase
//       .from('transactions')
//       .insert([
//         {
//           business_id: Number(businessId),
//           customer_id: user.id,
//           type: transactionType,
//           amount: displayTotal,
//           balance_after: displayTotal,
//           description: `${itemDescription} (Order ${orderId})`,
//           payment_mode: paymentMode,
//           entry_date: new Date().toISOString().split('T')[0],
//           created_by: user.id,
//           is_deleted: false,
//         },
//       ])
//       .select();

//     if (error) {
//       console.error('❌ Failed to record transaction:', error);
//     } else if (!data || data.length === 0) {
//       console.warn('⚠️ Transaction insert returned no row');
//     } else {
//       console.log('✅ Transaction recorded:', data);
//     }
//   };

  

//   const placeOrderOnBackend = async () => {
   
//     const businessId =
//       (cartItems?.[0]?.restaurantId ? Number(cartItems[0].restaurantId) : undefined) ||
//       selectedBusiness?.id ||
//       user?.business_id;

//     if (!businessId || !user?.id || !address) {
//       throw new Error('Missing business, customer, or address details.');
//     }
//     if (!cartItems || cartItems.length === 0) {
//       throw new Error('Cart is empty.');
//     }

   
//     const restaurantIds = new Set(cartItems.map((item: any) => String(item.restaurantId)));
//     if (restaurantIds.size > 1) {
//       throw new Error('Cart has items from multiple stores. Please order from one store at a time.');
//     }
//     const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;

    
//     const formattedItems = cartItems.map((item: any) => ({
//       product_id: Number(item.id),
//       qty: Number(item.quantity),
//       unit_price: Number(item.price),
//     }));

//     console.log('📦 Sales order items:', formattedItems);
//     console.log('🏪 Using business_id:', businessId);

//     const payload = {
//       business_id: Number(businessId),
//       customer_id: Number(user.id),
//       channel: 'online',
//       shipping_address: fullAddress,
//       customer_latitude: address.latitude,
//       customer_longitude: address.longitude,
//       delivery_fee: finalDeliveryFee,
//       delivery_distance_km: route.params?.deliveryFeeBreakdown?.distance_km,
//       delivery_fee_radius: route.params?.deliveryFeeBreakdown?.free_delivery_radius,
//       delivery_fee_per_km: route.params?.deliveryFeeBreakdown?.per_km_charge,
//       description:
//         cartItems.map((item: any) => `${item.name} x${item.quantity}`).join(', ') ||
//         'Order',
//       tax: finalTax,
//       discount: finalDiscount,
//       promo_code: promoCode,
//       // 👇 map local selectedMethod ('razorpay'/'cash') to the
//       // backend's payment_method enum ('online'/'cod')
//       payment_method: selectedMethod === 'cash' ? 'cod' : 'online',
//       items: formattedItems,
//     };

//     console.log('🚀 Creating sales order:', JSON.stringify(payload, null, 2));

//     const salesOrder = await createSalesOrder.mutateAsync({
//       data: payload,
//     });

//     console.log('✅ Sales order created:', salesOrder);
//     return salesOrder;
//   };

 
//   const handlePayNow = () => {
//     if (selectedMethod === 'razorpay') {
//       handleRazorpayPayment();
//     } else if (selectedMethod === 'cash') {
//       handleCashOnDelivery();
//     }
//   };

  
//   const handleRazorpayPayment = async () => {
//     setIsProcessing(true);

//     try {
//       // WEB
//       if (Platform.OS === 'web') {
//         const win = window as any;

//         if (!win.Razorpay) {
//           const script = document.createElement('script');
//           script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//           script.async = true;
//           script.onload = () => {
//             openRazorpayWeb();
//           };
//           script.onerror = () => {
//             setIsProcessing(false);
//             Alert.alert('Payment Error', 'Unable to load Razorpay.');
//           };
//           document.body.appendChild(script);
//         } else {
//           openRazorpayWeb();
//         }
//         return;
//       }

//       // MOBILE
//       if (!RazorpayCheckout) {
//         throw new Error('Razorpay is not available.');
//       }

//       const userPhone = (user as any)?.mobileNumber || address?.phone || '9876543210';

//       const options = {
//         description: 'Order Payment',
//         image: 'https://your-logo-url.com/logo.png',
//         currency: 'INR',
//         key: 'rzp_test_TLzyiBcmji4cvD',
//         amount: Math.round(Number(displayTotal) * 100),
//         name: 'QuickBite',
//         prefill: {
//           email: user?.email || 'customer@example.com',
//           contact: userPhone,
//           name: user?.name || address?.name || 'Customer',
//         },
//         theme: {
//           color: THEME_COLOR,
//         },
//       };

//       RazorpayCheckout.open(options)
//         .then((data: any) => {
//           console.log('✅ Payment success:', data);
//           handlePaymentSuccess(data);
//         })
//         .catch((error: any) => {
//           console.error('❌ Payment error:', error);
//           setIsProcessing(false);
//           Alert.alert(
//             'Payment Failed',
//             error?.description || 'Something went wrong. Please try again.'
//           );
//         });
//     } catch (error: any) {
//       console.error('❌ Razorpay initialization error:', error);
//       setIsProcessing(false);
//       Alert.alert('Error', error?.message || 'Failed to initialize payment.');
//     }
//   };

 
//   const openRazorpayWeb = () => {
//     const win = window as any;
//     const userPhone = (user as any)?.mobileNumber || address?.phone || '9876543210';

//     const options = {
//       description: 'Order Payment',
//       image: 'https://your-logo-url.com/logo.png',
//       currency: 'INR',
//       key: 'rzp_test_TLzyiBcmji4cvD',
//       amount: Math.round(Number(displayTotal) * 100),
//       name: 'QuickBite',
//       prefill: {
//         email: user?.email || 'customer@example.com',
//         contact: userPhone,
//         name: user?.name || address?.name || 'Customer',
//       },
//       theme: {
//         color: THEME_COLOR,
//       },
//       modal: {
//         ondismiss: function () {
//           setIsProcessing(false);
//           Alert.alert('Payment Cancelled', 'You cancelled the payment');
//         },
//       },
//       handler: function (response: any) {
//         handlePaymentSuccess(response);
//       },
//     };

//     const rzp = new win.Razorpay(options);
//     rzp.open();
//   };


//   const handlePaymentSuccess = async (data: any) => {
//     try {
//       const salesOrder = await placeOrderOnBackend();

//       clearCart();
//       await recordTransaction(`ORD-MS${salesOrder.id}`, 'Razorpay');

//       setIsProcessing(false);
//       setOrderDetails({
//         orderId: `ORD-MS${salesOrder.id}`,
//         backendOrderId: salesOrder.id,
//         total: displayTotal,
//         items: cartItems,
//         paymentMethod: 'Razorpay',
//         paymentStatus: 'Paid',
//       });
//       setShowSuccessModal(true);
//     } catch (err: any) {
//       console.error('❌ Failed to create sales order:', err);
//       setIsProcessing(false);
//       Alert.alert(
//         'Order Failed',
//         err?.message || 'Could not place your order. Please try again.'
//       );
//     }
//   };

 
//   const handleCashOnDelivery = async () => {
//     setIsProcessing(true);

//     try {
//       console.log('💵 Cash on Delivery selected');
//       const salesOrder = await placeOrderOnBackend();
//       console.log('✅ COD sales order created:', salesOrder);

//       clearCart();
//       await recordTransaction(`ORD-MS${salesOrder.id}`, 'Cash on Delivery');

//       setOrderDetails({
//         orderId: `ORD-MS${salesOrder.id}`,
//         backendOrderId: salesOrder.id,
//         total: displayTotal,
//         items: cartItems,
//         paymentMethod: 'Cash on Delivery',
//         paymentStatus: 'Confirmed',
//       });
//       setShowSuccessModal(true);
//     } catch (err: any) {
//       console.error('❌ Failed to create COD sales order:', err);
//       Alert.alert(
//         'Order Failed',
//         err?.message || 'Could not place your order. Please try again.'
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

 
//   const handleViewOrders = () => {
//     setShowSuccessModal(false);
//     setOrderDetails(null);
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'HomeTabs', params: { screen: 'Orders' } }],
//     });
//   };

 
//   const handleContinueShopping = () => {
//     setShowSuccessModal(false);
//     setOrderDetails(null);
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'HomeTabs', params: { screen: 'Home' } }],
//     });
//   };

//   // ==========================================================
//   // NO AMOUNT
//   // ==========================================================
//   if (!displayTotal || displayTotal === 0) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.centerContent}>
//           <Icon name="alert-circle-outline" size={60} color="#dc3545" />
//           <Text style={styles.errorText}>No amount specified</Text>
//           <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
//             <Text style={styles.goBackButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ==========================================================
//   // UI
//   // ==========================================================
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#282c3f" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Payment</Text>
//         <View style={{ width: 40 }} />
//       </View>

//       {/* CONTENT */}
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* DELIVERY ADDRESS */}
//         {address && (
//           <View style={styles.addressSection}>
//             <Text style={styles.addressTitle}>Delivery Address</Text>
//             <View style={styles.addressCard}>
//               <Text style={styles.addressName}>{address.name || 'Customer'}</Text>
//               <Text style={styles.addressDetail}>{address.address}</Text>
//               {address.landmark && (
//                 <Text style={styles.addressDetail}>📍 {address.landmark}</Text>
//               )}
//               <Text style={styles.addressDetail}>
//                 {address.city}, {address.state || ''} - {address.pincode}
//               </Text>
//               <Text style={styles.addressPhone}>📞 {address.phone || 'Not provided'}</Text>
//             </View>
//           </View>
//         )}

//         {/* AMOUNT */}
//         <View style={styles.amountCard}>
//           <View style={styles.amountRow}>
//             <Text style={styles.amountLabel}>Amount to Pay</Text>
//             <View style={styles.secureBadgeSmall}>
//               <Icon name="lock-closed" size={12} color="#ffffff" />
//               <Text style={styles.secureBadgeSmallText}>Secure</Text>
//             </View>
//           </View>
//           <Text style={styles.amountValue}>₹{displayTotal}</Text>
//           <Text style={styles.amountSubtext}>Including all taxes & fees</Text>
//         </View>

//         {/* PAYMENT METHODS */}
//         <Text style={styles.sectionTitle}>Choose Payment Method</Text>

//         {paymentMethods.map((method) => (
//           <TouchableOpacity
//             key={method.id}
//             style={[
//               styles.methodItem,
//               selectedMethod === method.id && styles.methodSelected,
//             ]}
//             onPress={() => handleSelectMethod(method.id)}
//             disabled={isProcessing}
//           >
//             <View style={styles.methodLeft}>
//               <View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
//                 <Icon name={method.icon} size={22} color={method.color} />
//               </View>
//               <View style={styles.methodInfo}>
//                 <Text style={[styles.methodName, selectedMethod === method.id && styles.methodNameSelected]}>
//                   {method.name}
//                 </Text>
//                 <Text style={styles.methodDescription}>{method.description}</Text>
//               </View>
//             </View>

//             {selectedMethod === method.id && (
//               <View style={styles.checkmark}>
//                 <Icon name="checkmark-circle" size={24} color="#28a745" />
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}

//         {/* ORDER SUMMARY */}
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Order Summary</Text>

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Item Total</Text>
//             <Text style={styles.summaryValue}>₹{finalSubtotal}</Text>
//           </View>

//           {/* Discount row */}
//           {finalDiscount > 0 && (
//             <View style={styles.summaryRow}>
//               <Text style={[styles.summaryLabel, { color: '#28a745' }]}>
//                 Discount {promoCode ? `(${promoCode})` : ''}
//               </Text>
//               <Text style={[styles.summaryValue, { color: '#28a745', fontWeight: '700' }]}>
//                 -₹{finalDiscount}
//               </Text>
//             </View>
//           )}

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Delivery Fee</Text>
//             <Text style={styles.summaryValue}>₹{finalDeliveryFee}</Text>
//           </View>

//           {/* ✅ GST now always computed off the discounted subtotal —
//               matches the Cart screen's Order Summary exactly */}
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Tax (GST {effectiveGstRate}%)</Text>
//             <Text style={styles.summaryValue}>₹{finalTax}</Text>
//           </View>

//           <View style={styles.summaryDivider} />

//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryTotalLabel}>Total</Text>
//             <Text style={styles.summaryTotalValue}>₹{displayTotal}</Text>
//           </View>
//         </View>

//         <View style={styles.footerSpacer} />
//       </ScrollView>

//       {/* PAY BUTTON */}
//       <View style={styles.payButtonContainer}>
//         <TouchableOpacity
//           style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
//           onPress={handlePayNow}
//           disabled={isProcessing}
//         >
//           {isProcessing ? (
//             <ActivityIndicator size="small" color="#ffffff" />
//           ) : (
//             <Text style={styles.payButtonText}>
//               {selectedMethod === 'cash'
//                 ? `Place Order ₹${displayTotal}`
//                 : `Pay ₹${displayTotal}`}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* LOADING */}
//       {isProcessing && (
//         <View style={styles.loadingOverlay}>
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={THEME_COLOR} />
//             <Text style={styles.loadingText}>Processing Order...</Text>
//             <Text style={styles.loadingSubtext}>
//               Please wait, do not close the app
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* SUCCESS MODAL */}
//       <PaymentSuccessModal
//         visible={showSuccessModal}
//         onClose={() => setShowSuccessModal(false)}
//         orderDetails={orderDetails}
//         onViewOrders={handleViewOrders}
//         onContinueShopping={handleContinueShopping}
//       />
//     </SafeAreaView>
//   );
// };

// // ============================================================
// // STYLES
// // ============================================================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },

//   centerContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },

//   errorText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginTop: 16,
//   },

//   goBackButton: {
//     backgroundColor: THEME_COLOR,
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginTop: 16,
//   },

//   goBackButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // HEADER
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },

//   backButton: {
//     padding: 4,
//   },

//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//   },

//   scrollContent: {
//     paddingBottom: 100,
//   },

//   // ADDRESS
//   addressSection: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e8e8e8',
//   },

//   addressTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 8,
//   },

//   addressCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 12,
//   },

//   addressName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#282c3f',
//   },

//   addressDetail: {
//     fontSize: 14,
//     color: '#757575',
//     marginTop: 2,
//   },

//   addressPhone: {
//     fontSize: 14,
//     color: '#757575',
//     marginTop: 4,
//   },

//   // AMOUNT
//   amountCard: {
//     backgroundColor: THEME_COLOR,
//     marginHorizontal: 16,
//     marginTop: 16,
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: THEME_COLOR,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },

//   amountRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   amountLabel: {
//     fontSize: 14,
//     color: '#ffffff',
//     opacity: 0.9,
//     fontWeight: '500',
//   },

//   amountValue: {
//     fontSize: 36,
//     fontWeight: '700',
//     color: '#ffffff',
//     marginTop: 4,
//   },

//   amountSubtext: {
//     fontSize: 12,
//     color: '#ffffff',
//     opacity: 0.7,
//     marginTop: 4,
//   },

//   secureBadgeSmall: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },

//   secureBadgeSmallText: {
//     fontSize: 11,
//     color: '#ffffff',
//     marginLeft: 4,
//     fontWeight: '500',
//   },

//   // SECTION
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginHorizontal: 16,
//     marginTop: 24,
//     marginBottom: 12,
//   },

//   // PAYMENT METHODS
//   methodItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     marginBottom: 8,
//     padding: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f5',
//   },

//   methodSelected: {
//     borderColor: THEME_COLOR,
//     backgroundColor: THEME_COLOR_LIGHT,
//   },

//   methodLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },

//   methodIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },

//   methodInfo: {
//     flex: 1,
//   },

//   methodName: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#282c3f',
//   },

//   methodNameSelected: {
//     color: THEME_COLOR,
//   },

//   methodDescription: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 2,
//   },

//   checkmark: {
//     marginLeft: 8,
//   },

//   // SUMMARY
//   summaryCard: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f5',
//   },

//   summaryTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },

//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },

//   summaryLabel: {
//     fontSize: 13,
//     color: '#7e808c',
//   },

//   summaryValue: {
//     fontSize: 13,
//     color: '#282c3f',
//   },

//   summaryDivider: {
//     height: 1,
//     backgroundColor: '#f0f0f5',
//     marginVertical: 8,
//   },

//   summaryTotalLabel: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#282c3f',
//   },

//   summaryTotalValue: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: THEME_COLOR,
//   },

//   footerSpacer: {
//     height: 20,
//   },

//   // PAY BUTTON
//   payButtonContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f5',
//     elevation: 4,
//   },

//   payButton: {
//     backgroundColor: THEME_COLOR,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },

//   payButtonDisabled: {
//     backgroundColor: '#ccc',
//   },

//   payButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // LOADING
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   loadingContainer: {
//     backgroundColor: '#ffffff',
//     padding: 30,
//     borderRadius: 16,
//     alignItems: 'center',
//     minWidth: 200,
//   },

//   loadingText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginTop: 12,
//   },

//   loadingSubtext: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 4,
//   },

//   // SUCCESS MODAL
//   successOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   successContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 24,
//     padding: 30,
//     width: '90%',
//     maxWidth: 400,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },

//   successIconContainer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#e8f5e9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//   },

//   successTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#282c3f',
//     marginBottom: 8,
//     textAlign: 'center',
//   },

//   successSubtitle: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginBottom: 20,
//     textAlign: 'center',
//   },

//   successDetails: {
//     width: '100%',
//     backgroundColor: '#f8f9fa',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//   },

//   successRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e9ecef',
//   },

//   successLabel: {
//     fontSize: 14,
//     color: '#7e808c',
//   },

//   successValue: {
//     fontSize: 14,
//     color: '#282c3f',
//     fontWeight: '500',
//   },

//   successTotal: {
//     color: THEME_COLOR,
//     fontWeight: '700',
//     fontSize: 16,
//   },

//   successStatus: {
//     color: '#28a745',
//     fontWeight: '600',
//   },

//   successButton: {
//     backgroundColor: THEME_COLOR,
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 10,
//   },

//   successButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   successButtonSecondary: {
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     width: '100%',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: THEME_COLOR,
//   },

//   successButtonSecondaryText: {
//     color: THEME_COLOR,
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default PaymentScreen;
// PaymentScreen.tsx  (src/screens/checkout/)
// UI/UX redesign only: purple / Times New Roman KhataPro theme, responsive
// (two columns on wide web screens, single column + sticky pay bar on phones).
// ALL payment / order / tax / navigation logic is unchanged from the original.

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
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';
import { supabase } from '../../services/supabaseClient';
import { useCreatePublicSalesOrder } from '@workspace/api-client-react';

const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#5541D7',
  primaryLight: '#F1EEFF',
  primarySoft: '#EDE9FE',
  accent: '#8B7CF6',
  success: '#22C55E',
  successSoft: '#DCFCE7',
  danger: '#EF4444',
  text: '#1E1B2E',
  textMuted: '#8A85A0',
  border: '#EFEDF7',
  bg: '#FAFAFD',
  white: '#FFFFFF',
};

const FONT = Platform.select({ ios: 'Times New Roman', android: 'serif', default: 'Times New Roman' });

// Kept for the Razorpay checkout theme
const THEME_COLOR = COLORS.primary;

let RazorpayCheckout: any = null;

if (Platform.OS !== 'web') {
  RazorpayCheckout = require('react-native-razorpay').default;
}

interface PaymentScreenProps {
  navigation: any;
  route: any;
}

const addressTypeIcon = (type?: string) =>
  type === 'Work' ? 'briefcase-outline' : type === 'Other' ? 'location-outline' : 'home-outline';

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
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.successOverlay}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Icon name="checkmark-circle" size={72} color={COLORS.success} />
          </View>

          <Text style={styles.successTitle}>Order placed</Text>
          <Text style={styles.successSubtitle}>Your order has been placed successfully</Text>

          <View style={styles.successDetails}>
            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Order ID</Text>
              <Text style={styles.successValue}>{orderDetails?.orderId || 'ORD-123456'}</Text>
            </View>

            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Payment method</Text>
              <Text style={styles.successValue}>{orderDetails?.paymentMethod || 'Cash on Delivery'}</Text>
            </View>

            <View style={styles.successRow}>
              <Text style={styles.successLabel}>Total amount</Text>
              <Text style={[styles.successValue, styles.successTotal]}>₹{orderDetails?.total || 0}</Text>
            </View>

            <View style={[styles.successRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.successLabel}>Payment status</Text>
              <Text style={[styles.successValue, styles.successStatus]}>
                {orderDetails?.paymentStatus || 'Confirmed'}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.successButton} onPress={onViewOrders} activeOpacity={0.85}>
            <Text style={styles.successButtonText}>View my orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.successButtonSecondary} onPress={onContinueShopping} activeOpacity={0.85}>
            <Text style={styles.successButtonSecondaryText}>Continue shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================
// PAYMENT SCREEN
// ============================================================
const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
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
    discount = 0,
    promoCode = null,
  } = route.params || {};

  // ==========================================================
  // CONTEXTS
  // ==========================================================
  const { clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { selectedBusiness } = useContext(SelectedBusinessContext);

  // ==========================================================
  // API
  // ==========================================================
  const createSalesOrder = useCreatePublicSalesOrder();

  // ==========================================================
  // STATE
  // ==========================================================
  const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Layout only
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const calculateTax = (discountAmount: number) => {
    if (!cartItems || cartItems.length === 0) return 0;

    const rawSubtotal = cartItems.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const discountRatio = rawSubtotal > 0 ? discountAmount / rawSubtotal : 0;

    const total = cartItems.reduce((sum: number, item: any) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      const discountedItemTotal = itemTotal - itemTotal * discountRatio; // discount applied per item
      const gstRate = item.gst_rate || 0;
      return sum + discountedItemTotal * (gstRate / 100);
    }, 0);
    return Math.round(total);
  };

  const finalSubtotal = subtotal > 0 ? subtotal : totalAmount - deliveryFee - tax;
  const finalDeliveryFee = deliveryFee > 0 ? deliveryFee : 40;
  const finalDiscount = discount > 0 ? discount : 0;

  const discountedSubtotal = finalSubtotal - finalDiscount;

  const finalTax = calculateTax(finalDiscount);

  const effectiveGstRate =
    discountedSubtotal > 0 ? Math.round((finalTax / discountedSubtotal) * 100) : 0;

  const calculatedTotal = finalSubtotal - finalDiscount + finalDeliveryFee + finalTax;

  const displayTotal = calculatedTotal;

  const paymentMethods = [
    {
      id: 'razorpay',
      icon: 'card-outline',
      name: 'Razorpay',
      description: 'UPI, Cards, Net Banking • Instant',
      color: THEME_COLOR,
      bg: COLORS.primaryLight,
    },
    {
      id: 'cash',
      icon: 'cash-outline',
      name: 'Cash on Delivery',
      description: 'Pay when you receive • No extra charge',
      color: '#16A34A',
      bg: COLORS.successSoft,
    },
  ];

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    console.log('✅ Selected payment method:', methodId);
  };

  const recordTransaction = async (
    orderId: string,
    paymentMethod: 'Razorpay' | 'Cash on Delivery'
  ) => {
    const businessId =
      (cartItems?.[0]?.restaurantId ? Number(cartItems[0].restaurantId) : undefined) ||
      selectedBusiness?.id ||
      user?.business_id;
    if (!businessId || !user?.id) {
      console.log('⚠️ Missing business_id or user id — skipped transaction record');
      return;
    }

    const itemDescription =
      cartItems?.map((item: any) => `${item.name} x${item.quantity}`).join(', ') || 'Order';

    const paymentMode = paymentMethod === 'Razorpay' ? 'online' : 'cash';
    const transactionType = paymentMethod === 'Razorpay' ? 'you_got' : 'you_gave';

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          business_id: Number(businessId),
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

  const placeOrderOnBackend = async () => {
    const businessId =
      (cartItems?.[0]?.restaurantId ? Number(cartItems[0].restaurantId) : undefined) ||
      selectedBusiness?.id ||
      user?.business_id;

    if (!businessId || !user?.id || !address) {
      throw new Error('Missing business, customer, or address details.');
    }
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty.');
    }

    const restaurantIds = new Set(cartItems.map((item: any) => String(item.restaurantId)));
    if (restaurantIds.size > 1) {
      throw new Error('Cart has items from multiple stores. Please order from one store at a time.');
    }
    const fullAddress = `${address.address}, ${address.city}, ${address.state || ''} - ${address.pincode}`;

    const formattedItems = cartItems.map((item: any) => ({
      product_id: Number(item.id),
      qty: Number(item.quantity),
      unit_price: Number(item.price),
    }));

    console.log('📦 Sales order items:', formattedItems);
    console.log('🏪 Using business_id:', businessId);

    const payload = {
      business_id: Number(businessId),
      customer_id: Number(user.id),
      channel: 'online',
      shipping_address: fullAddress,
      customer_latitude: address.latitude,
      customer_longitude: address.longitude,
      delivery_fee: finalDeliveryFee,
      delivery_distance_km: route.params?.deliveryFeeBreakdown?.distance_km,
      delivery_fee_radius: route.params?.deliveryFeeBreakdown?.free_delivery_radius,
      delivery_fee_per_km: route.params?.deliveryFeeBreakdown?.per_km_charge,
      description:
        cartItems.map((item: any) => `${item.name} x${item.quantity}`).join(', ') || 'Order',
      tax: finalTax,
      discount: finalDiscount,
      promo_code: promoCode,
      // map local selectedMethod ('razorpay'/'cash') to the
      // backend's payment_method enum ('online'/'cod')
      payment_method: selectedMethod === 'cash' ? 'cod' : 'online',
      items: formattedItems,
    };

    console.log('🚀 Creating sales order:', JSON.stringify(payload, null, 2));

    const salesOrder = await createSalesOrder.mutateAsync({
      data: payload,
    });

    console.log('✅ Sales order created:', salesOrder);
    return salesOrder;
  };

  const handlePayNow = () => {
    if (selectedMethod === 'razorpay') {
      handleRazorpayPayment();
    } else if (selectedMethod === 'cash') {
      handleCashOnDelivery();
    }
  };

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
          color: THEME_COLOR,
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
          Alert.alert('Payment Failed', error?.description || 'Something went wrong. Please try again.');
        });
    } catch (error: any) {
      console.error('❌ Razorpay initialization error:', error);
      setIsProcessing(false);
      Alert.alert('Error', error?.message || 'Failed to initialize payment.');
    }
  };

  const openRazorpayWeb = () => {
    const win = window as any;
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
        color: THEME_COLOR,
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

  const handlePaymentSuccess = async (data: any) => {
    try {
      const salesOrder = await placeOrderOnBackend();

      clearCart();
      await recordTransaction(`ORD-MS${salesOrder.id}`, 'Razorpay');

      setIsProcessing(false);
      setOrderDetails({
        orderId: `ORD-MS${salesOrder.id}`,
        backendOrderId: salesOrder.id,
        total: displayTotal,
        items: cartItems,
        paymentMethod: 'Razorpay',
        paymentStatus: 'Paid',
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('❌ Failed to create sales order:', err);
      setIsProcessing(false);
      Alert.alert('Order Failed', err?.message || 'Could not place your order. Please try again.');
    }
  };

  const handleCashOnDelivery = async () => {
    setIsProcessing(true);

    try {
      console.log('💵 Cash on Delivery selected');
      const salesOrder = await placeOrderOnBackend();
      console.log('✅ COD sales order created:', salesOrder);

      clearCart();
      await recordTransaction(`ORD-MS${salesOrder.id}`, 'Cash on Delivery');

      setOrderDetails({
        orderId: `ORD-MS${salesOrder.id}`,
        backendOrderId: salesOrder.id,
        total: displayTotal,
        items: cartItems,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Confirmed',
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('❌ Failed to create COD sales order:', err);
      Alert.alert('Order Failed', err?.message || 'Could not place your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewOrders = () => {
    setShowSuccessModal(false);
    setOrderDetails(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTabs', params: { screen: 'Orders' } }],
    });
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    setOrderDetails(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTabs', params: { screen: 'Home' } }],
    });
  };

  // ==========================================================
  // NO AMOUNT
  // ==========================================================
  if (!displayTotal || displayTotal === 0) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centerContent}>
          <Icon name="alert-circle-outline" size={56} color={COLORS.danger} />
          <Text style={styles.errorTitle}>No amount to pay</Text>
          <Text style={styles.errorBody}>Go back to your cart and try again.</Text>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.goBackButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // UI PIECES
  // ==========================================================
  const addressCard = address ? (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Delivering to</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} disabled={isProcessing}>
          <Text style={styles.changeLink}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addressRow}>
        <View style={styles.addressIcon}>
          <Icon name={addressTypeIcon(address.type)} size={20} color={COLORS.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.addressName}>{address.type || address.name || 'Delivery address'}</Text>
          <Text style={styles.addressDetail}>{address.address}</Text>
          {!!address.landmark && <Text style={styles.addressMeta}>Landmark: {address.landmark}</Text>}
          <Text style={styles.addressDetail}>
            {address.city}, {address.state || ''} - {address.pincode}
          </Text>
          <Text style={styles.addressMeta}>Phone: {address.phone || 'Not provided'}</Text>
        </View>
      </View>
    </View>
  ) : null;

  const amountCard = (
    <View style={styles.amountCard}>
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Amount to pay</Text>
        <View style={styles.secureBadge}>
          <Icon name="lock-closed" size={12} color={COLORS.white} />
          <Text style={styles.secureBadgeText}>Secure</Text>
        </View>
      </View>
      <Text style={styles.amountValue}>₹{displayTotal}</Text>
      <Text style={styles.amountSubtext}>Including all taxes and fees</Text>
    </View>
  );

  const methodsSection = (
    <View>
      <Text style={styles.sectionTitle}>Payment method</Text>
      {paymentMethods.map((method) => {
        const selected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodItem, selected && styles.methodSelected]}
            onPress={() => handleSelectMethod(method.id)}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            <View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
              <Icon name={method.icon} size={22} color={method.color} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[styles.methodName, selected && styles.methodNameSelected]}>{method.name}</Text>
              <Text style={styles.methodDescription}>{method.description}</Text>
            </View>
            <View style={[styles.radio, selected && styles.radioOn]}>
              {selected && <Icon name="checkmark" size={14} color={COLORS.white} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const summaryCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Order summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Item total</Text>
        <Text style={styles.summaryValue}>₹{finalSubtotal}</Text>
      </View>

      {finalDiscount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: '#16A34A' }]}>
            Discount {promoCode ? `(${promoCode})` : ''}
          </Text>
          <Text style={[styles.summaryValue, { color: '#16A34A', fontWeight: '700' }]}>-₹{finalDiscount}</Text>
        </View>
      )}

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery fee</Text>
        <Text style={styles.summaryValue}>₹{finalDeliveryFee}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (GST {effectiveGstRate}%)</Text>
        <Text style={styles.summaryValue}>₹{finalTax}</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryRow}>
        <Text style={styles.summaryTotalLabel}>Total</Text>
        <Text style={styles.summaryTotalValue}>₹{displayTotal}</Text>
      </View>
    </View>
  );

  const payButton = (
    <TouchableOpacity
      style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
      onPress={handlePayNow}
      disabled={isProcessing}
      activeOpacity={0.85}
    >
      {isProcessing ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Text style={styles.payButtonText}>
          {selectedMethod === 'cash' ? `Place order ₹${displayTotal}` : `Pay ₹${displayTotal}`}
        </Text>
      )}
    </TouchableOpacity>
  );

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={8}>
          <Icon name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.backButton} />
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, !isWide && { paddingBottom: 110 }]}
      >
        {isWide ? (
          <View style={[styles.frame, styles.frameWide]}>
            <View style={styles.colLeft}>
              {addressCard}
              {methodsSection}
            </View>
            <View style={styles.colRight}>
              {amountCard}
              {summaryCard}
              {payButton}
            </View>
          </View>
        ) : (
          <View style={styles.frame}>
            {addressCard}
            {amountCard}
            {methodsSection}
            {summaryCard}
          </View>
        )}
      </ScrollView>

      {/* STICKY PAY BAR (phones / narrow screens) */}
      {!isWide && (
        <View style={styles.payBar}>
          <View style={styles.payBarInner}>{payButton}</View>
        </View>
      )}

      {/* LOADING */}
      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Processing your order…</Text>
            <Text style={styles.loadingSubtext}>Please wait, do not close the app</Text>
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
  screen: { flex: 1, backgroundColor: COLORS.bg },

  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: COLORS.text, marginTop: 14 },
  errorBody: { fontFamily: FONT, fontSize: 15, color: COLORS.textMuted, marginTop: 6 },
  goBackButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },
  goBackButtonText: { fontFamily: FONT, color: COLORS.white, fontSize: 16, fontWeight: '700' },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: COLORS.text },

  // LAYOUT
  scrollContent: { paddingBottom: 32 },
  frame: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 16 },
  frameWide: { maxWidth: 1040, flexDirection: 'row', gap: 24, alignItems: 'flex-start', paddingTop: 24 },
  colLeft: { flex: 1.15 },
  colRight: { flex: 1 },

  // CARDS
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.text },
  changeLink: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: COLORS.primary },

  // ADDRESS
  addressRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressName: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  addressDetail: { fontFamily: FONT, fontSize: 15, lineHeight: 21, color: COLORS.text },
  addressMeta: { fontFamily: FONT, fontSize: 14, color: COLORS.textMuted, marginTop: 3 },

  // AMOUNT
  amountCard: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { fontFamily: FONT, fontSize: 15, color: COLORS.white, opacity: 0.9, fontWeight: '600' },
  amountValue: { fontFamily: FONT, fontSize: 40, fontWeight: '700', color: COLORS.white, marginTop: 6 },
  amountSubtext: { fontFamily: FONT, fontSize: 14, color: COLORS.white, opacity: 0.75, marginTop: 4 },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  secureBadgeText: { fontFamily: FONT, fontSize: 12, color: COLORS.white, fontWeight: '700' },

  // METHODS
  sectionTitle: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 12, marginTop: 4 },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.white,
    marginBottom: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodSelected: { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: COLORS.primaryLight },
  methodIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  methodInfo: { flex: 1 },
  methodName: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.text },
  methodNameSelected: { color: COLORS.primaryDark },
  methodDescription: { fontFamily: FONT, fontSize: 14, color: COLORS.textMuted, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },

  // SUMMARY
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { fontFamily: FONT, fontSize: 15, color: COLORS.textMuted },
  summaryValue: { fontFamily: FONT, fontSize: 15, color: COLORS.text },
  summaryDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },
  summaryTotalLabel: { fontFamily: FONT, fontSize: 18, fontWeight: '700', color: COLORS.text },
  summaryTotalValue: { fontFamily: FONT, fontSize: 18, fontWeight: '700', color: COLORS.primary },

  // PAY BUTTON
  payBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  payBarInner: { width: '100%', maxWidth: 640, alignSelf: 'center' },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: { backgroundColor: '#C9C5DA' },
  payButtonText: { fontFamily: FONT, color: COLORS.white, fontSize: 18, fontWeight: '700' },

  // LOADING
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,27,46,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 220,
  },
  loadingText: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.text, marginTop: 12 },
  loadingSubtext: { fontFamily: FONT, fontSize: 14, color: COLORS.textMuted, marginTop: 4 },

  // SUCCESS MODAL
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,27,46,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 26,
    width: '92%',
    maxWidth: 420,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.successSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: { fontFamily: FONT, fontSize: 26, fontWeight: '700', color: COLORS.text, marginBottom: 6, textAlign: 'center' },
  successSubtitle: { fontFamily: FONT, fontSize: 15, color: COLORS.textMuted, marginBottom: 20, textAlign: 'center' },
  successDetails: {
    width: '100%',
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  successLabel: { fontFamily: FONT, fontSize: 15, color: COLORS.textMuted },
  successValue: { fontFamily: FONT, fontSize: 15, color: COLORS.text, fontWeight: '600' },
  successTotal: { color: COLORS.primary, fontWeight: '700', fontSize: 17 },
  successStatus: { color: '#16A34A', fontWeight: '700' },
  successButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  successButtonText: { fontFamily: FONT, color: COLORS.white, fontSize: 17, fontWeight: '700' },
  successButtonSecondary: {
    borderRadius: 12,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  successButtonSecondaryText: { fontFamily: FONT, color: COLORS.primary, fontSize: 17, fontWeight: '700' },
});

export default PaymentScreen;