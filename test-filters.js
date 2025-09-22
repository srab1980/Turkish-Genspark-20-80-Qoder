#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function testFilters() {
  try {
    console.log('Testing vocabulary filtering and sorting...');
    
    // Test 1: Basic query with JOIN
    console.log('\n1. Testing basic JOIN query:');
    const basicQuery = `
      SELECT v.*, c.name as category_name 
      FROM vocabulary v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE v.is_active = 1
      LIMIT 5
    `;
    const basicResult = await query(basicQuery);
    console.log('Basic query result:', basicResult);
    
    // Test 2: Query with sorting
    console.log('\n2. Testing sorting:');
    const sortQuery = `
      SELECT v.*, c.name as category_name 
      FROM vocabulary v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE v.is_active = 1
      ORDER BY v.turkish_text ASC
      LIMIT 5
    `;
    const sortResult = await query(sortQuery);
    console.log('Sort query result:', sortResult);
    
    // Test 3: Query with filtering by category
    console.log('\n3. Testing category filtering:');
    const categoryQuery = `
      SELECT v.*, c.name as category_name 
      FROM vocabulary v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE v.is_active = 1 AND v.category_id = 1
      ORDER BY v.id DESC
      LIMIT 5
    `;
    const categoryResult = await query(categoryQuery);
    console.log('Category filter result:', categoryResult);
    
    // Test 4: Query with difficulty filtering
    console.log('\n4. Testing difficulty filtering:');
    const difficultyQuery = `
      SELECT v.*, c.name as category_name 
      FROM vocabulary v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE v.is_active = 1 AND v.difficulty_level = 'beginner'
      ORDER BY v.id DESC
      LIMIT 5
    `;
    const difficultyResult = await query(difficultyQuery);
    console.log('Difficulty filter result:', difficultyResult);
    
    // Test 5: Query with search
    console.log('\n5. Testing search functionality:');
    const searchQuery = `
      SELECT v.*, c.name as category_name 
      FROM vocabulary v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE v.is_active = 1 AND (v.turkish_text LIKE '%merhaba%' OR v.english_text LIKE '%hello%' OR v.arabic_text LIKE '%مرحبا%')
      ORDER BY v.id DESC
      LIMIT 5
    `;
    const searchResult = await query(searchQuery);
    console.log('Search result:', searchResult);
    
    console.log('\n✅ All filter tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing filters:', error.message);
  }
}

testFilters();