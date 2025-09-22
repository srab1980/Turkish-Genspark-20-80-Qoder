#!/usr/bin/env node

import { query } from './src/database/db-connector.js';

async function checkTableStructure() {
  try {
    console.log('Checking actual table structure in SQLite database...');
    
    // Get the actual table info from SQLite
    const tableInfo = await query("PRAGMA table_info(vocabulary)");
    console.log('\nVocabulary table structure:');
    console.log(tableInfo);
    
    const categoryInfo = await query("PRAGMA table_info(categories)");
    console.log('\nCategories table structure:');
    console.log(categoryInfo);
    
    // Check if there's an svg_icon column
    const hasSvgIcon = Array.isArray(tableInfo) && tableInfo.some(col => col.name === 'svg_icon');
    console.log(`\nHas svg_icon column: ${hasSvgIcon}`);
    
    // Check what the actual icon column is named
    const iconColumn = Array.isArray(tableInfo) && tableInfo.find(col => col.name.includes('icon') || col.name.includes('Icon'));
    console.log(`Icon column name: ${iconColumn ? iconColumn.name : 'Not found'}`);
    
    // Check a few sample records
    console.log('\nSample vocabulary records:');
    const samples = await query("SELECT * FROM vocabulary LIMIT 3");
    console.log(samples);
    
    console.log('\nSample categories:');
    const categories = await query("SELECT * FROM categories LIMIT 3");
    console.log(categories);
    
  } catch (error) {
    console.error('Error checking table structure:', error.message);
    process.exit(1);
  }
}

checkTableStructure();