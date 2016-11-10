/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/
var FB = FB || {};
var FBRun = FBRun || {};

(function ($) {
    "use strict";
    $.Calculon2 = function (options) {
        this.init(options);
    };
})(jQuery);

jQuery.support.cors = true;

// Properties
$.Calculon2.prototype = {

    defaults: {
        user: "airburst8+salesdesigner@gmail.com",
        pass: "C0mmun1c8#R",
        url: "https://46.245.248.9/calcengine/rest/rasCalculation",
        proxy: "/ServiceHandlers/GenericHandler.ashx",
        successUrl: "",
        model: "Test",
        environment: "Test",
        formContainer: $(".form-fb")
    },

    init: function (options) {
        "use strict";
        var self = this;

        self.request = "";
        self.response = "";
        self.status = "";
        self.responseTime = 0.0;
        self.results = [];

        self.options = $.extend({}, self.defaults, options);
        return self;
    },

    // Don't update the results object
    update: function (options) {
        "use strict";
        var self = this;
        self.options = $.extend({}, self.defaults, options);
        return self;
    },

    time: function () {
        "use strict";
        return new Date().getTime();
    },

    duration: function (start, end) {
        "use strict";
        var duration = (end - start) / 1000;
        return duration;
    },

    validateElement: function ($control) {
        "use strict";
        var blackList = [
            "__",
            "ctl00",
            "ddlViewPort",
            "txtKeyWord",
            "txtFeedback",
            "hidOrganisationId",
            "hidUserId",
            "hidEktronId"
        ],
            good = true,
            id = $control.attr("id");

        if (id !== undefined) {
            $.each(blackList, function (index, item) {
                if (id.indexOf(item) > -1) { good = false; }
            });
        }
        return good;
    },

    // Get all inputs in the form
    getInputs: function () {
        "use strict";
        var self = this,
            inputs = [],
            $controls = $("input[type!=submit], select, textarea, .table-group", self.options.formContainer),
            val,
            type,
            idCol,
            id,
            n,
            checkVal,
            l;

        // Get the label and value of each control
        $.each($controls, function () {

            // Get control type
            type = ($(this).prop("type") !== undefined) ? $(this).prop("type") : "";
            if ($(this).hasClass("table-group")) { type = "tablegroup"; }

            // Ignore blacklisted controls (ASP.Net)
            if (self.validateElement($(this))) {

                // Get attributes
                id = $(this).attr("id");
                n = $(this).attr("name");

                // Tables
                if (type === "tablegroup") {
                    val = FBRun.tablegroup.getData($(this));
                    n = id;
                    idCol = $(this).data("idcol");
                } else {
                    if (n !== undefined) {
                        // Get label
                        l  = (n.indexOf("$") > -1) ? "" : $.trim($("label[for=" + n + "]").text());

                        // Remove mandatory asterisks
                        l = l.replace(" *", "");

                        // Special case for radios and checkboxes;
                        // We must store the control name once and the correct value(s)
                        switch (type) {
                        case "radio":
                            // Only store the name once and use the checked value
                            if ((inputs.length === 0) || (inputs[inputs.length - 1].name !== n)) {
                                val = $("input[name=" + n + "]:checked").val();
                                if (val === undefined) { val = ""; }
                            }
                            break;

                        case "checkbox":
                            // Only store the name once, but append each checked value into a csv list          
                            if ((inputs.length === 0) || (inputs[inputs.length - 1].name !== n)) {
                                // Convert all checked values into CSV list
                                checkVal = [];
                                $.each($("input[name=" + n + "]:checked"), function () {
                                    checkVal.push($(this).val());
                                });

                                // Calc engine V1.3 does not handle CSV lists - return empty value
                                //val = JSON.stringify(checkVal);
                                val = "";
                            }
                            break;

                        default:
                            // Get the value and append
                            val = $(this).val();
                            break;
                        }
                    }
                }
                if (val !== undefined) {
                    // If value is an array (e.g. Multi-Select) then add flag
                    if ($.isArray($(this).val())) {
                        inputs.push({id: id, type: type, name: n, label: l, val: val, array: true});
                    } else {
                        // Add to inputs array
                        if (idCol !== undefined) {
                            inputs.push({id: id, type: type, name: n, label: l, val: val, idcol: idCol});
                        } else {
                            inputs.push({id: id, type: type, name: n, label: l, val: val});
                        }
                    }
                }
            }
        });

        return inputs;
    },

    // Check that an array of values is not "empty"
    // i.e. contains anything other than 0,. or quotes
    validRow: function (row) {
        "use strict";
        var result = false;
        row.forEach(function (item) {
            // Pad out any gaps with empty string
            if (item === undefined) { item = ""; }

            if ((item !== "") && (parseInt(item, 10) !== 0)) {
                result = true;
            }
        });
        return result;
    },

    // Converts stringified json table data format
    // into Calculon name-value format
    convertTableDataToCalculon: function (data, includeRowId) {
        "use strict";
        // Establish whether to return row[0] (row id)
        if (includeRowId === undefined) { includeRowId = false; }

        var j = JSON.parse(data),
            converted = "{\"_type\":\"NewTableCalculationParameter\", \"name\":\"" + j.name + "\",",
            tableData = [];

        // If we want to keep rowid (row[0]) then just use the data object
        if (includeRowId) {
            converted += "\"data\":" + JSON.stringify(j.data) + "}";
        } else {
            // Else we have to remove item 0 from each row
            tableData = [];
            $.each(j.data, function (rowIndex, row) {
                row.splice(0, 1);
                tableData.push(row);
            });
            converted += "\"data\":" + JSON.stringify(tableData) + "}";
        }
        return converted;
    },

    // And the opposite transformation
    // Assumes that data is sorted before processing and converted to a json object
    convertCalculonToTableData: function (object) {
        "use strict";
        var self = this,
            table = [],
            row = [],
            lastRow = 1,
            slip = 0;   // Special case for table hhin, in which we ignore first column

        // Each array will have 5 elements [name, val, type, row, col]
        // Reduce the array from [row, col, val] to [val, val, ...]
        $.each(object, function (k, v) {
            // If row doesn't match we have a new row
            if ((k > 0) && (lastRow !== v[3])) {
                // Establish whether row is "empty", i.e. only contains 0, or .
                if (self.validRow(row)) { table.push(row); }
                row = [];
            }
            // Add item into row array, in correct position
            if ((v[4]) >= slip) { row[(v[4])] = v[1]; }

            lastRow = v[3];
        });
        // Catch the last row
        if (self.validRow(row)) { table.push(row); }
        return ({name: object[0][0], val: table, type: "table"});
    },

    // Convert input values into a Calculon request
    createRequest: function () {
        "use strict";
        var self = this,
            request = "",
            inputs = self.getInputs(),
            sendId;

        $.each(inputs, function (k, v) {
            // Test for array input
            if (v.type === "tablegroup") {
                var idcol = (v.idcol !== undefined) ? true : false;
                request += self.convertTableDataToCalculon(v.val, idcol);
                if (k < (inputs.length - 1)) { request += ","; }
            } else {
                // Scalar
                if ((v.val !== "") && (v.val !== null)) {
                    // For radios and checkboxes, use the name and not the id       
                    // Note: Need to handle multi-checkbox and select values better!
                    sendId = v.id;
                    if ((v.type === "radio") || (v.type === "checkbox")) { sendId = v.name; }

                    request += "{\"_type\": \"NewScalarCalculationParameter\",";
                    request += "\"name\":\"" + sendId + "\",";
                    request += "\"value\":\"" + v.val + "\"}";

                    if (k < (inputs.length - 1)) { request += ","; }
                }
            }
        });

        // Clean up trailing comma
        if (request.charAt(request.length - 1) === ",") { request = request.substring(0, request.length - 1); }

        return request;
    },

    // Sort the response items alphanumerically
    sortResponse: function (data) {
        "use strict";
        var l = [];
        $.each(data, function (k, v) {
            // Test whether item is part of a tabular array
            if (v._type === "TableCalculationParameter") {
                l.push({name: v.name, val: v.data, type: "table"});
            } else {
                l.push({name: $.trim(v.name), val: $.trim(v.value), type: ""});
            }
        });
        return l;
    },

    writeResponse: function (data) {
        "use strict";
        var self = this,
            d,
            list;

        self.results.push({"status": self.status, "req": self.request, "res": self.response, "time": self.responseTime});

        // Sort into [key, value] or [key, data] array
        d = JSON.parse(data);
        list = self.sortResponse(d.outputValues);

        // Write values back to form
        $.each(list, function (k, v) {
            // Select the named control
            var con = $("[id=" + v.name + "]");

            // Test for Table           
            if (v.type === "table") {
                if (v.val.length > 0) {
                    // Set table value from array                   
                    FBRun.tablegroup.setData(con, v.val);
                }
            } else {
                // Set scalar value
                con.val(v.val);
            }
        });
        return self;
    },

    writeError: function (data) {
        "use strict";
        var self = this,
            d,
            msg;

        self.results.push({"status": self.status, "req": self.request, "res": self.response, "time": self.responseTime});

        // Log the error
        d = JSON.parse(data);
        msg = self.status + "\n\nError Type: " + d.type + "\n\nError Code: " + d.code + "\n\nDetails:\n" + d.developerMessage;
        bootbox.alert(msg);
        return self;
    },

    send: function (callback) {
        "use strict";
        var self = this,
            reqTime = self.time(),  // Request started
            urlParams,
            url,
            jqxhr;

        FB.utils.showSpinner();

        // Establish url
        urlParams = self.options.url + "?calcEnvironmentName=" + self.options.environment + "&modelName=" + self.options.model;
        url = (self.options.proxy !== "") ? self.options.proxy + "?url=" + encodeURIComponent(urlParams) : urlParams;

        // POST using Ajax
        jqxhr = $.ajax({
            type: "POST",
            url: url,
            data: self.request,
            headers:  { "Authorization": "Basic " + window.btoa(self.options.user + ":" + self.options.pass) },
            dataType: "json",
            contentType: "application/json",
            async: false,
            success: function (xhr) {
                self.responseTime = self.duration(reqTime, self.time());
                self.status = "Success";
                var r = (jqxhr !== undefined) ? jqxhr.responseText : JSON.stringify(xhr);
                self.response = r;
                FB.utils.hideSpinner();
                // Callbacks
                self.writeResponse(self.response);
                if (callback !== undefined) { callback(); }
                // Redirect
                if (self.options.successUrl !== "") { window.location = self.options.successUrl; }
            },
            error: function (xhr) {
                self.responseTime = self.duration(reqTime, self.time());
                self.status = "Error";
                self.response = xhr.message;
                FB.utils.hideSpinner();
                // Callback the error
                self.writeError(self.response);
            },
            fail: function (xhr) {
                self.responseTime = self.duration(reqTime, self.time());
                self.status = "Fail";
                self.response = xhr.message;
                FB.utils.hideSpinner();
                // Callback the fail
                self.writeError(self.response);
            }
        });
        return self;
    },

    // Initialise and execute a calculation request
    calculate: function (options, callback) {
        "use strict";
        var self = this,
            verify = true,
            req = "";

        // Use model if set
        if (options !== undefined) { self.update(options); }

        // Verify that we have enough data to send
        if (self.options.model === "") {
            verify = false;
            console.log("Calculation model not defined");
        } else {
            // Create request
            req = "{\"_type\": \"NewRasRequest\",";
            req += "\"rasModelVO\": {\"_type\":\"NewRasModel\",\"modelVersionId\": 0},";
            req += "\"inputValues\": [" + self.createRequest() + "]}";
            self.request = req;

            if (verify) {
                if (callback !== undefined) {
                    self.send(callback);
                } else {
                    self.send();
                }
            }
        }
    }
};

/* ====================================================================================
// Instantiate
var calc = new $.Calculon2;

// Set options individually
calc.options.model = "NI Calc";

// Or as part of the calculation request
// In init()
calc.init({
    user: "mark",
    pass: "****",
    url: "http://slgdicm02.group.olm.int:8080/rasmanager/rest/rasCalculation",
    model: "NI Calc",
    environment: "Test Environment"
}).calculate();

// Or calculate(options, [callback])
// Optionally set a custom callback function as a second argument
// The standard writeResponse function is always invoked first
calc.calculate({model:"Test Model"}, myCallback);
==================================================================================== */
var calc2 = new $.Calculon2();

/*calc2.calculate({'model':'Simple Lookup', 'proxy':''});*/