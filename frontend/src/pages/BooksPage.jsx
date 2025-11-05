// src/pages/BooksPage.jsx
// Page principale pour la gestion des livres.
// - Affiche la liste, les filtres et le formulaire (si admin).
// - Utilise `booksApi` et `authorsApi` pour charger / modifier les données.
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getBooks, createBook, updateBook, deleteBook } from "../api/booksApi";
import { getAuthors } from "../api/authorsApi"; // ← pour le <select>
import BookTable from "../components/BookTable";
import BookForm from "../components/BookForm";
import Pagination from "../components/Pagination";

export default function BooksPage() {
  const { isAdmin } = useOutletContext();
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]); // ← pour <select>
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({ author: "", q: "" });
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- CHARGER LES AUTEURS (pour <select>) ---
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await getAuthors({ limit: 100 }); // tous les auteurs
        setAuthors(res.data);
      } catch (err) {
        console.error("Erreur chargement auteurs:", err);
      }
    };
    fetchAuthors();
  }, []);

  // --- CHARGER LES LIVRES ---
  const fetchBooks = async () => {
    try {
      const res = await getBooks({
        page,
        limit,
        author: filters.author || undefined,
        q: filters.q || undefined,
      });
      setBooks(res.data);
      setError(null);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/auth");
      } else if (status === 403) {
        setError("Accès refusé : vous n'avez pas les droits.");
      } else {
        setError("Erreur lors du chargement des livres.");
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, filters]);

  // --- CRÉER ---
  const handleCreate = async (book) => {
    try {
      await createBook(book);
      setEditingBook(null);
      fetchBooks();
      alert("Livre ajouté avec succès !");
    } catch (err) {
      setError("Erreur lors de la création.");
    }
  };

  // --- MODIFIER ---
  const handleUpdate = async (book) => {
    try {
      // Book peut venir du formulaire (book.id) ou d'autres sources (book._id)
      const payload = {
        id: book.id || book._id,
        title: book.title,
        year: book.year,
      };
      // N'envoyer authorId que s'il est présent (création -> requis, édition -> optionnel)
      if (book.authorId) payload.authorId = book.authorId;

      await updateBook(payload);
      setEditingBook(null);
      fetchBooks();
      alert("Livre mis à jour !");
    } catch (err) {
      setError("Erreur lors de la mise à jour.");
    }
  };

  // --- SUPPRIMER ---
  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce livre ?")) return;
    try {
      await deleteBook(id);
      fetchBooks();
      alert("Livre supprimé !");
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  // --- NOM DE L'AUTEUR (dans le tableau) ---
  const getAuthorName = (authorId) => {
    const author = authors.find(a => a._id === authorId);
    return author ? author.name : "Auteur inconnu";
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Gestion des Livres
      </h1>

      {/* FILTRES */}
      <div className="bg-base-200 p-4 rounded-lg mb-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            placeholder="Filtrer par ID auteur (optionnel)"
            value={filters.author}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* FORMULAIRE ADMIN */}
      {isAdmin && (
        <div className="mb-8">
          <BookForm
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            editingBook={editingBook}
            onCancelEdit={() => setEditingBook(null)}
            authors={authors} // ← PASSÉ AU FORMULAIRE
          />
        </div>
      )}

      {/* ERREUR */}
      {error && (
        <div className="alert alert-error shadow-lg mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* TABLEAU */}
      <div className="bg-base-100 rounded-lg shadow overflow-hidden mb-6">
        <BookTable
          books={books}
          getAuthorName={getAuthorName}
          onEdit={isAdmin ? setEditingBook : null}
          onDelete={isAdmin ? handleDelete : null}
        />
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center">
        <Pagination page={page} limit={limit} onPageChange={setPage} />
      </div>
    </div>
  );
}