#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function checkSchema() {
  try {
    console.log('Checking vocabulary table schema...');
    
    // Get the schema for the vocabulary table
    const schema = await query("SELECT sql FROM sqlite_master WHERE type='table' AND name='vocabulary'");
    console.log('Vocabulary table schema:');
    console.log(schema[0].sql);
    
    console.log('\nChecking categories table schema...');
    const categorySchema = await query("SELECT sql FROM sqlite_master WHERE type='table' AND name='categories'");
    console.log('Categories table schema:');
    console.log(categorySchema[0].sql);
    
    // Check a few sample records to see current icon values
    console.log('\nSample vocabulary records:');
    const samples = await query("SELECT id, turkish_text, svg_icon FROM vocabulary LIMIT 5");
    console.log(samples);
    
  } catch (error) {
    console.error('Error checking schema:', error.message);
    process.exit(1);
  }
}

checkSchema();