import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState({});
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        per_page: 10,
        page: 1,
    });
    const [loading, setLoading] = useState(false);
    const [message] = useState("");

    const fetchPosts = async (controller) => {
        setLoading(true);
        try {
            const query = new URLSearchParams(
                Object.fromEntries(
                    Object.entries(filters).map(([key, value]) => [key, String(value)])
                )
            ).toString();

            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(
                `${API_URL}/posts?${query}`,
                { signal: controller?.signal }
            );

            if (!response.ok) throw new Error("Unable to fetch Posts");
            const data = await response.json();
            setPosts(data.data || []);
            setMeta(data.meta || {});
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("❌ Error during posts loading:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            await fetchPosts(controller);
        })();
        return () => controller.abort();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    const handlePageChange = (pageNumber) => {
        setFilters((prev) => ({
            ...prev,
            page: pageNumber,
        }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this post ?")) return;

        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Deleting error");

            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("❌ Error while deleting :", error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-4">Admin Board Tab ⚙️</h2>

            {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-300">
                    {message}
                </div>
            )}

            {/* 🔍 Filters */}
            <form
                className="flex flex-wrap gap-2 items-center mb-4"
                onSubmit={(e) => e.preventDefault()}
            >
                <input
                    type="text"
                    name="search"
                    placeholder="Search by title or author..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="border rounded-md p-2 w-48"
                />

                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="border rounded-md p-2"
                >
                    <option value="">-- All status --</option>
                    <option value="published">Published</option>
                    <option value="drafted">Drafted</option>
                </select>

                <select
                    name="per_page"
                    value={filters.per_page}
                    onChange={handleFilterChange}
                    className="border rounded-md p-2"
                >
                    {[10, 25, 50, 100].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() => fetchPosts()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Apply
                </button>
            </form>

            {/* 🧾 Table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full border border-gray-400 divide-y divide-gray-300">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2 border border-gray-300">ID</th>
                        <th className="px-4 py-2 border border-gray-300">Title</th>
                        <th className="px-4 py-2 border border-gray-300">Author</th>
                        <th className="px-4 py-2 border border-gray-300">Status</th>
                        <th className="px-4 py-2 border border-gray-300">Views</th>
                        <th className="px-4 py-2 border border-gray-300">Created</th>
                        <th className="px-4 py-2 border border-gray-300">Updated</th>
                        <th className="px-4 py-2 border border-gray-300">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                Loading ...
                            </td>
                        </tr>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <tr
                                key={post.id}
                                className="text-center border-b border-gray-300 hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-2">{post.id}</td>
                                <td className="px-4 py-2">{post.title}</td>
                                <td className="px-4 py-2">
                                    {post.author || "Unknown"}
                                </td>
                                <td className="px-4 py-2">
                                    {post.published ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                                                Published ✅
                                            </span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">
                                                Drafted ⏳
                                            </span>
                                    )}
                                </td>
                                <td className="px-4 py-2">{post.views}</td>
                                <td className="px-4 py-2">
                                    {new Date(post.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                    {new Date(post.updated_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex flex-col items-stretch gap-3 w-28">
                                        <button
                                            onClick={() => navigate(`/posts/${post.slug}`)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md h-9 flex items-center justify-center transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => navigate(`/posts/edit/${post.slug}`)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md h-9 flex items-center justify-center transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md h-9 flex items-center justify-center transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="8"
                                className="text-center py-4 text-gray-500"
                            >
                                No posts found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* 📄 Pagination Info */}
            {meta.total && (
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <p>
                        Displaying {meta.current_page} / {meta.last_page} pages (
                        {meta.total} total results)
                    </p>
                    <div className="flex gap-2">
                        {Array.from({ length: meta.last_page }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${
                                    meta.current_page === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
