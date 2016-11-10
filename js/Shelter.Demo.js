var demo = {

    // Create an array of functions to automate each page
    timeOut: 1000,
    pageActions: [
        {
            id: '#p16',
            actions: function() {
                $('#so-btn').click();
            }
        },
        {
            id: '#p1',
            actions: function() {
                $('#fname').val('Mark');
                $('#lname').val('Fairhurst');
                $('#address1').val('10');
                $('#address2').val('Tawney Close');
                $('#address3').val('Corsham');
                $('#postcode').val('SN13 9XE');
                $('#hometel').val('01225 811730');
                $('#mobiletel').val('07557 649609');
                $('#email').val('mark@fairhursts.net');
            }
        },
        {
            id: '#p2',
            actions: function() {
                FBRun.setControlValue(12, 'Mark Fairhurst'); /*hname*/
                FBRun.setControlValue(13, '31/12/1969'); /*hdob*/
                FBRun.setControlValue(27, '45'); /*hdobage*/
                FBRun.setControlValue(14, 'Male'); /*hgender*/
                FBRun.setControlValue(15, 'Client'); /*hrel*/
                FBRun.setControlValue(16, 'Employed - full-time'); /*hemp*/
                FBRun.setControlValue(17, 'N'); /*hcarer*/
                FBRun.setControlValue(18, ''); /*hcarerben*/
                FBRun.setControlValue(19, ''); /*hpreg*/
                FBRun.setControlValue(21, ''); /*hpregdue*/
                FBRun.setControlValue(22, 'Y'); /*hdis*/
                FBRun.setControlValue(23, 'Y'); /*hdisben*/
                FBRun.setControlValue(24, ''); /*hmainhome*/
                $('#p2 button[data-mode=add]').click();
            }
        },
        {
            id: '#p3',
            actions: function() {
                FBRun.setControlValue(30, 'Mark Fairhurst'); /*earnname*/
                FBRun.setControlValue(31, 'OLM Systems'); /*earnemp*/
                FBRun.setControlValue(32, '37.5'); /*earnhours*/
                //FBRun.setControlValue(39, ''); /*earnfreq*/
                FBRun.setControlValue(48, '3000'); /*earnamt*/
                $('#p3 button[data-mode=add]').click();
            }
        },
        {
            id: '#p4',
            actions: function() {
                // FBRun.setControlValue(45, ''); /*benname*/
                // FBRun.setControlValue(46, ''); /*bentype*/
                // FBRun.setControlValue(43, ''); /*benfreq*/
                // FBRun.setControlValue(47, ''); /*benamt*/
                // $('#p4 button[data-mode=add]').click();
            }
        },
        {
            id: '#p5',
            actions: function() {
                // FBRun.setControlValue(55, ''); /*penname*/
                // FBRun.setControlValue(57, ''); /*pentype*/
                // FBRun.setControlValue(58, ''); /*penfreq*/
                // FBRun.setControlValue(59, ''); /*penamt*/
                // $('#p5 button[data-mode=add]').click();
            }
        },
        {
            id: '#p6',
            actions: function() {
                // FBRun.setControlValue(62, ''); /*othname*/
                // FBRun.setControlValue(63, ''); /*othtype*/
                // FBRun.setControlValue(64, ''); /*othfreq*/
                // FBRun.setControlValue(65, ''); /*othamt*/
                // $('#p6 button[data-mode=add]').click();
            }
        },
        {
            id: '#p7',
            actions: function() {
                // FBRun.setControlValue(69, ''); /*nonname*/
                // FBRun.setControlValue(70, ''); /*nonincfreq*/
                // FBRun.setControlValue(71, ''); /*nonincamt*/
                // FBRun.setControlValue(72, ''); /*nonpayfreq*/
                // FBRun.setControlValue(73, ''); /*nonpayamt*/
                // $('#p7 button[data-mode=add]').click();
            }
        },
        {
            id: '#p8',
            actions: function() {
                FBRun.setControlValue(76, 'Owner occupier - freehold'); /*p1occstatus*/
                // FBRun.setControlValue(78, ''); /*p1landlord*/
                // FBRun.setControlValue(80, ''); /*p1tentype*/
                FBRun.setControlValue(82, 'N'); /*p1supported*/
                FBRun.setControlValue(88, 'N'); /*p1carerbed*/
                FBRun.setControlValue(83, 'N'); /*p1nonself*/
                FBRun.setControlValue(84, 'Detached'); /*p1proptype*/
                FBRun.setControlValue(85, '8'); /*p1rooms*/
                FBRun.setControlValue(220, '5'); /*p1bedrooms*/
                FBRun.setControlValue(86, '2030'); /*p1rent*/
                // FBRun.setControlValue(87, ''); /*p1rentfreq*/
                // FBRun.setControlValue(219, ''); /*p1cars*/
                // FBRun.setControlValue(217, ''); /*newpostcode*/
                // FBRun.setControlValue(184, ''); /*brma*/
                // FBRun.setControlValue(181, ''); /*la*/
                // FBRun.setControlValue(183, ''); /*band*/
            }
        },
        {
            id: '#p9',
            actions: function() {
                // FBRun.setControlValue(175, ''); /*svcprop1*/
                // FBRun.setControlValue(95, ''); /*svctype*/
                // FBRun.setControlValue(159, ''); /*svcother*/
                // FBRun.setControlValue(96, ''); /*svcfreq*/
                // FBRun.setControlValue(97, ''); /*svcamt*/
                // $('#p9 button[data-mode=add]').click();
            }
        },
        {
            id: '#p10',
            actions: function() {
                FBRun.setControlValue(100, 'Gas'); /*p1space*/
                FBRun.setControlValue(101, 'Gas'); /*p1water*/
                FBRun.setControlValue(102, 'Gas'); /*p1cooking*/
                FBRun.setControlValue(103, 'Electricity'); /*p1lighting*/
                FBRun.setControlValue(104, 'Electricity'); /*p1appliance*/
            }
        },
        {
            id: '#p11',
            actions: function() {
                // FBRun.setControlValue(176, ''); /*fuelprop*/
                // FBRun.setControlValue(107, ''); /*fueltype*/
                // FBRun.setControlValue(109, ''); /*fuelfreq*/
                // FBRun.setControlValue(110, ''); /*fuelamt*/
                // $('#p11 button[data-mode=add]').click();
            }
        },
        {
            id: '#p12',
            actions: function() {
                // FBRun.setControlValue(177, ''); /*utilprop*/
                // FBRun.setControlValue(113, ''); /*utiltype*/
                // FBRun.setControlValue(114, ''); /*utilfreq*/
                // FBRun.setControlValue(115, ''); /*utilamt*/
                // $('#p12 button[data-mode=add]').click();
            }
        },
        {
            id: '#p13',
            actions: function() {
                // FBRun.setControlValue(178, ''); /*hiddeninput1*/
                // FBRun.setControlValue(118, ''); /*pritype*/
                // FBRun.setControlValue(160, ''); /*priother*/
                // FBRun.setControlValue(119, ''); /*prifreq*/
                // FBRun.setControlValue(120, ''); /*priamt*/
                // $('#p13 button[data-mode=add]').click();
            }
        },
        {
            id: '#p14',
            actions: function() {
                // FBRun.setControlValue(179, ''); /*hiddeninput2*/
                // FBRun.setControlValue(124, ''); /*nontype*/
                // FBRun.setControlValue(161, ''); /*nonother*/
                // FBRun.setControlValue(125, ''); /*nonfreq*/
                // FBRun.setControlValue(126, ''); /*nonamt*/
                // $('#p14 button[data-mode=add]').click();
            }
        },
        {
            id: '#p17',
            actions: function() {
                // FBRun.setControlValue(206, ''); /*outcome*/
                // FBRun.setControlValue(207, ''); /*outcome-name*/
                // FBRun.setControlValue(209, ''); /*outcome-date*/
            }
        }
    ],

    run: function() {

        var self = this,
            p,
            interval;

        self.pageActions.reverse();

        interval = setInterval(function() {
            if (self.pageActions.length === 0) {
                clearInterval(interval);
            } else {
                // Get next page and run actions
                p = self.pageActions.pop();
                p.actions();

                // Pause and click next page
                setTimeout(function() {
                    $('.btn-next', $(p.id)).click();
                }, self.timeOut);
            }
        }, self.timeOut);

    },

    list: function() {
        var p,
            id,
            text = '',
            tg = false;

        $('.page').each(function(page) {
            p = $(this).attr('id');

            text += '{\n';
            text += '    id: \'#' + p + '\',\n';
            text += '    actions: function() {\n';

            $('[data-id]', $(this)).each(function(control) {
                id = $(this).attr('data-id');

                if ($(this).hasClass('table-group')) {
                    tg = true;
                } else {
                    $('input, select, radio, textarea', $(this)).each(function(input) {
                        text += '        FBRun.setControlValue(' + id + ', \'\'); /*' + $(this).attr('name') + '*/\n';
                    });
                }

            });

            if (tg) {
                text += '        $(\'#' + p + ' button[data-mode=add]\').click();\n';
                tg = false;
            }
            text += '    }\n';
            text += '},\n';
        });

        return text;
    }

};
