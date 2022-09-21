import { useState, useEffect, useRef } from "react";
// SERVICES
import blogService from "./services/blogs";
import loginService from "./services/login";
// COMPONENTS
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [update, setUpdate] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, [update]);

  useEffect(() => {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, [notification]);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBlogUser");

    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      setUsername("");
      setPassword("");
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      setNotification(`Welcome ${user.name}`);
    } catch (exception) {
      setNotification("wrong username or password");
      // setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setNotification("");
        // setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogUser");

    setUser(null);
  };

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const response = await blogService.create(blogObject);
      setBlogs(blogs.concat(response));
      setNotification(`a new blog ${response.title} added`);
      setTimeout(() => {
        setNotification("");
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikes = async (id, likes) => {
    await blogService.update({
      id: id,
      likes: likes + 1,
    });

    setUpdate(Math.floor(Math.random() * 1000));
  };

  const handleRemove = async (blog) => {
    const result = window.confirm(`Remove ${blog.title} by ${blog.author}`);
    if (result) {
      await blogService.remove({
        id: blog.id,
      });
      setUpdate(Math.floor(Math.random() * 1000));
    }
  };

  if (user === null) {
    return (
      <div>
        <h1>blogs</h1>
        <Togglable buttonLabel="log in" buttonLabels="hide form">
          <LoginForm
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            notification={notification}
            user={user}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </Togglable>

        {blogs
          .sort((a, b) => (a.likes > b.likes ? -1 : 1))
          .map((blog) => (
            <Blog
              handleLikes={handleLikes}
              handleRemove={handleRemove}
              key={blog.id}
              blog={blog}
            />
          ))}
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1>blogs</h1>
        <p>
          {user.username} logged in
          <button onClick={() => handleLogout()}>logout</button>
        </p>
      </div>

      <Notification notification={notification} />
      <Togglable
        buttonLabel="new blog"
        buttonLabels="hide form"
        ref={blogFormRef}
      >
        <BlogForm
          notification={notification}
          setNotification={setNotification}
          blogs={blogs}
          setBlogs={setBlogs}
          createBlog={createBlog}
        />
      </Togglable>

      {blogs
        .sort((a, b) => (a.likes > b.likes ? -1 : 1))
        .map((blog) => (
          <Blog
            handleLikes={handleLikes}
            handleRemove={handleRemove}
            key={blog.id}
            blog={blog}
          />
        ))}
    </div>
  );
};

export default App;
