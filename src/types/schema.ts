import { z } from "zod";

export const businessCategorySchema = z.enum([
  "shop",
  "service", 
  "food",
  "health",
  "other"
]);

export type BusinessCategory = z.infer<typeof businessCategorySchema>;

export const insertBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required").max(255),
  category: businessCategorySchema,
  description: z.string().optional(),
  phone: z.string().max(20).optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_open: z.boolean().default(true),
});

export type InsertBusiness = z.infer<typeof insertBusinessSchema>;

export interface Business {
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
}

export interface User {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}