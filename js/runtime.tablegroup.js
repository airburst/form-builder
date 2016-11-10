/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/

// Declare runtime namespace
var FB = FB || {};
var FBRun = FBRun || {};

/*======================================================================*\
  TableGroup events
\*======================================================================*/
FBRun.tablegroup = (function() {
    "use strict";

    var publishTableChange = function($tg) {
        // Trigger any publishers
        if ($("[data-event-model=pub]", $tg).length > 0) {
            $.each($("[data-event-model=pub]", $tg), function() {
                var evt = $(this).data("eventType");
                $(this).trigger(evt);
            });
        }
    },

        triggerTableItemVisibility = function($tg) {
            // Get the list of control ids within this tablegroup and trigger the change event
            // This will force any vis rules to be applied
            $.each($("select,input,textarea", $tg), function() {
                $(this).trigger("change");
            });
        },

        // Add an action button to TableGroup row
        // This html provides a dropdown button with two actions: edit and delete current row
        addActionButton = function(tgId, rowId) {
            var buttonHtml = "<td>";
            buttonHtml +=  "<div class=\"btn-group\">";
            buttonHtml +=  "<button type=\"button\" class=\"btn btn-default\">Action</button>";
            buttonHtml +=  "<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">";
            buttonHtml +=  "<span class=\"caret\"></span>";
            buttonHtml +=  "<span class=\"sr-only\">Toggle Dropdown</span>";
            buttonHtml +=  "</button>";
            buttonHtml +=  "<ul class=\"dropdown-menu\" role=\"menu\">";
            buttonHtml +=  "<li><a href=\"#\" onclick=\"FBRun.tablegroup.editRow(" + tgId + "," + rowId + ")\">Edit</a></li>";
            buttonHtml +=  "<li><a href=\"#\" onclick=\"FBRun.tablegroup.deleteRow(" + tgId + "," + rowId + ")\">Delete</a></li>";
            buttonHtml +=  "</ul>";
            buttonHtml +=  "</div>";
            buttonHtml +=  "</td>";
            return buttonHtml;
        },

        addRow = function($tg, tgId) {
            // Selector for table in group
            var $t = $("table", $tg),
                rowCount = $("tr", $t).length,
                mode,
                rowHtml = "";

            // html for new row: we will use the data-row attribute to manage actions
            rowHtml = "<tr data-row=\"" + rowCount + "\">";
            $.each($("[data-id]", $tg), function() {
                // We need to include, but hide columns where data-colshow is not true
                // and ignore columns where data-coldata is not true
                if ($(this).data("coldata") === undefined) {
                    // Ignore the cell    
                    FBRun.setControlValue($(this).data("id"));
                } else {
                    if ($(this).data("colshow") === undefined) {
                        // Hide the cell
                        rowHtml += "<td class=\"hide\">";
                    } else {
                        rowHtml += "<td>";
                    }
                    // Write rest of cell
                    rowHtml += FBRun.getControlValue($(this).data("id")) + "</td>";

                    // Reset the input (only resets colheading elements)
                    FBRun.setControlValue($(this).data("id"));
                }
            });

            // Add action button to row
            mode = FBRun.getMode();
            if (mode.indexOf("bootstrap3") > -1) { rowHtml += addActionButton(tgId, rowCount); }
            rowHtml += "</tr>";

            // Append html to table
            $t.append(rowHtml);

            // Show the table view
            $t.removeClass("hide");

            // Reset the parsley validation on table group items
            $(FBRun.defaults.formContainer).parsley(tgId).reset();

            // Hide input group
            $(".table-group-items", $tg).slideUp(200);

            // Publish the change to any subscribers
            publishTableChange($tg);

            // And force any vis rules to be applied
            triggerTableItemVisibility($tg);
        },

        // Carry out the current action of the tg button and then toggle it's mode
        btnAction = function($button, tgId) {
            var $tg = $("[data-id=" + tgId + "]");
            // Add mode
            if ($button.data("mode") === "add") {
                // Validate item controls
                if ($(FBRun.defaults.formContainer).parsley(FBRun.parsleyOptions).validate(tgId) === true) {
                    // Append row to table
                    addRow($tg, tgId);

                    // Toggle button mode, text and colour
                    $button.data("mode", "show");
                    $button.text($button.data("closedlabel"));
                    $button.removeClass("btn-danger").addClass("btn-primary");

                    // Reset the parsley validation on table group items
                    $(FBRun.defaults.formContainer).parsley(tgId).reset();
                }
            } else {
                // Show mode
                // Show control group
                $(".table-group-items", $tg).slideDown();

                // Toggle button mode, text and colour
                $button.data("mode", "add");
                $button.text($button.data("label"));
                $button.removeClass("btn-primary").addClass("btn-danger");
            }
        },

        // Edit the values in selected row
        editRow = function(tgId, rowId) {
            // Selector for this row
            var $tg = $("[data-id=" + tgId + "]"),
                $row = $("tr[data-row=" + rowId + "]", $tg),
                count = $("[data-id]", $tg).length,
                $btn;

            // Populate group controls with selected row values
            $.each($("td", $row), function(colIndex) {
                // Don"t update the last column
                if (colIndex < count) {
                    // Write the value of the nth cell into the nth control
                    var $target = $($("[data-coldata]:eq(" + colIndex + ")", $tg)),
                        id = $target.data("id");
                    FBRun.setControlValue(id, $(this).text());

                    // Apply any vis rules to table group items
                    FBRun.vis.evaluate(id);
                }
            });

            // Set the button action and label to update
            $btn = $("button[data-mode]", $tg);
            $btn.data("mode", "update");
            $btn.text("Update");
            $btn.attr("onclick", "FBRun.tablegroup.updateRow(" + tgId + "," + rowId + ");");

            // Show the item group
            $(".table-group-items", $tg).slideDown(200);
            return false;
        },

        // Update the values in selected row
        updateRow = function(tgId, rowId) {
            // Validate item controls
            if ($(FBRun.defaults.formContainer).parsley(FBRun.parsleyOptions).validate(tgId) === true) {
                // Select table, row
                var $tg = $("[data-id=" + tgId + "]"),
                    $row = $("tr[data-row=" + rowId + "]", $tg),
                    mode,
                    $btn;

                // Get value for each td cell from relevant form control below
                // Ignore controls without data-coldata="true"
                $.each($("[data-coldata]", $tg), function(conIndex) {
                    var $target = $("td:eq(" + conIndex + ")", $row);
                    $target.text(FBRun.getControlValue($(this).data("id")));
                    // Empty the control, ready to add again
                    FBRun.setControlValue($(this).data("id"));
                });

                // Hide the group, ready to show again
                $(".table-group-items", $tg).slideUp(200);

                // Set the button action and text
                $btn = $("button[data-mode]", $tg);
                $btn.data("mode", "show");

                // Update button for appropriate view mode
                mode = FBRun.getMode();
                if (mode.indexOf("bootstrap3") > -1) { $btn.text($btn.data("closedlabel")); }
                $btn.attr("onclick", "FBRun.btnAction($(this), " + tgId + ");");

                // Reset parsley validation styles
                $(FBRun.defaults.formContainer).parsley(tgId).reset();

                // Publish the change to any subscribers
                publishTableChange($tg);

                // Force any vis rules to be applied
                triggerTableItemVisibility($tg);
            }
        },

        // Remove the selected row
        deleteRow = function(tgId, rowId) {
            // Select table, row
            var $tg = $("[data-id=" + tgId + "]"),
                $row = $("tr[data-row=" + rowId + "]", $tg);

            // Prompt for confirmation
            bootbox.confirm("Are you sure you want to delete this row?", function(result) {
                if (result) {
                    $row.remove();
                    // Publish the change to any subscribers
                    publishTableChange($tg);
                }
            });
        },

        pad = function(data, columns) {
            var i, j;
            // Single dimension array
            if ((data[0].length === undefined) || (data[0].length === 0)) {
                for (i = 0; i < columns; i++) { data.push(""); }
            } else {
                // 2d array
                for (j = 0; j < data.length; j++) {
                    pad(data[j], columns);
                }
            }
            return data;
        },

        getData = function($table) {
            // Get the owning table group name/id
            var tableName = $table.closest("[data-id]").attr("id"),
                tData = [],
                rData = [];

            // Iterate over each row, then column
            $.each($("tr", $table), function(rowIndex, row) {
                rData = [];

                // Add row id
                rData.push(rowIndex);

                var numCols = $("td", row).length - 1;
                $.each($("td", $(this)), function(colIndex) {
                    // Don"t include last (Action) column
                    if (colIndex < numCols) {
                        // Establish whether the control is a Select
                        // If so then get the value from presented text
                        var $target = $("[data-coldata]:eq(" + colIndex + ")", $table),
                            t = $(this).text();

                        if (FB.utils.isSelect($target.data("id"))) {
                            rData.push(FB.utils.valueByText($("select", $target), t));
                        } else {
                            rData.push(t);
                        }
                    }
                });

                // Don"t add header (0) row
                if (rowIndex > 0) {
                    tData.push(rData);
                }
            });
            return JSON.stringify({name: tableName, data: tData});
        },

        setData = function($table, data, includeFirstCol) {
            // Cater for multiple selectors
            $.each($table, function() {

                // Read forced includeFirstCol attribute from parameters
                if (includeFirstCol === undefined) {
                    // Read data-idcol attribute to determine whether to include first (id) column
                    var includeFirstCol = ($(this).data("idcol") !== undefined) ? true : false;
                }

                if ($(this).length > 0) {
                    // Selector for table
                    var $t = $("table", $(this));

                    // Establish how much data we have to fit into table columns    
                    var tLen = $("th", $t).length;

                    //if (tg) { tLen -= 1; }
                    var dLen = data[0].length;

                    // Calculate shift
                    var shift = (includeFirstCol) ? 1 : 0;

                    // If less data than columns, then pad out with spaces
                    if (dLen < tLen) { pad(data, (tLen - dLen)); }

                    if (tLen > 0) { 
                        // Write each row as a new table row and append
                        var bodyHtml = "";
                        $.each(data, function(rowIndex, row) {
                            bodyHtml += "<tr>";
                            $.each(row, function(colIndex, col) {
                                // Only write id if includeFirstCol == true          
                                if (colIndex === 0) {
                                    if (includeFirstCol) { bodyHtml += "<td>" + col + "</td>"; }
                                } else {
                                    // Only write as many columns as we have space for
                                    if ((colIndex + shift) <= tLen) {
                                        bodyHtml += "<td>" + col + "</td>";
                                    }
                                }
                            });
                            bodyHtml += "</tr>";
                        });
                        // Append HTML to table
                        $t.append(bodyHtml);
                    }
                }
            });
            return false;
        },

        // Convert a single dimension array into tableGroup data format
        // ["item", "item", "...", "item"] => [[1, "item"], [2, "item"], ... , [n, "item"]]
        convertArrayToTableData = function(data) {
            var tableData = [];

            if (data.length > 0) {
                $.each(data, function(k, v) {
                    if (v.length === 1) {
                        tableData.push([k, v]);
                    } else {
                        v.splice(0, 0, k);
                        tableData.push(v);
                    }
                });
                return tableData;
            }
            return null;
        },

        // Copy table data from target to source
        // $source is a selector for the table inside a table group
        // $target is a selector for a static table
        copyTable = function($source, $target) {
            var data = JSON.parse(getData($source));
            setData($target, data.data);
            return false;
        };

    // Public methods
    return {
        btnAction: btnAction,
        addRow: addRow,
        editRow: editRow,
        updateRow: updateRow,
        deleteRow: deleteRow,
        getData: getData,
        setData: setData,
        copyTable: copyTable,
        convertArrayToTableData: convertArrayToTableData
    };

}());
