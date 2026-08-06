import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for Gemini AI helper (e.g. generating app description or suggestions)
app.post('/api/generate-app-details', async (req, res) => {
  try {
    const { title, tagline, techStack, prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'Gemini API Key is missing. Please set GEMINI_API_KEY in environment or AI Studio secrets.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const aiPrompt = `
You are an expert Google Play Store copywriter and software product manager.
Generate professional Google Play Store metadata for a software developer's project showcase.

Project Name: ${title || 'Unnamed App'}
Short Tagline: ${tagline || 'Modern Web Application'}
Tech Stack: ${techStack || 'React, TypeScript, Tailwind CSS'}
Additional Prompt/Context: ${prompt || 'A clean responsive software project with user-centric UI'}

Provide output in JSON format with exactly the following structure:
{
  "fullDescription": "A compelling 2 to 3 paragraph Google Play Store description explaining the app's purpose, main value proposition, user benefits, and tech highlight.",
  "featureHighlights": [
    "Highlight 1: Short punchy feature description",
    "Highlight 2: Short punchy feature description",
    "Highlight 3: Short punchy feature description",
    "Highlight 4: Short punchy feature description"
  ],
  "suggestedCategory": "Tools",
  "suggestedTags": ["React", "TypeScript", "Tailwind", "Web App"],
  "whatsNew": "v1.0.0: Initial public release with full responsive support, fast loading times, and clean UI."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: aiPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text;
    const jsonResult = JSON.parse(resultText || '{}');
    return res.json({ success: true, data: jsonResult });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate app details using AI.' });
  }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Valora Store backend server is running. Build frontend with npm run build.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
