// utils/getTenantDB.js
const mongoose = require("mongoose");
const tenantConfigs = require("../config/tenantConfigs");

const connections = {}; // cache connections

const getTenantDB = async (client) => {
  if (!tenantConfigs[client]) {
    throw new Error(`No config found for client: ${client}`);
  }

  const mongoURI = tenantConfigs[client].MONGO_URI;

  if (connections[client]) {
    return connections[client];
  }

  const conn = await mongoose.createConnection(mongoURI);

  connections[client] = conn;
  return conn;
};

module.exports = getTenantDB;
