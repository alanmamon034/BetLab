import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function signSession(user) {
  return jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin }, SECRET, {
    expiresIn: '2h',
  });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromReq(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/betlab_session=([^;]+)/);
  return match ? match[1] : null;
}
