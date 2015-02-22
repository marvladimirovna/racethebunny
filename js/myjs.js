// JavaScript Document
// from here: https://developers.google.com/maps/documentation/javascript/examples/directions-simple
var geocoder;
var pos;
var address;
var speed;
var timeout;

var HURRY_UP_INTERVAL = 30; // seconds

var REFRESH_ROUTE_INTERVAL = 5; // seconds

function onSearchSubmit() {
  //alert('SEARCH1: ' + $("#address").val());
  if (validateForm()) {
    startpath(true)
  }
}

function initialize() {

  window.mapWrapper.setupMap();
  window.mapWrapper.updatePosition();


  $("#time").focusin(function() { 
    // to show a filter options after inputting address on enter 
    $(".routeForm").show();
  });

  $("#startwalk").click(function(){
    startpath(false);
  })

  $("#user_square_icon").click(function(){
    map.setCenter(pos);
  });
}




// what is does:
// 1. uses html5 geolocation to get current position
// 2. uses this position to update marker for "user"
// 3. executes provided function
//
// use this function together with your cutom `onPositionFunc` to ensure you are working with current user position


// this function can be executed in 2 cases:
// 1. show information about the routes available
// 2. start movement
// 
// for first - use informationOnly = true
// to start movement - use informationOnly = false
function startpath(informationOnly) {
  //http://www.w3schools.com/jsref/jsref_parseint.asp
  // read the value from `time` input. it is going to be in minutes
  var userInputTime = $('#time').val();
  var currenTime = utils.getCurrentTimestamp();
  
  var destination = document.getElementById('address').value;
  placesStorage.storePlace(destination);

  // timestamp when we need to arrive
  var arrivalTime = utils.timeStringToTimestamp(userInputTime);
  
  gameState.setArrivalTime(arrivalTime);
  gameState.setStartTime(currenTime);
  gameState.setDestination(destination);
  
  if (informationOnly) {
    calcRoute(updateInfoWithRoute);
  } else {
    calcRoute(function(route) {
      var requiredSpeed = calculateRequiredSpeed(route.distance.value);
      gameState.setBunnySpeed(requiredSpeed);
      updateGameState(route);
    });
  }
}

function updateInfoWithRoute(route) {
    // response.routes[0].legs[0] is going to be the first route
    // distance.value will give full length in meters
    var requiredSpeed = calculateRequiredSpeed(route.distance.value);
    checkIfSpeedIsPossibleForHuman(requiredSpeed);
}

function updateGameState(route) {
  // update bunny
  bunny.update(route);

  // reschedule next update
  timeout = setTimeout(recurringCalcRoute, REFRESH_ROUTE_INTERVAL * 1000);
  if (utils.getCurrentTimestamp() > gameState.lastHurryUpAlert + HURRY_UP_INTERVAL) {
    hurryup();
    gameState.setLastHurryUpAlert(utils.getCurrentTimestamp());
  }
}

// updates current user location and calls google maps API to create  route
function calcRoute(callback) {
  // when updatePosition is done - inner function will be executed
  window.mapWrapper.updatePosition(function() {
    window.mapWrapper.recalculateRoute(gameState.destination, callback);
  });
}

// helper wrapper around calc route to use with intervals
function recurringCalcRoute() {
  calcRoute(updateGameState);
}

function calculateRequiredSpeed(meters){
  //http://stackoverflow.com/a/221297
  var currentTime = utils.getCurrentTimestamp();
  // time remaining to finish the route
  var leftTime = gameState.arrivalTime - currentTime;
  // speed in meters per second
  var speedMPS = meters / leftTime;
  
  // convert from meters per second to miles per hour
  var speedMPH = utils.mps2mph(speedMPS);

  return speedMPH;
}

//Hurry up function

function hurryup() {
  var $buttonOk = $(".buttonok");
  var $alert = $(".alert");

  if (speed > window.mapWrapper.curSpeed) {
    $alert.show();
    $buttonOk.show();
    
    $buttonOk.click(function(e){
      e.preventDefault();
      
      $buttonOk.hide();
      $alert.hide();
    });
  };
};
  
  
function checkIfSpeedIsPossibleForHuman(requiredSpeed) {

  if(requiredSpeed > 4){
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
	var x = document.forms["myForm"]["minutes"].value;
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


//from here: http://stackoverflow.com/questions/15343890/clear-input-fields-on-form-submit
function emptyinput() {
  var form = document.getElementById("myForm");
  form.reset();
}   

google.maps.event.addDomListener(window, 'load', initialize);




