import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  column: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  position: number;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  assignee?: mongoose.Types.ObjectId;
  labels: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    column: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: [true, "Column reference is required"],
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
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    labels: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ column: 1, position: 1 });
TaskSchema.index({ board: 1 });
TaskSchema.index({ assignee: 1 });

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
