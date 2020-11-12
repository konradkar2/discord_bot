const utils = require('./utils');
const fs = require('fs');
const api_keys = require('./api_keys').keys;


var key = api_keys.google;
var method = 'POST'
var url = 'https://texttospeech.googleapis.com/v1/text:synthesize'

var finalUrl = url +'?key=' +key;


  function textToSpeech(text,settings,callback){
    
    settings.input.text = text;
    bodyStr= JSON.stringify(settings);  
    
    utils.makeRequest(method,finalUrl,bodyStr,function(textResponse){
      receiveEncodedHandler(textResponse,callback);
    })
  }

  var receiveEncodedHandler = function  (encoded_mp3,callback){
    jsonObj = JSON.parse(encoded_mp3)
    
    decoded_mp3 = jsonObj.audioContent;
   
    filename = 'audio/'+utils.makeId(10) +'.mp3';

    fs.writeFile(filename,decoded_mp3, 'base64',function(err){
      if(!err){
        callback(filename)
      }
    })
  }


  module.exports = { textToSpeech }