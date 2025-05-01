const User = require('../models/user-model');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id); // Assumes req.user.id is set by auth middleware

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Admin Access Denied' });
    }

    next(); // User is admin, proceed to the next middleware or route
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
