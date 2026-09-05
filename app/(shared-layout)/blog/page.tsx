import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cacheLife, cacheTag } from "next/cache";

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="pb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Insights, thoughts, and treands from around the world.
        </p>
      </div>
      {/* <Suspense fallback={<SkeletonLoadingUI />}> */}
      <LoadBlogList />
      {/* </Suspense> */}
    </div>
  );
}

async function LoadBlogList() {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const data = await fetchQuery(api.posts.getPosts);
  console.log(data);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((post) => (
        <Card key={post._id} className="pt-0">
          <div className="h-48 w-full overflow-hidden relative">
            <Image
              className="rounded-t-lg object-cover"
              alt="image"
              src={
                post.url ??
                "https://images.unsplash.com/photo-1685470684419-b40b07710afd?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              fill
            ></Image>
          </div>

          <CardContent>
            <Link href={`/blog/${post._id}`}>
              <h1 className="text-2xl font-bold hover:text-primary">
                {post.title}
              </h1>
            </Link>
            <p className="text-muted-foreground line-clamp-3">{post.body}</p>
          </CardContent>
          <CardFooter className="bg-transparent border-none">
            <Link
              className={buttonVariants({ className: "w-full" })}
              href={`/blog/${post._id}`}
            >
              Read more
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUI() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="py-4 w-full" />
            <Skeleton className="py-6 w-full line-clamp-3" />
          </div>

          <Skeleton className="w-full py-4 mt-2" />
        </div>
      ))}
    </div>
  );
}
