function barChart(data, svgWidth, svgHeight, barPadding, fill, border, borderSize) {
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#444")
        .text("a simple tooltip");

    var dataset=[];
    for(i=0; i<data.items;i++){
        dataset[i]= 1;
    }
    var barwidth= (svgWidth/dataset.length);
    //Obtener documento más largo:
    var datoMax=0;
    for(i=0; i< dataset.length;i++){
        if (dataset[i]>datoMax){
            datoMax=dataset[i];
        }
    }
    //Normalizar vector de datos
    for(i=0; i< dataset.length;i++){
        dataset[i]=(dataset[i]/datoMax)*svgHeight;
    }
    svgHeight=svgHeight+10;
    var svg=d3.select('svg')
        .attr("width",svgWidth )
        .attr("height",svgHeight);

    svg.selectAll("rect").data(dataset)
        .enter().append("rect")//se insertan rectangulos para cada elemento del data set
        .attr("height", function (d, i) {
            return d;
        })
        .attr("width", barwidth-barPadding)
        .attr("x", function (d, i) {
            console.log(i);
            return i*barwidth;
        })
        .attr("y", function (d) {
            return (svgHeight)-(d/450)*svgHeight;
        })
        .attr("class", "bar")
        .attr("stroke", border)
        .attr("stroke-width", borderSize)
        .attr("fill", fill)
        .on("mouseover", function(d, i){tooltip.text(data.documentos[i].title); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
        .on("click", function(d, i){
            window.open(data.documentos[i].link, '_blank', 'top=50,left=50,width=900,height=600');
        });
    // Define the axes
}

function updateBarChart(data, svgWidth, svgHeight) {
    var dataset=[];
    var svg=d3.select('svg');
    var dataLabels=[];
    var barwidth= svgWidth/data.items;

    for(i=0; i<data.items;i++){
        dataset[i]= data.documentos[i].length;
        dataLabels[i]=data.documentos[i].length;
    }
    //Obtener documento más largo:
    var datoMax=0;
    for(i=0; i< dataset.length;i++){
        if (dataset[i]>datoMax){
            datoMax=dataset[i];
        }
    }
    //Normalizar vector de datos
    for(i=0; i< dataset.length;i++){
        dataset[i]=(dataset[i]/datoMax)*svgHeight;
    }
    svgHeight=svgHeight+10;
    svg.selectAll("rect").data(dataset)
        .attr("y", function (d) {
            return (svgHeight)-(d/450)*svgHeight;
        });

    //Actualizar texto
    svg.selectAll("text")
        .data(dataset)
        .text(function (d, i) {
            if(dataLabels[i]==1){
                return("?");
            }else{
                return (dataLabels[i]);
            }
        })
        .attr("x",function (d, i) {
            return i*barwidth + (barwidth/4)
        })
        .attr("y", function (d) {
            return svgHeight-10-(d/450)*svgHeight+ svgHeight*0.01;
        });

}
function addLabel(data, svgWidth, svgHeight){

    var svg=d3.select('svg');

    //Obtener y Normalizar Valores
    var dataset=[];
    for(i=0; i<data.items;i++){
        dataset[i]= data.documentos[i].length;
    }

    var datoMax=0;
    for(i=0; i< dataset.length;i++){
        if (dataset[i]>datoMax){
            datoMax=dataset[i];
        }
    }
    //Normalizar vector de datos
    for(i=0; i< dataset.length;i++){
        dataset[i]=parseInt((dataset[i]/datoMax)*svgHeight);
    }
    var barwidth= svgWidth/data.items;

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text("?")
        .attr("x",function (d, i) {
            return i*barwidth + (barwidth/4)
        })
        .attr("y", function (d) {
            return svgHeight-10-(d/450)*svgHeight+ svgHeight*0.01;
        });
};

function loadJSON(ruta, sync){
    var json;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            json= JSON.parse(this.responseText);
        }
    };
    xmlhttp.open("GET", ruta, sync);
    xmlhttp.send();
    return json;
};