/*
  global $:false,
  $:false,
  document:false
*/
/*======================================================================*\
  Document Ready Events
\*======================================================================*/
var FB = FB || {};

// Initiate context menu handler
$(document).ready(function() {
    'use strict';
    $('#fileinput').bind('change', FB.file.readFile);

    // Add version to navbar
    $('.navbar-brand').text($('.navbar-brand').text() + ' ' + FB.def[0].version);

    $('#menu').click(function() {
        $('#menu').hide();
        $('#form-zone .row').removeClass('over');
    });

    $(document).click(function() {
        $('#menu').hide();
        $('#form-zone .row').removeClass('over');
    });

    // Populate the toolbox
    FB.designer.updateToolbox();

    // Set the form name in content pane
    FB.form.update();

    // Create the first page
    FB.page.add('first');

    // Add bindings
    $('#page-name').text('Page 1');
    $('#page-name').bind('click', FB.page.clickPage);

    // Initialise code editor
    FB.code.init();

    // Check for latest version
    // ver.getLatest();
});

$('#page').bind('click', FB.page.clickPage);
$('#page').bind('change', FB.page.changePage);
