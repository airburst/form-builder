/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/

// Declare runtime namespace
var FB = FB || {};
var FBRun = FBRun || {};

// Rules written as global var on Save or Preview
var vis = vis || {'rules': [], 'triggers': []};

// Short alias function V for getControlValue()
var V = function(id) { return FBRun.getControlValue(id); };

/*======================================================================*\
  Visibility Rules Processing
\*======================================================================*/
FBRun.vis = (function() {
    'use strict';

    var defaults = {
        blankHiddenControls: true
    },

        applyRule = function($selector, show) {
            // Pages are not immediately shown
            if ($selector.hasClass('page')) {
                // Add a data-hidden attribute to the section:
                // This will be used by the moveNext() function
                var pid;
                $.each($selector, function() {
                    if (show) {
                        $(this).removeAttr('data-hidden');

                        // Show linked nav item
                        pid = $(this).attr('id');
                        $('li[data-page=' + pid + ']').removeClass('hide');
                    } else {
                        // Hide the page by setting data
                        $(this).attr('data-hidden', 'true');

                        // Hide linked nav item
                        pid = $(this).attr('id');
                        $('li[data-page=' + pid + ']').addClass('hide');
                    }
                });
            } else {
                // Apply show or hide class to form control
                $.each($selector, function() {
                    var id = $(this).data('id');

                    if (show) {
                        if ($(this).hasClass('hide')) { $(this).removeClass('hide'); }

                        // Trigger any nested vis rules
                        evaluate(id);
                    } else {
                        if (!$(this).hasClass('hide')) { $(this).addClass('hide'); }

                        // Cascade the visibility to any child controls which affect others
                        if (FBRun.vis.options.blankHiddenControls) {
                            // Blank the value and evaluate
                            FBRun.setControlValue(id);
                            evaluate(id);
                        } else {
                            // Trigger any nested vis rules and force them to be hidden, without blanking them
                            evaluate(id, false);
                        }
                    }
                });
            }
        },

        // Evaluate the rules table for control id
        evaluate = function(controlId, forceVis) {
            // Get the list of rules which this control influences
            // If no id is passed then evaluate all
            var ruleList = [];
            if (controlId === undefined) {
                ruleList = vis.rules;
            } else {
                // Get the collection of affected rule ids
                ruleList = $.map(vis.triggers, function(v) {
                    if (parseInt(v.cid) === parseInt(controlId)) {
                        return $.map(vis.rules, function(vv) {
                            if (parseInt(vv.id) === parseInt(v.rid)) {
                                return vv;
                            }
                        });
                    }
                });
            }

            // Evaluate rules in list and apply
            $.each(ruleList, function(k, v) {
                // Check for forced show|hide option
                if (forceVis !== undefined) {
                    applyRule($('[data-vis=' + v.id + ']'), forceVis);
                } else {
                    applyRule($('[data-vis=' + v.id + ']'), eval(v.rule));
                }
            });
        },

        // Handler function for input change event, to calculate visibility
        visChange = function(event) {
            var id = $(this).closest('[data-id]').data('id');
            evaluate(id);
        },

        // Initialise form visibility
        init = function(options) {
            // Update default values with any passed options
            this.options = $.extend({}, defaults, options);

            // Add triggers to all controls which affect visibility
            // Get distinct list of controlids from vis object
            $.each(FB.utils.distinct(vis.triggers, 'cid'), function(k, v) {
                $('[data-id=' + v.cid + '] input, select, textarea').bind('change', visChange);
            });

            // Apply all rules
            evaluate();

            // Add parsley validation listener to ignore hidden fields
            $.listen('parsley:field:validated', function(fieldInstance) {
                if (fieldInstance.$element.is(':hidden')) {
                    // hide the message wrapper
                    fieldInstance._ui.$errorsWrapper.css('display', 'none');
                    // set validation result to true
                    fieldInstance.validationResult = true;
                    return true;
                }
            });

            return this;
        };

    // Public methods
    return {
        evaluate: evaluate,
        applyRule: applyRule,
        init: init
    };
})();
