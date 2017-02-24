$(document).ready(getLocation);
	var offset;
	var tempC;
	var icon;
	var lat;
	var lon;
	var tempF;
	var code;
	var isCelsius = true;
	var direction;
// set temperature
function setTemperature (a) {
	$('#temp').text(a)
}


function getLocation () {
	$('ul').css('display', 'none');
}
// *******  AUTOCOMPLETE INPUT *******
var input = document.getElementById('city');
var autocomplete = new google.maps.places.Autocomplete(input);
google.maps.event.addListener(autocomplete, 'place_changed', function() {
	var place = autocomplete.getPlace();
	var coords = {
		latitude: place.geometry.location.lat(),
		longitude: place.geometry.location.lng()
	}
	var offset = place.utc_offset * 60000;
	console.log(place.utc_offset);
	getCurrentWeather(coords, offset);
});
// clear the search field
$("#city").on('click', function  () {
	$(this).val('');
});
	// ***  toggle temp C and F ***
$("#temp").on("click", convertTemp);

//*** changing temperature measure ***
function convertTemp() {
	if (isCelsius) {
		setTemperature(tempF);
	} else {
		setTemperature(tempC);
	}
	isCelsius = !isCelsius;
};
	//*** current weather api ***
function getCurrentWeather(coords, offset) {
	$.getJSON('https://api.openweathermap.org/data/2.5/weather?lat='+coords.latitude+'&lon='+coords.longitude+'&units=metric&appid=9784b7a432a0f413b057a0a5e13a34fb', function(json) {
			
		icon = json.weather[0].icon;
		var tempValue = Math.round(json.main.temp)
		tempC = tempValue + 'ºC';
		var farenheit = Math.round(tempValue * 5/9 + 32);
		tempF = farenheit + 'ºF';
		var windDirection = json.wind.deg;
		var direction;
		
		if (windDirection <= 90) {
			direction = "NE";
		} else if (windDirection == 90) {
			direction = "E";
		} else if (windDirection <= 180) {
			direction = "SE";
		} else if (windDirection == 180) {
			direction = "S";
		} else if (windDirection <= 270) {
			direction = "SW";
		} else if (windDirection == 270) {
			direction = "W";
		} else if (windDirection <= 360) {
			direction = "NW";
		} else if (windDirection == 0) {
			direction = "N";
		}
		
		$('#direction').text(direction);		
		$('#icon').html('<img src="http://openweathermap.org/img/w/' + icon + '.png" alt="icon" />');
		$('#description').text(json.weather[0].description);
		$('#wind').html(json.wind.speed + ' m/s');
		$('#humidity').html(json.main.humidity + ' %');
		$('#pressure').html(json.main.pressure + ' hPa')
		$('.input').html('<h1>' + json.name + ", " + json.sys.country + '</h1>');
		$('ul').css('display', 'block');
		var timestamp = json.dt - offset;
		
		getTime (coords, timestamp);
		console.log("THIS IS THE TIMESTAMP " + timestamp);
		// *****  pending **** create exact time on the location that was searched for
		// var newDate = new Date();
		// newDate.setTime(timestamp);
		setTemperature(tempC);
		getLocalTime();
	});
}

// for now only in local time from where are you searching
function getLocalTime() {
	
	var dayInWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var date = new Date();
	var d = date.toLocaleString ('en-GB', {hour:'numeric', minute:'numeric', hour12: true});
	
	var newTimeString = date.toTimeString();
	console.log('from epoch ' + newTimeString);
	console.log("locale time string " + date);
	var days = dayInWeek[date.getDay()];

	$('.time').html(days + ' ' + d);
	$('.time span').css('text-transform','capitalize');
}

// ******  GOOLGE TIME API *******
function getTime (coords, timestamp) {
	var googleTimeKey = "AIzaSyDFYlL4nXzyDJZlESkfuFjVPxVelR-v1hQ";
	$.getJSON('https://maps.googleapis.com/maps/api/timezone/json?location=' + coords.latitude + ',' + coords.longitude + '&timestamp=' + timestamp + '&key=' + googleTimeKey, function (data) {
		var offset = timestamp; // + data.dstOffset + data.rawOffset
		console.log('this is offset ' + timestamp);
		console.log(data);
	});
}
