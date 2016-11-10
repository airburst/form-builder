/* global 
    $:false,
    jQuery:false
*/
(function($) {
    "use strict";
    $.BugAPI = function() {
        this.init();
    };
})(jQuery);

// Properties
$.BugAPI.prototype = {

    options: {
        url: "http://www.fairhursts.net/apis/feedback/update.php",
        system: "Shelter",
        successPage: document.referrer
    },

    init: function(options) {
        "use strict";
        var self = this;

        self.request = "";
        self.response = "";
        self.status = "";
        self.responseTime = 0.0;
        self.results = [];

        if (options !== undefined) {
            $.each(options, function(k, v) {
                self.options[k] = v;
            });
        }
        return self;
    },

    writeBack: function(data) {
        "use strict";
        var self = this;

        // Show success message
        hideSpinner();

        bootbox.dialog({
          message: "Thank you: we have received your feedback.",
          title: "Message Sent",
          buttons: {
            success: {
              label: "Return to form",
              className: "btn-success",
              callback: function () {
                /*if (self.successPage !== "") { window.location = self.successPage; }*/
                window.close();
              }
            }
          }
        });     
        
        return self;
    },

    items: function() {
        "use strict";
        var self = this;

        var json = "{\"system\":\"" + self.options.system + "\",\"type\":\"" + $("#type").val() + "\",\"description\":\"" + self.jsonEscape($("#description").val()) + "\"}";
        // All inputs in form
        /*var len = $("input, textarea, select").length;
        $.each($("input, textarea, select"), function(k, v) {
            json += v.name + ": " + $(this).val();
            if (k < (len - 1)) { json += ","; }
        });*/
        return json;
    },

    send: function(callback) {
        "use strict";
        var self = this; 

        showSpinner();

        // POST using Ajax
        var jqxhr = $.ajax({
            type: "POST",
            url: self.options.url,
            data: {json: self.items()},
            dataType: "json",
            success: function() { 
                hideSpinner();
                self.writeBack(jqxhr.responseText);
                if (callback !== undefined) { callback(); }
            },
            error: function() {  
                hideSpinner();
                bootbox.alert(jqxhr.responseText); 
            },
            fail: function(){ 
                hideSpinner();
                bootbox.alert(jqxhr.responseText);  
            }
        });

        return self;
    },

    jsonEscape: function(str)  {
        "use strict";
        return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
    }
};

/* ====================================================================================
    // Instantiate
    var feedback = new $.BugAPI();

    // Set model and request manually
    feedback.options.url = "http://my-api";

    feedback.send();

    // Optionally, set a custom callback function which accepts the stringified json response
    feedback.send({url: "http://my-api"}, callback);
==================================================================================== */
var feedback = new $.BugAPI();
