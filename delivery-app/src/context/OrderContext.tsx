
import React, { createContext, useState, ReactNode, useEffect } from 'react';

export interface Order {
  id: string;
  restaurantName: string;
  items: any[];
  total: number;
  status: 'Placed' | 'Preparing' | 'Ready' | 'On the way' | 'Delivered' | 'Cancelled';
  createdAt: string;
  deliveredAt?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
  getFilteredOrders: (tab: 'current' | 'past' | 'cancelled') => Order[];
  refreshOrders: () => void;
}

export const OrderContext = createContext<OrderContextType>({
  orders: [],
  addOrder: () => {},
  updateOrderStatus: () => {},
  getOrders: () => [],
  getOrderById: () => undefined,
  getFilteredOrders: () => [],
  refreshOrders: () => {},
});

interface OrderProviderProps {
  children: ReactNode;
}

export function OrderProvider({ children }: OrderProviderProps): JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from AsyncStorage on mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Save orders to AsyncStorage whenever they change
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const loadOrders = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const storedOrders = await AsyncStorage.getItem('orders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        console.log('📦 Loaded orders from storage:', parsedOrders.length);
        setOrders(parsedOrders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const saveOrders = async (ordersToSave: Order[]) => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('orders', JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Failed to save orders:', error);
    }
  };

  const addOrder = (order: Order) => {
    console.log('➕ Adding order:', order);
    setOrders(prev => {
      const newOrders = [order, ...prev];
      console.log('📦 Updated orders:', newOrders.length);
      return newOrders;
    });
  };

  // ✅ FIXED: Update order status
  const updateOrderStatus = (id: string, status: Order['status']) => {
    console.log(`🔄 Updating order ${id} to status: ${status}`);
    
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.id === id 
          ? { 
              ...order, 
              status, 
              deliveredAt: status === 'Delivered' ? new Date().toISOString() : order.deliveredAt 
            } 
          : order
      );
      console.log(`✅ Order ${id} status updated to: ${status}`);
      return updatedOrders;
    });
  };

  const getOrders = () => orders;

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  // ✅ FIXED: Get filtered orders based on tab
  const getFilteredOrders = (tab: 'current' | 'past' | 'cancelled'): Order[] => {
    console.log(`🔍 Filtering orders for tab: ${tab}`);
    console.log(`📊 Total orders in context: ${orders.length}`);
    
    // Log all order statuses for debugging
    orders.forEach(o => {
      console.log(`📋 Order ${o.id}: status = ${o.status}`);
    });
    
    let filtered: Order[];
    if (tab === 'current') {
      // ✅ CURRENT: Only orders that are NOT Delivered and NOT Cancelled
      filtered = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
    } else if (tab === 'past') {
      // ✅ PAST: Only orders that are Delivered
      filtered = orders.filter(o => o.status === 'Delivered');
    } else {
      // ✅ CANCELLED: Only orders that are Cancelled
      filtered = orders.filter(o => o.status === 'Cancelled');
    }
    
    console.log(`📋 ${tab} orders: ${filtered.length}`);
    return filtered;
  };

  // ✅ Refresh orders - trigger re-render
  const refreshOrders = () => {
    console.log('🔄 Refreshing orders...');
    setOrders(prev => [...prev]);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus, 
      getOrders, 
      getOrderById,
      getFilteredOrders,
      refreshOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}