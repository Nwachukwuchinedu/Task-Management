import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description?: string;
  color: string;
  workspace: mongoose.Types.ObjectId;
  columns: mongoose.Types.ObjectId[];
  members: {
    user: mongoose.Types.ObjectId;
    role: "admin" | "member";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
      maxlength: [100, "Board name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace reference is required"],
    },
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: "Column",
      },
    ],
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "member"], default: "member" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

BoardSchema.index({ workspace: 1 });

const Board: Model<IBoard> =
  mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);

export default Board;
