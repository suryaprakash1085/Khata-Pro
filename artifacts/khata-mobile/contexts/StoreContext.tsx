// contexts/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface StoreContextType {
  selectedStoreId: number | null;
  setSelectedStoreId: (id: number | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.assignedStoreId || null;
    }
    return null;
  });

  // Update localStorage when store changes
  const handleSetSelectedStoreId = (id: number | null) => {
    setSelectedStoreId(id);
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.assignedStoreId = id;
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  return (
    <StoreContext.Provider value={{ selectedStoreId, setSelectedStoreId: handleSetSelectedStoreId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}