import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon, PlusCircleIcon, TrashIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onNew: () => void;
}

const HistoryPanel = ({ history, activeId, onSelect, onDelete, onClear, onNew }: HistoryPanelProps): React.ReactNode => {
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <aside className="w-full md:w-80 lg:w-96 bg-gray-900 text-white flex flex-col h-screen">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                    <HistoryIcon className="w-6 h-6 text-gray-400" />
                    <h2 className="text-xl font-bold ml-3">History</h2>
                </div>
                <button
                    onClick={onNew}
                    className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
                    title="Start New Answer"
                >
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    New
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {history.length === 0 ? (
                    <div className="text-center p-8 text-gray-400">
                        <p>Your generated answers will appear here.</p>
                    </div>
                ) : (
                    <ul>
                        {history.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => onSelect(item.id)}
                                    className={`w-full text-left p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors group ${activeId === item.id ? 'bg-indigo-900/50' : ''}`}
                                >
                                    <p className="font-semibold text-sm truncate text-gray-100">{item.inputs.question}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-gray-400">{formatDate(item.timestamp)}</p>
                                        <div 
                                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                            className="p-1 rounded-full text-gray-500 hover:text-red-400 hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete Entry"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {history.length > 0 && (
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={onClear}
                        className="w-full flex items-center justify-center py-2 px-4 text-sm text-red-300 hover:text-white hover:bg-red-500/20 rounded-md transition-colors"
                    >
                        <TrashIcon className="w-4 h-4 mr-2" />
                        Clear All History
                    </button>
                </div>
            )}
        </aside>
    );
};

export default HistoryPanel;
