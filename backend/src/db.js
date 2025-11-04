// new file: backend/src/db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
let client;
let db;

export async function connect() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI not set');
  }
  if (db) return { client, db };
  client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  const url = new URL(MONGO_URI);
  // If a DB name is provided in the URI path, use it, otherwise default to lotus_sandbox
  const dbName = url.pathname && url.pathname !== '/' ? url.pathname.replace('/', '') : 'lotus_sandbox';
  db = client.db(dbName);
  return { client, db };
}

export function getDb() {
  if (!db) throw new Error('Database not connected. Call connect() first.');
  return db;
}

export function getCollection(name) {
  return getDb().collection(name);
}

export async function close() {
  if (client) await client.close();
  client = null;
  db = null;
}

