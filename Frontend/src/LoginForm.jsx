
import { useState } from 'react';

const EMAIL_RX = /\S+@\S+\.\S+/;

export default function LoginForm({ onLogin, onRegister, loading = false, error = '' }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);

  const emailOk = EMAIL_RX.test(email.trim());
  const canLogin = mode === 'login' && emailOk && password.trim() && !loading;
  const canRegister = mode === 'register' && emailOk && password.length >= 6 && confirm === password && !loading;

  const submit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!canLogin) return;
      onLogin?.({ email: email.trim(), password });
    } else {
      if (!canRegister) return;
      onRegister?.({ email: email.trim(), password });
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setConfirm('');
  };

  return (
    <form className="login-form" onSubmit={submit} noValidate>
      <h2 className="login-form__title">{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>

      <label className="login-form__field">
        <span className="login-form__label">Email</span>
        <input
          className={`login-form__input ${email && !emailOk ? 'is-invalid' : ''}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {email && !emailOk && (
          <span className="login-form__hint login-form__hint--error">Неверный email</span>
        )}
      </label>

      <label className="login-form__field">
        <span className="login-form__label">Пароль</span>
        <div className="login-form__password">
          <input
            className="login-form__input"
            type={show ? 'text' : 'password'}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" className="login-form__toggle" onClick={() => setShow((v) => !v)}>
            {show ? 'Скрыть' : 'Показать'}
          </button>
        </div>
      </label>

      {mode === 'register' && (
        <label className="login-form__field">
          <span className="login-form__label">Повторите пароль</span>
          <input
            className={`login-form__input ${confirm && confirm !== password ? 'is-invalid' : ''}`}
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Повторите пароль"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {confirm && confirm !== password && (
            <span className="login-form__hint login-form__hint--error">Пароли не совпадают</span>
          )}
        </label>
      )}

      {error && <div role="alert" className="login-form__alert">{error}</div>}

      <div className="login-form__actions">
        <button type="submit" className="login-form__submit" disabled={mode === 'login' ? !canLogin : !canRegister}>
          {loading ? (mode === 'login' ? 'Входим...' : 'Регистрируем...') : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
        </button>
        <button
          type="button"
          className={mode === 'login' ? 'login-form__register' : 'login-form__cancel'}
          onClick={switchMode}
          disabled={loading}
        >
          {mode === 'login' ? 'Регистрация' : 'Отмена'}
        </button>
      </div>
    </form>
  );
}
