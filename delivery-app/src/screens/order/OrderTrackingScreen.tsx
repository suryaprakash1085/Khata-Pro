// // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   ScrollView,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   StyleSheet,
// // // // // // // // // } from 'react-native';
// // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // import { colors } from '../../constants/colors';
// // // // // // // // // import { Order } from '../../types';

// // // // // // // // // export default function OrderTrackingScreen({ navigation, route }: any) {
// // // // // // // // //   const { orderId } = route.params || {};
// // // // // // // // //   const [orderStatus, setOrderStatus] = useState<Order['status']>('Preparing');
// // // // // // // // //   const [elapsedTime, setElapsedTime] = useState<number>(0);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const timer = setInterval(() => {
// // // // // // // // //       setElapsedTime(prev => prev + 1);
// // // // // // // // //       if (elapsedTime === 60) setOrderStatus('Preparing');
// // // // // // // // //       else if (elapsedTime === 120) setOrderStatus('Ready');
// // // // // // // // //       else if (elapsedTime === 180) setOrderStatus('On the way');
// // // // // // // // //       else if (elapsedTime === 240) setOrderStatus('Delivered');
// // // // // // // // //     }, 1000);

// // // // // // // // //     return () => clearInterval(timer);
// // // // // // // // //   }, [elapsedTime]);

// // // // // // // // //   const getStatusDetails = (): { icon: string; label: string; progress: number } => {
// // // // // // // // //     switch (orderStatus) {
// // // // // // // // //       case 'Preparing':
// // // // // // // // //         return { icon: 'restaurant-outline', label: 'Preparing your order', progress: 25 };
// // // // // // // // //       case 'Ready':
// // // // // // // // //         return { icon: 'checkmark-circle-outline', label: 'Order is ready', progress: 50 };
// // // // // // // // //       case 'On the way':
// // // // // // // // //         return { icon: 'bicycle-outline', label: 'On the way', progress: 75 };
// // // // // // // // //       case 'Delivered':
// // // // // // // // //         return { icon: 'checkmark-done-circle-outline', label: 'Delivered', progress: 100 };
// // // // // // // // //       default:
// // // // // // // // //         return { icon: 'time-outline', label: 'Order placed', progress: 10 };
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const statusDetails = getStatusDetails();

// // // // // // // // //   const steps: { id: string; label: string }[] = [
// // // // // // // // //     { id: 'placed', label: 'Order Placed' },
// // // // // // // // //     { id: 'preparing', label: 'Preparing' },
// // // // // // // // //     { id: 'ready', label: 'Ready' },
// // // // // // // // //     { id: 'on_way', label: 'On the Way' },
// // // // // // // // //     { id: 'delivered', label: 'Delivered' },
// // // // // // // // //   ];

// // // // // // // // //   const getStepStatus = (stepId: string): 'completed' | 'active' | 'pending' => {
// // // // // // // // //     const stepIndex = steps.findIndex(s => s.id === stepId);
// // // // // // // // //     const currentIndex = steps.findIndex(s => s.id === orderStatus.toLowerCase().replace(/ /g, '_'));
// // // // // // // // //     if (stepIndex < currentIndex) return 'completed';
// // // // // // // // //     if (stepIndex === currentIndex) return 'active';
// // // // // // // // //     return 'pending';
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // //         {/* Header */}
// // // // // // // // //         <View style={styles.header}>
// // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //           <Text style={styles.headerTitle}>Order Tracking</Text>
// // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // //         </View>

// // // // // // // // //         {/* Order Info */}
// // // // // // // // //         <View style={styles.orderInfo}>
// // // // // // // // //           <Text style={styles.orderNumber}>Order #{orderId || '156680718886280'}</Text>
// // // // // // // // //           <Text style={styles.orderTime}>06:26 PM • 12 items • ₹654</Text>
// // // // // // // // //           <View style={styles.statusContainer}>
// // // // // // // // //             <Icon name={statusDetails.icon} size={24} color={colors.primary} />
// // // // // // // // //             <View style={styles.statusTextContainer}>
// // // // // // // // //               <Text style={styles.statusLabel}>{statusDetails.label}</Text>
// // // // // // // // //               <Text style={styles.statusSublabel}>
// // // // // // // // //                 {orderStatus === 'Delivered' ? 'Enjoy your meal!' : 'Your order is being prepared'}
// // // // // // // // //               </Text>
// // // // // // // // //             </View>
// // // // // // // // //           </View>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Progress Bar */}
// // // // // // // // //         <View style={styles.progressContainer}>
// // // // // // // // //           <View style={styles.progressBar}>
// // // // // // // // //             <View style={[styles.progressFill, { width: `${statusDetails.progress}%` }]} />
// // // // // // // // //           </View>
// // // // // // // // //           <Text style={styles.progressText}>{statusDetails.progress}% complete</Text>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Steps */}
// // // // // // // // //         <View style={styles.stepsContainer}>
// // // // // // // // //           {steps.map((step, index) => {
// // // // // // // // //             const stepStatus = getStepStatus(step.id);
// // // // // // // // //             const isCompleted = stepStatus === 'completed';
// // // // // // // // //             const isActive = stepStatus === 'active';

// // // // // // // // //             return (
// // // // // // // // //               <View key={step.id} style={styles.step}>
// // // // // // // // //                 <View style={styles.stepIconContainer}>
// // // // // // // // //                   <View style={[
// // // // // // // // //                     styles.stepCircle,
// // // // // // // // //                     isCompleted && styles.stepCompleted,
// // // // // // // // //                     isActive && styles.stepActive,
// // // // // // // // //                   ]}>
// // // // // // // // //                     {isCompleted || isActive ? (
// // // // // // // // //                       <Icon name="checkmark" size={16} color={colors.white} />
// // // // // // // // //                     ) : (
// // // // // // // // //                       <Text style={styles.stepNumber}>{index + 1}</Text>
// // // // // // // // //                     )}
// // // // // // // // //                   </View>
// // // // // // // // //                   {index < steps.length - 1 && (
// // // // // // // // //                     <View style={[
// // // // // // // // //                       styles.stepLine,
// // // // // // // // //                       isCompleted && styles.stepLineCompleted,
// // // // // // // // //                     ]} />
// // // // // // // // //                   )}
// // // // // // // // //                 </View>
// // // // // // // // //                 <Text style={[
// // // // // // // // //                   styles.stepLabel,
// // // // // // // // //                   (isCompleted || isActive) && styles.stepLabelActive,
// // // // // // // // //                 ]}>
// // // // // // // // //                   {step.label}
// // // // // // // // //                 </Text>
// // // // // // // // //               </View>
// // // // // // // // //             );
// // // // // // // // //           })}
// // // // // // // // //         </View>

// // // // // // // // //         {/* Delivery Info */}
// // // // // // // // //         <View style={styles.deliveryInfo}>
// // // // // // // // //           <View style={styles.deliveryHeader}>
// // // // // // // // //             <Icon name="person-outline" size={20} color={colors.text} />
// // // // // // // // //             <Text style={styles.deliveryTitle}>Delivery Partner</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <View style={styles.deliveryDetails}>
// // // // // // // // //             <Text style={styles.deliveryName}>Mohd Ahmed</Text>
// // // // // // // // //             <Text style={styles.deliveryStatus}>On the way to deliver your order</Text>
// // // // // // // // //             <TouchableOpacity style={styles.contactButton}>
// // // // // // // // //               <Icon name="call-outline" size={20} color={colors.primary} />
// // // // // // // // //               <Text style={styles.contactButtonText}>Contact</Text>
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           </View>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Delivery Address */}
// // // // // // // // //         <View style={styles.addressContainer}>
// // // // // // // // //           <View style={styles.addressHeader}>
// // // // // // // // //             <Icon name="location-outline" size={20} color={colors.primary} />
// // // // // // // // //             <Text style={styles.addressTitle}>Delivery Address</Text>
// // // // // // // // //           </View>
// // // // // // // // //           <Text style={styles.addressText}>
// // // // // // // // //             Home - A-7, Sushil Apartment, Ramdas Colony, Nashik, Maharashtra 422005
// // // // // // // // //           </Text>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Cancel Order */}
// // // // // // // // //         {orderStatus !== 'Delivered' && (
// // // // // // // // //           <TouchableOpacity style={styles.cancelButton}>
// // // // // // // // //             <Text style={styles.cancelButtonText}>Cancel Order</Text>
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //         )}
// // // // // // // // //       </ScrollView>
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //   },
// // // // // // // // //   header: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     padding: 16,
// // // // // // // // //     paddingTop: 40,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   headerTitle: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   orderInfo: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   orderNumber: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   orderTime: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   statusContainer: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginTop: 12,
// // // // // // // // //   },
// // // // // // // // //   statusTextContainer: {
// // // // // // // // //     marginLeft: 12,
// // // // // // // // //   },
// // // // // // // // //   statusLabel: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   statusSublabel: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   progressContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   progressBar: {
// // // // // // // // //     height: 6,
// // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // //     borderRadius: 3,
// // // // // // // // //     overflow: 'hidden',
// // // // // // // // //   },
// // // // // // // // //   progressFill: {
// // // // // // // // //     height: '100%',
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //     borderRadius: 3,
// // // // // // // // //   },
// // // // // // // // //   progressText: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   stepsContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   step: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //   },
// // // // // // // // //   stepIconContainer: {
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },
// // // // // // // // //   stepCircle: {
// // // // // // // // //     width: 28,
// // // // // // // // //     height: 28,
// // // // // // // // //     borderRadius: 14,
// // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   stepCompleted: {
// // // // // // // // //     backgroundColor: colors.success,
// // // // // // // // //   },
// // // // // // // // //   stepActive: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //   },
// // // // // // // // //   stepNumber: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: colors.text,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   stepLine: {
// // // // // // // // //     width: 2,
// // // // // // // // //     height: 24,
// // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // //     marginVertical: 4,
// // // // // // // // //   },
// // // // // // // // //   stepLineCompleted: {
// // // // // // // // //     backgroundColor: colors.success,
// // // // // // // // //   },
// // // // // // // // //   stepLabel: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //   },
// // // // // // // // //   stepLabelActive: {
// // // // // // // // //     color: colors.text,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //   },
// // // // // // // // //   deliveryInfo: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   deliveryHeader: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   deliveryTitle: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //     marginLeft: 8,
// // // // // // // // //   },
// // // // // // // // //   deliveryDetails: {
// // // // // // // // //     marginLeft: 28,
// // // // // // // // //   },
// // // // // // // // //   deliveryName: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   deliveryStatus: {
// // // // // // // // //     fontSize: 13,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   contactButton: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginTop: 8,
// // // // // // // // //     paddingVertical: 6,
// // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: colors.primary,
// // // // // // // // //     borderRadius: 6,
// // // // // // // // //     alignSelf: 'flex-start',
// // // // // // // // //   },
// // // // // // // // //   contactButtonText: {
// // // // // // // // //     color: colors.primary,
// // // // // // // // //     marginLeft: 6,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //   },
// // // // // // // // //   addressContainer: {
// // // // // // // // //     padding: 16,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   addressHeader: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 8,
// // // // // // // // //   },
// // // // // // // // //   addressTitle: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //     marginLeft: 8,
// // // // // // // // //   },
// // // // // // // // //   addressText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginLeft: 28,
// // // // // // // // //   },
// // // // // // // // //   cancelButton: {
// // // // // // // // //     margin: 16,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: colors.danger,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   cancelButtonText: {
// // // // // // // // //     color: colors.danger,
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //   },
// // // // // // // // // });
// // // // // // // // // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   ScrollView,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   StyleSheet,
// // // // // // // //   SafeAreaView,
// // // // // // // //   StatusBar,
// // // // // // // // } from 'react-native';
// // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // interface OrderTrackingScreenProps {
// // // // // // // //   navigation: any;
// // // // // // // //   route: any;
// // // // // // // // }

// // // // // // // // const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
// // // // // // // //   const { orderId, total, items, paymentMethod, paymentStatus } = route.params || {};
  
// // // // // // // //   const [orderStatus, setOrderStatus] = useState<string>('Placed');
// // // // // // // //   const [progress, setProgress] = useState<number>(0);

// // // // // // // //   // Order status flow
// // // // // // // //   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
// // // // // // // //   const currentStep = statusFlow.indexOf(orderStatus);

// // // // // // // //   useEffect(() => {
// // // // // // // //     // Simulate order progress
// // // // // // // //     const interval = setInterval(() => {
// // // // // // // //       setProgress(prev => {
// // // // // // // //         if (prev >= 100) {
// // // // // // // //           clearInterval(interval);
// // // // // // // //           return 100;
// // // // // // // //         }
// // // // // // // //         return prev + 1;
// // // // // // // //       });
// // // // // // // //     }, 3000);

// // // // // // // //     return () => clearInterval(interval);
// // // // // // // //   }, []);

// // // // // // // //   // Update status based on progress
// // // // // // // //   useEffect(() => {
// // // // // // // //     if (progress < 20) setOrderStatus('Placed');
// // // // // // // //     else if (progress < 40) setOrderStatus('Preparing');
// // // // // // // //     else if (progress < 60) setOrderStatus('Ready');
// // // // // // // //     else if (progress < 80) setOrderStatus('On the way');
// // // // // // // //     else if (progress >= 80) setOrderStatus('Delivered');
// // // // // // // //   }, [progress]);

// // // // // // // //   const getStatusColor = (status: string) => {
// // // // // // // //     switch (status) {
// // // // // // // //       case 'Placed': return '#ffc107';
// // // // // // // //       case 'Preparing': return '#17a2b8';
// // // // // // // //       case 'Ready': return '#28a745';
// // // // // // // //       case 'On the way': return '#fc8019';
// // // // // // // //       case 'Delivered': return '#28a745';
// // // // // // // //       default: return '#7e808c';
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const getStatusIcon = (status: string) => {
// // // // // // // //     switch (status) {
// // // // // // // //       case 'Placed': return 'time-outline';
// // // // // // // //       case 'Preparing': return 'cafe-outline';
// // // // // // // //       case 'Ready': return 'checkmark-circle-outline';
// // // // // // // //       case 'On the way': return 'bicycle-outline';
// // // // // // // //       case 'Delivered': return 'checkmark-done-circle-outline';
// // // // // // // //       default: return 'ellipse-outline';
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const getStatusMessage = (status: string) => {
// // // // // // // //     switch (status) {
// // // // // // // //       case 'Placed': return 'Your order has been placed';
// // // // // // // //       case 'Preparing': return 'Your order is being prepared';
// // // // // // // //       case 'Ready': return 'Your order is ready for delivery';
// // // // // // // //       case 'On the way': return 'Your order is on the way!';
// // // // // // // //       case 'Delivered': return 'Your order has been delivered! 🎉';
// // // // // // // //       default: return 'Processing your order';
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const getStepStatus = (step: string) => {
// // // // // // // //     const stepIndex = statusFlow.indexOf(step);
// // // // // // // //     if (stepIndex < currentStep) return 'completed';
// // // // // // // //     if (stepIndex === currentStep) return 'active';
// // // // // // // //     return 'pending';
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // // //       {/* Header */}
// // // // // // // //       <View style={styles.header}>
// // // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //         <Text style={styles.headerTitle}>Order Tracking</Text>
// // // // // // // //         <View style={styles.headerRight} />
// // // // // // // //       </View>

// // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // //         {/* Order ID */}
// // // // // // // //         <View style={styles.orderIdContainer}>
// // // // // // // //           <Text style={styles.orderIdLabel}>Order ID</Text>
// // // // // // // //           <Text style={styles.orderId}>{orderId || 'ORD-123456'}</Text>
// // // // // // // //         </View>

// // // // // // // //         {/* Status Progress */}
// // // // // // // //         <View style={styles.progressContainer}>
// // // // // // // //           <Text style={styles.statusTitle}>
// // // // // // // //             {getStatusMessage(orderStatus)}
// // // // // // // //           </Text>
// // // // // // // //           <View style={styles.statusBadge}>
// // // // // // // //             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
// // // // // // // //             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
// // // // // // // //               {orderStatus}
// // // // // // // //             </Text>
// // // // // // // //           </View>
// // // // // // // //         </View>

// // // // // // // //         {/* Progress Bar */}
// // // // // // // //         <View style={styles.progressBarContainer}>
// // // // // // // //           <View style={styles.progressBar}>
// // // // // // // //             <View style={[styles.progressFill, { width: `${progress}%` }]} />
// // // // // // // //           </View>
// // // // // // // //           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
// // // // // // // //         </View>

// // // // // // // //         {/* Order Steps */}
// // // // // // // //         <View style={styles.stepsContainer}>
// // // // // // // //           {statusFlow.map((step, index) => {
// // // // // // // //             const status = getStepStatus(step);
// // // // // // // //             const isCompleted = status === 'completed';
// // // // // // // //             const isActive = status === 'active';
            
// // // // // // // //             return (
// // // // // // // //               <View key={index} style={styles.stepItem}>
// // // // // // // //                 <View style={styles.stepIndicator}>
// // // // // // // //                   <View style={[
// // // // // // // //                     styles.stepCircle,
// // // // // // // //                     isCompleted && styles.stepCircleCompleted,
// // // // // // // //                     isActive && styles.stepCircleActive,
// // // // // // // //                   ]}>
// // // // // // // //                     {isCompleted ? (
// // // // // // // //                       <Icon name="checkmark" size={16} color="#ffffff" />
// // // // // // // //                     ) : isActive ? (
// // // // // // // //                       <View style={styles.stepPulse} />
// // // // // // // //                     ) : (
// // // // // // // //                       <View style={styles.stepDot} />
// // // // // // // //                     )}
// // // // // // // //                   </View>
// // // // // // // //                   {index < statusFlow.length - 1 && (
// // // // // // // //                     <View style={[
// // // // // // // //                       styles.stepLine,
// // // // // // // //                       isCompleted && styles.stepLineCompleted,
// // // // // // // //                     ]} />
// // // // // // // //                   )}
// // // // // // // //                 </View>
// // // // // // // //                 <View style={styles.stepContent}>
// // // // // // // //                   <Text style={[
// // // // // // // //                     styles.stepLabel,
// // // // // // // //                     isCompleted && styles.stepLabelCompleted,
// // // // // // // //                     isActive && styles.stepLabelActive,
// // // // // // // //                   ]}>
// // // // // // // //                     {step}
// // // // // // // //                   </Text>
// // // // // // // //                   {isActive && (
// // // // // // // //                     <Text style={styles.stepSubtext}>In progress</Text>
// // // // // // // //                   )}
// // // // // // // //                   {isCompleted && (
// // // // // // // //                     <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
// // // // // // // //                   )}
// // // // // // // //                 </View>
// // // // // // // //               </View>
// // // // // // // //             );
// // // // // // // //           })}
// // // // // // // //         </View>

// // // // // // // //         {/* Order Details */}
// // // // // // // //         <View style={styles.detailsCard}>
// // // // // // // //           <Text style={styles.detailsTitle}>Order Details</Text>
          
// // // // // // // //           <View style={styles.detailRow}>
// // // // // // // //             <Text style={styles.detailLabel}>Payment Method</Text>
// // // // // // // //             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
// // // // // // // //           </View>
          
// // // // // // // //           <View style={styles.detailRow}>
// // // // // // // //             <Text style={styles.detailLabel}>Payment Status</Text>
// // // // // // // //             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
// // // // // // // //               {paymentStatus || 'Pending'}
// // // // // // // //             </Text>
// // // // // // // //           </View>
          
// // // // // // // //           <View style={styles.detailRow}>
// // // // // // // //             <Text style={styles.detailLabel}>Total Amount</Text>
// // // // // // // //             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
// // // // // // // //           </View>
          
// // // // // // // //           <View style={styles.detailRow}>
// // // // // // // //             <Text style={styles.detailLabel}>Items</Text>
// // // // // // // //             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
// // // // // // // //           </View>
// // // // // // // //         </View>

// // // // // // // //         {/* Items List */}
// // // // // // // //         {items && items.length > 0 && (
// // // // // // // //           <View style={styles.itemsCard}>
// // // // // // // //             <Text style={styles.itemsTitle}>Items</Text>
// // // // // // // //             {items.map((item: any, index: number) => (
// // // // // // // //               <View key={index} style={styles.itemRow}>
// // // // // // // //                 <View style={styles.itemInfo}>
// // // // // // // //                   <Text style={styles.itemName}>{item.name}</Text>
// // // // // // // //                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
// // // // // // // //                 </View>
// // // // // // // //                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
// // // // // // // //               </View>
// // // // // // // //             ))}
// // // // // // // //           </View>
// // // // // // // //         )}

// // // // // // // //         <View style={styles.bottomPadding} />
// // // // // // // //       </ScrollView>
// // // // // // // //     </SafeAreaView>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // //   },
// // // // // // // //   header: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f0',
// // // // // // // //   },
// // // // // // // //   backButton: {
// // // // // // // //     padding: 4,
// // // // // // // //   },
// // // // // // // //   headerTitle: {
// // // // // // // //     flex: 1,
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     textAlign: 'center',
// // // // // // // //     marginRight: 32,
// // // // // // // //   },
// // // // // // // //   headerRight: {
// // // // // // // //     width: 32,
// // // // // // // //   },
// // // // // // // //   orderIdContainer: {
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     margin: 16,
// // // // // // // //     padding: 16,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     shadowColor: '#000',
// // // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // // //     shadowOpacity: 0.05,
// // // // // // // //     shadowRadius: 4,
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   orderIdLabel: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: '#7e808c',
// // // // // // // //   },
// // // // // // // //   orderId: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   progressContainer: {
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     marginHorizontal: 16,
// // // // // // // //     padding: 20,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     shadowColor: '#000',
// // // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // // //     shadowOpacity: 0.05,
// // // // // // // //     shadowRadius: 4,
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   statusTitle: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginBottom: 8,
// // // // // // // //   },
// // // // // // // //   statusBadge: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 6,
// // // // // // // //     borderRadius: 16,
// // // // // // // //   },
// // // // // // // //   statusText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     marginLeft: 6,
// // // // // // // //   },
// // // // // // // //   progressBarContainer: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginHorizontal: 16,
// // // // // // // //     marginTop: 16,
// // // // // // // //   },
// // // // // // // //   progressBar: {
// // // // // // // //     flex: 1,
// // // // // // // //     height: 8,
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //     borderRadius: 4,
// // // // // // // //     overflow: 'hidden',
// // // // // // // //   },
// // // // // // // //   progressFill: {
// // // // // // // //     height: '100%',
// // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // //     borderRadius: 4,
// // // // // // // //   },
// // // // // // // //   progressPercentage: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#fc8019',
// // // // // // // //     marginLeft: 12,
// // // // // // // //     minWidth: 40,
// // // // // // // //     textAlign: 'right',
// // // // // // // //   },
// // // // // // // //   stepsContainer: {
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     margin: 16,
// // // // // // // //     padding: 20,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     shadowColor: '#000',
// // // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // // //     shadowOpacity: 0.05,
// // // // // // // //     shadowRadius: 4,
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   stepItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     marginBottom: 16,
// // // // // // // //   },
// // // // // // // //   stepIndicator: {
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginRight: 16,
// // // // // // // //     position: 'relative',
// // // // // // // //   },
// // // // // // // //   stepCircle: {
// // // // // // // //     width: 32,
// // // // // // // //     height: 32,
// // // // // // // //     borderRadius: 16,
// // // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     zIndex: 1,
// // // // // // // //   },
// // // // // // // //   stepCircleCompleted: {
// // // // // // // //     backgroundColor: '#28a745',
// // // // // // // //   },
// // // // // // // //   stepCircleActive: {
// // // // // // // //     backgroundColor: '#fc8019',
// // // // // // // //   },
// // // // // // // //   stepPulse: {
// // // // // // // //     width: 12,
// // // // // // // //     height: 12,
// // // // // // // //     borderRadius: 6,
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     borderWidth: 2,
// // // // // // // //     borderColor: '#fc8019',
// // // // // // // //   },
// // // // // // // //   stepDot: {
// // // // // // // //     width: 8,
// // // // // // // //     height: 8,
// // // // // // // //     borderRadius: 4,
// // // // // // // //     backgroundColor: '#d0d0d0',
// // // // // // // //   },
// // // // // // // //   stepLine: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     top: 32,
// // // // // // // //     width: 2,
// // // // // // // //     height: 40,
// // // // // // // //     backgroundColor: '#e0e0e0',
// // // // // // // //   },
// // // // // // // //   stepLineCompleted: {
// // // // // // // //     backgroundColor: '#28a745',
// // // // // // // //   },
// // // // // // // //   stepContent: {
// // // // // // // //     flex: 1,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //   },
// // // // // // // //   stepLabel: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //   },
// // // // // // // //   stepLabelCompleted: {
// // // // // // // //     color: '#28a745',
// // // // // // // //     fontWeight: '500',
// // // // // // // //   },
// // // // // // // //   stepLabelActive: {
// // // // // // // //     color: '#fc8019',
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   stepSubtext: {
// // // // // // // //     fontSize: 11,
// // // // // // // //     color: '#fc8019',
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   stepSubtextCompleted: {
// // // // // // // //     fontSize: 11,
// // // // // // // //     color: '#28a745',
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   detailsCard: {
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     marginHorizontal: 16,
// // // // // // // //     padding: 16,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     marginTop: 16,
// // // // // // // //     shadowColor: '#000',
// // // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // // //     shadowOpacity: 0.05,
// // // // // // // //     shadowRadius: 4,
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   detailsTitle: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   detailRow: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     paddingVertical: 6,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   detailLabel: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //   },
// // // // // // // //   detailValue: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#282c3f',
// // // // // // // //     fontWeight: '500',
// // // // // // // //   },
// // // // // // // //   detailValueTotal: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: '#fc8019',
// // // // // // // //   },
// // // // // // // //   itemsCard: {
// // // // // // // //     backgroundColor: '#ffffff',
// // // // // // // //     marginHorizontal: 16,
// // // // // // // //     padding: 16,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     marginTop: 16,
// // // // // // // //     shadowColor: '#000',
// // // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // // //     shadowOpacity: 0.05,
// // // // // // // //     shadowRadius: 4,
// // // // // // // //     elevation: 2,
// // // // // // // //   },
// // // // // // // //   itemsTitle: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: '#282c3f',
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   itemRow: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 8,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // // //   },
// // // // // // // //   itemInfo: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   itemName: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   itemQuantity: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#7e808c',
// // // // // // // //     marginLeft: 6,
// // // // // // // //   },
// // // // // // // //   itemPrice: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: '#282c3f',
// // // // // // // //   },
// // // // // // // //   bottomPadding: {
// // // // // // // //     height: 30,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // // export default OrderTrackingScreen;
// // // // // // // // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   ScrollView,
// // // // // // //   TouchableOpacity,
// // // // // // //   StyleSheet,
// // // // // // //   SafeAreaView,
// // // // // // //   StatusBar,
// // // // // // // } from 'react-native';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // import { colors } from '../../constants/colors';

// // // // // // // interface OrderTrackingScreenProps {
// // // // // // //   navigation: any;
// // // // // // //   route: any;
// // // // // // // }

// // // // // // // const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
// // // // // // //   const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
  
// // // // // // //   const [orderStatus, setOrderStatus] = useState<string>('Placed');
// // // // // // //   const [progress, setProgress] = useState<number>(0);

// // // // // // //   // Order status flow
// // // // // // //   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
// // // // // // //   const currentStep = statusFlow.indexOf(orderStatus);

// // // // // // //   useEffect(() => {
// // // // // // //     // Simulate order progress
// // // // // // //     const interval = setInterval(() => {
// // // // // // //       setProgress(prev => {
// // // // // // //         if (prev >= 100) {
// // // // // // //           clearInterval(interval);
// // // // // // //           return 100;
// // // // // // //         }
// // // // // // //         return prev + 1;
// // // // // // //       });
// // // // // // //     }, 3000);

// // // // // // //     return () => clearInterval(interval);
// // // // // // //   }, []);

// // // // // // //   // Update status based on progress
// // // // // // //   useEffect(() => {
// // // // // // //     if (progress < 20) setOrderStatus('Placed');
// // // // // // //     else if (progress < 40) setOrderStatus('Preparing');
// // // // // // //     else if (progress < 60) setOrderStatus('Ready');
// // // // // // //     else if (progress < 80) setOrderStatus('On the way');
// // // // // // //     else if (progress >= 80) setOrderStatus('Delivered');
// // // // // // //   }, [progress]);

// // // // // // //   const getStatusColor = (status: string) => {
// // // // // // //     switch (status) {
// // // // // // //       case 'Placed': return '#ffc107';
// // // // // // //       case 'Preparing': return '#17a2b8';
// // // // // // //       case 'Ready': return '#28a745';
// // // // // // //       case 'On the way': return '#fc8019';
// // // // // // //       case 'Delivered': return '#28a745';
// // // // // // //       default: return '#7e808c';
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const getStatusIcon = (status: string) => {
// // // // // // //     switch (status) {
// // // // // // //       case 'Placed': return 'time-outline';
// // // // // // //       case 'Preparing': return 'cafe-outline';
// // // // // // //       case 'Ready': return 'checkmark-circle-outline';
// // // // // // //       case 'On the way': return 'bicycle-outline';
// // // // // // //       case 'Delivered': return 'checkmark-done-circle-outline';
// // // // // // //       default: return 'ellipse-outline';
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const getStatusMessage = (status: string) => {
// // // // // // //     switch (status) {
// // // // // // //       case 'Placed': return 'Your order has been placed';
// // // // // // //       case 'Preparing': return 'Your order is being prepared';
// // // // // // //       case 'Ready': return 'Your order is ready for delivery';
// // // // // // //       case 'On the way': return 'Your order is on the way!';
// // // // // // //       case 'Delivered': return 'Your order has been delivered! 🎉';
// // // // // // //       default: return 'Processing your order';
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const getStepStatus = (step: string) => {
// // // // // // //     const stepIndex = statusFlow.indexOf(step);
// // // // // // //     if (stepIndex < currentStep) return 'completed';
// // // // // // //     if (stepIndex === currentStep) return 'active';
// // // // // // //     return 'pending';
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <SafeAreaView style={styles.container}>
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // // //       {/* Header */}
// // // // // // //       <View style={styles.header}>
// // // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // // //         </TouchableOpacity>
// // // // // // //         <Text style={styles.headerTitle}>Order Tracking</Text>
// // // // // // //         <View style={styles.headerRight} />
// // // // // // //       </View>

// // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // //         {/* Restaurant Name */}
// // // // // // //         <View style={styles.restaurantContainer}>
// // // // // // //           <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
// // // // // // //         </View>

// // // // // // //         {/* Order ID */}
// // // // // // //         <View style={styles.orderIdContainer}>
// // // // // // //           <Text style={styles.orderIdLabel}>Order ID</Text>
// // // // // // //           <Text style={styles.orderId}>{orderId || 'ORD-123456'}</Text>
// // // // // // //         </View>

// // // // // // //         {/* Status Progress */}
// // // // // // //         <View style={styles.progressContainer}>
// // // // // // //           <Text style={styles.statusTitle}>
// // // // // // //             {getStatusMessage(orderStatus)}
// // // // // // //           </Text>
// // // // // // //           <View style={styles.statusBadge}>
// // // // // // //             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
// // // // // // //             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
// // // // // // //               {orderStatus}
// // // // // // //             </Text>
// // // // // // //           </View>
// // // // // // //         </View>

// // // // // // //         {/* Progress Bar */}
// // // // // // //         <View style={styles.progressBarContainer}>
// // // // // // //           <View style={styles.progressBar}>
// // // // // // //             <View style={[styles.progressFill, { width: `${progress}%` }]} />
// // // // // // //           </View>
// // // // // // //           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
// // // // // // //         </View>

// // // // // // //         {/* Order Steps */}
// // // // // // //         <View style={styles.stepsContainer}>
// // // // // // //           {statusFlow.map((step, index) => {
// // // // // // //             const status = getStepStatus(step);
// // // // // // //             const isCompleted = status === 'completed';
// // // // // // //             const isActive = status === 'active';
            
// // // // // // //             return (
// // // // // // //               <View key={index} style={styles.stepItem}>
// // // // // // //                 <View style={styles.stepIndicator}>
// // // // // // //                   <View style={[
// // // // // // //                     styles.stepCircle,
// // // // // // //                     isCompleted && styles.stepCircleCompleted,
// // // // // // //                     isActive && styles.stepCircleActive,
// // // // // // //                   ]}>
// // // // // // //                     {isCompleted ? (
// // // // // // //                       <Icon name="checkmark" size={16} color="#ffffff" />
// // // // // // //                     ) : isActive ? (
// // // // // // //                       <View style={styles.stepPulse} />
// // // // // // //                     ) : (
// // // // // // //                       <View style={styles.stepDot} />
// // // // // // //                     )}
// // // // // // //                   </View>
// // // // // // //                   {index < statusFlow.length - 1 && (
// // // // // // //                     <View style={[
// // // // // // //                       styles.stepLine,
// // // // // // //                       isCompleted && styles.stepLineCompleted,
// // // // // // //                     ]} />
// // // // // // //                   )}
// // // // // // //                 </View>
// // // // // // //                 <View style={styles.stepContent}>
// // // // // // //                   <Text style={[
// // // // // // //                     styles.stepLabel,
// // // // // // //                     isCompleted && styles.stepLabelCompleted,
// // // // // // //                     isActive && styles.stepLabelActive,
// // // // // // //                   ]}>
// // // // // // //                     {step}
// // // // // // //                   </Text>
// // // // // // //                   {isActive && (
// // // // // // //                     <Text style={styles.stepSubtext}>In progress</Text>
// // // // // // //                   )}
// // // // // // //                   {isCompleted && (
// // // // // // //                     <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
// // // // // // //                   )}
// // // // // // //                 </View>
// // // // // // //               </View>
// // // // // // //             );
// // // // // // //           })}
// // // // // // //         </View>

// // // // // // //         {/* Order Details */}
// // // // // // //         <View style={styles.detailsCard}>
// // // // // // //           <Text style={styles.detailsTitle}>Order Details</Text>
          
// // // // // // //           <View style={styles.detailRow}>
// // // // // // //             <Text style={styles.detailLabel}>Payment Method</Text>
// // // // // // //             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
// // // // // // //           </View>
          
// // // // // // //           <View style={styles.detailRow}>
// // // // // // //             <Text style={styles.detailLabel}>Payment Status</Text>
// // // // // // //             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
// // // // // // //               {paymentStatus || 'Pending'}
// // // // // // //             </Text>
// // // // // // //           </View>
          
// // // // // // //           <View style={styles.detailRow}>
// // // // // // //             <Text style={styles.detailLabel}>Total Amount</Text>
// // // // // // //             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
// // // // // // //           </View>
          
// // // // // // //           <View style={styles.detailRow}>
// // // // // // //             <Text style={styles.detailLabel}>Items</Text>
// // // // // // //             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
// // // // // // //           </View>
// // // // // // //         </View>

// // // // // // //         {/* Items List */}
// // // // // // //         {items && items.length > 0 && (
// // // // // // //           <View style={styles.itemsCard}>
// // // // // // //             <Text style={styles.itemsTitle}>Items</Text>
// // // // // // //             {items.map((item: any, index: number) => (
// // // // // // //               <View key={index} style={styles.itemRow}>
// // // // // // //                 <View style={styles.itemInfo}>
// // // // // // //                   <Text style={styles.itemName}>{item.name}</Text>
// // // // // // //                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
// // // // // // //                 </View>
// // // // // // //                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
// // // // // // //               </View>
// // // // // // //             ))}
// // // // // // //           </View>
// // // // // // //         )}

// // // // // // //         <View style={styles.bottomPadding} />
// // // // // // //       </ScrollView>
// // // // // // //     </SafeAreaView>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // //   },
// // // // // // //   header: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 12,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f0',
// // // // // // //   },
// // // // // // //   backButton: {
// // // // // // //     padding: 4,
// // // // // // //   },
// // // // // // //   headerTitle: {
// // // // // // //     flex: 1,
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     textAlign: 'center',
// // // // // // //     marginRight: 32,
// // // // // // //   },
// // // // // // //   headerRight: {
// // // // // // //     width: 32,
// // // // // // //   },
// // // // // // //   restaurantContainer: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     margin: 16,
// // // // // // //     padding: 16,
// // // // // // //     borderRadius: 12,
// // // // // // //     alignItems: 'center',
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.05,
// // // // // // //     shadowRadius: 4,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   restaurantName: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   orderIdContainer: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     marginHorizontal: 16,
// // // // // // //     padding: 16,
// // // // // // //     borderRadius: 12,
// // // // // // //     alignItems: 'center',
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.05,
// // // // // // //     shadowRadius: 4,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   orderIdLabel: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#7e808c',
// // // // // // //   },
// // // // // // //   orderId: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   progressContainer: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     marginHorizontal: 16,
// // // // // // //     padding: 20,
// // // // // // //     borderRadius: 12,
// // // // // // //     alignItems: 'center',
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.05,
// // // // // // //     shadowRadius: 4,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   statusTitle: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 8,
// // // // // // //   },
// // // // // // //   statusBadge: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 6,
// // // // // // //     borderRadius: 16,
// // // // // // //   },
// // // // // // //   statusText: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '600',
// // // // // // //     marginLeft: 6,
// // // // // // //   },
// // // // // // //   progressBarContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginHorizontal: 16,
// // // // // // //     marginTop: 16,
// // // // // // //   },
// // // // // // //   progressBar: {
// // // // // // //     flex: 1,
// // // // // // //     height: 8,
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //     borderRadius: 4,
// // // // // // //     overflow: 'hidden',
// // // // // // //   },
// // // // // // //   progressFill: {
// // // // // // //     height: '100%',
// // // // // // //     backgroundColor: '#fc8019',
// // // // // // //     borderRadius: 4,
// // // // // // //   },
// // // // // // //   progressPercentage: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#fc8019',
// // // // // // //     marginLeft: 12,
// // // // // // //     minWidth: 40,
// // // // // // //     textAlign: 'right',
// // // // // // //   },
// // // // // // //   stepsContainer: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     margin: 16,
// // // // // // //     padding: 20,
// // // // // // //     borderRadius: 12,
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.05,
// // // // // // //     shadowRadius: 4,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   stepItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   stepIndicator: {
// // // // // // //     alignItems: 'center',
// // // // // // //     marginRight: 16,
// // // // // // //     position: 'relative',
// // // // // // //   },
// // // // // // //   stepCircle: {
// // // // // // //     width: 32,
// // // // // // //     height: 32,
// // // // // // //     borderRadius: 16,
// // // // // // //     backgroundColor: '#f0f0f5',
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     zIndex: 1,
// // // // // // //   },
// // // // // // //   stepCircleCompleted: {
// // // // // // //     backgroundColor: '#28a745',
// // // // // // //   },
// // // // // // //   stepCircleActive: {
// // // // // // //     backgroundColor: '#fc8019',
// // // // // // //   },
// // // // // // //   stepPulse: {
// // // // // // //     width: 12,
// // // // // // //     height: 12,
// // // // // // //     borderRadius: 6,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderWidth: 2,
// // // // // // //     borderColor: '#fc8019',
// // // // // // //   },
// // // // // // //   stepDot: {
// // // // // // //     width: 8,
// // // // // // //     height: 8,
// // // // // // //     borderRadius: 4,
// // // // // // //     backgroundColor: '#d0d0d0',
// // // // // // //   },
// // // // // // //   stepLine: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 32,
// // // // // // //     width: 2,
// // // // // // //     height: 40,
// // // // // // //     backgroundColor: '#e0e0e0',
// // // // // // //   },
// // // // // // //   stepLineCompleted: {
// // // // // // //     backgroundColor: '#28a745',
// // // // // // //   },
// // // // // // //   stepContent: {
// // // // // // //     flex: 1,
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   stepLabel: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //   },
// // // // // // //   stepLabelCompleted: {
// // // // // // //     color: '#28a745',
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   stepLabelActive: {
// // // // // // //     color: '#fc8019',
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   stepSubtext: {
// // // // // // //     fontSize: 11,
// // // // // // //     color: '#fc8019',
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   stepSubtextCompleted: {
// // // // // // //     fontSize: 11,
// // // // // // //     color: '#28a745',
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   detailsCard: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     marginHorizontal: 16,
// // // // // // //     padding: 16,
// // // // // // //     borderRadius: 12,
// // // // // // //     marginTop: 16,
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.05,
// // // // // // //     shadowRadius: 4,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   detailsTitle: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   detailRow: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingVertical: 6,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   detailLabel: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //   },
// // // // // // //   detailValue: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   detailValueTotal: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#fc8019',
// // // // // // //   },
// // // // // // //   itemsCard: {
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     marginHorizontal: 16,
// // // // // // //     padding: 16,
// // // // // // //     borderRadius: 12,
// // // // // // //     marginTop: 16,
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.05,
// // // // // // //     shadowRadius: 4,
// // // // // // //     elevation: 2,
// // // // // // //   },
// // // // // // //   itemsTitle: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: '#282c3f',
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   itemRow: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 8,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#f0f0f5',
// // // // // // //   },
// // // // // // //   itemInfo: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   itemName: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   itemQuantity: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#7e808c',
// // // // // // //     marginLeft: 6,
// // // // // // //   },
// // // // // // //   itemPrice: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: '#282c3f',
// // // // // // //   },
// // // // // // //   bottomPadding: {
// // // // // // //     height: 30,
// // // // // // //   },
// // // // // // // });

// // // // // // // export default OrderTrackingScreen;
// // // // // // // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   StyleSheet,
// // // // // //   SafeAreaView,
// // // // // //   StatusBar,
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { colors } from '../../constants/colors';

// // // // // // interface OrderTrackingScreenProps {
// // // // // //   navigation: any;
// // // // // //   route: any;
// // // // // // }

// // // // // // const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
// // // // // //   const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
  
// // // // // //   const [orderStatus, setOrderStatus] = useState<string>('Placed');
// // // // // //   const [progress, setProgress] = useState<number>(0);

// // // // // //   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
// // // // // //   const currentStep = statusFlow.indexOf(orderStatus);

// // // // // //   useEffect(() => {
// // // // // //     const interval = setInterval(() => {
// // // // // //       setProgress(prev => {
// // // // // //         if (prev >= 100) {
// // // // // //           clearInterval(interval);
// // // // // //           return 100;
// // // // // //         }
// // // // // //         return prev + 1;
// // // // // //       });
// // // // // //     }, 3000);

// // // // // //     return () => clearInterval(interval);
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     if (progress < 20) setOrderStatus('Placed');
// // // // // //     else if (progress < 40) setOrderStatus('Preparing');
// // // // // //     else if (progress < 60) setOrderStatus('Ready');
// // // // // //     else if (progress < 80) setOrderStatus('On the way');
// // // // // //     else if (progress >= 80) setOrderStatus('Delivered');
// // // // // //   }, [progress]);

// // // // // //   const getStatusColor = (status: string) => {
// // // // // //     switch (status) {
// // // // // //       case 'Placed': return '#ffc107';
// // // // // //       case 'Preparing': return '#17a2b8';
// // // // // //       case 'Ready': return '#28a745';
// // // // // //       case 'On the way': return '#fc8019';
// // // // // //       case 'Delivered': return '#28a745';
// // // // // //       default: return '#7e808c';
// // // // // //     }
// // // // // //   };

// // // // // //   const getStatusIcon = (status: string) => {
// // // // // //     switch (status) {
// // // // // //       case 'Placed': return 'time-outline';
// // // // // //       case 'Preparing': return 'cafe-outline';
// // // // // //       case 'Ready': return 'checkmark-circle-outline';
// // // // // //       case 'On the way': return 'bicycle-outline';
// // // // // //       case 'Delivered': return 'checkmark-done-circle-outline';
// // // // // //       default: return 'ellipse-outline';
// // // // // //     }
// // // // // //   };

// // // // // //   const getStatusMessage = (status: string) => {
// // // // // //     switch (status) {
// // // // // //       case 'Placed': return 'Your order has been placed';
// // // // // //       case 'Preparing': return 'Your order is being prepared';
// // // // // //       case 'Ready': return 'Your order is ready for delivery';
// // // // // //       case 'On the way': return 'Your order is on the way!';
// // // // // //       case 'Delivered': return 'Your order has been delivered! 🎉';
// // // // // //       default: return 'Processing your order';
// // // // // //     }
// // // // // //   };

// // // // // //   const getStepStatus = (step: string) => {
// // // // // //     const stepIndex = statusFlow.indexOf(step);
// // // // // //     if (stepIndex < currentStep) return 'completed';
// // // // // //     if (stepIndex === currentStep) return 'active';
// // // // // //     return 'pending';
// // // // // //   };

// // // // // //   return (
// // // // // //     <SafeAreaView style={styles.container}>
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // // //       <View style={styles.header}>
// // // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // // //         </TouchableOpacity>
// // // // // //         <Text style={styles.headerTitle}>Order Tracking</Text>
// // // // // //         <View style={styles.headerRight} />
// // // // // //       </View>

// // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // //         <View style={styles.restaurantContainer}>
// // // // // //           <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
// // // // // //         </View>

// // // // // //         <View style={styles.orderIdContainer}>
// // // // // //           <Text style={styles.orderIdLabel}>Order ID</Text>
// // // // // //           <Text style={styles.orderId}>{orderId || 'ORD-123456'}</Text>
// // // // // //         </View>

// // // // // //         <View style={styles.progressContainer}>
// // // // // //           <Text style={styles.statusTitle}>
// // // // // //             {getStatusMessage(orderStatus)}
// // // // // //           </Text>
// // // // // //           <View style={styles.statusBadge}>
// // // // // //             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
// // // // // //             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
// // // // // //               {orderStatus}
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         <View style={styles.progressBarContainer}>
// // // // // //           <View style={styles.progressBar}>
// // // // // //             <View style={[styles.progressFill, { width: `${progress}%` }]} />
// // // // // //           </View>
// // // // // //           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
// // // // // //         </View>

// // // // // //         <View style={styles.stepsContainer}>
// // // // // //           {statusFlow.map((step, index) => {
// // // // // //             const status = getStepStatus(step);
// // // // // //             const isCompleted = status === 'completed';
// // // // // //             const isActive = status === 'active';
            
// // // // // //             return (
// // // // // //               <View key={index} style={styles.stepItem}>
// // // // // //                 <View style={styles.stepIndicator}>
// // // // // //                   <View style={[
// // // // // //                     styles.stepCircle,
// // // // // //                     isCompleted && styles.stepCircleCompleted,
// // // // // //                     isActive && styles.stepCircleActive,
// // // // // //                   ]}>
// // // // // //                     {isCompleted ? (
// // // // // //                       <Icon name="checkmark" size={16} color="#ffffff" />
// // // // // //                     ) : isActive ? (
// // // // // //                       <View style={styles.stepPulse} />
// // // // // //                     ) : (
// // // // // //                       <View style={styles.stepDot} />
// // // // // //                     )}
// // // // // //                   </View>
// // // // // //                   {index < statusFlow.length - 1 && (
// // // // // //                     <View style={[
// // // // // //                       styles.stepLine,
// // // // // //                       isCompleted && styles.stepLineCompleted,
// // // // // //                     ]} />
// // // // // //                   )}
// // // // // //                 </View>
// // // // // //                 <View style={styles.stepContent}>
// // // // // //                   <Text style={[
// // // // // //                     styles.stepLabel,
// // // // // //                     isCompleted && styles.stepLabelCompleted,
// // // // // //                     isActive && styles.stepLabelActive,
// // // // // //                   ]}>
// // // // // //                     {step}
// // // // // //                   </Text>
// // // // // //                   {isActive && (
// // // // // //                     <Text style={styles.stepSubtext}>In progress</Text>
// // // // // //                   )}
// // // // // //                   {isCompleted && (
// // // // // //                     <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
// // // // // //                   )}
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //             );
// // // // // //           })}
// // // // // //         </View>

// // // // // //         <View style={styles.detailsCard}>
// // // // // //           <Text style={styles.detailsTitle}>Order Details</Text>
          
// // // // // //           <View style={styles.detailRow}>
// // // // // //             <Text style={styles.detailLabel}>Payment Method</Text>
// // // // // //             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.detailRow}>
// // // // // //             <Text style={styles.detailLabel}>Payment Status</Text>
// // // // // //             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
// // // // // //               {paymentStatus || 'Pending'}
// // // // // //             </Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.detailRow}>
// // // // // //             <Text style={styles.detailLabel}>Total Amount</Text>
// // // // // //             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
// // // // // //           </View>
          
// // // // // //           <View style={styles.detailRow}>
// // // // // //             <Text style={styles.detailLabel}>Items</Text>
// // // // // //             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
// // // // // //           </View>
// // // // // //         </View>

// // // // // //         {items && items.length > 0 && (
// // // // // //           <View style={styles.itemsCard}>
// // // // // //             <Text style={styles.itemsTitle}>Items</Text>
// // // // // //             {items.map((item: any, index: number) => (
// // // // // //               <View key={index} style={styles.itemRow}>
// // // // // //                 <View style={styles.itemInfo}>
// // // // // //                   <Text style={styles.itemName}>{item.name}</Text>
// // // // // //                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
// // // // // //                 </View>
// // // // // //                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
// // // // // //               </View>
// // // // // //             ))}
// // // // // //           </View>
// // // // // //         )}

// // // // // //         <View style={styles.bottomPadding} />
// // // // // //       </ScrollView>
// // // // // //     </SafeAreaView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: '#f8f9fa',
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f0',
// // // // // //   },
// // // // // //   backButton: {
// // // // // //     padding: 4,
// // // // // //   },
// // // // // //   headerTitle: {
// // // // // //     flex: 1,
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     textAlign: 'center',
// // // // // //     marginRight: 32,
// // // // // //   },
// // // // // //   headerRight: {
// // // // // //     width: 32,
// // // // // //   },
// // // // // //   restaurantContainer: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     margin: 16,
// // // // // //     padding: 16,
// // // // // //     borderRadius: 12,
// // // // // //     alignItems: 'center',
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   restaurantName: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   orderIdContainer: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     marginHorizontal: 16,
// // // // // //     padding: 16,
// // // // // //     borderRadius: 12,
// // // // // //     alignItems: 'center',
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   orderIdLabel: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   orderId: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   progressContainer: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     marginHorizontal: 16,
// // // // // //     padding: 20,
// // // // // //     borderRadius: 12,
// // // // // //     alignItems: 'center',
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   statusTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   statusBadge: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 16,
// // // // // //   },
// // // // // //   statusText: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     marginLeft: 6,
// // // // // //   },
// // // // // //   progressBarContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     marginHorizontal: 16,
// // // // // //     marginTop: 16,
// // // // // //   },
// // // // // //   progressBar: {
// // // // // //     flex: 1,
// // // // // //     height: 8,
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //     borderRadius: 4,
// // // // // //     overflow: 'hidden',
// // // // // //   },
// // // // // //   progressFill: {
// // // // // //     height: '100%',
// // // // // //     backgroundColor: '#fc8019',
// // // // // //     borderRadius: 4,
// // // // // //   },
// // // // // //   progressPercentage: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#fc8019',
// // // // // //     marginLeft: 12,
// // // // // //     minWidth: 40,
// // // // // //     textAlign: 'right',
// // // // // //   },
// // // // // //   stepsContainer: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     margin: 16,
// // // // // //     padding: 20,
// // // // // //     borderRadius: 12,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   stepItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   stepIndicator: {
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 16,
// // // // // //     position: 'relative',
// // // // // //   },
// // // // // //   stepCircle: {
// // // // // //     width: 32,
// // // // // //     height: 32,
// // // // // //     borderRadius: 16,
// // // // // //     backgroundColor: '#f0f0f5',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     zIndex: 1,
// // // // // //   },
// // // // // //   stepCircleCompleted: {
// // // // // //     backgroundColor: '#28a745',
// // // // // //   },
// // // // // //   stepCircleActive: {
// // // // // //     backgroundColor: '#fc8019',
// // // // // //   },
// // // // // //   stepPulse: {
// // // // // //     width: 12,
// // // // // //     height: 12,
// // // // // //     borderRadius: 6,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: '#fc8019',
// // // // // //   },
// // // // // //   stepDot: {
// // // // // //     width: 8,
// // // // // //     height: 8,
// // // // // //     borderRadius: 4,
// // // // // //     backgroundColor: '#d0d0d0',
// // // // // //   },
// // // // // //   stepLine: {
// // // // // //     position: 'absolute',
// // // // // //     top: 32,
// // // // // //     width: 2,
// // // // // //     height: 40,
// // // // // //     backgroundColor: '#e0e0e0',
// // // // // //   },
// // // // // //   stepLineCompleted: {
// // // // // //     backgroundColor: '#28a745',
// // // // // //   },
// // // // // //   stepContent: {
// // // // // //     flex: 1,
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   stepLabel: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   stepLabelCompleted: {
// // // // // //     color: '#28a745',
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   stepLabelActive: {
// // // // // //     color: '#fc8019',
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   stepSubtext: {
// // // // // //     fontSize: 11,
// // // // // //     color: '#fc8019',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   stepSubtextCompleted: {
// // // // // //     fontSize: 11,
// // // // // //     color: '#28a745',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   detailsCard: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     marginHorizontal: 16,
// // // // // //     padding: 16,
// // // // // //     borderRadius: 12,
// // // // // //     marginTop: 16,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   detailsTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   detailRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingVertical: 6,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   detailLabel: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //   },
// // // // // //   detailValue: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   detailValueTotal: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#fc8019',
// // // // // //   },
// // // // // //   itemsCard: {
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     marginHorizontal: 16,
// // // // // //     padding: 16,
// // // // // //     borderRadius: 12,
// // // // // //     marginTop: 16,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 2,
// // // // // //   },
// // // // // //   itemsTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#282c3f',
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   itemRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 8,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#f0f0f5',
// // // // // //   },
// // // // // //   itemInfo: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   itemName: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   itemQuantity: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#7e808c',
// // // // // //     marginLeft: 6,
// // // // // //   },
// // // // // //   itemPrice: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#282c3f',
// // // // // //   },
// // // // // //   bottomPadding: {
// // // // // //     height: 30,
// // // // // //   },
// // // // // // });

// // // // // // export default OrderTrackingScreen;
// // // // // // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// // // // // import React, { useState, useEffect } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   Animated,
// // // // //   Dimensions,
// // // // // } from 'react-native';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { colors } from '../../constants/colors';

// // // // // const { width } = Dimensions.get('window');

// // // // // interface OrderTrackingScreenProps {
// // // // //   navigation: any;
// // // // //   route: any;
// // // // // }

// // // // // const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
// // // // //   const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
  
// // // // //   const [orderStatus, setOrderStatus] = useState<string>('Placed');
// // // // //   const [progress, setProgress] = useState<number>(0);
// // // // //   const [estimatedTime, setEstimatedTime] = useState<string>('25-30 min');
// // // // //   const [deliveryPartner, setDeliveryPartner] = useState<string>('Rajesh Kumar');
// // // // //   const [partnerPhone, setPartnerPhone] = useState<string>('+91 98765 43210');
// // // // //   const [partnerRating, setPartnerRating] = useState<number>(4.8);
  
// // // // //   const [animatedValue] = useState(new Animated.Value(0));

// // // // //   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
// // // // //   const currentStep = statusFlow.indexOf(orderStatus);

// // // // //   // ✅ Dynamic progress simulation
// // // // //   useEffect(() => {
// // // // //     const interval = setInterval(() => {
// // // // //       setProgress(prev => {
// // // // //         const newProgress = prev + 0.5;
// // // // //         if (newProgress >= 100) {
// // // // //           clearInterval(interval);
// // // // //           return 100;
// // // // //         }
// // // // //         return newProgress;
// // // // //       });
// // // // //     }, 1000);

// // // // //     return () => clearInterval(interval);
// // // // //   }, []);

// // // // //   // ✅ Update status and estimated time based on progress
// // // // //   useEffect(() => {
// // // // //     // Animate progress bar
// // // // //     Animated.timing(animatedValue, {
// // // // //       toValue: progress,
// // // // //       duration: 1000,
// // // // //       useNativeDriver: false,
// // // // //     }).start();

// // // // //     if (progress < 20) {
// // // // //       setOrderStatus('Placed');
// // // // //       setEstimatedTime('25-30 min');
// // // // //       setDeliveryPartner('Rajesh Kumar');
// // // // //     } else if (progress < 40) {
// // // // //       setOrderStatus('Preparing');
// // // // //       setEstimatedTime('20-25 min');
// // // // //       setDeliveryPartner('Rajesh Kumar');
// // // // //     } else if (progress < 60) {
// // // // //       setOrderStatus('Ready');
// // // // //       setEstimatedTime('15-20 min');
// // // // //       setDeliveryPartner('Rajesh Kumar');
// // // // //     } else if (progress < 80) {
// // // // //       setOrderStatus('On the way');
// // // // //       setEstimatedTime('5-10 min');
// // // // //       setDeliveryPartner('Rajesh Kumar (On the way)');
// // // // //     } else if (progress >= 80) {
// // // // //       setOrderStatus('Delivered');
// // // // //       setEstimatedTime('Delivered! 🎉');
// // // // //       setDeliveryPartner('Rajesh Kumar (Delivered)');
// // // // //     }
// // // // //   }, [progress]);

// // // // //   const getStatusColor = (status: string) => {
// // // // //     switch (status) {
// // // // //       case 'Placed': return '#ffc107';
// // // // //       case 'Preparing': return '#17a2b8';
// // // // //       case 'Ready': return '#28a745';
// // // // //       case 'On the way': return '#fc8019';
// // // // //       case 'Delivered': return '#28a745';
// // // // //       default: return '#7e808c';
// // // // //     }
// // // // //   };

// // // // //   const getStatusIcon = (status: string) => {
// // // // //     switch (status) {
// // // // //       case 'Placed': return 'time-outline';
// // // // //       case 'Preparing': return 'restaurant-outline';
// // // // //       case 'Ready': return 'checkmark-circle-outline';
// // // // //       case 'On the way': return 'bicycle-outline';
// // // // //       case 'Delivered': return 'checkmark-done-circle-outline';
// // // // //       default: return 'ellipse-outline';
// // // // //     }
// // // // //   };

// // // // //   const getStatusEmoji = (status: string) => {
// // // // //     switch (status) {
// // // // //       case 'Placed': return '📋';
// // // // //       case 'Preparing': return '👨‍🍳';
// // // // //       case 'Ready': return '✅';
// // // // //       case 'On the way': return '🚴';
// // // // //       case 'Delivered': return '🎉';
// // // // //       default: return '📦';
// // // // //     }
// // // // //   };

// // // // //   const getStatusMessage = (status: string) => {
// // // // //     switch (status) {
// // // // //       case 'Placed': return 'Your order has been placed and confirmed';
// // // // //       case 'Preparing': return 'The restaurant is preparing your food';
// // // // //       case 'Ready': return 'Your order is ready for pickup';
// // // // //       case 'On the way': return 'Your delivery partner is on the way!';
// // // // //       case 'Delivered': return 'Your order has been delivered successfully!';
// // // // //       default: return 'Processing your order';
// // // // //     }
// // // // //   };

// // // // //   const getStepStatus = (step: string) => {
// // // // //     const stepIndex = statusFlow.indexOf(step);
// // // // //     if (stepIndex < currentStep) return 'completed';
// // // // //     if (stepIndex === currentStep) return 'active';
// // // // //     return 'pending';
// // // // //   };

// // // // //   const formatTime = (dateString: string) => {
// // // // //     const date = new Date(dateString);
// // // // //     return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
// // // // //   };

// // // // //   const progressWidth = animatedValue.interpolate({
// // // // //     inputRange: [0, 100],
// // // // //     outputRange: ['0%', '100%'],
// // // // //   });

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // //       {/* Header */}
// // // // //       <View style={styles.header}>
// // // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // // //         </TouchableOpacity>
// // // // //         <Text style={styles.headerTitle}>Order Tracking</Text>
// // // // //         <TouchableOpacity style={styles.helpButton}>
// // // // //           <Icon name="help-circle-outline" size={24} color="#fc8019" />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         {/* Restaurant & Order Info */}
// // // // //         <View style={styles.restaurantContainer}>
// // // // //           <View style={styles.restaurantHeader}>
// // // // //             <View style={styles.restaurantIcon}>
// // // // //               <Text style={styles.restaurantIconText}>
// // // // //                 {restaurantName?.charAt(0) || 'Q'}
// // // // //               </Text>
// // // // //             </View>
// // // // //             <View style={styles.restaurantInfo}>
// // // // //               <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
// // // // //               <Text style={styles.orderTime}>Order placed at {formatTime(new Date().toISOString())}</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //           <View style={styles.orderIdBadge}>
// // // // //             <Text style={styles.orderIdText}>#{orderId || 'ORD-123456'}</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Status Progress with Emoji */}
// // // // //         <View style={styles.progressContainer}>
// // // // //           <View style={styles.statusHeader}>
// // // // //             <Text style={styles.statusEmoji}>{getStatusEmoji(orderStatus)}</Text>
// // // // //             <Text style={styles.statusTitle}>{orderStatus}</Text>
// // // // //           </View>
// // // // //           <Text style={styles.statusMessage}>{getStatusMessage(orderStatus)}</Text>
          
// // // // //           <View style={styles.statusBadge}>
// // // // //             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
// // // // //             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
// // // // //               {orderStatus}
// // // // //             </Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Estimated Time */}
// // // // //         <View style={styles.timeContainer}>
// // // // //           <Icon name="time-outline" size={20} color="#fc8019" />
// // // // //           <Text style={styles.timeLabel}>Estimated Delivery Time</Text>
// // // // //           <Text style={styles.timeValue}>{estimatedTime}</Text>
// // // // //         </View>

// // // // //         {/* Progress Bar */}
// // // // //         <View style={styles.progressBarContainer}>
// // // // //           <View style={styles.progressBar}>
// // // // //             <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
// // // // //           </View>
// // // // //           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
// // // // //         </View>

// // // // //         {/* Steps with Dynamic Tracking */}
// // // // //         <View style={styles.stepsContainer}>
// // // // //           {statusFlow.map((step, index) => {
// // // // //             const status = getStepStatus(step);
// // // // //             const isCompleted = status === 'completed';
// // // // //             const isActive = status === 'active';
            
// // // // //             return (
// // // // //               <View key={index} style={styles.stepItem}>
// // // // //                 <View style={styles.stepIndicator}>
// // // // //                   <View style={[
// // // // //                     styles.stepCircle,
// // // // //                     isCompleted && styles.stepCircleCompleted,
// // // // //                     isActive && styles.stepCircleActive,
// // // // //                   ]}>
// // // // //                     {isCompleted ? (
// // // // //                       <Icon name="checkmark" size={16} color="#ffffff" />
// // // // //                     ) : isActive ? (
// // // // //                       <View style={styles.stepPulse} />
// // // // //                     ) : (
// // // // //                       <View style={styles.stepDot} />
// // // // //                     )}
// // // // //                   </View>
// // // // //                   {index < statusFlow.length - 1 && (
// // // // //                     <View style={[
// // // // //                       styles.stepLine,
// // // // //                       isCompleted && styles.stepLineCompleted,
// // // // //                     ]} />
// // // // //                   )}
// // // // //                 </View>
// // // // //                 <View style={styles.stepContent}>
// // // // //                   <Text style={[
// // // // //                     styles.stepLabel,
// // // // //                     isCompleted && styles.stepLabelCompleted,
// // // // //                     isActive && styles.stepLabelActive,
// // // // //                   ]}>
// // // // //                     {step}
// // // // //                   </Text>
// // // // //                   {isActive && (
// // // // //                     <Text style={styles.stepSubtext}>🔄 In progress</Text>
// // // // //                   )}
// // // // //                   {isCompleted && (
// // // // //                     <Text style={styles.stepSubtextCompleted}>✅ Done</Text>
// // // // //                   )}
// // // // //                   {!isCompleted && !isActive && (
// // // // //                     <Text style={styles.stepSubtextPending}>⏳ Pending</Text>
// // // // //                   )}
// // // // //                 </View>
// // // // //               </View>
// // // // //             );
// // // // //           })}
// // // // //         </View>

// // // // //         {/* Delivery Partner Info (Shows when On the way) */}
// // // // //         {(orderStatus === 'On the way' || orderStatus === 'Delivered') && (
// // // // //           <View style={styles.deliveryCard}>
// // // // //             <Text style={styles.deliveryTitle}>🛵 Delivery Partner</Text>
// // // // //             <View style={styles.deliveryInfo}>
// // // // //               <View style={styles.deliveryAvatar}>
// // // // //                 <Text style={styles.deliveryAvatarText}>
// // // // //                   {deliveryPartner.charAt(0)}
// // // // //                 </Text>
// // // // //               </View>
// // // // //               <View style={styles.deliveryDetails}>
// // // // //                 <Text style={styles.deliveryName}>{deliveryPartner}</Text>
// // // // //                 <Text style={styles.deliveryPhone}>{partnerPhone}</Text>
// // // // //                 <View style={styles.deliveryRating}>
// // // // //                   <Icon name="star" size={14} color="#ffc107" />
// // // // //                   <Text style={styles.deliveryRatingText}>{partnerRating} ★</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //               <TouchableOpacity style={styles.callButton}>
// // // // //                 <Icon name="call-outline" size={20} color="#ffffff" />
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //             <Text style={styles.deliveryStatus}>
// // // // //               {orderStatus === 'On the way' ? '🚴 On the way to deliver your order' : '✅ Order delivered successfully'}
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}

// // // // //         {/* Order Details */}
// // // // //         <View style={styles.detailsCard}>
// // // // //           <Text style={styles.detailsTitle}>📋 Order Details</Text>
          
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Payment Method</Text>
// // // // //             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Payment Status</Text>
// // // // //             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
// // // // //               {paymentStatus || 'Pending'}
// // // // //             </Text>
// // // // //           </View>
          
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Total Amount</Text>
// // // // //             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
// // // // //           </View>
          
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Items</Text>
// // // // //             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Items List */}
// // // // //         {items && items.length > 0 && (
// // // // //           <View style={styles.itemsCard}>
// // // // //             <Text style={styles.itemsTitle}>🛒 Items</Text>
// // // // //             {items.map((item: any, index: number) => (
// // // // //               <View key={index} style={styles.itemRow}>
// // // // //                 <View style={styles.itemInfo}>
// // // // //                   <Text style={styles.itemName}>{item.name}</Text>
// // // // //                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
// // // // //                 </View>
// // // // //                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
// // // // //               </View>
// // // // //             ))}
// // // // //           </View>
// // // // //         )}

// // // // //         {/* Live Tracking Note */}
// // // // //         <View style={styles.liveNote}>
// // // // //           <Icon name="radio-outline" size={16} color="#28a745" />
// // // // //           <Text style={styles.liveNoteText}>Live tracking • Updates every 30 seconds</Text>
// // // // //         </View>

// // // // //         <View style={styles.bottomPadding} />
// // // // //       </ScrollView>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f0',
// // // // //   },
// // // // //   backButton: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   headerTitle: {
// // // // //     flex: 1,
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   helpButton: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   restaurantContainer: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     margin: 16,
// // // // //     padding: 16,
// // // // //     borderRadius: 12,
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   restaurantHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   restaurantIcon: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 24,
// // // // //     backgroundColor: '#fc8019',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   restaurantIconText: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '700',
// // // // //     color: '#ffffff',
// // // // //   },
// // // // //   restaurantInfo: {
// // // // //     marginLeft: 12,
// // // // //     flex: 1,
// // // // //   },
// // // // //   restaurantName: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   orderTime: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   orderIdBadge: {
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 4,
// // // // //     borderRadius: 12,
// // // // //   },
// // // // //   orderIdText: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   progressContainer: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     marginHorizontal: 16,
// // // // //     padding: 20,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   statusHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   statusEmoji: {
// // // // //     fontSize: 28,
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   statusTitle: {
// // // // //     fontSize: 22,
// // // // //     fontWeight: '700',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   statusMessage: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     textAlign: 'center',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   statusBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 16,
// // // // //   },
// // // // //   statusText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     marginLeft: 6,
// // // // //   },
// // // // //   timeContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fff8f0',
// // // // //     marginHorizontal: 16,
// // // // //     marginTop: 12,
// // // // //     padding: 12,
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#fce4d6',
// // // // //   },
// // // // //   timeLabel: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     marginLeft: 8,
// // // // //     flex: 1,
// // // // //   },
// // // // //   timeValue: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: '#fc8019',
// // // // //   },
// // // // //   progressBarContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginHorizontal: 16,
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   progressBar: {
// // // // //     flex: 1,
// // // // //     height: 8,
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     borderRadius: 4,
// // // // //     overflow: 'hidden',
// // // // //   },
// // // // //   progressFill: {
// // // // //     height: '100%',
// // // // //     backgroundColor: '#fc8019',
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   progressPercentage: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: '#fc8019',
// // // // //     marginLeft: 12,
// // // // //     minWidth: 40,
// // // // //     textAlign: 'right',
// // // // //   },
// // // // //   stepsContainer: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     margin: 16,
// // // // //     padding: 20,
// // // // //     borderRadius: 12,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   stepItem: {
// // // // //     flexDirection: 'row',
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   stepIndicator: {
// // // // //     alignItems: 'center',
// // // // //     marginRight: 16,
// // // // //     position: 'relative',
// // // // //   },
// // // // //   stepCircle: {
// // // // //     width: 32,
// // // // //     height: 32,
// // // // //     borderRadius: 16,
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     zIndex: 1,
// // // // //   },
// // // // //   stepCircleCompleted: {
// // // // //     backgroundColor: '#28a745',
// // // // //   },
// // // // //   stepCircleActive: {
// // // // //     backgroundColor: '#fc8019',
// // // // //   },
// // // // //   stepPulse: {
// // // // //     width: 12,
// // // // //     height: 12,
// // // // //     borderRadius: 6,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#fc8019',
// // // // //   },
// // // // //   stepDot: {
// // // // //     width: 8,
// // // // //     height: 8,
// // // // //     borderRadius: 4,
// // // // //     backgroundColor: '#d0d0d0',
// // // // //   },
// // // // //   stepLine: {
// // // // //     position: 'absolute',
// // // // //     top: 32,
// // // // //     width: 2,
// // // // //     height: 40,
// // // // //     backgroundColor: '#e0e0e0',
// // // // //   },
// // // // //   stepLineCompleted: {
// // // // //     backgroundColor: '#28a745',
// // // // //   },
// // // // //   stepContent: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   stepLabel: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //   },
// // // // //   stepLabelCompleted: {
// // // // //     color: '#28a745',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   stepLabelActive: {
// // // // //     color: '#fc8019',
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   stepSubtext: {
// // // // //     fontSize: 11,
// // // // //     color: '#fc8019',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   stepSubtextCompleted: {
// // // // //     fontSize: 11,
// // // // //     color: '#28a745',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   stepSubtextPending: {
// // // // //     fontSize: 11,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   deliveryCard: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     marginHorizontal: 16,
// // // // //     padding: 16,
// // // // //     borderRadius: 12,
// // // // //     marginTop: 16,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //     borderLeftWidth: 4,
// // // // //     borderLeftColor: '#fc8019',
// // // // //   },
// // // // //   deliveryTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   deliveryInfo: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   deliveryAvatar: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 24,
// // // // //     backgroundColor: '#17a2b8',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   deliveryAvatarText: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '700',
// // // // //     color: '#ffffff',
// // // // //   },
// // // // //   deliveryDetails: {
// // // // //     flex: 1,
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   deliveryName: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   deliveryPhone: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   deliveryRating: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   deliveryRatingText: {
// // // // //     fontSize: 12,
// // // // //     color: '#282c3f',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   callButton: {
// // // // //     backgroundColor: '#28a745',
// // // // //     width: 40,
// // // // //     height: 40,
// // // // //     borderRadius: 20,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   deliveryStatus: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 12,
// // // // //     textAlign: 'center',
// // // // //     backgroundColor: '#f0f0f5',
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   detailsCard: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     marginHorizontal: 16,
// // // // //     padding: 16,
// // // // //     borderRadius: 12,
// // // // //     marginTop: 16,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   detailsTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   detailRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingVertical: 6,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   detailLabel: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //   },
// // // // //   detailValue: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   detailValueTotal: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: '#fc8019',
// // // // //   },
// // // // //   itemsCard: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     marginHorizontal: 16,
// // // // //     padding: 16,
// // // // //     borderRadius: 12,
// // // // //     marginTop: 16,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   itemsTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   itemRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 8,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   itemInfo: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   itemName: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   itemQuantity: {
// // // // //     fontSize: 14,
// // // // //     color: '#7e808c',
// // // // //     marginLeft: 6,
// // // // //   },
// // // // //   itemPrice: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   liveNote: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginTop: 16,
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   liveNoteText: {
// // // // //     fontSize: 12,
// // // // //     color: '#28a745',
// // // // //     marginLeft: 6,
// // // // //   },
// // // // //   bottomPadding: {
// // // // //     height: 30,
// // // // //   },
// // // // // });

// // // // // export default OrderTrackingScreen;
// // // // // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// // // // import React, { useState, useEffect } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Animated,
// // // //   Dimensions,
// // // //   TextInput,
// // // //   Alert,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { colors } from '../../constants/colors';

// // // // const { width } = Dimensions.get('window');

// // // // interface OrderTrackingScreenProps {
// // // //   navigation: any;
// // // //   route: any;
// // // // }

// // // // const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
// // // //   const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
  
// // // //   const [orderStatus, setOrderStatus] = useState<string>('Placed');
// // // //   const [progress, setProgress] = useState<number>(0);
// // // //   const [estimatedTime, setEstimatedTime] = useState<string>('25-30 min');
// // // //   const [deliveryPartner, setDeliveryPartner] = useState<string>('Rajesh Kumar');
// // // //   const [partnerPhone, setPartnerPhone] = useState<string>('+91 98765 43210');
// // // //   const [partnerRating, setPartnerRating] = useState<number>(4.8);
// // // //   const [rating, setRating] = useState<number>(0);
// // // //   const [review, setReview] = useState<string>('');
// // // //   const [showRating, setShowRating] = useState<boolean>(false);
  
// // // //   const [animatedValue] = useState(new Animated.Value(0));

// // // //   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
// // // //   const currentStep = statusFlow.indexOf(orderStatus);

// // // //   // ✅ Dynamic progress simulation
// // // //   useEffect(() => {
// // // //     const interval = setInterval(() => {
// // // //       setProgress(prev => {
// // // //         const newProgress = prev + 0.5;
// // // //         if (newProgress >= 100) {
// // // //           clearInterval(interval);
// // // //           return 100;
// // // //         }
// // // //         return newProgress;
// // // //       });
// // // //     }, 1000);

// // // //     return () => clearInterval(interval);
// // // //   }, []);

// // // //   // ✅ Update status based on progress
// // // //   useEffect(() => {
// // // //     Animated.timing(animatedValue, {
// // // //       toValue: progress,
// // // //       duration: 1000,
// // // //       useNativeDriver: false,
// // // //     }).start();

// // // //     if (progress < 20) {
// // // //       setOrderStatus('Placed');
// // // //       setEstimatedTime('25-30 min');
// // // //       setDeliveryPartner('Rajesh Kumar');
// // // //       setShowRating(false);
// // // //     } else if (progress < 40) {
// // // //       setOrderStatus('Preparing');
// // // //       setEstimatedTime('20-25 min');
// // // //       setDeliveryPartner('Rajesh Kumar');
// // // //       setShowRating(false);
// // // //     } else if (progress < 60) {
// // // //       setOrderStatus('Ready');
// // // //       setEstimatedTime('15-20 min');
// // // //       setDeliveryPartner('Rajesh Kumar');
// // // //       setShowRating(false);
// // // //     } else if (progress < 80) {
// // // //       setOrderStatus('On the way');
// // // //       setEstimatedTime('5-10 min');
// // // //       setDeliveryPartner('Rajesh Kumar (On the way)');
// // // //       setShowRating(false);
// // // //     } else if (progress >= 80) {
// // // //       setOrderStatus('Delivered');
// // // //       setEstimatedTime('Delivered! 🎉');
// // // //       setDeliveryPartner('Rajesh Kumar (Delivered)');
// // // //       setTimeout(() => {
// // // //         setShowRating(true);
// // // //       }, 1500);
// // // //     }
// // // //   }, [progress]);

// // // //   const getStatusColor = (status: string) => {
// // // //     switch (status) {
// // // //       case 'Placed': return '#ffc107';
// // // //       case 'Preparing': return '#17a2b8';
// // // //       case 'Ready': return '#28a745';
// // // //       case 'On the way': return '#fc8019';
// // // //       case 'Delivered': return '#28a745';
// // // //       default: return '#7e808c';
// // // //     }
// // // //   };

// // // //   const getStatusIcon = (status: string) => {
// // // //     switch (status) {
// // // //       case 'Placed': return 'time-outline';
// // // //       case 'Preparing': return 'restaurant-outline';
// // // //       case 'Ready': return 'checkmark-circle-outline';
// // // //       case 'On the way': return 'bicycle-outline';
// // // //       case 'Delivered': return 'checkmark-done-circle-outline';
// // // //       default: return 'ellipse-outline';
// // // //     }
// // // //   };

// // // //   const getStatusEmoji = (status: string) => {
// // // //     switch (status) {
// // // //       case 'Placed': return '📋';
// // // //       case 'Preparing': return '⏳';
// // // //       case 'Ready': return '✅';
// // // //       case 'On the way': return '🚴';
// // // //       case 'Delivered': return '🎉';
// // // //       default: return '📦';
// // // //     }
// // // //   };

// // // //   const getStatusMessage = (status: string) => {
// // // //     switch (status) {
// // // //       case 'Placed': return 'Your order has been placed and confirmed';
// // // //       case 'Preparing': return 'Your order is being prepared';
// // // //       case 'Ready': return 'Your order is ready for delivery';
// // // //       case 'On the way': return 'Your delivery partner is on the way!';
// // // //       case 'Delivered': return '🎉 Your order has been delivered successfully!';
// // // //       default: return 'Processing your order';
// // // //     }
// // // //   };

// // // //   const getStepStatus = (step: string) => {
// // // //     const stepIndex = statusFlow.indexOf(step);
// // // //     if (stepIndex < currentStep) return 'completed';
// // // //     if (stepIndex === currentStep) return 'active';
// // // //     return 'pending';
// // // //   };

// // // //   const handleReorder = () => {
// // // //     Alert.alert('🔄 Reorder', 'Add items to cart?', [
// // // //       { text: 'Cancel', style: 'cancel' },
// // // //       { text: 'Add to Cart', onPress: () => navigation.navigate('Cart') },
// // // //     ]);
// // // //   };

// // // //   const handleSubmitReview = () => {
// // // //     Alert.alert(
// // // //       '⭐ Thank You!',
// // // //       `Rating: ${rating} stars\nReview: ${review || 'No review provided'}`,
// // // //       [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
// // // //     );
// // // //   };

// // // //   const renderDeliverySuccess = () => (
// // // //     <View style={styles.successContainer}>
// // // //       <View style={styles.successIconContainer}>
// // // //         <Icon name="checkmark-circle" size={80} color="#28a745" />
// // // //       </View>
// // // //       <Text style={styles.successTitle}>🎉 Order Delivered!</Text>
// // // //       <Text style={styles.successSubtitle}>Your order has been delivered successfully</Text>
      
// // // //       <View style={styles.successDetails}>
// // // //         <View style={styles.successRow}>
// // // //           <Text style={styles.successLabel}>Order ID</Text>
// // // //           <Text style={styles.successValue}>{orderId}</Text>
// // // //         </View>
// // // //         <View style={styles.successRow}>
// // // //           <Text style={styles.successLabel}>Delivered</Text>
// // // //           <Text style={styles.successValue}>{new Date().toLocaleTimeString()}</Text>
// // // //         </View>
// // // //         <View style={styles.successRow}>
// // // //           <Text style={styles.successLabel}>Total Amount</Text>
// // // //           <Text style={[styles.successValue, styles.successTotal]}>₹{total}</Text>
// // // //         </View>
// // // //       </View>

// // // //       {/* ⭐ Rating Stars */}
// // // //       <View style={styles.ratingContainer}>
// // // //         <Text style={styles.ratingTitle}>Rate your order</Text>
// // // //         <View style={styles.starsContainer}>
// // // //           {[1, 2, 3, 4, 5].map((star) => (
// // // //             <TouchableOpacity key={star} onPress={() => setRating(star)}>
// // // //               <Icon
// // // //                 name={star <= rating ? 'star' : 'star-outline'}
// // // //                 size={36}
// // // //                 color={star <= rating ? '#ffc107' : '#d0d0d0'}
// // // //                 style={styles.starIcon}
// // // //               />
// // // //             </TouchableOpacity>
// // // //           ))}
// // // //         </View>
// // // //         <Text style={styles.ratingText}>
// // // //           {rating > 0 ? `${rating} stars` : 'Tap a star to rate'}
// // // //         </Text>
// // // //       </View>

// // // //       {/* ✍️ Review Input */}
// // // //       <View style={styles.reviewContainer}>
// // // //         <TextInput
// // // //           style={styles.reviewInput}
// // // //           placeholder="Write a review..."
// // // //           value={review}
// // // //           onChangeText={setReview}
// // // //           multiline
// // // //           numberOfLines={3}
// // // //         />
// // // //       </View>

// // // //       {/* Buttons */}
// // // //       <View style={styles.successButtons}>
// // // //         <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
// // // //           <Icon name="refresh-outline" size={20} color="#fc8019" />
// // // //           <Text style={styles.reorderButtonText}>Reorder</Text>
// // // //         </TouchableOpacity>
        
// // // //         <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
// // // //           <Icon name="home-outline" size={20} color="#ffffff" />
// // // //           <Text style={styles.homeButtonText}>Home</Text>
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       <TouchableOpacity style={styles.submitReviewButton} onPress={handleSubmitReview}>
// // // //         <Text style={styles.submitReviewText}>Submit Review</Text>
// // // //       </TouchableOpacity>
// // // //     </View>
// // // //   );

// // // //   const progressWidth = animatedValue.interpolate({
// // // //     inputRange: [0, 100],
// // // //     outputRange: ['0%', '100%'],
// // // //   });

// // // //   // ✅ If delivered, show success page
// // // //   if (orderStatus === 'Delivered') {
// // // //     return (
// // // //       <SafeAreaView style={styles.container}>
// // // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
// // // //         <View style={styles.header}>
// // // //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // // //           </TouchableOpacity>
// // // //           <Text style={styles.headerTitle}>Order Tracking</Text>
// // // //           <View style={{ width: 40 }} />
// // // //         </View>

// // // //         <ScrollView showsVerticalScrollIndicator={false}>
// // // //           {renderDeliverySuccess()}
// // // //           <View style={styles.bottomPadding} />
// // // //         </ScrollView>
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   // ✅ Before delivery - show tracking (NO CHEF IMAGE)
// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // //       <View style={styles.header}>
// // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.headerTitle}>Order Tracking</Text>
// // // //         <TouchableOpacity style={styles.helpButton}>
// // // //           <Icon name="help-circle-outline" size={24} color="#fc8019" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // //         {/* Restaurant Info */}
// // // //         <View style={styles.restaurantContainer}>
// // // //           <View style={styles.restaurantHeader}>
// // // //             <View style={styles.restaurantIcon}>
// // // //               <Text style={styles.restaurantIconText}>
// // // //                 {restaurantName?.charAt(0) || 'Q'}
// // // //               </Text>
// // // //             </View>
// // // //             <View style={styles.restaurantInfo}>
// // // //               <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
// // // //               <Text style={styles.orderTime}>
// // // //                 Order placed at {new Date().toLocaleTimeString()}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //           <View style={styles.orderIdBadge}>
// // // //             <Text style={styles.orderIdText}>#{orderId || 'ORD-123456'}</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Status - NO CHEF IMAGE */}
// // // //         <View style={styles.progressContainer}>
// // // //           <View style={styles.statusHeader}>
// // // //             <Text style={styles.statusEmoji}>{getStatusEmoji(orderStatus)}</Text>
// // // //             <Text style={styles.statusTitle}>{orderStatus}</Text>
// // // //           </View>
// // // //           <Text style={styles.statusMessage}>{getStatusMessage(orderStatus)}</Text>
          
// // // //           <View style={styles.statusBadge}>
// // // //             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
// // // //             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
// // // //               {orderStatus}
// // // //             </Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Estimated Time */}
// // // //         <View style={styles.timeContainer}>
// // // //           <Icon name="time-outline" size={20} color="#fc8019" />
// // // //           <Text style={styles.timeLabel}>Estimated Delivery Time</Text>
// // // //           <Text style={styles.timeValue}>{estimatedTime}</Text>
// // // //         </View>

// // // //         {/* Progress Bar */}
// // // //         <View style={styles.progressBarContainer}>
// // // //           <View style={styles.progressBar}>
// // // //             <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
// // // //           </View>
// // // //           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
// // // //         </View>

// // // //         {/* Steps */}
// // // //         <View style={styles.stepsContainer}>
// // // //           {statusFlow.map((step, index) => {
// // // //             const status = getStepStatus(step);
// // // //             const isCompleted = status === 'completed';
// // // //             const isActive = status === 'active';
            
// // // //             return (
// // // //               <View key={index} style={styles.stepItem}>
// // // //                 <View style={styles.stepIndicator}>
// // // //                   <View style={[
// // // //                     styles.stepCircle,
// // // //                     isCompleted && styles.stepCircleCompleted,
// // // //                     isActive && styles.stepCircleActive,
// // // //                   ]}>
// // // //                     {isCompleted ? (
// // // //                       <Icon name="checkmark" size={16} color="#ffffff" />
// // // //                     ) : isActive ? (
// // // //                       <View style={styles.stepPulse} />
// // // //                     ) : (
// // // //                       <View style={styles.stepDot} />
// // // //                     )}
// // // //                   </View>
// // // //                   {index < statusFlow.length - 1 && (
// // // //                     <View style={[
// // // //                       styles.stepLine,
// // // //                       isCompleted && styles.stepLineCompleted,
// // // //                     ]} />
// // // //                   )}
// // // //                 </View>
// // // //                 <View style={styles.stepContent}>
// // // //                   <Text style={[
// // // //                     styles.stepLabel,
// // // //                     isCompleted && styles.stepLabelCompleted,
// // // //                     isActive && styles.stepLabelActive,
// // // //                   ]}>
// // // //                     {step}
// // // //                   </Text>
// // // //                   {isActive && (
// // // //                     <Text style={styles.stepSubtext}>In progress</Text>
// // // //                   )}
// // // //                   {isCompleted && (
// // // //                     <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
// // // //                   )}
// // // //                   {!isCompleted && !isActive && (
// // // //                     <Text style={styles.stepSubtextPending}>Pending</Text>
// // // //                   )}
// // // //                 </View>
// // // //               </View>
// // // //             );
// // // //           })}
// // // //         </View>

// // // //         {/* Delivery Partner - Only when On the way */}
// // // //         {(orderStatus === 'On the way') && (
// // // //           <View style={styles.deliveryCard}>
// // // //             <Text style={styles.deliveryTitle}>🛵 Delivery Partner</Text>
// // // //             <View style={styles.deliveryInfo}>
// // // //               <View style={styles.deliveryAvatar}>
// // // //                 <Text style={styles.deliveryAvatarText}>
// // // //                   {deliveryPartner.charAt(0)}
// // // //                 </Text>
// // // //               </View>
// // // //               <View style={styles.deliveryDetails}>
// // // //                 <Text style={styles.deliveryName}>{deliveryPartner}</Text>
// // // //                 <Text style={styles.deliveryPhone}>{partnerPhone}</Text>
// // // //                 <View style={styles.deliveryRating}>
// // // //                   <Icon name="star" size={14} color="#ffc107" />
// // // //                   <Text style={styles.deliveryRatingText}>{partnerRating} ★</Text>
// // // //                 </View>
// // // //               </View>
// // // //               <TouchableOpacity style={styles.callButton}>
// // // //                 <Icon name="call-outline" size={20} color="#ffffff" />
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //             <Text style={styles.deliveryStatus}>
// // // //               🚴 On the way to deliver your order
// // // //             </Text>
// // // //           </View>
// // // //         )}

// // // //         {/* Order Details */}
// // // //         <View style={styles.detailsCard}>
// // // //           <Text style={styles.detailsTitle}>Order Details</Text>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Payment Method</Text>
// // // //             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
// // // //           </View>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Payment Status</Text>
// // // //             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
// // // //               {paymentStatus || 'Pending'}
// // // //             </Text>
// // // //           </View>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Total Amount</Text>
// // // //             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
// // // //           </View>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Items</Text>
// // // //             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Items */}
// // // //         {items && items.length > 0 && (
// // // //           <View style={styles.itemsCard}>
// // // //             <Text style={styles.itemsTitle}>Items</Text>
// // // //             {items.map((item: any, index: number) => (
// // // //               <View key={index} style={styles.itemRow}>
// // // //                 <View style={styles.itemInfo}>
// // // //                   <Text style={styles.itemName}>{item.name}</Text>
// // // //                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
// // // //                 </View>
// // // //                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
// // // //               </View>
// // // //             ))}
// // // //           </View>
// // // //         )}

// // // //         {/* Live Tracking Note */}
// // // //         <View style={styles.liveNote}>
// // // //           <Icon name="radio-outline" size={16} color="#28a745" />
// // // //           <Text style={styles.liveNoteText}>Live tracking • Updates every 30 seconds</Text>
// // // //         </View>

// // // //         <View style={styles.bottomPadding} />
// // // //       </ScrollView>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#f8f9fa',
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //     backgroundColor: '#ffffff',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f0',
// // // //   },
// // // //   backButton: {
// // // //     padding: 4,
// // // //   },
// // // //   headerTitle: {
// // // //     flex: 1,
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     textAlign: 'center',
// // // //   },
// // // //   helpButton: {
// // // //     padding: 4,
// // // //   },
// // // //   restaurantContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     margin: 16,
// // // //     padding: 16,
// // // //     borderRadius: 12,
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   restaurantHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },
// // // //   restaurantIcon: {
// // // //     width: 48,
// // // //     height: 48,
// // // //     borderRadius: 24,
// // // //     backgroundColor: '#fc8019',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   restaurantIconText: {
// // // //     fontSize: 20,
// // // //     fontWeight: '700',
// // // //     color: '#ffffff',
// // // //   },
// // // //   restaurantInfo: {
// // // //     marginLeft: 12,
// // // //     flex: 1,
// // // //   },
// // // //   restaurantName: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   orderTime: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   orderIdBadge: {
// // // //     backgroundColor: '#f0f0f5',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 12,
// // // //   },
// // // //   orderIdText: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     fontWeight: '500',
// // // //   },
// // // //   progressContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     marginHorizontal: 16,
// // // //     padding: 20,
// // // //     borderRadius: 12,
// // // //     alignItems: 'center',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   statusHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },
// // // //   statusEmoji: {
// // // //     fontSize: 28,
// // // //     marginRight: 12,
// // // //   },
// // // //   statusTitle: {
// // // //     fontSize: 22,
// // // //     fontWeight: '700',
// // // //     color: '#282c3f',
// // // //   },
// // // //   statusMessage: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     textAlign: 'center',
// // // //     marginBottom: 12,
// // // //   },
// // // //   statusBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#f0f0f5',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 16,
// // // //   },
// // // //   statusText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     marginLeft: 6,
// // // //   },
// // // //   timeContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fff8f0',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 12,
// // // //     padding: 12,
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#fce4d6',
// // // //   },
// // // //   timeLabel: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginLeft: 8,
// // // //     flex: 1,
// // // //   },
// // // //   timeValue: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: '#fc8019',
// // // //   },
// // // //   progressBarContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 16,
// // // //   },
// // // //   progressBar: {
// // // //     flex: 1,
// // // //     height: 8,
// // // //     backgroundColor: '#f0f0f5',
// // // //     borderRadius: 4,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   progressFill: {
// // // //     height: '100%',
// // // //     backgroundColor: '#fc8019',
// // // //     borderRadius: 4,
// // // //   },
// // // //   progressPercentage: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: '#fc8019',
// // // //     marginLeft: 12,
// // // //     minWidth: 40,
// // // //     textAlign: 'right',
// // // //   },
// // // //   stepsContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     margin: 16,
// // // //     padding: 20,
// // // //     borderRadius: 12,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   stepItem: {
// // // //     flexDirection: 'row',
// // // //     marginBottom: 16,
// // // //   },
// // // //   stepIndicator: {
// // // //     alignItems: 'center',
// // // //     marginRight: 16,
// // // //     position: 'relative',
// // // //   },
// // // //   stepCircle: {
// // // //     width: 32,
// // // //     height: 32,
// // // //     borderRadius: 16,
// // // //     backgroundColor: '#f0f0f5',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     zIndex: 1,
// // // //   },
// // // //   stepCircleCompleted: {
// // // //     backgroundColor: '#28a745',
// // // //   },
// // // //   stepCircleActive: {
// // // //     backgroundColor: '#fc8019',
// // // //   },
// // // //   stepPulse: {
// // // //     width: 12,
// // // //     height: 12,
// // // //     borderRadius: 6,
// // // //     backgroundColor: '#ffffff',
// // // //     borderWidth: 2,
// // // //     borderColor: '#fc8019',
// // // //   },
// // // //   stepDot: {
// // // //     width: 8,
// // // //     height: 8,
// // // //     borderRadius: 4,
// // // //     backgroundColor: '#d0d0d0',
// // // //   },
// // // //   stepLine: {
// // // //     position: 'absolute',
// // // //     top: 32,
// // // //     width: 2,
// // // //     height: 40,
// // // //     backgroundColor: '#e0e0e0',
// // // //   },
// // // //   stepLineCompleted: {
// // // //     backgroundColor: '#28a745',
// // // //   },
// // // //   stepContent: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //   },
// // // //   stepLabel: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //   },
// // // //   stepLabelCompleted: {
// // // //     color: '#28a745',
// // // //     fontWeight: '500',
// // // //   },
// // // //   stepLabelActive: {
// // // //     color: '#fc8019',
// // // //     fontWeight: '600',
// // // //   },
// // // //   stepSubtext: {
// // // //     fontSize: 11,
// // // //     color: '#fc8019',
// // // //     marginTop: 2,
// // // //   },
// // // //   stepSubtextCompleted: {
// // // //     fontSize: 11,
// // // //     color: '#28a745',
// // // //     marginTop: 2,
// // // //   },
// // // //   stepSubtextPending: {
// // // //     fontSize: 11,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   deliveryCard: {
// // // //     backgroundColor: '#ffffff',
// // // //     marginHorizontal: 16,
// // // //     padding: 16,
// // // //     borderRadius: 12,
// // // //     marginTop: 16,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //     borderLeftWidth: 4,
// // // //     borderLeftColor: '#fc8019',
// // // //   },
// // // //   deliveryTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //   },
// // // //   deliveryInfo: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   deliveryAvatar: {
// // // //     width: 48,
// // // //     height: 48,
// // // //     borderRadius: 24,
// // // //     backgroundColor: '#17a2b8',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   deliveryAvatarText: {
// // // //     fontSize: 20,
// // // //     fontWeight: '700',
// // // //     color: '#ffffff',
// // // //   },
// // // //   deliveryDetails: {
// // // //     flex: 1,
// // // //     marginLeft: 12,
// // // //   },
// // // //   deliveryName: {
// // // //     fontSize: 15,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //   },
// // // //   deliveryPhone: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   deliveryRating: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginTop: 2,
// // // //   },
// // // //   deliveryRatingText: {
// // // //     fontSize: 12,
// // // //     color: '#282c3f',
// // // //     marginLeft: 4,
// // // //   },
// // // //   callButton: {
// // // //     backgroundColor: '#28a745',
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 20,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   deliveryStatus: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //     marginTop: 12,
// // // //     textAlign: 'center',
// // // //     backgroundColor: '#f0f0f5',
// // // //     paddingVertical: 8,
// // // //     borderRadius: 8,
// // // //   },
// // // //   detailsCard: {
// // // //     backgroundColor: '#ffffff',
// // // //     marginHorizontal: 16,
// // // //     padding: 16,
// // // //     borderRadius: 12,
// // // //     marginTop: 16,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   detailsTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //   },
// // // //   detailRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     paddingVertical: 6,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   detailLabel: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //   },
// // // //   detailValue: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     fontWeight: '500',
// // // //   },
// // // //   detailValueTotal: {
// // // //     fontSize: 16,
// // // //     fontWeight: '700',
// // // //     color: '#fc8019',
// // // //   },
// // // //   itemsCard: {
// // // //     backgroundColor: '#ffffff',
// // // //     marginHorizontal: 16,
// // // //     padding: 16,
// // // //     borderRadius: 12,
// // // //     marginTop: 16,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   itemsTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //   },
// // // //   itemRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 8,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   itemInfo: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   itemName: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //   },
// // // //   itemQuantity: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginLeft: 6,
// // // //   },
// // // //   itemPrice: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //   },
// // // //   liveNote: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginTop: 16,
// // // //     marginBottom: 8,
// // // //   },
// // // //   liveNoteText: {
// // // //     fontSize: 12,
// // // //     color: '#28a745',
// // // //     marginLeft: 6,
// // // //   },
// // // //   bottomPadding: {
// // // //     height: 30,
// // // //   },
// // // //   // ✅ Success Page Styles
// // // //   successContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     margin: 16,
// // // //     padding: 24,
// // // //     borderRadius: 16,
// // // //     alignItems: 'center',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   successIconContainer: {
// // // //     width: 100,
// // // //     height: 100,
// // // //     borderRadius: 50,
// // // //     backgroundColor: '#e8f5e9',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 16,
// // // //   },
// // // //   successTitle: {
// // // //     fontSize: 24,
// // // //     fontWeight: '700',
// // // //     color: '#282c3f',
// // // //     marginBottom: 8,
// // // //   },
// // // //   successSubtitle: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginBottom: 20,
// // // //     textAlign: 'center',
// // // //   },
// // // //   successDetails: {
// // // //     width: '100%',
// // // //     backgroundColor: '#f8f9fa',
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 20,
// // // //   },
// // // //   successRow: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     paddingVertical: 6,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#e9ecef',
// // // //   },
// // // //   successLabel: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //   },
// // // //   successValue: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     fontWeight: '500',
// // // //   },
// // // //   successTotal: {
// // // //     color: '#fc8019',
// // // //     fontWeight: '700',
// // // //     fontSize: 16,
// // // //   },
// // // //   ratingContainer: {
// // // //     width: '100%',
// // // //     marginBottom: 16,
// // // //   },
// // // //   ratingTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginBottom: 12,
// // // //     textAlign: 'center',
// // // //   },
// // // //   starsContainer: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'center',
// // // //   },
// // // //   starIcon: {
// // // //     marginHorizontal: 4,
// // // //   },
// // // //   ratingText: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     textAlign: 'center',
// // // //     marginTop: 8,
// // // //   },
// // // //   reviewContainer: {
// // // //     width: '100%',
// // // //     marginBottom: 20,
// // // //   },
// // // //   reviewInput: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 10,
// // // //     paddingHorizontal: 14,
// // // //     paddingVertical: 12,
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     backgroundColor: '#f8f9fa',
// // // //     minHeight: 80,
// // // //     textAlignVertical: 'top',
// // // //   },
// // // //   successButtons: {
// // // //     flexDirection: 'row',
// // // //     width: '100%',
// // // //     gap: 12,
// // // //     marginBottom: 12,
// // // //   },
// // // //   reorderButton: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingVertical: 12,
// // // //     borderRadius: 10,
// // // //     borderWidth: 1,
// // // //     borderColor: '#fc8019',
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   reorderButtonText: {
// // // //     color: '#fc8019',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     marginLeft: 6,
// // // //   },
// // // //   homeButton: {
// // // //     flex: 1,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     paddingVertical: 12,
// // // //     borderRadius: 10,
// // // //     backgroundColor: '#fc8019',
// // // //   },
// // // //   homeButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     marginLeft: 6,
// // // //   },
// // // //   submitReviewButton: {
// // // //     width: '100%',
// // // //     paddingVertical: 12,
// // // //     borderRadius: 10,
// // // //     backgroundColor: '#28a745',
// // // //     alignItems: 'center',
// // // //   },
// // // //   submitReviewText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //   },
// // // // });

// // // // export default OrderTrackingScreen;
// // // // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Animated,
// // //   TextInput,
// // //   Alert,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { colors } from '../../constants/colors';

// // // interface OrderTrackingScreenProps {
// // //   navigation: any;
// // //   route: any;
// // // }

// // // const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
// // //   const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
  
// // //   const [orderStatus, setOrderStatus] = useState<string>('Placed');
// // //   const [progress, setProgress] = useState<number>(0);
// // //   const [estimatedTime, setEstimatedTime] = useState<string>('25-30 min');
// // //   const [rating, setRating] = useState<number>(0);
// // //   const [review, setReview] = useState<string>('');
// // //   const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  
// // //   const [animatedValue] = useState(new Animated.Value(0));

// // //   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
// // //   const currentStep = statusFlow.indexOf(orderStatus);

// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       setProgress(prev => {
// // //         const newProgress = prev + 0.5;
// // //         if (newProgress >= 100) {
// // //           clearInterval(interval);
// // //           return 100;
// // //         }
// // //         return newProgress;
// // //       });
// // //     }, 1000);

// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   useEffect(() => {
// // //     Animated.timing(animatedValue, {
// // //       toValue: progress,
// // //       duration: 1000,
// // //       useNativeDriver: false,
// // //     }).start();

// // //     if (progress < 20) {
// // //       setOrderStatus('Placed');
// // //       setEstimatedTime('25-30 min');
// // //     } else if (progress < 40) {
// // //       setOrderStatus('Preparing');
// // //       setEstimatedTime('20-25 min');
// // //     } else if (progress < 60) {
// // //       setOrderStatus('Ready');
// // //       setEstimatedTime('15-20 min');
// // //     } else if (progress < 80) {
// // //       setOrderStatus('On the way');
// // //       setEstimatedTime('5-10 min');
// // //     } else if (progress >= 80) {
// // //       setOrderStatus('Delivered');
// // //       setEstimatedTime('Delivered! 🎉');
// // //     }
// // //   }, [progress]);

// // //   const getStatusColor = (status: string) => {
// // //     switch (status) {
// // //       case 'Placed': return '#ffc107';
// // //       case 'Preparing': return '#17a2b8';
// // //       case 'Ready': return '#28a745';
// // //       case 'On the way': return '#fc8019';
// // //       case 'Delivered': return '#28a745';
// // //       default: return '#7e808c';
// // //     }
// // //   };

// // //   const getStatusIcon = (status: string) => {
// // //     switch (status) {
// // //       case 'Placed': return 'time-outline';
// // //       case 'Preparing': return 'restaurant-outline';
// // //       case 'Ready': return 'checkmark-circle-outline';
// // //       case 'On the way': return 'bicycle-outline';
// // //       case 'Delivered': return 'checkmark-done-circle-outline';
// // //       default: return 'ellipse-outline';
// // //     }
// // //   };

// // //   const getStatusEmoji = (status: string) => {
// // //     switch (status) {
// // //       case 'Placed': return '📋';
// // //       case 'Preparing': return '⏳';
// // //       case 'Ready': return '✅';
// // //       case 'On the way': return '🚴';
// // //       case 'Delivered': return '🎉';
// // //       default: return '📦';
// // //     }
// // //   };

// // //   const getStatusMessage = (status: string) => {
// // //     switch (status) {
// // //       case 'Placed': return 'Your order has been placed and confirmed';
// // //       case 'Preparing': return 'Your order is being prepared';
// // //       case 'Ready': return 'Your order is ready for delivery';
// // //       case 'On the way': return 'Your delivery partner is on the way!';
// // //       case 'Delivered': return '🎉 Your order has been delivered successfully!';
// // //       default: return 'Processing your order';
// // //     }
// // //   };

// // //   const getStepStatus = (step: string) => {
// // //     const stepIndex = statusFlow.indexOf(step);
// // //     if (stepIndex < currentStep) return 'completed';
// // //     if (stepIndex === currentStep) return 'active';
// // //     return 'pending';
// // //   };

// // //   // ✅ Handle Reorder - Navigate to Cart
// // //   const handleReorder = () => {
// // //     Alert.alert(
// // //       '🔄 Reorder',
// // //       `Add items to cart?`,
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         { 
// // //           text: 'Add to Cart', 
// // //           onPress: () => {
// // //             navigation.navigate('Cart');
// // //           }
// // //         },
// // //       ]
// // //     );
// // //   };

// // //   // ✅ Handle Submit Review - Working
// // //   const handleSubmitReview = () => {
// // //     if (rating === 0) {
// // //       Alert.alert('⭐ Rating Required', 'Please tap a star to rate your order.');
// // //       return;
// // //     }

// // //     setReviewSubmitted(true);
// // //     Alert.alert(
// // //       '✅ Thank You!',
// // //       `Your review has been submitted!\n\nRating: ${rating} ★\nReview: ${review || 'No review provided'}`,
// // //       [
// // //         { 
// // //           text: 'OK', 
// // //           onPress: () => {
// // //             // Navigate to Orders after review
// // //             navigation.navigate('Orders');
// // //           }
// // //         }
// // //       ]
// // //     );
// // //   };

// // //   // ✅ Handle Home Navigation
// // //   const handleGoHome = () => {
// // //     navigation.navigate('Home');
// // //   };

// // //   const progressWidth = animatedValue.interpolate({
// // //     inputRange: [0, 100],
// // //     outputRange: ['0%', '100%'],
// // //   });

// // //   // ✅ If delivered, show success page
// // //   if (orderStatus === 'Delivered') {
// // //     return (
// // //       <SafeAreaView style={styles.container}>
// // //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
// // //         <View style={styles.header}>
// // //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // //           </TouchableOpacity>
// // //           <Text style={styles.headerTitle}>Order Tracking</Text>
// // //           <View style={{ width: 40 }} />
// // //         </View>

// // //         <ScrollView showsVerticalScrollIndicator={false}>
// // //           <View style={styles.successContainer}>
// // //             <View style={styles.successIconContainer}>
// // //               <Icon name="checkmark-circle" size={80} color="#28a745" />
// // //             </View>
// // //             <Text style={styles.successTitle}>🎉 Order Delivered!</Text>
// // //             <Text style={styles.successSubtitle}>Your order has been delivered successfully</Text>
            
// // //             <View style={styles.successDetails}>
// // //               <View style={styles.successRow}>
// // //                 <Text style={styles.successLabel}>Order ID</Text>
// // //                 <Text style={styles.successValue}>{orderId}</Text>
// // //               </View>
// // //               <View style={styles.successRow}>
// // //                 <Text style={styles.successLabel}>Delivered</Text>
// // //                 <Text style={styles.successValue}>{new Date().toLocaleTimeString()}</Text>
// // //               </View>
// // //               <View style={styles.successRow}>
// // //                 <Text style={styles.successLabel}>Total Amount</Text>
// // //                 <Text style={[styles.successValue, styles.successTotal]}>₹{total}</Text>
// // //               </View>
// // //             </View>

// // //             {/* ⭐ Rating Stars */}
// // //             <View style={styles.ratingContainer}>
// // //               <Text style={styles.ratingTitle}>Rate your order</Text>
// // //               <View style={styles.starsContainer}>
// // //                 {[1, 2, 3, 4, 5].map((star) => (
// // //                   <TouchableOpacity key={star} onPress={() => setRating(star)}>
// // //                     <Icon
// // //                       name={star <= rating ? 'star' : 'star-outline'}
// // //                       size={36}
// // //                       color={star <= rating ? '#ffc107' : '#d0d0d0'}
// // //                       style={styles.starIcon}
// // //                     />
// // //                   </TouchableOpacity>
// // //                 ))}
// // //               </View>
// // //               <Text style={styles.ratingText}>
// // //                 {rating > 0 ? `${rating} stars` : 'Tap a star to rate'}
// // //               </Text>
// // //             </View>

// // //             {/* ✍️ Review Input */}
// // //             <View style={styles.reviewContainer}>
// // //               <TextInput
// // //                 style={styles.reviewInput}
// // //                 placeholder="Write a review..."
// // //                 value={review}
// // //                 onChangeText={setReview}
// // //                 multiline
// // //                 numberOfLines={3}
// // //                 editable={!reviewSubmitted}
// // //               />
// // //             </View>

// // //             {/* Buttons */}
// // //             <View style={styles.successButtons}>
// // //               <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
// // //                 <Icon name="refresh-outline" size={20} color="#fc8019" />
// // //                 <Text style={styles.reorderButtonText}>Reorder</Text>
// // //               </TouchableOpacity>
              
// // //               <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
// // //                 <Icon name="home-outline" size={20} color="#ffffff" />
// // //                 <Text style={styles.homeButtonText}>Home</Text>
// // //               </TouchableOpacity>
// // //             </View>

// // //             {/* ✅ Submit Review Button */}
// // //             <TouchableOpacity 
// // //               style={[styles.submitReviewButton, reviewSubmitted && styles.submitReviewButtonDisabled]} 
// // //               onPress={handleSubmitReview}
// // //               disabled={reviewSubmitted}
// // //             >
// // //               <Text style={styles.submitReviewText}>
// // //                 {reviewSubmitted ? '✅ Review Submitted' : 'Submit Review'}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //           <View style={styles.bottomPadding} />
// // //         </ScrollView>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   // ✅ Before delivery - show tracking
// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>Order Tracking</Text>
// // //         <TouchableOpacity style={styles.helpButton}>
// // //           <Icon name="help-circle-outline" size={24} color="#fc8019" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       <ScrollView showsVerticalScrollIndicator={false}>
// // //         {/* Restaurant Info */}
// // //         <View style={styles.restaurantContainer}>
// // //           <View style={styles.restaurantHeader}>
// // //             <View style={styles.restaurantIcon}>
// // //               <Text style={styles.restaurantIconText}>
// // //                 {restaurantName?.charAt(0) || 'Q'}
// // //               </Text>
// // //             </View>
// // //             <View style={styles.restaurantInfo}>
// // //               <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
// // //               <Text style={styles.orderTime}>
// // //                 Order placed at {new Date().toLocaleTimeString()}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //           <View style={styles.orderIdBadge}>
// // //             <Text style={styles.orderIdText}>#{orderId || 'ORD-123456'}</Text>
// // //           </View>
// // //         </View>

// // //         {/* Status */}
// // //         <View style={styles.progressContainer}>
// // //           <View style={styles.statusHeader}>
// // //             <Text style={styles.statusEmoji}>{getStatusEmoji(orderStatus)}</Text>
// // //             <Text style={styles.statusTitle}>{orderStatus}</Text>
// // //           </View>
// // //           <Text style={styles.statusMessage}>{getStatusMessage(orderStatus)}</Text>
          
// // //           <View style={styles.statusBadge}>
// // //             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
// // //             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
// // //               {orderStatus}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         {/* Estimated Time */}
// // //         <View style={styles.timeContainer}>
// // //           <Icon name="time-outline" size={20} color="#fc8019" />
// // //           <Text style={styles.timeLabel}>Estimated Delivery Time</Text>
// // //           <Text style={styles.timeValue}>{estimatedTime}</Text>
// // //         </View>

// // //         {/* Progress Bar */}
// // //         <View style={styles.progressBarContainer}>
// // //           <View style={styles.progressBar}>
// // //             <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
// // //           </View>
// // //           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
// // //         </View>

// // //         {/* Steps */}
// // //         <View style={styles.stepsContainer}>
// // //           {statusFlow.map((step, index) => {
// // //             const status = getStepStatus(step);
// // //             const isCompleted = status === 'completed';
// // //             const isActive = status === 'active';
            
// // //             return (
// // //               <View key={index} style={styles.stepItem}>
// // //                 <View style={styles.stepIndicator}>
// // //                   <View style={[
// // //                     styles.stepCircle,
// // //                     isCompleted && styles.stepCircleCompleted,
// // //                     isActive && styles.stepCircleActive,
// // //                   ]}>
// // //                     {isCompleted ? (
// // //                       <Icon name="checkmark" size={16} color="#ffffff" />
// // //                     ) : isActive ? (
// // //                       <View style={styles.stepPulse} />
// // //                     ) : (
// // //                       <View style={styles.stepDot} />
// // //                     )}
// // //                   </View>
// // //                   {index < statusFlow.length - 1 && (
// // //                     <View style={[
// // //                       styles.stepLine,
// // //                       isCompleted && styles.stepLineCompleted,
// // //                     ]} />
// // //                   )}
// // //                 </View>
// // //                 <View style={styles.stepContent}>
// // //                   <Text style={[
// // //                     styles.stepLabel,
// // //                     isCompleted && styles.stepLabelCompleted,
// // //                     isActive && styles.stepLabelActive,
// // //                   ]}>
// // //                     {step}
// // //                   </Text>
// // //                   {isActive && (
// // //                     <Text style={styles.stepSubtext}>In progress</Text>
// // //                   )}
// // //                   {isCompleted && (
// // //                     <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
// // //                   )}
// // //                   {!isCompleted && !isActive && (
// // //                     <Text style={styles.stepSubtextPending}>Pending</Text>
// // //                   )}
// // //                 </View>
// // //               </View>
// // //             );
// // //           })}
// // //         </View>

// // //         {/* Order Details */}
// // //         <View style={styles.detailsCard}>
// // //           <Text style={styles.detailsTitle}>Order Details</Text>
// // //           <View style={styles.detailRow}>
// // //             <Text style={styles.detailLabel}>Payment Method</Text>
// // //             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
// // //           </View>
// // //           <View style={styles.detailRow}>
// // //             <Text style={styles.detailLabel}>Payment Status</Text>
// // //             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
// // //               {paymentStatus || 'Pending'}
// // //             </Text>
// // //           </View>
// // //           <View style={styles.detailRow}>
// // //             <Text style={styles.detailLabel}>Total Amount</Text>
// // //             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
// // //           </View>
// // //           <View style={styles.detailRow}>
// // //             <Text style={styles.detailLabel}>Items</Text>
// // //             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
// // //           </View>
// // //         </View>

// // //         {/* Items */}
// // //         {items && items.length > 0 && (
// // //           <View style={styles.itemsCard}>
// // //             <Text style={styles.itemsTitle}>Items</Text>
// // //             {items.map((item: any, index: number) => (
// // //               <View key={index} style={styles.itemRow}>
// // //                 <View style={styles.itemInfo}>
// // //                   <Text style={styles.itemName}>{item.name}</Text>
// // //                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
// // //                 </View>
// // //                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
// // //               </View>
// // //             ))}
// // //           </View>
// // //         )}

// // //         <View style={styles.bottomPadding} />
// // //       </ScrollView>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f8f9fa',
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     backgroundColor: '#ffffff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f0',
// // //   },
// // //   backButton: {
// // //     padding: 4,
// // //   },
// // //   headerTitle: {
// // //     flex: 1,
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     textAlign: 'center',
// // //   },
// // //   helpButton: {
// // //     padding: 4,
// // //   },
// // //   restaurantContainer: {
// // //     backgroundColor: '#ffffff',
// // //     margin: 16,
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   restaurantHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   restaurantIcon: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 24,
// // //     backgroundColor: '#fc8019',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   restaurantIconText: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: '#ffffff',
// // //   },
// // //   restaurantInfo: {
// // //     marginLeft: 12,
// // //     flex: 1,
// // //   },
// // //   restaurantName: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   orderTime: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   orderIdBadge: {
// // //     backgroundColor: '#f0f0f5',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //   },
// // //   orderIdText: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     fontWeight: '500',
// // //   },
// // //   progressContainer: {
// // //     backgroundColor: '#ffffff',
// // //     marginHorizontal: 16,
// // //     padding: 20,
// // //     borderRadius: 12,
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   statusHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   statusEmoji: {
// // //     fontSize: 28,
// // //     marginRight: 12,
// // //   },
// // //   statusTitle: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: '#282c3f',
// // //   },
// // //   statusMessage: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     textAlign: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   statusBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#f0f0f5',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 6,
// // //     borderRadius: 16,
// // //   },
// // //   statusText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginLeft: 6,
// // //   },
// // //   timeContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff8f0',
// // //     marginHorizontal: 16,
// // //     marginTop: 12,
// // //     padding: 12,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#fce4d6',
// // //   },
// // //   timeLabel: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginLeft: 8,
// // //     flex: 1,
// // //   },
// // //   timeValue: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#fc8019',
// // //   },
// // //   progressBarContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginHorizontal: 16,
// // //     marginTop: 16,
// // //   },
// // //   progressBar: {
// // //     flex: 1,
// // //     height: 8,
// // //     backgroundColor: '#f0f0f5',
// // //     borderRadius: 4,
// // //     overflow: 'hidden',
// // //   },
// // //   progressFill: {
// // //     height: '100%',
// // //     backgroundColor: '#fc8019',
// // //     borderRadius: 4,
// // //   },
// // //   progressPercentage: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#fc8019',
// // //     marginLeft: 12,
// // //     minWidth: 40,
// // //     textAlign: 'right',
// // //   },
// // //   stepsContainer: {
// // //     backgroundColor: '#ffffff',
// // //     margin: 16,
// // //     padding: 20,
// // //     borderRadius: 12,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   stepItem: {
// // //     flexDirection: 'row',
// // //     marginBottom: 16,
// // //   },
// // //   stepIndicator: {
// // //     alignItems: 'center',
// // //     marginRight: 16,
// // //     position: 'relative',
// // //   },
// // //   stepCircle: {
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 16,
// // //     backgroundColor: '#f0f0f5',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     zIndex: 1,
// // //   },
// // //   stepCircleCompleted: {
// // //     backgroundColor: '#28a745',
// // //   },
// // //   stepCircleActive: {
// // //     backgroundColor: '#fc8019',
// // //   },
// // //   stepPulse: {
// // //     width: 12,
// // //     height: 12,
// // //     borderRadius: 6,
// // //     backgroundColor: '#ffffff',
// // //     borderWidth: 2,
// // //     borderColor: '#fc8019',
// // //   },
// // //   stepDot: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //     backgroundColor: '#d0d0d0',
// // //   },
// // //   stepLine: {
// // //     position: 'absolute',
// // //     top: 32,
// // //     width: 2,
// // //     height: 40,
// // //     backgroundColor: '#e0e0e0',
// // //   },
// // //   stepLineCompleted: {
// // //     backgroundColor: '#28a745',
// // //   },
// // //   stepContent: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //   },
// // //   stepLabel: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //   },
// // //   stepLabelCompleted: {
// // //     color: '#28a745',
// // //     fontWeight: '500',
// // //   },
// // //   stepLabelActive: {
// // //     color: '#fc8019',
// // //     fontWeight: '600',
// // //   },
// // //   stepSubtext: {
// // //     fontSize: 11,
// // //     color: '#fc8019',
// // //     marginTop: 2,
// // //   },
// // //   stepSubtextCompleted: {
// // //     fontSize: 11,
// // //     color: '#28a745',
// // //     marginTop: 2,
// // //   },
// // //   stepSubtextPending: {
// // //     fontSize: 11,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   detailsCard: {
// // //     backgroundColor: '#ffffff',
// // //     marginHorizontal: 16,
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginTop: 16,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   detailsTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   detailRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingVertical: 6,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   detailLabel: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //   },
// // //   detailValue: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     fontWeight: '500',
// // //   },
// // //   detailValueTotal: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: '#fc8019',
// // //   },
// // //   itemsCard: {
// // //     backgroundColor: '#ffffff',
// // //     marginHorizontal: 16,
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     marginTop: 16,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   itemsTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   itemRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 8,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   itemInfo: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   itemName: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //   },
// // //   itemQuantity: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginLeft: 6,
// // //   },
// // //   itemPrice: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //   },
// // //   bottomPadding: {
// // //     height: 30,
// // //   },
// // //   // ✅ Success Page Styles
// // //   successContainer: {
// // //     backgroundColor: '#ffffff',
// // //     margin: 16,
// // //     padding: 24,
// // //     borderRadius: 16,
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   successIconContainer: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: '#e8f5e9',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   successTitle: {
// // //     fontSize: 24,
// // //     fontWeight: '700',
// // //     color: '#282c3f',
// // //     marginBottom: 8,
// // //   },
// // //   successSubtitle: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginBottom: 20,
// // //     textAlign: 'center',
// // //   },
// // //   successDetails: {
// // //     width: '100%',
// // //     backgroundColor: '#f8f9fa',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 20,
// // //   },
// // //   successRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingVertical: 6,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#e9ecef',
// // //   },
// // //   successLabel: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //   },
// // //   successValue: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     fontWeight: '500',
// // //   },
// // //   successTotal: {
// // //     color: '#fc8019',
// // //     fontWeight: '700',
// // //     fontSize: 16,
// // //   },
// // //   ratingContainer: {
// // //     width: '100%',
// // //     marginBottom: 16,
// // //   },
// // //   ratingTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //     textAlign: 'center',
// // //   },
// // //   starsContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //   },
// // //   starIcon: {
// // //     marginHorizontal: 4,
// // //   },
// // //   ratingText: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     textAlign: 'center',
// // //     marginTop: 8,
// // //   },
// // //   reviewContainer: {
// // //     width: '100%',
// // //     marginBottom: 20,
// // //   },
// // //   reviewInput: {
// // //     borderWidth: 1,
// // //     borderColor: '#e0e0e0',
// // //     borderRadius: 10,
// // //     paddingHorizontal: 14,
// // //     paddingVertical: 12,
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     backgroundColor: '#f8f9fa',
// // //     minHeight: 80,
// // //     textAlignVertical: 'top',
// // //   },
// // //   successButtons: {
// // //     flexDirection: 'row',
// // //     width: '100%',
// // //     gap: 12,
// // //     marginBottom: 12,
// // //   },
// // //   reorderButton: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     borderWidth: 1,
// // //     borderColor: '#fc8019',
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   reorderButtonText: {
// // //     color: '#fc8019',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginLeft: 6,
// // //   },
// // //   homeButton: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     backgroundColor: '#fc8019',
// // //   },
// // //   homeButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     marginLeft: 6,
// // //   },
// // //   submitReviewButton: {
// // //     width: '100%',
// // //     paddingVertical: 12,
// // //     borderRadius: 10,
// // //     backgroundColor: '#28a745',
// // //     alignItems: 'center',
// // //   },
// // //   submitReviewButtonDisabled: {
// // //     backgroundColor: '#6c757d',
// // //   },
// // //   submitReviewText: {
// // //     color: '#ffffff',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // // });

// // // export default OrderTrackingScreen;
// // // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// // import React, { useState, useEffect, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// //   StatusBar,
// //   Animated,
// //   TextInput,
// //   Alert,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { colors } from '../../constants/colors';
// // import { OrderContext } from '../../context/OrderContext';

// // interface OrderTrackingScreenProps {
// //   navigation: any;
// //   route: any;
// // }

// // const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
// //   const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
// //   const { updateOrderStatus } = useContext(OrderContext);
  
// //   const [orderStatus, setOrderStatus] = useState<string>('Placed');
// //   const [progress, setProgress] = useState<number>(0);
// //   const [estimatedTime, setEstimatedTime] = useState<string>('25-30 min');
// //   const [rating, setRating] = useState<number>(0);
// //   const [review, setReview] = useState<string>('');
// //   const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
// //   const [isDelivered, setIsDelivered] = useState<boolean>(false);
  
// //   const [animatedValue] = useState(new Animated.Value(0));

// //   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
// //   const currentStep = statusFlow.indexOf(orderStatus);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setProgress(prev => {
// //         const newProgress = prev + 0.5;
// //         if (newProgress >= 100) {
// //           clearInterval(interval);
          
// //           // ✅ When progress reaches 100%, update order status to Delivered
// //           if (!isDelivered && orderId) {
// //             setIsDelivered(true);
// //             updateOrderStatus(orderId, 'Delivered');
// //             console.log('✅ Order marked as Delivered:', orderId);
// //           }
          
// //           return 100;
// //         }
// //         return newProgress;
// //       });
// //     }, 1000);

// //     return () => clearInterval(interval);
// //   }, [orderId, isDelivered]);

// //   useEffect(() => {
// //     Animated.timing(animatedValue, {
// //       toValue: progress,
// //       duration: 1000,
// //       useNativeDriver: false,
// //     }).start();

// //     if (progress < 20) {
// //       setOrderStatus('Placed');
// //       setEstimatedTime('25-30 min');
// //     } else if (progress < 40) {
// //       setOrderStatus('Preparing');
// //       setEstimatedTime('20-25 min');
// //     } else if (progress < 60) {
// //       setOrderStatus('Ready');
// //       setEstimatedTime('15-20 min');
// //     } else if (progress < 80) {
// //       setOrderStatus('On the way');
// //       setEstimatedTime('5-10 min');
// //     } else if (progress >= 80) {
// //       setOrderStatus('Delivered');
// //       setEstimatedTime('Delivered! 🎉');
// //     }
// //   }, [progress]);

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case 'Placed': return '#ffc107';
// //       case 'Preparing': return '#17a2b8';
// //       case 'Ready': return '#28a745';
// //       case 'On the way': return '#fc8019';
// //       case 'Delivered': return '#28a745';
// //       default: return '#7e808c';
// //     }
// //   };

// //   const getStatusIcon = (status: string) => {
// //     switch (status) {
// //       case 'Placed': return 'time-outline';
// //       case 'Preparing': return 'restaurant-outline';
// //       case 'Ready': return 'checkmark-circle-outline';
// //       case 'On the way': return 'bicycle-outline';
// //       case 'Delivered': return 'checkmark-done-circle-outline';
// //       default: return 'ellipse-outline';
// //     }
// //   };

// //   const getStatusEmoji = (status: string) => {
// //     switch (status) {
// //       case 'Placed': return '📋';
// //       case 'Preparing': return '⏳';
// //       case 'Ready': return '✅';
// //       case 'On the way': return '🚴';
// //       case 'Delivered': return '🎉';
// //       default: return '📦';
// //     }
// //   };

// //   const getStatusMessage = (status: string) => {
// //     switch (status) {
// //       case 'Placed': return 'Your order has been placed and confirmed';
// //       case 'Preparing': return 'Your order is being prepared';
// //       case 'Ready': return 'Your order is ready for delivery';
// //       case 'On the way': return 'Your delivery partner is on the way!';
// //       case 'Delivered': return '🎉 Your order has been delivered successfully!';
// //       default: return 'Processing your order';
// //     }
// //   };

// //   const getStepStatus = (step: string) => {
// //     const stepIndex = statusFlow.indexOf(step);
// //     if (stepIndex < currentStep) return 'completed';
// //     if (stepIndex === currentStep) return 'active';
// //     return 'pending';
// //   };

// //   // ✅ Handle Reorder
// //   const handleReorder = () => {
// //     Alert.alert(
// //       '🔄 Reorder',
// //       `Add items to cart?`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         { 
// //           text: 'Add to Cart', 
// //           onPress: () => {
// //             navigation.navigate('Cart');
// //           }
// //         },
// //       ]
// //     );
// //   };

// //   // ✅ Handle Submit Review
// //   const handleSubmitReview = () => {
// //     if (rating === 0) {
// //       Alert.alert('⭐ Rating Required', 'Please tap a star to rate your order.');
// //       return;
// //     }

// //     setReviewSubmitted(true);
// //     Alert.alert(
// //       '✅ Thank You!',
// //       `Your review has been submitted!\n\nRating: ${rating} ★\nReview: ${review || 'No review provided'}`,
// //       [
// //         { 
// //           text: 'OK', 
// //           onPress: () => {
// //             navigation.navigate('Orders');
// //           }
// //         }
// //       ]
// //     );
// //   };

// //   // ✅ Handle Home Navigation
// //   const handleGoHome = () => {
// //     navigation.navigate('Home');
// //   };

// //   const progressWidth = animatedValue.interpolate({
// //     inputRange: [0, 100],
// //     outputRange: ['0%', '100%'],
// //   });

// //   // ✅ If delivered, show success page
// //   if (orderStatus === 'Delivered') {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //             <Icon name="arrow-back" size={24} color="#282c3f" />
// //           </TouchableOpacity>
// //           <Text style={styles.headerTitle}>Order Tracking</Text>
// //           <View style={{ width: 40 }} />
// //         </View>

// //         <ScrollView showsVerticalScrollIndicator={false}>
// //           <View style={styles.successContainer}>
// //             <View style={styles.successIconContainer}>
// //               <Icon name="checkmark-circle" size={80} color="#28a745" />
// //             </View>
// //             <Text style={styles.successTitle}>🎉 Order Delivered!</Text>
// //             <Text style={styles.successSubtitle}>Your order has been delivered successfully</Text>
            
// //             <View style={styles.successDetails}>
// //               <View style={styles.successRow}>
// //                 <Text style={styles.successLabel}>Order ID</Text>
// //                 <Text style={styles.successValue}>{orderId}</Text>
// //               </View>
// //               <View style={styles.successRow}>
// //                 <Text style={styles.successLabel}>Delivered</Text>
// //                 <Text style={styles.successValue}>{new Date().toLocaleTimeString()}</Text>
// //               </View>
// //               <View style={styles.successRow}>
// //                 <Text style={styles.successLabel}>Total Amount</Text>
// //                 <Text style={[styles.successValue, styles.successTotal]}>₹{total}</Text>
// //               </View>
// //             </View>

// //             {/* ⭐ Rating Stars */}
// //             <View style={styles.ratingContainer}>
// //               <Text style={styles.ratingTitle}>Rate your order</Text>
// //               <View style={styles.starsContainer}>
// //                 {[1, 2, 3, 4, 5].map((star) => (
// //                   <TouchableOpacity key={star} onPress={() => setRating(star)}>
// //                     <Icon
// //                       name={star <= rating ? 'star' : 'star-outline'}
// //                       size={36}
// //                       color={star <= rating ? '#ffc107' : '#d0d0d0'}
// //                       style={styles.starIcon}
// //                     />
// //                   </TouchableOpacity>
// //                 ))}
// //               </View>
// //               <Text style={styles.ratingText}>
// //                 {rating > 0 ? `${rating} stars` : 'Tap a star to rate'}
// //               </Text>
// //             </View>

// //             {/* ✍️ Review Input */}
// //             <View style={styles.reviewContainer}>
// //               <TextInput
// //                 style={styles.reviewInput}
// //                 placeholder="Write a review..."
// //                 value={review}
// //                 onChangeText={setReview}
// //                 multiline
// //                 numberOfLines={3}
// //                 editable={!reviewSubmitted}
// //               />
// //             </View>

// //             {/* Buttons */}
// //             <View style={styles.successButtons}>
// //               <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
// //                 <Icon name="refresh-outline" size={20} color="#fc8019" />
// //                 <Text style={styles.reorderButtonText}>Reorder</Text>
// //               </TouchableOpacity>
              
// //               <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
// //                 <Icon name="home-outline" size={20} color="#ffffff" />
// //                 <Text style={styles.homeButtonText}>Home</Text>
// //               </TouchableOpacity>
// //             </View>

// //             <TouchableOpacity 
// //               style={[styles.submitReviewButton, reviewSubmitted && styles.submitReviewButtonDisabled]} 
// //               onPress={handleSubmitReview}
// //               disabled={reviewSubmitted}
// //             >
// //               <Text style={styles.submitReviewText}>
// //                 {reviewSubmitted ? '✅ Review Submitted' : 'Submit Review'}
// //               </Text>
// //             </TouchableOpacity>
// //           </View>
// //           <View style={styles.bottomPadding} />
// //         </ScrollView>
// //       </SafeAreaView>
// //     );
// //   }

// //   // ✅ Before delivery - show tracking
// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //           <Icon name="arrow-back" size={24} color="#282c3f" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Order Tracking</Text>
// //         <TouchableOpacity style={styles.helpButton}>
// //           <Icon name="help-circle-outline" size={24} color="#fc8019" />
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         {/* Restaurant Info */}
// //         <View style={styles.restaurantContainer}>
// //           <View style={styles.restaurantHeader}>
// //             <View style={styles.restaurantIcon}>
// //               <Text style={styles.restaurantIconText}>
// //                 {restaurantName?.charAt(0) || 'Q'}
// //               </Text>
// //             </View>
// //             <View style={styles.restaurantInfo}>
// //               <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
// //               <Text style={styles.orderTime}>
// //                 Order placed at {new Date().toLocaleTimeString()}
// //               </Text>
// //             </View>
// //           </View>
// //           <View style={styles.orderIdBadge}>
// //             <Text style={styles.orderIdText}>#{orderId || 'ORD-123456'}</Text>
// //           </View>
// //         </View>

// //         {/* Status */}
// //         <View style={styles.progressContainer}>
// //           <View style={styles.statusHeader}>
// //             <Text style={styles.statusEmoji}>{getStatusEmoji(orderStatus)}</Text>
// //             <Text style={styles.statusTitle}>{orderStatus}</Text>
// //           </View>
// //           <Text style={styles.statusMessage}>{getStatusMessage(orderStatus)}</Text>
          
// //           <View style={styles.statusBadge}>
// //             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
// //             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
// //               {orderStatus}
// //             </Text>
// //           </View>
// //         </View>

// //         {/* Estimated Time */}
// //         <View style={styles.timeContainer}>
// //           <Icon name="time-outline" size={20} color="#fc8019" />
// //           <Text style={styles.timeLabel}>Estimated Delivery Time</Text>
// //           <Text style={styles.timeValue}>{estimatedTime}</Text>
// //         </View>

// //         {/* Progress Bar */}
// //         <View style={styles.progressBarContainer}>
// //           <View style={styles.progressBar}>
// //             <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
// //           </View>
// //           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
// //         </View>

// //         {/* Steps */}
// //         <View style={styles.stepsContainer}>
// //           {statusFlow.map((step, index) => {
// //             const status = getStepStatus(step);
// //             const isCompleted = status === 'completed';
// //             const isActive = status === 'active';
            
// //             return (
// //               <View key={index} style={styles.stepItem}>
// //                 <View style={styles.stepIndicator}>
// //                   <View style={[
// //                     styles.stepCircle,
// //                     isCompleted && styles.stepCircleCompleted,
// //                     isActive && styles.stepCircleActive,
// //                   ]}>
// //                     {isCompleted ? (
// //                       <Icon name="checkmark" size={16} color="#ffffff" />
// //                     ) : isActive ? (
// //                       <View style={styles.stepPulse} />
// //                     ) : (
// //                       <View style={styles.stepDot} />
// //                     )}
// //                   </View>
// //                   {index < statusFlow.length - 1 && (
// //                     <View style={[
// //                       styles.stepLine,
// //                       isCompleted && styles.stepLineCompleted,
// //                     ]} />
// //                   )}
// //                 </View>
// //                 <View style={styles.stepContent}>
// //                   <Text style={[
// //                     styles.stepLabel,
// //                     isCompleted && styles.stepLabelCompleted,
// //                     isActive && styles.stepLabelActive,
// //                   ]}>
// //                     {step}
// //                   </Text>
// //                   {isActive && (
// //                     <Text style={styles.stepSubtext}>In progress</Text>
// //                   )}
// //                   {isCompleted && (
// //                     <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
// //                   )}
// //                   {!isCompleted && !isActive && (
// //                     <Text style={styles.stepSubtextPending}>Pending</Text>
// //                   )}
// //                 </View>
// //               </View>
// //             );
// //           })}
// //         </View>

// //         {/* Order Details */}
// //         <View style={styles.detailsCard}>
// //           <Text style={styles.detailsTitle}>Order Details</Text>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.detailLabel}>Payment Method</Text>
// //             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.detailLabel}>Payment Status</Text>
// //             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
// //               {paymentStatus || 'Pending'}
// //             </Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.detailLabel}>Total Amount</Text>
// //             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Text style={styles.detailLabel}>Items</Text>
// //             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
// //           </View>
// //         </View>

// //         {/* Items */}
// //         {items && items.length > 0 && (
// //           <View style={styles.itemsCard}>
// //             <Text style={styles.itemsTitle}>Items</Text>
// //             {items.map((item: any, index: number) => (
// //               <View key={index} style={styles.itemRow}>
// //                 <View style={styles.itemInfo}>
// //                   <Text style={styles.itemName}>{item.name}</Text>
// //                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
// //                 </View>
// //                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
// //               </View>
// //             ))}
// //           </View>
// //         )}

// //         <View style={styles.bottomPadding} />
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     backgroundColor: '#ffffff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f0',
// //   },
// //   backButton: {
// //     padding: 4,
// //   },
// //   headerTitle: {
// //     flex: 1,
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     textAlign: 'center',
// //   },
// //   helpButton: {
// //     padding: 4,
// //   },
// //   restaurantContainer: {
// //     backgroundColor: '#ffffff',
// //     margin: 16,
// //     padding: 16,
// //     borderRadius: 12,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   restaurantHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   restaurantIcon: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     backgroundColor: '#fc8019',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   restaurantIconText: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   restaurantInfo: {
// //     marginLeft: 12,
// //     flex: 1,
// //   },
// //   restaurantName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   orderTime: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   orderIdBadge: {
// //     backgroundColor: '#f0f0f5',
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   orderIdText: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     fontWeight: '500',
// //   },
// //   progressContainer: {
// //     backgroundColor: '#ffffff',
// //     marginHorizontal: 16,
// //     padding: 20,
// //     borderRadius: 12,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   statusHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   statusEmoji: {
// //     fontSize: 28,
// //     marginRight: 12,
// //   },
// //   statusTitle: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: '#282c3f',
// //   },
// //   statusMessage: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     textAlign: 'center',
// //     marginBottom: 12,
// //   },
// //   statusBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f0f5',
// //     paddingHorizontal: 16,
// //     paddingVertical: 6,
// //     borderRadius: 16,
// //   },
// //   statusText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 6,
// //   },
// //   timeContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff8f0',
// //     marginHorizontal: 16,
// //     marginTop: 12,
// //     padding: 12,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#fce4d6',
// //   },
// //   timeLabel: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginLeft: 8,
// //     flex: 1,
// //   },
// //   timeValue: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#fc8019',
// //   },
// //   progressBarContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginHorizontal: 16,
// //     marginTop: 16,
// //   },
// //   progressBar: {
// //     flex: 1,
// //     height: 8,
// //     backgroundColor: '#f0f0f5',
// //     borderRadius: 4,
// //     overflow: 'hidden',
// //   },
// //   progressFill: {
// //     height: '100%',
// //     backgroundColor: '#fc8019',
// //     borderRadius: 4,
// //   },
// //   progressPercentage: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#fc8019',
// //     marginLeft: 12,
// //     minWidth: 40,
// //     textAlign: 'right',
// //   },
// //   stepsContainer: {
// //     backgroundColor: '#ffffff',
// //     margin: 16,
// //     padding: 20,
// //     borderRadius: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   stepItem: {
// //     flexDirection: 'row',
// //     marginBottom: 16,
// //   },
// //   stepIndicator: {
// //     alignItems: 'center',
// //     marginRight: 16,
// //     position: 'relative',
// //   },
// //   stepCircle: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     backgroundColor: '#f0f0f5',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     zIndex: 1,
// //   },
// //   stepCircleCompleted: {
// //     backgroundColor: '#28a745',
// //   },
// //   stepCircleActive: {
// //     backgroundColor: '#fc8019',
// //   },
// //   stepPulse: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //     backgroundColor: '#ffffff',
// //     borderWidth: 2,
// //     borderColor: '#fc8019',
// //   },
// //   stepDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     backgroundColor: '#d0d0d0',
// //   },
// //   stepLine: {
// //     position: 'absolute',
// //     top: 32,
// //     width: 2,
// //     height: 40,
// //     backgroundColor: '#e0e0e0',
// //   },
// //   stepLineCompleted: {
// //     backgroundColor: '#28a745',
// //   },
// //   stepContent: {
// //     flex: 1,
// //     justifyContent: 'center',
// //   },
// //   stepLabel: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //   },
// //   stepLabelCompleted: {
// //     color: '#28a745',
// //     fontWeight: '500',
// //   },
// //   stepLabelActive: {
// //     color: '#fc8019',
// //     fontWeight: '600',
// //   },
// //   stepSubtext: {
// //     fontSize: 11,
// //     color: '#fc8019',
// //     marginTop: 2,
// //   },
// //   stepSubtextCompleted: {
// //     fontSize: 11,
// //     color: '#28a745',
// //     marginTop: 2,
// //   },
// //   stepSubtextPending: {
// //     fontSize: 11,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   detailsCard: {
// //     backgroundColor: '#ffffff',
// //     marginHorizontal: 16,
// //     padding: 16,
// //     borderRadius: 12,
// //     marginTop: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   detailsTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },
// //   detailRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 6,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   detailLabel: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //   },
// //   detailValue: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     fontWeight: '500',
// //   },
// //   detailValueTotal: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: '#fc8019',
// //   },
// //   itemsCard: {
// //     backgroundColor: '#ffffff',
// //     marginHorizontal: 16,
// //     padding: 16,
// //     borderRadius: 12,
// //     marginTop: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   itemsTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },
// //   itemRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   itemInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   itemName: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //   },
// //   itemQuantity: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginLeft: 6,
// //   },
// //   itemPrice: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //   },
// //   bottomPadding: {
// //     height: 30,
// //   },
// //   // ✅ Success Page Styles
// //   successContainer: {
// //     backgroundColor: '#ffffff',
// //     margin: 16,
// //     padding: 24,
// //     borderRadius: 16,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   successIconContainer: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: '#e8f5e9',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   successTitle: {
// //     fontSize: 24,
// //     fontWeight: '700',
// //     color: '#282c3f',
// //     marginBottom: 8,
// //   },
// //   successSubtitle: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //   },
// //   successDetails: {
// //     width: '100%',
// //     backgroundColor: '#f8f9fa',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 20,
// //   },
// //   successRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 6,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e9ecef',
// //   },
// //   successLabel: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //   },
// //   successValue: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     fontWeight: '500',
// //   },
// //   successTotal: {
// //     color: '#fc8019',
// //     fontWeight: '700',
// //     fontSize: 16,
// //   },
// //   ratingContainer: {
// //     width: '100%',
// //     marginBottom: 16,
// //   },
// //   ratingTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //     textAlign: 'center',
// //   },
// //   starsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //   },
// //   starIcon: {
// //     marginHorizontal: 4,
// //   },
// //   ratingText: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     textAlign: 'center',
// //     marginTop: 8,
// //   },
// //   reviewContainer: {
// //     width: '100%',
// //     marginBottom: 20,
// //   },
// //   reviewInput: {
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //     borderRadius: 10,
// //     paddingHorizontal: 14,
// //     paddingVertical: 12,
// //     fontSize: 14,
// //     color: '#282c3f',
// //     backgroundColor: '#f8f9fa',
// //     minHeight: 80,
// //     textAlignVertical: 'top',
// //   },
// //   successButtons: {
// //     flexDirection: 'row',
// //     width: '100%',
// //     gap: 12,
// //     marginBottom: 12,
// //   },
// //   reorderButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: '#fc8019',
// //     backgroundColor: '#ffffff',
// //   },
// //   reorderButtonText: {
// //     color: '#fc8019',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 6,
// //   },
// //   homeButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     backgroundColor: '#fc8019',
// //   },
// //   homeButtonText: {
// //     color: '#ffffff',
// //     fontSize: 14,
// //     fontWeight: '600',
// //     marginLeft: 6,
// //   },
// //   submitReviewButton: {
// //     width: '100%',
// //     paddingVertical: 12,
// //     borderRadius: 10,
// //     backgroundColor: '#28a745',
// //     alignItems: 'center',
// //   },
// //   submitReviewButtonDisabled: {
// //     backgroundColor: '#6c757d',
// //   },
// //   submitReviewText: {
// //     color: '#ffffff',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// // });

// // export default OrderTrackingScreen;
// // delivery-app/src/screens/main/OrderTrackingScreen.tsx
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Animated,
//   TextInput,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { OrderContext } from '../../context/OrderContext';

// interface OrderTrackingScreenProps {
//   navigation: any;
//   route: any;
// }

// const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
//   const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
//   const { updateOrderStatus } = useContext(OrderContext);
  
//   const [orderStatus, setOrderStatus] = useState<string>('Placed');
//   const [progress, setProgress] = useState<number>(0);
//   const [estimatedTime, setEstimatedTime] = useState<string>('25-30 min');
//   const [rating, setRating] = useState<number>(0);
//   const [review, setReview] = useState<string>('');
//   const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
//   const [isDelivered, setIsDelivered] = useState<boolean>(false);
  
//   const [animatedValue] = useState(new Animated.Value(0));

//   const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
//   const currentStep = statusFlow.indexOf(orderStatus);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         const newProgress = prev + 0.5;
//         if (newProgress >= 100) {
//           clearInterval(interval);
          
//           // ✅ When progress reaches 100%, update order status to Delivered
//           if (!isDelivered && orderId) {
//             setIsDelivered(true);
//             // Update status to Delivered
//             updateOrderStatus(orderId, 'Delivered');
//             console.log('✅ Order marked as Delivered:', orderId);
            
//             // Show alert to user
//             Alert.alert(
//               '🎉 Order Delivered!',
//               'Your order has been delivered successfully.',
//               [{ text: 'OK' }]
//             );
//           }
          
//           return 100;
//         }
//         return newProgress;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [orderId, isDelivered]);

//   useEffect(() => {
//     Animated.timing(animatedValue, {
//       toValue: progress,
//       duration: 1000,
//       useNativeDriver: false,
//     }).start();

//     if (progress < 20) {
//       setOrderStatus('Placed');
//       setEstimatedTime('25-30 min');
//     } else if (progress < 40) {
//       setOrderStatus('Preparing');
//       setEstimatedTime('20-25 min');
//     } else if (progress < 60) {
//       setOrderStatus('Ready');
//       setEstimatedTime('15-20 min');
//     } else if (progress < 80) {
//       setOrderStatus('On the way');
//       setEstimatedTime('5-10 min');
//     } else if (progress >= 80) {
//       setOrderStatus('Delivered');
//       setEstimatedTime('Delivered! 🎉');
//     }
//   }, [progress]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Placed': return '#ffc107';
//       case 'Preparing': return '#17a2b8';
//       case 'Ready': return '#28a745';
//       case 'On the way': return '#fc8019';
//       case 'Delivered': return '#28a745';
//       default: return '#7e808c';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Placed': return 'time-outline';
//       case 'Preparing': return 'restaurant-outline';
//       case 'Ready': return 'checkmark-circle-outline';
//       case 'On the way': return 'bicycle-outline';
//       case 'Delivered': return 'checkmark-done-circle-outline';
//       default: return 'ellipse-outline';
//     }
//   };

//   const getStatusEmoji = (status: string) => {
//     switch (status) {
//       case 'Placed': return '📋';
//       case 'Preparing': return '⏳';
//       case 'Ready': return '✅';
//       case 'On the way': return '🚴';
//       case 'Delivered': return '🎉';
//       default: return '📦';
//     }
//   };

//   const getStatusMessage = (status: string) => {
//     switch (status) {
//       case 'Placed': return 'Your order has been placed and confirmed';
//       case 'Preparing': return 'Your order is being prepared';
//       case 'Ready': return 'Your order is ready for delivery';
//       case 'On the way': return 'Your delivery partner is on the way!';
//       case 'Delivered': return '🎉 Your order has been delivered successfully!';
//       default: return 'Processing your order';
//     }
//   };

//   const getStepStatus = (step: string) => {
//     const stepIndex = statusFlow.indexOf(step);
//     if (stepIndex < currentStep) return 'completed';
//     if (stepIndex === currentStep) return 'active';
//     return 'pending';
//   };

//   // ✅ Handle Reorder
//   const handleReorder = () => {
//     Alert.alert(
//       '🔄 Reorder',
//       `Add items to cart?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Add to Cart', 
//           onPress: () => {
//             navigation.navigate('Cart');
//           }
//         },
//       ]
//     );
//   };

//   // ✅ Handle Submit Review
//   const handleSubmitReview = () => {
//     if (rating === 0) {
//       Alert.alert('⭐ Rating Required', 'Please tap a star to rate your order.');
//       return;
//     }

//     setReviewSubmitted(true);
//     Alert.alert(
//       '✅ Thank You!',
//       `Your review has been submitted!\n\nRating: ${rating} ★\nReview: ${review || 'No review provided'}`,
//       [
//         { 
//           text: 'OK', 
//           onPress: () => {
//             navigation.navigate('Orders');
//           }
//         }
//       ]
//     );
//   };

//   // ✅ Handle Home Navigation
//   const handleGoHome = () => {
//     navigation.navigate('Home');
//   };

//   const progressWidth = animatedValue.interpolate({
//     inputRange: [0, 100],
//     outputRange: ['0%', '100%'],
//   });

//   // ✅ If delivered, show success page
//   if (orderStatus === 'Delivered') {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="#282c3f" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Order Tracking</Text>
//           <View style={{ width: 40 }} />
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={styles.successContainer}>
//             <View style={styles.successIconContainer}>
//               <Icon name="checkmark-circle" size={80} color="#28a745" />
//             </View>
//             <Text style={styles.successTitle}>🎉 Order Delivered!</Text>
//             <Text style={styles.successSubtitle}>Your order has been delivered successfully</Text>
            
//             <View style={styles.successDetails}>
//               <View style={styles.successRow}>
//                 <Text style={styles.successLabel}>Order ID</Text>
//                 <Text style={styles.successValue}>{orderId}</Text>
//               </View>
//               <View style={styles.successRow}>
//                 <Text style={styles.successLabel}>Delivered</Text>
//                 <Text style={styles.successValue}>{new Date().toLocaleTimeString()}</Text>
//               </View>
//               <View style={styles.successRow}>
//                 <Text style={styles.successLabel}>Total Amount</Text>
//                 <Text style={[styles.successValue, styles.successTotal]}>₹{total}</Text>
//               </View>
//             </View>

//             {/* ⭐ Rating Stars */}
//             <View style={styles.ratingContainer}>
//               <Text style={styles.ratingTitle}>Rate your order</Text>
//               <View style={styles.starsContainer}>
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <TouchableOpacity key={star} onPress={() => setRating(star)}>
//                     <Icon
//                       name={star <= rating ? 'star' : 'star-outline'}
//                       size={36}
//                       color={star <= rating ? '#ffc107' : '#d0d0d0'}
//                       style={styles.starIcon}
//                     />
//                   </TouchableOpacity>
//                 ))}
//               </View>
//               <Text style={styles.ratingText}>
//                 {rating > 0 ? `${rating} stars` : 'Tap a star to rate'}
//               </Text>
//             </View>

//             {/* ✍️ Review Input */}
//             <View style={styles.reviewContainer}>
//               <TextInput
//                 style={styles.reviewInput}
//                 placeholder="Write a review..."
//                 value={review}
//                 onChangeText={setReview}
//                 multiline
//                 numberOfLines={3}
//                 editable={!reviewSubmitted}
//               />
//             </View>

//             {/* Buttons */}
//             <View style={styles.successButtons}>
//               <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
//                 <Icon name="refresh-outline" size={20} color="#fc8019" />
//                 <Text style={styles.reorderButtonText}>Reorder</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
//                 <Icon name="home-outline" size={20} color="#ffffff" />
//                 <Text style={styles.homeButtonText}>Home</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity 
//               style={[styles.submitReviewButton, reviewSubmitted && styles.submitReviewButtonDisabled]} 
//               onPress={handleSubmitReview}
//               disabled={reviewSubmitted}
//             >
//               <Text style={styles.submitReviewText}>
//                 {reviewSubmitted ? '✅ Review Submitted' : 'Submit Review'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.bottomPadding} />
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   // ✅ Before delivery - show tracking
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#282c3f" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Order Tracking</Text>
//         <TouchableOpacity style={styles.helpButton}>
//           <Icon name="help-circle-outline" size={24} color="#fc8019" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Restaurant Info */}
//         <View style={styles.restaurantContainer}>
//           <View style={styles.restaurantHeader}>
//             <View style={styles.restaurantIcon}>
//               <Text style={styles.restaurantIconText}>
//                 {restaurantName?.charAt(0) || 'Q'}
//               </Text>
//             </View>
//             <View style={styles.restaurantInfo}>
//               <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
//               <Text style={styles.orderTime}>
//                 Order placed at {new Date().toLocaleTimeString()}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.orderIdBadge}>
//             <Text style={styles.orderIdText}>#{orderId || 'ORD-123456'}</Text>
//           </View>
//         </View>

//         {/* Status */}
//         <View style={styles.progressContainer}>
//           <View style={styles.statusHeader}>
//             <Text style={styles.statusEmoji}>{getStatusEmoji(orderStatus)}</Text>
//             <Text style={styles.statusTitle}>{orderStatus}</Text>
//           </View>
//           <Text style={styles.statusMessage}>{getStatusMessage(orderStatus)}</Text>
          
//           <View style={styles.statusBadge}>
//             <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
//             <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
//               {orderStatus}
//             </Text>
//           </View>
//         </View>

//         {/* Estimated Time */}
//         <View style={styles.timeContainer}>
//           <Icon name="time-outline" size={20} color="#fc8019" />
//           <Text style={styles.timeLabel}>Estimated Delivery Time</Text>
//           <Text style={styles.timeValue}>{estimatedTime}</Text>
//         </View>

//         {/* Progress Bar */}
//         <View style={styles.progressBarContainer}>
//           <View style={styles.progressBar}>
//             <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
//           </View>
//           <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
//         </View>

//         {/* Steps */}
//         <View style={styles.stepsContainer}>
//           {statusFlow.map((step, index) => {
//             const status = getStepStatus(step);
//             const isCompleted = status === 'completed';
//             const isActive = status === 'active';
            
//             return (
//               <View key={index} style={styles.stepItem}>
//                 <View style={styles.stepIndicator}>
//                   <View style={[
//                     styles.stepCircle,
//                     isCompleted && styles.stepCircleCompleted,
//                     isActive && styles.stepCircleActive,
//                   ]}>
//                     {isCompleted ? (
//                       <Icon name="checkmark" size={16} color="#ffffff" />
//                     ) : isActive ? (
//                       <View style={styles.stepPulse} />
//                     ) : (
//                       <View style={styles.stepDot} />
//                     )}
//                   </View>
//                   {index < statusFlow.length - 1 && (
//                     <View style={[
//                       styles.stepLine,
//                       isCompleted && styles.stepLineCompleted,
//                     ]} />
//                   )}
//                 </View>
//                 <View style={styles.stepContent}>
//                   <Text style={[
//                     styles.stepLabel,
//                     isCompleted && styles.stepLabelCompleted,
//                     isActive && styles.stepLabelActive,
//                   ]}>
//                     {step}
//                   </Text>
//                   {isActive && (
//                     <Text style={styles.stepSubtext}>In progress</Text>
//                   )}
//                   {isCompleted && (
//                     <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
//                   )}
//                   {!isCompleted && !isActive && (
//                     <Text style={styles.stepSubtextPending}>Pending</Text>
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>

//         {/* Order Details */}
//         <View style={styles.detailsCard}>
//           <Text style={styles.detailsTitle}>Order Details</Text>
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Payment Method</Text>
//             <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Payment Status</Text>
//             <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
//               {paymentStatus || 'Pending'}
//             </Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Total Amount</Text>
//             <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Items</Text>
//             <Text style={styles.detailValue}>{items?.length || 0} items</Text>
//           </View>
//         </View>

//         {/* Items */}
//         {items && items.length > 0 && (
//           <View style={styles.itemsCard}>
//             <Text style={styles.itemsTitle}>Items</Text>
//             {items.map((item: any, index: number) => (
//               <View key={index} style={styles.itemRow}>
//                 <View style={styles.itemInfo}>
//                   <Text style={styles.itemName}>{item.name}</Text>
//                   <Text style={styles.itemQuantity}>× {item.quantity}</Text>
//                 </View>
//                 <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         <View style={styles.bottomPadding} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//     textAlign: 'center',
//   },
//   helpButton: {
//     padding: 4,
//   },
//   restaurantContainer: {
//     backgroundColor: '#ffffff',
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   restaurantHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   restaurantIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#fc8019',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   restaurantIconText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#ffffff',
//   },
//   restaurantInfo: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   restaurantName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   orderTime: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   orderIdBadge: {
//     backgroundColor: '#f0f0f5',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   orderIdText: {
//     fontSize: 12,
//     color: '#7e808c',
//     fontWeight: '500',
//   },
//   progressContainer: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     padding: 20,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   statusHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statusEmoji: {
//     fontSize: 28,
//     marginRight: 12,
//   },
//   statusTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#282c3f',
//   },
//   statusMessage: {
//     fontSize: 14,
//     color: '#7e808c',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f5',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff8f0',
//     marginHorizontal: 16,
//     marginTop: 12,
//     padding: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#fce4d6',
//   },
//   timeLabel: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginLeft: 8,
//     flex: 1,
//   },
//   timeValue: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fc8019',
//   },
//   progressBarContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 16,
//     marginTop: 16,
//   },
//   progressBar: {
//     flex: 1,
//     height: 8,
//     backgroundColor: '#f0f0f5',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#fc8019',
//     borderRadius: 4,
//   },
//   progressPercentage: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#fc8019',
//     marginLeft: 12,
//     minWidth: 40,
//     textAlign: 'right',
//   },
//   stepsContainer: {
//     backgroundColor: '#ffffff',
//     margin: 16,
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   stepItem: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   stepIndicator: {
//     alignItems: 'center',
//     marginRight: 16,
//     position: 'relative',
//   },
//   stepCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#f0f0f5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   stepCircleCompleted: {
//     backgroundColor: '#28a745',
//   },
//   stepCircleActive: {
//     backgroundColor: '#fc8019',
//   },
//   stepPulse: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#ffffff',
//     borderWidth: 2,
//     borderColor: '#fc8019',
//   },
//   stepDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#d0d0d0',
//   },
//   stepLine: {
//     position: 'absolute',
//     top: 32,
//     width: 2,
//     height: 40,
//     backgroundColor: '#e0e0e0',
//   },
//   stepLineCompleted: {
//     backgroundColor: '#28a745',
//   },
//   stepContent: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   stepLabel: {
//     fontSize: 14,
//     color: '#7e808c',
//   },
//   stepLabelCompleted: {
//     color: '#28a745',
//     fontWeight: '500',
//   },
//   stepLabelActive: {
//     color: '#fc8019',
//     fontWeight: '600',
//   },
//   stepSubtext: {
//     fontSize: 11,
//     color: '#fc8019',
//     marginTop: 2,
//   },
//   stepSubtextCompleted: {
//     fontSize: 11,
//     color: '#28a745',
//     marginTop: 2,
//   },
//   stepSubtextPending: {
//     fontSize: 11,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   detailsCard: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   detailsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#7e808c',
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#282c3f',
//     fontWeight: '500',
//   },
//   detailValueTotal: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fc8019',
//   },
//   itemsCard: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     padding: 16,
//     borderRadius: 12,
//     marginTop: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   itemsTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },
//   itemRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   itemInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   itemName: {
//     fontSize: 14,
//     color: '#282c3f',
//   },
//   itemQuantity: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginLeft: 6,
//   },
//   itemPrice: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#282c3f',
//   },
//   bottomPadding: {
//     height: 30,
//   },
//   // ✅ Success Page Styles
//   successContainer: {
//     backgroundColor: '#ffffff',
//     margin: 16,
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
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
//     fontWeight: '700',
//     color: '#282c3f',
//     marginBottom: 8,
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
//     color: '#fc8019',
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   ratingContainer: {
//     width: '100%',
//     marginBottom: 16,
//   },
//   ratingTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   starsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   starIcon: {
//     marginHorizontal: 4,
//   },
//   ratingText: {
//     fontSize: 14,
//     color: '#7e808c',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   reviewContainer: {
//     width: '100%',
//     marginBottom: 20,
//   },
//   reviewInput: {
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: '#282c3f',
//     backgroundColor: '#f8f9fa',
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   successButtons: {
//     flexDirection: 'row',
//     width: '100%',
//     gap: 12,
//     marginBottom: 12,
//   },
//   reorderButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#fc8019',
//     backgroundColor: '#ffffff',
//   },
//   reorderButtonText: {
//     color: '#fc8019',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   homeButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 10,
//     backgroundColor: '#fc8019',
//   },
//   homeButtonText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 6,
//   },
//   submitReviewButton: {
//     width: '100%',
//     paddingVertical: 12,
//     borderRadius: 10,
//     backgroundColor: '#28a745',
//     alignItems: 'center',
//   },
//   submitReviewButtonDisabled: {
//     backgroundColor: '#6c757d',
//   },
//   submitReviewText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });

// export default OrderTrackingScreen;
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  TextInput,
  Alert,
  AppState,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { OrderContext } from '../../context/OrderContext';

interface OrderTrackingScreenProps {
  navigation: any;
  route: any;
}

const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
  const { orderId, total, items, restaurantName, paymentMethod, paymentStatus } = route.params || {};
  const { updateOrderStatus, getOrderById } = useContext(OrderContext);
  
  // Get the order from context to check its actual status
  const currentOrder = getOrderById(orderId);
  
  const [orderStatus, setOrderStatus] = useState<string>(currentOrder?.status || 'Placed');
  const [progress, setProgress] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>('25-30 min');
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [isDelivered, setIsDelivered] = useState<boolean>(currentOrder?.status === 'Delivered');
  
  const [animatedValue] = useState(new Animated.Value(0));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const statusFlow = ['Placed', 'Preparing', 'Ready', 'On the way', 'Delivered'];
  const currentStep = statusFlow.indexOf(orderStatus);

  // Check if order is already delivered when component mounts
  useEffect(() => {
    if (currentOrder?.status === 'Delivered') {
      setIsDelivered(true);
      setOrderStatus('Delivered');
      setProgress(100);
      setEstimatedTime('Delivered! 🎉');
    }
  }, [currentOrder]);

  // Handle progress simulation
  useEffect(() => {
    // Don't start progress if already delivered
    if (isDelivered || orderStatus === 'Delivered') {
      setProgress(100);
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start progress simulation
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          
          // ✅ When progress reaches 100%, update order status to Delivered
          if (!isDelivered && orderId) {
            setIsDelivered(true);
            setOrderStatus('Delivered');
            
            // Update status in context
            updateOrderStatus(orderId, 'Delivered');
            console.log('✅ Order marked as Delivered:', orderId);
            
            // Show alert to user
            Alert.alert(
              '🎉 Order Delivered!',
              'Your order has been delivered successfully.',
              [{ text: 'OK' }]
            );
          }
          
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orderId, isDelivered]);

  // Update status based on progress
  useEffect(() => {
    if (isDelivered || orderStatus === 'Delivered') {
      setOrderStatus('Delivered');
      setEstimatedTime('Delivered! 🎉');
      return;
    }

    if (progress < 20) {
      setOrderStatus('Placed');
      setEstimatedTime('25-30 min');
    } else if (progress < 40) {
      setOrderStatus('Preparing');
      setEstimatedTime('20-25 min');
    } else if (progress < 60) {
      setOrderStatus('Ready');
      setEstimatedTime('15-20 min');
    } else if (progress < 80) {
      setOrderStatus('On the way');
      setEstimatedTime('5-10 min');
    } else if (progress >= 80 && progress < 100) {
      setOrderStatus('On the way');
      setEstimatedTime('Almost there! 🚴');
    }
  }, [progress, isDelivered, orderStatus]);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Handle AppState changes to prevent progress issues
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current === 'background' && nextAppState === 'active') {
        // App came to foreground - check if order is already delivered
        if (orderId) {
          const updatedOrder = getOrderById(orderId);
          if (updatedOrder?.status === 'Delivered' && !isDelivered) {
            setIsDelivered(true);
            setOrderStatus('Delivered');
            setProgress(100);
            setEstimatedTime('Delivered! 🎉');
          }
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [orderId, isDelivered, getOrderById]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed': return '#ffc107';
      case 'Preparing': return '#17a2b8';
      case 'Ready': return '#28a745';
      case 'On the way': return '#fc8019';
      case 'Delivered': return '#28a745';
      default: return '#7e808c';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Placed': return 'time-outline';
      case 'Preparing': return 'restaurant-outline';
      case 'Ready': return 'checkmark-circle-outline';
      case 'On the way': return 'bicycle-outline';
      case 'Delivered': return 'checkmark-done-circle-outline';
      default: return 'ellipse-outline';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'Placed': return '📋';
      case 'Preparing': return '⏳';
      case 'Ready': return '✅';
      case 'On the way': return '🚴';
      case 'Delivered': return '🎉';
      default: return '📦';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'Placed': return 'Your order has been placed and confirmed';
      case 'Preparing': return 'Your order is being prepared';
      case 'Ready': return 'Your order is ready for delivery';
      case 'On the way': return 'Your delivery partner is on the way!';
      case 'Delivered': return '🎉 Your order has been delivered successfully!';
      default: return 'Processing your order';
    }
  };

  const getStepStatus = (step: string) => {
    const stepIndex = statusFlow.indexOf(step);
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  // ✅ Handle Reorder
  const handleReorder = () => {
    Alert.alert(
      '🔄 Reorder',
      'Add items to cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add to Cart', 
          onPress: () => {
            navigation.navigate('Cart');
          }
        },
      ]
    );
  };

  // ✅ Handle Submit Review
  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('⭐ Rating Required', 'Please tap a star to rate your order.');
      return;
    }

    setReviewSubmitted(true);
    Alert.alert(
      '✅ Thank You!',
      `Your review has been submitted!\n\nRating: ${rating} ★\nReview: ${review || 'No review provided'}`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.navigate('Orders');
          }
        }
      ]
    );
  };

  // ✅ Handle Home Navigation
  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // ✅ If delivered, show success page
  if (orderStatus === 'Delivered' || isDelivered) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#282c3f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <Icon name="checkmark-circle" size={80} color="#28a745" />
            </View>
            <Text style={styles.successTitle}>🎉 Order Delivered!</Text>
            <Text style={styles.successSubtitle}>Your order has been delivered successfully</Text>
            
            <View style={styles.successDetails}>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Order ID</Text>
                <Text style={styles.successValue}>{orderId}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Delivered</Text>
                <Text style={styles.successValue}>{new Date().toLocaleTimeString()}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={styles.successLabel}>Total Amount</Text>
                <Text style={[styles.successValue, styles.successTotal]}>₹{total}</Text>
              </View>
            </View>

            {/* ⭐ Rating Stars */}
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingTitle}>Rate your order</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Icon
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={36}
                      color={star <= rating ? '#ffc107' : '#d0d0d0'}
                      style={styles.starIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {rating > 0 ? `${rating} stars` : 'Tap a star to rate'}
              </Text>
            </View>

            {/* ✍️ Review Input */}
            <View style={styles.reviewContainer}>
              <TextInput
                style={styles.reviewInput}
                placeholder="Write a review..."
                value={review}
                onChangeText={setReview}
                multiline
                numberOfLines={3}
                editable={!reviewSubmitted}
              />
            </View>

            {/* Buttons */}
            <View style={styles.successButtons}>
              <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
                <Icon name="refresh-outline" size={20} color="#fc8019" />
                <Text style={styles.reorderButtonText}>Reorder</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
                <Icon name="home-outline" size={20} color="#ffffff" />
                <Text style={styles.homeButtonText}>Home</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.submitReviewButton, reviewSubmitted && styles.submitReviewButtonDisabled]} 
              onPress={handleSubmitReview}
              disabled={reviewSubmitted}
            >
              <Text style={styles.submitReviewText}>
                {reviewSubmitted ? '✅ Review Submitted' : 'Submit Review'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ✅ Before delivery - show tracking
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Icon name="help-circle-outline" size={24} color="#fc8019" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantContainer}>
          <View style={styles.restaurantHeader}>
            <View style={styles.restaurantIcon}>
              <Text style={styles.restaurantIconText}>
                {restaurantName?.charAt(0) || 'Q'}
              </Text>
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{restaurantName || 'QuickBite'}</Text>
              <Text style={styles.orderTime}>
                Order placed at {new Date().toLocaleTimeString()}
              </Text>
            </View>
          </View>
          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdText}>#{orderId || 'ORD-123456'}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.progressContainer}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusEmoji}>{getStatusEmoji(orderStatus)}</Text>
            <Text style={styles.statusTitle}>{orderStatus}</Text>
          </View>
          <Text style={styles.statusMessage}>{getStatusMessage(orderStatus)}</Text>
          
          <View style={styles.statusBadge}>
            <Icon name={getStatusIcon(orderStatus)} size={20} color={getStatusColor(orderStatus)} />
            <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
              {orderStatus}
            </Text>
          </View>
        </View>

        {/* Estimated Time */}
        <View style={styles.timeContainer}>
          <Icon name="time-outline" size={20} color="#fc8019" />
          <Text style={styles.timeLabel}>Estimated Delivery Time</Text>
          <Text style={styles.timeValue}>{estimatedTime}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {statusFlow.map((step, index) => {
            const status = getStepStatus(step);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';
            
            return (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepIndicator}>
                  <View style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCircleCompleted,
                    isActive && styles.stepCircleActive,
                  ]}>
                    {isCompleted ? (
                      <Icon name="checkmark" size={16} color="#ffffff" />
                    ) : isActive ? (
                      <View style={styles.stepPulse} />
                    ) : (
                      <View style={styles.stepDot} />
                    )}
                  </View>
                  {index < statusFlow.length - 1 && (
                    <View style={[
                      styles.stepLine,
                      isCompleted && styles.stepLineCompleted,
                    ]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[
                    styles.stepLabel,
                    isCompleted && styles.stepLabelCompleted,
                    isActive && styles.stepLabelActive,
                  ]}>
                    {step}
                  </Text>
                  {isActive && (
                    <Text style={styles.stepSubtext}>In progress</Text>
                  )}
                  {isCompleted && (
                    <Text style={styles.stepSubtextCompleted}>✓ Done</Text>
                  )}
                  {!isCompleted && !isActive && (
                    <Text style={styles.stepSubtextPending}>Pending</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Order Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{paymentMethod || 'Cash on Delivery'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Status</Text>
            <Text style={[styles.detailValue, { color: paymentStatus === 'Paid' ? '#28a745' : '#ffc107' }]}>
              {paymentStatus || 'Pending'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValueTotal}>₹{total || 0}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Items</Text>
            <Text style={styles.detailValue}>{items?.length || 0} items</Text>
          </View>
        </View>

        {/* Items */}
        {items && items.length > 0 && (
          <View style={styles.itemsCard}>
            <Text style={styles.itemsTitle}>Items</Text>
            {items.map((item: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>× {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain the same as your original...
const styles = StyleSheet.create({
  // ... (keep all your existing styles)
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
    textAlign: 'center',
  },
  helpButton: {
    padding: 4,
  },
  restaurantContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  restaurantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fc8019',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  restaurantInfo: {
    marginLeft: 12,
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
  },
  orderTime: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 2,
  },
  orderIdBadge: {
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderIdText: {
    fontSize: 12,
    color: '#7e808c',
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#282c3f',
  },
  statusMessage: {
    fontSize: 14,
    color: '#7e808c',
    textAlign: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f0',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fce4d6',
  },
  timeLabel: {
    fontSize: 14,
    color: '#7e808c',
    marginLeft: 8,
    flex: 1,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fc8019',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fc8019',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fc8019',
    marginLeft: 12,
    minWidth: 40,
    textAlign: 'right',
  },
  stepsContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircleCompleted: {
    backgroundColor: '#28a745',
  },
  stepCircleActive: {
    backgroundColor: '#fc8019',
  },
  stepPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#fc8019',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d0d0d0',
  },
  stepLine: {
    position: 'absolute',
    top: 32,
    width: 2,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  stepLineCompleted: {
    backgroundColor: '#28a745',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 14,
    color: '#7e808c',
  },
  stepLabelCompleted: {
    color: '#28a745',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#fc8019',
    fontWeight: '600',
  },
  stepSubtext: {
    fontSize: 11,
    color: '#fc8019',
    marginTop: 2,
  },
  stepSubtextCompleted: {
    fontSize: 11,
    color: '#28a745',
    marginTop: 2,
  },
  stepSubtextPending: {
    fontSize: 11,
    color: '#7e808c',
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7e808c',
  },
  detailValue: {
    fontSize: 14,
    color: '#282c3f',
    fontWeight: '500',
  },
  detailValueTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fc8019',
  },
  itemsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    color: '#282c3f',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#7e808c',
    marginLeft: 6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282c3f',
  },
  bottomPadding: {
    height: 30,
  },
  successContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontWeight: '700',
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
  ratingContainer: {
    width: '100%',
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 12,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starIcon: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#7e808c',
    textAlign: 'center',
    marginTop: 8,
  },
  reviewContainer: {
    width: '100%',
    marginBottom: 20,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#282c3f',
    backgroundColor: '#f8f9fa',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  successButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 12,
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fc8019',
    backgroundColor: '#ffffff',
  },
  reorderButtonText: {
    color: '#fc8019',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#fc8019',
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  submitReviewButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#28a745',
    alignItems: 'center',
  },
  submitReviewButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitReviewText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderTrackingScreen;