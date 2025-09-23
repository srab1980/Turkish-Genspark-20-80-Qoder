import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = new Hono();
const dbPromise = open({
  filename: './data/turkish_learning.db',
  driver: sqlite3.Database,
});

// Helper to initialize DB
const initDb = async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY,
      turkish TEXT NOT NULL,
      english TEXT NOT NULL,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY,
      total_xp INTEGER DEFAULT 0,
      words_learned INTEGER DEFAULT 0,
      sessions_completed INTEGER DEFAULT 0
    );
  `);

  // Seed data if tables are empty
  const categoryCount = await db.get('SELECT COUNT(*) as count FROM categories');
  if (categoryCount.count === 0) {
    await db.run('INSERT INTO categories (name) VALUES (?), (?), (?)', 'Greetings', 'Family', 'Food');
  }
  const vocabCount = await db.get('SELECT COUNT(*) as count FROM vocabulary');
  if (vocabCount.count === 0) {
      await db.run(
          'INSERT INTO vocabulary (turkish, english, category_id) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
          'Merhaba', 'Hello', 1,
          'Anne', 'Mother', 2,
          'Su', 'Water', 3
      );
  }
  const userProgressCount = await db.get('SELECT COUNT(*) as count FROM user_progress');
  if (userProgressCount.count === 0) {
      await db.run('INSERT INTO user_progress (id) VALUES (1)');
  }
};

app.get('/api/db/categories', async (c) => {
  const db = await dbPromise;
  const categories = await db.all('SELECT * FROM categories');
  return c.json({ categories });
});

app.get('/api/db/vocabulary/:categoryId', async (c) => {
  const db = await dbPromise;
  const { categoryId } = c.req.param();
  const limit = c.req.query('limit') || 20;
  const vocabulary = await db.all('SELECT * FROM vocabulary WHERE category_id = ? LIMIT ?', categoryId, limit);
  return c.json({ vocabulary });
});

app.get('/api/db/vocabulary/random/:count', async (c) => {
    const db = await dbPromise;
    const { count } = c.req.param();
    const vocabulary = await db.all('SELECT * FROM vocabulary ORDER BY RANDOM() LIMIT ?', count);
    return c.json({ vocabulary });
});

app.get('/api/db/user/progress', async (c) => {
    const db = await dbPromise;
    const progress = await db.get('SELECT * FROM user_progress WHERE id = 1');
    return c.json(progress);
});


const server = serve({
  fetch: app.fetch,
  port: 8789,
}, async (info) => {
    await initDb();
    console.log(`Server is running at ${info.address}:${info.port}`);
});
