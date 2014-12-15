// JavaScript Document
// from here: https://developers.google.com/maps/documentation/javascript/examples/directions-simple
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var geocoder;
var neededtime;
var pos;
var address;
var speed;
var timeout;
var curSpeed;
var timeout1;
var bunnyspeed; // set in the beginning
var bunnystarttime;
var bunnyMarker;

function onSearchSubmit() {
  //alert('SEARCH1: ' + $("#address").val());
  if(validateForm() ) { startpath(true) }
}

function initialize() {

  //input -> onFocus -> show div with recent history
  //http://stackoverflow.com/questions/6635437/on-form-input-focus-show-div

//  $("#address").focusin(function() {
//	  //
//	  // add recent places to history div
//	  //
//	  
//	  var historylist =  $("#history-div ul");
//	  var places = getPlaces();
//	  
//	  historylist.empty();
//	  
//	  for (var i = 0 ; i < places.length; i++) {
//	  	var placeli = $("<li></li>").text(places[i]);
//		historylist.append(placeli);
//	  }
//	  
//	  
//      $("#history-div").show();
//	  
//	
//  }).focusout(function () {
//      $("#history-div").hide();
//  });

  
 $("#time").focusin(function() {
	 
    // to show a filter options after inputting address on enter 
	   $(".routeForm").show();  });


    
var styles = [
    {
      stylers: [
        { hue: "#eeeddf" },
        { saturation: -60 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 10 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];    
    


  var mapOptions = {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  }
  
  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});



  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
  
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  updatePosition();
}


// what is does:
// 1. uses html5 geolocation to get current position
// 2. uses this position to update marker for "user"
// 3. executes provided function
//
// use this function together with your cutom `onPositionFunc` to ensure you are working with current user position
function updatePosition(onPositionFunc) {
    // Try HTML5 geolocation
  if(navigator.geolocation) {
    //http://www.w3schools.com/html/html5_geolocation.asp - coords.speed  is The speed in meters per second

    navigator.geolocation.getCurrentPosition(function(position) {
      // convert speed to MPH
      curSpeed = Math.floor(position.coords.speed * 2.23694);
      
      // update displayed `curspeed`
      // $(".curspeed").text(curSpeed + " MPH");
      
      pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      // marker for user
      var image = 'user_icon_1.png';
      var userMarker = new google.maps.Marker({
        map: map,
        position: pos,
        title: "You are here!",
        icon: image
      });

      if (onPositionFunc) {
        // execute provided function
        onPositionFunc();
      } else {
        // if no function specified - just center the map view
        map.setCenter(pos);
      }
    }, function() {
      // this happens if HTML5 navigation failed to give current position
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

// this function will be called if no HTML geo location available
function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }
 console.log(content);
}

// this function can be executed in 2 cases:
// 1. show information about the routes available
// 2. start movement
// 
// for first - use informationOnly = true
// to start movement - use informationOnly = false
function startpath(informationOnly) {
  //http://www.w3schools.com/jsref/jsref_parseint.asp
  // read the value from `time` input. it is going to be in minutes
  var neededDateStr = $('#time').val(); // parseInt(document.getElementById('time').value);
  var hours = parseInt(neededDateStr.split(":")[0]);
  if (neededDateStr.indexOf("PM")) {
    hours += 12;
  }
  var minutes = parseInt(neededDateStr.split(":")[1]);
    
  // current timestamp in seconds
  var todayDate = new Date();
  todayDate.setHours(hours, minutes,0, 0);

  var currentime = getCurrentTimestamp();
  // timestamp when we need to arrive
  neededtime = todayDate.getTime() / 1000; // convert to seconds
  // fix bunny's beginning time
  bunnystarttime = currentime;
  calcRoute(informationOnly);
}

// updates current user location and calls google maps API to create  route
function calcRoute(informationOnly) {
  // when updatePosition is done - inner function will be executed
  updatePosition(function() {
    var end = document.getElementById('address').value;
	var travelMode = "WALKING"; //$('input[name="travelMode"]:checked').val();
	
	storePlace(end);
	

    var request = {
      origin: pos, // from position - we updated it in `updatePosition` function
      destination: end, // where to go (free form text input)
      travelMode: google.maps.DirectionsTravelMode[travelMode] //http://dreamdealer.nl/tutorials/adding_travel_modes_and_waypoints_to_google_maps_directions.html
    };
	
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        console.dir(response);

        // response.routes[0].legs[0] is going to be the first route
        // distance.value will give full length in meters
        calspeed(response.routes[0].legs[0].distance.value);

        
        // if it is `informational` then we just update UI
        // otherwise schedule next coordinate check in 5 seconds
        if (informationOnly) {
          checkIfSpeedIsPossibleForHuman();
        } else {
          // update bunny
          updatebunny(response.routes[0].legs[0]);

          // reschedule next update
          timeout = setTimeout(calcRoute, 5000);
          if (!timeout1) {
            timeout1 = setTimeout(hurryup,30000);
          }
        }
      }
    });
  });
}

function updatebunny(route) {
  console.dir(route);
  console.log("BUNNY SHOULD BE POSITIONED");
  var currentime = getCurrentTimestamp();
  var accLength = 0;
  // time since bunny started
  var timepassed = currentime - bunnystarttime;
  // distance that bunny should have passed in meters
  var bunnydistance = timepassed * bunnyspeed;

  
  for (var i = 0; i < route.steps.length; i++) {
    var step = route.steps[i];
    var steplength = step.distance.value;
    if (bunnydistance >= accLength && bunnydistance < steplength) {
      // meaning bunny is somewhere in this step
      // ration from what bunny passed to the total step length
      var ratio = (bunnydistance - accLength)  / (steplength * 1.0);
      var startLat = step.start_location.lat();
      var startLong = step.start_location.lng();
      var endLat = step.end_location.lat();
      var endLong = step.end_location.lng();

      // bunny's new latitude / longitude
      var newLat = startLat + (endLat - startLat) * ratio;
      var newLong = startLong + (endLong - startLong) * ratio;

      var bunnyPos = new google.maps.LatLng(newLat, newLong);
      // marker for user
      var image = 'bunny_icon.png';
      
      if (!bunnyMarker) {
        bunnyMarker = new google.maps.Marker({
          map: map,
          position: bunnyPos,
          title: "You are here!",
          icon: image
        });
      } else {
        bunnyMarker.setPosition(bunnyPos);
      }

      break;

      // calculate bunny's coordinates
    }

    accLength += steplength;
  }
  // marker for user
  // var image = 'customicon.png';
  // var userMarker = new google.maps.Marker({
  //   map: map,
  //   position: pos,
  //   title: "You are here!",
  //   icon: image
  // });
}



function initClick(){
  $('.square').click(function() {
    map.setCenter(pos);
  });
} 

function getCurrentTimestamp() {
  var currentime = Math.floor( + new Date() / 1000);
  return currentime;
}

function calspeed(meters){
  //http://stackoverflow.com/a/221297
  var currentime = getCurrentTimestamp();
  // time remaining to finish the route
  var lefttime = neededtime - currentime;
  // speed in meters per second
  var speedms = meters / lefttime;
  // $(".time").val(Math.round(lefttime / 60));
  // convert from meters per second to miles per hour
  speed = speedms * 2.23694;
  // update your speed and desired speed
  //$(".speed").text(speed.toFixed(2) + " " + "MPH");
  //$(".speed1").text(speed.toFixed(2) + " " + "MPH").show();
}

//Hurry up function

function hurryup() {
  timeout1 = null;
  if (speed>curSpeed) {
  $(".alert").css("display","block");
  $(".buttonok").css("display","block");
  $(".buttonok").click(function(e){
    e.preventDefault();
    $(this).css("display","none");
    $(".alert").css("display","none");
  });
  };
};
  
  
function checkIfSpeedIsPossibleForHuman(){

  // fix bunny speed here
  bunnyspeed = speed / 2.23694;  // should be in meters in seconds
  
  if(speed>4){
    $(".getinfo").css("display","none"),
//    $(".impossible").css("display","block"),
    $(".backtomap").css("display","block"),
    $(".backtomap").click(function(){
      $(this).css("display","none"),
//      $(".impossible").css("display","none"),
      $(".getinfo").css("display","block");
    });
    return false;
  }
  else{
    $(".getinfo").css("display","none");
//    $(".info").css("display","block");
    $(".changewalk").css("display","block");
    $(".startwalk").css("display","block");
    
  $(".startwalk").click(function(){
    $(this).css("display","none");
//    $(".info").css("display","none");
    $(".changewalk").css("display","none");
    //$(".speed").css("display","block"),
    //$(".curspeed").css("display","block");
  });
    
  $(".changewalk").click(function(){
    $(this).css("display","none"),
    $(".startwalk").css("display","none"),
//    $(".info").css("display","none"),
    $(".getinfo").css("display","block");
    });
    
    return true;
      
    }
  
  }
  
// validate that we filled all values in the form
function validateForm() {
	var x =document.forms["myForm"]["minutes"].value;
  var y = document.forms["myForm"]["address"].value;
  if (x == null || x == "") {
    alert("Please fill out the form");
    return false;
  }
  
  if (y == null || y == "") {
    return false;
  }

  return true;
}

// validate that input element has only numbers
//See more at: http://www.w3resource.com/javascript/form/all-numbers.php#sthash.1HJPTJtH.dpuf 
function allnumeric(inputtxt)  {
  var numbers = /^[0-9]*$/;  
  if (!inputtxt.value.match(numbers)) {  
    alert('Please input numbers only');  
    document.form1.text1.focus();  
    return false;  
  }  
 }



//from here: http://stackoverflow.com/questions/15343890/clear-input-fields-on-form-submit
function emptyinput() {
  var form = document.getElementById("myForm");
  form.reset();
}   

google.maps.event.addDomListener(window, 'load', initialize);


function getPlaces() {
	return JSON.parse(localStorage.places || '[]');
}

// adds a place into local storage
function storePlace(place) {
	var places = getPlaces();
	// check if place is already in array
	if (places.indexOf(place) == -1) {
	  // if not - save to the array
	  places.push(place);
	}
	// store array as a string
	localStorage.places = JSON.stringify(places);
}

// from https://twitter.github.io/typeahead.js/examples/
var substringMatcher = function() {
  return function findMatches(q, cb) {
    var strs = getPlaces();
      
    var matches, substrRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};

$(function() {
    var $pauseButtons = $("li.pause");
    
    $pauseButtons.click(function(e) {
        $pauseButtons.toggle();
        e.isPropagationStopped();
    });
    
    $('#address').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'prevAddresses',
      displayKey: 'value',
      source: substringMatcher()
    });

    // handler for cancel menu
    // should stop current navigation and clear input fields
    $("#menu_cancel").click(function() {
        if (timeout) {
            clearTimeout(timeout);
        }
        if (timeout1) {
            clearTimeout(timeout1);
        }
        emptyinput();
        // remove navigation route from map
        // https://developers.google.com/maps/documentation/javascript/reference#DirectionsRenderer
        directionsDisplay.setMap(null);
    });
    
});