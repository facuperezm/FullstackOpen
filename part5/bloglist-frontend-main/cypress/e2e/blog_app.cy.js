describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Super User",
      username: "root",
      password: "password",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("frontpage can be opened", function () {
    cy.contains("blogs");
  });
  it("open log in form ", function () {
    cy.contains("log in").click();
  });
  it("Login form is shown", function () {
    cy.contains("username");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("log in").click();
      cy.get("#username").type("root");
      cy.get("#password").type("password");
      cy.get("#login-button").click();

      cy.contains("root logged in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("log in").click();
      cy.get("#username").type("root");
      cy.get("#password").type("wrongpassword");
      cy.get("#login-button").click();

      cy.contains("wrong username or password");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:3003/api/login", {
        username: "root",
        password: "password",
      }).then((response) => {
        localStorage.setItem("loggedBlogUser", JSON.stringify(response.body));
        cy.visit("http://localhost:3000");
      });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("Testing");
      cy.get("#author").type("Carlos");
      cy.get("#url").type("google.com");
      cy.get("#likes").type(2);
      cy.get("#create-blog").click();

      cy.contains("Testing");
    });
  });

  describe("a blog  exists", function () {
    beforeEach(function () {
      cy.request("POST", "http://localhost:3003/api/login", {
        username: "root",
        password: "password",
      }).then((response) => {
        localStorage.setItem(
          "loggedBlogappUser",
          JSON.stringify(response.body)
        );
        cy.visit("http://localhost:3000");
      });
      const body = {
        title: "Testing",
        author: "Carlos",
        url: "google.com",
        likes: 21,
      };
      cy.createBlog(body);
    });
    it("A user can like a blog", function () {
      cy.contains("view").click();
      cy.contains("like").click();
    });
    it("A user can delete blog", function () {
      cy.contains("Carlos");
      cy.contains("Remove").click();
      cy.on("windows:confirm", () => true);
    });
  });
});
describe("having more blogs", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/login", {
      username: "root",
      password: "password",
    }).then((response) => {
      localStorage.setItem("loggedBlogappUser", JSON.stringify(response.body));
      cy.visit("http://localhost:3000");
    });
    const blog1 = {
      title: "Testing1",
      author: "Carlos",
      url: "mozilla.com",
      likes: 1,
    };
    const blog2 = {
      title: "The second most liked test",
      author: "Juan",
      url: "yahoo.com",
      likes: 200,
    };
    const blog3 = {
      title: "The most liked test of all times",
      author: "Peter",
      url: "google.com",
      likes: 500,
    };

    cy.createBlog(blog1);
    cy.createBlog(blog2);
    cy.createBlog(blog3);
  });

  it("first blog has more likes", function () {
    cy.contains("view").click();
    cy.get("div>.blog")
      .eq(0)
      .should("contain", "The most liked test of all times");
    cy.get("div>.blog").eq(1).should("contain", "The second most liked test");
  });
});
