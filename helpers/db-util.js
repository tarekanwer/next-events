import { MongoClient } from "mongodb";

export async function connectDatabase(collection) {
  const client = await MongoClient.connect(
    `mongodb+srv://tarekanwer:T%40rek01266@cluster0.hvrekjg.mongodb.net/${collection}?retryWrites=true&w=majority`
  );
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getAllDocuments(client, collection, sort) {
  const db = client.db();

  const documents = await db
    .collection(collection)
    .find()
    .sort(sort)
    .toArray();

    return documents;
}
