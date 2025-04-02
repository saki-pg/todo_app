import app from "../src/index";
import request from "supertest";

describe("POST /todo", () => {
  it("200 OK", async () => {
    const res = await request(app)
      .post("/todo")
      .send({ title: "New Todo"});
    expect(res.body.todo).toBeDefined();
    expect(res.body.todo.title).toBe("New Todo");
  });

  it("missing title", async () => {
    const res = await request(app)
      .post("/todo")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe("title is missing");
  });

  it("invalid title", async() => {
    const res = await request(app)
      .post("/todo")
      .send({ title: 123 });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid title");
  });
});

describe("PUT /todo/:id", () => {
  it("200 OK", async () => {
    const res = await request(app)
      .put("/todo/1")
      .send({ title: "Updated title" });
    expect(res.status).toBe(200);
    expect(res.body.todo).toBeDefined();
    expect(res.body.todo.title).toBe("Updated title");
    expect(res.body.todo.id).toBe("1");
  });

  it("invalid title", async() => {
    const res = await request(app)
      .put("/todo/1")
      .send({ title: 123 });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].msg).toBe("Invalid title")
  });
});
