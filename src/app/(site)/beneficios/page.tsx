import type { Metadata } from "next";
import { FinalCta } from "@/components/layout/final-cta";
import residente from "@/assets/images/residente-celular.jpg";
import { PageHero } from "@/components/layout/page-hero";
import { Profiles } from "@/components/sections/profiles";

const description =
  "Qué gana cada persona del conjunto con DomusCol: administradores, residentes, consejo de administración y portería.";

export const metadata: Metadata = {
  title: "Beneficios",
  description,
  alternates: { canonical: "/beneficios" },
  openGraph: { title: "Beneficios de DomusCol", description, url: "/beneficios" },
};

export default function BeneficiosPage() {
  return (
    <>
      <PageHero
        title="Cada quien ve lo que necesita"
        lead="La misma información del conjunto, organizada según el papel de cada persona: quien administra, quien vive ahí y quien vigila."
        image={{ src: residente, alt: "Residente usando su celular", position: "40% 30%", credit: "Julio López" }}
      />
      <Profiles />
      <FinalCta />
    </>
  );
}
