// the asyncHandler is a middleware that wraps the controller functions in a try catch block and passes the error to the next middleware

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
