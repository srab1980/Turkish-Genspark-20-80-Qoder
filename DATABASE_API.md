# Database API Endpoints

Your Turkish Learning App now has a fully functional database with real-time API endpoints!

## 🚀 Quick Start

The database is already running and populated with sample data. The app uses **SQLite** for development (easy setup) and can be configured to use **MySQL** for production.

### Database Status
- ✅ **Database**: SQLite (turkish_learning.db)
- ✅ **Tables**: 6 core tables with sample data
- ✅ **API Endpoints**: 8 database-enabled endpoints
- ✅ **Sample Data**: 25 vocabulary words, 10 categories, user progress tracking

## 📊 Available API Endpoints

### Categories
- **GET** `/api/db/categories` - Get all learning categories
- **Response**: 10 categories (Greetings, Family, Food, etc.)

### Vocabulary
- **GET** `/api/db/vocabulary/:categoryId?limit=20` - Get words by category
- **GET** `/api/db/vocabulary/random/:count` - Get random words for review
- **GET** `/api/db/vocabulary/search/:term` - Search vocabulary

### User Progress
- **GET** `/api/db/user/progress` - Get user statistics and progress
- **POST** `/api/db/user/progress` - Update user statistics
- **POST** `/api/db/vocabulary/progress` - Update word-specific progress

### Learning Sessions
- **POST** `/api/db/session` - Create new learning session
- **GET** `/api/db/user/sessions?limit=10` - Get user's learning history

## 🧪 Test the API

You can test the database API directly:

```bash
# Get all categories
curl http://localhost:5173/api/db/categories

# Get vocabulary from Greetings category (ID: 1)
curl "http://localhost:5173/api/db/vocabulary/1?limit=5"

# Get user progress
curl http://localhost:5173/api/db/user/progress

# Get random words for practice
curl http://localhost:5173/api/db/vocabulary/random/3
```

## 📱 Sample Data Included

### Categories (10 total)
1. **Greetings** (Selamlaşma) - Basic greetings
2. **Family** (Aile) - Family members  
3. **Food & Drink** (Yemek ve İçecek) - Food and beverages
4. **Numbers** (Sayılar) - Numbers and counting
5. **Colors** (Renkler) - Colors and descriptions
6. **Time** (Zaman) - Time and calendar
7. **Travel** (Seyahat) - Travel and transportation
8. **Shopping** (Alışveriş) - Shopping and commerce
9. **Work** (İş) - Work and professional life
10. **Daily Life** (Günlük Yaşam) - Daily activities

### Sample Vocabulary (25+ words)
- **Merhaba** = Hello
- **Teşekkür ederim** = Thank you  
- **Anne** = Mother
- **Su** = Water
- **Bir** = One
- **Kırmızı** = Red
- And many more...

## 🔧 Database Management

### Quick Commands
```bash
# Check database status
npm run db:check

# Reset database (removes all data)
npm run db:reset

# Test database functionality
npm run db:test
```

### Database Location
- **Development**: `data/turkish_learning.db` (SQLite)
- **Production**: Configure MySQL in `.env` file

## 🎯 Integration with Your App

The database API endpoints are ready to use in your Turkish learning application:

### Example: Load Categories
```javascript
// Frontend code
const response = await fetch('/api/db/categories');
const { categories } = await response.json();
console.log(`Loaded ${categories.length} categories from database`);
```

### Example: Track Learning Progress
```javascript
// Update user stats after a learning session
await fetch('/api/db/user/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        total_xp: 150,
        words_learned: 10,
        sessions_completed: 2
    })
});
```

### Example: Get Random Words for Review
```javascript
// Get 5 random words for spaced repetition
const response = await fetch('/api/db/vocabulary/random/5');
const { vocabulary } = await response.json();
// Use vocabulary for flashcard review
```

## 🛡️ Security & Production

### Current Setup (Development)
- Uses SQLite database file
- No authentication on database endpoints (for testing)
- Sample user ID (1) hardcoded

### Production Recommendations
1. **Switch to MySQL**: Set `USE_MYSQL=true` in `.env`
2. **Add Authentication**: Implement JWT token validation
3. **Rate Limiting**: Add API rate limits
4. **Input Validation**: Validate all user inputs
5. **Database Backups**: Regular automated backups

## 🎉 Ready to Use!

Your database is now fully operational and ready to power your Turkish learning application. The API endpoints provide real data persistence for:

- ✅ User progress tracking
- ✅ Vocabulary management  
- ✅ Learning session history
- ✅ Spaced repetition algorithms
- ✅ Achievement systems
- ✅ Analytics and reporting

Click the preview button to see your app running with the database backend!