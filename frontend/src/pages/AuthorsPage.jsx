// src/pages/AuthorsPage.jsx
// Page de gestion des auteurs : liste, filtres, formulaire (si admin).
// Utilise `authorsApi` pour les appels réseau.
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from "../api/authorsApi";
import AuthorTable from "../components/AuthorTable";
import AuthorForm from "../components/AuthorForm";
import Pagination from "../components/Pagination";

export default function AuthorsPage() {
  const { isAdmin } = useOutletContext();
  const [authors, setAuthors] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({ name: "" });
  const [includeBooks, setIncludeBooks] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAuthors = async () => {
    try {
      const res = await getAuthors({
        page,
        limit,
        name: filters.name || undefined,
        includeBooks: includeBooks ? "true" : undefined,
      });
      setAuthors(res.data);
      setError(null);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/auth");
      } else if (status === 403) {
        setError("Accès refusé : vous n'avez pas les droits.");
      } else {
        setError("Erreur lors du chargement des auteurs.");
      }
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [page, limit, filters, includeBooks]);

  const handleCreate = async (author) => {
    try {
      await createAuthor(author);
      setEditingAuthor(null);
      fetchAuthors();
    } catch {
      setError("Erreur lors de la création.");
    }
  };

  const handleUpdate = async (author) => {
    await updateAuthor(author._id, author); // ← _id
  };

  const handleDelete = async (id) => {
    await deleteAuthor(id); // ← _id
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Auteurs</h2>

      <div className="flex gap-3 items-center mb-4">
        <input
          placeholder="Filtrer par nom"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="input input-bordered w-2/3"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeBooks}
            onChange={(e) => setIncludeBooks(e.target.checked)}
            className="checkbox"
          />
          <span>Inclure les livres</span>
        </label>
      </div>

      {isAdmin && (
        <AuthorForm
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editingAuthor={editingAuthor}
          onCancelEdit={() => setEditingAuthor(null)}
        />
      )}

      {error && <div className="alert alert-error shadow-lg mb-4">{error}</div>}

      <AuthorTable
        authors={authors}
        includeBooks={includeBooks}
        onEdit={isAdmin ? setEditingAuthor : null}
        onDelete={isAdmin ? handleDelete : null}
      />

      <div className="mt-6">
        <Pagination page={page} limit={limit} onPageChange={setPage} />
      </div>
    </div>
  );
}