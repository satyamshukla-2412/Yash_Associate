const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://ankitshu2006_db_user:tw21QYEp745v2Ivn@ac-uvds664-shard-00-00.9kbmy5l.mongodb.net:27017,ac-uvds664-shard-00-01.9kbmy5l.mongodb.net:27017,ac-uvds664-shard-00-02.9kbmy5l.mongodb.net:27017/yash_associate_db?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Yashassociate";

const options = {};

let client;

async function getDb() {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  const connectedClient = await global._mongoClientPromise;
  // Use a specific database name
  return connectedClient.db('yash_associate_db');
}

module.exports = { getDb };
