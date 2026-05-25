import { MainLayout } from "@/components/layout/main-layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateConsultation, useListPracticeAreas } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Calendar, Clock, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

const consultationSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  practiceAreaId: z.coerce.number().optional(),
  durationType: z.enum(["30min", "60min", "90min"]),
  scheduledAt: z.string().optional(),
  notes: z.string().optional()
});

const pricingMap = {
  "30min": { price: "AED 500", labelKey: "pricing.tier1Name" },
  "60min": { price: "AED 800", labelKey: "pricing.tier2Name" },
  "90min": { price: "AED 1,100", labelKey: "pricing.tier3Name" }
};

export default function Consultation() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: areas } = useListPracticeAreas();
  const createConsultation = useCreateConsultation();

  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { clientName: "", clientEmail: "", clientPhone: "", durationType: "60min", notes: "" }
  });

  const duration = form.watch("durationType");

  const onSubmit = (data: z.infer<typeof consultationSchema>) => {
    createConsultation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: t("consultation.requested"), description: t("consultation.requestedDesc") });
        setLocation("/portal");
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.error || "Failed to book consultation", variant: "destructive" });
      }
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-8 py-24 max-w-6xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{t("consultation.title")}</h1>
          <p className="text-lg text-muted-foreground">{t("consultation.bookDesc")}</p>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="bg-card border border-border p-8 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-semibold border-b border-border pb-2">{t("consultation.clientInfo")}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="clientName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("consultation.name")}</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} className="bg-background/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="clientEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("consultation.email")}</FormLabel>
                        <FormControl><Input type="email" placeholder="john@example.com" {...field} className="bg-background/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="clientPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.phoneOptional")}</FormLabel>
                      <FormControl><Input placeholder="+971 50 000 0000" {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="space-y-6 pt-6">
                  <h3 className="text-xl font-serif font-semibold border-b border-border pb-2">{t("consultation.consultationDetails")}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="practiceAreaId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("consultation.practiceArea")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder={t("consultation.selectRelevant")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {areas?.map(area => (
                              <SelectItem key={area.id} value={area.id.toString()}>{area.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="durationType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("consultation.duration")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder={t("consultation.selectDurationPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="30min">{t("consultation.dur30")}</SelectItem>
                            <SelectItem value="60min">{t("consultation.dur60")}</SelectItem>
                            <SelectItem value="90min">{t("consultation.dur90")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("consultation.briefContext")}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t("consultation.contextPlaceholder")} className="h-32 bg-background/50 resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-serif" disabled={createConsultation.isPending}>
                  {createConsultation.isPending ? t("consultation.processing") : t("consultation.confirmRequest")}
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-8">
              <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> {t("consultation.summary")}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> {t("consultation.durationLabel")}</span>
                  <span className="font-medium text-foreground">{duration}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">{t("consultation.type")}</span>
                  <span className="font-medium text-foreground">{t(pricingMap[duration as keyof typeof pricingMap].labelKey)}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="font-serif text-lg">{t("consultation.total")}</span>
                  <span className="font-serif text-2xl font-bold text-primary">{pricingMap[duration as keyof typeof pricingMap].price}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-8">
              <h4 className="font-serif font-bold mb-4">{t("consultation.whatToExpect")}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary">•</span> {t("consultation.expect1")}</li>
                <li className="flex gap-2"><span className="text-primary">•</span> {t("consultation.expect2")}</li>
                <li className="flex gap-2"><span className="text-primary">•</span> {t("consultation.expect3")}</li>
                <li className="flex gap-2"><span className="text-primary">•</span> {t("consultation.expect4")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
