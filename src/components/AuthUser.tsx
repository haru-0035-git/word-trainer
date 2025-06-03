// AuthUser.tsx

import { useState, useEffect } from "react";
import supabase from "../utils/Utilsupabase"; // Supabaseクライアントのパスは環境に合わせてください
import bcrypt from "bcryptjs";

// AuthUser関数が返すデータオブジェクトの型
interface AuthUserData {
  id: string; // ユーザーID (UUID形式を期待)
  username: string; // ユーザー名
}

// AuthUser関数の返り値の型
interface AuthUserResponse {
  success: boolean;
  message?: string; // エラーメッセージなど
  data?: AuthUserData; // 認証成功時のユーザーデータ
}

/**
 * ユーザー名とパスワードで認証を行います。
 * 成功した場合、ユーザー情報をlocalStorageに保存し、ユーザーデータを返します。
 * @param username ユーザー名
 * @param password パスワード
 * @returns 認証結果とユーザーデータ (成功時)
 */
async function AuthUser(
  username: string,
  password: string
): Promise<AuthUserResponse> {
  // Supabaseの 'users' テーブルからユーザー情報を取得
  // 'id' (UUID), 'name' (ユーザー名), 'password' (ハッシュ化済み) を選択
  const { data, error } = await supabase
    .from("users") // あなたのユーザーテーブル名
    .select("id, name, password")
    .eq("name", username) // 'name' カラムでユーザー名を検索
    .single(); // 該当ユーザーが1件であることを期待

  // ユーザーが存在しない、DBエラー、またはパスワードが一致しない場合
  if (error || !data || !data.password) {
    return {
      success: false,
      message: "ユーザー名またはパスワードが違います。",
    };
  }

  // bcrypt.compareSync で入力パスワードとDBのハッシュ化パスワードを比較
  const passwordIsValid = bcrypt.compareSync(password, data.password);
  if (!passwordIsValid) {
    return {
      success: false,
      message: "ユーザー名またはパスワードが違います。",
    };
  }

  // --- authTokenの生成と保存 (旧ロジック、セキュリティ注意) ---
  // このauthTokenは username:password のBase64エンコードであり、セキュリティ上問題があります。
  // UUID形式のユーザーIDも含まないため、スコア送信のユーザーID特定には使えません。
  // 本番環境ではSupabase AuthのJWTなど、より安全なセッション管理を推奨します。
  function utf8ToBase64(str: string): string {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return "";
    }
  }
  const legacyAuthToken = utf8ToBase64(`${username}:${password}`);
  localStorage.setItem("authToken", legacyAuthToken); // このトークンの使用は非推奨

  // --- スコア送信等で利用するユーザー情報 (UUIDとユーザー名) をlocalStorageに保存 ---
  // こちらが 'id' (UUID) を含み、安全に利用できる情報です。
  const loggedInUserInfo: AuthUserData = { id: data.id, username: data.name };
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUserInfo));

  // 認証成功
  return { success: true, data: loggedInUserInfo };
}

/**
 * 現在ログインしているユーザーの情報を管理・提供するカスタムフック。
 * @returns { user: AuthUserData | null } ログインユーザーの情報、またはnull
 */
function useAuth(): { user: AuthUserData | null } {
  const [user, setUser] = useState<AuthUserData | null>(null);

  useEffect(() => {
    // コンポーネントマウント時にlocalStorageからログインユーザー情報を読み込む
    const savedUserJson = localStorage.getItem("loggedInUser");

    if (savedUserJson) {
      try {
        const parsedUser = JSON.parse(savedUserJson) as AuthUserData; // 型アサーション

        // 必要なプロパティ (id, username) が存在するか確認
        if (parsedUser && parsedUser.id && parsedUser.username) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("loggedInUser"); // 不正なデータは削除
          setUser(null); // ユーザー情報をクリア
        }
      } catch (e) {
        localStorage.removeItem("loggedInUser"); // パースできないデータは削除
        setUser(null); // ユーザー情報をクリア
      }
    }
  }, []); // 空の依存配列で、マウント時に一度だけ実行

  return { user };
}

export { AuthUser, useAuth };
