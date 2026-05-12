import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Board, Column, Task, Workspace } from "@/lib/models";

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

    const board = await Board.findById(id).populate("workspace", "name color icon owner members");

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const workspace = board.workspace as unknown as { owner: { toString: () => string }; members: string[] };
    const isMember =
      workspace.owner.toString() === session.user.id ||
      workspace.members.includes(session.user.id);

    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const columns = await Column.find({ board: id })
      .sort({ position: 1 });

    const columnsWithTasks = await Promise.all(
      columns.map(async (col) => {
        const tasks = await Task.find({ column: col._id })
          .populate("assignee", "name email avatar")
          .sort({ position: 1 });

        return {
          ...col.toObject(),
          tasks,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...board.toObject(),
        columns: columnsWithTasks,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch board";
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
    const { name, description, color } = await request.json();

    await connectDB();

    const board = await Board.findById(id);

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    if (name) board.name = name;
    if (description !== undefined) board.description = description;
    if (color) board.color = color;

    await board.save();

    const populatedBoard = await Board.findById(board._id)
      .populate("workspace", "name color icon");

    return NextResponse.json({ success: true, data: populatedBoard });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update board";
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

    const board = await Board.findById(id);

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const workspace = await Workspace.findById(board.workspace);

    if (!workspace || workspace.owner.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Only workspace owner can delete boards" },
        { status: 403 }
      );
    }

    await Column.deleteMany({ board: id });
    await Task.deleteMany({ board: id });
    await Board.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Board deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete board";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
