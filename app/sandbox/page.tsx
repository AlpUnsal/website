'use client';

import { useState, FormEvent, useEffect } from 'react';
import { SandboxRenderer } from '@/components/sandbox-renderer';
import { Nav } from '@/components/nav';
import { getGreeting } from '@/content/sandbox-greetings';

type PageState = 'input' | 'loading' | 'result' | 'error';

export default function SandboxPage() {
  const [prompt, setPrompt] = useState('');
  const [pageState, setPageState] = useState<PageState>('input');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('');

  // Set greeting on client-side to avoid hydration mismatch
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;

    setPageState('loading');
    setError(null);

    try {
      // Get screen dimensions to help the model generate appropriate code
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const response = await fetch('/api/sandbox/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          screenWidth,
          screenHeight,
        }),
      });

      const data = await response.json();

      if (data.success && data.code) {
        setGeneratedCode(data.code);
        setPageState('result');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setPageState('error');
      }
    } catch {
      setError('Failed to connect. Please try again.');
      setPageState('error');
    }
  };

  const handleReset = () => {
    setPrompt('');
    setGeneratedCode(null);
    setError(null);
    setPageState('input');
  };

  // Show the generated result
  if (pageState === 'result' && generatedCode) {
    return <SandboxRenderer code={generatedCode} onReset={handleReset} />;
  }

  // Show the input form (initial, loading, or error states)
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 font-sans flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center pb-32">
        {/* Greeting text - outside the container so it can expand full width */}
        {greeting && (
          <h1 className="text-5xl font-light text-center text-neutral-400 mb-8 whitespace-nowrap">
            {greeting}
          </h1>
        )}
        <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                disabled={pageState === 'loading'}
                className="w-full px-6 py-4 text-base font-sans
                         bg-[var(--background)] border border-neutral-300
                         rounded-full shadow-sm
                         placeholder:text-neutral-400
                         focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
                autoFocus
              />
              
              {/* Loading indicator inside input */}
              {pageState === 'loading' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Error message */}
            {pageState === 'error' && error && (
              <p className="mt-4 text-sm text-red-600 text-center">
                {error}
              </p>
            )}

            {/* Subtle hint */}
            <p className="mt-4 text-xs text-neutral-400 text-center">
              Press Enter to generate
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
