// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   ActivityIndicator,
//   FlatList,
//   TextInput,
//   SafeAreaView,
//   Modal,
//   TouchableWithoutFeedback,
//   Dimensions,
//   Platform,
//   useWindowDimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';
// import { CartContext } from '../../context/CartContext';
// import { AuthContext } from '../../context/AuthContext';
// import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';
// import axios from 'axios';
// import { API_URL } from '@env';

// const CompatibleFlatList: any = FlatList;

// const { width } = Dimensions.get('window');
// const DESKTOP_BREAKPOINT = 768;

// // --------------------------------------------------
// // PREMIUM DESIGN TOKENS
// // --------------------------------------------------

// const PALETTE = {
//   primary: '#6C5CE7',
//   primaryDark: '#5541D7',
//   lightPurple: '#F1EEFF',
//   softPurple: '#EDE9FE',
//   white: '#FFFFFF',
//   text: '#1E1B2E',
//   textSecondary: '#8A85A0',
//   background: '#FAFAFD',
//   border: '#EFEDF7',
//   success: '#22C55E',
// };

// const FONT_FAMILY = 'Times New Roman';

// // Maps the icon name saved in POS to an Ionicons name
// const getHighlightIconName = (icon: string) => {
//   const iconMap: Record<string, string> = {
//     flash: 'flash-outline',
//     time: 'time-outline',
//     shield: 'shield-checkmark-outline',
//     cube: 'cube-outline',
//     heart: 'heart-outline',
//     truck: 'car-outline',
//   };

//   return iconMap[icon] || 'star-outline';
// };

// export default function ProductListScreen({
//   route,
//   navigation,
// }: any) {
//   const { storeId, storeName } = route.params || {};

//   const { width: windowWidth } = useWindowDimensions();

//   const isDesktopWeb =
//     Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

//   // --------------------------------------------------
//   // CARD / GRID SIZING
//   // --------------------------------------------------

//   const availableWidth = windowWidth - 32;
//   const CARD_GAP = 16;
//   const MIN_CARD_WIDTH = 200;

//   const numColumns = !isDesktopWeb
//     ? 2
//     : Math.max(
//         2,
//         Math.floor(
//           (availableWidth + CARD_GAP) /
//             (MIN_CARD_WIDTH + CARD_GAP)
//         )
//       );

//   const cardWidth =
//     (availableWidth -
//       CARD_GAP * (numColumns - 1)) /
//     numColumns;

//   // --------------------------------------------------
//   // PRODUCT STATES
//   // --------------------------------------------------

//   const [products, setProducts] = useState<any[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedStoreId, setSelectedStoreId] =
//     useState<number | null>(storeId || null);

//   const [selectedCategory, setSelectedCategory] =
//     useState<string | null>('All');

//   const [categories, setCategories] =
//     useState<string[]>(['All']);

//   // --------------------------------------------------
//   // FILTER STATES
//   // --------------------------------------------------

//   const [filterSidebarVisible, setFilterSidebarVisible] =
//     useState<boolean>(false);

//   const [tempSelectedCategory, setTempSelectedCategory] =
//     useState<string | null>('All');

//   const [priceRange, setPriceRange] = useState<{
//     min: string;
//     max: string;
//   }>({
//     min: '',
//     max: '',
//   });

//   const [sortBy, setSortBy] =
//     useState<string>('default');

//   const [showInStock, setShowInStock] =
//     useState<boolean>(false);

//   // --------------------------------------------------
//   // SEARCH STATES
//   // --------------------------------------------------

//   const [showSearch, setShowSearch] =
//     useState<boolean>(false);

//   const [searchQuery, setSearchQuery] =
//     useState<string>('');

//   // --------------------------------------------------
//   // BUSINESS STATES
//   // --------------------------------------------------

//   const [businessDescription, setBusinessDescription] =
//     useState<string>('');

//   const [loadingBusiness, setLoadingBusiness] =
//     useState<boolean>(true);

//   const [serviceHighlights, setServiceHighlights] =
//     useState<any[]>([]);

//   // --------------------------------------------------
//   // CONTEXT
//   // --------------------------------------------------

//   const { user } = useContext(AuthContext);

//   const { setSelectedBusiness } =
//     useContext(SelectedBusinessContext);

//   const {
//     cartItems,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//   } = useContext(CartContext);

//   // --------------------------------------------------
//   // LOAD PRODUCTS
//   // --------------------------------------------------

//   useEffect(() => {
//     if (!storeId) {
//       setLoading(false);
//       setError('No store selected');
//       return;
//     }

//     setSelectedStoreId(storeId);

//     if (storeName) {
//       setSelectedBusiness({
//         id: storeId,
//         name: storeName,
//       });
//     }

//     loadProducts(storeId);
//   }, [storeId]);

//   // --------------------------------------------------
//   // FETCH BUSINESS DETAILS
//   // --------------------------------------------------

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       if (!storeId) return;

//       try {
//         setLoadingBusiness(true);

//         const url = `${API_URL}/public/businesses`;

//         const response = await axios.get(url);

//         const businessesData =
//           response.data?.data || [];

//         const currentStore =
//           businessesData.find(
//             (b: any) =>
//               Number(b.id) === Number(storeId)
//           );

//         if (currentStore) {
//           setBusinessDescription(
//             currentStore.description || ''
//           );
//         }
//       } catch (err) {
//         console.error(
//           'Error fetching business details:',
//           err
//         );
//       } finally {
//         setLoadingBusiness(false);
//       }
//     };

//     if (storeId) {
//       fetchBusinessDetails();
//     }
//   }, [storeId]);

//   // --------------------------------------------------
//   // FETCH SERVICE HIGHLIGHTS
//   // --------------------------------------------------

//   useEffect(() => {
//     const fetchServiceHighlights = async () => {
//       if (!storeId) return;

//       try {
//         const url =
//           `${API_URL}/public/businesses/` +
//           `${storeId}/service-highlights`;

//         const response = await axios.get(url);

//         let highlightsData: any[] = [];

//         if (Array.isArray(response.data)) {
//           highlightsData = response.data;
//         } else if (
//           response.data?.data &&
//           Array.isArray(response.data.data)
//         ) {
//           highlightsData = response.data.data;
//         }

//         setServiceHighlights(highlightsData);
//       } catch (err) {
//         console.error(
//           'Error fetching service highlights:',
//           err
//         );

//         setServiceHighlights([]);
//       }
//     };

//     if (storeId) {
//       fetchServiceHighlights();
//     }
//   }, [storeId]);

//   // --------------------------------------------------
//   // LOAD PRODUCTS API
//   // --------------------------------------------------

//   const loadProducts = async (
//     businessId: number
//   ) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const url =
//         `${API_URL}/public/products` +
//         `?business_id=${businessId}`;

//       const response = await axios.get(url);

//       let productsData: any[] = [];

//       if (Array.isArray(response.data)) {
//         productsData = response.data;
//       } else if (
//         response.data?.data &&
//         Array.isArray(response.data.data)
//       ) {
//         productsData = response.data.data;
//       } else if (
//         response.data?.products &&
//         Array.isArray(response.data.products)
//       ) {
//         productsData = response.data.products;
//       }

//       setProducts(productsData);
//       setFilteredProducts(productsData);

//       const uniqueCategories: string[] = ['All'];
//       const categorySet = new Set<string>();

//       productsData.forEach((product: any) => {
//         if (product.category) {
//           categorySet.add(product.category);
//         }
//       });

//       uniqueCategories.push(
//         ...Array.from(categorySet)
//       );

//       setCategories(uniqueCategories);

//       if (productsData.length === 0) {
//         setError(
//           'No products available for this store'
//         );
//       }
//     } catch (err: any) {
//       console.error(
//         '❌ Error loading products:',
//         err
//       );

//       setError(
//         err.message || 'Failed to load products'
//       );

//       setProducts([]);
//       setFilteredProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------------------------
//   // SEARCH / FILTER / SORT PIPELINE
//   // --------------------------------------------------

//   useEffect(() => {
//     const filterProducts = () => {
//       let filtered = [...products];

//       // SEARCH
//       if (searchQuery.trim().length > 0) {
//         const query =
//           searchQuery.toLowerCase().trim();

//         filtered = filtered.filter(
//           (product) => {
//             const name =
//               (product.name || '').toLowerCase();

//             const category =
//               (product.category || '').toLowerCase();

//             const description =
//               (product.description || '').toLowerCase();

//             const brand =
//               (product.brand || '').toLowerCase();

//             return (
//               name.startsWith(query) ||
//               category.startsWith(query) ||
//               description.startsWith(query) ||
//               brand.startsWith(query)
//             );
//           }
//         );
//       }

//       // CATEGORY
//       else if (
//         selectedCategory !== 'All' &&
//         selectedCategory
//       ) {
//         filtered = filtered.filter(
//           (product) =>
//             product.category === selectedCategory
//         );
//       }

//       // MIN PRICE
//       if (priceRange.min) {
//         const minPrice =
//           parseFloat(priceRange.min);

//         filtered = filtered.filter(
//           (product) =>
//             (product.selling_price || 0) >=
//             minPrice
//         );
//       }

//       // MAX PRICE
//       if (priceRange.max) {
//         const maxPrice =
//           parseFloat(priceRange.max);

//         filtered = filtered.filter(
//           (product) =>
//             (product.selling_price || 0) <=
//             maxPrice
//         );
//       }

//       // STOCK
//       if (showInStock) {
//         filtered = filtered.filter(
//           (product) =>
//             (product.stock_qty || 0) > 0
//         );
//       }

//       // SORT
//       if (sortBy === 'price_low') {
//         filtered.sort(
//           (a, b) =>
//             (a.selling_price || 0) -
//             (b.selling_price || 0)
//         );
//       } else if (sortBy === 'price_high') {
//         filtered.sort(
//           (a, b) =>
//             (b.selling_price || 0) -
//             (a.selling_price || 0)
//         );
//       } else if (sortBy === 'name_asc') {
//         filtered.sort(
//           (a, b) =>
//             (a.name || '').localeCompare(
//               b.name || ''
//             )
//         );
//       } else if (sortBy === 'name_desc') {
//         filtered.sort(
//           (a, b) =>
//             (b.name || '').localeCompare(
//               a.name || ''
//             )
//         );
//       }

//       setFilteredProducts(filtered);
//     };

//     filterProducts();
//   }, [
//     searchQuery,
//     selectedCategory,
//     products,
//     priceRange,
//     showInStock,
//     sortBy,
//   ]);

//   // --------------------------------------------------
//   // FILTER ACTIONS
//   // --------------------------------------------------

//   const applyFilters = () => {
//     setSelectedCategory(
//       tempSelectedCategory
//     );

//     setFilterSidebarVisible(false);
//   };

//   const resetFilters = () => {
//     setTempSelectedCategory('All');
//     setPriceRange({
//       min: '',
//       max: '',
//     });
//     setSortBy('default');
//     setShowInStock(false);
//     setSelectedCategory('All');
//     setFilterSidebarVisible(false);
//   };

//   // --------------------------------------------------
//   // SEARCH
//   // --------------------------------------------------

//   const toggleSearch = () => {
//     setShowSearch(!showSearch);

//     if (showSearch) {
//       setSearchQuery('');
//     }
//   };

//   // --------------------------------------------------
//   // CART FUNCTIONS
//   // --------------------------------------------------

//   const isItemInCart = (
//     productId: string | number
//   ) =>
//     cartItems.some(
//       (item) =>
//         item.id === String(productId) &&
//         item.restaurantId ===
//           String(selectedStoreId)
//     );

//   const getItemQuantity = (
//     productId: string | number
//   ) => {
//     const item = cartItems.find(
//       (cartItem) =>
//         cartItem.id === String(productId) &&
//         cartItem.restaurantId ===
//           String(selectedStoreId)
//     );

//     return item ? item.quantity : 0;
//   };

//   // --------------------------------------------------
//   // ADD TO CART
//   // --------------------------------------------------

//   const handleAddToCart = (
//     product: any
//   ) => {
//     if (!selectedStoreId) {
//       Alert.alert(
//         'Error',
//         'No store selected'
//       );

//       return;
//     }

//     const cartItem = {
//       id: String(product.id),
//       name: product.name,
//       price: Number(
//         product.selling_price || 0
//       ),
//       quantity: 1,
//       image:
//         product.image ||
//         'https://placehold.co/150x150',
//       restaurantId:
//         String(selectedStoreId),
//       restaurantName:
//         storeName || 'Store',
//       gst_rate: Number(
//         product.gst_rate || 0
//       ),
//     };

//     const restaurantData = {
//       id: String(selectedStoreId),
//       name: storeName || 'Store',
//       rating: 4.5,
//       deliveryTime: 'In Stock',
//       cuisine:
//         product.category || 'General',
//       image:
//         product.image ||
//         'https://placehold.co/150x150',
//       costForTwo:
//         `₹${product.selling_price}`,
//       address:
//         product.description ||
//         'Available in stock',
//       isVeg: true,
//       offer:
//         `Stock: ${product.stock_qty || 0} units`,

//       productData: {
//         id: String(product.id),
//         price: Number(
//           product.selling_price || 0
//         ),
//         stock: Number(
//           product.stock_qty || 0
//         ),
//         category: product.category,
//         description:
//           product.description,
//         brand: product.brand,
//         vendor: product.vendor,
//         gst:
//           product.gst_rate || 0,
//         unit: product.unit,
//         barcode: product.barcode,
//         sku: product.sku,
//         image: product.image,
//         name: product.name,
//       },
//     };

//     addToCart(
//       cartItem,
//       restaurantData
//     );

//     Alert.alert(
//       'Added to Cart',
//       `${product.name} added to cart!`
//     );
//   };

//   // --------------------------------------------------
//   // UPDATE QUANTITY
//   // --------------------------------------------------

//   const handleUpdateQuantity = (
//     product: any,
//     newQuantity: number
//   ) => {
//     if (!selectedStoreId) return;

//     const productId =
//       String(product.id);

//     const shopId =
//       String(selectedStoreId);

//     if (newQuantity === 0) {
//       removeFromCart(
//         productId,
//         shopId
//       );
//     } else {
//       updateQuantity(
//         productId,
//         shopId,
//         newQuantity
//       );
//     }
//   };

//   // --------------------------------------------------
//   // PRODUCT DETAIL
//   // --------------------------------------------------

//   const handleProductPress = (
//     product: any
//   ) => {
//     navigation.navigate(
//       'ProductDetail',
//       {
//         product: {
//           ...product,
//           storeId: selectedStoreId,
//           storeName: storeName,
//         },
//       }
//     );
//   };

//   // --------------------------------------------------
//   // CART TOTAL
//   // --------------------------------------------------

//   const getCartTotal = () => {
//     const storeCartItems =
//       cartItems.filter(
//         (item) =>
//           item.restaurantId ===
//           String(selectedStoreId)
//       );

//     const totalItems =
//       storeCartItems.reduce(
//         (sum, item) =>
//           sum + item.quantity,
//         0
//       );

//     const totalPrice =
//       storeCartItems.reduce(
//         (sum, item) =>
//           sum +
//           item.price *
//             item.quantity,
//         0
//       );

//     return {
//       totalItems,
//       totalPrice,
//     };
//   };

//   const {
//     totalItems,
//     totalPrice,
//   } = getCartTotal();

//   // --------------------------------------------------
//   // NAVIGATE TO CART
//   // --------------------------------------------------

//   const navigateToCart = () => {
//     if (
//       selectedStoreId &&
//       storeName
//     ) {
//       setSelectedBusiness({
//         id: selectedStoreId,
//         name: storeName,
//       });
//     }

//     navigation.navigate('Cart');
//   };

//   // --------------------------------------------------
//   // PRODUCT CARD
//   // --------------------------------------------------

//   const renderProduct = ({
//     item,
//   }: {
//     item: any;
//   }) => {
//     const inCart =
//       isItemInCart(item.id);

//     const quantity =
//       getItemQuantity(item.id);

//     const isLowStock =
//       (item.stock_qty || 0) > 0 &&
//       (item.stock_qty || 0) <= 10;

//     const isOutOfStock =
//       (item.stock_qty || 0) === 0;

//     return (
//       <View
//         style={[
//           styles.productCard,
//           {
//             width: cardWidth,
//           },
//         ]}
//       >
//         {/* PRODUCT IMAGE */}
//         <TouchableOpacity
//           activeOpacity={0.9}
//           onPress={() =>
//             handleProductPress(item)
//           }
//         >
//           <View
//             style={
//               styles.productImageWrap
//             }
//           >
//             {item.image ? (
//               <Image
//                 source={{
//                   uri: item.image,
//                 }}
//                 style={
//                   styles.productImage
//                 }
//                 resizeMode="contain"
//               />
//             ) : (
//               <View
//                 style={[
//                   styles.productImage,
//                   styles.productImagePlaceholder,
//                 ]}
//               >
//                 <Icon
//                   name="image-outline"
//                   size={32}
//                   color={PALETTE.textSecondary}
//                 />
//               </View>
//             )}

//             {/* OUT OF STOCK */}
//             {isOutOfStock && (
//               <View
//                 style={
//                   styles.outOfStockOverlay
//                 }
//               >
//                 <Text
//                   style={
//                     styles.outOfStockText
//                   }
//                 >
//                   Out of Stock
//                 </Text>
//               </View>
//             )}

//             {/* LOW STOCK */}
//             {isLowStock &&
//               !isOutOfStock && (
//                 <View
//                   style={
//                     styles.lowStockBadge
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.lowStockBadgeText
//                     }
//                   >
//                     Only {item.stock_qty}{' '}
//                     left
//                   </Text>
//                 </View>
//               )}
//           </View>
//         </TouchableOpacity>

//         {/* PRODUCT DETAILS */}
//         <View
//           style={styles.productCardBody}
//         >
//           <TouchableOpacity
//             activeOpacity={0.85}
//             onPress={() =>
//               handleProductPress(item)
//             }
//           >
//             {/* CATEGORY */}
//             <Text
//               style={
//                 styles.productCategory
//               }
//               numberOfLines={1}
//             >
//               {(
//                 item.category ||
//                 'Uncategorized'
//               ).toUpperCase()}
//             </Text>

//             {/* NAME */}
//             <Text
//               style={styles.productName}
//               numberOfLines={2}
//             >
//               {item.name ||
//                 'Unnamed Product'}
//             </Text>

//             {/* PRICE */}
//             <View
//               style={styles.priceRow}
//             >
//               <Text
//                 style={
//                   styles.productPrice
//                 }
//               >
//                 ₹
//                 {item.selling_price ||
//                   0}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* CART ACTION */}
//           <View
//             style={
//               styles.productActionRow
//             }
//           >
//             {/* OUT OF STOCK */}
//             {isOutOfStock ? (
//               <View
//                 style={
//                   styles.disabledAddButton
//                 }
//               >
//                 <Text
//                   style={
//                     styles.disabledAddButtonText
//                   }
//                 >
//                   Unavailable
//                 </Text>
//               </View>
//             ) : inCart ? (
//               /* QUANTITY */
//               <View
//                 style={
//                   styles.quantityContainer
//                 }
//               >
//                 <TouchableOpacity
//                   style={
//                     styles.quantityButton
//                   }
//                   onPress={() =>
//                     handleUpdateQuantity(
//                       item,
//                       quantity - 1
//                     )
//                   }
//                 >
//                   <Icon
//                     name="remove"
//                     size={15}
//                     color={
//                       PALETTE.primary
//                     }
//                   />
//                 </TouchableOpacity>

//                 <Text
//                   style={
//                     styles.quantityText
//                   }
//                 >
//                   {quantity}
//                 </Text>

//                 <TouchableOpacity
//                   style={
//                     styles.quantityButton
//                   }
//                   onPress={() =>
//                     handleUpdateQuantity(
//                       item,
//                       quantity + 1
//                     )
//                   }
//                 >
//                   <Icon
//                     name="add"
//                     size={15}
//                     color={
//                       PALETTE.primary
//                     }
//                   />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               /* ADD */
//               <TouchableOpacity
//                 style={
//                   styles.addButton
//                 }
//                 onPress={() =>
//                   handleAddToCart(item)
//                 }
//                 activeOpacity={0.8}
//               >
//                 <Icon
//                   name="add"
//                   size={14}
//                   color={
//                     PALETTE.white
//                   }
//                 />

//                 <Text
//                   style={
//                     styles.addButtonText
//                   }
//                 >
//                   ADD
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   // --------------------------------------------------
//   // CATEGORY CHIP
//   // --------------------------------------------------

//   const renderCategoryChip = (
//     category: string
//   ) => (
//     <TouchableOpacity
//       key={category}
//       style={[
//         styles.categoryChip,
//         selectedCategory ===
//           category &&
//           styles.categoryChipActive,
//       ]}
//       activeOpacity={0.75}
//       onPress={() => {
//         setSelectedCategory(
//           category
//         );

//         if (
//           searchQuery.trim()
//             .length > 0
//         ) {
//           setSearchQuery('');
//         }
//       }}
//     >
//       <Text
//         style={[
//           styles.categoryChipText,
//           selectedCategory ===
//             category &&
//             styles.categoryChipTextActive,
//         ]}
//       >
//         {category}
//       </Text>
//     </TouchableOpacity>
//   );

//   // --------------------------------------------------
//   // FILTER SIDEBAR
//   // --------------------------------------------------

//   const renderFilterSidebar = () => (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={
//         filterSidebarVisible
//       }
//       onRequestClose={() =>
//         setFilterSidebarVisible(
//           false
//         )
//       }
//     >
//       <View
//         style={
//           styles.sidebarOverlay
//         }
//       >
//         <TouchableWithoutFeedback
//           onPress={() =>
//             setFilterSidebarVisible(
//               false
//             )
//           }
//         >
//           <View
//             style={
//               styles.sidebarBackground
//             }
//           />
//         </TouchableWithoutFeedback>

//         <View
//           style={
//             styles.sidebarContent
//           }
//         >
//           {/* SIDEBAR HEADER */}
//           <View
//             style={
//               styles.sidebarHeader
//             }
//           >
//             <Text
//               style={
//                 styles.sidebarTitle
//               }
//             >
//               Filters
//             </Text>

//             <TouchableOpacity
//               onPress={() =>
//                 setFilterSidebarVisible(
//                   false
//                 )
//               }
//               style={
//                 styles.sidebarCloseButton
//               }
//             >
//               <Icon
//                 name="close"
//                 size={22}
//                 color={PALETTE.text}
//               />
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             showsVerticalScrollIndicator={
//               false
//             }
//             contentContainerStyle={
//               styles.sidebarScrollContent
//             }
//           >
//             {/* CATEGORY */}
//             <View
//               style={
//                 styles.filterSection
//               }
//             >
//               <Text
//                 style={
//                   styles.filterSectionTitle
//                 }
//               >
//                 Category
//               </Text>

//               <View
//                 style={
//                   styles.categoryList
//                 }
//               >
//                 {categories.map(
//                   (category) => (
//                     <TouchableOpacity
//                       key={category}
//                       style={[
//                         styles.sidebarCategoryItem,
//                         tempSelectedCategory ===
//                           category &&
//                           styles.sidebarCategoryItemActive,
//                       ]}
//                       onPress={() =>
//                         setTempSelectedCategory(
//                           category
//                         )
//                       }
//                     >
//                       <Text
//                         style={[
//                           styles.sidebarCategoryText,
//                           tempSelectedCategory ===
//                             category &&
//                             styles.sidebarCategoryTextActive,
//                         ]}
//                       >
//                         {category}
//                       </Text>

//                       {tempSelectedCategory ===
//                         category && (
//                         <Icon
//                           name="checkmark"
//                           size={18}
//                           color={
//                             PALETTE.primary
//                           }
//                         />
//                       )}
//                     </TouchableOpacity>
//                   )
//                 )}
//               </View>
//             </View>

//             {/* PRICE */}
//             <View
//               style={
//                 styles.filterSection
//               }
//             >
//               <Text
//                 style={
//                   styles.filterSectionTitle
//                 }
//               >
//                 Price Range
//               </Text>

//               <View
//                 style={
//                   styles.priceRangeContainer
//                 }
//               >
//                 <View
//                   style={
//                     styles.priceInputWrapper
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.priceLabel
//                     }
//                   >
//                     Min (₹)
//                   </Text>

//                   <TextInput
//                     style={
//                       styles.priceInput
//                     }
//                     placeholder="0"
//                     placeholderTextColor={
//                       PALETTE.textSecondary
//                     }
//                     keyboardType="numeric"
//                     value={
//                       priceRange.min
//                     }
//                     onChangeText={(
//                       text
//                     ) =>
//                       setPriceRange({
//                         ...priceRange,
//                         min: text,
//                       })
//                     }
//                   />
//                 </View>

//                 <Text
//                   style={
//                     styles.priceSeparator
//                   }
//                 >
//                   -
//                 </Text>

//                 <View
//                   style={
//                     styles.priceInputWrapper
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.priceLabel
//                     }
//                   >
//                     Max (₹)
//                   </Text>

//                   <TextInput
//                     style={
//                       styles.priceInput
//                     }
//                     placeholder="Any"
//                     placeholderTextColor={
//                       PALETTE.textSecondary
//                     }
//                     keyboardType="numeric"
//                     value={
//                       priceRange.max
//                     }
//                     onChangeText={(
//                       text
//                     ) =>
//                       setPriceRange({
//                         ...priceRange,
//                         max: text,
//                       })
//                     }
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* SORT */}
//             <View
//               style={
//                 styles.filterSection
//               }
//             >
//               <Text
//                 style={
//                   styles.filterSectionTitle
//                 }
//               >
//                 Sort By
//               </Text>

//               <View
//                 style={
//                   styles.sortOptions
//                 }
//               >
//                 {[
//                   {
//                     value: 'default',
//                     label: 'Default',
//                   },
//                   {
//                     value: 'price_low',
//                     label:
//                       'Price: Low to High',
//                   },
//                   {
//                     value: 'price_high',
//                     label:
//                       'Price: High to Low',
//                   },
//                   {
//                     value: 'name_asc',
//                     label:
//                       'Name: A to Z',
//                   },
//                   {
//                     value: 'name_desc',
//                     label:
//                       'Name: Z to A',
//                   },
//                 ].map((option) => (
//                   <TouchableOpacity
//                     key={
//                       option.value
//                     }
//                     style={[
//                       styles.sortOption,
//                       sortBy ===
//                         option.value &&
//                         styles.sortOptionActive,
//                     ]}
//                     onPress={() =>
//                       setSortBy(
//                         option.value
//                       )
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.sortOptionText,
//                         sortBy ===
//                           option.value &&
//                           styles.sortOptionTextActive,
//                       ]}
//                     >
//                       {
//                         option.label
//                       }
//                     </Text>

//                     {sortBy ===
//                       option.value && (
//                       <Icon
//                         name="checkmark"
//                         size={18}
//                         color={
//                           PALETTE.primary
//                         }
//                       />
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>

//             {/* STOCK FILTER */}
//             <View
//               style={
//                 styles.filterSection
//               }
//             >
//               <TouchableOpacity
//                 style={
//                   styles.stockFilter
//                 }
//                 onPress={() =>
//                   setShowInStock(
//                     !showInStock
//                   )
//                 }
//               >
//                 <View
//                   style={
//                     styles.checkboxContainer
//                   }
//                 >
//                   <View
//                     style={[
//                       styles.checkbox,
//                       showInStock &&
//                         styles.checkboxChecked,
//                     ]}
//                   >
//                     {showInStock && (
//                       <Icon
//                         name="checkmark"
//                         size={14}
//                         color={
//                           PALETTE.white
//                         }
//                       />
//                     )}
//                   </View>

//                   <Text
//                     style={
//                       styles.stockFilterText
//                     }
//                   >
//                     Show only in-stock
//                     items
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             </View>

//             {/* ACTIONS */}
//             <View
//               style={
//                 styles.sidebarActions
//               }
//             >
//               <TouchableOpacity
//                 style={
//                   styles.resetButton
//                 }
//                 onPress={
//                   resetFilters
//                 }
//               >
//                 <Text
//                   style={
//                     styles.resetButtonText
//                   }
//                 >
//                   Reset All
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={
//                   styles.applyButton
//                 }
//                 onPress={
//                   applyFilters
//                 }
//               >
//                 <Text
//                   style={
//                     styles.applyButtonText
//                   }
//                 >
//                   Apply Filters
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );

//   // --------------------------------------------------
//   // LOADING
//   // --------------------------------------------------

//   if (loading) {
//     return (
//       <View
//         style={
//           styles.loadingContainer
//         }
//       >
//         <ActivityIndicator
//           size="large"
//           color={
//             PALETTE.primary
//           }
//         />

//         <Text
//           style={
//             styles.loadingText
//           }
//         >
//           Loading products...
//         </Text>
//       </View>
//     );
//   }

//   // --------------------------------------------------
//   // MAIN UI
//   // --------------------------------------------------

//   return (
//     <SafeAreaView
//       style={styles.container}
//     >
//       {/* HEADER */}
//       <View
//         style={styles.header}
//       >
//         <TouchableOpacity
//           style={
//             styles.backButton
//           }
//           onPress={() =>
//             navigation.goBack()
//           }
//           activeOpacity={0.75}
//         >
//           <Icon
//             name="arrow-back-outline"
//             size={20}
//             color={PALETTE.text}
//           />
//         </TouchableOpacity>

//         <View
//           style={styles.headerInfo}
//         >
//           <Text
//             style={
//               styles.headerTitle
//             }
//             numberOfLines={1}
//           >
//             {storeName ||
//               'Products'}
//           </Text>

//           <View
//             style={
//               styles.headerSubRow
//             }
//           >
//             {businessDescription ? (
//               <Text
//                 style={
//                   styles.headerDescription
//                 }
//                 numberOfLines={1}
//               >
//                 {
//                   businessDescription
//                 }
//               </Text>
//             ) : (
//               <Text
//                 style={
//                   styles.headerSubtitle
//                 }
//               >
//                 {
//                   products.length
//                 }{' '}
//                 products available
//               </Text>
//             )}

//             {serviceHighlights.length >
//               0 && (
//               <View
//                 style={
//                   styles.headerHighlightBadge
//                 }
//               >
//                 <Icon
//                   name={getHighlightIconName(
//                     serviceHighlights[0]
//                       .icon
//                   )}
//                   size={11}
//                   color={
//                     PALETTE.primary
//                   }
//                 />

//                 <Text
//                   style={
//                     styles.headerHighlightText
//                   }
//                   numberOfLines={1}
//                 >
//                   {
//                     serviceHighlights[0]
//                       .title
//                   }
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* HEADER ACTIONS */}
//         <View
//           style={
//             styles.headerActions
//           }
//         >
//           <TouchableOpacity
//             style={
//               styles.iconCircleButton
//             }
//             onPress={
//               toggleSearch
//             }
//             activeOpacity={0.75}
//           >
//             <Icon
//               name="search-outline"
//               size={19}
//               color={PALETTE.text}
//             />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.iconCircleButton,
//               styles.cartIconButton,
//             ]}
//             onPress={
//               navigateToCart
//             }
//             activeOpacity={0.75}
//           >
//             <Icon
//               name="cart-outline"
//               size={19}
//               color={
//                 PALETTE.primary
//               }
//             />

//             {cartItems.filter(
//               (item) =>
//                 item.restaurantId ===
//                 String(
//                   selectedStoreId
//                 )
//             ).length > 0 && (
//               <View
//                 style={
//                   styles.cartBadge
//                 }
//               >
//                 <Text
//                   style={
//                     styles.cartBadgeText
//                   }
//                 >
//                   {
//                     cartItems.filter(
//                       (item) =>
//                         item.restaurantId ===
//                         String(
//                           selectedStoreId
//                         )
//                     ).length
//                   }
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.webCenterWrap}>
//         <View
//           style={[
//             styles.webContentArea,
//             isDesktopWeb && styles.webContentAreaDesktop,
//           ]}
//         >
//           {/* SEARCH */}
//           {showSearch && (
//             <View
//               style={
//                 styles.searchContainer
//               }
//             >
//               <View
//                 style={
//                   styles.searchBar
//                 }
//               >
//                 <Icon
//                   name="search-outline"
//                   size={18}
//                   color={PALETTE.textSecondary}
//                   style={
//                     styles.searchIcon
//                   }
//                 />

//                 <TextInput
//                   style={
//                     styles.searchInput
//                   }
//                   placeholder="Search products..."
//                   placeholderTextColor={PALETTE.textSecondary}
//                   value={searchQuery}
//                   onChangeText={
//                     setSearchQuery
//                   }
//                   autoFocus
//                   returnKeyType="search"
//                 />

//                 {searchQuery.length >
//                   0 && (
//                   <TouchableOpacity
//                     onPress={() =>
//                       setSearchQuery('')
//                     }
//                   >
//                     <Icon
//                       name="close-circle"
//                       size={18}
//                       color={PALETTE.textSecondary}
//                     />
//                   </TouchableOpacity>
//                 )}

//                 <TouchableOpacity
//                   onPress={
//                     toggleSearch
//                   }
//                   style={
//                     styles.searchCloseButton
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.searchCloseText
//                     }
//                   >
//                     Cancel
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {searchQuery.length >
//                 0 && (
//                 <View
//                   style={
//                     styles.searchResultHeader
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.searchResultCount
//                     }
//                   >
//                     {
//                       filteredProducts.length
//                     }{' '}
//                     results found for "
//                     {searchQuery}"
//                   </Text>
//                 </View>
//               )}
//             </View>
//           )}

//           {/* CATEGORIES */}
//           {!showSearch && (
//             <View
//               style={
//                 styles.categoriesWrapper
//               }
//             >
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={
//                   false
//                 }
//                 contentContainerStyle={
//                   styles.categoriesContainer
//                 }
//               >
//                 {categories.map(
//                   renderCategoryChip
//                 )}
//               </ScrollView>
//             </View>
//           )}

//           {/* FILTER ROW */}
//           {!showSearch && (
//             <View
//               style={styles.filterRow}
//             >
//               <View>
//                 <Text
//                   style={
//                     styles.filterTitle
//                   }
//                 >
//                   {selectedCategory ===
//                   'All'
//                     ? 'All Products'
//                     : selectedCategory}
//                   <Text style={styles.filterCount}>
//                     {' '}
//                     (
//                     {
//                       filteredProducts.length
//                     }
//                     )
//                   </Text>
//                 </Text>
//               </View>

//               <View
//                 style={
//                   styles.filterSpacer
//                 }
//               />

//               <TouchableOpacity
//                 style={
//                   styles.filterButton
//                 }
//                 onPress={() => {
//                   setTempSelectedCategory(
//                     selectedCategory
//                   );
//                   setFilterSidebarVisible(
//                     true
//                   );
//                 }}
//                 activeOpacity={0.75}
//               >
//                 <Icon
//                   name="options-outline"
//                   size={16}
//                   color={
//                     PALETTE.primary
//                   }
//                 />

//                 <Text
//                   style={
//                     styles.filterButtonText
//                   }
//                 >
//                   Filter
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* PRODUCT LIST */}
//           <CompatibleFlatList
//             key={numColumns}
//             data={filteredProducts}
//             renderItem={
//               renderProduct
//             }
//             keyExtractor={(
//               item: any
//             ) => String(item.id)}
//             numColumns={
//               numColumns
//             }
//             columnWrapperStyle={
//               numColumns > 1
//                 ? styles.productRowWrapper
//                 : undefined
//             }
//             contentContainerStyle={{
//               paddingHorizontal: 16,
//               paddingTop: 14,
//               paddingBottom: 120,
//             }}
//             ListEmptyComponent={
//               <View
//                 style={
//                   styles.emptyContainer
//                 }
//               >
//                 <View style={styles.emptyIconCircle}>
//                   <Icon
//                     name={
//                       searchQuery.trim().length > 0
//                         ? 'search-outline'
//                         : 'cube-outline'
//                     }
//                     size={40}
//                     color={PALETTE.primary}
//                   />
//                 </View>

//                 <Text
//                   style={
//                     styles.emptyText
//                   }
//                 >
//                   {searchQuery.trim()
//                     .length > 0
//                     ? 'No products match your search'
//                     : 'No products available'}
//                 </Text>

//                 <Text
//                   style={
//                     styles.emptySubtext
//                   }
//                 >
//                   {searchQuery.trim()
//                     .length > 0
//                     ? 'Try searching with different keywords'
//                     : "This store doesn't have any products yet"}
//                 </Text>

//                 {searchQuery.trim()
//                   .length > 0 && (
//                   <TouchableOpacity
//                     style={styles.clearSearchButton}
//                     onPress={() =>
//                       setSearchQuery('')
//                     }
//                     activeOpacity={0.8}
//                   >
//                     <Text
//                       style={
//                         styles.clearSearchText
//                       }
//                     >
//                       Clear Search
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             }
//           />
//         </View>
//       </View>

//       {/* FILTER MODAL */}
//       {renderFilterSidebar()}

//       {/* BOTTOM CART BAR */}
//       {totalItems > 0 && (
//         <View
//           style={
//             styles.bottomCartBarWrap
//           }
//         >
//           <View
//             style={
//               styles.bottomCartBar
//             }
//           >
//             <View
//               style={
//                 styles.cartInfo
//               }
//             >
//               <Text
//                 style={
//                   styles.cartItemsCount
//                 }
//               >
//                 {totalItems} items
//               </Text>

//               <Text
//                 style={
//                   styles.cartTotalPrice
//                 }
//               >
//                 ₹{totalPrice}
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={
//                 styles.viewCartButton
//               }
//               onPress={
//                 navigateToCart
//               }
//               activeOpacity={0.85}
//             >
//               <Text
//                 style={
//                   styles.viewCartText
//                 }
//               >
//                 View Cart
//               </Text>

//               <Icon
//                 name="chevron-forward"
//                 size={18}
//                 color={
//                   PALETTE.white
//                 }
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// // ==================================================
// // STYLES
// // ==================================================

// const styles = StyleSheet.create({
//   // --------------------------------------------------
//   // CONTAINER
//   // --------------------------------------------------
//   container: {
//     flex: 1,
//     backgroundColor: PALETTE.background,
//   },

//   webCenterWrap: {
//     flex: 1,
//     width: '100%',
//   },

//   webContentArea: {
//     flex: 1,
//     width: '100%',
//   },

//   webContentAreaDesktop: {
//     width: '100%',
//   },

//   // --------------------------------------------------
//   // LOADING
//   // --------------------------------------------------
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: PALETTE.white,
//   },

//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: PALETTE.textSecondary,
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // HEADER
//   // --------------------------------------------------
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 14,
//     paddingBottom: 14,
//     backgroundColor: PALETTE.white,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.border,
//   },

//   backButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: PALETTE.lightPurple,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   headerInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: PALETTE.text,
//     fontFamily: FONT_FAMILY,
//   },

//   headerSubtitle: {
//     fontSize: 12,
//     color: PALETTE.textSecondary,
//     marginTop: 3,
//     fontFamily: FONT_FAMILY,
//   },

//   headerSubRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 3,
//     flexShrink: 1,
//   },

//   headerDescription: {
//     fontSize: 12,
//     color: PALETTE.textSecondary,
//     lineHeight: 16,
//     flexShrink: 1,
//     fontFamily: FONT_FAMILY,
//   },

//   headerHighlightBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.softPurple,
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     marginLeft: 8,
//     flexShrink: 0,
//   },

//   headerHighlightText: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: PALETTE.primary,
//     marginLeft: 4,
//     fontFamily: FONT_FAMILY,
//   },

//   headerActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   iconCircleButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: PALETTE.lightPurple,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 10,
//     position: 'relative',
//     ...(Platform.OS === 'web'
//       ? { cursor: 'pointer' }
//       : {}),
//   },

//   cartIconButton: {
//     backgroundColor: PALETTE.softPurple,
//   },

//   cartBadge: {
//     position: 'absolute',
//     top: -4,
//     right: -4,
//     backgroundColor: PALETTE.primary,
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: PALETTE.white,
//   },

//   cartBadgeText: {
//     fontSize: 9,
//     fontWeight: '700',
//     color: PALETTE.white,
//     paddingHorizontal: 3,
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // SEARCH
//   // --------------------------------------------------
//   searchContainer: {
//     backgroundColor: PALETTE.white,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.border,
//     paddingHorizontal: 16,
//     paddingTop: 10,
//     paddingBottom: 10,
//   },

//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F3FF',
//     borderWidth: 1,
//     borderColor: '#E7E2FF',
//     borderRadius: 14,
//     paddingHorizontal: 14,
//     height: 46,
//   },

//   searchIcon: {
//     marginRight: 8,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 15,
//     color: PALETTE.text,
//     paddingVertical: 8,
//     fontFamily: FONT_FAMILY,
//   },

//   searchCloseButton: {
//     marginLeft: 10,
//     paddingVertical: 4,
//     paddingHorizontal: 4,
//   },

//   searchCloseText: {
//     color: PALETTE.primary,
//     fontSize: 14,
//     fontWeight: '600',
//     fontFamily: FONT_FAMILY,
//   },

//   searchResultHeader: {
//     paddingVertical: 10,
//     paddingHorizontal: 4,
//   },

//   searchResultCount: {
//     fontSize: 12,
//     color: PALETTE.textSecondary,
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // CATEGORIES
//   // --------------------------------------------------
//   categoriesWrapper: {
//     backgroundColor: PALETTE.white,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.border,
//   },

//   categoriesContainer: {
//     paddingHorizontal: 16,
//   },

//   categoryChip: {
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 22,
//     backgroundColor: PALETTE.lightPurple,
//     marginRight: 10,
//     ...(Platform.OS === 'web'
//       ? { cursor: 'pointer' }
//       : {}),
//   },

//   categoryChipActive: {
//     backgroundColor: PALETTE.primary,
//   },

//   categoryChipText: {
//     fontSize: 13,
//     color: PALETTE.primary,
//     fontWeight: '600',
//     fontFamily: FONT_FAMILY,
//   },

//   categoryChipTextActive: {
//     color: PALETTE.white,
//   },

//   // --------------------------------------------------
//   // FILTER ROW
//   // --------------------------------------------------
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//   },

//   filterTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: PALETTE.text,
//     fontFamily: FONT_FAMILY,
//   },

//   filterCount: {
//     fontSize: 14,
//     fontWeight: '400',
//     color: PALETTE.textSecondary,
//     fontFamily: FONT_FAMILY,
//   },

//   filterSpacer: {
//     flex: 1,
//   },

//   filterButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 12,
//     backgroundColor: PALETTE.white,
//     borderWidth: 1,
//     borderColor: '#E8E4F5',
//     ...(Platform.OS === 'web'
//       ? { cursor: 'pointer' }
//       : {}),
//   },

//   filterButtonText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: PALETTE.primary,
//     marginLeft: 6,
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // PRODUCT GRID
//   // --------------------------------------------------
//   productRowWrapper: {
//     justifyContent: 'flex-start',
//     gap: 16,
//   },

//   // --------------------------------------------------
//   // PRODUCT CARD
//   // --------------------------------------------------
//   productCard: {
//     position: 'relative',
//     backgroundColor: PALETTE.white,
//     borderRadius: 18,
//     marginBottom: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: PALETTE.border,
//     shadowColor: '#5541D7',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 2,
//   },

//   // --------------------------------------------------
//   // PRODUCT IMAGE
//   // --------------------------------------------------
//   productImageWrap: {
//     position: 'relative',
//     backgroundColor: '#F7F5FF',
//   },

//   productImage: {
//     width: '100%',
//     height: 160,
//     backgroundColor: '#F7F5FF',
//   },

//   productImagePlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   lowStockBadge: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     backgroundColor: '#FFF1E0',
//     borderRadius: 10,
//     paddingHorizontal: 9,
//     paddingVertical: 4,
//   },

//   lowStockBadgeText: {
//     fontSize: 10,
//     fontWeight: '700',
//     color: '#B8630C',
//     fontFamily: FONT_FAMILY,
//   },

//   outOfStockOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255,255,255,0.72)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   outOfStockText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: PALETTE.text,
//     backgroundColor: PALETTE.white,
//     paddingHorizontal: 12,
//     paddingVertical: 5,
//     borderRadius: 8,
//     overflow: 'hidden',
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // PRODUCT DETAILS
//   // --------------------------------------------------
//   productCardBody: {
//     padding: 12,
//   },

//   productCategory: {
//     fontSize: 10,
//     color: PALETTE.textSecondary,
//     marginBottom: 4,
//     letterSpacing: 0.4,
//     fontFamily: FONT_FAMILY,
//   },

//   productName: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: PALETTE.text,
//     marginBottom: 8,
//     minHeight: 38,
//     lineHeight: 19,
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // PRICE
//   // --------------------------------------------------
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },

//   productPrice: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: PALETTE.primary,
//     fontFamily: FONT_FAMILY,
//   },

//   productActionRow: {
//     alignItems: 'flex-start',
//   },

//   // --------------------------------------------------
//   // ADD BUTTON
//   // --------------------------------------------------
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: PALETTE.primary,
//     borderRadius: 10,
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     minWidth: 76,
//     gap: 4,
//     ...(Platform.OS === 'web'
//       ? { cursor: 'pointer' }
//       : {}),
//   },

//   addButtonText: {
//     color: PALETTE.white,
//     fontSize: 12,
//     fontWeight: '700',
//     letterSpacing: 0.3,
//     fontFamily: FONT_FAMILY,
//   },

//   disabledAddButton: {
//     backgroundColor: '#F2F1F6',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 9,
//     alignItems: 'center',
//   },

//   disabledAddButtonText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: PALETTE.textSecondary,
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // QUANTITY
//   // --------------------------------------------------
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderWidth: 1,
//     borderColor: PALETTE.primary,
//     borderRadius: 10,
//     backgroundColor: '#F5F2FF',
//     paddingHorizontal: 3,
//     minWidth: 92,
//   },

//   quantityButton: {
//     width: 28,
//     height: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     ...(Platform.OS === 'web'
//       ? { cursor: 'pointer' }
//       : {}),
//   },

//   quantityText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: PALETTE.text,
//     minWidth: 20,
//     textAlign: 'center',
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // EMPTY STATE
//   // --------------------------------------------------
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 70,
//     paddingHorizontal: 24,
//   },

//   emptyIconCircle: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     backgroundColor: PALETTE.lightPurple,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 18,
//   },

//   emptyText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: PALETTE.text,
//     marginTop: 2,
//     textAlign: 'center',
//     fontFamily: FONT_FAMILY,
//   },

//   emptySubtext: {
//     fontSize: 13,
//     color: PALETTE.textSecondary,
//     marginTop: 6,
//     textAlign: 'center',
//     fontFamily: FONT_FAMILY,
//   },

//   clearSearchButton: {
//     marginTop: 18,
//     backgroundColor: PALETTE.primary,
//     borderRadius: 10,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },

//   clearSearchText: {
//     fontSize: 14,
//     color: PALETTE.white,
//     fontWeight: '700',
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // FILTER SIDEBAR
//   // --------------------------------------------------
//   sidebarOverlay: {
//     flex: 1,
//     flexDirection: 'row',
//   },

//   sidebarBackground: {
//     flex: 1,
//     backgroundColor: 'rgba(30,27,46,0.45)',
//   },

//   sidebarContent: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     bottom: 0,
//     width: Math.min(width * 0.85, 380),
//     backgroundColor: PALETTE.white,
//     paddingHorizontal: 22,
//     paddingTop: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: -4,
//       height: 0,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },

//   sidebarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.border,
//   },

//   sidebarTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: PALETTE.text,
//     fontFamily: FONT_FAMILY,
//   },

//   sidebarCloseButton: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: PALETTE.lightPurple,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   sidebarScrollContent: {
//     paddingBottom: 30,
//   },

//   filterSection: {
//     paddingVertical: 18,
//     borderBottomWidth: 1,
//     borderBottomColor: PALETTE.border,
//   },

//   filterSectionTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: PALETTE.text,
//     marginBottom: 12,
//     fontFamily: FONT_FAMILY,
//   },

//   categoryList: {
//     gap: 4,
//   },

//   sidebarCategoryItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//   },

//   sidebarCategoryItemActive: {
//     backgroundColor: PALETTE.lightPurple,
//   },

//   sidebarCategoryText: {
//     fontSize: 14,
//     color: PALETTE.text,
//     fontFamily: FONT_FAMILY,
//   },

//   sidebarCategoryTextActive: {
//     color: PALETTE.primary,
//     fontWeight: '700',
//   },

//   // PRICE RANGE
//   priceRangeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },

//   priceInputWrapper: {
//     flex: 1,
//   },

//   priceLabel: {
//     fontSize: 12,
//     color: PALETTE.textSecondary,
//     marginBottom: 5,
//     fontFamily: FONT_FAMILY,
//   },

//   priceInput: {
//     borderWidth: 1,
//     borderColor: '#E5E1F2',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: PALETTE.text,
//     fontFamily: FONT_FAMILY,
//   },

//   priceSeparator: {
//     fontSize: 16,
//     color: PALETTE.textSecondary,
//     paddingHorizontal: 4,
//     marginTop: 14,
//   },

//   // SORT
//   sortOptions: {
//     gap: 4,
//   },

//   sortOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//   },

//   sortOptionActive: {
//     backgroundColor: PALETTE.lightPurple,
//   },

//   sortOptionText: {
//     fontSize: 14,
//     color: PALETTE.text,
//     fontFamily: FONT_FAMILY,
//   },

//   sortOptionTextActive: {
//     color: PALETTE.primary,
//     fontWeight: '700',
//   },

//   // STOCK
//   stockFilter: {
//     paddingVertical: 4,
//   },

//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#D9D4EE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },

//   checkboxChecked: {
//     backgroundColor: PALETTE.primary,
//     borderColor: PALETTE.primary,
//   },

//   stockFilterText: {
//     fontSize: 14,
//     color: PALETTE.text,
//     fontFamily: FONT_FAMILY,
//   },

//   // SIDEBAR ACTIONS
//   sidebarActions: {
//     flexDirection: 'row',
//     gap: 12,
//     paddingVertical: 20,
//   },

//   resetButton: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#E5E1F2',
//     alignItems: 'center',
//     backgroundColor: PALETTE.white,
//   },

//   resetButtonText: {
//     fontSize: 15,
//     color: PALETTE.text,
//     fontWeight: '700',
//     fontFamily: FONT_FAMILY,
//   },

//   applyButton: {
//     flex: 2,
//     paddingVertical: 14,
//     borderRadius: 12,
//     backgroundColor: PALETTE.primary,
//     alignItems: 'center',
//   },

//   applyButtonText: {
//     fontSize: 15,
//     color: PALETTE.white,
//     fontWeight: '700',
//     fontFamily: FONT_FAMILY,
//   },

//   // --------------------------------------------------
//   // BOTTOM CART
//   // --------------------------------------------------
//   bottomCartBarWrap: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingBottom: Platform.OS === 'ios' ? 24 : 16,
//   },

//   bottomCartBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     maxWidth: 560,
//     backgroundColor: PALETTE.white,
//     paddingHorizontal: 18,
//     paddingVertical: 14,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: PALETTE.border,
//     shadowColor: '#5541D7',
//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },
//     shadowOpacity: 0.14,
//     shadowRadius: 20,
//     elevation: 10,
//   },

//   cartInfo: {
//     flexDirection: 'column',
//   },

//   cartItemsCount: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: PALETTE.textSecondary,
//     fontFamily: FONT_FAMILY,
//   },

//   cartTotalPrice: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: PALETTE.text,
//     marginTop: 2,
//     fontFamily: FONT_FAMILY,
//   },

//   viewCartButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: PALETTE.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 4,
//     ...(Platform.OS === 'web'
//       ? { cursor: 'pointer' }
//       : {}),
//   },

//   viewCartText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: PALETTE.white,
//     marginRight: 2,
//     fontFamily: FONT_FAMILY,
//   },
// });

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  TextInput,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';
import axios from 'axios';
import { API_URL } from '@env';

const CompatibleFlatList: any = FlatList;

const { width } = Dimensions.get('window');
const DESKTOP_BREAKPOINT = 768;

// --------------------------------------------------
// PREMIUM DESIGN TOKENS
// --------------------------------------------------

const PALETTE = {
  primary: '#6C5CE7',
  primaryDark: '#5541D7',
  lightPurple: '#F1EEFF',
  softPurple: '#EDE9FE',
  white: '#FFFFFF',
  text: '#1E1B2E',
  textSecondary: '#8A85A0',
  background: '#FAFAFD',
  border: '#EFEDF7',
  success: '#22C55E',
};

const FONT_FAMILY = 'Times New Roman';

// Maps the icon name saved in POS to an Ionicons name
const getHighlightIconName = (icon: string) => {
  const iconMap: Record<string, string> = {
    flash: 'flash-outline',
    time: 'time-outline',
    shield: 'shield-checkmark-outline',
    cube: 'cube-outline',
    heart: 'heart-outline',
    truck: 'car-outline',
  };

  return iconMap[icon] || 'star-outline';
};

export default function ProductListScreen({
  route,
  navigation,
}: any) {
  const { storeId, storeName } = route.params || {};

  const { width: windowWidth } = useWindowDimensions();

  const isDesktopWeb =
    Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

  // --------------------------------------------------
  // CARD / GRID SIZING
  // --------------------------------------------------

  const availableWidth = windowWidth - 32;
  const CARD_GAP = 16;
  const MIN_CARD_WIDTH = 200;

  const numColumns = !isDesktopWeb
    ? 2
    : Math.max(
        2,
        Math.floor(
          (availableWidth + CARD_GAP) /
            (MIN_CARD_WIDTH + CARD_GAP)
        )
      );

  const cardWidth =
    (availableWidth -
      CARD_GAP * (numColumns - 1)) /
    numColumns;

  // --------------------------------------------------
  // PRODUCT STATES
  // --------------------------------------------------

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStoreId, setSelectedStoreId] =
    useState<number | null>(storeId || null);

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>('All');

  const [categories, setCategories] =
    useState<string[]>(['All']);

  // --------------------------------------------------
  // FILTER STATES
  // --------------------------------------------------

  const [filterSidebarVisible, setFilterSidebarVisible] =
    useState<boolean>(false);

  const [tempSelectedCategory, setTempSelectedCategory] =
    useState<string | null>('All');

  const [priceRange, setPriceRange] = useState<{
    min: string;
    max: string;
  }>({
    min: '',
    max: '',
  });

  const [sortBy, setSortBy] =
    useState<string>('default');

  const [showInStock, setShowInStock] =
    useState<boolean>(false);

  // --------------------------------------------------
  // SEARCH STATES
  // --------------------------------------------------

  const [showSearch, setShowSearch] =
    useState<boolean>(false);

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  // --------------------------------------------------
  // BUSINESS STATES
  // --------------------------------------------------

  const [businessDescription, setBusinessDescription] =
    useState<string>('');

  const [loadingBusiness, setLoadingBusiness] =
    useState<boolean>(true);

  const [serviceHighlights, setServiceHighlights] =
    useState<any[]>([]);

  // --------------------------------------------------
  // CONTEXT
  // --------------------------------------------------

  const { user } = useContext(AuthContext);

  const { setSelectedBusiness } =
    useContext(SelectedBusinessContext);

  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useContext(CartContext);

  // --------------------------------------------------
  // LOAD PRODUCTS
  // --------------------------------------------------

  useEffect(() => {
    if (!storeId) {
      setLoading(false);
      setError('No store selected');
      return;
    }

    setSelectedStoreId(storeId);

    if (storeName) {
      setSelectedBusiness({
        id: storeId,
        name: storeName,
      });
    }

    loadProducts(storeId);
  }, [storeId]);

  // --------------------------------------------------
  // FETCH BUSINESS DETAILS
  // --------------------------------------------------

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!storeId) return;

      try {
        setLoadingBusiness(true);

        const url = `${API_URL}/public/businesses`;

        const response = await axios.get(url);

        const businessesData =
          response.data?.data || [];

        const currentStore =
          businessesData.find(
            (b: any) =>
              Number(b.id) === Number(storeId)
          );

        if (currentStore) {
          setBusinessDescription(
            currentStore.description || ''
          );
        }
      } catch (err) {
        console.error(
          'Error fetching business details:',
          err
        );
      } finally {
        setLoadingBusiness(false);
      }
    };

    if (storeId) {
      fetchBusinessDetails();
    }
  }, [storeId]);

  // --------------------------------------------------
  // FETCH SERVICE HIGHLIGHTS
  // --------------------------------------------------

  useEffect(() => {
    const fetchServiceHighlights = async () => {
      if (!storeId) return;

      try {
        const url =
          `${API_URL}/public/businesses/` +
          `${storeId}/service-highlights`;

        const response = await axios.get(url);

        let highlightsData: any[] = [];

        if (Array.isArray(response.data)) {
          highlightsData = response.data;
        } else if (
          response.data?.data &&
          Array.isArray(response.data.data)
        ) {
          highlightsData = response.data.data;
        }

        setServiceHighlights(highlightsData);
      } catch (err) {
        console.error(
          'Error fetching service highlights:',
          err
        );

        setServiceHighlights([]);
      }
    };

    if (storeId) {
      fetchServiceHighlights();
    }
  }, [storeId]);

  // --------------------------------------------------
  // LOAD PRODUCTS API
  // --------------------------------------------------

  const loadProducts = async (
    businessId: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const url =
        `${API_URL}/public/products` +
        `?business_id=${businessId}`;

      const response = await axios.get(url);

      let productsData: any[] = [];

      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (
        response.data?.data &&
        Array.isArray(response.data.data)
      ) {
        productsData = response.data.data;
      } else if (
        response.data?.products &&
        Array.isArray(response.data.products)
      ) {
        productsData = response.data.products;
      }

      setProducts(productsData);
      setFilteredProducts(productsData);

      const uniqueCategories: string[] = ['All'];
      const categorySet = new Set<string>();

      productsData.forEach((product: any) => {
        if (product.category) {
          categorySet.add(product.category);
        }
      });

      uniqueCategories.push(
        ...Array.from(categorySet)
      );

      setCategories(uniqueCategories);

      if (productsData.length === 0) {
        setError(
          'No products available for this store'
        );
      }
    } catch (err: any) {
      console.error(
        '❌ Error loading products:',
        err
      );

      setError(
        err.message || 'Failed to load products'
      );

      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // SEARCH / FILTER / SORT PIPELINE
  // --------------------------------------------------

  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];

      // SEARCH
      if (searchQuery.trim().length > 0) {
        const query =
          searchQuery.toLowerCase().trim();

        filtered = filtered.filter(
          (product) => {
            const name =
              (product.name || '').toLowerCase();

            const category =
              (product.category || '').toLowerCase();

            const description =
              (product.description || '').toLowerCase();

            const brand =
              (product.brand || '').toLowerCase();

            return (
              name.startsWith(query) ||
              category.startsWith(query) ||
              description.startsWith(query) ||
              brand.startsWith(query)
            );
          }
        );
      }

      // CATEGORY
      else if (
        selectedCategory !== 'All' &&
        selectedCategory
      ) {
        filtered = filtered.filter(
          (product) =>
            product.category === selectedCategory
        );
      }

      // MIN PRICE
      if (priceRange.min) {
        const minPrice =
          parseFloat(priceRange.min);

        filtered = filtered.filter(
          (product) =>
            (product.selling_price || 0) >=
            minPrice
        );
      }

      // MAX PRICE
      if (priceRange.max) {
        const maxPrice =
          parseFloat(priceRange.max);

        filtered = filtered.filter(
          (product) =>
            (product.selling_price || 0) <=
            maxPrice
        );
      }

      // STOCK
      if (showInStock) {
        filtered = filtered.filter(
          (product) =>
            (product.stock_qty || 0) > 0
        );
      }

      // SORT
      if (sortBy === 'price_low') {
        filtered.sort(
          (a, b) =>
            (a.selling_price || 0) -
            (b.selling_price || 0)
        );
      } else if (sortBy === 'price_high') {
        filtered.sort(
          (a, b) =>
            (b.selling_price || 0) -
            (a.selling_price || 0)
        );
      } else if (sortBy === 'name_asc') {
        filtered.sort(
          (a, b) =>
            (a.name || '').localeCompare(
              b.name || ''
            )
        );
      } else if (sortBy === 'name_desc') {
        filtered.sort(
          (a, b) =>
            (b.name || '').localeCompare(
              a.name || ''
            )
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [
    searchQuery,
    selectedCategory,
    products,
    priceRange,
    showInStock,
    sortBy,
  ]);

  // --------------------------------------------------
  // FILTER ACTIONS
  // --------------------------------------------------

  const applyFilters = () => {
    setSelectedCategory(
      tempSelectedCategory
    );

    setFilterSidebarVisible(false);
  };

  const resetFilters = () => {
    setTempSelectedCategory('All');
    setPriceRange({
      min: '',
      max: '',
    });
    setSortBy('default');
    setShowInStock(false);
    setSelectedCategory('All');
    setFilterSidebarVisible(false);
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const toggleSearch = () => {
    setShowSearch(!showSearch);

    if (showSearch) {
      setSearchQuery('');
    }
  };

  // --------------------------------------------------
  // CART FUNCTIONS
  // --------------------------------------------------

  const isItemInCart = (
    productId: string | number
  ) =>
    cartItems.some(
      (item) =>
        item.id === String(productId) &&
        item.restaurantId ===
          String(selectedStoreId)
    );

  const getItemQuantity = (
    productId: string | number
  ) => {
    const item = cartItems.find(
      (cartItem) =>
        cartItem.id === String(productId) &&
        cartItem.restaurantId ===
          String(selectedStoreId)
    );

    return item ? item.quantity : 0;
  };

  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const handleAddToCart = (
    product: any
  ) => {
    if (!selectedStoreId) {
      Alert.alert(
        'Error',
        'No store selected'
      );

      return;
    }

    const cartItem = {
      id: String(product.id),
      name: product.name,
      price: Number(
        product.selling_price || 0
      ),
      quantity: 1,
      image:
        product.image ||
        'https://placehold.co/150x150',
      restaurantId:
        String(selectedStoreId),
      restaurantName:
        storeName || 'Store',
      gst_rate: Number(
        product.gst_rate || 0
      ),
      category: product.category,
    };

    const restaurantData = {
      id: String(selectedStoreId),
      name: storeName || 'Store',
      rating: 4.5,
      deliveryTime: 'In Stock',
      cuisine:
        product.category || 'General',
      image:
        product.image ||
        'https://placehold.co/150x150',
      costForTwo:
        `₹${product.selling_price}`,
      address:
        product.description ||
        'Available in stock',
      isVeg: true,
      offer:
        `Stock: ${product.stock_qty || 0} units`,

      productData: {
        id: String(product.id),
        price: Number(
          product.selling_price || 0
        ),
        stock: Number(
          product.stock_qty || 0
        ),
        category: product.category,
        description:
          product.description,
        brand: product.brand,
        vendor: product.vendor,
        gst:
          product.gst_rate || 0,
        unit: product.unit,
        barcode: product.barcode,
        sku: product.sku,
        image: product.image,
        name: product.name,
      },
    };

    addToCart(
      cartItem,
      restaurantData
    );

    Alert.alert(
      'Added to Cart',
      `${product.name} added to cart!`
    );
  };

  // --------------------------------------------------
  // UPDATE QUANTITY
  // --------------------------------------------------

  const handleUpdateQuantity = (
    product: any,
    newQuantity: number
  ) => {
    if (!selectedStoreId) return;

    const productId =
      String(product.id);

    const shopId =
      String(selectedStoreId);

    if (newQuantity === 0) {
      removeFromCart(
        productId,
        shopId
      );
    } else {
      updateQuantity(
        productId,
        shopId,
        newQuantity
      );
    }
  };

  // --------------------------------------------------
  // PRODUCT DETAIL
  // --------------------------------------------------

  const handleProductPress = (
    product: any
  ) => {
    navigation.navigate(
      'ProductDetail',
      {
        product: {
          ...product,
          storeId: selectedStoreId,
          storeName: storeName,
        },
      }
    );
  };

  // --------------------------------------------------
  // CART TOTAL
  // --------------------------------------------------

  const getCartTotal = () => {
    const storeCartItems =
      cartItems.filter(
        (item) =>
          item.restaurantId ===
          String(selectedStoreId)
      );

    const totalItems =
      storeCartItems.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );

    const totalPrice =
      storeCartItems.reduce(
        (sum, item) =>
          sum +
          item.price *
            item.quantity,
        0
      );

    return {
      totalItems,
      totalPrice,
    };
  };

  const {
    totalItems,
    totalPrice,
  } = getCartTotal();

  // --------------------------------------------------
  // NAVIGATE TO CART
  // --------------------------------------------------

  const navigateToCart = () => {
    if (
      selectedStoreId &&
      storeName
    ) {
      setSelectedBusiness({
        id: selectedStoreId,
        name: storeName,
      });
    }

    navigation.navigate('Cart');
  };

  // --------------------------------------------------
  // PRODUCT CARD
  // --------------------------------------------------

  const renderProduct = ({
    item,
  }: {
    item: any;
  }) => {
    const inCart =
      isItemInCart(item.id);

    const quantity =
      getItemQuantity(item.id);

    const isLowStock =
      (item.stock_qty || 0) > 0 &&
      (item.stock_qty || 0) <= 10;

    const isOutOfStock =
      (item.stock_qty || 0) === 0;

    return (
      <View
        style={[
          styles.productCard,
          {
            width: cardWidth,
          },
        ]}
      >
        {/* PRODUCT IMAGE */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            handleProductPress(item)
          }
        >
          <View
            style={
              styles.productImageWrap
            }
          >
            {item.image ? (
              <Image
                source={{
                  uri: item.image,
                }}
                style={
                  styles.productImage
                }
                resizeMode="contain"
              />
            ) : (
              <View
                style={[
                  styles.productImage,
                  styles.productImagePlaceholder,
                ]}
              >
                <Icon
                  name="image-outline"
                  size={32}
                  color={PALETTE.textSecondary}
                />
              </View>
            )}

            {/* OUT OF STOCK */}
            {isOutOfStock && (
              <View
                style={
                  styles.outOfStockOverlay
                }
              >
                <Text
                  style={
                    styles.outOfStockText
                  }
                >
                  Out of Stock
                </Text>
              </View>
            )}

            {/* LOW STOCK */}
            {isLowStock &&
              !isOutOfStock && (
                <View
                  style={
                    styles.lowStockBadge
                  }
                >
                  <Text
                    style={
                      styles.lowStockBadgeText
                    }
                  >
                    Only {item.stock_qty}{' '}
                    left
                  </Text>
                </View>
              )}
          </View>
        </TouchableOpacity>

        {/* PRODUCT DETAILS */}
        <View
          style={styles.productCardBody}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              handleProductPress(item)
            }
          >
            {/* CATEGORY */}
            <Text
              style={
                styles.productCategory
              }
              numberOfLines={1}
            >
              {(
                item.category ||
                'Uncategorized'
              ).toUpperCase()}
            </Text>

            {/* NAME */}
            <Text
              style={styles.productName}
              numberOfLines={2}
            >
              {item.name ||
                'Unnamed Product'}
            </Text>

            {/* PRICE */}
            <View
              style={styles.priceRow}
            >
              <Text
                style={
                  styles.productPrice
                }
              >
                ₹
                {item.selling_price ||
                  0}
              </Text>
            </View>
          </TouchableOpacity>

          {/* CART ACTION */}
          <View
            style={
              styles.productActionRow
            }
          >
            {/* OUT OF STOCK */}
            {isOutOfStock ? (
              <View
                style={
                  styles.disabledAddButton
                }
              >
                <Text
                  style={
                    styles.disabledAddButtonText
                  }
                >
                  Unavailable
                </Text>
              </View>
            ) : inCart ? (
              /* QUANTITY */
              <View
                style={
                  styles.quantityContainer
                }
              >
                <TouchableOpacity
                  style={
                    styles.quantityButton
                  }
                  onPress={() =>
                    handleUpdateQuantity(
                      item,
                      quantity - 1
                    )
                  }
                >
                  <Icon
                    name="remove"
                    size={15}
                    color={
                      PALETTE.primary
                    }
                  />
                </TouchableOpacity>

                <Text
                  style={
                    styles.quantityText
                  }
                >
                  {quantity}
                </Text>

                <TouchableOpacity
                  style={
                    styles.quantityButton
                  }
                  onPress={() =>
                    handleUpdateQuantity(
                      item,
                      quantity + 1
                    )
                  }
                >
                  <Icon
                    name="add"
                    size={15}
                    color={
                      PALETTE.primary
                    }
                  />
                </TouchableOpacity>
              </View>
            ) : (
              /* ADD */
              <TouchableOpacity
                style={
                  styles.addButton
                }
                onPress={() =>
                  handleAddToCart(item)
                }
                activeOpacity={0.8}
              >
                <Icon
                  name="add"
                  size={14}
                  color={
                    PALETTE.white
                  }
                />

                <Text
                  style={
                    styles.addButtonText
                  }
                >
                  ADD
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  // --------------------------------------------------
  // CATEGORY CHIP
  // --------------------------------------------------

  const renderCategoryChip = (
    category: string
  ) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory ===
          category &&
          styles.categoryChipActive,
      ]}
      activeOpacity={0.75}
      onPress={() => {
        setSelectedCategory(
          category
        );

        if (
          searchQuery.trim()
            .length > 0
        ) {
          setSearchQuery('');
        }
      }}
    >
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory ===
            category &&
            styles.categoryChipTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  // --------------------------------------------------
  // FILTER SIDEBAR
  // --------------------------------------------------

  const renderFilterSidebar = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={
        filterSidebarVisible
      }
      onRequestClose={() =>
        setFilterSidebarVisible(
          false
        )
      }
    >
      <View
        style={
          styles.sidebarOverlay
        }
      >
        <TouchableWithoutFeedback
          onPress={() =>
            setFilterSidebarVisible(
              false
            )
          }
        >
          <View
            style={
              styles.sidebarBackground
            }
          />
        </TouchableWithoutFeedback>

        <View
          style={
            styles.sidebarContent
          }
        >
          {/* SIDEBAR HEADER */}
          <View
            style={
              styles.sidebarHeader
            }
          >
            <Text
              style={
                styles.sidebarTitle
              }
            >
              Filters
            </Text>

            <TouchableOpacity
              onPress={() =>
                setFilterSidebarVisible(
                  false
                )
              }
              style={
                styles.sidebarCloseButton
              }
            >
              <Icon
                name="close"
                size={22}
                color={PALETTE.text}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.sidebarScrollContent
            }
          >
            {/* CATEGORY */}
            <View
              style={
                styles.filterSection
              }
            >
              <Text
                style={
                  styles.filterSectionTitle
                }
              >
                Category
              </Text>

              <View
                style={
                  styles.categoryList
                }
              >
                {categories.map(
                  (category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.sidebarCategoryItem,
                        tempSelectedCategory ===
                          category &&
                          styles.sidebarCategoryItemActive,
                      ]}
                      onPress={() =>
                        setTempSelectedCategory(
                          category
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.sidebarCategoryText,
                          tempSelectedCategory ===
                            category &&
                            styles.sidebarCategoryTextActive,
                        ]}
                      >
                        {category}
                      </Text>

                      {tempSelectedCategory ===
                        category && (
                        <Icon
                          name="checkmark"
                          size={18}
                          color={
                            PALETTE.primary
                          }
                        />
                      )}
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {/* PRICE */}
            <View
              style={
                styles.filterSection
              }
            >
              <Text
                style={
                  styles.filterSectionTitle
                }
              >
                Price Range
              </Text>

              <View
                style={
                  styles.priceRangeContainer
                }
              >
                <View
                  style={
                    styles.priceInputWrapper
                  }
                >
                  <Text
                    style={
                      styles.priceLabel
                    }
                  >
                    Min (₹)
                  </Text>

                  <TextInput
                    style={
                      styles.priceInput
                    }
                    placeholder="0"
                    placeholderTextColor={
                      PALETTE.textSecondary
                    }
                    keyboardType="numeric"
                    value={
                      priceRange.min
                    }
                    onChangeText={(
                      text
                    ) =>
                      setPriceRange({
                        ...priceRange,
                        min: text,
                      })
                    }
                  />
                </View>

                <Text
                  style={
                    styles.priceSeparator
                  }
                >
                  -
                </Text>

                <View
                  style={
                    styles.priceInputWrapper
                  }
                >
                  <Text
                    style={
                      styles.priceLabel
                    }
                  >
                    Max (₹)
                  </Text>

                  <TextInput
                    style={
                      styles.priceInput
                    }
                    placeholder="Any"
                    placeholderTextColor={
                      PALETTE.textSecondary
                    }
                    keyboardType="numeric"
                    value={
                      priceRange.max
                    }
                    onChangeText={(
                      text
                    ) =>
                      setPriceRange({
                        ...priceRange,
                        max: text,
                      })
                    }
                  />
                </View>
              </View>
            </View>

            {/* SORT */}
            <View
              style={
                styles.filterSection
              }
            >
              <Text
                style={
                  styles.filterSectionTitle
                }
              >
                Sort By
              </Text>

              <View
                style={
                  styles.sortOptions
                }
              >
                {[
                  {
                    value: 'default',
                    label: 'Default',
                  },
                  {
                    value: 'price_low',
                    label:
                      'Price: Low to High',
                  },
                  {
                    value: 'price_high',
                    label:
                      'Price: High to Low',
                  },
                  {
                    value: 'name_asc',
                    label:
                      'Name: A to Z',
                  },
                  {
                    value: 'name_desc',
                    label:
                      'Name: Z to A',
                  },
                ].map((option) => (
                  <TouchableOpacity
                    key={
                      option.value
                    }
                    style={[
                      styles.sortOption,
                      sortBy ===
                        option.value &&
                        styles.sortOptionActive,
                    ]}
                    onPress={() =>
                      setSortBy(
                        option.value
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy ===
                          option.value &&
                          styles.sortOptionTextActive,
                      ]}
                    >
                      {
                        option.label
                      }
                    </Text>

                    {sortBy ===
                      option.value && (
                      <Icon
                        name="checkmark"
                        size={18}
                        color={
                          PALETTE.primary
                        }
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* STOCK FILTER */}
            <View
              style={
                styles.filterSection
              }
            >
              <TouchableOpacity
                style={
                  styles.stockFilter
                }
                onPress={() =>
                  setShowInStock(
                    !showInStock
                  )
                }
              >
                <View
                  style={
                    styles.checkboxContainer
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      showInStock &&
                        styles.checkboxChecked,
                    ]}
                  >
                    {showInStock && (
                      <Icon
                        name="checkmark"
                        size={14}
                        color={
                          PALETTE.white
                        }
                      />
                    )}
                  </View>

                  <Text
                    style={
                      styles.stockFilterText
                    }
                  >
                    Show only in-stock
                    items
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ACTIONS */}
            <View
              style={
                styles.sidebarActions
              }
            >
              <TouchableOpacity
                style={
                  styles.resetButton
                }
                onPress={
                  resetFilters
                }
              >
                <Text
                  style={
                    styles.resetButtonText
                  }
                >
                  Reset All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.applyButton
                }
                onPress={
                  applyFilters
                }
              >
                <Text
                  style={
                    styles.applyButtonText
                  }
                >
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={
            PALETTE.primary
          }
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading products...
        </Text>
      </View>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <SafeAreaView
      style={styles.container}
    >
      {/* HEADER */}
      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.75}
        >
          <Icon
            name="arrow-back-outline"
            size={20}
            color={PALETTE.text}
          />
        </TouchableOpacity>

        <View
          style={styles.headerInfo}
        >
          <Text
            style={
              styles.headerTitle
            }
            numberOfLines={1}
          >
            {storeName ||
              'Products'}
          </Text>

          <View
            style={
              styles.headerSubRow
            }
          >
            {businessDescription ? (
              <Text
                style={
                  styles.headerDescription
                }
                numberOfLines={1}
              >
                {
                  businessDescription
                }
              </Text>
            ) : (
              <Text
                style={
                  styles.headerSubtitle
                }
              >
                {
                  products.length
                }{' '}
                products available
              </Text>
            )}

            {serviceHighlights.length >
              0 && (
              <View
                style={
                  styles.headerHighlightBadge
                }
              >
                <Icon
                  name={getHighlightIconName(
                    serviceHighlights[0]
                      .icon
                  )}
                  size={11}
                  color={
                    PALETTE.primary
                  }
                />

                <Text
                  style={
                    styles.headerHighlightText
                  }
                  numberOfLines={1}
                >
                  {
                    serviceHighlights[0]
                      .title
                  }
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* HEADER ACTIONS */}
        <View
          style={
            styles.headerActions
          }
        >
          <TouchableOpacity
            style={
              styles.iconCircleButton
            }
            onPress={
              toggleSearch
            }
            activeOpacity={0.75}
          >
            <Icon
              name="search-outline"
              size={19}
              color={PALETTE.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconCircleButton,
              styles.cartIconButton,
            ]}
            onPress={
              navigateToCart
            }
            activeOpacity={0.75}
          >
            <Icon
              name="cart-outline"
              size={19}
              color={
                PALETTE.primary
              }
            />

            {cartItems.filter(
              (item) =>
                item.restaurantId ===
                String(
                  selectedStoreId
                )
            ).length > 0 && (
              <View
                style={
                  styles.cartBadge
                }
              >
                <Text
                  style={
                    styles.cartBadgeText
                  }
                >
                  {
                    cartItems.filter(
                      (item) =>
                        item.restaurantId ===
                        String(
                          selectedStoreId
                        )
                    ).length
                  }
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.webCenterWrap}>
        <View
          style={[
            styles.webContentArea,
            isDesktopWeb && styles.webContentAreaDesktop,
          ]}
        >
          {/* SEARCH */}
          {showSearch && (
            <View
              style={
                styles.searchContainer
              }
            >
              <View
                style={
                  styles.searchBar
                }
              >
                <Icon
                  name="search-outline"
                  size={18}
                  color={PALETTE.textSecondary}
                  style={
                    styles.searchIcon
                  }
                />

                <TextInput
                  style={
                    styles.searchInput
                  }
                  placeholder="Search products..."
                  placeholderTextColor={PALETTE.textSecondary}
                  value={searchQuery}
                  onChangeText={
                    setSearchQuery
                  }
                  autoFocus
                  returnKeyType="search"
                />

                {searchQuery.length >
                  0 && (
                  <TouchableOpacity
                    onPress={() =>
                      setSearchQuery('')
                    }
                  >
                    <Icon
                      name="close-circle"
                      size={18}
                      color={PALETTE.textSecondary}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={
                    toggleSearch
                  }
                  style={
                    styles.searchCloseButton
                  }
                >
                  <Text
                    style={
                      styles.searchCloseText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>

              {searchQuery.length >
                0 && (
                <View
                  style={
                    styles.searchResultHeader
                  }
                >
                  <Text
                    style={
                      styles.searchResultCount
                    }
                  >
                    {
                      filteredProducts.length
                    }{' '}
                    results found for "
                    {searchQuery}"
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* CATEGORIES */}
          {!showSearch && (
            <View
              style={
                styles.categoriesWrapper
              }
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                contentContainerStyle={
                  styles.categoriesContainer
                }
              >
                {categories.map(
                  renderCategoryChip
                )}
              </ScrollView>
            </View>
          )}

          {/* FILTER ROW */}
          {!showSearch && (
            <View
              style={styles.filterRow}
            >
              <View>
                <Text
                  style={
                    styles.filterTitle
                  }
                >
                  {selectedCategory ===
                  'All'
                    ? 'All Products'
                    : selectedCategory}
                  <Text style={styles.filterCount}>
                    {' '}
                    (
                    {
                      filteredProducts.length
                    }
                    )
                  </Text>
                </Text>
              </View>

              <View
                style={
                  styles.filterSpacer
                }
              />

              <TouchableOpacity
                style={
                  styles.filterButton
                }
                onPress={() => {
                  setTempSelectedCategory(
                    selectedCategory
                  );
                  setFilterSidebarVisible(
                    true
                  );
                }}
                activeOpacity={0.75}
              >
                <Icon
                  name="options-outline"
                  size={16}
                  color={
                    PALETTE.primary
                  }
                />

                <Text
                  style={
                    styles.filterButtonText
                  }
                >
                  Filter
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PRODUCT LIST */}
          <CompatibleFlatList
            key={numColumns}
            data={filteredProducts}
            renderItem={
              renderProduct
            }
            keyExtractor={(
              item: any
            ) => String(item.id)}
            numColumns={
              numColumns
            }
            columnWrapperStyle={
              numColumns > 1
                ? styles.productRowWrapper
                : undefined
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 14,
              paddingBottom: 120,
            }}
            ListEmptyComponent={
              <View
                style={
                  styles.emptyContainer
                }
              >
                <View style={styles.emptyIconCircle}>
                  <Icon
                    name={
                      searchQuery.trim().length > 0
                        ? 'search-outline'
                        : 'cube-outline'
                    }
                    size={40}
                    color={PALETTE.primary}
                  />
                </View>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  {searchQuery.trim()
                    .length > 0
                    ? 'No products match your search'
                    : 'No products available'}
                </Text>

                <Text
                  style={
                    styles.emptySubtext
                  }
                >
                  {searchQuery.trim()
                    .length > 0
                    ? 'Try searching with different keywords'
                    : "This store doesn't have any products yet"}
                </Text>

                {searchQuery.trim()
                  .length > 0 && (
                  <TouchableOpacity
                    style={styles.clearSearchButton}
                    onPress={() =>
                      setSearchQuery('')
                    }
                    activeOpacity={0.8}
                  >
                    <Text
                      style={
                        styles.clearSearchText
                      }
                    >
                      Clear Search
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        </View>
      </View>

      {/* FILTER MODAL */}
      {renderFilterSidebar()}

      {/* BOTTOM CART BAR */}
      {totalItems > 0 && (
        <View
          style={
            styles.bottomCartBarWrap
          }
        >
          <View
            style={
              styles.bottomCartBar
            }
          >
            <View
              style={
                styles.cartInfo
              }
            >
              <Text
                style={
                  styles.cartItemsCount
                }
              >
                {totalItems} items
              </Text>

              <Text
                style={
                  styles.cartTotalPrice
                }
              >
                ₹{totalPrice}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.viewCartButton
              }
              onPress={
                navigateToCart
              }
              activeOpacity={0.85}
            >
              <Text
                style={
                  styles.viewCartText
                }
              >
                View Cart
              </Text>

              <Icon
                name="chevron-forward"
                size={18}
                color={
                  PALETTE.white
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({
  // --------------------------------------------------
  // CONTAINER
  // --------------------------------------------------
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },

  webCenterWrap: {
    flex: 1,
    width: '100%',
  },

  webContentArea: {
    flex: 1,
    width: '100%',
  },

  webContentAreaDesktop: {
    width: '100%',
  },

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PALETTE.white,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: PALETTE.textSecondary,
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: PALETTE.white,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PALETTE.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.text,
    fontFamily: FONT_FAMILY,
  },

  headerSubtitle: {
    fontSize: 12,
    color: PALETTE.textSecondary,
    marginTop: 3,
    fontFamily: FONT_FAMILY,
  },

  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    flexShrink: 1,
  },

  headerDescription: {
    fontSize: 12,
    color: PALETTE.textSecondary,
    lineHeight: 16,
    flexShrink: 1,
    fontFamily: FONT_FAMILY,
  },

  headerHighlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.softPurple,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
    flexShrink: 0,
  },

  headerHighlightText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.primary,
    marginLeft: 4,
    fontFamily: FONT_FAMILY,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PALETTE.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    position: 'relative',
    ...(Platform.OS === 'web'
      ? { cursor: 'pointer' }
      : {}),
  },

  cartIconButton: {
    backgroundColor: PALETTE.softPurple,
  },

  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: PALETTE.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PALETTE.white,
  },

  cartBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: PALETTE.white,
    paddingHorizontal: 3,
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------
  searchContainer: {
    backgroundColor: PALETTE.white,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#E7E2FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: PALETTE.text,
    paddingVertical: 8,
    fontFamily: FONT_FAMILY,
  },

  searchCloseButton: {
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  searchCloseText: {
    color: PALETTE.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },

  searchResultHeader: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },

  searchResultCount: {
    fontSize: 12,
    color: PALETTE.textSecondary,
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // CATEGORIES
  // --------------------------------------------------
  categoriesWrapper: {
    backgroundColor: PALETTE.white,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },

  categoriesContainer: {
    paddingHorizontal: 16,
  },

  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: PALETTE.lightPurple,
    marginRight: 10,
    ...(Platform.OS === 'web'
      ? { cursor: 'pointer' }
      : {}),
  },

  categoryChipActive: {
    backgroundColor: PALETTE.primary,
  },

  categoryChipText: {
    fontSize: 13,
    color: PALETTE.primary,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
  },

  categoryChipTextActive: {
    color: PALETTE.white,
  },

  // --------------------------------------------------
  // FILTER ROW
  // --------------------------------------------------
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.text,
    fontFamily: FONT_FAMILY,
  },

  filterCount: {
    fontSize: 14,
    fontWeight: '400',
    color: PALETTE.textSecondary,
    fontFamily: FONT_FAMILY,
  },

  filterSpacer: {
    flex: 1,
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: PALETTE.white,
    borderWidth: 1,
    borderColor: '#E8E4F5',
    ...(Platform.OS === 'web'
      ? { cursor: 'pointer' }
      : {}),
  },

  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.primary,
    marginLeft: 6,
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // PRODUCT GRID
  // --------------------------------------------------
  productRowWrapper: {
    justifyContent: 'flex-start',
    gap: 16,
  },

  // --------------------------------------------------
  // PRODUCT CARD
  // --------------------------------------------------
  productCard: {
    position: 'relative',
    backgroundColor: PALETTE.white,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: '#5541D7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  // --------------------------------------------------
  // PRODUCT IMAGE
  // --------------------------------------------------
  productImageWrap: {
    position: 'relative',
    backgroundColor: '#F7F5FF',
  },

  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F7F5FF',
  },

  productImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  lowStockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FFF1E0',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  lowStockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B8630C',
    fontFamily: FONT_FAMILY,
  },

  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  outOfStockText: {
    fontSize: 12,
    fontWeight: '700',
    color: PALETTE.text,
    backgroundColor: PALETTE.white,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    overflow: 'hidden',
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // PRODUCT DETAILS
  // --------------------------------------------------
  productCardBody: {
    padding: 12,
  },

  productCategory: {
    fontSize: 10,
    color: PALETTE.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.4,
    fontFamily: FONT_FAMILY,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.text,
    marginBottom: 8,
    minHeight: 38,
    lineHeight: 19,
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // PRICE
  // --------------------------------------------------
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: PALETTE.primary,
    fontFamily: FONT_FAMILY,
  },

  productActionRow: {
    alignItems: 'flex-start',
  },

  // --------------------------------------------------
  // ADD BUTTON
  // --------------------------------------------------
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 9,
    minWidth: 76,
    gap: 4,
    ...(Platform.OS === 'web'
      ? { cursor: 'pointer' }
      : {}),
  },

  addButtonText: {
    color: PALETTE.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: FONT_FAMILY,
  },

  disabledAddButton: {
    backgroundColor: '#F2F1F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: 'center',
  },

  disabledAddButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // QUANTITY
  // --------------------------------------------------
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: PALETTE.primary,
    borderRadius: 10,
    backgroundColor: '#F5F2FF',
    paddingHorizontal: 3,
    minWidth: 92,
  },

  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    ...(Platform.OS === 'web'
      ? { cursor: 'pointer' }
      : {}),
  },

  quantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.text,
    minWidth: 20,
    textAlign: 'center',
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // EMPTY STATE
  // --------------------------------------------------
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 24,
  },

  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: PALETTE.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.text,
    marginTop: 2,
    textAlign: 'center',
    fontFamily: FONT_FAMILY,
  },

  emptySubtext: {
    fontSize: 13,
    color: PALETTE.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: FONT_FAMILY,
  },

  clearSearchButton: {
    marginTop: 18,
    backgroundColor: PALETTE.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  clearSearchText: {
    fontSize: 14,
    color: PALETTE.white,
    fontWeight: '700',
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // FILTER SIDEBAR
  // --------------------------------------------------
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },

  sidebarBackground: {
    flex: 1,
    backgroundColor: 'rgba(30,27,46,0.45)',
  },

  sidebarContent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: Math.min(width * 0.85, 380),
    backgroundColor: PALETTE.white,
    paddingHorizontal: 22,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: -4,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },

  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.text,
    fontFamily: FONT_FAMILY,
  },

  sidebarCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PALETTE.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sidebarScrollContent: {
    paddingBottom: 30,
  },

  filterSection: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },

  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.text,
    marginBottom: 12,
    fontFamily: FONT_FAMILY,
  },

  categoryList: {
    gap: 4,
  },

  sidebarCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  sidebarCategoryItemActive: {
    backgroundColor: PALETTE.lightPurple,
  },

  sidebarCategoryText: {
    fontSize: 14,
    color: PALETTE.text,
    fontFamily: FONT_FAMILY,
  },

  sidebarCategoryTextActive: {
    color: PALETTE.primary,
    fontWeight: '700',
  },

  // PRICE RANGE
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  priceInputWrapper: {
    flex: 1,
  },

  priceLabel: {
    fontSize: 12,
    color: PALETTE.textSecondary,
    marginBottom: 5,
    fontFamily: FONT_FAMILY,
  },

  priceInput: {
    borderWidth: 1,
    borderColor: '#E5E1F2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: PALETTE.text,
    fontFamily: FONT_FAMILY,
  },

  priceSeparator: {
    fontSize: 16,
    color: PALETTE.textSecondary,
    paddingHorizontal: 4,
    marginTop: 14,
  },

  // SORT
  sortOptions: {
    gap: 4,
  },

  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  sortOptionActive: {
    backgroundColor: PALETTE.lightPurple,
  },

  sortOptionText: {
    fontSize: 14,
    color: PALETTE.text,
    fontFamily: FONT_FAMILY,
  },

  sortOptionTextActive: {
    color: PALETTE.primary,
    fontWeight: '700',
  },

  // STOCK
  stockFilter: {
    paddingVertical: 4,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D9D4EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  checkboxChecked: {
    backgroundColor: PALETTE.primary,
    borderColor: PALETTE.primary,
  },

  stockFilterText: {
    fontSize: 14,
    color: PALETTE.text,
    fontFamily: FONT_FAMILY,
  },

  // SIDEBAR ACTIONS
  sidebarActions: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },

  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E1F2',
    alignItems: 'center',
    backgroundColor: PALETTE.white,
  },

  resetButtonText: {
    fontSize: 15,
    color: PALETTE.text,
    fontWeight: '700',
    fontFamily: FONT_FAMILY,
  },

  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: PALETTE.primary,
    alignItems: 'center',
  },

  applyButtonText: {
    fontSize: 15,
    color: PALETTE.white,
    fontWeight: '700',
    fontFamily: FONT_FAMILY,
  },

  // --------------------------------------------------
  // BOTTOM CART
  // --------------------------------------------------
  bottomCartBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },

  bottomCartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 560,
    backgroundColor: PALETTE.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: '#5541D7',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },

  cartInfo: {
    flexDirection: 'column',
  },

  cartItemsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.textSecondary,
    fontFamily: FONT_FAMILY,
  },

  cartTotalPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: PALETTE.text,
    marginTop: 2,
    fontFamily: FONT_FAMILY,
  },

  viewCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
    ...(Platform.OS === 'web'
      ? { cursor: 'pointer' }
      : {}),
  },

  viewCartText: {
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.white,
    marginRight: 2,
    fontFamily: FONT_FAMILY,
  },
});