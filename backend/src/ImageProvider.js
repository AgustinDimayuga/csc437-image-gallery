import { MongoClient, ObjectId } from "mongodb";
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
  getAllImagesWithAuthor() {
    const pipeline = [];
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "username",
        as: "author",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$author",
      },
    });

    return this.collection.aggregate(pipeline).toArray();
  }
  getOneImage(imageId) {
    if (!ObjectId.isValid(imageId)) {
      return null;
    }
    const objectId = new ObjectId(imageId);

    const pipeline = [];
    pipeline.push({
      $match: {
        _id: objectId,
      },
    });
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "authorId",
        foreignField: "username",
        as: "author",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$author",
      },
    });
    console.log("Get one images used");
    return this.collection.aggregate(pipeline).next();
  }

  async updateImageName(imageId, newName) {
    if (!ObjectId.isValid(imageId)) {
      return 0;
    }
    const objectId = new ObjectId(imageId);
    const response = await this.collection.updateOne(
      { _id: objectId },
      { $set: { name: newName } },
    );
    return response.matchedCount;
    // Do keep in mind the type of _id in the DB is ObjectId, not string
    // Use `new ObjectId(imageId)` to convert a string to an ObjectId.
  }
}
