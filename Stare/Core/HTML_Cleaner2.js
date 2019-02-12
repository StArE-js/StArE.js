//Remove HTML tags from string
const htt = require('cheerio-html-to-text');

function promesaLimpiarArchivo(str)
{
    return new Promise(function(resolve, reject){
        var text = htt.convert(str);
        resolve (text);
    });
};

module.exports={
    promesaLimpiarArchivo
};
