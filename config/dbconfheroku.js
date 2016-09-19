var config = {};

config.mongodb = {};
config.web = {};
config.mongodb.collection = {};

config.mongodb.uri = 'mongodb://iad2-c5-2.mongo.objectrocket.com:52199/healthdigest';
config.mongodb.port = 52199;

config.mongodb.collection.health = 'health';
config.mongodb.collection.latest = 'latest';
config.mongodb.collection.fitness = 'fitness';
config.mongodb.collection.living = 'living';
config.mongodb.collection.news = 'news';

config.mongodb.collection.users = 'users';

config.postidToCategoryMap = ["latest","health","fitness","living","news"];

module.exports = dbconf;