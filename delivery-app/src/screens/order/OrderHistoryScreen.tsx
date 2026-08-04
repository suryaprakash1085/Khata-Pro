// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import OrderCard from '../../components/orders/OrderCard';
// import { Order } from '../../types';

// interface OrderHistoryScreenProps {
//   navigation: any;
// }

// export default function OrderHistoryScreen({ navigation }: OrderHistoryScreenProps) {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filter, setFilter] = useState<string>('all');

//   const filters: { id: string; label: string }[] = [
//     { id: 'all', label: 'All' },
//     { id: 'delivered', label: 'Delivered' },
//     { id: 'cancelled', label: 'Cancelled' },
//   ];

//   const mockOrders: Order[] = [
//     {
//       id: '1',
//       restaurantId: '1',
//       restaurantName: 'Pizza Hut',
//       items: [],
//       total: 461,
//       status: 'Delivered',
//       deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
//       paymentMethod: 'Card',
//       createdAt: new Date().toISOString(),
//     },
//     {
//       id: '2',
//       restaurantId: '2',
//       restaurantName: 'Burger Craft',
//       items: [],
//       total: 810,
//       status: 'Delivered',
//       deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
//       paymentMethod: 'UPI',
//       createdAt: new Date(Date.now() - 86400000).toISOString(),
//     },
//     {
//       id: '3',
//       restaurantId: '3',
//       restaurantName: 'Chinese Wok',
//       items: [],
//       total: 299,
//       status: 'Cancelled',
//       deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
//       paymentMethod: 'Cash',
//       createdAt: new Date(Date.now() - 172800000).toISOString(),
//     },
//   ];

//   useEffect(() => {
//     setOrders(mockOrders);
//   }, []);

//   const filteredOrders: Order[] = filter === 'all' 
//     ? orders 
//     : orders.filter(order => order.status.toLowerCase() === filter);

//   const renderOrder = ({ item }: { item: Order }) => (
//     <OrderCard
//       order={item}
//       onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
//       onReorder={() => {
//         navigation.navigate('RestaurantDetail', { restaurant: { id: item.restaurantId, name: item.restaurantName } });
//       }}
//     />
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Order History</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <View style={styles.filtersContainer}>
//         {filters.map((f) => (
//           <TouchableOpacity
//             key={f.id}
//             style={[styles.filterChip, filter === f.id && styles.activeFilter]}
//             onPress={() => setFilter(f.id)}
//           >
//             <Text style={[styles.filterText, filter === f.id && styles.activeFilterText]}>
//               {f.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={filteredOrders}
//         renderItem={renderOrder}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.ordersList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="clipboard-outline" size={60} color={colors.gray} />
//             <Text style={styles.emptyText}>No orders found</Text>
//             <Text style={styles.emptySubText}>
//               {filter === 'all' 
//                 ? 'You haven\'t placed any orders yet' 
//                 : `No ${filter} orders found`}
//             </Text>
//             <TouchableOpacity
//               style={styles.browseButton}
//               onPress={() => navigation.navigate('Home')}
//             >
//               <Text style={styles.browseButtonText}>Browse Restaurants</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     paddingTop: 40,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.text,
//   },
//   filtersContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 20,
//     backgroundColor: colors.lightGray,
//     marginRight: 8,
//   },
//   activeFilter: {
//     backgroundColor: colors.primary,
//   },
//   filterText: {
//     fontSize: 13,
//     color: colors.text,
//   },
//   activeFilterText: {
//     color: colors.white,
//     fontWeight: '500',
//   },
//   ordersList: {
//     padding: 16,
//     paddingBottom: 80,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: colors.text,
//     marginTop: 16,
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: colors.gray,
//     marginTop: 8,
//     marginBottom: 24,
//   },
//   browseButton: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   browseButtonText: {
//     color: colors.white,
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import OrderCard from '../../components/orders/OrderCard';
import { Order } from '../../types';

interface OrderHistoryScreenProps {
  navigation: any;
}

export default function OrderHistoryScreen({ navigation }: OrderHistoryScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const filters: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const mockOrders: Order[] = [
    {
      id: '1',
      restaurantId: '1',
      restaurantName: 'Pizza Hut',
      items: [],
      total: 461,
      status: 'Delivered',
      deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
      paymentMethod: 'Card',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      restaurantId: '2',
      restaurantName: 'Burger Craft',
      items: [],
      total: 810,
      status: 'Delivered',
      deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
      paymentMethod: 'UPI',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      restaurantId: '3',
      restaurantName: 'Chinese Wok',
      items: [],
      total: 299,
      status: 'Cancelled',
      deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
      paymentMethod: 'Cash',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const filteredOrders: Order[] = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter);

  const renderOrder = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
      onReorder={() => {
        navigation.navigate('RestaurantDetail', { restaurant: { id: item.restaurantId, name: item.restaurantName } });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filtersContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, filter === f.id && styles.activeFilter]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[styles.filterText, filter === f.id && styles.activeFilterText]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="clipboard-outline" size={60} color={colors.gray} />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubText}>
              {filter === 'all' 
                ? 'You haven\'t placed any orders yet' 
                : `No ${filter} orders found`}
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: colors.text,
  },
  activeFilterText: {
    color: colors.white,
    fontWeight: '500',
  },
  ordersList: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 8,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});