// src/components/BookForm.jsx
import { useEffect, useState } from "react";

export default function BookForm({
  onCreate,
  onUpdate,
  editingBook,
  onCancelEdit,
  authors = [], // ← Liste des auteurs (passée depuis BooksPage)
}) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setYear(editingBook.year);
      setAuthorId(editingBook.authorId); // ← string ObjectId
    } else {
      setTitle("");
      setYear("");
      setAuthorId("");
    }
  }, [editingBook]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Le titre est requis.");
      return;
    }

    // Construction des données :
    // - Création : authorId requis
    // - Edition : on n'envoie PAS authorId (ne pas modifier l'auteur)
    const data = {
      title: title.trim(),
      year: Number(year),
    };

    if (!editingBook) {
      if (!authorId) {
        alert("Veuillez choisir un auteur.");
        return;
      }
      data.authorId = authorId;
    }

    if (editingBook) {
      // Lors de l'édition, n'envoyer que les champs modifiables
      onUpdate({ id: editingBook._id, ...data });
    } else {
      onCreate(data);
    }

    // Reset
    setTitle("");
    setYear("");
    setAuthorId("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-100 p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        {editingBook ? "Modifier le livre" : "Ajouter un livre"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Titre */}
        <input
          type="text"
          placeholder="Titre du livre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="input input-bordered w-full"
        />

        {/* Année */}
        <input
          type="number"
          placeholder="Année"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="input input-bordered w-full"
          min="-3000"
          max="2100"
        />

        {/* Auteur (SELECT) */}
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          required
          className="select select-bordered w-full"
        >
          <option value="">Choisir un auteur</option>
          {authors.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-success"
        >
          {editingBook ? "Mettre à jour" : "Ajouter"}
        </button>
        {editingBook && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn btn-ghost"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}