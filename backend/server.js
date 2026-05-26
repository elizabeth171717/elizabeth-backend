const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");

// ✅ Import broadcast helper
const { initBroadcast } = require("./utils/broadcast");

const tenantConfigs = require("./config/tenantConfigs");
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes");
const deliveryFeeRoutes = require("./routes/deliveryFeeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const authRoutes = require("./routes/authRoutes");

const anahuacAuthRoutes = require("./routes/anahuacAuthRoutes");
const anahuacMenuRoutes = require("./routes/anahuacMenuRoutes");

const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const getTenantDB = require("./utils/getTenantDB"); // ✅ FIX: add this
const path = require("path");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
console.log(
  "🚀 Loaded DEV origin for portfolio:",
  tenantConfigs.portfolio.FRONTEND_URL_DEVELOPMENT
);

// ✅ Multi-tenant CORS logic
const corsOptions = {
  origin: (origin, callback) => {
    console.log("🔎 Incoming origin:", origin);
    if (!origin) return callback(null, true);

    let matchedTenant = null;

    const isAllowed = Object.entries(tenantConfigs).some(([key, config]) => {
      const allowedOrigin = isProduction
        ? config.FRONTEND_URL_PRODUCTION
        : config.FRONTEND_URL_DEVELOPMENT;

      if (allowedOrigin === origin) {
        matchedTenant = key;
        return true;
      }

      return false;
    });

    if (isAllowed) {
      console.log(`✅ Allowed by CORS for tenant: ${matchedTenant}`);
      callback(null, true);
    } else {
      console.log("❌ Origin not allowed by CORS");
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());



// ✅ Serve uploaded images (SAFE absolute path)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// ✅ Multi-tenant API Routes
app.use("/api", paymentRoutes);
app.use("/api", contactRoutes);
app.use("/api", deliveryFeeRoutes);
app.use("/api", orderRoutes);
app.use("/api", portfolioRoutes);



app.use("/api", uploadRoutes);
app.use("/api", anahuacMenuRoutes);
app.use("/api", adminRoutes);

app.use("/auth", anahuacAuthRoutes);
app.use("/auth", authRoutes);

// --- WS ONLY for universalmenu ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ✅ Initialize broadcast helper with WebSocket server
initBroadcast(wss);
// --- Load initial menu from DB ---
const loadInitialMenu = async () => {
  try {
    const db = await getTenantDB("universalmenu");
    const Menu = db.models.Menu || db.model("Menu", require("./models/Menu"));
    const menu = await Menu.findOne();
    if (menu) {
      // Set initial universalMenuData so new connections get it
      const { broadcastMenuUpdate } = require("./utils/broadcast");
      broadcastMenuUpdate(menu);
      console.log("📡 Initial universal menu loaded for WS");
    }
  } catch (err) {
    console.error("❌ Failed to load initial universal menu:", err);
  }
};
loadInitialMenu();


// --- Handle new WebSocket connections ---
wss.on("connection", async (ws) => {
  console.log("🔌 WebSocket client connected (universalmenu)");

  // Send the current menu immediately on connect
  const { universalMenuData } = require("./utils/broadcast");
  ws.send(JSON.stringify({ type: "menu-update", data: universalMenuData }));

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected (universalmenu)");
  });
});





// --- Start server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} (${
      isProduction ? "Production" : "Development"
    })`
  );
});
