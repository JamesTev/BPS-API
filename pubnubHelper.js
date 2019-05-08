var PubNub = require('pubnub');
let pubnub = "";

   
pubnub = new PubNub({
    publishKey : 'pub-c-3a435a19-3855-453a-85c2-6df1ece3f54c',
    subscribeKey : 'sub-c-353ccd88-5c41-11e9-94f2-3600c194fb1c'
})
    
exports.pubnubMessage = function(msgObj) {
    var publishConfig = {
        channel : "ch1",
        message : {
            title: msgObj.title,
            description: msgObj.description
        }
    }
    pubnub.publish(publishConfig, function(status, response) {
        console.log(status, response);
    })
}