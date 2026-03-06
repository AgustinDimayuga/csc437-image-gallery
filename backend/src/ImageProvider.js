import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";

export class ImageProvider {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    const collectionName = getEnvVar("IMAGES_COLLECTION_NAME");
    this.collection = this.mongoClient.db().collection(collectionName);
  }

  getAllImages() {
    // Without any options or filters passed to it, find() will get all documents in the collection.
    return this.collection.find().toArray();
  }
}
