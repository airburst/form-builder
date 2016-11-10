/* global 
    $:false,
    jQuery:false,
    bootbox:false
*/

var FB = FB || {};

(function($) {
    "use strict";
    $.GetLatestVersion = function() {
        this.init();
    };
})(jQuery);

jQuery.support.cors = true;

// Properties
$.GetLatestVersion.prototype = {

    options: {
        url: "http://www.fairhursts.net/packages/getLatest.php",
        project: "formbuilder",
        proxy: "",
        selector: $("li.dropdown:first")
    },

    init: function(options) {
        "use strict";
        var self = this;

        self.status = "";

        if (options !== undefined) {
            $.each(options, function(k, v) {
                self.options[k] = v;
            });
        }
        return self;
    },

    // Don't update the results object
    update: function(options) {
        "use strict";
        var self = this;

        if (options !== undefined) {
            $.each(options, function(k, v) {
                self.options[k] = v;
            });
        }
        return self;
    },

    // Compare version numbers e.g. "0.5.10"
    // Return 1 if a > b
    // Return -1 if a < b
    // Return 0 if a == b
    compare: function (a, b) {
        "use strict";
        if (a === b) {
           return 0;
        }

        var aParts = a.split(".");
        var bParts = b.split(".");

        var len = Math.min(aParts.length, bParts.length);

        // loop while the components are equal
        for (var i = 0; i < len; i++) {
            // A bigger than B
            if (parseInt(aParts[i]) > parseInt(bParts[i])) {
                return 1;
            }

            // B bigger than A
            if (parseInt(aParts[i]) < parseInt(bParts[i])) {
                return -1;
            }
        }

        // If one's a prefix of the other, the longer one is greater.
        if (aParts.length > bParts.length) {
            return 1;
        }

        if (aParts.length < bParts.length) {
            return -1;
        }

        // Otherwise they are the same.
        return 0;
    },

    writeResponse: function(data) {      
        "use strict";
        var self = this;

        // Get version number and url
        var d = JSON.parse(data);
        var serverVersion = d.version;
        var serverUrl = d.url;
        var versionInfo = (d.info !== undefined) ? d.info : "No version information supplied.";

        // Write update message back to form
        // Create the message
        var msg = "<li><a class=\"version-update\" href=\"" + serverUrl + "\" data-container=\"body\" data-toggle=\"popover\" data-placement=\"bottom\" data-content=\"" + versionInfo + "\" data-trigger=\"hover\" data-original-title=\"What's in version " + serverVersion + "\">Version " + serverVersion + " available</a></li>";

        // Update
        if ((serverVersion !== undefined) && (self.compare(serverVersion, FB.version) === 1)) {
            if ((self.options.selector !== undefined) && (self.options.selector !== "")) {
                // Update the element with message
                self.options.selector.before(" " + msg);

                // Trigger the popover
                $(".version-update").popover();
            }
            else {
                //Show an alert
                bootbox.alert(msg);
            }
        }

        return self;
    },

    writeError: function(data) {        
        "use strict";      
        var self = this;

        // Log the error
        var msg;
        if (data !== undefined) {
            var d = JSON.parse(data);
            msg = self.status + "\n\nError Type: " + d.type + "\n\nError Code: " + d.code + "\n\nDetails:\n" + d.developerMessage;            
        }
        else {
            msg = self.status + ": there was a problem reaching the latest version service.";
        }
        bootbox.alert(msg);
        return self;
    },

    send: function(callback) {
        "use strict";
        var self = this;

        // Establish url
        var url = (self.options.proxy !== "") ? self.options.proxy + encodeURIComponent(self.options.url + "?project=" + self.options.project) : self.options.url + "?project=" + self.options.project;

        // POST using Ajax
        var jqxhr = $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            async: false,
            success: function(xhr) { 
                self.status = "Success";
                var r = (jqxhr !== undefined) ? jqxhr.responseText : JSON.stringify(xhr);
                self.response = r;
                // Callbacks
                self.writeResponse(self.response);
                if (callback !== undefined) { callback(); }
            },
            error: function(xhr) { 
                self.status = "Error";
                self.response = xhr.message; 
                // Callback the error
                self.writeError(self.response);
            },
            fail: function(xhr) { 
                self.status = "Fail"; 
                self.response = xhr.message; 
                // Callback the fail
                self.writeError(self.response);
            }
        });
        return self;
    },

    // Initialise and execute a calculation request
    getLatest: function(options, callback) {
        "use strict";
        var self = this;

        // Update settings
        if (options !== undefined) { self.update(options); }

        if (callback !== undefined) {
            self.send(callback);
        }
        else {
            self.send(); 
        }
    }
};

/* ====================================================================================
// Instantiate
var ver = new $.GetLatestVersion;

// Set options individually
ver.options.project = "formbuilder";

// Or as part of the verulation request
// In init()
ver.init({
    url: "",        Url to web service
    project: "",    Project folder (formbuilder)
    proxy: "",      Server-hosted proxy url, to overcome CORS issues.  Empty by default.
    selector:       jQuery selector for element to update with version info
}).getLatest();

// Or getLatest(options, [callback])
// Optionally set a custom callback function as a second argument
// The standard writeResponse function is always invoked first
ver.getLatest({project:"formbuilder"}, myCallback);
==================================================================================== */
var ver = new $.GetLatestVersion();

/*ver.getLatest({project:"formbuilder"});*/