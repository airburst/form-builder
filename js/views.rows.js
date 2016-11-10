/* global $:false */
/*======================================================================*\
  Right-click context menu handler for rows
  Event Handlers and Functions for Rows
\*======================================================================*/
var FB = FB || {};
var FBData = FBData || {};

// Define rows module
FB.rows = (function () {
    "use strict";

    var contextMenu = function (e){
        // Highlight the row
        ($(this).addClass("over"));
        // Get current page from select
        var p = $("#page").val();

        // Get position of this row
        var $rows = $("#" + p + " .row");
        var pos = $rows.index($(this));
        var count = $rows.length - 1;

        // Show or hide appropriate menu entries
        // e.g. don"t show "Move Up" if we are on the top row
        (pos === 0) ? $("#rowmoveup").hide() : $("#rowmoveup").show();
        (pos === count) ? $("#rowmovedown").hide() : $("#rowmovedown").show();

        // Update menu links with position index of clicked row
        $("#rowmoveup a").attr("onclick", "FB.rows.moveUp(" + pos + ");");
        $("#rowmovedown a").attr("onclick", "FB.rows.moveDown(" + pos + ");");
        $("#rowdelete a").attr("onclick", "FB.rows.deleteRow(" + pos + ");");

        // Show menu
        $("#menu").css({
          top: e.pageY + "px",
          left: e.pageX + "px"
        }).show();
        return false;
    };

    // Add new container to form zone with n columns
    var add = function (n){
        // Create skeleton html
        var containerHtml = "<div class=\"row\">";
        for (var i = 0; i < n; i++){
            // Assumes equal column widths
            containerHtml += "<div class=\"col-md-" + (12 / n) + " dropzone\" droppable=\"true\"></div>";
        }
        containerHtml += "</div>";
        
        // Append to current page in form zone
        var p = $("#page").val();
        $("#" + p).append(containerHtml);

        // Add event bindings
        $.each($(".dropzone"), function (k){
            var events = $._data( $(".dropzone")[k], "events" );
            if (events === undefined) {
                $(this).bind("dragenter", FB.events.dragEnter); 
                $(this).bind("dragleave", FB.events.dragLeave); 
                $(this).bind("dragover", FB.events.dragOver);
                $(this).bind("drop", FB.events.dropEvent);
                $(this).bind("dragend", FB.events.dragEnd);
            }
        });

        // Bind context menu to row
        $("#" + p + " .row:last").bind("contextmenu", contextMenu);

        // And make it sortable
        FB.events.makeSortable($("#form-zone .row:last .dropzone"));
    };

    var renumberTabIndexes = function ($top, $bottom) {
        // Count the number of controls with tabindex values in top and bottom rows
        var topCount = $("[tabindex]", $top).length;
        var bottomCount = $("[tabindex]", $bottom).length;

        $.each($("[tabindex]", $top), function () {
            // Get old tabindex value (as integer)
            var oldTi = parseInt($(this).attr("tabindex"));

            // Reduce by count
            $(this).attr("tabindex", oldTi - bottomCount);

            // Update def object
            FB.def[FB.pos(FB.utils.idByElement($(this)))].fields.tabindex.value = oldTi - bottomCount;
        });

        $.each($("[tabindex]", $bottom), function () {
            // Get old tabindex value (as integer)
            var oldTi = parseInt($(this).attr("tabindex"));

            // Increase by count
            $(this).attr("tabindex", oldTi + topCount);

            // Update def object
            FB.def[FB.pos(FB.utils.idByElement($(this)))].fields.tabindex.value = oldTi + topCount;
        });
        return false;
    };

    // Move a row up (from right-click menu)
    var moveUp = function (row){
        var p = $("#page").val();
        var $top = $("#" + p + " .row:nth-child(" + (row) + ")");
        var $bottom = $("#" + p + " .row:nth-child(" + (row + 1) + ")");

        // Move top above bottom in DOM
        $top.before($bottom);

        // Renumber affected tab index values
        renumberTabIndexes($bottom, $top);

        // Check vis rules
        FB.rulebuilder.checkAllVisRules();

        return false;
    };

    // Move a row down (from right-click menu)
    var moveDown = function (row) {
        var p = $("#page").val();
        var $top = $("#" + p + " .row:nth-child(" + (row + 1) + ")");
        var $bottom = $("#" + p + " .row:nth-child(" + (row + 2) + ")");

        // Move top above bottom in DOM
        $bottom.after($top);

        // Renumber affected tab index values
        renumberTabIndexes($bottom, $top);

        // Check vis rules
        FB.rulebuilder.checkAllVisRules();

        return false;
    };

    // Delete a row (from right-click menu)
    var deleteRow = function (row) {
        // Remove objects from Def
        var p = $("#page").val();
        var $r = $("#" + p + " .row:nth-child(" + (row + 1) + ")");

        $.each($("div[data-id]", $r), function(){
            var item = $(this).attr("data-id");
            FB.designer.deleteComponent(item);
        });

        // Delete row
        $r.remove();

        // Check vis rules
        FB.rulebuilder.checkAllVisRules();

        return false;
    };

    return {
        contextMenu: contextMenu,
        add: add,
        moveUp: moveUp,
        moveDown: moveDown,
        deleteRow: deleteRow
    };

}());
