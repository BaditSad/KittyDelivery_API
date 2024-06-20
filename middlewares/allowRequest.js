const allowRequest = (req, res, next) => {
  try {
    if (
      req.originalUrl.startsWith("/api-docs/") ||
      req.headers.referer.includes("/api-docs") ||
      req.headers.origin.startsWith(process.env.ALLOWED_ORIGIN)
    ) {
      next();
    }
  } catch (err) {
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = allowRequest;
