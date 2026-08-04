import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { Order } from '../../types';

export default function OrderTrackingScreen({ navigation, route }: any) {
  const { orderId } = route.params || {};
  const [orderStatus, setOrderStatus] = useState<Order['status']>('Preparing');
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      if (elapsedTime === 60) setOrderStatus('Preparing');
      else if (elapsedTime === 120) setOrderStatus('Ready');
      else if (elapsedTime === 180) setOrderStatus('On the way');
      else if (elapsedTime === 240) setOrderStatus('Delivered');
    }, 1000);

    return () => clearInterval(timer);
  }, [elapsedTime]);

  const getStatusDetails = (): { icon: string; label: string; progress: number } => {
    switch (orderStatus) {
      case 'Preparing':
        return { icon: 'restaurant-outline', label: 'Preparing your order', progress: 25 };
      case 'Ready':
        return { icon: 'checkmark-circle-outline', label: 'Order is ready', progress: 50 };
      case 'On the way':
        return { icon: 'bicycle-outline', label: 'On the way', progress: 75 };
      case 'Delivered':
        return { icon: 'checkmark-done-circle-outline', label: 'Delivered', progress: 100 };
      default:
        return { icon: 'time-outline', label: 'Order placed', progress: 10 };
    }
  };

  const statusDetails = getStatusDetails();

  const steps: { id: string; label: string }[] = [
    { id: 'placed', label: 'Order Placed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'on_way', label: 'On the Way' },
    { id: 'delivered', label: 'Delivered' },
  ];

  const getStepStatus = (stepId: string): 'completed' | 'active' | 'pending' => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === orderStatus.toLowerCase().replace(/ /g, '_'));
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Order #{orderId || '156680718886280'}</Text>
          <Text style={styles.orderTime}>06:26 PM • 12 items • ₹654</Text>
          <View style={styles.statusContainer}>
            <Icon name={statusDetails.icon} size={24} color={colors.primary} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>{statusDetails.label}</Text>
              <Text style={styles.statusSublabel}>
                {orderStatus === 'Delivered' ? 'Enjoy your meal!' : 'Your order is being prepared'}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${statusDetails.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{statusDetails.progress}% complete</Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const isCompleted = stepStatus === 'completed';
            const isActive = stepStatus === 'active';

            return (
              <View key={step.id} style={styles.step}>
                <View style={styles.stepIconContainer}>
                  <View style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCompleted,
                    isActive && styles.stepActive,
                  ]}>
                    {isCompleted || isActive ? (
                      <Icon name="checkmark" size={16} color={colors.white} />
                    ) : (
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                    )}
                  </View>
                  {index < steps.length - 1 && (
                    <View style={[
                      styles.stepLine,
                      isCompleted && styles.stepLineCompleted,
                    ]} />
                  )}
                </View>
                <Text style={[
                  styles.stepLabel,
                  (isCompleted || isActive) && styles.stepLabelActive,
                ]}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryHeader}>
            <Icon name="person-outline" size={20} color={colors.text} />
            <Text style={styles.deliveryTitle}>Delivery Partner</Text>
          </View>
          <View style={styles.deliveryDetails}>
            <Text style={styles.deliveryName}>Mohd Ahmed</Text>
            <Text style={styles.deliveryStatus}>On the way to deliver your order</Text>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="call-outline" size={20} color={colors.primary} />
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressContainer}>
          <View style={styles.addressHeader}>
            <Icon name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.addressTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>
            Home - A-7, Sushil Apartment, Ramdas Colony, Nashik, Maharashtra 422005
          </Text>
        </View>

        {/* Cancel Order */}
        {orderStatus !== 'Delivered' && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  orderInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderTime: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusTextContainer: {
    marginLeft: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  statusSublabel: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
  stepsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: colors.success,
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  stepLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.lightGray,
    marginVertical: 4,
  },
  stepLineCompleted: {
    backgroundColor: colors.success,
  },
  stepLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  stepLabelActive: {
    color: colors.text,
    fontWeight: '500',
  },
  deliveryInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  deliveryDetails: {
    marginLeft: 28,
  },
  deliveryName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  deliveryStatus: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 2,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: colors.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  addressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 28,
  },
  cancelButton: {
    margin: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '500',
  },
});