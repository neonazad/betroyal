import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertGameSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Get all games
  app.get("/api/games", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Error fetching games" });
    }
  });

  // Get game by ID
  app.get("/api/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGameById(id);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Error fetching game" });
    }
  });

  // Admin routes
  // Get all users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Add new game
  app.post("/api/admin/games", async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const newGame = await storage.createGame(gameData);
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating game" });
    }
  });

  // Update game
  app.patch("/api/admin/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gameData = insertGameSchema.partial().parse(req.body);
      const updatedGame = await storage.updateGame(id, gameData);
      
      if (!updatedGame) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(updatedGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating game" });
    }
  });

  // Delete game
  app.delete("/api/admin/games/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteGame(id);
      
      if (!result) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting game" });
    }
  });

  // Get transactions
  app.get("/api/admin/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  // Create transaction (deposit/withdrawal)
  app.post("/api/transactions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const transaction = await storage.createTransaction(transactionData);
      
      // Update user balance based on transaction type
      if (transaction.type === "deposit") {
        await storage.updateUserBalance(transaction.userId, req.user.balance + transaction.amount);
      } else if (transaction.type === "withdrawal") {
        if (req.user.balance < transaction.amount) {
          return res.status(400).json({ message: "Insufficient balance" });
        }
        await storage.updateUserBalance(transaction.userId, req.user.balance - transaction.amount);
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating transaction" });
    }
  });

  // Get user transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  });

  // Game results route (for updating balance after playing games)
  app.post("/api/game-result", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { gameId, amount, isWin } = req.body;
      const userId = req.user.id;
      
      // Validate input
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Check if user has enough balance for bet
      if (!isWin && req.user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      // Create transaction record
      const transactionType = isWin ? "win" : "loss";
      const transactionAmount = isWin ? amount : -amount;
      
      await storage.createTransaction({
        userId,
        amount: Math.abs(amount),
        type: transactionType,
      });
      
      // Update user balance
      const newBalance = req.user.balance + transactionAmount;
      await storage.updateUserBalance(userId, newBalance);
      
      res.json({ success: true, newBalance });
    } catch (error) {
      res.status(500).json({ message: "Error processing game result" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
