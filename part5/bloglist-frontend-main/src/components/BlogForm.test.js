import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm";

test("the form calls the event handler it received as props with the right details when a new blog is created", () => {
  const createBlog = jest.fn();

  const component = render(<BlogForm createBlog={createBlog} />);

  const title = component.container.querySelector("#title");
  const author = component.container.querySelector("#author");
  const url = component.container.querySelector("#url");
  const likes = component.container.querySelector("#likes");
  const form = component.container.querySelector("form");

  fireEvent.change(title, {
    target: { value: "Test title" },
  });
  fireEvent.change(author, {
    target: { value: "carlos" },
  });
  fireEvent.change(url, {
    target: { value: "google.com" },
  });
  fireEvent.change(likes, {
    target: { value: 3 },
  });

  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Test title");
  expect(createBlog.mock.calls[0][0].author).toBe("carlos");
  expect(createBlog.mock.calls[0][0].url).toBe("google.com");
  expect(createBlog.mock.calls[0][0].likes).toBe("3");
});
