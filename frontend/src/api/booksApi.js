// src/api/booksApi.js
// Fonctions d'accès API pour les livres (utilise l'instance `client`).
// Les chemins sont relatifs à la base configurée dans `client` (/api).
import client from './client';

const API_URL = "/books";

export const getBooks = (params = {}) => client.get(API_URL, { params });
export const getBook = (id) => client.get(`${API_URL}/${id}`);

export const createBook = (book) => client.post(API_URL, book);

export const updateBook = async (book) => {
  // book attendu : { id, title?, year? }
  const { id, ...data } = book;
  const res = await client.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteBook = (id) => client.delete(`${API_URL}/${id}`);