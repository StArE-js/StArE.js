const axios = require('axios');
const d3 = require('d3');
const bubbleChart = require('./scripts/bubbleChart.js').bubbleChart;
const barChart = require('./scripts/barChart.js').barChart;

var chart;
var t = 500; //time to update data in ms.

//Bubble Chart
const renderDataBubbleChart = () => {
    document.getElementById("btn_1").innerText = "Quitar gráfico";
    document.getElementById("chart").style.display = "block";
    document.getElementById("chart2").style.display = "none";
    document.getElementById("chart3").style.display = "none";
    document.getElementById("btn_2").innerText = "Bar Chart";
    document.getElementById("btn_3").innerText = "Classic Text";
    let json;
    axios.default.get('http://localhost:3000/json').then(
        response => {
            json = response.data;
            chart = bubbleChart()
                .height(600)
                .width(700)
                .title("Query: "+json.terminos)
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
    let json;
    axios.default.get('http://localhost:3000/update').then(
        response => {
            json = response.data;
            d3.select('#chart').datum(json).call(chart);
            console.log('updating...');
        },
        error => console.error(error)
    )
};

const createBubbleChart = () => {
    buttonState = ! buttonState;
    if (buttonState) {
        renderDataBubbleChart();
        interval = setInterval(() => updateDataBubbleChart(), t)
    } else {
        clearInterval(interval);
        document.getElementById("chart").innerHTML = "<svg></svg>"
        document.getElementById("btn_1").innerText = "Bubble Chart"
        document.getElementById("btn_1").className= "clicked";
        document.getElementById("btn_2").className= "";
        document.getElementById("btn_3").className= "";
    }
};

//BAR CHART

const renderDataBarChart = () => {
    document.getElementById("btn_2").innerText = "Quitar gráfico";
    document.getElementById("chart").style.display = "none";
    document.getElementById("chart2").style.display = "block";
    document.getElementById("chart3").style.display = "none";
    document.getElementById("btn_1").innerText = "Bubble Chart";
    document.getElementById("btn_3").innerText = "Classic Text";

    let json;
    axios.default.get('http://localhost:3000/json').then( //cambiar ruta later
        response => {
            json = response.data;
            chart = barChart()
                .height(600)
                .width(700)
                .customColors("perpiscuity", "A3", false);
            d3.select('#chart2').datum(json).call(chart);
        },
        error => console.error(error)
    )
};

const updateDataBarChart=()=>{
    let json;
    axios.default.get('http://localhost:3000/update').then(
        response => {
            json = response.data;
            //Eliminar Axis Viejos y rehacerlos:
            //d3.select('#chart2').selectAll("#yAxis").remove()
            //d3.select('#chart2').selectAll("#xAxis").remove()
            d3.select('#chart2').datum(json).call(chart);
            console.log('updating...');
        },
        error => console.error(error)
    )
};


const createBarChart = () => {
    buttonState = ! buttonState;
    if (buttonState) {
        renderDataBarChart();
        interval = setInterval(() => updateDataBarChart(), t)
    } else {
        clearInterval(interval);
        document.getElementById("chart2").innerHTML = "<svg></svg>"
        document.getElementById("btn_2").innerText = "Bar Chart"
        document.getElementById("btn_1").className= "";
        document.getElementById("btn_2").className= "clicked";
        document.getElementById("btn_3").className= "";
    }
};


//Maping Functions to Buttons
var buttonState = false;
var interval;

//Bubble Chart
document.getElementById("btn_1").onclick = createBubbleChart;
document.getElementById("btn_1").innerText = "Bubble Chart";

//Bar Chart
document.getElementById("btn_2").onclick = createBarChart;
document.getElementById("btn_2").innerText = "Bar Chart";

/**
 * EJEMPLO DE MANDAR COSAS DESDE FRONT A BACKEND
 *
 */
/*
axios.default.get('http://localhost:3000/ejemplo?whoRules=Devy+fandub').then( // mando un valor en la variable whoRules
    response => console.log(response.data),
    error => console.error(error)
);
*/
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


//SEND QUERYS TO THE RESPECTIVE SEARCH ENGINE:
document.getElementById("btn_ecosia").onclick = sendQueryEcosia;
document.getElementById("btn_google").onclick = sendQueryGoogle;