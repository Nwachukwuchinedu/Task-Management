import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Workspace, Board } from "@/lib/models";

export async function GET(
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

    const workspace = await Workspace.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    const isMember =
      workspace.owner._id.toString() === session.user.id ||
      workspace.members.some((m: { _id: { toString: () => string } }) => m._id.toString() === session.user.id);

    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: workspace });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch workspace";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
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
    const { name, description, icon, color } = await request.json();

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
        { success: false, error: "Only owner can update workspace" },
        { status: 403 }
      );
    }

    workspace.name = name ?? workspace.name;
    workspace.description = description ?? workspace.description;
    workspace.icon = icon ?? workspace.icon;
    workspace.color = color ?? workspace.color;
    await workspace.save();

    await workspace.populate("owner", "name email avatar");
    await workspace.populate("members", "name email avatar");

    return NextResponse.json({ success: true, data: workspace });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update workspace";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
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

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    if (workspace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Only owner can delete workspace" },
        { status: 403 }
      );
    }

    await Board.deleteMany({ workspace: id });
    await Workspace.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Workspace deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete workspace";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
