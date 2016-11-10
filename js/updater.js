/* global $:false, bootbox: false */
/*======================================================================*\
  Update Older Versions on Import
\*======================================================================*/
// Use FB namespace
var FB = FB || {};
var FBData = FBData || {};
var FBModes = FBModes || {};

// Define page module
FB.update = (function () {
    "use strict";

    // Compare version numbers e.g. "0.5.10"
    // Return 1 if a > b
    // Return -1 if a < b
    // Return 0 if a == b
    var compare = function (a, b) {
        if (a === b) {
           return 0;
        }

        var aParts = a.split("."),
            bParts = b.split("."),
            len = Math.min(aParts.length, bParts.length);

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
    };

    var updateDefObject = function (sourceVersion) {
      var self = this;

      console.log("=== Source Version " + sourceVersion + " ===");

      /*======================================================================*\
        0.2.0
      \*======================================================================*/
      if (sourceVersion < "0.2") {
        console.log("=== 0.2.0 Updates ===");

        $.each(FB.def, function(k, v) {

          // Add class field to statictext
          if (v.controltype !== undefined) {
            if (v.controltype == "statictext") {
              if (v.fields.class === undefined) { 
                v.fields.class = {
                  "label": "Class",
                  "type": "input",
                  "value": ""
                };
                console.log("[" + v.id + "] class field added");
              }
            }
          }

          if (v.controltype !== undefined) {  /* Form and Pages */

            // Add Table Group Button text: V0.2
            if (v.controltype === "tablegroup") {
              // Add the two new objects
              if (v.fields.buttonlabel === undefined) { 
                v.fields.buttonlabel = {
                  "label": "Button Label",
                  "type": "input",
                  "value": "Add"
                };
                console.log("[" + v.id + "] buttonlabel field added");
              }

              if (v.fields.buttonclosedlabel === undefined) { 
                v.fields.buttonclosedlabel = {
                  "label": "Button Label (Collapsed)",
                  "type": "input",
                  "value": "Add Another"
                };
                console.log("[" + v.id + "] buttonclosedlabel field added");
              }
            }
          }
        }); 
      } 
      /*======================================================================*\
        END 0.2.0
      \*======================================================================*/

      /*======================================================================*\
        0.2.1
      \*======================================================================*/
      if (sourceVersion < "0.2.1") {
        console.log("=== 0.2.1 Updates ===");

        $.each(FB.def, function(k, v) {
          // Add Required validation to radios and checkboxes: V0.2.1
          if ((v.controltype !== undefined) && (v.controltype.substring(0, 8) === "multiple")) {
            // Data required field on radios and checkboxes
            if (v.fields["data-parsley-required"] === undefined) {
              v.fields["data-parsley-required"] = {
                "label": "Required",
                "type": "checkbox",
                "value": false
              };
              console.log("[" + v.id + "] data-parsley-required field added");
            }
          }

          // Add visibility field: V0.2.1
          if (v.id > 0) {
            // Data required field on radios and checkboxes
            if (v.fields["data-vis"] === undefined) {
              v.fields["data-vis"] = {
                "label": "Visibility Rule",
                "type": "input",
                "value": ""
              };
              console.log("[" + v.id + "] data-vis field added");
            }
          }    

          // Add multiple datepicker types (standard, future, dob)
          if (v.controltype === "dateinput") {
            // Data required field on radios and checkboxes
            if (v.fields["constraint"] === undefined) {
              v.fields["constraint"] = {
                "label": "Date Validation",
                "type": "select",
                "value": [
                  {
                    "value": "",
                    "text": "None",
                    "selected": true
                  },
                  {
                    "value": "-future",
                    "text": "Future dates only",
                    "selected": false
                  },
                  {
                    "value": "-dob",
                    "text": "Date of Birth",
                    "selected": false
                  }
                ]
              };
              console.log("[" + v.id + "] date constraint field added");
            }
          }  
        }); 
      }
      /*======================================================================*\
        END 0.2.1
      \*======================================================================*/

      /*======================================================================*\
        0.2.2
      \*======================================================================*/
      if (sourceVersion < "0.2.2") {
        console.log("=== 0.2.2 Updates ===");

        $.each(FB.def, function(k, v) {
          if (v.parent !== undefined) {  /* Child of tablegroup */

            // Add columnheading field
            if (v.fields.columnheading === undefined) { 
              v.fields.columnheading = {
                "label": "Column Heading",
                "type": "checkbox",
                "value": true
              };
              console.log("[" + v.id + "] columnheading field added");
            }

            // Add columndata field
            if (v.fields.columndata === undefined) { 
              v.fields.columndata = {
                "label": "Column Data",
                "type": "checkbox",
                "value": true
              };
              console.log("[" + v.id + "] columndata field added");
            }
          }

          // Remove "fixed" field from TableGroups
          if (v.controltype === "tablegroup") {
            if (v.fields.fixed !== undefined) {
              delete v.fields.fixed;
              console.log("[" + v.id + "] fixed field deleted");
            }
          }
        }); 
      }
      /*======================================================================*\
        END 0.2.2
      \*======================================================================*/


      /*======================================================================*\
        0.3.0
      \*======================================================================*/
      if (sourceVersion < "0.3.0") {
        console.log("=== 0.3.0 Updates ===");

        $.each(FB.def, function(k, v) {

          // Add popover help fields
          if (
            (v.id > 1) && 
            (v.controltype !== "tablegroup") && 
            (v.controltype !== "actionbutton") && 
            (v.controltype !== "statictable") && 
            (v.title !== "Page")
          ) {
            v.fields.helplink = {
              "label": "Help Link Text",
              "type": "input",
              "value": ""
            };
            v.fields.helptext = {
              "label": "Help Popup Text",
              "type": "input",
              "value": ""
            };
            v.fields.helptitle = {
              "label": "Help Popup Title",
              "type": "input",
              "value": ""
            };
            console.log("[" + v.id + "] help fields added");
          }

          // Add Vis field to pages
          if (v.title === "Page") {
            if (v.fields["data-vis"] === undefined) {
              v.fields["data-vis"] = {
                "label": "Visibility Rule",
                "type": "input",
                "value": ""
              };
              console.log("[" + v.id + "] Page vis rule added");
            }
          }
        }); 
      }
      /*======================================================================*\
        END 0.3.0
      \*======================================================================*/

      /*======================================================================*\
        0.3.1
      \*======================================================================*/
      if (sourceVersion < "0.3.1") {
        console.log("=== 0.3.1 Updates ===");

        $.each(FB.def, function(k, v) {

          // Add shoidcol attribute to tables; default = false
          if (
            (v.controltype === "tablegroup") ||
            (v.controltype === "statictable")
          ) {
            if (v.fields["showidcol"] === undefined) {
              v.fields["showidcol"] = {
                "label": "Show Id Column (when setting data)",
                "type": "checkbox",
                "value": false
              };
              console.log("[" + v.id + "] Table idcol attribute added");
            }
          }

        }); 
      }
      /*======================================================================*\
        END 0.3.1
      \*======================================================================*/


      /*======================================================================*\
        END 0.4.0
      \*======================================================================*/
      if (sourceVersion < "0.4.0") {
        console.log("=== 0.4.0 Updates ===");

        $.each(FB.def, function(k, v) {
          // Add inputsize attribute to radios and checkboxes
          if (v.controltype !== undefined) {
            if (
              (v.controltype.indexOf("radios") > -1) ||
              (v.controltype.indexOf("checkbox") > -1)
            ) {
              if (v.fields["inputsize"] === undefined) {
                v.fields["inputsize"]= {
                  "label": "Input Size",
                    "type": "select",
                    "value": [
                      {
                        "value": "1",
                        "text": "1",
                        "selected": false
                      },
                      {
                        "value": "2",
                        "text": "2",
                        "selected": false
                      },
                      {
                        "value": "3",
                        "text": "3",
                        "selected": false
                      },
                      {
                        "value": "4",
                        "text": "4",
                        "selected": true
                      },
                      {
                        "value": "5",
                        "text": "5",
                        "selected": false
                      },
                      {
                        "value": "6",
                        "text": "6",
                        "selected": false
                      },
                      {
                        "value": "7",
                        "text": "7",
                        "selected": false
                      },
                      {
                        "value": "8",
                        "text": "8",
                        "selected": false
                      },
                      {
                        "value": "9",
                        "text": "9",
                        "selected": false
                      },
                      {
                        "value": "10",
                        "text": "10",
                        "selected": false
                      },
                      {
                        "value": "11",
                        "text": "11",
                        "selected": false
                      },
                      {
                        "value": "12",
                        "text": "12",
                        "selected": false
                      }
                    ]
                  };
                console.log("[" + v.id + "] Radio-checkbox inputsize attribute added");
              }
            }
          }
        }); 
      }

      /*======================================================================*\
        0.4.2
      \*======================================================================*/
      if (sourceVersion < "0.4.2") {
        console.log("=== 0.4.2 Updates ===");

        $.each(FB.def, function(k, v) {

          // Change data-vis attribute to empty select
          if (v.fields["data-vis"] !== undefined) {
            v.fields["data-vis"] = {
              "label": "Visibility Rule",
              "type": "select",
              "selectedvalue": "",
              "value": []
            };
            console.log("[" + v.id + "] Vis rule changed to select and emptied");
          }
        }); 
      }
      /*======================================================================*\
        END 0.4.2
      \*======================================================================*/

      /*======================================================================*\
        0.5.0
      \*======================================================================*/
      if (sourceVersion < "0.5.0") {
        console.log("=== 0.5.0 Updates ===");

        // Update vis rules to add display element
        $.each(FB.vis.rules, function(k, v) {
          v.display = v.rule;
        });

        // Count the number of data-vis attributes with rules applied (selectedvalue !== "")
        // If there are any then flag a warning that user must recreate all rules
        var count050 = 0;

        $.each(FB.def, function(k, v) {
          if (v.fields["data-vis"] !== undefined) {
            if (v.fields["data-vis"].selectedvalue != "") { count050++; }
          }
        }); 

        if (count050 > 0) { bootbox.alert("You need to manually recreate all visiblity rules in the Rule Builder."); }
      }
      /*======================================================================*\
        END 0.5.0
      \*======================================================================*/

      /*======================================================================*\
        0.5.4
      \*======================================================================*/
      if ((sourceVersion < "0.5.4") && (sourceVersion >= "0.5.0")) {
        console.log("=== 0.5.4 Updates ===");

        // Update vis rules to add input or select type to each rules.def object
        $.each(FB.vis.rules, function(ruleId, rule) {
          $.each(rule.def, function(dId, d) {
            if (FB.utils.getOptions(parseInt(d.left)) !== false) {
              d.type = "select";
            }
            else {
              d.type = "input";
            }

            console.log("Vis rule " + ruleId + ", FB.def[" + dId + "] changed to type " + d.type);
          });
        });
      }
      /*======================================================================*\
        END 0.5.4
      \*======================================================================*/



      /*======================================================================*\
        0.7.0
      \*======================================================================*/
      if (sourceVersion < "0.7.0") {
        console.log("=== 0.7.0 Updates ===");

        $.each(FB.def, function (k, v) {
          // Change data-parsley-group type to hidden
          if (v.fields["data-parsley-group"] !== undefined) {
            v.fields["data-parsley-group"].type = "hidden";
            console.log("[" + v.id + "] Parsley group property hidden");
          }
        }); 
      }
      /*======================================================================*\
        END 0.7.0
      \*======================================================================*/


      /*======================================================================*\
        0.7.1
      \*======================================================================*/
      if (sourceVersion < "0.7.1") {
        console.log("=== 0.7.1 Updates ===");

        $.each(FB.def, function (k, v) {
          // Add data-event-integration
          if (v.fields["data-event-type"] !== undefined) {
            v.fields["data-event-integration"] = {
              "label": "Integration system name",
              "type": "input",
              "value": ""
            };

            console.log("[" + v.id + "] Added data-event-integration field");
          }
        }); 
      }
      /*======================================================================*\
        END 0.7.1
      \*======================================================================*/
      

      /*======================================================================*\
        Update form output options from plugins
      \*======================================================================*/
      // Empty current modes
      FB.def[0].fields.output.value = [];

      // Populate with new output modes from plugins
      $.each(FBModes, function (k, v) {
        var m = {selected: false, text: v.id, value: k};

        // Default selected to bootstrap3
        if (k === "bootstrap3") { m.selected = true; }

        // Add to object
        FB.def[0].fields.output.value.push(m);
      });

      // Set the new version
      FB.def[0].version = FB.version;
    };

    var updateFile = function () {
        // Test whether FB.version > imported def version
        var self = this;
        var sourceVersion = "0";

        if (FB.def[0].version !== undefined) { sourceVersion = FB.def[0].version; }

        if (self.compare(FB.version, sourceVersion) === 1) { 
            updateDefObject(sourceVersion); 
            bootbox.alert("File updated from version " + sourceVersion + " to version " + FB.version);
        }
        else {
            console.log("=== File is already Version " + FB.version + " ===");
        }
    };

    var addSDSFields = function () {
        $.each(FB.def, function (k, v) {

          // Add class field to statictext
          if (v.fields !== undefined) {
                if (v.controltype !== undefined) {
                    if (v.fields.questionid === undefined) { 
                        v.fields.questionid = {
                            "label": "Question Id",
                            "type": "input",
                            "value": ""
                        };
                    }
                }
            }
        });
        console.log("SDS Fields Added");
    };

    return {
        updateFile: updateFile,
        compare: compare,
        addSDSFields: addSDSFields
    };

}());
