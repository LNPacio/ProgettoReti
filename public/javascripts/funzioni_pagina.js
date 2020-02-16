var cityNameSelect ='';
var name_city_cap = '';

function clientOpenWeather(){
  var valueToReturn = null;
  var cityName = document.getElementById("address").value;
  var data = document.getElementById("data").value;
  if (data != ""){
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
  else{
    alert("Inserire correttamente i dati");
  }
}
  
function fillTable(returnObject){
  clearTable();
  for (var date of Object.keys(returnObject)){
    var infoWeather = returnObject[date];
    var hour = date.split(" ")[1];
    document.getElementById("weather"+hour).innerHTML = infoWeather.weather[0].main;
    document.getElementById("temp"+hour).innerHTML = (parseInt(infoWeather.main.temp) -273) + " °C";
    document.getElementById("t_max"+hour).innerHTML = (parseInt(infoWeather.main.temp_max) -273) + " °C";
    document.getElementById("t_min"+hour).innerHTML = (parseInt(infoWeather.main.temp_min) -273) + " °C"; 
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
 *    FUNZIONI PER GEOLOCALIZZARE CITTÀ
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function geocode(platform) {
  var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
      searchText: ''+name_city_cap,
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
 * 
 */
function onSuccess(result) {
  var locations = result.response.view[0].result;
  addLocationsToMap(locations);
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  //alert('Can\'t reach the remote server');
}

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  apikey: window.apikey  
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over California
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat:41.9109, lng:12.4818},
  zoom: 12,
  pixelRatio: window.devicePixelRatio || 1
});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

/**
 * Creates a series of H.map.Markers for each location found, and adds it to the map.
 * @param {Object[]} locations 
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

function individua(){
  geocode(platform);
}

//FINE FUNZIONI MAPPA