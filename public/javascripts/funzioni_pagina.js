


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

var map;
var geocoder;

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42, lng: 13},
    zoom: 5 
    });
}

function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
 
  }



  function clientOpenWeather(){
    var valueToReturn = null;
    var cityName = document.getElementById("address").value;
    var data = document.getElementById("data").value;
    var path = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&APPID=2f75a108e91deb708a808543db5dc6df';
    
    var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", path, false ); // false for synchronous request
      xmlHttp.send( null );
      var responseObject = JSON.parse(xmlHttp.responseText);
  
      var returnObject = {};
      var list = responseObject.list;
      for (var item of list){
        var currentDate = item.dt_txt;
        if (currentDate.indexOf(data) != -1){
          returnObject[currentDate] = item.main;
         
          document.getElementById("w0").innerHTML = item.main.humidity;
        }
      }
  
      //alert(responseObject.city.name);
      
  }
  