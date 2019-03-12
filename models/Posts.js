var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }
});

var Posts = mongoose.model("Posts", PostSchema);

module.exports = Posts;