import {
  body,
  param
} from "express-validator";
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
      title,
    };
    return res.status(200).json({ todo: createTodo });
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
