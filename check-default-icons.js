#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function checkDefaultIcons() {
  try {
    console.log('Checking vocabulary items with default icons...');
    
    // Get items with default book icons
    const defaultItems = await query(`
      SELECT v.turkish_text, v.svg_icon, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.svg_icon = 'fas fa-book' AND v.is_active = 1
      ORDER BY c.name
      LIMIT 30
    `);
    
    console.log(`Found ${defaultItems.length} items with default book icons:`);
    defaultItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.turkish_text} (${item.category_name || 'No category'})`);
    });
    
    // Get some statistics
    const totalCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE is_active = 1');
    const bookIconCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE svg_icon = "fas fa-book" AND is_active = 1');
    const otherIconCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE svg_icon != "fas fa-book" AND is_active = 1');
    
    console.log(`\nStatistics:`);
    console.log(`  Total active vocabulary: ${totalCount[0].count}`);
    console.log(`  Items with default book icon: ${bookIconCount[0].count}`);
    console.log(`  Items with meaningful icons: ${otherIconCount[0].count}`);
    console.log(`  Percentage with meaningful icons: ${Math.round((otherIconCount[0].count / totalCount[0].count) * 100)}%`);
    
  } catch (error) {
    console.error('Error checking default icons:', error.message);
  }
}

checkDefaultIcons();