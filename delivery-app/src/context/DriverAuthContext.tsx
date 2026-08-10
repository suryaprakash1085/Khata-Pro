import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { driverAuthService } from '../services/driverAuthService';
import {
  getDriverToken,
  getDriver,
  storeDriverToken,
  storeDriver,
  removeDriverToken,
  removeDriver,
} from '../utils/storage';
import { Driver } from '../types';

interface DriverAuthContextType {
  isDriverAuthenticated: boolean;
  driver: Driver | null;
  loading: boolean;
  requestOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string) => Promise<boolean>;
  driverLogout: () => Promise<void>;
}

export const DriverAuthContext = createContext<DriverAuthContextType>({
  isDriverAuthenticated: false,
  driver: null,
  loading: true,
  requestOtp: async () => false,
  verifyOtp: async () => false,
  driverLogout: async () => {},
});

interface DriverAuthProviderProps {
  children: ReactNode;
}

// export function DriverAuthProvider({ children }: DriverAuthProviderProps): JSX.Element {
//   const [isDriverAuthenticated, setIsDriverAuthenticated] = useState(false);
//   const [driver, setDriver] = useState<Driver | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkDriverAuthStatus();
//   }, []);

//   const checkDriverAuthStatus = async (): Promise<void> => {
//     try {
//       const token = await getDriverToken();
//       const storedDriver = await getDriver();
//       if (token && storedDriver) {
//         setIsDriverAuthenticated(true);
//         setDriver(storedDriver);
//       } else {
//         setIsDriverAuthenticated(false);
//         setDriver(null);
//       }
//     } catch (error) {
//       console.error('Driver auth check failed:', error);
//       setIsDriverAuthenticated(false);
//       setDriver(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const requestOtp = async (phone: string): Promise<boolean> => {
//     try {
//       await driverAuthService.requestOtp(phone);
//       return true;
//     } catch (error) {
//       console.error('Request OTP failed:', error);
//       return false;
//     }
//   };

// const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
//   try {
//     const result = await driverAuthService.verifyOtp(phone, otp);
//     if (result?.token && result?.driver) {
//       await setDriverToken(result.token);
//       await setDriver(result.driver);
//       setIsDriverAuthenticated(true);
//       setDriver(result.driver);
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error('Verify OTP failed:', error);
//     return false;
//   }
// };

//   const driverLogout = async (): Promise<void> => {
//     await removeDriverToken();
//     await removeDriver();
//     setIsDriverAuthenticated(false);
//     setDriver(null);
//   };

//   return (
//     <DriverAuthContext.Provider
//       value={{ isDriverAuthenticated, driver, loading, requestOtp, verifyOtp, driverLogout }}
//     >
//       {children}
//     </DriverAuthContext.Provider>
//   );
// }

export function DriverAuthProvider({ children }: DriverAuthProviderProps): React.JSX.Element {
  const [isDriverAuthenticated, setIsDriverAuthenticated] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDriverAuthStatus();
  }, []);

  const checkDriverAuthStatus = async (): Promise<void> => {
    try {
      const token = await getDriverToken();
      const storedDriver = await getDriver();
      if (token && storedDriver) {
        setIsDriverAuthenticated(true);
        setDriver(storedDriver);
      } else {
        setIsDriverAuthenticated(false);
        setDriver(null);
      }
    } catch (error) {
      console.error('Driver auth check failed:', error);
      setIsDriverAuthenticated(false);
      setDriver(null);
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (phone: string): Promise<boolean> => {
    try {
      await driverAuthService.requestOtp(phone);
      return true;
    } catch (error) {
      console.error('Request OTP failed:', error);
      return false;
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const result = await driverAuthService.verifyOtp(phone, otp);
      if (result?.token && result?.driver) {
        // 👇 this was missing — nothing was ever persisted before
        await storeDriverToken(result.token);
        await storeDriver(result.driver);

        setIsDriverAuthenticated(true);
        setDriver(result.driver);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verify OTP failed:', error);
      return false;
    }
  };

  const driverLogout = async (): Promise<void> => {
    await removeDriverToken();
    await removeDriver();
    setIsDriverAuthenticated(false);
    setDriver(null);
  };

  return (
    <DriverAuthContext.Provider
      value={{ isDriverAuthenticated, driver, loading, requestOtp, verifyOtp, driverLogout }}
    >
      {children}
    </DriverAuthContext.Provider>
  );
}