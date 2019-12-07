var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/signin');
});

router.get('/signin', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('registrazione');
});

module.exports = router;
