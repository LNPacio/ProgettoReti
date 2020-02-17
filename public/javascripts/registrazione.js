function corretta(){
    if (controllaPassword() == false){
        return false;
    }
    return true;
}

function controllaPassword(){
    if (document.form_registrazione.inputPassword.value != 
        document.form_registrazione.controllaPassword.value){
           alert("Errore: password inserite diverse");
           return false;
        }
        return true;
}
var name;
var email;
var password;
var surname;

$(document).ready(function(){
	
	//funzione per aggiungere città
	$("#registrationButton").click(function(){
        name = document.form_registrazione.name;
        alert(name);
        surname = document.form_registrazione.surname;
        email = document.form_registrazione.email;
        password = document.form_registrazione.password;
		var request = $.post("/signup", {name: name, surname : surname, email : email, password : password }, function(data, status){});
		request.done(function(msg) {
            if(msg.errore) alert("Errore");
            else alert(msg);
            });
	    });
    });