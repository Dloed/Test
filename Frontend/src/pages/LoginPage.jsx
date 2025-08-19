
import { useNavigate } from 'react-router-dom';
import LoginForm from '../LoginForm.jsx';
import { api } from '../api.js';

export default function LoginPage({ setRole, setUserId }) {
  const navigate = useNavigate();

  const onLogin = async ({ email, password }) => {
    const data = await api.post('/auth/login', { email, password });
    const role = data?.role || 'user';
    const id = data?.id || null;
    if (role) sessionStorage.setItem('role', role);
    if (id) sessionStorage.setItem('userId', id);
    setRole?.(role);
    if (id) setUserId?.(id);
    navigate(role === 'admin' ? '/admin' : '/user');
  };

  const onRegister = async ({ email, password }) => {
    const fullName = prompt('ФИО:');
    const birthDate = prompt('Дата рождения (YYYY-MM-DD):');
    if (!fullName || !birthDate) return;
    await api.post('/auth/register', { fullName, birthDate, email, password });
    await onLogin({ email, password });
  };

  return (
    <main className="page-center">
      <div className="card">
        <h1 className="card__title">Вход / Регистрация</h1>
        <LoginForm onLogin={onLogin} onRegister={onRegister} />
      </div>
    </main>
  );
}
