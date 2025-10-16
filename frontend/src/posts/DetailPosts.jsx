import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function DetailPost() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [role, setRole] = useState("guest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        (async() => {
            try {
                const API_URL = window.location.hostname === "localhost"
                    ? import.meta.env.VITE_API_URL_LOCAL
                    : import.meta.env.VITE_API_URL_DOCKER;
                const response = await fetch(
                    `${API_URL}/posts/${slug}`,
                    { signal: controller.signal}
                );

                if (!response.ok) throw new Error("Post not found");
                const data = await response.json();
                setPost(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        })();
        const userRole = sessionStorage.getItem("role") || "guest";
        setRole(userRole);
        return () => controller.abort();
    }, [slug]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        try {
            const API_URL = window.location.hostname === "localhost"
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_DOCKER;

            const response = await fetch(
                `${API_URL}/posts/${slug}`,
                { method: "DELETE" }
            );
            if (!response.ok) throw new Error("Error deleting the post");

            setMessage("🗑️ Post deleted successfully!");
            setTimeout(() => navigate("/posts"), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="text-center mt-5">Loading post...</p>;
    if (error)
        return <p className="text-center text-danger mt-5">❌ {error}</p>;
    if (!post) return null;

    const getBackLink = () => {
        if (role === "admin")
            return { path: "/admin", label: "← Back to Admin Dashboard", style: "btn-outline-dark" };
        if (role === "editor")
            return { path: "/posts", label: "← Back to Posts", style: "btn-outline-primary" };
        return { path: "/", label: "← Back to Home Page", style: "btn-outline-secondary" };
    };

    const back = getBackLink();

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                {/* Header Section */}
                <div className="card-header bg-light d-flex justify-content-between align-items-center mb-3">
                    <Link to={back.path} className={`btn ${back.style} btn-sm`}>
                        {back.label}
                    </Link>
                    <span className="fw-bold text-muted">Post Details</span>
                </div>

                <div className="card-body">
                    {/* ✅ Message de confirmation */}
                    {message && <div className="alert alert-success py-2">{message}</div>}

                    {/* Post Title */}
                    <h1 className="h3 fw-bold mb-3 text-dark">{post.title}</h1>

                    {/* Publication Status */}
                    {post.published ? (
                        <span className="badge bg-success mb-3 px-3 py-2">Published ✅</span>
                    ) : (
                        <span className="badge bg-warning text-dark mb-3 px-3 py-2">
              Drafted ⏳
            </span>
                    )}

                    {/* Metadata */}
                    <div className="mb-4 text-muted small">
                        <p className="mb-1">
                            <strong>Author:</strong> {post.author || "Unknown"}
                        </p>
                        <p className="mb-1">
                            <strong>Created on:</strong>{" "}
                            {new Date(post.created_at).toLocaleString()}
                        </p>
                        <p>
                            <strong>Updated on:</strong>{" "}
                            {new Date(post.updated_at).toLocaleString()}
                        </p>
                    </div>

                    {/* Content */}
                    <article className="p-3 bg-light rounded shadow-sm mb-4">
                        <strong>Content :</strong>
                        <p className="mt-2" style={{ whiteSpace: "pre-line" }}>
                            {post.body}
                        </p>
                    </article>

                    {/* Action Buttons */}
                    {(role === "editor" || role === "admin") && (
                        <div className="d-flex justify-content-end gap-2">
                            <Link
                                to={`/posts/edit/${post.slug}`}
                                className="btn btn-warning text-dark fw-semibold"
                            >
                                ✏️ Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="btn btn-danger text-white fw-semibold"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
