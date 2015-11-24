var req = require('request');
var cheerio = require('cheerio');
var iconv = require("iconv");
var async = require("async");
var sleep = require("sleep");

var pageOptions = [
    function() {
        return {
            uri:"https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserPublic",
            form:{
                TOKEN_KEY:"",
                ISSUBMIT:"ON",
                ActionType:"LOAD",
                BeanType:"rsv.bean.RSGU001BusinessLOAD",
                ViewName:"RSGU001",
                NextActionType:"NONE",
                NextBeanType:"NONE",
                NextViewName:"NONE"
            },
            encoding:null
        };
    },
    function(token) {
        return {
            uri:"https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserPublic",
            form:{
                TOKEN_KEY:token,
                ISSUBMIT:"ON",
                ActionType: "INIT",
                BeanType:"rsv.bean.RSGU301BusinessInit",
                ViewName:"RSGU301",
                NextActionType:"NONE",
                NextBeanType:"NONE",
                NextViewName:"NONE"
            }
        };
    },
    function(token) {
        return {
            uri: "https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserPublic",
            form: {
                TOKEN_KEY: token,
                ISSUBMIT:"ON",
                ActionType: "START",
                BeanType:"rsv.bean.RSGU302BusinessStart",
                ViewName:"RSGU302",
                RIYOUMOKUTEKI_CODE:1900,
                BUNRUI_CODE:2,
                RIYOUMOKUTEKI_NAME: toShiftjis("バスケットボール")
            }
        };

    }
];

var getToken = function(topPageSrc) {
    var $ = cheerio.load(topPageSrc);
    return $('input[name=TOKEN_KEY]').val();
};

var setCookie = function(topPageResponse) {
    var setCookies = topPageResponse.caseless.dict['set-cookie'];
    for (var i=0; i < setCookies.length; ++i) {
        req.cookie(setCookies[i]);
    }
};

var toShiftjis = function(v) {
    var i = new iconv.Iconv('UTF-8//TRANSLIT//IGNORE', 'shift-jis');
    return i.convert(v).toString();
}

var toUtf = function(body) {
    var conv = new iconv.Iconv('shift-jis','UTF-8//TRANSLIT//IGNORE');
    return conv.convert(body).toString();
};

var next, token = "", res = "",body = "", first = true;
async.series(pageOptions.map(function(v) {
    return function(callback) {
        next = v(token);
        if( !first ) {
            sleep.sleep(1);
        }
        first = false;
        req.post(next, function(e, r, b) {
            body = toUtf(b);
            token = getToken(body);
            setCookie(r);
            callback();
        });
    };
}), function(err, result) {
    console.log(body);
});

