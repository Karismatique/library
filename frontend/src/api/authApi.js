// src/api/authApi.js
// Fonctions d'authentification (login / register). Utilise l'instance
// `client` (qui injecte le token si présent).
import client from './client';

const API_URL = '/auth';

export const login = (data) => client.post(`${API_URL}/login`, data);
export const register = (data) => client.post(`${API_URL}/register`, data);