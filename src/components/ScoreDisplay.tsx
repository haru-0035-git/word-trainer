import React from "react";
import { TrendingUp } from "lucide-react";

interface ScoreDisplayProps {
  score: {
    correct: number;
    total: number;
  };
  darkMode: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, darkMode }) => {
  const percentage =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  return (
    <div
      className={`${
        darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
      } p-3 rounded-lg shadow-md flex items-center justify-between w-full md:w-auto`}
    >
      <div className="flex items-center">
        <TrendingUp
          size={18}
          className={darkMode ? "text-blue-400" : "text-blue-600"}
        />
        <span className="ml-2 font-medium text-sm whitespace-nowrap">
          スコア:
        </span>
      </div>

      <div className="flex items-center gap-2 flex-nowrap">
        <div className="text-sm whitespace-nowrap">
          <span className="font-bold">{score.correct}</span>
          <span className="text-slate-400">/</span>
          <span>{score.total}</span>
        </div>

        <div
          className={`px-2 py-1 rounded text-xs font-bold ${
            percentage >= 80
              ? darkMode
                ? "bg-green-900/40 text-green-300"
                : "bg-green-100 text-green-800"
              : percentage >= 60
              ? darkMode
                ? "bg-yellow-900/40 text-yellow-300"
                : "bg-yellow-100 text-yellow-800"
              : darkMode
              ? "bg-red-900/40 text-red-300"
              : "bg-red-100 text-red-800"
          }`}
        >
          {percentage}%
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
