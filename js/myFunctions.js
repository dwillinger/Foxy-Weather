/* SETTINGS *******************************************/

	// metric or imperial; returns Celsius or Fahrenheit
var units = localStorage.getItem('foxyWeather_units');
console.log("units: " + units );
if ( units == '' || units == undefined || units == null ) { var units = 'metric'; }	// if no unit setting available we set units to metric
var lang = localStorage.getItem('foxyWeather_language');
var background 	= localStorage.getItem('foxyWeather_background');
if ( background == undefined || background == null || background == '' ) { background = 'locationPicture'; }

// Supported languages: English - en, Russian - ru, Italian - it, Spanish - sp, Ukrainian - ua, German - de, Portuguese - pt, Romanian - ro, Polish - pl, Finnish - fi, Dutch - nl, French - fr, Bulgarian - bg, Swedish - se, Chinese Traditional - zh_tw, Chinese Simplified - zh_cn, Turkish - tr 
var panoramioAPI 	= 	'http://www.panoramio.com/map/get_panoramas.php?';	// PANORAMIO is no longer supported but for sake of completeness this setting stays intact
var openWeatherAPI 	= 	'http://api.openweathermap.org/data/2.5/forecast?APPID=';	// ADD YOUR OPENWEATHERMAP.ORG API-KEY HERE!

var locationKEY 	= 'locations';
var storageKey 		= 'foxyWeatherCityToShowJSON';
var cityToShowKey 	= 'foxyWeather_cityToShow';
var latToShowKey 	= 'foxyWeather_latToShow';
var lonToShowKey 	= 'foxyWeather_lonToShow';
var errorKey		= 'foxyWeather_errorMsg';

$(document).ready(function() {

	detectLocation();
	
});

function detectLocation() {

	var searchItem = localStorage.getItem('foxyWeatherSearch');
	console.log("searchItem: " + searchItem);

	var cityName = localStorage.getItem(cityToShowKey);
	console.log ("cityName: " + cityName);
	
	var lat = localStorage.getItem(latToShowKey);
	console.log ("lat: " + lat);
	
	var lon = localStorage.getItem(lonToShowKey);
	console.log ("lon: " + lon);
	
	if ( searchItem != null && searchItem != undefined ) { 	// there is no JSON but a search item --> search for item
		console.log ("ein suchbegriff!");
		requestWeatherByCityName(searchItem);			// we trigger the request by city name
		localStorage.removeItem('foxyWeatherSearch');	// we clear the localStorage
	}
	else if ( searchItem == null && cityName != null ) {	// there is no search but a JSON --> show JSON
		console.log ("kein suchbegriff, aber ein json!");
		
		requestWeatherByLatLon(lat,lon);
		
	}
	
	else {
		// there is no current searchItem and no cityToShowJSON stored --> the user visits the app the first time --> we redirect him to the settings page
		window.location.href = "settings.html";
		return;	
	}
	
}

function saveLocation(cityName,lon,lat) {

	// das JSON wird aus dem localStorage abgeholt
	//storedLocations = localStorage.getItem(locationKEY);
	//console.log ("storedLocations: " + storedLocations);
	//if ( storedLocations == undefined || storedLocations == null || storedLocations == '' ) {console.log ("NIX DA!!!");
	// das JSOn wird in ein Array umgewandelt
	//locations = JSON.parse(storedLocations);
	
	var cityToShowJSON = {
		"cityName":cityName,
		"lat":lat,
		"lon":lon
	};
	
	var cityToShow = cityName;
	//JSON.stringify(cityToShowJSON);
		
	localStorage.setItem(cityToShowKey, cityToShow);		// we store the retreived info to call it when app is loaded again		
	localStorage.setItem(latToShowKey, lat);	// we store the retreived info to call it when app is loaded again		
	localStorage.setItem(lonToShowKey, lon);	// we store the retreived info to call it when app is loaded again
/*	
	var cityName = localStorage.getItem(cityToShowKey);
	var lat = localStorage.getItem(latToShowKey);
	var lon = localStorage.getItem(lonToShowKey);
	console.log ("test - cityName: " + cityName);
	console.log ("testy - lat: " + lat);
	console.log ("testy - lon: " + lon);
*/

	return;	
	
}

function saveJSON (storedLocations) {
	
	var locationJSON = JSON.stringify(storedLocations);
	
	// das JSON wird im localStorage gespeichert
	localStorage.setItem(locationKEY, locationJSON);		
	console.log('length: ' + localStorage.length);

	return;
	
}

var formatTime = function(unixTimestamp) {
	var dt = new Date(unixTimestamp * 1000);
	
	var hours = dt.getHours();
	var minutes = dt.getMinutes();
	var seconds = dt.getSeconds();
	
	var d = dt.getDate();
	var m = dt.getMonth();
	var y = dt.getFullYear();

	// the above dt.get...() functions return a single digit
	// so I prepend the zero here when needed
	if (hours < 10) 
	 hours = '0' + hours;

	if (minutes < 10) 
	 minutes = '0' + minutes;

	if (seconds < 10) 
	 seconds = '0' + seconds;

	return d + "." + m + "." + y + " - " + hours + ":" + minutes + ":" + seconds;
	
}  
     
var hour = function(unixTimestamp) {
	var dt = new Date(unixTimestamp * 1000);
	var hours = dt.getHours();

	return hours;
}

var day = function(unixTimestamp) {
	var dt = new Date(unixTimestamp * 1000);
	
	var weekday=new Array(7);
	weekday[0]="SUN";
	weekday[1]="MON";
	weekday[2]="TUE";
	weekday[3]="WED";
	weekday[4]="THU";
	weekday[5]="FRI";
	weekday[6]="SAT";

	var day = weekday[dt.getDay()]; 
	
	return day;
	
}	


/********************************************************************************************************/


function calculateLatLon (lat,lon) {
	lat 		= parseFloat(lat);
	lon 		= parseFloat(lon);
	panLatMin	= lat - 0.05; 
	panLonMin	= lon - 0.05;
	panLatMax 	= lat + 0.05; 
	panLonmax	= lon + 0.05;

	//console.log (typeof(lat));
	//console.log ( " panLatMin: " + panLatMin );
	//console.log ( " panLatMax: " + panLatMax );
	console.log ( " lon: " + lon );
	console.log ( " lat: " + lat );
}

function createContent () {

	myWeather = '';
	
	myWeather = myWeather + '<div id="location"><h2 class="cityname">' + leJSON.city.name + '</h2></div>';
	//myWeather = myWeather + '<p>temp_max: ' + leJSON.list[0].main.temp_max + '</p>';
	//console.log(leJSON.list[0].main.temp_max);
//	myWeather = myWeather + '<ul>';
	
	//http://openweathermap.org/wiki/API/JSON_API#Daily_forecast
	// see http://bugs.openweathermap.org/projects/api/wiki/Weather_Condition_Codes
	
	myWeather = myWeather + '<div id="currentweather">';
	
	var icon = weatherIcon(leJSON.list[0].weather[0].id);

	myWeather = myWeather + '<div id="mainIcon"><img src="images/weather_icons/' + icon + '" id="fat" /></div>';
	myWeather = myWeather + '<div id="description"><div id="temp">' + Math.round ( leJSON.list[0].main.temp ) + '°</div>';
	myWeather = myWeather + leJSON.list[0].weather[0].description +'</div>';

	//myWeather = myWeather + '<div id="additionals">'
	//myWeather = myWeather + 'Humidity: ' + leJSON.list[0].main.humidity + '<br />';
	//myWeather = myWeather + 'pressure: ' + leJSON.list[0].main.pressure + '<br />';			
	//myWeather = myWeather + 'wind.speed: ' + leJSON.list[0].wind.speed +'<br/>';
	
	var windDesc	= windSpeed ( leJSON.list[0].wind.speed );
	console.log("windDesc: " + windDesc);
	
	var windDir 	= windDirection ( leJSON.list[0].wind.deg  );
	console.log("windDir: " + windDir);
	//windDir = leJSON.list[0].wind.deg;

	myWeather = myWeather + '<span data-i18n="info.' + windDesc + '"></span> ';
	if ( leJSON.list[0].wind.speed >= 1 ) {
		myWeather = myWeather + '<span data-i18n="info.' + windDir + '"></span>';
	}
	
	//myWeather = myWeather + '</div>';
	var n = 1;
	
	myWeather = myWeather + '<div id="forecasts">';
	
	$.each(leJSON.list, function (index, value) {
		
		if ( n > 4 ) { return true; }	// we only want the current day plus three/four (depending on time when user calls the list because if the current weather is past 14:00/15:00 Uhr it shows the next days) days in the future
		
		var date = formatTime(value.dt);
		var thisDay = day(value.dt);
		var thisHour = hour(value.dt);
		//	these are the results - we bypass most of them...
	/*	if (thisHour == 2 || thisHour == 3)  { return true; }
		if (thisHour == 17 || thisHour == 18)  { return true; }
		if (thisHour == 20 || thisHour == 21)  { return true; }*/
		
		if (thisHour != 13 && thisHour != 14 && thisHour != 15)  { return true; }
		
		myWeather = myWeather + '<div class="singleforecast">';
						
		myWeather = myWeather + '<div class="day" data-i18n="info.' + thisDay + '">' + thisDay + '</div>';
		
	//	myWeather = myWeather + 'Datum: ' + date + ' - value.dt: ' + value.dt;
		//console.log( 'Datum: ' + date + ' - value.dt: ' + value.dt );
		//console.log( 'hour: ' + thisHour );
		//console.log( 'id: '+ value.weather[0].id);
		//myWeather = myWeather + ' (index: ' + index + ') <br />';
		//myWeather = myWeather + 'temp_max: '+ value.main.temp_max +'°<br/>';
		//myWeather = myWeather + 'Beschreibung: '+ value.weather[0].description +'<br/>';
		//myWeather = myWeather + 'id: '+ value.weather[0].id +'<br/>';

		var weatherCondition = value.weather[0].id;
		
		var icon = weatherIcon(weatherCondition);
		
		myWeather = myWeather + '<img src="images/weather_icons/' + icon + '" class="weathericon" /><br/>';

		myWeather = myWeather + Math.round (value.main.temp_max) +'°<br/>';				
		
		myWeather = myWeather + '</div>';
		//console.log (value);
		
		n++;
						
	});
	
	myWeather = myWeather + '</div>';
	myWeather = myWeather + '</div>';
	
	$('#content').html(myWeather);	

	if ( lang == 'de' ) 		{ var lng = 'de'; }
	else if ( lang == 'fr' ) 	{ var lng = 'fr'; }
	else if ( lang == 'pt' ) 	{ var lng = 'pt'; }
	else if ( lang == 'sp' ) 	{ var lng = 'es'; }
	else if ( lang == 'fi' ) 	{ var lng = 'fi'; }
	else if ( lang == 'pl' ) 	{ var lng = 'pl'; }
	else if ( lang == 'zh_tw' ) { var lng = 'zh_tw'; }
	else if ( lang == 'zh_cn' ) { var lng = 'zh_cn'; }
	else if ( lang == 'it' ) 	{ var lng = 'it'; }
	else if ( lang == 'hi' ) 	{ var lng = 'hi'; }
	else if ( lang == 'hu' ) 	{ var lng = 'hu'; }	
	else if ( lang == 'el' ) 	{ var lng = 'el'; }	
	else 						{ var lng = 'en-US'; }
	
	i18n.init({ lng: lng }, function(t) { $("body").i18n(); });		

}

function requestWeatherByCityName(cityName) {
	
	$.ajax({   
		url: openWeatherAPI,
		type: 'POST',
		dataType: 'jsonp',
		crossDomain: true,
		data: {
			q:cityName, 
			units:units,
			lang:lang
		},
		async: false,   	// wir setzen async auf "false", da erst weitergemacht werden soll, wenn das JSON vollständig geladen ist
		success: function(returnedData) {     		
			// wir speichern das abgeholte JSON in der Variable leJSON ab.
			leJSON = returnedData;
			console.log('leJSON:');
			console.log(leJSON);
			
			console.log('leJSON.cod: ' + leJSON.cod );
			
			if ( leJSON.cod == 404 ) {
				console.log ("FEHLER: openweather-API 404");
				localStorage.setItem(errorKey, '1');
				window.location.href = "settings.html";
			}
			else {
				var cityName = leJSON.city.name;
				createContent ();
				
				var lat = leJSON.city.coord.lat;
				var lon = leJSON.city.coord.lon;
				//console.log("lat: " + lat);
				
				saveLocation(cityName,lon,lat);	// we save the JSON data in the localstorage

				calculateLatLon (lat,lon);		// latidute and longitude are calculated for setBackground();

				setBackground ();				// we get pictures from Panaramio
				
				$('.loader').css('display','none');	// loader animation is removed
				
			}
			
		},
		error: function(x, status, error) {
			console.log("--- Es ist ein Fehler in der Verbindung zum Server oder beim Laden des JSON aufgetreten!");
			if (x.status == 404) {
                console.log("404 - JSON Adresse nicht erreichbar");
                window.location.href = "errorpage.html";
//                $.mobile.changePage( "errorpage.html" );
            }
            else {
				console.log("Sonstiger Fehler");
            }
			console.log("Kommt es bis hierher?");
		}
	});
}

function requestWeatherByLatLon(lat,lon) {
	$.ajax({   
		url: openWeatherAPI,
		type: 'POST',
		dataType: 'jsonp',
		crossDomain: true,
		data: {
			lat:lat, 
			lon:lon,
			units:units,
			lang:lang
		},
		async: false,   	// wir setzen async auf "false", da erst weitergemacht werden soll, wenn das JSON vollständig geladen ist
		success: function(returnedData) {     		
			// wir speichern das abgeholte JSON in der Variable leJSON ab.
			leJSON = returnedData;
			//console.log('leJSON:');
			//console.log(leJSON);
			//console.log(leJSON.city.name );
			cityName = leJSON.city.name;
			createContent ();
			calculateLatLon (lat,lon);			
			setBackground ();
			
			$('.loader').css('display','none');			
			
			saveLocation(cityName,lon,lat);
			
		},
		error: function(x, status, error) {
			console.log("--- Es ist ein Fehler in der Verbindung zum Server oder beim Laden des JSON aufgetreten!");
			if (x.status == 404) {
                console.log("404 - JSON Adresse nicht erreichbar");
                window.location.href = "errorpage.html";
//                $.mobile.changePage( "errorpage.html" );
            }
            else {
				console.log("Sonstiger Fehler");
            }
			console.log("Kommt es bis hierher?");
		}
	});
}

function setBackground () {

	if ( background == 'locationPicture' ) {
		$.ajax({   
			url: panoramioAPI,
			crossDomain: true,
			dataType: 'jsonp',   
			data: {
					set: "public",
					tag:"",
					from: "0",
					to: "10", 	
					miny:panLatMin, 
					minx:panLonMin,
					maxy:panLatMax, 
					maxx:panLonmax,
					mapfilter : "false"
			},
			
			async: true,   	// wir setzen async auf "false", da erst weitergemacht werden soll, wenn das JSON vollständig geladen ist
			success: function(returnedData) { 
				console.log (returnedData);
				
				var pictureToShow = getRandom(0, 10);	// we evaluate a random number for which picture to show
				console.log ("pictureToShow: " + pictureToShow);

				var photoURL = returnedData.photos[pictureToShow].photo_file_url;	// we build the photo URL
				console.log ("photoURL: " + photoURL);
				
				// we check if the random photo URL works
				if ( typeof photoURL === undefined ) {
					photoURL = returnedData.photos[0].photo_file_url;
				}
				
				// we check if the final photoURL works and apply the appropriate body CSS
				if ( typeof photoURL != undefined ) {
					$('body').css('background-image', 'url(' + photoURL + ')');
				}
				//else { $('body').css('background-image', 'url(' + item.photo_file_url + ')'); }
				
				//$.each( returnedData.photos, function( i, item ) {
					//console.log ("item.photo_file_url: " + item.photo_file_url);
					//$( "<img/>" ).attr( "src", item.photo_file_url ).appendTo( "#backgroundimage" );
					//$('body').css('background-image', 'url(' + item.photo_file_url + ')');
				//});
			},
			
			error: function(x, status, error) {
				console.log("--- Es ist ein Fehler in der Verbindung zum Server oder beim Laden des JSON aufgetreten!");
				if (x.status == 404) {
					console.log("404 - JSON Adresse nicht erreichbar");
					window.location.href = "errorpage.html";
				}
				else {
					console.log("Sonstiger Fehler");
				}
				console.log("Kommt es bis hierher?");
			}
		});	
	}
}

function weatherIcon(weatherCondition) {
	
	if ( weatherCondition >= 200 && weatherCondition <= 211 ) { icon = '10d.png'; }
	else if ( weatherCondition == 212 ) { icon = 'heavy_thunder_storm.png'; }
	else if ( weatherCondition >= 221 && weatherCondition <= 232 ) { icon = '11d.png'; }
	
	else if ( weatherCondition >= 300 && weatherCondition <= 499 ) { icon = '09d.png'; }

	else if ( weatherCondition == 500 || weatherCondition == 501 ) { icon = '09d.png'; }				
	else if ( weatherCondition >= 502 && weatherCondition <= 504 ) { icon = 'heavy_rain.png'; }
	else if ( weatherCondition == 511 ) { icon = '13d.png'; }
	else if ( weatherCondition >= 520 && weatherCondition <= 522 ) { icon = 'rain_sun.png'; }
	else if ( weatherCondition == 600 || weatherCondition == 601 ) { icon = '13d.png'; }				
	
	else if ( weatherCondition == 602 ) { icon = 'heavysnow.png'; }
	else if ( weatherCondition == 611 ) { icon = 'ice_snow.png'; }
	else if ( weatherCondition == 621 ) { icon = 'snow_sun.png'; }
	
	else if ( weatherCondition >= 700 && weatherCondition <= 799 ) { icon = '50d.png'; }
	
	else if ( weatherCondition == 800  ) { icon = '01d.png'; }
	else if ( weatherCondition == 801  ) { icon = '02d.png'; }
	else if ( weatherCondition == 802  ) { icon = '03d.png'; }
	else if ( weatherCondition == 803  ) { icon = '03d.png'; }
	else if ( weatherCondition == 804  ) { icon = '04d.png'; }
	
	else if ( weatherCondition == 900  ) { icon = 'tornado.png'; }
	else if ( weatherCondition == 901  ) { icon = 'rain_tornado.png'; }
	else if ( weatherCondition == 902  ) { icon = 'tornado.png'; }
	else if ( weatherCondition == 903  ) { icon = 'cold.png'; }
	else if ( weatherCondition == 904  ) { icon = 'heat.png'; }
	
	else { icon = ''; }
	
	return icon;
}

function windDirection (windDegree) {
	
	if (windDegree <= 22.5) { windDirection = 'north'; }
	if (windDegree >= 22.5 && windDegree < 67.5) 	{ windDirection = 'northEast'; }
	if (windDegree >= 67.5 && windDegree < 112.5) 	{ windDirection = 'east'; }
	if (windDegree >= 112.5 && windDegree < 157.5) 	{ windDirection = 'southEast'; }
	if (windDegree >= 157.5 && windDegree < 202.5) 	{ windDirection = 'south'; }
	if (windDegree >= 202.5 && windDegree < 247.5)	{ windDirection = 'southWest'; }
	if (windDegree >= 247.5 && windDegree < 292.5) 	{ windDirection = 'west'; }
	if (windDegree >= 292.5 && windDegree < 337.5) 	{ windDirection = 'northWest'; }
	if (windDegree >= 337.5 && windDegree < 360.5) 	{ windDirection = 'north'; }
	
	return windDirection;
	
}

function windSpeed (windSpeed) {
	
	if ( windSpeed < 1) 							{ description = 'calm'; }
	if ( windSpeed >= 1 && windSpeed < 3 ) 			{ description = 'lightAir'; }
	if ( windSpeed >= 3 && windSpeed < 6 ) 			{ description = 'lightBreeze'; }
	if ( windSpeed >= 6 && windSpeed < 10 ) 		{ description = 'gentleBreeze'; }
	if ( windSpeed >= 10 && windSpeed < 16 ) 		{ description = 'moderateBreeze'; }
	if ( windSpeed >= 16 && windSpeed < 22 )		{ description = 'freshBreeze'; }
	if ( windSpeed >= 22 && windSpeed < 33 ) 		{ description = 'moderateGale'; }
	if ( windSpeed >= 34 && windSpeed < 40 )	 	{ description = 'freshGale'; }
	if ( windSpeed >= 40 && windSpeed < 47 ) 		{ description = 'strongGale'; }
	if ( windSpeed >= 47 && windSpeed < 63 ) 		{ description = 'storm'; }
	if ( windSpeed >= 63 ) 							{ description = 'hurricane'; }
	
	return description;

}

function error(err) {
	switch(err.code) {
	   case err.PERMISSION_DENIED:
		  return "User denied the request for Geolocation."
		  console.log ("User denied the request for Geolocation.")
		  break;
	   case err.POSITION_UNAVAILABLE:
		  return "Location information is unavailable."
		  console.log ("Location information is unavailable.")
		  break;
	   case err.TIMEOUT:
		  return "The request to get user location timed out."
		  console.log ("The request to get user location timed out.")
		  break;
	   case err.UNKNOWN_ERROR:
		  return "An unknown error occurred."
		  console.log ("An unknown error occurred.")
		  break;
	}
}

function success(pos) {

	var crd = pos.coords;

	console.log('Your current position is:');
	console.log('Latitude : ' + crd.latitude);
	console.log('Longitude: ' + crd.longitude);
	console.log('More or less ' + crd.accuracy + ' meters.');

	
};

function getLocation() {

	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	if (navigator.geolocation) {
		
		navigator.geolocation.getCurrentPosition(success, error, options);
		
		return {
			'lon': crd.longitude,
			'lat': crd.latitude
		};  
		
	}
	else { return "Geolocation is currently not available or is not supported by system."; }
}
function getRandom(min, max) {
 if(min > max) {
  return -1;
 }
 
 if(min == max) {
  return min;
 }
 
 var r;
 
 do {
  r = Math.random();
 }
 while(r == 1.0);
 
 return min + parseInt(r * (max-min+1));
}
