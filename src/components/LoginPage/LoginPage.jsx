import React from "react";
import "./LoginPage.css";

export default function Login({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // Simuler une connexion
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" placeholder="Nom d'utilisateur" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Mot de passe" required />
          </div>
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
}
