// // import React, { createContext, useState, useEffect, ReactNode } from 'react';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // export interface Address {
// //   id: string;
// //   type: 'Home' | 'Work' | 'Other';
// //   address: string;
// //   city: string;
// //   state: string;
// //   pincode: string;
// //   latitude?: number;
// //   longitude?: number;
// //   isDefault: boolean;
// //   landmark?: string;
// //   phone?: string;
// // }

// // interface AddressContextType {
// //   addresses: Address[];
// //   selectedAddress: Address | null;
// //   addAddress: (address: Address) => void;
// //   updateAddress: (id: string, address: Partial<Address>) => void;
// //   deleteAddress: (id: string) => void;
// //   setDefaultAddress: (id: string) => void;
// //   setSelectedAddress: (address: Address | null) => void;
// //   getAddresses: () => Address[];
// //   getDefaultAddress: () => Address | undefined;
// // }

// // export const AddressContext = createContext<AddressContextType>({
// //   addresses: [],
// //   selectedAddress: null,
// //   addAddress: () => {},
// //   updateAddress: () => {},
// //   deleteAddress: () => {},
// //   setDefaultAddress: () => {},
// //   setSelectedAddress: () => {},
// //   getAddresses: () => [],
// //   getDefaultAddress: () => undefined,
// // });

// // interface AddressProviderProps {
// //   children: ReactNode;
// // }

// // export function AddressProvider({ children }: AddressProviderProps): JSX.Element {
// //   const [addresses, setAddresses] = useState<Address[]>([
// //     {
// //       id: '1',
// //       type: 'Home',
// //       address: 'A-7, Sushil Apartment, Ramdas Colony',
// //       city: 'Nashik',
// //       state: 'Maharashtra',
// //       pincode: '422005',
// //       isDefault: true,
// //     },
// //     {
// //       id: '2',
// //       type: 'Work',
// //       address: 'Flat No. 5, Dharam Residency, Boargad',
// //       city: 'Nashik',
// //       state: 'Maharashtra',
// //       pincode: '422004',
// //       isDefault: false,
// //     },
// //   ]);
// //   const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

// //   useEffect(() => {
// //     loadAddresses();
// //   }, []);

// //   const loadAddresses = async () => {
// //     try {
// //       const saved = await AsyncStorage.getItem('addresses');
// //       if (saved) {
// //         setAddresses(JSON.parse(saved));
// //       }
// //     } catch (error) {
// //       console.error('Failed to load addresses:', error);
// //     }
// //   };

// //   const saveAddresses = async (addr: Address[]) => {
// //     try {
// //       await AsyncStorage.setItem('addresses', JSON.stringify(addr));
// //     } catch (error) {
// //       console.error('Failed to save addresses:', error);
// //     }
// //   };

// //   const addAddress = (address: Address) => {
// //     const newAddresses = [...addresses, address];
// //     setAddresses(newAddresses);
// //     saveAddresses(newAddresses);
// //   };

// //   const updateAddress = (id: string, address: Partial<Address>) => {
// //     const updatedAddresses = addresses.map(addr =>
// //       addr.id === id ? { ...addr, ...address } : addr
// //     );
// //     setAddresses(updatedAddresses);
// //     saveAddresses(updatedAddresses);
// //   };

// //   const deleteAddress = (id: string) => {
// //     const filteredAddresses = addresses.filter(addr => addr.id !== id);
// //     setAddresses(filteredAddresses);
// //     saveAddresses(filteredAddresses);
// //   };

// //   const setDefaultAddress = (id: string) => {
// //     const updatedAddresses = addresses.map(addr => ({
// //       ...addr,
// //       isDefault: addr.id === id,
// //     }));
// //     setAddresses(updatedAddresses);
// //     saveAddresses(updatedAddresses);
// //   };

// //   const getAddresses = () => addresses;
// //   const getDefaultAddress = () => addresses.find(addr => addr.isDefault);

// //   return (
// //     <AddressContext.Provider value={{
// //       addresses,
// //       selectedAddress,
// //       addAddress,
// //       updateAddress,
// //       deleteAddress,
// //       setDefaultAddress,
// //       setSelectedAddress,
// //       getAddresses,
// //       getDefaultAddress,
// //     }}>
// //       {children}
// //     </AddressContext.Provider>
// //   );
// // }
// import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export interface Address {
//   id: string;
//   type: 'Home' | 'Work' | 'Other';
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   latitude?: number;
//   longitude?: number;
//   isDefault: boolean;
//   landmark?: string;
//   phone?: string;
// }

// interface AddressContextType {
//   addresses: Address[];
//   selectedAddress: Address | null;
//   addAddress: (address: Address) => void;
//   updateAddress: (id: string, address: Partial<Address>) => void;
//   deleteAddress: (id: string) => void;
//   setDefaultAddress: (id: string) => void;
//   setSelectedAddress: (address: Address | null) => void;
//   getAddresses: () => Address[];
//   getDefaultAddress: () => Address | undefined;
// }

// export const AddressContext = createContext<AddressContextType>({
//   addresses: [],
//   selectedAddress: null,
//   addAddress: () => {},
//   updateAddress: () => {},
//   deleteAddress: () => {},
//   setDefaultAddress: () => {},
//   setSelectedAddress: () => {},
//   getAddresses: () => [],
//   getDefaultAddress: () => undefined,
// });

// interface AddressProviderProps {
//   children: ReactNode;
// }

// export function AddressProvider({ children }: AddressProviderProps): JSX.Element {
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

//   useEffect(() => {
//     loadAddresses();
//   }, []);

//   const loadAddresses = async () => {
//     try {
//       const saved = await AsyncStorage.getItem('addresses');
//       if (saved) {
//         setAddresses(JSON.parse(saved));
//       } else {
//         // Default addresses
//         const defaultAddresses: Address[] = [
//           {
//             id: '1',
//             type: 'Home',
//             address: 'A-7, Sushil Apartment, Ramdas Colony',
//             city: 'Nashik',
//             state: 'Maharashtra',
//             pincode: '422005',
//             isDefault: true,
//           },
//           {
//             id: '2',
//             type: 'Work',
//             address: 'Flat No. 5, Dharam Residency, Boargad',
//             city: 'Nashik',
//             state: 'Maharashtra',
//             pincode: '422004',
//             isDefault: false,
//           },
//         ];
//         setAddresses(defaultAddresses);
//         await AsyncStorage.setItem('addresses', JSON.stringify(defaultAddresses));
//       }
//     } catch (error) {
//       console.error('Failed to load addresses:', error);
//     }
//   };

//   const saveAddresses = async (addr: Address[]) => {
//     try {
//       await AsyncStorage.setItem('addresses', JSON.stringify(addr));
//     } catch (error) {
//       console.error('Failed to save addresses:', error);
//     }
//   };

//   const addAddress = (address: Address) => {
//     const newAddresses = [...addresses, address];
//     setAddresses(newAddresses);
//     saveAddresses(newAddresses);
//   };

//   const updateAddress = (id: string, address: Partial<Address>) => {
//     const updatedAddresses = addresses.map(addr =>
//       addr.id === id ? { ...addr, ...address } : addr
//     );
//     setAddresses(updatedAddresses);
//     saveAddresses(updatedAddresses);
//   };

//   const deleteAddress = (id: string) => {
//     const filteredAddresses = addresses.filter(addr => addr.id !== id);
//     setAddresses(filteredAddresses);
//     saveAddresses(filteredAddresses);
//   };

//   const setDefaultAddress = (id: string) => {
//     const updatedAddresses = addresses.map(addr => ({
//       ...addr,
//       isDefault: addr.id === id,
//     }));
//     setAddresses(updatedAddresses);
//     saveAddresses(updatedAddresses);
//   };

//   const getAddresses = () => addresses;
//   const getDefaultAddress = () => addresses.find(addr => addr.isDefault);

//   return (
//     <AddressContext.Provider value={{
//       addresses,
//       selectedAddress,
//       addAddress,
//       updateAddress,
//       deleteAddress,
//       setDefaultAddress,
//       setSelectedAddress,
//       getAddresses,
//       getDefaultAddress,
//     }}>
//       {children}
//     </AddressContext.Provider>
//   );
// }
// context/AddressContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setSelectedAddress: (address: Address | null) => void;
  getAddresses: () => Address[];
  getDefaultAddress: () => Address | undefined;
  refreshAddresses: () => Promise<void>;
}

export const AddressContext = createContext<AddressContextType>({
  addresses: [],
  selectedAddress: null,
  addAddress: () => {},
  updateAddress: () => {},
  deleteAddress: () => {},
  setDefaultAddress: () => {},
  setSelectedAddress: () => {},
  getAddresses: () => [],
  getDefaultAddress: () => undefined,
  refreshAddresses: async () => {},
});

interface AddressProviderProps {
  children: ReactNode;
}

export function AddressProvider({ children }: AddressProviderProps): JSX.Element {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  // ✅ NO HARDCODED ADDRESSES - Starts empty
  const loadAddresses = async () => {
    try {
      const saved = await AsyncStorage.getItem('addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAddresses(parsed);
        // Set first address as selected if available
        if (parsed.length > 0) {
          const defaultAddr = parsed.find((a: Address) => a.isDefault);
          setSelectedAddress(defaultAddr || parsed[0]);
        } else {
          setSelectedAddress(null);
        }
      } else {
        // ✅ START WITH EMPTY ARRAY - NO HARDCODED ADDRESSES
        setAddresses([]);
        setSelectedAddress(null);
        // Save empty array to storage
        await AsyncStorage.setItem('addresses', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setAddresses([]);
      setSelectedAddress(null);
    }
  };

  const saveAddresses = async (addr: Address[]) => {
    try {
      await AsyncStorage.setItem('addresses', JSON.stringify(addr));
    } catch (error) {
      console.error('Failed to save addresses:', error);
    }
  };

  const addAddress = (address: Address) => {
    const newAddresses = [...addresses, address];
    setAddresses(newAddresses);
    saveAddresses(newAddresses);
    // Auto-select the new address if it's the only one or default
    if (address.isDefault || newAddresses.length === 1) {
      setSelectedAddress(address);
    }
  };

  const updateAddress = (id: string, address: Partial<Address>) => {
    const updatedAddresses = addresses.map(addr =>
      addr.id === id ? { ...addr, ...address } : addr
    );
    setAddresses(updatedAddresses);
    saveAddresses(updatedAddresses);
    
    if (selectedAddress?.id === id) {
      const updated = updatedAddresses.find(addr => addr.id === id);
      if (updated) setSelectedAddress(updated);
    }
  };

  const deleteAddress = (id: string) => {
    const filteredAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(filteredAddresses);
    saveAddresses(filteredAddresses);
    
    if (selectedAddress?.id === id) {
      const defaultAddr = filteredAddresses.find(a => a.isDefault);
      setSelectedAddress(defaultAddr || filteredAddresses[0] || null);
    }
  };

  const setDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updatedAddresses);
    saveAddresses(updatedAddresses);
    
    const defaultAddr = updatedAddresses.find(addr => addr.id === id);
    if (defaultAddr) setSelectedAddress(defaultAddr);
  };

  const getAddresses = () => addresses;
  const getDefaultAddress = () => addresses.find(addr => addr.isDefault);

  const refreshAddresses = async () => {
    await loadAddresses();
  };

  return (
    <AddressContext.Provider value={{
      addresses,
      selectedAddress,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      setSelectedAddress,
      getAddresses,
      getDefaultAddress,
      refreshAddresses,
    }}>
      {children}
    </AddressContext.Provider>
  );
}