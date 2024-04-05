const chats = require('../models/chatschema')

module.exports = {
    postchats : async (message,reciever, sender) => {
        const chat = new chats({
            message,
            reciever,
            sender
        });
        await chat.save()
    }
}