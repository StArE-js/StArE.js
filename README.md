# StArE.js

Stare.js is a project that seek facilitate to developers the creation of alternative visualizations for search engine results, providing key functionalities to clean, manage, extract characteristic and create visualization of SERPs (Search Engine Result Pages).
  - Extensible
  - Modular
  - Potentially Scalable
  - Open Source
  - Reduce your Codelines

### Resources

* [npm Package]
* [Proof of Concept] - Aplicated Example
* [Development Environment] - Aplication to develop your own extensions

### Installation

Stare.js requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install stare.js
```

### Extensions

Stare.js is currently extended with the following plugins, all of them developed as part of the proof of concept.

| Plugin | Function |
| ------ | ------ |
| Legibility | Reading Ease for English and Perpiscuity for Spanish|
| Language | Detect the most probable language for a document
| Length of Documents | Calculate the length in characters of a Document
| Support for Google SERPs | Handler for SERPs obtained through the Google Custom Search JSON API
| Support for Ecosia SERPs | Handler for SERPs obtained from ecosia through a web scrapper
| Bubble Chart Visualization | Simple bubble chart visualization
| Bar Chart Visualization | Simple bar chart visualization

## Back-End Usage
Import the package.
```javascript
const stare=require('stare.js').stare;
```
Define Metrics to calculate. Each Metric must be adressed by its name.
```javascript
var metrics= ['length','ranking', 'language', 'perpiscuity'];
```
Pre Process the SERP and extract characteristics:
```javascript
//var SERP contains the SERP
...
stare.prepareSerp('ecosia_serp', SERP)
            .then(function(SERP){
                //This code is executed after the SERP preparation
                //The necesary metrics are required:
                stare.get_Metrics(...metrics);
                //To Get the SERP:
                var Json= stare.get_Json();
                ...
               });
```
The resultant SERP (standard) has the following structure:
```json
{
"resultados": number,
"terminos": String[],
"items": number,
"start": number,
"documents": Document[{
    "title": String,
    "link": String,
    "snippet": String,
    "image": Images[{
        "width": number,
        "height": number,
        "src": String
        }]
    }]
}
```
## Front-End Usage
In the front end of the app, import the visualization module:
```javascript
const bubbleChart = require('stare.js/visualizations').bubbleChart;
```
Define the variable that will contains the chart and set parameters:
```javascript
var chart;
var t = 500; //time to update data in ms.
```
Create the chart and configurate internal parameters:
```javascript
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
```
Finally, pass the data and update the chart if needed:
```javascript
//var json contains processed SERP
...
d3.select('#chart').datum(json).call(chart);
interval = setInterval(
            () => updateDataBubbleChart(){
                ...
                //get updated data in json using get_json().
                d3.select('#chart').datum(json).call(chart);
            }, t
        );
```
## Include New Extensions
To add new characteristics through extensions you will have to add the script in the corresponding component of the pachage as indicated below:

### 1. SERP Handler
To add a SERP handles you must create a JavaScript file named **searchEngineName_serp.js** and include it in the directory: **Stare/Serp_Process/**

The Extensión must have the following structure (it's important to maintain the names of the methods):
```javascript
//imports
  ...
  //Logic of the format transformation.

  //Suport Functions
  ...
  let clearJson= function(file){
        ...
        return(StandardJsonObject)
  }
  //input managment.
  let pre_procesar= function(input, output){
   return new Promise(function(resolve, reject){
       if(typeof(input)==="string"){
           console.log("String Received");
           var file= loadJson(input);
           file= clearJson(file);
           resolve(file)}
       else{
           console.log("Object Received");
           file= clearJson(input);
           resolve(file)}
   })};

    //module exportation
    module.exports= {
       pre_procesar
    };
```
And that's all! Now, to use it, the name of the script must be passed as a paremeter when calling the function
```javascript
stare.prepareSerp('searchEngineName_serp', SERP)
```
### 2. Characteristic Extractor
To add an extension to this component, it must be created a JavaScript file called **nameCharacteristic.js** and added it to: **Stare/metrics/**.

This file must have the following structure (Is important to maintain the method names):
```javascript
//import dependencies

//support functions
    ...

//function that calculate the metric:
    var get_value= function(input, index) {
        return new Promise(function(resolve, reject){
        var name_var;
    	resolve([name_var, "name_var", index]);
    	reject(false)
	}

//type of input required
    var use_DOC= function(){return true},
        use_HTML= function(){return false},
    	use_SERP= function(){return false};

//Funtion Export:
    module.exports= { get_value };
```

the "name_var" will be the name used to use this component in the future.

### 3. Visualization
To add an extension to this component, it must be created a JavaScript file called **nameVisualization.js** and added it to: **Stare/visualizations/**.

This file must have the following structure (Is important to maintain the method names):

```javascript
 //Imports
    const d3 = require('d3');
    const palettes= require('./ColorPallettes.js');

 //Chart Function
    function nameVisualization(){
        ...
    }
 //Module Export
    module.exports={
        nameVisualization
    };
```
The implementation of the visualization must be done following the method chain notation, to allow the setting of parameters through this mechanism.


## License

MIT

   [npm Package]: <https://www.npmjs.com/package/stare.js>
   [Proof of Concept]: <https://github.com/StArE-js/StareConceptTest->
   [Development Environment]: <https://github.com/StArE-js/StArE.js>