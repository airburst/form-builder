/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/
var FBRun = FBRun || {};

FBRun.northing = [];
FBRun.easting  = [];

/*======================================================================*\
  Custom Data Handlers
\*======================================================================*/
var results = [
        {
            'html': '',
            'property': ''
        }
    ],
    AGE = 3,
    RELATIONSHIP = 5,
    EMP_STATUS = 6;

// Transpose person ids in the allincoutmonthly table for names
function transposePersonNames() {
    'use strict';

    // Get the list of names from benname Select
    var names = [],
        $names = $('[id=benname] option');

    $.each($names, function(k) {
        names.push({id: (k + 1), name: $(this).text()});
    });

    // Transpose
    $.each($('[id=allincoutmonthly] tr'), function(k) {
        if (k > 0) {
            var row = $('td:first', $(this)),
                match = $.grep(names, function(vv) { return (vv.id == row.text()); });

            // Make the last row title = "Totals"
            if (row.text() === '0') {
                row.text('Totals');
            } else {
                if (match[0] !== undefined) { row.text(match[0].name); }
            }
        }
    });
}

function showNegativeRows() {
    'use strict';

    var $page = $('#p15, #p17'),
        $cells = $('td', $page);

    $.each($cells, function() {
        if (parseFloat($(this).text()) < 0) { $(this).closest('tr').addClass('danger'); }
    });
}

// Convert all floating point results to 2 decimal places
function cleanCurrency() {
    'use strict';

    // Blacklist of numeric cells that should not be changed
    var $page = $('#p15, #p17'),
        avoid = [
            $('#p1hhsum td:nth-child(2)'),
            $('#p1hhsum td:nth-child(3)'),
            $('#accomdetails tr:nth-child(12) td:nth-child(2)')
        ],
        $cells = $('td', $page);

    // Check all table cells
    $.each($cells, function() {
        var $self = $(this),
            found = false,
            j;

        $.each(avoid, function(i) {
            for (j = 0; j < avoid[i].length; j++) {
                if ($self[0] === avoid[i][j]) { found = true; }
            }
        });
        if (!found) { $(this).html(FB.utils.currencyTest($(this).text())); }
    });
}

function populateAccomTable() {
    'use strict';

    // Create a data object to populate the table #accomdetails
    var data = [];
    data.push([1, 'Occupier Status',        $('#p1occstatus').val()]);
    data.push([2, 'Landlord Type',          $('#p1landlord').val()]);
    // Use moving on postcode if it exists
    var pcode = ($('#newpostcode').val() != '') ? $('#newpostcode').val() : $('#postcode').val();
    data.push([3, 'Postcode',               pcode]);
    data.push([4, 'Local Authority',        $('#la').val()]);
    data.push([5, 'Council Tax Band',       $('#band').val()]);
    data.push([6, 'Tenacy Type',            $('#p1tentype').val()]);
    data.push([7, 'Supported Exempt?',      $('[name=p1supported]:checked').val()]);
    data.push([8, 'Non Self Contained?',    $('[name=p1nonself]:checked').val()]);
    data.push([9, 'Carer Bedroom Needed?',  $('[name=p1carerbed]:checked').val()]);
    data.push([10, 'Property Type',          $('#p1proptype').val()]);
    data.push([11, 'Net Rent',               $('#p1rent').val()]);

    // Write to #accomdetails, forcing first column NOT to be written (false)
    FBRun.tablegroup.setData($('[id=accomdetails]'), data);
}

// Test household for situations
// Return true if any found
// key:: AGE=3, RELATIONSHIP = 5, EMP_STATUS = 6
function filterHousehold(key, compare, searchValue) {
    'use strict';

    var hh = JSON.parse(FBRun.tablegroup.getData($('#hhin'))),
        found = false;

    hh.data.forEach(function(person) {
        switch (compare) {
        case 'GTE':
            if (parseFloat(person[key], 10) >= parseFloat(searchValue, 10)) {
                found = true;
            }
            break;
        case 'CONTAINS':
            if (person[key].indexOf(searchValue) > -1) {
                found = true;
            }
            break;
        }
    });

    return found;
}

// Employed person
function employedInHousehold() {
    'use strict';
    return filterHousehold(EMP_STATUS, 'CONTAINS', 'Employed');
}

// Non-dependents
function nonDepInHousehold() {
    'use strict';
    return filterHousehold(RELATIONSHIP, 'CONTAINS', 'dep');
}

// Over 65s
function pensionerInHousehold() {
    'use strict';
    return filterHousehold(AGE, 'GTE', 65);
}

// Apply all vis rules
function incomeVisibility() {
    'use strict';

    // Earned Income
    FBRun.vis.applyRule($('#p3'), employedInHousehold());

    // Pensions Income:
    FBRun.vis.applyRule($('#p5'), pensionerInHousehold());

    // Non-dep Income:
    FBRun.vis.applyRule($('#p7'), nonDepInHousehold());
    return false;
}

/*======================================================================*\
  PubSub Functions
\*======================================================================*/
var copyLeadName = function(eventName) {
    'use strict';

    // Need to concatenate lead first and last names
    var $targetControl = $('[data-event-model=sub][data-event-name=' + eventName + ']'),
        n = $('#fname').val() + ' ' + $('#lname').val();

    // Set target val
    $targetControl.val(n);
};

// Parse TableGroup data and update a select control
var copyName = function(eventName, cid) {
    'use strict';

    var $sourceGroup = $('[data-id=' + cid + ']'),
        $targetControl = $('[data-event-model=sub][data-event-name=' + eventName + ']'),
        dataString = FBRun.tablegroup.getData($('table', $sourceGroup)),
        dataObject = JSON.parse(dataString),
        data = dataObject.data;

    // Filter for Self and Spouse =======================================
    var incomes = $.grep(data, function(v, k) {
        return ((v[5] === 'Client') || ((v[5] === 'Spouse or partner')));
    });

    var options = [];
    $.each(incomes, function(rowId, row) {
        // We expect rowid=[0]; name=[1];
        options.push({'text': row[1], 'value': row[0]});
    });

    var $incomes = $targetControl.not('[id=nonname]').not('[id=othname]').not('[id=benname]');

    // Update the target select(s)
    FB.utils.updateSelect($incomes, options);

    // Filter for Other Income    =======================================
    var othIncome = $.grep(data, function(v, k) {
        return ((v[5] === 'Client') || ((v[5] === 'Spouse or partner')) || ((v[5] === 'Child')) || ((v[5] === 'Foster Child')));
    });

    var incOptions = [];
    $.each(othIncome, function(rowId, row) {
        // We expect rowid=[0]; name=[1];
        incOptions.push({'text': row[1], 'value': row[0]});
    });

    // Update the target select(s)
    FB.utils.updateSelect($('#othname'), incOptions);

    // Filter for Benefits Income    =======================================
    var benIncome = $.grep(data, function(v, k) {
        return ((v[5] === 'Client') || ((v[5] === 'Spouse or partner')) || ((v[5] === 'Child')));
    });

    var benOptions = [];
    $.each(benIncome, function(rowId, row) {
        benOptions.push({'text': row[1], 'value': row[0]});
    });

    // Update the target select(s)
    FB.utils.updateSelect($('#benname'), benOptions);

    // Filter for Non-dependent ==========================================
    var nondeps = $.grep(data, function(v, k) {
        return (v[5].indexOf('dep') > -1);
    });

    var nondepOptions = [];
    $.each(nondeps, function(rowId, row) {
        nondepOptions.push({'text': row[1], 'value': row[0]});
    });

    // Update the target select(s)
    FB.utils.updateSelect($('#nonname'), nondepOptions);

    // Evaluate visibility of income pages
    incomeVisibility();
};

/*======================================================================*\
  Custom Event Bindings
\*======================================================================*/
// Adding "Other" options to linked select elements
// Usage:  $("#otherlist").bind("change", {target: $("#list") }, addOtherValue);
function addOtherValue(event) {
    'use strict';
    var $con = event.data.target;

    // Add the new value as an option
    FB.utils.addItemToSelect($con, $(this).val());

    // Select the new option
    $con.val($(this).val());
}

// Add "Other" options to linked select elements
$('#svcother').bind('change', {target: $('#svctype')}, addOtherValue);   // Service Charges Other
$('#priother').bind('change', {target: $('#pritype')}, addOtherValue);   // Priority Charges Other
$('#nonother').bind('change', {target: $('#nontype')}, addOtherValue);   // Non-priority Charges Other

/*======================================================================*\
  Custom functions
\*======================================================================*/
function getDistance(x1, y1, x2, y2) {
    var dist = 0;

    // Calculate the distance between two northing-easting pairs
    // Ensure that all inputs are cast as numbers
    x1 = parseFloat(x1);
    y1 = parseFloat(y1);
    x2 = parseFloat(x2);
    y2 = parseFloat(y2);
    dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)) / 1000;

    // Convert from km to miles and truncate (round up)
    dist = Math.floor((dist / 1.6142) + 0.5);

    return dist;
}

function parsePostcode(postcode) {
    var parsed = '',
        l;

    // Remove any typed spaces
    postcode = postcode.replace(/\s/g, '');     ///TODO: replace any non alphanumerics
    l = postcode.length;

    // Error checks
    if (l === 0) { return ''; }
    if (l < 5) {
        console.log('Error: postcode is too short');
        return '';
    }
    if (l > 7) {
        console.log('Error: postcode is too long');
        return '';
    }

    // Add any necessary padding spaces (length 5 or 6)
    if (l === 5) { return postcode.substring(0, 2) + '  ' + postcode.substring(2, 5); }
    if (l === 6) { return postcode.substring(0, 3) + ' ' + postcode.substring(3, 6); }
    return postcode;
}

function writeBRMAResults(data, $targetControl) {
    'use strict';
    var d = JSON.parse(data),
        list = [];

    $.each(d, function(k, v) {
        list.push({'text': v.name, 'value': v.name});
    });

    // De-duplicate list
    var clean = FB.utils.distinct(list, 'value');

    // Write to target Select(s)
    FB.utils.updateSelect($targetControl, clean);
}

function writePostcodeResults(data) {
    'use strict';
    var d = JSON.parse(data),
        mode = $('#mode').val();

    // Update global with northing and easting
    FBRun.northing[mode] = d[0].no;
    FBRun.easting[mode] = d[0].ea;
}

function writeDistrictResults(data, $targetControl) {
    'use strict';
    var d = JSON.parse(data);

    $targetControl.val(d[0].name);
}

// BRMA Lookup by Postcode
function brmaQuery(postcode, $targetControl) {
    'use strict';

    // GET using Ajax
    var jqxhr = $.ajax({
        type: 'GET',
        url: '/service/brma/' + postcode + '/',
        dataType: 'json',
        success: function() { writeBRMAResults(jqxhr.responseText, $targetControl); },
        error: function() { bootbox.alert('Error looking up BRMA'); },
        fail: function() { bootbox.alert('Problem getting BRMA service'); }
    });
}

// BRMA Lookup by Postcode
function postcodeQuery(postcode) {
    'use strict';

    // GET using Ajax
    var jqxhr = $.ajax({
        type: 'GET',
        url: '/service/postcode/' + postcode + '/',
        dataType: 'json',
        success: function() { writePostcodeResults(jqxhr.responseText); },
        error: function() { bootbox.alert('Error looking up postcode'); },
        fail: function() { bootbox.alert('Problem getting postcode service'); }
    });
}

// BRMA Lookup by Postcode
function districtQuery(postcode, $targetControl) {
    'use strict';

    // GET using Ajax
    var jqxhr = $.ajax({
        type: 'GET',
        url: '/service/postcode/' + postcode + '/district',
        dataType: 'json',
        success: function() { writeDistrictResults(jqxhr.responseText, $targetControl); },
        error: function() { bootbox.alert('Error looking up District'); },
        fail: function() { bootbox.alert('Problem reaching District service'); }
    });
}

function getBrma(postcode) {
    'use strict';
    var p = parsePostcode(postcode);

    // Run brma query (update control in the callback)
    brmaQuery(p, $('#brma'));

    // Get geo details
    postcodeQuery(p);

    // Get district details
    districtQuery(p, $('#la'));
}

function getPostcodeGeo(postcode) {
    'use strict';
    var p = parsePostcode(postcode);
    postcodeQuery(p);
}

// Filter BRMA data by max value and number of rooms
var filterBrma = function(value, rooms, mode) {
    'use strict';
    var results = [],
        item;
console.log(mode);
console.log(FBRun.northing);
    if (rooms > 4) { rooms = 4; }

    // Filter each lha record for price|rooms
    FBRun.lha.forEach(function filter(brma) {
        for (item in brma) {
            if (parseInt(item, 10) === parseInt(rooms, 10)) {
                if (parseFloat(brma[item]) <= parseFloat(value)) {
                    results.push([
                        brma.name,                                          // Name
                        FB.utils.currencyTest(brma[item]),                  // Price
                        getDistance(FBRun.easting[mode], FBRun.northing[mode], brma.easting, brma.northing)
                    ]);
                }
            }
        }
    });

    return results;
};

// Helper function to convert filtered LHA results into table data
// Assumes target table id is 'lha-table'
var updateAffordableLhas = function(value, rooms, mode) {
    'use strict';

    var locations,
        titleHtml = '<h4>Search for LHA rates with weekly rent below ' + FB.utils.currencyTest(value) + ' and ' + rooms + ' bedroom' + ((rooms > 1) ? 's' : '') + '.</h4>',

        tableHtml = '<div class="table-responsive" id="lha-table">' +
            '    <table class="table table-bordered table-striped" id="locations">' +
            '        <thead>' +
            '            <tr>' +
            '                <th>Local Housing Authority</th>' +
            '                <th>Price</th>' +
            '                <th>Distance (miles)</th>' +
            '            </tr>' +
            '        </thead>' +
            '        <tbody>' +
            '        </tbody>' +
            '    </table>' +
            '</div>';

    // Open feedback modal with out table
    feedback.open({title: titleHtml, message: tableHtml, buttonLabel: 'none'});

    // Add scrollable class
    $('#lha-table').parent().parent().addClass('scrollable');

    // Get array of locations that are affordable
    locations = filterBrma(value, parseInt(rooms, 10), mode);

    // Update table
    FBRun.tablegroup.setData(
        $('#lha-table'),
        FBRun.tablegroup.convertArrayToTableData(locations)
    );

    // Make it sortable
    $('#locations').tablesorter({sortList: [[2, 0], [1, 0]]});
};

function laAutoComplete() {
    'use strict';
    $('#la').autocomplete({source: new LocalAuthorities()});
}

// Set document mode
var setFormMode = function(eventName, id) {
    'use strict';

    var $sourceGroup = $('[data-id=' + id + ']'),
        $sourceControl = $('[data-event-name=' + eventName + ']', $sourceGroup),
        $targetControl = $('[data-event-model=sub][data-event-name=' + eventName + ']'),
        mode = '';

    // Empty the results pages
    FBRun.empty(204); // Summary
    FBRun.empty(127); // Results

    // Reset calculon
    calc.init();
    results = [];

    switch ($sourceControl.text()) {
    case 'Staying Put':
        mode = 'SP';
        // Remove the Moving On button in results page
        $('#p17 .btn-next').addClass('hide');
        break;

    case 'Moving On':
        mode = 'MO';
        // Remove the Moving On button in results page
        $('#p17 .btn-next').addClass('hide');
        // Load the autocomplete for LAs
        laAutoComplete();
        break;

    case 'Staying Put and Moving On':
        mode = 'SP';
        // Hide the Submit button in results page
        $('#p17 .btn-next').removeClass('hide');
        $('#p17 .btn-submit').addClass('hide');
        // Load the autocomplete for LAs
        laAutoComplete();
        break;
    }

    // Write value to mode hidden control
    $targetControl.val(mode);

    // Trigger change event to enact vis rules
    $('#mode').trigger('change');

    // Navigate to page 1
    FBRun.nav.moveTo('p1');
};

function removeRowFromTable($table, removeValue, exactMatch) {
    'use strict';

    // Option to remove 'like' instances, i.e. Containing the word
    // Else the word must match exactly
    var remove,
        exact = false;

    if (exactMatch !== undefined) { exact = true; }

    // Walk over each cell and if removeValue is found, delete the row
    $.each($('tr', $table), function(rowId, row) {
        remove = false;
        $.each($('td', row), function() {
            if (exact) {
                if ($(this).text() == removeValue) { remove = true; }
            } else {
                if ($(this).text().indexOf(removeValue) > -1) { remove = true; }
            }
        });

        // Remove row
        if (remove) { $(this).remove(); }
    });
}

function doMovingOn() {
    'use strict';

    // Set mode to SPMO
    $('#mode').val('SPMO');
    $('#mode').trigger('change');

    // Empty pages
    FBRun.empty(74);    // Accomodation
    FBRun.empty(91);    // Service Charges
    FBRun.empty(98);    // Energy / Fuel Sources
    FBRun.empty(105);    // Energy / Fuel Expenses
    FBRun.empty(111);   // Utility Expenses

    // Remove any Council tax priority expenditure items
    removeRowFromTable($('#priorityin'), 'Council tax', 'exact');

    // Results screen buttons
    $('#p17 .btn-next').addClass('hide');
    $('#p17 .btn-submit').removeClass('hide');

    // Reset the navigation sidebar
    $('.sidenav li[data-page!=p16]').removeClass('active').addClass('disabled');

    // Navigate to page 2
    FBRun.nav.moveTo('p2');
    return false;
}

/*======================================================================*\
  Wrapper Functions
\*======================================================================*/
function prevent(e) {
    'use strict';
    e.preventDefault();
    e.stopPropagation();
}

function doCustomPreProcessing() {
    'use strict';

    FBRun.empty(127); // Results

    // Copy demographic info to summary screen
    $('#spname').text($('#fname').val() + ' ' + $('#lname').val());    // Lead name
    $('#spaddress').text($('#address1').val() + ' ' + FB.utils.concatIf($('#address2').val(), $('#address3').val(), $('#postcode').val()));
    $('#sptel').text($('#hometel').val());
    $('#spmob').text($('#mobiletel').val());
    $('#spemail').text($('#email').val());

    // Copy Household table data to summary screen
    FBRun.tablegroup.copyTable($('#hhin table'), $('#p1hhsum'));

    // Populate Accomodation table for P1
    populateAccomTable();

    // Update the appropriate Summary panel
    var m = $('#mode').val(),
        property = (m === 'SPMO') ? 2 : 1,
        type = 'Staying Put',
        $panel = $('#panelp' + property);

    if ((property === 2) || (m === 'MO')) { type = 'Moving On'; }

    // Create the panel body from template
    var tpl = new $.ShelterTemplates(),
        panelBody = tpl.panelTpl(property);

    // Set the property heading and body
    $('.panel-heading', $panel).html(type).addClass('subhead');
    $('.panel-body', $panel).html(panelBody);

    // Bind print action
    $('#printdetailstop, #printdetailsbottom, .btn-summary-p' + property).click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.print();
    });
    $('.btn-details-p' + property).click(prevent);
}

function doCustomPostProcessing() {
    'use strict';

    // Establish whether this property is affordable; if not, then
    // get the net rent and number of rooms and present a list of places which
    // are affordable
    var calcData = JSON.parse(calc.response),
        balance = parseFloat(calcData['incandexpsummaryp1-r6-c2'], 10),
        rent = parseFloat(calcData['accomdetails-r4-c2'], 10),
        rooms = parseInt($('#p1bedrooms').val(), 10),
        weeklyAffordableRent = (rent + balance) / 4.3333330,
        m = $('#mode').val(),
        property = (m === 'SPMO') ? 2 : 1,
        $panel = $('#panelp' + property),
        tpl;

    if (balance < 0) {
        // Inject alert html
        // Create the panel body from template
        tpl = new $.ShelterTemplates();
        $('.row:first', $panel).after(tpl.alertTpl(property, weeklyAffordableRent, rooms));
        $('.btn-lha-' + property).click(prevent);
        //updateAffordableLhas(weeklyAffordableRent, rooms);
    }

    // Transpose person ids in the allincoutmonthly table for names
    transposePersonNames();

    // Highlight negative rows
    showNegativeRows();

    // Update currency values
    cleanCurrency();

    // Change the ids of panel tables so that they will not be overwritten
    $.each($('.table-responsive', $panel), function() {
        var i = $(this).attr('id');
        $(this).attr('id', i + property);
    });

    // Save the full details to calc object
    results.push({'html': $('#p15 .fb-form').html(), 'property': property});

    // Show the summary page
    FBRun.nav.moveTo('p17');
}

function showDetails(property) {
    'use strict';

    // Set the page
    var page = 'p15',
        $this = $('#' + page),
        html = '';

    // Replace content of results page from calc object
    // Get the most recent result for this property id
    $.each(results, function(k, v) {
        if (v.property === property) { html = v.html; }
    });
    $('.fb-form', $this).html(html);

    // Remove sidenav and resize main div to full width
    $('.sidenav-container', $this).remove();
    $('.fb-form', $this).removeClass('col-md-9').addClass('col-md-12'); // Bootstrap 3 only

    // Add prevent default bindings to buttons
    $('.btn', $this).click(prevent);

    // Show results page
    FBRun.nav.moveTo(page);
}

// Update the benefits table
function addBenefit(personId, type, amount) {
    'use strict';

    // Clean out any existing rows
    $.each($('#p4 table tr'), function() {
        if (($('td:nth-child(2)', $(this)).text()) === type) { $(this).remove(); }
    });

    // Set values
    $('#benname').val(personId);
    $('#bentype').val(type);
    $('#benfreq').val('4.3333330'); // Assumes Weekly
    $('#benamt').val(amount).toCurrency();

    // Trigger add row and reset button
    $('#p4 .table-group button').trigger('click');
    $('#p4 .table-group button').trigger('click');
    return false;
}

// Benefits calculation
function calculateBenefits() {
    'use strict';

    var hh = JSON.parse(FBRun.tablegroup.getData($('#hhin'))),
        /* Array indices */
        REL = 5,
        EMP = 6,
        CARER = 7,
        CARERBENS = 8,
        /* Static values */
        benFirstChild = 20.50,
        benOtherChild = 13.55,
        benCarer = 61.35,
        /* Counters */
        childCount = 0,
        ruleChildBenefit,
        valChildBenefit = 0,
        carerCount = 0,
        ruleCarerBenefit,
        valCarerBenefit = 0,
        carerId = 0;

    // Step through each household member and determine benefits rules
    $.each(hh.data, function(k, v) {
        // Child benefit: relationship is Child or Foster child AND employment = student
        ruleChildBenefit = (((v[REL] === 'Child') || (v[REL] === 'Foster Child')) && ((v[EMP].indexOf('student') > -1) || (v[EMP].indexOf('child') > -1)));
        if (ruleChildBenefit) { childCount++; }

        // Carer benefit: carer = Y and receive benefits = Y
        ruleCarerBenefit = ((v[CARER] === 'Y') && (v[CARERBENS] === 'Y'));
        if (ruleCarerBenefit) {
            carerCount++;

            // Set the person id for the carer benefit
            carerId = (carerCount === 1) ? k + 1 : carerId;
        }
    });

    // Set values
    if (childCount > 0) {
        if (childCount > 1) {
            valChildBenefit = benFirstChild + ((childCount - 1) * benOtherChild);
        } else {
            valChildBenefit = benFirstChild;
        }

        // Update benefits table
        addBenefit(1, 'Child benefit', valChildBenefit);
    }

    if (carerCount > 0) {
        valCarerBenefit = benCarer;

        // Update benefits table
        addBenefit(carerId, 'Carer\'s allowance', valCarerBenefit);
    }

    return false;
}

// Helper function to load error data from Beta testing
function beta(property) {
    'use strict';

    // Assumes the existence of calcData variable, loaded from error dump
    if (calcData === undefined) {
        bootbox.alert('There is no error dump data to show.  Please paste the dump data into the console first.');
    } else {
        if (property === undefined) { property = 1; }
        results = calcData;
        showDetails(property);
    }
}

