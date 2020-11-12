const Discord = require('discord.js');
const calc  = require('./calc');
const tts = require('./tts')
const default_tts_settings = require('./settings').tts;
const dbInterface = require('./dbInterface');
const readingManager = require('./readingManager');
const translator = require('./translate')
const client = new Discord.Client();
var api_keys = require('./api_keys').keys;

const prefix = '!';

const macius = api_keys.macius;
const discord_server = api_keys.discord;

client.login(discord_server);

var rManager;

client.once('ready',() => {
    
})
var sendMessage = function(message){
    
    client.channels.cache.get(macius).send(message);   
}
var getCalcResultAndSendIt = function(result){

    if(result){
        const messageEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setThumbnail(result.imageurl)
        .addFields(
            { name: 'Input', value: result.input },
            { name: 'Result', value: result.result },
         );
        
         sendMessage(messageEmbed);         
    }

}



client.on('voiceStateUpdate', (oldState, newState) => {
    chOld = oldState.channel;
    chNew = newState.channel;
    if(chOld === null && chNew !== null){
        let user = newState.member.user;        
        if(user.bot === false){
            let nickname = newState.member.nickname !== null ? newState.member.nickname : user.username;
            let VC = newState.member.voice.channel;
            if(!rManager){
                rManager = new readingManager.ReadingManager(VC);
            }
            

            let messages = [
                'Elo','Witaj','Znowu wbił ten zjeb'
            ]
            
            
            
            dbInterface.fetchUser(user.id.toString()).then(db_user => {
                let message = "";
                if(db_user === null){  
                    message = "Witaj panie pustynia czeka na ciebie."                
                    dbInterface.addMember(user.id.toString(), user.username.toString()).then(res=> {
                        sendMessage(nickname + " witaj w bazie klanu maciuś.");
                    })
                } else {
                    message = messages[Math.floor(Math.random() * messages.length)] + ' ' + nickname;
                }
                rManager.readMessage(message,default_tts_settings);
                
            })
        }
    }
    else if(chOld !== null && chNew === null){
       
    }
  });


client.on('message', async message =>{
    if(message.author.bot){
        return;
    }
    
    var user_id = message.member.id.toString();   
    var username = message.member.user.username;
    var prefixes_to_check = [prefix,'-','_']
    let read = true;
    prefixes_to_check.forEach(element => {
        if(message.content.startsWith(element)){
            read = false;            
        }
    });
    if(read){
        
        if(message.content.length >1 && !new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message)) {
            dbInterface.fetchUser(user_id).then(db_user => {
                
                if(db_user){
                    db_settings = db_user.settings;
                    if(db_settings.read){
                        if(!rManager){
                            rManager = new readingManager.ReadingManager(message.member.voice.channel);
                        }
                        if(db_settings.translation.translate === true){
                            targetLan = db_settings.translation.target;
                           
                            translator.translateText(message.content,targetLan, res => {
                                response = JSON.parse(res);                                
                                translatedText = response.data.translations[0].translatedText;
                               rManager.readMessage(translatedText,db_settings.tts); 
                            });
                        }
                        else{                         
                            rManager.readMessage(message.content,db_settings.tts); 
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

    switch(command){
        case 'poka':
            var arg = args.toLowerCase().trim();    
            if(arg === 'huja'){
                message.channel.send('https://www.youtube.com/playlist?list=PLv0Kl50jfz-KKYjFie23aJM5Cu_JC8gPy');
            }
            break;
        case 'calc':
            while(args.includes('emo')){
                args = args.replace("emo","14");          
            }        
            calc.calculate(args,getCalcResultAndSendIt);     
            break;

        case 'settings':
                dbInterface.fetchUser(user_id).then(db_user => {
                if(db_user){
                    try{
                        let db_settings_tts = db_user.settings.tts;
                        let voice  = db_settings_tts.voice.name;
                        let pitch = db_settings_tts.audioConfig.pitch;
                        let rate = db_settings_tts.audioConfig.speakingRate;
                        let gain = db_settings_tts.audioConfig.volumeGainDb;
                        let target = db_user.settings.translation.target;

                        const messageEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(username +"' TTS settings.")
                        .setURL('https://cloud.google.com/text-to-speech/docs/voices')
                        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Windows_Settings_app_icon.png/600px-Windows_Settings_app_icon.png')
                        .addFields(
                            { name: 'Voice', value: voice },
                            { name: 'Pitch [-20 - 20]', value: pitch },
                            { name: 'Rate [0.25 - 4]', value: rate },
                            { name: 'Gain [-96.0 - 16][dB]', value: gain },
                            { name: 'Target language', value: target}

                        );
                        sendMessage(messageEmbed);
                    }
                    catch(err){
                        console.log(err);
                    }
                    
                }
                });          
                break;
            case 'read':                
                dbInterface.fetchUser(user_id).then(db_user =>{
                    let db_settings = db_user.settings;
                    db_settings.read = !db_settings.read;
                    dbInterface.updateUserSettings(user_id,db_settings).then(res => {
                        let message = db_settings.read == true ? 'Czytanko włączone' : 'Czytanko wyłączone';
                        sendMessage(message + ' dla ' +username);
                    })
                });
            break;
            case 'translate':                
                dbInterface.fetchUser(user_id).then(db_user =>{
                    let db_settings = db_user.settings;
                    db_settings.translation.translate = !db_settings.translation.translate;
                    dbInterface.updateUserSettings(user_id,db_settings).then(res => {
                        let message = db_settings.translation.translate == true ? 'Translacja włączona' : 'Translacja wyłączona';
                        sendMessage(message + ' dla ' +username);
                    })
                });
            break;
            case 'set':
                dbInterface.fetchUser(user_id).then(db_user => {
                    if(db_user){
                        try{
                            let db_settings = db_user.settings;
                            let toSet = args.split(" ");
                            
                            toSet.forEach(element => {
                                let current = element.split('=');
                                let key = current[0].toLowerCase();
                                let value = current[1];
                                
                                switch(key){
                                    case 'voice':       
                                                        
                                        db_settings.tts.voice.name = value;
                                        db_settings.tts.voice.languageCode = value.substring(0,5);
                                    break;
                                    case 'pitch': 
                                        db_settings.tts.audioConfig.pitch = value;
                                    break;
                                    case 'rate': 
                                        db_settings.tts.audioConfig.speakingRate = value;
                                    break;
                                    case 'gain': 
                                        db_settings.tts.audioConfig.volumeGainDb = value;
                                    break;
                                    case 'target':
                                        db_settings.translation.target = value;
                                    break;

                                }
                            });
                            
                            dbInterface.updateUserSettings(user_id,db_settings).then(res => {
                                console.log('Zmieniono ustawienia dla: ' + username);
                            })
                        }
                        catch(error) {
                            console.log(error);
                        }
                    }
                });
                
            break;
            case 'default':
                dbInterface.fetchUser(user_id).then(db_user =>{
                    
                    let db_settings = db_user.settings;
                    db_settings.tts = default_tts_settings;
                    dbInterface.updateUserSettings(user_id,db_settings).then(res =>{
                        console.log("Ustawiono domyślny tts dla: " + username);
                    })
                });

    }
         
    
    
  
})


