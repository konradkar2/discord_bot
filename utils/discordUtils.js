

var sendMessage = function(client,channel_id,message){
    
    client.channels.cache.get(channel_id).send(message);   
}


module.exports = { sendMessage}