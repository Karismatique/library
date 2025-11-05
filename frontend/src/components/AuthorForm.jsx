import { useEffect, useState } from "react";

// AuthorForm.jsx
// Formulaire pour créer ou éditer un auteur.
// Props :
//  - onCreate(author)
//  - onUpdate(author)
//  - editingAuthor : objet auteur en cours d'édition
//  - onCancelEdit : annuler l'édition
export default function AuthorForm({
  onCreate,
  onUpdate,
  editingAuthor,
  onCancelEdit,
}) {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");

  useEffect(() => {
    if (editingAuthor) {
      setName(editingAuthor.name);
      setBirthYear(editingAuthor.birthYear);
    } else {
      setName("");
      setBirthYear("");
    }
  }, [editingAuthor]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, birthYear: Number(birthYear) };
    if (editingAuthor) {
      onUpdate({ ...editingAuthor, ...data });
    } else {
      onCreate(data);
    }
    setName("");
    setBirthYear("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
      <input
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="input input-bordered w-1/2"
      />
      <input
        type="number"
        placeholder="Année de naissance"
        value={birthYear}
        onChange={(e) => setBirthYear(e.target.value)}
        required
        className="input input-bordered w-1/4"
      />
      <div className="flex items-center gap-2">
        <button type="submit" aria-label={editingAuthor ? 'Mettre à jour l\'auteur' : 'Ajouter un auteur'} className="btn btn-success btn-md">
          <span className="mr-2">+</span>
          {editingAuthor ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {editingAuthor && (
          <button type="button" onClick={onCancelEdit} className="btn btn-ghost btn-sm">Annuler</button>
        )}
      </div>
    </form>
  );
}
