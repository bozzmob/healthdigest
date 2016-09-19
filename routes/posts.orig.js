require("babel-core/register");
require("babel-polyfill");
require("babel-register");
var deployconf = require(".././config/deployconf.js");
var dbconf = null;

if(deployconf.instance == "local"){
    dbconf = require(".././config/dbconflocal.js");    
}
else if(deployconf.instance == "heroku"){
    dbconf = require(".././config/dbconfheroku.js")
}


var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


exports.hd = async function(req, res) {
    console.log("testing calls");
    var x = await getRandomInt();
    try {
        res.send(""+x);
        // x.then(function(val){
        //     res.send(x);
        // }).catch(err){
        //     console.log("error");
        // }

        // getContentByCategory('Yo').then(function(val) {
        //     //resolve(val);
        //     console.log("val " + JSON.stringify(val));
        //     res.send(val);
        // }).catch(function(err) {
        //     reject(err);
        // });
    } catch (err) {
        console.log("Exception from promise " + err);
    }
}

function getRandomInt() {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}

async function getContentByCategory(category) {
    console.log("get " + category + " Data");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        let collection = db.collection(category);
        return (await transformIDvalue(await (collection.find({},{limit:1}).toArray()), category));
        //{skip:1, limit:1, fields:{b:1}}
    } finally {
        db.close();
    }
}

async function transformIDvalue(postArray,category){
    for (var i = 0; i < postArray.length; i++) {
        postArray[i]._id = dbconf.postidToCategoryMap.indexOf(category)+'-'+postArray[i]._id;
    }
    return postArray;
}

exports.getLatestContent = async function(req, res) {
    var postRespObj = {};
    console.log(JSON.stringify(dbconf.mongodb));
    Promise.all([
        getContentByCategory(dbconf.mongodb.collection.latest),
        getContentByCategory(dbconf.mongodb.collection.health),
        getContentByCategory(dbconf.mongodb.collection.fitness),
        getContentByCategory(dbconf.mongodb.collection.living),
        getContentByCategory(dbconf.mongodb.collection.news)
    ])
    .then(([latest, health, fitness, living, news]) => {
        postRespObj.latest = latest;
        postRespObj.health = health;
        postRespObj.fitness = fitness;
        postRespObj.living = living;
        postRespObj.news = news;
        res.send(postRespObj);
    })
    .catch(err => {
        console.log("error"+err);
        res.send("error");
    });
}

async function getPostByIdFromDB(postMetadata) {
    //console.log("set postID");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        var collectionName = dbconf.postidToCategoryMap[postMetadata[0]];
        var postID = postMetadata[1];
        let collection = db.collection(collectionName);
        console.log("postID "+postID+" collectionName "+collectionName);
        return (await collection.find({_id:ObjectId(postID)}).toArray());
        } finally {
        db.close();
    }
}

exports.getPostById = async function(req, res) {
    var postRespObj = {};
    var postMetadata = (req.body.postID).split("-");
    console.log(postMetadata);
    getPostByIdFromDB(postMetadata).then((postData) => {
        res.send({"status":"success","post":postData});
        //console.log("success "+postData);
    })
    .catch(err => {
        res.send({"status":"failure"});
        console.log("error"+err);
    });
}

async function createNewPost(postData,categoryID) {
    //console.log("set postID");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        var collectionName = dbconf.postidToCategoryMap[categoryID];
        let collection = db.collection(collectionName);
        console.log("collectionName "+collectionName);
        var insertID;
        try {
            insertID = (await collection.insert(JSON.parse(postData)));
        } 
        catch (error) {
            insertID = 0;
            console.log("Could not insert due to " + error);
        }

        if (insertID!=0)
            console.log("The inserted record has _id: " + insertID);

        return insertID;
        } finally {
        db.close();
    }
}

exports.createPost = async function(req, res) {
    var postRespObj = {};
    var postData = req.body.postData;
    var categoryID = req.body.category;
    console.log(categoryID);
    console.log(postData);
    createNewPost(postData,categoryID).then((createPostStatus) => {
        if(createPostStatus!=0)
            res.send({"status":"success","post":createPostStatus});
        else
            res.send({"status":"error","post":createPostStatus})
        //console.log("success "+postData);
    })
    .catch(err => {
        res.send({"status":"failure"});
        console.log("error"+err);
    });
}
