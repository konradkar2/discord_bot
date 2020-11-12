
const tts = require('./tts')

// user_id,message

function deleteFile(file){

}

class ReadingManager {
    constructor(vc) {
      this.vc = vc;    
      this.messagesToRead = [];
      this.playing = false;
      this.connection = null;
    }
    
    readMessage(message,tts_settings){         
        let me = this;
        tts.textToSpeech(message + '.',tts_settings,function(path){            
            me.messagesToRead.push(path);
            if(!me.playing){
                me.joinAndPlayAudio();
            }
        
        });
    }
    playNext(){
        if(!this.connection){
            return;
        }
        console.log(this.messagesToRead);
        this.playing = true;
        let file = this.messagesToRead.shift();
        const dispatcher = this.connection.play(file);
        dispatcher.on("finish", end =>{
            if(this.messagesToRead.length > 0){            
            this.playNext()
            }
            else{
                this.vc.leave();
                this.playing = false;
            }
        })
    }
    joinAndPlayAudio() {
        this.playing = true;
        let vc = this.vc;
        if(vc){
            vc.join()
            .then(connection => {
                this.connection = connection;
                let file = this.messagesToRead.shift();            
                const dispatcher = connection.play(file);
                dispatcher.on("finish", end => {
                    if(this.messagesToRead.length > 0){                    
                        this.playNext()
                    }
                    else{
                        this.playing = false;
                        vc.leave();
                    }
                
                });                        
                            
                
            })
            .catch(console.error);
        }
    }
    
  }



    


module.exports = { ReadingManager }
