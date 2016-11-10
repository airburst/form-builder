/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/
/* ====================================================================================
   Html Templates for Runtime use
==================================================================================== */
(function($) {
    'use strict';
    $.ShelterTemplates = function() {
        this.init();
    };
})(jQuery);

// Properties
$.ShelterTemplates.prototype = {

    init: function() {
        'use strict';

        this.property = 1;
    },

    // Replace all occurences of a string
    replaceAll: function(find, replace, str) {
        'use strict';
        return str.replace(new RegExp(find, 'g'), replace);
    },

    // Property Summary Panel Body
    panelTpl: function(property) {
        'use strict';
        var self = this,
            html = '<div id="property-template-p{{property}}">' +
        /*      "    <div class=\"row\">" +
                "       <div class=\"col-md-6\">" +
                "           <p class=\"subhead\">Balance</p>" +
                "       </div>" +
                "       <div class=\"col-md-6\">" +
                "           <span id=\"balancep{{property}}\" class=\"pull-right subhead label label-primary\"></span>" +
                "       </div>" +
                "   </div>" +*/
                '   <!-- Affordability Table -->' +
                '   <div class="row">' +
                '       <div class="col-md-12">' +
                '           <div class="form-group">' +
                '               <label for="statictextp{{property}}-1" class="hide control-label">Income and Expenditure Summary</label>' +
                '               <div class="col-sm-12">' +
                '                   <p id="statictextp{{property}}-1" name="statictextp{{property}}-1" class="form-control-static subhead">Affordability</p>' +
                '               </div>' +
                '           </div>' +
                '           <div class="table-responsive" id="incandexpsummaryp1">' +
                '               <table class="table table-bordered table-striped">' +
                '                   <thead>' +
                '                       <tr>' +
                '                           <th>Item</th>' +
                '                           <th>Monthly</th>' +
                '                           <th>Weekly</th>' +
                '                       </tr>' +
                '                   </thead>' +
                '                   <tbody>' +
                '                   </tbody>' +
                '               </table>' +
                '           </div>' +
                '       </div>' +
                '   </div><!-- End Affordability Table -->' +
                '   <!-- Alerts Table -->' +
                '   <div class="row">' +
                '       <div class="col-md-12">' +
                '           <div class="form-group">' +
                '               <label for="statictextp{{property}}-2" class="hide control-label">Alerts</label>' +
                '               <div class="col-sm-12">' +
                '                   <p id="statictextp{{property}}-2" name="statictextp{{property}}-2" class="form-control-static subhead">Alerts' +
                '               </p>' +
                '               </div>' +
                '           </div>' +
                '           <div class="table-responsive" id="alertsout">' +
                '               <table class="table table-bordered table-striped">' +
                '                   <thead>' +
                '                       <tr>' +
                '                           <th>Information</th>' +
                '                       </tr>' +
                '                   </thead>' +
                '                   <tbody>' +
                '                   </tbody>' +
                '               </table>' +
                '           </div>' +
                '       </div>' +
                '   </div><!-- End Alerts Table -->' +
                '   <!-- Buttons -->' +
                '   <div class="row">' +
                '       <div class="col-md-6">' +
                '           <button class="btn btn-danger btn-summary-p{{property}} col-md-12">Print Summary</button>' +
                '       </div>' +
                '       <div class="col-md-6">' +
                '           <button class="btn btn-danger btn-details-p{{property}} col-md-12" onclick="showDetails({{property}});">View Details</button>' +
                '       </div>' +
                '   </div><!-- End Buttons -->';

        return self.replaceAll('{{property}}', property, html);
    },

    // Property Summary Panel Body
    alertTpl: function(property, rent, rooms) {
        'use strict';
        var self = this,
            html = '<div class="row">' +
                    '   <div class="col-md-12">' +
                    '        <div class="form-group">' +
                    '            <div class="alert alert-warning alert-dismissable">' +
                    '                <a class="close" href="#" data-dismiss="alert" aria-hidden="true">&times;</a>' +
                    '                <div>' +
                    '                    <h4>Your current property is not affordable</h4>' +
                    '                </div>' +
                    '                <div>' +
                    '                    <p>Do you want to find other areas where the average rental is affordable for you?</p>' +
                    '                    <button class="btn btn-danger btn-lha-{{property}}" onclick="updateAffordableLhas({{rent}}, {{rooms}}, {{mode}});">Find affordable areas</button>' +
                    '                </div>' +
                    '            </div>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>',
            output = '';

        output = self.replaceAll('{{property}}', property, html);
        output = self.replaceAll('{{rent}}', rent, output);
        output = self.replaceAll('{{rooms}}', rooms, output);
        output = self.replaceAll('{{mode}}', '\'' + $('#mode').val() + '\'', output);

        return output;
    }
};

/* ====================================================================================
   Instantiate
==================================================================================== */
//var tpl = new $.ShelterTemplates();
