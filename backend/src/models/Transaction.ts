import mongoose, { Document, Schema } from 'mongoose';

export type IntentType = 'payment' | 'split' | 'donation' | 'transfer' | 'swap' | 'unknown';
export type TransactionStatus = 'pending' | 'confirming' | 'success' | 'failed';

export interface IParsedIntent {
  intent: IntentType;
  recipient?: string;
  recipientAddress?: string;
  amount?: number;
  currency?: string;
  sourceChain?: string;
  destinationChain?: string;
  memo?: string;
  splitParticipants?: string[];
  rawInput: string;
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  walletAddress: string;
  parsedIntent: IParsedIntent;
  txHash?: string;
  status: TransactionStatus;
  chain: string;
  gasSponsored: boolean;
  amountUSD?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParsedIntentSchema = new Schema<IParsedIntent>(
  {
    intent: { type: String, required: true },
    recipient: { type: String },
    recipientAddress: { type: String },
    amount: { type: Number },
    currency: { type: String },
    sourceChain: { type: String },
    destinationChain: { type: String },
    memo: { type: String },
    splitParticipants: [{ type: String }],
    rawInput: { type: String, required: true },
  },
  { _id: false }
);

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    parsedIntent: {
      type: ParsedIntentSchema,
      required: true,
    },
    txHash: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirming', 'success', 'failed'],
      default: 'pending',
    },
    chain: {
      type: String,
      default: 'arbitrum',
    },
    gasSponsored: {
      type: Boolean,
      default: true,
    },
    amountUSD: {
      type: Number,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ walletAddress: 1 });
TransactionSchema.index({ txHash: 1 });
TransactionSchema.index({ status: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
