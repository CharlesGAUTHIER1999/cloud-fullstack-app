import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AppLayout() {
    const [locale, setLocale] = useState("fr");
    const navigate = useNavigate();

    const switchLanguage = (lang) => {
        setLocale(lang);
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-dark shadow-sm navbar-expand-lg">
                <div className="container-fluid d-flex justify-content-between align-items-center">

                    {/* Left section: Logo + Navigation */}
                    <div className="d-flex align-items-center gap-2">
                        {/* Logo */}
                        <Link className="navbar-brand fw-bold me-3" to="/">
                            🚀 ApptestGauthier2
                        </Link>

                        {/* Posts Dropdown */}
                        <div className="dropdown me-2">
                            <button
                                className="btn btn-outline-light btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-card-list"></i> Posts
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/posts">
                                        📑 Posts list
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/posts/create">
                                        ➕ New post
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/posts/edit">
                                        ✏️ Edit a post
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Admin Button */}
                        <button
                            className="btn btn-outline-info btn-sm"
                            onClick={() => {
                                const role = sessionStorage.getItem("role");
                                if (role === "admin") {
                                    navigate("/admin");
                                } else {
                                    alert("🚫 Admin access only!");
                                }
                            }}
                        >
                            <i className="bi bi-gear"></i> Admin Tab
                        </button>
                    </div>

                    {/* Right section: Language + Username */}
                    <div className="d-flex align-items-center">
                        {/* Language Dropdown */}
                        <div className="dropdown ms-3">
                            <button
                                className="btn btn-outline-light btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                🌐 {locale.toUpperCase()}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => switchLanguage("en")}
                                    >
                                        🇬🇧 English
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => switchLanguage("fr")}
                                    >
                                        🇫🇷 Français
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* User / Author name */}
                        <span className="navbar-text text-white fw-bold ms-3">
              Charles Gauthier
            </span>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="container py-4 flex-grow-1">
                <Outlet />
            </main>

            <footer className="bg-dark text-light text-center py-3 mt-auto small">
                © {new Date().getFullYear()} ApptestGauthier2 • Built with React + Laravel 🚀
            </footer>
        </div>
    );
}
