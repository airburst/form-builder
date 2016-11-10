/* global $:false */
/*======================================================================*\
  Right-click context menu handler for rows
  Event Handlers and Functions for Rows
\*======================================================================*/
// Use FB namespace
var FB = FB || {};

// Define form module  
FB.form = (function () {
    "use strict";

    var setControlWidths = function () {       
        // When Form label and control width fields are changed, 
        // set all subsequent controls to use those values by
        // changing the [data] object
        var labelWidth   = FB.def[0].fields.labelwidth.selectedvalue;
        var controlWidth = FB.def[0].fields.controlwidth.selectedvalue;

        // Update all labelsize and inputsize values in data
        $.each(FB.designer.toolsData, function(inputIndex, inputType) {
            $.each(inputType.controls, function(controlIndex, control) {
                $.each(control.fields, function(fieldIndex, field) {
                    if ((field.label === "Label Size")) {
                        $.each(field.value, function(valIndex, val) {
                            if (val.value === labelWidth) {
                                val.selected = true;
                            }
                            else {
                                val.selected = false;
                            }
                        });
                    }
                    if ((field.label === "Input Size")) {
                        $.each(field.value, function (valIndex, val) {
                            if (val.value === controlWidth) {
                                val.selected = true;
                            }
                            else {
                                val.selected = false;
                            }
                        });
                    }
                });
            });
        });
        return false;
    };

    var update = function () {
        // Add selectedvalue to selects
        $.each(FB.def[0].fields, function (k, v) {
            if (v.type === "select") {
                var selectedValue = $.map(v.value, function (vv) {
                    if ((vv.selected === true) || (vv.checked === true)) {
                        return (vv.value);
                    }
                });
                if (selectedValue !== undefined) { v.selectedvalue = selectedValue[0]; }
            }
        });

        // Update label and control widths for subsequent controls
        setControlWidths();

        if ($("#form-name").length === 0) {
            // Add the new form name via template
            $("#content .panel-content").prepend(FB.templates.formTpl(FB.def[0]));
            // And set binding to show properties
            $("#form-name").bind("click", {ths: FB.designer}, FB.designer.updateProperties);
        }
        else {
            $("#form-name").text(FB.def[0].fields.id.value);
        }

        // Set custom fields
        if (FB.customFieldsEditor !== undefined) { FB.def[0].custom = JSON.stringify(FB.customFieldsEditor.getValue()); }

        FB.designer.showProperties(FB.def[0], 0);
    };

    var getCustomFields = function () {
        var c = FB.d(0).custom;
        return ((c !== undefined) && (JSON.parse(c) !== "")) ? JSON.parse(JSON.parse(c)) : null;
    };

/*    var addCustomFields = function () {
        
    };*/

    return {
        setControlWidths: setControlWidths,
        update: update,
        getCustomFields: getCustomFields
    };

}());
