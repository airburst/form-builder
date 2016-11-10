/*jslint browser: true*/
/*global $, jQuery, FB, bootbox, calc, alert*/
//var DP = DP || {};

// Define DP function
var DP = (function () {
    "use strict";

    // Example input data; would be fetched from web service
    var data = [
        {
            dateEntered: "20/11/2013",
            enteredBy: "Chris Parsons",
            ref: "100",
            finYear: "2013/14",
            homeType: "Care Home Without Nursing",
            careType: "Residential",
            location: "East Midlands",
            careFee: "600",
            nhsNursingFee: "119.96",
            statePension: "57.92",
            otherBenefits: "0",
            otherIncome: "0",
            capitalAmount: "10000",
            propertyValue: "170000"
        },
        {
            dateEntered: "26/09/2013",
            enteredBy: "Chris Parsons",
            ref: "101",
            finYear: "2013/14",
            homeType: "Care Home With Nursing",
            careType: "Residential dementia",
            location: "East Midlands",
            careFee: "600",
            nhsNursingFee: "119.96",
            statePension: "57.92",
            otherBenefits: "60",
            otherIncome: "80.93",
            capitalAmount: "10000",
            propertyValue: "170000"
        },
        {
            dateEntered: "01/09/2014",
            enteredBy: "Chris Parsons",
            ref: "102",
            finYear: "2014/15",
            homeType: "Care Home Without Nursing",
            careType: "Residential",
            location: "East Midlands",
            careFee: "625",
            nhsNursingFee: "0",
            statePension: "100",
            otherBenefits: "40",
            otherIncome: "138",
            capitalAmount: "10000",
            propertyValue: "109000"
        }
    ],

        // Lookup data
        lookups = {
            careHomeData: [
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "East Midlands", "price": 544.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "East of England", "price": 502.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "North East England", "price": 471.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "North West England", "price": 419.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "South East England", "price": 482.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "London", "price": 555.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "South West England", "price": 478.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "West Midlands", "price": 412.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "Yorkshire and Humber", "price": 419.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "Mid Wales", "price": 441.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "North Wales", "price": 441.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "South East Wales", "price": 441.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "South Wales", "price": 441.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "West Wales", "price": 441.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "Mid East Scotland", "price": 498.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "Mid Scotland", "price": 498.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "Mid West Scotland", "price": 498.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "North Scotland", "price": 498.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential", "location": "South Scotland", "price": 498.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "East Midlands", "price": 585.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "East of England", "price": 643.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "North East England", "price": 581.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "North West England", "price": 568.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "South East England", "price": 741.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "London", "price": 696.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "South West England", "price": 680.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "West Midlands", "price": 570.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "Yorkshire and Humber", "price": 556.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "Mid Wales", "price": 564.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "North Wales", "price": 564.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "South East Wales", "price": 564.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "South Wales", "price": 564.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "West Wales", "price": 564.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "Mid East Scotland", "price": 594.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "Mid Scotland", "price": 594.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "Mid West Scotland", "price": 594.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "North Scotland", "price": 594.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential", "location": "South Scotland", "price": 594.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "East Midlands", "price": 461.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "East of England", "price": 533.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "North East England", "price": 500.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "North West England", "price": 445.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "South East England", "price": 511.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "London", "price": 589.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "South West England", "price": 507.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "West Midlands", "price": 437.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "Yorkshire and Humber", "price": 445.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "Mid Wales", "price": 454.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "North Wales", "price": 454.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "South East Wales", "price": 454.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "South Wales", "price": 454.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "West Wales", "price": 454.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "Mid East Scotland", "price": 513.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "Mid Scotland", "price": 513.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "Mid West Scotland", "price": 513.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "North Scotland", "price": 513.00},
                {"homeType": "Care Home Without Nursing", "careType": "Residential dementia", "location": "South Scotland", "price": 513.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "East Midlands", "price": 621.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "East of England", "price": 682.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "North East England", "price": 616.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "North West England", "price": 603.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "South East England", "price": 786.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "London", "price": 739.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "South West England", "price": 721.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "West Midlands", "price": 605.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "Yorkshire and Humber", "price": 590.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "Mid Wales", "price": 581.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "North Wales", "price": 581.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "South East Wales", "price": 581.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "South Wales", "price": 581.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "West Wales", "price": 581.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "Mid East Scotland", "price": 612.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "Mid Scotland", "price": 612.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "Mid West Scotland", "price": 612.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "North Scotland", "price": 612.00},
                {"homeType": "Care Home With Nursing", "careType": "Residential dementia", "location": "South Scotland", "price": 612.00}
            ],
            livingCostContribution: [
                {"location": "East Midlands", "value": 230.14},
                {"location": "East of England", "value": 230.14},
                {"location": "North East England", "value": 230.14},
                {"location": "North West England", "value": 230.14},
                {"location": "South East England", "value": 230.14},
                {"location": "London", "value": 230.14},
                {"location": "South West England", "value": 230.14},
                {"location": "West Midlands", "value": 230.14},
                {"location": "Yorkshire and Humber", "value": 230.14},
                {"location": "Mid Wales", "value": 230.14},
                {"location": "North Wales", "value": 230.14},
                {"location": "South East Wales", "value": 230.14},
                {"location": "South Wales", "value": 230.14},
                {"location": "West Wales", "value": 230.14},
                {"location": "Mid East Scotland", "value": 230.14},
                {"location": "Mid Scotland", "value": 230.14},
                {"location": "Mid West Scotland", "value": 230.14},
                {"location": "North Scotland", "value": 230.14},
                {"location": "South Scotland", "value": 230.14}
            ],
            inflation: [
                {"type": "Care Fee per week", "apply": "N"},
                {"type": "NHS funded nursing care per week", "apply": "N"},
                {"type": "State Pension per week", "apply": "N"},
                {"type": "Othe Benfits per week", "apply": "N"},
                {"type": "Other Weekly Income", "apply": "N"},
                {"type": "Expenditure Per Week", "apply": "N"},
                {"type": "LA Usual Price", "apply": "N"},
                {"type": "Living Cost Contribution", "apply": "N"}
            ]
        },


        // Default values
        defaults = {
            cap: 72000,                 /* Care cap */
            inflationRate: 1.03,        /* Inflation rate to apply to future years */
            tariffRate: 0.004,          /* Inflation rate to apply to future years */
            upperThreshold: 118000,     /* Upper capital threshold */
            lowerThreshold: 17000,      /* Lower capital threshold */
            personalAllowance: 24.40    /* Personal allowance - basic */
        },

        // Initialise form object
        init = function (options) {
            this.options = $.extend({}, defaults, options);
            return this;
        },

        latestData = function () {
            return data[data.length - 1];
        },

        addData  = function (dataObject) {
            var self = this;
            if (dataObject !== undefined) {
                this.data.push(dataObject);
            }
            return self;
        },

        currency = function (value) {
            var m = parseFloat(value);
            return !isNaN(m) ? m.toFixed(2) : 0.00;
        },

        // Returns a match from table given inputs (like VLOOKUP)
        getLookup = function (table, inputs) {
            var result;

            switch (table) {

            case lookups.careHomeData:
                result = $.grep(table, function (v) {
                    return ((v.homeType === inputs.homeType) && (v.careType === inputs.careType) && (v.location === inputs.location));
                });
                return (result.length > 0) ? result[0].price : null;

            case lookups.livingCostContribution:
                result = $.grep(table, function (v) {
                    return (v.location === inputs.location);
                });
                return (result.length > 0) ? result[0].value : null;
            }
        },

        // Specific lookups
        // LA Usual Price; uses careHomeData table
        laUsualPrice = function () {
            // Use most recent data
            var d = latestData(),
                l = getLookup(lookups.careHomeData, {homeType: d.homeType, careType: d.careType, location: d.location});
            if (l === null) {
                return 0;
            }
            return (l > d.careFee) ? d.careFee : l;
        },

        // Living cost contribution
        livingExpenses = function () {
            // Use most recent data
            var d = latestData(),
                l = getLookup(lookups.livingCostContribution, {location: d.location});
            return (l !== null) ? l : 0;
        },

        // Render json data as a table
        drawTable = function (data, $selector) {
            var r;
            // Empty table
            $selector.empty();

            // Draw header
            r = $("<tr/>");
            $selector.append(r);
            $.each(data[0], function (k) {
                r.append($("<th>" + k + "</th>"));
            });

            // Draw body
            $.each(data, function (rowIndex, row) {
                r = $("<tr/>");
                $selector.append(r);
                $.each(row, function (k, v) {
                    r.append($("<td>" + v + "</td>"));
                });
            });
        },

        // Time and Date Helper Functions
        // Pad numbers with leading zeros to reach size
        pad = function (num, size) {
            var s = num;
            while (s.length < size) { s = "0" + s; }
            return s;
        },

        // Convert a date into a string dd/mm/yyyy
        formatDate = function (date) {
            if (date !== undefined) {
                var d = pad(date.getDate(), 2),
                    m = pad(date.getMonth() + 1, 2),
                    y = date.getFullYear();
                return (d + "/" + m + "/" + y);
            }
            return "";
        },

        // Convert a string dd/mm/yyyy into date
        strToDate = function (dateString) {
            if ((dateString !== undefined) && (dateString !== "")) {
                // Split into day, month and year
                var d = parseInt(dateString.substr(0, 2), 10),
                    m = parseInt(dateString.substr(3, 2), 10) - 1,
                    y = parseInt(dateString.substr(6, 4), 10);
                return new Date(y, m, d);
            }
            return new Date(1900, 0, 1);
        },

        formatCapTime = function (days) {
            var now = new Date(),
                end = new Date();
            end.setDate(now.getDate() + days);

            return formatDate(end);
        },

        // Get financial year: no argument === current financial year
        finYear = function (d) {
            if (d === undefined) { d = new Date(); }
            var m = d.getMonth(),
                y = d.getFullYear(),
                lastTwo = parseInt(y.toString().substr(2, 2), 10),
                fy = (m <= 2) ? (y - 1) + "/" + lastTwo : y + "/" + (lastTwo + 1);
            return fy;
        },

        // Returns a WEEKLY tariff amount for given capital value
        // value < lower threshold = 0 AND value > upper threshold = 0
        tariff = function (value) {
            var self = this,
                amount = parseFloat(value),
                t;
            if (isNaN(amount)) {
                return 0;
            }
            amount = (amount >= self.options.upperThreshold) ? 0 : amount;
            t = (amount <= self.options.lowerThreshold) ? 0 : parseInt((amount - self.options.lowerThreshold) * self.options.tariffRate + 1, 10);
            return t;
        },

        summary = function () {
            // Fee paid
            var ld = latestData(),
                fee = ld.careFee,                           // Total weekly care fees paid
                laup = laUsualPrice(),                      // LA usual price for type of careType  (A)
                livExp = livingExpenses(),                  // Living expenses allowance            (B)       ///TODO: increase if home-owner?
                careCap = laup - livExp,                    // Weekly cost to customer              (A - B)
                notCounted = fee - laup,                    // Element not counted                  (fee - B)
                timeToCap = DP.options.cap / careCap,       // Time to reach cap (weeks)
                capDate = formatCapTime(timeToCap * 7);     // Date that cap is reached

            return {
                fee: currency(fee),
                laup: currency(laup),
                livExp: currency(livExp),
                careCap: currency(careCap),
                notCounted: currency(notCounted),
                timeToCap: timeToCap,
                capDate: capDate
            };
        },

        schedule = function (period, duration) {    //Note: missing LA funding items
            // Set period in days (default is week) 
            // and duration in years (default is 2)
            if (period === undefined) { period = 7; }
            if (duration === undefined) { duration = 2; }

            // Set initial variable values
            var self = this,
                ratio = period / 7,
                ld = latestData(),
                d = new Date(),
                capital = parseFloat(ld.capitalAmount) + parseFloat(ld.propertyValue),
                income = (parseFloat(ld.statePension) + parseFloat(ld.otherBenefits) + parseFloat(ld.otherIncome) - self.options.personalAllowance) * ratio,
                s = summary(),
                laup = (s.laup) * ratio,               //Note: apply annual inflation to laup element
                pLaup = laup,
                eligible = s.careCap * ratio,
                cumulativeEligible = 0,
                careCost = s.fee * ratio,
                cumulativeCareCost = 0,
                table = [],
                capReached = false,
                p,
                pTariff,
                pTotalIncome,
                pTopUp,
                pThirdTopUp,
                pTotalClientCost,
                pCapitalFund,
                pCareCapFund,
                pLaOtherFund,
                row;

            // Set schedule over duration
            for (p = 0; p < ((duration * 365) / period); p++) {
                // Increment date
                d.setDate(d.getDate() + period);

                // Calculate elements for this period
                pTariff  = self.tariff(capital) * ratio;
                pTotalIncome = income + pTariff;

                // Set period laup = total income if laup > total income
                if ((pTariff > 0) && (pTotalIncome < pLaup)) {
                    pLaup = pTotalIncome;
                }

                pTopUp = (capital >= self.options.upperThreshold) ? careCost - laup : 0;
                pThirdTopUp = (capital >= self.options.upperThreshold) ? 0 : careCost - laup;
                pTotalClientCost = (capital >= self.options.upperThreshold) ? careCost : pLaup;
                pCapitalFund = pTotalClientCost - income;

                // Calculate LA funding
                // Has the cap been reached?
                if ((cumulativeEligible + eligible) >= self.options.cap) { capReached = true; }

                pCareCapFund = capReached ? eligible : 0;
                pLaOtherFund = ((pTopUp === 0) && (pCareCapFund === 0) && (pTotalIncome <= laup)) ? laup - pTotalIncome : 0;

                // Put values into object
                row = {
                    date: formatDate(d),
                    /*fy: finYear(d),*/                 //Note: trigger inflation on new FY
                    capital: currency(capital),
                    eligible: currency(eligible),
                    cumulative: currency(cumulativeEligible = cumulativeEligible + eligible),
                    // LA funding
                    LACareCapFund: currency(pCareCapFund),
                    LAOtherFund: currency(pLaOtherFund),
                    LATotalFund: currency(pLaOtherFund + pCareCapFund),

                    tariffincome: currency(pTariff),
                    clientincome: currency(income),
                    totalincome: currency(pTotalIncome),
                    laup: currency(pLaup),
                    topup: currency(pTopUp),

                    clientcost: currency(pTotalClientCost),
                    capitalfund: currency(pCapitalFund),
                    thirdparty: currency(pThirdTopUp),

                    carefee: currency(careCost)
                };
                table.push(row);

                // Reduce the capital
                if (!capReached) {
                    capital = capital - pCapitalFund;
                    cumulativeCareCost += careCost;
                }
            }

            return {table: table, careCost: currency(cumulativeCareCost)};
        };


    // Public methods
    return {
        data: data,
        addData: addData,
        init: init,
        finYear: finYear,
        laUsualPrice: laUsualPrice,
        summary: summary,
        tariff: tariff,
        schedule: schedule,
        drawTable: drawTable
    };

})();

// Initialise
DP.init();

function calculateCap() {
    "use strict";
    //FB.utils.showSpinner();

    // Add data from form
    var formData = {
        homeType: $("input[name=carehometype]:checked").val(),
        careType: $("#caretype").val(),
        location: $("#location").val(),
        careFee: $("#carecost").val(),
        nhsNursingFee: $("#nhsnursing").val(),
        statePension: $("#pension").val(),
        otherBenefits: $("#benefits").val(),
        otherIncome: $("#other").val(),
        capitalAmount: $("#capital").val(),
        propertyValue: $("#property").val()
    },
        summary,
        costs;

    DP.addData(formData);

    // Update summary fields
    summary = DP.summary();
    $("#carefee").val(summary.fee);
    $("#laup").val(summary.laup);
    $("#livingcosts").val(summary.livExp);
    $("#carecap").val(summary.careCap);
    $("#datecap").val(summary.capDate);

    // Update payment schedule
    costs = DP.schedule(7, 10);
    DP.drawTable(costs.table, $("table"));
    $("#totalcarefee").val(costs.careCost);

    // Show table
    $("#output-table").removeClass("hide");

    //FB.utils.hideSpinner();
}