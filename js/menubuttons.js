$(function() {
    var $pauseButtons = $("li.pause");
    
    $pauseButtons.click(function(e) {
        $pauseButtons.toggle();

        // 

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