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
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "971585592355";
const EMAIL = "info@nexusaxisconsultants.com";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
      {/* Page Header */}
      <div className="bg-card border-b border-border py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 end-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">{t("contact.badge", { defaultValue: "Get In Touch" })}</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{t("contact.initiateTitle")}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">{t("contact.initiateDesc")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16 max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-12 xl:gap-16">

          {/* Left column — contact methods */}
          <div className="lg:col-span-2 space-y-5">

            {/* Phone */}
            <a
              href="tel:+971585592355"
              className="group flex items-start gap-5 p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="h-12 w-12 bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-primary transition-colors">{t("contact.directLine")}</h3>
                <p className="text-xl font-medium" dir="ltr">+971 585 592 355</p>
                <p className="text-sm text-muted-foreground mt-1">{t("contact.directLineAvail")}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" aria-hidden="true" />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp — +971 585 592 355"
              className="group flex items-start gap-5 p-6 bg-[#25D366]/5 border border-[#25D366]/20 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/10"
            >
              <div className="h-12 w-12 bg-[#25D366]/15 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/25 transition-colors">
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-lg mb-1 text-[#25D366]">WhatsApp</h3>
                <p className="text-xl font-medium" dir="ltr">+971 585 592 355</p>
                <p className="text-sm text-muted-foreground mt-1">{t("contact.whatsappDesc", { defaultValue: "Chat directly — quick responses" })}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#25D366]/50 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all shrink-0 mt-1" aria-hidden="true" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-start gap-5 p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="h-12 w-12 bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-primary transition-colors">{t("contact.electronicMail")}</h3>
                <p className="text-base font-medium break-all">{EMAIL}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("contact.emailDesc")}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" aria-hidden="true" />
            </a>

            {/* Offices */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-background border border-border p-6 group hover:border-primary/40 transition-colors">
                <MapPin className="h-5 w-5 text-primary mb-3" aria-hidden="true" />
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider">{t("contact.uaeOffice")}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Falcon Tower, Office 1204<br />
                  Rashidiya 2, Ajman<br />
                  United Arab Emirates
                </p>
              </div>
              <div className="bg-background border border-border p-6 group hover:border-primary/40 transition-colors">
                <MapPin className="h-5 w-5 text-primary mb-3" aria-hidden="true" />
                <h4 className="font-bold mb-2 text-sm uppercase tracking-wider">{t("contact.egyptOffice")}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Makram Ebeid Street<br />
                  Nasr City, Cairo<br />
                  Egypt
                </p>
              </div>
            </div>
          </div>

          {/* Right column — contact form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" />
              <h2 className="text-2xl font-serif font-bold mb-2">{t("contact.secureTransmission")}</h2>
              <p className="text-muted-foreground text-sm mb-8">{t("contact.formDesc", { defaultValue: "Fill in the form and we'll respond within one business day." })}</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.name")}</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50 focus:border-primary/50 transition-colors" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.emailAddr")}</FormLabel>
                        <FormControl><Input type="email" {...field} className="bg-background/50 focus:border-primary/50 transition-colors" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.phoneOptional")}</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50 focus:border-primary/50 transition-colors" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.subjectMatter")}</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50 focus:border-primary/50 transition-colors" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contact.messageContent")}</FormLabel>
                      <FormControl><Textarea className="h-36 bg-background/50 focus:border-primary/50 transition-colors resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full h-13 text-base font-serif gap-2" disabled={submitContact.isPending}>
                    {submitContact.isPending ? t("contact.transmitting") : t("contact.send")}
                    {!submitContact.isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Quick action CTA below form */}
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 h-13 px-6 bg-[#25D366] text-white font-semibold hover:bg-[#22c55e] transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>{t("contact.chatWhatsApp", { defaultValue: "Chat on WhatsApp" })}</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="group flex items-center justify-center gap-3 h-13 px-6 border border-border bg-background hover:border-primary/50 hover:bg-primary/5 text-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
              >
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>{t("contact.sendEmail", { defaultValue: "Send Email" })}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
