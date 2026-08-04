// // import React from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { AuthProvider } from './src/context/AuthContext';
// // import { CartProvider } from './src/context/CartContext';
// // import { OrderProvider } from './src/context/OrderContext';
// // import AppNavigator from './src/navigation/AppNavigator';

// // const App: React.FC = () => {
// //   return (
// //     <SafeAreaProvider>
// //       <AuthProvider>
// //         <CartProvider>
// //           <OrderProvider>
// //             <NavigationContainer>
// //               <AppNavigator />
// //             </NavigationContainer>
// //           </OrderProvider>
// //         </CartProvider>
// //       </AuthProvider>
// //     </SafeAreaProvider>
// //   );
// // };

// // export default App;
// import React from 'react';
// import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { AuthProvider } from './src/context/AuthContext';
// import { CartProvider } from './src/context/CartContext';
// import { OrderProvider } from './src/context/OrderContext';
// import AppNavigator from './src/navigation/AppNavigator';

// const linking: LinkingOptions<any> = {
//   prefixes: [],
//   config: {
//     screens: {
//       Login: 'login',
//       Signup: 'signup',
//       Home: 'home',
//       Search: 'search',
//       RestaurantDetail: 'restaurant',
//       Cart: 'cart',
//       Profile: 'profile',
//     },
//   },
// };

// const App: React.FC = () => {
//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <CartProvider>
//           <OrderProvider>
//             <NavigationContainer linking={linking}>
//               <AppNavigator />
//             </NavigationContainer>
//           </OrderProvider>
//         </CartProvider>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// };

// export default App;
// // // import React from 'react';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // import { NavigationContainer } from '@react-navigation/native';
// // // import { AuthProvider } from './src/context/AuthContext';
// // // import { CartProvider } from './src/context/CartContext';
// // // import { OrderProvider } from './src/context/OrderContext';
// // // import TabNavigator from './src/navigation/TabNavigator';

// // // const App: React.FC = () => {
// // //   return (
// // //     <SafeAreaProvider>
// // //       <AuthProvider>
// // //         <CartProvider>
// // //           <OrderProvider>
// // //             <NavigationContainer>
// // //               <TabNavigator />
// // //             </NavigationContainer>
// // //           </OrderProvider>
// // //         </CartProvider>
// // //       </AuthProvider>
// // //     </SafeAreaProvider>
// // //   );
// // // };

// // // export default App;
// // import React from 'react';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { AuthProvider } from './src/context/AuthContext';
// // import { CartProvider } from './src/context/CartContext';
// // import { OrderProvider } from './src/context/OrderContext';
// // import AppNavigator from './src/navigation/AppNavigator';

// // const App: React.FC = () => {
// //   return (
// //     <SafeAreaProvider>
// //       <AuthProvider>
// //         <CartProvider>
// //           <OrderProvider>
// //             <AppNavigator />
// //           </OrderProvider>
// //         </CartProvider>
// //       </AuthProvider>
// //     </SafeAreaProvider>
// //   );
// // };

// // export default App;
// // import React from 'react';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { AuthProvider } from './src/context/AuthContext';
// // import { CartProvider } from './src/context/CartContext';
// // import { OrderProvider } from './src/context/OrderContext';
// // import AppNavigator from './src/navigation/AppNavigator';

// // const App: React.FC = () => {
// //   return (
// //     <SafeAreaProvider>
// //       <AuthProvider>
// //         <CartProvider>
// //           <OrderProvider>
// //             <AppNavigator />
// //           </OrderProvider>
// //         </CartProvider>
// //       </AuthProvider>
// //     </SafeAreaProvider>
// //   );
// // };

// // export default App;




import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { AddressProvider } from './src/context/AddressContext';

import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AddressProvider>
        <CartProvider>
          <OrderProvider>
            <AppNavigator />
          </OrderProvider>
        </CartProvider>
                </AddressProvider>

      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;