Simple discord bot
===
This project intention was to make a discord bot that will use** Google Text To Speech** so that if user writes a message to discord channel and a
bot will join him on his voice channel and read the message.

I decided to add a database so so every user could pick his favourite voice by typing a command, then I've added **google translate API**.  
![](https://i.imgur.com/wIjPW2o.png)

About
--
Every parameter is configurable, for example you can above settings by typing in text channel:   
`!set voice=id-ID-Standard-B pitch=3 gain=10 lan=ger`
Look for available voices at: https://cloud.google.com/text-to-speech/docs/voices  

To turn on/off reading type:    
`!read`  
To turn on/off translation type:  
`!translate`
Features  
--
- Every user has his own settings kept at server - bot creates a profile for him with his coresponding discord ID
- All audio generated messages are queued, so many users can type at once and still all the messages shall be played by bot, each one with its own settings  
- On error bot will send appropriate message to text channel

How it works 
--
1. User sents a message to chat, bot gets it and decides whether to process it by users settings.
2. If user settings specify target language a request is sent to google translate API
3. Message is sent to google TTS service and response (encoded audio) is saved on server.
4. Bot adds URL of the local file to the audio queue, and plays it.
5. When message was played it is deleted from server. 

Important 
--
You need to supply your google and discord API keys in api_keys.js file, in main folder, e.g:
```javascript
keys = {
    'discord' : 'x',
    'google' : 'x',    
}
module.exports = { keys}
