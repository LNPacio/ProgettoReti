var express = require('express');
var router = express.Router();
var app = express();
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
  res.render('registrazione', {name:"", surname:"", email:""});
});

router.get('/signupG', function(req, res, next) {
  res.send("Ciao");
  next();
}, function (req, res) {
   app.render('registrazione', {name: req.body.name, surname: req.body.surname, email: req.body.email});
});

module.exports = router;
