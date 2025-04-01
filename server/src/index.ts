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
        todoCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    const result = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      isCompleted: todo.isCompleted,
      categories: (todo.todoCategories ?? [])
        .map((tc: {category: { id: number; name: string } }) => ({
          id: tc.category.id,
          name: tc.category.name,
        }))
        .sort((a,b) => a.id - b.id),
    }));

    res.json(result)
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Failed to fetch todos" })
  }
});

app.post("/createTodo", async (req: Request, res: Response) => {
  try {
    const {
      title,
      isCompleted,
      categoryIds
    } = req.body;

    const createTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted,
      },
    });

    await prisma.todoCategory.createMany({
      data: categoryIds.map((id: number) => ({
        todoId: createTodo.id,
        categoryId: id,
      })),
    });

    const updatedTodo = await prisma.todo.findUnique({
      where: { id: createTodo.id },
      include: {
        todoCategories: {
          include: { category: true },
        },
      },
    });


    return res.json(createTodo);
  } catch(e) {
    console.error(e);
    return res.status(400).json(e);
  }
});

app.put("/editTodo/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      isCompleted,
      categoryIds
    } = req.body;

    await prisma.todoCategory.deleteMany({
      where: { todoId: id },
    })

    const editTodo = await prisma.todo.update({
      where: { id },
      data: {
        title,
        isCompleted,
        todoCategories: {
          create: categoryIds.map((catId: number) => ({
            category: { connect: { id: catId }},
          })),
        },
      },
      include: {
        todoCategories: {
          include: {category: true},
        },
      },
    });

    return res.json(editTodo);
  } catch(e) {
    console.error(e);
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
    console.error(e);
    return res.status(400).json(e);
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}🚀`));
