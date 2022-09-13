const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");
const helper = require("./helper.test");

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("extraterrestre", 10);
    const user = new User({ username: "root", name: "raiz", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "kayra",
      name: "Kayra Berk Tuncer",
      password: "password",
    };

    await api.post("/api/users").send(newUser);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("failing creation on already created user", async () => {
    const newUser = {
      username: "user",
      name: "carlos",
      password: "astronautaviajero",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("creation fails when password too short", async () => {
    const newUser = {
      username: "user",
      name: "carlos",
      password: "aa",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close;
});
