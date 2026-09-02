import type { Locale } from '../i18n/ui';

export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
}

export interface TimelineData {
  careerJourney: TimelineEntry[];
  education: EducationEntry[];
}

// Fonte única da trajetória — localizada por idioma.
// careerJourney = só Trabalho (4); Formação vive em `education` (3) — sem duplicatas.
export const timeline: Record<Locale, TimelineData> = {
  pt: {
    careerJourney: [
      {
        role: "Software Developer",
        company: "CESS - Computational Energy Saving Solution",
        period: "dezembro de 2022 — presente",
      },
      {
        role: "Analista de Suporte Técnico",
        company: "Companytec Automação e Controle Ltda",
        period: "outubro de 2019 — março de 2022",
      },
      {
        role: "Técnico em eletrônica",
        company: "Companytec Automação e Controle Ltda",
        period: "outubro de 2014 — outubro de 2019",
      },
      {
        role: "Técnico em eletrônica",
        company: "Argus Agro Industrial Ltda.",
        period: "março de 2012 — abril de 2014",
      },
    ],
    education: [
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Pós-graduação Lato Sensu, Inteligência Artificial e Machine Learning",
        period: "maio de 2026 — maio de 2027",
      },
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Curso Superior de Tecnologia (CST), Análise de Sistemas de Computação",
        period: "dezembro de 2022 — dezembro de 2024",
      },
      {
        institution: "IFSUL - Instituto Federal Sul-rio-grandense",
        degree: "Curso Técnico Integrado, Eletrônica",
        period: "julho de 2007 — novembro de 2011",
      },
    ],
  },
  es: {
    careerJourney: [
      {
        role: "Software Developer",
        company: "CESS - Computational Energy Saving Solution",
        period: "diciembre de 2022 — presente",
      },
      {
        role: "Analista de Soporte Técnico",
        company: "Companytec Automação e Controle Ltda",
        period: "octubre de 2019 — marzo de 2022",
      },
      {
        role: "Técnico en electrónica",
        company: "Companytec Automação e Controle Ltda",
        period: "octubre de 2014 — octubre de 2019",
      },
      {
        role: "Técnico en electrónica",
        company: "Argus Agro Industrial Ltda.",
        period: "marzo de 2012 — abril de 2014",
      },
    ],
    education: [
      {
        institution: "Universidade Católica de Pelotas",
        degree: "Posgrado Lato Sensu, Inteligencia Artificial y Machine Learning",
        period: "mayo de 2026 — mayo de 2027",
      },
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Curso Superior de Tecnología (CST), Análisis de Sistemas de Computación",
        period: "diciembre de 2022 — diciembre de 2024",
      },
      {
        institution: "IFSUL - Instituto Federal Sul-rio-grandense",
        degree: "Curso Técnico Integrado, Electrónica",
        period: "julio de 2007 — noviembre de 2011",
      },
    ],
  },
  en: {
    careerJourney: [
      {
        role: "Software Developer",
        company: "CESS - Computational Energy Saving Solution",
        period: "December 2022 — present",
      },
      {
        role: "Technical Support Analyst",
        company: "Companytec Automação e Controle Ltda",
        period: "October 2019 — March 2022",
      },
      {
        role: "Electronics Technician",
        company: "Companytec Automação e Controle Ltda",
        period: "October 2014 — October 2019",
      },
      {
        role: "Electronics Technician",
        company: "Argus Agro Industrial Ltda.",
        period: "March 2012 — April 2014",
      },
    ],
    education: [
      {
        institution: "Universidade Católica de Pelotas",
        degree:
          "Lato Sensu Postgraduate, Artificial Intelligence and Machine Learning",
        period: "May 2026 — May 2027",
      },
      {
        institution: "Universidade Católica de Pelotas",
        degree: "Higher Technology Course (CST), Computer Systems Analysis",
        period: "December 2022 — December 2024",
      },
      {
        institution: "IFSUL - Instituto Federal Sul-rio-grandense",
        degree: "Integrated Technical Course, Electronics",
        period: "July 2007 — November 2011",
      },
    ],
  },
};

export function getTimeline(locale: Locale): TimelineData {
  return timeline[locale];
}
