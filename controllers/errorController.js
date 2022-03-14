module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.code = err.code || null;
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
};
