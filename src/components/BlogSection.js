import React from "react";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";

const BlogSection = ({ blogs, user, handleDelete }) => {
	const userId = user?.uid;
	return (
		<div>
			<div class="blog-heading text-start py-2 mb-4">Daily Blogs</div>
			{blogs?.map((item) => (
				<div class="row pb-4" key={item.id}>
					<div class="col-md-5">
						<div class="hover-blogs-img">
							<div class="blogs-img">
								<img src={item.imgUrl} alt={item.title} />
								<div></div>
							</div>
						</div>
					</div>
					<div class="col-md-7">
						<div class="text-start">
							<h6 class="category catg-color">{item.category}</h6>
							<span class="title py-2">{item.title}</span>
							<span class="meta-info">
								<p class="author">{item.author}</p> -&nbsp;
								{item.timestamp.toDate().toDateString()}
							</span>
						</div>
						<div class="short-description text-start">
							{excerpt(item.description, 120)}
						</div>
						<Link to={`/detail/${item.id}`}>
							<button class="btn btn-read">Read More</button>
						</Link>
						{userId && item.userId === userId && (
							<div style={{ float: "right" }}>
								<FontAwesome
									name="trash"
									style={{
										margin: "15px",
										cursor: "pointer",
									}}
									size="2x"
									onClick={() => handleDelete(item.id)}
								/>
								<Link to={`/update/${item.id}`}>
									<FontAwesome
										name="edit"
										style={{ cursor: "pointer" }}
										size="2x"
									/>
								</Link>
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default BlogSection;
