// routes/books.routes.js
// Endpoints pour gérer les livres. Lecture : user + admin. Modification : admin uniquement.
const express = require('express');
const router = express.Router();

const {
  getAllBooks,
  getBookById,
  createBook,
  replaceBook,
  deleteBook
} = require('../controllers/books.controller');

const validate = require('../middlewares/validate.middleware');
const schema = require('../middlewares/validators/book.validator');
const authorize = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Gestion des livres (CRUD + filtres)
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Liste tous les livres
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, minimum: 1, maximum: 100 }
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Recherche par titre (insensible à la casse)
 *       - in: query
 *         name: author
 *         schema: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 *         description: Filtre par ID auteur (ObjectId)
 *     responses:
 *       200:
 *         description: Liste paginée des livres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       401:
 *         description: Token manquant ou invalide
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Récupérer un livre par ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 *         description: ObjectId MongoDB du livre
 *     responses:
 *       200:
 *         description: Livre trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Livre non trouvé
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Créer un nouveau livre (admin uniquement)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Données invalides ou auteur inexistant
 *       403:
 *         description: Accès refusé (non admin)
 *       401:
 *         description: Token invalide
 */

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Mettre à jour un livre (admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *     responses:
 *       200:
 *         description: Livre mis à jour
 *       404:
 *         description: Livre non trouvé
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Supprimer un livre (admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 *     responses:
 *       200:
 *         description: Livre supprimé
 *       404:
 *         description: Livre non trouvé
 *       403:
 *         description: Accès refusé
 */

// GET : user + admin
router.get('/', authorize(['user', 'admin']), getAllBooks);
router.get('/:id', authorize(['user', 'admin']), getBookById);

// POST, PUT, DELETE : admin uniquement
router.post('/', authorize(['admin']), validate(schema.bookSchema), createBook);
router.put('/:id', authorize(['admin']), validate(schema.bookUpdateSchema), replaceBook);
router.delete('/:id', authorize(['admin']), deleteBook);

module.exports = router;