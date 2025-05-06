import React from "react";

interface FooterProps {
  darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer
      className={`mt-12 py-6 text-center ${
        darkMode ? "text-slate-400" : "text-slate-500"
      }`}
    >
      <p className="text-xs mt-2">© {new Date().getFullYear()} クイズアプリ</p>
    </footer>
  );
};

export default Footer;
