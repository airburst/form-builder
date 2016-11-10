/* global $:false, jQuery:false, document:false, window:false, Blob:false, destroyClickedElement:false, bootbox:false */

// Declare namespace
var FB = FB || {};

// Define file module  
FB.file = function () {
    "use strict";

    // Helper function to save file using JavaScript
    var saveTextAsFile = function (text, filename) {
        var textFileAsBlob = new Blob([text], {type: "text/plain"}),
            downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL !== null) {
            // Chrome allows the link to be clicked without actually adding it to the DOM
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        } else {
            // Firefox requires the link to be added to the DOM before it can be clicked
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    };

    // Save form object as json or html
    var save = function (type, pretty) {
        // Get mode from form properties
        var mode = FB.def[0].fields.output.selectedvalue;

        // Get form name
        var name = FB.def[0].fields.id.value;
        name = name.replace(" ", "-");

        switch (type) {
        // Rendered HTML output of form
        case "html":
            $("#html").val(FB.preview.render(mode));
            // Prettify the html
            $("#html").format({method: "xml"});
            // Save
            saveTextAsFile($("#html").val(), name + ".htm");
            break;

        // JSON output of form object
        case "json":
            var fd = JSON.stringify(FB.resortDef());

            // Create an element and load the json
            $("#html").val(fd);
            // If desired, prettify the json
            if (pretty !== undefined) { $("#html").format({method: "json"}); }

            // Download
            saveTextAsFile($("#html").val(), name + ".json");
            break;
        }
    };

    var open = function (object, page) {
        var pageMode = (page === undefined) ? false : true;
        if (!pageMode) {
            FB.def    = [];
            FB.def[0] = object.form;
            FB.defId  = 1;
            FB.tabId  = 1;

            // Vis rules
            FB.vis = {
                "rules": [],
                "triggers": []
            };
            if (FB.def[0].vis !== undefined) { FB.vis = FB.def[0].vis; }

            // Create form header
            var f = "<form role=\"form\" class=\"form-horizontal\">";
            f += "<div id=\"form-zone\">";
        }

        // Remove the standard page 1 option from select in header
        $("#page option").remove();

        // Render HTML from objects  
        $.each(object.pages, function (pageIndex, page) {
            var cl = "page";
            // Get variables from the page object
            var pageDefId = page.page.id;               //2
            var pageId = page.page.fields.id.value;     //p1
            var pageName = page.page.fields.name.value; //Page 1
            // Add to def
            FB.def.push(page.page);

            // Add markup for each page (section)
            if (pageIndex > 0) {
                // Hide by default; add to the class
                cl += " hide";
            }

            // Add an entry to the select
            $("#page").append("<option value=\"" + pageId + "\" data-defid=\"" + pageDefId + "\">" + pageName + "</option>");

            // Add a visibility rule if one was set
            var pageVis = "";
            if (FB.def[FB.def.length - 1].fields["data-vis"] !== undefined) {
                if (FB.def[FB.def.length - 1].fields["data-vis"].value !== "") { pageVis = " data-vis='" + FB.def[FB.def.length - 1].fields["data-vis"].selectedvalue + "'"; }
            }
            f += "<section class=\"" + cl + "\" id=\"" + pageId + "\" data-id=\"" + pageDefId + "\"" + pageVis + "name=\"" + pageName + "\">";

            // Update defId
            FB.defId = Math.max(FB.defId, pageDefId);

            $.each(page.rows, function (rowIndex, row) {
                f += "<div class=\"row\">";
                $.each(row.columns, function (colIndex, col) {
                    f += "<div class=\"" + col.width + " dropzone ui-sortable\" droppable=\"true\">";
                    $.each(col.controls, function (conIndex, con) {
                        // console.log("row " + rowIndex + ", col " + colIndex + ", controlId " + con.id);
                        // Populate form definition object
                        FB.def.push(con);

                        // Get the index and make defId larger (for next control that might be manually added)
                        FB.defId = Math.max(FB.defId, con.id);

                        // Do the same for tabindex
                        if (con.fields.tabindex !== undefined) { FB.tabId = Math.max(FB.tabId, con.fields.tabindex.value); }

                        // Get html for control
                        // Test for Table Group control, which has children
                        if ((con.children !== undefined) && (con.children != "")) {
                            // Control group html
                            var childrenHtml = "";
                            $.each(col.children, function (childIndex, child) {
                                // Add to def and update counter
                                FB.def.push(child);
                                FB.defId = Math.max(FB.defId, child.id);

                                // Get html for control group
                                childrenHtml += FB.designer.getComponentView(child);
                            });

                            // Create the Table Group Html
                            var tgHtml = FB.designer.getComponentView(con);

                            // Inject the child html into div .table-group-items           
                            var search = "<div class=\"table-group-items dropzone\">";
                            var pos = tgHtml.indexOf(search);
                            f += tgHtml.substring(0, pos + search.length) + childrenHtml + tgHtml.substring(pos + search.length);
                        } else {
                            f += FB.designer.getComponentView(con);
                        }
                    });
                    f += "</div>";
                });
                f += "</div>";
            });
            f += "</section>";
        });

        if (!pageMode) {
            f += "</div></form>"; 
            // Write form to screen (div#content)
            $("#content .panel-content").html(f);
        } else {
            // Append to form
            $("#form-zone").append(f);
        }

        // Add event bindings
        // Bind handlers to droppable zone
        $(".dropzone").bind("dragenter", FB.events.dragEnter);
        $(".dropzone").bind("dragleave", FB.events.dragLeave); 
        $(".dropzone").bind("dragover", FB.events.dragOver);
        $(".dropzone").bind("drop", FB.events.dropEvent);
        $(".dropzone").bind("dragend", FB.events.dragEnd);
        FB.events.makeSortable($(".dropzone"));

        // Remove bindings for any Table Groups
        $(".table-group").parent().unbind("drop");
        
        // And change the table-items-group binding
        $(".table-group .dropzone").unbind("drop");
        $(".table-group .dropzone").bind("drop", FB.events.tableDropEvent);

        // Bind right-click handler to rows
        $("#form-zone .row").bind("contextmenu", FB.rows.contextMenu);

        // Add click binding to each control
        $("div[data-id]").bind("click", {ths: FB.designer}, FB.designer.updateProperties);

        // Update form attributes
        FB.form.update();

        // Bind click and change to page select
        // Write name from first page in drop down list
        $("#page-name").text($("#page option:selected").text());
        $("#page-name").bind("click", FB.page.clickPage);

        // Increment definition id, for next control id
        FB.defId++;

        // Same for tab Id
        FB.tabId++;

        // Set code in editor   
        if (FB.def[0].code !== undefined) { FB.code.set(JSON.parse(FB.def[0].code), "ace/mode/javascript"); }

        // Now that the entire def object is loaded,
        // update it if the version is below current
        if ((FB.def[0].version !== undefined) && (FB.update.compare(FB.def[0].version, FB.version)) === -1) { FB.update.updateFile(); }
    };

    // After a page object has been cloned using resortDef in page mode
    // the ids all need to be updated before the page can be appended
    var updatePageIds = function (o) {
        // Get number of pages
        var numPages = $(".page").length;
        var nextPage = "p" + (numPages + 1);

        // Update the page object
        o.pages[0].page.id = FB.defId++;
        o.pages[0].page.fields.id.value = nextPage;
        o.pages[0].page.fields.name.value = "Copied Page";

        // Update all controls in all rows and columns
        $.each(o.pages[0].rows, function(rowIndex, row) {    
            $.each(row.columns, function(colIndex, col) {     
                $.each(col.controls, function(conIndex, con) {        
                    con.id = FB.defId++;
                    con.fields.id.value += "-";   //MF this is still updating def!
                });
            });
        });
    };

    /*======================================================================*\
      Read input file event handler
    \*======================================================================*/
    var readFile = function (evt) {
        //Retrieve the first (and only) file from the FileList object
        var f = evt.target.files[0]; 

        if (f) {
            var r = new FileReader();
            r.onload = function(e) { 
                var contents = e.target.result;
                // Try to convert file into a json object
                try {
                    var j = JSON.parse(contents);
                    // Parse object into form HTML and update screen
                }
                catch (e) {
                    bootbox.alert("Error parsing file as JSON: ", e); 
                }
                if (j !== undefined) { 
                    // Check whether opened file was saved in a newer Form Builder version
                    var fileVersion = j.form.version;
                    if (FB.update.compare(FB.version, fileVersion) > -1) {                 
                        // Re-initialise FB object
                        FB.init();
                        
                        // Open the file
                        open(j);
                    }
                    else {
                        bootbox.alert("The file that you are trying to open has a newer version [" + fileVersion + "]\n\nPlease upgrade Form Builder to open this file.");                        
                    }
                }
            };
            r.readAsText(f);

            // Hide the load form modal
            $("#load-modal").modal("hide");
        } 
        else { 
            bootbox.alert("Failed to load file");
        }
    };

    return {
        save: save,
        open: open,
        updatePageIds: updatePageIds,
        readFile: readFile
    };

}();


/*function clonePage(pId) {
  // Clone the page from DOM
  var $clone = $(".page[id=" + pId + "]").clone();

  // Get number of pages
  var numPages = $(".page").length;

  // Push the page to def object
  def.push(FB.d($clone.data("id")));
 
  // Give the page a new id
  var nextPage = "p" + (numPages + 1);
  $clone.attr("id", nextPage).attr("data-defid", defId);;

  // Update the def item with new id
  def[def.length - 1].id = defId++;
  def[def.length - 1].fields.id.value = nextPage;

  // And hide it
  $clone.addClass("hide");
  
  // Walk through all controls on the page
  // Renumber all ids and create new def items
  $.each($("[data-id]", $clone), function(k, v) {
    var i = defId++;

    // Add def item
    var id = $(this).data("id");
    def.push(FB.d(id));

    // Update the def item with new id
    def[def.length - 1].id = i;
    def[def.length - 1].fields.id.value += "-";

    // Renumber the DOM id
    $(this).attr("data-id", i).attr("id", i);
  });

  // Add to the form
  $clone.appendTo("#form-zone");

  // Add a new page option to select
  $("#page").append("<option value="" + nextPage + "" data-defid="" + $clone.data("id") + "">New Page</option>");
  // Select the new page
  $("#page").val(nextPage);
  $("#page").trigger("change");
}*/

