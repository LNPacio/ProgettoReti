


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

/*var map;
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
 
  }*/

  var cityNameSelect ='';
  var name_city_cap = '';

  function clientOpenWeather(){
    var valueToReturn = null;
    var cityName = document.getElementById("address").value;
    var data = document.getElementById("data").value;
    var path = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&APPID=2f75a108e91deb708a808543db5dc6df';
    
    var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", path, false ); // false for synchronous request
      xmlHttp.send( null );
      var responseObject = JSON.parse(xmlHttp.responseText);
      if (responseObject.cod == "404"){
        alert("Error: " +responseObject.cod + " Message: " +responseObject.message);
      }
      if (responseObject.cod == "400"){
        alert("Error: " +responseObject.cod + " Message: " + responseObject.message);
      }
      document.getElementById("infocitta").innerHTML = "City: " + responseObject.city.name + " (" + responseObject.city.country + ")"; 
      cityNameSelect = responseObject.city.name;
      name_city_cap = responseObject.city.name + ','+responseObject.city.country;
      alert(name_city_cap);
      var returnObject = {};
      var list = responseObject.list;
      for (var item of list){
        var currentDate = item.dt_txt;
        if (currentDate.indexOf(data) != -1){
          returnObject[currentDate] = item;
        }
      }
      fillTable(returnObject);
  }
  
function fillTable(returnObject){
  clearTable();
  for (var date of Object.keys(returnObject)){
    var infoWeather = returnObject[date];
    var hour = date.split(" ")[1];
    document.getElementById("weather"+hour).innerHTML = infoWeather.weather[0].main;
    document.getElementById("temp"+hour).innerHTML = (infoWeather.main.temp -273,15) + " °C";
    document.getElementById("t_max"+hour).innerHTML = (infoWeather.main.temp_max -273,15) + " °C";
    document.getElementById("t_min"+hour).innerHTML = (infoWeather.main.temp_min -273,15) + " °C"; 
    document.getElementById("humidity"+hour).innerHTML = infoWeather.main.humidity + " %";
    document.getElementById("wind"+hour).innerHTML = infoWeather.wind.speed + " m/s";
  }
}

function clearTable(){
  var array = ["00:00:00","03:00:00","06:00:00","09:00:00","12:00:00","15:00:00","18:00:00","21:00:00"];
  for (var hour of array){
    document.getElementById("weather"+hour).innerHTML = null;
    document.getElementById("temp"+hour).innerHTML = null;
    document.getElementById("t_max"+hour).innerHTML = null;
    document.getElementById("t_min"+hour).innerHTML = null; 
    document.getElementById("humidity"+hour).innerHTML = null;
    document.getElementById("wind"+hour).innerHTML = null;
  }
}


$(document).ready(function(){
	
	//funzione per aggiungere città
	$("#aggiungi_città").click(function(){
		var request = $.post("/add_city", {città: cityNameSelect}, function(data, status){});
		request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else alert(msg);
        });
	});
	
	//funzione per aggiungere città
	$("#rimuovi_città").click(function(){
		var request = $.post("/remove_city", {città: cityNameSelect}, function(data, status){});
		request.done(function(msg) {
        if(msg.errore) alert("Errore");
        else alert(msg);
        });
	});
});





/**
 * Calculates and displays the address details of 200 S Mathilda Ave, Sunnyvale, CA
 * based on a free-form text
 *
 *
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */

function geocode(platform) {
  
  var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
      searchText: name_city_cap,
      jsonattributes : 1
    };

  geocoder.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}
/**
 * This function will be called once the Geocoder REST API provides a response
 * @param  {Object} result          A JSONP object representing the  location(s) found.
 *
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
function onSuccess(result) {
  var locations = result.response.view[0].result;
 /*
  * The styling of the geocoding response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addLocationsToMap(locations);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over California
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:37.376, lng:-122.034},
  zoom: 12,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
//window.addEventListener('resize', () => map.getViewPort().resize());

//var locationsContainer = document.getElementById('panel');

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

/**
 * Creates a series of H.map.Markers for each location found, and adds it to the map.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToMap(locations){
  var group = new  H.map.Group(),
    position,
    i;

  // Add a marker for each location found
  for (i = 0;  i < locations.length; i += 1) {
    position = {
      lat: locations[i].location.displayPosition.latitude,
      lng: locations[i].location.displayPosition.longitude
    };
    marker = new H.map.Marker(position);
    marker.label = locations[i].location.address.label;
    group.addObject(marker);
  }

  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getGeometry());
    openBubble(
       evt.target.getGeometry(), evt.target.label);
  }, false);

  // Add the locations group to the map
  map.addObject(group);
  map.setCenter(group.getBoundingBox().getCenter());
}

// Now use the map as required...
geocode(platform);



