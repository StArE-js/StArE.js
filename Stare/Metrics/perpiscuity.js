/*
* EXTENSION TO DETECT TEXT LANGUAGE
* USES THE SNIPPET TEXT FOR THE CALCULATIONS
* INPUT: JSON OBJECT PROVIDED BY STARE.JS
* INDEX: INDEX OF THE DOCUMENT
* OUTPUT: ARRAY['value': value obtained, 'language': name of the metric, 'index': index of the document]
* */

//DEPENDENCIES

//file system
var fs= require('fs');

//language detect
const LanguageDetect = require('languagedetect');

//syllables count
const hyphenopoly = require("hyphenopoly")

//DECLARATIONS OF VARIABLES.
const lngDetector = new LanguageDetect();
const silabas = hyphenopoly.config({sync: true, require: ['es', 'en-us'], hyphen: '-'});


//English formula of reading ease - Flesh 1984
var english= function(words, syllables){
    var p= 207-0.623*syllables-1.05*words;
    return p;
};

//Spanish perpiscuity - Szigriszt 1992
var espanish= function(words, syllables){
    var p= 207-0.623*syllables-words;
    return p;
};

//French Ilisibilite - Szigriszt 1992
var french= function(words, syllables){
    var p= 207-0.724*syllables-0.962*words;
    return p;
};

const limpiarString = (str = "") => str.replace(/[.,()\[\]{}\-\@\'\"]/gi,"");
const separarPalabras = (str = "") => limpiarString(str).split(" ");
const s = (str = "", lang = "es") => silabas.get(lang)(limpiarString(str)).replace(" ","-").split("-").length;

const p = (str = "") => {
    const nPalabras = separarPalabras(str).length * 1.0
    const nFrases = str.split(".").length * 1.0
    return nPalabras / nFrases
}

//FUNCTION THAT CALCULATE THE METRIC:
var get_value= function(input, index) {
    return new Promise(function(resolve, reject){
        var sample, P, Syllables, Words;
        fs.readFile(input, function (err, data) {
            if (err) return err;
            data= data.toString();
            idiom=lngDetector.detect(snippet, 1)[0][0];
            value;
            switch(idiom){
                case("english"):
                    value= english(p(data), s(data, 'en-us'));
                    break;
                case("spanish"):
                    value= spanish(p(data), s(data, 'es'));
                    break;
                default:
                    value=207;
            };
            value= Math.round(value);
            if(value<0) value=0;
            if(value > 207) value=207;
            console.log("Perpiscuidad es:"+ value);
            resolve([value, 'perpiscuity', index]);
            reject(false);
        });
    });
};





//WHAT KIND OF ENTRY IT USES
var use_DOC= function(){return true},
    use_HTML= function(){return false},
    use_SERP= function(){return false};

module.exports= {
    get_value,
    use_DOC,
    use_HTML,
    use_SERP
}