import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Column } from "@/lib/models";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderedIds } = await request.json();

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { success: false, error: "orderedIds is required" },
        { status: 400 }
      );
    }

    await connectDB();

    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        Column.findByIdAndUpdate(id, { position: index })
      )
    );

    return NextResponse.json({ success: true, message: "Columns reordered" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reorder columns";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
