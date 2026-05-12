import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Board, Workspace, User } from "@/lib/models";

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

    const board = await Board.findById(id)
      .populate({
        path: "members.user",
        select: "name email avatar",
        strictPopulate: false,
      });

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const workspace = await Workspace.findById(board.workspace);

    const members = board.members || [];
    const isWorkspaceMember = workspace?.members.some(
      (m: mongoose.Types.ObjectId) => m.toString() === session.user.id
    );

    if (!isWorkspaceMember && workspace?.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch members";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

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
    const { email, role = "member" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const board = await Board.findById(id);

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const workspace = await Workspace.findById(board.workspace);

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    const isWorkspaceOwner = workspace.owner.toString() === session.user.id;
    const members = board.members || [];
    const isBoardAdmin = members.some(
      (m: { user: mongoose.Types.ObjectId; role: string }) =>
        m.user.toString() === session.user.id && m.role === "admin"
    );

    if (!isWorkspaceOwner && !isBoardAdmin) {
      return NextResponse.json(
        { success: false, error: "Only workspace owner or board admin can add members" },
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

    const isWorkspaceMember = workspace.members.some(
      (m: mongoose.Types.ObjectId) => m.toString() === userToAdd._id.toString()
    );

    if (!isWorkspaceMember) {
      return NextResponse.json(
        { success: false, error: "User must be a workspace member first" },
        { status: 400 }
      );
    }

    const isAlreadyBoardMember = members.some(
      (m: { user: mongoose.Types.ObjectId }) => m.user.toString() === userToAdd._id.toString()
    );

    if (isAlreadyBoardMember) {
      return NextResponse.json(
        { success: false, error: "User is already a board member" },
        { status: 400 }
      );
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      {
        $push: {
          members: {
            user: userToAdd._id,
            role: role as "admin" | "member",
          },
        },
      },
      { new: true }
    ).populate({
      path: "members.user",
      select: "name email avatar",
      strictPopulate: false,
    });

    if (!updatedBoard) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedBoard.members, message: "Member added to board" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add member";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
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
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const board = await Board.findById(id);

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const workspace = await Workspace.findById(board.workspace);

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    const isWorkspaceOwner = workspace.owner.toString() === session.user.id;
    const members = board.members || [];
    const isBoardAdmin = members.some(
      (m: { user: mongoose.Types.ObjectId; role: string }) =>
        m.user.toString() === session.user.id && m.role === "admin"
    );

    if (!isWorkspaceOwner && !isBoardAdmin) {
      return NextResponse.json(
        { success: false, error: "Only workspace owner or board admin can remove members" },
        { status: 403 }
      );
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Cannot remove yourself from board" },
        { status: 400 }
      );
    }

    await Board.findByIdAndUpdate(id, {
      $pull: {
        members: { user: new mongoose.Types.ObjectId(userId) },
      },
    });

    return NextResponse.json({ success: true, message: "Member removed from board" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove member";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
