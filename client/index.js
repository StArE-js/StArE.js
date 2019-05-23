//Imports
import JSONFormatter from 'json-formatter-js';
const axios = require('axios');
const d3 = require('d3');

const bubbleChart = require('../Stare/visualizations/bubbleChart.js').bubbleChart;
const barChart = require('../Stare/visualizations/barChart.js').barChart;

//Parameters and Variables
var chart;
var t = 500; //time to update data in ms.
var interval;  //time in ms between chart updates
var update=false; //variable to show the loading symbol.
//Buttons Actions

//SEARCH ENGINES:

//Function that get a SERP of 10 Results from Ecosia.
//      p= NUM OF PAGE
//      q= QUERY TERMS
const sendQueryEcosia= () =>{
    var q= document.getElementById("SearchBox").value;
    var p=0;
    //Fix Styles
    document.getElementById("btn_1").className="clear";
    document.getElementById("btn_1").innerText="Bubble Chart";
    document.getElementById("btn_2").className="clear";
    document.getElementById("btn_2").innerText="Bar Chart";
    document.getElementById("chart").style.display = "none";
    document.getElementById("btn_moreDocs").style.display="none";

    //IF THERE'S A CHART, REMOVE IT.
    if(chart){
        removeChart(chart);
    };

    //LOADING SYMBOL
    document.getElementById("loader").style.display="block";
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    //EXECUTE THE QUERY TO THE BACK END.
    if(q!=""){
        axios.default.get('http://localhost:3000/ecosia?q=' + q + '&p='+p).then(
            response => {
                const json = response.data;
                //PUT RESULTS IN THE VIEW
                document.getElementById("loader").style.display="none";
                document.getElementById("btn_moreDocs").style.display="inline";
                searchResults.style.display = "block";
                searchResults.style.overflow= "scroll";
                const formatter = new JSONFormatter(json, 3);
                document.getElementById("searchResults").appendChild(formatter.render());
            },
            error => console.error(error)
        )
    };
    console.log(q);
};

//Function that get a SERP of 10 Results from Google.
//      p= NUM OF PAGE
//      q= QUERY TERMS
const sendQueryGoogle= () => {
    var q= document.getElementById("SearchBox").value;
    var p=0;
    document.getElementById("loader").style.display="block";
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";
    document.getElementById("btn_1").className="clear";
    document.getElementById("btn_1").innerText="Bubble Chart";
    document.getElementById("btn_2").className="clear";
    document.getElementById("btn_2").innerText="Bar Chart";
    document.getElementById("chart").style.display = "none";
    document.getElementById("btn_moreDocs").style.display="none";
    if(chart){
        removeChart(chart);
    };
    searchResults.innerHTML = "";
    if(q!=""){
        axios.default.get('http://localhost:3000/google?q=' + q + '&p=' + p).then(
            response => {
                let json =  response.data;
                document.getElementById("btn_moreDocs").style.display="inline";
                //format to put it in the view.
                document.getElementById("loader").style.display="none";
                searchResults.style.display = "block";
                const formatter = new JSONFormatter(json, 3);
                document.getElementById("searchResults").appendChild(formatter.render());
            },
            error => console.error(error)
        )
    };
    console.log(q);
};


//CHARTS:
const removeChart=(chart)=>{
    update =false;
    if (chart){
        chart.remove();
        var chart= null;
    }
    return;
};


//BUBBLE CHART:
const renderDataBubbleChart = () => {
    update= true;
    let json;
    document.getElementById("loader").style.display="block";
    //EXCECUTE QUERY TO THE BACK END
    axios.default.get('http://localhost:3000/json').then(
        response => {
            json = response.data;
            document.getElementById("loader").style.display="none";
            //SETTING OF PARAMETERS
            chart = bubbleChart()
                .height(600)
                .width(700)
                .forceApart(-600)
                .maxRadius(70)
                .minRadius(10)
                .attrRadius("length")
                .transition(1000)
                .showTitleOnCircle(true)
                .customColors("perpiscuity", "A3", false);
            //CREATE CHART
            d3.select('#chart').datum(json).call(chart);
        },
        error => console.error(error)
    )
};

//FUNCTION THAT UPDATE THE CHART.
//IT WORKS JUST LIKE THE CREATE FUNCTIÓN, BUT ONLY ASK FOR THE ACTUAL STATE OF THE DATA
const updateDataBubbleChart=()=>{
    if(update){
        let json;
        axios.default.get('http://localhost:3000/update').then(
            response => {
                json = response.data;
                d3.select('#chart').datum(json).call(chart);
                console.log('updating...');
            },
            error => console.error(error)
        )
    }
};

//BAR CHART:
const renderDataBarChart = () => {
    update=true;
    let json;
    document.getElementById("loader").style.display="block";
    axios.default.get('http://localhost:3000/json').then( //cambiar ruta later
        response => {
            json = response.data;
            document.getElementById("loader").style.display="none";
            chart = barChart()
                .height(600)
                .width(700)
                .attrHeight('length')
                .customColors("perpiscuity", "A3", false);
            d3.select('#chart').datum(json).call(chart);
        },
        error => console.error(error)
    )
};

const updateDataBarChart=()=>{
    let json;
    if(update){
        axios.default.get('http://localhost:3000/update').then(
            response => {
                json = response.data;
                d3.select('#chart').datum(json).call(chart);
                console.log('updating...');
            },
            error => console.error(error)
        )
    }
};


//BUTTONS SETTINGS:
const createBubbleChart = () => {
    var status= document.getElementById("btn_1").className;
    if(status==="clear"){
        //set buttons values:
        document.getElementById("btn_1").className="clicked";
        document.getElementById("btn_1").innerText="Remove Bubble Chart";
        document.getElementById("btn_2").className="clear";
        document.getElementById("btn_2").innerText="Bar Chart";
        //ocultar los otros divs:
        document.getElementById("chart").style.display = "block"; //maybe remove later
        document.getElementById("searchResults").style.display = "none";
        //create BubbleChart:
        removeChart(chart);
        renderDataBubbleChart();
        interval = setInterval(
            () => updateDataBubbleChart(), t
        );
    }else if(status==="clicked"){
        //set buttons values:
        document.getElementById("btn_1").className="clear";
        document.getElementById("btn_1").innerText="Bubble Chart";
        document.getElementById("btn_2").className="clear";
        document.getElementById("btn_2").innerText="Bar Chart";
        //hide divs:
        document.getElementById("searchResults").style.display = "none";
        //Remove Bubble Chart:
        removeChart(chart);
    }

};

const createBarChart = () => {
    var status= document.getElementById("btn_2").className;
    if(status==="clear"){
        //set buttons values:
        document.getElementById("btn_1").className="clear";
        document.getElementById("btn_1").innerText="Bubble Chart";
        document.getElementById("btn_2").className="clicked";
        document.getElementById("btn_2").innerText="Remove Bar Chart";
        //ocultar los otros divs:
        document.getElementById("chart").style.display = "block"; //maybe remove later
        document.getElementById("searchResults").style.display = "none";
        //create BarChart:
        removeChart(chart);
        renderDataBarChart();
        interval = setInterval(() => updateDataBarChart(), t)
    }else if(status==="clicked"){
        //set buttons values:
        document.getElementById("btn_2").className="clear";
        document.getElementById("btn_2").innerText="Bar Chart";
        //hide divs:
        document.getElementById("searchResults").style.display = "none";
        //Remove Bar Chart:
        removeChart(chart);
    }
};

const moreDocuments= function(){
    axios.default.get('http://localhost:3000/moreDocuments').then(
        response => {
            console.log('More Documents...');
        },
        error => console.error(error)
    )
}

//BUTTONS MANAGMENT:

//SEND QUERYS TO THE RESPECTIVE SEARCH ENGINE:
document.getElementById("btn_ecosia").onclick = sendQueryEcosia;
document.getElementById("btn_google").onclick = sendQueryGoogle;

//CHARTS
document.getElementById("btn_1").onclick = createBubbleChart;
document.getElementById("btn_2").onclick = createBarChart;

//MORE DOCS
document.getElementById("btn_moreDocs").onclick=moreDocuments;