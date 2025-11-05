// src/api/authorsApi.js
// API client pour les auteurs. Fonctions utilitaires pour l'appel des routes
// backend relatives aux auteurs.
import client from './client';

const API_URL = '/authors';

export const getAuthors = (params = {}) => client.get(API_URL, { params });
export const getAuthor = (id, includeBooks = false) =>
  client.get(`${API_URL}/${id}`, { params: { includeBooks } });

export const createAuthor = (author) => client.post(API_URL, author);

export const updateAuthor = async (id, author) => {
  const res = await client.put(`${API_URL}/${id}`, author);
  return res.data;
};

export const deleteAuthor = (id) => client.delete(`${API_URL}/${id}`);