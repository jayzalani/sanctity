"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import CommentThread from "./CommentThread";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Form, FormControl, FormField, FormItem } from "./ui/form";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

type Author = {
  id: string;
  name: string;
};

type CommentType = {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
};

const CommentSection = () => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/comments");
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const onSubmit = async (values: CommentFormValues) => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset();
        fetchComments(); // Refresh comments after posting
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 font-jetbrains-semiBold">
      <h2 className="text-3xl font-bold mb-8">Comments</h2>

      {session && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add a comment..."
                      className="h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="mt-2 bg-amber-400 text-black hover:bg-amber-500"
              disabled={form.formState.isSubmitting}
            >
              Post Comment
            </Button>
          </form>
        </Form>
      )}

      {loading ? (
        <div className="text-center">Loading comments...</div>
      ) : (
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center text-gray-500">No comments yet. Be the first to comment!</div>
          ) : (
            comments.map((comment) => (
              <CommentThread 
                key={comment.id} // Fixed: was using comments.id instead of comment.id
                comment={comment} 
                onCommentUpdate={fetchComments} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;