
import pkg from 'pg';
const { Pool } = pkg;
import { cfg } from './config.js';

export const pool = new Pool(cfg.db);
