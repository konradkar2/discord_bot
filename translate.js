const utils = require('./utils/jsUtils');
const fs = require('fs');
const api_keys = require('./api_keys').keys;
var key = api_keys.google;
var method = 'POST'
var url = 'https://translation.googleapis.com/language/translate/v2'
var finalUrl = url +'?key=' + key; 

function translateText(text,targetLan){
    return new Promise((resolve,reject)=> {
        body = {
            "q" : text,
            "target": targetLan,
            "model": "nmt",
            "format" : "text"
        }
        bodyStr = JSON.stringify(body);
        
        utils.makeRequest(method,finalUrl,bodyStr).then( data => {
            resolve(data)
        }).catch( er => reject(er));
    });
    
}


module.exports = { translateText }