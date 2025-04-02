import { body } from "express-validator";
import {
  Request,
  Response
} from "express";
import { Router } from "express";
import { validationErrors } from "../middlewares/validation";

const router = Router();

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
    const { title } = req.body;
    const createTodo = {
      id: 1,
      title: req.body.title,
    };
    return res.status(200).json({ todo: createTodo });
  }
);

router.put(
  "/todo/:id",
  [
    body("title")
      .optional()
      .isString()
      .withMessage("Invalid title"),
  ],
  validationErrors,
  async( req: Request, res: Response ) => {
    const { id } = req.params;
    const { title } = req.body;
    const updateTodo = { id, title };
    const createTodo = {
      id,
      title,
    };
    return res.status(200).json({ todo: updateTodo });
  }
);


export default router;
