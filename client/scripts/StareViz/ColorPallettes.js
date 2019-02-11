var color5Lv_A=["#59f442","#c1f441","#eef441","#f4b841","#f44141"];

var color3Lv_A=["#59f442","#eef441","#f44141"];

var color5LvBS_A=["#01a010", "#96cc9b", "#c6b1d1", "#ca63ff", "#7913ad"];

var color3LvBS_A=["#96cc9b", "#a29fa3", "#ca63ff"];

var blindsafe=false;

var get_Pallette=function(option, blidsafe){
    if (blidsafe){
        switch(option){
            case A5:
                return color5LvBS_A;
                break;
            case A3:
                return color3LvBS_A;
        };
    }
    else{
        switch(option){
            case A5:
                return color5Lv_A;
                break;
            case A3:
                return color3Lv_A;
        };
    }
};

module.exports={
    get_Pallette
};
