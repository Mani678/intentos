import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  magicDid: string;
  walletAddress: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    magicDid: {
      type: String,
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


UserSchema.index({ walletAddress: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
