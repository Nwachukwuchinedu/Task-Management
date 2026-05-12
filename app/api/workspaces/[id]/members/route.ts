import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace, User, Invitation } from "@/lib/models";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (workspace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Only workspace owner can invite members" },
        { status: 403 }
      );
    }

    const userToInvite = await User.findOne({ email });

    if (userToInvite) {
      const isAlreadyMember = workspace.members.some(
        (m: mongoose.Types.ObjectId) => m.toString() === userToInvite._id.toString()
      );

      if (isAlreadyMember) {
        return NextResponse.json(
          { success: false, error: "User is already a member" },
          { status: 400 }
        );
      }
    }

    const existingInvitation = await Invitation.findOne({
      workspace: id,
      inviteeEmail: email.toLowerCase(),
      status: "pending",
    });

    if (existingInvitation) {
      return NextResponse.json(
        { success: false, error: "Invitation already sent to this email" },
        { status: 400 }
      );
    }

    const invitation = await Invitation.create({
      workspace: id,
      inviter: session.user.id,
      inviteeEmail: email.toLowerCase(),
    });

    await invitation.populate("workspace", "name icon color");
    await invitation.populate("inviter", "name email avatar");

    return NextResponse.json(
      { success: true, data: invitation, message: "Invitation sent" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to invite member";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
