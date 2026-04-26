# Chatbot Setup Guide

Your portfolio now includes an AI-powered chatbot! Here's how to get it working.

## Quick Start

### 1. Get a Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Add Environment Variables to Netlify
1. Go to your Netlify dashboard
2. Select your portfolio site
3. Go to **Site Settings** → **Build & Deploy** → **Environment**
4. Add a new variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your API key from step 1

### 3. Deploy
Push your code to GitHub (or connected repo) and Netlify will automatically build and deploy with the chatbot!

## Files Added

- **`chatbot.js`** - Frontend chatbot logic
- **`chatbot.css`** - Chatbot styling
- **`netlify/functions/chat.js`** - Backend API handler
- **`netlify.toml`** - Netlify configuration
- **`package.json`** - Dependencies
- **`.env.example`** - Environment variable template

## How It Works

1. User clicks the 🤖 button in the bottom-right corner
2. Chatbot widget opens with a greeting message
3. User types a question about your experience/projects
4. Message is sent to the Netlify Function
5. Function calls Google Gemini API
6. Response is displayed in the chat

## Customization

### Change the Chatbot's Personality
Edit `netlify/functions/chat.js` and modify the `systemPrompt` variable to change how the bot responds.

### Adjust Widget Appearance
Edit `chatbot.css` to customize colors, size, and position. Look for the `--accent` color variable.

### Change AI Model
In `netlify/functions/chat.js`, change:
```javascript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```
Options: `gemini-pro`, `gemini-1.5-pro`, `gemini-1.5-flash`

## Troubleshooting

### Chatbot doesn't respond
- Check that `GEMINI_API_KEY` is set in Netlify environment variables
- Check browser console for errors (F12)
- Verify your API key is valid

### Widget doesn't appear
- Clear browser cache
- Check that `chatbot.js` and `chatbot.css` are being loaded
- Check browser console for errors

### Rate limiting
- Google Gemini has free tier rate limits
- Consider implementing request throttling if you get many visitors

## Security Note

Your API key is stored securely in Netlify's environment variables and is never exposed to the client.

## Next Steps

- Monitor chatbot conversations to improve responses
- Add analytics to track user interactions
- Consider upgrading to Gemini Pro for more powerful responses
