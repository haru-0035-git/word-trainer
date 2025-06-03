// Quiz.tsx (全文修正版)

import React, { useEffect, useState, useCallback } from "react"; // useCallback をインポート
import { CheckCircle, XCircle, Award, RefreshCw } from "lucide-react";
// words.json をインポート (tsconfig.json で resolveJsonModule: true が必要)
import wordsFromFile from "../data/words.json";
import CategoryFilter from "./CategoryFilter"; // パスは実際の環境に合わせてください
import ScoreDisplay from "./ScoreDisplay"; // パスは実際の環境に合わせてください
import { InsertScore } from "./Insertdata"; // パスは実際の環境に合わせてください
import { useAuth } from "./AuthUser"; // useAuthフックを AuthUser.ts (または .tsx) からインポート

// Wordインターフェース (既に定義されているものを使用)
interface Word {
  term: string;
  meaning: string;
  category: string;
}

// words.json の型を Word[] として明示的に指定
const words: Word[] = wordsFromFile as Word[];

// QuizコンポーネントのPropsインターフェース (既に定義されているものを使用)
interface QuizProps {
  darkMode: boolean;
}

// ランダムな選択肢を生成するヘルパー関数
const getRandomChoices = (
  correctWord: Word,
  allWords: Word[], // 選択肢の元となる全単語リスト
  count = 4
): string[] => {
  const choices = new Set<string>();
  choices.add(correctWord.meaning); // 正解をまずセットに追加

  // allWords が十分に存在し、かつ正解以外の単語がある場合に選択肢を追加
  if (allWords.length > 1) {
    // 少なくとも正解以外の単語が1つは必要
    while (choices.size < count && choices.size < allWords.length) {
      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      if (randomWord.meaning !== correctWord.meaning) {
        choices.add(randomWord.meaning);
      }
    }
  }

  // 選択肢が指定数に満たない場合、ダミーで補完 (任意)
  // この例では、不足していてもそのまま返す
  // let dummyIndex = 1;
  // while (choices.size < count) {
  //   choices.add(`選択肢 ${dummyIndex++}`);
  // }

  return Array.from(choices).sort(() => Math.random() - 0.5); // 配列にしてシャッフル
};

const Quiz: React.FC<QuizProps> = ({ darkMode }) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [answerText, setAnswerText] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // 初期表示は全単語 (words.json からインポートしたものをデフォルトに)
  const [filteredWords, setFilteredWords] = useState<Word[]>(words);
  const [isAnimating, setIsAnimating] = useState(false);

  // useAuthフックから現在のユーザー情報を取得
  const { user } = useAuth(); // user は { id: string; name: string } | null 型

  // カテゴリ選択が変更された時のフィルタリング処理
  useEffect(() => {
    if (selectedCategory) {
      const normalizedSelectedCategory = selectedCategory.trim().toLowerCase(); // 正規化
      const result = words.filter(
        (word) =>
          word.category.trim().toLowerCase() === normalizedSelectedCategory // word.categoryも正規化
      );
      setFilteredWords(result);
    } else {
      setFilteredWords(words);
    }
    // カテゴリ変更時にスコアをリセットするかは仕様によります
    // setScore({ correct: 0, total: 0 });
  }, [selectedCategory]); // words は不変なので依存配列から削除しても良いが、念のため

  // 新しいクイズ問題を生成する関数 (useCallbackでメモ化)
  const generateNewQuiz = useCallback(() => {
    if (filteredWords.length === 0) {
      setCurrentWord(null); // 表示できる単語がない場合はnullを設定
      setChoices([]); // 選択肢も空にする
      return;
    }

    setIsAnimating(true); // アニメーション開始
    setTimeout(() => {
      // filteredWords からランダムに単語を選択
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      const randomWord = filteredWords[randomIndex];
      setCurrentWord(randomWord);
      // 選択肢は常に全単語 (words) から生成することで、多様な誤答選択肢を提示
      setChoices(getRandomChoices(randomWord, words));
      setResult(null); // 結果表示をリセット
      setAnswerText(null); // 回答テキストをリセット
      setIsAnimating(false); // アニメーション終了
    }, 300); // 300ms の遅延はアニメーションのため
  }, [filteredWords]); // filteredWords が変更されたらこの関数も再生成される

  // filteredWords が変更された（つまりカテゴリ選択が変わったか、初期ロード後）場合に新しいクイズを生成
  useEffect(() => {
    generateNewQuiz();
  }, [generateNewQuiz]); // generateNewQuiz は useCallback でメモ化されているため、不要な再実行を防ぐ

  // ユーザーの回答を処理する関数
  const handleAnswer = (answer: string) => {
    if (!currentWord) return; // 現在の問題がない場合は何もしない

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

  // クイズとスコアをリセットする関数
  const resetQuiz = () => {
    setScore({ correct: 0, total: 0 });
    generateNewQuiz(); // 現在のカテゴリフィルタに基づいて新しいクイズを開始
  };

  // カテゴリフィルターの変更をハンドルする関数
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // スコアをリセットするかは任意
    // setScore({ correct: 0, total: 0 });
  };

  // スコアをサーバーに送信する関数
  const submitScore = async () => {
    // useAuthフックから取得したユーザー情報を使用
    if (!user || !user.id) {
      alert("スコアを送信するにはログインが必要です。");
      return;
    }

    // user.id がUUID形式であることを期待 (AuthUser.ts で保存する際に保証されている前提)
    const userId = user.id;

    // InsertScore 関数に渡す quizName を決定するロジック
    // 例: 現在選択されているカテゴリ名、または現在の単語のカテゴリ、それがなければ固定の名称
    const quizName = "quiz"; // より適切なクイズ名を検討

    // InsertScore 関数を呼び出し (第4引数は quizName 文字列)
    await InsertScore(score.correct, score.total, userId, quizName);
  };

  // JSXによるUIレンダリング
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            darkMode={darkMode}
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
          {currentWord ? ( // currentWord が null でない場合のみクイズ内容を表示
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
                この用語の意味はどれ？
              </p>

              <div className="grid grid-cols-1 gap-3">
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(choice)}
                    disabled={!!result} // 結果が表示されている間はボタンを無効化
                    className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                      !result // 回答前
                        ? darkMode
                          ? "bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                          : "bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800"
                        : result === "correct" && choice === currentWord.meaning // 正解で、かつ正解の選択肢
                        ? darkMode
                          ? "bg-green-800 border-green-700 text-white"
                          : "bg-green-100 border-green-500 text-green-800"
                        : result === "wrong" && choice === currentWord.meaning // 不正解で、(間違って選んだ選択肢ではなく) 正解の選択肢
                        ? darkMode // 不正解時に正解の選択肢をハイライト
                          ? "bg-green-800 border-green-700 text-white" // 正解を示すスタイル
                          : "bg-green-100 border-green-500 text-green-800" // 正解を示すスタイル
                        : darkMode // 上記以外 (回答済みで、ハイライト対象でない選択肢)
                        ? "bg-slate-700 border-slate-600 text-white opacity-50"
                        : "bg-slate-50 border-slate-200 text-slate-800 opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{choice}</span>
                      {/* 正解の選択肢にチェックマークを表示 */}
                      {result && choice === currentWord.meaning && (
                        <CheckCircle className="text-green-500" size={20} />
                      )}
                      {/* ユーザーが選択した不正解の選択肢にXマークを表示（このロジックは現状のコードでは不完全） */}
                      {/* ユーザーが選択した選択肢を記憶するstateが別途必要になります */}
                      {/* result === "wrong" && choice === "ユーザーが選択した誤答" && ( <XCircle className="text-red-500" size={20} /> ) */}
                      {/* 元のコードではXCircleはopacity-0だったので、表示しない意図かもしれません */}
                      {result === "wrong" && choice !== currentWord.meaning && (
                        <XCircle className="text-red-500 opacity-0" size={20} /> // 元のコード通り非表示
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {result && ( // 正解・不正解の結果メッセージ表示
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
                  disabled={filteredWords.length === 0 && !currentWord} // 表示できる単語がない場合は無効化も検討
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

                <button
                  onClick={submitScore}
                  disabled={!user} // ログインしていない場合は送信ボタンを無効化 (任意)
                  className={`px-5 py-3 rounded-lg flex items-center justify-center ${
                    darkMode
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-200 hover:bg-green-300 text-green-800"
                  } transition-colors ${
                    !user ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Submit Score
                </button>
              </div>
            </>
          ) : (
            // currentWord が null (ロード中や表示できる単語がない) 場合の表示
            <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
              {filteredWords.length === 0 && !selectedCategory
                ? "単語データをロード中です..."
                : filteredWords.length === 0 && selectedCategory
                ? "このカテゴリには単語がありません。"
                : "クイズを開始しています..."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
