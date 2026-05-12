import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/lib/services";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await projectService.getProjectById(id);

    if (!project) {
      return NextResponse.json(errorResponse("Project not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(project));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch project";
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
    const project = await projectService.updateProject(id, body);

    if (!project) {
      return NextResponse.json(errorResponse("Project not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(project));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await projectService.deleteProject(id);

    if (!deleted) {
      return NextResponse.json(errorResponse("Project not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(null, "Project deleted successfully"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
