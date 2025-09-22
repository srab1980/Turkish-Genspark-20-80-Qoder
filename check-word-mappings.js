#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function checkSpecificWords() {
  try {
    console.log('Checking specific word mappings...');
    
    // Check some specific words to see their current icons
    const wordsToCheck = ['zencefil', 'karanfil', 'elma', 'muz', 'portakal'];
    
    for (const word of wordsToCheck) {
      const result = await query(
        'SELECT turkish_text, svg_icon FROM vocabulary WHERE turkish_text = ? AND is_active = 1',
        [word]
      );
      
      if (result && result.length > 0) {
        console.log(`${word} -> ${result[0].svg_icon}`);
      } else {
        console.log(`${word} -> Not found`);
      }
    }
    
  } catch (error) {
    console.error('Error checking words:', error.message);
  }
}

checkSpecificWords();