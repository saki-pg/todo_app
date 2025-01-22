import express from "express";
import type {
  Express,
  Request,
  Response
} from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app: Express = express();
const PORT = 8080;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE"] }));


app.get("/allTodos", async (req: Request, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      include: {
        category: true,
      },
    });

    res.json(todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      isCompleted: todo.isCompleted,
      category: { id: todo.categoryId, name: todo.category.name }
    })));

  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch todos" })
  }
});

app.post("/createTodo", async (req: Request, res: Response) => {
  console.log(req.body);

  try {
    const {
      title,
      isCompleted,
      categoryId
    } = req.body;

    const createTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted,
        category: {
          connect: {
            id: categoryId,
          }
        }
      }
    });
    return res.json(createTodo);
  } catch(e) {
    return res.status(400).json(e);
  }
});

app.put("/editTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, isCompleted } = req.body;
    const editTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        isCompleted,
      },
    });
    return res.json(editTodo);
  } catch(e) {
    return res.status(400).json(e);
  }
});

app.delete("/deleteTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleteTodo = await prisma.todo.delete({
      where: { id },
    });
    return res.json(deleteTodo);
  } catch(e) {
    return res.status(400).json(e);
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}🚀`));
