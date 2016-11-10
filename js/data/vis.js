var FBData = FBData || {};

// New page class
FBData.vis = (function () {
    "use strict";

    var Vis = function() { 
        var opts = {
            "data-vis": {
                "label": "Visibility Rule",
                "type": "select",
                "value": []
            }
        };
        return opts;
    };

    return {
        VisObject: Vis
    };
}());
