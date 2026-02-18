const multer = require("multer");
const path = require("path");

// Configuration du stockage
const store_at = (place = '') => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, "../uploads/" + place);
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Générer un nom unique avec timestamp
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "pdp-" + uniqueSuffix + path.extname(file.originalname));
    },
  });

  // Filtre pour accepter uniquement les images
  const fileFilter = (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed (jpeg, png, gif, webp)"), false);
    }
  };

  // Configuration multer
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  });
  return upload;
}

module.exports = store_at;
