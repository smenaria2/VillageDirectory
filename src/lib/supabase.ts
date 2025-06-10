import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          first_name: string | null;
          last_name: string | null;
          profile_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: number;
          name: string;
          category: string;
          description: string | null;
          phone: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          rating: number | null;
          is_open: boolean | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          category: string;
          description?: string | null;
          phone?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          rating?: number | null;
          is_open?: boolean | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          category?: string;
          description?: string | null;
          phone?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          rating?: number | null;
          is_open?: boolean | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};