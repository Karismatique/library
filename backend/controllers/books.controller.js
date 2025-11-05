// controllers/books.controller.js
const Book = require('../models/book.model');
const Author = require('../models/author.model');

exports.getAllBooks = async (req, res, next) => {
  try {
    const { q, author, page = 1, limit = 10 } = req.query;
    const query = {};

    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }
    if (author) {
      query.authorId = author;
    }

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(books);
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const book = new Book({
      title: req.body.title,
      year: req.body.year,
      authorId: req.body.authorId
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.replaceBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }

  // Ne pas modifier l'auteur lors de l'édition : on conserve book.authorId
  // Ainsi l'édition ne nécessite ni ne change l'authorId.
  book.title = req.body.title || book.title;
  book.year = req.body.year || book.year;

    await book.save();
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const result = await Book.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      const err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};