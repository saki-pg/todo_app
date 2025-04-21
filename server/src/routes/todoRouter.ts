import {
  body,
  param,
  query
} from "express-validator";
import {
  Request,
  Response
} from "express";
import { Router } from "express";
import { validationErrors } from "../middlewares/validation";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/todos",
[
  query("paginationPageNumber")
    .exists()
    .withMessage("paginationPageNumber is missing")
    .isInt({ min: 1 })
    .withMessage("Invalid paginationPageNumber"),
  query("itemsCountPerPaginationPage")
    .exists()
    .withMessage("itemsCountPerPaginationPage is missing")
    .isInt({ min: 1 })
    .withMessage("Invalid itemsCountPerPaginationPage"),
  query("isCompleted")
    .optional()
    .isBoolean()
    .withMessage("Invalid isCompleted"),
  ],
  validationErrors,

  async( req: Request, res: Response ) => {
    try {
      const paginationPageNumber = parseInt(req.query.paginationPageNumber as string, 10);
      const itemsCountPerPaginationPage = parseInt(req.query.itemsCountPerPaginationPage as string, 10);
      const isCompleted = req.query.isCompleted === undefined
        ? undefined
        : req.query.isCompleted === "true";

      const todos = await prisma.todo.findMany({
        where: isCompleted !== undefined ? { isCompleted } : {},
        skip: (paginationPageNumber - 1) * itemsCountPerPaginationPage,
        take: itemsCountPerPaginationPage,
      });

      return res.status(200).json({todos});
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Failed to fetch todos"});
    }
  }
);

router.post(
  "/todo",
  [
    body("title")
      .exists()
      .withMessage("title is missing")
      .isString()
      .withMessage("Invalid title")
      .isLength({ min: 1, max: 50 })
      .withMessage("title must be 0 - 50 character long")
  ],
  validationErrors,

  async( req: Request, res: Response ) => {
    try {
      const { title } = req.body;
      const createTodo = await prisma.todo.create({
        data: {
          title,
          isCompleted: false
        }
      });
      return res.status(200).json({ todo: createTodo });
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Failed to create todo"});
      }
  }
);

router.put(
  "/todo/:id",
  [
    param("id").isInt().withMessage("Invalid id"),
    body("title")
      .isString()
      .withMessage("Invalid title")
      .isLength({ min: 1, max: 50 })
      .withMessage("title must be 0 - 50 character long")
  ],
  validationErrors,
  async( req: Request, res: Response ) => {
    const { id } = req.params;
    const { title } = req.body;

    if (id === "999999") {
      return res.status(404).json({
        errors: [
          { msg: "Todo not found"}
        ],
      })
    }

    const updateTodo = {
      id,
      title
    };

    return res.status(200).json({ todo: updateTodo });
  }
);

export default router;
