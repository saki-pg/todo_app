import {
  NextFunction,
  Request,
  Response,
} from "express";
import { validationResult } from "express-validator";

export const validationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json( {errors: errors.array()} );
  }
  next()
};
