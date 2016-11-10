var FBData = FBData || {};

// New page class
FBData.tables = (function () {
    "use strict";

    return {
        list: [
          {
            "title": "Table Group",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "tablegroup"
              },
              "headings": {
                "label": "Column Headings",
                "type": "textarea-split",
                "value": []
              },
              "bordered": {
                "label": "Bordered",
                "type": "checkbox",
                "value": true
              },
              "striped": {
                "label": "Striped",
                "type": "checkbox",
                "value": true
              },
              "buttonlabel": {
                "label": "Button Label",
                "type": "input",
                "value": "Add"
              },
              "buttonclosedlabel": {
                "label": "Button Label (Collapsed)",
                "type": "input",
                "value": "Add Another"
              },
              "showidcol": {
                "label": "Show Id Column (when setting data)",
                "type": "checkbox",
                "value": false
              }
            }  
          },
          {
            "title": "Static Table",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "table"
              },
              "headings": {
                "label": "Column Headings",
                "type": "textarea-split",
                "value": [
                  {
                    "text": "Define Headings",
                    "value": "Define Headings"
                  }
                ]
              },
              "bordered": {
                "label": "Bordered",
                "type": "checkbox",
                "value": true
              },
              "striped": {
                "label": "Striped",
                "type": "checkbox",
                "value": true
              },
              "showidcol": {
                "label": "Show Id Column (when setting data)",
                "type": "checkbox",
                "value": false
              }
            }
          }
        ]
    };
}());
