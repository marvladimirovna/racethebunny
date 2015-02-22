var PlacesStorage = Fiber.extend(function() {
    return {
        // The `init` method serves as the constructor.
        init: function() {},
        getPlaces: function(){
            return JSON.parse(localStorage.places || '[]');
        },
        storePlace: function(place) {
            var places = this.getPlaces();
            // check if place is already in array
            if (places.indexOf(place) == -1) {
              // if not - save to the array
              places.push(place);
            }
            // store array as a string
            localStorage.places = JSON.stringify(places);
        },
        placesMatcher: function() {
            var that = this;
            return function findMatches(q, cb) {
                var strs = that.getPlaces();
                  
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
            }
        }
    }
});

window.placesStorage = new PlacesStorage();