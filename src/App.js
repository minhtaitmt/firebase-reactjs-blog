import { useState, useEffect } from "react";
import "./App.css";
import "./style.scss";
import "./media-query.css";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import AddEditBlog from "./pages/AddEditBlog";
import About from "./pages/About";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import TagBlogs from "./pages/TagBlogs";
import CategoryBlogs from "./pages/CategoryBlogs";
import DailyBlogs from "./pages/DailyBlogs";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

function App() {
	const [active, setActive] = useState("home");
	const [user, setUser] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				setUser(authUser);
			} else {
				setUser(null);
			}
		});
	}, []);

	const handleLogout = () => {
		signOut(auth).then(() => {
			setUser(null);
			setActive("login");
			navigate("/auth");
		});
	};

	return (
		<div class="App">
			<Header
				setActive={setActive}
				active={active}
				user={user}
				handleLogout={handleLogout}
			/>
			<ToastContainer position="top-center" />
			<Routes>
				<Route
					path="/"
					element={
						<Home
							setActive={setActive}
							user={user}
							active={active}
						/>
					}
				/>
				<Route
					path="/detail/:id"
					element={<Detail setActive={setActive} user={user} />}
				/>
				<Route
					path="/create"
					element={
						user?.uid ? (
							<AddEditBlog user={user} />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/tag/:tag"
					element={<TagBlogs setActive={setActive} />}
				/>
				<Route
					path="/category/:category"
					element={<CategoryBlogs setActive={setActive} />}
				/>
				<Route
					path="/blogs"
					element={<DailyBlogs setActive={setActive} />}
				/>
				<Route
					path="/update/:id"
					element={
						user?.uid ? (
							<AddEditBlog user={user} setActive={setActive} />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route path="/about" element={<About />} />
				<Route
					path="/auth"
					element={<Auth setActive={setActive} setUser={setUser} />}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
