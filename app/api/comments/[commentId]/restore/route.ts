// app/api/comments/[commentId]/restore/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { comments } from "@/database/schema";
import { eq, and } from "drizzle-orm";

// Define the Params type as a Promise
type Params = Promise<{ commentId: string }>;

// Restore a deleted comment (within 15 minutes of deletion)
export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Await the params Promise to get the commentId
    const { commentId } = await params;
    
    // Check if user owns the comment and it's deleted
    const [comment] = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, commentId),
          eq(comments.authorId, session.user.id), // Now session.user.id is definitely defined
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
    // Ensure updatedAt is definitely a Date before using it
    if (!comment.updatedAt) {
      return NextResponse.json(
        { error: "Comment has invalid timestamp" },
        { status: 500 }
      );
    }
    
    const updatedAt = new Date(comment.updatedAt);
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