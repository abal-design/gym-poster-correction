const xss = require('xss');

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value.trim());
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = sanitizeValue(value[key]);
      return acc;
    }, {});
  }

  return value;
};

const sanitizeObject = (target, source) => {
  Object.keys(target).forEach((key) => {
    delete target[key];
  });

  Object.entries(source).forEach(([key, value]) => {
    target[key] = value;
  });
};

const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') sanitizeObject(req.body, sanitizeValue(req.body));
  if (req.query && typeof req.query === 'object') sanitizeObject(req.query, sanitizeValue(req.query));
  if (req.params && typeof req.params === 'object') sanitizeObject(req.params, sanitizeValue(req.params));
  next();
};

module.exports = sanitizeInput;
