const axios = require('axios');
const d3 = require('d3');
const bubbleChart = require('./scripts/bubbleChart.js').bubbleChart;
const barChart=require('./scripts/barChart.js').barChart;


var chart;
const renderData = () => {
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

const updateData=()=>{
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

const createChart_1= function (){
    renderData();
    setInterval(() => updateData(), 3000);
    return false;
};


//Maping Functions to Buttons

document.getElementById("btn_1").onclick = createChart_1();
