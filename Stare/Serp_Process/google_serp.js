
//Module imports

var fs = require('fs');

//Objects definitions

//Definición de Objetos
//Objeto CleanSERP, es un serp que contiene solo
//Los atributos que se necesitan
function cleanSerp(query) {
    this.resultados= query[0];
    this.terminos= query[1];
    this.items= query[2];
    this.start=query[3]; //PENDANT
    this.documents= [];
};

//Objeto Documento. Define cada resultado.
function document(info){
    this.title= info[0];
    this.link=info[1];
    this.displaylink=info[2];
    this.snippet= info[3];
    this.image=info[4] || "";
};

//Función post para documentos
Object.defineProperty(cleanSerp.prototype, "docPos", {
    set: function(doc){
        var posision= this.documents.length;
        this.documents[posision]=doc;
    }
});


//FUNCIONES

var loadJson= function (ruta){
    var Json= require(ruta);
    return Json;
};


var writeJson= function (ruta, file){

    file= JSON.stringify(file);
    fs.writeFile (ruta, file, function(err) {
            if (err) throw err;
            console.log('escritura completa');
        }
    );
};

//READ AND FORMAT THE SERP
let pre_procesar= function(input, output){
    return new Promise(function(resolve, reject){
        var file= loadJson(input);
        file= clearJson(file);
        resolve(file);
    })};


//FUNCTION TO CLEAN JSON SERP FILE FROM GOOGLE
var clearJson= function(json){
    //SELECT CHARACTERISTICS TO USE:
    var query=[json.searchInformation.formattedTotalResults,
        json.queries.request[0].searchTerms,
        json.queries.request[0].count,
        json.queries.request[0].startIndex];
    var objeto= new cleanSerp(query);
    //CREATE AND ADD THE DOCUMENTS OBJECTS.
    for(i=0; i< query[2]; i++){
        var image="";
        if(json.items[i].pagemap.hasOwnProperty( "cse_thumbnail") ){
            image=json.items[i].pagemap.cse_thumbnail;
        }
        var doc= new document([json.items[i].title ,
            json.items[i].link ,
            json.items[i].displaylink ,
            json.items[i].snippet ,
            image]);
        objeto.docPos= doc;
    }
    return objeto;
};


//WRITE THE SERP IN A GIVEN PATH
var write= function(ruta, objeto){
    fs.writeFileSync(ruta, JSON.stringify(objeto), function(err){throw err});
};

module.exports= {
    pre_procesar,
    write
};