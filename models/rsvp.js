const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    connection: {type: Schema.Types.ObjectId, ref: 'Connection'},
    status: {type: String, required: [true, 'cannot be empty'],
        match: ['Yes', 'Maybe', 'No']}
});

module.exports = mongoose.model('Rsvp', rsvpSchema);