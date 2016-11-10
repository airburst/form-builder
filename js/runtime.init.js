var FB = FB || {};
var FBRun = FBRun || {};

/*======================================================================*\
  Initialise form
\*======================================================================*/
FBRun.init();

// Apply Affix to sidenav
// $(".sidenav").affix({
//     offset: {
//         top: 100,
//         bottom: function () {
//             "use strict";
//             this.bottom = $(".footer").outerHeight(true);
//         }
//     }
// });

// Remove affix in Bootstrap 3
// $(window).off('.affix')
// $('.sidenav').removeData('bs.affix').removeClass('affix affix-top affix-bottom')

// Helper jQuery function
// Lets you use $(selector).toCurrency();
// Removes leading pound sign
$.fn.toCurrency = function() {
    'use strict';
    var amount = FB.utils.currencyTest(this.val());
    this.val(amount.substring(8));
    return this;
};

// Set height of first page
FBRun.nav.setHeight();
