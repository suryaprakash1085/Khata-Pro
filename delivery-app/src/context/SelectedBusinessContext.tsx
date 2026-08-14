import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface SelectedBusiness {
  id: number;
  name: string;
}

interface SelectedBusinessContextType {
  selectedBusiness: SelectedBusiness | null;
  setSelectedBusiness: (business: SelectedBusiness | null) => void;
}

export const SelectedBusinessContext = createContext<SelectedBusinessContextType>({
  selectedBusiness: null,
  setSelectedBusiness: () => {},
});

const STORAGE_KEY = 'selectedBusiness';

interface SelectedBusinessProviderProps {
  children: ReactNode;
}

export const SelectedBusinessProvider: React.FC<SelectedBusinessProviderProps> = ({ children }) => {
  const [selectedBusiness, setSelectedBusinessState] = useState<SelectedBusiness | null>(null);

  // Load whatever the customer picked last time, so it survives app reloads too
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelectedBusinessState(JSON.parse(raw));
    } catch (error) {
      console.error('Failed to load selected business:', error);
    }
  }, []);

  const setSelectedBusiness = (business: SelectedBusiness | null) => {
    setSelectedBusinessState(business);
    try {
      if (business) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(business));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save selected business:', error);
    }
  };

  return (
    <SelectedBusinessContext.Provider value={{ selectedBusiness, setSelectedBusiness }}>
      {children}
    </SelectedBusinessContext.Provider>
  );
};