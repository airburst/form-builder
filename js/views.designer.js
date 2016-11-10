/* global $:false, ace:false, document:false, bootbox: false */
/*======================================================================*\
  Form Designer UI
\*======================================================================*/
// Use FB namespace
var FB = FB || {};
var FBData = FBData || {};

// Define designer module
FB.designer = (function () {
    "use strict";

    var snippetList = [];

    // Create Toolbox View
    // Create data object for all controls from json files
    var toolsData = [
        {
            title: "Text Inputs",
            controls: FBData.inputs.list
        },
        {
            title: "Radios / Checkboxes",
            controls: FBData.radios.list
        },
        {
            title: "Selects",
            controls: FBData.selects.list
        },
        {
            title: "Buttons",
            controls: FBData.buttons.list
        },
        {
            title: "Tables",
            controls: FBData.tables.list
        },
        {
            title: "Snippets",
            controls: snippetList
        }
    ];

    /*======================================================================*\
      Methods
    \*======================================================================*/
    var showPanels = function () {
      $("#left-pane, #right-pane").removeClass("flex-hide");
    };

    var hidePanels = function () {
      $("#left-pane, #right-pane").addClass("flex-hide");
    };

    var showCode = function () {
      // Show code editor and hide form view
      $("#form-html").fadeIn("fast").removeClass("hide");
      if (!$("#content").hasClass("hide")) { $("#content").addClass("hide"); }
      if (!$("#rulebuilder").hasClass("hide")) { $("#rulebuilder").addClass("hide"); }

      // Toggle all buttons that are not code 
      if ($("#show-design-button").hasClass("active")) { $("#show-design-button").removeClass("active"); }
      if ($("#show-rules-button").hasClass("active")) { $("#show-rules-button").removeClass("active"); }
      $("#show-code-button").addClass("active");

      // Hide panels
      hidePanels();
    };

    var showDesign = function () {
      // Hide all templates that are not rulebuilder 
      if (!$("#form-html").hasClass("hide")) { $("#form-html").addClass("hide"); }
      if (!$("#rulebuilder").hasClass("hide")) { $("#rulebuilder").addClass("hide"); }
      if (!$("#html-editor-background").hasClass("hide")) {
            $("#html-editor-background").addClass("hide");
            //$(".html-editor").destroy();
        }
      $("#content").fadeIn("fast").removeClass("hide");

      // Toggle all buttons that are not rulebuilder 
      if ($("#show-code-button").hasClass("active")) { $("#show-code-button").removeClass("active"); }
      if ($("#show-rules-button").hasClass("active")) { $("#show-rules-button").removeClass("active"); }
      $("#show-design-button").addClass("active");

      // Fade the panels back if they are hidden
      showPanels();
    };

    var showRuleBuilder = function () {
      
      // Hide all templates that are not rulebuilder  
      if (!$("#content").hasClass("hide")) { $("#content").addClass("hide"); } 
      if (!$("#form-html").hasClass("hide")) { $("#form-html").addClass("hide"); } 

      // Show rulebuilder panel
      $("#rulebuilder").fadeIn("fast").removeClass("hide");

      // Toggle all buttons that are not rulebuilder 
      if ($("#show-code-button").hasClass("active")) { $("#show-code-button").removeClass("active"); }
      if ($("#show-design-button").hasClass("active")) { $("#show-design-button").removeClass("active"); }
      $("#show-rules-button").addClass("active");

      // Initialise controls select
      FB.rulebuilder.showRulesTable();
      hidePanels();
    };

    /*======================================================================*\
      HTML Editor
    \*======================================================================*/
    var showHtmlEditor = function ($source) {
        $(".html-editor").summernote({height: 300});

        // Populate with code
        if ($source !== undefined) { 
            var id = $source.closest("[data-controlid]").data("controlid");
            var name = $source.attr("id");

            // Update button with property id and name
            $("#save-html-btn").attr("onclick", "FB.designer.closeHtmlEditor('" + id + "', '" + name + "');");

            // Write code
            $(".html-editor").code($source.val());
        }

        // Show the editor and hide content
        $("#content").addClass("hide");
        $("#html-editor-background").fadeIn("fast").removeClass("hide");
        hidePanels();
    };

    var closeHtmlEditor = function (id, name) {
        if ((id !== undefined) && (name !== undefined)) {
            // Update def object node with new html
            var o = FB.def[FB.pos(id)];     
            o.fields[name].value = FB.utils.replaceAll($(".html-editor").code(), "<br>", "<br/>");

            // Update the control in form
            showProperties(o, id);
            updateComponent(id);
        }

        // Show the designer
        showDesign();

        // Destroy the editor instance
        $(".html-editor").destroy();
    };


    var openHtmlEditor = function () {
        // Show HTML editor and load with exiting code
        showHtmlEditor($(this));
    };


    /*======================================================================*\
      Toolboxes and panels
    \*======================================================================*/
    var updateToolbox = function (panel) {
        // Create wrapper object as a helper for Handlebars toolbox template
        var wrapper  = {tools: toolsData};
        var h        = FB.templates.toolboxTpl(wrapper);

        // Attach to left panel
        $("#left-pane .panel-content").html(h);

        // If a panel is specified, show that
        if (panel !== undefined) {
            $.each($(".panel"), function (k, v) {    
                if ($.trim($(".panel-heading", $(this)).text()) === panel) {
                    $(".panel-collapse", $(this)).addClass("in");
                }
            });
        }
        // Else expand the first accordion panel
        else {
            $("#collapse0").addClass("in");    
        }

        $(".tool").each(function(){
            $(this).bind("dragstart", FB.events.dragStart);
        });

        return false;
    };

    //Properties Panel View - Attributes
    var showProperties = function (data, index) {  

        // Attach empty properties form to right panel
        $("#right-pane .panel-content").html(FB.templates.propertiesTpl({data:{id: index}}));

        // Define selectors for each tab in the panel, so that we can assign controls
        var $prop = $("#properties-form");
        var $val  = $("#validation-form");
        var $evt  = $("#events-form");
        var $vis  = $("#vis-form");
        var $custom  = $("#custom-form");

        // Populate the panel form with attribute controls
        if (data.fields) {           
            // Default target is the properties pane
            var $target = $prop;

            // Walk through each field and append the correct mini template
            $.each(data.fields, function (k, v) {               
                var snippet = {controltype: k, id: index, properties: v};

                // Apply the appropriate mini template for each attribute type
                var s;
                switch (v.type) {
                    case "input":
                        s = FB.templates.propertiesTemplate["input"](snippet);
                    break;

                    case "input-tags":
                        s = FB.templates.propertiesTemplate["input-tags"](snippet);
                    break;

                    case "checkbox":
                        s = FB.templates.propertiesTemplate["checkbox"](snippet);
                    break;

                    case "textarea-split":
                        s = "";
                        var sText = FB.templates.propertiesTemplate["textarea-split"](snippet);
                        // trim each line
                        $.each(sText.split("\n"), function(k,v){
                            s += $.trim(v) + "\n";
                        });                      
                    break;  

                    case "textarea":
                        s = FB.templates.propertiesTemplate["textarea"](snippet);
                    break; 

                    case "select":
                        // #data-vis select needs to be populated with the list of all vis rules
                        if (k === "data-vis") {       
                            var rList = FB.rulebuilder.allowedRules(index); 
                           
                            // Establish whether a rule is currently applied
                            if (snippet.properties.selectedvalue !== undefined) {
                                $.each(rList, function(k) {
                                    rList[k].selected = (parseInt(rList[k].value) === parseInt(snippet.properties.selectedvalue)) ? true : false;
                                });
                            }

                            // Draw the control
                            snippet.properties.value = rList;
                        }
                        s = FB.templates.propertiesTemplate["select"](snippet);
                    break;

                    case "hidden":                   
                        s = FB.templates.propertiesTemplate["hidden"](snippet);
                    break;

                    default:
                }

                // Append to appropriate panel 
                $target = $prop;  
                if (k.indexOf("parsley") > -1) { $target = $val; }  // "parsley" appears in all data validation controls
                if (k.indexOf("event") > -1) { $target = $evt; }    // "event" appears in all data validation controls
                if (k.indexOf("vis") > -1) { $target = $vis; }      // "vis" appears in all data visibility controls
                if (k.indexOf("custom") > -1) { $target = $custom; }      // custom data controls
                $target.append(s);
            });

            // Add actions buttons
            // Don't show the delete button for the form object
            var del = true, clone = true;
            if (data.title === "Form") { del = false; }   
            if ((data.title === "Form") || (data.title === "Page") || (data.title === "Tables")) { clone = false; }
            $prop.append(FB.templates.propertiesTemplate["actions"]({action: "FB.designer.updateComponent", index: index, showdelete: del, showclone: clone}));
            $val.append(FB.templates.propertiesTemplate["actions"]({action: "FB.designer.updateComponent", index: index, showdelete: false}));
            $evt.append(FB.templates.propertiesTemplate["actions"]({action: "FB.designer.updateComponent", index: index, showdelete: false}));
            $vis.append(FB.templates.propertiesTemplate["actions"]({action: "FB.designer.updateComponent", index: index, showdelete: false}));
            //$custom.append(FB.templates.propertiesTemplate["actions"]({action: "FB.designer.updateComponent", index: index, showdelete: false}));

            // trim any textareas
            $("textarea", $target).val($("textarea", $target).text().trim());

            // Bind the HTML editor to any .edit-html inputs
            $(".edit-html").bind("click", openHtmlEditor);
        }
    };

    // Show properties for a clicked control
    // Note: ths is set === this (class) in the event binding
    var updateProperties = function (event) {
        // Target the div around the clicked text
        var o = $(this);

        // Get object instance data from definition store by id
        var index = o.data("id");      
        var component = FB.d(index);

        // Update the properties view
        //event.data.ths.showProperties(component, index);
        showProperties(component, index);

        event.stopPropagation();
        event.preventDefault();
    };

    // Set the validation data-parsley-group if *any* validation fields are set
    // For normal controls, the target is current page id
    // For TableGroups, the Tg Id is set
    var setValidationGroup = function (index) {
      // Check for TableGroup, which will have a parent
      var o = FB.def[FB.pos(index)];

      // Set the appropriate group value; page id or tablegroup id
      var target = (o.parent !== undefined) ? o.parent : $("#page").val();
      var group = "";

      // Selector for every control in validation panel, apart from group
      // Note, no radios or textareas are expected
      var $fields = $("input[name!=data-parsley-group], select", $("#validation"));
      $.each($fields, function (k, v) {
        if ($(this).attr("type") === "checkbox") {
          if (v.checked) { group = target; }
        }
        else {
          if ($(this).val() !== "") { group = target; }
        }
      });
    
      // Set the field value
      $("input[name=data-parsley-group]", $("#validation")).val(group);     
    };

    // Get html for a control by compiling template with data
    var getComponentView = function (object, type, mode) {
      if (type === undefined) { type = ""; }
      if (mode === undefined) { mode = "bootstrap3"; }

      // Get template for component type (id)
      var ct = object.controltype;
     
      // use the preview template for actionbuttons (+ others in future)
      if (type === "preview") { 
        if ((ct === "actionbutton") || (ct.indexOf("calcbutton") > -1) || (ct === "tablegroup") || (ct === "hiddeninput")) {
          ct = ct + "-preview";
        }
      }
      // Get the appropriate template for output mode
      var tpl;
      if (mode === "bootstrap2"){
        tpl = FB.templates.componentTemplateB2[ct];
      }
      else {
        tpl = FB.templates.componentTemplate[ct];
      }

      // Check type ("new" or undefined)
      // We will only change the object.fields.id.value for new items
      if (type === "new") {
        // Update the control id to append a unique number
        // Note: cannot simply count as there may have been earlier deletions
        var max = 0;
        $.map(FB.def, function (o) {
          if (o.controltype === ct) {
            var currentId = o.fields.id.value;

            // Get the part of control id after the stub type
            var val = currentId.substring(ct.length,currentId.length);

            // Test whether the part is an integer; if not, then ignore
            if (parseInt(val) === +val) {
              max = Math.max(max, val);
            }
          }
        });
        object.fields.id.value = ct + (max + 1);

        // If object is not a form, page, statictext, alert, hidden or table group then allocate the next tabId
        if ((object.id > 0) && (ct.indexOf("page") === -1) && (ct.indexOf("table") === -1) && (ct.indexOf("statictext") === -1) && (ct.indexOf("alert") === -1) && (ct.indexOf("panel") === -1) && (ct.indexOf("hidden") === -1)) {
          object.fields.tabindex.value = FB.tabId++;
        }
      }

      // For selectable values (checkboxes, radios, selects), we need to establish the selected value
      // and store it in a new selectedvalue item
      $.each(object.fields, function (k, v){
        if (v.type === "select") {
          var selectedValue = $.map(v.value, function (vv, kk){
            if ((vv.selected === true) || (vv.checked === true)) {
              return (vv.value);
            }
          });
          if (selectedValue !== undefined) {v.selectedvalue = selectedValue[0];}
        }

        // And for multiple values (checkboxes, radios) we need to append an itemid for each item
        if (v.type === "textarea-split") {
          $.each(v.value, function (kk,vv){
            vv.itemid = kk;
          });
        }
      });

        // Compile with object data
        var wrapper = {data: object};
        var html = $.trim(tpl(wrapper));

        // In preview mode, apply a class of 'hide' if there is a vis rule
        if (type === "preview") {          
            if (
              (object.fields["data-vis"] !== undefined) && 
              (object.fields["data-vis"].selectedvalue !== undefined) &&
              (object.fields["data-vis"].selectedvalue != "")
            ) {
                // Add 'hide'
                if (ct !== "tablegroup-preview") {
                  var i = html.indexOf("form-group") + 10;    // Find end of <div class = "form-group"
                    if (i > 9) {
                        var text = html.substr(0, i) + " hide" + html.substr(i, html.length);            
                        return text;
                    } else {
                        return html;
                    }             
                } else return html;
            } else {
                return html;
            }
        } else {
            return html;
        }
    };

    // Change the attribution of a component from properties panel 
    // And save changes back to def model
    var updateComponent = function (index) {
      // Get def index
      var p = FB.pos(index);

      // Update validation group field
      setValidationGroup(index);

      $.each(FB.def[p].fields, function (k, v) {
        // Create selector for the field in panel
        var $a = $("#right-pane").find("[name=" + k + "]"); 
        if ($a.length > 0) {
          // Process the field value  
          var nv;
          switch ($a[0].type) {

            case "text":
              // Test whether tabindex has been changed 
              if ($a[0].name === "tabindex") {
                // If it has been changed to a too large number, don"t allow the change         
                if ($a.val() >= FB.tabId) { $a.val(v.value); }

                // if it has been changed to a lower value, then renumber all others
                if ($a.val() !== v.value) { FB.renumberTabIndex(index, $a.val()); }
              }
              nv = $a.val();
              break;

            case "checkbox":     
              nv = $a[0].checked;        
              break;

            case "textarea":
              // Check for textarea (simple value) or textarea-split (multiple values)
              if ($(this).attr("type") === "textarea") {
                nv = $a.val();
              }
              else {
                // Standard radios, checkboxes and selects: 
                // Create new array of text, value, checked
                // the third "children" parameter is used for Table Group Headings
                nv = FB.utils.convertTextToObject($a.val().trim(), v.label, FB.def[p].children);
              }
              break;

            case "select-one":
              // Get the selected value
              nv = [];
              $.each($a[0].options, function (kk,vv){
                nv.push({value: vv.value, text: vv.text, selected: vv.selected});
              });
              break;

            case "hidden":
              nv = $a.val();
              break;

            default:
              //console.log("Unhandled type [" + $a[0].type + "] in function updateComponent()");
          }

          // Update the def object
          if (nv !== null) { v.value = nv; }

          // If this is a validation field and a radio/checkbox controltype, then copy to the [0] radio/checkbox value
          // This allows the handlebars template to apply validation to the first input only
          if ((k.indexOf("parsley") > -1) && (FB.def[p].controltype.substring(0, 8) === "multiple")) {
            if (FB.def[p].fields.radios !== undefined) {
                FB.def[p].fields.radios.value[0][k] = v; 
            }
            else {
                FB.def[p].fields.checkboxes.value[0][k] = v;
            }
          }
        }
      });

      // Check for TableGroup items
      // If columndata is false, then make columnheading false too
      if ((FB.def[p].fields.columndata !== undefined) && (FB.def[p].fields.columndata.value === false)) { 
        FB.def[p].fields.columnheading.value = false; 
      }

      // Update form view
      // If index is zero, update the form attributes
      if (index === 0) {
        FB.form.update();
      }
      // Else update the Control
      else {
        var o = FB.def[p];
        // If the object is a page, then update the section markup
        if (o.title === "Page") {
          // Update the page (section) attributes in the DOM     
          var pageId = o.fields.id.value;
          var newName = o.fields.name.value;

          // Set div name
          $("[data-id=" + o.id + "]").attr("name", newName);

          // Set page text and option value in navbar
          //$("[data-defid=" + o.id + "]").val(pageId);
          $("#page option[value=" + pageId + "]").text(newName);

          // Update Page-name above form
          $("#page-name").text(newName);

          // Add a visibility rule if one was set
          var selectedValue = $.map(o.fields["data-vis"].value, function (vv) {
            if ((vv.selected === true) || (vv.checked === true)) {
              return (vv.value);
            }
          });
          if (selectedValue !== undefined) {
            o.fields["data-vis"].selectedvalue = selectedValue[0];
            $("[data-id=" + o.id + "]").attr("data-vis", o.fields["data-vis"].selectedvalue);
          }
        }
        else {
          // Add updated element instance to the DOM and remove the old one
          var $f = FB.utils.$id(index);         
          $f.after(getComponentView(o)); 
          $f.remove();                      

          // Refresh selector and add click event
          $f = FB.utils.$id(index);
          $f.bind("click", {ths: this}, updateProperties);

          // Special Cases
          // Table Group - need to add linked controls back into dropzone and bind "click" to them all
          if (o.controltype === "tablegroup") {
            FB.tableGroup.update($f);
          }

          // Child of a parent TableGroup - update headings
          if (o.parent !== undefined) {
            // If the child element is a column heading
            if (o.fields.columnheading.value === true) {
              var found = false;

              // Try to update the changed heading with new label     
              $.each(FB.def[FB.pos(o.parent)].fields.headings.value, function (k, v) {               
                if (index === v.value) {
                  v.text = o.fields.label.value;
                  found = true;
                }
              });

              // If no match found then insert new heading in the correct sequence
              // This occurs if you turn colheading on for a control
              if (!found) {          
                // Walk through the children to find position
                var childPos = 0;
                $.each(FB.d(o.parent).children, function (k, v) {
                  if (parseInt(o.id) === parseInt(v)) {
                    // Insert text at position childPos
                    FB.def[FB.pos(o.parent)].fields.headings.value.splice(childPos, 0, {"text": o.fields.label.value, "value": o.id});
                  }
                  else {
                    // If the current index is a col heading, increment the counter
                    if (FB.d(v).fields.columnheading.value === true) { childPos++; }
                  }             
                });
              }
            }
            else {               
                // Remove the heading
                var match = $.map(FB.d(o.parent).fields.headings.value, function(v, k) { 
                    if (index === v.value) { return k; } 
                });                
                if (match.length > 0) { 
                    FB.def[FB.pos(o.parent)].fields.headings.value.splice(match, 1); 
                }
            }

            // Repaint the TableGroup      
            FB.tableGroup.updateHeadings(o.parent);
          }

          // Check whether this control has options and is used in a vis rule
          /*if (FB.utils.getOptions(index)) {
            var t = FB.rulebuilder.isTrigger(index);
            if (t) {
console.log(t);              
              // Identify affected rules
              var rules = $.map(t, function (v, k) { return (v.rid); });
console.log(rules);
              // Delete the rule, triggers and any application, without warning
              $.each(rules, function (k, v) {
                  FB.rulebuilder.changeRule(v, "delete", "noWarnings");
              });
            }
          }*/
        }
      }
    };

    var deleteComponent = function (index) {
      // Test if the controltype is a TableGroup
      var o = FB.d(index);
      if (o !== undefined) {
        if (o.controltype === "tablegroup") {
          
          // Cascade the deletion of all linked controls
          $.each(o.children, function (k, v) {          
            FB.removeItemFromDef(v);
          });

          // Add drop binding back to row dropzone
          FB.utils.$id(index).parent().bind("drop", FB.events.dropEvent);
        }

        // If the control is linked to a TableGroup, then remove from the links array
        // The TableGroup object id exists as a "parent" field.
        if (o.parent !== undefined) {
          // TableGroup id and links list
          var pid = o.parent;    
          // Update the links in def object
          FB.tableGroup.removeItem(index, pid);
        }

        // Remove item from def object
        FB.removeItemFromDef(index); 

        // Remove component (data-id="index") from form view
        FB.utils.$id(index).remove();
      }
    };

    // Clone a control and add to Snippets toolbox
    var cloneComponent = function (index){
      // Get def object
      var o = $.extend({}, FB.d(index));
      
      // Prompt for Snippet name
      bootbox.prompt("Enter a name for this snippet", function(result) {                
        if ((result !== null) && (result != "")) { 
          // Update snippet title                                           
          o.title = result;
          // Add to Snippets 
          snippetList.push(o);
          // Redraw toolbox
          updateToolbox("Snippets");
        }
      });
    };

    var emptyProperties = function () {
        showProperties({});
    };

    var showTabIndexOverlay = function () {
        // Remove any overlay already being shown
        $(".show-tab").remove();

        // Display new overlay
        $.each(FB.utils.idSequence(), function (k, v) {
            var p = FB.pos(v);         
            if (FB.def[p].fields.tabindex !== undefined) {
                $("[data-id=" + v + "]").prepend("<div class=\"show-tab label label-primary\">" + FB.def[p].fields.tabindex.value) + "</div>";
            }
        });
        return false;
    };

    var removeTabIndexOverlay = function () {
        $(".show-tab").remove();
        return false;
    };
    
    return {
        toolsData: toolsData,
        showPanels: showPanels,
        hidePanels: hidePanels,
        showCode: showCode,
        showDesign: showDesign,
        showRuleBuilder: showRuleBuilder,
        showHtmlEditor: showHtmlEditor,
        closeHtmlEditor: closeHtmlEditor,
        updateToolbox: updateToolbox,
        showProperties: showProperties,
        updateProperties: updateProperties,
        updateComponent: updateComponent,
        deleteComponent: deleteComponent,
        setValidationGroup: setValidationGroup,
        cloneComponent: cloneComponent,
        emptyProperties: emptyProperties,
        showTabIndexOverlay: showTabIndexOverlay,
        removeTabIndexOverlay: removeTabIndexOverlay,
        getComponentView: getComponentView
    };

}());
