import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
  workspace: mongoose.Types.ObjectId;
  inviter: mongoose.Types.ObjectId;
  inviteeEmail: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace reference is required"],
    },
    inviter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Inviter reference is required"],
    },
    inviteeEmail: {
      type: String,
      required: [true, "Invitee email is required"],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

InvitationSchema.index({ inviteeEmail: 1, status: 1 });
InvitationSchema.index({ workspace: 1 });

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;
