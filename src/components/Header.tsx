import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  loggedInUser: any;
  handleLogout: () => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  setLoggedInUser: (user: any) => void;
}

const Header: React.FC<HeaderProps> = ({
  darkMode,
  toggleDarkMode,
  loggedInUser,
  handleLogout,
  isMenuOpen,
  toggleMenu,
  closeMenu,
  setLoggedInUser,
}) => {
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser && !loggedInUser) {
      setLoggedInUser && setLoggedInUser(JSON.parse(savedUser));
    }
  }, [loggedInUser, setLoggedInUser]);

  return (
    <header className="bg-gradient-to-r from-orange-400 to-orange-300 text-white shadow-lg relative">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-orange-100 transition-colors"
          >
            Word Trainer
          </Link>
        </div>
        {loggedInUser ? (
          <div className="ml-auto flex items-center">
            <span className="mr-4">{loggedInUser.username}さん</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="ml-auto px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            >
              ログイン
            </Link>
            <Link
              to="/register"
              className="ml-4 px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              サインイン
            </Link>
          </>
        )}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-lg hover:bg-orange-500/20 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Hamburger Menu */}
      <div
        className={`absolute top-full right-0 mt-2 mr-6 w-64 rounded-lg shadow-lg transition-all duration-300 transform origin-top-right z-50 ${
          isMenuOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        } ${darkMode ? "bg-slate-800" : "bg-white"}`}
      >
        <div className="p-4">
          <div
            className={`border-b ${
              darkMode ? "border-slate-700" : "border-gray-200"
            } pb-2 mb-2`}
          >
            <button
              onClick={toggleDarkMode}
              className={`w-full px-4 py-3 rounded-lg flex items-center justify-between ${
                darkMode
                  ? "hover:bg-slate-700 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              <span className="flex items-center">
                {darkMode ? (
                  <>
                    <Sun size={18} className="mr-2 text-yellow-400" />
                    ライトモードに切り替え
                  </>
                ) : (
                  <>
                    <Moon size={18} className="mr-2 text-slate-600" />
                    ダークモードに切り替え
                  </>
                )}
              </span>
              <div
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  darkMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform duration-300 transform ${
                    darkMode
                      ? "translate-x-6 bg-white"
                      : "translate-x-0 bg-white"
                  }`}
                />
              </div>
            </button>
          </div>

          <nav>
            <Link
              to="/quiz"
              onClick={closeMenu}
              className={`w-full px-4 py-2 rounded-lg flex items-center mb-2 ${
                darkMode
                  ? "hover:bg-slate-700 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              IPA用語クイズ
            </Link>
            <Link
              to="/english-quiz"
              onClick={closeMenu}
              className={`w-full px-4 py-2 rounded-lg flex items-center ${
                darkMode
                  ? "hover:bg-slate-700 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              英単語クイズ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
