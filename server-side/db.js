const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database and Collection Names
const dbName = 'myDatabase';
const collectionName = 'myCollection';

async function main() {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Define your query here
    const query = { age: { $gt: 18 } };

    // Perform the find operation
    const documents = await collection.find(query).toArray();
    console.log('Documents found:', documents);

    // Close the connection
    await client.close();
}

main().catch(console.error);
