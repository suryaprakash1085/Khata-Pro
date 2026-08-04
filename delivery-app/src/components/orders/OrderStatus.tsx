import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { Order } from '../../types';

interface OrderStatusProps {
  status: Order['status'];
}

// export default function OrderStatus({ status }: OrderStatusProps): JSX.Element {
export default function OrderStatus({ status }: OrderStatusProps) {
  const steps: { id: string; label: string; icon: string }[] = [
    { id: 'placed', label: 'Order Placed', icon: 'checkmark-circle' },
    { id: 'preparing', label: 'Preparing', icon: 'restaurant' },
    { id: 'ready', label: 'Ready', icon: 'checkmark-circle' },
    { id: 'on_way', label: 'On the Way', icon: 'bicycle' },
    { id: 'delivered', label: 'Delivered', icon: 'checkmark-done-circle' },
  ];

  const getStepStatus = (stepId: string): 'completed' | 'active' | 'pending' => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === status.toLowerCase().replace(/ /g, '_'));
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.id);
        const isCompleted = stepStatus === 'completed';
        const isActive = stepStatus === 'active';
        const isLast = index === steps.length - 1;

        return (
          <View key={step.id} style={styles.stepContainer}>
            <View style={styles.stepLeft}>
              <View style={[
                styles.stepCircle,
                isCompleted && styles.completedCircle,
                isActive && styles.activeCircle,
              ]}>
                <Icon 
                  name={isCompleted || isActive ? 'checkmark' : 'time'} 
                  size={16} 
                  color={isCompleted || isActive ? colors.white : colors.gray} 
                />
              </View>
              {!isLast && (
                <View style={[
                  styles.stepLine,
                  isCompleted && styles.completedLine,
                ]} />
              )}
            </View>
            <View style={styles.stepRight}>
              <Text style={[
                styles.stepLabel,
                (isCompleted || isActive) && styles.activeLabel,
              ]}>
                {step.label}
              </Text>
              {isActive && (
                <Text style={styles.stepStatus}>In Progress</Text>
              )}
              {isCompleted && (
                <Text style={styles.stepStatusCompleted}>Completed</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepLeft: {
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
    zIndex: 1,
  },
  completedCircle: {
    backgroundColor: colors.success,
  },
  activeCircle: {
    backgroundColor: colors.primary,
  },
  stepLine: {
    width: 2,
    height: 30,
    backgroundColor: colors.lightGray,
  },
  completedLine: {
    backgroundColor: colors.success,
  },
  stepRight: {
    flex: 1,
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeLabel: {
    color: colors.text,
    fontWeight: '500',
  },
  stepStatus: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  stepStatusCompleted: {
    fontSize: 12,
    color: colors.success,
    marginTop: 2,
  },
});