const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes;

  return blogs.reduce(reducer, 0);
};
const favouriteBlog = (blogs) => {
  const reducer = (object, item) =>
    object.likes && object.likes > item.likes ? object : item;

  return blogs.reduce(reducer, {});
};
const mostBlogs = (blogs) => {
  let authors = blogs.map((blog) => blog.author);
  authors = [...new Set(authors)];

  let blogsposted = new Array(authors.lenght).fill(0);
  blogs.map((blog) => (blogsposted[authors.indexOf(blogs.author)] += 1));
  let index = blogsposted.indexOf(Math.max(...blogsposted));
  return {
    author: authors[index],
    blogs: blogsposted[index],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
};
