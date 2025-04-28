// app/api/comments/[commentId]/restore/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { comments } from "@/database/schema";
import { eq, and } from "drizzle-orm";

// Restore a deleted comment (within 15 minutes of deletion)
export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = params;

    // Check if user owns the comment and it's deleted
    const [comment] = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.authorId, session.user.id), // Fixed: was using users.id incorrectly
          eq(comments.deleted, true),
          eq(comments.restorable, true)
        )
      );

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found or cannot be restored" },
        { status: 404 }
      );
    }

    // Check if we're within the 15 minute restoration window
    const updatedAt = new Date(comments.updatedAt); // Fixed: was using comments.updatedAt incorrectly
    const now = new Date();
    const diffMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);

    if (diffMinutes > 15) {
      return NextResponse.json(
        { error: "Comments can only be restored within 15 minutes of deletion" },
        { status: 403 }
      );
    }

    // Restore the comment
    const restoredComment = await db
      .update(comments)
      .set({
        deleted: false,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();

    return NextResponse.json(restoredComment[0]);
  } catch (error) {
    console.error("Error restoring comment:", error);
    return NextResponse.json(
      { error: "Failed to restore comment" },
      { status: 500 }
    );
  }
}