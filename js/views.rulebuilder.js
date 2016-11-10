/*global
  $:false,
  Handlebars:false,
  bootbox:false,
  window:false,
  console:false
*/
/*======================================================================*\
  Rule Builder UI Functions
\*======================================================================*/
var FB = FB || {};

// Define rulebuilder module
FB.rulebuilder = (function() {
    "use strict";

    // Templates
    var ruleItemTpl = Handlebars.compile($("#rule-item-template").html()),
        ruleActionButtonTpl = Handlebars.compile($("#rules-table-action-button-template").html()),
        ruleNavButtonsTpl = Handlebars.compile($("#rules-table-nav-buttons-template").html()),
        saveMessage = "<p>Please enter a name for this rule<p>" +
            "<div class=\"form-group\">" +
            "<input class=\"form-control\" type=\"text\" id=\"rulename\" />" +
            "</div>",
        updateMessage = "<p>Rule name<p>" +
            "<div class=\"form-group\">" +
            "<input class=\"form-control\" type=\"text\" id=\"rulename\" value=\"{RULE}\"/>" +
            "</div>";

    // Methods
    var isTrigger = function(id) {
        var t = $.grep(FB.vis.triggers, function(v) {
            return (parseInt(v.cid) === parseInt(id));
        });
        return (t.length > 0) ? t : false;
    };

    // Empty rules
    var clearRules = function() {
        FB.vis = {"rules": [], "triggers": []};
    };

    // counter for next rule index
    // Assumes that the rules list is *always* in ascending id order
    var ruleId = function() {
        var l = FB.vis.rules.length;
        return (l === 0) ? 1 : FB.vis.rules[l - 1].id + 1;
    };

    // Cast a string value (val) into appropriate type
    // TODO: handle date type
    var castValue = function(val, mode) {
        // Regular expressions
        var re = new RegExp('^-?\\d{1,9}(\\.\\d{1,2})?$');   // Number only

        // Cast numbers
        if (re.test(val)) {
            val = parseFloat(val);
        } else {
            // String: add quotes in eval mode only
            if ((mode !== undefined) && (mode === "eval")) { val = "\"" + val + "\""; }
        }

        return val;
    };

    // Write the expression for a rule item row
    // This relies upon DOM names
    // Include OR or AND button 
    var expression = function(mode) {

        if (mode === undefined) { mode = "display"; }

        var $ruleItems = $("#rulestable form"),
            e = "";

        $.each($ruleItems, function() {
            var item = $(this).data("ruleitem"),
                operator = $("#rule-btn-" + item).text(),
                right,
                presentedText;

            // Ignore any rules with 'Please Select' option
            if ($("#rule-left-" + item + " option:selected").text() !== "Please select") {
                // Establish whether to use input or select for right value
                if ($("#rule-right-list-" + item + " option").length > 0) {
                    right = $("#rule-right-list-" + item).val();
                } else {
                    right = $("#rule-right-" + item).val();
                }

                // Write the expression as a label
                if (mode === "display") {
                    presentedText = "<span class=\"label label-primary expression\">( " + $("#rule-left-" + item + " option:selected").text() + "  " + $("#rule-operator-" + item).val().replace("==", "=") + castValue(right) + ") </span>";
                } else {
                    presentedText = "(" + $("#rule-left-" + item + " option:selected").text() + $("#rule-operator-" + item).val().replace("==", "=") + castValue(right) + ")";
                }

                if (operator !== "Done") {
                    if (mode === "display") {
                        presentedText += "<span class=\"label label-danger expression\">" + operator + "</span>";
                    } else {
                        presentedText += " " + operator + " ";
                    }
                }
            } else {
                presentedText = "";
            }
            e += presentedText;
        });

        return e;
    };

    var writeExpression = function(mode, ruleId) {
        // Display the expression
        $("#rule-expression").html(expression());

        // Show nav-action buttons
        var save = ((mode === undefined) || (mode === "save")) ? true : false;
        if (save) {
            $("#rule-save").html(ruleNavButtonsTpl({"data": {"save": true}}));
        } else {
            if (mode === "update") {
                $("#rule-save").html(ruleNavButtonsTpl({"data": {"update": true, "rule": ruleId}}));
            }
            // Else don't change the buttons at all, e.g. edit mode
        }
    };

    var setLastRuleDone = function() {
        $("[data-ruleitem]:last button:first").text("Done");
    };

    var removeRuleItem = function(item, mode) {
        $("#rulestable form[data-ruleitem=" + item + "]").remove();

        // Ensure that the last rule has a button value of 'Done'
        setLastRuleDone();

        // Update the expression
        writeExpression(mode);
    };

    // Return a list of all controls which can have values for visibility rules
    var controls = function() {
        var con = $.grep(FB.def, function(v) {  //MF-global
            return ((v.controltype !== undefined) && (v.controltype.indexOf("table") === -1));
        });
        return con;
    };

    // Return a list of control ids in form
    var controlsList = function() {
        var c = [];
        $.each(controls(), function(k, v) {
            if (v.fields.id !== undefined) { c.push({"text": v.fields.id.value, "value": v.id}); }
        });
        return c;
    };

    // Populate a Select ($select) with list of form controls
    var populateControlsSelect = function($select) {
        var opts = [{"text": "Please select", "value": 0}];
        $.each(controlsList(), function(k, v) {
            opts.push({"text": v.text, "value": v.value});
            //opts.push({"text": v.text, "value": v.text});
        });
        FB.utils.updateSelect($select, opts);
        return false;
    };

    // Add a rule item instance to rule builder panel
    var addRuleItem = function(item, operator, mode) {

        // If the left control is unselected then remove row
        if ($("#rule-left-" + item).val() === 0) {
            removeRuleItem(item);
        } else {
            // Get the index number for next row
            var nextItem = 1;
            if ($("#rulestable form:last").length > 0) { nextItem = $("#rulestable form:last").data("ruleitem") + 1; }

            // If Done, then save the rule
            if (operator === "Done") {
                // Update the expression
                writeExpression(mode);
            } else {
                // Update action button text
                if (item !== undefined) { $("#rule-btn-" + item).text(operator); }

                // Clear the empty message
                if (nextItem === 1) { $("#rulestable").html(""); }

                // Add a row of rules controls *IF* we have clicked the last button
                // Or if this has been called in edit mode for an existing rule
                if ((nextItem === 1) || (nextItem - item === 1) || (mode === "edit")) {

                    if (mode === "edit") {
                        $("#rulestable").append(ruleItemTpl({"data": {"rule": nextItem, "mode": mode}}));
                    } else {
                        $("#rulestable").append(ruleItemTpl({"data": {"rule": nextItem}}));
                    }

                    // Populate the left select with every form control name
                    populateControlsSelect($("#rule-left-" + nextItem));

                    // Bind the change event (which decides whether to render rule-right as 
                    // a text input or a select)
                    $("#rule-left-" + nextItem).bind("change", ruleLeftChange);
                    //$("#rule-operator-" + nextItem).bind("change", operatorChange);

                    // If there are no controls in the form, remove the item
                    if ($("#rule-left-" + nextItem + " option").length === 1) {
                        removeRuleItem(nextItem);

                        // Empty designer elements
                        $("#rulestable").html("");
                        $("#rule-save").html("");

                        // Show the message and hide the deigner
                        $(".rule-message").removeClass("hide");
                        $(".rule-designer").addClass("hide");
                    }
                }

                // Update the expression   
                if (nextItem > 1) { writeExpression(mode); }
            }
        }
    };

    var createRule = function() {
        var $ruleItems = $("#rulestable form"),
            e = "",
            triggers = [],
            ruleDef = [];

        $.each($ruleItems, function() {
            var item = $(this).data("ruleitem"),
                left = $("#rule-left-" + item).val(),
                op = $("#rule-operator-" + item).val(),
                right,
                rightType;

            // Determine whether to use the select or the input for right value
            // If select is populated, use it
            if ($("#rule-right-list-" + item + " option").length > 0) {
                right = $("#rule-right-list-" + item).val();
                rightType = "select";
            } else {
                right = $("#rule-right-" + item).val();
                rightType = "input";
            }
            var operator = $("#rule-btn-" + item).text();

            // Write the expression
            switch (op) {
            case " Contains ":
                e += "(V(" + left + ").indexOf(" + castValue(right, "eval") + ") > -1)";
                break;
            case " Does not contain ":
                e += "(V(" + left + ").indexOf(" + castValue(right, "eval") + ") == -1)";
                break;
            default:
                e += "(V(" + left + ")" + op + castValue(right, "eval") + ")";
                break;
            }

            // Append any logical operators
            if (operator !== "Done") {
                if (operator === "OR") { e += " || "; }
                if (operator === "AND") { e += " && "; }
            }

            // Append triggers
            triggers.push($("#rule-left-" + item).val());

            // Append rule definition
            ruleDef.push({
                "left": left,
                "op": op,
                "right": castValue(right),
                "type": rightType,
                "btn": operator
            });
        });

        // reduce triggers to a distinct collection
        return {"exp": e, "triggers": FB.utils.distinct(triggers, 0), "def": ruleDef, "display": expression("rule")};
    };

    var showAddRule = function() {
        // Empty the rules list and expression div
        $("#rulestable").html("");
        $("#rule-expression").html("");

        // Hide the message and show the deigner
        $(".rule-message").addClass("hide");
        $(".rule-designer").removeClass("hide");

        // Add new rule item
        addRuleItem();

        // Show-hide the divs
        $("#rules-list").addClass("hide");
        $("#add-rule").removeClass("hide");

        // Remove nav buttons
        $("#rule-save").html("");
    };

    // Initialise the table of all rules in use 
    var initRulesTable = function() {
        var data = FB.vis.rules;

        FB.rulesTable = $(".datatable").dataTable({
            "sPaginationType": "bs_normal",
            "aaData" : data,
            "aoColumns": [
                {"mDataProp": "id"},
                {"mDataProp": "name"},
                {"mDataProp": "display"},
                {   
                    "mData": null,
                    "bSortable": false,
                    "mRender": function(data, type, row) { return ruleActionButtonTpl({"data": {"rule": row.id}}); }
                } 
            ]
        }); 

        // Force sort by Id (col 0) descending
        $(".datatable thead th:first").click();

        $(".datatable").each(function() {
            var datatable = $(this);

            // SEARCH - Add the placeholder for Search and Turn this into in-line form control
            var searchInput = datatable.closest(".dataTables_wrapper").find("div[id$=_filter] input");
            searchInput.attr("placeholder", "Search");
            searchInput.addClass("form-control input-sm");

            // LENGTH - Inline-Form control
            var lengthSelect = datatable.closest(".dataTables_wrapper").find("div[id$=_length] select");
            lengthSelect.addClass("form-control input-sm");

            datatable.bind("page", function(e) {
                window.console && console.log("pagination event:", e); //this event must be fired whenever you paginate
            });
        });
    };

    var showRulesTable = function() {
        // Destroy the rules table if it exists
        try { FB.rulesTable.fnDestroy(); }
        catch (e) { /*console.log("Could not destroy rules table");*/ }

        // If there are no rules then show a message
        if (FB.vis.rules.length > 0) {
            // Show the rules table and hide the no-rules message
            $(".rule-message").addClass("hide");
            $(".datatable").removeClass("hide");

            // Update the table  
            initRulesTable();
        } else {
            // Show no rules message
            $(".rule-message").removeClass("hide");
            $(".datatable").addClass("hide");
        }

        // Show-hide the divs
        $("#rules-list").removeClass("hide");
        $("#add-rule").addClass("hide");       
    };

    var saveRule = function() {

        // Show modal to capture rule name
        bootbox.dialog({
            message: saveMessage,
            title: "Save Rule",
            buttons: {
                success: {
                    label: "OK",
                    className: "btn-success",
                    callback: function() {

                        if ($("#rulename").val() != "") {
                            // Add items to vis object
                            var nextRule = ruleId();
                            var rule = createRule();

                            FB.vis.rules.push({
                                "id": nextRule, 
                                "name": $("#rulename").val(), 
                                "rule": rule.exp,
                                "def" : rule.def,
                                "display": rule.display
                            });

                            // And add all trigger entries
                            $.each(rule.triggers, function(k, v) {                                
                                FB.vis.triggers.push({"cid": v, "rid": nextRule});
                            });

                            // Update the rules table
                            showRulesTable();
                        }
                    }
                }
            }
        });
    };

    // Edit a saved rule
    var doEditRule = function(ruleId) {  
        var rule = $.grep(FB.vis.rules, function(v) { return (v.id === ruleId); });

        // Show rule design page
        showAddRule();

        // Empty the rules list
        $("#rulestable").html("");

        // Convert the rule definition into rule items
        $.each(rule[0].def, function(k, v) {
            // Add an item
            addRuleItem(k + 1, "", "edit");

            // Set the values of each element
            $("#rule-left-" + (k + 1)).val(v.left);
            $("#rule-operator-" + (k + 1)).val(v.op);
            $("#rule-btn-" + (k + 1)).text(v.btn);

            // Determine control type for right (input|select)
            var $text = $("#rule-right-" + (k + 1));
            var $list = $("#rule-right-list-" + (k + 1));

            if (v.type === "input") {
                $text.val(v.right);
            } else {
                // Populate the select with options
                var opts = FB.utils.getOptions(v.left);
                if (opts) {
                    // Update the hidden select
                    FB.utils.updateSelect($list, opts);

                    // Set selected value
                    $list.val(v.right);

                    // Unhide select
                    $list.removeClass("hide");
                    $text.addClass("hide");
                }
            }
        });

        writeExpression("update", ruleId);
    };

    // Delete a saved rule
    var doDeleteRule = function(ruleId, ruleInUse) {
        // Delete all triggers
        var notThisTrigger = $.grep(FB.vis.triggers, function(v) {
            return (parseInt(v.rid) !== parseInt(ruleId));
        });
        FB.vis.triggers = notThisTrigger;

        // Delete the rule
        var notThisRule = $.grep(FB.vis.rules, function(v) { return (parseInt(v.id) !== parseInt(ruleId)); });
        FB.vis.rules = notThisRule;

        // If in use, remove all instances of applied visibility
        if (ruleInUse !== undefined) {

            $.each(ruleInUse, function(k, v) {
                // Clear the rule from control
                var i = FB.pos(v.id);
                FB.def[i].fields["data-vis"].selectedvalue = undefined;

                // Update the control component in def object
                // First we have to show the correct properties screen              
                FB.designer.showProperties(FB.def[i], v.id);
                FB.designer.updateComponent(v.id);
            });

            // And remove the data-vis attribute in DOM            
            $("[data-vis=" + ruleId + "]").removeAttr("data-vis");
        }
        showRulesTable();
    };

    // Show a warning dialog unless user has just pressed 'Continue' on In Use dialog
    var warnDeleteRule = function(ruleId, ruleInUse) {
        // Show a warning dialog
        bootbox.confirm("Are you sure that you want to remove this rule?", function(result) {
            if (result) { doDeleteRule(ruleId, ruleInUse); }
        }); 
    };

    var updateRule = function(ruleId) {
        var currentRule = $.grep(FB.vis.rules, function(v) { return (v.id === ruleId); });

        // Locate position of rule in FB.vis
        var pos = -1;
        $.map(FB.vis.rules, function(o, i) {
            if (o.id === ruleId) { pos = i; }
        });

        if (pos === -1) {
            bootbox.alert("Cannot find rule: something has gone wrong!");
        } else {
            // Show modal to capture rule name
            window.bootbox.dialog({
                message: updateMessage.replace("{RULE}", currentRule[0].name),
                title: "Update Rule",
                buttons: {
                    success: {
                        label: "OK",
                        className: "btn-success",
                        callback: function() {
                            if ($("#rulename").val() != "") {
                                // Update vis object
                                var rule = createRule();
                                FB.vis.rules[pos].rule = rule.exp;
                                FB.vis.rules[pos].name = $("#rulename").val();
                                FB.vis.rules[pos].def  = rule.def;
                                FB.vis.rules[pos].display  = rule.display;

                                // Remove old triggers
                                // Find matches to rule id
                                var removeList = [];
                                $.each(FB.vis.triggers, function(k, v) {
                                    if (parseInt(v.rid) === parseInt(ruleId)) {
                                        removeList.push(k);
                                    }
                                });

                                // Remove, in reverse order
                                $.each(removeList.reverse(), function(k, v) {
                                    FB.vis.triggers.splice(v, 1);
                                });

                                // Add new trigger entries (they might have changed)
                                $.each(rule.triggers, function(k, v) {                                
                                    FB.vis.triggers.push({"cid": v, "rid": ruleId});
                                });

                                // Update the rules table
                                showRulesTable();
                            }
                        }
                    }
                }
            });
        }
    };

    // Change a saved rule
    var changeRule = function(ruleId, mode, noWarnings) {
        // Establish whether the rule is in use by checking the data-vis field of controls in def object
        var ruleInUse = $.grep(FB.def, function(v) {
            if (v.fields["data-vis"] !== undefined) { return (parseInt(v.fields["data-vis"].selectedvalue) === parseInt(ruleId)); }
        });

        if (ruleInUse.length > 0) {
            if (noWarnings !== undefined) {
                // Silently remove rule and all application
                doDeleteRule(ruleId, ruleInUse);
            } else {
                // Remove with warnings (from Rules Table)
                // Get the list of control names
                var msg = "<p>This rule is in use by the following controls:<p><ul>";
                $.each(ruleInUse, function(k, v) {
                    msg += "<li>" + v.fields.id.value + "</li>";
                });
                msg += "</ul>";

                bootbox.dialog({
                    message: msg,
                    title: "Rule in Use",
                    buttons: {
                        cancel: {
                            label: "Cancel",
                            className: "btn-default"
                        },
                        success: {
                            label: "Continue",
                            className: "btn-success",
                            callback: function() {
                                if (mode === "edit") { doEditRule(ruleId); }
                                if (mode === "delete") { doDeleteRule(ruleId, ruleInUse); }
                            }
                        }
                    }
                });                
            }
        } else {
            // Do the edit or deletion
            if (mode === "edit") { doEditRule(ruleId); }
            if (mode === "delete") { 
                // Determine whether to show a warning
                if (noWarnings !== undefined) {
                    doDeleteRule(ruleId);
                } else {
                    warnDeleteRule(ruleId);
                }
            }
        }
    };

    // Strip out the rules.def and rules.display objects when rendering vis object for preview 
    var stripRuleDef = function() {
        // Make copy of rules
        var sRules = {
            "rules":[],
            "triggers":[]
        };
        var s = [];

        $.each(FB.vis.rules, function(k, v) {
            // Ignore def and display items
            s.push({
                "id": v.id,
                "name" : v.name,
                "rule": v.rule
            });
        });

        sRules.rules = s;
        sRules.triggers = FB.vis.triggers;
        return sRules;
    };

    // Event handler for change to rule-left
    // Identifies the control id and establishes whether rule-right (value)
    // should be text input or a list
    var ruleLeftChange = function(event) {
        event.preventDefault();

        // Get id and rule item number
        var id = $(this).val(),
            item = $(this).closest("form").data("ruleitem");

        // Selectors for the right text and select inputs
        var $list = $("#rule-right-list-" + item),
            $text = $("#rule-right-" + item);

        if (id > 0) {
            // Get control matching this id
            var opts = FB.utils.getOptions(id);
            if (opts) {
                // Update the hidden select
                FB.utils.updateSelect($list, opts);
                $list.removeClass("hide");
                $text.addClass("hide");
            } else {
                // Ensure that the text input is displayed
                $list.addClass("hide");
                $text.removeClass("hide");

                // Empty the select
                FB.utils.updateSelect($list, {});
            }
        }
    };

    // var operatorChange = function (event) {
    //     event.preventDefault();

    //     // Get id and rule item number
    //     var operator = $(this).val(),
    //         item = $(this).closest("form").data("ruleitem");

    //     // Selectors for the right text and select inputs
    //     var $list = $("#rule-right-list-" + item),
    //         $text = $("#rule-right-" + item),
    //         id = $("#rule-left-" + item).val();

    //     // If the operator is Contains or does not contain, show textbox
    //     if (operator.indexOf("ontain") === -1) {
    //         // Update the hidden select
    //         FB.utils.updateSelect($list, FB.utils.getOptions(id));
    //         $list.removeClass("hide");
    //         $text.addClass("hide");
    //     } else {           
    //         // Show text input
    //         $list.addClass("hide");
    //         $text.removeClass("hide");

    //         // Empty the select
    //         FB.utils.updateSelect($list, {});
    //     }
    // };

    // Return a list of vis rules that can be applied to control id (index)
    // in a format to populate a Select element.
    var allowedRules = function(index) {
        var rList = [{"selected": true, "value": "", "text": ""}];

        // Filter to only include rules which completely use controls appearing earlier in the DOM
        // NOTE: error thrown if rules not updated from pre-5.0.0
        // Get the sequence of ids as written in DOM
        var idArray = FB.utils.idSequence();

        // Get the position of this control.  Note: we need to cast as an integer
        var idPos = $.inArray(parseInt(index), idArray);    

        var ruleOk = true;
        $.each(FB.vis.rules, function(k, v) { 
            $.each(v.def, function(ruleDefId, ruleDef) {
                if ($.inArray(parseInt(ruleDef.left), idArray) >= idPos) { ruleOk = false; }
            });  
            if (ruleOk) { rList.push({"selected": false, "value": v.id, "text": v.name}); } 
            ruleOk = true;
        });

        return rList;
    };

    // Verify that the vis rule applied to a control (controlId) is allowed
    // i.e. ALL of the constituent inputs in the vis rule occur earlier in the DOM
    var ruleAllowed = function(controlId) {

        var con = FB.d(controlId);
        var allowed = true;

        // Get rule id
        if ((con.fields !== undefined) && (con.fields["data-vis"] !== undefined)) {
            var ruleId = con.fields["data-vis"].selectedvalue;

            if ((ruleId !== undefined) && (ruleId !== "")) {
                // Check whether it is in the array of allowed rule values
                var list = [];
                $.each(allowedRules(controlId), function(k, v) {
                    if (v.value !== "") { list.push(v.value); }
                });

                if ($.inArray(parseInt(ruleId), list) === -1) { allowed = false; }
            }
        }

        return allowed;
    };

    // Highlight a control with an invalid vis rule applied
    var showInvalidVisRule = function(conId) {
        // Selector for control
        var $con = $("[data-id=" + conId + "]");
        // Apply style
        $con.addClass("alert-danger");
        // Append error text, if not already showing
        if ($(".rule-error", $con).length === 0) { $con.append("<div class=\"rule-error\">This control has an invalid visibilty rule applied</div>"); }
    };

    // Clear highlights from a control with a valid vis rule applied
    var clearInvalidVisRule = function(conId) {
        // Selector for control
        var $con = $("[data-id=" + conId + "]");
        // Remove style
        $con.removeClass("alert-danger");
        // Remove error text
        $(".rule-error", $con).remove();
    };

    /*var showInvalidRuleInTable = function (ruleId) {
        // Ensure that dataTable is initialised, or it won't exist in DOM
        // This DOES NOT WORK becuase the dataTable is re-initialised every
        // time the Rules button is pressed; need to store a flag in FB.vis

        // Selector for Rule Id column
        var $cells = $(".datatable td:nth-child(1)");

        if ($cells.length > 0) {
            var $row;
            $.each($cells, function (k, v) {
                if (parseInt($(this).text()) === parseInt(ruleId)) { $row = $(this).closest("tr"); }
            });

            // Highlight the row
            $row.addClass("danger");
        }
    };*/

    // After a move, verify that all controls in the form still have valid vis rules applied
    // If not, highlight the cell and display error text
    var checkAllVisRules = function() {
        // If the control has a vis rule applied, ensure that the rule is still valid,
        // i.e. the constituent controls in the rule are still all above this one
        $.each($(".form-group[data-id]"), function() {
            var conId = $(this).attr("data-id");
            var ruleId = $(this).data("vis");

            if (!ruleAllowed(conId)) {                 
                // Highlight the control
                showInvalidVisRule(conId);

                // And in rules table            
                //showInvalidRuleInTable(ruleId);
            } else {
                clearInvalidVisRule(conId);
            }
        });
    };

    return {
        isTrigger: isTrigger,
        ruleId: ruleId,
        clearRules: clearRules,
        addRuleItem: addRuleItem,
        removeRuleItem: removeRuleItem,
        showAddRule: showAddRule,
        showRulesTable: showRulesTable,
        saveRule: saveRule,
        updateRule: updateRule,
        changeRule: changeRule,
        initRulesTable: initRulesTable,
        stripRuleDef: stripRuleDef,
        allowedRules: allowedRules,
        showInvalidVisRule: showInvalidVisRule,
        clearInvalidVisRule: clearInvalidVisRule,
        checkAllVisRules: checkAllVisRules
    };

}());
