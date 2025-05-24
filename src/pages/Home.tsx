import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Globe } from "lucide-react";

interface HomeProps {
  darkMode: boolean;
}

const Home: React.FC<HomeProps> = ({ darkMode }) => {
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    const message = localStorage.getItem("loginMessage");
    if (message) {
      setLoginMessage(message);
      setTimeout(() => {
        setLoginMessage("");
        localStorage.removeItem("loginMessage");
      }, 3000); // 3秒後にメッセージを消す
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div
        className={`max-w-2xl mx-auto ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {loginMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-green-500 text-white flex items-center justify-center rounded-full shadow-lg z-50">
            {loginMessage}
          </div>
        )}
        <div className="flex items-center justify-center mb-6">
          <BookOpen
            className={`mr-3 ${
              darkMode ? "text-orange-400" : "text-orange-500"
            }`}
            size={40}
          />
          <h1 className="text-4xl font-bold">ようこそ Word Trainer へ</h1>
        </div>
        <p
          className={`text-xl mb-12 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          効率的に単語を学習しましょう
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-slate-800" : "bg-white"
            } shadow-lg`}
          >
            <BookOpen
              className={`mx-auto mb-4 ${
                darkMode ? "text-orange-400" : "text-orange-500"
              }`}
              size={32}
            />
            <h2 className="text-xl font-bold mb-3">IPA用語クイズ</h2>
            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              情報処理技術者試験の専門用語を学習
            </p>
            <Link
              to="/quiz"
              className={`inline-block px-6 py-3 rounded-lg text-white font-semibold 
                ${
                  darkMode
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-orange-400 hover:bg-orange-500"
                } 
                transition-colors duration-300 shadow-md hover:shadow-lg`}
            >
              始める
            </Link>
          </div>

          <div
            className={`p-6 rounded-xl ${
              darkMode ? "bg-slate-800" : "bg-white"
            } shadow-lg`}
          >
            <Globe
              className={`mx-auto mb-4 ${
                darkMode ? "text-blue-400" : "text-blue-500"
              }`}
              size={32}
            />
            <h2 className="text-xl font-bold mb-3">英単語クイズ</h2>
            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              日常で使える英単語を学習
            </p>
            <Link
              to="/english-quiz"
              className={`inline-block px-6 py-3 rounded-lg text-white font-semibold 
                ${
                  darkMode
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-blue-400 hover:bg-blue-500"
                } 
                transition-colors duration-300 shadow-md hover:shadow-lg`}
            >
              始める
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
