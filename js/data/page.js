var FBData = FBData || {};

// New page class
FBData.page = (function () {
    "use strict";

    return {

        Page: function () {
            var p = {
                // Properties
                "title": "Page",
                "fields": {
                    "id": {
                        "label": "Page Id",
                        "type": "hidden",
                        "value": "Page"
                    },
                    "name": {
                        "label": "Page Name",
                        "type": "input",
                        "value": "Step"
                    },

                    // Events
                    "data-event-next-label": {
                        "label": "Next Button Label",
                        "type": "input",
                        "value": "Next"
                    },
                    "data-event-next-action": {
                        "label": "Next Button Action",
                        "type": "input",
                        "value": ""
                    },
                    "data-event-back-label": {
                        "label": "Back Button Label",
                        "type": "input",
                        "value": "Back"
                    },
                    "data-event-back-action": {
                        "label": "Back Button Action",
                        "type": "input",
                        "value": ""
                    }
                }
            };
            return p;
        }
    };
}());

// Example: var p = new FBData.page.Page()
