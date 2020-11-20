const Discord = require('discord.js');
const dbInterface = require('../dbInterface');
const calc = require('../calc');
const default_tts_settings = require('../settings').tts;

function handleCommand(command,args,user_id,username){
    return new Promise((resolve,reject) => { 
        let data = {
            message: "",
            audio: ""
        }
        switch(command){
            case 'poka':
                var arg = args.toLowerCase().trim();    
                if(arg === 'huja'){
                    data.message =  'https://www.youtube.com/playlist?list=PLv0Kl50jfz-KKYjFie23aJM5Cu_JC8gPy';
                    resolve(data);
                }
                break;
            case 'calc':
                while(args.includes('emo')){
                    args = args.replace("emo","14");          
                }        
                calc.calculate(args).then(result => {
                    const messageEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setThumbnail(result.imageurl)
                    .addFields(
                        { name: 'Input', value: result.input },
                        { name: 'Result', value: result.result },
                    );
                    data.message = messageEmbed;
                    resolve(data);
                }).catch(er => reject(er));  
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
                                data.message = messageEmbed;
                                resolve(data);
                            }
                            catch(err){
                                reject(new Error("Error when getting user settings"));
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
                            data.message = message + ' dla ' +username;
                            resolve(data);
                          
                        })
                    });
                break;
                case 'translate':                
                    dbInterface.fetchUser(user_id).then(db_user =>{
                        let db_settings = db_user.settings;
                        db_settings.translation.translate = !db_settings.translation.translate;
                        dbInterface.updateUserSettings(user_id,db_settings).then(res => {
                            let message = db_settings.translation.translate == true ? 'Translacja włączona' : 'Translacja wyłączona';
                            data.message = message + ' dla ' +username;
                            resolve(data);
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

                                    if(value === null || value === '' || value === undefined){
                                        throw new Error(key + " empty or null error.");
                                    }
                                    let cases = ['voice','pitch','rate','gain','target'];
                                    if(!cases.includes(key)){
                                        throw new Error(key + " empty or null error.");
                                    }
                                    
                                    switch(key){
                                        case null:
                                            throw new Error(key + " empty or null error.");                                       
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
                                    data.message = 'Zmieniono ustawienia dla: ' + username
                                    resolve(data);                                  
                                    
                                })
                            }
                            catch(error) {
                                reject(new Error("Error when handling user settings, " + error.message));
                            }
                        }
                    });
                    
                break;
                case 'mapa':
                    data.message = 'https://gamewith-en.akamaized.net/img/original_e1499395800d1d1a15d0d6c810ac783d.jpg';
                    resolve(data);
                case 'default':
                    dbInterface.fetchUser(user_id).then(db_user =>{
                        
                        let db_settings = db_user.settings;
                        db_settings.tts = default_tts_settings;
                        dbInterface.updateUserSettings(user_id,db_settings).then(res =>{
                            data.message = "Ustawiono domyślny tts dla: " + username;
                            resolve(data);
                        })
                    });

        }
    })
}

module.exports = { handleCommand }