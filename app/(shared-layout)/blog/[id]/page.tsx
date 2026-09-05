import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchAuthQuery } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PostIdRouteProps {
  params: Promise<{ id: Id<"posts"> }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchQuery(api.posts.getPostById, { id: id });

  if (!post)
    return {
      title: "Post not found",
    };
  return {
    title: post.title,
    description: post.body,
  };
}

export default async function BlogPost({ params }: PostIdRouteProps) {
  const { id } = await params;

  const [post, preloadedComments] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { id: id }),
    await preloadQuery(api.comments.getCommentsByPostId, { postId: id }),
  ]);

  const userId = await fetchAuthQuery(api.presence.getUserId);
  if (!userId) return redirect("/auth/login");

  if (!post) return <h1>No post found</h1>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href="/blog"
      >
        <ArrowLeft className="size-4" /> Back to blog
      </Link>

      <div className="relative w-full h-100 mb--8 rounded-xl overflow-hidden shadow-sm">
        <Image
          className="object-cover hover:scale-105 transition-transform duration-500"
          fill
          alt="image"
          src={
            post.url ??
            "https://images.unsplash.com/photo-1685470684419-b40b07710afd?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Posted on:{" "}
            {new Date(post._creationTime).toLocaleDateString("en-US")}
          </p>
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
        <Separator />

        <p className="text-lg leading-relaxed text-foorground/90 whitespace-pre-wrap">
          {post.body}
        </p>
        <Separator className="my-8" />

        <div>
          <CommentSection preloadedComments={preloadedComments} />
        </div>
      </div>
    </div>
  );
}
