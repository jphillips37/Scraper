var path = require("path");
var mongoose = require("mongoose");
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

let savedPosts = [];
let postList = {};

module.exports = function(app){
    app.get("/", function(req, res){
        db.Posts.find({}).then(function(dbPost){
            for(i=0; i < dbPost.length; i++){ 
                var postObject = {
                    title: dbPost[i].title,
                    link: dbPost[i].link,
                    body: dbPost[i].body,
                    postId: dbPost[i]._id
                };
                //console.log(dbPost[i].postBody);

                if(!savedPosts.find( element => element.title === postObject.title)){
                    savedPosts.push(postObject);
                }
                
            }
            console.log(savedPosts);

            postList.posts = savedPosts;

            if(dbPost.length > 0){
                res.render("index", postList);
            }
            else {
                res.render("index", {})
            }
        });        
    });

    app.get("/scrape", function(req, res){
        axios.get("https://www.npr.org/sections/news/").then(function(response){
            let $ = cheerio.load(response.data);

            var results = [];
            var articles = {};

            $("div.item-info").each(function(i, element){
                articles.title = $(this).children("h2").text().trim();
                articles.link = $(this).children("h2").children("a").attr('href');
                articles.body = $(this).children("p").text();
                //console.log(articles);

                if(!savedPosts.find( element => element.title === articles.title)){
                    db.Posts.create(articles)
                    .then(function(dbPosts){
                        console.log(dbPosts);
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                };
                
            }); 
                          
        });
        res.send("scrape Complete");
    });

    app.post("/posts/:id", function(req, res){
        db.Comments.create(req.body)
        .then(function(dbComment){
            return db.Posts.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function(dbPosts){
            res.json(dbPosts);
        })
        .catch(function(err){
            res.json(err);
        })
    })
}