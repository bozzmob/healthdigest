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

if(deployconf.instance == "local"){
    dbconf = require(".././config/dbconflocal.js");    
}
else if(deployconf.instance == "heroku"){
    dbconf = require(".././config/dbconfheroku.js")
}

exports.params = async function(req, res) {
    console.log("testing calls"+req.body.userID);
    var x = await getRandomInt();
    try {
        getContentByCategory('Yo').then(function(val) {
            //resolve(val);
            console.log("val " + JSON.stringify(val));
            res.send(val);
        }).catch(function(err) {
            reject(err);
        });
    } catch (err) {
        console.log("Exception from promise " + err);
    }
}

function getRandomInt() {
    return Math.floor(Math.random() * (100 - 10 + 1)) + 10;
}

async function getUserFavoritesFromDB(userID) {
    console.log("get " + userID + " Data");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        let collection = db.collection(dbconf.mongodb.collection.users);
        //console.log(collection);
        console.log("userID inside" + userID);
        return (await collection.find({_id:ObjectId(userID)},{favorites:1}).toArray());
    } finally {
        db.close();
    }
}

async function getUserFavoriteCategoriesFromDB(userID) {
    console.log("get " + userID + " Data");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        let collection = db.collection(dbconf.mongodb.collection.users);
        return (await collection.find({_id:ObjectId(userID)},{favorite_categories:1}).toArray());
    } finally {
        db.close();
    }
}

//Get Favorite posts by User ID
exports.getFavorites = async function(req, res) {
    var postRespObj = {"status":"failure"};
    getUserFavoritesFromDB(req.body.userID).then((favoritesData) => {
        postRespObj.status = "success";
        postRespObj.favorites = favoritesData[0].favorites;
        res.send(postRespObj);
    })
    .catch(err => {
        console.log("error"+err);
        res.send(postRespObj);
    });
}

//Get Favorite Categories by User ID
exports.getFavoriteCategories = async function(req, res) {
    var postRespObj = {"status":"failure"};
    getUserFavoriteCategoriesFromDB(req.body.userID).then((favoritesData) => {
        postRespObj.status = "success";
        postRespObj.favorite_categories = favoritesData[0].favorite_categories;
        res.send(postRespObj);
    })
    .catch(err => {
        console.log("error"+err);
        res.send(postRespObj);
    });
}

async function setUserFavoriteToDB(userID, postID, operation) {
    console.log("set " + postID + " postID");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        let collection = db.collection(dbconf.mongodb.collection.users);
        if(operation == "add")
            return (await collection.update({_id:ObjectId(userID)},{$push:{"favorites":postID}}));
        else if (operation == "remove")
            return (await collection.update({_id:ObjectId(userID)},{$pull:{"favorites":postID}}));
    } finally {
        db.close();
    }
}

async function setUserFavoriteCategoriesToDB(userID, categories) {
    console.log(userID+ "set " + categories + " categories ");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        let collection = db.collection(dbconf.mongodb.collection.users);
        return (await collection.update({_id:ObjectId(userID)},{$set:{"favorite_categories":JSON.parse(categories)}}));
        } finally {
        db.close();
    }
}

exports.setFavorite = async function(req, res) {
    var postRespObj = {};
    setUserFavoriteToDB(req.body.userID, req.body.postID, req.body.operation).then((favoritesData) => {
        res.send({"status":"success"});
        console.log("success "+favoritesData);
    })
    .catch(err => {
        res.send({"status":"failure"});
        console.log("error"+err);
    });
}


exports.setFavoriteCategories = async function(req, res) {
    var postRespObj = {};
    setUserFavoriteCategoriesToDB(req.body.userID, req.body.categories).then((favoritesData) => {
        res.send({"status":"success"});
        console.log("success "+favoritesData);
    })
    .catch(err => {
        res.send({"status":"failure"});
        console.log("error"+err);
    });
}