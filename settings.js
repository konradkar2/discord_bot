tts = {    
    "input":{
      "text": "none"
    },
    "voice":{
      "languageCode":"pl-PL",
      "name":"pl-PL-Standard-B",      
    },
     "audioConfig":{
      "audioEncoding": 'MP3',
      "speakingRate": '1',
      "pitch": '0',
      "volumeGainDb": '0',      
    }
  }
function whatIsIt(object) {
  if (object === null) {
      return "null";
  }
  if (object === undefined) {
      return "undefined";
  }
  if (object.constructor === stringConstructor) {
      return "String";
  }
  if (object.constructor === arrayConstructor) {
      return "Array";
  }
  if (object.constructor === objectConstructor) {
      return "Object";
  }
  {
      return "don't know";
  }
}



  module.exports = { tts }