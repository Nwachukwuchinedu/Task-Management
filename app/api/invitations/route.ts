import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Invitation, Workspace } from "@/lib/models";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const invitations = await Invitation.find({
      inviteeEmail: session.user.email,
      status: "pending",
    })
      .populate("workspace", "name icon color")
      .populate("inviter", "name email avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: invitations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch invitations";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { workspaceId, email } = await request.json();

    if (!workspaceId || !email) {
      return NextResponse.json(
        { success: false, error: "Workspace ID and email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findById(workspaceId);

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

    const existingInvitation = await Invitation.findOne({
      workspace: workspaceId,
      inviteeEmail: email.toLowerCase(),
      status: "pending",
    });

    if (existingInvitation) {
      return NextResponse.json(
        { success: false, error: "Invitation already sent" },
        { status: 400 }
      );
    }

    const existingMember = workspace.members.some(
      (m: mongoose.Types.ObjectId) => m.toString() === email
    );

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: "User is already a member" },
        { status: 400 }
      );
    }

    const invitation = await Invitation.create({
      workspace: workspaceId,
      inviter: session.user.id,
      inviteeEmail: email.toLowerCase(),
    });

    await invitation.populate("workspace", "name icon color");
    await invitation.populate("inviter", "name email avatar");

    return NextResponse.json({ success: true, data: invitation }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create invitation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
