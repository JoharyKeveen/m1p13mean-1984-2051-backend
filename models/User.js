const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ROLES, DEFAULT_ROLE } = require("../config/roles");

const userSchema = mongoose.Schema({
  pdp_url: { type: String },
  last_name: { type: String, required: true },
  first_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ROLES, default: DEFAULT_ROLE, required: true },
  phone : { type: String },
  status: { type: Boolean, default: true },
  adress: { type: String },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Vérifier le mot de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
