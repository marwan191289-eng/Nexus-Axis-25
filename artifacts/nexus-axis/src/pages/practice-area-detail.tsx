import { MainLayout } from "@/components/layout/main-layout";
import { useGetPracticeArea, getGetPracticeAreaQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Briefcase } from "lucide-react";

export default function PracticeAreaDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: area, isLoading } = useGetPracticeArea(id, { 
    query: { 
      enabled: !!id,
      queryKey: getGetPracticeAreaQueryKey(id)
    }
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 md:px-8 py-24">
          <Skeleton className="h-8 w-32 mb-12" />
          <Skeleton className="h-16 w-3/4 mb-6" />
          <Skeleton className="h-6 w-full mb-12" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!area) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 md:px-8 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Practice Area Not Found</h1>
          <Link href="/practice-areas">
            <Button variant="outline">Return to Practice Areas</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-8 py-16">
        <Link href="/practice-areas" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Practice Areas
        </Link>
        
        <div className="grid md:grid-cols-[2fr_1fr] gap-16 items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 bg-primary/10 flex items-center justify-center border border-primary/20">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">{area.title}</h1>
            </div>
            
            <p className="text-xl text-muted-foreground leading-relaxed border-l-2 border-primary pl-6">
              {area.description}
            </p>
            
            <div className="prose prose-invert max-w-none pt-8">
              <p className="whitespace-pre-line text-foreground/80 leading-loose text-lg">
                {area.details}
              </p>
            </div>
          </div>
          
          <div className="sticky top-32 bg-card border border-border p-8">
            <h3 className="text-2xl font-serif font-bold mb-4">Require Counsel?</h3>
            <p className="text-muted-foreground mb-8">
              Schedule a consultation to discuss your specific matter within {area.title}. We provide discrete, actionable intelligence.
            </p>
            <Link href="/consultation">
              <Button className="w-full h-12 font-serif text-lg">
                Book Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
