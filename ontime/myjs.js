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

function initialize() {

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
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});



  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');
	
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  updatePosition();
}

function updatePosition(onPositionFunc) {
	  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
		curSpeed = position.coords.speed * 2.23694;
		$(".curspeed").text(curSpeed+" MPH");
      pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      var image = 'customicon.png';
      var infowindow = new google.maps.Marker({
        map: map,
        position: pos,
        title: "You are here!",
		icon: image
      });

    if (onPositionFunc) {
	    onPositionFunc();
	  } else {
		 map.setCenter(pos);
	}
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
	  
	  // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }
 console.log(content);
}

function startpath(informationOnly) {
  var minutes = parseInt(document.getElementById('time').value);
  var currentime=Math.floor(+new Date()/1000);
  neededtime=currentime+minutes*60;
  calcRoute(informationOnly);
}

function calcRoute(informationOnly) {
  updatePosition(function() {
    var end = document.getElementById('address').value;
    var request = {
      origin: pos,
      destination:end,
      travelMode: google.maps.DirectionsTravelMode.WALKING
	  
    };
  
  
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
	    console.dir(response);
	    calspeed(response.routes[0].legs[0].distance.value);
	 
	    if (informationOnly) {
	      nonehuman();
        }
        else {
		  timeout = setTimeout(calcRoute, 5000);
		  if (!timeout1)
		  {timeout1 = setTimeout(hurryup,30000);}
	    }
	  }
    });
  });
  
}

function initClick(){
	$('.square').click(function() {
		map.setCenter(pos);
	});
} 

function calspeed(meters){
	var currentime=Math.floor(+new Date()/1000);
	var lefttime=neededtime-currentime;
	var speedms=meters/lefttime;
	$(".time").val(Math.round(lefttime/60));
	speed = speedms*2.23694;
	$(".speed").text(speed.toFixed(2) + " " + "MPH");
	$(".speed1").text(speed.toFixed(2) + " " + "MPH").show();
	//nonehuman();

}

function refresh()
{
setInterval(calspeed,2000);
}

//Hurry up function

function hurryup()

{
timeout1 = null;
if (speed>curSpeed)
{$(".alert").css("display","block");
 $(".buttonok").css("display","block");
 $(".buttonok").click(function(e){
	 e.preventDefault();
	 $(this).css("display","none");
	 $(".alert").css("display","none");
	 
	 });
};
	
};
	
	
function nonehuman(){

	
	if(speed>4){
		$(".getinfo").css("display","none"),
		$(".impossible").css("display","block"),
		$(".backtomap").css("display","block"),
		$(".backtomap").click(function(){
			$(this).css("display","none"),
			$(".impossible").css("display","none"),
			$(".getinfo").css("display","block");
		});
		return false;
	}
	else{
	    $(".getinfo").css("display","none");
		$(".info").css("display","block");
		$(".changewalk").css("display","block");
		$(".startwalk").css("display","block");
		
	$(".startwalk").click(function(){
		$(this).css("display","none"),
		$(".info").css("display","none"),
		$(".changewalk").css("display","none"),
		$(".speed").css("display","block"),
		$(".curspeed").css("display","block");});
		
	$(".changewalk").click(function(){
		$(this).css("display","none"),
		$(".startwalk").css("display","none"),
		$(".info").css("display","none"),
		$(".getinfo").css("display","block");
		});
		
		return true;
			
		}
	
	}
	
function validateForm()
{
var x=document.forms["myForm"]["minutes"].value;
var y = document.forms["myForm"]["address"].value;
if (x==null || x=="")
  {
  alert("Please fill out the form");
  return false;
  }
  
  if (y==null || y=="")
  {
 
  return false;
  }
  
  return true;

}
//See more at: http://www.w3resource.com/javascript/form/all-numbers.php#sthash.1HJPTJtH.dpuf 
 function allnumeric(inputtxt)  
   {  var numbers = /^[0-9]*$/;  
      if(!inputtxt.value.match(numbers))  
      {  
      alert('Please input numbers only');  
      document.form1.text1.focus();  
      return false;  
      }  
   }



//from here: http://stackoverflow.com/questions/15343890/clear-input-fields-on-form-submit
function emptyinput(){
var form = document.getElementById("myForm");
form.reset();
	
	}	
	
$("body").on({
    ajaxStart: function() { 
        $(this).addClass("loading"); 
    },
    ajaxStop: function() { 
        $(this).removeClass("loading"); 
    }    
});
			

google.maps.event.addDomListener(window, 'load', initialize);
