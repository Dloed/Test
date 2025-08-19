import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { cfg } from './config.js';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';

const app = express();

const ORIGIN = 'http://localhost:5173';
app.use(cors({ origin: ORIGIN, credentials: true }));


app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/users', usersRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((_req, res) => res.status(404).json({ message: 'Not found' }));

app.listen(cfg.port, () => {
  console.log(`API → http://localhost:${cfg.port}`);
});
