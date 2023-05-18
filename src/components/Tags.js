import React from "react";

const Tags = ({ tags }) => {
	return (
		<div>
			<div>
				<div class="blog-heading text-start py-2 mb-4">Tags</div>
			</div>
			<div class="tags text-start">
				{tags?.map((tag, index) => (
					<p class="tag" key={index}>
						{tag}
					</p>
				))}
			</div>
		</div>
	);
};

export default Tags;
