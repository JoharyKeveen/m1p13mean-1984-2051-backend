const User = require("../models/User");
const Store = require("../models/Store");
const jwt = require("jsonwebtoken");

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
      pdp_url = `/uploads/pdps/${req.file.filename}`;
      console.log("Image uploaded:", pdp_url);
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
    const user = await User.findById(req.params._id);
    if (!user) return res.status(500).json({ message: "No user found" });
    user = {
      email: req.body.email, 
      first_name: req.body.first_name, 
      last_name: req.body.last_name, 
      phone: req.body.phone, 
      adress: req.body.adress
    };
    let pdp_url = null;
    if (req.file) {
      pdp_url = `/uploads/pdps/${req.file.filename}`;
      console.log("Image uploaded:", pdp_url);
    } else {
      console.log("No file received in request");
    }
    const userNew = await User.findByIdAndUpdate(req.params._id, user, {new: true} );
    
    res.status(201).json({
      userNew
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
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
