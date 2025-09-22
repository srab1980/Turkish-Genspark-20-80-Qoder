// Debug script to test learning flow
import axios from 'axios';

async function debugLearningFlow() {
    console.log('🔍 Testing learning flow...');
    
    try {
        // Test API endpoints
        console.log('\n1. Testing API endpoints:');
        const categoriesRes = await axios.get('http://localhost:3000/api/categories');
        const wordsRes = await axios.get('http://localhost:3000/api/words');
        
        console.log(`✅ Categories API: ${categoriesRes.data.categories.length} categories`);
        console.log(`✅ Words API: ${wordsRes.data.words.length} words`);
        
        // Simulate category click
        const firstCategory = categoriesRes.data.categories[0];
        console.log(`\n2. Simulating click on category: ${firstCategory.id}`);
        
        // Get words for this category
        const categoryWords = wordsRes.data.words.filter(word => {
            // Match the same logic as in the app
            const getWordCategory = (wordId) => {
                if (wordId <= 6) return 'greetings';
                if (wordId <= 12) return 'travel';
                if (wordId <= 18) return 'food';
                if (wordId <= 24) return 'shopping';
                if (wordId <= 30) return 'directions';
                if (wordId <= 36) return 'emergency';
                if (wordId <= 42) return 'time';
                if (wordId <= 48) return 'numbers';
                return 'greetings';
            };
            return getWordCategory(word.id) === firstCategory.id;
        });
        
        console.log(`✅ Found ${categoryWords.length} words for category ${firstCategory.id}`);
        console.log('Sample words:', categoryWords.slice(0, 2).map(w => `${w.turkish} (${w.arabic})`));
        
        // Test learning data structure
        const learningData = {
            category: firstCategory.id,
            words: categoryWords
        };
        
        console.log('\n3. Learning data structure:');
        console.log('Category:', learningData.category);
        console.log('Word count:', learningData.words.length);
        console.log('First word:', learningData.words[0]);
        
        // Test if we can access the service
        const healthCheck = await axios.get('http://localhost:3000/api/words/1');
        console.log('\n4. Service health check: ✅ OK');
        
    } catch (error) {
        console.error('❌ Error during testing:', error.message);
    }
}

debugLearningFlow();