// Middleware de gestion centralisée des erreurs.
// Capture les exceptions lancées dans les handlers et renvoie une réponse
// JSON structurée contenant le message d'erreur et un code HTTP approprié.
function errorHandler(err, req, res, next) {
    // Log serveur pour debug
    console.error('Erreur capturée :', err);
    const status = err.status || 500;
    res.status(status).json({
        error: err.name || 'ServerError',
        message: err.message || 'Une erreur interne est survenue',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
    });
}

module.exports = errorHandler;