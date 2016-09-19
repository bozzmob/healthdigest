let getUserFavoritesFromDB = (() => {
    var _ref2 = _asyncToGenerator(function* (userID) {
        console.log("get " + userID + " Data");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            let collection = db.collection(dbconf.mongodb.collection.users);
            //console.log(collection);
            console.log("userID inside" + userID);
            return yield collection.find({ _id: ObjectId(userID) }, { favorites: 1 }).toArray();
        } finally {
            db.close();
        }
    });

    return function getUserFavoritesFromDB(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

let getUserFavoriteCategoriesFromDB = (() => {
    var _ref3 = _asyncToGenerator(function* (userID) {
        console.log("get " + userID + " Data");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            let collection = db.collection(dbconf.mongodb.collection.users);
            return yield collection.find({ _id: ObjectId(userID) }, { favorite_categories: 1 }).toArray();
        } finally {
            db.close();
        }
    });

    return function getUserFavoriteCategoriesFromDB(_x4) {
        return _ref3.apply(this, arguments);
    };
})();

//Get Favorite posts by User ID


let setUserFavoriteToDB = (() => {
    var _ref6 = _asyncToGenerator(function* (userID, postID, operation) {
        console.log("set " + postID + " postID");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            let collection = db.collection(dbconf.mongodb.collection.users);
            if (operation == "add") return yield collection.update({ _id: ObjectId(userID) }, { $push: { "favorites": postID } });else if (operation == "remove") return yield collection.update({ _id: ObjectId(userID) }, { $pull: { "favorites": postID } });
        } finally {
            db.close();
        }
    });

    return function setUserFavoriteToDB(_x9, _x10, _x11) {
        return _ref6.apply(this, arguments);
    };
})();

let setUserFavoriteCategoriesToDB = (() => {
    var _ref7 = _asyncToGenerator(function* (userID, categories) {
        console.log(userID + "set " + categories + " categories ");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            let collection = db.collection(dbconf.mongodb.collection.users);
            return yield collection.update({ _id: ObjectId(userID) }, { $set: { "favorite_categories": JSON.parse(categories) } });
        } finally {
            db.close();
        }
    });

    return function setUserFavoriteCategoriesToDB(_x12, _x13) {
        return _ref7.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");
require("babel-register");
var deployconf = require(".././config/deployconf.js");
var dbconf;
var util = require('util');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

if (deployconf.instance == "local") {
    dbconf = require(".././config/dbconflocal.js");
} else if (deployconf.instance == "heroku") {
    dbconf = require(".././config/dbconfheroku.js");
}

exports.params = (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
        console.log("testing calls" + req.body.userID);
        var x = yield getRandomInt();
        try {
            getContentByCategory('Yo').then(function (val) {
                //resolve(val);
                console.log("val " + JSON.stringify(val));
                res.send(val);
            }).catch(function (err) {
                reject(err);
            });
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

exports.getFavorites = (() => {
    var _ref4 = _asyncToGenerator(function* (req, res) {
        var postRespObj = { "status": "failure" };
        getUserFavoritesFromDB(req.body.userID).then(function (favoritesData) {
            postRespObj.status = "success";
            postRespObj.favorites = favoritesData[0].favorites;
            res.send(postRespObj);
        }).catch(function (err) {
            console.log("error" + err);
            res.send(postRespObj);
        });
    });

    return function (_x5, _x6) {
        return _ref4.apply(this, arguments);
    };
})();

//Get Favorite Categories by User ID
exports.getFavoriteCategories = (() => {
    var _ref5 = _asyncToGenerator(function* (req, res) {
        var postRespObj = { "status": "failure" };
        getUserFavoriteCategoriesFromDB(req.body.userID).then(function (favoritesData) {
            postRespObj.status = "success";
            postRespObj.favorite_categories = favoritesData[0].favorite_categories;
            res.send(postRespObj);
        }).catch(function (err) {
            console.log("error" + err);
            res.send(postRespObj);
        });
    });

    return function (_x7, _x8) {
        return _ref5.apply(this, arguments);
    };
})();

exports.setFavorite = (() => {
    var _ref8 = _asyncToGenerator(function* (req, res) {
        var postRespObj = {};
        setUserFavoriteToDB(req.body.userID, req.body.postID, req.body.operation).then(function (favoritesData) {
            res.send({ "status": "success" });
            console.log("success " + favoritesData);
        }).catch(function (err) {
            res.send({ "status": "failure" });
            console.log("error" + err);
        });
    });

    return function (_x14, _x15) {
        return _ref8.apply(this, arguments);
    };
})();

exports.setFavoriteCategories = (() => {
    var _ref9 = _asyncToGenerator(function* (req, res) {
        var postRespObj = {};
        setUserFavoriteCategoriesToDB(req.body.userID, req.body.categories).then(function (favoritesData) {
            res.send({ "status": "success" });
            console.log("success " + favoritesData);
        }).catch(function (err) {
            res.send({ "status": "failure" });
            console.log("error" + err);
        });
    });

    return function (_x16, _x17) {
        return _ref9.apply(this, arguments);
    };
})();

