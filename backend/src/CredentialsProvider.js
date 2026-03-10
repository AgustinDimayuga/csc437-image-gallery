import { MongoClient, ObjectId } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import bcrypt from "bcrypt";
export class CredentialProvider {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    const credsCollectionName = getEnvVar("CREDS_COLLECTION_NAME");
    this.credsCollection = this.mongoClient
      .db()
      .collection(credsCollectionName);
    const userCollectionName = getEnvVar("USERS_COLLECTION_NAME");

    this.usersCollection = this.mongoClient.db().collection(userCollectionName);
  }

  async registerUser(username, email, password) {
    const existing = await this.credsCollection.findOne({ username: username });
    if (existing) {
      // user already exists
      return false;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const session = this.mongoClient.startSession();
    try {
      await session.withTransaction(async () => {
        await this.credsCollection.insertOne(
          {
            username: username,
            password: hashedPassword,
          },
          { session },
        );
        await this.usersCollection.insertOne(
          {
            username: username,
            email: email,
          },
          { session },
        );
      });
    } catch (e) {
      return false;
    } finally {
      await session.endSession();
    }
    return true;
  }
  async verifyPassword(username, password) {
    const hashedPassword = await this.credsCollection.findOne({
      username: username,
    });
    if (!hashedPassword) {
      // User does not exist
      return false;
    }
    if (await bcrypt.compare(password, hashedPassword.password)) {
      return true;
    }

    return false;
  }
}
