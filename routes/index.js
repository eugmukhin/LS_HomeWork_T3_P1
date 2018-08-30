const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
};

router.get('/', controllers.index);
router.get('/admin', isAdmin, controllers.admin);
router.get('/login', controllers.login);

router.post('/', controllers.sendMessage);
router.post('/admin/upload', isAdmin, controllers.productAdd);
router.post('/admin/skills', isAdmin, controllers.skillAdd);
router.post('/login', controllers.auth);

module.exports = router;
