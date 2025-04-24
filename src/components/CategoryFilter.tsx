import React from "react";
import { Filter } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  darkMode: boolean;
  isEnglishQuiz?: boolean;
}

const ipaCategories = [
  { id: null, name: "すべて" },
  { id: "security", name: "セキュリティ" },
  { id: "fundamentals", name: "基礎" },
  { id: "development", name: "開発" },
  { id: "infrastructure", name: "インフラ" },
  { id: "database", name: "データベース" },
];

const englishCategories = [
  { id: null, name: "すべて" },
  { id: "食", name: "食べ物・飲み物" },
  { id: "病名", name: "病気・症状" },
  { id: "日常", name: "日用品・生活" },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  darkMode,
  isEnglishQuiz = false,
}) => {
  const categories = isEnglishQuiz ? englishCategories : ipaCategories;

  return (
    <div
      className={`${
        darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
      } p-3 rounded-lg shadow-md w-full md:w-auto`}
    >
      <div className="flex items-center mb-2">
        <Filter
          size={16}
          className={darkMode ? "text-blue-400" : "text-blue-600"}
        />
        <span className="ml-2 text-sm font-medium">カテゴリーでフィルター</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id ?? "all"}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedCategory === category.id
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-600 text-white"
                : darkMode
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
