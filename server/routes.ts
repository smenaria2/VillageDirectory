import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBusinessSchema, businessCategorySchema } from "@shared/schema";
import { z } from "zod";

const createBusinessSchema = insertBusinessSchema.extend({
  category: businessCategorySchema,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Business routes
  app.get('/api/businesses', async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let businesses;
      if (search && typeof search === 'string') {
        businesses = await storage.searchBusinesses(search);
      } else if (category && typeof category === 'string') {
        businesses = await storage.getBusinessesByCategory(category);
      } else {
        businesses = await storage.getAllBusinesses();
      }
      
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  app.get('/api/businesses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }
      
      const business = await storage.getBusiness(id);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      res.json(business);
    } catch (error) {
      console.error("Error fetching business:", error);
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  app.post('/api/businesses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = createBusinessSchema.parse(req.body);
      
      const businessData = {
        ...validatedData,
        ownerId: userId,
      };
      
      const business = await storage.createBusiness(businessData);
      res.status(201).json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid business data", 
          errors: error.errors 
        });
      }
      console.error("Error creating business:", error);
      res.status(500).json({ message: "Failed to create business" });
    }
  });

  app.get('/api/my-businesses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const businesses = await storage.getBusinessesByOwner(userId);
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching user businesses:", error);
      res.status(500).json({ message: "Failed to fetch your businesses" });
    }
  });

  app.put('/api/businesses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }
      
      // Check if business exists and user owns it
      const existingBusiness = await storage.getBusiness(id);
      if (!existingBusiness) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      if (existingBusiness.ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this business" });
      }
      
      const validatedData = createBusinessSchema.partial().parse(req.body);
      const updatedBusiness = await storage.updateBusiness(id, validatedData);
      
      res.json(updatedBusiness);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid business data", 
          errors: error.errors 
        });
      }
      console.error("Error updating business:", error);
      res.status(500).json({ message: "Failed to update business" });
    }
  });

  app.delete('/api/businesses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }
      
      // Check if business exists and user owns it
      const existingBusiness = await storage.getBusiness(id);
      if (!existingBusiness) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      if (existingBusiness.ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this business" });
      }
      
      await storage.deleteBusiness(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting business:", error);
      res.status(500).json({ message: "Failed to delete business" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
