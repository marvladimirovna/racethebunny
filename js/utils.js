window.utils = {
  timeStringToTimestamp: function(timeString) {
      var neededDateStr = timeString;
      var hours = parseInt(neededDateStr.split(":")[0]);
      if (neededDateStr.indexOf("PM")) {
        hours += 12;
      }
      var minutes = parseInt(neededDateStr.split(":")[1]);
        
      // current timestamp in seconds
      var todayDate = new Date();
      todayDate.setHours(hours, minutes,0, 0);

      return todayDate.getTime() / 1000; // convert to seconds

    },
    mps2mph: function(speed) {
        return speed * 2.23694;
    },
    mph2mps: function(speed) {
        return speed / 2.23694;
    },
    getCurrentTimestamp: function() {
      var currentime = Math.floor( + new Date() / 1000);
      return currentime;
    }
};