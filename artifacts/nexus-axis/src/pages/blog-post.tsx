import { MainLayout } from "@/components/layout/main-layout";
import { PageSEO } from "@/components/page-seo";
import { useGetBlogPost, useListBlogPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, Calendar, Mail, MessageSquare, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

function ArticleSkeleton() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-7xl">
        <Skeleton className="h-5 w-28 mb-12 bg-card" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
          <div>
            <Skeleton className="h-8 w-32 mb-8 bg-card" />
            <Skeleton className="h-20 w-full mb-4 bg-card" />
            <Skeleton className="h-10 w-2/3 mb-12 bg-card" />
            <Skeleton className="h-px w-full mb-12 bg-card" />
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className={`h-4 bg-card ${i % 5 === 4 ? "w-2/3" : "w-full"}`} />
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-64 w-full bg-card" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function BlogPostDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const id = parseInt(params.id || "0", 10);

  // @ts-ignore
  const { data: post, isLoading } = useGetBlogPost(id, { query: { enabled: !!id, queryKey: ["blog-post", id] } });
  // @ts-ignore
  const { data: allPostsRaw } = useListBlogPosts(undefined, { query: { queryKey: ["blog-posts-sidebar"] } });
  const allPosts = (Array.isArray(allPostsRaw) ? allPostsRaw : (allPostsRaw as any)?.data ?? []) as any[];
  const related = allPosts.filter((p: any) => p.id !== id && p.category === post?.category).slice(0, 3);

  if (isLoading) return <ArticleSkeleton />;

  if (!post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 md:px-8 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{t("insights.notFound")}</h1>
          <Link href="/blog" className="text-primary hover:underline">{t("insights.returnTo")}</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageSEO
        title={post.title}
        path={`/blog/${post.id}`}
        description={post.excerpt}
        image={post.imageUrl ?? undefined}
      />

      {/* Hero banner */}
      {post.imageUrl && (
        <div className="w-full h-[42vh] min-h-[280px] relative border-b border-border overflow-hidden">
          <img
            src={post.imageUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 py-14 max-w-7xl">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          {t("insights.backTo")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16 items-start">
          {/* ── Article body ── */}
          <article>
            {/* Category + date */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-[3rem] font-serif font-bold leading-[1.15] mb-8 text-foreground">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-4 border-s-2 border-primary ps-5 py-2 mb-10">
              <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{post.author}</p>
                <p className="text-xs text-muted-foreground">{t("insights.partner")}</p>
              </div>
            </div>

            {/* Excerpt lead */}
            <p className="text-xl text-muted-foreground leading-relaxed pb-10 mb-10 border-b border-border">
              {post.excerpt}
            </p>

            {/* Article HTML content */}
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4 text-primary" />
                <span>{post.category}</span>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                More Insights <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-serif font-bold mb-6 text-foreground">Related Insights</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((rp: any) => (
                    <Link
                      key={rp.id}
                      href={`/blog/${rp.id}`}
                      className="group bg-card border border-border hover:border-primary/40 p-6 transition-all duration-200 flex flex-col"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                        {rp.category}
                      </span>
                      <h3 className="font-serif font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-3">
                        {rp.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-8 space-y-5">
            {/* Consultation CTA */}
            <div className="relative bg-card border border-border overflow-hidden">
              <div className="absolute top-0 start-0 end-0 h-0.5 bg-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative p-7">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3">
                  Legal Counsel
                </p>
                <h3 className="text-lg font-serif font-bold mb-3 leading-tight">
                  Need advice on this area?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Our partners provide decisive, confidential counsel on{" "}
                  <span className="text-foreground font-medium">{post.category.toLowerCase()}</span> matters
                  across UAE and Egypt.
                </p>
                <Link href="/consultation">
                  <button className="w-full h-11 bg-primary text-primary-foreground font-serif font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mb-3">
                    Book a Consultation <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <a
                  href="https://wa.me/971585592355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 border border-[#25D366]/40 text-[#25D366] font-semibold text-sm hover:bg-[#25D366]/10 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Direct contact */}
            <div className="bg-card border border-border p-6">
              <h4 className="font-semibold text-sm mb-4 text-foreground">Direct Contact</h4>
              <a
                href="mailto:info@nexusaxisconsultants.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors mb-3"
              >
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="break-all">info@nexusaxisconsultants.com</span>
              </a>
              <a
                href="tel:+971585592355"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                dir="ltr"
              >
                <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                +971 585 592 355
              </a>
            </div>

            <p className="text-xs text-muted-foreground text-center px-2 leading-relaxed">
              UAE office hours: Sun–Thu, 9 am – 6 pm GST.<br />
              We respond to urgent matters outside hours.
            </p>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
