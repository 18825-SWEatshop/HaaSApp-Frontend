import { Link, useRouterState } from "@tanstack/react-router";

export default function AuthTabs() {
    const { location } = useRouterState();
    const isLogin = location.pathname === "/login";

    const base = "text-3xl font-semibold transition-colors";
    const active = "text-gray-900";
    const inactive = "text-gray-400 hover:text-gray-600";

    return (
    <div className="w-80 mx-auto mb-4 flex items-center justify-center gap-2">
        <Link
        to="/login"
        className={`${base} ${isLogin ? active : inactive}`}
        >
        Login
        </Link>

        <span className="inline-flex items-center justify-center
                        w-6 h-6 rounded-full border text-[10px] text-gray-500">
        OR
        </span>

        <Link
        to="/register"
        className={`${base} ${!isLogin ? active : inactive}`}
        >
        Register
        </Link>
    </div>
    );
}
