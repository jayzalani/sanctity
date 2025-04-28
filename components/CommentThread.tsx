"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
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

type CommentProps = {
  comment: CommentType;
  onCommentUpdate: () => void;
};

const CommentThread = ({ comment, onCommentUpdate }: CommentProps) => {
  const { data: session } = useSession();
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const editForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments/${comment.id}/replies`);
      if (response.ok) {
        const data = await response.json();
        setReplies(data);
        setShowReplies(true);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setIsReplying(!isReplying);
  };

  const handleToggleReplies = () => {
    if (!showReplies) {
      fetchReplies();
    } else {
      setShowReplies(false);
    }
  };

  const submitReply = async (values: CommentFormValues) => {
    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: values.content,
          parentId: comment.id,
        }),
      });

      if (response.ok) {
        form.reset();
        setIsReplying(false);
        fetchReplies();
        onCommentUpdate();
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const submitEdit = async (values: CommentFormValues) => {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setIsEditing(false);
        onCommentUpdate();
      } else {
        const error = await response.json();
        console.error("Error editing comment:", error);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleRestore = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}/restore`, {
        method: "POST",
      });

      if (response.ok) {
        onCommentUpdate();
      }
    } catch (error) {
      console.error("Error restoring comment:", error);
    }
  };

  // Fixed: Safely check for session?.user?.id
  const isAuthor = session?.user?.id === comment.author.id;
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  const wasEdited = comment.createdAt !== comment.updatedAt;

  if (comment.deleted) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg">
        <p className="text-gray-500 italic">This comment has been deleted.</p>
        {isAuthor && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRestore}
            className="mt-2"
          >
            Restore
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{comment.author.name}</p>
          <p className="text-sm text-gray-500">
            {formattedDate} {wasEdited && "(edited)"}
          </p>
        </div>
        {isAuthor && !isEditing && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button 
              className="bg-red-700" 
              size="sm" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(submitEdit)} className="mt-2">
            <FormField
              control={editForm.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2 mt-2">
              <Button 
                type="submit" 
                size="sm"
                disabled={editForm.formState.isSubmitting}
              >
                Save
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p className="mt-2">{comment.content}</p>
      )}

      <div className="mt-4 flex gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReplyClick}
        >
          Reply
        </Button>
        {(replies.length > 0 || loading) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleReplies}
          >
            {loading ? "Loading...😅" : showReplies ? `Hide Replies (${replies.length})` : `Show Replies (${replies.length})`}
          </Button>
        )}
      </div>

      {isReplying && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitReply)} className="mt-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write a reply..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2 mt-2">
              <Button 
                type="submit" 
                size="sm"
                disabled={form.formState.isSubmitting}
              >
                Post Reply
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {showReplies && (
        <div className="ml-6 mt-4 border-l-2 border-gray-200 pl-4 space-y-4">
          {replies.map((reply) => (
            <CommentThread 
              key={reply.id} 
              comment={reply} 
              onCommentUpdate={fetchReplies} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;