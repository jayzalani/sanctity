import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { comments, users } from "@/database/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { commentId: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId } = params; // params is now destructured from the second argument

    const replies = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          name: users.fullName,
        },
        parentId: comments.parentId,
        deleted: comments.deleted,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(and(eq(comments.parentId, commentId), eq(comments.deleted, false)))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 });
  }
}
