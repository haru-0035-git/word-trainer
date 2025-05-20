import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Menu, X, Moon, Sun, BookOpen, Globe } from "lucide-react";
import Quiz from "./components/Quiz";
import EnglishQuiz from "./components/EnglishQuiz";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  // const [loginMessage, setLoginMessage] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    console.log("ログアウトしました。");
  };

  return (
    <Router>
      <div
        className={`min-h-screen flex flex-col ${
          darkMode
            ? "dark bg-slate-900"
            : "bg-gradient-to-br from-orange-50 via-white to-orange-100"
        } transition-colors duration-300`}
      >
        {/* {loginMessage && (
          <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2">
            {loginMessage}
          </div>
        )} */}
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
              <button
                onClick={handleLogout}
                className="ml-auto px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
              >
                ログアウト
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-auto px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              >
                ログイン
              </Link>
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
            className={`absolute top-full right-0 mt-2 mr-6 w-64 rounded-lg shadow-lg transition-all duration-300 transform origin-top-right ${
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
                  <BookOpen
                    size={18}
                    className={`mr-2 ${
                      darkMode ? "text-orange-400" : "text-orange-500"
                    }`}
                  />
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
                  <Globe
                    size={18}
                    className={`mr-2 ${
                      darkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  英単語クイズ
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 flex-grow">
          <main className="mt-8">
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route path="/quiz" element={<Quiz darkMode={darkMode} />} />
              <Route
                path="/english-quiz"
                element={<EnglishQuiz darkMode={darkMode} />}
              />
              <Route
                path="/login"
                element={<Login setLoggedInUser={setLoggedInUser} />}
              />
            </Routes>
          </main>
        </div>
        <div className="mt-auto">
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </Router>
  );
}

export default App;
