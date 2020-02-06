var express = require('express');
var router = express.Router();
var session = require('express-session');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/home', function(req, res, next) {
		if(req.session.email) {
			res.render('home');
		}
		else{
			res.redirect('/signin');
		}
});

router.get('/profile', function(req, res, next) {
		if(req.session.email) {
			res.render('userprofile', {name: req.session.name, surname: req.session.surname});
		}
		else{
			res.redirect('/signin');
		}
});

router.get('/messaggi', function(req, res, next) {
		if(req.session.email) {
			res.render('messaggi', {name: req.session.name, surname: req.session.surname});
		}
		else{
			res.redirect('/signin');
		}
});

router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});


module.exports = router;
