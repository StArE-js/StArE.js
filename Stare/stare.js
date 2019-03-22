var output= __dirname;
var web_scraper = require('./Core/web_Scraper');
var serp_manager;
var json_object; //this variable store the Object SERP.




//STEP 1: VALIDATE IF INPUT IS A PATH/URL OR AN OBJECT
function ValidURL(str) {
    if(str !== "")
    {
        if (str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null){
            return true;
        }else {
            return false;
        }
    }
};

//THIS FUNCTION PREPARES THE JSON AND TRANSFORM IT TO STANDARD FORM
//INPUT:
//serp_type: String -> valid type of SERP.
//input: String or Object-> path/url of the SERP file or Object Json

var prepareSerp= function(serp_type, input){
    return new Promise(function(resolve, reject){
        if(typeof(input)=="string"){
            if (ValidURL(input)){
                serp_manager= require('./Serp_Process/' + serp_type + '.js');
                serp_manager.pre_procesar(input).
                then(function(json){
                        json_object = json;
                        resolve(json_object);
                    }
                );
            }else{
                reject (false);
            };
        }else{

            //validar objeto aquí!!!!!!!
            serp_manager= require('./Serp_Process/' + serp_type + '.js');
            serp_manager.pre_procesar(input).
            then(function(json){
                    json_object = json;
                    resolve(json_object);
                }
            );
        };
    });
};


//STEP 2:
// DOWNLOAD DOCUMENTS
let get_Document= function(num){
    return new Promise(function(resolve, reject){
        web_scraper.get_HTML(json_object.documents[num].link, num, output)
            .then(
                function(num){
                    web_scraper.get_Doc(num, output).then(
                        function(num){
                            console.log("Document " + num + "is downloaded!");
                            resolve(num);
                            reject(false);}
                    );
                }
            );
    });
};

//ONLY DOWNLOAD HTML's
let get_HTML= function(num){
    return new Promise(function(resolve, reject){
        web_scraper.get_HTML(json_object.documents[num].link, num, output)
            .then(
                function(num){
                    console.log("Document " + num + "is downloaded!");
                    resolve(num);
                    reject(false);
                }
            );
    });
};


//STEP 3: GET THE METRICS!
var html=false, document=false, serp=false;
var metric=[];
var get_Metrics= function(){
    console.log('tengo ' + arguments.length +'metricas que calcular');
    i=0;
    //Check if Documents or HTMLS are nedeed.
    while (i< arguments.length){
        //STEP 0: REQUIRE THE METRIC
        metric[i]= require('./Metrics/' + arguments[i]+'.js');
        if (metric[i].use_SERP())
            serp=true;
        if (metric[i].use_DOC())
            document=true;
        if (metric[i].use_HTML())
            html=true;

        for( doc in json_object.documents){
            json_object.documents[doc][arguments[i]]=1;
        }
        i++;};
    //initialization of variables



    //Get The Metrics
    if(document===false & html=== false){
        console.log("No Download Nedeed");
        j=0;
        while(j< arguments.length){
            for (doc in json_object.documents) {
                metric[j].get_value(json_object, doc)
                    .then(
                        function(values){
                            var nombre=values[1];
                            json_object.documents[values[0]][nombre]=values[2];
                             }
                    );

            }
            j++;
        };

        return (true);
    }else if(html===true & document===false){
        console.log("no cleaning nedeed");
            for (doc in json_object.documents) {
                get_Document(doc).then(
                    function (result) {
                        if (result) {
                            j=0
                            while(j<metric.length){
                                if (metric[j].use_HTML()) {
                                    metric[j].get_value(output + '/docs/HTML/HTML' + doc + '.txt', doc).then(
                                        function (value, index, name) {
                                            json_object.documents[index][name] = value;
                                        }
                                    );
                                } else {
                                    metric[j].get_value(json_object, doc).then(
                                        function (value, name, index) {
                                            json_object.documents[index][name] = value;
                                        });
                                };
                                j++;
                            };
                        } else {
                            console.log("Ups, Something Went Wrong");
                        }
                    }
                );
            }
    }else{
        console.log("all is nedeed");

            for (doc in json_object.documents) {

                get_Document(doc).then(
                    function (result) {
                        if (result) {
                            console.log("html ready");

                            x=0;
                            while(x< metric.length){
                                if (metric[x].use_DOC()) {

                                    metric[x].get_value(output + '/docs/doc/doc' + result + '.txt', result).then(
                                        function (values) {
                                            json_object.documents[values[2]][values[1]] = values[0];
                                        }
                                    );
                                } else if (metric[x].use_HTML()) {
                                    metric[x].get_value(output + '/docs/HTML/HTML' + result + '.txt', result).then(
                                        function (values) {
                                            json_object.documents[values[2]][values[1]] = values[0];
                                        }
                                    );
                                } else {
                                    metric[x].get_value(json_object, result).then(
                                        function (values) {
                                            json_object.documents[values[2]][values[1]] = values[0];
                                        }
                                    );
                                };
                                x++;
                            };


                        } else {
                            console.log("Ups, Something Went Wrong");
                        }
                    }
                );
            };
        }
    };



//GET NUMBER OF ITEMS
var get_Items = function(){
    return(json_object.items);
};

//GET JSON
var get_Json= function(){
    return JSON.stringify(json_object);
};

module.exports = {
    get_Items,
    get_Json,
    prepareSerp,
    get_Metrics
};