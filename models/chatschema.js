const mongoose  = require('mongoose');

const chatSchema = new mongoose.Schema({
    reciever: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    sender: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    Message: {
        type: String,
        required: true
    },
    timeDisplay : {
        type:Date,
        default: Date.now,
        required: true
    }
});

const chatting = mongoose.model('chat', chatSchema);

module.exports = chatting