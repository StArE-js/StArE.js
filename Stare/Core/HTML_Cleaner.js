var fs = require('fs'); //Para leer archivos
const rp = require('request-promise');


//AUX FUNCTIONS
let PromesaEC= function(archivo){
    return new Promise(function(resolve, reject){
        archivo.toLowerCase();
        var start= 0;
        var end=0;
        while(start != -1){
            if(start!=0) start=start+1;
            start=archivo.indexOf('<!--', start);
            //calcula la pocisión del tag de cierre.
            if(start!=-1) {
                end= archivo.indexOf('-->', start);
                archivo= archivo.substring(0, start) + archivo.substring(end+3);
            }
        }
        resolve(archivo);
    });
};
let PromesaTT= function(archivo){
    return new Promise(function(resolve, reject){
        archivo.toLowerCase();
        var EtiquetasTexto= ['<p>', '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>', '<h7>', '<title>',
            '<p ', '<h1 ', '<h2 ', '<h3 ', '<h4 ', '<h5 ', '<h6 ', '<h7 ', '<title '];
        var EtiquetasTextoCierre= ['</p', '</h1', '</h2', '</h3', '</h4', '</h5', '</h6', '</h7', '</title'];
        var TextoLimpio="";
        var parrafo= 'p';
        var start= 0;
        var end=0;
        var cierre=0;
        while(start != -1){
            if(start!=0)
                start= start +1;
            var next=Number.MAX_SAFE_INTEGER;
            var aux=0;
            var tag=-1;
            //Busca la proxima etiqueta de la lista.
            for(k in EtiquetasTexto){
                aux=archivo.indexOf(EtiquetasTexto[k], start);
                if((aux>=0) && (aux<next)) {
                    tag=k;
                    next= aux;
                }
            }
            //calcula la pocisión del tag de cierre.
            if(tag!=-1) {
                if(tag>8)tag=tag-9;
                start = next;
                cierre = archivo.indexOf('>', start) + 1;
                end = archivo.indexOf(EtiquetasTextoCierre[tag], start);
                if((end-500)> cierre){
                    end= cierre+500;
                }
                TextoLimpio = TextoLimpio + archivo.substring(cierre, end) + '\n';

            }else{
                start= -1}
        }
        resolve (TextoLimpio);
    });
};
let PromesaDT= function(archivo){
    return new Promise(function(resolve, reject){
        archivo= archivo.toLowerCase();
        var EtiquetasTexto= ['<a>', '<bloquote>', '<q>', '<sup>', '<sub>', '<pre>', '<del>', '<cite>', '<dfn>', '<acronym>', '<abbr>', '<samp>',
            '<kbd>', '<var>', '<ins>', '<li> ', '<ul>', '<img>', '<strong>', '<label>',
            '<a ', '<bloquote ', '<q ', '<sup ', '<sub ', '<pre ', '<del ', '<cite ', '<dfn ', '<acronym ', '<abbr ', '<samp ',
            '<kbd ', '<var ', '<ins ', '<li ', '<ul ', '<img ', '<strong ', '<label ', '</a', '</bloquote', '</q', '</sup',
            '</sub', '</pre', '</del', '</cite', '</dfn', '</acronym', '</abbr', '</samp','</kbd', '</var', '</ins', '</li ',
            '</ul', '</img', '</strong', '</label', '<span>', '<span ', '</span', '<br', '<br>', '</br', '<small ', '</small', '<small>',
            '<input ', '<ifame ', '</iframe', '<iframe ', '<textarea ', '</textarea', '<textarea>', '<b>', '</b', '<b ', '<code ',
            '<code>', '</code>', '<em ', '<em>', '</em', '<button ', '</button', '<button>', '<i ', '</i', '<i>'];
        var start= 0;
        var cierre=0;
        var largo= archivo.length;
        var texto="";

        for(k in EtiquetasTexto){
            start=0;
            while((start!= -1) && (start<=largo)){
                start= start +1;
                start=archivo.indexOf(EtiquetasTexto[k], start);
                if(start != -1){
                    cierre = archivo.indexOf('>', start);
                    texto = archivo.substring(0, start).toString()+ archivo.substring(cierre+1).toString();
                    if(texto.length < largo){
                        //En caso de que no este cerrada la tag, lo que hace que se repita texto.
                        largo= texto.length;
                        archivo=texto;
                    }

                };
            };
        };

        resolve(archivo);

    });
};

//GET THE TEXT FROM DE HTML
let PromesaGetText= function(input){
    return new Promise(function(resolve, reject){
        PromesaEC(input)
            .then(
                function (file) {return PromesaTT(file);})
            .then(
                function (file) {return PromesaDT(file);})
            .then(
                function (file) {
                    resolve(file);
                });
    });
};


let promesaLimpiarArchivo= function(archivo){
    return new Promise(function(resolve, reject){
        PromesaGetText(archivo).then(function (file) {
            file = file.replace(/(<([^>]+)>)/g, "");
            resolve(file);
        });
    });
};


module.exports = {
    promesaLimpiarArchivo
};
