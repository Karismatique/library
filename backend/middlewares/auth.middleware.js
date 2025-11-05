// middlewares/auth.middleware.js
// Vérifie la présence et la validité d'un JWT dans l'en-tête Authorization.
// Si valide, attache l'objet décodé sur `req.user` et le rôle sur `req.role`.
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Charger les variables d'environnement

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formé' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded attendu : { id, email, role }
    req.user = decoded;
    req.role = decoded.role;
    next();
  } catch (err) {
    // Token invalide ou expiré
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
}

module.exports = authenticate;

