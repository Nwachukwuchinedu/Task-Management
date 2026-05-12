import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Invitation, Workspace, User } from "@/lib/models";

export async function POST(
  _request: NextRequest,
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
    await connectDB();

    const invitation = await Invitation.findById(id);

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invitation.inviteeEmail !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "This invitation is not for you" },
        { status: 403 }
      );
    }

    if (invitation.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Invitation already processed" },
        { status: 400 }
      );
    }

    invitation.status = "accepted";
    await invitation.save();

    const workspace = await Workspace.findById(invitation.workspace);

    if (workspace) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        if (!workspace.members) {
          workspace.members = [];
        }
        if (!workspace.members.includes(user._id)) {
          workspace.members.push(user._id);
          await workspace.save();
        }
      }
    }

    await invitation.populate("workspace", "name icon color");
    await invitation.populate("inviter", "name email avatar");

    return NextResponse.json({ success: true, data: invitation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to accept invitation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
