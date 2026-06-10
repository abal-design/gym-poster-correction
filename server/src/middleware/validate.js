const AppError = require('../utils/AppError');

const assignObject = (target, source) => {
  Object.keys(target).forEach((key) => {
    delete target[key];
  });

  Object.entries(source).forEach(([key, value]) => {
    target[key] = value;
  });
};

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const issues = result.error.issues.map((issue) => issue.message).join(', ');
    return next(new AppError(`Validation failed: ${issues}`, 400));
  }

  req.body = result.data.body;
  req.params = result.data.params;
  if (req.query && typeof req.query === 'object') {
    assignObject(req.query, result.data.query);
  }
  return next();
};

module.exports = validate;
