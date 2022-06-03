module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.code = err.code || null;

  //JWT
  //prettier-ignore
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") { 
    console.log("TokenExpiredError || JsonWebTokenError" );


    if (req.headers.referer.split("/")[3] === "all-products") {
      return res
        .status(404)
        .json({ status: "failed", data: "Please log in to like a product!" });
    }
    return res.redirect("/unauthorize-access");
  }

  if (err.name === "EMPTY_COOKIE_ERROR") {
    console.log("EMPTY_COOKIE_ERROR");

    if (req.headers.referer.split("/")[3] === "product-detail") {
      return res
        .status(404)
        .json({ status: "failed", data: "Please log in to add a review" });
    }

    if (req.headers.referer.split("/")[3] === "all-products") {
      return res
        .status(404)
        .json({ status: "failed", data: "Please log in to like a product!" });
    }

    return res.redirect("/unauthorize-access");
  }

  if (err.name === "USER_UNDEFINED") {
    console.log(err.name);
    return res.redirect("/login");
  }

  if (err.name === "USER_ALREADY_LOGGED_IN") {
    console.log(err.name);
    return res.redirect("/");
  }

  if (err.name === "SIGNUP_ERROR") {
    console.log(err.name);
    return res.status(403).json({ status: "error", message: err.message });
  }

  if (err.name === "CastError") {
    console.log(err.name);
    const referer = req.headers.referer.split("/")[3];

    // this is for liking an unknown product (hacker could change the dataset in the browser)
    if (referer === "all-products" || "product-detail") {
      return res
        .status(301)
        .json({ status: "failed", data: "Unable to find the document" });
    }

    return res.redirect("/404");
  }

  if (err.name === "FILE_UPLOAD_ERROR") {
    console.log(err.name);
    return res.status(400).json({ status: "failed", message: err.message });
  }

  res.status(err.statusCode).json({
    status: err.status,
    statusCode: err.statusCode,
    code: err.code,
    message: err.message,
  });
};
