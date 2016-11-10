/* global $:false, jQuery:false */
(function ($) {
    "use strict";
    $.Capscan = function () {
        this.init();
    };
})(jQuery);

jQuery.support.cors = true;

$.Capscan.prototype = {

    defaults: {
        url: "http://www.capscanondemand.com/capscanondemand/capscanondemand.asmx",
        soapAction: "http://www.capscanondemand.com/CapscanOnDemand/CapscanOnDemand/query",
        //proxy: "/ServiceHandlers/GenericHandler.ashx",
        proxy: "server/proxy.php",
        successUrl: "",
        successMessage: "Your information has been saved.  Thank you for completing this form.",
        errorMessage: "There is a problem and we are unable to search for this address.  Please contact us and we will resolve this issue.",
        failMessage: "There is a problem and we are unable to search for this address.  Please contact us and we will resolve this issue.",
        messageTitle: "Thank you"
    },

    init: function (options) {
        "use strict";
        var self = this;
        self.options = $.extend({}, self.defaults, options);
        return self;
    },

    xmlTemplate: function (postcode) {
        "use strict";
        if (postcode !== undefined) {
            return [
                "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">",
                    "<SOAP-ENV:Body>",
                        "<m:query xmlns:m=\"http://www.capscanondemand.com/CapscanOnDemand/CapscanOnDemand\">",
                            "<m:cc>0F31E14B-6742-413A-9D89-209914EAC6D9</m:cc>",
                            "<m:ac>C1004</m:ac>",
                            "<m:AmbiguityId></m:AmbiguityId>",
                            "<m:Lookfor>" + postcode + "</m:Lookfor>",
                            "<m:MaxReturns/>",
                            "<m:DSGID>1</m:DSGID>",
                            "<m:FieldList/>",
                            "<m:ParamList>LISTMODE=4</m:ParamList>",
                            "<m:sAppID/>",
                        "</m:query>",
                    "</SOAP-ENV:Body>",
                "</SOAP-ENV:Envelope>"
                ].join("");    
        }
        else {
            return false;
        }
    },

    warning: function (message) {
        "use strict";
        var self = this; 
        window.bootbox.dialog({
            message: message,
            title: self.options.messageTitle,
            buttons: {
                success: {
                    label: "OK",
                    className: "btn-success",
                    callback: function() {
                        if (self.options.successUrl !== "") { window.location = self.options.successUrl; }
                    }
                }
            }
        });
    },

    writeBack: function (data, status) {
        "use strict";
        var self = this;

        var message = "";
        switch(status) {

            case "Error":
                message = self.options.errorMessage;
                self.warning(message);
                break;

            case "Fail":
                message = self.options.failMessage;
                self.warning(message);
                break;

            case "Success":
                message = self.options.successMessage;
                // Process the data
                console.log(data);
                break;
        }

        return self;
    },

    search: function (postcode, options) {
        "use strict";
        var self = this;

        if (options !== undefined) { self.init(options); }

        var url = (self.options.proxy  !== "") ? self.options.proxy + "?url=" + self.options.url : self.options.url ;

        // POST using Ajax
        var jqxhr = $.ajax({
            type: "POST",
            url: url,
            data: self.xmlTemplate(postcode),
            contentType: "text/xml; charset=utf-8",
            dataType: "xml",
            headers: {
                SOAPAction: self.options.soapAction
            },
            success: function (xml) {
               /* $(xml).find("members").each(function () {
                    var name = $(this).find("name").text();
                });*/
console.log(xml);
            },
            error: function (xhr) { 
                self.writeBack(xhr.statusText, "Error"); 
            },
            fail: function (xhr){ 
                self.writeBack(xhr.statusText, "Fail");  
            }
        });
    }
};

/* ====================================================================================
// Instantiate
var address = new $.Capscan();

address.init({url: "http://my-url/"}).search();

// Or 
address.search(url: "http://my-url/"});
==================================================================================== */
var address = new $.Capscan();
