import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import TaskList from './components/TaskList';
import HeaderBar from './components/HeaderBar';
import AdminPanel from './components/AdminPanel';
import EditAccountModal from './components/EditAccountModal';
import * as api from './api';
import './styles.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState({ username: "" });

  React.useEffect(() => {
    if (token) {
      try {
        const parsed = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: parsed.login || parsed.username || "" });
      } catch {
        setUser({ username: "" });
      }
    }
  }, [token]);

  const onAuth = async (username, password, isRegister) => {
    if (isRegister) {
      await api.register(username, password);
      const res = await api.login(username, password);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    } else {
      const res = await api.login(username, password);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
    }
    setUser({ username });
  };

  const onLogout = () => {
    if (window.confirm("Czy na pewno chcesz się wylogować?")) {
      setToken('');
      localStorage.removeItem('token');
      setUser({ username: "" });
    }
  };

  const onEditAccount = () => setShowEdit(true);

  // Obsługa aktualizacji użytkownika z żądaniem do backendu
  const handleUpdate = async ({ login, currentPassword, newPassword }) => {
    await api.updateAccount(token, { login, currentPassword, newPassword });
    const res = await api.login(login, newPassword ? newPassword : currentPassword);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser({ username: login });
  };
  const handleDelete = async ({ currentPassword }) => {
    await api.deleteAccount(token, { currentPassword });
    setToken('');
    localStorage.removeItem('token');
    setUser({ username: "" });
  };

  return (
  <>
    {token && (
      <HeaderBar
        user={user}
        onEditAccount={onEditAccount}
        onLogout={onLogout}
      />
    )}
    <div className="container">
      <h1><span className="logo-icon">🌤️</span><span className="logo-title"> ToDo App</span></h1>
      {!token
        ? <AuthForm onAuth={onAuth} />
        : <>
            <TaskList
              api={api}
              token={token}
              user={user}
              onEditAccount={onEditAccount}
            />
            {/* Panel admina widoczny tylko dla użytkownika 'admin' */}
            {user.username === 'admin' && <AdminPanel />}
          </>
      }
    </div>
    {showEdit && token &&
      <EditAccountModal
        user={user}
        token={token}
        onClose={() => setShowEdit(false)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    }
  </>
);
}

export default App;
