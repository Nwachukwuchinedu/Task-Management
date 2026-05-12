import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Column, Board, Task } from "@/lib/models";

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
    const { name, position } = await request.json();

    await connectDB();

    const column = await Column.findById(id);

    if (!column) {
      return NextResponse.json(
        { success: false, error: "Column not found" },
        { status: 404 }
      );
    }

    if (name) column.name = name;
    if (position !== undefined) column.position = position;

    await column.save();

    return NextResponse.json({ success: true, data: column });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update column";
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

    const column = await Column.findById(id);

    if (!column) {
      return NextResponse.json(
        { success: false, error: "Column not found" },
        { status: 404 }
      );
    }

    await Task.deleteMany({ column: id });
    await Board.updateOne(
      { _id: column.board },
      { $pull: { columns: id } }
    );
    await Column.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Column deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete column";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
