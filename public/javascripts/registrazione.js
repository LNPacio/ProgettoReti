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

