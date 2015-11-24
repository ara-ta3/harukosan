var req = require('request');
var cheerio = require('cheerio');
var iconv = require("iconv");

var topPageOptions = {
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

var getPlaceListPageOption = function(token) {
    return {
        uri:"https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserPublic",
        form:{
            TOKEN_KEY:token,
            ISSUBMIT:"ON",
            BeanType:"rsv.bean.RSGU301SBusinessInit",
            ViewName:"RSGU301",
            NextActionType:"NONE",
            NextBeanType:"NONE",
            NextViewName:"NONE",
            txtTiku:"NONE"
        }
    };

};

var loginPage = function(token) {
    return {
        uri:"https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserPublic",
        form:{
            TOKEN_KEY:token,
            ISSUBMIT:"ON",
            ActionType:"FromRSGU001",
            BeanType:"NONE",
            ViewName:"RSGU000",
            NextActionType:"INIT",
            NextBeanType:"rsv.bean.RSGU411BusinessInit",
            NextViewName:"RSGU411"
        },
        encoding:null
    };

};

var confirmPage = function(token) {
    return {
        uri:"https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserRestrict",
        form:{
            TOKEN_KEY:token,
            ISSUBMIT:"ON",
            ActionType:"INIT",
            BeanType:"rsv.bean.RSGU411BusinessInit",
            ViewName:"RSGU411",
        },
        encoding:null,
        headers: {
            'Referer': 'https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserPublic',
            'Content-Type': "application/x-www-form-urlencoded",
            "User-Agent": "bot"
        }

    };

};

var getReservePageOptionWithToken = function(token, year, month, startDay) {
    return {
        uri:"https://yoyaku.city.meguro.tokyo.jp/sports-user/mainservlet/UserPublic",
        form:{
            TOKEN_KEY:token,
            ISSUBMIT:"ON",
            ActionType:"SEARCH",
            BeanType:"rsv.bean.RSGU302BusinessSearch",
            ViewName:"RSGU302",
            NextActionType:"NONE",
            NextBeanType:"NONE",
            NextViewName:"NONE",
            txtTiku:"NONE",
            sltSISETU:1210,
            txtFRIYOUBIY:year,
            txtFRIYOUBIM:month,
            txtFRIYOUBID:startDay
        }
    };
};

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

var toUtf = function(body) {
    var conv = new iconv.Iconv('shift-jis','UTF-8//TRANSLIT//IGNORE');
    return conv.convert(body).toString();
};

var validateError = function(src) {
    var $ = cheerio.load(src);
    var imgs  = $('img');
    for (var i=0; i < imgs.length; ++i) {
        var img = imgs[i];
        if (img.attribs.alt == "このページは、エラーのページ、目黒区スポーツ施設予約システムです" ) {
            throw new Error("Requested to Error Page");
        }
    }
};

req.post(topPageOptions, function(error, res, body) {
    body = toUtf(body);
    setCookie(res);
    var token = getToken(body);

    var loginPageOption = loginPage(token);
    req.post(loginPageOption, function(error, res, body) {
        body = toUtf(body);
        setCookie(res);
        var confirmPageOption = confirmPage(token);
        console.log(body);
        req.post(confirmPageOption, function(error, res, body) {
            body = toUtf(body);
            validateError(body);
            console.log(body);
        });
    });
});
