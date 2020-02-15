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
  res.render('registrazione', {name:"", surname:"", email:""});
});
const url = require('url'); 
router.get('/signupG', function(req, res, next) {
  //res.send("Ciao");
   res.redirect(url.format({
       pathname:"/signupG",
       query: {
          "name": req.body.name,
          "surname": req.body.surname,
          "email": req.body.email
     }));
});

module.exports = router;
