const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Email invalide']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    }
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);