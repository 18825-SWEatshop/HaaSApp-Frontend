import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AuthTabs from "~/routes/authTabs";

export const Route = createFileRoute("/register")({
    component: Register,
});

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

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
            <label htmlFor="name" className="pe-4">
                Username
            </label>
            <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded w-full px-2 py-1"
            />
            </div>

            <div>
            <label htmlFor="email" className="pe-4">
                Email address
            </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded w-full px-2 py-1"
            />
            </div>

            <div>
            <label htmlFor="pw" className="pe-4">
                Password
            </label>
            <input
                id="pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="border rounded w-full px-2 py-1"
            />
            </div>

            <p className="text-sm text-gray-600">
            Your personal data will be used to support your experience throughout
            this website, to manage access to your account, and for other purposes
            described in our privacy policy.
            </p>

            <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
            onClick={() => register(name, email)}
            >
            REGISTER
            </button>
        </div>
        </div>
    );
}

function register(name: string, email: string) {
  alert(`User is trying to register: ${name} / ${email}`);
}
