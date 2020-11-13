const default_tts_settings = require('../settings').tts;
const dbInterface = require('../dbInterface');


function handleVoiceChannelUpdate(oldState, newState,discordManager){
    chOld = oldState.channel;
    chNew = newState.channel;
    if(chOld === null && chNew !== null){
        let user = newState.member.user;        
        if(user.bot === false){
            let nickname = newState.member.nickname !== null ? newState.member.nickname : user.username;
            let vc = newState.member.voice.channel;
            

            let messages = [
                'Elo','Witaj','Znowu wbił ten zjeb'
            ]
            
            
            
            dbInterface.fetchUser(user.id.toString()).then(db_user => {
                let message = "";
                if(db_user === null){  
                    message = "Witaj panie pustynia czeka na ciebie."                
                    dbInterface.addMember(user.id.toString(), user.username.toString()).then(res=> {
                        discordManager.sendMessage(nickname + " witaj w bazie klanu maciuś.");
                    })
                } else {
                    message = messages[Math.floor(Math.random() * messages.length)] + ' ' + nickname;
                }
                 discordManager.readMessage(vc,message,default_tts_settings);
                
            }).catch(e => {
                console.log(e);
            })
        }
    }
    else if(chOld !== null && chNew === null){
       
    }
}

module.exports = {handleVoiceChannelUpdate}