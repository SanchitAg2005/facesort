/**
 * MongoDB connection utility
 * Uses singleton pattern to prevent multiple connections
 */

import { MongoClient, type Db } from "mongodb"
import { config } from "./config"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(config.mongodbUri)

  try {
    await client.connect()
    const db = client.db("facesort")

    cachedClient = client
    cachedDb = db

    console.log("Connected to MongoDB")

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      await db.collection("users").createIndex({ username: 1 }, { unique: true })
    }

    if (!collectionNames.includes("friends")) {
      await db.createCollection("friends")
      await db.collection("friends").createIndex({ user_id: 1 })
    }

    if (!collectionNames.includes("jobs")) {
      await db.createCollection("jobs")
      await db.collection("jobs").createIndex({ user_id: 1 })
      await db.collection("jobs").createIndex({ created_at: -1 })
    }

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}
