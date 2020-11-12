var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function makeRequest(method, url,body,callback) {   
    
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        
        if (xhr.readyState == 4) {   
            callback(xhr.responseText);
            
        }
    };
    xhr.open(method, url,true);    
    if(body){
        xhr.send(body);
    }
    else{
        xhr.send();
    } 


}
function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

module.exports = { makeRequest , makeId}
