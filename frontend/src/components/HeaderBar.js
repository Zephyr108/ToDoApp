import React from "react";

export default function HeaderBar({ user, onEditAccount, onLogout }) {
  return (
    // pasek górny
    <div className="header-bar" style={{ justifyContent: "flex-start" }}>
      <div className="user-actions">
        {/* przycisk edycji konta */}
        <button onClick={onEditAccount} title="Edytuj konto">⚙️ Edytuj konto</button>
        {/* przycisk wylogowania */}
        <button onClick={onLogout} title="Wyloguj się">🚪 Wyloguj</button>
      </div>
    </div>
  );
}
