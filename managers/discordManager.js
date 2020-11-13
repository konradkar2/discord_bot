const Discord = require('discord.js');
const ReadingManager  = require('./readingManager').ReadingManager;

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
    
    readMessage(vc,messageText,tts_settings){
        if(!this.readingManager){
            
            this.readingManager = new ReadingManager(vc, () => {                
                this.readingManager = null;
            });
        }
        else if(vc.id !== this.readingManager.vc.id){
            this.sendMessage("Someone is already using bot in different channel.");
            return;
        }
        
        this.readingManager.readMessage(messageText,tts_settings)
               
            
            
           
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