var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    source: String,
    url: String,
    title: String,
    date: String,
    time: String,
    timestamp: Number,
    summary: String,
    category: String,
    image: String, 
    comments: [{
        userID: mongoose.SchemaTypes.ObjectId,
        body: String,
        createdAt: Date,
        updatedAt: Date,
        likes: [],
        dislikes: [],
        replies: [{
            userID: mongoose.SchemaTypes.ObjectId,
            body: String,
            createdAt: Date,
            updatedAt: Date,
            likes: [],
            dislikes: [],
        }]
    }],
    likes: [],
    dislikes: []
});


// Export the model
module.exports = mongoose.model('Product', ArticleSchema);