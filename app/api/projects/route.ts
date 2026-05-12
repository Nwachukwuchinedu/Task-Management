import { NextRequest, NextResponse } from "next/server";
import { projectService } from "@/lib/services";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(errorResponse("User ID is required"), {
        status: 400,
      });
    }

    const projects = await projectService.getProjectsByUser(userId);
    return NextResponse.json(successResponse(projects));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await projectService.createProject(body);
    return NextResponse.json(successResponse(project), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
