import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostsList() {
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination courante
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            setLoading(true);
            try {
                const API_URL = import.meta.env.VITE_API_URL;

                const response = await fetch(
                    `${API_URL}/posts?page=${page}&per_page=${perPage}`,
                    { signal: controller.signal }
                );

                if (!response.ok) throw new Error("Unable to fetch posts");

                const data = await response.json();
                setPosts(data.data || []);
                setMeta(data.meta || {});
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [page]);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Posts</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* 🧾 Table des posts */}
            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center py-3">
                                Loading...
                            </td>
                        </tr>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.author || "Inconnu"}</td>
                                <td>
                                    {post.published ? (
                                        <span className="badge bg-success">Published ✅</span>
                                    ) : (
                                        <span className="badge bg-warning text-dark">
                        Drafted ⏳
                      </span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <Link
                                        to={`/posts/${post.slug}`}
                                        className="btn btn-sm btn-info text-white"
                                    >
                                        <i className="bi bi-eye"></i> Details
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-3 text-muted">
                                No posts found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* 📄 Pagination */}
            {meta.total && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <p className="text-muted small mb-0">
                        Display {meta.current_page} / {meta.last_page} pages (
                        {meta.total} total results)
                    </p>

                    <div className="btn-group">
                        <button
                            className="btn btn-outline-primary btn-sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            « Prev
                        </button>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            disabled={page === meta.last_page}
                            onClick={() => setPage(page + 1)}
                        >
                            Next »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
