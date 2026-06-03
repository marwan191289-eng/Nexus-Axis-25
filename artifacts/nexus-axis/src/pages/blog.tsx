import { MainLayout } from "@/components/layout/main-layout";
import { PageSEO } from "@/components/page-seo";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string | undefined>();
  // @ts-ignore
  const { data: postsRaw, isLoading } = useListBlogPosts(category ? { category } : undefined, { query: { queryKey: ["blog-posts", category] } });
  const posts = Array.isArray(postsRaw) ? postsRaw : (postsRaw as any)?.data ?? [];

  const categories = [
    { label: t("insights.all"), value: undefined },
    { label: t("insights.corporate"), value: "Corporate" },
    { label: t("insights.realEstate"), value: "Real Estate" },
    { label: t("insights.disputeResolution"), value: "Dispute Resolution" },
    { label: t("insights.regulatory"), value: "Regulatory" },
    { label: t("insights.immigration"), value: "Immigration" },
  ];

  return (
    <MainLayout>
      <PageSEO
        title="Legal Insights"
        path="/blog"
        description="Strategic legal analysis, regulatory updates, and commercial intelligence from the partners of Nexus Axis Consultants. Covering UAE law, Egyptian law, corporate tax, and MENA business."
      />
      <div className="bg-card border-b border-border py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
              {t("insights.badge")}
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">{t("insights.title")}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("insights.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
          {categories.map((c, i) => (
            <button
              key={i}
              onClick={() => setCategory(c.value)}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] border transition-all duration-200 whitespace-nowrap ${
                category === c.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 bg-card border border-border" />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group flex flex-col bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                {post.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    <span className="text-primary">{post.category}</span>
                    <span>{format(new Date(post.publishedAt), "MMM dd, yyyy")}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6">{post.excerpt}</p>
                  <div className="mt-auto text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("insights.by")} {post.author}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 py-20 text-center text-muted-foreground">
              <p className="text-lg">{t("insights.noResults")}</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
