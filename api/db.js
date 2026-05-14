const { MongoClient } = require('mongodb');

// Use environment variable if available, otherwise fallback to the provided connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://ankitshu2006_db_user:tw21QYEp745v2Ivn@yashassociate.9kbmy5l.mongodb.net/?retryWrites=true&w=majority&appName=Yashassociate";

const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function getDb() {
  const connectedClient = await clientPromise;
  // Use a specific database name
  return connectedClient.db('yash_associate_db');
}

module.exports = { getDb };
