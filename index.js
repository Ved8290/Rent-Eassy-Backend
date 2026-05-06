const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dns = require('dns');

require('dotenv').config();

// Routes
const Property = require("./Routes/Property");

// ⚠️ DNS Fix (keep this)
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const MONGO_URL = process.env.Mongo_URL;

if (!MONGO_URL) {
  console.error("❌ Mongo_URL not found in environment variables");
  process.exit(1);
}

// 🔥 Cached connection (important for serverless + local)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// ✅ DB connection function
async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB Connected");
  return cached.conn;
}

// ─────────────────────────────────────────────
// Routes (auto-connect DB before each request)
// ─────────────────────────────────────────────

const withDB = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
};

// Health check
app.get('/', withDB, (req, res) => {
  res.send('Rent Flow Backend 🚀');
});

app.get('/error', (req, res) => {
  res.send('Error Page!');
});

// API Routes
app.use('/auth', withDB, require('./Routes/Auth'));
app.use('/api', withDB, Property);
app.use('/api', withDB, require('./Routes/NewRenter'));
app.use('/api', withDB, require('./Routes/RenterDetails'));
app.use('/api', withDB, require('./Routes/CornUpdates'));
app.use('/api', withDB, require('./Routes/RentData'));
app.use('/api/cron', withDB, require('./Routes/Cronroutes'));

// ─────────────────────────────────────────────
// 🚀 START SERVER (LOCAL ONLY)
// ─────────────────────────────────────────────

async function startServer() {
  try {
    // ✅ Step 1: Connect DB FIRST
    await connectDB();

    const PORT = process.env.PORT || 5001;

    // ✅ Step 2: Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // ✅ Step 3: Start cron AFTER DB is ready
    try {
      const { startCronJobs } = require('./Cornjobs');
      startCronJobs();
      console.log("✅ Cron jobs started successfully");
    } catch (err) {
      console.warn("⚠️ Cron jobs not started:", err.message);
    }

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

// Run only locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

// ✅ Export for serverless (Vercel)
module.exports = app;