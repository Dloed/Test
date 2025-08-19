
import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setUsers(await api.get('/users'));
    } catch (e) {
      if (e.status === 401) window.location.href = '/';
      else alert('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    const fullName = prompt('ФИО:');
    const birthDate = prompt('Дата рождения (YYYY-MM-DD):');
    const email = prompt('Email:');
    const password = prompt('Пароль (мин. 6):');
    if (!fullName || !birthDate || !email || !password) return;
    try {
      await api.post('/auth/register', { fullName, birthDate, email, password, role: 'user' });
      await load();
    } catch {
      alert('Не удалось создать пользователя');
    }
  };

  const blockUser = async (id) => {
    if (!confirm('Заблокировать пользователя?')) return;
    try {
      await api.post(`/users/${id}/block`);
      await load();
    } catch {
      alert('Не удалось заблокировать');
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userId');
    window.location.href = '/';
  };

  useEffect(() => { load(); }, []);

  return (
    <main className="page">
      <div className="card">
        <h1 className="card__title">Админ панель</h1>

        <div className="actions">
          <button className="btn btn--primary" onClick={addUser}>Добавить пользователя</button>
          <button className="btn" onClick={load}>Обновить</button>
          <button className="btn" onClick={logout}>Выйти</button>
        </div>

        {loading ? (
          <p>Загрузка…</p>
        ) : users.length === 0 ? (
          <p>Пользователей пока нет.</p>
        ) : (
          <ul className="list">
            {users.map((u) => (
              <li key={u.id} className="list__item">
                <span>{`${u.fullName} — ${u.email} — ${u.role} — ${u.isActive ? 'активен' : 'заблокирован'}`}</span>
                <button className="btn btn--danger" onClick={() => blockUser(u.id)} disabled={!u.isActive}>
                  Заблокировать
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
