/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/
/*======================================================================*\
  Generate preview markup for form in popup window
\*======================================================================*/

// Use FB namespace
var FB = FB || {};
var FBModes = FBModes || {};

FB.preview = ( function() {
    "use strict";

    var modeTemplate = function( modeName ) {
        var m = $.map( FBModes, function( v, k ) {
            if ( k === modeName ) { return v; }
        } );
        return m;
    };

    // Get revved filenames for formbuilder.js or main.css
    var getRev = function( fileType ) {
        var file;

        if ( fileType === "js" ) {

            // Get revved formbuilder filename
            file = $( "script[src*=\"formbuilder.min\"]" ).attr( "src" );
            if ( file !== undefined ) {
                return file;
            }

            // else {
            //  bootbox.alert("Please use the production Formbuilder environment.");
            // }
        }

        // Main.min.css
        if ( fileType === "css" ) {

            // Get revved formbuilder filename
            file = $( "link[href*=\"main.min\"]" ).attr( "href" );
            if ( file !== undefined ) {
                return file;
            }

            // else {
            //  bootbox.alert("Please use the production Formbuilder environment.");
            // }
        }
    };

    var render = function( mode ) {

        // Set default mode
        if ( mode === undefined ) { mode = "bootstrap3"; }

        // Get FBMode template
        var mt = modeTemplate( mode )[0];

        // Get form object
        var o = FB.resortDef();

        // Count pages
        var numPages = o.pages.length;

        // If there are more than 6 pages, stack the nav    // MAGIC NUMBER ALERT
        // var stacked = (numPages <= 6) ? false : true;

        // Create form HTML
        var title = FB.def[0].fields.id.value;
        var formHtml = mt.header( title );

        // Create navigation HTML
        var navHtml = mt.navigation( o );

        // Render HTML from objects
        $.each( o.pages, function( pageIndex, page ) {
            var cl = "page";
            if ( pageIndex > 0 ) {
                cl += " hide";
            }

            // Get variables from the page object
            var pageDefId = page.page.id;
            var pageId = page.page.fields.id.value;
            var pageName = page.page.fields.name.value;

            // Add a visibility rule to the page if one was set
            var pageVis = "";
            if ( page.page.fields["data-vis"] !== undefined ) {
                if ( ( page.page.fields["data-vis"].selectedvalue !== undefined ) &&
                    ( page.page.fields["data-vis"].selectedvalue != "" ) ) {
                    pageVis = " data-vis='" + page.page.fields["data-vis"].selectedvalue + "'";
                }
            }

            // Write the Page heading
            formHtml += "<section class=\"" + cl + "\" id=\"" + pageId + "\" data-id=\"" + pageDefId + "\"" + pageVis + " name=\"" + pageName + "\">";

            // Include top navigation for multi-page forms
            formHtml += mt.topNav( numPages );

            // Write page contents
            $.each( page.rows, function( rowIndex, row ) {

                // Write new row markup
                formHtml += mt.rowStart;
                /*if (mode.indexOf("bootstrap3") > -1) { formHtml += "<div class=\"row\">"; }
                if (mode === "bootstrap2") { formHtml += "<div class=\"row-fluid\">"; }*/

                $.each( row.columns, function( colIndex, col ) {

                    formHtml += "<div class=\"" + col.width + "\">";
                    $.each( col.controls, function( conIndex, con ) {

                        // Get the index and make defId larger
                        // (for next control that might be manually added)
                        FB.defId = Math.max( FB.defId, con.id );

                        // If this control is a Table Group, it will have children ids
                        if ( ( con.children !== undefined ) && ( con.children != "" ) ) {

                            // Aggregate html for all children
                            var childrenHtml = "";
                            $.each( con.children, function( childIndex, childId ) {
                                childrenHtml += FB.designer.getComponentView( FB.d( childId ), "preview", mode );
                            } );

                            // Create the Table Group Html
                            var tgHtml = FB.designer.getComponentView( con, "preview", mode );

                            // Inject the child html into div .table-group-items
                            var search = "<div class=\"table-group-items\">";
                            var pos = tgHtml.indexOf( search );
                            formHtml += tgHtml.substring( 0, pos + search.length ) + childrenHtml + tgHtml.substring( pos + search.length );
                        } else {

                            // "preview" will alter rendering of actionbuttons and events
                            // and mode will activate the appropriate templates
                            formHtml += FB.designer.getComponentView( con, "preview", mode );
                        }
                    } );
                    formHtml += "</div>";
                } );
                formHtml += "</div>";
            } );

            // Nav buttons
            // Check whether an override function has been set
            var backAction = page.page.fields["data-event-back-action"].value;
            var backLabel  = page.page.fields["data-event-back-label"].value;
            var nextAction = page.page.fields["data-event-next-action"].value;
            var nextLabel  = page.page.fields["data-event-next-label"].value;

            formHtml += mt.navButtons( numPages, pageIndex, pageId, backAction, backLabel, nextAction, nextLabel );
            formHtml += "</div>";

            // Add sidenav
            if ( numPages > 1 ) { formHtml += navHtml; }
            formHtml += "</section>";
        } );

        // Add footer
        formHtml += mt.footer();
        return formHtml;
    };

    var openWindow = function( html ) {

        // Get browser settings
        var margin = 40;  // margin in pixels
        var w = $( window ).width();
        var h = $( window ).height();

        // Calculate dimensions to centre the window
        w = w - ( 2 * margin );
        h = h - ( 2 * margin );

        var win = window.open( "", "_blank", "toolbar=no, scrollbars=yes, resizable=yes, top=" + margin + ", left=" + margin + ", width=" + w + ", height=" + h );

        if ( html !== undefined ) {
            win.document.write( html );
        }
    };

    var popup = function() {

        // Get mode from form properties
        var mode = FB.def[0].fields.output.selectedvalue;
        var h = render( mode );
        openWindow( h );
    };

    return {
        popup: popup,
        render: render,
        modeTemplate: modeTemplate,
        getRev: getRev
    };

}() );
