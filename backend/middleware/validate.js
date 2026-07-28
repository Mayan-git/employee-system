import { ApiError } from "../utils/ApiError.js";

// Usage: validate({ body: zodSchema, query: zodSchema, params: zodSchema })
export const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) req.query = schemas.query.parse(req.query);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    next();
  } catch (err) {
    const message = err.issues?.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    next(new ApiError(400, message || "Invalid request data"));
  }
};
