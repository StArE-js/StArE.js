
//Module imports

var fs = require('fs');

//Objects definitions

/*
* Standard JSON definition
*/
function cleanSerp(query) {
    this.resultados= query[0];
    this.terminos= query[1];
    this.items= query[2];
    this.start=query[3]; //PENDANT
    this.documents= [];
};

/*
* Standard Document definition
*/
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



/*
To Read a JSON file
 */
var loadJson= function (ruta){
    var Json= require(ruta);
    return Json;
};

/*
To Write a JSON file
 */
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
        if(typeof(input)==="string"){
            console.log(" Leyendo Path ");
            var file= loadJson(input);
            file= clearJson(file);
            resolve(file);
        }
        else{
            console.log(" We've got a Json! ");
            file= clearJson(input);
            resolve(file);
        }
    })};


//FUNCTION TO CLEAN JSON SERP FILE FROM GOOGLE
var clearJson= function(json){
    //SELECT CHARACTERISTICS TO USE:
    var query=[json.totalResults,
        json.q,
        json.currentResults,
        (json.currentPage* json.currentResults)];
    var objeto= new cleanSerp(query);
    //CREATE AND ADD THE DOCUMENTS OBJECTS.
    for(i=0; i< query[2]; i++){
        var image="";
        var doc= new document([json.websites[i].title ,
            json.websites[i].url,
            json.websites[i].url ,
            json.websites[i].description ,
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