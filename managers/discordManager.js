const Discord = require('discord.js');
const AudioManager  = require('./audioManager').AudioManager;

const messageHandler = require('../handlers/messageHandler');
const voiceChannelHandler = require('../handlers/voiceChannelHandler');


class DiscordManager{
    constructor(bot_token){
        this.client = new Discord.Client();
        this.client.login(bot_token);

        this.audioManager = null;

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
    setAndVerifyVoiceChannel(vc){
        if(!vc  && !this.audioManager){
            return false;
        }
        else if(!this.audioManager){
            
            this.audioManager = new AudioManager(vc, () => {                
                this.audioManager = null;
            });
            return true;
        }        
        else if(vc.id !== this.audioManager.vc.id){
            this.sendMessage("Someone is already using bot in different channel.");
            return false;
        }
        return true;
    }
    readMessage(vc,messageText,tts_settings){
        
        if(this.setAndVerifyVoiceChannel(vc)){
            this.audioManager.readMessage(messageText,tts_settings)    
        }
         
               
        
     }
     playAudio(vc,filename){
        if(this.setAndVerifyVoiceChannel(vc)){
            this.audioManager.playAudio(filename);
        }

     }
    sendMessage(textchannel,message){ //text or discord Embed message
                 
        textchannel.send(message).catch(er => {
            console.error(er);
        });   
       
        
    }
   
}


module.exports = { DiscordManager }