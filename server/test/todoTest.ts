import app from "../src/index";
import request from "supertest";

type Todo = {
  id: number;
  title: string;
  isCompleted: boolean;
}

describe("GET /todo", () => {
  it("Should return a paginated list of todos", async () => {
    const res = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 1,
        itemsCountPerPaginationPage: 10,
        isCompleted: true,
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.todos)).toBe(true);
  });

  it("Should filter isCompleted=true", async () => {
    const res = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 1,
        itemsCountPerPaginationPage: 10,
        isCompleted: true,
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos.every((todo: Todo) => todo.isCompleted === true)).toBe(true);
    expect(res.body.todos.length).toBeGreaterThan(0);
  });

  it("Should filter isCompleted=false", async () => {
    const res = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 1,
        itemsCountPerPaginationPage: 10,
        isCompleted: false,
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos.every((todo: Todo) => todo.isCompleted === false)).toBe(true);
  })

  it("Should return all todos when isCompleted is not specified", async () => {
    const allRes = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 1,
        itemsCountPerPaginationPage: 100,
      });

    const trueRes = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 1,
        itemsCountPerPaginationPage: 100,
        isCompleted: true,
      });

    const falseRes = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 1,
        itemsCountPerPaginationPage: 100,
        isCompleted: false,
      });

    expect(allRes.status).toBe(200);
    expect(trueRes.status).toBe(200);
    expect(falseRes.status).toBe(200);
    expect(Array.isArray(allRes.body.todos)).toBe(true);

    expect(
      allRes.body.todos.length)
      .toBe(trueRes.body.todos.length + falseRes.body.todos.length);
  });

  it("Should paginate correctly", async () => {
    const res1 = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 1,
        itemsCountPerPaginationPage: 10,
      });

    const res2 = await request(app)
      .get("/todos")
      .query({
        paginationPageNumber: 2,
        itemsCountPerPaginationPage: 10,
      });

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res1.body.todos.length).toBeLessThanOrEqual(10);
    expect(res2.body.todos.length).toBeLessThanOrEqual(10);
    expect(res1.body.todos).not.toEqual(res2.body.todos);
  })
});

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
