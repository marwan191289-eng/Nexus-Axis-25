import { MainLayout } from "@/components/layout/main-layout";
import { useGetBlogPost } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BlogPostDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  // @ts-ignore
  const { data: post, isLoading } = useGetBlogPost(id, { query: { enabled: !!id, queryKey: ["blog-post", id] } });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 md:px-8 py-24 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-6 w-1/3 mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </MainLayout>
    );
  }

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
      {post.imageUrl && (
        <div className="w-full h-[40vh] relative border-b border-border">
          <img src={post.imageUrl} alt="" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}
      
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("insights.backTo")}
        </Link>
        
        <header className="mb-16">
          <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            <span className="text-primary">{post.category}</span>
            <span>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-8">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 border-l-2 border-primary pl-6 py-2">
            <div>
              <p className="font-medium text-foreground">{post.author}</p>
              <p className="text-sm text-muted-foreground">{t("insights.partner")}</p>
            </div>
          </div>
        </header>
        
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="lead text-xl text-muted-foreground mb-10 pb-10 border-b border-border">
            {post.excerpt}
          </p>
          <div className="whitespace-pre-line text-foreground/90 leading-loose" dangerouslySetInnerHTML={{__html: post.content}} />
        </div>
      </div>
    </MainLayout>
  );
}
