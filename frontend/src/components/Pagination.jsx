// Pagination.jsx
// Composant simple de pagination utilisé par les pages qui affichent des listes.
// Props :
//  - page (number) : numéro de page courant (1-based)
//  - limit (number) : nombre d'éléments par page (non utilisé visuellement ici
//                     mais conservé pour compatibilité)
//  - onPageChange (function) : callback appelé avec le nouveau numéro de page
// Remarques :
//  - Les boutons "Précédent" et "Suivant" appellent onPageChange avec page-1
//    ou page+1. Le bouton précédent est désactivé si on est sur la première page.
//  - Le composant est volontairement minimal : la logique de calcul du nombre
//    total de pages et la désactivation du bouton "Suivant" doivent être gérées
//    par le parent si nécessaire.
export default function Pagination({ page, limit, onPageChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        className="btn btn-sm btn-pagination btn-md"
        aria-label="Précédent"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ⬅️ Précédent
      </button>
      <span className="muted">Page {page}</span>
      <button
        className="btn btn-sm btn-pagination btn-md"
        aria-label="Suivant"
        onClick={() => onPageChange(page + 1)}
      >
        Suivant ➡️
      </button>
    </div>
  );
}