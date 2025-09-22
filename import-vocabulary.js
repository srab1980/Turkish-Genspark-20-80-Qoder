#!/usr/bin/env node

/**
 * Import vocabulary data from JSON file to SQLite database
 */

import fs from 'fs';
import path from 'path';
import { query } from './src/database/db-connector.js';

// Load the JSON data
const jsonData = JSON.parse(fs.readFileSync('./excel_vocabulary_database.json', 'utf-8'));

console.log('📊 Loading vocabulary data from JSON file...');
console.log(`📊 Total categories: ${Object.keys(jsonData.categories).length}`);

// Category mapping to match database categories
const categoryMapping = {
  'adjective': 11,      // Assuming this maps to an appropriate category
  'animal': 12,
  'body': 13,
  'clothes': 14,
  'color': 5,
  'direction': 15,
  'emotion': 16,
  'family': 2,
  'finance': 17,
  'food': 3,
  'furniture': 18,
  'geography': 19,
  'health': 20,
  'house': 21,
  'job': 22,
  'nature': 23,
  'noun': 24,
  'number': 4,
  'place': 25,
  'pronoun': 26,
  'school': 27,
  'sport': 28,
  'time': 6,
  'transport': 7,
  'verb': 29,
  'weather': 30
};

// Get existing categories from database to map names to IDs
async function getCategoryMapping() {
  const categories = await query('SELECT id, name FROM categories');
  const categoryMap = {};
  
  categories.forEach(cat => {
    categoryMap[cat.name.toLowerCase()] = cat.id;
  });
  
  // Add our custom mappings
  Object.assign(categoryMap, categoryMapping);
  
  return categoryMap;
}

async function importVocabulary() {
  try {
    console.log('🔌 Connecting to database...');
    
    // Get category mapping
    const categoryMap = await getCategoryMapping();
    console.log('📚 Category mapping:', categoryMap);
    
    // Count total words to import
    let totalWords = 0;
    Object.values(jsonData.categories).forEach(category => {
      totalWords += category.words.length;
    });
    
    console.log(`📥 Preparing to import ${totalWords} vocabulary items...`);
    
    // Import vocabulary items
    let importedCount = 0;
    let errorCount = 0;
    
    for (const [categoryName, categoryData] of Object.entries(jsonData.categories)) {
      console.log(`📦 Processing category: ${categoryName} (${categoryData.words.length} words)`);
      
      for (const word of categoryData.words) {
        try {
          // Map category
          const categoryId = categoryMap[categoryName.toLowerCase()] || 1; // Default to first category if not found
          
          // Prepare data for insertion
          const vocabData = {
            category_id: categoryId,
            turkish_text: word.turkish || '',
            english_text: word.english || 'word',
            arabic_text: word.arabic || '',
            turkish_pronunciation: '', // Not available in JSON
            english_definition: '', // Not available in JSON
            word_type: 'noun', // Default
            difficulty_level: word.difficultyLevel || 'A1',
            example_sentence_tr: word.turkishSentence || '',
            example_sentence_en: '', // Not available in JSON
            example_sentence_ar: word.arabicSentence || '',
            audio_url: '', // Not available in JSON
            image_url: '', // Not available in JSON
            svg_icon: mapEmojiToFontAwesome(word.icon) || 'fas fa-book', // Map emoji to Font Awesome or use default
            frequency_score: 0, // Default
          };
          
          // Skip if no Turkish text
          if (!vocabData.turkish_text) {
            errorCount++;
            continue;
          }
          
          // Insert into database
          const result = await query(
            `INSERT OR IGNORE INTO vocabulary (
              category_id, turkish_text, english_text, arabic_text, turkish_pronunciation, 
              english_definition, word_type, difficulty_level, example_sentence_tr, 
              example_sentence_en, example_sentence_ar, audio_url, image_url, svg_icon,
              frequency_score, is_active, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
            [
              vocabData.category_id,
              vocabData.turkish_text,
              vocabData.english_text,
              vocabData.arabic_text,
              vocabData.turkish_pronunciation,
              vocabData.english_definition,
              vocabData.word_type,
              vocabData.difficulty_level,
              vocabData.example_sentence_tr,
              vocabData.example_sentence_en,
              vocabData.example_sentence_ar,
              vocabData.audio_url,
              vocabData.image_url,
              vocabData.svg_icon,
              vocabData.frequency_score
            ]
          );
          
          if (result.lastID) {
            importedCount++;
          }
          
          // Show progress every 100 words
          if ((importedCount + errorCount) % 100 === 0) {
            console.log(`   🔄 Progress: ${importedCount + errorCount}/${totalWords} words processed`);
          }
          
        } catch (error) {
          console.error(`   ❌ Error importing word "${word.turkish}":`, error.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n✅ Import completed!');
    console.log(`   📥 Successfully imported: ${importedCount} words`);
    console.log(`   ❌ Errors: ${errorCount} words`);
    console.log(`   📊 Total processed: ${importedCount + errorCount} words`);
    
    // Verify import by counting vocabulary in database
    const countResult = await query('SELECT COUNT(*) as total FROM vocabulary WHERE is_active = 1');
    console.log(`   📈 Database now contains: ${countResult[0].total} active vocabulary items`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

// Function to map emojis to Font Awesome class names
function mapEmojiToFontAwesome(emoji) {
  const emojiToFontAwesome = {
    '📚': 'fas fa-book',
    '📝': 'fas fa-pen',
    '👨': 'fas fa-male',
    '👩': 'fas fa-female',
    '👶': 'fas fa-baby',
    '👨‍👩‍👧‍👦': 'fas fa-users',
    '✋': 'fas fa-hand-paper',
    '🦶': 'fas fa-shoe-prints',
    '🤕': 'fas fa-head-side-headache',
    '❤️': 'fas fa-heart',
    '👄': 'fas fa-kiss',
    '👃': 'fas fa-nose',
    '👂': 'fas fa-ear-listen',
    '🦷': 'fas fa-tooth',
    '💇': 'fas fa-scissors',
    '🍞': 'fas fa-bread-slice',
    '💧': 'fas fa-droplet',
    '🫖': 'fas fa-mug-hot',
    '☕': 'fas fa-coffee',
    '🥛': 'fas fa-glass-whiskey',
    '🥚': 'fas fa-egg',
    '🥩': 'fas fa-drumstick-bite',
    '🐟': 'fas fa-fish',
    '🍎': 'fas fa-apple-alt',
    '🥬': 'fas fa-leaf',
    '🐕': 'fas fa-dog',
    '🐱': 'fas fa-cat',
    '🐦': 'fas fa-dove',
    '🐎': 'fas fa-horse',
    '🐄': 'fas fa-cow',
    '🐑': 'fas fa-sheep',
    '🐓': 'fas fa-crow',
    '🦁': 'fas fa-lion',
    '🐘': 'fas fa-elephant',
    '🐻': 'fas fa-bear',
    '🚗': 'fas fa-car',
    '🚌': 'fas fa-bus',
    '✈️': 'fas fa-plane',
    '🚂': 'fas fa-train',
    '🚢': 'fas fa-ship',
    '🚲': 'fas fa-bicycle',
    '🚕': 'fas fa-taxi',
    '🚇': 'fas fa-subway',
    '🔴': 'fas fa-circle',
    '🔵': 'fas fa-circle',
    '🟢': 'fas fa-circle',
    '🟡': 'fas fa-circle',
    '⚫': 'fas fa-circle',
    '⚪': 'fas fa-circle',
    '🩷': 'fas fa-heart',
    '🟣': 'fas fa-circle',
    '🟠': 'fas fa-circle',
    '1️⃣': 'fas fa-1',
    '2️⃣': 'fas fa-2',
    '3️⃣': 'fas fa-3',
    '4️⃣': 'fas fa-4',
    '5️⃣': 'fas fa-5',
    '6️⃣': 'fas fa-6',
    '7️⃣': 'fas fa-7',
    '8️⃣': 'fas fa-8',
    '9️⃣': 'fas fa-9',
    '🔟': 'fas fa-10',
    '📅': 'fas fa-calendar',
    '🕐': 'fas fa-clock',
    '🗓️': 'fas fa-calendar-alt',
    '😊': 'fas fa-smile',
    '😢': 'fas fa-sad-tear',
    '😠': 'fas fa-angry',
    '😨': 'fas fa-flushed',
    '😄': 'fas fa-laugh',
    '😭': 'fas fa-sad-cry',
    '🪑': 'fas fa-chair',
    '🚪': 'fas fa-door-open',
    '🪟': 'fas fa-window-maximize',
    '🔑': 'fas fa-key',
    '📱': 'fas fa-mobile-alt',
    '💻': 'fas fa-laptop',
    '👗': 'fas fa-tshirt',
    '👖': 'fas fa-socks',
    '👔': 'fas fa-user-tie',
    '👠': 'fas fa-shoe-prints',
    '🎩': 'fas fa-hat-cowboy',
    '👜': 'fas fa-shopping-bag',
    '🧤': 'fas fa-mitten',
    '🧭': 'fas fa-compass',
    '🗺️': 'fas fa-map',
    '🏥': 'fas fa-hospital',
    '🏠': 'fas fa-home',
    '💼': 'fas fa-briefcase',
    '🌿': 'fas fa-seedling',
    '📦': 'fas fa-box',
    '🔢': 'fas fa-hashtag',
    '📍': 'fas fa-map-marker-alt',
    '👆': 'fas fa-hand-point-up',
    '🎓': 'fas fa-graduation-cap',
    '⚽': 'fas fa-futbol',
    '⏰': 'fas fa-clock',
    '🎯': 'fas fa-bullseye',
    '🌤️': 'fas fa-cloud-sun',
    // Additional emojis found to be missing from the mapping
    '🐾': 'fas fa-paw',
    '👤': 'fas fa-user',
    '👁️': 'fas fa-eye',
    '👕': 'fas fa-tshirt',
    '🎨': 'fas fa-palette',
    '👫': 'fas fa-user-friends',
    '💑': 'fas fa-heart',
    '👨‍🦳': 'fas fa-male',
    '👩‍🦳': 'fas fa-female',
    '💰': 'fas fa-money-bill',
    '🍽️': 'fas fa-utensils',
    '🌧️': 'fas fa-cloud-rain',
    '❄️': 'fas fa-snowflake',
    '☀️': 'fas fa-sun',
    '💨': 'fas fa-wind',
    '✏️': 'fas fa-pen'
  };
  
  return emojiToFontAwesome[emoji] || 'fas fa-book';
}

// Run the import
importVocabulary();