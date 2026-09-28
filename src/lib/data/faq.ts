export interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

export const FAQ: FaqItem[] = [
  {
    id: "ley-675",
    question: "¿Cumple con la Ley 675 de Propiedad Horizontal en Colombia?",
    answer: [
      "Sí. DomusCol está construido sobre la estructura que define la Ley 675 de 2001: bienes privados, coeficientes de copropiedad, cuotas de administración, consejo y asamblea general.",
      "Las votaciones se ponderan por coeficiente y las asambleas no presenciales siguen lo previsto en el artículo 42 de la ley, con registro de quórum y acta.",
    ],
  },
  {
    id: "migracion",
    question: "¿Cómo es el proceso de migración de datos de mi conjunto?",
    answer: [
      "Nos envías la información que ya tienes, normalmente en Excel: unidades, propietarios, coeficientes y saldos de cartera. Nuestro equipo la carga, la revisa contigo y deja el conjunto listo en unas dos semanas.",
      "Mientras tanto sigues operando como siempre. No hay que cerrar el mes antes de empezar.",
    ],
  },
  {
    id: "pagos",
    question: "¿Qué métodos de pago admite para las cuotas?",
    answer: [
      "PSE, tarjetas débito y crédito, Nequi y Daviplata. El dinero llega a la cuenta bancaria del conjunto, no a DomusCol.",
      "La administración también puede registrar consignaciones y pagos en efectivo para que la cartera quede completa.",
    ],
  },
  {
    id: "app",
    question: "¿Tiene app móvil para Android e iOS?",
    answer: [
      "Sí. Residentes y personal de portería usan la app para Android y iOS; la administración y el consejo trabajan desde la versión web.",
      "Las apps se publican en Google Play y App Store con el lanzamiento de la Fase 1.",
    ],
  },
  {
    id: "datos",
    question: "¿Cómo protegen los datos personales de los residentes?",
    answer: [
      "Tratamos los datos según la Ley 1581 de 2012. Cada conjunto solo ve su propia información, los accesos se asignan por rol y los residentes pueden consultar, actualizar o pedir que se eliminen sus datos.",
    ],
  },
  {
    id: "mixto",
    question: "¿Qué pasa con los residentes que no usen la app?",
    answer: [
      "Siguen recibiendo su recibo y pagando por los canales de siempre. La administración registra esos pagos en la plataforma y la cartera del conjunto queda completa.",
    ],
  },
];
