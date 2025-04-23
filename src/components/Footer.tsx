import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer className={`mt-12 py-6 text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
      <p className="flex items-center justify-center text-sm">
        Made with <Heart className="mx-1 text-pink-500" size={16} /> for IPA exam students
      </p>
      <p className="text-xs mt-2">
        © {new Date().getFullYear()} IPAクイズアプリ
      </p>
    </footer>
  );
};

export default Footer;