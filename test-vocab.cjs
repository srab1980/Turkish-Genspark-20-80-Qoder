const { default: fetch } = require('node-fetch');

async function testVocabularyCreation() {
  try {
    // Test data with all the new fields
    const testData = {
      category_id: 1,
      turkish_text: "Test Kelime",
      arabic_text: "كلمة تجريبية",
      example_sentence_tr: "Bu bir test cümlesidir.",
      example_sentence_ar: "هذه جملة اختبار.",
      svg_icon: "fas fa-star",
      word_type: "noun",
      difficulty_level: "beginner",
      turkish_pronunciation: "test ke-li-me",
      english_definition: "Test word",
      example_sentence_en: "This is a test sentence.",
      audio_url: "",
      image_url: "",
      frequency_score: 5
    };

    console.log('Testing vocabulary creation with data:', testData);

    // Make the API request
    const response = await fetch('http://localhost:5179/api/admin/vocabulary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log('API Response:', result);

    if (result.success) {
      console.log('✅ Vocabulary creation test PASSED');
      console.log('Created vocabulary with ID:', result.id);
    } else {
      console.log('❌ Vocabulary creation test FAILED');
      console.log('Error message:', result.message);
    }
  } catch (error) {
    console.log('❌ Vocabulary creation test FAILED with exception');
    console.log('Error:', error.message);
  }
}

// Run the test
testVocabularyCreation();