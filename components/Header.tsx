import React from 'react';
import { PenSquareIcon } from './icons';

const Header = (): React.ReactNode => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
                <PenSquareIcon className="h-8 w-8 text-indigo-600" />
                <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">
                    Mains Answer Generator
                </h1>
            </div>
            <p className="hidden md:block text-sm text-gray-500">AI-powered insights for UPSC preparation.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
