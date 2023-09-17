require('dotenv').config();

function checkRole(req, res, next) {
  if (res.locals.role === process.env.USER || res.locals.role === process.env.ADMIN || res.locals.role === process.env.SUPERADMIN) {
    next();
  } else {
    return res.sendStatus(403);
  }
}

module.exports = {
  checkRole: checkRole
};

