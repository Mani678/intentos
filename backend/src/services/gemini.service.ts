import { IParsedIntent, IntentType } from '../models/Transaction';

const SYSTEM_PROMPT = `You are an intent parser for a blockchain payment application called IntentOS.
Your ONLY job is to extract structured data from the user's natural language input.
You must return ONLY valid JSON — no markdown, no explanation, no code blocks. Just raw JSON.
The JSON must follow this exact schema:
{
  "intent": "payment" | "split" | "donation" | "transfer" | "swap" | "unknown",
  "recipient": "name or address string, null if not present",
  "recipientAddress": "0x... address if explicitly given, null otherwise",
  "amount": number or null,
  "currency": "USDC" | "ETH" | "USDT" | "DAI" | null,
  "sourceChain": "arbitrum" | "ethereum" | "base" | "polygon" | null,
  "destinationChain": "arbitrum" | "ethereum" | "base" | "polygon" | null,
  "memo": "optional note or description, null if not present",
  "splitParticipants": ["name1", "name2"] or null,
  "confidence": 0.0 to 1.0,
  "humanReadableSummary": "one sentence describing what will happen"
}
Rules:
- Default currency to USDC if user says "dollars" or "$" or no currency
- Default sourceChain to "arbitrum" if not specified
- For "transfer", sourceChain and destinationChain should both be set
- For "donation", try to identify the organization as recipient
- For "split", extract all participant names into splitParticipants
- confidence should reflect how certain you are about the parsed intent
- humanReadableSummary should be friendly, e.g. "Send 20 USDC to David on Arbitrum"
- If you cannot parse anything meaningful, set intent to "unknown"`;

export interface ParsedIntentResult extends IParsedIntent {
  confidence: number;
  humanReadableSummary: string;
}

export const parseIntent = async (userInput: string): Promise<ParsedIntentResult> => {
  if (!userInput || userInput.trim().length === 0) {
    throw new Error('User input cannot be empty');
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser input: "${userInput.trim()}"`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const data = await res.json() as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    const cleaned = text.replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned) as ParsedIntentResult;

    parsed.rawInput = userInput.trim();
    parsed.currency = parsed.currency || 'USDC';
    parsed.sourceChain = parsed.sourceChain || 'arbitrum';

    return parsed;
  } catch (error) {
    console.error('❌ Gemini parse error:', error);
    return {
      intent: 'unknown' as IntentType,
      rawInput: userInput.trim(),
      confidence: 0,
      humanReadableSummary: "I couldn't understand that request. Could you rephrase it?",
      currency: 'USDC',
      sourceChain: 'arbitrum',
    };
  }
};