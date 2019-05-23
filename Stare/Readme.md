//*********************************************
//*********************************************
// Camila Márquez. Licence MIT.             ***
// Universidad de Santiago de Chile -USACH  ***
// Poyect Repository:                       ***
//*********************************************
//*********************************************

REFERENCE PROYECT: https://github.com/bellyster/Stare.js

To use:
Back-End:
 stare.prepareSerp('serpHandler', result)
 stare.get_Metrics(...metrics);
 stare.get_Json();

Front-End:
require('stare.js/visualizations').visualizationName;

var chart;
//create:
chart = bubbleChart()
                .variable(value)
                ....
            //CREATE CHART
d3.select('#chart').datum(json).call(chart);

//update:
d3.select('#chart').datum(json).call(chart);

//remove:
chart.remove();
