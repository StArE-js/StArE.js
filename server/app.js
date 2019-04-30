var express = require('express');
var app = express();
var cors= require('cors');
var stare=require('../Stare/stare.js');
var ecosia= require('./ecosiaWebScraper.js');
const google = require('./google_API');

app.use(cors());
app.options('*', cors()); //con esta linea y la anterior se permite la conexion desde cualquier servidor hacia el backend

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/json', function(req, res){
    //res.send('JSON :D');
    var input= __dirname +"/files/SERP.json";

    //Document is an Object of Type "Documents", Defined.
    var Json= stare.get_Json();
    stare.get_Metrics('length','ranking', 'language', 'perpiscuity');
    res.send(Json);

} );

app.get('/update', function(req, res){
    var Json= stare.get_Json();
    res.send(Json);
});

app.get('/ecosia', function(req, res){
    stare.reset();
    const q= req.param('q');
    const p= req.param('p');
    ecosia.scrap(q, p).then(
        function(result){
            if(result){
                //Document is an Object of Type "Documents", Defined.
                stare.prepareSerp('ecosia_serp', result)
                    .then(function(result){
                        console.log("Result is: " +result);
                        var Json= stare.get_Json();
                        res.send(Json)}
                    );
            }
        }
    );
});


app.get('/google', function(req, res){
    stare.reset();
    const q = req.param('q');
    const apiKey = 'AIzaSyCmGpofWrPxQT-KrJnoArXaas0zOADXikA';
    const cx = '010212477578150644501:wtqrloafnss';
    const options = { q, cx, apiKey };
    google.runSample(options).then(
        function(result){
            if(result){
                //Document is an Object of Type "Documents", Defined.
                stare.prepareSerp('google_serp', result)
                    .then(function(result){
                        //var Json= stare.get_Json();
                        res.send(result)}
                    );
            }
        }
    );
});



app.listen(3000, function () {
  console.log('I\'m the backend!');
  console.log('Example app listening on port 3000!');
});

