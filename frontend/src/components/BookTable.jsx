// src/components/BookTable.jsx
// Table simple pour afficher la liste des livres.
// Props :
//  - books : tableau des livres (objets avec _id, title, year, authorId)
//  - onEdit(book) : appelé quand on clique sur Edit
//  - onDelete(id) : appelé quand on clique sur Delete
//  - getAuthorName(authorId) : fonction optionnelle pour afficher le nom de l'auteur
export default function BookTable({ books = [], onEdit, onDelete, getAuthorName }) {
  return (
    <table className="table table-zebra w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Titre</th>
          <th>Année</th>
          <th>Auteur</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book._id}> {/* ← _id */}
            <th>{book._id}</th>
            <td>{book.title}</td>
            <td>{book.year}</td>
            <td>
              {getAuthorName
                ? getAuthorName(book.authorId) // ← passe ObjectId string
                : book.authorId}
            </td>
            <td className="flex gap-2">
              <button className="btn btn-sm btn-outline" onClick={() => onEdit(book)}>Edit</button>
              <button className="btn btn-sm btn-error" onClick={() => onDelete(book._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}