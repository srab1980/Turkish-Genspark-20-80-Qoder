#!/usr/bin/env node

/**
 * Regenerate Enhanced Vocabulary Database with Difficulty-Based Sessions
 * Sorts words by CEFR levels (A1 → A2 → B1 → B2 → C1 → C2) and creates proper sessions
 */

const fs = require('fs');
const path = require('path');

class DifficultyBasedSessionRegeneration {
    constructor() {
        this.difficultyOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        this.wordsPerSession = 10;
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
            
            // Calculate difficulty distribution for this session
            const difficultyCount = this.calculateDifficultyDistribution(sessionWords);
            const primaryDifficulty = this.getPrimaryDifficulty(difficultyCount);
            
            const session = {
                id: `${categoryId}_session_${sessionNumber}`,
                categoryId: categoryId,
                sessionNumber: sessionNumber,
                words: sessionWords,
                wordCount: sessionWords.length,
                difficultyDistribution: difficultyCount,
                primaryDifficulty: primaryDifficulty,
                difficultyRange: this.getDifficultyRange(sessionWords),
                completed: false,
                accuracy: 0,
                timeSpent: 0
            };
            
            sessions.push(session);
            sessionNumber++;
        }
        
        console.log(`   📚 ${categoryId}: ${words.length} words → ${sessions.length} sessions`);
        return sessions;
    }
    
    /**
     * Calculate difficulty level distribution in a session
     */
    calculateDifficultyDistribution(words) {
        const distribution = {};
        
        words.forEach(word => {
            const level = word.difficultyLevel || 'A1';
            distribution[level] = (distribution[level] || 0) + 1;
        });
        
        return distribution;
    }
    
    /**
     * Get the primary difficulty level for a session
     */
    getPrimaryDifficulty(difficultyCount) {
        let maxCount = 0;
        let primaryLevel = 'A1';
        
        for (const [level, count] of Object.entries(difficultyCount)) {
            if (count > maxCount) {
                maxCount = count;
                primaryLevel = level;
            }
        }
        
        return primaryLevel;
    }
    
    /**
     * Get difficulty range for a session
     */
    getDifficultyRange(words) {
        const levels = [...new Set(words.map(w => w.difficultyLevel || 'A1'))]
            .sort((a, b) => this.difficultyOrder.indexOf(a) - this.difficultyOrder.indexOf(b));
        
        if (levels.length === 1) {
            return levels[0];
        } else if (levels.length === 2) {
            return `${levels[0]}-${levels[1]}`;
        } else {
            return `${levels[0]}-${levels[levels.length - 1]}`;
        }
    }
    
    /**
     * Process category with difficulty-based sessions
     */
    processCategoryWithDifficulty(categoryData) {
        if (!categoryData || !categoryData.words) {
            return categoryData;
        }
        
        // Sort words by difficulty
        const sortedWords = this.sortWordsByDifficulty([...categoryData.words]);
        
        // Create new sessions based on difficulty ordering
        const sessions = this.createSessionsFromWords(sortedWords, categoryData.id);
        
        return {
            ...categoryData,
            words: sortedWords, // Update with sorted words
            sessions: sessions,
            sessionCount: sessions.length,
            totalWords: sortedWords.length
        };
    }
    
    /**
     * Load existing vocabulary database
     */
    loadVocabularyDatabase() {
        try {
            const filePath = path.join(__dirname, 'public', 'static', 'enhanced-vocabulary-with-sessions.js');
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract the vocabularyData object
            const match = content.match(/const enhancedVocabularyData = ({[\\s\\S]*?});/);
            if (!match) {
                throw new Error('Could not parse vocabulary data from file');
            }
            
            // Use eval to parse the JavaScript object (in a controlled environment)
            const vocabularyData = eval(`(${match[1]})`);
            console.log('✅ Loaded existing vocabulary database');
            return vocabularyData;
        } catch (error) {
            console.error('❌ Error loading vocabulary database:', error);
            return null;
        }
    }
    
    /**
     * Generate new vocabulary database file
     */
    generateVocabularyFile(vocabularyData) {
        const timestamp = new Date().toISOString();
        let totalWords = 0;
        let totalSessions = 0;
        
        // Count totals
        Object.values(vocabularyData).forEach(category => {
            totalWords += category.words.length;
            totalSessions += category.sessions.length;
        });
        
        const content = `// 🎯 Enhanced Turkish Vocabulary Database - Difficulty-Based Sessions
// Generated with CEFR difficulty ordering: A1 → A2 → B1 → B2 → C1 → C2
// Total words: ${totalWords} | Categories: ${Object.keys(vocabularyData).length} | Sessions: ${totalSessions}
// Generated: ${timestamp}

// Enhanced vocabulary data organized by difficulty levels and sessions
const enhancedVocabularyData = ${JSON.stringify(vocabularyData, null, 2)};

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
    totalCategories: ${Object.keys(vocabularyData).length},
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
     * Main regeneration process
     */
    async regenerate() {
        console.log('🔄 Starting difficulty-based session regeneration...');
        
        // Load existing vocabulary database
        const vocabularyData = this.loadVocabularyDatabase();
        if (!vocabularyData) {
            console.error('❌ Failed to load vocabulary database');
            return;
        }
        
        console.log(`📊 Processing ${Object.keys(vocabularyData).length} categories...`);
        
        // Process each category
        const processedData = {};
        for (const [categoryId, categoryData] of Object.entries(vocabularyData)) {
            processedData[categoryId] = this.processCategoryWithDifficulty(categoryData);
        }
        
        // Generate new vocabulary file
        const newContent = this.generateVocabularyFile(processedData);
        
        // Write to both public and dist directories
        const publicPath = path.join(__dirname, 'public', 'static', 'enhanced-vocabulary-with-sessions.js');
        const distPath = path.join(__dirname, 'dist', 'static', 'enhanced-vocabulary-with-sessions.js');
        
        fs.writeFileSync(publicPath, newContent, 'utf8');
        fs.writeFileSync(distPath, newContent, 'utf8');
        
        console.log('✅ Successfully regenerated vocabulary database with difficulty-based sessions');
        console.log(`   📁 Updated: ${publicPath}`);
        console.log(`   📁 Updated: ${distPath}`);
        
        // Print summary
        let totalWords = 0;
        let totalSessions = 0;
        Object.values(processedData).forEach(category => {
            totalWords += category.words.length;
            totalSessions += category.sessions.length;
        });
        
        console.log(`📈 Summary: ${totalWords} words in ${totalSessions} sessions across ${Object.keys(processedData).length} categories`);
    }
}

// Run the regeneration
const regenerator = new DifficultyBasedSessionRegeneration();
regenerator.regenerate().catch(console.error);