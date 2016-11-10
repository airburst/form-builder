/* global $:false, bootbox:false, window:false */

// Declare runtime namespace
var FBRun = FBRun || {};

/*======================================================================*\
  Standard Form Actions: Next, Back, Submit
\*======================================================================*/
FBRun.nav = (function() {
    "use strict";

    // Private function to set the page height after navigation
    var setHeight = function() {
        // If form contents fit into the current screen, then set form container
        // height to 100% of the screen (minus footer)
        var $form = $(".form-fb"),
            formHeight,
            footerHeight,
            bodyHeight;

        $form.removeAttr("style");
        formHeight = $form.height();
        footerHeight = $(".footer").height();

        // var t = parseInt($(".footer").css("padding-top").replace("px", ""));
        // var b = parseInt($(".footer").css("padding-bottom").replace("px", ""));

        bodyHeight = $("body").height() - footerHeight - 30;
        if (formHeight < bodyHeight) { $form.height(bodyHeight); }

        // Sort out affix nav menu width
        // thisPage = $('.page:not(.hide)').attr('id');
        // $('#' + thisPage + ' .sidenav').width($('#' + thisPage + ' .sidenav-container').width());

        return false;
    };

    var getNextPage = function(page) {
        var p = "";
        var $allPages = $("#" + page).nextAll().not("[data-hidden]");
        $.each($allPages, function(k) {
            if (k === 0) { p = $(this).attr("id"); }
        });
        return p;
    };

    var getBackPage = function(page) {
        var p = "";
        var $allPages = $("#" + page).prevAll().not("[data-hidden]");
        $.each($allPages, function(k) {
            if (k === 0) { p = $(this).attr("id"); }
        });
        return p;
    };

    var moveNext = function(page) {
        // Validate this section
        if ($(FBRun.defaults.formContainer).parsley(FBRun.parsleyOptions).validate(page) === true) {
            // Identify the next visible page
            var next = getNextPage(page);

            // Show the next page and hide all others
            $(".page[id!=" + next + "]").addClass("hide");
            $("#" + next).removeClass("hide");

            // Set the current navigation pill to active and add click Bindings
            var $pill = $(".sidenav li[data-page=" + next + "]");
            $pill.addClass("active");
            $pill.removeClass("disabled");
            $("a", $pill).attr("onclick", "FBRun.nav.moveTo('" + next + "')");

            // Remove active class from last page
            $(".sidenav li[data-page=" + page + "]").removeClass("active");

            // Set form to full screen height (for CSS)
            setHeight();

            // Reset parsley style
            $(FBRun.defaults.formContainer).parsley(page).reset();
        }
    };

    var moveBack = function(page) {
        // Identify the last visible page
        var back = getBackPage(page);

        $(".page[id!=" + back + "]").addClass("hide");
        $("#" + back).removeClass("hide");

        // Set the current navigation pill to active and add click Bindings
        var $pill = $(".sidenav li[data-page=" + back + "]");
        $pill.addClass("active");

        // Remove active class from last page
        $(".sidenav li[data-page=" + page + "]").removeClass("active");

        // Set form to full screen height (for CSS)
        setHeight();
    };

    var moveTo = function(page) {  
        // Show the appropriate page
        $(".page[id!=" + page + "]").addClass("hide");
        $("#" + page).removeClass("hide");

        // Set the navigation pill to active
        var $pill = $(".sidenav li[data-page=" + page + "]");
        $pill.addClass("active");
        $pill.removeClass("disabled");
        $("a", $pill).attr("onclick", "FBRun.nav.moveTo('" + page + "')");

        // Deactivate last pill
        $(".sidenav li").not("[data-page=" + page + "]").removeClass("active");

        // Set form to full screen height (for CSS)
        setHeight();
    };

    var openWindow = function(html, margin) {
        // Get client settings
        if (margin === undefined) { margin = 40; }
        var w = $(window).width();
        var h = $(window).height();

        w = w - (2 * margin);
        h = h - (2 * margin);

        var win = window.open("", "_blank", "toolbar=no, scrollbars=yes, resizable=yes, top=" + margin + ", left=" + margin + ", width=" + w + ", height=" + h);

        if (html !== undefined) {
            win.document.write(html);
        }
    };

    var showFormData = function() {
        // Create child popup window with div to place table
        var tableHtml = "<!DOCTYPE html><html><head><meta charset=\"utf-8\">" +
                        "<link rel=\"stylesheet\" href=\"assets/bootstrap/css/bootstrap.min.css\" />" + 
                        "<link rel=\"stylesheet\" href=\"css/style.css\">" +
                        "</head><body><div class=\"container\">" +
                        "<table id=\"table\" class=\"table table-bordered\"><tr><th>Id</th><th>Name</th><th>Label</th><th>Value</th></tr>";
        $.each(FBRun.inputs(), function(k, v) {
            tableHtml += "<tr>" +
                         "<td>" + v.id    + "</td>" +
                         "<td>" + v.name  + "</td>" +
                         "<td>" + v.label + "</td>" + 
                         "<td>" + v.val   + "</td>" +
                         "</tr>";
        });
        tableHtml += "</table></div></body></html>";
        
        // Popup
        openWindow(tableHtml, 200);
        // Close original
        //self.close();
        return false;
    };

    // Overrides submit button on last page for client-side implementation
    var submitAction = function(page) {    
        // Get last page id -- we have already validated other pages
        if ($(FBRun.defaults.formContainer).parsley(FBRun.parsleyOptions).validate(page) === true) {
            // Disable the button
            $('.btn-submit').attr('disabled', 'disabled');

            // Form action
            showFormData();
            return false;
        }
    };

    // Public methods
    return {
        moveNext: moveNext,
        moveBack: moveBack,
        moveTo: moveTo,
        showFormData: showFormData,
        submitAction: submitAction,
        setHeight: setHeight
    };

})();
