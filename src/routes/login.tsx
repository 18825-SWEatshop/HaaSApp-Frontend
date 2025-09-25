import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-4 p-6 bg-white rounded shadow-md w-80">
        <img
          src="/android-chrome-192x192.png"
          alt="App Logo"
          className="w-24 h-24 mx-auto rounded-full"
        />
        <div>
          <label htmlFor="username" className="pe-4">
            User ID
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="password" className="pe-4">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => login(username)}
        >
          Login
        </button>
      </div>
    </div>
  );
}

function login(username: string) {
  alert(`Logged in as '${username}'`);
}
