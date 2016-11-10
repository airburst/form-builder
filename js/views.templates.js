/* global $:false, Handlebars:false */
/*======================================================================*\
  Form Designer Templates
\*======================================================================*/
// Use FB namespace
var FB = FB || {};

// Define class properties and methods
FB.templates = (function () {
    "use strict";

    // Form Component Templates
    var componentTemplate = {
        "textinput":                  Handlebars.compile($("#textinput-component-template").html()),
        "statictext":                 Handlebars.compile($("#statictext-component-template").html()),
        "hiddeninput":                Handlebars.compile($("#hiddeninput-component-template").html()),
        "hiddeninput-preview":        Handlebars.compile($("#hiddeninput-preview-component-template").html()),
        "dateinput":                  Handlebars.compile($("#dateinput-component-template").html()),
        "passwordinput":              Handlebars.compile($("#passwordinput-component-template").html()),
        "prependedtext":              Handlebars.compile($("#prependedtext-component-template").html()),
        "appendedtext":               Handlebars.compile($("#appendedtext-component-template").html()),
        "textarea":                   Handlebars.compile($("#textarea-component-template").html()),
        "alert":                      Handlebars.compile($("#alert-component-template").html()),
        "panel":                      Handlebars.compile($("#panel-component-template").html()),
        "multipleradios":             Handlebars.compile($("#multipleradios-component-template").html()),
        "multipleradiosinline":       Handlebars.compile($("#multipleradiosinline-component-template").html()),
        "multiplecheckboxes":         Handlebars.compile($("#multiplecheckboxes-component-template").html()),
        "multiplecheckboxesinline":   Handlebars.compile($("#multiplecheckboxesinline-component-template").html()),
        "selectbasic":                Handlebars.compile($("#selectbasic-component-template").html()),
        "selectmultiple":             Handlebars.compile($("#selectmultiple-component-template").html()),
        "actionbutton":               Handlebars.compile($("#actionbutton-component-template").html()),
        "calcbutton":                 Handlebars.compile($("#calcbutton-component-template").html()),
        "calcbutton-preview":         Handlebars.compile($("#calcbutton-preview-component-template").html()),
        "calcbuttonv2":               Handlebars.compile($("#calcbuttonv2-component-template").html()),
        "calcbuttonv2-preview":       Handlebars.compile($("#calcbuttonv2-preview-component-template").html()),
        "actionbutton-preview":       Handlebars.compile($("#actionbutton-preview-component-template").html()),
        "inputbutton":                Handlebars.compile($("#inputbutton-component-template").html()),
        "inputbutton-preview":        Handlebars.compile($("#inputbutton-preview-component-template").html()),
        "statictable":                Handlebars.compile($("#table-component-template").html()),
        "tablegroup":                 Handlebars.compile($("#tablegroup-component-template").html()),
        "tablegroup-preview":         Handlebars.compile($("#tablegroup-preview-component-template").html()),
        "tablegroupactionbutton":     Handlebars.compile($("#tablegroup-actions-template").html()),
        "progressbar":                Handlebars.compile($("#progress-template").html())
    };

    // Properties Pane templates - snippets to render each type of attribute in the pane
    var propertiesTemplate = {
        "input":                      Handlebars.compile($("#properties-input-template").html()),
        "input-tags":                 Handlebars.compile($("#properties-input-tags-template").html()),
        "checkbox":                   Handlebars.compile($("#properties-checkbox-template").html()),
        "textarea-split":             Handlebars.compile($("#properties-textarea-split-template").html()),
        "textarea":                   Handlebars.compile($("#properties-textarea-template").html()),
        "select":                     Handlebars.compile($("#properties-select-template").html()),
        "hidden":                     Handlebars.compile($("#properties-hidden-template").html()),
        "actions":                    Handlebars.compile($("#properties-actions-template").html())
    };

    return {
        toolboxTpl: Handlebars.compile($("#toolbox-template").html()),
        propertiesTpl: Handlebars.compile($("#properties-template").html()),
        formTpl: Handlebars.compile($("#form-template").html()),  
        pageTpl: Handlebars.compile($("#new-page-template").html()),
        componentTemplate: componentTemplate,
        propertiesTemplate: propertiesTemplate
    };

}());
