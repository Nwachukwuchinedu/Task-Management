import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace, User } from "@/lib/models";

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
        { success: false, error: "Only owner can add members" },
        { status: 403 }
      );
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (workspace.members.includes(userToAdd._id)) {
      return NextResponse.json(
        { success: false, error: "User is already a member" },
        { status: 400 }
      );
    }

    workspace.members.push(userToAdd._id);
    await workspace.save();

    await workspace.populate("owner", "name email avatar");
    await workspace.populate("members", "name email avatar");

    return NextResponse.json({ success: true, data: workspace });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add member";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
