let getContentByCategory = (() => {
    var _ref2 = _asyncToGenerator(function* (category) {
        console.log("get " + category + " Data");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            let collection = db.collection(category);
            return yield transformIDvalue((yield collection.find({}, { limit: 1 }).toArray()), category);
            //{skip:1, limit:1, fields:{b:1}}
        } finally {
            db.close();
        }
    });

    return function getContentByCategory(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

let transformIDvalue = (() => {
    var _ref3 = _asyncToGenerator(function* (postArray, category) {
        for (var i = 0; i < postArray.length; i++) {
            postArray[i]._id = dbconf.postidToCategoryMap.indexOf(category) + '-' + postArray[i]._id;
        }
        return postArray;
    });

    return function transformIDvalue(_x4, _x5) {
        return _ref3.apply(this, arguments);
    };
})();

let getPostByIdFromDB = (() => {
    var _ref5 = _asyncToGenerator(function* (postMetadata) {
        //console.log("set postID");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            var collectionName = dbconf.postidToCategoryMap[postMetadata[0]];
            var postID = postMetadata[1];
            let collection = db.collection(collectionName);
            console.log("postID " + postID + " collectionName " + collectionName);
            return yield collection.find({ _id: ObjectId(postID) }).toArray();
        } finally {
            db.close();
        }
    });

    return function getPostByIdFromDB(_x8) {
        return _ref5.apply(this, arguments);
    };
})();

let createNewPost = (() => {
    var _ref7 = _asyncToGenerator(function* (postData, categoryID) {
        //console.log("set postID");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            var collectionName = dbconf.postidToCategoryMap[categoryID];
            let collection = db.collection(collectionName);
            console.log("collectionName " + collectionName);
            var insertID;
            try {
                insertID = yield collection.insert(JSON.parse(postData));
            } catch (error) {
                insertID = 0;
                console.log("Could not insert due to " + error);
            }

            if (insertID != 0) console.log("The inserted record has _id: " + insertID);

            return insertID;
        } finally {
            db.close();
        }
    });

    return function createNewPost(_x11, _x12) {
        return _ref7.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");
require("babel-register");
var deployconf = require(".././config/deployconf.js");
var dbconf = null;

if (deployconf.instance == "local") {
    dbconf = require(".././config/dbconflocal.js");
} else if (deployconf.instance == "heroku") {
    dbconf = require(".././config/dbconfheroku.js");
}

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

exports.hd = (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
        console.log("testing calls");
        var x = yield getRandomInt();
        try {
            res.send("" + x);
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
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

function getRandomInt() {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}

exports.getLatestContent = (() => {
    var _ref4 = _asyncToGenerator(function* (req, res) {
        var postRespObj = {};
        console.log(JSON.stringify(dbconf.mongodb));
        Promise.all([getContentByCategory(dbconf.mongodb.collection.latest), getContentByCategory(dbconf.mongodb.collection.health), getContentByCategory(dbconf.mongodb.collection.fitness), getContentByCategory(dbconf.mongodb.collection.living), getContentByCategory(dbconf.mongodb.collection.news)]).then(function ([latest, health, fitness, living, news]) {
            postRespObj.latest = latest;
            postRespObj.health = health;
            postRespObj.fitness = fitness;
            postRespObj.living = living;
            postRespObj.news = news;
            res.send(postRespObj);
        }).catch(function (err) {
            console.log("error" + err);
            res.send("error");
        });
    });

    return function (_x6, _x7) {
        return _ref4.apply(this, arguments);
    };
})();

exports.getPostById = (() => {
    var _ref6 = _asyncToGenerator(function* (req, res) {
        var postRespObj = {};
        var postMetadata = req.body.postID.split("-");
        console.log(postMetadata);
        getPostByIdFromDB(postMetadata).then(function (postData) {
            res.send({ "status": "success", "post": postData });
            //console.log("success "+postData);
        }).catch(function (err) {
            res.send({ "status": "failure" });
            console.log("error" + err);
        });
    });

    return function (_x9, _x10) {
        return _ref6.apply(this, arguments);
    };
})();

exports.createPost = (() => {
    var _ref8 = _asyncToGenerator(function* (req, res) {
        var postRespObj = {};
        var postData = req.body.postData;
        var categoryID = req.body.category;
        console.log(categoryID);
        console.log(postData);
        createNewPost(postData, categoryID).then(function (createPostStatus) {
            if (createPostStatus != 0) res.send({ "status": "success", "post": createPostStatus });else res.send({ "status": "error", "post": createPostStatus });
            //console.log("success "+postData);
        }).catch(function (err) {
            res.send({ "status": "failure" });
            console.log("error" + err);
        });
    });

    return function (_x13, _x14) {
        return _ref8.apply(this, arguments);
    };
})();

