const utils = require('./utils');
const fs = require('fs');
const api_keys = require('./api_keys').keys;
var key = api_keys.google;
var method = 'POST'
var url = 'https://translation.googleapis.com/language/translate/v2'
var finalUrl = url +'?key=' + key; 

function translateText(text,targetLan,callback){
    body = {
        "q" : text,
        "target": targetLan,
        "model": "nmt",
        "format" : "text"
    }
    bodyStr = JSON.stringify(body);
    
    utils.makeRequest(method,finalUrl,bodyStr,function(textResponse){
        callback(textResponse);
      })
}


module.exports = { translateText }