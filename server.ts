import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client server-side if key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Life Experience Generator API
app.post('/api/ai/generate-life', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Fallback heuristic builder if Gemini is unavailable
  const generateOfflineFallback = (rawPrompt: string) => {
    const isCreative = /art|paint|write|draw|film|photo|music|design/i.test(rawPrompt);
    const isFitness = /run|gym|workout|athlete|lift|train|marathon/i.test(rawPrompt);
    const isProductive = /founder|code|study|work|startup|focus|hustle/i.test(rawPrompt);
    const isRelaxed = /slow|sunday|coffee|read|peace|walk|nature/i.test(rawPrompt);

    const title = isCreative
      ? 'The Creative Flow State'
      : isFitness
      ? 'The High-Performance Protocol'
      : isProductive
      ? 'Deep Work & Founder Velocity'
      : isRelaxed
      ? 'Slow Sunday Sanctuary'
      : 'The Mindful Explorer Day';

    const mood = isCreative ? 'Creative' : isFitness ? 'Challenging' : isProductive ? 'Productive' : isRelaxed ? 'Peaceful' : 'Adventurous';
    const category = isCreative ? 'Creative Life' : isFitness ? 'Fitness Life' : isProductive ? 'Career Life' : isRelaxed ? 'Slow Living' : 'Self-Discovery';

    return {
      title,
      tagline: `Inspired by: "${rawPrompt.slice(0, 80)}"`,
      description: `Step into this immersive lifestyle: ${rawPrompt}. Designed to disrupt your baseline thinking and teach you how to feel time differently.`,
      duration: 'Half day',
      mood,
      difficulty: 'Medium',
      price: 0,
      category,
      timeline: [
        {
          id: 'act-1',
          time: '08:00',
          title: 'The Silent Awakening',
          description: 'Wake without alarms. No screen for the first 30 minutes. Drink 500ml cold mineral water and write down your opening state.',
          advice: 'Notice how quiet your mind is before notifications flood in.',
          challenge: 'Sit by a window for 10 minutes in total silence.',
          durationMinutes: 30,
        },
        {
          id: 'act-2',
          time: '09:00',
          title: 'Curated Brew & Intent Setting',
          description: 'Prepare your ritual drink. Savor the scent, grind, and heat. Write down the one single outcome that matters today.',
          advice: 'Do not rush the physical process. Craft is patience.',
          challenge: 'No phone during preparation.',
          durationMinutes: 45,
        },
        {
          id: 'act-3',
          time: '10:30',
          title: 'Uncompromised Deep Engagement',
          description: 'Immerse yourself completely into the primary craft. Full sensory focus without micro-interruptions.',
          advice: 'When friction occurs, lean into it. That is where growth lives.',
          challenge: 'Full screen fullscreen mode, zero tabs other than your work.',
          durationMinutes: 90,
        },
        {
          id: 'act-4',
          time: '13:00',
          title: 'Sensory Walk & Perspective Shift',
          description: 'Step outside without destination. Look upward at architectural lines and light patterns.',
          advice: 'You are an observer in a world that forgotten how to look.',
          challenge: 'Take 3 deliberate photographs of shadows or light reflections.',
          durationMinutes: 45,
        },
        {
          id: 'act-5',
          time: '15:00',
          title: 'The Unplugged Reflection',
          description: 'Savor a wholesome meal or tea. Record the emotional shift between morning and afternoon.',
          advice: 'What part of this routine felt most natural to you?',
          challenge: 'Ask yourself: What am I doing in my regular life that I don’t actually enjoy?',
          durationMinutes: 45,
        }
      ],
      lifeTwists: [
        {
          id: 'twist-1',
          triggerMinute: 45,
          title: 'The Zero-Digital Lockout',
          description: 'Turn off your phone completely and place it in another room for 30 minutes.',
          actionText: 'I put my phone away'
        },
        {
          id: 'twist-2',
          triggerMinute: 90,
          title: 'Micro-Creation',
          description: 'Draw or jot down a metaphor describing how you feel in under 3 minutes.',
          actionText: 'Completed drawing'
        }
      ],
      reflectionQuestions: [
        'How much did this Life change your perspective?',
        'What is one habit or feeling from today you want to permanently steal for your own life?',
        'What felt surprisingly difficult?'
      ]
    };
  };

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are the lead architect for "BORROW A LIFE", a premier marketplace where people temporarily adopt someone else's daily lifestyle, routines, and mindset.
The user described their lifestyle idea:
"${prompt}"

Generate a structured, authentic, cinematic Life Experience in valid JSON format matching this schema:
{
  "title": "string (cinematic, inspiring, punchy, e.g. 'The 5 AM Athlete' or 'Slow Sunday in Kyoto')",
  "tagline": "string (one captivating sentence)",
  "description": "string (2-3 sentences explaining the philosophy and vibe)",
  "duration": "string (choose from: '30 minutes', '2 hours', 'Half day', 'Full day', 'Weekend')",
  "mood": "string (choose from: 'Peaceful', 'Chaotic', 'Adventurous', 'Productive', 'Creative', 'Social', 'Luxurious', 'Mysterious', 'Challenging')",
  "difficulty": "string (choose from: 'Easy', 'Medium', 'Hard', 'Extreme')",
  "price": number (0, 49, 99, 199, or 499 in INR),
  "category": "string (choose from: 'Student Life', 'Creative Life', 'Fitness Life', 'Career Life', 'Luxury Life', 'Minimalist Life', 'Travel Life', 'Cultural Life', 'Digital Detox', 'Weird & Experimental', 'Self-Discovery', 'Night Life', 'Slow Living', 'Productivity', 'Adventure')",
  "timeline": [
    {
      "id": "string",
      "time": "HH:MM",
      "title": "string",
      "description": "string",
      "advice": "string (creator's personal candid tip)",
      "challenge": "string (micro challenge for this moment)",
      "durationMinutes": number
    }
  ],
  "lifeTwists": [
    {
      "id": "string",
      "triggerMinute": number,
      "title": "string (surprise unexpected challenge, e.g., 'Draw something in 5 minutes', 'Spend ₹0 for the next 3 hours')",
      "description": "string",
      "actionText": "string"
    }
  ],
  "reflectionQuestions": [
    "string",
    "string",
    "string"
  ]
}

Return ONLY the raw JSON object without markdown fences or additional commentary.`
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, data: parsed });
      } catch {
        // In case model returned extra wrappers
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed });
      }
    } else {
      const fallback = generateOfflineFallback(prompt);
      return res.json({ success: true, data: fallback, note: 'Generated with intelligent rule engine' });
    }
  } catch (error: any) {
    console.warn('Gemini generation error, using fallback:', error?.message);
    const fallback = generateOfflineFallback(prompt);
    return res.json({ success: true, data: fallback });
  }
});

// LIV AI Chatbot Webhook Proxy for n8n
const N8N_LIV_WEBHOOK_URL =
  process.env.LIV_WEBHOOK_URL ||
  'https://vandana3011.app.n8n.cloud/webhook/f8d01049-574f-47c7-ba53-b5aecd0da240/chat';

app.get('/api/liv-chat/status', async (req, res) => {
  try {
    const response = await fetch(N8N_LIV_WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json().catch(() => null);
    if (response.status === 404 && data?.hint?.includes('must be active')) {
      return res.json({
        active: false,
        status: 404,
        message: 'n8n workflow is currently inactive.',
        hint: data.hint,
        webhookUrl: N8N_LIV_WEBHOOK_URL,
      });
    }

    return res.json({
      active: response.ok,
      status: response.status,
      webhookUrl: N8N_LIV_WEBHOOK_URL,
    });
  } catch (error: any) {
    return res.json({
      active: false,
      error: error?.message,
      webhookUrl: N8N_LIV_WEBHOOK_URL,
    });
  }
});

app.post('/api/liv-chat/message', async (req, res) => {
  const { chatInput, sessionId, metadata } = req.body;

  if (!chatInput || typeof chatInput !== 'string') {
    return res.status(400).json({ error: 'chatInput is required' });
  }

  const payload = {
    action: 'sendMessage',
    sessionId: sessionId || `liv_session_${Date.now()}`,
    chatInput,
    metadata: metadata || { source: 'livora-web' },
  };

  try {
    const n8nResponse = await fetch(N8N_LIV_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
    });

    const contentType = n8nResponse.headers.get('content-type') || '';

    if (!n8nResponse.ok) {
      const errData = await n8nResponse.json().catch(() => null);
      if (n8nResponse.status === 404 && errData?.hint?.includes('must be active')) {
        return res.status(200).json({
          success: false,
          isWorkflowInactive: true,
          error: 'Your n8n workflow must be toggled "Active" in the top-right of your n8n editor canvas for production webhook calls.',
          hint: errData.hint,
        });
      }
      return res.status(n8nResponse.status).json({
        success: false,
        error: errData?.message || `n8n webhook error: ${n8nResponse.statusText}`,
      });
    }

    if (contentType.includes('application/json')) {
      const json = await n8nResponse.json();
      // Handle standard n8n outputs: { output: string }, { text: string }, or array of items
      let replyText = '';
      if (typeof json === 'string') {
        replyText = json;
      } else if (json.output) {
        replyText = typeof json.output === 'string' ? json.output : JSON.stringify(json.output);
      } else if (json.text) {
        replyText = typeof json.text === 'string' ? json.text : JSON.stringify(json.text);
      } else if (json.message) {
        replyText = typeof json.message === 'string' ? json.message : JSON.stringify(json.message);
      } else if (Array.isArray(json) && json[0]) {
        replyText = json[0].output || json[0].text || json[0].message || JSON.stringify(json[0]);
      } else {
        replyText = JSON.stringify(json);
      }

      return res.json({
        success: true,
        reply: replyText,
        raw: json,
        sessionId: payload.sessionId,
      });
    } else {
      const text = await n8nResponse.text();
      return res.json({
        success: true,
        reply: text,
        sessionId: payload.sessionId,
      });
    }
  } catch (error: any) {
    console.error('Error forwarding to LIV n8n webhook:', error);
    return res.status(502).json({
      success: false,
      error: 'Unable to connect to LIV n8n webhook server: ' + error?.message,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Borrow A Life server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
