#!/usr/bin/env node

/**
 * Enhance vocabulary icons to be more meaningful and colorful
 * Assigns contextually appropriate Font Awesome icons based on word meanings
 */

import { query } from './src/database/db-connector.js';

// Word-based icon mapping for more meaningful icons
const wordIconMapping = {
  // Greetings and common phrases
  'merhaba': 'fas fa-hand-peace',
  'günaydın': 'fas fa-sun',
  'iyi akşamlar': 'fas fa-moon',
  'hoşça kal': 'fas fa-hand-wave',
  'teşekkür ederim': 'fas fa-heart',
  'lütfen': 'fas fa-hands',
  'afiyet olsun': 'fas fa-utensils',
  'iyi günler': 'fas fa-smile',
  'günaydınlar': 'fas fa-sun',
  'selam': 'fas fa-hand-peace',
  'merhabalar': 'fas fa-hand-peace',
  'görüşürüz': 'fas fa-hand-wave',
  'iyi şanslar': 'fas fa-heart',
  
  // Family members
  'anne': 'fas fa-user',
  'baba': 'fas fa-user',
  'kardeş': 'fas fa-users',
  'çocuk': 'fas fa-child',
  'aile': 'fas fa-home',
  'dede': 'fas fa-user',
  'nene': 'fas fa-user',
  'amca': 'fas fa-user',
  'hala': 'fas fa-user',
  'yeğen': 'fas fa-user',
  'dayı': 'fas fa-user',
  'teyze': 'fas fa-user',
  'oğul': 'fas fa-user',
  'kız': 'fas fa-user',
  'ebeveyn': 'fas fa-users',
  'kuzen': 'fas fa-user',
  'büyükbaba': 'fas fa-user',
  'büyükanne': 'fas fa-user',
  
  // Food and drinks
  'ekmek': 'fas fa-bread-slice',
  'su': 'fas fa-glass-water',
  'çay': 'fas fa-mug-hot',
  'kahve': 'fas fa-coffee',
  'süt': 'fas fa-glass-water',
  'et': 'fas fa-drumstick-bite',
  'balık': 'fas fa-fish',
  'meyve': 'fas fa-apple-whole',
  'sebze': 'fas fa-carrot',
  'tatlı': 'fas fa-cake-candles',
  'yemek': 'fas fa-utensils',
  'içecek': 'fas fa-wine-bottle',
  'şarap': 'fas fa-wine-glass',
  'bira': 'fas fa-beer-mug-empty',
  'muz': 'fas fa-apple-whole',
  'elma': 'fas fa-apple-whole',
  'portakal': 'fas fa-apple-whole',
  'limon': 'fas fa-apple-whole',
  'üzüm': 'fas fa-apple-whole',
  'karpuz': 'fas fa-apple-whole',
  'kavun': 'fas fa-apple-whole',
  'çilek': 'fas fa-apple-whole',
  'nar': 'fas fa-apple-whole',
  'erik': 'fas fa-apple-whole',
  'armut': 'fas fa-apple-whole',
  'kiraz': 'fas fa-apple-whole',
  'avokado': 'fas fa-apple-whole',
  'mango': 'fas fa-apple-whole',
  'hindistan cevizi': 'fas fa-apple-whole',
  'zencefil': 'fas fa-leaf',
  'karanfil': 'fas fa-leaf',
  'tarçın': 'fas fa-leaf',
  'kimyon': 'fas fa-leaf',
  'pul biber': 'fas fa-leaf',
  'kekik': 'fas fa-leaf',
  'nane': 'fas fa-leaf',
  'fesleğen': 'fas fa-leaf',
  'soğan': 'fas fa-leaf',
  'sarımsak': 'fas fa-leaf',
  'patates': 'fas fa-carrot',
  'domates': 'fas fa-carrot',
  'biber': 'fas fa-carrot',
  'salatalık': 'fas fa-carrot',
  'lahana': 'fas fa-leaf',
  'marul': 'fas fa-leaf',
  'ıspanak': 'fas fa-leaf',
  'brokoli': 'fas fa-leaf',
  'kuşkonmaz': 'fas fa-leaf',
  'bal': 'fas fa-jar',
  'reçel': 'fas fa-jar',
  'peynir': 'fas fa-cheese',
  'yoğurt': 'fas fa-jar',
  'yumurta': 'fas fa-egg',
  'tavuk': 'fas fa-drumstick-bite',
  'dana': 'fas fa-cow',
  'kuzu': 'fas fa-cow',
  'hindi': 'fas fa-drumstick-bite',
  'ördek': 'fas fa-dove',
  'kebap': 'fas fa-utensils',
  'köfte': 'fas fa-utensils',
  'pilav': 'fas fa-utensils',
  'makarna': 'fas fa-utensils',
  'pizza': 'fas fa-utensils',
  'hamburger': 'fas fa-utensils',
  'sandviç': 'fas fa-utensils',
  'çorba': 'fas fa-utensils',
  'salata': 'fas fa-utensils',
  
  // Colors
  'kırmızı': 'fas fa-circle text-red-500',
  'mavi': 'fas fa-circle text-blue-500',
  'yeşil': 'fas fa-circle text-green-500',
  'sarı': 'fas fa-circle text-yellow-500',
  'siyah': 'fas fa-circle text-black',
  'beyaz': 'fas fa-circle text-white',
  'mor': 'fas fa-circle text-purple-500',
  'pembe': 'fas fa-circle text-pink-500',
  'turuncu': 'fas fa-circle text-orange-500',
  'gri': 'fas fa-circle text-gray-500',
  'kahverengi': 'fas fa-circle text-amber-800',
  'turkuaz': 'fas fa-circle text-teal-500',
  'lacivert': 'fas fa-circle text-blue-800',
  'bej': 'fas fa-circle text-amber-100',
  'eflatun': 'fas fa-circle text-purple-500',
  
  // Numbers
  'bir': 'fas fa-1',
  'iki': 'fas fa-2',
  'üç': 'fas fa-3',
  'dört': 'fas fa-4',
  'beş': 'fas fa-5',
  'altı': 'fas fa-6',
  'yedi': 'fas fa-7',
  'sekiz': 'fas fa-8',
  'dokuz': 'fas fa-9',
  'on': 'fas fa-10',
  'yüz': 'fas fa-sort-numeric-up',
  'bin': 'fas fa-sort-numeric-up',
  'milyon': 'fas fa-sort-numeric-up',
  'milyar': 'fas fa-sort-numeric-up',
  
  // Time-related
  'sabah': 'fas fa-sun',
  'öğle': 'fas fa-sun',
  'akşam': 'fas fa-moon',
  'gece': 'fas fa-moon',
  'bugün': 'fas fa-calendar-day',
  'yarın': 'fas fa-calendar-day',
  'dün': 'fas fa-calendar-day',
  'hafta': 'fas fa-calendar-week',
  'ay': 'fas fa-calendar-days',
  'yıl': 'fas fa-calendar',
  'dakika': 'fas fa-clock',
  'saniye': 'fas fa-clock',
  'saat': 'fas fa-clock',
  'zaman': 'fas fa-clock',
  'şimdi': 'fas fa-clock',
  'sonra': 'fas fa-clock',
  'önce': 'fas fa-clock',
  
  // Body parts
  'el': 'fas fa-hand',
  'ayak': 'fas fa-shoe-prints',
  'göz': 'fas fa-eye',
  'kulak': 'fas fa-ear-listen',
  'ağız': 'fas fa-face-kiss',
  'burun': 'fas fa-nose',
  'baş': 'fas fa-head-side',
  'yüz': 'fas fa-face-smile',
  'saç': 'fas fa-user',
  'diş': 'fas fa-tooth',
  'kalp': 'fas fa-heart',
  'omuz': 'fas fa-user',
  'kol': 'fas fa-user',
  'bacak': 'fas fa-user',
  'parmak': 'fas fa-hand',
  'tırnak': 'fas fa-user',
  'gövde': 'fas fa-user',
  'bel': 'fas fa-user',
  'karın': 'fas fa-user',
  
  // Emotions
  'mutlu': 'fas fa-face-smile',
  'üzgün': 'fas fa-face-sad-tear',
  'kızgın': 'fas fa-face-angry',
  'korkmuş': 'fas fa-face-flushed',
  'şaşırmış': 'fas fa-face-surprise',
  'heyecanlı': 'fas fa-bolt',
  'yorgun': 'fas fa-bed',
  'hasta': 'fas fa-temperature-half',
  'iyi': 'fas fa-thumbs-up',
  'kötü': 'fas fa-thumbs-down',
  'sevimli': 'fas fa-heart',
  'güz': 'fas fa-heart',
  'çirkin': 'fas fa-thumbs-down',
  'sinirli': 'fas fa-face-angry',
  'kaygı': 'fas fa-face-flushed',
  'umut': 'fas fa-heart',
  'sevgi': 'fas fa-heart',
  'öfke': 'fas fa-face-angry',
  'neşe': 'fas fa-face-smile',
  'üzüntü': 'fas fa-face-sad-tear',
  'korku': 'fas fa-face-flushed',
  'şaşkınlık': 'fas fa-face-surprise',
  
  // Animals
  'köpek': 'fas fa-dog',
  'kedi': 'fas fa-cat',
  'kuş': 'fas fa-dove',
  'at': 'fas fa-horse',
  'inek': 'fas fa-cow',
  'koyun': 'fas fa-cow',
  'tavuk': 'fas fa-chicken',
  'balık': 'fas fa-fish',
  'arı': 'fas fa-bug',
  'fil': 'fas fa-elephant',
  'aslan': 'fas fa-paw',
  'kaplan': 'fas fa-paw',
  'ayı': 'fas fa-paw',
  'kurt': 'fas fa-paw',
  'tilki': 'fas fa-paw',
  'tavşan': 'fas fa-paw',
  'fare': 'fas fa-paw',
  'sincap': 'fas fa-paw',
  'kaplumbağa': 'fas fa-paw',
  'kurbağa': 'fas fa-paw',
  'yılan': 'fas fa-paw',
  'örümcek': 'fas fa-paw',
  'kelebek': 'fas fa-paw',
  'sinek': 'fas fa-paw',
  'papağan': 'fas fa-dove',
  'kartal': 'fas fa-dove',
  'serçe': 'fas fa-dove',
  'karga': 'fas fa-dove',
  'horoz': 'fas fa-chicken',
  'kedi': 'fas fa-cat',
  'köpekbalığı': 'fas fa-fish',
  'yunus': 'fas fa-fish',
  'balina': 'fas fa-fish',
  
  // Transportation
  'araba': 'fas fa-car',
  'otobus': 'fas fa-bus',
  'uçak': 'fas fa-plane',
  'tren': 'fas fa-train',
  'gemi': 'fas fa-ship',
  'bisiklet': 'fas fa-bicycle',
  'motorsiklet': 'fas fa-motorcycle',
  'taksi': 'fas fa-taxi',
  'metro': 'fas fa-subway',
  'tramvay': 'fas fa-train-tram',
  'helikopter': 'fas fa-helicopter',
  'otomobil': 'fas fa-car',
  
  // Common verbs
  'yemek': 'fas fa-utensils',
  'içmek': 'fas fa-glass-water',
  'gitmek': 'fas fa-person-walking',
  'gelmek': 'fas fa-person-walking',
  'almak': 'fas fa-cart-shopping',
  'vermek': 'fas fa-hands',
  'yapmak': 'fas fa-hammer',
  'istemek': 'fas fa-heart',
  'bilmek': 'fas fa-lightbulb',
  'görmek': 'fas fa-eye',
  'duymak': 'fas fa-ear-listen',
  'konuşmak': 'fas fa-comment',
  'yazmak': 'fas fa-pen',
  'okumak': 'fas fa-book',
  'çalışmak': 'fas fa-briefcase',
  'dormak': 'fas fa-bed',
  'uyanmak': 'fas fa-alarm-clock',
  'sevmek': 'fas fa-heart',
  'düşünmek': 'fas fa-brain',
  'anlamak': 'fas fa-lightbulb',
  'bulmak': 'fas fa-magnifying-glass',
  'kaybetmek': 'fas fa-magnifying-glass',
  'açmak': 'fas fa-door-open',
  'kapatmak': 'fas fa-door-closed',
  'temizlemek': 'fas fa-broom',
  'yıkamak': 'fas fa-bath',
  'giymek': 'fas fa-shirt',
  'taşımak': 'fas fa-truck',
  
  // Weather
  'güneş': 'fas fa-sun',
  'yağmur': 'fas fa-cloud-rain',
  'kar': 'fas fa-snowflake',
  'rüzgar': 'fas fa-wind',
  'bulut': 'fas fa-cloud',
  'gökkuşağı': 'fas fa-cloud-rain',
  'sis': 'fas fa-smog',
  'dolu': 'fas fa-cloud-hail',
  'fırtına': 'fas fa-cloud-bolt',
  
  // House and furniture
  'ev': 'fas fa-house',
  'oda': 'fas fa-door-open',
  'masa': 'fas fa-table',
  'sandalye': 'fas fa-chair',
  'yatak': 'fas fa-bed',
  'mutfak': 'fas fa-utensils',
  'banyo': 'fas fa-bath',
  'oturma odası': 'fas fa-couch',
  'yatak odası': 'fas fa-bed',
  'kapı': 'fas fa-door-open',
  'pencere': 'fas fa-window-maximize',
  'duvar': 'fas fa-border-all',
  'tavan': 'fas fa-border-top-left',
  'zemin': 'fas fa-border-bottom',
  
  // Clothes
  'gömlek': 'fas fa-shirt',
  'pantolon': 'fas fa-socks',
  'ayakkabı': 'fas fa-shoe-prints',
  'şapka': 'fas fa-hat-cowboy',
  'elbise': 'fas fa-shirt',
  'ceket': 'fas fa-shirt',
  'çorap': 'fas fa-socks',
  'kazak': 'fas fa-shirt',
  'mont': 'fas fa-shirt',
  'etek': 'fas fa-shirt',
  'kravat': 'fas fa-shirt',
  'çanta': 'fas fa-bag-shopping',
  
  // Technology
  'telefon': 'fas fa-mobile-screen-button',
  'bilgisayar': 'fas fa-laptop',
  'televizyon': 'fas fa-tv',
  'kamera': 'fas fa-camera',
  'internet': 'fas fa-wifi',
  'uygulama': 'fas fa-mobile-screen-button',
  'tablet': 'fas fa-tablet-screen-button',
  'kulaklık': 'fas fa-headphones',
  'şarj': 'fas fa-plug',
  
  // Health
  'hastane': 'fas fa-hospital',
  'doktor': 'fas fa-user-doctor',
  'ilaç': 'fas fa-pills',
  'ateş': 'fas fa-temperature-high',
  'kan': 'fas fa-droplet',
  'kanser': 'fas fa-disease',
  'aşı': 'fas fa-syringe',
  'hastalık': 'fas fa-disease',
  'tedavi': 'fas fa-kit-medical',
  'ilaç kutusu': 'fas fa-prescription-bottle',
  
  // School
  'okul': 'fas fa-school',
  'öğretmen': 'fas fa-chalkboard-user',
  'kitap': 'fas fa-book',
  'kalem': 'fas fa-pen',
  'defter': 'fas fa-book',
  'sınıf': 'fas fa-school',
  'öğrenci': 'fas fa-graduation-cap',
  'ders': 'fas fa-book',
  'sınav': 'fas fa-file-lines',
  'not': 'fas fa-pen',
  
  // Work
  'iş': 'fas fa-briefcase',
  'para': 'fas fa-money-bill',
  'maaş': 'fas fa-money-check',
  'şirket': 'fas fa-building',
  'ofis': 'fas fa-building',
  'işçi': 'fas fa-briefcase',
  'patron': 'fas fa-briefcase',
  'iş başvurusu': 'fas fa-file-lines',
  
  // Nature
  'ağaç': 'fas fa-tree',
  'çiçek': 'fas fa-seedling',
  'dağ': 'fas fa-mountain',
  'deniz': 'fas fa-water',
  'nehir': 'fas fa-water',
  'göl': 'fas fa-water',
  'orman': 'fas fa-tree',
  'çöl': 'fas fa-sun',
  'gökyüzü': 'fas fa-cloud',
  'gök': 'fas fa-cloud',
  'toprak': 'fas fa-mountain',
  'çim': 'fas fa-seedling',
  'kum': 'fas fa-mountain',
  
  // Sports
  'futbol': 'fas fa-futbol',
  'basketbol': 'fas fa-basketball',
  'tenis': 'fas fa-table-tennis-paddle-ball',
  'yüzme': 'fas fa-person-swimming',
  'koşu': 'fas fa-person-running',
  'bisiklet': 'fas fa-bicycle',
  'voleybol': 'fas fa-volleyball',
  'golf': 'fas fa-golf-ball-tee',
  'boks': 'fas fa-hand-fist',
  'kayak': 'fas fa-person-skiing',
  
  // Directions/Positions
  'yukarı': 'fas fa-arrow-up',
  'aşağı': 'fas fa-arrow-down',
  'sağ': 'fas fa-arrow-right',
  'sol': 'fas fa-arrow-left',
  'ön': 'fas fa-arrow-up',
  'arka': 'fas fa-arrow-down',
  'içinde': 'fas fa-arrow-right-arrow-left',
  'dışında': 'fas fa-arrow-right-arrow-left',
  'yanında': 'fas fa-arrow-right-arrow-left',
  
  // Default icons for categories (when no specific word match)
  'greetings': 'fas fa-hand-peace',
  'family': 'fas fa-users',
  'food': 'fas fa-utensils',
  'numbers': 'fas fa-hashtag',
  'colors': 'fas fa-palette',
  'time': 'fas fa-clock',
  'travel': 'fas fa-plane',
  'shopping': 'fas fa-cart-shopping',
  'work': 'fas fa-briefcase',
  'daily life': 'fas fa-house',
  'adjective': 'fas fa-tag',
  'animal': 'fas fa-paw',
  'body': 'fas fa-user',
  'clothes': 'fas fa-shirt',
  'direction': 'fas fa-compass',
  'emotion': 'fas fa-face-smile',
  'finance': 'fas fa-money-bill',
  'furniture': 'fas fa-chair',
  'geography': 'fas fa-map',
  'health': 'fas fa-heart-pulse',
  'house': 'fas fa-house',
  'job': 'fas fa-briefcase',
  'nature': 'fas fa-seedling',
  'noun': 'fas fa-sticky-note',
  'place': 'fas fa-location-dot',
  'pronoun': 'fas fa-user-group',
  'school': 'fas fa-graduation-cap',
  'sport': 'fas fa-futbol',
  'transport': 'fas fa-car',
  'verb': 'fas fa-arrow-right',
  'weather': 'fas fa-cloud-sun'
};

// Function to get appropriate icon for a word
function getIconForWord(turkishText, categoryName) {
  // First check for exact word match (case insensitive)
  const lowerText = turkishText.toLowerCase().trim();
  if (wordIconMapping[lowerText]) {
    return wordIconMapping[lowerText];
  }
  
  // For partial matches, be more careful to avoid false positives
  // Only match if the key is a complete word within the text
  const wordsInText = lowerText.split(/\s+/);
  for (const [key, icon] of Object.entries(wordIconMapping)) {
    // Check if key is a complete word in the text
    if (wordsInText.includes(key)) {
      return icon;
    }
  }
  
  // Check for category-based icons
  const lowerCategory = categoryName ? categoryName.toLowerCase().trim() : '';
  if (lowerCategory && wordIconMapping[lowerCategory]) {
    return wordIconMapping[lowerCategory];
  }
  
  // Default fallback
  return 'fas fa-book';
}

async function enhanceIcons() {
  try {
    console.log('🎨 Enhancing vocabulary icons...');
    
    // Get all active vocabulary items with category names
    const vocabulary = await query(`
      SELECT v.id, v.turkish_text, v.svg_icon, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1
    `);
    
    console.log(`📊 Processing ${vocabulary.length} vocabulary items...`);
    
    let updatedCount = 0;
    
    // Process each vocabulary item
    for (const item of vocabulary) {
      const newIcon = getIconForWord(item.turkish_text, item.category_name || '');
      
      // Only update if the icon is different
      if (newIcon !== item.svg_icon) {
        await query(
          'UPDATE vocabulary SET svg_icon = ?, updated_at = datetime("now") WHERE id = ?',
          [newIcon, item.id]
        );
        updatedCount++;
      }
    }
    
    console.log(`\n✅ Icon enhancement completed!`);
    console.log(`   Icons updated: ${updatedCount}`);
    console.log(`   Icons unchanged: ${vocabulary.length - updatedCount}`);
    
    // Show some examples
    console.log('\n🔍 Sample updated icons:');
    const sample = await query(`
      SELECT v.turkish_text, v.svg_icon, c.name as category_name
      FROM vocabulary v
      LEFT JOIN categories c ON v.category_id = c.id
      WHERE v.is_active = 1
      ORDER BY v.updated_at DESC
      LIMIT 10
    `);
    
    sample.forEach(item => {
      console.log(`   ${item.turkish_text} -> ${item.svg_icon} (${item.category_name || 'No category'})`);
    });
    
  } catch (error) {
    console.error('❌ Error enhancing icons:', error.message);
    process.exit(1);
  }
}

// Run the enhancement
enhanceIcons();