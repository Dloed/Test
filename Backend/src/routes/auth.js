
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { signToken, setAuthCookie } from '../middlewares/auth.js';

export const authRouter = Router();

/** Регистрация  */
authRouter.post('/register', async (req, res) => {
  try {
    const { fullName, birthDate, email, password } = req.body || {};
    if (!fullName || !birthDate || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    const hash = await bcrypt.hash(String(password), 10);
    const q = await pool.query(
      `INSERT INTO users (full_name, birth_date, email, password_hash, role)
       VALUES ($1,$2,$3,$4,'user')
       RETURNING id, email, role`,
      [String(fullName).trim(), birthDate, String(email).trim(), hash]
    );
    return res.status(201).json(q.rows[0]);
  } catch (e) {
    if (e?.code === '23505') return res.status(409).json({ message: 'Email уже используется' });
    console.error('register:', e);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

/** Логин  */
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(401).json({ message: 'Неверная почта или пароль' });

    const q = await pool.query(
      'SELECT id, email, password_hash, role, is_active FROM users WHERE email=$1',
      [String(email).trim()]
    );
    if (!q.rowCount) return res.status(401).json({ message: 'Неверная почта или пароль' });

    const u = q.rows[0];
    if (!u.is_active) return res.status(403).json({ message: 'Пользователь заблокирован' });

    const ok = await bcrypt.compare(String(password), u.password_hash);
    if (!ok) return res.status(401).json({ message: 'Неверная почта или пароль' });

    const token = signToken({ id: u.id, role: u.role });
    setAuthCookie(res, token);
    return res.json({ id: u.id, role: u.role });
  } catch (e) {
    console.error('login:', e);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

/** Логаут — очистка httpOnly-куки */
authRouter.post('/logout', (_req, res) => {
  res.clearCookie('access', { path: '/' });
  return res.status(204).end();
});
