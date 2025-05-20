import { useState } from "react";
import { Link } from "react-router-dom";
import AuthUser from "../components/AuthUser";

function Login({ setLoggedInUser }: { setLoggedInUser: (user: any) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation logic
    if (!username || !password) {
      setError("ユーザー名とパスワードを入力してください。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは8文字以上である必要があります。");
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
    showLoginMessage(); // Display login success message
    // Redirect or perform post-login actions here
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center`}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          ログイン
        </h2>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            ユーザー名
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-400 text-white py-2 px-4 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
        >
          ログイン
        </button>
        <div className="mt-4 text-left">
          <Link to="/" className="text-orange-400 hover:underline">
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
