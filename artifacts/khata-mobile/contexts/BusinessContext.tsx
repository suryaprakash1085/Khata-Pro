import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { Business } from '@workspace/api-client-react';
import { useListBusinesses, getListBusinessesQueryKey } from '@workspace/api-client-react';
import { useAuth } from './AuthContext';

type BusinessContextValue = {
  business: Business | null;
  isLoading: boolean;
  hasBusiness: boolean;
  refetch: () => void;
  setBusiness: (b: Business) => void;
};

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [manualBusiness, setManualBusiness] = useState<Business | null>(null);

  const params = { owner_id: user?.id, limit: 1 };
  const { data, isLoading, refetch } = useListBusinesses(params, {
    query: { enabled: !!user?.id, queryKey: getListBusinessesQueryKey(params) },
  });

  const fetched = data?.data?.[0] ?? null;
  const business = manualBusiness ?? fetched;

  const setBusiness = useCallback((b: Business) => setManualBusiness(b), []);

  const value = useMemo(
    () => ({
      business,
      isLoading: !!user?.id && isLoading,
      hasBusiness: !!business,
      refetch,
      setBusiness,
    }),
    [business, isLoading, user?.id, refetch, setBusiness],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness(): BusinessContextValue {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used within BusinessProvider');
  return ctx;
}
