export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found." });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err?.code === "23505") {
    // Postgres unique violation
    return res.status(409).json({ error: "That record already exists." });
  }
  const status = err.status || 500;
  const message = status === 500 ? "Internal server error." : err.message;
  res.status(status).json({ error: message });
}
