// src/pages/AuthPage.jsx
// Page d'authentification. Gère les modes : connexion / inscription.
// Stocke le token renvoyé par le backend dans localStorage sous `token`.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/authApi";

export default function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        const res = await login({ email, password });
        localStorage.setItem("token", res.data.token);
        navigate("/books", { replace: true });
      } else if (mode === "signup") {
        if (password !== repeatPassword) {
          setError("Les mots de passe ne correspondent pas.");
          return;
        }
        await register({ email, password });
        setMessage("Compte créé ! Connectez-vous.");
        setMode("signin");
        setPassword("");
        setRepeatPassword("");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur de connexion.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-4">
            {mode === "signin" ? "Connexion" : "Inscription"}
          </h2>

          <div className="tabs tabs-boxed mb-4">
            <a
              className={`tab ${mode === "signin" ? "tab-active" : ""}`}
              onClick={() => setMode("signin")}
            >
              Connexion
            </a>
            <a
              className={`tab ${mode === "signup" ? "tab-active" : ""}`}
              onClick={() => setMode("signup")}
            >
              Inscription
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === "signup" && (
              <input
                type="password"
                placeholder="Répéter le mot de passe"
                className="input input-bordered w-full"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
            )}
            <button type="submit" className="btn btn-primary w-full">
              {mode === "signin" ? "Se connecter" : "Créer un compte"}
            </button>
          </form>

          {message && <div className="alert alert-success mt-3">{message}</div>}
          {error && <div className="alert alert-error mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
}