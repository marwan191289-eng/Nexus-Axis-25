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

const consultationSchema = z.object({
  clientName: z.string().min(2, "Name is required"),
  clientEmail: z.string().email("Invalid email"),
  clientPhone: z.string().optional(),
  practiceAreaId: z.coerce.number().optional(),
  durationType: z.enum(["30min", "60min", "90min"]),
  scheduledAt: z.string().optional(),
  notes: z.string().optional()
});

const pricing = {
  "30min": { price: "AED 500", label: "Initial Assessment" },
  "60min": { price: "AED 800", label: "Standard Consultation" },
  "90min": { price: "AED 1100", label: "Deep Dive Strategy" }
};

export default function Consultation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { data: areas } = useListPracticeAreas();
  const createConsultation = useCreateConsultation();

  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      durationType: "60min",
      notes: ""
    }
  });

  const duration = form.watch("durationType");

  const onSubmit = (data: z.infer<typeof consultationSchema>) => {
    createConsultation.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Consultation Requested",
          description: "We will contact you shortly to confirm the schedule."
        });
        setLocation("/portal");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.error || "Failed to book consultation",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-8 py-24 max-w-6xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Book a Consultation</h1>
          <p className="text-lg text-muted-foreground">
            Clear, actionable legal strategy begins here. Select your required time and provide initial context for our meeting.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="bg-card border border-border p-8 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="space-y-6">
                  <h3 className="text-xl font-serif font-semibold border-b border-border pb-2">Client Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl><Input placeholder="+971 50 000 0000" {...field} className="bg-background/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6 pt-6">
                  <h3 className="text-xl font-serif font-semibold border-b border-border pb-2">Consultation Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="practiceAreaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Practice Area</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Select relevant area" />
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
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="durationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="30min">30 Minutes - Initial</SelectItem>
                              <SelectItem value="60min">60 Minutes - Standard</SelectItem>
                              <SelectItem value="90min">90 Minutes - Extended</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Context</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide any context that will help us prepare for the consultation..." 
                            className="h-32 bg-background/50 resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-serif" disabled={createConsultation.isPending}>
                  {createConsultation.isPending ? "Processing..." : "Confirm Request"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-8">
              <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Duration</span>
                  <span className="font-medium text-foreground">{duration}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground">{pricing[duration as keyof typeof pricing].label}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="font-serif text-lg">Total</span>
                  <span className="font-serif text-2xl font-bold text-primary">{pricing[duration as keyof typeof pricing].price}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-8">
              <h4 className="font-serif font-bold mb-4">What to expect</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary">•</span> A structured assessment of your legal position</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Identification of immediate risks and liabilities</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Preliminary strategy discussion</li>
                <li className="flex gap-2"><span className="text-primary">•</span> Clear next steps and required documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
