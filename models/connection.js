const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    topic: {type: String, required: [true, 'topic is required']},
    name: {type: String, required: [true, 'name is required']},
    location: {type: String, required: [true, 'location is required']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    description: {type: String, required: [true, 'description is required'], 
                minLength: [10, 'the description should have at least 10 characters']},
    date: {type: String, required: [true, 'date is required']},
    startTime: {type: String, required: [true, 'startTime is required']},
    endTime: {type: String, required: [true, 'endTime is required']},
    image: {type: String, required: [true, 'image is required']}
},
);

module.exports = mongoose.model('Connection', connectionSchema);
