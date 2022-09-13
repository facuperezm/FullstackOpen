const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./helper.test");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token;
const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

beforeAll(async () => {
  await User.deleteMany({});
  const user = {
    username: "test",
    name: "test user",
    password: "password",
  };

  await api
    .post("/api/users")
    .send(user)
    .set("Accept", "application/json")
    .expect("Content-Type", /application\/json/);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("id is a property", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

test("a valid blog can be added ", async () => {
  const initialResponse = await api.get("/api/blogs");

  const newBlog = {
    title: "Full Stack Open Course",
    author: "facundito",
    url: "https://facu.com/",
    likes: 1,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `bearer ${token}`);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialResponse.body.length + 1);
});

test("zero likes defaults to zero", async () => {
  const newBlog = {
    title: "Facundo",
    author: "Facundito",
    url: "https://facundo.com",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `bearer ${token}`);
  expect(response.body.likes).toBeDefined();
});

test("title or url missing will respond with 400", async () => {
  const newBlog = {
    author: "Facundito",
    url: "https://facundo.com",
    likes: 2,
  };
  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `bearer ${token}`);
  expect(response.status).toBe(400);
});

test("deleting a blog", async () => {
  const initialResponse = await api.get("/api/blogs");
  const newBlog = {
    title: "Full Stack Open Course",
    author: "facundito",
    url: "https://facu.com/",
    likes: 1,
  };
  const result = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `bearer ${token}`);
  const response = await api.get(`/api/blogs/${result.body.id}`);
  const deleteBlog = await api.delete(`/api/blogs/${result.body.id}`);
  const blogsAtEnd = await helper.blogsInDb();

  expect(deleteBlog.status).toBe(204);
});

test("a blog may be edited by issuing http put request", async () => {
  const newBlog = {
    title: "Full Stack Open Course",
    author: "facundito",
    url: "https://facu.com/",
    likes: 1,
  };

  const result = await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `bearer ${token}`);

  newBlog.likes += 1;

  await api
    .put(`/api/blogs/${result.body.id}`)
    .send(newBlog)
    .set("Authorization", `bearer ${token}`);
  const newResult = await api.get(`/api/blogs/${result.body.id}`);
  expect(newResult.body.likes).toBe(newBlog.likes);
});

afterAll(() => {
  mongoose.connection.close();
});
