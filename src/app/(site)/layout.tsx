import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SkipLink } from "@/components/layout/skip-link";
import { WhatsappButton } from "@/components/layout/whatsapp-button";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Navbar />
      {children}
      <Footer />
      <WhatsappButton />
    </>
  );
}
