'use server'
import { AppwriteException, ID, Models, Query } from "node-appwrite";
import { users } from "../appwrite.config";

export const createUser = async (user: CreateUserParams) => {
  try {
    console.log("user......................", user);
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    )
    console.log("user......................", newUser);
    return newUser;
  } catch (error: any) {
    console.error("app write  error" ,error);
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal("email", user.email)]);

      return documents?.users[0];
    }
  }
};
