import { MainLayout } from "@/components/layout/main-layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLogin } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const login = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate({ data }, {
      onSuccess: () => { window.location.href = "/portal"; },
      onError: (err: any) => {
        toast({ title: "Authentication Failed", description: err.error || "Invalid credentials", variant: "destructive" });
      }
    });
  };

  return (
    <MainLayout>
      <div className="flex-1 flex items-center justify-center py-24 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2">{t("auth.loginTitle")}</h1>
            <p className="text-muted-foreground">{t("auth.loginSubtitle")}</p>
          </div>

          <div className="bg-card border border-border p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.email")}</FormLabel>
                    <FormControl><Input type="email" {...field} className="bg-background/50" /></FormControl>
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
                <Button type="submit" className="w-full h-12 font-serif text-lg" disabled={login.isPending}>
                  {login.isPending ? t("auth.authenticating") : t("auth.enterPortal")}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              {t("auth.noAccount")} <Link href="/register" className="text-primary hover:underline">{t("auth.registerHere")}</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
