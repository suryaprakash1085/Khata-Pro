// // delivery-app/src/services/business.service.ts
// import { supabase } from '../lib/supabase';

// export interface Business {
//   id: number;
//   owner_id: number;
//   business_name: string;
//   business_type: string;
//   gstin: string | null;
//   address: string | null;
//   plan: string;
//   is_active: boolean;
//   created_at: string;
// }

// export const businessService = {
//   // ✅ Get business by owner ID (like getting products by business_id)
//   async getBusinessByOwnerId(ownerId: number): Promise<Business | null> {
//     try {
//       console.log('🔍 Fetching business for owner:', ownerId);
      
//       const { data, error } = await supabase
//         .from('businesses')
//         .select('*')
//         .eq('owner_id', ownerId)
//         .maybeSingle();

//       if (error) {
//         console.error('❌ Fetch business error:', error);
//         return null;
//       }
      
//       console.log('✅ Business found:', data);
//       return data;
//     } catch (error) {
//       console.error('❌ Fetch business exception:', error);
//       return null;
//     }
//   },

//   // ✅ Get business by ID
//   async getBusinessById(id: number): Promise<Business | null> {
//     try {
//       const { data, error } = await supabase
//         .from('businesses')
//         .select('*')
//         .eq('id', id)
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Get business error:', error);
//       return null;
//     }
//   },

//   // ✅ Get all businesses (for admin)
//   async getAllBusinesses(): Promise<Business[]> {
//     try {
//       const { data, error } = await supabase
//         .from('businesses')
//         .select('*')
//         .order('id', { ascending: false });

//       if (error) throw error;
//       return data || [];
//     } catch (error) {
//       console.error('Get businesses error:', error);
//       return [];
//     }
//   },

//   // ✅ Create business (like creating a product)
//   async createBusiness(businessData: {
//     owner_id: number;
//     business_name: string;
//     business_type: string;
//     gstin?: string;
//     address?: string;
//   }): Promise<Business | null> {
//     try {
//       const { data, error } = await supabase
//         .from('businesses')
//         .insert([
//           {
//             owner_id: businessData.owner_id,
//             business_name: businessData.business_name,
//             business_type: businessData.business_type,
//             gstin: businessData.gstin || null,
//             address: businessData.address || null,
//             plan: 'free',
//             is_active: true,
//           },
//         ])
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Create business error:', error);
//       return null;
//     }
//   },

//   // ✅ Update business (like updating a product)
//   async updateBusiness(id: number, updates: Partial<Business>): Promise<Business | null> {
//     try {
//       const { data, error } = await supabase
//         .from('businesses')
//         .update(updates)
//         .eq('id', id)
//         .select()
//         .single();

//       if (error) throw error;
//       return data;
//     } catch (error) {
//       console.error('Update business error:', error);
//       return null;
//     }
//   },

//   // ✅ Delete business (like deleting a product)
//   async deleteBusiness(id: number): Promise<boolean> {
//     try {
//       const { error } = await supabase
//         .from('businesses')
//         .delete()
//         .eq('id', id);

//       if (error) throw error;
//       return true;
//     } catch (error) {
//       console.error('Delete business error:', error);
//       return false;
//     }
//   }
// };
// delivery-app/src/services/business.service.ts
import { supabase } from '../lib/supabase';

export interface Business {
  id: number;
  owner_id: number;
  business_name: string;
  business_type: string;
  plan: string;
  is_active: boolean;
  created_at: string;
}

export const businessService = {
  // ✅ Get business by owner ID
  async getBusinessByOwnerId(ownerId: number): Promise<Business | null> {
    try {
      console.log('🔍 Fetching business for owner:', ownerId);
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', ownerId)
        .maybeSingle();

      if (error) {
        console.error('❌ Fetch business error:', error);
        return null;
      }
      
      console.log('✅ Business found:', data?.business_name || 'No business');
      return data;
    } catch (error) {
      console.error('❌ Fetch business exception:', error);
      return null;
    }
  },

  // ✅ Force refresh business
  async forceRefreshBusiness(ownerId: number): Promise<Business | null> {
    try {
      console.log('🔄 Force refreshing business for owner:', ownerId);
      
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', ownerId)
        .maybeSingle();

      if (error) {
        console.error('❌ Force refresh error:', error);
        return null;
      }
      
      console.log('✅ Force refresh business found:', data?.business_name || 'None');
      return data;
    } catch (error) {
      console.error('❌ Force refresh exception:', error);
      return null;
    }
  }
};