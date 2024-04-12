const chats = require('../models/chatschema')

module.exports = {
    postchats : async (message,reciever, sender) => {
        const chat = new chats({
            Message: message,
            reciever,
            sender
        });
        
        await chat.save()
        console.log('added to database')
    }
}