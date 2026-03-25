const { verifyToken } = require('../config/jwt');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Aucun jeton fourni. Accès refusé.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Le jeton est invalide ou a expiré.',
    });
  }
};

module.exports = auth;
