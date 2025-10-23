# Next.js Chatbot (JavaScript) — Client-only prototype

This is a minimal Next.js (no TypeScript) chatbot that talks like a psychiatrist.
It uses the OpenRouter (or any compatible) API directly from the browser (no backend).
**WARNING:** Placing API keys in client-side code is insecure and will expose your key publicly.
Use this only for quick prototyping. For production, move calls to a server or serverless function.

## How to use
1. Update `pages/index.js` and replace `OPENROUTER_API_KEY` constant with your API key.
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000

Notes:
- Conversation is kept in memory (React state) until you refresh the page.
- If you hit CORS errors, you'll need to run a backend proxy or deploy a serverless function to proxy requests.
