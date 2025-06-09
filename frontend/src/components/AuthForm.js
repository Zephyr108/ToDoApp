import React, { useState } from 'react';

export default function AuthForm({ onAuth }) {
  const [username, setUsername] = useState('');     // login
  const [password, setPassword] = useState('');     // hasło
  const [isRegister, setIsRegister] = useState(false); // tryb: rejestracja/logowanie
  const [error, setError] = useState('');           // błąd

  // wysyłanie formularza
  const submit = async e => {
    e.preventDefault();
    setError('');

    // prosta walidacja
    if (username.length < 3 || password.length < 3) {
      setError('Login i hasło muszą mieć min. 3 znaki');
      return;
    }

    try {
      await onAuth(username, password, isRegister); // logowanie lub rejestracja
    } catch (err) {
      setError('Błąd logowania/rejestracji');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isRegister ? "Rejestracja" : "Logowanie"}</h2>

      {/* formularz logowania/rejestracji */}
      <form onSubmit={submit}>
        <input
          placeholder="Login"
          value={username}
          onChange={e => setUsername(e.target.value)}
          minLength={3}
          required
          type="text"
        />
        <input
          placeholder="Hasło"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={3}
          required
        />
        <button type="submit">{isRegister ? "Zarejestruj" : "Zaloguj"}</button>
      </form>

      {/* przycisk do zmiany trybu */}
      <button className="switch-btn" onClick={() => setIsRegister(x => !x)}>
        {isRegister ? "Mam konto – zaloguj się" : "Nie masz konta? Zarejestruj się"}
      </button>

      {/* komunikat o błędzie */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
