var fs= require('fs');

//THIS FUNCTION ONLY GETS THE VALUE OF THE METRIC AND RETURN IT ALONG WITH THE INDEX OF THE FILE.

var get_value= function(input, index) {
    return new Promise(function(resolve, reject){
        console.log(input);
        var length;
        fs.readFile(input, function (err, data) {
            if (err) return err;
            length= data.length+1;
            resolve([length, 'length', index]);
            reject(false);
        });
    });
};

var use_DOC= function(){return true},
    use_HTML= function(){return false},
    use_SERP= function(){return false};

module.exports= {
    get_value,
    use_DOC,
    use_HTML,
    use_SERP
}