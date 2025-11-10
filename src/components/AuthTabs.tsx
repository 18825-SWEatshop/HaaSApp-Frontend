import { Link, useRouterState } from "@tanstack/react-router";

export default function AuthTabs() {
    const { location } = useRouterState();
    const isLogin = location.pathname === "/login";

    const base = "text-3xl font-semibold transition-colors";
    const active = "text-gray-900";
    const inactive = "text-gray-400 hover:text-gray-600";

    return (
        <div className="w-80 mx-auto mb-4 grid grid-cols-[1fr_auto_1fr] items-center text-center">
        {/* Left side - Login */}
        <div className="text-right pr-2 justify-self-start">
            <Link
            to="/login"
            className={`${base} ${isLogin ? active : inactive}`}
            >
            Login
            </Link>
        </div>

        {/* Center - OR bubble */}
        <span className="inline-flex items-center justify-center
                        w-7 h-7 rounded-full border text-[10px] text-gray-500 mx-2">
            OR
        </span>

        {/* Right side - Register */}
        <div className="text-left pl-2 justify-self-end">
            <Link
            to="/register"
            className={`${base} ${!isLogin ? active : inactive}`}
            >
            Register
            </Link>
        </div>
        </div>
    );
}
