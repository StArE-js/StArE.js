//This Microservice makes the web scrapping process
//Can be changed as long as the new class have the same name.
//Be carefull with the imports.

//Dependencies

var fs = require('fs'); //To Read Files
const rp = require('request-promise'); //To make Promises!


//Other Services of Stare.js
var html=require('./HTML_Cleaner.js');


//DOWNLOAD ONE DOCUMENT AND SAVE IT IN THE DOCS DIR.
//IMPLEMENTED LIKE PROMISE TO ALLOW CONSISTENCE.

//DOWNLOAD THE DOCUMENT!
//INPUT: URL OF THE WEBSITE, NUMBER OF DOCUMENT, OUTPUT ROUTE
//OUTPUT: DOCUMENT HTML.

let get_HTML= function(url, num, output){
    return new Promise(function(resolve, reject){
        output= output + '/docs/HTML/HTML' + num +'.txt';
        rp(url).then(function (data) {
            var doc= data.toString();
            fs.writeFile (output , doc, function(err) {
                    if (err) throw err;
                    resolve(num)
                }
            );
            //return doc;
        }).catch(function (err) {
            fs.writeFile (output , "FAIL", function(err) {
                    if (err) throw err;
                }
            );
            resolve(num);
        });
    });
};

//CLEAN THE HTML TAGS IN THE DOCUMENT
//INPUT: PARENT ROUTE, NUMBER OF DOCUMENT
//OUTPUT: TEXT OF THE DOCUMENT
let get_Doc=function(num, output){
    return new Promise(function(resolve, reject){
        fs.readFile(output+'/docs/HTML/HTML'+num+'.txt', function(err, data) {
            if (err) throw err;

            html.promesaLimpiarArchivo(data.toString()).then(
                function(doc){
                    fs.writeFile (output+'/docs/doc/doc'+num+'.txt' , doc, function(err) {
                            if (err) throw err;
                            resolve(num);
                        }
                    );
                }
            );
        });
    });
};


//EXPORT OF FUNCTIONS
module.exports = {
    get_Doc,
    get_HTML
};
