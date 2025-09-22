#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function checkDbStructure() {
  try {
    console.log('Checking database structure...');
    
    // Check vocabulary table structure
    const vocabColumns = await query("PRAGMA table_info(vocabulary)");
    console.log('Vocabulary table columns:');
    console.log(vocabColumns);
    
    // Check categories table structure
    const categoryColumns = await query("PRAGMA table_info(categories)");
    console.log('\nCategories table columns:');
    console.log(categoryColumns);
    
    // Check a sample record
    console.log('\nSample vocabulary record:');
    const sample = await query("SELECT * FROM vocabulary LIMIT 1");
    console.log(sample);
    
  } catch (error) {
    console.error('Error checking database structure:', error.message);
  }
}

checkDbStructure();