const utils = require('./utils/jsUtils');
const fs = require('fs');
const api_keys = require('./api_keys').keys;


var key = api_keys.google;
var method = 'POST'
var url = 'https://texttospeech.googleapis.com/v1/text:synthesize'

var finalUrl = url +'?key=' +key;


  function textToSpeech(text,settings){
    return new Promise((resolve,reject) => {
      settings.input.text = text;
      bodyStr= JSON.stringify(settings);  
      
      utils.makeRequest(method,finalUrl,bodyStr).then(textResponse =>{        
        receiveEncodedHandler(textResponse).then(filename => {
          resolve(filename);
        }).catch(er =>{
          reject(er);
        })
      
      })
      .catch(er => {
        reject(er);
      })
    });
    
    
  }

  var receiveEncodedHandler = function  (encoded_mp3){
    return new Promise((resolve, reject ) => {
      
      jsonObj = JSON.parse(encoded_mp3)
      
      decoded_mp3 = jsonObj.audioContent;
    
      filename = 'audio/tts/'+utils.makeId(10) +'.mp3';

      fs.writeFile(filename,decoded_mp3, 'base64',function(err){
        if(!err){
             resolve(filename)
        }
        else {
          reject(err);
        }
      })
    });
    
  }


  module.exports = { textToSpeech }