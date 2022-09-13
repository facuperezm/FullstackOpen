const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("users", { username: 1, name: 1 });

  response.json(blogs.map((blog) => blog.toJSON()));
});

router.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

router.post("/", async (request, response) => {
  const body = request.body;
  const token = request.token;
  const decodedToken = request.body.decodedToken;

  if (!token || !decodedToken.id)
    return response.status(401).json({ error: "token missing or invalid" });

  const user = await User.findById(decodedToken.id);

  if (!body.title || !body.url)
    return response.status(400).json({ error: "title or url is missing" });

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog.toJSON());
});

router.delete("/:id", async (request, response) => {
  if (!request.token || !request.decodedToken) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  try {
    const blog = await Blog.findById(request.params.id);
    if (blog.user.toString() === request.decodedToken.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(400).end();
    }
  } catch (error) {
    response.status(400).end;
  }
});

router.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    likes: body.likes,
  };

  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.json(result.toJSON());
  } catch (error) {
    response.status(400).end;
  }
});

module.exports = router;
