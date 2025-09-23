import fetch from 'node-fetch';

const API_URL = 'http://localhost:8789';

describe('API Tests', () => {
  it('should get all learning categories', async () => {
    const response = await fetch(`${API_URL}/api/db/categories`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.categories).toBeInstanceOf(Array);
    expect(data.categories.length).toBeGreaterThan(0);
  });

  it('should get vocabulary by category', async () => {
    const response = await fetch(`${API_URL}/api/db/vocabulary/1?limit=5`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.vocabulary).toBeInstanceOf(Array);
    expect(data.vocabulary.length).toBeGreaterThan(0);
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
