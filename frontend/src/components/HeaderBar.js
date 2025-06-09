import React from "react";

export default function HeaderBar({ user, onEditAccount, onLogout }) {
  return (
    <div className="header-bar" style={{justifyContent:"flex-start"}}>
      <div className="user-actions">
        <button onClick={onEditAccount} title="Edytuj konto">⚙️ Edytuj konto</button>
        <button onClick={onLogout} title="Wyloguj się">🚪 Wyloguj</button>
      </div>
    </div>
  );
}