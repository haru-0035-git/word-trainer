// InsertScore 関数の修正案 (TypeScript) - console.log を削除

import supabase from "../utils/Utilsupabase"; // Supabaseクライアントをインポート

// quizName から quizId を取得するヘルパー関数 (これは別途実装または既存のものを使用)
// 例: async function getQuizIdByName(name: string): Promise<string | null> { ... }

async function InsertScore(
  scoreValue: number,
  scoreTotalValue: number,
  userId: string | null,
  quizName: string
): Promise<void> {
  if (!userId) {
    console.warn(
      "InsertScore - Warning: userId が null のため、スコア処理をスキップします。"
    );
    return;
  }

  let quizId: string | null = null;
  try {
    const { data: quizData, error: quizError } = await supabase
      .from("quiz") // あなたのクイズテーブル名
      .select("id")
      .eq("name", quizName)
      .single(); // クイズ名はユニークであると仮定

    if (quizError) throw quizError;
    if (!quizData) throw new Error(`Quiz with name "${quizName}" not found.`);
    quizId = quizData.id;
  } catch (error) {
    console.error(
      `InsertScore - Error: クイズIDの取得に失敗しました (quizName: ${quizName}).`,
      error
    );
    return;
  }

  if (!quizId) {
    console.error(
      "InsertScore - Error: 有効な quizId が取得できませんでした。"
    );
    return;
  }

  const { data: existingScore, error: fetchError } = await supabase
    .from("scores") // あなたのスコアテーブル名
    .select("id")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .maybeSingle();

  if (fetchError) {
    console.error(
      "InsertScore - Error: 既存スコアの検索中にエラーが発生しました。",
      fetchError
    );
    return;
  }

  const now = new Date();

  if (existingScore) {
    const { error: updateError } = await supabase
      .from("scores")
      .update({
        score: scoreValue,
        total_number: scoreTotalValue,
        updated_at: now, // Supabaseの標準的な更新日時カラム (存在しない場合は削除)
      })
      .eq("user_id", userId)
      .eq("quiz_id", quizId);

    if (updateError) {
      console.error(
        "InsertScore - Error: スコアの更新中にエラーが発生しました。",
        updateError
      );
    }
  } else {
    const { error: insertError } = await supabase.from("scores").insert([
      {
        user_id: userId,
        quiz_id: quizId,
        score: scoreValue,
        total_number: scoreTotalValue,
        // created_at: now, // Supabaseが自動で設定する場合が多い
        // updated_at: now, // 同上 (存在しない場合は削除)
      },
    ]);

    if (insertError) {
      console.error(
        "InsertScore - Error: 新規スコアの挿入中にエラーが発生しました。",
        insertError
      );
    }
  }
}

// この関数をエクスポートする場合
export { InsertScore };
