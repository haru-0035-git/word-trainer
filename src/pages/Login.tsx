import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthUser from "../components/AuthUser";

function Login({
  setLoggedInUser,
  darkMode,
}: {
  setLoggedInUser: (user: any) => void;
  darkMode: boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, [setLoggedInUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    if (!username || !password) {
      setError("ユーザー名とパスワードを入力してください。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります。");
      return;
    }

    setError(""); // Clear error if validation passes

    // Authenticate user
    const result = await AuthUser(username, password);
    if (!result.success) {
      setError(result.message || "不明なエラーが発生しました。");
      return;
    }

    setLoggedInUser(result.data); // Save the logged-in user
    localStorage.setItem("loggedInUser", JSON.stringify(result.data)); // Save login state in localStorage
    showLoginMessage(); // Display login success message
    // Redirect or perform post-login actions here
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-orange-50 via-white to-orange-100"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-lg shadow-lg w-full max-w-md ${
          darkMode ? "bg-slate-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            darkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          ログイン
        </h2>
        {error && (
          <div
            className={`mb-4 text-sm text-center ${
              darkMode ? "text-red-400" : "text-red-500"
            }`}
          >
            {error}
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="username"
            className={`block text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            ユーザー名
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white focus:ring-indigo-400 focus:border-indigo-400"
                : "bg-white border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className={`block text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white focus:ring-indigo-400 focus:border-indigo-400"
                : "bg-white border-gray-300 text-black focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            darkMode
              ? "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-400"
              : "bg-orange-400 text-white hover:bg-orange-500 focus:ring-orange-300"
          }`}
        >
          ログイン
        </button>
        <div className="mt-4 text-left">
          <Link
            to="/"
            className={`hover:underline ${
              darkMode ? "text-indigo-400" : "text-orange-400"
            }`}
          >
            ホームに戻る
          </Link>
        </div>
      </form>
    </div>
  );
}

function showLoginMessage() {
  alert("ログインに成功しました！");
}

export default Login;
