import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const API_URL = 'http://localhost:8789';

describe('API Tests', () => {
  let db;

  beforeAll(async () => {
    db = await open({
      filename: './data/turkish_learning.db',
      driver: sqlite3.Database,
    });
    await db.run("INSERT INTO vocabulary (turkish, english, category_id) VALUES ('Teşekkürler', 'Thank you', 1)");
  });

  afterAll(async () => {
    await db.run("DELETE FROM vocabulary WHERE turkish = 'Teşekkürler'");
    await db.close();
  });

  it('should get all learning categories', async () => {
    const response = await fetch(`${API_URL}/api/db/categories`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toBeInstanceOf(Array);
    expect(data.categories.length).toBeGreaterThan(0);
  });

  it('should get vocabulary by category with a valid limit', async () => {
    const response = await fetch(`${API_URL}/api/db/vocabulary/1?limit=1`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.vocabulary).toBeInstanceOf(Array);
    expect(data.vocabulary.length).toBe(1);
  });

  it('should get vocabulary by category with a default limit for invalid input', async () => {
    // There is 1 word in seeded data for category 1, and we add one more in beforeAll.
    // The default limit is 20, so we expect to get both words back.
    const response = await fetch(`${API_URL}/api/db/vocabulary/1?limit=foo`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.vocabulary).toBeInstanceOf(Array);
    expect(data.vocabulary.length).toBe(2);
  });

  it('should get random vocabulary', async () => {
    const response = await fetch(`${API_URL}/api/db/vocabulary/random/3`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.vocabulary).toBeInstanceOf(Array);
    expect(data.vocabulary.length).toBe(3);
  });

  it('should get user progress', async () => {
    const response = await fetch(`${API_URL}/api/db/user/progress`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('total_xp');
    expect(data).toHaveProperty('words_learned');
    expect(data).toHaveProperty('sessions_completed');
  });
});
