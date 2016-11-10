/* global $:false, bootbox:false */
/*======================================================================*\
  Page Functions
\*======================================================================*/
// Use FB namespace
var FB = FB || {};
var FBData = FBData || {};

// Define page module
FB.page = (function () {
    "use strict";

    var maxPage = function () {
        var m = 1;
        $.each($("#page option"), function(k) {
            var n = parseInt(($(this).val()).substr(1));
            m = Math.max(m, n);
        });
        return "p" + m; // Page ids are pNNN
    };

    var create = function (o) {
        // Create new page div in form-zone
        $("#form-zone").append(FB.templates.pageTpl({data: o}));

        // Add option to page select
        var pId = o.fields.id.value;
        var pName = o.fields.name.value;
        $("#page").append("<option value=\"" + pId + "\" data-defid=\"" + o.id + "\">" + pName + "</option>");

        // Select the new page
        $("#page").val(pId);
        $("#page").trigger("change");

        // Add a full span container to the new page with bindings
        // Note: we have to do this after the option has been added to select
        FB.rows.add(1);

        // Add to definition object
        var l = FB.def.length;
        FB.def[l] = o;

        // Add visiblity fields
        FB.events.addVisFields(o.id);

        // Update Page-name above form
        $("#page-name").text(pName);
    };

    var add = function (first) {
        var n, next;
        if (first !== undefined) {
            n = 1;
            next = "p1";
        }
        else {
            // Get largest page in list
            var p = maxPage();
            // Get digits and increment
            n = parseInt(p.substring(1)) + 1;
            next = "p" + n;
        }

        // Create page object
        var o = new FBData.page.Page();
        o.id = FB.nextDefId();
        o.fields.id.value = next;
        o.fields.name.value = "Page " + n;

        // Prompt for page name
        if (first === undefined) {
            bootbox.prompt("Enter new page or step name", function (result) {
                if ((result !== null) && (result != "")) {
                    // Update page name                                           
                    o.fields.name.value = result;
                    create(o, n);
                }
                /*else {
                // Cancel - do nothing
                }*/
            });
        }
        else {
            create(o, n);
        }
    };

    var deletePage = function () {
        // if only one page, do not delete
        if ($(".page").length > 1) {

            // Get last page in list
            var p = $("#page").val();   
            var pageId = $("#" + p).data("id");   

            // Remove items from definition object
            $.each($("#" + p + " div[data-id]"), function() {
                FB.removeItemFromDef($(this).attr("data-id"));
            });

            // Delete from form-zone
            $("#" + p).remove();

            // Delete option from select
            $("#page option[value=" + p + "]").remove();

            // Cascade a reduction in page numbers for all later pages
            // Also need to make same change to def object
            $.each($(".page"), function(k) {
                var id = $(this).attr("id");
                var i = parseInt(id.substring(1));
                /*var pageDefId = $(this).data("defid");*/

                if (i > (k + 1)) {
                    var newId = "p" + (k + 1);

                    // Change the div id
                    $(this).attr("id", newId);

                    // Change page select option id
                    $("#page option[value=" + id + "]").val(newId);

                    // Change def object
                    var search = ("p" + (k + 2));        
                    var found = $.grep(FB.def, function (v) {
                        return (v.fields.id.value === search);
                    });       
                    FB.def[FB.pos(found[0].id)].fields.id.value = newId;

                    // Change page select option text
                    $("#page option[value=" + id + "]").text(FB.def[FB.pos(found[0].id)].fields.name.value);
                }
            });

            // Remove the page from definition object
            FB.removeItemFromDef(pageId);
        }

        // Refresh page view to p1
        $("#page").trigger("change");
    };

    /*======================================================================*\
      Page select change handler
    \*======================================================================*/
    var clickPage = function () {  
        // Hide all page divs apart from selected
        var p = $("#page").val();
        var id = $("#page option[value=" + p + "]").data("defid");

        // Update Page-name above form
        $("#page-name").text($("[data-id=" + id + "]").attr("name"));

        // Show page properties
        FB.designer.showProperties(FB.d(id), id);
    };

    var changePage = function () {
        // Hide all page divs apart from selected
        var p = $("#page").val();
        var $section = $(".page[id!=" + p + "]");

        $section.addClass("hide");
        $("#" + p).removeClass("hide");

        // Change the page element to show current page name
        $("#page-name").text($("#page option[value=" + p + "]").text());
    };

    return {
        maxPage: maxPage,
        create: create,
        add: add,
        deletePage: deletePage,
        clickPage: clickPage,
        changePage: changePage
    };

}());
