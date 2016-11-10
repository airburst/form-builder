var FBData = FBData || {};

// New page class
FBData.inputs = (function () {
    "use strict";

    return {
        list: [
          {
            "title": "Text Input",
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
              }
            }
          },
          {
            "title": "Static Text",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "statictext"
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
              "text": {
                "label": "Text",
                "type": "textarea",
                "value": "Type text here..",
                "html": "true"
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
              "class": {
                "label": "Class",
                "type": "input",
                "value": ""
              }
            }
          },
          {
            "title": "Hidden Input",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "hiddeninput"
              },
              "value": {
                "label": "Value",
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
              }
            }
          },
          {
            "title": "Date Input",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "dateinput"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Date Input"
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
              "constraint": {
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
              },
            }
          },
          {
            "title": "Password Input",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "passwordinput"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Password Input"
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
              }
            }
          },
          {
            "title": "Prepended Text",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "prependedtext"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Prepended Text"
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
              "prepend": {
                "label": "Prepend",
                "type": "input",
                "value": "prepend"
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
              }
            }
          },
          {
            "title": "Appended Text",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "appendedtext"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Appended Text"
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
              "append": {
                "label": "Append",
                "type": "input",
                "value": "append"
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
              }
            }
          },
          {
            "title": "Text Area",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "textarea"
              },
              "label": {
                "label": "Label Text",
                "type": "input",
                "value": "Text Area"
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
              "rows": {
                "label": "Number of rows",
                "type": "input",
                "value": "2"
              },
              "textarea": {
                "label": "Default Text",
                "type": "textarea",
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
              }
            }
          },
          {
            "title": "Alert",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "alert"
              },
              "type": {
                "label": "Alert Type",
                "type": "select",
                "value": [
                  {
                    "value": "alert-default",
                    "text": "Default",
                    "selected": false
                  },
                  {
                    "value": "alert-success",
                    "text": "Success",
                    "selected": false
                  },
                  {
                    "value": "alert-info",
                    "text": "Information",
                    "selected": false
                  },
                  {
                    "value": "alert-warning",
                    "text": "Warning",
                    "selected": true
                  },
                  {
                    "value": "alert-danger",
                    "text": "Danger",
                    "selected": false
                  }
                ]
              },
              "heading": {
                "label": "Alert Heading",
                "type": "input",
                "value": "<h4>Alert heading</h4>",
                "html": "true"
              },
              "text": {
                "label": "Alert Text",
                "type": "textarea",
                "value": "<p>Alert text</p>",
                "html": "true"
              },
              "dismissable": {
                "label": "Dismissable",
                "type": "checkbox",
                "value": true
              }
            }
          },
          {
            "title": "Panel",
            "fields": {
              "id": {
                "label": "ID / Name",
                "type": "input",
                "value": "panel"
              },
              "type": {
                "label": "Panel Type",
                "type": "select",
                "value": [
                  {
                    "value": "default",
                    "text": "Default",
                    "selected": true
                  },
                  {
                    "value": "primary",
                    "text": "Primary",
                    "selected": false
                  },
                  {
                    "value": "success",
                    "text": "Success",
                    "selected": false
                  },
                  {
                    "value": "info",
                    "text": "Information",
                    "selected": false
                  },
                  {
                    "value": "warning",
                    "text": "Warning",
                    "selected": false
                  },
                  {
                    "value": "danger",
                    "text": "Danger",
                    "selected": false
                  }
                ]
              },
              "heading": {
                "label": "Panel Heading",
                "type": "input",
                "value": "<h4>Panel heading</h4>",
                "html": "true"
              },
              "body": {
                "label": "Panel Text",
                "type": "textarea",
                "value": "<p>Panel body text</p>",
                "html": "true"
              }
            }
          }
        ]
    };
}());

