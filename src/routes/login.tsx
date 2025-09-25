import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <label htmlFor="username" className="pe-4">
          User ID
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="username"
          className="border rounded"
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
          className="border rounded"
        />
      </div>
      <button
        type="submit"
        className="self-start bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => login(username)}
      >
        Login
      </button>
    </div>
  );
}

function login(username: string) {
  alert(`Logged in as '${username}'`);
}
