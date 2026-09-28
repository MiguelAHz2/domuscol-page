import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsappButton } from "@/components/layout/whatsapp-button";
import { GlassEffects } from "@/components/ui/glass-effects";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlassEffects />
      <Navbar />
      {children}
      <Footer />
      <WhatsappButton />
    </>
  );
}
