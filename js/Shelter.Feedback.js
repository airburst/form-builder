/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, bowser, alert*/
(function($) {
    'use strict';
    $.Feedback = function() {
        this.init();
    };
})(jQuery);

$.Feedback.prototype = {

    defaults: {
        title: 'Feedback and Problems',
        url: 'https://support.olmsystems.com',
        buttonLabel: 'Open Support Website',
        message: ''
    },

    init: function(options) {
        'use strict';
        var self = this;
        self.options = $.extend({}, self.defaults, options);
        return self;
    },

    open: function(options) {
        'use strict';

        var self = this,
            browserData = (window.bowser !== undefined) ? 'browser = ' + JSON.stringify(bowser) + ';' : '',
            calcData = (calc.results.length > 0) ? 'calcData = ' + JSON.stringify(calc.results) + ';' : 'request = ' + JSON.stringify(calc.request) + '\n\n' + 'response = ' + JSON.stringify(calc.response),
            messageBody = '',
            successBtn = {};

        self.options = $.extend({}, self.defaults, options);

        messageBody += '<p>Please raise a support call with OLM by clicking the button below.  This will open a new website.</p><ul><li>Select "Raise new"</li><li>Product: A4dability</li><li>Schema: Select the most appropriate call type</li><li>Attachment: Word or Excel 97 to 2003 only</li><li>Description: Please explain your issue, request, question or feedback. If there is any text in the box below, please copy and paste it into the Details section.</li><li>Submit</li></ul>';
        messageBody += '<div class="form-group">';
        messageBody += '<p class="bold">Please copy and paste text below into the support call</p>';
        messageBody += '<textarea id="datatext" name="datatext" rows="10" class="form-control" tabindex="1">' + browserData + '\n\n' + calcData + '</textarea>';
        messageBody += '</div>';

        // If button label is 'none' then do not show button
        if (self.options.buttonLabel !== 'none') {
            successBtn = {
                success: {
                    label: self.options.buttonLabel,
                    className: 'btn-success',
                    callback: function() {
                        window.open(self.options.url);
                    }
                }
            };
        }

        // Override message body if set
        if (self.options.message != '') {
            messageBody = self.options.message;
        }

        bootbox.dialog({
            message: messageBody,
            title: self.options.title,
            buttons: successBtn
        });
    }
};

var feedback = new $.Feedback();
// feedback.open();
