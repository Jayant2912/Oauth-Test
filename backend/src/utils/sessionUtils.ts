import { UserModel } from "../models/UserModel";

// Check if the user is authorized (i.e., exists in the database with a refresh token)
export const isAuthorized = async (userId: string): Promise<boolean> => {
  const user = await UserModel.findOne({ _id: userId });
  return !!user?.refreshToken;
};

// Get the access token from the database, or refresh it if necessary
export const getAccessToken = async (
  userId: string
): Promise<string | null> => {
  const user = await UserModel.findOne({ _id: userId });

  if (user && user.accessToken) {
    return user.accessToken;
  }

  return null;
};
