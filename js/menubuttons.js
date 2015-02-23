$(function() {
    var $pauseButtons = $("li.pause");
    
    function emptyinput() {
      var form = document.getElementById("myForm");
      form.reset();
    }   

    $pauseButtons.click(function(e) {
        $pauseButtons.toggle();

        if (this.id == "release_li") {
          startCalcRouteTimer();
        } else {
          stopCalcRouteTimer();
        }

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
      source: window.placesStorage.placesMatcher()
    });

    // handler for cancel menu
    // should stop current navigation and clear input fields
    $("#menu_cancel").click(function() {
        stopCalcRouteTimer();
        emptyinput();
        // remove navigation route from map
        // https://developers.google.com/maps/documentation/javascript/reference#DirectionsRenderer
        mapWrapper.removeDirections();
        gameState.reset();
        bunny.removeFromMap();
    });
    
});