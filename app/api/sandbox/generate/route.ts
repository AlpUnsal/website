import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';

// System prompt that constrains Gemini to generate safe, self-contained code
const SYSTEM_PROMPT = `You are a safe code generator. Generate a single, self-contained HTML file that includes:
- Inline CSS in a <style> tag
- Inline JavaScript in a <script> tag
- No external dependencies, CDN links, or imports
- No fetch(), XMLHttpRequest, or any network requests
- No localStorage, sessionStorage, or cookies access
- The code should be purely visual/interactive
- The code should be safe and not contain any malicious code

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
    const { prompt, screenWidth, screenHeight } = body;

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

    // Models to try in order of preference
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    
    const requestBody = JSON.stringify({
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT },
            { text: `User's screen size: ${screenWidth || 'unknown'}px wide × ${screenHeight || 'unknown'}px tall. Design the output to fit nicely within this viewport.` },
            { text: `User request: ${prompt.trim()}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    let geminiResponse: Response | null = null;
    let lastError = '';

    // Try each model until one succeeds
    for (const model of models) {
      console.log(`Trying model: ${model}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        }
      );

      if (response.ok) {
        geminiResponse = response;
        break;
      }

      // If model is overloaded (503), try the next one
      if (response.status === 503) {
        console.log(`the better model is overloaded, trying the worse one`);
        lastError = await response.text();
        continue;
      }

      // If quota exceeded (429), show friendly message
      if (response.status === 429) {
        console.error('Gemini API quota exceeded');
        return NextResponse.json(
          { success: false, code: null, error: 'uh oh looks like i ran out of api usage' },
          { status: 429 }
        );
      }

      // For other errors, return immediately
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, code: null, error: `something real bad happened... try again later` },
        { status: 500 }
      );
    }

    if (!geminiResponse) {
      console.error('All models failed:', lastError);
      return NextResponse.json(
        { success: false, code: null, error: 'models are fried. try again later' },
        { status: 503 }
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
