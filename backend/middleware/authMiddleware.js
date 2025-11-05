import jwt from "jsonwebtoken";

/**
 * Auth Middleware
 * Validates JWT,attaches decoded user to req.user.Provides detailed error logs for debugging.
 */
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  //Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("🚫 No or malformed token header:", authHeader);
    return res
      .status(401)
      .json({ success: false, message: "Authentication token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    //Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id || !decoded?.role) {
      console.error("⚠️ JWT decoded but missing essential fields:", decoded);
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload." });
    }

    // Attach user object to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    //Debug log for visibility
    console.log("✅ Authenticated user:", req.user);

    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired authentication token." });
  }
}

/*Admin-only route guard.*/
export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    console.warn("🚫 Unauthorized access attempt. Role:", req.user?.role);
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only." });
  }
  next();
}
