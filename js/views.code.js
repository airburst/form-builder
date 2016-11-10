/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, ace, alert*/
/*======================================================================*\
  Form code editor - injects custom JavaScript into the form
\*======================================================================*/
// Use FB namespace
var FB = FB || {};

// Define designer module
FB.code = (function () {
    "use strict";

    // Set the form html code editor
    FB.editor = ace.edit("code-view");
    FB.editor.setTheme("ace/theme/monokai");
    FB.editor.getSession().setMode("ace/mode/javascript");
    FB.editor.setReadOnly(false);
    document.getElementById("code-view").style.fontSize = "14px";

    /*var boilerPlate = "// Example function for a PubSub event\n" +
                    "var copyValNew = (function (eventName, id) {\n" +
                    "   var $sourceGroup = $('[data-id=' + id + ']');\n" +
                    "   var $sourceControl = $('[data-event-name=' + eventName + ']', $sourceGroup);\n" +
                    "   var $targetControl = $('[data-event-model=sub][data-event-name=' + eventName + ']');\n" +
                    "   \n    // Set target val\n" +
                    "   if ($targetControl.hasClass('form-control-static')) {\n" +
                    "       $targetControl.text($sourceControl.val());\n" +
                    "   }\n" +
                    "   else {\n" +
                    "       $targetControl.val($sourceControl.val());\n" +
                    "   }\n" +
                    "})();",*/

    var boilerPlate = "",

        setMode = function (mode) {
            FB.editor.getSession().setMode(mode);
        },

        get = function (mode) {
            if (mode === undefined) { mode = "normal"; }

            var c = FB.editor.getSession().getValue();

            if (mode !== "no-spaces") {
                return c;
            }
            c = FB.utils.replaceAll(c, "\n", "");
            return FB.utils.replaceAll(c, "    ", "");
        },

        set = function (code, mode) {
            if (mode === undefined) { mode = "ace/mode/xml"; }

            // Update textarea with value
            $("#html").val(code);

            // Format as XML (for indentation)
            $("#html").format({method: "xml"});

            // Set Ace editor with formatted code
            var fCode = $("#html").val();
            FB.editor.setValue(fCode);
            setMode(mode);

            // Clear selection (all selected by default)
            FB.editor.gotoLine(1);
        },

        clear = function () {
            set("");
        },

        init = function () {
            set(boilerPlate, "ace/mode/javascript");
        },

        formCode = function () {
            // Render code for current form mode
            var mode = FB.def[0].fields.output.selectedvalue,
                code = FB.preview.render(mode);

            // Update the Ace editor
            set(code, "ace/mode/javascript");
        },

        store = function () {
            FB.def[0].code = JSON.stringify(get());
        },

        // Return a list of user-defined global functions
        listGlobalFunctions = function () {
            return Object.keys(window).filter(function (v) {
                // Test for global function
                if (!(window[v] instanceof Function)) { return false; }

                // Ignore blacklist
                if ((v === "$") || (v === "jQuery") || (v === "bootbox") || (v === "Parsley")) { return false; }

                // Ignore any native functions
                return (!/\[native code\]/.test(window[v].toString()) ? true : false);
            }).sort();
        },

        // Load custom code from editor int the DOM (to evaluate global functions)
        loadJS = function (code) {
            // Create a new script object
            var script = window.document.createElement("script");

            // Set dynamic id and code
            script.id = "fb-custom";
            script.text = code;

            // Add to DOM
            var ref = window.document.getElementsByTagName("script")[0];
            ref.parentNode.insertBefore(script, ref);

            // Remove second script if it has our dynamic id
            ref = window.document.getElementsByTagName("script")[1];
            if (ref.id === "fb-custom") { ref.remove(); }

            return script;
        },

        listFunctions = function () {
            loadJS(get());
            return listGlobalFunctions();
        },

        initCustomFieldsEditor = function () {
            // Initialise the custom fields code editor
            FB.customFieldsEditor = ace.edit("custom-fields");
            FB.customFieldsEditor.setTheme("ace/theme/chrome");
            FB.customFieldsEditor.getSession().setMode("ace/mode/json");
            FB.customFieldsEditor.setReadOnly(false);
            document.getElementById("custom-fields").style.fontSize = "14px";

            if (FB.d(0).custom !== undefined) {
                FB.customFieldsEditor.setValue(JSON.parse(FB.d(0).custom));
                FB.customFieldsEditor.gotoLine(1);
            }
        };

    return {
        get: get,
        set: set,
        setMode: setMode,
        clear: clear,
        init: init,
        formCode: formCode,
        store: store,
        listFunctions: listFunctions,
        initCustomFieldsEditor: initCustomFieldsEditor
    };

}());
