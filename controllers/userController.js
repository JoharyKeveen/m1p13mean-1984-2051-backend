const User = require("../models/User");
const Store = require("../models/Store");
const jwt = require("jsonwebtoken");
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Générer token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message:
          "Missing required fields: email, password, first_name, last_name",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Construire l'URL du PDp si un fichier est fourni
    let pdp_url = null;
    if (req.file) {
      // pdp_url = `/uploads/pdps/${req.file.filename}`;
      pdp_url = await compressImage(req, "pdps");
    } else {
      console.log("No file received in request");
    }

    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      phone: phone || "",
      role: role || "buyer",
      pdp_url,
    });

    const store = await Store.create({
      name: "Default", 
      description: "No description",
      manager: user
    });

    res.status(201).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone: user.phone,
      email: user.email,
      pdp_url: user.pdp_url,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Edit user
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "No user found" });

    // Construction des champs à mettre à jour
    const updateData = {
      email: req.body.email || user.email,
      first_name: req.body.first_name || user.first_name,
      last_name: req.body.last_name || user.last_name,
      phone: req.body.phone || user.phone,
      adress: req.body.adress || user.adress,
    };

    if (req.file) {
      updateData.pdp_url = await compressImage(req, "pdps");
    }

    // Mise à jour dans la base
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: error.message });
  }
};

const compressImage = async (req, dir) => {
  const uploadDir = path.join(__dirname, "../uploads/" + dir);
  const originalPath = req.file.path;
  const compressedPath = path.join(uploadDir, "compressed-" + req.file.filename);

  // Redimensionner et compresser l'image
  await sharp(originalPath)
    .resize({ width: 500, height: 500, fit: 'inside' }) // garde le ratio
    .jpeg({ quality: 80 }) // compresse en JPEG à 80%
    .toFile(compressedPath);

  fs.unlinkSync(originalPath);

  return  `/uploads/${dir}/compressed-${req.file.filename}`;
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      pdp_url: user.pdp_url,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Construire l'URL du fichier
    const imageUrl = `/uploads/pdps/${req.file.filename}`;

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      userId,
      { pdp_url: imageUrl },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile picture updated successfully",
      pdp_url: user.pdp_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getCurrentUser
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStoreUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'store' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, updateProfilePicture, getCurrentUser, getStoreUsers, updateUser };
