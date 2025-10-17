import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [role, setRole] = useState(sessionStorage.getItem("role") || "guest");
    useEffect(() => {
        const syncRole = (e) => {
            if (e.key === "role") setRole(e.newValue || "guest");
        };
        window.addEventListener("storage", syncRole);
        return () => window.removeEventListener("storage", syncRole);
    }, []);

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };

    return (
        <div className="text-center mt-5">
            <h1 className="display-5 fw-bold mb-4">🚀 Welcome to AppCloud</h1>
            <p className="lead mb-5">Manage your posts and explore the admin dashboard.</p>

            <div className="mb-4">
                <span className="me-2 fw-semibold">Current role:</span>
                <span className="badge bg-dark text-uppercase">{role}</span>

                <div className="mt-3 d-flex justify-content-center gap-2">
                    <button
                        className={`btn btn-outline-secondary btn-sm ${
                            role === "guest" ? "active" : ""
                        }`}
                        onClick={() => handleRoleChange("guest")}
                    >
                        Guest
                    </button>
                    <button
                        className={`btn btn-outline-primary btn-sm ${
                            role === "editor" ? "active" : ""
                        }`}
                        onClick={() => handleRoleChange("editor")}
                    >
                        Editor
                    </button>
                    <button
                        className={`btn btn-outline-warning btn-sm text-dark ${
                            role === "admin" ? "active" : ""
                        }`}
                        onClick={() => handleRoleChange("admin")}
                    >
                        Admin
                    </button>
                </div>
            </div>

            <div className="row justify-content-center mt-5">
                {/* Card: Handle Posts */}
                <div className="col-md-3">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">📄 Handle posts</h5>
                            <p className="card-text">See, create or edit your posts</p>
                            <Link to="/posts" className="btn btn-primary w-100">
                                Show posts
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Card: Admin Space */}
                <div className="col-md-3">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">⚙️ Admin Space</h5>
                            <p className="card-text">Use admin tab to handle app</p>
                            {role === "admin" ? (
                                <Link to="/admin" className="btn btn-secondary w-100">
                                    Go to Admin
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="btn btn-secondary w-100 opacity-75"
                                    title="Admin access only"
                                >
                                    Admin (restricted)
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
