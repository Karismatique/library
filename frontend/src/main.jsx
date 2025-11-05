import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import BooksPage from "./pages/BooksPage";
import AuthorsPage from "./pages/AuthorsPage";
import AuthPage from "./pages/AuthPage"; // ✅ à ne pas oublier !
import "./styles/main.css";

// Entrée principale du frontend. Routes :
// - /auth : page publique d'authentification
// - / (App) : layout protégé qui contient les pages /books et /authors
// Note : /auth doit rester en dehors du layout protégé pour éviter les boucles
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route publique pour l'auth */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Routes protégées incluses dans le layout App */}
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/books" replace />} /> {/* Redirection par défaut */}
          <Route path="books" element={<BooksPage />} />
          <Route path="authors" element={<AuthorsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
