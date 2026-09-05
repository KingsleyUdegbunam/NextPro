"use server";

import { api } from "@/convex/_generated/api";
import z from "zod";
import { postSchema } from "./schemas/blog";
import { redirect } from "next/navigation";
import { fetchAuthMutation } from "@/lib/auth-server";
import { updateTag } from "next/cache";

export async function CreateBlogPost(values: z.infer<typeof postSchema>) {
  try {
    const parsed = postSchema.safeParse(values);

    if (!parsed.success) {
      throw new Error("Something went wrong");
    }
    const uploadUrl: string = await fetchAuthMutation(
      api.posts.generateImageUploadUrl,
    );

    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": parsed.data.image.type },
      body: parsed.data.image,
    });

    if (!result.ok) {
      return { error: "Failed to upload image" };
    }
    const { storageId } = await result.json();

    await fetchAuthMutation(api.posts.createPost, {
      title: parsed.data.title,
      body: parsed.data.content,
      imageStorageId: storageId,
    });
  } catch {
    return {
      error: "Failed to create post",
    };
  }
  updateTag("blogs");
  return redirect("/blog");
}
