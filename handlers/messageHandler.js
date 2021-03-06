const dbInterface = require('../dbInterface');
const translator = require('../translate')
const commandHandler = require('./commandHandler');
const glob = require("glob")
const prefix = '!';



function handleMessage(message,discordManager){
    if(message.author.bot){
        return;
    }
    
    var user_id = message.member.id.toString();   
    var username = message.member.user.username;
    var prefixes_to_check = [prefix,'-','_']
    var textchannel = message.channel;
    let vc = message.member.voice.channel;        
    let read = true;
    prefixes_to_check.forEach(element => {
        if(message.content.startsWith(element)){
            read = false;            
        }
    });
    if(read && vc){
        
        if(message.content.length >1 && !new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message)) {
            dbInterface.fetchUser(user_id).then(db_user => {
                
                if(db_user){
                    db_settings = db_user.settings;
                    if(db_settings.read){
                        
                                        
                        if(db_settings.translation.translate){
                            targetLan = db_settings.translation.target;
                           
                            translator.translateText(message.content,targetLan).then(responseText => {
                                response = JSON.parse(responseText);                                
                                translatedText = response.data.translations[0].translatedText;
                                
                                discordManager.readMessage(vc,translatedText,db_settings.tts); 
                            }).catch(er => {
                                discordManager.sendMessage(textchannel,er.toString());
                            });
                        }
                        else{                         
                            discordManager.readMessage(vc,message.content,db_settings.tts); 
                        }
                                               
                    }
                    
                }
            })
        }
    }
    if(!message.content.startsWith(prefix)){
        return;
    }     
    var mes = message.content.slice(1);
    
    var args = mes.substr(mes.indexOf(" ")+1);    
    var command = mes.substr(0,mes.indexOf(" "));
    
    if(command === ""){
        command = mes;
    }

    commandHandler.handleCommand(command,args,user_id,username).then(result => {
        if(result){
            if(result.message){
                discordManager.sendMessage(textchannel, result.message);
            }
            
        }
    }).catch(er => {
        console.log("Exception: " + er.message);
        // options is optional
        glob("audio/readonly/error/*.wav", function (er, files) {
            
            if(er){
                console.log(er);
            }else if(files){
                let filename = files[Math.floor(Math.random() * files.length)];
                if(filename){
                    discordManager.playAudio(vc,filename);     
                }
            }
        })

    })
    
    
    
}

module.exports = { handleMessage }