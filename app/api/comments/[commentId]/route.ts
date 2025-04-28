import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { comments } from "@/database/schema";
import { eq, and } from "drizzle-orm";

// Define the Params type as a Promise
type Params = Promise<{ commentId: string }>;

// Edit a comment (within 15 minutes of creation)
export async function PUT(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = await params;
    const { content } = await req.json();
    
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }
    
    // Get the comment to check if it can be edited
    const [comment] = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, commentId),
          // Type assertion to handle possible undefined user.id
          eq(comments.authorId, session.user.id as string),
          eq(comments.deleted, false)
        )
      );
    
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found or you don't have permission to edit" },
        { status: 404 }
      );
    }
    
    // Check if we're within the 15 minute edit window
    // Handle potential null createdAt with fallback
    const createdAt = comment.createdAt ? new Date(comment.createdAt) : new Date();
    const now = new Date();
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    
    if (diffMinutes > 15) {
      return NextResponse.json(
        { error: "Comments can only be edited within 15 minutes of posting" },
        { status: 403 }
      );
    }
    
    // Update the comment
    const updatedComment = await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning();
    
    return NextResponse.json(updatedComment[0]);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// Delete a comment (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { commentId } = await params;
    
    // Check if user owns the comment
    const [comment] = await db
      .select()
      .from(comments)
      .where(
        and(
          eq(comments.id, commentId),
          // Type assertion to handle possible undefined user.id
          eq(comments.authorId, session.user.id as string),
          eq(comments.deleted, false)
        )
      );
    
    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found or you don't have permission to delete" },
        { status: 404 }
      );
    }
    
    // Soft delete the comment
    await db
      .update(comments)
      .set({
        deleted: true,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}