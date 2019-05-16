//*********************************************
//*********************************************
// Camila Márquez. Licence MIT.             ***
// Universidad de Santiago de Chile -USACH  ***
// Poyect Repository:                       ***
//*********************************************
//*********************************************

//imports
const express = require('express');
const app = express();
const cors= require('cors');
const stare=require('../Stare/stare.js');
const ecosia= require('./ecosiaWebScraper.js');
const google = require('./google_API');

var lastCall = {
    q: String,
    p: Number,
    call: Promise,
    result: Object,
    serpUsed: String
};

//Access Control
app.use(cors());
app.options('*', cors()); //con esta linea y la anterior se permite la conexion desde cualquier servidor hacia el backend

var metrics= ['length','ranking', 'language', 'perpiscuity'];

// FUNCTION THAT GETS THE METRICS
// RETURNS OBJECT WITH THE STANDAR JSON OBJECT
app.get('/json', function(req, res){
    //  Metrics Solicitud
    stare.get_Metrics(...metrics);
    //  Document is an Object of Type "Documents", Defined.
    var Json= stare.get_Json();
    //  Send the Doc to the url
    res.send(Json);
    }
);

//  GET THE ACTUAL STATE OF THE OBJECT
app.get('/update', function(req, res){
    //get the actual state of the Object
    var Json= stare.get_Json();
    res.send(Json);
});

//GET THE ECOSIA SERP
//SET THE SERP TO THE PREPARATION IN STARE
app.get('/ecosia', function(req, res){
    stare.reset();
    lastCall = {}
    const q= req.param('q');
    const p= req.param('p');
    ecosiaCall(q, p).then(result => {
        //Document is an Object of Type "Documents", Defined.
        stare.prepareSerp('ecosia_serp', result)
            .then(function(result){
                console.log("Result is: " +result);
                var Json= stare.get_Json();
                res.send(Json)
            });
    })
});

//GET THE GOOGLE SERP
//SEND THE SERP TO THE PREPARATION IN STARE
app.get('/google', function(req, res){
    stare.reset();
    const q = req.param('q');
    const p= req.param('p');
    lastCall = {};
    lastCall = {q, p, call: googleCall};
    googleCall(q, p).then(result => {
        //Document is an Object of Type "Documents", Defined.
        stare.prepareSerp('google_serp', result)
            .then(function(result){
                console.log("Result is: " +result);
                var Json= stare.get_Json();
                res.send(Json)
            });
    })
});

//GET MORE DOCUMMENTS
app.get('/moreDocuments', function(req, res) {
    const q = lastCall.q;
    const p = parseInt(lastCall.p) + 1;
    const call = lastCall.call;
    const oldResults = lastCall.result;
    const serpUsed = lastCall.serpUsed;
    call(q, p).then(result => {
        stare.reset();
        var newResult = mergeObjects(result, oldResults);
        console.log('lastCall:' + JSON.stringify(lastCall));
        lastCall = {q, p, call, result: newResult, serpUsed};
        stare.prepareSerp(serpUsed, newResult)
            .then(function(result) {
                stare.get_Metrics(...metrics);
                res.send(result);
            })
    });
});

//SUPPORT FUNCTIONS
const ecosiaCall = (q = '', p = 0) => {
    return new Promise(function(resolve, reject) {
        ecosia.scrap(q, p).then(
            function(result){
                lastCall = {
                    q, p, call: ecosiaCall, result, serpUsed: 'ecosia_serp'
                }
                if(result){
                    resolve(result)
                }
            }
        );
    })
}

const googleCall = (q = '', p = 0) => {
    return new Promise(function(resolve, reject) {
        const apiKey = 'AIzaSyCmGpofWrPxQT-KrJnoArXaas0zOADXikA';
        const cx = '010212477578150644501:wtqrloafnss';
        const options = { q, cx, apiKey };
        google.runSample(options, p).then(
            function(result){
                if(result){
                    lastCall = {
                        q, p, call: googleCall, result, serpUsed: 'google_serp'
                    }
                    if(result){
                        resolve(result);
                    }
                }
            }
        );
    })
};

const mergeObjects = (target, source) => {
    Object.keys(source).forEach((key) => {
        const sourceValue = source[key];
        const targetValue = target[key];
        console.log(key);
        if (key == 'currentResults') {
            target[key] = targetValue + sourceValue
        } else if (key == 'resultsFrom') {
            target[key] = sourceValue
        } else if (key == 'resultsTo') {
            target[key] = targetValue
        } else if (key == 'currentPage') {
            target[key] = targetValue
        } else if (key == 'request') {
            target[key] = mergeObjects(targetValue, sourceValue)
        } else
            target[key] = mergeValues(targetValue, sourceValue)
    });
    return target
};

const mergeArrays = (target, source) => {
    return [...target, ...source]
};

const mergeValues = (target, source) => {
    if (Array.isArray(target) && Array.isArray(source))
        return mergeArrays(target, source);
    if (target !== null && typeof target === 'object' && source !== null && typeof source === 'object')
        return mergeObjects(target, source);
    if (source === undefined)
        return target;
    return source
};

app.listen(3000, function () {
  console.log('I\'m the backend!');
  console.log('Example app listening on port 3000!');
});

