import React from 'react';
import type { FormInputs } from '../types';
import { LoaderIcon, SparklesIcon } from './icons';

interface InputFormProps {
  inputs: FormInputs;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const InputForm = ({ inputs, onInputChange, onSubmit, isLoading }: InputFormProps): React.ReactNode => {
  const subjects = [
    "GS Paper 1: History, Art & Culture, Society, Geography",
    "GS Paper 2: Governance, Constitution, Polity, Social Justice, IR",
    "GS Paper 3: Technology, Economic Development, Bio-diversity, Environment, Security, Disaster Management",
    "GS Paper 4: Ethics, Integrity, Aptitude",
    "Essay",
    "History Optional",
    "Geography Optional",
    "Public Administration Optional",
    "Sociology Optional",
    "Political Science & IR Optional",
    "Other"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject / Paper
          </label>
          <select
            id="subject"
            name="subject"
            value={inputs.subject}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            required
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1.5">
            Question
          </label>
          <textarea
            id="question"
            name="question"
            value={inputs.question}
            onChange={onInputChange}
            rows={5}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            placeholder="Enter the full question text here..."
            required
          />
        </div>

        <div>
          <label htmlFor="wordLimit" className="block text-sm font-medium text-gray-700 mb-1.5">
            Word Limit
          </label>
          <input
            type="number"
            id="wordLimit"
            name="wordLimit"
            value={inputs.wordLimit}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            placeholder="e.g., 150 or 250"
            step="10"
            min="50"
            max="1000"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="mr-3 h-5 w-5" />
              Generating Answer...
            </>
          ) : (
            <>
              <SparklesIcon className="mr-3 h-5 w-5" />
              Generate Answer
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;