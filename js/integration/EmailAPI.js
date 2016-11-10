/* global 
    $:false,
    jQuery:false,
    window:false,
    document:false
*/
(function ($) {
    'use strict';
    $.EmailAPI = function () {
        this.init();
    };
})(jQuery);

// Properties
$.EmailAPI.prototype = {

    defaults: {
        url: 'https://apiv32.mylifeportal.co.uk/Api/emails',	// LIVE
		// url: 'https://apiv34.mylifetest.co.uk/Api/emails',       // TEST
        // url: 'http://int-mylifeapi.intra.olmgroup.com/Api/emails',  // INT
        sender: 'Birmingham Adoption and Fostering Services',
        from: 'noreply@adoptandfoster.co.uk',
        subject: 'Adoption and Fostering Enquiry',
        body: '',
        apiKey: 'Supercalifragilisticexpialidocious'
    },

    init: function (options) {
        'use strict';
        var self = this;
        self.recipients = [];
        self.options = $.extend({}, self.defaults, options);

        return self;
    },

    update: function (options) {
        'use strict';
        var self = this;
        self.options = $.extend({}, self.defaults, options);

        return self;
    },

    addRecipient: function (email, displayName) {
        'use strict';
        var self = this;

        // Create new recipient object and add to 'To' list
        if ((email !== undefined) && (email !== undefined)) {
            var newRecipient = {
                'EmailAddress': email,
                'DisplayName': displayName
            };
            self.recipients.push(newRecipient);
        }

        return self;
    },

    writeBack: function (data, status) {
        'use strict';
        var self = this;
        if (status !== 'Success') { console.log(status + '\n\n' + JSON.stringify(data)); }
        return self;
    },

    send: function (options) {
        'use strict';
        var self = this;
        if (options) { self.update(options); }

        // Build email
        var emailData = {
            'SenderName': self.options.sender,
            'SenderEmailAddress': self.options.from,
            'Subject': self.options.subject,
            'BodyText': self.options.body,
            'IsBodyHtml': false,
            'Recipients': self.recipients
        };


        // POST using Ajax
        var jqxhr = $.ajax({
            type: 'POST',
            url: self.options.url,
            data: JSON.stringify(emailData),
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-ApiKey', self.options.apiKey)
            },
            success: function (xhr) {
                var r = (jqxhr !== undefined) ? jqxhr.responseText : JSON.stringify(xhr);
                self.status = 'Success';
                // Callback
                self.writeBack(r, self.status);
            },
            error: function (xhr) {
                var r = (jqxhr !== undefined) ? jqxhr.responseText : JSON.stringify(xhr);
                self.status = 'Error';
                self.writeBack(r, self.status);
            },
            fail: function (xhr) {
                var r = (jqxhr !== undefined) ? jqxhr.responseText : JSON.stringify(xhr);
                self.status = 'Fail';
                self.writeBack(r, self.status);
            }
        });
    }
};

/* ====================================================================================
    // Instantiate
    var email = new $.EmailAPI();

    // Set recipients and request manually
    email.send({recipients: [{"EmailAddress": "John Smith", "DisplayName": "john.smith@hotmail.com"}]; });
    email.send({recipients: [{...}, {...}, {...}]; });
    email.addRecipient("john.smith@hotmail.com", "John Smith").send();
==================================================================================== */
var email = new $.EmailAPI();
