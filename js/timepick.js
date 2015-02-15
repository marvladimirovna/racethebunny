$(function(){
    // $('.timepicker').pickatime({
    //     interval: 10,  
    //     formatLabel: function(time) {
    //         var minutes = ( time.pick - this.get('now').pick );
    //         var label = "";
    //         var roundMinutes = Math.round(minutes);
    //         var fullHours = Math.floor(roundMinutes / 60);

    //         if (fullHours > 0) {
    //             label += fullHours + " !hours";
    //         }
            
    //         var restMinutes = Math.floor(roundMinutes % 60);
            
    //         console.log(restMinutes, roundMinutes, roundMinutes % 60);
            
    //         if (restMinutes > 0) {
    //             if (label) {
    //                 label = label + " & ";
    //             }
    //             label += restMinutes + " !m!inutes";
    //         }
            
    //         if (label) {
    //             label = "<sm!all>" + label + " from now</sm!all>";
    //         }
            
            
    //         return "h:i a " + label;
    //     }
    // });


});

$(function () {
    var curr = new Date().getFullYear();
    var opt = {
        'date': {
            preset: 'date',
            dateOrder: 'd Dmmyy',
            invalid: { daysOfWeek: [0, 6], daysOfMonth: ['5/1', '12/24', '12/25'] }
        },
        'datetime': {
            preset: 'datetime',
            minDate: new Date(2012, 3, 10, 9, 22),
            maxDate: new Date(2014, 7, 30, 15, 44),
            stepMinute: 5
        },
        'time': {
            theme: 'android-ics light',
            mode: 'scroller',
            preset: 'time'
        },
        'credit': {
            preset: 'date',
            dateOrder: 'mmyy',
            dateFormat: 'mm/yy',
            startYear: curr,
            endYear: curr + 10,
            width: 100
        },
        'btn': {
            preset: 'date',
            showOnFocus: false
        },
        'inline': {
            preset: 'date',
            display: 'inline'

        }
    };

    $('.timepicker').val('').scroller('destroy').scroller(opt['time']);
});