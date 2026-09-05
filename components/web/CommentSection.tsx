"use client";
import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function CommentSection({
  preloadedComments,
}: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const params = useParams<{ id: Id<"posts"> }>();
  const comments = usePreloadedQuery(preloadedComments);

  console.log(comments);
  const [isPending, startTransition] = useTransition();
  const createComment = useMutation(api.comments.createComment);
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.id,
    },
  });

  function onSubmit(data: z.infer<typeof commentSchema>) {
    console.log(data);
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to create post");
      }
    });
  }

  if (comments === undefined) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{comments?.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel></FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  aria-describedby="comment-error"
                  placeholder="Share your thoughts"
                  {...field}
                ></Textarea>
                {fieldState.invalid && (
                  <FieldError id="comment-error" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Post</span>
            )}
          </Button>
        </form>
        {comments?.length > 0 && <Separator />}

        <section className="space-y-6">
          {comments?.map((c) => (
            <div key={c._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${c.authorName}`}
                  alt={c.authorName}
                />
                <AvatarFallback>
                  {c.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{c.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(c._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
