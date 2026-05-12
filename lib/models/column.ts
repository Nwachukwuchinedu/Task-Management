import mongoose, { Schema, Document, Model } from "mongoose";

export interface IColumn extends Document {
  name: string;
  board: mongoose.Types.ObjectId;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    name: {
      type: String,
      required: [true, "Column name is required"],
      trim: true,
      maxlength: [50, "Column name cannot exceed 50 characters"],
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Board reference is required"],
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ColumnSchema.index({ board: 1, position: 1 });

const Column: Model<IColumn> =
  mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema);

export default Column;
