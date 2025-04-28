import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { comments, users } from "@/database/schema";
import { desc, eq, and, isNull } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topLevelComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          name: users.fullName,
        },
        deleted: comments.deleted,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(and(isNull(comments.parentId), eq(comments.deleted, false)))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(topLevelComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, parentId } = await req.json();

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    const newComment = await db
      .insert(comments)
      .values({
        content: content,
        authorId: session.user.id as string,  // ✨ force TypeScript: "session.user.id" IS string
        parentId: parentId ?? null,            // ✨ Use null if undefined
      })
      .returning();

    return NextResponse.json(newComment[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
