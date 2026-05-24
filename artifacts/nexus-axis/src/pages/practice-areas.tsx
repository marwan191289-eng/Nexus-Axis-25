import { MainLayout } from "@/components/layout/main-layout";
import { useListPracticeAreas } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function PracticeAreas() {
  const { data: areas, isLoading } = useListPracticeAreas();

  return (
    <MainLayout>
      <div className="bg-card border-b border-border py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Practice Areas</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Deep expertise across specific legal domains. We provide authoritative counsel and representation where stakes are highest.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 bg-card border border-border" />
            ))
          ) : (
            areas?.map((area) => (
              <Link 
                key={area.id} 
                href={`/practice-areas/${area.id}`}
                className="group relative bg-card border border-border p-10 hover:border-primary/50 transition-colors flex flex-col h-full hover-elevate"
              >
                <Briefcase className="h-8 w-8 text-primary mb-8" />
                <h2 className="text-2xl font-serif font-bold mb-4 group-hover:text-primary transition-colors">{area.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {area.description}
                </p>
                <div className="mt-auto flex items-center font-medium uppercase tracking-wider text-sm text-foreground group-hover:text-primary transition-colors">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
