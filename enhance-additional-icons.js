#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

// Additional icon mappings for common adjectives and other word types
const additionalMappings = {
  // Size adjectives
  'büyük': 'fas fa-expand',
  'küçük': 'fas fa-compress',
  'geniş': 'fas fa-expand',
  'dar': 'fas fa-compress',
  'uzun': 'fas fa-ruler-vertical',
  'kısa': 'fas fa-ruler-horizontal',
  'yüksek': 'fas fa-arrow-up',
  'alçak': 'fas fa-arrow-down',
  'kalın': 'fas fa-bold',
  'ince': 'fas fa-bold',
  'genç': 'fas fa-user',
  
  // Quality adjectives
  'iyi': 'fas fa-thumbs-up',
  'kötü': 'fas fa-thumbs-down',
  'güzel': 'fas fa-heart',
  'çirkin': 'fas fa-thumbs-down',
  'temiz': 'fas fa-broom',
  'kirli': 'fas fa-broom',
  'yeni': 'fas fa-star',
  'eski': 'fas fa-clock',
  'hızlı': 'fas fa-bolt',
  'yavaş': 'fas fa-snail',
  'sıcak': 'fas fa-fire',
  'soğuk': 'fas fa-snowflake',
  'sert': 'fas fa-hammer',
  'yumuşak': 'fas fa-cloud',
  'hafif': 'fas fa-feather',
  'ağır': 'fas fa-weight-hanging',
  'dolu': 'fas fa-box',
  'boş': 'fas fa-box-open',
  'pahalı': 'fas fa-money-bill',
  'ucuz': 'fas fa-tag',
  'zengin': 'fas fa-money-bill',
  
  // Condition adjectives
  'sağlam': 'fas fa-check',
  'bozuk': 'fas fa-xmark',
  'kırık': 'fas fa-xmark',
  'çalışan': 'fas fa-check',
  'durgun': 'fas fa-pause',
  'aktif': 'fas fa-check',
  'pasif': 'fas fa-pause',
  'açık': 'fas fa-door-open',
  'kapalı': 'fas fa-door-closed',
  'parlak': 'fas fa-star',
  'düz': 'fas fa-minus',
  'eğri': 'fas fa-wave-square',
  'dik': 'fas fa-arrow-up',
  
  // Difficulty adjectives
  'kolay': 'fas fa-face-smile',
  'zor': 'fas fa-face-frown',
  'basit': 'fas fa-face-smile',
  'karmaşık': 'fas fa-face-frown',
  'normal': 'fas fa-equals',
  
  // Importance adjectives
  'önemli': 'fas fa-star',
  'önemsiz': 'fas fa-star-half-stroke',
  'güvenli': 'fas fa-shield-halved',
  'tehlikeli': 'fas fa-skull',
  'doğru': 'fas fa-check',
  'yanlış': 'fas fa-xmark',
  'haklı': 'fas fa-check',
  'haksız': 'fas fa-xmark',
  'meşgul': 'fas fa-briefcase',
  'tembel': 'fas fa-couch',
  'çalışkan': 'fas fa-briefcase',
  
  // Other common adjectives
  'zeki': 'fas fa-lightbulb',
  'aptal': 'fas fa-lightbulb',
  'akıllı': 'fas fa-lightbulb',
  'gevşek': 'fas fa-loose',
  'sıkı': 'fas fa-grip',
  'rahat': 'fas fa-couch',
  'rahatsız': 'fas fa-bed',
  'lezzetli': 'fas fa-utensils',
  'tatsız': 'fas fa-utensils'
};

async function enhanceAdditionalIcons() {
  try {
    console.log('🎨 Enhancing additional vocabulary icons...');
    
    // Get all active vocabulary items with default icons
    const vocabulary = await query(`
      SELECT id, turkish_text, svg_icon
      FROM vocabulary
      WHERE svg_icon = 'fas fa-book' AND is_active = 1
    `);
    
    console.log(`📊 Processing ${vocabulary.length} vocabulary items with default icons...`);
    
    let updatedCount = 0;
    
    // Process each vocabulary item
    for (const item of vocabulary) {
      const lowerText = item.turkish_text.toLowerCase().trim();
      
      // Check if we have a specific mapping for this word
      if (additionalMappings[lowerText]) {
        const newIcon = additionalMappings[lowerText];
        
        // Update the icon
        await query(
          'UPDATE vocabulary SET svg_icon = ?, updated_at = datetime("now") WHERE id = ?',
          [newIcon, item.id]
        );
        updatedCount++;
      }
    }
    
    console.log(`\n✅ Additional icon enhancement completed!`);
    console.log(`   Icons updated: ${updatedCount}`);
    
    // Show some examples of updated icons
    console.log('\n🔍 Sample updated icons:');
    const sample = await query(`
      SELECT turkish_text, svg_icon
      FROM vocabulary
      WHERE svg_icon IN (${Object.values(additionalMappings).map(() => '?').join(',')})
      ORDER BY updated_at DESC
      LIMIT 10
    `, Object.values(additionalMappings));
    
    sample.forEach(item => {
      console.log(`   ${item.turkish_text} -> ${item.svg_icon}`);
    });
    
    // Show final statistics
    const totalCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE is_active = 1');
    const bookIconCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE svg_icon = "fas fa-book" AND is_active = 1');
    const otherIconCount = await query('SELECT COUNT(*) as count FROM vocabulary WHERE svg_icon != "fas fa-book" AND is_active = 1');
    
    console.log(`\n📊 Final Statistics:`);
    console.log(`  Total active vocabulary: ${totalCount[0].count}`);
    console.log(`  Items with default book icon: ${bookIconCount[0].count}`);
    console.log(`  Items with meaningful icons: ${otherIconCount[0].count}`);
    console.log(`  Percentage with meaningful icons: ${Math.round((otherIconCount[0].count / totalCount[0].count) * 100)}%`);
    
  } catch (error) {
    console.error('❌ Error enhancing additional icons:', error.message);
    process.exit(1);
  }
}

// Run the enhancement
enhanceAdditionalIcons();