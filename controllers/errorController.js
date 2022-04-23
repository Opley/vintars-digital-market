module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.code = err.code || null;

  const error = { ...err };

  if (error.name === "TokenExpiredError") {
    const url = req.url.split("/")[1];
    return res.status(200).render(url, { title: `V-D-M | ${url}` });
  }

  console.log(error);
  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
};
