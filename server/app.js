var express = require('express');
var app = express();
var cors= require('cors');
var stare=require('../Stare/stare.js');
var ecosia= require('./ecosiaWebScraper.js');

app.use(cors());
app.options('*', cors()); //con esta linea y la anterior se permite la conexion desde cualquier servidor hacia el backend

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/json', function(req, res){
    //res.send('JSON :D');
    var input= __dirname +"/files/SERP.json";

    //Document is an Object of Type "Documents", Defined.
    var Documents= stare.prepareSerp('google_serp', input)
        .then(function(result){
            if(result){
                console.log("The Operation succeed");
                stare.get_Metrics('length','ranking', 'language', 'perpiscuity');
                var Json= stare.get_Json();

            }else{
              console.log("The operation Failed");
            };
        res.send(Json)}
        );
} );

app.get('/update', function(req, res){
    var Json= stare.get_Json();
    res.send(Json);
});

app.get('/ecosia', function(req, res){
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

/**
 * EJEMPLO DE MANDAR COSAS DESDE FRONT A BACKEND
 *
 */
app.get('/ejemplo', (req, res) => {
    const whoRules = req.param('whoRules') // guardo lo que fue enviado en la variable http "whoRules"
    res.send(`${whoRules} rulz!`);
})

app.listen(3000, function () {
  console.log('I\'m the backend!');
  console.log('Example app listening on port 3000!');
});

