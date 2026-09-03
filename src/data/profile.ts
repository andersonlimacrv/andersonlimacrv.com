import { site } from './site';
import type { Locale } from '../i18n/ui';
import { defaultLocale } from '../i18n/ui';

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

// Fonte trilíngue — фактов traduzidos por locale (espelha timeline.ts).
// hero.mainStack é técnico e idêntico nos 3; hero.title/location e about são localizados.
export const profile: Record<Locale, Profile> = {
  pt: {
    hero: {
      name: site.name,
      title: 'Engenheiro de Software · Empreendedor · Arquiteto de Soluções',
      mainStack: 'Python · TypeScript · C/C++ · ESP32 · SQL/NoSQL · CI/CD · IA',
      location: 'Pelotas, Rio Grande do Sul, Brasil',
    },
    about: [
      {
        label: 'Focus',
        value: 'Soluções end-to-end integrando IoT, sistemas distribuídos e IA aplicada.',
      },
      {
        label: 'Experience',
        value:
          '14+ anos de experiência em empresas de tecnologia, entre hardware/eletrônica e desenvolvimento full stack.',
      },
      {
        label: 'Superpower',
        value: 'Transformar problemas complexos em soluções simples, escaláveis e sustentáveis',
      },
      {
        label: 'Expertise',
        value: 'Backend · Frontend · Fullstack · Cloud & DevOps · IA & Automação',
      },
    ],
  },
  en: {
    hero: {
      name: site.name,
      title: 'Software Engineer · Entrepreneur · Solutions Architect',
      mainStack: 'Python · TypeScript · C/C++ · ESP32 · SQL/NoSQL · CI/CD · IA',
      location: 'Pelotas, Rio Grande do Sul, Brazil',
    },
    about: [
      {
        label: 'Focus',
        value: 'End-to-end solutions integrating IoT, distributed systems and applied AI.',
      },
      {
        label: 'Experience',
        value:
          '14+ years of experience in technology companies, spanning hardware/electronics and full stack development.',
      },
      {
        label: 'Superpower',
        value: 'Turning complex problems into simple, scalable and sustainable solutions',
      },
      {
        label: 'Expertise',
        value: 'Backend · Frontend · Fullstack · Cloud & DevOps · AI & Automation',
      },
    ],
  },
  es: {
    hero: {
      name: site.name,
      title: 'Ingeniero de Software · Emprendedor · Arquitecto de Soluciones',
      mainStack: 'Python · TypeScript · C/C++ · ESP32 · SQL/NoSQL · CI/CD · IA',
      location: 'Pelotas, Rio Grande do Sul, Brasil',
    },
    about: [
      {
        label: 'Focus',
        value: 'Soluciones end-to-end integrando IoT, sistemas distribuidos e IA aplicada.',
      },
      {
        label: 'Experience',
        value:
          '14+ años de experiencia en empresas de tecnología, entre hardware/electrónica y desarrollo full stack.',
      },
      {
        label: 'Superpower',
        value: 'Transformar problemas complejos en soluciones simples, escalables y sostenibles',
      },
      {
        label: 'Expertise',
        value: 'Backend · Frontend · Fullstack · Cloud & DevOps · IA y Automatización',
      },
    ],
  },
};

export function getProfile(locale: Locale): Profile {
  return profile[locale] ?? profile[defaultLocale];
}

// Compat: código legado que importa `profile` direto espera o pt.
export const profilePt = profile.pt;
