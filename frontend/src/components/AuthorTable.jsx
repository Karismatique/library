// AuthorTable.jsx
// Composant d'affichage pour la liste des auteurs.
// Props :
//  - authors : tableau d'auteurs
//  - includeBooks : boolean, si true affiche la colonne "Livres"
//  - onEdit(author) et onDelete(id)
export default function AuthorTable({
  authors,
  includeBooks,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Année</th>
            {includeBooks && <th>Livres</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.length === 0 ? (
            <tr>
              <td colSpan={includeBooks ? 5 : 4}>Aucun auteur trouvé.</td>
            </tr>
          ) : (
            authors.map((author) => (
              <tr key={author._id}>
                <td>{author._id}</td>
                <td>{author.name}</td>
                <td>{author.birthYear}</td>
                {includeBooks && (
                  <td>
                    {author.books && author.books.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {author.books.map((b) => (
                          <span key={b.id} className="badge badge-outline">{b.title}</span>
                        ))}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                )}
                <td className="space-x-2">
                  <button className="btn btn-sm btn-ghost" onClick={() => onEdit(author)}>✏️</button>
                  <button className="btn btn-sm btn-error" onClick={() => onDelete(author._id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
