
// utils/orsHelpers.js
const axios = require("axios");

async function geocodeAddress(address, apiKey) {
  if (!address) {
    console.error("❌ geocodeAddress called with empty address!");
    throw new Error("Address is required for geocoding.");
  }

  console.log("📍 Geocoding address:", address);

  try {
    const res = await axios.get("https://api.openrouteservice.org/geocode/search", {
      params: {
        api_key: apiKey,
        text: address,
        size: 1,
      },
    });

    const coords = res.data?.features?.[0]?.geometry?.coordinates;

    if (!coords) {
      console.error("❌ No coordinates returned from ORS");
      throw new Error("Failed to get coordinates from OpenRouteService");
    }

    return coords; // [lon, lat]
  } catch (err) {
    console.error("❌ Error in geocodeAddress:", err.message);
    if (err.response) {
      console.error("❌ Response:", err.response.data);
    }
    throw err;
  }
}

async function getDrivingDistance(startCoords, endCoords, apiKey) {
  try {
    const res = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      { coordinates: [startCoords, endCoords] },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.routes[0].summary.distance / 1609.34; // meters to miles
  } catch (err) {
    console.error("❌ Error in getDrivingDistance:", err.message);
    if (err.response) {
      console.error("❌ Response:", err.response.data);
    }
    throw err;
  }
}



function calculateFee(miles) {
  // 1. Round up to the nearest half-mile to protect against strict API rounding
  const adjustedMiles = Math.ceil(miles * 2) / 2;
  
  console.log(`📏 Raw ORS Distance: ${miles.toFixed(2)} mi | Adjusted Distance: ${adjustedMiles} mi`);

  // 2. Updated pricing tiers to ensure fair pay for distance
  if (adjustedMiles >= 0 && adjustedMiles <= 3) return 7;   // Short trips
  if (adjustedMiles > 3 && adjustedMiles <= 6) return 12;  // Medium trips
  if (adjustedMiles > 6 && adjustedMiles <= 9) return 18;  // Long trips
  if (adjustedMiles > 9 && adjustedMiles <= 13) return 25; // Extra long trips ($20+ target)
  
  throw new Error("Outside delivery zone (13+ miles)");
}

module.exports = {
  geocodeAddress,
  getDrivingDistance,
  calculateFee,
};
