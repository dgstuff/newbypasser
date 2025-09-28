
import React, { useState, useCallback } from 'react';

interface CodeBlockProps {
  text: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [text]);

    return (
        <div className="mt-1 relative bg-gray-900 text-gray-300 font-mono text-sm p-3 rounded-md border border-gray-700 flex items-center justify-between">
            <span className="overflow-x-auto pr-4">{text}</span>
            <button 
                onClick={handleCopy}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Copy to clipboard"
            >
                {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default CodeBlock;
