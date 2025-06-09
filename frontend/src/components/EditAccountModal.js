import React, { useState } from "react";

export default function EditAccountModal({ user, token, onClose, onUpdate, onDelete }) {
  const [login, setLogin] = useState(user.username || ""); // nowy login
  const [currentPassword, setCurrentPassword] = useState(""); // stare hasło
  const [newPassword, setNewPassword] = useState(""); // nowe hasło
  const [error, setError] = useState(""); // komunikat błędu
  const [mode, setMode] = useState("edit"); // tryb działania
  const [loading, setLoading] = useState(false); // czy trwa operacja

  // obsługa edycji konta
  const handleEdit = async e => {
    e.preventDefault();
    setError("");
    if (!login.trim()) return setError("Login nie może być pusty");
    if (!currentPassword) return setError("Wpisz obecne hasło");
    setLoading(true);
    try {
      await onUpdate({ login, currentPassword, newPassword });
      setMode("changed");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Błąd aktualizacji konta");
    }
    setLoading(false);
  };

  // przejście do potwierdzenia usunięcia
  const handleDelete = async () => {
    setMode("confirmDelete");
  };

  // potwierdzenie hasła i usunięcie konta
  const reallyDelete = async () => {
    setError("");
    if (!window.confirm("Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć!")) return;
    setLoading(true);
    try {
      await onDelete({ currentPassword });
      setCurrentPassword("");
      setMode("deleted");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Błąd usuwania konta");
    }
    setLoading(false);
  };

  // potwierdzenie zmiany danych
  if (mode === "changed") return (
    <div className="edit-modal-bg">
      <div className="edit-modal">
        <button className="close-btn-modal" onClick={onClose} title="Zamknij">×</button>
        <div style={{marginTop:"2.2em", textAlign: "center"}}>
          <h3 style={{color:"#18b86a"}}>Dane konta zostały zmienione!</h3>
        </div>
      </div>
    </div>
  );

  // potwierdzenie chęci usunięcia
  if (mode === "confirmDelete") return (
    <div className="edit-modal-bg">
      <div className="edit-modal">
        <button className="close-btn-modal" onClick={onClose} title="Zamknij">×</button>
        <h3>Czy na pewno chcesz usunąć konto?</h3>
        <p style={{marginBottom:"1em"}}>Tej operacji nie można cofnąć.</p>
        <button className="danger-btn" onClick={() => setMode("deletePassword")}>Tak, usuń konto</button>
        <button style={{marginTop:"0.6em"}} onClick={onClose}>Anuluj</button>
      </div>
    </div>
  );

  // podanie hasła do usunięcia
  if (mode === "deletePassword") return (
    <div className="edit-modal-bg">
      <div className="edit-modal">
        <button className="close-btn-modal" onClick={onClose} title="Zamknij">×</button>
        <h3>Podaj hasło aby usunąć konto</h3>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          placeholder="Obecne hasło"
        />
        {error && <div className="error">{error}</div>}
        <button className="danger-btn" onClick={reallyDelete} disabled={loading}>Usuń konto</button>
        <button style={{marginTop:"0.6em"}} onClick={onClose}>Anuluj</button>
      </div>
    </div>
  );

  // konto usunięte
  if (mode === "deleted") return (
    <div className="edit-modal-bg">
      <div className="edit-modal">
        <button className="close-btn-modal" onClick={onClose} title="Zamknij">×</button>
        <div style={{marginTop:"2.2em", textAlign: "center"}}>
          <h3 style={{color:"#ff6d6d"}}>Konto zostało usunięte.</h3>
        </div>
      </div>
    </div>
  );

  // domyślny widok edycji konta
  return (
    <div className="edit-modal-bg" onClick={e => { if (e.target.className === "edit-modal-bg") onClose(); }}>
      <div className="edit-modal">
        <button className="close-btn-modal" onClick={onClose} title="Zamknij">×</button>
        <h3>Edycja konta</h3>
        <form onSubmit={handleEdit}>
          <label>Login:</label>
          <input type="text" value={login} onChange={e => setLogin(e.target.value)} />

          <label>Nowe hasło (opcjonalnie):</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Zostaw puste jeśli nie zmieniasz"
          />

          <label>Obecne hasło (wymagane):</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>Zapisz zmiany</button>
        </form>

        <button className="danger-btn" onClick={handleDelete} disabled={loading}>
          Usuń konto
        </button>
      </div>
    </div>
  );
}
