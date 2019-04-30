const d3 = require('d3');
const palettes= require('./ColorPallettes.js');

/**
 * Based on the work from Déborah Martinez.
 *  License: MIT
 **/


function barChart(){
    //Configurable Settings

    var margin = {top: 10, right: 0, bottom: 200, left: 50};
    var width= 700,
        transition= 500,
        height=600,
        attrHeight='length',
        minHeight=10,
        maxHeight=300,
        maxHeigthDomain,
        strokeColor="black",
        strokeSize=2,
        padding=2,
        attrColors= 'length',
        axes= true,
        colorDomain,
        customRange,
        colorAttr,
        customColors=false,
        chartSelection,
        chartSVG,
        title;

    width  = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;

    //Settings Extracted From the serp:

    /** GENERATION OF THE ACTUAL CHART
     * @public
     * @param(string) selection - is the div ID in which the chart will be render.
     **/
    function chart(selection){

        var data = selection.datum(); //json is stored in data var.
        data=data.documents; //cambiar despues
        if(data){

            //TOOLTIP
            //initializate tooltips
            var tooltip = selection
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("color", "white")
                .style("padding", "8px")
                .style("background-color", "#5b9def")
                .style("border-radius", "6px")
                .style("font-family", "monospace")
                .style("width", "400px")
                .text("");
            //MODIFY WIDTH AND HEIGHT



            chartSelection = selection;
            var div = selection,
                svg = div.selectAll('svg'); //Select the SVG element.

            //Color Maping
            var colorBars;
            if (!customColors) {
                colorBars = d3.scaleOrdinal(d3.schemeCategory10); //por defecto.
            }
            else {
                var min=1000, max=0;
                for(e in data){
                    if(data[e][attrColors]<min){min= data[e][attrColors]}
                    if(data[e][attrColors]>max){max= data[e][attrColors]}
                };
                colorDomain= [min, (min+max)/2, max];
                colorBars = d3.scaleLinear()
                    .domain(colorDomain)
                    .range(customRange);
            }
            //
            //SET THE SCALES:
            //

            // set the ranges
            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1);
            var y = d3.scaleLinear()
                .range([height, 0]);


            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            // Scale the range of the data in the domains
            x.domain(data.map(function(d) { return d.title ; }));
            y.domain([0, d3.max(data, function(d) { return d[attrHeight]; })]);

            // append the rectangles for the bar chart
            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.title) + margin.left; })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d[attrHeight])+10; })
                .attr("height", function(d) { return height - y(d[attrHeight]); })
                .style("fill", function(d){
                    if(d[attrColors]){
                        return colorBars(d[attrColors]);
                    }
                    return colorBars(0);
                })
                .style("stroke", strokeColor)
                .style("stroke-width", strokeSize)
                .on("mouseover", function(d) {
                    tooltip.html(d.title + "<br/>" + d.snippet);
                    d3.select(this).style("stroke", "yellow");
                    return tooltip.style("visibility", "visible");

                })
                .on("mousemove", function() {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                })
                //Actions on Mouse out
                .on("mouseout", function() {
                    if(d3.select(this).attr("class")==="visited"){
                        d3.select(this).style("stroke", "blue");
                    }else{
                        d3.select(this).style("stroke", "black");
                    };
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", function(d){
                    window.open(d.link, '_blank', 'top=50,left=50,width=900,height=600');
                    d3.select(this).attr("class", "visited");
                    d3.select(this).style("stroke", "blue");
                });



            // add the x Axis
            svg.append("g")
                .attr("id","xAxis")
                .attr("transform", "translate("+ margin.left+"," + (height+10) + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("y", 10)
                .attr("x", 9 )
                .attr("dy", ".35em")
                .attr("transform", "rotate(60)")
                .style("text-anchor", "start");

            // add the y Axis

            svg.append("g")
                .attr("id","yAxis")
                .attr("transform", "translate("+ margin.left+",10)")
                .call(d3.axisLeft(y))
                .selectAll("text")
                .attr("y", 0)
                .attr("x", -margin.left)
                .attr("dy", ".35em")
                .attr("transform", "rotate(0)")
                .style("text-anchor", "start");



            /*
            * UPDATE OF THE CHART
            *
            * */


            var update= svg.selectAll("rect")
                .data(data);

            update.transition(transition)
                .attr("y", function(d) { return y(d[attrHeight])+10; })
                .attr("height", function(d) {
                    return height - y(d[attrHeight]);
                })
                .style("fill", function(d){
                    if(d[attrColors]){
                        return colorBars(d[attrColors]);
                    }
                    return colorBars(0);
                });
            return chart;
        }
    };

    /** CONFIGURATION OF THE VALUES
     * Use the JavaScript Pattern:  Method Chaining
     **/

    chart.width = chartWidth;
    chart.height = chartHeight;
    chart.title = chartTitle;
    chart.minHeight= chartMinHeight;
    chart.maxHeight= chartMaxHeight;
    chart.customColors = chartCustomColors;
    chart.remove = chartRemove;
    chart.transition=chartTransition;

    /**
     * Get/Set VALUES
     * @Public
     * @Param value of the atributte that intend to set.
     *        no value will return the default value.
     **/

    function chartMinHeight(value){
        if (!arguments.length) {
            return minHeight;
        }
        minHeight = value;
        return chart;
    }

    function chartMaxHeight(value){
        if (!arguments.length) {
            return maxHeight;
        }
        maxHeight = value;
        return chart;
    }

    function chartTransition(value){
        if (!arguments.length) {
            return transition;
        }
        transition = value;
        return chart;
    }

    function chartWidth(value) {
        if (!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };

    function chartHeight(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };

    function chartTitle(value) {
        if (!arguments.length) {
            return title;
        }
        title = value;
        return chart;
    };


    function chartCustomColors(attr, pallette, blindsafe) {
        customColors=true;
        attrColors= attr;
        customRange= ["#59f442","#eef441","#f44141"];
        return chart;
    };


    function chartRemove(callback) {
        chartSVG.selectAll("text")
            .style("opacity",1)
            .transition()
            .duration(500)
            .style("opacity", "0")
            .remove();
        if (!arguments.length) {
            chartSVG.selectAll("g")
                .style("opacity",1)
                .transition()
                .duration(500)
                .style("opacity", "0")
                .remove();
        }
        else {
            chartSVG.selectAll("g")
                .style("opacity",1)
                .duration(500)
                .style("opacity", "0")
                .remove()
                .on("end", callback);
        }
        return chart;
    }
    //Return the Chart.
    return chart;
}

module.exports={
    barChart
};