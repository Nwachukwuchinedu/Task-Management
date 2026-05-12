import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task, Board } from "@/lib/models";

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
    const { columnId, position } = await request.json();

    if (!columnId || position === undefined) {
      return NextResponse.json(
        { success: false, error: "columnId and position are required" },
        { status: 400 }
      );
    }

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

    const members = board.members || [];
    const isBoardMember = members.some(
      (m: { user: mongoose.Types.ObjectId }) => m.user.toString() === session.user.id
    );

    if (!isBoardMember) {
      return NextResponse.json(
        { success: false, error: "Only board members can move tasks" },
        { status: 403 }
      );
    }

    const oldColumnId = task.column.toString();
    const oldPosition = task.position;

    if (oldColumnId === columnId) {
      const tasksInColumn = await Task.find({
        column: columnId,
        _id: { $ne: id },
      }).sort({ position: 1 });

      const newTasks = [...tasksInColumn];
      newTasks.splice(position, 0, task);

      await Promise.all(
        newTasks.map((t, index) =>
          Task.findByIdAndUpdate(t._id, { position: index })
        )
      );
    } else {
      await Task.updateMany(
        {
          column: oldColumnId,
          position: { $gt: oldPosition },
        },
        { $inc: { position: -1 } }
      );

      await Task.updateMany(
        {
          column: columnId,
          position: { $gte: position },
        },
        { $inc: { position: 1 } }
      );

      task.column = columnId;
      task.position = position;
      await task.save();
    }

    const updatedTask = await Task.findById(id)
      .populate("assignee", "name email avatar");

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to move task";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
