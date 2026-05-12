import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Board, Column, Workspace } from "@/lib/models";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    await connectDB();

    type BoardQuery = { workspace?: string | { $in: Types.ObjectId[] } };
    const query: BoardQuery = {};
    if (workspaceId) {
      query.workspace = workspaceId;
    } else {
      const workspaces = await Workspace.find({
        $or: [{ owner: session.user.id }, { members: session.user.id }],
      }).select("_id");

      query.workspace = { $in: workspaces.map((w) => w._id) };
    }

    const boards = await Board.find(query)
      .populate("workspace", "name color icon")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ success: true, data: boards });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch boards";
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

    const { name, description, color, workspaceId, columns } = await request.json();

    if (!name || !workspaceId) {
      return NextResponse.json(
        { success: false, error: "Name and workspace are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: "Workspace not found" },
        { status: 404 }
      );
    }

    const isMember =
      workspace.owner.toString() === session.user.id ||
      workspace.members.some((m: unknown) => String(m) === session.user.id);

    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    const defaultColumns = columns || ["Todo", "In Progress", "Done"];

    const board = await Board.create({
      name,
      description,
      color: color || "#3B82F6",
      workspace: workspaceId,
      members: [
        {
          user: session.user.id,
          role: "admin",
        },
      ],
      columns: [],
    });

    const columnDocs = await Column.insertMany(
      defaultColumns.map((col: string, index: number) => ({
        name: col,
        board: board._id,
        position: index,
      }))
    );

    board.columns = columnDocs.map((c) => c._id);
    await board.save();

    const populatedBoard = await Board.findById(board._id)
      .populate({
        path: "columns",
        options: { sort: { position: 1 } },
      })
      .populate("workspace", "name color icon");

    return NextResponse.json({ success: true, data: populatedBoard }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create board";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
