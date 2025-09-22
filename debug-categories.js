#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function debugCategories() {
  try {
    console.log('Debugging category assignments...');
    
    // Check some specific vocabulary items and their categories
    const items = await query(`
      SELECT v.turkish_text, v.svg_icon, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1
      LIMIT 20
    `);
    
    console.log('Sample vocabulary items with categories:');
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.turkish_text} -> ${item.svg_icon} (Category: ${item.category_name || 'None'})`);
    });
    
    // Check if there's an issue with the JOIN
    console.log('\nChecking category data:');
    const categories = await query('SELECT id, name FROM categories WHERE is_active = 1');
    console.log('Active categories:');
    categories.forEach(cat => {
      console.log(`  ${cat.id}: ${cat.name}`);
    });
    
  } catch (error) {
    console.error('Error debugging categories:', error.message);
  }
}

debugCategories();