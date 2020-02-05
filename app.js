var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



var $ = require("jquery"),
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

$.support.cors = true;
$.ajaxSettings.xhr = function() {
return new XMLHttpRequest();
};



//DB connessione/////////////////////
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();


//cookie//////////////////////////////
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var sess;
///////////////////////////////////////////////
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users',express.static(path.join(__dirname, 'public')));
app.use('/dist/js',express.static(path.join(__dirname, 'public/javascripts')));

//Registrazione //impementare controllo email già esistente
app.post('/signup', function(req,res){
	
	var name = req.body.name;
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;
    var surname = req.body.surname;
    
    client.query('SELECT email from utente where email = $1', [email], (err, response) => {
		if (err) throw err;
		
		console.log(response);
		if(response.rows.length > 0){
			res.send('<html><body>Utente gia registrato</body></html>');
		}
		
		else{
    
	client.query('INSERT INTO utente(email, name, surname, password) VALUES($1,$2,$3,$4)', [email, name, surname, password], (err, res) => {
		if (err) throw err;
		
	});
	res.redirect('/signin');
		}
	});
	
});

//Login
app.post('/signin', function(req,res){
	
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;
    
	client.query('SELECT password, name, surname from utente where email = $1', [email], (err, response) => {
		if (err) throw err;
		
		
		//controllo presenza utenre
		if(response.rows.length <= 0){
			res.send('<html><body>Utente non registrato</body></html>');
		}
		else{
			if(response.rows[0].password == password){
				sess= req.session;
				sess.email = email;
				sess.name = response.rows[0].name;
				sess.surname = response.rows[0].surname;
				res.redirect('/users/home');
			}
			else{
				res.send('<html><body>Password errata</body></html>');
			}
		}
		
	});
	//res.redirect('/signin');
	
});

app.post('/test', function(req,res){
	res.send('<html><body>Hai premuto il pulsante aggiungi città</body></html>');
});

	

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
