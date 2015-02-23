// Animal base class
var Bunny = Fiber.extend(function() {
    return {
        // The `init` method serves as the constructor.
        init: function() {
            this.bunnyMarker = null;
        },
        removeFromMap: function() {
            this.bunnyMarker.setMap(null);
        },
        addToMap: function() {
            this.bunnyMarker.setMap(mapWrapper.map);
        },
        update: function(route) {
          console.dir(route);
          console.log("BUNNY SHOULD BE POSITIONED");
          var currenTime = utils.getCurrentTimestamp();
          var accLength = 0;
          // time since bunny started
          var timePassed = currenTime - gameState.startTime;
          // distance that bunny should have passed in meters
          var bunnyDistance = timePassed * gameState.bunnySpeed;

          
          for (var i = 0; i < route.steps.length; i++) {
            var step = route.steps[i];
            var steplength = step.distance.value;
            if (bunnyDistance >= accLength && bunnyDistance < steplength) {
              // meaning bunny is somewhere in this step
              // ration from what bunny passed to the total step length
              var ratio = (bunnyDistance - accLength)  / (steplength * 1.0);
              var startLat = step.start_location.lat();
              var startLong = step.start_location.lng();
              var endLat = step.end_location.lat();
              var endLong = step.end_location.lng();

              // bunny's new latitude / longitude
              var newLat = startLat + (endLat - startLat) * ratio;
              var newLong = startLong + (endLong - startLong) * ratio;

              var bunnyPos = new google.maps.LatLng(newLat, newLong);
              // marker for user
              var image = 'bunny.png';
              
              if (!this.bunnyMarker) {
                this.bunnyMarker = new google.maps.Marker({
                  map: mapWrapper.map,
                  position: bunnyPos,
                  title: "You are here!",
                  icon: image
                });
              } else {
                if (!this.bunnyMarker.getMap()) {
                    this.bunnyMarker.setMap(mapWrapper.map);
                }
                this.bunnyMarker.setPosition(bunnyPos);
              }

              break;

              // calculate bunny's coordinates
            }

            accLength += steplength;
          }
      }
    }
});

window.bunny = new Bunny();