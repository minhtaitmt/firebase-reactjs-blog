import {
	collection,
	doc,
	getDoc,
	getDocs,
	serverTimestamp,
	updateDoc,
	Timestamp,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Tags from "./../components/Tags";
import MostPopular from "./../components/MostPopular";
import Like from "../components/Like";
import CommentInput from "../components/CommentInput";
import Comments from "../components/Comments";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";


const Detail = ({ setActive, user }) => {
	const userId = user?.uid;
	const { id } = useParams();
	const [blog, setBlog] = useState(null);
	const [blogs, setBlogs] = useState([]);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(false);
	let [likes, setLikes] = useState([]);
	const [comments, setComments] = useState([]);
	const [userComment, setUserComment] = useState("");

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

	if (loading) {
		return <Spinner />;
	  }

	const getBlogDetail = async () => {
		setLoading(true);
		const docRef = doc(db, "blogs", id);
		const blogDetail = await getDoc(docRef);
		setBlog(blogDetail.data());
		setLikes((blogDetail.data() && blogDetail.data().likes) ? blogDetail.data().likes : []); //
		setComments(
			(blogDetail.data() && blogDetail.data().comments) ? blogDetail.data().comments : []
		);
		setActive(null);
		setLoading(false);
	};

	//
	const handleLike = async () => {
		if (userId) {
			if (blog?.likes) {
				const index = likes.findIndex((id) => id === userId);
				if (index === -1) {
					likes.push(userId);
					setLikes([...new Set(likes)]);
				} else {
					likes = likes.filter((id) => id !== userId);
					setLikes(likes);
				}
			}
			await updateDoc(doc(db, "blogs", id), {
				...blog,
				likes,
				timestamp: serverTimestamp(),
			});
		}
	};

	// store comments to db
	const handleComment = async (e) => {
		e.preventDefault();
		comments.push({
			createdAt: Timestamp.fromDate(new Date()),
			userId,
			name: user?.displayName,
			body: userComment,
		});
		toast.success("Comment posted successfully");
		await updateDoc(doc(db, "blogs", id), {
			...blog,
			comments,
			timestamp: serverTimestamp(),
		});
		setComments(comments);
		setUserComment("");
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
								<Like
									handleLike={handleLike}
									likes={likes}
									userId={userId}
								/>
							</span>
							<p class="text-start" style={{whiteSpace: "pre-line"}}>{blog?.description}</p>
							<div className="custombox">
								<div className="scroll">
									<h4 className="small-title">
										{comments?.length} Comment
									</h4>
									{isEmpty(comments) ? (
										<Comments
											msg={
												"No Comment yet posted on this blog. Be the first to comment"
											}
										/>
									) : (
										<>
											{comments?.map((comment) => (
												<Comments {...comment} />
											))}
										</>
									)}
								</div>
							</div>
							<CommentInput
								userId={userId}
								userComment={userComment}
								setUserComment={setUserComment}
								handleComment={handleComment}
							/>
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
