const Reading = require ('./readingManager');
const Discord = require('discord.js');
const { ReadingManager } = require('./readingManager');

const messageHandler = require('../handlers/messageHandler');
const voiceChannelHandler = require('../handlers/voiceChannelHandler');
const api_keys = require('../api_keys').keys;

class DiscordManager{
    constructor(bot_token){
        this.client = new Discord.Client();
        this.client.login(bot_token);

        this.readingManager = null;

        this.client.once('ready',() => {
            //console.log(this.client.guilds);
        })                
                
        this.client.on('voiceStateUpdate', (oldState, newState) => {
            
            voiceChannelHandler.handleVoiceChannelUpdate(oldState,newState,this);
            
        });
        
        this.client.on('message',message =>{            
                 messageHandler.handleMessage(message,this);
            
        })  

    }
    setVoiceChannel(voice_channel) {
        this.readingManager = new ReadingManager(voice_channel);
    }
    isReadingManagerOnline() {
        return this.readingManager !== null;
    }
    readMessage(messageText,tts_settings){
        this.readingManager.readMessage(messageText,tts_settings);
    }
    sendMessage(message){ //text or discord Embed message
        try{            
            this.client.channels.cache.get(api_keys.macius).send(message);   
        }
        catch(er){
            console.log(er);
        }
        
    }
   
}


module.exports = { DiscordManager }