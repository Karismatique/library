const Joi = require('joi');
const mongoose = require('mongoose');

// middlewares/validators/book.validator.js
// Schémas Joi pour la validation des livres (création / mise à jour).
// Note: authorId doit être un ObjectId valide lors de la création.
const bookSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  year: Joi.number().integer().min(-3000).max(2100).required(),
  authorId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Valid ObjectId')
    .messages({
      'any.invalid': "L'ID de l'auteur doit être un ObjectId valide (24 caractères hexadécimaux).",
      'any.required': "L'ID de l'auteur est requis."
    })
});

const bookUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  year: Joi.number().integer().min(-3000).max(2100),
  authorId: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Valid ObjectId')
});

module.exports = { bookSchema, bookUpdateSchema };