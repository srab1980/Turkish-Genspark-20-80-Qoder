#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function finalIconCheck() {
  try {
    console.log('🔍 Final icon enhancement verification...');
    
    // Show final statistics
    const totalCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE is_active = 1');
    const bookIconCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE svg_icon = "fas fa-book" AND is_active = 1');
    const otherIconCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE svg_icon != "fas fa-book" AND is_active = 1');
    
    console.log(`\n📊 Final Statistics:`);
    console.log(`  Total active vocabulary: ${totalCount[0].count}`);
    console.log(`  Items with default book icon: ${bookIconCount[0].count}`);
    console.log(`  Items with meaningful icons: ${otherIconCount[0].count}`);
    console.log(`  Percentage with meaningful icons: ${Math.round((otherIconCount[0].count / totalCount[0].count) * 100)}%`);
    
    // Show a diverse sample of improved icons
    console.log('\n🎨 Sample of improved icons:');
    const sample = await query(`
      SELECT v.turkish_text, v.svg_icon, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1 AND v.svg_icon != 'fas fa-book'
      ORDER BY RANDOM()
      LIMIT 20
    `);
    
    sample.forEach((item, index) => {
      console.log(`${index + 1}. ${item.turkish_text} -> ${item.svg_icon} (${item.category_name || 'No category'})`);
    });
    
    // Show remaining default icons
    console.log('\n📚 Remaining items with default icons:');
    const remaining = await query(`
      SELECT v.turkish_text, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.svg_icon = 'fas fa-book' AND v.is_active = 1
      ORDER BY c.name
      LIMIT 10
    `);
    
    remaining.forEach((item, index) => {
      console.log(`${index + 1}. ${item.turkish_text} (${item.category_name || 'No category'})`);
    });
    
    console.log(`\n✅ Icon enhancement process completed successfully!`);
    console.log(`✨ ${otherIconCount[0].count} vocabulary items now have meaningful, colorful icons that represent word meanings.`);
    
  } catch (error) {
    console.error('❌ Error in final verification:', error.message);
    process.exit(1);
  }
}

finalIconCheck();