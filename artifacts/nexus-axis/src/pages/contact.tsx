import { MainLayout } from "@/components/layout/main-layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  // @ts-ignore
  const submitContact = useSubmitContact();

  const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(2),
    message: z.string().min(10),
  });

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" }
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    submitContact.mutate({ data }, {
      onSuccess: () => {
        toast({ title: t("contact.messageSent"), description: t("contact.messageSentDesc") });
        form.reset();
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.error || "Failed to send message", variant: "destructive" });
      }
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-8 py-24 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{t("contact.initiateTitle")}</h1>
            <p className="text-lg text-muted-foreground mb-12">{t("contact.initiateDesc")}</p>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4 p-6 bg-card border border-border">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">{t("contact.directLine")}</h3>
                  <p className="text-xl font-medium">+971 585 592 355</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("contact.directLineAvail")}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-card border border-border">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">{t("contact.electronicMail")}</h3>
                  <p className="text-lg font-medium">info@nexusaxisconsultants.com</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("contact.emailDesc")}</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-background border border-border p-6">
                <MapPin className="h-5 w-5 text-primary mb-3" />
                <h4 className="font-bold mb-2">{t("contact.uaeOffice")}</h4>
                <p className="text-sm text-muted-foreground">Falcon Tower, Office 1204<br />Rashidiya 2, Ajman</p>
              </div>
              <div className="bg-background border border-border p-6">
                <MapPin className="h-5 w-5 text-primary mb-3" />
                <h4 className="font-bold mb-2">{t("contact.egyptOffice")}</h4>
                <p className="text-sm text-muted-foreground">Makram Ebeid Street<br />Nasr City, Cairo</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-8 md:p-10">
            <h2 className="text-2xl font-serif font-bold mb-8">{t("contact.secureTransmission")}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.name")}</FormLabel>
                      <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.emailAddr")}</FormLabel>
                      <FormControl><Input type="email" {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.phoneOptional")}</FormLabel>
                      <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.subjectMatter")}</FormLabel>
                      <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.messageContent")}</FormLabel>
                    <FormControl><Textarea className="h-32 bg-background/50" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-12" disabled={submitContact.isPending}>
                  {submitContact.isPending ? t("contact.transmitting") : t("contact.send")}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
