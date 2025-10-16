import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const navigate = useNavigate();

    // 🔹 State to handle form fields
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        published: false,
    });

    // 🔹 State to handle errors et messages of success
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // 🔹 Changes handled in fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 🔹 Form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const API_URL = window.location.hostname === "localhost"
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_DOCKER;

            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error while creating the post");
            }

            setSuccess("✅ Post created successfully!");
            setTimeout(() => navigate("/posts"), 1500); // Redirection

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm border-0">
                {/* Header */}
                <div className="card-header bg-primary text-white fw-bold">
                    <i className="bi bi-plus-circle"></i> New Post
                </div>

                <div className="card-body">
                    {/* ✅ Messages */}
                    {error && (
                        <div className="alert alert-danger py-2">{error}</div>
                    )}
                    {success && (
                        <div className="alert alert-success py-2">{success}</div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* 🔹 Title */}
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label fw-semibold">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="form-control"
                                placeholder="Enter the post title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 🔹 Content */}
                        <div className="mb-3">
                            <label htmlFor="body" className="form-label fw-semibold">
                                Content
                            </label>
                            <textarea
                                name="body"
                                id="body"
                                rows="5"
                                className="form-control"
                                placeholder="Write your post content here..."
                                required
                                value={formData.body}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        {/* 🔹 Published */}
                        <div className="form-check mb-4">
                            <input
                                type="checkbox"
                                name="published"
                                id="published"
                                className="form-check-input"
                                checked={formData.published}
                                onChange={handleChange}
                                style={{ border: "2px solid #212529", width: "1.2em", height: "1.2em" }}
                            />
                            <label htmlFor="published" className="form-check-label ms-1 text-dark fw-medium">
                                Published
                            </label>
                        </div>

                        {/* 🔹 Buttons */}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                onClick={() => navigate("/posts")}
                                className="btn btn-outline-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
