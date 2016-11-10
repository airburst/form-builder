var FBData = FBData || {};

// New page class
FBData.events = (function () {
    "use strict";

    var evtOptions = function () {
        var opts = {
          "data-event-type": {
            "label": "Event",
            "type": "select",
            "value": [
              {
                "value": "",
                "text": "",
                "selected": true
              },
              {
                "value": "click",
                "text": "Click",
                "selected": false
              },
              {
                "value": "change",
                "text": "Change",
                "selected": false
              }
            ]
          },
          "data-event-name": {
            "label": "Event Name",
            "type": "input",
            "value": ""
          },
          "data-event-model": {
            "label": "Event Model",
            "type": "select",
            "value": [
              {
                "value": "",
                "text": "",
                "selected": true
              },
              {
                "value": "pub",
                "text": "Publisher",
                "selected": false
              },
              {
                "value": "sub",
                "text": "Subscriber",
                "selected": false
              },
              {
                "value": "custom",
                "text": "Custom",
                "selected": false
              }
            ]
          },
          "data-event-integration": {
            "label": "Integration system name",
            "type": "input",
            "value": ""
          },
          "data-event-id": {
            "label": "Integration Id",
            "type": "input",
            "value": ""
          }
        };
      return opts;
    };

    return {
        EventObject: evtOptions
    };
}());
