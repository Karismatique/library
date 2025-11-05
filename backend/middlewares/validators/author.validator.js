const Joi = require('joi');

// middlewares/validators/author.validator.js
// Schémas Joi pour la validation des routes auteurs (création / mise à jour).
const authorSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le nom est obligatoire.',
      'string.min': 'Le nom doit contenir au moins 2 caractères.',
      'string.max': 'Le nom ne doit pas dépasser 50 caractères.'
    }),
  birthYear: Joi.number()
    .integer()
    .min(1000)
    .max(2100)
    .required()
    .messages({
      'number.base': "L'année de naissance doit être un nombre.",
      'number.integer': "L'année de naissance doit être un entier.",
      'number.min': "L'année de naissance semble trop ancienne.",
      'number.max': "L'année de naissance semble trop future."
    })
});

const authorUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  birthYear: Joi.number().integer().min(1000).max(2100)
});

module.exports = {
  authorSchema: authorSchema,
  authorUpdateSchema: authorUpdateSchema
};