const swaggerJsDoc = require('swagger-jsdoc');

/**
 * Configuration Swagger / OpenAPI 3.0
 * Documentation professionnelle pour l'API Bibliothèque
 * Ynov M2 Développement – Web Services
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bibliothèque - Ynov M2 Web Services',
      version: '1.0.0',
      description: `
## Description
API RESTful de gestion de bibliothèque avec :
- Authentification JWT
- Gestion des **auteurs** et **livres**
- Rôles : **user** / **admin**
- Pagination, filtres, recherche
- Persistance avec **MongoDB Atlas**
- Déploiement sur **Render**

## Déploiement
- **Backend** : [https://library-api.onrender.com](https://library-api.onrender.com)
- **Documentation** : [https://library-api.onrender.com/docs](https://library-api.onrender.com/docs)
- **Base de données** : MongoDB Atlas (cloud)

## Sécurité
- JWT Bearer Token requis pour les routes protégées
- Admin requis pour : création, modification, suppression
      `,
      contact: {
        name: 'Casis',
        url: 'https://github.com/ton-pseudo'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://library-api.onrender.com',
        description: 'Serveur de production (Render)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT (ex: Bearer eyJhbGciOi...)'
        }
      },
      schemas: {
        // --- Auteur ---
        Author: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '671f8a1b2c3d4e5f6a7b8c9d'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Victor Hugo'
            },
            birthYear: {
              type: 'integer',
              minimum: -3000,
              maximum: 2100,
              example: 1802
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-04-05T10:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            },
            books: {
              type: 'array',
              items: { $ref: '#/components/schemas/Book' }
            }
          }
        },
        AuthorCreate: {
          type: 'object',
          required: ['name', 'birthYear'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Victor Hugo'
            },
            birthYear: {
              type: 'integer',
              minimum: -3000,
              maximum: 2100,
              example: 1802
            }
          }
        },

        // --- Livre ---
        Book: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '671f8a1b2c3d4e5f6a7b8c9e'
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              example: 'Les Misérables'
            },
            year: {
              type: 'integer',
              minimum: -3000,
              maximum: 2100,
              example: 1862
            },
            authorId: {
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$',
              example: '671f8a1b2c3d4e5f6a7b8c9d'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        BookCreate: {
          type: 'object',
          required: ['title', 'year', 'authorId'],
          properties: {
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              example: 'Les Misérables'
            },
            year: {
              type: 'integer',
              minimum: -3000,
              maximum: 2100,
              example: 1862
            },
            authorId: {
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$',
              description: 'ObjectId MongoDB de l\'auteur (24 caractères hexadécimaux)',
              example: '671f8a1b2c3d4e5f6a7b8c9d'
            }
          }
        },

        // --- Erreurs ---
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Chemins vers les fichiers contenant les annotations JSDoc
  apis: [
    './routes/auth.routes.js',
    './routes/authors.routes.js',
    './routes/books.routes.js'
  ]
};

// Génère la spécification
const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;