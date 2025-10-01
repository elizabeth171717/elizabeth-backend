const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Path to uploads folder
const uploadDir = path.join(__dirname, "..", "uploads");

// ✅ Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// Single image upload
const upload = multer({ storage }).single("image");

// Controller function
exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Multer error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Build full URL (works in dev + prod)
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({ url: imageUrl });
  });
};
