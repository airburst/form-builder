var FBData = FBData || {};

// New page class
FBData.val = (function () {
    "use strict";

    var valOptions = function() { 
        var opts = {
            "general": {
                "data-parsley-required": {
                    "label": "Required",
                    "type": "checkbox",
                    "value": false
                },
                "data-parsley-type": {
                    "label": "Data Type",
                    "type": "select",
                    "value": [
                        {
                          "value": "",
                          "text": "",
                          "selected": true
                        },
                        {
                          "value": "number",
                          "text": "Number",
                          "selected": false
                        },
                        {
                          "value": "integer",
                          "text": "Integer",
                          "selected": false
                        },
                        {
                          "value": "digits",
                          "text": "Digits",
                          "selected": false
                        },
                        {
                          "value": "alphanum",
                          "text": "Alphanumeric",
                          "selected": false
                        },
                        {
                          "value": "email",
                          "text": "Email",
                          "selected": false
                        },
                        {
                          "value": "url",
                          "text": "Url",
                          "selected": false
                        }
                    ]
                },
              "data-parsley-pattern": {
                "label": "Data Pattern (Regex)",
                "type": "input",
                "value": ""
              },
              "data-parsley-min": {
                "label": "Minimum Value",
                "type": "input",
                "value": ""
              },
              "data-parsley-max": {
                "label": "Maximum Value",
                "type": "input",
                "value": ""
              },
              "data-parsley-minlength": {
                "label": "Minimum Length",
                "type": "input",
                "value": ""
              },
              "data-parsley-maxlength": {
                "label": "Maximum Length",
                "type": "input",
                "value": ""
              },
              "data-parsley-group": {
                "label": "Validation Group",
                "type": "hidden",
                "value": ""
              }
            },
            "multi": {
              "data-parsley-required": {
                "label": "Required",
                "type": "checkbox",
                "value": false
              },
              "data-parsley-mincheck": {
                "label": "Minimum Checked Controls",
                "type": "input",
                "value": ""
              },
              "data-parsley-maxcheck": {
                "label": "Maximum Checked Controls",
                "type": "input",
                "value": ""
              },
              "data-parsley-group": {
                "label": "Validation Group",
                "type": "hidden",
                "value": ""
              }
            }
          };

        return opts;
        // data-parsley-equalto="#anotherfield"  // Useful for password comparison
    };

    return {
        ValObject: valOptions
    };
}());
