import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

// NOTE: AddressProvider must be rendered INSIDE <AuthProvider>, because it reads
// the logged-in customer from AuthContext.

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000') + '/api';

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  landmark?: string;
  phone?: string;
}

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  addAddress: (address: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => Promise<Address | null>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  setSelectedAddress: (address: Address | null) => void;
  getAddresses: () => Address[];
  getDefaultAddress: () => Address | undefined;
  refreshAddresses: () => Promise<void>;
}

export const AddressContext = createContext<AddressContextType>({
  addresses: [],
  selectedAddress: null,
  loading: true,
  addAddress: async () => null,
  updateAddress: async () => {},
  deleteAddress: async () => {},
  setDefaultAddress: async () => {},
  setSelectedAddress: () => {},
  getAddresses: () => [],
  getDefaultAddress: () => undefined,
  refreshAddresses: async () => {},
});

interface AddressProviderProps {
  children: ReactNode;
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem('authToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function mapFromApi(a: any): Address {
  return {
    id: String(a.id),
    type: a.type,
    address: a.address,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    landmark: a.landmark,
    phone: a.phone,
    latitude: a.latitude,
    longitude: a.longitude,
    isDefault: a.isDefault,
  };
}

export function AddressProvider({ children }: AddressProviderProps): React.JSX.Element {
  const { user } = useContext(AuthContext);
  const customerId = user?.id ?? null;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  // Guards against a slow response for customer A landing after customer B logged in.
  const requestRef = useRef(0);

  const loadAddresses = useCallback(async () => {
    const requestId = ++requestRef.current;

    if (customerId === null) {
      // Logged out (or not logged in yet): hold nothing.
      setAddresses([]);
      setSelectedAddress(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/addresses`, { headers });
      if (requestId !== requestRef.current) return; // superseded by a newer load / logout
      if (!res.ok) {
        setAddresses([]);
        setSelectedAddress(null);
        return;
      }
      const json = await res.json();
      if (requestId !== requestRef.current) return;
      const mapped: Address[] = (json.data || []).map(mapFromApi);
      setAddresses(mapped);
      const defaultAddr = mapped.find((a) => a.isDefault);
      setSelectedAddress(defaultAddr || mapped[0] || null);
    } catch (error) {
      if (requestId !== requestRef.current) return;
      console.error('Failed to load addresses:', error);
      setAddresses([]);
      setSelectedAddress(null);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [customerId]);

  // Runs on mount and every time the logged-in customer changes (login, signup, logout).
  useEffect(() => {
    // Drop the previous customer's data immediately, before the new fetch returns.
    setAddresses([]);
    setSelectedAddress(null);
    loadAddresses();
  }, [loadAddresses]);

  const addAddress: AddressContextType['addAddress'] = async (address) => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/addresses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(address),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Failed to add address:', err);
        return null;
      }
      const json = await res.json();
      const newAddress = mapFromApi(json);
      await loadAddresses();
      return newAddress;
    } catch (error) {
      console.error('Failed to add address:', error);
      return null;
    }
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(address),
      });
      if (res.ok) await loadAddresses();
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/addresses/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) await loadAddresses();
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE_URL}/addresses/${id}/default`, {
        method: 'PUT',
        headers,
      });
      if (res.ok) await loadAddresses();
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const getAddresses = () => addresses;
  const getDefaultAddress = () => addresses.find((a) => a.isDefault);
  const refreshAddresses = loadAddresses;

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        loading,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        setSelectedAddress,
        getAddresses,
        getDefaultAddress,
        refreshAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}