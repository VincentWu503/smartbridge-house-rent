const jwt = require('jsonwebtoken');
const userSchema = require('../models/UserSchema');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .send({ message: 'No token found in cookies', success: false });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .send({ message: 'Token is not valid', success: false });
      } else {
        req.body = req.body || {};
        req.body.userId = decode.id;
        req.authenticatedUserId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error', success: false });
  }
};

const optionalAuthMiddleware = (req, res, next) => {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.authenticatedUserId = decoded.id;
    return next();
  } catch (error) {
    return res
      .status(401)
      .send({ message: 'Token is not valid', success: false });
  }
};

const ownerMiddleware = async (req, res, next) => {
  try {
    if (!req.authenticatedUserId) {
      return res
        .status(401)
        .send({ success: false, message: 'Authentication required' });
    }

    const user = await userSchema.findById(req.authenticatedUserId);
    const role = String(user.type || '')
      .trim()
      .toLowerCase();
    if (!user || role !== 'owner' || role !== 'admin') {
      return res
        .status(403)
        .send({ success: false, message: 'Admin access required' });
    }

    return next();
  } catch (error) {
    console.error('Error checking admin access:', error);
    return res
      .status(500)
      .send({ success: false, message: 'Unable to verify admin access' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.authenticatedUserId) {
      return res
        .status(401)
        .send({ success: false, message: 'Authentication required' });
    }

    const user = await userSchema.findById(req.authenticatedUserId);
    if (
      !user ||
      String(user.type || '')
        .trim()
        .toLowerCase() !== 'admin'
    ) {
      return res
        .status(403)
        .send({ success: false, message: 'Admin access required' });
    }

    return next();
  } catch (error) {
    console.error('Error checking admin access:', error);
    return res
      .status(500)
      .send({ success: false, message: 'Unable to verify admin access' });
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  adminMiddleware,
};
