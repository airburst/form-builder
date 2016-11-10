var FBData = FBData || {};

FBData.form = function () {
    "use strict";

    return {
        "title": "Form",
        "fields": {
          "id": {
            "label": "ID / Name",
            "type": "input",
            "value": "Form"
          },
          "labelwidth": {
            "label": "Default Label Width",
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
                "value": false,
                "text": "Hide labels",
                "selected": false
              }
            ]
          },
          "controlwidth": {
            "label": "Default Control Width",
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
          },
          "output": {
            "label": "Output Mode",
            "type": "select",
            "value": [
              {
                "value": "bootstrap3",
                "text": "Bootstrap 3",
                "selected": true
              },
              {
                "value": "mylife",
                "text": "MyLife",
                "selected": false
              },
              {
                "value": "affordability",
                "text": "Affordability",
                "selected": false
              }
            ]
          }
        }
    };
}();
