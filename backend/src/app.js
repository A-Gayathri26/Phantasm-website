import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import { env } from "./config/env.js";
import { pool } from "./db/pool.js";
import registrationRoutes from "./routes/registration.js";
import paymentRoutes from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const PgSession = connectPgSimple(session);

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(compression());
  app.use(morgan(env.isProd ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  );

  app.use(
    session({
      store: new PgSession({ pool, tableName: "session", createTableIfMissing: true }),
      name: "phantasm.sid",
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env.isProd,
        sameSite: env.isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 8, // 8 hours
      },
    }),
  );

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  app.use("/api", registrationRoutes);
  app.use("/api", paymentRoutes);
  app.use("/api", adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
