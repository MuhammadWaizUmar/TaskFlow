// Express 4 does NOT catch errors thrown inside async route handlers.
// This wrapper catches them and forwards to next(err), so our central
// error handler (middleware/errorHandler.js) deals with them.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;