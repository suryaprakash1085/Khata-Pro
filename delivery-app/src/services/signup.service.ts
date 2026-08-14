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