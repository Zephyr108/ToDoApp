import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [templates, setTemplates] = useState([]); // lista szablonów
  const [newTitle, setNewTitle] = useState('');   // nowy tytuł
  const [err, setErr] = useState('');             // błąd

  // pobierz szablony z serwera
  const fetchTemplates = () => {
    fetch('http://localhost:5000/api/tasks/templates')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(() => setErr('Błąd pobierania szablonów'));
  };

  useEffect(() => {
    fetchTemplates(); // pobierz przy starcie
  }, []);

  // dodaj nowy szablon
  const handleAdd = async e => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/tasks/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });
      if (!res.ok) throw new Error('Błąd dodawania');
      setNewTitle('');
      fetchTemplates();
    } catch {
      setErr('Nie udało się dodać szablonu');
    }
  };

  // usuń szablon
  const handleDelete = async id => {
    try {
      await fetch(`http://localhost:5000/api/tasks/templates/${id}`, {
        method: 'DELETE'
      });
      fetchTemplates();
    } catch {
      setErr('Nie udało się usunąć szablonu');
    }
  };

  return (
    <div className="admin-panel" style={{ maxWidth: '600px', margin: '2em auto' }}>
      <h2>🛠️ Panel administratora</h2>

      {/* formularz dodawania szablonu */}
      <form onSubmit={handleAdd} className="admin-form">
        <input
            type="text"
            placeholder="Nowy szablon"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            required
            className="admin-input"
        />
        <div style={{ textAlign: 'center', marginTop: '0.7em' }}>
            <button type="submit" className="admin-add-button">Dodaj</button>
        </div>
      </form>

      {/* komunikat o błędzie */}
      {err && <div className="error">{err}</div>}

      {/* lista szablonów */}
      <ul>
        {templates.map(t => (
          <li key={t._id} style={{ marginBottom: '0.5em' }}>
            {t.title}
            <button
              onClick={() => handleDelete(t._id)}
              style={{ marginLeft: '1em', color: 'white', backgroundColor: 'crimson', border: 'none', padding: '0.3em 0.7em' }}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
