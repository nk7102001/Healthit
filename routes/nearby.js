const express = require("express");
const router = express.Router();
const axios = require("axios");                         
const getUserFromToken = require("../utils/getUserFromToken");  

// Nearby
router.get("/", async (req, res) => {
  const user = await getUserFromToken(req);
  res.render("pages/nearby", { hospitals: null, user });
});
router.post("/", async (req, res) => {
  const user = await getUserFromToken(req);
  const { location, type = "hospital" } = req.body;
  const category =
    type === "pharmacy" ? "healthcare.pharmacy" : "healthcare.hospital";
  const geoKey = process.env.GEOAPIFY_API_KEY;
  try {
    const geoRes = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: { text: location, apiKey: geoKey },
      }
    );
    const loc = geoRes.data.features[0];
    if (!loc) return res.render("pages/nearby", { hospitals: [], user });
    const [lon, lat] = loc.geometry.coordinates;
    const placesRes = await axios.get("https://api.geoapify.com/v2/places", {
      params: {
        categories: category,
        filter: `circle:${lon},${lat},5000`,
        bias: `proximity:${lon},${lat}`,
        limit: 15,
        apiKey: geoKey,
      },
    });
    const hospitals = placesRes.data.features.map((h) => ({
      name: h.properties.name || "Unnamed",
      address: h.properties.address_line1 || "No address",
    }));
    res.render("pages/nearby", { hospitals, user });
  } catch {
    res.render("pages/nearby", { hospitals: [], user });
  }
});

module.exports = router