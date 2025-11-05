// src/api/client.js
// Instance axios partagée pour le frontend.
// - Injecte le JWT stocké dans localStorage dans Authorization: Bearer <token>
// - Fournit un point central pour gérer les erreurs 401/403
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor requête : attache le token si présent
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // On attache le token; on ne loggue pas le secret entier
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor réponse : gestion centrale des erreurs d'auth
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token invalide / expiré : on supprime le token. La redirection
      // vers /auth est gérée côté UI (ex : pages qui catchent l'erreur).
      console.warn("Token invalide ou expiré (client)");
      localStorage.removeItem("token");
    }

    if (status === 403) {
      error.message = "Accès refusé : vous n'avez pas les droits nécessaires.";
    }

    return Promise.reject(error);
  }
);

export default client;