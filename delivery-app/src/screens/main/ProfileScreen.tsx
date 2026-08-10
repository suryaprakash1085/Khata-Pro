// import React, { useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { AuthContext } from '../../context/AuthContext';
// import { User } from '../../types';

// export default function ProfileScreen({ navigation }: any) {
//   const { user, logout } = useContext(AuthContext);

//   const handleLogout = (): void => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Logout', onPress: logout, style: 'destructive' },
//       ]
//     );
//   };

//   const menuItems: { icon: string; label: string; onPress: () => void }[] = [
//     { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
//     { icon: 'card-outline', label: 'Payments', onPress: () => {} },
//     { icon: 'star-outline', label: 'Favourites', onPress: () => {} },
//     { icon: 'location-outline', label: 'Addresses', onPress: () => navigation.navigate('Address') },
//     { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
//     { icon: 'information-circle-outline', label: 'About QuickBite', onPress: () => {} },
//   ];

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* Profile Header */}
//       <View style={styles.header}>
//         <View style={styles.profileInfo}>
//           <View style={styles.avatarContainer}>
//             <Text style={styles.avatarText}>
//               {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
//             </Text>
//           </View>
//           <View style={styles.userInfo}>
//             <Text style={styles.userName}>{user?.name || 'User'}</Text>
//             <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Stats */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>12</Text>
//           <Text style={styles.statLabel}>Orders</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>5</Text>
//           <Text style={styles.statLabel}>Favourites</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>3</Text>
//           <Text style={styles.statLabel}>Reviews</Text>
//         </View>
//       </View>

//       {/* Menu */}
//       <View style={styles.menuContainer}>
//         {menuItems.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.menuItem}
//             onPress={item.onPress}
//           >
//             <View style={styles.menuLeft}>
//               <Icon name={item.icon} size={24} color={colors.text} />
//               <Text style={styles.menuLabel}>{item.label}</Text>
//             </View>
//             <Icon name="chevron-forward" size={20} color={colors.gray} />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Logout Button */}
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Icon name="log-out-outline" size={24} color={colors.danger} />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>QuickBite v1.0.0</Text>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   header: {
//     backgroundColor: colors.primary,
//     padding: 20,
//     paddingTop: 40,
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//   },
//   profileInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatarContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     fontSize: 30,
//     fontWeight: '700',
//     color: colors.primary,
//   },
//   userInfo: {
//     marginLeft: 16,
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: colors.white,
//   },
//   userEmail: {
//     fontSize: 14,
//     color: colors.white,
//     opacity: 0.8,
//     marginTop: 4,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: colors.white,
//     marginHorizontal: 20,
//     marginTop: -20,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: colors.text,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: colors.gray,
//     marginTop: 4,
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: colors.border,
//   },
//   menuContainer: {
//     marginTop: 20,
//     marginHorizontal: 20,
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   menuLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   menuLabel: {
//     fontSize: 16,
//     color: colors.text,
//     marginLeft: 12,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 24,
//     marginHorizontal: 20,
//     padding: 16,
//     backgroundColor: '#fff5f5',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#ffcdd2',
//   },
//   logoutText: {
//     fontSize: 16,
//     color: colors.danger,
//     marginLeft: 8,
//     fontWeight: '500',
//   },
//   footer: {
//     alignItems: 'center',
//     paddingVertical: 30,
//   },
//   footerText: {
//     fontSize: 12,
//     color: colors.gray,
//   },
// });
// delivery-app/src/screens/main/ProfileScreen.tsx
// delivery-app/src/screens/main/ProfileScreen.tsx
// delivery-app/src/screens/main/ProfileScreen.tsx
// delivery-app/src/screens/main/ProfileScreen.tsx
// delivery-app/src/screens/main/ProfileScreen.tsx
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { OrderContext } from '../../context/OrderContext';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { orders } = useContext(OrderContext);
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');

  // Calculate dynamic counts
  const orderCount = orders?.length || 0;
  const deliveredOrders = orders?.filter(o => o.status === 'Delivered').length || 0;
  const cancelledOrders = orders?.filter(o => o.status === 'Cancelled').length || 0;
  
  const totalSpent = orders?.reduce((sum, order) => {
    if (order.status !== 'Cancelled') {
      return sum + order.total;
    }
    return sum;
  }, 0) || 0;

  const favouritesCount = 5;
  const reviewsCount = 3;

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: editName,
        email: editEmail,
        phone: editPhone,
      };
      await updateUser(updatedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  // ✅ Logout function - Navigates to Login
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ]
    );
  };

  const menuItems = [
    { 
      id: 1, 
      icon: 'person-outline', 
      label: 'Edit Profile', 
      onPress: () => setIsEditing(true),
      color: '#fc8019',
    },
    { 
      id: 2, 
      icon: 'card-outline', 
      label: 'Payments', 
      onPress: () => Alert.alert('Payments', 'Manage your payment methods'),
      color: '#28a745',
    },
    { 
      id: 3, 
      icon: 'star-outline', 
      label: 'Favourites', 
      onPress: () => Alert.alert('Favourites', `You have ${favouritesCount} favourite items`),
      color: '#ffc107',
    },
    { 
      id: 4, 
      icon: 'location-outline', 
      label: 'Addresses', 
      onPress: () => Alert.alert('Addresses', 'Manage your delivery addresses'),
      color: '#17a2b8',
    },
    { 
      id: 5, 
      icon: 'help-circle-outline', 
      label: 'Help & Support', 
      onPress: () => Alert.alert('Help & Support', 'How can we help you?'),
      color: '#6f42c1',
    },
    { 
      id: 6, 
      icon: 'information-circle-outline', 
      label: 'About QuickBite', 
      onPress: () => Alert.alert('About QuickBite', 'QuickBite v1.0.0\nOrder food from your favourite restaurants'),
      color: '#17a2b8',
    },
  ];

  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
          <Icon name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={styles.menuLabel}>{item.label}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
              {user?.phone && (
                <Text style={styles.userPhone}>{user.phone}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#fc8019' }]}>
              <Icon name="clipboard-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statNumber}>{orderCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#ffc107' }]}>
              <Icon name="star-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statNumber}>{favouritesCount}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#28a745' }]}>
              <Icon name="chatbubble-outline" size={24} color="#ffffff" />
            </View>
            <Text style={styles.statNumber}>{reviewsCount}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Quick Stats Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Order Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Orders</Text>
            <Text style={styles.detailValue}>{orderCount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivered</Text>
            <Text style={[styles.detailValue, { color: '#28a745' }]}>{deliveredOrders}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cancelled</Text>
            <Text style={[styles.detailValue, { color: '#dc3545' }]}>{cancelledOrders}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Spent</Text>
            <Text style={[styles.detailValue, { color: '#fc8019', fontWeight: '700' }]}>₹{totalSpent}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Items in Cart</Text>
            <Text style={styles.detailValue}>{cartItems.length}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* ✅ Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#dc3545" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>QuickBite v1.0.0</Text>
          <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Icon name="close" size={24} color="#282c3f" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter your phone"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fc8019',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  userEmail: {
    fontSize: 13,
    color: '#7e808c',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 13,
    color: '#7e808c',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#282c3f',
  },
  statLabel: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 2,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
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
  menuContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: '#282c3f',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffcdd2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#dc3545',
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#93959f',
  },
  footerSub: {
    fontSize: 12,
    color: '#c0c0c0',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  modalBody: {
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#282c3f',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#282c3f',
    backgroundColor: '#f8f9fa',
  },
  saveButton: {
    backgroundColor: '#fc8019',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
// // // // // import React, { useContext, useState, useEffect } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   SafeAreaView,
// // // // //   StatusBar,
// // // // //   Alert,
// // // // //   Modal,
// // // // //   TextInput,
// // // // //   FlatList,
// // // // // } from 'react-native';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // import { CartContext } from '../../context/CartContext';
// // // // // import { OrderContext } from '../../context/OrderContext';

// // // // // interface ProfileScreenProps {
// // // // //   navigation: any;
// // // // // }

// // // // // const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
// // // // //   const { user, logout, updateUser } = useContext(AuthContext);
// // // // //   const { cartItems } = useContext(CartContext);
// // // // //   const { orders } = useContext(OrderContext);
  
// // // // //   const [isEditing, setIsEditing] = useState<boolean>(false);
// // // // //   const [editName, setEditName] = useState<string>('');
// // // // //   const [editEmail, setEditEmail] = useState<string>('');
// // // // //   const [editPhone, setEditPhone] = useState<string>('');
// // // // //   const [showDropdown, setShowDropdown] = useState<boolean>(false);

// // // // //   // Calculate dynamic counts
// // // // //   const orderCount = orders?.length || 0;
// // // // //   const deliveredOrders = orders?.filter(o => o.status === 'Delivered').length || 0;
// // // // //   const cancelledOrders = orders?.filter(o => o.status === 'Cancelled').length || 0;
  
// // // // //   // Calculate total spent
// // // // //   const totalSpent = orders?.reduce((sum: number, order: any) => {
// // // // //     if (order.status !== 'Cancelled') {
// // // // //       return sum + order.total;
// // // // //     }
// // // // //     return sum;
// // // // //   }, 0) || 0;

// // // // //   // Favourites count (dynamic - can be connected to favourites system)
// // // // //   const [favouritesCount, setFavouritesCount] = useState<number>(0);
  
// // // // //   // Reviews count (dynamic - can be connected to reviews system)
// // // // //   const [reviewsCount, setReviewsCount] = useState<number>(0);

// // // // //   useEffect(() => {
// // // // //     if (user) {
// // // // //       setEditName(user.name || '');
// // // // //       setEditEmail(user.email || '');
// // // // //       setEditPhone(user.phone || '');
// // // // //     }
// // // // //     // Load favourites and reviews count from storage/API
// // // // //     loadFavouritesCount();
// // // // //     loadReviewsCount();
// // // // //   }, [user]);

// // // // //   // Function to load favourites count
// // // // //   const loadFavouritesCount = async () => {
// // // // //     try {
// // // // //       // For now using mock data, replace with actual API call
// // // // //       setFavouritesCount(5);
// // // // //     } catch (error) {
// // // // //       console.error('Failed to load favourites:', error);
// // // // //     }
// // // // //   };

// // // // //   // Function to load reviews count
// // // // //   const loadReviewsCount = async () => {
// // // // //     try {
// // // // //       // For now using mock data, replace with actual API call
// // // // //       setReviewsCount(3);
// // // // //     } catch (error) {
// // // // //       console.error('Failed to load reviews:', error);
// // // // //     }
// // // // //   };

// // // // //   const handleSaveProfile = async () => {
// // // // //     if (user) {
// // // // //       const updatedUser = {
// // // // //         ...user,
// // // // //         name: editName,
// // // // //         email: editEmail,
// // // // //         phone: editPhone,
// // // // //       };
// // // // //       await updateUser(updatedUser);
// // // // //       setIsEditing(false);
// // // // //       Alert.alert('Success', 'Profile updated successfully!');
// // // // //     }
// // // // //   };

// // // // //   const handleLogout = () => {
// // // // //     Alert.alert(
// // // // //       'Logout',
// // // // //       'Are you sure you want to logout?',
// // // // //       [
// // // // //         { text: 'Cancel', style: 'cancel' },
// // // // //         { 
// // // // //           text: 'Logout', 
// // // // //           style: 'destructive',
// // // // //           onPress: async () => {
// // // // //             await logout();
// // // // //             navigation.replace('Landing');
// // // // //           }
// // // // //         },
// // // // //       ]
// // // // //     );
// // // // //   };

// // // // //   const menuItems = [
// // // // //     { 
// // // // //       id: 1, 
// // // // //       icon: 'person-outline', 
// // // // //       label: 'Edit Profile', 
// // // // //       onPress: () => setIsEditing(true),
// // // // //       color: '#fc8019',
// // // // //     },
// // // // //     { 
// // // // //       id: 2, 
// // // // //       icon: 'card-outline', 
// // // // //       label: 'Payments', 
// // // // //       onPress: () => navigation.navigate('Payments'),
// // // // //       color: '#28a745',
// // // // //     },
// // // // //     { 
// // // // //       id: 3, 
// // // // //       icon: 'star-outline', 
// // // // //       label: 'Favourites', 
// // // // //       onPress: () => Alert.alert('Favourites', `You have ${favouritesCount} favourite items`),
// // // // //       color: '#ffc107',
// // // // //     },
// // // // //     { 
// // // // //       id: 4, 
// // // // //       icon: 'location-outline', 
// // // // //       label: 'Addresses', 
// // // // //       onPress: () => navigation.navigate('Addresses'),
// // // // //       color: '#17a2b8',
// // // // //     },
// // // // //     { 
// // // // //       id: 5, 
// // // // //       icon: 'help-circle-outline', 
// // // // //       label: 'Help & Support', 
// // // // //       onPress: () => Alert.alert('Help & Support', 'How can we help you?'),
// // // // //       color: '#6f42c1',
// // // // //     },
// // // // //     { 
// // // // //       id: 6, 
// // // // //       icon: 'information-circle-outline', 
// // // // //       label: 'About QuickBite', 
// // // // //       onPress: () => Alert.alert('About QuickBite', 'QuickBite v1.0.0\nOrder food from your favourite restaurants'),
// // // // //       color: '#17a2b8',
// // // // //     },
// // // // //   ];

// // // // //   const renderMenuItem = ({ item }: { item: any }) => (
// // // // //     <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
// // // // //       <View style={styles.menuItemLeft}>
// // // // //         <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
// // // // //           <Icon name={item.icon} size={22} color={item.color} />
// // // // //         </View>
// // // // //         <Text style={styles.menuLabel}>{item.label}</Text>
// // // // //       </View>
// // // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // // //     </TouchableOpacity>
// // // // //   );

// // // // //   return (
// // // // //     <SafeAreaView style={styles.container}>
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         {/* Profile Header */}
// // // // //         <View style={styles.header}>
// // // // //           <View style={styles.profileInfo}>
// // // // //             <View style={styles.avatarContainer}>
// // // // //               <Text style={styles.avatarText}>
// // // // //                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
// // // // //               </Text>
// // // // //             </View>
// // // // //             <View style={styles.userInfo}>
// // // // //               <Text style={styles.userName}>{user?.name || 'User'}</Text>
// // // // //               <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
// // // // //               {user?.phone && (
// // // // //                 <Text style={styles.userPhone}>{user.phone}</Text>
// // // // //               )}
// // // // //             </View>
// // // // //             <TouchableOpacity 
// // // // //               style={styles.dropdownButton}
// // // // //               onPress={() => setShowDropdown(!showDropdown)}
// // // // //             >
// // // // //               <Icon name={showDropdown ? 'chevron-up' : 'chevron-down'} size={24} color="#fc8019" />
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* Dropdown Menu */}
// // // // //           {showDropdown && (
// // // // //             <View style={styles.dropdownContainer}>
// // // // //               <TouchableOpacity 
// // // // //                 style={styles.dropdownItem}
// // // // //                 onPress={() => {
// // // // //                   setShowDropdown(false);
// // // // //                   setIsEditing(true);
// // // // //                 }}
// // // // //               >
// // // // //                 <Icon name="person-outline" size={20} color="#282c3f" />
// // // // //                 <Text style={styles.dropdownItemText}>Edit Profile</Text>
// // // // //               </TouchableOpacity>
// // // // //               <TouchableOpacity 
// // // // //                 style={styles.dropdownItem}
// // // // //                 onPress={() => {
// // // // //                   setShowDropdown(false);
// // // // //                   navigation.navigate('Orders');
// // // // //                 }}
// // // // //               >
// // // // //                 <Icon name="clipboard-outline" size={20} color="#282c3f" />
// // // // //                 <Text style={styles.dropdownItemText}>My Orders</Text>
// // // // //               </TouchableOpacity>
// // // // //               <TouchableOpacity 
// // // // //                 style={styles.dropdownItem}
// // // // //                 onPress={() => {
// // // // //                   setShowDropdown(false);
// // // // //                   Alert.alert('Settings', 'App settings coming soon!');
// // // // //                 }}
// // // // //               >
// // // // //                 <Icon name="settings-outline" size={20} color="#282c3f" />
// // // // //                 <Text style={styles.dropdownItemText}>Settings</Text>
// // // // //               </TouchableOpacity>
// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.dropdownItem, styles.dropdownLogout]}
// // // // //                 onPress={handleLogout}
// // // // //               >
// // // // //                 <Icon name="log-out-outline" size={20} color="#dc3545" />
// // // // //                 <Text style={styles.dropdownLogoutText}>Logout</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>

// // // // //         {/* Stats Cards */}
// // // // //         <View style={styles.statsContainer}>
// // // // //           <TouchableOpacity 
// // // // //             style={styles.statCard}
// // // // //             onPress={() => navigation.navigate('Orders')}
// // // // //           >
// // // // //             <View style={[styles.statIconContainer, { backgroundColor: '#fc8019' }]}>
// // // // //               <Icon name="clipboard-outline" size={24} color="#ffffff" />
// // // // //             </View>
// // // // //             <Text style={styles.statNumber}>{orderCount}</Text>
// // // // //             <Text style={styles.statLabel}>Orders</Text>
// // // // //           </TouchableOpacity>
          
// // // // //           <TouchableOpacity 
// // // // //             style={styles.statCard}
// // // // //             onPress={() => Alert.alert('Favourites', `You have ${favouritesCount} favourite items`)}
// // // // //           >
// // // // //             <View style={[styles.statIconContainer, { backgroundColor: '#ffc107' }]}>
// // // // //               <Icon name="star-outline" size={24} color="#ffffff" />
// // // // //             </View>
// // // // //             <Text style={styles.statNumber}>{favouritesCount}</Text>
// // // // //             <Text style={styles.statLabel}>Favourites</Text>
// // // // //           </TouchableOpacity>
          
// // // // //           <TouchableOpacity 
// // // // //             style={styles.statCard}
// // // // //             onPress={() => Alert.alert('Reviews', `You have written ${reviewsCount} reviews`)}
// // // // //           >
// // // // //             <View style={[styles.statIconContainer, { backgroundColor: '#28a745' }]}>
// // // // //               <Icon name="chatbubble-outline" size={24} color="#ffffff" />
// // // // //             </View>
// // // // //             <Text style={styles.statNumber}>{reviewsCount}</Text>
// // // // //             <Text style={styles.statLabel}>Reviews</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>

// // // // //         {/* Quick Stats Details */}
// // // // //         <View style={styles.detailsContainer}>
// // // // //           <Text style={styles.detailsTitle}>Order Summary</Text>
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Total Orders</Text>
// // // // //             <Text style={styles.detailValue}>{orderCount}</Text>
// // // // //           </View>
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Delivered</Text>
// // // // //             <Text style={[styles.detailValue, { color: '#28a745' }]}>{deliveredOrders}</Text>
// // // // //           </View>
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Cancelled</Text>
// // // // //             <Text style={[styles.detailValue, { color: '#dc3545' }]}>{cancelledOrders}</Text>
// // // // //           </View>
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Total Spent</Text>
// // // // //             <Text style={[styles.detailValue, { color: '#fc8019', fontWeight: '700' }]}>₹{totalSpent}</Text>
// // // // //           </View>
// // // // //           <View style={styles.detailRow}>
// // // // //             <Text style={styles.detailLabel}>Items in Cart</Text>
// // // // //             <Text style={styles.detailValue}>{cartItems.length}</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Menu Items */}
// // // // //         <View style={styles.menuContainer}>
// // // // //           <FlatList
// // // // //             data={menuItems}
// // // // //             renderItem={renderMenuItem}
// // // // //             keyExtractor={(item) => item.id.toString()}
// // // // //             scrollEnabled={false}
// // // // //           />
// // // // //         </View>

// // // // //         {/* Logout Button */}
// // // // //         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
// // // // //           <Icon name="log-out-outline" size={24} color="#dc3545" />
// // // // //           <Text style={styles.logoutText}>Logout</Text>
// // // // //         </TouchableOpacity>

// // // // //         <View style={styles.footer}>
// // // // //           <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // // // //           <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
// // // // //         </View>
// // // // //       </ScrollView>

// // // // //       {/* Edit Profile Modal */}
// // // // //       <Modal
// // // // //         visible={isEditing}
// // // // //         animationType="slide"
// // // // //         transparent={true}
// // // // //         onRequestClose={() => setIsEditing(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Edit Profile</Text>
// // // // //               <TouchableOpacity onPress={() => setIsEditing(false)}>
// // // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.modalBody}>
// // // // //               <View style={styles.inputGroup}>
// // // // //                 <Text style={styles.inputLabel}>Full Name</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   value={editName}
// // // // //                   onChangeText={setEditName}
// // // // //                   placeholder="Enter your name"
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.inputGroup}>
// // // // //                 <Text style={styles.inputLabel}>Email</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   value={editEmail}
// // // // //                   onChangeText={setEditEmail}
// // // // //                   placeholder="Enter your email"
// // // // //                   keyboardType="email-address"
// // // // //                   autoCapitalize="none"
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.inputGroup}>
// // // // //                 <Text style={styles.inputLabel}>Phone</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   value={editPhone}
// // // // //                   onChangeText={setEditPhone}
// // // // //                   placeholder="Enter your phone"
// // // // //                   keyboardType="phone-pad"
// // // // //                 />
// // // // //               </View>

// // // // //               <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
// // // // //                 <Text style={styles.saveButtonText}>Save Changes</Text>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>
// // // // //     </SafeAreaView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //   },
// // // // //   header: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     paddingHorizontal: 20,
// // // // //     paddingTop: 12,
// // // // //     paddingBottom: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //     elevation: 2,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //   },
// // // // //   profileInfo: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   avatarContainer: {
// // // // //     width: 60,
// // // // //     height: 60,
// // // // //     borderRadius: 30,
// // // // //     backgroundColor: '#fc8019',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   avatarText: {
// // // // //     fontSize: 26,
// // // // //     fontWeight: '700',
// // // // //     color: '#ffffff',
// // // // //   },
// // // // //   userInfo: {
// // // // //     flex: 1,
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   userName: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   userEmail: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   userPhone: {
// // // // //     fontSize: 13,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   dropdownButton: {
// // // // //     padding: 8,
// // // // //   },
// // // // //   dropdownContainer: {
// // // // //     position: 'absolute',
// // // // //     top: 80,
// // // // //     right: 20,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     paddingVertical: 8,
// // // // //     minWidth: 180,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 4 },
// // // // //     shadowOpacity: 0.15,
// // // // //     shadowRadius: 12,
// // // // //     elevation: 8,
// // // // //     zIndex: 1000,
// // // // //   },
// // // // //   dropdownItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 10,
// // // // //   },
// // // // //   dropdownItemText: {
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   dropdownLogout: {
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#f0f0f5',
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   dropdownLogoutText: {
// // // // //     fontSize: 14,
// // // // //     color: '#dc3545',
// // // // //     marginLeft: 12,
// // // // //   },
// // // // //   statsContainer: {
// // // // //     flexDirection: 'row',
// // // // //     paddingHorizontal: 16,
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   statCard: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     alignItems: 'center',
// // // // //     marginHorizontal: 4,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   statIconContainer: {
// // // // //     width: 40,
// // // // //     height: 40,
// // // // //     borderRadius: 20,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   statNumber: {
// // // // //     fontSize: 22,
// // // // //     fontWeight: '700',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   statLabel: {
// // // // //     fontSize: 12,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   detailsContainer: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     marginHorizontal: 16,
// // // // //     marginTop: 16,
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
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
// // // // //   menuContainer: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     marginHorizontal: 16,
// // // // //     marginTop: 16,
// // // // //     borderRadius: 12,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //     overflow: 'hidden',
// // // // //   },
// // // // //   menuItem: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   menuItemLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   menuIconContainer: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   menuLabel: {
// // // // //     fontSize: 15,
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   logoutButton: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginHorizontal: 16,
// // // // //     marginTop: 20,
// // // // //     padding: 16,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#ffcdd2',
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //   },
// // // // //   logoutText: {
// // // // //     fontSize: 16,
// // // // //     color: '#dc3545',
// // // // //     marginLeft: 8,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   footer: {
// // // // //     paddingVertical: 30,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   footerText: {
// // // // //     fontSize: 14,
// // // // //     color: '#93959f',
// // // // //   },
// // // // //   footerSub: {
// // // // //     fontSize: 12,
// // // // //     color: '#c0c0c0',
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'flex-end',
// // // // //   },
// // // // //   modalContainer: {
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderTopLeftRadius: 24,
// // // // //     borderTopRightRadius: 24,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingBottom: 30,
// // // // //     maxHeight: '80%',
// // // // //   },
// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   modalTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   modalBody: {
// // // // //     paddingTop: 20,
// // // // //   },
// // // // //   inputGroup: {
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   inputLabel: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: '#282c3f',
// // // // //     marginBottom: 6,
// // // // //   },
// // // // //   input: {
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e0e0e0',
// // // // //     borderRadius: 10,
// // // // //     paddingHorizontal: 14,
// // // // //     paddingVertical: 12,
// // // // //     fontSize: 14,
// // // // //     color: '#282c3f',
// // // // //     backgroundColor: '#f8f9fa',
// // // // //   },
// // // // //   saveButton: {
// // // // //     backgroundColor: '#fc8019',
// // // // //     paddingVertical: 14,
// // // // //     borderRadius: 10,
// // // // //     alignItems: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   saveButtonText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // // });

// // // // // export default ProfileScreen;
// // // // import React, { useContext, useState, useEffect } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Alert,
// // // //   Modal,
// // // //   TextInput,
// // // //   FlatList,
// // // //   TouchableWithoutFeedback,
// // // //   Dimensions,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { AuthContext } from '../../context/AuthContext';
// // // // import { CartContext } from '../../context/CartContext';
// // // // import { OrderContext } from '../../context/OrderContext';

// // // // const { width, height } = Dimensions.get('window');

// // // // interface ProfileScreenProps {
// // // //   navigation: any;
// // // // }

// // // // const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
// // // //   const { user, logout, updateUser } = useContext(AuthContext);
// // // //   const { cartItems } = useContext(CartContext);
// // // //   const { orders } = useContext(OrderContext);
  
// // // //   const [isEditing, setIsEditing] = useState<boolean>(false);
// // // //   const [editName, setEditName] = useState<string>('');
// // // //   const [editEmail, setEditEmail] = useState<string>('');
// // // //   const [editPhone, setEditPhone] = useState<string>('');
// // // //   const [showDropdown, setShowDropdown] = useState<boolean>(false);

// // // //   // Calculate dynamic counts
// // // //   const orderCount = orders?.length || 0;
// // // //   const deliveredOrders = orders?.filter(o => o.status === 'Delivered').length || 0;
// // // //   const cancelledOrders = orders?.filter(o => o.status === 'Cancelled').length || 0;
  
// // // //   // Calculate total spent
// // // //   const totalSpent = orders?.reduce((sum: number, order: any) => {
// // // //     if (order.status !== 'Cancelled') {
// // // //       return sum + order.total;
// // // //     }
// // // //     return sum;
// // // //   }, 0) || 0;

// // // //   // Favourites count (dynamic)
// // // //   const [favouritesCount, setFavouritesCount] = useState<number>(0);
  
// // // //   // Reviews count (dynamic)
// // // //   const [reviewsCount, setReviewsCount] = useState<number>(0);

// // // //   useEffect(() => {
// // // //     if (user) {
// // // //       setEditName(user.name || '');
// // // //       setEditEmail(user.email || '');
// // // //       setEditPhone(user.phone || '');
// // // //     }
// // // //     loadFavouritesCount();
// // // //     loadReviewsCount();
// // // //   }, [user]);

// // // //   const loadFavouritesCount = async () => {
// // // //     try {
// // // //       setFavouritesCount(5);
// // // //     } catch (error) {
// // // //       console.error('Failed to load favourites:', error);
// // // //     }
// // // //   };

// // // //   const loadReviewsCount = async () => {
// // // //     try {
// // // //       setReviewsCount(3);
// // // //     } catch (error) {
// // // //       console.error('Failed to load reviews:', error);
// // // //     }
// // // //   };

// // // //   const handleSaveProfile = async () => {
// // // //     if (user) {
// // // //       const updatedUser = {
// // // //         ...user,
// // // //         name: editName,
// // // //         email: editEmail,
// // // //         phone: editPhone,
// // // //       };
// // // //       await updateUser(updatedUser);
// // // //       setIsEditing(false);
// // // //       Alert.alert('Success', 'Profile updated successfully!');
// // // //     }
// // // //   };

// // // //   const handleLogout = () => {
// // // //     Alert.alert(
// // // //       'Logout',
// // // //       'Are you sure you want to logout?',
// // // //       [
// // // //         { text: 'Cancel', style: 'cancel' },
// // // //         { 
// // // //           text: 'Logout', 
// // // //           style: 'destructive',
// // // //           onPress: async () => {
// // // //             await logout();
// // // //             navigation.replace('Landing');
// // // //           }
// // // //         },
// // // //       ]
// // // //     );
// // // //   };

// // // //   const menuItems = [
// // // //     { 
// // // //       id: 1, 
// // // //       icon: 'person-outline', 
// // // //       label: 'Edit Profile', 
// // // //       onPress: () => setIsEditing(true),
// // // //       color: '#fc8019',
// // // //     },
// // // //     { 
// // // //       id: 2, 
// // // //       icon: 'card-outline', 
// // // //       label: 'Payments', 
// // // //       onPress: () => navigation.navigate('Payments'),
// // // //       color: '#28a745',
// // // //     },
// // // //     { 
// // // //       id: 3, 
// // // //       icon: 'star-outline', 
// // // //       label: 'Favourites', 
// // // //       onPress: () => Alert.alert('Favourites', `You have ${favouritesCount} favourite items`),
// // // //       color: '#ffc107',
// // // //     },
// // // //     { 
// // // //       id: 4, 
// // // //       icon: 'location-outline', 
// // // //       label: 'Addresses', 
// // // //       onPress: () => navigation.navigate('Addresses'),
// // // //       color: '#17a2b8',
// // // //     },
// // // //     { 
// // // //       id: 5, 
// // // //       icon: 'help-circle-outline', 
// // // //       label: 'Help & Support', 
// // // //       onPress: () => Alert.alert('Help & Support', 'How can we help you?'),
// // // //       color: '#6f42c1',
// // // //     },
// // // //     { 
// // // //       id: 6, 
// // // //       icon: 'information-circle-outline', 
// // // //       label: 'About QuickBite', 
// // // //       onPress: () => Alert.alert('About QuickBite', 'QuickBite v1.0.0\nOrder food from your favourite restaurants'),
// // // //       color: '#17a2b8',
// // // //     },
// // // //   ];

// // // //   const renderMenuItem = ({ item }: { item: any }) => (
// // // //     <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
// // // //       <View style={styles.menuItemLeft}>
// // // //         <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
// // // //           <Icon name={item.icon} size={22} color={item.color} />
// // // //         </View>
// // // //         <Text style={styles.menuLabel}>{item.label}</Text>
// // // //       </View>
// // // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // // //     </TouchableOpacity>
// // // //   );

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // //         {/* Profile Header */}
// // // //         <View style={styles.header}>
// // // //           <View style={styles.profileInfo}>
// // // //             <View style={styles.avatarContainer}>
// // // //               <Text style={styles.avatarText}>
// // // //                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
// // // //               </Text>
// // // //             </View>
// // // //             <View style={styles.userInfo}>
// // // //               <Text style={styles.userName}>{user?.name || 'User'}</Text>
// // // //               <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
// // // //               {user?.phone && (
// // // //                 <Text style={styles.userPhone}>{user.phone}</Text>
// // // //               )}
// // // //             </View>
// // // //             <TouchableOpacity 
// // // //               style={styles.dropdownButton}
// // // //               onPress={() => setShowDropdown(!showDropdown)}
// // // //             >
// // // //               <Icon name={showDropdown ? 'chevron-up' : 'chevron-down'} size={24} color="#fc8019" />
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         </View>

// // // //         {/* 🔥 FIXED DROPDOWN - Proper Alignment */}
// // // //         {showDropdown && (
// // // //           <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
// // // //             <View style={styles.dropdownOverlay}>
// // // //               <View style={styles.dropdownContainer}>
// // // //                 {/* Dropdown Header */}
// // // //                 <View style={styles.dropdownHeader}>
// // // //                   <Text style={styles.dropdownTitle}>Menu</Text>
// // // //                   <TouchableOpacity onPress={() => setShowDropdown(false)}>
// // // //                     <Icon name="close" size={20} color="#7e808c" />
// // // //                   </TouchableOpacity>
// // // //                 </View>

// // // //                 {/* Dropdown Items - Properly Aligned */}
// // // //                 <TouchableOpacity 
// // // //                   style={styles.dropdownItem}
// // // //                   onPress={() => {
// // // //                     setShowDropdown(false);
// // // //                     setIsEditing(true);
// // // //                   }}
// // // //                 >
// // // //                   <View style={styles.dropdownItemLeft}>
// // // //                     <Icon name="person-outline" size={20} color="#fc8019" />
// // // //                     <Text style={styles.dropdownItemText}>Edit Profile</Text>
// // // //                   </View>
// // // //                   <Icon name="chevron-forward" size={16} color="#ccc" />
// // // //                 </TouchableOpacity>

// // // //                 <TouchableOpacity 
// // // //                   style={styles.dropdownItem}
// // // //                   onPress={() => {
// // // //                     setShowDropdown(false);
// // // //                     navigation.navigate('Orders');
// // // //                   }}
// // // //                 >
// // // //                   <View style={styles.dropdownItemLeft}>
// // // //                     <Icon name="clipboard-outline" size={20} color="#17a2b8" />
// // // //                     <Text style={styles.dropdownItemText}>My Orders</Text>
// // // //                   </View>
// // // //                   <Icon name="chevron-forward" size={16} color="#ccc" />
// // // //                 </TouchableOpacity>

// // // //                 <TouchableOpacity 
// // // //                   style={styles.dropdownItem}
// // // //                   onPress={() => {
// // // //                     setShowDropdown(false);
// // // //                     navigation.navigate('Payments');
// // // //                   }}
// // // //                 >
// // // //                   <View style={styles.dropdownItemLeft}>
// // // //                     <Icon name="card-outline" size={20} color="#28a745" />
// // // //                     <Text style={styles.dropdownItemText}>Payments</Text>
// // // //                   </View>
// // // //                   <Icon name="chevron-forward" size={16} color="#ccc" />
// // // //                 </TouchableOpacity>

// // // //                 <TouchableOpacity 
// // // //                   style={styles.dropdownItem}
// // // //                   onPress={() => {
// // // //                     setShowDropdown(false);
// // // //                     navigation.navigate('Addresses');
// // // //                   }}
// // // //                 >
// // // //                   <View style={styles.dropdownItemLeft}>
// // // //                     <Icon name="location-outline" size={20} color="#17a2b8" />
// // // //                     <Text style={styles.dropdownItemText}>Addresses</Text>
// // // //                   </View>
// // // //                   <Icon name="chevron-forward" size={16} color="#ccc" />
// // // //                 </TouchableOpacity>

// // // //                 <TouchableOpacity 
// // // //                   style={styles.dropdownItem}
// // // //                   onPress={() => {
// // // //                     setShowDropdown(false);
// // // //                     Alert.alert('Settings', 'App settings coming soon!');
// // // //                   }}
// // // //                 >
// // // //                   <View style={styles.dropdownItemLeft}>
// // // //                     <Icon name="settings-outline" size={20} color="#6f42c1" />
// // // //                     <Text style={styles.dropdownItemText}>Settings</Text>
// // // //                   </View>
// // // //                   <Icon name="chevron-forward" size={16} color="#ccc" />
// // // //                 </TouchableOpacity>

// // // //                 <View style={styles.dropdownDivider} />

// // // //                 <TouchableOpacity 
// // // //                   style={[styles.dropdownItem, styles.dropdownLogout]}
// // // //                   onPress={handleLogout}
// // // //                 >
// // // //                   <View style={styles.dropdownItemLeft}>
// // // //                     <Icon name="log-out-outline" size={20} color="#dc3545" />
// // // //                     <Text style={[styles.dropdownItemText, styles.dropdownLogoutText]}>Logout</Text>
// // // //                   </View>
// // // //                   <Icon name="chevron-forward" size={16} color="#ccc" />
// // // //                 </TouchableOpacity>
// // // //               </View>
// // // //             </View>
// // // //           </TouchableWithoutFeedback>
// // // //         )}

// // // //         {/* Stats Cards */}
// // // //         <View style={styles.statsContainer}>
// // // //           <TouchableOpacity 
// // // //             style={styles.statCard}
// // // //             onPress={() => navigation.navigate('Orders')}
// // // //           >
// // // //             <View style={[styles.statIconContainer, { backgroundColor: '#fc8019' }]}>
// // // //               <Icon name="clipboard-outline" size={24} color="#ffffff" />
// // // //             </View>
// // // //             <Text style={styles.statNumber}>{orderCount}</Text>
// // // //             <Text style={styles.statLabel}>Orders</Text>
// // // //           </TouchableOpacity>
          
// // // //           <TouchableOpacity 
// // // //             style={styles.statCard}
// // // //             onPress={() => Alert.alert('Favourites', `You have ${favouritesCount} favourite items`)}
// // // //           >
// // // //             <View style={[styles.statIconContainer, { backgroundColor: '#ffc107' }]}>
// // // //               <Icon name="star-outline" size={24} color="#ffffff" />
// // // //             </View>
// // // //             <Text style={styles.statNumber}>{favouritesCount}</Text>
// // // //             <Text style={styles.statLabel}>Favourites</Text>
// // // //           </TouchableOpacity>
          
// // // //           <TouchableOpacity 
// // // //             style={styles.statCard}
// // // //             onPress={() => Alert.alert('Reviews', `You have written ${reviewsCount} reviews`)}
// // // //           >
// // // //             <View style={[styles.statIconContainer, { backgroundColor: '#28a745' }]}>
// // // //               <Icon name="chatbubble-outline" size={24} color="#ffffff" />
// // // //             </View>
// // // //             <Text style={styles.statNumber}>{reviewsCount}</Text>
// // // //             <Text style={styles.statLabel}>Reviews</Text>
// // // //           </TouchableOpacity>
// // // //         </View>

// // // //         {/* Quick Stats Details */}
// // // //         <View style={styles.detailsContainer}>
// // // //           <Text style={styles.detailsTitle}>Order Summary</Text>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Total Orders</Text>
// // // //             <Text style={styles.detailValue}>{orderCount}</Text>
// // // //           </View>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Delivered</Text>
// // // //             <Text style={[styles.detailValue, { color: '#28a745' }]}>{deliveredOrders}</Text>
// // // //           </View>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Cancelled</Text>
// // // //             <Text style={[styles.detailValue, { color: '#dc3545' }]}>{cancelledOrders}</Text>
// // // //           </View>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Total Spent</Text>
// // // //             <Text style={[styles.detailValue, { color: '#fc8019', fontWeight: '700' }]}>₹{totalSpent}</Text>
// // // //           </View>
// // // //           <View style={styles.detailRow}>
// // // //             <Text style={styles.detailLabel}>Items in Cart</Text>
// // // //             <Text style={styles.detailValue}>{cartItems.length}</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Menu Items */}
// // // //         <View style={styles.menuContainer}>
// // // //           <FlatList
// // // //             data={menuItems}
// // // //             renderItem={renderMenuItem}
// // // //             keyExtractor={(item) => item.id.toString()}
// // // //             scrollEnabled={false}
// // // //           />
// // // //         </View>

// // // //         {/* Logout Button */}
// // // //         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
// // // //           <Icon name="log-out-outline" size={24} color="#dc3545" />
// // // //           <Text style={styles.logoutText}>Logout</Text>
// // // //         </TouchableOpacity>

// // // //         <View style={styles.footer}>
// // // //           <Text style={styles.footerText}>QuickBite v1.0.0</Text>
// // // //           <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
// // // //         </View>
// // // //       </ScrollView>

// // // //       {/* Edit Profile Modal */}
// // // //       <Modal
// // // //         visible={isEditing}
// // // //         animationType="slide"
// // // //         transparent={true}
// // // //         onRequestClose={() => setIsEditing(false)}
// // // //       >
// // // //         <View style={styles.modalOverlay}>
// // // //           <View style={styles.modalContainer}>
// // // //             <View style={styles.modalHeader}>
// // // //               <Text style={styles.modalTitle}>Edit Profile</Text>
// // // //               <TouchableOpacity onPress={() => setIsEditing(false)}>
// // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             <View style={styles.modalBody}>
// // // //               <View style={styles.inputGroup}>
// // // //                 <Text style={styles.inputLabel}>Full Name</Text>
// // // //                 <TextInput
// // // //                   style={styles.input}
// // // //                   value={editName}
// // // //                   onChangeText={setEditName}
// // // //                   placeholder="Enter your name"
// // // //                 />
// // // //               </View>

// // // //               <View style={styles.inputGroup}>
// // // //                 <Text style={styles.inputLabel}>Email</Text>
// // // //                 <TextInput
// // // //                   style={styles.input}
// // // //                   value={editEmail}
// // // //                   onChangeText={setEditEmail}
// // // //                   placeholder="Enter your email"
// // // //                   keyboardType="email-address"
// // // //                   autoCapitalize="none"
// // // //                 />
// // // //               </View>

// // // //               <View style={styles.inputGroup}>
// // // //                 <Text style={styles.inputLabel}>Phone</Text>
// // // //                 <TextInput
// // // //                   style={styles.input}
// // // //                   value={editPhone}
// // // //                   onChangeText={setEditPhone}
// // // //                   placeholder="Enter your phone"
// // // //                   keyboardType="phone-pad"
// // // //                 />
// // // //               </View>

// // // //               <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
// // // //                 <Text style={styles.saveButtonText}>Save Changes</Text>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#f8f9fa',
// // // //   },
// // // //   header: {
// // // //     backgroundColor: '#ffffff',
// // // //     paddingHorizontal: 20,
// // // //     paddingTop: 12,
// // // //     paddingBottom: 16,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //     elevation: 2,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //   },
// // // //   profileInfo: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   avatarContainer: {
// // // //     width: 60,
// // // //     height: 60,
// // // //     borderRadius: 30,
// // // //     backgroundColor: '#fc8019',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   avatarText: {
// // // //     fontSize: 26,
// // // //     fontWeight: '700',
// // // //     color: '#ffffff',
// // // //   },
// // // //   userInfo: {
// // // //     flex: 1,
// // // //     marginLeft: 12,
// // // //   },
// // // //   userName: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   userEmail: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   userPhone: {
// // // //     fontSize: 13,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   dropdownButton: {
// // // //     padding: 8,
// // // //   },

// // // //   // 🔥 FIXED DROPDOWN STYLES
// // // //   dropdownOverlay: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     backgroundColor: 'rgba(0,0,0,0.3)',
// // // //     zIndex: 1000,
// // // //   },
// // // //   dropdownContainer: {
// // // //     position: 'absolute',
// // // //     top: 80,
// // // //     right: 16,
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 14,
// // // //     width: width * 0.85,
// // // //     maxWidth: 320,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 6 },
// // // //     shadowOpacity: 0.2,
// // // //     shadowRadius: 16,
// // // //     elevation: 10,
// // // //   },
// // // //   dropdownHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 14,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   dropdownTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   dropdownItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 12,
// // // //   },
// // // //   dropdownItemLeft: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },
// // // //   dropdownItemText: {
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     marginLeft: 14,
// // // //     flex: 1,
// // // //   },
// // // //   dropdownDivider: {
// // // //     height: 1,
// // // //     backgroundColor: '#f0f0f5',
// // // //     marginHorizontal: 16,
// // // //   },
// // // //   dropdownLogout: {
// // // //     marginTop: 4,
// // // //     paddingTop: 12,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#f0f0f5',
// // // //   },
// // // //   dropdownLogoutText: {
// // // //     color: '#dc3545',
// // // //   },

// // // //   statsContainer: {
// // // //     flexDirection: 'row',
// // // //     paddingHorizontal: 16,
// // // //     marginTop: 16,
// // // //   },
// // // //   statCard: {
// // // //     flex: 1,
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     alignItems: 'center',
// // // //     marginHorizontal: 4,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   statIconContainer: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 20,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },
// // // //   statNumber: {
// // // //     fontSize: 22,
// // // //     fontWeight: '700',
// // // //     color: '#282c3f',
// // // //   },
// // // //   statLabel: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   detailsContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 16,
// // // //     borderRadius: 12,
// // // //     padding: 16,
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
// // // //   menuContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 16,
// // // //     borderRadius: 12,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   menuItem: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 14,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   menuItemLeft: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   menuIconContainer: {
// // // //     width: 36,
// // // //     height: 36,
// // // //     borderRadius: 18,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //   },
// // // //   menuLabel: {
// // // //     fontSize: 15,
// // // //     color: '#282c3f',
// // // //   },
// // // //   logoutButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 20,
// // // //     padding: 16,
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#ffcdd2',
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   logoutText: {
// // // //     fontSize: 16,
// // // //     color: '#dc3545',
// // // //     marginLeft: 8,
// // // //     fontWeight: '500',
// // // //   },
// // // //   footer: {
// // // //     paddingVertical: 30,
// // // //     alignItems: 'center',
// // // //   },
// // // //   footerText: {
// // // //     fontSize: 14,
// // // //     color: '#93959f',
// // // //   },
// // // //   footerSub: {
// // // //     fontSize: 12,
// // // //     color: '#c0c0c0',
// // // //     marginTop: 4,
// // // //   },
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     justifyContent: 'flex-end',
// // // //   },
// // // //   modalContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     borderTopLeftRadius: 24,
// // // //     borderTopRightRadius: 24,
// // // //     paddingHorizontal: 20,
// // // //     paddingBottom: 30,
// // // //     maxHeight: '80%',
// // // //   },
// // // //   modalHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 16,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   modalBody: {
// // // //     paddingTop: 20,
// // // //   },
// // // //   inputGroup: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   inputLabel: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //     marginBottom: 6,
// // // //   },
// // // //   input: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 10,
// // // //     paddingHorizontal: 14,
// // // //     paddingVertical: 12,
// // // //     fontSize: 14,
// // // //     color: '#282c3f',
// // // //     backgroundColor: '#f8f9fa',
// // // //   },
// // // //   saveButton: {
// // // //     backgroundColor: '#fc8019',
// // // //     paddingVertical: 14,
// // // //     borderRadius: 10,
// // // //     alignItems: 'center',
// // // //     marginTop: 8,
// // // //   },
// // // //   saveButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // // });

// // // // export default ProfileScreen;
// // // import React, { useContext, useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Alert,
// // //   Modal,
// // //   TextInput,
// // //   FlatList,
// // //   TouchableWithoutFeedback,
// // //   Dimensions,
// // //   Image,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { AuthContext } from '../../context/AuthContext';
// // // import { CartContext } from '../../context/CartContext';
// // // import { OrderContext } from '../../context/OrderContext';

// // // const { width, height } = Dimensions.get('window');

// // // interface ProfileScreenProps {
// // //   navigation: any;
// // // }

// // // const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
// // //   const { user, logout, updateUser } = useContext(AuthContext);
// // //   const { cartItems } = useContext(CartContext);
// // //   const { orders } = useContext(OrderContext);
  
// // //   const [isEditing, setIsEditing] = useState<boolean>(false);
// // //   const [editName, setEditName] = useState<string>('');
// // //   const [editEmail, setEditEmail] = useState<string>('');
// // //   const [editPhone, setEditPhone] = useState<string>('');
// // //   const [showDropdown, setShowDropdown] = useState<boolean>(false);
// // //   const [activeTab, setActiveTab] = useState<string>('Profile');

// // //   // Calculate dynamic counts
// // //   const orderCount = orders?.length || 0;
// // //   const deliveredOrders = orders?.filter(o => o.status === 'Delivered').length || 0;
// // //   const cancelledOrders = orders?.filter(o => o.status === 'Cancelled').length || 0;
  
// // //   const totalSpent = orders?.reduce((sum: number, order: any) => {
// // //     if (order.status !== 'Cancelled') {
// // //       return sum + order.total;
// // //     }
// // //     return sum;
// // //   }, 0) || 0;

// // //   const [favouritesCount, setFavouritesCount] = useState<number>(0);
// // //   const [reviewsCount, setReviewsCount] = useState<number>(0);

// // //   useEffect(() => {
// // //     if (user) {
// // //       setEditName(user.name || '');
// // //       setEditEmail(user.email || '');
// // //       setEditPhone(user.phone || '');
// // //     }
// // //     loadFavouritesCount();
// // //     loadReviewsCount();
// // //   }, [user]);

// // //   const loadFavouritesCount = async () => {
// // //     try {
// // //       setFavouritesCount(5);
// // //     } catch (error) {
// // //       console.error('Failed to load favourites:', error);
// // //     }
// // //   };

// // //   const loadReviewsCount = async () => {
// // //     try {
// // //       setReviewsCount(3);
// // //     } catch (error) {
// // //       console.error('Failed to load reviews:', error);
// // //     }
// // //   };

// // //   const handleSaveProfile = async () => {
// // //     if (user) {
// // //       const updatedUser = {
// // //         ...user,
// // //         name: editName,
// // //         email: editEmail,
// // //         phone: editPhone,
// // //       };
// // //       await updateUser(updatedUser);
// // //       setIsEditing(false);
// // //       Alert.alert('Success', 'Profile updated successfully!');
// // //     }
// // //   };

// // //   const handleLogout = () => {
// // //     Alert.alert(
// // //       'Logout',
// // //       'Are you sure you want to logout?',
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         { 
// // //           text: 'Logout', 
// // //           style: 'destructive',
// // //           onPress: async () => {
// // //             await logout();
// // //             navigation.replace('Landing');
// // //           }
// // //         },
// // //       ]
// // //     );
// // //   };

// // //   // Profile Menu Items
// // //   const menuItems = [
// // //     { 
// // //       id: 1, 
// // //       icon: 'person-outline', 
// // //       label: 'Edit Profile', 
// // //       onPress: () => setIsEditing(true),
// // //       color: '#fc8019',
// // //       bg: '#fff5ec',
// // //     },
// // //     { 
// // //       id: 2, 
// // //       icon: 'card-outline', 
// // //       label: 'Payments', 
// // //       onPress: () => navigation.navigate('Payments'),
// // //       color: '#28a745',
// // //       bg: '#e8f5e9',
// // //     },
// // //     { 
// // //       id: 3, 
// // //       icon: 'heart-outline', 
// // //       label: 'Favourites', 
// // //       onPress: () => Alert.alert('Favourites', `You have ${favouritesCount} favourite items`),
// // //       color: '#dc3545',
// // //       bg: '#fce4ec',
// // //     },
// // //     { 
// // //       id: 4, 
// // //       icon: 'location-outline', 
// // //       label: 'Addresses', 
// // //       onPress: () => navigation.navigate('Addresses'),
// // //       color: '#17a2b8',
// // //       bg: '#e0f7fa',
// // //     },
// // //     { 
// // //       id: 5, 
// // //       icon: 'help-circle-outline', 
// // //       label: 'Help & Support', 
// // //       onPress: () => Alert.alert('Help & Support', 'How can we help you?'),
// // //       color: '#6f42c1',
// // //       bg: '#f3e5f5',
// // //     },
// // //     { 
// // //       id: 6, 
// // //       icon: 'information-circle-outline', 
// // //       label: 'About QuickBite', 
// // //       onPress: () => Alert.alert('About QuickBite', 'QuickBite v2.0.0\nOrder food from your favourite restaurants'),
// // //       color: '#17a2b8',
// // //       bg: '#e0f7fa',
// // //     },
// // //   ];

// // //   // Quick Actions
// // //   const quickActions = [
// // //     { icon: 'restaurant-outline', label: 'Orders', value: orderCount, color: '#fc8019' },
// // //     { icon: 'heart-outline', label: 'Favourites', value: favouritesCount, color: '#dc3545' },
// // //     { icon: 'chatbubble-outline', label: 'Reviews', value: reviewsCount, color: '#28a745' },
// // //     { icon: 'cart-outline', label: 'Cart', value: cartItems.length, color: '#17a2b8' },
// // //   ];

// // //   const renderMenuItem = ({ item }: { item: any }) => (
// // //     <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
// // //       <View style={styles.menuItemLeft}>
// // //         <View style={[styles.menuIconContainer, { backgroundColor: item.bg }]}>
// // //           <Icon name={item.icon} size={22} color={item.color} />
// // //         </View>
// // //         <View>
// // //           <Text style={styles.menuLabel}>{item.label}</Text>
// // //           <Text style={styles.menuSubLabel}>Tap to view</Text>
// // //         </View>
// // //       </View>
// // //       <Icon name="chevron-forward" size={20} color="#ccc" />
// // //     </TouchableOpacity>
// // //   );

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// // //       <ScrollView 
// // //         showsVerticalScrollIndicator={false}
// // //         contentContainerStyle={styles.scrollContent}
// // //       >
// // //         {/* Header with Back Button */}
// // //         <View style={styles.header}>
// // //           <TouchableOpacity 
// // //             style={styles.backButton}
// // //             onPress={() => navigation.goBack()}
// // //           >
// // //             <Icon name="arrow-back" size={24} color="#282c3f" />
// // //           </TouchableOpacity>
// // //           <Text style={styles.headerTitle}>Profile</Text>
// // //           <TouchableOpacity 
// // //             style={styles.menuButton}
// // //             onPress={() => setShowDropdown(!showDropdown)}
// // //           >
// // //             <Icon name={showDropdown ? 'close' : 'ellipsis-vertical'} size={24} color="#282c3f" />
// // //           </TouchableOpacity>
// // //         </View>

// // //         {/* 🔥 DROPDOWN MENU */}
// // //         {showDropdown && (
// // //           <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
// // //             <View style={styles.dropdownOverlay}>
// // //               <View style={styles.dropdownContainer}>
// // //                 <View style={styles.dropdownHeader}>
// // //                   <View style={styles.dropdownUserInfo}>
// // //                     <View style={styles.dropdownAvatar}>
// // //                       <Text style={styles.dropdownAvatarText}>
// // //                         {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
// // //                       </Text>
// // //                     </View>
// // //                     <View>
// // //                       <Text style={styles.dropdownUserName}>{user?.name || 'User'}</Text>
// // //                       <Text style={styles.dropdownUserEmail}>{user?.email || 'user@email.com'}</Text>
// // //                     </View>
// // //                   </View>
// // //                   <TouchableOpacity onPress={() => setShowDropdown(false)}>
// // //                     <Icon name="close" size={22} color="#7e808c" />
// // //                   </TouchableOpacity>
// // //                 </View>

// // //                 <View style={styles.dropdownItems}>
// // //                   <TouchableOpacity 
// // //                     style={styles.dropdownItem}
// // //                     onPress={() => {
// // //                       setShowDropdown(false);
// // //                       setIsEditing(true);
// // //                     }}
// // //                   >
// // //                     <View style={styles.dropdownItemLeft}>
// // //                       <Icon name="person-outline" size={20} color="#fc8019" />
// // //                       <Text style={styles.dropdownItemText}>Edit Profile</Text>
// // //                     </View>
// // //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// // //                   </TouchableOpacity>

// // //                   <TouchableOpacity 
// // //                     style={styles.dropdownItem}
// // //                     onPress={() => {
// // //                       setShowDropdown(false);
// // //                       navigation.navigate('Orders');
// // //                     }}
// // //                   >
// // //                     <View style={styles.dropdownItemLeft}>
// // //                       <Icon name="clipboard-outline" size={20} color="#17a2b8" />
// // //                       <Text style={styles.dropdownItemText}>My Orders</Text>
// // //                     </View>
// // //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// // //                   </TouchableOpacity>

// // //                   <TouchableOpacity 
// // //                     style={styles.dropdownItem}
// // //                     onPress={() => {
// // //                       setShowDropdown(false);
// // //                       navigation.navigate('Payments');
// // //                     }}
// // //                   >
// // //                     <View style={styles.dropdownItemLeft}>
// // //                       <Icon name="card-outline" size={20} color="#28a745" />
// // //                       <Text style={styles.dropdownItemText}>Payments</Text>
// // //                     </View>
// // //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// // //                   </TouchableOpacity>

// // //                   <TouchableOpacity 
// // //                     style={styles.dropdownItem}
// // //                     onPress={() => {
// // //                       setShowDropdown(false);
// // //                       navigation.navigate('Addresses');
// // //                     }}
// // //                   >
// // //                     <View style={styles.dropdownItemLeft}>
// // //                       <Icon name="location-outline" size={20} color="#17a2b8" />
// // //                       <Text style={styles.dropdownItemText}>Addresses</Text>
// // //                     </View>
// // //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// // //                   </TouchableOpacity>

// // //                   <TouchableOpacity 
// // //                     style={styles.dropdownItem}
// // //                     onPress={() => {
// // //                       setShowDropdown(false);
// // //                       Alert.alert('Settings', 'App settings coming soon!');
// // //                     }}
// // //                   >
// // //                     <View style={styles.dropdownItemLeft}>
// // //                       <Icon name="settings-outline" size={20} color="#6f42c1" />
// // //                       <Text style={styles.dropdownItemText}>Settings</Text>
// // //                     </View>
// // //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// // //                   </TouchableOpacity>

// // //                   <View style={styles.dropdownDivider} />

// // //                   <TouchableOpacity 
// // //                     style={[styles.dropdownItem, styles.dropdownLogout]}
// // //                     onPress={handleLogout}
// // //                   >
// // //                     <View style={styles.dropdownItemLeft}>
// // //                       <Icon name="log-out-outline" size={20} color="#dc3545" />
// // //                       <Text style={[styles.dropdownItemText, styles.dropdownLogoutText]}>Logout</Text>
// // //                     </View>
// // //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           </TouchableWithoutFeedback>
// // //         )}

// // //         {/* Profile Card */}
// // //         <View style={styles.profileCard}>
// // //           <View style={styles.profileImageContainer}>
// // //             <View style={styles.profileImage}>
// // //               <Text style={styles.profileImageText}>
// // //                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
// // //               </Text>
// // //             </View>
// // //             <View style={styles.onlineDot} />
// // //           </View>
// // //           <Text style={styles.profileName}>{user?.name || 'User'}</Text>
// // //           <Text style={styles.profileEmail}>{user?.email || 'user@email.com'}</Text>
// // //           <View style={styles.profileBadge}>
// // //             <Icon name="shield-checkmark" size={14} color="#fc8019" />
// // //             <Text style={styles.profileBadgeText}>Verified Member</Text>
// // //           </View>
// // //         </View>

// // //         {/* Quick Stats */}
// // //         <View style={styles.quickStats}>
// // //           {quickActions.map((item, index) => (
// // //             <TouchableOpacity 
// // //               key={index} 
// // //               style={styles.quickStatItem}
// // //               onPress={() => {
// // //                 if (item.label === 'Orders') navigation.navigate('Orders');
// // //                 else if (item.label === 'Cart') navigation.navigate('Cart');
// // //                 else Alert.alert(item.label, `You have ${item.value} ${item.label.toLowerCase()}`);
// // //               }}
// // //             >
// // //               <View style={[styles.quickStatIcon, { backgroundColor: item.color + '15' }]}>
// // //                 <Icon name={item.icon} size={22} color={item.color} />
// // //               </View>
// // //               <Text style={styles.quickStatValue}>{item.value}</Text>
// // //               <Text style={styles.quickStatLabel}>{item.label}</Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </View>

// // //         {/* Order Summary Card */}
// // //         <View style={styles.summaryCard}>
// // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // //           <View style={styles.summaryGrid}>
// // //             <View style={styles.summaryItem}>
// // //               <Text style={styles.summaryValue}>{orderCount}</Text>
// // //               <Text style={styles.summaryLabel}>Total Orders</Text>
// // //             </View>
// // //             <View style={styles.summaryDivider} />
// // //             <View style={styles.summaryItem}>
// // //               <Text style={[styles.summaryValue, { color: '#28a745' }]}>{deliveredOrders}</Text>
// // //               <Text style={styles.summaryLabel}>Delivered</Text>
// // //             </View>
// // //             <View style={styles.summaryDivider} />
// // //             <View style={styles.summaryItem}>
// // //               <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{cancelledOrders}</Text>
// // //               <Text style={styles.summaryLabel}>Cancelled</Text>
// // //             </View>
// // //           </View>
// // //           <View style={styles.summaryTotal}>
// // //             <Text style={styles.summaryTotalLabel}>Total Spent</Text>
// // //             <Text style={styles.summaryTotalValue}>₹{totalSpent}</Text>
// // //           </View>
// // //         </View>

// // //         {/* Menu Items */}
// // //         <View style={styles.menuContainer}>
// // //           <Text style={styles.menuSectionTitle}>Quick Actions</Text>
// // //           <FlatList
// // //             data={menuItems}
// // //             renderItem={renderMenuItem}
// // //             keyExtractor={(item) => item.id.toString()}
// // //             scrollEnabled={false}
// // //             style={styles.menuList}
// // //           />
// // //         </View>

// // //         {/* Logout Button */}
// // //         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
// // //           <Icon name="log-out-outline" size={22} color="#dc3545" />
// // //           <Text style={styles.logoutText}>Logout</Text>
// // //         </TouchableOpacity>

// // //         <View style={styles.footer}>
// // //           <Text style={styles.footerText}>QuickBite v2.0.0</Text>
// // //           <Text style={styles.footerSub}>Delivering happiness to your doorstep ❤️</Text>
// // //         </View>
// // //       </ScrollView>

// // //       {/* Edit Profile Modal */}
// // //       <Modal
// // //         visible={isEditing}
// // //         animationType="slide"
// // //         transparent={true}
// // //         onRequestClose={() => setIsEditing(false)}
// // //       >
// // //         <View style={styles.modalOverlay}>
// // //           <View style={styles.modalContainer}>
// // //             <View style={styles.modalHeader}>
// // //               <Text style={styles.modalTitle}>Edit Profile</Text>
// // //               <TouchableOpacity onPress={() => setIsEditing(false)}>
// // //                 <Icon name="close" size={24} color="#282c3f" />
// // //               </TouchableOpacity>
// // //             </View>

// // //             <View style={styles.modalBody}>
// // //               <View style={styles.modalAvatar}>
// // //                 <View style={styles.modalAvatarCircle}>
// // //                   <Text style={styles.modalAvatarText}>
// // //                     {editName ? editName.charAt(0).toUpperCase() : 'U'}
// // //                   </Text>
// // //                 </View>
// // //                 <TouchableOpacity style={styles.modalAvatarEdit}>
// // //                   <Icon name="camera" size={16} color="#fff" />
// // //                 </TouchableOpacity>
// // //               </View>

// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.inputLabel}>Full Name</Text>
// // //                 <TextInput
// // //                   style={styles.input}
// // //                   value={editName}
// // //                   onChangeText={setEditName}
// // //                   placeholder="Enter your name"
// // //                   placeholderTextColor="#999"
// // //                 />
// // //               </View>

// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.inputLabel}>Email</Text>
// // //                 <TextInput
// // //                   style={styles.input}
// // //                   value={editEmail}
// // //                   onChangeText={setEditEmail}
// // //                   placeholder="Enter your email"
// // //                   keyboardType="email-address"
// // //                   autoCapitalize="none"
// // //                   placeholderTextColor="#999"
// // //                 />
// // //               </View>

// // //               <View style={styles.inputGroup}>
// // //                 <Text style={styles.inputLabel}>Phone</Text>
// // //                 <TextInput
// // //                   style={styles.input}
// // //                   value={editPhone}
// // //                   onChangeText={setEditPhone}
// // //                   placeholder="Enter your phone"
// // //                   keyboardType="phone-pad"
// // //                   placeholderTextColor="#999"
// // //                 />
// // //               </View>

// // //               <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
// // //                 <Text style={styles.saveButtonText}>Save Changes</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f8f9fa',
// // //   },
// // //   scrollContent: {
// // //     paddingBottom: 20,
// // //   },

// // //   // Header
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingTop: 12,
// // //     paddingBottom: 16,
// // //     backgroundColor: '#ffffff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   backButton: {
// // //     padding: 4,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   menuButton: {
// // //     padding: 4,
// // //   },

// // //   // 🔥 DROPDOWN STYLES
// // //   dropdownOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(0,0,0,0.4)',
// // //     zIndex: 1000,
// // //   },
// // //   dropdownContainer: {
// // //     position: 'absolute',
// // //     top: 70,
// // //     right: 12,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 16,
// // //     width: width * 0.88,
// // //     maxWidth: 340,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 8 },
// // //     shadowOpacity: 0.2,
// // //     shadowRadius: 20,
// // //     elevation: 12,
// // //   },
// // //   dropdownHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 14,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   dropdownUserInfo: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   dropdownAvatar: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: '#fc8019',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   dropdownAvatarText: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#ffffff',
// // //   },
// // //   dropdownUserName: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   dropdownUserEmail: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 1,
// // //   },
// // //   dropdownItems: {
// // //     paddingVertical: 8,
// // //   },
// // //   dropdownItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //   },
// // //   dropdownItemLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   dropdownItemText: {
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     marginLeft: 14,
// // //     flex: 1,
// // //   },
// // //   dropdownDivider: {
// // //     height: 1,
// // //     backgroundColor: '#f0f0f5',
// // //     marginHorizontal: 16,
// // //   },
// // //   dropdownLogout: {
// // //     marginTop: 4,
// // //     paddingTop: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#f0f0f5',
// // //   },
// // //   dropdownLogoutText: {
// // //     color: '#dc3545',
// // //   },

// // //   // Profile Card
// // //   profileCard: {
// // //     backgroundColor: '#ffffff',
// // //     marginHorizontal: 16,
// // //     marginTop: 16,
// // //     borderRadius: 16,
// // //     padding: 20,
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //     elevation: 3,
// // //   },
// // //   profileImageContainer: {
// // //     position: 'relative',
// // //     marginBottom: 12,
// // //   },
// // //   profileImage: {
// // //     width: 80,
// // //     height: 80,
// // //     borderRadius: 40,
// // //     backgroundColor: '#fc8019',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   profileImageText: {
// // //     fontSize: 32,
// // //     fontWeight: '700',
// // //     color: '#ffffff',
// // //   },
// // //   onlineDot: {
// // //     position: 'absolute',
// // //     bottom: 2,
// // //     right: 2,
// // //     width: 14,
// // //     height: 14,
// // //     borderRadius: 7,
// // //     backgroundColor: '#28a745',
// // //     borderWidth: 2,
// // //     borderColor: '#ffffff',
// // //   },
// // //   profileName: {
// // //     fontSize: 20,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   profileEmail: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //     marginTop: 4,
// // //   },
// // //   profileBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff5ec',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //     marginTop: 8,
// // //   },
// // //   profileBadgeText: {
// // //     fontSize: 12,
// // //     color: '#fc8019',
// // //     marginLeft: 4,
// // //     fontWeight: '500',
// // //   },

// // //   // Quick Stats
// // //   quickStats: {
// // //     flexDirection: 'row',
// // //     paddingHorizontal: 16,
// // //     marginTop: 16,
// // //     gap: 8,
// // //   },
// // //   quickStatItem: {
// // //     flex: 1,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 12,
// // //     padding: 12,
// // //     alignItems: 'center',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   quickStatIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 6,
// // //   },
// // //   quickStatValue: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#282c3f',
// // //   },
// // //   quickStatLabel: {
// // //     fontSize: 10,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },

// // //   // Summary Card
// // //   summaryCard: {
// // //     backgroundColor: '#ffffff',
// // //     marginHorizontal: 16,
// // //     marginTop: 16,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //     elevation: 3,
// // //   },
// // //   summaryTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   summaryGrid: {
// // //     flexDirection: 'row',
// // //     paddingVertical: 8,
// // //   },
// // //   summaryItem: {
// // //     flex: 1,
// // //     alignItems: 'center',
// // //   },
// // //   summaryValue: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: '#282c3f',
// // //   },
// // //   summaryLabel: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 4,
// // //   },
// // //   summaryDivider: {
// // //     width: 1,
// // //     backgroundColor: '#f0f0f5',
// // //   },
// // //   summaryTotal: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingTop: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#f0f0f5',
// // //     marginTop: 8,
// // //   },
// // //   summaryTotalLabel: {
// // //     fontSize: 14,
// // //     color: '#7e808c',
// // //   },
// // //   summaryTotalValue: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#fc8019',
// // //   },

// // //   // Menu
// // //   menuContainer: {
// // //     marginHorizontal: 16,
// // //     marginTop: 16,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 16,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //     elevation: 3,
// // //     overflow: 'hidden',
// // //   },
// // //   menuSectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     paddingHorizontal: 16,
// // //     paddingTop: 14,
// // //     paddingBottom: 4,
// // //   },
// // //   menuList: {
// // //     marginTop: 4,
// // //   },
// // //   menuItem: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 14,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f5f5f5',
// // //   },
// // //   menuItemLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   menuIconContainer: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 12,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 14,
// // //   },
// // //   menuLabel: {
// // //     fontSize: 15,
// // //     color: '#282c3f',
// // //     fontWeight: '500',
// // //   },
// // //   menuSubLabel: {
// // //     fontSize: 11,
// // //     color: '#7e808c',
// // //     marginTop: 1,
// // //   },

// // //   // Logout
// // //   logoutButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginHorizontal: 16,
// // //     marginTop: 20,
// // //     padding: 16,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#ffcdd2',
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   logoutText: {
// // //     fontSize: 16,
// // //     color: '#dc3545',
// // //     marginLeft: 8,
// // //     fontWeight: '500',
// // //   },

// // //   // Footer
// // //   footer: {
// // //     paddingVertical: 30,
// // //     alignItems: 'center',
// // //   },
// // //   footerText: {
// // //     fontSize: 14,
// // //     color: '#93959f',
// // //   },
// // //   footerSub: {
// // //     fontSize: 12,
// // //     color: '#c0c0c0',
// // //     marginTop: 4,
// // //   },

// // //   // Modal
// // //   modalOverlay: {
// // //     flex: 1,
// // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // //     justifyContent: 'flex-end',
// // //   },
// // //   modalContainer: {
// // //     backgroundColor: '#ffffff',
// // //     borderTopLeftRadius: 24,
// // //     borderTopRightRadius: 24,
// // //     paddingHorizontal: 20,
// // //     paddingBottom: 30,
// // //     maxHeight: '80%',
// // //   },
// // //   modalHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingVertical: 16,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   modalTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   modalBody: {
// // //     paddingTop: 20,
// // //   },
// // //   modalAvatar: {
// // //     alignItems: 'center',
// // //     marginBottom: 20,
// // //     position: 'relative',
// // //   },
// // //   modalAvatarCircle: {
// // //     width: 80,
// // //     height: 80,
// // //     borderRadius: 40,
// // //     backgroundColor: '#fc8019',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   modalAvatarText: {
// // //     fontSize: 32,
// // //     fontWeight: '700',
// // //     color: '#ffffff',
// // //   },
// // //   modalAvatarEdit: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     right: 0,
// // //     backgroundColor: '#fc8019',
// // //     width: 32,
// // //     height: 32,
// // //     borderRadius: 16,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderWidth: 2,
// // //     borderColor: '#ffffff',
// // //   },
// // //   inputGroup: {
// // //     marginBottom: 16,
// // //   },
// // //   inputLabel: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //     marginBottom: 6,
// // //   },
// // //   input: {
// // //     borderWidth: 1,
// // //     borderColor: '#e0e0e0',
// // //     borderRadius: 10,
// // //     paddingHorizontal: 14,
// // //     paddingVertical: 12,
// // //     fontSize: 14,
// // //     color: '#282c3f',
// // //     backgroundColor: '#f8f9fa',
// // //   },
// // //   saveButton: {
// // //     backgroundColor: '#fc8019',
// // //     paddingVertical: 14,
// // //     borderRadius: 10,
// // //     alignItems: 'center',
// // //     marginTop: 8,
// // //   },
// // //   saveButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // // });

// // // export default ProfileScreen;
// // import React, { useContext, useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// //   StatusBar,
// //   Alert,
// //   Modal,
// //   TextInput,
// //   FlatList,
// //   TouchableWithoutFeedback,
// //   Dimensions,
// //   Image,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { AuthContext } from '../../context/AuthContext';
// // import { CartContext } from '../../context/CartContext';
// // import { OrderContext } from '../../context/OrderContext';

// // const { width, height } = Dimensions.get('window');

// // interface ProfileScreenProps {
// //   navigation: any;
// // }

// // const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
// //   const { user, logout, updateUser } = useContext(AuthContext);
// //   const { cartItems } = useContext(CartContext);
// //   const { orders } = useContext(OrderContext);
  
// //   const [isEditing, setIsEditing] = useState<boolean>(false);
// //   const [editName, setEditName] = useState<string>('');
// //   const [editEmail, setEditEmail] = useState<string>('');
// //   const [editPhone, setEditPhone] = useState<string>('');
// //   const [showDropdown, setShowDropdown] = useState<boolean>(false);
// //   const [activeTab, setActiveTab] = useState<string>('Profile');

// //   // Calculate dynamic counts
// //   const orderCount = orders?.length || 0;
// //   const deliveredOrders = orders?.filter(o => o.status === 'Delivered').length || 0;
// //   const cancelledOrders = orders?.filter(o => o.status === 'Cancelled').length || 0;
  
// //   const totalSpent = orders?.reduce((sum: number, order: any) => {
// //     if (order.status !== 'Cancelled') {
// //       return sum + order.total;
// //     }
// //     return sum;
// //   }, 0) || 0;

// //   const [favouritesCount, setFavouritesCount] = useState<number>(0);
// //   const [reviewsCount, setReviewsCount] = useState<number>(0);

// //   useEffect(() => {
// //     if (user) {
// //       setEditName(user.name || '');
// //       setEditEmail(user.email || '');
// //       setEditPhone(user.phone || '');
// //     }
// //     loadFavouritesCount();
// //     loadReviewsCount();
// //   }, [user]);

// //   const loadFavouritesCount = async () => {
// //     try {
// //       setFavouritesCount(5);
// //     } catch (error) {
// //       console.error('Failed to load favourites:', error);
// //     }
// //   };

// //   const loadReviewsCount = async () => {
// //     try {
// //       setReviewsCount(3);
// //     } catch (error) {
// //       console.error('Failed to load reviews:', error);
// //     }
// //   };

// //   const handleSaveProfile = async () => {
// //     if (user) {
// //       const updatedUser = {
// //         ...user,
// //         name: editName,
// //         email: editEmail,
// //         phone: editPhone,
// //       };
// //       await updateUser(updatedUser);
// //       setIsEditing(false);
// //       Alert.alert('Success', 'Profile updated successfully!');
// //     }
// //   };

// //   const handleLogout = () => {
// //     Alert.alert(
// //       'Logout',
// //       'Are you sure you want to logout?',
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         { 
// //           text: 'Logout', 
// //           style: 'destructive',
// //           onPress: async () => {
// //             await logout();
// //             navigation.replace('Landing');
// //           }
// //         },
// //       ]
// //     );
// //   };

// //   // 🔥 MENU ITEMS WITH PROPER NAVIGATION
// //   const menuItems = [
// //     { 
// //       id: 1, 
// //       icon: 'person-outline', 
// //       label: 'Edit Profile', 
// //       onPress: () => setIsEditing(true),
// //       color: '#fc8019',
// //       bg: '#fff5ec',
// //       screen: 'EditProfile',
// //     },
// //     { 
// //       id: 2, 
// //       icon: 'card-outline', 
// //       label: 'Payments', 
// //       onPress: () => navigation.navigate('Payments', { 
// //         totalAmount: totalSpent,
// //         orderCount: orderCount,
// //         user: user 
// //       }),
// //       color: '#28a745',
// //       bg: '#e8f5e9',
// //       screen: 'Payments',
// //     },
// //     { 
// //       id: 3, 
// //       icon: 'heart-outline', 
// //       label: 'Favourites', 
// //       onPress: () => navigation.navigate('Favourites', { 
// //         count: favouritesCount,
// //         user: user 
// //       }),
// //       color: '#dc3545',
// //       bg: '#fce4ec',
// //       screen: 'Favourites',
// //     },
// //     { 
// //       id: 4, 
// //       icon: 'location-outline', 
// //       label: 'Addresses', 
// //       onPress: () => navigation.navigate('Addresses', { 
// //         user: user,
// //         from: 'profile' 
// //       }),
// //       color: '#17a2b8',
// //       bg: '#e0f7fa',
// //       screen: 'Addresses',
// //     },
// //     { 
// //       id: 5, 
// //       icon: 'help-circle-outline', 
// //       label: 'Help & Support', 
// //       onPress: () => navigation.navigate('HelpSupport', { 
// //         user: user,
// //         orders: orders 
// //       }),
// //       color: '#6f42c1',
// //       bg: '#f3e5f5',
// //       screen: 'HelpSupport',
// //     },
// //     { 
// //       id: 6, 
// //       icon: 'information-circle-outline', 
// //       label: 'About QuickBite', 
// //       onPress: () => navigation.navigate('About', { 
// //         version: '2.0.0',
// //         user: user 
// //       }),
// //       color: '#17a2b8',
// //       bg: '#e0f7fa',
// //       screen: 'About',
// //     },
// //   ];

// //   // Quick Actions
// //   const quickActions = [
// //     { 
// //       icon: 'restaurant-outline', 
// //       label: 'Orders', 
// //       value: orderCount, 
// //       color: '#fc8019',
// //       onPress: () => navigation.navigate('Orders', { user: user })
// //     },
// //     { 
// //       icon: 'heart-outline', 
// //       label: 'Favourites', 
// //       value: favouritesCount, 
// //       color: '#dc3545',
// //       onPress: () => navigation.navigate('Favourites', { count: favouritesCount })
// //     },
// //     { 
// //       icon: 'chatbubble-outline', 
// //       label: 'Reviews', 
// //       value: reviewsCount, 
// //       color: '#28a745',
// //       onPress: () => navigation.navigate('Reviews', { count: reviewsCount })
// //     },
// //     { 
// //       icon: 'cart-outline', 
// //       label: 'Cart', 
// //       value: cartItems.length, 
// //       color: '#17a2b8',
// //       onPress: () => navigation.navigate('Cart')
// //     },
// //   ];

// //   const renderMenuItem = ({ item }: { item: any }) => (
// //     <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
// //       <View style={styles.menuItemLeft}>
// //         <View style={[styles.menuIconContainer, { backgroundColor: item.bg }]}>
// //           <Icon name={item.icon} size={22} color={item.color} />
// //         </View>
// //         <View>
// //           <Text style={styles.menuLabel}>{item.label}</Text>
// //           <Text style={styles.menuSubLabel}>Tap to view</Text>
// //         </View>
// //       </View>
// //       <Icon name="chevron-forward" size={20} color="#ccc" />
// //     </TouchableOpacity>
// //   );

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
// //       <ScrollView 
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={styles.scrollContent}
// //       >
// //         {/* Header with Back Button */}
// //         <View style={styles.header}>
// //           <TouchableOpacity 
// //             style={styles.backButton}
// //             onPress={() => navigation.goBack()}
// //           >
// //             <Icon name="arrow-back" size={24} color="#282c3f" />
// //           </TouchableOpacity>
// //           <Text style={styles.headerTitle}>Profile</Text>
// //           <TouchableOpacity 
// //             style={styles.menuButton}
// //             onPress={() => setShowDropdown(!showDropdown)}
// //           >
// //             <Icon name={showDropdown ? 'close' : 'ellipsis-vertical'} size={24} color="#282c3f" />
// //           </TouchableOpacity>
// //         </View>

// //         {/* 🔥 DROPDOWN MENU */}
// //         {showDropdown && (
// //           <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
// //             <View style={styles.dropdownOverlay}>
// //               <View style={styles.dropdownContainer}>
// //                 <View style={styles.dropdownHeader}>
// //                   <View style={styles.dropdownUserInfo}>
// //                     <View style={styles.dropdownAvatar}>
// //                       <Text style={styles.dropdownAvatarText}>
// //                         {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
// //                       </Text>
// //                     </View>
// //                     <View>
// //                       <Text style={styles.dropdownUserName}>{user?.name || 'User'}</Text>
// //                       <Text style={styles.dropdownUserEmail}>{user?.email || 'user@email.com'}</Text>
// //                     </View>
// //                   </View>
// //                   <TouchableOpacity onPress={() => setShowDropdown(false)}>
// //                     <Icon name="close" size={22} color="#7e808c" />
// //                   </TouchableOpacity>
// //                 </View>

// //                 <View style={styles.dropdownItems}>
// //                   <TouchableOpacity 
// //                     style={styles.dropdownItem}
// //                     onPress={() => {
// //                       setShowDropdown(false);
// //                       setIsEditing(true);
// //                     }}
// //                   >
// //                     <View style={styles.dropdownItemLeft}>
// //                       <Icon name="person-outline" size={20} color="#fc8019" />
// //                       <Text style={styles.dropdownItemText}>Edit Profile</Text>
// //                     </View>
// //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// //                   </TouchableOpacity>

// //                   <TouchableOpacity 
// //                     style={styles.dropdownItem}
// //                     onPress={() => {
// //                       setShowDropdown(false);
// //                       navigation.navigate('Orders');
// //                     }}
// //                   >
// //                     <View style={styles.dropdownItemLeft}>
// //                       <Icon name="clipboard-outline" size={20} color="#17a2b8" />
// //                       <Text style={styles.dropdownItemText}>My Orders</Text>
// //                     </View>
// //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// //                   </TouchableOpacity>

// //                   <TouchableOpacity 
// //                     style={styles.dropdownItem}
// //                     onPress={() => {
// //                       setShowDropdown(false);
// //                       navigation.navigate('Payments');
// //                     }}
// //                   >
// //                     <View style={styles.dropdownItemLeft}>
// //                       <Icon name="card-outline" size={20} color="#28a745" />
// //                       <Text style={styles.dropdownItemText}>Payments</Text>
// //                     </View>
// //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// //                   </TouchableOpacity>

// //                   <TouchableOpacity 
// //                     style={styles.dropdownItem}
// //                     onPress={() => {
// //                       setShowDropdown(false);
// //                       navigation.navigate('Addresses');
// //                     }}
// //                   >
// //                     <View style={styles.dropdownItemLeft}>
// //                       <Icon name="location-outline" size={20} color="#17a2b8" />
// //                       <Text style={styles.dropdownItemText}>Addresses</Text>
// //                     </View>
// //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// //                   </TouchableOpacity>

// //                   <TouchableOpacity 
// //                     style={styles.dropdownItem}
// //                     onPress={() => {
// //                       setShowDropdown(false);
// //                       navigation.navigate('Settings');
// //                     }}
// //                   >
// //                     <View style={styles.dropdownItemLeft}>
// //                       <Icon name="settings-outline" size={20} color="#6f42c1" />
// //                       <Text style={styles.dropdownItemText}>Settings</Text>
// //                     </View>
// //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// //                   </TouchableOpacity>

// //                   <View style={styles.dropdownDivider} />

// //                   <TouchableOpacity 
// //                     style={[styles.dropdownItem, styles.dropdownLogout]}
// //                     onPress={handleLogout}
// //                   >
// //                     <View style={styles.dropdownItemLeft}>
// //                       <Icon name="log-out-outline" size={20} color="#dc3545" />
// //                       <Text style={[styles.dropdownItemText, styles.dropdownLogoutText]}>Logout</Text>
// //                     </View>
// //                     <Icon name="chevron-forward" size={16} color="#ccc" />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             </View>
// //           </TouchableWithoutFeedback>
// //         )}

// //         {/* Profile Card */}
// //         <View style={styles.profileCard}>
// //           <View style={styles.profileImageContainer}>
// //             <View style={styles.profileImage}>
// //               <Text style={styles.profileImageText}>
// //                 {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
// //               </Text>
// //             </View>
// //             <View style={styles.onlineDot} />
// //           </View>
// //           <Text style={styles.profileName}>{user?.name || 'User'}</Text>
// //           <Text style={styles.profileEmail}>{user?.email || 'user@email.com'}</Text>
// //           <View style={styles.profileBadge}>
// //             <Icon name="shield-checkmark" size={14} color="#fc8019" />
// //             <Text style={styles.profileBadgeText}>Verified Member</Text>
// //           </View>
// //         </View>

// //         {/* Quick Stats */}
// //         <View style={styles.quickStats}>
// //           {quickActions.map((item, index) => (
// //             <TouchableOpacity 
// //               key={index} 
// //               style={styles.quickStatItem}
// //               onPress={item.onPress}
// //             >
// //               <View style={[styles.quickStatIcon, { backgroundColor: item.color + '15' }]}>
// //                 <Icon name={item.icon} size={22} color={item.color} />
// //               </View>
// //               <Text style={styles.quickStatValue}>{item.value}</Text>
// //               <Text style={styles.quickStatLabel}>{item.label}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         {/* Order Summary Card */}
// //         <View style={styles.summaryCard}>
// //           <Text style={styles.summaryTitle}>Order Summary</Text>
// //           <View style={styles.summaryGrid}>
// //             <TouchableOpacity 
// //               style={styles.summaryItem}
// //               onPress={() => navigation.navigate('Orders')}
// //             >
// //               <Text style={styles.summaryValue}>{orderCount}</Text>
// //               <Text style={styles.summaryLabel}>Total Orders</Text>
// //             </TouchableOpacity>
// //             <View style={styles.summaryDivider} />
// //             <TouchableOpacity 
// //               style={styles.summaryItem}
// //               onPress={() => navigation.navigate('Orders', { filter: 'Delivered' })}
// //             >
// //               <Text style={[styles.summaryValue, { color: '#28a745' }]}>{deliveredOrders}</Text>
// //               <Text style={styles.summaryLabel}>Delivered</Text>
// //             </TouchableOpacity>
// //             <View style={styles.summaryDivider} />
// //             <TouchableOpacity 
// //               style={styles.summaryItem}
// //               onPress={() => navigation.navigate('Orders', { filter: 'Cancelled' })}
// //             >
// //               <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{cancelledOrders}</Text>
// //               <Text style={styles.summaryLabel}>Cancelled</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <View style={styles.summaryTotal}>
// //             <Text style={styles.summaryTotalLabel}>Total Spent</Text>
// //             <Text style={styles.summaryTotalValue}>₹{totalSpent}</Text>
// //           </View>
// //         </View>

// //         {/* Menu Items */}
// //         <View style={styles.menuContainer}>
// //           <Text style={styles.menuSectionTitle}>Quick Actions</Text>
// //           <FlatList
// //             data={menuItems}
// //             renderItem={renderMenuItem}
// //             keyExtractor={(item) => item.id.toString()}
// //             scrollEnabled={false}
// //             style={styles.menuList}
// //           />
// //         </View>

// //         {/* Logout Button */}
// //         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
// //           <Icon name="log-out-outline" size={22} color="#dc3545" />
// //           <Text style={styles.logoutText}>Logout</Text>
// //         </TouchableOpacity>

// //         <View style={styles.footer}>
// //           <Text style={styles.footerText}>QuickBite v2.0.0</Text>
// //           <Text style={styles.footerSub}>Delivering happiness to your doorstep ❤️</Text>
// //         </View>
// //       </ScrollView>

// //       {/* Edit Profile Modal */}
// //       <Modal
// //         visible={isEditing}
// //         animationType="slide"
// //         transparent={true}
// //         onRequestClose={() => setIsEditing(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContainer}>
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>Edit Profile</Text>
// //               <TouchableOpacity onPress={() => setIsEditing(false)}>
// //                 <Icon name="close" size={24} color="#282c3f" />
// //               </TouchableOpacity>
// //             </View>

// //             <View style={styles.modalBody}>
// //               <View style={styles.modalAvatar}>
// //                 <View style={styles.modalAvatarCircle}>
// //                   <Text style={styles.modalAvatarText}>
// //                     {editName ? editName.charAt(0).toUpperCase() : 'U'}
// //                   </Text>
// //                 </View>
// //                 <TouchableOpacity style={styles.modalAvatarEdit}>
// //                   <Icon name="camera" size={16} color="#fff" />
// //                 </TouchableOpacity>
// //               </View>

// //               <View style={styles.inputGroup}>
// //                 <Text style={styles.inputLabel}>Full Name</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   value={editName}
// //                   onChangeText={setEditName}
// //                   placeholder="Enter your name"
// //                   placeholderTextColor="#999"
// //                 />
// //               </View>

// //               <View style={styles.inputGroup}>
// //                 <Text style={styles.inputLabel}>Email</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   value={editEmail}
// //                   onChangeText={setEditEmail}
// //                   placeholder="Enter your email"
// //                   keyboardType="email-address"
// //                   autoCapitalize="none"
// //                   placeholderTextColor="#999"
// //                 />
// //               </View>

// //               <View style={styles.inputGroup}>
// //                 <Text style={styles.inputLabel}>Phone</Text>
// //                 <TextInput
// //                   style={styles.input}
// //                   value={editPhone}
// //                   onChangeText={setEditPhone}
// //                   placeholder="Enter your phone"
// //                   keyboardType="phone-pad"
// //                   placeholderTextColor="#999"
// //                 />
// //               </View>

// //               <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
// //                 <Text style={styles.saveButtonText}>Save Changes</Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   scrollContent: {
// //     paddingBottom: 20,
// //   },

// //   // Header
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingTop: 12,
// //     paddingBottom: 16,
// //     backgroundColor: '#ffffff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   backButton: {
// //     padding: 4,
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   menuButton: {
// //     padding: 4,
// //   },

// //   // 🔥 DROPDOWN STYLES
// //   dropdownOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(0,0,0,0.4)',
// //     zIndex: 1000,
// //   },
// //   dropdownContainer: {
// //     position: 'absolute',
// //     top: 70,
// //     right: 12,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 16,
// //     width: width * 0.88,
// //     maxWidth: 340,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 8 },
// //     shadowOpacity: 0.2,
// //     shadowRadius: 20,
// //     elevation: 12,
// //   },
// //   dropdownHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 14,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   dropdownUserInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   dropdownAvatar: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#fc8019',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   dropdownAvatarText: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   dropdownUserName: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   dropdownUserEmail: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 1,
// //   },
// //   dropdownItems: {
// //     paddingVertical: 8,
// //   },
// //   dropdownItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //   },
// //   dropdownItemLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   dropdownItemText: {
// //     fontSize: 14,
// //     color: '#282c3f',
// //     marginLeft: 14,
// //     flex: 1,
// //   },
// //   dropdownDivider: {
// //     height: 1,
// //     backgroundColor: '#f0f0f5',
// //     marginHorizontal: 16,
// //   },
// //   dropdownLogout: {
// //     marginTop: 4,
// //     paddingTop: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f0f0f5',
// //   },
// //   dropdownLogoutText: {
// //     color: '#dc3545',
// //   },

// //   // Profile Card
// //   profileCard: {
// //     backgroundColor: '#ffffff',
// //     marginHorizontal: 16,
// //     marginTop: 16,
// //     borderRadius: 16,
// //     padding: 20,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //     elevation: 3,
// //   },
// //   profileImageContainer: {
// //     position: 'relative',
// //     marginBottom: 12,
// //   },
// //   profileImage: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     backgroundColor: '#fc8019',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   profileImageText: {
// //     fontSize: 32,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   onlineDot: {
// //     position: 'absolute',
// //     bottom: 2,
// //     right: 2,
// //     width: 14,
// //     height: 14,
// //     borderRadius: 7,
// //     backgroundColor: '#28a745',
// //     borderWidth: 2,
// //     borderColor: '#ffffff',
// //   },
// //   profileName: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   profileEmail: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //     marginTop: 4,
// //   },
// //   profileBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff5ec',
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     marginTop: 8,
// //   },
// //   profileBadgeText: {
// //     fontSize: 12,
// //     color: '#fc8019',
// //     marginLeft: 4,
// //     fontWeight: '500',
// //   },

// //   // Quick Stats
// //   quickStats: {
// //     flexDirection: 'row',
// //     paddingHorizontal: 16,
// //     marginTop: 16,
// //     gap: 8,
// //   },
// //   quickStatItem: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     padding: 12,
// //     alignItems: 'center',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   quickStatIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 6,
// //   },
// //   quickStatValue: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#282c3f',
// //   },
// //   quickStatLabel: {
// //     fontSize: 10,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },

// //   // Summary Card
// //   summaryCard: {
// //     backgroundColor: '#ffffff',
// //     marginHorizontal: 16,
// //     marginTop: 16,
// //     borderRadius: 16,
// //     padding: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //     elevation: 3,
// //   },
// //   summaryTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },
// //   summaryGrid: {
// //     flexDirection: 'row',
// //     paddingVertical: 8,
// //   },
// //   summaryItem: {
// //     flex: 1,
// //     alignItems: 'center',
// //   },
// //   summaryValue: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#282c3f',
// //   },
// //   summaryLabel: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 4,
// //   },
// //   summaryDivider: {
// //     width: 1,
// //     backgroundColor: '#f0f0f5',
// //   },
// //   summaryTotal: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingTop: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f0f0f5',
// //     marginTop: 8,
// //   },
// //   summaryTotalLabel: {
// //     fontSize: 14,
// //     color: '#7e808c',
// //   },
// //   summaryTotalValue: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#fc8019',
// //   },

// //   // Menu
// //   menuContainer: {
// //     marginHorizontal: 16,
// //     marginTop: 16,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //     elevation: 3,
// //     overflow: 'hidden',
// //   },
// //   menuSectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     paddingHorizontal: 16,
// //     paddingTop: 14,
// //     paddingBottom: 4,
// //   },
// //   menuList: {
// //     marginTop: 4,
// //   },
// //   menuItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 14,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f5f5f5',
// //   },
// //   menuItemLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   menuIconContainer: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 14,
// //   },
// //   menuLabel: {
// //     fontSize: 15,
// //     color: '#282c3f',
// //     fontWeight: '500',
// //   },
// //   menuSubLabel: {
// //     fontSize: 11,
// //     color: '#7e808c',
// //     marginTop: 1,
// //   },

// //   // Logout
// //   logoutButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginHorizontal: 16,
// //     marginTop: 20,
// //     padding: 16,
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#ffcdd2',
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   logoutText: {
// //     fontSize: 16,
// //     color: '#dc3545',
// //     marginLeft: 8,
// //     fontWeight: '500',
// //   },

// //   // Footer
// //   footer: {
// //     paddingVertical: 30,
// //     alignItems: 'center',
// //   },
// //   footerText: {
// //     fontSize: 14,
// //     color: '#93959f',
// //   },
// //   footerSub: {
// //     fontSize: 12,
// //     color: '#c0c0c0',
// //     marginTop: 4,
// //   },

// //   // Modal
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //     justifyContent: 'flex-end',
// //   },
// //   modalContainer: {
// //     backgroundColor: '#ffffff',
// //     borderTopLeftRadius: 24,
// //     borderTopRightRadius: 24,
// //     paddingHorizontal: 20,
// //     paddingBottom: 30,
// //     maxHeight: '80%',
// //   },
// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 16,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   modalBody: {
// //     paddingTop: 20,
// //   },
// //   modalAvatar: {
// //     alignItems: 'center',
// //     marginBottom: 20,
// //     position: 'relative',
// //   },
// //   modalAvatarCircle: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     backgroundColor: '#fc8019',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   modalAvatarText: {
// //     fontSize: 32,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   modalAvatarEdit: {
// //     position: 'absolute',
// //     bottom: 0,
// //     right: 0,
// //     backgroundColor: '#fc8019',
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: '#ffffff',
// //   },
// //   inputGroup: {
// //     marginBottom: 16,
// //   },
// //   inputLabel: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //     marginBottom: 6,
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: '#e0e0e0',
// //     borderRadius: 10,
// //     paddingHorizontal: 14,
// //     paddingVertical: 12,
// //     fontSize: 14,
// //     color: '#282c3f',
// //     backgroundColor: '#f8f9fa',
// //   },
// //   saveButton: {
// //     backgroundColor: '#fc8019',
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginTop: 8,
// //   },
// //   saveButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });

// // export default ProfileScreen;
// // delivery-app/src/screens/main/ProfileScreen.tsx
// import React, { useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../../context/AuthContext';
// import { colors } from '../../constants/colors';

// const ProfileScreen = ({ navigation }: any) => {
//   const { user, logout } = useContext(AuthContext);

//   const handleLogout = async () => {
//     await logout();
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile</Text>
//         <TouchableOpacity onPress={handleLogout}>
//           <Icon name="log-out-outline" size={24} color={colors.danger} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.profileInfo}>
//         <Icon name="person-circle" size={80} color={colors.primary} />
//         <Text style={styles.name}>{user?.name || 'User'}</Text>
//         <Text style={styles.email}>{user?.email || 'No email'}</Text>
//         <Text style={styles.role}>Role: {user?.role || 'User'}</Text>
//       </View>

//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Icon name="log-out-outline" size={20} color="#fff" />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
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
//     color: colors.text,
//     textAlign: 'center',
//     marginRight: 24,
//   },
//   profileInfo: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.text,
//     marginTop: 12,
//   },
//   email: {
//     fontSize: 16,
//     color: colors.textLight,
//     marginTop: 4,
//   },
//   role: {
//     fontSize: 14,
//     color: colors.textLight,
//     marginTop: 4,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.danger || '#ff4444',
//     marginHorizontal: 20,
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 20,
//   },
//   logoutText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

// export default ProfileScreen;
// delivery-app/src/screens/main/ProfileScreen.tsx (Simpler Version)
// import React, { useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../../context/AuthContext';
// import { colors } from '../../constants/colors';

// const ProfileScreen = ({ navigation }: any) => {
//   const { user, logout } = useContext(AuthContext);

//   const handleLogout = async () => {
//     await logout();
//     navigation.reset({
//       index: 0,
//       routes: [{ name: 'Login' }],
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile</Text>
//         <TouchableOpacity onPress={handleLogout}>
//           <Icon name="log-out-outline" size={24} color={colors.danger} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.profileInfo}>
//         <Icon name="person-circle" size={80} color={colors.primary} />
//         <Text style={styles.name}>{user?.name || 'User'}</Text>
//         <Text style={styles.email}>{user?.email || 'No email'}</Text>
//         <Text style={styles.role}>Role: {user?.role || 'User'}</Text>
//       </View>

//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Icon name="log-out-outline" size={20} color="#fff" />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
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
//     color: colors.text,
//     textAlign: 'center',
//     marginRight: 24,
//   },
//   profileInfo: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: colors.text,
//     marginTop: 12,
//   },
//   email: {
//     fontSize: 16,
//     color: colors.textLight,
//     marginTop: 4,
//   },
//   role: {
//     fontSize: 14,
//     color: colors.textLight,
//     marginTop: 4,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: colors.danger || '#ff4444',
//     marginHorizontal: 20,
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginTop: 20,
//   },
//   logoutText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
// });

// export default ProfileScreen;