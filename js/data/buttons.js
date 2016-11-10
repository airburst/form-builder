var FBData = FBData || {};

// New page class
FBData.buttons = (function () {
    "use strict";

    return {
        list: [
          {
            "title": "Action Button",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "actionbutton"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Action Button"
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
              "buttonsize": {
                "label": "Button Size",
                "type": "select",
                "value": [
                  {
                    "value": "",
                    "text": "Width of contents",
                    "selected": true
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
              "buttonlabel": {
                "label": "Button Label",
                "type": "input",
                "value": "Action"
              },
              "buttontype": {
                "label": "Button Type",
                "type": "select",
                "value": [
                  {
                    "value": "btn-default",
                    "text": "Default",
                    "selected": false
                  },
                  {
                    "value": "btn-primary",
                    "text": "Primary",
                    "selected": true
                  },
                  {
                    "value": "btn-info",
                    "text": "Info",
                    "selected": false
                  },
                  {
                    "value": "btn-success",
                    "text": "Success",
                    "selected": false
                  },
                  {
                    "value": "btn-warning",
                    "text": "Warning",
                    "selected": false
                  },
                  {
                    "value": "btn-danger",
                    "text": "Danger",
                    "selected": false
                  },
                  {
                    "value": "btn-inverse",
                    "text": "Inverse",
                    "selected": false
                  }
                ]
              },
              "buttonaction": {
                "label": "Action",
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
            "title": "Calc Button",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "calcbutton"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": ""
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
              "buttonsize": {
                "label": "Button Size",
                "type": "select",
                "value": [
                  {
                    "value": "",
                    "text": "Width of contents",
                    "selected": true
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
              "buttonlabel": {
                "label": "Button Label",
                "type": "input",
                "value": "Calculate"
              },
              "buttontype": {
                "label": "Button Type",
                "type": "select",
                "value": [
                  {
                    "value": "btn-default",
                    "text": "Default",
                    "selected": false
                  },
                  {
                    "value": "btn-primary",
                    "text": "Primary",
                    "selected": true
                  },
                  {
                    "value": "btn-info",
                    "text": "Info",
                    "selected": false
                  },
                  {
                    "value": "btn-success",
                    "text": "Success",
                    "selected": false
                  },
                  {
                    "value": "btn-warning",
                    "text": "Warning",
                    "selected": false
                  },
                  {
                    "value": "btn-danger",
                    "text": "Danger",
                    "selected": false
                  },
                  {
                    "value": "btn-inverse",
                    "text": "Inverse",
                    "selected": false
                  }
                ]
              },
              "calcurl": {
                "label": "Calc Engine Url",
                "type": "input",
                "value": "http://calculon.olmdemo.co.uk/calc/ws/calcService.cfc?method=calculate"
              },
              "calcproxy": {
                "label": "Proxy Path",
                "type": "input",
                "value": "/ServiceHandlers/GenericHandler.ashx"
              },
              "calcmodel": {
                "label": "Calculation Model Name",
                "type": "input",
                "value": ""
              },
              "calcsuccessurl": {
                "label": "Success Url",
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

            "title": "Calc Button V2",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "calcbuttonv2"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": ""
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
              "buttonsize": {
                "label": "Button Size",
                "type": "select",
                "value": [
                  {
                    "value": "",
                    "text": "Width of contents",
                    "selected": true
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
              "buttonlabel": {
                "label": "Button Label",
                "type": "input",
                "value": "Calculate"
              },
              "buttontype": {
                "label": "Button Type",
                "type": "select",
                "value": [
                  {
                    "value": "btn-default",
                    "text": "Default",
                    "selected": false
                  },
                  {
                    "value": "btn-primary",
                    "text": "Primary",
                    "selected": true
                  },
                  {
                    "value": "btn-info",
                    "text": "Info",
                    "selected": false
                  },
                  {
                    "value": "btn-success",
                    "text": "Success",
                    "selected": false
                  },
                  {
                    "value": "btn-warning",
                    "text": "Warning",
                    "selected": false
                  },
                  {
                    "value": "btn-danger",
                    "text": "Danger",
                    "selected": false
                  },
                  {
                    "value": "btn-inverse",
                    "text": "Inverse",
                    "selected": false
                  }
                ]
              },
              "calcurl": {
                "label": "Calc Engine V2 Url",
                "type": "input",
                "value": "https://46.245.248.9/calcengine/rest/rasCalculation"
              },
              "calcproxy": {
                "label": "Proxy Path",
                "type": "input",
                "value": "/ServiceHandlers/GenericHandler.ashx"
              },
              "calcmodel": {
                "label": "Calculation Model Name",
                "type": "input",
                "value": "Test"
              },
              "calcenvironment": {
                "label": "Calculation Model Environment",
                "type": "input",
                "value": "Test"
              },
              "calcsuccessurl": {
                "label": "Success Url",
                "type": "input",
                "value": ""
              },
              "user": {
                "label": "User Name",
                "type": "input",
                "value": "airburst8+salesdesigner@gmail.com"
              },
              "password": {
                "label": "Password",
                "type": "input",
                "value": "C0mmun1c8#R"
              },
              "tabindex": {
                "label": "Tab Index",
                "type": "input",
                "value": 0
              }
            }
          },
          {
            "title": "Input Button",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "textinput"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Text Input"
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
              "placeholder": {
                "label": "Placeholder",
                "type": "input",
                "value": ""
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
              "buttonlabel": {
                "label": "Button Label",
                "type": "input",
                "value": "Action"
              },
              "buttontype": {
                "label": "Button Type",
                "type": "select",
                "value": [
                  {
                    "value": "btn-default",
                    "text": "Default",
                    "selected": false
                  },
                  {
                    "value": "btn-primary",
                    "text": "Primary",
                    "selected": true
                  },
                  {
                    "value": "btn-info",
                    "text": "Info",
                    "selected": false
                  },
                  {
                    "value": "btn-success",
                    "text": "Success",
                    "selected": false
                  },
                  {
                    "value": "btn-warning",
                    "text": "Warning",
                    "selected": false
                  },
                  {
                    "value": "btn-danger",
                    "text": "Danger",
                    "selected": false
                  },
                  {
                    "value": "btn-inverse",
                    "text": "Inverse",
                    "selected": false
                  }
                ]
              },
              "buttonaction": {
                "label": "Action",
                "type": "input",
                "value": ""
              }
            }
          }
        ]
    };
}());
        