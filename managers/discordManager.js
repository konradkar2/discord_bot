const Discord = require('discord.js');
const ReadingManager  = require('./readingManager').ReadingManager;

const messageHandler = require('../handlers/messageHandler');
const voiceChannelHandler = require('../handlers/voiceChannelHandler');


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
        if(!vc  && !this.readingManager){
            return;
        }
        else if(!this.readingManager){
            
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
    sendMessage(textchannel,message){ //text or discord Embed message
                 
        textchannel.send(message).catch(er => {
            console.error(er);
        });   
       
        
    }
   
}


module.exports = { DiscordManager }