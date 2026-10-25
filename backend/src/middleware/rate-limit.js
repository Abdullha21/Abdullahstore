const ipRequests = new Map();

export function rateLimiter(windowMs = 60000, maxRequests = 60) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || "global";
    const now = Date.now();
    const entry = ipRequests.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + windowMs;
    } else {
      entry.count++;
    }

    ipRequests.set(ip, entry);

    if (entry.count > maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please slow down." });
    }

    next();
  };
}
