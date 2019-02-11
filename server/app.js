var express = require('express');
var app = express();
var cors= require('cors');
var stare=require('../Stare/stare.js');

app.use(cors());
app.options('*', cors()); //con esta linea y la anterior se permite la conexion desde cualquier servidor hacia el backend

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/ejemplo', (req, res) =>res.send('Devy rulz!')); // al acceder a localhost:3000/ejemplo se muestra

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

    /*
     var input= __dirname +"/public/files/SERP.json";
    //stare.prepare_serp('google_serp', input);

    stare.P_prepare_serp('google_serp', input)
        .then(function(json_object){
            console.log("hola estoy en la promesa");
            var i= 0;
            while(i < stare.get_Items()){
                stare.P_get_Doc(i).then(function(num){
                    stare.get_Metric('length', num);
                });
                i++;
            };

        });

    * */
} );

app.listen(3000, function () {
  console.log('I\'m the backend!');
  console.log('Example app listening on port 3000!');
});

