import app from "../src/index";
import request from "supertest";

describe("POST /todo", () => {
  it("Should create todo", async () => {
    const res = await request(app)
      .post("/todo")
      .send({ title: "New Todo"});
    expect(res.status).toBe(200);
    expect(res.body.todo).toBeDefined();
    expect(res.body.todo.title).toBe("New Todo");
  });

  it("Should reject if title is missing", async () => {
    const res = await request(app)
      .post("/todo")
      .send({});

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe("title is missing");
  });

  it("Should reject title is invalid", async() => {
    const res = await request(app)
      .post("/todo")
      .send({ title: 123 });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].msg).toBe("Invalid title");
  });
});

describe("PUT /todo/:id", () => {
  it("Should update todo", async () => {
    const res = await request(app)
      .put("/todo/1")
      .send({ title: "Updated title" });
    expect(res.status).toBe(200);
    expect(res.body.todo).toBeDefined();
    expect(res.body.todo.title).toBe("Updated title");
    expect(res.body.todo.id).toBe("1");
  });

  it("Should reject if title is invalid", async() => {
    const res = await request(app)
      .put("/todo/1")
      .send({ title: 123 });

    expect(res.status).toBe(422);
    expect(res.body.errors[0].msg).toBe("Invalid title");
  });

  it("Should return 404 if todo is not found", async () => {
    const res = await request(app)
      .put("/todo/999999")
      .send({ title: "Does not matter"});

    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined()
  });

  it("Should reject if id is invalid", async () => {
    const res = await request(app)
      .put("/todo/not-an-integer")
      .send({ title: "Invalid id test" });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });
});
