const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      message: 'Utilisateur créé avec succès'
    });
  } 
  catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    res.status(200).json({
      message: 'Login réussi',
      user: req.session.user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Non connecté' });
  }
  res.status(200).json({ user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: err.message });
    res.clearCookie('auth_session'); 
    res.status(200).json({ message: 'Déconnecté avec succès' });
  });
});


module.exports = router;