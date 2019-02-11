/*
* EXTENSION TO DETECT TEXT LANGUAGE
* USES THE SNIPPET TEXT FOR THE CALCULATIONS
* INPUT: JSON OBJECT PROVIDED BY STARE.JS
* INDEX: INDEX OF THE DOCUMENT
* OUTPUT: ARRAY['value': value obtained, 'language': name of the metric, 'index': index of the document]
* */

//DEPENDENCIES
const LanguageDetect = require('languagedetect');

//DECLARATIONS OF VARIABLES.
const lngDetector = new LanguageDetect();

//FUNCTION THAT CALCULATE THE METRIC:
var get_value= function(input, index) {
    return new Promise(function(resolve, reject){
        snippet= input.documents[index].snippet;
        value=lngDetector.detect(snippet, 1)[0][0];
        resolve([value, 'language', index]);
        reject(false);
    })
};

//WHAT KIND OF ENTRY IT USES
var use_DOC= function(){return false},
    use_HTML= function(){return false},
    use_SERP= function(){return true};

module.exports= {
    get_value,
    use_DOC,
    use_HTML,
    use_SERP
}