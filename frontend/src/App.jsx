import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import Home from "./Home.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import {PostsList} from "./posts/PostsList.jsx";
import CreatePost from "./posts/CreatePost.jsx";
import EditPost from "./posts/EditPost.jsx";
import DetailPost from "./posts/DetailPosts.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts" element={<PostsList />} />
                    <Route path="/posts/:slug" element={<DetailPost />} />
                    <Route path="/posts/create" element={<CreatePost />} />
                    <Route path="/posts/edit/:slug" element={<EditPost />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

