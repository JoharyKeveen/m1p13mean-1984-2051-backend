const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateProfilePicture,
  getCurrentUser,
} = require("../controllers/userController");
const store_at = require("../middlewares/uploadMiddleware");
const { get } = require("mongoose");
const { authenticate } = require("../middlewares/authMiddleware");

// Middleware d'erreur pour multer
const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    console.error("Multer error:", err);
    return res.status(400).json({ message: err.message });
  }
  next();
};

router.post(
  "/register",
  store_at('pdps').single("pdp"),
  multerErrorHandler,
  registerUser,
);

router.post("/login", loginUser);

router.put(
  "/upload-profile-picture/:id",
  store_at('pdps').single("pdp"),
  multerErrorHandler,
  updateProfilePicture,
);

router.get("/me", authenticate, getCurrentUser);

module.exports = router;
