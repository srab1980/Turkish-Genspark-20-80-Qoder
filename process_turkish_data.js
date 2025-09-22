// 📊 Turkish Language Data Processor
// Process and integrate the comprehensive Turkish language CSV dataset

import fs from 'fs';
import path from 'path';

class TurkishDataProcessor {
    constructor() {
        this.csvFile = 'turkish_language_data.csv';
        this.outputFile = 'public/static/enhanced-vocabulary-database.js';
        this.stats = {
            totalRows: 0,
            processedWords: 0,
            duplicates: 0,
            categories: new Map(),
            difficultyLevels: new Map(),
            vowelHarmonyTypes: new Map()
        };
        
        // Category mapping based on word context and semantics
        this.categoryMapping = {
            // Greetings & Social
            'merhaba': 'greetings', 'günaydın': 'greetings', 'iyi': 'greetings',
            'teşekkür': 'greetings', 'lütfen': 'greetings', 'özür': 'greetings',
            
            // Travel & Transportation  
            'havaalanı': 'travel', 'otobüs': 'travel', 'tren': 'travel', 'taksi': 'travel',
            'otel': 'travel', 'istasyon': 'travel', 'bilet': 'travel', 'çanta': 'travel',
            'pasaport': 'travel', 'uçak': 'travel', 'gemi': 'travel', 'araba': 'travel',
            
            // Food & Dining
            'yemek': 'food', 'su': 'food', 'ekmek': 'food', 'et': 'food',
            'sebze': 'food', 'meyve': 'food', 'çay': 'food', 'kahve': 'food',
            'tuz': 'food', 'şeker': 'food', 'süt': 'food', 'peynir': 'food',
            'balık': 'food', 'tavuk': 'food', 'bardak': 'food', 'çatal': 'food',
            
            // Shopping & Commerce
            'para': 'shopping', 'alışveriş': 'shopping', 'mağaza': 'shopping',
            'fiyat': 'shopping', 'satın': 'shopping', 'ücret': 'shopping',
            'kart': 'shopping', 'nakit': 'shopping', 'indirim': 'shopping',
            
            // Directions & Places
            'sol': 'directions', 'sağ': 'directions', 'ileri': 'directions',
            'geri': 'directions', 'yukarı': 'directions', 'aşağı': 'directions',
            'cadde': 'directions', 'sokak': 'directions', 'park': 'directions',
            'köprü': 'directions', 'binา': 'directions', 'adres': 'directions',
            
            // Emergency & Health
            'hastane': 'emergency', 'doktor': 'emergency', 'polis': 'emergency',
            'itfaiye': 'emergency', 'ambulans': 'emergency', 'yardım': 'emergency',
            'acil': 'emergency', 'ağrı': 'emergency', 'hasta': 'emergency',
            
            // Time & Numbers  
            'saat': 'time', 'dakika': 'time', 'gün': 'time', 'hafta': 'time',
            'ay': 'time', 'yıl': 'time', 'bugün': 'time', 'yarın': 'time',
            'dün': 'time', 'şimdi': 'time', 'temmuz': 'time',
            
            // Numbers
            'bir': 'numbers', 'iki': 'numbers', 'üç': 'numbers', 'dört': 'numbers',
            'beş': 'numbers', 'altı': 'numbers', 'yedi': 'numbers', 'sekiz': 'numbers',
            'dokuz': 'numbers', 'on': 'numbers', 'yüz': 'numbers', 'bin': 'numbers'
        };
        
        // Enhanced vocabulary with metadata
        this.processedVocabulary = {
            greetings: [],
            travel: [],
            food: [],
            shopping: [],
            directions: [],
            emergency: [],
            time: [],
            numbers: [],
            general: [] // For words that don't fit specific categories
        };
    }
    
    // Read and parse CSV file
    readCSVFile() {
        try {
            const content = fs.readFileSync(this.csvFile, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());
            
            console.log(`📊 Loaded ${lines.length} lines from CSV`);
            
            // Skip header row
            const dataLines = lines.slice(1);
            this.stats.totalRows = dataLines.length;
            
            return dataLines.map(line => this.parseCSVLine(line));
        } catch (error) {
            console.error('❌ Error reading CSV file:', error);
            return [];
        }
    }
    
    // Parse individual CSV line with proper handling of commas in quoted fields
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        
        // Remove carriage return if present
        if (result[result.length - 1].endsWith('\r')) {
            result[result.length - 1] = result[result.length - 1].slice(0, -1);
        }
        
        return {
            word: result[0] || '',
            difficultyLevel: result[1] || 'A1',
            vowelHarmony: result[2] || 'Mixed',
            arabic: result[3] || '',
            turkishSentence: result[4] || '',
            arabicSentence: result[5] || ''
        };
    }
    
    // Categorize word based on semantic context
    categorizeWord(word) {
        const lowerWord = word.toLowerCase();
        
        // Check direct mappings first
        for (const [key, category] of Object.entries(this.categoryMapping)) {
            if (lowerWord.includes(key) || key.includes(lowerWord)) {
                return category;
            }
        }
        
        // Semantic rules for categorization
        if (this.isGreeting(lowerWord)) return 'greetings';
        if (this.isTravel(lowerWord)) return 'travel'; 
        if (this.isFood(lowerWord)) return 'food';
        if (this.isShopping(lowerWord)) return 'shopping';
        if (this.isDirection(lowerWord)) return 'directions';
        if (this.isEmergency(lowerWord)) return 'emergency';
        if (this.isTime(lowerWord)) return 'time';
        if (this.isNumber(lowerWord)) return 'numbers';
        
        return 'general';
    }
    
    // Semantic categorization helpers
    isGreeting(word) {
        const greetingKeywords = ['selam', 'hoş', 'elveda', 'görüşürüz', 'tanış'];
        return greetingKeywords.some(keyword => word.includes(keyword));
    }
    
    isTravel(word) {
        const travelKeywords = ['yol', 'seyahat', 'gitmek', 'gel', 'varış', 'ayrılış', 'yer', 'turist'];
        return travelKeywords.some(keyword => word.includes(keyword));
    }
    
    isFood(word) {
        const foodKeywords = ['ye', 'iç', 'lezz', 'tat', 'aç', 'tok', 'pişir', 'restoran', 'lokanta'];
        return foodKeywords.some(keyword => word.includes(keyword));
    }
    
    isShopping(word) {
        const shoppingKeywords = ['al', 'sat', 'ödeme', 'hesap', 'kasiyer', 'müşteri', 'ürün'];
        return shoppingKeywords.some(keyword => word.includes(keyword));
    }
    
    isDirection(word) {
        const directionKeywords = ['yön', 'yer', 'konum', 'mesafe', 'yakın', 'uzak', 'orta', 'köşe'];
        return directionKeywords.some(keyword => word.includes(keyword));
    }
    
    isEmergency(word) {
        const emergencyKeywords = ['tehlike', 'güven', 'kaza', 'yaralanma', 'çağır', 'kayıp'];
        return emergencyKeywords.some(keyword => word.includes(keyword));
    }
    
    isTime(word) {
        const timeKeywords = ['zaman', 'erken', 'geç', 'öğle', 'akşam', 'gece', 'sabah'];
        return timeKeywords.some(keyword => word.includes(keyword));
    }
    
    isNumber(word) {
        const numberKeywords = ['sayı', 'rakam', 'çok', 'az', 'kaç', 'birkaç'];
        return numberKeywords.some(keyword => word.includes(keyword));
    }
    
    // Normalize vowel harmony notation
    normalizeVowelHarmony(harmony) {
        const normalized = harmony.toLowerCase().trim();
        
        if (normalized.includes('i-type') || normalized.includes('back')) {
            return 'I-type (back)';
        } else if (normalized.includes('e-type') || normalized.includes('front')) {
            return 'E-type (front)';
        } else if (normalized.includes('mixed')) {
            return 'Mixed';
        } else {
            return 'Mixed'; // Default fallback
        }
    }
    
    // Generate pronunciation guide (simplified phonetic)
    generatePronunciation(turkishWord) {
        // Simplified Turkish pronunciation rules
        let pronunciation = turkishWord.toLowerCase();
        
        // Turkish specific mappings
        const pronunciationMap = {
            'ç': 'ch',
            'ğ': 'gh',
            'ı': 'uh', 
            'î': 'ee',
            'ö': 'oe',
            'ş': 'sh',
            'ü': 'ue',
            'c': 'j',
            'j': 'zh'
        };
        
        for (const [turkish, phonetic] of Object.entries(pronunciationMap)) {
            pronunciation = pronunciation.replace(new RegExp(turkish, 'g'), phonetic);
        }
        
        // Add syllable breaks for longer words
        if (pronunciation.length > 6) {
            pronunciation = pronunciation.replace(/([aeiouöüıi])([bcdfghjklmnpqrstvwxyzçğş]{2,})/g, '$1-$2');
        }
        
        return pronunciation.toUpperCase();
    }
    
    // Generate appropriate icon for word based on category and meaning
    generateIcon(word, category) {
        const iconMap = {
            // Word-specific icons
            'merhaba': 'fas fa-hand-wave',
            'günaydın': 'fas fa-sun',
            'su': 'fas fa-tint',
            'ekmek': 'fas fa-bread-slice',
            'araba': 'fas fa-car',
            'ev': 'fas fa-home',
            'aile': 'fas fa-users',
            'para': 'fas fa-coins',
            'zaman': 'fas fa-clock',
            'kitap': 'fas fa-book',
            'okul': 'fas fa-school',
            'hastane': 'fas fa-hospital',
            'telefon': 'fas fa-phone',
            
            // Category fallbacks
            'greetings': 'fas fa-handshake',
            'travel': 'fas fa-plane',
            'food': 'fas fa-utensils', 
            'shopping': 'fas fa-shopping-cart',
            'directions': 'fas fa-compass',
            'emergency': 'fas fa-exclamation-triangle',
            'time': 'fas fa-clock',
            'numbers': 'fas fa-calculator',
            'general': 'fas fa-language'
        };
        
        // Check word-specific first
        const lowerWord = word.toLowerCase();
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerWord.includes(key) || key.includes(lowerWord)) {
                return icon;
            }
        }
        
        // Fallback to category icon
        return iconMap[category] || iconMap['general'];
    }
    
    // Generate emoji for word based on semantic meaning
    generateEmoji(word, category) {
        const emojiMap = {
            // Specific words
            'merhaba': '👋', 'günaydın': '☀️', 'gece': '🌙',
            'su': '💧', 'ekmek': '🍞', 'çay': '🍵', 'kahve': '☕',
            'araba': '🚗', 'otobüs': '🚌', 'tren': '🚂', 'uçak': '✈️',
            'ev': '🏠', 'okul': '🏫', 'hastane': '🏥', 'mağaza': '🏪',
            'aile': '👨‍👩‍👧‍👦', 'çocuk': '👶', 'anne': '👩', 'baba': '👨',
            'köpek': '🐕', 'kedi': '🐱', 'kuş': '🐦',
            'para': '💰', 'telefon': '📱', 'bilgisayar': '💻',
            'kitap': '📚', 'kalem': '✏️',
            'güneş': '☀️', 'ay': '🌙', 'yıldız': '⭐',
            
            // Category fallbacks
            'greetings': '🤝', 'travel': '🧳', 'food': '🍽️',
            'shopping': '🛒', 'directions': '🧭', 'emergency': '🚨',
            'time': '⏰', 'numbers': '🔢', 'general': '📖'
        };
        
        const lowerWord = word.toLowerCase();
        for (const [key, emoji] of Object.entries(emojiMap)) {
            if (lowerWord.includes(key) || key.includes(lowerWord)) {
                return emoji;
            }
        }
        
        return emojiMap[category] || emojiMap['general'];
    }
    
    // Process and clean the data
    processData() {
        console.log('🔄 Processing Turkish language data...');
        
        const rawData = this.readCSVFile();
        const processedWords = new Map(); // Use Map to handle duplicates
        
        rawData.forEach((row, index) => {
            if (!row.word || !row.arabic) {
                console.log(`⚠️ Skipping incomplete row ${index + 1}: missing word or translation`);
                return;
            }
            
            // Create unique key to handle duplicates
            const key = `${row.word.toLowerCase()}_${row.arabic}`;
            
            if (processedWords.has(key)) {
                this.stats.duplicates++;
                return;
            }
            
            // Determine category
            const category = this.categorizeWord(row.word);
            
            // Process and enhance the word data
            const processedWord = {
                id: processedWords.size + 1,
                turkish: row.word,
                arabic: row.arabic,
                english: this.translateToEnglish(row.word, row.arabic), // Approximate
                pronunciation: this.generatePronunciation(row.word),
                example: row.turkishSentence,
                exampleArabic: row.arabicSentence,
                category: category,
                difficultyLevel: row.difficultyLevel,
                vowelHarmony: this.normalizeVowelHarmony(row.vowelHarmony),
                icon: this.generateIcon(row.word, category),
                emoji: this.generateEmoji(row.word, category)
            };
            
            processedWords.set(key, processedWord);
            
            // Add to category
            if (!this.processedVocabulary[category]) {
                this.processedVocabulary[category] = [];
            }
            this.processedVocabulary[category].push(processedWord);
            
            // Update statistics
            this.stats.processedWords++;
            this.stats.categories.set(category, (this.stats.categories.get(category) || 0) + 1);
            this.stats.difficultyLevels.set(row.difficultyLevel, (this.stats.difficultyLevels.get(row.difficultyLevel) || 0) + 1);
            this.stats.vowelHarmonyTypes.set(this.normalizeVowelHarmony(row.vowelHarmony), 
                (this.stats.vowelHarmonyTypes.get(this.normalizeVowelHarmony(row.vowelHarmony)) || 0) + 1);
        });
        
        console.log('✅ Data processing complete');
        this.printStats();
    }
    
    // Simple English translation approximation (for multilingual support)
    translateToEnglish(turkish, arabic) {
        const quickTranslations = {
            'merhaba': 'hello', 'günaydın': 'good morning', 'su': 'water',
            'ekmek': 'bread', 'ev': 'house', 'araba': 'car', 'gün': 'day',
            'para': 'money', 'zaman': 'time', 'aile': 'family', 'çocuk': 'child',
            'okul': 'school', 'kitap': 'book', 'çay': 'tea', 'kahve': 'coffee'
        };
        
        const lowerTurkish = turkish.toLowerCase();
        for (const [tr, en] of Object.entries(quickTranslations)) {
            if (lowerTurkish.includes(tr)) return en;
        }
        
        return 'word'; // Generic fallback
    }
    
    // Print processing statistics
    printStats() {
        console.log('\n📊 Processing Statistics:');
        console.log(`Total rows processed: ${this.stats.totalRows}`);
        console.log(`Words processed: ${this.stats.processedWords}`);
        console.log(`Duplicates removed: ${this.stats.duplicates}`);
        
        console.log('\n📂 Categories:');
        for (const [category, count] of this.stats.categories) {
            console.log(`  ${category}: ${count} words`);
        }
        
        console.log('\n📈 Difficulty Levels:');
        for (const [level, count] of this.stats.difficultyLevels) {
            console.log(`  ${level}: ${count} words`);
        }
        
        console.log('\n🔤 Vowel Harmony Types:');
        for (const [type, count] of this.stats.vowelHarmonyTypes) {
            console.log(`  ${type}: ${count} words`);
        }
    }
    
    // Generate the enhanced vocabulary database file
    generateOutputFile() {
        console.log('📝 Generating enhanced vocabulary database...');
        
        const outputContent = `// 📚 Enhanced Turkish Vocabulary Database
// Generated from comprehensive Turkish Language Data CSV
// Total words: ${this.stats.processedWords} | Categories: ${this.stats.categories.size}

// Enhanced vocabulary data with difficulty levels, vowel harmony, and contextual examples
const enhancedVocabularyData = ${JSON.stringify(this.processedVocabulary, null, 2)};

// Statistics and metadata
const vocabularyMetadata = {
    totalWords: ${this.stats.processedWords},
    categories: ${this.stats.categories.size},
    difficultyLevels: ${JSON.stringify(Object.fromEntries(this.stats.difficultyLevels))},
    vowelHarmonyTypes: ${JSON.stringify(Object.fromEntries(this.stats.vowelHarmonyTypes))},
    generatedAt: '${new Date().toISOString()}',
    sourceFile: 'Turkish Language Data.csv'
};

// Difficulty level information
const difficultyLevels = {
    'A1': { name: 'مبتدئ', description: 'كلمات أساسية للمبتدئين', color: '#10b981' },
    'A2': { name: 'أساسي', description: 'مفردات أساسية متقدمة', color: '#3b82f6' },
    'B1': { name: 'متوسط', description: 'كلمات متوسطة المستوى', color: '#f59e0b' },
    'B2': { name: 'متوسط متقدم', description: 'مفردات متقدمة', color: '#ef4444' },
    'C1': { name: 'متقدم', description: 'كلمات متقدمة ومعقدة', color: '#8b5cf6' },
    'C2': { name: 'إتقان', description: 'مستوى الإتقان الكامل', color: '#1f2937' }
};

// Vowel harmony rules information  
const vowelHarmonyRules = {
    'I-type (back)': { 
        description: 'الحروف الصوتية الخلفية (a, ı, o, u)',
        suffixes: ['-lar', '-dan', '-a'],
        example: 'kitap → kitaplar'
    },
    'E-type (front)': { 
        description: 'الحروف الصوتية الأمامية (e, i, ö, ü)',
        suffixes: ['-ler', '-den', '-e'], 
        example: 'ev → evler'
    },
    'Mixed': { 
        description: 'خليط من الحروف الصوتية',
        suffixes: ['-ler/-lar'],
        example: 'varies by context'
    }
};

// Export for use by learning modules
if (typeof window !== 'undefined') {
    window.enhancedVocabularyData = enhancedVocabularyData;
    window.vocabularyMetadata = vocabularyMetadata;
    window.difficultyLevels = difficultyLevels;
    window.vowelHarmonyRules = vowelHarmonyRules;
    
    console.log('📚 Enhanced vocabulary database loaded:', vocabularyMetadata);
} else {
    module.exports = { 
        enhancedVocabularyData, 
        vocabularyMetadata, 
        difficultyLevels,
        vowelHarmonyRules 
    };
}`;
        
        // Write to output file
        fs.writeFileSync(this.outputFile, outputContent, 'utf-8');
        console.log(`✅ Enhanced database saved to: ${this.outputFile}`);
    }
    
    // Main processing function
    process() {
        console.log('🚀 Starting Turkish Language Data Processing...\n');
        
        try {
            this.processData();
            this.generateOutputFile();
            
            console.log('\n🎉 Processing completed successfully!');
            console.log(`📊 Total words processed: ${this.stats.processedWords}`);
            console.log(`📂 Categories created: ${this.stats.categories.size}`);
            console.log(`📁 Output file: ${this.outputFile}`);
            
        } catch (error) {
            console.error('❌ Processing failed:', error);
        }
    }
}

// Run the processor
const processor = new TurkishDataProcessor();
processor.process();