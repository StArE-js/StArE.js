/*
* EXTENSION TO DETECT TEXT LANGUAGE
* USES THE SNIPPET TEXT FOR THE CALCULATIONS
* INPUT: JSON OBJECT PROVIDED BY STARE.JS
* INDEX: INDEX OF THE DOCUMENT
* OUTPUT: ARRAY['value': value obtained, 'language': name of the metric, 'index': index of the document]
* */

//DEPENDENCIES
var fs= require('fs');
//language detect
const LanguageDetect = require('languagedetect');
//syllables count
const hyphenopoly = require("hyphenopoly")

//DECLARATIONS OF VARIABLES.
const lngDetector = new LanguageDetect();


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

//Take 100 words of the snippet:
var take_100_words= function(data){
    var str2 = data.replace(/(([^\s]+\s\s*){10})(.*)/,"$1…");
    return str2;
};

//FUNCTION THAT CALCULATE THE METRIC:
var get_value= function(input, index) {
    return new Promise(function(resolve, reject){
        var sample;
        fs.readFile(input, function (err, data) {
            if (err) return err;
            sample= take_100_words(data.toString());
            console.log("sample" + sample);

            value=lngDetector.detect(snippet, 1)[0][0];
            console.log(value + ' language '+ index);

            //STEP 1: Words per Sentence
            var words=0;
            //STEP 2: COUNT SYLLABLES
            var syllables=0;
            //STEP 3: APPLY FORMULA
            var perpiscuity;


            resolve([1, 'perpiscuity', index]);
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