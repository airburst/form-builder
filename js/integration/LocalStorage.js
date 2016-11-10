/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/
var FB = FB || {};
var FBRun = FBRun || {};

(function($) {
    "use strict";
    $.LocalStorage = function(options) {
        this.init(options);
    };
})(jQuery);

jQuery.support.cors = true;

$.LocalStorage.prototype = {

    defaults: {
        url: "http://apiv32.mylifetest.co.uk/api/forms",
        proxy: "/ServiceHandlers/GenericHandler.ashx",
        formName: "General Enquiry",
        description: "",
        successUrl: "",
        orgId: $("#hidOrganisationId").val() || "",
        userId: $("#hidUserId").val() || 0,
        formContainer: $(".form-fb"),
        successMessage: "Your information has been saved.  Thank you for completing this form.",
        errorMessage: "There is a problem and we are unable to save your information.  Please contact us and we will resolve this issue.",
        failMessage: "There is a problem and we are unable to save your information.  Please contact us and we will resolve this issue.",
        messageTitle: "Thank you",
        taskUrl: "/Secure/Account/TaskHandler.ashx",
        userGuid: $("#hidMembershipId").val() || "",
        hubId: $("#hubId").val() || ""
    },

    init: function(options) {
        "use strict";
        var self = this;

        // Use form endpoint if one exists in DOM
        if ($("#webApiUrl").val() !== undefined) { self.defaults.url = $("#webApiUrl").val(); }

        self.options = $.extend({}, self.defaults, options);
        return self;
    },

    validateElement: function($control) {
        "use strict";
        var blackList = [
            "__",
            "ctl00",
            "ddlViewPort",
            "txtKeyWord",
            "txtFeedback",
            "hidOrganisationId",
            "hidUserId",
            "hidEktronId",
            "hidMembershipId",
            "webApiUrl",
            "hidContactEmail",
            "hubId"
        ],

            good = true,
            id = $control.attr("id");

        if (id !== undefined) {
            $.each(blackList, function(index, item) {
                if (id.indexOf(item) > -1) { good = false; }
            });
        }
        return good;
    },

    getInputs: function() {
        "use strict";
        var self = this,
            inputs = [],
            $controls = $("input[type!=submit], select, textarea, .table-group", self.options.formContainer);

        // Get the label, value, text of each control
        $.each($controls, function() {
            var val, text, type, idCol, id, n, qId;

            // Get control type
            type = ($(this).prop("type") !== undefined) ? $(this).prop("type") : "";
            if ($(this).hasClass("table-group")) { type = "tablegroup"; }

            // Ignore blacklisted controls (ASP.Net)
            if (self.validateElement($(this))) {

                // Get attributes
                id = $(this).attr("id");
                n = $(this).attr("name");
                qId = $(this).closest("[data-id]").attr("data-integration");

                // Tables
                if (type === "tablegroup") {
                    val = FBRun.tablegroup.getData($(this));
                    text = val;
                    n = id;
                    idCol = $(this).data("idcol");
                } else {
                    if (n !== undefined) {
                        // Get label
                        var l = (n.indexOf("$") > -1) ? "" : $.trim($("label[for=" + n + "]").text());

                        // Remove mandatory asterisks
                        l = l.replace(" *", "");

                        // Special case for radios and checkboxes;
                        // We must store the control name once and the correct value(s)
                        switch (type) {
                        case "radio":
                            // Only store the name once and use the checked value
                            if ((inputs.length === 0) || (inputs[inputs.length - 1].name !== n)) {
                                val = $("input[name='" + n + "']:checked").val();
                                if (val === undefined) { val = ""; }

                                text = $.trim($("input[name='" + n + "']:checked").closest("label").text());
                                if (text === undefined) { text = ""; }
                            }
                            break;

                        case "checkbox":
                            // Only store the name once, but append each checked value into a csv list          
                            if ((inputs.length === 0) || (inputs[inputs.length - 1].name !== n)) {
                                // Convert all checked values into CSV list
                                var checkVal = [], textVal = [];
                                $.each($("input[name='" + n + "']:checked"), function() {
                                    checkVal.push($(this).val());
                                    textVal.push($.trim($("input[name='" + n + "']:checked").closest("label").text()));
                                });
                                val = JSON.stringify(checkVal);
                                text = JSON.stringify(textVal);
                            }
                            break;

                        case "select-one":
                            val = $(this).val();
                            text = (val === "") ? "" : $("option[value='" + val + "']", $(this)).text();
                            break;

                        default:
                            // Get the value and append
                            val = $(this).val();
                            text = val;
                            break;
                        }
                    }
                }
                if (val !== undefined) {
                    // If value is an array (e.g. Multi-Select) then add flag
                    if ($.isArray($(this).val())) {
                        inputs.push({id: id, type: type, name: n, label: l, text: text, val: val, array: true});
                    } else {
                        // Add to inputs array
                        var input = {id: id, type: type, name: n, label: l, text: text, val: val};
                        if (idCol !== undefined) { $.extend(input, {idcol: idCol}); }
                        if (qId !== undefined) { 
                            $.extend(input, {integration: qId}); 

                            // Set code if this is a radio, select or checkbox
                            if ((type === "radio") || (type === "select-one") || (type === "checkbox")) {
                                $.extend(input, {code: val});
                            }
                        }

                        inputs.push(input);
                    }                
                }
            }
        });

        return inputs;
    },

    parseInputs: function() {
        "use strict";
        var self = this;

        var request = [];
        var inputs = self.getInputs();
        $.each(inputs, function(k, v) {
            var input;

            // For radios and checkboxes, use the name and not the id       
            var qId = ((v.type === "radio") || (v.type === "checkbox")) ? v.name : v.id;
            //if ((v.type === "radio") || (v.type === "checkbox")) { label = v.name; }

            // Try to use the label
            if (v.label !== "") { 
                input = {"Id": qId, "Label": v.label, "Text": v.text, "Value": v.val}; 
            } else {
                input = {"Id": qId, "Label": v.name, "Text": v.text, "Value": v.val};
            }

            // Add integration items if present
            if (v.integration) { $.extend(input, {Integration: v.integration}); }
            if (v.code) { $.extend(input, {Code: v.code}); }

            request.push(input);
        });
        return JSON.stringify(request);
    },

    closeTask: function(taskId, userGuid) {
        "use strict";
        var self = this;

        if ((userGuid != "") && (taskId != "")) {
            var data = {
                taskId: taskId,
                status: "3",
                userId: userGuid
            };

            var jqxhr = $.ajax({
                url: self.options.taskUrl,
                type: "POST",
                data: JSON.stringify(data),
                dataType: "json",
                success: function() { 
                    if (self.options.successUrl == "") { window.location = document.referrer; }
                },
                error: function(xhr) { 
                    var r = (jqxhr !== undefined) ? jqxhr.responseText : xhr.statusText;
                    bootbox.alert("Error\n\n" + r); 
                },
                fail: function(xhr) { 
                    var r = (jqxhr !== undefined) ? jqxhr.responseText : xhr.statusText;
                    bootbox.alert("Communication Failure\n\n" + r);  
                }
            });
        }
    },

    writeBack: function(data, status, callback) {
        "use strict";
        var self = this;

        var message = "";
        switch (status) {

            case "Error":
                message = self.options.errorMessage;
                break;

            case "Fail":
                message = self.options.failMessage;
                break;

            case "Success":
                message = self.options.successMessage;

                // Close the task if we have a task id in the query string
                var taskId = FB.utils.getUrlParameter("taskid");
                if (taskId != "") { self.closeTask(taskId, self.options.userGuid); }
                break;
        }

        FB.utils.hideSpinner();

        window.bootbox.dialog({
            message: message,
            title: self.options.messageTitle,
            buttons: {
                success: {
                    label: "OK",
                    className: "btn-success",
                    callback: function() {
                        // Completed form action, e.g.
                        if (callback !== undefined) { 
                            callback(); 
                        } else {
                            if (self.options.successUrl !== "") { window.location = self.options.successUrl; } 
                        }
                    }
                }
            }
        });     
    
        return self;
    },

    store: function(options, callback) {
        "use strict";
        var self = this;

        if (options !== undefined) { self.init(options); }
        FB.utils.showSpinner();
        var inputData = self.parseInputs();

        // Build request
        var formData = {
            OrganisationId: self.options.orgId,
            FormName: self.options.formName,
            Description: self.options.description,
            UserId: (self.options.userId !== undefined) ? self.options.userId : 0,
            HubId: self.options.hubId,
            Data: inputData
        };

        // Establish url
        var url = (self.options.proxy !== "") ? self.options.proxy + "?url=" + encodeURIComponent(self.options.url) : self.options.url;

        // POST using Ajax
        var jqxhr = $.ajax({
            type: "POST",
            url: url,
            data: formData,
            dataType: "json",
            success: function(xhr) { 
                FB.utils.hideSpinner();
                var r = (jqxhr !== undefined) ? jqxhr.responseText : xhr;
                self.writeBack(r, "Success", callback);
            },
            error: function(xhr) { 
                FB.utils.hideSpinner();
                self.writeBack(xhr.statusText, "Error"); 
            },
            fail: function(xhr) { 
                FB.utils.hideSpinner();
                self.writeBack(xhr.statusText, "Fail");  
            }
        });
    }
};

/* ====================================================================================
// Instantiate
var ls = new $.LocalStorage();

// Set options individually
ls.options.formName = "General Enquiry";

// Or as part of the calculation request
// In init()
ls.init({
    userId: GUID,
    url: "http://my-url/"
}).store();

// Or ls.store(options, [callback])
// Optionally set a custom callback function as a second argument
// The standard writeResponse function is always invoked first
ls.store({formName:"Test Form"}, myCallback);
==================================================================================== */
var ls = new $.LocalStorage();

/*var asmt = new $.LocalStorage(), dd = {
    OrganisationId: asmt.options.orgId,
    FormName: asmt.options.formName,
    Description: asmt.options.description,
    UserId: (asmt.options.userId !== undefined) ? asmt.options.userId : 0,
    hubId: asmt.options.hubId,
    Data: asmt.parseInputs()
};
submitAssessment(dd);*/
