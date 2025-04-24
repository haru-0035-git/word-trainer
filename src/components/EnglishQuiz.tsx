import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Award, RefreshCw } from "lucide-react";
import words from "../data/english-words.json";
import CategoryFilter from "./CategoryFilter";
import ScoreDisplay from "./ScoreDisplay";

interface Word {
  term: string;
  meaning: string;
  category: string;
}

interface QuizProps {
  darkMode: boolean;
}

const getRandomChoices = (
  correct: Word,
  allWords: Word[],
  count = 4
): string[] => {
  const choices = new Set<string>();
  choices.add(correct.meaning);

  while (choices.size < count) {
    const random = allWords[Math.floor(Math.random() * allWords.length)];
    if (random.meaning !== correct.meaning) {
      choices.add(random.meaning);
    }
  }

  return Array.from(choices).sort(() => Math.random() - 0.5);
};

const EnglishQuiz: React.FC<QuizProps> = ({ darkMode }) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [answerText, setAnswerText] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredWords, setFilteredWords] = useState<Word[]>(words);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredWords(
        words.filter((word) => word.category === selectedCategory)
      );
    } else {
      setFilteredWords(words);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (filteredWords.length > 0) {
      generateNewQuiz();
    }
  }, [filteredWords]);

  const generateNewQuiz = () => {
    if (filteredWords.length === 0) return;

    setIsAnimating(true);
    setTimeout(() => {
      const randomWord =
        filteredWords[Math.floor(Math.random() * filteredWords.length)];
      setCurrentWord(randomWord);
      setChoices(getRandomChoices(randomWord, words));
      setResult(null);
      setAnswerText(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleAnswer = (answer: string) => {
    if (!currentWord) return;

    if (answer === currentWord.meaning) {
      setResult("correct");
      setAnswerText("🎉 正解！");
      setScore((prev) => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
      }));
    } else {
      setResult("wrong");
      setAnswerText(`❌ 不正解！正解は：「${currentWord.meaning}」`);
      setScore((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 });
    generateNewQuiz();
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            darkMode={darkMode}
            isEnglishQuiz={true}
          />
          <ScoreDisplay score={score} darkMode={darkMode} />
        </div>

        <div
          className={`${
            darkMode
              ? "bg-slate-800 shadow-indigo-900/20"
              : "bg-white shadow-indigo-200/40"
          } shadow-xl rounded-xl p-6 md:p-8 w-full text-center transform transition-opacity duration-300 ${
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {currentWord && (
            <>
              <div className="flex justify-center items-center mb-6">
                <h2
                  className={`text-2xl md:text-3xl font-bold ${
                    darkMode ? "text-white" : "text-indigo-900"
                  }`}
                >
                  <span
                    className={`${
                      darkMode ? "text-blue-400" : "text-blue-700"
                    }`}
                  >
                    {currentWord.term}
                  </span>
                </h2>
              </div>

              <p
                className={`text-lg font-semibold mb-6 ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                この英単語の意味は？
              </p>

              <div className="grid grid-cols-1 gap-3">
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(choice)}
                    disabled={!!result}
                    className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                      !result
                        ? darkMode
                          ? "bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                          : "bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800"
                        : result === "correct" && choice === currentWord.meaning
                        ? darkMode
                          ? "bg-green-800 border-green-700 text-white"
                          : "bg-green-100 border-green-500 text-green-800"
                        : result === "wrong" && choice === currentWord.meaning
                        ? darkMode
                          ? "bg-green-800 border-green-700 text-white"
                          : "bg-green-100 border-green-500 text-green-800"
                        : darkMode
                        ? "bg-slate-700 border-slate-600 text-white opacity-50"
                        : "bg-slate-50 border-slate-200 text-slate-800 opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{choice}</span>
                      {result && choice === currentWord.meaning && (
                        <CheckCircle className="text-green-500" size={20} />
                      )}
                      {result === "wrong" && choice !== currentWord.meaning && (
                        <XCircle className="text-red-500 opacity-0" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {result && (
                <div
                  className={`mt-6 p-4 rounded-lg font-bold text-lg ${
                    result === "correct"
                      ? darkMode
                        ? "bg-green-800/30 text-green-300 border border-green-700"
                        : "bg-green-100 text-green-800 border border-green-200"
                      : darkMode
                      ? "bg-red-900/30 text-red-300 border border-red-800"
                      : "bg-red-100 text-red-800 border border-red-200"
                  } animate-fadeIn`}
                >
                  <div className="flex items-center justify-center">
                    {result === "correct" ? (
                      <CheckCircle className="mr-2 text-green-500" size={20} />
                    ) : (
                      <XCircle className="mr-2 text-red-500" size={20} />
                    )}
                    <span>{answerText}</span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={generateNewQuiz}
                  className={`px-5 py-3 rounded-lg flex items-center justify-center ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } transition-colors`}
                >
                  <RefreshCw size={18} className="mr-2" />
                  次の問題へ
                </button>

                <button
                  onClick={resetQuiz}
                  className={`px-5 py-3 rounded-lg flex items-center justify-center ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-800"
                  } transition-colors`}
                >
                  <Award size={18} className="mr-2" />
                  スコアをリセット
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnglishQuiz;
