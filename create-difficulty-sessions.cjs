#!/usr/bin/env node

/**
 * Create Difficulty-Based Sessions from Excel Data
 * Sorts words by CEFR levels (A1 → A2 → B1 → B2 → C1 → C2) and creates proper sessions
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class DifficultyBasedVocabularyProcessor {
    constructor() {
        this.difficultyOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        this.wordsPerSession = 10;
        this.words = [];
        this.categories = {};
    }
    
    /**
     * Load Excel data
     */
    loadExcelData() {
        console.log('📊 Loading Excel data...');
        
        const excelFile = 'Turkish_Language_Data_categorized_final.xlsx';
        const workbook = XLSX.readFile(excelFile);
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
            'göz': '👁️', 'kulak': '👂', 'burun': '👃', 'ağız': '👄', 'diş': '🦷',
            'el': '✋', 'ayak': '🦶', 'baş': '🗣️', 'saç': '💇', 'yüz': '😊',
            
            // Food & Drinks
            'su': '💧', 'ekmek': '🍞', 'et': '🥩', 'balık': '🐟', 'tavuk': '🐔',
            'süt': '🥛', 'kahve': '☕', 'çay': '🍵', 'meyve': '🍎', 'sebze': '🥕',
            'pirinç': '🍚', 'makarna': '🍝', 'pizza': '🍕', 'hamburger': '🍔',
            
            // Animals
            'kedi': '🐱', 'köpek': '🐶', 'kuş': '🐦', 'balık': '🐟', 'at': '🐎',
            'inek': '🐄', 'koyun': '🐑', 'keçi': '🐐', 'domuz': '🐷', 'tavuk': '🐔',
            
            // Transportation
            'araba': '🚗', 'otobüs': '🚌', 'tren': '🚂', 'uçak': '✈️', 'gemi': '🚢',
            'bisiklet': '🚲', 'motosiklet': '🏍️', 'taksi': '🚕',
            
            // Nature & Weather
            'güneş': '☀️', 'ay': '🌙', 'yıldız': '⭐', 'bulut': '☁️', 'yağmur': '🌧️',
            'kar': '❄️', 'rüzgar': '💨', 'deniz': '🌊', 'ağaç': '🌳', 'çiçek': '🌸',
            
            // Colors
            'kırmızı': '🔴', 'mavi': '🔵', 'sarı': '🟡', 'yeşil': '🟢', 'siyah': '⚫',
            'beyaz': '⚪', 'turuncu': '🟠', 'mor': '🟣', 'pembe': '🩷', 'kahverengi': '🤎',
            
            // Numbers
            'bir': '1️⃣', 'iki': '2️⃣', 'üç': '3️⃣', 'dört': '4️⃣', 'beş': '5️⃣',
            'altı': '6️⃣', 'yedi': '7️⃣', 'sekiz': '8️⃣', 'dokuz': '9️⃣', 'on': '🔟',
            
            // School & Education
            'okul': '🏫', 'kitap': '📚', 'kalem': '✏️', 'defter': '📓', 'öğretmen': '👨‍🏫',
            'öğrenci': '👨‍🎓', 'sınıf': '🚪', 'tahta': '📋',
            
            // Technology
            'telefon': '📱', 'bilgisayar': '💻', 'televizyon': '📺', 'radyo': '📻',
            'internet': '🌐', 'kamera': '📷',
            
            // Default fallbacks by category
            'adjective': '📝', 'verb': '🎯', 'noun': '📚', 'adverb': '⚡'
        };
        
        // Try exact word match first
        if (wordEmojis[wordLower]) {
            return wordEmojis[wordLower];
        }
        
        // Category-based fallback
        const categoryEmojis = {
            'food': '🍽️', 'family': '👨‍👩‍👧‍👦', 'body': '👤', 'animal': '🐾',
            'travel': '✈️', 'house': '🏠', 'school': '🎓', 'work': '💼',
            'time': '⏰', 'weather': '🌤️', 'color': '🎨', 'number': '🔢',
            'sport': '⚽', 'music': '🎵', 'health': '🏥', 'nature': '🌿',
            'technology': '📱', 'clothes': '👕', 'place': '📍',
            'adjective': '📝', 'verb': '🎯', 'science': '🔬'
        };
        
        return categoryEmojis[category] || '📚';
    }
    
    /**
     * Process Excel data into structured format
     */
    processExcelData(excelData) {
        console.log('🔄 Processing Excel data...');
        
        excelData.forEach((row, index) => {
            try {
                const word = {
                    id: index + 1,
                    turkish: row['Word'] || '',
                    arabic: row['Arabic Translation'] || '',
                    english: 'word', // Default placeholder
                    category: (row['Category'] || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
                    difficultyLevel: row['Difficulty Level'] || 'A1',
                    vowelHarmony: row['Vowel Harmony Rule'] || '',
                    turkishSentence: row['Usage Sentence (Turkish)'] || '',
                    arabicSentence: row['Usage Sentence (Arabic)'] || ''
                };
                
                // Generate emoji
                word.emoji = this.generateWordEmoji(word.turkish, word.category, word.arabic);
                word.icon = word.emoji;
                
                // Skip empty entries
                if (!word.turkish || !word.category) {
                    return;
                }
                
                // Add to category
                if (!this.categories[word.category]) {
                    this.categories[word.category] = {
                        id: word.category,
                        name: word.category.charAt(0).toUpperCase() + word.category.slice(1),
                        nameArabic: this.getCategoryArabicName(word.category),
                        words: [],
                        icon: word.emoji
                    };
                }
                
                this.categories[word.category].words.push(word);
                this.words.push(word);
                
            } catch (error) {
                console.warn(`   ⚠️ Skipping row ${index + 1}: ${error.message}`);
            }
        });
        
        console.log(`   ✅ Processed ${this.words.length} words into ${Object.keys(this.categories).length} categories`);
    }
    
    /**
     * Get Arabic name for category
     */
    getCategoryArabicName(category) {
        const arabicNames = {
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
            'general': 'عام',
            'health': 'الصحة',
            'house': 'المنزل',
            'instrument': 'الآلات',
            'measurement': 'القياس',
            'music': 'الموسيقى',
            'nature': 'الطبيعة',
            'number': 'الأرقام',
            'place': 'الأماكن',
            'plant': 'النباتات',
            'pronoun': 'الضمائر',
            'religion': 'الدين',
            'school': 'المدرسة',
            'science': 'العلوم',
            'sport': 'الرياضة',
            'technology': 'التكنولوجيا',
            'time': 'الوقت',
            'travel': 'السفر',
            'verb': 'الأفعال',
            'weather': 'الطقس',
            'work': 'العمل'
        };
        
        return arabicNames[category] || category;
    }
    
    /**
     * Sort words by CEFR difficulty level
     */
    sortWordsByDifficulty(words) {
        return words.sort((a, b) => {
            const levelA = this.difficultyOrder.indexOf(a.difficultyLevel || 'A1');
            const levelB = this.difficultyOrder.indexOf(b.difficultyLevel || 'A1');
            
            // Primary sort: by difficulty level
            if (levelA !== levelB) {
                return levelA - levelB;
            }
            
            // Secondary sort: alphabetically by Turkish word
            return a.turkish.localeCompare(b.turkish, 'tr-TR');
        });
    }
    
    /**
     * Create sessions from sorted words
     */
    createSessionsFromWords(words, categoryId) {
        if (!words || words.length === 0) {
            return [];
        }
        
        // Sort words by difficulty first
        const sortedWords = this.sortWordsByDifficulty(words);
        
        const sessions = [];
        let sessionNumber = 1;
        
        // Create sessions with 10 words each
        for (let i = 0; i < sortedWords.length; i += this.wordsPerSession) {
            const sessionWords = sortedWords.slice(i, i + this.wordsPerSession);
            
            const session = {
                id: `${categoryId}_session_${sessionNumber}`,
                categoryId: categoryId,
                sessionNumber: sessionNumber,
                words: sessionWords,
                wordCount: sessionWords.length,
                completed: false,
                accuracy: 0,
                timeSpent: 0
            };
            
            sessions.push(session);
            sessionNumber++;
        }
        
        return sessions;
    }
    
    /**
     * Process all categories with difficulty-based sessions
     */
    processCategoriesWithSessions() {
        console.log('🎯 Creating difficulty-based sessions...');
        
        for (const [categoryId, categoryData] of Object.entries(this.categories)) {
            // Sort words by difficulty
            categoryData.words = this.sortWordsByDifficulty(categoryData.words);
            
            // Create sessions
            categoryData.sessions = this.createSessionsFromWords(categoryData.words, categoryId);
            categoryData.sessionCount = categoryData.sessions.length;
            categoryData.totalWords = categoryData.words.length;
            
            console.log(`   📚 ${categoryId}: ${categoryData.totalWords} words → ${categoryData.sessionCount} sessions`);
        }
    }
    
    /**
     * Generate vocabulary database file
     */
    generateVocabularyFile() {
        const timestamp = new Date().toISOString();
        let totalWords = this.words.length;
        let totalSessions = 0;
        
        // Count total sessions
        Object.values(this.categories).forEach(category => {
            totalSessions += category.sessions.length;
        });
        
        const content = `// 🎯 Enhanced Turkish Vocabulary Database - Difficulty-Based Sessions
// Generated with CEFR difficulty ordering: A1 → A2 → B1 → B2 → C1 → C2
// Total words: ${totalWords} | Categories: ${Object.keys(this.categories).length} | Sessions: ${totalSessions}
// Generated: ${timestamp}

// Enhanced vocabulary data organized by difficulty levels and sessions
const enhancedVocabularyData = ${JSON.stringify(this.categories, null, 2)};

// Session Manager for vocabulary database compatibility
class SessionManager {
    constructor() {
        this.data = enhancedVocabularyData;
    }
    
    getSessionById(sessionId) {
        for (const categoryData of Object.values(this.data)) {
            if (categoryData.sessions) {
                const session = categoryData.sessions.find(s => s.id === sessionId);
                if (session) {
                    return session;
                }
            }
        }
        return null;
    }
    
    getCategoryData(categoryId) {
        return this.data[categoryId] || null;
    }
    
    getAllCategories() {
        return Object.keys(this.data);
    }
    
    getCategoryStats(categoryId) {
        const category = this.data[categoryId];
        if (!category) return null;
        
        const difficultyCount = {};
        category.words.forEach(word => {
            const level = word.difficultyLevel || 'A1';
            difficultyCount[level] = (difficultyCount[level] || 0) + 1;
        });
        
        return {
            totalWords: category.words.length,
            totalSessions: category.sessions.length,
            difficultyDistribution: difficultyCount
        };
    }
}

// Create global instances
window.enhancedVocabularyData = enhancedVocabularyData;
window.vocabularySessions = new SessionManager();

// Enhanced database metadata
window.enhancedVocabularyMeta = {
    version: "3.0.0",
    generated: "${timestamp}",
    source: "Turkish_Language_Data_categorized_final.xlsx",
    totalWords: ${totalWords},
    totalCategories: ${Object.keys(this.categories).length},
    totalSessions: ${totalSessions},
    difficultyBased: true,
    difficultyOrder: ["A1", "A2", "B1", "B2", "C1", "C2"],
    wordsPerSession: 10
};

console.log('🎯 Enhanced vocabulary database with difficulty-based sessions loaded:', window.enhancedVocabularyMeta);
`;

        return content;
    }
    
    /**
     * Main processing function
     */
    async process() {
        console.log('🚀 Starting difficulty-based vocabulary processing...');
        
        try {
            // Load Excel data
            const excelData = this.loadExcelData();
            
            // Process into structured format
            this.processExcelData(excelData);
            
            // Create difficulty-based sessions
            this.processCategoriesWithSessions();
            
            // Generate new vocabulary file
            const content = this.generateVocabularyFile();
            
            // Write to both public and dist directories
            const publicPath = path.join(__dirname, 'public', 'static', 'enhanced-vocabulary-with-sessions.js');
            const distPath = path.join(__dirname, 'dist', 'static', 'enhanced-vocabulary-with-sessions.js');
            
            fs.writeFileSync(publicPath, content, 'utf8');
            fs.writeFileSync(distPath, content, 'utf8');
            
            console.log('✅ Successfully generated difficulty-based vocabulary database');
            console.log(`   📁 Updated: ${publicPath}`);
            console.log(`   📁 Updated: ${distPath}`);
            
            // Print summary
            let totalSessions = 0;
            Object.values(this.categories).forEach(category => {
                totalSessions += category.sessions.length;
            });
            
            console.log(`📈 Summary: ${this.words.length} words in ${totalSessions} sessions across ${Object.keys(this.categories).length} categories`);
            
            // Print example categories
            console.log('\\n📊 Example categories:');
            Object.entries(this.categories).slice(0, 5).forEach(([id, category]) => {
                const difficulties = {};
                category.words.forEach(word => {
                    difficulties[word.difficultyLevel] = (difficulties[word.difficultyLevel] || 0) + 1;
                });
                console.log(`   ${id}: ${category.totalWords} words, ${category.sessionCount} sessions, levels: ${JSON.stringify(difficulties)}`);
            });
            
        } catch (error) {
            console.error('❌ Error processing vocabulary:', error);
        }
    }
}

// Run the processor
const processor = new DifficultyBasedVocabularyProcessor();
processor.process();