import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { FloatingContact } from "@/components/floating-contact";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
