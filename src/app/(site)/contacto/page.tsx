import type { Metadata } from "next";
import { LeadForm } from "@/components/sections/lead-form";

const description = "Agenda una demo de DomusCol con la estructura real de tu conjunto residencial.";

export const metadata: Metadata = {
  title: "Solicitar demo",
  description,
  alternates: { canonical: "/contacto" },
  openGraph: { title: "Solicita una demo de DomusCol", description, url: "/contacto" },
};

export default function ContactoPage() {
  return <LeadForm />;
}
