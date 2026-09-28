import type { Metadata } from "next";
import { FinalCta } from "@/components/layout/final-cta";
import { PageHero } from "@/components/layout/page-hero";
import { Pricing } from "@/components/sections/pricing";

const description =
  "Precio mensual por unidad privada, simulador para tu conjunto y cálculo del tiempo que ahorra la administración.";

export const metadata: Metadata = {
  title: "Precios",
  description,
  alternates: { canonical: "/precios" },
  openGraph: { title: "Precios de DomusCol", description, url: "/precios" },
};

export default function PreciosPage() {
  return (
    <>
      <PageHero
        title="Un precio por unidad, según el tamaño de tu conjunto"
        lead="Pagas un valor mensual por cada unidad privada. Los conjuntos que entren en el lanzamiento no pagan implementación."
      />
      <Pricing />
      <FinalCta title="¿Quieres una cotización exacta?" text="Te la enviamos con la estructura de tu conjunto: torres, unidades y coeficientes." />
    </>
  );
}
