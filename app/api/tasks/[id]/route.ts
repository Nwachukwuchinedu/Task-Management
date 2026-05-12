import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task, Board } from "@/lib/models";

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

    const task = await Task.findById(id)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar");

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch task";
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
    const updates = await request.json();

    await connectDB();

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    const board = await Board.findById(task.board);

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const isBoardMember = board.members.some(
      (m: { user: mongoose.Types.ObjectId }) => m.user.toString() === session.user.id
    );

    const isAssignee = task.assignee?.toString() === session.user.id;

    if (!isBoardMember && !isAssignee) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    Object.assign(task, updates);
    await task.save();

    await task.populate("assignee", "name email avatar");

    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task";
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

    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    const board = await Board.findById(task.board);

    if (!board) {
      return NextResponse.json(
        { success: false, error: "Board not found" },
        { status: 404 }
      );
    }

    const isBoardMember = board.members.some(
      (m: { user: mongoose.Types.ObjectId }) => m.user.toString() === session.user.id
    );

    if (!isBoardMember) {
      return NextResponse.json(
        { success: false, error: "Only board members can delete tasks" },
        { status: 403 }
      );
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
