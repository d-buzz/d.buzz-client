import React, { useEffect } from 'react'


const Post = ({ post }) => {
  // Render the post content, including images and text

	useEffect(() => {
		console.log(post)
	}, [post])

	return (
		<div>

		</div>
	)
};


export default Post