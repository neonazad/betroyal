import { 
  users, games, transactions,
  type User, type InsertUser, 
  type Game, type InsertGame,
  type Transaction, type InsertTransaction
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: number): Promise<User | undefined>;
  
  // Game methods
  getAllGames(): Promise<Game[]>;
  getGameById(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
  
  // Transaction methods
  getAllTransactions(): Promise<Transaction[]>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private transactions: Map<number, Transaction>;
  public sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private gameIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.transactions = new Map();
    this.userIdCounter = 1;
    this.gameIdCounter = 1;
    this.transactionIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Add initial admin user
    this.createUser({
      username: "admin",
      password: "admin123", // this will be hashed by the auth system
      email: "admin@betroyal.com",
      fullName: "Admin User",
    }).then(user => {
      // Update user to have admin role
      const updatedUser = { ...user, role: "admin" };
      this.users.set(user.id, updatedUser);
    });
    
    // Add some demo games
    const demoGames = [
      {
        name: "Spaceman Crash",
        type: "crash",
        image: "https://images.unsplash.com/photo-1485356824219-4bc17c2a2ea7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        description: "Watch the rocket fly and cash out before it crashes for big wins!",
        playersCount: 2450,
        rating: 5,
        isActive: true
      },
      {
        name: "Royal Slots",
        type: "slots",
        image: "https://pixabay.com/get/g2b8c391aada95928e966eca52d6ca59538e7bdd62c74bb8bc19e48e2e51be91061f1fe1080de41104c84a41611dca258227496d23d64a8c8e85d67bb5506082d_1280.jpg",
        description: "Classic slot machine game with exciting bonuses",
        playersCount: 1200,
        rating: 4
      },
      {
        name: "Lucky Dice",
        type: "dice",
        image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        description: "Test your luck with our dice game",
        playersCount: 856,
        rating: 4
      },
      {
        name: "VIP Poker",
        type: "cards",
        image: "https://pixabay.com/get/g2132e0942a7a02e0952d904533b52681aa7f4f42dab94f47f356ead65e58ae9ae215cfacae36fdfd630a1724740c099bca250e17e0bfa5aa986f7790fc4adfd8_1280.jpg",
        description: "Premium poker experience for high rollers",
        playersCount: 1500,
        rating: 5
      },
      {
        name: "Royal Roulette",
        type: "roulette",
        image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        description: "Classic roulette with multiple betting options",
        playersCount: 923,
        rating: 4
      }
    ];
    
    // Add demo games to storage
    demoGames.forEach(game => {
      this.createGame(game);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = { 
      ...userData, 
      id, 
      balance: 5000,
      role: "user",
      isActive: true,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUserBalance(userId: number, newBalance: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, balance: newBalance };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGameById(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async createGame(gameData: InsertGame): Promise<Game> {
    const id = this.gameIdCounter++;
    
    const game: Game = {
      ...gameData,
      id,
      isActive: gameData.isActive ?? true,
      playersCount: gameData.playersCount ?? 0,
      rating: gameData.rating ?? 0
    };
    
    this.games.set(id, game);
    return game;
  }
  
  async updateGame(id: number, gameData: Partial<InsertGame>): Promise<Game | undefined> {
    const game = await this.getGameById(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, ...gameData };
    this.games.set(id, updatedGame);
    return updatedGame;
  }
  
  async deleteGame(id: number): Promise<boolean> {
    return this.games.delete(id);
  }
  
  // Transaction methods
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
  
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    const transaction: Transaction = {
      ...transactionData,
      id,
      status: "completed",
      createdAt: now
    };
    
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
