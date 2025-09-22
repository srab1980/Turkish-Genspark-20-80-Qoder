# Google OAuth Setup Guide for Turkish Learning App

## 🔧 Setting up Google OAuth Authentication

To enable Google Sign-In in your Turkish learning app, follow these steps:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "Turkish Learning App" or similar

### 2. Enable Google+ API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Select "Web application"
4. Set Name: "Turkish Learning App Web Client"
5. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
6. Add Authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)

### 4. Configure Client ID

1. Copy the Client ID from Google Cloud Console
2. Update the `GOOGLE_CLIENT_ID` in `src/index.tsx`:
   ```typescript
   const GOOGLE_CLIENT_ID = 'your-actual-client-id.apps.googleusercontent.com'
   ```

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Open `/test-authentication.html`
3. Click "اختبار تسجيل الدخول بـ Google"
4. Complete the Google sign-in flow

## 🚀 Features Implemented

### Frontend Integration
- **Google Identity Services**: Latest Google Sign-In JavaScript SDK
- **One Tap Experience**: Automatic Google account detection
- **Fallback Popup**: Manual sign-in option if One Tap fails
- **Arabic UI**: Right-to-left interface with Arabic text
- **User Avatar**: Displays Google profile picture
- **Seamless Integration**: Works with existing authentication system

### Backend Support
- **JWT Token Handling**: Secure token generation and verification
- **User Account Merging**: Links Google accounts with existing users
- **Profile Picture Storage**: Saves and displays Google profile images
- **Statistics Preservation**: Maintains learning progress across sign-in methods

### Security Features
- **Client ID Validation**: Verifies requests come from authorized domains
- **Token Verification**: Validates Google JWT tokens (demo implementation)
- **Secure Cookies**: HTTP-only cookies for token storage
- **CORS Protection**: Proper cross-origin request handling

## 🎯 User Experience

1. **Login Modal**: Beautiful glassmorphism-styled authentication modal
2. **Google Button**: Prominent "الدخول باستخدام Google" button with Google branding
3. **Profile Display**: Shows Google profile picture and login method
4. **Progress Sync**: Automatically merges local learning data with Google account
5. **Seamless Logout**: Proper session cleanup

## 🔒 Production Setup

For production deployment:

1. **Environment Variables**: Set `GOOGLE_CLIENT_ID` via environment variables
2. **HTTPS Required**: Google OAuth requires HTTPS in production
3. **Domain Verification**: Add your production domain to authorized origins
4. **Token Verification**: Implement proper Google token verification with Google's API
5. **Database Integration**: Replace in-memory storage with real database

## 📝 Implementation Notes

- The current implementation uses simplified token verification for demo purposes
- In production, verify Google tokens using Google's token verification API
- The system gracefully handles both Google and regular email/password users
- Users can start as guests and later sign up with Google to preserve their progress

## 🐛 Troubleshooting

### Common Issues:
1. **"Invalid Client ID"**: Check the Client ID is correct and matches your domain
2. **"Popup Blocked"**: Ensure popup blockers allow the sign-in popup
3. **"Origin Not Allowed"**: Add your domain to authorized JavaScript origins
4. **"Network Error"**: Check CORS settings and network connectivity

### Debug Steps:
1. Open browser developer tools
2. Check console for error messages
3. Verify network requests are successful
4. Test with `/test-authentication.html`

## 🎉 Success!

Your Turkish learning app now supports Google OAuth authentication! Users can:
- Sign in with their Google account
- See their profile picture
- Have their learning progress automatically synced
- Switch between guest and authenticated modes seamlessly