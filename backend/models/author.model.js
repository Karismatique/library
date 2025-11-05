const mongoose = require('mongoose');

// models/author.model.js
// Schéma Mongoose pour les auteurs. Contient le nom et l'année de naissance.
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  birthYear: {
    type: Number,
    min: 0,
    max: new Date().getFullYear()
  }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);