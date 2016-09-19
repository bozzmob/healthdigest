let getContentByCategory = (() => {
    var _ref2 = _asyncToGenerator(function* (category) {
        console.log("get " + category + " Data");
        let db = yield MongoClient.connect(dbconf.mongodb.uri);
        try {
            let collection = db.collection(category);
            return yield collection.find({}).toArray();
        } finally {
            db.close();
        }
    });

    return function getContentByCategory(_x3) {
        return _ref2.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

require("babel-core/register");
require("babel-polyfill");
require("babel-register");
var deployconf = require(".././config/deployconf.js");
var dbconf;

if (deployconf.instance == "local") {
    dbconf = require(".././config/dbconflocal.js");
} else if (deployconf.instance == "heroku") {
    dbconf = require(".././config/dbconfheroku.js");
}

var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

exports.hd = (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
        console.log("testing calls");
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

exports.getLatestContent = (() => {
    var _ref3 = _asyncToGenerator(function* (req, res) {
        var postRespObj = {};
        Promise.all([getContentByCategory(dbconf.mongodb.collection.latest), getContentByCategory(dbconf.mongodb.collection.health), getContentByCategory(dbconf.mongodb.collection.fitness), getContentByCategory(dbconf.mongodb.collection.living), getContentByCategory(dbconf.mongodb.collection.news)]).then(function ([latest, health, fitness, living, news]) {
            postRespObj.latest = latest;
            postRespObj.health = health;
            postRespObj.fitness = fitness;
            postRespObj.living = living;
            postRespObj.news = news;
            res.send(postRespObj);
        }).catch(function (err) {
            console.log("error" + err);
        });
    });

    return function (_x4, _x5) {
        return _ref3.apply(this, arguments);
    };
})();

