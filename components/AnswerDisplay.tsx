import React, { useEffect, useState } from 'react';
import type { UPSCAnswer } from '../types';
import { BrainCircuitIcon, BookOpenCheckIcon, GemIcon, ChevronDownIcon, ClipboardCopyIcon, CheckIcon, DownloadIcon } from './icons';
import { marked } from 'marked';

const AccordionSection = ({ title, content, icon, colorClass, children }: { title: string; content: string; icon: React.ReactNode; colorClass: { bg: string }; children?: React.ReactNode }): React.ReactNode => {
    const [htmlContent, setHtmlContent] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (content) {
            // marked.parse can return a Promise, so we handle it asynchronously.
            const parseContent = async () => {
                try {
                    const parsed = await marked.parse(content);
                    setHtmlContent(parsed);
                } catch (e) {
                    console.error("Error parsing markdown", e);
                    setHtmlContent("<p>Error displaying content.</p>");
                }
            };
            parseContent();
        }
    }, [content]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center p-4 text-left"
        >
            <div className="flex items-center">
                <span className={`p-2 rounded-full bg-opacity-10 ${colorClass.bg}`}>
                    {icon}
                </span>
                <h3 className="text-lg font-semibold text-gray-800 ml-4">{title}</h3>
            </div>
            <div className='flex items-center'>
              {children}
              <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-2">
            <div
                className="prose-output text-gray-700 max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
      )}
    </div>
  );
};

const LoadingSkeleton = (): React.ReactNode => (
  <div className="mt-8 space-y-4 animate-pulse">
    <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
    <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
     <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
  </div>
);

const AnswerDisplay = ({ answer, wordLimit, isLoading }: { answer: UPSCAnswer | null; wordLimit: number; isLoading: boolean; }): React.ReactNode => {
    const [isCopied, setIsCopied] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (!answer) {
    return null; // Don't render anything if there's no answer and not loading
  }

    const modelAnswerWordCount = answer.modelAnswer.trim().split(/\s+/).filter(Boolean).length;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(answer.modelAnswer).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const downloadAsMarkdown = () => {
        const fullContent = `### Chain of Thought and Strategy\n${answer.chainOfThought}\n\n### Model Answer\n${answer.modelAnswer}\n\n### Value-Addition\n${answer.valueAddition}`;
        const blob = new Blob([fullContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'upsc-answer.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <div className="mt-8 animate-fade-in">
        {answer.chainOfThought && (
            <AccordionSection
                title="Chain of Thought & Strategy"
                content={answer.chainOfThought}
                icon={<BrainCircuitIcon className="w-6 h-6 text-purple-600" />}
                colorClass={{bg: "bg-purple-100"}}
            />
        )}
        {answer.modelAnswer && (
            <AccordionSection
                title="Model Answer"
                content={answer.modelAnswer}
                icon={<BookOpenCheckIcon className="w-6 h-6 text-blue-600" />}
                colorClass={{bg: "bg-blue-100"}}
            >
                <div className="flex items-center space-x-2 mr-4">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {modelAnswerWordCount} / {wordLimit} words
                    </span>
                    <button onClick={copyToClipboard} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Copy to Clipboard">
                        {isCopied ? <CheckIcon className="w-5 h-5 text-green-500"/> : <ClipboardCopyIcon className="w-5 h-5"/>}
                    </button>
                </div>
            </AccordionSection>
        )}
        {answer.valueAddition && (
            <AccordionSection
                title="Value-Addition"
                content={answer.valueAddition}
                icon={<GemIcon className="w-6 h-6 text-green-600" />}
                colorClass={{bg: "bg-green-100"}}
            >
                <button onClick={downloadAsMarkdown} className="p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Download as Markdown">
                    <DownloadIcon className="w-5 h-5"/>
                </button>
            </AccordionSection>
        )}
    </div>
  );
};

export default AnswerDisplay;