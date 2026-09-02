import { site } from './site';

export interface ProfileHero {
  name: string;
  title: string;
  mainStack: string;
  location: string;
}

export interface AboutItem {
  label: string;
  value: string;
}

export interface Profile {
  hero: ProfileHero;
  about: AboutItem[];
}

// Fonte única do perfil (fatos em pt) — extraído de add-data.json.
// A trajetória (careerJourney/experienceDetails/education) vive em
// src/data/timeline.ts, localizada por idioma.
export const profile: Profile = {
  hero: {
    name: site.name,
    title: "Engenheiro de Software · Empreendedor · Arquiteto de Soluções",
    mainStack: "Python · TypeScript · C/C++ · ESP32 · SQL/ NoSQL · CI/CD · Cloud · IA",
    location: "Pelotas, Rio Grande do Sul, Brasil",
  },
  about: [
    {
      label: "Role",
      value: "Full Stack Developer.",
    },
    {
      label: "Focus",
      value:
        "Soluções end-to-end integrando IoT, sistemas distribuídos e IA aplicada.",
    },
    {
      label: "Experience",
      value:
        "14+ anos de experiência em empresas de tecnologia, entre hardware/eletrônica e desenvolvimento full stack.",
    },
    {
      label: "Superpower",
      value:
        "Transformar problemas complexos em soluções simples, escaláveis e sustentáveis",
    },
    {
      label: "Expertise",
      value: "Backend · Frontend · Fullstack · Cloud & DevOps · IA & Automação",
    },
    { label: "Location", value: "Pelotas, Rio Grande do Sul, Brasil." },
  ],
};
