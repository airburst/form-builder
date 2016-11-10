/* global $:false */
/*======================================================================*\
  Mode file for Bootstrap 3.3.0
\*======================================================================*/
// Use FB namespace
var FB = FB || {};
var FBModes = FBModes || {};

FBModes.affordability = (function () {
    "use strict";

    var id   = "Affordability - bootstrap3",
        name = "Affordability",
        header = function (title) {
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

                "<link rel=\"apple-touch-icon\" sizes=\"57x57\" href=\"apple-touch-icon-57x57.png\"/>" +
                "<link rel=\"apple-touch-icon\" sizes=\"114x114\" href=\"apple-touch-icon-114x114.png\"/>" +
                "<link rel=\"apple-touch-icon\" sizes=\"72x72\" href=\"apple-touch-icon-72x72.png\"/>" +
                "<link rel=\"apple-touch-icon\" sizes=\"144x144\" href=\"apple-touch-icon-144x144.png\"/>" +
                "<link rel=\"apple-touch-icon\" sizes=\"60x60\" href=\"apple-touch-icon-60x60.png\"/>" +
                "<link rel=\"apple-touch-icon\" sizes=\"120x120\" href=\"apple-touch-icon-120x120.png\"/>" +
                "<link rel=\"apple-touch-icon\" sizes=\"76x76\" href=\"apple-touch-icon-76x76.png\"/>" +
                "<link rel=\"apple-touch-icon\" sizes=\"152x152\" href=\"apple-touch-icon-152x152.png\"/>" +
                "<link rel=\"icon\" type=\"image/png\" href=\"favicon-196x196.png\" sizes=\"196x196\"/>" +
                "<link rel=\"icon\" type=\"image/png\" href=\"avicon-160x160.png\" sizes=\"160x160\"/>" +
                "<link rel=\"icon\" type=\"image/png\" href=\"favicon-96x96.png\" sizes=\"96x96\"/>" +
                "<link rel=\"icon\" type=\"image/png\" href=\"favicon-16x16.png\" sizes=\"16x16\"/>" +
                "<link rel=\"icon\" type=\"image/png\" href=\"favicon-32x32.png\" sizes=\"32x32\"/>" +
                "<meta name=\"msapplication-TileColor\" content=\"#da532c\"/>" +
                "<meta name=\"msapplication-TileImage\" content=\"mstile-144x144.png\"/>" +

                "</head><body class=\"fb-body\">" +
                "<div class=\"fb-wrapper\" id=\"fb-main\">" +
                "<form role=\"form\" class=\"form-horizontal form-fb\" name=\"" + title + "\">" +
                "<div class=\"container container-form\">" +
                "<div class=\"logo\">" +
                /*"<a class=\"btn btn-danger btn-bug\" href=\"feedback.htm\" target=\"_blank\" title=\"Report an Issue\"><span class=\"glyphicon glyphicon-comment\"></span></a>" + */
                "<a class=\"btn btn-danger btn-bug\" href=\"#\" onclick=\"feedback.open();\" title=\"Report an Issue\"><span class=\"glyphicon glyphicon-comment\"></span></a>" +
                "</div>";
            return h;
        },

        footer = function () {
            var f = "</div></form>" +
                "<div id=\"footer\"><div class=\"container container-form footer\"><p>Design by OLM Systems and Shelter</p></div></div>" +
                "</div>" +
                "<div class=\"spinner-container\"></div>" +
                "<script src=\"js/libs/jquery-1.11.1.min.js\"></script>" +
                "<script src=\"js/libs/jquery-ui.min.js\"></script>" +
                "<script src=\"assets/bootstrap/js/bootstrap.min.js\"></script>" +
                "<script src=\"assets/datepicker/js/bootstrap-datepicker.js\"></script>" +
                "<script src=\"js/libs/bootbox.js\"></script>" +
                "<script src=\"js/libs/bowser.js\"></script>" +
                "<script src=\"js/libs/parsley.js\"></script>" +
                "<script src=\"" + FB.preview.getRev("js") + "?mode=" + id + "\"></script>" +
                "<script src=\"data/la.js\"></script>" +
                "<script src=\"data/lha.js\"></script>" +

                /* Google Analytics for Shelter */
                "<script>" +
                "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" +
                "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o)," +
                "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)" +
                "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');" +
                "ga('create', 'UA-52975527-1', 'auto');" +
                "ga('send', 'pageview');" +
                "</script>" +
                /* End Google Analytics for Shelter */

                "<script>$('button').click(function(e){e.preventDefault();e.stopPropagation();}); $('ul.sidenav li a').click(function(e){e.preventDefault();});FBRun.dates.applyDatePickers(); $('.helptext').popover(); incomeVisibility();</script>" +
                "<script>" + JSON.parse(FB.def[0].code) + "</script>" +
                "<script>vis = " + JSON.stringify(FB.rulebuilder.stripRuleDef()) + "; FBRun.vis.init();</script>" +
                "</body></html>";
            return f;
        },

        navigation = function (o) {
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
        },

        topNav = function (numPages) {
            var h = (numPages === 1) ? "<div class=\"col-md-12 fb-form\">" : "<div class=\"col-md-9 fb-form\">";
            return h;
        },

        rowStart = "<div class=\"row\">",

        navButtons = function (numPages, pageIndex, pageId, backAction, backLabel, nextAction, nextLabel) {
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
