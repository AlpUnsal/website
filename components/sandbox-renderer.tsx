'use client';

interface SandboxRendererProps {
  code: string;
  onReset: () => void;
}

export function SandboxRenderer({ code, onReset }: SandboxRendererProps) {
  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Reset button - floating in corner */}
      <button
        onClick={onReset}
        className="fixed top-4 right-4 z-50 px-4 py-2 text-sm font-medium 
                   bg-white/90 backdrop-blur-sm border border-neutral-200 
                   rounded-full shadow-lg hover:bg-white hover:shadow-xl 
                   transition-all duration-200 text-neutral-700 hover:text-black"
      >
        ✕ Reset
      </button>

      {/* Sandboxed iframe - full viewport */}
      <iframe
        sandbox="allow-scripts"
        srcDoc={code}
        title="Sandbox Preview"
        className="w-full h-full border-0"
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
}
