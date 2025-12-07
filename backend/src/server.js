import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import passport from "passport";
import "dotenv/config";

import pool from "./config/database.js";
import "./config/passport.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import requestRoutes from "./routes/request.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import municipioRoutes from "./routes/municipio.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || "aidmedssessions",
    store: new (MySQLStore(session))({
        clearExpired: true,
        expiration: 7200000,
        checkExpirationInterval: 1800000,
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }, pool.pool || pool),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7200000
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/municipios", municipioRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "AidMeds API is running" });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
