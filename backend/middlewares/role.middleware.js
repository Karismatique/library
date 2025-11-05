// middlewares/role.middleware.js
// Middleware simple pour restreindre l'accès selon le rôle de l'utilisateur.
// Usage : router.post('/', authorize(['admin']), handler)
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.role;

    if (!role) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Rôle manquant'
      });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Accès refusé : rôle insuffisant'
      });
    }

    next();
  };
}

module.exports = authorize;