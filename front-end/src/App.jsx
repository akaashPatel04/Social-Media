import "./App.css";
import "./post/style.css";
import "./components/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

import Login from "./user/Login";
import Register from "./user/Register";
import Feed from "./pages/Feed";
import Profile from "./user/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import SideBar from "./components/Sidebar";
import PostPage from "./post/PostPage";
import UpdateProfile from "./user/UpdateProfile";
import UpdatePassword from "./user/components/UpdatePassword";
import CreatePost from "./post/CreatePost";
import UserProfile from "./pages/UserProfile";
import Search from "./pages/Search";

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-center"
        theme="dark"
        hideProgressBar
        closeButton={false}
        autoClose={4000}
      />
      {user && user._id && <SideBar image={user.avatar?.url} />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          {/* Logged In */}
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/update" element={<UpdateProfile />} />
          <Route path="/password/change" element={<UpdatePassword />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/search" element={<Search />} />

          {/* POSTS */}
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
