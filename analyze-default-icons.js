#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function analyzeDefaultIcons() {
  try {
    console.log('Analyzing default icons by category...');
    
    // Get count of default icons by category
    const categoryStats = await query(`
      SELECT c.name as category_name, COUNT(*) as count
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.svg_icon = 'fas fa-book' AND v.is_active = 1
      GROUP BY c.name
      ORDER BY count DESC
    `);
    
    console.log('Default icons by category:');
    categoryStats.forEach((stat, index) => {
      console.log(`${index + 1}. ${stat.category_name || 'No category'}: ${stat.count}`);
    });
    
    // Check what types of words have default icons
    const wordTypes = await query(`
      SELECT word_type, COUNT(*) as count
      FROM vocabulary
      WHERE svg_icon = 'fas fa-book' AND is_active = 1
      GROUP BY word_type
      ORDER BY count DESC
    `);
    
    console.log('\nDefault icons by word type:');
    wordTypes.forEach((type, index) => {
      console.log(`${index + 1}. ${type.word_type}: ${type.count}`);
    });
    
    // Get some sample words with default icons by word type
    console.log('\nSample adjective words with default icons:');
    const adjectives = await query(`
      SELECT turkish_text
      FROM vocabulary
      WHERE svg_icon = 'fas fa-book' AND is_active = 1 AND word_type = 'adjective'
      LIMIT 10
    `);
    
    adjectives.forEach((adj, index) => {
      console.log(`${index + 1}. ${adj.turkish_text}`);
    });
    
  } catch (error) {
    console.error('Error analyzing default icons:', error.message);
  }
}

analyzeDefaultIcons();