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
