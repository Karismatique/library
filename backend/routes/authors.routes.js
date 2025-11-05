// routes/authors.routes.js
// Endpoints pour gérer les auteurs. GET : user + admin. Modification : admin.
const express = require('express');
const router = express.Router();

const {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  replaceAuthor,
  deleteAuthor
} = require('../controllers/authors.controller');

const validate = require('../middlewares/validate.middleware');
const schema = require('../middlewares/validators/author.validator');
const authorize = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Gestion des auteurs (CRUD + recherche)
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Liste tous les auteurs
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1, minimum: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, minimum: 1, maximum: 100 }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: Filtre par nom (insensible à la casse)
 *       - in: query
 *         name: includeBooks
 *         schema: { type: boolean, default: false }
 *         description: Inclure les livres associés
 *     responses:
 *       200:
 *         description: Liste paginée des auteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Récupérer un auteur par ID
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 *       - in: query
 *         name: includeBooks
 *         schema: { type: boolean, default: false }
 *     responses:
 *       200:
 *         description: Auteur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Auteur non trouvé
 */

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Créer un nouvel auteur (admin uniquement)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorCreate'
 *     responses:
 *       201:
 *         description: Auteur créé
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Accès refusé (non admin)
 */

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Mettre à jour un auteur (admin)
 *     tags: [Authors]
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
 *             $ref: '#/components/schemas/AuthorUpdate'
 *     responses:
 *       200:
 *         description: Auteur mis à jour
 *       404:
 *         description: Auteur non trouvé
 *       403:
 *         description: Accès refusé
 */

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Supprimer un auteur (admin)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 *     responses:
 *       200:
 *         description: Auteur supprimé
 *       404:
 *         description: Auteur non trouvé
 *       409:
 *         description: Impossible de supprimer (livres associés)
 *       403:
 *         description: Accès refusé
 */

// GET : user + admin
router.get('/', authorize(['user', 'admin']), getAllAuthors);
router.get('/:id', authorize(['user', 'admin']), getAuthorById);

// POST, PUT, DELETE : admin uniquement
router.post('/', authorize(['admin']), validate(schema.authorSchema), createAuthor);
router.put('/:id', authorize(['admin']), validate(schema.authorUpdateSchema), replaceAuthor);
router.delete('/:id', authorize(['admin']), deleteAuthor);

module.exports = router;