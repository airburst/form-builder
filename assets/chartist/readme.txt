1. Ensure that chartist.min.css is included in MyLife core libraries

2. Add a new div to the page with classes:

	<div class="ct-chart ct-golden-section"></div>

3. Set the data in a function:



(function barChart(data) {

	var options = {
	  seriesBarDistance: 10,
	};

	var responsiveOptions = [
	  ['screen and (max-width: 640px)', {
		seriesBarDistance: 5,
		axisX: {
		  labelInterpolationFnc: function (value) {
			return value[0];
		  }
		}
	  }]
	];

	new Chartist.Bar('.ct-chart', data, options, responsiveOptions);
})();

var data = {
	  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	  series: [
		[5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
		[3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
	  ]
	};
	
barChart(data);