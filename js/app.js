/* global $:false */

// Declare namespaces
var FB = FB || {};
var FBData = FBData || {};
var FBModes = FBModes || {};

// Define FB function
FB = (function() {
    "use strict";

    var version = "0.7.7";                              // Version number
    var tabId = 1;
    var defId = 1;
    var vis = {};
    var def = [];

    // Initialise form object
    var init = function() {
        // Set options
        this.tabId = 1;                                 // Next Tab Index
        this.defId = 1;                                 // Next definition object id
        this.vis = {"rules": [], "triggers": []};     // Visibility Rules
        this.def = [];
        this.def[0] = FBData.form;                      // Set the first object with form attributes
        this.def[0].id  = 0;                            // Give it an index of 0
        this.def[0].version = version;                  // Form version number
        return this;
    };

    // Return the next definition object id
    var nextDefId = function() {
        return FB.defId++;
    };

    // Return the next tab index and increment
    var nextTabId = function() {
        return FB.tabId++;
    };

    // Get position in definition array where o.id === id
    // Used when we need to update the object
    var getPositionByIndex = function(id) {
        var pos = -1;
        // Make the id numeric
        id = parseInt(id);
        $.map(FB.def, function(o, i) {
            if (o.id === id) { pos = i; }
        });
        return pos;
    };

    // Shorthand to get definition item by id (from def array where o.id === id)
    // Usage example: var o = fb.d(id);
    var d = function(id) {
        var p = FB.getPositionByIndex(id);
        return FB.def[p];
    };

    // Tabindex functions
    // If no arguments, then renumber the entire form, starting from 1
    // If only an objectId, then delete and reduce the number of every higher Tab Index by 1
    // If both arguments, then process the new Tab Index
    var renumberTabIndex = function(objectId, ti) {
        var oldTi;

        // No args: renumber whole form
        if (objectId === undefined) {
            FB.tabId = 1;
            $.each(FB.utils.idSequence(), function(k, v) {
                var p = FB.getPositionByIndex(v);
                if (FB.def[p].fields.tabindex !== undefined) {
                    FB.def[p].fields.tabindex.value = FB.tabId++;
                }
            });
        } else {
            // Only an object id = deletion; reduce TI for every higher value
            if (ti === undefined) {
                // Check whether object has a tab index
                if (FB.d(objectId).fields.tabindex !== undefined) {
                    oldTi = FB.d(objectId).fields.tabindex.value;

                    // Walk through def object and find all higher tab index values
                    $.each(FB.def, function(k, v) {
                        if (v.fields.tabindex !== undefined) {
                            if ((v.id !== objectId) && (v.fields.tabindex.value > oldTi)) {
                                // Decrement tab index
                                v.fields.tabindex.value--;
                            }
                        }
                    });

                    // Reduce TabId by 1
                    FB.tabId--;
                }
            }

            // Both args: manually entered new tabindex to process
            else {
                // Ignore if ti > current maximum tabindex
                if (ti <= FB.tabId) {
                    oldTi = FB.d(objectId).fields.tabindex.value;

                    // Get the list of all objects with >= tabindex
                    // Ignore the object that we just changed (objectId)
                    $.each(FB.def, function(k, v) {
                        if (v.fields.tabindex !== undefined) {
                            if ((v.id !== objectId) && (v.fields.tabindex.value >= ti) && (v.fields.tabindex.value < oldTi)) {
                                // Increment tab index
                                v.fields.tabindex.value++;
                            }
                        }
                    });
                }
            }
        }
    };

    var removeItemFromDef = function(item) {
        // If the control is used in any vis rules as a trigger, display warning
        var t = $.grep(FB.vis.triggers, function(v) {
            return (parseInt(v.cid) === parseInt(item));
        });

        if (t.length > 0) {
            // Identify affected rules
            var rules = $.map(t, function(v) { return (v.rid); });

            // Delete the rule, triggers and any application, without warning
            $.each(rules, function(k, v) {
                FB.rulebuilder.changeRule(v, "delete", "noWarnings");
            });

            // Renumber tab indexes in the form if necessary
            FB.renumberTabIndex(item);

            // Remove the item from def object
            FB.def.splice(FB.getPositionByIndex(item), 1);
        } else {
            // No rules - just delete
            // Renumber tab indexes in the form if necessary
            FB.renumberTabIndex(item);

            // Remove the item from def object
            FB.def.splice(FB.getPositionByIndex(item), 1);
        }
    };

    // Store the layout and controls of the DOM form as a tree
    // Assumes even width for 1,2,3 or 4 cols
    var resortDef = function(pageId) {
        var defOut = [];

        // If a page is specified, then only clone the controls for that page
        // Else select every page
        var singlePage = (pageId !== undefined) ? true : false;
        var $p = (singlePage) ? $(".page[id=" + pageId + "]") : $(".page");

        $.each($p, function(iPage, page) {
            // Derive the definition id for the page and get the object
            var rows = [];
            var pageId = $(this).data("id");
            var pageObject = $.extend({}, FB.d(pageId));

            // Iterate over each column
            $.each($(".row", page), function(iRow, row) {
                var columns = [];
                // Iterate over each control
                // Test for Table Group; there can only be one in any row
                if ($(".table-group", row).length > 0) {
                    $.each($(".dropzone:not(.table-group-items)", row), function(iCol, col) {
                        // Get the set of control objects in the dropzone
                        var controls = [];
                        var childcontrols = [];
                        // Only add the table group
                        $.each($(".table-group[data-id]", col), function() {
                            // Add the table group control
                            var id = $(this).data("id");
                            var tg = $.extend({}, FB.d(id));
                            controls.push(tg);

                            // Add all child objects to the model
                            if (tg.children != "") {
                                $.each(tg.children, function(k, v) {
                                    childcontrols.push($.extend({}, FB.d(v)));
                                });
                            }
                        });
                        // Add record: col width and collection of control objects
                        columns.push({width: FB.utils.getWidth($(this).prop("class")), controls: controls, children: childcontrols});
                    });
                    rows.push({columns: columns});
                }
                // Otherwise, walk through columns and controls
                else {
                    $.each($(".dropzone", row), function(iCol, col) {
                        // Get the set of control objects in the dropzone
                        var controls = [];
                        $.each($("[data-id]", col), function() {
                            var id = $(this).data("id");
                            controls.push($.extend({}, FB.d(id)));
                        });
                        // Add record: col width and collection of control objects
                        columns.push({width: FB.utils.getWidth($(this).prop("class")), controls: controls});
                    });
                    rows.push({columns: columns});
                }
            });
            defOut.push({page: pageObject, rows: rows});
        });

        if (singlePage) {
            // Return just the page
            return ({"pages": defOut});
        } else {
            // Add any vis rules
            if (FB.vis.rules.length > 0) { FB.def[0].vis = FB.vis; }

            // Store form code from editor
            FB.code.store();

            // Return the whole form
            return ({
                "form": FB.def[0],
                "pages": defOut
            });
        }
    };

    // Return public methods
    return {
        version: version,
        tabId: tabId,
        vis: vis,
        def: def,
        defId: defId,
        init: init,
        nextDefId: nextDefId,
        nextTabId: nextTabId,
        getPositionByIndex: getPositionByIndex,
        pos: getPositionByIndex,
        d: d,
        removeItemFromDef: removeItemFromDef,
        resortDef: resortDef,
        renumberTabIndex: renumberTabIndex
    };

}());

FB.init();
