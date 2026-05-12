import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Task, Column, Board, Workspace } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, columnId, boardId, priority, dueDate, assignee } = await request.json();

    if (!title || !columnId || !boardId) {
      return NextResponse.json(
        { success: false, error: "Title, columnId and boardId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const board = await Board.findById(boardId);

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
        { success: false, error: "Only board members can create tasks" },
        { status: 403 }
      );
    }

    const maxPosition = await Task.findOne({ column: columnId })
      .sort({ position: -1 })
      .select("position");

    const position = maxPosition ? maxPosition.position + 1 : 0;

    const task = await Task.create({
      title,
      description,
      column: columnId,
      board: boardId,
      priority: priority || "medium",
      dueDate,
      assignee,
      labels: [],
      position,
      createdBy: session.user.id,
    });

    await task.populate("assignee", "name email avatar");

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
