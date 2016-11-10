/* global $:false, bootbox:false */

// Declare runtime namespace
var FB = FB || {};
var FBRun = FBRun || {};

// Define FB.runtime function
FBRun = (function() {
    "use strict";

    // Get the passed mode into formbuilder.js
    // NOTE: this is fragile and only expects one parameter
    var getMode = function() {
        // Get the script with parameter (only one in list)
        var x = $("script[src*=\"?mode\"]").attr("src");
        // Get the parameter pairs
        var params = x.split("?")[1];
        // And the first value (mode)
        var mode = params.split("=")[1];
        return mode;
    };

    var parsleyOptions = {
        /*  successClass: "has-success",
        errorClass: "has-error",*/
        classHandler: function(el) {
            return el.$element.closest("[data-id]");
        },
        errorsContainer: function(el) {
            return el.$element.closest("[data-id]");
        },
        // errorsWrapper: "<span class=\"help-block\"></span>",
        errorTemplate: "<span></span>",
        excluded: "input[type=button], input[type=submit], input[type=reset], :hidden"
    };

    // Default values
    var defaults = {
        /*formContainer: "#aspnetForm"*/
        formContainer: ".form-fb"
    };

    // Initialise form object
    var init = function(options) {
        this.options = $.extend({}, defaults, options);
        return this;
    };

    // Return an array of form input values
    var getInputs = function() {
        var inputs = [];
        var $controls = $("input[type!=submit], select, textarea, .table-group");

        // Get the label, value, text of each control
        $.each($controls, function() {
            var val, text, type, idCol;

            // Get control type
            type = ($(this).prop("type") !== undefined) ? $(this).prop("type") : "";
            if ($(this).hasClass("table-group")) { type = "tablegroup"; }

            // Get attributes
            var id = $(this).attr("id");
            var n = $(this).attr("name");
            var qId = $(this).closest("[data-id]").attr("data-integration");

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
        });

        return inputs;
    };

    var getControlValue = function(id) {
        var result = "";
        // Select all input controls in the div
        var $fg = $("[data-id=" + id + "]");
        var $con = $("input,select,textarea", $fg);
        if ($con.length > 0) {
            // Establish the type
            var type = $con.prop("type");
            if (type === undefined) {
                type = "text";
            }
            // Get the appropriate value 
            switch (type) {
                case "radio":
                    // Only get the checked value
                    $.each($con, function(k) {
                        if ($con[k].checked) { result = $(this).val(); }
                    });
                    break;

                case "checkbox":
                    // Only get the checked value(s)
                    $.each($con, function(k) {
                        if ($con[k].checked) { result += $(this).val(); }
                    });
                    break;

                case "select-one":
                    // Get the text for selected value
                    result = FB.utils.textByValue($con, $con.val());  //TEXT
                    // result = $con.val();                                //VAL
                    break;
                    //TODO: handler for select-multiple, like checkbox above

                case "text":
                    // If this is an input group, then set value to 2 dp  // NOTE: may want to remove this non-generic rule!
                    if ($con.parent().hasClass("input-group")) {
                        result = FB.utils.set2dp($con.val());
                    } else {
                        result = $con.val();
                    }
                    break;

                case "textarea":
                    result = $con.val();
                    break;

                case "hidden":
                    result = $con.val();
                    break;
            }
        }
        if (result == null) {
            return "";
        } else {
            return result;
        }
    };

    var setControlValue = function(id, value) {
        // TODO: include option for statictext
        
        if (value === undefined) { value = ""; }
        // Select all input controls in the div
        var $fg = $("[data-id=" + id + "]");
        var $con =  $("input,select,textarea", $fg);
        if ($con.length > 0) {
            
            // Establish the type
            var type = $con.prop("type");
            if (type === undefined) {
                type = "text";
            }
            
            // Get the appropriate value      
            switch (type) {
                case "radio":
                    // Only get the checked value
                    $.each($con, function(k) {
                        if (value == "") {
                            $con[k].checked = false;
                        } else {
                            if (value == $con[k].value) {
                                $con[k].checked = true;
                            }
                        }
                    });
                    break;

                case "checkbox":
                    // Only get the checked value
                    $.each($con, function(k) {
                        if (value == "") {
                            $con[k].checked = false;
                        } else {
                            if (value == $con[k].value) {
                                $con[k].checked = true;
                            }
                        }
                    });
                    break;

                case "select-one":
                    // Get selected value if one exists
                    var sel = $("option[selected]", $con).val();
                    if ((sel !== undefined) && (value == "")) {
                        $con.val(sel);
                    } else {
                        // Set the value for matching text in select
                        $con.val(FB.utils.valueByText($con, value));
                    }
                    break;

                case "text":
                    $con.val(value);
                    break;

                case "textarea":
                    $con.val(value);
                    break;
            }

            // Trigger vis evaluation
            FBRun.vis.evaluate(id);
        }
        return false;
    };

    // Get object type (by data-id)
    // Clears values in a page, table group or individual control
    var empty = function(id) {
        var $item = $("[data-id=" + id + "]");
        if ($item !== undefined) {
            if ($item.hasClass("page")) { 
                // Page; empty all items in the page
                $.each($("[data-id]", $item), function() {
                    empty($(this).data("id"));
                });
            } else {
                if ($("table", $item).length > 0) { 
                    // Remove any existing td elements
                    $("td", $item).remove();
                } else {
                    // Control
                    setControlValue(id);
                }
            }
        }
    };

    // Public methods
    return {
        defaults: defaults,
        getMode: getMode,
        parsleyOptions: parsleyOptions,
        init: init,
        inputs: getInputs,
        getControlValue: getControlValue,
        setControlValue: setControlValue,
        empty: empty
    };

})();
