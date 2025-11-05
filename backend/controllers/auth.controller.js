// controllers/auth.controller.js
// Gère l'inscription et l'authentification (login).
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const SECRET_KEY = process.env.JWT_SECRET || 'supersecret';

// POST /api/auth/register
// Crée un nouvel utilisateur avec rôle 'user'
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, role: 'user' });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/auth/login
// Vérifie les identifiants et renvoie un JWT contenant id, email et role
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    // Renvoie le token au frontend (le frontend le stocke en localStorage)
    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};