const express = require("express");
require("dotenv").config();

const cors = require("cors");

const tenantConfigs = require("./config/tenantConfigs");
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require("./routes/contactRoutes"); // ✅ New


const app = express();
const isProduction = process.env.NODE_ENV === "production";
console.log("🚀 Loaded DEV origin for portfolio:", tenantConfigs.portfolio.FRONTEND_URL_DEVELOPMENT);

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


// ✅ Multi-tenant API Routes

app.use('/api', paymentRoutes); // ✅
app.use('/api', contactRoutes);   // /api/contact/:client






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${isProduction ? "Production" : "Development"})`);
});
