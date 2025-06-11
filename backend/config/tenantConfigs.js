const tenantConfigs = {
   
    portfolio: {
      EMAIL_SERVICE: process.env.PORTFOLIO_EMAIL_SERVICE,
      EMAIL_USER: process.env.PORTFOLIO_EMAIL_USER,
      EMAIL_PASS: process.env.PORTFOLIO_EMAIL_PASS,
      OWNER_EMAIL: process.env.PORTFOLIO_OWNER_EMAIL,
    
    MONGO_URI: process.env.PORTFOLIO_MONGO_URI,
    FRONTEND_URL_PRODUCTION: process.env.PORTFOLIO_FRONTEND_URL_PRODUCTION,
    FRONTEND_URL_DEVELOPMENT: process.env.PORTFOLIO_FRONTEND_URL_DEVELOPMENT,

    },
     rricura: {
      EMAIL_SERVICE: process.env.RRICURA_EMAIL_SERVICE,
      EMAIL_USER: process.env.RRICURA_EMAIL_USER,
      EMAIL_PASS: process.env.RRICURA_EMAIL_PASS,
      OWNER_EMAIL: process.env.RRICURA_OWNER_EMAIL,
      STRIPE_SECRET_KEY: process.env.RRICURA_STRIPE_KEY,
      MONGO_URI: process.env.RRICURA_MONGO_URI,
       FRONTEND_URL_PRODUCTION: process.env.RRICURA_FRONTEND_URL_PRODUCTION,
    FRONTEND_URL_DEVELOPMENT: process.env.RRICURA_FRONTEND_URL_DEVELOPMENT,
    ORS_API_KEY: process.env.RRICURA_ORS_API_KEY,
    BUSINESS_ADDRESS: process.env.RRICURA_BUSINESS_ADDRESS,

    },
  };
  
  module.exports = tenantConfigs;
  