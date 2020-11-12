var MongoClient = require('mongodb').MongoClient;
var tts_settings = require('./settings')
var url = "mongodb://localhost:27017/mydb"; 

var fetchUser = function(user_id){
    return new Promise((resolve,reject)=>{
       MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            
            var query = { id: user_id };
            
            dbo.collection("members").findOne(query)
                .then(result => {
                    if(err) reject(err)
                    else resolve(result);

                    db.close();
                })
                                  
                    
          });
    });
   
}
function addMember(user_id,_username){
    return new Promise((resolve,reject) =>
    {            
                   
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var myobj = { id: user_id,
                 username: _username,
                 settings : { read: false, translation: { translate : false, target:  "en"}, tts: tts_settings.tts} 
                };
            dbo.collection("members").insertOne(myobj, function(err, res) {
                    if(err) reject(err)
                    else resolve(res)
                    db.close();
            });
        });        
         
    });

}
function updateUserSettings(user_id,settings){
    return new Promise((resolve,reject) =>
    {       
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var query = { id: user_id };
            var newvalues = { $set: {settings: settings } };
            dbo.collection("members").updateOne(query, newvalues, function(err, res) {
            
              if (err) reject(err)
              else resolve(res)
              
              db.close();
            });
          });
    });
}
//addMember('123456').then(res =>{
//    console.log(res.ops);
//})

module.exports = { fetchUser, addMember, updateUserSettings}




