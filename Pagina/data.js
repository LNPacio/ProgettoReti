function updateDate(){
    data = new Date();
ora =data.getHours();
minuti=data.getMinutes();
secondi=data.getSeconds();
giorno = data.getDay();
mese = data.getMonth();
date= data.getDate();
year= data.getFullYear();

if(minuti < 10) minuti="0"+minuti;
if(secondi < 10) secondi="0"+secondi;
if(ora <10) ora="0"+ora;

if(giorno == 0) giorno = "Domenica";
if(giorno == 1) giorno = "Lunedì";
if(giorno == 2) giorno = "Martedì";
if(giorno == 3) giorno = "Mercoledì";
if(giorno == 4) giorno = "Giovedì";
if(giorno == 5) giorno = "Venerdì";
if(giorno == 6) giorno = "Sabato";

if(mese == 0) mese = "Gennaio";
if(mese == 1) mese = "Febbraio";
if(mese == 2) mese = "Marzo";
if(mese == 3) mese = "Aprile";
if(mese == 4) mese = "Maggio";
if(mese == 5) mese = "Giugno";
if(mese == 6) mese = "Luglio";
if(mese == 7) mese = "Agosto";
if(mese == 8) mese = "Settembre";
if(mese == 9) mese = "Ottobre";
if(mese == 10) mese = "Novembre";
if(mese == 11) mese = "Dicembre";

var ref=document.getElementById('clock');
ref.innerHTML=giorno+ " " + date + " " + mese + " " + year + " " + ora+":"+minuti+":"+secondi;
window.setTimeout("updateDate()",1000);

    }