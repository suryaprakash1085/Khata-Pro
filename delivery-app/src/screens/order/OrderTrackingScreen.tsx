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