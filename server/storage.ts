import {
  users,
  businesses,
  type User,
  type UpsertUser,
  type Business,
  type InsertBusiness,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Business operations
  createBusiness(business: InsertBusiness): Promise<Business>;
  getBusiness(id: number): Promise<Business | undefined>;
  getBusinessesByOwner(ownerId: string): Promise<Business[]>;
  getAllBusinesses(): Promise<Business[]>;
  searchBusinesses(query: string): Promise<Business[]>;
  getBusinessesByCategory(category: string): Promise<Business[]>;
  updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business | undefined>;
  deleteBusiness(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Business operations
  async createBusiness(business: InsertBusiness): Promise<Business> {
    const [newBusiness] = await db
      .insert(businesses)
      .values(business)
      .returning();
    return newBusiness;
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id));
    return business;
  }

  async getBusinessesByOwner(ownerId: string): Promise<Business[]> {
    return await db
      .select()
      .from(businesses)
      .where(eq(businesses.ownerId, ownerId))
      .orderBy(desc(businesses.createdAt));
  }

  async getAllBusinesses(): Promise<Business[]> {
    return await db
      .select()
      .from(businesses)
      .orderBy(desc(businesses.createdAt));
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    const searchTerm = `%${query}%`;
    return await db
      .select()
      .from(businesses)
      .where(
        or(
          like(businesses.name, searchTerm),
          like(businesses.description, searchTerm),
          like(businesses.category, searchTerm)
        )
      )
      .orderBy(desc(businesses.createdAt));
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    if (category === 'all') {
      return this.getAllBusinesses();
    }
    
    return await db
      .select()
      .from(businesses)
      .where(eq(businesses.category, category))
      .orderBy(desc(businesses.createdAt));
  }

  async updateBusiness(id: number, updates: Partial<InsertBusiness>): Promise<Business | undefined> {
    const [updatedBusiness] = await db
      .update(businesses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businesses.id, id))
      .returning();
    return updatedBusiness;
  }

  async deleteBusiness(id: number): Promise<void> {
    await db.delete(businesses).where(eq(businesses.id, id));
  }
}

export const storage = new DatabaseStorage();
