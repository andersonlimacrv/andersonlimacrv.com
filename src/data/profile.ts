import { site } from './site';

export interface ProfileHero {
  name: string;
  title: string;
  mainStack: string;
  bio: string;
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
    title: "Engenheiro de Software · Enterpreneur · Arquiteto de Soluções",
    mainStack: "Python · TypeScript · C/C++ · ESP32 · React",
    bio: "Minha carreira começou no hardware. Hoje atuo projetando e desenvolvendo soluções end-to-end, integrando firmware, backend, frontend, cloud e infraestrutura, atuando em todo o ciclo de desenvolvimento, da arquitetura à operação em produção. Acredito que o papel da engenharia de software é transformar problemas complexos em soluções simples, escaláveis e sustentáveis.",
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
        "Soluções end-to-end integrando IoT, sistemas distribuídos e aplicações orientadas por IA.",
    },
    {
      label: "Stack",
      value:
        "Python, FastAPI, Django, Node.js, React, Next.js, TypeScript, Tailwind CSS, C++, ESP32, MQTT, PostgreSQL, Docker, AWS.",
    },
    {
      label: "Experience",
      value:
        "6+ anos de experiência, com origem em hardware/eletrônica antes de migrar para desenvolvimento full stack.",
    },
    {
      label: "Superpower",
      value:
        "Transformar problemas complexos em soluções simples, escaláveis e sustentáveis, do design de arquitetura até a operação em produção.",
    },
    {
      label: "Teaching",
      value: "",
    },
    { label: "Location", value: "Pelotas, Rio Grande do Sul, Brasil." },
  ],
};
