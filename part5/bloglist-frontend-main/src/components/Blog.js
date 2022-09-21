import { useState } from "react";
const Blog = ({ blog, handleLikes, handleRemove }) => {
  const [visible, setVisible] = useState(false);
  // const hideVisible = { display: visible ? "none" : "" };
  const showVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    padding: 15,
    border: "solid",
    borderWidth: 1,
    borderRadius: 6,
    margin: 10,
  };

  // const handleLikes = (event) => {
  //   event.preventDefault();
  //   updateBlog(blog.likes);
  // };
  return (
    <div className="blog" style={blogStyle}>
      <h3>{blog.title}</h3>
      <p>Author: {blog.author}</p>
      <button onClick={toggleVisibility}>view</button>
      <div style={showVisible}>
        <p>URL: {blog.url}</p>
        <p>
          Likes: {blog.likes}
          <button
            className="like"
            onClick={() => handleLikes(blog.id, blog.likes)}
          >
            like
          </button>
        </p>
      </div>
      <button className="remove" onClick={() => handleRemove(blog)}>
        Remove
      </button>
    </div>
  );
};

export default Blog;
