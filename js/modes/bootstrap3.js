/* global $:false */
/*======================================================================*\
  Mode file for Bootstrap 3.3.0
\*======================================================================*/
// Use FB namespace
var FB = FB || {};
var FBModes = FBModes || {};

FBModes.bootstrap3 = (function () {
    "use strict";

    var id   = "bootstrap3";
    var name = "Bootstrap 3";

    // Header HTML
    var header = function (title) {
        var h = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>" + 
            "<title>" + title + "</title>" +
            "<link rel=\"stylesheet\" href=\"assets/bootstrap/css/bootstrap.min.css\"/>" +
            "<link rel=\"stylesheet\" href=\"css/jquery-ui.min.css\"/>" +
            "<link rel=\"stylesheet\" href=\"assets/datepicker/css/datepicker.css\"/>" +
            "<link rel=\"stylesheet\" href=\"css/spinners.css\"/>" +
            "<link rel=\"stylesheet\" href=\"css/style.css\" media=\"screen\"/>" +
            "<link rel=\"stylesheet\" href=\"css/print.css\" media=\"print\"/>" +
            "<!--[if lt IE 9]>" +
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/ie8.css\"/>" +
            "<script src=\"js/libs/html5shiv.min.js\"></script>" +
            "<script src=\"js/libs/respond.min.js\"></script>" +
            "<![endif]-->" +
            "<!--[if IE]><script type=\"text/javascript\" src=\"js/libs/excanvas.js\"></script><![endif]-->" +
            "</head><body class=\"fb-body\">" +
            "<div class=\"fb-wrapper\" id=\"fb-main\">" +
            "<form role=\"form\" class=\"form-horizontal form-fb\" name=\"" + title + "\">" +
            "<div class=\"container container-form\">";
        return h;
    };

    // Footer HTML
    var footer = function () {
        var f = "</div></form>" +
            "</div>" +
            "<div class=\"spinner-container\"></div>" +
            "<script src=\"js/libs/jquery-1.11.1.min.js\"></script>" +
            "<script src=\"js/libs/jquery-ui.min.js\"></script>" +
            "<script src=\"assets/bootstrap/js/bootstrap.min.js\"></script>" +
            "<script src=\"assets/datepicker/js/bootstrap-datepicker.js\"></script>" +
            "<script src=\"js/libs/bootbox.js\"></script>" +
            "<script src=\"js/libs/parsley.js\"></script>" +
            "<script src=\"" + FB.preview.getRev("js") + "?mode=" + id + "\"></script>" +
            "<script>$('button').click(function(e){e.preventDefault();e.stopPropagation();}); $('ul.sidenav li a').click(function(e){e.preventDefault();});FBRun.dates.applyDatePickers(); $('.helptext').popover(); </script>" +
            "<script>var vis = " + JSON.stringify(FB.rulebuilder.stripRuleDef()) + "; FBRun.vis.init();</script>" +
            "<script>" + JSON.parse(FB.def[0].code) + "</script>" +
            /*"<script src=\"data/la.js\"></script>" +
            "<script src=\"data/lha.js\"></script>" +*/
            "</body></html>";
        return f;
    };

    // Side nav HTML
    var navigation = function (o) {
        // MF - removed the linear option of nav-pills when
        // sidenav was introduced.  If it gets put back in then
        // moveNext, etc functions will need to address both CSS sets
        var n;
        //if ((stacked === undefined) || (stacked === false)) { 
        //  n = "<ul class=\"nav nav-pills\">"; 
        //}
        //else {
            n = "<div class=\"col-md-3 sidenav-container\"><div class=\"row\"><ul class=\"sidenav\">";
        //}

        $.each(o.pages, function (pageIndex, page) {
            var pageId = page.page.fields.id.value;
            var pageName = page.page.fields.name.value;
            if (pageIndex === 0) {
                n += "<li class=\"active\" data-page=\"" + pageId + "\"><a href=\"javascript:void(0)\" onclick=\"FBRun.nav.moveTo('" + pageId + "');\">" + pageName + "</a></li>"; 
            }
            else {
                n += "<li class=\"disabled\" data-page=\"" + pageId + "\"><a href=\"javascript:void(0)\">" + pageName + "</a></li>"; 
            }
        });

        n += "</ul>";
        //if (stacked) { 
            n += "</div></div>";
        //}

        return n;
    };

    var topNav = function (numPages) {
        var h = (numPages === 1) ? "<div class=\"col-md-12 fb-form\">" : "<div class=\"col-md-9 fb-form\">";
        return h;
    };

    var rowStart = "<div class=\"row\">";

    var navButtons = function (numPages, pageIndex, pageId, backAction, backLabel, nextAction, nextLabel) {
        var h = "<div class=\"row nav-buttons\"><label class=\"col-sm-4 control-label\"></label><div class=\"col-sm-8\">";

        // Back button
        if (pageIndex > 0) {
            backAction = ((backAction !== "") ? backAction + "; " : "") + "FBRun.nav.moveBack('" + pageId + "');";
            h += "<button class=\"btn btn-default btn-back\" onclick=\"" + backAction + "\">" + backLabel + "</button>&nbsp;&nbsp;";
        }
        
        // Next button: first so that ENTER will work
        if ((numPages > 1) && (pageIndex < ((numPages - 1)) || (nextAction !== ""))) {
            nextAction = ((nextAction !== "") ? nextAction + ";" : "FBRun.nav.moveNext('" + pageId + "');");
            if (nextLabel !== "") { h += "<button class=\"btn btn-danger btn-next\" onclick=\"" + nextAction + "\">" + nextLabel + "</button>&nbsp;&nbsp;"; }
        }
        
        // Submit button
        if (pageIndex  === (numPages - 1)) {
            // TODO: set form-level submit action and label
            h += "<button class=\"btn btn-danger btn-submit\" onclick=\"FBRun.nav.submitAction('" + pageId + "');\">Submit</button>";
        }
        h += "</div></div>";

        return h;
    };

    return {
        id: id,
        name: name,
        header: header,
        navigation: navigation,
        topNav: topNav,
        rowStart: rowStart,
        navButtons: navButtons,
        footer: footer
    };

}());
