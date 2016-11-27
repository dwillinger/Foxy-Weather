var errorKey	= 'foxyWeather_errorMsg';
var lang 		= localStorage.getItem('foxyWeather_language');
if ( lang == undefined || lang == null || lang == '' ) { lang = 'en'; }
var units 		= localStorage.getItem('foxyWeather_units');
if ( units == undefined || units == null || units == '' ) { units = 'metric'; }
var background 	= localStorage.getItem('foxyWeather_background');
if ( background == undefined || background == null || background == '' ) { background = 'locationPicture'; }
var errorMsg 	= localStorage.getItem(errorKey);

$(document).ready(function() {

	
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

	
	if ( errorMsg == '1' ) {
		$('#errorMsg').css('display','block');
		localStorage.removeItem(errorKey);
	}
	else { $('#errorMsg').css('display','none'); }
	
	$('#selectLanguage').val(lang);
	$('#selectUnits').val(units);
	$('#selectBackground').val(background);

	// Event Listener for the "Get Current Location" Button
	$('#main').off('click','#getLocation').on('click', '#getLocation', function (event) {
		console.log("Klick on Get Current Location - Button!");
		event.preventDefault();
		//createSettingsContent ();
		//geoFindMe();
		

		
		if (!navigator.geolocation){
			console.log (" geolocation is available ");
			navigator.geolocation.getCurrentPosition(function(position) {
				console.log("navigator.geolocation.getCurrentPosition");
				var latitude  = position.coords.latitude;
				var longitude = position.coords.longitude;

				console.log ( 'Latitude is ' + latitude + '° - Longitude is ' + longitude + '°' );		
				var html = 'Latitude is ' + latitude + '° - Longitude is ' + longitude + '°';		
				$('#locationFeedback').html(html);
			});
		} else {
			var html = 'Standortbestimmung ist leider nicht möglich';		
			$('#locationFeedback').html(html);
		}
	});		
	
	// Event Listener for the "Get Location" Button
	$('#main').off('click','#addNewLocation').on('click', '#addNewLocation', function (event) {
		//console.log("Klick on Get Weather - yeah!");
		event.preventDefault();
		addNewLocation ();
	});		

	$( "#selectLanguage" ).change(function() {
		var language = $( this ).val();		// we get the value of the selected option
		console.log ( "Handler for .change() called: " + language );
		localStorage.setItem('foxyWeather_language', language);	// we store the value in localstorage
		i18n.init({ lng: language }, function(t) { $("body").i18n(); });	// we re-initialize i18n
	});
	
	$( "#selectUnits" ).change(function() {
		var unit = $( this ).val();		// we get the value of the selected option
		console.log ( "Handler for .change() called: " + unit );
		localStorage.setItem('foxyWeather_units', unit);	// we store the value in localstorage
	});	
	
	$( "#selectBackground" ).change(function() {
		var background = $( this ).val();		// we get the value of the selected option
		console.log ( "Handler for .change() called: " + background );
		localStorage.setItem('foxyWeather_background', background);	// we store the value in localstorage
	});
	$('#newLocation').keyup(function(e) {
		//console.log(e.keyCode);
		if(e.keyCode == 13) {
			//alert('Enter key was pressed.');
			//console.log('Enter key was pressed.');
			addNewLocation ();
		}
	});
	
});

function addNewLocation () {
	var newLocation = $('#newLocation').val();		// the name of the location is retreived from the input field
	if ( newLocation == '' || newLocation == ' ' ) { return true; }	// if field is empty we end function here
	console.log("leNewLocation: " + newLocation);
	
	localStorage.setItem('foxyWeatherSearch', newLocation);		
	//console.log('length: ' + localStorage.length);

	// der String wird aus dem localStorage abgeholt
	searchItem = localStorage.getItem('foxyWeatherSearch');
	console.log("searchItem: " + searchItem);
			
	window.location.href = "index.html";			// the index.html is called to show the weather for this location
}

function geoFindMe() {
	console.log ("geoFindMe");
	
  if (!navigator.geolocation){
    console.log ( "Geolocation is not supported by your browser" );
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

    console.log ( 'Latitude is ' + latitude + '° - Longitude is ' + longitude + '°' );

  };

  function error() {
    console.log ("Unable to retrieve your location");
  };

  navigator.geolocation.getCurrentPosition(success, error);
  
}