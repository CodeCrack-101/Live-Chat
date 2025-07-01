import jwt from 'jsonwebtoken';
export const generatetoken = (id) => jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
