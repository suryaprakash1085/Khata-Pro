// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   FlatList,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { colors } from '../../constants/colors';
// // // import OrderCard from '../../components/orders/OrderCard';
// // // import { Order } from '../../types';

// // // export default function OrdersScreen({ navigation }: any) {
// // //   const [activeTab, setActiveTab] = useState<string>('current');

// // //   const tabs: { id: string; label: string }[] = [
// // //     { id: 'current', label: 'Current' },
// // //     { id: 'past', label: 'Past' },
// // //     { id: 'cancelled', label: 'Cancelled' },
// // //   ];

// // //   const orders: Order[] = [
// // //     {
// // //       id: '1',
// // //       restaurantId: '1',
// // //       restaurantName: 'Pizza Hut',
// // //       items: [],
// // //       total: 461,
// // //       status: 'Delivered',
// // //       deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
// // //       paymentMethod: 'Card',
// // //       createdAt: '2026-07-29T18:26:00',
// // //     },
// // //     {
// // //       id: '2',
// // //       restaurantId: '2',
// // //       restaurantName: 'Burger Craft',
// // //       items: [],
// // //       total: 810,
// // //       status: 'On the way',
// // //       deliveryAddress: { id: '1', type: 'Home', address: '', city: '', state: '', pincode: '', isDefault: true },
// // //       paymentMethod: 'UPI',
// // //       createdAt: '2026-07-29T14:30:00',
// // //     },
// // //   ];

// // //   const getStatusColor = (status: Order['status']): string => {
// // //     switch (status) {
// // //       case 'Delivered': return colors.success;
// // //       case 'On the way': return colors.info;
// // //       case 'Preparing': return colors.warning;
// // //       case 'Cancelled': return colors.danger;
// // //       default: return colors.gray;
// // //     }
// // //   };

// // //   const renderOrder = ({ item }: { item: Order }) => (
// // //     <OrderCard
// // //       order={item}
// // //       onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
// // //       onReorder={() => {
// // //         navigation.navigate('RestaurantDetail', { restaurant: { id: item.restaurantId, name: item.restaurantName } });
// // //       }}
// // //     />
// // //   );

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <Text style={styles.headerTitle}>My Orders</Text>
// // //       </View>

// // //       {/* Tabs */}
// // //       <View style={styles.tabsContainer}>
// // //         {tabs.map((tab) => (
// // //           <TouchableOpacity
// // //             key={tab.id}
// // //             style={[styles.tab, activeTab === tab.id && styles.activeTab]}
// // //             onPress={() => setActiveTab(tab.id)}
// // //           >
// // //             <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
// // //               {tab.label}
// // //             </Text>
// // //           </TouchableOpacity>
// // //         ))}
// // //       </View>

// // //       {/* Orders List */}
// // //       <FlatList
// // //         data={orders}
// // //         renderItem={renderOrder}
// // //         keyExtractor={(item) => item.id}
// // //         contentContainerStyle={styles.ordersList}
// // //         showsVerticalScrollIndicator={false}
// // //         ListEmptyComponent={
// // //           <View style={styles.emptyContainer}>
// // //             <Icon name="clipboard-outline" size={60} color={colors.gray} />
// // //             <Text style={styles.emptyText}>No orders yet</Text>
// // //             <Text style={styles.emptySubText}>Your orders will appear here</Text>
// // //             <TouchableOpacity
// // //               style={styles.browseButton}
// // //               onPress={() => navigation.navigate('Home')}
// // //             >
// // //               <Text style={styles.browseButtonText}>Browse Restaurants</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         }
// // //       />
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: colors.white,
// // //   },
// // //   header: {
// // //     padding: 16,
// // //     paddingTop: 40,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: colors.border,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 24,
// // //     fontWeight: '700',
// // //     color: colors.text,
// // //   },
// // //   tabsContainer: {
// // //     flexDirection: 'row',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: colors.border,
// // //   },
// // //   tab: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     marginRight: 8,
// // //     borderRadius: 20,
// // //   },
// // //   activeTab: {
// // //     backgroundColor: colors.primary,
// // //   },
// // //   tabText: {
// // //     fontSize: 14,
// // //     color: colors.gray,
// // //     fontWeight: '500',
// // //   },
// // //   activeTabText: {
// // //     color: colors.white,
// // //   },
// // //   ordersList: {
// // //     padding: 16,
// // //     paddingBottom: 80,
// // //   },
// // //   emptyContainer: {
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 60,
// // //   },
// // //   emptyText: {
// // //     fontSize: 18,
// // //     fontWeight: '500',
// // //     color: colors.text,
// // //     marginTop: 16,
// // //   },
// // //   emptySubText: {
// // //     fontSize: 14,
// // //     color: colors.gray,
// // //     marginTop: 8,
// // //     marginBottom: 24,
// // //   },
// // //   browseButton: {
// // //     backgroundColor: colors.primary,
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //   },
// // //   browseButtonText: {
// // //     color: colors.white,
// // //     fontWeight: '600',
// // //     fontSize: 16,
// // //   },
// // // });
// // import React from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { colors } from '../../constants/colors';

// // const OrdersScreen: React.FC = () => {
// //   const orders = [
// //     { id: 1, restaurant: 'Pizza Hut', status: 'Delivered', time: 'Today, 6:26 PM', total: '₹461' },
// //     { id: 2, restaurant: 'Burger Craft', status: 'On the way', time: 'Today, 2:30 PM', total: '₹810' },
// //   ];

// //   const renderOrder = ({ item }: any) => (
// //     <View style={styles.orderCard}>
// //       <View style={styles.orderHeader}>
// //         <Text style={styles.orderRestaurant}>{item.restaurant}</Text>
// //         <View style={[styles.statusBadge, { backgroundColor: item.status === 'Delivered' ? '#28a74520' : '#ffc10720' }]}>
// //           <Text style={[styles.statusText, { color: item.status === 'Delivered' ? '#28a745' : '#ffc107' }]}>
// //             {item.status}
// //           </Text>
// //         </View>
// //       </View>
// //       <View style={styles.orderFooter}>
// //         <Text style={styles.orderTime}>{item.time}</Text>
// //         <Text style={styles.orderTotal}>{item.total}</Text>
// //       </View>
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// //       <View style={styles.header}>
// //         <Text style={styles.headerTitle}>My Orders</Text>
// //       </View>

// //       <FlatList
// //         data={orders}
// //         renderItem={renderOrder}
// //         keyExtractor={(item) => item.id.toString()}
// //         contentContainerStyle={styles.ordersList}
// //         ListEmptyComponent={
// //           <View style={styles.emptyContainer}>
// //             <Icon name="clipboard-outline" size={60} color="#ccc" />
// //             <Text style={styles.emptyText}>No orders yet</Text>
// //           </View>
// //         }
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   header: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   ordersList: {
// //     padding: 16,
// //   },
// //   orderCard: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //   },
// //   orderHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   orderRestaurant: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   statusBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   statusText: {
// //     fontSize: 12,
// //     fontWeight: '500',
// //   },
// //   orderFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: 8,
// //     paddingTop: 8,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f0f0f5',
// //   },
// //   orderTime: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //   },
// //   orderTotal: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#fc8019',
// //   },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 60,
// //   },
// //   emptyText: {
// //     fontSize: 18,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //     marginTop: 16,
// //   },
// // });

// // export default OrdersScreen;
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';

// const OrdersScreen: React.FC = ({ navigation }: any) => {
//   const [activeTab, setActiveTab] = useState('current');

//   const tabs = [
//     { id: 'current', label: 'Current' },
//     { id: 'past', label: 'Past' },
//     { id: 'cancelled', label: 'Cancelled' },
//   ];

//   const orders = [
//     {
//       id: 1,
//       restaurant: 'Pizza Hut',
//       items: '2 items',
//       total: '₹461',
//       status: 'Delivered',
//       time: '06:26 PM',
//       date: 'Today',
//     },
//     {
//       id: 2,
//       restaurant: 'Burger Craft',
//       items: '3 items',
//       total: '₹810',
//       status: 'On the way',
//       time: '02:30 PM',
//       date: 'Today',
//     },
//     {
//       id: 3,
//       restaurant: 'Chinese Wok',
//       items: '1 item',
//       total: '₹299',
//       status: 'Preparing',
//       time: '12:15 PM',
//       date: 'Today',
//     },
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Delivered': return '#28a745';
//       case 'On the way': return '#17a2b8';
//       case 'Preparing': return '#ffc107';
//       case 'Cancelled': return '#dc3545';
//       default: return '#7e808c';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Delivered': return 'checkmark-circle';
//       case 'On the way': return 'bicycle';
//       case 'Preparing': return 'time';
//       case 'Cancelled': return 'close-circle';
//       default: return 'time';
//     }
//   };

//   const renderOrder = ({ item }: { item: any }) => (
//     <TouchableOpacity 
//       style={styles.orderCard}
//       onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
//     >
//       <View style={styles.orderHeader}>
//         <View>
//           <Text style={styles.orderRestaurant}>{item.restaurant}</Text>
//           <Text style={styles.orderDetails}>{item.items} • {item.total}</Text>
//         </View>
//         <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
//           <Icon name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
//           <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
//             {item.status}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.orderFooter}>
//         <Text style={styles.orderTime}>{item.time} • {item.date}</Text>
//         <TouchableOpacity style={styles.reorderButton}>
//           <Text style={styles.reorderText}>Reorder</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>My Orders</Text>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabsContainer}>
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab.id}
//             style={[styles.tab, activeTab === tab.id && styles.activeTab]}
//             onPress={() => setActiveTab(tab.id)}
//           >
//             <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
//               {tab.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={orders}
//         renderItem={renderOrder}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.ordersList}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Icon name="clipboard-outline" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>No orders yet</Text>
//             <Text style={styles.emptySubText}>Your orders will appear here</Text>
//             <TouchableOpacity
//               style={styles.browseButton}
//               onPress={() => navigation.navigate('Home')}
//             >
//               <Text style={styles.browseButtonText}>Browse Restaurants</Text>
//             </TouchableOpacity>
//           </View>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   tabsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   tab: {
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     marginRight: 8,
//     borderRadius: 20,
//     backgroundColor: '#f0f0f5',
//   },
//   activeTab: {
//     backgroundColor: '#fc8019',
//   },
//   tabText: {
//     fontSize: 14,
//     color: '#7e808c',
//     fontWeight: '500',
//   },
//   activeTabText: {
//     color: '#ffffff',
//   },
//   ordersList: {
//     padding: 16,
//     paddingBottom: 80,
//   },
//   orderCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   orderHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   orderRestaurant: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   orderDetails: {
//     fontSize: 13,
//     color: '#7e808c',
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
//   orderFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 12,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f5',
//   },
//   orderTime: {
//     fontSize: 12,
//     color: '#7e808c',
//   },
//   reorderButton: {
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   reorderText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#282c3f',
//     marginTop: 16,
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: '#7e808c',
//     marginTop: 8,
//     marginBottom: 24,
//   },
//   browseButton: {
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   browseButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default OrdersScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

const OrdersScreen: React.FC = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('current');

  const tabs = [
    { id: 'current', label: 'Current' },
    { id: 'past', label: 'Past' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const orders = [
    {
      id: 1,
      restaurant: 'Pizza Hut',
      items: '2 items',
      total: '₹461',
      status: 'Delivered',
      time: '06:26 PM',
      date: 'Today',
    },
    {
      id: 2,
      restaurant: 'Burger Craft',
      items: '3 items',
      total: '₹810',
      status: 'On the way',
      time: '02:30 PM',
      date: 'Today',
    },
    {
      id: 3,
      restaurant: 'Chinese Wok',
      items: '1 item',
      total: '₹299',
      status: 'Preparing',
      time: '12:15 PM',
      date: 'Today',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#28a745';
      case 'On the way': return '#17a2b8';
      case 'Preparing': return '#ffc107';
      case 'Cancelled': return '#dc3545';
      default: return '#7e808c';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'checkmark-circle';
      case 'On the way': return 'bicycle';
      case 'Preparing': return 'time';
      case 'Cancelled': return 'close-circle';
      default: return 'time';
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderRestaurant}>{item.restaurant}</Text>
          <Text style={styles.orderDetails}>{item.items} • {item.total}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Icon name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderTime}>{item.time} • {item.date}</Text>
        <TouchableOpacity style={styles.reorderButton}>
          <Text style={styles.reorderText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="clipboard-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubText}>Your orders will appear here</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.browseButtonText}>Browse Restaurants</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  viewAllText: {
    fontSize: 14,
    color: '#fc8019',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f5',
  },
  activeTab: {
    backgroundColor: '#fc8019',
  },
  tabText: {
    fontSize: 14,
    color: '#7e808c',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
  },
  ordersList: {
    padding: 16,
    paddingBottom: 80,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderRestaurant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
  },
  orderDetails: {
    fontSize: 13,
    color: '#7e808c',
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f5',
  },
  orderTime: {
    fontSize: 12,
    color: '#7e808c',
  },
  reorderButton: {
    backgroundColor: '#fc8019',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reorderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#282c3f',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#7e808c',
    marginTop: 8,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#fc8019',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OrdersScreen;