import { MainLayout } from "@/components/layout/main-layout";
import { useGetMe, useListConsultations } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, CalendarClock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Portal() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: consultations, isLoading: consultsLoading } = useListConsultations({ 
    query: { enabled: !!user, queryKey: ["consultations"] } 
  });

  useEffect(() => {
    if (!userLoading && !user) setLocation("/login");
  }, [user, userLoading, setLocation]);

  if (userLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 md:px-8 py-24">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (!user) return null;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
  };

  return (
    <MainLayout>
      <div className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">{t("portal.title")}</h1>
            <p className="text-muted-foreground text-lg">{t("portal.welcome")}, {user.name}.</p>
          </div>
          <Link href="/consultation">
            <Button className="font-serif">{t("portal.newMatter")}</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
          <CalendarClock className="h-6 w-6 text-primary" /> {t("portal.activeMatters")}
        </h2>

        {consultsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full bg-card" />
            <Skeleton className="h-24 w-full bg-card" />
          </div>
        ) : !consultations?.length ? (
          <div className="bg-card border border-border border-dashed p-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">{t("portal.noMatters")}</h3>
            <p className="text-muted-foreground mb-6">{t("portal.noMattersDesc")}</p>
            <Link href="/consultation">
              <Button variant="outline">{t("portal.scheduleFirst")}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {consultations.map(c => (
              <div key={c.id} className="bg-card border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-serif font-bold">{c.practiceAreaTitle || t("portal.generalCounsel")}</h3>
                    <Badge variant="outline" className={`capitalize ${statusColors[c.status] || ""}`}>
                      {c.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{t("portal.requested")}: {format(new Date(c.createdAt), 'MMM dd, yyyy')}</p>
                    {c.scheduledAt && <p className="text-primary">{t("portal.scheduled")}: {format(new Date(c.scheduledAt), 'MMM dd, yyyy h:mm a')}</p>}
                    <p>{t("portal.duration")}: {c.durationType} | {t("portal.fee")}: AED {c.price}</p>
                  </div>
                </div>
                {c.notes && (
                  <div className="md:max-w-xs text-sm text-muted-foreground bg-background p-4 border border-border/50 rounded-sm">
                    <p className="font-semibold text-foreground mb-1">{t("portal.yourNotes")}</p>
                    <p className="line-clamp-3">{c.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
