import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Quiz from "./components/Quiz";
import EnglishQuiz from "./components/EnglishQuiz";
import Footer from "./components/Footer";
import Home from "./pages/Home";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div
        className={`min-h-screen ${
          darkMode
            ? "dark bg-slate-900"
            : "bg-gradient-to-br from-orange-50 via-white to-orange-100"
        } transition-colors duration-300`}
      >
        <header className="bg-gradient-to-r from-orange-400 to-orange-300 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold hover:text-orange-100 transition-colors"
            >
              Word Trainer
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-slate-700 text-yellow-300"
                  : "bg-orange-200 text-orange-600"
              } transition-colors duration-300`}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <main className="mt-8">
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route path="/quiz" element={<Quiz darkMode={darkMode} />} />
              <Route
                path="/english-quiz"
                element={<EnglishQuiz darkMode={darkMode} />}
              />
            </Routes>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </Router>
  );
}

export default App;
