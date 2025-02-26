import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  refreshToken: string;
  accessToken: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessToken: { type: String, required: true }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
