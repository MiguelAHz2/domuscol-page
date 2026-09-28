import { company, site } from "@/lib/site";

// Legal documents for the public website, written to Ley 1581 de 2012 and
// the Decreto 1074 de 2015 (which compiles the Decreto 1377 de 2013). They
// cover the website and commercial contacts, not the data conjuntos load
// into the DomusCol platform (that goes in the service contract).
// Have a lawyer review them and fill the company data in .env before launch.

export const LEGAL_UPDATED = "28 de septiembre de 2026";

export type Block = string | { list: string[] };

export interface LegalSection {
  heading: string;
  body: Block[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  lead: string;
  sections: LegalSection[];
}

const controller = `${company.legalName}, identificada con NIT ${company.nit}, con domicilio en ${company.city} y dirección ${company.address}`;
const contact = `el correo ${company.privacyEmail} o el WhatsApp ${site.whatsappLabel}`;

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "tratamiento-de-datos",
    title: "Política de tratamiento de datos personales",
    lead: "Cómo recogemos, usamos y protegemos los datos que nos dejas en este sitio, y cómo ejercer tus derechos como titular.",
    sections: [
      {
        heading: "Responsable del tratamiento",
        body: [
          `El responsable es ${controller} (en adelante, DomusCol). Puedes contactarnos por ${contact}.`,
        ],
      },
      {
        heading: "Qué datos recogemos",
        body: [
          "Solo los que tú nos das al solicitar una demo o escribirnos:",
          {
            list: [
              "Nombre y correo electrónico.",
              "Ciudad, nombre del conjunto y número de unidades.",
              "El contenido de los mensajes que nos envíes por correo o WhatsApp.",
            ],
          },
          "No pedimos datos sensibles ni datos de niñas, niños o adolescentes. Si nos llegan sin haberlos pedido, los eliminamos.",
          "Además, para medir el uso del sitio registramos datos técnicos y agregados (páginas vistas, tipo de dispositivo, país y tiempos de carga) que no te identifican. No usamos cookies de publicidad; el detalle está en la Política de cookies.",
        ],
      },
      {
        heading: "Para qué los usamos",
        body: [
          {
            list: [
              "Responder tu solicitud, agendar y realizar la demo.",
              "Enviarte la propuesta comercial y hacer seguimiento a la conversación que iniciaste.",
              "Enviarte información sobre DomusCol, solo si nos lo autorizas expresamente.",
              "Cumplir obligaciones legales y atender requerimientos de autoridades.",
              "Mejorar el sitio con estadísticas agregadas.",
            ],
          },
          "No vendemos ni cedemos tus datos a terceros.",
        ],
      },
      {
        heading: "Quién más los procesa",
        body: [
          "Usamos proveedores que tratan los datos por nuestra cuenta y bajo nuestras instrucciones (encargados): alojamiento y analítica del sitio (Vercel), envío de correo (Resend), verificación contra bots (Cloudflare) y monitoreo de errores (Sentry). Algunos tienen servidores fuera de Colombia, por lo que los datos pueden transmitirse a otros países. Exigimos a estos proveedores medidas de seguridad y confidencialidad equivalentes a las de la ley colombiana.",
        ],
      },
      {
        heading: "Tus derechos",
        body: [
          "Como titular, puedes:",
          {
            list: [
              "Conocer, actualizar y corregir tus datos.",
              "Pedir prueba de la autorización que nos diste.",
              "Saber para qué hemos usado tus datos.",
              "Revocar la autorización o pedir que eliminemos tus datos cuando no exista un deber legal o contractual de conservarlos.",
              "Presentar quejas ante la Superintendencia de Industria y Comercio, después de haber agotado el trámite con nosotros.",
              "Acceder gratis a tus datos.",
            ],
          },
        ],
      },
      {
        heading: "Cómo ejercerlos",
        body: [
          `Escríbenos a ${company.privacyEmail} con tu nombre, el correo que usaste y lo que necesitas. Este canal lo atiende el equipo de DomusCol.`,
          {
            list: [
              "Consultas: respondemos en máximo 10 días hábiles. Si no alcanzamos, te avisamos el motivo y respondemos en máximo 5 días hábiles más.",
              "Reclamos (corrección, actualización, supresión o revocatoria): respondemos en máximo 15 días hábiles, prorrogables hasta 8 días hábiles más con aviso previo. Si el reclamo está incompleto, te pedimos lo que falte dentro de los 5 días siguientes; si no lo recibimos en 2 meses, entendemos que desististe.",
            ],
          },
        ],
      },
      {
        heading: "Seguridad y conservación",
        body: [
          "Protegemos los datos con conexiones cifradas, accesos restringidos al equipo que los necesita y proveedores con certificaciones de seguridad.",
          "Conservamos los datos de contacto comercial mientras exista la relación o la conversación, y hasta 2 años después del último contacto, salvo que pidas eliminarlos antes o una norma exija conservarlos más tiempo.",
        ],
      },
      {
        heading: "Vigencia y cambios",
        body: [
          `Esta política rige desde el ${LEGAL_UPDATED}. Si la cambiamos de forma sustancial, lo publicaremos en esta página y, si tenemos tu correo, te avisaremos antes de aplicar el cambio.`,
        ],
      },
    ],
  },
  {
    slug: "autorizacion-de-datos",
    title: "Autorización para el tratamiento de datos personales",
    lead: "El texto que aceptas al marcar la casilla del formulario de demo.",
    sections: [
      {
        heading: "Autorización",
        body: [
          `Al enviar el formulario, autorizo de manera previa, expresa e informada a ${controller}, para tratar los datos que entrego (nombre, correo, ciudad, nombre del conjunto y número de unidades) con estas finalidades: responder mi solicitud, agendar y realizar la demo, enviarme la propuesta comercial y hacer seguimiento a esa conversación.`,
          "Declaro que me informaron que:",
          {
            list: [
              "No estoy obligado a responder preguntas sobre datos sensibles o de menores de edad, y el formulario no los pide.",
              "Mis datos pueden ser procesados por proveedores de DomusCol, incluso fuera de Colombia, solo para las finalidades anteriores.",
              "Tengo derecho a conocer, actualizar, corregir y suprimir mis datos, a revocar esta autorización y a presentar quejas ante la Superintendencia de Industria y Comercio.",
              `Puedo ejercer esos derechos escribiendo a ${company.privacyEmail}, según la Política de tratamiento de datos publicada en ${site.url}/legal/tratamiento-de-datos.`,
            ],
          },
          "DomusCol conserva prueba de esta autorización (fecha, hora y datos enviados) mientras dure el tratamiento.",
        ],
      },
    ],
  },
  {
    slug: "terminos-y-condiciones",
    title: "Términos y condiciones del sitio",
    lead: "Las reglas para usar domuscol.me. El servicio DomusCol para conjuntos se rige por su propio contrato.",
    sections: [
      {
        heading: "Quiénes somos",
        body: [`Este sitio pertenece a ${controller}. Contacto: ${contact}.`],
      },
      {
        heading: "Uso del sitio",
        body: [
          "Puedes navegar el sitio y solicitar demos sin crear una cuenta. Te comprometes a dar información veraz en los formularios y a no usar el sitio para enviar spam, intentar acceder a sistemas sin autorización ni afectar su funcionamiento.",
        ],
      },
      {
        heading: "Precios y funcionalidades",
        body: [
          "Los precios publicados están en pesos colombianos, son de referencia y pueden cambiar. El valor definitivo queda en la propuesta comercial y el contrato de cada conjunto.",
          "Los módulos marcados como “Próximamente” o en fases posteriores de la hoja de ruta son planes de producto, no compromisos de entrega en una fecha.",
          "Las ilustraciones, cifras de ejemplo y el conjunto “Altos del Bosque” son demostrativos.",
        ],
      },
      {
        heading: "Propiedad intelectual",
        body: [
          "La marca DomusCol, el logotipo, los textos, las ilustraciones y el diseño del sitio pertenecen a DomusCol o se usan con licencia. Las fotografías de terceros se usan con la licencia de su autor, indicado en cada una. No puedes reproducirlos con fines comerciales sin autorización escrita.",
        ],
      },
      {
        heading: "Enlaces a terceros",
        body: [
          "El sitio enlaza a servicios de terceros como WhatsApp. Su uso se rige por las condiciones de cada servicio.",
        ],
      },
      {
        heading: "Responsabilidad",
        body: [
          "Trabajamos para que el sitio esté disponible y la información sea correcta, pero puede haber interrupciones o errores. DomusCol no responde por daños derivados del uso de la información del sitio como si fuera una oferta vinculante.",
        ],
      },
      {
        heading: "Ley aplicable",
        body: [
          `Estos términos se rigen por las leyes de la República de Colombia. Rigen desde el ${LEGAL_UPDATED} y los publicamos actualizados en esta página.`,
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Política de cookies",
    lead: "Este sitio no usa cookies de publicidad ni de seguimiento entre sitios.",
    sections: [
      {
        heading: "Qué guardamos en tu navegador",
        body: [
          {
            list: [
              "Tu preferencia de tema (claro u oscuro), en el almacenamiento local del navegador. No sale de tu equipo.",
              "Nada más, salvo lo que se explica abajo para la medición y la seguridad.",
            ],
          },
        ],
      },
      {
        heading: "Medición sin cookies",
        body: [
          "Usamos Vercel Web Analytics y Speed Insights para saber qué páginas se visitan y qué tan rápido cargan. Funcionan sin cookies y con datos agregados que no te identifican.",
        ],
      },
      {
        heading: "Seguridad",
        body: [
          "En el formulario de demo usamos Cloudflare Turnstile para distinguir personas de bots. Puede guardar datos técnicos estrictamente necesarios para esa verificación. Si activamos el monitoreo de errores (Sentry), registra fallos técnicos del sitio sin datos personales.",
          "Si el sitio muestra un video demostrativo y lo reproduces, el video lo sirve YouTube (en su modo de privacidad mejorada) o Vimeo, según sus propias políticas.",
        ],
      },
      {
        heading: "Cómo controlarlo",
        body: [
          "Puedes borrar el almacenamiento del sitio desde la configuración de tu navegador; lo único que perderás es tu preferencia de tema. Si en el futuro usamos cookies que requieran tu consentimiento, te lo pediremos antes de activarlas.",
        ],
      },
    ],
  },
];

export const legalDocument = (slug: string) => LEGAL_DOCUMENTS.find((d) => d.slug === slug);
