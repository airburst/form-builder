/*global $, jQuery, FB, bootbox, calc, alert*/

// Declare runtime namespace
var FBRun = FBRun || {};

/*======================================================================*\
  Standard Form Actions: Next, Back, Submit
\*======================================================================*/
FBRun.dates = (function () {
    "use strict";

    var writeAge = function (date, $ageCon) {
        if (date !== "") {

            var year = date.substr(6, 4),
                month = date.substr(3, 2),
                day = date.substr(0, 2),
                now  = new Date(),
                dob = new Date(),
                diff,
                age;

            // Calculate Age    
            dob.setFullYear(year, month, day);
            diff = Math.abs(now - dob);
            age  = Math.floor(diff / 31536000000);  // Convert milliseconds to years

            // Write to age element
            $ageCon.val(age);
        }
    },

        applyDatePickers = function () {
            var nowDate = new Date(),
                today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);

            // Basic datepicker
            $(".datepicker").datepicker({
                "format": "dd/mm/yyyy"
            }).on("changeDate", function () {
                // Close the picker if a day was selected
                $(this).datepicker("hide");
            });

            // Future datepicker
            $(".datepicker-future").datepicker({
                "format": "dd/mm/yyyy",
                "startDate": today
            }).on("changeDate", function () {
                // Close the picker if a day was selected
                $(this).datepicker("hide");
            });

            // DOB (age) datepicker
            $(".datepicker-dob").datepicker({
                "format": "dd/mm/yyyy",
                "startView": "decade",
                "keyboardNavigation": false
            }).on("changeDate", function () {
                // Close the picker
                $(this).datepicker("hide");
            });

            $(".datepicker-dob").on("change", function () {
                // Parse date parts from string dd/mm/yyyy
                var d = $(this).val(),
                    c = $(this).attr("id") + "age",
                    $c = $("#" + c),
                    a = FB.utils.idByElement($c);
                writeAge(d, $c);

                // Trigger any vis rules on age control
                FBRun.vis.evaluate(a);

                $(this).datepicker("hide");
            });
        };

    // Public methods
    return {
        applyDatePickers: applyDatePickers
    };

}());
