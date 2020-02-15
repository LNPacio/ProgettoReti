var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/signin');
});

router.get('/signin', function(req, res, next) {
	if (req.session.email){
		res.redirect('/users/home');
	}
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('registrazione');
});

router.get('/signupG', function(req, res, next) {
  res.render('registrazione', {name: req.session.name, surname: req.session.surname, email: req.session.email});
});

module.exports = router;
