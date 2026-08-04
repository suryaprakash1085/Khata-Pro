// // // // // // delivery-app/src/services/paymentService.ts
// // // // // import axios from 'axios';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // // // For physical device testing, use your computer's IP
// // // // // // For emulator, use localhost
// // // // // const API_URL = 'http://localhost:3000/api';

// // // // // const getToken = async () => {
// // // // //   try {
// // // // //     return await AsyncStorage.getItem('authToken');
// // // // //   } catch (error) {
// // // // //     console.error('Error getting token:', error);
// // // // //     return null;
// // // // //   }
// // // // // };

// // // // // export const paymentService = {
// // // // //   // Create Razorpay Order
// // // // //   createRazorpayOrder: async (amount: number, orderId: string) => {
// // // // //     try {
// // // // //       const token = await getToken();
// // // // //       console.log('📤 Sending request to:', `${API_URL}/payments/create-razorpay-order`);
// // // // //       console.log('📤 Request body:', { amount, orderId, currency: 'INR' });
      
// // // // //       const response = await axios.post(
// // // // //         `${API_URL}/payments/create-razorpay-order`,
// // // // //         {
// // // // //           amount,
// // // // //           orderId,
// // // // //           currency: 'INR',
// // // // //         },
// // // // //         {
// // // // //           headers: {
// // // // //             'Authorization': `Bearer ${token}`,
// // // // //             'Content-Type': 'application/json',
// // // // //           },
// // // // //         }
// // // // //       );
// // // // //       console.log('📥 Response:', response.data);
// // // // //       return response.data;
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Create order error:', error);
// // // // //       console.error('❌ Error response:', error.response?.data);
// // // // //       throw error.response?.data || error.message;
// // // // //     }
// // // // //   },

// // // // //   // Verify Razorpay Payment
// // // // //   verifyRazorpayPayment: async (data: {
// // // // //     razorpay_order_id: string;
// // // // //     razorpay_payment_id: string;
// // // // //     razorpay_signature: string;
// // // // //     orderId: string;
// // // // //   }) => {
// // // // //     try {
// // // // //       const token = await getToken();
// // // // //       const response = await axios.post(
// // // // //         `${API_URL}/payments/verify-razorpay-payment`,
// // // // //         data,
// // // // //         {
// // // // //           headers: {
// // // // //             'Authorization': `Bearer ${token}`,
// // // // //             'Content-Type': 'application/json',
// // // // //           },
// // // // //         }
// // // // //       );
// // // // //       return response.data;
// // // // //     } catch (error: any) {
// // // // //       console.error('Verify payment error:', error);
// // // // //       throw error.response?.data || error.message;
// // // // //     }
// // // // //   },
// // // // // };
// // // // // delivery-app/src/services/paymentService.ts
// // // // import axios from 'axios';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // // For emulator - use localhost
// // // // const API_URL = 'http://localhost:3000/api';

// // // // // FOR PHYSICAL DEVICE - Uncomment and use your computer's IP
// // // // // const API_URL = 'http://192.168.1.100:3000/api';

// // // // const getToken = async () => {
// // // //   try {
// // // //     return await AsyncStorage.getItem('authToken');
// // // //   } catch (error) {
// // // //     console.error('Error getting token:', error);
// // // //     return null;
// // // //   }
// // // // };

// // // // export const paymentService = {
// // // //   // Create Razorpay Order
// // // //   createRazorpayOrder: async (amount: number, orderId: string) => {
// // // //     try {
// // // //       const token = await getToken();
// // // //       console.log('📤 Creating order with:', { amount, orderId });
      
// // // //       const response = await axios.post(
// // // //         `${API_URL}/payments/create-razorpay-order`,
// // // //         {
// // // //           amount,
// // // //           orderId,
// // // //           currency: 'INR',
// // // //         },
// // // //         {
// // // //           headers: {
// // // //             'Authorization': `Bearer ${token}`,
// // // //             'Content-Type': 'application/json',
// // // //           },
// // // //         }
// // // //       );
// // // //       console.log('📥 Order created:', response.data);
// // // //       return response.data;
// // // //     } catch (error: any) {
// // // //       console.error('❌ Create order error:', error);
// // // //       throw error.response?.data || { success: false, message: error.message };
// // // //     }
// // // //   },

// // // //   // Verify Razorpay Payment
// // // //   verifyRazorpayPayment: async (data: {
// // // //     razorpay_order_id: string;
// // // //     razorpay_payment_id: string;
// // // //     razorpay_signature: string;
// // // //     orderId: string;
// // // //   }) => {
// // // //     try {
// // // //       const token = await getToken();
// // // //       const response = await axios.post(
// // // //         `${API_URL}/payments/verify-razorpay-payment`,
// // // //         data,
// // // //         {
// // // //           headers: {
// // // //             'Authorization': `Bearer ${token}`,
// // // //             'Content-Type': 'application/json',
// // // //           },
// // // //         }
// // // //       );
// // // //       return response.data;
// // // //     } catch (error: any) {
// // // //       console.error('Verify payment error:', error);
// // // //       throw error.response?.data || error.message;
// // // //     }
// // // //   },
// // // // };
// // // // delivery-app/src/services/paymentService.ts
// // // import axios from 'axios';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // // 🔥 IMPORTANT: Choose the correct URL based on your testing environment

// // // // OPTION 1: Android Emulator (Use this for Android emulator)
// // // const API_URL = 'http://10.0.2.2:3000/api';

// // // // OPTION 2: iOS Simulator (Use this for iOS simulator)
// // // // const API_URL = 'http://127.0.0.1:3000/api';

// // // // OPTION 3: Physical Device (Use your computer's IP address)
// // // // const API_URL = 'http://192.168.1.100:3000/api'; // Replace with your IP

// // // // OPTION 4: Localhost (Only works on web)
// // // // const API_URL = 'http://localhost:3000/api';

// // // const getToken = async () => {
// // //   try {
// // //     return await AsyncStorage.getItem('authToken');
// // //   } catch (error) {
// // //     console.error('Error getting token:', error);
// // //     return null;
// // //   }
// // // };

// // // export const paymentService = {
// // //   createRazorpayOrder: async (amount: number, orderId: string) => {
// // //     try {
// // //       console.log('📤 API URL:', API_URL);
// // //       console.log('📤 Creating order with:', { amount, orderId });
      
// // //       const response = await axios.post(
// // //         `${API_URL}/payments/create-razorpay-order`,
// // //         {
// // //           amount,
// // //           orderId,
// // //           currency: 'INR',
// // //         },
// // //         {
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //           },
// // //         }
// // //       );
      
// // //       console.log('✅ Order created:', response.data);
// // //       return response.data;
// // //     } catch (error: any) {
// // //       console.error('❌ Create order error:', error);
// // //       console.error('❌ Response:', error.response?.data);
// // //       throw error.response?.data || { success: false, message: error.message };
// // //     }
// // //   },

// // //   verifyRazorpayPayment: async (data: {
// // //     razorpay_order_id: string;
// // //     razorpay_payment_id: string;
// // //     razorpay_signature: string;
// // //     orderId: string;
// // //   }) => {
// // //     try {
// // //       const token = await getToken();
// // //       const response = await axios.post(
// // //         `${API_URL}/payments/verify-razorpay-payment`,
// // //         data,
// // //         {
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json',
// // //           },
// // //         }
// // //       );
// // //       return response.data;
// // //     } catch (error: any) {
// // //       console.error('Verify payment error:', error);
// // //       throw error.response?.data || error.message;
// // //     }
// // //   },
// // // };
// // // delivery-app/src/services/paymentService.ts
// // import axios from 'axios';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // // 🔥 FOR ANDROID EMULATOR - Use 10.0.2.2
// // const API_URL = 'http://10.0.2.2:3000/api';

// // // FOR iOS SIMULATOR (Uncomment if using iOS)
// // // const API_URL = 'http://127.0.0.1:3000/api';

// // // FOR PHYSICAL DEVICE (Uncomment and use your computer's IP)
// // // const API_URL = 'http://192.168.1.100:3000/api';

// // const getToken = async () => {
// //   try {
// //     return await AsyncStorage.getItem('authToken');
// //   } catch (error) {
// //     console.error('Error getting token:', error);
// //     return null;
// //   }
// // };

// // export const paymentService = {
// //   createRazorpayOrder: async (amount: number, orderId: string) => {
// //     try {
// //       console.log('📤 API URL:', API_URL);
// //       console.log('📤 Creating order with:', { amount, orderId });
      
// //       const response = await axios.post(
// //         `${API_URL}/payments/create-razorpay-order`,
// //         {
// //           amount,
// //           orderId,
// //           currency: 'INR',
// //         },
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //           },
// //           timeout: 30000,
// //         }
// //       );
      
// //       console.log('✅ Order created:', response.data);
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('❌ Create order error:', error);
// //       console.error('❌ Error message:', error.message);
      
// //       let errorMessage = 'Failed to create order. ';
// //       if (error.code === 'ECONNABORTED') {
// //         errorMessage += 'Request timed out.';
// //       } else if (error.message.includes('Network Error')) {
// //         errorMessage += 'Cannot reach server. Make sure backend is running on 10.0.2.2:3000';
// //       } else {
// //         errorMessage += error.message;
// //       }
      
// //       throw { success: false, message: errorMessage };
// //     }
// //   },

// //   verifyRazorpayPayment: async (data: {
// //     razorpay_order_id: string;
// //     razorpay_payment_id: string;
// //     razorpay_signature: string;
// //     orderId: string;
// //   }) => {
// //     try {
// //       const token = await getToken();
// //       const response = await axios.post(
// //         `${API_URL}/payments/verify-razorpay-payment`,
// //         data,
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Verify payment error:', error);
// //       throw error.response?.data || error.message;
// //     }
// //   },
// // };
// // src/services/paymentService.ts
// import axios from 'axios';
// import { API_URL } from '@env';

// // Use your actual API URL
// const API_BASE_URL = API_URL || 'http://localhost:3000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 30000,
// });

// // Request interceptor for logging
// api.interceptors.request.use(
//   (config) => {
//     console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for logging
// api.interceptors.response.use(
//   (response) => {
//     console.log(`📥 ${response.status} ${response.config.url}`);
//     return response;
//   },
//   (error) => {
//     console.error('❌ API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export interface PaymentData {
//   amount: number;
//   currency?: string;
//   userId?: string;
//   businessId?: string;
//   items?: any[];
//   deliveryAddress?: string;
//   customerName?: string;
//   customerEmail?: string;
//   customerPhone?: string;
//   receipt?: string;
// }

// export interface VerifyPaymentData {
//   order_id: string;
//   payment_id: string;
//   signature: string;
//   userId?: string;
//   businessId?: string;
// }

// export interface PaymentResponse {
//   success: boolean;
//   order?: {
//     id: string;
//     amount: number;
//     currency: string;
//     receipt: string;
//   };
//   error?: string;
// }

// export interface VerifyResponse {
//   success: boolean;
//   message?: string;
//   payment_id?: string;
//   order_id?: string;
//   error?: string;
// }

// class PaymentService {
//   // Create Razorpay order
//   async createOrder(data: PaymentData): Promise<PaymentResponse> {
//     try {
//       console.log('📦 Creating Razorpay order...', data);
      
//       const response = await api.post('/payment/create-order', {
//         amount: data.amount,
//         currency: data.currency || 'INR',
//         receipt: data.receipt || `order_${Date.now()}`,
//         userId: data.userId,
//         businessId: data.businessId,
//         items: data.items,
//         deliveryAddress: data.deliveryAddress,
//         customerName: data.customerName,
//         customerEmail: data.customerEmail,
//         customerPhone: data.customerPhone,
//       });

//       console.log('✅ Order created:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Create order error:', error);
//       return {
//         success: false,
//         error: error.response?.data?.error || error.message || 'Failed to create order',
//       };
//     }
//   }

//   // Verify Razorpay payment
//   async verifyPayment(data: VerifyPaymentData): Promise<VerifyResponse> {
//     try {
//       console.log('🔐 Verifying payment...', data);
      
//       const response = await api.post('/payment/verify-payment', {
//         order_id: data.order_id,
//         payment_id: data.payment_id,
//         signature: data.signature,
//         userId: data.userId,
//         businessId: data.businessId,
//       });

//       console.log('✅ Payment verified:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Verify payment error:', error);
//       return {
//         success: false,
//         error: error.response?.data?.error || error.message || 'Failed to verify payment',
//       };
//     }
//   }

//   // Get order status
//   async getOrderStatus(orderId: string): Promise<any> {
//     try {
//       console.log('📦 Fetching order status:', orderId);
      
//       const response = await api.get(`/payment/order/${orderId}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Get order error:', error);
//       return {
//         success: false,
//         error: error.response?.data?.error || error.message || 'Failed to fetch order',
//       };
//     }
//   }

//   // Refund payment
//   async refundPayment(paymentId: string, amount?: number, reason?: string): Promise<any> {
//     try {
//       console.log('💰 Processing refund:', { paymentId, amount, reason });
      
//       const response = await api.post('/payment/refund', {
//         payment_id: paymentId,
//         amount: amount,
//         reason: reason || 'Customer request',
//       });

//       console.log('✅ Refund processed:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Refund error:', error);
//       return {
//         success: false,
//         error: error.response?.data?.error || error.message || 'Failed to process refund',
//       };
//     }
//   }
// }

// // Export singleton instance
// export const paymentService = new PaymentService();
// export default paymentService;
// src/services/paymentService.ts
// import axios from 'axios';
// import { API_URL } from '@env';

// const API_BASE_URL = API_URL || 'http://localhost:3000/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 30000,
// });

// class PaymentService {
//   // Create Razorpay order
//   async createOrder(amount: number, currency: string = 'INR', orderId?: string) {
//     try {
//       console.log('📦 Creating Razorpay order...', { amount, currency, orderId });
      
//       const response = await api.post('/payments/create-razorpay-order', {
//         amount,
//         currency,
//         orderId,
//       });

//       console.log('✅ Order created:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Create order error:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || error.message || 'Failed to create order',
//       };
//     }
//   }

//   // Verify Razorpay payment
//   async verifyPayment(
//     razorpay_order_id: string,
//     razorpay_payment_id: string,
//     razorpay_signature: string,
//     orderId?: string
//   ) {
//     try {
//       console.log('🔐 Verifying payment...', { razorpay_order_id, razorpay_payment_id, orderId });
      
//       const response = await api.post('/payments/verify-razorpay-payment', {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         orderId,
//       });

//       console.log('✅ Payment verified:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Verify payment error:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || error.message || 'Failed to verify payment',
//       };
//     }
//   }

//   // Get order status
//   async getOrderStatus(orderId: string) {
//     try {
//       console.log('📦 Fetching order status:', orderId);
      
//       const response = await api.get(`/payments/order/${orderId}`);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Get order error:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || error.message || 'Failed to fetch order',
//       };
//     }
//   }

//   // Refund payment
//   async refundPayment(paymentId: string, amount?: number, reason?: string) {
//     try {
//       console.log('💰 Processing refund:', { paymentId, amount, reason });
      
//       const response = await api.post('/payments/refund', {
//         payment_id: paymentId,
//         amount: amount,
//         reason: reason || 'Customer request',
//       });

//       console.log('✅ Refund processed:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Refund error:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || error.message || 'Failed to process refund',
//       };
//     }
//   }

//   // Get payment methods
//   async getPaymentMethods() {
//     try {
//       console.log('📦 Fetching payment methods...');
      
//       const response = await api.get('/payments/methods');
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Get payment methods error:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || error.message || 'Failed to fetch payment methods',
//       };
//     }
//   }
// }

// export const paymentService = new PaymentService();
// export default paymentService;

// services/paymentService.ts
// import axios from 'axios';

// // Replace with your actual backend URL
// const API_URL = 'http://your-backend-url.com/api';

// // Your Razorpay Key ID (should be in .env)
// const RAZORPAY_KEY_ID = 'rzp_test_TLIXdlz3u6j6zP';

// interface CreateOrderResponse {
//   success: boolean;
//   order: {
//     id: string;
//     amount: number; // in paise
//     currency: string;
//     receipt: string;
//   };
//   key: string;
//   message?: string;
// }

// interface VerifyPaymentResponse {
//   success: boolean;
//   message?: string;
// }

// export const paymentService = {
//   // Create order on backend
//   async createOrder(amount: number, currency: string = 'INR'): Promise<CreateOrderResponse> {
//     try {
//       // Convert amount to paise (Razorpay requires amount in smallest currency unit)
//       const amountInPaise = Math.round(amount * 100);
      
//       console.log('💰 Creating order with amount:', amountInPaise, 'paise');

//       const response = await axios.post(`${API_URL}/create-order`, {
//         amount: amountInPaise,
//         currency: currency,
//         receipt: `receipt_${Date.now()}`,
//       });

//       console.log('✅ Order created successfully:', response.data);

//       return {
//         success: true,
//         order: response.data.order,
//         key: RAZORPAY_KEY_ID,
//       };
//     } catch (error: any) {
//       console.error('❌ Create order error:', error);
      
//       // Fallback: Create a dummy order for testing (REMOVE IN PRODUCTION)
//       console.warn('⚠️ Using fallback order for testing');
//       return {
//         success: true,
//         order: {
//           id: `order_${Date.now()}`,
//           amount: Math.round(amount * 100),
//           currency: 'INR',
//           receipt: `receipt_${Date.now()}`,
//         },
//         key: RAZORPAY_KEY_ID,
//       };
//     }
//   },

//   // Verify payment
//   async verifyPayment(
//     orderId: string,
//     paymentId: string,
//     signature: string,
//     orderReferenceId: string
//   ): Promise<VerifyPaymentResponse> {
//     try {
//       const response = await axios.post(`${API_URL}/verify-payment`, {
//         order_id: orderId,
//         payment_id: paymentId,
//         signature: signature,
//         order_reference_id: orderReferenceId,
//       });

//       return {
//         success: response.data.success,
//         message: response.data.message,
//       };
//     } catch (error: any) {
//       console.error('❌ Verification error:', error);
      
//       // For testing: Always return success if verification fails
//       console.warn('⚠️ Using fallback verification - payment assumed successful');
//       return {
//         success: true,
//         message: 'Payment verified successfully (test mode)',
//       };
//     }
//   },
// };
// services/paymentService.ts
// import RazorpayCheckout from 'react-native-razorpay';
// import axios from 'axios';

// // ✅ Your backend URL
// const BACKEND_URL = 'http://localhost:3000'; // For emulator
// // const BACKEND_URL = 'http://192.168.1.100:3000'; // For physical device

// export interface OrderResponse {
//   success: boolean;
//   order: {
//     id: string;
//     amount: number;
//     currency: string;
//     receipt: string;
//   };
//   key: string;
// }

// // ✅ Create order on backend
// export const createOrder = async (amount: number, currency: string = 'INR'): Promise<OrderResponse> => {
//   try {
//     console.log('📤 Creating order with amount:', amount);
    
//     const response = await axios.post(
//       `${BACKEND_URL}/api/payment/create-order`,
//       {
//         amount: amount,
//         currency: currency
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         timeout: 30000
//       }
//     );

//     console.log('📦 Order response:', response.data);
    
//     if (!response.data.success) {
//       throw new Error(response.data.error || 'Failed to create order');
//     }
    
//     return response.data;
//   } catch (error: any) {
//     console.error('❌ Create order error:', error.message);
    
//     if (error.response) {
//       console.error('Response data:', error.response.data);
//       console.error('Response status:', error.response.status);
//     }
    
//     // ✅ Fallback for testing - Remove in production
//     console.log('⚠️ Using fallback order for testing');
//     return {
//       success: true,
//       order: {
//         id: `order_${Date.now()}`,
//         amount: amount,
//         currency: currency,
//         receipt: `receipt_${Date.now()}`
//       },
//       key: 'rzp_test_TLIXdlz3u6j6zP'
//     };
//   }
// };

// // ✅ Open Razorpay Checkout
// export const openRazorpay = (options: any): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     console.log('💳 Opening Razorpay');
    
//     // Validate required options
//     if (!options.key) {
//       reject(new Error('Razorpay key is missing'));
//       return;
//     }
    
//     if (!options.order_id) {
//       reject(new Error('Order ID is missing'));
//       return;
//     }
    
//     RazorpayCheckout.open(options)
//       .then((data: any) => {
//         console.log('✅ Payment success:', data);
//         resolve(data);
//       })
//       .catch((error: any) => {
//         console.error('❌ Payment failed:', error);
//         reject(error);
//       });
//   });
// };

// // ✅ Verify payment on backend
// export const verifyPayment = async (paymentData: any): Promise<any> => {
//   try {
//     console.log('🔍 Verifying payment:', paymentData);
    
//     const response = await axios.post(
//       `${BACKEND_URL}/api/payment/verify-payment`,
//       {
//         order_id: paymentData.razorpay_order_id,
//         payment_id: paymentData.razorpay_payment_id,
//         signature: paymentData.razorpay_signature
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       }
//     );
    
//     console.log('✅ Verification response:', response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error('❌ Verification failed:', error.message);
    
//     if (error.response) {
//       console.error('Response data:', error.response.data);
//       console.error('Response status:', error.response.status);
//     }
    
//     throw error;
//   }
// };

// // ✅ Get order status
// export const getOrderStatus = async (orderId: string): Promise<any> => {
//   try {
//     const response = await axios.get(
//       `${BACKEND_URL}/api/payment/order-status/${orderId}`
//     );
//     return response.data;
//   } catch (error: any) {
//     console.error('❌ Get order status error:', error.message);
//     throw error;
//   }
// };

// Payment Service
import axios from 'axios';

// API base URL - replace with your actual backend URL
// const API_BASE_URL = 'https://your-backend-api.com/api';
// const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = "http://localhost:3000/api";
// const API_BASE_URL = 'http://10.0.2.2:3000/api';
// Define interfaces
interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
  };
  key: string;
  message?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Payment service object with methods
export const paymentService = {
  // Create Razorpay order
  createOrder: async (amount: number, currency: string = 'INR'): Promise<CreateOrderResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create-order`, {
        amount,
        currency,
      });

      if (response.data && response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      
      // Return mock data for development
      // if (__DEV__) {
      //   console.warn('Using mock order data for development');
      //   return {
      //     success: true,
      //     order: {
      //       id: 'order_' + Date.now(),
      //       amount: amount * 100, // Convert to paise
      //       currency: currency,
      //     },
      //     key: 'rzp_test_TLbdvn8dAvIQTX', // Your test key
      //   };
      // }
      
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (
    orderId: string,
    paymentId: string,
    signature: string,
    orderReference: string
  ): Promise<VerifyPaymentResponse> => {
    try {
      // const response = await axios.post(`${API_BASE_URL}/verify-payment`, {
      //   orderId,
      //   paymentId,
      //   signature,
      //   orderReference,
      // });
const response=await axios.post(`${API_BASE_URL}/verify-payment`, {
  order_id: orderId,
  payment_id: paymentId,
  signature,
});
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      
      // For development, return success
      // if (__DEV__) {
      //   console.warn('Using mock verification for development');
      //   return {
      //     success: true,
      //     message: 'Payment verified successfully',
      //   };
      // }
      
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment-status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId: string, amount?: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/refund-payment`, {
        paymentId,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  },
};

// If you want to use default export as well
export default paymentService;