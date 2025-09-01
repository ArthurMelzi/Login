import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertUserSchema } from "@shared/schema";
import { ZodError } from "zod";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Clean up expired sessions periodically
  setInterval(async () => {
    await storage.deleteExpiredSessions();
  }, 60 * 60 * 1000); // Every hour

  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "Sessão inválida" });
    }

    req.user = user;
    next();
  };

  // Register endpoint
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Usuário já existe" });
      }

      // Create user
      const user = await storage.createUser({
        username: validatedData.username,
        password: validatedData.password,
      });

      // Create session
      req.session.userId = user.id;

      res.json({
        message: "Cadastro realizado com sucesso",
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos",
          errors: error.errors.map(e => e.message),
        });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      // Validate password
      const isValidPassword = await storage.validatePassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Senha incorreta" });
      }

      // Create session
      req.session.userId = user.id;

      res.json({
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Dados inválidos",
          errors: error.errors.map(e => e.message),
        });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', requireAuth, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  // Get current user endpoint
  app.get('/api/auth/me', requireAuth, (req: any, res) => {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        createdAt: req.user.createdAt,
      },
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
