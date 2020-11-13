
const tts = require('../tts')

// user_id,message

function deleteFile(file){

}

class ReadingManager {
    constructor(vc,callback) {
      this.vc = vc;    
      this.messagesToRead = [];
      this.playing = false;
      this.connection = null;
      this.doneCallback = callback;
    }
    
    readMessage(message,tts_settings){  
        tts.textToSpeech(message + '.',tts_settings).then(filename =>{            
            this.messagesToRead.push(filename);
            if(!this.playing){
                this.joinAndPlayAudio();
            }
    
        }).catch(er => console.log(er));
         
    }
    playNext(){
        if(!this.connection){
            return;
        }
       
        this.playing = true;
        let file = this.messagesToRead.shift();
        const dispatcher = this.connection.play(file);
        dispatcher.on("finish", end =>{
            if(this.messagesToRead.length > 0){            
            this.playNext();
            }
            else{
                this.vc.leave();
                this.playing = false;
                this.doneCallback();
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
                        this.doneCallback();
                    }
                
                });                        
                            
                
            })
            .catch(console.error);
        }
    }
    
  }



    


module.exports = { ReadingManager }
