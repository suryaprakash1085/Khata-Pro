// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   Platform,
//   Pressable,
//   ScrollView,
//   Share,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   TouchableOpacity,
//   Modal,
//   useWindowDimensions,
// } from 'react-native';
// import { router, Stack, useLocalSearchParams } from 'expo-router';
// import { useFocusEffect } from '@react-navigation/native';
// import { Feather } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useQueryClient } from '@tanstack/react-query';
// import { useColors } from '@/hooks/useColors';
// import { useBusiness } from '@/contexts/BusinessContext';
// import { useAuth } from '@/contexts/AuthContext';
// import { PrimaryButton } from '@/components/PrimaryButton';
// import { BarcodeScanModal } from '@/components/BarcodeScanModal';
// import { formatCurrency } from '@/lib/format';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   useListProducts,
//   useListCustomers,
//   useCreateCustomer,
//   useCreateTransaction,
//   useUpdateProduct,
//   TransactionInputType,
//   TransactionInputPaymentMode,
//   getListProductsQueryKey,
//   getListCustomersQueryKey,
//   useListActivePromotions,
//   getListActivePromotionsQueryKey,
// } from '@workspace/api-client-react';
// // @ts-ignore
// import type { Product, Customer } from '@workspace/api-client-react';

// // ---------------------------------------------------------------------------
// // Responsive breakpoint — below this, the 2-panel POS layout collapses
// // into a single stacked mobile flow.
// // ---------------------------------------------------------------------------
// const WIDE_BREAKPOINT = 900;
// const F = 'times new roman';

// type CartItemWithDiscount = { product: Product; qty: number; discountPercent: number;
//   freeQty: number;       // 0 unless BOGO
//   isBogo: boolean;
//   promotionId?: number;
//   promotionName?: string; };
// type PaymentMethod = 'cash' | 'upi' | 'card' | 'split' | 'credit';

// const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: keyof typeof Feather.glyphMap; color: string }[] = [
//   { value: 'cash', label: 'Cash', icon: 'dollar-sign', color: '#16A34A' }, // icon overridden to ₹ — see PaymentIcon
//   { value: 'card', label: 'Card', icon: 'credit-card', color: '#2563EB' },
//   { value: 'upi', label: 'UPI', icon: 'smartphone', color: '#7C3AED' },
//   { value: 'split', label: 'Split', icon: 'divide', color: '#D97706' },
//   { value: 'credit', label: 'Credit', icon: 'clock', color: '#DC2626' },
// ];

// // Feather has no rupee glyph — render ₹ as text for cash, Feather icon for everything else.
// function PaymentIcon({ method, icon, size, color }: { method: PaymentMethod; icon: keyof typeof Feather.glyphMap; size: number; color: string }) {
//   if (method === 'cash') {
//     return <Text style={{ fontSize: size, fontWeight: '800', color, lineHeight: size + 1 }}>₹</Text>;
//   }
//   return <Feather name={icon} size={size} color={color} />;
// }

// const CATEGORY_STYLE: Record<string, { icon: keyof typeof Feather.glyphMap; color: string }> = {
//   dairy: { icon: 'droplet', color: '#2563EB' },
//   milk: { icon: 'droplet', color: '#2563EB' },
//   snacks: { icon: 'coffee', color: '#D97706' },
//   drinks: { icon: 'coffee', color: '#14B8A6' },
//   grocery: { icon: 'shopping-bag', color: '#16A34A' },
//   fruits: { icon: 'shopping-bag', color: '#DC2626' },
//   'personal care': { icon: 'user', color: '#8B5CF6' },
//   'home care': { icon: 'home', color: '#EA580C' },
//   stationery: { icon: 'edit-3', color: '#0EA5E9' },
//   'stationery items': { icon: 'edit-3', color: '#0EA5E9' },
//   'tea powder': { icon: 'coffee', color: '#92400E' },
// };
// const CATEGORY_FALLBACKS: { icon: keyof typeof Feather.glyphMap; color: string }[] = [
//   { icon: 'tag', color: '#2563EB' },
//   { icon: 'box', color: '#14B8A6' },
//   { icon: 'grid', color: '#8B5CF6' },
//   { icon: 'star', color: '#F59E0B' },
// ];
// function categoryIcon(name: string): keyof typeof Feather.glyphMap {
//   return CATEGORY_STYLE[name.toLowerCase()]?.icon ?? CATEGORY_FALLBACKS[name.length % CATEGORY_FALLBACKS.length].icon;
// }
// function categoryColor(name: string): string {
//   return CATEGORY_STYLE[name.toLowerCase()]?.color ?? CATEGORY_FALLBACKS[name.length % CATEGORY_FALLBACKS.length].color;
// }

// const UNIT_LABELS: Record<string, string> = {
//   kg: 'Kg', kilogram: 'Kg', kilograms: 'Kg',
//   g: 'g', gram: 'g', grams: 'g',
//   l: 'Ltr', litre: 'Ltr', litres: 'Ltr', liter: 'Ltr', liters: 'Ltr', ltr: 'Ltr',
//   ml: 'ml',
//   pcs: 'Pcs', piece: 'Pcs', pieces: 'Pcs', pc: 'Pcs',
//   box: 'Box', boxes: 'Box',
//   dozen: 'Dz',
// };
// function unitLabel(unit?: string | null): string {
//   if (!unit) return 'Pcs';
//   const key = unit.trim().toLowerCase();
//   return UNIT_LABELS[key] ?? (unit.charAt(0).toUpperCase() + unit.slice(1));
// }

// function mapPaymentMethodToApi(method: PaymentMethod): TransactionInputPaymentMode {
//   switch (method) {
//     case 'cash':
//       return TransactionInputPaymentMode.cash;
//     case 'upi':
//       return TransactionInputPaymentMode.upi;
//     default:
//       return TransactionInputPaymentMode.online;
//   }
// }

// const STORAGE_KEYS = {
//   SALES_PERSON: '@billing_sales_person',
//   COUNTER: '@billing_counter',
//   INVOICE_NUMBER: '@billing_invoice_number',
//   WALKIN_CUSTOMER_ID: '@billing_walkin_customer_id',
//   HELD_BILLS: '@billing_held_bills',
//   DRAFT_BILLS: '@billing_draft_bills',
//   AUTOSAVE_BILL: '@billing_autosave_bill',
// };

// type SavedBill = {
//   id: string;
//   kind: 'hold' | 'draft';
//   savedAt: string;
//   invoiceNumber: string;
//   cart: CartItemWithDiscount[];
//   customer: Customer | null;
//   discountValue: string;
//   paymentMethod: PaymentMethod;
// };

// export default function BillingScreen() {
//   const colors = useColors();
//   const insets = useSafeAreaInsets();
//   const { business } = useBusiness();
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const { width } = useWindowDimensions();
//   const isWide = width >= WIDE_BREAKPOINT;

//   const payParams = useLocalSearchParams<{
//     customer_id?: string;
//     customer_name?: string;
//     invoice_number?: string;
//     due_amount?: string;
//   }>();

//   const [search, setSearch] = useState('');
//   const [cart, setCart] = useState<CartItemWithDiscount[]>([]);
//   const [activeCategory, setActiveCategory] = useState<string>('All');

//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
//   const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
//   const [customerSearch, setCustomerSearch] = useState('');

//   // ---- Add new customer popup ----
//   const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
//   const [newCustomerName, setNewCustomerName] = useState('');
//   const [newCustomerPhone, setNewCustomerPhone] = useState('');
//   const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

//   const [salesPerson, setSalesPerson] = useState('');
//   const [counter, setCounter] = useState('1');
//   const [invoiceNumber, setInvoiceNumber] = useState('INV-0001');
//   const [billingDate] = useState(new Date());

//   const [discountValue, setDiscountValue] = useState('0');
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
//   const [splitMethod1, setSplitMethod1] = useState<PaymentMethod>('cash');
//   const [splitAmount1, setSplitAmount1] = useState('');
//   const [splitMethod2, setSplitMethod2] = useState<PaymentMethod>('upi');
//   const [splitAmount2, setSplitAmount2] = useState('');
//   const [amountReceived, setAmountReceived] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const [scannerOpen, setScannerOpen] = useState(false);
//   const pendingScanRef = useRef<string | null>(null);

//   // ---- Result / confirm modal (replaces Alert.alert, which is unreliable on web) ----
//   // Only used for 'error' and 'confirm' now — success messages use the bottom
//   // banner (successBanner) instead of a blocking popup.
//   const [resultModal, setResultModal] = useState<{
//     type: 'error' | 'confirm';
//     title: string;
//     message: string;
//     onConfirm?: () => void;
//   } | null>(null);

//   // ---- Success banner — small amber bar near the bottom action buttons,
//   // replaces the old centered "Payment completed" popup. ----
//   const [successBanner, setSuccessBanner] = useState<{
//     title: string;
//     message: string;
//     showPrintButton?: boolean;
//     onConfirm?: () => void;
//   } | null>(null);

//   // ---- Print receipt ----
//   const [printVisible, setPrintVisible] = useState(false);
//   const [printData, setPrintData] = useState<{
//     invoiceNumber: string;
//     date: Date;
//     cashier: string;
//     customerName: string;
//     cart: CartItemWithDiscount[];
//     totals: { subtotal: number; gst: number; billDiscount: number; roundOff: number; grandTotal: number };
//     paymentMethod: PaymentMethod;
//   } | null>(null);

//   // ---- Recall (held / draft bills) ----
//   const [recallVisible, setRecallVisible] = useState(false);
//   const [savedBills, setSavedBills] = useState<SavedBill[]>([]);

//   // ---- Auto-saved in-progress bill (silently saved when the cashier navigates
//   // away mid-bill, e.g. taps BillingList in the sidebar) ----
//   const [resumeBill, setResumeBill] = useState<SavedBill | null>(null);

//   const createCustomer = useCreateCustomer();

//  useEffect(() => {
//   (async () => {
//     if ((user as any)?.name) {
//       setSalesPerson((user as any).name);
//     } else {
//       const p = await AsyncStorage.getItem(STORAGE_KEYS.SALES_PERSON);
//       if (p) setSalesPerson(p);
//     }

//     const c = await AsyncStorage.getItem(STORAGE_KEYS.COUNTER);
//     if (c) setCounter(c);

//     const inv = await AsyncStorage.getItem(STORAGE_KEYS.INVOICE_NUMBER);
//     if (inv) setInvoiceNumber(inv);
//     else await AsyncStorage.setItem(STORAGE_KEYS.INVOICE_NUMBER, 'INV-0001');

//     // If a previous session left an in-progress bill behind (cashier navigated
//     // away mid-bill), offer to resume it.
//     const autosaveRaw = await AsyncStorage.getItem(STORAGE_KEYS.AUTOSAVE_BILL);
//     if (autosaveRaw) {
//       try {
//         const parsed: SavedBill = JSON.parse(autosaveRaw);
//         if (parsed && Array.isArray(parsed.cart) && parsed.cart.length > 0) {
//           setResumeBill(parsed);
//         }
//       } catch {
//         // ignore corrupt autosave data
//       }
//     }
//   })();
// }, [user]);

//   // Keep refs of the latest cart/customer/discount/payment/invoice so the
//   // focus-blur cleanup below always autosaves the current values, not stale
//   // ones captured at mount time.
//   const cartRef = useRef(cart);
//   const selectedCustomerRef = useRef(selectedCustomer);
//   const discountValueRef = useRef(discountValue);
//   const paymentMethodRef = useRef(paymentMethod);
//   const invoiceNumberRef = useRef(invoiceNumber);
//   useEffect(() => { cartRef.current = cart; }, [cart]);
//   useEffect(() => { selectedCustomerRef.current = selectedCustomer; }, [selectedCustomer]);
//   useEffect(() => { discountValueRef.current = discountValue; }, [discountValue]);
//   useEffect(() => { paymentMethodRef.current = paymentMethod; }, [paymentMethod]);
//   useEffect(() => { invoiceNumberRef.current = invoiceNumber; }, [invoiceNumber]);

//   // Silently autosave the in-progress bill whenever this screen loses focus
//   // (cashier taps BillingList, Reports, etc. with items still in the cart) —
//   // no toast, no interruption. Cleared once the cart is empty again.
//   useFocusEffect(
//     useCallback(() => {
//       return () => {
//         const currentCart = cartRef.current;
//         if (currentCart && currentCart.length > 0) {
//           const bill: SavedBill = {
//             id: 'autosave',
//             kind: 'hold',
//             savedAt: new Date().toISOString(),
//             invoiceNumber: invoiceNumberRef.current,
//             cart: currentCart,
//             customer: selectedCustomerRef.current,
//             discountValue: discountValueRef.current,
//             paymentMethod: paymentMethodRef.current,
//           };
//           AsyncStorage.setItem(STORAGE_KEYS.AUTOSAVE_BILL, JSON.stringify(bill)).catch(() => {});
//         } else {
//           AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
//         }
//       };
//     }, []),
//   );

//   const handleResumeAutosave = () => {
//     if (!resumeBill) return;
//     setCart(resumeBill.cart ?? []);
//     setSelectedCustomer(resumeBill.customer);
//     setDiscountValue(resumeBill.discountValue);
//     setPaymentMethod(resumeBill.paymentMethod);
//     setInvoiceNumber(resumeBill.invoiceNumber);
//     setResumeBill(null);
//     AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
//   };

//   const handleDiscardAutosave = () => {
//     setResumeBill(null);
//     AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
//   };

//   useEffect(() => {
//     if (payParams.customer_id) {
//       setSelectedCustomer({ id: Number(payParams.customer_id), name: payParams.customer_name || 'Customer' } as Customer);
//       router.setParams({ customer_id: undefined, customer_name: undefined } as any);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [payParams.customer_id]);

//   const generateNextInvoiceNumber = async () => {
//     const current = await AsyncStorage.getItem(STORAGE_KEYS.INVOICE_NUMBER);
//     const num = current ? parseInt(current.split('-')[1], 10) : 1;
//     const next = `INV-${String(num + 1).padStart(4, '0')}`;
//     await AsyncStorage.setItem(STORAGE_KEYS.INVOICE_NUMBER, next);
//     setInvoiceNumber(next);
//   };

//   // -------------------------------------------------------------------------
//   // Products
//   // -------------------------------------------------------------------------
//   const allProductsParams = { business_id: business?.id as number, limit: 200 };
//   const { data: allProductsData, isLoading: loadingAllProducts } = useListProducts(allProductsParams, {
//     query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(allProductsParams) },
//   });
//   const allProducts: Product[] = allProductsData?.data ?? [];

//   const categories = useMemo(() => {
//     const set = new Set<string>();
//     allProducts.forEach((p: any) => {
//       if (p?.category) set.add(p.category);
//     });
//     return ['All', ...Array.from(set)];
//   }, [allProducts]);

//   const quickProducts = useMemo(() => allProducts.slice(0, 8), [allProducts]);

//   const searchParams = { business_id: business?.id as number, search: search.trim(), limit: 30 };
//   const { data: searchData, isLoading: isSearching } = useListProducts(searchParams, {
//     query: { enabled: !!business?.id && search.trim().length > 0, queryKey: getListProductsQueryKey(searchParams) },
//   });
//   const searchResults: Product[] = searchData?.data ?? [];

//   const visibleProducts = useMemo(() => {
//     if (search.trim().length > 0) return searchResults;
//     if (activeCategory === 'All') return [];
//     return allProducts.filter((p: any) => p?.category === activeCategory);
//   }, [search, searchResults, allProducts, activeCategory]);

//  useEffect(() => {
//   const pending = pendingScanRef.current;
//   if (!pending || isSearching) return;
//   if (search.trim() !== pending) return;

//   const exact = searchResults.find((p: any) => p.barcode === pending || p.sku === pending);
//   const match = exact ?? (searchResults.length === 1 ? searchResults[0] : undefined);

//   if (match) {
//     addToCart(match);
//     setSearch('');
//   } else if (searchResults.length === 0) {
//     const isBarcodeLike = /^\d{4,}$/.test(pending);
//     setResultModal({
//       type: 'error',
//       title: 'Product not found',
//       message: isBarcodeLike
//         ? 'Product not found for this barcode.'
//         : `No product matches "${pending}". Check the barcode or try a shorter name.`,
//     });
//   } else {
//     setResultModal({
//       type: 'error',
//       title: 'Multiple matches',
//       message: `"${pending}" matched ${searchResults.length} products. Type more of the name, or scan the exact barcode.`,
//     });
//   }
//   pendingScanRef.current = null;
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [searchResults, isSearching, search]);

//   const customerSearchParams = { business_id: business?.id as number, search: customerSearch.trim(), limit: 20 };
//   const { data: customerSearchData, isLoading: isSearchingCustomers } = useListCustomers(customerSearchParams, {
//     query: {
//       enabled: !!business?.id && customerPickerOpen && customerSearch.trim().length > 0,
//       queryKey: getListCustomersQueryKey(customerSearchParams),
//     },
//   });
//   const customerResults: Customer[] = customerSearchData?.data ?? [];

//   // Duplicate check while adding a new customer — search by the phone they're typing
//   const dupCheckParams = { business_id: business?.id as number, search: newCustomerPhone.trim(), limit: 5 };
//   const { data: dupCheckData } = useListCustomers(dupCheckParams, {
//     query: {
//       enabled: !!business?.id && newCustomerModalOpen && newCustomerPhone.trim().length >= 10,
//       queryKey: getListCustomersQueryKey(dupCheckParams),
//     },
//   });
//   const normalizePhone = (v: string) => v.replace(/\D/g, '');
//   const duplicateCustomer = useMemo(() => {
//     const typed = normalizePhone(newCustomerPhone);
//     if (typed.length < 10) return null;
//     const list: Customer[] = dupCheckData?.data ?? [];
//     return list.find((c) => normalizePhone(c.phone || '') === typed) ?? null;
//   }, [dupCheckData, newCustomerPhone]);

//   // ─── Promotions ───────────────────────────────────────────────────────────
// const activePromoParams = { business_id: business?.id as number };
// const { data: activePromotionsData } = useListActivePromotions(activePromoParams, {
//   query: { enabled: !!business?.id, queryKey: getListActivePromotionsQueryKey(activePromoParams) },
// });
// const activePromotions: any[] = activePromotionsData ?? [];

// // Conflict rule: a product-specific BOGO promotion always wins over the
// // general "All Products 10% OFF" promotion (spec §11) — checking BOGO
// // first and returning immediately on a match implements this priority.
// const getPromotionForProduct = (productId: number): { promo: any; type: 'bogo' | 'percentage' } | null => {
//   const bogo = activePromotions.find(
//     (p) => p.promotion_type === 'bogo' && (p.apply_to === 'all' || (p.product_ids ?? []).includes(productId))
//   );
//   if (bogo) return { promo: bogo, type: 'bogo' };
//   const pct = activePromotions.find(
//     (p) => p.promotion_type === 'percentage' && (p.apply_to === 'all' || (p.product_ids ?? []).includes(productId))
//   );
//   if (pct) return { promo: pct, type: 'percentage' };
//   return null;
// };
//   // -------------------------------------------------------------------------
//   // Cart operations
//   // -------------------------------------------------------------------------
// const addToCart = (product: Product) => {
//   const existing = cart.find((c) => c.product.id === product.id);
//   const nextPaidQty = (existing?.qty ?? 0) + 1;
//   const stock = product.stock_qty ?? 0;
//   const match = getPromotionForProduct(product.id);

//   if (match?.type === 'bogo') {
//     const nextFreeQty = nextPaidQty; // classic 1:1 BOGO — spec §8
//     if (nextPaidQty + nextFreeQty > stock) {
//       setResultModal({ type: 'error', title: 'Insufficient stock', message: 'Insufficient stock for Buy 1 Get 1 Free offer.' });
//       return;
//     }
//     setCart((prev) => {
//       const idx = prev.findIndex((c) => c.product.id === product.id);
//       const updated: CartItemWithDiscount = {
//         product, qty: nextPaidQty, freeQty: nextFreeQty, discountPercent: 0, isBogo: true,
//         promotionId: match.promo.id, promotionName: match.promo.name,
//       };
//       if (idx >= 0) return prev.map((c, i) => (i === idx ? updated : c));
//       return [...prev, updated];
//     });
//     return;
//   }

//   if (nextPaidQty > stock) {
//     setResultModal({ type: 'error', title: 'Insufficient stock', message: `Only ${stock} unit${stock === 1 ? '' : 's'} of "${product.name}" available.` });
//     return;
//   }

//   const autoDiscount = match?.type === 'percentage' ? Number(match.promo.discount_percentage ?? 10) : 0;
//   setCart((prev) => {
//     const idx = prev.findIndex((c) => c.product.id === product.id);
//     const updated: CartItemWithDiscount = {
//       product, qty: nextPaidQty, freeQty: 0, discountPercent: autoDiscount, isBogo: false,
//       promotionId: match?.type === 'percentage' ? match.promo.id : undefined,
//       promotionName: match?.type === 'percentage' ? match.promo.name : undefined,
//     };
//     if (idx >= 0) return prev.map((c, i) => (i === idx ? updated : c));
//     return [...prev, updated];
//   });
// };

// const changeQty = (productId: number, newPaidQty: number) => {
//   if (newPaidQty <= 0) {
//     setCart((prev) => prev.filter((c) => c.product.id !== productId));
//     return;
//   }
//   const item = cart.find((c) => c.product.id === productId);
//   if (!item) return;
//   const stock = item.product.stock_qty ?? 0;

//   if (item.isBogo) {
//     if (newPaidQty * 2 > stock) {
//       setResultModal({ type: 'error', title: 'Insufficient stock', message: 'Insufficient stock for Buy 1 Get 1 Free offer.' });
//       return;
//     }
//     setCart((prev) => prev.map((c) => (c.product.id === productId ? { ...c, qty: newPaidQty, freeQty: newPaidQty } : c)));
//     return;
//   }

//   if (newPaidQty > stock) {
//     setResultModal({ type: 'error', title: 'Insufficient stock', message: `Only ${stock} unit${stock === 1 ? '' : 's'} of "${item.product.name}" available.` });
//     return;
//   }
//   setCart((prev) => prev.map((c) => (c.product.id === productId ? { ...c, qty: newPaidQty } : c)));
// };

//   const removeItem = (productId: number) => setCart((prev) => prev.filter((c) => c.product.id !== productId));

//   const clearCart = () => {
//     setCart([]);
//     setSelectedCustomer(null);
//     setDiscountValue('0');
//     setAmountReceived('');
//     setPaymentMethod('cash');
//     setSplitMethod1('cash');
//     setSplitAmount1('');
//     setSplitMethod2('upi');
//     setSplitAmount2('');
//     AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
//   };

//   const handleBarcodeScanned = (code: string) => {
//     setScannerOpen(false);
//     pendingScanRef.current = code;
//     setSearch(code);
//   };

//   // -------------------------------------------------------------------------
//   // Totals
//   // -------------------------------------------------------------------------
//  const totals = useMemo(() => {
//   let subtotal = 0;
//   let gst = 0;
//   let totalQty = 0;
//   let promoDiscountTotal = 0; // NEW — sum of all auto-applied 10% promo savings
//   cart.forEach(({ product, qty, discountPercent }) => {
//     const price = product.selling_price ?? 0;
//     const lineTotal = price * qty;
//     const discountAmount = (lineTotal * discountPercent) / 100;
//     const afterDiscount = lineTotal - discountAmount;
//     const gstAmount = (afterDiscount * (product.gst_rate ?? 0)) / 100;
//     subtotal += afterDiscount;
//     gst += gstAmount;
//     totalQty += qty;
//     promoDiscountTotal += discountAmount;
//   });
//   const billDiscount = parseFloat(discountValue) || 0;
//   const preRound = Math.max(subtotal - billDiscount + gst, 0);
//   const rounded = Math.round(preRound);
//   const roundOff = rounded - preRound;
//   return { subtotal, gst, billDiscount, totalQty, grandTotal: rounded, roundOff, promoDiscountTotal };
// }, [cart, discountValue]);

//   useEffect(() => {
//     setAmountReceived(cart.length > 0 ? totals.grandTotal.toFixed(2) : '');
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [totals.grandTotal, cart.length]);

//   // Default split amounts: first leg gets everything, second starts at 0 —
//   // cashier then re-splits by typing in either field.
//   useEffect(() => {
//     if (cart.length > 0) {
//       setSplitAmount1(totals.grandTotal.toFixed(2));
//       setSplitAmount2('0.00');
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [totals.grandTotal, cart.length, paymentMethod]);

//   const handleSplitAmount1Change = (text: string) => {
//     setSplitAmount1(text);
//     const amt1 = parseFloat(text) || 0;
//     setSplitAmount2(Math.max(totals.grandTotal - amt1, 0).toFixed(2));
//   };
//   const handleSplitAmount2Change = (text: string) => {
//     setSplitAmount2(text);
//     const amt2 = parseFloat(text) || 0;
//     setSplitAmount1(Math.max(totals.grandTotal - amt2, 0).toFixed(2));
//   };
//   const splitTotal = (parseFloat(splitAmount1) || 0) + (parseFloat(splitAmount2) || 0);

//   const balanceAmount = useMemo(() => (parseFloat(amountReceived) || 0) - totals.grandTotal, [amountReceived, totals.grandTotal]);

//   // -------------------------------------------------------------------------
//   // Checkout
//   // -------------------------------------------------------------------------
//   const createTransaction = useCreateTransaction();
//   const updateProduct = useUpdateProduct();

//   const buildBillDescription = () => cart.map(({ product, qty }) => `${product.name} x${qty}`).join(', ').slice(0, 250);

//   // Cash/card/UPI/split sales don't strictly need a named customer — fall
//   // back to a cached (or freshly created) "Walk-in customer" record so
//   // checkout never silently blocks. Credit sales DO need a real customer,
//   // since that's who the outstanding balance is tracked against.
//   const getOrCreateWalkInCustomer = async (): Promise<Customer> => {
//     const cachedId = await AsyncStorage.getItem(STORAGE_KEYS.WALKIN_CUSTOMER_ID);
//     if (cachedId) return { id: Number(cachedId), name: 'Walk-in customer' } as Customer;

//     const created = await createCustomer.mutateAsync({
//       data: { business_id: business!.id, name: 'Walk-in customer', phone: '', category: 'customer' } as any,
//     });
//     const newId = (created as any)?.id ?? (created as any)?.data?.id;
//     if (newId) await AsyncStorage.setItem(STORAGE_KEYS.WALKIN_CUSTOMER_ID, String(newId));
//     return created as Customer;
//   };

//   const handleCheckout = async (isCreditNow: boolean) => {
//     setSubmitError(null);
//     if (!business?.id || cart.length === 0) return;

//     if (!selectedCustomer && isCreditNow) {
//       setResultModal({
//         type: 'confirm',
//         title: 'Customer required',
//         message: 'Credit sales need a real customer so the balance can be tracked. Select or add one to continue.',
//         onConfirm: () => {
//           setResultModal(null);
//           setCustomerPickerOpen(true);
//         },
//       });
//       return;
//     }
//     if (!isCreditNow && paymentMethod === 'split' && Math.abs(splitTotal - totals.grandTotal) > 0.01) {
//       setSubmitError(
//         `Split amounts (${formatCurrency(splitTotal, business?.currency)}) must add up to the total (${formatCurrency(totals.grandTotal, business?.currency)}).`,
//       );
//       return;
//     }
//     if (!isCreditNow && paymentMethod !== 'split' && (parseFloat(amountReceived) || 0) < totals.grandTotal) {
//       setSubmitError(`Amount received is less than the total (${formatCurrency(totals.grandTotal, business?.currency)}).`);
//       return;
//     }

//     const currentInvoice = invoiceNumber;
//     const nowIso = new Date().toISOString();
//     setIsSubmitting(true);
//     try {
//       const customer = selectedCustomer ?? (await getOrCreateWalkInCustomer());
//       const effectiveGstRate = totals.subtotal > 0 ? (totals.gst / totals.subtotal) * 100 : 0;

//       await createTransaction.mutateAsync({
//         data: {
//           business_id: business.id,
//           customer_id: customer.id,
//           type: TransactionInputType.you_gave,
//           amount: totals.grandTotal,
//           tax: totals.gst,                    // ✅ ADD
//           gst_rate: effectiveGstRate,
//           invoice_no: currentInvoice,
//           description: `Invoice ${currentInvoice}: ${buildBillDescription()}`,
//           payment_mode: mapPaymentMethodToApi(paymentMethod),
//           entry_date: nowIso,
//           items: cart.map((item) => ({ product_id: item.product.id, qty: item.qty, unit_price: item.product.selling_price ?? 0 })),
//         },
//       });

//       if (!isCreditNow) {
//         if (paymentMethod === 'split') {
//           const amt1 = parseFloat(splitAmount1) || 0;
//           const amt2 = parseFloat(splitAmount2) || 0;
//           if (amt1 > 0) {
//             await createTransaction.mutateAsync({
//               data: {
//                 business_id: business.id,
//                 customer_id: customer.id,
//                 type: TransactionInputType.you_got,
//                 amount: amt1,
//                 description: `Payment (${splitMethod1}) for invoice ${currentInvoice}`,
//                 payment_mode: mapPaymentMethodToApi(splitMethod1),
//                 entry_date: nowIso,
//               },
//             });
//           }
//           if (amt2 > 0) {
//             await createTransaction.mutateAsync({
//               data: {
//                 business_id: business.id,
//                 customer_id: customer.id,
//                 type: TransactionInputType.you_got,
//                 amount: amt2,
//                 description: `Payment (${splitMethod2}) for invoice ${currentInvoice}`,
//                 payment_mode: mapPaymentMethodToApi(splitMethod2),
//                 entry_date: nowIso,
//               },
//             });
//           }
//         } else {
//           await createTransaction.mutateAsync({
//             data: {
//               business_id: business.id,
//               customer_id: customer.id,
//               type: TransactionInputType.you_got,
//               amount: totals.grandTotal,
//               description: `Payment received (${paymentMethod}) for invoice ${currentInvoice}`,
//               payment_mode: mapPaymentMethodToApi(paymentMethod),
//               entry_date: nowIso,
//             },
//           });
//         }
//       }

//       await Promise.all(
//         cart.map((item) =>
//           updateProduct.mutateAsync({
//             id: item.product.id,
//             data: { stock_qty: Math.max((item.product.stock_qty ?? 0) - (item.qty + item.freeQty), 0) },
//           }),
//         ),
//       );

//       await generateNextInvoiceNumber();

//       queryClient.invalidateQueries({ queryKey: ['/api/transactions'], exact: false });
//       queryClient.invalidateQueries({ queryKey: ['/api/products'], exact: false });
//       queryClient.invalidateQueries({ queryKey: ['/api/customers'], exact: false });
//       queryClient.invalidateQueries({ predicate: (q) => typeof q.queryKey[0] === 'string' && (q.queryKey[0] as string).includes('/stats') });

//       setIsSubmitting(false);
//       setPrintData({
//         invoiceNumber: currentInvoice,
//         date: new Date(),
//         cashier: salesPerson,
//         customerName: customer.name,
//         cart: [...cart],
//         totals,
//         paymentMethod,
//       });
//       setSuccessBanner({
//         title: isCreditNow ? 'Invoice created' : 'Payment completed',
//         message: `${currentInvoice} saved successfully for ${customer.name}.`,
//         showPrintButton: true,
//         onConfirm: () => clearCart(),
//       });
//     } catch (e) {
//       console.error('Checkout error:', e);
//       setIsSubmitting(false);
//       setSubmitError('Could not save the bill. Please try again.');
//       setResultModal({
//         type: 'error',
//         title: 'Checkout failed',
//         message: 'Could not save the bill. Please check your connection and try again.',
//       });
//     }
//   };

//   // -------------------------------------------------------------------------
//   // Add new customer
//   // -------------------------------------------------------------------------
//   const handleCreateNewCustomer = async () => {
//     if (!newCustomerName.trim() || !business?.id) return;
//     if (duplicateCustomer) {
//       // Don't create a duplicate — just select the existing customer.
//       setSelectedCustomer(duplicateCustomer);
//       setNewCustomerModalOpen(false);
//       setNewCustomerName('');
//       setNewCustomerPhone('');
//       return;
//     }
//     setIsCreatingCustomer(true);
//     try {
//       const created = await createCustomer.mutateAsync({
//         data: {
//           business_id: business.id,
//           name: newCustomerName.trim(),
//           phone: newCustomerPhone.trim(),
//           category: 'customer',
//         } as any,
//       });
//       setSelectedCustomer(created as Customer);
//       setNewCustomerModalOpen(false);
//       setCustomerPickerOpen(false);
//       setNewCustomerName('');
//       setNewCustomerPhone('');
//       setCustomerSearch('');
//       queryClient.invalidateQueries({ queryKey: ['/api/customers'], exact: false });
//     } catch (e) {
//       console.error('Create customer error:', e);
//       setResultModal({ type: 'error', title: 'Could not add customer', message: 'Please try again.' });
//     } finally {
//       setIsCreatingCustomer(false);
//     }
//   };

//   // -------------------------------------------------------------------------
//   // Save draft / Hold / Recall
//   // -------------------------------------------------------------------------
//   const persistBill = async (kind: 'hold' | 'draft') => {
//     if (cart.length === 0) {
//       setResultModal({ type: 'error', title: 'Cart is empty', message: 'Add items before saving or holding a bill.' });
//       return;
//     }
//     const key = kind === 'hold' ? STORAGE_KEYS.HELD_BILLS : STORAGE_KEYS.DRAFT_BILLS;
//     const existing = await AsyncStorage.getItem(key);
//     const list: SavedBill[] = existing ? JSON.parse(existing) : [];
//     list.push({
//       id: Date.now().toString(),
//       kind,
//       savedAt: new Date().toISOString(),
//       invoiceNumber,
//       cart,
//       customer: selectedCustomer,
//       discountValue,
//       paymentMethod,
//     });
//     await AsyncStorage.setItem(key, JSON.stringify(list));
//     setSuccessBanner({
//       title: kind === 'hold' ? 'Bill held' : 'Draft saved',
//       message: `${invoiceNumber} is safely stored. You can bring it back from Recall.`,
//       onConfirm: () => clearCart(),
//     });
//   };

//   const openRecall = async () => {
//     const [heldRaw, draftRaw] = await Promise.all([
//       AsyncStorage.getItem(STORAGE_KEYS.HELD_BILLS),
//       AsyncStorage.getItem(STORAGE_KEYS.DRAFT_BILLS),
//     ]);
//     const parseValid = (raw: string | null): SavedBill[] => {
//       if (!raw) return [];
//       try {
//         const list = JSON.parse(raw);
//         if (!Array.isArray(list)) return [];
//         // Older builds saved a different shape (no `cart` array) — drop
//         // anything that doesn't match, so Recall never crashes on stale data.
//         return list.filter((b) => b && Array.isArray(b.cart));
//       } catch {
//         return [];
//       }
//     };
//     const held = parseValid(heldRaw);
//     const drafts = parseValid(draftRaw);
//     setSavedBills([...held, ...drafts].sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1)));
//     setRecallVisible(true);
//   };

//   const recallBill = async (bill: SavedBill) => {
//     setCart(bill.cart ?? []);
//     setSelectedCustomer(bill.customer);
//     setDiscountValue(bill.discountValue);
//     setPaymentMethod(bill.paymentMethod);
//     setInvoiceNumber(bill.invoiceNumber);

//     const key = bill.kind === 'hold' ? STORAGE_KEYS.HELD_BILLS : STORAGE_KEYS.DRAFT_BILLS;
//     const existing = await AsyncStorage.getItem(key);
//     const list: SavedBill[] = existing ? JSON.parse(existing) : [];
//     await AsyncStorage.setItem(key, JSON.stringify(list.filter((b) => b.id !== bill.id)));
//     setRecallVisible(false);
//   };

//   // -------------------------------------------------------------------------
//   // Print bill — builds a thermal-receipt-style text layout. On web this
//   // opens the browser print dialog; on native it falls back to Share.
//   // -------------------------------------------------------------------------
//   const generateReceiptText = (data: NonNullable<typeof printData>) => {
//     let text = `${business?.business_name || 'Khata-Pro'}\n`;
//     text += '================================\n';
//     text += `Invoice: ${data.invoiceNumber}\n`;
//     text += `Date: ${data.date.toLocaleString()}\n`;
//     text += `Cashier: ${data.cashier || 'Admin'}\n`;
//     text += `Customer: ${data.customerName}\n`;
//     text += '--------------------------------\n';
//     data.cart.forEach((item) => {
//   const total = (item.product.selling_price ?? 0) * item.qty;
//   if (item.isBogo) {
//     text += `${item.product.name.padEnd(18).slice(0, 18)} Paid:${item.qty} Free:${item.freeQty}  Rs.${total.toFixed(2)}\n`;
//     text += `  (Buy 1 Get 1 Free)\n`;
//   } else if (item.discountPercent > 0) {
//     text += `${item.product.name.padEnd(18).slice(0, 18)} x${item.qty}  Rs.${total.toFixed(2)} (${item.discountPercent}% OFF)\n`;
//   } else {
//     text += `${item.product.name.padEnd(18).slice(0, 18)} x${item.qty}  Rs.${total.toFixed(2)}\n`;
//   }
// });
//     text += '--------------------------------\n';
//     text += `Subtotal:    Rs.${data.totals.subtotal.toFixed(2)}\n`;
//     if (data.totals.billDiscount > 0) text += `Discount:   -Rs.${data.totals.billDiscount.toFixed(2)}\n`;
//     text += `GST:         Rs.${data.totals.gst.toFixed(2)}\n`;
//     text += `Round off:   Rs.${data.totals.roundOff.toFixed(2)}\n`;
//     text += '================================\n';
//     text += `TOTAL:       Rs.${data.totals.grandTotal.toFixed(2)}\n`;
//     text += `Payment: ${data.paymentMethod.toUpperCase()}\n`;
//     text += '================================\n';
//     text += '     Thank you for shopping!\n';
//     return text;
//   };

//   const handlePrint = () => {
//     if (cart.length === 0) {
//       setResultModal({ type: 'error', title: 'Cart is empty', message: 'Add items before printing a bill.' });
//       return;
//     }
//     setPrintData({
//       invoiceNumber,
//       date: new Date(),
//       cashier: salesPerson,
//       customerName: selectedCustomer?.name ?? 'Walk-in customer',
//       cart,
//       totals,
//       paymentMethod,
//     });
//     setPrintVisible(true);
//   };

//   const triggerBrowserPrint = () => {
//     // @ts-ignore — `document`/`window` only exist on the web build (react-native-web)
//     if (Platform.OS === 'web' && typeof document !== 'undefined') {
//       // Print only the receipt node so the rest of the app UI isn't included.
//       // @ts-ignore
//       const node = document.getElementById('pos-receipt-print-area');
//       if (node) {
//         // @ts-ignore
//         const printWindow = window.open('', '_blank', 'width=380,height=600');
//         if (printWindow) {
//           printWindow.document.write(`<html><head><title>${printData?.invoiceNumber ?? 'Receipt'}</title>
//             <style>body{font-family:'Courier New',monospace;font-size:12px;padding:16px;white-space:pre-wrap;}</style>
//             </head><body>${node.innerText.replace(/\n/g, '<br/>')}</body></html>`);
//           printWindow.document.close();
//           printWindow.focus();
//           printWindow.print();
//           printWindow.close();
//         }
//       }
//     } else if (printData) {
//       Share.share({ message: generateReceiptText(printData), title: printData.invoiceNumber });
//     }
//   };

//   // -------------------------------------------------------------------------
//   // Left panel — search, categories, quick products
//   // -------------------------------------------------------------------------
//   const renderLeftPanel = () => (
//     <View style={[styles.panel, isWide ? styles.leftPanelWide : styles.panelStacked, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <Text style={[styles.panelTitle, { color: colors.foreground }]}>Product search</Text>

//       <View style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
//         <Feather name="search" size={15} color={colors.mutedForeground} />
//         <TextInput
//           value={search}
//           onChangeText={(t) => {
//             pendingScanRef.current = null;
//             setSearch(t);
//           }}
//           onSubmitEditing={() => {
//             const code = search.trim();
//             if (code) handleBarcodeScanned(code);
//           }}
//           placeholder="Barcode / product name — press Enter or scan"
//           placeholderTextColor={colors.mutedForeground}
//           style={[styles.searchInput, { color: colors.foreground }]}
//           returnKeyType="search"
//         />
//         <Pressable onPress={() => setScannerOpen(true)} hitSlop={8}>
//           <Feather name="camera" size={16} color={colors.primary} />
//         </Pressable>
//       </View>

//       <ScrollView style={isWide ? { flex: 1, marginTop: 4 } : undefined} nestedScrollEnabled showsVerticalScrollIndicator={false}>
//         {/* Nothing typed, no category picked yet → show categories + quick products */}
//         {search.trim().length === 0 && activeCategory === 'All' && (
//           <>
//             <Text style={[styles.sectionLabel, { color: colors.primary }]}>Categories</Text>
//             <View style={{ gap: 6 }}>
//               {categories.filter((c) => c !== 'All').map((cat) => (
//                 <Pressable
//                   key={cat}
//                   onPress={() => setActiveCategory(cat)}
//                   style={[styles.categoryRow, { borderColor: colors.border, backgroundColor: colors.background }]}
//                 >
//                   <View style={[styles.categoryIconWrap, { backgroundColor: categoryColor(cat) + '20' }]}>
//                     <Feather name={categoryIcon(cat)} size={14} color={categoryColor(cat)} />
//                   </View>
//                   <Text style={[styles.categoryLabel, { color: colors.foreground }]}>{cat}</Text>
//                   <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
//                 </Pressable>
//               ))}
//             </View>

//             {quickProducts.length > 0 && (
//               <>
//                 <Text style={[styles.sectionLabel, { color: colors.primary }]}>Quick products</Text>
//                 <View style={styles.chipsRow}>
//                   {quickProducts.map((p) => (
//                     <Pressable key={p.id} onPress={() => addToCart(p)} style={[styles.quickChip, { backgroundColor: colors.primary + '15' }]}>
//                       <Text style={[styles.quickChipText, { color: colors.primary }]} numberOfLines={1}>
//                         {p.name}
//                       </Text>
//                     </Pressable>
//                   ))}
//                 </View>
//               </>
//             )}
//           </>
//         )}

//         {/* A category is selected → show ONLY that category's products */}
//         {search.trim().length === 0 && activeCategory !== 'All' && (
//           <>
//             <Pressable
//               onPress={() => setActiveCategory('All')}
//               style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 10 }}
//             >
//               <Feather name="arrow-left" size={14} color={colors.primary} />
//               <Text style={{ fontFamily: F, color: colors.primary, fontSize: 13, fontWeight: '600' }}>Back to categories</Text>
//             </Pressable>
//             <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 0 }]}>{activeCategory} products</Text>

//             {loadingAllProducts ? (
//               <ActivityIndicator style={{ paddingVertical: 20 }} color={colors.primary} />
//             ) : visibleProducts.length === 0 ? (
//               <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No products found</Text>
//             ) : (
//               visibleProducts.map((p) => (
//                 <ProductRow key={p.id} p={p} colors={colors} business={business} addToCart={addToCart} setSearch={setSearch} />
//               ))
//             )}
//           </>
//         )}

//         {/* Typing in search → show search results */}
//         {search.trim().length > 0 && (
//           <>
//             <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 4 }]}>Search results</Text>

//             {isSearching ? (
//               <ActivityIndicator style={{ paddingVertical: 20 }} color={colors.primary} />
//             ) : visibleProducts.length === 0 ? (
//               <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No products found</Text>
//             ) : (
//               visibleProducts.map((p) => (
//                 <ProductRow key={p.id} p={p} colors={colors} business={business} addToCart={addToCart} setSearch={setSearch} />
//               ))
//             )}
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );

//   // -------------------------------------------------------------------------
//   // Right panel — ONE unified card: bill header, item table, totals,
//   // payment, received/balance. This mirrors the two-card reference layout
//   // (search on the left, everything else together on the right).
//   // -------------------------------------------------------------------------
//   const renderBillPanel = () => (
//     <View style={[styles.panel, isWide ? styles.billPanelWide : styles.panelStacked, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       {/* Bill header */}
//       <View style={styles.billHeaderRow}>
//         <View style={{ flex: 1 }}>
//           <Pressable
//             onPress={() => setCustomerPickerOpen(true)}
//             style={[styles.customerPill, { borderColor: selectedCustomer ? colors.primary : colors.border }]}
//           >
//             <Feather name="user" size={13} color={selectedCustomer ? colors.primary : colors.mutedForeground} />
//             <Text style={[styles.customerPillText, { color: selectedCustomer ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
//               {selectedCustomer ? selectedCustomer.name : 'Walk-in customer'}
//             </Text>
//           </Pressable>
//           <Text style={[styles.billMeta, { color: colors.mutedForeground }]}>Phone: {selectedCustomer?.phone || '—'}</Text>
//         </View>
//         <View style={{ alignItems: 'flex-end' }}>
//           <Text style={[styles.billMeta, { color: colors.foreground }]}>Bill no: {invoiceNumber}</Text>
//           <Text style={[styles.billMeta, { color: colors.mutedForeground }]}>Salesman: {salesPerson || 'Admin'}</Text>
//         </View>
//       </View>

//       <ScrollView style={isWide ? { flex: 1, marginTop: 4 } : undefined} nestedScrollEnabled showsVerticalScrollIndicator={false}>
//       {/* Item table */}
//       {cart.length === 0 ? (
//         <View style={{ paddingVertical: 40, alignItems: 'center' }}>
//           <Feather name="shopping-cart" size={28} color={colors.mutedForeground} />
//           <Text style={[styles.emptyText, { color: colors.mutedForeground, marginTop: 8 }]}>No items added yet</Text>
//         </View>
//       ) : (
//         <View style={{ marginTop: 10 }}>
//           {isWide && (
//             <View style={[styles.tableHeaderRow, { backgroundColor: colors.primary + '10', borderColor: colors.border }]}>
//               <Text style={[styles.th, { flex: 2.4, color: colors.primary }]}>Item name</Text>
//               <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.primary }]}>Qty</Text>
//               <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.primary }]}>Price</Text>
//               <Text style={[styles.th, { flex: 0.8, textAlign: 'right', color: colors.primary }]}>Disc</Text>
//               <Text style={[styles.th, { flex: 0.8, textAlign: 'right', color: colors.primary }]}>Tax</Text>
//               <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.primary }]}>Total</Text>
//               <View style={{ width: 24 }} />
//             </View>
//           )}

//           <FlatList
//             data={cart}
//             keyExtractor={(c) => String(c.product.id)}
//             scrollEnabled={false}
//             renderItem={({ item }) => {
//               const price = item.product.selling_price ?? 0;
//               const lineTotal = price * item.qty;
//               const afterDiscount = lineTotal - (lineTotal * item.discountPercent) / 100;
//               const gstAmount = (afterDiscount * (item.product.gst_rate ?? 0)) / 100;
//               const finalTotal = afterDiscount + gstAmount;

//               if (isWide) {
//                 return (
//                   <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
//                     <View style={{ flex: 2.4 }}>
//                       <Text style={[styles.tdName, { color: colors.foreground }]} numberOfLines={1}>
//                         {item.product.name}
//                       </Text>
//                       <Text style={[styles.tdSub, { color: colors.mutedForeground }]}>{unitLabel(item.product.unit)}</Text>
//                       {item.isBogo ? (
//   <Text style={{ fontFamily: F, fontSize: 10, color: '#7C3AED', fontWeight: '700', marginTop: 2 }}>
//     🎁 Buy 1 Get 1 Free · Free Qty: {item.freeQty}
//   </Text>
// ) : item.discountPercent > 0 ? (
//   <Text style={{ fontFamily: F, fontSize: 10, color: '#16A34A', fontWeight: '700', marginTop: 2 }}>
//     {item.discountPercent}% OFF · -₹{(((item.product.selling_price ?? 0) * item.qty * item.discountPercent) / 100).toFixed(2)}
//   </Text>
// ) : null}
//                     </View>
//                   <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
//                       <Pressable onPress={() => changeQty(item.product.id, item.qty - 1)}>
//                         <Feather name="minus-circle" size={16} color={colors.mutedForeground} />
//                       </Pressable>
//                       <TextInput
//                         value={String(item.qty)}
//                         onChangeText={(t) => {
//                           const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
//                           if (!isNaN(n)) changeQty(item.product.id, n);
//                         }}
//                         keyboardType="number-pad"
//                         style={[styles.qtyInput, { color: colors.foreground }]}
//                       />
//                       <Pressable onPress={() => changeQty(item.product.id, item.qty + 1)}>
//                         <Feather name="plus-circle" size={16} color={colors.mutedForeground} />
//                       </Pressable>
//                       <Text style={[styles.tdSub, { color: colors.mutedForeground, marginLeft: 2 }]}>{unitLabel(item.product.unit)}</Text>
//                     </View>
//                     <Text style={[styles.td, { flex: 1, textAlign: 'right', color: colors.foreground }]}>{price.toFixed(2)}</Text>
//                     <Text style={[styles.td, { flex: 0.8, textAlign: 'right', color: '#DC2626' }]}>{item.discountPercent}%</Text>
//                     <Text style={[styles.td, { flex: 0.8, textAlign: 'right', color: '#16A34A' }]}>{item.product.gst_rate ?? 0}%</Text>
//                     <Text style={[styles.tdTotal, { flex: 1, textAlign: 'right', color: colors.foreground }]}>{finalTotal.toFixed(2)}</Text>
//                     <Pressable onPress={() => removeItem(item.product.id)} style={{ width: 24, alignItems: 'flex-end' }}>
//                       <Feather name="trash-2" size={15} color="#DC2626" />
//                     </Pressable>
//                   </View>
//                 );
//               }

//               return (
//                 <View style={[styles.mobileCartCard, { borderColor: colors.border }]}>
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                     <Text style={[styles.tdName, { color: colors.foreground, flex: 1 }]} numberOfLines={1}>
//                       {item.product.name}
//                     </Text>
//                     <Pressable onPress={() => removeItem(item.product.id)} hitSlop={8}>
//                       <Feather name="trash-2" size={15} color="#DC2626" />
//                     </Pressable>
//                   </View>
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                       <Pressable onPress={() => changeQty(item.product.id, item.qty - 1)}>
//                         <Feather name="minus-circle" size={18} color={colors.mutedForeground} />
//                       </Pressable>
//                       <Text style={[styles.tdName, { minWidth: 18, textAlign: 'center', color: colors.foreground }]}>
//                         {item.qty} {unitLabel(item.product.unit)}
//                       </Text>
//                       <Pressable onPress={() => changeQty(item.product.id, item.qty + 1)}>
//                         <Feather name="plus-circle" size={18} color={colors.mutedForeground} />
//                       </Pressable>
//                     </View>
//                     <Text style={[styles.tdTotal, { color: colors.foreground }]}>{formatCurrency(finalTotal, business?.currency)}</Text>
//                   </View>
//                 </View>
//               );
//             }}
//           />
//         </View>
//       )}

//       {/* Totals + payment row */}
//       {cart.length > 0 && (
//         <View style={isWide ? styles.summaryRowWide : { marginTop: 14, gap: 12 }}>
//           {/* Left: discount / gst / round off */}
//           <View style={[styles.summaryLeftCol, { borderColor: colors.border, backgroundColor: colors.background }]}>
//             <View style={styles.discountEditRow}>
//               <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Discount</Text>
//               <TextInput
//                 value={discountValue}
//                 onChangeText={setDiscountValue}
//                 keyboardType="numeric"
//                 style={[styles.discountInput, { borderColor: colors.border, color: '#DC2626' }]}
//               />
//             </View>
//             {totals.promoDiscountTotal > 0 ? (
//     <SummaryRow label="Promo Discount (10% OFF)" value={`- ₹ ${totals.promoDiscountTotal.toFixed(2)}`} valueColor="#16A34A" />
//   ) : null}
//             <SummaryRow label="GST" value={`₹ ${totals.gst.toFixed(2)}`} valueColor="#16A34A" />
//             <SummaryRow label="Round off" value={`₹ ${totals.roundOff.toFixed(2)}`} last />
//           </View>

//           {/* Right: grand total + payment + received/balance */}
//           <View style={styles.summaryRightCol}>
//             <View style={styles.netAmountBox}>
//               <Text style={styles.netAmountLabel}>Grand total</Text>
//               <Text style={styles.netAmountValue}>{formatCurrency(totals.grandTotal, business?.currency)}</Text>
//             </View>

//             <View style={styles.chipsRow}>
//               {PAYMENT_METHODS.map((m) => {
//                 const active = m.value === paymentMethod;
//                 return (
//                   <Pressable
//                     key={m.value}
//                     onPress={() => setPaymentMethod(m.value)}
//                     style={[styles.paymentChip, { borderColor: active ? m.color : colors.border, backgroundColor: active ? m.color + '18' : colors.background }]}
//                   >
//                     <PaymentIcon method={m.value} icon={m.icon} size={13} color={m.color} />
//                     <Text style={[styles.paymentChipText, { color: active ? m.color : colors.foreground }]}>{m.label}</Text>
//                   </Pressable>
//                 );
//               })}
//             </View>

//             {paymentMethod === 'split' && (
//               <View style={{ marginTop: 10, gap: 10 }}>
//                 <SplitLeg
//                   label="Payment 1"
//                   method={splitMethod1}
//                   onMethodChange={setSplitMethod1}
//                   amount={splitAmount1}
//                   onAmountChange={handleSplitAmount1Change}
//                   colors={colors}
//                 />
//                 <SplitLeg
//                   label="Payment 2"
//                   method={splitMethod2}
//                   onMethodChange={setSplitMethod2}
//                   amount={splitAmount2}
//                   onAmountChange={handleSplitAmount2Change}
//                   colors={colors}
//                 />
//                 <Text
//                   style={[
//                     styles.summaryLabel,
//                     { color: Math.abs(splitTotal - totals.grandTotal) < 0.01 ? '#16A34A' : '#DC2626', fontWeight: '700' },
//                   ]}
//                 >
//                   {formatCurrency(splitTotal, business?.currency)} of {formatCurrency(totals.grandTotal, business?.currency)} allocated
//                 </Text>
//               </View>
//             )}

//             {paymentMethod !== 'credit' && paymentMethod !== 'split' && (
//               <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Received</Text>
//                   <TextInput
//                     value={amountReceived}
//                     onChangeText={setAmountReceived}
//                     keyboardType="numeric"
//                     style={[styles.receivedInput, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background }]}
//                   />
//                 </View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Balance</Text>
//                   <View style={[styles.receivedInput, { borderColor: colors.border, backgroundColor: colors.background, justifyContent: 'center' }]}>
//                     <Text style={{ fontFamily: F, fontSize: 14, fontWeight: '700', color: balanceAmount < 0 ? '#DC2626' : '#16A34A' }}>
//                       {formatCurrency(Math.abs(balanceAmount), business?.currency)}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>
//       )}

//       {submitError ? <Text style={[styles.emptyText, { color: '#DC2626', marginTop: 10 }]}>{submitError}</Text> : null}
//       </ScrollView>

//       <View style={{ marginTop: 16 }}>
//         <PrimaryButton
//           label={isSubmitting ? 'Processing…' : 'Complete payment'}
//           onPress={() => handleCheckout(paymentMethod === 'credit')}
//           disabled={isSubmitting || cart.length === 0}
//         />
//       </View>

//       {!isWide && (
//         <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
//           <TouchableOpacity onPress={clearCart} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
//             <Feather name="trash-2" size={14} color="#DC2626" />
//             <Text style={[styles.actionBtnSmallText, { color: '#DC2626' }]}>Clear</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => persistBill('hold')} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
//             <Feather name="pause-circle" size={14} color={colors.primary} />
//             <Text style={[styles.actionBtnSmallText, { color: colors.primary }]}>Hold</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={openRecall} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
//             <Feather name="refresh-cw" size={14} color={colors.primary} />
//             <Text style={[styles.actionBtnSmallText, { color: colors.primary }]}>Recall</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handlePrint} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
//             <Feather name="printer" size={14} color={colors.primary} />
//             <Text style={[styles.actionBtnSmallText, { color: colors.primary }]}>Print</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   // -------------------------------------------------------------------------
//   // Root
//   // -------------------------------------------------------------------------
//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       <Stack.Screen options={{ headerShown: false }} />

//       <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//           <View style={styles.topBarIconWrap}>
//             <Feather name="shopping-cart" size={16} color="#2563EB" />
//           </View>
//           <Text style={styles.topBarTitle}>{business?.business_name || 'Khata-Pro POS'}</Text>
//         </View>
//         <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
//             <Feather name="user" size={12} color="#DBEAFE" />
//             <Text style={styles.topBarMeta}>Cashier: {salesPerson || '—'}</Text>
//           </View>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
//             <Feather name="calendar" size={12} color="#DBEAFE" />
//             <Text style={styles.topBarMeta}>{billingDate.toLocaleString()}</Text>
//           </View>
//         </View>
//       </View>

//       {resumeBill && cart.length === 0 && (
//         <View style={styles.resumeBanner}>
//           <Feather name="clock" size={16} color="#92400E" />
//           <Text style={styles.resumeBannerText}>
//             Unfinished bill {resumeBill.invoiceNumber} · {(resumeBill.cart ?? []).length} item
//             {(resumeBill.cart ?? []).length !== 1 ? 's' : ''} found — was it left open by mistake?
//           </Text>
//           <View style={{ flexDirection: 'row', gap: 8 }}>
//             <TouchableOpacity onPress={handleDiscardAutosave} style={styles.resumeBannerBtnGhost}>
//               <Text style={styles.resumeBannerBtnGhostText}>Discard</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleResumeAutosave} style={styles.resumeBannerBtn}>
//               <Text style={styles.resumeBannerBtnText}>Resume bill</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {isWide ? (
//         <>
//           <View style={styles.wideRow}>
//             {renderLeftPanel()}
//             {renderBillPanel()}
//           </View>
//           <View style={styles.bottomActionBar}>
//             <BottomAction icon="printer" label="Print bill" color="#2563EB" onPress={handlePrint} />
//             <BottomAction icon="save" label="Save" color="#16A34A" onPress={() => persistBill('draft')} />
//             <BottomAction icon="pause-circle" label="Hold" color="#D97706" onPress={() => persistBill('hold')} />
//             <BottomAction icon="refresh-cw" label="Recall" color="#7C3AED" onPress={openRecall} />
//             <BottomAction icon="x-circle" label="Cancel" color="#DC2626" onPress={clearCart} />
//           </View>
//         </>
//       ) : (
//         <ScrollView contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled">
//           {renderBillPanel()}
//           {renderLeftPanel()}
//         </ScrollView>
//       )}

//       {successBanner && (
//         <View style={styles.resumeBanner}>
//           <Feather name="check-circle" size={16} color="#92400E" />
//           <Text style={styles.resumeBannerText}>
//             {successBanner.title}: {successBanner.message}
//           </Text>
//           <View style={{ flexDirection: 'row', gap: 8 }}>
//             {successBanner.showPrintButton && (
//               <TouchableOpacity
//                 onPress={() => {
//                   setPrintVisible(true);
//                   setSuccessBanner(null);
//                 }}
//                 style={styles.resumeBannerBtnGhost}
//               >
//                 <Text style={styles.resumeBannerBtnGhostText}>Print bill</Text>
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity
//               onPress={() => {
//                 successBanner.onConfirm?.();
//                 setSuccessBanner(null);
//               }}
//               style={styles.resumeBannerBtn}
//             >
//               <Text style={styles.resumeBannerBtnText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}

//       {/* Result / confirm modal — replaces Alert.alert, which doesn't reliably render on web. Only for error/confirm now. */}
//       <Modal visible={!!resultModal} transparent animationType="fade" onRequestClose={() => setResultModal(null)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.resultModalContent, { backgroundColor: colors.card }]}>
//             <View
//               style={[
//                 styles.resultIconWrap,
//                 { backgroundColor: resultModal?.type === 'error' ? '#FEE2E2' : '#FEF3C7' },
//               ]}
//             >
//               <Feather
//                 name={resultModal?.type === 'error' ? 'x-circle' : 'alert-circle'}
//                 size={26}
//                 color={resultModal?.type === 'error' ? '#DC2626' : '#D97706'}
//               />
//             </View>
//             <Text style={[styles.resultTitle, { color: colors.foreground }]}>{resultModal?.title}</Text>
//             <Text style={[styles.resultMessage, { color: colors.mutedForeground }]}>{resultModal?.message}</Text>
//             <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' }}>
//               {resultModal?.type === 'confirm' && (
//                 <TouchableOpacity onPress={() => setResultModal(null)} style={[styles.resultBtn, { borderWidth: 1, borderColor: colors.border }]}>
//                   <Text style={[styles.resultBtnText, { color: colors.foreground }]}>Cancel</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={() => (resultModal?.onConfirm ? resultModal.onConfirm() : setResultModal(null))}
//                 style={[styles.resultBtn, { backgroundColor: colors.primary }]}
//               >
//                 <Text style={[styles.resultBtnText, { color: '#fff' }]}>{resultModal?.type === 'confirm' ? 'Select customer' : 'OK'}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Customer picker — popup modal */}
//       <Modal visible={customerPickerOpen} transparent animationType="fade" onRequestClose={() => setCustomerPickerOpen(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select customer</Text>
//               <Pressable onPress={() => { setCustomerPickerOpen(false); setCustomerSearch(''); }} hitSlop={8}>
//                 <Feather name="x" size={20} color={colors.mutedForeground} />
//               </Pressable>
//             </View>

//             <View style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.background, marginTop: 14 }]}>
//               <Feather name="search" size={15} color={colors.mutedForeground} />
//               <TextInput
//                 value={customerSearch}
//                 onChangeText={setCustomerSearch}
//                 placeholder="Search by name or phone"
//                 placeholderTextColor={colors.mutedForeground}
//                 style={[styles.searchInput, { color: colors.foreground }]}
//                 autoFocus
//               />
//               {customerSearch.length > 0 && (
//                 <Pressable onPress={() => setCustomerSearch('')} hitSlop={8}>
//                   <Feather name="x" size={15} color={colors.mutedForeground} />
//                 </Pressable>
//               )}
//             </View>

//             <ScrollView style={{ maxHeight: 320, marginTop: 10 }} nestedScrollEnabled>
//               {customerSearch.trim().length === 0 ? (
//                 <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingVertical: 14, textAlign: 'center' }]}>
//                   Type a name or phone to search
//                 </Text>
//               ) : isSearchingCustomers ? (
//                 <ActivityIndicator color={colors.primary} style={{ padding: 14 }} />
//               ) : customerResults.length === 0 ? (
//                 <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingVertical: 14, textAlign: 'center' }]}>
//                   No matches found
//                 </Text>
//               ) : (
//                 customerResults.map((c) => (
//                   <Pressable
//                     key={c.id}
//                     onPress={() => {
//                       setSelectedCustomer(c);
//                       setCustomerPickerOpen(false);
//                       setCustomerSearch('');
//                     }}
//                     style={({ pressed }) => [
//                       styles.customerResultRow,
//                       { backgroundColor: pressed ? colors.primary + '12' : 'transparent' },
//                     ]}
//                   >
//                     <View style={[styles.customerAvatar, { backgroundColor: colors.primary + '18' }]}>
//                       <Text style={{ fontFamily: F, fontSize: 12, fontWeight: '700', color: colors.primary }}>
//                         {c.name?.charAt(0)?.toUpperCase() || '?'}
//                       </Text>
//                     </View>
//                     <View style={{ flex: 1 }}>
//                       <Text style={[styles.productName, { color: colors.foreground }]}>{c.name}</Text>
//                       <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>{c.phone}</Text>
//                     </View>
//                   </Pressable>
//                 ))
//               )}
//             </ScrollView>

//             <Pressable
//               onPress={() => {
//                 setCustomerPickerOpen(false);
//                 setCustomerSearch('');
//                 setNewCustomerModalOpen(true);
//               }}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 paddingVertical: 12,
//                 marginTop: 6,
//                 borderTopWidth: 1,
//                 borderTopColor: colors.border,
//               }}
//             >
//               <Feather name="plus-circle" size={16} color={colors.primary} />
//               <Text style={{ fontFamily: F, color: colors.primary, marginLeft: 8 }}>Add new customer</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       {/* Add new customer — small popup with Name + Phone */}
//       <Modal visible={newCustomerModalOpen} transparent animationType="fade" onRequestClose={() => setNewCustomerModalOpen(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.resultModalContent, { backgroundColor: colors.card, alignItems: 'stretch' }]}>
//             <Text style={[styles.modalTitle, { color: colors.foreground, textAlign: 'center', marginBottom: 14 }]}>Add new customer</Text>

//             <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Name</Text>
//             <TextInput
//               value={newCustomerName}
//               onChangeText={setNewCustomerName}
//               placeholder="Customer name"
//               placeholderTextColor={colors.mutedForeground}
//               style={[styles.receivedInput, { borderColor: colors.border, color: colors.foreground, marginBottom: 12 }]}
//               autoFocus
//             />

//             <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Phone (optional)</Text>
//             <TextInput
//               value={newCustomerPhone}
//               onChangeText={setNewCustomerPhone}
//               placeholder="Skip if the customer doesn't wish to share"
//               placeholderTextColor={colors.mutedForeground}
//               keyboardType="phone-pad"
//               style={[styles.receivedInput, { borderColor: duplicateCustomer ? '#D97706' : colors.border, color: colors.foreground }]}
//             />

//             {duplicateCustomer && (
//               <View style={styles.dupWarningBox}>
//                 <Feather name="alert-triangle" size={14} color="#92400E" />
//                 <Text style={styles.dupWarningText}>
//                   This phone number already belongs to {duplicateCustomer.name}. Tap "Use existing" to select them instead.
//                 </Text>
//               </View>
//             )}

//             <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' }}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setNewCustomerModalOpen(false);
//                   setNewCustomerName('');
//                   setNewCustomerPhone('');
//                 }}
//                 style={[styles.resultBtn, { borderWidth: 1, borderColor: colors.border }]}
//               >
//                 <Text style={[styles.resultBtnText, { color: colors.foreground }]}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleCreateNewCustomer}
//                 disabled={!newCustomerName.trim() || isCreatingCustomer}
//                 style={[
//                   styles.resultBtn,
//                   { backgroundColor: duplicateCustomer ? '#D97706' : colors.primary, opacity: !newCustomerName.trim() || isCreatingCustomer ? 0.6 : 1 },
//                 ]}
//               >
//                 <Text style={[styles.resultBtnText, { color: '#fff' }]}>
//                   {isCreatingCustomer ? 'Saving…' : duplicateCustomer ? 'Use existing' : 'Save customer'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Recall — pick a held or saved-draft bill to restore */}
//       <Modal visible={recallVisible} transparent animationType="slide" onRequestClose={() => setRecallVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Text style={[styles.modalTitle, { color: colors.foreground }]}>Recall a bill</Text>
//               <Pressable onPress={() => setRecallVisible(false)} hitSlop={8}>
//                 <Feather name="x" size={20} color={colors.mutedForeground} />
//               </Pressable>
//             </View>
//             <ScrollView style={{ maxHeight: 340, marginTop: 12 }}>
//               {savedBills.length === 0 ? (
//                 <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingVertical: 20, textAlign: 'center' }]}>
//                   No held or saved bills yet
//                 </Text>
//               ) : (
//                 savedBills.map((b) => (
//                   <Pressable key={b.id} onPress={() => recallBill(b)} style={[styles.productRow, { borderBottomColor: colors.border }]}>
//                     <View
//                       style={[
//                         styles.categoryIconWrap,
//                         { backgroundColor: (b.kind === 'hold' ? '#D97706' : '#16A34A') + '20' },
//                       ]}
//                     >
//                       <Feather name={b.kind === 'hold' ? 'pause-circle' : 'save'} size={14} color={b.kind === 'hold' ? '#D97706' : '#16A34A'} />
//                     </View>
//                     <View style={{ flex: 1 }}>
//                       <Text style={[styles.productName, { color: colors.foreground }]}>
//                         {b.invoiceNumber} · {b.customer?.name ?? 'Walk-in customer'}
//                       </Text>
//                       <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>
//                         {(b.cart ?? []).length} item{(b.cart ?? []).length !== 1 ? 's' : ''} · {new Date(b.savedAt).toLocaleString()}
//                       </Text>
//                     </View>
//                     <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
//                   </Pressable>
//                 ))
//               )}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {/* Print receipt — thermal-style layout, printed via browser dialog on web */}
//       <Modal visible={printVisible} transparent animationType="slide" onRequestClose={() => setPrintVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '85%' }]}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Text style={[styles.modalTitle, { color: colors.foreground }]}>Receipt preview</Text>
//               <Pressable onPress={() => setPrintVisible(false)} hitSlop={8}>
//                 <Feather name="x" size={20} color={colors.mutedForeground} />
//               </Pressable>
//             </View>
//             <ScrollView style={{ maxHeight: 420, marginTop: 12 }}>
//               <View nativeID="pos-receipt-print-area" style={styles.receiptBox}>
//                 <Text style={styles.receiptMono}>{printData ? generateReceiptText(printData) : ''}</Text>
//               </View>
//             </ScrollView>
//             <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
//               <TouchableOpacity onPress={triggerBrowserPrint} style={[styles.resultBtn, { backgroundColor: '#2563EB', flex: 1 }]}>
//                 <Feather name="printer" size={15} color="#fff" />
//                 <Text style={[styles.resultBtnText, { color: '#fff', marginLeft: 6 }]}>{Platform.OS === 'web' ? 'Print' : 'Share'}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setPrintVisible(false)} style={[styles.resultBtn, { borderWidth: 1, borderColor: colors.border, flex: 1 }]}>
//                 <Text style={[styles.resultBtnText, { color: colors.foreground }]}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <BarcodeScanModal visible={scannerOpen} onClose={() => setScannerOpen(false)} onScanned={handleBarcodeScanned} />
//     </View>
//   );
// }

// const SPLIT_LEG_METHODS: PaymentMethod[] = ['cash', 'card', 'upi'];

// function SplitLeg({
//   label,
//   method,
//   onMethodChange,
//   amount,
//   onAmountChange,
//   colors,
// }: {
//   label: string;
//   method: PaymentMethod;
//   onMethodChange: (m: PaymentMethod) => void;
//   amount: string;
//   onAmountChange: (v: string) => void;
//   colors: any;
// }) {
//   return (
//     <View>
//       <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>{label}</Text>
//       <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
//         <View style={{ flexDirection: 'row', gap: 4 }}>
//           {SPLIT_LEG_METHODS.map((m) => {
//             const meta = PAYMENT_METHODS.find((pm) => pm.value === m)!;
//             const active = m === method;
//             return (
//               <Pressable
//                 key={m}
//                 onPress={() => onMethodChange(m)}
//                 style={[styles.splitLegChip, { borderColor: active ? meta.color : colors.border, backgroundColor: active ? meta.color + '18' : colors.background }]}
//               >
//                 <PaymentIcon method={m} icon={meta.icon} size={12} color={active ? meta.color : colors.mutedForeground} />
//               </Pressable>
//             );
//           })}
//         </View>
//         <TextInput
//           value={amount}
//           onChangeText={onAmountChange}
//           keyboardType="numeric"
//           style={[styles.receivedInput, { flex: 1, borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background }]}
//         />
//       </View>
//     </View>
//   );
// }

// function SummaryRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
//   return (
//     <View style={[styles.summaryInnerRow, !last && { marginBottom: 8 }]}>
//       <Text style={styles.summaryLabel}>{label}</Text>
//       <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
//     </View>
//   );
// }

// function BottomAction({
//   icon,
//   label,
//   color,
//   onPress,
// }: {
//   icon: keyof typeof Feather.glyphMap;
//   label: string;
//   color: string;
//   onPress: () => void;
// }) {
//   return (
//     <Pressable onPress={onPress} style={[styles.bottomActionBtn, { backgroundColor: color }]}>
//       <Feather name={icon} size={15} color="#fff" />
//       <Text style={styles.bottomActionLabel}>{label}</Text>
//     </Pressable>
//   );
// }

// // Single row used for both category-filtered and search-result product lists.
// function ProductRow({
//   p,
//   colors,
//   business,
//   addToCart,
//   setSearch,
// }: {
//   p: Product;
//   colors: any;
//   business: any;
//   addToCart: (p: Product) => void;
//   setSearch: (v: string) => void;
// }) {
//   const outOfStock = (p.stock_qty ?? 0) <= 0;
//   const lowStock = !outOfStock && (p.stock_qty ?? 0) <= (p.low_stock_alert ?? 5);
//   return (
//     <Pressable
//       onPress={() => {
//         if (outOfStock) return;
//         addToCart(p);
//         setSearch('');
//       }}
//       disabled={outOfStock}
//       style={[styles.productRow, { borderBottomColor: colors.border, opacity: outOfStock ? 0.5 : 1 }]}
//     >
//       <View style={[styles.productThumb, { backgroundColor: colors.background }]}>
//         <Feather name="image" size={16} color={colors.mutedForeground} />
//       </View>
//       <View style={{ flex: 1 }}>
//         <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>
//           {p.name}
//         </Text>
//         <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>
//           {formatCurrency(p.selling_price ?? 0, business?.currency)} · {unitLabel(p.unit)} ·{' '}
//           {outOfStock ? 'Out of stock' : lowStock ? `Low stock (${p.stock_qty})` : `Stock ${p.stock_qty ?? 0}`}
//         </Text>
//       </View>
//       <Feather name="plus-circle" size={18} color={outOfStock ? colors.mutedForeground : colors.primary} />
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   topBar: { paddingHorizontal: 16, paddingBottom: 14, backgroundColor: '#2563EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
//   topBarIconWrap: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
//   topBarTitle: { fontFamily: F, fontSize: 16, fontWeight: '700', color: '#fff' },
//   topBarMeta: { fontFamily: F, fontSize: 11, color: '#DBEAFE' },

//   wideRow: { flex: 1, flexDirection: 'row', padding: 12, gap: 12, alignItems: 'stretch' },

//   resumeBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     gap: 10,
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   resumeBannerText: { flex: 1, fontFamily: F, fontSize: 12.5, color: '#92400E', fontWeight: '600', minWidth: 180 },
//   resumeBannerBtn: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
//   resumeBannerBtnText: { fontFamily: F, fontSize: 12, fontWeight: '700', color: '#fff' },
//   resumeBannerBtnGhost: { borderWidth: 1, borderColor: '#92400E', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
//   resumeBannerBtnGhostText: { fontFamily: F, fontSize: 12, fontWeight: '700', color: '#92400E' },

//   panel: { borderWidth: 1, borderRadius: 12, padding: 14 },
//   panelStacked: { width: '100%' },
//   leftPanelWide: { flex: 1.3 },
//   billPanelWide: { flex: 3 },

//   panelTitle: { fontFamily: F, fontSize: 15, fontWeight: '700' },
//   sectionLabel: { fontFamily: F, fontSize: 11, fontWeight: '700', marginTop: 14, marginBottom: 6, textTransform: 'uppercase' },
//   emptyText: { fontFamily: F, fontSize: 12 },

//   searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
//   searchInput: { flex: 1, fontFamily: F, fontSize: 13, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}) },

//   chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
//   categoryRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 },
//   categoryIconWrap: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
//   categoryLabel: { flex: 1, fontFamily: F, fontSize: 13, marginLeft: 10 },
//   quickChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, maxWidth: 110 },
//   quickChipText: { fontFamily: F, fontSize: 12, fontWeight: '600' },

//   productRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1 },
//   productThumb: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
//   productName: { fontFamily: F, fontSize: 13, fontWeight: '700' },
//   productMeta: { fontFamily: F, fontSize: 11 },

//   billHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'transparent' },
//   customerPill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, alignSelf: 'flex-start' },
//   customerPillText: { fontFamily: F, fontSize: 13, marginLeft: 6 },
//   billMeta: { fontFamily: F, fontSize: 12, marginTop: 4 },

//   customerResultRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 6,
//     borderRadius: 8,
//   },
//   customerAvatar: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dupWarningBox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 6,
//     backgroundColor: '#FEF3C7',
//     borderRadius: 8,
//     padding: 10,
//     marginTop: 8,
//   },
//   dupWarningText: {
//     flex: 1,
//     fontFamily: F,
//     fontSize: 12,
//     color: '#92400E',
//     lineHeight: 16,
//   },

//   tableHeaderRow: { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 6, borderRadius: 8, marginBottom: 4 },
//   th: { fontFamily: F, fontSize: 11, fontWeight: '700' },
//   tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderBottomWidth: 1 },
//   td: { fontFamily: F, fontSize: 13 },
//   tdName: { fontFamily: F, fontSize: 13, fontWeight: '600' },
//   tdSub: { fontFamily: F, fontSize: 10 },
//   tdTotal: { fontFamily: F, fontSize: 13, fontWeight: '700' },
//   qtyInput: { fontFamily: F, width: 30, textAlign: 'center', fontSize: 13 },

//   mobileCartCard: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 },

//   summaryRowWide: { flexDirection: 'row', gap: 14, marginTop: 16, alignItems: 'flex-start' },
//   summaryLeftCol: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 },
//   summaryRightCol: { flex: 1.1 },
//   summaryInnerRow: { flexDirection: 'row', justifyContent: 'space-between' },
//   summaryLabel: { fontFamily: F, fontSize: 13, color: '#6B7280' },
//   summaryValue: { fontFamily: F, fontSize: 13, fontWeight: '600' },
//   discountEditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
//   discountInput: { fontFamily: F, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, width: 90, textAlign: 'right', fontSize: 13, fontWeight: '700' },

//   netAmountBox: { padding: 14, borderRadius: 10, backgroundColor: '#FEF3C7', alignItems: 'flex-start' },
//   netAmountLabel: { fontFamily: F, fontSize: 13, color: '#92400E', fontWeight: '600' },
//   netAmountValue: { fontFamily: F, fontSize: 26, fontWeight: '700', color: '#1D4ED8', marginTop: 2 },

//   paymentChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginTop: 10 },
//   paymentChipText: { fontFamily: F, fontSize: 12, marginLeft: 5 },
//   splitLegChip: { width: 30, height: 30, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
//   receivedInput: { fontFamily: F, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, fontWeight: '700' },

//   actionBtnSmall: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 8, paddingVertical: 8 },
//   actionBtnSmallText: { fontFamily: F, fontSize: 11, marginLeft: 4 },

//   bottomActionBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 12, marginTop: 4 },
//   bottomActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 14, gap: 8 },
//   bottomActionLabel: { fontFamily: F, color: '#fff', fontSize: 13, fontWeight: '600' },

//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
//   modalContent: { width: '100%', maxWidth: 420, borderRadius: 14, padding: 20, maxHeight: '80%' },
//   modalTitle: { fontFamily: F, fontSize: 16, fontWeight: '700' },

//   resultModalContent: { width: '100%', maxWidth: 360, borderRadius: 16, padding: 24, alignItems: 'center' },
//   resultIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
//   resultTitle: { fontFamily: F, fontSize: 16, fontWeight: '700', textAlign: 'center' },
//   resultMessage: { fontFamily: F, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
//   resultBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, flex: 1 },
//   resultBtnText: { fontFamily: F, fontSize: 14, fontWeight: '700' },

//   receiptBox: { backgroundColor: '#fff', borderRadius: 8, padding: 14 },
//   receiptMono: { fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'Courier New' }), fontSize: 12, lineHeight: 17, color: '#111' },
// });

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BarcodeScanModal } from '@/components/BarcodeScanModal';
import { formatCurrency } from '@/lib/format';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useListProducts,
  useListCustomers,
  useCreateCustomer,
  useCreateTransaction,
  useUpdateProduct,
  TransactionInputType,
  TransactionInputPaymentMode,
  getListProductsQueryKey,
  getListCustomersQueryKey,
  useListActivePromotions,
  getListActivePromotionsQueryKey,
  customFetch,
} from '@workspace/api-client-react';
// @ts-ignore
import type { Product, Customer } from '@workspace/api-client-react';

// ---------------------------------------------------------------------------
// Responsive breakpoint — below this, the 2-panel POS layout collapses
// into a single stacked mobile flow.
// ---------------------------------------------------------------------------
const WIDE_BREAKPOINT = 900;
const F = 'times new roman';

type CartItemWithDiscount = { product: Product; qty: number; discountPercent: number;
  freeQty: number;       // 0 unless BOGO
  isBogo: boolean;
  promotionId?: number;
  promotionName?: string; };
type PaymentMethod = 'cash' | 'upi' | 'card' | 'split' | 'credit';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: keyof typeof Feather.glyphMap; color: string }[] = [
  { value: 'cash', label: 'Cash', icon: 'dollar-sign', color: '#16A34A' }, // icon overridden to ₹ — see PaymentIcon
  { value: 'card', label: 'Card', icon: 'credit-card', color: '#2563EB' },
  { value: 'upi', label: 'UPI', icon: 'smartphone', color: '#7C3AED' },
  { value: 'split', label: 'Split', icon: 'divide', color: '#D97706' },
  { value: 'credit', label: 'Credit', icon: 'clock', color: '#DC2626' },
];

// Feather has no rupee glyph — render ₹ as text for cash, Feather icon for everything else.
function PaymentIcon({ method, icon, size, color }: { method: PaymentMethod; icon: keyof typeof Feather.glyphMap; size: number; color: string }) {
  if (method === 'cash') {
    return <Text style={{ fontSize: size, fontWeight: '800', color, lineHeight: size + 1 }}>₹</Text>;
  }
  return <Feather name={icon} size={size} color={color} />;
}

const CATEGORY_STYLE: Record<string, { icon: keyof typeof Feather.glyphMap; color: string }> = {
  dairy: { icon: 'droplet', color: '#2563EB' },
  milk: { icon: 'droplet', color: '#2563EB' },
  snacks: { icon: 'coffee', color: '#D97706' },
  drinks: { icon: 'coffee', color: '#14B8A6' },
  grocery: { icon: 'shopping-bag', color: '#16A34A' },
  fruits: { icon: 'shopping-bag', color: '#DC2626' },
  'personal care': { icon: 'user', color: '#8B5CF6' },
  'home care': { icon: 'home', color: '#EA580C' },
  stationery: { icon: 'edit-3', color: '#0EA5E9' },
  'stationery items': { icon: 'edit-3', color: '#0EA5E9' },
  'tea powder': { icon: 'coffee', color: '#92400E' },
};
const CATEGORY_FALLBACKS: { icon: keyof typeof Feather.glyphMap; color: string }[] = [
  { icon: 'tag', color: '#2563EB' },
  { icon: 'box', color: '#14B8A6' },
  { icon: 'grid', color: '#8B5CF6' },
  { icon: 'star', color: '#F59E0B' },
];
function categoryIcon(name: string): keyof typeof Feather.glyphMap {
  return CATEGORY_STYLE[name.toLowerCase()]?.icon ?? CATEGORY_FALLBACKS[name.length % CATEGORY_FALLBACKS.length].icon;
}
function categoryColor(name: string): string {
  return CATEGORY_STYLE[name.toLowerCase()]?.color ?? CATEGORY_FALLBACKS[name.length % CATEGORY_FALLBACKS.length].color;
}

const UNIT_LABELS: Record<string, string> = {
  kg: 'Kg', kilogram: 'Kg', kilograms: 'Kg',
  g: 'g', gram: 'g', grams: 'g',
  l: 'Ltr', litre: 'Ltr', litres: 'Ltr', liter: 'Ltr', liters: 'Ltr', ltr: 'Ltr',
  ml: 'ml',
  pcs: 'Pcs', piece: 'Pcs', pieces: 'Pcs', pc: 'Pcs',
  box: 'Box', boxes: 'Box',
  dozen: 'Dz',
};
function unitLabel(unit?: string | null): string {
  if (!unit) return 'Pcs';
  const key = unit.trim().toLowerCase();
  return UNIT_LABELS[key] ?? (unit.charAt(0).toUpperCase() + unit.slice(1));
}

function mapPaymentMethodToApi(method: PaymentMethod): TransactionInputPaymentMode {
  switch (method) {
    case 'cash':
      return TransactionInputPaymentMode.cash;
    case 'upi':
      return TransactionInputPaymentMode.upi;
    default:
      return TransactionInputPaymentMode.online;
  }
}

const STORAGE_KEYS = {
  SALES_PERSON: '@billing_sales_person',
  WALKIN_CUSTOMER_ID: '@billing_walkin_customer_id',
  HELD_BILLS: '@billing_held_bills',
  DRAFT_BILLS: '@billing_draft_bills',
  AUTOSAVE_BILL: '@billing_autosave_bill',
};

type SavedBill = {
  id: string;
  kind: 'hold' | 'draft';
  savedAt: string;
  invoiceNumber: string;
  cart: CartItemWithDiscount[];
  customer: Customer | null;
  discountValue: string;
  paymentMethod: PaymentMethod;
};

export default function BillingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;

  const payParams = useLocalSearchParams<{
    customer_id?: string;
    customer_name?: string;
    invoice_number?: string;
    due_amount?: string;
  }>();

  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItemWithDiscount[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // ---- Add new customer popup ----
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  const [salesPerson, setSalesPerson] = useState('');
  // 🔒 No more client-side counter. Empty until the server hands back a
  // real, business-scoped invoice number at checkout time.
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [billingDate] = useState(new Date());
  const [nextInvoicePreview, setNextInvoicePreview] = useState('');

  const [discountValue, setDiscountValue] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [splitMethod1, setSplitMethod1] = useState<PaymentMethod>('cash');
  const [splitAmount1, setSplitAmount1] = useState('');
  const [splitMethod2, setSplitMethod2] = useState<PaymentMethod>('upi');
  const [splitAmount2, setSplitAmount2] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const pendingScanRef = useRef<string | null>(null);

  // ---- Result / confirm modal (replaces Alert.alert, which is unreliable on web) ----
  // Only used for 'error' and 'confirm' now — success messages use the bottom
  // banner (successBanner) instead of a blocking popup.
  const [resultModal, setResultModal] = useState<{
    type: 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);

  // ---- Success banner — small amber bar near the bottom action buttons,
  // replaces the old centered "Payment completed" popup. ----
  const [successBanner, setSuccessBanner] = useState<{
    title: string;
    message: string;
    showPrintButton?: boolean;
    onConfirm?: () => void;
  } | null>(null);

  // ---- Print receipt ----
  const [printVisible, setPrintVisible] = useState(false);
  const [printData, setPrintData] = useState<{
    invoiceNumber: string;
    date: Date;
    cashier: string;
    customerName: string;
    cart: CartItemWithDiscount[];
    totals: { subtotal: number; gst: number; billDiscount: number; roundOff: number; grandTotal: number };
    paymentMethod: PaymentMethod;
  } | null>(null);

  // ---- Recall (held / draft bills) ----
  const [recallVisible, setRecallVisible] = useState(false);
  const [savedBills, setSavedBills] = useState<SavedBill[]>([]);

  // ---- Auto-saved in-progress bill (silently saved when the cashier navigates
  // away mid-bill, e.g. taps BillingList in the sidebar) ----
  const [resumeBill, setResumeBill] = useState<SavedBill | null>(null);

  const createCustomer = useCreateCustomer();

  useEffect(() => {
    (async () => {
      if ((user as any)?.name) {
        setSalesPerson((user as any).name);
      } else {
        const p = await AsyncStorage.getItem(STORAGE_KEYS.SALES_PERSON);
        if (p) setSalesPerson(p);
      }

      // If a previous session left an in-progress bill behind (cashier navigated
      // away mid-bill), offer to resume it.
      const autosaveRaw = await AsyncStorage.getItem(STORAGE_KEYS.AUTOSAVE_BILL);
      if (autosaveRaw) {
        try {
          const parsed: SavedBill = JSON.parse(autosaveRaw);
          if (parsed && Array.isArray(parsed.cart) && parsed.cart.length > 0) {
            setResumeBill(parsed);
          }
        } catch {
          // ignore corrupt autosave data
        }
      }
    })();
  }, [user]);

  // Keep refs of the latest cart/customer/discount/payment/invoice so the
  // focus-blur cleanup below always autosaves the current values, not stale
  // ones captured at mount time.
  const cartRef = useRef(cart);
  const selectedCustomerRef = useRef(selectedCustomer);
  const discountValueRef = useRef(discountValue);
  const paymentMethodRef = useRef(paymentMethod);
  const invoiceNumberRef = useRef(invoiceNumber);
  useEffect(() => { cartRef.current = cart; }, [cart]);
  useEffect(() => { selectedCustomerRef.current = selectedCustomer; }, [selectedCustomer]);
  useEffect(() => { discountValueRef.current = discountValue; }, [discountValue]);
  useEffect(() => { paymentMethodRef.current = paymentMethod; }, [paymentMethod]);
  useEffect(() => { invoiceNumberRef.current = invoiceNumber; }, [invoiceNumber]);

  // Silently autosave the in-progress bill whenever this screen loses focus
  // (cashier taps BillingList, Reports, etc. with items still in the cart) —
  // no toast, no interruption. Cleared once the cart is empty again.
  useFocusEffect(
    useCallback(() => {
      return () => {
        const currentCart = cartRef.current;
        if (currentCart && currentCart.length > 0) {
          const bill: SavedBill = {
            id: 'autosave',
            kind: 'hold',
            savedAt: new Date().toISOString(),
            invoiceNumber: invoiceNumberRef.current,
            cart: currentCart,
            customer: selectedCustomerRef.current,
            discountValue: discountValueRef.current,
            paymentMethod: paymentMethodRef.current,
          };
          AsyncStorage.setItem(STORAGE_KEYS.AUTOSAVE_BILL, JSON.stringify(bill)).catch(() => {});
        } else {
          AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
        }
      };
    }, []),
  );

  const handleResumeAutosave = () => {
    if (!resumeBill) return;
    setCart(resumeBill.cart ?? []);
    setSelectedCustomer(resumeBill.customer);
    setDiscountValue(resumeBill.discountValue);
    setPaymentMethod(resumeBill.paymentMethod);
    setInvoiceNumber(resumeBill.invoiceNumber);
    setResumeBill(null);
    AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
  };

  const fetchNextInvoicePreview = useCallback(async () => {
  if (!business?.id) return;
  try {
    const res = await customFetch<{ next_invoice_no: string }>(
      `/api/transactions/next-invoice-number?business_id=${business.id}`,
      { responseType: 'json' } as any,
    );
    setNextInvoicePreview(res.next_invoice_no);
  } catch (e) {
    console.error('Failed to fetch next invoice preview:', e);
  }
}, [business?.id]);

useEffect(() => {
  fetchNextInvoicePreview();
}, [fetchNextInvoicePreview]);

  const handleDiscardAutosave = () => {
    setResumeBill(null);
    AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
  };

  useEffect(() => {
    if (payParams.customer_id) {
      setSelectedCustomer({ id: Number(payParams.customer_id), name: payParams.customer_name || 'Customer' } as Customer);
      router.setParams({ customer_id: undefined, customer_name: undefined } as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payParams.customer_id]);

  // -------------------------------------------------------------------------
  // Products
  // -------------------------------------------------------------------------
  const allProductsParams = { business_id: business?.id as number, limit: 200 };
  const { data: allProductsData, isLoading: loadingAllProducts } = useListProducts(allProductsParams, {
    query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(allProductsParams) },
  });
  const allProducts: Product[] = allProductsData?.data ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p: any) => {
      if (p?.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [allProducts]);

  const quickProducts = useMemo(() => allProducts.slice(0, 8), [allProducts]);

  const searchParams = { business_id: business?.id as number, search: search.trim(), limit: 30 };
  const { data: searchData, isLoading: isSearching } = useListProducts(searchParams, {
    query: { enabled: !!business?.id && search.trim().length > 0, queryKey: getListProductsQueryKey(searchParams) },
  });
  const searchResults: Product[] = searchData?.data ?? [];

  const visibleProducts = useMemo(() => {
    if (search.trim().length > 0) return searchResults;
    if (activeCategory === 'All') return [];
    return allProducts.filter((p: any) => p?.category === activeCategory);
  }, [search, searchResults, allProducts, activeCategory]);

  useEffect(() => {
    const pending = pendingScanRef.current;
    if (!pending || isSearching) return;
    if (search.trim() !== pending) return;

    const exact = searchResults.find((p: any) => p.barcode === pending || p.sku === pending);
    const match = exact ?? (searchResults.length === 1 ? searchResults[0] : undefined);

    if (match) {
      addToCart(match);
      setSearch('');
    } else if (searchResults.length === 0) {
      const isBarcodeLike = /^\d{4,}$/.test(pending);
      setResultModal({
        type: 'error',
        title: 'Product not found',
        message: isBarcodeLike
          ? 'Product not found for this barcode.'
          : `No product matches "${pending}". Check the barcode or try a shorter name.`,
      });
    } else {
      setResultModal({
        type: 'error',
        title: 'Multiple matches',
        message: `"${pending}" matched ${searchResults.length} products. Type more of the name, or scan the exact barcode.`,
      });
    }
    pendingScanRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults, isSearching, search]);

  const customerSearchParams = { business_id: business?.id as number, search: customerSearch.trim(), limit: 20 };
  const { data: customerSearchData, isLoading: isSearchingCustomers } = useListCustomers(customerSearchParams, {
    query: {
      enabled: !!business?.id && customerPickerOpen && customerSearch.trim().length > 0,
      queryKey: getListCustomersQueryKey(customerSearchParams),
    },
  });
  const customerResults: Customer[] = customerSearchData?.data ?? [];

  // Duplicate check while adding a new customer — search by the phone they're typing
  const dupCheckParams = { business_id: business?.id as number, search: newCustomerPhone.trim(), limit: 5 };
  const { data: dupCheckData } = useListCustomers(dupCheckParams, {
    query: {
      enabled: !!business?.id && newCustomerModalOpen && newCustomerPhone.trim().length >= 10,
      queryKey: getListCustomersQueryKey(dupCheckParams),
    },
  });
  const normalizePhone = (v: string) => v.replace(/\D/g, '');
  const duplicateCustomer = useMemo(() => {
    const typed = normalizePhone(newCustomerPhone);
    if (typed.length < 10) return null;
    const list: Customer[] = dupCheckData?.data ?? [];
    return list.find((c) => normalizePhone(c.phone || '') === typed) ?? null;
  }, [dupCheckData, newCustomerPhone]);

  // ─── Promotions ───────────────────────────────────────────────────────────
  const activePromoParams = { business_id: business?.id as number };
  const { data: activePromotionsData } = useListActivePromotions(activePromoParams, {
    query: { enabled: !!business?.id, queryKey: getListActivePromotionsQueryKey(activePromoParams) },
  });
  const activePromotions: any[] = activePromotionsData ?? [];

  // Conflict rule: a product-specific BOGO promotion always wins over the
  // general "All Products 10% OFF" promotion (spec §11) — checking BOGO
  // first and returning immediately on a match implements this priority.
  const getPromotionForProduct = (productId: number): { promo: any; type: 'bogo' | 'percentage' } | null => {
    const bogo = activePromotions.find(
      (p) => p.promotion_type === 'bogo' && (p.apply_to === 'all' || (p.product_ids ?? []).includes(productId))
    );
    if (bogo) return { promo: bogo, type: 'bogo' };
    const pct = activePromotions.find(
      (p) => p.promotion_type === 'percentage' && (p.apply_to === 'all' || (p.product_ids ?? []).includes(productId))
    );
    if (pct) return { promo: pct, type: 'percentage' };
    return null;
  };
  // -------------------------------------------------------------------------
  // Cart operations
  // -------------------------------------------------------------------------
  const addToCart = (product: Product) => {
    const existing = cart.find((c) => c.product.id === product.id);
    const nextPaidQty = (existing?.qty ?? 0) + 1;
    const stock = product.stock_qty ?? 0;
    const match = getPromotionForProduct(product.id);

    if (match?.type === 'bogo') {
      const nextFreeQty = nextPaidQty; // classic 1:1 BOGO — spec §8
      if (nextPaidQty + nextFreeQty > stock) {
        setResultModal({ type: 'error', title: 'Insufficient stock', message: 'Insufficient stock for Buy 1 Get 1 Free offer.' });
        return;
      }
      setCart((prev) => {
        const idx = prev.findIndex((c) => c.product.id === product.id);
        const updated: CartItemWithDiscount = {
          product, qty: nextPaidQty, freeQty: nextFreeQty, discountPercent: 0, isBogo: true,
          promotionId: match.promo.id, promotionName: match.promo.name,
        };
        if (idx >= 0) return prev.map((c, i) => (i === idx ? updated : c));
        return [...prev, updated];
      });
      return;
    }

    if (nextPaidQty > stock) {
      setResultModal({ type: 'error', title: 'Insufficient stock', message: `Only ${stock} unit${stock === 1 ? '' : 's'} of "${product.name}" available.` });
      return;
    }

    const autoDiscount = match?.type === 'percentage' ? Number(match.promo.discount_percentage ?? 10) : 0;
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product.id === product.id);
      const updated: CartItemWithDiscount = {
        product, qty: nextPaidQty, freeQty: 0, discountPercent: autoDiscount, isBogo: false,
        promotionId: match?.type === 'percentage' ? match.promo.id : undefined,
        promotionName: match?.type === 'percentage' ? match.promo.name : undefined,
      };
      if (idx >= 0) return prev.map((c, i) => (i === idx ? updated : c));
      return [...prev, updated];
    });
  };

  const changeQty = (productId: number, newPaidQty: number) => {
    if (newPaidQty <= 0) {
      setCart((prev) => prev.filter((c) => c.product.id !== productId));
      return;
    }
    const item = cart.find((c) => c.product.id === productId);
    if (!item) return;
    const stock = item.product.stock_qty ?? 0;

    if (item.isBogo) {
      if (newPaidQty * 2 > stock) {
        setResultModal({ type: 'error', title: 'Insufficient stock', message: 'Insufficient stock for Buy 1 Get 1 Free offer.' });
        return;
      }
      setCart((prev) => prev.map((c) => (c.product.id === productId ? { ...c, qty: newPaidQty, freeQty: newPaidQty } : c)));
      return;
    }

    if (newPaidQty > stock) {
      setResultModal({ type: 'error', title: 'Insufficient stock', message: `Only ${stock} unit${stock === 1 ? '' : 's'} of "${item.product.name}" available.` });
      return;
    }
    setCart((prev) => prev.map((c) => (c.product.id === productId ? { ...c, qty: newPaidQty } : c)));
  };

  const removeItem = (productId: number) => setCart((prev) => prev.filter((c) => c.product.id !== productId));

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscountValue('0');
    setAmountReceived('');
    setPaymentMethod('cash');
    setSplitMethod1('cash');
    setSplitAmount1('');
    setSplitMethod2('upi');
    setSplitAmount2('');
    setInvoiceNumber(''); // 🔒 next bill's number comes from the server, fresh
    AsyncStorage.removeItem(STORAGE_KEYS.AUTOSAVE_BILL).catch(() => {});
  };

  const handleBarcodeScanned = (code: string) => {
    setScannerOpen(false);
    pendingScanRef.current = code;
    setSearch(code);
  };

  // -------------------------------------------------------------------------
  // Totals
  // -------------------------------------------------------------------------
  const totals = useMemo(() => {
    let subtotal = 0;
    let gst = 0;
    let totalQty = 0;
    let promoDiscountTotal = 0; // NEW — sum of all auto-applied 10% promo savings
    cart.forEach(({ product, qty, discountPercent }) => {
      const price = product.selling_price ?? 0;
      const lineTotal = price * qty;
      const discountAmount = (lineTotal * discountPercent) / 100;
      const afterDiscount = lineTotal - discountAmount;
      const gstAmount = (afterDiscount * (product.gst_rate ?? 0)) / 100;
      subtotal += afterDiscount;
      gst += gstAmount;
      totalQty += qty;
      promoDiscountTotal += discountAmount;
    });
    const billDiscount = parseFloat(discountValue) || 0;
    const preRound = Math.max(subtotal - billDiscount + gst, 0);
    const rounded = Math.round(preRound);
    const roundOff = rounded - preRound;
    return { subtotal, gst, billDiscount, totalQty, grandTotal: rounded, roundOff, promoDiscountTotal };
  }, [cart, discountValue]);

  useEffect(() => {
    setAmountReceived(cart.length > 0 ? totals.grandTotal.toFixed(2) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.grandTotal, cart.length]);

  // Default split amounts: first leg gets everything, second starts at 0 —
  // cashier then re-splits by typing in either field.
  useEffect(() => {
    if (cart.length > 0) {
      setSplitAmount1(totals.grandTotal.toFixed(2));
      setSplitAmount2('0.00');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.grandTotal, cart.length, paymentMethod]);

  const handleSplitAmount1Change = (text: string) => {
    setSplitAmount1(text);
    const amt1 = parseFloat(text) || 0;
    setSplitAmount2(Math.max(totals.grandTotal - amt1, 0).toFixed(2));
  };
  const handleSplitAmount2Change = (text: string) => {
    setSplitAmount2(text);
    const amt2 = parseFloat(text) || 0;
    setSplitAmount1(Math.max(totals.grandTotal - amt2, 0).toFixed(2));
  };
  const splitTotal = (parseFloat(splitAmount1) || 0) + (parseFloat(splitAmount2) || 0);

  const balanceAmount = useMemo(() => (parseFloat(amountReceived) || 0) - totals.grandTotal, [amountReceived, totals.grandTotal]);

  // -------------------------------------------------------------------------
  // Checkout
  // -------------------------------------------------------------------------
  const createTransaction = useCreateTransaction();
  const updateProduct = useUpdateProduct();

  const buildBillDescription = () => cart.map(({ product, qty }) => `${product.name} x${qty}`).join(', ').slice(0, 250);

  // Cash/card/UPI/split sales don't strictly need a named customer — fall
  // back to a cached (or freshly created) "Walk-in customer" record so
  // checkout never silently blocks. Credit sales DO need a real customer,
  // since that's who the outstanding balance is tracked against.
  const getOrCreateWalkInCustomer = async (): Promise<Customer> => {
    const cachedId = await AsyncStorage.getItem(STORAGE_KEYS.WALKIN_CUSTOMER_ID);
    if (cachedId) return { id: Number(cachedId), name: 'Walk-in customer' } as Customer;

    const created = await createCustomer.mutateAsync({
      data: { business_id: business!.id, name: 'Walk-in customer', phone: '', category: 'customer' } as any,
    });
    const newId = (created as any)?.id ?? (created as any)?.data?.id;
    if (newId) await AsyncStorage.setItem(STORAGE_KEYS.WALKIN_CUSTOMER_ID, String(newId));
    return created as Customer;
  };

  const handleCheckout = async (isCreditNow: boolean) => {
    setSubmitError(null);
    if (!business?.id || cart.length === 0) return;

    if (!selectedCustomer && isCreditNow) {
      setResultModal({
        type: 'confirm',
        title: 'Customer required',
        message: 'Credit sales need a real customer so the balance can be tracked. Select or add one to continue.',
        onConfirm: () => {
          setResultModal(null);
          setCustomerPickerOpen(true);
        },
      });
      return;
    }
    if (!isCreditNow && paymentMethod === 'split' && Math.abs(splitTotal - totals.grandTotal) > 0.01) {
      setSubmitError(
        `Split amounts (${formatCurrency(splitTotal, business?.currency)}) must add up to the total (${formatCurrency(totals.grandTotal, business?.currency)}).`,
      );
      return;
    }
    if (!isCreditNow && paymentMethod !== 'split' && (parseFloat(amountReceived) || 0) < totals.grandTotal) {
      setSubmitError(`Amount received is less than the total (${formatCurrency(totals.grandTotal, business?.currency)}).`);
      return;
    }

    const nowIso = new Date().toISOString();
    setIsSubmitting(true);
    try {
      const customer = selectedCustomer ?? (await getOrCreateWalkInCustomer());
      const effectiveGstRate = totals.subtotal > 0 ? (totals.gst / totals.subtotal) * 100 : 0;

      // 🔒 No invoice_no sent from the client anymore — the server generates
      // it atomically, scoped to this business_id, and returns it below.
      const mainTxResult: any = await createTransaction.mutateAsync({
        data: {
          business_id: business.id,
          customer_id: customer.id,
          type: TransactionInputType.you_gave,
          amount: totals.grandTotal,
          tax: totals.gst,
          gst_rate: effectiveGstRate,
          description: buildBillDescription(),
          payment_mode: mapPaymentMethodToApi(paymentMethod),
          entry_date: nowIso,
          items: cart.map((item) => ({ product_id: item.product.id, qty: item.qty, unit_price: item.product.selling_price ?? 0 })),
        },
      });

      const currentInvoice: string =
        mainTxResult?.invoice_no ?? mainTxResult?.data?.invoice_no ?? 'INV-PENDING';
      setInvoiceNumber(currentInvoice);
      fetchNextInvoicePreview();

      if (!isCreditNow) {
        if (paymentMethod === 'split') {
          const amt1 = parseFloat(splitAmount1) || 0;
          const amt2 = parseFloat(splitAmount2) || 0;
          if (amt1 > 0) {
            await createTransaction.mutateAsync({
              data: {
                business_id: business.id,
                customer_id: customer.id,
                type: TransactionInputType.you_got,
                amount: amt1,
                description: `Payment (${splitMethod1}) for invoice ${currentInvoice}`,
                payment_mode: mapPaymentMethodToApi(splitMethod1),
                entry_date: nowIso,
              },
            });
          }
          if (amt2 > 0) {
            await createTransaction.mutateAsync({
              data: {
                business_id: business.id,
                customer_id: customer.id,
                type: TransactionInputType.you_got,
                amount: amt2,
                description: `Payment (${splitMethod2}) for invoice ${currentInvoice}`,
                payment_mode: mapPaymentMethodToApi(splitMethod2),
                entry_date: nowIso,
              },
            });
          }
        } else {
          await createTransaction.mutateAsync({
            data: {
              business_id: business.id,
              customer_id: customer.id,
              type: TransactionInputType.you_got,
              amount: totals.grandTotal,
              description: `Payment received (${paymentMethod}) for invoice ${currentInvoice}`,
              payment_mode: mapPaymentMethodToApi(paymentMethod),
              entry_date: nowIso,
            },
          });
        }
      }

      await Promise.all(
        cart.map((item) =>
          updateProduct.mutateAsync({
            id: item.product.id,
            data: { stock_qty: Math.max((item.product.stock_qty ?? 0) - (item.qty + item.freeQty), 0) },
          }),
        ),
      );

      queryClient.invalidateQueries({ queryKey: ['/api/transactions'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['/api/products'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['/api/customers'], exact: false });
      queryClient.invalidateQueries({ predicate: (q) => typeof q.queryKey[0] === 'string' && (q.queryKey[0] as string).includes('/stats') });

      setIsSubmitting(false);
      setPrintData({
        invoiceNumber: currentInvoice,
        date: new Date(),
        cashier: salesPerson,
        customerName: customer.name,
        cart: [...cart],
        totals,
        paymentMethod,
      });
      setSuccessBanner({
        title: isCreditNow ? 'Invoice created' : 'Payment completed',
        message: `${currentInvoice} saved successfully for ${customer.name}.`,
        showPrintButton: true,
        onConfirm: () => clearCart(),
      });
    } catch (e) {
      console.error('Checkout error:', e);
      setIsSubmitting(false);
      setSubmitError('Could not save the bill. Please try again.');
      setResultModal({
        type: 'error',
        title: 'Checkout failed',
        message: 'Could not save the bill. Please check your connection and try again.',
      });
    }
  };

  // -------------------------------------------------------------------------
  // Add new customer
  // -------------------------------------------------------------------------
  const handleCreateNewCustomer = async () => {
    if (!newCustomerName.trim() || !business?.id) return;
    if (duplicateCustomer) {
      // Don't create a duplicate — just select the existing customer.
      setSelectedCustomer(duplicateCustomer);
      setNewCustomerModalOpen(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      return;
    }
    setIsCreatingCustomer(true);
    try {
      const created = await createCustomer.mutateAsync({
        data: {
          business_id: business.id,
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim(),
          category: 'customer',
        } as any,
      });
      setSelectedCustomer(created as Customer);
      setNewCustomerModalOpen(false);
      setCustomerPickerOpen(false);
      setNewCustomerName('');
      setNewCustomerPhone('');
      setCustomerSearch('');
      queryClient.invalidateQueries({ queryKey: ['/api/customers'], exact: false });
    } catch (e) {
      console.error('Create customer error:', e);
      setResultModal({ type: 'error', title: 'Could not add customer', message: 'Please try again.' });
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  // -------------------------------------------------------------------------
  // Save draft / Hold / Recall
  // -------------------------------------------------------------------------
  const persistBill = async (kind: 'hold' | 'draft') => {
    if (cart.length === 0) {
      setResultModal({ type: 'error', title: 'Cart is empty', message: 'Add items before saving or holding a bill.' });
      return;
    }
    // No real invoice number exists yet at this point (that's only issued at
    // checkout) — use a local reference so Hold/Recall still has something
    // to display and match on.
    const reference = invoiceNumber || `${kind === 'hold' ? 'HOLD' : 'DRAFT'}-${Date.now().toString().slice(-6)}`;
    const key = kind === 'hold' ? STORAGE_KEYS.HELD_BILLS : STORAGE_KEYS.DRAFT_BILLS;
    const existing = await AsyncStorage.getItem(key);
    const list: SavedBill[] = existing ? JSON.parse(existing) : [];
    list.push({
      id: Date.now().toString(),
      kind,
      savedAt: new Date().toISOString(),
      invoiceNumber: reference,
      cart,
      customer: selectedCustomer,
      discountValue,
      paymentMethod,
    });
    await AsyncStorage.setItem(key, JSON.stringify(list));
    setSuccessBanner({
      title: kind === 'hold' ? 'Bill held' : 'Draft saved',
      message: `${reference} is safely stored. You can bring it back from Recall.`,
      onConfirm: () => clearCart(),
    });
  };

  const openRecall = async () => {
    const [heldRaw, draftRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.HELD_BILLS),
      AsyncStorage.getItem(STORAGE_KEYS.DRAFT_BILLS),
    ]);
    const parseValid = (raw: string | null): SavedBill[] => {
      if (!raw) return [];
      try {
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) return [];
        // Older builds saved a different shape (no `cart` array) — drop
        // anything that doesn't match, so Recall never crashes on stale data.
        return list.filter((b) => b && Array.isArray(b.cart));
      } catch {
        return [];
      }
    };
    const held = parseValid(heldRaw);
    const drafts = parseValid(draftRaw);
    setSavedBills([...held, ...drafts].sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1)));
    setRecallVisible(true);
  };

  const recallBill = async (bill: SavedBill) => {
    setCart(bill.cart ?? []);
    setSelectedCustomer(bill.customer);
    setDiscountValue(bill.discountValue);
    setPaymentMethod(bill.paymentMethod);
    setInvoiceNumber(bill.invoiceNumber);

    const key = bill.kind === 'hold' ? STORAGE_KEYS.HELD_BILLS : STORAGE_KEYS.DRAFT_BILLS;
    const existing = await AsyncStorage.getItem(key);
    const list: SavedBill[] = existing ? JSON.parse(existing) : [];
    await AsyncStorage.setItem(key, JSON.stringify(list.filter((b) => b.id !== bill.id)));
    setRecallVisible(false);
  };

  // -------------------------------------------------------------------------
  // Print bill — builds a thermal-receipt-style text layout. On web this
  // opens the browser print dialog; on native it falls back to Share.
  // -------------------------------------------------------------------------
  const generateReceiptText = (data: NonNullable<typeof printData>) => {
    let text = `${business?.business_name || 'Khata-Pro'}\n`;
    text += '================================\n';
    text += `Invoice: ${data.invoiceNumber}\n`;
    text += `Date: ${data.date.toLocaleString()}\n`;
    text += `Cashier: ${data.cashier || 'Admin'}\n`;
    text += `Customer: ${data.customerName}\n`;
    text += '--------------------------------\n';
    data.cart.forEach((item) => {
      const total = (item.product.selling_price ?? 0) * item.qty;
      if (item.isBogo) {
        text += `${item.product.name.padEnd(18).slice(0, 18)} Paid:${item.qty} Free:${item.freeQty}  Rs.${total.toFixed(2)}\n`;
        text += `  (Buy 1 Get 1 Free)\n`;
      } else if (item.discountPercent > 0) {
        text += `${item.product.name.padEnd(18).slice(0, 18)} x${item.qty}  Rs.${total.toFixed(2)} (${item.discountPercent}% OFF)\n`;
      } else {
        text += `${item.product.name.padEnd(18).slice(0, 18)} x${item.qty}  Rs.${total.toFixed(2)}\n`;
      }
    });
    text += '--------------------------------\n';
    text += `Subtotal:    Rs.${data.totals.subtotal.toFixed(2)}\n`;
    if (data.totals.billDiscount > 0) text += `Discount:   -Rs.${data.totals.billDiscount.toFixed(2)}\n`;
    text += `GST:         Rs.${data.totals.gst.toFixed(2)}\n`;
    text += `Round off:   Rs.${data.totals.roundOff.toFixed(2)}\n`;
    text += '================================\n';
    text += `TOTAL:       Rs.${data.totals.grandTotal.toFixed(2)}\n`;
    text += `Payment: ${data.paymentMethod.toUpperCase()}\n`;
    text += '================================\n';
    text += '     Thank you for shopping!\n';
    return text;
  };

  const handlePrint = () => {
    if (cart.length === 0) {
      setResultModal({ type: 'error', title: 'Cart is empty', message: 'Add items before printing a bill.' });
      return;
    }
    setPrintData({
      invoiceNumber: invoiceNumber || 'Not yet issued',
      date: new Date(),
      cashier: salesPerson,
      customerName: selectedCustomer?.name ?? 'Walk-in customer',
      cart,
      totals,
      paymentMethod,
    });
    setPrintVisible(true);
  };

  const triggerBrowserPrint = () => {
    // @ts-ignore — `document`/`window` only exist on the web build (react-native-web)
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Print only the receipt node so the rest of the app UI isn't included.
      // @ts-ignore
      const node = document.getElementById('pos-receipt-print-area');
      if (node) {
        // @ts-ignore
        const printWindow = window.open('', '_blank', 'width=380,height=600');
        if (printWindow) {
          printWindow.document.write(`<html><head><title>${printData?.invoiceNumber ?? 'Receipt'}</title>
            <style>body{font-family:'Courier New',monospace;font-size:12px;padding:16px;white-space:pre-wrap;}</style>
            </head><body>${node.innerText.replace(/\n/g, '<br/>')}</body></html>`);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }
      }
    } else if (printData) {
      Share.share({ message: generateReceiptText(printData), title: printData.invoiceNumber });
    }
  };

  // -------------------------------------------------------------------------
  // Left panel — search, categories, quick products
  // -------------------------------------------------------------------------
  const renderLeftPanel = () => (
    <View style={[styles.panel, isWide ? styles.leftPanelWide : styles.panelStacked, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.panelTitle, { color: colors.foreground }]}>Product search</Text>

      <View style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
        <Feather name="search" size={15} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={(t) => {
            pendingScanRef.current = null;
            setSearch(t);
          }}
          onSubmitEditing={() => {
            const code = search.trim();
            if (code) handleBarcodeScanned(code);
          }}
          placeholder="Barcode / product name — press Enter or scan"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          returnKeyType="search"
        />
        <Pressable onPress={() => setScannerOpen(true)} hitSlop={8}>
          <Feather name="camera" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView style={isWide ? { flex: 1, marginTop: 4 } : undefined} nestedScrollEnabled showsVerticalScrollIndicator={false}>
        {/* Nothing typed, no category picked yet → show categories + quick products */}
        {search.trim().length === 0 && activeCategory === 'All' && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>Categories</Text>
            <View style={{ gap: 6 }}>
              {categories.filter((c) => c !== 'All').map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[styles.categoryRow, { borderColor: colors.border, backgroundColor: colors.background }]}
                >
                  <View style={[styles.categoryIconWrap, { backgroundColor: categoryColor(cat) + '20' }]}>
                    <Feather name={categoryIcon(cat)} size={14} color={categoryColor(cat)} />
                  </View>
                  <Text style={[styles.categoryLabel, { color: colors.foreground }]}>{cat}</Text>
                  <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </View>

            {quickProducts.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.primary }]}>Quick products</Text>
                <View style={styles.chipsRow}>
                  {quickProducts.map((p) => (
                    <Pressable key={p.id} onPress={() => addToCart(p)} style={[styles.quickChip, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.quickChipText, { color: colors.primary }]} numberOfLines={1}>
                        {p.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {/* A category is selected → show ONLY that category's products */}
        {search.trim().length === 0 && activeCategory !== 'All' && (
          <>
            <Pressable
              onPress={() => setActiveCategory('All')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 10 }}
            >
              <Feather name="arrow-left" size={14} color={colors.primary} />
              <Text style={{ fontFamily: F, color: colors.primary, fontSize: 13, fontWeight: '600' }}>Back to categories</Text>
            </Pressable>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 0 }]}>{activeCategory} products</Text>

            {loadingAllProducts ? (
              <ActivityIndicator style={{ paddingVertical: 20 }} color={colors.primary} />
            ) : visibleProducts.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No products found</Text>
            ) : (
              visibleProducts.map((p) => (
                <ProductRow key={p.id} p={p} colors={colors} business={business} addToCart={addToCart} setSearch={setSearch} />
              ))
            )}
          </>
        )}

        {/* Typing in search → show search results */}
        {search.trim().length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, marginTop: 4 }]}>Search results</Text>

            {isSearching ? (
              <ActivityIndicator style={{ paddingVertical: 20 }} color={colors.primary} />
            ) : visibleProducts.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No products found</Text>
            ) : (
              visibleProducts.map((p) => (
                <ProductRow key={p.id} p={p} colors={colors} business={business} addToCart={addToCart} setSearch={setSearch} />
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );

  // -------------------------------------------------------------------------
  // Right panel — ONE unified card: bill header, item table, totals,
  // payment, received/balance. This mirrors the two-card reference layout
  // (search on the left, everything else together on the right).
  // -------------------------------------------------------------------------
  const renderBillPanel = () => (
    <View style={[styles.panel, isWide ? styles.billPanelWide : styles.panelStacked, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Bill header */}
      <View style={styles.billHeaderRow}>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setCustomerPickerOpen(true)}
            style={[styles.customerPill, { borderColor: selectedCustomer ? colors.primary : colors.border }]}
          >
            <Feather name="user" size={13} color={selectedCustomer ? colors.primary : colors.mutedForeground} />
            <Text style={[styles.customerPillText, { color: selectedCustomer ? colors.foreground : colors.mutedForeground }]} numberOfLines={1}>
              {selectedCustomer ? selectedCustomer.name : 'Walk-in customer'}
            </Text>
          </Pressable>
          <Text style={[styles.billMeta, { color: colors.mutedForeground }]}>Phone: {selectedCustomer?.phone || '—'}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.billMeta, { color: colors.foreground }]}>
  Bill no: {invoiceNumber || nextInvoicePreview || 'Auto (on payment)'}
</Text>
          <Text style={[styles.billMeta, { color: colors.mutedForeground }]}>Salesman: {salesPerson || 'Admin'}</Text>
        </View>
      </View>

      <ScrollView style={isWide ? { flex: 1, marginTop: 4 } : undefined} nestedScrollEnabled showsVerticalScrollIndicator={false}>
      {/* Item table */}
      {cart.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
          <Feather name="shopping-cart" size={28} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground, marginTop: 8 }]}>No items added yet</Text>
        </View>
      ) : (
        <View style={{ marginTop: 10 }}>
          {isWide && (
            <View style={[styles.tableHeaderRow, { backgroundColor: colors.primary + '10', borderColor: colors.border }]}>
              <Text style={[styles.th, { flex: 2.4, color: colors.primary }]}>Item name</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'center', color: colors.primary }]}>Qty</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.primary }]}>Price</Text>
              <Text style={[styles.th, { flex: 0.8, textAlign: 'right', color: colors.primary }]}>Disc</Text>
              <Text style={[styles.th, { flex: 0.8, textAlign: 'right', color: colors.primary }]}>Tax</Text>
              <Text style={[styles.th, { flex: 1, textAlign: 'right', color: colors.primary }]}>Total</Text>
              <View style={{ width: 24 }} />
            </View>
          )}

          <FlatList
            data={cart}
            keyExtractor={(c) => String(c.product.id)}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const price = item.product.selling_price ?? 0;
              const lineTotal = price * item.qty;
              const afterDiscount = lineTotal - (lineTotal * item.discountPercent) / 100;
              const gstAmount = (afterDiscount * (item.product.gst_rate ?? 0)) / 100;
              const finalTotal = afterDiscount + gstAmount;

              if (isWide) {
                return (
                  <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                    <View style={{ flex: 2.4 }}>
                      <Text style={[styles.tdName, { color: colors.foreground }]} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <Text style={[styles.tdSub, { color: colors.mutedForeground }]}>{unitLabel(item.product.unit)}</Text>
                      {item.isBogo ? (
                        <Text style={{ fontFamily: F, fontSize: 10, color: '#7C3AED', fontWeight: '700', marginTop: 2 }}>
                          🎁 Buy 1 Get 1 Free · Free Qty: {item.freeQty}
                        </Text>
                      ) : item.discountPercent > 0 ? (
                        <Text style={{ fontFamily: F, fontSize: 10, color: '#16A34A', fontWeight: '700', marginTop: 2 }}>
                          {item.discountPercent}% OFF · -₹{(((item.product.selling_price ?? 0) * item.qty * item.discountPercent) / 100).toFixed(2)}
                        </Text>
                      ) : null}
                    </View>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <Pressable onPress={() => changeQty(item.product.id, item.qty - 1)}>
                        <Feather name="minus-circle" size={16} color={colors.mutedForeground} />
                      </Pressable>
                      <TextInput
                        value={String(item.qty)}
                        onChangeText={(t) => {
                          const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
                          if (!isNaN(n)) changeQty(item.product.id, n);
                        }}
                        keyboardType="number-pad"
                        style={[styles.qtyInput, { color: colors.foreground }]}
                      />
                      <Pressable onPress={() => changeQty(item.product.id, item.qty + 1)}>
                        <Feather name="plus-circle" size={16} color={colors.mutedForeground} />
                      </Pressable>
                      <Text style={[styles.tdSub, { color: colors.mutedForeground, marginLeft: 2 }]}>{unitLabel(item.product.unit)}</Text>
                    </View>
                    <Text style={[styles.td, { flex: 1, textAlign: 'right', color: colors.foreground }]}>{price.toFixed(2)}</Text>
                    <Text style={[styles.td, { flex: 0.8, textAlign: 'right', color: '#DC2626' }]}>{item.discountPercent}%</Text>
                    <Text style={[styles.td, { flex: 0.8, textAlign: 'right', color: '#16A34A' }]}>{item.product.gst_rate ?? 0}%</Text>
                    <Text style={[styles.tdTotal, { flex: 1, textAlign: 'right', color: colors.foreground }]}>{finalTotal.toFixed(2)}</Text>
                    <Pressable onPress={() => removeItem(item.product.id)} style={{ width: 24, alignItems: 'flex-end' }}>
                      <Feather name="trash-2" size={15} color="#DC2626" />
                    </Pressable>
                  </View>
                );
              }

              return (
                <View style={[styles.mobileCartCard, { borderColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.tdName, { color: colors.foreground, flex: 1 }]} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Pressable onPress={() => removeItem(item.product.id)} hitSlop={8}>
                      <Feather name="trash-2" size={15} color="#DC2626" />
                    </Pressable>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Pressable onPress={() => changeQty(item.product.id, item.qty - 1)}>
                        <Feather name="minus-circle" size={18} color={colors.mutedForeground} />
                      </Pressable>
                      <Text style={[styles.tdName, { minWidth: 18, textAlign: 'center', color: colors.foreground }]}>
                        {item.qty} {unitLabel(item.product.unit)}
                      </Text>
                      <Pressable onPress={() => changeQty(item.product.id, item.qty + 1)}>
                        <Feather name="plus-circle" size={18} color={colors.mutedForeground} />
                      </Pressable>
                    </View>
                    <Text style={[styles.tdTotal, { color: colors.foreground }]}>{formatCurrency(finalTotal, business?.currency)}</Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* Totals + payment row */}
      {cart.length > 0 && (
        <View style={isWide ? styles.summaryRowWide : { marginTop: 14, gap: 12 }}>
          {/* Left: discount / gst / round off */}
          <View style={[styles.summaryLeftCol, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <View style={styles.discountEditRow}>
              <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Discount</Text>
              <TextInput
                value={discountValue}
                onChangeText={setDiscountValue}
                keyboardType="numeric"
                style={[styles.discountInput, { borderColor: colors.border, color: '#DC2626' }]}
              />
            </View>
            {totals.promoDiscountTotal > 0 ? (
    <SummaryRow label="Promo Discount (10% OFF)" value={`- ₹ ${totals.promoDiscountTotal.toFixed(2)}`} valueColor="#16A34A" />
  ) : null}
            <SummaryRow label="GST" value={`₹ ${totals.gst.toFixed(2)}`} valueColor="#16A34A" />
            <SummaryRow label="Round off" value={`₹ ${totals.roundOff.toFixed(2)}`} last />
          </View>

          {/* Right: grand total + payment + received/balance */}
          <View style={styles.summaryRightCol}>
            <View style={styles.netAmountBox}>
              <Text style={styles.netAmountLabel}>Grand total</Text>
              <Text style={styles.netAmountValue}>{formatCurrency(totals.grandTotal, business?.currency)}</Text>
            </View>

            <View style={styles.chipsRow}>
              {PAYMENT_METHODS.map((m) => {
                const active = m.value === paymentMethod;
                return (
                  <Pressable
                    key={m.value}
                    onPress={() => setPaymentMethod(m.value)}
                    style={[styles.paymentChip, { borderColor: active ? m.color : colors.border, backgroundColor: active ? m.color + '18' : colors.background }]}
                  >
                    <PaymentIcon method={m.value} icon={m.icon} size={13} color={m.color} />
                    <Text style={[styles.paymentChipText, { color: active ? m.color : colors.foreground }]}>{m.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {paymentMethod === 'split' && (
              <View style={{ marginTop: 10, gap: 10 }}>
                <SplitLeg
                  label="Payment 1"
                  method={splitMethod1}
                  onMethodChange={setSplitMethod1}
                  amount={splitAmount1}
                  onAmountChange={handleSplitAmount1Change}
                  colors={colors}
                />
                <SplitLeg
                  label="Payment 2"
                  method={splitMethod2}
                  onMethodChange={setSplitMethod2}
                  amount={splitAmount2}
                  onAmountChange={handleSplitAmount2Change}
                  colors={colors}
                />
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: Math.abs(splitTotal - totals.grandTotal) < 0.01 ? '#16A34A' : '#DC2626', fontWeight: '700' },
                  ]}
                >
                  {formatCurrency(splitTotal, business?.currency)} of {formatCurrency(totals.grandTotal, business?.currency)} allocated
                </Text>
              </View>
            )}

            {paymentMethod !== 'credit' && paymentMethod !== 'split' && (
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Received</Text>
                  <TextInput
                    value={amountReceived}
                    onChangeText={setAmountReceived}
                    keyboardType="numeric"
                    style={[styles.receivedInput, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background }]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Balance</Text>
                  <View style={[styles.receivedInput, { borderColor: colors.border, backgroundColor: colors.background, justifyContent: 'center' }]}>
                    <Text style={{ fontFamily: F, fontSize: 14, fontWeight: '700', color: balanceAmount < 0 ? '#DC2626' : '#16A34A' }}>
                      {formatCurrency(Math.abs(balanceAmount), business?.currency)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {submitError ? <Text style={[styles.emptyText, { color: '#DC2626', marginTop: 10 }]}>{submitError}</Text> : null}
      </ScrollView>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton
          label={isSubmitting ? 'Processing…' : 'Complete payment'}
          onPress={() => handleCheckout(paymentMethod === 'credit')}
          disabled={isSubmitting || cart.length === 0}
        />
      </View>

      {!isWide && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <TouchableOpacity onPress={clearCart} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
            <Feather name="trash-2" size={14} color="#DC2626" />
            <Text style={[styles.actionBtnSmallText, { color: '#DC2626' }]}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => persistBill('hold')} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
            <Feather name="pause-circle" size={14} color={colors.primary} />
            <Text style={[styles.actionBtnSmallText, { color: colors.primary }]}>Hold</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openRecall} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
            <Feather name="refresh-cw" size={14} color={colors.primary} />
            <Text style={[styles.actionBtnSmallText, { color: colors.primary }]}>Recall</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrint} style={[styles.actionBtnSmall, { borderColor: colors.border }]}>
            <Feather name="printer" size={14} color={colors.primary} />
            <Text style={[styles.actionBtnSmallText, { color: colors.primary }]}>Print</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // -------------------------------------------------------------------------
  // Root
  // -------------------------------------------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.topBarIconWrap}>
            <Feather name="shopping-cart" size={16} color="#2563EB" />
          </View>
          <Text style={styles.topBarTitle}>{business?.business_name || 'Khata-Pro POS'}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name="user" size={12} color="#DBEAFE" />
            <Text style={styles.topBarMeta}>Cashier: {salesPerson || '—'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name="calendar" size={12} color="#DBEAFE" />
            <Text style={styles.topBarMeta}>{billingDate.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {resumeBill && cart.length === 0 && (
        <View style={styles.resumeBanner}>
          <Feather name="clock" size={16} color="#92400E" />
          <Text style={styles.resumeBannerText}>
            Unfinished bill {resumeBill.invoiceNumber} · {(resumeBill.cart ?? []).length} item
            {(resumeBill.cart ?? []).length !== 1 ? 's' : ''} found — was it left open by mistake?
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={handleDiscardAutosave} style={styles.resumeBannerBtnGhost}>
              <Text style={styles.resumeBannerBtnGhostText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResumeAutosave} style={styles.resumeBannerBtn}>
              <Text style={styles.resumeBannerBtnText}>Resume bill</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isWide ? (
        <>
          <View style={styles.wideRow}>
            {renderLeftPanel()}
            {renderBillPanel()}
          </View>
          <View style={styles.bottomActionBar}>
            <BottomAction icon="printer" label="Print bill" color="#2563EB" onPress={handlePrint} />
            <BottomAction icon="save" label="Save" color="#16A34A" onPress={() => persistBill('draft')} />
            <BottomAction icon="pause-circle" label="Hold" color="#D97706" onPress={() => persistBill('hold')} />
            <BottomAction icon="refresh-cw" label="Recall" color="#7C3AED" onPress={openRecall} />
            <BottomAction icon="x-circle" label="Cancel" color="#DC2626" onPress={clearCart} />
          </View>
        </>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled">
          {renderBillPanel()}
          {renderLeftPanel()}
        </ScrollView>
      )}

      {successBanner && (
        <View style={styles.resumeBanner}>
          <Feather name="check-circle" size={16} color="#92400E" />
          <Text style={styles.resumeBannerText}>
            {successBanner.title}: {successBanner.message}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {successBanner.showPrintButton && (
              <TouchableOpacity
                onPress={() => {
                  setPrintVisible(true);
                  setSuccessBanner(null);
                }}
                style={styles.resumeBannerBtnGhost}
              >
                <Text style={styles.resumeBannerBtnGhostText}>Print bill</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                successBanner.onConfirm?.();
                setSuccessBanner(null);
              }}
              style={styles.resumeBannerBtn}
            >
              <Text style={styles.resumeBannerBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Result / confirm modal — replaces Alert.alert, which doesn't reliably render on web. Only for error/confirm now. */}
      <Modal visible={!!resultModal} transparent animationType="fade" onRequestClose={() => setResultModal(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.resultModalContent, { backgroundColor: colors.card }]}>
            <View
              style={[
                styles.resultIconWrap,
                { backgroundColor: resultModal?.type === 'error' ? '#FEE2E2' : '#FEF3C7' },
              ]}
            >
              <Feather
                name={resultModal?.type === 'error' ? 'x-circle' : 'alert-circle'}
                size={26}
                color={resultModal?.type === 'error' ? '#DC2626' : '#D97706'}
              />
            </View>
            <Text style={[styles.resultTitle, { color: colors.foreground }]}>{resultModal?.title}</Text>
            <Text style={[styles.resultMessage, { color: colors.mutedForeground }]}>{resultModal?.message}</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' }}>
              {resultModal?.type === 'confirm' && (
                <TouchableOpacity onPress={() => setResultModal(null)} style={[styles.resultBtn, { borderWidth: 1, borderColor: colors.border }]}>
                  <Text style={[styles.resultBtnText, { color: colors.foreground }]}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => (resultModal?.onConfirm ? resultModal.onConfirm() : setResultModal(null))}
                style={[styles.resultBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.resultBtnText, { color: '#fff' }]}>{resultModal?.type === 'confirm' ? 'Select customer' : 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Customer picker — popup modal */}
      <Modal visible={customerPickerOpen} transparent animationType="fade" onRequestClose={() => setCustomerPickerOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select customer</Text>
              <Pressable onPress={() => { setCustomerPickerOpen(false); setCustomerSearch(''); }} hitSlop={8}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <View style={[styles.searchWrap, { borderColor: colors.border, backgroundColor: colors.background, marginTop: 14 }]}>
              <Feather name="search" size={15} color={colors.mutedForeground} />
              <TextInput
                value={customerSearch}
                onChangeText={setCustomerSearch}
                placeholder="Search by name or phone"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.searchInput, { color: colors.foreground }]}
                autoFocus
              />
              {customerSearch.length > 0 && (
                <Pressable onPress={() => setCustomerSearch('')} hitSlop={8}>
                  <Feather name="x" size={15} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>

            <ScrollView style={{ maxHeight: 320, marginTop: 10 }} nestedScrollEnabled>
              {customerSearch.trim().length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingVertical: 14, textAlign: 'center' }]}>
                  Type a name or phone to search
                </Text>
              ) : isSearchingCustomers ? (
                <ActivityIndicator color={colors.primary} style={{ padding: 14 }} />
              ) : customerResults.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingVertical: 14, textAlign: 'center' }]}>
                  No matches found
                </Text>
              ) : (
                customerResults.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => {
                      setSelectedCustomer(c);
                      setCustomerPickerOpen(false);
                      setCustomerSearch('');
                    }}
                    style={({ pressed }) => [
                      styles.customerResultRow,
                      { backgroundColor: pressed ? colors.primary + '12' : 'transparent' },
                    ]}
                  >
                    <View style={[styles.customerAvatar, { backgroundColor: colors.primary + '18' }]}>
                      <Text style={{ fontFamily: F, fontSize: 12, fontWeight: '700', color: colors.primary }}>
                        {c.name?.charAt(0)?.toUpperCase() || '?'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.productName, { color: colors.foreground }]}>{c.name}</Text>
                      <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>{c.phone}</Text>
                    </View>
                  </Pressable>
                ))
              )}
            </ScrollView>

            <Pressable
              onPress={() => {
                setCustomerPickerOpen(false);
                setCustomerSearch('');
                setNewCustomerModalOpen(true);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                marginTop: 6,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Feather name="plus-circle" size={16} color={colors.primary} />
              <Text style={{ fontFamily: F, color: colors.primary, marginLeft: 8 }}>Add new customer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add new customer — small popup with Name + Phone */}
      <Modal visible={newCustomerModalOpen} transparent animationType="fade" onRequestClose={() => setNewCustomerModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.resultModalContent, { backgroundColor: colors.card, alignItems: 'stretch' }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground, textAlign: 'center', marginBottom: 14 }]}>Add new customer</Text>

            <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Name</Text>
            <TextInput
              value={newCustomerName}
              onChangeText={setNewCustomerName}
              placeholder="Customer name"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.receivedInput, { borderColor: colors.border, color: colors.foreground, marginBottom: 12 }]}
              autoFocus
            />

            <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Phone (optional)</Text>
            <TextInput
              value={newCustomerPhone}
              onChangeText={setNewCustomerPhone}
              placeholder="Skip if the customer doesn't wish to share"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[styles.receivedInput, { borderColor: duplicateCustomer ? '#D97706' : colors.border, color: colors.foreground }]}
            />

            {duplicateCustomer && (
              <View style={styles.dupWarningBox}>
                <Feather name="alert-triangle" size={14} color="#92400E" />
                <Text style={styles.dupWarningText}>
                  This phone number already belongs to {duplicateCustomer.name}. Tap "Use existing" to select them instead.
                </Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, width: '100%' }}>
              <TouchableOpacity
                onPress={() => {
                  setNewCustomerModalOpen(false);
                  setNewCustomerName('');
                  setNewCustomerPhone('');
                }}
                style={[styles.resultBtn, { borderWidth: 1, borderColor: colors.border }]}
              >
                <Text style={[styles.resultBtnText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateNewCustomer}
                disabled={!newCustomerName.trim() || isCreatingCustomer}
                style={[
                  styles.resultBtn,
                  { backgroundColor: duplicateCustomer ? '#D97706' : colors.primary, opacity: !newCustomerName.trim() || isCreatingCustomer ? 0.6 : 1 },
                ]}
              >
                <Text style={[styles.resultBtnText, { color: '#fff' }]}>
                  {isCreatingCustomer ? 'Saving…' : duplicateCustomer ? 'Use existing' : 'Save customer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recall — pick a held or saved-draft bill to restore */}
      <Modal visible={recallVisible} transparent animationType="slide" onRequestClose={() => setRecallVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Recall a bill</Text>
              <Pressable onPress={() => setRecallVisible(false)} hitSlop={8}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 340, marginTop: 12 }}>
              {savedBills.length === 0 ? (
                <Text style={[styles.emptyText, { color: colors.mutedForeground, paddingVertical: 20, textAlign: 'center' }]}>
                  No held or saved bills yet
                </Text>
              ) : (
                savedBills.map((b) => (
                  <Pressable key={b.id} onPress={() => recallBill(b)} style={[styles.productRow, { borderBottomColor: colors.border }]}>
                    <View
                      style={[
                        styles.categoryIconWrap,
                        { backgroundColor: (b.kind === 'hold' ? '#D97706' : '#16A34A') + '20' },
                      ]}
                    >
                      <Feather name={b.kind === 'hold' ? 'pause-circle' : 'save'} size={14} color={b.kind === 'hold' ? '#D97706' : '#16A34A'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.productName, { color: colors.foreground }]}>
                        {b.invoiceNumber} · {b.customer?.name ?? 'Walk-in customer'}
                      </Text>
                      <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>
                        {(b.cart ?? []).length} item{(b.cart ?? []).length !== 1 ? 's' : ''} · {new Date(b.savedAt).toLocaleString()}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Print receipt — thermal-style layout, printed via browser dialog on web */}
      <Modal visible={printVisible} transparent animationType="slide" onRequestClose={() => setPrintVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '85%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Receipt preview</Text>
              <Pressable onPress={() => setPrintVisible(false)} hitSlop={8}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 420, marginTop: 12 }}>
              <View nativeID="pos-receipt-print-area" style={styles.receiptBox}>
                <Text style={styles.receiptMono}>{printData ? generateReceiptText(printData) : ''}</Text>
              </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <TouchableOpacity onPress={triggerBrowserPrint} style={[styles.resultBtn, { backgroundColor: '#2563EB', flex: 1 }]}>
                <Feather name="printer" size={15} color="#fff" />
                <Text style={[styles.resultBtnText, { color: '#fff', marginLeft: 6 }]}>{Platform.OS === 'web' ? 'Print' : 'Share'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPrintVisible(false)} style={[styles.resultBtn, { borderWidth: 1, borderColor: colors.border, flex: 1 }]}>
                <Text style={[styles.resultBtnText, { color: colors.foreground }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BarcodeScanModal visible={scannerOpen} onClose={() => setScannerOpen(false)} onScanned={handleBarcodeScanned} />
    </View>
  );
}

const SPLIT_LEG_METHODS: PaymentMethod[] = ['cash', 'card', 'upi'];

function SplitLeg({
  label,
  method,
  onMethodChange,
  amount,
  onAmountChange,
  colors,
}: {
  label: string;
  method: PaymentMethod;
  onMethodChange: (m: PaymentMethod) => void;
  amount: string;
  onAmountChange: (v: string) => void;
  colors: any;
}) {
  return (
    <View>
      <Text style={[styles.summaryLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {SPLIT_LEG_METHODS.map((m) => {
            const meta = PAYMENT_METHODS.find((pm) => pm.value === m)!;
            const active = m === method;
            return (
              <Pressable
                key={m}
                onPress={() => onMethodChange(m)}
                style={[styles.splitLegChip, { borderColor: active ? meta.color : colors.border, backgroundColor: active ? meta.color + '18' : colors.background }]}
              >
                <PaymentIcon method={m} icon={meta.icon} size={12} color={active ? meta.color : colors.mutedForeground} />
              </Pressable>
            );
          })}
        </View>
        <TextInput
          value={amount}
          onChangeText={onAmountChange}
          keyboardType="numeric"
          style={[styles.receivedInput, { flex: 1, borderColor: colors.border, color: colors.foreground, backgroundColor: colors.background }]}
        />
      </View>
    </View>
  );
}

function SummaryRow({ label, value, valueColor, last }: { label: string; value: string; valueColor?: string; last?: boolean }) {
  return (
    <View style={[styles.summaryInnerRow, !last && { marginBottom: 8 }]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

function BottomAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.bottomActionBtn, { backgroundColor: color }]}>
      <Feather name={icon} size={15} color="#fff" />
      <Text style={styles.bottomActionLabel}>{label}</Text>
    </Pressable>
  );
}

// Single row used for both category-filtered and search-result product lists.
function ProductRow({
  p,
  colors,
  business,
  addToCart,
  setSearch,
}: {
  p: Product;
  colors: any;
  business: any;
  addToCart: (p: Product) => void;
  setSearch: (v: string) => void;
}) {
  const outOfStock = (p.stock_qty ?? 0) <= 0;
  const lowStock = !outOfStock && (p.stock_qty ?? 0) <= (p.low_stock_alert ?? 5);
  return (
    <Pressable
      onPress={() => {
        if (outOfStock) return;
        addToCart(p);
        setSearch('');
      }}
      disabled={outOfStock}
      style={[styles.productRow, { borderBottomColor: colors.border, opacity: outOfStock ? 0.5 : 1 }]}
    >
      <View style={[styles.productThumb, { backgroundColor: colors.background }]}>
        <Feather name="image" size={16} color={colors.mutedForeground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>
          {p.name}
        </Text>
        <Text style={[styles.productMeta, { color: colors.mutedForeground }]}>
          {formatCurrency(p.selling_price ?? 0, business?.currency)} · {unitLabel(p.unit)} ·{' '}
          {outOfStock ? 'Out of stock' : lowStock ? `Low stock (${p.stock_qty})` : `Stock ${p.stock_qty ?? 0}`}
        </Text>
      </View>
      <Feather name="plus-circle" size={18} color={outOfStock ? colors.mutedForeground : colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: { paddingHorizontal: 16, paddingBottom: 14, backgroundColor: '#2563EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  topBarIconWrap: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontFamily: F, fontSize: 16, fontWeight: '700', color: '#fff' },
  topBarMeta: { fontFamily: F, fontSize: 11, color: '#DBEAFE' },

  wideRow: { flex: 1, flexDirection: 'row', padding: 12, gap: 12, alignItems: 'stretch' },

  resumeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resumeBannerText: { flex: 1, fontFamily: F, fontSize: 12.5, color: '#92400E', fontWeight: '600', minWidth: 180 },
  resumeBannerBtn: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  resumeBannerBtnText: { fontFamily: F, fontSize: 12, fontWeight: '700', color: '#fff' },
  resumeBannerBtnGhost: { borderWidth: 1, borderColor: '#92400E', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  resumeBannerBtnGhostText: { fontFamily: F, fontSize: 12, fontWeight: '700', color: '#92400E' },

  panel: { borderWidth: 1, borderRadius: 12, padding: 14 },
  panelStacked: { width: '100%' },
  leftPanelWide: { flex: 1.3 },
  billPanelWide: { flex: 3 },

  panelTitle: { fontFamily: F, fontSize: 15, fontWeight: '700' },
  sectionLabel: { fontFamily: F, fontSize: 11, fontWeight: '700', marginTop: 14, marginBottom: 6, textTransform: 'uppercase' },
  emptyText: { fontFamily: F, fontSize: 12 },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
  searchInput: { flex: 1, fontFamily: F, fontSize: 13, ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}) },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 },
  categoryIconWrap: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { flex: 1, fontFamily: F, fontSize: 13, marginLeft: 10 },
  quickChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, maxWidth: 110 },
  quickChipText: { fontFamily: F, fontSize: 12, fontWeight: '600' },

  productRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1 },
  productThumb: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  productName: { fontFamily: F, fontSize: 13, fontWeight: '700' },
  productMeta: { fontFamily: F, fontSize: 11 },

  billHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'transparent' },
  customerPill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, alignSelf: 'flex-start' },
  customerPillText: { fontFamily: F, fontSize: 13, marginLeft: 6 },
  billMeta: { fontFamily: F, fontSize: 12, marginTop: 4 },

  customerResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  customerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dupWarningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  dupWarningText: {
    flex: 1,
    fontFamily: F,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },

  tableHeaderRow: { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 6, borderRadius: 8, marginBottom: 4 },
  th: { fontFamily: F, fontSize: 11, fontWeight: '700' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderBottomWidth: 1 },
  td: { fontFamily: F, fontSize: 13 },
  tdName: { fontFamily: F, fontSize: 13, fontWeight: '600' },
  tdSub: { fontFamily: F, fontSize: 10 },
  tdTotal: { fontFamily: F, fontSize: 13, fontWeight: '700' },
  qtyInput: { fontFamily: F, width: 30, textAlign: 'center', fontSize: 13 },

  mobileCartCard: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 },

  summaryRowWide: { flexDirection: 'row', gap: 14, marginTop: 16, alignItems: 'flex-start' },
  summaryLeftCol: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 },
  summaryRightCol: { flex: 1.1 },
  summaryInnerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: F, fontSize: 13, color: '#6B7280' },
  summaryValue: { fontFamily: F, fontSize: 13, fontWeight: '600' },
  discountEditRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  discountInput: { fontFamily: F, borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, width: 90, textAlign: 'right', fontSize: 13, fontWeight: '700' },

  netAmountBox: { padding: 14, borderRadius: 10, backgroundColor: '#FEF3C7', alignItems: 'flex-start' },
  netAmountLabel: { fontFamily: F, fontSize: 13, color: '#92400E', fontWeight: '600' },
  netAmountValue: { fontFamily: F, fontSize: 26, fontWeight: '700', color: '#1D4ED8', marginTop: 2 },

  paymentChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginTop: 10 },
  paymentChipText: { fontFamily: F, fontSize: 12, marginLeft: 5 },
  splitLegChip: { width: 30, height: 30, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  receivedInput: { fontFamily: F, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, fontWeight: '700' },

  actionBtnSmall: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 8, paddingVertical: 8 },
  actionBtnSmallText: { fontFamily: F, fontSize: 11, marginLeft: 4 },

  bottomActionBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 12, marginTop: 4 },
  bottomActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingVertical: 14, gap: 8 },
  bottomActionLabel: { fontFamily: F, color: '#fff', fontSize: 13, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 420, borderRadius: 14, padding: 20, maxHeight: '80%' },
  modalTitle: { fontFamily: F, fontSize: 16, fontWeight: '700' },

  resultModalContent: { width: '100%', maxWidth: 360, borderRadius: 16, padding: 24, alignItems: 'center' },
  resultIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  resultTitle: { fontFamily: F, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  resultMessage: { fontFamily: F, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  resultBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, flex: 1 },
  resultBtnText: { fontFamily: F, fontSize: 14, fontWeight: '700' },

  receiptBox: { backgroundColor: '#fff', borderRadius: 8, padding: 14 },
  receiptMono: { fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'Courier New' }), fontSize: 12, lineHeight: 17, color: '#111' },
});