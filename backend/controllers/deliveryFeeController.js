const tenantConfigs = require("../config/tenantConfigs");
const {
  geocodeAddress,
  getDrivingDistance,
  calculateFee,
} = require("../utils/orsHelpers");



// controllers/deliveryFeeController.js
exports.calculateDeliveryFee = async (req, res) => {
  const { address } = req.body;
  const tenantOrigin = req.headers.origin;
  const clientFromParams = req.params?.client;

  console.log("🌐 Tenant Origin:", tenantOrigin);
  console.log("📦 Address:", address);
  console.log("🧭 Client Param:", clientFromParams);

  // Try finding tenant via origin header first
  let matchedTenant = Object.values(tenantConfigs).find((t) =>
    Object.values(t).includes(tenantOrigin)
  );

  // Fallback: find tenant by param
  if (!matchedTenant && tenantConfigs[clientFromParams]) {
    matchedTenant = tenantConfigs[clientFromParams];
  }

  if (!matchedTenant) {
    console.error("❌ Unauthorized tenant - origin or param didn't match");
    return res.status(403).json({ error: "Unauthorized tenant" });
  }

  try {
    const apiKey = matchedTenant.ORS_API_KEY;
    const businessAddress = matchedTenant.BUSINESS_ADDRESS;

    const [businessLng, businessLat] = await geocodeAddress(businessAddress, apiKey);
    const [customerLng, customerLat] = await geocodeAddress(address, apiKey);

    const distanceMiles = await getDrivingDistance(
      [businessLng, businessLat],
      [customerLng, customerLat],
      apiKey
    );

    const fee = calculateFee(distanceMiles);

    res.json({ distanceMiles: distanceMiles.toFixed(2), fee });
} catch (error) {
  if (error.message.includes("Outside delivery zone")) {
    return res.status(400).json({ error: "We don't deliver beyond 13 miles." });
  }

  console.error("❌ Delivery Fee Error:", error.message);
  res.status(500).json({ error: "Something went wrong calculating the delivery fee" });
}
};
