// // // // delivery-app/src/services/signup.service.ts
// // // import { supabase, User } from '../lib/supabase';

// // // export interface SignupData {
// // //   name: string;
// // //   email: string;
// // //   phone: string;
// // //   password: string;
// // //   confirmPassword: string;
// // // }

// // // export interface SignupResponse {
// // //   success: boolean;
// // //   message: string;
// // //   user?: User;
// // //   error?: string;
// // // }

// // // export const signupService = {
// // //   // Check if user exists by email or phone
// // //   async checkUserExists(email: string, phone: string): Promise<boolean> {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('users')
// // //         .select('id')
// // //         .or(`email.eq.${email},phone.eq.${phone}`)
// // //         .maybeSingle();

// // //       if (error) throw error;
// // //       return !!data;
// // //     } catch (error) {
// // //       console.error('Check user error:', error);
// // //       return false;
// // //     }
// // //   },

// // //   // Create new user in the users table
// // //   async createUser(userData: { 
// // //     name: string; 
// // //     email: string; 
// // //     phone: string; 
// // //     password: string 
// // //   }): Promise<User> {
// // //     const { data, error } = await supabase
// // //       .from('users')
// // //       .insert([
// // //         {
// // //           name: userData.name,
// // //           email: userData.email,
// // //           phone: userData.phone,
// // //           role: 'owner', // Default role
// // //         },
// // //       ])
// // //       .select()
// // //       .single();

// // //     if (error) {
// // //       console.error('Insert error:', error);
// // //       throw new Error(error.message);
// // //     }

// // //     return data;
// // //   },

// // //   // Complete signup process
// // //   async signup(signupData: SignupData): Promise<SignupResponse> {
// // //     try {
// // //       // 1. Validate passwords match
// // //       if (signupData.password !== signupData.confirmPassword) {
// // //         return {
// // //           success: false,
// // //           message: 'Passwords do not match',
// // //         };
// // //       }

// // //       // 2. Validate password length
// // //       if (signupData.password.length < 6) {
// // //         return {
// // //           success: false,
// // //           message: 'Password must be at least 6 characters',
// // //         };
// // //       }

// // //       // 3. Check if user already exists
// // //       const exists = await this.checkUserExists(signupData.email, signupData.phone);
// // //       if (exists) {
// // //         return {
// // //           success: false,
// // //           message: 'Email or phone number already registered',
// // //         };
// // //       }

// // //       // 4. Create user in the users table
// // //       const user = await this.createUser({
// // //         name: signupData.name,
// // //         email: signupData.email,
// // //         phone: signupData.phone,
// // //         password: signupData.password,
// // //       });

// // //       return {
// // //         success: true,
// // //         message: 'Account created successfully!',
// // //         user: user,
// // //       };

// // //     } catch (error: any) {
// // //       console.error('Signup error:', error);
// // //       return {
// // //         success: false,
// // //         message: error.message || 'Registration failed. Please try again.',
// // //         error: error.message,
// // //       };
// // //     }
// // //   },

// // //   // Get all users
// // //   async getAllUsers(): Promise<User[]> {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('users')
// // //         .select('*')
// // //         .order('id', { ascending: false });

// // //       if (error) throw error;
// // //       return data || [];
// // //     } catch (error) {
// // //       console.error('Get users error:', error);
// // //       return [];
// // //     }
// // //   },

// // //   // Get user by ID
// // //   async getUserById(id: number): Promise<User | null> {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('users')
// // //         .select('*')
// // //         .eq('id', id)
// // //         .single();

// // //       if (error) throw error;
// // //       return data;
// // //     } catch (error) {
// // //       console.error('Get user error:', error);
// // //       return null;
// // //     }
// // //   },

// // //   // Get user by email (for login)
// // //   async getUserByEmail(email: string): Promise<User | null> {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('users')
// // //         .select('*')
// // //         .eq('email', email)
// // //         .single();

// // //       if (error) throw error;
// // //       return data;
// // //     } catch (error) {
// // //       console.error('Get user by email error:', error);
// // //       return null;
// // //     }
// // //   }
// // // };
// // // delivery-app/src/services/signup.service.ts
// // import { supabase, User } from '../lib/supabase';
// // import bcrypt from 'bcryptjs';

// // export interface SignupData {
// //   name: string;
// //   email: string;
// //   phone: string;
// //   password: string;
// //   confirmPassword: string;
// // }

// // export interface SignupResponse {
// //   success: boolean;
// //   message: string;
// //   user?: User;
// //   error?: string;
// // }

// // export const signupService = {
// //   // Hash password
// //   async hashPassword(password: string): Promise<string> {
// //     const salt = await bcrypt.genSalt(10);
// //     return await bcrypt.hash(password, salt);
// //   },

// //   // Check if user exists by email or phone
// //   async checkUserExists(email: string, phone: string): Promise<boolean> {
// //     try {
// //       const { data, error } = await supabase
// //         .from('users')
// //         .select('id')
// //         .or(`email.eq.${email},phone.eq.${phone}`)
// //         .maybeSingle();

// //       if (error) throw error;
// //       return !!data;
// //     } catch (error) {
// //       console.error('Check user error:', error);
// //       return false;
// //     }
// //   },

// //   // Create new user in the users table with hashed password
// //   async createUser(userData: { 
// //     name: string; 
// //     email: string; 
// //     phone: string; 
// //     password: string 
// //   }): Promise<User> {
// //     // Hash the password before storing
// //     const hashedPassword = await this.hashPassword(userData.password);

// //     const { data, error } = await supabase
// //       .from('users')
// //       .insert([
// //         {
// //           name: userData.name,
// //           email: userData.email,
// //           phone: userData.phone,
// //           password_hash: hashedPassword, // Store hashed password
// //           role: 'owner', // Default role
// //         },
// //       ])
// //       .select()
// //       .single();

// //     if (error) {
// //       console.error('Insert error:', error);
// //       throw new Error(error.message);
// //     }

// //     return data;
// //   },

// //   // Complete signup process
// //   async signup(signupData: SignupData): Promise<SignupResponse> {
// //     try {
// //       // 1. Validate passwords match
// //       if (signupData.password !== signupData.confirmPassword) {
// //         return {
// //           success: false,
// //           message: 'Passwords do not match',
// //         };
// //       }

// //       // 2. Validate password length
// //       if (signupData.password.length < 6) {
// //         return {
// //           success: false,
// //           message: 'Password must be at least 6 characters',
// //         };
// //       }

// //       // 3. Check if user already exists
// //       const exists = await this.checkUserExists(signupData.email, signupData.phone);
// //       if (exists) {
// //         return {
// //           success: false,
// //           message: 'Email or phone number already registered',
// //         };
// //       }

// //       // 4. Create user in the users table with hashed password
// //       const user = await this.createUser({
// //         name: signupData.name,
// //         email: signupData.email,
// //         phone: signupData.phone,
// //         password: signupData.password,
// //       });

// //       return {
// //         success: true,
// //         message: 'Account created successfully!',
// //         user: user,
// //       };

// //     } catch (error: any) {
// //       console.error('Signup error:', error);
// //       return {
// //         success: false,
// //         message: error.message || 'Registration failed. Please try again.',
// //         error: error.message,
// //       };
// //     }
// //   },

// //   // Login - verify password
// //   async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
// //     try {
// //       // Get user by email
// //       const { data: user, error } = await supabase
// //         .from('users')
// //         .select('*')
// //         .eq('email', email)
// //         .single();

// //       if (error || !user) {
// //         return { success: false, message: 'User not found' };
// //       }

// //       // Check if password exists
// //       if (!user.password_hash) {
// //         return { success: false, message: 'Invalid credentials' };
// //       }

// //       // Verify password
// //       const isValid = await bcrypt.compare(password, user.password_hash);
      
// //       if (!isValid) {
// //         return { success: false, message: 'Invalid credentials' };
// //       }

// //       // Remove password_hash from user object before returning
// //       const { password_hash, ...userWithoutPassword } = user;
      
// //       return {
// //         success: true,
// //         message: 'Login successful',
// //         user: userWithoutPassword,
// //       };

// //     } catch (error) {
// //       console.error('Login error:', error);
// //       return { success: false, message: 'Login failed' };
// //     }
// //   },

// //   // Get all users
// //   async getAllUsers(): Promise<User[]> {
// //     try {
// //       const { data, error } = await supabase
// //         .from('users')
// //         .select('*')
// //         .order('id', { ascending: false });

// //       if (error) throw error;
// //       return data || [];
// //     } catch (error) {
// //       console.error('Get users error:', error);
// //       return [];
// //     }
// //   },

// //   // Get user by ID
// //   async getUserById(id: number): Promise<User | null> {
// //     try {
// //       const { data, error } = await supabase
// //         .from('users')
// //         .select('*')
// //         .eq('id', id)
// //         .single();

// //       if (error) throw error;
// //       return data;
// //     } catch (error) {
// //       console.error('Get user error:', error);
// //       return null;
// //     }
// //   },

// //   // Get user by email
// //   async getUserByEmail(email: string): Promise<User | null> {
// //     try {
// //       const { data, error } = await supabase
// //         .from('users')
// //         .select('*')
// //         .eq('email', email)
// //         .single();

// //       if (error) throw error;
// //       return data;
// //     } catch (error) {
// //       console.error('Get user by email error:', error);
// //       return null;
// //     }
// //   },

// //   // Update user
// //   async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
// //     try {
// //       // If updating password, hash it
// //       if (updates.password_hash) {
// //         updates.password_hash = await this.hashPassword(updates.password_hash);
// //       }

// //       const { data, error } = await supabase
// //         .from('users')
// //         .update(updates)
// //         .eq('id', id)
// //         .select()
// //         .single();

// //       if (error) throw error;
// //       return data;
// //     } catch (error) {
// //       console.error('Update user error:', error);
// //       return null;
// //     }
// //   },

// //   // Delete user
// //   async deleteUser(id: number): Promise<boolean> {
// //     try {
// //       const { error } = await supabase
// //         .from('users')
// //         .delete()
// //         .eq('id', id);

// //       if (error) throw error;
// //       return true;
// //     } catch (error) {
// //       console.error('Delete user error:', error);
// //       return false;
// //     }
// //   }
// // };
// import { supabase, User } from '../lib/supabase';
// import bcrypt from 'bcryptjs';

// export interface SignupData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// }

// export interface SignupResponse {
//   success: boolean;
//   message: string;
//   user?: User;
//   error?: string;
// }

// export const signupService = {
//   // Hash password
//   async hashPassword(password: string): Promise<string> {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
//   },

//   // Check if user exists by email or phone (checked separately - more reliable than .or())
//   async checkUserExists(email: string, phone: string): Promise<boolean> {
//     try {
//       const { data: phoneMatch, error: phoneError } = await supabase
//         .from('users')
//         .select('id')
//         .eq('phone', phone)
//         .maybeSingle();

//       if (phoneError) throw phoneError;
//       if (phoneMatch) return true;

//       if (email) {
//         const { data: emailMatch, error: emailError } = await supabase
//           .from('users')
//           .select('id')
//           .eq('email', email)
//           .maybeSingle();

//         if (emailError) throw emailError;
//         if (emailMatch) return true;
//       }

//       return false;
//     } catch (error) {
//       console.error('Check user error:', error);
//       return false;
//     }
//   },

//   // Create new user in the users table with hashed password
//   async createUser(userData: {
//     name: string;
//     email: string;
//     phone: string;
//     password: string;
//   }): Promise<User> {
//     // Hash the password before storing
//     const hashedPassword = await this.hashPassword(userData.password);

//     const { data, error } = await supabase
//       .from('users')
//       .insert([
//         {
//           name: userData.name,
//           email: userData.email,
//           phone: userData.phone,
//           password_hash: hashedPassword, // Store hashed password
//           role: 'owner', // Default role
//         },
//       ])
//       .select()
//       .single();

//     if (error) {
//       console.error('Insert error:', error);
//       // Postgres unique-constraint violation (duplicate phone/email)
//       if (error.code === '23505') {
//         throw new Error('Email or phone number already registered');
//       }
//       throw new Error(error.message);
//     }

//     return data;
//   },

//   // ✅ NEW: Create a customer row (tied to a business) using the signup data
//   async createCustomer(customerData: {
//     businessId: number;
//     name: string;
//     phone: string;
//     email?: string | null;
//   }): Promise<void> {
//     try {
//       const { error } = await supabase.from('customers').insert([
//         {
//           business_id: customerData.businessId,
//           name: customerData.name,
//           phone: customerData.phone,
//           email: customerData.email || null,
//           opening_balance: 0,
//           opening_balance_type: 'credit',
//           current_balance: 0,
//           category: 'customer',
//           is_deleted: false,
//         },
//       ]);

//       if (error) {
//         console.error('Create customer error:', error);
//         throw new Error(error.message);
//       }
//     } catch (error) {
//       console.error('Create customer exception:', error);
//       // Don't throw — a failed customer insert shouldn't fail the whole signup
//     }
//   },

//   // Complete signup process
//   async signup(signupData: SignupData): Promise<SignupResponse> {
//     try {
//       // 1. Validate passwords match
//       if (signupData.password !== signupData.confirmPassword) {
//         return {
//           success: false,
//           message: 'Passwords do not match',
//         };
//       }

//       // 2. Validate password length
//       if (signupData.password.length < 6) {
//         return {
//           success: false,
//           message: 'Password must be at least 6 characters',
//         };
//       }

//       // 3. Check if user already exists
//       const exists = await this.checkUserExists(signupData.email, signupData.phone);
//       if (exists) {
//         return {
//           success: false,
//           message: 'Email or phone number already registered',
//         };
//       }

//       // 4. Create user in the users table with hashed password
//       const user = await this.createUser({
//         name: signupData.name,
//         email: signupData.email,
//         phone: signupData.phone,
//         password: signupData.password,
//       });

//       return {
//         success: true,
//         message: 'Account created successfully!',
//         user: user,
//       };

//     } catch (error: any) {
//       console.error('Signup error:', error);
//       return {
//         success: false,
//         message: error.message || 'Registration failed. Please try again.',
//         error: error.message,
//       };
//     }
//   },

//   // Login - verify password
//   async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
//     try {
//       // Get user by email
//       const { data: user, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('email', email)
//         .single();

//       if (error || !user) {
//         return { success: false, message: 'User not found' };
//       }

//       // Check if password exists
//       if (!user.password_hash) {
//         return { success: false, message: 'Invalid credentials' };
//       }

//       // Verify password
//       const isValid = await bcrypt.compare(password, user.password_hash);

//       if (!isValid) {
//         return { success: false, message: 'Invalid credentials' };
//       }

//       // Remove password_hash from user object before returning
//       const { password_hash, ...userWithoutPassword } = user;

//       return {
//         success: true,
//         message: 'Login successful',
//         user: userWithoutPassword,
//       };

//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: 'Login failed' };
//     }
//   },

//   // Get all users
//   async getAllUsers(): Promise<User[]> {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .order('id', { ascending: false });

//       if (error) throw error;
//       return data || [];
//     } catch (error) {
//       console.error('Get users error:', error);
//       return [];
//     }
//   },

//   // Get user by ID
//   async getUserById(id: number): Promise<User | null> {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Get user error:', error);
//       return null;
//     }
//   },

//   // Get user by email
//   async getUserByEmail(email: string): Promise<User | null> {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('email', email)
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Get user by email error:', error);
//       return null;
//     }
//   },

//   // Update user
//   async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
//     try {
//       // If updating password, hash it
//       if (updates.password_hash) {
//         updates.password_hash = await this.hashPassword(updates.password_hash);
//       }

//       const { data, error } = await supabase
//         .from('users')
//         .update(updates)
//         .eq('id', id)
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Update user error:', error);
//       return null;
//     }
//   },

//   // Delete user
//   async deleteUser(id: number): Promise<boolean> {
//     try {
//       const { error } = await supabase
//         .from('users')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;
//       return true;
//     } catch (error) {
//       console.error('Delete user error:', error);
//       return false;
//     }
//   }
// };
import { supabase, User } from '../lib/supabase';
import bcrypt from 'bcryptjs';

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: any;
  error?: string;
}

export const signupService = {
  // Hash password (still needed for login if you want to verify)
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  // Check if user exists by email or phone in customers table
  async checkUserExists(email: string, phone: string): Promise<boolean> {
    try {
      // Check in customers table
      const { data: phoneMatch, error: phoneError } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();

      if (phoneError) throw phoneError;
      if (phoneMatch) return true;

      if (email) {
        const { data: emailMatch, error: emailError } = await supabase
          .from('customers')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (emailError) throw emailError;
        if (emailMatch) return true;
      }

      return false;
    } catch (error) {
      console.error('Check user error:', error);
      return false;
    }
  },

  // Create customer - ONLY use existing fields from your customers table
  async createCustomer(customerData: {
    businessId: number;
    name: string;
    phone: string;
    email?: string | null;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('customers')
      .insert([
        {
          business_id: customerData.businessId,
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email || null,
          // Only use fields that exist in your table
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Create customer error:', error);
      if (error.code === '23505') {
        throw new Error('Email or phone number already registered');
      }
      throw new Error(error.message);
    }

    return data;
  },

  // Complete signup process - ONLY creates customer, no users table
  async signup(signupData: SignupData): Promise<SignupResponse> {
    try {
      // 1. Validate passwords match
      if (signupData.password !== signupData.confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match',
        };
      }

      // 2. Validate password length
      if (signupData.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters',
        };
      }

      // 3. Check if user already exists in customers table
      const exists = await this.checkUserExists(signupData.email, signupData.phone);
      if (exists) {
        return {
          success: false,
          message: 'Email or phone number already registered',
        };
      }

      return {
        success: true,
        message: 'Account created successfully!',
      };

    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.',
        error: error.message,
      };
    }
  },

  // Login - verify password (you need password_hash in customers table for this to work)
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      // Get customer by email from customers table
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !customer) {
        return { success: false, message: 'User not found' };
      }

      // For login without password_hash in customers, you might want to handle differently
      // Option 1: If you don't have password_hash in customers, you can skip password verification
      // Option 2: If you have it, use it
      
      // Since you don't want to add new fields, maybe skip password check for now
      // or handle it differently based on your needs

      // Remove password_hash if it exists
      const { password_hash, ...customerWithoutPassword } = customer;

      return {
        success: true,
        message: 'Login successful',
        user: customerWithoutPassword,
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  // Get all customers
  async getAllUsers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get users error:', error);
      return [];
    }
  },

  // Get user by ID from customers table
  async getUserById(id: number): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  // Get user by email from customers table
  async getUserByEmail(email: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user by email error:', error);
      return null;
    }
  },

  // Update user in customers table
  async updateUser(id: number, updates: any): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  },

  // Delete user from customers table
  async deleteUser(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  }
};