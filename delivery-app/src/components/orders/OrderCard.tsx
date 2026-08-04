// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { Order } from '../../types';

// interface OrderCardProps {
//   order: Order;
//   onPress?: () => void;
//   onReorder?: () => void;
// }

// // export default function OrderCard({ order, onPress, onReorder }: OrderCardProps): JSX.Element {
// export default function OrderCard({ order, onPress, onReorder }: OrderCardProps) {
//   const getStatusColor = (status: Order['status']): string => {
//     switch (status) {
//       case 'Delivered': return colors.success;
//       case 'On the way': return colors.info;
//       case 'Preparing': return colors.warning;
//       case 'Cancelled': return colors.danger;
//       default: return colors.gray;
//     }
//   };

//   const getStatusIcon = (status: Order['status']): string => {
//     switch (status) {
//       case 'Delivered': return 'checkmark-circle';
//       case 'On the way': return 'bicycle';
//       case 'Preparing': return 'time';
//       case 'Cancelled': return 'close-circle';
//       default: return 'time';
//     }
//   };

//   const formatDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', { 
//       day: 'numeric', 
//       month: 'short', 
//       year: 'numeric' 
//     });
//   };

//   const formatTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-IN', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   return (
//     <TouchableOpacity style={styles.container} onPress={onPress}>
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.restaurant}>{order.restaurantName}</Text>
//           <Text style={styles.details}>
//             {order.items.length} items • ₹{order.total}
//           </Text>
//         </View>
//         <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
//           <Icon name={getStatusIcon(order.status)} size={14} color={getStatusColor(order.status)} />
//           <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
//             {order.status}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.footer}>
//         <Text style={styles.time}>
//           {formatTime(order.createdAt)} • {formatDate(order.createdAt)}
//         </Text>
//         <TouchableOpacity style={styles.reorderButton} onPress={onReorder}>
//           <Text style={styles.reorderText}>Reorder</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   restaurant: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//   },
//   details: {
//     fontSize: 13,
//     color: colors.textLight,
//     marginTop: 4,
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '500',
//     marginLeft: 4,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   time: {
//     fontSize: 12,
//     color: colors.textLight,
//   },
//   reorderButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   reorderText: {
//     color: colors.white,
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { Order } from '../../types';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onReorder?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, onReorder }) => {
  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'Delivered': return colors.success;
      case 'On the way': return colors.info;
      case 'Preparing': return colors.warning;
      case 'Cancelled': return colors.danger;
      default: return colors.gray;
    }
  };

  const getStatusIcon = (status: Order['status']): string => {
    switch (status) {
      case 'Delivered': return 'checkmark-circle';
      case 'On the way': return 'bicycle';
      case 'Preparing': return 'time';
      case 'Cancelled': return 'close-circle';
      default: return 'time';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.restaurant}>{order.restaurantName}</Text>
          <Text style={styles.details}>
            {order.items.length} items • ₹{order.total}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Icon name={getStatusIcon(order.status)} size={14} color={getStatusColor(order.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {order.status}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.time}>
          {formatTime(order.createdAt)} • {formatDate(order.createdAt)}
        </Text>
        <TouchableOpacity style={styles.reorderButton} onPress={onReorder}>
          <Text style={styles.reorderText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurant: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  details: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  time: {
    fontSize: 12,
    color: colors.textLight,
  },
  reorderButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reorderText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default OrderCard;