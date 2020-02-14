var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//DB connessione/////////////////////
const { Client } = require('pg');
 
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();



/*var http = require('http').Server(app);
var io = require('socket.io').listen(http);*/

//cookie//////////////////////////////
var sessionMiddleware = session({
    key: 'user_sid',
    secret: 'ssshhhhh'
});
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

var http = require('http');
var server = http.createServer(app);


var io = require('socket.io')(server);

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);


/*************************************************************************************** 
 * WEB SOCKET                                                                          *
 ***************************************************************************************/

io.on('connection', function(socket){
	 var email = socket.request.session.email;
	 console.log("connesso");
	 socket.emit('message', {mitt:"Server", dest:email, txt:"Ciao "+email});
	 console.log("Emesso");
	 socket.join(email);
	  
	 socket.on('mess', function(data) {
		//console.log("[Server] ricevuto messaggio: "+ message);
		
		
		var mittente = socket.request.session.email;
		if(data.dest == "all"){ 
			socket.broadcast.emit('message', {mitt:mittente, dest:data.dest, txt:data.txt});
			console.log("[Server] inviato messaggio a: "+ data.dest);
		}
		else{
			socket.broadcast.to(data.dest).emit('message', {mitt:mittente, dest:data.dest, txt:data.txt});
			console.log("[Server] messaggio emesso: "+ mittente);
		}
		});   
});
 



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
				//sess= req.session;
				req.session.email = email;
				req.session.name = response.rows[0].name;
				req.session.surname = response.rows[0].surname;
				res.redirect('/users/home');
			}
			else{
				res.send('<html><body>Password errata</body></html>');
			}
		}
		
	});
	//res.redirect('/signin');
	
});

//inserimento città in profilo
app.post('/add_city', function(req,res){
	var città = req.body.città;	
	var email = req.session.email;
	
	if (città == '') res.send("Inserisci una città prima!");
	
	else{
	
	client.query('SELECT città from luoghi where email = $1 and città = $2', [email, città], (err, response) => {
		if (err) throw err;
		
		//controllo presenza città
		if(response.rows.length <= 0){
			client.query('INSERT INTO luoghi(città, email) VALUES($1,$2)', [città, email], (err, res) => {
				if (err) throw err;		
			});
			res.send(città+" inserita!");
		}
		else
			res.send("La città "+città+" è già presente!");
	});
	}
});

//eliminazione città in profilo
app.post('/remove_city', function(req,res){
	var città = req.body.città;	
	var email = req.session.email;
	
	client.query('SELECT città from luoghi where email = $1 and città = $2', [email, città], (err, response) => {
		if (err) throw err;
		
		//controllo presenza città
		if(response.rows.length > 0){
			client.query('DELETE from luoghi where email = $1 and città = $2', [email, città,], (err, res) => {
				if (err) throw err;		
			});
			res.send("La "+città+" è stata eliminata!");
		}
		else
			res.send("La città "+città+" non ancora inserita!");
	});
});


//popolazione lista città in profilo
app.get('/showUsersCities', function(req, res, next) {
		var email = req.session.email;
		
		client.query('SELECT città from luoghi where email = $1', [email], (err, response) => {
		if (err) throw err;
		
		res.send(response.rows);
		});
		
});


//popolazione barra ricerca utenti
app.get('/getListaUtenti', function(req, res, next) {
		var email = req.session.email;
		
		client.query('SELECT name, surname, email from utente where email != $1', [email], (err, response) => {
		if (err) throw err;
		
		res.send(response.rows);
		});
		
});

//invio richiesta di amicizia
app.post('/invioRichiesta', function(req,res){
	console.log("Dbug");
	var email = req.session.email;
	var destinatario = req.body.destinatario;
	var id = email+destinatario;
	
			
	client.query('SELECT utente1, utente2 from chat where (utente1 = $1 and utente2 = $2) or (utente1 = $2 and utente2 = $1)', [email, destinatario], (err, risp) => {
		if (err) throw err;
		
		if(risp.rows.length > 0){
			console.log("Amicizia già presentetra"+email+" e "+destinatario);
			res.send("Amicizia gà presente");
		}
		
	else{
	
	client.query('INSERT INTO chat(id, stato, utente1, utente2) VALUES($1,$2,$3,$4)', [id, "richiesta", email, destinatario], (err, res) => {
	if (err) throw err;
	
	console.log("Richieta inviata da "+email+" a "+destinatario);
	
	});
	res.send("Richiesta inviata");
	}
	}); 
});

//caricamento lista richieste di amicizia
app.get('/getRichieste', function(req,res){
	var email = req.session.email;
	
	client.query('SELECT id, utente1 from chat where utente2 = $1 and stato = $2', [email, "richiesta"], (err, response) => {
		if (err) throw err;
		console.log(response.rows);
		res.send(response.rows);
	});
});

app.get('/getAmici', function(req,res){
	var email = req.session.email;
	var risposta;
	
	client.query('SELECT id, utente1 from chat where utente2 = $1 and stato = $2', [email, "accettata"], (err, response) => {
		if (err) throw err;
		console.log(response.rows);
		res.send(response.rows);
	});	
});

app.post('/accettaAmicizia', function(req,res){
	var idChat = req.body.idChat;
	
	client.query('UPDATE chat set stato =$1 where id = $2', ["accettata", idChat], (err, response) => {
		if (err) throw err;
		
		res.send("Ora sono amici"+idChat);
	});
	
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


module.exports.app = app;
module.exports.server = server;
