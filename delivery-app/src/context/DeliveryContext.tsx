import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
} from 'react';
import { deliveriesApi, Delivery } from '../api/deliveries';
import { AuthContext } from './AuthContext';

interface DeliveryContextType {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
  refreshDeliveries: () => Promise<void>;
  updateDeliveryStatus: (id: number, status: Delivery['status']) => Promise<void>;
}

export const DeliveryContext = createContext<DeliveryContextType>({
  deliveries: [],
  loading: false,
  error: null,
  refreshDeliveries: async () => {},
  updateDeliveryStatus: async () => {},
});

interface DeliveryProviderProps {
  children: ReactNode;
}

/** client.ts's interceptor rejects with either {error} (backend message) or {message} (network/other) */
function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const e = err as { error?: string; message?: string };
    return e.error ?? e.message ?? fallback;
  }
  return fallback;
}

export function DeliveryProvider({ children }: DeliveryProviderProps): JSX.Element {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * !! ASSUMPTION: `user` (from AuthContext / your `User` type) has
   * `id` and `businessId` fields matching what /auth/login returns.
   * Adjust the two lines below if your actual User type uses different
   * field names — share types.ts and I'll fix this exactly.
   */
  const driverId = (user as any)?.id;
  const businessId = (user as any)?.businessId;

  const refreshDeliveries = useCallback(async () => {
    if (!isAuthenticated || !driverId || !businessId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await deliveriesApi.getDeliveries({
        business_id: businessId,
        driver_id: driverId, // "my deliveries" only — drop this param to see all
      });
      setDeliveries(result.data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Failed to load deliveries'));
      console.error('[DeliveryContext] refreshDeliveries failed:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, driverId, businessId]);

  useEffect(() => {
    refreshDeliveries();
  }, [refreshDeliveries]);

  const updateDeliveryStatus = async (id: number, status: Delivery['status']) => {
    const previous = deliveries;
    setDeliveries(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
    try {
      const updated = await deliveriesApi.updateDeliveryStatus(id, status);
      setDeliveries(prev => prev.map(d => (d.id === id ? updated : d)));
    } catch (err) {
      setDeliveries(previous); // roll back optimistic update
      setError(extractErrorMessage(err, 'Failed to update delivery status'));
      console.error('[DeliveryContext] updateDeliveryStatus failed:', err);
    }
  };

  return (
    <DeliveryContext.Provider
      value={{ deliveries, loading, error, refreshDeliveries, updateDeliveryStatus }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

