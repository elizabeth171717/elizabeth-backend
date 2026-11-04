
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const tenantConfigs = require("../config/tenantConfigs");

// Temporary storage
const uploadDir = path.join(__dirname, "..", "uploads", "customer-designs");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

// Accept PNG, JPG, JPEG and PDF only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ];

  const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    allowedTypes.includes(file.mimetype) &&
    allowedExtensions.includes(extension)
  ) {
    return cb(null, true);
  }

  cb(new Error("Only PNG, JPG, JPEG, and PDF files are allowed."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).single("design");

// Controller
exports.uploadCustomerDesign = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "Your design must be smaller than 10MB.",
        });
      }

      return res.status(400).json({
        error: err.message || "Upload failed.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Please select a design to upload.",
      });
    }

    try {
      const client = req.params.client;
      const tenantConfig = tenantConfigs[client];

      if (!tenantConfig) {
        return res.status(400).json({
          error: "Invalid tenant.",
        });
      }

      // Cloudinary configuration
      cloudinary.config({
        cloud_name: tenantConfig.CLOUDINARY_CLOUD_NAME,
        api_key: tenantConfig.CLOUDINARY_API_KEY,
        api_secret: tenantConfig.CLOUDINARY_API_SECRET,
      });

      if (
        !tenantConfig.CLOUDINARY_CLOUD_NAME ||
        !tenantConfig.CLOUDINARY_API_KEY ||
        !tenantConfig.CLOUDINARY_API_SECRET
      ) {
        throw new Error("Cloudinary configuration is incomplete.");
      }

      console.log("Uploading customer design:", {
        client,
        filename: req.file.originalname,
        size: req.file.size,
      });

      // Upload without modifying the customer's artwork
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `customer-designs/${client}`,
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      });

      return res.status(200).json({
        message: "Design uploaded successfully.",
        url: result.secure_url,
        public_id: result.public_id,
        originalName: req.file.originalname,
        format: result.format,
      });
    } catch (error) {
      console.error("Customer design upload error:", error);

      return res.status(500).json({
        error: "Cloudinary upload failed.",
      });
    } finally {
      // Always remove the temporary local file
      fs.unlink(req.file.path, (unlinkError) => {
        if (unlinkError) {
          console.warn("Could not delete temporary file:", unlinkError);
        }
      });
    }
  });
};
