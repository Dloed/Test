
import { Router } from 'express';
import { pool } from '../db.js';
import { auth, requireAdmin, allowSelfOrAdmin } from '../middlewares/auth.js';

export const usersRouter = Router();

/** Список пользователей — только админ */
usersRouter.get('/', auth, requireAdmin, async (_req, res) => {
  const q = await pool.query(
    `SELECT id, full_name AS "fullName", birth_date AS "birthDate",
            email, role, is_active AS "isActive", created_at AS "createdAt"
     FROM users
     ORDER BY created_at DESC`
  );
  res.json(q.rows);
});

/** Пользователь по id — сам себя или админ */
usersRouter.get('/:id', auth, allowSelfOrAdmin('id'), async (req, res) => {
  const q = await pool.query(
    `SELECT id, full_name AS "fullName", birth_date AS "birthDate",
            email, role, is_active AS "isActive", created_at AS "createdAt"
     FROM users WHERE id=$1`,
    [req.params.id]
  );
  if (!q.rowCount) return res.status(404).json({ message: 'Не найден' });
  res.json(q.rows[0]);
});

/** Блокировка — сам себя или админ */
usersRouter.post('/:id/block', auth, allowSelfOrAdmin('id'), async (req, res) => {
  const q = await pool.query(
    `UPDATE users SET is_active=false, updated_at=NOW() WHERE id=$1
     RETURNING id, is_active AS "isActive"`,
    [req.params.id]
  );
  if (!q.rowCount) return res.status(404).json({ message: 'Не найден' });
  res.json(q.rows[0]);
});
