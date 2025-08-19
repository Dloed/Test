
import jwt from 'jsonwebtoken';
import { cfg } from '../config.js';


export const signToken = (payload) =>
  jwt.sign(payload, cfg.jwtSecret, { expiresIn: cfg.jwtExpires });


export const setAuthCookie = (res, token) =>
  res.cookie('access', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: cfg.isProd,
    path: '/',
  });

/** Авторизация по куке */
export function auth(req, res, next) {
  const t = req.cookies?.access;
  if (!t) return res.status(401).json({ message: 'Не авторизован' });
  try {
    req.user = jwt.verify(t, cfg.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: 'Не авторизован' });
  }
}

/** Только админ */
export const requireAdmin = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Только для админа' });

/** Сам себя или админ */
export const allowSelfOrAdmin = (param = 'id') => (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.id === req.params[param]) return next();
  return res.status(403).json({ message: 'Запрещено' });
};
