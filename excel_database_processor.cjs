#!/usr/bin/env node

/**
 * Excel Database Processor - Turkish Language Learning
 * Processes the categorized Excel file and generates enhanced vocabulary database
 */

const XLSX = require('xlsx');
const fs = require('fs');

class ExcelDatabaseProcessor {
    constructor(excelFile) {
        this.excelFile = excelFile;
        this.words = [];
        this.categories = {};
        this.stats = {
            totalWords: 0,
            totalCategories: 0,
            difficultyLevels: {},
            vowelHarmonyTypes: {}
        };
    }

    /**
     * Load and process Excel data
     */
    loadExcelData() {
        console.log('📊 Loading Excel data...');
        
        const workbook = XLSX.readFile(this.excelFile);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log(`   Found ${jsonData.length} words in Excel file`);
        return jsonData;
    }

    /**
     * Generate contextual emoji for Turkish words
     */
    generateWordEmoji(word, category, arabic) {
        const wordLower = word.toLowerCase().trim();
        
        // Comprehensive word-specific emoji mappings
        const wordEmojis = {
            // Family & People
            'anne': '👩', 'baba': '👨', 'çocuk': '👶', 'aile': '👨‍👩‍👧‍👦', 'kardeş': '👫',
            'abla': '👩‍🦳', 'abi': '👨‍🦳', 'ağabey': '👨', 'arkadaş': '👫', 'eş': '💑',
            
            // Body Parts
            'göz': '👁️', 'el': '✋', 'ayak': '🦶', 'baş': '🤕', 'kalp': '❤️',
            'ağız': '👄', 'burun': '👃', 'kulak': '👂', 'diş': '🦷', 'saç': '💇',
            
            // Food & Drinks
            'ekmek': '🍞', 'su': '💧', 'çay': '🫖', 'kahve': '☕', 'süt': '🥛',
            'yumurta': '🥚', 'et': '🥩', 'balık': '🐟', 'meyve': '🍎', 'sebze': '🥬',
            
            // Animals
            'köpek': '🐕', 'kedi': '🐱', 'kuş': '🐦', 'at': '🐎', 'inek': '🐄',
            'koyun': '🐑', 'tavuk': '🐓', 'aslan': '🦁', 'fil': '🐘', 'ayı': '🐻',
            
            // Transportation
            'araba': '🚗', 'otobüs': '🚌', 'uçak': '✈️', 'tren': '🚂', 'gemi': '🚢',
            'bisiklet': '🚲', 'taksi': '🚕', 'metro': '🚇',
            
            // Colors
            'kırmızı': '🔴', 'mavi': '🔵', 'yeşil': '🟢', 'sarı': '🟡', 'siyah': '⚫',
            'beyaz': '⚪', 'pembe': '🩷', 'mor': '🟣', 'turuncu': '🟠',
            
            // Numbers
            'bir': '1️⃣', 'iki': '2️⃣', 'üç': '3️⃣', 'dört': '4️⃣', 'beş': '5️⃣',
            'altı': '6️⃣', 'yedi': '7️⃣', 'sekiz': '8️⃣', 'dokuz': '9️⃣', 'on': '🔟',
            
            // Time & Weather
            'gün': '📅', 'saat': '🕐', 'ay': '🗓️', 'yıl': '📅', 'bugün': '📅',
            'güneş': '☀️', 'yağmur': '🌧️', 'kar': '❄️', 'rüzgar': '💨',
            
            // Emotions
            'mutlu': '😊', 'üzgün': '😢', 'kızgın': '😠', 'korkmak': '😨',
            'sevmek': '❤️', 'gülmek': '😄', 'ağlamak': '😭',
            
            // Objects & Tools
            'kitap': '📚', 'kalem': '✏️', 'masa': '🪑', 'sandalye': '🪑', 'kapı': '🚪',
            'pencere': '🪟', 'anahtar': '🔑', 'telefon': '📱', 'bilgisayar': '💻',
            
            // Clothing
            'elbise': '👗', 'pantolon': '👖', 'gömlek': '👔', 'ayakkabı': '👠',
            'şapka': '🎩', 'çanta': '👜', 'eldiven': '🧤'
        };

        // Try exact word match first
        if (wordEmojis[wordLower]) {
            return wordEmojis[wordLower];
        }

        // Category-based emoji fallback
        const categoryEmojis = {
            'adjective': '📝',
            'animal': '🐾',
            'body': '👤',
            'clothes': '👕',
            'color': '🎨',
            'direction': '🧭',
            'emotion': '😊',
            'family': '👨‍👩‍👧‍👦',
            'finance': '💰',
            'food': '🍽️',
            'furniture': '🪑',
            'geography': '🗺️',
            'health': '🏥',
            'house': '🏠',
            'job': '💼',
            'nature': '🌿',
            'noun': '📦',
            'number': '🔢',
            'place': '📍',
            'pronoun': '👆',
            'school': '🎓',
            'sport': '⚽',
            'time': '⏰',
            'transport': '🚗',
            'verb': '🎯',
            'weather': '🌤️'
        };

        return categoryEmojis[category] || '📚';
    }

    /**
     * Convert category name to Arabic
     */
    getCategoryArabic(category) {
        const arabicCategories = {
            'adjective': 'الصفات',
            'animal': 'الحيوانات',
            'body': 'أجزاء الجسم',
            'clothes': 'الملابس',
            'color': 'الألوان',
            'direction': 'الاتجاهات',
            'emotion': 'المشاعر',
            'family': 'العائلة',
            'finance': 'المالية',
            'food': 'الطعام',
            'furniture': 'الأثاث',
            'geography': 'الجغرافيا',
            'health': 'الصحة',
            'house': 'المنزل',
            'job': 'المهن',
            'nature': 'الطبيعة',
            'noun': 'الأسماء',
            'number': 'الأرقام',
            'place': 'الأماكن',
            'pronoun': 'الضمائر',
            'school': 'المدرسة',
            'sport': 'الرياضة',
            'time': 'الوقت',
            'transport': 'المواصلات',
            'verb': 'الأفعال',
            'weather': 'الطقس'
        };

        return arabicCategories[category] || category;
    }

    /**
     * Process Excel data into structured format
     */
    processData() {
        const rawData = this.loadExcelData();
        
        console.log('🔄 Processing vocabulary data...');
        
        rawData.forEach((row, index) => {
            const word = {
                id: index + 1,
                turkish: row['Word'] || '',
                arabic: row['Arabic Translation'] || '',
                english: row['English Translation'] || 'word', // Add if available
                category: row['Category'] || 'general',
                difficultyLevel: row['Difficulty Level'] || 'A1',
                vowelHarmony: row['Vowel Harmony Rule'] || '',
                turkishSentence: row['Usage Sentence (Turkish)'] || '',
                arabicSentence: row['Usage Sentence (Arabic)'] || '',
                emoji: this.generateWordEmoji(row['Word'] || '', row['Category'] || '', row['Arabic Translation'] || ''),
                icon: this.generateWordEmoji(row['Word'] || '', row['Category'] || '', row['Arabic Translation'] || '')
            };

            this.words.push(word);

            // Update statistics
            if (!this.categories[word.category]) {
                this.categories[word.category] = {
                    id: word.category,
                    name: word.category.charAt(0).toUpperCase() + word.category.slice(1),
                    nameArabic: this.getCategoryArabic(word.category),
                    words: [],
                    icon: this.generateWordEmoji('', word.category, '')
                };
            }
            this.categories[word.category].words.push(word);

            // Difficulty level statistics
            this.stats.difficultyLevels[word.difficultyLevel] = 
                (this.stats.difficultyLevels[word.difficultyLevel] || 0) + 1;

            // Vowel harmony statistics
            this.stats.vowelHarmonyTypes[word.vowelHarmony] = 
                (this.stats.vowelHarmonyTypes[word.vowelHarmony] || 0) + 1;
        });

        this.stats.totalWords = this.words.length;
        this.stats.totalCategories = Object.keys(this.categories).length;

        console.log(`   ✅ Processed ${this.stats.totalWords} words`);
        console.log(`   ✅ Found ${this.stats.totalCategories} categories`);
    }

    /**
     * Generate session-based structure (10 words per session)
     */
    generateSessions() {
        console.log('📋 Generating session structure...');
        
        const sessionsData = {};
        let totalSessions = 0;

        Object.keys(this.categories).forEach(categoryId => {
            const categoryWords = this.categories[categoryId].words;
            const sessions = [];
            
            // Split words into sessions of 10
            for (let i = 0; i < categoryWords.length; i += 10) {
                const sessionWords = categoryWords.slice(i, i + 10);
                const sessionId = `${categoryId}_session_${Math.floor(i / 10) + 1}`;
                
                sessions.push({
                    id: sessionId,
                    sessionNumber: Math.floor(i / 10) + 1,
                    words: sessionWords,
                    wordCount: sessionWords.length,
                    estimatedTime: Math.ceil(sessionWords.length * 1.5), // 1.5 minutes per word
                    difficulty: this.getMostCommonDifficulty(sessionWords)
                });
                
                totalSessions++;
            }
            
            this.categories[categoryId].sessions = sessions;
            this.categories[categoryId].sessionCount = sessions.length;
            this.categories[categoryId].wordCount = categoryWords.length;
        });

        console.log(`   ✅ Generated ${totalSessions} total sessions`);
        return totalSessions;
    }

    /**
     * Get the most common difficulty level in a set of words
     */
    getMostCommonDifficulty(words) {
        const difficultyCount = {};
        words.forEach(word => {
            difficultyCount[word.difficultyLevel] = (difficultyCount[word.difficultyLevel] || 0) + 1;
        });
        
        return Object.keys(difficultyCount).reduce((a, b) => 
            difficultyCount[a] > difficultyCount[b] ? a : b
        );
    }

    /**
     * Generate the complete database file
     */
    generateDatabase() {
        const totalSessions = this.generateSessions();

        const database = {
            metadata: {
                version: '2.0.0',
                generated: new Date().toISOString(),
                source: 'Turkish_Language_Data_categorized_final.xlsx',
                totalWords: this.stats.totalWords,
                totalCategories: this.stats.totalCategories,
                totalSessions: totalSessions,
                wordsPerSession: 10
            },
            statistics: this.stats,
            categories: this.categories,
            allWords: this.words
        };

        // Generate JavaScript file
        const jsContent = `// 🎯 Enhanced Turkish Vocabulary Database - Excel Version
// Generated from Turkish_Language_Data_categorized_final.xlsx
// Total words: ${this.stats.totalWords} | Categories: ${this.stats.totalCategories} | Sessions: ${totalSessions}

// Enhanced vocabulary data organized by categories and sessions
const enhancedVocabularyData = ${JSON.stringify(this.categories, null, 2)};

// Database metadata and statistics  
const vocabularyMetadata = ${JSON.stringify(database.metadata, null, 2)};

const vocabularyStatistics = ${JSON.stringify(this.stats, null, 2)};

// All words in a flat array for search and filtering
const allVocabularyWords = ${JSON.stringify(this.words, null, 2)};

// Export for use in the application
if (typeof window !== 'undefined') {
    window.enhancedVocabularyData = enhancedVocabularyData;
    window.vocabularyMetadata = vocabularyMetadata;
    window.vocabularyStatistics = vocabularyStatistics;
    window.allVocabularyWords = allVocabularyWords;
}`;

        // Save files
        fs.writeFileSync('excel_vocabulary_database.json', JSON.stringify(database, null, 2));
        fs.writeFileSync('public/static/vocabulary-database-excel.js', jsContent);

        console.log('💾 Database files generated:');
        console.log('   📄 excel_vocabulary_database.json (JSON format)');
        console.log('   📄 public/static/vocabulary-database-excel.js (JavaScript format)');

        return database;
    }

    /**
     * Generate category summary report
     */
    generateReport() {
        console.log('\n📊 Database Generation Report');
        console.log('═'.repeat(50));
        
        console.log(`📚 Total Words: ${this.stats.totalWords}`);
        console.log(`📂 Total Categories: ${this.stats.totalCategories}`);
        
        console.log('\n🏷️  Categories by Word Count:');
        console.log('─'.repeat(40));
        
        const sortedCategories = Object.values(this.categories)
            .sort((a, b) => b.wordCount - a.wordCount);
            
        sortedCategories.forEach((cat, index) => {
            console.log(`${String(index + 1).padStart(2)}. ${cat.name.padEnd(15)} | ${String(cat.wordCount).padStart(4)} words | ${String(cat.sessionCount).padStart(2)} sessions`);
        });

        console.log('\n📈 Difficulty Level Distribution:');
        console.log('─'.repeat(40));
        Object.entries(this.stats.difficultyLevels).forEach(([level, count]) => {
            const percentage = ((count / this.stats.totalWords) * 100).toFixed(1);
            console.log(`${level}: ${String(count).padStart(4)} words (${percentage}%)`);
        });

        console.log('\n🔤 Vowel Harmony Distribution:');
        console.log('─'.repeat(40));
        Object.entries(this.stats.vowelHarmonyTypes).forEach(([type, count]) => {
            const percentage = ((count / this.stats.totalWords) * 100).toFixed(1);
            console.log(`${type.padEnd(20)}: ${String(count).padStart(4)} words (${percentage}%)`);
        });
    }
}

// Main execution
async function main() {
    console.log('🚀 Starting Excel Database Processing...\n');

    try {
        const processor = new ExcelDatabaseProcessor('Turkish_Language_Data_categorized_final.xlsx');
        
        processor.processData();
        const database = processor.generateDatabase();
        processor.generateReport();
        
        console.log('\n✅ Excel database processing complete!');
        console.log('🎯 Ready to replace the old categorization system');
        
    } catch (error) {
        console.error('❌ Error processing Excel database:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = ExcelDatabaseProcessor;