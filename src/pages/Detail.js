import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Tags from "./../components/Tags";
import MostPopular from "./../components/MostPopular";

const Detail = ({ setActive }) => {
	const { id } = useParams();
	const [blog, setBlog] = useState(null);
	const [blogs, setBlogs] = useState([]);
	const [tags, setTags] = useState([]);

	useEffect(() => {
		const getBlogsData = async () => {
			const blogRef = collection(db, "blogs");
			const blogs = await getDocs(blogRef);
			setBlogs(blogs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
			let tags = [];
			blogs.docs.map((doc) => tags.push(...doc.get("tags")));
			let uniqueTags = [...new Set(tags)];
			setTags(uniqueTags);
		};

		getBlogsData();
	}, []);

	useEffect(() => {
		id && getBlogDetail();
		//eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const getBlogDetail = async () => {
		const docRef = doc(db, "blogs", id);
		const blogDetail = await getDoc(docRef);
		setBlog(blogDetail.data());
		setActive(null);
	};

	return (
		<div class="single">
			<div
				class="blog-title-box"
				style={{ backgroundImage: `url('${blog?.imgUrl}')` }}
			>
				<div class="overlay"></div>
				<div class="blog-title">
					<span>{blog?.timestamp.toDate().toDateString()}</span>
					<h2>{blog?.title}</h2>
				</div>
			</div>
			<div class="container-fluid pb-4 pt-4 padding blog-single-content">
				<div class="container padding">
					<div class="row mx-0">
						<div class="col-md-8">
							<span class="meta-info text-start">
								By <p class="author">{blog?.author}</p> -&nbsp;
								{blog?.timestamp.toDate().toDateString()}
							</span>
							<p class="text-start">{blog?.description}</p>
						</div>
						<div class="col-md-3">
							<Tags tags={tags} />
							<MostPopular blogs={blogs} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Detail;
