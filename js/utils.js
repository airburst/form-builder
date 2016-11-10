/* global $:false */
// Use FB namespace
var FB = FB || {};

FB.utils = (function() {
    "use strict";

    // Create friendly ids by removing white space, non-text chars and lower-casing
    var shorten = function(input) {
        return input.toLowerCase().replace(/\W/g, "");
    };

    var selectorByDataId = function(id) {
        return ($("[data-id=" + id + "]"));
    };

    var idByElement = function($elem) {
        var $control = $elem.closest($("[data-id]"));
        return $control.attr("data-id");
    };

    var idSequence = function() {
        var a = [];
        $.each($("[data-id]"), function() {
            a.push($(this).data("id"));
        });
        return a;
    };

    // De-duplicate an object by field name
    // Returns an object with unique field
    var distinct = function(object, field) {
        var dupes = {};
        var clean = [];
        $.each(object, function(i, el) {
            if (!dupes[el[field]]) {
                dupes[el[field]] = true;
                clean.push(el);
            }
        });
        return clean;
    };

    var stringToBoolean = function(str) {
        switch (str.toLowerCase()) {
            case "true": case "yes": case "1": return true;
            case "false": case "no": case "0": case null: return false;
            default: return Boolean(str);
        }
    };

    // Establish whether the data-id contains a Select control
    // Returns true | false.  Note that it will return true if any child is a Select
    // so use on individual controls if possible
    var isSelect = function(id) {
        return ($("[data-id=" + id + "] select").length > 0) ? true : false;
    };

    // Update one or more select controls with a set of options
    // Expects $con to be a selector for one or more Select elements
    // and options to contain {text:, value:}
    var updateSelect = function($con, options) {
        $con.empty(); // remove old options
        $.each(options, function(k, v) {
            $con.append($("<option></option>").attr("value", v.value).text(v.text));
        });
    };

    // Add an option to one or more select controls
    // Expects $con to be a selector for one or more Select elements
    var addItemToSelect = function($con, text, value) {
        if (value === undefined) { value = text; }
        $con.append($("<option></option>").attr("value", value).text(text));
    };

    // Remove option with specified value from select control
    var removeItemFromSelect = function($con, value) {
        $("option[value=" + value + "]", $con).remove();
    };

    // Return an object with all of the options in a control by id
    var getOptions = function(id) {
        var con = FB.d(id);

        // If the control is a choice-type then we need to render rule-right-n 
        // as a select, using this control's options
        var type = "";
        if (con.fields.radios !== undefined) { type = con.fields.radios; }
        if (con.fields.checkboxes !== undefined) { type = con.fields.checkboxes; }
        if (con.fields.options !== undefined) { type = con.fields.options; }

        if (type != "") {
            // Get options
            var opts = [];
            $.each(type.value, function(k, v) {
                //opts.push({"text": v.value, "value": v.value});
                opts.push({"text": v.text, "value": v.value});
            });
            return opts;
        }
        return false;
    };

    // Convert textarea-split text into object
    var convertTextToObject = function(text, type, children) {
        var o = [];

        if (text != "") {
            var noneChecked = true;
            var items = text.split("\n");
            var msg = "";

            $.each(items, function(k, v) {
                // Radios and selects have the form text : value (* optional)
                var t = "";
                v = v.trim();
                var c = "";

                // Trim the line and test for last char == *
                if (v.slice(-1) === "*") {
                    // Only accept the first checked item
                    c = true && noneChecked;
                    v = v.substring(0, v.length - 1).trim();
                    noneChecked = false;
                } else {
                    c = false;
                }

                // Split into text and value at :
                var tv = v.split(":");
                if (tv.length === 1) {
                    // Same text and value
                    t = v;
                } else {
                    t = tv[0].trim();
                    v = tv[1].trim();
                }

                // Assign to object
                switch (type) {
                    case "Options":
                        // Selects
                        o.push({text: t, value: v, selected: c});
                    break;

                    case "Column Headings":      
                        // Table Group Headings: value (v) must stick to the appropriate child item control id
                        if (children !== undefined) {
                            // Count the number of child controls which are column headings
                            var childLen = 0;
                            $.each(children, function(k, v) {
                                if (FB.d(v).fields.columnheading.value === true) { childLen++; }
                            });

                            if (childLen > 0) {           
                                // Test for too few manual entries
                                if (items.length < childLen) {
                                    // Warn and do not change the object value
                                    msg = "Warning! You have entered fewer column headings than there are controls in the Table Group. No changes made.";
                                } else {
                                    // Test for too many manual entries
                                    if (k < childLen) {
                                        // Update the entries for valid number of items
                                        o.push({text: t, value: children[k], selected: false});
                                    } else {
                                        msg = "Warning! You have entered more column headings than there are controls in the Table Group. No more added.";
                                    }
                                }
                            } else {
                                msg = "Warning! You have entered more column headings than there are controls in the Table Group. Reset to default.";
                            }
                        }
                        // If children is undefined then assume we have a static table
                        else {
                            o.push({text: t, value: t, selected: false});
                        }
                    break;

                    default:
                        // Radios and Checkboxes      
                        o.push({text: t, value: v, checked: c});
                    break;
                }
            });
            
            // Flag warnings
            if (msg != "") {
                bootbox.alert(msg);
            }
            return o;
        } else {
            // Forces updateComponent to ignore this update
            return null;
        }
    };

    // Parse column width value from class string
    var getWidth = function(text) {
        var w = "";
        $.each(text.split(" "), function(k, v) {
            if (v.indexOf("col-") !== -1) {w = v;}
        });
        return w;
    };

    // Show and hide the spinner
    var showSpinner = function() {
        $(".spinner-container").html("<div class=\"spinner\">Sending...</div>");
    };

    var hideSpinner = function() {
        $(".spinner-container").html("");
    };

    // Replace all occurences of a string
    var replaceAll = function(str, find, replace) {
        return str.replace(new RegExp(find, "g"), replace);
    };

    var stringToBoolean = function(str) {
        switch (str.toString().toLowerCase()){
            case "true": case "yes": case "1": case "": return true;
            case "false": case "no": case "0": case null: return false;
            default: return Boolean(str);
        }
    };

    var boolAnd = function(arguments) {
        var result = true;
        for (var i = 0; i < arguments.length; i++) {
            // If argument is not a boolean, convert to one
            switch ($.type(arguments[i])) {
                case "boolean": 
                    result = (result && arguments[i]);
                default: 
                    result = (result && stringToBoolean(arguments[i]));
            }
        }
        return result;
    };

    // Get a querystring value by key
    var getUrlParameter = function(param) {
        var pu = window.location.search.substring(1);
        var uv = pu.split('&');
        for (var i = 0; i < uv.length; i++) {
            var pn = uv[i].split('=');
            if (pn[0] === param) { return pn[1]; }
        }
        return "";
    };

    // Return the text for a given Select and value
    var textByValue = function($con, value) {
        return $("option", $con).filter(function() { return $(this).val() == value; }).text();
    };

    // Return the value for a given Select and text
    var valueByText = function($con, text) {
        return $("option", $con).filter(function() { return $(this).html() == text; }).val();
    };

    // Concatenate all arguments with comma separation
    var concatIf = function() {
        var text = "";
        var l = arguments.length;
        for (var i = 0; i < l; i++) {
            if (arguments[i] != "") {
                text += arguments[i];
                // Add comma
                if (i < (l - 1)) {
                    text += ", ";
                }
            }
        }
        return (text);
    };

    // Convert value to currency if numeric and has a decimal place
    var set2dp = function(val) {
        var n = parseFloat(val);
        return (isNaN(n)) ? val : n.toFixed(2);
    };

    var currencyTest = function(val) {
        var n = parseFloat(val);
        return (isNaN(n)) ? val : "&pound; " + n.toFixed(2);
    };

    // Raise Google Analytics Event
    var gaEvent = function(category, action, label) {
        if (window._gaq !== undefined) {
            var c = (category !== undefined) ? category : "";
            var a = (action !== undefined) ? action : "";
            var l = (label !== undefined) ? label : "";
            window._gaq.push(["_trackEvent", c, a, l]);
        }
        return false;
    };

    // Helper - identify all events bound to a control
    var getEvents = function($selector) {
        return $._data($selector[0], "events");
    };

    // Public properties and methods
    return {
        shorten: shorten,
        idSequence: idSequence,
        $id: selectorByDataId,
        idByElement: idByElement,
        distinct: distinct,
        stringToBoolean: stringToBoolean,
        isSelect: isSelect,
        updateSelect: updateSelect,
        addItemToSelect: addItemToSelect,
        removeItemFromSelect: removeItemFromSelect,
        getOptions: getOptions,
        convertTextToObject: convertTextToObject,
        getWidth: getWidth,
        showSpinner: showSpinner,
        hideSpinner: hideSpinner,
        replaceAll: replaceAll,
        s2b: stringToBoolean,
        boolAnd: boolAnd,
        getUrlParameter: getUrlParameter,
        textByValue: textByValue,
        valueByText: valueByText,
        concatIf: concatIf,
        gaEvent: gaEvent,
        set2dp: set2dp,
        currencyTest: currencyTest,
        getEvents: getEvents
    };
})();
