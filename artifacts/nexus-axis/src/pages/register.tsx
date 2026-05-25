import { MainLayout } from "@/components/layout/main-layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegister } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6)
});

export default function Register() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const register = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "" }
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    register.mutate({ data }, {
      onSuccess: () => { window.location.href = "/portal"; },
      onError: (err: any) => {
        toast({ title: "Registration Failed", description: err.error || "Could not register", variant: "destructive" });
      }
    });
  };

  return (
    <MainLayout>
      <div className="flex-1 flex items-center justify-center py-24 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">{t("auth.registerTitle")}</h1>
            <p className="text-muted-foreground">{t("auth.registerSubtitle")}</p>
          </div>

          <div className="bg-card border border-border p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.name")}</FormLabel>
                    <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.email")}</FormLabel>
                    <FormControl><Input type="email" {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.phone")}</FormLabel>
                    <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.password")}</FormLabel>
                    <FormControl><Input type="password" {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-12 font-serif text-lg" disabled={register.isPending}>
                  {register.isPending ? t("auth.processing") : t("auth.createIdentity")}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              {t("auth.hasAccount")} <Link href="/login" className="text-primary hover:underline">{t("auth.authenticate")}</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
