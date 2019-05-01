//Imports
const axios = require('axios');
const d3 = require('d3');
const bubbleChart = require('./scripts/bubbleChart.js').bubbleChart;
const barChart = require('./scripts/barChart.js').barChart;

//Variables
var chart;
var t = 500; //time to update data in ms.
var buttonState = false;
var interval;
var update=false;
//Buttons Actions

//SEARCH ENGINES:
const sendQueryEcosia= () =>{
    var q= document.getElementById("SearchBox").value;
    var p=0;
    if(q!=""){
        axios.default.get('http://localhost:3000/ecosia?q=' + q + '&p='+p).then(
            response => {
                json =JSON.stringify( response.data);
                console.log(json);
                document.getElementById("searchResults").innerHTML=json;
                document.getElementById("searchResults").style.display = "block";
            },
            error => console.error(error)
        )
    };
    console.log(q);
};

const sendQueryGoogle= () => {
    var q= document.getElementById("SearchBox").value;
    var p=0;
    if(q!=""){
        axios.default.get('http://localhost:3000/google?q=' + q).then(
            response => {
                json = JSON.stringify( response.data);
                document.getElementById("searchResults").innerHTML=json;
                document.getElementById("searchResults").style.display = "block";
            },
            error => console.error(error)
        )
    };
    console.log(q);
};


//CHARTS:
const removeChart=(chart)=>{
    update =false;
    chart.remove();
    var chart= null;
};

//BUBBLE CHART:

const renderDataBubbleChart = () => {
    update= true;
    let json;
    axios.default.get('http://localhost:3000/json').then(
        response => {
            json = response.data;
            chart = bubbleChart()
                .height(600)
                .width(700)
                .forceApart(-600)
                .maxRadius(70)
                .minRadius(10)
                .attrRadius("length")
                .showTitleOnCircle(true)
                .customColors("perpiscuity", "A3", false);
            d3.select('#chart').datum(json).call(chart);
        },
        error => console.error(error)
    )
};

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
    axios.default.get('http://localhost:3000/json').then( //cambiar ruta later
        response => {
            json = response.data;
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
        document.getElementById("btn_3").className="clear";
        document.getElementById("btn_3").innerText="Classic Text";
        //ocultar los otros divs:
        document.getElementById("chart").style.display = "block"; //maybe remove later
        document.getElementById("searchResults").style.display = "none";
        //create BubbleChart:
        if(chart){
            removeChart(chart);
        }
        renderDataBubbleChart();
        interval = setInterval(() => updateDataBubbleChart(), t);
    }else if(status==="clicked"){
        //set buttons values:
        document.getElementById("btn_1").className="clear";
        document.getElementById("btn_1").innerText="Bubble Chart";
        document.getElementById("btn_2").className="clear";
        document.getElementById("btn_2").innerText="Bar Chart";
        document.getElementById("btn_3").className="clear";
        document.getElementById("btn_3").innerText="Classic Text";
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
        document.getElementById("btn_3").className="clear";
        document.getElementById("btn_3").innerText="Classic Text";
        //ocultar los otros divs:
        document.getElementById("chart").style.display = "block"; //maybe remove later
        document.getElementById("searchResults").style.display = "none";
        //create BarChart:

        if(chart){
            removeChart(chart);
        }
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



//BUTTONS METHOD CALLS:

//SEND QUERYS TO THE RESPECTIVE SEARCH ENGINE:
document.getElementById("btn_ecosia").onclick = sendQueryEcosia;
document.getElementById("btn_google").onclick = sendQueryGoogle;

//CHARTS
document.getElementById("btn_1").onclick = createBubbleChart;
document.getElementById("btn_2").onclick = createBarChart;
