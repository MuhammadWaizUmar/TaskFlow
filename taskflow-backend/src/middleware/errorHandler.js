// Runs when no route matched the request.
export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not found: ${req.method} ${req.originalUrl}`));
}

// Central error handler. Express recognises it by its 4 arguments.
// Any route can call next(err) (or throw inside async handlers once wrapped)
// and the response shape stays consistent: { message }.
export function errorHandler(err, req, res, next) {
  // err.status lets a controller set a specific code (e.g. 404) even when
  // res.statusCode hasn't been set yet - used by the nested task lookups.
  let status = err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || "Server error";

  // Mongoose: schema validation failed (e.g. missing required field, bad enum value)
  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // Mongoose: malformed ObjectId in a URL param
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB: unique index violated (e.g. duplicate email)
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
  }

  res.status(status).json({
    message,
    // Stack traces are useful locally but must never leak in production.
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}