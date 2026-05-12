import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace } from "@/lib/models";

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

    const workspaces = await Workspace.find({
      $or: [{ owner: session.user.id }, { members: session.user.id }],
    })
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, data: workspaces });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch workspaces";
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

    const { name, description, icon, color } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.create({
      name,
      description,
      icon: icon || "🚀",
      color: color || "#3B82F6",
      owner: session.user.id,
      members: [session.user.id],
    });

    await workspace.populate("owner", "name email avatar");
    await workspace.populate("members", "name email avatar");

    return NextResponse.json({ success: true, data: workspace }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create workspace";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
