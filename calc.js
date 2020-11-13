const utils = require('./utils/jsUtils');
const api_keys = require('./api_keys').keys;
const appid = keys.wolfram;
const url = 'http://api.wolframalpha.com/v2/';

 function calculate(expression) {
    return new Promise((resolve,reject) => {
        original_exp = expression;
        while(expression.includes('+')){
            expression = expression.replace('+','plus')
        }


        finalUrl = url + 'query?input=' + expression + '&appid='+appid + '&format=image,plaintext&output=JSON';
        utils.makeRequest("GET", finalUrl,null).then(responseText => {
            try{
                handledResponse = handleWolframResponse(responseText,original_exp);
                resolve(handledResponse);
            }
            catch(er){
                reject(new Error("Error when handling wolfram response"));
            }
            
        })
        .catch(er => reject(er))
     
    });
    
     
  }
 

   var handleWolframResponse = function(textResponse,exp) {     
       
              
            var obj = JSON.parse(textResponse);

            var resultObj = {};
            resultObj.input = exp;

            resultObj.imageurl = obj.queryresult.pods[0].subpods[0].img.src;
            
            let text = obj.queryresult.pods[0].subpods[0].plaintext;
            if(text.includes('=')){
                resultObj.result =text.substring(text.indexOf("=")+1);

            }else{
                var regExp = /[a-zA-Z]/g;                
                text = obj.queryresult.pods[1].subpods[0].plaintext;
                if (!regExp.test(text)){
                    resultObj.result = text;
                }
                else{
                    text = obj.queryresult.pods[2].subpods[0].plaintext;
                    resultObj.result = text;
                }               
            
            }
            
            return resultObj;
                     
            
        }
        
        
    



module.exports = { calculate }
