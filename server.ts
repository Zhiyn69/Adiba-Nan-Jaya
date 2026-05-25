import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import helmet from "helmet";
import cors from "cors";

import apiRouter from "./src/api/router";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Modern Security defaults
  app.use(helmet({
    contentSecurityPolicy: false, // Leave basic for Vite dev
  }));

  // Restrict CORS
  app.use(cors({
    origin: process.env.NODE_ENV === "production" ? ["https://yourproductiondomain.com"] : ["http://localhost:3000", "http://0.0.0.0:3000", /\.run\.app$/],
    credentials: true,
  }));

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(crypto.randomBytes(32).toString('hex'))); // Signed cookies secret

  // Mount API router
  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
