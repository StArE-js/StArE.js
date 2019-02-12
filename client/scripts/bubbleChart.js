const d3 = require('d3');
const palettes= require('./ColorPallettes.js');
require("./styles/bubbleChart.css");
/**
 * Based on the work from Déborah Martinez.
 *  License: MIT
 **/

function bubbleChart(){

    //Configurable Settings
    var width= 600,
        transition= 500,
        height=400,
        marginTop=40,
        minRadius=8,
        maxRadius=50,
        attrRadius='length',
        attrColors= 'perpiscuity',
        colorDomain,
        forceApart= -340,
        customRange,
        colorAttr,
        customColors=false,
        chartSelection,
        chartSVG,
        title,
        showTitleOnCircle=false;

    //Settings Extracted From the serp:

    /** GENERATION OF THE ACTUAL CHART
     * @public
     * @param(string) selection - is the div ID in which the chart will be render.
     **/
    function chart(selection) {
        var data = selection.datum(); //json is stored in data var.
        data=data.documents;
        if(data){ //Si el archivo existe.
            chartSelection = selection;
            var div = selection,
                svg = div.selectAll('svg'); //Select the SVG element.

            //Set the dimensions of the svg
            svg.attr('width', width).attr('height', height);
            chartSVG = svg;

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



            //ASIGN COLOR TO THE CIRCLES.
            var colorCircles;
            if (!customColors) {
                colorCircles = d3.scaleOrdinal(d3.schemeCategory10); //por defecto.
            }
            else {
                var min=1000, max=0;
                for(e in data){
                    if(data[e][attrColors]<min){min= data[e][attrColors]}
                    if(data[e][attrColors]>max){max= data[e][attrColors]}
                };
                colorDomain= [min, (min+max)/2, max];
                colorCircles = d3.scaleLinear()
                    .domain(colorDomain)
                    .range(customRange);

            }


            //map Radius
            var minRadiusDomain = d3.min(data, function(d) {
                if(d[attrRadius]){
                    return +d[attrRadius];
                }
                else return 0;
            });
            var maxRadiusDomain = d3.max(data, function(d) {
                if(d[attrRadius]){
                    return +d[attrRadius];
                }
                else return 0;
            });
            var scaleRadius = d3.scaleLinear()
                .domain([minRadiusDomain, maxRadiusDomain])
                .range([minRadius, maxRadius]);


            //Create the force Layout
            var simulation = d3.forceSimulation(data)    //initialize the force layout
                .force("charge", d3.forceManyBody().strength([forceApart])) //for "many bodies" and set the stength value
                //stength < 0: bodies repel each other.
                .force("x", d3.forceX())        //Makes a force that atract the objects to the center.
                .force("y", d3.forceY())
                .force("collision", d3.forceCollide().radius(function(d){//To avoid Collitions
                    return scaleRadius(d[attrRadius]);
                }))
                .on("tick", ticked);            //Event when the elements acomodate.

            function ticked(e) {
                node.attr("transform", function (d) {
                    return "translate(" + [d.x + (width / 2), d.y + ((height + marginTop) / 2)] + ")";
                });
            }

            //Previous Definitions, Color, Radious, Attr, etc..
            var node= svg.selectAll("circle")
                .data(data)
                .enter()
                .append("g")
                .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
                .style('opacity',1);

            node.append("circle")
                .attr("id",function(d,i) {
                    return i;
                })
                .attr('r', function(d) {
                    if(d[attrRadius]){
                        return scaleRadius(d[attrRadius]);
                    }
                    return scaleRadius(0);

                })
                .style("fill", function(d) {
                    if(d[attrColors]){
                        return colorCircles(d[attrColors]);
                    }
                    return colorCircles(0);
                })
                .style("stroke", "black")
                .style("stroke-width", "3px")
                .on("mouseover", function(d) {
                    if(d[attrRadius]){
                        tooltip.html(d.title + "<br/>" + d.snippet + "<br/>" + attrRadius+" "+ d[attrRadius]);
                        d3.select(this).style("stroke", "yellow");
                        return tooltip.style("visibility", "visible");
                    }
                    else{
                        tooltip.html(d.title + "<br/>" + d.snippet);
                        return tooltip.style("visibility", "visible");
                    }
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


            if (showTitleOnCircle) {
                node.append("text")
                    .attr("clip-path",function(d,i) {
                        return "url(#clip-" + i + ")"
                    })
                    .attr("text-anchor", "middle")
                    .append("tspan")
                    .attr("x",function(d) {
                        return 0;//-1*scaleRadius(d[columnForRadius])/3;
                    })
                    .attr("y",function(d) {
                        return ".3em";//scaleRadius(d[columnForRadius])/4;
                    })
                    .text(function(d, i) {
                        return i;
                    })
                    .on("mouseover", function(d) {
                        tooltip.html(d.title + "<br/>" + d.snippet + "<br/>" + attrRadius+" "+ d.length);
                        return tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", function() {
                        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
                    })
                    //Actions on Mouse out
                    .on("mouseout", function() {
                        return tooltip.style("visibility", "hidden");
                    })
                    .on("click", function(d){
                        window.open(d.link, '_blank', 'top=50,left=50,width=900,height=600');

                    });
            };

            svg.append('text')
                .attr('x',width/2).attr('y',marginTop)
                .attr("text-anchor", "middle")
                .attr("font-size","1.8em")
                .text(title);

            var update= svg.selectAll("circle")
                .data(data);

            update.transition(transition)
                .attr('r', function(d) {
                if(d[attrRadius]){
                    return scaleRadius(d[attrRadius]);
                }
                return scaleRadius(0);
            })
                .style("fill", function(d) {
                    if(d[attrColors]){
                        return colorCircles(d[attrColors]);
                    }
                    return colorCircles(0);
                });



            return chart;

        }

    };

    /** CONFIGURATION OF THE VALUES
     * Use the JavaScript Pattern:  Method Chaining
     **/

    chart.width = chartWidth;
    chart.height = chartHeight;
    chart.minRadius = chartMinRadius;
    chart.maxRadius = chartMaxRadius;
    chart.forceApart = chartForceApart;
    chart.showTitleOnCircle = chartShowTitleOnCircle;
    chart.title = chartTitle;
    chart.customColors = chartCustomColors;
    chart.remove = chartRemove;
    chart.attrRadius= chartRadius;
    chart.transition=chartTransition;
    /**
     * Get/Set VALUES
     * @Public
     * @Param value of the atributte that intend to set.
     *        no value will return the default value.
     **/

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

    function chartRadius(value){
        if(!arguments.length){
            return attrRadius;
        }
        attrRadius= value;
        return chart;
    }
    function chartHeight(value) {
        if (!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };

    function chartMinRadius(value) {
        if (!arguments.length) {
            return minRadius;
        }
        minRadius = value;
        return chart;
    };

    function chartMaxRadius(value) {
        if (!arguments.length) {
            return maxRadius;
        }
        maxRadius = value;
        return chart;
    };

    function chartForceApart(value) {
        if (!arguments.length) {
            return forceApart;
        }
        forceApart = value;
        return chart;
    };

    function chartTitle(value) {
        if (!arguments.length) {
            return title;
        }
        title = value;
        return chart;
    };

    function chartShowTitleOnCircle(value) {
        if (!arguments.length) {
            return showTitleOnCircle;
        }
        showTitleOnCircle = value;
        return chart;
    };

    function chartCustomColors(attr, pallette, blindsafe) {
        customColors=true;
        attrColors= attr;
        customRange=  palettes.get_Pallette(pallette, blindsafe);
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
    bubbleChart
};