// controllers/uploadController.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const tenants = require("../config/tenantConfigs"); // adjust path if needed


// ✅ Multer setup (temporary local storage)
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage }).single("image");

// ✅ Controller function
exports.uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // ✅ Get tenant/client config
      const client = req.params.client;
      const tenantConfig = tenants[client];

      if (!tenantConfig) {
        return res.status(400).json({ error: "Invalid tenant" });
      }

      // ✅ Configure Cloudinary dynamically per tenant
      cloudinary.config({
        cloud_name: tenantConfig.CLOUDINARY_CLOUD_NAME,
        api_key: tenantConfig.CLOUDINARY_API_KEY,
        api_secret: tenantConfig.CLOUDINARY_API_SECRET,
      });

      // ✅ Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `menus/${client}`,
        use_filename: true,
        unique_filename: false,
      });

      // ✅ Delete local temp file
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.warn("⚠️ Failed to delete temp file:", unlinkErr);
      });

      // ✅ Return the Cloudinary URL to frontend
      res.json({ url: result.secure_url });
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error);
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  });
};
