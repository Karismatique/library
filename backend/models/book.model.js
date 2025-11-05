const mongoose = require('mongoose');

// models/book.model.js
// Schéma Mongoose pour les livres. Relie chaque livre à un `authorId`.
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    min: -3000,
    max: new Date().getFullYear() + 5
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);