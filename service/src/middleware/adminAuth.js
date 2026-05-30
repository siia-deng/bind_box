export function adminAuth(req, res, next) {
  const expectedToken = process.env.ADMIN_API_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({ message: "ADMIN_API_TOKEN is not configured" });
  }

  const header = req.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.get("x-admin-token");

  if (token !== expectedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
}
