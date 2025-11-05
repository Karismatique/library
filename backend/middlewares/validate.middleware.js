const Joi = require('joi');

// Middleware de validation avec Joi.
// Utiliser : router.post('/', validate(schema), handler)
function validate(schema, options = { abortEarly: false, convert: true }) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      // Retourne les messages d'erreur de validation au client
      return res.status(400).json({
        error: 'ValidationError',
        message: error.details.map(d => d.message),
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      });
    }
    // Remplace le body par la valeur nettoyée / convertie par Joi
    req.body = value;
    next();
  };
}

module.exports = validate;