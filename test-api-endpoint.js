#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function testApiEndpoint() {
  try {
    console.log('Testing API endpoint with all parameters...');
    
    // Simulate the API endpoint logic with all parameters
    const page = 1;
    const limit = 10;
    const search = 'merhaba';
    const categoryId = '1';
    const difficulty = 'beginner';
    const sortBy = 'turkish_text';
    const sortOrder = 'ASC';
    const offset = (page - 1) * limit;
    
    // Validate sortBy parameter to prevent SQL injection
    const allowedSortColumns = ['id', 'turkish_text', 'category_name', 'difficulty_level', 'created_at', 'updated_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
    
    let queryStr = `
      SELECT v.*, c.name as category_name 
      FROM vocabulary v 
      LEFT JOIN categories c ON v.category_id = c.id 
      WHERE v.is_active = 1
    `;
    const params = [];
    
    if (search) {
      queryStr += ` AND (v.turkish_text LIKE ? OR v.english_text LIKE ? OR v.arabic_text LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (categoryId) {
      queryStr += ` AND v.category_id = ?`;
      params.push(categoryId);
    }
    
    if (difficulty) {
      queryStr += ` AND v.difficulty_level = ?`;
      params.push(difficulty);
    }
    
    queryStr += ` ORDER BY ${validSortBy} ${validSortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    console.log('Query string:', queryStr);
    console.log('Parameters:', params);
    
    const vocabulary = await query(queryStr, params);
    console.log('Vocabulary result:', vocabulary);
    
    // Test count query
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM vocabulary v 
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1
    `;
    const countParams = [];
    
    if (search) {
      countQuery += ` AND (v.turkish_text LIKE ? OR v.english_text LIKE ? OR v.arabic_text LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (categoryId) {
      countQuery += ` AND v.category_id = ?`;
      countParams.push(categoryId);
    }
    
    if (difficulty) {
      countQuery += ` AND v.difficulty_level = ?`;
      countParams.push(difficulty);
    }
    
    const totalResult = await query(countQuery, countParams);
    console.log('Total count result:', totalResult);
    
    console.log('\n✅ API endpoint test completed successfully!');
    console.log(`Found ${totalResult[0].total} vocabulary items matching the criteria`);
    
  } catch (error) {
    console.error('❌ Error testing API endpoint:', error.message);
  }
}

testApiEndpoint();