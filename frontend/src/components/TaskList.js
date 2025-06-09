import React, { useState, useEffect } from 'react';
import CalendarView from './CalendarView';

// aktualna data w formacie do <input type="datetime-local" />
function getLocalISOStringNow() {
  const now = new Date();
  now.setSeconds(0, 0); // zeruj sekundy i ms
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function TaskList({ api, token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [err, setErr] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [sortMode, setSortMode] = useState('deadline');
  const [sortOrder, setSortOrder] = useState({
    deadline: true,
    name: true,
    done: true
  });

  // pobierz zadania
  const load = async () => {
    try {
      const res = await api.getTasks(token);
      setTasks(res.data);
    } catch {
      setErr('Błąd pobierania zadań');
    }
  };

  // pobierz szablony zadań
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks/templates')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(() => setErr('Błąd ładowania szablonów'));
  }, []);

  // pobierz zadania przy starcie
  useEffect(() => { load(); }, []);

  // dodaj nowe zadanie
  const addTask = async e => {
    e.preventDefault();
    setErr('');
    if (!title.trim()) return setErr('Podaj tytuł zadania');
    try {
      await api.createTask(token, title, deadline);
      setTitle('');
      setDeadline('');
      load();
    } catch {
      setErr('Błąd dodawania zadania');
    }
  };

  // zmień status zadania (zrobione/niezrobione)
  const toggle = async t => {
    try {
      await api.updateTask(token, t._id, { done: !t.done, title: t.title });
      load();
    } catch {
      setErr('Błąd edycji zadania');
    }
  };

  // usuń wszystkie zrobione zadania
  const deleteAllDone = async () => {
    const doneTasks = tasks.filter(t => t.done);
    try {
      await Promise.all(doneTasks.map(t => api.deleteTask(token, t._id)));
      load();
    } catch {
      setErr('Błąd usuwania wykonanych zadań');
    }
  };

  const nowISO = getLocalISOStringNow();
  const today = nowISO.slice(0, 10);
  const selectedDate = deadline?.slice(0, 10);
  const minDeadline = selectedDate === today ? nowISO : nowISO;

  return (
    <div className="tasklist">
      <h2>Twoje zadania</h2>

      {/* formularz dodawania zadania */}
      <form onSubmit={addTask}>
        <div className="task-input-group">
          <input
            className="task-input"
            placeholder="Nowe zadanie"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <select
            className="task-select"
            onChange={e => setTitle(e.target.value)}
          >
            <option value="">Wybierz z szablonu...</option>
            {templates.map(t => (
              <option key={t._id} value={t.title}>{t.title}</option>
            ))}
          </select>
        </div>

        <input
          type="datetime-local"
          className="task-deadline"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          min={minDeadline}
        />

        <button type="submit" style={{ width: '100%', margin: '0.7em 0', fontSize: '1.13em', padding: '0.7em 0' }}>
          Dodaj
        </button>
      </form>

      {/* usuń wykonane zadania */}
      <button
        className="del-btn"
        style={{
          margin: '1.1em 0 0.7em 0',
          opacity: tasks.some(t => t.done) ? 1 : 0.4,
          cursor: tasks.some(t => t.done) ? 'pointer' : 'not-allowed'
        }}
        onClick={deleteAllDone}
        disabled={!tasks.some(t => t.done)}
        title="Usuń wszystkie wykonane zadania"
      >
        🗑️ Usuń wszystkie wykonane
      </button>

      {/* pokaż/ukryj kalendarz */}
      <button
        className="calendar-toggle"
        onClick={() => setShowCalendar(prev => !prev)}
        style={{
          width: '100%',
          margin: '0.7em 0',
          padding: '0.8em 0',
          background: 'linear-gradient(to right,rgb(18, 112, 50),rgb(9, 158, 131))',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.05em',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        {showCalendar ? 'Ukryj kalendarz' : '📅 Pokaż kalendarz'}
      </button>

      {/* sortowanie */}
      <div className="sort-buttons">
        <button
          className={`sort-btn ${sortMode === 'deadline' ? 'active' : ''}`}
          onClick={() => {
            setSortMode('deadline');
            setSortOrder(prev => ({ ...prev, deadline: !prev.deadline }));
          }}
        >
          Sortuj wg terminu: {sortOrder.deadline ? '⏫ rosnąco' : '⏬ malejąco'}
        </button>
        <button
          className={`sort-btn ${sortMode === 'name' ? 'active' : ''}`}
          onClick={() => {
            setSortMode('name');
            setSortOrder(prev => ({ ...prev, name: !prev.name }));
          }}
        >
          Sortuj wg nazwy: {sortOrder.name ? 'A-Z' : 'Z-A'}
        </button>
        <button
          className={`sort-btn ${sortMode === 'done' ? 'active' : ''}`}
          onClick={() => {
            setSortMode('done');
            setSortOrder(prev => ({ ...prev, done: !prev.done }));
          }}
        >
          Sortuj wg statusu: {sortOrder.done ? '✗ najpierw' : '✓ najpierw'}
        </button>
      </div>

      {/* błąd */}
      {err && <div className="error">{err}</div>}

      {/* kalendarz */}
      {showCalendar && <CalendarView tasks={tasks} />}

      <h3 style={{
        textAlign: 'center',
        margin: '1.5em 0 0.5em',
        fontSize: '1.2em',
        color: '#333'
      }}>
        📝 Lista zadań
      </h3>

      {/* lista zadań */}
      {tasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#777',
          fontStyle: 'italic',
          fontSize: '1.05em',
          marginTop: '1em'
        }}>
          🌤️ Wszystko zrobione! Brak zadań na teraz.
        </div>
      ) : (
        <ul>
          {[...tasks]
            .sort((a, b) => {
              const asc = sortOrder[sortMode];
              if (sortMode === 'deadline') {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return asc
                  ? new Date(a.deadline) - new Date(b.deadline)
                  : new Date(b.deadline) - new Date(a.deadline);
              }
              if (sortMode === 'name') {
                return asc
                  ? a.title.localeCompare(b.title)
                  : b.title.localeCompare(a.title);
              }
              if (sortMode === 'done') {
                return asc
                  ? Number(a.done) - Number(b.done)
                  : Number(b.done) - Number(a.done);
              }
              return 0;
            })
            .map(t =>
              <li key={t._id}>
                <div className="task-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggle(t)}
                    />
                    <span
                      style={{
                        textDecoration: t.done ? 'line-through' : '',
                        marginLeft: '0.65em',
                        fontWeight: 500,
                        fontSize: '1.03em',
                        color: t.done ? '#888' : '#222'
                      }}
                    >
                      {t.title}
                    </span>
                    <span
                      role="status"
                      className={t.done ? "done" : "notdone"}
                      style={{ marginLeft: 'auto' }}
                    >
                      {t.done ? "✓ wykonane" : "✗ do zrobienia"}
                    </span>
                  </div>

                  {/* pokazanie terminu */}
                  {t.deadline && (() => {
                    const deadlineDate = new Date(t.deadline);
                    const now = new Date();
                    const timeDiff = deadlineDate - now;
                    const hoursLeft = timeDiff / (1000 * 60 * 60);

                    let color = '#777';
                    let fontWeight = 'normal';

                    if (deadlineDate < now) {
                      color = '#e63946'; // przeterminowane
                      fontWeight = '600';
                    } else if (hoursLeft <= 24) {
                      color = '#e76f51'; // bliski termin
                      fontWeight = '600';
                    }

                    return (
                      <div
                        style={{
                          fontSize: '0.9em',
                          marginTop: '0.3em',
                          marginLeft: '1.85em',
                          color,
                          fontWeight
                        }}
                      >
                        Termin: {deadlineDate.toLocaleString()}
                      </div>
                    );
                  })()}
                </div>
              </li>
            )}
        </ul>
      )}
    </div>
  );
}
