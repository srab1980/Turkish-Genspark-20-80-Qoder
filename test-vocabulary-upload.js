// Test script to verify vocabulary upload functionality
import { writeFileSync } from 'fs';

// Test data
const testVocabulary = [
  {
    turkish_text: "Test Kelime",
    english_text: "Test Word",
    category_id: 1,
    word_type: "noun",
    difficulty_level: "beginner"
  },
  {
    turkish_text: "Örnek Kelime",
    english_text: "Sample Word",
    category_id: 2,
    word_type: "noun",
    difficulty_level: "beginner"
  }
];

// Create a simple CSV file for testing
const csvContent = `turkish_text,english_text,category_id,word_type,difficulty_level
Test Kelime,Test Word,1,noun,beginner
Örnek Kelime,Sample Word,2,noun,beginner`;

writeFileSync('test-upload.csv', csvContent);
console.log('Test CSV file created: test-upload.csv');

console.log('To test the upload functionality:');
console.log('1. Open the admin panel at http://localhost:5180/admin');
console.log('2. Navigate to the Vocabulary section');
console.log('3. Click the "Upload CSV" button');
console.log('4. Select the test-upload.csv file');
console.log('5. Click "Upload" to test the functionality');