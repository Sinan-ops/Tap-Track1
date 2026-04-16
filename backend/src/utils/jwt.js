import jwt from 'jsonwebtoken';

const generateToken = (userId, email, role) => {
  const token = jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || 'tap-track-secret-key',
    { expiresIn: '24h' }
  );
  return token;
};

export default generateToken;
