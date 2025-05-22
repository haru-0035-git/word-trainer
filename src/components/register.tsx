import React, { useState } from "react";
import bcrypt from "bcryptjs";
import supabase from "../utils/Utilsupabase";

const Register: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username || !password) {
      setError("ユーザー名とパスワードを入力してください");
      return;
    }

    if (username.length < 3) {
      setError("ユーザー名は3文字以上である必要があります");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります");
      return;
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const { error } = await supabase.from("users").insert({
        name: username,
        password: hashedPassword,
      });

      if (error) {
        setError("登録中にエラーが発生しました: ");
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError("予期しないエラーが発生しました: ");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-orange-50 via-white to-orange-100"
      }`}
    >
      <div
        className={`max-w-md w-full p-8 rounded-lg shadow-md ${
          darkMode ? "bg-slate-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">新規登録</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mb-4">登録が完了しました！</p>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              ユーザー名:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              パスワード:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            登録
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
