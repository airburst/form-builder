/* global $:false */
/*======================================================================*\
  Table Group Functions
\*======================================================================*/
// Use FB namespace
var FB = FB || {};

// Define page module
FB.tableGroup = (function () {
    "use strict";

    var addItem = function ($table) {
        var tid = $table.data("id");
        var o = FB.def[FB.pos(tid)];

        // Empty headings
        o.fields.headings.value = [];
        o.children = [];

        // Populate headings with labels from all controls in the dropzone 
        var $items = $(".table-group-items", $table);
        $.each($("[data-id]", $items), function (k) {
            // If data-colshow is true, Get label and add to headings object    //MF
            if ($(this).data("colshow") === true) {
                var $l = $("label.control-label", $(this));
                o.fields.headings.value.push({"text": $l.text(), "value": $(this).data("id")});
            }

            // Add control id to table group links
            o.children.push($(this).data("id"));
        });

        // Update the definition
        FB.def[FB.pos(tid)] = o;
    };

    var update = function ($table) { 
        var tid = $table.data("id");
        var o = FB.def[FB.pos(tid)];

        // Re-render the table from templates; this will empty the dropzone
        var t = FB.templates.componentTemplate["tablegroup"]({data: o});
        var $target = $table.closest(".dropzone");
        $target.html(t);

        // Get a live selector for the dropzone
        var $items = $(".table-group-items", FB.utils.$id(tid));

        // Add objects back into the dropzone (in order presented in o.children array)
        if (o.children !== undefined) {
            $.each(o.children, function (k, v) {
                // Get the object by id
                var linkObject = FB.d(v);

                // Append html from template
                $items.append(FB.designer.getComponentView(linkObject));

                // Add binding for FB.designer.updateProperties
                FB.utils.$id(v).bind("click", {ths: FB.designer}, FB.designer.updateProperties);
            });
        }

        // Add click binding to table object
        FB.utils.$id(tid).bind("click", {ths: FB.designer}, FB.designer.updateProperties); 

        // And drop zone
        FB.events.addTableGroupBindings(tid);

        return false;
    };

    // Remove the item (index) from the children array in the parent TableGroup
    var removeItem = function (id, tableId) {
        // Convert the id to a string
        id = id.toString();
        var children = FB.def[FB.pos(tableId)].children; 
        if (children !== undefined){
            // Find position of id and remove from array
            var pos = children.indexOf(id); 
            if (pos > -1) {
                // Remove from children array
                children.splice(pos, 1); 

                // Update the TableGroup definition object
                FB.def[FB.pos(tableId)].children = children;

                // And remove same position from headings array
                FB.def[FB.pos(tableId)].fields.headings.value.splice(pos,1);
            }
        }

        // Redraw the TableGroup
        var $tg = FB.utils.$id(tableId);
        update($tg);

        return false;
    };

    // Remove the item (index) from the column headings in parent TableGroup
    // BUT leave the control in place
    var removeColumn = function (id, tableId) {
        // Convert the id to a string
        id = id.toString();
        var children = FB.def[FB.pos(tableId)].children; 
        if (children !== undefined){
            // Find position of id and remove from array
            var pos = children.indexOf(id); 
            if (pos > -1) {
                // Remove item from headings array ONLY
                FB.def[FB.pos(tableId)].fields.headings.value.splice(pos,1);
            }
        }

        // Redraw the TableGroup
        var $tg = FB.utils.$id(tableId);
        update($tg);

        return false;
    };

    // Update a TableGroup headings
    var updateHeadings = function (tgId) {
        // Get sorted children id list for Table Group
        var children = FB.d(tgId).children;
        if (children !== undefined) {
            // Get headings for TableGroup
            var headings = FB.d(tgId).fields.headings.value;
            var newHeadings = [];

            // Update them in order, using 
            $.each(children, function (k, v) {
                // Is the child a column heading?
                var show = FB.d(v).fields.columnheading.value;
                if (show) {
                    // Get the heading text for each id (value) in order
                    var text = "";
                    $.map(headings, function (id) {
                        if (parseInt(v) === parseInt(id.value)) {
                            text = id.text;
                        }
                    });
                    newHeadings.push({"text": text, "value": parseInt(v), "selected": false});
                }
            });

            // Update the def object for Table Group
            FB.def[FB.pos(tgId)].fields.headings.value = newHeadings;

            // Redraw the Table Group
            update(FB.utils.$id(tgId));
        }
    };

    return {
        addItem: addItem,
        removeItem: removeItem,
        removeColumn: removeColumn,
        update: update,
        updateHeadings: updateHeadings
    };

}());
