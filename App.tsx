import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnswerDisplay from './components/AnswerDisplay';
import HistoryPanel from './components/HistoryPanel';
import { generateUPSCAnswer } from './services/geminiService';
import type { FormInputs, UPSCAnswer, HistoryItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WelcomeIcon } from './components/icons';


const App = (): React.ReactNode => {
  const [inputs, setInputs] = useState<FormInputs>({
    subject: 'GS Paper 2: Governance, Constitution, Polity, Social Justice, IR',
    question: '',
    wordLimit: 150,
  });
  const [activeAnswer, setActiveAnswer] = useState<UPSCAnswer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('upsc-answer-history', []);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'wordLimit' ? parseInt(value, 10) : value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.question || !inputs.subject) return;

    setIsLoading(true);
    setError(null);
    setActiveAnswer(null);
    setActiveHistoryId(null);

    try {
      const structuredAnswer = await generateUPSCAnswer(inputs);
      
      setActiveAnswer(structuredAnswer);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        inputs,
        answer: structuredAnswer,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]); // Keep latest 50
      setActiveHistoryId(newHistoryItem.id);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputs, setHistory]);

  const handleSelectHistory = useCallback((id: string) => {
    const selected = history.find(item => item.id === id);
    if (selected) {
      setInputs(selected.inputs);
      setActiveAnswer(selected.answer);
      setActiveHistoryId(id);
    }
  }, [history]);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (activeHistoryId === id) {
      setActiveAnswer(null);
      setActiveHistoryId(null);
    }
  }, [activeHistoryId, setHistory]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setActiveAnswer(null);
    setActiveHistoryId(null);
  }, [setHistory]);

  const startNewAnswer = useCallback(() => {
    setActiveAnswer(null);
    setActiveHistoryId(null);
    setInputs({
      subject: 'GS Paper 2: Governance, Constitution, Polity, Social Justice, IR',
      question: '',
      wordLimit: 150,
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      <HistoryPanel
        history={history}
        activeId={activeHistoryId}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
        onNew={startNewAnswer}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <InputForm
              inputs={inputs}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {error && (
              <div className="mt-8 bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-md animate-fade-in" role="alert">
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !activeAnswer && !error && (
               <div className="mt-8 text-center text-gray-500 bg-white p-10 rounded-lg shadow-md border border-gray-200">
                  <WelcomeIcon className="mx-auto w-16 h-16 text-gray-400" />
                  <h3 className="text-xl mt-4 font-bold text-gray-700 font-serif">Welcome to MainsAnswer-GPT</h3>
                  <p className="mt-2 max-w-md mx-auto">Enter a question above to generate a structured, high-quality answer. Your results will be saved in the history panel.</p>
               </div>
            )}
            
            {(isLoading || activeAnswer) && (
              <AnswerDisplay
                answer={activeAnswer}
                wordLimit={inputs.wordLimit}
                isLoading={isLoading}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;