const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateProfilePicture,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

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
  upload.single("pdp"),
  multerErrorHandler,
  registerUser,
);

router.post("/login", loginUser);

router.put(
  "/upload-profile-picture/:id",
  upload.single("pdp"),
  multerErrorHandler,
  updateProfilePicture,
);

module.exports = router;
