var MapWrapper = Fiber.extend(function() {
    return {
        init: function(mapSelector) {
            function private1(){}
            function private2(){}

            // Privileged
            this.privileged1 = function(){}
            this.privileged2 = function(){}

            this.mapSelector = mapSelector;
        },
        // Public
        setupMap: function(){
            var styles = [{
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
            }];

            var mapOptions = {
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                mapTypeControlOptions: {
                  mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            }

            var mapContainer = $(this.mapSelector).get(0);
            this.map = new google.maps.Map(mapContainer, mapOptions);

            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control.
            var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

            //Associate the styled map with the MapTypeId and set it to display.
            this.map.mapTypes.set('map_style', styledMap);
            this.map.setMapTypeId('map_style');

            this.directionsDisplay = new google.maps.DirectionsRenderer();
            this.directionsDisplay.setMap(this.map);
            this.directionsService = new google.maps.DirectionsService();
        },
        // this function will be called if no HTML geo location available
        handleNoGeolocation: function(errorFlag) {
          if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
          } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
          }
          console.log(content);
        },
        recalculateRoute: function(where, onRouteReady) {
            var that = this;
            var travelMode = "WALKING";
            var request = {
              origin: this.currentPosition, // from position - we updated it in `updatePosition` function
              destination: where, // where to go (free form text input)
              travelMode: google.maps.DirectionsTravelMode[travelMode] //http://dreamdealer.nl/tutorials/adding_travel_modes_and_waypoints_to_google_maps_directions.html
            };
            
            this.directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                window.mapWrapper.directionsDisplay.setDirections(response);

                var route = response.routes[0].legs[0];

                onRouteReady(route);
              }
            });
        },
        updatePosition: function(onPositionFunc) {
            // Try HTML5 geolocation
          var that = this;
          if(navigator.geolocation) {
            //http://www.w3schools.com/html/html5_geolocation.asp - coords.speed  is The speed in meters per second

            navigator.geolocation.getCurrentPosition(function(position) {
              // convert speed to MPH
              var speedMph = utils.mps2mph(position.coords.speed);
              var roundSpeed = Math.floor(speedMph);
              window.gameState.setUserSpeed(roundSpeed);

              that.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

              // marker for user
              var image = 'user_icon_1.png';
              var userMarker = new google.maps.Marker({
                map: that.map,
                position: that.currentPosition,
                title: "You are here!",
                icon: image
              });

              if (onPositionFunc) {
                // execute provided function
                onPositionFunc();
              } else {
                // if no function specified - just center the map view
                that.map.setCenter(pos);
              }
            }, function() {
              // this happens if HTML5 navigation failed to give current position
              that.handleNoGeolocation(true);
            });
          } else {
            // Browser doesn't support Geolocation
            that.handleNoGeolocation(false);
          }
        }
    }
});

window.mapWrapper = new MapWrapper('#map-canvas');