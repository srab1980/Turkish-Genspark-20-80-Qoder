// Test script to verify session functionality
console.log('🧪 Testing Session Functionality');

// Test 1: Check if session manager exists
console.log('1. Session Manager Available:', !!window.vocabularySessions);
console.log('2. Enhanced Vocabulary Data:', !!window.enhancedVocabularyData);

// Test 2: Create sessions for a test category
if (window.vocabularySessions && window.enhancedVocabularyData) {
    try {
        // Test with 'adjective' category
        const categoryData = window.enhancedVocabularyData['adjective'];
        if (categoryData && categoryData.words) {
            const sessions = window.vocabularySessions.createSessionsFromWords(categoryData.words, 'adjective');
            console.log(`3. ✅ Created ${sessions.length} sessions for adjective category`);
            console.log(`4. First session has ${sessions[0].words.length} words`);
            console.log(`5. Session structure:`, sessions[0]);
            
            // Test difficulty levels in first session
            const firstSessionWords = sessions[0].words;
            const difficultyLevels = firstSessionWords.map(w => w.difficultyLevel);
            console.log(`6. Difficulty levels in first session:`, difficultyLevels);
            
        } else {
            console.log('3. ❌ No adjective category data found');
        }
    } catch (error) {
        console.log('3. ❌ Error creating sessions:', error);
    }
} else {
    console.log('3. ❌ Required components not available');
}

console.log('🧪 Session functionality test completed');
