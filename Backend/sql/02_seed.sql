
BEGIN;

-- Админ: admin@gmail.com / admin
INSERT INTO users (full_name, birth_date, email, password_hash, role, is_active)
VALUES ('Admin Root', '1990-01-01', 'admin@gmail.com', crypt('admin', gen_salt('bf')), 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Три обычных пользователя
INSERT INTO users (full_name, birth_date, email, password_hash, role, is_active)
VALUES
  ('Иван Петров',   '1992-05-10', 'ivan.petrov@example.com',   crypt('user123', gen_salt('bf')), 'user', true),
  ('Мария Иванова', '1995-08-22', 'maria.ivanova@example.com', crypt('user456', gen_salt('bf')), 'user', true),
  ('Сергей Смирнов','1988-12-03', 'sergey.smirnov@example.com',crypt('user789', gen_salt('bf')), 'user', true)
ON CONFLICT (email) DO NOTHING;

COMMIT;
