//EXTENSION TO CALCULATE THE RANKING OF A RESULT IN THE SERP
//CONSIDERS THE PAGE AND POSITION OF THE DOCUMENT TO CALCULATE.

//INPUT: OBJECT JSON STANDARD
//OUTPUT:
//['ranking' : value of the ranking calculated,
//  'ranking': name of the metric,
//  'index'  : index of the document (given)]
//

var get_value= function(input, index) {
    return new Promise(function(resolve, reject){
        var start= input.start;
        var ranking= start*input.items+1;
        resolve([ranking, 'ranking', index]);
        reject(false);
    })
};

var use_DOC= function(){return false},
    use_HTML= function(){return false},
    use_SERP= function(){return true};

module.exports= {
    get_value,
    use_DOC,
    use_HTML,
    use_SERP
}