import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import EnglishQuiz from "./components/EnglishQuiz";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./components/register";
import Header from "./components/Header";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

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
    const confirmLogout = window.confirm("本当にログアウトしますか？");
    if (confirmLogout) {
      setLoggedInUser(null);
      localStorage.removeItem("loggedInUser");
      setLogoutMessage("ログアウトしました。");
      setTimeout(() => setLogoutMessage(""), 3000); // 3秒後にメッセージを消す
    }
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
        {logoutMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-red-500 text-white flex items-center justify-center rounded-full shadow-lg z-50">
            {logoutMessage}
          </div>
        )}
        <header>
          <Header
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            loggedInUser={loggedInUser}
            handleLogout={handleLogout}
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            closeMenu={closeMenu}
            setLoggedInUser={setLoggedInUser}
          />
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
                element={
                  <Login
                    setLoggedInUser={setLoggedInUser}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/register"
                element={<Register darkMode={darkMode} />}
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
