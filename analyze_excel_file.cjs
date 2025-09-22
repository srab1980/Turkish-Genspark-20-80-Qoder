#!/usr/bin/env node

/**
 * Excel File Analyzer - Turkish Language Data
 * Analyzes the structure and content of the uploaded Excel file
 */

const XLSX = require('xlsx');
const fs = require('fs');

console.log('🔍 Analyzing Turkish Language Data Excel file...\n');

try {
    // Read the Excel file
    const workbook = XLSX.readFile('Turkish_Language_Data_categorized_final.xlsx');
    
    console.log('📊 Workbook Information:');
    console.log(`   Sheets: ${workbook.SheetNames.length}`);
    console.log(`   Sheet Names: ${workbook.SheetNames.join(', ')}`);
    console.log('');
    
    // Analyze each sheet
    workbook.SheetNames.forEach((sheetName, index) => {
        console.log(`📋 Sheet ${index + 1}: "${sheetName}"`);
        console.log('─'.repeat(50));
        
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
            console.log('   ⚠️  Empty sheet');
            console.log('');
            return;
        }
        
        // Show basic stats
        console.log(`   📏 Dimensions: ${jsonData.length} rows × ${jsonData[0]?.length || 0} columns`);
        
        // Show headers (first row)
        if (jsonData[0]) {
            console.log(`   📝 Headers: ${jsonData[0].join(' | ')}`);
        }
        
        // Show sample data (first few rows after header)
        console.log('   📄 Sample Data:');
        for (let i = 1; i <= Math.min(5, jsonData.length - 1); i++) {
            if (jsonData[i]) {
                const rowData = jsonData[i].map(cell => 
                    cell !== null && cell !== undefined ? 
                    String(cell).substring(0, 30) : ''
                ).join(' | ');
                console.log(`      Row ${i}: ${rowData}`);
            }
        }
        
        // Analyze content structure
        if (jsonData.length > 1) {
            const headers = jsonData[0] || [];
            const dataRows = jsonData.slice(1);
            
            console.log(`   🔢 Total Data Rows: ${dataRows.length}`);
            
            // Analyze each column
            headers.forEach((header, colIndex) => {
                if (header) {
                    const columnData = dataRows
                        .map(row => row[colIndex])
                        .filter(cell => cell !== null && cell !== undefined && cell !== '');
                    
                    const uniqueValues = [...new Set(columnData)].length;
                    console.log(`      Column "${header}": ${columnData.length} filled cells, ${uniqueValues} unique values`);
                }
            });
        }
        
        console.log('');
    });
    
    // Export detailed analysis to JSON for further processing
    const analysisData = {};
    
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length > 0) {
            analysisData[sheetName] = {
                headers: jsonData[0] || [],
                totalRows: jsonData.length - 1,
                sampleData: jsonData.slice(1, 11), // First 10 data rows
                columnStats: {}
            };
            
            // Column statistics
            if (jsonData[0]) {
                jsonData[0].forEach((header, colIndex) => {
                    if (header) {
                        const columnData = jsonData.slice(1)
                            .map(row => row[colIndex])
                            .filter(cell => cell !== null && cell !== undefined && cell !== '');
                        
                        const uniqueValues = [...new Set(columnData)];
                        
                        analysisData[sheetName].columnStats[header] = {
                            filledCells: columnData.length,
                            uniqueValues: uniqueValues.length,
                            sampleValues: uniqueValues.slice(0, 10)
                        };
                    }
                });
            }
        }
    });
    
    // Save analysis to file
    fs.writeFileSync('excel_analysis.json', JSON.stringify(analysisData, null, 2));
    console.log('💾 Detailed analysis saved to excel_analysis.json');
    
    // Look for specific patterns that indicate categories, words, sentences
    console.log('\n🎯 Content Pattern Analysis:');
    console.log('─'.repeat(50));
    
    Object.keys(analysisData).forEach(sheetName => {
        const sheet = analysisData[sheetName];
        console.log(`\n📋 Sheet: "${sheetName}"`);
        
        // Check for Turkish/Arabic/English patterns
        const headers = sheet.headers.map(h => h?.toLowerCase() || '');
        
        const hasTurkish = headers.some(h => h.includes('turkish') || h.includes('türk'));
        const hasArabic = headers.some(h => h.includes('arabic') || h.includes('عرب'));
        const hasEnglish = headers.some(h => h.includes('english') || h.includes('ing'));
        const hasCategory = headers.some(h => h.includes('category') || h.includes('kategori'));
        const hasSentence = headers.some(h => h.includes('sentence') || h.includes('cümle'));
        
        console.log(`   🔸 Contains Turkish: ${hasturkish ? '✅' : '❌'}`);
        console.log(`   🔸 Contains Arabic: ${hasArabic ? '✅' : '❌'}`);
        console.log(`   🔸 Contains English: ${hasEnglish ? '✅' : '❌'}`);
        console.log(`   🔸 Contains Categories: ${hasCategory ? '✅' : '❌'}`);
        console.log(`   🔸 Contains Sentences: ${hasSentence ? '✅' : '❌'}`);
        
        if (sheet.totalRows > 0) {
            console.log(`   📊 Data Rows: ${sheet.totalRows}`);
        }
    });
    
} catch (error) {
    console.error('❌ Error analyzing Excel file:', error.message);
    process.exit(1);
}

console.log('\n✅ Analysis complete!');