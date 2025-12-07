import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';

// System prompt that constrains Gemini to generate safe, self-contained code
const SYSTEM_PROMPT = `You are a code generator. Generate a single, self-contained HTML file that includes:
- Inline CSS in a <style> tag
- Inline JavaScript in a <script> tag
- No external dependencies, CDN links, or imports
- No fetch(), XMLHttpRequest, or any network requests
- No localStorage, sessionStorage, or cookies access
- The code should be purely visual/interactive

The user will describe what they want. Create it.

Respond ONLY with the raw HTML code. No explanations, no markdown code blocks, just the HTML starting with <!DOCTYPE html>.`;

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          code: null,
          error: `Rate limit exceeded. Try again in ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds.`,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetIn / 1000)),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, code: null, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json(
        { success: false, code: null, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                { text: `User request: ${prompt.trim()}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json(
        { success: false, code: null, error: 'Failed to generate code. Please try again.' },
        { status: 500 }
      );
    }

    const geminiData = await geminiResponse.json();
    
    // Extract generated code from response
    const generatedCode = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedCode) {
      return NextResponse.json(
        { success: false, code: null, error: 'The model isn\'t that good yet, lets relax...' },
        { status: 500 }
      );
    }

    // Basic validation - should start with DOCTYPE or html tag
    const trimmedCode = generatedCode.trim();
    if (!trimmedCode.toLowerCase().startsWith('<!doctype') && !trimmedCode.toLowerCase().startsWith('<html')) {
      // Try to extract HTML if it's wrapped in markdown code blocks
      const htmlMatch = trimmedCode.match(/```html?\s*([\s\S]*?)```/i);
      if (htmlMatch) {
        return NextResponse.json({
          success: true,
          code: htmlMatch[1].trim(),
          error: null,
        });
      }
      
      return NextResponse.json(
        { success: false, code: null, error: 'Invalid code generated. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code: trimmedCode,
      error: null,
    });
  } catch (error) {
    console.error('Sandbox generate error:', error);
    return NextResponse.json(
      { success: false, code: null, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
