import React from "react";
import { Link } from "react-router-dom";

const Tags = ({ tags }) => {
	return (
		<div>
			<div>
				<div class="blog-heading text-start py-2 mb-4">Tags</div>
			</div>
			<div class="tags text-start">
				{tags?.map((tag, index) => (
					<Link
					to={`/tag/${tag}`}
					style={{ textDecoration: "none"}}
				  >
					<p class="tag" key={index}>
						{tag}
					</p>
				  </Link>
					
				))}
			</div>
		</div>
	);
};

export default Tags;
