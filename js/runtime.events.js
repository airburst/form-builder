/* global $:false, bootbox:false, window:false */
var FB = FB || {};
var FBRun = FBRun || {};

/*======================================================================*\
  PubSub Event Handlers
  NOTE: all declared as global functions for ease of use
\*======================================================================*/

// Setup all listeners for each named event, for all subscribing controls
var subscribers = [];
$.each($("[data-event-model=sub]"), function () {
    "use strict";
    subscribers.push($(this).data("eventName"));
});

// Allocate the actions for each named event
$.each($.unique(subscribers), function (k, v) {
    "use strict";
    $.subscribe(v, function (event, data) {
       // Execute the function with same name as event
        window[v](v, data);
    });
});

// Generic event handler: publishes the event name and id of emitting control
function sendId(event) {
	"use strict";
	event.preventDefault();

	// Get id
	var id = $(this).closest("[data-id]").data("id");
	$.publish($(this).data("eventName"), id);
}

// Setup all publishers
// Convention is to add the following to event controls:
// data-event-name  = "Any-Event-Name"
// data-event-type  = "click" | "change" | etc.
// data-event-model = "pub" | "sub"
$("[data-event-type=click]").on("click", sendId);
$("[data-event-type=change]").on("change", sendId);



/*======================================================================*\
  Handler Functions
  Convention is to use the same function name as the event name
  NOTE: you cannot include hyphens in function name; only underscores
\*======================================================================*/

// Derive the value of emitting control and write to targets (subscribers)
var copyVal = function (eventName, id) {
	"use strict";
	var $sourceGroup = $("[data-id=" + id + "]");
	var $sourceControl = $("[data-event-name=" + eventName + "]", $sourceGroup);
	var $targetControl = $("[data-event-model=sub][data-event-name=" + eventName + "]");

	// Set target val
	if ($targetControl.hasClass("form-control-static")) {
		$targetControl.text($sourceControl.val());
	}
	else {
		$targetControl.val($sourceControl.val());
	}
};


// Parse TableGroup data and update a select control
var copyRowToSelect = function (eventName, id) {
	"use strict";
	var $sourceGroup = $("[data-id=" + id + "]");
	//var $sourceControl = $("[data-event-name=" + eventName + "]", $sourceGroup);
	var $targetControl = $("[data-event-model=sub][data-event-name=" + eventName + "]");

	// Data will be a stringified array
	var dataString = FBRun.tablegroup.getData($("table", $sourceGroup));
		
	// Parse the array and extract columns
	var dataObject = JSON.parse(dataString);
	var data = dataObject.data;
	var options = [];
	$.each(data, function(rowId, row) {
		// We expect rowid=[0]; name=[1];
		options.push( {"text": row[1], "value": row[0]} );
	});

	// Update the target select(s)
	FB.utils.updateSelect($targetControl, options);
};


// Custom for BCC A&F
function getFormName () {
	"use strict";
    var fn = FB.utils.getUrlParameter("type").toLowerCase();
    switch (fn) {
        case "adoption":
            return "Adoption Enquiry";
        case "fostering":
            return "Fostering Enquiry";
        case "":
            return "Adoption and Fostering Enquiry";
    }
}


// Add $.filter function
if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun /*, thisp */) {
	  "use strict";

	  if (this === void 0 || this === null) { throw new TypeError(); }
	  var t = Object(this);
	  var len = t.length >>> 0;
	  if (typeof fun !== "function") { throw new TypeError(); }
	  var res = [];
	  var thisp = arguments[1];
	  for (var i = 0; i < len; i++) {
	    if (i in t) {
	      var val = t[i]; // in case fun mutates this
	      if (fun.call(thisp, val, i, t)) { res.push(val);}
	    }
	  }

	  return res;
	};
}
