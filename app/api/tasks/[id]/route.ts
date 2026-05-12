import { NextRequest, NextResponse } from "next/server";
import { taskService } from "@/lib/services";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await taskService.getTaskById(id);

    if (!task) {
      return NextResponse.json(errorResponse("Task not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(task));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch task";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const task = await taskService.updateTask(id, body);

    if (!task) {
      return NextResponse.json(errorResponse("Task not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(task));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update task";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await taskService.deleteTask(id);

    if (!deleted) {
      return NextResponse.json(errorResponse("Task not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(null, "Task deleted successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
