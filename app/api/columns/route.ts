import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Column, Board } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, boardId } = await request.json();

    if (!name || !boardId) {
      return NextResponse.json(
        { success: false, error: "Name and boardId are required" },
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

    const maxPosition = await Column.findOne({ board: boardId })
      .sort({ position: -1 })
      .select("position");

    const position = maxPosition ? maxPosition.position + 1 : 0;

    const column = await Column.create({
      name,
      board: boardId,
      position,
    });

    if (!board.columns) {
      board.columns = [];
    }
    board.columns.push(column._id);
    await board.save();

    return NextResponse.json({ success: true, data: column }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create column";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
