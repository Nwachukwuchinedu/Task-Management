import { NextRequest, NextResponse } from "next/server";
import { taskService } from "@/lib/services";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const assignee = searchParams.get("assignee");

    if (!projectId) {
      return NextResponse.json(errorResponse("Project ID is required"), {
        status: 400,
      });
    }

    const tasks = await taskService.getTasksByProject(projectId, {
      status: status || undefined,
      assignee: assignee || undefined,
    });

    return NextResponse.json(successResponse(tasks));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch tasks";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await taskService.createTask(body);
    return NextResponse.json(successResponse(task), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
