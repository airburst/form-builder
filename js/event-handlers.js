/* global $:false, bootbox:false */
var FB = FB || {};
var FBData = FBData || {};

// Define events module
FB.events = (function () {
    "use strict";

    // Get single control object from full data object (views.js)
    // e.g. getFields("Inputs", "Text Input");
    var getFields = function (sectionTitle, controlTitle) {
        var fields = "";

        // Get json object for section by title (inputList)
        var section = $.grep(FB.designer.toolsData, function (e) {
            return e.title === sectionTitle;
        })[0];

        if (section !== undefined) {
            // Get control object that matches title
            var con = $.grep(section.controls, function (e) {
                return e.title === controlTitle;
            })[0];

            // Assign list of fields
            fields = {
                "title": sectionTitle,
                "controltype": (con.controltype !== undefined) ? con.controltype : FB.utils.shorten(controlTitle),
                "id": FB.nextDefId(),
                "fields": con.fields
            };
        }

      // Return list of fields
      return fields;
    };

    // Add validation fields to a new object when dropped into a dropzone
    var addValidationFields = function (objectId) {
        var id = FB.pos(objectId);

        // Establish whether to apply general attributes, multiple (checkbox, select) or radio attributes
        var ct = FB.def[id].controltype;
        var vo = FBData.val.ValObject();
        if (ct.substring(0, 8) !== "multiple") {
            // General - add them all
            $.each(vo.general, function (k, v) { FB.def[id].fields[k] = v; });
        }
        else {
            // Multiple - add the reduce set to the first input only
            $.each(vo.multi, function (k, v) { FB.def[id].fields[k] = v; });
        }
        return false;
    };

    // Add event fields to a new object when dropped into a dropzone
    var addEventFields = function (objectId) {
        var id = FB.pos(objectId);   
        $.each(FBData.events.EventObject(), function(k, v) { 
            FB.def[id].fields[k] = v;
        });
    };

    // Add vis fields to a new object when dropped into a dropzone
    var addVisFields = function (objectId) {
      var id = FB.pos(objectId); 
      $.each(FBData.vis.VisObject(), function (k, v) {
        FB.def[id].fields[k] = v;
      });
    };

    /*======================================================================*\
      Drag and drop handlers
    \*======================================================================*/
    var ignoreDrag = function (e) {
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
    };

    var dragStart = function (e) {
      $(e.target).addClass("dragging");

      // Set payload
      var dt = e.originalEvent.dataTransfer;
      dt.effectAllowed = "move";

      // Text
      dt.setData("text/html", this.outerHTML);

      // Drag icon
      /*var dragIcon = document.createElement("img");
      dragIcon.src = "css/images/dragdrop/textinput.png";
      dragIcon.width = 100;
      dt.setDragImage(dragIcon, 0, 0);*/

      // Set an event attribute, which need to test event binding after drop
      dt.setData("event", $(e.target).attr("data-title"));

      // Data Object
      var title = (($(this).data("name")) !== undefined) ? $(this).data("name") : $(this).data("title");
      var fields = getFields($(this).data("section"), title);
      dt.setData("object", JSON.stringify(fields));

      // Hide the properties panel
      FB.designer.emptyProperties();
    };

    var dragEnter = function () {
      $(this).addClass("over");
    };

    var dragLeave = function () {
        $(this).removeClass("over");      
    };

    var dragEnd = function () {
      $(this).removeClass("over");
    };

    var dragOver = function (e) {
        ignoreDrag(e);

        var mouseHeight = e.originalEvent.pageY,
            layerHeight = e.currentTarget.clientHeight,
            mids = [],
            zone,
            offset = e.currentTarget.getBoundingClientRect().top;

        // Create array of heights of the middles of all child objects
        $.each(e.currentTarget.childNodes, function () {
            mids.push(offset + $(this)[0].offsetTop + $(this)[0].offsetHeight / 2);
        });

        // Detect which child controls the mouse is between
        zone = $.grep(mids, function (v, k) {
            return (mouseHeight >= v);
        });

        // Show placeholder dropzone at position
        //console.log(zone.length);
    };

    var dropEvent = function (e) {
        ignoreDrag(e);
        var dt = e.originalEvent.dataTransfer;
        //var text = dt.getData("text/html");

        // If object is valid, render appropriate component template with data in form-zone
        if (dt.getData("object") !== "") {
            // If user is dropping a Table Group, prevent them if there is already one or
            // more controls in the dropzone
            if ((dt.getData("event") === "Table Group") && ($("[data-id]", $(this)).length) > 0) {
                bootbox.alert("You can only place Table Group controls in empty drop zones.");
            }    
            else {
                var o = JSON.parse(dt.getData("object"));
                
                // Convert object into component view
                $(this).append(FB.designer.getComponentView(o, "new"));

                // Add object instance to definition object
                var l = FB.def.length;
                FB.def[l] = o;

                // Add validation and events fields to the def object
                // Snippets will already have these attributes
                if (o.title !== "Snippets") {
                    addValidationFields(o.id);     
                    addEventFields(o.id);
                    addVisFields(o.id);
                }

                // Add click binding
                $("div[data-id=" + o.id + "]").bind("click", {ths: FB.designer}, FB.designer.updateProperties);

                // Special actions for TableGroups
                if (dt.getData("event") === "Table Group") {
                   
                    // Add dropzone binding to tables
                    addTableGroupBindings(o.id);

                    // Set a links object
                    FB.def[l].children = [];

                    // Disable binding on this dropzone (only one Table Group allowed in a row)
                    $(this).unbind("drop");
                }
            }
        }

        $(this).removeClass("over");
        return false;
    };


    var tableDropEvent = function (e) {
        ignoreDrag(e);
        var dt = e.originalEvent.dataTransfer;

        // If object is valid, render appropriate component template with data in form-zone
        if (dt.getData("object") != "") {
            // Do not allow tables to be dropped and nested into tables!
            if ((dt.getData("event") !== "Table Group") && (dt.getData("event").indexOf("Checkbox") === -1)) {
                var o = JSON.parse(dt.getData("object"));

                // Add object instance to definition store
                var l = FB.def.length;
                FB.def[l] = o;

                // Add validation, events and visibility fields to the def object
                addValidationFields(o.id);
                addEventFields(o.id);
                addVisFields(o.id);

                // Add ColumnHeading field
                var colHead = true;
                if ((o.controltype === "hiddeninput") || (o.controltype === "statictext")) { colHead = false; }
                FB.def[l].fields["columnheading"] = {"label": "Column Heading", "type": "checkbox", "value": colHead};
                FB.def[l].fields["columndata"]    = {"label": "Column Data", "type": "checkbox", "value": true};

                // Convert object into component view
                $(this).append(FB.designer.getComponentView(o, "new"));

                // Get reference to parent table
                var $table = $(this).parent();

                // Add parent reference to object
                FB.def[l].parent = $table.data("id");

                // Update column headers in table with labels
                FB.tableGroup.addItem($table);

                // Redraw the table
                FB.tableGroup.update($table);
            }
            else {
            bootbox.alert("You cannot add " + dt.getData("event") + " controls into a Table Group");
            }
        }
        $(this).removeClass("over");
        return false;
    };


    /*======================================================================*\
      Sortable controls within a dropzone
    \*======================================================================*/
    // Make element sortable using jQuery-UI
    var makeSortable = function ($element) {
        $element.sortable({
            tolerance: "pointer",
            revert: true,
            placeholder: "span2 well placeholder",  
            forceHelperSize: true,

            sort: function() {
                // Hide the properties panel
                FB.designer.emptyProperties();
            },

            stop: function (e) {
                // Get the tabindex order for controls in dropzone after resorting
                var newTabOrder = [];
                $.each($(".form-group", e.target), function () {
                    var o = FB.d($(this).attr("data-id"));               
                    if(o.fields.tabindex !== undefined) { newTabOrder.push(o.fields.tabindex.value); }
                });

                // Then sort the list and apply back to control objects
                newTabOrder.sort();
                $.each($(".form-group", e.target), function(){
                    var o = FB.d($(this).attr("data-id"));
                    if(o.fields.tabindex !== undefined) { 
                        o.fields.tabindex.value = newTabOrder[0]; 
                        newTabOrder.splice(0, 1); 
                    }
                });

                // If dropzone is in a TableGroup, return the sorted array of children ids
                if ($(this).hasClass("table-group-items")) {
                    var $table = $(this).parent();
                    var tableId = $table.attr("data-id"); 

                    // Assign new order to TableGroup object definition
                    FB.def[FB.pos(tableId)].children = $(this).sortable("toArray");  

                    // Reorder the Headings list and redraw Table Group
                    FB.tableGroup.updateHeadings(tableId);
                }

                // If the control has a vis rule applied, ensure that the rule is still valid,
                // i.e. the constituent controls in the rule are still all above this one
                FB.rulebuilder.checkAllVisRules();
            }
        });
    };


    // Add bindings to table group dropzone
    var addTableGroupBindings = function (tableId) {
        $("[data-id=" + tableId + "] .dropzone").bind("dragenter", dragEnter);
        $("[data-id=" + tableId + "] .dropzone").bind("dragleave", dragLeave); 
        $("[data-id=" + tableId + "] .dropzone").bind("dragover", dragOver);
        $("[data-id=" + tableId + "] .dropzone").bind("drop", tableDropEvent);
        $("[data-id=" + tableId + "] .dropzone").bind("dragend", dragEnd);
        makeSortable($("[data-id=" + tableId + "] .dropzone"));
    };

    var tgButtonAction = function ($button) {
      // do nothing when the action button is pressed in design mode
    };

    return {
        dragStart: dragStart,
        dragEnter: dragEnter,
        dragLeave: dragLeave,
        dragEnd: dragEnd,
        dragOver: dragOver,
        dropEvent: dropEvent,
        tableDropEvent: tableDropEvent,
        makeSortable: makeSortable,
        addVisFields: addVisFields,
        addTableGroupBindings: addTableGroupBindings,
        tgButtonAction: tgButtonAction
    };

}());
