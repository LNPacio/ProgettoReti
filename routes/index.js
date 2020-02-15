var express = require('express');
var router = express.Router();
var session = require('express-session');
var url = require('url');

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
	var params=url.parse(req.url).query.split('&');
	var name = params[0].split("=")[1];
	var surname = params[1].split("=")[1];
	var email = params[2].split("=")[1];
	console.log("Parametri: "+name+surname+email);
	res.render('registrazione', {name: req.body.name, surname: req.body.surname, email: req.body.email});
});

module.exports = router;
