import React from "react";
import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [likes, setLikes] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
      likes,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
    setLikes("");
  };

  return (
    <>
      <div>
        <div>
          <h1>create new</h1>
          <form onSubmit={handleSubmit}>
            <div>
              title:
              <input
                id="title"
                value={title}
                name="title"
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author:
              <input
                id="author"
                value={author}
                name="author"
                onChange={({ target }) => setAuthor(target.value)}
              />
            </div>
            <div>
              url:
              <input
                id="url"
                value={url}
                name="url"
                onChange={({ target }) => setUrl(target.value)}
              />
            </div>
            <div>
              likes:
              <input
                id="likes"
                value={likes}
                name="likes"
                onChange={({ target }) => setLikes(target.value)}
              />
            </div>
            <div>
              <button id="create-blog" type="submit">
                create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BlogForm;
