var config = {};

config.mongodb = {};
config.web = {};
config.mongodb.collection = {};

config.mongodb.uri = 'mongodb://127.0.0.1:27017/healthdigest';
config.mongodb.port = 27017;

config.mongodb.collection.health = 'health';
config.mongodb.collection.latest = 'latest';
config.mongodb.collection.fitness = 'fitness';
config.mongodb.collection.living = 'living';
config.mongodb.collection.news = 'news';

config.mongodb.collection.users = 'users';

config.postidToCategoryMap = ["latest","health","fitness","living","news"];

module.exports = config;
