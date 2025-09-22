#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function showImprovedIcons() {
  try {
    console.log('Showing sample of improved icons...');
    
    // Get a diverse sample of vocabulary with their new icons
    const sample = await query(`
      SELECT v.turkish_text, v.svg_icon, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1 AND v.svg_icon != 'fas fa-book'
      ORDER BY RANDOM()
      LIMIT 20
    `);
    
    console.log('Sample of vocabulary with meaningful icons:');
    sample.forEach((item, index) => {
      console.log(`${index + 1}. ${item.turkish_text} -> ${item.svg_icon} (${item.category_name || 'No category'})`);
    });
    
    // Show some category-based icons as well
    console.log('\nSample of category-based icons:');
    const categorySample = await query(`
      SELECT v.turkish_text, v.svg_icon, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1
      ORDER BY c.name
      LIMIT 20
    `);
    
    categorySample.forEach((item, index) => {
      console.log(`${index + 1}. ${item.turkish_text} -> ${item.svg_icon} (${item.category_name || 'No category'})`);
    });
    
  } catch (error) {
    console.error('Error showing icons:', error.message);
  }
}

showImprovedIcons();