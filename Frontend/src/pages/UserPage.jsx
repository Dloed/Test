
import { api } from '../api.js';

export default function UserPage({ userId }) {
  const id = userId || sessionStorage.getItem('userId');

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userId');
    window.location.href = '/';
  };

  const blockSelf = async () => {
    if (!id) return;
    if (!confirm('Заблокировать свой аккаунт?')) return;
    try {
      await api.post(`/users/${id}/block`);
      alert('Вы заблокированы. Возврат на страницу входа.');
      window.location.href = '/';
    } catch (e) {
      if (e.status === 401) window.location.href = '/';
      else alert('Не удалось заблокировать');
    }
  };

  return (
    <main className="page">
      <div className="card">
        <h1 className="card__title">Личный кабинет</h1>
        <p>Вы вошли как пользователь. Доступен базовый функционал.</p>

        <div className="actions">
          <button className="btn" onClick={logout}>Выйти</button>
          <button className="btn btn--danger" onClick={blockSelf} disabled={!id}>Заблокировать себя</button>
        </div>

        <p className="user-id">
          {id ? <>Ваш ID: <code>{id}</code></> : <>ID не получен — выйдите и войдите снова.</>}
        </p>
      </div>
    </main>
  );
}
