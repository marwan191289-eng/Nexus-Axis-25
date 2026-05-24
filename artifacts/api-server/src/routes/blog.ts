import { Router, type IRouter } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  ListBlogPostsQueryParams,
  GetBlogPostParams,
  ListBlogPostsResponse,
  GetBlogPostResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const query = ListBlogPostsQueryParams.safeParse(req.query);
  const limit = query.success && query.data.limit ? query.data.limit : 20;
  const category = query.success ? query.data.category : undefined;

  let posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.publishedAt));

  if (category) {
    posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  posts = posts.slice(0, limit);

  res.json(ListBlogPostsResponse.parse(posts.map(p => ({
    ...p,
    publishedAt: p.publishedAt.toISOString(),
  }))));
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, params.data.id));
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(GetBlogPostResponse.parse({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
  }));
});

export default router;
