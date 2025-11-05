// backend/index.js
// Point d'entrée du serveur Express
// Ynov M2 Développement – Web Services – Séance VI : Déploiement & Documentation
require('dotenv').config(); // Variables d'environnement (Atlas, JWT, PORT)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); 

// --- ROUTES ---
const authRouter = require('./routes/auth.routes');
const authorsRouter = require('./routes/authors.routes');
const booksRouter = require('./routes/books.routes');
const errorHandler = require('./middlewares/error.middleware');
const authenticate = require('./middlewares/auth.middleware');

const app = express();

// --- MONGO DB ATLAS ---
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connecté à MongoDB Atlas'))
  .catch(err => {
    console.error('Erreur connexion MongoDB:', err.message);
    process.exit(1);
  });

// --- CORS (Frontend Vite) ---
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// --- SWAGGER UI (Documentation Pro) ---
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true
    },
    customSiteTitle: 'API Bibliothèque - Ynov M2',
    customfavIcon: '/favicon.ico'
  })
);

// --- MIDDLEWARES GLOBAUX ---
app.use(express.json());

// --- ROUTES PUBLIQUES (Auth) ---
app.use('/api/auth', authRouter); // register & login

// --- AUTH MIDDLEWARE (JWT) ---
// Toutes les routes suivantes nécessitent un token valide
app.use(authenticate);

// --- ROUTES PROTÉGÉES ---
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route ${req.method} ${req.originalUrl} non trouvée`,
    available: ['/api/auth', '/api/authors', '/api/books', '/docs']
  });
});

// --- GESTION D'ERREURS ---
app.use(errorHandler);

// --- DÉMARRAGE SERVEUR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation : http://localhost:${PORT}/docs`);
  console.log(`Environnement : ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB : ${MONGO_URI.includes('mongodb.net') ? 'Atlas (cloud)' : 'Local'}`);
});