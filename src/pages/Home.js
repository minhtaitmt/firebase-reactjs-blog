import React, { useState, useEffect } from "react";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { db } from "../firebase";
import BlogSection from "../components/BlogSection";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";
import Trending from "../components/Trending";
import Category from "../components/Category";

const Home = ({ setActive, user, active }) => {
	const [loading, setLoading] = useState(true);
	const [blogs, setBlogs] = useState([]);
	const [tags, setTags] = useState([]);
	const [trendBlogs, setTrendBlogs] = useState([]);
	const [totalBlogs, setTotalBlogs] = useState(null);
	const [hide, setHide] = useState(false);
	const [lastVisible, setLastVisible] = useState(null);

	const getTrendingBlogs = async () => {
		const blogRef = collection(db, "blogs");
		const trendQuery = query(blogRef, where("trending", "==", "yes"));
		const querySnapshot = await getDocs(trendQuery);
		let trendBlogs = [];
		querySnapshot.forEach((doc) => {
			trendBlogs.push({ id: doc.id, ...doc.data() });
		});
		setTrendBlogs(trendBlogs);
	};

	useEffect(() => {
		getTrendingBlogs();
		const unsub = onSnapshot(
			collection(db, "blogs"),
			(snapshot) => {
				let list = [];
				let tags = [];
				snapshot.docs.forEach((doc) => {
					tags.push(...doc.get("tags"));
					list.push({ id: doc.id, ...doc.data() });
				});
				const uniqueTags = [...new Set(tags)];
				setTags(uniqueTags);
				// setBlogs(list);
				setTotalBlogs(list);
				setLoading(false);
				setActive("home");
			},
			(error) => {
				console.log(error);
			}
		);

		return () => {
			unsub();
			getTrendingBlogs();
		};
	}, [setActive]);

	useEffect(() => {
		getBlogs();
		setHide(false);
	}, [active]);

	const getBlogs = async () => {
		const blogRef = collection(db, "blogs");
		const firstFour = query(blogRef, orderBy("title"), limit(4));
		const docSnapshot = await getDocs(firstFour);
		setBlogs(
			docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
		);
		setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
	};


	const updateState = (docSnapshot) => {
		const isCollectionEmpty = docSnapshot.size === 0;
		if (!isCollectionEmpty) {
			const blogsData = docSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setBlogs((blogs) => [...blogs, ...blogsData]);
			setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
		} else {
			toast.info("No more blog to display");
			setHide(true);
		}
	};

	// load more blogs tu position la lastVisible
	const loadMore = async () => {
		setLoading(true);
		const blogRef = collection(db, "blogs");
		const nextFour = query(
			blogRef,
			orderBy("title"),
			limit(4),
			startAfter(lastVisible)
		);
		const docSnapshot = await getDocs(nextFour);
		updateState(docSnapshot);
		setLoading(false);
	};

	if (loading) {
		return <Spinner />;
	}

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this blog ?")) {
			try {
				setLoading(true);
				await deleteDoc(doc(db, "blogs", id));
				toast.success("Blog deleted successfully!");
				getBlogs()(blogs.length <= 4) ? setHide(false) : setHide(true);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
	};

	// category count
	const counts = totalBlogs.reduce((prevValue, currentValue) => {
		let name = currentValue.category;
		if (!prevValue.hasOwnProperty(name)) {
			prevValue[name] = 0;
		}
		prevValue[name]++;
		// delete prevValue["undefined"];
		return prevValue;
	}, {});

	const categoryCount = Object.keys(counts).map((k) => {
		return {
			category: k,
			count: counts[k],
		};
	});

	return (
		<div>
			<div class="container-fluid pb-4 pt-4 padding">
				<div class="container padding">
					<div class="row mx-0">
						<Trending blogs={trendBlogs} />
						<div class="col-md-8">
							<div className="blog-heading text-start py-2 mb-4">
								Daily Blogs
							</div>
							{blogs?.map((blog) => (
								<BlogSection
									key={blog.id}
									user={user}
									handleDelete={handleDelete}
									{...blog}
								/>
							))}
							{!hide && (
								<button
									className="btn btn-secondary"
									onClick={loadMore}
								>
									Load More
								</button>
							)}
						</div>
						<div class="col-md-3">
							<Category catgBlogsCount={categoryCount} />
							<Tags tags={tags} />
							<MostPopular blogs={blogs} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
