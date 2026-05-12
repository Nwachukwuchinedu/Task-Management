import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Invitation } from "@/lib/models";

export async function POST(
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

    const invitation = await Invitation.findById(id);

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invitation.inviteeEmail !== session.user.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "This invitation is not for you" },
        { status: 403 }
      );
    }

    if (invitation.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Invitation already processed" },
        { status: 400 }
      );
    }

    invitation.status = "declined";
    await invitation.save();

    return NextResponse.json({ success: true, message: "Invitation declined" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to decline invitation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
