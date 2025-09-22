#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function verifyIcons() {
  try {
    console.log('Verifying icon assignments...');
    
    // Check some specific words to see their icons
    const wordsToCheck = ['zencefil', 'karanfil', 'elma', 'muz', 'portakal', 'fil'];
    
    for (const word of wordsToCheck) {
      const result = await query(`
        SELECT v.turkish_text, v.svg_icon, c.name as category_name
        FROM vocabulary v
        LEFT JOIN categories c ON v.category_id = c.id
        WHERE v.turkish_text = ? AND v.is_active = 1
      `, [word]);
      
      if (result && result.length > 0) {
        console.log(`${word} -> ${result[0].svg_icon} (Category: ${result[0].category_name || 'None'})`);
      } else {
        console.log(`${word} -> Not found`);
      }
    }
    
    // Check how many vocabulary items now have meaningful icons
    const totalCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE is_active = 1');
    const bookIconCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE svg_icon = "fas fa-book" AND is_active = 1');
    
    console.log(`\nStatistics:`);
    console.log(`  Total active vocabulary: ${totalCount[0].count}`);
    console.log(`  Items with default book icon: ${bookIconCount[0].count}`);
    console.log(`  Items with meaningful icons: ${totalCount[0].count - bookIconCount[0].count}`);
    
  } catch (error) {
    console.error('Error verifying icons:', error.message);
  }
}

verifyIcons();