var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function makeRequest(method, url,body) {   
    return new Promise((resolve,reject) => {
        let xhr = new XMLHttpRequest();
        
        xhr.open(method, url,true);    
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {                
                resolve(xhr.responseText);
            } else {
                reject("Error when handling HTTP request to 3rd party - " + xhr.status);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);

        if(body){
            xhr.send(body);
        }
        else{
            xhr.send();
        } 
    });
    


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
