import { validateUserToken } from '../utils/token.js';

export function autherizationMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];


  // if header missing, reject
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // must start with "Bearer "
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization header must start with Bearer' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = validateUserToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export function ensureAuthenticated(req, res, next) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'You must be logged in to access this resource' });
  }

  next();
}
