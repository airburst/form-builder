var FBData = FBData || {};

// New page class
FBData.selects = (function () {
    "use strict";

    return {
        list: [
          {
            "title": "Select Basic",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "selectbasic"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Select Basic"
              },
              "labelsize": {
                "label": "Label Size",
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
                    "text": "Hidden",
                    "selected": false
                  }
                ]
              },
              "options": {
                "label": "Options",
                "type": "textarea-split",
                "value": [
                  {
                    "text": "Option one", 
                    "value": "1",
                    "selected": true
                  },
                  {
                    "text": "Option two", 
                    "value": "2",
                    "selected": false
                  }
                ]
              },
              "inputsize": {
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
                    "selected": false
                  },
                  {
                    "value": "5",
                    "text": "5",
                    "selected": false
                  },
                  {
                    "value": "6",
                    "text": "6",
                    "selected": true
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
              "helplink": {
                "label": "Help Link Text",
                "type": "input",
                "value": ""
              },
              "helptext": {
                "label": "Help Popup Text",
                "type": "input",
                "value": ""
              },
              "helptitle": {
                "label": "Help Popup Title",
                "type": "input",
                "value": ""
              },
              "tabindex": {
                "label": "Tab Index",
                "type": "input",
                "value": 0
              }
            }
          },
          {
            "title": "Select Multiple",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "selectmultiple"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Select Multiple"
              },
              "labelsize": {
                "label": "Label Size",
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
                    "text": "Hidden",
                    "selected": false
                  }
                ]
              },
              "options": {
                "label": "Options",
                "type": "textarea-split",
                "value": [
                  {
                    "text": "1", 
                    "value": "1",
                    "selected": true
                  },
                  {
                    "text": "2", 
                    "value": "2",
                    "selected": false
                  },
                  {
                    "text": "3", 
                    "value": "3",
                    "selected": false
                  },
                  {
                    "text": "4", 
                    "value": "4",
                    "selected": false
                  }
                ]
              },
              "inputsize": {
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
                    "selected": false
                  },
                  {
                    "value": "5",
                    "text": "5",
                    "selected": false
                  },
                  {
                    "value": "6",
                    "text": "6",
                    "selected": true
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
              "helplink": {
                "label": "Help Link Text",
                "type": "input",
                "value": ""
              },
              "helptext": {
                "label": "Help Popup Text",
                "type": "input",
                "value": ""
              },
              "helptitle": {
                "label": "Help Popup Title",
                "type": "input",
                "value": ""
              },
              "tabindex": {
                "label": "Tab Index",
                "type": "input",
                "value": 0
              }
            }
          }
        ]
    };
}());
