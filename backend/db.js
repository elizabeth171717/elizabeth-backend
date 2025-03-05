const { MongoClient } = require("mongodb");
require("dotenv").config(); // Loads environment variables

const uri = process.env.MONGO_URI; // Use environment variable for security


const client = new MongoClient(uri);


async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
}

module.exports = { client, connectDB };
