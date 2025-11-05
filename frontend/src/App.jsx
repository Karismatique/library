// src/App.jsx
import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Vérification du token au montage
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserRole(null);
        } else {
          setIsAuthenticated(true);
          setUserRole(decoded.role || "user");
        }
      } catch (err) {
        console.warn("Token invalide ou corrompu", err);
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/auth", { replace: true });
  };

  // Écran de chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const isAdmin = userRole === "admin";

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md sticky top-0 z-10">
        <div className="flex-1">
          <NavLink to="/books" className="btn btn-ghost text-xl font-bold">
            Library
          </NavLink>
        </div>
        <div className="flex-none gap-2">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`
            }
          >
            Livres
          </NavLink>
          <NavLink
            to="/authors"
            className={({ isActive }) =>
              `btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`
            }
          >
            Auteurs
          </NavLink>

          {/* Badge Admin */}
          {isAdmin && (
            <div className="badge badge-success badge-sm">Admin</div>
          )}

          <button onClick={handleLogout} className="btn btn-error btn-sm">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto p-6">
        <div className="card bg-base-100 shadow-lg rounded-xl">
          <div className="card-body p-6">
            {/* Passe isAdmin et userRole aux pages enfants */}
            <Outlet context={{ isAdmin, userRole }} />
          </div>
        </div>
      </div>

      {/* Footer (optionnel) */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-8">
        <div>
          <p className="text-sm">
            © 2025 Ynov M2 Web Services – API Bibliothèque
          </p>
        </div>
      </footer>
    </div>
  );
}