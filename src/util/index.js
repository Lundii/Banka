import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function checkReqFields(body, fields) {
  for (let i = 0; i < fields.length; i += 1) {
    if (!body.includes(fields[i])) return i;
  }
  return -1;
}

export function passwordMatch(password, confirmPassword) {
  if (password === confirmPassword) {
    return true;
  }
  return false;
}

export function hashPassword(password) {
  if (!arguments) {
    throw new Error('Password must be define');
  }
  const salt = bcrypt.genSaltSync(6);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

export function comparePassword(password, hash) {
  return (
    bcrypt.compareSync(password, hash)
  );
}

export function generateAccountNumber(type) {
  return 1000345435;
}

export function validateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1] || authorizationHeader;
    const options = {
      expiresIn: '2h',
      issuer: 'monday.lundii',
    };
    const secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';
    jwt.verify(token, secret, options, (er, payload) => {
      if (er) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      if (payload) {
        req.payload = payload;
        next();
      }
    });
  } else {
    next();
  }
}
