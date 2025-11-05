import { useState } from "react";
import "../styles/authform.scss"; // 🔥 ton style SCSS existant

// AuthForm.jsx
// Composant de formulaire pour la connexion / inscription / reset.
// Props :
//  - onSignIn({email,password})
//  - onSignUp({email,password})
//  - onResetPassword({email})
export default function AuthForm({ onSignIn, onSignUp, onResetPassword }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "signin") {
      onSignIn?.({ email, password });
    } else if (mode === "signup") {
      if (password !== repeatPassword) {
        alert("Les mots de passe ne correspondent pas !");
        return;
      }
      onSignUp?.({ email, password });
    } else {
      onResetPassword?.({ email });
    }

    // Reset des champs
    setPassword("");
    setRepeatPassword("");
  };

  return (
    <div className="container">
      <header>
        <div
          className={
            "header-headings " +
            (mode === "signin"
              ? "sign-in"
              : mode === "signup"
              ? "sign-up"
              : "forgot")
          }
        >
          <span>Connexion à votre compte</span>
          <span>Créer un compte</span>
          <span>Réinitialiser le mot de passe</span>
        </div>
      </header>

      <ul className="options">
        <li
          className={mode === "signin" ? "active" : ""}
          onClick={() => setMode("signin")}
        >
          Connexion
        </li>
        <li
          className={mode === "signup" ? "active" : ""}
          onClick={() => setMode("signup")}
        >
          Inscription
        </li>
        <li
          className={mode === "reset" ? "active" : ""}
          onClick={() => setMode("reset")}
        >
          Mot de passe
        </li>
      </ul>

      <form className="account-form" onSubmit={handleSubmit}>
        <div
          className={
            "account-form-fields " +
            (mode === "signin"
              ? "sign-in"
              : mode === "signup"
              ? "sign-up"
              : "forgot")
          }
        >
          <input
            id="email"
            name="email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {mode !== "reset" && (
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}
          {mode === "signup" && (
            <input
              id="repeat-password"
              name="repeat-password"
              type="password"
              placeholder="Répéter le mot de passe"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              required
            />
          )}
        </div>
        <button className="btn-submit-form" type="submit">
          {mode === "signin"
            ? "Se connecter"
            : mode === "signup"
            ? "Créer un compte"
            : "Réinitialiser"}
        </button>
      </form>

      <footer>
        <a
          href="https://dribbble.com/shots/5041581-Zenbu-Sign-in-up-forgot-page"
          target="_blank"
        >
          Original design with animations by Zenbu
        </a>
      </footer>
    </div>
  );
}
