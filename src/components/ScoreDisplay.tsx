// ScoreDisplay.tsx (全文修正版)

import React, { useState, useEffect } from "react";
import { TrendingUp, Loader2, AlertTriangle } from "lucide-react"; // ローディングとエラー表示用のアイコンを追加
import { useAuth } from "./AuthUser"; // ユーザー情報を取得するための useAuth フックをインポート
import supabase from "../utils/Utilsupabase"; // Supabaseクライアントをインポート

// PropsはdarkModeのみになります (scoreはコンポーネント内で取得するため不要)
interface ScoreDisplayProps {
  darkMode: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ darkMode }) => {
  // useAuthフックから現在のログインユーザー情報を取得
  const { user } = useAuth();

  // このコンポーネント内でスコアの状態を管理
  const [score, setScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });
  // データ取得中のローディング状態を管理
  const [loading, setLoading] = useState<boolean>(true);
  // エラー状態を管理
  const [error, setError] = useState<string | null>(null);

  // userオブジェクトが変更された（ログイン/ログアウトなど）場合に実行
  useEffect(() => {
    // Supabaseからユーザーの累計スコアを取得する非同期関数
    const fetchTotalScore = async (userId: string) => {
      setLoading(true); // ローディング開始
      setError(null); // エラー状態をリセット

      // 'scores' テーブルから、指定された user_id のレコードをすべて取得
      // カラム名は実際のテーブル定義に合わせてください (ここでは 'score', 'total_number' と想定)
      const { data, error: fetchError } = await supabase
        .from("scores")
        .select("score, total_number")
        .eq("user_id", userId);

      // データ取得中にエラーが発生した場合
      if (fetchError) {
        console.error(
          "ScoreDisplay - Error: スコアの取得に失敗しました。",
          fetchError
        );
        setError("スコア取得エラー");
        setLoading(false); // ローディング終了
        return;
      }

      // データが取得できた場合
      if (data) {
        // 取得した全スコアレコードを合計して累計スコアを計算
        const totalScore = data.reduce(
          (accumulator, currentRecord) => {
            // 各レコードの値がnumber型であることを確認して加算
            accumulator.correct +=
              typeof currentRecord.score === "number" ? currentRecord.score : 0;
            accumulator.total +=
              typeof currentRecord.total_number === "number"
                ? currentRecord.total_number
                : 0;
            return accumulator;
          },
          { correct: 0, total: 0 } // 初期値
        );
        setScore(totalScore); // 計算した累計スコアをstateにセット
      }
      setLoading(false); // ローディング終了
    };

    // ユーザー情報 (user.id) が存在する場合のみ、スコア取得関数を実行
    if (user && user.id) {
      fetchTotalScore(user.id);
    } else {
      // ユーザーがいない (ログアウトしている) 場合は、ローディングを停止しスコアを0にリセット
      setLoading(false);
      setScore({ correct: 0, total: 0 });
    }
  }, [user]); // 依存配列に user を設定し、ログイン状態の変更を検知

  // --- UIのレンダリング ---

  // ローディング中の表示
  if (loading) {
    return (
      <div
        className={`${
          darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"
        } p-3 rounded-lg shadow-md flex items-center justify-start gap-2 w-full md:w-auto`}
      >
        <Loader2 size={18} className="animate-spin text-blue-500" />
        <span className="ml-2 font-medium text-sm whitespace-nowrap">
          スコア読込中...
        </span>
      </div>
    );
  }

  // エラー発生時の表示
  if (error) {
    return (
      <div
        className={`${
          darkMode ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-800"
        } p-3 rounded-lg shadow-md flex items-center justify-start gap-2 w-full md:w-auto`}
      >
        <AlertTriangle size={18} />
        <span className="ml-2 font-medium text-sm whitespace-nowrap">
          {error}
        </span>
      </div>
    );
  }

  // スコア取得成功時の表示 (元のJSXを活用)
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
          累計スコア:
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
