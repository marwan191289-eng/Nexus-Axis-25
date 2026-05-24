import { MainLayout } from "@/components/layout/main-layout";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useState } from "react";
import { format } from "date-fns";

export default function Blog() {
  const [category, setCategory] = useState<string | undefined>();
  // @ts-ignore
  const { data: posts, isLoading } = useListBlogPosts(category ? { category } : undefined, { query: { queryKey: ["blog-posts", category] } });

  const categories = ["All", "Corporate", "Real Estate", "Dispute Resolution"];

  return (
    <MainLayout>
      <div className="bg-card border-b border-border py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Insights & Intelligence</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Legal analysis, regulatory updates, and strategic thinking from our partners.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c === "All" ? undefined : c)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                (category === c || (c === "All" && !category)) 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 bg-card border border-border" />
            ))
          ) : (
            posts?.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.id}`}
                className="group flex flex-col bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover-elevate"
              >
                {post.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    <span className="text-primary">{post.category}</span>
                    <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground line-clamp-3 mb-6">{post.excerpt}</p>
                  <div className="mt-auto text-sm font-medium">By {post.author}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
