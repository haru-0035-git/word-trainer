import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ darkMode }) => {
  return (
    <header className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center mb-2">
        <BookOpen className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={28} />
        <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-blue-800'}`}>
          IPA用語クイズ
        </h1>
      </div>
      <p className={`text-sm md:text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        情報処理技術者試験のための用語学習アプリ
      </p>
      <div className={`w-32 h-1 mt-4 rounded ${darkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}></div>
    </header>
  );
};

export default Header;