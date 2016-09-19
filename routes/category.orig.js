require("babel-core/register");
require("babel-polyfill");
require("babel-register");
var deployconf = require(".././config/deployconf.js");
var dbconf;

if(deployconf.instance == "local"){
    dbconf = require(".././config/dbconflocal.js");    
}
else if(deployconf.instance == "heroku"){
    dbconf = require(".././config/dbconfheroku.js")
}


var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;


exports.hd = async function(req, res) {
    console.log("testing calls");
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

async function getContentByCategory(category) {
    console.log("get " + category + " Data");
    let db = await MongoClient.connect(dbconf.mongodb.uri);
    try {
        let collection = db.collection(category);
        return (await collection.find({}).toArray());
    } finally {
        db.close();
    }
}

exports.getLatestContent = async function(req, res) {
    var postRespObj = {};
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
    });
}