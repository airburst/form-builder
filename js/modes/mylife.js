/* global $:false */
/*======================================================================*\
  Mode file for MyLife (Bootstrap 3.2.0)
\*======================================================================*/
// Use FB namespace
var FB = FB || {};
var FBModes = FBModes || {};

FBModes.mylife = (function () {
    "use strict";

    var id   = "MyLife - bootstrap3";
    var name = "MyLife";

    // Header HTML
    var header = function (title) {
        var h = "<form role=\"form\" class=\"row form-horizontal form-fb\" name=\"" + title + "\">" +
            "<div class=\"container centered container-form\">";
        return h;
    };

    // Footer HTML
    var footer = function () {
        var f = "</div></form>" +
            "<script>" + JSON.parse(FB.def[0].code) + "</script>" +
            "<script>var vis = " + JSON.stringify(FB.rulebuilder.stripRuleDef()) + ";</script>";
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
            var pageId = page.page.fields.id.value,
                pageName = page.page.fields.name.value;
            if (pageIndex === 0) {
                n += "<li class=\"active\" data-page=\"" + pageId + "\"><a href=\"javascript:void(0)\" onclick=\"FBRun.nav.moveTo('" + pageId + "');\">" + pageName + "</a></li>"; 
            } else {
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
            if (nextLabel !== "") { h += "<button class=\"btn btn-primary btn-next\" onclick=\"" + nextAction + "\">" + nextLabel + "</button>&nbsp;&nbsp;"; }
        }

        // Submit button
        if (pageIndex  === (numPages - 1)) {
            h += "<button class=\"btn btn-primary btn-submit\" onclick=\"FBRun.nav.submitAction('" + pageId + "');\">Submit</button>";
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
