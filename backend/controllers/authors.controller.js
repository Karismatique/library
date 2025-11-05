// controllers/authors.controller.js
const Author = require('../models/author.model');
const Book = require('../models/book.model');

// controllers/authors.controller.js
// Gestion des auteurs: liste, création, lecture, mise à jour et suppression.

// GET /api/authors?page=&limit=
// Retourne une page d'auteurs
exports.getAllAuthors = async (req, res, next) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const authors = await Author.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const includeBooks = req.query.includeBooks === 'true';
    let data = authors;

    if (includeBooks) {
      const authorsWithBooks = await Promise.all(
        authors.map(async (author) => {
          const books = await Book.find({ authorId: author._id });
          return { ...author.toObject(), books };
        })
      );
      data = authorsWithBooks;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/authors/:id
// Récupère un auteur par son id
exports.getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }

    const includeBooks = req.query.includeBooks === 'true';
    if (!includeBooks) return res.json(author);

    const books = await Book.find({ authorId: author._id });
    res.json({ ...author.toObject(), books });
  } catch (err) {
    next(err);
  }
};

// POST /api/authors
// Crée un nouvel auteur
exports.createAuthor = async (req, res, next) => {
  try {
    const author = new Author({
      name: req.body.name,
      birthYear: req.body.birthYear
    });
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
};

// PUT /api/authors/:id
// Met à jour un auteur existant
exports.replaceAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }

    author.name = req.body.name || author.name;
    author.birthYear = req.body.birthYear || author.birthYear;
    await author.save();

    res.json(author);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/authors/:id
// Supprime l'auteur seulement s'il n'a aucun livre associé (409 sinon)
exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      const err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }

    const hasBooks = await Book.exists({ authorId: author._id });
    if (hasBooks) {
      const err = new Error('Cannot delete author with associated books');
      err.status = 409;
      return next(err);
    }

    await Author.deleteOne({ _id: author._id });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};