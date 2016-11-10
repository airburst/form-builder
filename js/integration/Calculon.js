/* global 
    $:false,
    jQuery:false
*/
var FB = FB || {};
var FBRun = FBRun || {};

(function($) {
    "use strict";
    $.Calculon = function (options) {
        this.init(options);
    };
})(jQuery);

jQuery.support.cors = true;

// Properties
$.Calculon.prototype = {

    defaults: {
        url: "http://calculon.olmdemo.co.uk/calc/ws/calcService.cfc?method=calculate",
        proxy: "/ServiceHandlers/GenericHandler.ashx",
        successUrl: "",
        model: "",
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
        ];

        var good = true;
        var id = $control.attr("id");
        if (id !== undefined) {
          $.each(blackList, function(index, item) {
            if (id.indexOf(item) > -1) {
              good = false;
            }
          });
        }
        return good;
      },

    // Get all inputs in the form
    getInputs: function () {
        "use strict";
        var self = this;
        var inputs = [];
        var $controls = $("input[type!=submit], select, textarea, .table-group", self.options.formContainer);

        // Get the label and value of each control
        $.each($controls, function () {
            var val, type, idCol;

            // Get control type
            type = ($(this).prop("type") !== undefined) ? $(this).prop("type") : "";
            if ($(this).hasClass("table-group")) { type = "tablegroup"; }

            // Ignore blacklisted controls (ASP.Net)
            if (self.validateElement($(this))) {

                // Get attributes
                var id = $(this).attr("id");
                var n = $(this).attr("name");

                // Tables
                if (type === "tablegroup") {
                    val = FBRun.tablegroup.getData($(this));
                    n = id;
                    idCol = $(this).data("idcol");
                } else {
                    if (n !== undefined) {
                        // Get label
                        var l  = (n.indexOf("$") > -1) ? "" : $.trim($("label[for=" + n + "]").text());

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
                                var checkVal = [];
                                $.each($("input[name=" + n + "]:checked"), function() {
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
                    if ($.isArray($(this).val())){
                        inputs.push({id: id, type: type, name: n, label: l, val: val, array: true});
                    }
                    else{
                        // Add to inputs array
                        if (idCol !== undefined) {
                            inputs.push({id: id, type: type, name: n, label: l, val: val, idcol: idCol});
                        }
                        else {
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
    validRow: function(row) {
        "use strict";
        var result = false;
        $.each(row, function(k, item) {
            // Pad out any gaps with empty string
            if (item === undefined) { item = ""; }      

            if ((item !== "") && (parseInt(item) !== 0)) {
                result = true;
            }
        }); 
        return result;
    },

    // Converts stringified json table data format
    // into Calculon name-value format
    convertTableDataToCalculon: function(data, includeRowId) {
        "use strict";
        // Establish whether to return row[0] (row id)
        if (includeRowId === undefined) { includeRowId = false; }
        var shift = 0;
        if (includeRowId) { shift = 1; }

        var j = JSON.parse(data);
        var converted = "";
        // Convert into json format {"tablename-rX-cY": "val", .. }
        // This uses 1-based arrays
        $.each(j.data, function(rowIndex, row) {
            $.each(row, function(colIndex, col) {
                if (col !== "") {
                    var name = j.name + "-r" + (rowIndex + 1) + "-c" + (colIndex + shift);
                    converted += "\"" + name + "\":\"" + col + "\",";
                }       
            });
        });
        return converted;
    },

    // And the opposite transformation
    // Assumes that data is sorted before processing and converted to a json object
    convertCalculonToTableData: function(object) {
        "use strict";
        var self = this;
        // Reduce the array from [row, col, val] to [val, val, ...]
        var table = [], row = [];
        var lastRow = 1;

        // Special case for table hhin, in which we ignore first column
        var slip = 0; //TODO:

        // Each array will have 5 elements [name, val, type, row, col]
        $.each(object, function(k, v) {
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
    parseInputs: function() {
        "use strict";
        var self = this;
        var request = "";
        var inputs = self.getInputs();

        $.each(inputs, function(k, v) {
            if (v.type === "tablegroup") {
                // List of tables that need to send id column     //MF this is specific to Shelter      
                if (v.id === "hhin") { 
                    request += self.convertTableDataToCalculon(v.val, true); 
                }
                else {
                    request += self.convertTableDataToCalculon(v.val);
                }
            }
            else {
                if ((v.val !== "") && (v.val !== null)) { 
                    // For radios and checkboxes, use the name and not the id       
                    // TODO! Need to handle multi-checkbox and select values better!
                    var sendId = v.id;
                    if ((v.type === "radio") || (v.type === "checkbox")) { sendId = v.name; }
                    request += "\"" + sendId + "\" : \"" + v.val + "\""; 
                    if (k < (inputs.length - 1)) { request += ","; }
                }
            }
        });
        return request;
    },

    // Parse row and col integers from table keys to sort properly
    parseTableKey: function(key, val) {
        "use strict";
        // Split the key into parts name-rX-cY
        var parts = key.split("-");
        var len = parts.length;
        var c = parseInt(parts[len - 1].substring(1));  // Should be an integer
        var r = parseInt(parts[len - 2].substring(1));  // Should be an integer
        // Everything before that is the table name
        // We need to watch out for hyphens because we just split on them..
        var tableKey = "";
        for (var i = 0; i < (len - 2); i++) { tableKey += parts[i]; }
        return ([tableKey, val, "table", r, c]);
    },

    // Sort the response items alphanumerically
    sortResponse: function(data) {
        "use strict";
        var self = this;
        var l = [];
        $.each(data, function(k, v) {   
            // Test whether item is part of a tabular array (has -r and -c in key)
            // And add a table type flag accordingly
            // Returns an object {key, val, type, [r, c] }
            if ((k.indexOf("-r") > -1) && (k.indexOf("-c") > -1)) {
                l.push(self.parseTableKey(k, v));
            }
            else {
                l.push([$.trim(k), $.trim(v), ""]);
            }
        });

        // Pluck just the tables so that we can sort them
        var tables = [];
        var tableNames = [];
        $.each(l, function(k, v) { 
            if (v[2] === "table") { 
                tables.push(v); 
                tableNames.push(v[0]);
            } 
        });

        // We need to sort by name, then row, then col, but this is not trivial
        // Get the unique list of table group names
        var u = tableNames.filter(function(itm, i, a) {
            return i == a.indexOf(itm);
        });

        var tableGroup = [];
        // For each table group, sort the items by row and column
        $.each(u, function(i, name) {
            // Find all items in the table group with this name
            var tg = $.grep(tables, function(v, k) { 
                return (v[0] == name);
            });     

            // Sort by row 
            tg.sort(function(a, b) {
              var aRow = a[3];
              var bRow = b[3]; 
              return ((aRow < bRow) ? -1 : ((aRow > bRow) ? 1 : 0));
            });

            // Get unique list of rows
            var rowCount = 1, row = [], tg2 = [];
            $.each(tg, function(kk, vv) {
                if (vv[3] == rowCount) {
                    row.push(vv);
                }
                else {
                    // Update the row counter
                    rowCount = vv[3];
                    // Sort the row
                    row.sort(function(a, b) {
                      var aCol = a[4];
                      var bCol = b[4]; 
                      return ((aCol < bCol) ? -1 : ((aCol > bCol) ? 1 : 0));
                    });
                    // And append to the object
                    tg2 = tg2.concat(row);
        
                    // Start a new row      
                    row = [];
                    row.push(vv);
                }
            });
            // Last row needs to be handled
            row.sort(function(a, b) {
              var aCol = a[4];
              var bCol = b[4]; 
              return ((aCol < bCol) ? -1 : ((aCol > bCol) ? 1 : 0));
            });
            tg2 = tg2.concat(row);

            // Convert array shape and add to the object
            tableGroup.push(self.convertCalculonToTableData(tg2));
        });

        // Then sort and append all of the standard items to the list
        // Pluck and sort
        var nonTg = [];
        $.map(l, function(v, k) { 
            if (v[2] != "table") { 
                nonTg.push(v); 
            } 
        });
        nonTg.sort();

        // Append
        $.each(nonTg, function(k, v){
            // Convert from array into {key, val, type (empty)}
            tableGroup.push({name: v[0], val: v[1], type:""});
        });

        return tableGroup;
    },

    writeResponse: function(data, callback) {
        "use strict";
        var self = this;

        // Add results set to global store
        var d = JSON.parse(data);

        // Sort into [key, value] array, by alphanumeric key order 
        var list = self.sortResponse(d);

        // Write values back to form
        $.each(list, function(k, v) { 
            // Select the named control(s)
            $.each($("[id=" + v.name + "]"), function (){
                // Test for Table
                if (v.type === "table") {
                    if (v.val.length === 0) {
                        // Log error in console
                        console.log("Error writing table: " + v.name + " is empty.");
                    }
                    else {
                        // Set table value from array
                        FBRun.tablegroup.setData($(this), v.val);
                    }
                }
                else {
                    // Set scalar value
                    $(this).val(v.val);
                }
            });
        });

        if (callback !== undefined) { callback(); }
        
        return false;
    },

    writeError: function(data) {
        "use strict";
        var self = this;
        /* self.results.push({"status":self.status, "req": self.request, "res": self.response, "time": self.responseTime}); */

        // Log the error
        // var d = JSON.parse(data);
        // var msg = self.status + "\n\nError Type: " + d.type + "\n\nError Code: " + d.code + "\n\nDetails:\n" + d.developerMessage;

        if (data !== undefined) { 
            bootbox.alert(data);
        }
        else {
            bootbox.alert("There was an error communicating with the calculation service.");
        }
        
        return self;
    },

    send: function (callback) {
        "use strict";      
        var self = this;      
        var reqTime = self.time();  // Request started

        FB.utils.showSpinner();

        // Establish url
        var url = (self.options.proxy !== "") ? self.options.proxy + "?url=" + encodeURIComponent(self.options.url) : self.options.url;

        // POST using Ajax
        var jqxhr = $.ajax({
            type: "POST",
            url: url,
            data: self.request,
            dataType: "json",
            success: function(xhr) { 
                self.responseTime = self.duration(reqTime, self.time());
                self.status = "Success";
                var r = (jqxhr !== undefined) ? jqxhr.responseText : JSON.stringify(xhr);
                self.response = r;
                FB.utils.hideSpinner();
                // Callbacks
                self.writeResponse(self.response, callback);
                // Redirect
                if (self.options.successUrl !== "") { window.location = self.options.successUrl; }
            },
            error: function(xhr) { 
                self.responseTime = self.duration(reqTime, self.time());
                self.status = "Error";
                self.response = xhr.message; 
                FB.utils.hideSpinner();
                // Callback the error
                self.writeError(self.response);
            },
            fail: function(xhr) { 
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

    // Execute a calculation request
    calculate: function (options, callback) {
        "use strict";
        var self = this;

        // Use model if set
        if (options !== undefined) { self.update(options); }

        // Verify that we have enough data to send
        var verify = true;
        if (self.options.model === "") { 
            verify = false; 
            console.log("Calculation model not defined");
        }
        //if (self.request === "") { 
            // Fetch inputs from form
            self.request = "{\"workbookname\": \"" + self.options.model + "\", \"inputs\": {" + self.parseInputs() + "}}";
        //}
        if (verify) { 
            if (callback !== undefined) {
                self.send(callback);
            }
            else {
                self.send(); 
            }
        }
    }
};

/* ====================================================================================
    // Instantiate
    var calc = new $.Calculon;

    // Set model and request manually
    calc.model = "NI.xlsx";
    calc.request = "{'workbookname': 'NI.xlsx', 'inputs': {'amount' : '1000'}}";
    calc.calculate();

    // Or set the model in the calculate method directly
    // If undefined, the request will be derived from form input values
    calc.calculate({model: "NI.xlsx"});

    // Optionally, set a custom callback function which accepts the stringified json response
    calc.calculate({model: "NI.xlsx"}, callback);
==================================================================================== */
var calc = new $.Calculon();
