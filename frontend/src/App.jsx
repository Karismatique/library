import { NavLink, Outlet, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Évite flash
  const navigate = useNavigate();

  // Vérifie le token au montage
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        // Token expiré ?
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserRole(null);
        } else {
          setIsAuthenticated(true);
          setUserRole(decoded.role || "user");
        }
      } catch (err) {
        console.warn("Token invalide", err);
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

  // Chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Non connecté → redirection
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const isAdmin = userRole === "admin";

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Library</a>
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

          {/* Badge rôle */}
          {isAdmin && (
            <div className="badge badge-success badge-sm">Admin</div>
          )}

          <button onClick={handleLogout} className="btn btn-error btn-sm">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            {/* Passe isAdmin aux pages enfants */}
            <Outlet context={{ isAdmin, userRole }} />
          </div>
        </div>
      </div>
    </div>
  );
}