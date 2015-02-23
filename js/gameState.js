// Current state of the game.
var GameState = Fiber.extend(function() {
    return {
        init: function() {
          this.reset();
        },
        setUserSpeed: function(speed) {
          this.userSpeed = speed;
        },
        setArrivalTime: function(arrivalTime) {
          this.arrivalTime = arrivalTime;
        },
        setStartTime: function(startTime) {
          this.startTime = startTime;
        },
        setLastHurryUpAlert: function(hurryUpTime) {
          this.lastHurryUpAlert = hurryUpTime;
        },
        setDestination: function(destination) {
          this.destination = destination;
        },
        setBunnySpeed: function(bunnySpeed) {
          this.bunnySpeed = bunnySpeed;
        },
        reset: function() {
            this.userSpeed = null;
            this.bunnySpeed = null;
            this.destination = null;
            this.arrivalTime = null;
            this.startTime = null;
            this.lastHurryUpAlert = null;
        }
      }
});

window.gameState = new GameState();