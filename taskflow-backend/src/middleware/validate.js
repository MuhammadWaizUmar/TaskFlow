import { validationResult } from "express-validator";

// Put this after a list of express-validator rules in a route.
// If any rule failed, respond 400 with the messages; otherwise continue.
export default function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  res.status(400);
  next(new Error(errors.array().map((e) => e.msg).join(", ")));
}