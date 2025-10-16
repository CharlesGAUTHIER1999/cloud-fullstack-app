import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        body: "",
        published: false,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;

                const response = await fetch(
                    `${API_URL}/posts/${slug}`, { signal: controller.signal }
                );
                if (!response.ok) throw new Error("Unable to load the post");
                const data = await response.json();

                setFormData({
                    title: data.title || "",
                    body: data.body || "",
                    published: data.published || false,
                });
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await fetch(`${API_URL}/posts/${slug}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Error updating post");
            }

            setSuccess("✅ Post updated successfully!");
            setTimeout(() => navigate("/posts"), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="text-center mt-5">Loading post...</p>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                {/* Header */}
                <div className="card-header bg-warning text-dark fw-bold">
                    <i className="bi bi-pencil-square"></i> Edit Post
                </div>

                <div className="card-body">
                    {/* Messages */}
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {success && <div className="alert alert-success py-2">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label fw-semibold">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className="mb-3">
                            <label htmlFor="body" className="form-label fw-semibold">
                                Content
                            </label>
                            <textarea
                                name="body"
                                id="body"
                                rows="5"
                                className="form-control"
                                value={formData.body}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {/* Published */}
                        <div className="form-check mb-4">
                            <input
                                type="checkbox"
                                name="published"
                                id="published"
                                className="form-check-input"
                                checked={formData.published}
                                onChange={handleChange}
                                style={{
                                    border: "2px solid #212529",
                                    width: "1.2em",
                                    height: "1.2em",
                                    cursor: "pointer",
                                }}
                            />
                            <label
                                htmlFor="published"
                                className="form-check-label ms-1 text-dark fw-medium"
                            >
                                Published
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                onClick={() => navigate("/posts")}
                                className="btn btn-outline-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-warning text-dark fw-semibold"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
