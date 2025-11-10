import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import AuthTabs from "~/components/AuthTabs";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Login failed");
      const { token } = await res.json();
      localStorage.setItem("token", token);
      navigate({ to: "/projects" });
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Tabs ABOVE the box */}
      <AuthTabs />

      {/* Outlined box */}
      <div className="flex flex-col gap-4 p-6 bg-white border border-black rounded w-80">
        <img
          src="/android-chrome-192x192.png"
          alt="App Logo"
          className="w-24 h-24 mx-auto rounded-full"
        />

        <div>
          <label htmlFor="username" className="pe-4 text-gray-900 font-semibold">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>

        <div>
          <label htmlFor="password" className="pe-4 text-gray-900 font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>

        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          onClick={handleLogin}
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}
